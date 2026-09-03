---
title: "Implementing PPR in an Adapter (adapter ထဲ PPR ထည့်သွင်းခြင်း)"
description: "adapter ထဲ Partial Prerendering support — fallback output, cache hooks, resume flow"
order: 252
source: "https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter"
status: translated
updated: 2026-09-03
---

Partially prerendered app routes တွေအတွက် — `onBuildComplete` က PPR ကို seed (ကနဦး ဖြည့်တင်ခြင်း) လုပ်ဖို့နဲ့ resume (ပြန်လည် စတင်ခြင်း) လုပ်ဖို့ လိုအပ်တဲ့ data တွေကို သင့်ကို ပေးပါတယ်:

- `outputs.prerenders[].fallback.filePath`: ထုတ်လုပ်ထားတဲ့ fallback shell ရဲ့ file path (ဥပမာ — HTML)
- `outputs.prerenders[].fallback.postponedState`: rendering ကို resume လုပ်ဖို့ အသုံးပြုတဲ့ serialize လုပ်ထားသော postponed state

## 1. Build ချိန်တွင် seed shell + postponed state ကို ပြင်ဆင်ခြင်း

```ts filename="my-adapter.ts"
import { readFile } from 'node:fs/promises'

async function seedPprEntries(outputs: AdapterOutputs) {
  for (const prerender of outputs.prerenders) {
    const fallback = prerender.fallback
    if (!fallback?.filePath || !fallback.postponedState) continue

    const shell = await readFile(fallback.filePath, 'utf8')
    await platformCache.set(prerender.pathname, {
      shell,
      postponedState: fallback.postponedState,
      initialHeaders: fallback.initialHeaders,
      initialStatus: fallback.initialStatus,
      initialRevalidate: fallback.initialRevalidate,
      initialExpiration: fallback.initialExpiration,
    })
  }
}
```

## 2. Runtime flow — cached shell ကို serve လုပ်ပြီး background မှာ resume လုပ်ခြင်း

Request ဝင်လာချိန်မှာ — အောက်ပါတို့ ပေါင်းစပ်ထားတဲ့ response တစ်ခုတည်းကို stream လုပ်နိုင်ပါတယ်:

1. cache လုပ်ထားတဲ့ HTML shell stream
2. resume လုပ်ထားတဲ့ render stream (`handler` ကို postponed state နဲ့ invoke လုပ်ပြီးမှ ထုတ်လုပ်ပေးတာ)

```text
Client
  | GET /ppr-route
  v
Adapter Router
  |
  |-- read cached shell + postponedState ---> Platform Cache
  |<------------- cache hit -----------------|
  |
  |-- create responseStream = concat(shellStream, resumedStream)
  |
  |-- start piping shellStream ------------> Client (first bytes)
  |
  |-- invoke handler(req, res, { requestMeta: { postponed } })
  |   -------------------------------------> Entrypoint (handler)
  |   <------------------------------------- resumed chunks/cache entry
  |
  |-- append resumed chunks to resumedStream
  |
  '-- client receives one HTTP response:
      [shell bytes........][resumed bytes........]
```

## 3. Cache ကို `requestMeta.onCacheEntryV2` နဲ့ update လုပ်ခြင်း

`requestMeta.onCacheEntryV2` ကို — response cache entry တစ်ခုကို ရှာဖွေတွေ့ရှိချိန် (သို့) အသစ်ထုတ်လုပ်ချိန်မှာ — ခေါ်ယူပါတယ်။ အသစ်ပြောင်းလဲထားတဲ့ (updated) shell/postponed data တွေကို ဆက်လက် သိမ်းဆည်းဖို့ (persist) ဒါကို အသုံးပြုပါ။

> [!NOTE]
>
> - `requestMeta.onCacheEntry` ကတော့ အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — deprecated ဖြစ်ပါတယ်။
> - `requestMeta.onCacheEntryV2` ကို ဦးစားပေး အသုံးပြုပါ။
> - သင့် adapter က internal `onCacheCallback` abstraction တစ်ခုကို သုံးထားရင် — အဲဒါကို `requestMeta.onCacheEntryV2` နဲ့ ချိတ်ဆက်ပါ။

```ts filename="my-adapter.ts"
await handler(req, res, {
  waitUntil,
  requestMeta: {
    postponed: cachedPprEntry?.postponedState,
    onCacheEntryV2: async (cacheEntry, meta) => {
      if (cacheEntry.value?.kind === 'APP_PAGE') {
        const html =
          cacheEntry.value.html &&
          typeof cacheEntry.value.html.toUnchunkedString === 'function'
            ? cacheEntry.value.html.toUnchunkedString()
            : null

        await platformCache.set(meta.url || req.url || '/', {
          shell: html,
          postponedState: cacheEntry.value.postponed,
          headers: cacheEntry.value.headers,
          status: cacheEntry.value.status,
          cacheControl: cacheEntry.cacheControl,
        })
      }

      // Return true only if your adapter already wrote the response itself.
      return false
    },
  },
})
```

```text
Entrypoint (handler)
  | onCacheEntryV2(cacheEntry, { url })
  v
requestMeta.onCacheEntryV2 callback
  |
  |-- if APP_PAGE ---> persist html + postponedState + headers ---> Platform Cache
  |
  '-- return false: continue normal Next.js response flow
      return true:  adapter already handled response (short-circuit)
```
