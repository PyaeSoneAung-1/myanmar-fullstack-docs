---
title: "Custom Server (custom server စနစ်ထည့်သွင်းခြင်း)"
description: "Next.js application ကို custom server နဲ့ programmatically စတင်နည်း — ဘယ်အခါ သုံးသင့်လဲ, server.ts|js ဥပမာ, next({}) options များ, response headers သတ်မှတ်ခြင်းနဲ့ package.json scripts"
order: 112
source: "https://nextjs.org/docs/app/guides/custom-server"
status: translated
updated: 2026-09-03
---

Next.js မှာ ကိုယ်ပိုင် server တစ်ခု `next start` နဲ့အတူ ပါဝင်ပါတယ်။ ရှိပြီးသား backend တစ်ခု ရှိရင်လည်း သူ့ကို Next.js နဲ့ တွဲသုံးလို့ရပါတယ် (ဒါက custom server မဟုတ်ပါဘူး)။ Custom Next.js server ကတော့ — custom patterns တွေအတွက် server တစ်ခုကို programmatically စတင်နိုင်စေပါတယ်။ အချိန်အများစုမှာ ဒီနည်းလမ်း မလိုအပ်ပါဘူး။ ဒါပေမယ့် လိုအပ်ရင် (eject လုပ်ချင်ရင်) ရနိုင်ပါတယ်။

> **သိထားသင့်သည်**:
>
> - Custom server သုံးဖို့ မဆုံးဖြတ်ခင် — Next.js ရဲ့ integrated router က သင့် app ရဲ့ လိုအပ်ချက်တွေကို မဖြည့်ဆည်းနိုင်မှသာ သုံးသင့်တယ်ဆိုတာ သတိရပါ။
> - Standalone output mode သုံးတဲ့အခါ — custom server files တွေကို trace မလုပ်ပါဘူး။ ဒီ mode က သီးခြား minimal `server.js` file တစ်ခုကို output လုပ်ပေးပါတယ်။ ဒါတွေကို အတူတူ သုံးလို့ မရပါဘူး။

Custom server တစ်ခုရဲ့ [ဥပမာကို ဒီမှာ ကြည့်ပါ](https://github.com/vercel/next.js/tree/canary/examples/custom-server):

```ts filename="server.ts"
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

```js filename="server.js"
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

> **`handle` ကို မခေါ်ခင် ကိုယ်ပိုင် response headers တွေ သတ်မှတ်ပါ**: Next.js က `handle(req, res)` အတွင်းမှာ response ကို စတင် ပို့ပေးပါတယ် — ဒါကြောင့် သူ့ရဲ့ promise ပြီးဆုံးတဲ့အခါ `res.headersSent` က `true` ဖြစ်နေပြီး နောက်ကနေ ခေါ်တဲ့ `res.setHeader()` တွေက တိတ်တဆိတ် ပစ်ပယ်ခံရပါတယ်။ `Set-Cookie` လို ကိုယ်ပိုင် headers တွေကို — request ကို Next.js ဆီ မအပ်ခင် သတ်မှတ်ပါ:
>
> ```js
> res.setHeader('Set-Cookie', 'sessionId=abc123; Max-Age=2592000')
>
> await handle(req, res)
> ```
>
> Next.js ကို တခြား framework တစ်ခုအတွင်းမှာ wrap လုပ်တဲ့အခါမှာလည်း — ဥပမာ Fastify ရဲ့ `reply.raw` (သို့) Express ရဲ့ `res` — ဒီအတိုင်း အစီအစဉ် လိုက်နာရပါမယ်။

> `server.js` က Next.js Compiler (သို့) bundling process ကို ဖြတ်သန်းမသွားပါဘူး။ ဒီ file က require လုပ်တဲ့ syntax နဲ့ source code တွေက သင်သုံးနေတဲ့ လက်ရှိ Node.js version နဲ့ ကိုက်ညီကြောင်း သေချာပါစေ။ [ဥပမာတစ်ခု ကြည့်ပါ](https://github.com/vercel/next.js/tree/canary/examples/custom-server)။

Custom server ကို run လုပ်ဖို့ — `package.json` ထဲက `scripts` တွေကို ဒီလို update လုပ်ရပါမယ်:

```json filename="package.json"
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

တနည်းအားဖြင့် — `nodemon` ကိုလည်း စနစ်ထည့်သွင်းနိုင်ပါတယ် ([ဥပမာ](https://github.com/vercel/next.js/tree/canary/examples/custom-server))။ Custom server က server နဲ့ Next.js application ကို ချိတ်ဆက်ဖို့ အောက်ပါ import ကို သုံးပါတယ်:

```js
import next from 'next'

const app = next({})
```

အထက်ပါ `next` import က function တစ်ခု ဖြစ်ပြီး — အောက်ပါ options တွေ ပါတဲ့ object တစ်ခုကို လက်ခံပါတယ်:

| Option       | Type               | Description                                                                                  |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------- |
| `conf`       | `Object`           | `next.config.js` မှာ သုံးမယ့် object အတိုင်းပဲ။ Default က `{}`                               |
| `dev`        | `Boolean`          | (_Optional_) Next.js ကို dev mode မှာ launch လုပ်မလား ဆိုတာ။ Default က `false`             |
| `dir`        | `String`           | (_Optional_) Next.js project ရဲ့ တည်နေရာ။ Default က `'.'`                                   |
| `quiet`      | `Boolean`          | (_Optional_) Server အချက်အလက်တွေ ပါတဲ့ error messages တွေကို ဖျောက်ပေးပါတယ်။ Default က `false` |
| `hostname`   | `String`           | (_Optional_) Server က နောက်ကွယ်မှာ run နေတဲ့ hostname                                     |
| `port`       | `Number`           | (_Optional_) Server က နောက်ကွယ်မှာ run နေတဲ့ port                                           |
| `httpServer` | `node:http#Server` | (_Optional_) Next.js က နောက်ကွယ်မှာ run နေတဲ့ HTTP Server                                 |
| `turbopack`  | `Boolean`          | (_Optional_) Turbopack ကို ဖွင့်ပါ (default အားဖြင့် ဖွင့်ထားပြီးသား)                      |
| `webpack`    | `Boolean`          | (_Optional_) Webpack ကို ဖွင့်ပါ                                                             |

ပြန်လာတဲ့ `app` ကို သုံးပြီး — လိုအပ်သလို Next.js က requests တွေကို ကိုင်တွယ်စေနိုင်ပါတယ်။
