---
title: "Security အပ်ဒိတ်များ (Security Updates)"
description: "Express ရဲ့ security အပ်ဒိတ်နဲ့ patch တွေရဲ့ စာရင်း — version အလိုက် ပြင်ဆင်ပေးခဲ့တဲ့ vulnerability တွေကို အသေးစိတ် ဖော်ပြထားပြီး app ကို လုံခြုံစွာ ထိန်းသိမ်းဖို့ ကူညီပေးပါတယ်"
order: 23
source: "https://expressjs.com/en/advanced/security-updates.html"
status: translated
updated: 2026-09-03
---

> **သတိပြုရန်:** Node.js ရဲ့ vulnerabilities တွေက Express ကို တိုက်ရိုက် သက်ရောက်ပါတယ် — ဒါကြောင့် [Node.js vulnerabilities](https://nodejs.org/en/blog/vulnerability/) တွေကို စောင့်ကြည့်ပြီး Node.js ရဲ့ နောက်ဆုံး stable version ကို သုံးနေတာ သေချာစေပါ။

အောက်ဖော်ပြပါ စာရင်းက — သတ်မှတ်ထားတဲ့ version update တစ်ခုချင်းစီမှာ ပြင်ဆင်ပေးခဲ့တဲ့ Express vulnerabilities တွေကို စာရင်းပြုစုထားတာပါ။

> **မှတ်ချက်:** Express မှာ security vulnerability တစ်ခု ရှာတွေ့ခဲ့တယ်လို့ ယုံကြည်ရင် — [Security Policies and Procedures](/docs/express/contribution-guide#security-policies-and-procedures) ကို ကြည့်ပါ။

## 4.x

- 4.21.2
  - Dependency `path-to-regexp` ကို [vulnerability](https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-rhx6-c78j-4q9w) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။
- 4.21.1
  - Dependency `cookie` ကို [vulnerability](https://github.com/jshttp/cookie/security/advisories/GHSA-pxg6-pf52-xh8x) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ် — `res.cookie` ကို သုံးနေရင် ဒါက ကိုယ့် application ကို သက်ရောက်နိုင်ပါတယ်။
- 4.20.0
  - `res.redirect` ထဲက XSS vulnerability ကို ပြင်ဆင်ခဲ့ပါတယ် ([advisory](https://github.com/expressjs/express/security/advisories/GHSA-qw6h-vgh9-j6wx), [CVE-2024-43796](https://www.cve.org/CVERecord?id=CVE-2024-43796))။
  - Dependency `serve-static` ကို [vulnerability](https://github.com/advisories/GHSA-cm22-4g7w-348p) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။
  - Dependency `send` ကို [vulnerability](https://github.com/advisories/GHSA-m6fv-jmcg-4jfg) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။
  - Dependency `path-to-regexp` ကို [vulnerability](https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-9wv6-86v2-598j) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။
  - Dependency `body-parser` ကို [vulnerability](https://github.com/advisories/GHSA-qwcr-r2fm-qrc7) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ် — url encoding ကို ဖွင့်ထားရင် ဒါက ကိုယ့် application ကို သက်ရောက်နိုင်ပါတယ်။
- 4.19.0, 4.19.1
  - `res.location` နဲ့ `res.redirect` တွေထဲက open redirect vulnerability ကို ပြင်ဆင်ခဲ့ပါတယ် ([advisory](https://github.com/expressjs/express/security/advisories/GHSA-rv95-896h-c2vc), [CVE-2024-29041](https://www.cve.org/CVERecord?id=CVE-2024-29041))။
- 4.17.3
  - Dependency `qs` ကို [vulnerability](https://github.com/advisories/GHSA-hrpp-h998-j3pp) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။ အောက်ပါ API တွေကို သုံးနေရင် ဒါက ကိုယ့် application ကို သက်ရောက်နိုင်ပါတယ်: `req.query`, `req.body`, `req.param`။
- 4.16.0
  - Dependency `forwarded` ကို [vulnerability](https://github.com/advisories/GHSA-mpcf-4gmh-23w8) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။ အောက်ပါ API တွေကို သုံးနေရင် ဒါက ကိုယ့် application ကို သက်ရောက်နိုင်ပါတယ်: `req.host`, `req.hostname`, `req.ip`, `req.ips`, `req.protocol`။
  - Dependency `mime` ကို [vulnerability](https://github.com/advisories/GHSA-wrvr-8mpx-r7pp) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ် — ဒါပေမယ့် ဒီပြဿနာက Express ကို သက်ရောက်မှု မရှိပါဘူး။
  - Dependency `send` ကို [Node.js 8.5.0 vulnerability](https://nodejs.org/en/blog/vulnerability/september-2017-path-validation/) တစ်ခုကနေ ကာကွယ်ပေးဖို့ update လုပ်ထားပါတယ် — Node.js version 8.5.0 တစ်ခုတည်းမှာ Express run လုပ်နေတာကိုပဲ ဒါက သက်ရောက်ပါတယ်။
- 4.15.5
  - Dependency `debug` ကို [vulnerability](https://security.snyk.io/vuln/npm:debug:20170905) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ် — ဒါပေမယ့် ဒီပြဿနာက Express ကို သက်ရောက်မှု မရှိပါဘူး။
  - Dependency `fresh` ကို [vulnerability](https://github.com/advisories/GHSA-9qj9-36jm-prpv) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။ အောက်ပါ API တွေကို သုံးနေရင် ဒါက ကိုယ့် application ကို သက်ရောက်ပါလိမ့်မယ်: `express.static`, `req.fresh`, `res.json`, `res.jsonp`, `res.send`, `res.sendfile`, `res.sendFile`, `res.sendStatus`။
- 4.15.3
  - Dependency `ms` ကို [vulnerability](https://security.snyk.io/vuln/npm:ms:20170412) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ်။ အောက်ပါ API တွေရဲ့ `maxAge` option ထဲကို မယုံကြည်ရတဲ့ string input တွေ ပေးနေရင် ဒါက ကိုယ့် application ကို သက်ရောက်နိုင်ပါတယ်: `express.static`, `res.sendfile`, `res.sendFile`။
- 4.15.2
  - Dependency `qs` ကို [vulnerability](https://security.snyk.io/vuln/npm:qs:20170213) တစ်ခု ကိုင်တွယ်ဖို့ update လုပ်ထားပါတယ် — ဒါပေမယ့် ဒီပြဿနာက Express ကို သက်ရောက်မှု မရှိပါဘူး။ 4.15.2 ဆီ update လုပ်တာက ကောင်းတဲ့ အလေ့အကျင့်တစ်ခုပါ — ဒါပေမယ့် vulnerability ကိုင်တွယ်ဖို့တော့ မလိုအပ်ပါဘူး။
- 4.11.1
  - `express.static`, `res.sendfile`, နဲ့ `res.sendFile` တွေမှာ root path disclosure vulnerability (server ရဲ့ root path ကို ဖော်ထုတ်မိတဲ့ အားနည်းချက်) ကို ပြင်ဆင်ခဲ့ပါတယ်။
- 4.10.7
  - `express.static` ထဲက open redirect vulnerability ကို ပြင်ဆင်ခဲ့ပါတယ် ([advisory](https://github.com/advisories/GHSA-c3x7-gjmx-r2ff), [CVE-2015-1164](https://www.cve.org/CVERecord?id=CVE-2015-1164))။
- 4.8.8
  - `express.static` ထဲက directory traversal vulnerabilities တွေကို ပြင်ဆင်ခဲ့ပါတယ် ([advisory](https://github.com/advisories/GHSA-xwg4-93c6-3h42), [CVE-2014-6394](https://www.cve.org/CVERecord?id=CVE-2014-6394))။
- 4.8.4
  - အခြေအနေအချို့မှာ Node.js 0.10 က `express.static` နဲ့ `res.sendfile` တွေကို သက်ရောက်စေတဲ့ `fd` တွေ (file descriptors) ပေါက်ကြားစေနိုင်ပါတယ်။ Malicious request တွေက `fd` တွေ ပေါက်ကြားစေပြီး — နောက်ဆုံးမှာ `EMFILE` errors တွေနဲ့ server တုံ့ပြန်မှု မရှိတော့တဲ့ အထိ ဖြစ်စေနိုင်ပါတယ်။
- 4.8.0
  - Query string ထဲမှာ index အလွန်မြင့်မားတဲ့ sparse arrays တွေက process ရဲ့ memory ကုန်သွားပြီး server crash ဖြစ်စေနိုင်ပါတယ်။
  - အဆင့်ဆင့် အလွန်နက်နက်ရှိုင်းရှိုင်း nest လုပ်ထားတဲ့ query string objects တွေက process ကို ပိတ်ဆို့စေပြီး — server ကို ခဏတာ တုံ့ပြန်မှု မရှိအောင် လုပ်နိုင်ပါတယ်။

## 3.x

> **သတိပေးချက် — Express 3.x က END-OF-LIFE ဖြစ်ပြီး နောက်ထပ် ထိန်းသိမ်းမပေးတော့ပါ**
>
> 3.x ထဲမှာ ရှိတဲ့ သိထားတဲ့နဲ့ မသိရသေးတဲ့ security နဲ့ performance ပြဿနာတွေကို နောက်ဆုံး update (1 August 2015) ကတည်းက ကိုင်တွယ်မပေးခဲ့ပါဘူး။ Express ရဲ့ နောက်ဆုံး version ကို သုံးဖို့ အထူး အကြံပြုလိုပါတယ်။
>
> 3.x ကနေ upgrade လုပ်ဖို့ မဖြစ်နိုင်ဘူးဆိုရင် — [Commercial Support Options](/docs/express/support#commercial-support-options) ကို စဉ်းစားပါ။

- 3.19.1
  - `express.static`, `res.sendfile`, နဲ့ `res.sendFile` တွေမှာ root path disclosure vulnerability (server ရဲ့ root path ကို ဖော်ထုတ်မိတဲ့ အားနည်းချက်) ကို ပြင်ဆင်ခဲ့ပါတယ်။
- 3.19.0
  - `express.static` ထဲက open redirect vulnerability ကို ပြင်ဆင်ခဲ့ပါတယ် ([advisory](https://github.com/advisories/GHSA-c3x7-gjmx-r2ff), [CVE-2015-1164](https://www.cve.org/CVERecord?id=CVE-2015-1164))။
- 3.16.10
  - `express.static` ထဲက directory traversal vulnerabilities တွေကို ပြင်ဆင်ခဲ့ပါတယ်။
- 3.16.6
  - အခြေအနေအချို့မှာ Node.js 0.10 က `express.static` နဲ့ `res.sendfile` တွေကို သက်ရောက်စေတဲ့ `fd` တွေ (file descriptors) ပေါက်ကြားစေနိုင်ပါတယ်။ Malicious request တွေက `fd` တွေ ပေါက်ကြားစေပြီး — နောက်ဆုံးမှာ `EMFILE` errors တွေနဲ့ server တုံ့ပြန်မှု မရှိတော့တဲ့ အထိ ဖြစ်စေနိုင်ပါတယ်။
- 3.16.0
  - Query string ထဲမှာ index အလွန်မြင့်မားတဲ့ sparse arrays တွေက process ရဲ့ memory ကုန်သွားပြီး server crash ဖြစ်စေနိုင်ပါတယ်။
  - အဆင့်ဆင့် အလွန်နက်နက်ရှိုင်းရှိုင်း nest လုပ်ထားတဲ့ query string objects တွေက process ကို ပိတ်ဆို့စေပြီး — server ကို ခဏတာ တုံ့ပြန်မှု မရှိအောင် လုပ်နိုင်ပါတယ်။
- 3.3.0
  - ထောက်ပံ့မထားတဲ့ method override attempt တစ်ခုရဲ့ 404 response က cross-site scripting (XSS) attacks တွေကို ခံနိုင်ရည် ရှိခဲ့ပါတယ်။
