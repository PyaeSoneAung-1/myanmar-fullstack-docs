---
title: "Express တပ်ဆင်ခြင်း"
description: "Node.js ထဲ Express.js ကို ဘယ်လို install လုပ်မလဲ — project directory တည်ဆောက်ခြင်း၊ npm နဲ့ dependencies စီမံခြင်း၊ TypeScript ပြင်ဆင်သတ်မှတ်ခြင်း"
order: 10
source: "https://expressjs.com/en/starter/installing.html"
status: translated
updated: 2026-09-01
---

## မစတင်မီ

Express ကို install မလုပ်ခင် [Node.js](https://nodejs.org/) version **18 သို့မဟုတ် အထက်** ကို တပ်ဆင်ထားဖို့ သေချာပါစေ။ ပြီးရင် ကိုယ့် application အတွက် directory အသစ်တစ်ခု ဖန်တီးပြီး အဲဒီထဲကို ဝင်ပါ:

```bash
mkdir myapp
cd myapp
```

`npm init` command ကို သုံးပြီး application အတွက် `package.json` file တစ်ခု ဖန်တီးပါ။ `package.json` ဘယ်လို အလုပ်လုပ်လဲဆိုတာ ပိုသိချင်ရင် [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json) မှာ ကြည့်နိုင်ပါတယ်။

```bash
npm init
```

ဒီ command က application ရဲ့ name နဲ့ version စတဲ့ အချက်အလက်တွေကို မေးပါတယ်။ အခုအချိန်မှာတော့ အတော်များများကို default အတိုင်း လက်ခံဖို့ RETURN (Enter) နှိပ်ရုံပါပဲ — ဒီတစ်ခုကလွဲလို့:

```
entry point: (index.js)
```

ဒီနေရာမှာ main file ရဲ့ နာမည်ကို `app.js` ဒါမှမဟုတ် ကိုယ်ကြိုက်တဲ့ နာမည်တစ်ခု ရိုက်ထည့်ပါ။ `index.js` ပဲ ဖြစ်ချင်ရင်တော့ default file name ကို လက်ခံဖို့ RETURN နှိပ်လိုက်ရုံပါပဲ။

အခု `myapp` directory ထဲမှာ Express ကို install လုပ်ပြီး dependencies list ထဲကို သိမ်းပါ:

```bash
npm install express
```

Express ကို ယာယီ install လုပ်ချင်ပြီး dependencies list ထဲ မထည့်ချင်ဘူးဆိုရင်:

```bash
npm install express --no-save
```

## TypeScript

Express က JavaScript နဲ့ ရေးထားတာဖြစ်လို့ ကိုယ်ပိုင် type definition တွေ ပါမလာပါဘူး။ TypeScript နဲ့ သုံးချင်ရင်တော့ TypeScript ကို — Express နဲ့ Node.js အတွက် community က ထိန်းသိမ်းထားတဲ့ types တွေ ([DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) ကနေ) နဲ့အတူ development dependencies အဖြစ် install လုပ်ပါ:

```bash
npm install --save-dev typescript @types/express @types/node
```

> **သတိပြုရန်:** Middleware အချို့က ကိုယ်ပိုင် type definition တွေ ပါမလာပါဘူး။ TypeScript က untyped လို့ ပြနေတဲ့ official middleware package တစ်ခုကို ထည့်လိုက်ရင် — ဥပမာ `cors` နဲ့အတူ `@types/cors` လိုမျိုး — အဲဒီ package ရဲ့ types ကိုပါ DefinitelyTyped ကနေ dev dependency အဖြစ် install လုပ်ဖို့ မမေ့ပါနဲ့။

`tsconfig.json` file တစ်ခု ထည့်ပါ။ အောက်က option တွေက Node.js က TypeScript ကို run လုပ်ပုံနဲ့ တူညီအောင် သတ်မှတ်ပေးပြီး — Node က ဖြုတ်ပစ်လို့မရတဲ့ syntax တွေ (ဥပမာ `enum` တွေ၊ namespace တွေ၊ parameter properties တွေ) ကို compiler က ငြင်းပယ်စေပါတယ်:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

Application ကို TypeScript နဲ့ ရေးပြီး [request](https://expressjs.com/en/api.html#req) နဲ့ [response](https://expressjs.com/en/api.html#res) object တွေကို type annotation ပေးပါ:

```ts
import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000);
```

အကုန်လုံးကို annotate လုပ်ဖို့ မလိုပါဘူး။ Handler တစ်ခုကို route method ဒါမှမဟုတ် `app.use()` ဆီ တိုက်ရိုက် ပေးလိုက်တဲ့အခါ — Express က `req`, `res`, `next` တွေရဲ့ type တွေကို ကိုယ်တိုင် သိရှိပြီး route parameter တွေကိုလည်း path ကနေ ခန့်မှန်းပေးပါတယ်။ ဒါကြောင့် `app.get('/users/:id', ...)` မှာ `req.params.id` က `string` type ဖြစ်ပါတယ်။ TypeScript မှာ ခန့်မှန်းဖို့ context မရှိတဲ့ နေရာတွေမှာပဲ explicit type တွေ ထည့်ပါ: error-handling middleware — သူ့ရဲ့ `(err, req, res, next)` signature ကို infer မလုပ်ပေးတာကြောင့် — နဲ့ route ကနေ သီးခြား သတ်မှတ်ထားတဲ့ handler တွေပါ။ အဲဒီကိစ္စတွေမှာ parameter တွေကို annotate လုပ်ပါ၊ ဒါမှမဟုတ် function တစ်ခုလုံးကို `RequestHandler` ဒါမှမဟုတ် `ErrorRequestHandler` type နဲ့ သတ်မှတ်ပါ။

File ကို Node.js နဲ့ တိုက်ရိုက် run လုပ်ပါ — Node က TypeScript type တွေကို ဖြုတ်ပြီး build step မလိုဘဲ run ပေးပါတယ်:

```bash
node src/app.ts
```

> **မှတ်ချက်:** `.ts` file တွေကို တိုက်ရိုက် run လုပ်ဖို့ Node.js >= 22.18.0 (v23 line မှာဆိုရင် >= 23.6.0) နဲ့ TypeScript >= 5.8 လိုအပ်ပါတယ်။ Node က types တွေကို ဖြုတ်ပေးရုံသာ ဖြစ်ပြီး type-check မလုပ်ပေးပါဘူး — ဒါကြောင့် project ကို type-check လုပ်ဖို့ `npx tsc` ကို run လုပ်ပါ။ အသေးစိတ်ကို Node.js ရဲ့ [running TypeScript natively](https://nodejs.org/learn/typescript/run-natively) guide မှာ ကြည့်နိုင်ပါတယ်။
