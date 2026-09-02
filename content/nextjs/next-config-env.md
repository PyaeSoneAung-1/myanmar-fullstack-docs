---
title: "env (environment variables)"
description: "env option — build time တွင် JavaScript bundle ထဲသို့ environment variables များ ထည့်သွင်းရန် သတ်မှတ်ချက်; process.env ဖြင့် ဝင်ရောက်အသုံးပြုခြင်း"
order: 88
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/env"
status: translated
updated: 2026-09-02
---

> [Next.js 9.4](https://nextjs.org/blog/next-9-4) ထွက်ပြီးကတည်းက — [environment variables ထည့်သွင်းခြင်း](/docs/nextjs/environment-variables) အတွက် ပိုပြီး intuitive ဖြစ်တဲ့ အတွေ့အကြုံတစ်ခု ရှိပါတယ်။ စမ်းကြည့်ပါ!

> **သိထားသင့်သည်:** ဒီနည်းနဲ့ သတ်မှတ်ထားတဲ့ environment variables တွေက JavaScript bundle ထဲမှာ **အမြဲတမ်း** ပါဝင်ပါတယ် — `NEXT_PUBLIC_` prefix က [environment (သို့) .env files တွေကနေ သတ်မှတ်တဲ့အခါမှာပဲ](/docs/nextjs/environment-variables) အကျိုးသက်ရောက်မှု ရှိပါတယ်။

JavaScript bundle ထဲကို environment variables တွေ ထည့်သွင်းဖို့ — `next.config.js` ကို ဖွင့်ပြီး `env` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

အခုဆိုရင် သင့် code ထဲမှာ `process.env.customKey` ကို ဝင်ရောက် အသုံးပြုနိုင်ပါပြီ။ ဥပမာ:

```jsx
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.js က build time မှာ `process.env.customKey` ကို `'my-value'` နဲ့ အစားထိုးပါလိမ့်မယ်။ `process.env` variables တွေကို destructure လုပ်ဖို့ ကြိုးစားတာကတော့ webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) ရဲ့ သဘောသဘာဝကြောင့် အလုပ်မလုပ်ပါဘူး။

ဥပမာ — အောက်ပါ line က:

```jsx
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

ဒီလို ဖြစ်သွားပါလိမ့်မယ်:

```jsx
return <h1>The value of customKey is: {'my-value'}</h1>
```
