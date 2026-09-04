---
title: "CREATE EXTENSION (extension တစ်ခုကို install လုပ်ခြင်း)"
description: "Extension တစ်ခုကို database တစ်ခုထဲသို့ load (install) လုပ်ပေးသော command — IF NOT EXISTS, SCHEMA, VERSION, CASCADE option များ၊ extension ၏ script file လုပ်ဆောင်ပုံ၊ trusted extension များနှင့် လိုအပ်သော privileges အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 314
source: "https://www.postgresql.org/docs/current/sql-createextension.html"
status: translated
updated: 2026-09-04
---

## CREATE EXTENSION (extension တစ်ခုကို install လုပ်ခြင်း)

CREATE EXTENSION — extension တစ်ခုကို install လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE EXTENSION [ IF NOT EXISTS ] extension_name
    [ WITH ] [ SCHEMA schema_name ]
             [ VERSION version ]
             [ CASCADE ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE EXTENSION` က — extension အသစ်တစ်ခုကို လက်ရှိ database ထဲသို့ load (တင်) ပေးပါတယ်။ နာမည်တူ extension တစ်ခု load လုပ်ပြီးသား ရှိနေလို့ မရပါဘူး။

Extension တစ်ခုကို load လုပ်တာက — အခြေခံအားဖြင့် — extension ရဲ့ script file ကို run လုပ်ခြင်းနဲ့ တူညီပါတယ်။ Script က ပုံမှန်အားဖြင့် — functions, data types, operators နဲ့ index support methods စတဲ့ — SQL objects အသစ်တွေကို ဖန်တီးပေးပါလိမ့်မယ်။ `CREATE EXTENSION` က ထို့အပြင် — ဖန်တီးလိုက်တဲ့ objects အားလုံးရဲ့ အထောက်အထားတွေ (identities) ကို မှတ်တမ်း သွင်းပါတယ် — ဒါမှသာ — `DROP EXTENSION` ကို ထုတ်ပြန်လိုက်ရင် — သူတို့ကို နောက်တစ်ကြိမ် drop လုပ်လို့ ရနိုင်မှာ ဖြစ်ပါတယ်။

`CREATE EXTENSION` ကို run လုပ်တဲ့ user က — နောက်ပိုင်း privilege စစ်ဆေးမှုတွေအတွက် — extension ရဲ့ owner ဖြစ်လာပြီး — ပုံမှန်အားဖြင့် — extension ရဲ့ script က ဖန်တီးလိုက်တဲ့ objects တွေရဲ့ owner လည်း ဖြစ်လာပါတယ်။

Extension တစ်ခုကို load လုပ်တာက — ပုံမှန်အားဖြင့် — သူ့ရဲ့ အစိတ်အပိုင်း objects တွေကို ဖန်တီးဖို့ လိုအပ်မယ့် privileges တွေနဲ့ အတူတူ လိုအပ်ပါတယ်။ Extension အများအပြားအတွက်ဆိုရင် — ဒါက superuser privileges တွေ လိုအပ်တယ်လို့ ဆိုလိုပါတယ်။ ဒါပေမယ့် — extension က သူ့ရဲ့ control file ထဲမှာ *trusted* (ယုံကြည်ရသော) လို့ အမှတ်အသား လုပ်ထားရင်တော့ — လက်ရှိ database ပေါ်မှာ `CREATE` privilege ရှိတဲ့ user တိုင်း သူ့ကို install လုပ်နိုင်ပါတယ်။ ဒီကိစ္စမှာ — extension object ကိုယ်တိုင်ကတော့ ခေါ်ယူ လုပ်ဆောင်တဲ့ user (calling user) က ပိုင်ဆိုင်မှာ ဖြစ်ပေမယ့် — အတွင်းက objects တွေကတော့ — bootstrap superuser က ပိုင်ဆိုင်ပါလိမ့်မယ် (extension ရဲ့ script က သူတို့ကို calling user ဆီ ထင်ရှားစွာ သတ်မှတ်ပေးထားခြင်း မရှိဘူးဆိုရင်)။ ဒီ configuration က — calling user ကို extension ကို drop လုပ်ပိုင်ခွင့် ပေးပေမယ့် — အတွင်းက objects တစ်ခုချင်းစီကို ပြုပြင်ပိုင်ခွင့်တော့ မပေးပါဘူး။

## Parameters (parameter များ)

- **IF NOT EXISTS** — နာမည်တူ extension တစ်ခု ရှိပြီးသား ဖြစ်နေရင် error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။ ရှိပြီးသား extension က — လက်ရှိ ရရှိနိုင်တဲ့ script file ကနေ ဖန်တီးမယ့်ဟာနဲ့ တစ်စုံတစ်ရာ ဆင်တူမယ်ဆိုတဲ့ အာမခံချက် (guarantee) မရှိဘူးဆိုတာ သတိပြုပါ။
- **extension_name** — Install လုပ်ရမယ့် extension ရဲ့ နာမည် ဖြစ်ပါတယ်။ PostgreSQL က — server ရဲ့ extension control path (extension_control_path က သတ်မှတ်ထားတဲ့) ကနေ ရှာဖွေတွေ့ရှိရတဲ့ — extension_name.control file ထဲက အချက်အလက်တွေကို သုံးပြီး — extension ကို ဖန်တီးပါလိမ့်မယ်။
- **schema_name** — Extension ရဲ့ objects တွေကို install လုပ်ရမယ့် schema ရဲ့ နာမည် ဖြစ်ပါတယ် — extension က သူ့ရဲ့ အကြောင်းအရာတွေကို နေရာ ရွှေ့ပြောင်းလို့ ရတယ်လို့ ခွင့်ပြုထားတယ်ဆိုရင် ဖြစ်ပါတယ်။ အမည်ပေးထားတဲ့ schema က ရှိပြီးသား ဖြစ်ရပါမယ်။ မသတ်မှတ်ထားဘူး၊ ပြီးတော့ — extension ရဲ့ control file ကလည်း schema တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — လက်ရှိ default object creation schema ကို သုံးပါတယ်။
Extension က သူ့ရဲ့ control file ထဲမှာ schema parameter တစ်ခုကို သတ်မှတ်ထားရင် — အဲဒီ schema ကို SCHEMA clause နဲ့ override (ကျော်လွန် သတ်မှတ်) လုပ်လို့ မရပါဘူး။ ပုံမှန်အားဖြင့် — SCHEMA clause တစ်ခု ပေးထားပြီး — သူက extension ရဲ့ schema parameter နဲ့ ပဋိပက္ခ ဖြစ်နေရင် — error တစ်ခု တက်ပါလိမ့်မယ်။ ဒါပေမယ့် — CASCADE clause ကိုပါ ပေးထားမယ်ဆိုရင် — ပဋိပက္ခ ဖြစ်တဲ့အခါ — schema_name ကို လျစ်လျူရှုပါတယ်။ ပေးထားတဲ့ schema_name ကို — သူတို့ရဲ့ control files တွေမှာ schema မသတ်မှတ်ထားတဲ့ — လိုအပ်နေတဲ့ extensions တွေကို install လုပ်တဲ့အခါ သုံးပါလိမ့်မယ်။
Extension ကိုယ်တိုင်က schema တစ်ခုခုအတွင်းမှာ ရှိတယ်လို့ မယူဆဘူးဆိုတာ သတိရပါ: extensions တွေမှာ — database တစ်ခုလုံးအတွက် unique ဖြစ်ရမယ့် — schema မပါတဲ့ (unqualified) နာမည်တွေ ရှိပါတယ်။ ဒါပေမယ့် — extension နဲ့ သက်ဆိုင်တဲ့ objects တွေကတော့ schemas တွေအတွင်းမှာ ရှိနိုင်ပါတယ်။
- **version** — Install လုပ်ရမယ့် extension ရဲ့ version ဖြစ်ပါတယ်။ ဒါကို identifier တစ်ခုအနေနဲ့ ဖြစ်စေ — string literal တစ်ခုအနေနဲ့ ဖြစ်စေ ရေးနိုင်ပါတယ်။ Default version ကတော့ — extension ရဲ့ control file ထဲမှာ သတ်မှတ်ထားတဲ့အတိုင်း ဖြစ်ပါတယ်။
- **CASCADE** — ဒီ extension မှီခိုနေပြီး — install လုပ်ပြီးသား မဖြစ်သေးတဲ့ — extensions တွေကို အလိုအလျောက် install လုပ်ပါတယ်။ သူတို့ရဲ့ မှီခိုမှုတွေကိုလည်း — အလားတူပဲ — recurse (ဆင့်ပွား ဆက်လုပ်) လုပ်ပြီး အလိုအလျောက် install လုပ်ပါတယ်။ SCHEMA clause ကို ပေးထားမယ်ဆိုရင် — ဒီနည်းနဲ့ install လုပ်ခံရတဲ့ extensions အားလုံးကို သက်ရောက်ပါတယ်။ Statement ရဲ့ တခြား options တွေကိုတော့ — အလိုအလျောက် install လုပ်တဲ့ extensions တွေအပေါ် သက်ရောက်မှု မရှိပါဘူး; အထူးသဖြင့် — သူတို့ရဲ့ default versions တွေကို အမြဲတမ်း ရွေးချယ်ပါတယ်။

## Notes (မှတ်စုများ)

`CREATE EXTENSION` ကို သုံးပြီး extension တစ်ခုကို database တစ်ခုထဲ load လုပ်နိုင်ဖို့ မတိုင်ခင် — extension ရဲ့ ထောက်ပံ့ပေးတဲ့ files (supporting files) တွေ install လုပ်ပြီးသား ဖြစ်ရပါမယ်။ PostgreSQL နဲ့အတူ ပံ့ပိုးပေးထားတဲ့ extensions တွေကို install လုပ်ခြင်းအကြောင်း အချက်အလက်တွေကို [နောက်ဆက်တွဲ F](https://www.postgresql.org/docs/current/contrib.html) မှာ တွေ့နိုင်ပါတယ်။

လက်ရှိ load လုပ်ဖို့ ရရှိနိုင်တဲ့ extensions တွေကို — [`pg_available_extensions`](https://www.postgresql.org/docs/current/view-pg-available-extensions.html) သို့မဟုတ် [`pg_available_extension_versions`](https://www.postgresql.org/docs/current/view-pg-available-extension-versions.html) system views တွေကနေ ဖော်ထုတ်နိုင်ပါတယ်။

> **သတိပြုရန်:** Superuser အနေနဲ့ extension တစ်ခုကို install လုပ်တာက — extension ရဲ့ author က extension installation script ကို လုံခြုံတဲ့ ပုံစံနဲ့ ရေးသားခဲ့တယ်လို့ ယုံကြည်ဖို့ လိုအပ်ပါတယ်။ ရန်လိုတဲ့ (malicious) user တစ်ယောက်အနေနဲ့ — ပေါ့ဆစွာ ရေးသားထားတဲ့ extension script တစ်ခုရဲ့ နောက်ပိုင်း လုပ်ဆောင်မှုကို ထိခိုက်စေနိုင်တဲ့ — trojan-horse objects (မြင်းတံခါးဝ ပုံစံ အန္တရာယ်ရှိ objects) တွေကို ဖန်တီးဖို့ဆိုတာ သိပ်မခက်ခဲပါဘူး — အဲဒါက အဲဒီ user ကို superuser privileges တွေ ရယူနိုင်စေပါတယ်။ ဒါပေမယ့် — trojan-horse objects တွေက script လုပ်ဆောင်နေစဉ်အတွင်း — သူတို့က `search_path` ထဲမှာ ရှိနေမှသာလျှင် — ဆိုလိုတာက — သူတို့က extension ရဲ့ installation target schema ထဲမှာ သို့မဟုတ် — သူ မှီခိုနေတဲ့ extension တစ်ခုခုရဲ့ schema ထဲမှာ ရှိနေမှသာလျှင် — အန္တရာယ် ရှိပါတယ်။ ဒါကြောင့် — scripts တွေကို ဂရုတစိုက် စိစစ်ပြီး မဖြစ်သေးတဲ့ extensions တွေနဲ့ ဆက်ဆံရာမှာ ကောင်းတဲ့ စည်းမျဉ်းတစ်ခုကတော့ — CREATE privilege ကို မယုံကြည်ရတဲ့ (untrusted) users တွေကို ပေးထားခြင်း မရှိသေးတဲ့၊ နောင်လည်း ပေးမှာ မဟုတ်တဲ့ — schemas တွေထဲမှာသာ သူတို့ကို install လုပ်ဖို့ ဖြစ်ပါတယ်။ သူတို့ မှီခိုနေတဲ့ extensions တွေအတွက်လည်း အလားတူပါပဲ။
> 
> PostgreSQL နဲ့အတူ ပံ့ပိုးပေးထားတဲ့ extensions တွေကတော့ — တခြား extensions တွေကို မှီခိုနေတဲ့ အနည်းငယ် ကလွဲပြီး — ဒီလို installation-time attacks (install လုပ်ချိန် တိုက်ခိုက်မှု) မျိုးတွေကို ခံနိုင်ရည်ရှိတယ်လို့ ယူဆရပါတယ်။ အဲဒီ extensions တွေရဲ့ documentation တွေမှာ ဖော်ပြထားသလို — သူတို့ကို secure schemas (လုံခြုံသော schemas) တွေထဲမှာ install လုပ်သင့်ပြီး — သို့မဟုတ် — သူတို့ မှီခိုနေတဲ့ extensions တွေ ရှိနေတဲ့ schemas တွေထဲမှာပဲ install လုပ်သင့်ပါတယ် — သို့မဟုတ် — နှစ်မျိုးလုံး ပြုလုပ်သင့်ပါတယ်။

Extension အသစ်တွေ ရေးသားခြင်းအကြောင်း အချက်အလက်တွေအတွက် [အပိုင်း 36.17](https://www.postgresql.org/docs/current/extend-extensions.html) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

လက်ရှိ database ထဲသို့ [hstore](https://www.postgresql.org/docs/current/hstore.html) extension ကို — ၎င်းရဲ့ objects တွေကို `addons` schema ထဲမှာ နေရာချထားပြီး — install လုပ်ဖို့:

```sql
CREATE EXTENSION hstore SCHEMA addons;
```

အလားတူ ရလဒ်ကို ရရှိဖို့ နောက်ထပ် နည်းလမ်းတစ်ခု:

```sql
SET search_path = addons;
CREATE EXTENSION hstore;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE EXTENSION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER EXTENSION](/docs/postgresql/sql-alterextension), [DROP EXTENSION](/docs/postgresql/sql-dropextension)
