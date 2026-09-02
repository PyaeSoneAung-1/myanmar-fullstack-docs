---
title: "output (Output File Tracing / standalone build)"
description: "output option — build လုပ်ချိန်တွင် page တစ်ခုစီနှင့် dependencies များကို trace လုပ်ပြီး deploy ရန် လိုအပ်သော files များကို ဆုံးဖြတ်ပေးသည့် Output File Tracing နှင့် `standalone` folder အကြောင်း"
order: 84
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/output"
status: translated
updated: 2026-09-02
---

Build လုပ်နေစဉ်အတွင်း — Next.js က page တစ်ခုစီနဲ့ ၎င်းရဲ့ dependencies တွေကို အလိုအလျောက် trace လုပ်ပြီး သင့် application ရဲ့ production version ကို deploy လုပ်ဖို့ လိုအပ်တဲ့ files အားလုံးကို ဆုံးဖြတ်ပေးပါတယ်။

ဒီ feature က deployment ရဲ့ အရွယ်အစားကို သိသိသာသာ လျှော့ချပေးနိုင်ပါတယ်။ အရင်က Docker နဲ့ deploy လုပ်တဲ့အခါ — `next start` run လုပ်ဖို့ သင့် package ရဲ့ `dependencies` အားလုံးကို install လုပ်ထားဖို့ လိုပါတယ်။ Next.js 12 ကစပြီး — `.next/` directory ထဲက Output File Tracing ကို အသုံးချပြီး လိုအပ်တဲ့ files တွေပဲ ထည့်သွင်းနိုင်ပါပြီ။

ဒါ့အပြင် ဒါက deprecated ဖြစ်သွားတဲ့ `serverless` target ရဲ့ လိုအပ်ချက်ကိုလည်း ဖယ်ရှားပေးပါတယ် — အဲဒီ target က ပြဿနာ အမျိုးမျိုး ဖြစ်စေနိုင်သလို မလိုအပ်တဲ့ duplication တွေကိုလည်း ဖန်တီးပေးပါတယ်။

## ဘယ်လို အလုပ်လုပ်လဲ

`next build` လုပ်နေစဉ် — Next.js က [`@vercel/nft`](https://github.com/vercel/nft) ကို သုံးပြီး `import`, `require`, နဲ့ `fs` အသုံးပြုမှုတွေကို statically analyze လုပ်ကာ page တစ်ခု load လုပ်နိုင်တဲ့ files အားလုံးကို ဆုံးဖြတ်ပါတယ်။

Next.js ရဲ့ production server ကိုလည်း ၎င်း လိုအပ်တဲ့ files တွေအတွက် trace လုပ်ပြီး — `.next/next-server.js.nft.json` မှာ output လုပ်ပေးပါတယ်။ ဒါကို production မှာ အသုံးချနိုင်ပါတယ်။

`.next` output directory ထဲကို emit လုပ်ထားတဲ့ `.nft.json` files တွေကို အသုံးပြုဖို့ — trace တစ်ခုချင်းစီထဲက files စာရင်း (`.nft.json` file နဲ့ ဆက်စပ်တဲ့ လမ်းကြောင်း) တွေကို ဖတ်ပြီး သင့် deployment location ဆီ copy လုပ်နိုင်ပါတယ်။

## Traced files များကို အလိုအလျောက် copy လုပ်ခြင်း

Next.js က `standalone` folder တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးနိုင်ပါတယ် — ဒီ folder ထဲမှာ `node_modules` ထဲက ရွေးချယ်ထားတဲ့ files တွေ အပါအဝင် production deployment အတွက် လိုအပ်တဲ့ files တွေကိုပဲ copy လုပ်ထားပေးပါတယ်။

ဒီ အလိုအလျောက် copy လုပ်ခြင်းကို သုံးချင်ရင် သင့် `next.config.js` ထဲမှာ အောက်ပါအတိုင်း ဖွင့်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  output: 'standalone',
}
```

ဒါက `.next/standalone` မှာ folder တစ်ခု ဖန်တီးပေးမှာ ဖြစ်ပြီး — `node_modules` install လုပ်စရာ မလိုဘဲ သူ့ဘာသာ deploy လုပ်လို့ ရပါတယ်။

ဒါ့အပြင် — `next start` အစား သုံးနိုင်တဲ့ minimal `server.js` file တစ်ခုကိုလည်း output လုပ်ပေးပါတယ်။ ဒီ minimal server က `public` (သို့) `.next/static` folders တွေကို default အားဖြင့် copy မလုပ်ပေးပါဘူး — ဒါတွေကို CDN တစ်ခုက ကိုင်တွယ်သင့်လို့ပါ။ ဒါပေမယ့် ဒီ folders တွေကို `standalone/public` နဲ့ `standalone/.next/static` folder တွေဆီ ကိုယ်တိုင် copy လုပ်ထားရင် — `server.js` က အဲဒါတွေကို အလိုအလျောက် serve လုပ်ပေးပါလိမ့်မယ်။

ကိုယ်တိုင် copy လုပ်ဖို့ — `next build` ပြီးတဲ့နောက် `cp` command-line tool ကို သုံးနိုင်ပါတယ်:

```bash filename="Terminal"
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
```

သင့် minimal `server.js` ကို local မှာ run လုပ်ဖို့ — အောက်ပါ command ကို သုံးပါ:

```bash filename="Terminal"
node .next/standalone/server.js
```

> **သိထားသင့်သည်:**
>
> - သင့် project က သတ်မှတ်ထားတဲ့ port (သို့) hostname တစ်ခုကို နားထောင်ဖို့ လိုအပ်ရင် — `server.js` run လုပ်ခင် `PORT` (သို့) `HOSTNAME` environment variables တွေကို သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — `PORT=8080 HOSTNAME=0.0.0.0 node server.js` လို့ run လုပ်ရင် server က `http://0.0.0.0:8080` မှာ စတင်ပါတယ်။

## သတိပြုရမည့် အချက်များ (Caveats)

- Monorepo setups တွေမှာ tracing လုပ်တဲ့အခါ — project directory ကို default အနေနဲ့ tracing အတွက် သုံးပါတယ်။ `next build packages/web-app` ဆိုရင် `packages/web-app` က tracing root ဖြစ်ပြီး — အဲဒီ folder အပြင်ဘက်က files တွေ ပါဝင်မှာ မဟုတ်ပါဘူး။ အဲဒီ folder အပြင်ဘက်က files တွေ ထည့်သွင်းချင်ရင် သင့် `next.config.js` ထဲမှာ `outputFileTracingRoot` ကို သတ်မှတ်နိုင်ပါတယ်။

```js filename="packages/web-app/next.config.js"
const path = require('path')

module.exports = {
  // this includes files from the monorepo base two directories up
  outputFileTracingRoot: path.join(__dirname, '../../'),
}
```

- တစ်ချို့ အခြေအနေတွေမှာ Next.js က လိုအပ်တဲ့ files တွေကို မထည့်သွင်းနိုင်တာ (သို့) မလိုအပ်တဲ့ files တွေကို မှားပြီး ထည့်မိတာမျိုး ဖြစ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — `next.config.js` ထဲက `outputFileTracingExcludes` နဲ့ `outputFileTracingIncludes` တွေကို အသီးသီး အသုံးချနိုင်ပါတယ်။ Option တစ်ခုစီက object တစ်ခုကို လက်ခံပြီး — key တွေက **route globs** ([picomatch](https://www.npmjs.com/package/picomatch#basic-globbing) နဲ့ route path ကို match လုပ်တာ၊ ဥပမာ `/api/hello`) ဖြစ်ပြီး value တွေက **project root ကနေ resolve လုပ်ထားတဲ့ glob patterns** ဖြစ်ပါတယ် — trace ထဲမှာ ထည့်သွင်း (သို့) ဖယ်ထုတ်ရမယ့် files တွေကို သတ်မှတ်ပေးပါတယ်။

> **သိထားသင့်သည်:**
> Monorepo တစ်ခုထဲမှာ `project root` ဆိုတာ — Next.js project root (next.config.js ပါဝင်တဲ့ folder၊ ဥပမာ packages/web-app) ကို ရည်ညွှန်းပြီး monorepo root ကို မဆိုလိုပါဘူး။

```js filename="next.config.js"
module.exports = {
  outputFileTracingExcludes: {
    '/api/hello': ['./un-necessary-folder/**/*'],
  },
  outputFileTracingIncludes: {
    '/api/another': ['./necessary-folder/**/*'],
    '/api/login/\\[\\[\\.\\.\\.slug\\]\\]': [
      './node_modules/aws-crt/dist/bin/**/*',
    ],
  },
}
```

`src/` directory တစ်ခုကို သုံးနေရင်လည်း ဒီ options တွေကို ရေးတဲ့ပုံစံ မပြောင်းပါဘူး:

- **Keys** တွေက route path (`'/api/hello'`, `'/products/[id]'` စသည်) နဲ့ ဆက်ပြီး ကိုက်ညီပါတယ်။
- **Values** တွေက project root နဲ့ ဆက်စပ်ပြီး resolve လုပ်လို့ — `src/` အောက်က paths တွေကို ရည်ညွှန်းနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  outputFileTracingIncludes: {
    '/products/*': ['src/lib/payments/**/*'],
    '/*': ['src/config/runtime/**/*.json'],
  },
  outputFileTracingExcludes: {
    '/api/*': ['src/temp/**/*', 'public/large-logs/**/*'],
  },
}
```

`'/*'` လိုမျိုး global key တစ်ခုကို သုံးပြီး routes အားလုံးကိုလည်း target လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  outputFileTracingIncludes: {
    '/*': ['src/i18n/locales/**/*.json'],
  },
}
```

ဒီ options တွေက server traces တွေပေါ်မှာ သက်ရောက်ပြီး — server trace file မထုတ်လုပ်တဲ့ routes တွေကိုတော့ မသက်ရောက်ပါဘူး:

- Edge Runtime routes တွေကို မသက်ရောက်ပါဘူး။
- Static ဖြစ်နေတဲ့ pages အပြည့်အစုံကိုလည်း မသက်ရောက်ပါဘူး။

Monorepos တွေမှာ (သို့) app folder အပြင်ဘက်က files တွေ ထည့်သွင်းဖို့ လိုအပ်တဲ့အခါ — `outputFileTracingRoot` ကို includes တွေနဲ့ ပေါင်းသုံးနိုင်ပါတယ်:

```js filename="next.config.js"
const path = require('path')

module.exports = {
  // Trace from the monorepo root
  outputFileTracingRoot: path.join(__dirname, '../../'),
  outputFileTracingIncludes: {
    '/route1': ['../shared/assets/**/*'],
  },
}
```

> **သိထားသင့်သည်:**
>
> - Cross-platform လိုက်ဖက်မှုအတွက် patterns တွေထဲမှာ forward slashes (`/`) တွေကို ဦးစားပေး သုံးပါ။
> - Traces တွေ ကြီးမသွားအောင် patterns တွေကို တတ်နိုင်သမျှ ကျဉ်းကျဉ်း ထားပါ (repo root မှာ `**/*` သုံးတာမျိုး ရှောင်ပါ)။

Native/runtime assets တွေအတွက် အသုံးများတဲ့ include patterns များ:

```js filename="next.config.js"
module.exports = {
  outputFileTracingIncludes: {
    '/*': ['node_modules/sharp/**/*', 'node_modules/aws-crt/dist/bin/**/*'],
  },
}
```
