---
title: "Test Coverage Examination (Test လွှမ်းခြုံမှု စစ်ဆေးခြင်း)"
description: "PostgreSQL ရဲ့ source code ကို coverage testing instrumentation နဲ့ compile လုပ်ပြီး — regression tests ဒါမှမဟုတ် တခြား test suites တွေက code ရဲ့ ဘယ်အပိုင်းတွေကို လွှမ်းခြုံ ထားလဲ စစ်ဆေးခြင်း — Autoconf/Make နည်းလမ်း (`./configure --enable-coverage`, `make check`, `make coverage-html`, `make coverage`, `.gcov` output ဖိုင်များ, `coverage/index.html`, `make coverage-clean`, subdirectory အတွင်း coverage report, `make distclean`), Meson နည်းလမ်း (`meson setup -Db_coverage=true`, `meson compile`, `meson test`, `ninja coverage-html`, `meson-logs/coveragereport/index.html`), execution counts များ စုပုံလာခြင်း အကြောင်း ရှင်းလင်းချက်"
order: 231
source: "https://www.postgresql.org/docs/current/regress-coverage.html"
status: translated
updated: 2026-09-06
---

## 31.5. Test Coverage Examination (Test လွှမ်းခြုံမှု စစ်ဆေးခြင်း)

- **31.5.1. Coverage with Autoconf and Make (Autoconf နှင့် Make သုံးပြီး coverage စစ်ဆေးခြင်း)**
- **31.5.2. Coverage with Meson (Meson သုံးပြီး coverage စစ်ဆေးခြင်း)**

PostgreSQL ရဲ့ source code ကို coverage testing instrumentation (code ရဲ့ ဘယ်အပိုင်းတွေ run လုပ်ခဲ့သလဲဆိုတာ မှတ်တမ်း ပြုလုပ်ပေးတဲ့ စမ်းသပ်မှု ကိရိယာ တပ်ဆင်မှု) နဲ့ compile လုပ်လို့ ရပါတယ် — ဒါကြောင့် code ရဲ့ ဘယ်အပိုင်းတွေကို regression tests ဒါမှမဟုတ် — code နဲ့ အတူ run လုပ်တဲ့ — တခြား test suite ဘယ်ခုနဲ့မဆို လွှမ်းခြုံ (covered) ထားလဲဆိုတာ စစ်ဆေး ကြည့်ရှုနိုင်လာပါတယ်။ ဒါကို လက်ရှိမှာ GCC နဲ့ compile လုပ်တဲ့အခါ ထောက်ပံ့ပြီး — `gcov` နဲ့ `lcov` packages တွေ လိုအပ်ပါတယ်။

### 31.5.1. Coverage with Autoconf and Make (Autoconf နှင့် Make သုံးပြီး coverage စစ်ဆေးခြင်း)

ပုံမှန် လုပ်ဆောင်မှု ပုံစံ (workflow) တစ်ခုက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```sql
./configure --enable-coverage ... OTHER OPTIONS ...
make
make check # or other test suite
make coverage-html
```

ပြီးရင် သင့် HTML browser ကို `coverage/index.html` ဆီ ညွှန်ပြပါ။

သင့်မှာ `lcov` မရှိဘူးဆိုရင် ဒါမှမဟုတ် HTML report တစ်ခုထက် text output ကို ပိုနှစ်သက်တယ်ဆိုရင် — `make coverage-html` အစား အောက်ပါတို့ကို run လုပ်နိုင်ပါတယ်:

```sql
make coverage
```

ဒါက — test နဲ့ သက်ဆိုင်တဲ့ source file တစ်ခုချင်းစီအတွက် `.gcov` output ဖိုင်တွေကို ထုတ်လုပ်ပေးပါလိမ့်မယ်။ (`make coverage` နဲ့ `make coverage-html` တို့က တစ်ခုကိုတစ်ခုရဲ့ ဖိုင်တွေကို overwrite (အစားထိုး ရေးသား) လုပ်လို့ — ဒီနှစ်ခုကို ရောနှော အသုံးပြုတာက ရှုပ်ထွေးစေနိုင်ပါတယ်။)

Coverage report မလုပ်ခင် — test အမျိုးမျိုးကို run လုပ်ထားနိုင်ပြီး — execution counts (လုပ်ဆောင်မှု အရေအတွက်များ) တွေက စုပုံ သွားပါလိမ့်မယ်။ Test runs တွေကြားမှာ execution counts တွေကို ပြန်လည် စတင်ချင်ရင်တော့ — အောက်ပါအတိုင်း run လုပ်ပါ:

```sql
make coverage-clean
```

Code tree ရဲ့ အစိတ်အပိုင်း တစ်ခုအတွက်ပဲ coverage report တစ်ခု လိုချင်တယ်ဆိုရင် — `make coverage-html` ဒါမှမဟုတ် `make coverage` command ကို subdirectory တစ်ခုအတွင်းမှာ run လုပ်နိုင်ပါတယ်။

ပြီးသွားတဲ့အခါ သန့်ရှင်းရေး လုပ်ဖို့ `make distclean` ကို သုံးပါ။

### 31.5.2. Coverage with Meson (Meson သုံးပြီး coverage စစ်ဆေးခြင်း)

ပုံမှန် လုပ်ဆောင်မှု ပုံစံ (workflow) တစ်ခုက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```sql
meson setup -Db_coverage=true ... OTHER OPTIONS ... builddir/
meson compile -C builddir/
meson test -C builddir/
cd builddir/
ninja coverage-html
```

ပြီးရင် သင့် HTML browser ကို `./meson-logs/coveragereport/index.html` ဆီ ညွှန်ပြပါ။

Coverage report မလုပ်ခင် — test အမျိုးမျိုးကို run လုပ်ထားနိုင်ပြီး — execution counts တွေက စုပုံ သွားပါလိမ့်မယ်။
