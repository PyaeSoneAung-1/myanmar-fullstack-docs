---
title: "Postman Visualizations တွေကို script လုပ်ခြင်း (Script Postman Visualizations)"
description: "pm.visualizer object နဲ့ pm.getData method သုံးပြီး API request responses တွေကို Postman Visualizer နဲ့ မြင်သာအောင် ဖော်ပြခြင်း"
order: 89
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-visualizer/"
status: translated
updated: 2026-09-02
---

`pm.visualizer` object နဲ့ `pm.getData` method တွေကို သုံးပြီး သင့် API ရဲ့ request responses တွေကို [Postman Visualizer](/docs/postman/visualizer) နဲ့ မြင်သာအောင် ကိုယ်စားပြုနိုင်ပါတယ်။

## pm.visualizer

Postman Visualizer ထဲမှာ response data တွေကို ဖော်ပြဖို့ သုံးချင်တဲ့ template တစ်ခုကို သတ်မှတ်ဖို့ `pm.visualizer.set` method ကို သုံးပါ:

```js
pm.visualizer.set(layout:String, data:Object, options:Object):Function
```

ဒီ method က အောက်ပါ properties တွေကို သုံးပါတယ်:

* `layout` — (လိုအပ်သည်) [Handlebars](https://handlebarsjs.com/) HTML template string တစ်ခုပါ။
* `data` — Template နဲ့ ချိတ်ဆက်ပေးတဲ့ JSON object တစ်ခုပါ။ Template string ထဲမှာ ဒါကို access လုပ်နိုင်ပါတယ်။
* `options` — `Handlebars.compile()` အတွက် [Options object](https://handlebarsjs.com/api-reference/compilation.html) တစ်ခုပါ။

ဥပမာ:

```js
var template = `<p>{{res.info}}</p>`;
pm.visualizer.set(template, {
    res: pm.response.json()
});
```

## pm.getData

Postman Visualizer template string တစ်ခုထဲမှာ response data တွေကို ရယူဖို့ `pm.getData` method ကို သုံးပါ။

```js
pm.getData(callback):Function
```

`callback` function က အောက်ပါ parameters တွေကို လက်ခံပါတယ်:

* `error` — Error အသေးစိတ်တစ်ခုခုပါ။
* `data` — `pm.visualizer.set` method က template ဆီကို ပေးပို့လိုက်တဲ့ data ပါ။

ဥပမာ:

```js
pm.getData(function (error, data) {
  var value = data.res.info;
});
```
