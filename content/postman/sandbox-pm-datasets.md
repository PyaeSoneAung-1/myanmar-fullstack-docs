---
title: "Scripts တွေထဲမှာ datasets တွေကို စီမံခန့်ခွဲပြီး သုံးခြင်း (Manage and use datasets in scripts)"
description: "pm.datasets function သုံးပြီး scripts နဲ့ mocks တွေထဲကနေ datasets တွေကို SQL နဲ့ query လုပ်ခြင်း — dataset load လုပ်ခြင်း, executeView, executeQuery"
order: 90
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-datasets/"
status: translated
updated: 2026-09-02
---

`pm.datasets` function က script တစ်ခုကနေ (collection runs နဲ့ monitors တွေမှာ ပံ့ပိုးထားသည်) ဒါမှမဟုတ် [mock](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) တစ်ခုကနေ [datasets](https://learning.postman.com/docs/tests-and-scripts/datasets/overview/) တွေကို access ပေးပါတယ်။ သင့် script ဒါမှမဟုတ် mock run လုပ်တဲ့အခါ data တွေကို ပြန်ရယူဖို့ SQL သုံးပြီး datasets တွေကို query လုပ်နိုင်ပါတယ်။ ဒါက သင့် scripts နဲ့ mocks တွေကို static values တွေအစား — dynamic ဖြစ်ပြီး data-driven ဖြစ်တဲ့ responses တွေ ပြန်ပေးနိုင်စေပါတယ်။

Methods အားလုံးက asynchronous ဖြစ်ပြီး Promises တွေ ပြန်ပေးလို့ — ၎င်းတို့ရဲ့ ရလဒ်တွေကို ရယူဖို့ `await` ကို သုံးပါ။ Query results တွေက rows တွေကို async iterable တစ်ခုအနေနဲ့ ပြန်ပေးလို့ — ပြန်ရတဲ့ rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။

[Scripts နဲ့ mocks တွေထဲမှာ datasets တွေ သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/datasets/use-datasets) အကြောင်း ပိုလေ့လာပါ။

`pm.datasets` function ကို Cloud View ထဲက mock code editor မှာ ပံ့ပိုးမထားပါဘူး။

## pm.datasets

`pm.datasets` function က script တစ်ခု ဒါမှမဟုတ် mock တစ်ခုကနေ datasets တွေကို access ပေးပါတယ်။ Dataset တစ်ခုကို ၎င်းရဲ့ ID နဲ့ load လုပ်ပြီး — dataset ကို query လုပ်ဖို့ ဒါမှမဟုတ် views တွေကို စီမံခန့်ခွဲဖို့ methods တွေကို သုံးနိုင်ပါတယ်။

### pm.datasets(datasetId:String)

Dataset တစ်ခုကို load လုပ်ပြီး — dataset နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ သုံးလို့ရတဲ့ handle တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const ds = pm.datasets('menu-id');
```

### dataset.executeView(viewId:String, params?:String\[])

Dataset ထဲမှာ သတ်မှတ်ပြီးသား view တစ်ခုကို run လုပ်ပြီး — ရလဒ်တွေကို ပြန်ပေးပါတယ်။ Query rows တွေကို async iterable တစ်ခုအနေနဲ့ ပြန်ပေးလို့ — rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။

```js
const ds = pm.datasets('menu-id');

const result = await ds.executeView(
  'view-id',
  ['pizza']
);

const allRows = [];

for await (const row of result.rows) {
  allRows.push(row);
}
```

### dataset.executeQuery(sql:String, params?:String\[])

Dataset ကို ဆန့်ကျင်ပြီး custom SQL query တစ်ခုကို run လုပ်ပြီး — ရလဒ်တွေကို ပြန်ပေးပါတယ်။ Query rows တွေကို async iterable တစ်ခုအနေနဲ့ ပြန်ပေးလို့ — rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။

```js
const ds = pm.datasets('menu-id');

const result = await ds.executeQuery(
  'SELECT * FROM menu WHERE category = ?',
  ['pizza']
);

const allRows = [];

for await (const row of result.rows) {
  allRows.push(row);
}
```
