---
title: "Mocks တွေထဲမှာ requests နဲ့ examples တွေကို ကိုးကားခြင်း (Reference requests and examples in mocks)"
description: "pm.mock object နဲ့ mocks တွေထဲမှာ incoming requests တွေကို ကိုက်ညီစေပြီး responses တွေ ပို့ခြင်း — matchRequest နဲ့ sendExample methods တွေ, path variables, query parameters နဲ့ request body matching"
order: 119
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-mock/"
status: translated
updated: 2026-09-03
---

`pm.mock` object က mock တစ်ခုနဲ့အတူ incoming requests တွေကို ကိုက်ညီစေပြီး responses တွေ ပို့ဖို့အတွက် — structured ဖြစ်ပြီး Postman-aware ဖြစ်တဲ့ functions တွေကို ပေးပါတယ်။ `pm.mock` API က အရာအားလုံးကို hard-code လုပ်မယ့်အစား — ကိုယ့်မှာ ရှိပြီးသား save ထားတဲ့ Postman examples တွေကနေ responses တွေကို ပေးနိုင်ပါတယ်။

## pm.mock

Incoming requests တွေကို ကိုက်ညီစေပြီး responses တွေ ပို့ဖို့ — ကိုယ့်မှာ ရှိပြီးသား save ထားတဲ့ Postman examples တွေကနေ လာတဲ့ responses တွေ အပါအဝင် — `pm.mock` methods တွေကို သုံးပါ။

အောက်က ဥပမာတွေထဲမှာ `<request-path>` နဲ့ `<example-path>` တွေက ကိုယ့် local Git repo ထဲက save ထားတဲ့ request တစ်ခုနဲ့ [example](/docs/postman/examples) တစ်ခုဆီ ရောက်တဲ့ path တွေအတွက် placeholder တွေပါ။ Example ရဲ့ status code, headers နဲ့ body အားလုံးကို response အနေနဲ့ ပို့ပါတယ်။

Path တွေကို ကိုယ်တိုင် ရှာနေစရာ မလိုအောင် — Postman က mock code editor ထဲမှာ တိုက်ရိုက် ရှာလို့ရတဲ့ dropdown တစ်ခုကို ပေးပါတယ်။ Argument ကို click လုပ်လိုက်တဲ့အခါ dropdown list တစ်ခု ပေါ်လာပြီး — ကိုယ့် workspace ထဲက requests နဲ့ examples တွေကို နာမည် ဒါမှမဟုတ် path နဲ့ ရှာနိုင်ပါတယ်။

### pm.mock.matchRequest()

Incoming request တစ်ခုကို Postman request တစ်ခုနဲ့ ၎င်းရဲ့ method, path, query parameters နဲ့ body တို့အပေါ် အခြေခံပြီး ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးပါတယ်။ Incoming request က သတ်မှတ်ထားတဲ့ criteria တွေနဲ့ ကိုက်ညီရင် `true` ကို ပြန်ပေးပါတယ်။

ဥပမာ:

```js
if (pm.mock.matchRequest('<request-path>', req)) {
  res.status(200).json([{ id: 1, name: 'Alice' }]);
  return;
}
```

### pm.mock.sendExample()

Save ထားတဲ့ Postman example တစ်ခုကို HTTP response အနေနဲ့ ပို့ပါတယ်။ ဒါက ကိုယ့်မှာ ရှိပြီးသား Postman collection data တွေနဲ့ ကိုယ့် mock ကြားက အဓိက integration point ပါ။

```js
if (pm.mock.matchRequest('<request-path>', req)) {
  pm.mock.sendExample('<example-path>', res);
  return;
}
```

အောက်မှာတော့ `pm.mock` API ကို သုံးထားတဲ့ ဥပမာ အပြည့်အစုံပါ:

```js
// Match GET /users and serve the saved "List Users - 200 OK" example
if (pm.mock.matchRequest('<get-users-request-path>', req)) {
  pm.mock.sendExample('<list-users-200-example-path>', res);
  return;
}

// Match GET /users/:id with a path variable
if (pm.mock.matchRequest('<request-path>', req)) {
  if (req.params.id === '999') {
    res.status(404).json({ error: 'User not found' });
  } else {
    pm.mock.sendExample('<get-user-200-example-path>', res);
  }
  return;
}

// Match POST /users
if (pm.mock.matchRequest('<request-path>', req)) {
  pm.mock.sendExample('<create-user-201-example-path>', res);
  return;
}

res.status(404).json({ error: 'Route not matched' });
```

### Path variable တွေကို ကိုက်ညီခြင်း (Path variable matching)

Matching algorithm က path variables တွေကို ပံ့ပိုးပါတယ် — ဒါတွေက `:` နဲ့ အစပြုထားတဲ့ URL segments တွေဖြစ်ပြီး အဲဒီ နေရာမှာ ဘယ် value နဲ့မဆို ကိုက်ညီပါတယ်။

ဥပမာ:

```js wordWrap
// Matches /products/42, /products/abc, /products/anything
if (pm.mock.matchRequest('<request-path>', req)) {
  console.log('Requested product ID:', req.params.id);
  res.status(200).json({ id: req.params.id, name: 'Example Product' });
  return;
}

// Nested path variables also work
if (pm.mock.matchRequest('<request-path>', req)) {
  res.status(200).json({
    orgId: req.params.orgId,
    userId: req.params.userId
  });
  return;
}
```

### Query parameters တွေကို ကိုက်ညီခြင်း (Query parameter matching)

Query parameter matching က ကိုယ့် saved request မှာ query parameters တွေ declare လုပ်ထားမှသာ အကျုံးဝင်ပါတယ်။ Saved request တစ်ခုက ၎င်းတို့ကို နည်းနှစ်နည်းနဲ့ declare လုပ်ပါတယ် — request ပေါ်မှာ enabled ဖြစ်နေတဲ့ parameter rows တွေအနေနဲ့ ဒါမှမဟုတ် saved request URL ပေါ်မှာ query string အနေနဲ့ ပါ။ Enabled မဟုတ်တဲ့ parameter rows တွေကိုတော့ ဖယ်ထုတ်ပါတယ်။ Saved request မှာ query parameters တွေ declare လုပ်ထားတာ မရှိရင် — ဒီစစ်ဆေးမှုကို ကျော်လိုက်ပြီး incoming request ပေါ်က ဘယ် query string ကိုမဆို လက်ခံပါတယ်။

ကိုယ့် saved request မှာ query parameters တွေ declare လုပ်ထားတယ်ဆိုရင် — incoming request က ကိုက်ညီဖို့ ၎င်းတို့အားလုံးကို ဖြည့်ဆည်းပေးရပါတယ်:

* Declare လုပ်ထားတဲ့ parameter key တိုင်းက incoming request ထဲမှာ ပါဝင်နေရပါမယ်။ Key တစ်ခု ပျောက်နေရင် match မဖြစ်ပါဘူး။
* Values တွေက ကိုက်ညီရပါမယ်။ နှိုင်းယှဉ်မှုက string-based ဖြစ်လို့ — `1` နဲ့ `"1"` တို့ကို တူညီတဲ့ value အနေနဲ့ သတ်မှတ်ပါတယ်။
* Keys တွေက case-sensitive ဖြစ်ပါတယ်။ `role` နဲ့ `Role` တို့က မတူညီတဲ့ parameters တွေပါ။
* URL-encoded ဖြစ်နေတဲ့ values တွေကို နှိုင်းယှဉ်ခင် decode လုပ်ပါတယ် — ဒါကြောင့် `hello%20world` က `hello world` နဲ့ ကိုက်ညီပါတယ်။
* Variable တစ်ခုတည်း သက်သက်ဖြစ်တဲ့ value — ဥပမာ `{{workspaceId}}` — က empty ကလွဲပြီး ဘယ် value နဲ့မဆို ကိုက်ညီပါတယ်။ `?ws=` ကတော့ match မဖြစ်ပါဘူး။
* စာသားထဲမှာ မြှုပ်ထားတဲ့ variable — ဥပမာ `v{{n}}` — က pattern တစ်ခုအနေနဲ့ ကိုက်ညီပြီး variable ရှိတဲ့ နေရာမှာ အနည်းဆုံး character တစ်လုံး လိုအပ်ပါတယ်။ `v2` က ကိုက်ညီပြီး `v` ကတော့ မကိုက်ညီပါဘူး။
* Saved request မှာ key တစ်ခုတည်းကို တစ်ကြိမ်ထက်ပိုပြီး declare လုပ်ထားရင် — အဲဒီ key အတွက် နောက်ဆုံး value ကသာ ကိုက်ညီရမယ့် value ဖြစ်ပါတယ်။
* Incoming request ပေါ်မှာ အပိုပါလာတဲ့ query parameters တွေကိုတော့ လျစ်လျူရှုပါတယ်။ ၎င်းတို့က match ဖြစ်တာကို မတားဆီးပါဘူး။

`?role=admin&ws={{workspaceId}}` ဆိုတဲ့ saved request တစ်ခုအတွက်:

| Incoming request | ရလဒ် |
| --- | --- |
| `?role=admin&ws=abc` | Match ဖြစ်ပါတယ် |
| `?role=admin&ws=abc&page=2` | Match ဖြစ်ပါတယ် — extra parameter ကို လျစ်လျူရှုပါတယ် |
| `?role=admin` | Match မဖြစ်ပါဘူး — `ws` ပျောက်နေပါတယ် |
| `?role=user&ws=abc` | Match မဖြစ်ပါဘူး — `role` value မှားနေပါတယ် |
| `?role=admin&ws=` | Match မဖြစ်ပါဘူး — variable က empty ဖြစ်လို့ မရပါဘူး |

### Request body တွေကို ကိုက်ညီခြင်း (Request body matching)

Request body matching က ကိုယ့် saved request မှာ body ရှိမှသာ အကျုံးဝင်ပါတယ်။ မရှိရင် — ဒီစစ်ဆေးမှုကို ကျော်လိုက်ပြီး incoming body ကို လျစ်လျူရှုပါတယ်။ ကိုယ့် saved request မှာ body ရှိတယ်ဆိုရင် — incoming request body က ၎င်းနဲ့ ကိုက်ညီရပါမယ်:

* Matching က JSON bodies တွေမှာပဲ အကျုံးဝင်ပါတယ်။ Postman က incoming body ကို JSON အနေနဲ့ parse လုပ်လို့ — valid JSON မဟုတ်တဲ့ body က match မဖြစ်နိုင်ပါဘူး။ Form-encoded နဲ့ plain-text bodies တွေက saved body တစ်ခုနဲ့ ဘယ်တော့မှ match မဖြစ်ပါဘူး။
* Structure က nesting level တိုင်းမှာ အတိအကျ ကိုက်ညီရပါမယ် — keys တွေ တူညီရပြီး key အရေအတွက်လည်း တူညီရပါတယ်။ Extra fields ရော ပျောက်နေတဲ့ fields တွေပါ — nested objects တွေရဲ့ အတွင်းမှာ အပါအဝင် — match ကို မအောင်မြင်စေပါဘူး။ ဒါက extra values တွေကို လျစ်လျူရှုတဲ့ query parameters တွေနဲ့ မတူညီပါဘူး။
* Values တွေက type-sensitive ဖြစ်ပါတယ်။ `1` က `"1"` နဲ့ match မဖြစ်ပါဘူး။ ဒါက နှိုင်းယှဉ်မှု string-based ဖြစ်တဲ့ query parameters တွေနဲ့ မတူပါဘူး။
* Arrays တွေက တူညီတဲ့ length နဲ့ တူညီတဲ့ အစီအစဉ် ရှိရပါမယ်။ `[1,2]` က `[2,1]` နဲ့ match မဖြစ်ပါဘူး။
* Variable တစ်ခုဖြစ်တဲ့ saved string value — ဥပမာ `{{userId}}` — က empty string နဲ့ `null` အပါအဝင် ဘယ် value နဲ့မဆို ကိုက်ညီပါတယ်။
* Incoming request က body မပို့ဘဲ — saved body ထဲက value တိုင်း variable ဖြစ်နေရင် match ဖြစ်ပါတယ်။ `{}` ဆိုတဲ့ saved body ကတော့ incoming body က `{}` အတိအကျ ဖြစ်ဖို့ လိုအပ်ပါတယ်။

ဥပမာ — `{ "status": "active", "id": "{{userId}}" }` ဆိုတဲ့ saved body တစ်ခုက `{ "status": "active", "id": "42" }` ဆိုတဲ့ incoming body တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ `{ "status": "active", "id": "42", "page": 2 }` နဲ့ကတော့ match မဖြစ်ပါဘူး — အကြောင်းက incoming body မှာ extra field တစ်ခု ပါနေလို့ပါ။

Matching algorithm က HTTP method, URL path, query parameters နဲ့ request body တို့ပေါ်မှာ ကိုက်ညီမှုကို စစ်ဆေးပါတယ်။ Request headers တွေပေါ်မှာတော့ မစစ်ဆေးပါဘူး။
