---
title: "Mock Server Responses များကို Dynamic ဖြစ်အောင် ဖန်တီးခြင်း (Create Dynamic Mock Responses)"
description: "Mock server ကနေ dynamic responses ထုတ်ဖို့ variables နဲ့ templates သုံးနည်း — {{$random...}} dynamic variables၊ {{$body}} စတဲ့ template helpers၊ path variables"
order: 31
source: "https://learning.postman.com/docs/design-apis/mock-apis/create-dynamic-responses/"
status: translated
updated: 2026-09-02
---

Postman ရဲ့ [mock servers](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/) တွေက — [saved examples](/docs/postman/examples) တွေထဲမှာ သတ်မှတ်ထားတဲ့ static responses တွေကို ပြန်ပေးပါတယ်။ Random data တွေ ဒါမှမဟုတ် request အပေါ် မူတည်ပြီး ပြောင်းလဲတဲ့ responses တွေ ပြန်ပေးချင်ရင် — dynamic responses တွေကို generate လုပ်နိုင်ပါတယ်။ Dynamic mock responses တွေနဲ့ဆိုရင် — scenario တစ်ခုချင်းစီအတွက် saved example တစ်ခုစီ ဖန်တီးစရာ မလိုဘဲ အခြေအနေအမျိုးမျိုးကို simulate လုပ်နိုင်ပါတယ်။

## Mock servers တွေမှာ Postman variables တွေ သုံးခြင်း

Collection ရဲ့ requests နဲ့ responses တွေမှာ သုံးဖို့ — [variables](/docs/postman/variables) တွေထဲမှာ တန်ဖိုးတွေ သိမ်းထားနိုင်ပါတယ်။ Variable တစ်ခုရဲ့ တန်ဖိုးကို ပြောင်းလိုက်ရင် — variable ပါတဲ့ နေရာတိုင်းမှာ တန်ဖိုးအသစ်ကို သုံးပါတယ်။ Postman mock servers တွေက [environment variables](/docs/postman/define-variables) နဲ့ [collection variables](/docs/postman/define-variables) တွေကို support လုပ်ပါတယ်။

* Environment variables တွေ သုံးဖို့ — [mock server ရဲ့ configuration](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/#edit-the-mock-server-configuration) ထဲမှာ environment ကို ရွေးပါ။
* Collection variables တွေ သုံးဖို့ — mock လုပ်ထားတဲ့ [collection](/docs/postman/define-variables) ရဲ့ **Variables** tab မှာ သတ်မှတ်ပါ။

Mock servers တွေက [global variables](/docs/postman/define-variables) နဲ့ [vault secrets](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets/) တွေကိုတော့ support မလုပ်ပါဘူး။

Example တစ်ခုထဲမှာ environment ဒါမှမဟုတ် collection variable တစ်ခုကို သုံးတဲ့အခါ — mock server က variable ကို resolve လုပ်ပြီး variable ရဲ့ shared value နဲ့ အစားထိုးပါတယ်။ Environment variable နဲ့ collection variable နာမည်တူနေရင် — Postman က environment variable ကို သုံးပါတယ်။ [Variable scopes](/docs/postman/variables) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

### Dynamic variables

Example တစ်ခုရဲ့ response body ထဲမှာ random data တွေ ပြန်ပေးဖို့ — [dynamic variables](https://learning.postman.com/docs/tests-and-scripts/write-scripts/variables-list/) တွေကို သုံးနိုင်ပါတယ်။ Dynamic variables တွေကို mock server response ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ resolve လုပ်ပြီး — [Faker](https://www.npmjs.com/package/@faker-js/faker) library ကရတဲ့ random data တွေနဲ့ အစားထိုးပါတယ်။ API တစ်ခုကို mock လုပ်တဲ့အခါ random data တွေ generate လုပ်ဖို့ အသုံးဝင်ပြီး — exploratory testing နဲ့ data ကြွယ်ဝတဲ့ (data-driven) tests တွေ ရေးဖို့လည်း သုံးနိုင်ပါတယ်။

ဥပမာ — ကိုယ့် collection ရဲ့ example response body ထဲမှာ အောက်ပါ dynamic variables တွေ ပါနေနိုင်ပါတယ်:

```json
{
    "name": "{{$randomFullName}}",
    "userName": "{{$randomUserName}}",
    "location": "{{$randomCity}}",
    "company": "{{$randomCompanyName}}",
    "jobTitle": "{{$randomJobTitle}}",
    "updatedAt": "{{$timestamp}}"
}
```

Mock server endpoint ကို call လုပ်တဲ့အခါ — response data က အောက်ပါအတိုင်း ပုံစံမျိုး ပြန်လာပါတယ်:

```json
{
    "name": "Cielo McClure",
    "userName": "Aurelie.Lockman",
    "location": "Kubhaven",
    "company": "Runolfsdottir, Bernhard and Hodkiewicz",
    "jobTitle": "Direct Branding Liaison",
    "updatedAt": "1565088856"
}
```

## Templates တွေထဲမှာ contextual mock responses တွေ သုံးခြင်း

*Template* ဆိုတာ — mock server ဆီ ပို့လိုက်တဲ့ request အပေါ် မူတည်ပြီး ပြောင်းလဲတဲ့ responses တွေ ဖန်တီးဖို့ သုံးတဲ့ format တစ်မျိုးပါ။ Template *helpers* တွေက ဝင်လာတဲ့ request ရဲ့ body, query parameters, path segments နဲ့ headers စတဲ့ data တွေကို ရယူခွင့် ပေးပါတယ်။ ဒီ data တွေကို mock server က ပြန်ပို့တဲ့ response ထဲမှာ ထည့်သွင်းနိုင်ပါတယ်။

Request body အတွက် [response matching ဖွင့်ထားတဲ့](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/#match-request-body-and-headers) mock server တစ်ခုပေါ်မှာ contextual responses တွေ generate လုပ်ဖို့ — `x-mock-match-request-body` header ကို `false` လို့ သတ်မှတ်ပါ။ မဟုတ်ရင် `mockRequestNotFoundError` error ရပါလိမ့်မယ်။

Contextual responses တွေ ဖန်တီးဖို့ — mock လုပ်ထားတဲ့ collection ထဲက example တစ်ခုမှာ helper တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ထည့်ပါ:

* `$body` — ဝင်လာတဲ့ request ရဲ့ body ကို ရယူခြင်း။
* `$queryParams` — ဝင်လာတဲ့ request ရဲ့ query parameters တွေကို ရယူခြင်း။
* `$pathSegments` — ဝင်လာတဲ့ request ရဲ့ path segments တွေ (ဥပမာ `/product/id/details`) ကို ရယူခြင်း။
* `$headers` — ဝင်လာတဲ့ request ရဲ့ headers တွေကို ရယူခြင်း။

Helper တစ်ခုရဲ့ သီးခြား တန်ဖိုးတစ်ခုကို ရယူဖို့ ဒါမှမဟုတ် helper ရဲ့ default value တစ်ခု သတ်မှတ်ဖို့ — [object-path](https://www.npmjs.com/package/object-path) syntax ကို သုံးပါ။ Examples တွေထဲမှာ helpers တွေကို သုံးနိုင်တဲ့ နည်းလမ်းတချို့က အောက်ပါအတိုင်းပါ:

* `{{$body}}` — request body တစ်ခုလုံးကို ပြန်ပေးခြင်း။
* `{{$body 'path.to.property'}}` — request body ထဲက property တစ်ခုရဲ့ တန်ဖိုးကို ပြန်ပေးခြင်း။
* `{{$headers 'header-key'}}` — request header တစ်ခုရဲ့ တန်ဖိုးကို ပြန်ပေးခြင်း။
* `{{$queryParams 'parameter-key'}}` — query parameter တစ်ခုရဲ့ တန်ဖိုးကို ပြန်ပေးခြင်း။
* `{{$pathSegments '1'}}` — request path ရဲ့ ဒုတိယ segment ကို ပြန်ပေးခြင်း (ဥပမာ — request path က `/product/12345/details` ဆိုရင် `12345` ကို ပြန်ပေးပါတယ်)။
* `{{$body 'property' 'default value'}}` — property တစ်ခုအတွက် default value သတ်မှတ်ခြင်း။
* `{{$body 'a\.a'}}` — key နာမည်ထဲမှာ dot (`.`) ပါတဲ့ `a.a` ဆိုတဲ့ property ရဲ့ တန်ဖိုးကို ပြန်ပေးခြင်း။

### Contextual response နမူနာ

ဒီနမူနာက template helper တစ်ခုကို သုံးပြီး — ဝင်လာတဲ့ request ရဲ့ body ထဲက data ကို ရယူကာ mock server ရဲ့ response ထဲမှာ ပြန်ပို့နည်းကို ပြပါတယ်။

1. Mock လုပ်ထားတဲ့ collection ထဲမှာ [request အသစ်တစ်ခု ဖန်တီးပြီး](/docs/postman/request-basics) — **Body** tab ထဲက **raw** option ကို ရွေးပါ။ Dropdown list ကနေ **JSON** ကို ရွေးပြီး အောက်ပါအတိုင်း ထည့်ပါ:

   ```json
   {
       "username": "postman",
       "password": "12345"
   }
   ```

2. Request ထဲ [example တစ်ခု ထည့်ပြီး](/docs/postman/examples) — example ရဲ့ response body data ထဲ အောက်ပါအတိုင်း ရိုက်ထည့်ပါ:

   ```json
   {
       "username": "{{$body 'username' 'postman'}}",
       "id": "{{$randomUUID}}"
   }
   ```

   ဒီနမူနာမှာ `{{$body}}` template helper က `username` တန်ဖိုးကို ရယူပါတယ်။

   ![Adding a template helper to an example](https://assets.postman.com/postman-docs/v12/mock-server-template-example-v12-02.png)

3. Request body ထဲက `username` အတွက် တန်ဖိုးအမျိုးမျိုး သုံးပြီး [mock server ဆီ request ပို့ကြည့်ပါ](https://learning.postman.com/docs/design-apis/mock-apis/mock-server-calls/)။ ဥပမာ — အောက်ပါ request body ကို ပို့လိုက်ရင်:

   ```json
   {
       "username": "s-morgenstern",
       "password": "12345"
   }
   ```

   Mock server က request body ထဲက `username` တန်ဖိုးပါတဲ့ response ကို ပြန်ပေးပါတယ်:

   ```json
   {
       "username": "s-morgenstern",
       "id": "1ad6b425-5ebf-4864-98e0-7bb44c318bac"
   }
   ```

### Path variables တွေကို responses တွေထဲမှာ သုံးခြင်း

ကိုယ့် example ရဲ့ URL မှာ နာမည်ပေးထားတဲ့ path variable တစ်ခု (ဥပမာ `/users/:userId`) ပါနေရင် — ဝင်လာတဲ့ request မှာ အဲဒီ variable အတွက် ပါလာတဲ့ တန်ဖိုးကို response body ထဲမှာ နာမည်နဲ့တည့်တည့် ကိုးကားနိုင်ပါတယ်။ Variable နာမည်ကို double curly braces တွေထဲ ထည့်ပါ — ဥပမာ `{{userId}}` ပေါ့။ ဒါက `$pathSegments` helper သုံးခြင်းရဲ့ အခြားနည်းလမ်းတစ်ခု ဖြစ်ပြီး — URL တစ်ခုထဲမှာ path variables အများကြီး ပါတဲ့အခါ ဖတ်ရ ပိုလွယ်နိုင်ပါတယ်။

ဥပမာ — ကိုယ့် example ရဲ့ URL က `https://example.com/users/:userId` ဖြစ်ပြီး response body က အောက်ပါအတိုင်းဆိုရင်:

```json
{
    "id": "{{userId}}"
}
```

`/users/42` ဆီ request တစ်ခု ပို့လိုက်ရင် အောက်ပါအတိုင်း ပြန်လာပါတယ်:

```json
{
    "id": "42"
}
```
