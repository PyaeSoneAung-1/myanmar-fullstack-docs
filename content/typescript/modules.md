---
title: "Modules (Module များ)"
description: "Modules အကြောင်း — ES Modules နဲ့ CommonJS syntax, import/export ပုံစံတွေ, module resolution နဲ့ module output options, TypeScript namespaces"
order: 13
source: "https://www.typescriptlang.org/docs/handbook/2/modules.html"
status: translated
updated: 2026-09-01
---

JavaScript မှာ code တွေကို modular ဖြစ်အောင် ခွဲထားဖို့ နည်းလမ်းအမျိုးမျိုး သုံးခဲ့တဲ့ သမိုင်းကြောင်း ရှည်ရှည်ဝေးဝေး ရှိပါတယ်။ 2012 ကတည်းက ရှိနေတဲ့ TypeScript က ဒီ format တွေထဲက အများကြီးကို ထောက်ပံ့ပေးထားပါတယ် — ဒါပေမယ့် အချိန်ကြာလာတာနဲ့အမျှ community ရော JavaScript specification ရော ES Modules (ဒါမှမဟုတ် ES6 modules) လို့ခေါ်တဲ့ format တစ်ခုဆီ စုစည်းသွားခဲ့ပါတယ်။ သင်က ဒါကို `import`/`export` syntax အဖြစ် သိပြီးသား ဖြစ်နိုင်ပါတယ်။

ES Modules ကို 2015 ခုနှစ်မှာ JavaScript spec ထဲ ထည့်သွင်းခဲ့ပြီး — 2020 ရောက်တော့ web browser တွေနဲ့ JavaScript runtimes အများစုမှာ ကျယ်ကျယ်ပြန့်ပြန့် ထောက်ပံ့နိုင်ခဲ့ပါတယ်။

အာရုံစိုက်နိုင်ဖို့အတွက် ဒီ handbook က ES Modules ရော သူ့ရဲ့ ခေတ်စားခဲ့တဲ့ ရှေ့ပြေး CommonJS `module.exports =` syntax ကိုပါ လွှမ်းခြုံပါမယ် — တခြား module patterns တွေအကြောင်း အချက်အလက်တွေကိုတော့ reference section ထဲက [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) မှာ ရှာဖွေနိုင်ပါတယ်။

## JavaScript Modules တွေကို ဘယ်လို သတ်မှတ်လဲ

ECMAScript 2015 မှာ ဖြစ်သလိုပဲ — TypeScript မှာလည်း top-level (အမြင့်ဆုံးအဆင့်) `import` ဒါမှမဟုတ် `export` ပါဝင်တဲ့ ဖိုင်တိုင်းကို module အဖြစ် သတ်မှတ်ပါတယ်။

အပြန်အလှန်အနေနဲ့ — top-level import ဒါမှမဟုတ် export declaration လုံးဝ မပါတဲ့ ဖိုင်ကိုတော့ script အဖြစ် သဘောထားပြီး — သူ့ရဲ့ contents တွေက global scope ထဲမှာ ရနိုင်ပါတယ် (ဒါကြောင့် modules တွေအတွက်လည်း ရနိုင်ပါတယ်)။

Modules တွေက global scope ထဲမှာ မဟုတ်ဘဲ — သူတို့ကိုယ်ပိုင် scope ထဲမှာ execute လုပ်ပါတယ်။ ဆိုလိုတာက — module တစ်ခုထဲမှာ ကြေညာထားတဲ့ variables တွေ ၊ functions တွေ ၊ classes တွေ စတာတွေက export form တစ်ခုခုနဲ့ အတိအကျ export လုပ်ထားမှသာ module အပြင်ဘက်ကနေ မြင်နိုင်ပါတယ်။ အပြန်အလှန်အနေနဲ့ — တခြား module တစ်ခုကနေ export လုပ်ထားတဲ့ variable ၊ function ၊ class ၊ interface စတာတွေကို သုံးဖို့ဆိုရင် — import form တစ်ခုခုနဲ့ import လုပ်ရပါတယ်။

## Module မဟုတ်တဲ့အရာများ (Non-modules)

မစတင်ခင် — TypeScript က ဘာကို module အဖြစ် သတ်မှတ်လဲဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ JavaScript specification အရ — `import` declaration ၊ `export` ၊ ဒါမှမဟုတ် top-level `await` မပါတဲ့ JavaScript ဖိုင်တိုင်းကို module မဟုတ်ဘဲ script အဖြစ် သတ်မှတ်ရပါတယ်။

Script ဖိုင်ထဲမှာ variables တွေနဲ့ types တွေက shared global scope ထဲမှာ ရှိတယ်လို့ သတ်မှတ်ပါတယ် — ပြီးတော့ input files အများကြီးကို output file တစ်ခုတည်းအဖြစ် ပေါင်းဖို့ [`outFile`](https://www.typescriptlang.org/tsconfig#outFile) compiler option ကို သုံးမယ် ၊ ဒါမှမဟုတ် ဒီ files တွေကို load ဖို့ HTML ထဲမှာ `<script>` tags အများကြီး သုံးမယ် (မှန်ကန်တဲ့ order နဲ့!) လို့ ယူဆထားပါတယ်။

လောလောဆယ် `import` တွေရော `export` တွေရော မရှိတဲ့ ဖိုင်တစ်ခု ရှိပြီး — အဲဒါကို module အဖြစ် ဆက်ဆံစေချင်ရင် ဒီ line ကို ထည့်လိုက်ပါ:

```ts
export {};
```

ဒါက ဖိုင်ကို — ဘာမှ export မလုပ်တဲ့ module အဖြစ် ပြောင်းလဲပေးပါတယ်။ ဒီ syntax က ဘယ် module target ပဲ ဖြစ်ဖြစ် အလုပ်လုပ်ပါတယ်။

## TypeScript ထဲက Modules

> ဆက်လက်ဖတ်ရှုရန်:
> - [Impatient JS (Modules)](https://exploringjs.com/impatient-js/ch_modules.html)
> - [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

TypeScript မှာ module-based code ရေးတဲ့အခါ အဓိက သုံးချက် ထည့်သွင်းစဉ်းစားရပါတယ်:

- **Syntax**: အရာတွေကို import နဲ့ export လုပ်ဖို့ ဘယ် syntax ကို သုံးချင်လဲ?
- **Module Resolution**: module names တွေ (ဒါမှမဟုတ် paths တွေ) နဲ့ disk ပေါ်က files တွေကြားက ဆက်စပ်မှုက ဘာလဲ?
- **Module Output Target**: emit လုပ်လိုက်တဲ့ JavaScript module က ဘယ်လိုပုံစံ ဖြစ်သင့်လဲ?

### ES Module Syntax

ဖိုင်တစ်ခုက main export ကို `export default` ကတစ်ဆင့် ကြေညာနိုင်ပါတယ်:

```ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

ပြီးတော့ ဒါကို တခြားဖိုင် (`index.ts`) ထဲမှာ ဒီလို import လုပ်ပါတယ်:

```ts
import helloWorld from "./hello.js";
helloWorld();
```

Default export အပြင် — `default` ကို ချန်လှပ်ပြီး `export` ကတစ်ဆင့် variables တွေနဲ့ functions တွေကို တစ်ခုထက်ပိုပြီး export လုပ်နိုင်ပါတယ်:

```ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

ဒီဟာတွေကို တခြားဖိုင်တစ်ခုထဲမှာ `import` syntax နဲ့ သုံးလို့ရပါတယ်:

```ts
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
```

### နောက်ထပ် Import Syntax များ

`import {old as new}` လိုမျိုး format သုံးပြီး import ကို နာမည်ပြောင်းလို့ ရပါတယ်:

```ts
import { pi as π } from "./maths.js";

console.log(π);
```

အပေါ်က syntax တွေကို `import` တစ်ခုတည်းထဲမှာ ရောနှောသုံးလို့လည်း ရပါတယ် — ဒီ example မှာ `maths.ts` ဖိုင်က:

```ts
export const pi = 3.14;
export default class RandomNumberGenerator {}
```

ပြီးတော့ `app.ts` ဖိုင်ထဲမှာ — default import ရော renamed import ရော နှစ်ခုလုံးကို တွဲသုံးထားပါတယ်:

```ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;

console.log(π);
```

Export လုပ်ထားတဲ့ object တွေအားလုံးကို ယူပြီး — `* as name` ကိုသုံးပြီး namespace တစ်ခုတည်းထဲ ထည့်နိုင်ပါတယ်:

```ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
```

`import "./file"` ကိုသုံးပြီး — variables တွေ ဘာမှ ထည့်သွင်းမသုံးဘဲ ဖိုင်တစ်ခုကို import လုပ်နိုင်ပါတယ်:

```ts
import "./maths.js";

console.log("3.14");
```

ဒီကိစ္စမှာ `import` က ဘာမှ မလုပ်ပါဘူး။ ဒါပေမယ့် — `maths.ts` ထဲက code အားလုံးကို evaluate လုပ်ပြီးသား ဖြစ်ပါတယ် — အဲဒါက တခြား objects တွေကို သက်ရောက်နိုင်တဲ့ side-effects တွေကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။

#### TypeScript အတွက် သီးသန့် ES Module Syntax

Types တွေကို JavaScript values တွေအတွက် သုံးတဲ့ syntax အတိုင်းပဲ export ရော import ရော လုပ်နိုင်ပါတယ် — ဒီ example မှာ `animal.ts` ဖိုင်က:

```ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}
```

ပြီးတော့ `app.ts` ဖိုင်ထဲမှာ:

```ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript က type တစ်ခုကို import လုပ်တာ ကြေညာဖို့အတွက် concept နှစ်ခုနဲ့ `import` syntax ကို တိုးချဲ့ထားပါတယ်:

###### `import type`

ဒါက types တွေကိုပဲ _သာ_ import လုပ်နိုင်တဲ့ import statement ပါ:

```ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
```

ဥပမာအနေနဲ့ — `animal.ts` ဖိုင်ထဲမှာ type တွေရော value တစ်ခုရော ရှိပြီး:

```ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
```

`valid.ts` ဖိုင်ထဲမှာ types တွေကိုပဲ `import type` နဲ့ import လုပ်ထားတာ အဆင်ပြေပါတယ်:

```ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
```

ဒါပေမယ့် — `app.ts` ဖိုင်ထဲမှာ value တစ်ခုကို `import type` နဲ့ import လုပ်ဖို့ ကြိုးစားရင်တော့ — `createCatName` က value ဖြစ်လို့ error (1361) တက်ပါတယ်:

```ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```

###### Inline `type` Imports

TypeScript 4.5 မှာ — import တစ်ခုချင်းစီရဲ့ ရှေ့မှာ `type` ကို prefix အနေနဲ့ ထည့်ပြီး — import လုပ်ထားတဲ့ reference က type တစ်ခုဆိုတာ ဖော်ပြနိုင်ပါတယ်:

```ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

ဒီနှစ်ခု ပေါင်းလိုက်တဲ့အခါ — Babel ၊ swc ဒါမှမဟုတ် esbuild လိုမျိုး non-TypeScript transpiler တွေက ဘယ် imports တွေကို စိတ်ချလုံခြုံစွာ ဖယ်ရှားလို့ရလဲဆိုတာ သိရှိစေပါတယ်။

#### CommonJS အပြုအမူနဲ့ ES Module Syntax

TypeScript မှာ CommonJS နဲ့ AMD `require` နဲ့ _တိုက်ရိုက်_ ဆက်စပ်နေတဲ့ ES Module syntax တစ်ခု ရှိပါတယ်။ ES Module သုံးတဲ့ imports တွေက _အများအားဖြင့်_ အဲဒီ environments တွေရဲ့ `require` နဲ့ အတူတူပါပဲ — ဒါပေမယ့် ဒီ syntax က သင့် TypeScript file ထဲက code နဲ့ CommonJS output ကြားမှာ 1 နဲ့ 1 ကိုက်ညီမှု ရှိစေပါတယ်:

```ts
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

ဒီ syntax အကြောင်း ပိုမိုသိရှိဖို့ — [modules reference page](https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require) မှာ ဖတ်ရှုနိုင်ပါတယ်။

## CommonJS Syntax

CommonJS က npm ပေါ်က modules အများစု ဖြန့်ဝေတဲ့ format ပါ။ အပေါ်က ES Modules syntax နဲ့ ရေးနေရင်တောင် — CommonJS syntax က ဘယ်လို အလုပ်လုပ်လဲဆိုတာ အကျဉ်းချုပ် နားလည်ထားတာက debugging လုပ်တဲ့အခါ ပိုလွယ်ကူစေပါတယ်။

#### Exporting (Export လုပ်ခြင်း)

Identifiers တွေကို `module` လို့ခေါ်တဲ့ global ပေါ်က `exports` property ကို set လုပ်ခြင်းအားဖြင့် export လုပ်ပါတယ်:

```ts
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

ပြီးတော့ ဒီ files တွေကို `require` statement ကတစ်ဆင့် import လုပ်လို့ရပါတယ်:

```ts
const maths = require("./maths");
maths.pi;
```

ဒါမှမဟုတ် JavaScript ရဲ့ destructuring feature ကိုသုံးပြီး နည်းနည်း ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်:

```ts
const { squareTwo } = require("./maths");
squareTwo;
```

### CommonJS နဲ့ ES Modules Interop

Default import နဲ့ module namespace object import ကြားက ခြားနားချက်နဲ့ ပတ်သက်ပြီး — CommonJS နဲ့ ES Modules ကြားမှာ feature တွေ မကိုက်ညီမှု (mis-match) ရှိပါတယ်။ TypeScript မှာ constraint set နှစ်ခုကြားက ပွတ်တိုက်မှုကို လျှော့ချပေးတဲ့ [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) ဆိုတဲ့ compiler flag ရှိပါတယ်။

## TypeScript ရဲ့ Module Resolution Options

Module resolution ဆိုတာ — `import` ဒါမှမဟုတ် `require` statement ထဲက string တစ်ခုကို ယူပြီး — အဲဒီ string က ဘယ်ဖိုင်ကို ရည်ညွှန်းတယ်ဆိုတာ ဆုံးဖြတ်တဲ့ လုပ်ငန်းစဉ်ပါ။

TypeScript မှာ resolution strategy နှစ်ခု ပါဝင်ပါတယ်: Classic နဲ့ Node ။ [`module`](https://www.typescriptlang.org/tsconfig#module) compiler option က `commonjs` မဟုတ်တဲ့အခါ default ဖြစ်တဲ့ Classic က — backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် ထည့်သွင်းထားတာပါ။ Node strategy ကတော့ — `.ts` နဲ့ `.d.ts` အတွက် နောက်ထပ် checks တွေနဲ့အတူ — Node.js က CommonJS mode မှာ အလုပ်လုပ်ပုံကို ပုံတူကူးထားပါတယ်။

TypeScript ထဲက module strategy ကို လွှမ်းမိုးနိုင်တဲ့ TSConfig flags တွေ အများကြီး ရှိပါတယ်: [`moduleResolution`](https://www.typescriptlang.org/tsconfig#moduleResolution) ၊ [`baseUrl`](https://www.typescriptlang.org/tsconfig#baseUrl) ၊ [`paths`](https://www.typescriptlang.org/tsconfig#paths) ၊ [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs) ။

ဒီ strategies တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အသေးစိတ် အချက်အလက် အပြည့်အစုံအတွက် — [Module Resolution](https://www.typescriptlang.org/docs/handbook/modules/reference.html#the-moduleresolution-compiler-option) reference page ကို ဖတ်ရှုနိုင်ပါတယ်။

## TypeScript ရဲ့ Module Output Options

Emit လုပ်လိုက်တဲ့ JavaScript output ကို သက်ရောက်မှုရှိတဲ့ option နှစ်ခု ရှိပါတယ်:

- [`target`](https://www.typescriptlang.org/tsconfig#target) — ဘယ် JS features တွေကို downlevel (JavaScript runtimes အဟောင်းတွေမှာ run လို့ရအောင် ပြောင်းလဲခြင်း) လုပ်မယ် ၊ ဘယ်ဟာတွေကို မပြောင်းဘဲ ထားမယ်ဆိုတာ ဆုံးဖြတ်ပေးပါတယ်
- [`module`](https://www.typescriptlang.org/tsconfig#module) — modules တွေ တစ်ခုနဲ့တစ်ခု ဆက်သွယ်ဖို့ ဘယ် code ကို သုံးမယ်ဆိုတာ ဆုံးဖြတ်ပေးပါတယ်

ဘယ် [`target`](https://www.typescriptlang.org/tsconfig#target) ကို သုံးမလဲဆိုတာ — သင် TypeScript code ကို run မယ်လို့ မျှော်လင့်ထားတဲ့ JavaScript runtime ထဲမှာ ရနိုင်တဲ့ features တွေပေါ် မူတည်ပါတယ်။ အဲဒါက — သင်ထောက်ပံ့တဲ့ ရှေးအကျဆုံး web browser ၊ run မယ်လို့ မျှော်လင့်ထားတဲ့ Node.js ရဲ့ အနိမ့်ဆုံး version ၊ ဒါမှမဟုတ် သင့် runtime ရဲ့ ထူးခြားတဲ့ ကန့်သတ်ချက်တွေ — ဥပမာ Electron လိုမျိုး — ကနေ လာနိုင်ပါတယ်။

Modules တွေကြားက ဆက်သွယ်မှုအားလုံးက module loader တစ်ခုကတစ်ဆင့် ဖြစ်ပေါ်ပါတယ် — [`module`](https://www.typescriptlang.org/tsconfig#module) compiler option က ဘယ် loader ကို သုံးမယ်ဆိုတာ ဆုံးဖြတ်ပေးပါတယ်။ Runtime မှာ module loader က module တစ်ခုကို execute မလုပ်ခင် — အဲဒီ module ရဲ့ dependencies တွေ အားလုံးကို ရှာဖွေပြီး execute လုပ်ရတဲ့ တာဝန် ရှိပါတယ်။

ဥပမာ — [`module`](https://www.typescriptlang.org/tsconfig#module) အတွက် option အမျိုးမျိုးကို ပြသထားတဲ့ — ES Modules syntax သုံးထားတဲ့ TypeScript ဖိုင်တစ်ခု ဒီမှာ ပါပါတယ် — `constants.ts` ဖိုင်က:

```ts
export const valueOfPi = 3.142;
```

ပြီးတော့ `index.ts` ဖိုင်က:

```ts
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

> သတိပြုရန် — ES2020 က မူရင်း `index.ts` နဲ့ ထိရောက်စွာ အတူတူပါပဲ။

ရနိုင်တဲ့ option တွေ အားလုံးနဲ့ — သူတို့ရဲ့ emitted JavaScript code တွေက ဘယ်လိုပုံစံလဲဆိုတာကို [`module` အတွက် TSConfig Reference](https://www.typescriptlang.org/tsconfig#module) မှာ ကြည့်ရှုနိုင်ပါတယ်။

## TypeScript Namespaces

TypeScript မှာ ES Modules standard ထက် စောတဲ့ — `namespaces` လို့ခေါ်တဲ့ ကိုယ်ပိုင် module format တစ်ခု ရှိပါတယ်။ ဒီ syntax က ရှုပ်ထွေးတဲ့ definition files တွေ ဖန်တီးဖို့ အသုံးဝင်တဲ့ feature တွေ အများကြီး ရှိပြီး — [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) မှာ တက်ကြွစွာ သုံးနေဆဲပါ။ Deprecated မဟုတ်ပေမယ့် — namespaces ထဲက feature အများစုက ES Modules ထဲမှာ ရှိပြီးသားမို့ — JavaScript ရဲ့ ဦးတည်ချက်နဲ့ လိုက်လျောညီထွေဖြစ်ဖို့ ES Modules ကို သုံးဖို့ အကြံပြုပါတယ်။ Namespaces အကြောင်း ပိုမိုသိရှိဖို့ — [the namespaces reference page](https://www.typescriptlang.org/docs/handbook/namespaces.html) မှာ ဖတ်ရှုနိုင်ပါတယ်။
