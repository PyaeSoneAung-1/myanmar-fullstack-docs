---
title: "forbidden.js (ဝင်ရောက်ခွင့် မရှိသော 403 UI)"
description: "forbidden.js file convention — authentication ကာလအတွင်း forbidden() function ခေါ်လိုက်တဲ့အခါ 403 UI ပြသပေးတဲ့ experimental special file"
order: 33
source: "https://nextjs.org/docs/app/api-reference/file-conventions/forbidden"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်:** ဒီ feature က လက်ရှိ experimental ဖြစ်ပြီး — ပြောင်းလဲနိုင်တာမို့ production အတွက် အကြံပြုမထားပါဘူး။ စမ်းသုံးကြည့်ပြီး [GitHub](https://github.com/vercel/next.js/issues) မှာ သင့် feedback ကို မျှဝေပေးပါ။

**forbidden** file က authentication (အထောက်အထား စစ်ဆေးခြင်း) ကာလအတွင်းမှာ [`forbidden`](https://nextjs.org/docs/app/api-reference/functions/forbidden) function ကို ခေါ်လိုက်တဲ့အခါ UI render လုပ်ဖို့ သုံးပါတယ်။ UI ကို စိတ်ကြိုက် ပြင်ဆင်ခွင့်ပြုပေးတာအပြင် — Next.js က `403` status code ကိုလည်း ပြန်ပို့ပေးပါတယ်။

```tsx
// app/forbidden.tsx
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

## Reference

### Props

`forbidden.js` components တွေက props ဘာမှ လက်ခံပါဘူး။

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v15.1.0` | `forbidden.js` စတင် မိတ်ဆက် |

## ဆက်စပ်ကြည့်ရှုရန်

- [forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden) — `forbidden` function အတွက် API Reference
