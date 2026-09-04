---
title: "Caveats (သတိပြုရန် အချက်များ)"
description: "MVCC-safe မဟုတ်တဲ့ DDL command များ၊ hot standby ပေါ်မှ ပံ့ပိုးမှု အကန့်အသတ်များနဲ့ system catalog မြင်နိုင်မှုဆိုင်ရာ သတိပြုရန် အချက်များ"
order: 133
source: "https://www.postgresql.org/docs/current/mvcc-caveats.html"
status: translated
updated: 2026-09-03
---

## 13.6. Caveats (သတိပြုရန် အချက်များ)

DDL command အချို့ — လက်ရှိမှာတော့ [`TRUNCATE`](https://www.postgresql.org/docs/current/sql-truncate.html) နဲ့ [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ရဲ့ table ကို ပြန်လည်ရေးသား (table-rewriting) လုပ်တဲ့ ပုံစံများသာ — MVCC-safe မဟုတ်ပါဘူး။ ဆိုလိုတာက — truncation ဒါမှမဟုတ် rewrite က commit လုပ်ပြီးသွားတဲ့ နောက်မှာ — DDL command ကို commit မလုပ်ခင်ကတည်းက ရိုက်ထားတဲ့ snapshot တစ်ခုကို သုံးနေတဲ့ concurrent transaction တွေအတွက် — table က ဗလာ (empty) အနေနဲ့ ပေါ်လာနိုင်ပါတယ်။ ဒါက DDL command မစတင်ခင် မေးခွန်းထုတ်စရာ table ကို ဝင်ရောက် မလုပ်ဆောင်ခဲ့တဲ့ transaction တစ်ခုအတွက်သာ ပြဿနာ ဖြစ်ပါတယ် — အဲဒီလို ဝင်ရောက် လုပ်ဆောင်ခဲ့ဖူးတဲ့ transaction တစ်ခုခုကတော့ — အနည်းဆုံး `ACCESS SHARE` table lock တစ်ခုကို ကိုင်ထားမှာ ဖြစ်ပြီး — အဲဒီ lock က DDL command ကို အဲဒီ transaction ပြီးဆုံးတဲ့အထိ ပိတ်ဆို့ထားမှာပါ။ ဒါကြောင့် — ဒီ command တွေက target table ပေါ်က ဆက်တိုက် query တွေအတွက် table contents တွေမှာ ထင်ရှားတဲ့ မကိုက်ညီမှု (inconsistency) ကို ဖြစ်စေမှာ မဟုတ်ပေမယ့် — target table ရဲ့ contents နဲ့ database ထဲက တခြား table တွေရဲ့ contents ကြားမှာတော့ — မြင်သာတဲ့ မကိုက်ညီမှုတွေကို ဖြစ်စေနိုင်ပါတယ်။

Serializable transaction isolation level အတွက် ထောက်ပံ့မှုကို hot standby replication target (အရန် standby ဆာဗာ ပုံတူပွားခြင်း ပစ်မှတ်) တွေမှာ — [အပိုင်း 26.4](https://www.postgresql.org/docs/current/hot-standby.html) မှာ ဖော်ပြထားတဲ့အတိုင်း — အခုချိန်အထိ ထည့်သွင်းမပေးရသေးပါဘူး။ Hot standby mode မှာ လက်ရှိ ထောက်ပံ့ထားတဲ့ အပြင်းထန်ဆုံး isolation level ကတော့ Repeatable Read ပဲ ဖြစ်ပါတယ်။ Primary (ပင်မ ဆာဗာ) ပေါ်မှာ permanent database write တွေ အားလုံးကို Serializable transaction တွေအတွင်းမှာ လုပ်ဆောင်တာက — standby တွေ အားလုံး နောက်ဆုံးမှာ တစ်သမတ်တည်း ဖြစ်တဲ့ state တစ်ခုဆီ ရောက်ရှိမယ်လို့ အာမခံပေးနိုင်ပေမယ့် — standby ပေါ်မှာ run လုပ်တဲ့ Repeatable Read transaction တစ်ခုက — primary ပေါ်က transaction တွေရဲ့ serial execution (တစ်ခုပြီးတစ်ခု စဉ်ဆက် လုပ်ဆောင်မှု) တစ်ခုခုနဲ့မှ မကိုက်ညီတဲ့ — ယာယီ state တစ်ခုကို ရံဖန်ရံခါ မြင်ရနိုင်ပါတယ်။

System catalog တွေကို အတွင်းပိုင်းမှ ဝင်ရောက် လုပ်ဆောင်မှုတွေကတော့ — လက်ရှိ transaction ရဲ့ isolation level ကို သုံးပြီး မလုပ်ဆောင်ပါဘူး။ ဆိုလိုတာက — table လို အသစ်ဖန်တီးလိုက်တဲ့ database object တွေဟာ — သူတို့ထဲမှာ ပါဝင်တဲ့ row တွေကတော့ မမြင်ရပေမယ့် — concurrent Repeatable Read နဲ့ Serializable transaction တွေအတွက်တော့ မြင်နိုင်ပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — system catalog တွေကို အတိအကျ စစ်ဆေးတဲ့ query တွေကတော့ — မြင့်မားတဲ့ isolation level တွေမှာ — တစ်ပြိုင်နက် ဖန်တီးလိုက်တဲ့ database object တွေကို ကိုယ်စားပြုတဲ့ row တွေကို မမြင်ရပါဘူး။
