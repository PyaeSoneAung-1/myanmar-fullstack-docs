---
title: "Authentication Methods (authentication နည်းလမ်းများ)"
description: "PostgreSQL က user တွေကို authenticate လုပ်ဖို့ ထောက်ပံ့ပေးတဲ့ နည်းလမ်း အမျိုးမျိုး — trust, password, GSSAPI, SSPI, ident, peer, LDAP, RADIUS, certificate, PAM, BSD နဲ့ OAuth — တို့ရဲ့ တစ်ခုချင်းစီ အလုပ်လုပ်ပုံ အကျဉ်းချုပ် မိတ်ဆက်"
order: 142
source: "https://www.postgresql.org/docs/current/auth-methods.html"
status: translated
updated: 2026-09-06
---

## 20.3. Authentication Methods (authentication နည်းလမ်းများ)

PostgreSQL က user တွေကို authenticate လုပ်ဖို့ နည်းလမ်း အမျိုးမျိုး ထောက်ပံ့ပေးပါတယ်:

- Trust authentication — user တွေက သူတို့ ပြောဆိုထားတဲ့အတိုင်း ဖြစ်တယ်လို့ ရိုးရိုးရှင်းရှင်း ယုံကြည်လိုက်တဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- Password authentication — user တွေက password တစ်ခု ပို့ပေးဖို့ လိုအပ်တဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- GSSAPI authentication — GSSAPI နဲ့ လိုက်ဖက်ညီတဲ့ security library တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် — Kerberos ဒါမှမဟုတ် Microsoft Active Directory server လို authentication server တစ်ခုကို ဝင်ရောက်ဖို့ သုံးပါတယ်။
- SSPI authentication — GSSAPI နဲ့ ဆင်တူတဲ့ Windows-သီးသန့် protocol တစ်ခုကို သုံးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- Ident authentication — client ရဲ့ machine ပေါ်က “Identification Protocol” (RFC 1413) service တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။ (Local Unix-socket connections တွေမှာတော့ — ဒါကို peer authentication အဖြစ် သတ်မှတ်ပါတယ်။)
- Peer authentication — local connection တစ်ခုရဲ့ အခြားတစ်ဖက်က process ကို ဖော်ထုတ်ဖို့ operating system ရဲ့ စွမ်းဆောင်ချက်တွေကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။ ဒါက remote connections တွေအတွက်တော့ ထောက်ပံ့မထားပါဘူး။
- LDAP authentication — LDAP authentication server တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- RADIUS authentication — RADIUS authentication server တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- Certificate authentication — SSL connection တစ်ခု လိုအပ်ပြီး — user တွေ ပို့လိုက်တဲ့ SSL certificate ကို စစ်ဆေးခြင်းအားဖြင့် user တွေကို authenticate လုပ်တဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- PAM authentication — PAM (Pluggable Authentication Modules) library တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
- BSD authentication — BSD Authentication framework ကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ် (လောလောဆယ် OpenBSD မှာပဲ ရနိုင်ပါတယ်)။
- OAuth authorization/authentication — external OAuth 2.0 identity provider (ပြင်ပ OAuth 2.0 သက်သေခံ ပေးသွင်းသူ) တစ်ခုကို အားကိုးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။

Peer authentication က local connections တွေအတွက် များသောအားဖြင့် အကြံပြုထိုက်ပြီး — trust authentication ကတော့ အခြေအနေ တချို့မှာ လုံလောက်နိုင်ပါတယ်။ Password authentication ကတော့ remote connections တွေအတွက် အလွယ်ကူဆုံး ရွေးချယ်မှု ဖြစ်ပါတယ်။ ကျန် option တွေ အားလုံးက — external security infrastructure (ပြင်ပ လုံခြုံရေး အခြေခံ အဆောက်အအုံ) တစ်မျိုးမျိုး (များသောအားဖြင့် authentication server တစ်ခု ဒါမှမဟုတ် SSL certificates တွေ ထုတ်ပေးဖို့ certificate authority တစ်ခု) လိုအပ်ပါတယ် — ဒါမှမဟုတ် — platform-သီးသန့် ဖြစ်နေပါတယ်။

အောက်က section တွေမှာ ဒီ authentication method တစ်ခုချင်းစီအကြောင်း ပိုပြီး အသေးစိတ် ဖော်ပြထားပါတယ်။
