---
title: "Secure TCP/IP Connections with SSL (SSL ဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)"
description: "PostgreSQL ၏ SSL/TLS ချိတ်ဆက်မှု လုံခြုံရေး — basic setup (ssl parameter၊ server.crt/server.key နှင့် ခွင့်ပြုချက်များ)၊ OpenSSL configuration (openssl.cnf, ssl_ciphers)၊ client certificates လိုအပ်ချက် (ssl_ca_file၊ clientcert=verify-ca/verify-full)၊ SSL server ဖိုင် အသုံးပြုမှု ဇယား နှင့် openssl commands များဖြင့် certificates ဖန်တီးခြင်း အကြောင်း"
order: 148
source: "https://www.postgresql.org/docs/current/ssl-tcp.html"
status: translated
updated: 2026-09-06
---

## 18.9. Secure TCP/IP Connections with SSL (SSL ဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)

- **18.9.1. Basic Setup (အခြေခံ ပြင်ဆင်ခြင်း)**
- **18.9.2. OpenSSL Configuration (OpenSSL configuration ချိန်ညှိခြင်း)**
- **18.9.3. Using Client Certificates (client certificates များကို အသုံးပြုခြင်း)**
- **18.9.4. SSL Server File Usage (SSL server ဖိုင် အသုံးပြုမှု)**
- **18.9.5. Creating Certificates (certificates များ ဖန်တီးခြင်း)**

PostgreSQL မှာ client/server ဆက်သွယ်ရေးတွေကို encrypt (ကုဒ်ဝှက်) လုပ်ပြီး လုံခြုံမှု မြှင့်တင်ဖို့ — SSL connections တွေကို သုံးတဲ့ native (ပါဝင်ပြီးသား) ထောက်ပံ့မှု တစ်ခု ရှိပါတယ်။ ဒါအတွက် — client ရော server system နှစ်ခုလုံးမှာပါ OpenSSL ကို တပ်ဆင်ထားရပြီး — PostgreSQL ထဲမှာ ဒီထောက်ပံ့မှုကို build (တည်ဆောက်) လုပ်ချိန်မှာ enable (ဖွင့်) လုပ်ထားဖို့ လိုအပ်ပါတယ် ([အခန်း 17](https://www.postgresql.org/docs/current/installation.html) ကို ကြည့်ပါ)။

SSL နဲ့ TLS ဆိုတဲ့ အသုံးအနှုန်း နှစ်ခုကို — TLS protocol တစ်ခုကို သုံးပြီး ပြုလုပ်တဲ့ လုံခြုံပြီး encrypt လုပ်ထားတဲ့ ချိတ်ဆက်မှု တစ်ခုကို ဆိုလိုဖို့ — မကြာခဏ အပြန်အလှန် သုံးစွဲလေ့ ရှိပါတယ်။ SSL protocols တွေက TLS protocols တွေရဲ့ ရှေ့ပြေး (precursor) တွေ ဖြစ်ပြီး — SSL protocols တွေကို ထောက်ပံ့မှု မရှိတော့ပေမယ့် — encrypt လုပ်ထားတဲ့ ချိတ်ဆက်မှုတွေအတွက် SSL ဆိုတဲ့ အသုံးအနှုန်းကို ဒီနေ့ထိ အသုံးပြုနေဆဲ ဖြစ်ပါတယ်။ PostgreSQL မှာ SSL ကို TLS နဲ့ အပြန်အလှန် လဲလှယ် သုံးစွဲပါတယ်။

### 18.9.1. Basic Setup (အခြေခံ ပြင်ဆင်ခြင်း)

SSL support ထည့်သွင်း compile လုပ်ထားတဲ့အခါ — `postgresql.conf` ထဲမှာ [ssl](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL) ဆိုတဲ့ parameter ကို `on` လို့ သတ်မှတ်ခြင်းအားဖြင့် — TLS protocols တွေကို သုံးပြီး encrypt လုပ်ထားတဲ့ ချိတ်ဆက်မှုတွေအတွက် ထောက်ပံ့မှု enable လုပ်ထားတဲ့ အနေအထားနဲ့ — PostgreSQL server ကို စတင်နိုင်ပါတယ်။ Server က TCP port တစ်ခုတည်းပေါ်မှာ — normal connections ရော SSL connections တွေကိုပါ listen (နားဆင်) လုပ်ပြီး — ချိတ်ဆက်လာတဲ့ client တစ်ခုချင်းစီနဲ့ SSL သုံးမသုံး ညှိနှိုင်း (negotiate) ပါလိမ့်မယ်။ Default အားဖြင့် — ဒါက client ရဲ့ ရွေးချယ်မှုအပေါ် မူတည်ပါတယ်; connections တချို့ ဒါမှမဟုတ် အားလုံးအတွက် SSL ကို မဖြစ်မနေ သုံးစေဖို့ server ကို ဘယ်လို သတ်မှတ်ရမလဲဆိုတာ [အပိုင်း 20.1](/docs/postgresql/auth-pg-hba-conf) မှာ ကြည့်ပါ။

SSL mode နဲ့ စတင်ဖို့ — server certificate နဲ့ private key ပါဝင်တဲ့ ဖိုင်တွေ တည်ရှိနေရပါမယ်။ Default အားဖြင့် — ဒီဖိုင်တွေကို server ရဲ့ data directory ထဲမှာ `server.crt` နဲ့ `server.key` လို့ အသီးသီး နာမည်ပေးထားဖို့ မျှော်လင့်ပြီး — တခြား နာမည်တွေနဲ့ တည်နေရာတွေကိုတော့ [ssl_cert_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CERT-FILE) နဲ့ [ssl_key_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-KEY-FILE) configuration parameters တွေကို သုံးပြီး သတ်မှတ်နိုင်ပါတယ်။

Unix systems တွေပေါ်မှာ — `server.key` ရဲ့ permissions (ခွင့်ပြုချက် သတ်မှတ်ချက်များ) က world ဒါမှမဟုတ် group ရဲ့ ဝင်ရောက်ခွင့် ကို တားမြစ်ထားရပါမယ်; `chmod 0600 server.key` ဆိုတဲ့ command နဲ့ ဒါကို ပြီးမြောက်အောင် လုပ်နိုင်ပါတယ်။ တနည်းအားဖြင့် — ဖိုင်ကို root က ပိုင်ဆိုင်ပြီး group က ဖတ်ခွင့် ရှိတဲ့ ပုံစံ (ဆိုလိုတာက `0640` permissions) နဲ့လည်း ထားနိုင်ပါတယ်။ အဲဒီ သတ်မှတ်ပုံက — certificate နဲ့ key ဖိုင်တွေကို operating system က စီမံခန့်ခွဲတဲ့ တပ်ဆင်မှုတွေအတွက် ရည်ရွယ်ပါတယ်။ အဲဒီအခါ — PostgreSQL server ကို run လုပ်တဲ့ user ကို — အဲဒီ certificate နဲ့ key ဖိုင်တွေကို ဝင်ရောက်ခွင့် ရှိတဲ့ group ရဲ့ အဖွဲ့ဝင် တစ်ယောက် ဖြစ်အောင် လုပ်ပေးရပါမယ်။

Data directory က group read access (group ဖတ်ခွင့်) ကို ခွင့်ပြုထားရင် — အပေါ်မှာ ဖော်ပြထားတဲ့ လုံခြုံရေး လိုအပ်ချက်တွေနဲ့ ကိုက်ညီဖို့ — certificate ဖိုင်တွေကို data directory ရဲ့ အပြင်ဘက်မှာ ထားရှိဖို့ လိုအပ်လာနိုင်ပါတယ်။ ယေဘုယျအားဖြင့် — အခွင့်ထူး မရှိတဲ့ (unprivileged) user တစ်ယောက် database ကို backup (အရန် ကူးယူခြင်း) လုပ်နိုင်အောင် group access ကို enable လုပ်ထားတတ်ပြီး — အဲဒီလို အခြေအနေမျိုးမှာ backup software က certificate ဖိုင်တွေကို ဖတ်နိုင်မှာ မဟုတ်တဲ့အတွက် — error (အမှား) တက်ဖို့ များပါတယ်။

Private key ကို passphrase (လျှို့ဝှက် စကားစု) တစ်ခုနဲ့ ကာကွယ်ထားရင် — server က passphrase ကို တောင်းခံပြီး — အဲဒါကို ရိုက်ထည့်လိုက်တဲ့အထိ စတင်မှာ မဟုတ်ပါဘူး။ Passphrase သုံးထားခြင်းက — default အားဖြင့် — server restart (ပြန်လည် စတင်ခြင်း) မလုပ်ဘဲ — server ရဲ့ SSL configuration ကို ပြောင်းလဲနိုင်တဲ့ စွမ်းရည်ကို ပိတ်ပစ်ပါတယ် — ဒါပေမယ့် [ssl_passphrase_command_supports_reload](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-PASSPHRASE-COMMAND-SUPPORTS-RELOAD) ကို ကြည့်ပါ။ ထို့အပြင် — passphrase နဲ့ ကာကွယ်ထားတဲ့ private keys တွေကို Windows ပေါ်မှာတော့ လုံးဝ အသုံးပြုလို့ မရပါဘူး။

`server.crt` ထဲက ပထမဆုံး certificate က — server ရဲ့ private key နဲ့ ကိုက်ညီရမှာ ဖြစ်လို့ — server ရဲ့ certificate ကိုယ်တိုင် ဖြစ်ရပါမယ်။ “intermediate” (အလယ်အလတ်) certificate authorities တွေရဲ့ certificates တွေကိုလည်း — ဖိုင်ထဲကို ထပ်ဆင့် ထည့်နိုင်ပါတယ်။ ဒီလို လုပ်ခြင်းက — root နဲ့ intermediate certificates တွေကို `v3_ca` extensions တွေနဲ့ ဖန်တီးထားတယ်ဆိုရင် — client တွေပေါ်မှာ intermediate certificates တွေ သိမ်းဆည်းထားဖို့ မလိုအောင် ရှောင်ရှားပေးပါတယ်။ (ဒါက certificate ရဲ့ `CA` ဆိုတဲ့ basic constraint ကို `true` အဖြစ် သတ်မှတ်ပေးပါတယ်။) ဒါက intermediate certificates တွေရဲ့ သက်တမ်း ကုန်ဆုံးမှုကို ပိုမို လွယ်ကူစေပါတယ်။

`server.crt` ထဲကို root certificate ထည့်ဖို့တော့ မလိုအပ်ပါဘူး။ အဲဒီအစား — client တွေမှာ server ရဲ့ certificate chain (certificate ကွင်းဆက်) ရဲ့ root certificate ရှိနေရပါမယ်။

### 18.9.2. OpenSSL Configuration (OpenSSL configuration ချိန်ညှိခြင်း)

PostgreSQL က system တစ်ခုလုံး သက်ရောက်တဲ့ (system-wide) OpenSSL configuration ဖိုင်ကို ဖတ်ပါတယ်။ Default အားဖြင့် — ဒီဖိုင်ကို `openssl.cnf` လို့ နာမည်ပေးထားပြီး — `openssl version -d` က အစီရင်ခံပေးတဲ့ directory ထဲမှာ တည်ရှိပါတယ်။ `OPENSSL_CONF` ဆိုတဲ့ environment variable (ပတ်ဝန်းကျင် ပြောင်းလဲနိုင်သော တန်ဖိုး) ကို — လိုချင်တဲ့ configuration ဖိုင်ရဲ့ နာမည်အဖြစ် သတ်မှတ်ခြင်းအားဖြင့် — ဒီ default ကို ကျော်လွန် သတ်မှတ်နိုင်ပါတယ်။

OpenSSL က — အားကောင်းမှု အမျိုးမျိုး ကွဲပြားတဲ့ — ciphers (ကုဒ်ဝှက် algorithms) များစွာနဲ့ authentication algorithms တွေကို ထောက်ပံ့ပါတယ်။ OpenSSL configuration ဖိုင်ထဲမှာ ciphers စာရင်း တစ်ခုကို သတ်မှတ်နိုင်ပေမယ့် — database server အတွက် အသုံးပြုဖို့ ciphers တွေကို — `postgresql.conf` ထဲက [ssl_ciphers](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CIPHERS) ကို ပြုပြင် သတ်မှတ်ခြင်းအားဖြင့် — သီးသန့် သတ်မှတ်နိုင်ပါတယ်။

> **မှတ်ချက်:** `NULL-SHA` ဒါမှမဟုတ် `NULL-MD5` ciphers တွေကို သုံးပြီး — encryption ရဲ့ overhead (ထပ်ဆောင်း တွက်ချက်မှု ဝန်ထုပ်) မပါဘဲ — authentication ကို လုပ်ဆောင်နိုင်ပါတယ်။ ဒါပေမယ့် — man-in-the-middle (ကြားခံ ဝင်ရောက် နားထောင်သူ) တစ်ယောက်က client နဲ့ server ကြားက ဆက်သွယ်မှုတွေကို ဖတ်ရှုပြီး ထပ်ဆင့် ပို့နိုင်ပါတယ်။ ထို့အပြင် — encryption overhead က authentication ရဲ့ overhead နဲ့ ယှဉ်ရင် နည်းပါးပါတယ်။ ဒီအကြောင်းရင်းတွေကြောင့် NULL ciphers တွေကို အကြံပြုလို့ မရပါဘူး။

### 18.9.3. Using Client Certificates (client certificates များကို အသုံးပြုခြင်း)

Client က — ယုံကြည်စိတ်ချရတဲ့ (trusted) certificate တစ်ခုကို ပေးအပ်ဖို့ လိုအပ်စေချင်ရင် — သင်ယုံကြည်တဲ့ root certificate authorities (CAs) တွေရဲ့ certificates တွေကို data directory ထဲက ဖိုင်တစ်ခုထဲမှာ ထားရှိပြီး — `postgresql.conf` ထဲက [ssl_ca_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CA-FILE) parameter ကို အဲဒီ ဖိုင်နာမည် အသစ်အဖြစ် သတ်မှတ်ကာ — `pg_hba.conf` ထဲက သင့်လျော်တဲ့ `hostssl` line (စာကြောင်း) တွေမှာ `clientcert=verify-ca` ဒါမှမဟုတ် `clientcert=verify-full` ဆိုတဲ့ authentication option ကို ထည့်သွင်းပါ။ ဒါဆိုရင် — SSL connection စတင်စဉ်မှာ client ဆီကနေ certificate တစ်ခုကို တောင်းခံပါလိမ့်မယ်။ (Client ဘက်မှာ certificates တွေကို ဘယ်လို သတ်မှတ်ရမလဲဆိုတဲ့ ဖော်ပြချက်အတွက် [အပိုင်း 32.19](https://www.postgresql.org/docs/current/libpq-ssl.html) ကို ကြည့်ပါ။)

`clientcert=verify-ca` ပါတဲ့ `hostssl` entry တစ်ခုအတွက် — server က client ရဲ့ certificate ကို — ယုံကြည်စိတ်ချရတဲ့ certificate authorities တွေထဲက တစ်ခုခုက လက်မှတ်ထိုး (sign) ထားလား ဆိုတာ စစ်ဆေးပါလိမ့်မယ်။ `clientcert=verify-full` လို့ သတ်မှတ်ထားရင် — server က certificate chain (certificate ကွင်းဆက်) ကို စစ်ဆေးရုံတင် မကဘဲ — username ဒါမှမဟုတ် ၎င်းရဲ့ mapping (ချိတ်ဆက် သတ်မှတ်ချက်) က — ပေးအပ်ထားတဲ့ certificate ရဲ့ `cn` (Common Name) နဲ့ ကိုက်ညီမှု ရှိမရှိကိုပါ စစ်ဆေးပါလိမ့်မယ်။ `cert` authentication method ကို သုံးတဲ့အခါ — certificate chain စစ်ဆေးခြင်း (validation) က အမြဲတမ်း သေချာ ဆောင်ရွက်ပေးတာ သတိပြုပါ ([အပိုင်း 20.12](/docs/postgresql/auth-cert) ကို ကြည့်ပါ)။

ရှိပြီးသား root certificates တွေဆီ ကွင်းဆက်သဖွယ် ဆက်သွားတဲ့ intermediate certificates တွေကိုလည်း — client တွေပေါ်မှာ သိမ်းဆည်းထားရတာကို ရှောင်ချင်ရင် — [ssl_ca_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CA-FILE) ဖိုင်ထဲမှာ ထည့်ထားနိုင်ပါတယ် (root နဲ့ intermediate certificates တွေကို `v3_ca` extensions တွေနဲ့ ဖန်တီးထားတယ်ဆိုရင်)။ [ssl_crl_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CRL-FILE) ဒါမှမဟုတ် [ssl_crl_dir](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CRL-DIR) parameter ကို သတ်မှတ်ထားရင် — Certificate Revocation List (CRL — certificate ပယ်ဖျက်စာရင်း) ထဲက entries တွေကိုလည်း စစ်ဆေးပါတယ်။

`clientcert` authentication option က authentication methods အားလုံးအတွက် ရရှိနိုင်ပေမယ့် — `pg_hba.conf` ထဲမှာ `hostssl` အနေနဲ့ သတ်မှတ်ထားတဲ့ line တွေမှာပဲ ဖြစ်ပါတယ်။ `clientcert` ကို မသတ်မှတ်ထားတဲ့အခါ — client certificate တစ်ခု တင်ပြပြီး — CA ကို configure လုပ်ထားတယ်ဆိုရင်သာ — server က client certificate ကို — သူ့ရဲ့ CA ဖိုင်နဲ့ ဆန့်ကျင် စစ်ဆေးပါတယ်။

Login ပြုလုပ်စဉ် users တွေ certificate တစ်ခု ပေးအပ်ဖို့ အတင်းအကျပ် စေခိုင်းဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်။

ပထမ နည်းလမ်းက — `pg_hba.conf` ထဲက `hostssl` entries တွေအတွက် `cert` authentication method ကို အသုံးပြုတာပါ — ဒါဆိုရင် — SSL connection ရဲ့ လုံခြုံရေးကိုပါ ပေးဆောင်နေစဉ်မှာ — certificate ကိုယ်တိုင်ကိုပဲ authentication အတွက် သုံးပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 20.12](/docs/postgresql/auth-cert) ကို ကြည့်ပါ။ (`cert` authentication method ကို သုံးတဲ့အခါ — `clientcert` options တွေကို ထင်ရှားစွာ (explicitly) သတ်မှတ်ဖို့ မလိုအပ်ပါဘူး။) ဒီကိစ္စမှာ — certificate ထဲမှာ ပေးထားတဲ့ `cn` (Common Name) ကို user name ဒါမှမဟုတ် သက်ဆိုင်တဲ့ mapping တစ်ခုနဲ့ ဆန့်ကျင် စစ်ဆေးပါတယ်။

ဒုတိယ နည်းလမ်းက — `hostssl` entries တွေအတွက် authentication method ဘယ်ဟာကိုမဆို — `clientcert` authentication option ကို `verify-ca` ဒါမှမဟုတ် `verify-full` လို့ သတ်မှတ်ခြင်းအားဖြင့် — client certificates တွေရဲ့ စစ်ဆေးခြင်းနဲ့ ပေါင်းစပ်ပါတယ်။ ရှေ့ option (verify-ca) က certificate က valid (တရားဝင်) ဖြစ်ကြောင်းကိုပဲ အတင်းအကျပ် စစ်ဆေးပြီး — နောက် option (verify-full) ကတော့ — certificate ထဲက `cn` (Common Name) က user name ဒါမှမဟုတ် သက်ဆိုင်တဲ့ mapping တစ်ခုနဲ့ ကိုက်ညီကြောင်းကိုပါ ထပ်ဆောင်း သေချာစေပါတယ်။

### 18.9.4. SSL Server File Usage (SSL server ဖိုင် အသုံးပြုမှု)

[ဇယား 18.2](/docs/postgresql/ssl-tcp) က server ပေါ်မှာ SSL setup နဲ့ သက်ဆိုင်တဲ့ ဖိုင်တွေကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။ (ပြထားတဲ့ ဖိုင် နာမည်တွေက default နာမည်တွေ ဖြစ်ပါတယ်။ ဒေသအလိုက် configure လုပ်ထားတဲ့ နာမည်တွေ ကွဲပြားနိုင်ပါတယ်။)

**ဇယား 18.2. SSL Server File Usage (SSL server ဖိုင် အသုံးပြုမှု)**

| File | Contents | Effect |
| --- | --- | --- |
| [ssl_cert_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CERT-FILE) (`$PGDATA/server.crt`) | server ၏ certificate | server ရဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း (identity) ညွှန်ပြဖို့ client ဆီ ပို့ပေးသည် |
| [ssl_key_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-KEY-FILE) (`$PGDATA/server.key`) | server ၏ private key | server certificate ကို ပိုင်ရှင်က ပို့ပေးခဲ့ကြောင်း သက်သေ ပြသည်; certificate ပိုင်ရှင်သည် ယုံကြည်စိတ်ချရသူ ဖြစ်ကြောင်း ညွှန်ပြခြင်း မရှိ |
| [ssl_ca_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CA-FILE) | ယုံကြည်စိတ်ချရသော certificate authorities များ | client certificate ကို ယုံကြည်စိတ်ချရသော certificate authority တစ်ခုက လက်မှတ်ထိုးထားကြောင်း စစ်ဆေးသည် |
| [ssl_crl_file](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CRL-FILE) | certificate authorities များက ပယ်ဖျက်ထားသော certificates များ | client certificate သည် ဤစာရင်းထဲတွင် မပါဝင်ရ |

Server က ဒီဖိုင်တွေကို — server စတင်ချိန်မှာ ရော — server configuration ကို ပြန်လည် load (reload) လုပ်တိုင်းမှာပါ ဖတ်ပါတယ်။ Windows systems တွေပေါ်မှာ — client connection အသစ်တစ်ခုအတွက် backend process အသစ် တစ်ခု ဖန်တီးလိုက်တိုင်းမှာလည်း ၎င်းတို့ကို ပြန်လည် ဖတ်ပါတယ်။

ဒီဖိုင်တွေထဲမှာ error တစ်ခုကို server စတင်ချိန်မှာ တွေ့ရှိရင် — server က စတင်ဖို့ ငြင်းဆန်ပါလိမ့်မယ်။ ဒါပေမယ့် — configuration reload လုပ်နေစဉ်မှာ error တစ်ခုကို တွေ့ရှိရင် — ဖိုင်တွေကို လျစ်လျူရှုပြီး — SSL configuration အဟောင်းကို ဆက်လက် အသုံးပြုပါတယ်။ Windows systems တွေပေါ်မှာ — backend စတင်ချိန်မှာ ဒီဖိုင်တွေထဲက error တစ်ခုကို တွေ့ရှိရင် — အဲဒီ backend က SSL connection တစ်ခု ထူထောင်နိုင်မှာ မဟုတ်ပါဘူး။ ဒီကိစ္စတွေ အားလုံးမှာ — error အခြေအနေကို server log ထဲမှာ အစီရင်ခံပါတယ်။

### 18.9.5. Creating Certificates (certificates များ ဖန်တီးခြင်း)

Server အတွက် — ရက် 365 သက်တမ်း ရှိတဲ့ — ရိုးရှင်းတဲ့ self-signed certificate (မိမိကိုယ်တိုင် လက်မှတ်ထိုးထားသော certificate) တစ်ခု ဖန်တီးဖို့ — `dbhost.yourdomain.com` နေရာမှာ server ရဲ့ host name ကို အစားထိုးပြီး — အောက်ပါ OpenSSL command ကို သုံးပါ:

```sql
openssl req -new -x509 -days 365 -nodes -text -out server.crt \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
```

ပြီးရင် ဒီလို လုပ်ပါ:

```sql
chmod og-rwx server.key
```

အကြောင်းကတော့ — ဖိုင်ရဲ့ permissions တွေက ဒီထက် ပိုလျော့ရဲရင် server က အဲဒီဖိုင်ကို ငြင်းပယ်လို့ပါ။ သင့်ရဲ့ server private key နဲ့ certificate ကို ဘယ်လို ဖန်တီးရမလဲဆိုတဲ့ အသေးစိတ်အတွက် — OpenSSL documentation ကို ကိုးကားပါ။

Self-signed certificate တစ်ခုကို စမ်းသပ်မှု (testing) အတွက် သုံးနိုင်ပေမယ့် — production (ထုတ်လုပ်မှု ပတ်ဝန်းကျင်) မှာတော့ — certificate authority (CA) တစ်ခု (များသောအားဖြင့် — လုပ်ငန်းတစ်ခုလုံး သက်ရောက်တဲ့ enterprise-wide root CA) က လက်မှတ်ထိုးထားတဲ့ certificate တစ်ခုကို သုံးသင့်ပါတယ်။

Client တွေ စစ်ဆေး အတည်ပြုနိုင်တဲ့ (validate) identity ရှိတဲ့ server certificate တစ်ခု ဖန်တီးဖို့ — ဦးစွာ — certificate signing request (CSR — certificate လက်မှတ်ထိုးရန် တောင်းဆိုချက်) တစ်ခုနဲ့ public/private key ဖိုင် တစ်ခုကို ဖန်တီးပါ:

```sql
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=root.yourdomain.com"
chmod og-rwx root.key
```

ပြီးရင် — root certificate authority တစ်ခု ဖန်တီးဖို့ — request ကို key နဲ့ လက်မှတ်ထိုးပါ (Linux ပေါ်မှာ default OpenSSL configuration ဖိုင် တည်နေရာကို သုံးပြီး):

```sql
openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt
```

နောက်ဆုံးအနေနဲ့ — root certificate authority အသစ်က လက်မှတ်ထိုးထားတဲ့ server certificate တစ်ခုကို ဖန်တီးပါ:

```sql
openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
chmod og-rwx server.key

openssl x509 -req -in server.csr -text -days 365 \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out server.crt
```

`server.crt` နဲ့ `server.key` တွေကို server ပေါ်မှာ သိမ်းဆည်းသင့်ပြီး — `root.crt` ကိုတော့ — client က server ရဲ့ leaf certificate (အစွန်ဆုံး certificate) ကို သူ့ရဲ့ ယုံကြည်စိတ်ချရတဲ့ root certificate က လက်မှတ်ထိုးထားကြောင်း စစ်ဆေး အတည်ပြုနိုင်ဖို့ — client ပေါ်မှာ သိမ်းဆည်းသင့်ပါတယ်။ `root.key` ကိုတော့ — အနာဂတ် certificates တွေ ဖန်တီးတဲ့အခါ အသုံးပြုဖို့ — offline (အွန်လိုင်း မဟုတ်သော နေရာ) မှာ သိမ်းဆည်းထားသင့်ပါတယ်။

Intermediate certificates တွေ ပါဝင်တဲ့ — ယုံကြည်မှု ကွင်းဆက် (chain of trust) တစ်ခုကိုလည်း ဖန်တီးနိုင်ပါတယ်:

```sql
# root
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=root.yourdomain.com"
chmod og-rwx root.key
openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt

# intermediate
openssl req -new -nodes -text -out intermediate.csr \
  -keyout intermediate.key -subj "/CN=intermediate.yourdomain.com"
chmod og-rwx intermediate.key
openssl x509 -req -in intermediate.csr -text -days 1825 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out intermediate.crt

# leaf
openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
chmod og-rwx server.key
openssl x509 -req -in server.csr -text -days 365 \
  -CA intermediate.crt -CAkey intermediate.key -CAcreateserial \
  -out server.crt
```

`server.crt` နဲ့ `intermediate.crt` တွေကို — certificate ဖိုင် အစုအဝေး (bundle) တစ်ခုအဖြစ် ဆက်စပ် (concatenate) လုပ်ပြီး — server ပေါ်မှာ သိမ်းဆည်းသင့်ပါတယ်။ `server.key` ကိုလည်း server ပေါ်မှာပဲ သိမ်းဆည်းသင့်ပါတယ်။ `root.crt` ကိုတော့ — client က — server ရဲ့ leaf certificate ကို — သူ့ရဲ့ ယုံကြည်စိတ်ချရတဲ့ root certificate နဲ့ ချိတ်ဆက်ထားတဲ့ certificate ကွင်းဆက် တစ်ခုက လက်မှတ်ထိုးထားကြောင်း စစ်ဆေး အတည်ပြုနိုင်ဖို့ — client ပေါ်မှာ သိမ်းဆည်းသင့်ပါတယ်။ `root.key` နဲ့ `intermediate.key` တွေကိုတော့ — အနာဂတ် certificates တွေ ဖန်တီးဖို့ — offline မှာ သိမ်းဆည်းထားသင့်ပါတယ်။
