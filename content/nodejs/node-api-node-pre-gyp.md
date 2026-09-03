---
title: "node-pre-gyp (Pre-built Binaries ဖြန့်ချီခြင်း)"
description: "Native addon binaries တွေကို ကြိုတင် compile လုပ်ပြီး remote ကနေ download လုပ်စေခြင်းဖြင့် သုံးစွဲသူတိုင်းမှာ C/C++ toolchain မလိုအောင် လုပ်ပေးတဲ့ node-pre-gyp — Amazon S3 setup, package.json/binding.gyp ပြင်ဆင်မှု, JavaScript အပြောင်းအလဲများ, publish နဲ့ CI"
order: 87
source: "https://nodejs.org/en/learn/node-api/build-tools/node-pre-gyp"
status: translated
updated: 2026-09-03
---

Native addon တွေရဲ့ ကန့်သတ်ချက်တစ်ခုက — ၎င်းတို့ကို target platform နဲ့ architecture တစ်ခုချင်းစီအတွက် compile လုပ်ပေးရမှာ ဖြစ်ပါတယ်။ Pre-built binaries တွေ မရှိဘူးဆိုရင် — သင့် package ကို install လုပ်တဲ့ သုံးစွဲသူတိုင်းရဲ့ machine ပေါ်မှာ အလုပ်လုပ်တဲ့ C/C++ toolchain တစ်ခု ရှိရပါမယ်။

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) က ဒါကို — binaries တွေကို ကြိုတင် (ahead of time) တည်ဆောက်ပြီး — remote နေရာတစ်ခုဆီ upload လုပ်ကာ — install လုပ်ချိန်မှာ သုံးစွဲသူတွေ ကိုက်ညီတဲ့ binary ကို download လုပ်နိုင်အောင် လုပ်ပေးခြင်းဖြင့် ဖြေရှင်းပါတယ် — ကိုက်ညီတဲ့ binary မရှိမှသာ source ကနေ compile လုပ်တာကို နောက်ဆုတ် (fall back) လုပ်ပါတယ်။

> Node-API အတွက် ထောက်ပံ့မှုကို node-pre-gyp ရဲ့ version 0.8.0 မှာ ထည့်သွင်းခဲ့တာကို သတိပြုပါ။

ဒီ page က Node-API addon တစ်ခုကို node-pre-gyp ထောက်ပံ့နိုင်အောင် လိုအပ်တဲ့ ပြောင်းလဲမှုတွေကို ဖော်ပြပါတယ်။

## Amazon S3

ပုံမှန်အားဖြင့် — node-pre-gyp က binaries တွေကို [Amazon S3](https://aws.amazon.com/s3/) ဆီ upload လုပ်ပါတယ်။

> [node-pre-gyp-github](https://github.com/bchr02/node-pre-gyp-github) module က GitHub Releases ဆီ publish လုပ်တဲ့ ထောက်ပံ့မှုကို ထပ်ဖြည့်ပေးပါတယ်။

### Amazon S3 လိုအပ်ချက်များ (Amazon S3 Requirements)

Upload မလုပ်ခင် အောက်ပါတို့ လိုအပ်ပါတယ်:

1. Amazon Web Services account တစ်ခု။
2. S3 ဆီ upload လုပ်ခွင့် ရှိတဲ့ IAM user (သို့) role တစ်ခု။
3. Binaries တွေ ထားရှိဖို့ [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html) တစ်ခု။

### AWS Credentials (AWS အထောက်အထားများ)

Credentials တွေကို repository ထဲမှာ ဘယ်တော့မှ သိမ်းဆည်းမထားပါနဲ့။ Development လုပ်ချိန်အတွင်း credentials တွေ ထောက်ပံ့ဖို့ node-pre-gyp က အသုံးများတဲ့ နည်းလမ်း နှစ်ခုကို ထောက်ပံ့ပေးပါတယ်:

1. `~/.node_pre_gyprc` file တစ်ခု:

   ```json
   {
     "accessKeyId": "xxx",
     "secretAccessKey": "xxx"
   }
   ```

2. Environment variables တွေ:

   ```bash
   export node_pre_gyp_accessKeyId=xxx
   export node_pre_gyp_secretAccessKey=xxx
   ```

CI environments တွေအတွက်တော့ — long-lived access keys တွေထက် IAM roles (သို့) short-lived credentials တွေကို ဦးစားပေး သုံးပါ။ နောက်ထပ် option တွေအတွက် [node-pre-gyp credentials documentation](https://github.com/mapbox/node-pre-gyp#3-configure-aws-credentials) ကို ကြည့်ပါ။

## package.json

### `dependencies` နဲ့ `devDependencies` Properties များ

Package ကို အခု `@mapbox` scope အောက်မှာ publish လုပ်ပါတယ်။ Upload လုပ်တဲ့ အဆင့်အတွက် `@aws-sdk/client-s3` ကို dev dependency အဖြစ် သုံးပါ။

```json
"dependencies": {
  "@mapbox/node-pre-gyp": "^1.0.0"
},
"devDependencies": {
  "@aws-sdk/client-s3": "^3.0.0"
}
```

### `scripts` Property

`install` script က node-pre-gyp ကို `--fallback-to-build` flag နဲ့ ခေါ်သင့်ပါတယ် — ဒါဆို pre-built binary မရှိတဲ့ သုံးစွဲသူတွေ ကိုယ့် machine ပေါ်မှာ ကိုယ်တိုင် compile လုပ်နိုင်မှာ ဖြစ်ပါတယ်:

```json
"scripts": {
  "install": "node-pre-gyp install --fallback-to-build"
}
```

### `binary` Property

`binary` property က node-pre-gyp ကို — သင့် addon က Node-API version ဘယ်တွေကို ထောက်ပံ့လဲ နဲ့ — binaries တွေကို ဘယ်မှာ ရှာတွေ့/upload လုပ်ရမယ်ဆိုတာ ပြောပြပါတယ်:

```json
"binary": {
  "module_name": "your_module",
  "module_path": "./lib/binding/napi-v{napi_build_version}",
  "remote_path": "./{module_name}/v{version}/{configuration}/",
  "package_name": "{platform}-{arch}-napi-v{napi_build_version}.tar.gz",
  "host": "https://your_bucket.s3.us-west-1.amazonaws.com",
  "napi_versions": [3]
}
```

`module_name` ကို valid C identifier တစ်ခုအနေနဲ့ သတ်မှတ်ပါ။ `napi_versions` array က — Node-API version ဘယ်တွေအတွက် build လုပ်ရမယ်ဆိုတာကို စာရင်းပြုစုပေးပြီး — addon အများစုအတွက် `3` က သင့်တင့်လုံလောက်တဲ့ အနိမ့်ဆုံး (minimum) တန်ဖိုး ဖြစ်ပါတယ်။

[Node-API အတွက် ထည့်သွင်း စဉ်းစားမှုများ](https://github.com/mapbox/node-pre-gyp#n-api-considerations) အပါအဝင် — ပြည့်စုံတဲ့ ကိုးကားချက်အတွက် [node-pre-gyp docs](https://github.com/mapbox/node-pre-gyp#1-add-new-entries-to-your-packagejson) ကို ကြည့်ပါ။

## binding.gyp

### Target အသစ်တစ်ခု (New Target)

Compile လုပ်ပြီးသား binary ကို `module_path` မှာ သတ်မှတ်ထားတဲ့ path ဆီ copy လုပ်ဖို့ post-build target တစ်ခု ထည့်ပါ:

```json
{
  "target_name": "action_after_build",
  "type": "none",
  "dependencies": ["<(module_name)"],
  "copies": [
    {
      "files": ["<(PRODUCT_DIR)/<(module_name).node"],
      "destination": "<(module_path)"
    }
  ]
}
```

### NAPI_VERSION

Header files တွေ ကိုယ့်ဘာသာကိုယ် မှန်ကန်စွာ configure လုပ်နိုင်အောင် — Node-API version ကို ပထမ target ရဲ့ `defines` ထဲမှာ ထည့်သွင်းပါ:

```json
"defines": [
  "NAPI_VERSION=<(napi_build_version)"
]
```

## JavaScript အပြောင်းအလဲများ (JavaScript Updates)

Native binary ကို load လုပ်တဲ့ JavaScript code က — မှန်ကန်တဲ့ `.node` file ဆီ path ကို ရွေ့လျားစွာ (dynamically) ရှာဖွေ ဖြေရှင်းရပါမယ်:

```cjs
const binary = require('@mapbox/node-pre-gyp');
const path = require('path');
const bindingPath = binary.find(
  path.resolve(path.join(__dirname, './package.json'))
);
const binding = require(bindingPath);
```

## Build (တည်ဆောက်ခြင်း)

အရာအားလုံး နေရာတကျ ဖြစ်သွားရင် — source ကနေ build လုပ်ပါ:

```bash
npm install --build-from-source
```

## Package လုပ်ပြီး Publish လုပ်ခြင်း (Package and Publish)

```bash
./node_modules/.bin/node-pre-gyp package
./node_modules/.bin/node-pre-gyp publish
```

## CI နဲ့ အလိုအလျောက် Build များ (CI and Automated Builds)

[GitHub Actions](https://docs.github.com/en/actions) ကို သုံးပြီး — platform မျိုးစုံနဲ့ architecture မျိုးစုံအတွက် binaries တွေကို build, test နဲ့ publish လုပ်ပါ။ ပုံမှန် workflow matrix တစ်ခုက `ubuntu-latest`, `macos-latest` နဲ့ `windows-latest` တွေကို လွှမ်းခြုံပြီး — သင်လိုအပ်တဲ့ architecture variant တွေ (ဥပမာ — `x64`, `arm64`) ကိုပါ ထည့်သွင်းနိုင်ပါတယ်။ [ဥပမာ workflow configuration တွေ](https://github.com/mapbox/node-pre-gyp) အတွက် node-pre-gyp repository ကို ကြည့်ပါ။
