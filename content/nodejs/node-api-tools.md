---
title: "Node-API Tools များ (Tools)"
description: "Node-API module တည်ဆောက်ရေး toolchain — Node.js, npm, Git, C/C++ compiler နဲ့ Python — Windows/macOS/Linux အလိုက် install နည်းများ၊ tools များ အလုပ်လုပ်ကြောင်း စစ်ဆေးခြင်း"
order: 76
source: "https://nodejs.org/learn/node-api/getting-started/tools"
status: translated
updated: 2026-09-02
---

## Node.js

[Node.js](https://nodejs.org/) က သင့် machine ပေါ်မှာ JavaScript ကို run ပေးတဲ့ runtime ပါ။ [V8 JavaScript engine](https://developers.google.com/v8/) ကို built-in modules အစုတစ်စုနဲ့အတူ ပေါင်းထည့်ထားပြီး — browser အပြင်ဘက်မှာ JavaScript run နိုင်အောင် လုပ်ပေးပါတယ်။

သင့် platform အတွက် သင့်တော်တဲ့ installer ကို [Node.js downloads page](https://nodejs.org/en/download/) ကနေ download လုပ်ပါ။ **LTS (Long Term Support)** release က အတည်ငြိမ်ဆုံး ရွေးချယ်မှုဖြစ်ပြီး — addon development အတွက် အကြံပြုထားပါတယ်။ Installer ထဲမှာ npm ပါ ပါဝင်ပါတယ်။

> Node-API က လက်ရှိ ထောက်ပံ့နေတဲ့ Node.js releases အားလုံးမှာ stable ဖြစ်ပါတယ်။ Active LTS ဒါမှမဟုတ် Maintenance LTS release ဘယ်ဟာနဲ့မဆို အလုပ်လုပ်ပါတယ်။

## npm

[npm](https://www.npmjs.com) က Node.js ရဲ့ package manager ပါ။ Node.js နဲ့အတူ တွဲ install လုပ်ပြီးသား ဖြစ်ပါတယ်။ Node-API developer အများစုရဲ့ ရည်ရွယ်ချက်က — C/C++ library တစ်ခုကို wrap လုပ်ပြီး JavaScript users တွေ သုံးနိုင်အောင် npm package တစ်ခုအနေနဲ့ ထုတ်ဝေဖို့ပါ။

npm က Node.js နဲ့အတူ ပါလာတာမို့ — ဒီ command နဲ့ အမြဲတမ်း နောက်ဆုံးပေါ် ဖြစ်အောင် ထားနိုင်ပါတယ်:

```bash
npm install -g npm@latest
```

## Git

[Git](https://git-scm.com) က Node-API အလုပ်အတွက် မဖြစ်မနေ လိုအပ်တာ မဟုတ်ပေမယ့် — ecosystem တစ်ခုလုံးမှာ တွင်ကျယ်စွာ သုံးနေပါတယ်။ ဥပမာ repository တွေ အများစုနဲ့ dependency installation တွေ အများစုက Git ကို မှီခိုနေပါတယ်။

## C/C++ Compiler နဲ့ Python

Node နဲ့ npm အပြင် — C/C++ compiler toolchain တစ်ခုနဲ့ Python (ကို [node-gyp](https://nodejs.org/learn/node-api/build-tools/node-gyp) က လိုအပ်ပါတယ်) တို့ လိုအပ်ပါတယ်။

### Windows

အကြံပြုထားတဲ့ နည်းလမ်းက — [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) ကို **"Desktop development with C++"** workload ရွေးထည့်ပြီး install လုပ်တာပါ။ ဒါက node-gyp လိုအပ်တဲ့ MSVC compiler, Windows SDK, build infrastructure တွေကို ပေးပါတယ်။

တစ်နည်းအားဖြင့် — [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) ကနေလည်း install လုပ်နိုင်ပါတယ်:

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```

Install လုပ်နေစဉ် (သို့) ပြီးတဲ့အခါ — Visual Studio Installer ကို ဖွင့်ပြီး **"Desktop development with C++"** workload ကို checked လုပ်ထားကြောင်း သေချာပါစေ။

Python 3 လည်း လိုအပ်ပါတယ်။ [python.org](https://www.python.org/downloads/windows/) ကနေ ဒါမှမဟုတ် winget ကနေ install လုပ်နိုင်ပါတယ်:

```powershell
winget install Python.Python.3
```

> Global tools တွေ install လုပ်တဲ့အခါ PowerShell ဒါမှမဟုတ် `cmd.exe` ကို **Administrator** အနေနဲ့ run လုပ်ပါ။

### macOS

Apple ရဲ့ command-line developer tools တွေကို install လုပ်ပါ။ Xcode မထည့်ရသေးဘူးဆိုရင် — အမြန်ဆုံး နည်းလမ်းက:

```bash
xcode-select --install
```

ဒါ အလုပ်မလုပ်ရင် — Mac App Store ကနေ [Xcode IDE](https://developer.apple.com/xcode/) အပြည့်အစုံကို install ပါ။ ၎င်းထဲမှာ လိုအပ်တဲ့ compiler toolchain ပါဝင်ပါတယ်။

Python 3 က ခေတ်သစ် macOS တွေမှာ **ပါဝင်မထားပါဘူး**။ [Homebrew](https://brew.sh) ကို သုံးပြီး install လုပ်နိုင်ပါတယ်:

```bash
brew install python3
```

ဒါမှမဟုတ် [python.org](https://www.python.org/downloads/macos/) ကနေ installer ကို download လုပ်ပါ။

### Linux

Linux distribution အများစုမှာ — လိုအပ်တဲ့ C/C++ toolchain နဲ့ Python က ကြိုတင် install ဖြစ်ပြီးသား ဒါမှမဟုတ် အလွယ်တကူ ထည့်လို့ရပါတယ်။ Debian/Ubuntu-based စနစ်တွေအတွက်:

```bash
sudo apt-get update
sudo apt-get install -y build-essential python3
```

တခြား distribution တွေအတွက်ဆိုရင် — ကိုယ့် package manager ရဲ့ documentation ဒါမှမဟုတ် [LLVM installation guide](https://llvm.org/docs/GettingStarted.html) ကို ကိုးကားပါ။

## Tools များ အလုပ်လုပ်ကြောင်း စစ်ဆေးခြင်း

Install လုပ်ပြီးတဲ့အခါ — tool တစ်ခုချင်းစီက PATH ထဲမှာ ရှိကြောင်း စစ်ဆေးပါ။

### macOS နဲ့ Linux

```bash
node --version
npm --version
python3 --version
git --version
cc --version
make --version
```

### Windows (PowerShell)

```powershell
node --version
npm --version
python --version
git --version
```

MSVC compiler ရနိုင်ကြောင်း အတည်ပြုဖို့ — **Developer Command Prompt** (Visual Studio Build Tools နဲ့အတူ install ဖြစ်တာ) တစ်ခုကို ဖွင့်ပြီး ဒီ command ကို run ပါ:

```bash
cl
```

## တခြား Tools များ

Shell တစ်ခု လိုအပ်ပါမယ် — macOS/Linux မှာ Terminal, Windows မှာ PowerShell ဒါမှမဟုတ် Windows Terminal ဖြစ်ပါတယ်။

စွမ်းဆောင်ရည် ကောင်းတဲ့ code editor တစ်ခုကိုလည်း အကြံပြုပါတယ်။ [Visual Studio Code](https://code.visualstudio.com) က [C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) ကနေတစ်ဆင့် C/C++ အတွက် ကောင်းမွန်တဲ့ ထောက်ပံ့မှု ရှိပြီး — node-gyp builds တွေနဲ့လည်း ကောင်းကောင်း ပေါင်းစပ်အလုပ်လုပ်ပါတယ်။ [CLion](https://www.jetbrains.com/clion/) ကလည်း C++ development အတွက် နောက်ထပ် ရေပန်းစားတဲ့ ရွေးချယ်မှုတစ်ခုပါ။
