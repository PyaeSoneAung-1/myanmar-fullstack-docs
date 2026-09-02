---
title: "Declaration File Theory — နက်ရှိုင်းစွာ လေ့လာခြင်း (Deep Dive)"
description: "Declaration files တွေ ဘယ်လို အလုပ်လုပ်သလဲဆိုတာ အသေးစိပ် လေ့လာချက် — types, values နဲ့ namespaces ပေါင်းစပ်မှုအကြောင်း နားလည်ပြီး module/UMD libraries များအတွက် ရှုပ်ထွေးသော declaration files ရေးနည်း"
order: 23
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html"
status: translated
updated: 2026-09-02
---

## Declaration File Theory — နက်ရှိုင်းစွာ လေ့လာခြင်း (Deep Dive)

သင်လိုချင်တဲ့ API ပုံသဏ္ဍာန် (shape) အတိအကျ ရအောင် modules တွေကို ဖွဲ့စည်းတာက သိမ်မွေ့နိုင်ပါတယ်။ ဥပမာ — `new` နဲ့ ခေါ်တာရော၊ `new` မပါဘဲ ခေါ်တာရော နှစ်မျိုးလုံးမှာ types မတူညီတဲ့ အဖြေတွေ ထုတ်ပေးနိုင်တဲ့ module တစ်ခု၊ hierarchy (အဆင့်ဆင့်) ပုံစံနဲ့ ဖော်ပြထားတဲ့ named types အမျိုးမျိုး ပါတဲ့ module တစ်ခု၊ module object ပေါ်မှာ properties တွေပါ တစ်ပါတည်း ရှိတဲ့ module တစ်ခု — စသဖြင့် လိုချင်နိုင်ပါတယ်။

ဒီ guide ကို ဖတ်ခြင်းအားဖြင့် — သုံးရလွယ်ကူတဲ့ (friendly) API surface တစ်ခုကို ဖော်ထုတ်ပေးတဲ့ ရှုပ်ထွေးတဲ့ declaration files တွေ ရေးဖို့ လိုအပ်တဲ့ ကိရိယာတွေ ရရှိမှာ ဖြစ်ပါတယ်။ ဒီ guide က module (ဒါမှမဟုတ် UMD) libraries တွေကို အဓိက အာရုံစိုက်ပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒီမှာ ရွေးချယ်စရာ (options) တွေ ပိုများပြီး ပိုကွဲပြားလို့ပါ။

## Key Concepts (အဓိက သဘောတရားများ)

TypeScript အလုပ်လုပ်ပုံရဲ့ အဓိက သဘောတရားတချို့ကို နားလည်ထားမယ်ဆိုရင် — declaration ပုံစံ ဘယ်လိုမျိုးကိုမဆို ဘယ်လို ဖန်တီးရမလဲဆိုတာ အပြည့်အဝ နားလည်နိုင်မှာ ဖြစ်ပါတယ်။

### Types

ဒီ guide ကို ဖတ်နေတာဆိုတော့ — TypeScript မှာ type ဆိုတာ ဘာလဲဆိုတာ အကြမ်းဖျင်း သိပြီးသား ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် ပိုတိကျအောင် ပြောရရင် — _type_ တစ်ခုကို ဒီအရာတွေနဲ့ မိတ်ဆက်ပေးပါတယ်:

- Type alias declaration (`type sn = number | string;`)
- Interface declaration (`interface I { x: number[]; }`)
- Class declaration (`class C { }`)
- Enum declaration (`enum E { A, B, C }`)
- Type တစ်ခုကို ရည်ညွှန်းတဲ့ `import` declaration

ဒီ declaration ပုံစံ တစ်ခုချင်းစီက type name အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

### Values

Types တွေလိုပဲ — value ဆိုတာ ဘာလဲဆိုတာကိုလည်း သင်နားလည်ပြီးသား ဖြစ်နိုင်ပါတယ်။ Values တွေက expressions တွေထဲမှာ ရည်ညွှန်းလို့ရတဲ့ runtime names တွေပါ။ ဥပမာ — `let x = 5;` က `x` လို့ခေါ်တဲ့ value တစ်ခုကို ဖန်တီးပါတယ်။

ထပ်ပြီး တိကျအောင် ပြောရရင် — ဒီအရာတွေက values တွေကို ဖန်တီးပါတယ်:

- `let`, `const` နဲ့ `var` declarations
- Value တစ်ခု ပါဝင်တဲ့ `namespace` ဒါမှမဟုတ် `module` declaration
- `enum` declaration
- `class` declaration
- Value တစ်ခုကို ရည်ညွှန်းတဲ့ `import` declaration
- `function` declaration

### Namespaces

Types တွေက _namespaces_ တွေထဲမှာ တည်ရှိနိုင်ပါတယ်။ ဥပမာ — `let x: A.B.C` ဆိုတဲ့ declaration ရှိတယ်ဆိုရင် — `C` type က `A.B` namespace ကနေ လာတယ်လို့ ပြောပါတယ်။

ဒီ ကွဲပြားချက်က သိမ်မွေ့ပြီး အရေးကြီးပါတယ် — ဒီနေရာမှာ `A.B` က type ဒါမှမဟုတ် value တစ်ခု ဖြစ်စရာ မလိုပါဘူး။

## Simple Combinations — နာမည်တစ်ခု၊ အဓိပ္ပါယ်များစွာ

နာမည် `A` တစ်ခုအတွက် — `A` ရဲ့ အဓိပ္ပါယ် အများဆုံး သုံးမျိုးအထိ ရှိနိုင်ပါတယ်: type တစ်ခု၊ value တစ်ခု ဒါမှမဟုတ် namespace တစ်ခုပေါ့။ နာမည်ကို ဘယ်လို အဓိပ္ပာယ် ကောက်မလဲဆိုတာ — သုံးထားတဲ့ context (နေရာ/အခြေအနေ) ပေါ်မှာ မူတည်ပါတယ်။ ဥပမာ — `let m: A.A = A;` ဆိုတဲ့ declaration ထဲမှာ `A` ကို ပထမဆုံး namespace အနေနဲ့၊ ပြီးတော့ type name အနေနဲ့၊ နောက်ဆုံးမှာ value အနေနဲ့ သုံးထားပါတယ်။ ဒီ အဓိပ္ပါယ်တွေက တစ်ခုနဲ့တစ်ခု လုံးဝမတူတဲ့ declarations တွေကို ရည်ညွှန်းနေတာလည်း ဖြစ်နိုင်ပါတယ်!

ဒါက ရှုပ်ထွေးပုံရနိုင်ပေမယ့် — အရာတွေကို အလွန်အကျွံ overload (နာမည်တစ်ခုတည်းပေါ် အဓိပ္ပါယ်များစွာ တင်ခြင်း) မလုပ်သရွေ့တော့ တကယ့်ကို အဆင်ပြေစေပါတယ်။ ဒီ ပေါင်းစပ်မှု (combining) အပြုအမူရဲ့ အသုံးဝင်တဲ့ သွင်ပြင်တချို့ကို ကြည့်ရအောင်။

### Built-in Combinations (တည်ဆောက်ပြီးသား ပေါင်းစပ်မှုများ)

ဥပမာ — `class` က _type_ နဲ့ _value_ စာရင်း နှစ်ခုလုံးမှာ ပါနေတာကို လိမ္မာပါးနပ်တဲ့ စာဖတ်သူတွေ သတိထားမိပါလိမ့်မယ်။ `class C { }` declaration က အရာ နှစ်ခုကို ဖန်တီးပါတယ်: class ရဲ့ instance shape (class instance တစ်ခုရဲ့ ပုံသဏ္ဍာန်) ကို ရည်ညွှန်းတဲ့ _type_ `C` နဲ့ — class ရဲ့ constructor function ကို ရည်ညွှန်းတဲ့ _value_ `C` တို့ပါ။ Enum declarations တွေလည်း အလားတူပဲ ပြုမူပါတယ်။

### User Combinations (အသုံးပြုသူ ပေါင်းစပ်မှုများ)

`foo.d.ts` ဆိုတဲ့ module file တစ်ခု ရေးလိုက်တယ် ဆိုပါစို့:

```ts
export var SomeVar: { a: SomeType };
export interface SomeType {
  count: number;
}
```

ပြီးတော့ အဲဒါကို ဒီလို သုံးစွဲလိုက်ပါတယ်:

```ts
import * as foo from "./foo";
let x: foo.SomeType = foo.SomeVar.a;
console.log(x.count);
```

ဒါက လုံလောက်အောင် အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် `SomeType` နဲ့ `SomeVar` တို့က အရမ်းကို နီးကပ်စွာ ဆက်စပ်နေတာမို့ နာမည်တူ ဖြစ်စေချင်တယ် ဆိုပါစို့။ value နဲ့ type ဆိုတဲ့ မတူညီတဲ့ object နှစ်ခုကို — `Bar` ဆိုတဲ့ နာမည်တစ်ခုတည်းအောက်မှာ တင်ပြဖို့ combining ကို သုံးနိုင်ပါတယ်:

```ts
export var Bar: { a: Bar };
export interface Bar {
  count: number;
}
```

ဒါက သုံးစွဲတဲ့ (consuming) code ထဲမှာ destructuring (ဖြုတ်ထုတ်ယူခြင်း) လုပ်ဖို့ အလွန်ကောင်းတဲ့ အခွင့်အရေး တစ်ခု ဖြစ်စေပါတယ်:

```ts
import { Bar } from "./foo";
let x: Bar = Bar.a;
console.log(x.count);
```

ဒီမှာ `Bar` ကို type ရော value ရော နှစ်မျိုးလုံးအနေနဲ့ သုံးထားပြန်ပါတယ်။ `Bar` value ကို `Bar` type နဲ့ပဲ ဖြစ်ရမယ်လို့ declare (ကြေညာ) လုပ်စရာ မလိုဘူးဆိုတာ သတိပြုပါ — သူတို့က တစ်ခုနဲ့တစ်ခု သီးခြားစီပါ။

## Advanced Combinations (အဆင့်မြင့် ပေါင်းစပ်မှုများ)

Declaration အမျိုးအစားတချို့ကို declarations အများအပြားကြားမှာ ပေါင်းစပ်လို့ရပါတယ်။ ဥပမာ — `class C { }` နဲ့ `interface C { }` တို့က တစ်ပြိုင်နက် တည်ရှိနိုင်ပြီး `C` type ဆီကို properties တွေ နှစ်ဖက်စလုံးက ထည့်ဝင်ပေးနိုင်ပါတယ်။

ဒါက conflict (ပဋိပက္ခ) တစ်ခုကို မဖန်တီးသရွေ့တော့ တရားဝင်ပါတယ်။ အကြမ်းဖျင်း စည်းမျဉ်းကတော့ — values တွေက နာမည်တူ အခြား values တွေနဲ့ အမြဲ conflict ဖြစ်ပါတယ် (`namespace`s အဖြစ် declare လုပ်ထားတာမဟုတ်ရင်)။ Types တွေကတော့ type alias declaration (`type s = string`) နဲ့ declare လုပ်ထားတာဆိုရင် conflict ဖြစ်ပြီး — namespaces တွေကတော့ ဘယ်တော့မှ conflict မဖြစ်ပါဘူး။

ဒါကို ဘယ်လို အသုံးချနိုင်လဲ ကြည့်ရအောင်။

### `interface` ကို သုံး၍ ထပ်ဖြည့်ခြင်း

`interface` declaration တစ်ခုနဲ့ အခြား `interface` တစ်ခုဆီကို members အပိုတွေ ထပ်ဖြည့်နိုင်ပါတယ်:

```ts
interface Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

ဒါက classes တွေမှာလည်း အလုပ်လုပ်ပါတယ်:

```ts
class Foo {
  x: number;
}
// ... elsewhere ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

Type aliases တွေ (`type s = string;`) ကိုတော့ interface နဲ့ ထပ်ဖြည့်လို့ မရဘူးဆိုတာ သတိပြုပါ။

### `namespace` ကို သုံး၍ ထပ်ဖြည့်ခြင်း

`namespace` declaration တစ်ခုကို သုံးပြီး — conflict မဖြစ်စေတဲ့ နည်းလမ်းနဲ့ types အသစ်တွေ၊ values တွေ၊ namespaces တွေကို ဘယ်လိုမဆို ထပ်ဖြည့်နိုင်ပါတယ်။

ဥပမာ — class တစ်ခုဆီကို static member တစ်ခု ထပ်ဖြည့်နိုင်ပါတယ်:

```ts
class C {}
// ... elsewhere ...
namespace C {
  export let x: number;
}
let y = C.x; // OK
```

ဒီ ဥပမာမှာ — `C` ရဲ့ _static_ side (constructor function ဘက်ခြမ်း) ဆီကို value တစ်ခု ထည့်လိုက်တာပါ။ ဘာလို့လဲဆိုတော့ ထည့်လိုက်တာက _value_ တစ်ခုဖြစ်ပြီး — values တွေရဲ့ container (ထိန်းထားသူ) က အခြား value တစ်ခုပဲ ဖြစ်လို့ပါ (types တွေကို namespaces တွေက ထိန်းထားပြီး — namespaces တွေကို အခြား namespaces တွေက ထိန်းထားပါတယ်)။

Class တစ်ခုဆီကို namespaced type တစ်ခုလည်း ထပ်ဖြည့်နိုင်ပါတယ်:

```ts
class C {}
// ... elsewhere ...
namespace C {
  export interface D {}
}
let y: C.D; // OK
```

ဒီ ဥပမာမှာ — `namespace` declaration ကို မရေးခင်အထိ `C` ဆိုတဲ့ namespace မရှိခဲ့ပါဘူး။ namespace အနေနဲ့ `C` ရဲ့ အဓိပ္ပါယ်က class က ဖန်တီးထားတဲ့ `C` ရဲ့ value ဒါမှမဟုတ် type အဓိပ္ပါယ်တွေနဲ့ conflict မဖြစ်ပါဘူး။

နောက်ဆုံးအနေနဲ့ — `namespace` declarations တွေကို သုံးပြီး merge (ပေါင်းစပ်) မျိုးစုံ လုပ်ဆောင်နိုင်ပါတယ်။ ဒါက လက်တွေ့ကျတဲ့ ဥပမာတစ်ခု မဟုတ်ပေမယ့် — စိတ်ဝင်စားစရာ အပြုအမူ အမျိုးမျိုးကို ပြသပါတယ်:

```ts
namespace X {
  export interface Y {}
  export class Z {}
}

// ... elsewhere ...
namespace X {
  export var Y: number;
  export namespace Z {
    export class C {}
  }
}
type X = string;
```

ဒီ ဥပမာမှာ ပထမ block က အောက်ပါ name meanings တွေကို ဖန်တီးပါတယ်:

- Value `X` (`namespace` declaration ထဲမှာ `Z` ဆိုတဲ့ value တစ်ခု ပါဝင်လို့)
- Namespace `X` (`namespace` declaration ထဲမှာ `Y` ဆိုတဲ့ type တစ်ခု ပါဝင်လို့)
- `X` namespace ထဲက type `Y`
- `X` namespace ထဲက type `Z` (class ရဲ့ instance shape)
- `X` value ရဲ့ property တစ်ခုဖြစ်တဲ့ value `Z` (class ရဲ့ constructor function)

ဒုတိယ block ကတော့ အောက်ပါ name meanings တွေကို ဖန်တီးပါတယ်:

- `X` value ရဲ့ property တစ်ခုဖြစ်တဲ့ value `Y` (`number` type နဲ့)
- Namespace `Z`
- `X` value ရဲ့ property တစ်ခုဖြစ်တဲ့ value `Z`
- `X.Z` namespace ထဲက type `C`
- `X.Z` value ရဲ့ property တစ်ခုဖြစ်တဲ့ value `C`
- Type `X`
