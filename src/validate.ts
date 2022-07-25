import { Node } from './types';

function isEmpty(str: string): boolean {
  return /^[\s\t\n\r]*$/.test(str);
}

function switchBranchHasContent(node: Node): boolean {
  for (const child of node.children) {
    const isComment = child.type === 'comment';
    const isEmptyText = child.type === 'text' && isEmpty(child.value);

    if (!isComment && !isEmptyText) {
      return true;
    }
  }
  return false;
}

function hasAtMostOneDefaultBranch(node: Node): boolean {
  return node.branches.filter((child) => child.name === 'default').length <= 1;
}

function hasAtLeastOneCaseBranch(node: Node): boolean {
  return node.branches.filter((child) => child.name === 'case').length >= 1;
}

export function validateSyntax(node: Node): void {
  const allowedTypes = ['svelteBranch'];
  const allowedTags = ['switch', 'case', 'default'];
  const throwError = (details: string = '') => {
    throw new SyntaxError(`Invalid switch syntax. ${details}`);
  };
  const branchesErrorMessage = `Switch must only contain {:case} and {:default} branches.`;

  for (const child of node.branches) {
    if (
      !allowedTypes.includes(child.type) ||
      !allowedTags.includes(child.name)
    ) {
      throwError(branchesErrorMessage);
    }
    const tag = child.name;

    const isValidSwitchBranch = !switchBranchHasContent(child);
    if (tag === 'switch' && !isValidSwitchBranch) {
      throwError(branchesErrorMessage);
    }

    const hasExpression = child.expression?.value?.length;
    if (tag === 'default' && hasExpression) {
      throwError(`{:default} branch can't have any argument.`);
    }
    if (tag === 'case' && !hasExpression) {
      throwError(`{:case <expression>} needs an expression.`);
    }
  }

  if (!hasAtMostOneDefaultBranch(node)) {
    throwError(`Switch can't contain more than one {:default} branch.`);
  }
  if (!hasAtLeastOneCaseBranch(node)) {
    throwError('Switch needs at least one {:case} branch.');
  }
}
