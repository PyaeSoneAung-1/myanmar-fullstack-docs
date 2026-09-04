---
title: "CREATE POLICY (table တစ်ခုပေါ်မှာ row-level security policy အသစ်တစ်ခု သတ်မှတ်ခြင်း)"
description: "Table တစ်ခုပေါ်တွင် row-level security policy (row အဆင့် လုံခြုံရေး မူဝါဒ) အသစ်တစ်ခုကို သတ်မှတ်ပေးသည့် command — FOR ဖြင့် သက်ရောက်မည့် command အမျိုးအစား (ALL/SELECT/INSERT/UPDATE/DELETE) ကို၎င်း၊ TO ဖြင့် သက်ရောက်မည့် roles များကို၎င်း ရွေးချယ်နိုင်ပြီး ရှိပြီးသား rows များကို USING expression ဖြင့်၎င်း၊ insert/update ပြုလုပ်မည့် row အသစ်များကို WITH CHECK expression ဖြင့်၎င်း စစ်ဆေးသည်; command အလိုက် policy များ သီးခြား သတ်မှတ်နိုင်ပြီး PERMISSIVE/RESTRICTIVE policies များကို ပေါင်းစပ် အသုံးပြုနိုင်"
order: 318
source: "https://www.postgresql.org/docs/current/sql-createpolicy.html"
status: translated
updated: 2026-09-04
---

## CREATE POLICY (table တစ်ခုပေါ်မှာ row-level security policy အသစ်တစ်ခု သတ်မှတ်ခြင်း)

CREATE POLICY — table တစ်ခုပေါ်မှာ row-level security policy (row အဆင့် လုံခြုံရေး မူဝါဒ) အသစ်တစ်ခုကို သတ်မှတ် (define) ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE POLICY name ON table_name
    [ AS { PERMISSIVE | RESTRICTIVE } ]
    [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
    [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
    [ USING ( using_expression ) ]
    [ WITH CHECK ( check_expression ) ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE POLICY` command က — table တစ်ခုအတွက် row-level security policy အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဖန်တီးလိုက်တဲ့ policies တွေ သက်ရောက်နိုင်ဖို့အတွက် — table ပေါ်မှာ row-level security ကို (ဥပမာ — `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` သုံးပြီး) enable (ဖွင့်) ထားရမယ်ဆိုတာ သတိပြုပါ။

Policy တစ်ခုက — သက်ဆိုင်ရာ policy expression နဲ့ ကိုက်ညီတဲ့ rows တွေကို select, insert, update သို့မဟုတ် delete လုပ်ပိုင်ခွင့်ကို ပေးပါတယ်။ Table ထဲက ရှိပြီးသား rows တွေကို `USING` မှာ သတ်မှတ်ထားတဲ့ expression နဲ့ စစ်ဆေးပြီး — `INSERT` သို့မဟုတ် `UPDATE` ကနေတစ်ဆင့် အသစ် ဖန်တီးလာမယ့် rows တွေကိုတော့ `WITH CHECK` မှာ သတ်မှတ်ထားတဲ့ expression နဲ့ စစ်ဆေးပါတယ်။ `USING` expression တစ်ခုက ပေးထားတဲ့ row တစ်ခုအတွက် true ပြန်ပေးတယ်ဆိုရင် — အဲဒီ row က user ကို မြင်ရပြီး — false သို့မဟုတ် null ပြန်ပေးတယ်ဆိုရင်တော့ — အဲဒီ row က မမြင်ရပါဘူး။ ပုံမှန်အားဖြင့် — row တစ်ခု မမြင်ရတဲ့အခါ error မဖြစ်ပေါ်ပါဘူး — ဒါပေမယ့် ချွင်းချက်တွေအတွက်တော့ ဇယား 300 ကို ကြည့်ပါ။ `WITH CHECK` expression တစ်ခုက row တစ်ခုအတွက် true ပြန်ပေးတယ်ဆိုရင် — အဲဒီ row ကို insert သို့မဟုတ် update လုပ်ပြီး — false သို့မဟုတ် null ပြန်ပေးတယ်ဆိုရင်တော့ — error တစ်ခု ဖြစ်ပေါ်ပါတယ်။

`INSERT`, `UPDATE` နဲ့ `MERGE` statements တွေအတွက် — `WITH CHECK` expressions တွေကို `BEFORE` triggers တွေ fire (လှုံ့ဆော်) လုပ်ပြီးတဲ့ နောက်မှာ၎င်း၊ လက်တွေ့ data ပြုပြင်မွမ်းမံမှု (data modifications) တွေ မလုပ်ဆောင်ခင်မှာ၎င်း အတင်းအကျပ် လိုက်နာစေပါတယ်။ ဒါကြောင့် — `BEFORE ROW` trigger တစ်ခုက — insert လုပ်မယ့် data ကို ပြုပြင်ပြီး — security policy စစ်ဆေးမှုရဲ့ ရလဒ်ကို သက်ရောက်မှု ရှိစေနိုင်ပါတယ်။ `WITH CHECK` expressions တွေကို — တခြား constraints တွေ အားလုံးထက် အရင်ဆုံး အတင်းအကျပ် လိုက်နာစေပါတယ်။

Policy နာမည်တွေက table တစ်ခုချင်းစီအတွက် သီးခြား ဖြစ်ပါတယ်။ ဒါကြောင့် — policy နာမည်တစ်ခုတည်းကို — table အများအပြားမှာ သုံးနိုင်ပြီး — table တစ်ခုချင်းစီအတွက် — အဲဒီ table နဲ့ သင့်လျော်တဲ့ သတ်မှတ်ချက် (definition) တစ်ခုစီ ရှိနိုင်ပါတယ်။

Policies တွေကို — သတ်မှတ်ထားတဲ့ commands တွေ သို့မဟုတ် သတ်မှတ်ထားတဲ့ roles တွေအတွက်ပဲ သက်ရောက်အောင် လုပ်နိုင်ပါတယ်။ အသစ် ဖန်တီးတဲ့ policies တွေအတွက် default ကတော့ — တစ်ခြားသတ်မှတ်ချက် မပါရင် — commands နဲ့ roles အားလုံးကို သက်ရောက်တာ ဖြစ်ပါတယ်။ Command တစ်ခုတည်းကို policy အများအပြား သက်ရောက်နိုင်ပါတယ်; အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။ Policy အမျိုးအစား မတူညီတာတွေက — command တစ်ခုချင်းစီအပေါ် ဘယ်လို သက်ရောက်လဲဆိုတာကို ဇယား 300 မှာ အကျဉ်းချုပ် ဖော်ပြထားပါတယ်။

`USING` ရော `WITH CHECK` expressions ရော နှစ်မျိုးလုံး ရှိနိုင်တဲ့ policies တွေ (`ALL` နဲ့ `UPDATE`) အတွက် — `WITH CHECK` expression ကို သတ်မှတ်ထားခြင်း မရှိဘူးဆိုရင် — ဘယ် rows တွေ မြင်နိုင်မလဲ (သာမန် `USING` ကိစ္စ) နဲ့ ဘယ် rows အသစ်တွေကို ထပ်ပေါင်းခွင့် ပြုမလဲ (`WITH CHECK` ကိစ္စ) ဆိုတာ ဆုံးဖြတ်ဖို့ နှစ်မျိုးလုံးအတွက် `USING` expression ကိုပဲ သုံးပါလိမ့်မယ်။

Table တစ်ခုအတွက် row-level security ကို enable လုပ်ထားပေမယ့် — သက်ဆိုင်တဲ့ policies တွေ မရှိဘူးဆိုရင် — “default deny” (ပုံမှန် ငြင်းပယ်ခြင်း) policy တစ်ခု ရှိတယ်လို့ ယူဆတာကြောင့် — rows တစ်ခုမှ မမြင်ရသလို update လုပ်လို့လည်း မရနိုင်ပါဘူး။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် policy ရဲ့ နာမည် ဖြစ်ပါတယ်။ ဒီ နာမည်က — table အတွက် တခြား policy တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီဘဲ သီးခြား (distinct) ဖြစ်ရပါမယ်။
- **table_name** — Policy သက်ရောက်မယ့် table ရဲ့ နာမည် (schema-qualified — schema ပါဝင်သော — ပုံစံလည်း ဖြစ်နိုင်သည်) ဖြစ်ပါတယ်။
- **PERMISSIVE** — Policy ကို permissive policy (ခွင့်ပြုတတ်သော မူဝါဒ) အဖြစ် ဖန်တီးစေဖို့ သတ်မှတ်ပါတယ်။ ပေးထားတဲ့ query တစ်ခုကို သက်ရောက်တဲ့ permissive policies တွေ အားလုံးကို — Boolean “OR” operator သုံးပြီး — ပေါင်းစပ်ပါတယ်။ Permissive policies တွေ ဖန်တီးခြင်းအားဖြင့် — administrators (စီမံခန့်ခွဲသူများ) တွေက — ဝင်ရောက်လို့ ရနိုင်တဲ့ records အစုကို တိုးချဲ့နိုင်ပါတယ်။ Policies တွေက default အားဖြင့် permissive ဖြစ်ပါတယ်။
- **RESTRICTIVE** — Policy ကို restrictive policy (တင်းကျပ်သော မူဝါဒ) အဖြစ် ဖန်တီးစေဖို့ သတ်မှတ်ပါတယ်။ ပေးထားတဲ့ query တစ်ခုကို သက်ရောက်တဲ့ restrictive policies တွေ အားလုံးကို — Boolean “AND” operator သုံးပြီး — ပေါင်းစပ်ပါတယ်။ Restrictive policies တွေ ဖန်တီးခြင်းအားဖြင့် — record တစ်ခုချင်းစီအတွက် restrictive policies တွေ အားလုံး ကျော်ဖြတ်ရမှာ ဖြစ်လို့ — administrators တွေက ဝင်ရောက်လို့ ရနိုင်တဲ့ records အစုကို လျှော့ချနိုင်ပါတယ်။
Restrictive policies တွေက အဲဒီ access ကို လျှော့ချဖို့ အသုံးဝင်ဖို့ဆိုရင် — records တွေဆီ access ပေးမယ့် permissive policy အနည်းဆုံး တစ်ခု ရှိဖို့ လိုအပ်တာ သတိပြုပါ။ Restrictive policies တွေပဲ ရှိနေရင် — record တစ်ခုမှ ဝင်ရောက်လို့ ရမှာ မဟုတ်ပါဘူး။ Permissive နဲ့ restrictive policies တွေ ရောနှော ရှိနေတဲ့အခါ — record တစ်ခုကို — permissive policies တွေထဲက အနည်းဆုံး တစ်ခု ကျော်ဖြတ်တာ အပြင် — restrictive policies တွေ အားလုံးကိုပါ ကျော်ဖြတ်မှသာ — ဝင်ရောက်လို့ ရပါတယ်။
- **command** — Policy သက်ရောက်မယ့် command ဖြစ်ပါတယ်။ ခွင့်ပြုထားတဲ့ options တွေကတော့ ALL, SELECT, INSERT, UPDATE နဲ့ DELETE တို့ ဖြစ်ပါတယ်။ ALL က default ဖြစ်ပါတယ်။ ဒါတွေ ဘယ်လို သက်ရောက်လဲဆိုတဲ့ အသေးစိတ်တွေအတွက် အောက်မှာ ကြည့်ပါ။
- **role_name** — Policy ကို သက်ရောက်စေမယ့် role(s) တွေ ဖြစ်ပါတယ်။ Default ကတော့ PUBLIC ဖြစ်ပြီး — policy က roles အားလုံးကို သက်ရောက်စေပါတယ်။
- **using_expression** — ဘယ် SQL conditional expression မဆို (boolean ပြန်ပေးတဲ့) ဖြစ်ပါတယ်။ ဒီ conditional expression ထဲမှာ aggregate သို့မဟုတ် window functions တွေ ပါဝင်လို့ မရပါဘူး။ Row-level security ကို enable လုပ်ထားရင် — ဒီ expression ကို — table ကို ရည်ညွှန်းတဲ့ queries တွေထဲမှာ ထည့်သွင်းပါလိမ့်မယ်။ Expression က true ပြန်ပေးတဲ့ rows တွေက မြင်နိုင်မှာ ဖြစ်ပြီး — false သို့မဟုတ် null ပြန်ပေးတဲ့ rows တွေကတော့ — (SELECT တစ်ခုမှာ) user ကို မမြင်ရသလို — (UPDATE သို့မဟုတ် DELETE တစ်ခုမှာလည်း) ပြုပြင်မှု (modification) အတွက် မရနိုင်ပါဘူး။ ပုံမှန်အားဖြင့် — အဲဒီလို rows တွေကို တိတ်တဆိတ် ဖိနှိပ်ခံရပြီး error အစီရင်ခံခြင်း မရှိပါဘူး (ချွင်းချက်တွေအတွက်တော့ ဇယား 300 ကို ကြည့်ပါ)။
- **check_expression** — ဘယ် SQL conditional expression မဆို (boolean ပြန်ပေးတဲ့) ဖြစ်ပါတယ်။ ဒီ conditional expression ထဲမှာ aggregate သို့မဟုတ် window functions တွေ ပါဝင်လို့ မရပါဘူး။ Row-level security ကို enable လုပ်ထားရင် — ဒီ expression ကို — table ကို ရည်ညွှန်းတဲ့ INSERT နဲ့ UPDATE queries တွေမှာ သုံးပါလိမ့်မယ်။ Expression က true လို့ အကဲဖြတ်တဲ့ rows တွေကိုပဲ ခွင့်ပြုပါလိမ့်မယ်။ Insert လုပ်လိုက်တဲ့ records တွေထဲက ဘယ်ဟာမဆို သို့မဟုတ် update ကနေ ရလဒ် ထွက်လာတဲ့ records တွေထဲက ဘယ်ဟာမဆို အတွက် — expression က false သို့မဟုတ် null လို့ အကဲဖြတ်ခဲ့ရင် — error တစ်ခု ပစ်ချပါလိမ့်မယ်။ check_expression ကို row ရဲ့ မူရင်း အကြောင်းအရာ (original contents) အပေါ် မဟုတ်ဘဲ — အဆိုပြုထားတဲ့ (proposed) အကြောင်းအရာ အသစ်အပေါ်မှာ အကဲဖြတ်တယ်ဆိုတာ သတိပြုပါ။

### Per-Command Policies (command အလိုက် Policies)

- **ALL** — Policy တစ်ခုအတွက် ALL ကို သုံးတာက — command ရဲ့ အမျိုးအစား မသက်ဆိုင်ဘဲ — commands အားလုံးကို သက်ရောက်စေတာ ဖြစ်ပါတယ်။ ALL policy တစ်ခု ရှိပြီး — ပိုပြီး တိကျတဲ့ (more specific) policies တွေလည်း ရှိနေရင် — ALL policy ရော တိကျတဲ့ policy (များ) ရောက နှစ်မျိုးလုံး သက်ရောက်ပါလိမ့်မယ်။ ထို့အပြင် — ALL policies တွေက query တစ်ခုရဲ့ ရွေးချယ်မှု (selection) ဘက်ခြမ်း ရော ပြုပြင်မှု (modification) ဘက်ခြမ်းရောက နှစ်ဖက်စလုံးကို သက်ရောက်ပြီး — USING expression တစ်ခုပဲ သတ်မှတ်ထားရင် — နှစ်ဖက်စလုံးအတွက် USING expression ကိုပဲ သုံးပါတယ်။
ဥပမာအနေနဲ့ — UPDATE တစ်ခု ထုတ်ပြန်လိုက်ရင် — ALL policy က — UPDATE က update လုပ်ဖို့ rows အဖြစ် ရွေးချယ်နိုင်တဲ့အရာတွေကိုရော (USING expression ကို သက်ရောက်စေပြီး) — ထွက်ပေါ်လာတဲ့ updated rows တွေကို — table ထဲ ထပ်ပေါင်းခွင့် ရှိမရှိ စစ်ဆေးတာမှာပါ (WITH CHECK expression — သတ်မှတ်ထားရင် ၎င်း၊ မဟုတ်ရင် USING expression — ကို သက်ရောက်စေပြီး) — သက်ဆိုင်ပါလိမ့်မယ်။ INSERT သို့မဟုတ် UPDATE command တစ်ခုက — ALL policy ရဲ့ WITH CHECK expression (WITH CHECK expression မရှိရင် ၎င်းရဲ့ USING expression) ကို မကျော်ဖြတ်တဲ့ rows တွေကို table ထဲ ထပ်ပေါင်းဖို့ ကြိုးစားရင် — command တစ်ခုလုံး ရပ်ဆိုင်း (abort) လိုက်ပါလိမ့်မယ်။
- **SELECT** — Policy တစ်ခုအတွက် SELECT ကို သုံးတာက — SELECT queries တွေနဲ့ — policy သတ်မှတ်ထားတဲ့ relation ပေါ်မှာ SELECT permissions တွေ လိုအပ်တဲ့ အခါတိုင်းကို သက်ရောက်စေတာ ဖြစ်ပါတယ်။ ရလဒ်ကတော့ — SELECT query တစ်ခုအတွင်း — relation ကနေ SELECT policy ကို ကျော်ဖြတ်တဲ့ records တွေကိုပဲ ပြန်ပေးမှာ ဖြစ်ပြီး — SELECT permissions တွေ လိုအပ်တဲ့ queries တွေ (UPDATE, DELETE နဲ့ MERGE လို) ကလည်း — SELECT policy က ခွင့်ပြုထားတဲ့ records တွေကိုပဲ မြင်ရမှာ ဖြစ်ပါတယ်။ SELECT policy တစ်ခုမှာ WITH CHECK expression ရှိလို့ မရပါဘူး — ဘာလို့လဲဆိုရင် ၎င်းက — relation ကနေ records တွေ ပြန်ယူနေတဲ့ (retrieve) ကိစ္စတွေမှာပဲ သက်ဆိုင်လို့ပါ — အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း ချွင်းချက်တွေ ရှိတာကလွဲလို့။
Data ကို ပြုပြင်တဲ့ (data-modifying) query တစ်ခုမှာ RETURNING clause ပါရှိနေရင် — relation ပေါ်မှာ SELECT permissions တွေ လိုအပ်ပြီး — relation ကနေ အသစ် insert သို့မဟုတ် update လုပ်ထားတဲ့ rows တွေက — RETURNING clause အတွက် ရနိုင်ဖို့ — relation ရဲ့ SELECT policies တွေကို ကျေနပ်စေရပါမယ်။ အသစ် insert သို့မဟုတ် update လုပ်ထားတဲ့ row တစ်ခုက relation ရဲ့ SELECT policies တွေကို မကျေနပ်ဘူးဆိုရင် — error တစ်ခု ပစ်ချပါလိမ့်မယ် (ပြန်ပေးဖို့ ရည်ရွယ်ထားတဲ့ inserted သို့မဟုတ် updated rows တွေကို ဘယ်တော့မှ တိတ်တဆိတ် လျစ်လျူရှုမှာ မဟုတ်ပါဘူး)။
INSERT တစ်ခုမှာ ON CONFLICT DO UPDATE clause တစ်ခု သို့မဟုတ် — arbiter index သို့မဟုတ် constraint specification တစ်ခု ပါတဲ့ ON CONFLICT DO NOTHING clause တစ်ခု ရှိနေရင် — relation ပေါ်မှာ SELECT permissions တွေ လိုအပ်ပြီး — insert လုပ်ဖို့ အဆိုပြုထားတဲ့ rows တွေကို relation ရဲ့ SELECT policies တွေနဲ့ စစ်ဆေးပါတယ်။ Insert လုပ်ဖို့ အဆိုပြုထားတဲ့ row တစ်ခုက relation ရဲ့ SELECT policies တွေကို မကျေနပ်ဘူးဆိုရင် — error တစ်ခု ပစ်ချပါတယ် (INSERT ကို ဘယ်တော့မှ တိတ်တဆိတ် ရှောင်ရှားမှာ မဟုတ်ပါဘူး)။ ထို့အပြင် — UPDATE လမ်းကြောင်း (path) ကို သုံးမယ်ဆိုရင် — update လုပ်ရမယ့် row ရော update ဖြစ်ပြီးသား row အသစ်ရောကို — relation ရဲ့ SELECT policies တွေနဲ့ စစ်ဆေးပြီး — ကျေနပ်မှု မရှိရင် error တစ်ခု ပစ်ချပါတယ် (auxiliary UPDATE ကို ဘယ်တော့မှ တိတ်တဆိတ် ရှောင်ရှားမှာ မဟုတ်ပါဘူး)။
MERGE command တစ်ခုက — source ရော target relations ရောက နှစ်ခုလုံးပေါ်မှာ SELECT permissions တွေ လိုအပ်တာကြောင့် — relation တစ်ခုချင်းစီရဲ့ SELECT policies တွေကို — သူတို့ join (ပေါင်းစပ်) မလုပ်ခင် — သက်ရောက်စေပြီး — MERGE actions တွေက အဲဒီ policies တွေက ခွင့်ပြုထားတဲ့ records တွေကိုပဲ မြင်ရမှာ ဖြစ်ပါတယ်။ ထို့အပြင် — UPDATE action တစ်ခုကို လုပ်ဆောင်တဲ့အခါ — target relation ရဲ့ SELECT policies တွေကို — သီးခြား (standalone) UPDATE တစ်ခုအတွက် လုပ်သလိုပဲ — updated row အပေါ်မှာ သက်ရောက်စေပြီး — ကျေနပ်မှု မရှိရင်တော့ error တစ်ခု ပစ်ချပါတယ်။
- **INSERT** — Policy တစ်ခုအတွက် INSERT ကို သုံးတာက — INSERT commands တွေနဲ့ — INSERT actions တွေ ပါဝင်တဲ့ MERGE commands တွေကို သက်ရောက်စေတာ ဖြစ်ပါတယ်။ ဒီ policy ကို မကျော်ဖြတ်တဲ့ rows တွေ insert လုပ်ခံရရင် — policy violation error (မူဝါဒ ချိုးဖောက်မှု error) တစ်ခု ဖြစ်ပေါ်ပြီး — INSERT command တစ်ခုလုံး ရပ်ဆိုင်းသွားပါလိမ့်မယ်။ INSERT policy တစ်ခုမှာ USING expression ရှိလို့ မရပါဘူး — ဘာလို့လဲဆိုရင် ၎င်းက — relation ထဲကို records တွေ ထပ်ပေါင်းနေတဲ့ ကိစ္စတွေမှာပဲ သက်ဆိုင်လို့ပါ။
ON CONFLICT DO NOTHING/UPDATE clause ပါတဲ့ INSERT တစ်ခုက — insert လုပ်ဖို့ အဆိုပြုထားတဲ့ rows တွေ အားလုံးအတွက် — အဆုံးမှာ တကယ် insert ဖြစ်သွားလား မဖြစ်သွားဘူးလား မသက်ဆိုင်ဘဲ — INSERT policies တွေရဲ့ WITH CHECK expressions တွေကို စစ်ဆေးပါတယ်ဆိုတာ သတိပြုပါ။
- **UPDATE** — Policy တစ်ခုအတွက် UPDATE ကို သုံးတာက — UPDATE, SELECT FOR UPDATE နဲ့ SELECT FOR SHARE commands တွေအပြင် — INSERT commands တွေရဲ့ auxiliary ON CONFLICT DO UPDATE clauses တွေနဲ့ — UPDATE actions တွေ ပါဝင်တဲ့ MERGE commands တွေကိုပါ သက်ရောက်စေတာ ဖြစ်ပါတယ်။ UPDATE command တစ်ခုက — ရှိပြီးသား record တစ်ခုကို ဆွဲထုတ်ပြီး — ၎င်းကို ပြုပြင်ထားတဲ့ record အသစ်တစ်ခုနဲ့ အစားထိုးတာ ပါဝင်တာကြောင့် — UPDATE policies တွေက USING expression ရော WITH CHECK expression ရော နှစ်မျိုးလုံးကို လက်ခံပါတယ်။ USING expression က — UPDATE command က ဘယ် records တွေကို မြင်ပြီး လုပ်ဆောင်မလဲ ဆုံးဖြတ်ပေးပြီး — WITH CHECK expression ကတော့ — ပြုပြင်ပြီးသား rows တွေထဲက ဘယ်ဟာတွေကို relation ထဲ ပြန်သိမ်းခွင့် ပြုမလဲ သတ်မှတ်ပေးပါတယ်။
Update လုပ်ထားတဲ့ တန်ဖိုးတွေက WITH CHECK expression ကို မကျော်ဖြတ်တဲ့ rows တွေ ဘယ်ဟာမဆို — error တစ်ခု ဖြစ်စေပြီး — command တစ်ခုလုံး ရပ်ဆိုင်းသွားပါလိမ့်မယ်။ USING clause တစ်ခုပဲ သတ်မှတ်ထားရင် — အဲဒီ clause ကို USING ရော WITH CHECK ကိစ္စ နှစ်မျိုးလုံးအတွက်ပါ သုံးပါလိမ့်မယ်။
ပုံမှန်အားဖြင့် — UPDATE command တစ်ခုက — update လုပ်နေတဲ့ relation ထဲက columns တွေရဲ့ data တွေကိုလည်း ဖတ်ဖို့ လိုအပ်ပါတယ် (ဥပမာ — WHERE clause သို့မဟုတ် RETURNING clause တစ်ခုထဲမှာ၊ သို့မဟုတ် SET clause ရဲ့ ညာဘက်ခြမ်း (right-hand side) မှာရှိတဲ့ expression တစ်ခုထဲမှာ)။ ဒီလို အခြေအနေမှာ — update လုပ်နေတဲ့ relation ပေါ်မှာ SELECT rights တွေလည်း လိုအပ်ပြီး — UPDATE policies တွေအပြင် — သင့်လျော်တဲ့ SELECT သို့မဟုတ် ALL policies တွေကိုပါ သက်ရောက်စေပါလိမ့်မယ်။ ဒါကြောင့် — user က — UPDATE သို့မဟုတ် ALL policy တစ်ခုကနေတစ်ဆင့် update လုပ်နေတဲ့ row(s) တွေကို update လုပ်ခွင့် ရှိတာ အပြင် — SELECT သို့မဟုတ် ALL policy တစ်ခုကနေတစ်ဆင့် — အဲဒီ row(s) တွေဆီ ဝင်ရောက်ခွင့်လည်း ရှိရပါမယ်။
INSERT command တစ်ခုမှာ auxiliary ON CONFLICT DO UPDATE clause ရှိနေပြီး — UPDATE လမ်းကြောင်းကို လိုက်မယ်ဆိုရင် — update လုပ်ရမယ့် row ကို အရင်ဆုံး — UPDATE policies တွေထဲက ဘယ်ဟာမဆိုရဲ့ USING expressions တွေနဲ့ စစ်ဆေးပြီး — နောက်တော့မှ — update ဖြစ်လာတဲ့ row အသစ်ကို WITH CHECK expressions တွေနဲ့ စစ်ဆေးပါတယ်။ ဒါပေမယ့် — သီးခြား (standalone) UPDATE command တစ်ခုနဲ့ မတူဘဲ — ရှိပြီးသား row က USING expressions တွေကို မကျော်ဖြတ်ရင် — error တစ်ခု ပစ်ချမှာ ဖြစ်တာ သတိပြုပါ (UPDATE လမ်းကြောင်းကို ဘယ်တော့မှ တိတ်တဆိတ် ရှောင်ရှားမှာ မဟုတ်ပါဘူး)။ MERGE command တစ်ခုရဲ့ UPDATE action တစ်ခုအတွက်လည်း အလားတူပဲ သက်ရောက်ပါတယ်။
- **DELETE** — Policy တစ်ခုအတွက် DELETE ကို သုံးတာက — DELETE commands တွေနဲ့ — DELETE actions တွေ ပါဝင်တဲ့ MERGE commands တွေကို သက်ရောက်စေတာ ဖြစ်ပါတယ်။ DELETE command တစ်ခုအတွက် — ဒီ policy ကို ကျော်ဖြတ်တဲ့ rows တွေကိုပဲ DELETE command က မြင်ရမှာ ဖြစ်ပါတယ်။ SELECT policy တစ်ခုကနေတစ်ဆင့် မြင်ရတဲ့ rows တွေထဲမှာ — DELETE policy ရဲ့ USING expression ကို မကျော်ဖြတ်ရင် — ဖျက်ပစ်ဖို့ (deletion) မရနိုင်တဲ့ rows တွေ ရှိနိုင်ပါတယ်။ ဒါပေမယ့် — MERGE command တစ်ခုထဲက DELETE action တစ်ခုက — SELECT policies တွေကနေတစ်ဆင့် မြင်ရတဲ့ rows တွေကို မြင်ရမှာ ဖြစ်ပြီး — အဲဒီလို row တစ်ခုအတွက် DELETE policy က မကျော်ဖြတ်ရင် — error တစ်ခု ပစ်ချမှာ ဖြစ်တာ သတိပြုပါ။
အများစုမှာ — DELETE command တစ်ခုက — သူ ဖျက်ပစ်နေတဲ့ relation ထဲက columns တွေရဲ့ data တွေကိုလည်း ဖတ်ဖို့ လိုအပ်ပါတယ် (ဥပမာ — WHERE clause သို့မဟုတ် RETURNING clause တစ်ခုထဲမှာ)။ ဒီလို အခြေအနေမှာ — relation ပေါ်မှာ SELECT rights တွေလည်း လိုအပ်ပြီး — DELETE policies တွေအပြင် — သင့်လျော်တဲ့ SELECT သို့မဟုတ် ALL policies တွေကိုပါ သက်ရောက်စေပါလိမ့်မယ်။ ဒါကြောင့် — user က — DELETE သို့မဟုတ် ALL policy တစ်ခုကနေတစ်ဆင့် ဖျက်ပစ်နေတဲ့ row(s) တွေကို delete လုပ်ခွင့် ရှိတာ အပြင် — SELECT သို့မဟုတ် ALL policy တစ်ခုကနေတစ်ဆင့် — အဲဒီ row(s) တွေဆီ ဝင်ရောက်ခွင့်လည်း ရှိရပါမယ်။
DELETE policy တစ်ခုမှာ WITH CHECK expression ရှိလို့ မရပါဘူး — ဘာလို့လဲဆိုရင် ၎င်းက — relation ကနေ records တွေ ဖျက်ပစ်နေတဲ့ ကိစ္စတွေမှာပဲ သက်ဆိုင်လို့ — စစ်ဆေးဖို့ row အသစ်တစ်ခု မရှိပါဘူး။

ဇယား 300 က — policy အမျိုးအစား မတူညီတာတွေက command တစ်ခုချင်းစီအပေါ် ဘယ်လို သက်ရောက်လဲဆိုတာကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။ ဇယားထဲမှာ — “check” ဆိုတာ — policy expression ကို စစ်ဆေးပြီး — false သို့မဟုတ် null ပြန်ပေးရင် error တစ်ခု ပစ်ချတာကို ဆိုလိုပြီး — “filter” ဆိုတာကတော့ — policy expression က false သို့မဟုတ် null ပြန်ပေးရင် — row ကို တိတ်တဆိတ် လျစ်လျူရှုတာကို ဆိုလိုပါတယ်။

**ဇယား 300. Command Type အလိုက် Policy များ သက်ရောက်ပုံ**

| Command | `SELECT/ALL policy` | `INSERT/ALL policy` | `UPDATE/ALL policy` | `DELETE/ALL policy` |
| --- | --- | --- | --- | --- |
| *USING expression* | *WITH CHECK expression* | *USING expression* | *WITH CHECK expression* | *USING expression* |
| `SELECT` / `COPY ... TO` | Filter existing row | — | — | — |
| `SELECT FOR UPDATE/SHARE` | Filter existing row | — | Filter existing row | — |
| `INSERT` | Check new row [a] | Check new row | — | — |
| `UPDATE` | Filter existing row [a] & check new row [a] | — | Filter existing row | Check new row |
| `DELETE` | Filter existing row [a] | — | — | — |
| `INSERT ... ON CONFLICT` | Check new row [b][c] | Check new row [c] | — | — |
| `ON CONFLICT DO UPDATE` | Check existing & new rows [d] | — | Check existing row | Check new row [d] |
| `MERGE` | Filter source & target rows | — | — | — |
| `MERGE ... THEN INSERT` | Check new row [a] | Check new row | — | — |
| `MERGE ... THEN UPDATE` | Check new row | — | Check existing row | Check new row |
| `MERGE ... THEN DELETE` | — | — | — | — |

- [a] — ရှိပြီးသား သို့မဟုတ် row အသစ်ကို ဖတ်ရှုခွင့် (read access) လိုအပ်တဲ့အခါ (ဥပမာ — relation ရဲ့ columns တွေကို ရည်ညွှန်းတဲ့ WHERE သို့မဟုတ် RETURNING clause)
- [b] — arbiter index သို့မဟုတ် constraint တစ်ခု သတ်မှတ်ထားရင်
- [c] — conflict ဖြစ်မဖြစ် မသက်ဆိုင်ဘဲ — insert လုပ်ဖို့ ရည်ရွယ်ထားတဲ့ row ကို အမြဲ check လုပ်ပါတယ်
- [d] — မူရင်း INSERT command ရဲ့ row အသစ်နဲ့ မတူနိုင်တဲ့ — auxiliary UPDATE command ရဲ့ row အသစ်

### Application of Multiple Policies (policy အများအပြား သက်ရောက်ခြင်း)

Command type မတူညီတဲ့ policies အများအပြား က — တူညီတဲ့ command တစ်ခုကို သက်ရောက်နေတဲ့အခါ (ဥပမာ — UPDATE command တစ်ခုကို `SELECT` နဲ့ `UPDATE` policies တွေ သက်ရောက်နေတဲ့အခါ) — user က permission အမျိုးအစား နှစ်မျိုးစလုံး (ဥပမာ — relation ကနေ rows တွေကို select လုပ်ခွင့် အပြင် — သူတို့ကို update လုပ်ခွင့်ပါ) ရှိရပါမယ်။ ဒါကြောင့် — policy အမျိုးအစား တစ်ခုရဲ့ expressions တွေကို — တခြား အမျိုးအစား policy တစ်ခုရဲ့ expressions တွေနဲ့ — `AND` operator သုံးပြီး ပေါင်းစပ်ပါတယ်။

Command type တူညီတဲ့ policies အများအပြား က — တူညီတဲ့ command တစ်ခုကို သက်ရောက်နေတဲ့အခါ — relation ဆီ access ပေးမယ့် `PERMISSIVE` policy အနည်းဆုံး တစ်ခု ရှိရမှာ ဖြစ်ပြီး — `RESTRICTIVE` policies တွေ အားလုံး ကျော်ဖြတ်ရပါမယ်။ ဒါကြောင့် — `PERMISSIVE` policy expressions တွေ အားလုံးကို `OR` နဲ့ ပေါင်းစပ်ပြီး — `RESTRICTIVE` policy expressions တွေ အားလုံးကိုတော့ `AND` နဲ့ ပေါင်းစပ်ကာ — ရလဒ်နှစ်ခုကို `AND` နဲ့ ပြန် ပေါင်းစပ်ပါတယ်။ `PERMISSIVE` policies တွေ မရှိဘူးဆိုရင် — access ကို ငြင်းပယ်ပါတယ်။

Policy အများအပြား ပေါင်းစပ်တာနဲ့ ပတ်သက်ပြီး — `ALL` policies တွေကို — သက်ရောက်နေတဲ့ တခြား policy အမျိုးအစား ဘယ်ဟာဖြစ်ဖြစ် — အဲဒီ အမျိုးအစားနဲ့ အတူတူပဲ ယူဆတယ်ဆိုတာ သတိပြုပါ။

ဥပမာအနေနဲ့ — `SELECT` ရော `UPDATE` permissions ရော နှစ်ခုစလုံး လိုအပ်တဲ့ `UPDATE` command တစ်ခုမှာ — အမျိုးအစား တစ်ခုချင်းစီအတွက် သက်ဆိုင်တဲ့ policies အများအပြား ရှိနေရင် — သူတို့ကို အောက်ပါအတိုင်း ပေါင်းစပ်ပါလိမ့်မယ်:

```sql
expression from RESTRICTIVE SELECT/ALL policy 1
AND
expression from RESTRICTIVE SELECT/ALL policy 2
AND
...
AND
(
  expression from PERMISSIVE SELECT/ALL policy 1
  OR
  expression from PERMISSIVE SELECT/ALL policy 2
  OR
  ...
)
AND
expression from RESTRICTIVE UPDATE/ALL policy 1
AND
expression from RESTRICTIVE UPDATE/ALL policy 2
AND
...
AND
(
  expression from PERMISSIVE UPDATE/ALL policy 1
  OR
  expression from PERMISSIVE UPDATE/ALL policy 2
  OR
  ...
)
```

## Notes (မှတ်စုများ)

Table တစ်ခုအတွက် policies တွေ ဖန်တီးဖို့ သို့မဟုတ် ပြောင်းလဲဖို့ဆိုရင် — သင်ဟာ အဲဒီ table ရဲ့ owner ဖြစ်ရပါမယ်။

Policies တွေက — database ထဲက tables တွေကို ရည်ညွှန်းတဲ့ ရှင်းလင်းတဲ့ (explicit) queries တွေအတွက် သက်ရောက်မှာ ဖြစ်ပေမယ့် — system က အတွင်းပိုင်း referential integrity checks (ကိုးကားချက် ကြံ့ခိုင်မှု စစ်ဆေးမှုများ) တွေ လုပ်ဆောင်နေချိန် သို့မဟုတ် constraints တွေကို validate (စစ်ဆေး) လုပ်နေချိန်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။ ဒါက ဆိုလိုတာက — ပေးထားတဲ့ တန်ဖိုးတစ်ခု တည်ရှိကြောင်းကို — သွယ်ဝိုက်တဲ့ (indirect) နည်းလမ်းတွေနဲ့ ဆုံးဖြတ်နိုင်တဲ့ အခြေအနေတွေ ရှိပါတယ်။ ဥပမာတစ်ခုကတော့ — primary key ဖြစ်တဲ့ သို့မဟုတ် unique constraint ရှိတဲ့ column တစ်ခုထဲကို duplicate (ထပ်နေသော) တန်ဖိုးတစ်ခု insert လုပ်ဖို့ ကြိုးစားတာ ဖြစ်ပါတယ်။ Insert က မအောင်မြင်ခဲ့ရင် — user က အဲဒီ တန်ဖိုး ရှိပြီးသားလို့ မှန်းဆနိုင်ပါတယ်။ (ဒီဥပမာက — user ကို — သူတို့ မမြင်ခွင့် မရှိတဲ့ records တွေကို insert လုပ်ခွင့် policy က ပေးထားတယ်လို့ ယူဆပါတယ်။) နောက်ထပ် ဥပမာတစ်ခုကတော့ — user တစ်ယောက်က — တခြား ဖုံးကွယ်ထားတဲ့ (hidden) table တစ်ခုကို ရည်ညွှန်းတဲ့ table တစ်ခုထဲကို insert လုပ်ခွင့် ရှိနေတဲ့ ကိစ္စ ဖြစ်ပါတယ်။ ရည်ညွှန်းနေတဲ့ (referencing) table ထဲကို တန်ဖိုးတွေ insert လုပ်ပြီး — အောင်မြင်မှုက ရည်ညွှန်းခံရတဲ့ (referenced) table ထဲမှာ တန်ဖိုး တည်ရှိကြောင်း ညွှန်ပြနိုင်တာကနေတစ်ဆင့် — တည်ရှိမှုကို ဆုံးဖြတ်နိုင်ပါတယ်။ ဒီ ပြဿနာတွေကို — user တွေ မမြင်နိုင်တဲ့ တန်ဖိုးတစ်ခုကို ညွှန်ပြနိုင်ခြေ ရှိတဲ့ records တွေကို insert, delete သို့မဟုတ် update လုပ်လို့ လုံးဝ မရအောင် — policies တွေကို ဂရုတစိုက် ရေးဆွဲခြင်း သို့မဟုတ် — ပြင်ပ အဓိပ္ပာယ် (external meanings) ရှိတဲ့ keys တွေအစား — generated values (ဥပမာ — surrogate keys) တွေကို သုံးခြင်းအားဖြင့် ဖြေရှင်းနိုင်ပါတယ်။

ယေဘုယျအားဖြင့် — system က — security policies တွေနဲ့ ချမှတ်ထားတဲ့ filter conditions တွေကို — user queries တွေမှာ ပါဝင်တဲ့ qualifications တွေထက် အရင်ဆုံး အတင်းအကျပ် လိုက်နာစေပြီး — ကာကွယ်ထားတဲ့ (protected) data တွေက — စိတ်ချရမှု မရှိနိုင်တဲ့ user-defined functions တွေဆီ မရည်ရွယ်ဘဲ ပေါက်ကြားမှု မဖြစ်အောင် ကာကွယ်ပါတယ်။ ဒါပေမယ့် — system (သို့မဟုတ် system administrator) က `LEAKPROOF` အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ functions နဲ့ operators တွေကိုတော့ — သူတို့ကို စိတ်ချရတယ်လို့ ယူဆတာကြောင့် — policy expressions တွေထက် စောပြီး အကဲဖြတ်နိုင်ပါတယ်။

Policy expressions တွေကို user ရဲ့ query ထဲကို တိုက်ရိုက် ထည့်သွင်းတာကြောင့် — သူတို့ကို — query တစ်ခုလုံးကို run လုပ်နေတဲ့ user ရဲ့ rights တွေနဲ့ run လုပ်ပါလိမ့်မယ်။ ဒါကြောင့် — ပေးထားတဲ့ policy တစ်ခုကို သုံးနေတဲ့ users တွေက — expression ထဲမှာ ရည်ညွှန်းထားတဲ့ tables သို့မဟုတ် functions တွေကို ဝင်ရောက်နိုင်ရပါမယ် — မဟုတ်ရင် — row-level security ဖွင့်ထားတဲ့ table ကို query လုပ်ဖို့ ကြိုးစားတဲ့အခါ — permission denied error (ခွင့်ပြုချက် ငြင်းပယ်ခံရမှု error) တစ်ခုကိုပဲ ရရှိပါလိမ့်မယ်။ ဒါပေမယ့် — ဒါက views တွေ အလုပ်လုပ်ပုံကိုတော့ မပြောင်းလဲပါဘူး။ သာမန် queries နဲ့ views တွေမှာ လုပ်သလိုပဲ — view တစ်ခုက ရည်ညွှန်းထားတဲ့ tables တွေအတွက် permission checks နဲ့ policies တွေက — view owner ရဲ့ rights တွေနဲ့ — view owner ကို သက်ရောက်တဲ့ policies တွေကို သုံးပါလိမ့်မယ် — view ကို `security_invoker` option သုံးပြီး သတ်မှတ်ထားတာမဟုတ်ဘူးဆိုရင် ([`CREATE VIEW`](/docs/postgresql/sql-createview) ကို ကြည့်ပါ)။

`MERGE` အတွက် သီးခြား policy တစ်ခု မရှိပါဘူး။ အဲဒီအစား — `MERGE` ကို လုပ်ဆောင်နေစဉ်မှာ — လုပ်ဆောင်နေတဲ့ actions တွေပေါ် မူတည်ပြီး — `SELECT`, `INSERT`, `UPDATE` နဲ့ `DELETE` အတွက် သတ်မှတ်ထားတဲ့ policies တွေကို သက်ရောက်စေပါတယ်။

နောက်ထပ် ဆွေးနွေးချက်တွေနဲ့ လက်တွေ့ ဥပမာတွေကို [အပိုင်း 5.9](/docs/postgresql/ddl-rowsecurity) မှာ တွေ့ရှိနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE POLICY` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER POLICY](/docs/postgresql/sql-alterpolicy), [DROP POLICY](/docs/postgresql/sql-droppolicy), [ALTER TABLE](/docs/postgresql/sql-altertable)
