---
title: "Express v5 သို့ အဆင့်မြှင့်တင်ခြင်း (Upgrade to Express v5)"
description: "Express 4 ကနေ Express v5 ဆီ ပြောင်းရွှေ့တဲ့အခါ သိထားရမယ့် breaking changes တွေ — ဖယ်ရှားလိုက်တဲ့ method/property တွေ၊ အပြုအမူ ပြောင်းလဲသွားတဲ့ APIs တွေ၊ codemods တွေနဲ့ code ကို အလိုအလျောက် update လုပ်နည်း"
order: 30
source: "https://expressjs.com/en/guide/migrating-5.html"
status: translated
updated: 2026-09-03
---

Express 5 က Express 4 နဲ့ သိပ်မကွာလှပါဘူး — အခြေခံ API တွေကို ဆက်ထိန်းထားပေးပေမယ့် — အရင် version နဲ့ လိုက်ဖက်မှု (compatibility) ကို ချိုးဖျက်တဲ့ ပြောင်းလဲချက်တွေတော့ ရှိနေပါသေးတယ်။ ဒါကြောင့် Express 4 နဲ့ တည်ဆောက်ထားတဲ့ application တစ်ခုက Express 5 ကို update လုပ်လိုက်ရင် — အလုပ်မလုပ်တော့ဘဲ ဖြစ်သွားနိုင်ပါတယ်။

## တပ်ဆင်ခြင်း (Installation)

ဒီ version ကို တပ်ဆင်ဖို့ **Node.js version 18 (သို့) ဒီထက် ပိုမြင့်တဲ့ version** ရှိဖို့ လိုပါတယ်။ ပြီးရင် application directory ထဲမှာ အောက်ပါ command ကို run လုပ်ပါ:

```bash
npm install "express@5"
```

ပြီးရင် automated tests တွေကို run လုပ်ပြီး — ဘာတွေ fail ဖြစ်လဲ ကြည့်ပါ၊ အောက်မှာ ဖော်ပြထားတဲ့ updates တွေအတိုင်း ပြဿနာတွေကို ပြင်ပါ။ Test failures တွေကို ဖြေရှင်းပြီးရင် — app ကို run လုပ်ပြီး ဘယ် error တွေ ဖြစ်ပေါ်လဲ ကြည့်ပါ။ App က မထောက်ပံ့တော့တဲ့ method (သို့) property တစ်ခုခုကို သုံးထားရင် — ချက်ချင်း သိရပါလိမ့်မယ်။

## Express 5 Codemods

Express server ကို ပြောင်းရွှေ့ဖို့ ကူညီရာမှာ — code တွေကို Express ရဲ့ နောက်ဆုံး version ဆီ အလိုအလျောက် update လုပ်ပေးမယ့် codemods အစုတစ်စုကို ဖန်တီးထားပါတယ်။

ရနိုင်တဲ့ codemods အားလုံးကို run လုပ်ဖို့ အောက်ပါ command ကို run လုပ်ပါ:

```bash
npx codemod@latest @expressjs/v5-migration-recipe
```

Codemod တစ်ခုချင်းစီကို သီးသန့် run လုပ်ချင်ရင် — အောက်ပါ command ကို သုံးနိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/name-of-the-codemod
```

ရနိုင်တဲ့ codemods တွေရဲ့ စာရင်းကို [ဒီမှာ](https://codemod.link/express) ကြည့်နိုင်ပါတယ်။

## ဖယ်ရှားလိုက်တဲ့ Method တွေနဲ့ Properties တွေ (Removed Methods and Properties)

ဒီ methods (သို့) properties တွေထဲက တစ်ခုခုကို app ထဲမှာ သုံးထားရင် — crash ဖြစ်ပါလိမ့်မယ်။ ဒါကြောင့် version 5 ကို update လုပ်ပြီးနောက်မှာ app ကို ပြောင်းလဲဖို့ လိုပါတယ်။

### app.del()

Express 5 က `app.del()` function ကို မထောက်ပံ့တော့ပါဘူး — သုံးမိရင် error တစ်ခု throw လုပ်ပါတယ်။ HTTP DELETE routes တွေ register လုပ်ဖို့ `app.delete()` function ကို သုံးပါ။

အစမှာတော့ `delete` က JavaScript မှာ reserved keyword ဖြစ်နေလို့ `del` ကို `delete` နေရာမှာ သုံးခဲ့ရတာပါ။ ဒါပေမယ့် ECMAScript 6 ကစပြီး — `delete` နဲ့ တခြား reserved keywords တွေကို property names တွေအနေနဲ့ တရားဝင် သုံးလို့ရပါတယ်။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/route-del-to-delete
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
-app.del('/user/:id', (req, res) => {
+app.delete('/user/:id', (req, res) => {
   res.send(`DELETE /user/${req.params.id}`);
 });
```

### app.param(fn)

`app.param(fn)` signature က `app.param(name, fn)` function ရဲ့ အပြုအမူကို ပြုပြင်ဖို့ သုံးခဲ့တာပါ — v4.11.0 ကတည်းက deprecated ဖြစ်ခဲ့ပြီး Express 5 မှာတော့ လုံးဝ မထောက်ပံ့တော့ပါဘူး။

### Plural လုပ်ထားတဲ့ Method Names တွေ (Pluralized Method Names)

အောက်ပါ method names တွေကို plural ပုံစံ ပြောင်းလိုက်ပါပြီ — Express 4 မှာ method အဟောင်းတွေကို သုံးရင် deprecation warning ရခဲ့ပေမယ့် Express 5 မှာတော့ လုံးဝ မထောက်ပံ့တော့ပါဘူး:

`req.acceptsCharset()` နေရာမှာ `req.acceptsCharsets()` ကို အစားထိုး သုံးပါ။

`req.acceptsEncoding()` နေရာမှာ `req.acceptsEncodings()` ကို အစားထိုး သုံးပါ။

`req.acceptsLanguage()` နေရာမှာ `req.acceptsLanguages()` ကို အစားထိုး သုံးပါ။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/pluralize-method-names
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.all('/', (req, res) => {
-  req.acceptsCharset('utf-8');
-  req.acceptsEncoding('br');
-  req.acceptsLanguage('en');
+  req.acceptsCharsets('utf-8');
+  req.acceptsEncodings('br');
+  req.acceptsLanguages('en');

   // ...
 });
```

### app.param(name, fn) ရဲ့ Name ထဲက ရှေ့ဆုံး Colon (:)

`app.param(name, fn)` function ရဲ့ name ထဲက ရှေ့ဆုံး colon (:) က Express 3 ခေတ်က အကြွင်းအကျန် တစ်ခုပါ — backwards compatibility အတွက် Express 4 က deprecation notice နဲ့အတူ ထောက်ပံ့ပေးခဲ့ပြီး Express 5 ကတော့ အဲဒါကို တိတ်တဆိတ် ignore လုပ်ပြီး — colon မထည့်ဘဲ name parameter ကိုပဲ သုံးပါလိမ့်မယ်။

ဒါက — Express 4 documentation ရဲ့ [app.param](https://expressjs.com/en/4x/api.html#app.param) မှာ ရှေ့ဆုံး colon အကြောင်း ဖော်ပြထားခြင်း မရှိလို့ — အဲဒီ documentation အတိုင်း လိုက်နာထားရင် ကိုယ့် code ကို ထိခိုက်စေမှာ မဟုတ်ပါဘူး။

### req.param(name)

Form data တွေ ရယူဖို့ သုံးတဲ့ ဒီရှုပ်ထွေးစေနိုင်ပြီး အန္တရာယ်ရှိတဲ့ method ကို ဖယ်ရှားလိုက်ပါပြီ — အခုဆိုရင် ပို့လိုက်တဲ့ parameter name ကို `req.params`, `req.body` (သို့) `req.query` object တွေထဲမှာ သီးသန့် ရှာဖွေပေးရပါလိမ့်မယ်။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/explicit-request-params
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.post('/user', (req, res) => {
-  const id = req.param('id');
-  const body = req.param('body');
-  const query = req.param('query');
+  const id = req.params.id;
+  const body = req.body;
+  const query = req.query;

   // ...
 });
```

### res.json(obj, status)

Express 5 က `res.json(obj, status)` ဆိုတဲ့ signature ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား status ကို သတ်မှတ်ပြီး `res.json()` method နဲ့ ဒီလို chain လုပ်ပါ: `res.status(status).json(obj)`။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/status-send-order
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.post('/user', (req, res) => {
-  res.json({ name: 'Ruben' }, 201);
+  res.status(201).json({ name: 'Ruben' });
 });
```

### res.jsonp(obj, status)

Express 5 က `res.jsonp(obj, status)` ဆိုတဲ့ signature ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား status ကို သတ်မှတ်ပြီး `res.jsonp()` method နဲ့ ဒီလို chain လုပ်ပါ: `res.status(status).jsonp(obj)`။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/status-send-order
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.post('/user', (req, res) => {
-  res.jsonp({ name: 'Ruben' }, 201);
+  res.status(201).jsonp({ name: 'Ruben' });
 });
```

### res.redirect(url, status)

Express 5 က `res.redirect(url, status)` ဆိုတဲ့ signature ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား ဒီ signature ကို သုံးပါ: `res.redirect(status, url)`။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/redirect-arg-order
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/user', (req, res) => {
-  res.redirect('/users', 302);
+  res.redirect(302, '/users');
 });

 // A redirect that relies on the default 302 status is unaffected
 app.get('/admin', (req, res) => {
   res.redirect('/dashboard');
 });
```

### res.redirect('back') နဲ့ res.location('back')

Express 5 က `res.redirect()` နဲ့ `res.location()` methods တွေထဲက magic string `back` ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား ယခင် page ဆီ ပြန်သွားဖို့ `req.get('Referrer') || '/'` တန်ဖိုးကို သုံးပါ။ Express 4 မှာ `res.redirect('back')` နဲ့ `res.location('back')` methods တွေက deprecated ဖြစ်ခဲ့ပါတယ်။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/back-redirect-deprecated
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/user', (req, res) => {
-  res.redirect('back');
+  res.redirect(req.get('Referrer') || '/');
 });
```

### res.send(body, status)

Express 5 က `res.send(obj, status)` ဆိုတဲ့ signature ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား status ကို သတ်မှတ်ပြီး `res.send()` method နဲ့ ဒီလို chain လုပ်ပါ: `res.status(status).send(obj)`။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/status-send-order
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/user', (req, res) => {
-  res.send({ name: 'Ruben' }, 200);
+  res.status(200).send({ name: 'Ruben' });
 });
```

### res.send(status)

Express 5 က number ဖြစ်တဲ့ `res.send(status)` ဆိုတဲ့ signature ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား HTTP response header ထဲမှာ status code ကို သတ်မှတ်ပြီး အဲဒီ code ရဲ့ text ပုံစံကို ပို့ပေးတဲ့ `res.sendStatus(statusCode)` function ကို သုံးပါ: "Not Found", "Internal Server Error" စသဖြင့်ပါ။ `res.send()` function နဲ့ number တစ်ခုကို ပို့ဖို့ လိုအပ်ရင် — Express က မထောက်ပံ့တော့တဲ့ signature အဟောင်းကို သုံးတာလို့ မြင်မှာ စိုးလို့ — number ကို quote လုပ်ပြီး string အဖြစ် ပြောင်းပါ။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/status-send-order
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/user', (req, res) => {
-  res.send(200);
+  res.sendStatus(200);
 });
```

### res.sendfile()

`res.sendfile()` function ကို Express 5 မှာ camel-case ပုံစံ `res.sendFile()` နဲ့ အစားထိုးလိုက်ပါတယ်။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/camelcase-sendfile
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/user', (req, res) => {
-  res.sendfile('/path/to/file');
+  res.sendFile('/path/to/file');
 });
```

### res.sendFile() Options တွေ (res.sendFile() Options)

`res.sendFile()` ရဲ့ `hidden` နဲ့ `from` options တွေကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား `dotfiles` နဲ့ `root` ကို သုံးပါ။

`dotfiles` option က path ထဲက hidden directories တွေကိုရော hidden files တွေကိုပါ သက်ရောက်ပါတယ်။ ဥပမာ — `/var/www/app/.cache/index.html` လို absolute path ကနေ file တစ်ခုကို serve လုပ်တဲ့အခါ — `index.html` က dotfile မဟုတ်ပေမယ့်လည်း — အခု `dotfiles: 'allow'` လိုအပ်ပါတယ်။ Express 4 မှာ path ထဲက hidden directory တစ်ခုကို default အနေနဲ့ serve လုပ်ပေးခဲ့ပြီး Express 5 မှာတော့ opt in လုပ်မှသာ — မဟုတ်ရင် `404` ပြန်ပါတယ်။

ဒီစစ်ဆေးမှုက `send` က ဆန်းစစ်တဲ့ path ရဲ့ အစိတ်အပိုင်းကိုပဲ သက်ရောက်ပါတယ် — `root` တစ်ခုကို ပေးလိုက်ရင် `root` နဲ့ နှိုင်းယှဉ်တဲ့ အပိုင်းကိုပဲ စစ်ဆေးတာမို့ — `root` ထဲက hidden directory တစ်ခုကို ထိခိုက်မှာ မဟုတ်ပါဘူး။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/sendfile-options
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 app.get('/files/:name', (req, res) => {
-  res.sendFile(req.params.name, { hidden: true, from: '/uploads' });
+  res.sendFile(req.params.name, { dotfiles: 'allow', root: '/uploads' });
 });
```

Hidden directory တစ်ခု ပါဝင်တဲ့ absolute path တစ်ခုကို serve လုပ်နေရင် — `dotfiles: 'allow'` နဲ့ opt in လုပ်ပါ (သို့) hidden အပိုင်းက ဆန်းစစ်တဲ့ path ထဲ မပါအောင် `root` ကို သုံးပါ:

```diff
 app.get('/build', (req, res) => {
-  res.sendFile('/var/www/app/.cache/index.html');
+  res.sendFile('/var/www/app/.cache/index.html', { dotfiles: 'allow' });
+  // or: res.sendFile('index.html', { root: '/var/www/app/.cache' });
 });
```

### express.static() Options တွေ (express.static() Options)

`express.static()` ရဲ့ `hidden` နဲ့ `from` options တွေကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား `dotfiles` နဲ့ `root` ကို သုံးပါ။ `from` က API မှာ တစ်ခါမှ မှတ်တမ်း မတင်ခဲ့ပေမယ့် `root` ရဲ့ alias အနေနဲ့ လက်ခံခဲ့တာ သတိပြုပါ။ `dotfiles` ရဲ့ default တန်ဖိုးက အခု `"ignore"` ဖြစ်ပါတယ်။

`dotfiles` စစ်ဆေးမှုက အခု request path ထဲက hidden **directories** တွေကိုပါ သက်ရောက်ပါတယ် — hidden files တွေတင်မကပါဘူး။ Express 4 မှာ default အနေနဲ့ serve လုပ်ပေးခဲ့တဲ့ `GET /.well-known/acme-challenge/...` လို request က — `dotfiles: 'allow'` သတ်မှတ်မပေးရင် အခု `404` ပြန်ပါတယ်။ ဒါက configure လုပ်ထားတဲ့ `root` နဲ့ နှိုင်းယှဉ်တဲ့ path ရဲ့ အပိုင်းကိုပဲ သက်ရောက်ပြီး — `root` ကိုယ်တိုင်ထဲက hidden directory တစ်ခုကို ထိခိုက်မှာ မဟုတ်ပါဘူး။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/static-dotfiles
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
 const express = require('express');
 const app = express();

-app.use(express.static('public', { hidden: true }));
+app.use(express.static('public', { dotfiles: 'allow' }));
```

`.well-known` လို hidden directory တစ်ခုကို serve လုပ်တာပေါ် မှီခိုနေရင် (ဥပမာ — ACME/Let's Encrypt challenges) — ရှင်းရှင်းလင်းလင်း opt in လုပ်ပါ။ `hidden` option ကို တစ်ခါမှ မသုံးဖူးရင်တောင် ဒါ လိုအပ်ပါတယ်:

```diff
-app.use(express.static('public'));
+app.use(express.static('public', { dotfiles: 'allow' }));
```

### router.param(fn)

`router.param(fn)` signature က `router.param(name, fn)` function ရဲ့ အပြုအမူကို ပြုပြင်ဖို့ သုံးခဲ့တာပါ — v4.11.0 ကတည်းက deprecated ဖြစ်ခဲ့ပြီး Express 5 မှာတော့ လုံးဝ မထောက်ပံ့တော့ပါဘူး။

### express.static.mime

Express 5 မှာ `mime` က `static` field ရဲ့ exported property တစ်ခု မဟုတ်တော့ပါဘူး — MIME type values တွေနဲ့ အလုပ်လုပ်ဖို့ [`mime-types` package](https://github.com/jshttp/mime-types) ကို သုံးပါ။

#### Update လုပ်နည်း (How to Update)

အောက်ပါ command ကို run လုပ်ခြင်းအားဖြင့် code ကို အလိုအလျောက် update လုပ်နိုင်ပါတယ်:

```bash
npx codemod@latest @expressjs/static-mime
```

ဒါမှမဟုတ် code ကို ကိုယ်တိုင် update လုပ်နိုင်ပါတယ်:

```diff
-express.static.mime.lookup('json');
+const mime = require('mime-types');
+mime.lookup('json');
```

### MIME Types တွေ ပြောင်းလဲခြင်း (MIME Type Changes)

[`mime-db`](https://github.com/jshttp/mime-db) ထဲက updates တွေကြောင့် MIME types အတော်များများ ပြောင်းလဲသွားပါတယ် — ဒီပြောင်းလဲမှုတွေက `express.static()` နဲ့ `res.sendFile()` ကိုပဲ သက်ရောက်ပါတယ်။ ပြောင်းလဲချက်တွေရဲ့ စာရင်း အပြည့်အစုံအတွက် [`mime-db` changelog](https://github.com/jshttp/mime-db/blob/HEAD/HISTORY.md) ကို ကြည့်ပါ။

Express 4 က `mime-db` version **1.52.0** ကို သုံးပြီး — Express 5 က IANA နဲ့ တခြား MIME type specifications တွေရဲ့ updates တွေကို ထင်ဟပ်တဲ့ version အသစ်တွေကို သုံးပါတယ်။ အထင်ရှားဆုံး ပြောင်းလဲမှုက — JavaScript files (`.js`) တွေကို `application/javascript` အစား `text/javascript` အနေနဲ့ serve လုပ်တော့တာပါ။

Express 5 မှာ `mime-db` updates တွေကြောင့် ဖြစ်လာတဲ့ MIME types တွေရဲ့ ပြောင်းလဲမှုတွေကို breaking changes အဖြစ် မသတ်မှတ်ပါဘူး — minor (သို့) patch versions တွေကြားမှာတောင် MIME types တွေ ပြောင်းလဲနိုင်လို့ — dependencies တွေကို update လုပ်တဲ့အခါ သတိထားပါ။

### express:router Debug Logs

Router ကိုင်တွယ်မှု logic ကို အခု Express team က ထိန်းသိမ်းထားတဲ့ သီးခြား dependency ([`router`](https://github.com/pillarjs/router)) တစ်ခုက လုပ်ဆောင်လို့ — debug logs တွေက namespace တစ်ခုခြား ပြောင်းသွားပါတယ်။ Express 5.1 မတိုင်ခင်က ဒီ debug logs တွေ မရှိခဲ့ပါဘူး — အဲဒါတွေရဖို့ Express 5 version အသစ်တစ်ခုဆီ update လုပ်ပါ (သို့) `package-lock.json` ထဲက `router` package ကို update လုပ်ပါ:

| v4 | v5 |
| --- | --- |
| `express:router` | `router` |
| `express:router:layer` | `router:layer` |
| `express:router:route` | `router:route` |
| `express:*` (includes all) | `express:*` + `router` + `router:*` |

#### Update လုပ်နည်း (How to Update)

```diff
-DEBUG=express:* node index.js
+DEBUG=express:*,router,router:* node index.js
```

## Changed (အပြုအမူ ပြောင်းလဲသွားသော API များ)

ဒီ APIs တွေက ဆက်ရှိနေဆဲပါ — ဒါပေမယ့် သူတို့ရဲ့ အပြုအမူတွေ ပြောင်းလဲသွားပါတယ်။ App က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေဖို့ ဒီပြောင်းလဲချက်တွေကို ပြန်လည်စစ်ဆေးပါ။

### Path Route Matching Syntax (Path String ကိုက်ညီမှု Syntax)

Path route matching syntax ဆိုတာ — `app.all()`, `app.use()`, `app.METHOD()`, `router.all()`, `router.METHOD()` နဲ့ `router.use()` APIs တွေရဲ့ ပထမ parameter အဖြစ် string တစ်ခုကို ပေးလိုက်တာပါ။ Path string ကို incoming request တစ်ခုနဲ့ ကိုက်ညီအောင် စစ်ဆေးတဲ့ နေရာမှာ အောက်ပါ ပြောင်းလဲချက်တွေ လုပ်ထားပါတယ်:

- Wildcard `*` က parameter `:` တွေရဲ့ အပြုအမူအတိုင်း — **name ရှိရပါမယ်**၊ `/*` အစား `/*splat` ကို သုံးပါ

```diff
-app.get('/*', async (req, res) => {
+app.get('/*splat', async (req, res) => {
   res.send('ok');
 });
```

> **မှတ်ချက်:** `*splat` က root path ကလွဲပြီး ဘယ် path ကိုမဆို match လုပ်ပါတယ်။ Root path `/` ကိုပါ match လုပ်ချင်ရင် — wildcard ကို braces တွေနဲ့ ပတ်ပြီး `/{*splat}` လို့ သုံးနိုင်ပါတယ်။
>
> ```js
> app.get('/{*splat}', async (req, res) => {
>   res.send('ok');
> });
> ```

- Optional character `?` ကို မထောက်ပံ့တော့ပါဘူး — အဲဒီအစား braces တွေကို သုံးပါ

```diff
-app.get('/:file.:ext?', async (req, res) => {
+app.get('/:file{.:ext}', async (req, res) => {
   res.send('ok');
 });
```

- Regexp characters တွေကို မထောက်ပံ့ပါဘူး။ ဥပမာ:

```diff
-app.get('/[discussion|page]/:slug', async (req, res) => {
+app.get(['/discussion/:slug', '/page/:slug'], async (req, res) => {
   res.status(200).send('ok');
 });
```

- Upgrade လုပ်နေစဉ် ရှုပ်ထွေးမှု မဖြစ်အောင် character တချို့ကို reserved လုပ်ထားပါတယ် — `()[]?+!`၊ အဲဒါတွေကို သုံးချင်ရင် `\` နဲ့ escape လုပ်ပါ။
- Parameter names တွေက အခု valid JavaScript identifiers တွေကို ထောက်ပံ့ပါတယ် — (သို့) `:"this"` လို quote လုပ်ပြီးလည်း ရေးလို့ရပါတယ်။

### Middleware နဲ့ Handlers တွေကနေ ထွက်တဲ့ Rejected Promises တွေကို ကိုင်တွယ်ခြင်း

Request middleware နဲ့ handlers တွေက reject ဖြစ်တဲ့ promises တွေ return လုပ်ရင် — အခုအခါ reject ဖြစ်တဲ့ value ကို `Error` တစ်ခုအနေနဲ့ error-handling middleware ဆီ ပို့ပေးပြီး ကိုင်တွယ်ပါတယ်။ ဆိုလိုတာက — `async` functions တွေကို middleware နဲ့ handlers တွေအနေနဲ့ သုံးတာ အရင်ကထက် ပိုလွယ်ကူပါတယ်။ `async` function တစ်ခုထဲမှာ error တစ်ခု throw လုပ်တာ (သို့) async function ထဲမှာ `await` လုပ်ထားတဲ့ promise တစ်ခု reject ဖြစ်တာမျိုး ဖြစ်ရင် — အဲဒီ errors တွေကို `next(err)` လို့ ခေါ်လိုက်သလိုပဲ error handler ဆီ ပို့ပေးပါတယ်။

Express က errors တွေကို ဘယ်လို ကိုင်တွယ်လဲဆိုတဲ့ အသေးစိတ်ကို [error handling documentation](/docs/express/error-handling) မှာ ဖော်ပြထားပါတယ်။

#### Update လုပ်နည်း (How to Update)

အခုဆိုရင် errors တွေကို ကိုယ်တိုင် ဖမ်းစရာ မလိုဘဲ `async/await` ကို တိုက်ရိုက် သုံးလို့ရပါတယ် — `getUserById` က error throw လုပ်တာ (သို့) reject ဖြစ်ရင် — `next` ကို reject ဖြစ်တဲ့ value နဲ့အတူ အလိုအလျောက် ခေါ်ပေးပါလိမ့်မယ်။

```diff
-app.get('/user/:id', (req, res, next) => {
-  getUserById(req.params.id)
-    .then((user) => res.send(user))
-    .catch(next);
-});
+app.get('/user/:id', async (req, res) => {
+  const user = await getUserById(req.params.id);
+  res.send(user);
+});
```

### express.urlencoded

`express.urlencoded` method က `extended` option ကို default အနေနဲ့ `false` ဖြစ်စေပါတယ်။

#### Update လုပ်နည်း (How to Update)

Application က `extended` ရဲ့ အပြုအမူပေါ် မှီခိုနေရင် — `true` လို့ ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပေးပါ:

```diff
-app.use(express.urlencoded());
+app.use(express.urlencoded({ extended: true }));
```

### express.static ရဲ့ dotfiles Option

`express.static` middleware ရဲ့ `dotfiles` option က အခု default အနေနဲ့ `"ignore"` ဖြစ်ပါတယ် — Express 4 မှာတော့ dotfiles တွေကို default အနေနဲ့ serve လုပ်ပေးခဲ့ပါတယ်။ ဒါကြောင့် `.well-known` လို dot (`.`) နဲ့ စတင်တဲ့ directory တစ်ခုထဲက files တွေကို ဆက်လက်သုံးလို့ မရတော့ဘဲ **404 Not Found** error ပြန်ပါလိမ့်မယ် — Android App Links နဲ့ Apple Universal Links လို dot-directories တွေကို serve လုပ်တာပေါ် မှီခိုနေတဲ့ လုပ်ဆောင်ချက်တွေ ပျက်သွားစေနိုင်ပါတယ်။

#### Update လုပ်နည်း (How to Update)

`dotfiles: "allow"` option ကို သုံးပြီး လိုအပ်တဲ့ dot-directories တွေကိုပဲ ရှင်းရှင်းလင်းလင်း serve လုပ်ပါ — ဒါက တခြား dotfiles တွေအတွက် default ရဲ့ လုံခြုံတဲ့ အပြုအမူကို ထိန်းထားရင်း — ရည်ရွယ်ထားတဲ့ dot-directories တွေကိုပဲ လုံခြုံစွာ serve လုပ်နိုင်စေပါတယ်။

```diff
+app.use('/.well-known', express.static('public/.well-known', { dotfiles: 'allow' }));
 app.use(express.static('public'));
```

### router.param() မှာ Name Array တွေ မရတော့ခြင်း

`router.param(name, fn)` က `name` အတွက် array တစ်ခုကို လက်မခံတော့ပါဘူး — Express 4 မှာ array တစ်ခုကို တိတ်တဆိတ် လက်ခံခဲ့ပေမယ့် Express 5 မှာတော့ string မဟုတ်တဲ့ ဘာကိုမဆို ပေးလိုက်ရင် `TypeError: argument name must be a string` ဆိုပြီး throw လုပ်ပါတယ်။ (`app.param()` ကတော့ name array တွေကို ဆက်လက်ခံပါသေးတယ် ဆိုတာ သတိပြုပါ။)

#### Update လုပ်နည်း (How to Update)

Parameter name တစ်ခုစီကို ကိုယ်ပိုင် `router.param()` call တစ်ခုစီနဲ့ register လုပ်ပါ:

```diff
-router.param(['id', 'page'], (req, res, next, value) => {
-  // ...
-});
+const loadParam = (req, res, next, value) => {
+  // ...
+};
+router.param('id', loadParam);
+router.param('page', loadParam);
```

### app.listen

Express 5 မှာ `app.listen` method က server က error event တစ်ခု လက်ခံရရှိတဲ့အခါ — user က ပေးထားတဲ့ callback function (ပေးထားရင်) ကို ခေါ်ပေးပါတယ်။ Express 4 မှာတော့ အဲဒီလို errors တွေကို throw လုပ်ပါတယ်။ ဒီပြောင်းလဲမှုက Express 5 မှာ error-handling တာဝန်ကို callback function ဆီ ရွှေ့ပေးလိုက်တာပါ — error ရှိရင် အဲဒါကို argument အနေနဲ့ callback ဆီ ပေးပို့ပါတယ်။ ဥပမာ:

```js
const server = app.listen(8080, '0.0.0.0', (error) => {
  if (error) {
    throw error; // e.g. EADDRINUSE
  }
  console.log(`Listening on ${JSON.stringify(server.address())}`);
});
```

### app.router

Express 4 မှာ ဖယ်ရှားခဲ့တဲ့ `app.router` object က Express 5 မှာ ပြန်လည် ရောက်ရှိလာပါတယ် — version အသစ်မှာ ဒီ object က base Express router ကို ရည်ညွှန်းတဲ့ reference တစ်ခုပဲ ဖြစ်ပြီး — Express 3 မှာလို app တစ်ခုက အဲဒါကို ရှင်းရှင်းလင်းလင်း load လုပ်စရာ မလိုတော့ပါဘူး။

### req.body

`req.body` property က body ကို parse မလုပ်ရသေးတဲ့အခါ `undefined` ကို ပြန်ပေးပါတယ် — Express 4 မှာတော့ default အနေနဲ့ `{}` ကို ပြန်ပေးပါတယ်။

```js
app.post('/user', (req, res) => {
  console.dir(req.body);
  // Express 4
  // => {}
  // Express 5
  // => undefined
});
```

### req.host

Express 4 မှာ `req.host` function က port number ပါလာရင် အဲဒါကို မှားယွင်းစွာ ဖယ်ရှားပစ်ခဲ့ပါတယ် — Express 5 မှာတော့ port number ကို ထိန်းသိမ်းထားပါတယ်။

### req.params

`req.params` object က string paths တွေကို သုံးတဲ့အခါ **null prototype** ရှိပါတယ် — ဒါပေမယ့် path ကို regular expression နဲ့ သတ်မှတ်ထားရင် `req.params` က normal prototype ရှိတဲ့ standard object တစ်ခုအနေနဲ့ပဲ ကျန်ရှိနေပါတယ်။ နောက်ပြီး အရေးကြီးတဲ့ အပြုအမူ ပြောင်းလဲချက် နှစ်ခု ရှိပါသေးတယ်:

**Wildcard parameters တွေက အခု arrays တွေ ဖြစ်နေပါတယ်:**

Wildcards တွေ (ဥပမာ — `/*splat`) က path segments တွေကို single string တစ်ခုအစား array တစ်ခုအနေနဲ့ ဖမ်းယူပါတယ်။

```js
app.get('/*splat', (req, res) => {
  // GET /foo/bar
  console.dir(req.params);
  // => [Object: null prototype] { splat: [ 'foo', 'bar' ] }
});
```

**Match မဖြစ်တော့တဲ့ parameters တွေကို ချန်လှပ်လိုက်ပါတယ်:**

Express 4 မှာ match မဖြစ်တဲ့ wildcards တွေက empty strings (`''`) တွေ ဖြစ်ပြီး — (`?` သုံးထားတဲ့) optional `:` parameters တွေက value `undefined` ရှိတဲ့ key တစ်ခု ဖြစ်ခဲ့ပါတယ်။ Express 5 မှာတော့ match မဖြစ်တဲ့ parameters တွေကို `req.params` ထဲကနေ လုံးဝ ချန်လှပ်လိုက်ပါတယ်။

```diff
-// v4: unmatched wildcard is empty string
-app.get('/*', (req, res) => {
-  // GET /
-  console.dir(req.params);
-  // => { '0': '' }
-});
-
-// v4: unmatched optional param is undefined
-app.get('/:file.:ext?', (req, res) => {
-  // GET /image
-  console.dir(req.params);
-  // => { file: 'image', ext: undefined }
-});
-
+// v5: unmatched optional param is omitted
+app.get('/:file{.:ext}', (req, res) => {
+  // GET /image
+  console.dir(req.params);
+  // => [Object: null prototype] { file: 'image' }
+});
```

### req.query

`req.query` property က writable property တစ်ခု မဟုတ်တော့ဘဲ — getter တစ်ခု ဖြစ်သွားပါတယ်။ Default query parser ကိုလည်း "extended" ကနေ "simple" အဖြစ် ပြောင်းလိုက်ပါတယ်။

```js
app.get('/search', (req, res) => {
  // This is no longer possible in Express 5
  req.query.page = 1;
});
```

### res.clearCookie

`res.clearCookie` method က user က ပေးလိုက်တဲ့ `maxAge` နဲ့ `expires` options တွေကို ignore လုပ်ပါတယ်။

```diff
 app.get('/logout', (req, res) => {
-  res.clearCookie('session', { maxAge: 0, expires: new Date(0) });
+  res.clearCookie('session');
 });
```

### res.status

`res.status` method က Node.js က သတ်မှတ်ထားတဲ့ အပြုအမူအတိုင်း — `100` ကနေ `999` အတွင်းက integers တွေကိုပဲ လက်ခံပြီး status code က integer မဟုတ်ရင် error တစ်ခု ပြန်ပေးပါတယ်။

```js
app.get('/user', (req, res) => {
  res.status(99); // Throws an error
  res.status(200); // OK
});
```

### res.vary

`res.vary` က `field` argument မပါဘဲ သုံးရင် error တစ်ခု throw လုပ်ပါတယ် — Express 4 မှာတော့ argument ကို ချန်လိုက်ရင် console မှာ warning တစ်ခုပဲ ပေးခဲ့ပါတယ်။

```js
app.get('/user', (req, res) => {
  res.vary(); // Throws an error
  res.vary('Accept'); // OK
});
```

## တိုးတက်မှုများ (Improvements)

ဒီပြောင်းလဲချက်တွေက migration လုပ်ဖို့ ဘယ် step မှ မလိုအပ်ပေမယ့် — upgrade လုပ်တဲ့အခါ သိထားသင့်ပါတယ်။

### res.render()

ဒီ method က အခု view engines အားလုံးအတွက် asynchronous behavior ကို အတင်းအကျပ် ကျင့်သုံးပါတယ် — synchronous implementation ရှိခဲ့ပြီး အကြံပြုထားတဲ့ interface ကို ချိုးဖောက်ခဲ့တဲ့ view engines တွေကြောင့် ဖြစ်တတ်တဲ့ bugs တွေကို ရှောင်ရှားပေးပါတယ်။

### Brotli Encoding ထောက်ပံ့မှု

`express.json()`, `express.urlencoded()`, `express.text()`, `express.raw()` လို middlewares တွေက အခု `gzip` နဲ့ `deflate` တွေအပြင် — incoming request bodies တွေအတွက် Brotli (`Content-Encoding: br`) decompression ကိုပါ ထောက်ပံ့ပေးပါတယ်။
