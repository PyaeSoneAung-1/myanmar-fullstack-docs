---
title: "crossOrigin (script tags များအတွက် crossOrigin attribute)"
description: "crossOrigin option — `next/script` မှ ထုတ်ပေးသော `<script>` tags အားလုံးတွင် crossOrigin attribute ထည့်သွင်းရန် သတ်မှတ်ချက်; Options: 'anonymous', 'use-credentials'"
order: 154
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/crossOrigin"
status: translated
updated: 2026-09-03
---

`crossOrigin` option ကို သုံးပြီး — [`next/script`](https://nextjs.org/docs/app/guides/scripts) component က ထုတ်ပေးတဲ့ `<script>` tags တွေ အားလုံးထဲမှာ [`crossOrigin` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) ကို ထည့်သွင်း ပေးနိုင်ပြီး cross-origin requests တွေကို ဘယ်လို ကိုင်တွယ်ရမယ် ဆိုတာကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  crossOrigin: 'anonymous',
}
```

## Options

- `'anonymous'`: [`crossOrigin="anonymous"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#anonymous) attribute ကို ထည့်ပေးပါတယ်။
- `'use-credentials'`: [`crossOrigin="use-credentials"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#use-credentials) attribute ကို ထည့်ပေးပါတယ်။
