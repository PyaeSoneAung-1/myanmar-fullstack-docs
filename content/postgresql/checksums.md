---
title: "Data Checksums (ဒေတာ checksum များ)"
description: "PostgreSQL cluster တွင် data checksum များ အသုံးပြုခြင်း — data page တစ်ခုချင်းစီ၏ checksum ကို စစ်ဆေးခြင်း၊ initdb ဖြင့် စတင်ချိန် သို့မဟုတ် နောက်ပိုင်း offline လုပ်ဆောင်ချက်အဖြစ် ဖွင့်/ပိတ်ခြင်း၊ data_checksums ကို SHOW ဖြင့် စစ်ဆေးခြင်း၊ page corruption များ ပြန်လည် ကုစားရာတွင် ignore_checksum_failure သုံးခြင်းနှင့် pg_checksums application အသုံးပြုခြင်း အကြောင်း"
order: 204
source: "https://www.postgresql.org/docs/current/checksums.html"
status: translated
updated: 2026-09-11
---

## 28.2. Data Checksums (ဒေတာ checksum များ)

- **28.2.1. Off-line Enabling of Checksums (checksum များကို off-line ဖွင့်ခြင်း)**

ပုံမှန်အားဖြင့် data page များကို checksum (စစ်ဆေးမှု ကုဒ်) များဖြင့် ကာကွယ်ထားပါတယ်။ ဒါပေမယ့် cluster တစ်ခုအတွက် ဒါကို ရွေးချယ်ပြီး ပိတ်ထားနိုင်ပါတယ်။ ဖွင့်ထားတဲ့အခါ data page တစ်ခုချင်းစီမှာ checksum တစ်ခု ပါဝင်ပြီး — page ကို ရေးသားတဲ့အခါ အဲဒီ checksum ကို update လုပ်ပြီး — page ကို ဖတ်တဲ့အခါတိုင်း ပြန်လည် စစ်ဆေးပါတယ်။ checksum များဖြင့် ကာကွယ်တာက data page များကိုပဲ ဖြစ်ပြီး — internal data structure များနဲ့ temporary file များကို ကာကွယ်တာ မဟုတ်ပါဘူး။

Checksum များကို cluster ကို [initdb](https://www.postgresql.org/docs/current/app-initdb.html#APP-INITDB-DATA-CHECKSUMS) နဲ့ initialize လုပ်တဲ့အခါ ပိတ်ထားနိုင်ပါတယ်။ နောက်ပိုင်း အချိန်တစ်ခုမှာ offline (server ရပ်နားထားချိန် လုပ်ဆောင်ရသော) လုပ်ဆောင်ချက်တစ်ခုအနေနဲ့လည်း ဖွင့်နိုင် ပိတ်နိုင်ပါတယ်။ Data checksum များကို cluster အဆင့် တစ်ခုလုံးအတွက်ပဲ ဖွင့်/ပိတ် လုပ်ပြီး — database များ သို့မဟုတ် table များအတွက် တစ်ခုချင်း သတ်မှတ်လို့ မရပါဘူး။

Cluster အတွင်း checksum များရဲ့ လက်ရှိ အခြေအနေကို — `SHOW data_checksums` command ပေးပြီး — read-only (ဖတ်ရှုရုံသက်သက်) configuration variable ဖြစ်တဲ့ [data_checksums](https://www.postgresql.org/docs/current/runtime-config-preset.html#GUC-DATA-CHECKSUMS) ရဲ့ တန်ဖိုးကို ကြည့်ခြင်းဖြင့် စစ်ဆေးနိုင်ပါတယ်။

Page corruption (page ပျက်စီးမှု) များမှ ပြန်လည် ကုစားဖို့ ကြိုးစားတဲ့အခါ checksum ကာကွယ်မှုကို ကျော်လွှားဖို့ လိုအပ်နိုင်ပါတယ်။ ဒါကို လုပ်ဖို့ configuration parameter ဖြစ်တဲ့ [ignore_checksum_failure](https://www.postgresql.org/docs/current/runtime-config-developer.html#GUC-IGNORE-CHECKSUM-FAILURE) ကို ယာယီ သတ်မှတ်ပေးပါ။

### 28.2.1. Off-line Enabling of Checksums (checksum များကို off-line ဖွင့်ခြင်း)

[pg_checksums](https://www.postgresql.org/docs/current/app-pgchecksums.html) application ကို — offline cluster တစ်ခုပေါ်မှာ — data checksum များကို ဖွင့်/ပိတ် လုပ်ဖို့နဲ့ checksum များကို စစ်ဆေးဖို့ အသုံးပြုနိုင်ပါတယ်။
