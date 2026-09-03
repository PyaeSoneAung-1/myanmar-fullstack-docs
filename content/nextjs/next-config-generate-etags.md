---
title: "generateEtags (etag ထုတ်လုပ်ခြင်း ပိတ်ရန်)"
description: "generateEtags option — page တိုင်းအတွက် etag များ ထုတ်ပေးခြင်းကို cache strategy အလိုက် ပိတ်ရန် သတ်မှတ်ချက်"
order: 155
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/generateEtags"
status: translated
updated: 2026-09-03
---

Default အားဖြင့် Next.js က page တိုင်းအတွက် [etags](https://en.wikipedia.org/wiki/HTTP_ETag) တွေကို ထုတ်ပေးပါတယ်။ သင့် cache strategy (ကက်ရှ် နည်းဗျူဟာ) ပေါ်မူတည်ပြီး — HTML pages တွေအတွက် etag ထုတ်လုပ်ခြင်းကို ပိတ်ချင်နိုင်ပါတယ်။

`next.config.js` ကို ဖွင့်ပြီး `generateEtags` option ကို ပိတ်လိုက်ပါ:

```js filename="next.config.js"
module.exports = {
  generateEtags: false,
}
```
