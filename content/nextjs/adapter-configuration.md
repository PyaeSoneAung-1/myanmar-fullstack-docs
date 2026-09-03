---
title: "Configuration (adapter ပြင်ဆင်သတ်မှတ်ခြင်း)"
description: "adapterPath (သို့) NEXT_ADAPTER_PATH ဖြင့် custom deployment adapter သုံးနည်း"
order: 247
source: "https://nextjs.org/docs/app/api-reference/adapters/configuration"
status: translated
updated: 2026-09-03
---

Adapter တစ်ခုကို သုံးဖို့ — သင့် adapter module ဆီကို ညွှန်တဲ့ path ကို `adapterPath` မှာ သတ်မှတ်ပါ:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  adapterPath: require.resolve('./my-adapter.js'),
}

module.exports = nextConfig
```

တနည်းအားဖြင့် `NEXT_ADAPTER_PATH` ကို သတ်မှတ်ပြီး deployment platforms တွေမှာ zero-config အသုံးပြုမှုကိုလည်း ဖွင့်နိုင်ပါတယ်။
