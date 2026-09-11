---
title: "Running the Tests (စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)"
description: "PostgreSQL ရဲ့ regression tests များကို run လုပ်ပုံ အကြောင်း — build tree အတွင်းက ယာယီ installation တစ်ခုနဲ့ စမ်းသပ်ခြင်း (`make check`, parallel/sequential modes, “+”/“-” prefixes, `MAX_CONNECTIONS`), ရှိပြီးသား installation တစ်ခုကို သုံးပြီး စမ်းသပ်ခြင်း (`make installcheck`, `regression` database, `regress_` နှင့် စတင်သော objects များ), ထပ်ဆောင်း test suites များ (`make check-world`, module အလိုက် tests များ, TAP infrastructure, `PG_TEST_EXTRA` တန်ဖိုးများ — kerberos, ldap, libpq_encryption, ssl စသည်), locale နှင့် encoding သတ်မှတ်ခြင်း (LANG, LC_COLLATE, LC_CTYPE, `ENCODING`), စိတ်ကြိုက် server settings များ (`PG_TEST_INITDB_EXTRA_OPTS`, `PGOPTIONS`, pre-written `postgresql.conf`) နှင့် `EXTRA_TESTS` ဖြင့် အပို test files များ run လုပ်ခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 245
source: "https://www.postgresql.org/docs/current/regress-run.html"
status: translated
updated: 2026-09-06
---

## 31.1. Running the Tests (စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)

- **31.1.1. Running the Tests Against a Temporary Installation (ယာယီ installation တစ်ခုကို သုံးပြီး စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)**
- **31.1.2. Running the Tests Against an Existing Installation (ရှိပြီးသား installation တစ်ခုကို သုံးပြီး စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)**
- **31.1.3. Additional Test Suites (ထပ်ဆောင်း စမ်းသပ်မှု အစုအဝေးများ)**
- **31.1.4. Locale and Encoding (locale နှင့် encoding)**
- **31.1.5. Custom Server Settings (စိတ်ကြိုက် server settings များ)**
- **31.1.6. Extra Tests (အပို စမ်းသပ်မှုများ)**

Regression tests (ရှိပြီးသား လုပ်ဆောင်ချက်များ ပျက်စီးမသွားကြောင်း စစ်ဆေးသော စမ်းသပ်မှုများ) တွေကို — ထည့်သွင်းပြီး run လုပ်နေပြီးသား server တစ်ခုကို သုံးပြီး ဖြစ်စေ — ဒါမှမဟုတ် build tree (တည်ဆောက်မှု directory ဖွဲ့စည်းပုံ) အတွင်းမှာ ယာယီ installation (ယာယီ တပ်ဆင်မှု) တစ်ခုကို သုံးပြီး ဖြစ်စေ run လုပ်နိုင်ပါတယ်။ ထို့ပြင် — စမ်းသပ်မှုများကို run လုပ်ရန် “parallel” (အပြိုင်) နှင့် “sequential” (အစဉ်လိုက်) ဆိုသည့် mode နှစ်မျိုး ရှိပါတယ်။ Sequential method က test script တစ်ခုချင်းစီကို တစ်ခုတည်း သီးခြား run လုပ်ပြီး — parallel method ကတော့ server processes အများအပြားကို စတင်ပြီး — စမ်းသပ်မှု အုပ်စုများကို အပြိုင် run လုပ်ပါတယ်။ Parallel testing က interprocess communication (process အချင်းချင်း ဆက်သွယ်ရေး) နှင့် locking (lock လုပ်ခြင်း) တို့ မှန်ကန်စွာ အလုပ်လုပ်နေကြောင်း ယုံကြည်မှု ပိုမို ရှိစေပါတယ်။ Test အချို့ကတော့ — စမ်းသပ်မှုက လိုအပ်တဲ့အခါမျိုးမှာ — “parallel” mode ထဲမှာပင် အစဉ်လိုက် (sequentially) run လုပ်ရသည်လည်း ရှိပါတယ်။

### 31.1.1. Running the Tests Against a Temporary Installation (ယာယီ installation တစ်ခုကို သုံးပြီး စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)

Build လုပ်ပြီးသော်လည်း installation မလုပ်ရသေးခင် — parallel regression tests များကို run လုပ်ရန် — top-level directory (အဆင့်အမြင့်ဆုံး directory) ထဲမှာ အောက်ပါ command ကို ရိုက်ထည့်ပါ:

```sql
make check
```

(ဒါမှမဟုတ် `src/test/regress` ဆီ ပြောင်းပြီး အဲဒီမှာ command ကို run လုပ်နိုင်ပါတယ်။) အပြိုင် run လုပ်တဲ့ tests တွေကို “+” နဲ့ ရှေ့ဆွဲပြီး — အစဉ်လိုက် run လုပ်တဲ့ tests တွေကိုတော့ “-” နဲ့ ရှေ့ဆွဲပါတယ်။ အဆုံးမှာ အောက်ပါလို တစ်ခုခုကို မြင်ရပါလိမ့်မယ်:

```sql
# All 213 tests passed.
```

ဒါမှမဟုတ်ရင် — ဘယ် tests တွေ ကျရှုံးခဲ့တယ်ဆိုတဲ့ note (မှတ်ချက်) တစ်ခုကို မြင်ရပါလိမ့်မယ်။ “failure” (ကျရှုံးမှု) တစ်ခုက ပြင်းထန်တဲ့ ပြဿနာ တစ်ခုကို ကိုယ်စားပြုတယ်လို့ မယူဆခင် — အောက်မှာ ဖော်ပြထားတဲ့ [အပိုင်း 31.2](https://www.postgresql.org/docs/current/regress-evaluation.html) ကို ဦးစွာ ကြည့်ပါ။

ဒီ test method က ယာယီ server တစ်ခုကို run လုပ်တာမို့ — build ကို root user အဖြစ် လုပ်ဆောင်ခဲ့မယ်ဆိုရင် ဒါက အလုပ်လုပ်မှာ မဟုတ်ပါဘူး — အကြောင်းကတော့ server က root အဖြစ် စတင်မှာ မဟုတ်လို့ပါ။ အကြံပြုထားတဲ့ လုပ်ထုံးလုပ်နည်းကတော့ — build ကို root အဖြစ် မလုပ်ဆောင်ရန် ဖြစ်ပြီး — ဒါမှမဟုတ် installation ပြီးမြောက်ပြီးမှ စမ်းသပ်မှုများကို လုပ်ဆောင်ရန် ဖြစ်ပါတယ်။

PostgreSQL ကို — PostgreSQL အဟောင်း version တစ်ခု ရှိပြီးသား နေရာ တစ်ခုဆီ install လုပ်ရန် configure လုပ်ထားပြီး — version အသစ်ကို install မလုပ်ခင် `make check` ကို လုပ်ဆောင်မယ်ဆိုရင် — program အသစ်တွေက ရှိပြီးသား installation ထဲက shared libraries (မျှဝေသုံး libraries) တွေကို သုံးဖို့ ကြိုးစားတာမို့ — tests တွေ ကျရှုံးတာ တွေ့ရှိနိုင်ပါတယ်။ (ပုံမှန် လက္ခဏာတွေကတော့ undefined symbols (သတ်မှတ်ထားခြင်း မရှိသော symbols) တွေအကြောင်း ညည်းညူမှုများ ဖြစ်ပါတယ်။) Installation အဟောင်းကို overwrite (အစားထိုး ရေးသား) မလုပ်ခင် tests တွေကို run လုပ်လိုပါက — `configure --disable-rpath` ဖြင့် build လုပ်ရန် လိုအပ်ပါတယ်။ သို့သော် — နောက်ဆုံး installation အတွက်တော့ ဒီ option ကို သုံးရန် အကြံမပြုပါဘူး။

Parallel regression test က သင့် user ID အောက်မှာ process များစွာကို စတင်ပါတယ်။ လက်ရှိတွင် — အပြိုင် run နိုင်သည့် အများဆုံး ပမာဏက parallel test scripts နှစ်ဆယ် ဖြစ်ပြီး — ဆိုလိုသည်မှာ process လေးဆယ် ဖြစ်ပါတယ်: test script တစ်ခုစီအတွက် server process တစ်ခုနှင့် psql process တစ်ခု ရှိပါတယ်။ ဒါကြောင့် — သင့် system က user တစ်ဦးချင်းစီအတွက် process အရေအတွက် ကန့်သတ်ချက် သတ်မှတ်ထားရင် — ဒီ ကန့်သတ်ချက်က အနည်းဆုံး ငါးဆယ်လောက် ရှိအောင် သေချာ စစ်ဆေးပါ — မဟုတ်ရင် parallel test ထဲမှာ ကျပန်း ဖြစ်ပုံရတဲ့ failures (ကျရှုံးမှုများ) တွေ ကြုံရနိုင်ပါတယ်။ ကန့်သတ်ချက်ကို မြှင့်တင်ဖို့ မဖြစ်နိုင်တဲ့ အခြေအနေမှာ — `MAX_CONNECTIONS` parameter ကို သတ်မှတ်ခြင်းအားဖြင့် parallelism ရဲ့ အတိုင်းအတာကို လျှော့ချနိုင်ပါတယ်။ ဥပမာ:

```sql
make MAX_CONNECTIONS=10 check
```

ဆိုတာက tests ဆယ်ခုထက် ပိုပြီး တစ်ပြိုင်နက် (concurrently) run လုပ်မှာ မဟုတ်ပါဘူး။

### 31.1.2. Running the Tests Against an Existing Installation (ရှိပြီးသား installation တစ်ခုကို သုံးပြီး စမ်းသပ်မှုများ လုပ်ဆောင်ခြင်း)

Installation ပြီးမြောက်ပြီးနောက် tests တွေကို run လုပ်ရန် ([အခန်း 17](https://www.postgresql.org/docs/current/installation.html) ကို ကြည့်ပါ) — [အခန်း 18](https://www.postgresql.org/docs/current/runtime.html) မှာ ရှင်းပြထားသည့်အတိုင်း data directory တစ်ခုကို initialize လုပ်ပြီး server ကို စတင်ပါ — ထို့နောက် အောက်ပါ command ကို ရိုက်ထည့်ပါ:

```sql
make installcheck
```

သို့မဟုတ် parallel test တစ်ခုအတွက်ဆိုရင်:

```sql
make installcheck-parallel
```

Tests တွေက — `PGHOST` နှင့် `PGPORT` environment variables တွေက အခြားသို့ လမ်းညွှန် မပေးဘူးဆိုရင် — local host နှင့် default port number မှာ server ကို ဆက်သွယ်ရန် မျှော်လင့်ပါလိမ့်မယ်။ Tests တွေကို `regression` ဆိုတဲ့ နာမည် ရှိတဲ့ database တစ်ခုထဲမှာ run လုပ်မှာ ဖြစ်ပြီး — ဒီ နာမည်နဲ့ ရှိပြီးသား database ဘယ်ခုကိုမဆို drop (ဖျက်) လုပ်ပစ်မှာ ဖြစ်ပါတယ်။

Tests တွေက ထို့ပြင် — roles, tablespaces (tablespace များ) နှင့် subscriptions (စာရင်းသွင်း ခံယူမှုများ) လို — cluster တစ်ခုလုံးနှင့် ဆိုင်သော objects တချို့ကိုလည်း ခဏတာ ဖန်တီးပါလိမ့်မယ်။ ဒီ objects တွေရဲ့ နာမည်တွေက `regress_` နဲ့ စတင်ပါလိမ့်မယ်။ ဒီလို နာမည်မျိုးနဲ့ တကယ့် global objects တွေ ရှိနေတဲ့ installation တစ်ခုမှာ `installcheck` mode ကို သုံးခြင်းကို သတိထားပါ။

### 31.1.3. Additional Test Suites (ထပ်ဆောင်း စမ်းသပ်မှု အစုအဝေးများ)

`make check` နှင့် `make installcheck` commands တွေက — PostgreSQL server ရဲ့ built-in (ထည့်သွင်းပြီးသား) လုပ်ဆောင်ချက်များကို စစ်ဆေးတဲ့ — “core” regression tests တွေကိုပဲ run လုပ်ပါတယ်။ Source distribution (ရင်းမြစ် ဖြန့်ဝေမှု) ထဲမှာ ထပ်ဆောင်း test suites တွေ အများအပြား ပါဝင်ပြီး — အများစုက optional procedural languages (ရွေးချယ်နိုင်သော procedural languages) လို add-on လုပ်ဆောင်ချက်တွေနဲ့ သက်ဆိုင်ပါတယ်။

Build လုပ်ရန် ရွေးချယ်ထားတဲ့ modules တွေအတွက် သက်ဆိုင်တဲ့ test suites အားလုံးကို — core tests တွေ အပါအဝင် — run လုပ်ဖို့ဆိုရင် build tree ရဲ့ ထိပ်ပိုင်းမှာ အောက်ပါ commands တွေထဲက တစ်ခုကို ရိုက်ထည့်ပါ:

```sql
make check-world
make installcheck-world
```

ဒီ commands တွေက — အသီးသီး — `make check` နှင့် `make installcheck` အတွက် အရင်က ရှင်းပြခဲ့သလိုပဲ — ယာယီ servers တွေ သို့မဟုတ် ရှိပြီးသား server တစ်ခုကို သုံးပြီး tests တွေကို run လုပ်ပါတယ်။ နည်းလမ်းတစ်ခုစီအတွက် အရင်က ရှင်းပြခဲ့တဲ့ တခြား ထည့်သွင်း စဉ်းစားစရာတွေကလည်း အတူတူပဲ ဖြစ်ပါတယ်။ `make check-world` က tested module တစ်ခုစီအတွက် သီးခြား instance (temporary data directory — ယာယီ data directory) တစ်ခုကို တည်ဆောက်တာမို့ — `make installcheck-world` ထက် အချိန်နှင့် disk space ပိုမို လိုအပ်တာ သတိပြုပါ။

CPU cores အများအပြား ရှိပြီး — operating system ဘက်က တင်းကျပ်တဲ့ ကန့်သတ်ချက်တွေ မရှိတဲ့ — ခေတ်မီ စက်တစ်ခုမှာဆိုရင် — parallelism (အပြိုင် လုပ်ဆောင်မှု) နဲ့ အရာရာကို သိသိသာသာ မြန်ဆန်အောင် လုပ်နိုင်ပါတယ်။ Tests အားလုံးကို run လုပ်ဖို့ PostgreSQL developers အများစု တကယ် သုံးကြတဲ့ နည်းလမ်းကတော့ အောက်ပါလို မျိုး ဖြစ်ပါတယ်:

```sql
make check-world -j8 >/dev/null
```

`-j` ကန့်သတ်ချက်ကို ရရှိနိုင်တဲ့ cores အရေအတွက်နဲ့ နီးစပ် ဒါမှမဟုတ် အနည်းငယ် ပိုများတဲ့ တန်ဖိုးနဲ့ သုံးပါတယ်။ Stdout ကို ဖယ်ရှားပစ်တာက — အောင်မြင်မှု အတည်ပြုချင်ရုံ သက်သက်ဆိုရင် စိတ်ဝင်စားစရာ မဟုတ်တဲ့ စကားများမှုတွေကို ဖယ်ရှားပေးပါတယ်။ (ကျရှုံးမှု ဖြစ်ရပ်မှာ — ဘယ်နေရာကို ပိုပြီး အနီးကပ် စစ်ဆေးရမလဲ ဆုံးဖြတ်ဖို့ stderr messages တွေက များသောအားဖြင့် လုံလောက်ပါတယ်။)

တနည်းအားဖြင့် — build tree ရဲ့ သင့်လျော်တဲ့ subdirectory (အခွဲ directory) ထဲမှာ `make check` ဒါမှမဟုတ် `make installcheck` ကို ရိုက်ထည့်ပြီး — test suite တစ်ခုချင်းစီကို သီးခြား run လုပ်နိုင်ပါတယ်။ `make installcheck` က core server တင်မက — သက်ဆိုင်တဲ့ module(s) တွေကိုပါ install လုပ်ပြီးသား ဖြစ်တယ်လို့ ယူဆတာ သတိရပါ။

ဒီနည်းနဲ့ ခေါ်ယူ run လုပ်နိုင်တဲ့ ထပ်ဆောင်း tests တွေထဲမှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

- Optional procedural languages များအတွက် regression tests တွေ။ ဒါတွေကို src/pl အောက်မှာ တည်ရှိပါတယ်။
- Contrib modules များအတွက် regression tests တွေ — contrib အောက်မှာ တည်ရှိပါတယ်။ Contrib modules တိုင်းမှာ tests တွေ ရှိတာ မဟုတ်ပါဘူး။
- Interface libraries (interface စာကြည့်တိုက်များ) အတွက် regression tests တွေ — src/interfaces/libpq/test နှင့် src/interfaces/ecpg/test မှာ တည်ရှိပါတယ်။
- Core က ထောက်ပံ့တဲ့ authentication methods များအတွက် tests တွေ — src/test/authentication မှာ တည်ရှိပါတယ်။ (ထပ်ဆောင်း authentication နှင့် ဆိုင်တဲ့ tests တွေအတွက် အောက်မှာ ကြည့်ပါ။)
- Concurrent sessions (တစ်ပြိုင်နက် session များ) တွေရဲ့ အပြုအမူကို အလေးထား စမ်းသပ်တဲ့ tests တွေ — src/test/isolation မှာ တည်ရှိပါတယ်။
- Crash recovery (ပျက်ကျမှု ပြန်လည် ထူထောင်ရေး) နှင့် physical replication (ရုပ်ပိုင်း ပုံတူပွားမှု) အတွက် tests တွေ — src/test/recovery မှာ တည်ရှိပါတယ်။
- Logical replication အတွက် tests တွေ — src/test/subscription မှာ တည်ရှိပါတယ်။
- Client programs များ၏ tests တွေ — src/bin အောက်မှာ တည်ရှိပါတယ်။

`installcheck` mode ကို သုံးတဲ့အခါ — ဒီ tests တွေက `regression` ဆိုတဲ့ စကားလုံး ပါဝင်တဲ့ နာမည်တွေ ရှိတဲ့ test databases တွေကို ဖန်တီးပြီး ဖျက်ဆီးပါလိမ့်မယ် — ဥပမာ `pl_regression` ဒါမှမဟုတ် `contrib_regression` တို့ ဖြစ်ပါတယ်။ ဒီလို နာမည်မျိုးနဲ့ test မဟုတ်တဲ့ databases တွေ ရှိနေတဲ့ installation တစ်ခုမှာ `installcheck` mode ကို သုံးခြင်းကို သတိထားပါ။

ဒီ အရန် (auxiliary) test suites တချို့က [အပိုင်း 31.4](https://www.postgresql.org/docs/current/regress-tap.html) မှာ ရှင်းပြထားတဲ့ TAP infrastructure (TAP အခြေခံ အဆောက်အအုံ) ကို သုံးပါတယ်။ TAP-based tests တွေကို — PostgreSQL ကို `--enable-tap-tests` option နဲ့ configure လုပ်ထားမှသာ run လုပ်ပါတယ်။ ဒါက development အတွက် အကြံပြုထားပေမယ့် — သင့်တော်တဲ့ Perl installation တစ်ခု မရှိဘူးဆိုရင် ချန်လှပ်ထားနိုင်ပါတယ်။

Test suites တချို့ကို default အနေနဲ့ run မလုပ်ပါဘူး — ၎င်းတို့က multiuser system (သုံးစွဲသူ အများအပြား ရှိသော system) ပေါ်မှာ run လုပ်ဖို့ လုံခြုံမှု မရှိလို့ ဖြစ်စေ — အထူး software တစ်ခု လိုအပ်လို့ ဖြစ်စေ — ဒါမှမဟုတ် resources (အရင်းအမြစ်များ) အင်အား သုံးစွဲမှု များလို့ ဖြစ်စေ ဖြစ်ပါတယ်။ ဘယ် test suites တွေကို ထပ်ဆောင်း run လုပ်မလဲ ဆုံးဖြတ်ဖို့ — `make` variable သို့မဟုတ် environment variable ဖြစ်တဲ့ `PG_TEST_EXTRA` ကို whitespace နဲ့ ပိုင်းခြားထားတဲ့ စာရင်း (list) တစ်ခုအဖြစ် သတ်မှတ်နိုင်ပါတယ် — ဥပမာ:

```sql
make check-world PG_TEST_EXTRA='kerberos ldap ssl load_balance libpq_encryption'
```

လက်ရှိ ထောက်ပံ့ထားတဲ့ တန်ဖိုးတွေကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

- **kerberos** — src/test/kerberos အောက်မှာ ရှိတဲ့ test suite ကို run လုပ်ပါတယ်။ ဒါက MIT Kerberos installation တစ်ခု လိုအပ်ပြီး — TCP/IP listen sockets (နားဆင် socket များ) တွေကို ဖွင့်ပါတယ်။
- **ldap** — src/test/ldap အောက်က test suite ကို run လုပ်ပါတယ်။ ဒါက OpenLDAP installation တစ်ခု လိုအပ်ပြီး — TCP/IP listen sockets တွေကို ဖွင့်ပါတယ်။
- **libpq_encryption** — src/interfaces/libpq/t/005_negotiate_encryption.pl test ကို run လုပ်ပါတယ်။ ဒါက TCP/IP listen sockets တွေကို ဖွင့်ပါတယ်။ PG_TEST_EXTRA ထဲမှာ kerberos လည်း ပါဝင်နေရင် — MIT Kerberos installation တစ်ခု လိုအပ်တဲ့ ထပ်ဆောင်း tests တွေကိုလည်း enable (ဖွင့်) လုပ်ပေးပါတယ်။
- **load_balance** — src/interfaces/libpq/t/004_load_balance_dns.pl test ကို run လုပ်ပါတယ်။ ဒါက system ရဲ့ hosts file ကို တည်းဖြတ်ရန် လိုအပ်ပြီး — TCP/IP listen sockets တွေကို ဖွင့်ပါတယ်။
- **oauth** — src/test/modules/oauth_validator အောက်က test suite ကို run လုပ်ပါတယ်။ ဒါက HTTPS ဖြင့် run လုပ်တဲ့ test server တစ်ခုအတွက် TCP/IP listen sockets တွေကို ဖွင့်ပါတယ်။
- **regress_dump_restore** — src/bin/pg_upgrade/t/002_pg_upgrade.pl ထဲက ထပ်ဆောင်း test suite တစ်ခုကို run လုပ်ပြီး — ၎င်းက regression database ကို pg_dump/ pg_restore ကတစ်ဆင့် လည်ပတ် (cycle) စေပါတယ်။ Resources အင်အား သုံးစွဲမှု များလို့ default အနေနဲ့ enable မထားပါဘူး။
- **sepgsql** — contrib/sepgsql အောက်က test suite ကို run လုပ်ပါတယ်။ ဒါက တိကျတဲ့ နည်းလမ်းတစ်ခုနဲ့ ပြင်ဆင်ထားတဲ့ SELinux environment တစ်ခု လိုအပ်ပါတယ်; အပိုင်း F.40.3 ကို ကြည့်ပါ။
- **ssl** — src/test/ssl အောက်က test suite ကို run လုပ်ပါတယ်။ ဒါက TCP/IP listen sockets တွေကို ဖွင့်ပါတယ်။
- **wal_consistency_checking** — src/test/recovery အောက်က tests တချို့ကို run လုပ်နေစဉ်မှာ wal_consistency_checking=all ကို သုံးပါတယ်။ Resources အင်အား သုံးစွဲမှု များလို့ default အနေနဲ့ enable မထားပါဘူး။
- **xid_wraparound** — src/test/modules/xid_wraparound အောက်က test suite ကို run လုပ်ပါတယ်။ Resources အင်အား သုံးစွဲမှု များလို့ default အနေနဲ့ enable မထားပါဘူး။

လက်ရှိ build configuration က မထောက်ပံ့တဲ့ features တွေအတွက် tests တွေကို — `PG_TEST_EXTRA` ထဲမှာ ဖော်ပြထားရင်တောင် run လုပ်မှာ မဟုတ်ပါဘူး။

ထို့ပြင် — `src/test/modules` ထဲမှာ `make check-world` က run လုပ်ပေမယ့် `make installcheck-world` ကတော့ မလုပ်တဲ့ tests တွေ ရှိပါတယ်။ အကြောင်းကတော့ ၎င်းတို့က production မဟုတ်တဲ့ extensions တွေကို install လုပ်တာ ဒါမှမဟုတ် — production installation တစ်ခုအတွက် မနှစ်လိုဖွယ် ဖြစ်တယ်လို့ ယူဆရတဲ့ — တခြား ဘေးထွက် သက်ရောက်မှုတွေ ရှိလို့ပါ။ အလိုရှိရင် အဲဒီ subdirectories တွေထဲက တစ်ခုမှာ `make install` နှင့် `make installcheck` တို့ကို သုံးနိုင်ပေမယ့် — test မဟုတ်တဲ့ server တစ်ခုနဲ့တော့ အဲဒီလို လုပ်ဖို့ အကြံမပြုပါဘူး။

### 31.1.4. Locale and Encoding (locale နှင့် encoding)

Default အနေနဲ့ — ယာယီ installation တစ်ခုကို သုံးတဲ့ tests တွေက — လက်ရှိ environment ထဲမှာ သတ်မှတ်ထားတဲ့ locale (locale — ဘာသာစကား/ဒေသဆိုင်ရာ သတ်မှတ်ချက်) နှင့် — `initdb` က ဆုံးဖြတ်တဲ့ သက်ဆိုင်ရာ database encoding (encoding — စာလုံး ကုဒ်ပြောင်းမှု) ကို သုံးပါတယ်။ သင့်လျော်တဲ့ environment variables တွေကို သတ်မှတ်ပြီး locale အမျိုးမျိုးနဲ့ စမ်းသပ်တာက အသုံးဝင်နိုင်ပါတယ် — ဥပမာ:

```sql
make check LANG=C
make check LC_COLLATE=en_US.utf8 LC_CTYPE=fr_CA.utf8
```

Implementation (အကောင်အထည် ဖော်မှု) အကြောင်းပြချက်တွေကြောင့် — `LC_ALL` ကို သတ်မှတ်တာက ဒီရည်ရွယ်ချက်အတွက် အလုပ်မလုပ်ပါဘူး; locale နဲ့ ဆိုင်တဲ့ တခြား environment variables တွေကတော့ အားလုံး အလုပ်လုပ်ပါတယ်။

ရှိပြီးသား installation တစ်ခုကို သုံးပြီး စမ်းသပ်တဲ့အခါ — locale ကို ရှိပြီးသား database cluster ကပဲ ဆုံးဖြတ်ပြီး — test run တစ်ခုအတွက် သီးခြား သတ်မှတ်လို့ မရပါဘူး။

ထို့ပြင် — `ENCODING` variable ကို သတ်မှတ်ခြင်းအားဖြင့် database encoding ကို ထင်ရှားစွာ (explicitly) ရွေးချယ်နိုင်ပါတယ် — ဥပမာ:

```sql
make check LANG=C ENCODING=EUC_JP
```

Database encoding ကို ဒီနည်းနဲ့ သတ်မှတ်တာက — locale က C ဖြစ်နေမှသာ အဓိပ္ပာယ် ရှိပါတယ်; မဟုတ်ရင် — encoding ကို locale ကနေ အလိုအလျောက် ရွေးချယ်ပြီး — locale နဲ့ မကိုက်ညီတဲ့ encoding တစ်ခုကို သတ်မှတ်ရင် error (အမှား) တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

Database encoding ကို — ယာယီ installation ဖြစ်စေ ရှိပြီးသား installation ဖြစ်စေ — ဘယ်ဟာနဲ့ စမ်းသပ်တာအတွက်မဆို သတ်မှတ်နိုင်ပြီး — နောက်ဆုံး ကိစ္စမှာတော့ installation ရဲ့ locale နဲ့ လိုက်ဖက်ညီ (compatible) ရပါမယ်။

### 31.1.5. Custom Server Settings (စိတ်ကြိုက် server settings များ)

Test suite တစ်ခုကို run လုပ်တဲ့အခါ စိတ်ကြိုက် server settings တွေကို သုံးဖို့ နည်းလမ်း များစွာ ရှိပါတယ်။ ဒါက — ထပ်ဆောင်း logging (မှတ်တမ်း သိမ်းဆည်းခြင်း) ကို enable လုပ်ဖို့ — resource limits (အရင်းအမြစ် ကန့်သတ်ချက်များ) ကို ချိန်ညှိဖို့ ဒါမှမဟုတ် [debug_discard_caches](https://www.postgresql.org/docs/current/runtime-config-developer.html#GUC-DEBUG-DISCARD-CACHES) လို ထပ်ဆောင်း run-time checks (run နေချိန် စစ်ဆေးမှုများ) တွေကို enable လုပ်ဖို့ အသုံးဝင်နိုင်ပါတယ်။ ဒါပေမယ့် — tests အားလုံးက စိတ်ကြိုက် settings တွေနဲ့ ရှင်းရှင်းလင်းလင်း အောင်မြင်မယ်လို့တော့ မျှော်လင့်လို့ မရဘူးဆိုတာ သတိပြုပါ။

Test setup လုပ်နေစဉ်အတွင်း အတွင်းပိုင်း လုပ်ဆောင်တဲ့ initdb commands အမျိုးမျိုးဆီကို ထပ်ဆောင်း options တွေကို — `PG_TEST_INITDB_EXTRA_OPTS` environment variable ကို သုံးပြီး ပေးပို့နိုင်ပါတယ်။ ဥပမာ — checksums enable လုပ်ထားပြီး — စိတ်ကြိုက် WAL segment size နှင့် `work_mem` setting တစ်ခုနဲ့ test တစ်ခုကို run လုပ်ဖို့ဆိုရင်:

```sql
make check PG_TEST_INITDB_EXTRA_OPTS='-k --wal-segsize=4 -c work_mem=50MB'
```

Core regression test suite နှင့် `pg_regress` က မောင်းနှင်တဲ့ တခြား tests တွေအတွက် — စိတ်ကြိုက် run-time server settings တွေကို `PGOPTIONS` environment variable ထဲမှာလည်း သတ်မှတ်နိုင်ပါတယ် (ဒါကို ခွင့်ပြုတဲ့ settings တွေအတွက်) — ဥပမာ:

```sql
make check PGOPTIONS="-c debug_parallel_query=regress -c work_mem=50MB"
```

(ဒါက libpq က ထောက်ပံ့တဲ့ လုပ်ဆောင်ချက်တွေကို အသုံးပြုတာ ဖြစ်ပြီး — အသေးစိတ်အတွက် [options](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-OPTIONS) ကို ကြည့်ပါ။)

ယာယီ installation တစ်ခုနဲ့ run လုပ်တဲ့အခါ — ကြိုတင် ရေးသားထားတဲ့ `postgresql.conf` ဖိုင် တစ်ခုကို ထောက်ပံ့ပေးခြင်းအားဖြင့်လည်း စိတ်ကြိုက် settings တွေကို သတ်မှတ်နိုင်ပါတယ်:

```sql
echo 'log_checkpoints = on' > test_postgresql.conf
echo 'work_mem = 50MB' >> test_postgresql.conf
make check EXTRA_REGRESS_OPTS="--temp-config=test_postgresql.conf"
```

### 31.1.6. Extra Tests (အပို စမ်းသပ်မှုများ)

Core regression test suite ထဲမှာ — default အနေနဲ့ run မလုပ်တဲ့ test files အနည်းငယ် ပါဝင်ပါတယ် — အကြောင်းကတော့ ၎င်းတို့က platform-dependent (platform အလိုက် မူတည်သော) ဖြစ်နိုင်လို့ ဒါမှမဟုတ် run လုပ်ဖို့ အချိန် အလွန် ကြာနိုင်လို့ပါ။ ဒီ tests တွေ ဒါမှမဟုတ် တခြား အပို test files တွေကို — `EXTRA_TESTS` variable ကို သတ်မှတ်ခြင်းအားဖြင့် run လုပ်နိုင်ပါတယ်။ ဥပမာ — `numeric_big` test ကို run လုပ်ဖို့:

```sql
make check EXTRA_TESTS=numeric_big
```
