---
title: "logging (development logging)"
description: "logging option — development mode တွင် terminal ၌ logging အပြုအမူ သတ်မှတ်ချက်: fetch logging, incoming requests, server functions နှင့် browser console logs များကို terminal သို့ ပို့ဆောင်ခြင်း"
order: 95
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/logging"
status: translated
updated: 2026-09-02
---

## Options

### Fetching

Development mode မှာ Next.js run လုပ်နေတဲ့အခါ — logging level နဲ့ full URL ကို console ထဲ log လုပ်မလား ဆိုတာကို configure လုပ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

[Server Components HMR cache](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache) ကနေ ပြန်ယူထားတဲ့ (restored) `fetch` requests တွေကို default အားဖြင့် log မလုပ်ပါဘူး။ ဒါပေမယ့် — `logging.fetches.hmrRefreshes` ကို `true` လို့ သတ်မှတ်ပြီး ဖွင့်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
}
```

### Server Functions

[Server Functions](https://react.dev/reference/rsc/server-functions) တွေရဲ့ invocation တွေကို development အတွင်းမှာ default အားဖြင့် log လုပ်ပါတယ်။ `logging.serverFunctions` ကို `false` လို့ သတ်မှတ်ပြီး ပိတ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: {
    serverFunctions: false,
  },
}
```

ဖွင့်ထားတဲ့အခါ — terminal က Server Function call တစ်ခုစီကို ၎င်းရဲ့ function name, arguments, နဲ့ duration တွေနဲ့အတူ ပြသပါတယ်:

```bash filename="Terminal"
POST /
  └─ ƒ myAction(arg1, arg2) in 5ms app/actions.ts
```

### Incoming Requests

Default အားဖြင့် development အတွင်းမှာ incoming requests အားလုံးကို console ထဲမှာ log လုပ်ပါတယ်။ ဘယ် requests တွေကို လျစ်လျူရှုရမလဲ ဆုံးဖြတ်ဖို့ `incomingRequests` option ကို သုံးနိုင်ပါတယ်။ ဒါက development မှာပဲ log လုပ်တာမို့ — ဒီ option က production builds တွေကို မသက်ရောက်ပါဘူး။

```js filename="next.config.js"
module.exports = {
  logging: {
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
  },
}
```

(သို့) `incomingRequests` ကို `false` လို့ သတ်မှတ်ပြီး incoming request logging ကို ပိတ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: {
    incomingRequests: false,
  },
}
```

### Browser Console Logs

Development အတွင်းမှာ browser console logs တွေ (`console.log`, `console.warn`, `console.error` စသည်) ကို terminal ဆီ ပို့ဆောင်နိုင်ပါတယ်။ ဒါက browser ရဲ့ developer tools တွေကို မစစ်ဆေးဘဲ client-side code တွေကို debug လုပ်ဖို့ အသုံးဝင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: {
    browserToTerminal: true,
  },
}
```

#### Options

`browserToTerminal` option က အောက်ပါ values တွေကို လက်ခံပါတယ်:

| Value     | ဖော်ပြချက်                                            |
| --------- | --------------------------------------------------- |
| `'warn'`  | Warnings နဲ့ errors တွေကိုပဲ ပို့ဆောင် (default)      |
| `'error'` | Errors တွေကိုပဲ ပို့ဆောင်                            |
| `true`    | Console output အားလုံး (log, info, warn, error) ပို့ဆောင် |
| `false`   | Browser log ပို့ဆောင်ခြင်းကို ပိတ်                     |

```js filename="next.config.js"
module.exports = {
  logging: {
    browserToTerminal: 'warn',
  },
}
```

#### Source Location

ဖွင့်ထားတဲ့အခါ — browser logs တွေမှာ source location အချက်အလက် (file path နဲ့ line number) တွေကို default အားဖြင့် ပါဝင်ပါတယ်။ ဥပမာ:

```tsx filename="app/page.tsx" highlight={8}
'use client'

export default function Home() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Hello World')
      }}
    >
      Click me
    </button>
  )
}
```

Button ကို နှိပ်လိုက်ရင် ဒီ message ကို terminal ထဲမှာ ပုံနှိပ်ပါတယ်:

```bash filename="Terminal"
[browser] Hello World (app/page.tsx:8:17)
```

### Logging ကို ပိတ်ခြင်း

ဒါ့အပြင် — `logging` ကို `false` လို့ သတ်မှတ်ပြီး development logging တစ်ခုလုံးကို ပိတ်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  logging: false,
}
```

## Version History

| Version   | အပြောင်းအလဲ                                                                          |
| --------- | -------------------------------------------------------------------------------- |
| `v16.2.0` | `browserToTerminal` ထည့်သွင်း (`experimental.browserDebugInfoInTerminal` ကနေ ရွှေ့ပြောင်း) |
| `v15.4.0` | `experimental.browserDebugInfoInTerminal` စတင် မိတ်ဆက်                             |
| `v15.2.0` | `incomingRequests` ထည့်သွင်း                                                         |
| `v15.0.0` | `logging: false` option ထည့်သွင်း၊ App Router အတွက် `fetches.hmrRefreshes` ထည့်သွင်း       |
| `v14.0.0` | `logging.fetches` ကို App Router အတွက် stable သို့ ပြောင်း                             |
