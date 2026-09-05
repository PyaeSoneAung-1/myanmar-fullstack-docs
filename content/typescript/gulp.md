---
title: "Gulp (Gulp ဖြင့် TypeScript Build လုပ်ခြင်း)"
description: "TypeScript ကို gulp နဲ့ build လုပ်နည်း သင်ပြချက် (deprecated) — Browserify, terser, Watchify နဲ့ Babel/Babelify တို့ကို gulp pipeline ထဲ ထည့်သုံးနည်း အဆင့်ဆင့်"
order: 37
source: "https://www.typescriptlang.org/docs/handbook/gulp.html"
status: translated
updated: 2026-09-05
---

> **မှတ်ချက်:** ဒီ guide ကို deprecated (အသုံးမပြုရန် သတ်မှတ်ထားသော) လုပ်ထားပါပြီ။

ဒီ quick start guide က TypeScript ကို [gulp](https://gulpjs.com) နဲ့ ဘယ်လို build လုပ်မလဲဆိုတာ သင်ပေးပြီး — နောက်ပိုင်းမှာ [Browserify](https://browserify.org), [terser](https://terser.org) (သို့) [Watchify](https://github.com/substack/watchify) တွေကို gulp pipeline ထဲကို ထည့်သွင်းနည်းကို ဆက်ပြသပေးပါတယ်။ ဒီ guide က [Babelify](https://github.com/babel/babelify) ကို သုံးပြီး [Babel](https://babeljs.io/) ရဲ့ လုပ်ဆောင်ချက်တွေ ထည့်သွင်းနည်းကိုလည်း ပြသပေးပါတယ်။

သင်က [Node.js](https://nodejs.org/) ကို [npm](https://www.npmjs.com/) နဲ့တွဲပြီး အသုံးပြုနေပြီးသား ဖြစ်တယ်လို့ ယူဆပါတယ်။

## အနည်းဆုံး Project တစ်ခု (Minimal Project)

Directory အသစ်တစ်ခုနဲ့ စလိုက်ရအောင်။
အခုလောလောဆယ် `proj` လို့ နာမည်ပေးထားပါမယ် — ဒါပေမယ့် သင်အလိုရှိတဲ့ နာမည် ဘာမဆို ပြောင်းလို့ရပါတယ်။

```shell
mkdir proj
cd proj
```

စတင်ဖို့အတွက် ကျွန်တော်တို့ project ကို အောက်ပါအတိုင်း ဖွဲ့စည်းထားပါမယ်:

```
proj/
   ├─ src/
   └─ dist/
```

TypeScript files တွေက သင့် `src` folder ထဲမှာ စတင်ပြီး — TypeScript compiler ကနေ ဖြတ်သန်းကာ — `dist` ထဲမှာ အဆုံးသတ်ပါလိမ့်မယ်။

ဒါကို scaffold (အခြေခံ ဖွဲ့စည်းပုံ) ဆောက်လိုက်ရအောင်:

```shell
mkdir src
mkdir dist
```

### Project ကို Initialize လုပ်ခြင်း (Initialize the Project)

အခု ဒီ folder ကို npm package တစ်ခုအဖြစ် ပြောင်းလဲပါမယ်။

```shell
npm init
```

Prompt တွေ တစ်ခုပြီးတစ်ခု မေးလာပါလိမ့်မယ်။
Entry point ကလွဲလို့ — ကျန် နေရာတွေမှာ default တန်ဖိုးတွေကို သုံးနိုင်ပါတယ်။
Entry point အတွက်တော့ `./dist/main.js` ကို သုံးပါ။
နောက်မှ ဒါတွေကို သင်အတွက် generate လုပ်ပေးထားတဲ့ `package.json` ဖိုင်ထဲမှာ ပြန်သွားပြီး ပြောင်းလဲလို့ အမြဲ ရပါတယ်။

### Dependencies များ Install လုပ်ခြင်း (Install Our Dependencies)

အခု packages တွေ install လုပ်ဖို့ `npm install` ကို သုံးနိုင်ပါပြီ။
ပထမဆုံး `gulp-cli` ကို globally (စက်တစ်ခုလုံးအတွက်) install လုပ်ပါ (သင်က Unix system တစ်ခု သုံးနေတယ်ဆိုရင် — ဒီ guide ထဲက `npm install` commands တွေရဲ့ ရှေ့မှာ `sudo` ထည့်ဖို့ လိုနိုင်ပါတယ်)။

```shell
npm install -g gulp-cli
```

ပြီးတော့ `typescript`, `gulp` နဲ့ `gulp-typescript` တို့ကို သင့် project ရဲ့ dev dependencies ထဲ install လုပ်ပါ။
[Gulp-typescript](https://www.npmjs.com/package/gulp-typescript) က TypeScript အတွက် gulp plugin တစ်ခုပါ။

```shell
npm install --save-dev typescript gulp@4.0.0 gulp-typescript
```

### ရိုးရှင်းသော ဥပမာတစ်ခု ရေးခြင်း (Write a Simple Example)

Hello World program တစ်ခု ရေးလိုက်ရအောင်။
`src` ထဲမှာ `main.ts` ဖိုင်ကို ဖန်တီးပါ:

```ts
function hello(compiler: string) {
  console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

Project ရဲ့ root ဖြစ်တဲ့ `proj` ထဲမှာ `tsconfig.json` ဖိုင်ကို ဖန်တီးပါ:

```json tsconfig
{
  "files": ["src/main.ts"],
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "es5"
  }
}
```

### `gulpfile.js` ဖန်တီးခြင်း (Create a gulpfile.js)

Project ရဲ့ root မှာ `gulpfile.js` ဖိုင်ကို ဖန်တီးပါ:

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});
```

### ရလဒ် App ကို စမ်းသပ်ခြင်း (Test the Resulting App)

```shell
gulp
node dist/main.js
```

Program က "Hello from TypeScript!" ဆိုတဲ့ စာသားကို ပုံနှိပ်ထုတ်ပေးသင့်ပါတယ်။

## Code ထဲသို့ Modules များ ထည့်ခြင်း (Add Modules to the Code)

Browserify ဆီ မရောက်ခင် — code တွေကို ချဲ့ထွင်ပြီး modules တွေကိုပါ ရောထည့်လိုက်ရအောင်။
ဒါက တကယ့် app တစ်ခုအတွက် သင်ပိုပြီး သုံးနိုင်ခြေရှိတဲ့ ဖွဲ့စည်းပုံပါ။

`src/greet.ts` လို့ခေါ်တဲ့ ဖိုင်တစ်ခု ဖန်တီးပါ:

```ts
export function sayHello(name: string) {
  return `Hello from ${name}`;
}
```

အခု `src/main.ts` ထဲက code ကို `greet.ts` ကနေ `sayHello` ကို import လုပ်မယ့်ပုံစံ ပြောင်းပါ:

```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

နောက်ဆုံးအနေနဲ့ — `src/greet.ts` ကို `tsconfig.json` ထဲ ထည့်ပါ:

```json tsconfig
{
  "files": ["src/main.ts", "src/greet.ts"],
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "es5"
  }
}
```

`gulp` ကို run ပြီး Node ထဲမှာ စမ်းသပ်ခြင်းအားဖြင့် modules တွေ အလုပ်လုပ်ကြောင်း သေချာအောင် လုပ်ပါ:

```shell
gulp
node dist/main.js
```

ကျွန်တော်တို့ ES2015 module syntax ကို သုံးခဲ့ပေမယ့် — TypeScript က Node သုံးတဲ့ CommonJS modules တွေကို emit (ထုတ်လွှတ်) ပေးခဲ့တာ သတိပြုပါ။
ဒီ tutorial မှာတော့ CommonJS နဲ့ပဲ ဆက်သွားပါမယ် — ဒါပေမယ့် options object ထဲမှာ `module` ကို သတ်မှတ်ပြီး ဒါကို ပြောင်းလဲလို့ ရပါတယ်။

## Browserify (Modules များကို Browser အတွက် Bundle လုပ်ခြင်း)

အခု ဒီ project ကို Node ကနေ browser ဆီ ရွှေ့လိုက်ရအောင်။
ဒါလုပ်ဖို့ — ကျွန်တော်တို့ modules တွေ အားလုံးကို JavaScript ဖိုင်တစ်ခုတည်းအဖြစ် bundle (ပေါင်းစည်း) လုပ်ချင်ပါတယ်။
ကံကောင်းချင်တော့ — Browserify က ဒါကို အတိအကျ လုပ်ပေးပါတယ်။
ပိုကောင်းတာက — Node သုံးတဲ့ CommonJS module system ကို ဆက်သုံးခွင့် ပေးတာပါ — ဒါက TypeScript ရဲ့ default emit လည်း ဖြစ်ပါတယ်။
ဆိုလိုတာက — ကျွန်တော်တို့ရဲ့ TypeScript နဲ့ Node setup က အခြေခံအားဖြင့် ဘာမှ မပြောင်းဘဲ browser ဆီ ကူးပြောင်းသွားပါလိမ့်မယ်။

ပထမဆုံး — browserify, [tsify](https://www.npmjs.com/package/tsify) နဲ့ vinyl-source-stream တို့ကို install လုပ်ပါ။
tsify က gulp-typescript လိုပဲ — TypeScript compiler ကို ဝင်ရောက်ခွင့် ပေးတဲ့ Browserify plugin တစ်ခုပါ။
vinyl-source-stream ကတော့ Browserify ရဲ့ file output ကို gulp နားလည်တဲ့ — [vinyl](https://github.com/gulpjs/vinyl) လို့ခေါ်တဲ့ format တစ်ခုအဖြစ် ပြန်ပြောင်းပေးနိုင်စေပါတယ်။

```shell
npm install --save-dev browserify tsify vinyl-source-stream
```

### Page တစ်ခု ဖန်တီးခြင်း (Create a Page)

`src` ထဲမှာ `index.html` လို့ နာမည်ပေးထားတဲ့ ဖိုင်တစ်ခု ဖန်တီးပါ:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World!</title>
  </head>
  <body>
    <p id="greeting">Loading ...</p>
    <script src="bundle.js"></script>
  </body>
</html>
```

အခု page ကို update လုပ်ဖို့ `main.ts` ကို ပြောင်းပါ:

```ts
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```

`showHello` ကို ခေါ်လိုက်တာနဲ့ — paragraph ရဲ့ စာသားကို ပြောင်းဖို့ `sayHello` ကို ခေါ်ပေးပါတယ်။
အခု သင့် gulpfile ကို အောက်ပါအတိုင်း ပြောင်းပါ:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var paths = {
  pages: ["src/*.html"],
};

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("dist"));
  })
);
```

ဒါက `copy-html` task ကို ထည့်ပေးပြီး — `default` ရဲ့ dependency အဖြစ် သတ်မှတ်ပေးပါတယ်။
ဆိုလိုတာက — `default` ကို ဘယ်အချိန် run လုပ်လုပ် — `copy-html` က အရင်ဆုံး run ရပါတယ်။
ပြီးတော့ `default` ကို gulp-typescript အစား tsify plugin ပါတဲ့ Browserify ကို ခေါ်တဲ့ပုံစံ ပြောင်းထားပါတယ်။
အဆင်ပြေတာက — နှစ်ခုလုံးက TypeScript compiler ဆီ options object တစ်ခုတည်းကို ပေးပို့ခွင့် ပြုပါတယ်။

`bundle` ကို ခေါ်ပြီးနောက် — ကျွန်တော်တို့ရဲ့ output bundle ကို `bundle.js` လို့ နာမည်ပေးဖို့ `source` (vinyl-source-stream အတွက် ကျွန်တော်တို့ရဲ့ alias) ကို သုံးပါတယ်။

gulp ကို run ပြီး `dist/index.html` ကို browser ထဲမှာ ဖွင့်ခြင်းအားဖြင့် page ကို စမ်းသပ်ပါ။
Page ပေါ်မှာ "Hello from TypeScript" ကို မြင်ရပါလိမ့်မယ်။

Browserify ဆီ `debug: true` လို့ သတ်မှတ်ပေးထားတာ သတိပြုပါ။
ဒါက tsify ကို bundled JavaScript ဖိုင်ထဲမှာ source maps တွေ emit လုပ်စေပါတယ်။
Source maps တွေက bundled JavaScript အစား — မူရင်း TypeScript code ကို browser ထဲမှာ debug လုပ်ခွင့် ပေးပါတယ်။
Source maps အလုပ်လုပ်ကြောင်း စမ်းသပ်ဖို့ — သင့် browser ရဲ့ debugger ကို ဖွင့်ပြီး `main.ts` ထဲမှာ breakpoint တစ်ခု တင်ကြည့်ပါ။
Page ကို refresh လုပ်လိုက်တဲ့အခါ — breakpoint က page ကို ရပ်တန့်စေပြီး `greet.ts` ကို debug လုပ်ခွင့် ပေးပါလိမ့်မယ်။

## Watchify, Babel နှင့် Terser (Watchify, Babel, and Terser)

အခု ကျွန်တော်တို့ code တွေကို Browserify နဲ့ tsify နဲ့ bundle လုပ်နေပြီဆိုတော့ — browserify plugins တွေနဲ့ ကျွန်တော်တို့ရဲ့ build ထဲကို လုပ်ဆောင်ချက် အမျိုးမျိုး ထည့်နိုင်ပါပြီ။

- Watchify က gulp ကို စတင်ပေးပြီး ဆက်လည်ပတ်နေအောင် ထားပေးပါတယ် — သင်က ဖိုင်တစ်ခုကို သိမ်းလိုက်တိုင်း incrementally (အပိုင်းလိုက်) compile လုပ်ပေးပါတယ်။
  ဒါက browser ထဲမှာ edit-save-refresh (ပြင်ရေး-သိမ်း-ပြန်ဖွင့်) သံသရာကို ဆက်လုပ်နိုင်စေပါတယ်။

- Babel က ES2015 နဲ့ ၎င်းနောက်ပိုင်း code တွေကို ES5 နဲ့ ES3 အဖြစ် ပြောင်းပေးတဲ့ အလွန် ပြောင်းလွယ်ပြင်လွယ်ရှိတဲ့ compiler တစ်ခုပါ။
  ဒါက TypeScript မထောက်ပံ့တဲ့ ကျယ်ပြန့်ပြီး စိတ်ကြိုက်ပြင်ဆင်ထားတဲ့ (customized) transformations တွေကို ထည့်သွင်းနိုင်စေပါတယ်။

- Terser က သင့် code ကို ကျစ်လစ်အောင် လုပ်ပေးတာမို့ — download လုပ်ရတဲ့ အချိန် ပိုသက်သာပါတယ်။

### Watchify (Background Compilation ပြုလုပ်ပေးခြင်း)

Background compilation (နောက်ခံမှာ compile လုပ်ပေးခြင်း) ရဖို့ Watchify နဲ့ စလိုက်ပါမယ်:

```shell
npm install --save-dev watchify fancy-log
```

အခု သင့် gulpfile ကို အောက်ပါအတိုင်း ပြောင်းပါ:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var paths = {
  pages: ["src/*.html"],
};

var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
```

ဒီမှာ အခြေခံအားဖြင့် ပြောင်းလဲမှု သုံးခု ရှိပါတယ် — ဒါပေမယ့် ဒါတွေက သင့် code ကို နည်းနည်း ပြန်ဖွဲ့စည်း (refactor) လုပ်ဖို့ လိုပါတယ်။

1. ကျွန်တော်တို့ `browserify` instance ကို `watchify` call တစ်ခုထဲ ထုပ်ပိုးပြီး — ရလဒ်ကို ဆက်ကိုင်ထားပါတယ်။
2. သင့် TypeScript ဖိုင်တွေထဲက တစ်ခုခု ပြောင်းလဲတိုင်း Browserify က `bundle` function ကို run စေဖို့ `watchedBrowserify.on('update', bundle);` လို့ ခေါ်ထားပါတယ်။
3. Console ဆီ log တင်ဖို့ `watchedBrowserify.on('log', fancy_log);` လို့ ခေါ်ထားပါတယ်။

(1) နဲ့ (2) ပေါင်းလိုက်တော့ — ကျွန်တော်တို့ `browserify` ကို ခေါ်တာကို `default` task ထဲကနေ ရွှေ့ထုတ်ရပါတယ်။
ပြီးတော့ Watchify ရော Gulp ပါ ခေါ်ဖို့ လိုတာမို့ — `default` အတွက် function ကို နာမည်တစ်ခု ပေးရပါတယ်။
(3) နဲ့ logging ထည့်တာက optional ဖြစ်ပေမယ့် — သင့် setup ကို debug လုပ်ဖို့ အရမ်း အသုံးဝင်ပါတယ်။

အခု Gulp ကို run လိုက်ရင် — စတင်ပြီး ဆက်လည်ပတ်နေသင့်ပါတယ်။
`main.ts` ထဲက `showHello` အတွက် code ကို ပြောင်းပြီး သိမ်းကြည့်ပါ။
ဒီလိုမျိုး output တွေ တွေ့ရပါလိမ့်မယ်:

```shell
proj$ gulp
[10:34:20] Using gulpfile ~/src/proj/gulpfile.js
[10:34:20] Starting 'copy-html'...
[10:34:20] Finished 'copy-html' after 26 ms
[10:34:20] Starting 'default'...
[10:34:21] 2824 bytes written (0.13 seconds)
[10:34:21] Finished 'default' after 1.36 s
[10:35:22] 2261 bytes written (0.02 seconds)
[10:35:24] 2808 bytes written (0.05 seconds)
```

### Terser (Code ကျစ်လစ်ချုံ့ခြင်း)

ပထမဆုံး Terser ကို install လုပ်ပါ။
Terser ရဲ့ ရည်ရွယ်ချက်က သင့် code ကို mangle (ဖတ်ရခက်အောင် လုပ်ပစ်) တာဖြစ်လို့ — sourcemaps တွေ ဆက်အလုပ်လုပ်နေဖို့ vinyl-buffer နဲ့ gulp-sourcemaps တွေကိုလည်း install လုပ်ဖို့ လိုပါတယ်။

```shell
npm install --save-dev gulp-terser vinyl-buffer gulp-sourcemaps
```

အခု သင့် gulpfile ကို အောက်ပါအတိုင်း ပြောင်းပါ:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var terser = require("gulp-terser");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
  pages: ["src/*.html"],
};

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(terser())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
  })
);
```

`terser` ကိုယ်တိုင်က ခေါ်ရုံတစ်ကြောင်းပဲ ရှိတာ သတိပြုပါ — `buffer` နဲ့ `sourcemaps` တွေကို ခေါ်ထားတာက sourcemaps တွေ ဆက်အလုပ်လုပ်နေဖို့ အတွက်ပါ။
ဒီ calls တွေက အရင်ကလို inline sourcemaps သုံးမယ့်အစား — သီးခြား sourcemap ဖိုင်တစ်ခုကို ပေးပါတယ်။
အခု Gulp ကို run ပြီး `bundle.js` က ဖတ်လို့မရတဲ့ အရှုပ်အထွေး (minified) ဖြစ်သွားလားဆိုတာ စစ်ကြည့်နိုင်ပါတယ်:

```shell
gulp
cat dist/bundle.js
```

### Babel (Babelify ဖြင့် Babel ထည့်သွင်းခြင်း)

ပထမဆုံး Babelify နဲ့ ES2015 အတွက် Babel preset ကို install လုပ်ပါ။
Terser လိုပဲ Babelify ကလည်း code ကို mangle လုပ်တာမို့ — vinyl-buffer နဲ့ gulp-sourcemaps တွေ လိုအပ်ပါမယ်။
Default အနေနဲ့ Babelify က `.js`, `.es`, `.es6` နဲ့ `.jsx` extension တွေရှိတဲ့ ဖိုင်တွေကိုပဲ process လုပ်မှာမို့ — `.ts` extension ကို Babelify ရဲ့ option တစ်ခုအနေနဲ့ ထည့်ဖို့ လိုအပ်ပါတယ်။

```shell
npm install --save-dev babelify@8 babel-core babel-preset-es2015 vinyl-buffer gulp-sourcemaps
```

အခု သင့် gulpfile ကို အောက်ပါအတိုင်း ပြောင်းပါ:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
  pages: ["src/*.html"],
};

gulp.task("copy-html", function () {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .transform("babelify", {
        presets: ["es2015"],
        extensions: [".ts"],
      })
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
  })
);
```

ပြီးတော့ TypeScript ကို ES2015 ကို target လုပ်ဖို့လည်း လိုပါတယ်။
အဲဒါဆိုရင် Babel က TypeScript emit လုပ်ထားတဲ့ ES2015 code ကနေ ES5 ကို ထုတ်ပေးပါလိမ့်မယ်။
`tsconfig.json` ကို ပြုပြင်လိုက်ရအောင်:

```json tsconfig
{
  "files": ["src/main.ts"],
  "compilerOptions": {
    "noImplicitAny": true,
    "target": "es2015"
  }
}
```

ဒီလောက် ရိုးရှင်းတဲ့ script တစ်ခုအတွက်တော့ — Babel ရဲ့ ES5 output က TypeScript ရဲ့ output နဲ့ အရမ်းဆင်တူသင့်ပါတယ်။
