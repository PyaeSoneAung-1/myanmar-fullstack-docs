---
title: "CHECKPOINT (checkpoint တစ်ခုကို အတင်းအကျပ် ပြုလုပ်ခြင်း)"
description: "Write-ahead log checkpoint တစ်ခုကို ချက်ချင်း အတင်းအကျပ် ပြုလုပ်ပေးတဲ့ command — system က ပုံမှန် စီစဉ်ထားတဲ့ checkpoint ကို မစောင့်ဘဲ data files တွေ အားလုံးကို disk ပေါ် flush လုပ်ပေးပြီး — recovery ကာလအတွင်းမှာ restartpoint တစ်ခုကို အတင်းအကျပ် ပြုလုပ်ပေးတယ် — pg_checkpoint role ၏ privileges ရှိသူများသာ call လုပ်နိုင်သော command"
order: 201
source: "https://www.postgresql.org/docs/current/sql-checkpoint.html"
status: translated
updated: 2026-09-04
---

## CHECKPOINT (checkpoint တစ်ခုကို အတင်းအကျပ် ပြုလုပ်ခြင်း)

CHECKPOINT — write-ahead log checkpoint တစ်ခုကို အတင်းအကျပ် ပြုလုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CHECKPOINT
```

## Description (အသေးစိတ် ဖော်ပြချက်)

Checkpoint တစ်ခုဆိုတာ — write-ahead log sequence ထဲမှာ — data files တွေ အားလုံးကို log ထဲက အချက်အလက်တွေကို ထင်ဟပ်စေဖို့ update လုပ်ပြီးသွားတဲ့ — အမှတ် (point) တစ်ခု ဖြစ်ပါတယ်။ Data files တွေ အားလုံးကို disk ပေါ်ကို flush လုပ်ပါလိမ့်မယ်။ Checkpoint တစ်ခုအတွင်းမှာ ဘာတွေ ဖြစ်ပျက်လဲဆိုတဲ့ အသေးစိတ် အချက်အလက်တွေအတွက် [အပိုင်း 28.5](https://www.postgresql.org/docs/current/wal-configuration.html) ကို ကိုးကားကြည့်ပါ။

`CHECKPOINT` command က — command ကို ထုတ်ပေးလိုက်တဲ့အခါ — system က ပုံမှန် စီစဉ်ထားတဲ့ checkpoint ကို မစောင့်ဘဲ ([အပိုင်း 19.5.2](https://www.postgresql.org/docs/current/runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS) ထဲက settings တွေက ထိန်းချုပ်ထားတဲ့) — checkpoint တစ်ခုကို ချက်ချင်း အတင်းအကျပ် ပြုလုပ်ပေးပါတယ်။ `CHECKPOINT` ကို ပုံမှန် လည်ပတ်နေချိန်တွေမှာ သုံးဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။

Recovery (ပြန်လည် ဆယ်တင်ခြင်း) ကာလအတွင်းမှာ execute လုပ်ခဲ့ရင် — `CHECKPOINT` command က checkpoint အသစ်တစ်ခု ရေးသားမယ့်အစား — restartpoint တစ်ခုကို အတင်းအကျပ် ပြုလုပ်ပါလိမ့်မယ် ([အပိုင်း 28.5](https://www.postgresql.org/docs/current/wal-configuration.html) ကို ကြည့်ပါ)။

Superusers တွေ ဒါမှမဟုတ် [pg_checkpoint](https://www.postgresql.org/docs/current/predefined-roles.html#PREDEFINED-ROLE-PG-CHECKPOINT) role ရဲ့ privileges တွေ ရှိတဲ့ users တွေပဲ `CHECKPOINT` ကို call လုပ်လို့ ရပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

`CHECKPOINT` command က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။
