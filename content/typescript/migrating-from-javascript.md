---
title: "Migrating from JavaScript (JavaScript ကနေ TypeScript ဆီ ပြောင်းရွှေ့ခြင်း)"
description: "JavaScript codebase တစ်ခုကို TypeScript ဆီ ပြောင်းရွှေ့နည်း — directory setup, tsconfig.json ရေးခြင်း, build tools (Gulp/Webpack) နဲ့ ပေါင်းစည်းခြင်း, .js → .ts ပြောင်းခြင်း, error တွေ ဖြေရှင်းခြင်း နဲ့ stricter checks"
order: 17
source: "https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html"
status: translated
updated: 2026-09-01
---

TypeScript က လေဟာနယ်ထဲမှာ တည်ရှိနေတာ မဟုတ်ပါဘူး။
သူ့ကို JavaScript ecosystem ကို စိတ်ထဲမှာ ထားပြီး တည်ဆောက်ခဲ့တာဖြစ်ပြီး — ဒီနေ့ JavaScript အများကြီး တည်ရှိနေပါတယ်။
JavaScript codebase တစ်ခုကို TypeScript အဖြစ် ပြောင်းလဲတာက — နည်းနည်း ငြီးငွေ့စရာ ကောင်းပေမယ့် — များသောအားဖြင့် မခက်ခဲပါဘူး။
ဒီ tutorial မှာ — ဘယ်လို စတင်ရမလဲဆိုတာကို ကြည့်ကြရအောင်။
TypeScript code အသစ်တွေ ရေးနိုင်ဖို့ handbook ကို လုံလောက်အောင် ဖတ်ပြီးပြီလို့ ယူဆပါတယ်။

React project တစ်ခုကို ပြောင်းဖို့ ရှာနေတယ်ဆိုရင် — [React Conversion Guide](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide) ကို အရင်ကြည့်ဖို့ အကြံပြုပါတယ်။

## Directory တွေ စနစ်တကျ ပြင်ဆင်ခြင်း

သင်က plain JavaScript နဲ့ ရေးနေတယ်ဆိုရင် — JavaScript ကို တိုက်ရိုက် run နေတာ ဖြစ်နိုင်ပါတယ်။
သင့်ရဲ့ `.js` files တွေက `src` ၊ `lib` ဒါမှမဟုတ် `dist` directory တစ်ခုထဲမှာ ရှိပြီး — လိုသလို run လုပ်နေတာပါ။

အဲဒီလိုဆိုရင် — သင်ရေးထားတဲ့ files တွေက TypeScript ရဲ့ inputs အဖြစ် သုံးခံရပြီး — သူထုတ်ပေးတဲ့ outputs တွေကို သင် run ပါလိမ့်မယ်။
JS ကနေ TS ပြောင်းရွှေ့တဲ့ ကာလအတွင်းမှာ — TypeScript က input files တွေကို overwrite မလုပ်မိအောင် input files တွေကို သီးခြား ခွဲထားဖို့ လိုပါမယ်။
သင့် output files တွေကို သတ်မှတ်ထားတဲ့ directory တစ်ခုထဲမှာ ထားဖို့ လိုအပ်ရင် — အဲဒါက သင့်ရဲ့ output directory ဖြစ်ပါလိမ့်မယ်။

သင့် JavaScript ပေါ်မှာ — bundling ဒါမှမဟုတ် Babel လိုမျိုး တခြား transpiler သုံးတာလိုမျိုး — intermediate steps တချို့လည်း run နေနိုင်ပါတယ်။
ဒီကိစ္စမှာ — ဒီလိုမျိုး folder structure တစ်ခု ရှိပြီးသား ဖြစ်နိုင်ပါတယ်။

ဒီကစပြီး — သင့်ရဲ့ directory က ဒီလိုမျိုး ပြင်ဆင်ထားတယ်လို့ ယူဆပါမယ်:

```
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
```

သင့်ရဲ့ `src` directory အပြင်ဘက်မှာ `tests` folder တစ်ခု ရှိနေရင် — `src` ထဲမှာ `tsconfig.json` တစ်ခု ၊ `tests` ထဲမှာ နောက်တစ်ခု ရှိနိုင်ပါတယ်။

## Configuration File ရေးခြင်း

TypeScript က သင့် project ရဲ့ options တွေ — ဘယ် files တွေ ထည့်သွင်းချင်လဲ ၊ ဘယ်လို checking အမျိုးအစားတွေ လုပ်ချင်လဲ စတာတွေ — စီမံခန့်ခွဲဖို့ `tsconfig.json` ဆိုတဲ့ ဖိုင်ကို သုံးပါတယ်။
ကျွန်တော်တို့ project အတွက် အနည်းဆုံး (bare-bones) တစ်ခု ဖန်တီးကြည့်ရအောင်:

```json
{
  "compilerOptions": {
    "outDir": "./built",
    "allowJs": true,
    "target": "es5"
  },
  "include": ["./src/**/*"]
}
```

ဒီမှာ TypeScript ကို အချက်အနည်းငယ် သတ်မှတ်ပေးထားပါတယ်:

1. `src` directory ထဲမှာ သူ နားလည်တဲ့ ဖိုင်တွေကို ဖတ်ပါ ( [`include`](https://www.typescriptlang.org/tsconfig#include) နဲ့) ။
2. JavaScript files တွေကို inputs အဖြစ် လက်ခံပါ ( [`allowJs`](https://www.typescriptlang.org/tsconfig#allowJs) နဲ့) ။
3. Output files တွေ အားလုံးကို `built` ထဲမှာ emit လုပ်ပါ ( [`outDir`](https://www.typescriptlang.org/tsconfig#outDir) နဲ့) ။
4. JavaScript constructs အသစ်တွေကို ECMAScript 5 လိုမျိုး ဗားရှင်းအဟောင်းဆီ ပြန်ပြောင်းပါ ( [`target`](https://www.typescriptlang.org/tsconfig#target) သုံးပြီး) ။

ဒီအချိန်မှာ — project ရဲ့ root မှာ `tsc` run ကြည့်ရင် — `built` directory ထဲမှာ output files တွေ တွေ့ရမှာ ပါ။
`built` ထဲက files တွေရဲ့ layout က `src` ရဲ့ layout နဲ့ ထပ်တူကျနေမှာ ပါ။
အခုဆိုရင် သင့် project မှာ TypeScript အလုပ်လုပ်နေပါပြီ။

## အစောပိုင်း အကျိုးကျေးဇူးများ

ဒီအချိန်မှာတောင် — TypeScript က သင့် project ကို နားလည်ခြင်းကနေ ကြီးမားတဲ့ အကျိုးကျေးဇူးတွေ ရနိုင်ပါပြီ။
[VS Code](https://code.visualstudio.com) ဒါမှမဟုတ် [Visual Studio](https://visualstudio.com) လိုမျိုး editor တစ်ခု ဖွင့်ကြည့်ရင် — completion လိုမျိုး tooling support တွေ မကြာခဏ ရနိုင်တာ တွေ့ရပါလိမ့်မယ်။
ဒါ့အပြင် — အောက်ပါ options တွေလိုမျိုး နဲ့ bug တချို့ကိုလည်း ဖမ်းမိနိုင်ပါတယ်:

- [`noImplicitReturns`](https://www.typescriptlang.org/tsconfig#noImplicitReturns) — function တစ်ခုရဲ့ အဆုံးမှာ return လုပ်ဖို့ မေ့နေတာကို တားဆီးပေးပါတယ်။
- [`noFallthroughCasesInSwitch`](https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch) — `switch` block ထဲက `case` တွေကြားမှာ `break` statement တစ်ခု မမေ့ချင်ရင် အသုံးဝင်ပါတယ်။

TypeScript က unreachable code နဲ့ labels တွေအကြောင်းလည်း သတိပေးပါလိမ့်မယ် — အဲဒါတွေကို [`allowUnreachableCode`](https://www.typescriptlang.org/tsconfig#allowUnreachableCode) နဲ့ [`allowUnusedLabels`](https://www.typescriptlang.org/tsconfig#allowUnusedLabels) တွေနဲ့ အသီးသီး ပိတ်ထားနိုင်ပါတယ်။

## Build Tools နဲ့ ပေါင်းစည်းခြင်း

သင့် pipeline ထဲမှာ build steps တချို့ ထပ်ရှိနေနိုင်ပါတယ်။
ဥပမာ — သင့် ဖိုင်တစ်ခုချင်းစီဆီ တစ်ခုခု ပေါင်းထည့်နေတာ ဖြစ်နိုင်ပါတယ်။
Build tool တစ်ခုချင်းစီက မတူပေမယ့် — အဓိက အချက်တွေကို အကောင်းဆုံး ကြိုးစား လွှမ်းခြုံပေးပါမယ်။

### Gulp

သင်က Gulp ကို တစ်နည်းနည်းနဲ့ သုံးနေတယ်ဆိုရင် — TypeScript နဲ့ [Gulp သုံးနည်း](https://www.typescriptlang.org/docs/handbook/gulp.html) tutorial တစ်ခု ရှိပြီး — Browserify ၊ Babelify ၊ Uglify လိုမျိုး အသုံးများတဲ့ build tools တွေနဲ့ ပေါင်းစည်းခြင်းအကြောင်းလည်း ပါဝင်ပါတယ်။
အဲဒီမှာ ဆက်ဖတ်နိုင်ပါတယ်။

### Webpack

Webpack နဲ့ ပေါင်းစည်းတာကတော့ အတော်လေး ရိုးရှင်းပါတယ်။
ပိုလွယ်ကူတဲ့ debugging အတွက် — TypeScript loader ဖြစ်တဲ့ `ts-loader` ကို `source-map-loader` နဲ့ တွဲသုံးနိုင်ပါတယ်။
ရိုးရိုး run လိုက်ရုံပါပဲ:

```shell
npm install ts-loader source-map-loader
```

ပြီးတော့ အောက်ပါ options တွေကို သင့်ရဲ့ `webpack.config.js` ဖိုင်ထဲ ပေါင်းထည့်လိုက်ပါ:

```js
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },

  // webpack ရဲ့ output ကို debugging လုပ်ဖို့ sourcemaps ဖွင့်ထားပါတယ်။
  devtool: "source-map",

  resolve: {
    // '.ts' နဲ့ '.tsx' တွေကို resolvable extensions အဖြစ် ထည့်ပါတယ်။
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      // '.ts' ဒါမှမဟုတ် '.tsx' extension ရှိတဲ့ ဖိုင်တွေ အားလုံးကို 'ts-loader' က ကိုင်တွယ်ပါလိမ့်မယ်။
      { test: /\.tsx?$/, loader: "ts-loader" },

      // Output '.js' ဖိုင်တွေ အားလုံးရဲ့ sourcemaps တွေကို 'source-map-loader' က ပြန်လည် လုပ်ဆောင်ပါလိမ့်မယ်။
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  // တခြား options တွေ...
};
```

ts-loader က `.js` files တွေကို ကိုင်တွယ်တဲ့ တခြား loader တွေထက် အရင် run ဖို့ လိုတယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။

Webpack သုံးတဲ့ ဥပမာတစ်ခုကို [React နဲ့ Webpack tutorial](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) မှာ ကြည့်နိုင်ပါတယ်။

## TypeScript Files ဆီ ပြောင်းရွှေ့ခြင်း

ဒီအချိန်မှာ — သင် TypeScript files တွေ စသုံးဖို့ အသင့်ဖြစ်နေပါပြီ။
ပထမဆုံး အဆင့်က — သင့်ရဲ့ `.js` ဖိုင်တစ်ခုကို `.ts` အဖြစ် နာမည်ပြောင်းဖို့ပါ။
သင့်ဖိုင်က JSX သုံးရင် — `.tsx` အဖြစ် နာမည်ပြောင်းဖို့ လိုပါတယ်။

ဒီအဆင့် ပြီးပြီလား?
ကောင်းပါပြီ!
ဖိုင်တစ်ခုကို JavaScript ကနေ TypeScript အဖြစ် အောင်မြင်စွာ ပြောင်းရွှေ့ပြီးပါပြီ!

ဟုတ်ပါတယ် — အဲဒါက မှန်ကန်တယ်လို့ ခံစားရမှာ မဟုတ်ပါဘူး။
TypeScript support ရှိတဲ့ editor တစ်ခုမှာ အဲဒီဖိုင်ကို ဖွင့်ကြည့်ရင် (ဒါမှမဟုတ် `tsc --pretty` run ကြည့်ရင်) — line တချို့ပေါ်မှာ အနီရောင် squiggles တွေ တွေ့ရနိုင်ပါတယ်။
ဒါတွေကို Microsoft Word လိုမျိုး editor ထဲက အနီရောင် squiggles တွေလိုပဲ ထင်မှတ်သင့်ပါတယ်။
TypeScript က သင့် code ကို ဆက်ပြီး ပြောင်းပေးဦးမှာပါ — Word က သင့် documents တွေကို print လုပ်ခွင့် ပေးဦးမှာလိုပါပဲ။

အဲဒါက သိပ်လျော့ရဲလွန်းတယ်လို့ ထင်ရင် — အပြုအမူကို တင်းကျပ်အောင် လုပ်လို့ရပါတယ်။
ဥပမာ — error တွေ ရှိနေတဲ့အခါ TypeScript က JavaScript အဖြစ် compile မလုပ်စေချင်ဘူးဆိုရင် — [`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError) option ကို သုံးနိုင်ပါတယ်။
ဒီသဘောအရ — TypeScript မှာ strictness အတွက် dial တစ်ခု ရှိပြီး — သင် အဲဒီ knob ကို ကြိုက်သလောက် အပေါ်ဆုံးအထိ တိုးလို့ရပါတယ်။

ရနိုင်တဲ့ stricter settings တွေကို သုံးဖို့ စီစဉ်ထားရင် — အခုပဲ ဖွင့်ထားတာ အကောင်းဆုံးပါ (အောက်မှာ ဖော်ပြမယ့် Getting Stricter Checks section ကို ကြည့်ပါ) ။
ဥပမာ — သင် အတိအကျ ပြောမထားဘဲ type တစ်ခုအတွက် TypeScript က `any` ကို တိတ်တဆိတ် infer လုပ်တာကို လုံးဝ မလိုချင်ဘူးဆိုရင် — ဖိုင်တွေ မပြင်ခင် [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) ကို သုံးနိုင်ပါတယ်။
အနည်းငယ် လွှမ်းမိုးခံရသလို ခံစားရနိုင်ပေမယ့် — ရေရှည် အကျိုးကျေးဇူးတွေက ပိုမြန်မြန် ထင်ရှားလာပါလိမ့်မယ်။

### Error တွေကို ရှာဖွေဖယ်ရှားခြင်း

အစောပိုင်းမှာ ပြောခဲ့သလိုပဲ — ပြောင်းရွှေ့ပြီးနောက် error messages တွေ ရတာက မမျှော်လင့်စရာ မဟုတ်ပါဘူး။
အရေးကြီးတာက — ဒီ error တွေကို တစ်ခုချင်းစီ ဖြတ်သန်းပြီး ဘယ်လို ကိုင်တွယ်ရမလဲ ဆုံးဖြတ်ဖို့ပါ။
မကြာခဏဆိုသလို ဒါတွေက တကယ့် bugs တွေ ဖြစ်ပေမယ့် — တစ်ခါတလေတော့ သင် ဘာလုပ်ဖို့ ကြိုးစားနေလဲဆိုတာကို TypeScript ကို နည်းနည်း ပိုရှင်းပြဖို့ လိုပါတယ်။

#### Modules တွေကနေ Import လုပ်ခြင်း

`Cannot find name 'require'.` နဲ့ `Cannot find name 'define'.` လိုမျိုး error တွေ အများကြီးနဲ့ စတင်တွေ့ရနိုင်ပါတယ်။
ဒီလိုကိစ္စမျိုးမှာ — သင် modules တွေ သုံးနေတာ ဖြစ်နိုင်ပါတယ်။
ဒီဟာတွေ တည်ရှိတယ်လို့ TypeScript ကို ယုံကြည်စေဖို့ အောက်ပါအတိုင်း ရေးပြီး လုပ်နိုင်ပေမယ့်:

```ts
// For Node/CommonJS
declare function require(path: string): any;
```

ဒါမှမဟုတ်:

```ts
// For RequireJS/AMD
declare function define(...args: any[]): any;
```

ဒီ calls တွေကို ဖယ်ရှားပြီး — imports တွေအတွက် TypeScript syntax ကို သုံးတာက ပိုကောင်းပါတယ်။

ပထမဆုံး — TypeScript ရဲ့ [`module`](https://www.typescriptlang.org/tsconfig#module) option ကို set လုပ်ပြီး module system တစ်ခုခုကို ဖွင့်ဖို့ လိုပါတယ်။
ရနိုင်တဲ့ options တွေက `commonjs` ၊ `amd` ၊ `system` နဲ့ `umd` ပါ။

အောက်ပါ Node/CommonJS code ရှိခဲ့ရင်:

```js
var foo = require("foo");

foo.doStuff();
```

ဒါမှမဟုတ် အောက်ပါ RequireJS/AMD code ရှိခဲ့ရင်:

```js
define(["foo"], function (foo) {
  foo.doStuff();
});
```

ဒါဆိုရင် အောက်ပါ TypeScript code ကို ရေးရပါမယ်:

```ts
import foo = require("foo");

foo.doStuff();
```

#### Declaration Files ရယူခြင်း

TypeScript imports တွေဆီ စပြောင်းနေရင် — `Cannot find module 'foo'.` လိုမျိုး error တွေ တွေ့ရဖို့ များပါတယ်။
ဒီမှာ ပြဿနာက — သင့်မှာ သင့် library ကို ဖော်ပြတဲ့ _declaration files_ မရှိတာ ဖြစ်နိုင်ပါတယ်။
ကံကောင်းတာက ဒါက အတော်လေး လွယ်ပါတယ်။
`lodash` လိုမျိုး package တစ်ခုအကြောင်း TypeScript က ပြောလာရင် — ရိုးရိုး ဒီလို ရေးလိုက်ရုံပါပဲ:

```shell
npm install -S @types/lodash
```

သင်က `commonjs` မဟုတ်တဲ့ module option တစ်ခုခု သုံးနေရင် — သင့်ရဲ့ [`moduleResolution`](https://www.typescriptlang.org/tsconfig#moduleResolution) option ကို `node` ဆီ set လုပ်ဖို့ လိုပါတယ်။

အဲဒါပြီးရင် — lodash ကို ပြဿနာ တစ်စုံတစ်ရာ မရှိဘဲ import လုပ်နိုင်ပြီး — တိကျတဲ့ completions တွေလည်း ရပါလိမ့်မယ်။

#### Modules တွေကနေ Export လုပ်ခြင်း

ပုံမှန်အားဖြင့် — module တစ်ခုကနေ export လုပ်တာက `exports` ဒါမှမဟုတ် `module.exports` လိုမျိုး value တစ်ခုဆီ properties တွေ ထည့်သွင်းခြင်း ပါဝင်ပါတယ်။
TypeScript က top-level export statements တွေကို သုံးခွင့် ပေးပါတယ်။
ဥပမာ — function တစ်ခုကို ဒီလို export လုပ်ခဲ့ရင်:

```js
module.exports.feedPets = function (pets) {
  // ...
};
```

ဒီလို ရေးနိုင်ပါတယ်:

```ts
export function feedPets(pets) {
  // ...
}
```

တစ်ခါတလေ — exports object တစ်ခုလုံးကို လုံးဝ ပြန်ရေးလွှမ်းမိုးမိနိုင်ပါတယ်။
ဒါက — modules တွေကို ချက်ချင်း call လုပ်လို့ရအောင် လုပ်တဲ့ အသုံးများတဲ့ pattern တစ်ခုပါ — ဒီ snippet လိုမျိုးပါ:

```js
var express = require("express");
var app = express();
```

အရင်က အဲဒါကို ဒီလို ရေးခဲ့ဖူးနိုင်ပါတယ်:

```js
function foo() {
  // ...
}
module.exports = foo;
```

TypeScript မှာ — ဒါကို `export =` construct နဲ့ model လုပ်နိုင်ပါတယ်။

```ts
function foo() {
  // ...
}
export = foo;
```

#### Argument အရမ်းများခြင်း/နည်းခြင်း

Function တစ်ခုကို argument အရမ်းများ/နည်းနဲ့ ခေါ်နေတာ တစ်ခါတလေ တွေ့ရပါလိမ့်မယ်။
ပုံမှန်အားဖြင့် — ဒါက bug တစ်ခုပါ။ ဒါပေမယ့် — တချို့ကိစ္စတွေမှာ — parameter တွေကို ရေးမယ့်အစား `arguments` object ကို သုံးတဲ့ function တစ်ခုကို ကြေညာထားမိနိုင်ပါတယ်:

```js
function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}

myCoolFunction(
  function (x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function (x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);
```

ဒီကိစ္စမှာ — `myCoolFunction` ကို ခေါ်လို့ရတဲ့ နည်းလမ်းတွေကို function overloads သုံးပြီး caller တွေ အားလုံးကို ပြောပြဖို့ TypeScript ကို သုံးဖို့ လိုပါတယ်။

```ts
function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void;
function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}
```

`myCoolFunction` ဆီ overload signature နှစ်ခု ထည့်လိုက်ပါတယ်။
ပထမတစ်ခုက — `myCoolFunction` က function တစ်ခု (`number` ကို လက်ခံတဲ့ function) ပြီးတော့ `number` တွေရဲ့ list တစ်ခုကို လက်ခံတယ်လို့ ဖော်ပြပါတယ်။
ဒုတိယတစ်ခုကတော့ — function တစ်ခုကိုလည်း လက်ခံပြီး — အဲဒီနောက် rest parameter (`...nums`) ကိုသုံးပြီး — အဲဒီနောက်က argument တွေ ဘယ်နှစ်ခုမဆို `number` တွေ ဖြစ်ဖို့ လိုတယ်လို့ ဖော်ပြပါတယ်။

#### ဆက်တိုက် ထည့်သွင်းထားတဲ့ Properties

တချို့လူတွေက — object တစ်ခု ဖန်တီးပြီး properties တွေကို ချက်ချင်း နောက်ကလိုက်ပြီး ထည့်တာက ပိုလှတယ်လို့ ထင်ကြပါတယ်:

```js
var options = {};
options.color = "red";
options.volume = 11;
```

TypeScript က `options` ရဲ့ type ကို ပထမဆုံး `{}` — properties ဘာမှ မရှိတဲ့ — လို့ တွက်ထားလို့ `color` နဲ့ `volume` ဆီ assign လုပ်လို့မရဘူးလို့ ပြောပါလိမ့်မယ်။
အဲဒီအစား declarations တွေကို object literal ထဲကိုယ်တိုင် ရွှေ့ထည့်လိုက်ရင် — error တွေ ရှိမှာ မဟုတ်ပါဘူး:

```ts
let options = {
  color: "red",
  volume: 11,
};
```

`options` ရဲ့ type ကို သတ်မှတ်ပြီး object literal ပေါ်မှာ type assertion တစ်ခု ထည့်လို့လည်း ရပါတယ်။

```ts
interface Options {
  color: string;
  volume: number;
}

let options = {} as Options;
options.color = "red";
options.volume = 11;
```

တနည်းအားဖြင့် — `options` က `any` type လို့ ရိုးရိုးပြောလို့လည်း ရပါတယ် — အဲဒါက အလွယ်ဆုံး လုပ်နည်းဖြစ်ပေမယ့် — အကျိုးအမြတ် အနည်းဆုံး လည်း ဖြစ်ပါတယ်။

#### `any` ၊ `Object` နဲ့ `{}`

`Object` ဒါမှမဟုတ် `{}` က — အများစုအတွက် အထွေထွေဆုံး (most general) type ဖြစ်လို့ — value တစ်ခုပေါ်မှာ property ဘာမဆို ရှိနိုင်တယ်လို့ ပြောဖို့ သုံးချင်စိတ် ဖြစ်နိုင်ပါတယ်။
ဒါပေမယ့် **ဒီလိုအခြေအနေမျိုးမှာ တကယ်သုံးသင့်တာက `any` ပါ** — ဘာလို့လဲဆိုတော့ အဲဒါက အလိုက်လိုက်ဆုံး (most _flexible_) type ဖြစ်လို့ပါ။

ဥပမာ — `Object` အဖြစ် typed လုပ်ထားတဲ့ တစ်ခုခု ရှိရင် — `toLowerCase()` လိုမျိုး methods တွေကို ခေါ်လို့ မရပါဘူး။
ပိုအထွေထွေဆုံး (more general) ဆိုတာက များသောအားဖြင့် type နဲ့ လုပ်လို့ရတာတွေ ပိုနည်းတယ်လို့ ဆိုလိုပေမယ့် — `any` ကတော့ အထူးပါ — အထွေထွေဆုံး type ဖြစ်နေပြီး တစ်ချိန်တည်းမှာ ဘာမဆို လုပ်ခွင့် ပေးပါသေးတယ်။
ဆိုလိုတာက — သူ့ကို call လုပ်လို့ရတယ် ၊ construct လုပ်လို့ရတယ် ၊ properties တွေ access လုပ်လို့ရတယ် စသဖြင့်ပါ။
ဒါပေမယ့် — `any` သုံးတိုင်း — TypeScript က ပေးတဲ့ error checking နဲ့ editor support အများစုကို ဆုံးရှုံးတယ်ဆိုတာ သတိထားပါ။

ရွေးချယ်မှုက `Object` နဲ့ `{}` ကြားမှာ ကျသွားရင် — `{}` ကို ဦးစားပေးသင့်ပါတယ်။
အများအားဖြင့် ဆင်တူပေမယ့် — တချို့ esoteric cases တွေမှာ `{}` က `Object` ထက် ပိုအထွေထွေဆုံး type တစ်ခု ဖြစ်ပါတယ်။

### Stricter Checks ဖွင့်ခြင်း

TypeScript မှာ — သင့် program အတွက် ပိုလုံခြုံမှုနဲ့ ခွဲခြမ်းစိတ်ဖြာမှု ပေးဖို့ checks တချို့ ပါဝင်ပါတယ်။
သင့် codebase ကို TypeScript အဖြစ် ပြောင်းပြီးတာနဲ့ — ပိုလုံခြုံမှုအတွက် ဒီ checks တွေကို စတင် enable လုပ်နိုင်ပါတယ်။

#### Implicit `any` မရှိစေရန်

TypeScript က တချို့ types တွေ ဘာဖြစ်သင့်လဲဆိုတာ မတွက်နိုင်တဲ့ အခြေအနေတွေ ရှိပါတယ်။
တတ်နိုင်သမျှ လျော့ပေါ့ပေးဖို့ — အဲဒီနေရာမှာ `any` type ကို သုံးဖို့ ဆုံးဖြတ်ပါတယ်။
Migration အတွက် ဒါက ကောင်းပေမယ့် — `any` သုံးတာက type safety လုံးဝ မရဘူးလို့ ဆိုလိုပြီး — တခြားနေရာတွေမှာ ရမယ့် tooling support မျိုးလည်း ရမှာ မဟုတ်ပါဘူး။
ဒီနေရာတွေကို ရှာဖွေဖော်ပြပြီး error ပေးဖို့ — [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) option ကို သုံးနိုင်ပါတယ်။

#### Strict `null` & `undefined` Checks

Default အားဖြင့် — TypeScript က `null` နဲ့ `undefined` တွေက type တိုင်းရဲ့ domain ထဲမှာ ရှိတယ်လို့ ယူဆပါတယ်။
ဆိုလိုတာက — `number` type နဲ့ ကြေညာထားတဲ့ ဘာမဆို — `null` ဒါမှမဟုတ် `undefined` ဖြစ်နိုင်ပါတယ်။
`null` နဲ့ `undefined` တွေက JavaScript နဲ့ TypeScript ထဲမှာ bug တွေရဲ့ အဖြစ်များဆုံး အရင်းအမြစ်တွေ ဖြစ်လို့ — TypeScript မှာ ဒီပြဿနာတွေအတွက် စိတ်ပူစရာ သက်သာစေဖို့ [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) option ရှိပါတယ်။

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ဖွင့်ထားတဲ့အခါ — `null` နဲ့ `undefined` တွေက `null` နဲ့ `undefined` လို့ခေါ်တဲ့ ကိုယ်ပိုင် types တွေ သီးခြား ရပါတယ်။
တစ်ခုခုက _ဖြစ်နိုင်ခြေ_ ရှိတဲ့ `null` ဆိုရင် — မူရင်း type နဲ့ union type တစ်ခုကို သုံးနိုင်ပါတယ်။
ဒါကြောင့် ဥပမာ — တစ်ခုခုက `number` ဒါမှမဟုတ် `null` ဖြစ်နိုင်ရင် — type ကို `number | null` လို့ ရေးရပါမယ်။

TypeScript က value တစ်ခုက `null`/`undefined` ဖြစ်နိုင်တယ်လို့ ထင်နေပေမယ့် — သင်က ပိုသိတယ်ဆိုရင် — postfix `!` operator ကိုသုံးပြီး ဒါမဟုတ်ဘူးလို့ ပြောနိုင်ပါတယ်။

```ts
declare var foo: string[] | null;

foo.length; // error - 'foo' က 'null' ဖြစ်နိုင်ပါတယ်

foo!.length; // အဆင်ပြေပါတယ် - 'foo!' ရဲ့ type က 'string[]' ပါ
```

သတိပေးချက်အနေနဲ့ — [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) သုံးတဲ့အခါ — သင့် dependencies တွေကိုလည်း [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) သုံးဖို့ update လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

#### `this` အတွက် Implicit `any`

Classes တွေရဲ့ အပြင်ဘက်မှာ `this` keyword သုံးတဲ့အခါ — default အားဖြင့် type က `any` ဖြစ်ပါတယ်။
ဥပမာ — `Point` class တစ်ခုနဲ့ — method အဖြစ် ထည့်ချင်တဲ့ function တစ်ခုကို မြင်ယောင်ကြည့်ပါ:

```ts
class Point {
  constructor(public x, public y) {}
  getDistance(p: Point) {
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}
// ...

// Interface ကို ပြန်ဖွင့်ပါတယ်။
interface Point {
  distanceFromOrigin(): number;
}
Point.prototype.distanceFromOrigin = function () {
  return this.getDistance({ x: 0, y: 0 });
};
```

ဒါမှာ အပေါ်မှာ ပြောခဲ့တဲ့ ပြဿနာတွေ အတိုင်းပဲ ရှိပါတယ် — `getDistance` ကို စာလုံးပေါင်း မှားရေးမိရင်တောင် error မရဘဲ ကျော်သွားနိုင်ပါတယ်။
ဒီအကြောင်းကြောင့် — TypeScript မှာ [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) option ရှိပါတယ်။
အဲဒီ option set လုပ်ထားတဲ့အခါ — explicit (ဒါမှမဟုတ် inferred) type မရှိဘဲ `this` သုံးတဲ့အခါ TypeScript က error ထုတ်ပေးပါလိမ့်မယ်။
အဖြေကတော့ — interface ထဲမှာ ဒါမှမဟုတ် function ကိုယ်တိုင်ထဲမှာ — `this`-parameter ကိုသုံးပြီး explicit type ပေးဖို့ပါ:

```ts
Point.prototype.distanceFromOrigin = function (this: Point) {
  return this.getDistance({ x: 0, y: 0 });
};
```
