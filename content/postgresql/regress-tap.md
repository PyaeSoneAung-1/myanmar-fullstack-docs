---
title: "TAP Tests (TAP စမ်းသပ်မှုများ)"
description: "PostgreSQL ရဲ့ TAP tests များ အကြောင်း — Perl TAP tools များကို သုံးပြီး `prove` testing program ဖြင့် run လုပ်ခြင်း (`PROVE_FLAGS` နှင့် `PROVE_TESTS` ဆိုသည့် make variables များ), လိုအပ်ချက်များ (`IPC::Run` Perl module, `--enable-tap-tests` configure option), `make installcheck` နှင့် `make check` တို့၏ အပြုအမူ ကွာခြားချက် (ယာယီ test servers များ စတင်ခြင်း, traditional non-TAP infrastructure နှင့် ရောနှောခြင်း), environment variables များ (`PG_TEST_NOCLEAN` — data directories များ ထိန်းသိမ်းခြင်း, `PG_TEST_TIMEOUT_DEFAULT` — 180-second timeout ကြာချိန် ပြောင်းလဲခြင်း) အကြောင်း ရှင်းလင်းချက်"
order: 202
source: "https://www.postgresql.org/docs/current/regress-tap.html"
status: translated
updated: 2026-09-06
---

## 31.4. TAP Tests (TAP စမ်းသပ်မှုများ)

- **31.4.1. Environment Variables (environment variables များ)**

စမ်းသပ်မှုမျိုးစုံ — အထူးသဖြင့် `src/bin` အောက်က client program tests (client program စမ်းသပ်မှုများ) တွေက Perl ရဲ့ TAP tools (TAP ကိရိယာများ) တွေကို သုံးပြီး — Perl testing program (Perl စမ်းသပ်မှု program) တစ်ခုဖြစ်တဲ့ `prove` ကို သုံးပြီး run လုပ်ပါတယ်။ `make` variable (make variable) တစ်ခုဖြစ်တဲ့ `PROVE_FLAGS` ကို သတ်မှတ်ခြင်းအားဖြင့် `prove` ဆီ command-line options (command-line option များ) တွေ ပေးပို့နိုင်ပါတယ် — ဥပမာ:

```sql
make -C src/bin check PROVE_FLAGS='--timer'
```

`prove` ရဲ့ manual page (လက်စွဲ စာမျက်နှာ) မှာ နောက်ထပ် အချက်အလက်တွေကို ကြည့်နိုင်ပါတယ်။

`make` variable တစ်ခုဖြစ်တဲ့ `PROVE_TESTS` ကိုတော့ — `prove` ကို ခေါ်ယူ လုပ်ဆောင်နေတဲ့ `Makefile` နဲ့ ဆက်စပ် (relative) တဲ့ paths တွေရဲ့ whitespace-separated (နေရာလွတ်များဖြင့် ပိုင်းခြားထားသော) စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ သုံးနိုင်ပြီး — default ဖြစ်တဲ့ `t/*.pl` အစား သတ်မှတ်ထားတဲ့ tests အစုအဝေးတစ်ခုကို run လုပ်စေနိုင်ပါတယ်။ ဥပမာ:

```sql
make check PROVE_TESTS='t/001_test1.pl t/003_test3.pl'
```

TAP tests တွေက Perl module (Perl module) တစ်ခုဖြစ်တဲ့ `IPC::Run` ကို လိုအပ်ပါတယ်။ ဒီ module ကို [CPAN](https://metacpan.org/dist/IPC-Run) ဒါမှမဟုတ် operating system (လည်ပတ်မှုစနစ်) package တစ်ခုကနေ ရယူနိုင်ပါတယ်။ ထို့ပြင် — TAP tests တွေကို run လုပ်နိုင်ဖို့ PostgreSQL ကို `--enable-tap-tests` option နဲ့ configure (ပြင်ဆင် သတ်မှတ်) လုပ်ထားဖို့လည်း လိုအပ်ပါတယ်။

ယေဘုယျအားဖြင့် ပြောရရင် — `make installcheck` လို့ ပြောရင် TAP tests တွေက ယခင် install (တပ်ဆင်) လုပ်ပြီးသား installation tree (installation tree — တပ်ဆင်မှု ဖွဲ့စည်းပုံ) တစ်ခုထဲက executables (လုပ်ဆောင်နိုင်သော ဖိုင်များ) တွေကို စမ်းသပ်မှာ ဖြစ်ပြီး — `make check` လို့ ပြောရင်တော့ လက်ရှိ sources (ရင်းမြစ်များ) တွေကနေ installation tree အသစ် တစ်ခုကို တည်ဆောက်မှာ ဖြစ်ပါတယ်။ ဘယ်အခြေအနေမှာပဲ ဖြစ်ဖြစ် — local instance (data directory — ဒေတာ directory) တစ်ခုကို စတင် (initialize) လုပ်ပြီး — အဲဒီထဲမှာ server တစ်ခုကို ခဏတာ run လုပ်ပါလိမ့်မယ်။ ဒီ tests တချို့က server တစ်ခုထက် ပိုပြီး run လုပ်ပါတယ်။ ဒါကြောင့် — ဒီ tests တွေက resource (အရင်းအမြစ်) အတော်လေး များများ လိုအပ်နိုင်ပါတယ်။

`make installcheck` လို့ ပြောတဲ့အခါမှာတောင် — TAP tests တွေက test server(s) (စမ်းသပ်မှု server များ) ကို စတင်မှာ ဖြစ်တာကို နားလည်ထားဖို့ အရေးကြီးပါတယ်; ဒါက — အဲဒီကိစ္စမျိုးမှာ လည်ပတ်နေပြီးသား test server တစ်ခုကို သုံးဖို့ မျှော်လင့်ထားတဲ့ — ရိုးရာ non-TAP testing infrastructure (testing infrastructure — စမ်းသပ်မှု အခြေခံ အဆောက်အအုံ) နဲ့ မတူပါဘူး။ PostgreSQL ရဲ့ subdirectories (အခွဲ directory များ) တချို့မှာ ရိုးရာ ပုံစံနဲ့ TAP-ပုံစံ tests တွေ နှစ်မျိုးလုံး ပါဝင်တာမို့ — `make installcheck` က ယာယီ servers တွေနဲ့ လည်ပတ်နေပြီးသား test server တို့ဆီက ရလဒ်တွေ ရောနှောနေတဲ့ အစုတစ်ခုကို ထုတ်ပေးမှာ ဖြစ်ပါတယ်။

### 31.4.1. Environment Variables (environment variables များ)

Data directories (data directory များ) တွေကို test filename (test ဖိုင် နာမည်) အလိုက် နာမည်ပေးပြီး — test တစ်ခု ကျရှုံးခဲ့ရင် ထိန်းသိမ်း ထားရှိမှာ ဖြစ်ပါတယ်။ `PG_TEST_NOCLEAN` environment variable (ပတ်ဝန်းကျင် variable) ကို သတ်မှတ်ထားမယ်ဆိုရင်တော့ — test ရလဒ် ဘယ်လိုပဲ ဖြစ်ဖြစ် data directories တွေကို ထိန်းသိမ်း ထားရှိမှာ ဖြစ်ပါတယ်။ ဥပမာ — pg_dump tests တွေကို run လုပ်တဲ့အခါ test ရလဒ်တွေ မသက်ဆိုင်ဘဲ data directory ကို ထိန်းသိမ်းထားခြင်း:

```sql
PG_TEST_NOCLEAN=1 make -C src/bin/pg_dump check
```

ဒီ environment variable က test ရဲ့ temporary directories (ယာယီ directory များ) တွေကို ဖယ်ရှားခံရခြင်းကနေလည်း ကာကွယ်ပေးပါတယ်။

Test suites (စမ်းသပ်မှု အစုအဝေးများ) ထဲက လုပ်ဆောင်မှုတွေ အများအပြားက 180-second timeout (စက္ကန့် ၁၈၀ ကြာ အချိန်ကန့်သတ်ချက်) ကို သုံးပြီး — နှေးကွေးတဲ့ hosts (host များ) တွေမှာတော့ load (ဝန်) ကြောင့် ဖြစ်ပေါ်လာတဲ့ timeouts (အချိန်ကုန်ဆုံးမှုများ) တွေကို ဖြစ်စေနိုင်ပါတယ်။ `PG_TEST_TIMEOUT_DEFAULT` environment variable ကို ပိုမြင့်တဲ့ ဂဏန်း တစ်ခုဆီ သတ်မှတ်ခြင်းက — ဒါကို ရှောင်ရှားဖို့ default ကို ပြောင်းလဲ ပေးပါလိမ့်မယ်။
