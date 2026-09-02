---
title: "Collection runs တွေမှာ scripts သုံးခြင်း (Use scripts in collection runs)"
description: "pm.execution object သုံးပြီး collection run အတွင်း requests တွေအကြောင်း အချက်အလက်ရယူခြင်း — pm.execution.runRequest, skipRequest, setNextRequest, location"
order: 87
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-execution/"
status: translated
updated: 2026-09-02
---

`pm.execution` object က [collection run](/docs/postman/intro-to-collection-runs) တစ်ခုအတွင်းမှာ — requests တွေ ပို့ခြင်း၊ ဘယ် request က run နေတာ ဖြစ်ခြင်း၊ collection ထဲမှာ ၎င်းရဲ့ တည်နေရာ၊ run နဲ့ ဆက်စပ်တဲ့ metadata စတဲ့ — requests တွေနဲ့ ၎င်းတို့ရဲ့ responses တွေအကြောင်း အချက်အလက်နဲ့ context တွေကို ပေးပါတယ်။

## pm.execution.runRequest method

သင့် collections တွေထဲမှာ သိမ်းထားတဲ့ HTTP requests တွေကို ပို့ဖို့ pre-request ဒါမှမဟုတ် post-response script တစ်ခုထဲမှာ `pm.execution.runRequest` method ကို သုံးပါ။

*Referenced request* ဆိုတာ method ထဲမှာ ကိုးကားထားတဲ့ request ပါ။ *Root request* ဆိုတာ method ကို ခေါ်လိုက်တဲ့ request ဒါမှမဟုတ် collection ပါ။ Script တစ်ခုစီကနေ method ကို အများဆုံး 10 ကြိမ်အထိ ခေါ်နိုင်ပါတယ်။

Request တစ်ခုကို သင့် script ထဲမှာ တိုက်ရိုက် ရေးချင်ရင်တော့ — [pm.sendRequest](/docs/postman/sandbox-pm-send-request) method ကို သုံးပါ။

ဒီ method ကို သုံးတဲ့အခါ အောက်ပါတွေကို သတိပြုပါ:

* `pm.execution.runRequest` method ကို Newman ဒါမှမဟုတ် Postman VS Code extension တွေမှာ ပံ့ပိုးမထားပါဘူး။
* `pm.execution.setNextRequest` နဲ့ [pm.visualizer](/docs/postman/sandbox-pm-visualizer) methods တွေက referenced request ထဲမှာ run မှာ မဟုတ်ပါဘူး။
* Referenced request က ၎င်းရဲ့ pre-request script ထဲမှာ `pm.execution.skipRequest` method ကို သုံးထားရင် — အဲဒီ referenced request က run မှာ မဟုတ်ပါဘူး။ `pm.execution.runRequest` method က response အနေနဲ့ `null` တန်ဖိုးကို ပြန်ပေးပါတယ်။
* Referenced request က [pm.vault](/docs/postman/sandbox-pm-vault) methods တွေကို သုံးပြီး root request က မတူညီတဲ့ collection တစ်ခုထဲမှာ ဆိုရင် — သင့် vault secrets တွေကို [script တွေဆီကို ဝင်ခွင့်ပေးဖို့](/docs/postman/sandbox-pm-vault) prompt ပေါ်လာပါလိမ့်မယ်။
* Referenced request က [pm.cookies.jar](/docs/postman/sandbox-pm-cookies) ကို သုံးထားရင် — referenced request ရဲ့ URL ကို root request ရဲ့ [domain allowlist](/docs/postman/cookies) ထဲမှာ ထည့်ထားကြောင်း သေချာအောင် လုပ်ပါ။

Collection တစ်ခုကို [export လုပ်တဲ့အခါ](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/) request IDs တွေက ထိန်းသိမ်းမထားပါဘူး။ `pm.execution.runRequest` method သုံးပြီး requests တွေကို ကိုးကားထားတဲ့ collection တစ်ခုကို import လုပ်ရင် — root request ထဲမှာ request IDs တွေကို update လုပ်ဖို့ လိုပါလိမ့်မယ်။

### Variable တွေကို ဖြေရှင်းခြင်း (Variable resolution)

Variables တွေကို ဖြေရှင်းတဲ့အခါ `pm.execution.runRequest` method က အောက်ပါ အစဉ်အတိုင်း သုံးပါတယ် — အနိမ့်ဆုံး priority ကနေ အမြင့်ဆုံး priority အထိ:

* Global variables
* Root request ရဲ့ collection variables
* Referenced request ရဲ့ collection variables
* Environment variables
* Data variables
* Local variables
* `pm.execution.runRequest` method ရဲ့ ဒုတိယ argument အနေနဲ့ ပေးထားတဲ့ variable overrides တွေ

Postman ရဲ့ variables အတွက် resolution precedence အကြောင်း — [Variable scopes](/docs/postman/variables) ကို ကြည့်ပါ။

### Argument များ (Arguments)

`pm.execution.runRequest` method က အောက်ပါ arguments တွေကို လက်ခံပါတယ်:

* ပထမ argument အနေနဲ့ — `pm.execution.runRequest` method က referenced request ရဲ့ request ID ကို လက်ခံပါတယ်။ Argument ကို ရိုက်ထည့်တဲ့အခါ request dropdown list က ပေါ်လာပါတယ်။ Request ဒါမှမဟုတ် collection ရဲ့ နာမည်ကို ရိုက်ထည့်ပြီး — dropdown list ကနေ request တစ်ခုကို ရွေးပါ။ Dropdown list က လက်ရှိ workspace နဲ့ သင့်မှာ access ရှိတဲ့ workspace တွေထဲက requests တွေကို ပြပါတယ်။ Request ID ဒါမှမဟုတ် [request ဆီကို link](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#renaming-and-linking-elements) တစ်ခုကိုလည်း ရိုက်ထည့်နိုင်ပါတယ်။ Argument က referenced request ရဲ့ method နဲ့ နာမည်ကို ပြပြီး — ဒါကို နှိပ်ပြီး argument ကို update လုပ်နိုင်ပါတယ်။

  Request တစ်ခုရဲ့ ID ကို ရဖို့ — request တစ်ခုရဲ့ [right sidebar](https://learning.postman.com/docs/getting-started/basics/navigating-postman/#right-sidebar) ထဲမှာ **Info** ကို နှိပ်ပြီး — **Copy request ID** ကို နှိပ်ပါ။

* ဒုတိယ argument အနေနဲ့ — method က request ထဲမှာ ကိုးကားထားတဲ့ variables တွေကို override လုပ်တဲ့ options object တစ်ခုကို လက်ခံပါတယ်။ Method က variable တွေကို ဖြေရှင်းတဲ့ အစဉ်အကြောင်းကို အထက်မှာ လေ့လာနိုင်ပါတယ်။

(ပုံ — Collection ထဲမှာ သိမ်းထားတဲ့ request တစ်ခုကို ပို့ဖို့ scripts တွေ သုံးခြင်း)

Root request ကို ပို့တဲ့အခါ — referenced request က ၎င်းရဲ့ collection ထဲမှာ configure လုပ်ထားတဲ့အတိုင်း run ပါတယ်။ ဒီထဲမှာ သတ်မှတ်ထားတဲ့ parameters, headers, variables, test scripts စတာတွေ ပါဝင်ပါတယ်။ ဥပမာ — referenced request ရဲ့ scripts တွေထဲမှာ [test assertions](/docs/postman/sandbox-pm-test-expect) ရှိရင် — method ကို ခေါ်လိုက်တဲ့ root request မှာ test results တွေ ပေါ်ပါတယ်။ နောက်ဥပမာတစ်ခု — referenced request က ၎င်းရဲ့ parent elements တစ်ခုခုမှာ သတ်မှတ်ထားတဲ့ variables တွေကို ကိုးကားထားရင် — root request ကို ပို့တဲ့အခါ အဲဒီ variable values တွေကို သုံးပါတယ်။

Method က သင့် scripts တွေထဲမှာ asynchronously run ပြီး — method ရဲ့ ပြီးစီးမှု ဒါမှမဟုတ် မအောင်မြင်မှုကို ကိုယ်စားပြုတဲ့ Promise object တစ်ခုကို ပြန်ပေးပါတယ်။ Promise နဲ့ ၎င်းရဲ့ ရလဒ်တန်ဖိုးကို စောင့်ဖို့ method ရဲ့ ရှေ့မှာ `await` operator ကို ထည့်ပါ။ Method က `await` operator မပါဘဲလည်း သင့် script ထဲမှာ run နိုင်ပေမယ့် — မျှော်လင့်ထားတဲ့အတိုင်း အပြုအမူ မဖြစ်နိုင်ပါဘူး။

### ဥပမာများ (Examples)

အောက်ပါ ဥပမာထဲမှာ ပြထားတဲ့ syntax ကို သုံးပါ:

```js
try {
  const response = await pm.execution.runRequest(
    "12345678-12345ab-1234-1ab2-1ab2-ab1234112a12",
    {
      variables: {
        base_url: "https://example.com",
        vip: "123"
      }
    }
  );

  console.log("Response received from collection request with status:", response.code, response.json());
}
catch (error) {
  console.error("Failed to send a request from the collection", error);
}
```

## pm.execution.skipRequest

`pm.execution.skipRequest` method က [pre-request script](/docs/postman/pre-request-scripts) တစ်ခုကနေ request တစ်ခုရဲ့ run ကို ရပ်တန့်နိုင်စေပါတယ်။

```js
pm.execution.skipRequest()
```

`pm.execution.skipRequest` method ကို request, collection ဒါမှမဟုတ် folder တစ်ခုရဲ့ **Pre-request** tab ထဲမှာ သုံးနိုင်ပါတယ်။ `pm.execution.skipRequest()` ကို တွေ့ရှိရတဲ့အခါ — request ကို မပို့ပါဘူး။ **Pre-request** tab ထဲက ကျန်နေတဲ့ scripts တွေကိုလည်း ကျော်သွားပြီး — tests တွေ ဘာမှ run မှာ မဟုတ်ပါဘူး။

[Collection Runner](/docs/postman/running-collections-overview) ထဲမှာ `pm.execution.skipRequest()` ကို တွေ့ရှိရတဲ့အခါ — Postman က လက်ရှိ request (၎င်းရဲ့ post-response scripts တွေ အပါအဝင်) ကို ကျော်ပြီး — နောက် request တစ်ခုကို အစီအစဉ်အတိုင်း ဆက်သွားပါတယ်။ Run results တွေမှာ အဲဒီ request အတွက် response မရှိ၊ tests မတွေ့ရဘူးလို့ ပြပါလိမ့်မယ်။ ဒီအပြုအမူတစ်ခုတည်းက [Postman Flows](https://learning.postman.com/flows/overview/) နဲ့ [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) တွေမှာလည်း အလားတူ သက်ရောက်ပါတယ်။

`pm.execution.skipRequest` method ကို request, collection ဒါမှမဟုတ် folder တစ်ခုရဲ့ **Post-response** tab ထဲမှာ ပံ့ပိုးမထားပြီး — အဲဒီမှာ သုံးရင် ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ ဒါ့အပြင် `TypeError: pm.execution.skipRequest isn't a function` ဆိုတဲ့ Console error တစ်ခုလည်း ရပါလိမ့်မယ်။

### ဥပမာများ (Examples)

Authentication token တစ်ခု မရှိရင် request တစ်ခုကို ကျော်လိုက်ပါ:

```js
if (!pm.environment.get('token')) {
  pm.execution.skipRequest()
}
```

## pm.execution.setNextRequest

[Collection Runner](/docs/postman/running-collections-overview) ကို သုံးတဲ့အခါ request workflows တွေ တည်ဆောက်ဖို့ `pm.execution.setNextRequest` method ကို သုံးနိုင်ပါတယ်။

`setNextRequest` က **Send** ကို သုံးပြီး requests တွေ run လုပ်တဲ့အခါ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ Collection တစ်ခုကို run လုပ်တဲ့အခါမှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။

Collection Runner နဲ့ collection တစ်ခုကို run လုပ်တဲ့အခါ — Postman က သင့် requests တွေကို default order အတိုင်း ဒါမှမဟုတ် run ကို သတ်မှတ်တဲ့အခါ သင် သတ်မှတ်လိုက်တဲ့ order အတိုင်း run ပါတယ်။ ဒါပေမယ့် — နောက်တစ်ခု run ရမယ့် request ကို သတ်မှတ်ဖို့ `pm.execution.setNextRequest` ကို သုံးပြီး ဒီ run order ကို override လုပ်နိုင်ပါတယ်။

### ဥပမာများ (Examples)

ဒီ request ပြီးရင် သတ်မှတ်ထားတဲ့ request ကို run ပါ (`requestName` က collection ထဲက request ရဲ့ နာမည် ဖြစ်ပြီး ဥပမာ "Get customers"):

```bash
pm.execution.setNextRequest(requestName:String):Function
```

ဒီ request ပြီးရင် သတ်မှတ်ထားတဲ့ request ကို run ပါ (`requestId` က `pm.info.requestId` က ပြန်ပေးတဲ့ request ID ဖြစ်သည်):

```js
//script in another request calls:
//pm.environment.set('next', pm.info.requestId)
pm.execution.setNextRequest(pm.environment.get('next'));
```

## pm.execution.location

`pm.execution.location` property က request တစ်ခုရဲ့ လမ်းကြောင်း အပြည့်အစုံကို — ၎င်းရဲ့ parent folder နဲ့ collection အပါအဝင် — array format နဲ့ ရယူနိုင်စေပါတယ်။

Request တစ်ခု ပို့လိုက်တဲ့အခါ ဘယ် items တွေ run မလဲ နားလည်ဖို့ သင့် scripts တွေထဲမှာ `pm.execution.location` နဲ့ `pm.execution.location.current` properties တွေကို သုံးနိုင်ပါတယ်။ ဒီအချက်အလက်က သင့် API testing ဒါမှမဟုတ် collection structure အတွင်းက လက်ရှိ location နဲ့ အံဝင်ခွင်ကျဖြစ်တဲ့ logic နဲ့ actions တွေကို သင့် scripts တွေထဲမှာ အကောင်အထည်ဖော်နိုင်စေပါတယ်။

### ဥပမာများ (Examples)

**C1** collection ထဲက **F1** folder ထဲမှာ ရှိတဲ့ **R1** လို့ အမည်ရတဲ့ request တစ်ခုအတွက် — အောက်ပါ post-response script code က `["C1", "F1", "R1"]` array ကို ပြန်ပေးပါတယ်:

```js
console.log(pm.execution.location);
```

လက်ရှိ element ရဲ့ နာမည်ကို ရဖို့ `pm.execution.location.current` property ကို သုံးပါ။ ဥပမာ — **F1** လို့ အမည်ရတဲ့ folder တစ်ခုရဲ့ pre-request script ထဲမှာ အောက်ပါ code ကို ထည့်ရင် `F1` ကို ပြန်ပေးပါတယ်:

```js
console.log(pm.execution.location.current);
```
