---
title: "C++ addons"
description: "C++ addons (native module) များ — require()/import ဖြင့် load လုပ်ခြင်း၊ context-aware addons, worker support, building, Node-API vs nan, ဥပမာ addons များအကြောင်း။"
order: 135
source: "https://nodejs.org/api/addons.html"
status: translated
updated: 2026-09-04
---

_Addons_ တွေက [`require()`][] function ကနေတစ်ဆင့် သာမန် Node.js modules တွေလိုပဲ load လုပ်လို့ရတဲ့ dynamically-linked shared objects (dynamic ချိတ်ဆက်ထားသော မျှဝေ object များ) တွေ ဖြစ်ပါတယ်။ Addons တွေက JavaScript နဲ့ native code အကြား foreign function interface (FFI) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

Addons တွေကို အကောင်အထည်ဖော်ဖို့ နည်းလမ်း သုံးမျိုး ရှိပါတယ်:

* [Node-API][] (အကြံပြုထားသည်)
* `nan` ([Native Abstractions for Node.js][])
* internal V8, libuv နဲ့ Node.js libraries တွေကို တိုက်ရိုက် အသုံးပြုခြင်း

ဒီ document ရဲ့ ကျန်တဲ့ အပိုင်းတွေက နောက်ဆုံး နည်းလမ်းအကြောင်းကို အဓိကထား ရေးထားတာဖြစ်ပြီး — component များနဲ့ API အများအပြားကို သိထားရန် လိုအပ်ပါတယ်:

* [V8][]: Node.js က JavaScript အကောင်အထည်ဖော်မှုကို ပံ့ပိုးပေးဖို့ သုံးတဲ့ C++ library ပါ။ Object တွေ ဖန်တီးခြင်း၊ functions တွေ ခေါ်ခြင်း စတဲ့ ယန္တရားတွေကို ပံ့ပိုးပေးပါတယ်။ V8 ရဲ့ API ကို `v8.h` header file ထဲမှာ အဓိကထား မှတ်တမ်းတင်ထားပြီး (Node.js source tree ထဲက `deps/v8/include/v8.h`) — [online][v8-docs] မှာလည်း ကြည့်ရှုနိုင်ပါတယ်။

* [`libuv`][]: Node.js event loop, ၎င်းရဲ့ worker threads တွေနဲ့ platform ရဲ့ asynchronous အပြုအမူ အားလုံးကို အကောင်အထည်ဖော်ပေးတဲ့ C library ပါ။ Cross-platform abstraction library တစ်ခုအနေနဲ့လည်း ဆောင်ရွက်ပြီး — file system, sockets, timers, system events တွေနဲ့ ဆက်သွယ်တာလိုမျိုး အသုံးများတဲ့ system task တွေကို operating system အဓိကတွေ အားလုံးပေါ်မှာ POSIX နည်းတူ လွယ်ကူစွာ ဝင်ရောက်သုံးနိုင်အောင် လုပ်ပေးပါတယ်။ libuv က standard event loop ထက် ကျော်လွန်ဖို့ လိုအပ်တဲ့ ပိုမို ရှုပ်ထွေးတဲ့ asynchronous addons တွေအတွက် POSIX threads တွေနဲ့ ဆင်တူတဲ့ threading abstraction တစ်ခုကိုလည်း ပံ့ပိုးပေးပါတယ်။ Addon ရေးသားသူတွေက event loop ကို I/O သို့မဟုတ် အချိန်ကုန်များတဲ့ တခြား task တွေနဲ့ မပိတ်ဆို့မိအောင် — အလုပ်တွေကို libuv ကနေတစ်ဆင့် non-blocking system operations, worker threads (သို့) libuv threads တွေကို ကိုယ်ပိုင် သုံးစွဲခြင်းဆီ လွှဲပြောင်းပေးသင့်ပါတယ်။

* Internal Node.js libraries: Node.js ကိုယ်တိုင်က addons တွေ သုံးလို့ရတဲ့ C++ APIs တွေကို export လုပ်ပေးပြီး — အရေးအကြီးဆုံးကတော့ `node::ObjectWrap` class ပါ။

* Statically linked ဖြစ်တဲ့ တခြား libraries တွေ (OpenSSL အပါအဝင်): ဒီ libraries တွေက Node.js source tree ထဲက `deps/` directory မှာ တည်ရှိပါတယ်။ Node.js က libuv, OpenSSL, V8 နဲ့ zlib symbols တွေကိုပဲ ရည်ရွယ်ချက်ရှိရှိ re-export လုပ်ထားပြီး — addons တွေက အဆင့်အမျိုးမျိုးနဲ့ သုံးနိုင်ပါတယ်။ ထပ်ဆောင်း အချက်အလက်တွေအတွက် [Linking to libraries included with Node.js][] ကို ကြည့်ပါ။

အောက်က ဥပမာ အားလုံးကို [download][] လုပ်လို့ရပြီး — addon တစ်ခုရဲ့ စမှတ်အဖြစ် အသုံးပြုနိုင်ပါတယ်။

## Hello world (မင်္ဂလာပါ ကမ္ဘာ)

ဒီ "Hello world" ဥပမာက C++ နဲ့ ရေးထားတဲ့ ရိုးရှင်းတဲ့ addon တစ်ခုဖြစ်ပြီး — အောက်က JavaScript code နဲ့ ညီမျှပါတယ်:

```js
module.exports.hello = () => 'world';
```

ပထမဆုံး `hello.cc` ဆိုတဲ့ file ကို ဖန်တီးပါ:

```cpp
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize) // N.B.: no semi-colon, this is not a function

}  // namespace demo
```

Platform အများစုမှာ အောက်က `Makefile` နဲ့ စတင်နိုင်ပါတယ်:

```bash
NODEJS_DEV_ROOT ?= $(shell dirname "$$(command -v node)")/..
CXXFLAGS = -std=c++23 -I$(NODEJS_DEV_ROOT)/include/node -fPIC -shared -Wl,-undefined,dynamic_lookup

hello.node: hello.cc
	$(CXX) $(CXXFLAGS) -o $@ $<
```

ပြီးရင် အောက်က commands တွေကို run လိုက်ရင် code ကို compile လုပ်ပြီး run ပေးမှာ ဖြစ်ပါတယ်:

```console
$ make
$ node -p 'require("./hello.node").hello()'
world
```

npm ecosystem နဲ့ ပေါင်းစပ်ဖို့အတွက် [Building][] section ကို ကြည့်ပါ။

### Context-aware addons (context ကို သိရှိသော addons)

`NODE_MODULE()` နဲ့ သတ်မှတ်ထားတဲ့ addons တွေကို context အများအပြား သို့မဟုတ် thread အများအပြားမှာ တစ်ပြိုင်နက် load လုပ်လို့ မရပါဘူး။

Node.js addons တွေကို context အမျိုးမျိုးမှာ အကြိမ်များစွာ load လုပ်ဖို့ လိုအပ်တဲ့ ပတ်ဝန်းကျင်တွေ ရှိပါတယ်။ ဥပမာ — [Electron][] runtime က Node.js instance တွေ အများအပြားကို process တစ်ခုတည်းထဲမှာ run ပါတယ်။ Instance တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် `require()` cache ရှိမှာ ဖြစ်လို့ — `require()` ကနေ load လုပ်တဲ့အခါ native addon တစ်ခုစီက မှန်ကန်စွာ အပြုအမူ လုပ်နိုင်ဖို့ လိုအပ်ပါတယ်။ ဆိုလိုတာက addon က initializations အများအပြားကို support လုပ်ရပါမယ်။

Context-aware addon တစ်ခုကို `NODE_MODULE_INITIALIZER` macro ကို သုံးပြီး တည်ဆောက်နိုင်ပါတယ် — ဒီ macro က Node.js က addon တစ်ခုကို load လုပ်တဲ့အခါ ရှာတွေ့မယ်လို့ မျှော်လင့်တဲ့ function နာမည်တစ်ခုအဖြစ် ချဲ့ထွင်ပေးပါတယ်။ ဒါကြောင့် addon တစ်ခုကို အောက်က ဥပမာမှာ ပြထားသလို initialize လုပ်နိုင်ပါတယ်:

```cpp
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Perform addon initialization steps here. */
}
```

နောက်ထပ် ရွေးစရာ တစ်ခုကတော့ `NODE_MODULE_INIT()` macro ကို သုံးတာပါ — ဒါကလည်း context-aware addon တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ ပေးထားတဲ့ addon initializer function တစ်ခုကို ဗဟိုပြုပြီး addon တစ်ခု တည်ဆောက်ဖို့ သုံးတဲ့ `NODE_MODULE()` နဲ့ မတူဘဲ — `NODE_MODULE_INIT()` က အဲဒီလို initializer တစ်ခုရဲ့ ကြေညာချက် (declaration) အနေနဲ့ ဆောင်ရွက်ပြီး ၎င်းနောက်မှာ function body ကို ဆက်ရေးရပါတယ်။

`NODE_MODULE_INIT()` ကို ခေါ်ပြီးနောက် function body ထဲမှာ အောက်က variable သုံးခုကို သုံးနိုင်ပါတယ်:

* `Local<Object> exports`,
* `Local<Value> module`, နဲ့
* `Local<Context> context`

Context-aware addon တစ်ခုကို တည်ဆောက်တာက — တည်ငြိမ်မှုနဲ့ မှန်ကန်မှု ရှိစေဖို့ global static data တွေကို ဂရုတစိုက် စီမံခန့်ခွဲဖို့ လိုအပ်ပါတယ်။ Addon ကို thread အမျိုးမျိုးကနေတောင် အကြိမ်များစွာ load လုပ်နိုင်တာမို့ — addon ထဲမှာ သိမ်းထားတဲ့ global static data တိုင်းကို စနစ်တကျ ကာကွယ်ထားရမှာ ဖြစ်ပြီး၊ JavaScript objects တွေဆီကို ရည်ညွှန်းထားတဲ့ persistent references တွေ (အမြဲတစေ ဆက်ထားသော ရည်ညွှန်းချက်များ) မပါဝင်ရပါဘူး။ ဘာကြောင့်လဲဆိုတော့ JavaScript objects တွေက context တစ်ခုထဲမှာပဲ တရားဝင် ဖြစ်ပြီး — မှားယွင်းတဲ့ context (သို့) သူတို့ ဖန်တီးခဲ့တဲ့ thread မဟုတ်တဲ့ တခြား thread တစ်ခုကနေ ဝင်ရောက်သုံးမိရင် crash ဖြစ်နိုင်ခြေ များလို့ပါ။

Context-aware addon ကို အောက်ပါ အဆင့်တွေနဲ့ လုပ်ဆောင်ပြီး global static data တွေကို ရှောင်ရှားနိုင်အောင် ဖွဲ့စည်းနိုင်ပါတယ်:

* Addon instance တစ်ခုချင်းစီရဲ့ data တွေကို သိမ်းဆည်းပေးမယ့် class တစ်ခုကို သတ်မှတ်ပြီး — ၎င်းမှာ အောက်ပါပုံစံရှိတဲ့ static member တစ်ခု ပါဝင်ရပါမယ်:
  ```cpp
  static void DeleteInstance(void* data) {
    // Cast `data` to an instance of the class and delete it.
  }
  ```
* ဒီ class ရဲ့ instance တစ်ခုကို addon initializer ထဲမှာ heap ပေါ်မှာ allocate လုပ်ပါ။ `new` keyword ကို သုံးပြီး ပြုလုပ်နိုင်ပါတယ်။
* `node::AddEnvironmentCleanupHook()` ကို ခေါ်ပြီး အထက်မှာ ဖန်တီးထားတဲ့ instance နဲ့ `DeleteInstance()` ရဲ့ pointer တစ်ခုကို ပေးပို့ပါ။ ဒါက environment ဖျက်သိမ်းခံရတဲ့အခါ instance ကို ဖျက်ပစ်မှာ သေချာစေပါတယ်။
* Class ရဲ့ instance ကို `v8::External` တစ်ခုထဲမှာ သိမ်းဆည်းပြီး၊
* အဲဒီ `v8::External` ကို JavaScript ဆီ ထုတ်ဖော်ပြသမယ့် method အားလုံးဆီ ပေးပို့ပါ — native-backed JavaScript functions တွေကို ဖန်တီးပေးတဲ့ `v8::FunctionTemplate::New()` သို့မဟုတ် `v8::Function::New()` ကို သုံးပြီး ဖြစ်ပါတယ်။ `v8::FunctionTemplate::New()` သို့မဟုတ် `v8::Function::New()` ရဲ့ တတိယ parameter က `v8::External` ကို လက်ခံပြီး — `v8::FunctionCallbackInfo::Data()` method ကို သုံးပြီး native callback ထဲမှာ ၎င်းကို ရယူသုံးနိုင်အောင် လုပ်ပေးပါတယ်။

ဒါက per-addon-instance data ကို JavaScript ကနေ ခေါ်လို့ရတဲ့ binding တိုင်းဆီ ရောက်ရှိစေမှာ သေချာစေပါတယ်။ Per-addon-instance data ကို addon က ဖန်တီးနိုင်တဲ့ asynchronous callbacks တွေထဲကိုလည်း ထည့်ပေးပို့ရပါမယ်။

အောက်က ဥပမာက context-aware addon တစ်ခုရဲ့ အကောင်အထည်ဖော်မှုကို သရုပ်ပြပါတယ်:

```cpp
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Retrieve the per-addon-instance data.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = Isolate::GetCurrent();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Worker support (Worker threads များအတွက် ပံ့ပိုးမှု)

Main thread နဲ့ Worker thread လိုမျိုး Node.js environment အများအပြားကနေ load လုပ်ခံရဖို့အတွက် addon တစ်ခုက အောက်ပါ နှစ်မျိုးအနက် တစ်ခုခု ဖြစ်ရပါတယ်:

* [Node-API][] addon တစ်ခု ဖြစ်ရမယ်။
* အထက်မှာ ဖော်ပြခဲ့တဲ့အတိုင်း `NODE_MODULE_INIT()` ကို သုံးပြီး context-aware အဖြစ် ကြေညာထားရမယ်။

[`Worker`][] threads တွေကို support လုပ်ဖို့အတွက် — addons တွေက အဲဒီလို thread တစ်ခု ထွက်သွားတဲ့အခါ သူတို့ သုံးထားခဲ့တဲ့ resources တွေကို ရှင်းလင်းပေးရပါတယ်။ ဒါကို `AddEnvironmentCleanupHook()` function ကို သုံးပြီး ပြီးမြောက်စေနိုင်ပါတယ်:

```cpp
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```

ဒီ function က Node.js instance တစ်ခု ပိတ်သိမ်းမခံရခင် run လုပ်မယ့် hook တစ်ခုကို ထပ်ဖြည့်ပေးပါတယ်။ လိုအပ်ရင် — ဒီလို hooks တွေကို run မလုပ်ခင် signature တူညီတဲ့ `RemoveEnvironmentCleanupHook()` ကို သုံးပြီး ဖယ်ရှားနိုင်ပါတယ်။ Callbacks တွေကို last-in first-out (နောက်ဆုံး ထည့်တာ အရင် run) အစီအစဉ်နဲ့ run ပါတယ်။

လိုအပ်ရင် — cleanup hook က callback function တစ်ခုကို လက်ခံတဲ့ `AddEnvironmentCleanupHook()` နဲ့ `RemoveEnvironmentCleanupHook()` overloads အတွဲတစ်ခုလည်း ထပ်ရှိပါတယ်။ ဒါကို addon က register လုပ်ထားတဲ့ libuv handles တွေလိုမျိုး asynchronous resources တွေကို ပိတ်သိမ်းဖို့ သုံးနိုင်ပါတယ်။

အောက်က `addon.cc` က `AddEnvironmentCleanupHook` ကို အသုံးပြုထားပါတယ်:

```cpp
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// Note: In a real-world application, do not rely on static/global data.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // assert VM is still alive
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = Isolate::GetCurrent();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```

JavaScript မှာ အောက်ပါအတိုင်း run လုပ်ပြီး စမ်းသပ်ပါ:

```js
// test.js
require('./build/Release/addon');
```

### Building (build ပြုလုပ်ခြင်း)

Source code ရေးပြီးတာနဲ့ — ၎င်းကို `addon.node` ဆိုတဲ့ binary file အဖြစ် compile လုပ်ရပါတယ်။ ဒါအတွက် project ရဲ့ အပေါ်ဆုံးအဆင့်မှာ module ရဲ့ build configuration ကို JSON နဲ့ ဆင်တူတဲ့ format နဲ့ ဖော်ပြတဲ့ `binding.gyp` ဆိုတဲ့ file တစ်ခုကို ဖန်တီးပါ။ ဒီ file ကို Node.js addons တွေကို compile လုပ်ဖို့အတွက် သီးသန့် ရေးထားတဲ့ tool ဖြစ်တဲ့ [`node-gyp`][] က အသုံးပြုပါတယ်။

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```

`node-gyp` utility ရဲ့ version တစ်ခုကို `npm` ရဲ့ အစိတ်အပိုင်းအနေနဲ့ Node.js နဲ့အတူ ထည့်သွင်း ဖြန့်ဝေထားပါတယ်။ ဒီ version ကို developers တွေ တိုက်ရိုက် သုံးဖို့ ထုတ်မပေးထားဘဲ — `npm install` command ကို သုံးပြီး addons တွေကို compile လုပ်ကာ install လုပ်နိုင်စေဖို့အတွက်သာ ရည်ရွယ်ထားပါတယ်။ `node-gyp` ကို တိုက်ရိုက် သုံးချင်တဲ့ developers တွေက `npm install -g node-gyp` ဆိုတဲ့ command နဲ့ install လုပ်နိုင်ပါတယ်။ Platform အလိုက် လိုအပ်ချက်တွေ အပါအဝင် နောက်ထပ် အချက်အလက်တွေအတွက် `node-gyp` ရဲ့ [installation instructions][] ကို ကြည့်ပါ။

`binding.gyp` file ဖန်တီးပြီးတာနဲ့ — လက်ရှိ platform အတွက် သင့်လျော်တဲ့ project build files တွေကို ထုတ်လုပ်ဖို့ `node-gyp configure` ကို သုံးပါ။ ဒါက `build/` directory ထဲမှာ `Makefile` (Unix platforms တွေမှာ) သို့မဟုတ် `vcxproj` file (Windows မှာ) တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။

ပြီးရင် compile ပြီးသား `addon.node` file ကို ထုတ်လုပ်ဖို့ `node-gyp build` command ကို ခေါ်ပါ။ ဒီ file က `build/Release/` directory ထဲကို ရောက်သွားပါလိမ့်မယ်။

Node.js addon တစ်ခုကို install လုပ်ဖို့ `npm install` ကို သုံးတဲ့အခါ — npm က ဒီအဆင့်တွေအတိုင်း လုပ်ဆောင်ဖို့ ကိုယ်ပိုင် bundled `node-gyp` version ကို သုံးပြီး၊ user ရဲ့ platform အတွက် addon ရဲ့ compiled version ကို လိုအပ်သလို (on demand) ထုတ်ပေးပါတယ်။

ပြီးတာနဲ့ — binary addon ကို [`require()`][] က build ပြီးသား `addon.node` module ဆီ ညွှန်ပြပြီး Node.js ထဲကနေ အသုံးပြုနိုင်ပါတယ်:

```js
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```

Compile လုပ်ပုံပေါ် မူတည်ပြီး addon binary ရဲ့ တိကျတဲ့ path က ကွဲပြားနိုင်တာမို့ (ဥပမာ — တစ်ခါတစ်ရံ `./build/Debug/` ထဲမှာ ရှိနိုင်ပါတယ်) — addons တွေက compile ပြီးသား module ကို load လုပ်ဖို့ [bindings][] package ကို သုံးနိုင်ပါတယ်။

`bindings` package ရဲ့ အကောင်အထည်ဖော်မှုက addon modules တွေကို ရှာဖွေတဲ့နေရာမှာ ပိုပြီး ဆန်းပြားပေမယ့် — အခြေခံအားဖြင့်တော့ အောက်က ပုံစံနဲ့ ဆင်တဲ့ `try…catch` pattern တစ်ခုကိုပဲ အသုံးပြုပါတယ်:

```js
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Linking to libraries included with Node.js (Node.js နဲ့အတူ ပါလာတဲ့ libraries တွေနဲ့ ချိတ်ဆက်ခြင်း)

Node.js က V8, libuv, OpenSSL စတဲ့ statically linked libraries တွေကို အသုံးပြုပါတယ်။ Addons တိုင်းက V8 နဲ့ ချိတ်ဆက်ရန် လိုအပ်ပြီး — တခြား dependencies တွေနဲ့လည်း ချိတ်ဆက်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် ဒါက သင့်လျော်တဲ့ `#include <...>` statements တွေ ထည့်ရုံပဲ ဖြစ်ပြီး (ဥပမာ — `#include <v8.h>`) — `node-gyp` က သင့်လျော်တဲ့ headers တွေကို အလိုအလျောက် ရှာဖွေပေးပါလိမ့်မယ်။ ဒါပေမယ့် သတိထားရမယ့် အချက်အနည်းငယ် ရှိပါတယ်:

* `node-gyp` run လုပ်တဲ့အခါ — Node.js ရဲ့ တိကျတဲ့ release version ကို စစ်ဆေးပြီး full source tarball (သို့) headers တွေကိုပဲ ဒေါင်းလုဒ် လုပ်ပါတယ်။ Full source ကို ဒေါင်းလုဒ် လုပ်ထားရင် addons တွေက Node.js dependencies အစုံအလင်ကို အပြည့်အဝ ဝင်ရောက်သုံးနိုင်ပါတယ်။ ဒါပေမယ့် Node.js headers တွေကိုပဲ ဒေါင်းလုဒ် လုပ်ထားရင် — Node.js က export လုပ်ထားတဲ့ symbols တွေကိုပဲ ရရှိနိုင်မှာ ဖြစ်ပါတယ်။

* `node-gyp` ကို local Node.js source image တစ်ခုဆီ ညွှန်ပြတဲ့ `--nodedir` flag နဲ့ run လုပ်နိုင်ပါတယ်။ ဒီ option ကို သုံးရင် addon က dependencies အစုံအလင်ကို ဝင်ရောက်သုံးနိုင်ပါလိမ့်မယ်။

### Loading addons using `require()` (`require()` သုံးပြီး addons များကို load လုပ်ခြင်း)

Compile ပြီးသား addon binary ရဲ့ filename extension က `.node` ဖြစ်ပါတယ် (`.dll` သို့မဟုတ် `.so` မဟုတ်ပါဘူး)။ [`require()`][] function က `.node` file extension ရှိတဲ့ files တွေကို ရှာဖွေပြီး — ၎င်းတို့ကို dynamically-linked libraries တွေအဖြစ် initialize လုပ်ဖို့ ရေးသားထားပါတယ်။

[`require()`][] ကို ခေါ်တဲ့အခါ `.node` extension ကို များသောအားဖြင့် ချန်လှပ်ထားနိုင်ပြီး — Node.js က addon ကို ရှာတွေ့ပြီး initialize လုပ်ပေးပါသေးတယ်။ ဒါပေမယ့် သတိထားရမယ့် အချက်တစ်ခုကတော့ — Node.js က base name တူညီတဲ့ modules (သို့) JavaScript files တွေကို အရင် ရှာဖွေ load လုပ်ဖို့ ကြိုးစားပါတယ်။ ဥပမာ — `addon.node` binary နဲ့ directory တစ်ခုတည်းမှာ `addon.js` file ရှိနေရင် — [`require('addon')`][`require()`] က `addon.js` file ကို ဦးစားပေးပြီး ၎င်းကိုပဲ load လုပ်ပါလိမ့်မယ်။

### Loading addons using `import` (`import` သုံးပြီး addons များကို load လုပ်ခြင်း)

> Stability: 1.0 - Early development

Binary addons တွေကို load လုပ်ဖို့ static `import` နဲ့ dynamic `import()` နှစ်မျိုးလုံးကို support လုပ်ပေးနိုင်ဖို့ [`--experimental-addon-modules`][] flag ကို သုံးနိုင်ပါတယ်။

အထက်က Hello World ဥပမာကိုပဲ ပြန်သုံးမယ်ဆိုရင် အောက်ပါအတိုင်း လုပ်နိုင်ပါတယ်:

```mjs
// hello.mjs
import myAddon from './hello.node';
// N.B.: import {hello} from './hello.node' would not work

console.log(myAddon.hello());
```

```console
$ node --experimental-addon-modules hello.mjs
world
```

## Native abstractions for Node.js (Node.js အတွက် native abstraction များ)

ဒီ document ထဲက ဥပမာတိုင်းက addons တွေကို အကောင်အထည်ဖော်ဖို့ Node.js နဲ့ V8 APIs တွေကို တိုက်ရိုက် အသုံးပြုထားပါတယ်။ V8 API က V8 release တစ်ခုကနေ နောက်တစ်ခုကို (ပြီးတော့ Node.js major release တစ်ခုကနေ နောက်တစ်ခုကို) ရောက်တိုင်း သိသိသာသာ ပြောင်းလဲနိုင်ခဲ့ပြီး ပြောင်းလဲနေဆဲလည်း ဖြစ်ပါတယ်။ ပြောင်းလဲမှုတိုင်းမှာ addons တွေက ဆက်လက် အလုပ်လုပ်နိုင်ဖို့ update လုပ်ပြီး recompile လုပ်ရန် လိုအပ်နိုင်ပါတယ်။ Node.js ရဲ့ release schedule က အဲဒီလို ပြောင်းလဲမှုတွေရဲ့ အကြိမ်ရေနဲ့ သက်ရောက်မှုကို အနည်းဆုံး ဖြစ်အောင် ဒီဇိုင်းထားပေမယ့် — V8 APIs တွေရဲ့ တည်ငြိမ်မှုကို သေချာစေဖို့ Node.js အနေနဲ့ သိပ်မတတ်နိုင်ပါဘူး။

[Native Abstractions for Node.js][] (သို့မဟုတ် `nan`) က V8 နဲ့ Node.js ရဲ့ အရင် release တွေနဲ့ နောင်လာမယ့် release တွေကြား လိုက်ဖက်ညီမှု (compatibility) ထိန်းသိမ်းဖို့ addon developers တွေ သုံးသင့်တယ်လို့ အကြံပြုထားတဲ့ tools အစုတစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဘယ်လို အသုံးပြုနိုင်လဲဆိုတာကို သရုပ်ပြဖို့ `nan` ရဲ့ [examples][] တွေကို ကြည့်ပါ။

## Node-API

> Stability: 2 - Stable

[C/C++ addons with Node-API][Node-API] ကို ကြည့်ပါ။

## Addon examples (addon ဥပမာများ)

အောက်က ဥပမာ addons တွေက developers တွေ စတင် လုပ်ဆောင်နိုင်ဖို့ ရည်ရွယ် ကူညီပေးပါတယ်။ ဥပမာတွေက V8 APIs တွေကို အသုံးပြုထားပါတယ်။ V8 ခေါ်ဆိုမှု အမျိုးမျိုးအတွက် အကူအညီ ရဖို့ online [V8 reference][v8-docs] ကို ကြည့်နိုင်ပြီး — handles, scopes, function templates စတဲ့ သုံးထားတဲ့ concept တွေရဲ့ ရှင်းလင်းချက်အတွက် V8 ရဲ့ [Embedder's Guide][] ကို ကြည့်နိုင်ပါတယ်။

ဥပမာတိုင်းက အောက်က `binding.gyp` file ကို အသုံးပြုပါတယ်:

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```

`.cc` file တစ်ခုထက်ပိုတဲ့ အခြေအနေတွေမှာ — ထပ်ဆောင်း filename တွေကို `sources` array ထဲ ထည့်လိုက်ရုံပါပဲ:

```json
"sources": ["addon.cc", "myexample.cc"]
```

`binding.gyp` file အဆင်သင့် ဖြစ်တာနဲ့ — ဥပမာ addons တွေကို `node-gyp` သုံးပြီး configure လုပ်ကာ build လုပ်နိုင်ပါတယ်:

```bash
node-gyp configure build
```

### Function arguments (function argument များ)

Addons တွေက ပုံမှန်အားဖြင့် Node.js ထဲမှာ run နေတဲ့ JavaScript ကနေ ဝင်ရောက် သုံးလို့ရတဲ့ objects နဲ့ functions တွေကို ထုတ်ဖော်ပေးပါတယ်။ JavaScript ကနေ functions တွေကို ခေါ်လိုက်တဲ့အခါ — input arguments တွေနဲ့ return value တွေကို C/C++ code နဲ့ အပြန်အလှန် map (ပြောင်းလဲ) လုပ်ပေးရပါတယ်။

အောက်က ဥပမာက JavaScript ကနေ ပေးပို့လိုက်တဲ့ function arguments တွေကို ဘယ်လို ဖတ်ယူရမလဲဆိုတာနဲ့ ရလဒ်တစ်ခုကို ဘယ်လို ပြန်ပေးရမလဲဆိုတာကို သရုပ်ပြပါတယ်:

```cpp
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// This is the implementation of the "add" method
// Input arguments are passed using the
// const FunctionCallbackInfo<Value>& args struct
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Check the number of arguments passed.
  if (args.Length() < 2) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // Check the argument types
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // Perform the operation
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Set the return value (using the passed in
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```

Compile ပြီးတာနဲ့ — ဥပမာ addon ကို Node.js ထဲကနေ require လုပ်ပြီး အသုံးပြုနိုင်ပါတယ်:

```js
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### Callbacks (callback များ)

Addons တွေထဲမှာ JavaScript functions တွေကို C++ function တစ်ခုဆီ ပေးပို့ပြီး အဲဒီကနေ execute လုပ်တာက အလေ့အကျင့် တစ်ခု ဖြစ်ပါတယ်။ အောက်က ဥပမာက အဲဒီလို callbacks တွေကို ဘယ်လို ခေါ်ယူရမလဲဆိုတာ သရုပ်ပြပါတယ်:

```cpp
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```

ဒီဥပမာက `Init()` ရဲ့ argument နှစ်ခု ပါတဲ့ ပုံစံကို သုံးပြီး — ဒုတိယ argument အနေနဲ့ `module` object တစ်ခုလုံးကို လက်ခံပါတယ်။ ဒါက addon ကို function တစ်ခုကို `exports` ရဲ့ property အနေနဲ့ ထည့်မယ့်အစား — `exports` တစ်ခုလုံးကို function တစ်ခုတည်းနဲ့ အစားထိုး လွှမ်းမိုး (overwrite) လုပ်နိုင်စေပါတယ်။

စမ်းသပ်ဖို့ အောက်က JavaScript ကို run လုပ်ပါ:

```js
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```

ဒီဥပမာမှာတော့ callback function ကို synchronously ခေါ်ပါတယ်။

### Object factory (object ထုတ်လုပ်သည့် factory ပုံစံ)

Addons တွေက C++ function တစ်ခုထဲကနေ object အသစ်တွေကို ဖန်တီးပြီး ပြန်ပေးနိုင်ပါတယ် — အောက်က ဥပမာမှာ ပြထားပါတယ်။ `createObject()` ဆီ ပေးပို့လိုက်တဲ့ string ကို ပဲ့တင်ထပ် (echo) ပြန်ပေးတဲ့ `msg` property တစ်ခု ပါဝင်တဲ့ object တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်:

```cpp
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```

JavaScript မှာ စမ်းသပ်ဖို့:

```js
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Function factory (function ထုတ်လုပ်သည့် factory ပုံစံ)

နောက်ထပ် အဖြစ်များတဲ့ အခြေအနေတစ်ခုကတော့ — C++ functions တွေကို ပတ်ရစ် (wrap) ထားတဲ့ JavaScript functions တွေကို ဖန်တီးပြီး အဲဒါတွေကို JavaScript ဆီ ပြန်ပေးတာပါ:

```cpp
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omit this to make it anonymous
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```

စမ်းသပ်ဖို့:

```js
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```

### Wrapping C++ objects (C++ object များကို wrapping လုပ်ခြင်း)

C++ objects/classes တွေကို JavaScript `new` operator နဲ့ instance အသစ်တွေ ဖန်တီးနိုင်မယ့် နည်းနဲ့ wrap လုပ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်:

```cpp
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```

ပြီးတော့ `myobject.h` ထဲမှာ wrapper class က `node::ObjectWrap` ကနေ အမွေဆက်ခံ (inherit) ပါတယ်:

```cpp
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```

`myobject.cc` မှာတော့ ထုတ်ဖော် ပြသရမယ့် method အမျိုးမျိုးကို အကောင်အထည်ဖော်ပါ။ အောက်က code မှာ `plusOne()` method ကို constructor ရဲ့ prototype ထဲ ထည့်ပြီး ထုတ်ဖော်လိုက်ပါတယ်:

```cpp
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = Isolate::GetCurrent();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```

ဒီဥပမာကို build လုပ်ဖို့ — `myobject.cc` file ကို `binding.gyp` ထဲ ထည့်သွင်းရပါမယ်:

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```

အောက်ပါအတိုင်း စမ်းသပ်ပါ:

```js
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```

Wrapper object တစ်ခုအတွက် destructor က object ကို garbage collection လုပ်လိုက်တဲ့အခါ run ပါလိမ့်မယ်။ Destructor တွေကို စမ်းသပ်ဖို့အတွက် — garbage collection ကို အတင်းအကျပ် ဖြစ်စေနိုင်တဲ့ command-line flags တွေ ရှိပါတယ်။ ဒီ flags တွေက နောက်ခံ V8 JavaScript engine က ပံ့ပိုးပေးတာဖြစ်ပြီး — အချိန်မရွေး ပြောင်းလဲခြင်း (သို့) ဖယ်ရှားခြင်း ခံရနိုင်ပါတယ်။ ဒါတွေကို Node.js ရော V8 ရော တရားဝင် မှတ်တမ်းတင်ထားခြင်း မရှိဘဲ — စမ်းသပ်မှု အပြင်ဘက်မှာ ဘယ်တော့မှ မသုံးသင့်ပါဘူး။

Process (သို့) worker threads တွေ ပိတ်သိမ်းချိန်အတွင်းမှာ destructors တွေကို JS engine က ခေါ်ပေးမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — resource leaks (ရင်းမြစ် ယိုစိမ့်မှုများ) မဖြစ်အောင် ဒီ objects တွေကို ခြေရာခံပြီး စနစ်တကျ ဖျက်သိမ်းကြောင်း သေချာစေဖို့က user ရဲ့ တာဝန် ဖြစ်ပါတယ်။

### Factory of wrapped objects (wrapped object များအတွက် factory ပုံစံ)

တစ်နည်းအားဖြင့် — JavaScript `new` operator နဲ့ object instances တွေကို ရှင်းရှင်းလင်းလင်း ဖန်တီးတာကို ရှောင်ရှားဖို့ factory pattern တစ်ခုကို အသုံးပြုနိုင်ပါတယ်:

```js
const obj = addon.createObject();
// instead of:
// const obj = new addon.Object();
```

ပထမဆုံး `createObject()` method ကို `addon.cc` မှာ အကောင်အထည်ဖော်ပါတယ်:

```cpp
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init();

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```

`myobject.h` မှာတော့ object ကို instance ဖန်တီးခြင်း ကိစ္စကို ကိုင်တွယ်ဖို့ `NewInstance()` static method ကို ထပ်ဖြည့်ထားပါတယ်။ ဒီ method က JavaScript မှာ `new` သုံးတာရဲ့ နေရာကို အစားထိုးပါတယ်:

```cpp
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init();
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```

`myobject.cc` ထဲက အကောင်အထည်ဖော်မှုက အရင် ဥပမာနဲ့ ဆင်တူပါတယ်:

```cpp
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init() {
  Isolate* isolate = Isolate::GetCurrent();
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```

နောက်တစ်ကြိမ် ထပ်ပြောရရင် — ဒီဥပမာကို build လုပ်ဖို့ `myobject.cc` file ကို `binding.gyp` ထဲ ထည့်ရပါမယ်:

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```

အောက်ပါအတိုင်း စမ်းသပ်ပါ:

```js
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### Passing wrapped objects around (wrapped object များကို နေရာအနှံ့ ပေးပို့ခြင်း)

C++ objects တွေကို wrap လုပ်ပြီး ပြန်ပေးတာအပြင် — Node.js ရဲ့ helper function ဖြစ်တဲ့ `node::ObjectWrap::Unwrap` နဲ့ unwrap လုပ်ပြီး wrapped objects တွေကို နေရာအနှံ့ ပေးပို့ဖို့လည်း ဖြစ်နိုင်ပါတယ်။ အောက်က ဥပမာက `MyObject` objects နှစ်ခုကို input arguments အဖြစ် လက်ခံနိုင်တဲ့ `add()` function တစ်ခုကို ပြသပါတယ်:

```cpp
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init();

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```

`myobject.h` မှာတော့ object ကို unwrap လုပ်ပြီးနောက် private values တွေကို ဝင်ရောက် သုံးခွင့်ပေးဖို့ public method အသစ်တစ်ခုကို ထပ်ဖြည့်ထားပါတယ်။

```cpp
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init();
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```

`myobject.cc` ရဲ့ အကောင်အထည်ဖော်မှုကတော့ အရင် version နဲ့ ဆင်တူနေပါတယ်:

```cpp
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init() {
  Isolate* isolate = Isolate::GetCurrent();
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```

အောက်ပါအတိုင်း စမ်းသပ်ပါ:

```js
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```

[Building]: #building
[Electron]: https://electronjs.org/
[Embedder's Guide]: https://v8.dev/docs/embed
[Linking to libraries included with Node.js]: #linking-to-libraries-included-with-nodejs
[Native Abstractions for Node.js]: https://github.com/nodejs/nan
[Node-API]: n-api.md
[V8]: https://v8.dev/
[`--experimental-addon-modules`]: cli.md#--experimental-addon-modules
[`Worker`]: worker_threads.md#class-worker
[`libuv`]: https://github.com/libuv/libuv
[`node-gyp`]: https://github.com/nodejs/node-gyp
[`require()`]: modules.md#requireid
[bindings]: https://github.com/TooTallNate/node-bindings
[download]: https://github.com/nodejs/node-addon-examples
[examples]: https://github.com/nodejs/nan/tree/HEAD/examples/
[installation instructions]: https://github.com/nodejs/node-gyp#installation
[v8-docs]: https://v8docs.nodesource.com/
