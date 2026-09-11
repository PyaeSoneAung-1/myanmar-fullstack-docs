---
title: "Logical Replication Failover (logical replication failover ကူးပြောင်းခြင်း)"
description: "Logical replication failover အကြောင်း — publisher node ကျဆင်းချိန် subscriber များ ဆက်လက် replicate လုပ်နိုင်ရန် physical standby လိုအပ်မှု၊ failover = true ဖြင့် logical slot များကို standby ဆီ synchronize လုပ်ခြင်း၊ failover အသင့်ဖြစ်မှု စစ်ဆေးရန် အဆင့်များ၊ PostgreSQL မဟုတ်သော subscriber များအတွက် နည်းလမ်းနှင့် synchronized_standby_slots configuration အကြောင်း ရှင်းလင်းချက်"
order: 229
source: "https://www.postgresql.org/docs/current/logical-replication-failover.html"
status: translated
updated: 2026-09-11
---

## 29.3. Logical Replication Failover (logical replication failover ကူးပြောင်းခြင်း)

Publisher node က ကျဆင်းသွားတဲ့အခါမှာတောင် subscriber node များက publisher node ဆီကနေ data ကို ဆက်လက် replicate လုပ်နိုင်ဖို့ — publisher node နှင့် သက်ဆိုင်တဲ့ physical standby (ရုပ်ပိုင်းဆိုင်ရာ အရန် server) တစ်ခု ရှိရပါမယ်။ Subscription များ ဖန်တီးတဲ့အခါ `failover = true` သတ်မှတ်ပေးခြင်းအားဖြင့် — subscription များနှင့် သက်ဆိုင်တဲ့ primary server ပေါ်က logical slot များကို standby server ဆီ synchronize လုပ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 47.2.3](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS-SYNCHRONIZATION) ကို ကြည့်ပါ။ [`failover`](/docs/postgresql/sql-createsubscription) parameter ကို ဖွင့်ပေးခြင်းက — standby ကို promote လုပ်ပြီးနောက် အဲဒီ subscription များ ချောမွေ့စွာ ကူးပြောင်းနိုင်မှုကို အာမခံပါတယ်။ သူတို့က primary server အသစ်ပေါ်က publication များကို ဆက်လက် subscribe လုပ်နိုင်ပါတယ်။

Slot synchronization logic က asynchronously (တစ်ပြိုင်နက်မဟုတ်ဘဲ) copy လုပ်တာဖြစ်တဲ့အတွက် — failover မဖြစ်မီ replication slot များ standby server ဆီ sync ဖြစ်ပြီးကြောင်း အတည်ပြုဖို့ လိုအပ်ပါတယ်။ Failover တစ်ခု အောင်မြင်ဖို့အတွက် standby server က subscriber ထက် ရှေ့ရောက်နေရပါမယ်။ ဒါကို [`synchronized_standby_slots`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-SYNCHRONIZED-STANDBY-SLOTS) ကို configure လုပ်ခြင်းအားဖြင့် ရရှိနိုင်ပါတယ်။

Subscriber တစ်ခုအတွက် standby server က failover အတွက် တကယ် အသင့်ဖြစ်နေကြောင်း အတည်ပြုဖို့ — အဲဒီ subscriber လိုအပ်တဲ့ logical replication slot အားလုံး standby server ဆီ synchronize ဖြစ်ပြီးကြောင်း စစ်ဆေးရန် အောက်ပါ အဆင့်များကို လိုက်နာပါ:

1. Subscriber node ပေါ်မှာ — promote လုပ်ဖို့ စီစဉ်ထားတဲ့ standby ဆီ sync လုပ်သင့်တဲ့ replication slot များ ဖော်ထုတ်ဖို့ အောက်ပါ SQL ကို သုံးပါ။ ဒီ query က failover ဖွင့်ထားတဲ့ subscription များနှင့် သက်ဆိုင်တဲ့ replication slot များကို ပြန်ပေးပါလိမ့်မယ်။
  
  /* sub # */ SELECT
                 array_agg(quote_literal(s.subslotname)) AS slots
             FROM  pg_subscription s
             WHERE s.subfailover AND
                   s.subslotname IS NOT NULL;
   slots
  -------
   {'sub1','sub2','sub3'}
  (1 row)
2. Subscriber node ပေါ်မှာ — promote လုပ်ဖို့ စီစဉ်ထားတဲ့ standby ဆီ sync လုပ်သင့်တဲ့ table synchronization slot များ ဖော်ထုတ်ဖို့ အောက်ပါ SQL ကို သုံးပါ။ ဒီ query ကို failover ဖွင့်ထားတဲ့ subscription များ ပါဝင်တဲ့ database တစ်ခုချင်းစီပေါ်မှာ run ရပါမယ်။ table copy ပြီးဆုံးမှသာ table sync slot ကို standby server ဆီ sync လုပ်သင့်တယ်ဆိုတာ သတိပြုပါ (အပိုင်း 52.55 ကို ကြည့်ပါ)။ အခြား အခြေအနေများမှာတော့ table sync slot များ sync ဖြစ်ကြောင်း အာမခံဖို့ မလိုအပ်ပါဘူး — အကြောင်းကတော့ အဲဒီအခြေအနေများမှာ slot များကို ဖျက်ပစ်တာ ဒါမှမဟုတ် primary server အသစ်ပေါ်မှာ ပြန်လည် ဖန်တီးတာ ဖြစ်လို့ပါ။
  
  /* sub # */ SELECT
                 array_agg(quote_literal(slot_name)) AS slots
             FROM
             (
                 SELECT CONCAT('pg_', srsubid, '_sync_', srrelid, '_', ctl.system_identifier) AS slot_name
                 FROM pg_control_system() ctl, pg_subscription_rel r, pg_subscription s
                 WHERE r.srsubstate = 'f' AND s.oid = r.srsubid AND s.subfailover
             );
   slots
  -------
   {'pg_16394_sync_16385_7394666715149055164'}
  (1 row)
3. အထက်မှာ ဖော်ထုတ်ခဲ့တဲ့ logical replication slot များ standby server ပေါ်မှာ ရှိပြီး failover အတွက် အသင့်ဖြစ်နေကြောင်း စစ်ဆေးပါ။
  
  /* standby # */ SELECT slot_name, (synced AND NOT temporary AND invalidation_reason IS NULL) AS failover_ready
                 FROM pg_replication_slots
                 WHERE slot_name IN
                     ('sub1','sub2','sub3', 'pg_16394_sync_16385_7394666715149055164');
    slot_name                                 | failover_ready
  --------------------------------------------+----------------
    sub1                                      | t
    sub2                                      | t
    sub3                                      | t
    pg_16394_sync_16385_7394666715149055164   | t
  (4 rows)

Slot အားလုံး standby server ပေါ်မှာ ရှိပြီး အထက်ပါ SQL query ရဲ့ ရလဒ် (`failover_ready`) က true ဖြစ်ရင် — ရှိပြီးသား subscription များက primary server အသစ်ပေါ်က publication များကို ဆက်လက် subscribe လုပ်နိုင်ပါတယ်။

အထက်ပါ လုပ်ငန်းစဉ်ထဲက ပထမ အဆင့် နှစ်ဆင့်က PostgreSQL subscriber အတွက် ရည်ရွယ်ထားပါတယ်။ Failover ပြီးနောက် သတ်မှတ်ထားတဲ့ standby က ဝန်ဆောင်ပေးမယ့် subscriber node တစ်ခုချင်းစီပေါ်မှာ — replication slot များရဲ့ စာရင်း အပြည့်အစုံ ရရှိဖို့ — ဒီအဆင့်များကို run ဖို့ အကြံပြုပါတယ်။ ပြီးရင် ဒီစာရင်းကို အဆင့် 3 မှာ စစ်ဆေးပြီး failover အသင့်ဖြစ်မှုကို အတည်ပြုနိုင်ပါတယ်။ တစ်ဖက်မှာ — PostgreSQL မဟုတ်တဲ့ subscriber များကတော့ သူတို့ရဲ့ subscription များ သုံးတဲ့ replication slot များကို ဖော်ထုတ်ဖို့ သူတို့ကိုယ်ပိုင် နည်းလမ်းများကို သုံးနိုင်ပါတယ်။

အချို့ အခြေအနေများမှာ — ဥပမာ စီစဉ်ထားတဲ့ failover တစ်ခုအတွင်း — PostgreSQL ဖြစ်စေ၊ PostgreSQL မဟုတ်ဖြစ်စေ subscriber အားလုံး — သတ်မှတ်ထားတဲ့ standby server တစ်ခုဆီ failover လုပ်ပြီးနောက် replication ကို ဆက်လက် လုပ်နိုင်မလား ဆိုတာ အတည်ပြုဖို့ လိုအပ်ပါတယ်။ အဲဒီလို အခြေအနေများမှာ — အထက်ပါ ပထမ အဆင့် နှစ်ဆင့်ကို မလုပ်တော့ဘဲ — promote လုပ်ဖို့ ရည်ရွယ်ထားတဲ့ standby ဆီ sync လုပ်ဖို့ လိုအပ်တဲ့ primary ပေါ်က replication slot များ ဖော်ထုတ်ရန် အောက်ပါ SQL ကို သုံးပါ။ ဒီ query က failover ဖွင့်ထားတဲ့ subscription အားလုံးနှင့် သက်ဆိုင်တဲ့ replication slot များကို ပြန်ပေးပါတယ်။

```sql
/* primary # */ SELECT array_agg(quote_literal(r.slot_name)) AS slots
               FROM pg_replication_slots r
               WHERE r.failover AND NOT r.temporary;
 slots
-------
 {'sub1','sub2','sub3', 'pg_16394_sync_16385_7394666715149055164'}
(1 row)
```
