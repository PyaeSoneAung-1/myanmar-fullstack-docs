---
title: "trailingSlash (slash ပါ/မပါ သတ်မှတ်ချက်)"
description: "trailingSlash option — URLs များကို trailing slash ပါဝင်သော (သို့) မပါသော ပုံစံသို့ redirect လုပ်ရန် သတ်မှတ်ချက်; static file URLs နှင့် .well-known paths များက ခြွင်းချက်"
order: 93
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash"
status: translated
updated: 2026-09-02
---

Default အားဖြင့် Next.js က trailing slash ပါတဲ့ URLs တွေကို trailing slash မပါတဲ့ ပုံစံဆီ redirect လုပ်ပါတယ်။ ဥပမာ — `/about/` က `/about` ဆီ redirect လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို ဆန့်ကျင်ဘက် အနေနဲ့လည်း configure လုပ်နိုင်ပါတယ် — trailing slash မပါတဲ့ URLs တွေကို trailing slash ပါတဲ့ ပုံစံဆီ redirect လုပ်တာမျိုးပါ။

`next.config.js` ကို ဖွင့်ပြီး `trailingSlash` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

ဒီ option ကို သတ်မှတ်ထားရင် — `/about` လိုမျိုး URLs တွေက `/about/` ဆီ redirect လုပ်ပါလိမ့်မယ်။

`trailingSlash: true` သုံးနေတဲ့အခါ — အောက်ပါ URLs တချို့က ခြွင်းချက်ဖြစ်ပြီး trailing slash ထည့်ပေးမှာ မဟုတ်ပါဘူး:

- Static file URLs တွေ — extension ပါတဲ့ files တွေလိုမျိုးပါ။
- `.well-known/` အောက်က paths အားလုံး။

ဥပမာ — အောက်ပါ URLs တွေက မပြောင်းလဲဘဲ ကျန်ရှိနေပါလိမ့်မယ်: `/file.txt`, `images/photos/picture.png`, နဲ့ `.well-known/subfolder/config.json`။

[`output: "export"`](/docs/nextjs/static-exports) configuration နဲ့ တွဲသုံးတဲ့အခါ — `/about` page က default `/about.html` အစား `/about/index.html` ကို output လုပ်ပေးပါလိမ့်မယ်။

## Version History

| Version  | အပြောင်းအလဲ                |
| -------- | ---------------------- |
| `v9.5.0` | `trailingSlash` စတင် မိတ်ဆက်။ |
