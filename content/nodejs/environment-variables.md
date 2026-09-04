---
title: "Environment Variables"
description: "Node.js process ရဲ့ environment variables တွေ၊ .env (dotenv) ဖိုင်တွေအတွက် utility တွေနဲ့ process.env API အကြောင်း"
order: 132
source: "https://nodejs.org/api/environment_variables.html"
status: translated
updated: 2026-09-04
---

Environment variables တွေဆိုတာ — Node.js process တစ်ခု run ဝင်တဲ့ environment (ပတ်ဝန်းကျင်) နဲ့ ဆက်စပ်နေတဲ့ variable တွေပါ။

## CLI Environment Variables (CLI အတွက် environment variables များ)

Node.js ရဲ့ အပြုအမူကို စိတ်ကြိုက် ပြင်ဆင်သတ်မှတ်ဖို့ သတ်မှတ်နိုင်တဲ့ environment variables အစုတစ်ခု ရှိပါတယ်။ အသေးစိတ်အတွက် [CLI Environment Variables documentation][] ကို ကြည့်ပါ။

## `process.env`

Environment variables တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ အခြေခံ API ကတော့ `process.env` ပါ။ ၎င်းမှာ — ကြိုတင် ဖြည့်သွင်းထားတဲ့ user environment variables တွေ ပါဝင်တဲ့ object တစ်ခု ပါဝင်ပြီး — အဲဒီ variables တွေကို ပြင်ဆင်နိုင်၊ တိုးချဲ့နိုင်ပါတယ်။

အသေးစိတ်အတွက် [`process.env` documentation][] ကို ကြည့်ပါ။

## DotEnv (.env ဖိုင်များအတွက် utility များ)

> Stability: 2 - Stable

`.env` files တွေထဲမှာ သတ်မှတ်ထားတဲ့ ထပ်ဆောင်း environment variables တွေကို ကိုင်တွယ်ဖို့ utility အစုတစ်ခုပါ။

### .env ဖိုင်များ (.env files)

`.env` files (dotenv files လို့လည်း သိကြပါတယ်) ဆိုတာ — environment variables တွေကို သတ်မှတ်ပေးတဲ့ files တွေပါ။ Node.js applications တွေက အဲဒီ variables တွေနဲ့ ဆက်သွယ် အသုံးပြုနိုင်ပါတယ် ([dotenv][] package က လူကြိုက်များစေခဲ့တာပါ)။

အောက်ပါက အခြေခံ `.env` file တစ်ခုရဲ့ ပါဝင်ပုံ ဥပမာပါ:

```text
MY_VAR_A = "my variable A"
MY_VAR_B = "my variable B"
```

ဒီလို file အမျိုးအစားကို မတူညီတဲ့ programming languages နဲ့ platforms အမျိုးမျိုးမှာ သုံးကြပေမယ့် — ဒါအတွက် တရားဝင် specification (သတ်မှတ်ချက်) မရှိပါဘူး။ ဒါကြောင့် Node.js က အောက်မှာ ဖော်ပြထားတဲ့ ကိုယ်ပိုင် specification တစ်ခုကို သတ်မှတ်ပါတယ်။

`.env` file ဆိုတာ key-value pairs တွေ ပါဝင်တဲ့ file တစ်ခုပါ။ Pair တစ်ခုချင်းစီကို — variable name နောက်မှာ equal sign (`=`) နဲ့ variable value တစ်ခု လိုက်တဲ့ ပုံစံနဲ့ ကိုယ်စားပြုပါတယ်။

ဒီလို files တွေရဲ့ နာမည်က ပုံမှန်အားဖြင့် `.env` ဖြစ်ပြီး — `.env` နဲ့ စတင်တာမျိုးလည်း ဖြစ်နိုင်ပါတယ် (ဥပမာ — `.env.dev` မှာ `dev` က သီးသန့် target environment တစ်ခုကို ညွှန်ပြပါတယ်)။ ဒါက အကြံပြုထားတဲ့ naming scheme ဖြစ်ပေမယ့် မဖြစ်မနေ လိုက်နာရမယ် မဟုတ်ပါဘူး — dotenv files တွေက ကြိုက်တဲ့ file name မဆို ရနိုင်ပါတယ်။

#### Variable အမည်များ (Variable names)

Variable name တစ်ခု valid ဖြစ်ဖို့ — letters (စာလုံးကြီး (သို့) စာလုံးသေး), digits (ဂဏန်းများ), နဲ့ underscores (`_`) တွေပဲ ပါဝင်ရပြီး — digit တစ်ခုနဲ့ စပြီး မစနိုင်ပါဘူး။

ပိုတိတိကျကျ ပြောရရင် — valid variable name တစ်ခုက အောက်ပါ regular expression နဲ့ ကိုက်ညီရပါမယ်:

```text
^[a-zA-Z_]+[a-zA-Z0-9_]*$
```

အကြံပြုထားတဲ့ convention ကတော့ — လိုအပ်ရင် capital letters တွေကို underscores နဲ့ digits တွေနဲ့ တွဲပြီး သုံးဖို့ပါ။ ဒါပေမယ့် အပေါ်က သတ်မှတ်ချက်ကို လိုက်နာတဲ့ variable name မဆို ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။

ဥပမာ — အောက်ပါတွေက valid variable names တချို့ပါ: `MY_VAR`, `MY_VAR_1`, `my_var`, `my_var_1`, `myVar`, `My_Var123`။ ဒါတွေကတော့ valid မဟုတ်ပါဘူး: `1_VAR`, `'my-var'`, `"my var"`, `VAR_#1`။

#### Variable တန်ဖိုးများ (Variable values)

Variable values တွေက ကြိုက်တဲ့ text မဆို ပါဝင်နိုင်ပြီး — လိုအပ်ရင် single (`'`) (သို့) double (`"`) quotes တွေ အတွင်းမှာ ထည့်ထားနိုင်ပါတယ်။

Quote လုပ်ထားတဲ့ variables တွေက စာကြောင်းမျိုးစုံ (multiple lines) ကို ဖြန့်ကျက်နိုင်ပေမယ့် — quote မလုပ်ထားတဲ့ variables တွေကတော့ စာကြောင်း တစ်ကြောင်းတည်းမှာပဲ ကန့်သတ်ထားပါတယ်။

Node.js က parse လုပ်တဲ့အခါ value အားလုံးကို text အဖြစ်ပဲ အနက်ဖွင့်တယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက Node.js အတွင်းမှာ value မဆို JavaScript string တစ်ခု အနေနဲ့ပဲ ဖြစ်လာမှာပါ။ ဥပမာ — အောက်ပါ values တွေ: `0`, `true` နဲ့ `{ "hello": "world" }` က — number zero, boolean `true`, နဲ့ `hello` property ပါတဲ့ object အဖြစ် မဟုတ်ဘဲ — literal strings `'0'`, `'true'`, နဲ့ `'{ "hello": "world" }'` တွေ အနေနဲ့ အသီးသီး ဖြစ်လာပါလိမ့်မယ်။

Valid variables တွေရဲ့ ဥပမာများ:

```text
MY_SIMPLE_VAR = a simple single line variable
MY_EQUALS_VAR = "this variable contains an = sign!"
MY_HASH_VAR = 'this variable contains a # symbol!'
MY_MULTILINE_VAR = '
this is a multiline variable containing
two separate lines\nSorry, I meant three lines'
```

#### နေရာလွတ်များ (Spacing)

Variable keys နဲ့ values တွေရဲ့ ရှေ့/နောက်မှာ ရှိတဲ့ whitespace characters တွေကို — quotes အတွင်းမှာ မဟုတ်ရင် — လျစ်လျူရှုပါတယ်။

ဥပမာ:

```text
   MY_VAR_A   =    my variable a
    MY_VAR_B   =    '   my variable b   '
```

ကို အောက်ပါအတိုင်း အတူတူပဲ သတ်မှတ်ပါတယ်:

```text
MY_VAR_A = my variable a
MY_VAR_B = '   my variable b   '
```

#### မှတ်ချက်များ (Comments)

Hash-tag (`#`) characters တွေက comment တစ်ခုရဲ့ အစကို ဖော်ပြပါတယ် — ဆိုလိုတာက အဲဒီနောက် ကျန်တဲ့ စာကြောင်း တစ်ကြောင်းလုံးကို လုံးဝ လျစ်လျူရှုလိုက်ပါတယ်။

ဒါပေမယ့် quotes အတွင်းမှာ တွေ့ရတဲ့ hash-tags တွေကတော့ — တခြား ပုံမှန် character တစ်ခုလိုပဲ သတ်မှတ်ပါတယ်။

ဥပမာ:

```text
# This is a comment
MY_VAR = my variable # This is also a comment
MY_VAR_A = "# this is NOT a comment"
```

#### `export` ရှေ့ဆက်များ (`export` prefixes)

`export` keyword ကို variable declarations တွေရဲ့ ရှေ့မှာ ရွေးချယ် (optional) ထည့်နိုင်ပါတယ်။ အဲဒီလို keyword ကို file ပေါ်မှာ လုပ်ဆောင်တဲ့ processing အားလုံးက လုံးဝ လျစ်လျူရှုပါတယ်။

ဒါက — file ကို shell terminals တွေထဲမှာ ပြုပြင်မှု မရှိပဲ source လုပ်နိုင်အောင် အသုံးဝင်ပါတယ်။

ဥပမာ:

```text
export MY_VAR = my variable
```

### CLI Options (CLI option များ)

`.env` files တွေကို အောက်ပါ CLI options တွေထဲက တစ်ခုကနေတစ်ဆင့် `process.env` object ကို ဖြည့်သွင်းဖို့ သုံးနိုင်ပါတယ်:

* [`--env-file=file`][]

* [`--env-file-if-exists=file`][]

### Programmatic APIs (programmatic API များ)

အောက်ပါ functions နှစ်ခုက `.env` files တွေနဲ့ တိုက်ရိုက် အပြန်အလှန် ဆက်သွယ်ဖို့ ခွင့်ပြုပါတယ်:

* [`process.loadEnvFile`][] က `.env` file တစ်ခုကို load လုပ်ပြီး — ၎င်းရဲ့ variables တွေနဲ့ `process.env` ကို ဖြည့်သွင်းပါတယ်

* [`util.parseEnv`][] က `.env` file တစ်ခုရဲ့ raw content ကို parse လုပ်ပြီး — ၎င်းရဲ့ values တွေကို object တစ်ခုထဲမှာ ပြန်ပေးပါတယ်

[CLI Environment Variables documentation]: cli.md#environment-variables_1
[`--env-file-if-exists=file`]: cli.md#--env-file-if-existsfile
[`--env-file=file`]: cli.md#--env-filefile
[`process.env` documentation]: process.md#processenv
[`process.loadEnvFile`]: process.md#processloadenvfilepath
[`util.parseEnv`]: util.md#utilparseenvcontent
[dotenv]: https://github.com/motdotla/dotenv
