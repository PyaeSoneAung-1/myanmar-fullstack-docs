---
title: "TypeScript 5.8 (TypeScript 5.8 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.8 ရဲ့ ထူးခြားချက်တွေ — return expressions ထဲက branches တွေအတွက် granular checks, `--module nodenext` အောက်မှာ ESM files တွေကို `require()` လုပ်နိုင်မှု, `--module node18`, `--erasableSyntaxOnly` နဲ့ `--libReplacement` option အသစ်တွေ, declaration files တွေထဲက computed property names ထိန်းသိမ်းမှု, program load/update optimizations တွေနဲ့ import assertions ကန့်သတ်ချက်လို behavioral changes တွေ အကြောင်း"
order: 98
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html"
status: translated
updated: 2026-09-05
---

## Granular Checks for Branches in Return Expressions (Return Expressions များထဲက Branches များအတွက် Granular Checks)

ဒီလိုပုံစံရှိတဲ့ code တစ်ချို့ကို သုံးသပ်ကြည့်ပါ:

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
}
```

ဒီ code ရဲ့ ရည်ရွယ်ချက်က — cache ထဲမှာ URL object ရှိနေရင် အဲဒါကို ပြန်ယူဖို့၊ မရှိဘူးဆိုရင် URL object အသစ်တစ်ခု ဖန်တီးဖို့ ဖြစ်ပါတယ်။
ဒါပေမယ့် bug တစ်ခု ရှိပါတယ် — input နဲ့ URL object အသစ်တစ်ခုကို တကယ် မဖန်တီးမိလိုက်ပါဘူး။
ကံမကောင်းစွာပဲ — TypeScript က ဒီလို bug မျိုးကို ယေဘုယျအားဖြင့် ဖမ်းမမိခဲ့ပါဘူး။

TypeScript က `cond ? trueBranch : falseBranch` လိုမျိုး conditional expressions တွေကို check လုပ်တဲ့အခါ — အဲဒီ expression ရဲ့ type ကို branch နှစ်ခုရဲ့ types တွေရဲ့ union တစ်ခုအနေနဲ့ သတ်မှတ်ပါတယ်။
တစ်နည်းပြောရရင် — `trueBranch` နဲ့ `falseBranch` ရဲ့ types တွေကို ယူပြီး — union type တစ်ခုအဖြစ် ပေါင်းစပ်လိုက်ပါတယ်။
ဒီကိစ္စမှာ — `untypedCache.get(urlString)` ရဲ့ type က `any` ဖြစ်ပြီး — `urlString` ရဲ့ type ကတော့ `string` ဖြစ်ပါတယ်။
ဒီနေရာမှာပဲ အမှားတွေ စတင်ပါတယ် — `any` က တခြား types တွေနဲ့ ထိတွေ့ဆက်ဆံရာမှာ သိပ်ကို ပျံ့နှံ့လွယ်တဲ့ (infectious) သဘောရှိလို့ပါ။
`any | string` ဆိုတဲ့ union ကို `any` အဖြစ် ရိုးရှင်းအောင် လုပ်လိုက်တာမို့ — ကျွန်တော်တို့ရဲ့ `return` statement ထဲက expression က မျှော်လင့်ထားတဲ့ `URL` return type နဲ့ compatible ဖြစ်မဖြစ် TypeScript စတင် check လုပ်တဲ့အချိန်မှာ — type system က ဒီ code ထဲက bug ကို ဖမ်းမိနိုင်မယ့် အချက်အလက် အားလုံး ဆုံးရှုံးသွားပါပြီ။

TypeScript 5.8 မှာ — type system က `return` statements တွေရဲ့ အတွင်းထဲမှာ တိုက်ရိုက်ရှိတဲ့ conditional expressions တွေကို အထူးကိုင်တွယ်မှု (special-case) ပြုလုပ်ပါတယ်။
Conditional ရဲ့ branch တစ်ခုချင်းစီကို — ပါဝင်ပတ်သက်နေတဲ့ function ရဲ့ ကြေညာထားတဲ့ return type (ရှိခဲ့ရင်) နဲ့ တိုက်စစ်ပါတယ် — အဲဒါကြောင့် အပေါ်က ဥပမာထဲက bug ကို type system က ဖမ်းမိနိုင်ပါပြီ။

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
    //  ~~~~~~~~~
    // error! Type 'string' is not assignable to type 'URL'.
}
```

ဒီပြောင်းလဲမှုကို [ဒီ pull request](https://github.com/microsoft/TypeScript/pull/56941) အတွင်းမှာ — TypeScript အတွက် ပိုကျယ်ပြန့်တဲ့ အနာဂတ် တိုးတက်မှု set တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ ပြုလုပ်ခဲ့ပါတယ်။

## Support for `require()` of ECMAScript Modules in `--module nodenext` (--module nodenext အောက်တွင် ECMAScript Modules များ၏ `require()` ပံ့ပိုးမှု)

နှစ်ပေါင်းများစွာကြာအောင် Node.js က CommonJS modules တွေနဲ့အတူ ECMAScript modules (ESM) တွေကိုပါ ပံ့ပိုးပေးခဲ့ပါတယ်။
ကံမကောင်းစွာပဲ — နှစ်ခုကြားက interoperability (အပြန်အလှန် အသုံးပြုနိုင်မှု) မှာ စိန်ခေါ်မှုတွေ ရှိခဲ့ပါတယ်။

* ESM files တွေက CommonJS files တွေကို `import` လုပ်နိုင်ခဲ့တယ်
* CommonJS files တွေကတော့ ESM files တွေကို `require()` လုပ်လို့ ***မရခဲ့ဘူး***

တစ်နည်းပြောရရင် — ESM files တွေကနေ CommonJS files တွေကို သုံးစွဲတာ ဖြစ်နိုင်ခဲ့ပေမယ့် — ပြောင်းပြန်ကတော့ မဖြစ်နိုင်ပါဘူး။
ဒါက ESM ပံ့ပိုးမှု ပေးချင်တဲ့ library author တွေအတွက် စိန်ခေါ်မှုများစွာ ဖြစ်ပေါ်စေခဲ့ပါတယ်။
ဒီ library author တွေက — CommonJS သုံးစွဲသူတွေနဲ့ compatibility ကို ချိုးဖျက်ရမယ်၊ ဒါမှမဟုတ် သူတို့ရဲ့ libraries တွေကို "dual-publish" (ESM နဲ့ CommonJS အတွက် သီးခြား entry-point တွေ ပေးတာ) လုပ်ရမယ်၊ ဒါမှမဟုတ် CommonJS ပေါ်မှာပဲ အချိန်အကန့်အသတ်မရှိ ဆက်နေရမယ် — ဒီထဲက တစ်ခုခုကို ရွေးချယ်ရပါတော့မယ်။
Dual-publishing က ကောင်းမွန်တဲ့ အလယ်အလတ်နည်းလမ်းတစ်ခုလို ထင်ရနိုင်ပေမယ့် — ရှုပ်ထွေးပြီး error ဖြစ်လွယ်တဲ့ လုပ်ငန်းစဉ်တစ်ခုဖြစ်ကာ — package တစ်ခုအတွင်းက code ပမာဏကိုလည်း အကြမ်းဖျင်း နှစ်ဆခန့် တိုးစေပါတယ်။

Node.js 22 က ဒီကန့်သတ်ချက်တစ်ချို့ကို ဖြေလျှော့ပေးပြီး — CommonJS modules တွေကနေ ECMAScript modules တွေဆီ `require("esm")` ခေါ်ဆိုမှုတွေကို ခွင့်ပြုပါတယ်။
Node.js က top-level `await` ပါဝင်တဲ့ ESM files တွေအပေါ် `require()` လုပ်တာကိုတော့ ဆက်လက် ခွင့်မပြုသေးပါဘူး — ဒါပေမယ့် တခြား ESM files တွေအများစုကို CommonJS files တွေကနေ ယခုဆို သုံးစွဲနိုင်ပါပြီ။
ဒါက library author တွေအတွက် — dual-publish လုပ်စရာမလိုဘဲ ESM ပံ့ပိုးမှု ပေးနိုင်တဲ့ အခွင့်အလမ်းကြီးတစ်ခု ဖြစ်လာစေပါတယ်။

TypeScript 5.8 က ဒီအပြုအမူကို `--module nodenext` flag အောက်မှာ ပံ့ပိုးပေးပါတယ်။
`--module nodenext` ဖွင့်ထားတဲ့အခါ — TypeScript က ESM files တွေဆီ ဒီ `require()` ခေါ်ဆိုမှုတွေအပေါ် errors တွေ ထုတ်ပြန်တာကို ရှောင်ကြဉ်ပါလိမ့်မယ်။

ဒီ feature က Node.js ရဲ့ ဗားရှင်းအဟောင်းတွေဆီပါ back-port (နောက်ကြောင်းပြန် သယ်ဆောင်) လုပ်ခံရနိုင်တာမို့ — ဒီအပြုအမူကို ဖွင့်ပေးတဲ့ တည်ငြိမ်တဲ့ `--module nodeXXXX` option ဆိုတာ လက်ရှိမှာ မရှိသေးပါဘူး။
ဒါပေမယ့် TypeScript ရဲ့ အနာဂတ် ဗားရှင်းတွေမှာတော့ — `node20` အောက်မှာ ဒီ feature ကို တည်ငြိမ်အောင် လုပ်နိုင်လိမ့်မယ်လို့ ကျွန်တော်တို့ ခန့်မှန်းပါတယ်။
ထိုအတောအတွင်းမှာ — Node.js 22 နဲ့ ၎င်းထက်အသစ် သုံးနေသူတွေက `--module nodenext` ကို သုံးဖို့ အားပေးပြီး — library author တွေနဲ့ Node.js ဗားရှင်းအဟောင်း သုံးစွဲသူတွေကတော့ `--module node16` ပေါ်မှာ ဆက်နေသင့်ပါတယ် (ဒါမှမဟုတ် [`--module node18`](#--module-node18) ဆီ အသေးစား update လုပ်နိုင်ပါတယ်)။

နောက်ထပ် အချက်အလက်တွေအတွက် — [`require("esm")` အတွက် ကျွန်တော်တို့ရဲ့ ပံ့ပိုးမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/60761)။

## `--module node18`

TypeScript 5.8 က တည်ငြိမ်တဲ့ `--module node18` flag တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။
Node.js 18 ကိုပဲ ပုံသေ သုံးနေတဲ့ သုံးစွဲသူတွေအတွက် — ဒီ flag က `--module nodenext` ထဲမှာ ပါဝင်တဲ့ အပြုအမူအချို့ မပါဝင်တဲ့ တည်ငြိမ်တဲ့ ရည်ညွှန်းချက် (point of reference) တစ်ခုကို ပေးပါတယ်။
အထူးသဖြင့်:

* `node18` အောက်မှာ ECMAScript modules တွေကို `require()` လုပ်တာ တားမြစ်ထားပြီး — `nodenext` အောက်မှာတော့ ခွင့်ပြုပါတယ်
* import assertions တွေ (import attributes တွေကို ဦးစားပေးလို့ deprecate လုပ်ထားတဲ့ဟာတွေ) က `node18` အောက်မှာ ခွင့်ပြုထားပြီး — `nodenext` အောက်မှာတော့ တားမြစ်ပါတယ်

နောက်ထပ် အသေးစိတ်ကို [`--module node18` pull request](https://github.com/microsoft/TypeScript/pull/60722) နဲ့ [`--module nodenext` မှာ ပြုလုပ်ထားတဲ့ ပြောင်းလဲမှုများ](https://github.com/microsoft/TypeScript/pull/60761) နှစ်ခုလုံးမှာ ကြည့်နိုင်ပါတယ်။

## The `--erasableSyntaxOnly` Option (--erasableSyntaxOnly Option အကြောင်း)

မကြာသေးမီက Node.js 23.6 က [TypeScript files တွေကို တိုက်ရိုက် run လုပ်တာအတွက် experimental support](https://nodejs.org/api/typescript.html#type-stripping) ကို unflagged (flag မလိုတော့အောင်) ပြုလုပ်ခဲ့ပါတယ် — ဒါပေမယ့် ဒီ mode အောက်မှာ အချို့သော constructs တွေကိုပဲ ပံ့ပိုးပါတယ်။
Node.js က `--experimental-strip-types` လို့ခေါ်တဲ့ mode တစ်ခုကို unflag လုပ်ထားပြီး — အဲဒီ mode မှာ TypeScript-specific syntax တစ်ခုခုက runtime semantics (runtime အဓိပ္ပာယ်သတ်မှတ်ချက်တွေ) မရှိရဘူးလို့ လိုအပ်ပါတယ်။
တစ်နည်းပြောရရင် — file တစ်ခုကနေ TypeScript-specific syntax တွေကို လွယ်လွယ်ကူကူ *ဖျက်ပစ် (erase)* နိုင် ဒါမှမဟုတ် "ချွတ်ထုတ် (strip out)" နိုင်ရမှာ ဖြစ်ပြီး — တရားဝင်တဲ့ JavaScript file တစ်ခု ကျန်ရစ်ခဲ့ရပါတယ်။

ဆိုလိုတာက အောက်ပါလိုမျိုး constructs တွေကို မပံ့ပိုးပါဘူး:

* `enum` declarations တွေ
* runtime code ပါတဲ့ `namespace`s နဲ့ `module`s တွေ
* classes တွေထဲက parameter properties တွေ
* ECMAScript မဟုတ်တဲ့ `import =` နဲ့ `export =` assignments တွေ

အလုပ်မလုပ်တဲ့ ဥပမာတစ်ချို့ ဒီမှာ ပါပါတယ်:

```ts
// ❌ error: An `import ... = require(...)` alias
import foo = require("foo");

// ❌ error: A namespace with runtime code.
namespace container {
}

// ❌ error: An `import =` alias
import Bar = container.Bar;

class Point {
    // ❌ error: Parameter properties
    constructor(public x: number, public y: number) { }
}

// ❌ error: An `export =` assignment.
export = Point;

// ❌ error: An enum declaration.
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

[ts-blank-space](https://github.com/bloomberg/ts-blank-space) ဒါမှမဟုတ် [Amaro](https://github.com/nodejs/amaro) (Node.js ထဲက type-stripping အတွက် အခြေခံ library) လိုမျိုး အလားတူ tools တွေမှာလည်း ဒီအတိုင်း ကန့်သတ်ချက်တွေ ရှိပါတယ်။
ဒီ tools တွေက ဒီလိုအပ်ချက်တွေနဲ့ မကိုက်ညီတဲ့ code တွေ့ရင် အထောက်အကူဖြစ်စေမယ့် error messages တွေ ပေးပါလိမ့်မယ် — ဒါပေမယ့် ကိုယ့် code အလုပ်မလုပ်ဘူးဆိုတာကို တကယ် run ကြည့်တဲ့အခါကျမှသာ သိရမှာ ဖြစ်ပါတယ်။

ဒါကြောင့်ပဲ TypeScript 5.8 က `--erasableSyntaxOnly` flag ကို မိတ်ဆက်လိုက်တာပါ။
ဒီ flag ဖွင့်ထားတဲ့အခါ — TypeScript က runtime behavior ရှိတဲ့ TypeScript-specific constructs အများစုအပေါ်မှာ error ထုတ်ပေးပါလိမ့်မယ်။
```ts
class C {
    constructor(public x: number) { }
    //          ~~~~~~~~~~~~~~~~
    // error! This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
    }
}
```

ပုံမှန်အားဖြင့် — ဒီ flag ကို `--verbatimModuleSyntax` နဲ့ တွဲသုံးချင်ကြပါလိမ့်မယ် — အဲဒါက module တစ်ခုမှာ သင့်လျော်တဲ့ import syntax ပါဝင်ကြောင်းနဲ့ — import elision (import တွေကို ဖျောက်ဖျက်ပစ်ခြင်း) မဖြစ်ပွားကြောင်း သေချာစေပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementation ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/61011)။

## The `--libReplacement` Flag (--libReplacement Flag အကြောင်း)

TypeScript 4.5 မှာ — ကျွန်တော်တို့က default `lib` files တွေအစား custom files တွေနဲ့ အစားထိုးနိုင်တဲ့ ဖြစ်နိုင်ခြေကို မိတ်ဆက်ခဲ့ပါတယ်။
ဒါက `@typescript/lib-*` လို့ အမည်ရတဲ့ packages တွေကနေ library file တစ်ခုကို resolve လုပ်နိုင်တာကို အခြေခံထားပါတယ်။
ဥပမာ — အောက်ပါ `package.json` နဲ့ [the `@types/web` package](https://www.npmjs.com/package/@types/web?activeTab=readme) ရဲ့ သီးခြား version တစ်ခုပေါ်ကို ကိုယ့်ရဲ့ `dom` libraries တွေကို lock လုပ်ထားနိုင်ပါတယ်:

```json
{
    "devDependencies": {
       "@typescript/lib-dom": "npm:@types/web@0.0.199"
     }
}
```

Install လုပ်လိုက်တဲ့အခါ — `@typescript/lib-dom` လို့ခေါ်တဲ့ package တစ်ခု တည်ရှိလာပြီး — ကိုယ့်ရဲ့ settings တွေအရ `dom` ပါဝင်နေတဲ့အခါ TypeScript က လက်ရှိမှာ အဲဒါကို အမြဲတမ်း ရှာဖွေပါလိမ့်မယ်။

ဒါက စွမ်းဆောင်နိုင်မှု မြင့်မားတဲ့ feature တစ်ခုပါ — ဒါပေမယ့် အပိုအလုပ် အနည်းငယ်လည်း ဖြစ်ပေါ်စေပါတယ်။
ဒီ feature ကို မသုံးဘူးဆိုတာတောင် — TypeScript က ဒီ lookup ကို အမြဲ လုပ်ဆောင်ပြီး — `lib`-replacement package တစ်ခု *စတင်တည်ရှိလာ* နိုင်တဲ့အတွက် `node_modules` ထဲက ပြောင်းလဲမှုတွေကိုလည်း စောင့်ကြည့်ရပါတယ်။

TypeScript 5.8 က ဒီအပြုအမူကို disable လုပ်ခွင့်ပေးတဲ့ `--libReplacement` flag ကို မိတ်ဆက်ပါတယ်။
`--libReplacement` ကို မသုံးဘူးဆိုရင် — အခုဆို `--libReplacement false` နဲ့ disable လုပ်ထားနိုင်ပါတယ်။
အနာဂတ်မှာ `--libReplacement false` က default ဖြစ်လာနိုင်လို့ — လက်ရှိ ဒီအပြုအမူပေါ်ကို အားထားနေရသူတွေက — `--libReplacement true` နဲ့ တိတိကျကျ enable လုပ်ထားဖို့ စဉ်းစားသင့်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/61023)။

## Preserved Computed Property Names in Declaration Files (Declaration Files များတွင် Computed Property Names ထိန်းသိမ်းခံရခြင်း)

Declaration files တွေမှာ computed properties တွေရဲ့ emit ကို ပိုပြီး ခန့်မှန်းရလွယ်အောင် ပြုလုပ်ဖို့ အားထုတ်မှုအနေနဲ့ — TypeScript 5.8 က classes တွေထဲက computed property names တွေမှာ entity names (`bareVariables` နဲ့ `dotted.names.that.look.like.this` လိုမျိုး) တွေကို တသမတ်တည်း ထိန်းသိမ်းပေးပါလိမ့်မယ်။

ဥပမာ — အောက်ပါ code ကို သုံးသပ်ကြည့်ပါ:

```ts
export let propName = "theAnswer";

export class MyClass {
    [propName] = 42;
//  ~~~~~~~~~~
// error!
// A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
}
```

TypeScript ရဲ့ ဗားရှင်းအဟောင်းတွေက ဒီ module အတွက် declaration file တစ်ခု ထုတ်လုပ်တဲ့အခါ error ထုတ်ပြန်ပြီး — best-effort (အတတ်နိုင်ဆုံး) declaration file မှာဆိုရင် index signature တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။

```ts
export declare let propName: string;
export declare class MyClass {
    [x: string]: number;
}
```

TypeScript 5.8 မှာ — ဒီဥပမာ code ကို ယခုဆို ခွင့်ပြုပြီး — emit လုပ်လိုက်တဲ့ declaration file က ကိုယ်ရေးထားတာနဲ့ ကိုက်ညီပါလိမ့်မယ်:

```ts
export declare let propName: string;
export declare class MyClass {
    [propName]: number;
}
```

ဒါက class ပေါ်မှာ statically-named properties တွေကို ဖန်တီးပေးတာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။
ထိရောက်စွာ index signature နဲ့ တူတဲ့ `[x: string]: number` ပုံစံမျိုးပဲ ရှိနေဦးမှာ ဖြစ်လို့ — အဲဒီ use case အတွက်တော့ `unique symbol`s တွေ ဒါမှမဟုတ် literal types တွေကို သုံးဖို့ လိုပါလိမ့်မယ်။

ဒီ code ကိုရေးတာက `--isolatedDeclarations` flag အောက်မှာ အရင်ကလည်း error ဖြစ်ခဲ့ပြီး — လက်ရှိမှာလည်း error ဖြစ်နေတယ်ဆိုတာ သတိပြုပါ။
ဒါပေမယ့် ဒီပြောင်းလဲမှုရဲ့ အကျိုးဆက်အနေနဲ့ — declaration emit မှာ computed property names တွေကို ယေဘုယျအားဖြင့် ခွင့်ပြုလာလိမ့်မယ်လို့ ကျွန်တော်တို့ မျှော်လင့်ပါတယ်။

TypeScript 5.8 မှာ compile လုပ်ထားတဲ့ file တစ်ခုက — TypeScript 5.7 ဒါမှမဟုတ် အစောပိုင်း ဗားရှင်းတွေမှာ backward compatible မဖြစ်တဲ့ declaration file တစ်ခုကို ထုတ်ပေးနိုင်တာ (ဖြစ်နိုင်ခြေ နည်းပေမယ့်) ဖြစ်နိုင်တယ်ဆိုတာလည်း သတိပြုပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing PR ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/60052)။

## Optimizations on Program Loads and Updates (Program Loads နှင့် Updates များအပေါ် Optimizations)

TypeScript 5.8 က optimization တွေ အများအပြားကို မိတ်ဆက်ပြီး — ၎င်းတို့က program တစ်ခု တည်ဆောက်ရတဲ့ အချိန်ကိုရော — `--watch` mode ဒါမှမဟုတ် editor အခြေအနေတွေမှာ file တစ်ခု ပြောင်းလဲမှုအပေါ် အခြေခံပြီး program တစ်ခုကို update လုပ်ရတဲ့ အချိန်ကိုပါ တိုးတက်စေနိုင်ပါတယ်။

ပထမဆုံး — TypeScript က ယခုဆို [paths တွေကို normalize လုပ်ရာမှာ ပါဝင်လေ့ရှိတဲ့ array allocations တွေကို ရှောင်ကြဉ်](https://github.com/microsoft/TypeScript/pull/60812) ပါတယ်။
ပုံမှန်အားဖြင့် — path normalization ဆိုတာက path တစ်ခုရဲ့ အပိုင်းတစ်ခုစီကို strings array တစ်ခုအဖြစ် ပိုင်းဖြတ်ပြီး — relative segments တွေကို အခြေခံကာ ရလာတဲ့ path ကို normalize လုပ်ပြီး — canonical separator တစ်ခုသုံးပြီး ပြန်ပေါင်းစည်းတာမျိုး ပါဝင်ပါလိမ့်မယ်။
Files အများကြီးရှိတဲ့ projects တွေအတွက် — ဒါက သိသာထင်ရှားပြီး ထပ်ခါထပ်ခါ လုပ်ရတဲ့ အလုပ်ပမာဏတစ်ခု ဖြစ်နိုင်ပါတယ်။
TypeScript က ယခုဆို array တစ်ခုကို allocate လုပ်တာကို ရှောင်ပြီး — မူရင်း path ရဲ့ indexes တွေပေါ်မှာ ပိုတိုက်ရိုက် လုပ်ဆောင်ပါတယ်။

ထို့ပြင် — project တစ်ခုရဲ့ အခြေခံဖွဲ့စည်းပုံကို မပြောင်းလဲစေတဲ့ edits တွေ လုပ်တဲ့အခါ — TypeScript က ယခုဆို [သူ့ဆီ ပေးထားတဲ့ options တွေကို ပြန်လည် validate လုပ်တာကို ရှောင်ကြဉ်](https://github.com/microsoft/TypeScript/pull/60754) ပါတယ် (ဥပမာ — `tsconfig.json` ရဲ့ အကြောင်းအရာတွေ)။
ဆိုလိုတာက — ဥပမာ ရိုးရှင်းတဲ့ edit တစ်ခုက project တစ်ခုရဲ့ output paths တွေက input paths တွေနဲ့ မဆန့်ကျင်ဘူးဆိုတာ စစ်ဆေးဖို့ မလိုအပ်တော့ဘူးလို့ ဆိုလိုပါတယ်။
အဲဒီအစား — နောက်ဆုံး check ရဲ့ ရလဒ်တွေကို သုံးနိုင်ပါတယ်။
ဒါက project ကြီးတွေထဲက edits တွေကို ပိုတုံ့ပြန်မှု မြန်ဆန်တယ်လို့ ခံစားရစေပါလိမ့်မယ်။

## Notable Behavioral Changes (သတိပြုသင့်သော Behavioral Changes များ)

ဒီ section က — upgrade တိုင်းရဲ့ အစိတ်အပိုင်းအနေနဲ့ အသိအမှတ်ပြု နားလည်ထားသင့်တဲ့ မှတ်သားလောက်တဲ့ ပြောင်းလဲမှု set တစ်ခုကို မီးမောင်းထိုးပြပါတယ်။
တစ်ခါတလေ deprecations တွေ၊ removals တွေနဲ့ ကန့်သတ်ချက်အသစ်တွေကိုလည်း မီးမောင်းထိုးပြပါလိမ့်မယ်။
ပြီးတော့ — functional အရ တိုးတက်မှုတွေဖြစ်တဲ့ bug fixes တွေလည်း ပါဝင်နိုင်ပါတယ် — ဒါပေမယ့် ၎င်းတို့က errors အသစ်တွေ မိတ်ဆက်ခြင်းအားဖြင့် ရှိပြီးသား build တစ်ခုကိုလည်း ထိခိုက်စေနိုင်ပါတယ်။

### `lib.d.ts`

DOM အတွက် ထုတ်ပေးတဲ့ Types တွေက ကိုယ့် codebase ရဲ့ type-checking အပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီ TypeScript ဗားရှင်းအတွက် DOM နဲ့ `lib.d.ts` updates တွေနဲ့ ဆက်စပ်တဲ့ linked issues တွေကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/60985)။

### Restrictions on Import Assertions Under `--module nodenext` (--module nodenext အောက်တွင် Import Assertions များအပေါ် ကန့်သတ်ချက်များ)

Import assertions တွေက import တစ်ခုရဲ့ အချို့သော ဂုဏ်သတ္တိတွေကို သေချာစေဖို့ (ဥပမာ — "ဒီ module က JSON ဖြစ်ပြီး — executable JavaScript code အဖြစ် ရည်ရွယ်ထားတာ မဟုတ်ဘူး") ECMAScript ဆီ အဆိုပြုထားတဲ့ ထပ်တိုးမှုတစ်ခု ဖြစ်ခဲ့ပါတယ်။
သူတို့ကို [import attributes](https://github.com/tc39/proposal-import-attributes) လို့ခေါ်တဲ့ proposal တစ်ခုအနေနဲ့ ပြန်လည် ပုံဖော်ခဲ့ပါတယ်။
အဲဒီကူးပြောင်းမှုရဲ့ အစိတ်အပိုင်းအနေနဲ့ — `assert` keyword သုံးတာကနေ `with` keyword သုံးတာဆီ ပြောင်းလဲခဲ့ပါတယ်။

```ts
// An import assertion ❌ - not future-compatible with most runtimes.
import data from "./data.json" assert { type: "json" };

// An import attribute ✅ - the preferred way to import a JSON file.
import data from "./data.json" with { type: "json" };
```

Node.js 22 က `assert` syntax သုံးထားတဲ့ import assertions တွေကို လက်မခံတော့ပါဘူး။
အဲဒါကြောင့် — TypeScript 5.8 မှာ `--module nodenext` ဖွင့်ထားတဲ့အခါ — TypeScript က import assertion တစ်ခုကို တွေ့ရင် error ထုတ်ပေးပါလိမ့်မယ်။

```ts
import data from "./data.json" assert { type: "json" };
//                             ~~~~~~
// error! Import assertions have been replaced by import attributes. Use 'with' instead of 'assert'
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/60761)
