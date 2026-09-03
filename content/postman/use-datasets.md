---
title: "Postman မှာ datasets တွေကို သုံးခြင်း (Use datasets in Postman)"
description: "Postman မှာ dataset တစ်ခုကို ဘယ်လို သုံးလဲ — collection runs တွေမှာ iteration data အဖြစ်၊ scripts တွေထဲမှာ pm.datasets နဲ့ query လုပ်ခြင်း၊ request တစ်ခုထဲ dataset variables တွေ သုံးခြင်း၊ mocks တွေမှာ dynamic responses တွေ ပြန်ပို့ခြင်း၊ responses တွေကို validate လုပ်ခြင်း"
order: 128
source: "https://learning.postman.com/docs/tests-and-scripts/datasets/use-datasets/"
status: translated
updated: 2026-09-03
---

Datasets တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

[Dataset](https://learning.postman.com/docs/tests-and-scripts/datasets/overview) တစ်ခုကို ဖန်တီးပြီးနောက် — Postman ထဲက ကိုယ့် API workflows တွေအနှံ့မှာ သုံးနိုင်ပါတယ်။ Data-driven collection tests တွေ run လုပ်နိုင်ပြီး — dynamic mock server responses တွေကို အားဖြည့်နိုင်ကာ scripts တွေထဲမှာ API responses တွေကို validate လုပ်နိုင်သလို — requests နဲ့ [Flows](https://learning.postman.com/docs/postman-flows/overview/) တွေထဲမှာ datasets, sources နဲ့ views တွေကို ID နဲ့ ညွှန်းနိုင်ပါတယ်။ Datasets တွေက ကိုယ့်ကို workflows တွေအနှံ့မှာ data တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပြီး — တန်ဖိုးတွေကို duplicate ဒါမှမဟုတ် hardcode လုပ်ခြင်း မရှိဘဲ — တသမတ်တည်းဖြစ်ပြီး query လုပ်လို့ရတဲ့ data တွေနဲ့ အလုပ်လုပ်နိုင်စေပါတယ်။

Datasets တွေကို local ဒါမှမဟုတ် cloud data files တွေ ဒါမှမဟုတ် databases လိုမျိုး live data sources တွေက ကျောထောက်နိုင်ပါတယ်။ Views တွေက ဒီ data တွေကို တိကျတဲ့ scenarios တွေအတွက် — စစ်ထုတ်၊ အသွင်ပြောင်းပြီး အပိုင်းပိုင်း ခွဲနိုင်စေပါတယ်။ ဒါက လက်ရှိ data တွေကို မှီပြီး test လုပ်နိုင်စေကာ — တိကျတဲ့ test cases တွေကို ပစ်မှတ်ထားနိုင်ပြီး collection runs, scripts နဲ့ mock servers တွေ သုံးတဲ့ data တွေကို ထိန်းချုပ်နိုင်စေပါတယ်။

Dataset တစ်ခုအနေနဲ့ မသိမ်းဘဲ — database ဒါမှမဟုတ် file တစ်ခုကို ချိတ်ဆက်ပြီး အပြန်အလှန် query လုပ်ချင်ရင် [data request](https://learning.postman.com/docs/use/send-requests/protocols/data/data-overview/) တစ်ခုကို သုံးပါ။

## ဥပမာ dataset (Example dataset)

အောက်က ဥပမာတွေမှာ — `userId`, `email` နဲ့ `name` fields တွေ ပါဝင်တဲ့ local CSV file data source တစ်ခု ပါတဲ့ `users-dataset` လို့ အမည်ရတဲ့ dataset တစ်ခု ရှိတယ်လို့ ယူဆပါ:

```csv showLineNumbers={false}
userId,email,name
1,user1@example.com,User One
2,user2@example.com,User Two
3,user3@example.com,User Three
4,user4@example.com,User Four
```

## Collection runs တွေမှာ datasets တွေကို သုံးခြင်း (Use datasets in collection runs)

Collection တစ်ခုကို [manual အနေနဲ့ run လုပ်တဲ့အခါ](/docs/postman/intro-to-collection-runs) — datasets တွေကို iteration data အဖြစ် သုံးနိုင်ပါတယ်။ ရွေးထားတဲ့ view က ပြန်ပေးတဲ့ row တစ်ခုစီက collection run ထဲမှာ iteration တစ်ခု ဖြစ်လာပြီး — request တစ်ခုတည်းကို input အမျိုးမျိုးနဲ့ run နိုင်စေပါတယ်။ Views တွေက run တစ်ခုအတွင်း ဘယ် data တွေ သုံးလဲ ထိန်းချုပ်နိုင်စေပါတယ် — ဥပမာ dataset အကြီးကြီးတစ်ခုကို တိကျတဲ့ test scenarios အစုတစ်ခုဆီ စစ်ထုတ်ခြင်း။ [Monitors](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-datasets/) တွေနဲ့လည်း datasets တွေကို သုံးနိုင်ပါတယ်။

Collection တစ်ခုကို [manual အနေနဲ့ run လုပ်တဲ့အခါ](/docs/postman/intro-to-collection-runs) — datasets တွေကို iteration data အဖြစ် သုံးနိုင်ပါတယ်။ ရွေးထားတဲ့ view က ပြန်ပေးတဲ့ row တစ်ခုစီက collection run ထဲမှာ iteration တစ်ခု ဖြစ်လာပြီး — request တစ်ခုတည်းကို input အမျိုးမျိုးနဲ့ run နိုင်စေပါတယ်။ Views တွေက run တစ်ခုအတွင်း ဘယ် data တွေ သုံးလဲ ထိန်းချုပ်နိုင်စေပါတယ် — ဥပမာ dataset အကြီးကြီးတစ်ခုကို တိကျတဲ့ test scenarios အစုတစ်ခုဆီ စစ်ထုတ်ခြင်း။

Datasets တွေကို [monitors](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-datasets/) နဲ့ [performance tests](https://learning.postman.com/docs/tests-and-scripts/performance-testing/test-data/performance-test-dataset/) တွေမှာလည်း သုံးနိုင်ပါတယ်။

Dataset တစ်ခုနဲ့ collection တစ်ခုကို run လုပ်ဖို့ — [collection run တစ်ခုမှာ dataset တစ်ခုကို သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/test-data/collection-run-datasets/) ကို ကြည့်ပါ။ အဲဒီ page မှာ dataset နဲ့ view တစ်ခု ရွေးခြင်း၊ iterations ဘယ်နှစ်ခု run မလဲ ထိန်းချုပ်ခြင်း၊ ပြီးတော့ ကိုယ့် requests နဲ့ scripts တွေထဲမှာ iteration data တွေကို ဝင်ရောက်ခြင်း စတာတွေ ပါဝင်ပါတယ်။

## Scripts တွေထဲမှာ dataset ကို query လုပ်ခြင်း (Query the dataset in scripts)

Collection run ဒါမှမဟုတ် monitor run တစ်ခုအတွင်း — pre-request နဲ့ post-response scripts တွေထဲမှာ `pm.datasets` function ကို သုံးပြီး — လက်ရှိ iteration ကန့် တန်ဖိုးတွေကို သုံးကာ dataset ကို query လုပ်နိုင်ပါတယ်။ ရွေးထားတဲ့ view က iteration variables တွေအနေနဲ့ ထုတ်ပြတဲ့ data တွေထက် ပိုတဲ့ data တွေ လိုအပ်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ Query ရလဒ်တွေက rows တွေကို async iterable အနေနဲ့ ပြန်ပေးလို့ — ပြန်လာတဲ့ rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။ Script ထဲမှာ custom query တစ်ခု ရေးမယ့်အစား — predefined view တစ်ခုနဲ့ responses တွေကို validate လုပ်ဖို့ `executeView()` ကိုလည်း သုံးနိုင်ပါတယ်။ [Scripts တွေထဲမှာ datasets တွေကို သုံးခြင်း](/docs/postman/sandbox-pm-datasets) အကြောင်း ပိုလေ့လာပါ။

```js wordWrap showLineNumbers={false}
const ds = pm.datasets("users-dataset-id");

const result = await ds.executeQuery(
  "SELECT * FROM users WHERE email = ?",
  [pm.iterationData.get("email")]
);

const allRows = [];

for await (const row of result.rows) {
  allRows.push(row);
}

console.log(JSON.stringify(allRows));
```

## Scripts တွေထဲမှာ dataset variables တွေကို သုံးခြင်း (Use dataset variables in scripts)

Request တစ်ခုရဲ့ ဘယ်နေရာမှာမဆို — dataset, source ဒါမှမဟုတ် view တစ်ခုကို ညွှန်းနိုင်ပါတယ်။ Base URL, auth, path parameters, headers နဲ့ body တွေ ပါဝင်ပါတယ်။ `{{variable}}` syntax ကို သုံးပါ — ဒီမှာ `variable` က entity ရဲ့ နာမည် ဖြစ်ပါတယ်။ ဥပမာ — ကိုယ့် request URL `GET /users/{{users-dataset}}` ထဲမှာ path parameter တစ်ခုအနေနဲ့ `{{users-dataset}}` ကို ထည့်နိုင်ပါတယ်။ Request run လုပ်တဲ့အခါ Postman က variable ကို entity ရဲ့ ID ဆီ resolve လုပ်ပေးလို့ — ID ကို hardcode မလုပ်ဘဲ script တစ်ခုထဲမှာ ဝင်ရောက်နိုင်ပါတယ်။

```js showLineNumbers={false}
const datasetId = // Get dataset Id from url/headers/other
const ds = pm.datasets(datasetId);

const result = await ds.executeQuery(
  "SELECT * FROM users WHERE email = ?",
  [pm.iterationData.get("email")]
);

const allRows = [];

for await (const row of result.rows) {
  allRows.push(row);
}

console.log(JSON.stringify(allRows));
```

## Mocks တွေမှာ datasets တွေကို သုံးခြင်း (Use datasets in mocks)

[Mock](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) တစ်ခုထဲမှာ `pm.datasets` function ကို သုံးပြီး — query လုပ်လို့ရတဲ့ data တွေကို အခြေခံတဲ့ dynamic responses တွေ ပြန်ပို့နိုင်ပါတယ်။ ဒါက requests တွေအနှံ့မှာ dataset တစ်ခုတည်းကို သုံးနိုင်စေပြီး — endpoint တွေအတွက် data တွေကို စစ်ထုတ်နိုင်ကာ static responses တွေသာ ပြန်ပို့မယ့်အစား — ပိုလက်တွေ့ကျတဲ့ API အပြုအမူတွေကို simulate လုပ်နိုင်စေပါတယ်။

Mock တစ်ခုထဲမှာ dataset တစ်ခုကို သုံးဖို့ အောက်ပါ ဥပမာကို သုံးပါ:

1. ကိုယ့် mock implementation file ထဲမှာ `pm.datasets()` သုံးပြီး dataset ကို load လုပ်ပါ။

2. ကိုယ့် request handler ထဲမှာ dataset ကို query လုပ်ပြီး — ကိုက်ညီတဲ့ row ကို response ထဲမှာ ပြန်ပို့ပါ။

   ```js showLineNumbers={false}
   const http = require("http");
   const url = require("url");
   const PORT = process.env.PORT || 4500;

   const server = http.createServer(async (req, res) => {
     const { method } = req;
     const { pathname, query } = url.parse(req.url, true);

     // @endpoint GET /user
     if (method === "GET" && pathname === "/user") {
       const ds = pm.datasets("users-dataset-id");

       const result = await ds.executeQuery(
         "SELECT userId, email, name FROM users WHERE userId = ?",
         [query.userId]
       );

       const allRows = [];

       for await (const row of result.rows) {
         allRows.push(row);
       }

       if (allRows.length === 0) {
         res.writeHead(404, { "Content-Type": "application/json" });
         return res.end(JSON.stringify({ error: "User not found" }));
       }

       res.writeHead(200, { "Content-Type": "application/json" });
       return res.end(JSON.stringify(allRows[0]));
     }

     res.writeHead(404, { "Content-Type": "application/json" });
     res.end(JSON.stringify({ error: "Endpoint not defined" }));
   });

   server.listen(PORT, () => {
     console.log(`Mock server running on port ${PORT}`);
   });
   ```

3. Mock ကို စပြီး endpoint ဆီ request တစ်ခု ပို့ပါ။ ဥပမာ — အောက်ပါအတိုင်း GET request တစ်ခု ပို့နိုင်ပါတယ်:

   ```http showLineNumbers={false}
   http://localhost:4500/user?userId=2
   ```

Request run လုပ်တဲ့အခါ mock က dataset ကို query လုပ်ပြီး — response ထဲမှာ ကိုက်ညီတဲ့ data ကို ပြန်ပို့ပါတယ်။ Query ရလဒ်တွေက rows တွေကို async iterable အနေနဲ့ ပြန်ပေးလို့ — ပြန်လာတဲ့ rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။ Endpoints တွေအနှံ့မှာ predefined queries တွေကို ပြန်သုံးဖို့ `executeView()` နဲ့ views တွေကိုလည်း သုံးနိုင်ပါတယ်။

[Mocks](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) နဲ့ [scripts တွေထဲမှာ datasets တွေကို သုံးခြင်း](/docs/postman/sandbox-pm-datasets) အကြောင်း ပိုလေ့လာပါ။

## Scripts တွေမှာ datasets တွေကို သုံးခြင်း (Use datasets in scripts)

Pre-request နဲ့ post-response scripts တွေထဲမှာ `pm.datasets` function ကို သုံးပြီး — dataset တစ်ခုထဲမှာ သိမ်းထားတဲ့ query လုပ်လို့ရတဲ့ data တွေကို မှီပြီး response data တွေကို validate လုပ်နိုင်ပါတယ်။ ဒါက request တစ်ခုချင်းစီနဲ့ monitors တွေမှာ အလုပ်လုပ်ပြီး — API responses တွေကို မျှော်လင့်ထားတဲ့ တန်ဖိုးတွေနဲ့ နှိုင်းယှဉ်နိုင်စေကာ scenarios အမျိုးမျိုးကို test လုပ်နိုင်ပြီး workflows တွေအနှံ့မှာ data တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပါတယ်။

Collection run တစ်ခုအတွင်း scripts တွေထဲမှာ datasets တွေကို ဘယ်လို သုံးလဲ သိချင်ရင် — [collection run တစ်ခုမှာ dataset တစ်ခုကို သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/running-collections/test-data/collection-run-datasets/) page ကို ကြည့်ပါ။

Post-response script တစ်ခုထဲမှာ dataset တစ်ခုကို သုံးဖို့ အောက်ပါ ဥပမာကို သုံးပါ:

1. User data တွေ ပြန်ပို့တဲ့ endpoint တစ်ခုဆီ request တစ်ခု ပို့ပါ — ဥပမာ:

   ```http showLineNumbers={false}
   GET /user?userId=2
   ```

2. Request ရဲ့ **Scripts > Post-response** tab ထဲမှာ — dataset ကို load လုပ်ပြီး response ကန့် တန်ဖိုးတစ်ခုကို သုံးကာ query လုပ်ပါ။

   ```js showLineNumbers={false}
   const ds = pm.datasets("users-dataset-id");
   const responseJson = pm.response.json();

   const result = await ds.executeQuery(
     "SELECT userId, email, name FROM users WHERE userId = ?",
     [responseJson.userId]
   );

   const allRows = [];

   for await (const row of result.rows) {
     allRows.push(row);
   }

   pm.test("Response matches dataset", function () {
     pm.expect(allRows.length).to.eql(1);
     pm.expect(responseJson.email).to.eql(allRows[0].email);
     pm.expect(responseJson.name).to.eql(allRows[0].name);
   });
   ```

3. **Send** ကို နှိပ်ပါ။

Request run လုပ်တဲ့အခါ — script က dataset ကို query လုပ်ပြီး response data ကို ကိုက်ညီတဲ့ row နဲ့ နှိုင်းယှဉ်ပါတယ်။ Query ရလဒ်တွေက rows တွေကို async iterable အနေနဲ့ ပြန်ပေးလို့ — ပြန်လာတဲ့ rows တွေကို ဖတ်ဖို့ `for await...of` loop ကို သုံးပါ။ Script ထဲမှာ custom query တစ်ခု ရေးမယ့်အစား — predefined view တစ်ခုနဲ့ responses တွေကို validate လုပ်ဖို့ `executeView()` ကိုလည်း သုံးနိုင်ပါတယ်။

[Pre-request scripts](/docs/postman/pre-request-scripts) နဲ့ [post-response scripts](/docs/postman/test-scripts) တွေ ရေးခြင်း အကြောင်းနဲ့ — [scripts တွေထဲမှာ datasets တွေကို သုံးခြင်း](/docs/postman/sandbox-pm-datasets) အကြောင်း ပိုလေ့လာပါ။
