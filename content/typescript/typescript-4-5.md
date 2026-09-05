---
title: "TypeScript 4.5 (TypeScript 4.5 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.5 ထုတ်ပြန်မှု — node_modules မှ lib ကို override လုပ်ခြင်း, Awaited type, template string type များကို discriminant အဖြစ် သုံးခြင်း, conditional types များတွင် tail-recursion elimination, preserveValueImports, import names များပေါ်ရှိ type modifiers နှင့် အခြား တိုးတက်မှုများ အကြောင်း"
order: 85
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html"
status: translated
updated: 2026-09-05
---

## Supporting `lib` from `node_modules` (`node_modules` မှ `lib` ကို ပံ့ပိုးခြင်း)

TypeScript နဲ့ JavaScript ပံ့ပိုးမှုတွေ out of the box (ထည့်သွင်းပြီး ချက်ချင်း) ကောင်းကောင်း အလုပ်လုပ်ဖို့ — TypeScript က declaration files (`.d.ts` files) အစုတစ်စုကို တွဲထည့်ထားပါတယ်။ ဒီ declaration files တွေက JavaScript ဘာသာစကားထဲမှာ ရနိုင်တဲ့ APIs တွေနဲ့ browser ရဲ့ standard DOM APIs တွေကို ကိုယ်စားပြုပါတယ်။ မင်းရဲ့ [`target`](https://www.typescriptlang.org/tsconfig#target) ပေါ် အခြေခံတဲ့ ကျိုးကြောင်းဆီလျော်တဲ့ defaults တွေ ရှိပေမယ့် — `tsconfig.json` ထဲက [`lib`](https://www.typescriptlang.org/tsconfig#lib) setting ကို configure လုပ်ပြီး — မင်းရဲ့ program က ဘယ် declaration files တွေ သုံးမလဲဆိုတာ ရွေးချယ်နိုင်ပါတယ်။

ဒါပေမယ့် — ဒီ declaration files တွေကို TypeScript နဲ့အတူ ထည့်သွင်းထားခြင်းရဲ့ အားနည်းချက် နှစ်မျိုး ရံဖန်ရံခါ ရှိပါတယ်:

- TypeScript ကို upgrade လုပ်တဲ့အခါ — TypeScript ရဲ့ built-in declaration files တွေရဲ့ အပြောင်းအလဲတွေကိုပါ ကိုင်တွယ်ဖို့ အတင်းအကျပ် ဖြစ်ရပါတယ် — DOM APIs တွေက ဒီလောက် မကြာခဏ ပြောင်းလဲနေတဲ့အခါ ဒါက စိန်ခေါ်မှုတစ်ခု ဖြစ်နိုင်ပါတယ်။
- ဒီ files တွေကို မင်းရဲ့ လိုအပ်ချက်တွေနဲ့ project ရဲ့ dependencies တွေရဲ့ လိုအပ်ချက်တွေနဲ့ ကိုက်ညီအောင် customize လုပ်ဖို့ ခက်ခဲပါတယ် (ဥပမာ — မင်းရဲ့ dependencies တွေက DOM APIs တွေ သုံးတယ်လို့ ကြေညာထားရင် — မင်းလည်း DOM APIs တွေကို သုံးဖို့ အတင်းအကျပ် ဖြစ်ရနိုင်ပါတယ်)။

TypeScript 4.5 က — `@types/` ပံ့ပိုးမှု အလုပ်လုပ်ပုံနဲ့ ဆင်တူတဲ့ နည်းလမ်းတစ်ခုနဲ့ — တိကျတဲ့ built-in `lib` တစ်ခုကို override လုပ်ဖို့ နည်းလမ်းတစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ TypeScript က ဘယ် `lib` files တွေ ထည့်သွင်းရမလဲ ဆုံးဖြတ်တဲ့အခါ — `node_modules` ထဲမှာ scoped `@typescript/lib-*` package တစ်ခု ရှိမရှိ အရင်ရှာပါတယ်။ ဥပမာ — `lib` ထဲမှာ `dom` ကို option တစ်ခုအနေနဲ့ ထည့်တဲ့အခါ — ရနိုင်ရင် TypeScript က `node_modules/@typescript/lib-dom` ထဲက types တွေကို သုံးပါတယ်။

ပြီးတော့ — ပေးထားတဲ့ `lib` တစ်ခုအတွက် တာဝန်ယူဖို့ — မင်းရဲ့ package manager ကို သုံးပြီး တိကျတဲ့ package တစ်ခုကို install လုပ်နိုင်ပါတယ်။ ဥပမာ — ဒီနေ့ TypeScript က DOM APIs တွေရဲ့ ဗားရှင်းတွေကို `@types/web` ပေါ်မှာ ထုတ်ဝေပါတယ်။ DOM APIs တွေရဲ့ တိကျတဲ့ ဗားရှင်းတစ်ခုကို မင်းရဲ့ project နဲ့ ချိတ်ထားချင်ရင် — ဒါကို မင်းရဲ့ `package.json` ထဲကို ထည့်နိုင်ပါတယ်:

```json
{
  "dependencies": {
    "@typescript/lib-dom": "npm:@types/web"
  }
}
```

ပြီးတော့ — 4.5 ကစပြီး — TypeScript ကို update လုပ်နိုင်ပြီး — မင်းရဲ့ dependency manager ရဲ့ lockfile က DOM types တွေရဲ့ ဗားရှင်းအတိအကျတူတူကိုပဲ သုံးကြောင်း သေချာစေမှာ ဖြစ်ပါတယ်။ ဆိုလိုတာက — မင်းရဲ့ types တွေကို မင်းရဲ့ ကိုယ်ပိုင် အခြေအနေအရ update လုပ်ခွင့် ရပါတယ်။

ဒီ feature ကို တည်ဆောက်ပြီး စမ်းသပ်နေတုန်း — အလွန် အကူအညီဖြစ်ပြီး စိတ်ရှည်လက်ရှည် ပံ့ပိုးပေးခဲ့တဲ့ [saschanaz](https://github.com/saschanaz) ကို အထူး ကျေးဇူးတင်ကြောင်း ပြောကြားချင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီအပြောင်းအလဲရဲ့ implementation ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45771)။

## The `Awaited` Type and `Promise` Improvements (`Awaited` Type နှင့် `Promise` တိုးတက်မှုများ)

TypeScript 4.5 က `Awaited` type လို့ ခေါ်တဲ့ utility type အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ ဒီ type က — `async` functions တွေထဲက `await` လိုမျိုး ဒါမှမဟုတ် `Promise` တွေရဲ့ `.then()` method လိုမျိုး လုပ်ဆောင်ချက်တွေကို ပုံစံဖော်ဖို့ ရည်ရွယ်ပါတယ် — အထူးသဖြင့် ၎င်းတို့က `Promise` တွေကို recursively (အထပ်ထပ်) ဖြန့်ထုတ် (unwrap) လုပ်တဲ့ ပုံစံကိုပါ။

```ts
// A = string
type A = Awaited<Promise<string>>;

// B = number
type B = Awaited<Promise<Promise<number>>>;

// C = boolean | number
type C = Awaited<boolean | Promise<number>>;
```

`Awaited` type က — `Promise.all`, `Promise.race` စတဲ့ JavaScript built-ins တွေ အပါအဝင် — ရှိပြီးသား APIs တွေကို ပုံစံဖော်ဖို့ အသုံးဝင်နိုင်ပါတယ်။ တကယ်တော့ — `Promise.all` နဲ့ inference ပတ်သက်တဲ့ ပြဿနာတစ်ချို့က `Awaited` အတွက် လှုံ့ဆော်မှုတွေ ဖြစ်ခဲ့ပါတယ်။ TypeScript 4.4 နဲ့ အစောပိုင်းမှာ မအောင်မြင်တဲ့ ဥပမာတစ်ခု ဒီမှာ ပါပါတယ်။

```ts
declare function MaybePromise<T>(value: T): T | Promise<T> | PromiseLike<T>;

async function doSomething(): Promise<[number, number]> {
  const result = await Promise.all([MaybePromise(100), MaybePromise(200)]);

  // Error!
  //
  //    [number | Promise<100>, number | Promise<200>]
  //
  // is not assignable to type
  //
  //    [number, number]
  return result;
}
```

အခုတော့ — `Promise.all` က feature တစ်ချို့ကို `Awaited` နဲ့ ပေါင်းစပ်အသုံးပြုပြီး — ပိုကောင်းမွန်တဲ့ inference results တွေ ရအောင် လုပ်ပေးတာမို့ — အပေါ်က ဥပမာက အလုပ်လုပ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီအပြောင်းအလဲအကြောင်း GitHub မှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45350)။

## Template String Types as Discriminants (Template String Type များကို Discriminant အဖြစ် သုံးခြင်း)

TypeScript 4.5 က အခု — template string types တွေရှိတဲ့ values တွေကို narrow လုပ်နိုင်ပြီး — template string types တွေကို discriminants အဖြစ်လည်း အသိအမှတ်ပြုပါတယ်။

ဥပမာအနေနဲ့ — အောက်က ဥပမာက အရင်က မအောင်မြင်ခဲ့ပေမယ့် — TypeScript 4.5 မှာတော့ type-check အောင်မြင်ပါတယ်။

```ts twoslash
export interface Success {
    type: `${string}Success`;
    body: string;
}

export interface Error {
    type: `${string}Error`;
    message: string
}

export function handler(r: Success | Error) {
    if (r.type === "HttpSuccess") {
        const token = r.body;
        //            ^?
    }
}
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီ feature ကို ဖြစ်စေတဲ့ အပြောင်းအလဲကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/46137)။

## `module es2022`

[Kagami S. Rosylight](https://github.com/saschanaz) ရဲ့ ပံ့ပိုးမှုကြောင့် — TypeScript က အခု `module` setting အသစ်တစ်ခုဖြစ်တဲ့ `es2022` ကို ပံ့ပိုးပေးပါတယ်။ [`module es2022`](https://www.typescriptlang.org/tsconfig#module) ရဲ့ အဓိက feature က top-level `await` ပါ — ဆိုလိုတာက `async` functions တွေရဲ့ အပြင်မှာပါ `await` ကို သုံးနိုင်ပါတယ်။ ဒါကို `--module esnext` (နဲ့ အခု [`--module nodenext`](https://www.typescriptlang.org/tsconfig#target)) တွေမှာ ပံ့ပိုးထားပြီးသား ဖြစ်ပေမယ့် — `es2022` က ဒီ feature အတွက် ပထမဆုံး stable target ဖြစ်ပါတယ်။

[ဒီအပြောင်းအလဲအကြောင်း ဒီမှာ ထပ်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44656)။

## Tail-Recursion Elimination on Conditional Types (Conditional Type များတွင် Tail-Recursion ဖယ်ရှားခြင်း)

TypeScript က — ဖြစ်နိုင်ခြေရှိတဲ့ infinite recursion တစ်ခု၊ ဒါမှမဟုတ် အချိန်အကြာကြီး ယူပြီး မင်းရဲ့ editor အတွေ့အကြုံကို ထိခိုက်စေနိုင်တဲ့ type expansions တစ်ခုခုကို တွေ့တဲ့အခါ — မကြာခဏ ယဉ်ကျေးစွာ fail ဖို့ လိုအပ်ပါတယ်။ ရလဒ်အနေနဲ့ — TypeScript က — အဆုံးမရှိ နက်ရှိုင်းတဲ့ type တစ်ခုကို ဖြတ်ထုတ်ဖို့ ကြိုးစားတဲ့အခါ ဒါမှမဟုတ် ကြားခံ results အများကြီး ထုတ်ပေးတဲ့ types တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — လမ်းချော်မသွားအောင် heuristics တွေ ရှိပါတယ်။

```ts
type InfiniteBox<T> = { item: InfiniteBox<T> };

type Unpack<T> = T extends { item: infer U } ? Unpack<U> : T;

// error: Type instantiation is excessively deep and possibly infinite.
type Test = Unpack<InfiniteBox<number>>;
```

အပေါ်က ဥပမာက ရည်ရွယ်ချက်ရှိရှိ ရိုးရှင်းပြီး အသုံးမကျအောင် လုပ်ထားတာပါ — ဒါပေမယ့် တကယ်အသုံးဝင်ပြီး ကံဆိုးချင်တော့ ကျွန်တော်တို့ရဲ့ heuristics တွေကို နှိုးဆော်မိတဲ့ types တွေ အများကြီး ရှိပါတယ်။ ဥပမာအနေနဲ့ — အောက်က `TrimLeft` type က string လိုမျိုး type တစ်ခုရဲ့ အစကနေ space တွေကို ဖယ်ရှားပေးပါတယ်။ Space တစ်ခုနဲ့ စတင်တဲ့ string type တစ်ခုကို ပေးလိုက်ရင် — ကျန်တဲ့ string ရဲ့ အစိတ်အပိုင်းကို `TrimLeft` ဆီ ချက်ချင်း ပြန်ထည့်ပေးလိုက်ပါတယ်။

```ts
type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;

// Test = "hello" | "world"
type Test = TrimLeft<"   hello" | " world">;
```

ဒီ type က အသုံးဝင်နိုင်ပေမယ့် — string တစ်ခုမှာ ရှေ့ဆုံးက space 50 ခု ရှိနေရင်တော့ — error တစ်ခု ရပါလိမ့်မယ်။

```ts
type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;

// error: Type instantiation is excessively deep and possibly infinite.
type Test = TrimLeft<"                                                oops">;
```

ဒါက စိတ်မကောင်းစရာပါ — ဘာလို့လဲဆိုတော့ ဒီလို types တွေက strings တွေပေါ်မှာ လုပ်ဆောင်ချက်တွေကို ပုံစံဖော်ရာမှာ အလွန် အသုံးဝင်တတ်လို့ပါ — ဥပမာ — URL routers တွေအတွက် parsers တွေပါ။ ပိုဆိုးတာက — ပိုအသုံးဝင်တဲ့ type တစ်ခုက ပုံမှန်အားဖြင့် type instantiations တွေ ပိုများစေပြီး — input length အပေါ် ကန့်သတ်ချက်တွေလည်း ပိုများလာစေပါတယ်။

ဒါပေမယ့် ကယ်တင်နိုင်တဲ့ အချက်တစ်ခု ရှိပါတယ်: `TrimLeft` က branch တစ်ခုမှာ _tail-recursive_ (အမြီးမှာ ကိုယ့်ဟာကိုယ် ပြန်ခေါ်) ဖြစ်တဲ့ ပုံစံနဲ့ ရေးထားပါတယ်။ သူ့ဟာသူ ပြန်ခေါ်တဲ့အခါ — result ကို ချက်ချင်း ပြန်ပေးလိုက်ပြီး — အဲဒီ result နဲ့ ဘာမှ ထပ်မလုပ်တော့ပါဘူး။ ဒီလို types တွေက ကြားခံ results တွေ ဖန်တီးဖို့ မလိုတာမို့ — TypeScript ထဲမှာ တည်ဆောက်ထားတဲ့ type recursion heuristics အများစုကို မနှိုးဆော်မိအောင် ရှောင်ရှားနိုင်တဲ့ နည်းလမ်းနဲ့ ပိုမြန်မြန် implement လုပ်နိုင်ပါတယ်။

ဒါကြောင့်ပဲ TypeScript 4.5 က conditional types တွေပေါ်မှာ tail-recursion elimination တစ်ချို့ကို လုပ်ဆောင်ပါတယ်။ Conditional type တစ်ခုရဲ့ branch တစ်ခုက နောက် conditional type တစ်ခု သက်သက် ဖြစ်နေသရွေ့ — TypeScript က ကြားခံ instantiations တွေကို ရှောင်နိုင်ပါတယ်။ ဒီ types တွေ လမ်းချော်မသွားအောင် heuristics တွေ ဆက်ရှိပါသေးတယ် — ဒါပေမယ့် အများကြီး ပိုရက်ရောလာပါတယ်။

သတိပြုထားပါ — အောက်က type ကတော့ — conditional type တစ်ခုရဲ့ result ကို union တစ်ခုထဲ ထည့်ပြီး သုံးတာမို့ — optimize _လုပ်ပေးမှာ မဟုတ်ပါဘူး_။

```ts
type GetChars<S> =
    S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;
```

အဲဒါကို tail-recursive ဖြစ်အောင် လုပ်ချင်ရင် — tail-recursive functions တွေမှာ လုပ်သလိုပဲ — "accumulator" type parameter တစ်ခုကို လက်ခံတဲ့ helper တစ်ခုကို မိတ်ဆက်နိုင်ပါတယ်။

```ts
type GetChars<S> = GetCharsHelper<S, never>;
type GetCharsHelper<S, Acc> =
    S extends `${infer Char}${infer Rest}` ? GetCharsHelper<Rest, Char | Acc> : Acc;
```

implementation အကြောင်း [ဒီမှာ ထပ်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45711)။

## Disabling Import Elision (Import Elision ကို ပိတ်ခြင်း)

TypeScript က import တစ်ခုကို မင်း သုံးနေတယ်ဆိုတာကို မတွေ့နိုင်တဲ့ အခြေအနေတစ်ချို့ ရှိပါတယ်။ ဥပမာ — အောက်က code ကို ကြည့်ပါ:

```ts
import { Animal } from "./animal.js";

eval("console.log(new Animal().isDangerous())");
```

Default အနေနဲ့ — TypeScript က ဒီ import ကို အသုံးမပြုထားသလို ပေါ်နေလို့ — အမြဲ ဖယ်ရှားပစ်ပါတယ်။ TypeScript 4.5 မှာ — [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports) လို့ ခေါ်တဲ့ flag အသစ်တစ်ခုကို enable လုပ်ပြီး — TypeScript က မင်းရဲ့ JavaScript outputs တွေထဲက imported values တွေကို ဖယ်ရှားပစ်တာကို တားဆီးနိုင်ပါတယ်။ `eval` ကို သုံးဖို့ ကောင်းတဲ့ အကြောင်းပြချက်တွေက ရှားပါတယ် — ဒါပေမယ့် ဒါနဲ့ အလွန်ဆင်တူတဲ့ အရာတစ်ခုက Svelte မှာ ဖြစ်ပါတယ်:

```html

<script>
  import { someFunc } from "./some-module.js";
</script>

<button on:click="{someFunc}">Click me!</button>
```

Vue.js မှာလည်း — သူ့ရဲ့ `<script setup>` feature ကို သုံးပြီး — ဒီလိုပဲ ဖြစ်ပါတယ်:

```html

<script setup>
  import { someFunc } from "./some-module.js";
</script>

<button @click="someFunc">Click me!</button>
```

ဒီ frameworks တွေက သူတို့ရဲ့ `<script>` tags တွေရဲ့ အပြင်ဘက်က markup တွေအပေါ် အခြေခံပြီး code တစ်ချို့ ထုတ်ပေးပါတယ် — ဒါပေမယ့် TypeScript က `<script>` tags တွေရဲ့ အတွင်းက code ကိုပဲ _မြင်ပါတယ်_။ ဆိုလိုတာက — TypeScript က `someFunc` ရဲ့ import ကို အလိုအလျောက် ဖယ်ပစ်မှာ ဖြစ်ပြီး — အပေါ်က code က run လို့ မရတော့ပါဘူး! TypeScript 4.5 မှာ — ဒီလို အခြေအနေတွေကို ရှောင်ရှားဖို့ [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports) ကို သုံးနိုင်ပါတယ်။

သတိပြုစရာက — ဒီ flag က [--isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) နဲ့ ပေါင်းသုံးတဲ့အခါ အထူးလိုအပ်ချက်တစ်ခု ရှိပါတယ်: imported types တွေက type-only အဖြစ် မှတ်သားထားရပါမယ် — ဘာလို့လဲဆိုတော့ file တစ်ခုချင်းစီကို သီးခြား process လုပ်တဲ့ compilers တွေမှာ — import တစ်ခုက အသုံးမပြုထားတဲ့ value လား၊ runtime crash တစ်ခုကို ရှောင်ဖို့ ဖယ်ရှားရမယ့် type တစ်ခုလားဆိုတာ သိဖို့ နည်းလမ်း မရှိလို့ပါ။

```ts
// Which of these is a value that should be preserved? tsc knows, but `ts.transpileModule`,
// ts-loader, esbuild, etc. don't, so `isolatedModules` gives an error.
import { someFunc, BaseType } from "./some-module.js";
//                 ^^^^^^^^
// Error: 'BaseType' is a type and must be imported using a type-only import
// when 'preserveValueImports' and 'isolatedModules' are both enabled.
```

ဒါက TypeScript 4.5 ရဲ့ နောက်ထပ် feature တစ်ခုဖြစ်တဲ့ [import names များပေါ်ရှိ `type` modifiers](#type-on-import-names) ကို အထူးသဖြင့် အရေးပါစေပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [pull request ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44619)။

## `type` Modifiers on Import Names (Import Name များပေါ်ရှိ `type` Modifier များ)

အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ — [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports) နဲ့ [`isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) တို့မှာ — build tools တွေအတွက် type imports တွေကို ဖယ်ပစ်ဖို့ လုံခြုံမှု ရှိမရှိဆိုတာ မရေရာမှု မရှိအောင် — အထူးလိုအပ်ချက်တွေ ရှိပါတယ်။

```ts
// Which of these is a value that should be preserved? tsc knows, but `ts.transpileModule`,
// ts-loader, esbuild, etc. don't, so `isolatedModules` issues an error.
import { someFunc, BaseType } from "./some-module.js";
//                 ^^^^^^^^
// Error: 'BaseType' is a type and must be imported using a type-only import
// when 'preserveValueImports' and 'isolatedModules' are both enabled.
```

ဒီ options တွေကို ပေါင်းသုံးတဲ့အခါ — import တစ်ခုကို တရားဝင် ဖယ်ပစ်လို့ ရတဲ့အချိန်ကို အချက်ပြဖို့ နည်းလမ်းတစ်ခု လိုအပ်ပါတယ်။ TypeScript မှာ `import type` နဲ့ ဒါအတွက် တစ်ခုခု ရှိပြီးသားပါ:

```ts
import type { BaseType } from "./some-module.js";
import { someFunc } from "./some-module.js";

export class Thing implements BaseType {
  // ...
}
```

ဒါက အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် module တစ်ခုတည်းအတွက် import statements နှစ်ခု ရေးနေရတာကို ရှောင်နိုင်ရင် ကောင်းမှာပါ။ TypeScript 4.5 က named imports တစ်ခုချင်းစီပေါ်မှာ `type` modifier တစ်ခုကို ခွင့်ပြုတာက ဒါရဲ့ အကြောင်းရင်း တစ်စိတ်တစ်ပိုင်းပါ — ဒါမှ လိုအပ်သလို ရောနှော ရွေးချယ်သုံးနိုင်မှာ ဖြစ်ပါတယ်။

```ts
import { someFunc, type BaseType } from "./some-module.js";

export class Thing implements BaseType {
    someMethod() {
        someFunc();
    }
}
```

အပေါ်က ဥပမာမှာ — `BaseType` က အမြဲ erasure ခံရမယ်လို့ အာမခံထားပြီး — [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports) အောက်မှာ `someFunc` ကို ထိန်းသိမ်းထားမှာ ဖြစ်လို့ — အောက်က code လိုမျိုး ကျန်ရစ်ပါတယ်:

```js
import { someFunc } from "./some-module.js";

export class Thing {
  someMethod() {
    someFunc();
  }
}
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [GitHub ပေါ်က အပြောင်းအလဲတွေကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45998)။

## Private Field Presence Checks (Private Field တည်ရှိမှု Check များ)

TypeScript 4.5 က — object တစ်ခုပေါ်မှာ private field တစ်ခု ရှိမရှိ စစ်ဆေးခြင်းအတွက် ECMAScript proposal တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ `#private` field member တစ်ခုပါတဲ့ class တစ်ခုကို အခု ရေးနိုင်ပြီး — `in` operator ကို သုံးပြီး — တခြား object တစ်ခုမှာ အဲဒီ field အတိုင်း ရှိမရှိ ကြည့်ရှုနိုင်ပါတယ်။

```ts
class Person {
    #name: string;
    constructor(name: string) {
        this.#name = name;
    }

    equals(other: unknown) {
        return other &&
            typeof other === "object" &&
            #name in other && // <- this is new!
            this.#name === other.#name;
    }
}
```

ဒီ feature ရဲ့ စိတ်ဝင်စားစရာ ရှုထောင့်တစ်ခုက — `#name in other` ဆိုတဲ့ check က `other` ကို `Person` တစ်ခုအနေနဲ့ တည်ဆောက်ထားခဲ့ရမယ်လို့ ဆိုလိုတာပါ — ဘာလို့လဲဆိုတော့ အဲဒီ field တည်ရှိဖို့ တခြား နည်းလမ်း မရှိလို့ပါ။ ဒါက တကယ်တော့ ဒီ proposal ရဲ့ အဓိက feature တွေထဲက တစ်ခုဖြစ်ပြီး — proposal ကို "ergonomic brand checks" လို့ နာမည်ပေးရတဲ့ အကြောင်းရင်းလည်း ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ private fields တွေက သူတို့ရဲ့ class ရဲ့ instances တွေ မဟုတ်တဲ့ objects တွေကို ကာကွယ်ဖို့ "brand" (တံဆိပ်) တစ်ခုလို မကြာခဏ ဆောင်ရွက်လို့ပါ။ ဒါကြောင့် — TypeScript က check တစ်ခုချင်းစီမှာ `other` ရဲ့ type ကို သင့်လျော်စွာ narrow လုပ်နိုင်ပြီး — နောက်ဆုံးမှာ `Person` type နဲ့ ဆုံးသွားပါတယ်။

[ဒီ pull request ကို ပံ့ပိုးပေးခဲ့တဲ့](https://github.com/microsoft/TypeScript/pull/44648) Bloomberg က ကျွန်တော်တို့ရဲ့ သူငယ်ချင်းတွေ — [Ashley Claymore](https://github.com/acutmore), [Titian Cernicova-Dragomir](https://github.com/dragomirtitian), [Kubilay Kahveci](https://github.com/mkubilayk) နဲ့ [Rob Palmer](https://github.com/robpalme) — အားလုံးကို ရင်းနှီးစွာ ကျေးဇူးတင်ကြောင်း ပြောကြားချင်ပါတယ်!

## Import Assertions (Import Assertion များ)

TypeScript 4.5 က _import assertions_ အတွက် ECMAScript proposal တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒါက — import တစ်ခုက မျှော်လင့်ထားတဲ့ format တစ်ခုနဲ့ ကိုက်ညီကြောင်း သေချာအောင် runtimes တွေ သုံးတဲ့ syntax တစ်ခုပါ။

```ts
import obj from "./something.json" assert { type: "json" };
```

ဒီ assertions တွေရဲ့ ပါဝင်မှုတွေကို TypeScript က check မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ ၎င်းတို့က host တစ်ခုချင်းစီနဲ့ ဆိုင်တဲ့ (host-specific) အရာတွေမို့လို့ပါ — browsers တွေနဲ့ runtimes တွေ ကိုင်တွယ်နိုင်အောင် (ပြီးတော့ ဖြစ်နိုင်ရင် error တက်စေနိုင်အောင်) — သူတို့အတိုင်းပဲ ထားလိုက်ပါတယ်။

```ts
// TypeScript is fine with this.
// But your browser? Probably not.
import obj from "./something.json" assert {
    type: "fluffy bunny"
};
```

Dynamic `import()` ခေါ်ဆိုမှုတွေကလည်း — ဒုတိယ argument တစ်ခုကနေတစ်ဆင့် import assertions တွေကို သုံးနိုင်ပါတယ်။

```ts
const obj = await import("./something.json", {
  assert: { type: "json" },
});
```

အဲဒီ ဒုတိယ argument ရဲ့ မျှော်လင့်ထားတဲ့ type ကို `ImportCallOptions` လို့ ခေါ်တဲ့ type အသစ်တစ်ခုက သတ်မှတ်ပြီး — လောလောဆယ် `assert` property တစ်ခုကိုပဲ လက်ခံပါတယ်။

[ဒီ feature ကို implement လုပ်ပေးတဲ့](https://github.com/microsoft/TypeScript/pull/40698) [Wenlu Wang](https://github.com/Kingwl/) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ်!

## Const Assertions and Default Type Arguments in JSDoc (JSDoc တွင် Const Assertion နှင့် Default Type Argument များ)

TypeScript 4.5 က ကျွန်တော်တို့ရဲ့ JSDoc ပံ့ပိုးမှုကို ဖော်ပြနိုင်စွမ်း (expressivity) အပိုတစ်ချို့ ယူဆောင်လာပါတယ်။

ဥပမာတစ်ခုက `const` assertions တွေနဲ့ ဖြစ်ပါတယ်။ TypeScript မှာ — literal တစ်ခုရဲ့ နောက်မှာ `as const` လို့ ရေးပြီး — ပိုတိကျပြီး immutable ဖြစ်တဲ့ type တစ်ခုကို ရနိုင်ပါတယ်။

```ts
// type is { prop: string }
let a = { prop: "hello" };

// type is { readonly prop: "hello" }
let b = { prop: "hello" } as const;
```

JavaScript files တွေမှာတော့ — အခု JSDoc type assertions တွေကို သုံးပြီး — အလားတူ အကျိုးရလဒ်ကို ရနိုင်ပါတယ်။

```ts
// type is { prop: string }
let a = { prop: "hello" };

// type is { readonly prop: "hello" }
let b = /** @type {const} */ ({ prop: "hello" });
```

သတိရစေဖို့ ပြောရရင် — JSDoc type assertion comments တွေက `/** @type {TheTypeWeWant} */` နဲ့ စတင်ပြီး — parenthesis ကာထားတဲ့ expression တစ်ခုနဲ့ နောက်ကလိုက်ပါတယ်:

```js
/** @type {TheTypeWeWant} */` (someExpression)
```

TypeScript 4.5 က JSDoc မှာ default type arguments တွေကိုလည်း ထည့်ပေးပါတယ် — ဆိုလိုတာက TypeScript ထဲက အောက်က `type` declaration ကို:

```ts
type Foo<T extends string | number = number> = { prop: T };
```

ဒီလို JavaScript ထဲက `@typedef` declaration တစ်ခုအနေနဲ့ ပြန်ရေးလို့ ရပါတယ်:

```js
/**
 * @template {string | number} [T=number]
 * @typedef Foo
 * @property prop {T}
 */

// or

/**
 * @template {string | number} [T=number]
 * @typedef {{ prop: T }} Foo
 */
 ```

နောက်ထပ် အချက်အလက်တွေအတွက် — [const assertions အတွက် pull request](https://github.com/microsoft/TypeScript/pull/45464) နဲ့ [type argument defaults အတွက် အပြောင်းအလဲများ](https://github.com/microsoft/TypeScript/pull/45483) တို့ကို ကြည့်နိုင်ပါတယ်။

## Faster Load Time with `realPathSync.native` (`realPathSync.native` ဖြင့် Load Time ပိုမြန်ဆန်လာခြင်း)

TypeScript က အခု — operating system အားလုံးမှာ Node.js ရဲ့ `realPathSync` function ရဲ့ system-native (စနစ်နဲ့ပါလာတဲ့) implementation တစ်ခုကို အသုံးပြုပါတယ်။

အရင်က ဒီ function ကို Linux မှာပဲ သုံးခဲ့ပေမယ့် — TypeScript 4.5 မှာတော့ Windows နဲ့ MacOS လို — ပုံမှန်အားဖြင့် case-insensitive ဖြစ်တဲ့ operating systems တွေမှာပါ လက်ခံကျင့်သုံးလာပါတယ်။ Codebases တစ်ချို့မှာ — ဒီအပြောင်းအလဲက project loading ကို 5-13% (host operating system ပေါ် မူတည်ပြီး) မြန်ဆန်စေခဲ့ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [မူရင်း အပြောင်းအလဲကို ဒီမှာ](https://github.com/microsoft/TypeScript/pull/44966) နဲ့ [4.5 နဲ့ သက်ဆိုင်တဲ့ အပြောင်းအလဲတွေကို ဒီမှာ](https://github.com/microsoft/TypeScript/pull/44966) ကြည့်နိုင်ပါတယ်။

## Snippet Completions for JSX Attributes (JSX Attribute များအတွက် Snippet Completion များ)

TypeScript 4.5 က JSX attributes တွေအတွက် _snippet completions_ တွေကို ယူဆောင်လာပါတယ်။ JSX tag တစ်ခုထဲမှာ attribute တစ်ခုကို ရိုက်နေတဲ့အခါ — TypeScript က အဲဒီ attributes တွေအတွက် အကြံပြုချက်တွေကို ကြိုတင် ပေးပြီးသားပါ; ဒါပေမယ့် — snippet completions တွေနဲ့ဆိုရင် — initializer တစ်ခု ထည့်ပေးပြီး cursor ကို နေရာမှန် ထားပေးခြင်းအားဖြင့် — ထပ်ရိုက်နေရတဲ့ အလုပ်နည်းနည်းကို လျှော့ချပေးနိုင်ပါတယ်။

![JSX attributes တွေအတွက် Snippet completions — string property တစ်ခုအတွက် quotes တွေကို အလိုအလျောက် ထည့်ပေးပြီး numeric properties တွေအတွက် braces တွေ ထည့်ပေးပါတယ်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/jsx-attributes-snippets-4-5.gif)

TypeScript က ပုံမှန်အားဖြင့် attribute တစ်ခုရဲ့ type ကို သုံးပြီး — ဘယ်လို initializer မျိုး ထည့်ရမလဲ ဆုံးဖြတ်ပါတယ် — ဒါပေမယ့် Visual Studio Code မှာ ဒီအပြုအမူကို customize လုပ်နိုင်ပါတယ်။

![VS Code ထဲမှာ JSX attribute completions အတွက် Settings](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/jsx-snippet-settings-4-5.png)

သတိပြုထားပါ — ဒီ feature က Visual Studio Code ရဲ့ ဗားရှင်းအသစ်တွေမှာပဲ အလုပ်လုပ်မှာ ဖြစ်လို့ — ဒါအလုပ်ဖြစ်ဖို့ Insiders build တစ်ခုကို သုံးရနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — [မူရင်း pull request အကြောင်း ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45903)။

## Better Editor Support for Unresolved Types (Unresolved Type များအတွက် Editor ပံ့ပိုးမှု ပိုကောင်းလာခြင်း)

အချို့အခြေအနေတွေမှာ — editors တွေက ပေါ့ပါးတဲ့ "partial" semantic mode တစ်ခုကို အသုံးပြုပါတယ် — editor က project တစ်ခုလုံး load ဖြစ်ဖို့ စောင့်နေတုန်း ဖြစ်စေ၊ [GitHub ရဲ့ web-based editor](https://docs.github.com/en/codespaces/developing-in-codespaces/web-based-editor) လို context တွေမှာ ဖြစ်စေပါတယ်။

TypeScript ရဲ့ ဗားရှင်းအဟောင်းတွေမှာ — language service က type တစ်ခုကို ရှာမတွေ့ရင် — `any` ကိုပဲ print လုပ်လိုက်ပါတယ်။

![`Buffer` ကို ရှာမတွေ့တဲ့ signature တစ်ခုအပေါ် hover လုပ်ထားပုံ — TypeScript က ၎င်းကို `any` နဲ့ အစားထိုးလိုက်ပါတယ်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-4-4.png)

အပေါ်က ဥပမာမှာ — `Buffer` ကို ရှာမတွေ့ခဲ့လို့ — TypeScript က _quick info_ ထဲမှာ ၎င်းကို `any` နဲ့ အစားထိုးခဲ့ပါတယ်။ TypeScript 4.5 မှာတော့ — TypeScript က မင်း ရေးထားတဲ့အတိုင်း ထိန်းသိမ်းထားဖို့ အကောင်းဆုံး ကြိုးစားပါတယ်။

![`Buffer` ကို ရှာမတွေ့တဲ့ signature တစ်ခုအပေါ် hover လုပ်ထားပုံ — `Buffer` ဆိုတဲ့ နာမည်ကို ဆက်ပဲ သုံးနေပါတယ်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-4-5.png)

ဒါပေမယ့် — `Buffer` ကိုယ်တိုင်အပေါ်မှာ hover လုပ်ကြည့်ရင်တော့ — TypeScript က `Buffer` ကို ရှာမတွေ့ဘူးဆိုတဲ့ အချက်တစ်ခုကို ရပါလိမ့်မယ်။

![TypeScript က `type Buffer = /* unresolved */ any;` ဆိုပြီး ပြသထားပုံ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-on-type-4-5.png)

အားလုံးခြုံကြည့်ရင် — TypeScript မှာ program အပြည့်အစုံ မရနိုင်တဲ့အခါ — ဒါက ပိုချောမွေ့တဲ့ အတွေ့အကြုံတစ်ခုကို ပေးပါတယ်။ သတိပြုထားပါ — type တစ်ခု ရှာမတွေ့တဲ့အခါ — ပုံမှန် အခြေအနေတွေမှာ error တစ်ခုကို အမြဲ ရမှာ ဖြစ်ပြီး ဒါက မင်းကို အသိပေးပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementation ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45976)။

## Breaking Changes (Breaking Change များ)

### `lib.d.ts` Changes (`lib.d.ts` အပြောင်းအလဲများ)

TypeScript 4.5 ရဲ့ built-in declaration files တွေမှာ — မင်းရဲ့ compilation ကို ထိခိုက်စေနိုင်တဲ့ အပြောင်းအလဲတွေ ပါဝင်ပါတယ်; ဒါပေမယ့် — [ဒီအပြောင်းအလဲတွေက အတော်လေး နည်းပါးခဲ့ပြီး](https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1143) — code အများစု ထိခိုက်မှာ မဟုတ်ဘူးလို့ ကျွန်တော်တို့ မျှော်လင့်ပါတယ်။

### Inference Changes from `Awaited` (`Awaited` ကြောင့် Inference အပြောင်းအလဲများ)

`Awaited` ကို အခု `lib.d.ts` ထဲမှာရော `await` ရဲ့ ရလဒ်တစ်ခုအနေနဲ့ပါ သုံးထားတာမို့ — incompatibilities တွေ ဖြစ်စေနိုင်တဲ့ generic types တစ်ချို့ ပြောင်းလဲတာကို မင်း မြင်ရနိုင်ပါတယ်; ဒါပေမယ့် — breakage တွေ မဖြစ်အောင် `Awaited` ပတ်ဝန်းကျင်မှာ ရည်ရွယ်ချက်ရှိရှိ ဒီဇိုင်း ဆုံးဖြတ်ချက်တွေ အများကြီး ချထားတာမို့ — code အများစု ထိခိုက်မှာ မဟုတ်ဘူးလို့ မျှော်လင့်ပါတယ်။

### Compiler Options Checking at the Root of `tsconfig.json` (`tsconfig.json` ၏ Root တွင် Compiler Options စစ်ဆေးခြင်း)

`tsconfig.json` တစ်ခုထဲက `compilerOptions` section ကို မတော်တဆ မေ့ထားမိတာက ဖြစ်လွယ်တဲ့ အမှားတစ်ခုပါ။ ဒီအမှားကို ဖမ်းမိအောင် ကူညီဖို့ — TypeScript 4.5 မှာ — အဲဒီ `tsconfig.json` ထဲမှာ `compilerOptions` ကိုပါ တစ်ပြိုင်နက် သတ်မှတ်ထားခြင်း _မရှိဘဲ_ — `compilerOptions` ထဲက ရနိုင်တဲ့ options တစ်ခုခုနဲ့ ကိုက်ညီတဲ့ top-level field တစ်ခုကို ထည့်တာက error တစ်ခု ဖြစ်ပါတယ်။
