---
title: "Postman Visualizer ကို သုံးပြီး request responses များကို visualize လုပ်ခြင်း"
description: "Postman Visualizer ဆိုတာ ဘာလဲ — Handlebars template တွေနဲ့ response data တွေကို visualize လုပ်နည်း, pm.visualizer.set() နဲ့ pm.getData() သုံးပုံ, styling/libraries ထည့်ခြင်း, Visualizer API နဲ့ debugging"
order: 77
source: "https://learning.postman.com/docs/use/send-requests/response-data/visualizer/"
status: translated
updated: 2026-09-02
---

*Postman Visualizer* ဆိုတာ — request [responses](/docs/postman/responses) တွေကို မြင်သာအောင် (visually) ဖော်ပြနိုင်ဖို့ programmable နည်းလမ်း တစ်ခု ပေးစွမ်းပါတယ်။ Visualization တွေကို အလိုအလျောက် လုပ်ဖို့ Postman ရဲ့ AI assistant ဖြစ်တဲ့ Agent Mode ကိုလည်း သုံးနိုင်ပါတယ်။ Request ရဲ့ **Scripts** tab ထဲမှာ visualization script တစ်ခု ထည့်ထားရင် — response body အတွက် **Visualization** tab ထဲမှာ ရလဒ်ကို render လုပ်ပြသပေးပါတယ်။ Visualizer script တစ်ခု မဖန်တီးထားဘူးဆိုရင် — visualization တစ်ခု generate လုပ်ဖို့ Agent Mode ကို သုံးပါ။

Visualizer က response data တွေကို နားလည်လွယ်စေမယ့် ပုံစံအမျိုးမျိုးနဲ့ တင်ပြနိုင်စေပါတယ်။ Raw response data တွေကို ဖတ်နေရမယ့်အစား — ကိုယ့် project အတွက် သက်ဆိုင်တဲ့ အချက်အလက်တွေကို ပုံစံထုတ်ပြီး မီးမောင်းထိုးပြနိုင်ပါတယ်။ [Postman Collection တစ်ခုကို share လုပ်တဲ့အခါ](/docs/postman/sharing) — team ထဲက တခြားသူတွေလည်း request တစ်ခုချင်းစီရဲ့ context ထဲမှာ ကိုယ့်ရဲ့ visualizations တွေကို နားလည်နိုင်ပါတယ်။

## Response data တွေကို visualize လုပ်ခြင်း

Response data တွေကို visualize လုပ်ဖို့ — request အတွက် **Pre-request** ဒါမှမဟုတ် **Post-response** [script](/docs/postman/intro-to-scripts) ထဲမှာ code တွေ ထည့်ပါ။ `pm.visualizer.set()` method က ကိုယ့်ရဲ့ Visualizer code ကို data ပေါ်မှာ သက်ရောက်စေပြီး — request run တဲ့အခါ **Visualization** tab ထဲမှာ တင်ပြပေးပါတယ်။

### Visualizer code ထည့်ခြင်း

`pm.visualizer.set()` method က [Handlebars](https://handlebarsjs.com/) template string တစ်ခုကို ပထမ parameter အဖြစ် လက်ခံပါတယ်။ ဒုတိယ parameter ကတော့ — template ကို သုံးပြီး ပြသချင်တဲ့ data ပဲ ဖြစ်ပါတယ်။ Handlebars template တစ်ခုကို ဘယ်လို တည်ဆောက်ပြီး data တွေ ပို့မလဲဆိုတာ ဆက်ဖတ်ကြည့်ပါ။

Visualizer အလုပ်လုပ်ပုံ ဥပမာတစ်ခု ကြည့်ချင်ရင် — Postman ထဲမှာ collection ကို [fork လုပ်ပါ](https://app.getpostman.com/run-collection/7865888-07101503-1e33-4f29-b845-d94e726751c8?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D7865888-07101503-1e33-4f29-b845-d94e726751c8%26entityType%3Dcollection%26workspaceId%3D34f3a42c-18a7-4ad6-83fb-2c05767d63a7)။

ပထမ request မှာ — ဥပမာ endpoint က အောက်ပါ JSON response body တည်ဆောက်ပုံနဲ့အတူ နာမည်တွေနဲ့ email addresses တွေရဲ့ စာရင်းတစ်ခုကို ပြန်ပို့ပေးပါတယ်:

```js
[
    {
        "name": "Alice",
        "email": "alice@example.com"
    },
    {
        "name": "Jack",
        "email": "jack@example.com"
    },
    // ... စသဖြင့် ဆက်သွားပါတယ်
]
```

Visualizer code က array တစ်ခုပေါ်မှာ loop ပတ်ပြီး — နာမည်တွေနဲ့ email addresses တွေကို ပြသမယ့် table တစ်ခုကို render လုပ်ဖို့ Handlebars template တစ်ခု ဖန်တီးပါတယ်။ Handlebars က ဒါကို `{{#each}}` tag နဲ့ လုပ်နိုင်ပါတယ်။ အောက်ပါဟာက request ထဲမှာ **Post-response** script အဖြစ် run ပါတယ်:

```js
var template = `
    <table bgcolor="#FFFFFF">
        <tr>
            <th>Name</th>
            <th>Email</th>
        </tr>

        {{#each response}}
            <tr>
                <td>{{name}}</td>
                <td>{{email}}</td>
            </tr>
        {{/each}}
    </table>
`;
```

Template ထဲက double curly braces တွေအတွင်းမှာ ရှိတဲ့ variable နာမည်တွေကို — `pm.visualizer.set()` method ဆီ ပို့လိုက်တဲ့ data တွေနဲ့ အစားထိုးပါတယ်။ Template ကို အသုံးချဖို့ — အောက်ပါ code က **Post-response** script ကို ပြီးမြောက်စေပါတယ်:

```js
// Visualizer ကို set လုပ်ပါ
pm.visualizer.set(template, {
    // Response body ကို JSON အဖြစ် parse ပြီး `data` အဖြစ် ပို့ပါ
    response: pm.response.json()
});
```

`template` variable က အစောပိုင်းက ဖန်တီးထားတဲ့ template string ပဲ ဖြစ်ပါတယ်။ ဒုတိယ argument အဖြစ် ပို့လိုက်တာက — `response` property အဖြစ် သတ်မှတ်ထားတဲ့ object တစ်ခု ဖြစ်ပါတယ်။ ဒါက `{{#each response}}` loop ထဲမှာ template က မျှော်လင့်ထားတဲ့ variable ပဲ ဖြစ်ပါတယ်။ `response` property ဆီ သတ်မှန်းလိုက်တဲ့ value က — request ကနေ ရလာတဲ့ response JSON data ကို object တစ်ခုအဖြစ် parse လုပ်ထားတဲ့ ပုံစံ ဖြစ်ပါတယ်။

### Visualizations တွေကို ကြည့်ရှုခြင်း

Postman မှာ request ကို run ဖို့ **Send** ကို နှိပ်ပြီး — **Visualization** tab ကို နှိပ်ပါ။ Postman က table ကို web browser ထဲမှာ render လုပ်သလိုမျိုး HTML အဖြစ် render လုပ်ပေးပါတယ်။

### Visualizations တွေမှာ styling နဲ့ interaction ထည့်ခြင်း

HTML template code ထဲမှာ `<link>` tags တွေကို သုံးပြီး — web page တစ်ခုမှာ stylesheet ထည့်သလို external stylesheet တစ်ခုကို load လုပ်နိုင်ပါတယ်။ `<style>` tags တွေအနေနဲ့လည်း stylesheets တွေ ထည့်နိုင်ပါတယ်။ အလားတူပဲ — template HTML code ထဲက `<script>` tags အတွင်းမှာ JavaScript code တွေ သုံးပြီး interactions တွေ ထည့်နိုင်ပါတယ်။

#### မှတ်ချက်

Visualizer က resources တွေကို download လုပ်တဲ့ interactions တွေကို support မလုပ်ပါဘူး။

### ကိုယ်ပိုင် libraries တွေကို သုံးခြင်း

Layout template ကို programmatically generate လုပ်ဖို့ [Postman Sandbox](/docs/postman/sandbox-overview) ထဲက libraries တွေထဲက ဘယ်ဟာကိုမဆို သုံးနိုင်ပါတယ်။ တခြား external JavaScript library တစ်ခုကို import လုပ်ဖို့ — HTML file တစ်ခုထဲ JavaScript load လုပ်သလိုပဲ — template code ထဲက `<script>` tag တစ်ခုဆီ URL ကို ထည့်ပါ။ ဒါနဲ့ ကိုယ်ကြိုက်တဲ့ visualization tool (ဥပမာ D3.js) ကို သုံးပြီး request data တွေကို render လုပ်နိုင်ပါတယ်။

### Template ထဲမှာ data တွေကို access လုပ်ခြင်း

Template ထဲက `<script>` elements တွေက — `pm.getData(callback)` method ကို ခေါ်ပြီး `pm.visualizer.set()` ရဲ့ ဒုတိယ argument အဖြစ် ပို့လိုက်တဲ့ data တွေကို access လုပ်နိုင်ပါတယ်။ ဒါက template ထဲက JavaScript code တွေအတွက်ပဲ သက်ဆိုင်ပါတယ်။ ဥပမာ — ကိုယ့် template ထဲမှာ chart တစ်ခု render လုပ်မယ့် code ပါဝင်နိုင်ပါတယ်။

`pm.getData(callback)` method က callback function တစ်ခုကို parameter အဖြစ် လက်ခံပါတယ်။ ဒီ callback က `error` နဲ့ `data` parameters တွေကို လက်ခံပါတယ်။ ဒုတိယ parameter က `pm.visualizer.set()` ဆီ ပို့လိုက်တဲ့ `data` ပဲ ဖြစ်ပါတယ်။

## ကိုယ်တိုင် စမ်းကြည့်ခြင်း

Visualizer code တွေရဲ့ နောက်ထပ် ဥပမာတွေအတွက် — အောက်ပါ collections တွေထဲက တစ်ခုခုကို [collection fork လုပ်ခြင်း](/docs/postman/forking-elements) အားဖြင့် ကိုယ့် workspace ထဲကို ထည့်နိုင်ပါတယ်။ Collection ကို [export ပြီး import လုပ်ခြင်း](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-and-exporting-overview/) အားဖြင့်လည်း ရနိုင်ပါတယ်။ Fork ဒါမှမဟုတ် import လုပ်ပြီးတာနဲ့ — sidebar ထဲက **Collections** ကနေ request တစ်ခုကို ဖွင့်ပြီး **Send** ကို ရွေးပါ။ Postman က render လုပ်ထားတဲ့ data ကို **Visualization** tab ထဲမှာ ပြသပါတယ်။

* [ChartJS သုံးပြီး bar chart တစ်ခု render လုပ်တဲ့ DIY collection](https://www.postman.com/postman/postman-team-collections/collection/8wlm25q/visualizer-diy-bar-chart?action=share&creator=16724969)
* [Heat map visualization](https://www.postman.com/postman/postman-team-collections/collection/ahu13nu/visualizer-d3-heatmap-demo?action=share&creator=16724969)
* [Chart နဲ့ graph ဥပမာ အမျိုးမျိုး](https://www.postman.com/postman/published-postman-templates/collection/hu7uwj7/visualizer-feature-templates?action=share&creator=16724969)

## Visualizer API အကြောင်း

[Postman API](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-visualizer/) ကနေ Visualizer ကို access လုပ်နိုင်ပါတယ်။ `pm.visualizer.set()` method က အောက်ပါ parameters တွေကို လက်ခံပါတယ်:

* `layout` — (မဖြစ်မနေ) ပထမ parameter က [Handlebars](https://handlebarsjs.com/) HTML template string တစ်ခု ဖြစ်ပါတယ်။
* `data` — ဒုတိယ parameter က template နဲ့ bind လုပ်နိုင်တဲ့ data ပဲ ဖြစ်ပါတယ်။ ဒီ object ရဲ့ properties တွေကို template ထဲမှာ access လုပ်နိုင်ပါတယ်။
* `options` — တတိယ argument က [`Handlebars.compile()`](https://handlebarsjs.com/api-reference/) အတွက် `options` object တစ်ခု ဖြစ်ပါတယ်။ Handlebars က template ကို compile လုပ်ပုံကို ထိန်းချုပ်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။

Postman က `pm.visualizer.set()` ဆီ ကိုယ် ပို့လိုက်တဲ့ အချက်အလက်တွေကို သုံးပြီး — Visualizer အတွက် sandbox ထဲမှာ HTML page တစ်ခု render လုပ်ပါတယ်။ Render လုပ်ပြီးသား HTML page ကို ကြည့်ဖို့ **Visualization** ကို နှိပ်ပါ။ `layout` string ကို — template ထဲက JavaScript, CSS နဲ့ HTML တွေ အပါအဝင် — render လုပ်ပြီးသား page ရဲ့ `<body>` ထဲမှာ ထည့်သွင်းပါတယ်။

## Visualizer ကို debug လုပ်ခြင်း

Postman မှာ visualization တစ်ခုကို debug လုပ်ဖို့ — Visualization နေရာမှာ right-click နှိပ်ပြီး **Inspect visualization** ကို နှိပ်ပါ။ ဒါက sandbox နဲ့ ချိတ်ဆက်ထားတဲ့ Visualizer Developer Tools ကို ဖွင့်ပေးပါတယ်။ Web page တစ်ခုကို debug လုပ်သလိုမျိုး သုံးနိုင်ပါတယ်။

Visualizer Developer Tools တွေက [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/) မှာပဲ ရနိုင်ပါတယ်။

## နောက်ထပ် ဆက်လုပ်ရန်

Postman မှာ responses တွေကို visualize လုပ်ခြင်းအကြောင်း သိပြီးပြီဆိုရင် — ကိုယ်ပိုင် visualizations တွေ စတင် ဖန်တီးနိုင်ပါပြီ။

* စတင်ဖို့ — [More Visualizer examples](https://www.postman.com/postman/e9bb1adb-2f2e-4ace-a482-38c570d65275/overview) workspace နဲ့ စမ်းသပ်ကြည့်နိုင်ပါတယ်။ ဥပမာ requests တွေကို run ပြီး — ကိုယ့် data အတွက် လိုချင်တဲ့ ရလဒ်တွေ ရဖို့ code တွေကို ချိန်ညှိကြည့်ပါ။
* Scripts တွေထဲမှာ response data တွေကို access လုပ်နည်းနဲ့ ပတ်သက်တဲ့ အချက်အလက်တွေအတွက် — [Postman test script ဥပမာများ](/docs/postman/test-examples) ကို ကြည့်ပါ။
