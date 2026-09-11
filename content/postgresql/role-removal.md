---
title: "Dropping Roles (role များကို ဖယ်ရှားခြင်း)"
description: "Role တစ်ခုကို ဖယ်ရှားရန် ၎င်း ပိုင်ဆိုင်ထားသော objects များကို ဦးစွာ လွှဲပြောင်းခြင်း သို့မဟုတ် ဖျက်ခြင်း (REASSIGN OWNED / DROP OWNED) ပြုလုပ်ပြီးမှသာ DROP ROLE လုပ်ရပုံ — database တစ်ခုစီတွင် command များ run ရန် လိုအပ်ကြောင်း ရှင်းလင်းချက်"
order: 193
source: "https://www.postgresql.org/docs/current/role-removal.html"
status: translated
updated: 2026-09-06
---

## 21.4. Dropping Roles (role များကို ဖယ်ရှားခြင်း)

Role တွေက database objects တွေကို ပိုင်ဆိုင်နိုင်သလို — တခြား objects တွေဆီ ဝင်ရောက်ဖို့ privileges တွေကိုလည်း ကိုင်ထားနိုင်တာမို့ — role တစ်ခုကို ဖယ်ရှားတာက [`DROP ROLE`](/docs/postgresql/sql-droprole) ဆိုတဲ့ command လေး တစ်ခု အမြန် run လိုက်ရုံနဲ့ ပြီးသွားတဲ့ ကိစ္စ မဟုတ်ပါဘူး။ Role က ပိုင်ဆိုင်ထားတဲ့ objects တွေကို — ဦးစွာ drop လုပ်ရမယ် ဒါမှမဟုတ် တခြား owners တွေဆီ လွှဲပြောင်း (reassign) ပေးရပါမယ်; ပြီးတော့ role ဆီ ပေးအပ်ထားတဲ့ permissions တွေကိုလည်း revoke (ပြန်ရုတ်သိမ်း) လုပ်ရပါမယ်။

Objects တွေရဲ့ ပိုင်ဆိုင်မှုကို `ALTER` commands တွေ သုံးပြီး — တစ်ခုချင်းစီ အလှည့်ကျ လွှဲပြောင်းလို့ ရပါတယ် — ဥပမာ:

```sql
ALTER TABLE bobs_table OWNER TO alice;
```

တနည်းအားဖြင့် — ဖျက်တော့မယ့် role (role-to-be-dropped) က ပိုင်ဆိုင်ထားတဲ့ objects တွေ အားလုံးရဲ့ ပိုင်ဆိုင်မှုကို — တခြား role တစ်ခုတည်းဆီ လွှဲပြောင်းပေးဖို့ [`REASSIGN OWNED`](/docs/postgresql/sql-reassign-owned) command ကိုလည်း သုံးနိုင်ပါတယ်။ `REASSIGN OWNED` က တခြား database တွေထဲက objects တွေဆီ ဝင်ရောက်လို့ မရတာမို့ — role က ပိုင်ဆိုင်တဲ့ objects တွေ ပါဝင်နေတဲ့ database တစ်ခုချင်းစီမှာ ဒီ command ကို run ဖို့ လိုအပ်ပါတယ်။ (ဒီလို run တဲ့ `REASSIGN OWNED` တွေထဲက ပထမဆုံး တစ်ခုက — ဖျက်တော့မယ့် role က ပိုင်ဆိုင်ထားတဲ့ — database ဒါမှမဟုတ် tablespace လို — database အများအပြားကြားမှာ မျှဝေထားတဲ့ (shared-across-databases) objects တွေရဲ့ ပိုင်ဆိုင်မှုကိုပါ ပြောင်းလဲပေးမှာ ဖြစ်ကြောင်း သတိပြုပါ။)

တန်ဖိုးရှိတဲ့ objects တွေကို owners အသစ်တွေဆီ လွှဲပြောင်းပြီးတာနဲ့ — ဖျက်တော့မယ့် role က ပိုင်ဆိုင်ထားတဲ့ ကျန်ရှိနေသေးတဲ့ objects တွေကို [`DROP OWNED`](/docs/postgresql/sql-drop-owned) command နဲ့ drop လုပ်နိုင်ပါတယ်။ ဒီ command ကလည်း တခြား database တွေထဲက objects တွေဆီ ဝင်ရောက်လို့ မရတာမို့ — role က ပိုင်ဆိုင်တဲ့ objects တွေ ပါဝင်နေတဲ့ database တစ်ခုချင်းစီမှာ run ဖို့ လိုအပ်ပါတယ်။ ဒါ့အပြင် — `DROP OWNED` က database တစ်ခုလုံး ဒါမှမဟုတ် tablespace တစ်ခုလုံးကိုတော့ drop လုပ်ပေးမှာ မဟုတ်ပါဘူး — ဒါကြောင့် role က — owners အသစ်တွေဆီ မလွှဲပြောင်းရသေးတဲ့ database ဒါမှမဟုတ် tablespace တွေကို ပိုင်ဆိုင်ထားရင် — အဲဒါတွေကို ကိုယ်တိုင် ဖျက်ဖို့ လိုအပ်ပါတယ်။

`DROP OWNED` က — target role ဆီ ပေးအပ်ထားပြီး — အဲဒီ role က မပိုင်ဆိုင်တဲ့ objects တွေအတွက် ဖြစ်တဲ့ privileges တွေကို ဖယ်ရှားပေးတာကိုလည်း ဆောင်ရွက်ပေးပါတယ်။ `REASSIGN OWNED` က အဲဒီလို objects တွေကို ထိတွေ့မှု မရှိတာမို့ — ဖျက်တော့မယ့် role တစ်ခုရဲ့ dependencies (မှီခိုမှုများ) တွေကို အပြည့်အဝ ဖယ်ရှားဖို့ဆိုရင် — `REASSIGN OWNED` နဲ့ `DROP OWNED` နှစ်ခုလုံးကို (ဒီအစီအစဉ် အတိုင်း!) run ဖို့ ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။

ဒါဆိုရင် အကျဉ်းချုပ်ပြောရရင် — objects တွေကို ပိုင်ဆိုင်ဖို့ သုံးခဲ့တဲ့ role တစ်ခုကို ဖယ်ရှားဖို့ အသုံးအများဆုံး ယေဘုယျ နည်းလမ်းကတော့:

```sql
REASSIGN OWNED BY doomed_role TO successor_role;
DROP OWNED BY doomed_role;
-- repeat the above commands in each database of the cluster
DROP ROLE doomed_role;
```

ပိုင်ဆိုင်ထားတဲ့ objects တွေ အားလုံးကို — successor owner တစ်ခုတည်းဆီ လွှဲပြောင်းမှာ မဟုတ်ဘူးဆိုရင် — ခြွင်းချက် (exception) တွေကို ကိုယ်တိုင် ကိုင်တွယ်ပြီးမှ — အပေါ်က အဆင့်တွေကို လုပ်ဆောင်ပြီး အကြွင်းအကျန်တွေကို ရှင်းလင်းတာ အကောင်းဆုံး ဖြစ်ပါတယ်။

Dependent objects (မှီခိုနေတဲ့ objects) တွေ ကျန်ရှိနေသေးချိန်မှာ `DROP ROLE` ကို ကြိုးစား လုပ်ကြည့်ရင် — ဘယ် objects တွေကို reassign လုပ်ဖို့ ဒါမှမဟုတ် drop လုပ်ဖို့ လိုသေးလဲဆိုတာ ဖော်ပြတဲ့ messages တွေ ထုတ်ပေးပါလိမ့်မယ်။
