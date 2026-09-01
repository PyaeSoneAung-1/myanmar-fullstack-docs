---
title: "Transactions (အရောင်းအဝယ်)"
description: "Transaction ဆိုတာ ဘာလဲ — BEGIN, COMMIT, ROLLBACK, SAVEPOINT — data တွေ ယုံကြည်စိတ်ချရအောင် ဘယ်လို လုပ်ပေးသလဲ"
order: 5
source: "https://www.postgresql.org/docs/current/tutorial-transactions.html"
status: translated
updated: 2026-09-01
---

## Transaction ဆိုတာ ဘာလဲ

**Transaction** က database system အားလုံးရဲ့ အခြေခံအကျဆုံး သဘောတရားပါ။ Transaction ရဲ့ အဓိက အချက်က — အဆင့်တွေ အများကြီးကို **all-or-nothing** (အကုန်ဖြစ်ရမယ် ဒါမှမဟုတ် တစ်ခုမှ မဖြစ်ရဘူး) ဆိုတဲ့ လုပ်ဆောင်ချက် တစ်ခုတည်းအဖြစ် စုစည်းပေးတာပါ။ အဆင့်တွေကြားက ကြားအခြေအနေတွေကို — တစ်ပြိုင်နက် run နေတဲ့ တခြား transaction တွေ မမြင်ရပါဘူး။ ပြီးတော့ transaction ကို ပြီးအောင် မလုပ်နိုင်တဲ့ အမှားတစ်ခုခု ဖြစ်ခဲ့ရင် — အဲဒီအထိ လုပ်ခဲ့တဲ့ အဆင့်တွေ တစ်ခုမှ database အပေါ် သက်ရောက်မှု မရှိပါဘူး။

ဥပမာ — bank database တစ်ခုမှာ customer တစ်ယောက်ချင်းစီရဲ့ balance နဲ့ branch တစ်ခုချင်းစီရဲ့ စုစုပေါင်း deposit တွေ သိမ်းထားတယ်ဆိုပါစို့။ Alice ဆီကနေ Bob ဆီ ဒေါ်လာ ၁၀၀ လွှဲပေးတာကို မှတ်တမ်းတင်ချင်ရင် — SQL command တွေက ဒီလိုမျိုး ဖြစ်ပါလိမ့်မယ်:

```sql
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
UPDATE branches SET balance = balance - 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Alice');
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
UPDATE branches SET balance = balance + 100.00
    WHERE name = (SELECT branch_name FROM accounts WHERE name = 'Bob');
```

ဒီ command တွေရဲ့ အသေးစိတ်ထက် အရေးကြီးတာက — ဒီလောက် ရိုးရှင်းတဲ့ အလုပ်တစ်ခုတောင် update များစွာ ပါဝင်နေတာပါ။ Bank အနေနဲ့ — ဒီ update တွေ အကုန်လုံး ဖြစ်မယ်၊ ဒါမှမဟုတ် တစ်ခုမှ မဖြစ်ဘူးဆိုတဲ့ အာမခံချက် လိုပါတယ်။ System failure ဖြစ်လို့ — Alice ဆီက မနှုတ်ရသေးဘဲ Bob က ဒေါ်လာ ၁၀၀ ရသွားတာမျိုး မဖြစ်စေချင်ပါဘူး။ ဒါမှမဟုတ် Bob မရဘဲ Alice ဆီက နှုတ်ခံရတာမျိုးလည်း — Alice အတွက် မကောင်းပါဘူး။ Update တွေကို transaction တစ်ခုထဲ စုထည့်လိုက်တာနဲ့ ဒီအာမခံချက် ရပါတယ် — transaction ကို **atomic** လို့ ခေါ်ပြီး — တခြား transaction တွေရဲ့ ရှုထောင့်ကကြည့်ရင် အကုန်ဖြစ်တာ ဒါမှမဟုတ် လုံးဝမဖြစ်တာပဲ ရှိပါတယ်။

## ACID ဂုဏ်သတ္တိတွေ

Transaction တွေရဲ့ အာမခံချက်တွေကို **ACID** ဆိုပြီး အတိုကောက် ခေါ်ပါတယ်:

- **Atomicity** — အပေါ်မှာ ပြောခဲ့သလို — transaction က အကုန်ဖြစ်တာ ဒါမှမဟုတ် လုံးဝမဖြစ်တာပဲ ရှိပါတယ်။
- **Consistency** — transaction က database ကို valid state တစ်ခုကနေ နောက် valid state တစ်ခုဆီ ရွှေ့ပေးပြီး — ကြားအခြေအနေတွေကို ချန်မထားပါဘူး။
- **Isolation** — transaction တစ်ခုရဲ့ မပြီးသေးတဲ့ အပြောင်းအလဲတွေကို တစ်ပြိုင်နက် run နေတဲ့ တခြား transaction တွေ မမြင်ရပါဘူး။
- **Durability** — transaction က ပြီးပြီး database system က အသိအမှတ်ပြုပြီးတာနဲ့ — ခဏအကြာမှာ crash ဖြစ်သွားရင်တောင် အဲဒီ update တွေ မပျောက်ပါဘူး။

Durability ကို ဥပမာနဲ့ ကြည့်ရင် — transaction တစ်ခုရဲ့ update တွေအားလုံးကို transaction ပြီးတယ်လို့ အစီရင်ခံတာ မတိုင်ခင် permanent storage (disk) ပေါ်မှာ log တင်ထားပါတယ်။ Isolation ကိုကြည့်ရင် — branch balance တွေ စုစုပေါင်း ရေတွက်နေတဲ့ transaction က — Alice ရဲ့ branch က နှုတ်ထားတာ ပါပြီး Bob ရဲ့ branch က ထည့်ထားတာ မပါတာမျိုး မဖြစ်စေရပါဘူး။ Transaction တစ်ခု ပြီးတာနဲ့ update တွေ အားလုံး တစ်ပြိုင်နက် မြင်ရပြီး — မပြီးခင်အထိ ဘယ်သူမှ မမြင်ရပါဘူး။

## BEGIN, COMMIT, ROLLBACK

PostgreSQL မှာ transaction ကို — SQL command တွေကို `BEGIN` နဲ့ `COMMIT` ကြားမှာ ထားပြီး စတင်ပါတယ်:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
-- ကျန်တဲ့ update တွေ ဆက်လုပ်ပါ
COMMIT;
```

Transaction လယ်တည့်မှာ commit မလုပ်ချင်တော့ဘူးဆိုရင် (ဥပမာ Alice ရဲ့ balance အနုတ်ဖြစ်သွားတာ သတိထားမိလို့) — `COMMIT` အစား `ROLLBACK` ကို ထုတ်ပေးလိုက်ရင် အဲဒီအထိ update တွေ အားလုံး ပယ်ဖျက်ပါတယ်။

တကယ်တော့ PostgreSQL က SQL statement တိုင်းကို transaction ထဲမှာ run ပါတယ် — `BEGIN` မထုတ်ရင်တောင် statement တစ်ခုချင်းစီမှာ implicit `BEGIN` နဲ့ (အောင်မြင်ရင်) `COMMIT` ကို အလိုအလျောက် ပတ်ပေးပါတယ်။ `BEGIN` နဲ့ `COMMIT` ကြားက statement အစုကို **transaction block** လို့ ခေါ်ပါတယ်။ Client library တချို့က `BEGIN`/`COMMIT` တွေကို အလိုအလျောက် ထုတ်ပေးတတ်လို့ — သင်သုံးနေတဲ့ interface ရဲ့ documentation ကို စစ်ကြည့်ပါ။

## Savepoints — Transaction ရဲ့ အစိတ်အပိုင်းကို ရွေးပယ်ခြင်း

Transaction ထဲက statement တွေကို ပိုသေချာ ထိန်းချုပ်ချင်ရင် **savepoint** တွေ သုံးလို့ရပါတယ် — transaction ရဲ့ အစိတ်အပိုင်း တချို့ကိုပဲ ရွေးပစ်ပြီး ကျန်တာကို commit လုပ်နိုင်ပါတယ်။ `SAVEPOINT` နဲ့ အမှတ်အသား လုပ်ထားပြီး လိုအပ်ရင် `ROLLBACK TO` နဲ့ အဲဒီအမှတ်ကို ပြန်ဆုတ်ပါတယ် — savepoint နဲ့ ပြန်ဆုတ်တဲ့ကြားက database အပြောင်းအလဲတွေ အားလုံး ပျက်ပြီး — savepoint မတိုင်ခင်က အပြောင်းအလဲတွေကတော့ ကျန်နေပါတယ်။

Alice ဆီက ဒေါ်လာ ၁၀၀ နှုတ်ပြီး Bob ဆီ ထည့်လိုက်ပေမယ့် — နောက်မှ Wally ဆီ ထည့်သင့်တာဆိုတာ သိလိုက်ရတဲ့ အခြေအနေမျိုးကို ကြည့်ရအောင်:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
-- မှားသွားပြီ ... Bob အစား Wally ဆီ ထည့်သင့်တယ်
ROLLBACK TO my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Wally';
COMMIT;
```

Savepoint ကို ပြန်ဆုတ်ပြီးရင်လည်း သူ့နေရာမှာ ဆက်ရှိနေလို့ — အကြိမ်ကြိမ် ပြန်သုံးလို့ရပါတယ်။ မလိုတော့ဘူးဆိုရင် release လုပ်ပြီး resource တွေ လွှတ်ပေးလို့လည်း ရပါတယ် — savepoint တစ်ခုကို release ဒါမှမဟုတ် roll back လုပ်တိုင်း အဲဒီနောက်မှာ သတ်မှတ်ထားတဲ့ savepoint တွေကိုပါ အလိုအလျောက် လွှတ်ပေးပါတယ်။ ဒါတွေ အားလုံးက transaction block ထဲမှာ ဖြစ်နေလို့ — တခြား database session တွေ မမြင်ရပါဘူး။ Commit လုပ်တဲ့အခါ — commit လုပ်ထားတဲ့ လုပ်ဆောင်ချက်တွေ တစ်စုတစ်ဝည်းလုံး မြင်ရပြီး roll back လုပ်ထားတာတွေကတော့ ဘယ်တော့မှ မပေါ်ပါဘူး။ နောက်ထပ် သိထားသင့်တာက — system က error ကြောင့် aborted state ဖြစ်သွားတဲ့ transaction block ကို — အကုန်လုံး ပြန်စရာမလိုဘဲ ပြန်ထိန်းချုပ်နိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းက `ROLLBACK TO` ပါ။

## ဘာလို့ အရေးကြီးသလဲ

Transaction တွေက **data integrity** အတွက် အာမခံချက် ပေးပါတယ် — လုပ်ဆောင်ချက် တစ်ဝက်တစ်ပျက် ဖြစ်နေတဲ့ state တွေကို database ထဲ ဘယ်တော့မှ မကျန်စေပါဘူး။ ငွေလွှဲခြင်း၊ အော်ဒါ မှာခြင်း စတဲ့ အဆင့်ပေါင်းများစွာ ပါတဲ့ လုပ်ဆောင်ချက်တွေမှာ — ငွေနှုတ်ပြီး မထည့်ရသေး စတဲ့ တစ်ဝက်တစ်ပျက် အခြေအနေမျိုး ဘယ်တော့မှ မဖြစ်နိုင်တာကို သေချာစေပါတယ်။ PostgreSQL က [PostgreSQL မိတ်ဆက်](/docs/postgresql/getting-started) မှာ ပြောခဲ့သလို — ACID compliant database ဖြစ်ပြီး transaction တွေက ဒီဂုဏ်သတ္တိတွေရဲ့ အခြေခံပါ။

## နောက်တစ်ဆင့်တွေ

- [Indexes (အညွှန်း)](/docs/postgresql/indexes) — query တွေ မြန်အောင် index သုံးတာကို ဆက်လေ့လာပါ
- [JOIN နဲ့ Data ပေါင်းခြင်း](/docs/postgresql/joins) — table ပေါင်းပြီး query လုပ်တာ ပြန်ကြည့်ချင်ရင်
- [Aggregate Functions များ](/docs/postgresql/aggregate) — GROUP BY, HAVING တွေ ဆက်လေ့လာချင်ရင်
- Official docs: https://www.postgresql.org/docs/current/tutorial-transactions.html
