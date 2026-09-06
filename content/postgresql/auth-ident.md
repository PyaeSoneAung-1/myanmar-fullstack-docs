---
title: "Ident Authentication (ident server မှ OS user name ရယူ၍ အထောက်အထား စိစစ်ခြင်း)"
description: "ident server မှ client ၏ operating system user name ကို ရယူပြီး ထို user name ကို database user name အဖြစ် ခွင့်ပြုသည့် `ident` authentication method — TCP/IP connections များတွင်သာ ထောက်ပံ့ခြင်း၊ map option နှင့် လုံခြုံရေး ကန့်သတ်ချက်များ"
order: 159
source: "https://www.postgresql.org/docs/current/auth-ident.html"
status: translated
updated: 2026-09-06
---

## 20.8. Ident Authentication (ident server မှ OS user name ရယူ၍ အထောက်အထား စိစစ်ခြင်း)

`ident` authentication method (အထောက်အထား စိစစ်ခြင်း နည်းလမ်း) က — ident server တစ်ခုဆီကနေ client ရဲ့ operating system user name (လည်ပတ်စနစ် အသုံးပြုသူ အမည်) ကို ရယူပြီး — (optional ဖြစ်တဲ့ user name mapping နဲ့အတူ) — အဲဒီ user name ကို ခွင့်ပြုထားတဲ့ database user name အဖြစ် သုံးတာပါ။ ဒီနည်းလမ်းကို TCP/IP connections တွေမှာပဲ ထောက်ပံ့ပါတယ်။

> **မှတ်ချက်:** local (non-TCP/IP) connection တစ်ခုအတွက် ident ကို သတ်မှတ်ထားရင် — [အပိုင်း 20.9](/docs/postgresql/auth-peer) မှာ ဖော်ပြထားတဲ့ peer authentication ကို အဲဒီအစား သုံးပါလိမ့်မယ်။

`ident` အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **map** — system နဲ့ database user names တွေကြားမှာ mapping (ချိတ်ဆက် သတ်မှတ်ခြင်း) လုပ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။

“Identification Protocol” ကို [RFC 1413](https://datatracker.ietf.org/doc/html/rfc1413) မှာ ဖော်ပြထားပါတယ်။ Unix နဲ့ ဆင်တူတဲ့ operating system တိုင်းနီးပါးမှာ — default အနေနဲ့ TCP port 113 မှာ နားထောင်နေတဲ့ ident server တစ်ခု ပါဝင်ပါတယ်။ ident server တစ်ခုရဲ့ အခြေခံ လုပ်ဆောင်ချက်က — “မင်းရဲ့ port X ကနေ ထွက်ပြီး ငါ့ရဲ့ port Y ကို ဆက်သွယ်နေတဲ့ connection ကို ဘယ် user က စတင်ခဲ့တာလဲ?” ဆိုတဲ့ မေးခွန်းမျိုးတွေကို ဖြေဆိုပေးတာပါ။ PostgreSQL က physical connection တစ်ခု တည်ဆောက်ပြီးတဲ့အခါ `X` ရော `Y` ရောကို သိပြီးသား ဖြစ်လို့ — connection ဝင်လာတဲ့ client ရဲ့ host ပေါ်က ident server ကို စစ်မေးနိုင်ပြီး — ပေးထားတဲ့ connection တစ်ခုခုအတွက် operating system user ကို သီအိုရီအရ (theoretically) ဆုံးဖြတ်နိုင်ပါတယ်။

ဒီလုပ်ထုံးလုပ်နည်းရဲ့ အားနည်းချက်က — ဒါဟာ client ရဲ့ ခိုင်မာမှု (integrity) အပေါ် မူတည်နေတာပါ: client machine က ယုံကြည်စိတ်ချရမှု မရှိဘူး ဒါမှမဟုတ် အပေးအယူ လုပ်ခံထားရတယ်ဆိုရင် — attacker (တိုက်ခိုက်သူ) တစ်ယောက်က port 113 မှာ ဘယ် program မဆို run လုပ်ပြီး — သူ ရွေးချယ်လိုက်တဲ့ user name ဘယ်ဟာကိုမဆို ပြန်ပေးနိုင်ပါတယ်။ ဒါကြောင့် ဒီ authentication method က — client machine တစ်ခုချင်းစီကို တင်းကြပ်စွာ ထိန်းချုပ်ထားပြီး — database နဲ့ system administrators တွေ နီးကပ်စွာ ပူးပေါင်း ဆောင်ရွက်နေတဲ့ — closed networks (ပိတ်ထားသော ကွန်ရက်များ) အတွက်ပဲ သင့်လျော်ပါတယ်။ တနည်းပြောရရင် — ident server ကို run နေတဲ့ machine ကို သင်က ယုံကြည်ရပါမယ်။ ဒီသတိပေးချက်ကို လိုက်နာပါ:

|  | The Identification Protocol က authorization (ခွင့်ပြုချက် ပေးခြင်း) သို့မဟုတ် access control protocol (ဝင်ရောက်ခွင့် ထိန်းချုပ်ရေး protocol) အဖြစ် ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ |  |
| --- | --- | --- |
|  | --RFC 1413 |  |

ident server တချို့မှာ — ပြန်ပေးတဲ့ user name ကို — မူရင်း machine ရဲ့ administrator သာသိတဲ့ key တစ်ခုနဲ့ — encrypt (ကုဒ်ဝှက်) လုပ်ပေးစေတဲ့ nonstandard option တစ်ခု ရှိပါတယ်။ PostgreSQL နဲ့ ident server ကို သုံးတဲ့အခါ ဒီ option ကို မသုံးရပါဘူး — အကြောင်းကတော့ PostgreSQL မှာ — တကယ့် user name ကို ဆုံးဖြတ်ဖို့ ပြန်ပေးလာတဲ့ string ကို decrypt (ကုဒ်ဖြေ) လုပ်ဖို့ နည်းလမ်း ဘာမှ မရှိလို့ပါ။
