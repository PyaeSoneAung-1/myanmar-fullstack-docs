---
title: "Chalk မှ util.styleText() သို့"
description: "chalk npm package ကနေ Node.js built-in util.styleText() API ဆီ codemod နဲ့ ပြောင်းရွှေ့ခြင်း — import အစားထိုးပုံ, chained styles နဲ့ CommonJS ဥပမာများ, မထောက်ခံတဲ့ chalk methods များ"
order: 68
source: "https://nodejs.org/learn/userland-migrations/chalk-to-util-styletext"
status: translated
updated: 2026-09-02
---

ဒီ codemod က `chalk` npm package ရဲ့ အသုံးပြုမှုတွေကို — Node.js ရဲ့ built-in `util.styleText()` API ဆီ ပြောင်းရွှေ့ပေးပါတယ်။ `chalk` import ကို `node:util` ကနေ `{ styleText }` နဲ့ အစားထိုးပြီး — chalk method calls အားလုံးကိုလည်း အလိုက်သင့် ပြန်ရေးပေးပါတယ်။ Chained လုပ်ထားတဲ့ (ထပ်ဆင့်ခေါ်ထားတဲ့) chalk styles တွေကိုတော့ — style string တွေရဲ့ array တစ်ခုအဖြစ် ပြောင်းပေးပါတယ်။

## အသုံးပြုပုံ (Usage)

ဒီ codemod ကို ဒီလို run ပါ:

```sh
npx codemod @nodejs/chalk-to-util-styletext
```

## ဥပမာများ

### ဥပမာ ၁ — အခြေခံ အရောင် methods (ESM default import)

```diff
-import chalk from "chalk";
+import { styleText } from "node:util";

-console.log(chalk.red("Error message"));
-console.log(chalk.green("Success message"));
-console.log(chalk.blue("Info message"));
+console.log(styleText("red", "Error message"));
+console.log(styleText("green", "Success message"));
+console.log(styleText("blue", "Info message"));
```

ဒီမှာ — `chalk.red(...)` လို method call တစ်ခုချင်းစီကို — style name ကို string ပထမ argument အနေနဲ့ လက်ခံတဲ့ `styleText("red", ...)` ပုံစံဆီ ပြောင်းပေးတာကို မြင်ရပါတယ်။

### ဥပမာ ၂ — Chained styles

```diff
-import chalk from "chalk";
+import { styleText } from "node:util";

-console.log(chalk.red.bold("Error: Operation failed"));
-console.log(chalk.green.underline("Success: All tests passed"));
-console.log(chalk.yellow.bgBlack("Warning: Deprecated API usage"));
+console.log(styleText(["red", "bold"], "Error: Operation failed"));
+console.log(styleText(["green", "underline"], "Success: All tests passed"));
+console.log(styleText(["yellow", "bgBlack"], "Warning: Deprecated API usage"));
```

`chalk.red.bold(...)` လို chain လုပ်ထားတဲ့ styles တွေကို — style names တွေပါတဲ့ array တစ်ခု — `["red", "bold"]` — အနေနဲ့ ပေါင်းစပ်ပြီး `styleText` ရဲ့ ပထမ argument အဖြစ် ပေးလိုက်ပါတယ်။

### ဥပမာ ၃ — CommonJS `require`

```diff
-const chalk = require("chalk");
+const { styleText } = require("node:util");

-const error = chalk.red("Error");
-const warning = chalk.yellow("Warning");
-const info = chalk.blue("Info");
+const error = styleText("red", "Error");
+const warning = styleText("yellow", "Warning");
+const info = styleText("blue", "Info");

 console.log(error, warning, info);
```

CommonJS မှာလည်း — `require("chalk")` ကို `node:util` ကနေ `styleText` ကို destructure လုပ်ယူတာနဲ့ အစားထိုးပြီး — method calls တွေကိုလည်း ESM နဲ့ အတူတူ ပုံစံမျိုးနဲ့ပဲ ပြောင်းပေးပါတယ်။

## မှတ်ချက်များ (Notes)

### ကန့်သတ်ချက်များ (Limitations)

`hex()`, `rgb()`, `ansi256()`, `bgAnsi256()`, `visible()` နဲ့ `new chalk.Chalk()` အပါအဝင် — တိုက်ရိုက် `util.styleText` နဲ့ ညီမျှမှု မရှိတဲ့ chalk methods တွေကိုတော့ ကျော်သွားပါတယ်။ မထောက်ခံတဲ့ call တစ်ခုချင်းစီအတွက် warning တစ်ခု print လုပ်ပြီး — အဲဒီ call sites တွေကို ကိုယ်တိုင် ပြန်လည်သုံးသပ်နိုင်ဖို့ မပြောင်းဘဲ ထားပေးပါတယ်။

## ဆက်ဖတ်ရန်

- [Userland Migrations မိတ်ဆက်](/docs/nodejs/userland-migrations) — Node.js ရဲ့ official codemods များအကြောင်း
- [Kleur မှ util.styleText သို့](/docs/nodejs/kleur-to-util-styletext) — `kleur` package ကနေ ပြောင်းရွှေ့ခြင်း
