---
title: "Contribution Guide (ပူးပေါင်းပါဝင်မှု လမ်းညွှန်)"
description: "Express.js ပရောဂျက်ထဲ ပူးပေါင်းပါဝင်နည်း — issues တင်ခြင်း, pull requests, code style, testing, collaborator ဖြစ်ခြင်း, TC governance နဲ့ security vulnerability policy"
order: 21
source: "https://expressjs.com/en/resources/contributing.html"
status: translated
updated: 2026-09-02
---

Express က [OpenJS Foundation](https://openjsf.org/) ရဲ့ project ဖြစ်ပြီး — GitHub organization သုံးခုပေါ်မှာ တည်ရှိပါတယ်: [expressjs](https://github.com/expressjs), [pillarjs](https://github.com/pillarjs) နဲ့ [jshttp](https://github.com/jshttp) တို့ပါ။ Bug အစီရင်ခံတာ၊ documentation မြှင့်တင်တာ၊ code ပို့တာ — ပူးပေါင်းပါဝင်မှု အားလုံးကို ကြိုဆိုပါတယ်။

## Technical Committee (TC)

Express ရဲ့ **technical committee** က တက်ကြွတဲ့ project members တွေနဲ့ ဖွဲ့စည်းထားပြီး — Express project ရဲ့ ဖွံ့ဖြိုးတိုးတက်မှုနဲ့ ထိန်းသိမ်းမှုကို လမ်းညွှန်ပါတယ်။ TC က နှစ်ပတ်တစ်ကြိမ် online တွေ့ဆုံပြီး observer တွေအတွက် ဖွင့်ထားပါတယ် — အသေးစိတ်: [Express Community](https://expressjs.com/en/resources/community.html#technical-committee)။

## Community Contributing Guide

### ဝေါဟာရ (Vocabulary)

- **Contributor** — issue (သို့) pull request ကို ဖန်တီးသူ (သို့) မှတ်ချက်ပေးသူ
- **Committer** — repository ကို write access ရထားတဲ့ contributors အစုခွဲ
- **Project Captain** — repository တစ်ခုရဲ့ lead maintainer
- **TC (Technical Committee)** — အငြင်းပွားမှုတွေ ဖြေရှင်းဖို့ ကျွမ်းကျင်မှုကို ကိုယ်စားပြုတဲ့ committers အဖွဲ့
- **Triager** — repository ကို triage access ရထားတဲ့ contributors အစုခွဲ

### Issues တင်ခြင်း

မေးခွန်းပဲ ဖြစ်ဖြစ် ပြဿနာပဲ ဖြစ်ဖြစ် — issue တင်လို့ရပြီး မသေချာရင် တင်လိုက်ပါ။ **ချွင်းချက်က security disclosure တွေပါ — သီးသန့် ပို့ရပါမယ်** (အောက်မှာ ကြည့်ပါ)။ Committer တွေက တခြား repo ဆီ ညွှန်းတာ၊ အသေးစိတ် ထပ်မေးတာတွေ လုပ်နိုင်ပြီး — ယဉ်ကျေးလေးစားမှုနဲ့ ဆက်ဆံပါ။ ပါဝင်သူတိုင်းက Code of Conduct ကို လိုက်နာရပါတယ်။

### Contributions များ

Resource တွေကို ပြောင်းလဲမှုတိုင်းက **pull request ကနေပဲ** ဖြစ်ရပါမယ် — documentation, code, binary file အကုန်အပါအဝင်ပါ။ ကြာရှည်နေတဲ့ committer တွေနဲ့ TC members တွေတောင် PR သုံးရပြီး — ဘယ် PR မှ review မခံဘဲ merge လို့မရပါဘူး။ Non-trivial contribution တွေက တခြား timezone က contributors တွေ review လုပ်ဖို့ အနည်းဆုံး **နာရီ 36 ကြာ** စောင့်ထားသင့်ပါတယ်။

Default စည်းမျဉ်းက — committer တစ်ယောက်မှ ကန့်ကွက်မရှိရင် လက်ခံတာပါ။ ကန့်ကွက်မှု ရှိရင် — ဆွေးနွေးခြင်း၊ အပေးအယူ လုပ်ခြင်း (သို့) အဆိုပြုချက် ရုပ်သိမ်းခြင်းနဲ့ **consensus** ရှာပြီး — မရနိုင်ရင် TC ဆီ တင်ပြကာ TC က ပုံမှန် ဆွေးနွေးပြီး ဖြေရှင်းပေးပါတယ်။

### Collaborator ဖြစ်ခြင်း

**Triager** ဖြစ်ဖို့ — လက်ရှိ [organization members](https://github.com/orgs/expressjs/people) တစ်ယောက်ယောက်က အဆိုပြုရပြီး — issues/PRs တွေကို triage လုပ်ရာမှာ တက်ကြွစွာ ကူညီပါ၊ TC meetings နဲ့ Slack discussion တွေမှာ ပါဝင်ပါ။ **Committer** ဖြစ်ဖို့ကတော့ — တန်ဖိုးရှိတဲ့ contributions တွေ ပို့ထားတဲ့ contributors တွေကို အချိန်မီ onboard လုပ်ပြီး write access ပေးပါတယ်။ Committer တွေကိုယ်တိုင်လည်း ဒီ policy အတိုင်း PR ပို့ပြီး review ခံရပါတယ်။

### TC Process, Project Captains နဲ့ Inactivity Policy

TC က "consensus seeking" process သုံးပြီး — ကန့်ကွက်မှုမရှိတဲ့ resolution ရှာပါတယ်။ Consensus မရနိုင်မှသာ **majority vote** နဲ့ ဆုံးဖြတ်ပါတယ်။ TC က အနည်းဆုံး 3 ယောက်၊ အများဆုံး 10 ယောက် ဖြစ်ပြီး — active ဖြစ်ဖို့ လွန်ခဲ့တဲ့ 12 လအတွင်း ပါဝင်မှု ရှိပြီး meetings ခြောက်ခုထက်ပို မပျက်ကွက်ရပါဘူး။ **Project Captains** က project တစ်ခုချင်းစီရဲ့ နေ့စဉ် maintainer တွေဖြစ်ပြီး — repo ownership နဲ့ package ထုတ်ဝေခွင့် ရှိပါတယ်။ Captain ဖြစ်ဖို့ committer အဖြစ် အနည်းဆုံး 6 လ ပါဝင်ထားပြီး GitHub/npm မှာ 2FA ဖွင့်ထားရပါမယ် — အဆိုပြုချက်ကို PR နဲ့ တင်ပြပြီး TC members 2 ယောက်ရဲ့ approval နဲ့ 2 ပတ် စောင့်ဆိုင်းချိန် လိုပါတယ်။

လပေါင်း 6 ဆက်တိုက် အဓိပ္ပါယ်ရှိရှိ မပါဝင်တော့ရင် inactive လို့ သတ်မှတ်ပြီး — emeritus role ဆီ ပြောင်းနိုင်ပါတယ် (ပြန်ပါဝင်ချင်ရင် ပြန်စလို့ရပါတယ်)။ ကိုယ်ရေးကိုယ်တာ (သို့) အလုပ်ကြောင့် ခေတ္တနားချင်ရင် — team (သို့) TC ကို အကြောင်းကြားထားရင် inactivity policy ကို ခေတ္တရပ်နားထားပေးပါတယ်။

### Developer's Certificate of Origin (DCO)

Contributions တွေက [Developer's Certificate of Origin 1.1](https://expressjs.com/en/resources/contributing.html#developers-certificate-of-origin-11) အောက်မှာ လုပ်ရပြီး — ကိုယ်ပိုင် ဖန်တီးထားတာကို open source license အောက်မှာ တင်သွင်းခွင့်ရှိကြောင်း (သို့) ယခင် အလုပ်တွေကို သင့်တော်တဲ့ license အောက်ကနေ ပြန်သုံးထားကြောင်း ကိုယ်တိုင် အာမခံရပါတယ်။

## Collaborator's Guide

- **Tests တွေ အောင်ရမယ်** — [JavaScript Standard Style](https://standardjs.com/) လိုက်နာပြီး `npm run lint` run ရပါမယ်
- Bug ပြင်ရင် — **test တစ်ခုပါ ထည့်ပေးရပါမယ်**
- Branches: လက်ရှိ release အတွက် `master`၊ အနာဂတ် release အတွက် `6.x` လို branch တွေ သုံးပါတယ်

**ပူးပေါင်းပါဝင်ရန် အဆင့်များ:** (1) ပြင်ချင်တဲ့ bug (သို့) feature အတွက် issue ဖန်တီးပါ → (2) GitHub မှာ fork လုပ်ပြီး checkout လုပ်ပါ → (3) local မှာ code ရေးပါ (issue တစ်ခုစီအတွက် branch ခွဲပါ) → (4) `npm install` ပြီးရင် `npm test` run ပါ → (5) `npm run lint` နဲ့ lint ရှင်းပါ → (6) tests အောင်ရင် fork ကနေ pull request တင်ပြီး issue နံပါတ် (ဥပမာ `#123`) ကို ကိုးကားပါ။

ကိုယ်ရေးနေတဲ့ app တစ်ခုခုနဲ့ ဆိုင်တဲ့ မရေရာတဲ့ question issue တွေကို ပိတ်လေ့ရှိပါတယ် — run လို့ရတဲ့ JS code၊ ပြဿနာနဲ့ မျှော်လင့်တဲ့ ရလဒ် ရှင်းလင်းချက်၊ ကိုယ်တိုင် debug လုပ်ထားတဲ့ အဆင့်တွေ ပါမှသာ ကြည့်ခံရနိုင်ပါတယ်။ Maintainer တွေရဲ့ ပါဝင်မှု မလိုဘဲ community input ပဲလိုရင် issue အစား discussion topic အဖြစ် ဖွင့်ပါ။ Website issues တွေကို [expressjs/expressjs.com](https://github.com/expressjs/expressjs.com) မှာ တင်ပါ။

## Security Policies and Procedures

Express ရဲ့ **threat model** က — developer, runtime, application code လို trusted အရာတွေနဲ့ network data လို untrusted အရာတွေကို သတ်မှတ်ပြီး — untrusted data တွေကို လုံခြုံစွာ ကိုင်တွယ်တာက Express ရဲ့ တာဝန်ပါ။ User input ကို sanitize မလုပ်လို့ ဖြစ်တဲ့ prototype pollution၊ static file misconfiguration၊ third-party dependency issues တွေလို အများစုက scope ထဲ မပါဝင်ဘဲ — application developer ရဲ့ တာဝန်ပါ ([Express Threat Model](https://github.com/expressjs/security-wg/blob/main/docs/ThreatModel.md))။

Vulnerability အစီရင်ခံဖို့ — **GitHub Security Advisory** က အနှစ်သက်ဆုံးပါ: သက်ရောက်တဲ့ repository ရဲ့ **Security** tab → **Report a vulnerability** ကို နှိပ်ပါ (report ရဲ့ လျှို့ဝှက်မှုကို ထိန်းသိမ်းရင်း fix ပေါ်မှာ ပူးပေါင်းလို့ရပါတယ်)။ ဒါမှမဟုတ် `express-security@lists.openjsf.org` ကို email ပို့လို့ရပြီး — lead maintainer က 48 နာရီအတွင်း အကြောင်းပြန်ပါလိမ့်မယ်။ Third-party module ပြဿနာဆိုရင် အဲဒီ module ရဲ့ maintainer တွေဆီ အစီရင်ခံပါ။

**Disclosure policy** အရ — security team က primary handler သတ်မှတ်ပြီး — (1) ပြဿနာ အတည်ပြုပြီး သက်ရောက်တဲ့ version တွေ သတ်မှတ်တာ၊ (2) အလားတူ ပြဿနာတွေရှိမရှိ code ကို audit လုပ်တာ၊ (3) ထိန်းသိမ်းနေဆဲ release တွေအားလုံးအတွက် fix ပြင်ဆင်ပြီး npm ဆီ အမြန်ဆုံး ထုတ်ဝေတာတွေ လုပ်ပါတယ်။

## License

Express က **MIT License** အောက်မှာ ထုတ်ဝေထားတဲ့ open source project ဖြစ်ပြီး — logo/marks သုံးရာမှာ [OpenJS trademark policy](https://trademark-policy.openjsf.org/) ကို လိုက်နာရပါတယ်။

## ဆက်စပ်စာမျက်နှာများ

- [Security အကောင်းဆုံး အလေ့အကျင့်များ](/docs/express/security) — vulnerability report လုပ်နည်းကို ညွှန်းထားပါတယ်
- [Resources (အရင်းအမြစ်များ)](/docs/express/resources) — community နဲ့ အခြား resource များ
- [Express Community](https://expressjs.com/en/resources/community.html) — TC members နဲ့ discussion များ
