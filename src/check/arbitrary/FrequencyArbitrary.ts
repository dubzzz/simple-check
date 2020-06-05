import { Random } from '../../random/generator/Random';
import { Arbitrary } from './definition/Arbitrary';
import { Shrinkable } from './definition/Shrinkable';

export interface WeightedArbitrary<T> {
  weight: number;
  arbitrary: Arbitrary<T>;
}

/** @hidden */
class FrequencyArbitrary<T> extends Arbitrary<T> {
  readonly summedWarbs: WeightedArbitrary<T>[];
  readonly totalWeight: number;
  constructor(readonly warbs: WeightedArbitrary<T>[]) {
    super();
    let currentWeight = 0;
    this.summedWarbs = [];
    for (let idx = 0; idx !== warbs.length; ++idx) {
      currentWeight += warbs[idx].weight;
      this.summedWarbs.push({ weight: currentWeight, arbitrary: warbs[idx].arbitrary });
    }
    this.totalWeight = currentWeight;
  }
  generate(mrng: Random): Shrinkable<T> {
    const selected = mrng.nextInt(0, this.totalWeight - 1);
    for (let idx = 0; idx !== this.summedWarbs.length; ++idx) {
      if (selected < this.summedWarbs[idx].weight) return this.summedWarbs[idx].arbitrary.generate(mrng);
    }
    throw new Error(`Unable to generate from fc.frequency`);
  }
  withBias(freq: number) {
    return new FrequencyArbitrary(this.warbs.map((v) => ({ weight: v.weight, arbitrary: v.arbitrary.withBias(freq) })));
  }
}

/**
 * Infer the type of the Arbitrary produced by oneof
 * given the type of the source arbitraries
 */
type FrequencyArbitraryType<Ts extends WeightedArbitrary<unknown>[]> = {
  [K in keyof Ts]: Ts[K] extends WeightedArbitrary<infer U> ? U : never;
}[number];

/**
 * For one of the values generated by `...warbs` - the probability of selecting the ith warb is of `warb[i].weight / sum(warb[j].weight)`
 *
 * **WARNING**: It expects at least one (Arbitrary, weight)
 *
 * @param warbs (Arbitrary, weight)s that might be called to produce a value
 */
function frequency<Ts extends WeightedArbitrary<unknown>[]>(...warbs: Ts): Arbitrary<FrequencyArbitraryType<Ts>> {
  if (warbs.length === 0) {
    throw new Error('fc.frequency expects at least one parameter');
  }
  return new FrequencyArbitrary<FrequencyArbitraryType<Ts>>([...warbs] as WeightedArbitrary<
    FrequencyArbitraryType<Ts>
  >[]);
}

export { frequency };
