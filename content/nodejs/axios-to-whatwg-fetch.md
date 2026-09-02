---
title: "Axios မှ WHATWG Fetch သို့"
description: "Axios HTTP client ကနေ Node.js မှာ native ပါတဲ့ global fetch (WHATWG Fetch API) ဆီ codemod နဲ့ ပြောင်းရွှေ့ခြင်း — request helpers mapping, GET/POST/form/config/require ဥပမာများနဲ့ ကန့်သတ်ချက်များ"
order: 67
source: "https://nodejs.org/learn/userland-migrations/axios-to-whatwg-fetch"
status: translated
updated: 2026-09-02
---

ဒီ codemod က [Axios](https://axios-http.com) HTTP client နဲ့ ရေးထားတဲ့ code တွေကို — Node.js မှာ native အနေနဲ့ global [`fetch`](https://nodejs.org/docs/latest/api/globals.html#fetch) အဖြစ် ပါဝင်တဲ့ [WHATWG Fetch](https://fetch.spec.whatwg.org) API ဆီ ပြောင်းရွှေ့ပေးပါတယ် — dependency တွေ လျော့ကျစေပြီး performance ပိုကောင်းစေပါတယ်။ ဒါက Axios request helper တိုင်းကို ပြန်ရေးပေးပါတယ် — `axios.request()`, `axios.get()`, `axios.delete()`, `axios.head()`, `axios.options()`, `axios.post()`, `axios.put()`, `axios.patch()`, `axios.postForm()`, `axios.putForm()` နဲ့ `axios.patchForm()` — ပြီးတော့ default ESM imports, aliased imports, CommonJS `require()` calls တွေနဲ့ dynamic `import()` တွေကိုပါ မှတ်မိနားလည်ပါတယ်။ Call sites အားလုံး ပြောင်းပြီးတာနဲ့ — `package.json` ထဲက `axios` နဲ့ `@types/axios` entries တွေကိုလည်း ဖယ်ရှားပေးပါတယ်။

## အသုံးပြုပုံ (Usage)

ဒီ codemod ကို ဒီလို run ပါ:

```sh
npx codemod @nodejs/axios-to-whatwg-fetch
```

## ဥပမာများ

### GET request

သာမန် `axios.get()` တစ်ခုက — `response.data` property ကို ဆက်အလုပ်လုပ်နေစေမယ့် shim တစ်ခုပါတဲ့ `fetch()` call အဖြစ် ပြောင်းသွားပါတယ်:

```diff
-import axios from "axios";
 const base = "https://dummyjson.com/todos";

-const all = await axios.get(base);
+const all = await fetch(base)
+  .then(async (res) => Object.assign(res, { data: await res.json() }))
+  .catch(() => null);
 console.log("\nGET /todos ->", all.status);
 console.log(`Preview: ${all.data.todos.length} todos`);
```

### JSON body ပါတဲ့ POST request

`axios.post()` ရဲ့ `data` argument ကို `JSON.stringify()` နဲ့ serialize လုပ်ပြီး — `body` option အနေနဲ့ ပို့ပေးပါတယ်:

```diff
-import axios from 'axios';
 const base = 'https://dummyjson.com/todos/add';

-const todoCreated = await axios.post(base, {
-  todo: 'Use DummyJSON in the project',
-  completed: false,
-  userId: 5,
-});
+const todoCreated = await fetch(base, {
+  method: "POST",
+  body: JSON.stringify({
+    todo: 'Use DummyJSON in the project',
+    completed: false,
+    userId: 5,
+  })
+})
+  .then(async (resp) => Object.assign(resp, { data: await resp.json() }))
+  .catch(() => null);
 console.log('\nPOST /todos ->', todoCreated);
```

### Form ပို့ခြင်း (Form submission)

`axios.postForm()` (နဲ့ `putForm`/`patchForm` မူကွဲတွေ) က payload ကို `URLSearchParams` အနေနဲ့ ပို့ပါတယ်:

```diff
-import axios from 'axios';
 const base = 'https://dummyjson.com/forms';

-const created = await axios.postForm(`${base}/submit`, {
-    title: 'Form Demo',
-    completed: false,
-});
+const created = await fetch(`${base}/submit`, {
+  method: "POST",
+  body: new URLSearchParams({
+      title: 'Form Demo',
+      completed: false,
+  })
+})
+  .then(async (resp) => Object.assign(resp, { data: await resp.json() }))
+  .catch(() => null);
 console.log(created);
```

### Config object နဲ့ `axios.request()`

Config object ထဲက `url`, `method` နဲ့ `data` properties တွေကို — `fetch()` call ပေါ်ကို မြေပုံဆွဲပြီး (mapped) ပြောင်းပေးပါတယ်:

```diff
-import axios from 'axios';
-
 const base = 'https://dummyjson.com/todos/1';

-const customRequest = await axios.request({
-  url: base,
-  method: 'PATCH',
-  data: {
-    todo: 'Updated todo',
-    completed: true,
-  },
-});
+const customRequest = await fetch(base, {
+  method: "PATCH",
+  body: JSON.stringify({
+      todo: 'Updated todo',
+      completed: true,
+    })
+})
+  .then(async (resp) => Object.assign(resp, { data: await resp.json() }))
+  .catch(() => null);
 console.log('\nREQUEST /todos/1 ->', customRequest);
```

### CommonJS `require()`

CommonJS modules တွေကိုလည်း ဒီအတိုင်း ကိုင်တွယ်ပြီး — အခု သုံးမလိုတော့တဲ့ `require('axios')` binding ကို ဖယ်ရှားပေးပါတယ်:

```diff
-const axios = require('axios');

 function fetchAllTodos() {
-    return axios.get('https://dummyjson.com/todos');
+    return fetch('https://dummyjson.com/todos')
+  .then(async (res) => Object.assign(res, { data: await res.json() }))
+  .catch(() => null);
 }

 module.exports = { fetchAllTodos };
```

## မှတ်ချက်များ (Notes)

- `fetch` response က payload ကို `data` property ကနေမဟုတ်ဘဲ `res.json()` ကနေ ထုတ်ပေးတာမို့ — ပြောင်းလိုက်တဲ့ call တိုင်းနောက်မှာ `response.data` accesses တွေ ဆက်အလုပ်လုပ်နေဖို့ `.then(async (res) => Object.assign(res, { data: await res.json() }))` ကို ဆက်ထည့်ပေးထားပါတယ်။
- ပြောင်းလိုက်တဲ့ calls တွေက `.catch(() => null)` နဲ့ အဆုံးသတ်လို့ — request တစ်ခု မအောင်မြင်ရင် reject လုပ်မယ့်အစား `null` အနေနဲ့ resolve ဖြစ်သွားပါတယ်။ ဒါ့အပြင် Axios နဲ့ မတူဘဲ — `fetch` က HTTP error statuses (4xx/5xx) တွေမှာ reject မလုပ်တာမို့ — Axios rejections တွေကို မှီခိုပြီး ရေးထားတဲ့ error-handling code တွေကို ကိုယ်တိုင် ပြန်လည်သုံးသပ်သင့်ပါတယ်။
- ဘေးကင်းရေး ဦးစားပေးချက် — file တစ်ခုထဲက Axios call တစ်ခုခုမှာ မထောက်ခံတဲ့ configuration option သုံးထားရင် — file တစ်ခုလုံးကို မထိဘဲ ထားလိုက်ပြီး — source နေရာနဲ့အတူ warning တစ်ခု print လုပ်ပေးပါတယ် — မူရင်း behavior ကို ထိန်းသိမ်းပေးတာပါ။
- Transformation ပြီးတဲ့အခါ — codemod က သင့် package manager ကို ရှာဖွေသိရှိပြီး — `package.json` ကနေ `axios` နဲ့ `@types/axios` dependencies တွေကို ဖယ်ရှားပေးပါတယ်။

### ကန့်သတ်ချက်များ (Limitations)

Axios calls တွေမှာ အောက်ပါ configuration options တွေထဲက တစ်ခုခု သုံးထားရင် — ဒါတွေမှာ တိုက်ရိုက် `fetch` နဲ့ ညီမျှတဲ့အရာ မရှိလို့ — codemod က အဲဒီ files တွေကို ကျော်သွားပါတယ်:

- `beforeRedirect`
- `cancelToken`
- `decompress`
- `httpAgent`
- `httpsAgent`
- `maxBodyLength`
- `maxContentLength`
- `maxRedirects`
- `paramsSerializer`
- `signal`
- `socketPath`
- `timeout`
- `transformRequest`
- `transformResponse`
- `validateStatus`
- `withCredentials`

ဒါ့အပြင် — interceptors, cancel tokens, `axios.create()` နဲ့ ဖန်တီးတဲ့ instance configuration လို — တိုက်ရိုက် request helpers တွေ ပြင်ပက Axios features တွေကိုလည်း ဒီ codemod က အကျုံးမဝင်ပါဘူး။

## ဆက်ဖတ်ရန်

- [Userland Migrations မိတ်ဆက်](/docs/nodejs/userland-migrations) — Node.js ရဲ့ official codemods များအကြောင်း
- [Node.js နဲ့ data fetching](https://nodejs.org/learn/getting-started/fetching-data-with-nodejs) — `fetch` ကို Node.js မှာ သုံးခြင်း (မူရင်း guide)
