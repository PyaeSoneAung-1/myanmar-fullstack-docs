---
title: "distDir (custom build directory)"
description: "distDir option — default `.next` အစား သုံးမည့် custom build directory အမည် သတ်မှတ်ချက်"
order: 85
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/distDir"
status: translated
updated: 2026-09-02
---

`.next` အစား သုံးမယ့် custom build directory အတွက် အမည်တစ်ခု သတ်မှတ်နိုင်ပါတယ်။

`next.config.js` ကို ဖွင့်ပြီး `distDir` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  distDir: 'build',
}
```

အခုဆိုရင် `next build` run လုပ်တဲ့အခါ — default `.next` folder အစား `build` ကို သုံးပါလိမ့်မယ်။

> `distDir` က သင့် project directory ထဲကနေ **အပြင်ကို ထွက်သွားလို့ မရပါဘူး**။ ဥပမာ — `../build` ဆိုတာ **invalid** directory တစ်ခုပါ။
