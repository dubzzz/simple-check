import fc from '../../../lib/fast-check';
import { lorem, LoremConstraints } from '../../../src/arbitrary/lorem';
import { convertToNext } from '../../../src/check/arbitrary/definition/Converters';
import {
  assertGenerateProducesCorrectValues,
  assertGenerateProducesSameValueGivenSameSeed,
  assertGenerateProducesValuesFlaggedAsCanGenerate,
  assertShrinkProducesCorrectValues,
  assertShrinkProducesSameValueWithoutInitialContext,
  assertShrinkProducesValuesFlaggedAsCanGenerate,
} from '../check/arbitrary/generic/NextArbitraryAssertions';

describe('lorem', () => {
  it('should reject any negative or zero maxCount whatever the mode', () =>
    fc.assert(
      fc.property(
        fc.integer({ max: 0 }),
        fc.constantFrom(...([undefined, 'words', 'sentences'] as const)),
        (maxCount, mode) => {
          // Arrange / Act / Assert
          expect(() => lorem({ maxCount, mode })).toThrowError();
        }
      )
    ));
});

describe('lorem (integration)', () => {
  type Extra = LoremConstraints;
  const extraParameters: fc.Arbitrary<Extra> = fc.record(
    {
      maxCount: fc.integer({ min: 1, max: 100 }),
      mode: fc.constantFrom(...(['words', 'sentences'] as const)),
    },
    { requiredKeys: [] }
  );

  const isCorrect = (value: string, extra: Extra) => {
    const maxCount = extra.maxCount !== undefined ? extra.maxCount : 5;
    switch (extra.mode) {
      case 'sentences': {
        expect(value).toContain('.');
        expect(value[value.length - 1]).toEqual('.');
        const sentences = value
          // we remove the trailing dot at the end of the generated string
          .substr(0, value.length - 1)
          .split('.')
          // we remove the leading space for sentences with index greater than 0
          .map((s, i) => (i === 0 ? s : s.substring(1)));
        for (const s of sentences) {
          expect(s).not.toEqual('');
          expect(s).toMatch(/^[A-Z](, | )?([a-z]+(, | )?)*$/);
        }
        expect(sentences.length).toBeGreaterThanOrEqual(1);
        expect(sentences.length).toBeLessThanOrEqual(maxCount);
        break;
      }
      case 'words':
      default:
        expect(value).not.toContain('.');
        expect(value).not.toContain(',');
        expect(value.split(' ').length).toBeGreaterThanOrEqual(1);
        expect(value.split(' ').length).toBeLessThanOrEqual(maxCount);
        break;
    }
  };

  const loremBuilder = (extra: Extra) => convertToNext(lorem(extra));

  it('should generate the same values given the same seed', () => {
    assertGenerateProducesSameValueGivenSameSeed(loremBuilder, { extraParameters });
  });

  it('should only generate correct values', () => {
    assertGenerateProducesCorrectValues(loremBuilder, isCorrect, { extraParameters });
  });

  it('should recognize values that would have been generated using it during generate', () => {
    assertGenerateProducesValuesFlaggedAsCanGenerate(loremBuilder, { extraParameters });
  });

  it('should shrink towards the same values given the same seed', () => {
    assertGenerateProducesSameValueGivenSameSeed(loremBuilder, { extraParameters });
  });

  it('should be able to shrink without any context', () => {
    assertShrinkProducesSameValueWithoutInitialContext(loremBuilder, { extraParameters });
  });

  it('should only shrink towards correct values', () => {
    assertShrinkProducesCorrectValues(loremBuilder, isCorrect, { extraParameters });
  });

  it('should recognize values that would have been generated using it during shrink', () => {
    assertShrinkProducesValuesFlaggedAsCanGenerate(loremBuilder, { extraParameters });
  });
});
