---
title: "broadcastQueryClient (Tab/Window များကြား cache ချိန်ကိုက်ရန် utility)"
description: "broadcastQueryClient — browser tab/window တွေကြားမှာ queryClient state ကို broadcast လုပ်ပြီး sync လုပ်ပေးတဲ့ experimental utility — installation, usage, options, broadcast errors ကိုင်တွယ်နည်း"
order: 59
source: "https://tanstack.com/query/latest/docs/framework/react/plugins/broadcastQueryClient"
status: translated
updated: 2026-09-02
---

> **အလွန် အရေးကြီးသည်** — ဒီ utility က လောလောဆယ် experimental အဆင့်မှာ ရှိပါတယ်။ ဆိုလိုတာက — breaking changes တွေက minor ရော patch releases တွေမှာပါ ဖြစ်လာနိုင်ပါတယ်။ ကိုယ့်ဘာသာ တာဝန်ယူပြီး သုံးပါ။ Experimental အဆင့်မှာ production မှာ ဒါကို အားကိုးသုံးမယ်ဆိုရင် — မမျှော်လင့်တဲ့ breakages တွေ ရှောင်ဖို့ version ကို patch-level version အတိအကျ lock လုပ်ထားပါ။

`broadcastQueryClient` က utility တစ်ခုဖြစ်ပြီး — same origin ပေါ်က browser tabs/windows တွေကြားမှာ သင့် queryClient ရဲ့ state ကို broadcast လုပ်ပြီး sync လုပ်ပေးဖို့ သုံးပါတယ်။

## တပ်ဆင်ခြင်း (Installation)

ဒီ utility က သီးခြား package တစ်ခုအနေနဲ့ ပါဝင်ပြီး — `'@tanstack/query-broadcast-client-experimental'` import အောက်မှာ ရနိုင်ပါတယ်။

## အသုံးပြုခြင်း (Usage)

`broadcastQueryClient` function ကို import လုပ်ပြီး — သင့် `QueryClient` instance ကို ပို့ပါ; ပြီးတော့ optionally `broadcastChannel` တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

```tsx
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

const queryClient = new QueryClient()

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'my-app',
})
```

## API

### `broadcastQueryClient`

ဒီ function ဆီ `QueryClient` instance တစ်ခုနဲ့ — optionally `broadcastChannel` တစ်ခုကို ပို့ပါ။

```tsx
broadcastQueryClient({ queryClient, broadcastChannel })
```

### Options

Options တွေရဲ့ object တစ်ခု ဖြစ်ပါတယ်:

```tsx
interface BroadcastQueryClientOptions {
  /** The QueryClient to sync */
  queryClient: QueryClient
  /** This is the unique channel name that will be used
   * to communicate between tabs and windows */
  broadcastChannel?: string
  /** Options for the BroadcastChannel API */
  options?: BroadcastChannelOptions
  /**
   * Called when a query event fails to broadcast to other tabs — most
   * commonly because the query's data, error, or key contains a value the
   * structured-clone algorithm cannot serialize (e.g. `ReadableStream`,
   * `File`, functions, Vue `reactive` proxies).
   *
   * If omitted, a `console.warn` is emitted in development so failures
   * are never entirely silent. May return a `Promise`; any rejection is
   * caught internally.
   */
  onBroadcastError?: (
    error: unknown,
    event: BroadcastErrorEvent,
  ) => void | Promise<void>
}

interface BroadcastErrorEvent {
  type: 'updated' | 'removed' | 'added'
  queryHash: string
  queryKey: QueryKey
}
```

Default options တွေကတော့:

```tsx
{
  broadcastChannel = 'tanstack-query',
}
```

## Broadcast errors ကိုင်တွယ်ခြင်း (Handling Broadcast Errors)

သင့် cache ထဲမှာ structured-clone လုပ်လို့မရတဲ့ values တွေ ရှိနေနိုင်ပါတယ် — ဥပမာ `ReadableStream` (`Response.body`, streaming APIs, AI SDKs တွေကနေ လာတဲ့), `File`, functions, ဒါမှမဟုတ် Vue `reactive` လို framework proxies တွေ — အဲဒီလိုဆိုရင် အဲဒီ query အတွက် နောက်ခံ `BroadcastChannel.postMessage` call က reject ဖြစ်ပါလိမ့်မယ်။ အဲဒီ query အတွက် cross-tab sync ကို ကျော်လိုက်ပြီး — cache ရဲ့ ကျန်တဲ့အပိုင်းတွေက ပုံမှန်အတိုင်း broadcast ဆက်လုပ်ပါတယ်။

Default အနေနဲ့ — development မှာ `console.warn` တစ်ခု ထုတ်ပေးပြီး failures တွေ ဘယ်တော့မှ တိတ်တဆိတ် မဖြစ်နေအောင် လုပ်ပါတယ်။ Failures တွေကို ကိုယ်ပိုင် error tracker ဆီ လွှဲပို့ချင်ရင် `onBroadcastError` ကို ပေးပါ:

```tsx
import * as Sentry from '@sentry/browser'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'my-app',
  onBroadcastError: (error, event) => {
    Sentry.captureException(error, {
      tags: { broadcastEvent: event.type },
      extra: { queryHash: event.queryHash, queryKey: event.queryKey },
    })
  },
})
```
