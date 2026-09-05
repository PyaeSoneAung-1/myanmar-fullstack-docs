---
title: "TypeScript 4.8 (TypeScript 4.8 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.8 ထုတ်ပြန်မှုမှတ်စု — strictNullChecks အောက်မှာ intersection/union ပိုင်းဆိုင်ရာ မှန်ကန်မှုနှင့် narrowing တိုးတက်မှုများ ၊ template string types များတွင် infer inference ၊ --build/--watch/--incremental performance ၊ decorators နေရာချထားမှု နှင့် အခြား breaking changes များ"
order: 88
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html"
status: translated
updated: 2026-09-05
---

## Improved Intersection Reduction, Union Compatibility, and Narrowing (Intersection Reduction ၊ Union Compatibility နှင့် Narrowing ပိုမိုကောင်းမွန်လာခြင်း)

TypeScript 4.8 က `--strictNullChecks` အောက်မှာ မှန်ကန်မှု (correctness) နဲ့ တသမတ်တည်း ဖြစ်မှု (consistency) ဆိုင်ရာ တိုးတက်မှု ဆက်တိုက်ကို ယူဆောင်လာပါတယ်။ ဒီပြောင်းလဲမှုတွေက intersection နဲ့ union types တွေ အလုပ်လုပ်ပုံကို သက်ရောက်ပြီး — TypeScript က types တွေကို narrow လုပ်တဲ့နေရာမှာလည်း အသုံးချပါတယ်။

ဥပမာ — `unknown` က union type `{} | null | undefined` နဲ့ သဘောတရားအရ နီးစပ်ပါတယ် — `null` ၊ `undefined` နဲ့ တခြား type တစ်ခုခုကို လက်ခံလို့ပါ။ TypeScript က အခုဆိုရင် ဒါကို အသိအမှတ်ပြုပြီး — `unknown` ကနေ `{} | null | undefined` ဆီ assignments တွေကို ခွင့်ပြုပါတယ်။

```ts
function f(x: unknown, y: {} | null | undefined) {
    x = y; // always worked
    y = x; // used to error, now works
}
```

နောက်ထပ် ပြောင်းလဲမှုတစ်ခုကတော့ — `{}` ကို တခြား object type တစ်ခုခုနဲ့ intersect လုပ်ရင် — အဲဒီ object type အတိုင်း ရိုးရှင်းစွာ လျှော့ချ (simplify) သွားပါတယ်။ ဒါက — `{} & null` နဲ့ `{} & undefined` တို့က ဖယ်ပစ်ခံရရုံပဲ ဆိုတော့ — `NonNullable` ကို `{}` နဲ့ intersection တစ်ခုအဖြစ်ပဲ ပြန်ရေးနိုင်စေခဲ့ပါတယ်။

```diff
- type NonNullable<T> = T extends null | undefined ? never : T;
+ type NonNullable<T> = T & {};
```

ဒါက တိုးတက်မှုတစ်ခုပါ — ဘာလို့လဲဆိုတော့ ဒီလို intersection types တွေကို reduce လုပ်ပြီး assign လုပ်လို့ရပေမယ့် — conditional types တွေကတော့ လက်ရှိမှာ မရသေးလို့ပါ။ ဒါကြောင့် `NonNullable<NonNullable<T>>` က အခုဆိုရင် အနည်းဆုံး `NonNullable<T>` အထိ simplify ဖြစ်သွားပြီး — အရင်က အဲဒါ မဟုတ်ခဲ့ပါဘူး။

```ts
function foo<T>(x: NonNullable<T>, y: NonNullable<NonNullable<T>>) {
    x = y; // always worked
    y = x; // used to error, now works
}
```

ဒီပြောင်းလဲမှုတွေက control flow analysis နဲ့ type narrowing တွေထဲမှာ အဓိပ္ပာယ်ရှိတဲ့ တိုးတက်မှုတွေကိုပါ ယူဆောင်လာနိုင်စေခဲ့ပါတယ်။ ဥပမာ — `unknown` ကို အခုဆိုရင် truthy branches တွေထဲမှာ `{} | null | undefined` လိုပဲ narrow လုပ်ပါတယ်။

```ts
function narrowUnknownishUnion(x: {} | null | undefined) {
    if (x) {
        x;  // {}
    }
    else {
        x;  // {} | null | undefined
    }
}

function narrowUnknown(x: unknown) {
    if (x) {
        x;  // used to be 'unknown', now '{}'
    }
    else {
        x;  // unknown
    }
}
```

Generic values တွေလည်း အလားတူ narrow လုပ်ခံရပါတယ်။ Value တစ်ခုက `null` ဒါမှမဟုတ် `undefined` မဟုတ်ဘူးဆိုတာ စစ်ဆေးတဲ့အခါ — TypeScript က အခုဆိုရင် အဲဒါကို `{}` နဲ့ intersect လုပ်ပါတယ် — ဒါက နောက်တစ်ခါ `NonNullable` လို့ ပြောတာနဲ့ အတူတူပါပဲ။ ဒီမှာက ပြောင်းလဲမှုတွေ အများကြီးကို ပေါင်းစည်းလိုက်တာမို့ — type assertions ဘာမှ မလိုဘဲ အောက်ပါ function ကို အခု သတ်မှတ်နိုင်ပါပြီ။

```ts
function throwIfNullable<T>(value: T): NonNullable<T> {
    if (value === undefined || value === null) {
        throw Error("Nullable value!");
    }

    // Used to fail because 'T' was not assignable to 'NonNullable<T>'.
    // Now narrows to 'T & {}' and succeeds because that's just 'NonNullable<T>'.
    return value;
}
```

`value` က အခုဆိုရင် `T & {}` အထိ narrow လုပ်ခံရပြီး — `NonNullable<T>` နဲ့ ထပ်တူကျသွားတာမို့ — function ရဲ့ body က TypeScript-specific syntax ဘာမှ မလိုဘဲ ရိုးရိုးသား အလုပ်လုပ်သွားပါတယ်။

ဒီပြောင်းလဲမှုတွေက ကိုယ်တိုင်ကြည့်ရင် သေးငယ်တာတွေလို ထင်ရနိုင်ပေမယ့် — နှစ်ပေါင်းများစွာ အစီရင်ခံခဲ့ရတဲ့ paper cuts (သေးငယ်တဲ့ စိတ်ညစ်စရာ ပြဿနာများ) အများအပြားအတွက် ပြင်ဆင်ချက်တွေကို ကိုယ်စားပြုပါတယ်။

ဒီတိုးတက်မှုတွေရဲ့ အသေးစိတ်တွေအတွက် — [ဒီမှာ ဆက်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49119)။

## Improved Inference for `infer` Types in Template String Types (Template String Types များတွင် `infer` Types များအတွက် Inference ပိုမိုကောင်းမွန်လာခြင်း)

TypeScript က မကြာသေးမီက — conditional types တွေထဲက `infer` type variables တွေပေါ်မှာ `extends` constraints တွေ ထည့်တဲ့ နည်းလမ်းတစ်ခုကို မိတ်ဆက်ခဲ့ပါတယ်။

```ts
// Grabs the first element of a tuple if it's assignable to 'number',
// and returns 'never' if it can't find one.
type TryGetNumberIfFirst<T> =
    T extends [infer U extends number, ...unknown[]] ? U : never;
```

ဒီ `infer` types တွေက template string type တစ်ခုထဲမှာ ပေါ်လာပြီး — primitive type တစ်ခုဆီ constrained ဖြစ်နေတယ်ဆိုရင် — TypeScript က အခုဆိုရင် literal type တစ်ခုကို parse ထုတ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

```ts
// SomeNum used to be 'number'; now it's '100'.
type SomeNum = "100" extends `${infer U extends number}` ? U : never;

// SomeBigInt used to be 'bigint'; now it's '100n'.
type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never;

// SomeBool used to be 'boolean'; now it's 'true'.
type SomeBool = "true" extends `${infer U extends boolean}` ? U : never;
```

ဒါက library တစ်ခုက runtime မှာ ဘာလုပ်မယ်ဆိုတာကို ပိုကောင်းအောင် ဖော်ပြနိုင်ပြီး — ပိုတိကျတဲ့ types တွေ ပေးနိုင်ပါတယ်။

ဒီအပေါ် မှတ်စုတစ်ခုကတော့ — TypeScript က ဒီ literal types တွေကို parse ထုတ်တဲ့အခါ — သင့်တော်တဲ့ primitive type နဲ့ တူနေသလောက် အများကြီးကို လောဘကြီးစွာ (greedily) parse ထုတ်ဖို့ ကြိုးစားပါတယ်; ဒါပေမယ့် ပြီးတော့ — အဲဒီ primitive ရဲ့ print-back (ပြန်ရိုက်ထုတ်မှု) က string contents တွေနဲ့ ကိုက်ညီမလားဆိုတာ စစ်ဆေးပါတယ်။ တစ်နည်းပြောရရင် — TypeScript က string ကနေ primitive ဆီ ၊ ပြီးတော့ ပြန်လာ — ဒီလမ်းကြောင်းက ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါတယ်။ String ကို "round-trip" လုပ်လို့ မရဘူးလို့ မြင်ရင် — base primitive type ဆီ ပြန်ကျသွားပါတယ်။

```ts
// JustNumber is `number` here because TypeScript parses out `"1.0"`, but `String(Number("1.0"))` is `"1"` and doesn't match.
type JustNumber = "1.0" extends `${infer T extends number}` ? T : never; 
```

ဒီ feature အကြောင်း [ဒီမှာ ပိုပြီး ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48094)။

## `--build`, `--watch`, and `--incremental` Performance Improvements (`--build` ၊ `--watch` နှင့် `--incremental` တို့၏ Performance ပိုမိုကောင်းမွန်လာခြင်း)

TypeScript 4.8 က `--watch` နဲ့ `--incremental` ၊ ပြီးတော့ `--build` သုံးတဲ့ project references builds တွေဝန်းကျင်က အခြေအနေတွေကို မြန်ဆန်စေသင့်တဲ့ optimization များစွာကို မိတ်ဆက်ပေးပါတယ်။ ဥပမာ — TypeScript က အခုဆိုရင် `--watch` mode ထဲမှာ no-op changes တွေအတွင်း timestamps တွေ update လုပ်တာမှာ အချိန်ကုန်ခံတာ ရှောင်နိုင်ပြီ — ဒါက rebuilds တွေကို မြန်စေပြီး — TypeScript ရဲ့ output ကို စောင့်ကြည့်နေနိုင်တဲ့ တခြား build tools တွေကိုလည်း အနှောင့်အယှက် မဖြစ်စေတော့ပါဘူး။ `--build` ၊ `--watch` နဲ့ `--incremental` တွေကြားမှာ အချက်အလက်တွေကို ပြန်လည်အသုံးပြုနိုင်တဲ့ တခြား optimizations တွေလည်း အများကြီး မိတ်ဆက်ထားပါတယ်။

ဒီတိုးတက်မှုတွေက ဘယ်လောက် ကြီးသလဲ? ကောင်းပြီ — အတော်လေး ကြီးတဲ့ internal codebase တစ်ခုမှာ — ရိုးရှင်းတဲ့ common operations အများအပြားမှာ 10%-25% လောက် အချိန်လျှော့ချနိုင်တာ တွေ့ခဲ့ရပြီး — no-change အခြေအနေတွေမှာတော့ 40% လောက် အချိန်လျှော့ချနိုင်ခဲ့ပါတယ်။ TypeScript codebase ပေါ်မှာလည်း အလားတူ ရလဒ်တွေ တွေ့ခဲ့ရပါတယ်။

[GitHub ပေါ်မှာ ပြောင်းလဲမှုတွေနဲ့ performance ရလဒ်တွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48784)။

## Errors When Comparing Object and Array Literals (Object နှင့် Array Literals များကို နှိုင်းယှဉ်သည့်အခါ Errors)

Language အများစုမှာ — `==` လိုမျိုး operators တွေက objects တွေပေါ်မှာ "value" equality လို့ခေါ်တာကို လုပ်ဆောင်ပါတယ်။ ဥပမာ — Python မှာ value တစ်ခုက empty list နဲ့ `==` ညီမညီ စစ်ခြင်းအားဖြင့် list တစ်ခု empty ဟုတ်မဟုတ် စစ်ဆေးတာ တရားဝင်ပါတယ်။

```py
if people_at_home == []:
    print("here's where I lie, broken inside. </3")
    adopt_animals()
```

JavaScript မှာတော့ ဒါက မဟုတ်ပါဘူး — objects (ဒါကြောင့် arrays တွေပါ) ကြားက `==` နဲ့ `===` တွေက references နှစ်ခုလုံး တူညီတဲ့ value တစ်ခုကို ညွှန်ပြမပြဆိုတာကိုပဲ စစ်ဆေးပါတယ်။ JavaScript မှာ ဒီလိုမျိုး code တွေက အကောင်းဆုံးအခြေအနေမှာ JavaScript developers တွေအတွက် အစောပိုင်း foot-gun (ကိုယ့်ကိုယ်ကို ပြန်ထိခိုက်စေတတ်တဲ့ အရာ) တစ်ခု ဖြစ်ပြီး — အဆိုးဆုံးအခြေအနေမှာတော့ production code ထဲက bug တစ်ခု ဖြစ်တယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။ အဲဒါကြောင့်ပဲ TypeScript က အောက်ပါလိုမျိုး code တွေကို အခု တားမြစ်ပါတယ်။

```ts
if (peopleAtHome === []) {
//  ~~~~~~~~~~~~~~~~~~~
// This condition will always return 'false' since JavaScript compares objects by reference, not value.
    console.log("here's where I lie, broken inside. </3")
    adoptAnimals();
}
```

ဒီ check ကို ပံ့ပိုးပေးခဲ့တဲ့ [Jack Works](https://github.com/Jack-Works) ကို ကျွန်တော်တို့ ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ်။ [ဒီမှာ ပါဝင်တဲ့ ပြောင်းလဲမှုတွေကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/45978)။

## Improved Inference from Binding Patterns (Binding Patterns များမှ Inference ပိုမိုကောင်းမွန်လာခြင်း)

အချို့သော အခြေအနေတွေမှာ — TypeScript က ပိုကောင်းတဲ့ inferences တွေ လုပ်ဖို့ binding pattern တစ်ခုကနေ type တစ်ခုကို ကောက်ယူပါလိမ့်မယ်။

```ts
declare function chooseRandomly<T>(x: T, y: T): T;

let [a, b, c] = chooseRandomly([42, true, "hi!"], [0, false, "bye!"]);
//   ^  ^  ^
//   |  |  |
//   |  |  string
//   |  |
//   |  boolean
//   |
//   number
```

`chooseRandomly` က `T` အတွက် type တစ်ခု ရှာဖွေဖို့ လိုအပ်တဲ့အခါ — အဓိကအားဖြင့် `[42, true, "hi!"]` နဲ့ `[0, false, "bye!"]` တို့ကို ကြည့်ပါလိမ့်မယ်; ဒါပေမယ့် TypeScript က ဒီ types နှစ်ခုက `Array<number | boolean | string>` လား ဒါမှမဟုတ် tuple type `[number, boolean, string]` လားဆိုတာ ဆုံးဖြတ်ဖို့ လိုပါတယ်။ အဲဒါလုပ်ဖို့ — tuple types တွေ ရှိမရှိအတွက် ရှိပြီးသား candidates တွေကို hint (သဲလွန်စ) တစ်ခုအနေနဲ့ ရှာဖွေပါလိမ့်မယ်။ TypeScript က binding pattern `[a, b, c]` ကို မြင်တဲ့အခါ — `[any, any, any]` type ကို ဖန်တီးပြီး — အဲဒီ type က `T` အတွက် low-priority candidate တစ်ခုအဖြစ် ကောက်ယူခံရကာ — `[42, true, "hi!"]` နဲ့ `[0, false, "bye!"]` တို့ရဲ့ types တွေအတွက် hint အဖြစ်ပါ အသုံးပြုပါတယ်။

ဒါက `chooseRandomly` အတွက်တော့ ကောင်းတယ်ဆိုတာ မြင်နိုင်ပေမယ့် — တခြား အခြေအနေတွေမှာတော့ မလုံလောက်ခဲ့ပါဘူး။ ဥပမာ — အောက်ပါ code ကို ကြည့်ပါ

```ts
declare function f<T>(x?: T): T;

let [x, y, z] = f();
```

Binding pattern `[x, y, z]` က `f` က `[any, any, any]` tuple တစ်ခု ထုတ်ပေးသင့်တယ်လို့ hint လုပ်ခဲ့ပါတယ်; ဒါပေမယ့် `f` က binding pattern တစ်ခုကို အခြေခံပြီး သူ့ရဲ့ type argument ကို ပြောင်းလဲလို့ မသင့်ပါဘူး။ ဘာကို assign လုပ်ခံနေရလဲဆိုတာကို အခြေခံပြီး array-like value အသစ်တစ်ခုကို ရုတ်တရက် ဖန်တီးလို့ မရတာမို့ — binding pattern type က ထုတ်လုပ်လိုက်တဲ့ type ပေါ်မှာ လွှမ်းမိုးမှု အများကြီး ပိုကြီးနေပါတယ်။ ဒါတင်မကဘူး — binding pattern type က `any`s တွေနဲ့ ပြည့်နေတာမို့ — `x` ၊ `y` နဲ့ `z` တွေက `any` အဖြစ် type သတ်မှတ်ခံရတာနဲ့ ကျန်ခဲ့ပါတယ်။

TypeScript 4.8 မှာ — ဒီ binding patterns တွေကို type arguments တွေအတွက် candidates အဖြစ် ဘယ်တော့မှ မသုံးတော့ပါဘူး။ အဲဒီအစား — ကျွန်တော်တို့ရဲ့ `chooseRandomly` ဥပမာလိုမျိုး parameter တစ်ခုက ပိုတိကျတဲ့ type တစ်ခု လိုအပ်တဲ့ အခါမျိုးအတွက်ပဲ — သူတို့ကို consult လုပ်ပါတယ်။ အပြုအမူအဟောင်းဆီ ပြန်သွားဖို့ လိုအပ်ရင် — explicit type arguments တွေကို အမြဲတမ်း ပေးနိုင်ပါတယ်။

ပိုပြီး သိချင်ရင် [GitHub ပေါ်က ပြောင်းလဲမှုကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49086)။

## File-Watching Fixes (Especially Across `git checkout`s) (File-Watching ပြင်ဆင်ချက်များ — အထူးသဖြင့် `git checkout` များအတွင်း)

ကြာရှည်စွာ တည်ရှိခဲ့တဲ့ bug တစ်ခုကတော့ — TypeScript က `--watch` mode နဲ့ editor အခြေအနေတွေထဲမှာ file ပြောင်းလဲမှုတချို့ကို အတော်လေး ခက်ခက်ခဲခဲ ကိုင်တွယ်ရတာပါ။ တစ်ခါတလေ လက္ခဏာတွေက — `tsc` ဒါမှမဟုတ် VS Code ကို restart လုပ်ဖို့ လိုအပ်စေတတ်တဲ့ — stale ဖြစ်နေတဲ့ ဒါမှမဟုတ် မတိကျတဲ့ errors တွေ ပေါ်လာတာမျိုးပါ။ ဒါတွေက Unix systems တွေမှာ မကြာခဏ ဖြစ်ပေါ်ပြီး — vim နဲ့ file တစ်ခုကို save လုပ်ပြီးတဲ့အခါ ဒါမှမဟုတ် git ထဲမှာ branches တွေ ပြောင်းလဲပြီးတဲ့အခါ ဒီလိုမျိုး ကြုံဖူးနိုင်ပါတယ်။

ဒါက Node.js က file systems တွေအနှံ့ rename events တွေကို ဘယ်လို ကိုင်တွယ်လဲဆိုတဲ့ ယူဆချက်တွေကြောင့် ဖြစ်ခဲ့တာပါ။ Linux နဲ့ macOS တွေ သုံးတဲ့ file systems တွေက [inodes](https://en.wikipedia.org/wiki/Inode) တွေကို အသုံးပြုပြီး — [Node.js က file watchers တွေကို file paths တွေမဟုတ်ဘဲ inodes တွေနဲ့ တွဲချိတ်ပါတယ်](https://nodejs.org/api/fs.html#inodes)။ ဒါကြောင့် Node.js က [watcher object တစ်ခု](https://nodejs.org/api/fs.html#class-fsfswatcher) ပြန်ပေးတဲ့အခါ — platform နဲ့ file system ပေါ် မူတည်ပြီး — path တစ်ခုကို ဒါမှမဟုတ် inode တစ်ခုကို စောင့်ကြည့်နေတာ ဖြစ်နိုင်ပါတယ်။

နည်းနည်း ပိုထိရောက်အောင် — TypeScript က path တစ်ခု disk ပေါ်မှာ ရှိနေသေးတာကို ထောက်လှမ်းမိရင် — watcher objects တွေကို ပြန်လည်အသုံးပြုဖို့ ကြိုးစားပါတယ်။ ဒါက မှားသွားတဲ့ နေရာပါ — အဲဒီ path မှာ file တစ်ခု ရှိနေသေးရင်တောင် — ထူးခြားတဲ့ file တစ်ခု ဖန်တီးခံရပြီး — အဲဒီ file က inode မတူညီတာမျိုး ဖြစ်နိုင်လို့ပါ။ ဒါကြောင့် TypeScript က မူရင်း တည်နေရာမှာ watcher အသစ်တစ်ခု တပ်ဆင်မယ့်အစား — watcher object ကို ပြန်သုံးမိပြီး — လုံးဝ မသက်ဆိုင်တဲ့ file တစ်ခုမှာ ပြောင်းလဲမှုတွေကို စောင့်ကြည့်နေမိတာမျိုး ဖြစ်တတ်ပါတယ်။ ဒါကြောင့် TypeScript 4.8 က inode systems တွေပေါ်မှာ ဒီကိစ္စတွေကို အခု ကိုင်တွယ်ပြီး — watcher အသစ်တစ်ခုကို ကောင်းမွန်စွာ တပ်ဆင်ကာ ဒါကို ပြင်ဆင်ပေးပါတယ်။

Airtable က [Marc Celani](https://github.com/MarcCelani-at) နဲ့ သူ့ရဲ့ အဖွဲ့သားတွေကို ကျေးဇူးတင်ပါတယ် — သူတို့ ကြုံတွေ့နေရတဲ့ ပြဿနာတွေကို စူးစမ်းလေ့လာရာမှာ အချိန်အများကြီး ရင်းနှီးမြှုပ်နှံပြီး — မူလအကြောင်းရင်း (root cause) ကို ထောက်ပြပေးခဲ့လို့ပါ။ [file-watching ဝန်းကျင်က တိကျတဲ့ ပြင်ဆင်ချက်တွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48997)။

## Find-All-References Performance Improvements (Find-All-References ၏ Performance ပိုမိုကောင်းမွန်လာခြင်း)

သင့် editor ထဲမှာ find-all-references ကို run လုပ်တဲ့အခါ — TypeScript က references တွေကို စုစည်းတဲ့အခါ နည်းနည်း ပိုပြီး စမတ်ကျကျ ပြုမူနိုင်ပါပြီ။ ဒါက TypeScript က သူ့ရဲ့ကိုယ်ပိုင် codebase ထဲမှာ အသုံးများတဲ့ identifier တစ်ခုကို ရှာဖွေဖို့ ယူရတဲ့ အချိန်ကို 20% လောက် လျှော့ချပေးခဲ့ပါတယ်။

[ဒီမှာ တိုးတက်မှုအကြောင်း ပိုပြီး ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49581)။

## Exclude Specific Files from Auto-Imports (Auto-Imports မှ Files အချို့ကို ဖယ်ထုတ်ခြင်း)

TypeScript 4.8 က auto-imports တွေကနေ files တွေကို ဖယ်ထုတ်ဖို့ editor preference တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ Visual Studio Code မှာ — file names တွေ ဒါမှမဟုတ် globs တွေကို Settings UI ထဲက "Auto Import File Exclude Patterns" အောက်မှာ ဒါမှမဟုတ် `.vscode/settings.json` file တစ်ခုထဲမှာ ထည့်နိုင်ပါတယ်:

```jsonc
{
    // Note that `javascript.preferences.autoImportFileExcludePatterns` can be specified for JavaScript too.
    "typescript.preferences.autoImportFileExcludePatterns": [
      "**/node_modules/@types/node"
    ]
}
```

ဒါက — သင့် compilation ထဲမှာ modules တချို့ ဒါမှမဟုတ် libraries တချို့ ပါဝင်နေတာကို မရှောင်လွှဲနိုင်ပေမယ့် — အဲဒီကနေ import လုပ်ချင်တာကတော့ ရှားပါတယ်ဆိုတဲ့ အခြေအနေမျိုးမှာ အသုံးဝင်နိုင်ပါတယ်။ ဒီ modules တွေမှာ auto-imports list ကို ညစ်ညမ်းစေပြီး — သွားလာရတာ ပိုခက်ခဲစေနိုင်တဲ့ exports အများကြီး ရှိနေနိုင်ပြီး — ဒီ option က ဒီလိုအခြေအနေမျိုးတွေမှာ ကူညီပေးနိုင်ပါတယ်။

[ဒီမှာ implementation အကြောင်း အသေးစိတ်တွေ ပိုကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49578)။

## Correctness Fixes and Breaking Changes (Correctness ပြင်ဆင်ချက်များနှင့် Breaking Changes)

Type system ပြောင်းလဲမှုတွေရဲ့ သဘောသဘာဝအရ — code *တစ်ချို့ကို* မသက်ရောက်ဘူးဆိုတဲ့ ပြောင်းလဲမှုတွေက အလွန်နည်းပါတယ်; ဒါပေမယ့် — ရှိပြီးသား code တွေကို လိုက်လျောညီထွေ ဖြစ်အောင် ပြောင်းလဲဖို့ လိုအပ်နိုင်ခြေ ပိုများတဲ့ ပြောင်းလဲမှု အနည်းငယ်တော့ ရှိပါတယ်။

### `lib.d.ts` Updates (`lib.d.ts` အပ်ဒိတ်များ)

TypeScript က ကြီးမားတဲ့ breaks တွေကို ရှောင်ရှားဖို့ ကြိုးစားနေပေမယ့် — built-in libraries တွေထဲက သေးငယ်တဲ့ ပြောင်းလဲမှုတွေတောင် ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။ DOM နဲ့ `lib.d.ts` updates တွေကြောင့် ကြီးမားတဲ့ breaks တွေ ဖြစ်မယ်လို့တော့ မျှော်လင့်မထားပါဘူး — ဒါပေမယ့် သိသာတဲ့ ပြောင်းလဲမှုတစ်ခုကတော့ — `Error`s တွေရဲ့ `cause` property က `Error` အစား `unknown` type ရှိတော့တာပါ။

### Unconstrained Generics No Longer Assignable to `{}` (`{}` ဆီ Unconstrained Generics များ Assignable မဟုတ်တော့ခြင်း)

TypeScript 4.8 မှာ — `strictNullChecks` ဖွင့်ထားတဲ့ projects တွေအတွက် — `null` ဒါမှမဟုတ် `undefined` တွေက တရားဝင် values တွေ မဟုတ်တဲ့ နေရာတစ်ခုမှာ unconstrained type parameter တစ်ခုကို သုံးထားရင် — TypeScript က အခုဆိုရင် မှန်ကန်စွာ error တစ်ခု ထုတ်ပြန်ပါတယ်။ ဒါက `{}` ၊ `object` ဒါမှမဟုတ် all-optional properties တွေပါတဲ့ object type တစ်ခုကို မျှော်လင့်တဲ့ type တစ်ခုခု အားလုံး ပါဝင်ပါတယ်။

ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကို အောက်မှာ မြင်နိုင်ပါတယ်။

```ts
// Accepts any non-null non-undefined value
function bar(value: {}) {
  Object.keys(value); // This call throws on null/undefined at runtime.
}

// Unconstrained type parameter T...
function foo<T>(x: T) {
    bar(x); // Used to be allowed, now is an error in 4.8.
    //  ~
    // error: Argument of type 'T' is not assignable to parameter of type '{}'.
}

foo(undefined);
```

အပေါ်မှာ ပြသထားသလိုပဲ — ဒီလိုမျိုး code မှာ ဖြစ်နိုင်ခြေရှိတဲ့ bug တစ်ခု ရှိပါတယ် — `null` နဲ့ `undefined` values တွေက ဒီ unconstrained type parameters တွေကနေ သွယ်ဝိုက်စွာ ဖြတ်သန်းပြီး — အဲဒီ values တွေကို မမြင်သင့်တဲ့ code တွေဆီ ရောက်သွားနိုင်လို့ပါ။

ဒီအပြုအမူက type positions တွေမှာလည်း မြင်နိုင်ပါလိမ့်မယ်။ ဥပမာတစ်ခုကတော့:

```ts
interface Foo<T> {
  x: Bar<T>;
}

interface Bar<T extends {}> { }
```

`null` နဲ့ `undefined` တွေကို ကိုင်တွယ်ချင်စရာ မလိုတဲ့ ရှိပြီးသား code တွေက — သင့်လျော်တဲ့ constraints တွေကို ဖြန့်ပွားစေခြင်းအားဖြင့် ပြင်ဆင်နိုင်ပါတယ်။

```diff
- function foo<T>(x: T) {
+ function foo<T extends {}>(x: T) {
```

နောက်ထပ် work-around တစ်ခုကတော့ — runtime မှာ `null` နဲ့ `undefined` တွေအတွက် စစ်ဆေးတာပါ။

```diff
  function foo<T>(x: T) {
+     if (x !== null && x !== undefined) {
          bar(x);
+     }
  }
```

ပြီးတော့ — တစ်ချို့သော အကြောင်းပြချက်တွေကြောင့် သင့် generic value က `null` ဒါမှမဟုတ် `undefined` မဖြစ်နိုင်ဘူးဆိုတာ သိထားရင် — non-null assertion တစ်ခုကိုပဲ သုံးနိုင်ပါတယ်။

```diff
  function foo<T>(x: T) {
-     bar(x);
+     bar(x!);
  }
```

Types တွေနဲ့ ပတ်သက်လာရင် — constraints တွေကို ဖြန့်ပွားဖို့ ဒါမှမဟုတ် သင့် types တွေကို `{}` နဲ့ intersect လုပ်ဖို့ မကြာခဏ လိုအပ်ပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒါကို မိတ်ဆက်ပေးခဲ့တဲ့ ပြောင်းလဲမှုကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49119) — [unconstrained generics တွေ အခု ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ တိကျတဲ့ ဆွေးနွေးမှု issue နဲ့အတူ](https://github.com/microsoft/TypeScript/issues/49489)။

### Decorators are placed on `modifiers` on TypeScript's Syntax Trees (TypeScript ၏ Syntax Trees များတွင် Decorators များကို `modifiers` ပေါ်၌ နေရာချခြင်း)

TC39 မှာ decorators တွေရဲ့ လက်ရှိ ဦးတည်ချက်အရ — TypeScript က decorators တွေရဲ့ နေရာချထားမှု (placement) နဲ့ ပတ်သက်ပြီး break တစ်ခုကို ကိုင်တွယ်ရပါလိမ့်မယ်။ အရင်က — TypeScript က decorators တွေကို keywords/modifiers တွေ အားလုံးရဲ့ ရှေ့မှာ အမြဲတမ်း နေရာချမယ်လို့ ယူဆခဲ့ပါတယ်။ ဥပမာ

```ts
@decorator
export class Foo {
  // ...
}
```

လက်ရှိ အဆိုပြုထားတဲ့အတိုင်း decorators တွေက ဒီ syntax ကို မပံ့ပိုးပါဘူး။ အဲဒီအစား — `export` keyword က decorator ရဲ့ ရှေ့မှာ လာရပါမယ်။

```ts
export @decorator class Foo {
  // ...
}
```

ကံမကောင်းစွာနဲ့ပဲ — TypeScript ရဲ့ trees တွေက *abstract* မဟုတ်ဘဲ *concrete* ဖြစ်ပြီး — ကျွန်တော်တို့ရဲ့ architecture က syntax tree node fields တွေကို တစ်ခုနဲ့တစ်ခု ရှေ့နောက် လုံးဝ စနစ်တကျ စီစဉ်ထားဖို့ မျှော်လင့်ပါတယ်။ Legacy decorators တွေရော အဆိုပြုထားတဲ့အတိုင်း decorators တွေရောကို ပံ့ပိုးနိုင်ဖို့ — TypeScript က modifiers တွေနဲ့ decorators တွေကို ချောမွေ့စွာ parse လုပ်ပြီး — ရောနှောနေရာချနိုင်ရပါမယ်။

ဒါလုပ်ဖို့ — ၎င်းက `Modifier` ဒါမှမဟုတ် `Decorator` တစ်ခု ဖြစ်တဲ့ `ModifierLike` လို့ခေါ်တဲ့ type alias အသစ်တစ်ခုကို ထုတ်ဖော်ပါတယ်။

```ts
export type ModifierLike = Modifier | Decorator;
```

Decorators တွေကို အခုဆိုရင် `modifiers` နဲ့ အတူတူ field ထဲမှာ နေရာချပြီး — အဲဒီ field က သတ်မှတ်ထားတဲ့အခါ `NodeArray<ModifierLike>` ဖြစ်ကာ — field တစ်ခုလုံးကို deprecated လုပ်ထားပါတယ်။

```diff
- readonly modifiers?: NodeArray<Modifier> | undefined;
+ /**
+  * @deprecated ...
+  * Use `ts.canHaveModifiers()` to test whether a `Node` can have modifiers.
+  * Use `ts.getModifiers()` to get the modifiers of a `Node`.
+  * ...
+  */
+ readonly modifiers?: NodeArray<ModifierLike> | undefined;
```

ရှိပြီးသား `decorators` properties တွေ အားလုံးကို deprecated အဖြစ် မှတ်သားထားပြီး — ဖတ်လိုက်ရင် အမြဲတမ်း `undefined` ပြန်ပေးပါလိမ့်မယ်။ ရှိပြီးသား tools တွေ သူတို့ကို မှန်မှန်ကန်ကန် ကိုင်တွယ်တတ်အောင် — type ကိုလည်း `undefined` အဖြစ် ပြောင်းထားပါတယ်။

```diff
- readonly decorators?: NodeArray<Decorator> | undefined;
+ /**
+  * @deprecated ...
+  * Use `ts.canHaveDecorators()` to test whether a `Node` can have decorators.
+  * Use `ts.getDecorators()` to get the decorators of a `Node`.
+  * ...
+  */
+ readonly decorators?: undefined;
```

Deprecation warnings အသစ်တွေနဲ့ တခြား ပြဿနာတွေကို ရှောင်ဖို့ — TypeScript က `decorators` နဲ့ `modifiers` properties တွေရဲ့ နေရာမှာ သုံးဖို့ function အသစ် လေးခုကို အခု ထုတ်ဖော်ပေးပါတယ်။ Node တစ်ခုမှာ modifiers တွေရော decorators တွေရော ပံ့ပိုးမှု ရှိမရှိ စစ်ဆေးဖို့ predicate တစ်ခုချင်းစီ ရှိပြီး — သူတို့ကို ဖမ်းယူဖို့ accessor functions တွေ အသီးသီး ပါပါတယ်။

```ts
function canHaveModifiers(node: Node): node is HasModifiers;
function getModifiers(node: HasModifiers): readonly Modifier[] | undefined;

function canHaveDecorators(node: Node): node is HasDecorators;
function getDecorators(node: HasDecorators): readonly Decorator[] | undefined;
```

Node တစ်ခုကနေ modifiers တွေကို ဝင်ရောက် ရှာဖွေနည်း ဥပမာအနေနဲ့ — အောက်ပါအတိုင်း ရေးနိုင်ပါတယ်

```ts
const modifiers = canHaveModifiers(myNode) ? getModifiers(myNode) : undefined;
```

`getModifiers` နဲ့ `getDecorators` တွေကို ခေါ်တိုင်း — array အသစ်တစ်ခု allocate လုပ်နိုင်တယ်ဆိုတာကို သတိပြုပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် — အောက်ပါတို့နဲ့ ပတ်သက်တဲ့ ပြောင်းလဲမှုတွေကို ကြည့်ပါ

* [ကျွန်တော်တို့ရဲ့ tree nodes တွေ ပြန်လည်ဖွဲ့စည်းခြင်း](https://github.com/microsoft/TypeScript/pull/49089)
* [deprecations တွေ](https://github.com/microsoft/TypeScript/pull/50343)
* [predicate functions တွေကို ထုတ်ဖော်ခြင်း](https://github.com/microsoft/TypeScript/pull/50399)

### Types Cannot Be Imported/Exported in JavaScript Files (JavaScript Files များတွင် Types များကို Import/Export လုပ်၍ မရတော့ခြင်း)

TypeScript က အရင်က JavaScript files တွေကို — type တစ်ခုနဲ့ ကြေညာထားပေမယ့် value မရှိတဲ့ entities တွေကို `import` နဲ့ `export` statements တွေထဲမှာ import/export လုပ်ခွင့် ပြုခဲ့ပါတယ်။ ဒီအပြုအမူက မှားယွင်းပါတယ် — ဘာလို့လဲဆိုတော့ — မတည်ရှိတဲ့ values တွေအတွက် named imports နဲ့ exports တွေက ECMAScript modules တွေအောက်မှာ runtime error ဖြစ်စေလို့ပါ။ JavaScript file တစ်ခုကို `--checkJs` အောက်မှာ ဒါမှမဟုတ် `// @ts-check` comment တစ်ခုကနေတစ်ဆင့် type-check လုပ်တဲ့အခါ — TypeScript က အခုဆိုရင် error တစ်ခု ထုတ်ပြန်ပါလိမ့်မယ်။

```ts
// @ts-check

// Will fail at runtime because 'SomeType' is not a value.
import { someValue, SomeType } from "some-module";

/**
 * @type {SomeType}
 */
export const myValue = someValue;

/**
 * @typedef {string | number} MyType
 */

// Will fail at runtime because 'MyType' is not a value.
export { MyType as MyExportedType };
```

တခြား module တစ်ခုကနေ type တစ်ခုကို reference လုပ်ဖို့ဆိုရင် — import ကို တိုက်ရိုက် qualify လုပ်နိုင်ပါတယ်။

```diff
- import { someValue, SomeType } from "some-module";
+ import { someValue } from "some-module";
  
  /**
-  * @type {SomeType}
+  * @type {import("some-module").SomeType}
   */
  export const myValue = someValue;
```

Type တစ်ခုကို export လုပ်ဖို့ဆိုရင် — JSDoc ထဲမှာ `/** @typedef */` comment တစ်ခုကိုပဲ သုံးနိုင်ပါတယ်။ `@typedef` comments တွေက သူတို့ ပါဝင်တဲ့ modules တွေကနေ types တွေကို အလိုအလျောက် export လုပ်ပေးပြီးသားပါ။

```diff
  /**
   * @typedef {string | number} MyType
   */

+ /**
+  * @typedef {MyType} MyExportedType
+  */
- export { MyType as MyExportedType };
```

[ဒီမှာ ပြောင်းလဲမှုအကြောင်း ပိုပြီး ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49580)။

### Binding Patterns Do Not Directly Contribute to Inference Candidates (Binding Patterns များသည် Inference Candidates များဆီ တိုက်ရိုက် မပါဝင်တော့ခြင်း)

အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ — binding patterns တွေက function calls တွေထဲမှာ inference ရလဒ်တွေရဲ့ type ကို ပြောင်းလဲပေးတာ မဟုတ်တော့ပါဘူး။ [ဒီမှာ မူရင်း ပြောင်းလဲမှုအကြောင်း ပိုပြီး ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/49086)။

### Unused Renames in Binding Patterns are Now Errors in Type Signatures (Type Signatures များတွင် Binding Patterns အတွင်းက Unused Renames များသည် ယခုအခါ Errors ဖြစ်လာခြင်း)

TypeScript ရဲ့ type annotation syntax က — values တွေကို destructure လုပ်တဲ့အခါ သုံးလို့ရတဲ့ syntax နဲ့ တူနေတတ်ပါတယ်။ ဥပမာ — အောက်ပါ function ကို ကြည့်ပါ။

```ts
declare function makePerson({ name: string, age: number }): Person;
```

ဒီ signature ကို ဖတ်ပြီး — `makePerson` က `name` property က `string` type နဲ့ `age` property က `number` type ရှိတဲ့ object တစ်ခုကို ရယူတယ်လို့ ထင်မိနိုင်ပါတယ်; ဒါပေမယ့် — JavaScript ရဲ့ destructuring syntax က ဒီနေရာမှာ ဦးစားပေး အဓိပ္ပာယ်ဖွင့်ဆိုခံနေပါတယ်။ `makePerson` က `name` နဲ့ `age` properties တွေပါတဲ့ object တစ်ခုကို ရယူမယ်လို့ ပြောပေမယ့် — သူတို့အတွက် type တစ်ခု သတ်မှတ်မယ့်အစား — `name` နဲ့ `age` တို့ကို `string` နဲ့ `number` အဖြစ် အသီးသီး rename လုပ်နေတာပဲ ဖြစ်ပါတယ်။

Pure type construct တစ်ခုထဲမှာ — ဒီလိုမျိုး code ရေးတာက အသုံးမကျပြီး — developers တွေက သူတို့ type annotation တစ်ခု ရေးနေတယ်လို့ အများအားဖြင့် ထင်နေကြတာမို့ — ပုံမှန်အားဖြင့် အမှားတစ်ခု ဖြစ်ပါတယ်။

TypeScript 4.8 က ဒါတွေကို — signature ထဲမှာ နောက်ပိုင်း ပြန် reference မလုပ်ထားဘူးဆိုရင် — errors အဖြစ် သတ်မှတ်ပါတယ်။ အပေါ်က signature ကို ရေးဖို့ မှန်ကန်တဲ့ နည်းလမ်းကတော့ အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```ts
declare function makePerson(options: { name: string, age: number }): Person;

// or

declare function makePerson({ name, age }: { name: string, age: number }): Person;
```

ဒီပြောင်းလဲမှုက declarations တွေထဲမှာ bugs တွေကို ဖမ်းမိနိုင်ပြီး — ရှိပြီးသား code တွေကို တိုးတက်ကောင်းမွန်အောင် ကူညီပေးနိုင်ခဲ့ပါတယ်။ ဒီ check ကို ပံ့ပိုးပေးခဲ့တဲ့ [GitHub user uhyo](https://github.com/uhyo) ကို ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ်။ [ဒီမှာ ပြောင်းလဲမှုအကြောင်း ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/41044)။
