---
title: "Conflicts (ပဋိပက္ခများ)"
description: "Logical replication conflicts များအကြောင်း — conflict အမျိုးအစားများ (insert_exists, update_exists, update_missing, delete_missing, multiple_unique_conflicts စသည်)၊ conflict log format နှင့် ဖော်ပြချက်များ၊ permission ချို့ယွင်းမှုနှင့် row-level security ကြောင့် ဖြစ်သော ကွဲလွဲမှုများ၊ ALTER SUBSCRIPTION ... SKIP နှင့် pg_replication_origin_advance() ဖြင့် conflict ဖြေရှင်းခြင်း"
order: 233
source: "https://www.postgresql.org/docs/current/logical-replication-conflicts.html"
status: translated
updated: 2026-09-11
---

## 29.7. Conflicts (ပဋိပက္ခများ)

Logical replication က ပုံမှန် DML လုပ်ဆောင်မှုတွေနဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — subscriber node ပေါ်မှာ data ကို locally ပြောင်းလဲထားခဲ့ရင်တောင် ဝင်လာတဲ့ data က update လုပ်ပါတယ်။ ဝင်လာတဲ့ data က constraints တစ်ခုခုကို ချိုးဖောက်ရင် replication ရပ်တန့်သွားပါတယ်။ ဒါကို *conflict* (ပဋိပက္ခ) လို့ ခေါ်ပါတယ်။ `UPDATE` ဒါမှမဟုတ် `DELETE` လုပ်ဆောင်မှုတွေကို replicate လုပ်တဲ့အခါ — data မရှိခြင်းကိုလည်း *conflict* အဖြစ် သတ်မှတ်ပါတယ် — ဒါပေမယ့် error မဖြစ်စေဘဲ — အဲဒီလို လုပ်ဆောင်မှုတွေကို ရိုးရိုး ကျော်လွှားလိုက်ပါတယ်။

အောက်ပါ *conflict* အခြေအနေများမှာ — ထပ်ဆောင်း log ရေးသားမှု (additional logging) ကို စတင်ဆောင်ရွက်ပြီး — conflict statistics တွေကို စုဆောင်းပါတယ် ([`pg_stat_subscription_stats`](/docs/postgresql/monitoring-stats) view မှာ ပြသပါတယ်):

- **insert_exists** — NOT DEFERRABLE unique constraint တစ်ခုကို ချိုးဖောက်တဲ့ row တစ်ခု ထည့်သွင်းခြင်း။ သတိပြုရမှာက — ပဋိပက္ခ ဖြစ်နေတဲ့ key ရဲ့ origin နဲ့ commit timestamp အသေးစိတ်ကို log လုပ်ဖို့ — subscriber ပေါ်မှာ track_commit_timestamp ကို enable လုပ်ထားသင့်ပါတယ်။ ဒီအခြေအနေမှာ — conflict ကို ကိုယ်တိုင် ဖြေရှင်းပြီးသည်အထိ error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။
- **update_origin_differs** — အခြား origin တစ်ခုက ယခင် ပြုပြင်ထားခဲ့တဲ့ row တစ်ခုကို update လုပ်ခြင်း။ ဒီ conflict ကို subscriber ပေါ်မှာ track_commit_timestamp enable လုပ်ထားမှသာ ဖော်ထုတ်နိုင်တာကို သတိပြုပါ။ လက်ရှိမှာတော့ — local row ရဲ့ origin ဘယ်လိုပဲ ဖြစ်ပါစေ — update ကို အမြဲ apply လုပ်ပါတယ်။
- **update_exists** — row တစ်ခုရဲ့ update လုပ်လိုက်တဲ့ တန်ဖိုးက NOT DEFERRABLE unique constraint တစ်ခုကို ချိုးဖောက်ခြင်း။ သတိပြုရမှာက — ပဋိပက္ခ ဖြစ်နေတဲ့ key ရဲ့ origin နဲ့ commit timestamp အသေးစိတ်ကို log လုပ်ဖို့ — subscriber ပေါ်မှာ track_commit_timestamp ကို enable လုပ်ထားသင့်ပါတယ်။ ဒီအခြေအနေမှာ — conflict ကို ကိုယ်တိုင် ဖြေရှင်းပြီးသည်အထိ error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။ သတိပြုရမှာက — partitioned table တစ်ခုကို update လုပ်တဲ့အခါ — update လုပ်လိုက်တဲ့ row တန်ဖိုးက အခြား partition constraint တစ်ခုကို ကျေနပ်စေလို့ row က partition အသစ်တစ်ခုထဲ ထည့်သွင်းခံရရင် — row အသစ်က NOT DEFERRABLE unique constraint တစ်ခုကို ချိုးဖောက်မိရင် insert_exists conflict ပေါ်လာနိုင်ပါတယ်။
- **update_missing** — update လုပ်ရမယ့် row ကို ရှာမတွေ့ခြင်း။ ဒီအခြေအနေမှာ update ကို ရိုးရိုး ကျော်လွှားလိုက်ပါတယ်။
- **delete_origin_differs** — အခြား origin တစ်ခုက ယခင် ပြုပြင်ထားခဲ့တဲ့ row တစ်ခုကို delete လုပ်ခြင်း။ ဒီ conflict ကို subscriber ပေါ်မှာ track_commit_timestamp enable လုပ်ထားမှသာ ဖော်ထုတ်နိုင်တာကို သတိပြုပါ။ လက်ရှိမှာတော့ — local row ရဲ့ origin ဘယ်လိုပဲ ဖြစ်ပါစေ — delete ကို အမြဲ apply လုပ်ပါတယ်။
- **delete_missing** — delete လုပ်ရမယ့် row ကို ရှာမတွေ့ခြင်း။ ဒီအခြေအနေမှာ delete ကို ရိုးရိုး ကျော်လွှားလိုက်ပါတယ်။
- **multiple_unique_conflicts** — row တစ်ခု ထည့်သွင်းခြင်း ဒါမှမဟုတ် update လုပ်ခြင်းက NOT DEFERRABLE unique constraints အများအပြားကို ချိုးဖောက်ခြင်း။ သတိပြုရမှာက — ပဋိပက္ခ ဖြစ်နေတဲ့ keys ရဲ့ origin နဲ့ commit timestamp အသေးစိတ်ကို log လုပ်ဖို့ — subscriber ပေါ်မှာ track_commit_timestamp ကို enable လုပ်ထားတာ သေချာပါစေ။ ဒီအခြေအနေမှာ — conflict ကို ကိုယ်တိုင် ဖြေရှင်းပြီးသည်အထိ error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။

သတိပြုရမှာက — exclusion constraint ချိုးဖောက်မှုများလို အခြား conflict အခြေအနေများလည်း ရှိပါသေးတယ်။ လက်ရှိမှာတော့ အဲဒါတွေအတွက် ထပ်ဆောင်း အသေးစိတ်ကို log ထဲမှာ မပေးပါဘူး။

Logical replication conflicts တွေအတွက် log format က အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```sql
LOG:  conflict detected on relation "schemaname.tablename": conflict=conflict_type
DETAIL:  detailed_explanation.
{detail_values [; ... ]}.

where detail_values is one of:

    Key (column_name [, ...])=(column_value [, ...])
    existing local row (column_name [, ...])=(column_value [, ...])
    remote row (column_name [, ...])=(column_value [, ...])
    replica identity {(column_name [, ...])=(column_value [, ...]) | full (column_name [, ...])=(column_value [, ...])}
```

Log က အောက်ပါ အချက်အလက်တွေကို ပေးပါတယ်:

- **LOG** — schemaname.tablename က conflict မှာ ပါဝင်တဲ့ local relation ကို ဖော်ထုတ်ပါတယ်။

conflict_type ဆိုတာ — ဖြစ်ပေါ်ခဲ့တဲ့ conflict အမျိုးအစား ဖြစ်ပါတယ် (ဥပမာ — insert_exists, update_exists)။
- **DETAIL** — detailed_explanation မှာ — ရှိပါက — ရှိပြီးသား local row ကို ပြုပြင်ခဲ့တဲ့ transaction ရဲ့ origin၊ transaction ID နဲ့ commit timestamp တို့ ပါဝင်ပါတယ်။

Key အပိုင်းမှာ — insert_exists၊ update_exists ဒါမှမဟုတ် multiple_unique_conflicts conflicts တွေအတွက် — unique constraint တစ်ခုကို ချိုးဖောက်ခဲ့တဲ့ local row ရဲ့ key တန်ဖိုးတွေ ပါဝင်ပါတယ်။

existing local row အပိုင်းမှာ — update_origin_differs ဒါမှမဟုတ် delete_origin_differs conflicts တွေအတွက် — local row ရဲ့ origin က remote row နဲ့ မတူညီရင် — ဒါမှမဟုတ် insert_exists၊ update_exists ဒါမှမဟုတ် multiple_unique_conflicts conflicts တွေအတွက် — key တန်ဖိုးက remote row နဲ့ ကွဲလွဲနေရင် — local row ပါဝင်ပါတယ်။

remote row အပိုင်းမှာ — conflict ဖြစ်စေခဲ့တဲ့ remote insert ဒါမှမဟုတ် update လုပ်ဆောင်မှုကနေ ရလာတဲ့ row အသစ် ပါဝင်ပါတယ်။ သတိပြုရမှာက — update လုပ်ဆောင်မှုတစ်ခုအတွက် — တန်ဖိုးက မပြောင်းလဲဘဲ toasted ဖြစ်နေရင် — row အသစ်ရဲ့ column တန်ဖိုးက null ဖြစ်ပါလိမ့်မယ်။

replica identity အပိုင်းမှာ — update ဒါမှမဟုတ် delete လုပ်ရမယ့် ရှိပြီးသား local row ကို ရှာဖွေဖို့ သုံးခဲ့တဲ့ replica identity key တန်ဖိုးတွေ ပါဝင်ပါတယ်။ Local relation ကို REPLICA IDENTITY FULL နဲ့ မှတ်သားထားရင် — row တန်ဖိုး အပြည့်အစုံလည်း ပါဝင်နိုင်ပါတယ်။

column_name ဆိုတာ column နာမည် ဖြစ်ပါတယ်။ existing local row၊ remote row နဲ့ replica identity full အခြေအနေများအတွက် — user မှာ table ရဲ့ column အားလုံးကို access လုပ်ခွင့် (privilege) မရှိမှသာ column နာမည်များကို log လုပ်ပါတယ်။ Column နာမည်များ ပါဝင်ရင် — သက်ဆိုင်ရာ column တန်ဖိုးများနဲ့ တူညီတဲ့ အစီအစဉ်အတိုင်း ပေါ်လာပါတယ်။

column_value ဆိုတာ column တန်ဖိုး ဖြစ်ပါတယ်။ ကြီးမားတဲ့ column တန်ဖိုးများကို 64 bytes အထိ ဖြတ်တောက် (truncate) ပါတယ်။

သတိပြုရမှာက — multiple_unique_conflicts conflict ဖြစ်တဲ့အခါ — detailed_explanation နဲ့ detail_values လိုင်း အများအပြား ထုတ်လုပ်ပါလိမ့်မယ် — တစ်ခုချင်းစီက မတူညီတဲ့ unique constraints တွေနဲ့ ဆက်စပ်တဲ့ conflict အချက်အလက်ကို အသေးစိတ် ဖော်ပြပါတယ်။

Logical replication လုပ်ဆောင်မှုတွေကို subscription ကို ပိုင်ဆိုင်တဲ့ role ရဲ့ privileges တွေနဲ့ ဆောင်ရွက်ပါတယ်။ Target tables တွေပေါ်က permission ချို့ယွင်းမှုတွေက replication conflicts တွေ ဖြစ်စေပါလိမ့်မယ် — အလားတူပဲ — subscription owner ခံရတဲ့ target tables ပေါ်မှာ enable လုပ်ထားတဲ့ [row-level security](/docs/postgresql/ddl-rowsecurity) ကလည်း ဖြစ်စေပါတယ် — replicate လုပ်နေတဲ့ `INSERT`၊ `UPDATE`၊ `DELETE` ဒါမှမဟုတ် `TRUNCATE` ကို policy တစ်ခုက ပုံမှန်အားဖြင့် ငြင်းပယ်မလား မငြင်းပယ်ဘူးလားဆိုတာ မစဉ်းစားဘဲပါ။ Row-level security အပေါ်က ဒီကန့်သတ်ချက်ကို PostgreSQL ရဲ့ အနာဂတ် version တစ်ခုမှာ ဖယ်ရှားနိုင်ပါတယ်။

Error ထွက်စေတဲ့ conflict တစ်ခုက replication ကို ရပ်တန့်စေပါလိမ့်မယ်; အဲဒါကို user က ကိုယ်တိုင် ဖြေရှင်းရပါမယ်။ Conflict အကြောင်း အသေးစိတ်ကို subscriber ရဲ့ server log မှာ တွေ့နိုင်ပါတယ်။

ဖြေရှင်းနည်းက — ဝင်လာတဲ့ ပြောင်းလဲမှုနဲ့ မကွဲလွဲအောင် subscriber ပေါ်က data ဒါမှမဟုတ် permissions ကို ပြောင်းလဲခြင်းဖြင့် ဖြစ်စေ — ရှိပြီးသား data နဲ့ ကွဲလွဲနေတဲ့ transaction ကို ကျော်လွှားခြင်းဖြင့် ဖြစ်စေ လုပ်ဆောင်နိုင်ပါတယ်။ Conflict တစ်ခုက error ထွက်စေတဲ့အခါ — replication က ဆက်မလုပ်တော့ဘဲ — logical replication worker က subscriber ရဲ့ server log ဆီ အောက်ပါ မျိုးတူ message ကို ထုတ်လွှတ်ပါလိမ့်မယ်:

```sql
ERROR:  conflict detected on relation "public.test": conflict=insert_exists
DETAIL:  Key already exists in unique index "t_pkey", which was modified locally in transaction 740 at 2024-06-26 10:47:04.727375+08.
Key (c)=(1); existing local row (1, 'local'); remote row (1, 'remote').
CONTEXT:  processing remote data for replication origin "pg_16395" during "INSERT" for replication target relation "public.test" in transaction 725 finished at 0/14C0378
```

Constraint ကို ချိုးဖောက်တဲ့ ပြောင်းလဲမှု ပါဝင်တဲ့ transaction ရဲ့ LSN နဲ့ replication origin နာမည်ကို server log မှာ တွေ့နိုင်ပါတယ် (အထက်ပါ အခြေအနေမှာ LSN 0/14C0378 နဲ့ replication origin `pg_16395`)။ Conflict ဖြစ်စေခဲ့တဲ့ transaction ကို — finish LSN (ဆိုလိုတာက LSN 0/14C0378) နဲ့အတူ [`ALTER SUBSCRIPTION ... SKIP`](/docs/postgresql/sql-altersubscription) သုံးပြီး ကျော်လွှားနိုင်ပါတယ်။ Finish LSN ဆိုတာ publisher ပေါ်မှာ transaction ကို commit ဒါမှမဟုတ် prepare လုပ်တဲ့ LSN တစ်ခု ဖြစ်နိုင်ပါတယ်။ တနည်းအားဖြင့် — [`pg_replication_origin_advance()`](/docs/postgresql/functions-admin) function ကို ခေါ်ယူခြင်းဖြင့်လည်း transaction ကို ကျော်လွှားနိုင်ပါတယ်။ ဒီ function ကို မသုံးခင် — [`ALTER SUBSCRIPTION ... DISABLE`](/docs/postgresql/sql-altersubscription) နဲ့ ဖြစ်စေ — ဒါမှမဟုတ် subscription ကို [`disable_on_error`](/docs/postgresql/sql-createsubscription) option နဲ့ ဖြစ်စေ — subscription ကို ယာယီ disable လုပ်ထားဖို့ လိုပါတယ်။ ပြီးရင် — `pg_replication_origin_advance()` function ကို *node_name* (ဆိုလိုတာက `pg_16395`) နဲ့ finish LSN ရဲ့ နောက် LSN (ဆိုလိုတာက 0/14C0379) တို့နဲ့အတူ သုံးနိုင်ပါတယ်။

Origins တွေရဲ့ လက်ရှိ position ကို [`pg_replication_origin_status`](https://www.postgresql.org/docs/current/view-pg-replication-origin-status.html) system view မှာ မြင်နိုင်ပါတယ်။ သတိပြုရမှာက — transaction တစ်ခုလုံးကို ကျော်လွှားတာက constraint တစ်ခုမှ မချိုးဖောက်တဲ့ ပြောင်းလဲမှုတွေကိုပါ ကျော်လွှားတာ ပါဝင်ပါတယ်။ ဒါက subscriber ကို လွယ်ကူစွာ မကိုက်ညီ (inconsistent) ဖြစ်စေနိုင်ပါတယ်။ ကွဲလွဲနေတဲ့ rows တွေရဲ့ origin နဲ့ commit timestamp လို ထပ်ဆောင်း အသေးစိတ်တွေကို log ရဲ့ `DETAIL` လိုင်းမှာ မြင်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီအချက်အလက်တွေက subscriber ပေါ်မှာ [`track_commit_timestamp`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-TRACK-COMMIT-TIMESTAMP) enable လုပ်ထားမှသာ ရနိုင်တာကို သတိပြုပါ။ User တွေက ဒီအချက်အလက်ကို သုံးပြီး — local ပြောင်းလဲမှုကို ထိန်းထားမလား ဒါမှမဟုတ် remote ပြောင်းလဲမှုကို လက်ခံမလား ဆုံးဖြတ်နိုင်ပါတယ်။ ဥပမာ — အထက်ပါ log ထဲက `DETAIL` လိုင်းက — ရှိပြီးသား row ကို locally ပြုပြင်ထားတယ်ဆိုတာ ညွှန်ပြပါတယ်။ User တွေက remote-change-win ကို ကိုယ်တိုင် ဆောင်ရွက်နိုင်ပါတယ်။

[`streaming`](/docs/postgresql/sql-createsubscription) mode က `parallel` ဖြစ်တဲ့အခါ — မအောင်မြင်တဲ့ transactions တွေရဲ့ finish LSN ကို log မလုပ်မိနိုင်ပါဘူး။ အဲဒီအခါ — streaming mode ကို `on` ဒါမှမဟုတ် `off` သို့ ပြောင်းပြီး — အလားတူ conflicts တွေကို ထပ်ဖြစ်စေဖို့ လိုအပ်နိုင်ပါတယ် — ဒါမှ မအောင်မြင်တဲ့ transaction ရဲ့ finish LSN ကို server log ဆီ ရေးသားမိမှာ ဖြစ်ပါတယ်။ Finish LSN အသုံးပြုပုံအတွက် [`ALTER SUBSCRIPTION ... SKIP`](/docs/postgresql/sql-altersubscription) ကို ကြည့်ပါ။
