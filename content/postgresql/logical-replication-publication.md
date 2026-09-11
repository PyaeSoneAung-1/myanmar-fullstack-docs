---
title: "Publication (ထုတ်ဝေမှု)"
description: "Logical replication publication အကြောင်း — publication နှင့် publisher သတ်မှတ်ခြင်း၊ ထည့်သွင်းနိုင်သည့် object များ၊ INSERT/UPDATE/DELETE/TRUNCATE operation ရွေးချယ်ခြင်း၊ subscriber များ၊ CREATE/ALTER PUBLICATION အသုံးပြုမှုနှင့် replica identity သတ်မှတ်ခြင်း"
order: 209
source: "https://www.postgresql.org/docs/current/logical-replication-publication.html"
status: translated
updated: 2026-09-11
---

## 29.1. Publication (ထုတ်ဝေမှု)

- **29.1.1. Replica Identity**

*publication* (ထုတ်ဝေမှု) တစ်ခုကို physical replication primary (ရုပ်ပိုင်းဆိုင်ရာ replication ပင်မ) တစ်ခုခုပေါ်မှာ သတ်မှတ်နိုင်ပါတယ်။ Publication တစ်ခုကို သတ်မှတ်ထားတဲ့ node ကို *publisher* (ထုတ်ဝေသူ) လို့ ခေါ်ပါတယ်။ Publication တစ်ခုဆိုတာ table တစ်ခု ဒါမှမဟုတ် table အုပ်စုတစ်ခုကနေ ထုတ်ပေးတဲ့ ပြောင်းလဲမှုတွေရဲ့ အစုအဝေးတစ်ခု ဖြစ်ပြီး — change set ဒါမှမဟုတ် replication set လို့လည်း ခေါ်နိုင်ပါတယ်။ Publication တစ်ခုချင်းစီက database တစ်ခုတည်းမှာသာ တည်ရှိပါတယ်။

Publication တွေက schema တွေနဲ့ မတူဘဲ — table ကို ဘယ်လို access လုပ်လဲဆိုတာကို မသက်ရောက်ပါဘူး။ လိုအပ်ရင် table တစ်ခုချင်းစီကို publication အများအပြားဆီ ထည့်နိုင်ပါတယ်။ Publication တွေမှာ လက်ရှိအားဖြင့် table တွေနဲ့ schema တစ်ခုထဲက table အားလုံးကိုသာ ပါဝင်စေနိုင်ပါတယ်။ `ALL TABLES` အတွက် publication တစ်ခု ဖန်တီးတဲ့အခါမှလွဲရင် — object တွေကို တိုက်ရိုက် (explicitly) ထည့်သွင်းရပါတယ်။

Publication တွေက — trigger တွေကို ဖြစ်ရပ် အမျိုးအစား သီးသန့်တွေက ဖြစ်ပေါ်စေသလိုပဲ — သူတို့ ထုတ်ပေးတဲ့ ပြောင်းလဲမှုတွေကို `INSERT`, `UPDATE`, `DELETE` နဲ့ `TRUNCATE` တို့ရဲ့ ပေါင်းစပ်မှု မည်သည့်အရာနဲ့မဆို ကန့်သတ် ရွေးချယ်နိုင်ပါတယ်။ Default အားဖြင့်တော့ operation အမျိုးအစား အားလုံးကို replicate လုပ်ပါတယ်။ ဒီ publication သတ်မှတ်ချက်တွေက DML operation တွေအတွက်သာ သက်ရောက်ပြီး — အစပိုင်း data synchronization copy ကို မသက်ရောက်ပါဘူး။ (Row filter တွေက `TRUNCATE` အတွက် အကျိုးမသက်ရောက်ပါဘူး။ [အပိုင်း 29.4](/docs/postgresql/logical-replication-row-filter) ကို ကြည့်ပါ။)

Publication တစ်ခုချင်းစီမှာ subscriber (စာရင်းသွင်းသူ) အများအပြား ရှိနိုင်ပါတယ်။

Publication တစ်ခုကို [`CREATE PUBLICATION`](/docs/postgresql/sql-createpublication) command နဲ့ ဖန်တီးပြီး — နောက်ပိုင်းမှာ သက်ဆိုင်ရာ command တွေနဲ့ ပြင်ဆင် (alter) ဒါမှမဟုတ် ဖျက် (drop) နိုင်ပါတယ်။

Table တစ်ခုချင်းစီကို [`ALTER PUBLICATION`](/docs/postgresql/sql-alterpublication) နဲ့ dynamically ထည့်နိုင်၊ ဖယ်ရှားနိုင်ပါတယ်။ `ADD TABLE` နဲ့ `DROP TABLE` operation နှစ်ခုလုံးက transactional ဖြစ်တာကြောင့် — transaction commit ဖြစ်သွားတာနဲ့ — table က မှန်ကန်တဲ့ snapshot မှာ replication စတင် ဒါမှမဟုတ် ရပ်တန့်ပါလိမ့်မယ်။

### 29.1.1. Replica Identity (replica identity / မိတ္တူ အမှတ်လက္ခဏာ)

ထုတ်ဝေထားတဲ့ table တစ်ခုမှာ `UPDATE` နဲ့ `DELETE` operation တွေကို replicate လုပ်နိုင်ဖို့အတွက် — subscriber ဘက်မှာ update ဒါမှမဟုတ် delete လုပ်ရမယ့် သင့်လျော်တဲ့ row တွေကို ဖော်ထုတ်နိုင်စေရန် — *replica identity* သတ်မှတ်ထားဖို့ လိုပါတယ်။

Default အားဖြင့် — primary key ရှိရင် ဒါက primary key ဖြစ်ပါတယ်။ အခြား unique index တစ်ခုကိုလည်း (အပိုဆောင်း လိုအပ်ချက် အချို့နဲ့အတူ) replica identity အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ Table မှာ သင့်လျော်တဲ့ key မရှိရင်တော့ — replica identity ကို `FULL` သတ်မှတ်နိုင်ပြီး — ဆိုလိုတာက row တစ်ခုလုံးက key ဖြစ်သွားတာပါ။ Replica identity `FULL` သတ်မှတ်ထားတဲ့အခါ — row တွေကို ရှာဖွေဖို့ subscriber ဘက်မှာ index တွေကို သုံးနိုင်ပါတယ်။ ဖြစ်နိုင်တဲ့ index တွေက btree ဒါမှမဟုတ် hash ဖြစ်ရမည်၊ partial မဖြစ်ရဘူး၊ ပြီးရင် index ရဲ့ ဘယ်ဘက်အကျဆုံး field က ထုတ်ဝေထားတဲ့ table column ကို ရည်ညွှန်းတဲ့ column (expression မဟုတ်) ဖြစ်ရပါမယ်။ non-unique index ရဲ့ ဂုဏ်သတ္တိတွေအပေါ် ဒီ ကန့်သတ်ချက်တွေက primary key တွေအတွက် ချမှတ်ထားတဲ့ ကန့်သတ်ချက် အချို့နဲ့ ကိုက်ညီပါတယ်။ ဒီလို သင့်လျော်တဲ့ index မျိုး မရှိရင် — subscriber ဘက်က ရှာဖွေမှုက အလွန် ညံ့ဖျင်းနိုင်တာကြောင့် — replica identity `FULL` ကို တခြား ဖြေရှင်းနည်း မရှိမှသာ fallback အနေနဲ့ သုံးသင့်ပါတယ်။

`FULL` မဟုတ်တဲ့ replica identity တစ်ခုကို publisher ဘက်မှာ သတ်မှတ်ထားရင် — column အရေအတွက် တူညီတဲ့ ဒါမှမဟုတ် ပိုနည်းတဲ့ replica identity တစ်ခုကိုလည်း subscriber ဘက်မှာ သတ်မှတ်ထားရပါမယ်။

replica identity ကို `NOTHING` လို့ သတ်မှတ်ထားတဲ့၊ primary key မရှိဘဲ `DEFAULT` ဖြစ်နေတဲ့၊ ဒါမှမဟုတ် index ဖျက်ပြီးသား `USING INDEX` ဖြစ်နေတဲ့ table တွေက — ဒီ action တွေကို replicate လုပ်တဲ့ publication တစ်ခုမှာ ပါဝင်တဲ့အခါ — `UPDATE` ဒါမှမဟုတ် `DELETE` operation တွေကို support မလုပ်နိုင်ပါဘူး။ ဒီလို operation တွေ လုပ်ကြည့်ရင် publisher မှာ error ဖြစ်ပါလိမ့်မယ်။

`INSERT` operation တွေကတော့ replica identity ဘယ်လိုပဲ ဖြစ်ပါစေ — ဆက်လက် လုပ်ဆောင်နိုင်ပါတယ်။

replica identity ဘယ်လိုသတ်မှတ်ရမလဲ ဆိုတဲ့ အသေးစိတ်အတွက် [`ALTER TABLE...REPLICA IDENTITY`](/docs/postgresql/sql-altertable) ကို ကြည့်ပါ။
