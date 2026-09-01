---
title: "Express API ကို override လုပ်ခြင်း"
description: "Prototypes ကို သုံးပြီး request နဲ့ response object တွေပေါ်က method နဲ့ property တွေကို override လုပ်ပြီး Express.js API ကို customize/extend လုပ်နည်း — TypeScript မှာ declaration merging နဲ့ API တိုးချဲ့ခြင်း အပါအဝင်"
order: 15
source: "https://expressjs.com/en/guide/overriding-express-api.html"
status: translated
updated: 2026-09-01
---

Express API က [request](https://expressjs.com/en/api.html#req) နဲ့ [response](https://expressjs.com/en/api.html#res) object တွေပေါ်က method တွေနဲ့ property တွေ အမျိုးမျိုး ပါဝင်ပါတယ်။ ဒါတွေကို prototype ကနေ အမွေဆက်ခံပါတယ်။ Express API အတွက် extension point နှစ်ခု ရှိပါတယ်:

1. Global prototypes တွေ — `express.request` နဲ့ `express.response`
2. App-specific prototypes တွေ — `app.request` နဲ့ `app.response`

Global prototypes တွေကို ပြောင်းလဲရင် — process တစ်ခုတည်းထဲမှာ load လုပ်ထားတဲ့ Express app တွေ အားလုံးကို သက်ရောက်မှု ရှိပါတယ်။ App-specific prototypes တွေကိုသာ ပြောင်းချင်ရင် — app အသစ်တစ်ခု ဖန်တီးပြီးမှ app-specific prototypes တွေကိုသာ ပြောင်းလဲလိုက်ရင် ရပါတယ်။

## Methods

ရှိပြီးသား method တွေရဲ့ signature နဲ့ အပြုအမူ (behavior) ကို — ကိုယ်ပိုင် function တစ်ခု assign လုပ်ပြီး override လုပ်နိုင်ပါတယ်။

အောက်မှာ [res.sendStatus](https://expressjs.com/en/api.html#res.sendStatus) ရဲ့ အပြုအမူကို override လုပ်ထားတဲ့ ဥပမာတစ်ခုပါ:

```js
app.response.sendStatus = function (statusCode, type, message) {
  // code is intentionally kept simple for demonstration purpose
  return this.contentType(type).status(statusCode).send(message);
};
```

```ts
import { type Response } from 'express';

// Broaden the type of sendStatus so call sites accept the new arguments.
declare module 'express-serve-static-core' {
  interface Response {
    sendStatus(statusCode: number, type: string, message: string): this;
  }
}

app.response.sendStatus = function (
  this: Response,
  statusCode: number,
  type: string,
  message: string
) {
  // code is intentionally kept simple for demonstration purpose
  return this.contentType(type).status(statusCode).send(message);
} as Response['sendStatus'];
```

အထက်ပါ implementation က `res.sendStatus` ရဲ့ မူလ signature ကို လုံးဝ ပြောင်းလဲလိုက်ပါတယ်။ အခုဆို သူ့မှာ status code, encoding type, နဲ့ client ဆီ ပို့မယ့် message ဆိုတဲ့ argument သုံးခု ရှိပါတယ်။

TypeScript မှာ `express-serve-static-core` ကို augment လုပ်တာက `Response` type မှာ overload အသစ်ကို ထည့်ပေးလို့ — `res.sendStatus(404, 'application/json', body)` လိုမျိုး call site တွေက type-check ဖြစ်ပါတယ်။ Assignment ကို `as Response['sendStatus']` နဲ့ cast လုပ်ထားတာက — signature မတူတဲ့ function နဲ့ method ကို အစားထိုးတာက မူလ declaration နဲ့ တိုက်စစ်လို့ မရတာကြောင့်ပါ။

Override လုပ်ထားတဲ့ method ကို အခုဆို ဒီလို သုံးနိုင်ပါတယ်:

```js
res.sendStatus(404, 'application/json', '{"error":"resource not found"}');
```

## Properties

Express API ထဲက properties တွေက:

1. Assign လုပ်ထားတဲ့ properties တွေ (ဥပမာ: `req.baseUrl`, `req.originalUrl`)
2. Getters အဖြစ် သတ်မှတ်ထားတဲ့ properties တွေ (ဥပမာ: `req.secure`, `req.ip`)

အမျိုးအစား 1 ထဲက properties တွေက — လက်ရှိ request-response cycle ရဲ့ အတွင်းမှာ `request` နဲ့ `response` object တွေပေါ်ကို dynamic အနေနဲ့ assign လုပ်တာမို့ — သူတို့ရဲ့ အပြုအမူကို override လုပ်လို့ မရပါဘူး။

အမျိုးအစား 2 ထဲက properties တွေကိုတော့ Express API extensions API ကို သုံးပြီး ပြန်ရေးလို့ (overwrite) ရပါတယ်။

အောက်ပါ code က `req.ip` ရဲ့ တန်ဖိုးကို ဘယ်လို ဆင်းသက်စေမလဲဆိုတာကို ပြန်ရေးထားတာပါ။ အခုဆို သူက `Client-IP` request header ရဲ့ တန်ဖိုးကိုပဲ ပြန်ပေးပါတယ်:

```js
Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get() {
    return this.get('Client-IP');
  },
});
```

```ts
import { type Request } from 'express';

Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get(this: Request) {
    return this.get('Client-IP');
  },
});
```

## TypeScript မှာ API ကို တိုးချဲ့ခြင်း

အထက်က section တွေက Express မှာ ရှိပြီးသား members တွေကို override လုပ်တာပါ။ Request ဒါမှမဟုတ် response ပေါ်မှာ ကိုယ်ပိုင် property ဒါမှမဟုတ် method အသစ်တွေ ထည့်ချင်ရင်တော့ — `Express` namespace ပေါ်မှာ [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) ကို သုံးပြီး TypeScript ကို ဖော်ပြပါ။ Augmentation ကို ကိုယ့် project ထဲက `.d.ts` file တစ်ခုမှာ ထားပါ။ custom `include` က အဲဒီ file ရဲ့ တည်နေရာကို မဖုံးလွှမ်းရင် ကလွဲလို့ — `tsconfig.json` ကို ပြောင်းစရာ မလိုပါဘူး။

ဥပမာ — authentication middleware တစ်ခုက `user` တစ်ခုကို request မှာ ကပ်ထားနိုင်ပြီး — response မှာ `sendError` helper တစ်ခု ထည့်ချင်တယ်ဆိုပါစို့:

```ts
interface User {
  id: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Response {
      sendError(status: number, message: string): this;
    }
  }
}

export {};
```

အခုဆို ဒီအသစ်တွေက application တစ်လျှောက်လုံး သိရှိနေပါပြီ:

```ts
import { type Request, type Response, type NextFunction } from 'express';

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { id: '1', name: 'Tobi' };
  next();
});

app.response.sendError = function (this: Response, status: number, message: string) {
  return this.status(status).json({ error: message });
};

app.get('/', (req: Request, res: Response) => {
  if (!req.user) {
    res.sendError(401, 'unauthorized');
    return;
  }
  res.send(req.user.name);
});
```

> **သတိပြုရန်:** ကိုယ်ပိုင် request properties တွေကို optional (`user?`) အနေနဲ့ ကြေညာပါ။ Type က request တိုင်းနဲ့ သက်ဆိုင်ပေမယ့် — TypeScript က ဘယ် middleware က ဘယ် handler ရဲ့ ရှေ့မှာ run ခဲ့လဲဆိုတာ မသိနိုင်တာမို့ — required property ဆိုရင် မှားယွင်းတဲ့ အာမခံချက် (false guarantee) တစ်ခု ဖြစ်သွားပါလိမ့်မယ်။ ဒါကြောင့် (အထက်က `if (!req.user)` လိုမျိုး) value ရှိမရှိကို ဦးစွာ စစ်ပြီးမှ အသုံးပြုပါ။

Method အသစ်တစ်ခု ထည့်တာက — signature မတူတဲ့ function နဲ့ ရှိပြီးသား method ကို override လုပ်တာနဲ့ မတူဘဲ — cast မလိုအပ်ပါဘူး။ ဘာလို့လဲဆိုတော့ အဲဒီ method က type ပေါ်မှာ အရင်က မရှိခဲ့လို့ပါ။

## Prototype

Express API ကို ပေးနိုင်ဖို့အတွက် — Express ဆီ ပေးပို့လိုက်တဲ့ (ဥပမာ `app(req, res)` ကတစ်ဆင့်) request/response object တွေက prototype chain တစ်ခုတည်းကနေ အမွေဆက်ခံဖို့ လိုအပ်ပါတယ်။ Default အနေနဲ့ — request အတွက် `http.IncomingRequest.prototype` နဲ့ response အတွက် `http.ServerResponse.prototype` ဖြစ်ပါတယ်။

မလိုအပ်ဘူးဆိုရင် — global အနေနဲ့ မဟုတ်ဘဲ application level မှာသာ လုပ်ဖို့ အကြံပြုပါတယ်။ ဒါ့အပြင် — သုံးနေတဲ့ prototype က default prototypes တွေနဲ့ တတ်နိုင်သမျှ နီးစပ်အောင် functionality ကိုက်ညီဖို့လည်း သတိထားပါ။

```js
// Use FakeRequest and FakeResponse in place of http.IncomingRequest and http.ServerResponse
// for the given app reference
Object.setPrototypeOf(Object.getPrototypeOf(app.request), FakeRequest.prototype);
Object.setPrototypeOf(Object.getPrototypeOf(app.response), FakeResponse.prototype);
```
