---
title: "CMake.js (node-gyp ၏ CMake-based အခြားနည်းလမ်း)"
description: "node-gyp ရဲ့ CMake-based အခြားနည်းလမ်း — CMake install လုပ်ခြင်း, package.json ပြင်ဆင်မှု, CMakeLists.txt ဖြင့် တည်ဆောက်ခြင်း, NAPI_VERSION နဲ့ node-addon-api အတွက် configuration"
order: 81
source: "https://nodejs.org/learn/node-api/build-tools/cmake-js"
status: translated
updated: 2026-09-02
---

[CMake.js](https://github.com/cmake-js/cmake-js) က [node-gyp](/docs/nodejs/node-api-node-gyp) ရဲ့ ကောင်းမွန်တဲ့ build tool အခြားနည်းလမ်း (alternative) တစ်ခုပါ။ CMake.js က [CMake](https://cmake.org) tool ပေါ်မှာ အခြေခံပြီး — CMake ကို ကြိုတင် install လုပ်ထားရပါမယ်။

### အားသာချက်များ (Pros)

- Open source community မှာ တွင်ကျယ်စွာ သုံးစွဲနေတဲ့ CMake tool ကို အသုံးပြုတယ်။
- CMake ကို အခြေခံထားပြီးသား ရှိပြီးသား C/C++ libraries တွေအတွက် အကောင်းဆုံး ဖြစ်တယ်။

### အားနည်းချက်များ (Cons)

- Node community မှာတော့ သိပ်ပြီး တွင်ကျယ်မှု မရှိသေးဘူး။

## Install လုပ်ခြင်း (Installation)

CMake.js ကို မသုံးခင် CMake ကို ကြိုတင် install လုပ်ထားရပါမယ်။ Installer တွေကို [CMake website](https://cmake.org) မှာ ရနိုင်ပါတယ်။

> macOS developer တွေအတွက်ဆိုရင် — [Homebrew](https://brew.sh) ကို သုံးပြီး CMake ကို install လုပ်တာက ပိုပြီး အဆင်ပြေပါတယ်။ Homebrew install လုပ်ပြီးသားဆိုရင် — `brew install cmake` ဆိုတဲ့ command နဲ့ CMake ကို install လုပ်နိုင်ပါတယ်။

CMake install ဖြစ်မဖြစ် ဒီ command နဲ့ စစ်ဆေးနိုင်ပါတယ်:

```bash
cmake --version
```

Node native module developer တစ်ယောက်အနေနဲ့ — CMake.js ကို global command line tool အနေနဲ့ install လုပ်ထားတာက အဆင်ပြေစေနိုင်ပါတယ်:

```bash
npm install cmake-js -g
```

CMake.js install ဖြစ်မဖြစ် ဒီ command နဲ့ စစ်ဆေးနိုင်ပါတယ်:

```bash
cmake-js --version
```

## package.json

သင့် native module က CMake.js နဲ့ အလုပ်လုပ်ဖို့ — `package.json` file ထဲမှာ entry နှစ်ခုလောက် လိုအပ်ပါတယ်။

Native module ကို install လုပ်ချိန်မှာ CMake.js နဲ့ compile လုပ်ဖို့ လိုတာမို့ — `package.json` ရဲ့ `scripts` property ထဲမှာ ဒါကို ဖြစ်စေမယ့် `install` entry တစ်ခု ထည့်ပေးရပါမယ်:

```json
  "scripts": {
    "install": "cmake-js compile"
  }
```

သင့် native module ကို သုံးမယ့်သူတွေမှာ CMake.js ကို global command line tool အနေနဲ့ install လုပ်ထားဖို့က မဖြစ်နိုင်သလောက်ပါ။ ဒါကြောင့် — သင့် project က CMake.js ကို development dependency အနေနဲ့ ကြေညာထားဖို့ လိုပါတယ်။ ဒီ command နဲ့ ထည့်သွင်းနိုင်ပါတယ်:

```bash
npm install cmake-js --save-dev
```

တစ်နည်းအားဖြင့် — development dependency ကို သင့် `package.json` file ထဲမှာ ကိုယ်တိုင် manual အနေနဲ့ ထည့်နိုင်ပါတယ်:

```json
  "devDependencies": {
    "cmake-js": "^6.0.0"
  }
```

ဒီနည်းလမ်းရဲ့ ဥပမာတစ်ခုကို [ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/nodejs/node-addon-examples/blob/main/src/8-tooling/build_with_cmake/node-addon-api/package.json)။

## CMakeLists.txt

CMake.js နဲ့ တည်ဆောက်တဲ့ native modules တွေမှာ — module ကို ဘယ်လို တည်ဆောက်ရမယ်ဆိုတာ ဖော်ပြတဲ့ `CMakeLists.txt` file တစ်ခု ရှိပါတယ်။ ဒီ file က — `node-gyp` သုံးတဲ့ project တွေမှာ `binding.gyp` က လုပ်ပေးတဲ့ အလုပ်ကိုပဲ လုပ်ပေးပါတယ်။

CMake build တိုင်းမှာ လိုအပ်တဲ့ entries တွေအပြင် — native modules တွေ တည်ဆောက်တဲ့အခါ ထပ်ဆောင်း entries တွေလည်း လိုအပ်ပါတယ်။

### CMake.js

CMake.js ကို သုံးပြီး တည်ဆောက်တဲ့ native modules အားလုံးအတွက် လိုအပ်တဲ့ စာကြောင်းတွေက ဒီမှာပါ:

```cpp
project(node-api-cmake-build-example)
include_directories(${CMAKE_JS_INC})
file(GLOB SOURCE_FILES "hello.cc")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
```

### NAPI_VERSION

Node-API ကို အခြေခံတဲ့ native module တစ်ခုကို တည်ဆောက်တဲ့အခါ — module က အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားတဲ့ အနိမ့်ဆုံး (minimum) Node-API version ကို ကြေညာထားဖို့ အရေးကြီးပါတယ်။ CMake.js အတွက်ဆိုရင် — `CMakeLists.txt` file ထဲမှာ ဒီလိုမျိုး စာကြောင်းတစ်ကြောင်း ထည့်ပြီး လုပ်ဆောင်နိုင်ပါတယ်:

```cpp
# NAPI_VERSION ကို သတ်မှတ်ခြင်း
add_definitions(-DNAPI_VERSION=3)
```

> တခြား လိုအပ်ချက်တွေ မရှိဘူးဆိုရင် — Node-API version 3 က ကောင်းတဲ့ ရွေးချယ်မှုပါ။ Node-API က experimental အဆင့်ကနေ ထွက်လာချိန်မှာ အသက်ဝင်နေတဲ့ Node-API version က 3 ဖြစ်လို့ပါ။

### node-addon-api

`node-addon-api` ကို အခြေခံတဲ့ Node-API modules တွေအတွက်တော့ configuration values တချို့ ထပ်ဆောင်း လိုအပ်ပါတယ်။

`node-addon-api` က C++11 လိုအပ်ပါတယ်။ `CMakeLists.txt` file ရဲ့ ထိပ်ဆုံးမှာ ရှိတဲ့ ဒီ configuration စာကြောင်းတွေက ဒီလိုအပ်ချက်ကို သတ်မှတ်ပေးပါတယ်:

```cpp
cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 11)
```

`node-addon-api` ကို အခြေခံတဲ့ modules တွေမှာ — Node ကိုယ်တိုင်၏ အစိတ်အပိုင်း မဟုတ်တဲ့ ထပ်ဆောင်း header files တွေကို include လုပ်ပါတယ်။ ဒီ files တွေကို ဘယ်နေရာမှာ ရှာရမယ်ဆိုတာ CMake.js ကို ညွှန်ကြားပေးတဲ့ စာကြောင်းတွေက ဒီမှာပါ:

```cpp
# Node-API wrappers များကို include လုပ်ခြင်း
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
```

ဒီနည်းလမ်းရဲ့ ဥပမာတစ်ခုကို [ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/nodejs/node-addon-examples/blob/main/src/8-tooling/build_with_cmake/node-addon-api/CMakeLists.txt)။
