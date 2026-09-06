---
title: "Trust Authentication (ယုံကြည်စိတ်ချမှုအပေါ် အခြေခံသော authentication)"
description: "trust authentication ဆိုတာ ချိတ်ဆက်နိုင်သူတိုင်းကို သူတို့ သတ်မှတ်တဲ့ database user အမည်နဲ့ access ခွင့်ပြုတဲ့ နည်းလမ်း ဖြစ်ပြီး — ဘယ်အခြေအနေတွေမှာ သင့်လျော်လဲ၊ Unix socket file permissions နဲ့ TCP/IP connections တွေအတွက် ထည့်သွင်း စဉ်းစားစရာများအကြောင်း"
order: 155
source: "https://www.postgresql.org/docs/current/auth-trust.html"
status: translated
updated: 2026-09-06
---

## 20.4. Trust Authentication (ယုံကြည်စိတ်ချမှုအပေါ် အခြေခံသော authentication)

`trust` authentication ကို သတ်မှတ်ထားတဲ့အခါ — PostgreSQL က server ဆီ connect လုပ်နိုင်တဲ့ ဘယ်သူမဆို — သူတို့ သတ်မှတ်လိုက်တဲ့ database user အမည် ဘယ်ဟာနဲ့မဆို (superuser အမည်တွေတောင် ပါ) — database ကို access လုပ်ပိုင်ခွင့် ရှိတယ်လို့ ယူဆပါတယ်။ ဒါပေမယ့် — `database` နဲ့ `user` columns တွေမှာ ချမှတ်ထားတဲ့ ကန့်သတ်ချက်တွေကတော့ သက်ရောက်မှု ရှိနေဆဲ ဖြစ်ပါတယ်။ ဒီ method ကို — server ဆီက connections တွေအပေါ် operating-system-level အကာအကွယ် လုံလုံလောက်လောက် ရှိတဲ့အခါမှပဲ သုံးသင့်ပါတယ်။

`trust` authentication က — user တစ်ယောက်တည်း သုံးတဲ့ workstation တစ်ခုပေါ်က local connections တွေအတွက်တော့ သင့်လျော်ပြီး အရမ်း အဆင်ပြေပါတယ်။ Multiuser machine တစ်ခုမှာတော့ — တစ်ခုတည်း သီးသန့်အနေနဲ့ကတော့ များသောအားဖြင့် မသင့်လျော်ပါဘူး။ ဒါပေမယ့် — file-system permissions (ဖိုင်စနစ် ခွင့်ပြုချက်များ) သုံးပြီး server ရဲ့ Unix-domain socket file ဆီ access ကို ကန့်သတ်ထားမယ်ဆိုရင် — multiuser machine တစ်ခုမှာတောင် `trust` ကို သုံးနိုင်ပါတယ်။ ဒါလုပ်ဖို့ — [အပိုင်း 19.3](https://www.postgresql.org/docs/current/runtime-config-connection.html) မှာ ဖော်ပြထားတဲ့အတိုင်း — `unix_socket_permissions` (ဖြစ်နိုင်ရင် `unix_socket_group` ပါ) configuration parameters တွေကို set လုပ်ပါ။ ဒါမှမဟုတ် — `unix_socket_directories` configuration parameter ကို set လုပ်ပြီး — socket file ကို သင့်လျော်စွာ ကန့်သတ်ထားတဲ့ directory တစ်ခုထဲမှာ ထားနိုင်ပါတယ်။

File-system permissions တွေ သတ်မှတ်တာက Unix-socket connections တွေအတွက်ပဲ အကျိုးရှိပါတယ်။ Local TCP/IP connections တွေကိုတော့ file-system permissions တွေက ကန့်သတ်မထားပါဘူး။ ဒါကြောင့် — local security အတွက် file-system permissions တွေကို သုံးချင်တယ်ဆိုရင် — `pg_hba.conf` ထဲက `host ... 127.0.0.1 ...` line ကို ဖယ်ရှားပါ — ဒါမှမဟုတ် — `trust` မဟုတ်တဲ့ authentication method တစ်ခုအဖြစ် ပြောင်းလဲပါ။

`trust` ကို သတ်မှတ်ထားတဲ့ `pg_hba.conf` line တွေက server ဆီ connect ခွင့်ပြုထားတဲ့ machine တိုင်းပေါ်က user တိုင်းကို ယုံကြည်စိတ်ချနိုင်မှသာ — `trust` authentication က TCP/IP connections တွေအတွက် သင့်လျော်ပါတယ်။ Localhost (127.0.0.1) ကလာတဲ့ connections တွေကလွဲပြီး — တခြား TCP/IP connections တွေအတွက် `trust` ကို သုံးတာက ယုတ္တိကျလေ့ မရှိပါဘူး။
