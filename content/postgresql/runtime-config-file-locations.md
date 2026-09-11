---
title: "File Locations (ဖိုင် တည်နေရာများ)"
description: "PostgreSQL ရဲ့ configuration file များကို data directory အပြင်ဘက်တွင် ထားရှိခွင့်ပြုသော parameters များ — data_directory, config_file, hba_file, ident_file နှင့် external_pid_file တို့၏ တည်နေရာ သတ်မှတ်ခြင်း၊ -D command-line option နှင့် PGDATA environment variable အသုံးပြုပုံ အကြောင်း ရှင်းလင်းချက်"
order: 157
source: "https://www.postgresql.org/docs/current/runtime-config-file-locations.html"
status: translated
updated: 2026-09-11
---

## 19.2. File Locations (ဖိုင် တည်နေရာများ)

အပေါ်မှာ ဖော်ပြခဲ့ပြီးသား `postgresql.conf` file အပြင် — PostgreSQL က client authentication (client စစ်မှန်ကြောင်း စိစစ်ခြင်း) ကို ထိန်းချုပ်တဲ့ — လက်ဖြင့် ပြင်ဆင်ရတဲ့ (manually-edited) configuration file နှစ်ခု ထပ်မံ အသုံးပြုပါတယ် (သူတို့ရဲ့ အသုံးပြုပုံကို [အခန်း 20](https://www.postgresql.org/docs/current/client-authentication.html) မှာ ဆွေးနွေးထားပါတယ်)။ Default အားဖြင့် — configuration file သုံးခုလုံးကို database cluster ရဲ့ data directory ထဲမှာ သိမ်းဆည်းထားပါတယ်။ ဒီအပိုင်းမှာ ဖော်ပြထားတဲ့ parameters တွေက configuration file တွေကို အခြားနေရာတစ်ခုမှာ ထားရှိခွင့် ပေးပါတယ်။ (ဒီလို လုပ်ခြင်းက စီမံခန့်ခွဲမှု (administration) ကို လွယ်ကူစေပါတယ်။ အထူးသဖြင့် — configuration file တွေကို သီးခြား ခွဲထားတဲ့အခါ — အဲဒါတွေကို ကောင်းမွန်စွာ backup လုပ်ထားကြောင်း သေချာစေဖို့ ပိုလွယ်ကူတတ်ပါတယ်။)

- **data_directory (string)** — Data သိုလှောင်ဖို့ သုံးရမယ့် directory ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **config_file (string)** — Main server configuration file (ပုံမှန်အားဖြင့် postgresql.conf လို့ ခေါ်ပါတယ်) ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို postgres command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **hba_file (string)** — Host-based authentication (host အခြေပြု စစ်မှန်ကြောင်း စိစစ်ခြင်း) အတွက် configuration file (ပုံမှန်အားဖြင့် pg_hba.conf လို့ ခေါ်ပါတယ်) ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။
- **ident_file (string)** — User name mapping အတွက် configuration file (ပုံမှန်အားဖြင့် pg_ident.conf လို့ ခေါ်ပါတယ်) ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။ [အပိုင်း 20.2](/docs/postgresql/auth-username-maps) ကိုလည်း ကြည့်ပါ။
- **external_pid_file (string)** — Server administration programs တွေ အသုံးပြုဖို့ server က ဖန်တီးသင့်တဲ့ process-ID (PID) file အပိုတစ်ခုရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။ ဒီ parameter ကို server start လုပ်ချိန်မှာသာ သတ်မှတ်နိုင်ပါတယ်။

Default installation တစ်ခုမှာ — အပေါ်က parameters တစ်ခုမှ အတိအလင်း (explicitly) သတ်မှတ်ထားတာ မရှိပါဘူး။ အဲဒီအစား — data directory ကို `-D` command-line option ဒါမှမဟုတ် `PGDATA` environment variable နဲ့ သတ်မှတ်ပြီး — configuration file တွေ အားလုံးကို data directory အတွင်းမှာ တွေ့ရပါတယ်။

Configuration file တွေကို data directory မဟုတ်ဘဲ အခြားနေရာမှာ ထားလိုရင် — `postgres` `-D` command-line option ဒါမှမဟုတ် `PGDATA` environment variable က configuration file တွေ ပါဝင်တဲ့ directory ကို ညွှန်ပြရပါမယ်။ ပြီးတော့ data directory တကယ် ဘယ်နေရာမှာ ရှိလဲဆိုတာ ပြဖို့ `postgresql.conf` ထဲမှာ (ဒါမှမဟုတ် command line ပေါ်မှာ) `data_directory` parameter ကို သတ်မှတ်ရပါမယ်။ `data_directory` က data directory ရဲ့ တည်နေရာအတွက် `-D` နဲ့ `PGDATA` ကို override လုပ်ပေမယ့် — configuration file တွေရဲ့ တည်နေရာအတွက် မဟုတ်ကြောင်း သတိပြုပါ။

လိုရင် — `config_file`, `hba_file` နဲ့/ဒါမှမဟုတ် `ident_file` parameters တွေကို သုံးပြီး configuration file နာမည်တွေနဲ့ တည်နေရာတွေကို တစ်ခုချင်း (individually) သတ်မှတ်နိုင်ပါတယ်။ `config_file` ကို `postgres` command line ပေါ်မှာသာ သတ်မှတ်နိုင်ပေမယ့် — ကျန်တာတွေကို main configuration file ထဲမှာ သတ်မှတ်နိုင်ပါတယ်။ Parameter သုံးခုလုံးနဲ့ `data_directory` ကို အတိအလင်း သတ်မှတ်ထားရင် — `-D` ဒါမှမဟုတ် `PGDATA` သတ်မှတ်ဖို့ မလိုအပ်တော့ပါဘူး။

ဒီ parameters တွေထဲက တစ်ခုခုကို သတ်မှတ်တဲ့အခါ — relative path တစ်ခုကို `postgres` စတင် run လုပ်တဲ့ directory ကို အခြေခံပြီး အဓိပ္ပာယ် ဖွင့်ဆိုပါလိမ့်မယ်။
