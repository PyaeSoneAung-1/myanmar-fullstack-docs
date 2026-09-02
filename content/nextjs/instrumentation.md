---
title: "instrumentation.js (observability tools ပေါင်းစည်းခြင်း)"
description: "instrumentation.js|ts — register() နဲ့ onRequestError() exports တွေကနေ observability tools တွေ ထည့်သွင်း၊ production မှာ performance/behavior ခြေရာခံပြီး ပြဿနာရှာနည်း"
order: 47
source: "https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation"
status: translated
updated: 2026-09-02
---

`instrumentation.js|ts` file ကို သင့် application ထဲကို observability tools တွေ ပေါင်းစည်းဖို့ သုံးပါတယ် — performance နဲ့ behavior တွေကို ခြေရာခံနိုင်ပြီး production မှာ ဖြစ်ပေါ်တဲ့ ပြဿနာတွေကို ရှာဖွေ debug လုပ်နိုင်ပါတယ်။

သုံးဖို့အတွက် — file ကို သင့် application ရဲ့ **root** မှာ (သို့) [`src` folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) သုံးနေရင် အဲဒီအထဲမှာ ထားပါ။

## Exports

### `register` (optional)

ဒီ file က Next.js server instance အသစ်တစ်ခု စတင်တဲ့အခါ **တစ်ကြိမ်တည်း** ခေါ်ပေးတဲ့ `register` function တစ်ခုကို export လုပ်ပါတယ် — server က requests တွေကို လက်ခံဖို့ အသင့်မဖြစ်ခင် ဒီ function က ပြီးစီးနေရပါမယ်။ `register` က async function ဖြစ်နိုင်ပါတယ်။

```ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

### `onRequestError` (optional)

**Server** errors တွေကို ကိုယ်ပိုင် observability provider တစ်ခုဆီ ခြေရာခံဖို့ `onRequestError` function ကို export လုပ်နိုင်ပါတယ်။

- `onRequestError` ထဲမှာ async tasks တွေ run နေရင် — သူတို့ကို await လုပ်ထားဖို့ သေချာပါစေ။ Next.js server က error ကို ဖမ်းမိတဲ့အခါ `onRequestError` က trigger ဖြစ်ပါတယ်။
- Server Components rendering အတွင်းမှာ error တွေ့ရင် React က process လုပ်တာကြောင့် — `error` instance က မူလ throw လုပ်လိုက်တဲ့ error အတိအကျ မဟုတ်ဘဲ ဖြစ်နိုင်ပါတယ်။ အဲဒီလိုဆို error ရဲ့ `digest` property ကို သုံးပြီး တကယ့် error type ကို ခွဲခြားသိရှိနိုင်ပါတယ်။

```ts
// instrumentation.ts
import { type Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  const message = err instanceof Error ? err.message : String(err)
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err
      ? String(err.digest)
      : undefined

  await fetch('https://.../report-error', {
    method: 'POST',
    body: JSON.stringify({
      message,
      digest,
      request,
      context,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

#### Parameters

ဒီ function က parameter သုံးခု လက်ခံပါတယ် — `error`, `request`, `context`:

```ts
// Types
export function onRequestError(
  error: unknown,
  request: {
    path: string // resource path, e.g. /blog?name=foo
    method: string // request method. e.g. GET, POST, etc
    headers: { [key: string]: string | string[] }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router' // the router type
    routePath: string // the route file path, e.g. /app/blog/[dynamic]
    routeType: 'render' | 'route' | 'action' | 'proxy' // the context in which the error occurred
    renderSource:
      | 'react-server-components'
      | 'react-server-components-payload'
      | 'server-rendering'
    revalidateReason: 'on-demand' | 'stale' | undefined // undefined is a normal request without revalidation
    renderType: 'dynamic' | 'dynamic-resume' // 'dynamic-resume' for PPR
  }
): void | Promise<void>
```

- `error`: ဖမ်းမိတဲ့ တန်ဖိုးကို `unknown` အဖြစ် type လုပ်ထားပါတယ် — `message` (သို့) `digest` လိုမျိုး properties တွေ မဖတ်ခင် type ကို ကျဉ်းမြောင်းအောင် (narrow) လုပ်ပါ။
- `request`: error နဲ့ ဆက်စပ်နေတဲ့ read-only request အချက်အလက်ပါ။
- `context`: error ဖြစ်ပွားတဲ့ အခြေအနေပါ — router type (App (သို့) Pages Router) နဲ့/သို့မဟုတ် Server Components (`'render'`), Route Handlers (`'route'`), Server Actions (`'action'`), (သို့) Proxy (`'proxy'`) ဆိုတဲ့နေရာတွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်။

### Runtime သတ်မှတ်ခြင်း

`instrumentation.js` file က Node.js ရော Edge runtime မှာပါ အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် — `process.env.NEXT_RUNTIME` ကို သုံးပြီး runtime တစ်ခုချင်းစီအတွက် သီးခြား code တွေ ရွေးထည့်နိုင်ပါတယ်။

```js
// instrumentation.js
export function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return require('./register.edge')
  } else {
    return require('./register.node')
  }
}

export function onRequestError() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return require('./on-request-error.edge')
  } else {
    return require('./on-request-error.node')
  }
}
```

## Version History

| Version   | အပြောင်းအလဲ                                        |
| --------- | ------------------------------------------------- |
| `v15.0.0` | `onRequestError` မိတ်ဆက်၊ `instrumentation` stable ဖြစ်လာ |
| `v14.0.4` | `instrumentation` အတွက် Turbopack support         |
| `v13.2.0` | `instrumentation` ကို experimental feature အဖြစ် စတင် မိတ်ဆက် |
