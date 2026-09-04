---
title: "Punycode"
description: "node:punycode module (deprecated) — Unicode နဲ့ punycode (ASCII) အကြား convert လုပ်ခြင်း။"
order: 98
source: "https://nodejs.org/api/punycode.html"
status: translated
updated: 2026-09-04
---

> Stability: 0 - Deprecated

Node.js ထဲမှာ ထည့်သွင်းထားတဲ့ `punycode` module ရဲ့ version က deprecated (အသုံးမပြုတော့ဘဲ ဖြစ်နေပြီ) ဖြစ်ပါတယ်။ Node.js ရဲ့ နောင်လာမယ့် major version တစ်ခုမှာ ဒီ module ကို ဖယ်ရှားသွားမှာ ဖြစ်ပါတယ်။ လက်ရှိ `punycode` module ကို မှီခိုသုံးနေတဲ့ users တွေအနေနဲ့ — userland က ပံ့ပိုးပေးတဲ့ [Punycode.js][] module ကို ပြောင်းသုံးသင့်ပါတယ်။ Punycode အခြေခံတဲ့ URL encoding အတွက်ဆိုရင် [`url.domainToASCII`][] ကို ကြည့်ပါ — (သို့) ယေဘုယျအားဖြင့် [WHATWG URL API][] ကို ကြည့်ပါ။

`punycode` module က [Punycode.js][] module ရဲ့ bundled (ထည့်သွင်း ပေးထားသော) version တစ်ခု ဖြစ်ပါတယ်။ အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```js
const punycode = require('node:punycode');
```

[Punycode][] က RFC 3492 မှာ သတ်မှတ်ထားတဲ့ character encoding scheme တစ်ခု ဖြစ်ပြီး — Internationalized Domain Names (နိုင်ငံတကာ ဘာသာစကားဖြင့် ရေးသော domain names) တွေမှာ အဓိက ရည်ရွယ် အသုံးပြုပါတယ်။ URL တွေထဲက host names တွေက ASCII characters တွေပဲ ကန့်သတ်ထားတာမို့ — non-ASCII characters တွေ ပါဝင်တဲ့ Domain Names တွေကို Punycode scheme သုံးပြီး ASCII အဖြစ် ပြောင်းပေးရပါတယ်။ ဥပမာ — English စကားလုံး `'example'` နဲ့ အဓိပ္ပာယ် တူညီတဲ့ Japanese character က `'例'` ဖြစ်ပါတယ်။ Internationalized Domain Name ဖြစ်တဲ့ `'例.com'` (`'example.com'` နဲ့ ညီမျှသည်) ကို Punycode မှာ ASCII string `'xn--fsq.com'` အနေနဲ့ ကိုယ်စားပြုပါတယ်။

`punycode` module က Punycode standard ရဲ့ ရိုးရှင်းတဲ့ implementation တစ်ခုကို ပေးပါတယ်။

`punycode` module က Node.js က သုံးတဲ့ third-party dependency တစ်ခု ဖြစ်ပြီး — developers တွေ အဆင်ပြေစေဖို့ ထည့်ပေးထားတာပါ။ ဒီ module အတွက် fixes (သို့) တခြား ပြုပြင်မွမ်းမံမှုတွေကို [Punycode.js][] project ဆီ ဦးတည် ပို့ဆောင်ပေးရပါမယ်။

## `punycode.decode(string)`

* `string` {string}

`punycode.decode()` method က ASCII characters တွေပဲ ပါဝင်တဲ့ [Punycode][] string တစ်ခုကို ညီမျှတဲ့ Unicode codepoints string အဖြစ် ပြောင်းပေးပါတယ်။

```js
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)`

* `string` {string}

`punycode.encode()` method က Unicode codepoints string တစ်ခုကို ASCII characters တွေပဲ ပါဝင်တဲ့ [Punycode][] string အဖြစ် ပြောင်းပေးပါတယ်။

```js
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```

## `punycode.toASCII(domain)`

* `domain` {string}

`punycode.toASCII()` method က Internationalized Domain Name တစ်ခုကို ကိုယ်စားပြုတဲ့ Unicode string တစ်ခုကို [Punycode][] အဖြစ် ပြောင်းပေးပါတယ်။ Domain name ရဲ့ non-ASCII အပိုင်းတွေကိုပဲ ပြောင်းပေးမှာ ဖြစ်ပါတယ်။ ASCII characters တွေပဲ ပါဝင်နေပြီးသား string တစ်ခုပေါ်မှာ `punycode.toASCII()` ကို ခေါ်ရင် — ဘာမှ သက်ရောက်မှု မရှိပါဘူး။

```js
// encode domain names
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```

## `punycode.toUnicode(domain)`

* `domain` {string}

`punycode.toUnicode()` method က [Punycode][] နဲ့ encode လုပ်ထားတဲ့ characters တွေ ပါဝင်တဲ့ domain name string တစ်ခုကို Unicode အဖြစ် ပြောင်းပေးပါတယ်။ Domain name ရဲ့ [Punycode][] encode လုပ်ထားတဲ့ အပိုင်းတွေကိုပဲ ပြောင်းပေးပါတယ်။

```js
// decode domain names
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```

## `punycode.ucs2`

### `punycode.ucs2.decode(string)`

* `string` {string}

`punycode.ucs2.decode()` method က string ထဲက Unicode symbol တစ်ခုချင်းစီရဲ့ numeric codepoint တန်ဖိုးတွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

```js
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// surrogate pair for U+1D306 tetragram for centre:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)`

* `codePoints` {integer\[]}

`punycode.ucs2.encode()` method က numeric code point တန်ဖိုးတွေရဲ့ array တစ်ခုကို အခြေခံပြီး string တစ်ခုကို ပြန်ပေးပါတယ်။

```js
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```

## `punycode.version`

* Type: {string}

လက်ရှိ [Punycode.js][] version နံပါတ်ကို ဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

[Punycode]: https://tools.ietf.org/html/rfc3492
[Punycode.js]: https://github.com/bestiejs/punycode.js
[WHATWG URL API]: url.md#the-whatwg-url-api
[`url.domainToASCII`]: url.md#urldomaintoasciidomain
