---
title: "LDAP Authentication (LDAP ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)"
description: "LDAP ကို password စစ်ဆေး အတည်ပြုရေး နည်းလမ်းအဖြစ် သုံးသည့် `ldap` authentication method — simple bind mode နှင့် search+bind mode နှစ်မျိုး၊ ldapserver/ldapport/ldapscheme/ldaptls/ldapbasedn/ldapurl စသည့် configuration options များ နှင့် ဥပမာ ဖွဲ့စည်းပုံများ"
order: 165
source: "https://www.postgresql.org/docs/current/auth-ldap.html"
status: translated
updated: 2026-09-06
---

## 20.10. LDAP Authentication (LDAP ဖြင့် password စစ်ဆေး၍ အထောက်အထား စိစစ်ခြင်း)

ဒီ authentication method က `password` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် password ကို စစ်ဆေး အတည်ပြုတဲ့ နည်းလမ်းအဖြစ် LDAP ကို သုံးတာ ကွာပါတယ်။ LDAP ကို user name/password အတွဲတွေကို စစ်ဆေး အတည်ပြုဖို့ပဲ သုံးပါတယ်။ ဒါကြောင့် LDAP ကို authentication အတွက် မသုံးခင် — user က database ထဲမှာ အရင်ကတည်းက ရှိပြီးသား ဖြစ်ရပါမယ်။

LDAP authentication က mode နှစ်မျိုးနဲ့ အလုပ်လုပ်နိုင်ပါတယ်။ ပထမ mode — simple bind mode လို့ ခေါ်ပါမယ် — မှာ server က `prefix` `username` `suffix` တွေ ပေါင်းစပ်ပြီး တည်ဆောက်ထားတဲ့ distinguished name (DN — LDAP directory ထဲက entry တစ်ခုကို ထူးခြားစွာ ခွဲခြား သတ်မှတ်ပေးသော အမည်) ဆီ bind (ချိတ်ဆက်) လုပ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် `prefix` parameter ကို Active Directory environment တစ်ခုမှာ `cn=` ဒါမှမဟုတ် `DOMAIN\` ကို သတ်မှတ်ဖို့ သုံးပြီး — `suffix` ကိုတော့ Active Directory မဟုတ်တဲ့ environment တစ်ခုမှာ DN ရဲ့ ကျန် အစိတ်အပိုင်းကို သတ်မှတ်ဖို့ သုံးပါတယ်။

ဒုတိယ mode — search+bind mode လို့ ခေါ်ပါမယ် — မှာတော့ server က ဦးစွာ — `ldapbinddn` နဲ့ `ldapbindpasswd` နဲ့ သတ်မှတ်ထားတဲ့ — fixed user name နဲ့ password တစ်ခုနဲ့ LDAP directory ဆီ bind လုပ်ပြီး — database ထဲ log in လုပ်ဖို့ ကြိုးစားနေတဲ့ user အတွက် search (ရှာဖွေ) လုပ်ပါတယ်။ User နဲ့ password ကို configure မလုပ်ထားဘူးဆိုရင် — directory ဆီ anonymous bind ကို ကြိုးစားပါလိမ့်မယ်။ Search ကို `ldapbasedn` မှာရှိတဲ့ subtree (သစ်ပင် အကိုင်းခွဲ) အပေါ်မှာ လုပ်ပြီး — `ldapsearchattribute` မှာ သတ်မှတ်ထားတဲ့ attribute နဲ့ အတိအကျ (exactly) တိုက်စစ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒီ search ထဲမှာ user ကို တွေ့ပြီဆိုတာနဲ့ — server က — login မှန်ကန်ကြောင်း စစ်ဆေးဖို့ — client က ပေးထားတဲ့ password ကို သုံးပြီး — ဒီ user အနေနဲ့ directory ဆီ ပြန် bind လုပ်ပါတယ်။ ဒီ mode က Apache `mod_authnz_ldap` နဲ့ `pam_ldap` လို — တခြား software တွေထဲက LDAP authentication schemes တွေ သုံးတဲ့ ပုံစံနဲ့ အတူတူပါပဲ။ ဒီနည်းလမ်းက — directory ထဲမှာ user objects တွေ ဘယ်မှာ ရှိမလဲဆိုတာအပေါ် သိသိသာသာ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် (flexible) ဖြစ်စေပေမယ့် — LDAP server ဆီကို ထပ်ဆောင်း request နှစ်ခု ပိုပြီး ပို့လွှတ်စေပါတယ်။

အောက်ပါ configuration options တွေကို mode နှစ်မျိုးလုံးမှာ သုံးပါတယ်:

- **ldapserver** — ဆက်သွယ်ရမယ့် LDAP servers တွေရဲ့ names (အမည်များ) သို့မဟုတ် IP addresses တွေ ဖြစ်ပါတယ်။ Server အများအပြားကို space တွေနဲ့ ခွဲခြားပြီး သတ်မှတ်လို့ရပါတယ်။
- **ldapport** — ဆက်သွယ်ရမယ့် LDAP server ပေါ်က port number ပါ။ Port ကို မသတ်မှတ်ထားရင် — LDAP library ရဲ့ default port setting ကို သုံးပါလိမ့်မယ်။
- **ldapscheme** — LDAPS ကို သုံးဖို့ ldaps လို့ သတ်မှတ်ပါ။ ဒါက — LDAP server implementations တချို့က ထောက်ပံ့တဲ့ — SSL ပေါ်မှာ LDAP သုံးတဲ့ non-standard နည်းလမ်း တစ်ခုပါ။ အခြား ရွေးချယ်စရာအတွက် ldaptls option ကိုလည်း ကြည့်ပါ။
- **ldaptls** — PostgreSQL နဲ့ LDAP server ကြားက connection က TLS encryption သုံးဖို့ 1 လို့ သတ်မှတ်ပါ။ ဒါက RFC 4513 အရ StartTLS operation ကို သုံးပါတယ်။ အခြား ရွေးချယ်စရာအတွက် ldapscheme option ကိုလည်း ကြည့်ပါ။

`ldapscheme` ဒါမှမဟုတ် `ldaptls` ကို သုံးတာက — PostgreSQL server နဲ့ LDAP server ကြားက traffic ကိုပဲ encrypt လုပ်ပေးတာ သတိပြုပါ။ PostgreSQL server နဲ့ PostgreSQL client ကြားက connection ကတော့ — အဲဒီမှာပါ SSL မသုံးထားရင် — encrypt မလုပ်ရသေးဘဲ ရှိနေဦးမှာ ဖြစ်ပါတယ်။

အောက်ပါ options တွေကို simple bind mode မှာပဲ သုံးပါတယ်:

- **ldapprefix** — Simple bind authentication လုပ်တဲ့အခါ — bind လုပ်ရမယ့် DN ကို ဖွဲ့စည်းရာမှာ user name ရဲ့ ရှေ့မှာ ထည့်သွင်းရမယ့် string ပါ။
- **ldapsuffix** — Simple bind authentication လုပ်တဲ့အခါ — bind လုပ်ရမယ့် DN ကို ဖွဲ့စည်းရာမှာ user name ရဲ့ နောက်မှာ ထည့်သွင်းရမယ့် string ပါ။

အောက်ပါ options တွေကို search+bind mode မှာပဲ သုံးပါတယ်:

- **ldapbasedn** — Search+bind authentication လုပ်တဲ့အခါ — user အတွက် search စတင်ရမယ့် root DN ပါ။
- **ldapbinddn** — Search+bind authentication လုပ်တဲ့အခါ — search လုပ်ဖို့ directory ဆီ bind လုပ်ရမယ့် user ရဲ့ DN ပါ။
- **ldapbindpasswd** — Search+bind authentication လုပ်တဲ့အခါ — search လုပ်ဖို့ directory ဆီ bind လုပ်ရမယ့် user ရဲ့ password ပါ။
- **ldapsearchattribute** — Search+bind authentication လုပ်တဲ့အခါ — search ထဲမှာ user name နဲ့ တိုက်စစ်ရမယ့် attribute ပါ။ Attribute ကို မသတ်မှတ်ထားရင် — uid attribute ကို သုံးပါလိမ့်မယ်။
- **ldapsearchfilter** — Search+bind authentication လုပ်တဲ့အခါ သုံးရမယ့် search filter ပါ။ `$username` ပါတဲ့ နေရာတွေကို user name နဲ့ အစားထိုးပါလိမ့်မယ်။ ဒါက ldapsearchattribute ထက် ပိုပြီး ပြောင်းလွယ်ပြင်လွယ်ရှိတဲ့ search filters တွေကို သုံးခွင့် ပေးပါတယ်။

အောက်ပါ option ကို အပေါ်က LDAP options တချို့ကို ပိုပြီး ကျစ်လစ်၍ standard ကျတဲ့ ပုံစံတစ်မျိုးနဲ့ ရေးဖို့ အခြား နည်းလမ်းတစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်:

- **ldapurl** — RFC 4516 LDAP URL တစ်ခု ဖြစ်ပါတယ်။ Format ကတော့:

  ```
  ldap[s]://host[:port]/basedn[?[attribute][?[scope][?[filter]]]]
  ```

  scope က base, one, sub တို့ထဲက တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး — ပုံမှန်အားဖြင့်တော့ နောက်ဆုံးတစ်ခု (sub) ကို သုံးပါတယ်။ (Default ကတော့ base ဖြစ်ပြီး — ဒီ application မှာ ပုံမှန်အားဖြင့် အသုံးမဝင်ပါဘူး။) attribute က attribute တစ်ခုတည်းကို သတ်မှတ်ပေးနိုင်ပြီး — အဲဒီအခါ ldapsearchattribute အတွက် တန်ဖိုးအဖြစ် သုံးပါတယ်။ attribute ဗလာ (empty) ဖြစ်နေရင် — filter ကို ldapsearchfilter အတွက် တန်ဖိုးအဖြစ် သုံးနိုင်ပါတယ်။
  URL ရဲ့ scheme ldaps က — ldapscheme=ldaps သုံးတာနဲ့ ညီမျှတဲ့ — SSL ပေါ်မှာ LDAP connections တွေ ပြုလုပ်ဖို့ LDAPS method ကို ရွေးချယ်ပေးပါတယ်။ StartTLS operation သုံးပြီး encrypt လုပ်ထားတဲ့ LDAP connections တွေ သုံးချင်ရင်တော့ — ပုံမှန် URL scheme ldap ကို သုံးပြီး — ldapurl အပြင် ldaptls option ကိုပါ သတ်မှတ်ပါ။
  Anonymous မဟုတ်တဲ့ binds တွေအတွက်ဆိုရင် — ldapbinddn နဲ့ ldapbindpasswd တွေကို သီးခြား options အဖြစ် သတ်မှတ်ရပါမယ်။
  LDAP URLs တွေကို လောလောဆယ် OpenLDAP နဲ့ပဲ ထောက်ပံ့ပြီး — Windows မှာတော့ မထောက်ပံ့ပါဘူး။

Simple bind အတွက် configuration options တွေကို search+bind အတွက် options တွေနဲ့ ရောသုံးတာက error (အမှား) တစ်ခုပါ။ `ldapurl` ကို simple bind mode မှာ သုံးချင်ရင် — URL ထဲမှာ `basedn` ဒါမှမဟုတ် query elements တွေ မပါရပါဘူး။

Search+bind mode သုံးတဲ့အခါ — search ကို `ldapsearchattribute` နဲ့ သတ်မှတ်ထားတဲ့ attribute တစ်ခုတည်းနဲ့ ဒါမှမဟုတ် `ldapsearchfilter` နဲ့ သတ်မှတ်ထားတဲ့ custom search filter တစ်ခုနဲ့ လုပ်ဆောင်နိုင်ပါတယ်။ `ldapsearchattribute=foo` လို့ သတ်မှတ်တာက `ldapsearchfilter="(foo=$username)"` လို့ သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။ Option နှစ်ခုလုံး မသတ်မှတ်ထားရင် — default ကတော့ `ldapsearchattribute=uid` ဖြစ်ပါတယ်။

PostgreSQL ကို LDAP client library အဖြစ် OpenLDAP နဲ့ compile လုပ်ထားရင် — `ldapserver` setting ကို ချန်လိုက်လို့ရပါတယ်။ အဲဒီအခါ — host names နဲ့ ports တွေရဲ့ စာရင်းကို [RFC 2782](https://datatracker.ietf.org/doc/html/rfc2782) DNS SRV records တွေကနေတစ်ဆင့် ရှာဖွေပါတယ်။ `_ldap._tcp.DOMAIN` ဆိုတဲ့ name ကို ရှာဖွေပြီး — `DOMAIN` ကို `ldapbasedn` ကနေ ထုတ်ယူပါတယ်။

ဒီမှာ simple-bind LDAP configuration အတွက် ဥပမာ တစ်ခုပါ:

```sql
host ... ldap ldapserver=ldap.example.net ldapprefix="cn=" ldapsuffix=", dc=example, dc=net"
```

database user `someuser` အနေနဲ့ database server ဆီ connection တစ်ခု တောင်းဆိုလာတဲ့အခါ — PostgreSQL က DN `cn=someuser, dc=example, dc=net` နဲ့ client က ပေးထားတဲ့ password ကို သုံးပြီး — LDAP server ဆီ bind လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ အဲဒီ connection အောင်မြင်ရင် — database access ကို ခွင့်ပြုလိုက်ပါတယ်။

ဒီမှာ — LDAPS scheme နဲ့ custom port number တစ်ခုကို URL အနေနဲ့ ရေးထားတဲ့ — မတူညီတဲ့ simple-bind configuration တစ်ခုပါ:

```sql
host ... ldap ldapurl="ldaps://ldap.example.net:49151" ldapprefix="cn=" ldapsuffix=", dc=example, dc=net"
```

ဒါက `ldapserver`, `ldapscheme` နဲ့ `ldapport` တွေကို သီးခြားစီ သတ်မှတ်တာထက် နည်းနည်း ပိုပြီး ကျစ်လစ်ပါတယ်။

ဒီမှာ search+bind configuration အတွက် ဥပမာ တစ်ခုပါ:

```sql
host ... ldap ldapserver=ldap.example.net ldapbasedn="dc=example, dc=net" ldapsearchattribute=uid
```

database user `someuser` အနေနဲ့ database server ဆီ connection တစ်ခု တောင်းဆိုလာတဲ့အခါ — PostgreSQL က (`ldapbinddn` ကို မသတ်မှတ်ထားလို့) LDAP server ဆီ anonymous အနေနဲ့ bind လုပ်ပြီး — သတ်မှတ်ထားတဲ့ base DN အောက်မှာ `(uid=someuser)` အတွက် search လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Entry တစ်ခု တွေ့ရင် — တွေ့ထားတဲ့ အချက်အလက်နဲ့ client က ပေးထားတဲ့ password ကို သုံးပြီး bind လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒုတိယ bind အောင်မြင်ရင် — database access ကို ခွင့်ပြုလိုက်ပါတယ်။

ဒီမှာ URL အနေနဲ့ ရေးထားတဲ့ တူညီတဲ့ search+bind configuration ပါ:

```sql
host ... ldap ldapurl="ldap://ldap.example.net/dc=example,dc=net?uid?sub"
```

LDAP နဲ့ authentication ကို ထောက်ပံ့တဲ့ software တချို့က ဒီ URL format အတိုင်းပဲ သုံးတာမို့ — configuration ကို မျှဝေသုံးစွဲရတာ ပိုလွယ်ကူပါလိမ့်မယ်။

ဒီမှာ — user ID ဒါမှမဟုတ် email address နဲ့ authentication ပြုလုပ်ခွင့် ပေးဖို့ `ldapsearchattribute` အစား `ldapsearchfilter` ကို သုံးထားတဲ့ search+bind configuration အတွက် ဥပမာ တစ်ခုပါ:

```sql
host ... ldap ldapserver=ldap.example.net ldapbasedn="dc=example, dc=net" ldapsearchfilter="(|(uid=$username)(mail=$username))"
```

ဒီမှာ — `example.net` ဆိုတဲ့ domain name အတွက် LDAP service ရဲ့ host name (များ) နဲ့ port (များ) ကို ရှာဖွေဖို့ DNS SRV discovery သုံးထားတဲ့ search+bind configuration အတွက် ဥပမာ တစ်ခုပါ:

```sql
host ... ldap ldapbasedn="dc=example,dc=net"
```

> **အကြံပြုချက်:** LDAP က DN ရဲ့ အစိတ်အပိုင်း အမျိုးမျိုးကို ခွဲခြားဖို့ comma တွေနဲ့ space တွေကို မကြာခဏ သုံးတာမို့ — LDAP options တွေကို configure လုပ်တဲ့အခါ — ဥပမာတွေထဲမှာ ပြထားသလို — double-quoted parameter values (ကိုးကားမှတ် နှစ်ထပ် ထည့်ထားသော parameter တန်ဖိုးများ) တွေကို သုံးဖို့ မကြာခဏ လိုအပ်ပါတယ်။
