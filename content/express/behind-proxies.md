---
title: "Reverse proxy နောက်ကွယ်မှ Express"
description: "Express.js app တွေကို reverse proxy နောက်ကွယ်မှာ မှန်ကန်စွာ အလုပ်လုပ်အောင် ဘယ်လို configure လုပ်မလဲ — trust proxy setting နဲ့ client IP address ကို ကိုင်တွယ်ခြင်း"
order: 13
source: "https://expressjs.com/en/guide/behind-proxies.html"
status: translated
updated: 2026-09-01
---

Express app တစ်ခုကို reverse proxy နောက်ကွယ်မှာ run လုပ်တဲ့အခါ — Express API တချို့က မျှော်လင့်ထားတာနဲ့ မတူတဲ့ တန်ဖိုးတွေ ပြန်ပေးနိုင်ပါတယ်။ ဒါကို ချိန်ညှိဖို့ `trust proxy` application setting ကို သုံးပြီး — reverse proxy က ပေးပို့တဲ့ အချက်အလက်တွေကို Express API တွေထဲမှာ ဖော်ပြနိုင်အောင် လုပ်နိုင်ပါတယ်။ အဖြစ်အများဆုံး ပြဿနာကတော့ — client ရဲ့ IP address ကို ဖော်ပြပေးတဲ့ Express API တွေက reverse proxy ရဲ့ internal IP address ကို ပြသလာတာပါ။

> **မှတ်ချက်:** `trust proxy` setting ကို configure လုပ်တဲ့အခါ — reverse proxy ရဲ့ တည်ဆောက်ပုံ (setup) ကို အတိအကျ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ ဒီ setting က request ထဲက တန်ဖိုးတွေကို ယုံကြည်မှာ ဖြစ်လို့ — Express ထဲက setting ရဲ့ ပေါင်းစပ်မှုဟာ reverse proxy ရဲ့ လုပ်ဆောင်ပုံနဲ့ ကိုက်ညီဖို့ အရေးကြီးပါတယ်။

`trust proxy` application setting ကို အောက်ပါ table ထဲက တန်ဖိုးတစ်ခုခု အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

| Type | Value |
| --- | --- |
| Boolean | `true` — client IP ကို `X-Forwarded-For` header ရဲ့ ဘယ်ဘက်ဆုံး entry အနေနဲ့ မှတ်ယူတယ် / `false` — app က client ကို တိုက်ရိုက် ရင်ဆိုင်နေတာလို့ မှတ်ပြီး client IP ကို `req.socket.remoteAddress` ကနေ ယူတယ် (default) |
| IP addresses | Reverse proxy အဖြစ် ယုံကြည်ရမယ့် IP address, subnet, ဒါမှမဟုတ် IP address နဲ့ subnet တွေရဲ့ array |
| Number | Express application ကနေ အကွာအဝေး (hops) အများဆုံး `n` ခုရှိတဲ့ address ကို သုံးတယ် |
| Function | ကိုယ်ပိုင် trust implementation |

### Boolean

`true` ဆိုရင် — client ရဲ့ IP address ကို `X-Forwarded-For` header ရဲ့ ဘယ်ဘက်ဆုံး entry အနေနဲ့ နားလည်ပါတယ်။

`false` ဆိုရင် — app က client ကို တိုက်ရိုက် ရင်ဆိုင်နေတာလို့ နားလည်ပြီး client ရဲ့ IP address ကို `req.socket.remoteAddress` ကနေ ဆင်းသက်စေပါတယ်။ ဒါက default setting ပါ။

> **သတိပြုရန်:** `true` ဆိုပြီး သတ်မှတ်တဲ့အခါ — ယုံကြည်ထားတဲ့ (trusted) နောက်ဆုံး reverse proxy က အောက်ပါ HTTP header တွေ အားလုံးကို ဖျက်ပစ်တာ/ပြန်ရေးထားတာ သေချာစေရမယ်: `X-Forwarded-For`, `X-Forwarded-Host`, နဲ့ `X-Forwarded-Proto` ။ မဟုတ်ရင် client က ဘာတန်ဖိုးမဆို ပေးနိုင်တဲ့ အန္တရာယ် ရှိပါတယ်။

### IP addresses

Reverse proxy အဖြစ် ယုံကြည်ရမယ့် IP address တစ်ခု၊ subnet တစ်ခု၊ ဒါမှမဟုတ် IP address နဲ့ subnet တွေရဲ့ array တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ အောက်ပါစာရင်းက ကြိုတင် configure လုပ်ထားတဲ့ subnet အမည်တွေပါ:

- loopback — `127.0.0.1/8`, `::1/128`
- linklocal — `169.254.0.0/16`, `fe80::/10`
- uniquelocal — `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `fc00::/7`

IP address တွေကို အောက်ပါ နည်းလမ်းတွေထဲက ဘယ်နည်းနဲ့မဆို သတ်မှတ်နိုင်ပါတယ်:

```js
app.set('trust proxy', 'loopback'); // specify a single subnet
app.set('trust proxy', 'loopback, 123.123.123.123'); // specify a subnet and an address
app.set('trust proxy', 'loopback, linklocal, uniquelocal'); // specify multiple subnets as CSV
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']); // specify multiple subnets as an array
```

သတ်မှတ်လိုက်တဲ့အခါ — IP address တွေ ဒါမှမဟုတ် subnet တွေကို address ဆုံးဖြတ်ခြင်း လုပ်ငန်းစဉ်ကနေ ဖယ်ထုတ်ပြီး — application server နဲ့ အနီးဆုံးရှိတဲ့ untrusted IP address ကို client ရဲ့ IP address အဖြစ် ဆုံးဖြတ်ပါတယ်။ ဒါက `req.socket.remoteAddress` ကို trusted ဟုတ်မဟုတ် စစ်ဆေးပြီး အလုပ်လုပ်ပါတယ်။ Trusted ဆိုရင် — `X-Forwarded-For` ထဲက address တစ်ခုစီကို ညာဘက်ကနေ ဘယ်ဘက်ကို ပထမဆုံး non-trusted address ရောက်တဲ့အထိ စစ်ဆေးပါတယ်။

### Number

Express application ကနေ အကွာအဝေး (hops) အများဆုံး `n` ခုရှိတဲ့ address ကို သုံးပါ။ `req.socket.remoteAddress` က ပထမဆုံး hop ဖြစ်ပြီး — ကျန်တာတွေကို `X-Forwarded-For` header ထဲမှာ ညာဘက်ကနေ ဘယ်ဘက်ကို ရှာပါတယ်။ တန်ဖိုး `0` ဆိုရင် — ပထမဆုံး untrusted address က `req.socket.remoteAddress` ဖြစ်ပြီး reverse proxy မရှိဘူးလို့ ဆိုလိုပါတယ်။

> **သတိပြုရန်:** ဒီ setting ကို သုံးတဲ့အခါ — Express application ဆီကို ရောက်တဲ့ path တွေ မတူညီတဲ့ အရှည်အမျိုးမျိုး (multiple, different-length paths) မရှိဖို့ သေချာစေရမယ်။ မဟုတ်ရင် client က သတ်မှတ်ထားတဲ့ hops အရေအတွက်ထက် နည်းတဲ့ အကွာအဝေးကနေ ရောက်လာနိုင်ပြီး — ဘာတန်ဖိုးမဆို ပေးပို့နိုင်တဲ့ အန္တရာယ် ရှိပါတယ်။

### Function

ကိုယ်ပိုင် trust implementation တစ်ခု သတ်မှတ်နိုင်ပါတယ်:

```js
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123')
    return true; // trusted IPs
  else return false;
});
```

```ts
app.set('trust proxy', (ip: string) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123')
    return true; // trusted IPs
  else return false;
});
```

## `trust proxy` ကို enable လုပ်ရင် ဘာတွေ ဖြစ်လာမလဲ

`trust proxy` ကို enable လုပ်တာက အောက်ပါ သက်ရောက်မှုတွေ ရှိပါတယ်:

- [req.hostname](https://expressjs.com/en/api.html#reqhostname) ရဲ့ တန်ဖိုးကို `X-Forwarded-Host` header ထဲက တန်ဖိုးကနေ ဆင်းသက်စေတယ် — အဲဒီ header ကို client ကလည်း သတ်မှတ်နိုင်သလို proxy ကလည်း သတ်မှတ်နိုင်ပါတယ်။
- `X-Forwarded-Proto` ကို reverse proxy က သတ်မှတ်ပြီး — app ကို `https` လား၊ `http` လား၊ ဒါမှမဟုတ် invalid name တစ်ခုလားဆိုတာ ပြောပြနိုင်ပါတယ်။ ဒီတန်ဖိုးကို [req.protocol](https://expressjs.com/en/api.html#reqprotocol) မှာ ထင်ဟပ်ဖော်ပြပါတယ်။
- [req.ip](https://expressjs.com/en/api.html#reqip) နဲ့ [req.ips](https://expressjs.com/en/api.html#reqips) တန်ဖိုးတွေကို socket address နဲ့ `X-Forwarded-For` header ကို အခြေခံပြီး — ပထမဆုံး untrusted address ကစ၍ — ဖြည့်ပေးပါတယ်။

`trust proxy` setting ကို [proxy-addr](https://www.npmjs.com/package/proxy-addr) package နဲ့ implement လုပ်ထားပါတယ်။ အသေးစိတ်ကို အဲဒီ package ရဲ့ documentation မှာ ကြည့်နိုင်ပါတယ်။
