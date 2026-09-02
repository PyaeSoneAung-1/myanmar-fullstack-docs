---
title: "Intercepting Routes"
description: "Intercepting Routes — (.) (..) (..)(..) (...) conventions တွေနဲ့ URL မပြောင်းဘဲ လက်ရှိ layout ထဲမှာ တခြား route ကို render လုပ်ခြင်း, modal ဥပမာများ"
order: 25
source: "https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes"
status: translated
updated: 2026-09-02
---

**Intercepting routes** က application ရဲ့ အခြားအစိတ်အပိုင်းတစ်ခုက route ကို — လက်ရှိ layout ရဲ့ အတွင်းမှာ load လုပ်နိုင်စေပါတယ်။ User ကို context တစ်ခုကနေ တစ်ခုဆီ မပြောင်းစေဘဲ route တစ်ခုရဲ့ content ကို ပြသချင်တဲ့အခါ ဒီ routing paradigm က အသုံးဝင်ပါတယ်။

ဥပမာ — feed တစ်ခုထဲက photo တစ်ပုံကို နှိပ်လိုက်ရင် photo ကို modal တစ်ခုအနေနဲ့ feed ပေါ်မှာ overlay လုပ်ပြသနိုင်ပါတယ်။ ဒီကိစ္စမှာ Next.js က `/photo/123` route ကို intercept လုပ်ပြီး — URL ကို mask လုပ်ကာ `/feed` ပေါ်မှာ overlay လုပ်ပါတယ်။

ဒါပေမယ့် — shareable URL တစ်ခုကနေ photo ကို သွားကြည့်တဲ့အခါ (သို့) page ကို refresh လုပ်တဲ့အခါမှာတော့ modal အစား **photo page တစ်ခုလုံးကို render** လုပ်သင့်ပါတယ် — route interception ဘာမှ မဖြစ်သင့်ပါဘူး။

## Convention

Intercepting routes တွေကို `(..)` convention နဲ့ သတ်မှတ်ပါတယ် — ဒါက relative path convention `../` နဲ့ တူပေမယ့် route segments တွေအတွက်ပါ။ သုံးလို့ရတဲ့ပုံစံတွေက:

- `(.)` — **တူညီတဲ့ level** က segments တွေကို ကိုက်ညီဖို့
- `(..)` — **အပေါ်တစ်ဆင့်** က segments တွေကို ကိုက်ညီဖို့
- `(..)(..)` — **အပေါ် နှစ်ဆင့်** က segments တွေကို ကိုက်ညီဖို့
- `(...)` — **root** `app` directory ကနေ segments တွေကို ကိုက်ညီဖို့

ဥပမာ — `feed` segment အတွင်းမှာ `(..)photo` directory တစ်ခု ဖန်တီးပြီး `photo` segment ကို intercept လုပ်နိုင်ပါတယ် — အဲဒီအခါ `app/photo` ကနေ render လုပ်မယ့် content ကို `app/feed` ရဲ့ layout အတွင်းမှာ ပြသနိုင်ပါတယ်။

ဒီ conventions တွေကို folder တွေရဲ့ **နှိုင်းရ အနက်အဆင့်** (relative depth) ပေါ်မူတည်ပြီး ရွေးချယ်ပါတယ် — intercepting route folder ထားတဲ့ နေရာနဲ့ intercept လုပ်ချင်တဲ့ target route ကြားက segment အရေအတွက်ကို ရေတွက်ရတာပါ။ Dynamic segments (`[id]` လိုမျိုး) တွေကိုလည်း ဒီပုံစံအတိုင်း intercept လုပ်လို့ရပြီး — modal အတွင်းမှာ ပြတဲ့ content က target route ရဲ့ params တွေကို လက်ခံပါတယ်။

> **Good to know:** `(..)` convention က *route segments* တွေကို အခြေခံပြီး file-system ကို မကြည့်ပါဘူး — ဥပမာ [Parallel Routes](/docs/nextjs/parallel-routes) ထဲက `@slot` folders တွေကို ထည့်မတွက်ပါဘူး။

Intercepting က **soft navigation** အတွင်းမှာပဲ ဖြစ်ပွားပါတယ် — [`<Link>`](https://nextjs.org/docs/app/api-reference/components/link) (သို့) `useRouter` နဲ့ client-side ကနေ navigate လုပ်တဲ့အခါမျိုးမှာပါ။ Browser refresh (သို့) URL တစ်ခုကို တိုက်ရိုက် ရိုက်ထည့်တာလို **hard navigation** တွေမှာတော့ — intercepting route ကို ကျော်ပြီး target route ရဲ့ ပုံမှန် page ကိုပဲ render လုပ်ပါတယ်။ ဒါက deliberate ဖြစ်တဲ့ အပြုအမူပါ — modal ထဲက content ကို shareable URL ကနေ တိုက်ရိုက် ဝင်ရောက်နိုင်ပြီး browser back/forward buttons တွေနဲ့လည်း သဘာဝကျကျ အလုပ်လုပ်နိုင်စေလို့ပါ။

## ဥပမာများ — Modals

Intercepting Routes တွေကို [Parallel Routes](/docs/nextjs/parallel-routes) နဲ့ တွဲသုံးပြီး modals တွေ ဖန်တီးနိုင်ပါတယ် — ဒါက modals တွေ ဆောက်ရာမှာ ဖြစ်လေ့ရှိတဲ့ စိန်ခေါ်မှုတွေကို ဖြေရှင်းပေးပါတယ်:

- Modal content ကို **URL ကတစ်ဆင့် share လုပ်နိုင်ခြင်း**
- Page refresh လုပ်ရင် modal ပိတ်မသွားဘဲ **context ဆက်ထိန်းနိုင်ခြင်း**
- **Backward navigation မှာ modal ကိုပဲ ပိတ်ပြီး** ရှေ့က route ကို မသွားခြင်း
- **Forward navigation မှာ modal ကို ပြန်ဖွင့်နိုင်ခြင်း**

ဥပမာ UI pattern တစ်ခုက — user က client-side navigation နဲ့ gallery ကနေ photo modal ကို ဖွင့်နိုင်သလို — shareable URL ကနေ photo page ကို တိုက်ရိုက်လည်း ဝင်ရောက်နိုင်ပါတယ်။ ဒီလို pattern မျိုးမှာ `photo` segment ဆီက path က `(..)` matcher ကို သုံးနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ `@modal` က slot ဖြစ်ပြီး segment မဟုတ်လို့ပါ။ ဆိုလိုတာက `photo` route က file-system အရ အပေါ် နှစ်ဆင့်မှာ ရှိနေပေမယ့် — route segments အရ **တစ်ဆင့်ပဲ** အပေါ်မှာ ရှိတာပါ။

လက်တွေ့ ဥပမာအဖြစ် — `/login` route သပ်သပ် ရှိနေတုန်း layout ကနေ login modal ဖွင့်တာကို ကြည့်ရအောင်။ Modal content (`<Login>`) ကို slot ထဲက intercepted route — `@auth/(.)login/page.tsx` ထဲမှာ ထည့်ပါတယ်။ `(.)` က same-level interception ဖြစ်လို့ — user က client-side navigation နဲ့ `/login` ကို သွားတဲ့အခါ `/login` page ကို မသွားဘဲ ဒီ modal က ပွင့်လာပါတယ်:

```tsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

Refresh (သို့) URL တိုက်ရိုက် ရိုက်ထည့်လို့ `/login` ကို hard navigation လုပ်ရင်တော့ — ပုံမှန် `app/login/page.tsx` ကိုပဲ render လုပ်ပါတယ်။ ဒါကြောင့် modal content ကို URL ကနေ share လုပ်လို့ရပြီး — page refresh လုပ်ရင်လည်း modal အစား သင့်တင့်တဲ့ full page ကို ပြသနိုင်ပါတယ်။

Modal ကို ဖွင့်ဖို့ — slot ကို layout ရဲ့ prop အနေနဲ့ လက်ခံပြီး `<Link href="/login">` နဲ့ navigate လုပ်ပါ။ Soft navigation ဖြစ်လို့ Next.js ရဲ့ router က URL ကို မှန်ကန်အောင် update လုပ်ပြီး intercepting route ကနေ modal ကို ပြပါလိမ့်မယ်။ Modal ပိတ်ဖို့ကတော့ — `useRouter` ကနေ `router.back()` ခေါ်ပါ (သို့) modal မလိုတော့တဲ့ route ဆီ `Link` နဲ့ သွားပြီး slot ကို `null` return လုပ်တဲ့ component (သို့) [catch-all slot](/docs/nextjs/parallel-routes) နဲ့ ကိုက်ညီအောင် လုပ်ပါ:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  )
}
```

ဒီလိုနည်းနဲ့ ပေါင်းသုံးလိုက်ရင် — modal ဖွင့်ထားစဉ်မှာ browser ရဲ့ back button ကို နှိပ်ရင် modal ပဲ ပိတ်ပြီး ရှေ့က page ကို ပြန်မရောက်ပါဘူး (parallel slot ရဲ့ state ကို router history ထဲမှာ သီးခြား မှတ်သားထားလို့ပါ)။ Forward navigation လုပ်ရင်လည်း modal က ပြန်ပွင့်လာပါတယ် — ဒါတွေက ဒီ pattern ရဲ့ အဓိက အကျိုးကျေးဇူးတွေပါ။

> **Good to know:** တခြား ဥပမာတွေက — top navbar မှာ login modal ဖွင့်ထားချိန် `/login` page သပ်သပ် ရှိနေတာ၊ (သို့) side modal ထဲမှာ shopping cart ပြတာမျိုးပါ။

## နောက်တစ်ဆင့်တွေ

- [Parallel Routes](/docs/nextjs/parallel-routes) — Intercepted + Parallel Routes တွေနဲ့ modals ဖန်တီးပုံ အဆင့်ဆင့် (default.js, catch-all slots အပါအဝင်)
- [Linking & Navigation](/docs/nextjs/linking) — soft/hard navigation အကြောင်း
- [Image gallery example](https://github.com/vercel-labs/nextgram) — လက်တွေ့ modal ဥပမာ (nextgram)
