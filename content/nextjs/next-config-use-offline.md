---
title: "useOffline (offline connectivity detection ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "experimental.useOffline option — offline connectivity detection နှင့် မအောင်မြင်သော navigation, prefetch, Server Action requests များကို အလိုအလျောက် ပြန်ကြိုးစားခြင်း ဖွင့်ရန်; next/offline မှ useOffline() hook ကိုလည်း ရရှိစေ; experimental (v16.x)"
order: 212
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline"
status: translated
updated: 2026-09-03
---

`useOffline` configuration option က — offline connectivity detection (အင်တာနက် ပြတ်တောက်မှု သိရှိခြင်း) နဲ့ မအောင်မြင်ခဲ့တဲ့ navigation, prefetch နဲ့ Server Action requests တွေကို အလိုအလျောက် ပြန်ကြိုးစားခြင်း တို့ကို ဖွင့်ပေးပါတယ်။ ဖွင့်ထားတဲ့အခါ — Client Components တွေထဲက လက်ရှိ offline state ကို ဖတ်ဖို့ [`useOffline`](/docs/nextjs/use-offline) hook ကိုလည်း ရရှိနိုင်ပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useOffline: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  experimental: {
    useOffline: true,
  },
}
```

ဖွင့်ထားတဲ့အခါ Next.js က အောက်ပါအတိုင်း လုပ်ဆောင်ပါလိမ့်မယ်:

- Browser ရဲ့ [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) နဲ့ [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) events တွေကို နားထောင်ပြီး connectivity ကို ခြေရာခံမယ်။
- Navigation, prefetch နဲ့ Server Action requests တွေမှာ network failures တွေကို ရှာဖွေမယ်။
- Offline ဖြစ်နေစဉ် — backoff (အကြိမ်ကြား ကာလ တိုးပေးပြီး ထပ်စစ်ဆေးခြင်း) နဲ့တကွ [`HEAD`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/HEAD) requests တွေ ပို့ပြီး connectivity ကို စစ်ဆေးနေမယ်။
- Connectivity ပြန်ရတာနဲ့ blocked requests တွေကို အလိုအလျောက် ပြန်ကြိုးစားမယ်။
- `next/offline` ကနေ [`useOffline`](/docs/nextjs/use-offline) hook ကို ရရှိနိုင်အောင် လုပ်ပေးမယ်။

## Retry တွေ ဘယ်လို အလုပ်လုပ်လဲ (How retry works)

Offline state ကို လမ်းကြောင်း နှစ်ခုထဲက တစ်ခုကနေ ဝင်ရောက်ပါတယ်:

- **Browser event.** Next.js က `window.addEventListener('offline', ...)` listener တစ်ခုကို register လုပ်ပါတယ်။ OS က network interface ပြတ်တယ်လို့ သတင်းပို့တာနဲ့ — offline state က ချက်ချင်း ဖွင့်သွားပါတယ်။
- **Failed fetch.** Non-abort, non-timeout error တစ်ခုနဲ့ `fetch()` reject ဖြစ်သွားတဲ့ navigation, prefetch (သို့) Server Action request တိုင်းက offline module ထဲကို ဝင်ခေါ်ပါတယ်။ ဒါက browser က `navigator.onLine === true` လို့ ပြနေပေမယ့် — တကယ့် request က origin ဆီ မရောက်နိုင်တဲ့ ကိစ္စတွေ (captive portal, DNS ပျက်နေခြင်း, upstream server သေနေခြင်း) ကို ဖမ်းမိစေပါတယ်။

Offline state ထဲ ရောက်ပြီဆိုတာနဲ့ — polling loop တစ်ခုက connectivity ပြန်ရပြီလားဆိုတာ အတည်ပြုဖို့ ကြိုးစားနေပါတယ်။

### Connectivity စစ်ဆေးခြင်း (The connectivity check)

Check တစ်ခုစီက — navigation တွေမှာ သုံးတဲ့ endpoint အတိုင်းပဲ RSC header ပါအောင် လက်ရှိ page ရဲ့ URL ဆီ `HEAD` request တစ်ခုတည်း ပို့ပြီး — 200 ms ပြည့်ရင် request ကို abort လုပ်ပါတယ်။

အကျိုးရလဒ် နှစ်မျိုးကို "online" အဖြစ် သတ်မှတ်ပါတယ်:

1. Fetch က ပုံမှန် resolve ဖြစ်ခြင်း။
2. 200 ms timeout က request ကို abort လုပ်ခြင်း။ တကယ် offline ဖြစ်နေတဲ့ request က (DNS (သို့) TCP error နဲ့) ချက်ချင်းနီးပါး ကျရှုံးတတ်လို့ — 200 ms မှာ ဆက်စောင့်နေတုန်းဆိုရင် TCP handshake အောင်မြင်ပြီး server ဆီ ရောက်နိုင်နေပြီလို့ ဆိုလိုပါတယ်။

တခြား rejection တစ်ခုခုကတော့ နောက် check တစ်ခုကို စီစဉ်ပေးပါတယ်။ Offline ကာလအတွင်း framework fetch (navigation, prefetch, Server Action) တစ်ခု အောင်မြင်သွားရင်လည်း — state ကို online အဖြစ် ပြန်ပြောင်းပေးပါတယ်။

### Backoff (စစ်ဆေးချိန်ကြားကာလ)

Check တွေကြားက နှောင့်နှေးချိန်တွေက step လိုက် တိုးသွားပြီး — exponential မဟုတ်ဘဲ — အများဆုံး 3 စက္ကန့်မှာ ကန့်သတ်ထားပါတယ်:

| အကြိမ် (Attempt) | နောက် check မစစ်မီ စောင့်ဆိုင်းချိန် |
| --------------- | ----------------------- |
| 1               | 500 ms                  |
| 2               | 1 s                     |
| 3               | 2 s                     |
| 4 နဲ့ အထက်        | 3 s                     |

Browser ရဲ့ `online` event က လက်ရှိ စောင့်ဆိုင်းနေတာကို short-circuit လုပ်ပြီး — connectivity check တစ်ခုကို ချက်ချင်း လုပ်ဆောင်ပါတယ်။ ပြန်ချိတ်မိတာကို စီစဉ်ထားတဲ့ နောက် tick အထိ မစောင့်ဘဲ ချက်ချင်း သိရှိနိုင်ပါတယ်။

### လက်လျှော့လိုက်ခြင်း (Giving up)

Polling loop က သူ့ဘာသာ ဘယ်တော့မှ လက်မလျှော့ပါဘူး။ Check တစ်ခု အောင်မြင်တာ (သို့) page က unload ဖြစ်သွားတာအထိ — 3 စက္ကန့် အများဆုံး ကာလနဲ့ ဆက်လုပ်နေပါတယ်။ နာရီပေါင်းများစွာ offline ဖြစ်ပြီး နောက် ပြန်ချိတ်မိတဲ့ device တစ်ခုမှာဆို — polling loop က ဆက်လုပ်ပြီး ပုံမှန် resolve ဖြစ်သွားပါတယ်။

### Framework requests တွေကို ပြန်ကြိုးစားခြင်း (Retry of framework requests)

Offline state ဖြစ်နေစဉ် — navigation, prefetch (သို့) Server Action တစ်ခုခုက (အသစ် စတင်လိုက်တာပဲဖြစ်ဖြစ်၊ connection ပြတ်တုန်း in-flight ဖြစ်နေတာပဲဖြစ်ဖြစ်) နောက် connectivity check တစ်ခု အောင်မြင်တာကို စောင့်ပါတယ်။ Check အောင်မြင်တာနဲ့ — request က တစ်ကြိမ်ပဲ run ပါတယ်; အပို backoff မရှိပါဘူး။

Network error နဲ့ ကျရှုံးရင်တော့ — app က offline state ထဲ ပြန်ဝင်ပြီး polling loop က ပြန်စပါတယ်။

### ပြန်ချိတ်မိချိန်မှာ traffic (Traffic at reconnection)

Client တစ်ခုတည်းက သူ့ရဲ့ origin ဆီ traffic တွေ အလွန်အကျွံ စုပြုံ (runaway burst) မဖြစ်အောင် လုပ်ထားပါတယ်:

- Client offline ဖြစ်နေချိန် — failed `fetch()` က browser ရဲ့ network layer မှာတင် reject ဖြစ်သွားလို့ request က origin ဆီ ဘယ်တော့မှ မရောက်ပါဘူး။
- Polling loop က `HEAD` request တစ်ခုကိုပဲ တစ်ကြိမ်မှာ တစ်ခု ပို့ပြီး — delays တွေက 3 စက္ကန့်မှာ ကန့်သတ်ထားပါတယ်။ Offline ကာလအတွင်း တခြား framework requests တွေ origin ဆီ မပို့ပါဘူး။
- Connectivity ပြန်ရတဲ့အခါ — pending ဖြစ်နေတဲ့ navigation နဲ့ Server Action တစ်ခုစီက တစ်ကြိမ်စီ fire ပါတယ်။ နောက်ဆုံး navigation attempt ပဲ pending မှာ ထားခံရပြီး — ပုံမှန် form button တစ်ခုက သူ့ action pending ဖြစ်နေချိန် disabled ဖြစ်နေတတ်ပါတယ်။
- Prefetches တွေက [လက်ရှိ prefetch queue](/docs/nextjs/prefetching) ကနေ တစ်ပြိုင်နက် မဟုတ်ဘဲ အစီအစဉ်အတိုင်း run ပါတယ်။

လက်တွေ့မှာတော့ ဒီ feature က သင့် server ကို request တွေ ရေလွှမ်းမိုးဖို့ မဖြစ်နိုင်ပါဘူး။ Offline user တစ်ယောက်ချင်းစီအတွက် ထုတ်ပေးတဲ့ တစ်ခုတည်းသော အပို traffic က HEAD polling ပဲ ဖြစ်ပြီး — connectivity ပြန်ရတာနဲ့ ချက်ချင်း ရပ်သွားပါတယ်။ Prefetches, Server Actions နဲ့ navigations တွေက network ပြတ်တောက်မှု မရှိရင် fire ဖြစ်ကြမယ့် အကြိမ်ရေအတိုင်းပဲ — နောက်ကျမှ ဖြစ်သွားတာပါ။

## Version History

| Version   | Changes                                                  |
| --------- | -------------------------------------------------------- |
| `v16.x.0` | `experimental.useOffline` configuration option ကို စတင် မိတ်ဆက်ခဲ့သည်။ |
