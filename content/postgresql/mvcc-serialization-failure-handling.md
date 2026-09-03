---
title: "Serialization Failure Handling (serialization မအောင်မြင်မှု ကိုင်တွယ်ခြင်း)"
description: "Serialization error (SQLSTATE 40001) အပြင် deadlock, unique-key နဲ့ exclusion constraint မအောင်မြင်မှုများကို retry လုပ်ခြင်းနဲ့ ပတ်သက်၍ သိသင့်သည်များ"
order: 90
source: "https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html"
status: translated
updated: 2026-09-03
---

## 13.5. Serialization Failure Handling (serialization မအောင်မြင်မှု ကိုင်တွယ်ခြင်း)

Repeatable Read နဲ့ Serializable isolation level နှစ်မျိုးစလုံးက — serialization anomaly (serialization ဆိုင်ရာ မူမမှန်မှု) တွေ မဖြစ်ပေါ်စေဖို့ ရည်ရွယ်ထားတဲ့ error တွေကို ထုတ်ပေးနိုင်ပါတယ်။ အရင်က ဖော်ပြခဲ့သလိုပဲ — ဒီ isolation level တွေကို သုံးတဲ့ application တွေက serialization error တွေကြောင့် မအောင်မြင်တဲ့ transaction တွေကို retry (ပြန်လည်ကြိုးစား) လုပ်ဖို့ အသင့်ရှိနေရပါမယ်။ ဒီလို error တစ်ခုရဲ့ message text က အခြေအနေ တစ်ခုချင်းစီရဲ့ တိကျတဲ့ သဘောသဘာဝပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပေမယ့် — SQLSTATE code `40001` (`serialization_failure`) ကတော့ အမြဲတမ်း ပါဝင်ပါတယ်။

Deadlock (အပြန်အလှန် ပိတ်ဆို့မှု) ကြောင့် မအောင်မြင်တဲ့ transaction တွေကိုလည်း retry လုပ်ဖို့ အကြံပြုလေ့ ရှိပါတယ်။ ဒါတွေမှာ SQLSTATE code `40P01` (`deadlock_detected`) ရှိပါတယ်။

အချို့ အခြေအနေတွေမှာ — SQLSTATE code `23505` (`unique_violation`) ရှိတဲ့ unique-key မအောင်မြင်မှုတွေနဲ့ — SQLSTATE code `23P01` (`exclusion_violation`) ရှိတဲ့ exclusion constraint မအောင်မြင်မှုတွေကိုလည်း retry လုပ်တာ သင့်လျော်ပါတယ်။ ဥပမာ — application တစ်ခုက လက်ရှိ သိမ်းထားတဲ့ key တွေကို စစ်ဆေးကြည့်ပြီးမှ primary key column အတွက် တန်ဖိုးအသစ် တစ်ခုကို ရွေးချယ်တယ်ဆိုရင် — တခြား application instance တစ်ခုက တူညီတဲ့ key အသစ်ကို တစ်ပြိုင်နက် ရွေးချယ်မိလို့ unique-key မအောင်မြင်မှု ဖြစ်လာနိုင်ပါတယ်။ ဒါက လက်တွေ့မှာ serialization failure တစ်ခုပဲ ဖြစ်ပေမယ့် — insert လုပ်လိုက်တဲ့ တန်ဖိုးနဲ့ အရင်က လုပ်ခဲ့တဲ့ read တွေကြားက ဆက်စပ်မှုကို server က “မြင်နိုင်” ခြင်း မရှိတဲ့အတွက် — ဒါကို serialization failure အဖြစ် server က ထောက်လှမ်းလို့ မရပါဘူး။ နောက်ပြီး — နောက်ခံ အကြောင်းရင်းက serialization ပြဿနာဖြစ်ကြောင်း ဆုံးဖြတ်ဖို့ လုံလောက်တဲ့ အချက်အလက် ရှိနေတဲ့ အချိန်မှာတောင် — server က unique-key ဒါမှမဟုတ် exclusion constraint error ကို ထုတ်ပေးတဲ့ corner case (အစွန်းရောက် ကိစ္စ) တချို့လည်း ရှိပါတယ်။ `serialization_failure` error တွေကိုတော့ ခြွင်းချက် မရှိဘဲ retry လုပ်တာ အကြံပြုလောက်ပေမယ့် — ကျန်တဲ့ error code တွေကတော့ — ယာယီ မအောင်မြင်မှု (transient failure) တွေ မဟုတ်ဘဲ — အမြဲတည်ရှိနေတဲ့ error အခြေအနေ (persistent error condition) တွေလည်း ဖြစ်နိုင်တာကြောင့် — retry လုပ်တဲ့အခါ ပိုပြီး ဂရုစိုက်ဖို့ လိုအပ်ပါတယ်။

Transaction တစ်ခုလုံးကို retry လုပ်ဖို့ အရေးကြီးပါတယ် — ဘယ် SQL ကို ထုတ်ပြန်ရမလဲ ဒါမှမဟုတ် ဘယ်တန်ဖိုးတွေကို သုံးရမလဲဆိုတာ ဆုံးဖြတ်တဲ့ logic အားလုံး အပါအဝင်ပါ။ ဒါကြောင့် — PostgreSQL က automatic retry ယန္တရားကို မပေးပါဘူး — ဘာကြောင့်လဲဆိုတော့ — မှန်ကန်မှု (correctness) ကို အာမခံနိုင်တဲ့ နည်းနဲ့ ဒါမျိုးကို လုပ်ဆောင်လို့ မရနိုင်လို့ပဲ ဖြစ်ပါတယ်။

Transaction retry က — retry လုပ်လိုက်တဲ့ transaction ပြီးမြောက်မယ်လို့ အာမခံတာ မဟုတ်ပါဘူး — retry အကြိမ်ကြိမ် လိုအပ်နိုင်ပါတယ်။ Contention (ပြိုင်ဆိုင်မှု) အလွန် မြင့်မားတဲ့ အခြေအနေတွေမှာ — transaction တစ်ခု ပြီးမြောက်ဖို့အတွက် ကြိုးစားမှု အများအပြား လိုအပ်နိုင်ပါတယ်။ ထိပ်တိုက်တွေ့နေတဲ့ prepared transaction (ကြိုတင်ပြင်ဆင်ထားသော transaction) တစ်ခု ပါဝင်နေတဲ့ အခြေအနေတွေမှာဆိုရင် — အဲဒီ prepared transaction က commit လုပ်တဲ့အထိ ဒါမှမဟုတ် rollback လုပ်တဲ့အထိ — ရှေ့ဆက် လုပ်ဆောင်နိုင်ခြင်း မရှိနိုင်တာတွေ ရှိနိုင်ပါတယ်။
