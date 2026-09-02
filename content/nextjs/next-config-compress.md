---
title: "compress (gzip compression ချုံ့မှု)"
description: "compress option — `next start` (သို့) custom server သုံးစဉ် rendered content နှင့် static files များကို gzip ဖြင့် ချုံ့ပေးခြင်းနှင့် ပိတ်ရန် သတ်မှတ်ချက်"
order: 83
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/compress"
status: translated
updated: 2026-09-02
---

Default အားဖြင့် Next.js က `next start` (သို့) custom server တစ်ခုကို သုံးတဲ့အခါ — rendered content တွေနဲ့ static files တွေကို `gzip` နဲ့ ချုံ့ (compress) ပေးပါတယ်။ ဒါက compression သတ်မှတ်မထားတဲ့ application တွေအတွက် optimization တစ်ခုပါ။ သင့် application မှာ custom server တစ်ခုကနေ compression ကို _ပြီးသား_ သတ်မှတ်ထားရင်တော့ — Next.js က ထပ်ပြီး compression ထည့်ပေးမှာ မဟုတ်ပါဘူး။

Compression ဖွင့်ထားလား၊ ဘယ် algorithm ကို သုံးနေလဲ ဆိုတာကို response ထဲက [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) (browser က လက်ခံနိုင်တဲ့ options) နဲ့ [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) (လက်ရှိ သုံးနေတဲ့) headers တွေကို ကြည့်ပြီး စစ်ဆေးနိုင်ပါတယ်။

## Compression ကို ပိတ်ခြင်း

**Compression** ကို ပိတ်ဖို့ — `compress` config option ကို `false` လို့ သတ်မှတ်ပါ:

```js filename="next.config.js"
module.exports = {
  compress: false,
}
```

သင့် server မှာ compression သတ်မှတ်ထားတာ မရှိဘူးဆိုရင် — compression ကို ပိတ်ဖို့ **အကြံ မပြုပါဘူး**၊ ဘာလို့လဲဆိုတော့ compression က bandwidth အသုံးပြုမှုကို လျှော့ချပေးပြီး သင့် application ရဲ့ performance ကို တိုးတက်စေလို့ပါ။ ဥပမာ — သင့်က [nginx](https://nginx.org/) ကို သုံးပြီး `brotli` ဆီ ပြောင်းချင်တယ်ဆိုရင် `compress` option ကို `false` လို့ သတ်မှတ်ပြီး compression ကို nginx က ကိုင်တွယ်အောင် လုပ်နိုင်ပါတယ်။
