---
title: "Namespaces (Namespace များ)"
description: "namespaces (ယခင် \"internal modules\") သုံးပြီး TypeScript code ကို စနစ်တကျ စုစည်းခြင်း — string validators ဥပမာ, multi-file namespaces, aliases, ambient namespaces အထိ"
order: 60
source: "https://www.typescriptlang.org/docs/handbook/namespaces.html"
status: translated
updated: 2026-09-05
---

> **ဝေါဟာရအသုံးအနှုန်း မှတ်ချက်:**
> TypeScript 1.5 မှာ ဝေါဟာရတွေ ပြောင်းလဲသွားတယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။
> "Internal modules" တွေကို အခု "namespaces" လို့ ခေါ်ပါတယ်။
> "External modules" တွေကိုတော့ [ECMAScript 2015](https://www.ecma-international.org/ecma-262/6.0/) ရဲ့ ဝေါဟာရနဲ့ ကိုက်ညီအောင် — အခု ရိုးရိုး "modules" လို့ပဲ ခေါ်ပါတယ် (ဆိုလိုတာက `module X {` ဆိုတာက အခု ဦးစားပေး သုံးနေတဲ့ `namespace X {` နဲ့ ညီမျှပါတယ်)။

ဒီ post က TypeScript မှာ namespaces (ယခင် "internal modules") တွေသုံးပြီး — သင့် code ကို စနစ်တကျ စုစည်းနိုင်တဲ့ နည်းလမ်းအမျိုးမျိုးကို အကျဉ်းချုပ် ဖော်ပြထားပါတယ်။
ဝေါဟာရအကြောင်း မှတ်ချက်ထဲမှာ အရိပ်အမြွက် ပြောခဲ့သလို — "internal modules" တွေကို အခု "namespaces" လို့ ရည်ညွှန်းပါတယ်။
ဒါ့အပြင် — internal module တစ်ခုကို ကြေညာတုန်းက `module` keyword သုံးခဲ့တဲ့ နေရာတိုင်းမှာ — အခု `namespace` keyword ကို အစားထိုး သုံးနိုင်ပြီး သုံးသင့်ပါတယ်။
ဒါက အလားတူအမည်တွေနဲ့ ဝန်ပိုစေပြီး — အသစ်ဝင်လာတဲ့ သုံးစွဲသူတွေကို ရှုပ်ထွေးစေတာမျိုး ရှောင်ရှားနိုင်ပါတယ်။

## First steps (ပထမအဆင့်များ)

ဒီ page တစ်လျှောက်လုံး ဥပမာအဖြစ် သုံးမယ့် program လေးကနေ စလိုက်ရအောင်။
Webpage တစ်ခုပေါ်က form တစ်ခုမှာ သုံးစွဲသူရဲ့ input ကို စစ်ဆေးဖို့ (သို့) အပြင်ကပေးတဲ့ data file တစ်ခုရဲ့ format ကို စစ်ဆေးဖို့ ရေးသလိုမျိုး — ရိုးရှင်းတဲ့ string validators (စာသားများ မှန်မမှန် စစ်ဆေးကိရိယာများ) အစုလေး တစ်ခုကို ရေးထားပါတယ်။

## Validators in a single file (File တစ်ခုတည်းထဲက Validators)

```ts
interface StringValidator {
  isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```

## Namespacing (Namespace ပြုလုပ်ခြင်း)

Validators တွေ ထပ်တိုးလာတာနဲ့အမျှ — ကျုပ်တို့ရဲ့ types တွေကို ခြေရာခံနိုင်ဖို့ နဲ့ တခြား objects တွေနဲ့ နာမည်တူ ထိပ်တိုက်တွေ့မှုတွေ (name collisions) မဖြစ်အောင် — စနစ်တကျ စုစည်းမှုပုံစံ (organization scheme) တစ်မျိုးမျိုး လိုချင်လာပါတယ်။
အမည်အမျိုးမျိုးကို global namespace ထဲကို တိုက်ရိုက် ထည့်မယ့်အစား — ကျုပ်တို့ရဲ့ objects တွေကို namespace တစ်ခုထဲ ထည့်ပတ်လိုက်ရအောင်။

ဒီဥပမာမှာ — validator နဲ့ဆိုင်တဲ့ အရာအားလုံးကို `Validation` ဆိုတဲ့ namespace တစ်ခုထဲကို ရွှေ့ပြောင်းပါမယ်။
ဒီက interfaces နဲ့ classes တွေကို namespace အပြင်ဘက်ကနေ မြင်နိုင်စေချင်လို့ — သူတို့ကို `export` နဲ့ ရှေ့ဆုံးက ကြေညာပါတယ်။
အပြန်အလှန်အနေနဲ့ — `lettersRegexp` နဲ့ `numberRegexp` variable တွေက implementation အသေးစိတ်တွေ ဖြစ်လို့ — export မလုပ်ဘဲ ထားပြီး namespace အပြင်ဘက်က code တွေကို မမြင်ရအောင် ပြုလုပ်ထားပါတယ်။
File ရဲ့ အောက်ဆုံးက test code ထဲမှာတော့ — namespace အပြင်ဘက်မှာ types တွေရဲ့ နာမည်တွေကို သုံးတဲ့အခါ — ဥပမာ `Validation.LettersOnlyValidator` ဆိုပြီး အရည်အချင်းပြည့်ဝအောင် (qualify) လုပ်ပေးဖို့ လိုပါတယ်။

## Namespaced Validators (Namespace သုံးထားသော Validators)

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

## Splitting Across Files (File များစွာကို ခွဲခြင်း)

ကျုပ်တို့ရဲ့ application ကြီးထွားလာတာနဲ့အမျှ — ထိန်းသိမ်းရ လွယ်ကူအောင် code ကို file အများကြီးပေါ် ခွဲထားချင်လာပါလိမ့်မယ်။

## Multi-file namespaces (File ပေါင်းများစွာ ပါဝင်သော Namespaces)

ဒီမှာတော့ — ကျုပ်တို့ရဲ့ `Validation` namespace ကို file အများကြီးပေါ်မှာ ခွဲထားပါမယ်။
File တွေ သီးခြားစီ ဖြစ်နေပေမယ့် — တစ်ခုချင်းစီက တူညီတဲ့ namespace ထဲကို ပါဝင်ပံ့ပိုးနိုင်ပြီး — အားလုံးကို နေရာတစ်ခုတည်းမှာ သတ်မှတ်ထားသလိုမျိုး သုံးစွဲနိုင်ပါတယ်။
File တွေကြားမှာ dependencies တွေ ရှိတာမို့ — file တွေကြားက ဆက်စပ်မှုတွေကို compiler ကို ပြောပြဖို့ reference tags တွေ ထည့်ပါမယ်။
ကျုပ်တို့ရဲ့ test code ကတော့ ကျန်တာတွေ မပြောင်းလဲပါဘူး။

##### Validation.ts

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

##### LettersOnlyValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

##### ZipCodeValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

##### Test.ts

```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

File အများကြီး ပါဝင်လာပြီဆိုရင် — compile လုပ်ပြီးသား code အားလုံး load ဖြစ်အောင် သေချာလုပ်ဖို့ လိုပါတယ်။
အဲဒီလို လုပ်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်။

ပထမနည်းလမ်းက — [`outFile`](https://www.typescriptlang.org/tsconfig) option ကို သုံးပြီး input files အားလုံးကို JavaScript output file တစ်ခုတည်းထဲ ပေါင်းစပ် (concatenated output) လုပ်တာပါ:

```Shell
tsc --outFile sample.js Test.ts
```

Compiler က files တွေထဲမှာ ပါတဲ့ reference tags တွေကို အခြေခံပြီး output file ထဲက အစီအစဉ်ကို အလိုအလျောက် စီစဉ်ပေးပါတယ်။ File တစ်ခုချင်းစီကို ကိုယ်တိုင် သတ်မှတ်လည်း ရပါတယ်:

```Shell
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

တနည်းအားဖြင့် — input file တစ်ခုချင်းစီအတွက် JavaScript file တစ်ခုစီ ထုတ်ပေးတဲ့ per-file compilation (default) ကို သုံးနိုင်ပါတယ်။
JS files အများကြီး ထွက်လာရင် — ကျုပ်တို့ရဲ့ webpage ပေါ်မှာ `<script>` tags တွေကို သုံးပြီး — ထွက်လာတဲ့ file တစ်ခုချင်းစီကို သင့်တင့်တဲ့ အစီအစဉ်အတိုင်း load လုပ်ဖို့ လိုပါတယ်။ ဥပမာ:

##### MyTestPage.html (excerpt) (နမူနာ ကောက်နုတ်ချက်)

```html
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```

## Aliases (Alias များ)

Namespaces တွေနဲ့ အလုပ်လုပ်ရတာ ပိုလွယ်ကူအောင် လုပ်နိုင်တဲ့ နောက်တစ်နည်းက — မကြာခဏ သုံးရတဲ့ objects တွေအတွက် နာမည်တိုတွေ ဖန်တီးဖို့ `import q = x.y.z` ကို သုံးတာပါ။
Modules တွေ load လုပ်ဖို့ သုံးတဲ့ `import x = require("name")` syntax နဲ့ မရောထွေးစေဖို့ သတိပြုပါ — ဒီ syntax က သတ်မှတ်ထားတဲ့ symbol အတွက် alias (နာမည်တို) တစ်ခုကို ရိုးရိုးရှင်းရှင်း ဖန်တီးပေးတာပါ။
ဒီလို imports (alias တွေလို့ အများအားဖြင့် ခေါ်ကြပါတယ်) တွေကို — module imports ကနေ ဖန်တီးထားတဲ့ objects တွေ အပါအဝင် — identifier မှန်သမျှ အတွက် သုံးနိုင်ပါတယ်။

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```

ဒီမှာ `require` keyword ကို မသုံးဘူးဆိုတာ သတိပြုပါ — အဲဒီအစား ကျုပ်တို့ import လုပ်နေတဲ့ symbol ရဲ့ qualified name ကနေ တိုက်ရိုက် assign လုပ်ပါတယ်။
ဒါက `var` သုံးတာနဲ့ ဆင်ပေမယ့် — import လုပ်ထားတဲ့ symbol ရဲ့ type နဲ့ namespace အဓိပ္ပါယ်တွေမှာပါ အလုပ်လုပ်ပါတယ်။
အရေးကြီးတာက — values တွေအတွက်ဆိုရင် `import` က မူရင်း symbol နဲ့ သီးခြား reference တစ်ခု ဖြစ်လို့ — alias လုပ်ထားတဲ့ `var` တစ်ခုကို ပြောင်းလိုက်ရင် မူရင်း variable ထဲမှာ ပြောင်းလဲမှု ထင်ဟပ်မှာ မဟုတ်ပါဘူး။

## Working with Other JavaScript Libraries (အခြား JavaScript Libraries များနဲ့ အလုပ်လုပ်ခြင်း)

TypeScript နဲ့ မရေးထားတဲ့ libraries တွေရဲ့ ပုံသဏ္ဌာန် (shape) ကို ဖော်ပြဖို့ — အဲဒီ library က ထုတ်ဖော်ပေးတဲ့ API ကို ကြေညာပေးဖို့ လိုပါတယ်။
JavaScript libraries အများစုက top-level objects အနည်းငယ်ကိုပဲ ထုတ်ဖော်ပေးတာမို့ — namespaces တွေက သူတို့ကို ကိုယ်စားပြုဖို့ ကောင်းမွန်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။

Implementation (အကောင်အထည်ဖော်မှု) မပါဝင်ဘဲ ကြေညာချက်သက်သက်ပဲ ပါတဲ့ declarations တွေကို "ambient" လို့ ခေါ်ပါတယ်။
ပုံမှန်အားဖြင့် ဒါတွေကို `.d.ts` files တွေထဲမှာ သတ်မှတ်ပါတယ်။
C/C++ နဲ့ အကျွမ်းဝင်ရင် — ဒါတွေကို `.h` files တွေလိုမျိုး ထင်မှတ်နိုင်ပါတယ်။
ဥပမာ အနည်းငယ် ကြည့်ကြည့်ရအောင်။

## Ambient Namespaces (Ambient Namespaces များ)

လူကြိုက်များတဲ့ D3 library က သူ့ရဲ့ လုပ်ဆောင်ချက်တွေကို `d3` ဆိုတဲ့ global object တစ်ခုထဲမှာ သတ်မှတ်ပါတယ်။
ဒီ library ကို module loader အစား `<script>` tag ကနေ load လုပ်တာမို့ — သူ့ရဲ့ declaration က ပုံသဏ္ဌာန်ကို ဖော်ပြဖို့ namespaces တွေကို သုံးပါတယ်။
ဒီပုံသဏ္ဌာန်ကို TypeScript compiler က မြင်နိုင်ဖို့ — ကျုပ်တို့က ambient namespace declaration တစ်ခု သုံးပါတယ်။
ဥပမာ — အောက်ပါအတိုင်း စရေးလို့ ရပါတယ်:

##### D3.d.ts (simplified excerpt) (ရိုးရှင်းထားသော ကောက်နုတ်ချက်)

```ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }

  export interface Event {
    x: number;
    y: number;
  }

  export interface Base extends Selectors {
    event: Event;
  }
}

declare var d3: D3.Base;
```
