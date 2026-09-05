---
title: "TypeScript 4.6 (TypeScript 4.6 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.6 ထုတ်ပြန်မှု — constructor များတွင် super() မတိုင်မီ code ရေးခွင့်, destructured discriminated unions များအတွက် control flow analysis, recursion depth checks တိုးတက်လာခြင်း, indexed access inference, es2022 target စသည့် တိုးတက်မှုများနှင့် breaking changes အကြောင်း"
order: 86
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-6.html"
status: translated
updated: 2026-09-05
---

## Allowing Code in Constructors Before `super()` (`super()` မတိုင်မီ Constructor များတွင် Code ရေးခွင့်ပြုခြင်း)

JavaScript classes တွေမှာ — `this` ကို ရည်ညွှန်းမပြုခင် `super()` ကို ခေါ်ဖို့ မဖြစ်မနေ လိုအပ်ပါတယ်။ TypeScript ကလည်း ဒါကို လိုက်နာစေပါတယ် — ဒါပေမယ့် ဒါကို သေချာစေတဲ့ _နည်းလမ်း_ မှာ နည်းနည်း တင်းကျပ်လွန်းနေခဲ့ပါတယ်။ TypeScript မှာ — constructor တစ်ခုပါဝင်တဲ့ class မှာ property initializers တစ်ခုခု ရှိနေရင် — အဲဒီ constructor ရဲ့ အစမှာ ဘယ် code မဆို ပါဝင်တာက အရင်က error တစ်ခု ဖြစ်ခဲ့ပါတယ်။

```ts
class Base {
  // ...
}

class Derived extends Base {
  someProperty = true;

  constructor() {
    // error!
    // have to call 'super()' first because it needs to initialize 'someProperty'.
    doSomeStuff();
    super();
  }
}
```

ဒါက `this` ကို ရည်ညွှန်းမပြုခင် `super()` ကို ခေါ်ပြီးလားဆိုတာ စစ်ဆေးဖို့ လွယ်ကူစေခဲ့ပေမယ့် — မှန်ကန်တဲ့ code တွေ အများကြီးကိုပါ ပယ်ချမိနေခဲ့ပါတယ်။ TypeScript 4.6 က အခု အဲဒီ check မှာ အများကြီး ပိုပျော့ပြောင်းလာပြီး — `super()` က `this` ကို ရည်ညွှန်းမှုတွေ မတိုင်မီ top-level မှာ ဖြစ်ပေါ်ကြောင်း ဆက်လက် သေချာစေဆဲပဲ — `super()` မတိုင်မီ တခြား code တွေ run ဖို့ ခွင့်ပြုပါတယ်။

[ဒီအပြောင်းအလဲကို အတူတကွ စိတ်ရှည်ရှည်နဲ့ ပြီးမြောက်အောင် လုပ်ဆောင်ပေးခဲ့တဲ့](https://github.com/microsoft/TypeScript/pull/29374) [Joshua Goldberg](https://github.com/JoshuaKGoldberg) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ်!

## Control Flow Analysis for Destructured Discriminated Unions (Destructure လုပ်ထားသော Discriminated Union များအတွက် Control Flow Analysis)

TypeScript က discriminant property လို့ ခေါ်တဲ့အရာကို အခြေခံပြီး types တွေကို narrow လုပ်နိုင်ပါတယ်။ ဥပမာ — အောက်က code snippet မှာ — `kind` ရဲ့ တန်ဖိုးကို စစ်ဆေးမှု တစ်ခုချင်းစီတိုင်းမှာ TypeScript က `action` ရဲ့ type ကို narrow လုပ်နိုင်ပါတယ်။

```ts
type Action =
  | { kind: "NumberContents"; payload: number }
  | { kind: "StringContents"; payload: string };

function processAction(action: Action) {
  if (action.kind === "NumberContents") {
    // `action.payload` is a number here.
    let num = action.payload * 2;
    // ...
  } else if (action.kind === "StringContents") {
    // `action.payload` is a string here.
    const str = action.payload.trim();
    // ...
  }
}
```

ဒါက — မတူညီတဲ့ data တွေ ကိုင်ထားနိုင်တဲ့ objects တွေနဲ့ အလုပ်လုပ်နိုင်စေပါတယ် — ဒါပေမယ့် ဘုံ field တစ်ခုက အဲဒီ objects တွေမှာ ဘယ် data တွေ ရှိတယ်ဆိုတာကို ပြောပြပါတယ်။

ဒါက TypeScript မှာ အလွန် အသုံးများပါတယ်; ဒါပေမယ့် — မင်းရဲ့ နှစ်သက်မှုပေါ် မူတည်ပြီး — အပေါ်က ဥပမာမှာ `kind` နဲ့ `payload` တို့ကို destructure လုပ်ချင်တာ ဖြစ်နိုင်ပါတယ်။ ဒီလိုမျိုး တစ်ခုခု ဖြစ်နိုင်ပါတယ်:

```ts
type Action =
  | { kind: "NumberContents"; payload: number }
  | { kind: "StringContents"; payload: string };

function processAction(action: Action) {
  const { kind, payload } = action;
  if (kind === "NumberContents") {
    let num = payload * 2;
    // ...
  } else if (kind === "StringContents") {
    const str = payload.trim();
    // ...
  }
}
```

အရင်က TypeScript က ဒါတွေမှာ error တက်ခဲ့ပါတယ် — `kind` နဲ့ `payload` တို့ကို object တစ်ခုတည်းကနေ variable တွေအဖြစ် ထုတ်ယူလိုက်တာနဲ့ — ၎င်းတို့က လုံးဝ သီးခြားစီ ဖြစ်သွားတယ်လို့ သတ်မှတ်ခဲ့လို့ပါ။

TypeScript 4.6 မှာတော့ — ဒါက အလုပ်ဖြစ်သွားပါပြီ!

Individual properties တွေကို `const` declaration တစ်ခုထဲ destructure လုပ်တဲ့အခါ၊ ဒါမှမဟုတ် parameter တစ်ခုကို ဘယ်တော့မှ reassign မလုပ်တဲ့ variable တွေအဖြစ် destructure လုပ်တဲ့အခါ — TypeScript က destructure လုပ်ထားတဲ့ type က discriminated union တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။ ဟုတ်ရင် — TypeScript က အခု တခြား variable တွေရဲ့ checks တွေပေါ် မူတည်ပြီး — variable တွေရဲ့ types တွေကို narrow လုပ်နိုင်ပါတယ်။ ဒါကြောင့် — ကျွန်တော်တို့ရဲ့ ဥပမာမှာ — `kind` ကို check လုပ်တာက `payload` ရဲ့ type ကို narrow လုပ်ပေးပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီ analysis ကို implement လုပ်တဲ့ pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/46266)။

## Improved Recursion Depth Checks (Recursion Depth Check များ တိုးတက်လာခြင်း)

TypeScript က structural type system တစ်ခုပေါ်မှာ တည်ဆောက်ထားပြီး — generics တွေကိုပါ ထောက်ပံ့ပေးတာမို့ — စိတ်ဝင်စားစရာ စိန်ခေါ်မှုတစ်ချို့ ရှိပါတယ်။

Structural type system တစ်ခုမှာ — object types တွေက ၎င်းတို့မှာ ရှိတဲ့ members တွေအပေါ် အခြေခံပြီး compatible ဖြစ်ပါတယ်။

```ts
interface Source {
  prop: string;
}

interface Target {
  prop: number;
}

function check(source: Source, target: Target) {
  target = source;
  // error!
  // Type 'Source' is not assignable to type 'Target'.
  //   Types of property 'prop' are incompatible.
  //     Type 'string' is not assignable to type 'number'.
}
```

သတိပြုစရာက — `Source` က `Target` နဲ့ compatible ဟုတ်မဟုတ်ဆိုတာ — ၎င်းတို့ရဲ့ _properties_ တွေ assignable ဟုတ်မဟုတ်နဲ့ ဆိုင်ပါတယ်။ ဒီကိစ္စမှာ — အဲဒါက `prop` တစ်ခုပဲ ဖြစ်ပါတယ်။

ဒီထဲကို generics တွေ ထည့်လိုက်တဲ့အခါ — ဖြေရခက်တဲ့ မေးခွန်းတစ်ချို့ ရှိလာပါတယ်။ ဥပမာ — အောက်က အခြေအနေမှာ `Source<string>` က `Target<number>` ဆီ assignable လား?

```ts
interface Source<T> {
  prop: Source<Source<T>>;
}

interface Target<T> {
  prop: Target<Target<T>>;
}

function check(source: Source<string>, target: Target<number>) {
  target = source;
}
```

ဒါကို ဖြေဆိုဖို့ — TypeScript က `prop` တွေရဲ့ types တွေ compatible ဟုတ်မဟုတ် စစ်ဆေးဖို့ လိုပါတယ်။ ဒါက နောက်ထပ် မေးခွန်းတစ်ခုဆီ ဦးတည်သွားပါတယ်: `Source<Source<string>>` က `Target<Target<number>>` ဆီ assignable လား? အဲဒါကို ဖြေဆိုဖို့ — TypeScript က အဲဒီ types တွေအတွက် `prop` compatible ဟုတ်မဟုတ် စစ်ဆေးပြီး — `Source<Source<Source<string>>>` က `Target<Target<Target<number>>>` ဆီ assignable လားဆိုတာ စစ်ဆေးတဲ့အထိ ရောက်သွားပါတယ်။ နည်းနည်းဆက် ကြည့်သွားရင် — ပိုတူးလေလေ type က အဆုံးမရှိ ချဲ့ထွင်နေတာကို မင်း သတိထားမိနိုင်ပါတယ်။

TypeScript မှာ ဒီနေရာအတွက် heuristics တစ်ချို့ ရှိပါတယ် — တိကျတဲ့ depth check တစ်ခုကို ရောက်ပြီးနောက် type တစ်ခုက အဆုံးမရှိ ချဲ့ထွင်နေပုံ ပေါ်ရင် — အဲဒီ types တွေ compatible ဖြစ်နိုင်တယ်လို့ သတ်မှတ်ပါတယ်။ ဒါက များသောအားဖြင့် လုံလောက်ပေမယ့် — ရှက်စရာကောင်းလောက်အောင်ပဲ — ဒါနဲ့ မဖမ်းမိတဲ့ false-negatives တစ်ချို့ ရှိခဲ့ပါတယ်။

```ts
interface Foo<T> {
  prop: T;
}

declare let x: Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>;
declare let y: Foo<Foo<Foo<Foo<Foo<string>>>>>;

x = y;
```

လူတစ်ယောက် ဖတ်ကြည့်ရင် — အပေါ်က ဥပမာမှာ `x` နဲ့ `y` တို့က incompatible ဖြစ်သင့်တာကို မြင်နိုင်ပါတယ်။ Types တွေက နက်ရှိုင်းစွာ nested ဖြစ်နေပေမယ့် — အဲဒါက ၎င်းတို့ ကြေညာထားပုံရဲ့ အကျိုးဆက် တစ်ခုပဲ ဖြစ်ပါတယ်။ Heuristic က — developer တစ်ယောက်က type တစ်ခုကို ကိုယ်တိုင် ရေးလိုက်တာမျိုးကနေ မဟုတ်ဘဲ — types တွေကို စူးစမ်းရှာဖွေခြင်းကနေတစ်ဆင့် ထုတ်ပေးလိုက်တဲ့ နက်ရှိုင်းစွာ nested ဖြစ်တဲ့ types တွေရဲ့ အခြေအနေတွေကို ဖမ်းယူဖို့ ရည်ရွယ်ထားတာပါ။

TypeScript 4.6 က အခု ဒီအခြေအနေတွေကို ခွဲခြားနိုင်ပြီး — နောက်ဆုံး ဥပမာမှာ မှန်ကန်စွာ error တက်စေပါတယ်။ ဒါ့အပြင် — ဘာသာစကားက ရှင်းရှင်းလင်းလင်း ရေးထားတဲ့ types တွေကနေ ဖြစ်လာတဲ့ false-positives တွေကို စိုးရိမ်စရာ မလိုတော့တာမို့ — TypeScript က type တစ်ခုက အဆုံးမရှိ ချဲ့ထွင်နေတယ်ဆိုတာကို အများကြီး စောစီးစွာ ကောက်ချက်ချနိုင်ပြီး — type compatibility စစ်ဆေးရာမှာ အလုပ်အများကြီး သက်သာစေပါတယ်။ ရလဒ်အနေနဲ့ — DefinitelyTyped ပေါ်က `redux-immutable`, `react-lazylog` နဲ့ `yup` လို libraries တွေမှာ check-time 50% လျှော့ကျသွားတာကို တွေ့ခဲ့ရပါတယ်။

ဒီအပြောင်းအလဲကို TypeScript 4.5.3 ထဲကို cherry-pick လုပ်ပြီးသား ဖြစ်လို့ မင်းမှာ ရှိပြီးသား ဖြစ်နိုင်ပေမယ့် — ဒါက TypeScript 4.6 ရဲ့ ထင်ရှားတဲ့ feature တစ်ခုဖြစ်ပြီး — [ဒီမှာ ထပ်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/46599)။

## Indexed Access Inference Improvements (Indexed Access Inference တိုးတက်မှုများ)

TypeScript က အခု — mapped object type တစ်ခုထဲကို ချက်ချင်း index လုပ်တဲ့ indexed access types တွေဆီကို မှန်ကန်စွာ infer လုပ်နိုင်ပါတယ်။

```ts
interface TypeMap {
  number: number;
  string: string;
  boolean: boolean;
}

type UnionRecord<P extends keyof TypeMap> = {
  [K in P]: {
    kind: K;
    v: TypeMap[K];
    f: (p: TypeMap[K]) => void;
  };
}[P];

function processRecord<K extends keyof TypeMap>(record: UnionRecord<K>) {
  record.f(record.v);
}

// This call used to have issues - now works!
processRecord({
  kind: "string",
  v: "hello!",

  // 'val' used to implicitly have the type 'string | number | boolean',
  // but now is correctly inferred to just 'string'.
  f: (val) => {
    console.log(val.toUpperCase());
  },
});
```

ဒီ pattern ကို အရင်ကတည်းက ပံ့ပိုးထားပြီး — `record.f(record.v)` ဆိုတဲ့ ခေါ်ဆိုမှုက တရားဝင်ကြောင်း TypeScript ကို နားလည်စေခဲ့ပေမယ့် — အရင်က `processRecord` ကို ခေါ်တဲ့အခါ `val` အတွက် inference results ညံ့ဖျင်းစွာ ပေးခဲ့ပါတယ်။

TypeScript 4.6 က ဒါကို တိုးတက်စေတာမို့ — `processRecord` ကို ခေါ်ဆိုမှုထဲမှာ type assertions တွေ မလိုအပ်တော့ပါဘူး။

နောက်ထပ် အချက်အလက်တွေအတွက် — [pull request အကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47109)။

## Control Flow Analysis for Dependent Parameters (Dependent Parameter များအတွက် Control Flow Analysis)

Signature တစ်ခုကို — tuples တွေရဲ့ discriminated union တစ်ခု ဖြစ်တဲ့ rest parameter တစ်ခုနဲ့ ကြေညာနိုင်ပါတယ်။

```ts
function func(...args: ["str", string] | ["num", number]) {
  // ...
}
```

ဒါက ပြောနေတာက — `func` ဆီက arguments တွေက ပထမ argument အပေါ် လုံးလုံး မူတည်တယ် ဆိုတာပါ။ ပထမ argument က `"str"` ဆိုတဲ့ string ဆိုရင် — ဒုတိယ argument က `string` တစ်ခု ဖြစ်ရပါတယ်။ ပထမ argument က `"num"` ဆိုတဲ့ string ဆိုရင် — ဒုတိယ argument က `number` တစ်ခု ဖြစ်ရပါတယ်။

TypeScript က ဒီလို signature တစ်ခုကနေ function တစ်ခုရဲ့ type ကို infer လုပ်တဲ့ အခြေအနေတွေမှာ — အခု တစ်ခုနဲ့တစ်ခု မူတည်နေတဲ့ parameters တွေကို narrow လုပ်နိုင်ပါတယ်။

```ts
type Func = (...args: ["a", number] | ["b", string]) => void;

const f1: Func = (kind, payload) => {
  if (kind === "a") {
    payload.toFixed(); // 'payload' narrowed to 'number'
  }
  if (kind === "b") {
    payload.toUpperCase(); // 'payload' narrowed to 'string'
  }
};

f1("a", 42);
f1("b", "hello");
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [GitHub ပေါ်က အပြောင်းအလဲကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47190)။

## `--target es2022`

TypeScript ရဲ့ `--target` option က အခု `es2022` ကို ပံ့ပိုးပေးပါတယ်။ ဆိုလိုတာက — class fields လိုမျိုး feature တွေအတွက် — ၎င်းတို့ကို ထိန်းသိမ်းထားနိုင်တဲ့ တည်ငြိမ်တဲ့ output target တစ်ခု ရှိလာပါပြီ။ [`at()` method on `Array`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at), [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) ဒါမှမဟုတ် [the `cause` option on `new Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error#rethrowing_an_error_with_a_cause) လို built-in လုပ်ဆောင်ချက်အသစ်တွေကိုလည်း — ဒီ `--target` setting အသစ် ဒါမှမဟုတ် `--lib es2022` နဲ့ သုံးနိုင်ပါတယ်။

ဒီလုပ်ဆောင်ချက်ကို [Kagami Sascha Rosylight (saschanaz)](https://github.com/saschanaz) က PR အများအပြားကနေတစ်ဆင့် [implement လုပ်ပေးခဲ့ပြီး](https://github.com/microsoft/TypeScript/pull/46291) — အဲဒီ ပံ့ပိုးမှုအတွက် ကျွန်တော်တို့ ကျေးဇူးတင်ပါတယ်!

## Removed Unnecessary Arguments in `react-jsx` (`react-jsx` တွင် မလိုအပ်သော Argument များ ဖယ်ရှားခြင်း)

အရင်က — `--jsx react-jsx` နဲ့ အောက်က code လိုမျိုး compile လုပ်တဲ့အခါ

```tsx
export const el = <div>foo</div>;
```

TypeScript က အောက်က JavaScript code ကို ထုတ်ပေးခဲ့ပါတယ်:

```jsx
import { jsx as _jsx } from "react/jsx-runtime";
export const el = _jsx("div", { children: "foo" }, void 0);
```

အဲဒီ နောက်ဆုံး `void 0` argument က ဒီ emit mode မှာ မလိုအပ်ပါဘူး — အဲဒါကို ဖယ်ရှားလိုက်တာက bundle sizes တွေကို တိုးတက်စေနိုင်ပါတယ်။

```diff
- export const el = _jsx("div", { children: "foo" }, void 0);
+ export const el = _jsx("div", { children: "foo" });
```

[Alexander Tarasyuk](https://github.com/a-tarasyuk) ဆီက [pull request တစ်ခု](https://github.com/microsoft/TypeScript/pull/47467) ကြောင့် — TypeScript 4.6 က အခု `void 0` argument ကို ဖယ်ရှားပစ်ပါတယ်။

## JSDoc Name Suggestions (JSDoc Name အကြံပြုချက်များ)

JSDoc မှာ — `@param` tag တစ်ခုကို သုံးပြီး parameters တွေကို မှတ်တမ်းတင်နိုင်ပါတယ်။

```js
/**
 * @param x The first operand
 * @param y The second operand
 */
function add(x, y) {
  return x + y;
}
```

ဒါပေမယ့် — ဒီ comments တွေ ခေတ်နောက်ကျသွားရင် ဘာဖြစ်မလဲ? `x` နဲ့ `y` တို့ကို `a` နဲ့ `b` ဆိုပြီး ပြန်မှည့်လိုက်ရင်ကော?

```js
/**
 * @param x {number} The first operand
 * @param y {number} The second operand
 */
function add(a, b) {
  return a + b;
}
```

အရင်က TypeScript က ဒီအကြောင်းကို JavaScript files တွေပေါ်မှာ type-checking လုပ်တဲ့အခါမှပဲ — `checkJs` option ကို သုံးတဲ့အခါ ဒါမှမဟုတ် file ရဲ့ ထိပ်မှာ `// @ts-check` comment တစ်ခု ထည့်တဲ့အခါမှပဲ — ပြောပြတတ်ခဲ့ပါတယ်။

အခုတော့ — မင်းရဲ့ editor ထဲမှာ TypeScript files တွေအတွက်ပါ အလားတူ အချက်အလက်တွေ ရနိုင်ပါပြီ! TypeScript က အခု — function နဲ့ သူ့ရဲ့ JSDoc comment အကြားမှာ parameter names တွေ မကိုက်ညီတဲ့အခါ — အကြံပြုချက်တွေ ပေးပါတယ်။

![JSDoc comments တွေထဲက parameter names တွေ တကယ့် parameter name တစ်ခုနဲ့ မကိုက်ညီတဲ့အခါ editor ထဲမှာ ပြသနေတဲ့ Suggestion diagnostics များ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2022/02/jsdoc-comment-suggestions-4-6.png)

[ဒီအပြောင်းအလဲ](https://github.com/microsoft/TypeScript/pull/47257) ကို [Alexander Tarasyuk](https://github.com/a-tarasyuk) က ပံ့ပိုးပေးခဲ့ပါတယ်!

## More Syntax and Binding Errors in JavaScript (JavaScript တွင် Syntax နှင့် Binding Error များ ပိုများလာခြင်း)

TypeScript က JavaScript files တွေထဲမှာ သူ့ရဲ့ syntax နဲ့ binding errors အစုအဝေးကို ချဲ့ထွင်လိုက်ပါတယ်။ ဒီ errors အသစ်တွေကို — Visual Studio ဒါမှမဟုတ် Visual Studio Code လို editor တစ်ခုမှာ JavaScript files တွေကို ဖွင့်ရင် ဒါမှမဟုတ် JavaScript code တွေကို TypeScript compiler ကနေတစ်ဆင့် run ရင် — `checkJs` ကို ဖွင့်ထားစရာ မလို၊ file ရဲ့ ထိပ်မှာ `// @ts-check` comment ထည့်စရာတောင် မလိုဘဲ — မြင်ရပါလိမ့်မယ်။

ဥပမာတစ်ခုအနေနဲ့ — JavaScript file တစ်ခုရဲ့ scope တစ်ခုတည်းထဲမှာ `const` တစ်ခုကို နှစ်ကြိမ် ကြေညာထားရင် — TypeScript က အခု အဲဒီ declarations တွေပေါ်မှာ error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။

```ts
const foo = 1234;
//    ~~~
// error: Cannot redeclare block-scoped variable 'foo'.

// ...

const foo = 5678;
//    ~~~
// error: Cannot redeclare block-scoped variable 'foo'.
```

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — modifier တစ်ခုကို မှားယွင်းစွာ သုံးနေရင် TypeScript က မင်းကို အသိပေးပါလိမ့်မယ်။

```ts
function container() {
    export function foo() {
//  ~~~~~~
// error: Modifiers cannot appear here.
    }
}
```

ဒီ errors တွေကို file ရဲ့ ထိပ်မှာ `// @ts-nocheck` ထည့်ခြင်းအားဖြင့် ပိတ်ထားနိုင်ပါတယ် — ဒါပေမယ့် ဒါက မင်းရဲ့ JavaScript workflow မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အစောပိုင်း တုံ့ပြန်ချက်တွေကို ကျွန်တော်တို့ ကြားချင်ပါတယ်။ Visual Studio Code အတွက် — [TypeScript and JavaScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) ကို install လုပ်ပြီး အလွယ်တကူ စမ်းသုံးကြည့်နိုင်ပြီး — [ပထမ](https://github.com/microsoft/TypeScript/pull/47067) နဲ့ [ဒုတိယ](https://github.com/microsoft/TypeScript/pull/47075) pull requests တွေအကြောင်း ထပ်ဖတ်နိုင်ပါတယ်။

## TypeScript Trace Analyzer (TypeScript Trace Analyzer ကိရိယာ)

ရံဖန်ရံခါ — teams တွေက တခြား types တွေနဲ့ ဖန်တီးရန်၊ နှိုင်းယှဉ်ရန် တွက်ချက်မှု အကုန်အကျများတဲ့ types တွေကို ကြုံရနိုင်ပါတယ်။ အဲဒီလို အကုန်အကျများတဲ့ types တစ်ချို့ကို ဖော်ထုတ်ဖို့ ဒါမှမဟုတ် TypeScript compiler ထဲမှာ ပြဿနာတွေကို ရှာဖွေဖို့ — [TypeScript မှာ `--generateTrace` flag တစ်ခု](https://github.com/microsoft/TypeScript/wiki/Performance#performance-tracing) ရှိပါတယ်။ `--generateTrace` က ထုတ်ပေးတဲ့ အချက်အလက်တွေက အသုံးဝင်နိုင်ပေမယ့် (TypeScript 4.6 မှာ ထည့်ပေးထားတဲ့ အချက်အလက်တစ်ချို့နဲ့ဆို အထူးသဖြင့်) — ရှိပြီးသား trace visualizers တွေမှာ ဖတ်ရခက်တတ်ပါတယ်။

ဒီအချက်အလက်တွေကို ပိုပြီး ကြေညက်လွယ်တဲ့ မြင်ကွင်းတစ်ခုရဖို့ — ကျွန်တော်တို့ မကြာသေးမီက [@typescript/analyze-trace](https://www.npmjs.com/package/@typescript/analyze-trace) ဆိုတဲ့ tool တစ်ခုကို ထုတ်ဝေခဲ့ပါတယ်။ လူတိုင်း `analyze-trace` ကို လိုအပ်မယ်လို့ မမျှော်လင့်ပေမယ့် — [TypeScript နဲ့ build performance ပြဿနာတွေ](https://github.com/microsoft/TypeScript/wiki/Performance) ကြုံနေရတဲ့ team တိုင်းအတွက် အသုံးဝင်နိုင်မယ်လို့ ထင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [`analyze-trace` tool ရဲ့ repo](https://github.com/microsoft/typescript-analyze-trace) ကို ကြည့်နိုင်ပါတယ်။

## Breaking Changes (Breaking Change များ)

### Object Rests Drop Unspreadable Members from Generic Objects (Generic Object များမှ Unspreadable Member များကို Object Rest များ ဖယ်ရှားခြင်း)

Object rest expressions တွေက အခု — generic objects တွေပေါ်မှာ unspreadable ဖြစ်ပုံရတဲ့ members တွေကို ဖယ်ရှားပစ်ပါတယ်။ အောက်က ဥပမာမှာ...

```ts
class Thing {
  someProperty = 42;

  someMethod() {
    // ...
  }
}

function foo<T extends Thing>(x: T) {
  let { someProperty, ...rest } = x;

  // Used to work, is now an error!
  // Property 'someMethod' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.
  rest.someMethod();
}
```

...`rest` variable က အရင်က `Omit<T, "someProperty">` type ရှိခဲ့ပါတယ် — ဘာလို့လဲဆိုတော့ TypeScript က တခြား properties တွေထဲက ဘယ်ဟာတွေကို destructure လုပ်ခဲ့လဲဆိုတာကို တင်းကျပ်စွာ ခွဲခြမ်းစိတ်ဖြာခဲ့လို့ပါ။ ဒါက non-generic type တစ်ခုကနေ destructuring လုပ်တဲ့အခါ `...rest` က အလုပ်လုပ်ပုံကို ပုံစံမဖော်နိုင်ပါဘူး — ဘာလို့လဲဆိုတော့ `someMethod` ကလည်း ပုံမှန်အားဖြင့် ဖယ်ချခံရမှာ မို့လို့ပါ။ TypeScript 4.6 မှာ — `rest` ရဲ့ type က `Omit<T, "someProperty" | "someMethod">` ဖြစ်ပါတယ်။

ဒါက `this` ကနေ destructure လုပ်တဲ့အခါမှာလည်း ဖြစ်လာနိုင်ပါတယ်။ `...rest` element တစ်ခုကို သုံးပြီး `this` ကို destructure လုပ်တဲ့အခါ — class တစ်ခုရဲ့ instances တွေကို တခြားနေရာတွေမှာ destructure လုပ်တာနဲ့ ညီညွတ်စေဖို့ — unspreadable ဖြစ်ပြီး non-public ဖြစ်တဲ့ members တွေကို အခု ဖယ်ရှားပါတယ်။

```ts
class Thing {
  someProperty = 42;

  someMethod() {
    // ...
  }

  someOtherMethod() {
    let { someProperty, ...rest } = this;

    // Used to work, is now an error!
    // Property 'someMethod' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.
    rest.someMethod();
  }
}
```

အသေးစိတ်အတွက် — [သက်ဆိုင်တဲ့ အပြောင်းအလဲကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47078)။

### JavaScript Files Always Receive Grammar and Binding Errors (JavaScript File များတွင် Grammar နှင့် Binding Error များ အမြဲရရှိခြင်း)

အရင်က — JavaScript file တစ်ခုထဲမှာ TypeScript syntax ကို မတော်တဆ သုံးမိတာမျိုးကလွဲရင် — TypeScript က JavaScript ထဲက grammar errors အများစုကို လျစ်လျူရှုခဲ့ပါတယ်။ TypeScript က အခု — modifier တွေ မှားသုံးတာ၊ duplicate declarations တွေနဲ့ အခြားအရာတွေလို JavaScript syntax နဲ့ binding errors တွေကို မင်းရဲ့ file ထဲမှာ ပြသပါတယ်။ ဒါတွေက Visual Studio Code ဒါမှမဟုတ် Visual Studio မှာ အထင်ရှားဆုံး ဖြစ်တတ်ပေမယ့် — JavaScript code တွေကို TypeScript compiler ကနေတစ်ဆင့် run တဲ့အခါမှာလည်း ဖြစ်ပွားနိုင်ပါတယ်။

ဒီ errors တွေကို file ရဲ့ ထိပ်မှာ `// @ts-nocheck` comment တစ်ခု ထည့်ခြင်းအားဖြင့် ရှင်းရှင်းလင်းလင်း ပိတ်ထားနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — ဒီ features တွေကို implement လုပ်တဲ့ [ပထမ](https://github.com/microsoft/TypeScript/pull/47067) နဲ့ [ဒုတိယ](https://github.com/microsoft/TypeScript/pull/47075) pull requests တွေကို ကြည့်နိုင်ပါတယ်။
