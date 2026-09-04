---
title: "Query string"
description: "node:querystring module (legacy) — query strings ကို parse/stringify လုပ်ခြင်း။"
order: 99
source: "https://nodejs.org/api/querystring.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:querystring` module က URL query strings တွေကို parse လုပ်ခြင်းနဲ့ format လုပ်ခြင်းအတွက်
utility တွေကို ပံ့ပိုးပေးပါတယ်။ အောက်ပါအတိုင်း ဝင်ရောက် အသုံးပြုနိုင်ပါတယ်:

```js
const querystring = require('node:querystring');
```

`querystring` က {URLSearchParams} ထက် performance ပိုကောင်းပေမယ့် — standard သတ်မှတ်ထားတဲ့
API တစ်ခုတော့ မဟုတ်ပါဘူး။ Performance အရေးမကြီးတဲ့အခါ (သို့) browser code တွေနဲ့
လိုက်ဖက်ညီမှု (compatibility) လိုချင်တဲ့အခါမှာတော့ {URLSearchParams} ကို သုံးပါ။

## `querystring.decode()`

`querystring.decode()` function က `querystring.parse()` ရဲ့ alias တစ်ခုပါ။

## `querystring.encode()`

`querystring.encode()` function က `querystring.stringify()` ရဲ့ alias တစ်ခုပါ။

## `querystring.escape(str)`

* `str` {string}

`querystring.escape()` method က ပေးထားတဲ့ `str` ပေါ်မှာ — URL query strings တွေရဲ့
သီးခြား လိုအပ်ချက်တွေအတွက် optimize လုပ်ထားတဲ့ နည်းလမ်းနဲ့ URL percent-encoding ကို
လုပ်ဆောင်ပေးပါတယ်။

`querystring.escape()` method ကို `querystring.stringify()` က သုံးပြီး — ယေဘုယျအားဖြင့်
တိုက်ရိုက် သုံးဖို့ မသင့်ပါဘူး။ လိုအပ်ရင် application code တွေက `querystring.escape` ကို
အခြား function တစ်ခုဆီကို assign လုပ်ပြီး — အစားထိုး percent-encoding implementation
တစ်ခု ပေးနိုင်ဖို့ အဓိကအားဖြင့် export လုပ်ထားတာပါ။

## `querystring.parse(str[, sep[, eq[, options]]])`

* `str` {string} Parse လုပ်ရမယ့် URL query string ပါ။
* `sep` {string} Query string ထဲမှာ key နဲ့ value pair တွေကို ခြားပေးတဲ့ substring ပါ။
  **Default:** `'&'`။
* `eq` {string}. Query string ထဲမှာ keys နဲ့ values တွေကို ခြားပေးတဲ့ substring ပါ။
  **Default:** `'='`။
* `options` {Object}
  * `decodeURIComponent` {Function} Query string ထဲက percent-encoded characters တွေကို
    decode လုပ်တဲ့အခါ သုံးရမယ့် function ပါ။ **Default:** `querystring.unescape()`။
  * `maxKeys` {number} Parse လုပ်ရမယ့် keys အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါတယ်။ Key
    အရေအတွက် ကန့်သတ်ချက်ကို ဖယ်ရှားဖို့ `0` လို့ သတ်မှတ်ပါ။ **Default:** `1000`။

`querystring.parse()` method က URL query string (`str`) တစ်ခုကို key နဲ့ value pair
တွေရဲ့ အစုအဝေးတစ်ခုအဖြစ် parse လုပ်ပါတယ်။

ဥပမာ — `'foo=bar&abc=xyz&abc=123'` ဆိုတဲ့ query string ကို အောက်ပါအတိုင်း parse လုပ်ပါတယ်:

```json
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```

`querystring.parse()` method က ပြန်ပေးတဲ့ object က JavaScript `Object` ကနေ prototypically
(prototype အားဖြင့်) အမွေဆက်ခံခြင်း _မရှိပါဘူး_။ ဆိုလိုတာက — `obj.toString()`,
`obj.hasOwnProperty()` စတဲ့ ပုံမှန် `Object` methods တွေက define လုပ်မထားဘဲ — _အလုပ်လုပ်မှာ
မဟုတ်ပါဘူး_။

ပုံမှန်အားဖြင့် query string ထဲက percent-encoded characters တွေကို UTF-8 encoding သုံးတယ်လို့
ယူဆပါတယ်။ အခြား character encoding တစ်ခုကို သုံးနေမယ်ဆိုရင် — အစားထိုး `decodeURIComponent`
option တစ်ခုကို သတ်မှတ်ပေးဖို့ လိုပါလိမ့်မယ်:

```js
// Assuming gbkDecodeURIComponent function already exists...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])`

* `obj` {Object} URL query string တစ်ခုအဖြစ် serialize လုပ်ရမယ့် object ပါ။
* `sep` {string} Query string ထဲမှာ key နဲ့ value pair တွေကို ခြားပေးတဲ့ substring ပါ။
  **Default:** `'&'`။
* `eq` {string}. Query string ထဲမှာ keys နဲ့ values တွေကို ခြားပေးတဲ့ substring ပါ။
  **Default:** `'='`။
* `options`
  * `encodeURIComponent` {Function} Query string ထဲမှာ URL-unsafe characters တွေကို
    percent-encoding အဖြစ် ပြောင်းတဲ့အခါ သုံးရမယ့် function ပါ။ **Default:**
    `querystring.escape()`။

`querystring.stringify()` method က ပေးထားတဲ့ `obj` ရဲ့ "own properties" (ကိုယ်ပိုင်
properties) တွေကို တစ်ခုပြီးတစ်ခု လှည့်ကြည့်ပြီး URL query string တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

`obj` ထဲမှာ ပေးလိုက်တဲ့ အောက်ပါ type တန်ဖိုးတွေကို serialize လုပ်ပါတယ်:
{string|number|bigint|boolean|string\[]|number\[]|bigint\[]|boolean\[]}။ Number တန်ဖိုးတွေက
finite (အကန့်အသတ်ရှိသော) ဖြစ်ရပါမယ်။ တခြား input တန်ဖိုးတွေကိုတော့ empty strings အဖြစ်
ပြောင်းလဲ (coerce) လိုက်ပါတယ်။

```js
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Returns 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Returns 'foo:bar;baz:qux'
```

ပုံမှန်အားဖြင့် query string ထဲမှာ percent-encoding လိုအပ်တဲ့ characters တွေကို UTF-8
အနေနဲ့ encode လုပ်ပါတယ်။ အခြား encoding တစ်ခု လိုအပ်မယ်ဆိုရင် — အစားထိုး
`encodeURIComponent` option တစ်ခုကို သတ်မှတ်ပေးဖို့ လိုပါလိမ့်မယ်:

```js
// Assuming gbkEncodeURIComponent function already exists,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)`

* `str` {string}

`querystring.unescape()` method က ပေးထားတဲ့ `str` ပေါ်မှာ URL percent-encoded characters
တွေကို decode လုပ်ပေးပါတယ်။

`querystring.unescape()` method ကို `querystring.parse()` က သုံးပြီး — ယေဘုယျအားဖြင့်
တိုက်ရိုက် သုံးဖို့ မသင့်ပါဘူး။ လိုအပ်ရင် application code တွေက `querystring.unescape` ကို
အခြား function တစ်ခုဆီကို assign လုပ်ပြီး — အစားထိုး decoding implementation တစ်ခု
ပေးနိုင်ဖို့ အဓိကအားဖြင့် export လုပ်ထားတာပါ။

ပုံမှန်အားဖြင့် `querystring.unescape()` method က JavaScript ရဲ့ built-in
`decodeURIComponent()` method ကို သုံးပြီး decode လုပ်ဖို့ ကြိုးစားပါတယ်။ အဲဒါ
မအောင်မြင်ရင်တော့ — malformed URLs (မှားယွင်းနေတဲ့ URL) တွေမှာ throw မလုပ်တဲ့ ပိုလုံခြုံတဲ့
ညီမျှသော နည်းလမ်းကို သုံးပါလိမ့်မယ်။
