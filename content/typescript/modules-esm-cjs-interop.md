---
title: "Modules: ESM-CJS Interop (ESM နဲ့ CJS အပြန်အလှန် ဆက်စပ်မှု)"
description: "ESM နဲ့ CommonJS (CJS) အပြန်အလှန် ဆက်စပ်မှု (interop) အကြောင်း အသေးစိတ် ရှင်းလင်းချက် — __esModule ၊ allowSyntheticDefaultImports ၊ esModuleInterop နဲ့ Node.js ရဲ့ interop အပြုအမူများ"
order: 52
source: "https://www.typescriptlang.org/docs/handbook/modules/appendices/esm-cjs-interop.html"
status: translated
updated: 2026-09-05
---

2015 ခုနှစ်လို့ မြင်ယောင်ကြည့်ပါ — သင်ဟာ ESM-to-CJS transpiler တစ်ခု ရေးနေပါတယ်။ ဒါကို ဘယ်လို လုပ်ရမလဲဆိုတဲ့ specification ဆိုတာ မရှိပါဘူး; သင့်မှာ ရှိတာက — ES modules တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လို အပြန်အလှန် ဆက်သွယ်ရမယ်ဆိုတဲ့ specification ၊ CommonJS modules တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လို အပြန်အလှန် ဆက်သွယ်ကြတယ်ဆိုတဲ့ အသိပညာ ၊ ပြီးတော့ အရာရာကို တွေးဆဖော်ထုတ်နိုင်တဲ့ ဉာဏ်ကွန့်တစ်ခုပါ။ Export လုပ်နေတဲ့ ES module တစ်ခုကို စဉ်းစားကြည့်ပါ:

```ts
export const A = {};
export const B = {};
export default "Hello, world!";
```

ဒါကို CommonJS module တစ်ခုအဖြစ် ဘယ်လို ပြောင်းလဲမလဲ။ Default exports တွေက — syntax အထူးတစ်ခုနဲ့ ရေးထားတဲ့ named exports တွေပဲ ဆိုတာ ပြန်သတိရရင် — ရွေးစရာ တစ်ခုပဲ ရှိပုံရပါတယ်:

```ts
exports.A = {};
exports.B = {};
exports.default = "Hello, world!";
```

ဒါက လှပတဲ့ analog တစ်ခုပါ — importing ဘက်မှာလည်း အလားတူပုံစံမျိုး အကောင်အထည်ဖော်နိုင်စေပါတယ်:

```ts
import hello, { A, B } from "./module";
console.log(hello, A, B);

// transpiles to:

const module_1 = require("./module");
console.log(module_1.default, module_1.A, module_1.B);
```

ဒီထိတော့ CJS-ကမ္ဘာက အရာအားလုံး ESM-ကမ္ဘာနဲ့ တစ်ခုချင်းစီ ကိုက်ညီနေပါတယ်။ အပေါ်က equivalence ကို နောက်ထပ် တစ်ဆင့် ချဲ့ကြည့်ရင် — ဒါတွေလည်း ရှိသေးတာ တွေ့ရမှာပါ:

```ts
import * as mod from "./module";
console.log(mod.default, mod.A, mod.B);

// transpiles to:

const mod = require("./module");
console.log(mod.default, mod.A, mod.B);
```

ဒီ scheme ထဲမှာ — `exports` ကို function ၊ class ၊ ဒါမှမဟုတ် primitive တစ်ခုအဖြစ် assign လုပ်တဲ့ output မျိုး ထွက်စေမယ့် ESM export တစ်ခုကို ရေးဖို့ နည်းလမ်း မရှိဘူးဆိုတာ သတိထားမိလောက်ပါတယ်:

```ts
// @Filename: exports-function.js
module.exports = function hello() {
  console.log("Hello, world!");
};
```

ဒါပေမယ့် — ရှိပြီးသား CommonJS modules တွေက ဒီပုံစံမျိုးနဲ့ မကြာခဏ တည်ရှိနေတတ်ပါတယ်။ ငါတို့ရဲ့ transpiler နဲ့ process လုပ်ထားတဲ့ ESM import တစ်ခုက ဒီ module ကို ဘယ်လို ဝင်ရောက်သုံးစွဲနိုင်မလဲ။ Namespace import (`import *`) တစ်ခုက `require` call တစ်ခုအဖြစ် transpile လုပ်ခံရတယ်ဆိုတာ ခုနက သက်သေပြခဲ့ပြီးပြီမို့ — ဒီလို input မျိုးကို ထောက်ပံ့ပေးနိုင်ပါတယ်:

```ts
import * as hello from "./exports-function";
hello();

// transpiles to:

const hello = require("./exports-function");
hello();
```

ငါတို့ရဲ့ output က runtime မှာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် compliance ပြဿနာတစ်ခု ရှိပါတယ်: JavaScript specification အရ — namespace import တစ်ခုက အမြဲတမ်း [_Module Namespace Object_](https://tc39.es/ecma262/#sec-module-namespace-objects) ဆီပဲ resolve လုပ်ပါတယ် — ဆိုလိုတာက module ရဲ့ exports တွေကို members တွေအဖြစ် ပါဝင်တဲ့ object တစ်ခုဆီပါ။ ဒီကိစ္စမှာ `require` က `hello` function ကို ပြန်ပေးမှာ ဖြစ်ပေမယ့် — `import *` က function တစ်ခုကို ဘယ်တော့မှ ပြန်ပေးလို့ မရပါဘူး။ ငါတို့ ယူဆထားခဲ့တဲ့ correspondence က မမှန်ကန်ဘူးဆိုတာ ထင်ရှားလာပါတယ်။

ဒီနေရာမှာ ခဏ နောက်ဆုတ်ပြီး _goal_ က ဘာလဲဆိုတာ ရှင်းလင်းဖို့ ထိုက်တန်ပါတယ်။ Modules တွေ ES2015 specification ထဲ ရောက်လာတာနဲ့ — transpilers တွေက ESM ကို CJS အဖြစ် downlevel (အဆင့်နိမ့် ပြောင်းလဲခြင်း) လုပ်တာကို ထောက်ပံ့ပေးတဲ့အနေနဲ့ ပေါ်ထွက်လာခဲ့ပြီး — runtimes တွေက ဒီ syntax အသစ်အတွက် ထောက်ပံ့မှု မအကောင်အထည်ဖော်ရသေးခင်ကတည်းက users တွေ ဒီ syntax ကို သုံးစွဲနိုင်စေခဲ့ပါတယ်။ ESM code ရေးတာက project အသစ်တွေကို “future-proof” (အနာဂတ်အတွက် ကြိုတင် ပြင်ဆင်ထားခြင်း) လုပ်နည်း ကောင်းတစ်ခုလို့တောင် ခံစားခဲ့ကြရပါတယ်။ ဒါက မှန်ဖို့ဆိုရင် — runtimes တွေမှာ support ပေါ်လာတာနဲ့ — transpilers တွေရဲ့ CJS output တွေကို execute လုပ်ခြင်းကနေ ESM input တွေကို native အနေနဲ့ execute လုပ်ခြင်းဆီ ချောမွေ့စွာ ကူးပြောင်းနိုင်တဲ့ လမ်းကြောင်း (migration path) တစ်ခု ရှိဖို့ လိုအပ်ခဲ့ပါတယ်။ Goal ကတော့ — ESM ကို CJS အဖြစ် downlevel လုပ်တဲ့ နည်းလမ်းတစ်ခုကို ရှာဖွေဖို့ ဖြစ်ပြီး — အဲဒါမှ transpile လုပ်ထားတဲ့ output တွေထဲက တစ်ခုခု ဒါမှမဟုတ် အားလုံးကို — အနာဂတ် runtime တစ်ခုမှာ — ပြုမူပုံမှာ သိသာတဲ့ ပြောင်းလဲမှု မရှိဘဲ — သူတို့ရဲ့ တကယ့် ESM inputs တွေနဲ့ အစားထိုးလို့ရစေဖို့ပါ။

Specification ကို လိုက်နာခြင်းအားဖြင့် — transpilers တွေက သူတို့ရဲ့ transpiled CommonJS outputs တွေရဲ့ semantics တွေကို — သူတို့ရဲ့ ESM inputs တွေရဲ့ သတ်မှတ်ထားတဲ့ semantics တွေနဲ့ ကိုက်ညီအောင် လုပ်ပေးနိုင်တဲ့ transformations အစုတစ်စု ရှာဖွေတာက လွယ်ကူလောက်ပါတယ် (arrows တွေက imports တွေကို ကိုယ်စားပြုပါတယ်):

ဒါပေမယ့် — CommonJS modules တွေ (ESM ကနေ CommonJS ကို transpile လုပ်ထားတာတွေ မဟုတ်ဘဲ — CommonJS အဖြစ်နဲ့ပဲ ရေးထားတာတွေ) က Node.js ecosystem ထဲမှာ ကြာမြင့်စွာ တည်ရှိနေပြီးသားမို့ — ESM အဖြစ် ရေးပြီး CJS အဖြစ် transpile လုပ်ထားတဲ့ modules တွေက CommonJS အဖြစ် ရေးထားတဲ့ modules တွေကို “import” လုပ်ကြမယ်ဆိုတာ မလွှဲမရှောင် ဖြစ်ပါတော့တယ်။ ဒီ interoperability အတွက် အပြုအမူကတော့ — ES2015 မှာ သတ်မှတ်မထားဘဲ — runtime တကယ့်တစ်ခုခုမှာလည်း မရှိသေးပါဘူး။

Transpiler authors တွေ ဘာမှ မလုပ်ခဲ့ရင်တောင် — သူတို့ transpiled code တွေထဲမှာ emit လုပ်ထားတဲ့ `require` calls တွေနဲ့ — ရှိပြီးသား CJS modules တွေထဲမှာ define လုပ်ထားတဲ့ `exports` တွေကြားက ရှိပြီးသား semantics တွေကနေ အပြုအမူတစ်ခု ပေါ်ထွက်လာမှာ ဖြစ်ပါတယ်။ ပြီးတော့ users တွေ transpiled ESM ကနေ — သူတို့ရဲ့ runtime က ထောက်ပံ့လာတာနဲ့ — true ESM ဆီ ချောမွေ့စွာ ကူးပြောင်းနိုင်ဖို့ဆိုရင် — အဲဒီအပြုအမူဟာ runtime က အကောင်အထည်ဖော်ဖို့ ရွေးချယ်ခဲ့တဲ့ အပြုအမူနဲ့ ကိုက်ညီနေရပါမယ်။

Runtimes တွေက ဘယ် interop အပြုအမူကို ထောက်ပံ့မလဲဆိုတာ ခန့်မှန်းခြင်းက ESM က “true CJS” modules တွေကို import လုပ်တာတင်ပဲ မဟုတ်ပါဘူး။ ESM က CJS ကနေ ESM အဖြစ် transpile လုပ်ထားတာတွေကို CJS နဲ့ ခွဲခြားမှတ်မိနိုင်မလား ၊ CJS က ES modules တွေကို `require` လုပ်နိုင်မလား ဆိုတာတွေလည်း သတ်မှတ်မထားခဲ့ပါဘူး။ ESM imports တွေက CJS `require` calls တွေရဲ့ module resolution algorithm နဲ့ တစ်ခုတည်း သုံးမလားဆိုတာတောင် မသိနိုင်ခဲ့ပါဘူး။ Transpiler users တွေကို native ESM ဆီ ချောမွေ့တဲ့ migration လမ်းကြောင်းတစ်ခု ပေးနိုင်ဖို့ဆိုရင် — ဒီ variable တွေ အားလုံးကို မှန်ကန်စွာ ကြိုတင်ခန့်မှန်းထားနိုင်ဖို့ လိုအပ်ပါတယ်။

## `allowSyntheticDefaultImports` and `esModuleInterop` (allowSyntheticDefaultImports နဲ့ esModuleInterop flag များ)

ငါတို့ရဲ့ specification compliance ပြဿနာဆီ ပြန်သွားရအောင် — `import *` က `require` အဖြစ် transpile လုပ်ခံရတဲ့ နေရာပါ:

```ts
// Invalid according to the spec:
import * as hello from "./exports-function";
hello();

// but the transpilation works:
const hello = require("./exports-function");
hello();
```

TypeScript က ES modules တွေ ရေးသားခြင်းနဲ့ transpile လုပ်ခြင်းအတွက် ထောက်ပံ့မှု ပထမဆုံး ထည့်သွင်းတုန်းက — compiler က ဒီပြဿနာကို — `exports` က namespace ပုံစံ object မဟုတ်တဲ့ module တစ်ခုရဲ့ namespace import တိုင်းအပေါ် error ထုတ်ပေးခြင်းအားဖြင့် ဖြေရှင်းခဲ့ပါတယ်:

```ts
import * as hello from "./exports-function";
// TS2497              ^^^^^^^^^^^^^^^^^^^^
// External module '"./exports-function"' resolves to a non-module entity
// and cannot be imported using this construct.
```

တစ်ခုတည်းသော workaround ကတော့ — users တွေ CommonJS `require` တစ်ခုကို ကိုယ်စားပြုတဲ့ TypeScript import syntax အဟောင်းဆီ ပြန်သွားဖို့ပဲ ဖြစ်ပါတယ်:

```ts
import hello = require("./exports-function");
```

Users တွေကို non-ESM syntax ဆီ ပြန်လှည့်စေခြင်းက အခြေခံအားဖြင့် — “`"./exports-function"` လိုမျိုး CJS module တစ်ခုကို ESM imports တွေနဲ့ အနာဂတ်မှာ ဝင်ရောက်သုံးစွဲလို့ ရမလား ၊ ဘယ်လို ရမလဲဆိုတာ ငါတို့ မသိပါဘူး — ဒါပေမယ့် ငါတို့ သုံးနေတဲ့ transpilation scheme မှာ runtime မှာ အလုပ်လုပ်မယ်ဆိုပေမယ့် — `import *` နဲ့တော့ _မရနိုင်_ ဘူးဆိုတာ သိပါတယ်” လို့ ဝန်ခံလိုက်တာနဲ့ တူပါတယ်။ ဒါက — ဒီဖိုင်ကို ပြောင်းလဲစရာမလိုဘဲ တကယ့် ESM အဖြစ် migrate လုပ်နိုင်စေမယ့် goal ကို မပြည့်မီစေပါဘူး — ဒါပေမယ့် `import *` ကို function တစ်ခုဆီ ချိတ်ဆက်ခွင့်ပြုတဲ့ အခြားရွေးချယ်စရာကလည်း အဲဒီလိုပဲ မပြည့်မီပါဘူး။ `allowSyntheticDefaultImports` ရော `esModuleInterop` ရော disable လုပ်ထားတဲ့အခါ — ဒါက ဒီနေ့ TypeScript မှာလည်း ဒီအတိုင်းပဲ ဖြစ်နေဆဲပါ။

> ဒါက အနည်းငယ် ရိုးရှင်းလွန်းတဲ့ ဖော်ပြချက်တစ်ခုပါ — TypeScript က ဒီ error နဲ့ compliance ပြဿနာကို လုံးဝ မရှောင်နိုင်ခဲ့ပါဘူး — ဘာလို့လဲဆိုတော့ function declaration တစ်ခုက namespace declaration တစ်ခုနဲ့ merge ဖြစ်နေသရွေ့ — namespace က ဘာမှ မပါဝင်ဘဲ ကွက်လပ် ဖြစ်နေရင်တောင် — functions တွေရဲ့ namespace imports တွေကို ခွင့်ပြုပြီး သူတို့ရဲ့ call signatures တွေကို ထိန်းသိမ်းထားလို့ပါ။ ဒါကြောင့် — bare function တစ်ခုကို export လုပ်တဲ့ module တစ်ခုကို “non-module entity” အဖြစ် အသိအမှတ်ပြုခဲ့ပေမယ့်:
> ```ts
> declare function $(selector: string): any;
> export = $; // Cannot `import *` this 👍
> ```
> အဓိပ္ပာယ်မဲ့သလောက် ဖြစ်တဲ့ အပြောင်းအလဲတစ်ခုက အဲဒီ invalid import ကို error မရှိဘဲ type check ဖြစ်စေခဲ့ပါတယ်:
> ```ts
> declare namespace $ {}
> declare function $(selector: string): any;
> export = $; // Allowed to `import *` this and call it 😱
> ```

ဒီအတောအတွင်း — တခြား transpilers တွေက ဒီပြဿနာတစ်ခုတည်းကို ဖြေရှင်းဖို့ နည်းလမ်းတစ်ခု ပေါ်လာနေပါပြီ။ သူတို့ရဲ့ တွေးခေါ်ပုံက ဒီလိုမျိုး သွားပါတယ်:

1. Function တစ်ခု ဒါမှမဟုတ် primitive တစ်ခုကို export လုပ်တဲ့ CJS module တစ်ခုကို import လုပ်ဖို့ဆိုရင် — default import တစ်ခုကို သုံးဖို့ ရှင်းရှင်းလင်းလင်း လိုအပ်ပါတယ်။ Namespace import တစ်ခုက မတရားဘဲ ဖြစ်မှာ ဖြစ်ပြီး — named imports တွေကလည်း ဒီနေရာမှာ အဓိပ္ပာယ် မရှိပါဘူး။
2. ဖြစ်နိုင်ခြေ အများဆုံးကတော့ — ESM/CJS interop ကို အကောင်အထည်ဖော်မယ့် runtimes တွေက CJS modules တွေရဲ့ default imports တွေကို `exports` တစ်ခုလုံးဆီ တိုက်ရိုက် _အမြဲတမ်း_ ချိတ်ဆက်ပေးဖို့ ရွေးချယ်မှာပါ — `exports` က function ဒါမှမဟုတ် primitive ဖြစ်နေမှပဲ ဒီလိုလုပ်တာ မဟုတ်ဘဲ။
3. ဒါဆိုရင် — true CJS module တစ်ခုရဲ့ default import တစ်ခုက `require` call တစ်ခုလိုပဲ အလုပ်လုပ်သင့်ပါတယ်။ ဒါပေမယ့် — true CJS modules တွေကို ငါတို့ရဲ့ transpiled CJS modules တွေကနေ ခွဲခြားသိမြင်နိုင်ဖို့ နည်းလမ်းတစ်ခု လိုအပ်ပါမယ် — ဘာလို့လဲဆိုတော့ `export default "hello"` ကို `exports.default = "hello"` အဖြစ် ဆက်လက် transpile လုပ်နိုင်ဖို့ ဆိုရင် — အဲဒီ module ရဲ့ default import တစ်ခုက `exports.default` ဆီ ချိတ်ဆက်စေဖို့ လိုအပ်လို့ပါ။ အခြေခံအားဖြင့် — ငါတို့ကိုယ်တိုင် transpile လုပ်ထားတဲ့ module တစ်ခုရဲ့ default import က တစ်မျိုး အလုပ်လုပ်ဖို့ လိုပြီး (ESM-to-ESM imports တွေကို simulate လုပ်ဖို့) — တခြား ရှိပြီးသား CJS module တစ်ခုရဲ့ default import ကတော့ နောက်တစ်မျိုး အလုပ်လုပ်ဖို့ လိုပါတယ် (ESM-to-CJS imports တွေ ဘယ်လို အလုပ်လုပ်မယ်လို့ ငါတို့ ထင်ထားလဲဆိုတာကို simulate လုပ်ဖို့)။
4. ES module တစ်ခုကို CJS အဖြစ် transpile လုပ်တဲ့အခါ — output ထဲကို special field အပိုတစ်ခု ထည့်လိုက်ရအောင်:
   ```ts
   exports.A = {};
   exports.B = {};
   exports.default = "Hello, world!";
   // Extra special flag!
   exports.__esModule = true;
   ```
   ဒါကို default import တစ်ခု transpile လုပ်တဲ့အခါ စစ်ဆေးနိုင်ဖို့ ထည့်ထားတာပါ:
   ```ts
   // import hello from "./module";
   const _mod = require("./module");
   const hello = _mod.__esModule ? _mod.default : _mod;
   ```

`__esModule` flag က Traceur မှာ ပထမဆုံး ပေါ်ခဲ့ပြီး — မကြာခင်မှာပဲ Babel ၊ SystemJS ၊ Webpack တို့မှာ ဆက်လက် ပေါ်လာခဲ့ပါတယ်။ TypeScript က `allowSyntheticDefaultImports` ကို 1.8 မှာ ထည့်သွင်းခဲ့ပြီး — `export default` declaration မပါတဲ့ module types တွေရဲ့ default imports တွေကို `exports.default` အစား `exports` ဆီ တိုက်ရိုက် ချိတ်ဆက်ဖို့ type checker ကို ခွင့်ပြုခဲ့ပါတယ်။ ဒီ flag က imports တွေ ဒါမှမဟုတ် exports တွေကို ဘယ်လို emit လုပ်မလဲဆိုတာကိုတော့ မပြောင်းလဲခဲ့ဘူး — ဒါပေမယ့် default imports တွေကို တခြား transpilers တွေ ဆက်ဆံပုံကို ရောင်ပြန်ဟပ်စေခဲ့ပါတယ်။ တိတိကျကျပြောရရင် — `import *` က error ဖြစ်တဲ့ “non-module entities” တွေဆီ resolve လုပ်ဖို့ default import တစ်ခုကို သုံးခွင့်ပြုခဲ့ပါတယ်:

```ts
// Error:
import * as hello from "./exports-function";

// Old workaround:
import hello = require("./exports-function");

// New way, with `allowSyntheticDefaultImports`:
import hello from "./exports-function";
```

ဒါက ပုံမှန်အားဖြင့် Babel နဲ့ Webpack users တွေကို — TypeScript က မကျေမနပ် မပြောဘဲ — အဲဒီစနစ်တွေမှာ အလုပ်ဖြစ်ပြီးသား code တွေကို ဆက်ရေးနိုင်ဖို့ လုံလောက်ခဲ့ပါတယ် — ဒါပေမယ့် ဒါက တစ်စိတ်တစ်ပိုင်း ဖြေရှင်းချက်တစ်ခုပဲ ဖြစ်ပြီး — မဖြေရှင်းရသေးတဲ့ ပြဿနာတချို့ ကျန်ရစ်ခဲ့ပါတယ်:

1. Babel နဲ့ တခြားသူတွေက target module မှာ `__esModule` property တစ်ခု တွေ့ရသလားဆိုတာပေါ် မူတည်ပြီး သူတို့ရဲ့ default import အပြုအမူကို ကွဲပြားစေခဲ့ပေမယ့် — `allowSyntheticDefaultImports` က target module ရဲ့ types တွေထဲမှာ default export တစ်ခု မတွေ့ရမှပဲ _fallback_ အပြုအမူတစ်ခုကို enable လုပ်ခဲ့ပါတယ်။ ဒါက — target module မှာ `__esModule` flag ရှိပေမယ့် default export _မရှိ_ ဘူးဆိုရင် inconsistency တစ်ခု ဖြစ်စေခဲ့ပါတယ်။ Transpilers ရော bundlers ရောက အဲဒီလို module တစ်ခုရဲ့ default import တစ်ခုကို သူ့ရဲ့ `exports.default` ဆီ ဆက်လက် ချိတ်ဆက်ပေးမှာ ဖြစ်ပြီး — အဲဒါက `undefined` ဖြစ်နေမှာမို့ — TypeScript မှာ error တစ်ခု ဖြစ်သင့်ပါတယ် — တကယ့် ESM imports တွေက ချိတ်ဆက်လို့ မရရင် errors တွေ ဖြစ်စေလို့ပါ။ ဒါပေမယ့် `allowSyntheticDefaultImports` နဲ့ဆိုရင် TypeScript က အဲဒီလို import တစ်ခုရဲ့ default import က `exports` object တစ်ခုလုံးဆီ ချိတ်ဆက်တယ်လို့ ထင်မှတ်ပြီး — named exports တွေကို သူ့ရဲ့ properties တွေအနေနဲ့ ဝင်ရောက်ခွင့်ပြုမိမှာ ဖြစ်ပါတယ်။
2. `allowSyntheticDefaultImports` က namespace imports တွေကို ဘယ်လို type လုပ်မလဲဆိုတာကို မပြောင်းခဲ့ဘူး — နှစ်ခုလုံးကို သုံးလို့ရပြီး type တစ်ခုတည်း ရှိမယ့် ထူးဆန်းတဲ့ inconsistency တစ်ခု ဖြစ်စေခဲ့ပါတယ်:
   ```ts
   // @Filename: exportEqualsObject.d.ts
   declare const obj: object;
   export = obj;

   // @Filename: main.ts
   import objDefault from "./exportEqualsObject";
   import * as objNamespace from "./exportEqualsObject";

   // This should be true at runtime, but TypeScript gives an error:
   objNamespace.default === objDefault;
   //           ^^^^^^^ Property 'default' does not exist on type 'typeof import("./exportEqualsObject")'.
   ```
3. အရေးအကြီးဆုံးကတော့ — `allowSyntheticDefaultImports` က `tsc` က emit လုပ်တဲ့ JavaScript ကို မပြောင်းလဲခဲ့ပါဘူး။ ဒါကြောင့် — code ကို Babel ဒါမှမဟုတ် Webpack လို တခြား tool တစ်ခုထဲ ထည့်ကျွေးနေသရွေ့ flag က ပိုတိကျတဲ့ checking ကို enable လုပ်ပေးပေမယ့် — `--module commonjs` နဲ့ `tsc` ကို သုံးပြီး Node.js မှာ run နေတဲ့ users တွေအတွက်တော့ အန္တရာယ် အစစ်အမှန်တစ်ခု ဖြစ်စေခဲ့ပါတယ်။ သူတို့က `import *` နဲ့ error တစ်ခု ကြုံရရင် — `allowSyntheticDefaultImports` ကို enable လုပ်ရင် ပြေလည်သွားပုံရပေမယ့် — တကယ်တော့ သူက build-time error ကို နှုတ်ဆိတ်စေပြီး Node မှာ crash ဖြစ်မယ့် code ကို emit လုပ်နေတာပဲ ဖြစ်ပါတယ်။

TypeScript က `esModuleInterop` flag ကို 2.7 မှာ မိတ်ဆက်ခဲ့ပြီး — TypeScript ရဲ့ analysis နဲ့ ရှိပြီးသား transpilers တွေနဲ့ bundlers တွေမှာ သုံးနေတဲ့ interop အပြုအမူကြားက ကျန်ရစ်ခဲ့တဲ့ inconsistencies တွေကို ဖြေရှင်းဖို့ imports တွေရဲ့ type checking ကို ပြန်လည် မွမ်းမံပြီး — အရေးကြီးတာက — transpilers တွေ နှစ်ပေါင်းများစွာ ကတည်းက ကျင့်သုံးခဲ့တဲ့ `__esModule`-conditional CommonJS emit ကိုပါ လက်ခံကျင့်သုံးခဲ့ပါတယ်။ (`import *` အတွက် emit helper အသစ်နောက်တစ်ခုက — result က call signatures တွေ ဖယ်ထားပြီး — object တစ်ခု အမြဲ ဖြစ်နေစေဖို့ သေချာစေခဲ့ပြီး — အထက်မှာ ဖော်ပြခဲ့တဲ့ “resolves to a non-module entity” error က သေချာပေါက် မရှောင်နိုင်ခဲ့တဲ့ specification compliance ပြဿနာကို လုံးဝ ဖြေရှင်းပေးခဲ့ပါတယ်။) နောက်ဆုံးမှာတော့ — flag အသစ် enable လုပ်ထားတဲ့အခါ — TypeScript ရဲ့ type checking ၊ TypeScript ရဲ့ emit ၊ ပြီးတော့ ကျန်တဲ့ transpiling/bundling ecosystem တစ်ခုလုံးက — spec နဲ့ ကိုက်ညီပြီး Node ကပါ လက်ခံနိုင်လောက်တဲ့ CJS/ESM interop scheme တစ်ခုအပေါ် သဘောတူညီခဲ့ကြပါတယ်။

## Interop in Node.js (Node.js မှာ Interop)

Node.js က v12 မှာ ES modules အတွက် ထောက်ပံ့မှုကို flag မလိုဘဲ ပေးပို့ခဲ့ပါတယ်။ Bundlers ရော transpilers ရော နှစ်ပေါင်းများစွာ ကတည်းက စတင်လုပ်ဆောင်ခဲ့သလိုပဲ — Node.js ကလည်း CommonJS modules တွေကို သူတို့ရဲ့ `exports` object ရဲ့ “synthetic default export” တစ်ခု ပေးခဲ့ပြီး — module contents တစ်ခုလုံးကို ESM ကနေ default import တစ်ခုနဲ့ ဝင်ရောက်နိုင်စေခဲ့ပါတယ်:

```ts
// @Filename: export.cjs
module.exports = { hello: "world" };

// @Filename: import.mjs
import greeting from "./export.cjs";
greeting.hello; // "world"
```

ဒါက ချောမွေ့တဲ့ migration အတွက် အနိုင်တစ်ခုပါ! ကံမကောင်းတာက — တူညီမှုတွေက အဲဒီမှာ အများစု ရပ်ဆုံးသွားပါတယ်။

### No `__esModule` detection (the “double default” problem) (__esModule detection မရှိခြင်း — “double default” ပြဿနာ)

Node.js က `__esModule` marker ကို လေးစားလိုက်နာပြီး သူ့ရဲ့ default import အပြုအမူကို ကွဲပြားစေဖို့ မတတ်နိုင်ခဲ့ပါဘူး။ ဒါကြောင့် — “default export” ပါတဲ့ transpiled module တစ်ခုက — တခြား transpiled module တစ်ခုက “import” လုပ်တဲ့အခါ တစ်မျိုး ပြုမူပြီး — Node.js ထဲက true ES module တစ်ခုက import လုပ်တဲ့အခါ နောက်တစ်မျိုး ပြုမူပါတယ်:

```ts
// @Filename: node_modules/dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /*...*/ }

// @Filename: transpile-vs-run-directly.{js/mjs}
import doSomething from "dependency";
// Works after transpilation, but not a function in Node.js ESM:
doSomething();
// Doesn't exist after transpilation, but works in Node.js ESM:
doSomething.default();
```

Transpiled default import က — target module မှာ `__esModule` flag မရှိမှသာ synthetic default export ကို ဖန်တီးပေးပေမယ့် — Node.js ကတော့ default export တစ်ခုကို _အမြဲတမ်း_ synthesize လုပ်တာမို့ — transpiled module ပေါ်မှာ “double default” တစ်ခု ဖြစ်ပေါ်စေပါတယ်။

### Unreliable named exports (ယုံကြည်စိတ်ချရမှု မရှိတဲ့ named exports)

CommonJS module တစ်ခုရဲ့ `exports` object ကို default import အဖြစ် ရနိုင်အောင် လုပ်ပေးတာအပြင် — Node.js က `exports` ရဲ့ properties တွေကို ရှာဖွေပြီး named imports အဖြစ် ရနိုင်အောင်လည်း ကြိုးစားပါတယ်။ ဒီအပြုအမူက အလုပ်လုပ်တဲ့အခါ bundlers တွေနဲ့ transpilers တွေနဲ့ ကိုက်ညီပါတယ်; ဒါပေမယ့် — Node.js က code ဘာမှ execute မလုပ်ခင် [syntactic analysis (syntax အခြေပြု ခွဲခြမ်းစိတ်ဖြာခြင်း)](https://github.com/nodejs/cjs-module-lexer) ကို သုံးပြီး named exports တွေကို synthesize လုပ်တာဖြစ်ပြီး — transpiled modules တွေကတော့ သူတို့ရဲ့ named imports တွေကို runtime မှာ ဖြေရှင်းပါတယ်။ ရလဒ်ကတော့ — transpiled modules တွေမှာ အလုပ်လုပ်တဲ့ CJS modules imports တွေက Node.js မှာ အလုပ်မလုပ်နိုင်တာပါ:

```ts
// @Filename: named-exports.cjs
exports.hello = "world";
exports["worl" + "d"] = "hello";

// @Filename: transpile-vs-run-directly.{js/mjs}
import { hello, world } from "./named-exports.cjs";
// `hello` works, but `world` is missing in Node.js 💥

import mod from "./named-exports.cjs";
mod.world;
// Accessing properties from the default always works ✅
```

### Cannot `require` a true ES module before Node.js v22 (Node.js v22 မတိုင်မီ true ES module တစ်ခုကို require လုပ်လို့ မရခြင်း)

တကယ့် CommonJS modules တွေက ESM-to-CJS transpiled module တစ်ခုကို `require` လုပ်နိုင်ပါတယ် — runtime မှာ နှစ်ခုလုံး CommonJS တွေ ဖြစ်နေလို့ပါ။ ဒါပေမယ့် v22.12.0 ထက် အဟောင်းဖြစ်တဲ့ Node.js versions တွေမှာ — `require` က ES module တစ်ခုဆီ resolve ဖြစ်ရင် crash ဖြစ်ပါတယ်။ ဒါက ဆိုလိုတာက — publish လုပ်ထားတဲ့ libraries တွေက — သူတို့ရဲ့ CommonJS (true ရော transpiled ရော) consumers တွေကို မချိုးဖျက်ဘဲ — transpiled modules တွေကနေ true ESM ဆီ migrate လုပ်လို့ မရဘူးဆိုတာပါ:

```ts
// @Filename: node_modules/dependency/index.js
export function doSomething() { /* ... */ }

// @Filename: dependent.js
import { doSomething } from "dependency";
// ✅ Works if dependent and dependency are both transpiled
// ✅ Works if dependent and dependency are both true ESM
// ✅ Works if dependent is true ESM and dependency is transpiled
// 💥 Crashes if dependent is transpiled and dependency is true ESM
```

### Different module resolution algorithms (Module resolution algorithms တွေ မတူညီခြင်း)

Node.js က ESM imports တွေကို ဖြေရှင်းဖို့ — `require` calls တွေကို ဖြေရှင်းတဲ့ သက်တမ်းရှည် algorithm နဲ့ သိသိသာသာ ကွဲပြားတဲ့ — module resolution algorithm အသစ်တစ်ခုကို မိတ်ဆက်ခဲ့ပါတယ်။ CJS နဲ့ ES modules တွေကြားက interop နဲ့ တိုက်ရိုက် မသက်ဆိုင်ပေမယ့် — ဒီကွာခြားချက်က transpiled modules တွေကနေ true ESM ဆီ ချောမွေ့စွာ migrate လုပ်ခြင်း မဖြစ်နိုင်တော့တဲ့ နောက်ထပ် အကြောင်းရင်းတစ်ခု ဖြစ်ခဲ့ပါတယ်:

```ts
// @Filename: add.js
export function add(a, b) {
  return a + b;
}

// @Filename: math.js
export * from "./add";
//            ^^^^^^^
// Works when transpiled to CJS,
// but would have to be "./add.js"
// in Node.js ESM.
```

## Conclusions (နိဂုံးချုပ်များ)

ရှင်းရှင်းလင်းလင်း မြင်ရတာက — transpiled modules တွေကနေ ESM ဆီ ချောမွေ့စွာ migrate လုပ်ခြင်းက မဖြစ်နိုင်ပါဘူး — အနည်းဆုံးတော့ Node.js မှာပေါ့။ ဒါဆိုရင် ငါတို့ ဘယ်မှာ ရပ်တည်နေလဲ။

### Setting the right `module` compiler option is critical (မှန်ကန်တဲ့ module compiler option ထားရှိခြင်းက အရေးကြီးပါတယ်)

Interoperability စည်းမျဉ်းတွေက host တစ်ခုနဲ့တစ်ခု ကွဲပြားတာမို့ — TypeScript က — သူမြင်ရတဲ့ ဖိုင်တစ်ခုချင်းစီက module အမျိုးအစား ဘာကို ကိုယ်စားပြုလဲဆိုတာရော — သူတို့အပေါ် ကျင့်သုံးရမယ့် စည်းမျဉ်း အစုံကဘာလဲဆိုတာပါ နားလည်ထားမှသာ — မှန်ကန်တဲ့ checking အပြုအမူကို ကမ်းလှမ်းနိုင်မှာ ဖြစ်ပါတယ်။ ဒါကပဲ `module` compiler option ရဲ့ ရည်ရွယ်ချက်ပါ။ (အထူးသဖြင့် — Node.js မှာ run ဖို့ ရည်ရွယ်ထားတဲ့ code က — bundler တစ်ခုက process လုပ်မယ့် code ထက် ပိုတင်းကျပ်တဲ့ စည်းမျဉ်းတွေကို လိုက်နာရပါတယ်။ `module` ကို `node16` ၊ `node18` ၊ ဒါမှမဟုတ် `nodenext` လို့ မသတ်မှတ်ထားရင် — compiler ရဲ့ output ကို Node.js compatibility အတွက် check မလုပ်ပေးပါဘူး။)

### Applications with CommonJS code should always enable `esModuleInterop` (CommonJS code ပါတဲ့ applications တွေက esModuleInterop ကို အမြဲ enable လုပ်သင့်ပါတယ်)

`tsc` ကို သုံးပြီး JavaScript files တွေ emit လုပ်တဲ့ TypeScript _application_ တစ်ခုမှာ (တခြားသူတွေ သုံးစွဲနိုင်တဲ့ library နဲ့ ဆန့်ကျင်ဘက်အနေနဲ့) — `esModuleInterop` enable ဖြစ်မဖြစ်က ကြီးကြီးမားမား အကျိုးဆက်တွေ မရှိပါဘူး။ Module အမျိုးအစားတချို့အတွက် imports တွေ ရေးပုံ ပြောင်းသွားမှာ ဖြစ်ပေမယ့် — TypeScript ရဲ့ checking ရော emit ရော ထပ်တူညီနေတာမို့ — error ကင်းတဲ့ code က mode နှစ်ခုလုံးမှာ run ဖို့ လုံခြုံပါတယ်။ ဒီကိစ္စမှာ `esModuleInterop` ကို disable ထားခဲ့ရင် ဖြစ်လာနိုင်တဲ့ ဆိုးကျိုးကတော့ — ECMAScript specification ကို ရှင်းလင်းစွာ ချိုးဖောက်တဲ့ semantics တွေနဲ့ JavaScript code တွေ ရေးမိနိုင်ပြီး — namespace imports တွေအပေါ် ထင်မြင်ချက်တွေ ရှုပ်ထွေးစေကာ — အနာဂတ်မှာ ES modules တွေကို run ဖို့ migrate လုပ်ရတာ ပိုခက်ခဲစေပါတယ်။

တစ်ဖက်မှာတော့ — third-party transpiler ဒါမှမဟုတ် bundler တစ်ခုက process လုပ်တဲ့ application တစ်ခုမှာ — `esModuleInterop` enable လုပ်ခြင်းက ပိုအရေးကြီးပါတယ်။ Bundlers ရော transpilers ရော အားလုံးလိုလိုက `esModuleInterop` ပုံစံ emit strategy ကို သုံးကြတာမို့ — TypeScript ကလည်း သူ့ရဲ့ checking ကို ကိုက်ညီအောင် ချိန်ညှိဖို့ လိုအပ်ပါတယ်။ (Compiler က `tsc` က emit လုပ်မယ့် JavaScript files တွေထဲမှာ ဘာတွေ ဖြစ်မယ်ဆိုတာကို အမြဲတမ်း တွေးဆဆင်ခြင်တာမို့ — `tsc` အစား တခြား tool တစ်ခု သုံးနေရင်တောင် — emit ကို သက်ရောက်မှုရှိတဲ့ compiler options တွေကို အဲဒီ tool ရဲ့ output နဲ့ တတ်နိုင်သမျှ နီးကပ်အောင် သတ်မှတ်ထားသင့်ပါတယ်။)

`esModuleInterop` မပါဘဲ `allowSyntheticDefaultImports` တစ်ခုတည်းကိုတော့ ရှောင်ရှားသင့်ပါတယ်။ ဒါက `tsc` က emit လုပ်တဲ့ code ကို မပြောင်းဘဲ compiler ရဲ့ checking အပြုအမူကို ပြောင်းလဲစေပြီး — မလုံခြုံနိုင်တဲ့ JavaScript တွေ emit ဖြစ်စေနိုင်ပါတယ်။ ဒါ့အပြင် — ဒါက မိတ်ဆက်ပေးတဲ့ checking အပြောင်းအလဲတွေက `esModuleInterop` က မိတ်ဆက်ပေးတဲ့ဟာတွေရဲ့ မပြည့်စုံတဲ့ ဗားရှင်းတစ်ခုပဲ ဖြစ်ပါတယ်။ `tsc` ကို emit အတွက် မသုံးဘူးဆိုရင်တောင် — `allowSyntheticDefaultImports` ထက် `esModuleInterop` ကို enable လုပ်တာက ပိုကောင်းပါတယ်။

`esModuleInterop` enable လုပ်ထားတဲ့အခါ `tsc` ရဲ့ JavaScript output ထဲမှာ ပါဝင်လာတဲ့ `__importDefault` နဲ့ `__importStar` helper functions တွေ ပါဝင်တာကို လူတချို့ ကန့်ကွက်ကြပါတယ် — disk ပေါ်မှာ output size ကို အနည်းငယ် တိုးစေလို့ ဒါမှမဟုတ် — helper တွေ အသုံးပြုတဲ့ interop algorithm က `__esModule` ကို စစ်ဆေးခြင်းအားဖြင့် Node.js ရဲ့ interop အပြုအမူကို လွဲမှားစွာ ကိုယ်စားပြုနေပုံရလို့ပါ — အစောပိုင်းမှာ ဆွေးနွေးခဲ့တဲ့ အန္တရာယ်တွေဆီ ဦးတည်စေပါတယ်။ ဒီကန့်ကွက်ချက် နှစ်ခုလုံးကို — `esModuleInterop` disable လုပ်ထားတဲ့အခါ ပြသလေ့ရှိတဲ့ ချို့ယွင်းတဲ့ checking အပြုအမူကို လက်မခံဘဲ — အနည်းဆုံး တစ်စိတ်တစ်ပိုင်း ဖြေရှင်းနိုင်ပါတယ်။ ပထမအချက်အနေနဲ့ — helper functions တွေကို လိုအပ်တဲ့ ဖိုင်တိုင်းထဲမှာ inline လုပ်မယ့်အစား `tslib` ကနေ import လုပ်ဖို့ `importHelpers` compiler option ကို သုံးနိုင်ပါတယ်။ ဒုတိယ ကန့်ကွက်ချက်ကို ဆွေးနွေးဖို့ — နောက်ဆုံး ဥပမာတစ်ခုကို ကြည့်ရအောင်:

```ts
// @Filename: node_modules/transpiled-dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /* ... */ };
exports.something = "something";

// @Filename: node_modules/true-cjs-dependency/index.js
module.exports = function doSomethingElse() { /* ... */ };

// @Filename: src/sayHello.ts
export default function sayHello() { /* ... */ }
export const hello = "hello";

// @Filename: src/main.ts
import doSomething from "transpiled-dependency";
import doSomethingElse from "true-cjs-dependency";
import sayHello from "./sayHello.js";
```

`src` ကို Node.js မှာ သုံးဖို့ CommonJS အဖြစ် compile လုပ်နေတယ်လို့ ယူဆကြည့်ပါ။ `allowSyntheticDefaultImports` ရော `esModuleInterop` ရော မပါဘဲ — `"true-cjs-dependency"` ကနေ `doSomethingElse` ကို import လုပ်တာက error တစ်ခု ဖြစ်ပြီး — ကျန်တာတွေကတော့ error မဟုတ်ပါဘူး။ Compiler options တွေ မပြောင်းဘဲ error ကို ဖြေရှင်းဖို့ဆိုရင် — import ကို `import doSomethingElse = require("true-cjs-dependency")` အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ ဒါပေမယ့် — module အတွက် types တွေ (ဒီမှာ မပြထားတဲ့) ဘယ်လို ရေးထားလဲဆိုတာပေါ် မူတည်ပြီး — namespace import တစ်ခုကို ရေးပြီး ခေါ်ဆိုနိုင်ကောင်းလည်း ရနိုင်ပါသေးတယ် — အဲဒါက language-level specification ချိုးဖောက်မှုတစ်ခု ဖြစ်ပါတယ်။ `esModuleInterop` နဲ့ဆိုရင် — ပြသထားတဲ့ imports တွေထဲက ဘယ်ဟာမှ error မဟုတ်တော့ဘူး (ပြီးတော့ အားလုံး callable ဖြစ်တယ်) — ဒါပေမယ့် invalid namespace import ကတော့ ဖမ်းမိမှာ ဖြစ်ပါတယ်။

`src` ကို Node.js မှာ true ESM အဖြစ် migrate လုပ်ဖို့ ဆုံးဖြတ်လိုက်ရင် (ဥပမာ — root package.json ထဲ `"type": "module"` ထည့်လိုက်ရင်) ဘာတွေ ပြောင်းသွားမလဲ။ ပထမ import — `"transpiled-dependency"` ကနေ `doSomething` — က နောက်တော့ callable မဟုတ်တော့ဘူး — သူက “double default” ပြဿနာကို ပြသပြီး — `doSomething()` အစား `doSomething.default()` လို့ ခေါ်ရတော့မယ်။ (TypeScript က ဒါကို `--module node16`—`nodenext` အောက်မှာ နားလည်ပြီး ဖမ်းမိပါတယ်။) ဒါပေမယ့် သိသာတာက — CommonJS အဖြစ် compile လုပ်တဲ့အခါ အလုပ်လုပ်ဖို့ `esModuleInterop` လိုအပ်ခဲ့တဲ့ _ဒုတိယ_ import — `doSomethingElse` က true ESM မှာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။

ဒီမှာ ညည်းညူစရာ တစ်ခုခု ရှိမယ်ဆိုရင် — အဲဒါက `esModuleInterop` က ဒုတိယ import နဲ့ လုပ်တဲ့အရာတွေ မဟုတ်ပါဘူး။ သူလုပ်တဲ့ အပြောင်းအလဲတွေ — default import ကို ခွင့်ပြုခြင်းရော callable namespace imports တွေကို တားမြစ်ခြင်းရော နှစ်ခုလုံးက Node.js ရဲ့ တကယ့် ESM/CJS interop strategy နဲ့ အတိအကျ လိုက်လျောညီထွေဖြစ်ပြီး — true ESM ဆီ migrate လုပ်ရတာ ပိုလွယ်ကူစေခဲ့ပါတယ်။ ပြဿနာ ရှိရင် — အဲဒါက `esModuleInterop` က _ပထမ_ import အတွက် ချောမွေ့တဲ့ migration လမ်းကြောင်းတစ်ခု ပေးဖို့ မအောင်မြင်ပုံရတာပါ။ ဒါပေမယ့် ဒီပြဿနာကို `esModuleInterop` enable လုပ်ခြင်းက မိတ်ဆက်ပေးတာ မဟုတ်ပါဘူး; ပထမ import က ဒါနဲ့ လုံးဝ သက်ရောက်မှု မရှိခဲ့ပါဘူး။ ကံမကောင်းတာက — `main.ts` နဲ့ `sayHello.ts` ကြားက semantic contract ကို မချိုးဖျက်ဘဲ ဒီပြဿနာကို ဖြေရှင်းလို့ မရပါဘူး — `sayHello.ts` ရဲ့ CommonJS output က `transpiled-dependency/index.js` နဲ့ ဖွဲ့စည်းပုံအရ ထပ်တူတူညီနေလို့ပါ။ `esModuleInterop` က `doSomething` ရဲ့ transpiled import အလုပ်လုပ်ပုံကို Node.js ESM မှာ အလုပ်လုပ်မယ့်ပုံနဲ့ တူအောင် ပြောင်းလိုက်ရင် — `sayHello` import ရဲ့ အပြုအမူကိုပါ အလားတူ ပြောင်းလဲသွားစေပြီး — input code က ESM semantics တွေကို ချိုးဖောက်စေမှာ ဖြစ်ပါတယ် (ဒါကြောင့် `src` directory ကို ပြောင်းလဲစရာမလိုဘဲ ESM ဆီ migrate လုပ်တာကို ဆက်လက် တားဆီးနေဦးမှာပါ)။

မြင်ခဲ့ရသလိုပဲ — transpiled modules တွေကနေ true ESM ဆီ ချောမွေ့စွာ migrate လုပ်တဲ့ လမ်းကြောင်းဆိုတာ မရှိပါဘူး။ ဒါပေမယ့် `esModuleInterop` က မှန်ကန်တဲ့ ဦးတည်ချက်ဆီ ခြေလှမ်းတစ်ခုပါ။ Module syntax transformations တွေရော import helper functions တွေ ပါဝင်တာကိုပါ အနည်းဆုံး ဖြစ်စေချင်တဲ့သူတွေအတွက်ဆိုရင် — `esModuleInterop` ကို disable လုပ်တာထက် `verbatimModuleSyntax` ကို enable လုပ်တာက ပိုကောင်းတဲ့ ရွေးချယ်မှုပါ။ `verbatimModuleSyntax` က — CommonJS-emitting files တွေမှာ `import mod = require("mod")` နဲ့ `export = ns` syntax တွေကို သုံးဖို့ အတင်းအကျပ် လုပ်ဆောင်ပြီး — ဆွေးနွေးခဲ့တဲ့ import ambiguity မျိုးစုံကို ရှောင်ရှားပေးပါတယ် — true ESM ဆီ migrate လုပ်ရတာ လွယ်ကူမှုကိုတော့ အရှုံးပေးရပါတယ်။

### Library code needs special considerations (Library code တွေက အထူး ထည့်သွင်းစဉ်းစားမှုတွေ လိုအပ်ပါတယ်)

CommonJS အဖြစ် ဖြန့်ဝေတဲ့ libraries တွေက default exports တွေကို ရှောင်သင့်ပါတယ် — အဲဒီ transpiled exports တွေကို ဝင်ရောက်သုံးစွဲနိုင်တဲ့ နည်းလမ်းတွေက tools တွေရော runtimes တွေကြားမှာ ကွဲပြားနေပြီး — နည်းလမ်းတချို့က users တွေအတွက် ရှုပ်ထွေးစေနိုင်လို့ပါ။ `tsc` က CommonJS အဖြစ် transpile လုပ်ထားတဲ့ default export တစ်ခုကို — Node.js မှာတော့ default import တစ်ခုရဲ့ default property အဖြစ် ဝင်ရောက်လို့ရပါတယ်:

```js
import pkg from "pkg";
pkg.default();
```

bundlers အများစု ဒါမှမဟုတ် transpiled ESM တွေမှာတော့ — default import ကိုယ်တိုင်အနေနဲ့:

```js
import pkg from "pkg";
pkg();
```

ပြီးတော့ vanilla CommonJS မှာတော့ — `require` call တစ်ခုရဲ့ default property အဖြစ်:

```js
const pkg = require("pkg");
pkg.default();
```

Users တွေက default import တစ်ခုရဲ့ `.default` property ကို ဝင်ရောက်ရတော့မယ်ဆိုရင် — misconfigured (လွဲမှားစွာ ပြင်ဆင်ထားတဲ့) module တစ်ခုရဲ့ အနံ့အသက်ကို ခံစားမိမှာ ဖြစ်ပြီး — Node.js ရော bundler တစ်ခုမှာပါ run မယ့် code ရေးဖို့ ကြိုးစားနေတယ်ဆိုရင် — ပိတ်မိနေနိုင်ပါတယ်။ Third-party TypeScript transpilers တချို့က — ဒီကွာခြားချက်ကို လျှော့ချဖို့ default exports တွေ emit လုပ်ပုံကို ပြောင်းလဲပေးတဲ့ options တွေကို ထုတ်ဖော်ပြသပေမယ့် — သူတို့ကိုယ်ပိုင် declaration (`.d.ts`) files တွေကို ထုတ်လုပ်ပေးမှာ မဟုတ်တာမို့ — runtime အပြုအမူနဲ့ type checking ကြားမှာ မကိုက်ညီမှုတစ်ခု ဖြစ်ပေါ်ပြီး — users တွေကို ပိုရှုပ်ထွေးစေကာ စိတ်ပျက်စေပါတယ်။ Default exports တွေ သုံးမယ့်အစား — CommonJS အဖြစ် ဖြန့်ဝေဖို့ လိုအပ်တဲ့ libraries တွေက — main export တစ်ခုတည်း ရှိတဲ့ modules တွေအတွက် `export =` ကို သုံးသင့်ပြီး — exports အများကြီး ရှိတဲ့ modules တွေအတွက်တော့ named exports တွေကို သုံးသင့်ပါတယ်:

```diff
- export default function doSomething() { /* ... */ }
+ export = function doSomething() { /* ... */ }
```

(Declaration files တွေ ဖြန့်ဝေတဲ့) Libraries တွေက — သူတို့ ရေးတဲ့ types တွေ compiler options အမျိုးမျိုးအောက်မှာ error ကင်းကင်း ရှိစေဖို့ အထူး ဂရုစိုက်သင့်ပါတယ်။ ဥပမာ — interface တစ်ခုကို နောက် interface တစ်ခုကနေ — `strictNullChecks` disable လုပ်ထားမှသာ အောင်မြင်စွာ compile ဖြစ်မယ့်ပုံစံမျိုးနဲ့ — extend လုပ်ထားတာ ရေးလို့ရပါတယ်။ Library တစ်ခုက ဒီလို types တွေ publish လုပ်လိုက်မယ်ဆိုရင် — သူ့ရဲ့ users အားလုံးကိုပါ `strictNullChecks` ကို disable လုပ်ခိုင်းသလို ဖြစ်သွားမှာပါ။ `esModuleInterop` က type declarations တွေထဲမှာ အလားတူ “infectious” (ကူးစက်တတ်တဲ့) default imports တွေ ပါဝင်စေနိုင်ပါတယ်:

```ts
// @Filename: /node_modules/dependency/index.d.ts
import express from "express";
declare function doSomething(req: express.Request): any;
export = doSomething;
```

ဒီ default import က `esModuleInterop` enable လုပ်ထားမှပဲ အလုပ်လုပ်ပြီး — ဒီ option မရှိတဲ့ user တစ်ယောက်က ဒီဖိုင်ကို ရည်ညွှန်းတဲ့အခါ error တက်စေတယ်ဆိုပါစို့။ အဲဒီ user က `esModuleInterop` ကို _ဖြစ်ဖြစ်ချင်_ enable လုပ်သင့်တာပါ — ဒါပေမယ့် libraries တွေက သူတို့ရဲ့ configurations တွေကို ဒီလို ကူးစက်တတ်အောင် လုပ်တာက ပုံမှန်အားဖြင့် မကောင်းတဲ့ အလေ့အကျင့်တစ်ခုအဖြစ် ရှုမြင်ကြပါတယ်။ Library အတွက် ဒီလို declaration file တစ်ခုကို ဖြန့်ဝေတာက အများကြီး ပိုကောင်းပါတယ်:

```ts
import express = require("express");
// ...
```

ဒီလို ဥပမာတွေကြောင့် — libraries တွေက `esModuleInterop` ကို _မဖွင့်သင့်_ ဘူးဆိုတဲ့ သမားရိုးကျ အသိပညာ (conventional wisdom) တစ်ခု ဖြစ်ပေါ်လာခဲ့ပါတယ်။ ဒီအကြံပြုချက်က ကျိုးကြောင်းဆီလျော်တဲ့ အစပြုချက်တစ်ခုပါ — ဒါပေမယ့် — `esModuleInterop` enable လုပ်တဲ့အခါ namespace import တစ်ခုရဲ့ type ပြောင်းလဲသွားပြီး — error တစ်ခုကို _စတင်မိတ်ဆက်_ စေနိုင်တဲ့ ဥပမာတွေကို ငါတို့ ကြည့်ခဲ့ပြီးပါပြီ။ ဒါကြောင့် — libraries တွေက `esModuleInterop` နဲ့ပဲ ဖြစ်ဖြစ် မပါဘဲပဲ ဖြစ်ဖြစ် compile လုပ်တာ — သူတို့ရဲ့ ရွေးချယ်မှုကို ကူးစက်တတ်စေမယ့် syntax တွေ ရေးမိနိုင်တဲ့ အန္တရာယ် ရှိပါတယ်။

အမြင့်ဆုံး compatibility ကို သေချာစေချင်တဲ့ library authors တွေအတွက် — သူတို့ရဲ့ declaration files တွေကို compiler options တွေရဲ့ matrix တစ်ခုပေါ်မှာ validate လုပ်ကြည့်တာ ကောင်းပါတယ်။ ဒါပေမယ့် `verbatimModuleSyntax` ကို သုံးခြင်းက — CommonJS-emitting files တွေကို CommonJS-style import နဲ့ export syntax တွေ သုံးဖို့ အတင်းအကျပ် လုပ်ခြင်းအားဖြင့် — `esModuleInterop` နဲ့ဆိုင်တဲ့ ပြဿနာကို လုံးဝ ရှောင်ကွင်းသွားပါတယ်။ ဒါ့အပြင် — `esModuleInterop` က CommonJS ကိုပဲ သက်ရောက်မှုရှိတာမို့ — အချိန်ကြာလာတာနဲ့အမျှ libraries တွေ ESM-only publishing ဆီ ရွေ့လာတာနဲ့ — ဒီပြဿနာရဲ့ သက်ဆိုင်မှုက လျော့ကျလာပါလိမ့်မယ်။
