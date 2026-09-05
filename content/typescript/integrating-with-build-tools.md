---
title: "Integrating with Build Tools (Build Tools နဲ့ ပေါင်းစည်းခြင်း)"
description: "TypeScript ကို Babel, Browserify, Grunt, Gulp, Jspm, MSBuild, NuGet, Rollup, Svelte Compiler, Vite နဲ့ Webpack စတဲ့ build tools တွေနဲ့ ဘယ်လို ပေါင်းစည်း အသုံးပြုမလဲ"
order: 70
source: "https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html"
status: translated
updated: 2026-09-05
---

## Babel (JavaScript code ကို ပြောင်းလဲပေးသော Compiler)

### Install (Install လုပ်ခြင်း)

```sh
npm install @babel/cli @babel/core @babel/preset-typescript --save-dev
```

### .babelrc

```js
{
  "presets": ["@babel/preset-typescript"]
}
```

### Using Command Line Interface (Command Line Interface ကို အသုံးပြုခြင်း)

```sh
./node_modules/.bin/babel --out-file bundle.js src/index.ts
```

### package.json

```js
{
  "scripts": {
    "build": "babel --out-file bundle.js main.ts"
  },
}
```

### Execute Babel from the command line (Command Line ကနေ Babel ကို Run လုပ်ခြင်း)

```sh
npm run build
```

## Browserify (Browser အတွက် Module များကို Bundle လုပ်ပေးသော Tool)

### Install (Install လုပ်ခြင်း)

```sh
npm install tsify
```

### Using Command Line Interface (Command Line Interface ကို အသုံးပြုခြင်း)

```sh
browserify main.ts -p [ tsify --noImplicitAny ] > bundle.js
```

### Using API (API ကို အသုံးပြုခြင်း)

```js
var browserify = require("browserify");
var tsify = require("tsify");

browserify()
  .add("main.ts")
  .plugin("tsify", { noImplicitAny: true })
  .bundle()
  .pipe(process.stdout);
```

နောက်ထပ် အသေးစိတ်: [smrq/tsify](https://github.com/smrq/tsify)

## Grunt (Task Runner — အလုပ်များကို အလိုအလျောက် လုပ်ပေးသော Tool)

### Using `grunt-ts` (no longer maintained) (`grunt-ts` ကို အသုံးပြုခြင်း — ဆက်လက် ထိန်းသိမ်းမှု မရှိတော့ပါ)

#### Install (Install လုပ်ခြင်း)

```sh
npm install grunt-ts --save-dev
```

#### Basic Gruntfile.js (အခြေခံ Gruntfile.js)

```js
module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        src: ["**/*.ts", "!node_modules/**/*.ts"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
```

နောက်ထပ် အသေးစိတ်: [TypeStrong/grunt-ts](https://github.com/TypeStrong/grunt-ts)

### Using `grunt-browserify` combined with `tsify` (`tsify` နဲ့ တွဲထားတဲ့ `grunt-browserify` ကို အသုံးပြုခြင်း)

#### Install (Install လုပ်ခြင်း)

```sh
npm install grunt-browserify tsify --save-dev
```

#### Basic Gruntfile.js (အခြေခံ Gruntfile.js)

```js
module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      all: {
        src: "src/main.ts",
        dest: "dist/main.js",
        options: {
          plugin: ["tsify"],
        },
      },
    },
  });
  grunt.loadNpmTasks("grunt-browserify");
  grunt.registerTask("default", ["browserify"]);
};
```

နောက်ထပ် အသေးစိတ်: [jmreidy/grunt-browserify](https://github.com/jmreidy/grunt-browserify), [TypeStrong/tsify](https://github.com/TypeStrong/tsify)

## Gulp (File Stream များဖြင့် Build လုပ်ပေးသော Tool)

### Install (Install လုပ်ခြင်း)

```sh
npm install gulp-typescript
```

### Basic gulpfile.js (အခြေခံ gulpfile.js)

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("default", function () {
  var tsResult = gulp.src("src/*.ts").pipe(
    ts({
      noImplicitAny: true,
      out: "output.js",
    })
  );
  return tsResult.js.pipe(gulp.dest("built/local"));
});
```

နောက်ထပ် အသေးစိတ်: [ivogabe/gulp-typescript](https://github.com/ivogabe/gulp-typescript)

## Jspm (JavaScript Package Manager)

### Install (Install လုပ်ခြင်း)

```sh
npm install -g jspm@beta
```

_မှတ်ချက်: လက်ရှိမှာ jspm ထဲက TypeScript support က 0.16beta အဆင့်မှာ ရှိပါတယ်_

နောက်ထပ် အသေးစိတ်: [TypeScriptSamples/jspm](https://github.com/Microsoft/TypeScriptSamples/tree/master/jspm)

## MSBuild (Microsoft ၏ Build Tool)

Project file ကို — ဒေသအလိုက် (locally) install လုပ်ထားတဲ့ `Microsoft.TypeScript.Default.props` (အပေါ်ဆုံးမှာ) နဲ့ `Microsoft.TypeScript.targets` (အောက်ဆုံးမှာ) files တွေ ပါဝင်အောင် update လုပ်ပါ:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <!-- Include default props at the top -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props')" />

  <!-- TypeScript configurations go here -->
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>false</TypeScriptSourceMap>
  </PropertyGroup>

  <!-- Include default targets at the bottom -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
</Project>
```

MSBuild compiler options တွေ သတ်မှတ်ခြင်းအကြောင်း နောက်ထပ် အသေးစိတ်: [MSBuild projects တွေမှာ Compiler Options သတ်မှတ်ခြင်း](/docs/typescript/compiler-options-in-msbuild)

## NuGet (.NET Package Manager)

- Right-click နှိပ်ပြီး Manage NuGet Packages ကို ရွေးပါ
- `Microsoft.TypeScript.MSBuild` ကို ရှာပါ
- `Install` ကို နှိပ်ပါ
- Install ပြီးသွားရင် — rebuild လုပ်ပါ!

နောက်ထပ် အသေးစိတ်တွေကို [Package Manager Dialog](http://docs.nuget.org/Consume/Package-Manager-Dialog) နဲ့ [NuGet နဲ့ nightly builds တွေကို အသုံးပြုခြင်း](https://github.com/Microsoft/TypeScript/wiki/Nightly-drops#using-nuget-with-msbuild) မှာ တွေ့နိုင်ပါတယ်။

## Rollup (Module Bundler — Module များကို စုစည်းပေးသော Tool)

### Install (Install လုပ်ခြင်း)

```
npm install @rollup/plugin-typescript --save-dev
```

`typescript` ရော `tslib` ပါ ဒီ plugin ရဲ့ peer dependencies တွေ ဖြစ်လို့ — သီးခြားစီ install လုပ်ဖို့ လိုအပ်တယ်ဆိုတာ သတိပြုပါ။

### Usage (အသုံးပြုပုံ)

`rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) တစ်ခု ဖန်တီးပြီး — plugin ကို import လုပ်ပါ:

```js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```

## Svelte Compiler (Svelte Component များကို Compile လုပ်ပေးသော Tool)

### Install (Install လုပ်ခြင်း)

```
npm install --save-dev svelte-preprocess
```

`typescript` က ဒီ plugin ရဲ့ optional peer dependency ဖြစ်ပြီး — သီးခြားစီ install လုပ်ဖို့ လိုအပ်တယ်ဆိုတာ သတိပြုပါ။ `tslib` ကိုလည်း ပံ့ပိုးမပေးပါဘူး။

CLI type checking (command line ကနေ type စစ်ဆေးခြင်း) အတွက် [`svelte-check`](https://www.npmjs.com/package/svelte-check) ကိုလည်း စဉ်းစားကြည့်နိုင်ပါတယ်။

### Usage (အသုံးပြုပုံ)

`svelte.config.js` configuration file တစ်ခု ဖန်တီးပြီး — plugin ကို import လုပ်ပါ:

```js
// svelte.config.js
import preprocess from 'svelte-preprocess';

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess()
};

export default config;
```

အခု ဆိုရင် script blocks တွေကို TypeScript နဲ့ ရေးထားကြောင်း သတ်မှတ်နိုင်ပါပြီ:

```
<script lang="ts">
```

## Vite (Build Tool — Dev Server ပါဝင်သော Tool)

Vite က `.ts` files တွေကို out-of-the-box (ဘာ setup မှ မလိုဘဲ) import လုပ်တာကို ထောက်ပံ့ပါတယ်။ သူက transpilation ကိုပဲ လုပ်ဆောင်ပြီး — type checking ကို မလုပ်ပါဘူး။ `compilerOptions` တစ်ချို့မှာ သတ်မှတ်ထားတဲ့ values တွေ ရှိဖို့လည်း လိုအပ်ပါတယ်။ အသေးစိတ်ကို [Vite docs](https://vitejs.dev/guide/features.html#typescript) မှာ ကြည့်ပါ။

## Webpack (Module Bundler — Module များကို Bundle လုပ်ပေးသော Tool)

### Install (Install လုပ်ခြင်း)

```sh
npm install ts-loader --save-dev
```

### Basic webpack.config.js when using Webpack 5 or 4 (Webpack 5 သို့မဟုတ် 4 သုံးနေချိန်မှာ အခြေခံ webpack.config.js)

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

ts-loader အကြောင်း [နောက်ထပ် အသေးစိတ်ကို ဒီမှာ](https://www.npmjs.com/package/ts-loader) ကြည့်ပါ။

အခြားရွေးချယ်စရာများ:

- [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)
