# [:house:](../README.md) Arbitraries

Property based testing frameworks rely on two main building blocks:
- [Runners](./Runners.md) — _they are responsible for running, executing and checking that properties stay true whatever the generated value_
- Arbitraries — _they are responsible for the random *but deterministic* generation of values, they may also offer shrinking capabilities_

This documentation lists all the built-in arbitraries provided by `fast-check`. Please note that you can still create your own ones by either [combining them together](#combinators) or by [building it from scratch](./AdvancedArbitraries.md#build-your-own). You can refer also to the [API Reference](https://dubzzz.github.io/fast-check/) for more details.

In a nutshell, when defining your tests and properties you will have to combine both the [Runners](./Runners.md) and Arbitraries as follows:

```js
fc.assert( // run the property several times (in other words execute the test)
  fc.property( // define the property: arbitrary and what should be observed (predicate)
    arb1, arb2, ..., // 1 to +infinity arbitraries
    (valueGeneratedByArb1, valueGeneratedByArb2, ...) => { // predicate receives generated values
      // In case of success: No return, 'return undefined' or 'return true'
      // In case of failure: Throw or 'return false'
    }
  )
)

// Example:
fc.assert(
  fc.property(
    fc.string(), fc.string(), fc.string(),
    (a, b, c) => isSubstring(b, a + b + c),
  )
)
```

## Table of contents

- [Boolean](#boolean)
- [Numeric](#numeric)
  - [Integer](#integer)
  - [Floating point](#floating-point)
  - [BigInt](#bigint)
- [String](#string)
  - [Single character](#single-character)
  - [Multiple characters](#multiple-characters)
  - [More specific strings](#more-specific-strings)
- [Date](#date)
- [Typed Array](#typed-array)
- [Combinators](#combinators)
  - [Simple](#simple)
  - [Array](#array)
  - [Object](#object)
  - [Function](#function)
  - [Recursive structures](#recursive-structures)
  - [More](#more)
- [Others](#others)
- [Going further?](#going-further)

## Boolean

<details>
<summary><b>boolean</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#boolean">api</a>]</summary><br/>

*&#8195;Description*

> Boolean values, either `true` or `false`

*&#8195;Signatures*

- `fc.boolean()`

*&#8195;Usages*

```js
fc.boolean()
// Examples of generated values: true, false…
```
</details>

## Numeric

### Integer

<details>
<summary><b>integer</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#integer">api</a>]</summary><br/>

*&#8195;Description*

> Signed integer values
>
> Generate any possible integer in the specified range.
> Both the lower bound and upper bound of the range are included in the set of possible values.

*&#8195;Signatures*

- `fc.integer()`
- `fc.integer({min?, max?})`
- `fc.integer(min, max)`
- _`fc.integer(max)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `min?` — default: `-2147483648` — _lower bound of the range (included)_
- `max?` — default: `2147483647` — _upper bound of the range (included)_

*&#8195;Usages*

```js
fc.integer()
// Note: All possible integers between `-2147483648` (included) and `2147483647` (included)
// Examples of generated values: 1502944448, 888414599, 1123740386, -440217435, 19…

fc.integer(1000)
// Note: All possible integers between `-2147483648` (included) and `1000` (included)
// Examples of generated values: -1057705109, -8, -1089721660, -1878447823, -741474720…

fc.integer(-99, 99)
// Note: All possible integers between `-99` (included) and `99` (included)
// Examples of generated values: 6, -1, -96, 91, 5…

fc.integer({min: -99, max: 99})
// Note: All possible integers between `-99` (included) and `99` (included)
// Examples of generated values: 6, 98, 8, 5, 0…

fc.integer({min: 65536})
// Note: All possible integers between `65536` (included) and `2147483647` (included)
// Examples of generated values: 65552, 2147483636, 65548, 1836480947, 1490866554…
```
</details>

<details>
<summary><b>nat</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#nat">api</a>]</summary><br/>

*&#8195;Description*

> Positive integer values (including zero)
>
> Generate any possible positive integer between zero and the upper bound.
> Both zero and the upper bound are included in the set of possible values.

*&#8195;Signatures*

- `fc.nat()`
- `fc.nat({max?})`
- `fc.nat(max)`

*&#8195;with:*

- `max?` — default: `2147483647` — _upper bound of the range (included)_

*&#8195;Usages*

```js
fc.nat()
// Note: All possible integers between `0` (included) and `2147483647` (included)
// Examples of generated values: 2147483640, 1747563639, 2, 2075457316, 2146229148…

fc.nat(1000)
// Note: All possible integers between `0` (included) and `1000` (included)
// Examples of generated values: 299, 997, 225, 750, 4…

fc.nat({max: 1000})
// Note: All possible integers between `0` (included) and `1000` (included)
// Examples of generated values: 0, 833, 995, 496, 1…
```
</details>

<details>
<summary><b>maxSafeInteger</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#maxsafeinteger">api</a>]</summary><br/>

*&#8195;Description*

> All the range of signed integer values
>
> Generate any possible integer ie. from `Number.MIN_SAFE_INTEGER` (included) to `Number.MAX_SAFE_INTEGER` (included).

*&#8195;Signatures*

- `fc.maxSafeInteger()`

*&#8195;Usages*

```js
fc.maxSafeInteger()
// Examples of generated values: -44, 7332126275469769, 32, -8631085038818688, 417563055004249…
```
</details>

<details>
<summary><b>maxSafeNat</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#maxsafenat">api</a>]</summary><br/>

*&#8195;Description*

> All the range of positive integer values (including zero)
>
> Generate any possible positive integer ie. from `0` (included) to `Number.MAX_SAFE_INTEGER` (included).

*&#8195;Signatures*

- `fc.maxSafeNat()`

*&#8195;Usages*

```js
fc.maxSafeNat()
// Examples of generated values: 9007199254740981, 5859827138257099, 41, 5028419509524314, 9007199254740974…
```
</details>

### Floating point

<details>
<summary><b>float</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#float">api</a>]</summary><br/>

*&#8195;Description*

> Floating point values with 32-bit precision
>
> Generate any floating point value taken into the specified range.
> The lower bound is included into the range of possible values while the upper one is not.
>
> Next version: Always generate valid 32-bit floating point values.

*&#8195;Signatures*

- `fc.float()`
- `fc.float({next: true, min?, max?, noDefaultInfinity?, noNaN?})`
- `fc.float({next?: false, min?, max?})`
- `fc.float(min, max)`
- _`fc.float(max)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

*When `next` is `true`...*

- `next` — _use the new version of float_
- `min?` — default: `-∞` and `-3.4028234663852886e+38` when `noDefaultInfinity:true` — _lower bound for the generated 32-bit floats (included)_
- `max?` — default: `+∞` and `+3.4028234663852886e+38` when `noDefaultInfinity:true` — _upper bound for the generated 32-bit floats (included)_
- `noDefaultInfinity?` — default: `false` — _use finite values for `min` and `max` by default_
- `noNaN?` — default: `false` — _do not generate `Number.NaN`_

*Otherwise...*

- `min?` — default: `0.0` — _lower bound of the range (included)_
- `max?` — default: `1.0` — _upper bound of the range (excluded)_

*&#8195;Usages*

```js
// New behaviour...

fc.float({next: true})
// Note: All possible 32-bit floating point values (including -∞, +∞ and NaN but also -0)
// Examples of generated values: -4.979507809409578e+32, -1.6702151959801674e+28, 1.9627621397599177e+28, 350.84765625, 3.363116314379561e-44…

fc.float({next: true, min: 0})
// Note: All possible positive 32-bit floating point values (including +∞ and NaN)
// Examples of generated values: 2.802596928649634e-45, 2.1029948291590276e+24, 9.80908925027372e-45, 2.2572006841955642e+36, 2.1019476964872256e-44…

fc.float({next: true, noDefaultInfinity: true, noNaN: true})
// Note: All possible finite 32-bit floating point values
// Examples of generated values: 4.0637655465419695e-44, 1.4038274882832713e-11, -2.8106043967884853e-14, -2.2420775429197073e-44, 3.053702712160785e+32…

fc.float({next: true, noDefaultInfinity: true, min: Number.NEGATIVE_INTEGER, max: Number.POSITIVE_INTEGER})
// Note: Same as fc.float({next: true}), noDefaultInfinity just tells that defaults for min and max
// should not be set to -∞ and +∞. It does not forbid the user to explicitely set them to -∞ and +∞.
// Examples of generated values: -3.4028222494407124e+38, -5.1506072030609065e-26, -3.4028190042551758e+38, 3.4028183957828877e+38, 2.382207389352189e-44…

// Legacy mode...

fc.float()
// Note: All possible 32-bit floating point values between `0.0` (included) and `1.0` (excluded)
// Examples of generated values: 0.8121654987335205, 0.2905852794647217, 0.5317489504814148, 0.8747345805168152, 0.2262873649597168…

fc.float({max: 100})
// Note: All possible 32-bit floating point values between `0.0` (included) and `100.0` (excluded)
// Examples of generated values: 0.00007748603820800781, 99.99992251396179, 60.498785972595215, 99.99995827674866, 24.220764636993408…

fc.float({min: -100, max: 100})
// Note: All possible 32-bit floating point values between `-100.0` (included) and `100.0` (excluded)
// Examples of generated values: 99.99995231628418, -99.9998927116394, 81.314218044281, -100, -99.99988079071045…
```
</details>

<details>
<summary><b>double</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#double">api</a>]</summary><br/>

*&#8195;Description*

> Floating point values
>
> Generate any floating point value taken into the specified range.
> The lower bound is included into the range of possible values while the upper one is not.

*&#8195;Signatures*

- `fc.double()`
- `fc.double({next: true, min?, max?, noDefaultInfinity?, noNaN?})`
- `fc.double({min?, max?})`
- `fc.double(min, max)`
- _`fc.double(max)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

*When `next` is `true`...*

- `next` — _use the new version of float_
- `min?` — default: `-∞` and `-Number.MAX_VALUE` when `noDefaultInfinity:true` — _lower bound for the generated 32-bit floats (included)_
- `max?` — default: `+∞` and `Number.MAX_VALUE` when `noDefaultInfinity:true` — _upper bound for the generated 32-bit floats (included)_
- `noDefaultInfinity?` — default: `false` — _use finite values for `min` and `max` by default_
- `noNaN?` — default: `false` — _do not generate `Number.NaN`_

*Otherwise...*

- `min?` — default: `0.0` — _lower bound of the range (included)_
- `max?` — default: `1.0` — _upper bound of the range (excluded)_

*&#8195;Usages*

```js
// New behaviour...

fc.double({next: true})
// Note: All possible floating point values (including -∞, +∞ and NaN but also -0)
// Examples of generated values: 2.37e-322, 8.585001320826223e-158, -2.5e-323, 5.895761138020238e+302, -3.7859248062812417e-171…

fc.double({next: true, min: 0})
// Note: All possible positive floating point values (including +∞ and NaN)
// Examples of generated values: 1.7976931348623093e+308, 2.8e-322, 3.0427667746799623e-174, 1.2e-322, 1.3e-322…

fc.double({next: true, noDefaultInfinity: true, noNaN: true})
// Note: All possible finite floating point values
// Examples of generated values: 7.708517430762217e-92, 8.177542674298762e-87, 5.4e-323, 1.7976931348623071e+308, 4.3922193704082206e+39…

fc.double({next: true, noDefaultInfinity: true, min: Number.NEGATIVE_INTEGER, max: Number.POSITIVE_INTEGER})
// Note: Same as fc.double({next: true}), noDefaultInfinity just tells that defaults for min and max
// should not be set to -∞ and +∞. It does not forbid the user to explicitely set them to -∞ and +∞.
// Examples of generated values: 1.7976931348623157e+308, -1.7976931348623061e+308, -2.4e-322, 1.14e-322, 1.7976931348623055e+308…

// Legacy mode...

fc.double()
// Note: All possible floating point values between `0.0` (included) and `1.0` (excluded)
// Examples of generated values: 0.3956174850463876, 0.2384091532256838, 0.7450366348797337, 0.4402490407228471, 3.278255483740722e-7…

fc.double({max: 100})
// Note: All possible floating point values between `0.0` (included) and `100.0` (excluded)
// Examples of generated values: 78.93341183662397, 0.000004502756623114834, 98.5225079632713, 10.198144676861675, 99.99998476502925…

fc.double({min: -100, max: 100})
// Note: All possible floating point values between `-100.0` (included) and `100.0` (excluded)
// Examples of generated values: -99.99996125698067, 37.98004388809261, 1.4435261487965079, 99.99994039535542, -99.9999523162838…
```
</details>

### BigInt
_if supported by your JavaScript interpreter_

<details>
<summary><b>bigIntN</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#bigintn">api</a>]</summary><br/>

*&#8195;Description*

> N-bit signed `bigint` values
>
> Generate any possible `bigint` between <code>-2<sup>n-1</sup></code> (included) and <code>2<sup>n-1</sup>-1</code> (included).

*&#8195;Signatures*

- `fc.bigIntN(n)`

*&#8195;with:*

- `n` — _maximal number of bits of the generated `bigint`_

*&#8195;Usages*

```js
fc.bigIntN(2)
// Note: All possible bigint values between `-2n` (included) and `1n` (included)
// Examples of generated values: -1n, -2n, 0n, 1n…

fc.bigIntN(128)
// Note: All possible bigint values between `-(2n**127n)` (included) and `(2n**127n)-1n` (included)
// Examples of generated values:
// • 118965438702305362498464591014723682065n
// • -55529428019749399595111693273573678376n
// • -45882741802961890031345972148576150745n
// • 88162568694395329699188080847279292274n
// • -18663446021429702481819240863645317485n
// • …
```
</details>

<details>
<summary><b>bigInt</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#bigint">api</a>]</summary><br/>

*&#8195;Description*

> Signed `bigint` values
>
> Generate any bigint value taken into the specified range.
> Both lower bound and upper bound are included into the range of possible values.

*&#8195;Signatures*

- `fc.bigInt()`
- `fc.bigInt({min?, max?})`
- `fc.bigInt(min, max)`

*&#8195;with:*

- `min?` — _lower bound of the range (included)_
- `max?` — _upper bound of the range (included)_

*&#8195;Usages*

```js
fc.bigInt()
// Examples of generated values:
// • -55267127471484960134228883170671517601140668833043648279881539595328866477336n
// • -320877373404846693351482506498287829328651053618510591877443861350691412062n
// • 22403846480109971796256164379798253424379083455297331933513006716677124261164n
// • 46531564263119251593570768169779548000260571947054149902092502970846442652567n
// • -27488731055093319143645334041335559432506843454739800192508819981052054802083n
// • …

fc.bigInt({min: 0n, max: 12345678901234567890n})
// Note: All possible bigint values between `0n` (included) and `12345678901234567890n` (included)
// Examples of generated values: 8n, 11376877730870697597n, 1349784798053983117n, 12345678901234567877n, 9n…

fc.bigInt({min: -3000n, max: 100n})
// Note: All possible bigint values between `-3000n` (included) and `100n` (included)
// Examples of generated values: -1169n, -2n, 3n, 0n, -2680n…

fc.bigInt({min: 1n << 64n})
// Note: Any possible bigint value greater or equal to `1n << 64n`
// Examples of generated values:
// • 32214219993684643449722944918025059692370181015953432795318507902966520589940n
// • 39382683564378805230116691834855902707168271164394481253375072148371261997983n
// • 57219012822578120981130257612614965800502300168860147954523587474583795051388n
// • 25423414325897465771981521346031075469986997563517783083160644823268642168363n
// • 18446744073709551637n
// • …
```
</details>

<details>
<summary><b>bigIntN</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#bigintn">api</a>]</summary><br/>

*&#8195;Description*

> N-bit positive `bigint` values (including zero)
>
> Generate any possible positive `bigint` between <code>0</code> (included) and <code>2<sup>n</sup>-1</code> (included).

*&#8195;Signatures*

- `fc.bigUintN(n)`

*&#8195;with:*

- `n` — _maximal number of bits of the generated `bigint`_

*&#8195;Usages*

```js
fc.bigUintN(2)
// Note: All possible bigint values between `0n` (included) and `3n` (included)
// Examples of generated values: 0n, 2n, 1n, 3n…

fc.bigUintN(128)
// Note: All possible bigint values between `0n` (included) and `(2n**128n)-1n` (included)
// Examples of generated values:
// • 86341151263089925165504430453367665188n
// • 14n
// • 328981524291263435470719008913591905663n
// • 279866238908824165638381771934770854596n
// • 111395503858026070299201611333616927272n
// • …
```
</details>

<details>
<summary><b>bigUint</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#biguint">api</a>]</summary><br/>

*&#8195;Description*

> Positive `bigint` values (including zero)
>
> Generate any positive bigint value taken up to upper bound included.

*&#8195;Signatures*

- `fc.bigUint()`
- `fc.bigUint({max?})`
- `fc.bigUint(max)`

*&#8195;with:*

- `max?` — _upper bound of the range (included)_

*&#8195;Usages*

```js
fc.bigUint()
// Examples of generated values:
// • 98415346800826680180868623901081769911550846942931679526483139707297824018492n
// • 81847654831253862250960947754551199482417759415227376695916153744999991292122n
// • 88192025501918677973672101265075531420107830828023254720275072280209923428999n
// • 46027806054858042993090394331470161808813263449611553513658034830595160464971n
// • 24n
// • …

fc.bigUint({max: 12345678901234567890n})
// Note: All possible bigint values between `0n` (included) and `12345678901234567890n` (included)
// Examples of generated values: 2140173898915155879n, 4446193883774321594n, 12345678901234567890n, 12345678901234567882n, 19n…
```
</details>

## String

### Single character

<details>
<summary><b>hexa</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#hexa">api</a>]</summary><br/>

*&#8195;Description*

> One lowercase hexadecimal character — ie.: _one character in `0123456789abcdef`_

*&#8195;Signatures*

- `fc.hexa()`

*&#8195;Usages*

```js
fc.hexa()
// Examples of generated values: "3", "e", "2", "d", "1"…
```
</details>

<details>
<summary><b>base64</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#base64">api</a>]</summary><br/>

*&#8195;Description*

> One base64 character — _ie.: one character in `A-Z`, `a-z`, `0-9`, `+` or `/`_

*&#8195;Signatures*

- `fc.base64()`

*&#8195;Usages*

```js
fc.base64()
// Examples of generated values: "U", "M", "z", "b", "4"…
```
</details>

<details>
<summary><b>char</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#char">api</a>]</summary><br/>

*&#8195;Description*

> One printable character — _ie.: one character between `0x20` (included) and `0x7e` (included), corresponding to printable characters (see https://www.ascii-code.com/)_

*&#8195;Signatures*

- `fc.char()`

*&#8195;Usages*

```js
fc.char()
// Examples of generated values: "#", "&", "}", "A", "J"…
```
</details>

<details>
<summary><b>ascii</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#ascii">api</a>]</summary><br/>

*&#8195;Description*

> One ascii character — _ie.: one character between `0x00` (included) and `0x7f` (included)_

*&#8195;Signatures*

- `fc.ascii()`

*&#8195;Usages*

```js
fc.ascii()
// Examples of generated values: "5", "\u001a", "7", "}", "A"…
```
</details>

<details>
<summary><b>unicode</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#unicode">api</a>]</summary><br/>

*&#8195;Description*

> One unicode character from BMP-plan — _ie.: one character between `0x0000` (included) and `0xffff` (included) but excluding surrogate pairs (between `0xd800` and `0xdfff`)_
>
> Generate any character of UCS-2 which is a subset of UTF-16 (restricted to BMP plan).

*&#8195;Signatures*

- `fc.unicode()`

*&#8195;Usages*

```js
fc.unicode()
// Examples of generated values: "", "熇", "ዢ", "⢥", "\""…
```
</details>

<details>
<summary><b>char16bits</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#char16bits">api</a>]</summary><br/>

*&#8195;Description*

> One unicode character from BMP-plan (including part of surrogate pair) — _ie.: one character between `0x0000` (included) and `0xffff` (included)_
>
> Generate any 16 bits character. Be aware the values within `0xd800` and `0xdfff` which constitutes the surrogate pair characters are also generated meaning that some generated characters might appear invalid regarding UCS-2 and UTF-16 encoding._


*&#8195;Signatures*

- `fc.char16bits()`
*&#8195;Usages*

```js
fc.char16bits()
// Examples of generated values: "￻", "훺", ")", "", "￰"…
```
</details>

<details>
<summary><b>fullUnicode</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#fullunicode">api</a>]</summary><br/>

*&#8195;Description*

> One unicode character — _ie.: one character between `0x0000` (included) and `0x10ffff` (included) but excluding surrogate pairs (between `0xd800` and `0xdfff`)_
>
> Its length can be greater than one as it potentially contains multiple UTF-16 characters for a single glyph (eg.: `"\u{1f434}".length === 2`).

*&#8195;Signatures*

- `fc.fullUnicode()`

*&#8195;Usages*

```js
fc.fullUnicode()
// Examples of generated values: "񗣺", "󡏒", "񖘬", "󁸻", "񄴑"…
```
</details>

### Multiple characters

<details>
<summary><b>hexaString</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#hexastring">api</a>]</summary><br/>

*&#8195;Description*

> Hexadecimal string containing characters produced by `fc.hexa()`

*&#8195;Signatures*

- `fc.hexaString()`
- `fc.hexaString({minLength?, maxLength?})`
- _`fc.hexaString(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.hexaString(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.hexaString()
// Examples of generated values: "3c4", "bf2", "f", "a9cb", "02e25e"…

fc.hexaString({maxLength: 3})
// Note: Any hexadecimal string containing up to 3 (included) characters
// Examples of generated values: "", "c", "0", "1", "c0"…

fc.hexaString({minLength: 3})
// Note: Any hexadecimal string containing at least 3 (included) characters
// Examples of generated values: "132", "c63baf", "064133", "1e412e", "0e479d13"…

fc.hexaString({minLength: 4, maxLength: 6})
// Note: Any hexadecimal string containing between 4 (included) and 6 (included) characters
// Examples of generated values: "c3108", "f911e", "db35", "00fa", "09a7ba"…
```
</details>

<details>
<summary><b>base64String</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#base64string">api</a>]</summary><br/>

*&#8195;Description*

> Base64 string containing characters produced by `fc.base64()`
>
> Provide valid base64 strings: length always multiple of 4 padded with '=' characters

*&#8195;Signatures*

- `fc.base64String()`
- `fc.base64String({minLength?, maxLength?})`
- _`fc.base64String(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.base64String(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included if multiple of 4)_

_When using `minLength` and `maxLength` make sure that they are compatible together. For instance: asking for `minLength=2` and `maxLength=3` is impossible for base64 strings as produced by the framework_

*&#8195;Usages*

```js
fc.base64String()
// Examples of generated values: "rgk=", "BI==", "D/Ev", "xB==", "VF=="…

fc.base64String({maxLength: 8})
// Note: Any base64 string containing up to 8 (included) characters
// Examples of generated values: "", "YycWxD==", "CF==", "udGFHc==", "xBk="…

fc.base64String({minLength: 8})
// Note: Any base64 string containing at least 8 (included) characters
// Examples of generated values: "ES8A9c87", "7BPvpeDlf2BE", "7WXEBForaL==", "YycWxDA+KMsIEQg0B6MC9ME=", "CFx/rD9F6AI="…

fc.base64String({minLength: 4, maxLength: 12})
// Note: Any base64 string containing between 4 (included) and 12 (included) characters
// Examples of generated values: "rUs8bJfAngr=", "uFDtEE==", "rB+EZD==", "B4DP", "C379"…
```
</details>

<details>
<summary><b>string</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#string">api</a>]</summary><br/>

*&#8195;Description*

> String containing characters produced by `fc.char()`

*&#8195;Signatures*

- `fc.string()`
- `fc.string({minLength?, maxLength?})`
- _`fc.string(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.string(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.string()
// Examples of generated values: ".A%", "aM{]xTH&)", "^NLpz5/y", "", "eqr"…

fc.string({maxLength: 3})
// Note: Any string containing up to 3 (included) characters
// Examples of generated values: "", "~*2", "{Z", "[!", "jlZ"…

fc.string({minLength: 3})
// Note: Any string containing at least 3 (included) characters
// Examples of generated values: "W=*$Fm V4Yf4<qC", "JeT[$", "~*2[s\\,qgwio", "nDL?K[,", "{Z:gG\")"…

fc.string({minLength: 4, maxLength: 6})
// Note: Any string containing between 4 (included) and 6 (included) characters
// Examples of generated values: "x<H+`", "!z$#", "%0b $", "}%[~z", "z&x~"…
```
</details>

<details>
<summary><b>asciiString</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#asciistring">api</a>]</summary><br/>

*&#8195;Description*

> ASCII string containing characters produced by `fc.ascii()`

*&#8195;Signatures*

- `fc.asciiString()`
- `fc.asciiString({minLength?, maxLength?})`
- _`fc.asciiString(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.asciiString(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.asciiString()
// Examples of generated values: "2u1\u001aWQ", "", "*y", "\bT\u0013.\u0017|h&>", "si3\u0016`kA\u0017\u0004"…

fc.asciiString({maxLength: 3})
// Note: Any ascii string containing up to 3 (included) characters
// Examples of generated values: "", "vC", "", "'\u0010*", "%"…

fc.asciiString({minLength: 3})
// Note: Any ascii string containing at least 3 (included) characters
// Examples of generated values: " \"\"!\u001a)\u001a\u001e\u001dFF", "vCkn&}{", "\u001c\u0006p", "'\u0010*6ua\u0017JEpG\u000bg<#\u0007", "%f\"\u001fBO"…

fc.asciiString({minLength: 4, maxLength: 6})
// Note: Any ascii string containing between 4 (included) and 6 (included) characters
// Examples of generated values: "0(0E\"", "!.Qj?-", "V\u0002\u0014z\fT", "!#!\"", "\u0007U\u0006t#"…
```
</details>

<details>
<summary><b>unicodeString</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#unicodestring">api</a>]</summary><br/>

*&#8195;Description*

> Unicode string containing characters produced by `fc.unicode()`

*&#8195;Signatures*

- `fc.unicodeString()`
- `fc.unicodeString({minLength?, maxLength?})`
- _`fc.unicodeString(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.unicodeString(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.unicodeString()
// Examples of generated values: "", "ॗﰗ騈)￻,揖￵ᛦ￸", "㚗", "娇\u001eᨫ㽹矌", "┛䅯퉳"…

fc.unicodeString({maxLength: 3})
// Note: Any unicode (from BMP-plan) string containing up to 3 (included) characters
// Examples of generated values: "-", "", "⇾燏", "*❚", "ሖꧾㆳ"…

fc.unicodeString({minLength: 3})
// Note: Any unicode (from BMP-plan) string containing at least 3 (included) characters
// Examples of generated values: "-(*臑憚.ḙ葢￸獲戽+(⑆", "杮಴⿆뎶蝐母쪀㩑ᶔ䰚搞慢䲉欐", "⇾燏ᅙ秱뵴ꇺ꿵玽鄧돟鐎䕝ᑿ", "*❚\"%*", " 嬵ߍ�섁"…

fc.unicodeString({minLength: 4, maxLength: 6})
// Note: Any unicode (from BMP-plan) string containing between 4 (included) and 6 (included) characters
// Examples of generated values: "紫ᡔ楬莼媛", "ኮ࿅!릭", "ū/￶$ﭙ+", "'ָ/㳏", "랂巻ᗽ"…
```
</details>

<details>
<summary><b>string16bits</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#string16bits">api</a>]</summary><br/>

*&#8195;Description*

> String containing characters produced by `fc.char16bits()`
>
> Be aware that the generated string might appear invalid regarding the unicode standard as it might contain incomplete pairs of surrogate

*&#8195;Signatures*

- `fc.string16bits()`
- `fc.string16bits({minLength?, maxLength?})`
- _`fc.string16bits(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.string16bits(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.string16bits()
// Examples of generated values: "埫쒠爤", "#\udb48", "૑ᚃ⵿⫄㖯孞℠", "⤱黁醙", "⦕끅Ȩ鋑\uda43"…

fc.string16bits({maxLength: 3})
// Note: Any string (not really legal ones sometimes) containing up to 3 (included) characters
// Examples of generated values: "", "￱", "ऻ㨖ẗ", "ﾮ뾝꜆", "㓱"…

fc.string16bits({minLength: 3})
// Note: Any string (not really legal ones sometimes) containing at least 3 (included) characters
// Examples of generated values: "徵 씒", "￱!婏숯", "ऻ㨖ẗ倄쾁伅周쀫", "䯘趲䴜", "&/꫿鐫"…

fc.string16bits({minLength: 4, maxLength: 6})
// Note: Any string (not really legal ones sometimes) containing between 4 (included) and 6 (included) characters
// Examples of generated values: "孢\udbcd퉭⻵", "↩㄁\ude77䟾鏹撜", "軫쒍#驆䥖", "旲'+￲\ud870", "䵬ଛ쩀蛩‮৶"…
```
</details>

<details>
<summary><b>fullUnicodeString</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#fullunicodestring">api</a>]</summary><br/>

*&#8195;Description*

> Unicode string containing characters produced by `fc.fullUnicode()`

*&#8195;Signatures*

- `fc.fullUnicodeString()`
- `fc.fullUnicodeString({minLength?, maxLength?})`
- _`fc.fullUnicodeString(maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.fullUnicodeString(minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

_Be aware that the length is considered in terms of the number of glyphs in the string and not the number of UTF-16 characters. As a consequence `generatedString.length` might be greater than the asked maximal length but `[...generatedString].length` will not and always be in the required range_

*&#8195;Usages*

```js
fc.fullUnicodeString()
// Examples of generated values: "𾪖򘔼򭐂񿈋𰥞", "񫪥񫹚򻰌􏿮", "󘅽󘺂򦀵򈄓񧟵", "󥐫򱡭􌺛愋Ꚁ𻧗ᨘ񀄮􍹣", "򈼴.򯃗􏿻'()􋇶/\""…

fc.fullUnicodeString({maxLength: 3})
// Note: Any unicode string containing up to 3 (included) code-points
// Examples of generated values: "🷣", "𪇍򱲆", "", "󟙀", "򒎧"…

fc.fullUnicodeString({minLength: 3})
// Note: Any unicode string containing at least 3 (included) code-points
// Examples of generated values: "🷣󸯜򎪳񖶌󪊀򳘟𙂄󟠷󄏧𰷡", "𪇍򱲆𖰌󣉄𵨡𻥕𰆏򦇘󜁳򁿳򎗯􈤘񖇅󑃙񡳏", "򞭽𜔱򠹉", "󔌧򞡺􏿮񞊙􂣐", "𞄊􊪆󧁴𦳫󇗋𨖸񉵊򫧏𞩻󓖞򼦃𘅏񀔾"…

fc.fullUnicodeString({minLength: 4, maxLength: 6})
// Note: Any unicode string containing between 4 (included) and 6 (included) code-points
// Examples of generated values: "񅈡򅰻񱅜򾐬񲆗񃯹", "𕩴𦿗񙷦-򽺺", ",􏿶 !𼻃񚸺", "-,񟟺񼐹", "􏿼𬑪12"…
```
</details>

<details>
<summary><b>stringOf</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#stringof">api</a>]</summary><br/>

*&#8195;Description*

> String containing characters produced by the passed character generator

*&#8195;Signatures*

- `fc.stringOf(charArb)`
- `fc.stringOf(charArb, {minLength?, maxLength?})`
- _`fc.stringOf(charArb, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.stringOf(charArb, minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `charArb` — _arbitrary able to generate random strings (possibly multiple characters)_
- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal number of characters (included)_

*&#8195;Usages*

```js
fc.stringOf(fc.hexa())
// Examples of generated values: "6c2be", "5acc", "d2535", "bdbb078e3", "407d300602"…

fc.stringOf(fc.char(), {maxLength: 3})
// Note: Any string containing up to 3 (included) characters extracted from `fc.char()`
// Examples of generated values: "$", "KU", ")H", "", "Z"…

fc.stringOf(fc.char(), {minLength: 4, maxLength: 6})
// Note: Any string containing between 4 (included) and 6 (included) characters extracted from `fc.char()`
// Examples of generated values: "*jlRI", "}<6Fm", "4P\"x ", "Q\"2R", "ZgIk"…

fc.stringOf(fc.constantFrom('a', 'b'), {maxLength: 5})
// Note: Any string containing between 0 (included) and 5 (included) characters extracted from `fc.constantFrom('a', 'b')`
// Examples of generated values: "bbb", "b", "", "ab", "baa"…

fc.stringOf(fc.constantFrom('Hello', 'World'), {minLength: 1, maxLength: 3})
// Note: It might produce strings like "WorldWorldWorld" or "WorldHelloWorld"…
// Examples of generated values: "WorldWorldHello", "World", "HelloHello", "Hello", "WorldHello"…
```
</details>

### More specific strings

<details>
<summary><b>json</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#json">api</a>]</summary><br/>

*&#8195;Description*

> JSON compatible string representations of instances. Can produce string representations of basic primitives but also of deep objects.
>
> The generated values can be parsed by `JSON.parse`.
> All the string values (from keys to values) are generated using `fc.string()`.

*&#8195;Signatures*

- `fc.json()`
- `fc.json({maxDepth?})`
- _`fc.json(maxDepth)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `maxDepth?` — _maximal depth of generated objects_

*&#8195;Usages*

```js
fc.json()
// Examples of generated values:
// • "{\"gDS6ixj)R+\":{\"&>4q\":-4.764047835312664e-168,\".4$\":1.7093885319023646e+103,\"[,Dk$XNln-\":2.58973771202385e+32},\"W<m$%th\":{\"Dcedl|\":true},\"Qk\":2482558594970227}"
// • "true"
// • "{\"0J4\":{\"6nY3)\\\"\":\";8Y8nAf'@\",\"D';_'3Lc\":true}}"
// • "[null,null]"
// • "{}"
// • …

fc.json({maxDepth: 0})
// Examples of generated values: "-4911780255358798", "false", "null", "-1.6634303144055188e+149", "true"…

fc.json({maxDepth: 1})
// Examples of generated values:
// • "{\"mTZw9f!~2\":null,\"W\":null,\"N'!U6\":null,\"x\":null,\"=l]l\":null}"
// • "{\" \":7217657973387345,\"CyPnYYJ\\\\N\":1.2393294656440357e-193,\"\":-8892329589260656,\"T)=jHSz2u=\":1.79769313486231e+308}"
// • "{\"&$|2j1/g\":-9007199254740947,\",\":true}"
// • "{\"|\":false,\"*I\":-6.708213475309735e+40,\"r(>uO\":\"I$2`I_6@\",\"N'q\":null}"
// • "[0.00005536178133696582,1.0077587675918889e-197,-1.7048414608911972e-193]"
// • …
```
</details>

<details>
<summary><b>unicodeJson</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#unicodejson">api</a>]</summary><br/>

*&#8195;Description*

> JSON compatible string representations of instances. Can produce string representations of basic primitives but also of deep objects.
>
> The generated values can be parsed by `JSON.parse`.
> All the string values (from keys to values) are generated using `fc.unicodeString()`.

*&#8195;Signatures*

- `fc.unicodeJson()`
- `fc.unicodeJson({maxDepth?})`
- _`fc.unicodeJson(maxDepth)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `maxDepth?` — _maximal depth of generated objects_

*&#8195;Usages*

```js
fc.unicodeJson()
// Examples of generated values:
// • "[3.051181034070195e+291]"
// • "{\"荌鏊턳ᦖ\":false,\"냚鶖뜥\":false}"
// • "{\"\":true,\"䷷ꔼꊐ㍂Ꮋ⧭얘\":false,\"镐菋⹥埒䘺懘ྎᶃ硾넍\":false,\"䶩လ뎙丯㷲ퟬ\":true,\"勯吓ᯇป蹥ꕪ渘Ǭ傟\":false}"
// • "{\"\":[],\"ᐞ淙\":[]}"
// • "{\"迵끀꧋좡ꏶ塣퐼띞\":{\"䧎﹥ï\":null},\"ቈ保婠꠨旞荫㹢ފ\":{\"콆쳑Ｈ᜞紽ѳ㑓\":false},\"\":{\"ꉶ瀞뿱끮筡팹᧊\":1.6274784566788148e-174},\"끨\":5242050618033827,\"ɿ⫝̸挖\":{\"顅蓦⋨뢫\":-2.5272766011735403e-36,\"ঞ\":1.109383617471883e+188}}"
// • …

fc.unicodeJson({maxDepth: 0})
// Examples of generated values: "-9007199254740952", "1068292005279453", "null", "2.0778770048209322e-188", "-2.787348602876926e-78"…

fc.unicodeJson({maxDepth: 1})
// Examples of generated values: "-9007199254740952", "1068292005279453", "null", "[]", "-2.787348602876926e-78"…
```
</details>

<details>
<summary><b>lorem</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#lorem">api</a>]</summary><br/>

*&#8195;Description*

> Lorem ipsum values

*&#8195;Signatures*

- `fc.lorem()`
- `fc.lorem({maxCount?, mode?})`
- _`fc.lorem(maxWordsCount)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.lorem(maxCount, sentenceMode)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `maxCount?` — default: `5` — if `sentenceMode` is `true`: lorem ipsum sentence containing at most `maxCount` sentences, otherwise: containing at most `maxCount` words_
- `mode?` — default: `"words"` — _enable sentence mode by setting its value to `"sentences"`_
- `maxWordsCount?` — _maximal number of words to produce_
- `sentenceMode?` — default: `false` — _enable sentence mode_

_Except if you specified `sentenceMode=true`, `fc.lorem` defaults to words mode_

*&#8195;Usages*

```js
fc.lorem()
// Examples of generated values: "arcu fusce", "dolor mi dignissim", "felis lacus", "ligula nec curae sed enim", "tincidunt vivamus massa"…

fc.lorem({maxCount: 3})
// Examples of generated values: "praesent libero sodales", "mi adipiscing", "ut duis vitae", "mi elementum gravida", "non"…

fc.lorem({maxCount: 3, mode: "sentences"})
// Examples of generated values:
// • "Sed faucibus, sit praesent. Justo id, nisl fusce tempor sit convallis. Non consectetur in scelerisque mauris morbi sollicitudin augue, nulla mauris leo."
// • "Tempus. Tristique."
// • "Diam faucibus lorem fermentum mauris lorem dignissim consequat semper nunc."
// • "Id, cubilia in mi enim in proin adipiscing ut, risus."
// • "Rhoncus in hendrerit faucibus sed sapien et."
// • …
```
</details>

<details>
<summary><b>ipV4</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#ipv4">api</a>]</summary><br/>

*&#8195;Description*

> IP v4 addresses

*&#8195;Signatures*

- `fc.ipV4()`

*&#8195;Usages*

```js
fc.ipV4()
// Examples of generated values: "7.149.25.7", "7.7.6.6", "254.21.210.1", "98.5.251.31", "221.2.9.255"…
```
</details>

<details>
<summary><b>ipV4Extended</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#ipv4extended">api</a>]</summary><br/>

*&#8195;Description*

> IP v4 addresses including all the formats supported by WhatWG standard (for instance: 0x6f.9)

*&#8195;Signatures*

- `fc.ipV4Extended()`

*&#8195;Usages*

```js
fc.ipV4Extended()
// Examples of generated values: "160.0372.0x3", "5.031355510", "0x92df1683", "0x85b09ec1", "0x45.0103.03236"…
```
</details>

<details>
<summary><b>ipV6</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#ipv6">api</a>]</summary><br/>

*&#8195;Description*

> IP v6 addresses

*&#8195;Signatures*

- `fc.ipV6()`

*&#8195;Usages*

```js
fc.ipV6()
// Examples of generated values: "5998:7144:3dc:ff:b:5ae5:3::", "::231:b:d0:7:9bd", "59::9:150.144.165.251", "d::fa8f", "::0:afb:f4e:a:2.4.250.160"…
```
</details>

<details>
<summary><b>uuid</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uuid">api</a>]</summary><br/>

*&#8195;Description*

> UUID values including versions 1 to 5

*&#8195;Signatures*

- `fc.uuid()`

*&#8195;Usages*

```js
fc.uuid()
// Examples of generated values:
// • "0000000f-ca95-1bc1-9399-f11900000017"
// • "00000017-0016-1000-8000-001c00000016"
// • "fffffffe-7e15-511f-800b-6ed200000009"
// • "8d6aee62-0002-1000-bfff-ffffbdd4f31f"
// • "c2156fdd-0018-1000-bd96-0109ffffffef"
// • …
```
</details>

<details>
<summary><b>uuidV</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uuidv">api</a>]</summary><br/>

*&#8195;Description*

> UUID values for a specific UUID version (only 1 to 5) only digits in 0-9a-f

*&#8195;Signatures*

- `fc.uuidV(version)`

*&#8195;with:*

- `version` — _version of the uuid to produce: 1, 2, 3, 4 or 5_

*&#8195;Usages*

```js
fc.uuidV(3)
// Examples of generated values:
// • "05cfea14-bcac-3b1b-8d87-f0d2ffffffe8"
// • "7f4a63cc-0010-3000-bfff-ffeeffffffeb"
// • "b18820b3-04b5-347a-a800-88270000000c"
// • "e6dfee9b-0003-3000-8000-0018d16c26be"
// • "4339edf8-0000-3000-92e8-dd5800000000"
// • …

fc.uuidV(5)
// Examples of generated values:
// • "d9951cc0-000f-5000-886d-743b90c0903c"
// • "b4f42187-7bd2-5385-8000-000794a930da"
// • "c2faeae2-2bd2-51a4-81e8-3f5800000007"
// • "65c2d0a5-0004-5000-8000-000e579a5fa4"
// • "00000002-0008-5000-8000-000b1bc90950"
// • …
```
</details>

<details>
<summary><b>domain</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#domain">api</a>]</summary><br/>

*&#8195;Description*

> Domain name values with extension
>
> Following RFC 1034, RFC 1123 and WHATWG URL Standard

*&#8195;Signatures*

- `fc.domain()`

*&#8195;Usages*

```js
fc.domain()
// Examples of generated values:
// • "j6ib52zarm-s0pkuvhqm1mv0scq9ta1k7is18a6npwo09.8oylufs6xjggc-g5wx6pp7-n.ezkcany"
// • "00cwuvaxlmcydtgdl2y5gq52nb-gochrfw7luhm3eak87xjmn34l4h-a.lynftw-jcilddpshg-fjbdvglnrklnjfv.1p9hkvkxac9odexa6220t2i2f5gtplj91iv3hcdf55tnysx2.syxfs0gon3vrv7r-n09qd-tvzkfj4vx-90is8a7857j77s04kkfuixb9fnuf.sm4qu34yox0j0l3g8rvkbi56h4.vlnwjdnlb"
// • "35b10n-lu6vxe25muuwxcou2vg-ooho0ba-7fr9s-s2r9dzi-oph9tnb6ucc70l.l.amrqhh-q3yiac3zh83ktm-qz72oob.0x1dq7qgla1xttwxa4skn5o4ms6l6neuxm2wsoo4vsa14dixmyb290pvm3wek.hfju.fjxjzd"
// • "0.h6a4sfyd67h8o-fyelfolcucqbzhhi.bbwz"
// • "c.mrjkuzbj8blh-hr4bkyh4tb8x8d26fv5p10--k.7.z4.vl1mr8sc1z4sxu01uabesv6n217ct7a-lqpc3kd65ktx7yc9pl4t.axunkpjjhm"
// • …
```
</details>

<details>
<summary><b>webAuthority</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#webauthority">api</a>]</summary><br/>

*&#8195;Description*

> Web authority values
>
> Following RFC 3986

*&#8195;Signatures*

- `fc.webAuthority()`
- `fc.webAuthority({withIPv4?, withIPv4Extended?, withIPv6?, withPort?})`

*&#8195;with:*

- `withIPv4?` — default: `false` — _enable ip v4
- `withIPv4Extended?` — default: `false` — _enable ip v4 extended_
- `withIPv6?` — default: `false` — _enable ip v6_
- `withPort?` — default: `false` — _enable port_


*&#8195;Usages*

```js
fc.webAuthority()
// Examples of generated values:
// • "qj5h7-5r4y6je1ud1a1fn2c82rugm5wlz9i191.0yuxnw1is1bgv5fk.lugkf3a-tqfd5qsghdv1e4f60126hb1hidj-d2nfa7.9z61dxxd7nf24.uz1h0fenwlozjjf0xfjhnoe4y6i1zxtszhay3h42bs1dl-ey6pgqayubhpzq.lzzvhweuqy"
// • "5w6.mndtkwo"
// • "qtabs88iidqfzfey5b8qmced.x.mc55c6.dcw"
// • "vyd-xdhck5bu94xerf71iq4q6v13j1osnd-v5izrmp3-rw1.izhob"
// • "5sr6j0ayq2eli26sdlgqhtwqrm2t8ytuzbzlqs2t4qoo5s0azspwub.wbvdc"
// • …

fc.webAuthority({
  withIPv4: true,
})
// Examples of generated values:
// • "227.252.4.231"
// • "6.1.143.3"
// • "nlefeaoklaqquxvi7-epnuaz516se0f39.ddal91.yvtf"
// • "1n.qe--bdd.5gpdpkz536c3gin7evv4i7x.roykrcngj"
// • "6.3.255.158"
// • …

fc.webAuthority({
  withIPv4Extended: true,
})
// Examples of generated values:
// • "4dfi9d-6k09abpb8cq9n408e95eoo0kc3ccdyav.4.6z6vnw4zd2cpl-xv0v7b5h2v4ra791jq5ewdh31uazxv9d7bfk9lcwrgp7ef1.b2rb5j-b.ahkhfwtv568kod23qp8f1ks46m9.vvc"
// • "0xa"
// • "0xefebe5f3"
// • "6abqd.eitf7h7ryad.rsqnyyq"
// • "0345.077777767"
// • …

fc.webAuthority({
  withIPv4: true,
  withIPv4Extended: true,
  withIPv6: true,
  withPort: true,
})
// Examples of generated values: "0352.0x89bbdd:3", "154.0372.0xbd3d", "[4522:29:b:fc75:83e:964c:108::]:12037", "250.102.83.229:13", "025:13850"…
```
</details>

<details>
<summary><b>webFragments</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#webfragments">api</a>]</summary><br/>

*&#8195;Description*

> Fragments to build an URI
>
> Fragment is the optional part right after the # in an URI

*&#8195;Signatures*

- `fc.webFragments()`

*&#8195;Usages*

```js
fc.webFragments()
// Examples of generated values: "hip", "wc", "K/z=)RtC", "E7y", "%F0%B5%81%85:w,+"…
```
</details>

<details>
<summary><b>webQueryParameters</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#webqueryparameters">api</a>]</summary><br/>

*&#8195;Description*

> Query parameters to build an URI
>
> Query parameters part is the optional part right after the ? in an URI

*&#8195;Signatures*

- `fc.webQueryParameters()`

*&#8195;Usages*

```js
fc.webQueryParameters()
// Examples of generated values: "52mi", "L3ns-", "X%F3%AB%BA%8AksM", "bSO", "@"…
```
</details>

<details>
<summary><b>webSegment</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#websegment">api</a>]</summary><br/>

*&#8195;Description*

> Web URL path segment

*&#8195;Signatures*

- `fc.webSegment()`

*&#8195;Usages*

```js
fc.webSegment()
// Examples of generated values: "==:", "097", "6", "BgyH", "vn0qo*"…
```
</details>

<details>
<summary><b>webUrl</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#weburl">api</a>]</summary><br/>

*&#8195;Description*

> Web URL values
>
> Following the specs specified by RFC 3986 and WHATWG URL Standard

*&#8195;Signatures*

- `fc.webUrl()`
- `fc.webUrl({authoritySettings?, validSchemes?, withFragments?, withQueryParameters?})`

*&#8195;with:*

- `authoritySettings?` — default: `{}` — _[constraints](https://dubzzz.github.io/fast-check/interfaces/webauthorityconstraints.html) on the web authority_
- `validSchemes?` — default: `['http', 'https']` — _list all the valid schemes_
- `withFragments?` — default: `false` — _enable fragments_
- `withQueryParameters?` — default: `false` — _enable query parameters_

*&#8195;Usages*

```js
fc.webUrl()
// Examples of generated values:
// • "https://lb52zarm-s0pkuvg.qmv0scq9ta1k7b.ga6npwo0mhe1q.1fs6xjggc-g5wx6pp7-j7hz3te8r-br-54np53ybfy.bz"
// • "https://4.7tdcg5n-obeffk7jn44axya-ceph-efc-f269vxed-at65-d9ddt8p7xsc3f.bstvvevsn//lY:./$pd%F4%89%87%89_Up/rBm)@pY/I!%F0%B4%85%B1ily/U/"
// • "https://710n-lu6vxe25muuwxcou2vg-ooho0by.ar9s-s2r9dzi-oph9tnb6ucl.rzy/8g,%F4%8F%BF%AD=/,kLacg/=bI*Y%F1%90%B4%B1"
// • "https://a9c-0.58hxfb.wzha/zf/%F2%B0%A8%9Aj$/mEM%F3%BD%B5%95l%F0%93%A9%AA-xV"
// • "https://6uzbj8blh-hr4bkyh4tb8x8d26fv5p10--8dtgi0kt.aeeau//m7:f"
// • …

fc.webUrl({
  validSchemes: ['ftp', 'ftps'],
})
// Examples of generated values:
// • "ftps://ld0fa.xn//5Hi_/3e%F2%B0%9E%A7ot/C9by:U)xN1/z/CHeC(/7p;l3A*91"
// • "ftps://5an-v0m02mtwarjrov9wqg9.ymiexrru/G.K://2%F3%AA%83%B2zxOxe/4Z&%F4%8F%96%B6Cm%F1%A4%A6%8E%F3%9B%99%A2q/g/:&H+rH2)',"
// • "ftp://f.ellpx/vxj3!B7g~@"
// • "ftp://d3mhpc7vc8dvto3owf6.zb/m://p;fCqw=Pd/n*lA7_6W/+Fy_$"
// • "ftps://4.4.5ae8f8.8.ele/7l/"
// • …

fc.webUrl({
  withFragments: true,
  withQueryParameters: true,
})
// Examples of generated values:
// • "https://6teotdbg91olcdvqg4ag52gkm8sr4as1spvz-nhbmr4a26sf52bzkkk8u.6kwwftr726ju3bhgq1avtwyk6r5bdin2z48r5zq6.9pju0ee3g6x9nhyie7d3ltygys064g6exna7.xzde?w/2%F1%95%AE%A2ohWXU#xkE"
// • "http://ntgafkj317vprx7x09flrvhkp1ejaxfg0fdrfc95.3pedp8hpyt-gq27kxjcluf9.tzlycwp/@Iq*1%F2%95%95%9Ece1?_*.G!5DY#pb"
// • "http://e4.17v9z3bzcn6qf4wji93pr-vlt5yx2va6y1nldenbo527jkaevf.xw/A5w&ZuAW?f"
// • "http://8.jmt.7obzakjfdip8f7-csuqjgp01eho0t8s6xuj3hqvekb7qf6q3i-d62.tjly5zq6lpbfnfddj7v50w04y07.8ir9322gginyti1omijbhrm0w2f.pw?I#:e/L*;f!%31/"
// • "https://q7q52eele4de4whhd65j1o.tsqntvwx33f0g2a8a6oxjrbxfrpir63nqqah1ajor4p7.xed/%F2%A9%BD%93~l%F2%BA%B0%80,!/4b/cfGA%F1%8B%9A%8A/F452V:7_/V%F3%A8%99%BBDS%F3%AB%9A%99./5/%F2%A1%BE%AE~RZF0+2#h=t"
// • …
```
</details>

<details>
<summary><b>emailAddress</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#emailaddress">api</a>]</summary><br/>

*&#8195;Description*

> Email adresses
>
> Following RFC 1123 and RFC 5322

*&#8195;Signatures*

- `fc.emailAddress()`

*&#8195;Usages*

```js
fc.emailAddress()
// Examples of generated values:
// • "e0f7||'5tq.h61k.opz+r*%^'k.w.cdddsv{'*@ynw1is1bgv5f3uma.8f.sexzzfzwci"
// • "8d{cdr@sai9dcs9nubac3xbf7ubdfsatfbz4j4f5e4jeu45a7xd68r.pebpcbb"
// • "|bi9r}1|.l.^biw8i39.~doz=|dlr@6rzgr91b2xy0wzhozfxspqtmlcjd5s8ox5oh-sn6xlh9b7v25zd9y2i.m0bwcr4bzzziyys8zngvysdhljtl-vp71we0.z66v.wqyli81h78ina879qnk.rbnj"
// • "/22{9=.p&2.e#w-b%-'.%itdenn@55f7rf.5bec7cewavfdf7dtfvqd1gw81ug7ffyagl0mddo7.f.xwncyczdyd"
// • "z*3y`3kt.b}4~6|&&xe.g.dfz=pp/@8bfcqosaswexc5dkacafemvn66d68gdr6aa5fvd8dt7t1bq.bm7qb.al"
// • …
```
</details>

<details>
<summary><b>mixedCase</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#mixedcase">api</a>]</summary><br/>

*&#8195;Description*

> Switch the case of characters generated by an underlying arbitrary

*&#8195;Signatures*

- `fc.mixedCase(stringArb)`
- `fc.mixedCase(stringArb, {toggleCase?})`

*&#8195;with:*

- `stringArb` — _arbitrary producing random strings_
- `toggleCase?` — default: _try `toUpperCase` on the received code-point, if no effect try `toLowerCase`_ — _custom toggle case function that will be called on some of the code-points to toggle the character_

*&#8195;Usages*

```js
fc.mixedCase(fc.hexaString())
// Examples of generated values: "c7BC", "D7e0", "e7", "", "5bE4CC29"…

fc.mixedCase(fc.constant('hello world'))
// Examples of generated values: "HeLlO woRLD", "HElLO wORlD", "hELlO woRld", "hELLo worLd", "hELlo WORLd"…

fc.mixedCase(
  fc.constant('hello world'),
  {
    toggleCase: (rawChar) => `UP(${rawChar})`,
  }
)
// Examples of generated values:
// • "UP(h)ellUP(o)UP( )UP(w)oUP(r)ld"
// • "hUP(e)lloUP( )UP(w)orld"
// • "helUP(l)UP(o)UP( )UP(w)orlUP(d)"
// • "UP(h)UP(e)UP(l)lUP(o)UP( )wUP(o)rld"
// • "heUP(l)UP(l)o wUP(o)rUP(l)d"
// • …

fc.mixedCase(
  fc.constant('🐱🐢🐱🐢🐱🐢'),
  {
    toggleCase: (rawChar) => rawChar === '🐱' ? '🐯' : '🐇',
  }
)
// Examples of generated values: "🐱🐇🐱🐇🐱🐇", "🐱🐇🐯🐇🐯🐇", "🐱🐇🐯🐇🐱🐇", "🐱🐇🐯🐇🐯🐢", "🐯🐇🐯🐇🐯🐢"…
```
</details>

## Date

<details>
<summary><b>date</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#date">api</a>]</summary><br/>

*&#8195;Description*

> Date values
>
> Generate any possible dates in the specified range. Both the lower bound and upper bound of the range are included in the set of possible values.

*&#8195;Signatures*

- `fc.date()`
- `fc.date({ min?, max? })`

*&#8195;with:*

- `min?` — default: `new Date(-8640000000000000)` — _lower bound of the range (included)_
- `max?` — default: `new Date(8640000000000000)` — _upper bound of the range (included)_

*&#8195;Usages*

```js
fc.date()
// Examples of generated values:
// • new Date("1969-12-31T23:59:59.993Z")
// • new Date("1970-01-01T00:00:00.017Z")
// • new Date("-271821-04-20T00:00:00.036Z")
// • new Date("+117887-07-07T17:12:49.936Z")
// • new Date("-091653-05-18T10:16:24.518Z")
// • …

fc.date({ min: new Date("2000-01-01T00:00:00.000Z") })
// Examples of generated values:
// • new Date("+275760-09-12T23:59:59.959Z")
// • new Date("+275760-09-12T23:59:59.949Z")
// • new Date("+251844-04-28T11:49:32.856Z")
// • new Date("+275760-09-12T23:59:59.999Z")
// • new Date("+258781-01-23T17:20:22.591Z")
// • …

fc.date({ max: new Date("2000-01-01T00:00:00.000Z") })
// Examples of generated values:
// • new Date("-271821-04-20T00:00:00.011Z")
// • new Date("-271821-04-20T00:00:00.001Z")
// • new Date("-061471-10-15T20:55:54.168Z")
// • new Date("1969-12-31T23:59:59.995Z")
// • new Date("-135742-01-31T09:23:17.695Z")
// • …

fc.date({ min: new Date("2000-01-01T00:00:00.000Z"), max: new Date("2000-12-31T23:59:59.999Z") })
// Examples of generated values:
// • new Date("2000-06-25T11:59:12.750Z")
// • new Date("2000-12-31T23:59:59.993Z")
// • new Date("2000-09-24T05:26:49.182Z")
// • new Date("2000-12-31T23:59:59.999Z")
// • new Date("2000-07-08T09:22:33.042Z")
// • …
```
</details>

## Typed Array

<details>
<summary><b>int8Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#int8array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Int8Array_

*&#8195;Signatures*

- `fc.int8Array()`
- `fc.int8Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `-128` — _minimal value (included)_
- `max?` — default: `127` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.int8Array()
// Examples of generated values:
// • Int8Array.from([5,-2,49,5,-6,-74,-48,-2,122,4])
// • Int8Array.from([85,-55])
// • Int8Array.from([1,-6])
// • Int8Array.from([-48,102,-78,52,4,81])
// • Int8Array.from([-1,2])
// • …

fc.int8Array({min: 0, minLength: 1})
// Examples of generated values:
// • Int8Array.from([99,92,51,12,0,31])
// • Int8Array.from([77,6,12,68,33,85,15,88,115,115,111])
// • Int8Array.from([125])
// • Int8Array.from([39,122,124])
// • Int8Array.from([10,6,116,107,75,56,74,79,123])
// • …
```
</details>

<details>
<summary><b>uint8Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uint8array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Uint8Array_

*&#8195;Signatures*

- `fc.uint8Array()`
- `fc.uint8Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `0` — _minimal value (included)_
- `max?` — default: `255` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.uint8Array()
// Examples of generated values:
// • Uint8Array.from([3,248,4])
// • Uint8Array.from([203,79,114])
// • Uint8Array.from([251])
// • Uint8Array.from([90,185,172,171])
// • Uint8Array.from([0,2,254,2,69,254])
// • …

fc.uint8Array({max: 42, minLength: 1})
// Examples of generated values:
// • Uint8Array.from([16,1])
// • Uint8Array.from([12,28,2,26,4,38,3])
// • Uint8Array.from([7,41,34,25,16,18,2,10,30,6,16])
// • Uint8Array.from([16])
// • Uint8Array.from([4,12])
// • …
```
</details>

<details>
<summary><b>uint8ClampedArray</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uint8clampedarray">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Uint8ClampedArray_

*&#8195;Signatures*

- `fc.uint8ClampedArray()`
- `fc.uint8ClampedArray({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `0` — _minimal value (included)_
- `max?` — default: `255` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.uint8ClampedArray()
// Examples of generated values:
// • Uint8ClampedArray.from([150,60,2,11,94])
// • Uint8ClampedArray.from([165,90,12,252])
// • Uint8ClampedArray.from([125,130,53,19,245])
// • Uint8ClampedArray.from([43,109,155,11,128,215,24,46,99])
// • Uint8ClampedArray.from([52,4,215,253,7,4,4,246,4,2])
// • …

fc.uint8ClampedArray({max: 42, minLength: 1})
// Examples of generated values:
// • Uint8ClampedArray.from([40,11,6,19,35,37,25])
// • Uint8ClampedArray.from([34,22,2,4,39,27,19,37,25])
// • Uint8ClampedArray.from([11,34,1,31,25])
// • Uint8ClampedArray.from([15,3,1,37,30,12,38,40,35,41,5])
// • Uint8ClampedArray.from([17,35,21])
// • …
```
</details>

<details>
<summary><b>int16Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#int16array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Int16Array_

*&#8195;Signatures*

- `fc.int16Array()`
- `fc.int16Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `-32768` — _minimal value (included)_
- `max?` — default: `32767` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.int16Array()
// Examples of generated values:
// • Int16Array.from([32761,-15,19460])
// • Int16Array.from([-7989,4687,24946])
// • Int16Array.from([-32765])
// • Int16Array.from([5978,-14151,-10068,-4949])
// • Int16Array.from([1,7,-32762,-11,21829,-32762])
// • …

fc.int16Array({min: 0, minLength: 1})
// Examples of generated values:
// • Int16Array.from([8,12886,11,10845,32410])
// • Int16Array.from([24045,28817])
// • Int16Array.from([8634,263,21637,10150,30007,13375,30165])
// • Int16Array.from([32753,32759,19209])
// • Int16Array.from([11936])
// • …
```
</details>

<details>
<summary><b>uint16Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uint16array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Uint16Array_

*&#8195;Signatures*

- `fc.uint16Array()`
- `fc.uint16Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `0` — _minimal value (included)_
- `max?` — default: `65535` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.uint16Array()
// Examples of generated values:
// • Uint16Array.from([40338,3413,32529,37241,31799,27569])
// • Uint16Array.from([])
// • Uint16Array.from([37642,20057])
// • Uint16Array.from([20327,25524,65394,34318,27766,53340,23112,2822,26910])
// • Uint16Array.from([26963,18761,50835,51189,22592,18891,8353,62454,6243])
// • …

fc.uint16Array({max: 42, minLength: 1})
// Examples of generated values:
// • Uint16Array.from([27,8,29,3,39,34,13,14])
// • Uint16Array.from([3,37,4,3,4,16,40,20,0,21])
// • Uint16Array.from([5,31])
// • Uint16Array.from([40,2,42,42,41])
// • Uint16Array.from([19,5,40])
// • …
```
</details>

<details>
<summary><b>int32Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#int32array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Int32Array_

*&#8195;Signatures*

- `fc.int32Array()`
- `fc.int32Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `-0x80000000` — _minimal value (included)_
- `max?` — default: `0x7fffffff` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.int32Array()
// Examples of generated values:
// • Int32Array.from([2147483619,-7,841665540])
// • Int32Array.from([-754622261,809800271,-1634737806])
// • Int32Array.from([-2147483645])
// • Int32Array.from([-1499097254,-1996207943,160127148,-1135579989])
// • Int32Array.from([1,29,-2147483626,-17,-1705126587,-2147483642])
// • …

fc.int32Array({min: 0, minLength: 1})
// Examples of generated values:
// • Int32Array.from([30,1812443734,26,662645341,620592794])
// • Int32Array.from([536894957,149319825])
// • Int32Array.from([1265639866,1672446215,356045957,1686054822,2086860087,2035004479,1523119573])
// • Int32Array.from([2147483618,2147483620,1209289481])
// • Int32Array.from([946187936])
// • …
```
</details>

<details>
<summary><b>uint32Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#uint32array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Uint32Array_

*&#8195;Signatures*

- `fc.uint32Array()`
- `fc.uint32Array({min?, max?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `0` — _minimal value (included)_
- `max?` — default: `0xffffffff` — _maximal value (included)_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.uint32Array()
// Examples of generated values:
// • Uint32Array.from([2729221522,2511211861,3996745489,4234383737,1407876151,483945393])
// • Uint32Array.from([])
// • Uint32Array.from([1188401930,1080708697])
// • Uint32Array.from([4079898471,242967476,1070530418,2475263502,20278390,848810076,2651478600,509283078,418212126])
// • Uint32Array.from([995846483,1424836937,374064787,802080757,2308659264,165366219,2215846049,310244342,1942755427])
// • …

fc.uint32Array({max: 42, minLength: 1})
// Examples of generated values:
// • Uint32Array.from([27,8,29,3,39,34,13,14])
// • Uint32Array.from([3,37,4,3,4,16,40,20,0,21])
// • Uint32Array.from([5,31])
// • Uint32Array.from([40,2,42,42,41])
// • Uint32Array.from([19,5,40])
// • …
```
</details>

<details>
<summary><b>float32Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#float32array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Float32Array_

*&#8195;Signatures*

- `fc.float32Array()`
- `fc.float32Array({min?, max?, noDefaultInfinity?, noNaN?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `-∞` and `-3.4028234663852886e+38` when `noDefaultInfinity:true` — _lower bound for the generated 32-bit floats (included)_
- `max?` — default: `+∞` and `+3.4028234663852886e+38` when `noDefaultInfinity:true` — _upper bound for the generated 32-bit floats (included)_
- `noDefaultInfinity?` — default: `false` — _use finite values for `min` and `max` by default_
- `noNaN?` — default: `false` — _do not generate `Number.NaN`_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.float32Array()
// Examples of generated values:
// • Float32Array.from([2.838487790382467e+22,1.1814616040137283e-28,-1.2447510050843058e-39])
// • Float32Array.from([-7.006492321624085e-45,-9.633964538574219])
// • Float32Array.from([50677384277393410,2.815765430662526e-27,35189715715342990000,-3.809889793395996,1.0517918868948659e+37,8.993062611852643e+32,-2.7968944295546947e-20,-7335792])
// • Float32Array.from([-7.639300007131037e+28,3.3218551999276265e-35,1.811662677611599e-30])
// • Float32Array.from([-267187306496,-4202965385667936000,2.647066979020766e-20,66189066240,0.00006144169310573488])
// • …

fc.float32Array({minLength: 1})
// Examples of generated values:
// • Float32Array.from([-503561310315741200])
// • Float32Array.from([-3.4028220466166163e+38,-1.961817850054744e-44])
// • Float32Array.from([-3.5715513740798766e+36,1.3295048537642752e+23,2262949.5,-0.0000026030456865555607])
// • Float32Array.from([8.539668944857956e-14])
// • Float32Array.from([-5.605193857299268e-45,3.4028181929587916e+38,2.5736176825164795e-23])
// • …
```
</details>

<details>
<summary><b>float64Array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#float64array">api</a>]</summary><br/>

*&#8195;Description*

> Generate _Float64Array_

*&#8195;Signatures*

- `fc.float64Array()`
- `fc.float64Array({min?, max?, noDefaultInfinity?, noNaN?, minLength?, maxLength?})`

*&#8195;with:*

- `min?` — default: `-∞` and `-Number.MAX_VALUE` when `noDefaultInfinity:true` — _lower bound for the generated 32-bit floats (included)_
- `max?` — default: `+∞` and `Number.MAX_VALUE` when `noDefaultInfinity:true` — _upper bound for the generated 32-bit floats (included)_
- `noDefaultInfinity?` — default: `false` — _use finite values for `min` and `max` by default_
- `noNaN?` — default: `false` — _do not generate `Number.NaN`_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.float64Array()
// Examples of generated values:
// • Float64Array.from([1.616891650937421e+175,-2.6304053149712647e-306,-4.243132822801271e-219])
// • Float64Array.from([2.5e-323,-54826743.81511721])
// • Float64Array.from([1.7365802452981713e+129,1.320991370898586e+152,9.109051404240327e+291,-3.6562625294902846e-157,-6.9216731040462545e-192,2.4523695375398673e-67,-1045.8897076512326,-1.9672082630551467e-215])
// • Float64Array.from([-1.1080655465042191e+231,5.559295309739158e-243,1.5204711046897551e+296])
// • Float64Array.from([-2.5297510012561425e+91,1.4452619284617389e-161,1.238133303287883e-38,-1.4441430640880058e+187,-9.20327913781559e+267])
// • …

fc.float64Array({minLength: 1})
// Examples of generated values:
// • Float64Array.from([-3.0129659915228672e+141])
// • Float64Array.from([-1.7976931348623157e+308,1.14e-322])
// • Float64Array.from([-1.7441105727027757e+292,3.7278990325311785e+46,-2.97662671796463e-185,-2.0953226219959493e-272])
// • Float64Array.from([1.0842009835971395e-109])
// • Float64Array.from([-8.4e-323,1.7976931348623131e+308,1.1447746735519345e-185])
// • …
```
</details>

## Combinators

### Simple

<details>
<summary><b>constant</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#constant">api</a>]</summary><br/>

*&#8195;Description*

> Always produce the same value
>
> ⚠️ The value will not be cloned by the arbitrary

*&#8195;Signatures*

- `fc.constant(value)`

*&#8195;with:*

- `value` — _value that will be produced by the arbitrary_

*&#8195;Usages*

```js
fc.constant(1)
// Examples of generated values: 1…

fc.constant({})
// Examples of generated values: {}…
```
</details>

<details>
<summary><b>constantFrom</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#constantfrom">api</a>]</summary><br/>

*&#8195;Description*

> One of the values specified as argument
>
> Randomly chooses among the provided values. It considers the first value as the default value so that in case of failure it will shrink to it. It expects a minimum of one value and throws whether it receives no value as parameters. It can easily be used on arrays with `fc.constantFrom(...myArray)`.
>
> ⚠️ The values will not be cloned by the arbitrary

*&#8195;Signatures*

- `fc.constantFrom(...values)`

*&#8195;with:*

- `...values` — _all the values that could possibly be generated by the arbitrary_

*&#8195;Usages*

```js
fc.constantFrom(1, 2, 3)
// Examples of generated values: 1, 3, 2…

fc.constantFrom(1, 'string', {})
// Examples of generated values: "string", {}, 1…
```
</details>

<details>
<summary><b>clonedConstant</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#clonedconstant">api</a>]</summary><br/>

*&#8195;Description*

> Always produce the same value (as `fc.constant`)
>
> If it exists, the method `[fc.cloneMethod]` will be cloned to clone the instance so that it will be unique for each run

*&#8195;Signatures*

- `fc.clonedConstant(value)`

*&#8195;with:*

- `value` — _value that will be produced by the arbitrary_

*&#8195;Usages*

```js
fc.clonedConstant(1)
// Examples of generated values: 1…

// Setup helpers:
function buildCloneable(objectInstance) {
  // Rq: We do not handle deep objects in this snippet
  // But we will get another instance of objectInstance for each run
  // ie. objectInstanceRunA !== objectInstanceRunB while having isEqual(objectInstanceRunA, objectInstanceRunB)
  const withCloneMethod = () => {
    const clone = {...objectInstance};
    Object.defineProperty(objectInstance, fc.cloneMethod, {
      value: withCloneMethod,
      enumerable: false,
    });
    return clone;
  };
  return withCloneMethod();
}
// Use the arbitrary:
fc.clonedConstant(buildCloneable({ keyA: 1, keyB: 2 }))
// Examples of generated values: {"keyA":1,"keyB":2}…
```
</details>

<details>
<summary><b>option</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#option">api</a>]</summary><br/>

*&#8195;Description*

> Randomly chooses between producing a value using the underlying arbitrary or returning nil

*&#8195;Signatures*

- `fc.option(arb)`
- `fc.option(arb, {freq?, nil?, depthFactor?, maxDepth?, depthIdentifier?})`
- _`fc.option(arb, freq)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `arb` — _arbitrary that will be called to generate normal values_
- `freq?` — default: `5` — _probability to build the nil value is of 1 / freq_
- `nil?` — default: `null` — _nil value_
- `depthFactor?` — default: `0` — _this factor will be used to increase the probability to generate nil values as we go deeper in a recursive structure_
- `maxDepth?` — default: `Number.POSITIVE_INFINITY` — _when reaching maxDepth, only nil could be produced_
- `depthIdentifier?` — default: `undefined` — _share the depth between instances using the same `depthIdentifier`_

*&#8195;Usages*

```js
fc.option(fc.nat())
// Examples of generated values: null, 773390791, 2147483625, 25, 2039519833…

fc.option(fc.nat(), { freq: 2 })
// Examples of generated values: 214938453, 2147483645, 2130844098, 748471782, null…

fc.option(fc.nat(), { freq: 2, nil: Number.NaN })
// Examples of generated values: 2147483617, Number.NaN, 259062763, 13, 23…

fc.option(fc.string(), { nil: undefined })
// Examples of generated values: "^_|\"T.5rB", "&&", "OqA3D$", undefined, "}"…

// fc.option fits very well with recursive stuctures built using fc.letrec.
// Examples of such recursive structures are available with fc.letrec.
```
</details>

<details>
<summary><b>oneof</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#oneof">api</a>]</summary><br/>

*&#8195;Description*

> Generate one value based on one of the passed arbitraries
>
> Randomly chooses an arbitrary at each new generation. Should be provided with at least one arbitrary. All arbitraries are equally probable and shrink is still working for the selected arbitrary. `fc.oneof` is able to shrink inside the failing arbitrary but not across arbitraries (contrary to `fc.constantFrom` when dealing with constant arbitraries).

*&#8195;Signatures*

- `fc.oneof(...arbitraries)`
- `fc.oneof({withCrossShrink?, maxDepth?, depthIdentifier?}, ...{ arbitrary, weight })`

*&#8195;with:*

- `...arbitraries` — _arbitraries that could be used to generate a value_
- `withCrossShrink?` — default: `false` — _in case of failure the shrinker will try to check if a failure can be found by using the first specified arbitrary. It may be pretty useful for recursive structures as it can easily help reducing their depth in case of failure_
- `depthFactor?` — default: `0` — _this factor will be used to increase the probability to generate instances of the first passed arbitrary_
- `maxDepth?` — default: `Number.POSITIVE_INFINITY` — _when reaching maxDepth, the first arbitrary will be used to generate the value_
- `depthIdentifier?` — default: `undefined` — _share the depth between instances using the same `depthIdentifier`_

*&#8195;Usages*

```js
fc.oneof(fc.char(), fc.boolean())
// Examples of generated values: "&", false, true, "@", "2"…

fc.oneof(fc.char(), fc.boolean(), fc.nat())
// Examples of generated values: true, 234471686, 485911805, false, "\\"…

// fc.oneof fits very well with recursive stuctures built using fc.letrec.
// Examples of such recursive structures are available with fc.letrec.
```
</details>

<details>
<summary><b>frequency</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#frequency">api</a>]</summary><br/>

*&#8195;Description*

> Generate one value based on one of the passed arbitraries
>
> Randomly chooses an arbitrary at each new generation. Should be provided with at least one arbitrary. Probability to select a specific arbitrary is based on its weight, the higher it is the more it will be probable. It preserves the shrinking capabilities of the underlying arbitrary.
>
> **Warning:** In the upcomping major releases of fast-check the first arbitrary specified on `frequency` will have a privileged position. Constraints like `withCrossShrink` tend to favor it over others and will probably be enabled by default.

*&#8195;Signatures*

- `fc.frequency(...{ arbitrary, weight })`
- `fc.frequency({withCrossShrink?, maxDepth?, depthIdentifier?}, ...{ arbitrary, weight })`

*&#8195;with:*

- `...{ arbitrary, weight }` — _arbitraries that could be used to generate a value along their weight (the higher the weight, the higher the probability to select this arbitrary will be)_
- `withCrossShrink?` — default: `false` — _in case of failure the shrinker will try to check if a failure can be found by using the first specified arbitrary (if and only if its weight is strictly greater than 0). It may be pretty useful for recursive structures as it can easily help reducing their depth in case of failure_
- `depthFactor?` — default: `0` — _this factor will be used to increase the probability to generate instances of the first passed arbitrary if its weight is not zero_
- `maxDepth?` — default: `Number.POSITIVE_INFINITY` — _when reaching maxDepth, the first arbitrary will be used to generate the value even if its weight is zero_
- `depthIdentifier?` — default: `undefined` — _share the depth between instances using the same `depthIdentifier`_

*&#8195;Usages*

```js
fc.frequency(
  { arbitrary: fc.char(), weight: 2 },
  { arbitrary: fc.boolean(), weight: 1 }
)
// Examples of generated values: true, "&", "8", false, "["…

fc.frequency(
  { withCrossShrink: true },
  { arbitrary: fc.boolean(), weight: 2 },
  { arbitrary: fc.array(fc.boolean()), weight: 1 }
)
// Note: In case of failure on an array of boolean values the shrinker will first try to check
// if a failure can also be triggered with a simple boolean (the first arbitrary specified)
// if not it will carry on the classical shrinking strategy defined for arrays of boolean.
// Examples of generated values: true, [true,false], [true,false,false], [false,true,true], [false]…

// fc.frequency fits very well with recursive stuctures built using fc.letrec.
// Examples of such recursive structures are available with fc.letrec.
```
</details>

<details>
<summary><b>mapToConstant</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#maptoconstant">api</a>]</summary><br/>

*&#8195;Description*

> Map indexes to values
>
> Generates non-contiguous ranges of values by mapping integer values to constant.

*&#8195;Signatures*

- `fc.mapToConstant(...{ num, build })`

*&#8195;with:*

- `...{ num, build }` — _describe how to map integer values to their final values. For each entry, the entry defines `num` corresponding to the number of integer values it covers and `build`, a method that will produce a value given an integer in the range `0` (included) to `num - 1` (included)_

*&#8195;Usages*

```js
fc.mapToConstant(
  { num: 26, build: v => String.fromCharCode(v + 0x61) },
  { num: 10, build: v => String.fromCharCode(v + 0x30) },
)
// Examples of generated values: "9", "4", "b", "d", "7"…
```
</details>

<details>
<summary><b>clone</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#clone">api</a>]</summary><br/>

*&#8195;Description*

> Multiple identical values (they might not equal in terms of `===` or `==`)
>
> Generate tuple containing multiple instances of the same value - values are independent from each others.

*&#8195;Signatures*

- `fc.clone(arb, numValues)`

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_
- `numValues` — _number of clones (including itself)_

*&#8195;Usages*

```js
fc.clone(fc.nat(), 2)
// Examples of generated values: [1458194344,1458194344], [1974332592,1974332592], [605246308,605246308], [187149619,187149619], [1325928130,1325928130]…

fc.clone(fc.nat(), 3)
// Examples of generated values:
// • [1075303821,1075303821,1075303821]
// • [1289535362,1289535362,1289535362]
// • [479824585,479824585,479824585]
// • [61543881,61543881,61543881]
// • [1082205096,1082205096,1082205096]
// • …
```
</details>

<details>
<summary><b>dedup</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#dedup">api</a>]</summary><br/>

*&#8195;Description*

> Multiple identical values (they might not equal in terms of `===` or `==`)
>
> Generate tuple containing multiple instances of the same value - values are independent from each others.

*&#8195;Signatures*

- _`fc.dedup(arb, numValues)`_ — _deprecated, prefer `fc.clone` instead_

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_
- `numValues` — _number of clones (including itself)_

*&#8195;Usages*

```js
fc.dedup(fc.nat(), 2)
// Examples of generated values: [1458194344,1458194344], [1974332592,1974332592], [605246308,605246308], [187149619,187149619], [1325928130,1325928130]…

fc.dedup(fc.nat(), 3)
// Examples of generated values:
// • [1075303821,1075303821,1075303821]
// • [1289535362,1289535362,1289535362]
// • [479824585,479824585,479824585]
// • [61543881,61543881,61543881]
// • [1082205096,1082205096,1082205096]
// • …
```
</details>

### Array

<details>
<summary><b>tuple</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#tuple">api</a>]</summary><br/>

*&#8195;Description*

> Generate _tuples_ - or more precisely arrays - by aggregating the values generated by its underlying arbitraries.

*&#8195;Signatures*

- `fc.tuple(...arbitraries)`

*&#8195;with:*

- `...arbitraries` — _arbitraries that should be used to generate the values of our tuple_

*&#8195;Usages*

```js
fc.tuple(fc.nat())
// Examples of generated values: [2147483621], [28], [2147483641], [242661188], [263784372]…

fc.tuple(fc.nat(), fc.string())
// Examples of generated values: [2147483619,"6*xn_VkQ"], [12,"!Z}%Y"], [468194571,"*_J"], [14,"2&0"], [5,"&S"]…
```
</details>

<details>
<summary><b>genericTuple</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#generictuple">api</a>]</summary><br/>

*&#8195;Description*

> Generate _tuples_ - or more precisely arrays - by aggregating the values generated by its underlying arbitraries.
>
> Note: This arbitrary is mostly there for typings related needs. Most of the time, `fc.tuple` will do the job.

*&#8195;Signatures*

- `fc.genericTuple(arbitraries)` — _deprecated since v2.14.0_

*&#8195;with:*

- `arbitraries` — _arbitraries that should be used to generate the values of our tuple_

*&#8195;Usages*

```js
fc.genericTuple([fc.nat()])
// Examples of generated values: [1322560433], [472890492], [1878169203], [1642558158], [343133589]…

fc.genericTuple([fc.nat(), fc.string()])
// Examples of generated values: [498298066,"xx]ZF."], [1035210183,"x{Y"], [2147483646,"kAw19&5T"], [2147483640,"ZY{&DB+5-Y"], [21,"RN6Cb1a:"]…
```
</details>

<details>
<summary><b>array</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#array">api</a>]</summary><br/>

*&#8195;Description*

> Array of random length containing values generated by `arb`

*&#8195;Signatures*

- `fc.array(arb)`
- `fc.array(arb, {minLength?, maxLength?})`
- _`fc.array(arb, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.array(arb, minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_

*&#8195;Usages*

```js
fc.array(fc.nat())
// Examples of generated values:
// • []
// • [1044253015,881466391,1911917064,3,2147483643,11,1097098198,2147483640,292366054,2147483642]
// • [1644861079]
// • [624842423,32338439,1321248893,980127887,850807339,1583851385,1093421004]
// • [505677510,559592731,1931700591,729662778,1771367027]
// • …

fc.array(fc.nat(), {minLength: 3})
// Examples of generated values:
// • [758331231,398217079,312666176,53143294,521680871,1862921771,1710362589,983796605,1814936084]
// • [1097867707,1901779976,13,49685271,2147483645,973337534,1612556434,2147483620]
// • [15,156619197,2147483622,0,845007549,1361626270,314708047,437471639]
// • [6,26,17]
// • [2147483640,4,12]
// • …

fc.array(fc.nat(), {maxLength: 3})
// Examples of generated values: [], [1097867707], [15,156619197,2147483622], [1360904164,1953451342,1651990695], [1771169783]…

fc.array(fc.nat(), {minLength: 5, maxLength: 7})
// Examples of generated values:
// • [4,26,725992281,7,1186699848,180356277]
// • [1503239805,742382696,478977019,1206184056,992934701,1081616342]
// • [1396368269,227325306,1918884399,1141338513,1861390920,1771550203,750875810]
// • [20,668325235,1112668370,7,8,847065979]
// • [19,3,15,16,117940422,25]
// • …
```
</details>

<details>
<summary><b>set</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#set">api</a>]</summary><br/>

*&#8195;Description*

> Array of random length containing unique values generated by `arb`
>
> All the values in the set are unique given the provided `compare` function.

*&#8195;Signatures*

- `fc.set(arb)`
- `fc.set(arb, {minLength?, maxLength?, compare?})`
- _`fc.set(arb, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.set(arb, minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.set(arb, compare)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.set(arb, maxLength, compare)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_
- _`fc.set(arb, minLength, maxLength, compare)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `2 * minLength + 10` — _maximal length (included)_
- `compare?` — default: `(a, b) => a === b` — _custom compare function used to distinguish duplicates in order to remove them from the resulting array_

*&#8195;Usages*

```js
fc.set(fc.nat(99))
// Examples of generated values: [], [15,91,64,4,96,0,98,95,2,94], [79], [23,39,93,87,85,4,21], [58,31,39,26,75]…

fc.set(fc.nat(99), {maxLength: 3})
// Examples of generated values: [], [55], [2,97,98], [12,90,43], [31]…

fc.set(fc.nat(99), {minLength: 5, maxLength: 7})
// Examples of generated values: [4,3,29,1,48,25], [53,44,67,56,49,42], [69,6,47,13,20,3,58], [5,35,70,0,6,27], [3,5,0,70,6,20]…

fc.set(fc.hexaString(), {compare: (s1, s2) => s1.length === s2.length})
// Note: Resulting arrays will never contain two strings with the same number of characters
// Examples of generated values: ["20",""], [], ["447","","893c89edb1","b31a5"], ["79429d9",""], ["0","c20ea408b9","1f1574","117d"]…

fc.set(fc.hexaString(), {minLength: 5, maxLength: 10, compare: (s1, s2) => s1.length === s2.length})
// Note: Resulting arrays will never contain two strings with the same number of characters and it will contain between 5 and 10 strings
// Examples of generated values:
// • ["","18028609c9","8b9e4d","bd945ddc","7262","63636"]
// • ["7e","59ae73fd9","d200d","d504","","4d18e69a","fb2"]
// • ["65655ac0b","c20","02f6","42ff080184","80","f04e066",""]
// • ["320","","1e","1","2ce0","5fb80","41265c649c"]
// • ["","b","cb03601","e3","052844fe0a","c410","82cfcb523"]
// • …
```
</details>

<details>
<summary><b>subarray</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#subarray">api</a>]</summary><br/>

*&#8195;Description*

> Generate values corresponding to any possible sub-array of an original array
>
> Values of the resulting subarray are ordered the same way they were in the original array.

*&#8195;Signatures*

- `fc.subarray(originalArray)`
- `fc.subarray(originalArray, {minLength?, maxLength?})`
- _`fc.subarray(originalArray, minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `originalArray` — _the array from which we want to extract sub-arrays_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `originalArray.length` — _maximal length (included)_

*&#8195;Usages*

```js
fc.subarray([1, 42, 48, 69, 75, 92])
// Examples of generated values: [48,69,75,92], [75,92], [], [48,75], [1,42,48,75,92]…

fc.subarray([1, 42, 48, 69, 75, 92], {minLength: 5})
// Examples of generated values: [1,42,69,75,92], [1,42,48,69,75], [1,42,48,69,92], [1,42,48,69,75,92], [42,48,69,75,92]…

fc.subarray([1, 42, 48, 69, 75, 92], {maxLength: 5})
// Examples of generated values: [1,69,75,92], [42,48,69,75], [42], [69], [42,48,92]…

fc.subarray([1, 42, 48, 69, 75, 92], {minLength: 2, maxLength: 3})
// Examples of generated values: [42,75], [42,69], [1,75,92], [48,92], [42,48,92]…
```
</details>

<details>
<summary><b>shuffledSubarray</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#shuffledsubarray">api</a>]</summary><br/>

*&#8195;Description*

> Generate values corresponding to any possible sub-array of an original array
>
> Values of the resulting subarray are ordered randomly.

*&#8195;Signatures*

- `fc.shuffledSubarray(originalArray)`
- `fc.shuffledSubarray(originalArray, {minLength?, maxLength?})`
- _`fc.shuffledSubarray(originalArray, minLength, maxLength)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `originalArray` — _the array from which we want to extract sub-arrays_
- `minLength?` — default: `0` — _minimal length (included)_
- `maxLength?` — default: `originalArray.length` — _maximal length (included)_

*&#8195;Usages*

```js
fc.shuffledSubarray([1, 42, 48, 69, 75, 92])
// Examples of generated values: [75], [75,48], [92], [75,92], [1,75]…

fc.shuffledSubarray([1, 42, 48, 69, 75, 92], {minLength: 5})
// Examples of generated values: [42,92,1,69,48], [48,1,42,75,69,92], [92,1,75,42,48,69], [92,1,42,48,69], [92,1,69,42,75,48]…

fc.shuffledSubarray([1, 42, 48, 69, 75, 92], {maxLength: 5})
// Examples of generated values: [], [48,1,42], [92,1,75], [92], [92,1,69,42,75]…

fc.shuffledSubarray([1, 42, 48, 69, 75, 92], {minLength: 2, maxLength: 3})
// Examples of generated values: [69,1], [92,1], [69,92], [69,42,1], [75,1]…
```
</details>

<details>
<summary><b>sparseArray</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#sparsearray">api</a>]</summary><br/>

*&#8195;Description*

> Sparse array of random length containing values generated by `arb`.
> 
> By default, the generated array may end by a hole (see `noTrailingHole`).

*&#8195;Signatures*

- `fc.sparseArray(arb)`
- `fc.sparseArray(arb, {maxLength?, minNumElements?, maxNumElements?, noTrailingHole?})`

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_
- `minNumElements?` — default: `0` — _minimal number of elements (included)_
- `maxNumElements?` — default: `2 * minNumElements + 10` — _maximal number of elements (included)_
- `maxLength?` — default: min(`2 * maxNumElements + 10`, `4294967295`) — _maximal length (included) - length includes elements but also holes for sparse arrays_
- `noTrailingHole?` — default: `false` — _when enabled, all generated arrays will either be the empty array or end by a non-hole_

*&#8195;Usages*

```js
fc.sparseArray(fc.nat(), {maxLength: 20})
// Examples of generated values:
// • [,,1586792878,,,,,,,,,,,,1689947645,,,,,,]
// • [,,,1948811386,,1854442270,,,1229050246,,1185002503,572805240,1707351091,,,,,1046941565,,,]
// • [,,,,,,,,,,,,,,,,,,,,]
// • [,,,,896059968,,,,,,,,,,,,]
// • [2147483636,15,1308253671,,,2147483637,,,,,,,,,,,11,,,,]
// • …

fc.sparseArray(fc.nat(), {maxLength: 20, minNumElements: 1, maxNumElements: 3})
// Examples of generated values:
// • [,,,,,263508609,,,,,,,,,,,,,,,]
// • [,,,,,,,,,,1014930196,,,,,,,,]
// • [,170533977,,]
// • [,309998866,,,,1882833716,,,]
// • [7,,21,,,,,,,,,,30,,,]
// • …

fc.sparseArray(fc.nat(), {maxLength: 20, noTrailingHole: true})
// Examples of generated values:
// • [,,,1241501051,269051095,392920841,,,,,,1786812914,876995905]
// • [,,,748833099]
// • [,,,25,,,,,,,,,,,,9,,,1300755505]
// • [,450394074,,,,1990006143,,1762425504,,1295052026,979115506,,891113643,,1920597213,1280943861,,517193993]
// • []
// • …

fc.sparseArray(fc.nat())
// Examples of generated values:
// • [,,,,7,,,,,,,,,,,,,,]
// • [,4687207,,,,,,,,,,,,,,,,,,,,,,,,535782498,,]
// • [,,2147483632,,29,,,,,,,,,,,444714173,,1935118950,,,,,791160306,1071842921,,,1476433628,,]
// • [,,783209689,,,1953708154,,,,,1993296911,,,273021873,187425710,,,956947530,,2043763242,,,,,,,1016859405,,651418517,1700974328]
// • [,661680466,,,,,,,,,1637939285,,,,,,,,,,,,1286355118,,,,]
// • …
```
</details>

<details>
<summary><b>infiniteStream</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#infinitestream">api</a>]</summary><br/>

*&#8195;Description*

> Generate infinite `Stream` of values generated by `arb`.
>
> The `Stream` structure provided by fast-check implements `IterableIterator<T>` and comes with useful helpers to manipulate it.

*&#8195;Signatures*

- `fc.infiniteStream(arb)`

*&#8195;with:*

- `arb` — _arbitrary instance responsible to generate values_

*&#8195;Usages*

```js
fc.infiniteStream(fc.nat(9))
// Examples of generated values:
// • Stream(5,2,2,1,3,9,9,8,9,9...)
// • Stream(1,0,8,1,6,8,6,7,7,7...)
// • Stream(0,4,6,5,2,3,5,3,2,1...)
// • Stream(2,5,0,0,1,9,9,0,7,3...)
// • Stream(2,4,9,4,0,8,8,4,2,2...)
// • …
```
</details>

### Object

<details>
<summary><b>dictionary</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#dictionary">api</a>]</summary><br/>

*&#8195;Description*

> Generate dictionaries containing keys generated using `keyArb` and values generated by `valueArb`

*&#8195;Signatures*

- `fc.dictionary(keyArb, valueArb)`

*&#8195;with:*

- `keyArb` — _arbitrary instance responsible to generate keys_
- `valueArb` — _arbitrary instance responsible to generate values_

*&#8195;Usages*

```js
fc.dictionary(fc.string(), fc.string())
// Examples of generated values:
// • {"+":"iM#O7X(G58"}
// • {"y":"rm<45]&THs","KTzJY!":"%","":"<2Khdb","q+& ":""}
// • {"H=>.L$K":";j %u9","PT":"l[jR4C"}
// • {"}9":"xp/g?g","'M":"UbM/K","534pHy":"T/","Z":"","9V02D":"xG#","r+hJ":"\"K"}
// • {"vT`":"~yWotB,m@1","LRwi":",kU~9",",qZ8":"ckz-r^?@","zQP=-!BC":";:S","dA+b<f-\"3T":"[if y\\"}
// • …

fc.dictionary(fc.string(), fc.nat())
// Examples of generated values:
// • {"":1389984732,"Yp$g&t^dp]":1638300335,"+":438403284,"41ST4G":1593876328,"sZ=":474921142,"wjFpf":912590676,"tFK(!":547671001,"Ot=":1404889232}
// • {"BS9-o":1729454479,"OQYWH":1003935961,"a{6S(OQ?\"":1204427717,"n6wY":452693617,"L":1919551662,"KlqB{{":360825924,"":1745761795,"#h#S$":1570990143,"G%":1211363041,"=.":158635507}
// • {}
// • {"Fb+6vZ=< ":589373246,"8}r":17}
// • {"4":57689789,"d":2049278068,".b3n,":1846889886,":E":887324279,"*9\\$WNce":108003991}
// • …
```
</details>

<details>
<summary><b>record</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#record">api</a>]</summary><br/>

*&#8195;Description*

> Generate records using the incoming arbitraries to generate its values
>
> It comes very useful when dealing with settings.

*&#8195;Signatures*

- `fc.record(recordModel)`
- `fc.record(recordModel, {requiredKeys?})`
- `fc.record(recordModel, {withDeletedKeys?})`

*&#8195;with:*

- `recordModel` — _structure of the resulting instance_
- `requiredKeys?` — default: `[all keys of recordModel]` — _list of keys that should never be deleted, remark: cannot be used with `withDeletedKeys`_
- `withDeletedKeys?` — default: `false` — _when enabled, record might not generate all keys. `withDeletedKeys: true` is equivalent to `requiredKeys: []`, thus the two options cannot be used at the same time_

*&#8195;Usages*

```js
fc.record({
  id: fc.uuidV(4),
  age: fc.nat(99)
})
// Examples of generated values:
// • {"id":"a7ccc7eb-f854-442c-8000-00132dd1a2df","age":0}
// • {"id":"ffffffee-faae-46b1-af49-0fc500000001","age":1}
// • {"id":"00000005-096b-4556-8000-0007fffffff6","age":3}
// • {"id":"00000018-0013-4000-b935-8db80000000f","age":91}
// • {"id":"1f27c491-000b-4000-96bd-ae4367d1570e","age":93}
// • …

fc.record({
  id: fc.uuidV(4),
  age: fc.nat(99)
}, { requiredKeys: [] })
// Note: Both id and age will be optional values
// Examples of generated values:
// • {"id":"00000000-ffea-4fff-8000-0010220687cc","age":6}
// • {"id":"fac4b0f1-000e-4000-8000-0013d4108685","age":74}
// • {"id":"098dd732-d92d-42e3-8000-0004a6defef0","age":34}
// • {"id":"fffffffa-0007-4000-891f-7a8c033fd020","age":0}
// • {"id":"00000007-217b-48d8-925a-dd0e0000000c","age":3}
// • …

fc.record({
  id: fc.uuidV(4),
  name: fc.constantFrom('Paul', 'Luis', 'Jane', 'Karen'),
  age: fc.nat(99),
  birthday: fc.date({min: new Date("1970-01-01T00:00:00.000Z"), max: new Date("2100-12-31T23:59:59.999Z")})
}, { requiredKeys:['id'] })
// Note: All keys except 'id' will be optional values. id has been marked as required.
// Examples of generated values:
// • {"id":"00000010-e2be-4b98-8d3a-944affffffe2","age":4,"birthday":new Date("2100-12-31T23:59:59.959Z")}
// • {"id":"00000001-0005-4000-bfff-fff03ec646bf","age":48,"birthday":new Date("2069-12-20T11:27:18.998Z")}
// • {"id":"00000003-ffed-4fff-bfff-fff400000012","name":"Jane","birthday":new Date("2028-02-06T17:18:26.370Z")}
// • {"id":"fa5630bc-000f-4000-8000-001600000018","age":0,"birthday":new Date("1970-01-01T00:00:00.039Z")}
// • {"id":"00000018-ffee-4fff-8a22-b8770000001b","age":93}
// • …

fc.record({
  id: fc.uuidV(4),
  age: fc.nat(99)
}, { withDeletedKeys: true })
// Note: Both id and age will be optional values
// Examples of generated values:
// • {"id":"00000004-27f6-48bb-8000-000a69064200","age":3}
// • {"id":"ffffffee-ffef-4fff-8000-0015f69788ee","age":21}
// • {"age":34}
// • {"id":"2db92e09-3fdc-49e6-8000-001b00000007","age":5}
// • {"id":"00000006-0007-4000-8397-86ea00000004"}
// • …
```
</details>

<details>
<summary><b>object</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#object">api</a>]</summary><br/>

*&#8195;Description*

> Generate objects (key/values)

*&#8195;Signatures*

- `fc.object()`
- `fc.object({key?, maxDepth?, maxKeys?, withBigInt?, withBoxedValues?, withDate?, withMap?, withNullPrototype?, withObjectString?, withSet?, withTypedArray?, values?})`

*&#8195;with:*

- `key?` — default: `fc.string()` — _arbitrary responsible to generate keys used for instances of objects_
- `maxDepth?` — default: `2` — _maximal depth for generated objects (Map and Set included into objects)_
- `maxKeys?` — default: `5` — _maximal number of keys in generated objects (Map and Set included into objects)_
- `withBigInt?` — default: `false` — _enable `bigint` - eg.: `1n`_
- `withBoxedValues?` — default: `false` — _enable boxed values - eg.: `new Number(5)`_
- `withDate?` — default: `false` — _enable `Date` - eg.: `new Date('2020-10-14T16:52:36.736Z')`_
- `withMap?` — default: `false` — _enable `Map` - eg.: `new Map([['key', 'value']])`_
- `withNullPrototype?` — default: `false` — _enable objects not defining any prototype - eg.: `Object.create(null)`_
- `withObjectString?` — default: `false` — _enable strings looking as string representations of JavaScript instances - eg.: `"{}"`, `"new Set([1])"`_
- `withSet?` — default: `false` — _enable `Set` - eg.: `new Set([1, 2, 3])`_
- `withTypedArray?` — default: `false` — _enable typed arrays for ints, uints and floats - eg.: `Int8Array.from([1, 2, 3])`_
- `values?` — default: _booleans, numbers, strings, null and undefined_ — _array of arbitraries producing the root* values - *non-object ones_

*&#8195;Usages*

```js
fc.object()
// Examples of generated values:
// • {"A%":{"KFfpp":"kCR;AFy","R>Ep":"kV(z"},"6@'":[-2.207823197850501e+192,3.1613705103044707e-192,-2.3367076093283915e-31,-3707010.362578603,-7.412739576630256e-130],"HA8":":V:Cm"}
// • {"M{]xTH":{"#n;+\"uJ":-1.7073676461288806e-156,"IBJPt8j*3":"_Vb","&qBA~d":1.3686986067416212e+150},"G_?":[],"":{";PqWCv^qK4":[-3910824142587562],"":-8.676022708683803e+249,"$p$ELwa4":2782667376766209,"8Ei;%":"@8vmt?65","3j":[-5.396595663781126e+218,"&13irr_M","~\\)Xb=L",null]},".W02jL":{"":true},"()b":[[false,true,true,true,true],[null,null],{"":true,"u.*Gz,W_":true,"Ue?27Gm":true}],"O#Rzdz":{"JCZ{g":[false,"OGk ~\"P",6126043138289453,"SK:",true],"jQ":[-1154547227665263]},")fZ$Y3H/":[2797472308099969,[],{"bNV?:2@1-":"%qq+o","xnNe>/Y/":8.713661956243993e+72,"4-..^":false,"":"S"}],"%J)H":[false],"ycMNhu2f^":{}}
// • {"NLpz":true,"\"`guwWV":[{"OjJ U%NIw":null},{"5":-4444658659744845,"5Vyp~\"X-":5222451871432333,"_]Z":5105405761309303,"f*J5crt2@":1810721905015265,"?\\":-6022619223608399},[true,true],[],{}],"qH ":"6iFv`}D","_tK<DY,rJO":"~~]\\ni","6@M^c. ":7122338718932239,"d#`\"4ce6":{"DjT>_><\\N":5243276801299219,"f1jCD":-8658073716259630,"":-739209854622888},";a#":["H",null,undefined,undefined,undefined],"m\"E":["+KF1 6h"," :#`Y","A",">_}","[JQ"]}
// • {}
// • {"qrhd)uEl(b":{},"]fr _{^D":{"1/H-'WwF":{},"(K|5r6O":"tDi'?MuF"},"H":-2.5249124239541926e+105}
// • …

fc.object({
  key: fc.constantFrom('a', 'b', 'c'),
})
// Note: Keys in ['a', 'b', 'c']
// Examples of generated values:
// • {"c":{"c":-4373543690275593,"a":-8390683989876872}}
// • {"b":"h\""}
// • {"b":"aDA:0O%&","c":"ml> Vxr|#Z"}
// • {"a":undefined,"c":{"c":[-2744422.7404951486,-1.8345110504699604e+58,2.569399430912511e+151,1.2315038477032108e+257],"a":{"a":2.0093861895976855e-171},"b":[true,false,false,true,false]},"b":null}
// • {}
// • …

fc.object({
  maxDepth: 0,
})
// Examples of generated values:
// • {"^lx)`P":undefined,"</}}e{{":-5378536758219430,"g21/@#y1B":3.2384309296015956e+137,"ULm U|p<#0":"I#!.^","{sS8U7 %E!":"*=","":false,"*}EBv'":-1638834742805707}
// • {"s!?U&|m":false," !":-3.5873776188748307e-162}
// • {":WEs/srS+":-2.5959099787764842e+98,"b(<":null,"96d^[vb)H":true,"PfnX>":"","d":false,"":null}
// • {"WW!oe%r(1":"FiY","l":null,"aR@~l-ofE*":undefined,"E:' snhE\"}":true," <4QOmI":undefined,":kN3b~6T:#":"2V7Sy8YR%C"}
// • {"y.\"_x":"&o&sq%!"}
// • …

fc.object({
  maxDepth: 1,
})
// Examples of generated values:
// • {"^lx)`P":["}",undefined,5.755964298241165e+294,8.650252904812954e+203,true],"y1B2T":[null,"p<#0cV",2.5422067646942058e-182],".":{"8U7 %E!7U":-7555514265688970,"(DWJ8*}":-5114783085745144,"'W{LK&#z":-2966500009702849,"Xp0>')OQ+V":8374205272976933},"4l,yb3jK":-1.2850048525206176e-283,")VvBQ":{"":-4.3963104972409935e+26,"S\\":-2.6483895616909132e-48},"@l]WFWxM":[-423430403795023],"<vH":[-9.483743119430094e-141,undefined]}
// • {"s!?U&|m":false," !":{}}
// • {":WEs/srS+":{"lb(<%.BW9":"[vb)HR Z","PfnX>":""},"d":[true,false],"Yo};9P":{"\"t":undefined,"TL+k":false,"K?o":undefined},"= \\BMAD":5530437688841405,"l@n/>|.":"%|>H4JG)JX","hy]tN{L3@V":{}}
// • {"WW!oe%r(1":[true,false,false,false,false],"8a$aR@~l":[],"*qB<GE":["E\"}",true]," <4QOmI":{"":false,"3b~6":false,"#Hs":false,"V7Sy8YR":false},"4;%":null,"}}V5gIZ5v":["B3\"Hr.Vp","/JOM2sXiL"]}
// • {"y.\"_x":{"o&s":2.5774375427541795e-152,"} ?11wrc":Number.NaN}}
// • …


fc.object({
  withBigInt: true,
  withBoxedValues: true,
  withDate: true,
  withMap: true,
  withNullPrototype: true,
  withObjectString: true,
  withSet: true,
  withTypedArray: true,
})
// Examples of generated values:
// • {"xvT&":Int32Array.from([-17,2147483621,-2147483644,1556900347,2071464596,-1393559138,-1727276306,-2147483618]),"u#qsXXTvp":-50616070339577782226631178415259058882613774486766356322822085931554199999723n,"-U{3":"t<?]J"}
// • {"Rsv1:ZP":Int32Array.from([168230707,-730230161,-1469484660,-1063102817,-1909954805,1585343329,-1514159647,-125465986]),"&fXK":new Boolean(true),"4C`-+":new Set([new Map([]),new Set([true,new String("b"),false]),{},{"new Number(1e-322)":new String("k7_9"),"g|[D":new String("O<m)"),"Z%Wn":new String("(]eXm")},[4552479110689169,4675734694908225,-218263686181815,-6997435526521811]])}
// • {"p?EZci9K7":Object.assign(Object.create(null),{"Je":new String("vBJ>``Y$x"),"?ErP@8f!\"":new String(""),"":new String("%=o2Y7C0'")}),"":new Number(5.637087698537716e+284),"b(0#":Object.assign(Object.create(null),{"Q]s0xIyk<+":"(vi`]/Q.I",")Ie":null,"{`qiQ5Ix2f":null,".":undefined})}
// • {"};;j/k&2T":{"new Date(\"+220664-08-31T16:38:43.894Z\")":-2289144276660280,"cXLsbV S":1138144113824397},"teD^Ev":"[new Number(-1.5364199974582094e+205),new Number(5.180815866347032e+247),new Number(3.636439525223476e-281)]","!#(o3t":{"1vv":undefined,"wH{;tJ":null},"k{Xkv":{},"":new Set([]),"}":{"false":{"null":true,"kV}Hc*yU,.":true,";Wznpcq":false,"&CH+'X":false}},"j~eyB74Rh?":49587643957724736099798206802098808050113982603655206841016803270013097640979n,"lndQOiBz":{}}
// • {"RrAs^,;_'d":new Set([]),"cx:<rwea":"new Date(\"+020332-01-16T05:46:46.152Z\")","":Object.assign(Object.create(null),{"L'jRbo{j":-31976587169846070239654687470021029877524367311417431076643014306029456266120n,"';}PmFHH![":Float64Array.from([-8.018908485009337e+30,8.496864005059645e+201,-3.9194568152035106e+268,-3.086464372465133e+126,3.7461513350649476e+307,1.8080540145972749e-16,-3.302613637232917e-16,2.919782715590315e-98,5.497279242648775e-209]),"<!a}uk":Object.assign(Object.create(null),{"h!+#q":new Number(-2.201858778700874e-229),"new String(\"'Hw,fY\")":new Number(1.9321238697686743e+278),"&=v":new Number(2.48097849447125e-108),"":new Number(2.3558707057762255e-53)}),"ineIR":new Boolean(false)})}
// • …
```
</details>

<details>
<summary><b>jsonObject</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#jsonobject">api</a>]</summary><br/>

*&#8195;Description*

> Generate any object eligible to be stringified in JSON and parsed back to itself - _in other words, JSON compatible instances_

*&#8195;Signatures*

- `fc.jsonObject()`
- `fc.jsonObject({maxDepth?})`
- _`fc.jsonObject(maxDepth)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `maxDepth?` — default: `2` — _maximal depth for generated objects (Map and Set included into objects)_

*&#8195;Usages*

```js
fc.jsonObject()
// Examples of generated values:
// • -6.0839481205200126e+47
// • {"8-b;+Ua":-2.260222054934251e-89,"jgMZ$w|b.":-5.736889009682019e+133}
// • [false,false,true,true,false]
// • false
// • [[32,-9007199254740968]]
// • …

fc.jsonObject({maxDepth: 0})
// Examples of generated values: 892026606610285, "C{X%3]Q$U", "M}7xc\" _", true, null…

fc.jsonObject({maxDepth: 1})
// Examples of generated values: 892026606610285, {"{":true,"Q$":null}, "M}7xc\" _", {".b?^O.":"","D1$L":"zDJWs","j*s 9%":"",".":"0N|^?8"}, {}…
```
</details>

<details>
<summary><b>unicodeJsonObject</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#unicodejsonobject">api</a>]</summary><br/>

*&#8195;Description*

> Generate any object eligible to be stringified in JSON and parsed back to itself - _in other words, JSON compatible instances_

*&#8195;Signatures*

- `fc.unicodeJsonObject()`
- `fc.unicodeJsonObject({maxDepth?})`
- _`fc.unicodeJsonObject(maxDepth)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `maxDepth?` — default: `2` — _maximal depth for generated objects (Map and Set included into objects)_

*&#8195;Usages*

```js
fc.unicodeJsonObject()
// Examples of generated values: false, [[-5431499166376752,50620.20023332868]], "⠵䟵谉ꏊ㓰捛멮켜", null, [null,null,null,null]…

fc.unicodeJsonObject({maxDepth: 0})
// Examples of generated values: 2.67e-322, -8e-323, true, 9007199254740987, 1.7976931348623151e+308…

fc.unicodeJsonObject({maxDepth: 1})
// Examples of generated values:
// • 2.67e-322
// • {"减":null,"鲊ਉ뉄":null,"罧癤鷢൜牶":null,"횆쐌淪燀쯠蝒熹཯":null,"":null}
// • {"ꁺ척蜱젿됻⫄":true,"㠰䵤᧳ꊺ蹀":true,"劸웤鯁냠漼ⳍ㧞ﰗἭ∎":false}
// • []
// • ["疘쥱"]
// • …
```
</details>

<details>
<summary><b>anything</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#anything">api</a>]</summary><br/>

*&#8195;Description*

> Generate any kind of entities

*&#8195;Signatures*

- `fc.anything()`
- `fc.anything({key?, maxDepth?, maxKeys?, withBigInt?, withBoxedValues?, withDate?, withMap?, withNullPrototype?, withObjectString?, withSet?, withTypedArray?, values?})`

*&#8195;with:*

- `key?` — default: `fc.string()` — _arbitrary responsible to generate keys used for instances of objects_
- `maxDepth?` — default: `2` — _maximal depth for generated objects (Map and Set included into objects)_
- `maxKeys?` — default: `5` — _maximal number of keys in generated objects (Map and Set included into objects)_
- `withBigInt?` — default: `false` — _enable `bigint` - eg.: `1n`_
- `withBoxedValues?` — default: `false` — _enable boxed values - eg.: `new Number(5)`_
- `withDate?` — default: `false` — _enable `Date` - eg.: `new Date('2020-10-14T16:52:36.736Z')`_
- `withMap?` — default: `false` — _enable `Map` - eg.: `new Map([['key', 'value']])`_
- `withNullPrototype?` — default: `false` — _enable objects not defining any prototype - eg.: `Object.create(null)`_
- `withObjectString?` — default: `false` — _enable strings looking as string representations of JavaScript instances - eg.: `"{}"`, `"new Set([1])"`_
- `withSet?` — default: `false` — _enable `Set` - eg.: `new Set([1, 2, 3])`_
- `withTypedArray?` — default: `false` — _enable typed arrays for ints, uints and floats - eg.: `Int8Array.from([1, 2, 3])`_
- `withSparseArray?` — default: `false` — _enable sparse arrays - eg.: `[1,,,3]`_
- `values?` — default: _booleans, numbers, strings, null and undefined_ — _array of arbitraries producing the root* values - *non-object ones_

*&#8195;Usages*

```js
fc.anything()
// Examples of generated values:
// • {"s":[-4.4072022896917126e+272,3.439050850697345e+103],"@sWtR%)`":{},"d;,GhNB":{"66":"2Jagm0~","eN\\y":true,"":true,"xy 45|Z":"-aT@8","XQa^|_IU3^":1.2616016700584982e+82}}
// • 43
// • "&,} ~"
// • {}
// • {"r1AA`>yA":"O!","|uPbIKR":"~|-m_C}_"}
// • …

fc.anything({
  key: fc.constantFrom('a', 'b', 'c'),
})
// Note: Generated objects will come with keys in ['a', 'b', 'c']
// Examples of generated values:
// • {"b":null}
// • [[5.578694493239444e+260,2.3e-322,-1.616149197504394e+145],[null,null],-6464878656125993]
// • {"b":"lSk1?*.]>","a":"4N|>MD","c":"dHW0wYEu!"}
// • {"c":true,"a":false,"b":true}
// • 1.022676058193833e-127
// • …

fc.anything({
  maxDepth: 0,
})
// Note: Only root values
// Examples of generated values: -9007199254740952, 1068292005279453, "<EO", 2.077877004820932e-188, -2.7873486028769266e-78…

fc.anything({
  maxDepth: 1,
})
// Examples of generated values: -9007199254740952, 1068292005279453, "<EO", [], -2.7873486028769266e-78…

fc.anything({
  withBigInt: true,
  withBoxedValues: true,
  withDate: true,
  withMap: true,
  withNullPrototype: true,
  withObjectString: true,
  withSet: true,
  withTypedArray: true,
  withSparseArray: true,
})
// Examples of generated values:
// • "new Map([])"
// • Object.assign(Object.create(null),{" ir":"5>|p"})
// • Object.assign(Object.create(null),{"TP":new Date("+119369-09-08T21:50:32.692Z"),"+w[3w6":Object.assign(Object.create(null),{"=":new String("!!9"),"{|){\"[":new String("~~$"),"Kxx":new String("SfM`"),"\"w\\'{d4$)":new String("y|z"),"\"!\"":new String(".\"!")}),"R":{},"|fM":new String("$#B&#&$"),"A":-3643574299506729781124151487342965200249707114662756195372755169163095920767n})
// • new Set([])
// • Int32Array.from([-1929856236])
// • …
```
</details>

### Function

<details>
<summary><b>compareBooleanFunc</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#comparebooleanfunc">api</a>]</summary><br/>

*&#8195;Description*

> Generate a comparison function taking two parameters `a` and `b` and producing a boolean value.
>
> `true` means that `a < b`, `false` that `a = b` or `a > b`

*&#8195;Signatures*

- `fc.compareBooleanFunc()`

*&#8195;Usages*

```js
fc.compareBooleanFunc()
// Examples of generated values:
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-1984194606' + stringify(a)) % 1019120836;
//     const hB = hash('-1984194606' + stringify(b)) % 1019120836;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-1859641033' + stringify(a)) % 19;
//     const hB = hash('-1859641033' + stringify(b)) % 19;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('1845341787' + stringify(a)) % 2;
//     const hB = hash('1845341787' + stringify(b)) % 2;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('1127181441' + stringify(a)) % 3255607487;
//     const hB = hash('1127181441' + stringify(b)) % 3255607487;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-26' + stringify(a)) % 3334963066;
//     const hB = hash('-26' + stringify(b)) % 3334963066;
//     return cmp(hA, hB);
//   }
// • …
```
</details>

<details>
<summary><b>compareFunc</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#comparefunc">api</a>]</summary><br/>

*&#8195;Description*

> Generate a comparison function taking two parameters `a` and `b` and producing an integer value.
>
> Output is zero when `a` and `b` are considered to be equivalent. Output is strictly inferior to zero means that `a` should be considered strictly inferior to `b` (similar for strictly superior to zero)

*&#8195;Signatures*

- `fc.compareFunc()`

*&#8195;Usages*

```js
fc.compareFunc()
// Examples of generated values:
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('1501554938' + stringify(a)) % 18;
//     const hB = hash('1501554938' + stringify(b)) % 18;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-700879918' + stringify(a)) % 386108697;
//     const hB = hash('-700879918' + stringify(b)) % 386108697;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-579121620' + stringify(a)) % 8;
//     const hB = hash('-579121620' + stringify(b)) % 8;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('1112768059' + stringify(a)) % 242967477;
//     const hB = hash('1112768059' + stringify(b)) % 242967477;
//     return cmp(hA, hB);
//   }
// • function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-235565807' + stringify(a)) % 1424836938;
//     const hB = hash('-235565807' + stringify(b)) % 1424836938;
//     return cmp(hA, hB);
//   }
// • …
```
</details>

<details>
<summary><b>func</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#func">api</a>]</summary><br/>

*&#8195;Description*

> Generate a function producing values using an underlying arbitrary

*&#8195;Signatures*

- `fc.func(arb)`

*&#8195;with:*

- `arb` — _arbitrary responsible to produce the values_

*&#8195;Usages*

```js
fc.func(fc.nat())
// Examples of generated values:
// • function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [1681938411,278250656,2138206756,937216340];
//     return outs[hash('1975998514' + stringify(args)) % outs.length];
//   }
// • function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [28,1046862664,29];
//     return outs[hash('-181015797' + stringify(args)) % outs.length];
//   }
// • function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [1521748689,316610179,1601449343,1057761988,2088580527,1974557534,1618733983,882909472,1739615127];
//     return outs[hash('28' + stringify(args)) % outs.length];
//   }
// • function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [269035825,95461057,227736260,947243235,2103296563,1079794905];
//     return outs[hash('-9' + stringify(args)) % outs.length];
//   }
// • function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [755444117,555135045,511312424,1358336721,939579971,1343197442,421884569,2022508190,140388674];
//     return outs[hash('-708292322' + stringify(args)) % outs.length];
//   }
// • …
```
</details>

### Recursive structures

<details>
<summary><b>letrec</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#letrec">api</a>]</summary><br/>

*&#8195;Description*

> Generate recursive structures
>
> Prefer `fc.letrec` over `fc.memo`. Most of the features offered by `fc.memo` can now be implemented with `fc.letrec`.

*&#8195;Signatures*

- `fc.letrec(builder)`

*&#8195;with:*

- `builder` — _builder function defining how to build the recursive structure, it answers to the signature `(tie) => `object with key corresponding to the name of the arbitrary and with vaue the arbitrary itself. The `tie` function given to builder should be used as a placeholder to handle the recursion. It takes as input the name of the arbitrary to use in the recursion._

*&#8195;Usages*

```js
// Setup the tree structure:
const { tree } = fc.letrec(tie => ({
  // Warning: In version 2.x and before, there is no automatic control over the depth of the generated data-structures.
  //   As a consequence to avoid your data-structures to be too deep, it is highly recommended to add the constraint `depthFactor`
  //   onto your usages of `option`, `oneof` and `frequency` and to put the arbitrary without recursion first.
  // In version 3.x, `depthFactor` and `withCrossShrink` will be enabled by default.
  tree: fc.oneof({depthFactor: 0.5, withCrossShrink: true}, tie('leaf'), tie('node')),
  node: fc.record({
    left: tie('tree'),
    right: tie('tree'),
  }),
  leaf: fc.nat()
}));
// Use the arbitrary:
tree
// Examples of generated values:
// • {"left":5,"right":214707493}
// • {"left":{"left":29,"right":1113327548},"right":{"left":693255074,"right":7}}
// • 2
// • 1879186405
// • 2147483618
// • …

fc.letrec(tie => ({
  node: fc.record({
    value: fc.nat(),
    left: fc.option(tie('node'), {maxDepth: 1, depthIdentifier: 'tree'}),
    right: fc.option(tie('node'), {maxDepth: 1, depthIdentifier: 'tree'}),
  })
})).node
// Note: You can limit the depth of the generated structrures by using the constraint `maxDepth` (see `option`, `oneof` and `frequency`).
//   On the example above we need to specify `depthIdentifier` to share the depth between left and right branches...
// Examples of generated values:
// • {"value":1667728700,"left":{"value":22,"left":null,"right":null},"right":{"value":202444547,"left":null,"right":null}}
// • {"value":674845341,"left":{"value":29,"left":null,"right":null},"right":{"value":1113327548,"left":null,"right":null}}
// • {"value":2147483624,"left":null,"right":{"value":949167600,"left":null,"right":null}}
// • {"value":11,"left":{"value":47603542,"left":null,"right":null},"right":{"value":4,"left":null,"right":null}}
// • {"value":13,"left":null,"right":{"value":23,"left":null,"right":null}}
// • …

fc.letrec(tie => ({
  node: fc.record({
    value: fc.nat(),
    left: fc.option(tie('node'), {maxDepth: 1}),
    right: fc.option(tie('node'), {maxDepth: 1}),
  })
})).node
// ...If we don't specify it, the maximal number of right in a given path will be limited to 1, but may include intermediate left.
//    Thus the resulting trees might be deeper than 1.
// Examples of generated values:
// • {"value":22,"left":{"value":27,"left":null,"right":{"value":13,"left":null,"right":null}},"right":null}
// • {"value":1909660399,"left":{"value":2147483632,"left":null,"right":null},"right":{"value":456478505,"left":{"value":452045085,"left":null,"right":null},"right":null}}
// • {"value":12,"left":{"value":1619318555,"left":null,"right":{"value":27,"left":null,"right":null}},"right":null}
// • {"value":8,"left":null,"right":{"value":1744036864,"left":{"value":1633200200,"left":null,"right":null},"right":null}}
// • {"value":2147483622,"left":{"value":1241600186,"left":null,"right":{"value":92657426,"left":null,"right":null}},"right":null}
// • …

fc.letrec(tie => ({
  tree: fc.frequency({maxDepth: 2}, {arbitrary: tie('leaf'), weight: 0}, {arbitrary: tie('node'), weight: 1}),
  node: fc.record({ left: tie('tree'), right: tie('tree') }),
  leaf: fc.nat()
})).tree
// Note: Exact depth of 2: not more not less.
// Note: If you use multiple `option`, `oneof` or `frequency` to define such recursive structure
//   you may want to specify a `depthIdentifier` so that they share the exact same depth.
//   See examples above for more details.
// Examples of generated values:
// • {"left":{"left":2146012257,"right":5},"right":{"left":4,"right":92286720}}
// • {"left":{"left":17,"right":105221773},"right":{"left":10,"right":1282731170}}
// • {"left":{"left":289678323,"right":1527632810},"right":{"left":1031855048,"right":861569963}}
// • {"left":{"left":1001661803,"right":2147483623},"right":{"left":2147483617,"right":729999584}}
// • {"left":{"left":1517743480,"right":1007350543},"right":{"left":12,"right":2147483643}}
// • …
```

```ts
import * as fc from 'fast-check';

// Specify recursive type explicitly, since TS cannot infer recursive types
type Tree = number | { left: Tree; right: Tree };
// Explicitly specify types of each recursive constructors
const { tree } = fc.letrec<{
  tree: Tree;
  node: { left: Tree; right: Tree };
  leaf: number;
}>((tie) => ({
  tree: fc.oneof(tie('node'), tie('leaf'), tie('leaf')),
  node: fc.record({
    left: tie('tree'),
    right: tie('tree'),
  }),
  leaf: fc.nat(),
}));
```
</details>

<details>
<summary><b>memo</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#memo">api</a>]</summary><br/>

*&#8195;Description*

> Generate recursive structures
>
> ⚠️ Initially `fc.memo` has been designed to offer a higher control over the generated depth. Unfortunately it came with a cost: the arbitrary itself is costly to build.
> Most of the features offered by `fc.memo` can now be done using `fc.letrec` coupled with `fc.option`, `fc.oneof` or `fc.frequency`.
> Whenever possible*, we recommend using `fc.letrec` instead of `fc.memo`.
>
> *But sometimes it is not possible and `fc.memo` will be the way to go.

*&#8195;Signatures*

- `fc.memo(builder)`

*&#8195;with:*

- `builder` — _builder function defining how to build the recursive structure. It receives as input the remaining depth and has to return an arbitrary (potentially another `memo` or itself)_

*&#8195;Usages*

```js
// Setup the tree structure:
const tree = fc.memo(n => fc.oneof(node(n), node(n), leaf())); // double the probability of nodes compared to leaves
const node = fc.memo(n => {
  if (n <= 1) return fc.record({ left: leaf(), right: leaf() });
  return fc.record({ left: tree(), right: tree() }); // tree() is equivalent to tree(n-1)
});
const leaf = fc.nat;
// Use the arbitrary:
tree(2)
// Note: Only produce trees having a maximal depth of 2
// Examples of generated values:
// • {"left":{"left":23,"right":2},"right":{"left":210148030,"right":283093342}}
// • 1883170510
// • 4879206
// • {"left":{"left":2147483622,"right":2147483643},"right":{"left":1297112406,"right":883126194}}
// • {"left":{"left":13,"right":2147483635},"right":{"left":1861062539,"right":20}}
// • …
```
</details>

### More

<details>
<summary><b>.filter</b> - [<a href="https://dubzzz.github.io/fast-check/classes/arbitrary.html#filter">api</a>]</summary><br/>

*&#8195;Description*

> Filter an existing arbitrary

*&#8195;Signatures*

- `.filter(predicate)`

*&#8195;with:*

- `predicate` — _only keeps values such as `predicate(value) === true`_

*&#8195;Usages*

```js
fc.integer().filter(n => n % 2 === 0)
// Note: Only produce even integer values
// Examples of generated values: -757498916, -70006654, 1709734166, 1038114938, 1991604420…

fc.integer().filter(n => n % 2 !== 0)
// Note: Only produce odd integer values
// Examples of generated values: -5, 220007129, -144485771, -17, 194205091…

fc.string().filter(s => s[0] < s[1])
// Note: Only produce strings with `s[0] < s[1]`
// Examples of generated values: "dp]dA+GK", "Sa{6S(", ",hsLWj#=y", "]b", "cd+M."…
```
</details>

<details>
<summary><b>.map</b> - [<a href="https://dubzzz.github.io/fast-check/classes/arbitrary.html#map">api</a>]</summary><br/>

*&#8195;Description*

> Map an existing arbitrary

*&#8195;Signatures*

- `.map(mapper)`

*&#8195;with:*

- `mapper` — _transform the produced value into another one_

*&#8195;Usages*

```js
fc.nat(1024).map(n => n * n)
// Note: Produce only square values
// Examples of generated values: 680625, 441, 422500, 88209, 81…

fc.nat().map(n => String(n))
// Note: Change the type of the produced value from number to string
// Examples of generated values: "2076933868", "2147483636", "1971335630", "260497460", "9"…

fc.tuple(fc.integer(), fc.integer())
  .map(t => t[0] < t[1] ? [t[0], t[1]] : [t[1], t[0]])
// Note: Generate a range [min, max]
// Examples of generated values: [-2147483620,1211945858], [-1079425464,-233690526], [-2147483633,-2], [1592081894,2147483645], [6,25]…

fc.string().map(s => `[${s.length}] -> ${s}`)
// Examples of generated values: "[8] -> 40M;<f/D", "[2] -> 7a", "[2] -> %:", "[2] -> \\$", "[9] -> 0LFg6!aMF"…
```
</details>

<details>
<summary><b>.chain</b> - [<a href="https://dubzzz.github.io/fast-check/classes/arbitrary.html#chain">api</a>]</summary><br/>

*&#8195;Description*

> Flat-Map an existing arbitrary
>
> ⚠️ Be aware that the shrinker of such construct might not be able to shrink as much as possible (more details [here](https://github.com/dubzzz/fast-check/issues/650#issuecomment-648397230))

*&#8195;Signatures*

- `.chain(fmapper)`

*&#8195;with:*

- `fmapper` — _produce an arbitrary based on a generated value_

*&#8195;Usages*

```js
fc.nat().chain(min => fc.tuple(fc.constant(min), fc.integer(min, 0xffffffff)))
// Note: Produce a valid range
// Examples of generated values: [2147483631,2602190685], [722484778,1844243122], [52754604,4294967287], [231714704,420820067], [3983528,3983548]…
```
</details>

## Others

<details>
<summary><b>falsy</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#falsy">api</a>]</summary><br/>

*&#8195;Description*

> Falsy values
>
> Generate falsy values ie. one of: `false`, `null`, `undefined`, `0`, `''`, `Number.NaN` or `0n`.

*&#8195;Signatures*

- `fc.falsy()`

*&#8195;Usages*

```js
fc.falsy()
// Examples of generated values: null, false, 0, Number.NaN, ""…

fc.falsy({ withBigInt: true })
// Examples of generated values: 0, false, Number.NaN, undefined, ""…
```
</details>

<details>
<summary><b>context</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#context">api</a>]</summary><br/>

*&#8195;Description*

> Generate an [instance of `ContextValue`](https://dubzzz.github.io/fast-check/interfaces/contextvalue.html) for each predicate run
>
> `ContextValue` can be used to log stuff within the run itself. In case of failure, the logs will be attached in the counterexample and visible in the stack trace

*&#8195;Signatures*

- `fc.context()`

*&#8195;Usages*

```js
fc.context()
// The produced value - let's call it ctx - can be used as a logger that will be specific to this run (and only this run).
// It can be called as follow: ctx.log('My log')
```
</details>

<details>
<summary><b>commands</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#commands">api</a>]</summary><br/>

*&#8195;Description*

> Iterables of commands
>
> Model based testing approach extends the power of property based testing to state machines.
> It relies on commands or operations that a user can run on the system. Those commands define:
> - pre-condition — confirm whether or not the command can be executed given the current context
> - execution — update a simplified context or _model_ while updating and checking the _real_ system

*&#8195;Signatures*

- `fc.commands(commandArbs)`
- `fc.commands(commandArbs, { disableReplayLog?, maxCommands?, replayPath? })`
- _`fc.commands(commandArbs, maxCommands)`_ — _deprecated since v2.6.0 ([#992](https://github.com/dubzzz/fast-check/issues/992))_

*&#8195;with:*

- `commandArbs` — _array of arbitraries responsible to generate commands_
- `disableReplayLog?` — _disable the display of details regarding the replay for commands_
- `maxCommands?` — _maximal number of commands to generate (included)_
- `replayPath?` — _only used when replaying commands_

*&#8195;Usages*

```js
type Model = { /* stuff */ };
type Real  = { /* stuff */ };

class CommandA extends Command { /* stuff */ };
class CommandB extends Command { /* stuff */ };
// other commands

const CommandsArbitrary = fc.commands([
  fc.constant(new CommandA()),        // no custom parameters
  fc.nat().map(s => new CommandB(s)), // with custom parameter
  // other commands
]);

fc.assert(
  fc.property(
    CommandsArbitrary,
    cmds => {
      const s = () => ({ // initial state builder
          model: /* new model */,
          real:  /* new system instance */
      });
      fc.modelRun(s, cmds);
    }
  )
);
```

Refer to [Model based testing or UI test](./Tips.md#model-based-testing-or-ui-test) for more details.
</details>

<details>
<summary><b>scheduler</b> - [<a href="https://dubzzz.github.io/fast-check/index.html#scheduler">api</a>]</summary><br/>

*&#8195;Description*

> Scheduler for asynchronous tasks

*&#8195;Signatures*

- `fc.scheduler()`
- `fc.scheduler({ act? })`

*&#8195;with:*

- `act` — _ensure that all scheduled tasks will be executed in the right context_

*&#8195;Usages*

Refer to [Race conditions detection](./RaceConditions.md) or [Detect race conditions (quick overview)](./Tips.md#detect-race-conditions) for more details.
</details>

## Going further?

- [API Reference](https://dubzzz.github.io/fast-check/)
- [Advanced arbitraries (guide)](./AdvancedArbitraries.md)
- [Model based testing or UI test](./Tips.md#model-based-testing-or-ui-test)
- [Race conditions detection](./RaceConditions.md)
- [Detect race conditions (quick overview)](./Tips.md#detect-race-conditions)
