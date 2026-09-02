---
title: "Debugging (အမှားရှာဖွေခြင်း)"
description: "DEBUG environment variable နဲ့ Prisma Client နဲ့ Prisma CLI ရဲ့ debug output ဖွင့်နည်း — prisma:engine / prisma:client namespace တွေရဲ့ အဓိပ္ပာယ်နဲ့ Linux, macOS, Windows ပေါ်မှာ သတ်မှတ်ပုံ ဥပမာများ"
order: 20
source: "https://www.prisma.io/docs/orm/v7/prisma-client/debugging-and-troubleshooting/debugging"
status: translated
updated: 2026-09-02
---

ဒီ page က [`DEBUG`](https://www.prisma.io/docs/orm/v7/reference/environment-variables-reference#debug) environment variable ကို သတ်မှတ်ပြီး Prisma Client ရဲ့ debugging output ကို ဘယ်လို ဖွင့်ရမလဲ ရှင်းပြပါတယ်။

`DEBUG` environment variable ကို Prisma Client ရော Prisma CLI မှာပါ debugging output ဖွင့်ဖို့ သုံးလို့ရပါတယ်။ Debugging output ကို namespace နှစ်ခုနဲ့ ထိန်းချုပ်ပါတယ်:

- `prisma:engine` — Prisma ORM [engine](https://github.com/prisma/prisma-engines/) ထဲမှာ ဖြစ်ပျက်နေတဲ့ သက်ဆိုင်ရာ debug messages တွေကို ပြပေးပါတယ်
- `prisma:client` — Prisma Client runtime ထဲမှာ ဖြစ်ပျက်နေတဲ့ သက်ဆိုင်ရာ debug messages တွေကို ပြပေးပါတယ်
- `prisma*` — Prisma Client ဒါမှမဟုတ် CLI ကနေ ထွက်တဲ့ debug messages တွေ အားလုံးကို ပြပေးပါတယ်
- `*` — debug messages အကုန်လုံးကို ပြပေးပါတယ်

Prisma CLI ကလည်း ဒီ messages တွေကို ထုတ်ပေးနိုင်ပါတယ် — CLI command တွေ (`migrate`, `db push`, `generate` စသည်) က Prisma engine တွေကို သုံးပြီး အလုပ်လုပ်တာမို့ — engine ထဲမှာ ဖြစ်ပျက်နေတာတွေကို စစ်ချင်ရင် CLI command run ချိန်မှာလည်း `prisma:engine` output တွေကို မြင်ရနိုင်ပါတယ်။

ဒီ namespace တွေ ဘာကို ဆိုလိုလဲဆိုရင် — Prisma Client မှာ အလွှာ နှစ်ခု ရှိပါတယ်: သင့် application ထဲမှာ run နေတဲ့ **Prisma Client runtime** နဲ့ database နဲ့ တိုက်ရိုက် ဆက်သွယ်တဲ့ **query engine** ပါ။ `prisma:client` က ရှေ့အလွှာ၊ `prisma:engine` က နောက်အလွှာရဲ့ အတွင်းပိုင်း ဖြစ်ပျက်မှုတွေကို ပြပါတယ် — ပြဿနာတစ်ခု ဘယ်အလွှာမှာ စတင်နေလဲ ခွဲကြည့်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

> **မှတ်ချက်:** Prisma Client ကို database ဆီ ပို့တဲ့ query တွေနဲ့ ပတ်သက်တဲ့ warning, error, info တွေကို log လုပ်ဖို့လည်း သတ်မှတ်လို့ရပါတယ် — [Logging (Prisma ရဲ့ Log)](/docs/prisma/logging) မှာ ကြည့်ပါ။

## Debugging output ကို ဘယ်အချိန်မှာ သုံးမလဲ

`DEBUG` က logging နဲ့ သဘောသဘာဝ ချင်းမတူပါဘူး — query level logging က database ဆီ ပို့လိုက်တဲ့ SQL, params, duration လိုမျိုး *application-level* အချက်အလက်တွေကို ထုတ်ပေးပြီး — `DEBUG` output က Prisma Client နဲ့ engine ရဲ့ အတွင်းပိုင်း diagnostic messages တွေကို ထုတ်ပေးပါတယ်။ ဒါကြောင့် — Prisma ရဲ့ အပြုအမူက မျှော်လင့်ထားတာနဲ့ မတူတဲ့အခါ၊ error တစ်ခုက ဘယ်အဆင့်မှာ စတင်နေလဲ ခြေရာခံချင်တဲ့အခါ၊ ဒါမှမဟုတ် bug report / support ပေးပို့ဖို့ ဖြစ်ပျက်နေတာတွေကို စုချင်တဲ့အခါမျိုးမှာ debug output ကို ဖွင့်ပါတယ်။

### ဘယ် namespace ကို ရွေးမလဲ

- Engine နဲ့ ဆက်သွယ်မှု ဒါမှမဟုတ် database query ပိုင်း ပြဿနာ သံသယ ရှိနေရင် — `prisma:engine` ကို ဖွင့်ပါ။ ဒီ namespace က engine ထဲမှာ ဖြစ်ပျက်နေတဲ့ messages တွေကို ပြတာမို့ — Prisma Client က database ကို ဘယ်လို ဆက်သွယ်နေလဲ၊ query engine အလွှာမှာ ဘာတွေ ဖြစ်နေလဲ စစ်ကြည့်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။
- Client runtime ရဲ့ အပြုအမူ ပိုင်း ပြဿနာ သံသယ ရှိနေရင် — `prisma:client` ကို ဖွင့်ပါ။ Client instance တစ်ခု ဘယ်လို ဖွဲ့စည်းနေလဲ၊ runtime ထဲမှာ ဘာတွေ ဖြစ်ပျက်နေလဲဆိုတဲ့ messages တွေက ဒီ namespace အောက်ကပါ။
- ဘယ်နေရာမှာ ဖြစ်နေလဲ မသေချာဘူးဆိုရင် — `prisma*` နဲ့ နှစ်ခုလုံး တစ်ပြိုင်နက် ဖွင့်ပြီး log တွေကို ကြည့်ပါ။

Debug output ပမာဏက namespace အလိုက် ကွာပါတယ် — engine-level messages တွေက ပမာဏ များတတ်ပြီး output ကို ဖတ်ရခက်စေနိုင်ပါတယ်။ စတင်ချင်ရင် `prisma:client` တစ်ခုတည်းနဲ့ စပြီး လိုအပ်မှသာ namespace တွေ ချဲ့တာ ပိုအဆင်ပြေပါတယ်။

Debug messages တွေက Prisma Client ရဲ့ query logging နဲ့ အတူတကွ သုံးလို့လည်း ရပါတယ် — [Logging (Prisma ရဲ့ Log)](/docs/prisma/logging) မှာ ပြထားတဲ့ `log` option နဲ့ query level ကို ဖွင့်ထားပြီး — `DEBUG` က client/engine ရဲ့ အတွင်းပိုင်း messages တွေကိုပါ တွဲကြည့်ရင် — ပြဿနာတစ်ခုက query ကိုယ်တိုင်ကလား၊ Prisma ရဲ့ အလွှာတစ်ခုခုကလား ဆိုတာ ခွဲခြားသိမြင်ရပါတယ်။

## DEBUG environment variable သတ်မှတ်ခြင်း

bash (Linux / macOS) မှာ debugging option တွေကို ဒီလို သတ်မှတ်ပါတယ်:

```bash
# enable only `prisma:engine`-level debugging output
export DEBUG="prisma:engine"

# enable only `prisma:client`-level debugging output
export DEBUG="prisma:client"

# enable both `prisma-client`- and `engine`-level debugging output
export DEBUG="prisma:client,prisma:engine"
```

`prisma:client` နဲ့ `prisma:engine` နှစ်ခုလုံးကို တစ်ပြိုင်နက် ဖွင့်ချင်ရင် — namespace နှစ်ခုကို comma ခံပြီး `prisma:client,prisma:engine` လို့ ထည့်ပါတယ်။

Prisma ရဲ့ debug option တွေ အားလုံးကို ဖွင့်ချင်ရင်တော့ `DEBUG` ကို `prisma*` လို့ သတ်မှတ်ပါ:

```bash
export DEBUG="prisma*"
```

Windows မှာတော့ `export` အစား `set` ကို သုံးပါ:

```bash
set DEBUG="prisma*"
```

Debug option တွေ *အကုန်လုံး* ဖွင့်ချင်ရင် — Prisma သာမက `DEBUG` ကို သုံးတဲ့ တခြား library တွေရဲ့ output ပါ — `DEBUG` ကို `*` လို့ သတ်မှတ်ပါ:

```bash
export DEBUG="*"
```

`*` က debug messages တွေ အများကြီး ထွက်စေနိုင်လို့ console ကို ဖြည့်လွှမ်းသွားတတ်ပါတယ် — ပုံမှန် debugging မှာ `prisma:client` ဒါမှမဟုတ် `prisma:engine` လို namespace တစ်ခုချင်းစီနဲ့ စပြီး လိုအပ်မှ ချဲ့တာက ပိုပြီး ဖတ်လို့ကောင်းပါတယ်။

သတိထားစရာတစ်ခုက — `DEBUG` ကို environment variable တစ်ခုအနေနဲ့ process တစ်ခုလုံးအတွက် သတ်မှတ်တာမို့ သက်ရောက်မှု ကျယ်ပြန့်ပါတယ်။ Production server တစ်ခုမှာ ပုံမှန် ဖွင့်ထားရင် debug messages တွေက log တွေကို ဖြည့်လွှမ်းပြီး ဖတ်ရခက်စေနိုင်လို့ — ပြဿနာ ရှာနေချိန်မှာပဲ ခဏ ဖွင့်ပြီး ပြီးရင် ပိတ်ထားတာက ပုံမှန် အလေ့အကျင့်ပါ။ Process တစ်ခုအတွက်ပဲ ဖွင့်ချင်ရင် — command တစ်ခုကို run တဲ့အခါ `DEBUG="prisma:client" npm run start` လို command ရှေ့မှာ prefix အနေနဲ့ ထည့်ပြီး run လို့လည်း ရပါတယ်။

## ဆက်စပ်ဖတ်ရန်

- [Logging (Prisma ရဲ့ Log)](/docs/prisma/logging) — Prisma Client က ပို့တဲ့ query တွေကို log level (query, info, warn, error) နဲ့ မှတ်တမ်းတင်ခြင်း
- [Prisma Client အသုံးပြုခြင်း](/docs/prisma/prisma-client) — client instance သတ်မှတ်ပုံနဲ့ ဘုံ setup ပုံစံများ
- [`DEBUG` — Environment variables reference](https://www.prisma.io/docs/orm/v7/reference/environment-variables-reference#debug) — `DEBUG` variable အကြောင်း official reference
- [Handling exceptions and errors](https://www.prisma.io/docs/orm/v7/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors) — Prisma Client မှာ exception နဲ့ error တွေကို ကိုင်တွယ်ခြင်း
- [`prisma debug` command](https://www.prisma.io/docs/cli/v7/debug) — schema path, engine binary, environment variable, cache directory အပါအဝင် Prisma ရဲ့ debug အချက်အလက်တွေကို ပြသခြင်း
