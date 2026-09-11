---
title: "Secure TCP/IP Connections with SSH Tunnels (SSH tunnels များဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)"
description: "PostgreSQL server ဆီ client ချိတ်ဆက်မှုကို SSH ဖြင့် လုံခြုံအောင် ပြုလုပ်ခြင်း — ssh -L port forwarding ဖြင့် secure tunnel ဖန်တီးခြင်း, psql ဖြင့် local port ကို ဖြတ်၍ connect လုပ်ခြင်း, remote bind address ရွေးချယ်မှုများ (localhost vs foo.com), listen_addresses နှင့် ဆက်စပ်မှု, login host ကို ကြားခံပြု၍ hop လုပ်ခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 154
source: "https://www.postgresql.org/docs/current/ssh-tunnels.html"
status: translated
updated: 2026-09-06
---

## 18.11. Secure TCP/IP Connections with SSH Tunnels (SSH tunnels များဖြင့် လုံခြုံသော TCP/IP ချိတ်ဆက်မှုများ)

Clients တွေနဲ့ PostgreSQL server တစ်ခုကြားက network connection ကို encrypt (ကုဒ်ဝှက်) လုပ်ဖို့ SSH ကို သုံးလို့ ရပါတယ်။ မှန်ကန်စွာ လုပ်ဆောင်မယ်ဆိုရင် — ဒါက SSL ကို ထောက်ပံ့နိုင်စွမ်း မရှိတဲ့ (non-SSL-capable) clients တွေအတွက်တောင် — လုံလောက်စွာ လုံခြုံတဲ့ network connection တစ်ခုကို ပေးပါတယ်။

အရင်ဆုံး — PostgreSQL server ရှိတဲ့ machine ပေါ်မှာကိုပဲ SSH server တစ်ခု မှန်ကန်စွာ run နေပြီး — user တစ်ယောက်အနေနဲ့ `ssh` ကို သုံးပြီး log in လုပ်လို့ ရတယ်ဆိုတာ သေချာအောင် လုပ်ပါ; ဒါဆိုရင် — remote server ဆီ လုံခြုံတဲ့ tunnel (ဥမင် လမ်းကြောင်း) တစ်ခုကို တည်ဆောက်လို့ ရပါပြီ။ Secure tunnel တစ်ခုက local port တစ်ခုပေါ်မှာ listen (နားထောင်) လုပ်ပြီး — traffic (အသွားအလာ) အားလုံးကို remote machine ပေါ်က port တစ်ခုဆီ ရှေ့ဆက် ပို့ပေး (forward) ပါတယ်။ Remote port ဆီ ပို့လိုက်တဲ့ traffic က — သူ့ရဲ့ `localhost` address ပေါ်ကို ရောက်ရှိနိုင်သလို — လိုချင်ရင် မတူညီတဲ့ bind address (ချိတ်ဆွဲ အသုံးပြုမည့် address) တစ်ခုပေါ်ကိုလည်း ရောက်နိုင်ပါတယ်; အဲဒါက သင့် local machine ကနေ လာတာလို့တော့ မပေါ်ပါဘူး။ ဒီ command က client machine ကနေ `foo.com` ဆိုတဲ့ remote machine ဆီ လုံခြုံတဲ့ tunnel တစ်ခု ဖန်တီးပေးပါတယ်:

```sql
ssh -L 63333:localhost:5432 joe@foo.com
```

`-L` argument ထဲက ပထမ ဂဏန်း — 63333 — က tunnel ရဲ့ local port နံပါတ် ဖြစ်ပြီး — အသုံးမပြုရသေးတဲ့ port ဘယ်ခုမဆို ဖြစ်နိုင်ပါတယ်။ (IANA က ports 49152 ကနေ 65535 အထိကို private အသုံးပြုမှုအတွက် သီးသန့် သတ်မှတ်ထားပါတယ်။) ဒီနောက်မှာ လာတဲ့ name ဒါမှမဟုတ် IP address က — သင်ချိတ်ဆက်နေတဲ့ remote bind address ဖြစ်ပြီး — ဆိုလိုတာက default ဖြစ်တဲ့ `localhost` ပါ။ ဒုတိယ ဂဏန်း — 5432 — က tunnel ရဲ့ remote အဆုံး ဖြစ်ပြီး — ဥပမာ — သင့် database server သုံးနေတဲ့ port နံပါတ် ဖြစ်ပါတယ်။ ဒီ tunnel ကို သုံးပြီး database server ဆီ connect (ချိတ်ဆက်) လုပ်ဖို့ဆိုရင် — local machine ပေါ်က port 63333 ကို သင်က connect လုပ်ပါတယ်:

```sql
psql -h localhost -p 63333 postgres
```

Database server အတွက် ကြည့်ရင် — သင်က host `foo.com` ပေါ်က user `joe` ဖြစ်ပြီး — `localhost` bind address ကို connect လုပ်နေတာလို ပေါ်လာပါလိမ့်မယ် — ပြီးတော့ အဲဒီ user က အဲဒီ bind address ဆီ connections တွေအတွက် configure (ပြင်ဆင်သတ်မှတ်) လုပ်ထားတဲ့ authentication procedure (စစ်မှန်ကြောင်း စိစစ်ရေး လုပ်ထုံး) ဘယ်ဟာကိုမဆို သုံးပါလိမ့်မယ်။ Server က connection ကို SSL-encrypted လို့ ထင်မှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ — အကြောင်းကတော့ SSH server နဲ့ PostgreSQL server ကြားမှာ တကယ်တော့ encrypt (ကုဒ်ဝှက်) မလုပ်ထားလို့ပါ။ သူတို့က machine တစ်ခုတည်းပေါ်မှာ ရှိနေလို့ — ဒါက ထပ်ဆောင်း လုံခြုံရေး အန္တရာယ် (security risk) တစ်ခုကို မဖြစ်စေသင့်ပါဘူး။

Tunnel setup အောင်မြင်ဖို့ဆိုရင် — terminal session (terminal စက်ရှင်) တစ်ခု ဖန်တီးဖို့ `ssh` ကို သုံးဖို့ ကြိုးစားခဲ့တာနဲ့ အတူတူပဲ — `joe@foo.com` အနေနဲ့ `ssh` ကနေတစ်ဆင့် connect လုပ်ခွင့် ရှိရပါမယ်။

Port forwarding (port ရှေ့ဆက် ပို့ဆောင်ခြင်း) ကို ဒီလိုလည်း သတ်မှတ်ထားနိုင်ပါတယ်:

```sql
ssh -L 63333:foo.com:5432 joe@foo.com
```

ဒါပေမယ့် — အဲဒီအခါ database server က connection ကို သူ့ရဲ့ `foo.com` bind address ပေါ်ကို လာတာလို့ မြင်ရမှာ ဖြစ်ပြီး — အဲဒီ address ကို default setting ဖြစ်တဲ့ `listen_addresses = 'localhost'` က ဖွင့်မထားပါဘူး။ ဒါက များသောအားဖြင့် သင်လိုချင်တဲ့ ပုံစံ မဟုတ်ပါဘူး။

Login host (ဝင်ရောက်မှု host) တစ်ခုကနေတစ်ဆင့် database server ဆီ “hop” (ခုန်ကူး) လုပ်ရမယ်ဆိုရင် — ဖြစ်နိုင်တဲ့ setup တစ်ခုက ဒီလို ပုံစံမျိုး ဖြစ်နိုင်ပါတယ်:

```sql
ssh -L 63333:db.foo.com:5432 joe@shell.foo.com
```

ဒီနည်းနဲ့ ဆိုရင် — `shell.foo.com` ကနေ `db.foo.com` ဆီက connection ကို SSH tunnel က encrypt လုပ်မှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။ Network ကို နည်းလမ်း အမျိုးမျိုးနဲ့ ကန့်သတ်ထားတဲ့အခါ — SSH မှာ configuration ဖြစ်နိုင်ခြေ အတော်များများ ရှိပါတယ်။ အသေးစိတ်အတွက် SSH documentation (SSH မှတ်တမ်းစာရွက်စာတမ်း) ကို ကိုးကားပါ။

> **အကြံပြုချက်:** အခုနက ဖော်ပြခဲ့တာနဲ့ အယူအဆပိုင်း ဆင်တူတဲ့ နည်းလမ်းတစ်ခုကို သုံးပြီး လုံခြုံတဲ့ tunnels တွေ ပေးနိုင်တဲ့ application တခြား အများအပြားလည်း ရှိပါတယ်။
