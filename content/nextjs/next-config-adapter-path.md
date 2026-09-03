---
title: "adapterPath (custom adapter သတ်မှတ်ချက်)"
description: "adapterPath option — deployment platforms (သို့) build systems များ Next.js build process နှင့် ပေါင်းစပ်နိုင်ရန် ကိုယ်ပိုင် adapter module ၏ path ကို သတ်မှတ်ခြင်း; NEXT_ADAPTER_PATH environment variable ဖြင့်လည်း zero-config သတ်မှတ်နိုင်; Adapters API ဆိုင်ရာ လင့်များ"
order: 206
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath"
status: translated
updated: 2026-09-03
---

Next.js မှာ built-in adapters API တစ်ခု ပါဝင်ပါတယ်။ ဒါက deployment platforms (သို့) build systems တွေကို Next.js build process နဲ့ ပေါင်းစပ်နိုင်စေပါတယ်။

Reference implementation အပြည့်အစုံအတွက် [`nextjs/adapter-vercel`](https://github.com/nextjs/adapter-vercel) adapter ကို ကြည့်ပါ။

## Configuration (ပြင်ဆင်သတ်မှတ်ခြင်း)

Adapter တစ်ခုကို သုံးဖို့ — သင့် adapter module ဆီကို ညွှန်တဲ့ path ကို `adapterPath` မှာ သတ်မှတ်ပါ:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  adapterPath: require.resolve('./my-adapter.js'),
}

module.exports = nextConfig
```

တနည်းအားဖြင့် `NEXT_ADAPTER_PATH` ကို သတ်မှတ်ပြီး deployment platforms တွေမှာ zero-config အသုံးပြုမှုကိုလည်း ဖွင့်နိုင်ပါတယ်။

## Adapters

Adapter implementation အသေးစိတ် အပြည့်အစုံအတွက် သီးသန့် Adapters section ကို သုံးပါ:

- [Configuration](https://nextjs.org/docs/app/api-reference/adapters/configuration)
- [Creating an Adapter](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter)
- [API Reference](https://nextjs.org/docs/app/api-reference/adapters/api-reference)
- [Testing Adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters)
- [Routing with `@next/routing`](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing)
- [Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter)
- [Runtime Integration](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration)
- [Invoking Entrypoints](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints)
- [Output Types](https://nextjs.org/docs/app/api-reference/adapters/output-types)
- [Routing Information](https://nextjs.org/docs/app/api-reference/adapters/routing-information)
- [Use Cases](https://nextjs.org/docs/app/api-reference/adapters/use-cases)

## Creating an Adapter

အသေးစိတ်အတွက် [Creating an Adapter](https://nextjs.org/docs/app/api-reference/adapters/creating-an-adapter) ကို ကြည့်ပါ။

## API Reference

အသေးစိတ်အတွက် [API Reference](https://nextjs.org/docs/app/api-reference/adapters/api-reference) ကို ကြည့်ပါ။

## Testing Adapters

အသေးစိတ်အတွက် [Testing Adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters) ကို ကြည့်ပါ။

## Routing with `@next/routing`

အသေးစိတ်အတွက် [Routing with `@next/routing`](https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing) ကို ကြည့်ပါ။

## Implementing PPR in an Adapter

အသေးစိတ်အတွက် [Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter) ကို ကြည့်ပါ။

## Runtime Integration

အသေးစိတ်အတွက် [Runtime Integration](https://nextjs.org/docs/app/api-reference/adapters/runtime-integration) ကို ကြည့်ပါ။

## Invoking Entrypoints

အသေးစိတ်အတွက် [Invoking Entrypoints](https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints) ကို ကြည့်ပါ။

## Output Types

အသေးစိတ်အတွက် [Output Types](https://nextjs.org/docs/app/api-reference/adapters/output-types) ကို ကြည့်ပါ။

## Routing Information

အသေးစိတ်အတွက် [Routing Information](https://nextjs.org/docs/app/api-reference/adapters/routing-information) ကို ကြည့်ပါ။

## Use Cases

အသေးစိတ်အတွက် [Use Cases](https://nextjs.org/docs/app/api-reference/adapters/use-cases) ကို ကြည့်ပါ။
