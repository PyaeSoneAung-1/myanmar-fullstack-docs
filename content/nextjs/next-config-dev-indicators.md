---
title: "devIndicators (development indicator)"
description: "devIndicators option — development အတွင်း ကြည့်ရှုနေသော route အကြောင်း အချက်အလက် ပေးသည့် on-screen indicator ၏ နေရာချထားမှုနှင့် ပြသ/ဖျောက်ရန် သတ်မှတ်ချက်များ"
order: 96
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators"
status: translated
updated: 2026-09-02
---

`devIndicators` က development အတွင်းမှာ သင်ကြည့်ရှုနေတဲ့ လက်ရှိ route အကြောင်း အချက်အလက် ပေးတဲ့ on-screen indicator ကို configure လုပ်နိုင်စေပါတယ်။

`next.config.ts` ကို ဖွင့်ပြီး — indicator ဘယ်မှာ render လုပ်မလဲ ရွေးချယ်ဖို့ `position` ကို သတ်မှတ်ပါ။ Default က `bottom-left` ပါ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right', // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  },
}

export default nextConfig
```

Indicator တစ်ခုလုံးကို ဖျောက်ထားချင်ရင် — `devIndicators` ကို `false` လို့ သတ်မှတ်ပါ။ ဒီလိုလုပ်ရင်တောင် Next.js က compile (သို့) runtime errors တွေ ကြုံရတဲ့အခါ အဲဒါတွေကို ဆက်ပြီး ဖော်ပြပေးပါဦးမယ်။

```ts filename="next.config.ts"
const nextConfig: NextConfig = {
  devIndicators: false,
}

export default nextConfig
```

## Troubleshooting

### Route တစ်ခုကို static အဖြစ် အမှတ်အသား မပြုလုပ်ခြင်း

Route တစ်ခုက static ဖြစ်မယ်လို့ မျှော်လင့်ထားပေမယ့် — indicator က အဲဒါကို dynamic အဖြစ် အမှတ်အသား လုပ်ထားရင်၊ ဖြစ်နိုင်ခြေ အများဆုံးက ဒီ route က prerendering ကနေ ထွက်သွားတာ (opted out) ဖြစ်နိုင်ပါတယ်။

Route တစ်ခုက [prerendered](https://nextjs.org/docs/app/glossary#prerendering) (သို့) [dynamically rendered](https://nextjs.org/docs/app/glossary#dynamic-rendering) ဖြစ်မဖြစ်ကို — `next build --debug` နဲ့ သင့် application ကို build လုပ်ပြီး terminal ထဲက output ကို စစ်ဆေးခြင်းဖြင့် အတည်ပြုနိုင်ပါတယ်။ Static (သို့) prerendered routes တွေက `○` symbol နဲ့ ပြသပြီး — dynamic routes တွေက `ƒ` symbol နဲ့ ပြသပါတယ်။ ဥပမာ:

```bash filename="Build Output"
Route (app)
┌ ○ /_not-found
└ ƒ /products/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Route တစ်ခုက prerendering ကနေ ထွက်သွားရတဲ့ အကြောင်းရင်း နှစ်ခု ရှိပါတယ်:

- Request အချက်အလက်ပေါ် မှီခိုတဲ့ [Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis) တွေ ပါဝင်နေတာ။
- ORM (သို့) database driver တစ်ခုဆီ call လုပ်တာလိုမျိုး [uncached data request](https://nextjs.org/docs/app/getting-started/fetching-data) တစ်ခု ရှိနေတာ။

သင့် route ထဲမှာ ဒီအခြေအနေတွေ ရှိမရှိ စစ်ဆေးပြီး — route ကို statically render လုပ်လို့ မရဘူးဆိုရင် [streaming](https://nextjs.org/docs/app/getting-started/linking-and-navigating#streaming) ကို အသုံးချဖို့ [`loading.js`](/docs/nextjs/file-conventions-loading) (သို့) [`<Suspense />`](https://react.dev/reference/react/Suspense) ကို သုံးစဉ်းစားပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0` | `appIsrStatus`, `buildActivity`, နဲ့ `buildActivityPosition` options တွေကို ဖယ်ရှား။                                                             |
| `v15.2.0` | `position` option အသစ်ပါတဲ့ improved on-screen indicator။ `appIsrStatus`, `buildActivity`, နဲ့ `buildActivityPosition` options တွေ deprecated ဖြစ်။ |
| `v15.0.0` | `appIsrStatus` option နဲ့အတူ static on-screen indicator ထည့်သွင်း။                                                                                        |
