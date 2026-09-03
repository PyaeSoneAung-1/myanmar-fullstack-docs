---
title: "Express 4 သို့ ပြောင်းရွှေ့ခြင်း (Moving to Express 4)"
description: "Express 3 app တွေကို Express 4 ဆီ ပြောင်းရွှေ့နည်း — Express core နဲ့ middleware စနစ် ပြောင်းလဲမှု၊ routing စနစ် အသစ် (app.route() နဲ့ express.Router)၊ app တစ်ခုလုံးနဲ့ app generator ကို အဆင့်မြှင့်တင်တဲ့ ဥပမာ အပြည့်အစုံ"
order: 29
source: "https://expressjs.com/en/guide/migrating-4.html"
status: translated
updated: 2026-09-03
---

Express 4 က Express 3 ကနေ **breaking change** (အရင် code တွေနဲ့ ဆက်တိုက် အလုပ်မလုပ်တော့တဲ့ ပြောင်းလဲမှု) တစ်ခုပါ။ ဆိုလိုတာက — Express 3 app တစ်ခုရဲ့ dependencies ထဲက Express version ကို update လုပ်လိုက်ရင် အဲဒီ app က **အလုပ်လုပ်တော့မှာ မဟုတ်ပါဘူး**။

ဒီ article မှာ အောက်ပါတွေကို ဖော်ပြပါတယ်:

- Express 4 မှာ ပြောင်းလဲသွားတဲ့ အချက်တွေ
- Express 3 app တစ်ခုကို Express 4 ဆီ ပြောင်းရွှေ့တဲ့ ဥပမာတစ်ခု
- Express 4 app generator ကို အဆင့်မြှင့်တင်ခြင်း

## Express 4 မှာ ပြောင်းလဲချက်များ (Changes in Express 4)

Express 4 မှာ သိသာထင်ရှားတဲ့ ပြောင်းလဲချက် အတော်များများ ရှိပါတယ်:

- Express core နဲ့ middleware စနစ်ရဲ့ ပြောင်းလဲချက်များ — Connect နဲ့ built-in middleware တွေအပေါ် မှီခိုမှုတွေကို ဖယ်ရှားလိုက်လို့ middleware တွေကို ကိုယ်တိုင် ထည့်ပေးရပါတယ်။
- Routing စနစ်ရဲ့ ပြောင်းလဲချက်များ
- အခြား ပြောင်းလဲချက် အမျိုးမျိုး

ဆက်စပ်ကြည့်ရှုရန်:

- [New features in 4.x.](https://github.com/expressjs/express/wiki/New-features-in-4.x)
- [Migrating from 3.x to 4.x.](https://github.com/expressjs/express/wiki/Migrating-from-3.x-to-4.x)

### Express Core နဲ့ Middleware စနစ် ပြောင်းလဲချက်များ

Express 4 က Connect ကို မှီခိုတော့မှာ မဟုတ်ဘဲ — `express.static` function ကလွဲပြီး built-in middleware အားလုံးကို core ကနေ ဖယ်ရှားလိုက်ပါတယ်။ ဆိုလိုတာက — Express က အခု routing နဲ့ middleware အတွက် သီးခြား ရပ်တည်နိုင်တဲ့ web framework တစ်ခု ဖြစ်သွားပြီး — Express ရဲ့ version တွေနဲ့ release တွေကို middleware updates တွေက သက်ရောက်မှု မရှိတော့ပါဘူး။

Built-in middleware မရှိတော့တာမို့ — app ကို run လုပ်ဖို့ လိုအပ်တဲ့ middleware အားလုံးကို ကိုယ်တိုင် ထည့်သွင်းပေးရပါတယ်။ အောက်ပါ အဆင့်တွေအတိုင်း လုပ်ပါ:

1. Module ကို install လုပ်ပါ: `npm install --save <module-name>`
2. App ထဲမှာ module ကို require လုပ်ပါ: `require('module-name')`
3. Module ရဲ့ documentation အတိုင်း သုံးပါ: `app.use( ... )`

အောက်ပါ table က Express 3 ရဲ့ middleware တွေနဲ့ Express 4 မှာ သူတို့ရဲ့ အစားထိုးတွေကို ဖော်ပြပါတယ်:

| Express 3 | Express 4 |
| --- | --- |
| `express.bodyParser` | [body-parser](https://github.com/expressjs/body-parser) + [multer](https://github.com/expressjs/multer) |
| `express.compress` | [compression](https://github.com/expressjs/compression) |
| `express.cookieSession` | [cookie-session](https://github.com/expressjs/cookie-session) |
| `express.cookieParser` | [cookie-parser](https://github.com/expressjs/cookie-parser) |
| `express.logger` | [morgan](https://github.com/expressjs/morgan) |
| `express.session` | [express-session](https://github.com/expressjs/session) |
| `express.favicon` | [serve-favicon](https://github.com/expressjs/serve-favicon) |
| `express.responseTime` | [response-time](https://github.com/expressjs/response-time) |
| `express.errorHandler` | [errorhandler](https://github.com/expressjs/errorhandler) |
| `express.methodOverride` | [method-override](https://github.com/expressjs/method-override) |
| `express.timeout` | [connect-timeout](https://github.com/expressjs/timeout) |
| `express.vhost` | [vhost](https://github.com/expressjs/vhost) |
| `express.csrf` | [csurf](https://github.com/expressjs/csurf) |
| `express.directory` | [serve-index](https://github.com/expressjs/serve-index) |
| `express.static` | [serve-static](https://github.com/expressjs/serve-static) |

ဒီမှာ Express 4 middleware တွေရဲ့ [စာရင်း အပြည့်အစုံ](https://github.com/senchalabs/connect#middleware) ပါ။

အများစုမှာ Express 3 ရဲ့ middleware အဟောင်းကို Express 4 ရဲ့ အစားထိုး middleware နဲ့ အစားထိုးလိုက်ရုံပါပဲ။ အသေးစိတ်အတွက် GitHub ပေါ်က module documentation တွေကို ကြည့်ပါ။

#### `app.use` က Parameters တွေကို လက်ခံနိုင်လာခြင်း

Version 4 မှာ middleware functions တွေကို load လုပ်မယ့် path ကို သတ်မှတ်ဖို့ variable parameter တစ်ခုကို သုံးနိုင်ပြီး — ပြီးရင် အဲဒီ parameter ရဲ့ တန်ဖိုးကို route handler ကနေ ဖတ်လို့ရပါတယ်။ ဥပမာ:

```js
app.use('/book/:id', (req, res, next) => {
  console.log('ID:', req.params.id);
  next();
});
```

### Routing စနစ်

Apps တွေက အခုအခါ routing middleware ကို **implicitly (အလိုအလျောက်)** load လုပ်ပါတယ် — ဒါကြောင့် `router` middleware နဲ့ ပတ်သက်ပြီး middleware တွေကို ဘယ်အစဉ်လိုက် load လုပ်ရမလဲဆိုတာ စိုးရိမ်စရာ မလိုတော့ပါဘူး။

Route တွေကို သတ်မှတ်တဲ့ နည်းလမ်းကတော့ မပြောင်းလဲပါဘူး — ဒါပေမယ့် routing စနစ်မှာ routes တွေကို စုစည်းဖို့ ကူညီတဲ့ feature အသစ် နှစ်ခု ပါလာပါတယ်:

- Method အသစ်တစ်ခုဖြစ်တဲ့ `app.route()` — route path တစ်ခုအတွက် chain လုပ်လို့ရတဲ့ route handlers တွေကို ဖန်တီးပေးပါတယ်။
- Class အသစ်တစ်ခုဖြစ်တဲ့ `express.Router` — modular ဖြစ်ပြီး mount လုပ်လို့ရတဲ့ route handlers တွေကို ဖန်တီးပေးပါတယ်။

#### `app.route()` Method

`app.route()` method အသစ်က route path တစ်ခုအတွက် chain လုပ်လို့ရတဲ့ route handlers တွေကို ဖန်တီးပေးနိုင်ပါတယ်။ Path ကို နေရာတစ်ခုတည်းမှာ သတ်မှတ်လို့ရတာမို့ — modular routes တွေ ဖန်တီးရတာ လွယ်ကူစေပြီး redundancy တွေနဲ့ စာလုံးပေါင်းအမှား (typo) တွေကိုလည်း လျှော့ချပေးပါတယ်။ Route တွေအကြောင်း ပိုသိချင်ရင် [`Router()` documentation](https://expressjs.com/en/4x/api.html#router) ကို ကြည့်ပါ။

ဒီမှာ `app.route()` function ကို သုံးပြီး သတ်မှတ်ထားတဲ့ chained route handlers တွေရဲ့ ဥပမာပါ:

```js
app
  .route('/book')
  .get((req, res) => {
    res.send('Get a random book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update the book');
  });
```

#### `express.Router` Class

Routes တွေကို စုစည်းဖို့ ကူညီတဲ့ နောက် feature တစ်ခုက class အသစ် `express.Router` ပါ — modular ဖြစ်ပြီး mount လုပ်လို့ရတဲ့ route handlers တွေ ဖန်တီးဖို့ သုံးပါတယ်။ `Router` instance တစ်ခုက middleware ရော routing စနစ်ရော အပြည့်အစုံ ပါဝင်တာမို့ — ဒါကြောင့် "mini-app" လို့ မကြာခဏ ရည်ညွှန်းခေါ်ဆိုလေ့ ရှိပါတယ်။

အောက်ပါ ဥပမာက — router တစ်ခုကို module တစ်ခုအနေနဲ့ ဖန်တီး၊ အဲဒီထဲမှာ middleware တွေ load လုပ်၊ routes တချို့ သတ်မှတ်ပြီး — main app ရဲ့ path တစ်ခုပေါ်မှာ mount လုပ်ထားတာကို ပြပါတယ်။

ဥပမာ — app directory ထဲမှာ `birds.js` ဆိုတဲ့ router file တစ်ခုကို အောက်ပါ အကြောင်းအရာတွေနဲ့ ဖန်တီးပါ:

```cjs title="birds.cjs"
var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page');
});
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;
```

```mjs title="birds.mjs"
import express from 'express';

const router = express.Router();

// middleware specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page');
});
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

export default router;
```

ပြီးရင် app ထဲမှာ router module ကို load လုပ်ပါ:

```cjs title="index.cjs"
var birds = require('./birds');

// ...

app.use('/birds', birds);
```

```mjs title="index.mjs"
import birds from './birds';

// ...

app.use('/birds', birds);
```

အခုဆိုရင် app က `/birds` နဲ့ `/birds/about` paths တွေဆီက requests တွေကို ကိုင်တွယ်နိုင်ပြီး — route အတွက် သီးသန့်ဖြစ်တဲ့ `timeLog` middleware ကို ခေါ်ပေးပါလိမ့်မယ်။

### အခြား ပြောင်းလဲချက်များ (Other Changes)

အောက်ပါ table က Express 4 မှာ ပြောင်းလဲသွားတဲ့ တခြား အသေးစား ဒါပေမယ့် အရေးကြီးတဲ့ ပြောင်းလဲချက်တချို့ကို ဖော်ပြပါတယ်:

| Object | ဖော်ပြချက် |
| --- | --- |
| Node.js | Express 4 က Node.js 0.10.x (သို့) ဒီထက် နောက်ပိုင်း လိုအပ်ပြီး Node.js 0.8.x အတွက် ထောက်ပံ့မှုကို ရပ်ဆိုင်းလိုက်ပါတယ်။ |
| `http.createServer()` | `http` module ကို တိုက်ရိုက် သုံးစရာ မလိုတော့ပါဘူး — (socket.io/SPDY/HTTPS လိုမျိုး) သူနဲ့ တိုက်ရိုက် အလုပ်လုပ်ဖို့ လိုမှသာ သုံးပါ။ App ကို `app.listen()` function နဲ့ စတင်လို့ရပါတယ်။ |
| `app.configure()` | `app.configure()` function ကို ဖယ်ရှားလိုက်ပါပြီ — environment ကို သိဖို့နဲ့ app ကို အဲဒီအတိုင်း configure လုပ်ဖို့ `process.env.NODE_ENV` (သို့) `app.get('env')` function ကို သုံးပါ။ |
| `json spaces` | `json spaces` application property ကို Express 4 မှာ default အနေနဲ့ disable လုပ်ထားပါတယ်။ |
| `req.accepted()` | `req.accepts()`, `req.acceptsEncodings()`, `req.acceptsCharsets()` နဲ့ `req.acceptsLanguages()` တွေကို သုံးပါ။ |
| `res.location()` | Relative URLs တွေကို resolve လုပ်ပေးတော့မှာ မဟုတ်ပါဘူး။ |
| `req.params` | အရင်က array တစ်ခု ဖြစ်ခဲ့ပြီး — အခု object တစ်ခု ဖြစ်ပါတယ်။ |
| `res.locals` | အရင်က function တစ်ခု ဖြစ်ခဲ့ပြီး — အခု object တစ်ခု ဖြစ်ပါတယ်။ |
| `res.headerSent` | `res.headersSent` အဖြစ် ပြောင်းလဲသွားပါတယ်။ |
| `app.route` | အခု `app.mountpath` အနေနဲ့ ရနိုင်ပါတယ်။ |
| `res.on('header')` | ဖယ်ရှားလိုက်ပါပြီ။ |
| `res.charset` | ဖယ်ရှားလိုက်ပါပြီ။ |
| `res.setHeader('Set-Cookie', val)` | လုပ်ဆောင်ချက်က အခု အခြေခံ cookie တန်ဖိုး သတ်မှတ်ခြင်းကိုပဲ ကန့်သတ်ထားပါတယ် — အပိုလုပ်ဆောင်ချက်တွေအတွက် `res.cookie()` ကို သုံးပါ။ |

## App Migration ဥပမာ (Example App Migration)

ဒီမှာ Express 3 application တစ်ခုကို Express 4 ဆီ ပြောင်းရွှေ့တဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ် — သက်ဆိုင်ရာ file တွေကတော့ `app.js` နဲ့ `package.json` ပါ။

### Version 3 App

#### `app.js`

အောက်ပါ `app.js` file ပါတဲ့ Express v.3 application တစ်ခုကို စဉ်းစားကြည့်ပါ:

```cjs title="index.cjs"
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
```

```mjs title="index.mjs"
import express from 'express';
import routes from './routes';
import user from './routes/user';
import http from 'http';
import path from 'path';

const app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
```

#### `package.json`

အဲဒီ version 3 နဲ့ တွဲပါတဲ့ `package.json` file က ဒီလိုမျိုး ဖြစ်နေပါလိမ့်မယ်:

```json
{
  "name": "application-name",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "3.12.0",
    "pug": "*"
  }
}
```

### ပြောင်းရွှေ့ခြင်း လုပ်ငန်းစဉ် (Process)

အောက်ပါ command နဲ့ Express 4 app အတွက် လိုအပ်တဲ့ middleware တွေကို install လုပ်ပြီး — Express နဲ့ Pug ကို သူတို့ရဲ့ သက်ဆိုင်ရာ နောက်ဆုံး version တွေဆီ update လုပ်ခြင်းအားဖြင့် ပြောင်းရွှေ့ခြင်း လုပ်ငန်းစဉ်ကို စတင်ပါ:

```bash
npm install serve-favicon morgan method-override express-session body-parser multer errorhandler express@latest pug@latest --save
```

`app.js` မှာ အောက်ပါ ပြောင်းလဲချက်တွေကို လုပ်ပါ:

1. Built-in Express middleware functions တွေဖြစ်တဲ့ `express.favicon`, `express.logger`, `express.methodOverride`, `express.session`, `express.bodyParser` နဲ့ `express.errorHandler` တွေက `express` object ပေါ်မှာ မရှိတော့ပါဘူး — သူတို့ရဲ့ အစားထိုး module တွေကို ကိုယ်တိုင် install ပြီး app ထဲမှာ load လုပ်ရပါမယ်။

2. `app.router` function ကို load လုပ်စရာ မလိုတော့ပါဘူး — အဲဒါက Express 4 app object အတွက် valid မဟုတ်တော့လို့ `app.use(app.router);` ဆိုတဲ့ code ကို ဖယ်ရှားပါ။

3. Middleware functions တွေကို မှန်ကန်တဲ့ အစဉ်လိုက် load လုပ်ဖို့ သေချာပါစေ — `errorHandler` ကို app routes တွေ load ပြီးမှ ထည့်ပါ။

### Version 4 App

#### `package.json`

အထက်က `npm` command ကို run လိုက်တဲ့အခါ `package.json` က အောက်ပါအတိုင်း update ဖြစ်သွားပါလိမ့်မယ်:

```json
{
  "name": "application-name",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "body-parser": "^1.5.2",
    "errorhandler": "^1.1.1",
    "express": "^4.8.0",
    "express-session": "^1.7.2",
    "pug": "^2.0.0",
    "method-override": "^2.1.2",
    "morgan": "^1.2.2",
    "multer": "^0.1.3",
    "serve-favicon": "^2.0.1"
  }
}
```

#### `app.js`

ပြီးရင် invalid code တွေကို ဖယ်ရှားပြီး လိုအပ်တဲ့ middleware တွေကို load လုပ်ကာ — လိုအပ်သလို တခြား ပြောင်းလဲချက်တွေလည်း လုပ်ပါ။ `app.js` file က ဒီလို ဖြစ်သွားပါလိမ့်မယ်:

```cjs title="index.cjs"
var http = require('http');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8',
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
```

```mjs title="index.mjs"
import http from 'http';
import express from 'express';
import routes from './routes';
import user from './routes/user';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import methodOverride from 'method-override';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';
import errorHandler from 'errorhandler';

const app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8',
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
```

> **မှတ်ချက်:** `http` module နဲ့ တိုက်ရိုက် အလုပ်လုပ်ဖို့ မလိုဘူးဆိုရင် (socket.io/SPDY/HTTPS) — အဲဒါကို load လုပ်စရာ မလိုဘဲ app ကို ဒီလိုပဲ ရိုးရိုးရှင်းရှင်း စတင်နိုင်ပါတယ်:
>
> ```js
> app.listen(app.get('port'), () => {
>   console.log('Express server listening on port ' + app.get('port'));
> });
> ```

### App ကို Run လုပ်ခြင်း (Run the App)

ပြောင်းရွှေ့ခြင်း လုပ်ငန်းစဉ်က ပြီးဆုံးသွားပါပြီ — app က အခု Express 4 app တစ်ခု ဖြစ်သွားပါပြီ။ အတည်ပြုဖို့ အောက်ပါ command နဲ့ app ကို စတင်ပါ:

```bash
$ node .
```

[http://localhost:3000](http://localhost:3000) ကို ဖွင့်ပြီး Express 4 က render လုပ်ပေးတဲ့ home page ကို ကြည့်ပါ။

## Express 4 App Generator ကို အဆင့်မြှင့်တင်ခြင်း

Express app တစ်ခုကို generate လုပ်တဲ့ command-line tool က `express` ပဲ ဖြစ်နေဆဲပါ — ဒါပေမယ့် version အသစ်ဆီ အဆင့်မြှင့်ဖို့ Express 3 app generator ကို uninstall လုပ်ပြီးမှ `express-generator` အသစ်ကို install လုပ်ရပါတယ်။

### တပ်ဆင်ခြင်း (Installing)

System ပေါ်မှာ Express 3 app generator ကို တပ်ဆင်ထားပြီးသားဆိုရင် — အရင်ဆုံး uninstall လုပ်ရပါမယ်:

```bash
npm uninstall -g express
```

File နဲ့ directory privileges တွေကို ဘယ်လို configure လုပ်ထားလဲပေါ် မူတည်ပြီး — ဒီ command ကို `sudo` နဲ့ run ဖို့ လိုနိုင်ပါတယ်။

အခု generator အသစ်ကို install လုပ်ပါ:

```bash
npm install -g express-generator
```

File နဲ့ directory privileges တွေကို ဘယ်လို configure လုပ်ထားလဲပေါ် မူတည်ပြီး — ဒီ command ကို `sudo` နဲ့ run ဖို့ လိုနိုင်ပါတယ်။

အခုဆိုရင် system ပေါ်က `express` command က Express 4 generator ဆီ update ဖြစ်သွားပါပြီ။

### App Generator ရဲ့ ပြောင်းလဲချက်များ (Changes to the App Generator)

Command options တွေနဲ့ အသုံးပြုပုံတွေက အများကြီး အတူတူပဲ ဖြစ်ပါတယ် — အောက်ပါ ခြွင်းချက်တွေကလွဲလို့:

- `--sessions` option ကို ဖယ်ရှားလိုက်ပါတယ်။
- `--jshtml` option ကို ဖယ်ရှားလိုက်ပါတယ်။
- [Hogan.js](https://twitter.github.io/hogan.js/) ကို ထောက်ပံ့ဖို့ `--hogan` option ကို ထည့်လိုက်ပါတယ်။

### ဥပမာ (Example)

Express 4 app တစ်ခု ဖန်တီးဖို့ အောက်ပါ command ကို run လုပ်ပါ:

```bash
$ express app4
```

`app4/app.js` file ရဲ့ အကြောင်းအရာတွေကို ကြည့်မယ်ဆိုရင် — app အတွက် လိုအပ်တဲ့ middleware functions တွေ အားလုံး (`express.static` ကလွဲပြီး) ကို သီးခြား module တွေအနေနဲ့ load လုပ်ထားပြီး — `router` middleware ကို app ထဲမှာ ရှင်းရှင်းလင်းလင်း load မလုပ်တော့တာကို တွေ့ရပါမယ်။

`app.js` file က အခု Node.js module တစ်ခု ဖြစ်နေတာကိုလည်း သတိထားမိပါလိမ့်မယ် — generator အဟောင်းက ထုတ်ပေးခဲ့တဲ့ standalone app နဲ့ မတူတော့ပါဘူး။

Dependencies တွေ install ပြီးရင် အောက်ပါ command နဲ့ app ကို စတင်ပါ:

```bash
$ npm start
```

`package.json` file ထဲက `npm start` script ကို ကြည့်မယ်ဆိုရင် — app ကို တကယ် စတင်ပေးတဲ့ command က `node ./bin/www` ဖြစ်ပြီး — Express 3 မှာတုန်းက `node app.js` ဖြစ်ခဲ့တာကို တွေ့ရပါမယ်။

Express 4 generator က generate လုပ်ပေးတဲ့ `app.js` file က အခု Node.js module တစ်ခု ဖြစ်နေတာမို့ — (code ကို ပြုပြင်မယ်ဆိုရင်ကလွဲလို့) app တစ်ခုအနေနဲ့ သူ့ဘာသာသူ စတင်လို့ မရတော့ပါဘူး။ အဲဒီ module ကို Node.js file တစ်ခုထဲမှာ load လုပ်ပြီး — အဲဒီ Node.js file ကနေတစ်ဆင့် စတင်ပေးရပါတယ်။ ဒီကိစ္စမှာ အဲဒီ Node.js file က `./bin/www` ပါ။

`bin` directory ရော extension မပါတဲ့ `www` file ရော — Express app တစ်ခု ဖန်တီးဖို့ (သို့) စတင်ဖို့ မဖြစ်မနေ လိုအပ်တာ မဟုတ်ပါဘူး။ အဲဒါတွေက generator ရဲ့ အကြံပြုချက်တွေပဲ ဖြစ်လို့ — ကိုယ့်လိုအပ်ချက်နဲ့ ကိုက်ညီအောင် လွတ်လပ်စွာ ပြုပြင်နိုင်ပါတယ်။

`www` directory ကို ဖယ်ရှားပြီး "Express 3 နည်းအတိုင်း" ဆက်ထားချင်ရင် — `app.js` file ရဲ့ အဆုံးမှာရှိတဲ့ `module.exports = app;` ဆိုတဲ့ line ကို ဖျက်ပြီး — သူ့နေရာမှာ အောက်ပါ code ကို ထည့်ပါ:

```js
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), () => {
  debug('Express server listening on port ' + server.address().port);
});
```

`app.js` file ရဲ့ ထိပ်မှာ အောက်ပါ code နဲ့ `debug` module ကို load လုပ်ဖို့ သေချာပါစေ:

```js
var debug = require('debug')('app4');
```

ပြီးရင် `package.json` file ထဲက `"start": "node ./bin/www"` ကို `"start": "node app.js"` အဖြစ် ပြောင်းလိုက်ပါ။

အခုဆိုရင် `./bin/www` ရဲ့ လုပ်ဆောင်ချက်တွေကို `app.js` ထဲကို ပြန်ရွှေ့လိုက်ပြီ ဖြစ်ပါတယ်။ ဒီပြောင်းလဲမှုကို အကြံပြုလို့ မရပေမယ့် — `./bin/www` file က ဘယ်လို အလုပ်လုပ်သလဲ၊ `app.js` file က ဘာကြောင့် သူ့ဘာသာသူ မစတင်တော့တာလဲဆိုတာ နားလည်ဖို့ ဒီလေ့ကျင့်ခန်းက ကူညီပေးပါတယ်။
