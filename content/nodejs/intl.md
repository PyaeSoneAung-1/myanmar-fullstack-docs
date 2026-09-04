---
title: "Internationalization support"
description: "Node.js ရဲ့ internationalization (နိုင်ငံတကာ ဘာသာစကား ပံ့ပိုးမှု) features များနဲ့ ICU data set (full-icu, small-icu, system-icu, none) ဆိုင်ရာ build options များအကြောင်း။"
order: 114
source: "https://nodejs.org/api/intl.html"
status: translated
updated: 2026-09-04
---

Node.js မှာ internationalized (နိုင်ငံတကာ ဘာသာစကား အမျိုးမျိုးအတွက် သင့်လျော်အောင် ပြုလုပ်ထားသော) programs တွေကို ရေးသားရတာ ပိုမိုလွယ်ကူစေမယ့် features တွေ အများအပြား ပါဝင်ပါတယ်။ အဲဒီထဲက တချို့ကတော့:

* [ECMAScript Language Specification][ECMA-262] ထဲမှာ ပါဝင်တဲ့ Locale-sensitive (သို့) Unicode-aware functions တွေ:
  * [`String.prototype.normalize()`][]
  * [`String.prototype.toLowerCase()`][]
  * [`String.prototype.toUpperCase()`][]
* [ECMAScript Internationalization API Specification][ECMA-402] (aka ECMA-402) မှာ ဖော်ပြထားတဲ့ လုပ်ဆောင်ချက် အားလုံး:
  * [`Intl`][] object
  * Locale-sensitive methods တွေဖြစ်တဲ့ [`String.prototype.localeCompare()`][] နဲ့ [`Date.prototype.toLocaleString()`][] စတာတွေ
* [WHATWG URL parser][] ရဲ့ [internationalized domain names][] (IDNs) support
* [`require('node:buffer').transcode()`][]
* ပိုမိုတိကျတဲ့ [REPL][] line editing
* [`require('node:util').TextDecoder`][]
* [`RegExp` Unicode Property Escapes][]

Node.js နဲ့ အရင်းခံ V8 engine တို့က ဒီ features တွေကို native C/C++ code နဲ့ အကောင်အထည်ဖော်ဖို့ [International Components for Unicode (ICU)][ICU] ကို အသုံးပြုပါတယ်။ ICU data set အပြည့်အစုံကို Node.js မှာ default အနေနဲ့ ပံ့ပိုးပေးထားပါတယ်။ ဒါပေမယ့် ICU data file ရဲ့ အရွယ်အစား ကြီးမားတာကြောင့် — Node.js ကို build လုပ်တဲ့အခါ ဖြစ်စေ၊ run လုပ်တဲ့အခါ ဖြစ်စေ — ICU data set ကို စိတ်ကြိုက် ပြင်ဆင်သတ်မှတ်ဖို့ options များစွာ ပံ့ပိုးပေးထားပါတယ်။

## Node.js တည်ဆောက်ရန် options များ (Options for building Node.js)

ICU ကို Node.js ထဲမှာ ဘယ်လို သုံးမလဲဆိုတာကို ထိန်းချုပ်ဖို့ — compilation လုပ်ချိန်မှာ `configure` options လေးခု ရရှိနိုင်ပါတယ်။ Node.js ကို compile လုပ်နည်း နဲ့ ပတ်သက်တဲ့ ထပ်ဆောင်း အသေးစိတ်တွေကို [BUILDING.md][] မှာ မှတ်တမ်းတင်ထားပါတယ်။

* `--with-intl=none`/`--without-intl`
* `--with-intl=system-icu`
* `--with-intl=small-icu`
* `--with-intl=full-icu` (default)

`configure` option တစ်ခုချင်းစီအတွက် ရရှိနိုင်တဲ့ Node.js နဲ့ JavaScript features တွေရဲ့ ခြုံငုံ သုံးသပ်ချက်:

| Feature                                  | `none`                            | `system-icu`                 | `small-icu`            | `full-icu` |
| ---------------------------------------- | --------------------------------- | ---------------------------- | ---------------------- | ---------- |
| [`String.prototype.normalize()`][]       | none (function က no-op ဖြစ်သည်)  | full                         | full                   | full       |
| `String.prototype.to*Case()`             | full                              | full                         | full                   | full       |
| [`Intl`][]                               | none (object မတည်ရှိပါ)          | partial/full (OS ပေါ် မူတည်သည်) | partial (English တစ်မျိုးတည်းသာ) | full       |
| [`String.prototype.localeCompare()`][]   | partial (locale-aware မဟုတ်)      | full                         | full                   | full       |
| `String.prototype.toLocale*Case()`       | partial (locale-aware မဟုတ်)      | full                         | full                   | full       |
| [`Number.prototype.toLocaleString()`][]  | partial (locale-aware မဟုတ်)      | partial/full (OS ပေါ် မူတည်သည်) | partial (English တစ်မျိုးတည်းသာ) | full       |
| `Date.prototype.toLocale*String()`       | partial (locale-aware မဟုတ်)      | partial/full (OS ပေါ် မူတည်သည်) | partial (English တစ်မျိုးတည်းသာ) | full       |
| [Legacy URL Parser][]                    | partial (IDN support မရှိ)        | full                         | full                   | full       |
| [WHATWG URL Parser][]                    | partial (IDN support မရှိ)        | full                         | full                   | full       |
| [`require('node:buffer').transcode()`][] | none (function မတည်ရှိပါ)         | full                         | full                   | full       |
| [REPL][]                                 | partial (မတိကျသော line editing)  | full                         | full                   | full       |
| [`require('node:util').TextDecoder`][]   | partial (basic encodings များကို support လုပ်သည်) | partial/full (OS ပေါ် မူတည်သည်) | partial (Unicode သီးသန့်) | full       |
| [`RegExp` Unicode Property Escapes][]    | none (မမှန်ကန်သော `RegExp` error) | full                         | full                   | full       |

“(not locale-aware)” ဆိုတဲ့ သတ်မှတ်ချက်က — ဒီ function က (ရှိခဲ့ရင်) သူ့ရဲ့ `Locale` မပါတဲ့ version အတိုင်းပဲ ဆောင်ရွက်တယ်ဆိုတာကို ဖော်ပြပါတယ်။ ဥပမာ — `none` mode အောက်မှာ `Date.prototype.toLocaleString()` ရဲ့ လုပ်ဆောင်ချက်က `Date.prototype.toString()` ရဲ့ လုပ်ဆောင်ချက်နဲ့ ထပ်တူညီပါတယ်။

### Internationalization features အားလုံးကို disable လုပ်ခြင်း (Disable all internationalization features (`none`))

ဒီ option ကို ရွေးချယ်လိုက်ရင် — ICU ကို disable လုပ်လိုက်ပြီး အပေါ်မှာ ဖော်ပြခဲ့တဲ့ internationalization features အများစုက ရလာတဲ့ `node` binary ထဲမှာ **မရရှိနိုင်တော့ပါဘူး**။

### Pre-installed ICU တစ်ခုနဲ့ တည်ဆောက်ခြင်း (Build with a pre-installed ICU (`system-icu`))

Node.js က system ပေါ်မှာ ကြိုတင် ထည့်သွင်းပြီးသား ICU build တစ်ခုနဲ့ ချိတ်ဆက် (link) လုပ်နိုင်ပါတယ်။ တကယ်တော့ Linux distributions အများစုမှာ ICU က ကြိုတင် ပါပြီးသား ဖြစ်တာမို့ — ဒီ option က OS ထဲက တခြား components တွေ သုံးနေတဲ့ data set ကိုပဲ ပြန်လည် အသုံးပြုနိုင်အောင် လုပ်ပေးပါတယ်။

[`String.prototype.normalize()`][] နဲ့ [WHATWG URL parser][] လိုမျိုး ICU library ကိုယ်တိုင်ပဲ လိုအပ်တဲ့ လုပ်ဆောင်ချက်တွေက `system-icu` အောက်မှာ အပြည့်အဝ support လုပ်ပါတယ်။ [`Intl.DateTimeFormat`][] လိုမျိုး ICU locale data ပါ ထပ်ဆောင်း လိုအပ်တဲ့ features တွေကတော့ — system ပေါ်မှာ ထည့်သွင်းထားတဲ့ ICU data ရဲ့ ပြည့်စုံမှုပေါ် မူတည်ပြီး — အပြည့်အဝ ဖြစ်စေ၊ တစ်စိတ်တစ်ပိုင်း ဖြစ်စေ _support လုပ်နိုင်ပါတယ်_။

### ICU data အကန့်အသတ်တစ်ခုကို embed လုပ်ခြင်း (Embed a limited set of ICU data (`small-icu`))

ဒီ option က ရလာတဲ့ binary ကို ICU library နဲ့ statically ချိတ်ဆက်စေပြီး — ICU data ရဲ့ အစိတ်အပိုင်းတစ်ခု (ပုံမှန်အားဖြင့် English locale တစ်ခုတည်း) ကို `node` executable ထဲမှာ ထည့်သွင်းပေးပါတယ်။

[`String.prototype.normalize()`][] နဲ့ [WHATWG URL parser][] လိုမျိုး ICU library ကိုယ်တိုင်ပဲ လိုအပ်တဲ့ လုပ်ဆောင်ချက်တွေက `small-icu` အောက်မှာ အပြည့်အဝ support လုပ်ပါတယ်။ [`Intl.DateTimeFormat`][] လိုမျိုး ICU locale data ပါ ထပ်ဆောင်း လိုအပ်တဲ့ features တွေကတော့ ယေဘုယျအားဖြင့် English locale နဲ့ပဲ အလုပ်လုပ်ပါတယ်:

```js
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
```

ဒီ mode က features နဲ့ binary size ကြားမှာ မျှတမှု တစ်ခုကို ပေးပါတယ်။

#### Runtime မှာ ICU data ပံ့ပိုးပေးခြင်း (Providing ICU data at runtime)

`small-icu` option ကို သုံးထားရင်တောင် — JS methods တွေ ICU locales အားလုံးအတွက် အလုပ်လုပ်နိုင်အောင် — runtime မှာ ထပ်ဆောင်း locale data တွေကို ပံ့ပိုးပေးနိုင်ပါသေးတယ်။ Data file ကို `/runtime/directory/with/dat/file` မှာ သိမ်းဆည်းထားတယ်ဆိုရင် — အောက်ပါ နည်းလမ်းတွေထဲက တစ်ခုခုနဲ့ ICU အတွက် ရရှိနိုင်အောင် လုပ်နိုင်ပါတယ်:

* `--with-icu-default-data-dir` configure option ကတစ်ဆင့်:

  ```bash
  ./configure --with-icu-default-data-dir=/runtime/directory/with/dat/file --with-intl=small-icu
  ```

  ဒါက default data directory ရဲ့ path ကိုပဲ binary ထဲမှာ embed လုပ်ပေးပြီး — တကယ့် data file ကိုတော့ runtime မှာ ဒီ directory path ကနေ load လုပ်မှာ ဖြစ်ပါတယ်။

* [`NODE_ICU_DATA`][] environment variable ကတစ်ဆင့်:

  ```bash
  env NODE_ICU_DATA=/runtime/directory/with/dat/file node
  ```

* [`--icu-data-dir`][] CLI parameter ကတစ်ဆင့်:

  ```bash
  node --icu-data-dir=/runtime/directory/with/dat/file
  ```

ဒါတွေထဲက တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားတဲ့အခါ — `--icu-data-dir` CLI parameter က ဦးစားပေးမှု အမြင့်ဆုံး ဖြစ်ပြီး၊ ၎င်းနောက်မှာ `NODE_ICU_DATA` environment variable၊ ပြီးတော့ `--with-icu-default-data-dir` configure option တို့က အစဉ်လိုက် လိုက်ပါတယ်။

ICU က data formats အမျိုးမျိုးကို အလိုအလျောက် ရှာဖွေပြီး load လုပ်နိုင်ပေမယ့် — data က သုံးနေတဲ့ ICU version နဲ့ ကိုက်ညီရမှာ ဖြစ်ပြီး file နာမည်ကလည်း မှန်ကန်စွာ ပေးထားရပါမယ်။ Data file ရဲ့ အသုံးအများဆုံး နာမည်ကတော့ `icudtX[bl].dat` ဖြစ်ပြီး — အဲဒီမှာ `X` က ရည်ရွယ်ထားတဲ့ ICU version ကို ဖော်ပြကာ `b` (သို့) `l` ကတော့ system ရဲ့ endianness ကို ညွှန်ပြပါတယ်။ မျှော်လင့်ထားတဲ့ data file ကို သတ်မှတ်ထားတဲ့ directory ကနေ ဖတ်လို့ မရဘူးဆိုရင် Node.js က load လုပ်ရာမှာ မအောင်မြင်ပါဘူး။ လက်ရှိ Node.js version နဲ့ ကိုက်ညီတဲ့ data file ရဲ့ နာမည်ကို အောက်ပါအတိုင်း တွက်ချက်နိုင်ပါတယ်:

```js
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```

အခြား ပံ့ပိုးထားတဲ့ formats တွေနဲ့ ICU data အကြောင်း ယေဘုယျ အသေးစိတ်တွေအတွက် ICU User Guide ထဲက ["ICU Data"][] ဆောင်းပါးကို ကြည့်ရှုပါ။

[full-icu][] npm module က run နေတဲ့ `node` executable ရဲ့ ICU version ကို ရှာဖွေပြီး သင့်လျော်တဲ့ data file ကို download လုပ်ပေးခြင်းအားဖြင့် — ICU data တပ်ဆင်မှုကို သိသိသာသာ ရိုးရှင်းစေနိုင်ပါတယ်။ `npm i full-icu` နဲ့ module ကို တပ်ဆင်ပြီးတဲ့အခါ — data file က `./node_modules/full-icu` မှာ ရရှိနိုင်ပါလိမ့်မယ်။ အဲဒီ path ကို — အပေါ်မှာ ပြထားတဲ့အတိုင်း — `NODE_ICU_DATA` (သို့) `--icu-data-dir` ဆီကို ပေးပြီး `Intl` support အပြည့်အဝ ရနိုင်အောင် လုပ်နိုင်ပါတယ်။

### ICU တစ်ခုလုံးကို embed လုပ်ခြင်း (Embed the entire ICU (`full-icu`))

ဒီ option က ရလာတဲ့ binary ကို ICU နဲ့ statically ချိတ်ဆက်စေပြီး — ICU data အပြည့်အစုံ ထည့်သွင်းပေးပါတယ်။ ဒီနည်းနဲ့ တည်ဆောက်ထားတဲ့ binary မှာ နောက်ထပ် ပြင်ပ dependencies တွေ မလိုအပ်တော့ဘဲ — locales အားလုံးကို support လုပ်ပေမယ့် — အတော်လေး ကြီးမားနိုင်ပါတယ်။ `--with-intl` flag ကို မပေးထားဘူးဆိုရင် ဒါက default အပြုအမူ ဖြစ်ပါတယ်။ တရားဝင် (official) binaries တွေကိုလည်း ဒီ mode နဲ့ပဲ တည်ဆောက်ထားပါတယ်။

## Internationalization support ကို စစ်ဆေးခြင်း (Detecting internationalization support)

ICU က လုံးဝ enable ဖြစ်မဖြစ် (`system-icu`, `small-icu`, (သို့) `full-icu`) ကို စစ်ဆေးဖို့ — `Intl` ရှိမရှိကိုပဲ ရိုးရှင်းစွာ စစ်ကြည့်ရင် လုံလောက်ပါတယ်:

```js
const hasICU = typeof Intl === 'object';
```

တနည်းအားဖြင့် — ICU enabled ဖြစ်တဲ့အခါမှသာ သတ်မှတ်ပေးတဲ့ property ဖြစ်တဲ့ `process.versions.icu` ကို စစ်ဆေးတာကလည်း အလုပ်ဖြစ်ပါတယ်:

```js
const hasICU = typeof process.versions.icu === 'string';
```

English မဟုတ်တဲ့ locale တစ်ခုအတွက် support (ဆိုလိုတာ `full-icu` (သို့) `system-icu`) ရှိမရှိ စစ်ဆေးဖို့ — [`Intl.DateTimeFormat`][] က ကောင်းမွန်တဲ့ ခွဲခြားသိစေနိုင်တဲ့ အချက် တစ်ခု ဖြစ်နိုင်ပါတယ်:

```js
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```

`Intl` support အတွက် ပိုပြီး အသေးစိတ်ကျတဲ့ tests တွေအတွက် အောက်ပါ resources တွေက အသုံးဝင်နိုင်ပါတယ်:

* [btest402][]: `Intl` support ပါတဲ့ Node.js ကို မှန်ကန်စွာ build လုပ်ထားလားဆိုတာ စစ်ဆေးဖို့ ယေဘုယျအားဖြင့် အသုံးပြုပါတယ်။
* [Test262][]: ECMAScript ရဲ့ တရားဝင် conformance test suite မှာ ECMA-402 အတွက် သီးသန့် ခွဲဝေထားတဲ့ section တစ်ခု ပါဝင်ပါတယ်။

["ICU Data"]: http://userguide.icu-project.org/icudata
[BUILDING.md]: https://github.com/nodejs/node/blob/HEAD/BUILDING.md
[ECMA-262]: https://tc39.github.io/ecma262/
[ECMA-402]: https://tc39.github.io/ecma402/
[ICU]: http://site.icu-project.org/
[Legacy URL parser]: url.md#legacy-url-api
[REPL]: repl.md#repl
[Test262]: https://github.com/tc39/test262/tree/HEAD/test/intl402
[WHATWG URL parser]: url.md#the-whatwg-url-api
[`--icu-data-dir`]: cli.md#--icu-data-dirfile
[`Date.prototype.toLocaleString()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
[`Intl.DateTimeFormat`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
[`Intl`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[`NODE_ICU_DATA`]: cli.md#node_icu_datafile
[`Number.prototype.toLocaleString()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
[`RegExp` Unicode Property Escapes]: https://github.com/tc39/proposal-regexp-unicode-property-escapes
[`String.prototype.localeCompare()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
[`String.prototype.normalize()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
[`String.prototype.toLowerCase()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
[`String.prototype.toUpperCase()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
[`require('node:buffer').transcode()`]: buffer.md#buffertranscodesource-fromenc-toenc
[`require('node:util').TextDecoder`]: util.md#class-utiltextdecoder
[btest402]: https://github.com/srl295/btest402
[full-icu]: https://www.npmjs.com/package/full-icu
[internationalized domain names]: https://en.wikipedia.org/wiki/Internationalized_domain_name
