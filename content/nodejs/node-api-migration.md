---
title: "Node-API သို့ ပြောင်းရွှေ့ခြင်း (Migrating to Node-API)"
description: "NAN-based native addon ကို Node-API သို့ ပြောင်းရွှေ့နည်း — conversion tool သုံးခြင်း, binding.gyp ရဲ့ include_dirs ပြင်ခြင်း, env/exports ကိုင်တွယ်ခြင်း အပါအဝင် manual cleanup အဆင့်များ"
order: 77
source: "https://nodejs.org/learn/node-api/getting-started/migration"
status: translated
updated: 2026-09-02
---

ဒီ tutorial ရဲ့ ရည်ရွယ်ချက်က — ရှိပြီးသား [NAN](https://github.com/nodejs/nan) Node native add-on module တစ်ခုကို [`node-addon-api`](https://github.com/nodejs/node-addon-api) package ကို သုံးပြီး [Node-API](https://nodejs.org/api/n-api.html) ဆီ ပြောင်းရွှေ့ဖို့ လိုအပ်တဲ့ အဆင့်တွေနဲ့ ရနိုင်တဲ့ tools တွေကို ခြုံငုံ နားလည်စေဖို့ပါ။

ဒီ tutorial က Node-API နဲ့အတူ ပါလာတဲ့ conversion tool ကို သုံးပြီး migration ကို အစပြုပါတယ်။ ဒါပေမယ့် — conversion tool က အကန့်အသတ်တစ်ခုအထိပဲ လုပ်ပေးနိုင်တာမို့ — အောက်မှာ ဖော်ပြထားသလို နောက်ထပ် manual cleanup တွေ ထပ်လုပ်ဖို့ လိုအပ်ပါသေးတယ်။

အကြောင်းအရာတွေ ထိန်းချုပ်နိုင်အောင် — ဒီ tutorial က [node-microtime](https://github.com/wadey/node-microtime) ကို သုံးထားပါတယ်။ ၎င်းက NAN-based ဖြစ်တဲ့ ရိုးရှင်းတဲ့ native add-on တစ်ခုဖြစ်ပြီး — operating system က ထောက်ပံ့ရင် microsecond အဆင့် (resolution) အထိ လက်ရှိအချိန်ကို သိဖို့ system calls တွေ ပြုလုပ်ပါတယ်။

မစတင်ခင် — လိုအပ်တဲ့ [ကြိုတင်လိုအပ်ချက်များ](/docs/nodejs/node-api-prerequisites) နဲ့ [Tools များ](/docs/nodejs/node-api-tools) ကို install လုပ်ပြီးကြောင်း သေချာပါစေ။

> Node-API က လက်ရှိ ထောက်ပံ့နေတဲ့ Node.js releases အားလုံးမှာ stable ဖြစ်ပါတယ်။ [Active LTS ဒါမှမဟုတ် Maintenance LTS release](https://nodejs.org/en/about/releases/) တစ်ခုကို သုံးပါ။ ကိုယ့် machine ပေါ်က Node.js version ကို `node -v` နဲ့ စစ်ဆေးနိုင်ပါတယ်။

## `node-microtime` ကို Clone လုပ်ခြင်း

ပထမဆုံး အဆင့်အနေနဲ့ — [node-microtime](https://github.com/wadey/node-microtime) GitHub repository ကို သင့်စနစ်ထဲကို clone လုပ်ပါ:

```bash
git clone https://github.com/wadey/node-microtime.git
```

ပြုပြင်မှုတွေ မလုပ်ခင် — လိုအပ်တဲ့ development tools တွေ မှန်ကန်စွာ install လုပ်ပြီး configure ဖြစ်နေကြောင်း အတည်ပြုဖို့ `node-microtime` ကို အရင်ဆုံး build လုပ်ပြီး test လုပ်ကြည့်တာ ကောင်းပါတယ်။

> `node-microtime` က `node-addon-api` ဆီ ပြောင်းရွှေ့ပြီးသွားပြီ ဖြစ်လို့ — ဒီ tutorial ကို လိုက်လုပ်ဖို့ `v2.1.9` tag ဆီ ရွှေ့ရပါမယ်။

```bash
cd node-microtime
git checkout tags/v2.1.9
npm install
npm test
```

`npm install` command က build process ကို စတင်ပြီး — `npm test` က code ကို run ပါတယ်။ Code run နိုင်မှုကို မထိခိုက်စေတဲ့ compiler warnings တချို့ မြင်ရနိုင်ပါတယ်။ အောင်မြင်စွာ build ပြီး run ဖြစ်တဲ့အခါ — အောက်ပါအတိုင်း output မျိုး တွေ့ရပါလိမ့်မယ်:

```
microtime.now() = 1526334357974754
microtime.nowDouble() = 1526334357.976626
microtime.nowStruct() = [ 1526334357, 976748 ]

Guessing clock resolution...
Clock resolution observed: 1us
```

## Conversion Tool ကို Run လုပ်ခြင်း

Code ရဲ့ အခြေခံလုပ်ဆောင်မှု အတည်ပြုပြီးတာနဲ့ — နောက်တစ်ဆင့်က [Node-API Conversion Tool](https://github.com/nodejs/node-addon-api/blob/main/doc/conversion-tool.md) ကို run လုပ်ဖို့ပါ။ သတိထားရမှာက — conversion tool က **နေရာတွင် (in place) ရှိတဲ့ files တွေကို အစားထိုး ပြောင်းလဲပစ်ပါတယ်**။ ကိုယ့် project ရဲ့ တစ်ခုတည်းသော copy ပေါ်မှာ conversion tool ကို ဘယ်တော့မှ run မလုပ်ပါနဲ့။ ပြီးတော့ — သိသာတာက — **တစ်ခါပဲ** run လုပ်သင့်ပါတယ်။

```bash
npm install --save node-addon-api
node ./node_modules/node-addon-api/tools/conversion.js ./
```

ဒီပုံစံ သေးငယ်တဲ့ project အတွက်ဆိုရင် — conversion tool က အလွန် မြန်မြန်ဆန်ဆန် အလုပ်ပြီးပါတယ်။ ဒီအဆင့်မှာ — conversion tool က အောက်ပါ project files တွေကို ပြုပြင်မွမ်းမံပြီးပါပြီ:

- `binding.gyp`
- `package.json`
- `src/microtime.cc`

ပြောင်းပြီးသား code ကို ဆက် build လုပ်ကြည့်ပါ:

```bash
npm install
```

မြင်ရမှာက — ဖြေရှင်းရမယ့် compile errors တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရှိနေပါလိမ့်မယ်။ တစ်ခါတစ်ရံ အတော်များများ ရှိနိုင်ပေမယ့် — ဘာမှ မဖြစ်နိုင်တဲ့အရာ မဟုတ်ပါဘူး။

## Cleanup (သန့်ရှင်းရေး)

Conversion tool က coding အခြေအနေ တိုင်းကို ကြိုမမြင်နိုင်ပါဘူး။ ဒါကြောင့် — manual အနေနဲ့ ဖြေရှင်းရမယ့် ကိစ္စတွေ ပုံမှန် ရှိတတ်ပါတယ်။ အောက်မှာက ဒီ project မှာ ကြုံနိုင်ခြေ အရှိဆုံး ကိစ္စတွေပါ။ အကောင်းဆုံး နည်းလမ်းက — ကိစ္စတစ်ခုချင်းစီကို တစ်ခုပြီးတစ်ခု ဖြေရှင်းပြီး — error တွေ မကျန်တော့တဲ့အထိ ကိစ္စတစ်ခုစီ ပြီးတိုင်း `npm install` ကို ပြန်စမ်းကြည့်ပါ။

### 'nan' module ကို ရှာမတွေ့တဲ့ error (Cannot find module 'nan')

ဒီ error နဲ့ — ၎င်းရဲ့ အပြိုင် ဖြစ်တတ်တဲ့ `napi.h` ရှာမတွေ့တဲ့ error က — `binding.gyp` file ထဲမှာ code တွေ လိုအပ်နေလို့ ဖြစ်ရတာပါ။ ဒီ project အတွက်ဆိုရင် binding.gyp ထဲမှာ ဒီ code ကို တွေ့ရပါလိမ့်မယ်:

```json
'include_dirs' : [ '<!(node -e "require(\'nan\')")' ]
```

C/C++ include directories တွေက NAN ဆီကို ညွှန်နေဆဲ ဖြစ်လို့ပါ။ ၎င်းတို့က Node-API ဆီ ညွှန်ဖို့ လိုပါတယ်။ အပေါ်က line ကို ဒီ line နဲ့ အစားထိုးရပါမယ်:

```json
'include_dirs' : [ "<!@(node -p \"require('node-addon-api').include\")" ]
```

တခြား project တွေမှာတော့ `napi.h` ရှာမတွေ့တဲ့ error မျိုး ရနိုင်ပါတယ်။ အကြောင်းရင်းက ဒီအတိုင်းပဲ ဖြစ်ပါတယ်။ Target တစ်ခုချင်းစီရဲ့ `include_dirs` property ထဲမှာ — အပေါ်မှာ ပြထားတဲ့အတိုင်း `node-addon-api` ဆီညွှန်တဲ့ reference ပါဝင်ရပါမယ်။

### 'env' ဆိုတဲ့ undeclared identifier သုံးထားတာ

C++ functions သုံးခု — `Now`, `NowDouble`, `NowStruct` — တစ်ခုချင်းစီမှာ သတ်မှတ်မထားတဲ့ `env` variable ကို ရည်ညွှန်းထားပါတယ်။ `env` က [Node-API Environment](https://github.com/nodejs/node-addon-api/blob/main/doc/env.md) variable ကို သိမ်းထားဖို့ ရည်ရွယ်ထားတာဖြစ်ပြီး — Node-API calls တွေ အားလုံးနီးပါးအတွက် မရှိမဖြစ် လိုအပ်ပါတယ်။ `env` ရဲ့ တန်ဖိုးကို C++ function တစ်ခုချင်းစီဆီ ပို့လိုက်တဲ့ `Napi::CallbackInfo` argument ကနေ အလွယ်တကူ ရယူနိုင်ပါတယ်။ ဒီ error ကို ပြင်တဲ့ နည်းလမ်းတစ်ခုက — function တစ်ခုချင်းစီရဲ့ body ထဲမှာ ပထမဆုံး line အနေနဲ့ ဒီ code ကို ထည့်တာပါ:

```cpp
  Napi::Env env = info.Env();
```

အခြားရွေးချယ်စရာက — function သုံးခုထဲမှာ `env` ပါတဲ့ နေရာ တစ်ခုချင်းစီကို `info.Env()` နဲ့ အစားထိုးတာပါ။ ဘယ်နည်းလမ်း သုံးမလဲဆိုတာ ကိုယ့် ရွေးချယ်မှုပါ။

### Return value အနေနဲ့ `void` သုံးထားတာ

C++ functions သုံးခု — `Now`, `NowDouble`, `NowStruct` — တစ်ခုချင်းစီကို `void` value ပြန်ပေးဖို့ သတ်မှတ်ထားပါတယ်။ တကယ်တော့ — ၎င်းတို့ တစ်ခုချင်းစီက JavaScript value တစ်ခု ပြန်ပေးရမှာ ဖြစ်ပါတယ်။ ဒါကို လုပ်ဖို့ အကောင်းဆုံး နည်းလမ်းက `void` ကို `Napi::Value` နဲ့ အစားထိုးတာပါ။ ဒါက function တစ်ခုချင်းစီကို — အမျိုးအစား အတိအကျ မသတ်မှတ်ထားတဲ့ (undetermined type) JavaScript value တစ်ခု ပြန်ပေးခွင့် ပြုပါတယ်။ String, Number, Boolean, Array စသဖြင့် JavaScript value ဘာမဆို ဖြစ်နိုင်ပါတယ်။ ၎င်းတို့က ဒီလို ဖြစ်သင့်ပါတယ်:

```cpp
Napi::Value Now(const Napi::CallbackInfo&info) {
Napi::Value NowDouble(const Napi::CallbackInfo&info) {
Napi::Value NowStruct(const Napi::CallbackInfo&info) {
```

### `exports` သတ်မှတ်ပုံ နည်းလမ်းသစ်

Node-API က `exports` object ကို သတ်မှတ်ရာမှာ မတူညီတဲ့ နည်းလမ်းတစ်ခုကို သုံးပါတယ်။

ဒီ code:

```cpp
Nan::Export(target, "now", Now);
Nan::Export(target, "nowDouble", NowDouble);
Nan::Export(target, "nowStruct", NowStruct);
```

ကို ဒီလို အစားထိုးရပါမယ်:

```cpp
exports.Set(Napi::String::New(env,"now"), Napi::Function::New(env, Now));
exports.Set(Napi::String::New(env,"nowDouble"), Napi::Function::New(env, NowDouble));
exports.Set(Napi::String::New(env,"nowStruct"), Napi::Function::New(env, NowStruct));
```

`exports` က JavaScript object တစ်ခုကို ကိုယ်စားပြုတဲ့ `Napi::Object` တစ်ခုပါ။ `Set` method က object ပေါ်မှာ property တွေရဲ့ တန်ဖိုးကို သတ်မှတ်ပေးပြီး — argument နှစ်ခု လက်ခံပါတယ်: property ရဲ့ နာမည် နဲ့ ၎င်းရဲ့ တန်ဖိုး။ ဒီ argument နှစ်ခုလုံးက JavaScript values တွေ ဖြစ်ရပါမယ်။

Node-API ရဲ့ လည်ပတ်မှုအတွက် အရေးပါတဲ့ နောက်ထပ် ပြောင်းလဲမှုတစ်ခုက — `InitAll` function က `exports` variable ကို **ပြန်ပေးရပါမယ်**။ ဒီ line က function ရဲ့ body ထဲမှာ နောက်ဆုံး line အနေနဲ့ ပါဝင်ရပါတယ်:

```cpp
return exports;
```

ဒီ line မထည့်မိရင် — runtime မှာ segfault error ဖြစ်နိုင်ခြေ များပါတယ်။

### `ErrnoException` အတွက် အစားထိုး

NAN ရဲ့ `ErrnoException` object က Node-API မှာ မရှိပါဘူး။ ရှိပြီးသား code က ဒီလိုပါ:

```cpp
Napi::Error::New(env, Napi::ErrnoException(errno, "gettimeofday")).ThrowAsJavaScriptException();
```

ဒါပေမယ့် ၎င်းကို ဒီလိုမျိုး code နဲ့ အလွယ်တကူ အစားထိုးနိုင်ပါတယ်:

```cpp
std::string msg =  "gettimeofday: " + std::string(strerror(errno));
Napi::Error::New(env, msg).ThrowAsJavaScriptException();
```

## နောက်ဆုံး စစ်ဆေးခြင်း (Final Check)

Code က error မရှိဘဲ compile ဖြစ်တာနဲ့ — ကိုယ်ပြုလုပ်ခဲ့တဲ့ ပြောင်းလဲမှုတွေကို test လုပ်ပါ:

```bash
npm test
```

Migration မလုပ်ခင် ရခဲ့တဲ့ ရလဒ်တွေနဲ့ ဆင်တူတဲ့ ရလဒ်မျိုး တွေ့ရပါလိမ့်မယ်။

ဂုဏ်ယူပါတယ်! သင့်ရဲ့ ပထမဆုံး NAN module ကို Node-API ဆီ ပြောင်းရွှေ့ပြီးပါပြီ။

## နိဂုံး (Conclusion)

သိသာတာက — ဒီ tutorial က NAN modules တွေကို Node-API ဆီ ပြောင်းရွှေ့ခြင်းရဲ့ မျက်နှာပြင်ကိုပဲ ခြစ်ပြထားတာပါ။ ဒါပေမယ့် — အခြေခံ နည်းလမ်းကတော့ အတူတူပါပဲ။ Conversion ကို run လုပ်ပါ၊ compile စမ်းကြည့်ပါ၊ error တွေကို ဖြေရှင်းပါ၊ ပြန် compile လုပ်ပါ။ ထပ်ခါထပ်ခါ လုပ်သွားရုံပါပဲ။
