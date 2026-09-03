---
title: "typescript (TypeScript errors ကိုင်တွယ်မှု သတ်မှတ်ချက်)"
description: "typescript option — production builds အတွင်း TypeScript errors များကို ကိုင်တွယ်ပုံ (ignoreBuildErrors) နှင့် ကိုယ်ပိုင် tsconfig file သုံးရန် (tsconfigPath) သတ်မှတ်ချက်များ"
order: 167
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/typescript"
status: translated
updated: 2026-09-03
---

`next.config.js` ထဲမှာ `typescript` option နဲ့ TypeScript ရဲ့ အပြုအမူကို configure လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },
}
```

## Options

| Option              | Type      | Default           | ဖော်ပြချက်                                               |
| ------------------- | --------- | ----------------- | ----------------------------------------------------- |
| `ignoreBuildErrors` | `boolean` | `false`           | TypeScript errors တွေ ရှိနေရင်တောင် production builds တွေကို ပြီးမြောက်အောင် ခွင့်ပြုပါတယ်။ |
| `tsconfigPath`      | `string`  | `'tsconfig.json'` | ကိုယ်ပိုင် `tsconfig.json` file တစ်ခုဆီကို လမ်းကြောင်း (path)။              |

## `ignoreBuildErrors`

သင့် project ထဲမှာ TypeScript errors တွေ ရှိနေရင် Next.js က သင့် **production build** (`next build`) ကို ကျရှုံးစေပါတယ် (fail လုပ်ပါတယ်)။

သင့် application မှာ errors တွေ ရှိနေရင်တောင် Next.js ကို production code တွေ အန္တရာယ်ရှိရှိ ထုတ်လုပ်စေချင်ရင် — built-in type checking အဆင့်ကို ပိတ်ထားနိုင်ပါတယ်။

သတိပြုရမှာက — ဒါက TypeScript type checking အဆင့်ကို လုံးဝ ကျော်လိုက်တာပါ။ TypeScript ကို run ပြီး errors တွေကို ဖိနှိပ်တာ မဟုတ်ဘဲ — စစ်ဆေးမှု (check) တစ်ခုလုံးကို ရှောင်ကွင်းလိုက်တာပဲ ဖြစ်ပါတယ်။

ဒါကို ပိတ်ထားရင် — type checks တွေကို သင့် build (သို့) deploy process ရဲ့ အစိတ်အပိုင်းအနေနဲ့ run နေဖို့ သေချာပါစေ။ မဟုတ်ရင် ဒါက အလွန် အန္တရာယ်ကြီးနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  typescript: {
    // !! WARN !!
    // သင့် project မှာ type errors တွေ ရှိနေရင်တောင်
    // production builds တွေကို အန္တရာယ်ရှိရှိ အောင်မြင်စွာ ပြီးမြောက်ခွင့်ပြုသည်။
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
```

## `tsconfigPath`

Builds (သို့) tooling အတွက် မတူညီတဲ့ TypeScript configuration file တစ်ခုကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
}
```

အသေးစိတ် အချက်အလက်တွေ အတွက် [TypeScript configuration](https://nextjs.org/docs/app/api-reference/config/typescript#custom-tsconfig-path) page ကို ကြည့်ပါ။
