---
title: "serverActions (Server Actions သတ်မှတ်ချက်များ)"
description: "serverActions option — Server Actions ၏ အပြုအမူ (allowedOrigins, bodySizeLimit, v13 အတွက် enable) ကို configure လုပ်ရန် သတ်မှတ်ချက်များ"
order: 100
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions"
status: translated
updated: 2026-09-02
---

သင့် Next.js application ထဲမှာ Server Actions အပြုအမူကို configure လုပ်ဖို့ options တွေပါ။ Server Actions တွေ ဘယ်လို အလုပ်လုပ်လဲ၊ ဒီ options တွေက ညှိပေးတဲ့ security boundary အပါအဝင် — [Server Actions guide](https://nextjs.org/docs/app/guides/server-actions) မှာ ကြည့်ပါ။

## `allowedOrigins`

Server Actions တွေကို ခေါ်ယူနိုင်တဲ့ အပိုဆောင်း လုံခြုံတဲ့ origin domains စာရင်းတစ်ခုပါ။ Next.js က Server Action request တစ်ခုရဲ့ origin ကို host domain နဲ့ နှိုင်းယှဉ်ပြီး — CSRF attacks တွေ မဖြစ်အောင် ၎င်းတို့ ကိုက်ညီမှု ရှိစေပါတယ်။ မသတ်မှတ်ထားဘူးဆိုရင် — same origin တစ်ခုတည်းကိုပဲ ခွင့်ပြုပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

## `bodySizeLimit`

Default အားဖြင့် — Server Action တစ်ခုဆီ ပို့လိုက်တဲ့ request body ရဲ့ အများဆုံး အရွယ်အစားက 1MB ပါ။ ဒါက data အများအပြားကို parse လုပ်ရာမှာ server resources တွေ အလွန်အကျွံ သုံးစွဲမှုတွေ၊ ဖြစ်နိုင်ချေရှိတဲ့ DDoS attacks တွေကို ကာကွယ်ဖို့ပါ။

ဒါပေမယ့် — ဒီ limit ကို `serverActions.bodySizeLimit` option နဲ့ configure လုပ်နိုင်ပါတယ်။ ၎င်းက bytes အရေအတွက် (သို့) bytes က ထောက်ပံ့တဲ့ ဘယ် string format မဆို လက်ခံပါတယ် — ဥပမာ `1000`, `'500kb'` (သို့) `'3mb'`။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

ဒီ limit က raw HTTP request body ပေါ်မှာ သက်ရောက်ပြီး — `multipart/form-data` က boundaries, part headers, နဲ့ field metadata တွေအတွက် ထည့်တဲ့ bytes တွေ အပါအဝင်ပါ။ သတ်မှတ်ထားတဲ့ တန်ဖိုးနီးပါး အရွယ်အစားရှိတဲ့ uploads တွေ မျှော်လင့်ထားရင် — ဒီ overhead အတွက် နေရာ ချန်ထားပါ။ သာမန် multipart uploads တွေအတွက် — အပိုဆောင်း 10–20 KB က သင့်တင့်တဲ့ ခန့်မှန်းချက် (rule of thumb) တစ်ခုပါ။

## Server Actions ဖွင့်ခြင်း (v13)

Server Actions က Next.js 14 မှာ stable feature တစ်ခု ဖြစ်လာပြီး — default အားဖြင့် ဖွင့်ထားပါတယ်။ ဒါပေမယ့် သင်က Next.js ရဲ့ အစောပိုင်း version တစ်ခုကို သုံးနေရင် — `experimental.serverActions` ကို `true` လို့ သတ်မှတ်ပြီး ဖွင့်နိုင်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
}

module.exports = config
```
