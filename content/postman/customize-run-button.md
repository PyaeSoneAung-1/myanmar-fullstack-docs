---
title: "ကိုယ့် Run in Postman button ကို customize လုပ်ခြင်း (Customize your Run in Postman button)"
description: "Custom code တွေနဲ့ Run in Postman button ကို customize လုပ်ခြင်း — Postman ရဲ့ _pm() method ကို သုံးပြီး environments တွေ ဖန်တီး/တည်းဖြတ်/အစားထိုး/ဖယ်ရှားခြင်း၊ button အများအပြားအတွက် segregateEnvironments သုံးခြင်းနဲ့ environments တွေ အားလုံး ရယူခြင်း"
order: 166
source: "https://learning.postman.com/docs/publishing-your-api/run-in-postman/customize-run-button/"
status: translated
updated: 2026-09-03
---

API publisher တစ်ယောက်အနေနဲ့ — [**Run in Postman** button](/docs/postman/creating-run-button) ထဲကို information တွေကို environment variables တွေအနေနဲ့ dynamically (လှုပ်ရှားမှုရှိရှိ) ထည့်သွင်းနိုင်ပါတယ်။ ဒီ button ကို ကိုယ့် website ရဲ့ client-side code ထဲမှာ customize လုပ်ပြီး embed လုပ်နိုင်တာမို့ — users တွေက Postman ရဲ့ `_pm()` method ကို သုံးပြီး ကိုယ့် API ဆီ calls တွေ စတင် လုပ်နိုင်ပါတယ်။ **Run in Postman** button က click လုပ်တဲ့ users တွေကို — ကိုယ့် collection နဲ့ environment ကို သူတို့ရဲ့ Postman workspace ထဲ [fork](/docs/postman/creating-run-button) လုပ်စေပါတယ်။

## Environment အသစ်တစ်ခု ဖန်တီးခြင်း

`env.create` method ကို သုံးပြီး — environment အသစ်, ဗလာ (empty) တစ်ခုကို ဖန်တီးပါ:

```javascript
_pm('env.create', 'environment_name', {key: value}, runButtonIndex);
```

#### သတိပြုရန်

ဒီ method ကို environments တွေ duplicate လုပ်ဖို့ သုံးလို့ မရပါဘူး။ ရှိပြီးသား environment names တွေကို သုံးပြီး လုပ်တဲ့ calls တွေ အားလုံး fail ဖြစ်ပါလိမ့်မယ်။

ကိုယ့် user က ရိုက်ထည့်တဲ့ API keys တွေကို သုံးပြီး environment အသစ်တစ်ခု ဖန်တီးပါ:

```javascript
function () {
  var stagingKey = document.getElementById('staging-key-input').value,
    productionKey = document.getElementById('production-key-input').value,
    runButtonIndex = 0,
    envData = {
      stagingKey: stagingKey,
      productionKey: productionKey
    };

  _pm('env.create', 'API Keys', envData, runButtonIndex);
}
```

`env.create` method က အောင်မြင်ရင် — page ပေါ်က **Run in Postman** buttons တွေနဲ့ ဆက်စပ်နေတဲ့ environments စုစုပေါင်း အရေအတွက်ကို return လုပ်ပြီး — မအောင်မြင်ရင် `false` ကို return လုပ်ပါတယ်။

#### မှတ်ချက်

ဒါက environment တစ်ခုကို ဖန်တီးပေးပေမယ့် — အဲဒါကို active environment အဖြစ် သတ်မှတ်မပေးပါဘူး။

## User တစ်ယောက်ရဲ့ sign-in credentials တွေကို ပေးပို့ခြင်း

User ရဲ့ sign-in credentials တွေ ပါဝင်တဲ့ environment တစ်ခု ဖန်တီးပါ:

```javascript
_pm('env.create', 'Spotify', {
  user_id: 'spotifyuser',
  authorization: 'Bearer 1234xyzd'
});
```

## Environment တစ်ခုကို တည်းဖြတ်ခြင်း

`env.assign` method ကို သုံးပြီး environment တစ်ခုကို update လုပ်ပါ:

```javascript
_pm('env.assign', 'environment_name', {key: new_value, new_key: value}, preventOverride, runButtonIndex);
```

ဒီ method က — **Run in Postman** button ကို ဖန်တီးတုန်းက ပါဝင်ခဲ့တဲ့ environments တွေ ဒါမှမဟုတ် `env.create` method နဲ့ ထည့်ထားတဲ့ environments တွေအတွက် အလုပ်လုပ်ပါတယ်။

#### သတိပြုရန်

ဒီ method ကို environments အသစ်တွေ ဖန်တီးဖို့ သုံးလို့ မရပါဘူး။ Environment က အရင်ကတည်းက မရှိဘူးဆိုရင် — `env.assign` method ကို သုံးပြီး လုပ်တဲ့ calls တွေ အားလုံး fail ဖြစ်ပါတယ်။

Environment တစ်ခုရဲ့ API keys တွေကို update လုပ်ပါ:

```javascript
function () {
  var stagingKey = document.getElementById('staging-key-input').value,
    productionKey = document.getElementById('production-key-input').value,
    preventOverride = true,
    runButtonIndex = 0,
    envData = {
      stagingKey: stagingKey,
      productionKey: productionKey
    };

  _pm('env.assign', 'API Keys', envData, preventOverride, runButtonIndex);
}
```

`env.assign` method က အောင်မြင်ရင် `true` ကို return လုပ်ပြီး — မအောင်မြင်ရင် `false` ကို return လုပ်ပါတယ်။

## Environment တစ်ခုကို အစားထိုးခြင်း

`env.replace` method ကို သုံးပြီး — environment တစ်ခုရဲ့ အကြောင်းအရာ တစ်ခုလုံးကို အစားထိုးပါ:

```javascript
_pm('env.replace', 'environment_name', {key: value}, runButtonIndex);
```

`env.replace` method က အောင်မြင်ရင် `true` ကို return လုပ်ပြီး — မအောင်မြင်ရင် `false` ကို return လုပ်ပါတယ်။

#### သတိပြုရန်

မရှိသေးတဲ့ environment တစ်ခုကို ဒီ method နဲ့ အစားထိုးလို့ မရပါဘူး။

## Environment တစ်ခုကို ဖယ်ရှားခြင်း

`env.remove` method ကို သုံးပြီး — ရှိပြီးသား environment တစ်ခုကို ဖယ်ရှားပါ:

```javascript
_pm('env.remove', 'environment_name', runButtonIndex);
```

`env.remove` method က အောင်မြင်ရင် `true` ကို return လုပ်ပြီး — မအောင်မြင်ရင် `false` ကို return လုပ်ပါတယ်။

#### သတိပြုရန်

Environment က ရှိပြီးသား ဖြစ်ရပါမယ် — မဟုတ်ရင် ဒီ method က fail ဖြစ်ပါလိမ့်မယ်။

## Button အများအပြားကို သီးခြား environments တွေနဲ့ သုံးခြင်း

Page တစ်ခုတည်းမှာ button အများအပြား embed လုပ်နိုင်ပါတယ်။ **Run in Postman** button တစ်ခုချင်းစီအတွက် environment မတူညီအောင် ထည့်သွင်းဖို့ — `segregateEnvironments` property ကို enable လုပ်ပါ:

```javascript
_pm('_property.set', 'segregateEnvironments', true);
```

`segregateEnvironments` ကို enable လုပ်ထားရင် — page ရဲ့ [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) ထဲမှာ button တစ်ခုချင်းစီရဲ့ နေရာ (position) အလိုက် ရည်ညွှန်းဖို့ — `_pm()` methods တွေ အားလုံးမှာ `runButtonIndex` ကို အသုံးပြုရပါမယ်:

```javascript
var runButtons = Array.prototype.slice.call(document.getElementsByClassName('postman-run-button')),
  runButtonIndex = runButtons.indexOf(elem);
```

#### မှတ်ချက်

`segregateEnvironments` က default အနေနဲ့ deactivate လုပ်ထားတာမို့ — `runButtonIndex` က default အားဖြင့် optional ပါ။

### jQuery အတွက် index ကို အသုံးပြုခြင်း

`postman-run-button` query နဲ့ ကိုက်ညီတဲ့ element တွေ အားလုံးရဲ့ index ပါဝင်တဲ့ jQuery object တစ်ခု ပြန်ရဖို့ အောက်ပါအတိုင်း အသုံးပြုပါ:

```javascript
var runButtonIndex = $('postman-run-button').index(elem);
```

Response ထဲမှာ — query နဲ့ ကိုက်ညီတဲ့ element တွေ အားလုံးအတွက် index location တွေ ပါဝင်ပါတယ်။

## Environments တွေ အားလုံး ရယူခြင်း

Environments တွေ အားလုံးကို ပြန်ယူဖို့ `get()` method ကို အသုံးပြုပါ:

```javascript
_pm('_property.get', 'environments');
```

ဒါက — ရနိုင်တဲ့ environments တွေရဲ့ array တစ်ခု ပါဝင်တဲ့ response တစ်ခုကို return လုပ်ပါတယ်:

```json
[
  {
    "button_index": 0,
    "name": "env1",
    "values": [
      {
        "key": "testKey",
        "value": "testValue",
        "enabled": true
      }
    ]
  }
]
```

## နောက်ထပ် ဆောင်ရွက်စရာများ

**Run in Postman** button တစ်ခု ဖန်တီးပြီးတဲ့နောက် — public workspace တစ်ခုမှာ documentation တစ်ခု ဖန်တီးခြင်းအားဖြင့် ကိုယ့် API ကို users တွေနဲ့ share လုပ်နိုင်ပါတယ်။

* Postman မှာ API documentation ဖန်တီးနည်း လေ့လာဖို့ — [Postman မှာ APIs တွေကို documentation လုပ်ခြင်း](/docs/postman/api-documentation-overview) ကို ကြည့်ပါ။
* ကိုယ့် documentation ကို ကိုယ့် public workspaces တွေထဲမှာ ထည့်သွင်းနည်း လေ့လာဖို့ — [Postman မှာ documentation publish လုပ်ခြင်း](/docs/postman/publishing-your-docs) ကို ကြည့်ပါ။
