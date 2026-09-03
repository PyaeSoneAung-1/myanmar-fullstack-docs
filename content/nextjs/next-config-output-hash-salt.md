---
title: "outputHashSalt (output filename hash salt)"
description: "outputHashSalt option — content-addressed output filenames (chunks, assets) အားလုံးတွင် configurable salt string ထည့်သွင်းရန် သတ်မှတ်ချက်; `NEXT_HASH_SALT` env var နှင့် ပေါင်းစပ်အလုပ်လုပ်"
order: 161
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/outputHashSalt"
status: translated
updated: 2026-09-03
---

`outputHashSalt` က content-addressed ဖြစ်တဲ့ output filename တိုင်း (chunks, assets) ထဲမှာ configure လုပ်နိုင်တဲ့ salt string တစ်ခုကို ထည့်သွင်းပေးတဲ့ option တစ်ခုပါ။ ဒီတန်ဖိုးကို ပြောင်းလိုက်တာနဲ့ — output hashes တွေ အားလုံး ပြောင်းလဲသွားစေပြီး source files တွေကို ပြုပြင်စရာ မလိုဘဲ deployments အကြား cached assets တွေကို invalidate (အသုံးမပြုတော့အောင် ပြုလုပ်ခြင်း) လုပ်ဖို့ အသုံးဝင်ပါတယ်။

Output hash salt ကို configure လုပ်ဖို့ — `next.config.js` ထဲမှာ `outputHashSalt` ကို သတ်မှတ်ပါ:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputHashSalt: 'my-deployment-salt',
}

module.exports = nextConfig
```

ဒါက Webpack နဲ့ Turbopack bundlers နှစ်ခုလုံးမှာ အလုပ်လုပ်ပါတယ်။

`NEXT_HASH_SALT` environment variable ကိုလည်း အလားတူ ရည်ရွယ်ချက်အတွက် သုံးနိုင်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားတဲ့အခါ — ထိရောက်တဲ့ salt ဖြစ်လာဖို့ တန်ဖိုးတွေကို **ပေါင်းစည်း (concatenate)** လုပ်ပါတယ် (`outputHashSalt + NEXT_HASH_SALT`)။ ဒါက config ထဲမှာ မြှုပ်ထားတဲ့ per-project salt ကို — build time မှာ environment variable ကနေ ထည့်သွင်းတဲ့ per-deployment salt နဲ့ ပေါင်းစပ်နိုင်စေပါတယ်။

```bash filename="Terminal"
NEXT_HASH_SALT=my-deployment-salt next build
```

## Version History

| Version  | အပြောင်းအလဲ                     |
| -------- | --------------------------- |
| `16.3.0` | `outputHashSalt` စတင် မိတ်ဆက်။ |
