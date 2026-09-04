---
title: "C++ embedder API"
description: "Node.js က C++ software များထဲက Node.js environment မှာ JavaScript execute လုပ်ဖို့ ပံ့ပိုးပေးတဲ့ C++ APIs (src/node.h) အကြောင်း"
order: 131
source: "https://nodejs.org/api/embedding.html"
status: translated
updated: 2026-09-04
---

Node.js က — တခြား C++ software တွေကနေ Node.js environment အတွင်းမှာ JavaScript ကို execute လုပ်ဖို့ သုံးနိုင်တဲ့ C++ APIs အများအပြားကို ပံ့ပိုးပေးပါတယ်။

ဒီ APIs တွေရဲ့ documentation ကို Node.js source tree ထဲက [src/node.h][] မှာ တွေ့နိုင်ပါတယ်။ Node.js က ထုတ်ဖော်ထားတဲ့ APIs တွေအပြင် — လိုအပ်တဲ့ concept အချို့ကိုလည်း V8 embedder API က ပံ့ပိုးပေးပါတယ်။

Node.js ကို embedded library အနေနဲ့ သုံးတာက — Node.js က လုပ်ဆောင်ပေးတဲ့ code တွေ ရေးတာနဲ့ မတူတာမို့ — breaking changes (လိုက်ဖက်မှု ပျက်စေသော ပြောင်းလဲမှုများ) တွေက ပုံမှန် Node.js [deprecation policy][] ကို မလိုက်နာဘဲ — semver-major release တိုင်းမှာ ကြိုတင် သတိပေးချက် မရှိပဲ ဖြစ်ပေါ်နိုင်ပါတယ်။

## နမူနာ embedding application (Example embedding application)

အောက်ပါ sections တွေက — `node -e <code>` ရဲ့ ညီမျှတဲ့ အလုပ် လုပ်ဆောင်မယ့် application တစ်ခုကို အစကနေ (from scratch) ဘယ်လို တည်ဆောက်ရမလဲဆိုတဲ့ ခြုံငုံ သုံးသပ်ချက်ကို ဖော်ပြပေးမှာ ဖြစ်ပါတယ်။ ဆိုလိုတာက — JavaScript code အပိုင်းအစတစ်ခုကို ယူပြီး Node.js-specific environment တစ်ခုထဲမှာ run လုပ်ပေးတာမျိုးပါ။

အပြည့်အစုံ code ကို [Node.js source tree ထဲမှာ][embedtest.cc] တွေ့နိုင်ပါတယ်။

### Per-process state သတ်မှတ်ခြင်း (Setting up a per-process state)

Node.js က run လုပ်ဖို့အတွက် per-process state management အချို့ လိုအပ်ပါတယ်:

* Node.js [CLI options][] အတွက် arguments parsing (arguments များ ခွဲထုတ်ခြင်း),
* `v8::Platform` instance လိုမျိုး V8 ရဲ့ per-process လိုအပ်ချက်တွေ။

အောက်ပါ ဥပမာက ဒါတွေကို ဘယ်လို သတ်မှတ်ရမလဲဆိုတာ ပြပါတယ်။ Class name အချို့က `node` နဲ့ `v8` C++ namespaces တွေကနေ အသီးသီး လာတာပါ။

```cpp
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Parse Node.js CLI options, and print any errors that have occurred while
  // trying to parse them.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // Create a v8::Platform instance. `MultiIsolatePlatform::Create()` is a way
  // to create a v8::Platform instance that Node.js can use when creating
  // Worker threads. When no `MultiIsolatePlatform` instance is present,
  // Worker threads are disabled.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // See below for the contents of this function.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Per-instance state သတ်မှတ်ခြင်း (Setting up a per-instance state)

Node.js မှာ “Node.js instance” ဆိုတဲ့ concept တစ်ခု ရှိပြီး — ၎င်းကို `node::Environment` လို့ အများအားဖြင့် ရည်ညွှန်းပါတယ်။ `node::Environment` တစ်ခုချင်းစီနဲ့ ဆက်စပ်နေတာတွေကတော့:

* `v8::Isolate` အတိအကျ တစ်ခု — ဆိုလိုတာက JS Engine instance တစ်ခု,
* `uv_loop_t` အတိအကျ တစ်ခု — ဆိုလိုတာက event loop တစ်ခု,
* `v8::Context` အများအပြား ရှိပေမယ့် — main `v8::Context` ကတော့ အတိအကျ တစ်ခုပဲ ရှိတယ်, ပြီးတော့
* `node::IsolateData` instance တစ်ခု — ၎င်းမှာ `node::Environment` အများအပြားကြား share လုပ်နိုင်တဲ့ အချက်အလက်တွေ ပါဝင်ပါတယ်။ Embedder က `node::IsolateData` ကို — `v8::Isolate` တစ်ခုတည်းကို သုံးနေတဲ့ `node::Environment` တွေကြားမှာပဲ share လုပ်ဖို့ သေချာစေရပါမယ် — Node.js က ဒီစစ်ဆေးမှုကို လုပ်မပေးပါဘူး။

`v8::Isolate` တစ်ခု သတ်မှတ်ဖို့အတွက် — `v8::ArrayBuffer::Allocator` တစ်ခုကို ပေးအပ်ဖို့ လိုအပ်ပါတယ်။ ဖြစ်နိုင်တဲ့ ရွေးချယ်မှုတစ်ခုကတော့ — `node::ArrayBufferAllocator::Create()` ကနေတစ်ဆင့် ဖန်တီးနိုင်တဲ့ default Node.js allocator ပါ။ Node.js allocator ကို သုံးခြင်းက — addons တွေက Node.js ရဲ့ C++ `Buffer` API ကို သုံးတဲ့အခါ နည်းနည်းလေး performance ပိုကောင်းအောင် လုပ်ပေးနိုင်ပြီး — [`process.memoryUsage()`][] ထဲမှာ `ArrayBuffer` memory ကို ခြေရာခံနိုင်ဖို့အတွက်လည်း လိုအပ်ပါတယ်။

ထို့အပြင် — Node.js instance တစ်ခုအတွက် သုံးတဲ့ `v8::Isolate` တစ်ခုချင်းစီကို — `MultiIsolatePlatform` instance တစ်ခု သုံးနေတယ်ဆိုရင် — အဲဒီ platform နဲ့ register ရော unregister ပါ လုပ်ဖို့ လိုအပ်ပါတယ်။ ဒါမှသာ `v8::Isolate` က စီစဉ်ပေးလိုက်တဲ့ tasks တွေအတွက် ဘယ် event loop ကို သုံးရမလဲဆိုတာ platform က သိမှာ ဖြစ်ပါတယ်။

`node::NewIsolate()` helper function က `v8::Isolate` တစ်ခုကို ဖန်တီးပြီး — Node.js အတွက် သီးသန့် hooks အချို့ (ဥပမာ — Node.js error handler) နဲ့ သတ်မှတ်ပေးကာ — platform နဲ့ အလိုအလျောက် register လုပ်ပေးပါတယ်။

```cpp
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Set up a libuv event loop, v8::Isolate, and Node.js Environment.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // The v8::Context needs to be entered when node::CreateEnvironment() and
    // node::LoadEnvironment() are being called.
    Context::Scope context_scope(setup->context());

    // Set up the Node.js instance for execution, and run code inside of it.
    // There is also a variant that takes a callback and provides it with
    // the `require` and `process` objects, so that it can manually compile
    // and run scripts as needed.
    // The `require` function inside this script does *not* access the file
    // system, and can only load built-in Node.js modules.
    // `module.createRequire()` is being used to create one that is able to
    // load files from the disk, and uses the standard CommonJS file loader
    // instead of the internal-only `require` function.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // There has been a JS exception.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() can be used to explicitly stop the event loop and keep
    // further JavaScript from running. It can be called from any thread,
    // and will act like worker.terminate() if called from another thread.
    node::Stop(env);
  }

  return exit_code;
}
```

[CLI options]: cli.md
[`process.memoryUsage()`]: process.md#processmemoryusage
[deprecation policy]: deprecations.md
[embedtest.cc]: https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc
[src/node.h]: https://github.com/nodejs/node/blob/HEAD/src/node.h
