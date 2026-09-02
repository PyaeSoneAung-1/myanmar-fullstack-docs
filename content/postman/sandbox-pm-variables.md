---
title: "Scripts တွေထဲမှာ variables တွေကို ကိုးကားခြင်း (Reference variables in Postman scripts)"
description: "pm object နဲ့ scripts တွေထဲမှာ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်နည်း — pm.globals, pm.collectionVariables, pm.environment, pm.iterationData နဲ့ pm.variables methods တွေရဲ့ API ကိုးကားချက်"
order: 72
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-variables/"
status: translated
updated: 2026-09-02
---

`pm` object နဲ့ ကိုယ့် scripts တွေထဲမှာ [variable scopes](#variable-scope-ရဲ့-ဦးစားပေး-အစီအစဉ်) အမျိုးမျိုးမှာ [variables](/docs/postman/variables) တွေကို access လုပ်ပြီး ကိုင်တွယ်ပါ။ [pm.globals](#pmglobals), [pm.collectionVariables](#pmcollectionvariables), [pm.environment](#pmenvironment), [pm.iterationData](#pmiterationdata) နဲ့ [pm.variables](#pmvariables) methods တွေကို scope တစ်ခုချင်းစီမှာ variables တွေကို access လုပ်ဖို့ သုံးနိုင်ပါတယ်။

ကိုယ့် Postman Vault ထဲက vault secrets တွေကို access လုပ်ဖို့ [pm.vault](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-vault/) method ကို သုံးပါ။

[Postman Collection SDK](https://www.postmanlabs.com/postman-collection/Variable.html) မှာ variables တွေ သုံးခြင်းအကြောင်း လေ့လာနိုင်ပါတယ်။

## Variable scope ရဲ့ ဦးစားပေး အစီအစဉ်

Variable scope က ကိုယ့် scripts တွေထဲမှာ variables တွေကို ကိုးကားတဲ့အခါ Postman က ပေးတဲ့ ဦးစားပေးမှုကို သတ်မှတ်ပါတယ်။ အောက်ပါအတိုင်းက variable scope precedence ကို အကျယ်ဆုံးကနေ အကျဉ်းဆုံးအထိ ဖော်ပြချက်ပါ: global, collection, environment, data နဲ့ local။ [Postman ထဲမှာ variable scopes အကြောင်း](/docs/postman/variables) ပိုလေ့လာပါ။

ကိုယ့် scripts တွေထဲမှာ `pm.variables` method ကို ကိုးကားတဲ့အခါ — အနီးကပ်ဆုံး scope က variable က တခြားဟာတွေကို လွှမ်းမိုးပါတယ်။ ဥပမာ — လက်ရှိ collection နဲ့ active environment နှစ်ခုလုံးမှာ `score` လို့ နာမည်တပ်ထားတဲ့ variables တွေ ရှိရင် — `pm.variables.get('score')` က environment variable ရဲ့ လက်ရှိ value ကို ပြန်ပေးပါတယ်။ တန်ဖိုးမတူညီတဲ့ local variable တစ်ခု ဖန်တီးဖို့ `pm.variables.set` ကို သုံးနိုင်ပေမဲ့ — အဲဒီ value က လက်ရှိ request ဒါမှမဟုတ် collection run အတွက်ပဲ သက်တမ်းရှိပါတယ်။

နာမည်တူ variables အများကြီး set လုပ်ထားတဲ့အခါ Postman က ဦးစားပေးတဲ့ scope ကို အောက်ပါ ဥပမာက ပြသပါတယ်:

```js
// collection var 'score' = 1
// environment var 'score' = 2

// first request run
console.log(pm.variables.get('score')); // outputs 2
console.log(pm.collectionVariables.get('score')); // outputs 1
console.log(pm.environment.get('score')); // outputs 2

// second request run
pm.variables.set('score', 3);// local var
console.log(pm.variables.get('score')); // outputs 3

// third request run
console.log(pm.variables.get('score')); // outputs 2
```

## pm.globals

Global scope မှာ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.globals` methods တွေကို သုံးပါ။ Global variables တွေကို edit လုပ်ဖို့ Editor permissions လိုအပ်ပါတယ်။

Performance testing မှာ — global variables တွေထဲက ပြောင်းလဲမှုတွေက performance run ရဲ့ ကြာချိန်အတွက် ထိန်းသိမ်းထားပြီး virtual user (VU) တစ်ခုချင်းစီအလိုက် သီးခြားသတ်မှတ်ထားပါတယ်။ Global variables တွေက နောက် runs တွေအတွက် save မလုပ်ပေးဘဲ — VU တစ်ခုက လုပ်တဲ့ ပြောင်းလဲမှုတွေက တခြား VUs တွေကို မသက်ရောက်ပါဘူး။

### pm.globals.has(variableName:String)

သတ်မှတ်ထားတဲ့ နာမည်နဲ့ global variable တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Global variable ရှိနေပါတယ်။
* `false` — Global variable မရှိပါဘူး။

### pm.globals.get(variableName:String)

သတ်မှတ်ထားတဲ့ နာမည်နဲ့ global variable တစ်ခုရဲ့ value ကို ရယူပါတယ်။

Global variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး global variable တစ်ခုရဲ့ value ဆီ string တစ်ခု ပေါင်းထည့်နိုင်ပါတယ်။

### pm.globals.set(variableName:String, variableValue:\*)

သတ်မှတ်ထားတဲ့ နာမည်နဲ့ value နဲ့ global variable တစ်ခုကို set လုပ်ပါတယ်။

### pm.globals.replaceIn(variableName:string)

`{{$dynamicVariableName}}` syntax ကို သုံးပြီး script တစ်ခုထဲမှာ [dynamic variable](/docs/tests-and-scripts/write-scripts/variables-list/) တစ်ခုရဲ့ resolved value ကို ရယူပါတယ်။

Dynamic variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

### pm.globals.toObject()

Global variables အားလုံးကို ရယူပါတယ်။

Global variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

### pm.globals.unset(variableName:String)

သတ်မှတ်ထားတဲ့ global variable တစ်ခုကို ဖယ်ရှားပါတယ်။

### pm.globals.clear():function

Workspace ကနေ global variables အားလုံးကို ရှင်းလင်းပါတယ်။

## pm.collectionVariables

Collection ထဲမှာ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.collectionVariables` methods တွေကို သုံးပါ။ Collection variables တွေကို edit လုပ်ဖို့ Editor permissions လိုအပ်ပါတယ်။

Performance testing မှာ — collection variables တွေထဲက ပြောင်းလဲမှုတွေက performance run ရဲ့ ကြာချိန်အတွက် ထိန်းသိမ်းထားပြီး virtual user (VU) တစ်ခုချင်းစီအလိုက် သီးခြားသတ်မှတ်ထားပါတယ်။ Global variables တွေက နောက် runs တွေအတွက် save မလုပ်ပေးဘဲ — VU တစ်ခုက လုပ်တဲ့ ပြောင်းလဲမှုတွေက တခြား VUs တွေကို မသက်ရောက်ပါဘူး။

### pm.collectionVariables.has(variableName:String)

ဖွင့်ထားတဲ့ collection ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Collection variable ရှိနေပါတယ်။
* `false` — Collection variable မရှိပါဘူး။

### pm.collectionVariables.get(variableName:String)

ဖွင့်ထားတဲ့ collection ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခုရဲ့ value ကို ရယူပါတယ်။

Collection variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး collection variable တစ်ခုရဲ့ value ဆီ string တစ်ခု ပေါင်းထည့်နိုင်ပါတယ်။

### pm.collectionVariables.set(variableName:String, variableValue:\*)

ဖွင့်ထားတဲ့ collection ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ value နဲ့ variable တစ်ခုကို set လုပ်ပါတယ်။

### pm.collectionVariables.replaceIn(variableName:string)

`{{$dynamicVariableName}}` syntax ကို သုံးပြီး script တစ်ခုထဲမှာ [dynamic variable](/docs/tests-and-scripts/write-scripts/variables-list/) တစ်ခုရဲ့ resolved value ကို ရယူပါတယ်။

Dynamic variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

### pm.collectionVariables.toObject()

ဖွင့်ထားတဲ့ collection ထဲက variables အားလုံးကို ရယူပါတယ်။

Collection variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

### pm.collectionVariables.unset(variableName:String)

ဖွင့်ထားတဲ့ collection ကနေ သတ်မှတ်ထားတဲ့ variable တစ်ခုကို ဖယ်ရှားပါတယ်။

### pm.collectionVariables.clear():function

ဖွင့်ထားတဲ့ collection ကနေ variables အားလုံးကို ရှင်းလင်းပါတယ်။

## pm.environment

[active environment](/docs/postman/managing-environments) ထဲမှာ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.environment` methods တွေကို သုံးပါ။ Environment variables တွေကို edit လုပ်ဖို့ Editor permissions လိုအပ်ပါတယ်။

Performance testing မှာ — environment variables တွေထဲက ပြောင်းလဲမှုတွေက performance run ရဲ့ ကြာချိန်အတွက် ထိန်းသိမ်းထားပြီး virtual user (VU) တစ်ခုချင်းစီအလိုက် သီးခြားသတ်မှတ်ထားပါတယ်။ Global variables တွေက နောက် runs တွေအတွက် save မလုပ်ပေးဘဲ — VU တစ်ခုက လုပ်တဲ့ ပြောင်းလဲမှုတွေက တခြား VUs တွေကို မသက်ရောက်ပါဘူး။

### pm.environment.has(variableName:String)

Active environment ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Environment variable ရှိနေပါတယ်။
* `false` — Environment variable မရှိပါဘူး။

### pm.environment.get(variableName:String)

Active environment ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခုရဲ့ value ကို ရယူပါတယ်။

Environment variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး environment variable တစ်ခုရဲ့ value ဆီ string တစ်ခု ပေါင်းထည့်နိုင်ပါတယ်။

### pm.environment.set(variableName:String, variableValue:\*)

Active environment ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ value နဲ့ variable တစ်ခုကို set လုပ်ပါတယ်။

### pm.environment.replaceIn(variableName:string)

`{{$dynamicVariableName}}` syntax ကို သုံးပြီး script တစ်ခုထဲမှာ [dynamic variable](/docs/tests-and-scripts/write-scripts/variables-list/) တစ်ခုရဲ့ resolved value ကို ရယူပါတယ်။

Dynamic variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

### pm.environment.toObject()

Active environment ထဲက variables အားလုံးကို ရယူပါတယ်။

Environment variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

### pm.environment.unset(variableName:String)

Active environment ကနေ သတ်မှတ်ထားတဲ့ variable တစ်ခုကို ဖယ်ရှားပါတယ်။

### pm.environment.clear():function

Active environment ကနေ variables အားလုံးကို ရှင်းလင်းပါတယ်။

## pm.iterationData

[Collection run တစ်ခုအတွင်း data files](/docs/postman/working-with-data-files) ကနေ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.iterationData` methods တွေကို သုံးပါ။

`pm.iterationData` method ကို performance testing မှာ မရနိုင်ပါဘူး။ Performance testing က fixed iteration count တစ်ခုကို မသုံးတာကြောင့် — data file variables တွေကို `pm.variables` method နဲ့ access လုပ်လို့ရတဲ့ local variables တွေအဖြစ် သိမ်းဆည်းပါတယ်။

### pm.iterationData.has(variableName:String)

Iteration data file ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Data variable ရှိနေပါတယ်။
* `false` — Data variable မရှိပါဘူး။

### pm.iterationData.get(variableName:String)

Iteration data file ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ data variable တစ်ခုရဲ့ value ကို ရယူပါတယ်။

Data variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး data variable တစ်ခုရဲ့ value ဆီ string တစ်ခု ပေါင်းထည့်နိုင်ပါတယ်။

### pm.iterationData.toObject()

Iteration data file ထဲက data variables အားလုံးကို ရယူပါတယ်။

Data variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

### pm.iterationData.toJSON()

Iteration data file ထဲက data variables အားလုံးကို ရယူပါတယ်။

Data variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို JSON အဖြစ် ပြန်ပေးပါတယ်။

### pm.iterationData.unset(key:String)

Collection run အတွင်းမှာ iteration data ကနေ သတ်မှတ်ထားတဲ့ variable တစ်ခုကို ဖယ်ရှားပါတယ်။

## pm.variables

အကျဉ်းဆုံး scope နဲ့ local variables တွေထဲမှာ variables တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.variables` methods တွေကို သုံးပါ။ ပိုလေ့လာဖို့ — [Variable scope ရဲ့ ဦးစားပေး အစီအစဉ်](#variable-scope-ရဲ့-ဦးစားပေး-အစီအစဉ်) ကို ကြည့်ပါ။

Vault secrets တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ `pm.variables` ကို သုံးတာကို Postman က ပံ့ပိုးမပေးပါဘူး။ [pm.vault](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-vault/) methods တွေကို သုံးပါ။

Performance testing မှာ — `pm.variables` methods တွေက မူလ define လုပ်ခဲ့တဲ့ request ရဲ့ ကြာချိန်အတွက်ပဲ scope ကန့်သတ်ထားပြီး — နောက် requests တွေက access လုပ်လို့ မရပါဘူး။ VU တစ်ခုက လုပ်တဲ့ ပြောင်းလဲမှုတွေက private ဖြစ်ပြီး တခြား VUs တွေကို မသက်ရောက်ပါဘူး။

### pm.variables.has(variableName:String)

Collection ဒါမှမဟုတ် environment scope စတဲ့ — scopes တွေထဲက တစ်ခုခုမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Variable က scopes တွေထဲက တစ်ခုမှာ ရှိနေပါတယ်။
* `false` — Global variable က scopes တစ်ခုမှာမှ မရှိပါဘူး။

### pm.variables.get(variableName:String)

အကျဉ်းဆုံး scope ထဲမှာ သတ်မှတ်ထားတဲ့ နာမည်နဲ့ variable တစ်ခုရဲ့ value ကို ရယူပါတယ်။

အကျဉ်းဆုံး scope ထဲက variable ရဲ့ value ကို ပြန်ပေးပါတယ်။ ဥပမာ — collection နဲ့ environment scopes နှစ်ခုလုံးမှာ နာမည်တူ variable တစ်ခု ရှိနေရင် — Postman က active environment ထဲက value ကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး variable တစ်ခုရဲ့ value ဆီ string တစ်ခု ပေါင်းထည့်နိုင်ပါတယ်။

### pm.variables.set(variableName:String, variableValue:\*)

သတ်မှတ်ထားတဲ့ နာမည်နဲ့ value နဲ့ local variable တစ်ခုကို set လုပ်ပါတယ်။

### pm.variables.replaceIn(variableName:string)

`{{$dynamicVariableName}}` syntax ကို သုံးပြီး script တစ်ခုထဲမှာ [dynamic variable](/docs/tests-and-scripts/write-scripts/variables-list/) တစ်ခုရဲ့ resolved value ကို ရယူပါတယ်။

Dynamic variable ရဲ့ value ကို ပြန်ပေးပါတယ်။

### pm.variables.toObject()

Active environment ထဲက variables အားလုံးကို ရယူပါတယ်။

[ဦးစားပေး အစီအစဉ်](#variable-scope-ရဲ့-ဦးစားပေး-အစီအစဉ်) အပေါ် အခြေခံပြီး — variables အားလုံးနဲ့ သူတို့ရဲ့ values တွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Object ထဲမှာ scopes အများကြီးကနေ variables တွေ ပါဝင်ပါလိမ့်မယ်။ ဥပမာ — ဖွင့်ထားတဲ့ collection နဲ့ globals နှစ်ခုလုံးမှာ variable တစ်ခု ရှိနေရင် — object ထဲမှာ variables နှစ်ခုလုံး ပါဝင်ပါလိမ့်မယ်။
