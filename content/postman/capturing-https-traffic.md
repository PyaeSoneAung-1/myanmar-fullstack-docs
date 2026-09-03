---
title: "Postman built-in proxy သုံးပြီး HTTPS traffic တွေကို ဖမ်းယူခြင်း"
description: "Android, iOS, Linux, macOS နဲ့ Windows devices တွေပေါ်မှာ `postman-proxy-ca.crt` certificate တပ်ဆင်ပြီး Postman ရဲ့ built-in proxy နဲ့ HTTPS traffic တွေကို ဖမ်းယူနည်း — Windows မှာ OpenSSL တပ်ဆင်ခြင်း, operating system အလိုက် security certificate install လုပ်နည်းတွေနဲ့ certificate ပြဿနာတွေ troubleshoot လုပ်နည်း"
order: 113
source: "https://learning.postman.com/docs/use/capturing-request-data/capturing-https-traffic/"
status: translated
updated: 2026-09-03
---

HTTP traffic တွေ ဖမ်းယူတာအပြင် — Postman ရဲ့ built-in proxy ကို သုံးပြီး Android, iOS, Linux, macOS နဲ့ Windows devices တွေကနေ HTTPS communication တွေကိုလည်း စစ်ဆေးနိုင်ပါတယ်။

Secure HTTP traffic တွေကို ဖမ်းယူနိုင်ဖို့ — ကိုယ့် device ပေါ်မှာ `postman-proxy-ca.crt` certificate ကို install လုပ်ထားရပါမယ်။ အရင်ဆုံး [Postman မှာ proxy ကို setup လုပ်ပါ](/docs/postman/capturing-http-requests)။ ပြီးရင် အောက်က ညွှန်ကြားချက်တွေအတိုင်း — လိုအပ်တဲ့ security certificate ကို ပစ်မှတ် devices တွေပေါ်မှာ install လုပ်ပါ။

HTTPS requests တွေကို နောက်ထပ် ဖမ်းယူစရာ မလိုတော့ရင် — certificate ကို ကိုယ့် device ကနေ deactivate လုပ်တာ ဒါမှမဟုတ် ဖယ်ရှားတာ လုပ်နိုင်ပါတယ်။

## Windows

Windows ပေါ်မှာ Postman v10.18 ဒါမှမဟုတ် ၎င်းနောက်ပိုင်း version သုံးနေရင် — proxy ကို ပထမဆုံးအကြိမ် စတင်လိုက်တာနဲ့ Postman security certificate ကို ကိုယ့် computer ပေါ်မှာ အလိုအလျောက် install လုပ်ပေးပါတယ်။ ဒါ့အပြင် OpenSSL ကိုလည်း install လုပ်စရာ မလိုပါဘူး။ အသေးစိတ်အတွက် — [Postman proxy သုံးပြီး requests တွေကို ဖမ်းယူခြင်း](/docs/postman/capture-with-proxy) ကို သွားပါ။

`postman-proxy-ca.crt` certificate ကို install မလုပ်ခင် — OpenSSL module ကို အရင် install လုပ်ထားရပါမယ်။

### Windows မှာ OpenSSL တပ်ဆင်ခြင်း

Postman က certificate-key pairs တွေ generate လုပ်ဖို့ **OpenSSL** ကို သုံးပါတယ်။ Postman က `postman-proxy-ca.crt` certificate ကို generate လုပ်နိုင်ဖို့ — OpenSSL module ကို ကိုယ့် computer ပေါ်မှာ install လုပ်ထားပြီး command line ကနေ access လုပ်လို့ရနေရပါမယ်။

macOS မှာတော့ OpenSSL က အရင်ကတည်းက install ပြီးသား ဖြစ်ပြီး — Linux မှာလည်း ပုံမှန်အားဖြင့် install ပြီးသား ဖြစ်ပါတယ်။ Windows systems တွေမှာတော့ OpenSSL ကို ကိုယ်တိုင် install လုပ်ရပါမယ်။

Windows systems တွေအတွက် OpenSSL install လုပ်ဖို့:

1. ကိုယ့် operating system version အတွက် [OpenSSL v1.1.1 installer](https://slproweb.com/products/Win32OpenSSL.html) ကို download လုပ်ပြီး install လုပ်ပါ။ Certificates generate လုပ်ဖို့ OpenSSL v1.x ကို လိုအပ်ပါတယ်။ ဒီအချိန်မှာ OpenSSL ရဲ့ နောက်ပိုင်း versions တွေကိုတော့ support မလုပ်ပါဘူး။

   Install လုပ်နေစဉ်မှာ — OpenSSL DLLs တွေကို **OpenSSL binaries (/bin) directory** ထဲကို copy လုပ်ဖို့ option ကို ရွေးထားဖို့ သေချာလုပ်ပါ။

2. Windows **Start** menu ကို ဖွင့်ပြီး — **Environment Variables** လို့ ရှာကာ **Open** ကို ရွေးပါ။
3. **System Properties** window ပေါ်မှာ **Environment Variables** ကို ရွေးပါ။
4. **User variables** အောက်က **Path** ကို ရွေးပြီး — **Edit** ကို ရွေးပါ။
5. **Browse** ကို ရွေးပါ။
6. **This PC > Local Disk (C:) > Program Files > OpenSSL-Win64 > bin** ကို ရှာပြီး ရွေးပါ။
7. Folder directory ထည့်ဖို့ **OK** ကို ရွေးပါ။ ပြီးရင် အပြောင်းအလဲတွေ အတည်ပြုပြီး ကျန်တဲ့ windows တွေ ပိတ်ဖို့ **OK** ကို ရွေးပါ။
8. Windows command line ကို ဖွင့်ပါ။ ဒီလိုလုပ်ဖို့ — **Start** menu ကို ဖွင့်ပြီး **cmd** လို့ ရှာကာ **Open** ကို ရွေးပါ။ Command line ပေါ်မှာ `openssl version` ဆိုတဲ့ command ကို ရိုက်ထည့်ပြီး — install အောင်မြင်ခဲ့လား ဆိုတာ အတည်ပြုပါ။ Output က အောက်ပါအတိုင်း ဆင်တူနေပါလိမ့်မယ်:

   `OpenSSL 1.1.1l  24 Aug 2021`

### Windows မှာ security certificate တပ်ဆင်ခြင်း

မစတင်ခင် — Postman က certificate generate လုပ်နိုင်ဖို့ [OpenSSL module ကို install လုပ်ထား](#windows-မှာ-openssl-တပ်ဆင်ခြင်း)ဖို့ သေချာလုပ်ပါ။

1. Windows File Explorer ထဲမှာ `%APPDATA%\Postman\proxy` folder ကို ဖွင့်ပါ။ ပုံမှန်အားဖြင့် ဒီ folder က `C:\Users\<user>\AppData\Roaming\Postman\proxy` မှာ တည်ရှိပါတယ်။
2. **postman-proxy-ca.crt** file ပေါ်မှာ right-click နှိပ်ပြီး — **Install Certificate** ကို ရွေးပါ။
3. **Local Machine** ကို ရွေးပြီး **Next** ကို ရွေးပါ။ ဒီလုပ်ဆောင်ချက်က Administrator ခွင့်ပြုချက် လိုအပ်ပါတယ်။ ဆက်လုပ်ဖို့ **Yes** ကို ရွေးပါ။
4. **Place all certificates in the following store** ကို ရွေးပါ။
5. **Browse** ကို ရွေးပြီး — **Trusted Root Certification Authorities** ကို ရွေးပါ။
6. **OK** ကို ရွေးပြီး — **Next** ကို ရွေးပါ။
7. Certificate ကို import လုပ်ဖို့ **Finish** ကို ရွေးပါ။
8. Postman ကို restart လုပ်ပါ။

## macOS

macOS ပေါ်မှာဆိုရင် — proxy ကို ပထမဆုံးအကြိမ် စတင်လိုက်တာနဲ့ Postman security certificate ကို ကိုယ့် computer ပေါ်မှာ အလိုအလျောက် install လုပ်ပေးပါတယ်။ အသေးစိတ်အတွက် — [Postman proxy သုံးပြီး requests တွေကို ဖမ်းယူခြင်း](/docs/postman/capture-with-proxy) ကို သွားပါ။

macOS ပေါ်မှာ security certificate install လုပ်ဖို့:

1. macOS Finder ထဲမှာ `~/Library/Application Support/Postman/proxy` folder ကို ဖွင့်ပါ။
2. `postman-proxy-ca.crt` file ကို double-click လုပ်ပါ။
3. **Keychain** list ထဲမှာ **System** ကို ရွေးပြီး — **Add** ကို ရွေးပါ။ လုပ်ဆောင်ချက် အတည်ပြုဖို့ ကိုယ့် system password ကို ရိုက်ထည့်ပါ။
4. Keychain Access ထဲမှာ — import လုပ်ထားတဲ့ Postman certificate ကို ဖွင့်ဖို့ double-click လုပ်ပါ။
5. **Trust** section ကို ချဲ့ပါ။ ဒီ certificate ကို သုံးတဲ့အခါ **Always Trust** ဆိုတဲ့ option ကို ရွေးပြီး — **Secure Sockets Layer(SSL)** အတွက်လည်း **Always Trust** ရွေးထားဖို့ သေချာလုပ်ပါ။
6. Certificate window ကို ပိတ်ပါ။ Settings တွေ update လုပ်ဖို့ ကိုယ့် system password ကို ရိုက်ထည့်ပါ။

## CentOS နဲ့ Red Hat Enterprise Linux

CentOS နဲ့ Red Hat Enterprise Linux ပေါ်မှာ security certificate install လုပ်ဖို့:

1. `postman-proxy-ca.crt` certificate file ကို `~/.config/Postman/proxy` ကနေ `/etc/pki/ca-trust/source/anchors/` directory ဆီ copy လုပ်ပါ။

   `sudo cp ~/.config/Postman/proxy/postman-proxy-ca.crt /etc/pki/ca-trust/source/anchors/`

2. Install လုပ်တာ ပြီးမြောက်ဖို့ terminal ထဲမှာ အောက်က command ကို run လုပ်ပါ:

   `sudo update-ca-trust extract`

## Ubuntu

Ubuntu ပေါ်မှာ security certificate install လုပ်ဖို့:

1. ဒီ command နဲ့ CA certificate အတွက် directory ကို ဖန်တီးပါ:

   `sudo mkdir -p /usr/share/ca-certificates/extra`

2. ဒီ command နဲ့ `postman-proxy-ca.crt` ကို folder အသစ်ထဲကို copy လုပ်ပါ:

   `sudo cp ~/.config/Postman/proxy/postman-proxy-ca.crt /usr/share/ca-certificates/extra/postman-proxy-ca.crt`

3. ဒီ command နှစ်ခုနဲ့ certificate ကို system ထဲကို ထည့်ပါ:

   `sudo dpkg-reconfigure ca-certificates`

   `sudo update-ca-certificates`

### Chrome အတွက် certificate တပ်ဆင်ခြင်း

1. Google Chrome ကို ဖွင့်ပြီး `chrome://settings/security` ဆိုတဲ့ URL ကို သွားပါ။
2. စာရင်းထဲကနေ **Manage device certificates** ကို ရွေးပါ။
3. **Authorities** tab ကို ရွေးပြီး — **Import** ကို ရွေးပါ။
4. **Browse** ကို ရွေးပြီး — `~/.config/Postman/proxy/postman-proxy-ca.crt` file ကို ရွေးပါ။
5. **Trust Settings** အောက်မှာ — **Trust this certificate for identifying websites** ကို ရွေးပါ။
6. **OK** ကို ရွေးပါ။

### Mozilla Firefox အတွက် certificate တပ်ဆင်ခြင်း

1. Firefox ကို ဖွင့်ပြီး — application menu ကို ရွေးကာ **Preferences** ကို ရွေးပါ။
2. **Privacy & Security** ကို ရွေးပါ။ **Certificates** ဆီ အောက်ကို လှိမ့်ပြီး — **View Certificates** ကို ရွေးပါ။
3. Certificate Manager ထဲမှာ — **Authorities** tab ကို ရွေးပြီး **Import** ကို ရွေးပါ။
4. **postman-proxy-ca.crt** ကို ရွေးပြီး **Open** ကို ရွေးပါ။
5. **Trust this CA to identify websites** ကို ရွေးပြီး — **OK** ကို ရွေးပါ။

## iOS

iOS ပေါ်မှာ security certificate install လုပ်ဖို့:

1. `postman-proxy-ca.crt` certificate ကို iOS device ထဲကို download လုပ်ပါ (ဥပမာ — AirDrop သုံးပြီး)။ ဒီ certificate file ကို ကိုယ့် computer ပေါ်မှာ အောက်ပါ နေရာတွေမှာ တွေ့နိုင်ပါတယ်:

   * **macOS** — `~/Library/Application Support/Postman/proxy`
   * **Windows** — `C:\Users\<user>\AppData\Roaming\Postman\proxy`
   * **Linux** — `~/.config/Postman/proxy`

2. **Settings > Profile Downloaded** ကို သွားပြီး — **Install** ကို ရွေးပါ။ ဆက်လုပ်ဖို့ ကိုယ့် passcode ကို ရိုက်ထည့်ပါ။
3. Security warning တစ်ခု ပေါ်လာပါလိမ့်မယ်။ **Install** ကို ရွေးပါ။
4. Certificate install ပြီးသွားရင် — **Done** ကို ရွေးပါ။
5. **Settings > General > About > Certificate Trust Settings** ကို သွားပါ။
6. Postman ရဲ့ root certificate အတွက် full trust ကို enable လုပ်ပြီး — install လုပ်တာ ပြီးမြောက်ဖို့ **Continue** ကို ရွေးပါ။

## Android

Certificate တပ်ဆင်တဲ့ လုပ်ငန်းစဉ်က ကိုယ့် device နဲ့ Android version ပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။

Android ပေါ်မှာ security certificate install လုပ်ဖို့:

1. `postman-proxy-ca.crt` certificate ကို Android device ထဲကို download လုပ်ပါ။ ဒီ certificate file ကို ကိုယ့် computer ပေါ်မှာ အောက်ပါ နေရာတွေမှာ တွေ့နိုင်ပါတယ်:

   * **macOS** — `~/Library/Application Support/Postman/proxy`
   * **Windows** — `C:\Users\<user>\AppData\Roaming\Postman\proxy`
   * **Linux** — `~/.config/Postman/proxy`

2. **Settings** app ကို ဖွင့်ပြီး — **Security > Encryption & credentials** ကို သွားပါ။
3. **Install a certificate** ကို ရွေးပြီး — **CA Certificate** option ကို ရွေးပါ။
4. Security warning တစ်ခု ပေါ်လာပါလိမ့်မယ်။ ဆက်လုပ်ဖို့ **Install anyway** ကို ရွေးပါ။
5. `postman-proxy-ca.crt` certificate file ကို ရှာပြီး ရွေးပါ။ Certificate install ဖြစ်သွားပြီ ဆိုတဲ့ message တစ်ခု ရပါလိမ့်မယ်။ အဲဒါဆိုရင် Android ပေါ်မှာ web browser ကနေ traffic တွေကို ဖမ်းယူနိုင်ပါပြီ။

**Android app တစ်ခုကနေ requests တွေ ဖမ်းယူဖို့ လိုနေလား?** Android app တစ်ခုကနေ requests တွေ ဖမ်းယူဖို့ဆိုရင် — `postman-proxy-ca.crt` certificate ကို trust လုပ်ဖို့ ကိုယ့် app ထဲမှာ network security configuration file တစ်ခု ထည့်ပေးရပါမယ်။ အသေးစိတ်အတွက် — Android Developers portal ပေါ်က [Trust additional CAs](https://developer.android.com/privacy-and-security/security-config#TrustingAdditionalCas) ကို ကြည့်ပါ။

## Certificate ပြဿနာတွေကို troubleshoot လုပ်ခြင်း

`postman-proxy-ca.crt` certificate ကို မှန်ကန်စွာ install လုပ်လို့ မရဘူးဆိုရင် — ဒါမှမဟုတ် certificate က traffic တွေ ဖမ်းယူလို့ မရအောင် ဖြစ်နေရင် — certificate ကို regenerate လုပ်ပြီး ပြန် install လုပ်ပါ။

Certificate ကို regenerate လုပ်ပြီး ပြန် install လုပ်ဖို့:

1. Postman version 9.1 ဒါမှမဟုတ် ၎င်းနောက်ပိုင်း run နေဖို့ သေချာလုပ်ပါ။ [Postman ကို update လုပ်ခြင်း](https://learning.postman.com/docs/getting-started/installation/update/) ကို ကြည့်ပါ။
2. Postman install ထားတဲ့ computer ပေါ်မှာ `/Postman/Proxy` folder ကို ဖျက်ပါ။ ဒီ folder ကို အောက်ပါ နေရာတွေမှာ တွေ့နိုင်ပါတယ်:

   * **macOS** — `~/Library/Application Support/Postman/proxy`
   * **Windows** — `C:\Users\<user>\AppData\Roaming\Postman\proxy`
   * **Linux** — `~/.config/Postman/proxy`

3. Postman ကို ပိတ်ပြီး ပြန် restart လုပ်ပါ။ Postman က certificate ကို ပြန် generate လုပ်ပေးပါတယ်။
4. Prompt လာရင် — certificate ကို ပြန် install ဖို့ ကိုယ့် device အတွက် အဆင့်တွေကို လိုက်နာပါ။
