import { parse } from 'svelte-parse';
import {
  Injection,
  Node,
  Position,
  PreprocessorOptions,
  PreprocessorOutput,
} from './types';
import { validateSyntax } from './validate';
import MagicString, { SourceMap } from 'magic-string';

function walk(node: Node, callbacks: { [key: string]: Function }) {
  const children = node.children || node.branches;
  const callback = callbacks[node.type];

  if (children) {
    for (const child of children) {
      walk(child, callbacks);
    }
  }
  if (typeof callback === 'function') {
    callback(node);
  }
  return node;
}

function getInjectionValue(
  type: string,
  expression: string,
  value: string
): string {
  const comment = `<!-- Injected by svelte-switch-case -->`;
  switch (type) {
    case '_open_':
      return `${comment}\n{#if ${expression} === ${value}}`;
    case 'case':
      return `{:else if ${expression} === ${value}}`;
    case 'default':
      return `{:else}`;
    case '_close_':
      return `{/if}`;
  }
  return '';
}

function getInjectionPosition(
  block: Node,
  switchBranch: Node,
  branch: Node,
  type: string
): Position {
  let firstChild;

  if (branch?.children) {
    [firstChild] = branch.children;
  }

  switch (type) {
    case '_open_':
      return {
        start: switchBranch.position.start.offset,
        end: firstChild
          ? firstChild.position.start.offset
          : branch.position.end.offset,
      };
    case 'case':
      return {
        start: branch.position.start.offset,
        end: firstChild
          ? firstChild.position.start.offset
          : branch.position.end.offset,
      };
    case 'default':
      return {
        start: branch.position.start.offset,
        end: firstChild
          ? firstChild.position.start.offset
          : branch.position.end.offset,
      };
    case '_close_':
      return {
        start: branch.position.end.offset,
        end: block.position.end.offset,
      };
  }
  return { start: -1, end: -1 };
}

function buildInjection(
  block: Node,
  switchBranch: Node,
  branch: Node,
  customType: string | null = null
): Injection {
  const type = (customType || branch?.name) as string;
  const expression = switchBranch.expression.value;
  const value = branch?.expression?.value;

  return {
    value: getInjectionValue(type, expression, value),
    ...getInjectionPosition(block, switchBranch, branch, type),
  };
}

function processMarkup({
  content: code,
  filename,
}: PreprocessorOptions): PreprocessorOutput {
  const tree = parse({ value: code, generatePositions: true }) as Node;

  let output = code;
  const injections: Injection[] = [];

  walk(tree, {
    svelteBranchingBlock(node: Node) {
      if (node.name !== 'switch') {
        return;
      }
      validateSyntax(node);
      const [switchBranch, firstCaseBranch, ...branches] = node.branches;
      const lastCaseBranch = branches[branches.length - 1] || firstCaseBranch;

      // Push default at the end so we can transform it to {:else}
      branches.sort((branchA: Node, branchB: Node) => {
        if (branchB.name === 'default') {
          return -1;
        }
        return 0;
      });

      injections.push(
        buildInjection(node, switchBranch, firstCaseBranch, '_open_'),
        ...branches.map((branch: Node) =>
          buildInjection(node, switchBranch, branch)
        ),
        buildInjection(node, switchBranch, lastCaseBranch, '_close_')
      );
    },
  });

  // Ensure we can handle several nested switch
  injections.sort((injectionA: Injection, injectionB: Injection) => {
    if (injectionA.start > injectionB.start) {
      return 1;
    } else if (injectionB.start > injectionA.start) {
      return -1;
    }
    return 0;
  });

  for (const { value, start, end } of injections.reverse()) {
    output = output.slice(0, start) + value + output.slice(end);
  }

  const map: SourceMap = new MagicString(output, { filename }).generateMap();
  return { code: output, map };
}

export default function preprocess(): { markup: Function } {
  return {
    markup: processMarkup,
  };
}
