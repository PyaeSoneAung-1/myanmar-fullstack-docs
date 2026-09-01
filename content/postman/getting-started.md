---
title: "Postman မိတ်ဆက်"
description: "Postman ဆိုတာ ဘာလဲ၊ ပထမဆုံး request ပို့နည်း၊ collection နဲ့ environment သုံးနည်း — API စမ်းသပ်ခြင်း"
order: 1
source: "https://learning.postman.com/docs/getting-started/introduction/"
status: translated
updated: 2026-09-01
---

## Postman ဆိုတာ ဘာလဲ

**Postman** က API တွေကို **ဖန်တီး, စမ်းသပ်, documentation လုပ်, share** လုပ်ဖို့
အသုံးများဆုံး platform ပါ။ API request တွေကို code မရေးဘဲ GUI ကနေ
ပို့ကြည့်လို့ရတာကြောင့် — developer တွေ, tester တွေ, API design လုပ်သူတွေ
အားလုံး သုံးပါတယ်။

Postman နဲ့ လုပ်လို့ရတဲ့ အဓိကအရာတွေ:

- HTTP request တွေ ပို့ခြင်း — GET, POST, PUT, DELETE စသဖြင့်
- Response ကို လှပစွာ ကြည့်ရှုခြင်း — JSON pretty print, status code, headers
- **Collections** — request တွေကို စုစည်းသိမ်းဆည်းပြီး ပြန်သုံးခြင်း
- **Environments** — variable တွေနဲ့ setup တစ်ခုကို နေရာမျိုးစုံ (dev/prod) မှာ သုံးခြင်း
- API documentation, mock server, automated tests (scripts)

## Installation

[postman.com/downloads](https://www.postman.com/downloads/) ကနေ desktop app ကို
download လုပ်ပြီး install လုပ်ပါ — Windows, macOS, Linux အားလုံး
ထောက်ပံ့ပါတယ်။ Install ပြီးရင် app ဖွင့်ပြီး Postman account နဲ့
sign in လုပ်ပါ (free plan နဲ့ စလို့ရပါတယ်)။

## ပထမဆုံး request ပို့ကြည့်မယ်

1. Postman ဖွင့်ပြီး ဘယ်ဘက်အပေါ်က **New** → **HTTP Request** ကို နှိပ်ပါ
2. Method ကို **GET** ထားပြီး URL နေရာမှာ ရိုက်ထည့်ပါ:

```
https://jsonplaceholder.typicode.com/posts/1
```

3. **Send** ကို နှိပ်လိုက်ပါ

အောက်မှာ response တွေ့ရပါမယ် — status code (`200 OK`), response time, size နဲ့
body ထဲမှာ JSON data ပါ။ Postman က JSON ကို အရောင်ခွဲပြီး လှပစွာ
ပြပေးပါတယ်:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit..."
}
```

## Query parameter နဲ့ Header တွေ ထည့်ခြင်း

Request ထဲမှာ parameters နဲ့ headers တွေ ထည့်လို့ရပါတယ်:

- **Params tab** — URL ရဲ့ query string ကို key-value အနေနဲ့ ထည့်လို့ရတယ်
  (ဥပမာ `?limit=5`)
- **Headers tab** — `Authorization`, `Content-Type` စတဲ့ header တွေ ထည့်တယ်
- **Body tab** — POST/PUT လုပ်တဲ့အခါ JSON/XML/form data ပို့တယ်

## Collection — request တွေကို စုစည်းခြင်း

**Collection** က request တွေကို အုပ်စုဖွဲ့သိမ်းတဲ့ folder လိုပါ — API တစ်ခုလုံးရဲ့
request တွေကို collection တစ်ခုထဲမှာ ထားပြီး နောက်မှ တစ်ချက်နှိပ်နဲ့
ပြန်ဖွင့်လို့ရတယ်။

Collection တစ်ခု ဖန်တီးရန်:

1. **Collections** sidebar မှာ **+** ကို နှိပ်ပြီး name ပေးပါ
2. Request တစ်ခုကို **Save As** လုပ်ပြီး အဲဒီ collection ထဲမှာ သိမ်းပါ
3. Collection ကို share လုပ်လို့ရတယ် — team ဝင်တွေ တူတူသုံးလို့ရတယ်

## Environment — variable တွေသုံးခြင်း

**Environment** က variable တွေကို သိမ်းပြီး request တွေထဲမှာ
`{{variableName}}` ပုံစံနဲ့ သုံးလို့ရပါတယ်။ ဥပမာ — `{{baseUrl}}` ဆိုတဲ့ variable
တစ်ခုကို dev environment မှာ `http://localhost:3000`, production မှာ
`https://api.example.com` လို့ ထားနိုင်ပြီး request တွေကို မပြောင်းဘဲ
environment ပြောင်းရုံနဲ့ သုံးလို့ရပါတယ်။

```
Environment: Development
  baseUrl = http://localhost:3000
  token   = dev-token-123
```

Request ထဲမှာ: `GET {{baseUrl}}/api/posts`

## Automation — scripts နဲ့ test

Postman က request အပြီးမှာ run မယ့် JavaScript scripts တွေ ထည့်လို့ရပါတယ်:

```js
// Tests tab ထဲမှာ — response ကို စစ်ဆေးတဲ့ test
pm.test("Status code က 200 ဖြစ်ရမယ်", () => {
  pm.response.to.have.status(200);
});

pm.test("Response ထဲမှာ id ပါရမယ်", () => {
  const data = pm.response.json();
  pm.expect(data.id).to.exist;
});
```

ဒီလို tests တွေနဲ့ **Collection Runner** ကို သုံးပြီး API တစ်ခုလုံးကို
အလိုအလျောက် စမ်းသပ်လို့ရပါတယ်။

## နောက်တစ်ဆင့်တွေ

Postman ကိုယ်တိုင် မလိုဘဲ API စမ်းသပ်ချင်ရင် curl လည်း သုံးလို့ရပါတယ် —
ဒါပေမယ့် Postman က request history, collections, environments, tests
စတဲ့ အဆင်ပြေမှုတွေ အများကြီး ပိုပေးပါတယ်။
[Express routing](/docs/express/routing) မှာ API route တွေ ဘယ်လို ရေးသလဲ
ဆက်ကြည့်နိုင်ပါတယ်။
