---
title: "Postman CLI ကို install လုပ်ခြင်း"
description: "Windows, macOS, Linux နဲ့ WSL တွေမှာ Postman CLI install လုပ်နည်း — npm (သို့) install scripts နဲ့ ဖြစ်စေ — update လုပ်ခြင်း, uninstall လုပ်ခြင်းနဲ့ troubleshooting အထိ အကျုံးဝင်သည်"
order: 157
source: "https://learning.postman.com/docs/postman-cli/postman-cli-installation/"
status: translated
updated: 2026-09-03
---

အောက်မှာ ကိုယ့် operating system နဲ့ ကိုက်ညီတဲ့ ညွှန်ကြားချက်တွေကို လိုက်နာပြီး [Postman CLI](/docs/postman/postman-cli-overview) ကို install လုပ်ပါ။

Postman CLI က Postman desktop app နဲ့ တူညီတဲ့ system requirements တွေကိုပဲ ထောက်ပံ့ပေးပါတယ်။ လိုအပ်ချက် အပြည့်အစုံ စာရင်းအတွက် — [Install and update Postman](https://learning.postman.com/docs/getting-started/installation/install-app/) ကို ကြည့်ပါ။

## Windows, macOS နဲ့ Linux တွေမှာ npm နဲ့ install လုပ်ခြင်း

ကိုယ့် system မှာ Node.js နဲ့ npm ရှိပြီးသားဆိုရင် — အောက်ပါ command ကို run လုပ်နိုင်ပါတယ်။ ဒါက Postman CLI binary ကို download လုပ်ပြီး install လုပ်ပေးမှာ ဖြစ်လို့ — `postman` command ကို ကိုယ့် terminal ထဲမှာ သုံးလို့ရလာပါလိမ့်မယ်။

```bash
npm install -g postman-cli
```

တနည်းအားဖြင့် — Windows အတွက် သီးသန့် script တစ်ခုနဲ့လည်း Postman CLI binary ကို install လုပ်နိုင်ပါတယ်။ macOS, Linux ဒါမှမဟုတ် Windows Subsystem for Linux (WSL) သုံးနေတဲ့ systems တွေမှာဆိုရင် — curl သုံးပြီးလည်း Postman CLI binary ကို install လုပ်နိုင်ပါတယ်။

Linux ရဲ့ ထောက်ပံ့မှုက libc compatibility လိုအပ်ချက်တွေကြောင့် Alpine Linux distributions တွေမှာတော့ အကျုံးမဝင်ပါဘူး။

## Windows မှာ install လုပ်ခြင်း

Windows အတွက် Postman CLI ကို install လုပ်ဖို့ အောက်ပါ command ကို run လုပ်ပါ။ ဒါက install script တစ်ခုကို download လုပ်ပြီး run လုပ်ပေးပါတယ်။ Script က `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps` directory မရှိသေးရင် အရင်ဖန်တီးပြီး — `postman` binary ကို အဲဒီနေရာမှာ install လုပ်ပေးပါတယ်။

```powershell
powershell.exe -NoProfile -InputFormat None -ExecutionPolicy AllSigned -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://dl-cli.pstmn.io/install/win64.ps1'))"
```

## macOS, Linux နဲ့ Windows Subsystem for Linux (WSL) မှာ install လုပ်ခြင်း

macOS, Linux ဒါမှမဟုတ် Windows Subsystem for Linux (WSL) သုံးနေတဲ့ systems တွေမှာ Postman CLI ကို install လုပ်ဖို့ အောက်ပါ command ကို run လုပ်ပါ။ ဒါက ကိုယ့် OS နဲ့ architecture ကို အလိုအလျောက် သိရှိနိုင်တဲ့ unified install script တစ်ခုကို download လုပ်ပြီး run လုပ်ပေးပါတယ်။ Install script က `/usr/local/bin` directory မရှိသေးရင် အရင်ဖန်တီးပြီး — `postman` binary ကို အဲဒီနေရာမှာ install လုပ်ပေးပါတယ်။

```bash
curl -o- "https://dl-cli.pstmn.io/install/unix.sh" | sh
```

## ကိုယ့် Postman CLI installation ကို update လုပ်ခြင်း

ကိုယ့် Postman CLI installation ကို နောက်ဆုံးထွက် version အထိ update လုပ်ဖို့ — install လုပ်တုန်းက သုံးခဲ့တဲ့ command အတိုင်းပဲ ပြန် run လုပ်ပါ။ Version အသစ်က အရင် version ကို overwrite လုပ်ပါတယ်။ အသစ်ဆုံး အပြောင်းအလဲတွေနဲ့ feature တွေအကြောင်း အသေးစိတ်ကို — [Postman CLI release notes](https://www.postman.com/release-notes/postman-cli/) မှာ ကြည့်ပါ။

## Postman CLI ကို uninstall လုပ်ခြင်း

Postman CLI ကို npm နဲ့ install လုပ်ခဲ့ရင် — အောက်ပါ command နဲ့ uninstall လုပ်နိုင်ပါတယ်:

```bash
npm uninstall -g postman-cli
```

Postman CLI ကို npm ကလွဲပြီး တခြားနည်းတစ်ခုခုနဲ့ install လုပ်ခဲ့ရင် — `postman` binary ကို ဖျက်ပစ်ခြင်းဖြင့် uninstall လုပ်နိုင်ပါတယ်။ Windows systems တွေမှာ binary က ပုံမှန်အားဖြင့် `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps` ထဲမှာ ရှိပြီး — macOS, Linux နဲ့ WSL systems တွေမှာတော့ `/usr/local/bin` ထဲမှာ ရှိပါတယ်။

## Troubleshooting

Postman CLI ကို npm ရော curl-based script ရော နှစ်မျိုးလုံးနဲ့ install လုပ်ထားရင် — ကိုယ့် system မှာ binary နှစ်ခုပြား ရှိနေနိုင်ပါတယ်။ ဘယ် binary က active ဖြစ်နေလဲဆိုတာက — ကိုယ့် `PATH` environment variable ထဲက directory တွေရဲ့ အစဉ်ပေါ်မှာ မူတည်ပါတယ်။

ဘယ် binary က active ဖြစ်နေလဲ စစ်ကြည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ကိုယ့် system ပေါ် မူတည်ပြီး အောက်ပါ command တွေထဲက တစ်ခုကို run လုပ်ပါ:

   * macOS, Linux ဒါမှမဟုတ် WSL အတွက်ဆိုရင် — `which postman` ကို run လုပ်ပါ။

   * Windows အတွက်ဆိုရင် — `where postman` ကို run လုပ်ပါ။

2. `postman --version` ကို run လုပ်ပါ။

ကိုယ့် `PATH` environment variable ထဲမှာ binary နှစ်ခုပြား ရှိနေရင် — binary တစ်ခုကို uninstall လုပ်ခြင်းဖြင့် ဒီပြဿနာကို ဖြေရှင်းနိုင်ပါတယ်။

Postman CLI command တချို့က ခိုင်လုံတဲ့ (valid) Postman API key တစ်ခု လိုအပ်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — [Generate and use Postman API keys](https://learning.postman.com/docs/reference/postman-api/authentication/) ကို ကြည့်ပါ။
