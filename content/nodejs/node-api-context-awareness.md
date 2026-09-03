---
title: "Context Awareness (Context အမျိုးမျိုးတွင် Addon များ မှန်ကန်စွာ အလုပ်လုပ်ခြင်း)"
description: "Worker Threads မိတ်ဆက်ပြီးနောက် native addon တွေကို thread များစွာ၏ context များတွင် load/unload လုပ်ခံရနိုင်ပုံ — instance data (napi_set_instance_data / napi_get_instance_data) နဲ့ cleanup hooks (napi_add_env_cleanup_hook) သုံးပြီး memory စီမံခန့်ခွဲနည်း — C/C++ ဥပမာများနဲ့အတူ"
order: 84
source: "https://nodejs.org/en/learn/node-api/special-topics/context-awareness"
status: translated
updated: 2026-09-03
---

Node.js က သမိုင်းကြောင်းအရ single-threaded process တစ်ခုအနေနဲ့ပဲ run ခဲ့ပါတယ်။ Node 10 မှာ [Worker Threads](https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads) တွေကို မိတ်ဆက်လိုက်တာနဲ့ ဒါတွေ အားလုံး ပြောင်းလဲသွားပါတယ်။ Worker Threads တွေက — native addon developer တွေ သတိထားဖို့ လိုအပ်တဲ့ — JavaScript-friendly concurrency abstraction (JavaScript နဲ့ အဆင်ပြေတဲ့ တပြိုင်နက် လုပ်ဆောင်မှု abstraction) တစ်ခုကို ထပ်ဖြည့်ပေးပါတယ်။ လက်တွေ့မှာ ဆိုလိုတာက — သင့်ရဲ့ native add-on က တစ်ကြိမ်ထက် ပိုပြီး load/unload လုပ်ခံရနိုင်ပြီး — ၎င်းရဲ့ code က thread အများအပြားမှာ တပြိုင်နက် execute လုပ်ခံရနိုင်ပါတယ်။ ဒါကြောင့် သင့်ရဲ့ native add-on code က မှန်ကန်စွာ run နိုင်ဖို့ လိုက်နာရမယ့် တိကျတဲ့ အဆင့်တွေ ရှိပါတယ်။

Worker Thread model က — Worker တစ်ခုချင်းစီဟာ အချင်းချင်း လုံးဝ သီးခြား လွတ်လပ်စွာ run ပြီး — parent Worker နဲ့သာ parent က ထောက်ပံ့ပေးတဲ့ MessagePort object တစ်ခုကို သုံးပြီး ဆက်သွယ်ရမယ်လို့ သတ်မှတ်ပါတယ်။ ဒါက Worker Threads တွေကို တစ်ခုနဲ့တစ်ခု အနှစ်သာရအားဖြင့် သီးခြားခွဲထားသလို (isolated) ဖြစ်စေပါတယ်။ သင့်ရဲ့ native add-on အတွက်လည်း အလားတူပါပဲ။

Worker Thread တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင် environment အတွင်းမှာ အလုပ်လုပ်ပြီး — ဒါကို context လို့လည်း ခေါ်ပါတယ်။ ဒီ context က Node-API function တစ်ခုချင်းစီဆီ [`napi_env`](https://nodejs.org/api/n-api.html#napi_env) value တစ်ခုအနေနဲ့ ရရှိနိုင်ပါတယ်။

## Load/Unload လုပ်ခြင်း အကြိမ်များစွာ (Multiple Loading and Unloading)

သင့်ရဲ့ native add-on က persistent memory (ကြာရှည် ထိန်းသိမ်းရမယ့် memory) လိုအပ်တယ်ဆိုရင် — ဒီ memory ကို static global space ထဲမှာ ခွဲဝေချထားတာက ဘေးဥပဒ်အတွက် ချက်နည်းတစ်ခုပါ။ အဲဒီအစား — ဒီ memory ကို native add-on ကို initialize လုပ်တဲ့ context တစ်ခုချင်းစီအတွင်းမှာ အကြိမ်တိုင်း ခွဲဝေချထားတာက _မရှိမဖြစ်_ လိုအပ်ပါတယ်။ ဒီ memory ကို ပုံမှန်အားဖြင့် သင့်ရဲ့ native add-on ရဲ့ `Init` method ထဲမှာ ခွဲဝေချထားပါတယ်။ ဒါပေမယ့် အချို့သော ကိစ္စတွေမှာတော့ native add-on run နေချိန်မှာလည်း ခွဲဝေချထားနိုင်ပါတယ်။

အထက်မှာ ဖော်ပြခဲ့တဲ့ multiple loading အပြင် — သင့်ရဲ့ native add-on က အသုံးမပြုတော့တဲ့အခါ JavaScript runtime engine ရဲ့ garbage collector ကနေတစ်ဆင့် အလိုအလျောက် unload လုပ်ခံရတာလည်း ရှိပါတယ်။ Memory leaks (memory ယိုစိမ့်မှုများ) မဖြစ်ပွားအောင် — သင့်ရဲ့ native add-on က ခွဲဝေချထားခဲ့တဲ့ memory အားလုံးကို add-on unload လုပ်ခံရတဲ့အခါ ပြန်လွှတ်ပေးရမှာ ဖြစ်ပါတယ်။

နောက် section တွေမှာ — သင့်ရဲ့ native add-on နဲ့ ဆက်စပ်နေတဲ့ persistent memory တွေကို ခွဲဝေချထားပြီး ပြန်လွှတ်ပေးဖို့ သုံးနိုင်တဲ့ မတူညီတဲ့ နည်းစနစ် နှစ်ခုကို ဖော်ပြထားပါတယ်။ ဒီနည်းစနစ်တွေကို သင့်ရဲ့ native add-on မှာ တစ်ခုချင်းစီ (သို့) နှစ်ခုလုံး တွဲဖက် သုံးနိုင်ပါတယ်။

## Instance data (Addon Instance တစ်ခုစီနှင့် ဆက်စပ်သော ဒေတာ)

Node-API က — သင့်ရဲ့ native add-on က ခွဲဝေချထားလိုက်တဲ့ memory တစ်ပိုင်းတည်းကို — ၎င်း run နေတဲ့ context နဲ့ ဆက်စပ်ပေးနိုင်တဲ့ စွမ်းရည်ကို ပေးပါတယ်။ ဒီနည်းစနစ်ကို "instance data" လို့ ခေါ်ပြီး — သင့်ရဲ့ native add-on က load လုပ်ခံရတဲ့အခါ data တစ်ပိုင်းတည်းကို ခွဲဝေချထားတဲ့အခါ အသုံးဝင်ပါတယ်။

`napi_set_instance_data` က သင့်ရဲ့ native add-on ကို — ခွဲဝေချထားလိုက်တဲ့ memory တစ်ပိုင်းတည်းကို — add-on ကို load လုပ်ထားတဲ့ context နဲ့ ဆက်စပ်နိုင်စေပါတယ်။ ပြီးရင် `napi_get_instance_data` ကို သင့်ရဲ့ native add-on ထဲက ဘယ်နေရာမှာမဆို ခေါ်ပြီး — ခွဲဝေချထားခဲ့တဲ့ memory ရဲ့ တည်နေရာကို ပြန်လည် ရယူနိုင်ပါတယ်။

သင့်ရဲ့ `napi_set_instance_data` call ထဲမှာ finalizer callback တစ်ခုကို သတ်မှတ်ပါတယ်။ Finalizer callback ကို — သင့်ရဲ့ native add-on ကို memory ကနေ လွှတ်ပေးလိုက်တဲ့အခါ ခေါ်ပြီး — ဒီ context နဲ့ ဆက်စပ်နေတဲ့ memory ကို ပြန်လွှတ်ပေးရမယ့် နေရာက ဒီနေရာပဲ ဖြစ်ပါတယ်။

### အရင်းအမြစ်များ (Resources)

[Environment Life Cycle APIs](https://nodejs.org/api/n-api.html#environment-life-cycle-apis) — `napi_set_instance_data` နဲ့ `napi_get_instance_data` အတွက် Node.js documentation ဖြစ်ပါတယ်။

### ဥပမာ (Example)

ဒီဥပမာမှာ Worker Threads အများအပြားကို ဖန်တီးထားပါတယ်။ Worker Thread တစ်ခုချင်းစီက — `napi_set_instance_data` call တစ်ခုကို သုံးပြီး Worker Thread ရဲ့ context နဲ့ ချိတ်ဆက်ထားတဲ့ `AddonData` struct တစ်ခုကို ဖန်တီးပါတယ်။ အချိန်ကြာလာတာနဲ့အမျှ struct ထဲမှာ သိမ်းထားတဲ့ တန်ဖိုးကို — တွက်ချက်မှု အကုန်အကျများတဲ့ (computationally expensive) operation တစ်ခုကို သုံးပြီး — တိုးခြင်း၊ လျှော့ခြင်း လုပ်ဆောင်ပါတယ်။

အချိန်အတိုင်းအတာတစ်ခု ကြာတဲ့အခါ — Worker Threads တွေက သူတို့ရဲ့ operations တွေ ပြီးစီးပြီး — အဲဒီအချိန်မှာ ခွဲဝေချထားထားတဲ့ struct ကို `DeleteAddonData` function ထဲမှာ ပြန်လွှတ်ပေးပါတယ်။

#### binding.c


```c
#include <assert.h>
#include <math.h>
#include <stdlib.h>

#define NAPI_EXPERIMENTAL
#include <node_api.h>

// Structure containing information needed for as long as the addon exists. It
// replaces the use of global static data with per-addon-instance data by
// associating an instance of this structure with each instance of this addon
// during addon initialization. The instance of this structure is then passed to
// each binding the addon provides. Thus, the data stored in an instance of this
// structure is available to each binding, just as global static data would be.
typedef struct {
  double value;
} AddonData;

// This is the actual, useful work performed: increment or decrement the value
// stored per addon instance after passing it through a CPU-consuming but
// otherwise useless calculation.
static int ModifyAddonData(AddonData* data, double offset) {
    // Expensively increment or decrement the value.
    data->value = tan(atan(exp(log(sqrt(data->value * data->value))))) + offset;

    // Round the value to the nearest integer.
    data->value =
        (double)(((int)data->value) +
        (data->value - ((double)(int)data->value) > 0.5 ? 1 : 0));

    // Return the value as an integer.
    return (int)(data->value);
}

// This is boilerplate. The instance of the `AddonData` structure created during
// addon initialization must be destroyed when the addon is unloaded. This
// function will be called when the addon's `exports` object is garbage collected.
static void DeleteAddonData(napi_env env, void* data, void* hint) {
  // Avoid unused parameter warnings.
  (void) env;
  (void) hint;

  // Free the per-addon-instance data.
  free(data);
}

// This is also boilerplate. It creates and initializes an instance of the
// `AddonData` structure and ties its lifecycle to that of the addon instance's
// `exports` object. This means that the data will be available to this instance
// of the addon for as long as the JavaScript engine keeps it alive.
static AddonData* CreateAddonData(napi_env env, napi_value exports) {
  AddonData* result = malloc(sizeof(*result));
  result->value = 0.0;
  assert(napi_set_instance_data(env, result, DeleteAddonData, NULL) == napi_ok);
  return result;
}

// This function is called from JavaScript. It uses an expensive operation to
// increment the value stored inside the `AddonData` structure by one.
static napi_value Increment(napi_env env, napi_callback_info info) {
  // Retrieve the per-addon-instance data.
  AddonData* addon_data = NULL;
  assert(napi_get_instance_data(env, ((void**)&addon_data)) == napi_ok);

  // Increment the per-addon-instance value and create a new JavaScript integer
  // from it.
  napi_value result;
  assert(napi_create_int32(env,
                           ModifyAddonData(addon_data, 1.0),
                           &result) == napi_ok);

  // Return the JavaScript integer back to JavaScript.
  return result;
}

// This function is called from JavaScript. It uses an expensive operation to
// decrement the value stored inside the `AddonData` structure by one.
static napi_value Decrement(napi_env env, napi_callback_info info) {
  // Retrieve the per-addon-instance data.
  AddonData* addon_data = NULL;
  assert(napi_get_instance_data(env, ((void**)&addon_data)) == napi_ok);

  // Decrement the per-addon-instance value and create a new JavaScript integer
  // from it.
  napi_value result;
  assert(napi_create_int32(env,
                           ModifyAddonData(addon_data, -1.0),
                           &result) == napi_ok);

  // Return the JavaScript integer back to JavaScript.
  return result;
}

// Initialize the addon in such a way that it may be initialized multiple times
// per process. The function body following this macro is provided the value
// `env` which has type `napi_env` and the value `exports` which has type
// `napi_value` and which refers to a JavaScript object that ultimately contains
// the functions this addon wishes to expose. At the end, it must return a
// `napi_value`. It may return `exports`, or it may create a new `napi_value`
// and return that instead.
NAPI_MODULE_INIT(/*env, exports*/) {
  // Create a new instance of the per-instance-data that will be associated with
  // the instance of the addon being initialized here and that will be destroyed
  // along with the instance of the addon.
  AddonData* addon_data = CreateAddonData(env, exports);

  // Declare the bindings this addon provides. The data created above is given
  // as the last initializer parameter, and will be given to the binding when it
  // is called.
  napi_property_descriptor bindings[] = {
    {"increment", NULL, Increment, NULL, NULL, NULL, napi_enumerable, addon_data},
    {"decrement", NULL, Decrement, NULL, NULL, NULL, napi_enumerable, addon_data}
  };

  // Expose the two bindings declared above to JavaScript.
  assert(napi_define_properties(env,
                                exports,
                                sizeof(bindings) / sizeof(bindings[0]),
                                bindings) == napi_ok);

  // Return the `exports` object provided. It now has two new properties, which
  // are the functions we wish to expose to JavaScript.
  return exports;
}
```


#### index.js


```cjs
// Example illustrating the case where a native addon is loaded multiple times.
// This entire file is executed twice, concurrently - once on the main thread,
// and once on a thread launched from the main thread.

// We load the worker threads module, which allows us to launch multiple Node.js
// environments, each in its own thread.
const { Worker, isMainThread } = require('worker_threads');

// We load the native addon.
const addon = require('bindings')('multiple_load');

// The iteration count can be tweaked to ensure that the output from the two
// threads is interleaved. Too few iterations and the output of one thread
// follows the output of the other, not really illustrating the concurrency.
const iterations = 1000;

// This function is an idle loop that performs a random walk from 0 by calling
// into the native addon to either increment or decrement the initial value.
function useAddon(addon, prefix, iterations) {
  if (iterations >= 0) {
    if (Math.random() < 0.5) {
      console.log(prefix + ': new value (decremented): ' + addon.decrement());
    } else {
      console.log(prefix + ': new value (incremented): ' + addon.increment());
    }
    setImmediate(() => useAddon(addon, prefix, --iterations));
  }
}

if (isMainThread) {
  // On the main thread, we launch a worker and wait for it to come online. Then
  // we start the loop.
  new Worker(__filename).on('online', () =>
    useAddon(addon, 'Main thread', iterations)
  );
} else {
  // On the secondary thread we immediately start the loop.
  useAddon(addon, 'Worker thread', iterations);
}
```


## Cleanup Hooks (ရှင်းလင်းရေး Hook များ)

သင့်ရဲ့ native add-on က run နေတဲ့ context ကို ဖျက်ဆီးနေချိန်မှာ — Node.js runtime engine ကနေ အသိပေးချက် (notification) တစ်ခု ဒါမှမဟုတ် အများအပြားကို လက်ခံရရှိနိုင်ပါတယ်။ ဒါက သင့်ရဲ့ native add-on ကို — Node.js runtime engine က context ကို မဖျက်ဆီးခင် — ခွဲဝေချထားထားတဲ့ memory အားလုံးကို ပြန်လွှတ်ပေးဖို့ အခွင့်အရေး ပေးပါတယ်။

ဒီနည်းစနစ်ရဲ့ အားသာချက်က — သင့်ရဲ့ native add-on က — ၎င်း run နေတဲ့ context နဲ့ ဆက်စပ်ဖို့ memory အပိုင်းအစ အများအပြားကို ခွဲဝေချထားနိုင်ပါတယ်။ သင့်ရဲ့ native add-on run နေချိန်မှာ code အပိုင်း အသီးသီးကနေ memory buffers အများအပြား ခွဲဝေချထားဖို့ လိုအပ်တယ်ဆိုရင် ဒါက အသုံးဝင်နိုင်ပါတယ်။

အားနည်းချက်ကတော့ — ခွဲဝေချထားထားတဲ့ buffers တွေဆီ ဝင်ရောက်ဖို့ဆိုရင် — သင့်ရဲ့ native add-on run နေတဲ့ context အတွင်းမှာ pointers တွေကို ကိုယ်တိုင် ခြေရာခံ မှတ်သားထားဖို့ တာဝန်ရှိပါတယ်။ သင့်ရဲ့ native add-on ရဲ့ architecture ပေါ် မူတည်ပြီး — ဒါက ပြဿနာ ဖြစ်စရာ ရှိနိုင်သလို မရှိလည်း ဖြစ်နိုင်ပါတယ်။

### အရင်းအမြစ်များ (Resources)

[Cleanup on exit of the current Node.js instance](https://nodejs.org/api/n-api.html#cleanup-on-exit-of-the-current-nodejs-instance) — `napi_add_env_cleanup_hook` နဲ့ `napi_remove_env_cleanup_hook` အတွက် Node.js documentation ဖြစ်ပါတယ်။

### ဥပမာ (Example)

ခွဲဝေချထားထားတဲ့ buffers တွေကို ခြေရာခံတာက native add-on ရဲ့ architecture အပေါ် မူတည်နေတာမို့ — ဒီမှာတော့ buffers တွေကို ဘယ်လို ခွဲဝေချထားပြီး ပြန်လွှတ်ပေးနိုင်တယ်ဆိုတာ ပြသဖို့ ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကိုပဲ ဖော်ပြထားပါတယ်။

#### binding.cc


```cpp
#include <stdlib.h>
#include <stdio.h>
#include "node_api.h"

namespace {

void CleanupHook (void* arg) {
  printf("cleanup(%d)\n", *static_cast<int*>(arg));
  free(arg);
}

napi_value Init(napi_env env, napi_value exports) {
  for (int i = 1; i < 5; i++) {
    int* value = (int*)malloc(sizeof(*value));
    *value = i;
    napi_add_env_cleanup_hook(env, CleanupHook, value);
  }
  return exports;
}

}  // anonymous namespace

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```


#### index.js


```cjs
'use strict';

// We load the native addon.
const addon = require('bindings')('multiple_load');
const assert = require('assert');
const child_process = require('child_process');

assert.ok(addon);

if (process.argv[2] === 'child') {
  const childAddon = require('bindings')('multiple_load');
  assert.ok(childAddon);
  process.exit(0);
}

const child = child_process.fork(__filename, ['child'], {
  stdio: 'inherit',
});

child.on('exit', code => {
  assert.strictEqual(code, 0);
});
```

