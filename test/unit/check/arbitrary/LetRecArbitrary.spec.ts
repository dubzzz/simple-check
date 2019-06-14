import { LazyArbitrary, letrec } from '../../../../src/check/arbitrary/LetRecArbitrary';
import { Arbitrary } from '../../../../src/check/arbitrary/definition/Arbitrary';
import { Shrinkable } from '../../../../src/check/arbitrary/definition/Shrinkable';
import { Random } from '../../../../src/random/generator/Random';

import * as stubRng from '../../stubs/generators';

describe('LetRecArbitrary', () => {
  describe('letrec', () => {
    it('Should be able to construct independant arbitraries', () => {
      const expectedArb1 = buildArbitrary(jest.fn());
      const expectedArb2 = buildArbitrary(jest.fn());

      const { arb1, arb2 } = letrec(tie => ({
        arb1: expectedArb1,
        arb2: expectedArb2
      }));

      expect(arb1).toBe(expectedArb1);
      expect(arb2).toBe(expectedArb2);
    });
    it('Should not produce LazyArbitrary for no-tie constructs', () => {
      const { arb } = letrec(tie => ({
        arb: buildArbitrary(jest.fn())
      }));
      expect(arb).not.toBeInstanceOf(LazyArbitrary);
    });
    it('Should not produce LazyArbitrary for indirect tie constructs', () => {
      const { arb } = letrec(tie => ({
        // arb is an arbitrary wrapping the tie value (as fc.array)
        arb: buildArbitrary(mrng => tie('arb').generate(mrng))
      }));
      expect(arb).not.toBeInstanceOf(LazyArbitrary);
    });
    it('Should produce LazyArbitrary for direct tie constructs', () => {
      const { arb } = letrec(tie => ({
        arb: tie('arb')
      }));
      expect(arb).toBeInstanceOf(LazyArbitrary);
    });
    it('Should be able to construct mutually recursive arbitraries', () => {
      const { arb1, arb2 } = letrec(tie => ({
        arb1: tie('arb2'),
        arb2: tie('arb1')
      }));
      expect(arb1).toBeDefined();
      expect(arb2).toBeDefined();
    });
    it('Should apply tie correctly', () => {
      const expectedArb = buildArbitrary(jest.fn());
      const { arb1, arb2, arb3 } = letrec(tie => ({
        arb1: tie('arb2'),
        arb2: tie('arb3'),
        arb3: expectedArb
      }));

      expect(arb1).toBeInstanceOf(LazyArbitrary);
      expect(arb2).toBeInstanceOf(LazyArbitrary);
      expect(arb3).not.toBeInstanceOf(LazyArbitrary);

      expect((arb1 as any).underlying).toBe(arb2);
      expect((arb2 as any).underlying).toBe(arb3);
      expect(arb3).toBe(expectedArb);
    });
  });
  describe('LazyArbitrary', () => {
    it('Should fail to generate when no underlying arbitrary', () => {
      const mrng = stubRng.mutable.nocall();
      const lazy = new LazyArbitrary('id007');
      expect(() => lazy.generate(mrng)).toThrowErrorMatchingSnapshot();
    });
    it('Should fail to bias when no underlying arbitrary', () => {
      const lazy = new LazyArbitrary('id008');
      expect(() => lazy.withBias(2)).toThrowErrorMatchingSnapshot();
    });
    it('Should call generate method of underlying on generate', () => {
      const mrng = stubRng.mutable.nocall();
      const lazy = new LazyArbitrary('id008');
      const expectedGen = Symbol();
      const generateMock = jest.fn();
      generateMock.mockReturnValue(expectedGen);
      lazy.underlying = buildArbitrary(generateMock);

      const g = lazy.generate(mrng);
      expect(g).toBe(expectedGen);
      expect(generateMock).toHaveBeenCalledTimes(1);
    });
    it('Should be able to bias to the biased value of underlying', () => {
      const lazy = new LazyArbitrary('id008');
      const noCallMock = jest.fn();
      const biasedArb = buildArbitrary(noCallMock);
      const arb = buildArbitrary(noCallMock, () => biasedArb);
      lazy.underlying = arb;

      const biasedLazy = lazy.withBias(2);
      expect(biasedLazy).toBe(biasedArb);
      expect(noCallMock).not.toHaveBeenCalled();
    });
    it('Should be able to bias recursive arbitraries', () => {
      const lazy = new LazyArbitrary('id008');
      const noCallMock = jest.fn();
      lazy.underlying = buildArbitrary(noCallMock, () => lazy);

      const biasedLazy = lazy.withBias(2);
      expect(biasedLazy).toBe(lazy);
      expect(noCallMock).not.toHaveBeenCalled();
    });
  });
});

const buildArbitrary = (generate: (mrng: Random) => Shrinkable<any>, withBias?: (n: number) => Arbitrary<any>) => {
  return new (class extends Arbitrary<any> {
    generate = generate;
    withBias = (n: number): Arbitrary<any> => (withBias ? withBias(n) : this);
  })();
};
