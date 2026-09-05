---
title: "TypeScript 6.0 (TypeScript 6.0 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 6.0 ရဲ့ ထူးခြားချက်တွေ — `this` မသုံးတဲ့ functions တွေအပေါ် context-sensitivity လျှော့ချမှု, `#/` နဲ့စတဲ့ subpath imports, `--moduleResolution bundler` + `--module commonjs` ပေါင်းစပ်မှု, `--stableTypeOrdering` flag, `es2025` target/lib, `Temporal`, 'upsert' methods, `RegExp.escape` အတွက် types အသစ်တွေ, `dom.iterable`/`dom.asynciterable` ပေါင်းစည်းမှု, ပြီးတော့ TypeScript 7.0 အတွက် လမ်းခင်းပေးတဲ့ breaking changes နဲ့ deprecations အများအပြား (default values အသစ်တွေ, `rootDir`, `types`, `target: es5`, `--baseUrl`, `outFile` စသဖြင့်) အကြောင်း"
order: 100
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html"
status: translated
updated: 2026-09-05
---

## Less Context-Sensitivity on `this`-less Functions (this-less Functions များအပေါ် Context-Sensitivity နည်းပါးလာခြင်း)

Parameters တွေမှာ explicit types တွေ ရေးထားမထားဘူးဆိုရင် — TypeScript က မျှော်လင့်ထားတဲ့ type တစ်ခုကို အခြေခံပြီး ဒါမှမဟုတ် ဒီ function ခေါ်ဆိုမှုတစ်ခုတည်းထဲက တခြား arguments တွေကနေတစ်ဆင့်တောင် — ပုံမှန်အားဖြင့် သူတို့ကို infer လုပ်နိုင်ပါတယ်။

```ts
declare function callIt<T>(obj: {
    produce: (x: number) => T,
    consume: (y: T) => void,
}): void;

// Works, no issues.
callIt({
    produce: (x: number) => x * 2,
    consume: y => y.toFixed(),
});

// Works, no issues even though the order of the properties is flipped.
callIt({
    consume: y => y.toFixed(),
    produce: (x: number) => x * 2,
});
```

ဒီမှာ — TypeScript က properties တွေရဲ့ အစီအစဉ် ဘယ်လိုပဲ ရှိရှိ — `produce` function ကနေ infer လုပ်လိုက်တဲ့ `T` ကို အခြေခံပြီး `consume` function ထဲက `y` ရဲ့ type ကို infer လုပ်နိုင်ပါတယ်။
ဒါပေမယ့် ဒီ functions တွေကို arrow function syntax အစား *method syntax* သုံးပြီး ရေးထားရင်ကော ဘယ်လိုလဲ?

```ts
declare function callIt<T>(obj: {
    produce: (x: number) => T,
    consume: (y: T) => void,
}): void;

// Works fine, `x` is inferred to be a number.
callIt({
    produce(x: number) { return x * 2; },
    consume(y) { return y.toFixed(); },
});

callIt({
    consume(y) { return y.toFixed(); },
    //                  ~
    // error: 'y' is of type 'unknown'.

    produce(x: number) { return x * 2; },
});
```

ထူးဆန်းစွာပဲ — `callIt` ဆီ ဒုတိယ ခေါ်ဆိုမှုက error ဖြစ်စေပါတယ် — `consume` method ထဲက `y` ရဲ့ type ကို TypeScript က infer လုပ်နိုင်ခြင်း မရှိလို့ပါ။
ဒီမှာ ဖြစ်နေတာက — TypeScript က `T` အတွက် candidates တွေ ရှာနေတဲ့အခါ — parameters တွေမှာ explicit types မရှိတဲ့ functions တွေကို အရင်ဆုံး ကျော်သွားပါတယ်။
ဒီလို လုပ်ရတာက — အချို့ functions တွေက မှန်မှန်ကန်ကန် check လုပ်ဖို့ `T` ရဲ့ inferred type ကို လိုအပ်နေလို့ပါ — ကျွန်တော်တို့ရဲ့ ကိစ္စမှာဆိုရင် — `consume` function ကို ခွဲခြမ်းစိတ်ဖြာဖို့ `T` ရဲ့ type ကို သိဖို့ လိုပါတယ်။

ဒီ functions တွေကို *contextually sensitive functions* လို့ ခေါ်ပါတယ် — အခြေခံအားဖြင့် — explicit types မရှိတဲ့ parameters တွေ ရှိတဲ့ functions တွေပါ။
နောက်ဆုံးမှာတော့ type system က ဒီ parameters တွေအတွက် types တွေကို ရှာဖွေဖော်ထုတ်ဖို့ လိုပါလိမ့်မယ် — ဒါပေမယ့် ဒါက generic functions တွေထဲမှာ inference အလုပ်လုပ်ပုံနဲ့ နည်းနည်း ဆန့်ကျင်နေပါတယ် — နှစ်ခုက types တွေကို မတူညီတဲ့ ဦးတည်ချက်တွေဆီ "ဆွဲငင် (pull)" နေလို့ပါ။

```ts
function callFunc<T>(callback: (x: T) => void, value: T) {
    return callback(value);
}

callFunc(x => x.toFixed(), 42);
//       ^
// We need to figure out the type of `x` here,
// but we also need to figure out the type of `T` to check the callback.
```

ဒါကို ဖြေရှင်းဖို့ — TypeScript က type argument inference အတွင်းမှာ contextually sensitive functions တွေကို ကျော်သွားပြီး — အဲဒီအစား တခြား arguments တွေကနေ အရင်ဆုံး check လုပ်ပြီး infer လုပ်ပါတယ်။
Contextually sensitive functions တွေကို ကျော်လိုက်တာ အလုပ်မဖြစ်ဘူးဆိုရင် — inference က argument list ထဲမှာ ဘယ်မှညာ သွားရင်း — check မလုပ်ရသေးတဲ့ arguments တွေကို ဖြတ်ပြီး ဆက်လုပ်ပါတယ်။
အပေါ်မှာ ချက်ချင်းပြထားတဲ့ ဥပမာမှာ — TypeScript က `T` အတွက် inference လုပ်နေစဉ် callback ကို ကျော်သွားပြီး — ဒုတိယ argument ဖြစ်တဲ့ `42` ကို ကြည့်ကာ `T` က `number` လို့ infer လုပ်ပါလိမ့်မယ်။
ပြီးတော့ — callback ကို check လုပ်ဖို့ ပြန်လာတဲ့အခါ — `(x: number) => void` ဆိုတဲ့ contextual type တစ်ခု ရှိနေမှာ ဖြစ်လို့ — `x` က `number` ဖြစ်တယ်လို့ပါ infer လုပ်နိုင်စေပါတယ်။

ဒါဆိုရင် ကျွန်တော်တို့ရဲ့ အစောပိုင်း ဥပမာတွေမှာ ဘာတွေ ဖြစ်နေတာလဲ?

```ts
// Arrow syntax - no errors.
callIt({
    consume: y => y.toFixed(),
    produce: (x: number) => x * 2,
});

// Method syntax - errors!
callIt({
    consume(y) { return y.toFixed(); },
    //                  ~
    // error: 'y' is of type 'unknown'.

    produce(x: number) { return x * 2; },
});
```

ဥပမာ နှစ်ခုလုံးမှာ — `produce` ကို explicit type ပါတဲ့ `x` parameter ရှိတဲ့ function တစ်ခုနဲ့ assign လုပ်ထားပါတယ်။
သူတို့ကို တစ်ထပ်တည်း တူညီတဲ့နည်းနဲ့ check လုပ်သင့်တာ မဟုတ်ဘူးလား?

ပြဿနာက သိမ်မွေ့ပါတယ် — functions အများစု (method syntax သုံးထားတဲ့ဟာတွေလိုမျိုး) မှာ implicit `this` parameter တစ်ခု ရှိပြီး — arrow functions တွေမှာတော့ မရှိပါဘူး။
`this` ကို သုံးမှုတိုင်းက `T` ရဲ့ type ပေါ်မှာ "ဆွဲငင် (pulling)" လုပ်ဖို့ လိုအပ်စေနိုင်ပါတယ် — ဥပမာ — ပါဝင်ပတ်သက်နေတဲ့ object literal ရဲ့ type ကို သိဖို့ဆိုရင် — `T` ကို သုံးထားတဲ့ `consume` ရဲ့ type ကို ပြန်လိုအပ်စေနိုင်လို့ပါ။

ဒါပေမယ့် ကျွန်တော်တို့က `this` ကို မသုံးပါဘူး!
ဟုတ်ပါတယ် — function မှာ runtime မှာ `this` value တစ်ခု ရှိနေနိုင်ပေမယ့် — ဘယ်တော့မှ သုံးမထားပါဘူး!

TypeScript 6.0 က function တစ်ခု contextually sensitive ဟုတ်မဟုတ် ဆုံးဖြတ်တဲ့အခါ — ဒါကို ထည့်သွင်း စဉ်းစားပါတယ်။
Function တစ်ခုထဲမှာ `this` ကို တကယ် *သုံး*တာ ဘယ်တော့မှ မရှိဘူးဆိုရင် — အဲဒီ function ကို contextually sensitive အဖြစ် မသတ်မှတ်တော့ပါဘူး။
ဆိုလိုတာက — type inference နဲ့ ပတ်သတ်လာရင် ဒီ functions တွေကို ဦးစားပေးမှု ပိုမြင့်တဲ့ဟာတွေအဖြစ် မြင်ရမှာ ဖြစ်ပြီး — အပေါ်က ဥပမာတွေ အားလုံး အခုဆို အလုပ်လုပ်ပါပြီ!

[ဒီပြောင်းလဲမှုကို](https://github.com/microsoft/TypeScript/pull/62243) [Mateusz Burzyński](https://github.com/Andarist) ရဲ့ လုပ်ဆောင်မှုကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

## Subpath Imports Starting with `#/` (#/ ဖြင့် စတင်သော Subpath Imports)

Node.js က modules တွေအတွက် ပံ့ပိုးမှု ထည့်သွင်းတဲ့အခါ — ["subpath imports"](https://nodejs.org/api/packages.html#subpath-imports) လို့ခေါ်တဲ့ feature တစ်ခုကိုပါ ထည့်သွင်းခဲ့ပါတယ်။
ဒါက အခြေခံအားဖြင့် [`imports` လို့ခေါ်တဲ့ field တစ်ခု](https://nodejs.org/api/packages.html#imports) ဖြစ်ပြီး — packages တွေကို သူတို့ package အတွင်းက modules တွေအတွက် internal aliases တွေ ဖန်တီးခွင့်ပေးပါတယ်။

```json
{
    "name": "my-package",
    "type": "module",
    "imports": {
        "#root/*": "./dist/*"
    }
}
```

ဒါက `my-package` ထဲက modules တွေကို `#root/` နဲ့ စတင်တဲ့ paths တွေကနေ import လုပ်ခွင့်ပေးပါတယ်

```js
import * as utils from "#root/utils.js";
```

အောက်ပါလိုမျိုး relative path တစ်ခုကို သုံးမယ့်အစား:

```js
import * as utils from "../../utils.js";
```

ဒီ feature နဲ့ပတ်သတ်ပြီး သေးငယ်တဲ့ စိတ်ညစ်စရာတစ်ခုက — developer တွေက subpath import တစ်ခုကို သတ်မှတ်တဲ့အခါ `#` ရဲ့ နောက်မှာ *တစ်ခုခု* အမြဲ ရေးပေးရတာ ဖြစ်ပါတယ်။
ဒီမှာ `root` လို့ သုံးထားပေမယ့် — `./dist/` ကလွဲလို့ map လုပ်နေတဲ့ directory တခြား မရှိတာမို့ — ဒါက နည်းနည်း အသုံးမကျပါဘူး။

Bundlers တွေ သုံးဖူးတဲ့ developer တွေက ရှည်လျားတဲ့ relative paths တွေကို ရှောင်ဖို့ path-mapping သုံးတာကိုလည်း ကျင့်သားရနေပါပြီ။
Bundlers တွေနဲ့ အကျွမ်းဝင်တဲ့ စည်းမျဉ်းတစ်ခုက — ရိုးရှင်းတဲ့ `@/` ကို prefix အဖြစ် သုံးတာပါ။
ကံမကောင်းစွာပဲ — subpath imports တွေက `#/` နဲ့ လုံးဝ စတင်လို့ မရခဲ့တာမို့ — သူတို့ projects တွေထဲမှာ ဒါတွေကို လက်ခံကျင့်သုံးဖို့ ကြိုးစားနေတဲ့ developer တွေအတွက် ရှုပ်ထွေးမှုတွေ အများကြီး ဖြစ်စေခဲ့ပါတယ်။

ဒါပေမယ့် မကြာသေးမီကပဲ — [Node.js က `#/` နဲ့ စတင်တဲ့ subpath imports တွေအတွက် ပံ့ပိုးမှု ထည့်သွင်း](https://github.com/nodejs/node/pull/60864) ခဲ့ပါတယ်။
ဒါက packages တွေကို — extra segment တစ်ခု ထပ်ထည့်စရာမလိုဘဲ — သူတို့ရဲ့ subpath imports တွေအတွက် ရိုးရှင်းတဲ့ `#/` prefix တစ်ခုကို သုံးခွင့်ပေးပါတယ်။

```json
{
    "name": "my-package",
    "type": "module",
    "imports": {
        "#/*": "./dist/*"
    }
}
```

ဒါကို Node.js 20 ရဲ့ release အသစ်တွေမှာ ပံ့ပိုးထားပြီး — TypeScript က `--moduleResolution` setting အတွက် `nodenext` နဲ့ `bundler` options တွေအောက်မှာ ယခုဆို ပံ့ပိုးပေးပါတယ်။

ဒီအလုပ်ကို [magic-akari](https://github.com/magic-akari) ရဲ့ ကျေးဇူးကြောင့် လုပ်ဆောင်နိုင်ခဲ့ပြီး — [implementing pull request ကို ဒီမှာ တွေ့နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/62844)။

## Combining `--moduleResolution bundler` with `--module commonjs` (--moduleResolution bundler ကို --module commonjs နှင့် ပေါင်းစပ်ခြင်း)

TypeScript ရဲ့ `--moduleResolution bundler` setting ကို အရင်က `--module esnext` ဒါမှမဟုတ် `--module preserve` တို့နဲ့ပဲ သုံးခွင့်ရှိခဲ့ပါတယ်။
ဒါပေမယ့် — `--moduleResolution node` (a.k.a. `--moduleResolution node10`) ရဲ့ deprecation နဲ့အတူ — ဒီပေါင်းစပ်မှုအသစ်က projects အများအပြားအတွက် မကြာခဏဆိုသလို အသင့်တော်ဆုံး upgrade လမ်းကြောင်း ဖြစ်လာပါတယ်။

Projects တွေက အဲဒီအစား အောက်ပါတစ်ခုခုဆီ ရွှေ့ပြောင်းမှု (migration) တစ်ခုကို စီစဉ်ချင်ကြပါလိမ့်မယ်:

* `--module preserve` နဲ့ `--moduleResolution bundler`
* `--module nodenext`

ကိုယ့် project ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး (ဥပမာ — bundled web app, Bun app, ဒါမှမဟုတ် Node.js app)။

နောက်ထပ် အချက်အလက်တွေကို [ဒီ implementing pull request](https://github.com/microsoft/TypeScript/pull/62320) မှာ တွေ့နိုင်ပါတယ်။

## The `--stableTypeOrdering` Flag (--stableTypeOrdering Flag အကြောင်း)

[TypeScript ရဲ့ native port](https://devblogs.microsoft.com/typescript/typescript-native-port/) ပေါ်မှာ ဆက်လက် လုပ်ဆောင်နေတဲ့ အလုပ်တွေရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — ကျွန်တော်တို့က 6.0-to-7.0 migrations တွေကို အကူအညီပေးဖို့ ရည်ရွယ်ထားတဲ့ `--stableTypeOrdering` လို့ခေါ်တဲ့ flag အသစ်တစ်ခုကို မိတ်ဆက်ခဲ့ပါတယ်။

လက်ရှိမှာ — TypeScript က types တွေကို တွေ့ရှိရတဲ့ အစီအစဉ်အတိုင်း type IDs (internal tracking numbers) တွေ သတ်မှတ်ပေးပြီး — union types တွေကို တသမတ်တည်း ပုံစံနဲ့ စီစဉ်ဖို့ ဒီ IDs တွေကို သုံးပါတယ်။
Properties တွေအတွက်လည်း အလားတူ လုပ်ငန်းစဉ်တစ်ခု ဖြစ်ပွားပါတယ်။
ရလဒ်အနေနဲ့ — program တစ်ခုထဲမှာ အရာတွေကို ကြေညာထားတဲ့ အစီအစဉ်က declaration emit လိုမျိုး အရာတွေအပေါ် — ဖြစ်နိုင်ခြေရှိတဲ့ အံ့အားသင့်စရာ သက်ရောက်မှုတွေ ရှိနိုင်ပါတယ်။

ဥပမာ — ဒီ file ကနေ declaration emit လုပ်တာကို သုံးသပ်ကြည့်ပါ:

```ts
// Input: some-file.ts
export function foo(condition: boolean) {
    return condition ? 100 : 500;
}

// Output: some-file.d.ts
export declare function foo(condition: boolean): 100 | 500;
//                                               ^^^^^^^^^
//             Note the order of this union: 100, then 500.
```

`foo` ရဲ့ *အပေါ်မှာ* မသက်ဆိုင်တဲ့ `const` တစ်ခု ထည့်လိုက်ရင် — declaration emit က ပြောင်းသွားပါတယ်:

```ts
// Input: some-file.ts
const x = 500;
export function foo(condition: boolean) {
    return condition ? 100 : 500;
}

// Output: some-file.d.ts
export declare function foo(condition: boolean): 500 | 100;
//                                               ^^^^^^^^^
//                           Note the change in order here.
```

ဒီလို ဖြစ်ရတာက — `const x` declaration ကို ခွဲခြမ်းစိတ်ဖြာတဲ့အခါ `500` ကို အရင်ဆုံး process လုပ်လိုက်လို့ — literal type `500` က `100` ထက် နိမ့်တဲ့ type ID တစ်ခု ရလို့ပါ။
သိပ်ရှားပါးတဲ့ အခြေအနေတွေမှာ — ဒီအစီအစဉ် ပြောင်းလဲမှုက program processing order ပေါ် မူတည်ပြီး errors တွေ ပေါ်လာတာ ဒါမှမဟုတ် ပျောက်သွားတာတောင် ဖြစ်စေနိုင်ပါတယ် — ဒါပေမယ့် ယေဘုယျအားဖြင့် — ဒီအစီအစဉ်ကို သင်သတိထားမိနိုင်တဲ့ အဓိကနေရာက emit လုပ်ထားတဲ့ declaration files တွေ ဒါမှမဟုတ် editor ထဲမှာ types တွေ ပြသပုံပဲ ဖြစ်ပါတယ်။

TypeScript 7 ထဲက အဓိက architecture တိုးတက်မှုတွေထဲက တစ်ခုက parallel type checking ဖြစ်ပြီး — အလုံးစုံ check အချိန်ကို သိသိသာသာ တိုးတက်စေပါတယ်။
ဒါပေမယ့် — parallelism က စိန်ခေါ်မှုတစ်ခု မိတ်ဆက်ပေးပါတယ် — type-checkers အမျိုးမျိုးက nodes တွေ, types တွေနဲ့ symbols တွေကို အစီအစဉ်အမျိုးမျိုးနဲ့ လည်ပတ်ကြည့်ရှုတဲ့အခါ — ဒီ constructs တွေကို သတ်မှတ်ပေးတဲ့ internal IDs တွေက non-deterministic ဖြစ်သွားပါတယ်။
ဒါက တစ်ဖန် — ရှုပ်ထွေးစေတဲ့ non-deterministic output တွေဆီ ဦးတည်စေပြီး — program တစ်ခုတည်းထဲမှာ အကြောင်းအရာ တူညီတဲ့ file နှစ်ခုက မတူညီတဲ့ declaration files တွေ ထုတ်ပေးနိုင်သလို — file တစ်ခုတည်းကို ခွဲခြမ်းစိတ်ဖြာတဲ့အခါ မတူညီတဲ့ errors တွေတောင် တွက်ချက်မိနိုင်ပါတယ်။

ဒါကို ပြုပြင်ဖို့ — TypeScript 7.0 က သူ့ရဲ့ internal objects တွေ (ဥပမာ types နဲ့ symbols) ကို object ရဲ့ content ကို အခြေခံတဲ့ deterministic algorithm တစ်ခုအရ စီစဉ်ပါတယ်။
ဒါက checkers အားလုံး — သူတို့ ဘယ်လို ဘယ်အချိန် ဖန်တီးခံရသည်ဖြစ်စေ — တူညီတဲ့ object order တစ်ခုကိုပဲ ကြုံတွေ့ရစေဖို့ သေချာစေပါတယ်။
အကျိုးဆက်အနေနဲ့ — ပေးထားတဲ့ ဥပမာမှာ — TypeScript 7 က `100 | 500` ကို *အမြဲတမ်း* ထုတ်နှိပ်ပြီး — ordering မတည်ငြိမ်မှုကို လုံးဝ ဖယ်ရှားလိုက်ပါတယ်။

ဆိုလိုတာက TypeScript 6 နဲ့ 7 တို့က တစ်ခါတစ်ရံ မတူညီတဲ့ ordering တွေကို ပြသနိုင်ပြီး — တကယ်လည်း ပြသပါတယ်။
ဒီ ordering ပြောင်းလဲမှုတွေက အမြဲလိုလို အန္တရာယ်မရှိပေမယ့် — ကိုယ်က run တွေကြားမှာ compiler outputs တွေကို နှိုင်းယှဉ်နေရင် (ဥပမာ — 6.0 vs 7.0 မှာ emit လုပ်ထားတဲ့ declaration files တွေကို စစ်ဆေးတာ) — ဒီမတူညီတဲ့ orderings တွေက မှန်ကန်မှုကို အကဲဖြတ်ဖို့ ခက်ခဲစေတဲ့ noise အများကြီး ထုတ်ပေးနိုင်ပါတယ်။
ရံဖန်ရံခါမှာတော့ — type error တစ်ခု ပေါ်လာတာ ဒါမှမဟုတ် ပျောက်သွားစေတဲ့ ordering ပြောင်းလဲမှုတစ်ခုကို ကြုံရနိုင်ပြီး — အဲဒါက ပိုတောင် ရှုပ်ထွေးစေနိုင်ပါတယ်။

ဒီအခြေအနေကို ကူညီဖို့ — 6.0 မှာ — `--stableTypeOrdering` flag အသစ်ကို သတ်မှတ်နိုင်ပါတယ်။
ဒါက 6.0 ရဲ့ type ordering အပြုအမူကို 7.0 ရဲ့ဟာနဲ့ ကိုက်ညီစေပြီး — codebases နှစ်ခုကြားက ကွာခြားချက် အရေအတွက်ကို လျှော့ချပေးပါတယ်။
ဒီ flag က type-checking ကို သိသိသာသာ နှေးကွေးစေနိုင်တာမို့ (codebase ပေါ် မူတည်ပြီး 25% အထိ) — အချိန်တိုင်း သုံးဖို့တော့ ကျွန်တော်တို့ တိုက်တွန်းမထားပါဘူးဆိုတာ သတိပြုပါ။

`--stableTypeOrdering` သုံးတဲ့အခါ type error တစ်ခုကို ကြုံရရင် — ဒါက ပုံမှန်အားဖြင့် inference ကွာခြားချက်တွေကြောင့် ဖြစ်ပါတယ်။
`--stableTypeOrdering` မပါဘဲ အရင် inference က ကိုယ့် program ထဲက types တွေရဲ့ လက်ရှိ ordering ကို အခြေခံပြီး *ညှို့ဓာတ်ကြောင့်* အလုပ်ဖြစ်နေတာမျိုးပါ။
ဒါကို ကူညီဖို့ — တစ်နေရာရာမှာ explicit type တစ်ခု ပေးခြင်းကနေ မကြာခဏ အကျိုးရှိနိုင်ပါတယ်။
မကြာခဏဆိုသလို — ဒါက type argument တစ်ခု ဖြစ်မယ်

```diff
- someFunctionCall(/*...*/);
+ someFunctionCall<SomeExplicitType>(/*...*/);
```

ဒါမှမဟုတ် — call တစ်ခုဆီ ပို့ဖို့ ရည်ရွယ်ထားတဲ့ argument တစ်ခုအတွက် variable annotation တစ်ခု ဖြစ်မယ်။

```diff
- const someVariable = { /*... some complex object ...*/ };
+ const someVariable: SomeExplicitType = { /*... some complex object ...*/ };

someFunctionCall(someVariable);
```

**ဒီ flag က 6.0 နဲ့ 7.0 ကြားက ကွာခြားချက်တွေကို ရှာဖွေဖော်ထုတ်ဖို့ပဲ ရည်ရွယ်ထားတာဆိုတာ သတိပြုပါ — ရေရှည်သုံးဖို့ feature တစ်ခုအနေနဲ့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး**

[ဒီ pull-request မှာ နောက်ထပ် ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/63084)။

## `es2025` option for `target` and `lib` (target နှင့် lib အတွက် `es2025` option)

TypeScript 6.0 က `target` ရော `lib` ရော နှစ်ခုလုံးအတွက် `es2025` option ကို ပံ့ပိုးမှု ထည့်သွင်းပါတယ်။
ES2025 မှာ JavaScript language features အသစ်တွေ မရှိပေမယ့် — ဒီ target အသစ်က built-in APIs တွေအတွက် types အသစ်တွေ ထည့်ပေးပြီး (ဥပမာ — `RegExp.escape`) — declarations အနည်းငယ်ကို `esnext` ကနေ `es2025` ဆီ ရွှေ့ပေးပါတယ် (ဥပမာ — `Promise.try`, `Iterator` methods တွေနဲ့ `Set` methods တွေ)။
[target အသစ်](https://github.com/microsoft/TypeScript/pull/63046) ကို ဖွင့်ပေးနိုင်ဖို့ လုပ်ဆောင်မှုကို [Kenta Moriuchi](https://github.com/petamoriken) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

## New Types for `Temporal` (Temporal အတွက် Types အသစ်များ)

အချိန်အတော်ကြာ စောင့်မျှော်ခဲ့ရတဲ့ [Temporal proposal](https://github.com/tc39/proposal-temporal) က stage 4 ကို ရောက်ရှိပြီး — အနာဂတ် ECMAScript standard တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်လာပါလိမ့်မယ်။
TypeScript 6.0 မှာ Temporal API အတွက် built-in types တွေ ယခုဆို ပါဝင်လာလို့ — `--target esnext` ဒါမှမဟုတ် `"lib": ["esnext"]` (ဒါမှမဟုတ် ပိုပြီး အကွက်စိတ်ကျတဲ့ `esnext.temporal`) ကနေတစ်ဆင့် ဒီနေ့ပဲ ကိုယ့် TypeScript code ထဲမှာ စတင် သုံးနိုင်ပါတယ်။

```ts
let yesterday = Temporal.Now.instant().subtract({
    hours: 24,
});

let tomorrow = Temporal.Now.instant().add({
    hours: 24,
});

console.log(`Yesterday: ${yesterday}`);
console.log(`Tomorrow: ${tomorrow}`);
```

Temporal က runtimes အများအပြားမှာ ယခုကတည်းက သုံးလို့ ရနေပြီး — stage 4 အဆင့်အတန်းနဲ့ဆိုတော့ — အခုဆို JavaScript language ရဲ့ တရားဝင် အစိတ်အပိုင်း တစ်ခု ဖြစ်လာပါပြီ။
[Temporal APIs တွေရဲ့ Documentation ကို MDN မှာ ရနိုင်ပါတယ်](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)။

[ဒီအလုပ်](https://github.com/microsoft/TypeScript/pull/62628) ကို GitHub user [Renegade334](https://github.com/Renegade334) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

## New Types for "upsert" Methods (a.k.a. `getOrInsert`) ("upsert" Methods များအတွက် Types အသစ်များ)

`Map`s တွေနဲ့ အဖြစ်များတဲ့ ပုံစံတစ်ခုက — key တစ်ခု တည်ရှိမရှိ စစ်ဆေးပြီး — မရှိဘူးဆိုရင် — default value တစ်ခုကို set လုပ်ပြီး ပြန်ယူတာပါ။

```ts
function processOptions(compilerOptions: Map<string, unknown>) {
    let strictValue: unknown;
    if (compilerOptions.has("strict")) {
        strictValue = compilerOptions.get("strict");
    }
    else {
        strictValue = true;
        compilerOptions.set("strict", strictValue);
    }
    // ...
}
```

ဒီပုံစံက ငြီးငွေ့စရာ ဖြစ်နိုင်ပါတယ်။
[ECMAScript ရဲ့ "upsert" proposal](https://github.com/tc39/proposal-upsert) က မကြာသေးမီက stage 4 ကို ရောက်ရှိပြီး — `Map` နဲ့ `WeakMap` ပေါ်မှာ method အသစ် ၂ ခုကို မိတ်ဆက်ပေးပါတယ်:

- `getOrInsert`
- `getOrInsertComputed`

ဒီ methods တွေကို `esnext` lib ထဲကို ထည့်သွင်းထားလို့ — TypeScript 6.0 မှာ ချက်ချင်း စတင် သုံးနိုင်ပါတယ်။

`getOrInsert` နဲ့ဆိုရင် — အပေါ်က ကိုယ့် code ကို အောက်ပါအတိုင်း အစားထိုးနိုင်ပါတယ်:

```ts
function processOptions(compilerOptions: Map<string, unknown>) {
    let strictValue = compilerOptions.getOrInsert("strict", true);
    // ...
}
```

`getOrInsertComputed` ကလည်း အလားတူ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် default value တွက်ရတာ ဈေးကြီးနိုင်တဲ့ (ဥပမာ — တွက်ချက်မှုတွေ, allocations တွေ အများကြီး လိုတာ ဒါမှမဟုတ် ကြာမြင့်တဲ့ synchronous I/O လုပ်တာမျိုး) အခြေအနေတွေအတွက် ဖြစ်ပါတယ်။
အဲဒီအစား — key က မရှိသေးဘူးဆိုမှသာ ခေါ်ဆိုခံရမယ့် callback တစ်ခုကို လက်ခံပါတယ်။

```ts
someMap.getOrInsertComputed("someKey", () => {
    return computeSomeExpensiveValue(/*...*/);
});
```

ဒီ callback ကို key ကိုပါ argument တစ်ခုအနေနဲ့ ပေးထားပြီး — default value က key ပေါ်မှာ အခြေခံတဲ့ အခြေအနေတွေအတွက် အသုံးဝင်နိုင်ပါတယ်။

```ts
someMap.getOrInsertComputed(someKey, computeSomeExpensiveDefaultValue);

function computeSomeExpensiveValue(key: string) {
    // ...
}
```

[ဒီ update](https://github.com/microsoft/TypeScript/pull/62612) ကို GitHub user [Renegade334](https://github.com/Renegade334) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

## `RegExp.escape`

Regular expression တစ်ခုအတွင်း ကိုက်ညီစေဖို့ literal string တစ်ခုကို တည်ဆောက်တဲ့အခါ — `*`, `+`, `?`, `(`, `)` စတဲ့ special regular expression characters တွေကို escape လုပ်ဖို့ အရေးကြီးပါတယ်။
[RegExp Escaping ECMAScript proposal](https://github.com/tc39/proposal-regex-escaping) က stage 4 ကို ရောက်ရှိပြီး — ဒါကို ကိုယ့်အတွက် ဂရုစိုက် လုပ်ပေးတဲ့ `RegExp.escape` function အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။

```ts
function matchWholeWord(word: string, text: string) {
    const escapedWord = RegExp.escape(word);
    const regex = new RegExp(`\\b${escapedWord}\\b`, "g");
    return text.match(regex);
}
```

`RegExp.escape` က `es2025` lib ထဲမှာ ရနိုင်လို့ — TypeScript 6.0 မှာ ဒီနေ့ပဲ စတင် သုံးနိုင်ပါတယ်။

[ဒီအလုပ်](https://github.com/microsoft/TypeScript/pull/63046) ကို [Kenta Moriuchi](https://github.com/petamoriken) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

## The `dom` lib Now Contains `dom.iterable` and `dom.asynciterable` (dom lib တွင် `dom.iterable` နှင့် `dom.asynciterable` ပါဝင်လာခြင်း)

TypeScript ရဲ့ `lib` option က ကိုယ့် target runtime မှာ ဘယ် global declarations တွေ ရှိလဲဆိုတာကို သတ်မှတ်ခွင့်ပေးပါတယ်။
Option တစ်ခုက web environments တွေ (ဆိုလိုတာက [DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) တွေကို implement လုပ်ထားတဲ့ browsers တွေ) ကို ကိုယ်စားပြုတဲ့ `dom` ပါ။
အရင်က — DOM APIs တွေကို `Iterable`s နဲ့ `AsyncIterable`s တွေကို မပံ့ပိုးတဲ့ environments တွေအတွက် — `dom.iterable` နဲ့ `dom.asynciterable` ဆိုပြီး တစ်စိတ်တစ်ပိုင်း ခွဲထုတ်ထားပါတယ်။
ဆိုလိုတာက — `NodeList` ဒါမှမဟုတ် `HTMLCollection` လိုမျိုး DOM collections တွေပေါ်မှာ iteration methods တွေ သုံးဖို့ `dom.iterable` ကို တိတိကျကျ ထည့်ပေးရပါတယ်။

TypeScript 6.0 မှာ — `lib.dom.iterable.d.ts` နဲ့ `lib.dom.asynciterable.d.ts` တွေရဲ့ အကြောင်းအရာတွေကို `lib.dom.d.ts` ထဲမှာ အပြည့်အဝ ထည့်သွင်းလိုက်ပါတယ်။
ကိုယ့် configuration file ရဲ့ `"lib"` array ထဲမှာ `dom.iterable` နဲ့ `dom.asynciterable` တွေကို ဆက်ပြီး ရည်ညွှန်းနိုင်ပါသေးတယ် — ဒါပေမယ့် အခုဆို ၎င်းတို့က empty files တွေပဲ ဖြစ်ပါတယ်။

```ts
// Before TypeScript 6.0, this required "lib": ["dom", "dom.iterable"]
// Now it works with just "lib": ["dom"]
for (const element of document.querySelectorAll("div")) {
    console.log(element.textContent);
}
```

ဒါက — ခေတ်မီ browser ကြီးတွေ ဘယ်တစ်ခုမှ ဒီစွမ်းဆောင်နိုင်မှုတွေ မချို့တဲ့တာမို့ — အဖြစ်များတဲ့ ရှုပ်ထွေးမှုအချက်တစ်ခုကို ဖယ်ရှားပေးတဲ့ quality-of-life တိုးတက်မှုတစ်ခုပါ။
`dom` နဲ့ `dom.iterable` နှစ်ခုလုံးကို အရင်ကတည်းက ထည့်သွင်းနေတယ်ဆိုရင် — အခုဆို `dom` တစ်ခုတည်းအထိ ရိုးရှင်းအောင် လုပ်နိုင်ပါပြီ။

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/60959) နဲ့ ၎င်းရဲ့ [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62111) မှာ ကြည့်ပါ။

## Breaking Changes and Deprecations in TypeScript 6.0 (TypeScript 6.0 တွင် Breaking Changes နှင့် Deprecations)

TypeScript 6.0 က သိသာထင်ရှားတဲ့ အသွင်ကူးပြောင်းရေး (transition) release တစ်ခုအနေနဲ့ ရောက်ရှိလာပြီး — လာမယ့် TypeScript compiler ရဲ့ native port ဖြစ်တဲ့ TypeScript 7.0 အတွက် developer တွေကို ကြိုတင် ပြင်ဆင်ပေးဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။
TypeScript 6.0 က ကိုယ့်ရဲ့ ရှိပြီးသား TypeScript အသိပညာနဲ့ အပြည့်အဝ compatible ဖြစ်နေပြီး TypeScript 5.9 နဲ့လည်း API အရ compatible ဖြစ်နေဆဲပါ — ဒါပေမယ့် ဒီ release က ပြောင်းလဲနေတဲ့ JavaScript ecosystem ကို ထင်ဟပ်ပြီး TypeScript 7.0 အတွက် စင်မြင့် ခင်းပေးတဲ့ breaking changes တွေနဲ့ deprecations တွေ အများအပြားကို မိတ်ဆက်ပေးပါတယ်။

TypeScript 5.0 နောက်ပိုင်း နှစ်နှစ်အတွင်းမှာ — developer တွေ JavaScript ကို ရေးသားပုံနဲ့ ship လုပ်ပုံတွေမှာ ဆက်တိုက် ပြောင်းလဲမှုတွေကို မြင်ခဲ့ရပါတယ်:

- Runtime environments တိုင်းလိုလိုက ယခုဆို "evergreen" ဖြစ်နေပါတယ်။ တကယ့် legacy environments (ES5) တွေကတော့ ပျောက်ကွယ်လုနီးပါး ရှားပါးသွားပါပြီ။
- Bundlers တွေနဲ့ ESM တို့က project အသစ်တွေအတွက် အသုံးအများဆုံး module targets တွေ ဖြစ်လာပေမယ့် — CommonJS က အဓိက target တစ်ခုအနေနဲ့ ဆက်ရှိနေပါတယ်။ AMD နဲ့ တခြား in-browser userland module systems တွေကတော့ 2012 တုန်းကထက် အများကြီး ရှားပါးသွားပါပြီ။
- Package တွေအားလုံးနီးပါးကို module system တစ်ခုခုကနေတစ်ဆင့် သုံးစွဲနိုင်ပါတယ်။ UMD packages တွေ ရှိနေဆဲပါ — ဒါပေမယ့် *global variable တစ်ခုအနေနဲ့ပဲ* ရနိုင်တဲ့ code အသစ်တွေကတော့ လုံးဝနီးပါး မရှိပါဘူး။
- `tsconfig.json` က configuration ယန္တရားတစ်ခုအနေနဲ့ နေရာတိုင်းနီးပါး အသုံးများပါတယ်။
- "ပိုတင်းကျပ်တဲ့ (stricter)" typing တွေအတွက် ဆန္ဒက ဆက်လက် ကြီးထွားနေပါတယ်။
- TypeScript build performance က ဦးစားပေး စဉ်းစားစရာ ဖြစ်နေပါတယ်။ TypeScript 7 ရဲ့ အကျိုးအမြတ်တွေ ရှိပေမယ့် — performance က အမြဲတမ်း အဓိကပန်းတိုင် ဖြစ်နေရမှာ ဖြစ်ပြီး — performant ဖြစ်တဲ့နည်းနဲ့ ပံ့ပိုးလို့ မရတဲ့ options တွေက ပိုပြီး ခိုင်မာတဲ့ ဆင်ခြေတွေ လိုအပ်ပါတယ်။

ဒါကြောင့် TypeScript 6.0 နဲ့ 7.0 တို့ကို ဒီလက်တွေ့အမှန်တရားတွေကို စိတ်ထဲထားပြီး ဒီဇိုင်းထုတ်ထားပါတယ်။
TypeScript 6.0 အတွက်ကတော့ — ဒီ deprecations တွေကို ကိုယ့် tsconfig ထဲမှာ `"ignoreDeprecations": "6.0"` လို့ သတ်မှတ်ခြင်းအားဖြင့် လျစ်လျူရှုထားနိုင်ပါတယ် — ဒါပေမယ့် TypeScript 7.0 ကတော့ ဒီ deprecated options တွေထဲက ဘယ်ဟာကိုမှ *ပံ့ပိုးမှာ မဟုတ်ဘူး*ဆိုတာ သတိပြုပါ။

လိုအပ်တဲ့ ပြုပြင်ပြောင်းလဲမှုတစ်ချို့ကို codemod ဒါမှမဟုတ် tool တစ်ခုနဲ့ အလိုအလျောက် လုပ်ဆောင်နိုင်ပါတယ်။
ဥပမာ — [experimental `ts5to6` tool](https://github.com/andrewbranch/ts5to6) က ကိုယ့် codebase တစ်လျှောက်မှာ `baseUrl` နဲ့ `rootDir` တွေကို အလိုအလျောက် ပြုပြင်ပေးနိုင်ပါတယ်။

### Up-Front Adjustments (ကြိုတင် ပြုပြင်ရမည့်အချက်များ)

အောက်မှာ သီးခြား ပြုပြင်ပြောင်းလဲမှုတွေကို ဖော်ပြသွားမှာပါ — ဒါပေမယ့် deprecations တစ်ချို့နဲ့ behavior changes တစ်ချို့မှာ — အရင်းခံ ပြဿနာကို တိုက်ရိုက် ညွှန်ပြတဲ့ error message တစ်ခု မလိုအပ်ဘူးဆိုတာကို သတိပြုရပါမယ်။
ဒါကြောင့် **projects အများအပြားက အောက်ပါတစ်ခုခုကို အနည်းဆုံး လုပ်ဖို့ လိုမယ်**ဆိုတာကို ကြိုတင် မှတ်သားထားပါမယ်:

* tsconfig ထဲက `"types"` array ကို သတ်မှတ်ပါ — ပုံမှန်အားဖြင့် `"types": ["node"]` လို့ ဖြစ်ပါတယ်။

  `"types": ["*"]` ဆိုရင် 5.9 အပြုအမူကို ပြန်ရမှာ ဖြစ်ပေမယ့် — build performance နဲ့ ကြိုတင်ခန့်မှန်းနိုင်မှု တိုးတက်စေဖို့ explicit array တစ်ခုကို သုံးဖို့ ကျွန်တော်တို့ အကြံပြုပါတယ်။

  Missing identifiers တွေ ဒါမှမဟုတ် resolve မဖြစ်တဲ့ built-in modules တွေနဲ့ ဆက်စပ်တဲ့ type errors *အများကြီး* မြင်ရရင် — ပုံမှန်အားဖြင့် ဒါပဲ ပြဿနာဆိုတာ သိရပါလိမ့်မယ်။
* အရင်က ဒါကို infer လုပ်တာကို အားထားခဲ့တယ်ဆိုရင် `"rootDir": "./src"` လို့ သတ်မှတ်ပါ

  Files တွေကို `./dist/index.js` အစား `./dist/src/index.js` ထဲကို ရေးသားနေတာကို မြင်ရရင် — မကြာခဏဆိုသလို ဒါပဲ ပြဿနာဆိုတာ သိရပါလိမ့်မယ်။

### Simple Default Changes (ရိုးရှင်းသော Default ပြောင်းလဲမှုများ)

Compiler options အများအပြားမှာ ယခုဆို — ခေတ်မီ development အလေ့အကျင့်တွေကို ပိုကောင်းစွာ ထင်ဟပ်တဲ့ default values အသစ်တွေ ရှိလာပါတယ်။

- **`strict` က ယခုဆို default အနေနဲ့ `true` ဖြစ်နေပါတယ်**:
  ပိုတင်းကျပ်တဲ့ typing တွေအတွက် ဆန္ဒက ဆက်လက် ကြီးထွားနေပြီး — project အသစ်အများစုက `strict` mode ဖွင့်ထားတာကို လိုချင်တာကို တွေ့ခဲ့ရပါတယ်။
  `"strict": true` ကို အရင်ကတည်းက သုံးနေတယ်ဆိုရင် — ကိုယ့်အတွက် ဘာမှ ပြောင်းလဲမှု မရှိပါဘူး။
  အရင် default ဖြစ်တဲ့ `false` ကို အားထားနေခဲ့တယ်ဆိုရင် — ကိုယ့် `tsconfig.json` ထဲမှာ `"strict": false` လို့ တိတိကျကျ သတ်မှတ်ဖို့ လိုပါလိမ့်မယ်။

- **`module` က default အနေနဲ့ `esnext` ဖြစ်သွားပါတယ်**:
  အလားတူပဲ — default `module` အသစ်က `esnext` ဖြစ်ပြီး — ESM က ယခုဆို လွှမ်းမိုးထားတဲ့ module format ဖြစ်နေတာကို အသိအမှတ်ပြုလိုက်တာပါ။

- **`target` က ယခုနှစ်၏ ES version ဆီ default ဖြစ်သွားပါတယ်**:
  Default `target` အသစ်က — ပံ့ပိုးထားတဲ့ နောက်ဆုံးပေါ် ECMAScript spec version (ထိရောက်စွာ floating target တစ်ခု) ဖြစ်ပါတယ်။
  လောလောဆယ် အဲဒီ target က `es2025` ပါ။
  ဒါက developer အများစုက evergreen runtimes တွေဆီ ship လုပ်နေပြီး — ECMAScript ဗားရှင်းအဟောင်းတွေဆီ compile ချဖို့ မလိုအပ်တော့တဲ့ လက်တွေ့ကို ထင်ဟပ်ပါတယ်။

- **`noUncheckedSideEffectImports` က ယခုဆို default အနေနဲ့ `true` ဖြစ်နေပါတယ်**:
  ဒါက side-effect-only imports တွေထဲက စာလုံးပေါင်းအမှားတွေနဲ့ ပတ်သတ်တဲ့ ပြဿနာတွေကို ဖမ်းမိဖို့ ကူညီပေးပါတယ်။

- **`libReplacement` က ယခုဆို default အနေနဲ့ `false` ဖြစ်နေပါတယ်**:
  ဒီ flag က အရင်က — run တိုင်းအတွက် မအောင်မြင်တဲ့ module resolutions အများအပြားကို ဖြစ်ပေါ်စေခဲ့ပြီး — ၎င်းက `--watch` နဲ့ editor အခြေအနေတွေအောက်မှာ စောင့်ကြည့်ဖို့ လိုတဲ့ နေရာအရေအတွက်ကိုပါ တစ်ဆင့် တိုးစေခဲ့ပါတယ်။
  Project အသစ်တစ်ခုမှာ — `libReplacement` က တခြား explicit configuration တစ်ခုခု မဖြစ်မချင်း ဘာမှ မလုပ်ပါဘူး — ဒါကြောင့် default အနေနဲ့ ပိုကောင်းတဲ့ performance အတွက် ဒါကို default အနေနဲ့ ပိတ်ထားတာ အဓိပ္ပာယ်ရှိပါတယ်။

ဒီ default အသစ်တွေက ကိုယ့် project ကို ချိုးဖျက်မိရင် — ကိုယ့် `tsconfig.json` ထဲမှာ အရင် values တွေကို တိတိကျကျ သတ်မှတ်နိုင်ပါတယ်။

### `rootDir` now defaults to `.` (`rootDir` က ယခုဆို `.` ဆီ default ဖြစ်သည်)

`rootDir` က ကိုယ့် output files တွေရဲ့ — output directory နဲ့ နှိုင်းယှဉ်တဲ့ — directory structure ကို ထိန်းချုပ်ပါတယ်။
အရင်က — `rootDir` တစ်ခု မသတ်မှတ်ထားဘူးဆိုရင် — non-declaration input files တွေအားလုံးရဲ့ common directory ကို အခြေခံပြီး infer လုပ်ခဲ့ပါတယ်။
ဒါပေမယ့် ဒါက — project တစ်ခုကို load ပြီး parse လုပ်ကြည့်ခြင်း မရှိဘဲ — file တစ်ခုက အဲဒီ project နဲ့ သက်ဆိုင်လားဆိုတာ သိဖို့ မဖြစ်နိုင်တာမျိုးကို မကြာခဏ ဆိုလိုပါတယ်။
ပြီးတော့ — TypeScript က program ထဲက file path တိုင်းကို ခွဲခြမ်းစိတ်ဖြာပြီး အဲဒီ common source directory ကို infer လုပ်ဖို့ အချိန် ပိုကုန်စေတာကိုလည်း ဆိုလိုပါတယ်။

TypeScript 6.0 မှာ — default `rootDir` က `tsconfig.json` file ပါဝင်တဲ့ directory ပဲ အမြဲ ဖြစ်ပါလိမ့်မယ်။
`rootDir` ကို `tsconfig.json` file မပါဘဲ command line ကနေ `tsc` သုံးတဲ့အခါမှသာ infer လုပ်ပါလိမ့်မယ်။

ကိုယ့် `tsconfig.json` directory ထက် ဘယ်အဆင့်မဆို ပိုနက်တဲ့ source files တွေ ရှိပြီး — source files တွေအတွက် common root directory တစ်ခုကို TypeScript က infer လုပ်တာကို အားထားနေခဲ့တယ်ဆိုရင် — `rootDir` ကို တိတိကျကျ သတ်မှတ်ဖို့ လိုပါလိမ့်မယ်:

```diff
  {
      "compilerOptions": {
          // ...
+         "rootDir": "./src"
      },
      "include": ["./src"]
  }
```

ထိုနည်းတူစွာ — ကိုယ့် `tsconfig.json` က ၎င်းပါဝင်တဲ့ `tsconfig.json` ရဲ့ အပြင်ဘက်က files တွေကို ရည်ညွှန်းထားတယ်ဆိုရင် — အဲဒီ files တွေ ပါဝင်အောင် ကိုယ့် `rootDir` ကို ချိန်ညှိဖို့ လိုပါလိမ့်မယ်။

```diff
  {
      "compilerOptions": {
          // ...
+         "rootDir": "../src"
      },
      "include": ["../src/**/*.tests.ts"]
  }
```

နောက်ထပ်ကို [ဒီ discussion](https://github.com/microsoft/TypeScript/issues/62194) နဲ့ [ဒီ implementation](https://github.com/microsoft/TypeScript/pull/62418) မှာ ကြည့်ပါ။

### `types` now defaults to `[]` (`types` က ယခုဆို `[]` ဆီ default ဖြစ်သည်)

`tsconfig.json` တစ်ခုထဲမှာ — `compilerOptions` ရဲ့ `types` field က compilation အတွင်းမှာ global scope ထဲ ထည့်သွင်းရမယ့် package names တွေရဲ့ list တစ်ခုကို သတ်မှတ်ပါတယ်။
ပုံမှန်အားဖြင့် — `node_modules` ထဲက packages တွေက ကိုယ့် source code ထဲက imports တွေကနေတစ်ဆင့် အလိုအလျောက် ပါဝင်ပါတယ်။
ဒါပေမယ့် အဆင်ပြေစေဖို့ — TypeScript က `node_modules/@types` ထဲက packages အားလုံးကိုပါ default အနေနဲ့ ထည့်သွင်းပေးခဲ့လို့ — `@types/node` ကနေ `process` ဒါမှမဟုတ် `"fs"` module လိုမျိုး၊ `@types/jest` ကနေ `describe` နဲ့ `it` လိုမျိုး global declarations တွေကို — တိုက်ရိုက် import လုပ်စရာမလိုဘဲ ရနိုင်ခဲ့ပါတယ်။

တစ်နည်းပြောရရင် — `types` value က အရင်က "`node_modules/@types` ထဲက အကုန်လုံးကို စာရင်းကောက်ပါ" ဆိုတာဆီ default ဖြစ်ခဲ့ပါတယ်။
ဒါက *အရမ်း* ဈေးကြီးနိုင်ပါတယ် — ဒီခေတ် ပုံမှန် repository setup တစ်ခုက `@types` packages ရာချီကို transitively (ဆင့်ပွား) ဆွဲသွင်းမိနိုင်လို့ပါ — အထူးသဖြင့် flattened `node_modules` တွေနဲ့ multi-project workspaces တွေမှာပါ။
ခေတ်မီ projects တွေက လိုအပ်တာ `@types/node`, `@types/jest`, ဒါမှမဟုတ် တခြား အသုံးများတဲ့ global-affecting packages လက်တစ်ဆုပ်စာလောက်ပဲ အမြဲလိုလို ဖြစ်ပါတယ်။

TypeScript 6.0 မှာ — default `types` value က `[]` (empty array တစ်ခု) ဖြစ်ပါလိမ့်မယ်။
ဒီပြောင်းလဲမှုက projects တွေကို — build အချိန်မှာ မလိုအပ်တဲ့ declaration files ရာချီ ဒါမှမဟုတ် ထောင်ချီကိုတောင် မရည်ရွယ်ဘဲ ဆွဲသွင်းမိတာကနေ တားဆီးပေးပါတယ်။
ကျွန်တော်တို့ ကြည့်ခဲ့တဲ့ projects အများအပြားက `types` ကို သင့်လျော်စွာ သတ်မှတ်ရုံနဲ့တင် — သူတို့ရဲ့ build time ကို 20-50% ကြားကနေ တိုးတက်စေခဲ့ပါတယ်။

**ဒါက projects အများအပြားကို ထိခိုက်စေပါလိမ့်မယ်။** `"types": ["node"]` ဒါမှမဟုတ် တခြား အနည်းငယ်ကို ထည့်ဖို့ လိုနိုင်ပါတယ်:

```diff
  {
      "compilerOptions": {
          // Explicitly list the @types packages you need
+         "types": ["node", "jest"]
      }
  }
```

အဟောင်း enumeration အပြုအမူကို ပြန်ဖွင့်ဖို့ `*` entry တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်:

```diff
  {
      "compilerOptions": {
          // Load ALL the types - the default from TypeScript 5.9 and before.
+         "types": ["*"]
      }
  }
```

အောက်ပါလိုမျိုး error messages အသစ်တွေနဲ့ ဆုံတွေ့ရရင်:

```
Cannot find module '...' or its corresponding type declarations.
Cannot find name 'fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'path'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'Bun'. Do you need to install type definitions for Bun? Try `npm i --save-dev @types/bun` and then add 'bun' to the types field in your tsconfig.
Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.
```

ကိုယ့် `types` field ထဲကို entries တစ်ချို့ ထည့်ဖို့ လိုနေတာ ဖြစ်နိုင်ပါတယ်။

နောက်ထပ်ကို [ဒီ proposal](https://github.com/microsoft/TypeScript/issues/62195) နဲ့အတူ [ဒီ implementing pull request](https://github.com/microsoft/TypeScript/pull/63054) မှာ ကြည့်ပါ။

### Deprecated: `target: es5` (`target: es5` ကို Deprecated ပြုလုပ်ခြင်း)

ECMAScript 5 target က legacy browsers တွေကို ပံ့ပိုးဖို့ အချိန်အတော်ကြာ အရေးပါခဲ့ပါတယ် — ဒါပေမယ့် ၎င်းရဲ့ ဆက်ခံသူ ECMAScript 2015 (ES6) က ဆယ်စုနှစ်တစ်ခုကျော် အရင်က release ဖြစ်ခဲ့ပြီး — ခေတ်မီ browsers အားလုံးက နှစ်ပေါင်းများစွာကြာအောင် ပံ့ပိုးထားပါပြီ။
Internet Explorer ရဲ့ အနားယူသွားမှုနဲ့ evergreen browsers တွေရဲ့ နေရာတိုင်းမှာ ရှိနေမှုနဲ့ဆိုတော့ — ဒီနေ့ခေတ်မှာ ES5 output အတွက် use cases တွေက သိပ်နည်းပါးသွားပါပြီ။

TypeScript ရဲ့ အနိမ့်ဆုံး target က ယခုဆို ES2015 ဖြစ်ပြီး — `target: es5` option က deprecated ဖြစ်သွားပါတယ်။
`target: es5` ကို သုံးနေခဲ့တယ်ဆိုရင် — target အသစ်တစ်ခုဆီ ရွှေ့ပြောင်းဖို့ ဒါမှမဟုတ် external compiler တစ်ခု သုံးဖို့ လိုပါလိမ့်မယ်။
ES5 output ကို ဆက်လိုအပ်နေသေးတယ်ဆိုရင် — ကိုယ့် TypeScript source ကို တိုက်ရိုက် compile လုပ်ဖို့ ဒါမှမဟုတ် TypeScript ရဲ့ outputs တွေကို post-process လုပ်ဖို့ — external compiler တစ်ခု သုံးဖို့ အကြံပြုပါတယ်။

[ဒီ deprecation အကြောင်း နောက်ထပ်ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/62196) — ၎င်းရဲ့ [implementing pull request](https://github.com/microsoft/TypeScript/pull/63067) နဲ့အတူပါ။

### Deprecated: `--downlevelIteration` (`--downlevelIteration` ကို Deprecated ပြုလုပ်ခြင်း)

`--downlevelIteration` က ES5 emit ပေါ်မှာပဲ သက်ရောက်မှု ရှိပြီး — `--target es5` deprecated ဖြစ်သွားတာမို့ — `--downlevelIteration` က အသုံးဝင်မှု မရှိတော့ပါဘူး။
သိမ်မွေ့တဲ့အချက်က — `--target es2015` နဲ့ `--downlevelIteration false` သုံးတာက TypeScript 5.9 နဲ့ အစောပိုင်းတွေမှာ — ဘာသက်ရောက်မှုမှ မရှိခဲ့ပေမယ့် error မထုတ်ခဲ့ပါဘူး။
TypeScript 6.0 မှာ — `--downlevelIteration` ကို လုံးဝ သတ်မှတ်တာတိုင်းက deprecation error တစ်ခုဆီ ဦးတည်ပါလိမ့်မယ်။

[implementation ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/63071)။

### Deprecated: `--moduleResolution node` (a.k.a. `--moduleResolution node10`) (`--moduleResolution node` ကို Deprecated ပြုလုပ်ခြင်း)

`--moduleResolution node` က Node.js 10 ရဲ့ အပြုအမူကို အတိကျဆုံး ထင်ဟပ်တဲ့ Node.js ရဲ့ module resolution algorithm ဗားရှင်း သီးခြားတစ်ခုကို စွဲမှတ်ထားခဲ့ပါတယ်။
ကံမကောင်းစွာပဲ — ဒီ target (နဲ့ ၎င်းရဲ့ နာမည်) က အဲဒီနောက်ပိုင်း ဖြစ်ပွားခဲ့တဲ့ Node.js ရဲ့ resolution algorithm ဆီက update အများအပြားကို လျစ်လျူရှုထားလို့ — ခေတ်မီ Node.js ဗားရှင်းတွေရဲ့ အပြုအမူကို ကောင်းကောင်း ကိုယ်စားပြုတာ မဟုတ်တော့ပါဘူး။

TypeScript 6.0 မှာ — `--moduleResolution node` (အထူးသဖြင့် — `--moduleResolution node10`) က deprecated ဖြစ်ပါတယ်။
`--moduleResolution node` သုံးနေခဲ့တဲ့ သုံးစွဲသူတွေက — Node.js ကို တိုက်ရိုက် target လုပ်ဖို့ စီစဉ်ရင် `--moduleResolution nodenext` ဆီ၊ bundler ဒါမှမဟုတ် Bun သုံးဖို့ စီစဉ်ရင်တော့ `--moduleResolution bundler` ဆီ — ပုံမှန်အားဖြင့် ရွှေ့ပြောင်းသင့်ပါတယ်။

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62200) နဲ့ [၎င်းရဲ့ corresponding pull request](https://github.com/microsoft/TypeScript/pull/62338) မှာ ကြည့်ပါ။

### Deprecated: `amd`, `umd`, and `systemjs` values of `module` (module ၏ `amd`, `umd` နှင့် `systemjs` values များ Deprecated ဖြစ်ခြင်း)

အောက်ပါ flag values တွေကို ဆက်လက် ပံ့ပိုးမှာ မဟုတ်တော့ပါဘူး

- `--module amd`
- `--module umd`
- `--module systemjs`
- `--module none`

AMD, UMD နဲ့ SystemJS တို့က — browsers တွေမှာ native module support မရှိခဲ့တဲ့ JavaScript modules တွေရဲ့ အစောပိုင်းကာလတွေမှာ အရေးပါခဲ့ပါတယ်။
"none" ရဲ့ semantics (အဓိပ္ပာယ်သတ်မှတ်ချက်များ) က ဘယ်တုန်းကမှ ကောင်းကောင်း သတ်မှတ်ထားခြင်း မရှိခဲ့ဘဲ — မကြာခဏ ရှုပ်ထွေးမှုတွေ ဖြစ်စေခဲ့ပါတယ်။
ဒီနေ့ခေတ်မှာ — ESM ကို browsers နဲ့ Node.js နှစ်ခုလုံးမှာ နေရာတိုင်း ပံ့ပိုးထားပြီး — ကွာဟချက်တွေကို ဖြည့်ဆည်းဖို့ import maps တွေရော bundlers တွေရော နှစ်ခုလုံးက ဦးစားပေး နည်းလမ်းတွေ ဖြစ်လာပါပြီ။
ဒီ module systems တွေကို ဆက် target လုပ်နေသေးတယ်ဆိုရင် — သင့်လျော်တဲ့ ECMAScript module-emitting target တစ်ခုဆီ ရွှေ့ပြောင်းတာ၊ bundler ဒါမှမဟုတ် တခြား compiler တစ်ခုကို လက်ခံကျင့်သုံးတာ၊ ဒါမှမဟုတ် ရွှေ့ပြောင်းနိုင်သည်အထိ TypeScript 5.x ပေါ်မှာ ဆက်နေတာ — ဒီထဲက တစ်ခုခုကို စဉ်းစားပါ။

ဒါက `amd-module` directive အတွက် ပံ့ပိုးမှု ရုပ်သိမ်းလိုက်တာကိုလည်း ဆိုလိုပြီး — ၎င်းက နောက်ထပ် ဘယ်သက်ရောက်မှုမှ ရှိတော့မှာ မဟုတ်ပါဘူး။

နောက်ထပ်ကို [ဒီ proposal issue](https://github.com/microsoft/TypeScript/issues/62199) နဲ့အတူ [ဒီ implementing pull request](https://github.com/microsoft/TypeScript/pull/62669) မှာ ကြည့်ပါ။

### Deprecated: `--baseUrl` (`--baseUrl` ကို Deprecated ပြုလုပ်ခြင်း)

`baseUrl` option က `paths` နဲ့ တွဲပြီး အသုံးအများဆုံး ဖြစ်ပြီး — ပုံမှန်အားဖြင့် `paths` ထဲက value တိုင်းအတွက် prefix တစ်ခုအနေနဲ့ သုံးပါတယ်။
ကံမကောင်းစွာပဲ — `baseUrl` က module resolution အတွက် look-up root တစ်ခုအဖြစ်လည်း သတ်မှတ်ခံရပါတယ်။

ဥပမာ — အောက်ပါ `tsconfig.json` ရှိတယ်ဆိုပါစို့

```json5
{
  "compilerOptions": {
    // ...
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

ပြီးတော့ ဒီလိုမျိုး import တစ်ခု ရှိတယ်ဆိုပါစို့

```ts
import * as someModule from "someModule.js";
```

Developer က `@app/` နဲ့ `@lib/` နဲ့ စတင်တဲ့ modules တွေအတွက်ပဲ mappings တွေ ထည့်ဖို့ ရည်ရွယ်ထားတာတောင် — TypeScript က ဒါကို `src/someModule.js` ဆီပဲ resolve လုပ်လိမ့်မယ် ဖြစ်နိုင်ပါတယ်။
အကောင်းဆုံး အခြေအနေမှာတောင် — ဒါက bundlers တွေ လျစ်လျူရှုမယ့် "ပိုဆိုးတဲ့ပုံစံရှိတဲ့ (worse-looking)" paths တွေဆီ မကြာခဏ ဦးတည်စေပါတယ်။
ဒါပေမယ့် — runtime မှာ ဘယ်တော့မှ အလုပ်မဖြစ်နိုင်တဲ့ import paths အများအပြားကို TypeScript က "ရပါတယ် (just fine)" လို့ သတ်မှတ်မိတာမျိုးကိုလည်း မကြာခဏ ဆိုလိုပါတယ်။

`path` mappings တွေက `baseUrl` သတ်မှတ်ဖို့ အချိန်အတော်ကြာအောင် မလိုအပ်တော့ပါဘူး — လက်တွေ့မှာလည်း — `baseUrl` သုံးတဲ့ projects အများစုက ၎င်းကို သူတို့ရဲ့ `paths` entries တွေအတွက် prefix တစ်ခုအနေနဲ့ပဲ သုံးပါတယ်။
TypeScript 6.0 မှာ — `baseUrl` က deprecated ဖြစ်ပြီး — module resolution အတွက် look-up root တစ်ခုအဖြစ် ထပ်မံ သတ်မှတ်ခံရတော့မှာ မဟုတ်ပါဘူး။

`baseUrl` ကို path-mapping entries တွေအတွက် prefix တစ်ခုအနေနဲ့ သုံးခဲ့တဲ့ developer တွေက — `baseUrl` ကို ရိုးရိုးရှင်းရှင်း ဖယ်ရှားပြီး — prefix ကို သူတို့ရဲ့ `paths` entries တွေဆီ ထည့်လိုက်ရုံပါပဲ:

```diff json5
  {
    "compilerOptions": {
      // ...
-     "baseUrl": "./src",
      "paths": {
-       "@app/*": ["app/*"],
-       "@lib/*": ["lib/*"]
+       "@app/*": ["./src/app/*"],
+       "@lib/*": ["./src/lib/*"]
      }
    }
  }
```

`baseUrl` ကို look-up root တစ်ခုအနေနဲ့ *တကယ်* သုံးခဲ့တဲ့ developer တွေကလည်း — အဟောင်း အပြုအမူကို ထိန်းသိမ်းဖို့ explicit path mapping တစ်ခုကို ထည့်နိုင်ပါတယ်:

```json5
{
  "compilerOptions": {
    // ...
    "paths": {
      // A new catch-all that replaces the baseUrl:
      "*": ["./src/*"],

      // Every other path now has an explicit common prefix:
      "@app/*": ["./src/app/*"],
      "@lib/*": ["./src/lib/*"],
    }
  }
}
```

ဒါပေမယ့် — ဒါက အလွန်ရှားပါးပါတယ်။
Developer အများစုက `baseUrl` ကို ရိုးရိုးရှင်းရှင်း ဖယ်ရှားပြီး — သင့်လျော်တဲ့ prefixes တွေကို သူတို့ရဲ့ `paths` entries တွေဆီ ထည့်ဖို့ အကြံပြုပါတယ်။

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62207) နဲ့ [သက်ဆိုင်ရာ pull request](https://github.com/microsoft/TypeScript/pull/62509) မှာ ကြည့်ပါ။

### Deprecated: `--moduleResolution classic` (`--moduleResolution classic` ကို Deprecated ပြုလုပ်ခြင်း)

`moduleResolution: classic` setting ကို ဖယ်ရှားလိုက်ပါပြီ။
`classic` resolution strategy က TypeScript ရဲ့ မူလ module resolution algorithm ဖြစ်ပြီး — Node.js ရဲ့ resolution algorithm က de facto standard ဖြစ်မလာခင် ကတည်းက ရှိခဲ့တာပါ။
ဒီနေ့ခေတ်မှာ — လက်တွေ့ကျတဲ့ use cases အားလုံးကို `nodenext` ဒါမှမဟုတ် `bundler` က ဖြည့်ဆည်းပေးပါတယ်။
`classic` သုံးနေခဲ့တယ်ဆိုရင် — ဒီခေတ်မီ resolution strategies တွေထဲက တစ်ခုဆီ ရွှေ့ပြောင်းပါ။

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62206) နဲ့ [ဒီ implementing pull request](https://github.com/microsoft/TypeScript/pull/62669) မှာ ကြည့်ပါ။

### Deprecated: `--esModuleInterop false` and `--allowSyntheticDefaultImports false` (`--esModuleInterop false` နှင့် `--allowSyntheticDefaultImports false` တို့ကို Deprecated ပြုလုပ်ခြင်း)

အောက်ပါ settings တွေကို `false` လို့ ဆက်လက် သတ်မှတ်လို့ မရတော့ပါဘူး:

- `esModuleInterop`
- `allowSyntheticDefaultImports`

`esModuleInterop` နဲ့ `allowSyntheticDefaultImports` တို့က ရှိပြီးသား projects တွေ မချိုးဖျက်ဖို့ မူလက opt-in ဖြစ်ခဲ့ပါတယ်။
ဒါပေမယ့် — သူတို့ ဖွင့်ပေးတဲ့ အပြုအမူက နှစ်ပေါင်းများစွာကြာအောင် အကြံပြုထားတဲ့ default ဖြစ်နေခဲ့ပါတယ်။
သူတို့ကို `false` လို့ သတ်မှတ်တာက — ESM ကနေ CommonJS modules တွေကို သုံးစွဲတဲ့အခါ သိမ်မွေ့တဲ့ runtime ပြဿနာတွေဆီ မကြာခဏ ဦးတည်စေခဲ့ပါတယ်။
TypeScript 6.0 မှာ — ပိုလုံခြုံတဲ့ interop အပြုအမူကို အမြဲတမ်း ဖွင့်ထားပါတယ်။

အဟောင်း အပြုအမူကို အားထားတဲ့ imports တွေ ရှိနေရင် — သူတို့ကို ချိန်ညှိဖို့ လိုနိုင်ပါတယ်:

```ts
// Before (with esModuleInterop: false)
import * as express from "express";

// After (with esModuleInterop always enabled)
import express from "express";
```

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62529) နဲ့ [၎င်းရဲ့ implementing pull request](https://github.com/microsoft/TypeScript/pull/62567) မှာ ကြည့်ပါ။

### Deprecated: `--alwaysStrict false` (`--alwaysStrict false` ကို Deprecated ပြုလုပ်ခြင်း)

`alwaysStrict` flag က `"use strict";` directive ရဲ့ inference နဲ့ emit ကို ရည်ညွှန်းပါတယ်။
TypeScript 6.0 မှာ — code အားလုံးကို [JavaScript strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) ထဲမှာ ရှိတယ်လို့ ယူဆသွားမှာ ဖြစ်ပြီး — ၎င်းက reserved words တွေ ဝန်းကျင်က syntactic corner cases တွေကို အထင်ရှားဆုံး သက်ရောက်တဲ့ JS semantics set တစ်ခုပါ။
`await`, `static`, `private`, ဒါမှမဟုတ် `public` လိုမျိုး reserved words တွေကို regular identifiers အဖြစ် သုံးထားတဲ့ "sloppy mode" code တွေ ရှိနေရင် — သူတို့ကို အမည်ပြောင်းဖို့ လိုပါလိမ့်မယ်။
Non-strict code ထဲမှာ `this` ရဲ့ အဓိပ္ပာယ်နဲ့ ပတ်သတ်တဲ့ သိမ်မွေ့တဲ့ semantics တွေကို အားထားခဲ့တယ်ဆိုရင် — ကိုယ့် code ကိုပါ ချိန်ညှိဖို့ လိုနိုင်ပါတယ်။

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62213) နဲ့ [၎င်းရဲ့ corresponding pull request](https://github.com/microsoft/TypeScript/pull/63089) မှာ ကြည့်ပါ။

### Deprecated: `outFile` (`outFile` ကို Deprecated ပြုလုပ်ခြင်း)

`--outFile` option ကို TypeScript 6.0 ကနေ ဖယ်ရှားလိုက်ပါပြီ။
ဒီ option က input files အများအပြားကို output file တစ်ခုတည်းထဲ ပေါင်းစည်းဖို့ မူလက ဒီဇိုင်းထုတ်ထားတာပါ။
ဒါပေမယ့် — Webpack, Rollup, esbuild, Vite, Parcel စတဲ့ external bundlers တွေက ဒီအလုပ်ကို အခုဆို ပိုမြန်အောင်၊ ပိုကောင်းအောင်၊ config လုပ်နိုင်မှု အများကြီး ပိုများအောင် လုပ်ပေးနေပါပြီ။
ဒီ option ကို ဖယ်ရှားလိုက်တာက implementation ကို ရိုးရှင်းစေပြီး — TypeScript အကောင်းဆုံး လုပ်နိုင်တာတွေဖြစ်တဲ့ type-checking နဲ့ declaration emit ပေါ်မှာ အာရုံစိုက်နိုင်စေပါတယ်။
`--outFile` ကို လက်ရှိ သုံးနေတယ်ဆိုရင် — external bundler တစ်ခုဆီ ရွှေ့ပြောင်းဖို့ လိုပါလိမ့်မယ်။
ခေတ်မီ bundlers အများစုမှာ out of the box အနေနဲ့ ကောင်းမွန်တဲ့ TypeScript ပံ့ပိုးမှု ရှိပါတယ်။

### Deprecated: legacy `module` Syntax for namespaces (namespaces များအတွက် legacy `module` Syntax)

TypeScript ရဲ့ အစောပိုင်း ဗားရှင်းတွေက namespaces တွေကို ကြေညာဖို့ `module` keyword ကို သုံးခဲ့ပါတယ်:

```ts
// ❌ Deprecated syntax - now an error
module Foo {
    export const bar = 10;
}
```

ဒီ syntax ကို နောက်ပိုင်းမှာ `namespace` keyword သုံးတဲ့ ခေတ်မီ နှစ်သက်ရာ ပုံစံဆီ alias လုပ်ခဲ့ပါတယ်:

```ts
// ✅ The correct syntax
namespace Foo {
    export const bar = 10;
}
```

`namespace` မိတ်ဆက်လိုက်တဲ့အခါ — `module` syntax ကို ရိုးရိုးရှင်းရှင်း အားပေးမှု ရပ်ဆိုင်းခဲ့ပါတယ်။
လွန်ခဲ့တဲ့ နှစ်အနည်းငယ်က — TypeScript language service က အဲဒီ keyword ကို deprecated အဖြစ် စတင် မှတ်သားပြီး — ၎င်းနေရာမှာ `namespace` ကို အကြံပြုလာပါတယ်။

TypeScript 6.0 မှာ — `namespace` မျှော်လင့်တဲ့ နေရာမှာ `module` သုံးတာက ယခုဆို hard deprecation ဖြစ်ပါတယ်။
ဒီပြောင်းလဲမှုက လိုအပ်ပါတယ် — `module` blocks တွေက legacy TypeScript syntax နဲ့ ဆန့်ကျင်ဘက် ဖြစ်မယ့် potential ECMAScript proposal တစ်ခု ဖြစ်နေလို့ပါ။

Ambient module declaration ပုံစံကတော့ အပြည့်အဝ ပံ့ပိုးထားဆဲ ဖြစ်ပါတယ်:

```ts
// ✅ Still works perfectly
declare module "some-module" {
    export function doSomething(): void;
}
```

အသေးစိတ်တွေအတွက် [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62211) နဲ့ ၎င်းရဲ့ [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62876) ကို ကြည့်ပါ။

### Deprecated: `asserts` Keyword on Imports (Imports များပေါ်မှ `asserts` Keyword)

`asserts` keyword ကို JavaScript language ဆီ import assertions proposal ကနေတစ်ဆင့် အဆိုပြုခဲ့ပါတယ်။
ဒါပေမယ့် — အဲဒီ proposal က နောက်ဆုံးမှာ — `asserts` အစား `with` keyword ကို သုံးတဲ့ [import attributes proposal](https://github.com/tc39/proposal-import-attributes) အဖြစ် ပြောင်းလဲသွားခဲ့ပါတယ်။

ဒါကြောင့် — `asserts` syntax က TypeScript 6.0 မှာ ယခုဆို deprecated ဖြစ်ပြီး — ၎င်းကို သုံးတာက error တစ်ခုဆီ ဦးတည်ပါလိမ့်မယ်:

```ts
// ❌ Deprecated syntax - now an error.
import blob from "./blahb.json" asserts { type: "json" }
//                              ~~~~~~~
// error: Import assertions have been replaced by import attributes. Use 'with' instead of 'asserts'.
```

အဲဒီအစား — import attributes တွေအတွက် `with` syntax ကို သုံးပါ:

```ts
// ✅ Works with the new import attributes syntax.
import blob from "./blahb.json" with { type: "json" }
```

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62210) နဲ့ ၎င်းရဲ့ [corresponding pull request](https://github.com/microsoft/TypeScript/pull/63077) မှာ ကြည့်ပါ။

### Deprecated: `no-default-lib` Directives (`no-default-lib` Directives များကို Deprecated ပြုလုပ်ခြင်း)

`/// <reference no-default-lib="true"/>` directive က အများအားဖြင့် နားလည်မှုလွဲခဲ့ပြီး — အလွဲသုံးခံခဲ့ရပါတယ်။
TypeScript 6.0 မှာ — ဒီ directive ကို ဆက်လက် ပံ့ပိုးမှာ မဟုတ်တော့ပါဘူး။
ဒါကို သုံးနေခဲ့တယ်ဆိုရင် — အဲဒီအစား `--noLib` ဒါမှမဟုတ် `--libReplacement` ကို သုံးဖို့ စဉ်းစားပါ။

[ဒီမှာ နောက်ထပ် ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/62209) — ပြီးတော့ [သက်ဆိုင်ရာ pull request](https://github.com/microsoft/TypeScript/pull/62435) မှာပါ။

### Specifying Command-Line Files When `tsconfig.json` Exists is Now an Error (tsconfig.json ရှိနေချိန် Command-Line Files သတ်မှတ်ခြင်းသည် ယခုဆို Error တစ်ခု ဖြစ်သည်)

လက်ရှိမှာ — `tsconfig.json` တစ်ခု တည်ရှိတဲ့ folder ထဲမှာ `tsc foo.ts` လို့ run လုပ်ရင် — config file ကို လုံးဝ လျစ်လျူရှုခံရပါတယ်။
Check နဲ့ emit options တွေ input file ပေါ်မှာ သက်ရောက်လိမ့်မယ်လို့ မျှော်လင့်ထားရင် — ဒါက မကြာခဏဆိုသလို သိပ်ရှုပ်ထွေးစေပါတယ်။

TypeScript 6.0 မှာ — `tsconfig.json` တစ်ခု ပါဝင်တဲ့ directory ထဲမှာ file arguments တွေနဲ့ `tsc` run လုပ်ရင် — ဒီအပြုအမူကို ရှင်းလင်းစေဖို့ error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်:

```
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

`tsconfig.json` ကို လျစ်လျူရှုပြီး TypeScript ရဲ့ defaults တွေနဲ့ `foo.ts` ကို compile လုပ်ချင်တဲ့ အခြေအနေမျိုးဆိုရင် — `--ignoreConfig` flag အသစ်ကို သုံးနိုင်ပါတယ်။

```sh
tsc --ignoreConfig foo.ts
```

နောက်ထပ်ကို [ဒီ issue](https://github.com/microsoft/TypeScript/issues/62197) နဲ့ ၎င်းရဲ့ [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62477) မှာ ကြည့်ပါ။

## Preparing for TypeScript 7.0 (TypeScript 7.0 အတွက် ကြိုတင်ပြင်ဆင်ခြင်း)

TypeScript 6.0 ကို အသွင်ကူးပြောင်းရေး (transition) release တစ်ခုအနေနဲ့ ဒီဇိုင်းထုတ်ထားပါတယ်။
`"ignoreDeprecations": "6.0"` သတ်မှတ်ထားတဲ့အခါ TypeScript 6.0 မှာ deprecated ဖြစ်တဲ့ options တွေက errors မရှိဘဲ ဆက် အလုပ်လုပ်နေဦးမှာ ဖြစ်ပေမယ့် — အဲဒီ options တွေကို TypeScript 7.0 (native TypeScript port) မှာတော့ **လုံးဝ ဖယ်ရှားပစ်မှာ** ဖြစ်ပါတယ်။
TypeScript 6.0 ကို upgrade လုပ်ပြီးနောက် deprecation warnings တွေ မြင်နေရရင် — TypeScript 7.0 ကို မလက်ခံကျင့်သုံးခင် (ဒါမှမဟုတ် ကိုယ့် project ထဲမှာ [native previews](https://www.npmjs.com/package/@typescript/native-preview) တွေကို မစမ်းမခင်) — အဲဒါတွေကို ဦးစွာ ဖြေရှင်းဖို့ ကျွန်တော်တို့ အပြင်းအထန် အကြံပြုပါတယ်။
