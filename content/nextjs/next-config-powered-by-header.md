---
title: "poweredByHeader (x-powered-by header ပိတ်ခြင်း)"
description: "poweredByHeader option — Next.js က responses များတွင် `x-powered-by` header ကို default ထည့်ပေးခြင်းမှ opt-out လုပ်ရန် သတ်မှတ်ချက်"
order: 82
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader"
status: translated
updated: 2026-09-02
---

Default အားဖြင့် Next.js က responses တွေမှာ `x-powered-by` header ကို ထည့်ပေးပါတယ်။ ဒါကို မလိုချင်ရင် — `next.config.js` ကို ဖွင့်ပြီး `poweredByHeader` config ကို ပိတ်လိုက်ပါ:

```js filename="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```
