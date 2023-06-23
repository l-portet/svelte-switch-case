import { parse } from 'svelte-parse';
import MagicString, { SourceMap } from 'magic-string';

import { validateSyntax } from './validate';
import pkg from '../package.json';

import type {
  Injection,
  Node,
  Position,
  Preprocessor,
  PreprocessorOptions,
  PreprocessorOutput,
} from './types';

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

function buildConditions(expression: string, rawValue: string): string {
  const sep = '||';
  const values = rawValue.split(sep);
  const conditions = [];

  for (const value of values) {
    conditions.push(`${expression} === ${value}`);
  }
  return conditions.join(` ${sep} `);
}

function getInjectionValue(
  type: string,
  expression: string,
  value: string
): string {
  const comment = `<!-- Injected by svelte-switch-case -->`;
  switch (type) {
    case '_open_':
      return `${comment}\n{#if ${buildConditions(expression, value)}}`;
    case 'case':
      return `{:else if ${buildConditions(expression, value)}}`;
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
  const output: MagicString = new MagicString(code, { filename });
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
    output.overwrite(start, end, value);
  }

  const map: SourceMap = output.generateMap();
  return { code: output.toString(), map };
}

export default function preprocess(): Preprocessor {
  return {
    name: pkg.name,
    markup: processMarkup,
  };
}
