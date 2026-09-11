---
title: "Setting Parameters (parameter များ သတ်မှတ်ခြင်း)"
description: "PostgreSQL server parameter များ သတ်မှတ်နည်း — parameter အမည်နှင့် တန်ဖိုး အမျိုးအစားများ (boolean, string, numeric, unit ပါ numeric, enum)၊ postgresql.conf နှင့် postgresql.auto.conf မှတစ်ဆင့် ချိန်ညှိခြင်း၊ SQL (ALTER SYSTEM, ALTER DATABASE, ALTER ROLE, SHOW, SET) ဖြင့် ချိန်ညှိခြင်း၊ shell (postgres -c, PGOPTIONS) မှတစ်ဆင့် ချိန်ညှိခြင်း၊ include / include_if_exists / include_dir ဖြင့် configuration file များကို ခွဲခြမ်း စီမံခန့်ခွဲခြင်း အကြောင်း"
order: 156
source: "https://www.postgresql.org/docs/current/config-setting.html"
status: translated
updated: 2026-09-11
---

## 19.1. Setting Parameters (parameter များ သတ်မှတ်ခြင်း)

- **19.1.1. Parameter Names and Values (parameter အမည်များနှင့် တန်ဖိုးများ)**
- **19.1.2. Parameter Interaction via the Configuration File (configuration file မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)**
- **19.1.3. Parameter Interaction via SQL (SQL မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)**
- **19.1.4. Parameter Interaction via the Shell (shell မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)**
- **19.1.5. Managing Configuration File Contents (configuration file အကြောင်းအရာများကို စီမံခန့်ခွဲခြင်း)**

### 19.1.1. Parameter Names and Values (parameter အမည်များနှင့် တန်ဖိုးများ)

Parameter အမည် အားလုံးက case-insensitive ဖြစ်ပါတယ်။ Parameter တစ်ခုချင်းစီက type ငါးမျိုးထဲက တစ်မျိုးရဲ့ တန်ဖိုးကို ယူပါတယ် — boolean၊ string၊ integer၊ floating point သို့မဟုတ် enumerated (enum) တို့ပါ။ Type က parameter ကို သတ်မှတ်တဲ့ syntax ကို ဆုံးဖြတ်ပါတယ်:

- Boolean: တန်ဖိုးများကို on၊ off၊ true၊ false၊ yes၊ no၊ 1၊ 0 (အားလုံး case-insensitive) သို့မဟုတ် ဒါတွေထဲက တစ်ခုရဲ့ မရှုပ်ထွေးတဲ့ prefix တစ်ခုအဖြစ် ရေးနိုင်ပါတယ်။
- String: ယေဘုယျအားဖြင့် — တန်ဖိုးကို single quote နှစ်ခုကြားမှာ ထည့်ပြီး — တန်ဖိုးထဲမှာရှိတဲ့ single quote တစ်ခုချင်းစီကို နှစ်ခါ ရေးပါ။ ဒါပေမယ့် — တန်ဖိုးက ရိုးရှင်းတဲ့ number ဒါမှမဟုတ် identifier ဖြစ်ရင်တော့ quote တွေကို များသောအားဖြင့် ချန်လှပ်နိုင်ပါတယ်။ (SQL keyword နဲ့ ကိုက်ညီတဲ့ တန်ဖိုးတွေကတော့ အချို့ အခြေအနေများမှာ quote လိုပါတယ်။)
- Numeric (integer နဲ့ floating point): Numeric parameter တွေကို ထုံးစံအတိုင်း integer နဲ့ floating-point format တွေနဲ့ သတ်မှတ်နိုင်ပါတယ်; parameter က integer type ဖြစ်ရင် — အပိုင်းကိန်း (fractional) တန်ဖိုးတွေကို အနီးစပ်ဆုံး integer ဆီ rounding လုပ်ပါတယ်။ Integer parameter တွေက hexadecimal input (0x နဲ့ စတင်) နဲ့ octal input (0 နဲ့ စတင်) ကိုလည်း လက်ခံပါတယ် — ဒါပေမယ့် ဒီ format တွေမှာ အပိုင်းကိန်း မပါရပါဘူး။ Thousands separator တွေ မသုံးရပါဘူး။ Hexadecimal input အတွက်ကလွဲလို့ quote တွေ မလိုပါဘူး။
- Numeric with Unit: အချို့ numeric parameter တွေမှာ implicit unit တစ်ခု ရှိပါတယ် — အကြောင်းကတော့ ဒါတွေက memory သို့မဟုတ် time ရဲ့ ပမာဏကို ဖော်ပြတာမို့ပါ။ Unit က byte၊ kilobyte၊ block (ပုံမှန်အားဖြင့် ရှစ် kilobyte)၊ millisecond၊ second သို့မဟုတ် minute ဖြစ်နိုင်ပါတယ်။ ဒီ setting တွေအတွက် unit မပါတဲ့ numeric တန်ဖိုးတစ်ခုက setting ရဲ့ default unit ကို သုံးပါလိမ့်မယ် — အဲဒါကို pg_settings.unit ကနေ သိနိုင်ပါတယ်။ အဆင်ပြေစေဖို့ — setting တွေကို unit အတိအလင်း သတ်မှတ်ပြီးလည်း ပေးနိုင်ပါတယ် — ဥပမာ time တန်ဖိုးတစ်ခုအတွက် '120 ms' လိုမျိုးပါ — ပြီးရင် အဲဒါတွေက parameter ရဲ့ တကယ့် unit ဖြစ်တဲ့ အရာဆီ ပြောင်းလဲပေးပါလိမ့်မယ်။ ဒီ feature ကို သုံးဖို့ တန်ဖိုးကို string အနေနဲ့ (quote တွေနဲ့) ရေးရပါမယ် ဆိုတာ သတိပြုပါ။ Unit နာမည်က case-sensitive ဖြစ်ပြီး — numeric တန်ဖိုးနဲ့ unit ကြားမှာ whitespace ရှိနိုင်ပါတယ်။
  
  တရားဝင် memory unit တွေက B (byte)၊ kB (kilobyte)၊ MB (megabyte)၊ GB (gigabyte) နဲ့ TB (terabyte) တို့ ဖြစ်ပါတယ်။ Memory unit တွေအတွက် multiplier က 1000 မဟုတ်ဘဲ 1024 ဖြစ်ပါတယ်။
  
  တရားဝင် time unit တွေက us (microsecond)၊ ms (millisecond)၊ s (second)၊ min (minute)၊ h (hour) နဲ့ d (day) တို့ ဖြစ်ပါတယ်။
  
  Unit တစ်ခုနဲ့အတူ အပိုင်းကိန်း (fractional) တန်ဖိုးတစ်ခုကို သတ်မှတ်ရင် — နောက်တစ်ဆင့် သေးငယ်တဲ့ unit တစ်ခု ရှိရင် — အဲဒီ unit ရဲ့ ဆတိုးတစ်ခုဆီ rounding လုပ်ပါလိမ့်မယ်။ ဥပမာ — 30.1 GB ကို 32319628902 B အဖြစ်မဟုတ်ဘဲ 30822 MB အဖြစ် ပြောင်းလဲပါလိမ့်မယ်။ Parameter က integer type ဖြစ်ရင် — unit conversion တစ်ခုခု လုပ်ပြီးတဲ့နောက် — integer ဆီ နောက်ဆုံး rounding တစ်ခါ လုပ်ပါတယ်။
- Enumerated: Enumerated-type parameter တွေကို string parameter တွေနဲ့ ပုံစံတူ ရေးပါတယ် — ဒါပေမယ့် ကန့်သတ်ထားတဲ့ တန်ဖိုး အစုတစ်ခုထဲက တစ်ခု ဖြစ်ရန် ကန့်သတ်ထားပါတယ်။ ဒီလို parameter တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေကို pg_settings.enumvals ကနေ ရှာတွေ့နိုင်ပါတယ်။ Enum parameter တန်ဖိုးတွေက case-insensitive ဖြစ်ပါတယ်။

### 19.1.2. Parameter Interaction via the Configuration File (configuration file မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)

ဒီ parameter တွေကို သတ်မှတ်ဖို့ အခြေခံအကျဆုံး နည်းလမ်းက `postgresql.conf` file ကို တည်းဖြတ်တာပါ — ဒီ file ကို ပုံမှန်အားဖြင့် data directory ထဲမှာ သိမ်းထားပါတယ်။ Database cluster directory ကို initialize လုပ်တဲ့အခါ default copy တစ်ခု ထည့်သွင်းပေးပါတယ်။ ဒီ file က ဘယ်လိုပုံစံ ဖြစ်နိုင်လဲဆိုတာ ဥပမာတစ်ခုကတော့:

```sql
# This is a comment
log_connections = all
log_destination = 'syslog'
search_path = '"$user", public'
shared_buffers = 128MB
```

Line တစ်ကြောင်းလျှင် parameter တစ်ခု သတ်မှတ်ပါတယ်။ နာမည်နဲ့ တန်ဖိုးကြားက equal sign က optional ဖြစ်ပါတယ်။ Whitespace က အရေးမပါဘူး (quoted parameter value အတွင်းမှာကလွဲလို့) ပြီးတော့ blank line တွေကို လျစ်လျူရှုပါတယ်။ Hash mark (`#`) တွေက line ရဲ့ ကျန်တဲ့အပိုင်းကို comment အဖြစ် သတ်မှတ်ပါတယ်။ ရိုးရှင်းတဲ့ identifier ဒါမှမဟုတ် number မဟုတ်တဲ့ parameter တန်ဖိုးတွေကို single-quote လုပ်ရပါမယ်။ Parameter တန်ဖိုးတစ်ခုထဲမှာ single quote တစ်ခု ထည့်ရေးဖို့ quote နှစ်ခု (ပိုနှစ်သက်တဲ့နည်း) ဒါမှမဟုတ် backslash-quote ရေးပါ။ File ထဲမှာ တူညီတဲ့ parameter အတွက် entry အများအပြား ပါရင် — နောက်ဆုံး တစ်ခုကလွဲလို့ ကျန်တာအားလုံးကို လျစ်လျူရှုပါတယ်။

ဒီနည်းနဲ့ သတ်မှတ်ထားတဲ့ parameter တွေက cluster အတွက် default တန်ဖိုးတွေကို ပေးပါတယ်။ override မလုပ်ထားရင် — active session တွေ မြင်ရတဲ့ setting တွေက ဒီတန်ဖိုးတွေ ဖြစ်ပါလိမ့်မယ်။ နောက်လာမယ့် section တွေမှာ administrator သို့မဟုတ် user က ဒီ default တွေကို ဘယ်လို override လုပ်နိုင်လဲဆိုတာ ဖော်ပြပါတယ်။

Main server process က SIGHUP signal လက်ခံရရှိတဲ့အခါတိုင်း configuration file ကို ပြန်ဖတ်ပါတယ်; ဒီ signal ကို command line ကနေ `pg_ctl reload` run ခြင်းဖြင့် ဖြစ်စေ — SQL function `pg_reload_conf()` ကို ခေါ်ခြင်းဖြင့် ဖြစ်စေ — အလွယ်ဆုံး ပို့နိုင်ပါတယ်။ Main server process က ဒီ signal ကို လက်ရှိ run နေတဲ့ server process အားလုံးဆီလည်း ဖြန့်ပေးပါတယ် — ဒါကြောင့် ရှိပြီးသား session တွေလည်း တန်ဖိုးအသစ်တွေကို လက်ခံ ကျင့်သုံးပါလိမ့်မယ် (ဒါက သူတို့ လက်ရှိ လုပ်ဆောင်နေတဲ့ client command တစ်ခုကို ပြီးဆုံးတဲ့နောက် ဖြစ်ပါလိမ့်မယ်)။ တနည်းအားဖြင့် — signal ကို server process တစ်ခုတည်းဆီ တိုက်ရိုက် ပို့နိုင်ပါတယ်။ အချို့ parameter တွေကို server start လုပ်တဲ့အခါမှသာ သတ်မှတ်နိုင်ပါတယ်; သူတို့ရဲ့ configuration file entry တွေမှာ ပြောင်းလဲမှု ဘယ်လိုပဲ လုပ်လုပ် — server ကို ပြန်လည် restart လုပ်တဲ့အထိ လျစ်လျူရှုပါလိမ့်မယ်။ Configuration file ထဲက မမှန်ကန်တဲ့ parameter setting တွေကိုလည်း SIGHUP လုပ်ဆောင်မှုအတွင်း အလားတူ လျစ်လျူရှုပါတယ် (ဒါပေမယ့် log လုပ်ပါတယ်)။

`postgresql.conf` အပြင် — PostgreSQL data directory ထဲမှာ `postgresql.auto.conf` file လည်း ပါပါတယ် — ဒါက `postgresql.conf` နဲ့ format တူပေမယ့် — လက်ဖြင့် ကိုယ်တိုင် မဟုတ်ဘဲ အလိုအလျောက် တည်းဖြတ်ဖို့ ရည်ရွယ်ထားတာပါ။ ဒီ file က [`ALTER SYSTEM`](/docs/postgresql/sql-altersystem) command ကတစ်ဆင့် ပေးထားတဲ့ setting တွေကို သိမ်းထားပါတယ်။ ဒီ file ကို `postgresql.conf` ဖတ်တဲ့အခါတိုင်း ဖတ်ပြီး — သူ့ setting တွေက အလားတူ သက်ရောက်ပါတယ်။ `postgresql.auto.conf` ထဲက setting တွေက `postgresql.conf` ထဲက setting တွေကို override လုပ်ပါတယ်။

ပြင်ပ tool တွေလည်း `postgresql.auto.conf` ကို ပြင်ဆင်နိုင်ပါတယ်။ Server run နေစဉ်အတွင်း ဒါကို လုပ်ဖို့ အကြံပြု မပြုပါဘူး — [allow_alter_system](/docs/postgresql/runtime-config-compatible) ကို `off` သတ်မှတ်မထားရင်ပေါ့ — အကြောင်းကတော့ တစ်ပြိုင်နက် run နေတဲ့ `ALTER SYSTEM` command က ဒီလို ပြောင်းလဲမှုတွေကို ကျော်ရေးပစ်နိုင်လို့ပါ။ ဒီလို tool တွေက setting အသစ်တွေကို အဆုံးမှာ ချည်းပဲ ပေါင်းထည့်တာမျိုး ဖြစ်နိုင်သလို — ထပ်နေတဲ့ setting တွေနဲ့/သို့မဟုတ် comment တွေကို ဖယ်ရှားတာမျိုးလည်း ရွေးချယ်နိုင်ပါတယ် (ALTER SYSTEM လုပ်သလိုပဲ)။

System view [`pg_file_settings`](https://www.postgresql.org/docs/current/view-pg-file-settings.html) က configuration file တွေကို ကြိုတင် စမ်းသပ် (pre-test) လုပ်ဖို့ ဖြစ်စေ — SIGHUP signal က လိုချင်တဲ့ အကျိုးသက်ရောက်မှု မရရင် ပြဿနာ ရှာဖွေဖို့ ဖြစ်စေ — အထောက်အကူ ဖြစ်နိုင်ပါတယ်။

### 19.1.3. Parameter Interaction via SQL (SQL မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)

PostgreSQL က configuration default တွေ သတ်မှတ်ဖို့ SQL command သုံးခု ပေးထားပါတယ်။ အပေါ်မှာ ဖော်ပြပြီးသား `ALTER SYSTEM` command က global default တွေကို ပြောင်းလဲဖို့ SQL ကနေ ဝင်ရောက်နိုင်တဲ့ နည်းလမ်းတစ်ခု ပေးပါတယ်; ဒါက `postgresql.conf` ကို တည်းဖြတ်တာနဲ့ function အရ တူညီပါတယ်။ ဒါ့အပြင် — per-database သို့မဟုတ် per-role အခြေခံနဲ့ default တွေ သတ်မှတ်ခွင့်ပြုတဲ့ command နှစ်ခု ရှိပါသေးတယ်:

- ALTER DATABASE command က global setting တွေကို per-database အခြေခံနဲ့ override လုပ်ခွင့်ပြုပါတယ်။
- ALTER ROLE command က global ရော per-database setting တွေကိုပါ user-specific တန်ဖိုးတွေနဲ့ override လုပ်ခွင့်ပြုပါတယ်။

`ALTER DATABASE` နဲ့ `ALTER ROLE` နဲ့ သတ်မှတ်တဲ့ တန်ဖိုးတွေက database session အသစ်တစ်ခု စတင်တဲ့အခါမှသာ သက်ရောက်ပါတယ်။ ဒါတွေက configuration file တွေ သို့မဟုတ် server command line ကနေ ရရှိတဲ့ တန်ဖိုးတွေကို override လုပ်ပြီး — session ရဲ့ ကျန်တဲ့အပိုင်းအတွက် default တွေ ဖြစ်သွားပါတယ်။ အချို့ setting တွေက server start လုပ်ပြီးနောက် ပြောင်းလဲလို့ မရနိုင်ဘူး ဆိုတာ သတိပြုပါ — ဒါကြောင့် ဒီ command တွေ (ဒါမှမဟုတ် အောက်မှာ ဖော်ပြထားတဲ့ command တွေ) နဲ့ သတ်မှတ်လို့ မရပါဘူး။

Client တစ်ခု database နဲ့ ချိတ်ဆက်ပြီးတဲ့အခါ — PostgreSQL က session-local configuration setting တွေနဲ့ အပြန်အလှန် လုပ်ဆောင်ဖို့ SQL command နှစ်ခု (နဲ့ ညီမျှတဲ့ function တွေ) ထပ်ပေးပါတယ်:

- SHOW command က parameter မည်သည့်တစ်ခုမဆိုရဲ့ လက်ရှိ တန်ဖိုးကို စစ်ဆေး ကြည့်ရှုခွင့်ပြုပါတယ်။ သက်ဆိုင်ရာ SQL function က current_setting(setting_name text) ဖြစ်ပါတယ် ([အပိုင်း 9.28.1](/docs/postgresql/functions-admin) ကို ကြည့်ပါ)။
- SET command က session အတွက် local အနေနဲ့ သတ်မှတ်နိုင်တဲ့ parameter တွေရဲ့ လက်ရှိ တန်ဖိုးကို ပြောင်းလဲခွင့်ပြုပါတယ်; ဒါက အခြား session တွေအပေါ် သက်ရောက်မှု မရှိပါဘူး။ Parameter အများအပြားကို user မည်သူမဆို ဒီနည်းနဲ့ သတ်မှတ်နိုင်ပါတယ် — ဒါပေမယ့် အချို့ကိုတော့ superuser တွေနဲ့ အဲဒီ parameter အပေါ် SET privilege ပေးထားခံရတဲ့ user တွေသာ သတ်မှတ်နိုင်ပါတယ်။ သက်ဆိုင်ရာ SQL function က set_config(setting_name, new_value, is_local) ဖြစ်ပါတယ် ([အပိုင်း 9.28.1](/docs/postgresql/functions-admin) ကို ကြည့်ပါ)။

ဒါ့အပြင် — system view [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) ကို session-local တန်ဖိုးတွေကို ကြည့်ရှုဖို့နဲ့ ပြောင်းလဲဖို့ သုံးနိုင်ပါတယ်:

- ဒီ view ကို query လုပ်တာက SHOW ALL သုံးတာနဲ့ ဆင်တူပေမယ့် အသေးစိတ် ပိုပေးပါတယ်။ ဒါ့အပြင် filter condition တွေ သတ်မှတ်နိုင်တာ ဒါမှမဟုတ် အခြား relation တွေနဲ့ join လုပ်နိုင်တာ ဖြစ်တာမို့ — ပိုပြီး လိုက်လျောညီထွေ ရှိပါတယ်။
- ဒီ view ပေါ်မှာ UPDATE သုံးတာ — အထူးသဖြင့် setting column ကို update လုပ်တာ — က SET command တွေ ထုတ်တာနဲ့ ညီမျှပါတယ်။ ဥပမာ —
  
  SET configuration_parameter TO DEFAULT;
  
  နဲ့ ညီမျှတာက:
  
  UPDATE pg_settings SET setting = reset_val WHERE name = 'configuration_parameter';

### 19.1.4. Parameter Interaction via the Shell (shell မှတစ်ဆင့် parameter များ ချိန်ညှိခြင်း)

Global default တွေ သတ်မှတ်တာ ဒါမှမဟုတ် database သို့မဟုတ် role အဆင့်မှာ override တွေ တွဲပေးတာအပြင် — setting တွေကို shell facility တွေကတစ်ဆင့် PostgreSQL ဆီ ပို့နိုင်ပါတယ်။ Server ရော libpq client library ပါ parameter တန်ဖိုးတွေကို shell ကတစ်ဆင့် လက်ခံပါတယ်။

- Server startup လုပ်စဉ်အတွင်း parameter setting တွေကို -c name=value command-line parameter ဒါမှမဟုတ် သူနဲ့ ညီမျှတဲ့ --name=value ပုံစံကတစ်ဆင့် postgres command ဆီ ပို့နိုင်ပါတယ်။ ဥပမာ —
  
  postgres -c log_connections=all --log-destination='syslog'
  
  ဒီနည်းနဲ့ ပေးထားတဲ့ setting တွေက postgresql.conf ဒါမှမဟုတ် ALTER SYSTEM ကတစ်ဆင့် သတ်မှတ်တာတွေကို override လုပ်တာမို့ — server ကို ပြန်လည် restart မလုပ်ဘဲ globally ပြောင်းလဲလို့ မရပါဘူး။
- libpq ကတစ်ဆင့် client session တစ်ခု စတင်တဲ့အခါ — parameter setting တွေကို PGOPTIONS environment variable သုံးပြီး သတ်မှတ်နိုင်ပါတယ်။ ဒီနည်းနဲ့ သတ်မှတ်ထားတဲ့ setting တွေက session တစ်ခုလုံး သက်တမ်းအတွက် default တွေ ဖြစ်ပြီး — အခြား session တွေအပေါ် သက်ရောက်မှု မရှိပါဘူး။ သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် — PGOPTIONS ရဲ့ format က postgres command ကို launch လုပ်တဲ့အခါ သုံးတာနဲ့ ဆင်တူပါတယ်; အတိအကျပြောရရင် — နာမည်ရဲ့ ရှေ့မှာ -c ဒါမှမဟုတ် -- ကို ရှေ့ဆွဲ သတ်မှတ်ရပါတယ်။ ဥပမာ —
  
  env PGOPTIONS="-c geqo=off --statement-timeout=5min" psql
  
  အခြား client နဲ့ library တွေကလည်း — shell ကတစ်ဆင့်ဖြစ်စေ အခြားနည်းဖြစ်စေ — SQL command တွေကို တိုက်ရိုက် မသုံးဘဲ session setting တွေကို user ပြောင်းလဲနိုင်စေတဲ့ သူတို့ကိုယ်ပိုင် ယန္တရားတွေ ပေးနိုင်ပါတယ်။

### 19.1.5. Managing Configuration File Contents (configuration file အကြောင်းအရာများကို စီမံခန့်ခွဲခြင်း)

PostgreSQL က ရှုပ်ထွေးတဲ့ `postgresql.conf` file တွေကို sub-file တွေအဖြစ် ခွဲခြမ်းဖို့ feature များစွာ ပေးထားပါတယ်။ ဒီ feature တွေက ဆက်စပ်ပေမယ့် တစ်ထပ်တည်း မတူတဲ့ configuration တွေရှိတဲ့ server အများအပြားကို စီမံခန့်ခွဲတဲ့အခါ အထူး အသုံးဝင်ပါတယ်။

Parameter တစ်ခုချင်းစီရဲ့ setting တွေအပြင် — `postgresql.conf` file မှာ *include directive* တွေလည်း ပါနိုင်ပါတယ် — ဒါတွေက ဒီအချက်မှာ configuration file ထဲ ထည့်သွင်းသလိုပဲ ဖတ်ပြီး လုပ်ဆောင်ရမယ့် အခြား file တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒီ feature က configuration file တစ်ခုကို ရုပ်ပိုင်းအရ သီးခြားဖြစ်တဲ့ အပိုင်းတွေအဖြစ် ခွဲခြမ်းခွင့်ပြုပါတယ်။ Include directive တွေက ရိုးရိုးလေး ဒီလို ပုံစံပါ:

```sql
include 'filename'
```

File နာမည်က absolute path မဟုတ်ရင် — referencing configuration file ပါဝင်တဲ့ directory ကို အခြေခံတဲ့ relative path အဖြစ် ယူပါတယ်။ Inclusion တွေကို အထပ်ထပ် (nested) လုပ်နိုင်ပါတယ်။

`include` directive လိုပဲ အလုပ်လုပ်တဲ့ `include_if_exists` directive လည်း ရှိပါတယ် — ဒါပေမယ့် ရည်ညွှန်းထားတဲ့ file မရှိရင် ဒါမှမဟုတ် ဖတ်လို့ မရရင် ကွဲပြားပါတယ်။ သာမန် `include` က ဒါကို error အခြေအနေအဖြစ် သတ်မှတ်ပါလိမ့်မယ် — ဒါပေမယ့် `include_if_exists` က message တစ်ခု log လုပ်ပြီး referencing configuration file ကို ဆက်လက် လုပ်ဆောင်ပါတယ်။

`postgresql.conf` file မှာ `include_dir` directive တွေလည်း ပါနိုင်ပါတယ် — ဒါတွေက ထည့်သွင်းရမယ့် configuration file တွေရဲ့ directory တစ်ခုလုံးကို သတ်မှတ်ပေးပါတယ်။ ဒါတွေက ဒီလို ပုံစံပါ

```sql
include_dir 'directory'
```

Absolute မဟုတ်တဲ့ directory နာမည်တွေကို referencing configuration file ပါဝင်တဲ့ directory ကို အခြေခံတဲ့ relative အဖြစ် ယူပါတယ်။ သတ်မှတ်ထားတဲ့ directory အတွင်းမှာ — နာမည်က `.conf` suffix နဲ့ ဆုံးတဲ့ directory မဟုတ်တဲ့ file တွေကိုသာ ထည့်သွင်းပါလိမ့်မယ်။ `.` အက္ခရာနဲ့ စတဲ့ file နာမည်တွေကိုလည်း လျစ်လျူရှုပါတယ် — အကြောင်းကတော့ platform အချို့မှာ ဒီလို file တွေက hidden ဖြစ်တာမို့ အမှားတွေ မဖြစ်စေဖို့ပါ။ Include directory တစ်ခုအတွင်းက file အများအပြားကို file နာမည် အစီအစဉ်အရ (C locale စည်းမျဉ်းများအတိုင်း — ဆိုလိုတာက — number တွေက အက္ခရာတွေရဲ့ အရင်၊ ပြီးတော့ uppercase အက္ခရာတွေက lowercase အက္ခရာတွေရဲ့ အရင်) လုပ်ဆောင်ပါတယ်။

Include file ဒါမှမဟုတ် directory တွေကို — `postgresql.conf` file ကြီးတစ်ခုတည်း ရှိတာထက် — database configuration ရဲ့ အပိုင်းတွေကို ယုတ္တိအရ ခွဲခြားဖို့ သုံးနိုင်ပါတယ်။ Memory ပမာဏ မတူညီတဲ့ database server နှစ်လုံး ရှိတဲ့ company တစ်ခုကို စဉ်းစားကြည့်ပါ။ Logging လိုမျိုး အရာတွေအတွက် server နှစ်လုံးလုံး မျှဝေသုံးမယ့် configuration အစိတ်အပိုင်းတွေ ရှိဖို့ များပါတယ်။ ဒါပေမယ့် server ပေါ်က memory-related parameter တွေက နှစ်လုံးကြားမှာ ကွဲပြားပါလိမ့်မယ်။ ပြီးတော့ server အလိုက် သီးခြား customization တွေလည်း ရှိနိုင်ပါသေးတယ်။ ဒီအခြေအနေကို စီမံခန့်ခွဲဖို့ နည်းလမ်းတစ်ခုကတော့ — သင့် site အတွက် custom configuration ပြောင်းလဲမှုတွေကို file သုံးခုအဖြစ် ခွဲခြမ်းတာပါ။ ဒါတွေကို ထည့်သွင်းဖို့ သင့် `postgresql.conf` file ရဲ့ အဆုံးမှာ ဒီလို ထည့်နိုင်ပါတယ်:

```sql
include 'shared.conf'
include 'memory.conf'
include 'server.conf'
```

System အားလုံးမှာ တူညီတဲ့ `shared.conf` ရှိပါလိမ့်မယ်။ Memory ပမာဏ တစ်ခုခုရှိတဲ့ server တစ်လုံးချင်းစီက တူညီတဲ့ `memory.conf` ကို မျှဝေသုံးနိုင်ပါတယ်; RAM 8GB ရှိတဲ့ server အားလုံးအတွက် တစ်ခု၊ 16GB ရှိတဲ့ အတွက် နောက်တစ်ခု ထားနိုင်ပါတယ်။ နောက်ဆုံးအနေနဲ့ `server.conf` မှာတော့ တကယ့် server-specific configuration အချက်အလက်တွေ ထည့်ထားနိုင်ပါတယ်။

နောက်ထပ် ဖြစ်နိုင်ခြေတစ်ခုကတော့ — configuration file directory တစ်ခု ဖန်တီးပြီး ဒီအချက်အလက်တွေကို အဲဒီထဲက file တွေမှာ ထည့်တာပါ။ ဥပမာ — `conf.d` directory တစ်ခုကို `postgresql.conf` ရဲ့ အဆုံးမှာ ရည်ညွှန်းနိုင်ပါတယ်:

```sql
include_dir 'conf.d'
```

ပြီးရင် `conf.d` directory ထဲက file တွေကို ဒီလို နာမည်ပေးနိုင်ပါတယ်:

```sql
00shared.conf
01memory.conf
02server.conf
```

ဒီ naming convention က ဒီ file တွေ load လုပ်မယ့် ရှင်းလင်းတဲ့ အစီအစဉ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒါက အရေးကြီးပါတယ် — အကြောင်းကတော့ server က configuration file တွေကို ဖတ်နေစဉ်အတွင်း parameter တစ်ခုအတွက် ကြုံတွေ့တဲ့ နောက်ဆုံး setting ကိုသာ သုံးမှာမို့ပါ။ ဒီဥပမာမှာ — `conf.d/02server.conf` ထဲမှာ သတ်မှတ်ထားတာ တစ်ခုခုက `conf.d/01memory.conf` ထဲမှာ သတ်မှတ်ထားတဲ့ တန်ဖိုးကို override လုပ်ပါလိမ့်မယ်။

ဒီအစား — file တွေကို ဖော်ပြချက် ပါဝင်တဲ့ နာမည်ပေးတဲ့ ဒီနည်းလမ်းကို သုံးနိုင်ပါတယ်:

```sql
00shared.conf
01memory-8GB.conf
02server-foo.conf
```

ဒီလို စီစဉ်မှုမျိုးက configuration file မူကွဲ တစ်မျိုးချင်းစီအတွက် ထူးခြားတဲ့ နာမည်တစ်ခု ပေးပါတယ်။ ဒါက server အများအပြားရဲ့ configuration တွေကို တစ်နေရာတည်းမှာ — version control repository လိုမျိုးနေရာမှာ — သိမ်းထားတဲ့အခါ မရှင်းလင်းမှုတွေ ဖယ်ရှားဖို့ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ (Database configuration file တွေကို version control အောက်မှာ သိမ်းထားတာကလည်း စဉ်းစားသင့်တဲ့ နောက်ထပ် ကောင်းမွန်တဲ့ အလေ့အကျင့်တစ်ခု ဖြစ်ပါတယ်။)
