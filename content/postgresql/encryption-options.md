---
title: "Encryption Options (ကုဒ်ဝှက်ခြင်း ရွေးချယ်စရာများ)"
description: "PostgreSQL ရဲ့ encryption (ကုဒ်ဝှက်ခြင်း) အဆင့်မျိုးစုံ — database user စကားဝှက်များ (password encryption, SCRAM/MD5), pgcrypto module ဖြင့် တိကျသော columns များ ကုဒ်ဝှက်ခြင်း, data partition / file system အဆင့် encryption, network ပေါ်က data ကုဒ်ဝှက်ခြင်း (SSL, GSSAPI, Stunnel, SSH), SSL host authentication နှင့် client-side encryption တို့အကြောင်း ရှင်းလင်းချက်"
order: 147
source: "https://www.postgresql.org/docs/current/encryption-options.html"
status: translated
updated: 2026-09-06
---

## 18.8. Encryption Options (ကုဒ်ဝှက်ခြင်း ရွေးချယ်စရာများ)

PostgreSQL က encryption (ကုဒ်ဝှက်ခြင်း) ကို အဆင့် အမျိုးမျိုးမှာ ကမ်းလှမ်းထားပြီး — database server ခိုးယူခံရခြင်း၊ သြတ္တပ္ပစိတ် ကင်းမဲ့တဲ့ (unscrupulous) administrators တွေနဲ့ လုံခြုံမှု မရှိတဲ့ networks တွေကြောင့် data တွေ ပေါက်ကြား ထုတ်ဖော်ခံရခြင်းကနေ ကာကွယ်ရာမှာ လိုအပ်တဲ့ ပြောင်းလွယ်ပြင်လွယ် (flexibility) တစ်ခုကို ပေးပါတယ်။ ဆေးမှတ်တမ်းတွေ ဒါမှမဟုတ် ငွေကြေး လွှဲပြောင်းမှုတွေလို အရေးကြီးတဲ့ (sensitive) data တွေကို လုံခြုံအောင် လုပ်ဖို့ဆိုရင်လည်း encryption ကို မဖြစ်မနေ လိုအပ်တာ ရှိနိုင်ပါတယ်။

- **Password Encryption** (စကားဝှက် ကုဒ်ဝှက်ခြင်း) — Database user တွေရဲ့ စကားဝှက်တွေကို hashes (တစ်လမ်းသွား ကုဒ်ပြောင်း တန်ဖိုးများ) အနေနဲ့ သိမ်းဆည်းထားတာမို့ (အဲဒါကို `password_encryption` setting က သတ်မှတ်ပါတယ်) — administrator က user တစ်ယောက်ကို သတ်မှတ်ပေးထားတဲ့ တကယ့် စကားဝှက်ကို ဆုံးဖြတ်လို့ မရနိုင်ပါဘူး။ Client authentication (client စစ်မှန်ကြောင်း စိစစ်ခြင်း) အတွက် SCRAM ဒါမှမဟုတ် MD5 encryption ကို သုံးထားရင် — client က network ပေါ်မှာ မပို့ခင် စကားဝှက်ကို encrypt လုပ်ပြီးသား ဖြစ်လို့ — encrypt မလုပ်ထားတဲ့ စကားဝှက်က server ပေါ်မှာ ခဏတောင် တည်ရှိနေတာ မရှိပါဘူး။ SCRAM ကို ပိုနှစ်သက်ပါတယ် — အကြောင်းကတော့ ဒါက Internet standard တစ်ခု ဖြစ်ပြီး — PostgreSQL အတွက်သာ သီးသန့်ဖြစ်တဲ့ MD5 authentication protocol ထက် ပိုလုံခြုံလို့ပါ။

> **သတိပေးချက်:** MD5 နဲ့ encrypt လုပ်ထားတဲ့ စကားဝှက်တွေအတွက် ထောက်ပံ့မှုက deprecated (ရပ်ဆိုင်းရန် စီစဉ်ထားသော) ဖြစ်ပြီး — PostgreSQL ရဲ့ အနာဂတ် release တစ်ခုမှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။ တခြား စကားဝှက် type တစ်ခုဆီ ပြောင်းရွှေ့ခြင်းအကြောင်း အသေးစိတ်အတွက် အပိုင်း 20.5 ကို ကိုးကားပါ။

- **Encryption For Specific Columns** (တိကျသော columns များအတွက် ကုဒ်ဝှက်ခြင်း) — pgcrypto module က field တချို့ကို encrypt လုပ်ပြီး သိမ်းဆည်းထားနိုင်အောင် ခွင့်ပြုပါတယ်။ Data ထဲက တစ်ချို့ဟာပဲ sensitive (အရေးကြီး) ဖြစ်နေတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ Client က decryption key (ကုဒ်ဖွင့် သော့) ကို ထောက်ပံ့ပေးပြီး — data ကို server ပေါ်မှာ decrypt (ကုဒ်ဖွင့်) လုပ်ပြီးမှ client ဆီ ပို့ပေးပါတယ်။

Decrypt လုပ်လိုက်တဲ့ data နဲ့ decryption key တို့ဟာ — data ကို decrypt လုပ်နေချိန်နဲ့ client နဲ့ server ကြားမှာ ပို့ဆောင်နေချိန် အတောအတွင်း — server ပေါ်မှာ ခဏတာ တည်ရှိနေပါတယ်။ ဒါက — system administrator လို — database server ကို အပြည့်အဝ ဝင်ရောက်ခွင့် ရှိတဲ့သူ တစ်ယောက်ယောက်က data နဲ့ keys တွေကို ကြားဖြတ် ဖမ်းယူနိုင်တဲ့ အခိုက်အတန့် အတိုလေး တစ်ခုကို ဖန်တီးပေးပါတယ်။

- **Data Partition Encryption** (data partition ကုဒ်ဝှက်ခြင်း) — Storage encryption (သိုလှောင်မှု ကုဒ်ဝှက်ခြင်း) ကို file system အဆင့် ဒါမှမဟုတ် block အဆင့်မှာ လုပ်ဆောင်နိုင်ပါတယ်။ Linux ရဲ့ file system encryption ရွေးချယ်စရာတွေထဲမှာ eCryptfs နဲ့ EncFS တို့ ပါဝင်ပြီး — FreeBSD ကတော့ PEFS ကို သုံးပါတယ်။ Block level ဒါမှမဟုတ် full disk encryption (disk တစ်ခုလုံး ကုဒ်ဝှက်ခြင်း) ရွေးချယ်စရာတွေထဲမှာ — Linux ပေါ်က dm-crypt + LUKS နဲ့ FreeBSD ပေါ်က GEOM modules ဖြစ်တဲ့ geli နဲ့ gbde တို့ ပါဝင်ပါတယ်။ Windows အပါအဝင် — တခြား operating system တွေ အများအပြားကလည်း ဒီ လုပ်ဆောင်ချက်ကို ထောက်ပံ့ပါတယ်။

ဒီ mechanism က — drives တွေ ဒါမှမဟုတ် ကွန်ပျူတာ တစ်ခုလုံး ခိုးယူခံရတဲ့အခါ — drives တွေကနေ encrypt မလုပ်ထားတဲ့ data တွေကို ဖတ်လို့ မရအောင် ကာကွယ်ပေးပါတယ်။ File system ကို mount (တပ်ဆင်) လုပ်ထားစဉ်မှာတော့ ဒါက တိုက်ခိုက်မှုတွေကနေ ကာကွယ်မပေးပါဘူး — အကြောင်းကတော့ mount လုပ်ထားချိန်မှာ operating system က data ရဲ့ encrypt မလုပ်ထားတဲ့ မြင်ကွင်း (unencrypted view) တစ်ခုကို ပေးအပ်လို့ပါ။ ဒါပေမယ့် — file system ကို mount လုပ်ဖို့ဆိုရင် — encryption key ကို operating system ဆီ ပို့ပေးဖို့ နည်းလမ်း တစ်နည်းနည်း လိုအပ်ပြီး — တခါတရံမှာ key ကို disk ကို mount လုပ်တဲ့ host ပေါ်က နေရာ တစ်နေရာရာမှာ သိမ်းဆည်းထားတတ်ပါတယ်။

- **Encrypting Data Across A Network** (network တစ်ခုကို ဖြတ်၍ data ကုဒ်ဝှက်ခြင်း) — SSL connections တွေက network ပေါ်မှာ ပို့လွှတ်တဲ့ data အားလုံးကို — စကားဝှက်၊ queries တွေနဲ့ ပြန်ပို့တဲ့ data တွေပါ အပါအဝင် — encrypt လုပ်ပါတယ်။ pg_hba.conf ဖိုင်က administrators တွေကို — ဘယ် hosts တွေက non-encrypted connections (`host`) တွေကို သုံးနိုင်ပြီး — ဘယ်ဟာတွေက SSL-encrypted connections (`hostssl`) တွေ လိုအပ်လဲ သတ်မှတ်ခွင့် ပြုပါတယ်။ ထို့အပြင် — clients တွေက SSL ကနေတစ်ဆင့်ပဲ server တွေဆီ connect (ချိတ်ဆက်) လုပ်မယ်လို့လည်း သတ်မှတ်နိုင်ပါတယ်။

GSSAPI-encrypted connections တွေကလည်း — queries နဲ့ ပြန်ပို့တဲ့ data တွေ အပါအဝင် — network ပေါ်မှာ ပို့လွှတ်တဲ့ data အားလုံးကို encrypt လုပ်ပါတယ်။ (Network ပေါ်မှာ စကားဝှက် ဘာမှ ပို့လွှတ်တာ မရှိပါဘူး။) pg_hba.conf ဖိုင်က administrators တွေကို — ဘယ် hosts တွေက non-encrypted connections (`host`) တွေကို သုံးနိုင်ပြီး — ဘယ်ဟာတွေက GSSAPI-encrypted connections (`hostgssenc`) တွေ လိုအပ်လဲ သတ်မှတ်ခွင့် ပြုပါတယ်။ ထို့အပြင် — clients တွေက GSSAPI-encrypted connections (`gssencmode=require`) တွေပေါ်မှာပဲ server တွေဆီ connect လုပ်မယ်လို့လည်း သတ်မှတ်နိုင်ပါတယ်။

Stunnel ဒါမှမဟုတ် SSH ကိုလည်း — transmissions (ပို့လွှတ်မှုများ) တွေကို encrypt လုပ်ဖို့ သုံးနိုင်ပါတယ်။

- **SSL Host Authentication** (SSL host စစ်မှန်ကြောင်း စိစစ်ခြင်း) — Client ရော server ရော — တစ်ဖက်ကိုတစ်ဖက် SSL certificates တွေ ပေးအပ်ဖို့ ဖြစ်နိုင်ပါတယ်။ ဘက်တစ်ခုချင်းစီမှာ configuration အပိုတချို့ လိုအပ်ပေမယ့် — ဒါက စကားဝှက် သုံးရုံထက် ပိုခိုင်မာတဲ့ မည်သူမည်ဝါ ဖြစ်ကြောင်း (identity) စိစစ်ချက် တစ်ခုကို ပေးပါတယ်။ ဒါက — client က ပို့လိုက်တဲ့ စကားဝှက်ကို ဖတ်လို့ ရလောက်အောင် — server အဖြစ် ဟန်ဆောင်နေတဲ့ ကွန်ပျူတာ တစ်လုံးကို တားဆီးပေးပါတယ်။ Client နဲ့ server ကြားက ကွန်ပျူတာ တစ်လုံးက server အဖြစ် ဟန်ဆောင်ပြီး — client နဲ့ server ကြားက data အားလုံးကို ဖတ်ပြီး ဆက်ပို့ပေးနေတဲ့ “man in the middle” (ကြားခံ ကြားဖြတ် ဝင်ရောက်မှု) တိုက်ခိုက်မှုတွေကိုလည်း ဒါက ကာကွယ်ပေးပါတယ်။

- **Client-Side Encryption** (client ဘက်ခြမ်း ကုဒ်ဝှက်ခြင်း) — Server ရဲ့ machine အတွက် system administrator ကို မယုံကြည်နိုင်ဘူးဆိုရင် — client က data တွေကို encrypt လုပ်ဖို့ လိုအပ်ပါတယ်; ဒီလိုဆိုရင် — encrypt မလုပ်ထားတဲ့ data က database server ပေါ်မှာ ဘယ်တော့မှ ပေါ်မလာပါဘူး။ Data တွေကို server ဆီ မပို့ခင် client ပေါ်မှာ encrypt လုပ်ပြီး — database ရလဒ်တွေကို အသုံးမပြုခင် client ပေါ်မှာပဲ decrypt လုပ်ရပါတယ်။
