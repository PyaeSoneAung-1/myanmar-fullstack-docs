---
title: "Configuring Watch (Watch Mode ပြင်ဆင်ခြင်း)"
description: "TypeScript compiler ရဲ့ file နဲ့ directory watching ကို — tsconfig.json ထဲက watchOptions ဒါမှမဟုတ် TSC_WATCHFILE နဲ့ TSC_WATCHDIRECTORY environment variables တွေသုံးပြီး ဘယ်လို ပြင်ဆင်မလဲ"
order: 69
source: "https://www.typescriptlang.org/docs/handbook/configuring-watch.html"
status: translated
updated: 2026-09-05
---

TypeScript 3.8 ကစပြီး — TypeScript compiler က files နဲ့ directories တွေကို ဘယ်လို watch (စောင့်ကြည့်) လုပ်မလဲဆိုတာကို ထိန်းချုပ်တဲ့ configuration တွေကို ဖွင့်ပေးပါတယ်။ ဒီ version မတိုင်ခင် — configuration အတွက် environment variables တွေကို သုံးရပါတယ် — အဲဒါတွေက အခုထိ ရှိနေဆဲပါ။

## Background (နောက်ခံ)

Compiler ရဲ့ `--watch` implementation က Node ရဲ့ `fs.watch` နဲ့ `fs.watchFile` ပေါ်မှာ မှီခိုပါတယ်။ ဒီ method တစ်ခုချင်းစီမှာ အားသာချက် အားနည်းချက် နှစ်မျိုးလုံး ရှိပါတယ်။

`fs.watch` က — watch လုပ်ထားတဲ့ files နဲ့ directories တွေထဲက အပြောင်းအလဲတွေကို ထုတ်လွှင့်ဖို့ file system events တွေကို မှီခိုပါတယ်။ ဒီ command ရဲ့ implementation က OS ပေါ် မူတည်ပြီး ယုံကြည်ရလောက်မှု နည်းပါတယ် — operating systems အများစုမှာ မျှော်လင့်ထားသလို အလုပ်မဖြစ်တတ်ပါဘူး။ ဒါ့အပြင် operating systems တစ်ချို့က တစ်ပြိုင်နက် ရှိနေနိုင်တဲ့ watches အရေအတွက်ကို ကန့်သတ်ထားပါတယ် (ဥပမာ — [Linux](https://man7.org/linux/man-pages/man7/inotify.7.html) ရဲ့ flavor တစ်ချို့)။ ကြီးမားတဲ့ codebases တွေမှာ `fs.watch` ကို အများကြီး သုံးရင် ဒီကန့်သတ်ချက်တွေကို ကျော်လွန်ပြီး မလိုလားအပ်တဲ့ အပြုအမူတွေ ဖြစ်လာနိုင်ပါတယ်။ ဒါပေမယ့် ဒီ implementation က events-based model ကို မှီခိုလို့ — CPU အသုံးပြုမှုက ယှဉ်ကြည့်ရင် ပေါ့ပါးပါတယ်။ Compiler က ပုံမှန်အားဖြင့် directories တွေကို watch လုပ်ဖို့ `fs.watch` ကို သုံးပါတယ် (ဥပမာ — compiler configuration files တွေက ထည့်သွင်းထားတဲ့ source directories တွေ၊ module resolution မအောင်မြင်ခဲ့တဲ့ directories တွေ အစရှိသဖြင့်)။ TypeScript က ဒါတွေကို — file watcher တစ်ခုချင်းစီရဲ့ ဖြစ်နိုင်ခြေရှိတဲ့ မအောင်မြင်မှုတွေကို ဖြည့်စွက်ဖို့ သုံးပါတယ်။ ဒါပေမယ့် ဒီနည်းဗျူဟာရဲ့ အဓိက ကန့်သတ်ချက် တစ်ခု ရှိပါတယ်: directories တွေကို recursive (ထပ်ဆင့်) နည်းနဲ့ watch လုပ်တာက Windows နဲ့ macOS မှာ ရပေမယ့် Linux မှာ မရပါဘူး။ ဒါက — file နဲ့ directory watching အတွက် နောက်ထပ် နည်းဗျူဟာတွေ လိုအပ်ကြောင်း ပြသပါတယ်။

`fs.watchFile` က polling ကို သုံးလို့ — CPU cycles တွေ ကုန်ကျပါတယ်။ ဒါပေမယ့် `fs.watchFile` က — စိတ်ဝင်စားတဲ့ files နဲ့ directories တွေဆီက events တွေကို စာရင်းသွင်းဖို့ ရရှိနိုင်တဲ့ နည်းလမ်းတွေထဲမှာ ယခုထိ အကောင်းဆုံး ယုံကြည်ရလောက်ဆုံး mechanism ပါ။ ဒီနည်းဗျူဟာအရ — TypeScript compiler က source files, config files နဲ့ reference statements တွေအရ ပျောက်နေပုံရတဲ့ files တွေကို watch လုပ်ဖို့ `fs.watchFile` ကို ပုံမှန် သုံးပါတယ်။ ဒါကြောင့် `fs.watchFile` သုံးတဲ့အခါ CPU အသုံးပြုမှု ဘယ်လောက် မြင့်မလဲဆိုတာက — codebase ထဲမှာ watch လုပ်ထားတဲ့ files အရေအတွက်ပေါ်မှာ တိုက်ရိုက် မူတည်ပါတယ်။

## Configuring file watching using a `tsconfig.json` (tsconfig.json သုံးပြီး File Watching ပြင်ဆင်ခြင်း)

Watch behavior ကို ပြင်ဆင်ဖို့ အကြံပြုထားတဲ့ နည်းလမ်းက — `tsconfig.json` ထဲက `watchOptions` section အသစ်ကနေတစ်ဆင့် ဖြစ်ပါတယ်။ အောက်မှာ ဥပမာ configuration တစ်ခု ဖော်ပြထားပါတယ်။ ရရှိနိုင်တဲ့ settings တွေရဲ့ အသေးစိတ် ဖော်ပြချက်တွေအတွက် နောက် section ကို ကြည့်ပါ။

```json tsconfig
{
  // Some typical compiler options
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },

  // NEW: Options for file/directory watching
  "watchOptions": {
    // Use native file system events for files and directories
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",

    // Poll files for updates more frequently
    // when they're updated a lot.
    "fallbackPolling": "dynamicPriority",

    // Don't coalesce watch notification
    "synchronousWatchDirectory": true,

    // Finally, two additional settings for reducing the amount of possible
    // files to track  work from these directories
    "excludeDirectories": ["**/node_modules", "_build"],
    "excludeFiles": ["build/fileWhichChangesOften.ts"]
  }
}
```

နောက်ထပ် အသေးစိတ်တွေအတွက် — [TypeScript 3.8 ရဲ့ release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) ကို ကြည့်ပါ။

## Configuring file watching using environment variable `TSC_WATCHFILE` (TSC_WATCHFILE Environment Variable သုံးပြီး File Watching ပြင်ဆင်ခြင်း)

| Option | ဖော်ပြချက် |
| --- | --- |
| `PriorityPollingInterval` | `fs.watchFile` ကို သုံးပါ — ဒါပေမယ့် source files, config files နဲ့ missing files (ပျောက်နေတဲ့ files) တွေအတွက် မတူညီတဲ့ polling intervals တွေကို အသုံးပြုပါတယ်။ |
| `DynamicPriorityPolling` | Dynamic queue တစ်ခုကို သုံးပြီး — မကြာခဏ ပြုပြင်မွမ်းမံတဲ့ files တွေကို ပိုတိုတဲ့ intervals တွေနဲ့ poll လုပ်ကာ — မပြောင်းလဲတဲ့ files တွေကိုတော့ မကြာခဏ နည်းပြီး poll လုပ်ပါတယ်။ |
| `UseFsEvents` | `fs.watch` ကို သုံးပါ။ Active watches အရေအတွက်ကို ကန့်သတ်ထားတဲ့ operating systems တွေမှာ — watcher တစ်ခု ဖန်တီးဖို့ မအောင်မြင်ရင် `fs.watchFile` ဆီ ပြန်လှဲ (fall back) ပါတယ်။ |
| `UseFsEventsWithFallbackDynamicPolling` | `fs.watch` ကို သုံးပါ။ Active watches အရေအတွက်ကို ကန့်သတ်ထားတဲ့ operating systems တွေမှာ — dynamic polling queues တွေဆီ ပြန်လှဲပါတယ် (`DynamicPriorityPolling` မှာ ရှင်းပြထားသလိုပါ)။ |
| `UseFsEventsOnParentDirectory` | `fs.watch` ကို included files တွေရဲ့ _parent_ (မိဘ) directories တွေပေါ်မှာ သုံးပါ (ဒါက — pure `fs.watchFile` ထက် CPU အသုံးပြုမှု နည်းစေပေမယ့် accuracy (တိကျမှု) နည်းနိုင်တဲ့ compromise တစ်ခုပါ)။ |
| default (value သတ်မှတ်မထားပါက) | Environment variable `TSC_NONPOLLING_WATCHER` ကို true လို့ သတ်မှတ်ထားရင် — `UseFsEventsOnParentDirectory` ကို သုံးပါ။ မဟုတ်ရင် — file တိုင်းအတွက် timeout `250ms` နဲ့ `fs.watchFile` ကို သုံးပြီး files တွေကို watch လုပ်ပါ။ |

## Configuring directory watching using environment variable `TSC_WATCHDIRECTORY` (TSC_WATCHDIRECTORY Environment Variable သုံးပြီး Directory Watching ပြင်ဆင်ခြင်း)

Recursive directory watching ကို native အနေနဲ့ မထောက်ပံ့တဲ့ platform တွေမှာ (ဆိုလိုတာက macOS နဲ့ Windows မဟုတ်တဲ့ operating systems တွေ) — `TSC_WATCHDIRECTORY` က ရွေးချယ်လိုက်တဲ့ မတူညီတဲ့ options တွေကို သုံးပြီး — child directory တစ်ခုချင်းစီအတွက် directory watchers တွေကို recursive ဖန်တီးခြင်းအားဖြင့် directory watching ကို ထောက်ပံ့ပေးပါတယ်။

**NOTE:** Native recursive directory watching ကို ထောက်ပံ့တဲ့ platform တွေမှာ — `TSC_WATCHDIRECTORY` ရဲ့ value ကို လျစ်လျူရှုပါတယ်။

| Option | ဖော်ပြချက် |
| --- | --- |
| `RecursiveDirectoryUsingFsWatchFile` | `fs.watchFile` ကို သုံးပြီး included directories တွေနဲ့ child directories (လက်အောက် directory များ) တွေကို watch လုပ်ပါ။ |
| `RecursiveDirectoryUsingDynamicPriorityPolling` | Dynamic polling queue တစ်ခုကို သုံးပြီး included directories တွေနဲ့ child directories တွေရဲ့ အပြောင်းအလဲတွေကို poll လုပ်ပါ။ |
| default (value သတ်မှတ်မထားပါက) | `fs.watch` ကို သုံးပြီး included directories တွေနဲ့ child directories တွေကို watch လုပ်ပါ။ |
