---
title: "Invoking Entrypoints (entrypoints ခေါ်ယူခြင်း)"
description: "adapter runtime context ဖြင့် Node.js/Edge build entrypoints ခေါ်နည်း"
order: 254
source: "https://nextjs.org/docs/app/api-reference/adapters/invoking-entrypoints"
status: translated
updated: 2026-09-03
---

Build output ရဲ့ entrypoints တွေက `handler(..., ctx)` interface တစ်ခုကို အသုံးပြုပြီး — runtime တစ်ခုချင်းစီအလိုက် သီးသန့်ဖြစ်တဲ့ request/response types တွေ ပါဝင်ပါတယ်။

## Node.js runtime (`runtime: 'nodejs'`)

Node.js entrypoints တွေက အောက်ပါ interface ကို အသုံးပြုပါတယ်:

```typescript
handler(
  req: IncomingMessage,
  res: ServerResponse,
  ctx: {
    waitUntil?: (promise: Promise<void>) => void
    requestMeta?: RequestMeta
  }
): Promise<void>
```

Node.js entrypoints တွေကို တိုက်ရိုက် invoke လုပ်တဲ့အခါ — adapters တွေက internals တွေကို အားကိုးနေစရာ မလိုဘဲ — `requestMeta` ပေါ်မှာ helper တွေကို တိုက်ရိုက် ထည့်ပေးနိုင်ပါတယ်။ Supported fields တချို့ကတော့ `hostname`, `revalidate` နဲ့ `render404` တို့ ဖြစ်ပါတယ်:

```ts
await handler(req, res, {
  requestMeta: {
    // Relative path from process.cwd() to the Next.js project directory.
    relativeProjectDir: '.',
    // Optional hostname used by route handlers when constructing absolute URLs.
    hostname: '127.0.0.1',
    // Optional internal revalidate function to avoid revalidating over the network
    revalidate: async ({ urlPath, headers, opts }) => {
      // platform-specific revalidate implementation
    },
    // Optional function to render the 404 page for pages router `notFound: true`
    render404: async (req, res, parsedUrl, setHeaders) => {
      // platform-specific 404 rendering implementation
    },
  },
})
```

Next.js core ထဲက သက်ဆိုင်ရာ files တွေကတော့:

- [`packages/next/src/build/templates/app-page.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/app-page.ts)
- [`packages/next/src/build/templates/app-route.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/app-route.ts)
- နဲ့ [`packages/next/src/build/templates/pages-api.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/pages-api.ts)

## Edge runtime (`runtime: 'edge'`) (deprecated)

> Edge Runtime က [deprecated](https://nextjs.org/docs/messages/edge-runtime-deprecated) ဖြစ်ပါတယ်။ Route အသစ်တွေမှာ Node.js runtime ကို သုံးသင့်ပါတယ်။

Edge entrypoints တွေက အောက်ပါ interface ကို အသုံးပြုပါတယ်:

```typescript
handler(
  request: Request,
  ctx: {
    waitUntil?: (prom: Promise<void>) => void
    signal?: AbortSignal
    requestMeta?: RequestMeta
  }
): Promise<Response>
```

ပုံစံက `handler(..., ctx)` ကို ဗဟိုပြုပြီး ညှိထားပေမယ့် — Node.js နဲ့ Edge runtimes တွေက မတူညီတဲ့ request/response primitives တွေကို သုံးပါတယ်။

`runtime: 'edge'` ရှိတဲ့ outputs တွေအတွက် — Next.js က entrypoint ကို invoke လုပ်ဖို့ လိုအပ်တဲ့ canonical metadata တွေပါတဲ့ `output.edgeRuntime` ကိုလည်း ပေးပါတယ်:

```typescript
{
  modulePath: string // Absolute path to the module registered in the edge runtime
  entryKey: string // Canonical key used by the edge entry registry
  handlerExport: string // Export name to invoke, currently 'handler'
}
```

သင့် edge runtime က `modulePath` အတွက် chunks တွေကို load လုပ်ပြီး evaluate လုပ်ပြီးတာနဲ့ — global edge entry registry (`globalThis._ENTRIES`) ထဲက registered entry ကို ဖတ်ဖို့ `entryKey` ကို အသုံးပြုပြီး — အဲဒီ entry ကနေ `handlerExport` ကို invoke လုပ်ပါ:

```ts
const entry = await globalThis._ENTRIES[output.edgeRuntime.entryKey]
const handler = entry[output.edgeRuntime.handlerExport]
await handler(request, ctx)
```

Filenames တွေကနေ registry keys (သို့) handler names တွေကို ဆင်းသက် (derive) လုပ်နေစရာ မလိုဘဲ — `edgeRuntime` ကို အသုံးပြုပါ။

Next.js core ထဲက သက်ဆိုင်ရာ files တွေကတော့:

- [`packages/next/src/build/templates/edge-ssr.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/edge-ssr.ts)
- [`packages/next/src/build/templates/edge-app-route.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/edge-app-route.ts)
- [`packages/next/src/build/templates/pages-edge-api.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/pages-edge-api.ts)
- နဲ့ [`packages/next/src/build/templates/middleware.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/templates/middleware.ts)
