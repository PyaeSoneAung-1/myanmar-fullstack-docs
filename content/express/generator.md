---
title: "Express application generator"
description: "Express application generator tool ကို သုံးပြီး Express.js application တွေရဲ့ skeleton (မူကြမ်း) ကို မြန်မြန် ဖန်တီးနည်း — setup နဲ့ configuration ကို ချောမွေ့စေဖို့"
order: 11
source: "https://expressjs.com/en/starter/generator.html"
status: translated
updated: 2026-09-01
---

Application generator tool ဖြစ်တဲ့ `express-generator` ကို သုံးပြီး application skeleton တစ်ခုကို မြန်မြန် ဖန်တီးနိုင်ပါတယ်။

Application generator ကို `npx` command နဲ့ run လုပ်နိုင်ပါတယ် (Node.js 8.2.0 ကစပြီး ရနိုင်ပါတယ်):

```bash
$ npx express-generator
```

Node.js version အဟောင်းတွေအတွက်တော့ application generator ကို global npm package အနေနဲ့ install လုပ်ပြီးမှ launch လုပ်ပါ:

```bash
$ npm install -g express-generator
$ express
```

Command ရဲ့ option တွေကို ကြည့်ချင်ရင် `-h` option ကို သုံးပါ:

```bash
$ express -h

  Usage: express [options] [dir]

  Options:

    -h, --help          output usage information
        --version       output the version number
    -e, --ejs           add ejs engine support
        --hbs           add handlebars engine support
        --pug           add pug engine support
    -H, --hogan         add hogan.js engine support
        --no-view       generate without view engine
    -v, --view <engine> add view <engine> support (ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
    -c, --css <engine>  add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git           add .gitignore
    -f, --force         force on non-empty directory
```

ဥပမာ — အောက်ပါ command က _myapp_ ဆိုတဲ့ Express app တစ်ခုကို ဖန်တီးပေးပါတယ်။ App ကို လက်ရှိ working directory ထဲက _myapp_ folder မှာ ဖန်တီးပြီး — view engine ကို [Pug](https://pugjs.org/) အနေနဲ့ သတ်မှတ်ပေးပါတယ်:

```bash
$ express --view=pug myapp

   create : myapp
   create : myapp/package.json
   create : myapp/app.js
   create : myapp/public
   create : myapp/public/javascripts
   create : myapp/public/images
   create : myapp/routes
   create : myapp/routes/index.js
   create : myapp/routes/users.js
   create : myapp/public/stylesheets
   create : myapp/public/stylesheets/style.css
   create : myapp/views
   create : myapp/views/index.pug
   create : myapp/views/layout.pug
   create : myapp/views/error.pug
   create : myapp/bin
   create : myapp/bin/www
```

ပြီးရင် dependencies တွေကို install လုပ်ပါ:

```bash
$ cd myapp
$ npm install
```

MacOS ဒါမှမဟုတ် Linux မှာ app ကို ဒီ command နဲ့ run ပါ:

```bash
$ DEBUG=myapp:* npm start
```

Windows Command Prompt မှာတော့ ဒီ command ကို သုံးပါ:

```bash
> set DEBUG=myapp:* & npm start
```

Windows PowerShell မှာတော့ ဒီ command ကို သုံးပါ:

```bash
PS> $env:DEBUG='myapp:*'; npm start
```

ပြီးရင် browser ထဲမှာ `http://localhost:3000/` ကို ဖွင့်ပြီး app ကို ဝင်ကြည့်နိုင်ပါတယ်။

Generator က ဖန်တီးပေးတဲ့ app မှာ အောက်ပါ directory structure ရှိပါတယ်:

```bash
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```

> **မှတ်ချက်:** Generator က ဖန်တီးပေးတဲ့ app structure က Express app တွေ structure လုပ်တဲ့ နည်းလမ်းတွေထဲက တစ်ခုသာ ဖြစ်ပါတယ်။ ဒီ structure ကို သုံးလို့ရသလို — ကိုယ့်လိုအပ်ချက်နဲ့ အကိုက်ညီဆုံး ဖြစ်အောင် ပြုပြင်ပြောင်းလဲဖို့လည်း လွတ်လပ်စွာ လုပ်နိုင်ပါတယ်။
