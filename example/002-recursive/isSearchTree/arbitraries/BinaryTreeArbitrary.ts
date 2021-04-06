import fc from 'fast-check';
import { Tree } from '../src/isSearchTree';

export const binaryTreeWithMaxDepth = (maxDepth: number): fc.Arbitrary<Tree<number>> => {
  const { tree } = fc.letrec((tie) => ({
    leaf: fc.record({
      value: fc.integer(),
      left: fc.constant(null),
      right: fc.constant(null),
    }),
    node: fc.record({ value: fc.integer(), left: tie('tree'), right: tie('tree') }),
    tree: fc.oneof({ maxDepth }, tie('leaf'), tie('node')),
  }));
  return tree as fc.Arbitrary<Tree<number>>;
};

export const binaryTreeWithoutMaxDepth = (): fc.Arbitrary<Tree<number>> => {
  const { tree } = fc.letrec<{
    leaf: Tree<number>;
    node: Tree<number>;
    tree: Tree<number>;
  }>((tie) => ({
    leaf: fc.record({
      value: fc.integer(),
      left: fc.constant(null),
      right: fc.constant(null),
    }),
    node: fc.record({ value: fc.integer(), left: tie('tree'), right: tie('tree') }),
    tree: fc.oneof({ depthFactor: 0.5 }, tie('leaf'), tie('node')),
  }));
  return tree as fc.Arbitrary<Tree<number>>;
};

// Alternative solutions
// Prefer one of the implementation above.

export const binaryTreeWithMaxDepthMemoBased = (maxDepth: number): fc.Arbitrary<Tree<number>> => {
  // Prefer letrec implementation: arbitrary is less expensive to build

  const leaf: fc.Arbitrary<Tree<number>> = fc.record({
    value: fc.integer(),
    left: fc.constant(null),
    right: fc.constant(null),
  });

  const node: fc.Memo<Tree<number>> = fc.memo((n) => {
    if (n <= 1) return leaf;
    return fc.record({ value: fc.integer(), left: tree(n - 1), right: tree(n - 1) });
  });

  const tree: fc.Memo<Tree<number>> = fc.memo((n) => fc.oneof(leaf, node(n)));
  return tree(maxDepth);
};

export function binaryTreeWithMaxDepthOldWay(maxDepth: number): fc.Arbitrary<Tree<number>> {
  const valueArbitrary = fc.integer();
  if (maxDepth <= 0) {
    return fc.record({
      value: valueArbitrary,
      left: fc.constant(null),
      right: fc.constant(null),
    });
  }
  const subTree = fc.oneof(fc.constant(null), binaryTreeWithMaxDepthOldWay(maxDepth - 1));
  return fc.record({
    value: valueArbitrary,
    left: subTree,
    right: subTree,
  });
}
