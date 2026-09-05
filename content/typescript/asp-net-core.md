---
title: "ASP.NET Core (ASP.NET Core မှာ TypeScript သုံးခြင်း)"
description: "ASP.NET Core project တစ်ခုထဲ TypeScript ကို ထည့်သုံးနည်း — Visual Studio နဲ့ project အသစ် ဖန်တီးခြင်း၊ TypeScript compiler နဲ့ gulp build setup လုပ်ခြင်း၊ HTML page ထဲမှာ ရလဒ်ကို စမ်းသပ်/အမှားရှာခြင်း"
order: 38
source: "https://www.typescriptlang.org/docs/handbook/asp-net-core.html"
status: translated
updated: 2026-09-05
---

## ASP.NET Core နဲ့ TypeScript Install လုပ်ခြင်း (Install ASP.NET Core and TypeScript)

ပထမဆုံး — လိုအပ်မယ်ဆိုရင် [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) ကို install လုပ်ပါ။ ဒီ quick-start guide က Visual Studio 2015 ဒါမှမဟုတ် 2017 လိုအပ်ပါတယ်။

နောက်တစ်ဆင့် — သင့် Visual Studio version ထဲမှာ TypeScript အသစ်ဆုံး မပါသေးဘူးဆိုရင် — [ဒီကနေ install](https://www.typescriptlang.org/index.html#download-links) လုပ်နိုင်ပါတယ်။

## Project အသစ်တစ်ခု ဖန်တီးခြင်း (Create a new project)

1. **File** ကို ရွေးပါ
2. **New Project** (Ctrl + Shift + N) ကို ရွေးပါ
3. Project search bar ထဲမှာ **.NET Core** ကို ရှာပါ
4. **ASP.NET Core Web Application** ကို ရွေးပြီး _Next_ ခလုတ်ကို နှိပ်ပါ

![Visual Studio Project Window Screenshot (Project အသစ် ဖန်တီးသည့် ဝင်းဒိုး)](https://www.typescriptlang.org/images/tutorials/aspnet/createwebapp.png)

5. သင့် project နဲ့ solution ကို နာမည်ပေးပါ။ ပြီးရင် _Create_ ခလုတ်ကို ရွေးပါ

![Visual Studio New Project Window Screenshot (Project နာမည်ပေးသည့် ဝင်းဒိုး)](https://www.typescriptlang.org/images/tutorials/aspnet/namewebapp.png)

6. နောက်ဆုံး window ထဲမှာ **Empty** template ကို ရွေးပြီး _Create_ ခလုတ်ကို နှိပ်ပါ

![Visual Studio Web Application Screenshot (Empty template ရွေးထားပုံ)](https://www.typescriptlang.org/images/tutorials/aspnet/emptytemplate.png)

Application ကို run ပြီး — အလုပ်လုပ်ကြောင်း သေချာပါစေ။

![Edge မှာ "Hello World" အောင်မြင်စွာ ပြသနေတဲ့ Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/workingsite.png)

### Server ပြင်ဆင်သတ်မှတ်ခြင်း (Set up the server)

**Dependencies > Manage NuGet Packages > Browse** ကို ဖွင့်ပြီး `Microsoft.AspNetCore.StaticFiles` နဲ့ `Microsoft.TypeScript.MSBuild` တွေကို ရှာဖွေ install လုပ်ပါ:

![Visual Studio မှာ Nuget ကို ရှာနေပုံ](https://www.typescriptlang.org/images/tutorials/aspnet/downloaddependency.png)

`Startup.cs` file ကို ဖွင့်ပြီး — `Configure` function ကို အောက်ပါအတိုင်း တည်းဖြတ်ပါ:

```cs
public void Configure(IApplicationBuilder app, IHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseDefaultFiles();
    app.UseStaticFiles();
}
```

`UseDefaultFiles` နဲ့ `UseStaticFiles` အောက်က အနီရောင် ကောက်ကြောင်းလေးတွေ ပျောက်ဖို့ — VS ကို restart လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

## TypeScript ထည့်သွင်းခြင်း (Add TypeScript)

နောက်တစ်ဆင့်မှာ — `scripts` လို့ခေါ်တဲ့ folder အသစ်တစ်ခု ထည့်ပါမယ်။

![Web Project တစ်ခုထဲ Visual Studio မှာ "Add" ပြီး "New Folder" ကို ရွေးတဲ့ လမ်းကြောင်း](https://www.typescriptlang.org/images/tutorials/aspnet/newfolder.png)

![](https://www.typescriptlang.org/images/tutorials/aspnet/scripts.png)

## TypeScript Code ထည့်သွင်းခြင်း (Add TypeScript code)

`scripts` ပေါ်မှာ right-click လုပ်ပြီး **New Item** ကို နှိပ်ပါ။ ပြီးရင် **TypeScript File** ကို ရွေးပြီး — file ကို `app.ts` လို့ နာမည်ပေးပါ။

![Folder အသစ်ကို မီးမောင်းထိုးပြထားပုံ](https://www.typescriptlang.org/images/tutorials/aspnet/tsfile.png)

### ဥပမာ Code ထည့်သွင်းခြင်း (Add example code)

အောက်ပါ code ကို `app.ts` file ထဲကို ထည့်ပါ။

```ts
function sayHello() {
  const compiler = (document.getElementById("compiler") as HTMLInputElement)
    .value;
  const framework = (document.getElementById("framework") as HTMLInputElement)
    .value;
  return `Hello from ${compiler} and ${framework}!`;
}
```

## Build ပြင်ဆင်သတ်မှတ်ခြင်း (Set up the build)

_TypeScript compiler ကို ပြင်ဆင်သတ်မှတ်ခြင်း_

ပထမဆုံး — TypeScript ကို ဘယ်လို build လုပ်ရမလဲ ပြောပြဖို့ လိုပါတယ်။ `scripts` ပေါ်မှာ right-click လုပ်ပြီး **New Item** ကို နှိပ်ပါ။ ပြီးရင် **TypeScript Configuration File** ကို ရွေးပြီး — default နာမည်ဖြစ်တဲ့ `tsconfig.json` ကို သုံးပါ။

![TypeScript JSON Config ရွေးထားတဲ့ new file dialogue ကို ပြသတဲ့ Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/tsconfig.png)

`tsconfig.json` file ရဲ့ contents တွေကို အောက်ပါအတိုင်း အစားထိုးပါ:

```json tsconfig
{
  "compilerOptions": {
    "noEmitOnError": true,
    "noImplicitAny": true,
    "sourceMap": true,
    "target": "es6"
  },
  "files": ["./app.ts"],
  "compileOnSave": true
}
```

- [`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError) : error တွေ တင်ပြခဲ့မယ်ဆိုရင် outputs တွေ မထုတ်ပါ။
- [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) : `any` type ပါဝင်နေတဲ့ (implied) expressions နဲ့ declarations တွေမှာ error တင်ပါ။
- [`sourceMap`](https://www.typescriptlang.org/tsconfig#sourceMap) : သက်ဆိုင်ရာ `.map` file တွေကို ထုတ်ပေးပါတယ်။
- [`target`](https://www.typescriptlang.org/tsconfig#target) : ECMAScript target version ကို သတ်မှတ်ပါ။

မှတ်ချက် — `"ESNext"` က အထောက်အကူပြုနိုင်တဲ့ အသစ်ဆုံး (latest supported) ကို ရည်မှန်းပါတယ်။

[`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) က code အသစ်တွေ ရေးတိုင်း ထည့်ထားသင့်တဲ့ အကြံကောင်းတစ်ခုပါ — မတော်တဆ type မပါတဲ့ (untyped) code မရေးမိအောင် သေချာစေနိုင်လို့ပါ။ `"compileOnSave"` က run နေတဲ့ web app ထဲက သင့် code ကို update လုပ်ရတာ လွယ်ကူစေပါတယ်။

#### NPM ပြင်ဆင်သတ်မှတ်ခြင်း (Set up NPM)

JavaScript packages တွေ download လုပ်လို့ရအောင် NPM ကို ပြင်ဆင်သတ်မှတ်ဖို့ လိုပါတယ်။ Project ပေါ်မှာ right-click လုပ်ပြီး **New Item** ကို ရွေးပါ။ ပြီးရင် **NPM Configuration File** ကို ရွေးပြီး — default နာမည်ဖြစ်တဲ့ `package.json` ကို သုံးပါ။

!['npm configuration file' ရွေးထားတဲ့ new file dialog ကို ပြသတဲ့ VS Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/packagejson.png)

`package.json` file ရဲ့ `"devDependencies"` section ထဲမှာ _gulp_ နဲ့ _del_ တွေကို ထည့်ပါ:

```json tsconfig
"devDependencies": {
    "gulp": "4.0.2",
    "del": "5.1.0"
}
```

File ကို save လုပ်လိုက်တာနဲ့ Visual Studio က gulp နဲ့ del တွေကို install လုပ်ပေးပါလိမ့်မယ်။ မလုပ်ဘူးဆိုရင် — package.json ပေါ်မှာ right-click လုပ်ပြီး Restore Packages ကို နှိပ်ပါ။

အဲဒီနောက် သင့် solution explorer ထဲမှာ `npm` folder တစ်ခုကို တွေ့ရပါလိမ့်မယ်။

![npm folder ကို ပြသတဲ့ VS Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/npm.png)

#### Gulp ပြင်ဆင်သတ်မှတ်ခြင်း (Set up gulp)

Project ပေါ်မှာ right-click လုပ်ပြီး **New Item** ကို နှိပ်ပါ။ ပြီးရင် **JavaScript File** ကို ရွေးပြီး — `gulpfile.js` ဆိုတဲ့ နာမည် သုံးပါ။

```js
/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp");
var del = require("del");

var paths = {
  scripts: ["scripts/**/*.js", "scripts/**/*.ts", "scripts/**/*.map"],
};

gulp.task("clean", function () {
  return del(["wwwroot/scripts/**/*"]);
});

gulp.task("default", function (done) {
    gulp.src(paths.scripts).pipe(gulp.dest("wwwroot/scripts"));
    done();
});
```

ပထမဆုံး line က Visual Studio ကို — build ပြီးသွားရင် 'default' task ကို run ဖို့ ပြောပါတယ်။ Visual Studio ကို build clean လုပ်ဖို့ ပြောတဲ့အခါ 'clean' task ကိုလည်း run ပါလိမ့်မယ်။

အခု `gulpfile.js` ပေါ်မှာ right-click လုပ်ပြီး Task Runner Explorer ကို နှိပ်ပါ။

!['Gulpfile.js' ပေါ်မှာ right-click လုပ်ပြီး 'Task Runner Explorer' ရွေးထားပုံ Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/taskrunner.png)

'default' နဲ့ 'clean' tasks တွေ မပေါ်ဘူးဆိုရင် — explorer ကို refresh လုပ်ပါ:

!['Gulpfile.js' ပါဝင်နေတဲ့ task explorer Screenshot](https://www.typescriptlang.org/images/tutorials/aspnet/taskrunnerrefresh.png)

## HTML Page တစ်ခု ရေးသားခြင်း (Write a HTML page)

`wwwroot` folder ပေါ်မှာ right-click လုပ်ပြီး (folder ကို မမြင်ရရင် project ကို build ကြည့်ပါ) — အထဲမှာ `index.html` လို့ နာမည်ရှိတဲ့ New Item တစ်ခု ထည့်ပါ။ `index.html` အတွက် အောက်ပါ code ကို သုံးပါ:

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="scripts/app.js"></script>
    <title></title>
</head>
<body>
    <div id="message"></div>
    <div>
        Compiler: <input id="compiler" value="TypeScript" onkeyup="document.getElementById('message').innerText = sayHello()" /><br />
        Framework: <input id="framework" value="ASP.NET" onkeyup="document.getElementById('message').innerText = sayHello()" />
    </div>
</body>
</html>
```

## Test (စမ်းသပ်ခြင်း)

1. Project ကို run ပါ
2. Boxes တွေထဲမှာ ရိုက်လိုက်တာနဲ့ — message ပေါ်လာ/ပြောင်းလဲတာကို မြင်ရပါလိမ့်မယ်!

![ရေးထားတဲ့ code ကို Edge မှာ run နေတဲ့ GIF](https://media.giphy.com/media/U3mTibRAx34DG3zhAN/giphy.gif)

## Debug (အမှားရှာခြင်း)

1. Edge မှာ F12 ကို နှိပ်ပြီး Debugger tab ကို နှိပ်ပါ။
2. ပထမဆုံး localhost folder ထဲမှာ ကြည့်ပြီး — scripts/app.ts ကို သွားပါ။
3. `return` ပါတဲ့ line ပေါ်မှာ breakpoint တစ်ခု ချပါ။
4. Boxes တွေထဲမှာ ရိုက်ပြီး — breakpoint က TypeScript code ထဲမှာ ရပ်တာ (hits) နဲ့ inspection (စစ်ဆေးကြည့်ရှုခြင်း) အလုပ်လုပ်ကြောင်း အတည်ပြုပါ။

![ရေးထားတဲ့ code ကို debugger က run နေတာကို ပြသတဲ့ ပုံ](https://www.typescriptlang.org/images/tutorials/aspnet/debugger.png)

ဂုဏ်ယူပါတယ် — TypeScript frontend ပါတဲ့ ကိုယ်ပိုင် .NET Core project တစ်ခုကို တည်ဆောက်ပြီးပါပြီ။
