---
title: "Postman အမြန်စတင်ခြင်း (Quick Start)"
description: "Postman နဲ့ ပထမဆုံး API request ပို့နည်း — collection ထဲမှာ request သိမ်းနည်း၊ API response ကို စစ်ဆေးတဲ့ test တစ်ခု ရေးနည်း"
order: 13
source: "https://learning.postman.com/docs/getting-started/quick-start/"
status: translated
updated: 2026-09-02
---

Postman ရဲ့ API client ကို သုံးပြီး HTTP, GraphQL, gRPC စတဲ့ [requests](https://learning.postman.com/docs/getting-started/basics/postman-elements/#requests) တွေကို ဖန်တီး ပို့လို့ရပါတယ်။ Endpoint တစ်ခုဆီ request ပို့ပြီး data source တစ်ခုကနေ data တွေ ယူနိုင်သလို — API တစ်ခုရဲ့ လုပ်ဆောင်ချက်တွေကိုလည်း စမ်းသပ်နိုင်ပါတယ်။

ဒီ quick start လမ်းညွှန်ထဲမှာ — Postman Echo API ကို သုံးပြီး ကိုယ့်ရဲ့ ပထမဆုံး API request ကို ပို့ပြီး — response ကို Postman ထဲမှာ တိုက်ရိုက် မြင်ရမှာ ဖြစ်ပါတယ်။ Request တစ်ခုကို collection ထဲမှာ သိမ်းနည်းနဲ့ API response ကို အတည်ပြုဖို့ basic test တစ်ခု ရေးနည်းကိုလည်း လေ့လာရမှာပါ။

## API request တစ်ခု ပို့ခြင်း

[Postman desktop app ကို download လုပ်ပြီး install လုပ်ထားဖို့ လိုပါတယ်](https://learning.postman.com/docs/getting-started/installation/overview/)။ အဆင်သင့်ဖြစ်တဲ့အခါ — Postman desktop app ကို ဖွင့်ပြီး ကိုယ့်ရဲ့ ပထမဆုံး API request ကို ပို့လိုက်ပါ။

1. Workbench ထဲမှာ **Add** ကို နှိပ်ပြီး [tab](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#tabs) အသစ်တစ်ခု ဖွင့်ပါ။
2. Request URL နေရာမှာ `postman-echo.com/get` လို့ ရိုက်ထည့်ပါ။
3. **Send** ကို နှိပ်ပါ။

Postman က server ကနေ ပြန်ပို့လိုက်တဲ့ response data ကို အောက်ဘက် pane မှာ ပြသပေးပါတယ်။ ဒီပုံမှာ မြင်ရတဲ့အတိုင်း — URL bar ထဲမှာ `postman-echo.com/get` ထည့်ထားပြီး **Send** နှိပ်လိုက်တဲ့အခါ — အောက်က **Response** pane ထဲမှာ server ကနေ ပြန်ပို့တဲ့ response ပေါ်လာပါတယ်။ Status code (`200 OK`) အပြင် response body ထဲက JSON data ကိုပါ တစ်ခါတည်း မြင်ရပါတယ်။

### ဒါတွေ ဘယ်လို အလုပ်လုပ်လဲ

ဒီဥပမာမှာ Postman က client application အဖြစ် ဆောင်ရွက်ပြီး — API server တစ်ခုနဲ့ ဆက်သွယ်ပါတယ်။ **Send** ကို နှိပ်လိုက်တဲ့အခါ ဖြစ်ပျက်သွားတာတွေက:

1. Postman က `postman-echo.com` မှာ တည်ရှိတဲ့ [Postman Echo API](https://learning.postman.com/docs/reference/developer-resources/echo-api/) server ဆီ GET request တစ်ခု ပို့ပါတယ်။
2. API server က request ကို လက်ခံပြီး process လုပ်ကာ — Postman ဆီ response တစ်ခု ပြန်ပို့ပါတယ်။
3. Postman က response ကို လက်ခံပြီး **Response** pane ထဲမှာ ပြသပါတယ်။

## Collection တစ်ခု ဖန်တီးပြီး request ကို သိမ်းခြင်း

[Collection](https://learning.postman.com/docs/getting-started/basics/postman-elements/#collections) အသစ်တစ်ခု ဖန်တီးပြီး request တစ်ခုကို သိမ်းလို့ရပါတယ်။ Collection ဆိုတာ — folders တွေထဲမှာ စနစ်တကျ စုစည်းထားလို့ရတဲ့ သိမ်းပြီးသား requests တစ်စုပါ။ Responses, documentation နဲ့ tests တွေကိုလည်း collection ထဲမှာ သိမ်းနိုင်ပါတယ်။ Collection တွေက အလုပ်တွေ စနစ်ကျနေအောင် ကူညီပေးသလို — ကိုယ့်အလုပ်တွေကို team ဖော်တွေနဲ့ မျှဝေဖို့လည်း အထောက်အကူ ပြုပါတယ်။

Collection အသစ်တစ်ခု ဖန်တီးပြီး အဲဒီထဲမှာ request ကို သိမ်းဖို့:

1. မရသေးဘူးဆိုရင် — [Postman desktop app ကို install လုပ်ပြီး](https://learning.postman.com/docs/getting-started/installation/overview/) [Postman ထဲ sign in ဝင်ထားပါ](https://learning.postman.com/docs/getting-started/installation/account/sign-up-for-postman/)။
2. Request builder ထဲမှာ **Save** ကို နှိပ်ပါ။
3. **New Collection** ကို နှိပ်ပြီး collection ကို နာမည်ပေးပါ။ ဒီ dialog ထဲမှာ — collection အသစ်တစ်ခုကို နာမည်ပေးပြီး ဖန်တီးနိုင်သလို — ရှိပြီးသား collection တစ်ခုကိုလည်း ရွေးချယ်နိုင်ပါတယ်။
4. Request ကို collection ထဲ ထည့်ဖို့ **Save** ကို နှိပ်ပါ။

Request ကို သိမ်းပြီးတာနဲ့ — collection အသစ်နဲ့ request နှစ်ခုလုံးက sidebar ထဲက **Collections** အောက်မှာ စာရင်းဝင်သွားပါတယ်။

Collection တွေအကြောင်း ပိုလေ့လာချင်ရင် — [Collections overview](https://learning.postman.com/docs/use/use-collections/overview/) ကို ကြည့်နိုင်ပါတယ်။

## API request အတွက် test တစ်ခု ရေးခြင်း

*API tests* (API စမ်းသပ်မှုများ) တွေက — ကိုယ့် API က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေလားဆိုတာ သေချာအောင် စစ်ဆေးတဲ့ နည်းလမ်းတစ်ခုပါ။ ဥပမာ — data မပြည့်စုံတဲ့ ဒါမှမဟုတ် parameter တွေ မှားနေတဲ့ request တစ်ခု ပို့ပြီး — API ရဲ့ error handling ကို အတည်ပြုတဲ့ test တစ်ခု ရေးနိုင်ပါတယ်။ Postman မှာ ကိုယ့် API requests တွေအတွက် tests တွေကို JavaScript နဲ့ ရေးပြီး — [request](/docs/postman/create-requests) တစ်ခုချင်းစီ၊ [collections](https://learning.postman.com/docs/use/send-requests/create-requests/intro-to-collections/) နဲ့ collection ထဲက folders တွေမှာ ထည့်နိုင်ပါတယ်။ Postman မှာ code snippets တွေ ပါပြီးသားမို့ — ကိုယ့် test logic နဲ့ ကိုက်ညီအောင် ထည့်ပြီး ပြောင်းလဲ သုံးနိုင်ပါတယ်။

Test တစ်ခု ရေးဖို့:

1. Request ထဲမှာ **Scripts** tab ကို နှိပ်ပြီး — **Post-response** ကို နှိပ်ပါ။
2. Code editor ရဲ့ အောက်ညာဘက်က **Snippets** ကို နှိပ်ပြီး — **Status code: Code is 200** ကို ရွေးပါ။ ဒါဆိုရင် အောက်ပါ test code ဝင်လာပါလိမ့်မယ်:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

3. **Send** ကို နှိပ်ပါ။

Request run ပြီးတာနဲ့ test ကလည်း run ပါတယ်။ Response section ထဲမှာ — **Test Results** ကို နှိပ်ပြီး test ရဲ့ ရလဒ်တွေကို ပြန်လည် သုံးသပ်နိုင်ပါတယ်။

Test ရေးနည်းအကြောင်း ပိုလေ့လာချင်ရင် — [API response data တွေကို စမ်းသပ်ဖို့ scripts ရေးနည်း](/docs/postman/testing) ကို ကြည့်နိုင်ပါတယ်။

Debugging လုပ်ရာမှာ အကူအညီ လိုအပ်နေလား။ Postman ရဲ့ [Discord community](https://discord.gg/postman) မှာ developer တွေနဲ့ ချိတ်ဆက်ပြီး — Postman ကျွမ်းကျင်သူတွေနဲ့ တခြား user တွေဆီကနေ မေးခွန်းတွေ မေး၊ အကူအညီတွေ ရယူနိုင်ပါတယ်။
