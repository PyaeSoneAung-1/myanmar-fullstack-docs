---
title: "OAuth Authorization/Authentication (OAuth ဖြင့် ခွင့်ပြုချက်/အထောက်အထား စိစစ်ခြင်း)"
description: "PostgreSQL cluster များဆီ OAuth 2.0 ဖြင့် ချိတ်ဆက်၍ ခွင့်ပြုချက် ရယူခြင်းနှင့် အထောက်အထား စိစစ်ခြင်း — OAuth terminology (Resource Owner, Client, Resource Server, Provider, Authorization Server, Issuer) များနှင့် issuer/scope/validator/map/delegate_ident_mapping configuration options များအကြောင်း"
order: 170
source: "https://www.postgresql.org/docs/current/auth-oauth.html"
status: translated
updated: 2026-09-06
---

## 20.15. OAuth Authorization/Authentication (OAuth ဖြင့် ခွင့်ပြုချက်/အထောက်အထား စိစစ်ခြင်း)

OAuth 2.0 က [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) မှာ သတ်မှတ်ထားတဲ့ — third-party applications တွေ ကာကွယ်ထားတဲ့ resource (အရင်းအမြစ်) တစ်ခုကို အကန့်အသတ်နဲ့ ဝင်ရောက်ခွင့် ရယူနိုင်စေဖို့ — စက်မှုလုပ်ငန်း စံနှုန်း (industry-standard) framework တစ်ခုပါ။ OAuth client support ကို PostgreSQL ကို build လုပ်တဲ့အခါ enable လုပ်ထားရပါမယ် — [အခန်း 17](https://www.postgresql.org/docs/current/installation.html) မှာ ပိုမို သိရှိနိုင်ပါတယ်။

ဒီ documentation က OAuth ecosystem (ဂေဟစနစ်) အကြောင်း ဆွေးနွေးတဲ့အခါ အောက်ပါ terminology (ဝေါဟာရများ) တွေကို သုံးပါတယ်:

- **Resource Owner (or End User)** — ကာကွယ်ထားတဲ့ resources တွေကို ပိုင်ဆိုင်ပြီး — အဲဒါတွေကို access ခွင့်ပြုပေးနိုင်တဲ့ user ဒါမှမဟုတ် system ပါ။ Resource owner က လူတစ်ယောက် ဖြစ်ရင် ဒီ documentation က end user ဆိုတဲ့ ဝေါဟာရကိုလည်း သုံးပါတယ်။ OAuth ကို သုံးပြီး psql နဲ့ database ဆီ connect လုပ်တဲ့အခါ — သင်က resource owner/end user ပဲ ဖြစ်ပါတယ်။
- **Client** — access tokens (ဝင်ရောက်ခွင့် token များ) ကို သုံးပြီး ကာကွယ်ထားတဲ့ resources တွေကို ဝင်ရောက် သုံးစွဲတဲ့ system ပါ။ libpq ကို သုံးတဲ့ psql လို applications တွေက — PostgreSQL cluster တစ်ခုဆီ connect လုပ်တဲ့အခါ OAuth clients တွေ ဖြစ်ပါတယ်။
- **Resource Server** — client က ဝင်ရောက် သုံးစွဲတဲ့ ကာကွယ်ထားတဲ့ resources တွေကို လက်ခံ ထားရှိတဲ့ (hosting) system ပါ။ Connect လုပ်ခံနေရတဲ့ PostgreSQL cluster က resource server ပဲ ဖြစ်ပါတယ်။
- **Provider** — ပေးထားတဲ့ application တစ်ခုအတွက် OAuth authorization servers တွေနဲ့ clients တွေကို တီထွင်ဖန်တီး နဲ့/သို့မဟုတ် စီမံခန့်ခွဲပေးတဲ့ organization (အဖွဲ့အစည်း), product vendor (ထုတ်ကုန် ရောင်းချသူ) ဒါမှမဟုတ် တခြား entity တစ်ခုပါ။ Provider မတူညီကြရင် သူတို့ရဲ့ OAuth systems တွေအတွက် implementation အသေးစိတ်တွေ မတူညီကြတတ်ပါတယ်; provider တစ်ခုရဲ့ client တစ်ခုက — တခြား provider တစ်ခုရဲ့ servers တွေဆီ access ရှိမယ်လို့ ယေဘုယျအားဖြင့် အာမခံထားတာ မဟုတ်ပါဘူး။

“provider” ဆိုတဲ့ ဝေါဟာရ အသုံးပြုမှုက standard မဟုတ်ပေမယ့် — နေ့စဉ် ပြောဆိုမှုတွေမှာတော့ ကျယ်ကျယ်ပြန့်ပြန့် သုံးနေပုံ ရပါတယ်။ (ဒါကို OpenID ရဲ့ အလားတူ ဝေါဟာရ ဖြစ်တဲ့ “Identity Provider” နဲ့ မရောထွေးသင့်ပါဘူး။ PostgreSQL ထဲက OAuth implementation က OpenID Connect/OIDC နဲ့ အပြန်အလှန် လုပ်ဆောင်နိုင်အောင် (interoperable) နဲ့ လိုက်ဖက်ညီအောင် (compatible) ရည်ရွယ်ထားပေမယ့် — သူ့ဟာသူ OIDC client တစ်ခု မဟုတ်သလို — သူ့ကို သုံးဖို့လည်း မလိုအပ်ပါဘူး။)
- **Authorization Server** — authenticated လုပ်ပြီးသား resource owner က အတည်ပြု ခွင့်ပြုပြီးနောက်မှာ — client ဆီကနေ requests တွေကို လက်ခံပြီး — client ကို access tokens တွေ ထုတ်ပေးတဲ့ system ပါ။ PostgreSQL က authorization server တစ်ခုကို မပေးပါဘူး; အဲဒါ OAuth provider ရဲ့ တာဝန်ပဲ ဖြစ်ပါတယ်။
- **Issuer** — authorization server တစ်ခုအတွက် — https:// URL ပုံစံနဲ့ ဖော်ပြထားတဲ့ — OAuth clients တွေနဲ့ applications တွေအတွက် ယုံကြည်စိတ်ချရတဲ့ “namespace” (နေရာ သတ်မှတ်ချက်) တစ်ခု ပေးတဲ့ identifier (အမှတ်အသား) တစ်ခုပါ။ Issuer identifier က authorization server တစ်ခုတည်းကို — တစ်ဦးနဲ့တစ်ဦး အပြန်အလှန် မယုံကြည်ကြတဲ့ entities တွေရဲ့ clients တွေနဲ့ — သူတို့က issuer တွေ သီးခြားစီ ထိန်းသိမ်းထားသရွေ့ — ဆက်သွယ်ပြောဆိုခွင့် ပေးပါတယ်။

> **မှတ်ချက်:** သေးငယ်တဲ့ deployments (ဖြန့်ကျက် တပ်ဆင်မှုများ) တွေအတွက်တော့ — “provider”, “authorization server” နဲ့ “issuer” ကြားမှာ အဓိပ္ပာယ် ရှိတဲ့ ကွဲပြားမှု မရှိနိုင်ပါဘူး။ ဒါပေမယ့် ပိုရှုပ်ထွေးတဲ့ တပ်ဆင်မှုတွေမှာတော့ — one-to-many (တစ်ခုနှင့် အများ) (သို့မဟုတ် many-to-many (အများနှင့် အများ)) ဆက်စပ်မှု ရှိနိုင်ပါတယ်: provider တစ်ခုက tenant အများအပြားကို issuer identifier အများအပြား ငှားရမ်းပေးပြီး — သူတို့ရဲ့ clients တွေနဲ့ အပြန်အလှန် ဆောင်ရွက်ဖို့ — ထောက်ပံ့တဲ့ feature sets တွေ ကွဲပြားနိုင်တဲ့ authorization servers အများအပြားကိုလည်း ပေးနိုင်ပါတယ်။

PostgreSQL က [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) မှာ သတ်မှတ်ထားတဲ့ bearer tokens တွေကို ထောက်ပံ့ပါတယ် — ဒါတွေက OAuth 2.0 မှာ သုံးတဲ့ access token အမျိုးအစား တစ်ခု ဖြစ်ပြီး — token က opaque string (ဖတ်၍ မရသော string) တစ်ခု ဖြစ်ပါတယ်။ Access token ရဲ့ ပုံစံက implementation အလိုက် သတ်မှတ်ပြီး — authorization server တစ်ခုချင်းစီက ရွေးချယ်ပါတယ်။

OAuth အတွက် အောက်ပါ configuration options တွေကို ထောက်ပံ့ပါတယ်:

- **issuer** — authorization server ရဲ့ — သူ့ရဲ့ discovery document (ရှာဖွေ တွေ့ရှိမှု မှတ်တမ်း) အရ — တိကျတဲ့ issuer identifier ဖြစ်တဲ့ HTTPS URL တစ်ခု ဒါမှမဟုတ် အဲဒီ discovery document ကို တိုက်ရိုက် ညွှန်ပြတဲ့ well-known URI (လူသိများသော URI) တစ်ခု ဖြစ်ပါတယ်။ ဒီ parameter က မဖြစ်မနေ လိုအပ်ပါတယ်။

OAuth client တစ်ခု server ဆီ connect လုပ်တဲ့အခါ — issuer identifier ကို သုံးပြီး discovery document အတွက် URL တစ်ခုကို တည်ဆောက်ပါလိမ့်မယ်။ Default အနေနဲ့ ဒီ URL က OpenID Connect Discovery ရဲ့ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်: issuer identifier ရဲ့ အဆုံးမှာ /.well-known/openid-configuration ဆိုတဲ့ path ကို ပေါင်းထည့်ပါလိမ့်မယ်။ တနည်းအားဖြင့် — issuer ထဲမှာ /.well-known/ path segment တစ်ခု ပါရင် — အဲဒီ URL ကို client ဆီ မပြောင်းလဲဘဲ (as-is) ပေးပါလိမ့်မယ်။

> **သတိပေးချက်:** libpq ထဲက OAuth client က server ရဲ့ issuer setting က discovery document ထဲမှာ ပေးထားတဲ့ issuer identifier နဲ့ အတိအကျ ကိုက်ညီဖို့ လိုအပ်ပြီး — အဲဒီ identifier ကလည်း client ရဲ့ oauth_issuer setting နဲ့ ကိုက်ညီရပါမယ်။ Case (စာလုံး အကြီးအသေး) ဒါမှမဟုတ် ပုံစံချမှု (formatting) မှာ ကွဲလွဲမှု ဘာမှ ခွင့်မပြုပါဘူး။

- **scope** — server က client ကို authorize (ခွင့်ပြုချက် ပေး) ဖို့ရော user ကို authenticate (အထောက်အထား စိစစ်) ဖို့ပါ လိုအပ်တဲ့ OAuth scopes တွေရဲ့ space နဲ့ ခွဲထားတဲ့ စာရင်း တစ်ခုပါ။ သင့်လျော်တဲ့ တန်ဖိုးတွေကို authorization server ရော သုံးထားတဲ့ OAuth validation module ကပါ ဆုံးဖြတ်ပါတယ် (validators အကြောင်း ပိုမို သိရှိရန် အခန်း 50 ကို ကြည့်ပါ)။ ဒီ parameter က မဖြစ်မနေ လိုအပ်ပါတယ်။
- **validator** — bearer tokens တွေကို validate (စစ်ဆေး အတည်ပြု) လုပ်ဖို့ သုံးမယ့် library ပါ။ ပေးထားရင် — နာမည်က oauth_validator_libraries ထဲမှာ စာရင်းပြုထားတဲ့ libraries တွေထဲက တစ်ခုနဲ့ အတိအကျ ကိုက်ညီရပါမယ်။ ဒီ parameter က optional ဖြစ်ပြီး — oauth_validator_libraries ထဲမှာ library တစ်ခုထက်ပိုပြီး ပါနေရင်တော့ မဖြစ်မနေ လိုအပ်ပါတယ်။
- **map** — OAuth identity provider နဲ့ database user names တွေကြားမှာ mapping (ချိတ်ဆက် သတ်မှတ်ခြင်း) လုပ်ခွင့် ပေးပါတယ်။ အသေးစိတ်အတွက် အပိုင်း 20.2 ကို ကြည့်ပါ။ Map တစ်ခု သတ်မှတ်မထားရင် — token နဲ့ ဆက်စပ်နေတဲ့ user name (OAuth validator က ဆုံးဖြတ်တဲ့အတိုင်း) က တောင်းဆိုနေတဲ့ role name နဲ့ အတိအကျ ကိုက်ညီရပါမယ်။ ဒီ parameter က optional ဖြစ်ပါတယ်။
- **delegate_ident_mapping** — သာမန် အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်တဲ့ အဆင့်မြင့် (advanced) option တစ်ခုပါ။

1 လို့ သတ်မှတ်ထားရင် — pg_ident.conf နဲ့ လုပ်ဆောင်တဲ့ ပုံမှန် user mapping ကို ကျော်သွားပြီး — OAuth validator က end user identities တွေကို database roles တွေဆီ mapping လုပ်တဲ့ တာဝန် အပြည့်အဝ ယူပါတယ်။ Validator က token ကို authorize လုပ်ရင် — server က user ကို တောင်းဆိုထားတဲ့ role အောက်မှာ connect လုပ်ခွင့် ရှိတယ်လို့ ယုံကြည်ပြီး — user ရဲ့ authentication အခြေအနေ ဘယ်လိုပဲ ရှိရှိ — connection ကို ဆက်လုပ်ခွင့် ပြုပါတယ်။

ဒီ parameter က map နဲ့ လိုက်ဖက်မှု မရှိပါဘူး (incompatible)။

> **သတိပေးချက်:** delegate_ident_mapping က authentication system ရဲ့ ဒီဇိုင်းမှာ ထပ်ဆောင်း ပြောင်းလွယ်မှု (additional flexibility) ပေးပေမယ့် — OAuth validator ကို ဂရုတစိုက် implement လုပ်ဖို့လည်း လိုအပ်ပါတယ် — validator က ပေးထားတဲ့ token မှာ — validator အားလုံးဆီမှာ လိုအပ်တဲ့ standard checks တွေအပြင် — လုံလောက်တဲ့ end-user privileges တွေ ပါဝင်မလဲဆိုတာကိုပါ ဆုံးဖြတ်ရမှာ ဖြစ်လို့ပါ။ သတိနဲ့ သုံးပါ။
