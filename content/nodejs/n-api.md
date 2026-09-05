---
title: "Node-API"
description: "Node-API (ယခင် N-API) — C/C++ addons ရေးသားဖို့ ABI-stable API — ABI stability & version matrix, environment life cycle, basic data types (napi_value, napi_env), error handling, object lifetime management, module registration, JavaScript values/properties/functions, async work, threadsafe functions စသည်"
order: 150
source: "https://nodejs.org/api/n-api.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

Node-API (ယခင်က N-API) ဆိုတာ native Addons တွေကို တည်ဆောက်ဖို့အတွက် API တစ်ခုပါ။ ၎င်းက အောက်ခြေမှာ ရှိတဲ့ JavaScript runtime (ဥပမာ — V8) နဲ့ သီးခြား လွတ်လပ်ပြီး — Node.js ရဲ့ ကိုယ်တိုင်၏ အစိတ်အပိုင်း တစ်ခုအနေနဲ့ ထိန်းသိမ်းထားပါတယ်။ ဒီ API က Node.js versions တွေ တစ်လျှောက်မှာ Application Binary Interface (ABI) အရ တည်ငြိမ် (stable) နေမှာ ဖြစ်ပါတယ်။ ၎င်းရဲ့ ရည်ရွယ်ချက်က — addons တွေကို အောက်ခြေ JavaScript engine ရဲ့ အပြောင်းအလဲတွေကနေ အကာအကွယ် ပေးဖို့ ဖြစ်ပြီး — major version တစ်ခုအတွက် compile လုပ်ထားတဲ့ modules တွေကို — ပြန်လည် compile လုပ်စရာ မလိုပဲ — နောက်ပိုင်း Node.js major versions တွေပေါ်မှာ run နိုင်စေဖို့ ဖြစ်ပါတယ်။ [ABI Stability][] guide မှာ ပိုမို နက်ရှိုင်းတဲ့ ရှင်းလင်းချက်တွေ ပါဝင်ပါတယ်။

Addons တွေကို [C++ Addons][] ဆိုတဲ့ section မှာ ဖော်ပြထားတဲ့ နည်းလမ်း/ကိရိယာတွေနဲ့ပဲ build လုပ်/package လုပ်ပါတယ်။ ကွာခြားချက်က native code က သုံးတဲ့ APIs အစုအဝေးပဲ ဖြစ်ပါတယ်။ V8 သို့မဟုတ် [Native Abstractions for Node.js][] APIs တွေကို သုံးမယ့်အစား — Node-API ထဲမှာ ရနိုင်တဲ့ functions တွေကို သုံးပါတယ်။

Node-API က ထုတ်ဖော်ပေးထားတဲ့ (exposed) APIs တွေကို ယေဘုယျအားဖြင့် JavaScript values တွေကို ဖန်တီးခြင်းနဲ့ ကိုင်တွယ် ခြယ်လှယ်ခြင်းအတွက် သုံးပါတယ်။ Concepts နဲ့ operations တွေက ယေဘုယျအားဖြင့် ECMA-262 Language Specification မှာ သတ်မှတ်ထားတဲ့ အယူအဆတွေနဲ့ ကိုက်ညီပါတယ်။ ဒီ APIs တွေမှာ အောက်ပါ ဂုဏ်သတ္တိများ (properties) ရှိပါတယ်:

* Node-API calls တွေ အားလုံးက `napi_status` type ရဲ့ status code တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ status က API call က အောင်မြင်ခဲ့လား သို့မဟုတ် မအောင်မြင်ခဲ့လားဆိုတာကို ဖော်ပြပါတယ်။
* API ရဲ့ return value ကို out parameter (output ပြန်ပေးရန် parameter) တစ်ခုကနေတစ်ဆင့် ဖြတ်သန်း ပေးပို့ပါတယ်။
* JavaScript values တွေ အားလုံးကို `napi_value` လို့ အမည်ရတဲ့ opaque type (အတွင်းပိုင်း ဖွဲ့စည်းပုံ မမြင်ရသော type) တစ်ခုရဲ့ နောက်ကွယ်မှာ abstraction (စိတ္တဇ ကိုယ်စားပြုမှု) လုပ်ထားပါတယ်။
* Error status code တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — `napi_get_last_error_info` ကို သုံးပြီး ထပ်ဆောင်း အချက်အလက်တွေကို ရယူနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေကို error handling section [Error handling][] မှာ တွေ့နိုင်ပါတယ်။

## Programming languages အမျိုးမျိုးဖြင့် addons ရေးသားခြင်း (Writing addons in various programming languages)

Node-API က — Node.js versions နဲ့ compiler အဆင့် အမျိုးမျိုး တစ်လျှောက်မှာ ABI stability ကို အာမခံပေးတဲ့ — C API တစ်ခုပါ။ ဒီ stability အာမခံချက်နဲ့ဆိုရင် — Node-API ရဲ့ အပေါ်မှာ အခြား programming languages တွေနဲ့ addons တွေကို ရေးသားဖို့ ဖြစ်နိုင်ပါတယ်။ Programming languages နဲ့ engines များစွာအတွက် support အသေးစိတ်တွေကို [language and engine bindings][] မှာ ကြည့်ပါ။

[`node-addon-api`][] ဆိုတာ — Node-API ကို ခေါ်တဲ့ C++ code တွေကို ပိုမို ထိရောက်တဲ့ နည်းလမ်းနဲ့ ရေးသားနိုင်စေဖို့ ပေးတဲ့ — တရားဝင် (official) C++ binding ပါ။ ဒီ wrapper က header-only library တစ်ခု ဖြစ်ပြီး — inline လုပ်နိုင်တဲ့ (inlinable) C++ API တစ်ခုကို ပေးဆောင်ပါတယ်။ `node-addon-api` နဲ့ build လုပ်ထားတဲ့ binaries တွေက Node.js က export လုပ်ထားတဲ့ Node-API ရဲ့ C-based functions တွေရဲ့ symbols တွေအပေါ်မှာ မှီခိုပါလိမ့်မယ်။ အောက်က code snippet က `node-addon-api` ရဲ့ ဥပမာတစ်ခုပါ:

```cpp
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```

အပေါ်က `node-addon-api` C++ code က အောက်ပါ C-based Node-API code နဲ့ ညီမျှပါတယ်:

```cpp
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```

နောက်ဆုံး ရလဒ်ကတော့ — addon က export လုပ်ထားတဲ့ C APIs တွေကိုသာ သုံးပါတယ်။ Addon ကို C++ နဲ့ ရေးထားပေမယ့် — C Node-API က ပေးတဲ့ ABI stability ရဲ့ အကျိုးကျေးဇူးတွေကို ဆက်လက် ရရှိပါတယ်။

C APIs တွေအစား `node-addon-api` ကို သုံးတဲ့အခါ — `node-addon-api` အတွက် API [docs][] ကနေ စတင်ပါ။

[Node-API Resource](https://nodejs.github.io/node-addon-examples/) က — Node-API နဲ့ `node-addon-api` ကို စတင် အသုံးပြုနေတဲ့ developers တွေအတွက် — ကောင်းမွန်တဲ့ လမ်းညွှန်ချက်တွေနဲ့ အကြံပြုချက်တွေကို ပေးဆောင်ပါတယ်။ နောက်ထပ် media resources တွေကို [Node-API Media][] page မှာ တွေ့နိုင်ပါတယ်။

## ABI stability ၏ သက်ရောက်မှုများ (Implications of ABI stability)

Node-API က ABI stability အာမခံချက် ပေးပေမယ့် — Node.js ရဲ့ အခြား အစိတ်အပိုင်းတွေကတော့ မပေးပါဘူး။ ပြီးတော့ addon ကနေ သုံးတဲ့ external libraries တွေကလည်း မပေးနိုင်ပါဘူး။ အထူးသဖြင့် — အောက်ပါ APIs တွေထဲက ဘယ်တစ်ခုမှ — major versions တစ်လျှောက်မှာ ABI stability အာမခံချက် မပေးပါဘူး:

* the Node.js C++ APIs available via any of

  ```cpp
  #include <node.h>
  #include <node_buffer.h>
  #include <node_version.h>
  #include <node_object_wrap.h>
  ```

* the libuv APIs which are also included with Node.js and available via

  ```cpp
  #include <uv.h>
  ```

* the V8 API available via

  ```cpp
  #include <v8.h>
  ```

ဒါကြောင့် — addon တစ်ခုက Node.js major versions တစ်လျှောက် ABI-compatible ဖြစ်နေဖို့ဆိုရင် — ၎င်းကို အောက်ပါအတိုင်း ကန့်သတ် သုံးစွဲခြင်းအားဖြင့် Node-API ကိုသာ သီးသန့် သုံးရပါမယ်:

```c
#include <node_api.h>
```

ပြီးတော့ — ၎င်းက သုံးတဲ့ external libraries တွေ အားလုံးအတွက် — အဲဒီ external library က Node-API နဲ့ ဆင်တူတဲ့ ABI stability အာမခံချက်တွေ ပေးလားဆိုတာကိုလည်း — စစ်ဆေးရပါမယ်။

### ABI stability ရှိ enum တန်ဖိုးများ (Enum values in ABI stability)

Node-API မှာ define လုပ်ထားတဲ့ enum data types တွေ အားလုံးကို — ပုံသေ အရွယ်အစားရှိတဲ့ `int32_t` value တစ်ခုအဖြစ် မှတ်ယူရပါမယ်။ Bit flag enum types တွေကို ရှင်းလင်းစွာ မှတ်တမ်းတင်ထားရမှာ ဖြစ်ပြီး — ၎င်းတို့က bit value တစ်ခုအနေနဲ့ bit-OR (`|`) လိုမျိုး bit operators တွေနဲ့ အလုပ်လုပ်ပါတယ်။ တခြားနည်းနဲ့ မှတ်တမ်းတင်ထားခြင်း မရှိရင် — enum type တစ်ခုကို extensible (ချဲ့ထွင်နိုင်သော) အဖြစ် မှတ်ယူရပါမယ်။

Enum value အသစ်တစ်ခုကို enum definition ရဲ့ အဆုံးမှာ ထည့်သွင်းပါလိမ့်မယ်။ Enum value တစ်ခုကို ဖယ်ရှားခြင်း သို့မဟုတ် အမည်ပြောင်းခြင်း ပြုလုပ်မှာ မဟုတ်ပါဘူး။

Node-API function တစ်ခုကနေ ပြန်ပေးတဲ့ သို့မဟုတ် Node-API function တစ်ခုရဲ့ out parameter အနေနဲ့ ပေးအပ်တဲ့ enum type တစ်ခုအတွက်ဆိုရင် — value က integer value တစ်ခု ဖြစ်ပြီး — addon တစ်ခုက မသိတဲ့ (unknown) values တွေကို ကိုင်တွယ်သင့်ပါတယ်။ Value အသစ်တွေကို version guard (version စောင့်ကြည့်မှု) မလိုပဲ မိတ်ဆက်နိုင်ပါတယ်။ ဥပမာ — switch statements တွေမှာ `napi_status` ကို စစ်ဆေးတဲ့အခါ — Node.js versions အသစ်တွေမှာ status codes အသစ်တွေ မိတ်ဆက်ခံရနိုင်တာမို့ — addon တစ်ခုက default branch တစ်ခု ထည့်သွင်းသင့်ပါတယ်။

In-parameter တစ်ခုမှာ သုံးတဲ့ enum type တစ်ခုအတွက်ဆိုရင် — Node-API functions တွေဆီကို မသိတဲ့ integer value တစ်ခု ဖြတ်သန်းလိုက်တာရဲ့ ရလဒ်က — တခြားနည်းနဲ့ မှတ်တမ်းတင်ထားခြင်း မရှိရင် — undefined ပါ။ Value အသစ်တစ်ခုကို ထည့်သွင်းတဲ့အခါ — ဘယ် Node-API version မှာ မိတ်ဆက်ခဲ့လဲဆိုတာကို ဖော်ပြဖို့ version guard တစ်ခုနဲ့အတူ ထည့်သွင်းပါတယ်။ ဥပမာ — `napi_get_all_property_names` ကို `napi_key_filter` ရဲ့ enum value အသစ်တစ်ခုနဲ့ ချဲ့ထွင်နိုင်ပါတယ်။

In-parameters ရော out-parameters ပါ နှစ်မျိုးလုံးမှာ သုံးတဲ့ enum type တစ်ခုအတွက်ဆိုရင် — value အသစ်တွေကို version guard မလိုပဲ မိတ်ဆက်နိုင်ပါတယ်။

## Build လုပ်ခြင်း (Building)

JavaScript နဲ့ ရေးထားတဲ့ modules တွေနဲ့ မတူပဲ — Node-API ကို သုံးပြီး Node.js native addons တွေကို develop လုပ်ခြင်းနဲ့ deploy လုပ်ခြင်းက နောက်ထပ် ကိရိယာ အစုတစ်ခု လိုအပ်ပါတယ်။ Node.js အတွက် develop လုပ်ဖို့ လိုအပ်တဲ့ အခြေခံ ကိရိယာတွေအပြင် — native addon developer တစ်ယောက်က C နဲ့ C++ code တွေကို binary တစ်ခုအဖြစ် compile လုပ်နိုင်တဲ့ toolchain တစ်ခုလည်း လိုအပ်ပါတယ်။ ထို့အပြင် — native addon ကို ဘယ်လို deploy လုပ်လဲဆိုတာပေါ် မူတည်ပြီး — native addon ရဲ့ _user_ မှာလည်း C/C++ toolchain တစ်ခု install လုပ်ထားဖို့ လိုအပ်ပါလိမ့်မယ်။

Linux developers တွေအတွက်တော့ လိုအပ်တဲ့ C/C++ toolchain packages တွေက အလွယ်တကူ ရရှိနိုင်ပါတယ်။ [GCC][] က platform အမျိုးမျိုးမှာ build လုပ်ပြီး test လုပ်ဖို့ Node.js community မှာ အကျယ်ပြန့်ဆုံး သုံးကြပါတယ်။ Developers အများအပြားအတွက် [LLVM][] compiler infrastructure ကလည်း ရွေးချယ်မှု ကောင်းတစ်ခုပါ။

Mac developers တွေအတွက် [Xcode][] က လိုအပ်တဲ့ compiler tools တွေ အားလုံးကို ပေးဆောင်ပါတယ်။ ဒါပေမယ့် Xcode IDE တစ်ခုလုံး install လုပ်ဖို့တော့ မလိုအပ်ပါဘူး။ အောက်က command က လိုအပ်တဲ့ toolchain ကို install လုပ်ပေးပါတယ်:

```bash
xcode-select --install
```

Windows developers တွေအတွက် [Visual Studio][] က လိုအပ်တဲ့ compiler tools တွေ အားလုံးကို ပေးဆောင်ပါတယ်။ ဒါပေမယ့် Visual Studio IDE တစ်ခုလုံး install လုပ်ဖို့တော့ မလိုအပ်ပါဘူး။ အောက်က command က လိုအပ်တဲ့ toolchain ကို install လုပ်ပေးပါတယ်:

```bash
npm install --global windows-build-tools
```

အောက်က sections တွေမှာ Node.js native addons တွေကို develop လုပ်ခြင်းနဲ့ deploy လုပ်ခြင်းအတွက် ရရှိနိုင်တဲ့ နောက်ထပ် ကိရိယာတွေကို ဖော်ပြထားပါတယ်။

### Build tools (build ကိရိယာများ)

ဒီမှာ ဖော်ပြထားတဲ့ ကိရိယာ နှစ်ခုလုံးက — native addon ကို အောင်မြင်စွာ install လုပ်ဖို့ — native addon ရဲ့ _users_ တွေမှာ C/C++ toolchain တစ်ခု install လုပ်ထားဖို့ လိုအပ်ပါတယ်။

#### node-gyp

[node-gyp][] က [gyp-next][] tool ကို အခြေခံထားတဲ့ build system တစ်ခု ဖြစ်ပြီး — npm နဲ့အတူ ပါဝင်ပါတယ်။ node-gyp က Python install လုပ်ထားဖို့ လိုအပ်ပါတယ်။

သမိုင်းကြောင်းအရဆိုရင် — node-gyp က native addons တွေ build လုပ်ဖို့ ဦးစားပေး ရွေးချယ်ခဲ့တဲ့ ကိရိယာပါ။ ၎င်းမှာ အကျယ်ပြန့်ဆုံး လက်ခံကျင့်သုံးမှုနဲ့ documentation တွေ ရှိပါတယ်။ ဒါပေမယ့် — developers တစ်ချို့က node-gyp ရဲ့ ကန့်သတ်ချက်တွေကို ကြုံတွေ့ခဲ့ကြပါတယ်။

#### CMake.js

[CMake.js][] က [CMake][] ကို အခြေခံတဲ့ အစားထိုး (alternative) build system တစ်ခုပါ။

CMake.js က — CMake ကို သုံးနှင့်ပြီးသား projects တွေ သို့မဟုတ် node-gyp ရဲ့ ကန့်သတ်ချက်တွေကြောင့် ထိခိုက်နေတဲ့ developers တွေအတွက် ရွေးချယ်မှု ကောင်းတစ်ခုပါ။ [`build_with_cmake`][] က CMake-based native addon project တစ်ခုရဲ့ ဥပမာပါ။

### Precompiled binaries များကို upload လုပ်ခြင်း (Uploading precompiled binaries)

ဒီမှာ ဖော်ပြထားတဲ့ ကိရိယာ သုံးခုက native addon developers နဲ့ maintainers တွေကို — binaries တွေကို ဖန်တီးပြီး public သို့မဟုတ် private servers တွေဆီကို upload လုပ်ခွင့် ပြုပါတယ်။ ဒီကိရိယာတွေကို ပုံမှန်အားဖြင့် [Travis CI][] နဲ့ [AppVeyor][] လိုမျိုး CI/CD build systems တွေနဲ့ ပေါင်းစပ်ပြီး — platform နဲ့ architecture အမျိုးမျိုးအတွက် binaries တွေကို build လုပ်ကာ upload လုပ်ပါတယ်။ အဲဒီနောက်မှာ ဒီ binaries တွေကို C/C++ toolchain install လုပ်ထားစရာ မလိုတဲ့ users တွေက download လုပ်နိုင်ပါတယ်။

#### node-pre-gyp

[node-pre-gyp][] က node-gyp ကို အခြေခံတဲ့ ကိရိယာတစ်ခု ဖြစ်ပြီး — developer ရွေးချယ်တဲ့ server တစ်ခုဆီကို binaries တွေ upload လုပ်နိုင်စွမ်းကို ထပ်ဖြည့်ပေးပါတယ်။ node-pre-gyp က Amazon S3 ဆီကို binaries တွေ upload လုပ်ရာမှာ အထူးကောင်းမွန်တဲ့ support ရှိပါတယ်။

#### prebuild

[prebuild][] က node-gyp သို့မဟုတ် CMake.js ကို သုံးပြီး build လုပ်တာတွေကို support လုပ်တဲ့ ကိရိယာတစ်ခုပါ။ Servers အမျိုးမျိုးကို support လုပ်တဲ့ node-pre-gyp နဲ့ မတူပဲ — prebuild က binaries တွေကို [GitHub releases][] ဆီကိုသာ upload လုပ်ပါတယ်။ CMake.js ကို သုံးတဲ့ GitHub projects တွေအတွက် prebuild က ရွေးချယ်မှု ကောင်းတစ်ခုပါ။

#### prebuildify

[prebuildify][] က node-gyp ကို အခြေခံတဲ့ ကိရိယာတစ်ခုပါ။ prebuildify ရဲ့ အားသာချက်က — npm ဆီကို upload လုပ်တဲ့အခါ — build လုပ်ပြီးသား binaries တွေက native addon နဲ့အတူ ထည့်သွင်းပြီးသား (bundled) ဖြစ်နေတာပါ။ Binaries တွေကို npm ကနေ download လုပ်ပြီး — native addon install လုပ်တာနဲ့ — module user အတွက် ချက်ချင်း ရရှိနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

Node-API functions တွေကို သုံးနိုင်ဖို့ — node development tree ထဲက src directory မှာ ရှိတဲ့ [`node_api.h`][] file ကို include လုပ်ပါ:

```c
#include <node_api.h>
```

ဒါက ပေးထားတဲ့ Node.js release အတွက် default `NAPI_VERSION` ကို ရွေးချယ်သုံးစွဲ (opt-in) လုပ်တာ ဖြစ်ပါတယ်။ Node-API ရဲ့ တိကျတဲ့ versions တွေနဲ့ လိုက်ဖက်ညီမှုကို သေချာစေဖို့အတွက် — header ကို include လုပ်တဲ့အခါ version ကို ရှင်းလင်းစွာ (explicitly) သတ်မှတ်နိုင်ပါတယ်:

```c
#define NAPI_VERSION 3
#include <node_api.h>
```

ဒါက Node-API surface ကို — သတ်မှတ်ထားတဲ့ (နဲ့ အစောပိုင်း) versions တွေမှာ ရနိုင်ခဲ့တဲ့ လုပ်ဆောင်ချက်တွေနဲ့သာ ကန့်သတ်ပေးပါတယ်။

Node-API surface ရဲ့ တစ်ချို့ အစိတ်အပိုင်းတွေက experimental (စမ်းသပ်ဆဲ) ဖြစ်ပြီး — ရှင်းလင်းစွာ opt-in လုပ်ဖို့ လိုအပ်ပါတယ်:

```c
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```

ဒီကိစ္စမှာဆိုရင် — experimental APIs တွေ အပါအဝင် — API surface တစ်ခုလုံးက module code အတွက် ရရှိနိုင်ပါလိမ့်မယ်။

ရံဖန်ရံခါမှာ — ထွက်ပြီးသား (already-released) နဲ့ stable APIs တွေကို သက်ရောက်မှုရှိတဲ့ experimental features တွေကို မိတ်ဆက်လေ့ ရှိပါတယ်။ ဒီ features တွေကို opt-out (ရွေးချယ် ပိတ်ပစ်ခြင်း) တစ်ခုနဲ့ ပိတ်ထားနိုင်ပါတယ်:

```c
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```

ဒီမှာ `<FEATURE_NAME>` က — experimental ရော stable APIs ပါ နှစ်ခုလုံးကို သက်ရောက်မှုရှိတဲ့ experimental feature တစ်ခုရဲ့ နာမည်ပါ။

## Node-API version matrix (Node-API version ဇယား)

Version 9 အထိ — Node-API versions တွေက additive (ထပ်ဆောင်း သဘော) ဖြစ်ပြီး — Node.js ကနေ သီးခြား သီးသန့် version သတ်မှတ်ပါတယ်။ ဆိုလိုတာက — version တိုင်းက ယခင် version ရဲ့ APIs တွေ အားလုံး ပါဝင်ပြီး ထပ်ဆောင်းချက်တစ်ချို့ပါ ပါတာမို့ — ယခင် version တစ်ခုရဲ့ extension (တိုးချဲ့မှု) တစ်ခု ဖြစ်ပါတယ်။ Node.js version တစ်ခုချင်းစီက Node-API version တစ်ခုတည်းကိုသာ support လုပ်ပါတယ်။ ဥပမာ — v18.15.0 က Node-API version 8 ကိုသာ support လုပ်ပါတယ်။ 8 က ယခင် versions တွေ အားလုံးရဲ့ strict superset (တိကျသော အစုအဝေး လွှမ်းခြုံမှု) တစ်ခု ဖြစ်တာမို့ — ABI stability ကို ရရှိခဲ့ပါတယ်။

Version 9 ကစပြီး — Node-API versions တွေက သီးခြား version သတ်မှတ်တာ ဆက်လုပ်နေပေမယ့် — Node-API version 9 နဲ့ run ခဲ့တဲ့ add-on တစ်ခုက Node-API version 10 နဲ့ run ဖို့ဆိုရင် code updates တွေ လိုအပ်နိုင်ပါတယ်။ ဒါပေမယ့် ABI stability ကတော့ ထိန်းသိမ်းထားပါတယ် — အကြောင်းကတော့ Node-API version 8 ထက် မြင့်တဲ့ versions တွေကို support လုပ်တဲ့ Node.js versions တွေက — 8 ကနေ ၎င်းတို့ support လုပ်တဲ့ အမြင့်ဆုံး version ကြားက versions တွေ အားလုံးကို support လုပ်ပြီး — add-on တစ်ခုက ပိုမြင့်တဲ့ Node-API version တစ်ခုကို opt-in မလုပ်ရသေးရင် — version 8 APIs တွေကို default အနေနဲ့ ပေးအပ်မှာ ဖြစ်လို့ပါ။ ဒီနည်းလမ်းက ABI stability ကို ထိန်းသိမ်းထားရင်း — ရှိပြီးသား Node-API functions တွေကို ပိုကောင်းအောင် optimize လုပ်နိုင်တဲ့ ပြောင်းလွယ်ပြင်လွယ်မှုကို ပေးပါတယ်။ ရှိပြီးသား add-ons တွေက — Node-API ရဲ့ အစောပိုင်း version တစ်ခုကို သုံးပြီး — ပြန်လည် compile လုပ်စရာ မလိုပဲ ဆက်လက် run နိုင်ပါတယ်။ Add-on တစ်ခုက Node-API version အသစ်တစ်ခုရဲ့ လုပ်ဆောင်ချက်တွေ လိုအပ်တယ်ဆိုရင် — အဲဒီ functions အသစ်တွေကို သုံးဖို့ — ရှိပြီးသား code တွေကို ပြောင်းလဲပြီး ပြန်လည် compile လုပ်ဖို့ လိုအပ်ပါလိမ့်မယ်။

Node-API version 9 နဲ့ နောက်ပိုင်းကို support လုပ်တဲ့ Node.js versions တွေမှာ — `NAPI_VERSION=X` လို့ define လုပ်ပြီး — ရှိပြီးသား add-on initialization macros တွေကို သုံးမယ်ဆိုရင် — runtime မှာ သုံးမယ့် လိုအပ်တဲ့ Node-API version ကို add-on ထဲကို bake in (ထည့်သွင်းပြီးသား) လုပ်ပေးပါလိမ့်မယ်။ `NAPI_VERSION` ကို သတ်မှတ်မထားဘူးဆိုရင် — 8 ကို default အဖြစ် သုံးပါလိမ့်မယ်။

ဒီဇယားက အဟောင်း streams တွေမှာ ခေတ်မမီတာ ဖြစ်နိုင်ပါတယ်။ နောက်ဆုံးရ အချက်အလက်တွေကို အောက်ပါ နေရာမှာ ရှိတဲ့ နောက်ဆုံး API documentation ထဲမှာ ကြည့်နိုင်ပါတယ်: [Node-API version matrix](https://nodejs.org/docs/latest/api/n-api.html#node-api-version-matrix)

| Node-API version | Supported In |
| --- | --- |
| 10 | v22.14.0+, 23.6.0+ နှင့် နောက်ပိုင်း versions အားလုံး |
| 9 | v18.17.0+, 20.3.0+, 21.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 နှင့် နောက်ပိုင်း versions အားလုံး |

\* Node-API က experimental အဆင့်မှာ ရှိခဲ့ပါတယ်။

\*\* Node.js 8.0.0 မှာ Node-API ကို experimental အနေနဲ့ ထည့်သွင်း ပေးခဲ့ပါတယ်။ ၎င်းကို Node-API version 1 အဖြစ် ထုတ်ဝေခဲ့ပေမယ့် — Node.js 8.6.0 အထိ ဆက်လက် တိုးတက် ပြောင်းလဲခဲ့ပါတယ်။ Node.js 8.6.0 မတိုင်ခင် versions တွေမှာ API က ကွဲပြားပါတယ်။ Node-API version 3 သို့မဟုတ် နောက်ပိုင်းကို သုံးဖို့ အကြံပြုပါတယ်။

Node-API အတွက် မှတ်တမ်းတင်ထားတဲ့ API တစ်ခုချင်းစီမှာ `added in:` ဆိုတဲ့ header တစ်ခု ပါမှာ ဖြစ်ပြီး — stable ဖြစ်တဲ့ APIs တွေမှာတော့ `Node-API version:` ဆိုတဲ့ နောက်ထပ် header တစ်ခုပါ ပါမှာ ဖြစ်ပါတယ်။ `Node-API version:` မှာ ပြထားတဲ့ Node-API version သို့မဟုတ် အဲဒါထက် မြင့်တဲ့ version ကို support လုပ်တဲ့ Node.js version တစ်ခုကို သုံးနေရင် — APIs တွေကို တိုက်ရိုက် သုံးနိုင်ပါတယ်။ ဖော်ပြထားတဲ့ `Node-API version:` ကို support မလုပ်တဲ့ Node.js version တစ်ခုကို သုံးနေတာ သို့မဟုတ် `Node-API version:` လုံးဝ ဖော်ပြမထားဘူးဆိုရင် — API က `node_api.h` သို့မဟုတ် `js_native_api.h` ကို include လုပ်တာရဲ့ ရှေ့မှာ `#define NAPI_EXPERIMENTAL` ရှိနေမှသာ ရရှိနိုင်ပါလိမ့်မယ်။ API တစ်ခုက `added in:` မှာ ဖော်ပြထားတဲ့ version ထက် နောက်ကျတဲ့ Node.js version တစ်ခုပေါ်မှာ မရနိုင်သလို ထင်ရရင် — အဲဒီလို မရနိုင်ဘူးလို့ ထင်ရခြင်းရဲ့ အကြောင်းရင်းက ဒါပဲ ဖြစ်နိုင်ခြေ အများဆုံးပါ။

Native code ကနေ ECMAScript features တွေကို ဝင်ရောက်သုံးစွဲခြင်းနဲ့သာ သက်ဆိုင်တဲ့ Node-APIs တွေကို `js_native_api.h` နဲ့ `js_native_api_types.h` ထဲမှာ သီးခြား တွေ့ရှိနိုင်ပါတယ်။ ဒီ headers တွေမှာ define လုပ်ထားတဲ့ APIs တွေကို `node_api.h` နဲ့ `node_api_types.h` ထဲမှာ ထည့်သွင်းထားပါတယ်။ Headers တွေကို Node.js အပြင်ဘက်မှာ Node-API ရဲ့ implementations တွေ ရေးသားနိုင်စေဖို့အတွက် ဒီလိုပုံစံမျိုးနဲ့ ဖွဲ့စည်းထားပါတယ်။ အဲဒီလို implementations တွေအတွက် — Node.js အတွက် သီးသန့် APIs တွေက သင့်လျော်မှု မရှိနိုင်ပါဘူး။

Addon တစ်ခုရဲ့ Node.js-specific အစိတ်အပိုင်းတွေကို — JavaScript environment ဆီကို တကယ့် လုပ်ဆောင်ချက်တွေကို ထုတ်ဖော်ပေးတဲ့ code ကနေ ခွဲထုတ်နိုင်ပြီး — နောက်တစ်ခုကို Node-API ရဲ့ implementations အများအပြားနဲ့ သုံးနိုင်ပါတယ်။ အောက်က ဥပမာမှာ — `addon.c` နဲ့ `addon.h` တို့က `js_native_api.h` ကိုသာ ရည်ညွှန်းပါတယ်။ ဒါက `addon.c` ကို — Node.js ရဲ့ Node-API implementation နဲ့ဖြစ်စေ သို့မဟုတ် Node.js အပြင်ဘက်က Node-API implementation တစ်ခုခုနဲ့ဖြစ်စေ — compile လုပ်ဖို့ ပြန်လည် သုံးစွဲနိုင်စေပါတယ်။

`addon_node.c` က သီးခြား file တစ်ခု ဖြစ်ပြီး — addon ရဲ့ Node.js-specific entry point ကို ပါဝင်စေကာ — addon ကို Node.js environment တစ်ခုထဲကို load လုပ်တဲ့အခါ — `addon.c` ထဲကို ခေါ်ယူပြီး addon ကို instantiate လုပ်ပါတယ်။

```c
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```

```c
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```

```c
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## Environment life cycle APIs (environment သက်တမ်း စက်ဝန်း APIs)

[ECMAScript Language Specification][] ရဲ့ [Section Agents][] က "Agent" ဆိုတဲ့ concept ကို — JavaScript code တွေ run တဲ့ — ကိုယ်ပိုင် ပြည့်စုံတဲ့ (self-contained) environment တစ်ခုအဖြစ် သတ်မှတ်ပါတယ်။ အဲဒီလို Agents အများအပြားကို process ကနေ — တစ်ပြိုင်နက် သို့မဟုတ် အစဉ်လိုက် — စတင်ခြင်း၊ အဆုံးသတ်ခြင်း ပြုလုပ်နိုင်ပါတယ်။

Node.js environment တစ်ခုက ECMAScript Agent တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ Main process မှာ — environment တစ်ခုကို startup မှာ ဖန်တီးပြီး — [worker threads][] တွေအဖြစ် ဆောင်ရွက်ဖို့ သီးခြား threads တွေပေါ်မှာ နောက်ထပ် environments တွေကို ဖန်တီးနိုင်ပါတယ်။ Node.js ကို အခြား application တစ်ခုထဲမှာ embed လုပ်ထားတဲ့အခါ — application ရဲ့ main thread က — application process ရဲ့ သက်တမ်း (life cycle) တစ်လျှောက်မှာ — Node.js environment တစ်ခုကို အကြိမ်များစွာ တည်ဆောက်ခြင်း၊ ဖျက်သိမ်းခြင်း ပြုလုပ်နိုင်ပြီး — application က ဖန်တီးလိုက်တဲ့ Node.js environment တစ်ခုချင်းစီကလည်း — ၎င်းရဲ့ သက်တမ်းအတွင်းမှာ — worker threads တွေအနေနဲ့ နောက်ထပ် environments တွေကို ဖန်တီးခြင်း၊ ဖျက်သိမ်းခြင်း ပြုလုပ်နိုင်ပါတယ်။

Native addon တစ်ခုရဲ့ ရှုထောင့်ကနေ ကြည့်ရင် — ဒါက ၎င်းက ပေးတဲ့ bindings တွေကို — အကြိမ်များစွာ၊ context အမျိုးမျိုးကနေ၊ ပြီးတော့ threads အများအပြားကနေ တစ်ပြိုင်နက်တောင် — ခေါ်ယူခံရနိုင်တယ်လို့ ဆိုလိုပါတယ်။

Native addons တွေက — Node.js environment တစ်ခုရဲ့ သက်တမ်းအတွင်း ၎င်းတို့ သုံးတဲ့ — global state တစ်ခုကို ခွဲဝေချထားဖို့ လိုအပ်နိုင်ပြီး — အဲဒီ state က addon ရဲ့ instance တစ်ခုချင်းစီအတွက် သီးခြား (unique) ဖြစ်နေစေဖို့ လိုအပ်ပါတယ်။

ဒီအတွက် — Node-API က data တစ်ခုကို ၎င်းရဲ့ သက်တမ်းက Node.js environment တစ်ခုရဲ့ သက်တမ်းနဲ့ ချိတ်ဆက်ထားတဲ့ပုံစံမျိုး — ဆက်စပ်သွားစေဖို့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။

### `napi_set_instance_data`

```c
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```

* `[in] env`: ဒီ Node-API call ကို ခေါ်ယူနေတဲ့ (invoke လုပ်နေတဲ့) environment ပါ။
* `[in] data`: ဒီ instance ရဲ့ bindings တွေအတွက် ရရှိနိုင်အောင် လုပ်ပေးရမယ့် data item ပါ။
* `[in] finalize_cb`: Environment ကို ဖျက်သိမ်း (tear down) လုပ်နေတဲ့အခါ ခေါ်ယူရမယ့် function ပါ။ ဒီ function က `data` ကို လက်ခံရရှိပြီး — ၎င်းကို လွှတ်ပေးနိုင်ပါတယ်။ အသေးစိတ်တွေကို [`napi_finalize`][] မှာ ကြည့်ပါ။
* `[in] finalize_hint`: Collection (ပြန်လည် သိမ်းဆည်းခြင်း) လုပ်ဆောင်နေစဉ် finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် Optional hint ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `data` ကို လက်ရှိ run နေတဲ့ Node.js environment နဲ့ ဆက်စပ်ပေးပါတယ်။ `data` ကို နောက်ပိုင်းမှာ `napi_get_instance_data()` ကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။ `napi_set_instance_data()` ဆီကို ယခင် call တစ်ခုကနေတစ်ဆင့် သတ်မှတ်ခဲ့တဲ့ — လက်ရှိ run နေတဲ့ Node.js environment နဲ့ ဆက်စပ်ထားတဲ့ — ရှိပြီးသား data တွေကို အစားထိုး (overwrite) လုပ်ပါလိမ့်မယ်။ ယခင် call က `finalize_cb` တစ်ခုကို ပေးအပ်ခဲ့ရင်တောင် — အဲဒါကို ခေါ်ယူမှာ မဟုတ်ပါဘူး။

### `napi_get_instance_data`

```c
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```

* `[in] env`: ဒီ Node-API call ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[out] data`: `napi_set_instance_data()` ဆီကို ခေါ်ယူခြင်းအားဖြင့် လက်ရှိ run နေတဲ့ Node.js environment နဲ့ အရင်က ဆက်စပ်ထားခဲ့တဲ့ data item ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `napi_set_instance_data()` ကနေတစ်ဆင့် လက်ရှိ run နေတဲ့ Node.js environment နဲ့ အရင်က ဆက်စပ်ထားခဲ့တဲ့ data ကို ပြန်လည် ရယူပါတယ်။ Data ဘာမှ သတ်မှတ်မထားဘူးဆိုရင် — call က အောင်မြင်ပြီး — `data` ကို `NULL` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။

## Basic Node-API data types (Node-API ၏ အခြေခံ data types)

Node-API က အောက်ပါ အခြေခံ data types တွေကို — APIs အမျိုးမျိုးက စားသုံးတဲ့ — abstractions (စိတ္တဇ ကိုယ်စားပြုမှုများ) အနေနဲ့ ထုတ်ဖော်ပေးပါတယ်။ ဒီ data types တွေကို opaque (အတွင်းပိုင်း မမြင်ရသော) အဖြစ် သဘောထားရပြီး — တခြား Node-API calls တွေနဲ့သာ စစ်ဆေး (introspect) လုပ်နိုင်ပါတယ်။

### `napi_status`

Node-API call တစ်ခုရဲ့ အောင်မြင်မှု သို့မဟုတ် မအောင်မြင်မှုကို ဖော်ပြတဲ့ integral (ကိန်းပြည့်) status code ပါ။ လက်ရှိမှာ အောက်ပါ status codes တွေကို support လုပ်ပါတယ်။

```c
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```

API တစ်ခုက failed status တစ်ခုကို ပြန်ပေးတဲ့အခါ နောက်ထပ် အချက်အလက်တွေ လိုအပ်ရင် — `napi_get_last_error_info` ကို ခေါ်ယူခြင်းအားဖြင့် ရယူနိုင်ပါတယ်။

### `napi_extended_error_info`

```c
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```

* `error_message`: Error ရဲ့ VM-neutral (VM နဲ့ ဘက်မလိုက်) ဖော်ပြချက် ပါဝင်တဲ့ UTF8-encoded string ပါ။
* `engine_reserved`: VM-specific error အသေးစိတ်တွေအတွက် သီးသန့် သိမ်းဆည်းထားပါတယ်။ လက်ရှိမှာ ဘယ် VM အတွက်မှ implement မလုပ်ရသေးပါဘူး။
* `engine_error_code`: VM-specific error code ပါ။ လက်ရှိမှာ ဘယ် VM အတွက်မှ implement မလုပ်ရသေးပါဘူး။
* `error_code`: နောက်ဆုံး error နဲ့ စတင်ခဲ့တဲ့ Node-API status code ပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် [Error handling][] section ကို ကြည့်ပါ။

### `napi_env`

`napi_env` ကို — အောက်ခြေ Node-API implementation က VM-specific state တွေကို ထိန်းသိမ်းဖို့ (persist) သုံးနိုင်တဲ့ — context တစ်ခုကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ ဒီ structure ကို native functions တွေကို ခေါ်ယူတဲ့အခါ ၎င်းတို့ဆီကို ဖြတ်သန်းပေးပြီး — Node-API calls တွေ လုပ်တဲ့အခါ ပြန်လည် ဖြတ်သန်းပေးရပါမယ်။ အထူးသဖြင့် — ကနဦး native function ကို ခေါ်တဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ `napi_env` ကိုပဲ — နောက်ပိုင်း nested Node-API calls တွေ အားလုံးဆီကိုလည်း ဖြတ်သန်းပေးရပါမယ်။ ယေဘုယျ ပြန်လည်သုံးစွဲဖို့အတွက် `napi_env` ကို cache လုပ်ထားခြင်းနဲ့ — [`Worker`][] threads အမျိုးမျိုးပေါ်မှာ run နေတဲ့ addon တစ်ခုတည်းရဲ့ instances တွေကြားမှာ `napi_env` ကို ဖြတ်သန်းခြင်းကို ခွင့်မပြုပါဘူး။ Native addon တစ်ခုရဲ့ instance တစ်ခုကို unload လုပ်တဲ့အခါ — `napi_env` က invalid ဖြစ်သွားပါတယ်။ ဒီအဖြစ်အပျက်ရဲ့ အသိပေးချက်ကို [`napi_add_env_cleanup_hook`][] နဲ့ [`napi_set_instance_data`][] တို့ဆီကို ပေးအပ်ထားတဲ့ callbacks တွေကနေတစ်ဆင့် ပို့ဆောင်ပေးပါတယ်။

### `node_api_basic_env`

> Stability: 1 - Experimental

`napi_env` ရဲ့ ဒီ variant ကို synchronous finalizers တွေ ([`node_api_basic_finalize`][]) ဆီကို ဖြတ်သန်းပေးပါတယ်။ ပထမဆုံး argument အနေနဲ့ `node_api_basic_env` type ရဲ့ parameter တစ်ခုကို လက်ခံတဲ့ Node-APIs အစုခွဲ (subset) တစ်ခု ရှိပါတယ်။ ဒီ APIs တွေက JavaScript engine ရဲ့ state ကို ဝင်ရောက် သုံးစွဲခြင်း မရှိတာမို့ — synchronous finalizers တွေကနေ ခေါ်ယူဖို့ လုံခြုံပါတယ်။ ဒီ APIs တွေဆီကို `napi_env` type ရဲ့ parameter တစ်ခုကို ဖြတ်သန်းတာကတော့ ခွင့်ပြုပါတယ်။ ဒါပေမယ့် — JavaScript engine state ကို ဝင်ရောက် သုံးစွဲတဲ့ APIs တွေဆီကို `node_api_basic_env` type ရဲ့ parameter တစ်ခုကို ဖြတ်သန်းတာကတော့ ခွင့်မပြုပါဘူး။ Cast မလုပ်ပဲ အဲဒီလို ကြိုးစားလိုက်ရင် — function တစ်ခုဆီကို မှားယွင်းတဲ့ pointer types တွေ ဖြတ်သန်းတဲ့အခါ warnings နဲ့/သို့မဟုတ် errors တွေ ထုတ်လွှတ်စေတဲ့ flags တွေနဲ့ add-ons တွေကို compile လုပ်တဲ့အခါ — compiler warning သို့မဟုတ် error တစ်ခု ဖြစ်ပေါ်စေပါလိမ့်မယ်။ Synchronous finalizer တစ်ခုကနေ အဲဒီလို APIs တွေကို ခေါ်ယူတာက — နောက်ဆုံးမှာ application ကို အဆုံးသတ် (terminate) လုပ်ပစ်ပါလိမ့်မယ်။

### `napi_value`

ဒါက JavaScript value တစ်ခုကို ကိုယ်စားပြုဖို့ သုံးတဲ့ opaque pointer တစ်ခုပါ။

### `napi_threadsafe_function`

ဒါက — `napi_call_threadsafe_function()` ကနေတစ်ဆင့် threads အများအပြားကနေ asynchronously ခေါ်ယူနိုင်တဲ့ — JavaScript function တစ်ခုကို ကိုယ်စားပြုတဲ့ opaque pointer တစ်ခုပါ။

### `napi_threadsafe_function_release_mode`

Thread-safe function ကို ချက်ချင်း ပိတ်ပစ်ရမလား (`napi_tsfn_abort`) သို့မဟုတ် ရိုးရိုး release လုပ်ရုံသာ လုပ်ပြီး (`napi_tsfn_release`) — `napi_acquire_threadsafe_function()` နဲ့ `napi_call_threadsafe_function()` တို့ကနေတစ်ဆင့် နောက်ပိုင်း အသုံးပြုဖို့ ရရှိနိုင်အောင် ထားရမလားဆိုတာကို ဖော်ပြဖို့ — `napi_release_threadsafe_function()` ဆီကို ပေးအပ်ရမယ့် တန်ဖိုးတစ်ခုပါ။

```c
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```

### `napi_threadsafe_function_call_mode`

Thread-safe function နဲ့ ဆက်စပ်နေတဲ့ queue ပြည့်နေတဲ့အခါတိုင်း — call က block ဖြစ်သင့်လားဆိုတာကို ဖော်ပြဖို့ — `napi_call_threadsafe_function()` ဆီကို ပေးအပ်ရမယ့် တန်ဖိုးတစ်ခုပါ။

```c
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```

### Node-API memory management types (Node-API memory management type များ)

#### `napi_handle_scope`

ဒါက — တိကျတဲ့ scope တစ်ခုအတွင်းမှာ ဖန်တီးလိုက်တဲ့ objects တွေရဲ့ သက်တမ်း (lifetime) ကို ထိန်းချုပ်ခြင်းနဲ့ ပြုပြင်ခြင်းအတွက် သုံးတဲ့ abstraction တစ်ခုပါ။ ယေဘုယျအားဖြင့် — Node-API values တွေကို handle scope တစ်ခုရဲ့ context အတွင်းမှာ ဖန်တီးပါတယ်။ JavaScript ကနေ native method တစ်ခုကို ခေါ်တဲ့အခါ — default handle scope တစ်ခု ရှိနေပါလိမ့်မယ်။ User က handle scope အသစ်တစ်ခုကို ရှင်းလင်းစွာ (explicitly) မဖန်တီးဘူးဆိုရင် — Node-API values တွေကို default handle scope ထဲမှာ ဖန်တီးပါလိမ့်မယ်။ Native method တစ်ခုရဲ့ execution အပြင်ဘက်မှာ code တွေ ခေါ်ယူမှု မဆိုရင် (ဥပမာ — libuv callback တစ်ခုရဲ့ invocation အတွင်းမှာ) — module က JavaScript values တွေ ဖန်တီးခြင်းဆီကို ဦးတည်နိုင်တဲ့ functions တွေကို မခေါ်ခင် — scope တစ်ခုကို ဦးစွာ ဖန်တီးရန် လိုအပ်ပါတယ်။

Handle scopes တွေကို [`napi_open_handle_scope`][] ကို သုံးပြီး ဖန်တီးပြီး — [`napi_close_handle_scope`][] ကို သုံးပြီး ဖျက်ဆီးပါတယ်။ Scope ကို ပိတ်လိုက်တာက — handle scope ရဲ့ သက်တမ်းအတွင်း ဖန်တီးခဲ့တဲ့ `napi_value` တွေ အားလုံးကို — လက်ရှိ stack frame ကနေ နောက်ထပ် ရည်ညွှန်းခြင်း (referenced) မရှိတော့ကြောင်း — GC ဆီကို အချက်ပြနိုင်ပါတယ်။

နောက်ထပ် အသေးစိတ်တွေအတွက် [Object lifetime management][] ကို ပြန်လည် သုံးသပ်ပါ။

#### `napi_escapable_handle_scope`

Escapable handle scopes တွေက — တိကျတဲ့ handle scope တစ်ခုအတွင်းမှာ ဖန်တီးထားတဲ့ values တွေကို parent scope တစ်ခုဆီကို ပြန်ပေးဖို့အတွက် — အထူး handle scope type တစ်ခုပါ။

#### `napi_ref`

ဒါက `napi_value` တစ်ခုကို reference (ရည်ညွှန်း) လုပ်ဖို့ သုံးရမယ့် abstraction ပါ။ ဒါက users တွေကို — JavaScript values တွေရဲ့ သက်တမ်းတွေကို စီမံခန့်ခွဲခြင်း၊ ၎င်းတို့ရဲ့ အနည်းဆုံး သက်တမ်း (minimum lifetime) တွေကို ရှင်းလင်းစွာ သတ်မှတ်ခြင်း အပါအဝင် — ခွင့်ပြုပါတယ်။

နောက်ထပ် အသေးစိတ်တွေအတွက် [Object lifetime management][] ကို ပြန်လည် သုံးသပ်ပါ။

#### `napi_type_tag`

Unsigned 64-bit integers နှစ်ခုအနေနဲ့ သိမ်းဆည်းထားတဲ့ 128-bit value တစ်ခုပါ။ ၎င်းက — JavaScript objects သို့မဟုတ် [externals][] တွေကို တိကျတဲ့ type တစ်ခု ဖြစ်ကြောင်း သေချာစေဖို့ "tag" လုပ်နိုင်တဲ့ — UUID တစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်။ ဒါက [`napi_instanceof`][] ထက် ပိုမို ခိုင်မာတဲ့ စစ်ဆေးမှုတစ်ခုပါ — အကြောင်းကတော့ နောက်တစ်ခုက object ရဲ့ prototype ကို ကြိုးကိုင် ခြယ်လှယ်ထားရင် — false positive (မှားယွင်းစွာ အမှန်ဟု ထင်မှတ်မှု) တစ်ခုကို ဖော်ပြနိုင်လို့ပါ။ Type-tagging က [`napi_wrap`][] နဲ့ တွဲသုံးတဲ့အခါ အသုံးဝင်ဆုံး ဖြစ်ပါတယ် — အကြောင်းကတော့ ၎င်းက wrapped object တစ်ခုကနေ ပြန်လည် ရယူလိုက်တဲ့ pointer ကို — JavaScript object ပေါ်ကို အရင်က အသုံးပြုခဲ့တဲ့ type tag နဲ့ ကိုက်ညီတဲ့ native type ဆီကို လုံခြုံစွာ cast လုပ်နိုင်ကြောင်း သေချာစေလို့ပါ။

```c
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```

#### `napi_async_cleanup_hook_handle`

[`napi_add_async_cleanup_hook`][] က ပြန်ပေးတဲ့ opaque value တစ်ခုပါ။ Asynchronous cleanup events တွေရဲ့ chain (ဆက်တန်း) တစ်ခု ပြီးဆုံးသွားတဲ့အခါ — ၎င်းကို [`napi_remove_async_cleanup_hook`][] ဆီကို ဖြတ်သန်းပေးရပါမယ်။

### Node-API callback types (Node-API callback type များ)

#### `napi_callback_info`

Callback function တစ်ခုဆီကို ဖြတ်သန်းပေးတဲ့ opaque datatype တစ်ခုပါ။ Callback ကို ခေါ်ယူခဲ့တဲ့ context အကြောင်း နောက်ထပ် အချက်အလက်တွေ ရယူဖို့ ၎င်းကို သုံးနိုင်ပါတယ်။

#### `napi_callback`

Node-API ကနေတစ်ဆင့် JavaScript ဆီကို ထုတ်ဖော်ပေးရမယ့် — user က ပေးအပ်တဲ့ native functions တွေအတွက် function pointer type ပါ။ Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```

[Object Lifetime Management][] မှာ ဆွေးနွေးထားတဲ့ အကြောင်းပြချက်တွေ မရှိရင် — `napi_callback` တစ်ခုရဲ့ အတွင်းမှာ handle နဲ့/သို့မဟုတ် callback scope တစ်ခု ဖန်တီးဖို့ မလိုအပ်ပါဘူး။

#### `node_api_basic_finalize`

> Stability: 1 - Experimental

Add-on က ပေးအပ်တဲ့ functions တွေအတွက် function pointer type ပါ — ၎င်းတို့က — ဆက်စပ်နေတဲ့ object ကို garbage-collect လုပ်လိုက်တာကြောင့် — ပြင်ပ ပိုင်ဆိုင်မှု (externally-owned) ရှိတဲ့ data တစ်ခုကို cleanup လုပ်ဖို့ အသင့်ဖြစ်တဲ့အခါ — user ကို အသိပေးနိုင်စေပါတယ်။ User က object ရဲ့ collection လုပ်ဆောင်မှုမှာ ခေါ်ယူခံရမယ့် အောက်ပါ signature နဲ့ ကိုက်ညီတဲ့ function တစ်ခုကို ပေးအပ်ရပါမယ်။ လက်ရှိမှာ `node_api_basic_finalize` ကို — external data တွေ ရှိတဲ့ objects တွေကို ဘယ်အချိန်မှာ collect လုပ်လဲဆိုတာ သိရှိဖို့ သုံးနိုင်ပါတယ်။

```c
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```

[Object Lifetime Management][] မှာ ဆွေးနွေးထားတဲ့ အကြောင်းပြချက်တွေ မရှိရင် — function body ရဲ့ အတွင်းမှာ handle နဲ့/သို့မဟုတ် callback scope တစ်ခု ဖန်တီးဖို့ မလိုအပ်ပါဘူး။

ဒီ functions တွေကို JavaScript engine က JavaScript code တွေ execute လုပ်လို့ မရတဲ့ state တစ်ခုမှာ ရှိနေတုန်း ခေါ်ယူခံရနိုင်တာမို့ — ပထမဆုံး parameter အနေနဲ့ `node_api_basic_env` တစ်ခုကို လက်ခံတဲ့ Node-APIs တွေကိုသာ ခေါ်ယူနိုင်ပါတယ်။ JavaScript engine ရဲ့ state ကို ဝင်ရောက်ဖို့ လိုအပ်တဲ့ Node-API calls တွေကို — လက်ရှိ garbage collection cycle ပြီးဆုံးပြီးနောက်မှာ run နိုင်အောင် — [`node_api_post_finalizer`][] ကို သုံးပြီး အချိန်ဇယား ဆွဲနိုင်ပါတယ်။

[`node_api_create_external_string_latin1`][] နဲ့ [`node_api_create_external_string_utf16`][] တို့ရဲ့ ကိစ္စမှာဆိုရင် — `env` parameter က null ဖြစ်နိုင်ပါတယ် — အကြောင်းကတော့ external strings တွေကို environment shutdown ရဲ့ နောက်ပိုင်း အဆင့်တွေအတွင်းမှာ collect လုပ်ခံရနိုင်လို့ပါ။

Change History:

* experimental (`NAPI_EXPERIMENTAL`):

  ပထမဆုံး parameter အနေနဲ့ `node_api_basic_env` တစ်ခုကို လက်ခံတဲ့ Node-API calls တွေကိုသာ ခေါ်ယူနိုင်ပါတယ် — မဟုတ်ရင် application ကို သင့်လျော်တဲ့ error message တစ်ခုနဲ့အတူ အဆုံးသတ်ပစ်ပါလိမ့်မယ်။ ဒီ feature ကို `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` ကို define လုပ်ခြင်းအားဖြင့် ပိတ်ထားနိုင်ပါတယ်။

#### `napi_finalize`

Add-on က ပေးအပ်တဲ့ functions တွေအတွက် function pointer type ပါ — ၎င်းတို့က user ကို — garbage collection cycle ပြီးဆုံးပြီးနောက်မှာ — garbage collection event တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ — Node-APIs ဆီကို ခေါ်ယူမှု အုပ်စု (group of calls) တစ်ခုကို အချိန်ဇယား ဆွဲနိုင်စေပါတယ်။ ဒီ function pointers တွေကို [`node_api_post_finalizer`][] နဲ့အတူ သုံးနိုင်ပါတယ်။

```c
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```

Change History:

* experimental (`NAPI_EXPERIMENTAL` is defined):

  ဒီ type ရဲ့ function တစ်ခုကို — [`node_api_post_finalizer`][] နဲ့ကလွဲလို့ — finalizer အဖြစ် နောက်ထပ် သုံးခွင့် မရှိတော့ပါဘူး။ အဲဒီအစား [`node_api_basic_finalize`][] ကို သုံးရပါမယ်။ ဒီ feature ကို `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` ကို define လုပ်ခြင်းအားဖြင့် ပိတ်ထားနိုင်ပါတယ်။

#### `napi_async_execute_callback`

Asynchronous operations တွေကို support လုပ်တဲ့ functions တွေနဲ့အတူ သုံးတဲ့ function pointer ပါ။ Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```

ဒီ function ရဲ့ implementations တွေက — JavaScript ကို execute လုပ်တဲ့ သို့မဟုတ် JavaScript objects တွေနဲ့ အပြန်အလှန် ဆက်သွယ်တဲ့ — Node-API calls တွေ ပြုလုပ်တာကို ရှောင်ကြဉ်ရပါမယ်။ Node-API calls တွေကို `napi_async_complete_callback` ထဲမှာသာ ထားသင့်ပါတယ်။ `napi_env` parameter ကို မသုံးပါနဲ့ — သုံးလိုက်ရင် JavaScript ရဲ့ execution ကို ဖြစ်ပေါ်စေနိုင်ခြေ များပါတယ်။

#### `napi_async_complete_callback`

Asynchronous operations တွေကို support လုပ်တဲ့ functions တွေနဲ့အတူ သုံးတဲ့ function pointer ပါ။ Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```

[Object Lifetime Management][] မှာ ဆွေးနွေးထားတဲ့ အကြောင်းပြချက်တွေ မရှိရင် — function body ရဲ့ အတွင်းမှာ handle နဲ့/သို့မဟုတ် callback scope တစ်ခု ဖန်တီးဖို့ မလိုအပ်ပါဘူး။

#### `napi_threadsafe_function_call_js`

Asynchronous thread-safe function calls တွေနဲ့အတူ သုံးတဲ့ function pointer ပါ။ Callback ကို main thread ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။ ၎င်းရဲ့ ရည်ရွယ်ချက်က — secondary threads တွေထဲက တစ်ခုကနေ queue ကနေတစ်ဆင့် ရောက်ရှိလာတဲ့ data item တစ်ခုကို သုံးပြီး — ပုံမှန်အားဖြင့် `napi_call_function` ကနေတစ်ဆင့် — JavaScript ထဲကို ခေါ်ယူမှုတစ်ခုအတွက် လိုအပ်တဲ့ parameters တွေကို တည်ဆောက်ပြီး — JavaScript ထဲကို ခေါ်ယူမှု ပြုလုပ်ဖို့ပါ။

Secondary thread ကနေ queue ကနေတစ်ဆင့် ရောက်ရှိလာတဲ့ data ကို `data` parameter ထဲမှာ ပေးအပ်ပြီး — ခေါ်ယူရမယ့် JavaScript function ကို `js_callback` parameter ထဲမှာ ပေးအပ်ပါတယ်။

Node-API က ဒီ callback ကို မခေါ်ခင် environment ကို ကြိုတင် ပြင်ဆင်ပေးတာမို့ — `napi_make_callback` ကနေတစ်ဆင့် မဟုတ်ပဲ — `napi_call_function` ကနေတစ်ဆင့် JavaScript function ကို ခေါ်ယူတာက လုံလောက်ပါတယ်။

Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```

* `[in] env`: API calls တွေအတွက် သုံးရမယ့် environment ပါ — ဒါမှမဟုတ် thread-safe function ကို ဖျက်သိမ်း (tear down) လုပ်နေပြီး `data` ကို လွှတ်ပေးဖို့ လိုအပ်နိုင်ရင် `NULL` ဖြစ်ပါတယ်။
* `[in] js_callback`: ခေါ်ယူရမယ့် JavaScript function ပါ — ဒါမှမဟုတ် thread-safe function ကို ဖျက်သိမ်းနေပြီး `data` ကို လွှတ်ပေးဖို့ လိုအပ်နိုင်ရင် `NULL` ဖြစ်ပါတယ်။ Thread-safe function ကို `js_callback` မပါပဲ ဖန်တီးထားရင်လည်း ၎င်းက `NULL` ဖြစ်နိုင်ပါတယ်။
* `[in] context`: Thread-safe function ကို ဖန်တီးတဲ့အခါ ပါဝင်ခဲ့တဲ့ optional data ပါ။
* `[in] data`: Secondary thread က ဖန်တီးလိုက်တဲ့ data ပါ။ ဒီ native data ကို — `js_callback` ကို ခေါ်ယူတဲ့အခါ parameters အဖြစ် ဖြတ်သန်းနိုင်တဲ့ — JavaScript values တွေအဖြစ် (Node-API functions တွေနဲ့) ပြောင်းလဲပေးဖို့က callback ရဲ့ တာဝန်ပါ။ ဒီ pointer ကို threads တွေနဲ့ ဒီ callback ကပဲ လုံးဝ စီမံခန့်ခွဲပါတယ်။ ဒါကြောင့် ဒီ callback က data ကို လွှတ်ပေးသင့်ပါတယ်။

[Object Lifetime Management][] မှာ ဆွေးနွေးထားတဲ့ အကြောင်းပြချက်တွေ မရှိရင် — function body ရဲ့ အတွင်းမှာ handle နဲ့/သို့မဟုတ် callback scope တစ်ခု ဖန်တီးဖို့ မလိုအပ်ပါဘူး။

#### `napi_cleanup_hook`

[`napi_add_env_cleanup_hook`][] နဲ့အတူ သုံးတဲ့ function pointer ပါ။ Environment ကို ဖျက်သိမ်းနေတဲ့အခါ ၎င်းကို ခေါ်ယူပါလိမ့်မယ်။

Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef void (*napi_cleanup_hook)(void* data);
```

* `[in] data`: [`napi_add_env_cleanup_hook`][] ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ data ပါ။

#### `napi_async_cleanup_hook`

[`napi_add_async_cleanup_hook`][] နဲ့အတူ သုံးတဲ့ function pointer ပါ။ Environment ကို ဖျက်သိမ်းနေတဲ့အခါ ၎င်းကို ခေါ်ယူပါလိမ့်မယ်။

Callback functions တွေက အောက်ပါ signature ကို လိုက်နာရပါမယ်:

```c
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```

* `[in] handle`: Asynchronous cleanup ပြီးဆုံးပြီးနောက် [`napi_remove_async_cleanup_hook`][] ဆီကို ဖြတ်သန်းပေးရမယ့် handle ပါ။
* `[in] data`: [`napi_add_async_cleanup_hook`][] ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ data ပါ။

Function ရဲ့ body က asynchronous cleanup လုပ်ဆောင်ချက်တွေကို စတင်သင့်ပြီး — ၎င်းတို့ရဲ့ အဆုံးမှာ `handle` ကို [`napi_remove_async_cleanup_hook`][] ဆီကို ခေါ်ယူမှုတစ်ခုအတွင်းမှာ ဖြတ်သန်းပေးရပါမယ်။

## Error handling (error ကိုင်တွယ်ခြင်း)

Node-API က error handling အတွက် return values တွေရော JavaScript exceptions တွေပါ နှစ်မျိုးလုံးကို သုံးပါတယ်။ အောက်က sections တွေက ကိစ္စတစ်ခုချင်းစီအတွက် နည်းလမ်းကို ရှင်းပြပါတယ်။

### Return values (return တန်ဖိုးများ)

Node-API functions တွေ အားလုံးက တူညီတဲ့ error handling pattern (ပုံစံ) တစ်ခုကို မျှဝေသုံးပါတယ်။ API functions တွေ အားလုံးရဲ့ return type က `napi_status` ပါ။

Request က အောင်မြင်ပြီး — catch မလုပ်ရသေးတဲ့ (uncaught) JavaScript exception တစ်ခုမှ မရှိခဲ့ရင် — return value က `napi_ok` ဖြစ်ပါလိမ့်မယ်။ Error တစ်ခု ဖြစ်ပွားခဲ့ပြီး exception တစ်ခုလည်း ထုတ်လွှတ်ခဲ့တယ်ဆိုရင် — အဲဒီ error အတွက် `napi_status` တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။ Exception တစ်ခု ထုတ်လွှတ်ခဲ့ပြီး error မဖြစ်ပွားခဲ့ဘူးဆိုရင် — `napi_pending_exception` ကို ပြန်ပေးပါလိမ့်မယ်။

`napi_ok` သို့မဟုတ် `napi_pending_exception` မဟုတ်တဲ့ return value တစ်ခု ပြန်လာတဲ့ အခြေအနေတွေမှာ — exception တစ်ခု pending ဖြစ်နေလားဆိုတာ စစ်ဆေးဖို့ [`napi_is_exception_pending`][] ကို ခေါ်ယူရပါမယ်။ နောက်ထပ် အသေးစိတ်တွေအတွက် exceptions အကြောင်း section ကို ကြည့်ပါ။

ဖြစ်နိုင်တဲ့ `napi_status` values တွေ အားလုံးရဲ့ အစုအဝေး အပြည့်အစုံကို `napi_api_types.h` ထဲမှာ သတ်မှတ်ထားပါတယ်။

`napi_status` return value က ဖြစ်ပွားခဲ့တဲ့ error ရဲ့ VM-independent (VM နဲ့ မသက်ဆိုင်တဲ့) ကိုယ်စားပြုမှုတစ်ခုကို ပေးပါတယ်။ အချို့သော အခြေအနေတွေမှာ — error ကို ကိုယ်စားပြုတဲ့ string တစ်ခုအပြင် VM (engine)-specific အချက်အလက်တွေပါ အပါအဝင် — ပိုမို အသေးစိတ်တဲ့ အချက်အလက်တွေ ရယူနိုင်ဖို့ အသုံးဝင်ပါတယ်။

ဒီအချက်အလက်တွေကို ရယူနိုင်ဖို့ — `napi_extended_error_info` structure တစ်ခုကို ပြန်ပေးတဲ့ — [`napi_get_last_error_info`][] ကို ပေးအပ်ထားပါတယ်။ `napi_extended_error_info` structure ရဲ့ format က အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```c
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```

* `error_message`: ဖြစ်ပွားခဲ့တဲ့ error ရဲ့ စာသားပုံစံ (textual) ကိုယ်စားပြုမှုပါ။
* `engine_reserved`: Engine သုံးရန်အတွက်သာ သီးသန့် သိမ်းဆည်းထားတဲ့ opaque handle ပါ။
* `engine_error_code`: VM-specific error code ပါ။
* `error_code`: နောက်ဆုံး error အတွက် Node-API status code ပါ။

[`napi_get_last_error_info`][] က ပြုလုပ်ခဲ့တဲ့ နောက်ဆုံး Node-API call အတွက် အချက်အလက်တွေကို ပြန်ပေးပါတယ်။

Extended information တွေရဲ့ content သို့မဟုတ် format ကို အားမကိုးပါနဲ့ — ၎င်းတို့က SemVer ရဲ့ လက်အောက်ခံ မဟုတ်ပဲ — ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ်။ ၎င်းတို့ကို logging (မှတ်တမ်း) ရည်ရွယ်ချက်အတွက်သာ ရည်ရွယ်ထားပါတယ်။

#### `napi_get_last_error_info`

```c
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[out] result`: Error အကြောင်း ပိုမို အချက်အလက်တွေ ပါဝင်တဲ့ `napi_extended_error_info` structure ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြစ်ပွားခဲ့တဲ့ နောက်ဆုံး error အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ `napi_extended_error_info` structure တစ်ခုကို ပြန်လည် ရယူပါတယ်။

ပြန်ပေးလိုက်တဲ့ `napi_extended_error_info` ရဲ့ content က — တူညီတဲ့ `env` ပေါ်မှာ Node-API function တစ်ခု ခေါ်ယူတဲ့အထိသာ တရားဝင် (valid) ပါ။ ဒီထဲမှာ `napi_is_exception_pending` ဆီကို ခေါ်ယူတာတောင် ပါဝင်တာမို့ — နောက်ပိုင်းမှာ သုံးနိုင်ဖို့အတွက် အချက်အလက်တွေရဲ့ copy တစ်ခုကို ပြုလုပ်ထားဖို့ မကြာခဏ လိုအပ်နိုင်ပါတယ်။ `error_message` ထဲမှာ ပြန်ပေးထားတဲ့ pointer က statically-defined string တစ်ခုကို ညွှန်ပြတာမို့ — Node-API function တစ်ခု နောက်ထပ် မခေါ်ယူခင် — `error_message` field (အဲဒါကို overwrite လုပ်ခံရမှာ) ကနေ ကူးယူပြီးသားဆိုရင် — အဲဒီ pointer ကို သုံးဖို့ လုံခြုံပါတယ်။

Extended information တွေရဲ့ content သို့မဟုတ် format ကို အားမကိုးပါနဲ့ — ၎င်းတို့က SemVer ရဲ့ လက်အောက်ခံ မဟုတ်ပဲ — ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ်။ ၎င်းတို့ကို logging (မှတ်တမ်း) ရည်ရွယ်ချက်အတွက်သာ ရည်ရွယ်ထားပါတယ်။

ဒီ API ကို — pending JavaScript exception တစ်ခု ရှိနေရင်တောင် — ခေါ်ယူနိုင်ပါတယ်။

### Exceptions (ခြွင်းချက်များ)

Node-API function call တစ်ခုခုက မဆို — pending JavaScript exception တစ်ခုကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။ JavaScript ရဲ့ execution ကို မဖြစ်ပေါ်စေနိုင်တဲ့ functions တွေတောင် အပါအဝင် — API functions တွေ အားလုံးအတွက် ဒါက သက်ရောက်နေပါတယ်။

Function တစ်ခုက ပြန်ပေးတဲ့ `napi_status` က `napi_ok` ဖြစ်ရင် — exception မျှ pending မဖြစ်ပဲ — နောက်ထပ် လုပ်ဆောင်စရာ မလိုပါဘူး။ ပြန်ပေးတဲ့ `napi_status` က `napi_ok` သို့မဟုတ် `napi_pending_exception` ကလွဲလို့ တစ်ခုခု ဖြစ်နေရင် — ချက်ချင်း ပြန်ထွက်သွားမယ့်အစား — ပြန်လည် ကောင်းမွန်အောင် (recover) လုပ်ပြီး ဆက်လုပ်ဖို့ ကြိုးစားရာမှာ — exception တစ်ခု pending ဖြစ်နေလား မဖြစ်နေလားဆိုတာ ဆုံးဖြတ်ဖို့ — [`napi_is_exception_pending`][] ကို ခေါ်ယူရပါမယ်။

Node-API function တစ်ခုကို ခေါ်ယူတဲ့အခါ exception တစ်ခု ရှိပြီးသား pending ဖြစ်နေတဲ့ အခြေအနေ အများအပြားမှာ — function က `napi_pending_exception` ဆိုတဲ့ `napi_status` တစ်ခုနဲ့အတူ ချက်ချင်း ပြန်ထွက်သွားပါလိမ့်မယ်။ ဒါပေမယ့် functions တွေ အားလုံးအတွက်တော့ ဒီအတိုင်း မဟုတ်ပါဘူး။ Node-API က functions တွေရဲ့ အစုခွဲတစ်ခုကို — JavaScript ဆီကို ပြန်မသွားခင် အနည်းငယ်မျှသော (minimal) cleanup လုပ်ခွင့် ပြုဖို့ — ခေါ်ယူခွင့် ပေးပါတယ်။ အဲဒီကိစ္စမှာ `napi_status` က အဲဒီ function ရဲ့ status ကိုသာ ထင်ဟပ်ဖော်ပြပါလိမ့်မယ်။ ယခင် pending exceptions တွေကို ထင်ဟပ်ဖော်ပြမှာ မဟုတ်ပါဘူး။ ရှုပ်ထွေးမှု မဖြစ်စေဖို့ — function call တိုင်းပြီးနောက်မှာ error status ကို စစ်ဆေးပါ။

Exception တစ်ခု pending ဖြစ်နေတဲ့အခါ — နည်းလမ်း နှစ်ခုထဲက တစ်ခုကို အသုံးပြုနိုင်ပါတယ်။

ပထမ နည်းလမ်းက — သင့်လျော်တဲ့ cleanup တွေ လုပ်ဆောင်ပြီး — execution က JavaScript ဆီကို ပြန်ရောက်သွားအောင် — ပြန်ထွက်လိုက်တာပါ။ JavaScript ဆီကို ပြန်ကူးပြောင်းခြင်းရဲ့ အစိတ်အပိုင်းအနေနဲ့ — native method ကို ခေါ်ယူခဲ့တဲ့ JavaScript code ထဲက အမှတ်နေရာမှာ exception ကို throw လုပ်ပါလိမ့်မယ်။ Exception တစ်ခု pending ဖြစ်နေတုန်း — Node-API calls အများစုရဲ့ အပြုအမူက သတ်မှတ်မထားပဲ — အများစုက `napi_pending_exception` ကို ရိုးရိုးပဲ ပြန်ပေးမှာ ဖြစ်တာမို့ — အနည်းငယ်မျှသာ လုပ်ဆောင်ပြီး — exception ကို ကိုင်တွယ်နိုင်တဲ့ JavaScript ဆီကို ပြန်ထွက်သွားပါ။

ဒုတိယ နည်းလမ်းက exception ကို ကိုင်တွယ်ဖို့ ကြိုးစားတာပါ။ Native code က exception ကို catch လုပ်ပြီး — သင့်လျော်တဲ့ လုပ်ဆောင်ချက် လုပ်ကာ — ဆက်လက် လုပ်ဆောင်နိုင်တဲ့ အခြေအနေတွေ ရှိပါလိမ့်မယ်။ Exception ကို လုံခြုံစွာ ကိုင်တွယ်နိုင်တယ်လို့ သိထားတဲ့ — တိကျတဲ့ အခြေအနေတွေမှာသာ ဒါကို အကြံပြုပါတယ်။ ဒီလို အခြေအနေတွေမှာ — exception ကို ရယူပြီး ရှင်းလင်းဖို့ — [`napi_get_and_clear_last_exception`][] ကို သုံးနိုင်ပါတယ်။ အောင်မြင်ရင် — result ထဲမှာ နောက်ဆုံး throw လုပ်ခဲ့တဲ့ JavaScript `Object` ဆီကို ညွှန်ပြတဲ့ handle ပါဝင်ပါလိမ့်မယ်။ Exception ကို ရယူပြီးနောက်မှာ — exception ကို ဘယ်လိုမှ ကိုင်တွယ်လို့ မရဘူးလို့ ဆုံးဖြတ်လိုက်ရရင် — ၎င်းကို [`napi_throw`][] နဲ့ ပြန်လည် throw (re-throw) လုပ်နိုင်ပါတယ် — အဲဒီမှာ error က throw လုပ်ရမယ့် JavaScript value ပါ။

Native code က exception တစ်ခု throw လုပ်ဖို့ သို့မဟုတ် `napi_value` တစ်ခုက JavaScript `Error` object တစ်ခုရဲ့ instance ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ လိုအပ်ခဲ့ရင် — အောက်ပါ utility functions တွေလည်း ရရှိနိုင်ပါတယ်: [`napi_throw_error`][], [`napi_throw_type_error`][], [`napi_throw_range_error`][], [`node_api_throw_syntax_error`][] နဲ့ [`napi_is_error`][]။

Native code က `Error` object တစ်ခု ဖန်တီးဖို့ လိုအပ်ခဲ့ရင်လည်း အောက်ပါ utility functions တွေ ရရှိနိုင်ပါတယ်: [`napi_create_error`][], [`napi_create_type_error`][], [`napi_create_range_error`][] နဲ့ [`node_api_create_syntax_error`][] — အဲဒီမှာ result က အသစ် ဖန်တီးလိုက်တဲ့ JavaScript `Error` object ကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။

Node.js project က အတွင်းပိုင်းကနေ ထုတ်လုပ်တဲ့ errors တွေ အားလုံးဆီကို error codes တွေ ထည့်သွင်းနေပါတယ်။ ရည်ရွယ်ချက်က — applications တွေက error စစ်ဆေးမှု အားလုံးအတွက် ဒီ error codes တွေကို သုံးစေဖို့ပါ။ ဆက်စပ်နေတဲ့ error messages တွေကတော့ ဆက်လက် ရှိနေမှာ ဖြစ်ပေမယ့် — message က SemVer အကျုံးမဝင်ပဲ ပြောင်းလဲနိုင်တယ်ဆိုတဲ့ မျှော်လင့်ချက်နဲ့ — logging နဲ့ display အတွက်သာ ရည်ရွယ် သုံးစွဲမှာ ဖြစ်ပါတယ်။ ဒီ model ကို Node-API နဲ့ support လုပ်ဖို့ — အတွင်းပိုင်း လုပ်ဆောင်ချက်တွေမှာရော module-specific လုပ်ဆောင်ချက်တွေမှာပါ (good practice အရ) — `throw_` နဲ့ `create_` functions တွေက — error object ဆီကို ထည့်သွင်းရမယ့် code ရဲ့ string ဖြစ်တဲ့ — optional code parameter တစ်ခုကို လက်ခံပါတယ်။ Optional parameter က `NULL` ဆိုရင် — error နဲ့ code ဘယ်တစ်ခုမှ ဆက်စပ်မှာ မဟုတ်ပါဘူး။ Code တစ်ခု ပေးအပ်ထားရင် — error နဲ့ ဆက်စပ်နေတဲ့ name ကိုလည်း အောက်ပါအတိုင်း ပြုပြင်မွမ်းမံပါတယ်:

```text
originalName [code]
```

ဒီမှာ `originalName` က error နဲ့ ဆက်စပ်နေတဲ့ မူရင်း name ဖြစ်ပြီး — `code` ကတော့ ပေးအပ်ထားတဲ့ code ပါ။ ဥပမာ — code က `'ERR_ERROR_1'` ဖြစ်ပြီး `TypeError` တစ်ခုကို ဖန်တီးနေတယ်ဆိုရင် — name က အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```text
TypeError [ERR_ERROR_1]
```

#### `napi_throw`

```c
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] error`: Throw လုပ်ရမယ့် JavaScript value ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ JavaScript value ကို throw လုပ်ပါတယ်။

#### `napi_throw_error`

```c
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error ပေါ်မှာ သတ်မှတ်ရမယ့် Optional error code ပါ။
* `[in] msg`: Error နဲ့ ဆက်စပ်ရမယ့် စာသားကို ကိုယ်စားပြုတဲ့ C string ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `Error` တစ်ခုကို throw လုပ်ပါတယ်။

#### `napi_throw_type_error`

```c
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error ပေါ်မှာ သတ်မှတ်ရမယ့် Optional error code ပါ။
* `[in] msg`: Error နဲ့ ဆက်စပ်ရမယ့် စာသားကို ကိုယ်စားပြုတဲ့ C string ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `TypeError` တစ်ခုကို throw လုပ်ပါတယ်။

#### `napi_throw_range_error`

```c
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error ပေါ်မှာ သတ်မှတ်ရမယ့် Optional error code ပါ။
* `[in] msg`: Error နဲ့ ဆက်စပ်ရမယ့် စာသားကို ကိုယ်စားပြုတဲ့ C string ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `RangeError` တစ်ခုကို throw လုပ်ပါတယ်။

#### `node_api_throw_syntax_error`

```c
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error ပေါ်မှာ သတ်မှတ်ရမယ့် Optional error code ပါ။
* `[in] msg`: Error နဲ့ ဆက်စပ်ရမယ့် စာသားကို ကိုယ်စားပြုတဲ့ C string ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `SyntaxError` တစ်ခုကို throw လုပ်ပါတယ်။

#### `napi_is_error`

```c
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် `napi_value` ပါ။
* `[out] result`: `napi_value` က error တစ်ခုကို ကိုယ်စားပြုရင် `true` အဖြစ် သတ်မှတ်ပေးမယ့် boolean value ပါ — မဟုတ်ရင် `false` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `napi_value` တစ်ခုကို — ၎င်းက error object တစ်ခုကို ကိုယ်စားပြုလားဆိုတာ — စစ်ဆေးပါတယ်။

#### `napi_create_error`

```c
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error နဲ့ ဆက်စပ်ရမယ့် error code ရဲ့ string ပါဝင်တဲ့ Optional `napi_value` ပါ။
* `[in] msg`: `Error` အတွက် message အဖြစ် သုံးရမယ့် JavaScript `string` တစ်ခုကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။
* `[out] result`: ဖန်တီးလိုက်တဲ့ error ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `Error` တစ်ခုကို ပြန်ပေးပါတယ်။

#### `napi_create_type_error`

```c
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error နဲ့ ဆက်စပ်ရမယ့် error code ရဲ့ string ပါဝင်တဲ့ Optional `napi_value` ပါ။
* `[in] msg`: `Error` အတွက် message အဖြစ် သုံးရမယ့် JavaScript `string` တစ်ခုကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။
* `[out] result`: ဖန်တီးလိုက်တဲ့ error ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `TypeError` တစ်ခုကို ပြန်ပေးပါတယ်။

#### `napi_create_range_error`

```c
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```

* `[in] env`: ဒီ API ကို ခေါ်ယူနေတဲ့ environment ပါ။
* `[in] code`: Error နဲ့ ဆက်စပ်ရမယ့် error code ရဲ့ string ပါဝင်တဲ့ Optional `napi_value` ပါ။
* `[in] msg`: `Error` အတွက် message အဖြစ် သုံးရမယ့် JavaScript `string` တစ်ခုကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။
* `[out] result`: ဖန်တီးလိုက်တဲ့ error ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ပေးအပ်ထားတဲ့ စာသားပါတဲ့ JavaScript `RangeError` တစ်ခုကို ပြန်ပေးပါတယ်။
#### `node_api_create_syntax_error`

```c
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] code`: Optional — error နဲ့ ဆက်စပ်သွားမယ့် error code ရဲ့ string ပါဝင်တဲ့ `napi_value` ပါ။
* `[in] msg`: `Error` အတွက် message အဖြစ် သုံးမယ့် JavaScript `string` တစ်ခုကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။
* `[out] result`: ဖန်တီးလိုက်တဲ့ error ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ စာသားပါ JavaScript `SyntaxError` တစ်ခုကို ပြန်ပေးပါတယ်။

#### `napi_get_and_clear_last_exception`

```c
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Exception တစ်ခု pending ဖြစ်နေရင် အဲဒီ exception ပါ — မဟုတ်ရင်တော့ `NULL` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

#### `napi_is_exception_pending`

```c
napi_status napi_is_exception_pending(napi_env env, bool* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Exception တစ်ခု pending ဖြစ်နေရင် `true` အဖြစ် သတ်မှတ်ပေးမယ့် boolean တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

#### `napi_fatal_exception`

```c
napi_status napi_fatal_exception(napi_env env, napi_value err);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] err`: `'uncaughtException'` ဆီကို ဖြတ်သန်းပေးတဲ့ error ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

JavaScript ထဲမှာ `'uncaughtException'` တစ်ခုကို trigger လုပ်ပါတယ်။ Async callback တစ်ခုက — ပြန်လည် ကောင်းမွန်အောင် လုပ်ဖို့ နည်းလမ်း မရှိတဲ့ — exception တစ်ခုကို throw လုပ်တဲ့အခါမျိုးမှာ အသုံးဝင်ပါတယ်။

### Fatal errors (ပြင်းထန်သော error များ)

Native addon တစ်ခုထဲမှာ ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်တဲ့ (unrecoverable) error တစ်ခု ဖြစ်ပွားတဲ့အခါ — process ကို ချက်ချင်း terminate လုပ်ဖို့ fatal error တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

#### `napi_fatal_error`

```c
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] location`: Optional — error ဖြစ်ပွားခဲ့တဲ့ နေရာ (location) ပါ။
* `[in] location_len`: Location ရဲ့ အရှည်ကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[in] message`: Error နဲ့ ဆက်စပ်နေတဲ့ message ပါ။
* `[in] message_len`: Message ရဲ့ အရှည်ကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။

ဒီ function call က ပြန်မလာပဲ — process ကို terminate လုပ်ပစ်ပါလိမ့်မယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

## Object lifetime management (object များ၏ သက်တမ်း စီမံခန့်ခွဲမှု)

Node-API calls တွေ ပြုလုပ်တဲ့အခါ — underlying VM ရဲ့ heap ထဲက objects တွေဆီကို ညွှန်ပြတဲ့ handles တွေကို `napi_values` အနေနဲ့ ပြန်ပေးနိုင်ပါတယ်။ ဒီ handles တွေက — native code က အဲဒီ objects တွေကို နောက်ထပ် မလိုအပ်တော့တဲ့အထိ — objects တွေကို 'live' (သက်ဝင်လှုပ်ရှား) အဖြစ် ထိန်းထားရပါတယ်။ မဟုတ်ရင် — native code က အသုံးပြုပြီးမသွားခင် objects တွေ စုဆောင်းခံ (collected) လိုက်ရနိုင်လို့ပါ။

Object handles တွေ ပြန်ပေးခံရတဲ့အခါ — ၎င်းတို့ကို 'scope' (နယ်ပယ်) တစ်ခုနဲ့ ဆက်စပ်ပေးပါတယ်။ Default scope ရဲ့ သက်တမ်းက native method call ရဲ့ သက်တမ်းနဲ့ ဆက်စပ်နေပါတယ်။ ရလဒ်ကတော့ — default အနေနဲ့ handles တွေက တရားဝင် (valid) ဖြစ်နေပြီး — အဲဒီ handles တွေနဲ့ ဆက်စပ်နေတဲ့ objects တွေကိုလည်း native method call ရဲ့ သက်တမ်းတစ်လျှောက် live အဖြစ် ထိန်းသိမ်းထားပေးပါတယ်။

သို့သော်လည်း — အခြေအနေ အများအပြားမှာ handles တွေကို native method ရဲ့ သက်တမ်းထက် ပိုတို သို့မဟုတ် ပိုရှည်တဲ့ သက်တမ်းအတွက် valid အဖြစ် ထိန်းထားဖို့ လိုအပ်ပါတယ်။ အောက်မှာ ဖော်ပြမယ့် sections တွေက — handle ရဲ့ သက်တမ်းကို default ကနေ ပြောင်းလဲဖို့ သုံးနိုင်တဲ့ Node-API functions တွေကို ရှင်းပြပါတယ်။

### Making handle lifespan shorter than that of the native method (handle သက်တမ်းကို native method ၏ သက်တမ်းထက် ပိုတိုစေခြင်း)

Handle တွေရဲ့ သက်တမ်းကို native method တစ်ခုရဲ့ သက်တမ်းထက် ပိုတိုအောင် ပြုလုပ်ဖို့ မကြာခဏ လိုအပ်ပါတယ်။ ဥပမာ — array ကြီးတစ်ခုရဲ့ elements တွေကို ဖြတ်လည်တဲ့ loop တစ်ခု ပါဝင်တဲ့ native method တစ်ခုကို စဉ်းစားကြည့်ပါ:

```c
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
```

ဒါက handles အများအပြား ဖန်တီးခံရပြီး — resources (အရင်းအမြစ်များ) အများအပြားကို စားသုံးစေပါလိမ့်မယ်။ ထို့အပြင် — native code က နောက်ဆုံး handle တစ်ခုကိုသာ သုံးနိုင်ပေမယ့် — ဆက်စပ်နေတဲ့ objects တွေ အားလုံးက scope တစ်ခုတည်းကို မျှဝေသုံးစွဲနေတာမို့ — live အဖြစ် ဆက်လက် ထိန်းသိမ်းခံထားရပါလိမ့်မယ်။

ဒီကိစ္စကို ကိုင်တွယ်ဖို့ — Node-API က အသစ်ဖန်တီးလိုက်တဲ့ handles တွေကို ဆက်စပ်ပေးမယ့် 'scope' အသစ်တစ်ခုကို တည်ထောင်နိုင်စွမ်း ပေးပါတယ်။ အဲဒီ handles တွေ မလိုအပ်တော့တာနဲ့ — scope ကို 'close' (ပိတ်) လုပ်နိုင်ပြီး — အဲဒီ scope နဲ့ ဆက်စပ်နေတဲ့ handles တွေ အားလုံးကို invalid ဖြစ်စေပါတယ်။ Scopes တွေကို ဖွင့်/ပိတ်ဖို့ ရရှိနိုင်တဲ့ methods တွေကတော့ [`napi_open_handle_scope`][] နဲ့ [`napi_close_handle_scope`][] တို့ပါ။

Node-API က scopes တွေရဲ့ nested (အသိုက်အမြုံ) hierarchy တစ်ခုတည်းကိုသာ support လုပ်ပါတယ်။ ဘယ်အချိန်မှာမဆို active scope တစ်ခုတည်းသာ ရှိနိုင်ပြီး — အဲဒီ scope active ဖြစ်နေတုန်း handles အသစ်တွေ အားလုံးက အဲဒီ scope နဲ့ ဆက်စပ်သွားပါတယ်။ Scopes တွေကို ဖွင့်ခဲ့တဲ့ အစီအစဉ်ရဲ့ ပြောင်းပြန် အစီအစဉ်နဲ့ ပိတ်ရပါတယ်။ ထို့အပြင် — native method တစ်ခုအတွင်းမှာ ဖန်တီးခဲ့တဲ့ scopes တွေ အားလုံးကို အဲဒီ method ကနေ ပြန်မလာခင် ပိတ်ထားရပါတယ်။

အထက်က ဥပမာကို ပြန်ကြည့်ရင် — [`napi_open_handle_scope`][] နဲ့ [`napi_close_handle_scope`][] ခေါ်တွေကို ထည့်လိုက်တာက — loop ရဲ့ လုပ်ဆောင်မှု တစ်လျှောက်လုံးမှာ handle တစ်ခုတည်းသာ အများဆုံး valid ဖြစ်နေအောင် သေချာစေပါလိမ့်မယ်:

```c
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```

Scopes တွေကို nesting (အသိုက်အမြုံ ဖွဲ့) လုပ်တဲ့အခါ — အတွင်းပိုင်း scope တစ်ခုရဲ့ handle တစ်ခုက အဲဒီ scope ရဲ့ သက်တမ်းထက် ကျော်လွန် ရှင်သန်နေဖို့ လိုအပ်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ ဒီလိုအခြေအနေကို ဖြည့်ဆည်းဖို့ Node-API က 'escapable scope' (လွတ်မြောက်နိုင်သော scope) တစ်ခုကို support လုပ်ပါတယ်။ Escapable scope က handle တစ်ခုကို 'promote' (အဆင့်မြှင့်) လုပ်ခွင့်ပြုပြီး — ၎င်းက လက်ရှိ scope ကနေ 'escape' (လွတ်မြောက်) သွားကာ — handle ရဲ့ သက်တမ်းက လက်ရှိ scope ကနေ အပြင်ဘက် scope (outer scope) ရဲ့ သက်တမ်းဆီကို ပြောင်းလဲသွားပါတယ်။

Escapable scopes တွေကို ဖွင့်/ပိတ်ဖို့ ရရှိနိုင်တဲ့ methods တွေကတော့ [`napi_open_escapable_handle_scope`][] နဲ့ [`napi_close_escapable_handle_scope`][] တို့ပါ။

Handle တစ်ခုကို promote လုပ်ဖို့ တောင်းဆိုမှုကို [`napi_escape_handle`][] ကနေတစ်ဆင့် ပြုလုပ်ပြီး — ၎င်းကို တစ်ကြိမ်သာ ခေါ်နိုင်ပါတယ်။

#### `napi_open_handle_scope`

```c
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Scope အသစ်ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က scope အသစ်တစ်ခုကို ဖွင့်ပေးပါတယ်။

#### `napi_close_handle_scope`

```c
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] scope`: ပိတ်ရမယ့် scope ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ scope ကို ပိတ်ပါတယ်။ Scopes တွေကို ဖန်တီးခဲ့တဲ့ အစီအစဉ်ရဲ့ ပြောင်းပြန် အစီအစဉ်နဲ့ ပိတ်ရပါတယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

#### `napi_open_escapable_handle_scope`

```c
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Scope အသစ်ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က — object တစ်ခုကို outer scope ဆီကို promote လုပ်နိုင်တဲ့ — scope အသစ်တစ်ခုကို ဖွင့်ပေးပါတယ်။

#### `napi_close_escapable_handle_scope`

```c
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] scope`: ပိတ်ရမယ့် scope ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ scope ကို ပိတ်ပါတယ်။ Scopes တွေကို ဖန်တီးခဲ့တဲ့ အစီအစဉ်ရဲ့ ပြောင်းပြန် အစီအစဉ်နဲ့ ပိတ်ရပါတယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

#### `napi_escape_handle`

```c
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] scope`: လက်ရှိ scope ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] escapee`: Escape လုပ်ရမယ့် JavaScript `Object` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: Outer scope ထဲမှာ escape လုပ်ပြီးသား `Object` ဆီကို ညွှန်ပြတဲ့ handle ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က JavaScript object ဆီကို ညွှန်ပြတဲ့ handle ကို promote လုပ်ပြီး — outer scope ရဲ့ သက်တမ်းတစ်လျှောက် valid ဖြစ်စေပါတယ်။ ၎င်းကို scope တစ်ခုစီအတွက် တစ်ကြိမ်သာ ခေါ်နိုင်ပြီး — တစ်ကြိမ်ထက်ပိုပြီး ခေါ်ခဲ့ရင် error တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

### References to values with a lifespan longer than that of the native method (native method ၏ သက်တမ်းထက် ပိုရှည်သော values များအတွက် references များ)

အချို့သော အခြေအနေတွေမှာ — addon တစ်ခုက native method invocation တစ်ခုတည်းရဲ့ သက်တမ်းထက် ပိုရှည်တဲ့ သက်တမ်းရှိတဲ့ values တွေကို ဖန်တီးပြီး ရည်ညွှန်းနိုင်ဖို့ လိုအပ်ပါလိမ့်မယ်။ ဥပမာ — constructor တစ်ခုကို ဖန်တီးပြီး နောက်ပိုင်းမှာ instances တွေ ဖန်တီးဖို့ တောင်းဆိုမှုတွေထဲမှာ အဲဒီ constructor ကို သုံးဖို့ဆိုရင် — instance creation တောင်းဆိုမှု အများအပြားကို ဖြတ်ပြီး constructor object ကို ရည်ညွှန်းနိုင်ဖို့ လိုအပ်ပါတယ်။ အထက်က section မှာ ဖော်ပြခဲ့သလို — `napi_value` အနေနဲ့ ပြန်ပေးတဲ့ သာမန် handle တစ်ခုနဲ့တော့ ဒါကို မလုပ်နိုင်ပါဘူး။ သာမန် handle တစ်ခုရဲ့ သက်တမ်းကို scopes တွေက စီမံပြီး — scopes တွေ အားလုံးကို native method တစ်ခုရဲ့ အဆုံးမှာ ပိတ်ထားရပါတယ်။

Node-API က values တွေဆီကို persistent references (အမြဲတည်မြဲသော ရည်ညွှန်းချက်များ) ဖန်တီးဖို့ methods တွေကို ပံ့ပိုးပေးပါတယ်။ လက်ရှိမှာ Node-API က object, external, function နဲ့ symbol အပါအဝင် — value types အကန့်အသတ်တစ်ခုအတွက်သာ references ဖန်တီးခွင့် ပြုပါတယ်။

Reference တစ်ခုချင်းစီမှာ 0 သို့မဟုတ် 0 ထက် ကြီးတဲ့ တန်ဖိုးရှိတဲ့ ဆက်စပ် count တစ်ခု ရှိပြီး — အဲဒီ count က reference က သက်ဆိုင်တဲ့ value ကို live အဖြစ် ဆက်ထိန်းထားမလားဆိုတာကို ဆုံးဖြတ်ပါတယ်။ Count 0 ရှိတဲ့ references တွေက values တွေကို collect ခံရတာကနေ မကာကွယ်ပါဘူး။ Object (object, function, external) နဲ့ symbol types တွေရဲ့ values တွေက 'weak' references (အားနည်း ရည်ညွှန်းချက်များ) တွေ ဖြစ်လာပြီး — collect မခံရသေးသရွေ့ ဝင်ရောက် အသုံးပြုနိုင်ပါသေးတယ်။ 0 ထက် ကြီးတဲ့ count တစ်ခုခုက values တွေကို collect ခံရတာကနေ ကာကွယ်ပါလိမ့်မယ်။

Symbol values တွေမှာ ပုံစံကွဲ (flavors) အမျိုးမျိုး ရှိပါတယ်။ တကယ့် weak reference အပြုအမူကို — `napi_create_symbol` function သို့မဟုတ် JavaScript `Symbol()` constructor calls တွေနဲ့ ဖန်တီးထားတဲ့ local symbols တွေကသာ support လုပ်ပါတယ်။ `node_api_symbol_for` function သို့မဟုတ် JavaScript `Symbol.for()` function calls တွေနဲ့ ဖန်တီးထားတဲ့ globally registered symbols တွေကတော့ — garbage collector က ၎င်းတို့ကို collect မလုပ်တာမို့ — အမြဲတမ်း strong references တွေအဖြစ် ဆက်ရှိနေပါတယ်။ `Symbol.iterator` လိုမျိုး well-known symbols တွေအတွက်လည်း အလားတူပါပဲ — ၎င်းတို့ကိုလည်း garbage collector က ဘယ်တော့မှ collect မလုပ်ပါဘူး။

References တွေကို ကနဦး reference count (ရည်ညွှန်းမှု အရေအတွက်) တစ်ခုနဲ့ ဖန်တီးနိုင်ပြီး — count ကို [`napi_reference_ref`][] နဲ့ [`napi_reference_unref`][] တို့ကနေတစ်ဆင့် နောက်ပိုင်းမှာ ပြုပြင် ပြောင်းလဲနိုင်ပါတယ်။ Reference တစ်ခုရဲ့ count က 0 ဖြစ်နေချိန်မှာ object တစ်ခု collect ခံလိုက်ရရင် — reference နဲ့ ဆက်စပ်နေတဲ့ object ကို ရယူဖို့ နောက်ပိုင်း [`napi_get_reference_value`][] ခေါ်တွေ အားလုံးက — ပြန်ပေးတဲ့ `napi_value` အတွက် `NULL` ကို ပြန်ပေးပါလိမ့်မယ်။ Object collect ခံထားရတဲ့ reference တစ်ခုအတွက် [`napi_reference_ref`][] ကို ခေါ်ဖို့ ကြိုးစားရင် error တစ်ခု ထွက်ပေါ်ပါတယ်။

References တွေကို addon က မလိုအပ်တော့တာနဲ့ ဖျက်ပစ် (delete) ရပါမယ်။ Reference တစ်ခုကို ဖျက်လိုက်တဲ့အခါ — ၎င်းက သက်ဆိုင်တဲ့ object ကို collect ခံရတာကနေ ကာကွယ်ပေးတာ မရှိတော့ပါဘူး။ Persistent reference တစ်ခုကို မဖျက်ပဲ ထားလိုက်ရင် — persistent reference အတွက် native memory ရော — heap ပေါ်က သက်ဆိုင်တဲ့ object ပါ ထာဝရ ထိန်းသိမ်းခံထားရတဲ့ 'memory leak' (မှတ်ဉာဏ် ယိုစိမ့်မှု) တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။

Object တစ်ခုတည်းကို ရည်ညွှန်းတဲ့ persistent references အများအပြား ဖန်တီးထားနိုင်ပြီး — တစ်ခုချင်းစီက ၎င်းရဲ့ ကိုယ်ပိုင် count ပေါ် မူတည်ပြီး — object ကို live အဖြစ် ထားမလား မထားဘူးလား ဆိုတာ ဆုံးဖြတ်ပါတယ်။ Object တစ်ခုတည်းဆီကို persistent references အများအပြား ရှိနေတာက native memory ကို မမျှော်လင့်ဘဲ live အဖြစ် ဆက်ထိန်းသိမ်းထားစေနိုင်ပါတယ်။ Persistent reference တစ်ခုအတွက် native structures တွေကို — ရည်ညွှန်းခံထားရတဲ့ object ရဲ့ finalizers တွေ လုပ်ဆောင်ပြီးသည်အထိ — live အဖြစ် ထိန်းသိမ်းထားရပါတယ်။ Object တစ်ခုတည်းအတွက် persistent reference အသစ်တစ်ခု ဖန်တီးလိုက်ရင် — အဲဒီ object ရဲ့ finalizers တွေက run မဖြစ်တော့ပဲ — အရင်က persistent reference က ညွှန်ပြထားတဲ့ native memory လည်း လွှတ်ပေးခံရမှာ မဟုတ်ပါဘူး။ ဖြစ်နိုင်ရင် `napi_reference_unref` အပြင် `napi_delete_reference` ကိုပါ ခေါ်ပေးခြင်းအားဖြင့် ဒါကို ရှောင်ရှားနိုင်ပါတယ်။

**Change History:**

* Version 10 (`NAPI_VERSION` က `10` သို့မဟုတ် ပိုမြင့်တဲ့ တန်ဖိုးအဖြစ် သတ်မှတ်ထားချိန်):

  References တွေကို value types အားလုံးအတွက် ဖန်တီးနိုင်ပါတယ်။ အသစ် ထပ်ဆောင်း support လုပ်လိုက်တဲ့ value types တွေက weak reference semantic ကို support မလုပ်ပဲ — အဲဒီ types တွေရဲ့ values တွေကို reference count 0 ဖြစ်သွားတဲ့အခါ လွှတ်ပေးလိုက်ပြီး — reference ကနေတစ်ဆင့် နောက်ထပ် ဝင်ရောက် အသုံးပြုလို့ မရတော့ပါဘူး။

#### `napi_create_reference`

```c
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Reference ဖန်တီးနေတဲ့ `napi_value` ပါ။
* `[in] initial_refcount`: Reference အသစ်အတွက် ကနဦး reference count ပါ။
* `[out] result`: Reference အသစ်ကို ညွှန်ပြတဲ့ `napi_ref` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ value ဆီကို — သတ်မှတ်ထားတဲ့ reference count နဲ့ — reference အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `napi_delete_reference`

```c
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] ref`: ဖျက်ပစ်ရမယ့် `napi_ref` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ reference ကို ဖျက်ပစ်ပါတယ်။

ဤ API ကို pending ဖြစ်နေတဲ့ JavaScript exception တစ်ခု ရှိနေချိန်မှာတောင် ခေါ်ယူနိုင်ပါတယ်။

#### `napi_reference_ref`

```c
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] ref`: Reference count တိုးပေးမယ့် `napi_ref` ပါ။
* `[out] result`: Reference count အသစ်ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ reference ရဲ့ reference count ကို တိုးပေးပြီး — ရလာတဲ့ reference count ကို ပြန်ပေးပါတယ်။

#### `napi_reference_unref`

```c
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] ref`: Reference count လျှော့ပေးမယ့် `napi_ref` ပါ။
* `[out] result`: Reference count အသစ်ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းပေးလိုက်တဲ့ reference ရဲ့ reference count ကို လျှော့ပေးပြီး — ရလာတဲ့ reference count ကို ပြန်ပေးပါတယ်။

#### `napi_get_reference_value`

```c
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] ref`: သက်ဆိုင်တဲ့ value ကို တောင်းဆိုနေတဲ့ `napi_ref` ပါ။
* `[out] result`: `napi_ref` က ရည်ညွှန်းထားတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဆက်လက် valid ဖြစ်နေသေးရင် — ဤ API က `napi_ref` နဲ့ ဆက်စပ်နေတဲ့ JavaScript value ကို ကိုယ်စားပြုတဲ့ `napi_value` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ result က `NULL` ဖြစ်ပါလိမ့်မယ်။

### Cleanup on exit of the current Node.js environment (လက်ရှိ Node.js environment မှ ထွက်ခွာချိန်တွင် cleanup ပြုလုပ်ခြင်း)

Node.js process တစ်ခုက ပုံမှန်အားဖြင့် ထွက်ခွာချိန်မှာ ၎င်းရဲ့ resources တွေ အားလုံးကို လွှတ်ပေးပေမယ့် — Node.js ကို embed လုပ်တဲ့သူတွေ (embedders) သို့မဟုတ် အနာဂတ် Worker support တွေကတော့ — လက်ရှိ Node.js environment ထွက်ခွာသွားတာနဲ့ run လုပ်ပေးမယ့် clean-up hooks တွေကို မှတ်ပုံတင်ထားဖို့ addons တွေဆီက လိုအပ်နိုင်ပါတယ်။

Node-API က ဒီလို callbacks တွေကို မှတ်ပုံတင်ခြင်းနဲ့ မှတ်ပုံတင်မှု ဖျက်သိမ်းခြင်းအတွက် functions တွေကို ပံ့ပိုးပေးပါတယ်။ အဲဒီ callbacks တွေ run လုပ်တဲ့အခါ — addon က ကိုင်ထားတဲ့ resources တွေ အားလုံးကို လွှတ်ပေးသင့်ပါတယ်။

#### `napi_add_env_cleanup_hook`

```c
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```

လက်ရှိ Node.js environment ထွက်ခွာသွားတာနဲ့ `arg` parameter နဲ့အတူ run လုပ်ရမယ့် function အဖြစ် `fun` ကို မှတ်ပုံတင်ပါတယ်။

Function တစ်ခုကို မတူညီတဲ့ `arg` တန်ဖိုးတွေနဲ့ အကြိမ်များစွာ သတ်မှတ်နိုင်ပါတယ်။ အဲဒီလိုဆိုရင် — ၎င်းကိုလည်း အကြိမ်များစွာ ခေါ်ပါလိမ့်မယ်။ `fun` နဲ့ `arg` တန်ဖိုး အတူတူကို အကြိမ်များစွာ ပေးတာကတော့ ခွင့်မပြုပဲ — process ကို abort ဖြစ်စေပါလိမ့်မယ်။

Hooks တွေကို ပြောင်းပြန် အစီအစဉ်နဲ့ ခေါ်ပါလိမ့်မယ် — ဆိုလိုတာက နောက်ဆုံး ထည့်သွင်းထားတဲ့ hook ကို အရင်ဆုံး ခေါ်ပါတယ်။

ဒီ hook ကို ဖယ်ရှားဖို့ [`napi_remove_env_cleanup_hook`][] ကို သုံးနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — ဒီ hook ကို ထည့်သွင်းခဲ့တဲ့ resource ကိုယ်တိုင် ဖြိုဖျက်ခံ (torn down) နေရတဲ့အခါမျိုးမှာ ဒီလို ဖယ်ရှားလေ့ ရှိပါတယ်။

Asynchronous cleanup အတွက်ဆိုရင် [`napi_add_async_cleanup_hook`][] ကို သုံးနိုင်ပါတယ်။

#### `napi_remove_env_cleanup_hook`

```c
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```

လက်ရှိ Node.js environment ထွက်ခွာသွားတာနဲ့ `arg` parameter နဲ့ run လုပ်ရမယ့် function အဖြစ် `fun` ရဲ့ မှတ်ပုံတင်မှုကို ဖျက်သိမ်းပါတယ်။ Argument ရော function တန်ဖိုးပါ — အတိအကျ ကိုက်ညီနေရပါမယ်။

Function ကို မူလက `napi_add_env_cleanup_hook` နဲ့ မှတ်ပုံတင်ထားခဲ့ရပါမယ် — မဟုတ်ရင် process က abort ဖြစ်ပါလိမ့်မယ်။

#### `napi_add_async_cleanup_hook`

```c
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] hook`: Environment teardown (ဖြိုဖျက်ချိန်) မှာ ခေါ်ယူရမယ့် function pointer ပါ။
* `[in] arg`: `hook` ကို ခေါ်တဲ့အခါ ဖြတ်သန်းပေးရမယ့် pointer ပါ။
* `[out] remove_handle`: Optional — asynchronous cleanup hook ကို ရည်ညွှန်းတဲ့ handle ပါ။

[`napi_async_cleanup_hook`][] type ရဲ့ function တစ်ခုဖြစ်တဲ့ `hook` ကို — လက်ရှိ Node.js environment ထွက်ခွာသွားတာနဲ့ `remove_handle` နဲ့ `arg` parameters တွေနဲ့အတူ run လုပ်ရမယ့် function အဖြစ် မှတ်ပုံတင်ပါတယ်။

[`napi_add_env_cleanup_hook`][] နဲ့ မတူပဲ — hook က asynchronous ဖြစ်ခွင့် ပြုပါတယ်။

ကျန်တဲ့ အပြုအမူတွေကတော့ ယေဘုယျအားဖြင့် [`napi_add_env_cleanup_hook`][] နဲ့ ကိုက်ညီပါတယ်။

`remove_handle` က `NULL` မဟုတ်ဘူးဆိုရင် — hook ကို အရင်က ခေါ်ပြီးသား ဖြစ်နေသည်ဖြစ်စေ — နောက်ပိုင်းမှာ [`napi_remove_async_cleanup_hook`][] ဆီကို ဖြတ်သန်းပေးရမယ့် opaque (ဖောက်ထွင်းမြင်ရခက်) တန်ဖိုးတစ်ခုကို ၎င်းထဲမှာ သိမ်းဆည်းပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် — ဒီ hook ကို ထည့်သွင်းခဲ့တဲ့ resource ကိုယ်တိုင် ဖြိုဖျက်ခံနေရတဲ့အခါမျိုးမှာ ဒီလို ဖြစ်တတ်ပါတယ်။

#### `napi_remove_async_cleanup_hook`

```c
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```

* `[in] remove_handle`: [`napi_add_async_cleanup_hook`][] နဲ့ ဖန်တီးထားတဲ့ asynchronous cleanup hook တစ်ခုဆီကို ရည်ညွှန်းတဲ့ handle ပါ။

`remove_handle` နဲ့ သက်ဆိုင်တဲ့ cleanup hook ရဲ့ မှတ်ပုံတင်မှုကို ဖျက်သိမ်းပါတယ်။ ဒါက — hook က စတင် လုပ်ဆောင်နေပြီးသား မဟုတ်ဘူးဆိုရင် — အဲဒီ hook ကို လုပ်ဆောင်ခံရခြင်းကနေ ကာကွယ်ပေးပါလိမ့်မယ်။ [`napi_add_async_cleanup_hook`][] ကနေ ရရှိလာတဲ့ `napi_async_cleanup_hook_handle` တန်ဖိုး တိုင်းပေါ်မှာ ဒီ function ကို ခေါ်ပေးရပါမယ်။

### Finalization on the exit of the Node.js environment (Node.js environment မှ ထွက်ခွာချိန်တွင် finalization ပြုလုပ်ခြင်း)

Node.js environment ကို — JavaScript execution ခွင့်မပြုတော့ပဲ — ဥပမာ [`worker.terminate()`][] ရဲ့ တောင်းဆိုချက်အရဆိုရင် — မည်သည့်အချိန်မဆို တတ်နိုင်သမျှ မြန်မြန် ဖြိုဖျက်ခံရနိုင်ပါတယ်။ Environment ကို ဖြိုဖျက်နေချိန်မှာ — JavaScript objects တွေ၊ thread-safe functions တွေနဲ့ environment instance data တွေရဲ့ မှတ်ပုံတင်ထားတဲ့ `napi_finalize` callbacks တွေကို — ချက်ချင်း သီးခြားစီ ခေါ်ယူပါတယ်။

`napi_finalize` callbacks တွေရဲ့ ခေါ်ယူမှုကို — လက်နဲ့ ကိုယ်တိုင် မှတ်ပုံတင်ထားတဲ့ cleanup hooks တွေပြီးမှ စီစဉ်ပေးပါတယ်။ Environment shutdown ကာလအတွင်း — `napi_finalize` callback ထဲမှာ use-after-free (လွှတ်ပေးပြီးသား memory ကို ပြန်သုံးခြင်း) မဖြစ်အောင် — addon finalization ရဲ့ အစီအစဉ် မှန်ကန်စေဖို့အတွက် — addons တွေက ခွဲဝေထားတဲ့ (allocated) resources တွေကို အစီအစဉ်မှန်မှန် ကိုယ်တိုင် လွှတ်ပေးနိုင်ရန် `napi_add_env_cleanup_hook` နဲ့ `napi_add_async_cleanup_hook` တို့ဖြင့် cleanup hook တစ်ခုကို မှတ်ပုံတင်ထားသင့်ပါတယ်။

## Module registration (module မှတ်ပုံတင်ခြင်း)

Node-API modules တွေကို — `NODE_MODULE` macro အစား အောက်ပါအတိုင်း သုံးတာကလွဲလို့ — တခြား modules တွေနဲ့ ဆင်တူတဲ့ နည်းလမ်းနဲ့ မှတ်ပုံတင်ပါတယ်:

```c
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

နောက်ထပ် ကွာခြားချက်က `Init` method ရဲ့ signature ပါ။ Node-API module တစ်ခုအတွက်ဆိုရင် အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```c
napi_value Init(napi_env env, napi_value exports);
```

`Init` ကနေ ပြန်ပေးတဲ့ တန်ဖိုးကို module ရဲ့ `exports` object အဖြစ် သဘောထားပါတယ်။ အဆင်ပြေစေဖို့အတွက် `Init` method ဆီကို `exports` parameter ကနေတစ်ဆင့် object အလွတ်တစ်ခုကို ဖြတ်သန်းပေးပါတယ်။ `Init` က `NULL` ပြန်ပေးခဲ့ရင် — `exports` အဖြစ် ဖြတ်သန်းပေးထားတဲ့ parameter ကို module ကနေ export လုပ်ပါတယ်။ Node-API modules တွေက `module` object ကို ပြုပြင်လို့ မရပေမယ့် — module ရဲ့ `exports` property အနေနဲ့ ဘာကိုမဆို သတ်မှတ်နိုင်ပါတယ်။

`hello` method ကို — addon က ပံ့ပိုးပေးတဲ့ method တစ်ခုအနေနဲ့ ခေါ်နိုင်အောင် — function တစ်ခုအဖြစ် ထည့်သွင်းဖို့:

```c
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```

Addon အတွက် `require()` က ပြန်ပေးမယ့် function တစ်ခုကို သတ်မှတ်ဖို့:

```c
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```

Instances အသစ်တွေ ဖန်တီးနိုင်အောင် class တစ်ခုကို define လုပ်ဖို့ ([Object wrap][] နဲ့ တွဲသုံးလေ့ ရှိပါတယ်):

```c
// NOTE: partial example, not all referenced code is included
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```

`NAPI_MODULE_INIT` macro ကိုလည်း သုံးနိုင်ပါတယ် — ၎င်းက `NAPI_MODULE` နဲ့ `Init` function တစ်ခုကို define လုပ်ခြင်းအတွက် အတိုကောက် (shorthand) တစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်:

```c
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```

`NAPI_MODULE_INIT` macro ရဲ့ body ဆီကို `env` နဲ့ `exports` parameters တွေကို ပေးအပ်ပါတယ်။

Node-API addons တွေ အားလုံးက context-aware (context ကို သိရှိနားလည်သော) တွေ ဖြစ်ပြီး — ၎င်းတို့ကို အကြိမ်များစွာ load လုပ်နိုင်တယ်လို့ ဆိုလိုပါတယ်။ ဒီလို module တစ်ခုကို ကြေညာတဲ့အခါ ထည့်သွင်း စဉ်းစားစရာ design အချက်တွေ အနည်းငယ် ရှိပါတယ်။ [context-aware addons][] ဆိုင်ရာ documentation မှာ နောက်ထပ် အသေးစိတ်တွေ ဖော်ပြထားပါတယ်။

Macro ကို ခေါ်ယူပြီးနောက် function body အတွင်းမှာ `env` နဲ့ `exports` variables တွေကို ရရှိနိုင်ပါလိမ့်မယ်။

Objects တွေပေါ်မှာ properties သတ်မှတ်ခြင်းဆိုင်ရာ နောက်ထပ် အသေးစိတ်အတွက် [Working with JavaScript properties][] section ကို ကြည့်ပါ။

Addon modules တွေကို ယေဘုယျအားဖြင့် တည်ဆောက်ခြင်းဆိုင်ရာ နောက်ထပ် အသေးစိတ်အတွက်တော့ ရှိပြီးသား API ကို ရည်ညွှန်းပါ။

## Working with JavaScript values (JavaScript values များနှင့် အလုပ်လုပ်ခြင်း)

Node-API က JavaScript values တွေရဲ့ types အားလုံးကို ဖန်တီးဖို့အတွက် APIs အစုတစ်ခုကို ထုတ်ဖော်ပေးပါတယ်။ ဒီ types တွေထဲက တစ်ချို့ကို [ECMAScript Language Specification][] ရဲ့ [Section language types][] အောက်မှာ မှတ်တမ်းတင်ထားပါတယ်။

အခြေခံအားဖြင့် — ဒီ APIs တွေကို အောက်ပါတို့ထဲက တစ်ခုခုကို လုပ်ဆောင်ဖို့ သုံးပါတယ်:

1. JavaScript object အသစ်တစ်ခုကို ဖန်တီးခြင်း
2. Primitive C type တစ်ခုကနေ Node-API value တစ်ခုဆီကို ပြောင်းလဲခြင်း
3. Node-API value တစ်ခုကနေ primitive C type တစ်ခုဆီကို ပြောင်းလဲခြင်း
4. `undefined` နဲ့ `null` အပါအဝင် global instances တွေကို ရယူခြင်း

Node-API values တွေကို `napi_value` type နဲ့ ကိုယ်စားပြုပါတယ်။ JavaScript value တစ်ခု လိုအပ်တဲ့ Node-API call တိုင်းက `napi_value` တစ်ခုကို လက်ခံပါတယ်။ အချို့သော အခြေအနေတွေမှာ API က `napi_value` ရဲ့ type ကို ကြိုတင် (up-front) စစ်ဆေးပေးပါတယ်။ ဒါပေမယ့် — စွမ်းဆောင်ရည် ပိုကောင်းဖို့အတွက်တော့ — ခေါ်ယူသူ (caller) က မေးခွန်းထဲက `napi_value` က API က မျှော်လင့်ထားတဲ့ JavaScript type နဲ့ ကိုက်ညီကြောင်း သေချာအောင် လုပ်ထားတာက ပိုကောင်းပါတယ်။

### Enum types (enum အမျိုးအစားများ)

#### `napi_key_collection_mode`

```c
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```

`Keys/Properties` filter enums တွေကို ဖော်ပြပါတယ်:

`napi_key_collection_mode` က စုဆောင်းမယ့် properties တွေရဲ့ အတိုင်းအတာ (range) ကို ကန့်သတ်ပါတယ်။

`napi_key_own_only` က စုဆောင်းတဲ့ properties တွေကို ပေးထားတဲ့ object ပေါ်မှာသာ ကန့်သတ်ပါတယ်။ `napi_key_include_prototypes` ကတော့ — object ရဲ့ prototype chain ပေါ်က keys တွေ အားလုံးကိုပါ ထည့်သွင်းပါလိမ့်မယ်။

#### `napi_key_filter`

```c
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```

Property filter အတွက် bit flag ပါ။ ပေါင်းစပ် (composite) filter တစ်ခု တည်ဆောက်ဖို့ bit operators တွေနဲ့ တွဲဖက် အလုပ်လုပ်ပါတယ်။

#### `napi_key_conversion`

```c
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```

`napi_key_numbers_to_strings` က integer indexes တွေကို strings တွေအဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။ `napi_key_keep_numbers` ကတော့ integer indexes တွေအတွက် numbers တွေကို ပြန်ပေးပါလိမ့်မယ်။

#### `napi_valuetype`

```c
typedef enum {
  // ES6 types (corresponds to typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```

`napi_value` တစ်ခုရဲ့ type ကို ဖော်ပြပါတယ်။ ဒါက ယေဘုယျအားဖြင့် ECMAScript Language Specification ရဲ့ [Section language types][] မှာ ဖော်ပြထားတဲ့ types တွေနဲ့ ကိုက်ညီပါတယ်။ အဲဒီ section ထဲက types တွေအပြင် — `napi_valuetype` က external data ပါတဲ့ `Function`s နဲ့ `Object`s တွေကိုလည်း ကိုယ်စားပြုနိုင်ပါတယ်။

`napi_external` type ရဲ့ JavaScript value တစ်ခုက JavaScript ထဲမှာ — properties ဘာမှ သတ်မှတ်လို့မရတဲ့၊ prototype မရှိတဲ့ — plain object (သာမန် object) တစ်ခုအနေနဲ့ ပေါ်လာပါတယ်။

#### `napi_typedarray_type`

```c
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
  napi_float16_array,
} napi_typedarray_type;
```

ဒါက `TypedArray` ရဲ့ နောက်ခံ (underlying) binary scalar datatype ကို ကိုယ်စားပြုပါတယ်။ ဒီ enum ရဲ့ elements တွေက [ECMAScript Language Specification][] ရဲ့ [Section TypedArray objects][] နဲ့ ကိုက်ညီပါတယ်။

### Object creation functions (object ဖန်တီးခြင်း functions များ)

#### `napi_create_array`

```c
napi_status napi_create_array(napi_env env, napi_value* result)
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: JavaScript `Array` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က JavaScript `Array` type နဲ့ သက်ဆိုင်တဲ့ Node-API value တစ်ခုကို ပြန်ပေးပါတယ်။ JavaScript arrays တွေကို ECMAScript Language Specification ရဲ့ [Section Array objects][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_array_with_length`

```c
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] length`: `Array` ရဲ့ ကနဦး length ပါ။
* `[out] result`: JavaScript `Array` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က JavaScript `Array` type နဲ့ သက်ဆိုင်တဲ့ Node-API value တစ်ခုကို ပြန်ပေးပါတယ်။ `Array` ရဲ့ length property ကို ဖြတ်သန်းပေးလိုက်တဲ့ length parameter နဲ့ သတ်မှတ်ပေးပါတယ်။ ဒါပေမယ့် — array ကို ဖန်တီးတဲ့အခါ underlying buffer ကို VM က ကြိုတင် ခွဲဝေပေးမယ်လို့တော့ အာမခံချက် မရှိပါဘူး။ အဲဒီအပြုအမူကို underlying VM implementation ရဲ့ တာဝန်အဖြစ် ချန်ထားပါတယ်။ Buffer က C ကနေတစ်ဆင့် တိုက်ရိုက် ဖတ်လို့/ရေးလို့ရတဲ့ — memory ရဲ့ ဆက်တိုက် (contiguous) block တစ်ခု ဖြစ်ရမယ်ဆိုရင် — [`napi_create_external_arraybuffer`][] ကို သုံးဖို့ စဉ်းစားပါ။

JavaScript arrays တွေကို ECMAScript Language Specification ရဲ့ [Section Array objects][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_arraybuffer`

```c
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] length`: ဖန်တီးရမယ့် array buffer ရဲ့ bytes အရှည်ပါ။
* `[out] data`: `ArrayBuffer` ရဲ့ underlying byte buffer ဆီကို ညွှန်ပြတဲ့ pointer ပါ။ `data` ကို `NULL` ဖြတ်သန်းခြင်းဖြင့် လိုအပ်ရင် လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] result`: JavaScript `ArrayBuffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က JavaScript `ArrayBuffer` နဲ့ သက်ဆိုင်တဲ့ Node-API value တစ်ခုကို ပြန်ပေးပါတယ်။ `ArrayBuffer`s တွေကို သတ်မှတ်ထားတဲ့ အရှည် (fixed-length) ရှိတဲ့ binary data buffers တွေကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ ၎င်းတို့ကို ပုံမှန်အားဖြင့် `TypedArray` objects တွေအတွက် backing-buffer (ကျောထောက်နောက်ခံ buffer) အဖြစ် သုံးပါတယ်။ ခွဲဝေလိုက်တဲ့ `ArrayBuffer` မှာ — ဖြတ်သန်းပေးလိုက်တဲ့ `length` parameter က ဆုံးဖြတ်ပေးတဲ့ အရွယ်အစားရှိတဲ့ — underlying byte buffer တစ်ခု ရှိပါလိမ့်မယ်။ Caller က buffer ကို တိုက်ရိုက် ခြယ်လှယ်ချင်တဲ့ အခြေအနေမျိုးအတွက် — underlying buffer ကို caller ဆီ optional အနေနဲ့ ပြန်ပေးပါတယ်။ ဒီ buffer ကို native code ကနေသာ တိုက်ရိုက် ရေးသားနိုင်ပါတယ်။ JavaScript ကနေ ဒီ buffer ထဲကို ရေးသားဖို့ဆိုရင် — typed array သို့မဟုတ် `DataView` object တစ်ခုကို ဖန်တီးပေးရပါလိမ့်မယ်။

JavaScript `ArrayBuffer` objects တွေကို ECMAScript Language Specification ရဲ့ [Section ArrayBuffer objects][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_buffer`

```c
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] size`: Underlying buffer ရဲ့ bytes အရွယ်အစားပါ။
* `[out] data`: Underlying buffer ဆီကို ညွှန်ပြတဲ့ raw pointer ပါ။ `data` ကို `NULL` ဖြတ်သန်းခြင်းဖြင့် လိုအပ်ရင် လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] result`: `node::Buffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `node::Buffer` object တစ်ခုကို ခွဲဝေပေးပါတယ်။ ဒါက အပြည့်အဝ support လုပ်ထားတဲ့ data structure တစ်ခု ဖြစ်နေဆဲပဲ ဖြစ်ပေမယ့် — အခြေအနေ အများစုမှာတော့ `TypedArray` တစ်ခုကို သုံးတာနဲ့ လုံလောက်ပါတယ်။

#### `napi_create_buffer_copy`

```c
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] size`: Input buffer ရဲ့ bytes အရွယ်အစားပါ (buffer အသစ်ရဲ့ အရွယ်အစားနဲ့ တူညီသင့်ပါတယ်)။
* `[in] data`: မိတ္တူကူးယူရမယ့် underlying buffer ဆီကို ညွှန်ပြတဲ့ raw pointer ပါ။
* `[out] result_data`: `Buffer` အသစ်ရဲ့ underlying data buffer ဆီကို ညွှန်ပြတဲ့ pointer ပါ။ `result_data` ကို `NULL` ဖြတ်သန်းခြင်းဖြင့် လိုအပ်ရင် လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] result`: `node::Buffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `node::Buffer` object တစ်ခုကို ခွဲဝေပြီး — ဖြတ်သန်းပေးလိုက်တဲ့ buffer ကနေ ကူးယူထားတဲ့ data တွေနဲ့ initialize လုပ်ပါတယ်။ ဒါက အပြည့်အဝ support လုပ်ထားတဲ့ data structure တစ်ခု ဖြစ်နေဆဲပဲ ဖြစ်ပေမယ့် — အခြေအနေ အများစုမှာတော့ `TypedArray` တစ်ခုကို သုံးတာနဲ့ လုံလောက်ပါတယ်။

#### `napi_create_date`

```c
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] time`: 01 January, 1970 UTC ကနေ စတင်တွက်တဲ့ millisecond နဲ့ ECMAScript time value ပါ။
* `[out] result`: JavaScript `Date` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က leap seconds (ရက်ထပ်စက္ကန့်) တွေကို ထည့်သွင်း စဉ်းစားမပေးပါဘူး — ECMAScript က POSIX time specification နဲ့ ညှိထားတာမို့ ၎င်းတို့ကို လျစ်လျူရှုပါတယ်။

ဤ API က JavaScript `Date` object တစ်ခုကို ခွဲဝေပေးပါတယ်။

JavaScript `Date` objects တွေကို ECMAScript Language Specification ရဲ့ [Section Date objects][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_external`

```c
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] data`: External data ဆီကို ညွှန်ပြတဲ့ raw pointer ပါ။
* `[in] finalize_cb`: Optional — external value ကို collect လုပ်နေချိန်မှာ ခေါ်ယူရမယ့် callback ပါ။ [`napi_finalize`][] မှာ နောက်ထပ် အသေးစိတ်တွေ ပါဝင်ပါတယ်။
* `[in] finalize_hint`: Optional — collection ပြုလုပ်နေစဉ်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် hint ပါ။
* `[out] result`: External value တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က external data ကို တွဲချိတ်ထားတဲ့ JavaScript value တစ်ခုကို ခွဲဝေပေးပါတယ်။ ဒါကို — နောက်ပိုင်းမှာ native code က [`napi_get_value_external`][] ကို သုံးပြီး ပြန်လည် ရယူနိုင်အောင် — external data တွေကို JavaScript code ကနေတစ်ဆင့် ဖြတ်သန်း ပို့ဆောင်ဖို့ သုံးပါတယ်။

API က `napi_finalize` callback တစ်ခုကို ထည့်သွင်းပေးပြီး — ဖန်တီးလိုက်တဲ့ JavaScript object ကို garbage collected (garbage collector က စုဆောင်း) လုပ်လိုက်တဲ့အခါ ခေါ်ယူပါလိမ့်မယ်။

ဖန်တီးလိုက်တဲ့ value က object တစ်ခု မဟုတ်တာမို့ — ထပ်ဆောင်း properties တွေကို support မလုပ်ပါဘူး။ ၎င်းကို သီးခြား value type တစ်ခုအဖြစ် မှတ်ယူပြီး — external value တစ်ခုနဲ့ `napi_typeof()` ကို ခေါ်ရင် `napi_external` ကို ပြန်ပေးပါတယ်။

#### `napi_create_external_arraybuffer`

```c
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] external_data`: `ArrayBuffer` ရဲ့ underlying byte buffer ဆီကို ညွှန်ပြတဲ့ pointer ပါ။
* `[in] byte_length`: Underlying buffer ရဲ့ bytes အရှည်ပါ။
* `[in] finalize_cb`: Optional — `ArrayBuffer` ကို collect လုပ်နေချိန်မှာ ခေါ်ယူရမယ့် callback ပါ။ [`napi_finalize`][] မှာ နောက်ထပ် အသေးစိတ်တွေ ပါဝင်ပါတယ်။
* `[in] finalize_hint`: Optional — collection ပြုလုပ်နေစဉ်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် hint ပါ။
* `[out] result`: JavaScript `ArrayBuffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

**Node.js မဟုတ်တဲ့ runtimes တစ်ချို့မှာ external buffers တွေအတွက် support ကို ဖြုတ်ချလိုက်ပါပြီ**။ Node.js မဟုတ်တဲ့ runtimes တွေပေါ်မှာ ဒီ method က — external buffers တွေကို support မလုပ်ကြောင်း ဖော်ပြဖို့ `napi_no_external_buffers_allowed` ကို ပြန်ပေးနိုင်ပါတယ်။ ဒီလို runtimes တွေထဲက တစ်ခုကတော့ Electron ဖြစ်ပြီး — [electron/issues/35801](https://github.com/electron/electron/issues/35801) issue မှာ ဖော်ပြထားပါတယ်။

Runtimes တွေ အားလုံးနဲ့ အကျယ်ပြန့်ဆုံး လိုက်ဖက်ညီမှုကို ထိန်းသိမ်းဖို့အတွက် — node-api headers တွေအတွက် includes တွေရဲ့ ရှေ့မှာ — သင့် addon ထဲမှာ `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` ကို define လုပ်ထားနိုင်ပါတယ်။ အဲဒီလို လုပ်ခြင်းက external buffers တွေကို ဖန်တီးပေးတဲ့ functions ၂ ခုကို ဖုံးကွယ်ပေးပါလိမ့်မယ်။ ဒါက — ဒီ methods တွေထဲက တစ်ခုခုကို မတော်တဆ သုံးမိရင် compile error တစ်ခု ဖြစ်ပေါ်လာမယ်လို့ အာမခံပေးပါတယ်။

ဤ API က JavaScript `ArrayBuffer` နဲ့ သက်ဆိုင်တဲ့ Node-API value တစ်ခုကို ပြန်ပေးပါတယ်။ `ArrayBuffer` ရဲ့ underlying byte buffer ကို ပြင်ပ (external) မှာ ခွဲဝေပြီး စီမံပါတယ်။ Caller က — finalize callback ကို ခေါ်ယူသည့်အထိ — byte buffer က valid ဖြစ်နေအောင် သေချာစေရပါမယ်။

API က `napi_finalize` callback တစ်ခုကို ထည့်သွင်းပေးပြီး — ဖန်တီးလိုက်တဲ့ JavaScript object ကို garbage collected လုပ်လိုက်တဲ့အခါ ခေါ်ယူပါလိမ့်မယ်။

JavaScript `ArrayBuffer`s တွေကို ECMAScript Language Specification ရဲ့ [Section ArrayBuffer objects][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_external_sharedarraybuffer`

```c
napi_status
node_api_create_external_sharedarraybuffer(napi_env env,
                                           void* external_data,
                                           size_t byte_length,
                                           node_api_noenv_finalize finalize_cb,
                                           void* finalize_hint,
                                           napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] external_data`: `SharedArrayBuffer` ရဲ့ underlying byte buffer ဆီကို ညွှန်ပြတဲ့ pointer ပါ။
* `[in] byte_length`: Underlying buffer ရဲ့ bytes အရှည်ပါ။
* `[in] finalize_cb`: Optional — `SharedArrayBuffer` ကို collect လုပ်နေချိန်မှာ ခေါ်ယူရမယ့် callback ပါ။ ၎င်းကို မည်သည့် thread ပေါ်မှာမဆို ခေါ်နိုင်ပါတယ်။ `SharedArrayBuffer` တစ်ခုက ၎င်းကို ဖန်တီးထားတဲ့ environment ထက် ပိုကြာ ရှင်သန်နိုင်တာမို့ — callback က `env` ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး။
* `[in] finalize_hint`: Optional — collection ပြုလုပ်နေစဉ်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် hint ပါ။
* `[out] result`: JavaScript `SharedArrayBuffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ပြင်ပမှာ စီမံခန့်ခွဲတဲ့ (externally managed) memory နဲ့ `SharedArrayBuffer` တစ်ခုကို ဖန်တီးပါတယ်။

Runtime compatibility (runtime လိုက်ဖက်ညီမှု) အတွက် [`napi_create_external_arraybuffer`][] ဆိုင်ရာ မှတ်တမ်းကို ကြည့်ပါ။

#### `napi_create_external_buffer`

```c
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] length`: Input buffer ရဲ့ bytes အရွယ်အစားပါ (buffer အသစ်ရဲ့ အရွယ်အစားနဲ့ တူညီသင့်ပါတယ်)။
* `[in] data`: JavaScript ဆီကို ထုတ်ဖော်ပြသရမယ့် underlying buffer ဆီကို ညွှန်ပြတဲ့ raw pointer ပါ။
* `[in] finalize_cb`: Optional — `ArrayBuffer` ကို collect လုပ်နေချိန်မှာ ခေါ်ယူရမယ့် callback ပါ။ [`napi_finalize`][] မှာ နောက်ထပ် အသေးစိတ်တွေ ပါဝင်ပါတယ်။
* `[in] finalize_hint`: Optional — collection ပြုလုပ်နေစဉ်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် hint ပါ။
* `[out] result`: `node::Buffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

**Node.js မဟုတ်တဲ့ runtimes တစ်ချို့မှာ external buffers တွေအတွက် support ကို ဖြုတ်ချလိုက်ပါပြီ**။ Node.js မဟုတ်တဲ့ runtimes တွေပေါ်မှာ ဒီ method က — external buffers တွေကို support မလုပ်ကြောင်း ဖော်ပြဖို့ `napi_no_external_buffers_allowed` ကို ပြန်ပေးနိုင်ပါတယ်။ ဒီလို runtimes တွေထဲက တစ်ခုကတော့ Electron ဖြစ်ပြီး — [electron/issues/35801](https://github.com/electron/electron/issues/35801) issue မှာ ဖော်ပြထားပါတယ်။

Runtimes တွေ အားလုံးနဲ့ အကျယ်ပြန့်ဆုံး လိုက်ဖက်ညီမှုကို ထိန်းသိမ်းဖို့အတွက် — node-api headers တွေအတွက် includes တွေရဲ့ ရှေ့မှာ — သင့် addon ထဲမှာ `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` ကို define လုပ်ထားနိုင်ပါတယ်။ အဲဒီလို လုပ်ခြင်းက external buffers တွေကို ဖန်တီးပေးတဲ့ functions ၂ ခုကို ဖုံးကွယ်ပေးပါလိမ့်မယ်။ ဒါက — ဒီ methods တွေထဲက တစ်ခုခုကို မတော်တဆ သုံးမိရင် compile error တစ်ခု ဖြစ်ပေါ်လာမယ်လို့ အာမခံပေးပါတယ်။

ဤ API က `node::Buffer` object တစ်ခုကို ခွဲဝေပြီး — ဖြတ်သန်းပေးလိုက်တဲ့ buffer ကို နောက်ခံ (backing) အဖြစ် သုံးထားတဲ့ data တွေနဲ့ initialize လုပ်ပါတယ်။ ဒါက အပြည့်အဝ support လုပ်ထားတဲ့ data structure တစ်ခု ဖြစ်နေဆဲပဲ ဖြစ်ပေမယ့် — အခြေအနေ အများစုမှာတော့ `TypedArray` တစ်ခုကို သုံးတာနဲ့ လုံလောက်ပါတယ်။

API က `napi_finalize` callback တစ်ခုကို ထည့်သွင်းပေးပြီး — ဖန်တီးလိုက်တဲ့ JavaScript object ကို garbage collected လုပ်လိုက်တဲ့အခါ ခေါ်ယူပါလိမ့်မယ်။

Node.js >=4 အတွက်ဆိုရင် `Buffers` တွေက `Uint8Array`s တွေပါ။

#### `napi_create_object`

```c
napi_status napi_create_object(napi_env env, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: JavaScript `Object` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က default JavaScript `Object` တစ်ခုကို ခွဲဝေပေးပါတယ်။ ၎င်းက JavaScript မှာ `new Object()` လုပ်တာနဲ့ ညီမျှပါတယ်။

JavaScript `Object` type ကို ECMAScript Language Specification ရဲ့ [Section object type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_object_with_properties`

> Stability: 1 - Experimental

```cpp
napi_status node_api_create_object_with_properties(napi_env env,
                                                   napi_value prototype_or_null,
                                                   const napi_value* property_names,
                                                   const napi_value* property_values,
                                                   size_t property_count,
                                                   napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] prototype_or_null`: Object အသစ်အတွက် prototype object ပါ။ Prototype အဖြစ် သုံးမယ့် JavaScript object တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` တစ်ခု၊ JavaScript `null` ကို ကိုယ်စားပြုတဲ့ `napi_value` တစ်ခု သို့မဟုတ် — `null` အဖြစ် ပြောင်းလဲပေးမယ့် — `nullptr` တစ်ခု ဖြစ်နိုင်ပါတယ်။
* `[in] property_names`: Property names တွေကို ကိုယ်စားပြုတဲ့ `napi_value` တွေရဲ့ array ပါ။
* `[in] property_values`: Property values တွေကို ကိုယ်စားပြုတဲ့ `napi_value` တွေရဲ့ array ပါ။
* `[in] property_count`: Arrays တွေထဲက properties အရေအတွက်ပါ။
* `[out] result`: JavaScript `Object` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က သတ်မှတ်ထားတဲ့ prototype နဲ့ properties တွေပါတဲ့ JavaScript `Object` တစ်ခုကို ဖန်တီးပါတယ်။ ဒါက `napi_create_object` ကို ခေါ်ပြီး `napi_set_property` ခေါ်တွေ အများအပြား နောက်ကနေ ဆက်ခေါ်တာထက် ပိုထိရောက်ပါတယ် — အကြောင်းကတော့ object ကို properties တွေ အားလုံးနဲ့အတူ atomically (တစ်ပြိုင်နက်တည်း) ဖန်တီးနိုင်ပြီး — ဖြစ်နိုင်ခြေရှိတဲ့ V8 map transitions တွေကို ရှောင်ရှားနိုင်လို့ပါ။

`property_names` နဲ့ `property_values` arrays တွေမှာ — `property_count` က သတ်မှတ်ထားတဲ့ — တူညီတဲ့ length ရှိရပါမယ်။ Properties တွေကို arrays တွေထဲမှာ ပေါ်လာတဲ့ အစီအစဉ်အတိုင်း object ပေါ်ကို ထည့်သွင်းပါတယ်။

#### `napi_create_symbol`

```c
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] description`: Optional — symbol အတွက် description အဖြစ် သတ်မှတ်ပေးမယ့် JavaScript `string` တစ်ခုကို ရည်ညွှန်းတဲ့ `napi_value` ပါ။
* `[out] result`: JavaScript `symbol` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က UTF8-encoded C string တစ်ခုကနေ JavaScript `symbol` value တစ်ခုကို ဖန်တီးပါတယ်။

JavaScript `symbol` type ကို ECMAScript Language Specification ရဲ့ [Section symbol type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_symbol_for`

```c
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] utf8description`: Symbol အတွက် description အဖြစ် သုံးမယ့် စာသားကို ကိုယ်စားပြုတဲ့ UTF-8 C string ပါ။
* `[in] length`: Description string ရဲ့ bytes အရှည်ပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: JavaScript `symbol` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ description နဲ့ ရှိပြီးသား symbol တစ်ခုအတွက် global registry ထဲမှာ ရှာဖွေပါတယ်။ Symbol က ရှိပြီးသား ဖြစ်နေရင် ၎င်းကို ပြန်ပေးပြီး — မဟုတ်ရင် registry ထဲမှာ symbol အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

JavaScript `symbol` type ကို ECMAScript Language Specification ရဲ့ [Section symbol type][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_typedarray`

```c
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] type`: `TypedArray` အတွင်းက elements တွေရဲ့ scalar datatype ပါ။
* `[in] length`: `TypedArray` ထဲက elements အရေအတွက်ပါ။
* `[in] arraybuffer`: Typed array ရဲ့ နောက်ခံဖြစ်တဲ့ `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ပါ။
* `[in] byte_offset`: `TypedArray` ကို စတင် ပုံဖော် (project) မယ့် `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` အတွင်းက byte offset ပါ။
* `[out] result`: JavaScript `TypedArray` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ရှိပြီးသား `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` တစ်ခုအပေါ်မှာ JavaScript `TypedArray` object တစ်ခုကို ဖန်တီးပါတယ်။ `TypedArray` objects တွေက — element တစ်ခုချင်းစီမှာ တူညီတဲ့ underlying binary scalar datatype ရှိတဲ့ — underlying data buffer တစ်ခုအပေါ်မှာ array ပုံစံ view (array-like view) တစ်ခုကို ပေးစွမ်းပါတယ်။

`(length * size_of_element) + byte_offset` က ဖြတ်သန်းပေးလိုက်တဲ့ `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ရဲ့ bytes အရွယ်အစားထက် ငယ်သည် သို့မဟုတ် ညီရပါမယ်။ မဟုတ်ရင် `RangeError` exception တစ်ခုကို raise လုပ်ပါတယ်။

Element အရွယ်အစား 1 ထက် ကြီးတဲ့အခါ — `byte_offset` က element အရွယ်အစားရဲ့ အဆ (multiple) တစ်ခု ဖြစ်ရပါမယ်။ မဟုတ်ရင် `RangeError` exception တစ်ခုကို raise လုပ်ပါတယ်။

JavaScript `TypedArray` objects တွေကို ECMAScript Language Specification ရဲ့ [Section TypedArray objects][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_buffer_from_arraybuffer`

```c
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```

* **`[in] env`**: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* **`[in] arraybuffer`**: Buffer ကို ဖန်တီးသွားမယ့် `ArrayBuffer` ပါ။
* **`[in] byte_offset`**: Buffer ကို စတင် ဖန်တီးမယ့် `ArrayBuffer` အတွင်းက byte offset ပါ။
* **`[in] byte_length`**: `ArrayBuffer` ကနေ ဖန်တီးမယ့် buffer ရဲ့ bytes အရှည်ပါ။
* **`[out] result`**: ဖန်တီးလိုက်တဲ့ JavaScript `Buffer` object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ရှိပြီးသား `ArrayBuffer` တစ်ခုကနေ JavaScript `Buffer` object တစ်ခုကို ဖန်တီးပါတယ်။ `Buffer` object က Node.js အတွက် သီးသန့် class တစ်ခုဖြစ်ပြီး — JavaScript ထဲမှာ binary data တွေနဲ့ တိုက်ရိုက် အလုပ်လုပ်ဖို့ နည်းလမ်းတစ်ခုကို ပေးစွမ်းပါတယ်။

`[byte_offset, byte_offset + byte_length)` byte range က `ArrayBuffer` ရဲ့ နယ်နိမိတ် (bounds) အတွင်းမှာ ရှိရပါမယ်။ `byte_offset + byte_length` က `ArrayBuffer` ရဲ့ အရွယ်အစားကို ကျော်လွန်သွားရင် — `RangeError` exception တစ်ခုကို raise လုပ်ပါတယ်။

#### `napi_create_dataview`

```c
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] length`: `DataView` ထဲက elements အရေအတွက်ပါ။
* `[in] arraybuffer`: `DataView` ရဲ့ နောက်ခံဖြစ်တဲ့ `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ပါ။
* `[in] byte_offset`: `DataView` ကို စတင် ပုံဖော်မယ့် `ArrayBuffer` အတွင်းက byte offset ပါ။
* `[out] result`: JavaScript `DataView` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ရှိပြီးသား `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` တစ်ခုအပေါ်မှာ JavaScript `DataView` object တစ်ခုကို ဖန်တီးပါတယ်။ `DataView` objects တွေက underlying data buffer တစ်ခုအပေါ်မှာ array ပုံစံ view တစ်ခုကို ပေးစွမ်းပြီး — `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` အတွင်းမှာ အရွယ်အစားနဲ့ type မတူညီတဲ့ items တွေကို ခွင့်ပြုပေးတဲ့ view တစ်ခု ဖြစ်ပါတယ်။

`byte_length + byte_offset` က ဖြတ်သန်းပေးလိုက်တဲ့ array ရဲ့ bytes အရွယ်အစားထက် ငယ်သည် သို့မဟုတ် ညီရပါမယ်။ မဟုတ်ရင် `RangeError` exception တစ်ခုကို raise လုပ်ပါတယ်။

JavaScript `DataView` objects တွေကို ECMAScript Language Specification ရဲ့ [Section DataView objects][] မှာ ဖော်ပြထားပါတယ်။

### Functions to convert from C types to Node-API (C types များမှ Node-API သို့ ပြောင်းလဲခြင်း functions များ)

#### `napi_create_int32`

```c
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် integer value ပါ။
* `[out] result`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို C `int32_t` type ကနေ JavaScript `number` type ဆီကို ပြောင်းလဲဖို့ သုံးပါတယ်။

JavaScript `number` type ကို ECMAScript Language Specification ရဲ့ [Section number type][] မှာ ဖော်ပြထားပါတယ်။
#### `napi_create_uint32`

```c
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် unsigned integer တန်ဖိုးပါ။
* `[out] result`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို C `uint32_t` type ကနေ JavaScript `number` type ဆီကို ပြောင်းလဲဖို့ သုံးပါတယ်။

JavaScript `number` type ကို ECMAScript Language Specification ရဲ့ [Section number type][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_int64`

```c
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် integer value ပါ။
* `[out] result`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို C `int64_t` type ကနေ JavaScript `number` type ဆီကို ပြောင်းလဲဖို့ သုံးပါတယ်။

JavaScript `number` type ကို ECMAScript Language Specification ရဲ့ [Section number type][] မှာ ဖော်ပြထားပါတယ်။ သတိပြုရမှာက `int64_t` ရဲ့ range တစ်ခုလုံးကို JavaScript မှာ precision အပြည့်နဲ့ ကိုယ်စားပြုလို့ မရပါဘူး။ [`Number.MIN_SAFE_INTEGER`][] `-(2**53 - 1)` နဲ့ [`Number.MAX_SAFE_INTEGER`][] `(2**53 - 1)` ကြားက range ရဲ့ အပြင်ဘက်က integer values တွေက precision ဆုံးရှုံးသွားပါလိမ့်မယ်။

#### `napi_create_double`

```c
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် double-precision တန်ဖိုးပါ။
* `[out] result`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API ကို C `double` type ကနေ JavaScript `number` type ဆီကို ပြောင်းလဲဖို့ သုံးပါတယ်။

JavaScript `number` type ကို ECMAScript Language Specification ရဲ့ [Section number type][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_bigint_int64`

```c
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် integer value ပါ။
* `[out] result`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က C `int64_t` type ကနေ JavaScript `BigInt` type ဆီကို ပြောင်းလဲပေးပါတယ်။

#### `napi_create_bigint_uint64`

```c
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript ထဲမှာ ကိုယ်စားပြုသွားမယ့် unsigned integer တန်ဖိုးပါ။
* `[out] result`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က C `uint64_t` type ကနေ JavaScript `BigInt` type ဆီကို ပြောင်းလဲပေးပါတယ်။

#### `napi_create_bigint_words`

```c
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] sign_bit`: ရလာမယ့် `BigInt` က positive လား negative လားဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။
* `[in] word_count`: `words` array ရဲ့ အလျားပါ။
* `[in] words`: `uint64_t` little-endian 64-bit words တွေရဲ့ array တစ်ခုပါ။
* `[out] result`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က unsigned 64-bit words တွေရဲ့ array တစ်ခုကို `BigInt` value တစ်ခုတည်းအဖြစ် ပြောင်းလဲပေးပါတယ်။

ရလာတဲ့ `BigInt` ကို အောက်ပါအတိုင်း တွက်ချက်ပါတယ်: (–1)`sign_bit` (`words[0]` × (264)0 + `words[1]` × (264)1 + …)

#### `napi_create_string_latin1`

```c
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: ISO-8859-1 encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ISO-8859-1-encoded C string တစ်ခုကနေ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_external_string_latin1`

```c
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: ISO-8859-1 encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[in] finalize_callback`: String ကို collect (garbage collection) လုပ်ချိန်မှာ ခေါ်ယူရမယ့် function ပါ။ Function ကို အောက်ပါ parameters တွေနဲ့ ခေါ်ယူပါလိမ့်မယ်:
  * `[in] env`: Add-on ကို run လုပ်နေတဲ့ environment ပါ။ String ကို worker သို့မဟုတ် အဓိက Node.js instance ရဲ့ termination ၏ အစိတ်အပိုင်းအနေနဲ့ collect လုပ်နေတာဆိုရင် ဒီတန်ဖိုးက `null` ဖြစ်နိုင်ပါတယ်။
  * `[in] data`: ဒါက `str` တန်ဖိုးကို `void*` pointer အနေနဲ့ ဖော်ပြတာပါ။
  * `[in] finalize_hint`: ဒါက API ဆီကို ပေးခဲ့တဲ့ `finalize_hint` တန်ဖိုးပါ။ [`napi_finalize`][] မှာ နောက်ထပ် အသေးစိတ်တွေ ဖော်ပြထားပါတယ်။ ဒီ parameter က optional ပါ — `null` တန်ဖိုး ဖြတ်သန်းလိုက်တာက သက်ဆိုင်ရာ JavaScript string ကို collect လုပ်တဲ့အခါ add-on ကို အသိပေးစရာ မလိုဘူးလို့ ဆိုလိုပါတယ်။
* `[in] finalize_hint`: Collection လုပ်ချိန်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် optional hint ပါ။
* `[out] result`: JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] copied`: String ကို copy လုပ်ခဲ့လားဆိုတာပါ။ Copy လုပ်ခဲ့တယ်ဆိုရင် — `str` ကို destroy လုပ်ဖို့ finalizer ကို ခေါ်ပြီးသား ဖြစ်ပါလိမ့်မယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ISO-8859-1-encoded C string တစ်ခုကနေ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy မလုပ်ပဲ ထားနိုင်တာမို့ — JavaScript value ရဲ့ သက်တမ်း (life cycle) တစ်လျှောက်လုံး ဆက်လက် တည်ရှိနေရပါမယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_string_utf16`

```c
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: UTF16-LE encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို two-byte code units တွေနဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က UTF16-LE-encoded C string တစ်ခုကနေ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_external_string_utf16`

```c
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: UTF16-LE encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို two-byte code units တွေနဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[in] finalize_callback`: String ကို collect (garbage collection) လုပ်ချိန်မှာ ခေါ်ယူရမယ့် function ပါ။ Function ကို အောက်ပါ parameters တွေနဲ့ ခေါ်ယူပါလိမ့်မယ်:
  * `[in] env`: Add-on ကို run လုပ်နေတဲ့ environment ပါ။ String ကို worker သို့မဟုတ် အဓိက Node.js instance ရဲ့ termination ၏ အစိတ်အပိုင်းအနေနဲ့ collect လုပ်နေတာဆိုရင် ဒီတန်ဖိုးက `null` ဖြစ်နိုင်ပါတယ်။
  * `[in] data`: ဒါက `str` တန်ဖိုးကို `void*` pointer အနေနဲ့ ဖော်ပြတာပါ။
  * `[in] finalize_hint`: ဒါက API ဆီကို ပေးခဲ့တဲ့ `finalize_hint` တန်ဖိုးပါ။ [`napi_finalize`][] မှာ နောက်ထပ် အသေးစိတ်တွေ ဖော်ပြထားပါတယ်။ ဒီ parameter က optional ပါ — `null` တန်ဖိုး ဖြတ်သန်းလိုက်တာက သက်ဆိုင်ရာ JavaScript string ကို collect လုပ်တဲ့အခါ add-on ကို အသိပေးစရာ မလိုဘူးလို့ ဆိုလိုပါတယ်။
* `[in] finalize_hint`: Collection လုပ်ချိန်အတွင်း finalize callback ဆီကို ဖြတ်သန်းပေးရမယ့် optional hint ပါ။
* `[out] result`: JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] copied`: String ကို copy လုပ်ခဲ့လားဆိုတာပါ။ Copy လုပ်ခဲ့တယ်ဆိုရင် — `str` ကို destroy လုပ်ဖို့ finalizer ကို ခေါ်ပြီးသား ဖြစ်ပါလိမ့်မယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က UTF16-LE-encoded C string တစ်ခုကနေ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy မလုပ်ပဲ ထားနိုင်တာမို့ — JavaScript value ရဲ့ သက်တမ်း (life cycle) တစ်လျှောက်လုံး ဆက်လက် တည်ရှိနေရပါမယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_create_string_utf8`

```c
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: UTF8 encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က UTF8-encoded C string တစ်ခုကနေ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

### Functions to create optimized property keys (optimized property keys များ ဖန်တီးခြင်း functions များ)

V8 အပါအဝင် JavaScript engines တွေ အများစုက property values တွေကို set/get လုပ်ဖို့ internalized strings တွေကို keys အဖြစ် သုံးပါတယ်။ အဲဒီလို strings တွေကို ဖန်တီးပြီး ရှာဖွေဖို့ hash table တစ်ခုကို ပုံမှန်အားဖြင့် သုံးပါတယ်။ Key တစ်ခုချင်းစီ ဖန်တီးမှုမှာ ကုန်ကျစရိတ် အနည်းငယ် ထပ်တိုးပေမယ့် — အဲဒီနောက်မှာတော့ string တစ်ခုလုံး နှိုင်းယှဉ်မယ့်အစား string pointers တွေကို နှိုင်းယှဉ်လို့ ရတာကြောင့် — စွမ်းဆောင်ရည်ကို တိုးတက်စေပါတယ်။

JavaScript string အသစ်တစ်ခုကို property key အဖြစ် သုံးဖို့ ရည်ရွယ်ထားရင် — JavaScript engines တစ်ချို့အတွက်ဆိုရင် — ဒီ section ထဲက functions တွေကို သုံးတာက ပိုပြီး ထိရောက်ပါလိမ့်မယ်။ မဟုတ်ရင် `napi_create_string_utf8` သို့မဟုတ် `node_api_create_external_string_utf8` series functions တွေကို သုံးပါ — အကြောင်းကတော့ property key creation methods တွေနဲ့ strings တွေကို ဖန်တီး/သိမ်းဆည်းရာမှာ overhead ထပ်ဆောင်း ရှိနိုင်လို့ပါ။

#### `node_api_create_property_key_latin1`

```c
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: ISO-8859-1 encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: Objects တွေအတွက် property key အဖြစ် သုံးဖို့ optimized လုပ်ထားတဲ့ JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က objects တွေအတွက် property key အဖြစ် သုံးရန် — ISO-8859-1-encoded C string တစ်ခုကနေ — optimized လုပ်ထားတဲ့ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။ `napi_create_string_latin1` နဲ့ မတူတဲ့ အချက်က — တူညီတဲ့ `str` pointer နဲ့ ဒီ function ကို နောက်ထပ် ခေါ်ယူမှုတွေက engine ပေါ် မူတည်ပြီး — တောင်းဆိုထားတဲ့ `napi_value` ဖန်တီးမှုမှာ မြန်ဆန်မှု (speedup) ရရှိနိုင်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_property_key_utf16`

```c
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: UTF16-LE encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို two-byte code units တွေနဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: Objects တွေအတွက် property key အဖြစ် သုံးဖို့ optimized လုပ်ထားတဲ့ JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က objects တွေအတွက် property key အဖြစ် သုံးရန် — UTF16-LE-encoded C string တစ်ခုကနေ — optimized လုပ်ထားတဲ့ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

#### `node_api_create_property_key_utf8`

```c
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] str`: UTF8 encoding နဲ့ ရေးထားတဲ့ string တစ်ခုကို ကိုယ်စားပြုတဲ့ character buffer ပါ။
* `[in] length`: String ရဲ့ အလျားကို two-byte code units တွေနဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[out] result`: Objects တွေအတွက် property key အဖြစ် သုံးဖို့ optimized လုပ်ထားတဲ့ JavaScript `string` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က objects တွေအတွက် property key အဖြစ် သုံးရန် — UTF8-encoded C string တစ်ခုကနေ — optimized လုပ်ထားတဲ့ JavaScript `string` value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Native string ကို copy လုပ်ပါတယ်။

JavaScript `string` type ကို ECMAScript Language Specification ရဲ့ [Section string type][] မှာ ဖော်ပြထားပါတယ်။

### Functions to convert from Node-API to C types (Node-API မှ C types များသို့ ပြောင်းလဲခြင်း functions များ)

#### `napi_get_array_length`

```c
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: အလျားကို မေးမြန်းခံနေရတဲ့ JavaScript `Array` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: Array ရဲ့ အလျားကို ကိုယ်စားပြုတဲ့ `uint32` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က array တစ်ခုရဲ့ အလျားကို ပြန်ပေးပါတယ်။

`Array` အလျားကို ECMAScript Language Specification ရဲ့ [Section Array instance length][] မှာ ဖော်ပြထားပါတယ်။

#### `napi_get_arraybuffer_info`

```c
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] arraybuffer`: မေးမြန်းခံနေရတဲ့ `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] data`: `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ရဲ့ underlying data buffer ပါ။ Length က `0` ဆိုရင် — ဒါက `NULL` သို့မဟုတ် အခြား pointer value တစ်ခုခု ဖြစ်နိုင်ပါတယ်။
* `[out] byte_length`: Underlying data buffer ရဲ့ bytes အလျားပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` တစ်ခုရဲ့ underlying data buffer နဲ့ ၎င်းရဲ့ length ကို ပြန်လည် ရယူဖို့ သုံးပါတယ်။

_WARNING_: ဒီ API ကို သုံးတဲ့အခါ သတိထားပါ။ Underlying data buffer ရဲ့ သက်တမ်းကို — ပြန်ပေးလိုက်ပြီးနောက်မှာတောင် — `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` က စီမံခန့်ခွဲပါတယ်။ ဒီ API ကို သုံးဖို့ ဘေးကင်းတဲ့ နည်းလမ်းတစ်ခုကတော့ — `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ရဲ့ သက်တမ်းအပေါ် ထိန်းချုပ်မှုကို အာမခံပေးနိုင်တဲ့ — [`napi_create_reference`][] နဲ့ တွဲဖက် သုံးခြင်းပါ။ GC တစ်ခုကို trigger လုပ်နိုင်တဲ့ တခြား APIs တွေဆီကို ခေါ်ယူမှု မရှိသရွေ့ — တူညီတဲ့ callback အတွင်းမှာ ပြန်ပေးလိုက်တဲ့ data buffer ကို သုံးတာကလည်း ဘေးကင်းပါတယ်။

#### `napi_get_buffer_info`

```c
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: မေးမြန်းခံနေရတဲ့ `node::Buffer` သို့မဟုတ် `Uint8Array` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] data`: `node::Buffer` သို့မဟုတ် `Uint8Array` ရဲ့ underlying data buffer ပါ။ Length က `0` ဆိုရင် — ဒါက `NULL` သို့မဟုတ် အခြား pointer value တစ်ခုခု ဖြစ်နိုင်ပါတယ်။
* `[out] length`: Underlying data buffer ရဲ့ bytes အလျားပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က [`napi_get_typedarray_info`][] နဲ့ တူညီတဲ့ `data` နဲ့ `byte_length` တို့ကို ပြန်ပေးပါတယ်။ [`napi_get_typedarray_info`][] ကလည်း value အဖြစ် `node::Buffer` (Uint8Array တစ်ခု) ကို လက်ခံပါတယ်။

ဤ API က `node::Buffer` တစ်ခုရဲ့ underlying data buffer နဲ့ ၎င်းရဲ့ length ကို ပြန်လည် ရယူဖို့ သုံးပါတယ်။

_Warning_: ဒီ API ကို သုံးတဲ့အခါ သတိထားပါ — underlying data buffer ရဲ့ သက်တမ်းကို VM က စီမံခန့်ခွဲနေရင် အာမခံချက် မရှိလို့ပါ။

#### `napi_get_prototype`

```c
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Prototype ကို ပြန်ပေးရမယ့် JavaScript `Object` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။ ဒါက `Object.getPrototypeOf` ရဲ့ ညီမျှရာ (equivalent) ကို ပြန်ပေးတာပါ — (function ရဲ့ `prototype` property နဲ့တော့ မတူပါဘူး)။
* `[out] result`: ပေးထားတဲ့ object ရဲ့ prototype ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

#### `napi_get_typedarray_info`

```c
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] typedarray`: Properties တွေကို မေးမြန်းရမယ့် `TypedArray` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] type`: `TypedArray` ထဲက elements တွေရဲ့ scalar datatype ပါ။
* `[out] length`: `TypedArray` ထဲမှာ ရှိတဲ့ elements အရေအတွက်ပါ။
* `[out] data`: `byte_offset` တန်ဖိုးနဲ့ ချိန်ညှိထားတဲ့ `TypedArray` ရဲ့ အောက်ခံ data buffer ပါ — ဒါကြောင့် ၎င်းက `TypedArray` ထဲက ပထမဆုံး element ကို ညွှန်ပြပါတယ်။ Array ရဲ့ length က `0` ဆိုရင် — ဒါက `NULL` သို့မဟုတ် အခြား pointer value တစ်ခုခု ဖြစ်နိုင်ပါတယ်။
* `[out] arraybuffer`: `TypedArray` ရဲ့ အောက်ခံ `ArrayBuffer` သို့မဟုတ် `SharedArrayBuffer` ပါ။
* `[out] byte_offset`: Underlying native array အတွင်းမှာ array ရဲ့ ပထမဆုံး element တည်ရှိနေတဲ့ byte offset ပါ။ `data` parameter ရဲ့ တန်ဖိုးကို — data က array ထဲက ပထမဆုံး element ကို ညွှန်ပြအောင် — ကြိုတင် ချိန်ညှိပြီးသား ဖြစ်ပါတယ်။ ဒါကြောင့် native array ရဲ့ ပထမဆုံး byte က `data - byte_offset` မှာ တည်ရှိပါလိမ့်မယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က typed array တစ်ခုရဲ့ properties အမျိုးမျိုးကို ပြန်ပေးပါတယ်။

Out parameters တွေထဲက ဘယ်ဟာမဆို — သက်ဆိုင်တဲ့ property မလိုအပ်ရင် — `NULL` ဖြစ်နိုင်ပါတယ်။

_Warning_: ဒီ API ကို သုံးတဲ့အခါ သတိထားပါ — underlying data buffer ကို VM က စီမံခန့်ခွဲနေလို့ပါ။

#### `napi_get_dataview_info`

```c
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] dataview`: Properties တွေကို မေးမြန်းရမယ့် `DataView` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] byte_length`: `DataView` ထဲက bytes အရေအတွက်ပါ။
* `[out] data`: `DataView` ရဲ့ အောက်ခံ data buffer ပါ။ byte\_length က `0` ဆိုရင် — ဒါက `NULL` သို့မဟုတ် အခြား pointer value တစ်ခုခု ဖြစ်နိုင်ပါတယ်။
* `[out] arraybuffer`: `DataView` ရဲ့ အောက်ခံ `ArrayBuffer` ပါ။
* `[out] byte_offset`: `DataView` ကို စတင် ရုပ်လုံးဖော်မယ့် (project) data buffer အတွင်းက byte offset ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

Out parameters တွေထဲက ဘယ်ဟာမဆို — သက်ဆိုင်တဲ့ property မလိုအပ်ရင် — `NULL` ဖြစ်နိုင်ပါတယ်။

ဤ API က `DataView` တစ်ခုရဲ့ properties အမျိုးမျိုးကို ပြန်ပေးပါတယ်။

#### `napi_get_date_value`

```c
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `Date` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: 1970 ခုနှစ် ဇန်နဝါရီလ 1 ရက်နေ့ 00:00 UTC ကနေ စတင် တိုင်းတာတဲ့ milliseconds တွေအနေနဲ့ ရှိတဲ့ — `double` time value ပါ။

ဒီ API က leap seconds (ရက်ပိုစက္ကန့်များ) တွေကို ထည့်တွက် မပေးပါဘူး — ECMAScript က POSIX time specification နဲ့ ကိုက်ညီနေလို့ ၎င်းတို့ကို လျစ်လျူရှုထားပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ `Date` မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_date_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `Date` ရဲ့ time value ကို C double primitive အနေနဲ့ ပြန်ပေးပါတယ်။

#### `napi_get_value_bool`

```c
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `Boolean` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `Boolean` နဲ့ ညီမျှတဲ့ C boolean primitive ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Boolean မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_boolean_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `Boolean` နဲ့ ညီမျှတဲ့ C boolean primitive ကို ပြန်ပေးပါတယ်။

#### `napi_get_value_double`

```c
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C double primitive ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Number မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_number_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C double primitive ကို ပြန်ပေးပါတယ်။

#### `napi_get_value_bigint_int64`

```c
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ
* `[in] value`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `BigInt` နဲ့ ညီမျှတဲ့ C `int64_t` primitive ပါ။
* `[out] lossless`: `BigInt` တန်ဖိုးကို ဆုံးရှုံးမှု မရှိပဲ (losslessly) ပြောင်းလဲနိုင်ခဲ့လားဆိုတာကို ဖော်ပြပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ `BigInt` မဟုတ်တဲ့ တန်ဖိုးတစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_bigint_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `BigInt` နဲ့ ညီမျှတဲ့ C `int64_t` primitive ကို ပြန်ပေးပါတယ်။ လိုအပ်ရင် တန်ဖိုးကို truncate (ဖြတ်တောက်) လုပ်ပြီး — `lossless` ကို `false` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။

#### `napi_get_value_bigint_uint64`

```c
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `BigInt` နဲ့ ညီမျှတဲ့ C `uint64_t` primitive ပါ။
* `[out] lossless`: `BigInt` တန်ဖိုးကို ဆုံးရှုံးမှု မရှိပဲ (losslessly) ပြောင်းလဲနိုင်ခဲ့လားဆိုတာကို ဖော်ပြပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ `BigInt` မဟုတ်တဲ့ တန်ဖိုးတစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_bigint_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `BigInt` နဲ့ ညီမျှတဲ့ C `uint64_t` primitive ကို ပြန်ပေးပါတယ်။ လိုအပ်ရင် တန်ဖိုးကို truncate (ဖြတ်တောက်) လုပ်ပြီး — `lossless` ကို `false` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။

#### `napi_get_value_bigint_words`

```c
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `BigInt` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] sign_bit`: JavaScript `BigInt` က positive လား negative လားဆိုတာကို ကိုယ်စားပြုတဲ့ integer ပါ။
* `[in/out] word_count`: `words` array ရဲ့ length နဲ့ initialize လုပ်ထားရပါမယ်။ ပြန်လာတဲ့အခါ — ဒီ `BigInt` ကို သိမ်းဆည်းဖို့ လိုအပ်မယ့် တကယ့် words အရေအတွက်အဖြစ် သတ်မှတ်ပေးပါလိမ့်မယ်။
* `[out] words`: ကြိုတင် ခွဲဝေထားတဲ့ (pre-allocated) 64-bit word array တစ်ခုဆီကို ညွှန်ပြတဲ့ pointer ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `BigInt` value တစ်ခုတည်းကို sign bit, 64-bit little-endian array နဲ့ array ထဲက elements အရေအတွက် အဖြစ် ပြောင်းလဲပေးပါတယ်။ `word_count` တစ်ခုတည်းကိုသာ ရယူချင်ရင် — `sign_bit` နဲ့ `words` နှစ်ခုလုံးကို `NULL` အဖြစ် သတ်မှတ်နိုင်ပါတယ်။

#### `napi_get_value_external`

```c
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript external value ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: JavaScript external value က ထုပ်ပိုးထားတဲ့ (wrapped) data ဆီကို ညွှန်ပြတဲ့ pointer ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ External မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_invalid_arg` ကို ပြန်ပေးပါတယ်။

ဤ API က အရင်က `napi_create_external()` ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ external data pointer ကို ပြန်လည် ရယူပေးပါတယ်။

#### `napi_get_value_int32`

```c
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C `int32` primitive ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Number မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_number_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C `int32` primitive ကို ပြန်ပေးပါတယ်။

Number က 32-bit integer ရဲ့ range ကို ကျော်လွန်နေရင် — ရလဒ်ကို အောက်ဆုံး 32 bits တွေရဲ့ ညီမျှရာအဖြစ် truncate လုပ်ပါတယ်။ ဒါကြောင့် value က > 231 - 1 ဆိုရင် — ကြီးမားတဲ့ positive number တစ်ခုက negative number တစ်ခု ဖြစ်သွားနိုင်ပါတယ်။

Finite မဟုတ်တဲ့ (non-finite) number values တွေ (`NaN`, `+Infinity`, သို့မဟုတ် `-Infinity`) က result ကို zero အဖြစ် သတ်မှတ်ပါတယ်။

#### `napi_get_value_int64`

```c
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C `int64` primitive ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Number မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_number_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ JavaScript `number` နဲ့ ညီမျှတဲ့ C `int64` primitive ကို ပြန်ပေးပါတယ်။

[`Number.MIN_SAFE_INTEGER`][] `-(2**53 - 1)` နဲ့ [`Number.MAX_SAFE_INTEGER`][] `(2**53 - 1)` ကြားက range ရဲ့ အပြင်ဘက်က `number` values တွေက precision ဆုံးရှုံးသွားပါလိမ့်မယ်။

Finite မဟုတ်တဲ့ (non-finite) number values တွေ (`NaN`, `+Infinity`, သို့မဟုတ် `-Infinity`) က result ကို zero အဖြစ် သတ်မှတ်ပါတယ်။

#### `napi_get_value_string_latin1`

```c
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript string တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] buf`: ISO-8859-1-encoded string ကို ရေးသွင်းရမယ့် buffer ပါ။ `NULL` ကို ဖြတ်သန်းလိုက်ရင် — null terminator ကလွဲပြီး — string ရဲ့ bytes အလျားကို `result` ထဲမှာ ပြန်ပေးပါတယ်။
* `[in] bufsize`: Destination buffer ရဲ့ အရွယ်အစားပါ။ ဒီတန်ဖိုး မလုံလောက်တဲ့အခါ — ပြန်ပေးလိုက်တဲ့ string ကို truncate လုပ်ပြီး null-terminated လုပ်ပါတယ်။ ဒီတန်ဖိုးက zero ဖြစ်နေရင် — string ကို ပြန်မပေးပဲ buffer ကို ဘာမှ ပြောင်းလဲမှု မရှိပါဘူး။
* `[out] result`: Buffer ထဲကို copy လုပ်လိုက်တဲ့ bytes အရေအတွက်ပါ — null terminator ကလွဲပြီး။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ String မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_string_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ value နဲ့ ကိုက်ညီတဲ့ ISO-8859-1-encoded string ကို ပြန်ပေးပါတယ်။

#### `napi_get_value_string_utf8`

```c
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript string တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] buf`: UTF8-encoded string ကို ရေးသွင်းရမယ့် buffer ပါ။ `NULL` ကို ဖြတ်သန်းလိုက်ရင် — null terminator ကလွဲပြီး — string ရဲ့ bytes အလျားကို `result` ထဲမှာ ပြန်ပေးပါတယ်။
* `[in] bufsize`: Destination buffer ရဲ့ အရွယ်အစားပါ။ ဒီတန်ဖိုး မလုံလောက်တဲ့အခါ — ပြန်ပေးလိုက်တဲ့ string ကို truncate လုပ်ပြီး null-terminated လုပ်ပါတယ်။ ဒီတန်ဖိုးက zero ဖြစ်နေရင် — string ကို ပြန်မပေးပဲ buffer ကို ဘာမှ ပြောင်းလဲမှု မရှိပါဘူး။
* `[out] result`: Buffer ထဲကို copy လုပ်လိုက်တဲ့ bytes အရေအတွက်ပါ — null terminator ကလွဲပြီး။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ String မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_string_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ value နဲ့ ကိုက်ညီတဲ့ UTF8-encoded string ကို ပြန်ပေးပါတယ်။

#### `napi_get_value_string_utf16`

```c
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript string တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] buf`: UTF16-LE-encoded string ကို ရေးသွင်းရမယ့် buffer ပါ။ `NULL` ကို ဖြတ်သန်းလိုက်ရင် — null terminator ကလွဲပြီး — string ရဲ့ 2-byte code units အလျားကို ပြန်ပေးပါတယ်။
* `[in] bufsize`: Destination buffer ရဲ့ အရွယ်အစားပါ။ ဒီတန်ဖိုး မလုံလောက်တဲ့အခါ — ပြန်ပေးလိုက်တဲ့ string ကို truncate လုပ်ပြီး null-terminated လုပ်ပါတယ်။ ဒီတန်ဖိုးက zero ဖြစ်နေရင် — string ကို ပြန်မပေးပဲ buffer ကို ဘာမှ ပြောင်းလဲမှု မရှိပါဘူး။
* `[out] result`: Buffer ထဲကို copy လုပ်လိုက်တဲ့ 2-byte code units အရေအတွက်ပါ — null terminator ကလွဲပြီး။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ String မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_string_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ value နဲ့ ကိုက်ညီတဲ့ UTF16-encoded string ကို ပြန်ပေးပါတယ်။

#### `napi_get_value_uint32`

```c
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: JavaScript `number` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` နဲ့ ညီမျှတဲ့ — `uint32_t` အနေနဲ့ — C primitive ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Number မဟုတ်တဲ့ `napi_value` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_number_expected` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ `napi_value` နဲ့ ညီမျှတဲ့ — `uint32_t` အနေနဲ့ — C primitive ကို ပြန်ပေးပါတယ်။

### Functions to get global instances (global instances များ ရယူခြင်း functions များ)

#### `napi_get_boolean`

```c
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: ပြန်လည် ရယူရမယ့် boolean ရဲ့ တန်ဖိုးပါ။
* `[out] result`: ပြန်လည် ရယူရမယ့် JavaScript `Boolean` singleton ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ပေးထားတဲ့ boolean တန်ဖိုးကို ကိုယ်စားပြုဖို့ သုံးတဲ့ JavaScript singleton object ကို ပြန်ပေးပါတယ်။

#### `napi_get_global`

```c
napi_status napi_get_global(napi_env env, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: JavaScript `global` object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `global` object ကို ပြန်ပေးပါတယ်။

#### `napi_get_null`

```c
napi_status napi_get_null(napi_env env, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: JavaScript `null` object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က `null` object ကို ပြန်ပေးပါတယ်။

#### `napi_get_undefined`

```c
napi_status napi_get_undefined(napi_env env, napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: JavaScript Undefined value ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က Undefined object ကို ပြန်ပေးပါတယ်။

## Working with JavaScript values and abstract operations (JavaScript values များနှင့် abstract operations များ လုပ်ဆောင်ခြင်း)

Node-API က JavaScript values တွေအပေါ်မှာ abstract operations (စိတ္တဇ လုပ်ဆောင်ချက်များ) တစ်ချို့ကို လုပ်ဆောင်ဖို့ API အစုတစ်ခုကို ထုတ်ဖော် ပေးထားပါတယ်။ ဒီ APIs တွေက အောက်ပါတို့ထဲက တစ်ခုခုကို လုပ်ဆောင်နိုင်စေပါတယ်:

1. JavaScript values တွေကို တိကျတဲ့ JavaScript types (ဥပမာ `number` သို့မဟုတ် `string`) တွေအဖြစ် coerce လုပ်ခြင်း။
2. JavaScript value တစ်ခုရဲ့ type ကို စစ်ဆေးခြင်း။
3. JavaScript values နှစ်ခုကြားမှာ တူညီမှု (equality) ရှိမရှိ စစ်ဆေးခြင်း။

### `napi_coerce_to_bool`

```c
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Coerce လုပ်ရမယ့် JavaScript value ပါ။
* `[out] result`: Coerce လုပ်ပြီးသား JavaScript `Boolean` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section ToBoolean][] မှာ သတ်မှတ်ထားတဲ့ `ToBoolean()` abstract operation ကို အကောင်အထည်ဖော်ပေးပါတယ်။

### `napi_coerce_to_number`

```c
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Coerce လုပ်ရမယ့် JavaScript value ပါ။
* `[out] result`: Coerce လုပ်ပြီးသား JavaScript `number` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section ToNumber][] မှာ သတ်မှတ်ထားတဲ့ `ToNumber()` abstract operation ကို အကောင်အထည်ဖော်ပေးပါတယ်။ ဖြတ်သန်းလိုက်တဲ့ value က object တစ်ခုဆိုရင် — ဒီ function က JS code တွေကို run လုပ်နိုင်ပါတယ်။

### `napi_coerce_to_object`

```c
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Coerce လုပ်ရမယ့် JavaScript value ပါ။
* `[out] result`: Coerce လုပ်ပြီးသား JavaScript `Object` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section ToObject][] မှာ သတ်မှတ်ထားတဲ့ `ToObject()` abstract operation ကို အကောင်အထည်ဖော်ပေးပါတယ်။

### `napi_coerce_to_string`

```c
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Coerce လုပ်ရမယ့် JavaScript value ပါ။
* `[out] result`: Coerce လုပ်ပြီးသား JavaScript `string` ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section ToString][] မှာ သတ်မှတ်ထားတဲ့ `ToString()` abstract operation ကို အကောင်အထည်ဖော်ပေးပါတယ်။ ဖြတ်သန်းလိုက်တဲ့ value က object တစ်ခုဆိုရင် — ဒီ function က JS code တွေကို run လုပ်နိုင်ပါတယ်။

### `napi_typeof`

```c
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: Type ကို မေးမြန်းရမယ့် JavaScript value ပါ။
* `[out] result`: JavaScript value ရဲ့ type ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

* `value` ရဲ့ type က သိထားတဲ့ (known) ECMAScript type တစ်ခု မဟုတ်ဘဲ `value` က External value တစ်ခုလည်း မဟုတ်ဘူးဆိုရင် `napi_invalid_arg` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section typeof operator][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း object အပေါ်မှာ `typeof` Operator ကို ခေါ်ယူတာနဲ့ ဆင်တူတဲ့ အပြုအမူကို ကိုယ်စားပြုပါတယ်။ ဒါပေမယ့် ကွဲပြားချက်တွေ ရှိပါတယ်:

1. External value တစ်ခုကို ရှာဖွေ သိရှိနိုင်တဲ့ ပံ့ပိုးမှု ပါဝင်ပါတယ်။
2. `null` ကို သီးခြား type တစ်ခုအနေနဲ့ သိရှိပါတယ် — ECMAScript ရဲ့ `typeof` ကတော့ `object` အဖြစ် သိရှိမှာ ဖြစ်ပါတယ်။

`value` ရဲ့ type က တရားမဝင် (invalid) ဖြစ်နေရင် error တစ်ခုကို ပြန်ပေးပါတယ်။

### `napi_instanceof`

```c
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[in] constructor`: စစ်ဆေးရမယ့် constructor function ရဲ့ JavaScript function object ပါ။
* `[out] result`: `object instanceof constructor` က true ဖြစ်ရင် true အဖြစ် သတ်မှတ်ပေးတဲ့ boolean ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section instanceof operator][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း object အပေါ်မှာ `instanceof` Operator ကို ခေါ်ယူတာကို ကိုယ်စားပြုပါတယ်။

### `napi_is_array`

```c
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ object က array တစ်ခု ဟုတ်မဟုတ်ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section IsArray][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း object အပေါ်မှာ `IsArray` operation ကို ခေါ်ယူတာကို ကိုယ်စားပြုပါတယ်။

### `napi_is_arraybuffer`

```c
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ object က `ArrayBuffer` တစ်ခု ဟုတ်မဟုတ်ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က array buffer တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `napi_is_buffer`

```c
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က `node::Buffer` သို့မဟုတ် `Uint8Array` object တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က buffer သို့မဟုတ် Uint8Array ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။ Caller က value က Uint8Array ဟုတ်မဟုတ် စစ်ဆေးဖို့ လိုအပ်ရင် [`napi_is_typedarray`][] ကို ဦးစားပေး သုံးသင့်ပါတယ်။

### `napi_is_date`

```c
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က JavaScript `Date` object တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က date တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `napi_is_error`

```c
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က `Error` object တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က `Error` တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `napi_is_typedarray`

```c
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က `TypedArray` တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က typed array တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `napi_is_dataview`

```c
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က `DataView` တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ `Object` က `DataView` တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `napi_strict_equals`

```c
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] lhs`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[in] rhs`: ဆန့်ကျင်ဘက်အနေနဲ့ စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: `napi_value` objects နှစ်ခု တူညီမှု ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section IsStrictlyEqual][] မှာ သတ်မှတ်ထားတဲ့ Strict Equality algorithm ကို ခေါ်ယူတာကို ကိုယ်စားပြုပါတယ်။

### `napi_detach_arraybuffer`

```c
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] arraybuffer`: Detach (ခွာထုတ်) လုပ်ရမယ့် JavaScript `ArrayBuffer` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။ Detach လုပ်လို့ မရတဲ့ `ArrayBuffer` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `napi_detachable_arraybuffer_expected` ကို ပြန်ပေးပါတယ်။

ယေဘုယျအားဖြင့် — `ArrayBuffer` တစ်ခုက အရင်က detach လုပ်ခဲ့ဖူးရင် — non-detachable ဖြစ်ပါတယ်။ `ArrayBuffer` တစ်ခု detachable ဟုတ်မဟုတ်အပေါ် engine က နောက်ထပ် အခြေအနေတွေကိုပါ ချမှတ်နိုင်ပါတယ်။ ဥပမာ — V8 က `ArrayBuffer` က external ဖြစ်ရမယ် — ဆိုလိုတာက [`napi_create_external_arraybuffer`][] နဲ့ ဖန်တီးထားရမယ် — လို့ လိုအပ်ပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section detachArrayBuffer][] မှာ သတ်မှတ်ထားတဲ့ `ArrayBuffer` detach operation ကို ခေါ်ယူတာကို ကိုယ်စားပြုပါတယ်။

### `napi_is_detached_arraybuffer`

```c
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] arraybuffer`: စစ်ဆေးရမယ့် JavaScript `ArrayBuffer` ပါ။
* `[out] result`: `arraybuffer` က detached ဖြစ်မဖြစ်ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`ArrayBuffer` ရဲ့ internal data က `null` ဖြစ်နေရင် ၎င်းကို detached အဖြစ် မှတ်ယူပါတယ်။

ဤ API က ECMAScript Language Specification ရဲ့ [Section isDetachedBuffer][] မှာ သတ်မှတ်ထားတဲ့ `ArrayBuffer` ရဲ့ `IsDetachedBuffer` operation ကို ခေါ်ယူတာကို ကိုယ်စားပြုပါတယ်။

### `node_api_is_sharedarraybuffer`

> Stability: 1 - Experimental

```c
napi_status node_api_is_sharedarraybuffer(napi_env env, napi_value value, bool* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် JavaScript value ပါ။
* `[out] result`: ပေးထားတဲ့ `napi_value` က `SharedArrayBuffer` တစ်ခုကို ကိုယ်စားပြုခြင်း ရှိမရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က ဖြတ်သန်းလိုက်တဲ့ Object က `SharedArrayBuffer` တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးပါတယ်။

### `node_api_create_sharedarraybuffer`

> Stability: 1 - Experimental

```c
napi_status node_api_create_sharedarraybuffer(napi_env env,
                                             size_t byte_length,
                                             void** data,
                                             napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] byte_length`: ဖန်တီးရမယ့် shared array buffer ရဲ့ bytes အလျားပါ။
* `[out] data`: `SharedArrayBuffer` ရဲ့ underlying byte buffer ဆီကို ညွှန်ပြတဲ့ pointer ပါ။ `data` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] result`: JavaScript `SharedArrayBuffer` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဤ API က JavaScript `SharedArrayBuffer` တစ်ခုနဲ့ ကိုက်ညီတဲ့ Node-API value တစ်ခုကို ပြန်ပေးပါတယ်။ `SharedArrayBuffer` တွေကို workers အများအပြားကြားမှာ မျှဝေ သုံးစွဲနိုင်တဲ့ — fixed-length binary data buffers တွေကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။

ခွဲဝေပေးလိုက်တဲ့ `SharedArrayBuffer` မှာ — ဖြတ်သန်းလိုက်တဲ့ `byte_length` parameter က အရွယ်အစားကို ဆုံးဖြတ်ပေးတဲ့ — underlying byte buffer တစ်ခု ပါဝင်ပါလိမ့်မယ်။ Caller က buffer ကို တိုက်ရိုက် ကိုင်တွယ်ချင်တဲ့ အခြေအနေမျိုးအတွက် — underlying buffer ကို caller ဆီ optional အနေနဲ့ ပြန်ပေးပါတယ်။ ဒီ buffer ကို native code ကနေသာ တိုက်ရိုက် ရေးသားလို့ ရပါတယ်။ JavaScript ကနေ ဒီ buffer ကို ရေးသားဖို့ဆိုရင် — typed array သို့မဟုတ် `DataView` object တစ်ခုကို ဖန်တီးပေးရပါမယ်။

JavaScript `SharedArrayBuffer` objects တွေကို ECMAScript Language Specification ရဲ့ [Section SharedArrayBuffer objects][] မှာ ဖော်ပြထားပါတယ်။
## Working with JavaScript properties (JavaScript properties များနှင့် အလုပ်လုပ်ခြင်း)

Node-API က JavaScript objects တွေပေါ်မှာ properties တွေကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်းအတွက် API အစုတစ်ခုကို ထုတ်ဖော်ပေးပါတယ်။

JavaScript မှာ properties တွေကို key နဲ့ value တစ်စုံ (tuple) အနေနဲ့ ကိုယ်စားပြုပါတယ်။ အခြေခံအားဖြင့် — Node-API ထဲက property keys တွေ အားလုံးကို အောက်ပါ ပုံစံတွေထဲက တစ်ခုနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်:

* Named (နာမည်ဖြင့်): UTF8 နဲ့ encode လုပ်ထားတဲ့ ရိုးရှင်းတဲ့ string တစ်ခုပါ။
* Integer-Indexed (ကိန်းပြည့် အညွှန်းဖြင့်): `uint32_t` နဲ့ ကိုယ်စားပြုထားတဲ့ index တန်ဖိုးတစ်ခုပါ။
* JavaScript value (JavaScript တန်ဖိုးဖြင့်): ဒါတွေကို Node-API မှာ `napi_value` နဲ့ ကိုယ်စားပြုပါတယ်။ ဒါက `string`, `number` (သို့) `symbol` တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` တစ်ခု ဖြစ်နိုင်ပါတယ်။

Node-API values တွေကို `napi_value` ဆိုတဲ့ type နဲ့ ကိုယ်စားပြုပါတယ်။ JavaScript value တစ်ခု လိုအပ်တဲ့ Node-API call တိုင်းက `napi_value` တစ်ခုကို လက်ခံပါတယ်။ ဒါပေမယ့် — ပြောနေတဲ့ (in question) `napi_value` က API က မျှော်လင့်ထားတဲ့ JavaScript type နဲ့ ကိုက်ညီကြောင်း သေချာစေဖို့ကတော့ — caller ရဲ့ တာဝန် ဖြစ်ပါတယ်။

ဒီ section မှာ မှတ်တမ်းတင်ထားတဲ့ APIs တွေက — `napi_value` နဲ့ ကိုယ်စားပြုထားတဲ့ မည်သည့် JavaScript objects ပေါ်မဆို — properties တွေကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်းအတွက် ရိုးရှင်းတဲ့ interface တစ်ခုကို ပေးပါတယ်။

ဥပမာအနေနဲ့ အောက်က JavaScript code snippet ကို ကြည့်ပါ:

```js
const obj = {};
obj.myProp = 123;
```

ဒါနဲ့ ညီမျှတာကို Node-API values တွေကို သုံးပြီး အောက်က snippet နဲ့ လုပ်ဆောင်နိုင်ပါတယ်:

```c
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```

Indexed properties တွေကိုလည်း အလားတူ နည်းလမ်းနဲ့ သတ်မှတ်နိုင်ပါတယ်။ အောက်က JavaScript snippet ကို ကြည့်ပါ:

```js
const arr = [];
arr[123] = 'hello';
```

ဒါနဲ့ ညီမျှတာကို Node-API values တွေကို သုံးပြီး အောက်က snippet နဲ့ လုပ်ဆောင်နိုင်ပါတယ်:

```c
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```

Properties တွေကို ဒီ section မှာ ဖော်ပြထားတဲ့ APIs တွေကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။ အောက်က JavaScript snippet ကို ကြည့်ပါ:

```js
const arr = [];
const value = arr[123];
```

အောက်မှာက ဒါနဲ့ အနီးစပ်ဆုံး ညီမျှတဲ့ Node-API ဘက်က code (counterpart) ပါ:

```c
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```

နောက်ဆုံးအနေနဲ့ — performance (စွမ်းဆောင်ရည်) အကြောင်းပြချက်တွေကြောင့် — object တစ်ခုပေါ်မှာ properties အများအပြားကိုလည်း တစ်ပြိုင်နက် define လုပ်နိုင်ပါတယ်။ အောက်က JavaScript ကို ကြည့်ပါ:

```js
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```

အောက်မှာက ဒါနဲ့ အနီးစပ်ဆုံး ညီမျှတဲ့ Node-API ဘက်က code (counterpart) ပါ:

```c
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### Structures (struct များ)

#### `napi_property_attributes`

```c
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Used with napi_define_class to distinguish static properties
  // from instance properties. Ignored by napi_define_properties.
  napi_static = 1 << 10,

  // Default for class methods.
  napi_default_method = napi_writable | napi_configurable,

  // Default for object properties, like in JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```

`napi_property_attributes` တွေက — JavaScript object တစ်ခုပေါ်မှာ သတ်မှတ်ထားတဲ့ properties တွေရဲ့ အပြုအမူကို ထိန်းချုပ်ဖို့ သုံးတဲ့ bit flags တွေပါ။ `napi_static` ကလွဲလို့ — ကျန်တဲ့ဟာတွေက [ECMAScript Language Specification][] ရဲ့ [Section property attributes][] မှာ ဖော်ပြထားတဲ့ attributes တွေနဲ့ ကိုက်ညီပါတယ်။ ၎င်းတို့က အောက်ပါ bit flags တွေထဲက တစ်ခု (သို့) တစ်ခုထက်ပိုတာ ဖြစ်နိုင်ပါတယ်:

* `napi_default`: Property ပေါ်မှာ ထင်ရှားတဲ့ (explicit) attributes တွေ ဘာမှ သတ်မှတ်မထားပါဘူး။ Default အနေနဲ့ property က read only ဖြစ်ပြီး — enumerable မဟုတ်သလို configurable လည်း မဟုတ်ပါဘူး။
* `napi_writable`: Property က writable (ရေးသားလို့ရသော) ဖြစ်ပါတယ်။
* `napi_enumerable`: Property က enumerable (စာရင်းကောက်လို့ရသော) ဖြစ်ပါတယ်။
* `napi_configurable`: Property က — [ECMAScript Language Specification][] ရဲ့ [Section property attributes][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း — configurable (ပြင်ဆင်လို့ရသော) ဖြစ်ပါတယ်။
* `napi_static`: Property ကို — default ဖြစ်တဲ့ instance property အနေနဲ့ မဟုတ်ဘဲ — class ပေါ်မှာ static property အနေနဲ့ သတ်မှတ်ပါလိမ့်မယ်။ ဒါကို [`napi_define_class`][] ကသာ သုံးပြီး — `napi_define_properties` ကတော့ လျစ်လျူရှုပါတယ်။
* `napi_default_method`: JS class ထဲက method တစ်ခုလိုပဲ — property က configurable နဲ့ writable ဖြစ်ပေမယ့် — enumerable တော့ မဟုတ်ပါဘူး။
* `napi_default_jsproperty`: JavaScript မှာ assignment (တန်ဖိုး သတ်မှတ်ခြင်း) ကနေ သတ်မှတ်လိုက်တဲ့ property တစ်ခုလိုပဲ — property က writable, enumerable နဲ့ configurable ဖြစ်ပါတယ်။

#### `napi_property_descriptor`

```c
typedef struct {
  // One of utf8name or name should be NULL.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```

* `utf8name`: Optional — property ရဲ့ key ကို ဖော်ပြတဲ့ string ဖြစ်ပြီး — UTF8 နဲ့ encode လုပ်ထားပါတယ်။ Property အတွက် `utf8name` (သို့) `name` နှစ်ခုအနက် တစ်ခုကို ပေးရပါမယ်။
* `name`: Optional — property ရဲ့ key အဖြစ် သုံးမယ့် JavaScript string (သို့) symbol တစ်ခုကို ညွှန်ပြတဲ့ `napi_value` ပါ။ Property အတွက် `utf8name` (သို့) `name` နှစ်ခုအနက် တစ်ခုကို ပေးရပါမယ်။
* `value`: Property က data property ဖြစ်နေရင် — property ရဲ့ get access (ဖတ်ယူမှု) ကနေ ပြန်လည် ရယူရတဲ့ တန်ဖိုးပါ။ ဒါကို ဖြတ်သန်းပေးလိုက်ရင် — `getter`, `setter`, `method` နဲ့ `data` တွေကို `NULL` အဖြစ် သတ်မှတ်ထားပါ (ဒီ members တွေကို သုံးမှာ မဟုတ်လို့ပါ)။
* `getter`: Property ရဲ့ get access ကို လုပ်ဆောင်တဲ့အခါ ခေါ်ယူရမယ့် function ပါ။ ဒါကို ဖြတ်သန်းပေးလိုက်ရင် — `value` နဲ့ `method` တွေကို `NULL` အဖြစ် သတ်မှတ်ထားပါ (ဒီ members တွေကို သုံးမှာ မဟုတ်လို့ပါ)။ Property ကို JavaScript code ကနေ ဝင်ရောက် အသုံးပြုတဲ့အခါ (သို့) Node-API call တစ်ခုကို သုံးပြီး property ပေါ်မှာ get တစ်ခု လုပ်ဆောင်တဲ့အခါ — ပေးထားတဲ့ function ကို runtime က သွယ်ဝိုက်၍ (implicitly) ခေါ်ယူပါတယ်။ [`napi_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `setter`: Property ရဲ့ set access (ရေးသွင်းမှု) ကို လုပ်ဆောင်တဲ့အခါ ခေါ်ယူရမယ့် function ပါ။ ဒါကို ဖြတ်သန်းပေးလိုက်ရင် — `value` နဲ့ `method` တွေကို `NULL` အဖြစ် သတ်မှတ်ထားပါ (ဒီ members တွေကို သုံးမှာ မဟုတ်လို့ပါ)။ Property ကို JavaScript code ကနေ သတ်မှတ်တဲ့အခါ (သို့) Node-API call တစ်ခုကို သုံးပြီး property ပေါ်မှာ set တစ်ခု လုပ်ဆောင်တဲ့အခါ — ပေးထားတဲ့ function ကို runtime က သွယ်ဝိုက်၍ ခေါ်ယူပါတယ်။ [`napi_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `method`: Property descriptor object ရဲ့ `value` property ကို — `method` နဲ့ ကိုယ်စားပြုထားတဲ့ JavaScript function တစ်ခု ဖြစ်စေဖို့ ဒါကို သတ်မှတ်ပေးပါ။ ဒါကို ဖြတ်သန်းပေးလိုက်ရင် — `value`, `getter` နဲ့ `setter` တွေကို `NULL` အဖြစ် သတ်မှတ်ထားပါ (ဒီ members တွေကို သုံးမှာ မဟုတ်လို့ပါ)။ [`napi_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `attributes`: အဲဒီ property နဲ့ ဆက်စပ်နေတဲ့ attributes တွေပါ။ [`napi_property_attributes`][] ကို ကြည့်ပါ။
* `data`: ဒီ function ကို ခေါ်ယူခံရတဲ့အခါ — `method`, `getter` နဲ့ `setter` တွေဆီကို ဖြတ်သန်းပေးတဲ့ callback data ပါ။

### Functions (လုပ်ဆောင်ချက်များ)

#### `napi_get_property_names`

```c
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Properties တွေကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[out] result`: Object ရဲ့ property names တွေကို ကိုယ်စားပြုတဲ့ JavaScript values တွေရဲ့ array တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။ `result` ကို [`napi_get_array_length`][] နဲ့ [`napi_get_element`][] ကို သုံးပြီး iterate (တစ်ခုပြီးတစ်ခု ဖြတ်သန်း) လုပ်နိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `object` ရဲ့ enumerable properties တွေရဲ့ နာမည်တွေကို strings တွေရဲ့ array အနေနဲ့ ပြန်ပေးပါတယ်။ `object` ရဲ့ key က symbol ဖြစ်နေတဲ့ properties တွေကတော့ မပါဝင်ပါဘူး။

#### `napi_get_all_property_names`

```c
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Properties တွေကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[in] key_mode`: Prototype properties တွေကိုပါ ပြန်လည် ရယူမလားဆိုတာပါ။
* `[in] key_filter`: ဘယ် properties တွေကို ပြန်လည် ရယူမလဲဆိုတာပါ (enumerable/readable/writable)။
* `[in] key_conversion`: နံပါတ်စဉ် တပ်ထားတဲ့ (numbered) property keys တွေကို strings တွေအဖြစ် ပြောင်းလဲပေးမလားဆိုတာပါ။
* `[out] result`: Object ရဲ့ property names တွေကို ကိုယ်စားပြုတဲ့ JavaScript values တွေရဲ့ array တစ်ခုကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။ `result` ကို iterate လုပ်ဖို့ [`napi_get_array_length`][] နဲ့ [`napi_get_element`][] ကို သုံးနိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဒီ object ရဲ့ ရရှိနိုင်တဲ့ properties တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

#### `napi_set_property`

```c
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Property ကို သတ်မှတ်ပေးမယ့် object ပါ။
* `[in] key`: သတ်မှတ်ပေးရမယ့် property ရဲ့ နာမည်ပါ။
* `[in] value`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` ပေါ်မှာ property တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

#### `napi_get_property`

```c
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Property ကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[in] key`: ပြန်လည် ရယူရမယ့် property ရဲ့ နာမည်ပါ။
* `[out] result`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` ကနေ တောင်းဆိုထားတဲ့ property ကို ရယူပါတယ်။

#### `napi_has_property`

```c
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] key`: တည်ရှိမှု စစ်ဆေးရမယ့် property ရဲ့ နာမည်ပါ။
* `[out] result`: Property က object ပေါ်မှာ ရှိ/မရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` မှာ အမည်ပေးထားတဲ့ property ရှိ/မရှိကို စစ်ဆေးပါတယ်။

#### `napi_delete_property`

```c
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] key`: ဖျက်ပစ်ရမယ့် property ရဲ့ နာမည်ပါ။
* `[out] result`: Property ဖျက်ခြင်း အောင်မြင်ခဲ့လား မအောင်မြင်ခဲ့လားပါ။ `result` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `object` ကနေ `key` ရဲ့ own property (ကိုယ်ပိုင် property) ကို ဖျက်ပစ်ဖို့ ကြိုးစားပါတယ်။

#### `napi_has_own_property`

```c
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] key`: တည်ရှိမှု စစ်ဆေးရမယ့် own property (ကိုယ်ပိုင် property) ရဲ့ နာမည်ပါ။
* `[out] result`: Own property က object ပေါ်မှာ ရှိ/မရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` မှာ အမည်ပေးထားတဲ့ own property ရှိ/မရှိကို စစ်ဆေးပါတယ်။ `key` က `string` (သို့) `symbol` ဖြစ်ရပါမယ် — မဟုတ်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ Node-API က data types တွေကြားမှာ ဘယ် conversion ကိုမှ လုပ်ဆောင်ပေးမှာ မဟုတ်ပါဘူး။

#### `napi_set_named_property`

```c
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Property ကို သတ်မှတ်ပေးမယ့် object ပါ။
* `[in] utf8Name`: သတ်မှတ်ပေးရမယ့် property ရဲ့ နာမည်ပါ။
* `[in] value`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က — `utf8Name` အနေနဲ့ ဖြတ်သန်းပေးလိုက်တဲ့ string ကနေ ဖန်တီးထားတဲ့ `napi_value` တစ်ခုနဲ့ — [`napi_set_property`][] ကို ခေါ်ယူတာနဲ့ ညီမျှပါတယ်။

#### `napi_get_named_property`

```c
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Property ကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[in] utf8Name`: ရယူရမယ့် property ရဲ့ နာမည်ပါ။
* `[out] result`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က — `utf8Name` အနေနဲ့ ဖြတ်သန်းပေးလိုက်တဲ့ string ကနေ ဖန်တီးထားတဲ့ `napi_value` တစ်ခုနဲ့ — [`napi_get_property`][] ကို ခေါ်ယူတာနဲ့ ညီမျှပါတယ်။

#### `napi_has_named_property`

```c
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] utf8Name`: တည်ရှိမှု စစ်ဆေးရမယ့် property ရဲ့ နာမည်ပါ။
* `[out] result`: Property က object ပေါ်မှာ ရှိ/မရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က — `utf8Name` အနေနဲ့ ဖြတ်သန်းပေးလိုက်တဲ့ string ကနေ ဖန်တီးထားတဲ့ `napi_value` တစ်ခုနဲ့ — [`napi_has_property`][] ကို ခေါ်ယူတာနဲ့ ညီမျှပါတယ်။

#### `napi_set_element`

```c
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Element တွေကို သတ်မှတ်ပေးမယ့် object ပါ။
* `[in] index`: သတ်မှတ်ပေးရမယ့် property ရဲ့ index ပါ။
* `[in] value`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` ပေါ်မှာ element တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

#### `napi_get_element`

```c
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Property ကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[in] index`: ရယူရမယ့် property ရဲ့ index ပါ။
* `[out] result`: Property ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က တောင်းဆိုထားတဲ့ index မှာရှိတဲ့ element ကို ရယူပါတယ်။

#### `napi_has_element`

```c
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] index`: တည်ရှိမှု စစ်ဆေးရမယ့် property ရဲ့ index ပါ။
* `[out] result`: Property က object ပေါ်မှာ ရှိ/မရှိပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` မှာ တောင်းဆိုထားတဲ့ index မှာ element တစ်ခု ရှိ/မရှိကို ပြန်ပေးပါတယ်။

#### `napi_delete_element`

```c
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: စစ်ဆေးမေးမြန်းရမယ့် object ပါ။
* `[in] index`: ဖျက်ပစ်ရမယ့် property ရဲ့ index ပါ။
* `[out] result`: Element ဖျက်ခြင်း အောင်မြင်ခဲ့လား မအောင်မြင်ခဲ့လားပါ။ `result` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က `object` ကနေ သတ်မှတ်ထားတဲ့ `index` ကို ဖျက်ပစ်ဖို့ ကြိုးစားပါတယ်။

#### `napi_define_properties`

```c
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Properties တွေကို ပြန်လည် ရယူရမယ့် object ပါ။
* `[in] property_count`: `properties` array ထဲက elements အရေအတွက်ပါ။
* `[in] properties`: Property descriptors တွေရဲ့ array ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က object တစ်ခုပေါ်မှာ properties အများအပြားကို ထိရောက်စွာ define လုပ်နိုင်စေပါတယ်။ Properties တွေကို property descriptors တွေကို သုံးပြီး define လုပ်ပါတယ် ([`napi_property_descriptor`][] ကို ကြည့်ပါ)။ ဒီလို property descriptors တွေရဲ့ array တစ်ခု ပေးလိုက်ရင် — ဒီ API က — `DefineOwnProperty()` (ECMA-262 specification ရဲ့ [Section DefineOwnProperty][] မှာ ဖော်ပြထားတဲ့အတိုင်း) က သတ်မှတ်ထားတဲ့ ပုံစံအတိုင်း — object ပေါ်မှာ properties တွေကို တစ်ခုပြီးတစ်ခု သတ်မှတ်ပေးပါလိမ့်မယ်။

#### `napi_object_freeze`

```c
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Freeze လုပ်ရမယ့် object ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က ပေးထားတဲ့ object တစ်ခုကို freeze လုပ်ပါတယ်။ ဒါက — properties အသစ်တွေ ထပ်ဆောင်း ထည့်သွင်းတာနဲ့ ရှိပြီးသား properties တွေကို ဖယ်ရှားတာကို တားဆီးပေးပြီး — ရှိပြီးသား properties တွေရဲ့ enumerability, configurability (သို့) writability ကို ပြောင်းလဲတာနဲ့ — ရှိပြီးသား properties တွေရဲ့ တန်ဖိုးတွေကို ပြောင်းလဲတာကိုလည်း တားဆီးပါတယ်။ ထို့အပြင် — object ရဲ့ prototype ကို ပြောင်းလဲတာကိုလည်း တားဆီးပါတယ်။ ဒါကို ECMA-262 specification ရဲ့ [Section 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) မှာ ဖော်ပြထားပါတယ်။

#### `napi_object_seal`

```c
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Seal လုပ်ရမယ့် object ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က ပေးထားတဲ့ object တစ်ခုကို seal လုပ်ပါတယ်။ ဒါက properties အသစ်တွေ ထပ်ဆောင်း ထည့်သွင်းတာကို တားဆီးပေးပြီး — ရှိပြီးသား properties တွေ အားလုံးကိုလည်း non-configurable အဖြစ် အမှတ်အသား ပြုလုပ်ပေးပါတယ်။ ဒါကို ECMA-262 specification ရဲ့ [Section 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) မှာ ဖော်ပြထားပါတယ်။

#### `node_api_set_prototype`

> Stability: 1 - Experimental

```c
napi_status node_api_set_prototype(napi_env env,
                                   napi_value object,
                                   napi_value value);
```

* `[in] env`: Node-API call ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] object`: Prototype ကို သတ်မှတ်ပေးမယ့် object ပါ။
* `[in] value`: Prototype ရဲ့ တန်ဖိုးပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က ဖြတ်သန်းပေးလိုက်တဲ့ `Object` ရဲ့ prototype ကို သတ်မှတ်ပေးပါတယ်။

## Working with JavaScript functions (JavaScript functions များနှင့် အလုပ်လုပ်ခြင်း)

Node-API က JavaScript code တွေ native code ထဲကို ပြန်ခေါ်ဝင်လို့ရအောင် (call back) ခွင့်ပြုပေးတဲ့ API အစုတစ်ခုကို ပေးပါတယ်။ Native code ထဲကို ပြန်ခေါ်ခြင်းကို support လုပ်တဲ့ Node-APIs တွေက `napi_callback` type နဲ့ ကိုယ်စားပြုထားတဲ့ callback function တစ်ခုကို လက်ခံပါတယ်။ JavaScript VM က native code ဆီကို ပြန်ခေါ်တဲ့အခါ — ပေးထားတဲ့ `napi_callback` function ကို ခေါ်ယူပါတယ်။ ဒီ section မှာ မှတ်တမ်းတင်ထားတဲ့ APIs တွေက callback function ကို အောက်ပါတို့ လုပ်ဆောင်နိုင်စေပါတယ်:

* Callback ကို ခေါ်ယူခဲ့တဲ့ context (နောက်ခံ အခြေအနေ) အကြောင်း အချက်အလက်တွေကို ရယူခြင်း။
* Callback ထဲကို ဖြတ်သန်းပေးထားတဲ့ arguments တွေကို ရယူခြင်း။
* Callback ကနေ `napi_value` တစ်ခုကို ပြန်ပေးခြင်း။

ထို့အပြင် — Node-API က native code ကနေ JavaScript functions တွေကို ခေါ်ယူနိုင်စေတဲ့ function အစုတစ်ခုကိုလည်း ပေးပါတယ်။ Function တစ်ခုကို သာမန် JavaScript function call တစ်ခုလို ခေါ်ယူနိုင်သလို — constructor function အနေနဲ့လည်း ခေါ်ယူနိုင်ပါတယ်။

`napi_property_descriptor` items တွေရဲ့ `data` field ကနေတစ်ဆင့် ဒီ API ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ non-`NULL` data တစ်ခုခုကို `object` နဲ့ ဆက်စပ်နိုင်ပြီး — `object` ကို garbage-collect (အမှိုက် စုဆောင်း) လုပ်ခံရတဲ့အခါ — `object` ရော data ပါ [`napi_add_finalizer`][] ဆီကို ဖြတ်သန်းပေးခြင်းအားဖြင့် free လုပ်နိုင်ပါတယ်။

### `napi_call_function`

```c
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] recv`: ခေါ်ယူလိုက်တဲ့ function ဆီကို ဖြတ်သန်းပေးတဲ့ `this` တန်ဖိုးပါ။
* `[in] func`: ခေါ်ယူရမယ့် JavaScript function ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] argc`: `argv` array ထဲက elements အရေအတွက်ပါ။
* `[in] argv`: Function ဆီကို arguments အနေနဲ့ ဖြတ်သန်းပေးတဲ့ JavaScript values တွေကို ကိုယ်စားပြုတဲ့ `napi_values` တွေရဲ့ array ပါ။
* `[out] result`: ပြန်ပေးလိုက်တဲ့ JavaScript object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က native add-on တစ်ခုကနေ JavaScript function object တစ်ခုကို ခေါ်ယူနိုင်စေပါတယ်။ ဒါက add-on ရဲ့ native code _ကနေ_ JavaScript _ဆီကို_ ပြန်ခေါ်ခြင်းရဲ့ အဓိက ယန္တရား ဖြစ်ပါတယ်။ Async operation တစ်ခုပြီးနောက်မှာ JavaScript ထဲကို ခေါ်ယူတဲ့ အထူး အခြေအနေအတွက်ကတော့ — [`napi_make_callback`][] ကို ကြည့်ပါ။

နမူနာ အသုံးပြုမှု (use case) တစ်ခုက အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ်။ အောက်က JavaScript snippet ကို ကြည့်ပါ:

```js
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```

အဲဒီအခါ — အပေါ်က function ကို native add-on တစ်ခုကနေ အောက်က code ကို သုံးပြီး ခေါ်ယူနိုင်ပါတယ်:

```c
// Get the function named "AddTwo" on the global object
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// Convert the result back to a native type
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function`

```c
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] utf8Name`: Optional — UTF8 နဲ့ encode လုပ်ထားတဲ့ function ရဲ့ နာမည်ပါ။ ဒါက JavaScript အတွင်းမှာ function object အသစ်ရဲ့ `name` property အဖြစ် မြင်ရပါတယ်။
* `[in] length`: `utf8name` ရဲ့ အရှည်ကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[in] cb`: ဒီ function object ကို ခေါ်ယူခံရတဲ့အခါ ခေါ်ယူရမယ့် native function ပါ။ [`napi_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `[in] data`: User က ပေးထားတဲ့ data context ပါ။ နောက်ပိုင်း function ကို ခေါ်ယူတဲ့အခါ ဒါကို function ထဲကို ပြန်လည် ဖြတ်သန်းပေးပါလိမ့်မယ်။
* `[out] result`: အသစ် ဖန်တီးလိုက်တဲ့ function အတွက် JavaScript function object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က add-on ရေးသားသူ (author) တစ်ယောက်ကို native code ထဲမှာ function object တစ်ခု ဖန်တီးနိုင်စေပါတယ်။ ဒါက JavaScript _ကနေ_ add-on ရဲ့ native code _ဆီကို_ ခေါ်ယူခြင်းကို ခွင့်ပြုပေးတဲ့ အဓိက ယန္တရား ဖြစ်ပါတယ်။

ဒီ call ပြီးနောက်မှာ အသစ် ဖန်တီးလိုက်တဲ့ function က script ကနေ အလိုအလျောက် မြင်ရမှာ မဟုတ်ပါဘူး။ အဲဒီအစား — function ကို script ကနေ ဝင်ရောက် အသုံးပြုနိုင်ဖို့ — JavaScript အတွက် မြင်နိုင်တဲ့ object တစ်ခုခုပေါ်မှာ property တစ်ခုကို တိုက်ရိုက် (explicitly) သတ်မှတ်ပေးရပါမယ်။

Function တစ်ခုကို add-on ရဲ့ module exports ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ထုတ်ဖော်ပြသဖို့ — အသစ် ဖန်တီးလိုက်တဲ့ function ကို exports object ပေါ်မှာ သတ်မှတ်ပေးပါ။ နမူနာ module တစ်ခုက အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ်:

```c
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

အပေါ်က code နဲ့ဆိုရင် — add-on ကို JavaScript ကနေ အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```js
const myaddon = require('./addon');
myaddon.sayHello();
```

`require()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ string က — `.node` file ကို ဖန်တီးဖို့ တာဝန်ရှိတဲ့ — `binding.gyp` ထဲက target ရဲ့ နာမည် ဖြစ်ပါတယ်။

`data` parameter ကနေတစ်ဆင့် ဒီ API ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ non-`NULL` data တစ်ခုခုကို — `result` parameter ထဲမှာ ပြန်ပေးတဲ့ — ရလာတဲ့ JavaScript function နဲ့ ဆက်စပ်နိုင်ပြီး — function ကို garbage-collect လုပ်ခံရတဲ့အခါ — JavaScript function ရော data ပါ [`napi_add_finalizer`][] ဆီကို ဖြတ်သန်းပေးခြင်းအားဖြင့် free လုပ်နိုင်ပါတယ်။

JavaScript `Function` တွေကို ECMAScript Language Specification ရဲ့ [Section Function objects][] မှာ ဖော်ပြထားပါတယ်။

### `napi_get_cb_info`

```c
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] cbinfo`: Callback function ထဲကို ဖြတ်သန်းပေးထားတဲ့ callback info ပါ။
* `[in-out] argc`: ပေးထားတဲ့ `argv` array ရဲ့ အရှည်ကို သတ်မှတ်ပေးပြီး — arguments တွေရဲ့ တကယ့် အရေအတွက်ကို လက်ခံရရှိပါတယ်။ `argc` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] argv`: Arguments တွေကို ကူးယူ ထည့်သွင်းပေးမယ့် `napi_value` တွေရဲ့ C array ပါ။ ပေးထားတဲ့ အရေအတွက်ထက် arguments တွေ ပိုများနေရင် — တောင်းဆိုထားတဲ့ arguments အရေအတွက်ကိုသာ ကူးယူပါတယ်။ ဆိုထားတာထက် arguments တွေ နည်းနေရင် — `argv` ရဲ့ ကျန်နေတဲ့ နေရာတွေကို `undefined` ကို ကိုယ်စားပြုတဲ့ `napi_value` တန်ဖိုးတွေနဲ့ ဖြည့်ပေးပါတယ်။ `argv` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] thisArg`: Call အတွက် JavaScript `this` argument ကို လက်ခံရရှိပါတယ်။ `thisArg` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။
* `[out] data`: Callback အတွက် data pointer ကို လက်ခံရရှိပါတယ်။ `data` ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် optional အနေနဲ့ လျစ်လျူရှုနိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method ကို callback function တစ်ခုရဲ့ အတွင်းမှာ — ပေးထားတဲ့ callback info ကနေ arguments တွေနဲ့ `this` pointer လိုမျိုး — call အကြောင်း အသေးစိတ်တွေကို ပြန်လည် ရယူဖို့ သုံးပါတယ်။

### `napi_get_new_target`

```c
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] cbinfo`: Callback function ထဲကို ဖြတ်သန်းပေးထားတဲ့ callback info ပါ။
* `[out] result`: Constructor call ရဲ့ `new.target` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က constructor call ရဲ့ `new.target` ကို ပြန်ပေးပါတယ်။ လက်ရှိ callback က constructor call တစ်ခု မဟုတ်ဘူးဆိုရင် — result က `NULL` ဖြစ်ပါတယ်။

### `napi_new_instance`

```c
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] cons`: Constructor အနေနဲ့ ခေါ်ယူရမယ့် JavaScript function ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] argc`: `argv` array ထဲက elements အရေအတွက်ပါ။
* `[in] argv`: Constructor ဆီကို arguments အနေနဲ့ ဖြတ်သန်းပေးမယ့် JavaScript values တွေကို `napi_value` အနေနဲ့ ကိုယ်စားပြုထားတဲ့ array ပါ။ `argc` က သုည ဖြစ်နေရင် — ဒီ parameter ကို `NULL` ဖြတ်သန်းခြင်းအားဖြင့် ချန်လှပ်ထားနိုင်ပါတယ်။
* `[out] result`: ပြန်ပေးလိုက်တဲ့ JavaScript object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ — ဒီကိစ္စမှာတော့ တည်ဆောက်လိုက်တဲ့ (constructed) object ဖြစ်ပါတယ်။

ဒီ method ကို — object အတွက် constructor ကို ကိုယ်စားပြုတဲ့ ပေးထားတဲ့ `napi_value` တစ်ခုကို သုံးပြီး — JavaScript value အသစ်တစ်ခုကို instantiate (instance အသစ် ဖန်တီး) လုပ်ဖို့ သုံးပါတယ်။ ဥပမာ — အောက်က snippet ကို ကြည့်ပါ:

```js
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```

ဒါနဲ့ အနီးစပ်ဆုံး ညီမျှတာကို Node-API မှာ အောက်က snippet ကို သုံးပြီး လုပ်ဆောင်နိုင်ပါတယ်:

```c
// Get the constructor function MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

## Object wrap (object များကို wrap ပြုလုပ်ခြင်း)

Node-API က C++ classes နဲ့ instances တွေကို "wrap" (JavaScript object တစ်ခုအတွင်းမှာ ထည့်သွင်းခြင်း) လုပ်နိုင်တဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ် — အဲဒီလို လုပ်လိုက်ရင် class ရဲ့ constructor နဲ့ methods တွေကို JavaScript ကနေ ခေါ်ယူနိုင်ပါတယ်။

1. [`napi_define_class`][] API က — C++ class နဲ့ ကိုက်ညီတဲ့ constructor, static properties နဲ့ methods တွေအပြင် — instance properties နဲ့ methods တွေပါ ပါဝင်တဲ့ JavaScript class တစ်ခုကို define လုပ်ပါတယ်။
2. JavaScript code က constructor ကို ခေါ်ယူတဲ့အခါ — constructor callback က [`napi_wrap`][] ကို သုံးပြီး C++ instance အသစ်တစ်ခုကို JavaScript object တစ်ခုထဲမှာ wrap လုပ်ပြီး — wrapper object ကို ပြန်ပေးပါတယ်။
3. JavaScript code က class ပေါ်မှာ method (သို့) property accessor တစ်ခုကို ခေါ်ယူတဲ့အခါ — ဆက်စပ်နေတဲ့ `napi_callback` C++ function ကို ခေါ်ယူပါတယ်။ Instance callback တစ်ခုအတွက်ဆိုရင် — [`napi_unwrap`][] က call ရဲ့ ပစ်မှတ် ဖြစ်တဲ့ C++ instance ကို ရယူပေးပါတယ်။

Wrap လုပ်ထားတဲ့ (wrapped) objects တွေအတွက်ဆိုရင် — class prototype ပေါ်မှာ ခေါ်ယူတဲ့ function နဲ့ class တစ်ခုရဲ့ instance ပေါ်မှာ ခေါ်ယူတဲ့ function ကို ခွဲခြားဖို့ ခက်ခဲနိုင်ပါတယ်။ ဒီပြဿနာကို ဖြေရှင်းဖို့ သုံးလေ့ရှိတဲ့ ပုံစံ (pattern) တစ်ခုကတော့ — နောက်ပိုင်းမှာ `instanceof` စစ်ဆေးမှုတွေအတွက် — class constructor ဆီကို persistent reference (ဆက်လက် တည်မြဲနေသော ရည်ညွှန်းချက်) တစ်ခုကို သိမ်းဆည်းထားခြင်းပါ။

```c
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // otherwise...
}
```

Reference က မလိုအပ်တော့တာနဲ့ free လုပ်ရပါမယ်။

`napi_instanceof()` က — JavaScript object တစ်ခုဟာ တိကျတဲ့ native type တစ်ခုအတွက် wrapper တစ်ခု ဖြစ်ကြောင်း သေချာစေဖို့ — မလုံလောက်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ အထူးသဖြင့် — wrapped JavaScript objects တွေကို prototype methods တွေရဲ့ `this` value အနေနဲ့ မဟုတ်ဘဲ — static methods တွေကနေတစ်ဆင့် addon ထဲကို ပြန်လည် ပို့ဆောင်ခံရတဲ့ အခြေအနေမျိုးမှာ ဖြစ်တတ်ပါတယ်။ အဲဒီလို အခြေအနေတွေမှာ — ၎င်းတို့ကို မှားယွင်းစွာ unwrap လုပ်ခံရနိုင်တဲ့ အခွင့်အလမ်း ရှိပါတယ်။

```js
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` returns a JavaScript object that wraps a native database
// handle.
const dbHandle = myAddon.openDatabase();

// `query()` returns a JavaScript object that wraps a native query handle.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// There is an accidental error in the line below. The first parameter to
// `myAddon.queryHasRecords()` should be the database handle (`dbHandle`), not
// the query handle (`query`), so the correct condition for the while-loop
// should be
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // retrieve records
}
```

အပေါ်က ဥပမာထဲမှာ `myAddon.queryHasRecords()` က arguments နှစ်ခုကို လက်ခံတဲ့ method တစ်ခုပါ။ ပထမတစ်ခုက database handle ဖြစ်ပြီး — ဒုတိယတစ်ခုက query handle ပါ။ အတွင်းပိုင်းမှာ — ပထမ argument ကို unwrap လုပ်ပြီး ရလာတဲ့ pointer ကို native database handle အဖြစ် cast လုပ်ပါတယ်။ ပြီးတော့ — ဒုတိယ argument ကို unwrap လုပ်ပြီး ရလာတဲ့ pointer ကို query handle အဖြစ် cast လုပ်ပါတယ်။ Arguments တွေကို မှားယွင်းတဲ့ အစီအစဉ်နဲ့ ဖြတ်သန်းလိုက်ရင် — cast တွေကတော့ အလုပ်လုပ်နိုင်ပေမယ့် — underlying database operation က မအောင်မြင်ဖို့ (သို့) invalid memory access (မမှန်ကန်တဲ့ memory ဝင်ရောက်မှု) ကိုတောင် ဖြစ်စေဖို့ — အခွင့်အလမ်း များပါတယ်။

ပထမ argument ကနေ ပြန်လည် ရယူလိုက်တဲ့ pointer က တကယ့် database handle ဆီကို ညွှန်ပြတဲ့ pointer ဖြစ်ပြီး — အလားတူ — ဒုတိယ argument ကနေ ပြန်လည် ရယူလိုက်တဲ့ pointer ကလည်း တကယ့် query handle ဆီကို ညွှန်ပြတဲ့ pointer ဖြစ်ကြောင်း သေချာစေဖို့ — `queryHasRecords()` ရဲ့ implementation က type validation (type စစ်ဆေးခြင်း) တစ်ခုကို လုပ်ဆောင်ရပါမယ်။ Database handle ကို instantiate လုပ်ခဲ့တဲ့ JavaScript class constructor နဲ့ — query handle ကို instantiate လုပ်ခဲ့တဲ့ constructor တို့ကို `napi_ref` တွေထဲမှာ ထိန်းသိမ်းထားတာက အထောက်အကူ ပြုနိုင်ပါတယ် — အကြောင်းကတော့ `queryHashRecords()` ထဲကို ဖြတ်သန်းလိုက်တဲ့ instances တွေက တကယ့် type မှန် ဖြစ်ကြောင်း သေချာစေဖို့ `napi_instanceof()` ကို သုံးနိုင်လို့ပါ။

ကံမကောင်းစွာပဲ — `napi_instanceof()` က prototype manipulation (prototype ကို ခြယ်လှယ်ခြင်း) ကနေတော့ အကာအကွယ် မပေးပါဘူး။ ဥပမာ — database handle instance ရဲ့ prototype ကို query handle instances တွေအတွက် constructor ရဲ့ prototype အဖြစ် သတ်မှတ်ထားနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ — database handle instance က query handle instance တစ်ခုလို ပေါ်လွင်နိုင်ပြီး — database handle ဆီကို ညွှန်ပြတဲ့ pointer ကို ဆက်လက် ပါဝင်နေတုန်းမှာပဲ — query handle instance အတွက် `napi_instanceof()` စစ်ဆေးမှုကို အောင်မြင်သွားပါလိမ့်မယ်။

ဒီအတွက် — Node-API က type-tagging (type အမှတ်အသား တပ်ခြင်း) စွမ်းဆောင်ရည်တွေကို ပေးပါတယ်။

Type tag ဆိုတာ — addon တစ်ခုအတွက် သီးသန့် ဖြစ်တဲ့ 128-bit integer တစ်ခုပါ။ Node-API က type tag တစ်ခုကို သိမ်းဆည်းဖို့ `napi_type_tag` structure ကို ပေးပါတယ်။ ဒီလို value တစ်ခုကို — `napi_value` တစ်ခုထဲမှာ သိမ်းထားတဲ့ JavaScript object (သို့) [external][] တစ်ခုနဲ့အတူ `napi_type_tag_object()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့အခါ — JavaScript object ကို အဲဒီ type tag နဲ့ "အမှတ်အသား (mark)" ပြုလုပ်ပါလိမ့်မယ်။ ဒီ "အမှတ်အသား" က JavaScript ဘက်ကနေ မမြင်ရပါဘူး။ JavaScript object တစ်ခု native binding ထဲကို ရောက်ရှိလာတဲ့အခါ — `napi_check_object_type_tag()` ကို မူရင်း type tag နဲ့အတူ သုံးပြီး — JavaScript object ကို အရင်က အဲဒီ type tag နဲ့ "အမှတ်အသား" လုပ်ထားခဲ့လားဆိုတာ ဆုံးဖြတ်နိုင်ပါတယ်။ ဒါက — `napi_instanceof()` ပေးနိုင်တာထက် ပိုမို တိကျမြင့်မားတဲ့ type-checking (type စစ်ဆေးခြင်း) စွမ်းဆောင်ရည်ကို ဖန်တီးပေးပါတယ် — အကြောင်းကတော့ ဒီလို type-tagging က prototype manipulation နဲ့ addon unloading/reloading (ဖြုတ်ချခြင်း/ပြန်လည် တင်ခြင်း) တွေကိုပါ ကျော်လွန်၍ ဆက်လက် အလုပ်လုပ်နိုင်လို့ပါ။

အပေါ်က ဥပမာကို ဆက်ပြီး — အောက်က skeleton addon implementation (အရိုးစု addon အကောင်အထည်ဖော်မှု) က `napi_type_tag_object()` နဲ့ `napi_check_object_type_tag()` တို့ရဲ့ အသုံးပြုပုံကို သရုပ်ဖော်ပြပါတယ်။

```c
// This value is the type tag for a database handle. The command
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// can be used to obtain the two values with which to initialize the structure.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// This value is the type tag for a query handle.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Perform the underlying action which results in a database handle.
  DatabaseHandle* dbHandle = open_database();

  // Create a new, empty JS object.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Tag the object to indicate that it holds a pointer to a `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Store the pointer to the `DatabaseHandle` structure inside the JS object.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Later when we receive a JavaScript object purporting to be a database handle
// we can use `napi_check_object_type_tag()` to ensure that it is indeed such a
// handle.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Check that the object passed as the first parameter has the previously
  // applied tag.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Throw a `TypeError` if it doesn't.
  if (!is_db_handle) {
    // Throw a TypeError.
    return NULL;
  }
}
```

### `napi_define_class`

```c
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] utf8name`: JavaScript constructor function ရဲ့ နာမည်ပါ။ ရှင်းလင်းမှုအတွက် — C++ class တစ်ခုကို wrap လုပ်တဲ့အခါ C++ class ရဲ့ နာမည်ကို သုံးဖို့ အကြံပြုပါတယ်။
* `[in] length`: `utf8name` ရဲ့ အရှည်ကို bytes နဲ့ ဖော်ပြတာပါ — null-terminated ဖြစ်နေရင်တော့ `NAPI_AUTO_LENGTH` ပါ။
* `[in] constructor`: Class ရဲ့ instances တွေကို တည်ဆောက်တာကို ကိုင်တွယ်တဲ့ callback function ပါ။ C++ class တစ်ခုကို wrap လုပ်တဲ့အခါ — ဒီ method က [`napi_callback`][] signature နဲ့ static member တစ်ခု ဖြစ်ရပါမယ်။ C++ class constructor ကိုတော့ သုံးလို့ မရပါဘူး။ [`napi_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `[in] data`: Optional — callback info ရဲ့ `data` property အဖြစ် constructor callback ဆီကို ဖြတ်သန်းပေးရမယ့် data ပါ။
* `[in] property_count`: `properties` array argument ထဲက items အရေအတွက်ပါ။
* `[in] properties`: Class ပေါ်မှာ ရှိတဲ့ static နဲ့ instance data properties, accessors နဲ့ methods တွေကို ဖော်ပြတဲ့ property descriptors တွေရဲ့ array ပါ။ `napi_property_descriptor` ကို ကြည့်ပါ။
* `[out] result`: Class အတွက် constructor function ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

JavaScript class တစ်ခုကို define လုပ်ပေးပြီး — အောက်ပါတို့ ပါဝင်ပါတယ်:

* Class ရဲ့ နာမည်ရှိတဲ့ JavaScript constructor function တစ်ခုပါ။ ဆက်စပ်နေတဲ့ C++ class တစ်ခုကို wrap လုပ်တဲ့အခါ — `constructor` ကနေ ဖြတ်သန်းပေးတဲ့ callback ကို C++ class instance အသစ်တစ်ခုကို instantiate လုပ်ဖို့ သုံးနိုင်ပြီး — အဲဒီ instance ကို [`napi_wrap`][] ကို သုံးပြီး တည်ဆောက်နေတဲ့ JavaScript object instance ရဲ့ အတွင်းမှာ ထည့်သွင်းနိုင်ပါတယ်။
* Constructor function ပေါ်မှာ ရှိတဲ့ properties တွေပါ — ၎င်းတို့ရဲ့ implementation တွေက C++ class ရဲ့ ဆက်စပ်နေတဲ့ _static_ data properties, accessors နဲ့ methods တွေကို ခေါ်ယူနိုင်ပါတယ် (`napi_static` attribute ပါတဲ့ property descriptors တွေနဲ့ သတ်မှတ်ထားတာပါ)။
* Constructor function ရဲ့ `prototype` object ပေါ်မှာ ရှိတဲ့ properties တွေပါ။ C++ class တစ်ခုကို wrap လုပ်တဲ့အခါ — JavaScript object instance ထဲမှာ ထည့်ထားတဲ့ C++ class instance ကို [`napi_unwrap`][] ကို သုံးပြီး ပြန်လည် ရယူပြီးမှ — `napi_static` attribute မပါတဲ့ property descriptors တွေထဲမှာ ပေးထားတဲ့ static functions တွေကနေ — C++ class ရဲ့ _non-static_ data properties, accessors နဲ့ methods တွေကို ခေါ်ယူနိုင်ပါတယ်။

C++ class တစ်ခုကို wrap လုပ်တဲ့အခါ — `constructor` ကနေတစ်ဆင့် ဖြတ်သန်းပေးတဲ့ C++ constructor callback က class ပေါ်က static method တစ်ခု ဖြစ်သင့်ပြီး — ၎င်းက တကယ့် class constructor ကို ခေါ်ပြီး — C++ instance အသစ်ကို JavaScript object တစ်ခုထဲမှာ wrap လုပ်ကာ — wrapper object ကို ပြန်ပေးသင့်ပါတယ်။ အသေးစိတ်အတွက် [`napi_wrap`][] ကို ကြည့်ပါ။

[`napi_define_class`][] ကနေ ပြန်လာတဲ့ JavaScript constructor function ကို — native code ကနေ class ရဲ့ instances အသစ်တွေကို တည်ဆောက်ဖို့ နဲ့/သို့မဟုတ် ပေးလိုက်တဲ့ values တွေက class ရဲ့ instances တွေ ဟုတ်မဟုတ် စစ်ဆေးဖို့ — မကြာခဏ သိမ်းဆည်းထားပြီး နောက်ပိုင်းမှာ သုံးပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — function value ကို garbage-collect လုပ်ခံရတာကနေ ကာကွယ်ဖို့ — reference count ကို >= 1 မှာ ထိန်းထားနိုင်ဖို့ — [`napi_create_reference`][] ကို သုံးပြီး strong persistent reference တစ်ခု ဖန်တီးနိုင်ပါတယ်။

`data` parameter ကနေတစ်ဆင့် (သို့) `napi_property_descriptor` array items တွေရဲ့ `data` field ကနေတစ်ဆင့် ဒီ API ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ non-`NULL` data တစ်ခုခုကို — `result` parameter ထဲမှာ ပြန်ပေးတဲ့ — ရလာတဲ့ JavaScript constructor နဲ့ ဆက်စပ်နိုင်ပြီး — class ကို garbage-collect လုပ်ခံရတဲ့အခါ — JavaScript function ရော data ပါ [`napi_add_finalizer`][] ဆီကို ဖြတ်သန်းပေးခြင်းအားဖြင့် free လုပ်နိုင်ပါတယ်။

### `napi_wrap`

```c
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: Native object အတွက် wrapper ဖြစ်လာမယ့် JavaScript object ပါ။
* `[in] native_object`: JavaScript object ထဲမှာ wrap လုပ်ခံရမယ့် native instance ပါ။
* `[in] finalize_cb`: Optional — JavaScript object ကို garbage-collect လုပ်ခံရတဲ့အခါ native instance ကို free လုပ်ဖို့ သုံးနိုင်တဲ့ native callback ပါ။ [`napi_finalize`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြပါတယ်။
* `[in] finalize_hint`: Optional — finalize callback ဆီကို ဖြတ်သန်းပေးတဲ့ contextual hint (အခြေအနေဆိုင်ရာ အရိပ်အမြွက်) ပါ။
* `[out] result`: Optional — wrap လုပ်ထားတဲ့ object ဆီကို ရည်ညွှန်းချက် (reference) ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

Native instance တစ်ခုကို JavaScript object တစ်ခုထဲမှာ wrap လုပ်ပါတယ်။ Native instance ကို နောက်ပိုင်းမှာ `napi_unwrap()` ကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။

JavaScript code က `napi_define_class()` နဲ့ သတ်မှတ်ထားတဲ့ class တစ်ခုရဲ့ constructor ကို ခေါ်ယူတဲ့အခါ — constructor အတွက် `napi_callback` ကို ခေါ်ယူပါတယ်။ Native class ရဲ့ instance တစ်ခုကို တည်ဆောက်ပြီးနောက်မှာ — callback က — constructor callback ရဲ့ `this` argument ဖြစ်တဲ့ ကြိုတင် ဖန်တီးထားပြီးသား JavaScript object ထဲမှာ အသစ် တည်ဆောက်လိုက်တဲ့ instance ကို wrap လုပ်ဖို့ — `napi_wrap()` ကို ခေါ်ရပါမယ်။ (ဒီ `this` object ကို constructor function ရဲ့ `prototype` ကနေ ဖန်တီးထားတာမို့ — instance properties နဲ့ methods တွေ အားလုံးရဲ့ သတ်မှတ်ချက် (definition) တွေ ရှိပြီးသား ဖြစ်ပါတယ်။)

ပုံမှန်အားဖြင့် class instance တစ်ခုကို wrap လုပ်တဲ့အခါ — finalize callback ဆီကို `data` argument အနေနဲ့ ရောက်ရှိလာတဲ့ native instance ကို ရိုးရှင်းစွာ ဖျက်ပစ်တဲ့ finalize callback တစ်ခုကို ပေးသင့်ပါတယ်။

Optional ဖြစ်တဲ့ ပြန်ပေးလိုက်တဲ့ reference က ကနဦးမှာ weak reference (အားနည်းသော ရည်ညွှန်းချက်) တစ်ခု ဖြစ်ပြီး — reference count 0 ရှိပါတယ်။ ပုံမှန်အားဖြင့် — instance ကို valid အဖြစ် ဆက်လက် ထားရှိဖို့ လိုအပ်တဲ့ async operations တွေရဲ့ အတွင်းမှာ — ဒီ reference count ကို ယာယီ မြှင့်တင်ထားလေ့ ရှိပါတယ်။

_သတိပြုရန်_: Optional ပြန်ပေးလိုက်တဲ့ reference ကို (ရရှိခဲ့ရင်) — finalize callback ခေါ်ယူခံရတာကို တုံ့ပြန်တဲ့အခါမှသာ (ONLY) — [`napi_delete_reference`][] ကို သုံးပြီး ဖျက်ပစ်သင့်ပါတယ်။ အဲဒီအချိန်ထက် စောပြီး ဖျက်လိုက်ရင် — finalize callback ကို ဘယ်တော့မှ ခေါ်ယူခံရမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — reference တစ်ခုကို ရယူတဲ့အခါ — reference ရဲ့ မှန်ကန်တဲ့ စွန့်ပစ်မှု (disposal) ကို လုပ်ဆောင်နိုင်ဖို့ — finalize callback တစ်ခုလည်း လိုအပ်ပါတယ်။

Finalizer callbacks တွေကို ရွှေ့ဆိုင်း (defer) လုပ်ထားနိုင်ပြီး — object ကို garbage-collect လုပ်ပြီးသွားပေမယ့် (ပြီးတော့ weak reference က invalid ဖြစ်နေပေမယ့်) — finalizer ကို မခေါ်ရသေးတဲ့ အချိန်ကွာဟချက် (window) တစ်ခု ကျန်ရစ်စေနိုင်ပါတယ်။ `napi_wrap()` ကနေ ပြန်ပေးတဲ့ weak references တွေပေါ်မှာ `napi_get_reference_value()` ကို သုံးတဲ့အခါ — ဗလာ (empty) result တစ်ခုကိုလည်း ကိုင်တွယ်ဖို့ သတိရပါ။

Object တစ်ခုပေါ်မှာ `napi_wrap()` ကို ဒုတိယအကြိမ် ခေါ်ယူလိုက်ရင် error တစ်ခု ပြန်လာပါလိမ့်မယ်။ Object နဲ့ တခြား native instance တစ်ခုကို ဆက်စပ်ချင်ရင် — အရင်ဆုံး `napi_remove_wrap()` ကို သုံးပါ။

### `napi_unwrap`

```c
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: Native instance နဲ့ ဆက်စပ်ထားတဲ့ object ပါ။
* `[out] result`: Wrap လုပ်ထားတဲ့ native instance ဆီကို ညွှန်ပြတဲ့ pointer ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`napi_wrap()` ကို သုံးပြီး အရင်က JavaScript object တစ်ခုထဲမှာ wrap လုပ်ထားခဲ့တဲ့ native instance တစ်ခုကို ပြန်လည် ရယူပါတယ်။

JavaScript code က class ပေါ်မှာ method (သို့) property accessor တစ်ခုကို ခေါ်ယူတဲ့အခါ — ဆက်စပ်နေတဲ့ `napi_callback` ကို ခေါ်ယူပါတယ်။ Callback က instance method (သို့) accessor တစ်ခုအတွက် ဖြစ်နေရင် — callback ရဲ့ `this` argument က wrapper object ဖြစ်ပြီး — call ရဲ့ ပစ်မှတ် ဖြစ်တဲ့ wrapped C++ instance ကို — wrapper object ပေါ်မှာ `napi_unwrap()` ကို ခေါ်ယူခြင်းအားဖြင့် ရယူနိုင်ပါတယ်။

### `napi_remove_wrap`

```c
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: Native instance နဲ့ ဆက်စပ်ထားတဲ့ object ပါ။
* `[out] result`: Wrap လုပ်ထားတဲ့ native instance ဆီကို ညွှန်ပြတဲ့ pointer ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`napi_wrap()` ကို သုံးပြီး `js_object` ဆိုတဲ့ JavaScript object ထဲမှာ အရင်က wrap လုပ်ထားခဲ့တဲ့ native instance တစ်ခုကို ပြန်လည် ရယူပြီး — wrap လုပ်ထားမှုကို ဖယ်ရှားပါတယ်။ Wrap လုပ်မှုနဲ့ finalize callback တစ်ခု ဆက်စပ်ထားခဲ့ရင် — JavaScript object ကို garbage-collect လုပ်ခံရတဲ့အခါ — အဲဒီ callback ကို နောက်ထပ် ခေါ်ယူတော့မှာ မဟုတ်ပါဘူး။

### `napi_type_tag_object`

```c
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: အမှတ်အသား (mark) လုပ်ရမယ့် JavaScript object (သို့) [external][] ပါ။
* `[in] type_tag`: Object ကို အမှတ်အသား လုပ်ဖို့ သုံးမယ့် tag ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`type_tag` pointer ရဲ့ တန်ဖိုးကို JavaScript object (သို့) [external][] တစ်ခုနဲ့ ဆက်စပ်ပေးပါတယ်။ အဲဒီနောက် — object ပေါ်မှာ တွဲထားတဲ့ tag ကို — addon ပိုင်ဆိုင်တဲ့ tag တစ်ခုနဲ့ နှိုင်းယှဉ်ဖို့ `napi_check_object_type_tag()` ကို သုံးနိုင်ပြီး — object က type မှန်ကန်ကြောင်း သေချာစေနိုင်ပါတယ်။

Object မှာ ဆက်စပ်ထားတဲ့ type tag တစ်ခု ရှိပြီးသား ဖြစ်နေရင် — ဒီ API က `napi_invalid_arg` ကို ပြန်ပေးပါလိမ့်မယ်။

### `napi_check_object_type_tag`

```c
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: Type tag ကို စစ်ဆေးရမယ့် JavaScript object (သို့) [external][] ပါ။
* `[in] type_tag`: Object ပေါ်မှာ တွေ့ရတဲ့ tag တွေနဲ့ နှိုင်းယှဉ်ဖို့ သုံးမယ့် tag ပါ။
* `[out] result`: ပေးထားတဲ့ type tag က object ပေါ်မှာ ရှိတဲ့ type tag နဲ့ ကိုက်ညီခဲ့လားဆိုတာပါ။ Object ပေါ်မှာ type tag မတွေ့ရရင်လည်း `false` ကို ပြန်ပေးပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`type_tag` အနေနဲ့ ပေးထားတဲ့ pointer ကို `js_object` ပေါ်မှာ တွေ့နိုင်တဲ့ tag တွေနဲ့ နှိုင်းယှဉ်ပါတယ်။ `js_object` ပေါ်မှာ tag တစ်ခုမှ မတွေ့ရဘူးဆိုရင် (သို့) tag တစ်ခု တွေ့ပေမယ့် `type_tag` နဲ့ မကိုက်ညီဘူးဆိုရင် — `result` ကို `false` အဖြစ် သတ်မှတ်ပါတယ်။ Tag တစ်ခု တွေ့ပြီး `type_tag` နဲ့ ကိုက်ညီတယ်ဆိုရင် — `result` ကို `true` အဖြစ် သတ်မှတ်ပါတယ်။
### `napi_add_finalizer`

```c
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] js_object`: Native data တွေကို တွဲချိတ်ပေးသွားမယ့် JavaScript object ပါ။
* `[in] finalize_data`: `finalize_cb` ဆီကို ဖြတ်သန်းပေးရမယ့် Optional data ပါ။
* `[in] finalize_cb`: JavaScript object ကို garbage-collect လုပ်လိုက်တဲ့အခါ native data တွေကို လွှတ်ပေးဖို့ သုံးမယ့် Native callback ပါ။ [`napi_finalize`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြထားပါတယ်။
* `[in] finalize_hint`: Finalize callback ဆီကို ဖြတ်သန်းပေးတဲ့ Optional contextual hint ပါ။
* `[out] result`: JavaScript object ဆီကို ညွှန်ပြတဲ့ Optional reference ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က — `js_object` ထဲက JavaScript object ကို garbage-collect လုပ်လိုက်တဲ့အခါ ခေါ်ယူမယ့် — `napi_finalize` callback တစ်ခုကို ပေါင်းထည့်ပေးပါတယ်။

ဒီ API ကို JavaScript object တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ ခေါ်ယူနိုင်ပါတယ်။

_Caution (သတိပြုရန်)_: ပြန်ပေးလိုက်တဲ့ optional reference ကို (ရရှိခဲ့ရင်) — finalize callback ခေါ်ယူခံရမှုကို တုံ့ပြန်တဲ့အနေနဲ့သာ — [`napi_delete_reference`][] ကို သုံးပြီး ဖျက်ပစ်သင့်ပါတယ်။ အဲဒီအချိန်ထက် စောပြီး ဖျက်လိုက်ရင် — finalize callback ကို ဘယ်တော့မှ ခေါ်ယူမှာ မဟုတ်တာ ဖြစ်နိုင်ပါတယ်။ ဒါကြောင့် reference တစ်ခုကို ရယူတဲ့အခါ — reference ကို မှန်ကန်စွာ စွန့်ပစ်နိုင်ဖို့အတွက် — finalize callback တစ်ခုလည်း မဖြစ်မနေ လိုအပ်ပါတယ်။

#### `node_api_post_finalizer`

> Stability: 1 - Experimental

```c
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] finalize_cb`: JavaScript object ကို garbage-collect လုပ်လိုက်တဲ့အခါ native data တွေကို လွှတ်ပေးဖို့ သုံးမယ့် Native callback ပါ။ [`napi_finalize`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြထားပါတယ်။
* `[in] finalize_data`: `finalize_cb` ဆီကို ဖြတ်သန်းပေးရမယ့် Optional data ပါ။
* `[in] finalize_hint`: Finalize callback ဆီကို ဖြတ်သန်းပေးတဲ့ Optional contextual hint ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

`napi_finalize` callback တစ်ခုကို — event loop အတွင်းမှာ asynchronously ခေါ်ယူခံရအောင် — အချိန်ဇယား ဆွဲပေးပါတယ်။

ပုံမှန်အားဖြင့် — finalizers တွေကို GC (garbage collector) က objects တွေကို စုဆောင်း (collect) လုပ်နေချိန်မှာ ခေါ်ယူပါတယ်။ အဲဒီအချိန်မှာ GC state ကို ပြောင်းလဲစေနိုင်တဲ့ Node-API တစ်ခုခုကို ခေါ်ယူတာက ပိတ်ပင်ထားပြီး — Node.js ကို crash ဖြစ်စေပါလိမ့်မယ်။

`node_api_post_finalizer` က — add-on အနေနဲ့ အဲဒီလို Node-APIs တွေဆီကို ခေါ်ယူမှုတွေကို — GC finalization ရဲ့ အပြင်ဘက် အချိန်ကာလတစ်ခုအထိ ရွှေ့ဆိုင်းထားနိုင်အောင် ခွင့်ပြုခြင်းအားဖြင့် — ဒီကန့်သတ်ချက်ကို ကျော်လွှားဖို့ ကူညီပေးပါတယ်။

## ရိုးရှင်းသော asynchronous လုပ်ဆောင်မှုများ (Simple asynchronous operations)

Addon modules တွေက ၎င်းတို့ရဲ့ implementation ရဲ့ အစိတ်အပိုင်း တစ်ခုအနေနဲ့ — libuv ကနေ ရတဲ့ async helpers တွေကို အသုံးချဖို့ မကြာခဏ လိုအပ်ပါတယ်။ ဒါက — အလုပ်တွေကို asynchronously execute လုပ်ဖို့ အချိန်ဇယား ဆွဲနိုင်စေပြီး — အလုပ်တွေ ပြီးစီးတာထက် စောပြီး ၎င်းတို့ရဲ့ methods တွေက ပြန်ထွက်နိုင်စေပါတယ်။ ဒါ့အပြင် Node.js application ရဲ့ တစ်ခုလုံး execution ကို block လုပ်တာကို ရှောင်ရှားနိုင်စေပါတယ်။

Node-API က — အသုံးအများဆုံး asynchronous use cases တွေကို လွှမ်းခြုံပေးတဲ့ — ဒီအထောက်အကူပြု functions တွေအတွက် ABI-stable interface တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

Node-API က — asynchronous workers တွေကို စီမံခန့်ခွဲဖို့ သုံးတဲ့ — `napi_async_work` structure ကို သတ်မှတ်ပေးပါတယ်။ Instances တွေကို [`napi_create_async_work`][] နဲ့ [`napi_delete_async_work`][] တို့ကို သုံးပြီး ဖန်တီး/ဖျက်သိမ်းပါတယ်။

`execute` နဲ့ `complete` callbacks တွေက — executor က execute လုပ်ဖို့ အသင့်ဖြစ်တဲ့အခါ နဲ့ ၎င်းက ၎င်းရဲ့ task ကို ပြီးမြောက်တဲ့အခါ — အသီးသီး ခေါ်ယူခံရမယ့် functions တွေပါ။

`execute` function က — JavaScript ရဲ့ execution သို့မဟုတ် JavaScript objects တွေနဲ့ အပြန်အလှန် ဆက်သွယ်မှုကို ဖြစ်ပေါ်စေနိုင်တဲ့ — Node-API calls တွေကို မလုပ်ဆောင်သင့်ပါဘူး။ အများအားဖြင့် — Node-API calls တွေ လုပ်ဖို့ လိုအပ်တဲ့ code တွေကို `complete` callback ထဲမှာသာ ထည့်လုပ်သင့်ပါတယ်။ Execute callback ထဲမှာ `napi_env` parameter ကို သုံးတာကိုလည်း ရှောင်ပါ — အကြောင်းကတော့ ၎င်းက JavaScript ကို execute လုပ်ဖွယ် ရှိလို့ပါ။

ဒီ functions တွေက အောက်ပါ interfaces တွေကို implement လုပ်ပါတယ်:

```c
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```

ဒီ methods တွေကို ခေါ်ယူတဲ့အခါ — ဖြတ်သန်းပေးလိုက်တဲ့ `data` parameter က — `napi_create_async_work` call ထဲကို ဖြတ်သန်းပေးခဲ့တဲ့ — addon က ထောက်ပံ့ပေးတဲ့ `void*` data ဖြစ်ပါလိမ့်မယ်။

ဖန်တီးပြီးတာနဲ့ async worker ကို — [`napi_queue_async_work`][] function ကို သုံးပြီး — execution အတွက် queue တန်းစီထားနိုင်ပါတယ်:

```c
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```

အလုပ်က execution မစတင်ခင်မှာ ဖျက်သိမ်းဖို့ လိုအပ်ရင် — [`napi_cancel_async_work`][] ကို သုံးနိုင်ပါတယ်။

[`napi_cancel_async_work`][] ကို ခေါ်ယူပြီးနောက်မှာ — `complete` callback ကို `napi_cancelled` ဆိုတဲ့ status တန်ဖိုးနဲ့ ခေါ်ယူပါလိမ့်မယ်။ အလုပ်ကို — ဖျက်သိမ်းခံခဲ့ရရင်တောင် — `complete` callback ခေါ်ယူခံရချိန် မတိုင်ခင် ဖျက်ပစ်လို့ မရပါဘူး။

### `napi_create_async_work`

```c
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] async_resource`: `async_hooks` [`init` hooks][] တွေဆီကို ဖြတ်သန်းပေးနိုင်တဲ့ — async work နဲ့ ဆက်စပ်နေတဲ့ Optional object ပါ။
* `[in] async_resource_name`: `async_hooks` API က ထုတ်ဖော် ပေးအပ်တဲ့ diagnostic information တွေအတွက် — ပေးအပ်လိုက်တဲ့ resource အမျိုးအစားကို ခွဲခြားသတ်မှတ်ပေးတဲ့ identifier ပါ။
* `[in] execute`: Logic တွေကို asynchronously execute လုပ်ဖို့ ခေါ်ယူရမယ့် native function ပါ။ ပေးထားတဲ့ function ကို worker pool thread ကနေ ခေါ်ယူပြီး — main event loop thread နဲ့ အပြိုင် (in parallel) execute လုပ်နိုင်ပါတယ်။
* `[in] complete`: Asynchronous logic က ပြီးဆုံးသွားတဲ့အခါ သို့မဟုတ် ဖျက်သိမ်းခံရတဲ့အခါ ခေါ်ယူမယ့် native function ပါ။ ပေးထားတဲ့ function ကို main event loop thread ကနေ ခေါ်ယူပါတယ်။ [`napi_async_complete_callback`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြထားပါတယ်။
* `[in] data`: User က ပေးတဲ့ data context ပါ။ ဒါကို execute နဲ့ complete functions တွေဆီကို ပြန်လည် ဖြတ်သန်းပေးပါလိမ့်မယ်။
* `[out] result`: အသစ် ဖန်တီးလိုက်တဲ့ async work ဆီကို ညွှန်ပြတဲ့ handle ဖြစ်တဲ့ `napi_async_work*` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က — logic တွေကို asynchronously execute လုပ်ဖို့ သုံးတဲ့ — work object တစ်ခုကို allocate လုပ်ပေးပါတယ်။ အလုပ် မလိုအပ်တော့တာနဲ့ — [`napi_delete_async_work`][] ကို သုံးပြီး ၎င်းကို လွှတ်ပေး (free) သင့်ပါတယ်။

`async_resource_name` က null-terminated ဖြစ်ပြီး UTF-8 နဲ့ encode လုပ်ထားတဲ့ string တစ်ခု ဖြစ်သင့်ပါတယ်။

`async_resource_name` identifier ကို user က ပေးအပ်ပြီး — လုပ်ဆောင်နေတဲ့ async work ရဲ့ အမျိုးအစားကို ကိုယ်စားပြုတဲ့ နာမည် ဖြစ်သင့်ပါတယ်။ Identifier ကို namespacing (နာမည်ပိုင်းခြား သတ်မှတ်ခြင်း) လုပ်ဖို့လည်း အကြံပြုထားပါတယ် — ဥပမာ — module ရဲ့ နာမည်ကို ထည့်သွင်းခြင်းအားဖြင့်ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [`async_hooks` documentation][async_hooks `type`] ကို ကြည့်ပါ။

### `napi_delete_async_work`

```c
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] work`: `napi_create_async_work` ဆီကို ခေါ်ယူမှုကနေ ပြန်လာတဲ့ handle ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က အရင်က allocate လုပ်ထားတဲ့ work object တစ်ခုကို လွှတ်ပေး (free) ပါတယ်။

ဒီ API ကို — pending JavaScript exception တစ်ခု ရှိနေရင်တောင် — ခေါ်ယူနိုင်ပါတယ်။

### `napi_queue_async_work`

```c
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] work`: `napi_create_async_work` ဆီကို ခေါ်ယူမှုကနေ ပြန်လာတဲ့ handle ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က အရင်က allocate လုပ်ထားတဲ့ အလုပ်ကို execution အတွက် အချိန်ဇယား ဆွဲပေးဖို့ တောင်းဆိုပါတယ်။ အောင်မြင်စွာ ပြန်လာပြီးတာနဲ့ — ဒီ API ကို `napi_async_work` item တစ်ခုတည်းနဲ့ ထပ်မံ ခေါ်ယူလို့ မရတော့ပါဘူး — ခေါ်ယူခဲ့ရင် ရလဒ်က undefined ဖြစ်ပါလိမ့်မယ်။

### `napi_cancel_async_work`

```c
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] work`: `napi_create_async_work` ဆီကို ခေါ်ယူမှုကနေ ပြန်လာတဲ့ handle ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က — စတင်မလုပ်ရသေးတဲ့ — queue တန်းစီထားတဲ့ အလုပ်ကို ဖျက်သိမ်းပေးပါတယ်။ အလုပ်က execution စတင်ပြီးသား ဖြစ်နေရင်တော့ — ဖျက်သိမ်းလို့ မရတော့ပဲ — `napi_generic_failure` ကို ပြန်ပေးပါလိမ့်မယ်။ အောင်မြင်ခဲ့ရင် — `complete` callback ကို `napi_cancelled` ဆိုတဲ့ status တန်ဖိုးနဲ့ ခေါ်ယူပါလိမ့်မယ်။ အလုပ်ကို — အောင်မြင်စွာ ဖျက်သိမ်းခံခဲ့ရရင်တောင် — `complete` callback ခေါ်ယူခံရချိန် မတိုင်ခင် ဖျက်ပစ်လို့ မရပါဘူး။

ဒီ API ကို — pending JavaScript exception တစ်ခု ရှိနေရင်တောင် — ခေါ်ယူနိုင်ပါတယ်။

## စိတ်ကြိုက် asynchronous လုပ်ဆောင်မှုများ (Custom asynchronous operations)

အပေါ်က ရိုးရှင်းတဲ့ asynchronous work APIs တွေက အခြေအနေတိုင်းအတွက် သင့်လျော်ချင်မှ သင့်လျော်ပါလိမ့်မယ်။ တခြား asynchronous ယန္တရား တစ်ခုခုကို သုံးနေတဲ့အခါ — asynchronous operation တစ်ခုကို runtime က မှန်ကန်စွာ ခြေရာခံနိုင်ဖို့ — အောက်ပါ APIs တွေက မဖြစ်မနေ လိုအပ်ပါတယ်။

### `napi_async_init`

```c
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] async_resource`: `async_hooks` [`init` hooks][] တွေဆီကို ဖြတ်သန်းပေးနိုင်ပြီး — [`async_hooks.executionAsyncResource()`][] ကနေလည်း ဝင်ရောက် သုံးစွဲနိုင်တဲ့ — async work နဲ့ ဆက်စပ်နေတဲ့ Object ပါ။
* `[in] async_resource_name`: `async_hooks` API က ထုတ်ဖော် ပေးအပ်တဲ့ diagnostic information တွေအတွက် — ပေးအပ်လိုက်တဲ့ resource အမျိုးအစားကို ခွဲခြားသတ်မှတ်ပေးတဲ့ identifier ပါ။
* `[out] result`: Initialize လုပ်ပြီးသား async context ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ယခင် versions တွေနဲ့ ABI လိုက်ဖက်ညီမှုကို ထိန်းသိမ်းဖို့အတွက် — `async_resource` အတွက် `NULL` ကို ဖြတ်သန်းပေးတာက error တစ်ခုကို မဖြစ်ပေါ်စေပါဘူး။ ဒါပေမယ့် — async callbacks တွေကြားမှာ ချိတ်ဆက်မှု (linkage) ကို ပေးအပ်ဖို့အတွက် — resource ကို အောက်ခြေ `async_hooks` implementation က ယခုအခါ လိုအပ်နေတာမို့ — ဒါက `async_hooks` [`init` hooks][] နဲ့ `async_hooks.executionAsyncResource()` တွေမှာ မလိုလားအပ်တဲ့ အပြုအမူတွေကို ဖြစ်ပေါ်စေနိုင်လို့ — အကြံပြုလို့ မရပါဘူး။

ဒီ API ရဲ့ ယခင် versions တွေက — `napi_async_context` object ရှိနေချိန်မှာ `async_resource` ဆီကို strong reference (ခိုင်မာသော ရည်ညွှန်းချက်) တစ်ခု ထိန်းသိမ်းမထားပဲ — caller ကိုယ်တိုင်က strong reference ကို ကိုင်ထားဖို့ မျှော်လင့်ထားပါတယ်။ ဒါကို ပြောင်းလဲလိုက်ပါပြီ — အကြောင်းကတော့ — memory leaks တွေ မဖြစ်အောင် — `napi_async_init()` ခေါ်ယူမှုတိုင်းအတွက် သက်ဆိုင်ရာ [`napi_async_destroy`][] ခေါ်ယူမှုတစ်ခုက ဘယ်အခြေအနေမှာပဲ ဖြစ်ဖြစ် မဖြစ်မနေ လိုအပ်နေလို့ပါ။

### `napi_async_destroy`

```c
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] async_context`: ဖျက်သိမ်းရမယ့် async context ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API ကို — pending JavaScript exception တစ်ခု ရှိနေရင်တောင် — ခေါ်ယူနိုင်ပါတယ်။

### `napi_make_callback`

```c
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] async_context`: Callback ကို ခေါ်ယူနေတဲ့ async operation အတွက် context ပါ။ ပုံမှန်အားဖြင့် — ဒါက [`napi_async_init`][] ကနေ အရင်က ရယူထားတဲ့ တန်ဖိုး ဖြစ်သင့်ပါတယ်။ ယခင် versions တွေနဲ့ ABI လိုက်ဖက်ညီမှုကို ထိန်းသိမ်းဖို့ — `async_context` အတွက် `NULL` ကို ဖြတ်သန်းပေးတာက error မဖြစ်စေပေမယ့် — ဒါက async hooks တွေရဲ့ မှားယွင်းတဲ့ လည်ပတ်မှုကို ဖြစ်ပေါ်စေပါတယ်။ ဖြစ်နိုင်ခြေရှိတဲ့ ပြဿနာတွေထဲမှာ — `AsyncLocalStorage` API ကို သုံးတဲ့အခါ async context ဆုံးရှုံးမှု ပါဝင်ပါတယ်။
* `[in] recv`: ခေါ်ယူလိုက်တဲ့ function ဆီကို ဖြတ်သန်းပေးတဲ့ `this` တန်ဖိုးပါ။
* `[in] func`: ခေါ်ယူရမယ့် JavaScript function ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။
* `[in] argc`: `argv` array ထဲက elements အရေအတွက်ပါ။
* `[in] argv`: Function ဆီကို ဖြတ်သန်းပေးမယ့် arguments တွေကို `napi_value` အနေနဲ့ ကိုယ်စားပြုတဲ့ JavaScript values တွေရဲ့ array ပါ။ `argc` က သုည ဖြစ်နေရင် — `NULL` ကို ဖြတ်သန်းပေးပြီး ဒီ parameter ကို ချန်လှပ်ထားနိုင်ပါတယ်။
* `[out] result`: ပြန်ပေးလိုက်တဲ့ JavaScript object ကို ကိုယ်စားပြုတဲ့ `napi_value` ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ method က — JavaScript function object တစ်ခုကို native add-on တစ်ခုကနေ ခေါ်ယူနိုင်စေပါတယ်။ ဒီ API က `napi_call_function` နဲ့ ဆင်တူပါတယ်။ ဒါပေမယ့် — async operation တစ်ခုကနေ ပြန်လည် ထွက်ပြီးနောက်မှာ (stack ပေါ်မှာ တခြား script မရှိတော့တဲ့အခါ) — native code ကနေ JavaScript ဆီကို _ပြန်လည် ဝင်ရောက် ခေါ်ယူရန် (back into)_ သုံးပါတယ်။ ၎င်းက `node::MakeCallback` ရဲ့ ရိုးရိုးရှင်းရှင်း wrapper တစ်ခုပါ။

`napi_async_complete_callback` တစ်ခုရဲ့ အတွင်းကနေ `napi_make_callback` ကို သုံးဖို့တော့ _မလို (not necessary)_ ပါဘူး — အဲဒီအခြေအနေမှာ callback ရဲ့ async context ကို စနစ်တကျ သတ်မှတ်ပြီးသား ဖြစ်နေလို့ — `napi_call_function` ကို တိုက်ရိုက် ခေါ်ယူတာက လုံလောက်ပြီး သင့်လျော်ပါတယ်။ `napi_create_async_work` ကို မသုံးတဲ့ custom async အပြုအမူတွေကို implement လုပ်တဲ့အခါမှာတော့ `napi_make_callback` function ကို သုံးဖို့ လိုအပ်နိုင်ပါတယ်။

Callback အတွင်းမှာ JavaScript က microtask queue ပေါ်မှာ အချိန်ဇယား ဆွဲထားတဲ့ `process.nextTick`s တွေ သို့မဟုတ် Promises တွေက — C/C++ ဆီကို ပြန်မသွားခင် — run လုပ်ပြီးသွားပါတယ်။

### `napi_open_callback_scope`

```c
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] resource_object`: `async_hooks` [`init` hooks][] တွေဆီကို ဖြတ်သန်းပေးနိုင်တဲ့ — async work နဲ့ ဆက်စပ်နေတဲ့ object တစ်ခုပါ။ ဒီ parameter ကို deprecated (အသုံးပြုမှု ရပ်ဆိုင်း) လုပ်ထားပြီး — runtime မှာ လျစ်လျူရှုခံရပါတယ်။ အဲဒီအစား [`napi_async_init`][] ထဲက `async_resource` parameter ကို သုံးပါ။
* `[in] context`: Callback ကို ခေါ်ယူနေတဲ့ async operation အတွက် context ပါ။ ဒါက [`napi_async_init`][] ကနေ အရင်က ရယူထားတဲ့ တန်ဖိုး ဖြစ်သင့်ပါတယ်။
* `[out] result`: အသစ် ဖန်တီးလိုက်တဲ့ scope ပါ။

တစ်ချို့ Node-API calls တွေ လုပ်တဲ့အခါ — callback တစ်ခုနဲ့ ဆက်စပ်တဲ့ scope နဲ့ ညီမျှတဲ့အရာ တစ်ခု ရှိနေဖို့ လိုအပ်တဲ့ အခြေအနေတွေ (ဥပမာ — promises တွေကို resolve လုပ်ခြင်း) ရှိပါတယ်။ Stack ပေါ်မှာ တခြား script မရှိဘူးဆိုရင် — [`napi_open_callback_scope`][] နဲ့ [`napi_close_callback_scope`][] functions တွေကို သုံးပြီး လိုအပ်တဲ့ scope ကို ဖွင့်/ပိတ်နိုင်ပါတယ်။

### `napi_close_callback_scope`

```c
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] scope`: ပိတ်သိမ်းရမယ့် scope ပါ။

ဒီ API ကို — pending JavaScript exception တစ်ခု ရှိနေရင်တောင် — ခေါ်ယူနိုင်ပါတယ်။

## Version စီမံခန့်ခွဲမှု (Version management)

### `napi_get_node_version`

```c
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] version`: Node.js ကိုယ်တိုင်ရဲ့ version အချက်အလက်တွေဆီကို ညွှန်ပြတဲ့ pointer ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ function က — လက်ရှိ run နေတဲ့ Node.js ရဲ့ major, minor နဲ့ patch versions တွေနဲ့အတူ `version` struct ကို ဖြည့်သွင်းပေးပြီး — `release` field ကိုတော့ [`process.release.name`][`process.release`] ရဲ့ တန်ဖိုးနဲ့ ဖြည့်သွင်းပေးပါတယ်။

ပြန်ပေးလိုက်တဲ့ buffer က statically allocate လုပ်ထားတာမို့ — free လုပ်ဖို့ မလိုအပ်ပါဘူး။

### `napi_get_version`

```c
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Support လုပ်ထားတဲ့ Node-API ရဲ့ အမြင့်ဆုံး version ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က Node.js runtime က support လုပ်ထားတဲ့ အမြင့်ဆုံး Node-API version ကို ပြန်ပေးပါတယ်။ Node-API က additive (ပေါင်းထည့်လို့ရသော) သဘောမျိုး ဖြစ်ဖို့ စီစဉ်ထားပြီး — Node.js ရဲ့ အသစ်သော releases တွေက API functions အသစ်တွေကို ထပ်ဆောင်း support လုပ်နိုင်ပါတယ်။ Addon တစ်ခုအနေနဲ့ — support လုပ်တဲ့ Node.js versions တွေနဲ့ run နေတဲ့အခါ function အသစ်တစ်ခုကို သုံးနိုင်စေဖို့ နဲ့ — support မလုပ်တဲ့ Node.js versions တွေနဲ့ run နေတဲ့အခါ fallback အပြုအမူတွေ ပေးနိုင်စေဖို့ အတွက်:

* `napi_get_version()` ကို ခေါ်ပြီး API က ရနိုင်လားဆိုတာ ဆုံးဖြတ်ပါ။
* ရနိုင်ရင် — `uv_dlsym()` ကို သုံးပြီး function ဆီကို ညွှန်ပြတဲ့ pointer တစ်ခုကို dynamically load လုပ်ပါ။
* Dynamically load လုပ်ထားတဲ့ pointer ကို သုံးပြီး function ကို ခေါ်ယူပါ။
* Function မရနိုင်ဘူးဆိုရင် — အဲဒီ function ကို မသုံးတဲ့ အစားထိုး implementation တစ်ခုကို ပေးအပ်ပါ။

## Memory စီမံခန့်ခွဲမှု (Memory management)

### `napi_adjust_external_memory`

```c
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] change_in_bytes`: JavaScript objects တွေက သက်တမ်း ဆက်ရှင်နေစေတဲ့ externally allocated memory ထဲမှာ ဖြစ်ပေါ်လာတဲ့ အပြောင်းအလဲ ပမာဏပါ။
* `[out] result`: ချိန်ညှိပြီးသား တန်ဖိုးပါ။ ဒီတန်ဖိုးက — ပေးထားတဲ့ `change_in_bytes` ပါဝင်တဲ့ — external memory ရဲ့ စုစုပေါင်း ပမာဏကို ထင်ဟပ် ဖော်ပြသင့်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ တန်ဖိုးရဲ့ absolute value ကိုတော့ အားကိုးမထားသင့်ပါဘူး။ ဥပမာ — implementations တွေက addons အားလုံးအတွက် counter တစ်ခုတည်း သို့မဟုတ် — addon တစ်ခုချင်းစီအတွက် counter တစ်ခုစီ သုံးနိုင်ပါတယ်။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ function က — JavaScript objects တွေက သက်တမ်း ဆက်ရှင်နေစေတဲ့ (ဆိုလိုတာက — native addon တစ်ခုက ၎င်းအတွက် allocate လုပ်ပေးထားတဲ့ memory ကို ညွှန်ပြနေတဲ့ JavaScript object တစ်ခု) — externally allocated memory ပမာဏရဲ့ အချက်အလက်ကို runtime ဆီကို ပေးပါတယ်။ Externally allocated memory ကို register လုပ်တာက — အာမခံချက် မရှိပေမယ့် — သာမန်ထက် global garbage collections တွေကို ပိုပြီး မကြာခဏ trigger လုပ်စေနိုင်ပါတယ်။

ဒီ function ကို — addon တစ်ခုအနေနဲ့ ၎င်း တိုးပေးခဲ့တဲ့ external memory ထက် ပိုပြီး external memory ကို လျှော့ချမသွားစေမယ့် ပုံစံမျိုးနဲ့ — ခေါ်ယူဖို့ မျှော်လင့်ထားပါတယ်။

## Promise များ (Promises)

Node-API က — ECMA specification ရဲ့ [Section Promise objects][] မှာ ဖော်ပြထားတဲ့အတိုင်း — `Promise` objects တွေကို ဖန်တီးဖို့အတွက် ပံ့ပိုးမှုတွေ ပေးပါတယ်။ ၎င်းက promises တွေကို object နှစ်ခုပါတဲ့ အတွဲအနေနဲ့ implement လုပ်ပါတယ်။ `napi_create_promise()` နဲ့ promise တစ်ခုကို ဖန်တီးတဲ့အခါ — "deferred" object တစ်ခုကို ဖန်တီးပြီး `Promise` နဲ့အတူ ပြန်ပေးပါတယ်။ Deferred object က ဖန်တီးလိုက်တဲ့ `Promise` နဲ့ ချိတ်ဆက်ထားပြီး — `napi_resolve_deferred()` သို့မဟုတ် `napi_reject_deferred()` ကို သုံးပြီး `Promise` ကို resolve သို့မဟုတ် reject လုပ်ဖို့ — တစ်ခုတည်းသော နည်းလမ်း ဖြစ်ပါတယ်။ `napi_create_promise()` က ဖန်တီးပေးတဲ့ deferred object ကို `napi_resolve_deferred()` သို့မဟုတ် `napi_reject_deferred()` က free လုပ်ပေးပါတယ်။ `Promise` object ကို JavaScript ဆီကို ပြန်ပေးနိုင်ပြီး — အဲဒီမှာ ပုံမှန် နည်းလမ်းအတိုင်း သုံးစွဲနိုင်ပါတယ်။

ဥပမာ — promise တစ်ခုကို ဖန်တီးပြီး asynchronous worker တစ်ခုဆီကို ဖြတ်သန်းပေးဖို့:

```c
napi_deferred deferred;
napi_value promise;
napi_status status;

// Create the promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Pass the deferred to a function that performs an asynchronous action.
do_something_asynchronous(deferred);

// Return the promise to JS
return promise;
```

အပေါ်က `do_something_asynchronous()` function က ၎င်းရဲ့ asynchronous action ကို လုပ်ဆောင်ပြီး — deferred ကို resolve သို့မဟုတ် reject လုပ်ကာ — အဲဒီအားဖြင့် promise ကို နိဂုံးချုပ်ပြီး deferred ကို free လုပ်ပါလိမ့်မယ်:

```c
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Create a value with which to conclude the deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Resolve or reject the promise associated with the deferred depending on
// whether the asynchronous action succeeded.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// At this point the deferred has been freed, so we should assign NULL to it.
deferred = NULL;
```

### `napi_create_promise`

```c
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] deferred`: အသစ် ဖန်တီးလိုက်တဲ့ deferred object ပါ — ဒါကို နောက်ပိုင်းမှာ ဆက်စပ်နေတဲ့ promise ကို resolve သို့မဟုတ် reject လုပ်ဖို့ — `napi_resolve_deferred()` (သို့) `napi_reject_deferred()` ဆီကို အသီးသီး ဖြတ်သန်းပေးနိုင်ပါတယ်။
* `[out] promise`: Deferred object နဲ့ ဆက်စပ်နေတဲ့ JavaScript promise ပါ။

API အောင်မြင်ခဲ့ရင် `napi_ok` ကို ပြန်ပေးပါတယ်။

ဒီ API က deferred object တစ်ခုနဲ့ JavaScript promise တစ်ခုကို ဖန်တီးပေးပါတယ်။

### `napi_resolve_deferred`

```c
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] deferred`: ဆက်စပ်နေတဲ့ promise ကို resolve လုပ်ရမယ့် deferred object ပါ။
* `[in] resolution`: Promise ကို resolve လုပ်မယ့် တန်ဖိုးပါ။

ဒီ API က — JavaScript promise တစ်ခုကို ၎င်းနဲ့ ဆက်စပ်နေတဲ့ deferred object ကနေတစ်ဆင့် resolve လုပ်ပါတယ်။ ဒါကြောင့် — သက်ဆိုင်ရာ deferred object ရရှိနိုင်တဲ့ JavaScript promises တွေကိုသာ resolve လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ထိရောက်စွာ ဆိုရရင် — promise ကို `napi_create_promise()` ကို သုံးပြီး ဖန်တီးထားရမှာ ဖြစ်ပြီး — အဲဒီ call ကနေ ပြန်လာတဲ့ deferred object ကို — ဒီ API ဆီကို ဖြတ်သန်းပေးနိုင်ဖို့ — သိမ်းဆည်းထားရပါမယ်။

အောင်မြင်စွာ ပြီးမြောက်တာနဲ့ deferred object ကို free လုပ်ပါတယ်။

### `napi_reject_deferred`

```c
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] deferred`: ဆက်စပ်နေတဲ့ promise ကို reject လုပ်ရမယ့် deferred object ပါ။
* `[in] rejection`: Promise ကို reject လုပ်မယ့် တန်ဖိုးပါ။

ဒီ API က — JavaScript promise တစ်ခုကို ၎င်းနဲ့ ဆက်စပ်နေတဲ့ deferred object ကနေတစ်ဆင့် reject လုပ်ပါတယ်။ ဒါကြောင့် — သက်ဆိုင်ရာ deferred object ရရှိနိုင်တဲ့ JavaScript promises တွေကိုသာ reject လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ထိရောက်စွာ ဆိုရရင် — promise ကို `napi_create_promise()` ကို သုံးပြီး ဖန်တီးထားရမှာ ဖြစ်ပြီး — အဲဒီ call ကနေ ပြန်လာတဲ့ deferred object ကို — ဒီ API ဆီကို ဖြတ်သန်းပေးနိုင်ဖို့ — သိမ်းဆည်းထားရပါမယ်။

အောင်မြင်စွာ ပြီးမြောက်တာနဲ့ deferred object ကို free လုပ်ပါတယ်။

### `napi_is_promise`

```c
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] value`: စစ်ဆေးရမယ့် တန်ဖိုးပါ။
* `[out] is_promise`: `promise` က native promise object (ဆိုလိုတာက — အောက်ခြေ engine က ဖန်တီးထားတဲ့ promise object) ဟုတ်/မဟုတ် ဖော်ပြတဲ့ flag ပါ။

## Script လုပ်ဆောင်ခြင်း (Script execution)

Node-API က — အောက်ခြေ JavaScript engine ကို သုံးပြီး — JavaScript ပါဝင်တဲ့ string တစ်ခုကို execute လုပ်ဖို့ API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

### `napi_run_script`

```c
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] script`: Execute လုပ်ရမယ့် script ပါဝင်တဲ့ JavaScript string ပါ။
* `[out] result`: Script ကို execute လုပ်လိုက်လို့ ရလာတဲ့ တန်ဖိုးပါ။

ဒီ function က JavaScript code တစ်ခုရဲ့ string ကို execute လုပ်ပြီး — အောက်ပါ သတိပြုစရာတွေ (caveats) နဲ့အတူ — ၎င်းရဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်:

* `eval` နဲ့ မတူပဲ — ဒီ function က script ကို လက်ရှိ lexical scope ကို ဝင်ရောက်ခွင့် မပေးပါဘူး — ဒါကြောင့် [module scope][] ကိုလည်း ဝင်ရောက်ခွင့် မရှိစေပဲ — `require` လိုမျိုး pseudo-globals တွေ ရနိုင်မှာ မဟုတ်ပါဘူး။
* Script က [global scope][] ကိုတော့ ဝင်ရောက်နိုင်ပါတယ်။ Script ထဲက Function နဲ့ `var` declarations တွေကို [`global`][] object ဆီကို ပေါင်းထည့်ပါလိမ့်မယ်။ `let` နဲ့ `const` ကို သုံးပြီး လုပ်ထားတဲ့ variable declarations တွေက globally မြင်ရနိုင်ပေမယ့် — [`global`][] object ဆီကိုတော့ ပေါင်းထည့်မှာ မဟုတ်ပါဘူး။
* Script အတွင်းမှာ `this` ရဲ့ တန်ဖိုးက [`global`][] ဖြစ်ပါတယ်။

## libuv ၏ event loop (libuv event loop)

Node-API က — သတ်မှတ်ထားတဲ့ `napi_env` တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ လက်ရှိ event loop ကို ရယူဖို့ function တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

### `napi_get_uv_event_loop`

```c
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] loop`: လက်ရှိ libuv loop instance ပါ။

မှတ်ချက်: libuv က [ABI stability ကို အာမခံတာ](https://github.com/libuv/libuv?tab=readme-ov-file#versioning) major version တစ်ခုအတွင်းမှာသာ ဖြစ်ပေမယ့် — ၎င်းကို သုံးစွဲတာက Node.js major versions တွေကို ဖြတ်ပြီး အလုပ်မလုပ်နိုင်တဲ့ addon တစ်ခုကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။

[ThreadSafeFunction](#asynchronous-thread-safe-function-calls) က — တခြား thread တစ်ခုကနေ JavaScript thread ဆီကို ခေါ်ဝင်ရောက်ဖို့ လိုအပ်တဲ့ use cases အများအပြားအတွက် — ABI-stable အစားထိုး (alternative) တစ်ခု ဖြစ်ပါတယ်။

## Asynchronous thread-safe function ခေါ်ဆိုမှုများ (Asynchronous thread-safe function calls)

JavaScript functions တွေကို ပုံမှန်အားဖြင့် native addon တစ်ခုရဲ့ main thread ကနေသာ ခေါ်ယူနိုင်ပါတယ်။ Addon တစ်ခုက ထပ်ဆောင်း threads တွေ ဖန်တီးထားရင် — `napi_env`, `napi_value` (သို့) `napi_ref` တစ်ခုကို လိုအပ်တဲ့ Node-API functions တွေကို အဲဒီ threads တွေကနေ ခေါ်ယူလို့ မရပါဘူး။

Addon တစ်ခုမှာ ထပ်ဆောင်း threads တွေ ရှိပြီး — အဲဒီ threads တွေ ပြီးမြောက်အောင် လုပ်ဆောင်ခဲ့တဲ့ processing တွေအပေါ် အခြေခံပြီး JavaScript functions တွေကို ခေါ်ယူဖို့ လိုအပ်တဲ့အခါ — အဲဒီ threads တွေက addon ရဲ့ main thread နဲ့ ဆက်သွယ်ရပါမယ် — main thread က ၎င်းတို့ ကိုယ်စား JavaScript function ကို ခေါ်ယူနိုင်ဖို့ပါ။ Thread-safe function APIs တွေက ဒါကို လုပ်ဆောင်ဖို့ လွယ်ကူတဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။

ဒီ APIs တွေက `napi_threadsafe_function` type ကိုရော — ဒီ type ရဲ့ objects တွေကို ဖန်တီး၊ ဖျက်သိမ်း၊ ခေါ်ယူဖို့ APIs တွေကိုပါ ပေးပါတယ်။ `napi_create_threadsafe_function()` က — threads အများအပြားကနေ ခေါ်ယူနိုင်တဲ့ JavaScript function တစ်ခုကို ကိုင်ဆောင်ထားတဲ့ `napi_value` ဆီကို persistent reference (စွဲမြဲသော ရည်ညွှန်းချက်) တစ်ခုကို ဖန်တီးပေးပါတယ်။ ခေါ်ယူမှုတွေက asynchronously ဖြစ်ပွားပါတယ်။ ဆိုလိုတာက — JavaScript callback ကို ခေါ်ယူရာမှာ သုံးမယ့် values တွေကို queue တစ်ခုထဲမှာ ထည့်ထားပြီး — queue ထဲက value တစ်ခုချင်းစီအတွက် — JavaScript function ဆီကို နောက်ဆုံးမှာ ခေါ်ယူမှု တစ်ခု ပြုလုပ်ပေးပါလိမ့်မယ်။

`napi_threadsafe_function` တစ်ခုကို ဖန်တီးတဲ့အခါ — `napi_finalize` callback တစ်ခုကို ပေးအပ်နိုင်ပါတယ်။ ဒီ callback ကို — thread-safe function ကို destroy လုပ်တော့မယ့်အခါ — main thread ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။ ၎င်းက တည်ဆောက်စဉ် (construction) အတွင်း ပေးအပ်ခဲ့တဲ့ context နဲ့ finalize data တွေကို လက်ခံရရှိပြီး — ဥပမာ `uv_thread_join()` ကို ခေါ်ခြင်းအားဖြင့် — threads တွေရဲ့ နောက်ကွယ်မှာ ရှင်းလင်းရေး (cleanup) လုပ်ဖို့ အခွင့်အရေး တစ်ခုကို ပေးပါတယ်။ **Main loop thread ကလွဲလို့ — finalize callback ပြီးဆုံးသွားပြီးနောက်မှာ — ဘယ် thread ကမှ thread-safe function ကို သုံးစွဲနေဖို့ မသင့်ပါဘူး။**

`napi_create_threadsafe_function()` ကို ခေါ်ယူစဉ် ပေးအပ်ခဲ့တဲ့ `context` ကို — `napi_get_threadsafe_function_context()` ကို ခေါ်ယူခြင်းအားဖြင့် — ဘယ် thread ကနေမဆို ပြန်လည် ရယူနိုင်ပါတယ်။

### Thread-safe function တစ်ခုကို ခေါ်ဆိုခြင်း (Calling a thread-safe function)

`napi_call_threadsafe_function()` ကို — JavaScript ဆီကို ခေါ်ယူမှုတစ်ခုကို စတင်ဖို့ သုံးနိုင်ပါတယ်။ `napi_call_threadsafe_function()` က — API က blocking သဘောမျိုး ပြုမူမလား မပြုမူလားကို ထိန်းချုပ်ပေးတဲ့ parameter တစ်ခုကို လက်ခံပါတယ်။ `napi_tsfn_nonblocking` အဖြစ် သတ်မှတ်ထားရင် — API က non-blocking သဘောမျိုး ပြုမူပြီး — queue ပြည့်နေရင် `napi_queue_full` ကို ပြန်ပေးကာ — data ကို queue ထဲကို အောင်မြင်စွာ ထည့်သွင်းခြင်းကနေ တားဆီးပါတယ်။ `napi_tsfn_blocking` အဖြစ် သတ်မှတ်ထားရင်တော့ — queue ထဲမှာ နေရာလွတ် ရရှိလာသည်အထိ API က block လုပ်ပါတယ်။ `napi_call_threadsafe_function()` က — thread-safe function ကို maximum queue size 0 နဲ့ ဖန်တီးထားရင် — ဘယ်တော့မှ block လုပ်မှာ မဟုတ်ပါဘူး။

`napi_call_threadsafe_function()` ကို JavaScript thread တစ်ခုကနေ `napi_tsfn_blocking` နဲ့ ခေါ်ယူလို့ မသင့်ပါဘူး — အကြောင်းကတော့ queue ပြည့်နေရင် — JavaScript thread ကို deadlock ဖြစ်စေနိုင်လို့ပါ။

JavaScript ဆီကို တကယ့် ခေါ်ယူမှုကို — `call_js_cb` parameter ကနေတစ်ဆင့် ပေးအပ်တဲ့ callback က ထိန်းချုပ်ပါတယ်။ `call_js_cb` ကို — `napi_call_threadsafe_function()` ဆီကို အောင်မြင်တဲ့ ခေါ်ယူမှုတစ်ခုအားဖြင့် queue ထဲကို ထည့်သွင်းခဲ့တဲ့ value တစ်ခုချင်းစီအတွက် — main thread ပေါ်မှာ တစ်ကြိမ်စီ ခေါ်ယူပါတယ်။ အဲဒီလို callback တစ်ခု မပေးအပ်ထားဘူးဆိုရင် — default callback တစ်ခုကို သုံးပြီး — ရလာတဲ့ JavaScript call မှာ arguments တွေ ပါဝင်မှာ မဟုတ်ပါဘူး။ `call_js_cb` callback က — ၎င်းရဲ့ parameters တွေထဲမှာ — ခေါ်ယူရမယ့် JavaScript function ကို `napi_value` အနေနဲ့ လက်ခံရရှိပြီး — `napi_threadsafe_function` ကို ဖန်တီးတဲ့အခါ သုံးခဲ့တဲ့ `void*` context pointer ကိုရော — secondary threads တွေထဲက တစ်ခုခုက ဖန်တီးခဲ့တဲ့ နောက်ထပ် data pointer ကိုပါ လက်ခံရရှိပါတယ်။ အဲဒီနောက် callback က JavaScript ဆီကို ခေါ်ယူဖို့ `napi_call_function()` လိုမျိုး API တစ်ခုကို သုံးနိုင်ပါတယ်။

Callback ကို — free လုပ်ဖို့ လိုအပ်နိုင်တဲ့ items တွေ queue ထဲမှာ ကျန်ရှိနေတုန်းမှာ — JavaScript ဆီကို ခေါ်ယူမှုတွေ နောက်ထပ် မဖြစ်နိုင်တော့ကြောင်း ဖော်ပြဖို့ — `env` ရော `call_js_cb` ပါ `NULL` အဖြစ် သတ်မှတ်ပြီးတော့လည်း ခေါ်ယူခံရနိုင်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် — thread-safe function တစ်ခု တက်ကြွနေဆဲ ဖြစ်ချိန်မှာ — Node.js process က ထွက်ခွာသွားတဲ့အခါ ဖြစ်ပွားပါတယ်။

`napi_make_callback()` ကနေတစ်ဆင့် JavaScript ဆီကို ခေါ်ယူဖို့ မလိုအပ်ပါဘူး — အကြောင်းကတော့ Node-API က `call_js_cb` ကို callbacks တွေအတွက် သင့်လျော်တဲ့ context တစ်ခုမှာ run လုပ်ပေးလို့ပါ။

Event loop ရဲ့ tick တစ်ခုချင်းစီမှာ — queue တန်းစီထားတဲ့ items သုည ခု သို့မဟုတ် တစ်ခုထက်ပိုတာတွေကို ခေါ်ယူနိုင်ပါတယ်။ Applications တွေက — အချိန် ရှေ့ဆက် ရွေ့လျားလာတာနဲ့အမျှ — callbacks တွေကို ခေါ်ယူရာမှာ တိုးတက်မှု ဖြစ်ပေါ်ပြီး events တွေ ခေါ်ယူခံရမယ်ဆိုတာကလွဲလို့ — တိကျတဲ့ အပြုအမူ တစ်ခုခုကို အားကိုးမထားသင့်ပါဘူး။

### Thread-safe functions များ၏ reference counting (Reference counting of thread-safe functions)

Threads တွေကို `napi_threadsafe_function` object တစ်ခုရဲ့ သက်တမ်း အတွင်းမှာ ထည့်သွင်းနိုင်သလို ဖယ်ရှားလည်း နိုင်ပါတယ်။ ဒါကြောင့် — ဖန်တီးစဉ်မှာ ကနဦး threads အရေအတွက်ကို သတ်မှတ်ပေးတာအပြင် — thread အသစ်တစ်ခုက thread-safe function ကို စတင် အသုံးပြုတော့မယ်ဆိုတာ ဖော်ပြဖို့ — `napi_acquire_threadsafe_function` ကိုလည်း ခေါ်ယူနိုင်ပါတယ်။ အလားတူ — ရှိပြီးသား thread တစ်ခုက thread-safe function ကို အသုံးပြုတာ ရပ်တော့မယ်ဆိုတာ ဖော်ပြဖို့ — `napi_release_threadsafe_function` ကို ခေါ်ယူနိုင်ပါတယ်။

`napi_threadsafe_function` objects တွေကို — object ကို အသုံးပြုနေတဲ့ thread တိုင်းက `napi_release_threadsafe_function()` ကို ခေါ်ယူပြီးတဲ့အခါ သို့မဟုတ် — `napi_call_threadsafe_function` ဆီကို ခေါ်ယူမှုကို တုံ့ပြန်တဲ့အနေနဲ့ — `napi_closing` ဆိုတဲ့ return status တစ်ခုကို လက်ခံရရှိပြီးတဲ့အခါ — destroy လုပ်ပါတယ်။ `napi_threadsafe_function` ကို destroy မလုပ်ခင် queue ကို ဗလာ ဖြစ်အောင် လုပ်ပါတယ်။ `napi_release_threadsafe_function()` က ပေးထားတဲ့ `napi_threadsafe_function` တစ်ခုနဲ့ ဆက်စပ်၍ ပြုလုပ်တဲ့ နောက်ဆုံး API call ဖြစ်သင့်ပါတယ် — အကြောင်းကတော့ — call ပြီးဆုံးသွားပြီးနောက်မှာ `napi_threadsafe_function` က allocate လုပ်ထားဆဲ ရှိနေဦးမယ်ဆိုတဲ့ အာမခံချက် မရှိတော့လို့ပါ။ အလားတူ အကြောင်းပြချက်အတွက် — `napi_call_threadsafe_function` ဆီကို ခေါ်ယူမှုကို တုံ့ပြန်တဲ့အနေနဲ့ `napi_closing` ဆိုတဲ့ return တန်ဖိုး တစ်ခုကို လက်ခံရရှိပြီးနောက်မှာ — thread-safe function တစ်ခုကို သုံးစွဲလို့ မရတော့ပါဘူး။ `napi_threadsafe_function` နဲ့ ဆက်စပ်နေတဲ့ data တွေကို — `napi_create_threadsafe_function()` ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ — ၎င်းရဲ့ `napi_finalize` callback ထဲမှာ free လုပ်နိုင်ပါတယ်။ `napi_create_threadsafe_function` ရဲ့ `initial_thread_count` parameter က — ဖန်တီးချိန်မှာ `napi_acquire_threadsafe_function` ကို အကြိမ်များစွာ ခေါ်ယူနေစရာ မလိုပဲ — thread-safe functions တွေရဲ့ ကနဦး acquisitions အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။

`napi_threadsafe_function` တစ်ခုကို အသုံးပြုနေတဲ့ threads အရေအတွက် သုညကို ရောက်ရှိသွားတာနဲ့ — နောက်ထပ် threads တွေက `napi_acquire_threadsafe_function()` ကို ခေါ်ယူပြီး ၎င်းကို အသုံးပြုတာ စတင်လို့ မရတော့ပါဘူး။ တကယ်တော့ — `napi_release_threadsafe_function()` ကလွဲလို့ — ၎င်းနဲ့ ဆက်စပ်တဲ့ နောက်ပိုင်း API calls တွေ အားလုံးက — `napi_closing` ဆိုတဲ့ error တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။

Thread-safe function ကို — `napi_release_threadsafe_function()` ဆီကို `napi_tsfn_abort` ဆိုတဲ့ တန်ဖိုးတစ်ခု ပေးအပ်ခြင်းအားဖြင့် — "abort" လုပ်နိုင်ပါတယ်။ ဒါက — thread-safe function ရဲ့ reference count သုညကို မရောက်ရှိသေးခင်မှာတောင် — `napi_release_threadsafe_function()` ကလွဲလို့ — thread-safe function နဲ့ ဆက်စပ်တဲ့ နောက်ပိုင်း APIs တွေ အားလုံးကို `napi_closing` ပြန်ပေးစေပါလိမ့်မယ်။ အထူးသဖြင့် — `napi_call_threadsafe_function()` က `napi_closing` ကို ပြန်ပေးပါလိမ့်မယ် — ဒါကြောင့် thread-safe function ဆီကို asynchronous calls တွေ ထပ်လုပ်ဖို့ မဖြစ်နိုင်တော့ကြောင်း threads တွေကို အသိပေးပါတယ်။ ဒါကို thread ကို အဆုံးသတ်ဖို့အတွက် စံသတ်မှတ်ချက် (criterion) တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ **`napi_call_threadsafe_function()` ကနေ `napi_closing` ဆိုတဲ့ return တန်ဖိုးတစ်ခုကို လက်ခံရရှိတာနဲ့ — thread တစ်ခုက thread-safe function ကို နောက်ထပ် သုံးစွဲလို့ မရတော့ပါဘူး — အကြောင်းကတော့ ၎င်းက allocate လုပ်ထားဆဲ ဖြစ်မယ်ဆိုတဲ့ အာမခံချက် မရှိတော့လို့ပါ။**

### Process ကို ဆက်လက် လည်ပတ်စေရန် ဆုံးဖြတ်ခြင်း (Deciding whether to keep the process running)

libuv handles တွေလိုပဲ — thread-safe functions တွေကို "referenced" (ရည်ညွှန်းထားသော) နဲ့ "unreferenced" (ရည်ညွှန်းမထားသော) အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ "Referenced" thread-safe function တစ်ခုက — ၎င်းကို ဖန်တီးထားတဲ့ thread ပေါ်က event loop ကို — thread-safe function ကို destroy လုပ်လိုက်သည့်တိုင်အောင် — ဆက်လက် ရှင်သန်နေစေပါလိမ့်မယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — "unreferenced" thread-safe function တစ်ခုက event loop ကို ထွက်ခွာသွားခြင်းကနေ တားဆီးမှာ မဟုတ်ပါဘူး။ ဒီရည်ရွယ်ချက်အတွက် `napi_ref_threadsafe_function` နဲ့ `napi_unref_threadsafe_function` APIs တွေ တည်ရှိပါတယ်။

`napi_unref_threadsafe_function` က thread-safe functions တွေကို destroy လုပ်လို့ရတဲ့ အခြေအနေအဖြစ် သတ်မှတ်ပေးတာလည်း မဟုတ်သလို — `napi_ref_threadsafe_function` ကလည်း ၎င်းတို့ကို destroy လုပ်ခြင်းကနေ တားဆီးပေးတာ မဟုတ်ပါဘူး။

### `napi_create_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] func`: တခြား thread တစ်ခုကနေ ခေါ်ယူရမယ့် Optional JavaScript function ပါ။ `call_js_cb` ဆီကို `NULL` ဖြတ်သန်းပေးထားရင် ဒါကို မဖြစ်မနေ ပေးအပ်ရပါမယ်။
* `[in] async_resource`: `async_hooks` [`init` hooks][] တွေဆီကို ဖြတ်သန်းပေးနိုင်တဲ့ — async work နဲ့ ဆက်စပ်နေတဲ့ Optional object ပါ။
* `[in] async_resource_name`: `async_hooks` API က ထုတ်ဖော် ပေးအပ်တဲ့ diagnostic information တွေအတွက် — ပေးအပ်လိုက်တဲ့ resource အမျိုးအစားကို ခွဲခြားသတ်မှတ်ပေးမယ့် identifier ကို ထောက်ပံ့ပေးဖို့ JavaScript string တစ်ခုပါ။
* `[in] max_queue_size`: Queue ရဲ့ အများဆုံး အရွယ်အစားပါ။ ကန့်သတ်ချက် မရှိဖို့ `0` ပါ။
* `[in] initial_thread_count`: ကနဦး acquisitions အရေအတွက်ပါ — ဆိုလိုတာက — ဒီ function ကို အသုံးပြုမယ့် — main thread အပါအဝင် — ကနဦး threads အရေအတွက် ဖြစ်ပါတယ်။
* `[in] thread_finalize_data`: `thread_finalize_cb` ဆီကို ဖြတ်သန်းပေးရမယ့် Optional data ပါ။
* `[in] thread_finalize_cb`: `napi_threadsafe_function` ကို destroy လုပ်နေတဲ့အခါ ခေါ်ယူရမယ့် Optional function ပါ။
* `[in] context`: ရလာတဲ့ `napi_threadsafe_function` ဆီကို တွဲချိတ်ဖို့ Optional data ပါ။
* `[in] call_js_cb`: တခြား thread တစ်ခုပေါ်က ခေါ်ယူမှုကို တုံ့ပြန်တဲ့အနေနဲ့ JavaScript function ကို ခေါ်ယူပေးတဲ့ Optional callback ပါ။ ဒီ callback ကို main thread ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။ မပေးအပ်ထားဘူးဆိုရင် — JavaScript function ကို parameters မပါပဲ — `this` တန်ဖိုး `undefined` နဲ့ — ခေါ်ယူပါလိမ့်မယ်။ [`napi_threadsafe_function_call_js`][] မှာ ပိုမို အသေးစိတ် ဖော်ပြထားပါတယ်။
* `[out] result`: Asynchronous thread-safe JavaScript function ပါ။

**Change History:**

* Version 10 (`NAPI_VERSION` is defined as `10` or higher):

  `call_js_cb` ထဲမှာ throw လုပ်လိုက်တဲ့ uncaught exceptions တွေကို — လျစ်လျူရှုခံရမယ့်အစား — [`'uncaughtException'`][] event နဲ့ ကိုင်တွယ်ပါတယ်။

### `napi_get_threadsafe_function_context`

```c
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```

* `[in] func`: Context ကို ပြန်လည် ရယူလိုတဲ့ thread-safe function ပါ။
* `[out] result`: Context ကို သိမ်းဆည်းရမယ့် နေရာပါ။

ဒီ API ကို — `func` ကို အသုံးပြုနေတဲ့ — ဘယ် thread ကနေမဆို ခေါ်ယူနိုင်ပါတယ်။

### `napi_call_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```

* `[in] func`: ခေါ်ယူရမယ့် asynchronous thread-safe JavaScript function ပါ။
* `[in] data`: Thread-safe JavaScript function ကို ဖန်တီးစဉ် ပေးအပ်ခဲ့တဲ့ `call_js_cb` callback ကနေတစ်ဆင့် JavaScript ဆီကို ပို့လွှတ်ရမယ့် data ပါ။
* `[in] is_blocking`: ဒီ flag ရဲ့ တန်ဖိုးက — queue ပြည့်နေရင် call က block လုပ်သင့်တယ်ဆိုတာ ဖော်ပြဖို့ `napi_tsfn_blocking` (သို့) — queue ပြည့်နေတိုင်း call က `napi_queue_full` ဆိုတဲ့ status နဲ့ ချက်ချင်း ပြန်သင့်တယ်ဆိုတာ ဖော်ပြဖို့ `napi_tsfn_nonblocking` — ဖြစ်နိုင်ပါတယ်။

ဒီ API ကို JavaScript thread တစ်ခုကနေ `napi_tsfn_blocking` နဲ့ ခေါ်ယူလို့ မသင့်ပါဘူး — အကြောင်းကတော့ queue ပြည့်နေရင် — JavaScript thread ကို deadlock ဖြစ်စေနိုင်လို့ပါ။

ဒီ API က — ဘယ် thread ကနေမဆို `napi_release_threadsafe_function()` ကို `abort` ကို `napi_tsfn_abort` အဖြစ် သတ်မှတ်ပြီး ခေါ်ယူခဲ့ရင် — `napi_closing` ကို ပြန်ပေးပါလိမ့်မယ်။ တန်ဖိုးကို — API က `napi_ok` ပြန်ပေးမှသာ — queue ထဲကို ထည့်သွင်းပါတယ်။

ဒီ API ကို — `func` ကို အသုံးပြုနေတဲ့ — ဘယ် thread ကနေမဆို ခေါ်ယူနိုင်ပါတယ်။

### `napi_acquire_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```

* `[in] func`: စတင် အသုံးပြုတော့မယ့် asynchronous thread-safe JavaScript function ပါ။

Thread တစ်ခုက — ၎င်းက `func` ကို အသုံးပြုတော့မယ်ဆိုတာ ဖော်ပြဖို့ — `func` ကို တခြား thread-safe function APIs တွေဆီကို မဖြတ်သန်းခင် ဒီ API ကို ခေါ်ယူသင့်ပါတယ်။ ဒါက — တခြား threads တွေ အားလုံး ၎င်းကို အသုံးပြုတာ ရပ်တန့်သွားတဲ့အခါ — `func` ကို destroy လုပ်ခံရခြင်းကနေ ကာကွယ်ပေးပါတယ်။

ဒီ API ကို — `func` ကို စတင် အသုံးပြုတော့မယ့် — ဘယ် thread ကနေမဆို ခေါ်ယူနိုင်ပါတယ်။

### `napi_release_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```

* `[in] func`: Reference count ကို လျှော့ချရမယ့် asynchronous thread-safe JavaScript function ပါ။
* `[in] mode`: ဒီ flag ရဲ့ တန်ဖိုးက — လက်ရှိ thread က thread-safe function ဆီကို နောက်ထပ် ခေါ်ယူမှုတွေ လုပ်တော့မှာ မဟုတ်ကြောင်း ဖော်ပြဖို့ `napi_tsfn_release` (သို့) — လက်ရှိ thread အပြင် — တခြား thread တစ်ခုကမှ thread-safe function ဆီကို နောက်ထပ် ခေါ်ယူမှုတွေ မလုပ်သင့်ကြောင်း ဖော်ပြဖို့ `napi_tsfn_abort` — ဖြစ်နိုင်ပါတယ်။ `napi_tsfn_abort` အဖြစ် သတ်မှတ်ထားရင် — `napi_call_threadsafe_function()` ဆီကို နောက်ထပ် ခေါ်ယူမှုတွေက `napi_closing` ကို ပြန်ပေးပြီး — queue ထဲကို တန်ဖိုးတွေ နောက်ထပ် ထည့်သွင်းမှာ မဟုတ်ပါဘူး။

Thread တစ်ခုက — `func` ကို အသုံးပြုတာ ရပ်တန့်လိုက်တဲ့အခါ ဒီ API ကို ခေါ်ယူသင့်ပါတယ်။ ဒီ API ကို ခေါ်ယူပြီးနောက်မှာ `func` ကို တခြား thread-safe APIs တွေဆီကို ဖြတ်သန်းပေးတာက undefined ရလဒ်တွေ ဖြစ်စေနိုင်ပါတယ် — `func` က destroy လုပ်ခံရပြီးသား ဖြစ်နေလို့ပါ။

ဒီ API ကို — `func` ကို အသုံးပြုတာ ရပ်တန့်တော့မယ့် — ဘယ် thread ကနေမဆို ခေါ်ယူနိုင်ပါတယ်။

### `napi_ref_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] func`: Reference လုပ်ရမယ့် thread-safe function ပါ။

ဒီ API က — main thread ပေါ်မှာ run နေတဲ့ event loop က `func` ကို destroy လုပ်လိုက်သည့်အထိ မထွက်ခွာသင့်ကြောင်း ဖော်ပြဖို့ သုံးပါတယ်။ [`uv_ref`][] လိုပဲ — ဒါကလည်း idempotent ဖြစ်ပါတယ်။

`napi_unref_threadsafe_function` က thread-safe functions တွေကို destroy လုပ်လို့ရတဲ့ အခြေအနေအဖြစ် သတ်မှတ်ပေးတာလည်း မဟုတ်သလို — `napi_ref_threadsafe_function` ကလည်း ၎င်းတို့ကို destroy လုပ်ခြင်းကနေ တားဆီးပေးတာ မဟုတ်ပါဘူး။ `napi_acquire_threadsafe_function` နဲ့ `napi_release_threadsafe_function` တို့က အဲဒီရည်ရွယ်ချက်အတွက် ရနိုင်ပါတယ်။

ဒီ API ကို main thread ကနေသာ ခေါ်ယူနိုင်ပါတယ်။

### `napi_unref_threadsafe_function`

```c
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[in] func`: Unreference လုပ်ရမယ့် thread-safe function ပါ။

ဒီ API က — main thread ပေါ်မှာ run နေတဲ့ event loop က `func` ကို destroy မလုပ်ရသေးခင်မှာတင် ထွက်ခွာသွားနိုင်ကြောင်း ဖော်ပြဖို့ သုံးပါတယ်။ [`uv_unref`][] လိုပဲ — ဒါကလည်း idempotent ဖြစ်ပါတယ်။

ဒီ API ကို main thread ကနေသာ ခေါ်ယူနိုင်ပါတယ်။

## အခြား utilities များ (Miscellaneous utilities)

### `node_api_get_module_file_name`

```c
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```

* `[in] env`: API ကို ခေါ်ယူထားတဲ့ environment ပါ။
* `[out] result`: Add-on ကို load လုပ်ခဲ့တဲ့ နေရာရဲ့ absolute path ပါဝင်တဲ့ URL တစ်ခုပါ။ Local file system ပေါ်က file တစ်ခုအတွက်ဆိုရင် `file://` နဲ့ စတင်ပါလိမ့်မယ်။ ဒီ string က null-terminated ဖြစ်ပြီး — `env` က ပိုင်ဆိုင်တာမို့ — ပြုပြင် (modify) လုပ်လို့လည်း မရပါဘူး — free လုပ်လို့လည်း မရပါဘူး။

Add-on loading လုပ်ငန်းစဉ်က — loading အတွင်း add-on ရဲ့ file name ကို ဖော်ထုတ်နိုင်ဖို့ ပျက်ကွက်ခဲ့ရင် — `result` က empty string တစ်ခု ဖြစ်နိုင်ပါတယ်။

[ABI Stability]: https://nodejs.org/learn/modules/abi-stability
[AppVeyor]: https://www.appveyor.com
[C++ Addons]: addons.md
[CMake]: https://cmake.org
[CMake.js]: https://github.com/cmake-js/cmake-js
[ECMAScript Language Specification]: https://tc39.es/ecma262/
[Error handling]: #error-handling
[GCC]: https://gcc.gnu.org
[GitHub releases]: https://help.github.com/en/github/administering-a-repository/about-releases
[LLVM]: https://llvm.org
[Native Abstractions for Node.js]: https://github.com/nodejs/nan
[Node-API Media]: https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md
[Object lifetime management]: #object-lifetime-management
[Object wrap]: #object-wrap
[Section Agents]: https://tc39.es/ecma262/#sec-agents
[Section Array instance length]: https://tc39.es/ecma262/#sec-properties-of-array-instances-length
[Section Array objects]: https://tc39.es/ecma262/#sec-array-objects
[Section ArrayBuffer objects]: https://tc39.es/ecma262/#sec-arraybuffer-objects
[Section DataView objects]: https://tc39.es/ecma262/#sec-dataview-objects
[Section Date objects]: https://tc39.es/ecma262/#sec-date-objects
[Section DefineOwnProperty]: https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc
[Section Function objects]: https://tc39.es/ecma262/#sec-function-objects
[Section IsArray]: https://tc39.es/ecma262/#sec-isarray
[Section IsStrictlyEqual]: https://tc39.es/ecma262/#sec-strict-equality-comparison
[Section Promise objects]: https://tc39.es/ecma262/#sec-promise-objects
[Section SharedArrayBuffer objects]: https://tc39.es/ecma262/#sec-sharedarraybuffer-objects
[Section ToBoolean]: https://tc39.es/ecma262/#sec-toboolean
[Section ToNumber]: https://tc39.es/ecma262/#sec-tonumber
[Section ToObject]: https://tc39.es/ecma262/#sec-toobject
[Section ToString]: https://tc39.es/ecma262/#sec-tostring
[Section TypedArray objects]: https://tc39.es/ecma262/#sec-typedarray-objects
[Section detachArrayBuffer]: https://tc39.es/ecma262/#sec-detacharraybuffer
[Section instanceof operator]: https://tc39.es/ecma262/#sec-instanceofoperator
[Section isDetachedBuffer]: https://tc39.es/ecma262/#sec-isdetachedbuffer
[Section language types]: https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values
[Section number type]: https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type
[Section object type]: https://tc39.es/ecma262/#sec-object-type
[Section property attributes]: https://tc39.es/ecma262/#sec-property-attributes
[Section string type]: https://tc39.es/ecma262/#sec-ecmascript-language-types-string-type
[Section symbol type]: https://tc39.es/ecma262/#sec-ecmascript-language-types-symbol-type
[Section typeof operator]: https://tc39.es/ecma262/#sec-typeof-operator
[Travis CI]: https://travis-ci.org
[Visual Studio]: https://visualstudio.microsoft.com
[Working with JavaScript properties]: #working-with-javascript-properties
[Xcode]: https://developer.apple.com/xcode/
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`Number.MAX_SAFE_INTEGER`]: https://tc39.es/ecma262/#sec-number.max_safe_integer
[`Number.MIN_SAFE_INTEGER`]: https://tc39.es/ecma262/#sec-number.min_safe_integer
[`Worker`]: worker_threads.md#class-worker
[`async_hooks.executionAsyncResource()`]: async_hooks.md#async_hooksexecutionasyncresource
[`build_with_cmake`]: https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake
[`global`]: globals.md#global
[`init` hooks]: async_hooks.md#initasyncid-type-triggerasyncid-resource
[`napi_add_async_cleanup_hook`]: #napi_add_async_cleanup_hook
[`napi_add_env_cleanup_hook`]: #napi_add_env_cleanup_hook
[`napi_add_finalizer`]: #napi_add_finalizer
[`napi_async_cleanup_hook`]: #napi_async_cleanup_hook
[`napi_async_complete_callback`]: #napi_async_complete_callback
[`napi_async_destroy`]: #napi_async_destroy
[`napi_async_init`]: #napi_async_init
[`napi_callback`]: #napi_callback
[`napi_cancel_async_work`]: #napi_cancel_async_work
[`napi_close_callback_scope`]: #napi_close_callback_scope
[`napi_close_escapable_handle_scope`]: #napi_close_escapable_handle_scope
[`napi_close_handle_scope`]: #napi_close_handle_scope
[`napi_create_async_work`]: #napi_create_async_work
[`napi_create_error`]: #napi_create_error
[`napi_create_external_arraybuffer`]: #napi_create_external_arraybuffer
[`napi_create_range_error`]: #napi_create_range_error
[`napi_create_reference`]: #napi_create_reference
[`napi_create_type_error`]: #napi_create_type_error
[`napi_define_class`]: #napi_define_class
[`napi_delete_async_work`]: #napi_delete_async_work
[`napi_delete_reference`]: #napi_delete_reference
[`napi_escape_handle`]: #napi_escape_handle
[`napi_finalize`]: #napi_finalize
[`napi_get_and_clear_last_exception`]: #napi_get_and_clear_last_exception
[`napi_get_array_length`]: #napi_get_array_length
[`napi_get_element`]: #napi_get_element
[`napi_get_last_error_info`]: #napi_get_last_error_info
[`napi_get_property`]: #napi_get_property
[`napi_get_reference_value`]: #napi_get_reference_value
[`napi_get_typedarray_info`]: #napi_get_typedarray_info
[`napi_get_value_external`]: #napi_get_value_external
[`napi_has_property`]: #napi_has_property
[`napi_instanceof`]: #napi_instanceof
[`napi_is_error`]: #napi_is_error
[`napi_is_exception_pending`]: #napi_is_exception_pending
[`napi_is_typedarray`]: #napi_is_typedarray
[`napi_make_callback`]: #napi_make_callback
[`napi_open_callback_scope`]: #napi_open_callback_scope
[`napi_open_escapable_handle_scope`]: #napi_open_escapable_handle_scope
[`napi_open_handle_scope`]: #napi_open_handle_scope
[`napi_property_attributes`]: #napi_property_attributes
[`napi_property_descriptor`]: #napi_property_descriptor
[`napi_queue_async_work`]: #napi_queue_async_work
[`napi_reference_ref`]: #napi_reference_ref
[`napi_reference_unref`]: #napi_reference_unref
[`napi_remove_async_cleanup_hook`]: #napi_remove_async_cleanup_hook
[`napi_remove_env_cleanup_hook`]: #napi_remove_env_cleanup_hook
[`napi_set_instance_data`]: #napi_set_instance_data
[`napi_set_property`]: #napi_set_property
[`napi_threadsafe_function_call_js`]: #napi_threadsafe_function_call_js
[`napi_throw_error`]: #napi_throw_error
[`napi_throw_range_error`]: #napi_throw_range_error
[`napi_throw_type_error`]: #napi_throw_type_error
[`napi_throw`]: #napi_throw
[`napi_unwrap`]: #napi_unwrap
[`napi_wrap`]: #napi_wrap
[`node-addon-api`]: https://github.com/nodejs/node-addon-api
[`node_api.h`]: https://github.com/nodejs/node/blob/HEAD/src/node_api.h
[`node_api_basic_finalize`]: #node_api_basic_finalize
[`node_api_create_external_string_latin1`]: #node_api_create_external_string_latin1
[`node_api_create_external_string_utf16`]: #node_api_create_external_string_utf16
[`node_api_create_syntax_error`]: #node_api_create_syntax_error
[`node_api_post_finalizer`]: #node_api_post_finalizer
[`node_api_throw_syntax_error`]: #node_api_throw_syntax_error
[`process.release`]: process.md#processrelease
[`uv_ref`]: https://docs.libuv.org/en/v1.x/handle.html#c.uv_ref
[`uv_unref`]: https://docs.libuv.org/en/v1.x/handle.html#c.uv_unref
[`worker.terminate()`]: worker_threads.md#workerterminate
[async_hooks `type`]: async_hooks.md#type
[context-aware addons]: addons.md#context-aware-addons
[docs]: https://github.com/nodejs/node-addon-api#api-documentation
[external]: #napi_create_external
[externals]: #napi_create_external
[global scope]: globals.md
[gyp-next]: https://github.com/nodejs/gyp-next
[language and engine bindings]: https://github.com/nodejs/abi-stable-node/blob/doc/node-api-engine-bindings.md
[module scope]: modules.md#the-module-scope
[node-gyp]: https://github.com/nodejs/node-gyp
[node-pre-gyp]: https://github.com/mapbox/node-pre-gyp
[prebuild]: https://github.com/prebuild/prebuild
[prebuildify]: https://github.com/prebuild/prebuildify
[worker threads]: https://nodejs.org/api/worker_threads.html
