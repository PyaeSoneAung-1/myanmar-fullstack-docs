---
title: "TypeScript 5.6 (TypeScript 5.6 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.6 ရဲ့ ထုတ်ပြန်မှုမှတ်စု — nullish/truthy check errors, iterator helper methods, `--strictBuiltinIteratorReturn`, arbitrary module identifiers, `--noUncheckedSideEffectImports`, `--noCheck`, `--build` intermediate errors, region-prioritized diagnostics, commit characters, auto-import exclude patterns နဲ့ notable behavioral changes အကြောင်း"
order: 96
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html"
status: translated
updated: 2026-09-05
---

## Disallowed Nullish and Truthy Checks (Nullish နှင့် Truthy Checks များ ခွင့်မပြုတော့ခြင်း)

တစ်ခါတလေ သင်က regex တစ်ခု ရေးပြီး — အဲဒီအပေါ်မှာ `.test(...)` ကို ခေါ်ဖို့ မေ့သွားတာမျိုး ရှိနိုင်ပါတယ်:

```ts
if (/0x[0-9a-f]/) {
    // Oops! This block always runs.
    // ...
}
```

ဒါမှမဟုတ် `>=` (greater-than-or-equal-to operator) အစား — arrow function တစ်ခုကို ဖန်တီးပေးတဲ့ `=>` ကို မတော်တဆ ရေးမိတာမျိုး ဖြစ်နိုင်ပါတယ်:

```ts
if (x => 0) {
    // Oops! This block always runs.
    // ...
}
```

ဒါမှမဟုတ် `??` နဲ့ default value တစ်ခုကို သုံးဖို့ ကြိုးစားပေမယ့် — `??` ရဲ့ precedence နဲ့ `<` လို comparison operator တစ်ခုကို ရောထွေးမိတာမျိုး ဖြစ်နိုင်ပါတယ်:

```ts
function isValid(value: string | number, options: any, strictness: "strict" | "loose") {
    if (strictness === "loose") {
        value = +value
    }
    return value < options.max ?? 100;
    // Oops! This is parsed as (value < options.max) ?? 100
}

```

ဒါမှမဟုတ် ရှုပ်ထွေးတဲ့ expression တစ်ခုထဲမှာ parenthesis တစ်ခုကို နေရာလွဲ ထားမိတာမျိုး ဖြစ်နိုင်ပါတယ်:

```ts
if (
    isValid(primaryValue, "strict") || isValid(secondaryValue, "strict") ||
    isValid(primaryValue, "loose" || isValid(secondaryValue, "loose"))
) {
    //                           ^^^^ 👀 Did we forget a closing ')'?
}
```

ဒီဥပမာတွေထဲက ဘယ်ဟာမှ author ရည်ရွယ်ထားတဲ့အတိုင်း လုပ်ဆောင်တာ မဟုတ်ပေမယ့် — သူတို့ အားလုံးက တရားဝင် JavaScript code တွေပါ။
အရင်က TypeScript ကလည်း ဒီဥပမာတွေကို တိတ်တဆိတ် လက်ခံခဲ့ပါတယ်။

ဒါပေမယ့် စမ်းသပ်မှု နည်းနည်းနဲ့ပဲ — အပေါ်ကလို သံသယဖြစ်စရာ ဥပမာတွေကို အလံပြခြင်းကနေ bug *အများကြီး အများကြီး*ကို ဖမ်းမိနိုင်တာ တွေ့ခဲ့ပါတယ်။
TypeScript 5.6 မှာ — truthy ဒါမှမဟုတ် nullish check တစ်ခုက သီးခြားနည်းလမ်းတစ်ခုနဲ့ အမြဲတမ်း အကဲဖြတ်မယ်ဆိုတာကို syntactic အရ ဆုံးဖြတ်နိုင်တဲ့အခါ — compiler က ယခုဆို error ထုတ်ပါတယ်။
ဒါကြောင့် အပေါ်က ဥပမာတွေမှာ — errors တွေ စတင်တွေ့ရပါလိမ့်မယ်:

```ts
if (/0x[0-9a-f]/) {
//  ~~~~~~~~~~~~
// error: This kind of expression is always truthy.
}

if (x => 0) {
//  ~~~~~~
// error: This kind of expression is always truthy.
}

function isValid(value: string | number, options: any, strictness: "strict" | "loose") {
    if (strictness === "loose") {
        value = +value
    }
    return value < options.max ?? 100;
    //     ~~~~~~~~~~~~~~~~~~~
    // error: Right operand of ?? is unreachable because the left operand is never nullish.
}

if (
    isValid(primaryValue, "strict") || isValid(secondaryValue, "strict") ||
    isValid(primaryValue, "loose" || isValid(secondaryValue, "loose"))
) {
    //                    ~~~~~~~
    // error: This kind of expression is always truthy.
}
```

ESLint ရဲ့ `no-constant-binary-expression` rule ကို enable လုပ်ခြင်းအားဖြင့်လည်း အလားတူ ရလဒ်တွေ ရနိုင်ပြီး — သူတို့ ရရှိခဲ့တဲ့ ရလဒ်တစ်ချို့ကို [သူတို့ရဲ့ blog post မှာ ကြည့်နိုင်ပါတယ်](https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/);
ဒါပေမယ့် TypeScript လုပ်ဆောင်တဲ့ check အသစ်တွေက ESLint rule နဲ့ အပြည့်အဝ ထပ်တူကျမှု မရှိသလို — ဒီ checks တွေကို TypeScript ထဲမှာတင် တည်ဆောက်ထည့်သွင်းထားတာက တန်ဖိုး အများကြီး ရှိတယ်လို့လည်း ယုံကြည်ပါတယ်။

အချို့သော expressions တွေကတော့ — အမြဲတမ်း truthy ဒါမှမဟုတ် nullish ဖြစ်နေရင်တောင် — ခွင့်ပြုထားဆဲ ဖြစ်တာ သတိပြုပါ။
အတိအကျပြောရရင် — `true`, `false`, `0` နဲ့ `1` တွေက အမြဲတမ်း truthy ဒါမှမဟုတ် falsy ဖြစ်နေပေမယ့် — အောက်ပါလို code က idiomatic ဖြစ်ပြီး အသုံးဝင်နေဆဲမို့ — ခွင့်ပြုထားဆဲ ဖြစ်ပါတယ်:

```ts
while (true) {
    doStuff();

    if (something()) {
        break;
    }

    doOtherStuff();
}
```

ပြီးတော့ အောက်ပါလို code မျိုးက code တွေကို ထပ်ခါထပ်ခါ စမ်းသပ်/အမှားရှာနေတုန်း အသုံးဝင်ပါတယ်:

```ts
if (true || inDebuggingOrDevelopmentEnvironment()) {
    // ...
}
```

Implementation ဒါမှမဟုတ် ၎င်းက ဖမ်းမိတဲ့ bug အမျိုးအစားတွေကို စိတ်ဝင်စားရင် — [ဒီ feature ကို implement လုပ်ခဲ့တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/59217) ကို ကြည့်ပါ။

## Iterator Helper Methods (Iterator Helper Methods များ)

JavaScript မှာ *iterables* (ဆိုလိုတာက — `[Symbol.iterator]()` ကို ခေါ်ပြီး iterator တစ်ခု ရယူခြင်းအားဖြင့် ကျွန်တော်တို့ ဖြတ်သန်း iterate လုပ်နိုင်တဲ့ အရာတွေ) နဲ့ *iterators* (ဆိုလိုတာက — iterate လုပ်နေတုန်း နောက်တန်ဖိုးတစ်ခုကို ရဖို့ ခေါ်နိုင်တဲ့ `next()` method တစ်ခု ရှိတဲ့ အရာတွေ) ဆိုတဲ့ အယူအဆတွေ ရှိပါတယ်။
ယေဘုယျအားဖြင့် — သူတို့ကို `for`/`of` loop တစ်ခုထဲ ထည့်တာပဲဖြစ်ဖြစ် — array အသစ်တစ်ခုထဲ `[...spread]` လုပ်တာပဲဖြစ်ဖြစ် — ဒီအရာတွေကို သင်ပုံမှန် စဉ်းစားစရာ မလိုပါဘူး။
ဒါပေမယ့် TypeScript က ဒါတွေကို `Iterable` နဲ့ `Iterator` types တွေနဲ့ ပုံစံထုတ်ထားပြီး — (နှစ်ခုလုံးအနေနဲ့ ဆောင်ရွက်တဲ့ `IterableIterator` တောင်ပါ!) — ဒီ types တွေက `for`/`of` လို တည်ဆောက်မှုတွေ သူတို့အပေါ် အလုပ်လုပ်ဖို့ လိုအပ်တဲ့ members အစုအဝေး အနည်းဆုံးကို ဖော်ပြပါတယ်။

`Iterable` တွေ (နဲ့ `IterableIterator` တွေ) က JavaScript ထဲက နေရာပေါင်းစုံမှာ သုံးလို့ရလို့ ကောင်းပါတယ် — ဒါပေမယ့် လူအများအပြားက `Array` တွေပေါ်မှာ ရှိတဲ့ `map`, `filter` နဲ့ ဘာကြောင့်လဲမသိ `reduce` လို methods တွေကို လွမ်းနေတာ တွေ့ခဲ့ရပါတယ်။
ဒါကြောင့်မို့ [မကြာသေးမီက ECMAScript မှာ proposal တစ်ခု တင်သွင်းခဲ့ပြီး](https://github.com/tc39/proposal-iterator-helpers) — JavaScript ထဲမှာ ထုတ်လုပ်ခံရတဲ့ `IterableIterator` အများစုအပေါ်ကို `Array` ကနေ methods အများအပြား (နဲ့ နောက်ထပ်တွေပါ) ထည့်ဖို့ ဖြစ်ပါတယ်။

ဥပမာ — generator တိုင်းက ယခုဆို `map` method နဲ့ `take` method ပါရှိတဲ့ object တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

```ts
function* positiveIntegers() {
    let i = 1;
    while (true) {
        yield i;
        i++;
    }
}

const evenNumbers = positiveIntegers().map(x => x * 2);

// Output:
//    2
//    4
//    6
//    8
//   10
for (const value of evenNumbers.take(5)) {
    console.log(value);
}
```

`Map` တွေနဲ့ `Set` တွေပေါ်က `keys()`, `values()` နဲ့ `entries()` လို methods တွေအတွက်လည်း အလားတူပါပဲ။

```ts
function invertKeysAndValues<K, V>(map: Map<K, V>): Map<V, K> {
    return new Map(
        map.entries().map(([k, v]) => [v, k])
    );
}
```

ပြီးတော့ `Iterator` object အသစ်ကိုလည်း extend လုပ်နိုင်ပါတယ်:

```ts
/**
 * Provides an endless stream of `0`s.
 */
class Zeroes extends Iterator<number> {
    next() {
        return { value: 0, done: false } as const;
    }
}

const zeroes = new Zeroes();

// Transform into an endless stream of `1`s.
const ones = zeroes.map(x => x + 1);
```

ပြီးတော့ ရှိပြီးသား `Iterable` တွေ ဒါမှမဟုတ် `Iterator` တွေကို `Iterator.from` နဲ့ ဒီ type အသစ်ထဲကို ပြောင်းလဲ (adapt) နိုင်ပါတယ်:

```ts
Iterator.from(...).filter(someFunction);
```

အခုတော့ — နာမည်ပေးတာအကြောင်း ပြောရပါမယ်။

အစောပိုင်းမှာ TypeScript မှာ `Iterable` နဲ့ `Iterator` အတွက် types တွေ ရှိတယ်လို့ ဖော်ပြခဲ့ပါတယ်;
ဒါပေမယ့် — ကျွန်တော်တို့ ပြောခဲ့သလိုပဲ — ဒါတွေက အချို့သော operations တွေ အလုပ်လုပ်ကြောင်း သေချာစေဖို့ "protocols" တွေလိုမျိုး ဆောင်ရွက်ပါတယ်။
*ဆိုလိုတာက — TypeScript ထဲမှာ `Iterable` ဒါမှမဟုတ် `Iterator` အဖြစ် ကြေညာထားတဲ့ value တိုင်းမှာ အပေါ်က ဖော်ပြခဲ့တဲ့ methods တွေ ရှိမယ်လို့ မဆိုလိုပါဘူး။*

ဒါပေမယ့် `Iterator` လို့ခေါ်တဲ့ **runtime value** အသစ်တစ်ခု ရှိပါသေးတယ်။
JavaScript ထဲမှာ `Iterator` ကိုရော `Iterator.prototype` ကိုပါ — တကယ့် values တွေအနေနဲ့ ရည်ညွှန်းနိုင်ပါတယ်။
TypeScript က type-checking အတွက်သက်သက် `Iterator` လို့ခေါ်တဲ့ ကိုယ်ပိုင်အရာတစ်ခုကို သတ်မှတ်ထားပြီးသားမို့ — ဒါက နည်းနည်း ကသိကအောက် ဖြစ်စရာပါ။
ဒါကြောင့် ဒီကံဆိုးစရာ နာမည်တိုက်မှု (name clash) ကြောင့် — TypeScript က ဒီ native/built-in iterable iterators တွေကို ဖော်ပြဖို့ သီးခြား type တစ်ခုကို မိတ်ဆက်ဖို့ လိုအပ်ပါတယ်။

TypeScript 5.6 က `IteratorObject` လို့ခေါ်တဲ့ type အသစ်တစ်ခုကို မိတ်ဆက်ပါတယ်။
အောက်ပါအတိုင်း သတ်မှတ်ထားပါတယ်:

```ts
interface IteratorObject<T, TReturn = unknown, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
}
```

Built-in collections နဲ့ methods အများအပြားက `IteratorObject` တွေရဲ့ subtypes တွေကို ထုတ်လုပ်ပြီး — (`ArrayIterator`, `SetIterator`, `MapIterator` စတာတွေလို) — `lib.d.ts` ထဲက core JavaScript နဲ့ DOM types နှစ်ခုစလုံးအပြင် `@types/node` ပါ ဒီ type အသစ်ကို သုံးဖို့ အပ်ဒိတ်လုပ်ထားပါတယ်။

အလားတူပဲ — parity (ညီမျှမှု) အတွက် `AsyncIteratorObject` type တစ်ခုလည်း ရှိပါတယ်။
`AsyncIterable` တွေအတွက် အလားတူ methods တွေကို ယူဆောင်ပေးတဲ့ `AsyncIterator` က JavaScript မှာ runtime value တစ်ခုအနေနဲ့ မရှိသေးပါဘူး — [ဒါပေမယ့် ၎င်းက တက်ကြွတဲ့ proposal တစ်ခုဖြစ်ပြီး](https://github.com/tc39/proposal-async-iterator-helpers) — ဒီ type အသစ်က ၎င်းအတွက် ကြိုတင် ပြင်ဆင်ပေးထားတာပါ။

[Kevin Gibbons](https://github.com/bakkot) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ် — သူက ဒီ [types တွေအတွက် ပြောင်းလဲမှုတွေ](https://github.com/microsoft/TypeScript/pull/58222) ကို ပံ့ပိုးပေးခဲ့ပြီး — [proposal](https://github.com/tc39/proposal-iterator-helpers) ရဲ့ co-authors တွေထဲက တစ်ဦးလည်း ဖြစ်ပါတယ်။

## Strict Builtin Iterator Checks (and `--strictBuiltinIteratorReturn`) (Strict Builtin Iterator Checks များ (နှင့် `--strictBuiltinIteratorReturn`))

`Iterator<T, TReturn>` တစ်ခုပေါ်မှာ `next()` method ကို ခေါ်တဲ့အခါ — ၎င်းက `value` နဲ့ `done` property ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။
ဒါကို `IteratorResult` type နဲ့ ပုံစံထုတ်ထားပါတယ်။

```ts
type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}

interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}
```

ဒီနေရာမှာ နာမည်ပေးထားတာက generator function တစ်ခု အလုပ်လုပ်ပုံကနေ မှုတ်သွင်းထားတာပါ။
Generator functions တွေက values တွေကို `yield` လုပ်နိုင်ပြီး — နောက်ဆုံးတန်ဖိုးတစ်ခုကို `return` လုပ်နိုင်ပါတယ် — ဒါပေမယ့် နှစ်ခုကြားက types တွေက မသက်ဆိုင်တာ ဖြစ်နိုင်ပါတယ်။

```ts
function abc123() {
    yield "a";
    yield "b";
    yield "c";
    return 123;
}

const iter = abc123();

iter.next(); // { value: "a", done: false }
iter.next(); // { value: "b", done: false }
iter.next(); // { value: "c", done: false }
iter.next(); // { value: 123, done: true }
```

`IteratorObject` type အသစ်နဲ့ဆိုရင် — `IteratorObject` တွေရဲ့ လုံခြုံတဲ့ (safe) implementations တွေကို ခွင့်ပြုရာမှာ အခက်အခဲတစ်ချို့ ရှိတာ တွေ့ခဲ့ရပါတယ်။
တစ်ချိန်တည်းမှာပဲ — `TReturn` က `any` (default!) ဖြစ်နေတဲ့ အခြေအနေတွေမှာ `IteratorResult` နဲ့ ပတ်သက်ပြီး ကာလရှည် တည်ရှိနေတဲ့ မလုံခြုံမှု (unsafety) တစ်ခု ရှိခဲ့ပါတယ်။
ဥပမာ — `IteratorResult<string, any>` တစ်ခု ရှိတယ်ဆိုပါစို့။
ဒီ type ရဲ့ `value` ကို လှမ်းယူမိရင် — `string | any` နဲ့ ဆုံးသွားမှာ ဖြစ်ပြီး — အဲဒါက `any` ပဲ ဖြစ်ပါတယ်။

```ts
function* uppercase(iter: Iterator<string, any>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase(); // oops! forgot to check for `done` first and misspelled `toUpperCase`

        if (done) {
            return;
        }
    }
}
```

ဒါကို ဒီနေ့ခေတ် `Iterator` တိုင်းပေါ်မှာ ပြင်ဆင်ဖို့က — breaks တွေ အများကြီး မိတ်ဆက်စရာ မလိုဘဲ ခက်ခဲပါတယ် — ဒါပေမယ့် ဖန်တီးခံရတဲ့ `IteratorObject` အများစုနဲ့တော့ အနည်းဆုံး ပြင်ဆင်နိုင်ပါတယ်။

TypeScript 5.6 က `BuiltinIteratorReturn` လို့ခေါ်တဲ့ intrinsic type အသစ်တစ်ခုနဲ့ `--strictBuiltinIteratorReturn` လို့ခေါ်တဲ့ `--strict`-mode flag အသစ်တစ်ခုကို မိတ်ဆက်ပါတယ်။
`lib.d.ts` လို နေရာတွေမှာ `IteratorObject` တွေကို သုံးတိုင်း — သူတို့ကို `TReturn` အတွက် `BuiltinIteratorReturn` type နဲ့ အမြဲ ရေးသားထားပါတယ် (ပိုပြီး တိကျတဲ့ `MapIterator`, `ArrayIterator`, `SetIterator` တွေကို ပိုပြီး မကြာခဏ မြင်ရပေမယ့်)။

```ts
interface MapIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): MapIterator<T>;
}

// ...

interface Map<K, V> {
    // ...

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<[K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}
```

Default အနေနဲ့ — `BuiltinIteratorReturn` က `any` ဖြစ်ပေမယ့် — `--strictBuiltinIteratorReturn` ကို enable လုပ်ထားတဲ့အခါ (ဖြစ်နိုင်တာက `--strict` ကနေတစ်ဆင့်) — ၎င်းက `undefined` ဖြစ်ပါတယ်။
ဒီ mode အသစ်အောက်မှာ — `BuiltinIteratorReturn` ကို သုံးရင် — ကျွန်တော်တို့ရဲ့ အစောပိုင်း ဥပမာက ယခုဆို မှန်ကန်စွာ error တက်ပါတယ်:

```ts
function* uppercase(iter: Iterator<string, BuiltinIteratorReturn>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase();
        //    ~~~~~ ~~~~~~~~~~~
        // error! ┃      ┃
        //        ┃      ┗━ Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
        //        ┃
        //        ┗━ 'value' is possibly 'undefined'.

        if (done) {
            return;
        }
    }
}
```

`lib.d.ts` တစ်လျှောက်မှာ `BuiltinIteratorReturn` ကို `IteratorObject` နဲ့ တွဲပြီး ပုံမှန်အားဖြင့် မြင်ရပါလိမ့်မယ်။
ယေဘုယျအားဖြင့် — သင့်ကိုယ်ပိုင် code ထဲမှာ ဖြစ်နိုင်ရင် `TReturn` ကို ပိုပြီး ရှင်းရှင်းလင်းလင်း (explicit) သတ်မှတ်ဖို့ အကြံပြုပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီ feature အကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/58243)။

## Support for Arbitrary Module Identifiers (Arbitrary Module Identifiers များအတွက် ပံ့ပိုးမှု)

JavaScript က modules တွေကို — string literals တွေအနေနဲ့ — invalid identifier နာမည်တွေရှိတဲ့ bindings တွေကို export လုပ်ခွင့် ပြုပါတယ်:

```ts
const banana = "🍌";

export { banana as "🍌" };
```

အလားတူပဲ — modules တွေက ဒီ arbitrary နာမည်တွေနဲ့ imports တွေကို ယူပြီး — valid identifiers တွေဆီ bind လုပ်ခွင့် ရှိပါတယ်:

```ts
import { "🍌" as banana } from "./foo"

/**
 * om nom nom
 */
function eat(food: string) {
    console.log("Eating", food);
};

eat(banana);
```

ဒါက ပါတီပွဲမှာ လှည့်ကွက်တစ်ခုလို ထင်ရနိုင်ပေမယ့် — (ကျွန်တော်တို့လောက် ပါတီမှာ ပျော်တတ်ရင်ပေါ့) — တခြားဘာသာစကားတွေနဲ့ အပြန်အလှန် ဆက်သွယ်နိုင်မှု (interoperability) အတွက် (ပုံမှန်အားဖြင့် JavaScript/WebAssembly နယ်နိမိတ်တွေကနေတစ်ဆင့်) အသုံးတည့်ပါတယ် — တခြားဘာသာစကားတွေမှာ valid identifier တစ်ခုဆိုတာ ဘာလဲဆိုတာအတွက် မတူညီတဲ့ စည်းမျဉ်းတွေ ရှိနိုင်လို့ပါ။
esbuild [ရဲ့ `inject` feature](https://esbuild.github.io/api/#inject) လို code တွေ ထုတ်လုပ်ပေးတဲ့ tools တွေအတွက်လည်း အသုံးဝင်နိုင်ပါတယ်။

TypeScript 5.6 က ဒီ arbitrary module identifiers တွေကို သင့် code ထဲမှာ သုံးခွင့် ယခုဆို ပြုပေးပါတယ်!
[Evan Wallace](https://github.com/evanw) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ် — သူက ဒီ [ပြောင်းလဲမှုကို TypeScript ဆီ ပံ့ပိုးပေးခဲ့လို့ပါ](https://github.com/microsoft/TypeScript/pull/58640)!
## The `--noUncheckedSideEffectImports` Option (`--noUncheckedSideEffectImports` Option အကြောင်း)

JavaScript မှာ — module တစ်ခုကနေ values တစ်ခုခုကို တကယ်တမ်း import မလုပ်ဘဲ — module တစ်ခုကို `import` လုပ်ဖို့ ဖြစ်နိုင်ပါတယ်။

```ts
import "some-module";
```

ဒီ imports တွေကို *side effect imports* လို့ မကြာခဏ ခေါ်ပါတယ် — သူတို့ ပေးစွမ်းနိုင်တဲ့ တစ်ခုတည်းသော အသုံးဝင်တဲ့ အပြုအမူက side effect တစ်ခုကို လုပ်ဆောင်ခြင်း (global variable တစ်ခုကို register လုပ်တာ၊ prototype တစ်ခုပေါ်ကို polyfill တစ်ခု ထည့်တာလိုမျိုး) ဖြစ်လို့ပါ။

TypeScript မှာ — ဒီ syntax က အတော်လေး ထူးဆန်းတဲ့ quirk (ထူးခြားချက်) တစ်ခု ရှိခဲ့ပါတယ်: `import` ကို valid source file တစ်ခုဆီ resolve လုပ်နိုင်ရင် — TypeScript က file ကို load လုပ်ပြီး စစ်ဆေးပါတယ်။
တစ်ဖက်မှာတော့ — source file တစ်ခုမှ မတွေ့နိုင်ရင် — TypeScript က `import` ကို တိတ်တဆိတ် လျစ်လျူရှုလိုက်ပါတယ်!

ဒါက အံ့အားသင့်စရာ အပြုအမူတစ်ခုပါ — ဒါပေမယ့် ၎င်းက JavaScript ecosystem ထဲက modeling patterns တွေကနေ တစ်စိတ်တစ်ပိုင်း ဆင်းသက်လာတာပါ။
ဥပမာ — ဒီ syntax ကို CSS ဒါမှမဟုတ် တခြား assets တွေကို load လုပ်ဖို့ — bundlers တွေထဲက special loaders တွေနဲ့လည်း သုံးခဲ့ပါတယ်။
သင့် bundler က အောက်ပါလိုမျိုး ရေးခြင်းအားဖြင့် `.css` files အချို့ကို ထည့်သွင်းနိုင်အောင် configure လုပ်ထားနိုင်ပါတယ်:

```tsx
import "./button-component.css";

export function Button() {
    // ...
}
```

ဒါပေမယ့် — ဒါက side effect imports တွေပေါ်မှာ ဖြစ်နိုင်တဲ့ typos (စာလုံးပေါင်းအမှားတွေ) ကို ဖုံးကွယ်ထားပါတယ်။
ဒါကြောင့်မို့ TypeScript 5.6 က ဒီအခြေအနေတွေကို ဖမ်းမိဖို့ `--noUncheckedSideEffectImports` လို့ခေါ်တဲ့ compiler option အသစ်တစ်ခုကို မိတ်ဆက်ပါတယ်။
`--noUncheckedSideEffectImports` ကို enable လုပ်ထားတဲ့အခါ — side effect import တစ်ခုအတွက် source file တစ်ခု ရှာမတွေ့ရင် — TypeScript က ယခုဆို error ထုတ်ပါလိမ့်မယ်။

```ts
import "oops-this-module-does-not-exist";
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// error: Cannot find module 'oops-this-module-does-not-exist' or its corresponding type declarations.
```

ဒီ option ကို enable လုပ်တဲ့အခါ — အပေါ်က CSS ဥပမာမှာလိုမျိုး — အလုပ်လုပ်နေတဲ့ code တစ်ချို့က ယခုဆို error တစ်ခု ရနိုင်ပါတယ်။
ဒါကို ရှောင်ကွင်းဖို့ — assets တွေအတွက် side effect `import` တွေပဲ ရေးချင်တဲ့ သုံးစွဲသူတွေအတွက်တော့ — wildcard specifier တစ်ခုပါတဲ့ *ambient module declaration* လို့ခေါ်တာကို ရေးတာက ပိုအဆင်ပြေနိုင်ပါတယ်။
၎င်းက global file တစ်ခုထဲမှာ ရှိပြီး — အောက်ပါလိုမျိုး ဖြစ်ပါလိမ့်မယ်:

```ts
// ./src/globals.d.ts

// Recognize all CSS files as module imports.
declare module "*.css" {}
```

တကယ်တော့ — သင့် project ထဲမှာ ဒီလို file မျိုး ရှိပြီးသား ဖြစ်နိုင်ပါတယ်!
ဥပမာ — `vite init` လိုဟာမျိုး run လိုက်ရင် `vite-env.d.ts` အလားတူတစ်ခု ဖန်တီးပေးနိုင်ပါတယ်။

ဒီ option က လက်ရှိမှာ default အနေနဲ့ ပိတ်ထားပေမယ့် — အသုံးပြုသူတွေ စမ်းသုံးကြည့်ဖို့ တိုက်တွန်းချင်ပါတယ်!

နောက်ထပ် အချက်အလက်အတွက် — [implementation ကို ဒီမှာ စစ်ဆေးကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58941)။

## The `--noCheck` Option (`--noCheck` Option အကြောင်း)

TypeScript 5.6 က compiler option အသစ်တစ်ခုဖြစ်တဲ့ `--noCheck` ကို မိတ်ဆက်ပြီး — ၎င်းက input files အားလုံးအတွက် type checking ကို ကျော်လိုက်ခွင့် ပြုပါတယ်။
ဒါက output files တွေ emit လုပ်ဖို့ လိုအပ်တဲ့ semantic analysis တစ်ခုခု လုပ်ဆောင်တဲ့အခါ — မလိုအပ်တဲ့ type-checking တွေကို ရှောင်ရှားပေးပါတယ်။

ဒါအတွက် အခြေအနေတစ်ခုက — JavaScript file တွေ ထုတ်လုပ်တာကို type-checking ကနေ ခွဲထုတ်လိုက်ပြီး — နှစ်ခုကို သီးခြား အဆင့်နှစ်ခုအနေနဲ့ run လုပ်နိုင်ဖို့ပါ။
ဥပမာ — ထပ်ခါထပ်ခါ လုပ်နေတုန်း `tsc --noCheck` ကို run ပြီး — စေ့စေ့စပ်စပ် type check တစ်ခုအတွက် `tsc --noEmit` ကို run နိုင်ပါတယ်။
အလုပ်နှစ်ခုကို `--watch` mode ထဲမှာတောင် parallel နဲ့ run လုပ်နိုင်ပါတယ် — ဒါပေမယ့် တကယ်တမ်း တစ်ချိန်တည်း run နေမယ်ဆိုရင် — သီးခြား `--tsBuildInfoFile` path တစ်ခုကို သတ်မှတ်ချင်ဖွယ် ရှိတာ သတိပြုပါ။

`--noCheck` က declaration files တွေကို အလားတူပုံစံနဲ့ emit လုပ်ဖို့အတွက်လည်း အသုံးဝင်ပါတယ်။
`--isolatedDeclarations` နဲ့ ကိုက်ညီတဲ့ project တစ်ခုပေါ်မှာ `--noCheck` ကို သတ်မှတ်ထားတဲ့ project တစ်ခုထဲမှာ — TypeScript က type-checking pass တစ်ခု မပါဘဲ declaration files တွေကို လျင်မြန်စွာ ထုတ်ပေးနိုင်ပါတယ်။
ထုတ်ပေးလိုက်တဲ့ declaration files တွေက လျင်မြန်တဲ့ syntactic transformations တွေကိုပဲ သက်သက် မှီခိုပါလိမ့်မယ်။

`--noCheck` ကို သတ်မှတ်ထားပေမယ့် — project တစ်ခုက `--isolatedDeclarations` ကို *မသုံး*ဘူးဆိုရင် — TypeScript က `.d.ts` files တွေ ထုတ်လုပ်ဖို့ လိုအပ်သလောက် type-checking ကို ဆက်လုပ်နိုင်တာ သတိပြုပါ။
ဒီသဘောအရ — `--noCheck` က နာမည်နဲ့ မလိုက်ညီတာ နည်းနည်း ရှိပါတယ်; ဒါပေမယ့် — လုပ်ငန်းစဉ်က full type-check တစ်ခုထက် ပိုပြီး ပျင်းရိလာပြီး — annotate မလုပ်ထားတဲ့ declarations တွေရဲ့ types တွေကိုပဲ တွက်ချက်မှာပါ။
ဒါက full type-check တစ်ခုထက် အများကြီး ပိုမြန်သင့်ပါတယ်။

`noCheck` ကို TypeScript API ကနေတစ်ဆင့်လည်း standard option တစ်ခုအနေနဲ့ ရနိုင်ပါတယ်။
အတွင်းပိုင်းမှာ — `transpileModule` နဲ့ `transpileDeclaration` တွေက (အနည်းဆုံး TypeScript 5.5 ကစပြီး) အရာတွေကို မြန်ဆန်စေဖို့ `noCheck` ကို သုံးထားပြီးသားပါ။
ယခုဆို build tool တိုင်းက — builds တွေကို ညှိနှိုင်းပြီး မြန်ဆန်စေဖို့ စိတ်ကြိုက် strategy အမျိုးမျိုးကို အသုံးပြုကာ — ဒီ flag ကို အခွင့်ကောင်းယူနိုင်ပါပြီ။

နောက်ထပ် အချက်အလက်အတွက် — `noCheck` ကို အတွင်းပိုင်းမှာ စွမ်းဆောင်ပေးဖို့ [TypeScript 5.5 မှာ လုပ်ခဲ့တဲ့ အလုပ်](https://github.com/microsoft/TypeScript/pull/58364) နဲ့အတူ — ၎င်းကို [command line](https://github.com/microsoft/TypeScript/pull/58839) ပေါ်မှာ အများပြည်သူ သုံးနိုင်အောင် လုပ်တဲ့ သက်ဆိုင်ရာ အလုပ်တွေကို ကြည့်ပါ။

## Allow `--build` with Intermediate Errors (Intermediate Errors များနှင့်အတူ `--build` ကို ခွင့်ပြုခြင်း)

TypeScript ရဲ့ *project references* အယူအဆက သင့် codebase ကို project အများအပြားအဖြစ် စုစည်းပြီး — သူတို့ကြားမှာ dependencies တွေ ဖန်တီးခွင့် ပြုပါတယ်။
TypeScript compiler ကို `--build` mode နဲ့ run လုပ်တာ (အတိုကောက် `tsc -b`) က — project တွေအနှံ့ အဲဒီ build ကို တကယ်တမ်း ဆောင်ရွက်ပြီး — ဘယ် projects နဲ့ files တွေကို compile လုပ်ဖို့ လိုလဲဆိုတာ ရှာဖွေဖော်ထုတ်တဲ့ built-in နည်းလမ်းပါ။

အရင်က — `--build` mode ကို သုံးတာက `--noEmitOnError` ကို ယူဆပြီး — errors တစ်ခုခု ကြုံရတာနဲ့ build ကို ချက်ချင်း ရပ်တန့်ပစ်ပါတယ်။
ဒါက ဆိုလိုတာက — "downstream" projects တွေရဲ့ "upstream" dependencies တစ်ခုခုမှာ build errors တွေ ရှိနေရင် — သူတို့ကို ဘယ်တော့မှ check လုပ်ပြီး build လုပ်လို့ မရနိုင်ဘူးဆိုတာပါ။
သီအိုရီအရ — ဒါက အတော်လေး ကျိုးကြောင်းဆီလျော်တဲ့ ချဉ်းကပ်မှုတစ်ခုပါ — project တစ်ခုမှာ errors တွေ ရှိနေရင် — ၎င်းက သူ့ရဲ့ dependencies တွေအတွက် ညီညွတ်တဲ့ အခြေအနေတစ်ခုမှာ ရှိနေချင်မှ ရှိနေမှာပါ။

လက်တွေ့မှာတော့ — ဒီလို တောင့်တင်းမှုမျိုးက upgrades တွေလို အရာတွေကို ခက်ခဲစေပါတယ်။
ဥပမာ — `projectB` က `projectA` ပေါ် မှီခိုနေရင် — `projectB` ကို ပိုသိကျွမ်းတဲ့လူတွေက — သူတို့ရဲ့ dependencies တွေ အဆင့်မြှင့်ပြီးမှသာ သူတို့ရဲ့ code ကို တက်ကြွစွာ (proactively) အဆင့်မြှင့်နိုင်မှာပါ။
သူတို့က `projectA` ကို အရင် အဆင့်မြှင့်တဲ့ အလုပ်ကြောင့် ပိတ်ဆို့ခံနေရပါတယ်။

TypeScript 5.6 ကစပြီး — dependencies တွေထဲမှာ intermediate errors (ကြားခံ errors) တွေ ရှိနေရင်တောင် — `--build` mode က projects တွေကို ဆက်ပြီး build လုပ်သွားပါလိမ့်မယ်။
Intermediate errors တွေကို ကြုံရတဲ့အခါ — သူတို့ကို တသမတ်တည်း သတင်းပို့ပြီး — output files တွေကို အတတ်နိုင်ဆုံး (best-effort) အခြေခံနဲ့ ထုတ်ပေးပါလိမ့်မယ်;
ဒါပေမယ့် — build က သတ်မှတ်ထားတဲ့ project အပေါ်မှာ ပြီးဆုံးအထိ ဆက်သွားပါလိမ့်မယ်။

Errors ရှိတဲ့ ပထမဆုံး project မှာ build ကို ရပ်တန့်ချင်ရင် — `--stopOnBuildErrors` လို့ခေါ်တဲ့ flag အသစ်တစ်ခုကို သုံးနိုင်ပါတယ်။
ဒါက CI environment တစ်ခုထဲမှာ run လုပ်တဲ့အခါ ဒါမှမဟုတ် တခြား projects တွေက အများကြီး မှီခိုနေတဲ့ project တစ်ခုကို ထပ်ခါထပ်ခါ လုပ်နေတဲ့အခါ အသုံးဝင်နိုင်ပါတယ်။

ဒါကို ပြီးမြောက်ဖို့ — TypeScript က `--build` invocation တစ်ခုထဲက project တိုင်းအတွက် `.tsbuildinfo` file တစ်ခုကို ယခုဆို အမြဲတမ်း emit လုပ်တာ သတိပြုပါ (`--incremental`/`--composite` ကို သတ်မှတ်မထားရင်တောင်)။
ဒါက `--build` ကို ဘယ်လို ခေါ်ယူခဲ့လဲဆိုတဲ့ အခြေအနေနဲ့ အနာဂတ်မှာ ဘာ အလုပ်တွေ လုပ်ဆောင်ဖို့ လိုလဲဆိုတာကို ခြေရာခံထားဖို့ပါ။

[ဒီပြောင်းလဲမှုအကြောင်း implementation အပေါ်မှာ ဒီမှာ ပိုပြီး ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/58838)။

## Region-Prioritized Diagnostics in Editors (Editor များထဲတွင် Region-Prioritized Diagnostics)

TypeScript ရဲ့ language service ကို file တစ်ခုအတွက် *diagnostics* တွေ (errors, suggestions, deprecations လိုအရာတွေ) တောင်းခံတဲ့အခါ — ၎င်းက ပုံမှန်အားဖြင့် *file တစ်ခုလုံး*ကို check လုပ်ဖို့ လိုအပ်ပါတယ်။
အများစုမှာ ဒါက အဆင်ပြေပေမယ့် — အလွန်ကြီးမားတဲ့ files တွေမှာတော့ နှောင့်နှေးမှုတစ်ခု ဖြစ်စေနိုင်ပါတယ်။
ဒါက စိတ်ပျက်စရာ ကောင်းနိုင်ပါတယ် — typo တစ်ခုကို ပြင်တာက မြန်ဆန်တဲ့ လုပ်ဆောင်ချက်တစ်ခုလို ခံစားရသင့်ပေမယ့် — file ကြီးလုံလောက်ရင် *စက္ကန့်တွေ* ကြာနိုင်လို့ပါ။

ဒါကို ဖြေရှင်းဖို့ — TypeScript 5.6 က *region-prioritized diagnostics* ဒါမှမဟုတ် *region-prioritized checking* လို့ခေါ်တဲ့ feature အသစ်တစ်ခုကို မိတ်ဆက်ပါတယ်။
Editors တွေက files အစုတစ်ခုအတွက် diagnostics တွေကို တောင်းခံရုံသာမကဘဲ — ယခုဆို ပေးထားတဲ့ file တစ်ခုရဲ့ သက်ဆိုင်ရာ region တစ်ခုကိုပါ ထည့်ပေးနိုင်ပါတယ် — ရည်ရွယ်ချက်က ဒါက ပုံမှန်အားဖြင့် အသုံးပြုသူတစ်ဦး လက်ရှိ မြင်နေရတဲ့ file ရဲ့ region ဖြစ်စေဖို့ပါ။
TypeScript language server က ပြီးတော့ diagnostics အစုနှစ်ခုကို ပေးဖို့ ရွေးချယ်နိုင်ပါတယ်: region အတွက် တစ်ခု၊ ပြီးတော့ file တစ်ခုလုံးအတွက် တစ်ခုပါ။
ဒါက ကြီးမားတဲ့ files တွေထဲမှာ editing က *အများကြီး* ပိုတုံ့ပြန်မှုမြန်စေပြီး — အနီရောင် squiggles တွေ ပျောက်ကွယ်ဖို့ အချိန်အကြာကြီး စောင့်နေစရာ မလိုတော့ပါဘူး။

ကိန်းဂဏန်း တိကျတဲ့အချက်တစ်ချို့အတွက်ဆိုရင် — [TypeScript ရဲ့ ကိုယ်ပိုင် `checker.ts`](https://github.com/microsoft/TypeScript/blob/7319968e90600102892a79142fb804bcbe384160/src/compiler/checker.ts) ပေါ်မှာ ကျွန်တော်တို့ စမ်းသပ်ခဲ့ရာမှာ — full semantic diagnostics response တစ်ခုက 3330ms ကြာခဲ့ပါတယ်။
ဆန့်ကျင်ဘက်အနေနဲ့ — ပထမဆုံး region-based diagnostics response ကတော့ 143ms ပဲ ကြာခဲ့ပါတယ်!
ကျန်တဲ့ whole-file response က 3200ms လောက် ကြာနေချိန်မှာတောင် — ဒါက မြန်ဆန်တဲ့ edits တွေအတွက် ဧရာမ ခြားနားမှုတစ်ခု ဖြစ်စေနိုင်ပါတယ်။

ဒီ feature မှာ — သင့်အတွေ့အကြုံတစ်လျှောက် diagnostics တွေကို ပိုပြီး တသမတ်တည်း သတင်းပို့စေဖို့ အလုပ်တွေ အတော်များများလည်း ပါဝင်ပါတယ်။
ကျွန်တော်တို့ရဲ့ type-checker က အလုပ်တွေကို ရှောင်ရှားဖို့ caching ကို အခွင့်ကောင်းယူထားတာကြောင့် — type တူညီတဲ့အရာတွေကြားက နောက်ဆက်တွဲ checks တွေက မကြာခဏဆိုသလို မတူညီတဲ့ (ပုံမှန်အားဖြင့် ပိုတိုတဲ့) error message တစ်ခုကို ရနိုင်ပါတယ်။
နည်းပညာအရပြောရရင် — lazy out-of-order checking က editor တစ်ခုထဲက နေရာနှစ်ခုကြားမှာ diagnostics တွေကို မတူညီစွာ သတင်းပို့စေနိုင်ပါတယ် — ဒီ feature မတိုင်ခင်ကတောင် — ဒါပေမယ့် ပြဿနာကို ပိုဆိုးအောင် မလုပ်ချင်ခဲ့ပါဘူး။
မကြာသေးတဲ့ အလုပ်တွေနဲ့အတူ — ဒီ error မညီညွတ်မှုတွေထဲက အများအပြားကို ချောမွေ့အောင် လုပ်နိုင်ခဲ့ပါပြီ။

လက်ရှိမှာ — ဒီလုပ်ဆောင်ချက်ကို TypeScript 5.6 နဲ့ ၎င်းနောက်ပိုင်းအတွက် Visual Studio Code ထဲမှာ ရနိုင်ပါတယ်။

ပိုပြီး အသေးစိတ်ကျတဲ့ အချက်အလက်အတွက် — [implementation နဲ့ write-up ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57842)။

## Granular Commit Characters (Granular Commit Characters များ)

TypeScript ရဲ့ language service က completion item တစ်ခုချင်းစီအတွက် ကိုယ်ပိုင် *commit characters* တွေကို ယခုဆို ပေးပါတယ်။
Commit characters တွေက — ရိုက်လိုက်တဲ့အခါ — လက်ရှိ အကြံပြုထားတဲ့ completion item ကို အလိုအလျောက် commit (အတည်ပြု) လုပ်ပေးမယ့် သီးခြား characters တွေပါ။

ဒါရဲ့ အဓိပ္ပာယ်က — အချိန်ကြာလာတာနဲ့အမျှ သင့် editor က characters တစ်ချို့ ရိုက်လိုက်တဲ့အခါ — လက်ရှိ အကြံပြုထားတဲ့ completion item ကို ပိုပြီး မကြာခဏ commit လုပ်လာပါလိမ့်မယ်။
ဥပမာ — အောက်ပါ code ကို ကြည့်ပါ:

```ts
declare let food: {
    eat(): any;
}

let f = (foo/**/
```

ကျွန်တော်တို့ရဲ့ cursor က `/**/` မှာ ရှိနေရင် — ကျွန်တော်တို့ ရေးနေတဲ့ code က `let f = (food.eat())` လိုမျိုးလား ဒါမှမဟုတ် `let f = (foo, bar) => foo + bar` လိုမျိုးလားဆိုတာ မရှင်းလင်းပါဘူး။
နောက်တစ်ခု ဘယ် character ကို ရိုက်လဲဆိုတာပေါ် မူတည်ပြီး — editor က မတူညီစွာ auto-complete လုပ်နိုင်မယ်လို့ စိတ်ကူးနိုင်ပါတယ်။
ဥပမာ — period/dot character (`.`) ကို ရိုက်လိုက်ရင် — `food` variable နဲ့ complete ဖြစ်စေချင်ဖွယ် ရှိပါတယ်; ဒါပေမယ့် comma character (`,`) ကို ရိုက်လိုက်ရင်တော့ — arrow function တစ်ခုထဲက parameter တစ်ခုကို ရေးနေတာ ဖြစ်နိုင်ပါတယ်။

ကံမကောင်းစရာက — အရင်က TypeScript က editors တွေကို — လက်ရှိ text က parameter နာမည်အသစ်တစ်ခုကို သတ်မှတ်နေနိုင်တာမို့ — commit characters *ဘယ်ဟာမှ* မလုံခြုံဘူးလို့ အချက်ပြခဲ့ပါတယ်။
ဒါကြောင့် editor က `food` ဆိုတဲ့ စကားလုံးနဲ့ auto-complete လုပ်သင့်တာ "သိသာ"နေရင်တောင် — `.` ကို နှိပ်လိုက်တာက ဘာမှ မလုပ်ပေးခဲ့ပါဘူး။

TypeScript က ယခုဆို completion item တစ်ခုချင်းစီအတွက် ဘယ် characters တွေ commit လုပ်ဖို့ လုံခြုံလဲဆိုတာကို ရှင်းရှင်းလင်းလင်း စာရင်းပြုစုပေးပါတယ်။
ဒါက သင့်ရဲ့ နေ့စဉ်အတွေ့အကြုံကို *ချက်ချင်း* မပြောင်းလဲနိုင်ပေမယ့် — ဒီ commit characters တွေကို ပံ့ပိုးတဲ့ editors တွေမှာတော့ အချိန်ကြာလာတာနဲ့အမျှ behavioral တိုးတက်မှုတွေ မြင်ရသင့်ပါတယ်။
အဲဒီတိုးတက်မှုတွေကို အခုပဲ မြင်ချင်ရင် — [TypeScript nightly extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) ကို [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) နဲ့တွဲပြီး သုံးနိုင်ပါတယ်။
အပေါ်က code ထဲမှာ `.` ကို နှိပ်လိုက်တာက `food` နဲ့ မှန်ကန်စွာ auto-complete ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [commit characters တွေကို ထပ်ဖြည့်ပေးခဲ့တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/59339) နဲ့အတူ — [context ပေါ်မူတည်ပြီး commit characters တွေကို ချိန်ညှိမှုတွေ](https://github.com/microsoft/TypeScript/pull/59523) ကို ကြည့်ပါ။

## Exclude Patterns for Auto-Imports (Auto-Imports များအတွက် Exclude Patterns)

TypeScript ရဲ့ language service က — specifiers တစ်ချို့ကနေ auto-import suggestions တွေကို စစ်ထုတ်ပစ်မယ့် regular expression patterns စာရင်းတစ်ခုကို သတ်မှတ်ခွင့် ယခုဆို ပြုပါတယ်။
ဥပမာ — `lodash` လို package တစ်ခုကနေ "deep" imports အားလုံးကို ဖယ်ထုတ်ချင်ရင် — Visual Studio Code ထဲမှာ အောက်ပါ preference ကို configure လုပ်နိုင်ပါတယ်:

```json5
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^lodash/.*$"
    ]
}
```

ဒါမှမဟုတ် တစ်ဖက်ကနေ ကြည့်ရင် — package တစ်ခုရဲ့ entry-point ကနေ import လုပ်တာကို တားမြစ်ချင်နိုင်ပါတယ်:

```json5
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^lodash$"
    ]
}
```

အောက်ပါ setting ကို သုံးပြီး `node:` imports တွေကိုတောင် ရှောင်နိုင်ပါတယ်:

```json5
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^node:"
    ]
}
```

`i` ဒါမှမဟုတ် `u` လို flags တစ်ချို့ကို သတ်မှတ်ချင်ရင် — သင့် regular expression ကို slashes တွေနဲ့ ကာရံထားဖို့ လိုပါတယ်။
ကာရံထားတဲ့ slashes တွေ ပေးတဲ့အခါ — အတွင်းက တခြား slashes တွေကို escape လုပ်ဖို့ လိုပါလိမ့်မယ်။

```json5
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^./lib/internal",        // no escaping needed
        "/^.\\/lib\\/internal/",  // escaping needed - note the leading and trailing slashes
        "/^.\\/lib\\/internal/i"  // escaping needed - we needed slashes to provide the 'i' regex flag
    ]
}
```

Visual Studio Code မှာ — JavaScript အတွက်လည်း `javascript.preferences.autoImportSpecifierExcludeRegexes` ကနေတစ်ဆင့် အလားတူ settings တွေကို အသုံးပြုနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [implementation ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/59543)။
## Notable Behavioral Changes (ထင်ရှားသော Behavioral Changes များ)

ဒီ section က — upgrade တစ်ခုခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ အသိအမှတ်ပြု နားလည်ထားသင့်တဲ့ မှတ်သားထိုက်သော ပြောင်းလဲမှုအစုတစ်ခုကို မီးမောင်းထိုးပြပါတယ်။
တစ်ခါတစ်ရံ deprecations, removals တွေနဲ့ ကန့်သတ်ချက်အသစ်တွေကို မီးမောင်းထိုးပြပါလိမ့်မယ်။
ထို့အပြင် — လုပ်ဆောင်နိုင်စွမ်းအရ တိုးတက်မှုတွေ ဖြစ်ပေမယ့် — error အသစ်တွေ မိတ်ဆက်ခြင်းအားဖြင့် ရှိပြီးသား build တစ်ခုကိုပါ ထိခိုက်စေနိုင်တဲ့ bug fixes တွေလည်း ပါဝင်နိုင်ပါတယ်။

### `lib.d.ts`

DOM အတွက် ထုတ်လုပ်ထားတဲ့ Types တွေက သင့် codebase ကို type-check လုပ်တာကို သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [ဒီ TypeScript ဗားရှင်းအတွက် DOM နဲ့ `lib.d.ts` updates တွေနဲ့ ဆက်စပ်တဲ့ issues တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/58764)။

### `.tsbuildinfo` is Always Written (`.tsbuildinfo` ကို အမြဲတမ်း ရေးသားခြင်း)

`--build` က — dependencies တွေထဲမှာ intermediate errors တွေ ရှိနေရင်တောင် projects တွေကို ဆက်ပြီး build လုပ်နိုင်စေဖို့ နဲ့ command line ပေါ်မှာ `--noCheck` ကို ပံ့ပိုးဖို့ — TypeScript က `--build` invocation တစ်ခုထဲက project တိုင်းအတွက် `.tsbuildinfo` file တစ်ခုကို ယခုဆို အမြဲတမ်း emit လုပ်ပါတယ်။
`--incremental` တကယ်တမ်း ဖွင့်ထားလား မဖွင့်ထားဘူးလားဆိုတာ မသက်ဆိုင်ဘဲ ဒါက ဖြစ်ပါတယ်။
[ဒီမှာ နောက်ထပ် အချက်အလက်တွေ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58626)။

### Respecting File Extensions and `package.json` from within `node_modules` (`node_modules` အတွင်းမှ File Extensions နှင့် `package.json` ကို လေးစားလိုက်နာခြင်း)

Node.js က v12 မှာ ECMAScript modules တွေအတွက် ပံ့ပိုးမှုကို အကောင်အထည်မဖော်ခင် — `node_modules` ထဲမှာ တွေ့ရတဲ့ `.d.ts` files တွေက CommonJS ဒါမှမဟုတ် ECMAScript modules အဖြစ် ရေးသားထားတဲ့ JavaScript files တွေကို ကိုယ်စားပြုလားဆိုတာ — TypeScript အတွက် သိဖို့ နည်းလမ်းကောင်းတစ်ခု ဘယ်တော့မှ မရှိခဲ့ပါဘူး။
npm ရဲ့ အများစုက CommonJS-သက်သက် ဖြစ်နေတုန်းက — ဒါက ပြဿနာ အများကြီး မဖြစ်စေခဲ့ပါဘူး — သံသယရှိရင် TypeScript က အရာအားလုံးက CommonJS လိုပဲ ပြုမူတယ်လို့ ရိုးရိုးရှင်းရှင်း ယူဆနိုင်ခဲ့လို့ပါ။
ကံမကောင်းစရာက — အဲဒီယူဆချက်က မှားနေရင် — မလုံခြုံတဲ့ imports တွေကို ခွင့်ပြုမိနိုင်ပါတယ်:

```ts
// node_modules/dep/index.d.ts
export declare function doSomething(): void;

// index.ts
// Okay if "dep" is a CommonJS module, but fails if
// it's an ECMAScript module - even in bundlers!
import dep from "dep";
dep.doSomething();
```

လက်တွေ့မှာ — ဒါက သိပ်မကြာခဏ ပေါ်မလာခဲ့ပါဘူး။
ဒါပေမယ့် Node.js က ECMAScript modules တွေကို စတင်ပံ့ပိုးပြီးကတည်းက နှစ်တွေအတွင်း — npm ပေါ်က ESM ရဲ့ ဝေစုက ကြီးထွားလာပါတယ်။
ကံကောင်းတာက — Node.js က file တစ်ခုက ECMAScript module လား CommonJS module လားဆိုတာ TypeScript ဆုံးဖြတ်ဖို့ ကူညီနိုင်တဲ့ ယန္တရားတစ်ခုကိုလည်း မိတ်ဆက်ခဲ့ပါတယ်: `.mjs` နဲ့ `.cjs` file extensions တွေနဲ့ `package.json` ရဲ့ `"type"` field ပါ။
TypeScript 4.7 က ဒီအညွှန်းတွေကို နားလည်တာအပြင် — `.mts` နဲ့ `.cts` files တွေကို ရေးသားတာကိုပါ ပံ့ပိုးပေးခဲ့ပါတယ်;
ဒါပေမယ့် TypeScript က အဲဒီအညွှန်းတွေကို `--module node16` နဲ့ `--module nodenext` အောက်မှာသာ ဖတ်ခဲ့တာမို့ — ဥပမာ `--module esnext` နဲ့ `--moduleResolution bundler` သုံးနေသူတိုင်းအတွက် အပေါ်က မလုံခြုံတဲ့ import က ပြဿနာ ဖြစ်နေဆဲပါ။

ဒါကို ဖြေရှင်းဖို့ — TypeScript 5.6 က module format အချက်အလက်တွေကို စုဆောင်းပြီး — `module` modes _အားလုံး_ (`amd`, `umd`, နဲ့ `system` ကလွဲရင်) မှာ အပေါ်က ဥပမာထဲကလို မရေမရာတွေကို ဖြေရှင်းဖို့ သုံးပါတယ်။
Format-သီးသန့် file extensions တွေ (`.mts` နဲ့ `.cts`) ကို ဘယ်နေရာမှာ တွေ့တွေ့ လေးစားလိုက်နာပြီး — `module` setting ဘာပဲဖြစ်ဖြစ် — `node_modules` dependencies တွေထဲမှာ `package.json` ရဲ့ `"type"` field ကို တိုင်ပင်ပါတယ်။
အရင်က — CommonJS output တစ်ခုကို `.mjs` file တစ်ခုထဲမှာ ထုတ်လုပ်တာ ဒါမှမဟုတ် အပြန်အလှန်အားဖြင့်လည်း နည်းပညာအရ ဖြစ်နိုင်ခဲ့ပါတယ်:

```ts
// main.mts
export default "oops";

// $ tsc --module commonjs main.mts
// main.mjs
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "oops";
```

ယခုဆို — `.mts` files တွေက CommonJS output ကို ဘယ်တော့မှ emit မလုပ်တော့ဘဲ — `.cts` files တွေကလည်း ESM output ကို ဘယ်တော့မှ emit မလုပ်တော့ပါဘူး။

ဒီအပြုအမူ အများစုကို TypeScript 5.5 ရဲ့ pre-release ဗားရှင်းတွေမှာ ထည့်သွင်းပေးခဲ့တာ သတိပြုပါ ([implementation အသေးစိတ်က ဒီမှာ](https://github.com/microsoft/TypeScript/pull/57896)) — ဒါပေမယ့် 5.6 မှာတော့ ဒီအပြုအမူကို `node_modules` အတွင်းက files တွေအထိပဲ တိုးချဲ့ထားတာပါ။

နောက်ထပ် အသေးစိတ်တွေကို [ဒီပြောင်းလဲမှုအပေါ်မှာ ရနိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/58825)။

### Correct `override` Checks on Computed Properties (Computed Properties များပေါ်တွင် မှန်ကန်သော `override` Checks)

အရင်က — `override` နဲ့ မှတ်သားထားတဲ့ computed properties တွေက base class member တစ်ခုရဲ့ တည်ရှိမှုကို မှန်ကန်စွာ မစစ်ဆေးခဲ့ပါဘူး။
အလားတူပဲ — `noImplicitOverride` ကို သုံးထားရင် — computed property တစ်ခုပေါ်မှာ `override` modifier တစ်ခုကို ထည့်ဖို့ *မေ့*သွားရင် error တစ်ခု ရမှာ မဟုတ်ခဲ့ပါဘူး။

TypeScript 5.6 က ယခုဆို အခြေအနေ နှစ်ခုလုံးမှာ computed properties တွေကို မှန်ကန်စွာ စစ်ဆေးပါတယ်။

```ts
const foo = Symbol("foo");
const bar = Symbol("bar");

class Base {
    [bar]() {}
}

class Derived extends Base {
    override [foo]() {}
//           ~~~~~
// error: This member cannot have an 'override' modifier because it is not declared in the base class 'Base'.

    [bar]() {}
//  ~~~~~
// error under noImplicitOverride: This member must have an 'override' modifier because it overrides a member in the base class 'Base'.
}
```

ဒီ fix ကို [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် [ဒီ pull request](https://github.com/microsoft/TypeScript/pull/57146) မှာ ပံ့ပိုးနိုင်ခဲ့ပါတယ်။
