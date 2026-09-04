---
title: "URL"
description: "node:url module — URL resolution နဲ့ parsing အတွက် utility များ (WHATWG URL API — URL, URLSearchParams, URLPattern — နဲ့ legacy URL API တို့ ပါဝင်)"
order: 106
source: "https://nodejs.org/api/url.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:url` module က URL resolution နဲ့ parsing အတွက် utility များကို ပံ့ပိုးပေးပါတယ်။ အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import url from 'node:url';
```

```cjs
const url = require('node:url');
```

## URL strings and URL objects (URL string များနဲ့ URL object များ)

URL string ဆိုတာ အဓိပ္ပာယ်ရှိတဲ့ component များစွာ ပါဝင်တဲ့ ဖွဲ့စည်းပုံ ရှိတဲ့ string တစ်ခုပါ။ ၎င်းကို parse လုပ်လိုက်တဲ့အခါ — component တစ်ခုချင်းစီအတွက် properties တွေ ပါဝင်တဲ့ URL object တစ်ခုကို ပြန်ပေးပါတယ်။

`node:url` module က URL တွေနဲ့ အလုပ်လုပ်ဖို့ APIs နှစ်ခုကို ပံ့ပိုးပေးပါတယ်: Node.js အတွက် သီးသန့် ဖြစ်တဲ့ legacy API တစ်ခုနဲ့ — web browsers တွေ အသုံးပြုတဲ့ [WHATWG URL Standard][] ကိုပဲ အကောင်အထည် ဖော်ထားတဲ့ ပိုသစ်တဲ့ API တစ်ခုတို့ပါ။

WHATWG နဲ့ legacy APIs တွေကြားက နှိုင်းယှဉ်ချက်ကို အောက်မှာ ဖော်ပြထားပါတယ်။ URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` ရဲ့ အထက်မှာ legacy `url.parse()` က ပြန်ပေးတဲ့ object ရဲ့ properties တွေကို ပြထားပြီး — အောက်မှာတော့ WHATWG `URL` object ရဲ့ properties တွေကို ပြထားပါတယ်။

WHATWG URL ရဲ့ `origin` property မှာ `protocol` နဲ့ `host` ပါဝင်ပေမယ့် — `username` (သို့) `password` တွေကတော့ မပါဝင်ပါဘူး။

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

WHATWG API ကို သုံးပြီး URL string ကို parse လုပ်ခြင်း:

```js
const myURL =
  new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

Legacy API ကို သုံးပြီး URL string ကို parse လုပ်ခြင်း:

```mjs
import url from 'node:url';
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

```cjs
const url = require('node:url');
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

### Constructing a URL from component parts and getting the constructed string (URL အစိတ်အပိုင်းများကနေ URL တည်ဆောက်ခြင်းနဲ့ တည်ဆောက်ပြီးသား string ကို ရယူခြင်း)

WHATWG URL တစ်ခုကို — property setters တွေ (သို့) template literal string တစ်ခုကို သုံးပြီး — component အစိတ်အပိုင်းတွေကနေ တည်ဆောက်နိုင်ပါတယ်:

```js
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```

```js
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```

တည်ဆောက်ပြီးသား URL string ကို ရဖို့ `href` property accessor ကို သုံးပါ:

```js
console.log(myURL.href);
```

## The WHATWG URL API (WHATWG URL API ဆိုင်ရာ)

### Class: `URL`

Browser တွေနဲ့ တွဲဖက် အသုံးပြုနိုင်တဲ့ `URL` class — WHATWG URL Standard ကို လိုက်နာပြီး အကောင်အထည် ဖော်ထားပါတယ်။ [Examples of parsed URLs][] တွေကို Standard ထဲမှာကိုယ်တိုင် တွေ့နိုင်ပါတယ်။ `URL` class က global object ပေါ်မှာလည်း ရနိုင်ပါတယ်။

Browser conventions တွေနဲ့အညီ — `URL` objects တွေရဲ့ properties အားလုံးကို object ပေါ်က data properties တွေအနေနဲ့ မဟုတ်ဘဲ — class prototype ပေါ်က getters နဲ့ setters တွေအနေနဲ့ အကောင်အထည် ဖော်ထားပါတယ်။ ဒါကြောင့် [legacy `urlObject`][] တွေနဲ့ မတူဘဲ — `URL` objects တွေရဲ့ properties တွေပေါ်မှာ `delete` keyword ကို အသုံးပြုခြင်း (ဥပမာ `delete myURL.protocol`, `delete myURL.pathname`, စသည်) က ဘာအကျိုးသက်ရောက်မှုမှ မရှိဘဲ `true` ကိုတော့ ပြန်ပေးဦးမှာ ဖြစ်ပါတယ်။

#### `new URL(input[, base])`

* `input` {string} parse လုပ်ရမယ့် absolute (သို့) relative input URL ပါ။ `input` က relative ဆိုရင် `base` က မဖြစ်မနေ လိုအပ်ပါတယ်။ `input` က absolute ဆိုရင်တော့ `base` ကို လျစ်လျူရှုပါတယ်။ `input` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။
* `base` {string} `input` က absolute မဟုတ်ဘူးဆိုရင် resolve လုပ်ဖို့ သုံးတဲ့ base URL ပါ။ `base` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။

`input` ကို `base` နဲ့ ဆက်စပ်ပြီး parse လုပ်ခြင်းအားဖြင့် `URL` object အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `base` ကို string အနေနဲ့ ပေးထားရင် — `new URL(base)` လုပ်တာနဲ့ ညီမျှတဲ့ပုံစံနဲ့ parse လုပ်ပါတယ်။

```js
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```

URL constructor ကို global object ပေါ်က property တစ်ခုအနေနဲ့ ဝင်ရောက်သုံးနိုင်ပါတယ်။ Built-in url module ကနေလည်း import လုပ်နိုင်ပါတယ်:

```mjs
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Prints 'true'.
```

```cjs
console.log(URL === require('node:url').URL); // Prints 'true'.
```

`input` (သို့) `base` တွေက တရားဝင် (valid) URLs တွေ မဟုတ်ဘူးဆိုရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ပေးထားတဲ့ တန်ဖိုးတွေကို strings တွေအဖြစ် ပြောင်းလဲဖို့ ကြိုးစားမှုတစ်ခု လုပ်သွားမယ်ဆိုတာ သတိပြုပါ။ ဥပမာ:

```js
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```

`input` ရဲ့ host name ထဲမှာ ပေါ်လာတဲ့ Unicode characters တွေကို [Punycode][] algorithm ကို သုံးပြီး ASCII အဖြစ် အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။

```js
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```

`input` က absolute URL ဟုတ်မဟုတ် ကြိုတင် မသိနိုင်ဘဲ `base` တစ်ခု ပေးထားတဲ့ အခြေအနေတွေမှာ — `URL` object ရဲ့ `origin` က မျှော်လင့်ထားတဲ့အတိုင်း ဟုတ်မဟုတ် validate လုပ်ဖို့ အကြံပြုပါတယ်။

```js
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash`

* Type: {string}

URL ရဲ့ fragment အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Prints #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Prints https://example.org/foo#baz
```

`hash` property ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးထဲမှာ ပါဝင်တဲ့ မမှန်ကန်တဲ့ URL characters တွေကို [percent-encoded][] လုပ်ပါတယ်။ ဘယ် characters တွေကို percent-encode လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကတော့ [`url.parse()`][] နဲ့ [`url.format()`][] methods တွေက ထုတ်လုပ်တာနဲ့ နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

#### `url.host`

* Type: {string}

URL ရဲ့ host အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Prints example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Prints https://example.com:82/foo
```

`host` property ကို သတ်မှတ်တဲ့အခါ မမှန်ကန်တဲ့ host values တွေကို လျစ်လျူရှုပါတယ်။

#### `url.hostname`

* Type: {string}

URL ရဲ့ host name အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။ `url.host` နဲ့ `url.hostname` ကြားက အဓိက ကွာခြားချက်ကတော့ — `url.hostname` မှာ port က _မပါဝင်_ တာပါ။

```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Prints example.org

// Setting the hostname does not change the port
myURL.hostname = 'example.com';
console.log(myURL.href);
// Prints https://example.com:81/foo

// Use myURL.host to change the hostname and port
myURL.host = 'example.org:82';
console.log(myURL.href);
// Prints https://example.org:82/foo
```

`hostname` property ကို သတ်မှတ်တဲ့အခါ မမှန်ကန်တဲ့ host name values တွေကို လျစ်လျူရှုပါတယ်။

#### `url.href`

* Type: {string}

Serialized လုပ်ထားတဲ့ URL ကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Prints https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Prints https://example.com/bar
```

`href` property ရဲ့ တန်ဖိုးကို ရယူတာက [`url.toString()`][] ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

ဒီ property ကို တန်ဖိုးအသစ် သတ်မှတ်တာက [`new URL(value)`][`new URL()`] ကို သုံးပြီး `URL` object အသစ်တစ်ခု ဖန်တီးတာနဲ့ ညီမျှပါတယ်။ `URL` object ရဲ့ properties တစ်ခုချင်းစီတိုင်း ပြောင်းလဲသွားပါလိမ့်မယ်။

`href` property ကို သတ်မှတ်တဲ့ တန်ဖိုးက တရားဝင် URL တစ်ခု မဟုတ်ဘူးဆိုရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

#### `url.origin`

* Type: {string}

URL ရဲ့ origin ကို read-only အနေနဲ့ serialization လုပ်ပြီး ပြန်ပေးပါတယ်။

```js
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Prints https://example.org
```

```js
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Prints https://xn--g6w251d

console.log(idnURL.hostname);
// Prints xn--g6w251d
```

#### `url.password`

* Type: {string}

URL ရဲ့ password အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.password);
// Prints xyz

myURL.password = '123';
console.log(myURL.href);
// Prints https://abc:123@example.com/
```

`password` property ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးထဲမှာ ပါဝင်တဲ့ မမှန်ကန်တဲ့ URL characters တွေကို [percent-encoded][] လုပ်ပါတယ်။ ဘယ် characters တွေကို percent-encode လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကတော့ [`url.parse()`][] နဲ့ [`url.format()`][] methods တွေက ထုတ်လုပ်တာနဲ့ နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

#### `url.pathname`

* Type: {string}

URL ရဲ့ path အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Prints /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Prints https://example.org/abcdef?123
```

`pathname` property ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးထဲမှာ ပါဝင်တဲ့ မမှန်ကန်တဲ့ URL characters တွေကို [percent-encoded][] လုပ်ပါတယ်။ ဘယ် characters တွေကို percent-encode လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကတော့ [`url.parse()`][] နဲ့ [`url.format()`][] methods တွေက ထုတ်လုပ်တာနဲ့ နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

#### `url.port`

* Type: {string}

URL ရဲ့ port အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

Port တန်ဖိုးက `0` ကနေ `65535` (နှစ်ဖက်စလုံး အပါအဝင်) အတွင်းက ဂဏန်းတစ်ခု ပါဝင်တဲ့ number (သို့) string တစ်ခု ဖြစ်နိုင်ပါတယ်။ `URL` objects တွေရဲ့ ပေးထားတဲ့ `protocol` အတွက် default port ကို သတ်မှတ်လိုက်ရင် — `port` တန်ဖိုးက empty string (`''`) ဖြစ်သွားပါလိမ့်မယ်။

Port တန်ဖိုးက empty string လည်း ဖြစ်နိုင်ပြီး — အဲဒီအခါ port က protocol/scheme ပေါ်မှာ မူတည်ပါတယ်:

| protocol | port |
| -------- | ---- |
| "ftp"    | 21   |
| "file"   |      |
| "http"   | 80   |
| "https"  | 443  |
| "ws"     | 80   |
| "wss"    | 443  |

Port ကို တန်ဖိုးတစ်ခု သတ်မှတ်လိုက်တဲ့အခါ — အဲဒီတန်ဖိုးကို အရင်ဆုံး `.toString()` ကို သုံးပြီး string အဖြစ် ပြောင်းလဲပါတယ်။

အဲဒီ string က မမှန်ကန်ပေမယ့် ဂဏန်းတစ်ခုနဲ့ စနေရင် — ရှေ့ဆုံးက ဂဏန်းကို `port` အနေနဲ့ သတ်မှတ်ပါတယ်။
ဂဏန်းက အပေါ်မှာ ဖော်ပြထားတဲ့ အကွာအဝေး အပြင်ဘက် ရောက်နေရင်တော့ လျစ်လျူရှုပါတယ်။

```js
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Prints 8888

// Default ports are automatically transformed to the empty string
// (HTTPS protocol's default port is 443)
myURL.port = '443';
console.log(myURL.port);
// Prints the empty string
console.log(myURL.href);
// Prints https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Prints 1234
console.log(myURL.href);
// Prints https://example.org:1234/

// Completely invalid port strings are ignored
myURL.port = 'abcd';
console.log(myURL.port);
// Prints 1234

// Leading numbers are treated as a port number
myURL.port = '5678abcd';
console.log(myURL.port);
// Prints 5678

// Non-integers are truncated
myURL.port = 1234.5678;
console.log(myURL.port);
// Prints 1234

// Out-of-range numbers which are not represented in scientific notation
// will be ignored.
myURL.port = 1e10; // 10000000000, will be range-checked as described below
console.log(myURL.port);
// Prints 1234
```

Decimal point (ဒသမ အမှတ်) ပါတဲ့ numbers တွေ — floating-point numbers (သို့) scientific notation နဲ့ ရေးထားတဲ့ numbers တွေလိုမျိုး — က ဒီစည်းမျဉ်းရဲ့ ချွင်းချက် မဟုတ်ပါဘူး။ Decimal point အထိက ရှေ့ဆုံး ဂဏန်းတွေက တရားဝင် (valid) ဖြစ်နေရင် URL ရဲ့ port အဖြစ် သတ်မှတ်သွားပါလိမ့်မယ်:

```js
myURL.port = 4.567e21;
console.log(myURL.port);
// Prints 4 (because it is the leading number in the string '4.567e21')
```

#### `url.protocol`

* Type: {string}

URL ရဲ့ protocol အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Prints https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Prints ftp://example.org/
```

`protocol` property ကို သတ်မှတ်တဲ့အခါ မမှန်ကန်တဲ့ URL protocol values တွေကို လျစ်လျူရှုပါတယ်။

##### Special schemes (အထူးသီးသန့် protocol schemes)

[WHATWG URL Standard][] က URL protocol schemes အချို့ကို — သူတို့ ဘယ်လို parse လုပ်ခံရပြီး serialize လုပ်ခံရလဲဆိုတဲ့ ကိစ္စမှာ — _special_ အဖြစ် သတ်မှတ်ပါတယ်။ ဒီ special protocols တွေထဲက တစ်ခုနဲ့ URL တစ်ခုကို parse လုပ်တဲ့အခါ — `url.protocol` property ကို တခြား special protocol တစ်ခုဆီကို ပြောင်းလဲနိုင်ပေမယ့် — special မဟုတ်တဲ့ protocol တစ်ခုဆီကိုတော့ ပြောင်းလို့ မရပါဘူး။ အပြန်အလှန်အားဖြင့်လည်း ဒီအတိုင်းပါပဲ။

ဥပမာ — `http` ကနေ `https` ကို ပြောင်းတာက အလုပ်ဖြစ်ပါတယ်:

```js
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```

ဒါပေမယ့် — `http` ကနေ စိတ်ကူးယဉ် `fish` protocol ဆီကို ပြောင်းတာကတော့ — အသစ်က protocol က special မဟုတ်လို့ — အလုပ်မဖြစ်ပါဘူး။

```js
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```

အလားတူပဲ — special မဟုတ်တဲ့ protocol ကနေ special protocol တစ်ခုဆီကို ပြောင်းတာလည်း ခွင့်မပြုပါဘူး:

```js
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```

WHATWG URL Standard အရ special protocol schemes တွေကတော့ `ftp`, `file`, `http`, `https`, `ws`, နဲ့ `wss` တို့ပါ။

#### `url.search`

* Type: {string}

URL ရဲ့ query အပိုင်းကို serialized လုပ်ထားတဲ့ပုံစံနဲ့ ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Prints ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Prints https://example.org/abc?abc=xyz
```

`search` property ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးထဲမှာ ပါဝင်တဲ့ မမှန်ကန်တဲ့ URL characters တွေကို [percent-encoded][] လုပ်ပါတယ်။ ဘယ် characters တွေကို percent-encode လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကတော့ [`url.parse()`][] နဲ့ [`url.format()`][] methods တွေက ထုတ်လုပ်တာနဲ့ နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

#### `url.searchParams`

* Type: {URLSearchParams}

URL ရဲ့ query parameters တွေကို ကိုယ်စားပြုတဲ့ [`URLSearchParams`][] object ကို ရယူပါတယ်။ ဒီ property က read-only ဖြစ်ပေမယ့် — ၎င်းက ပေးတဲ့ `URLSearchParams` object ကို သုံးပြီး URL instance ကို ပြောင်းလဲနိုင်ပါတယ်။ URL ရဲ့ query parameters တွေ တစ်ခုလုံးကို အစားထိုးချင်ရင်တော့ [`url.search`][] setter ကို သုံးပါ။ အသေးစိတ်အတွက် [`URLSearchParams`][] documentation ကို ကြည့်ပါ။

`.searchParams` ကို သုံးပြီး `URL` ကို ပြုပြင်တဲ့အခါ သတိထားပါ — အကြောင်းကတော့ WHATWG specification အရ `URLSearchParams` object က ဘယ် characters တွေကို percent-encode လုပ်ရမလဲဆိုတာကို ဆုံးဖြတ်ရာမှာ မတူညီတဲ့ စည်းမျဉ်းတွေကို သုံးလို့ပါ။ ဥပမာ — `URL` object က ASCII tilde (`~`) character ကို percent-encode လုပ်မှာ မဟုတ်ပေမယ့် — `URLSearchParams` ကတော့ အဲဒါကို အမြဲတမ်း encode လုပ်ပါတယ်:

```js
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // prints ?foo=~bar

// Modify the URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // prints ?foo=%7Ebar
```

#### `url.username`

* Type: {string}

URL ရဲ့ username အပိုင်းကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်း ပြုလုပ်ပါတယ်။

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.username);
// Prints abc

myURL.username = '123';
console.log(myURL.href);
// Prints https://123:xyz@example.com/
```

`username` property ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးထဲမှာ ပါဝင်တဲ့ မမှန်ကန်တဲ့ URL characters တွေကို [percent-encoded][] လုပ်ပါတယ်။ ဘယ် characters တွေကို percent-encode လုပ်မလဲဆိုတဲ့ ရွေးချယ်မှုကတော့ [`url.parse()`][] နဲ့ [`url.format()`][] methods တွေက ထုတ်လုပ်တာနဲ့ နည်းနည်း ကွဲပြားနိုင်ပါတယ်။

#### `url.toString()`

* Returns: {string}

`URL` object ပေါ်က `toString()` method က serialized လုပ်ထားတဲ့ URL ကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ တန်ဖိုးက [`url.href`][] နဲ့ [`url.toJSON()`][] တို့ရဲ့ တန်ဖိုးတွေနဲ့ ညီမျှပါတယ်။

#### `url.toJSON()`

* Returns: {string}

`URL` object ပေါ်က `toJSON()` method က serialized လုပ်ထားတဲ့ URL ကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ တန်ဖိုးက [`url.href`][] နဲ့ [`url.toString()`][] တို့ရဲ့ တန်ဖိုးတွေနဲ့ ညီမျှပါတယ်။

`URL` object တစ်ခုကို [`JSON.stringify()`][] နဲ့ serialize လုပ်တဲ့အခါ ဒီ method ကို အလိုအလျောက် ခေါ်ပါတယ်။

```js
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```

#### `URL.createObjectURL(blob)`

* `blob` {Blob}
* Returns: {string}

ပေးထားတဲ့ {Blob} object ကို ကိုယ်စားပြုတဲ့ `'blob:nodedata:...'` URL string တစ်ခုကို ဖန်တီးပေးပြီး — နောက်ပိုင်းမှာ အဲဒီ `Blob` ကို ပြန်ရယူဖို့ သုံးနိုင်ပါတယ်။

```js
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```

မှတ်ပုံတင်ထားတဲ့ {Blob} က သိမ်းဆည်းထားတဲ့ data ကို — `URL.revokeObjectURL()` ကို ခေါ်ပြီး ဖယ်ရှားတဲ့အထိ — memory ထဲမှာ ထိန်းသိမ်းထားပါတယ်။

`Blob` objects တွေကို လက်ရှိ thread အတွင်းမှာ မှတ်ပုံတင်ပါတယ်။ Worker Threads တွေကို သုံးနေတယ်ဆိုရင် — Worker တစ်ခုအတွင်းမှာ မှတ်ပုံတင်ထားတဲ့ `Blob` objects တွေကို တခြား workers တွေ (သို့) main thread က သုံးလို့ ရမှာ မဟုတ်ပါဘူး။

#### `URL.revokeObjectURL(id)`

* `id` {string} အရင်က `URL.createObjectURL()` ကို ခေါ်ပြီး ရခဲ့တဲ့ `'blob:nodedata:...` URL string တစ်ခု။

ပေးထားတဲ့ ID နဲ့ သတ်မှတ်ထားတဲ့ သိမ်းဆည်းထားတဲ့ {Blob} ကို ဖယ်ရှားပါတယ်။ မှတ်ပုံတင်မထားတဲ့ ID တစ်ခုကို revoke လုပ်ဖို့ ကြိုးစားရင် — silently fail (ဘာမှ မဖြစ်သလို ကျရှုံး) သွားပါလိမ့်မယ်။

#### `URL.canParse(input[, base])`

* `input` {string} parse လုပ်ရမယ့် absolute (သို့) relative input URL ပါ။ `input` က relative ဆိုရင် `base` က မဖြစ်မနေ လိုအပ်ပါတယ်။ `input` က absolute ဆိုရင်တော့ `base` ကို လျစ်လျူရှုပါတယ်။ `input` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။
* `base` {string} `input` က absolute မဟုတ်ဘူးဆိုရင် resolve လုပ်ဖို့ သုံးတဲ့ base URL ပါ။ `base` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။
* Returns: {boolean}

`base` နဲ့ ဆက်စပ်ထားတဲ့ `input` တစ်ခုကို `URL` အဖြစ် parse လုပ်လို့ ရမရ စစ်ဆေးပါတယ်။

```js
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```

#### `URL.parse(input[, base])`

* `input` {string} parse လုပ်ရမယ့် absolute (သို့) relative input URL ပါ။ `input` က relative ဆိုရင် `base` က မဖြစ်မနေ လိုအပ်ပါတယ်။ `input` က absolute ဆိုရင်တော့ `base` ကို လျစ်လျူရှုပါတယ်။ `input` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။
* `base` {string} `input` က absolute မဟုတ်ဘူးဆိုရင် resolve လုပ်ဖို့ သုံးတဲ့ base URL ပါ။ `base` က string မဟုတ်ဘူးဆိုရင် အရင်ဆုံး [converted to a string][] လုပ်ပါတယ်။
* Returns: {URL|null}

String တစ်ခုကို URL အဖြစ် parse လုပ်ပါတယ်။ `base` ပေးထားရင် — absolute မဟုတ်တဲ့ `input` URLs တွေကို resolve လုပ်ဖို့ base URL အဖြစ် သုံးပါတယ်။ Parameters တွေကို တရားဝင် URL တစ်ခုအဖြစ် resolve လုပ်လို့ မရဘူးဆိုရင် `null` ကို ပြန်ပေးပါတယ်။

### Class: `URLPattern`

> Stability: 1 - Experimental

`URLPattern` API က URLs (သို့) URL အစိတ်အပိုင်းတွေကို pattern တစ်ခုနဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးဖို့ interface တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

```js
const myPattern = new URLPattern('https://nodejs.org/docs/latest/api/*.html');
console.log(myPattern.exec('https://nodejs.org/docs/latest/api/dns.html'));
// Prints:
// {
//  "hash": { "groups": {  "0": "" },  "input": "" },
//  "hostname": { "groups": {}, "input": "nodejs.org" },
//  "inputs": [
//    "https://nodejs.org/docs/latest/api/dns.html"
//  ],
//  "password": { "groups": { "0": "" }, "input": "" },
//  "pathname": { "groups": { "0": "dns" }, "input": "/docs/latest/api/dns.html" },
//  "port": { "groups": {}, "input": "" },
//  "protocol": { "groups": {}, "input": "https" },
//  "search": { "groups": { "0": "" }, "input": "" },
//  "username": { "groups": { "0": "" }, "input": "" }
// }

console.log(myPattern.test('https://nodejs.org/docs/latest/api/dns.html'));
// Prints: true
```

#### `new URLPattern()`

`URLPattern` object အသစ် တစ်ခုကို ဗလာအဖြစ် ဖန်တီးပါတယ်။

#### `new URLPattern(string[, baseURL][, options])`

* `string` {string} URL string တစ်ခု
* `baseURL` {string | undefined} Base URL string တစ်ခု
* `options` {Object} Options များ

`string` ကို URL အဖြစ် parse လုပ်ပြီး — `URLPattern` object အသစ်တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။

`baseURL` ကို သတ်မှတ်မထားရင် `undefined` ဖြစ်ပါတယ်။

Option တစ်ခုမှာ `ignoreCase` boolean attribute ပါဝင်နိုင်ပြီး — `true` သတ်မှတ်ထားရင် case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှုမရှိ) ဖြစ်တဲ့ matching ကို enable လုပ်ပေးပါတယ်။

Constructor က parse မအောင်မြင်တဲ့အခါ `TypeError` တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

#### `new URLPattern(obj[, baseURL][, options])`

* `obj` {Object} Input pattern တစ်ခု
* `baseURL` {string | undefined} Base URL string တစ်ခု
* `options` {Object} Options များ

`Object` ကို input pattern အဖြစ် parse လုပ်ပြီး — `URLPattern` object အသစ်တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။ Object ရဲ့ members တွေက `protocol`, `username`, `password`, `hostname`, `port`, `pathname`, `search`, `hash` (သို့) `baseURL` အနက်က တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`baseURL` ကို သတ်မှတ်မထားရင် `undefined` ဖြစ်ပါတယ်။

Option တစ်ခုမှာ `ignoreCase` boolean attribute ပါဝင်နိုင်ပြီး — `true` သတ်မှတ်ထားရင် case-insensitive ဖြစ်တဲ့ matching ကို enable လုပ်ပေးပါတယ်။

Constructor က parse မအောင်မြင်တဲ့အခါ `TypeError` တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

#### `urlPattern.exec(input[, baseURL])`

* `input` {string | Object} URL တစ်ခု (သို့) URL အစိတ်အပိုင်းများ
* `baseURL` {string | undefined} Base URL string တစ်ခု

Input က string တစ်ခု (သို့) URL အစိတ်အပိုင်း တစ်ခုချင်းစီကို ပေးထားတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ Object ရဲ့ members တွေက `protocol`, `username`, `password`, `hostname`, `port`, `pathname`, `search`, `hash` (သို့) `baseURL` အနက်က တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`baseURL` ကို သတ်မှတ်မထားရင် `undefined` ဖြစ်ပါလိမ့်မယ်။

Function ထဲကို ပေးလိုက်တဲ့ arguments တွေရဲ့ array ပါဝင်တဲ့ `inputs` key တစ်ခုနဲ့ — matched input နဲ့ matched groups တွေ ပါဝင်တဲ့ URL components တွေရဲ့ keys တွေ ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const myPattern = new URLPattern('https://nodejs.org/docs/latest/api/*.html');
console.log(myPattern.exec('https://nodejs.org/docs/latest/api/dns.html'));
// Prints:
// {
//  "hash": { "groups": {  "0": "" },  "input": "" },
//  "hostname": { "groups": {}, "input": "nodejs.org" },
//  "inputs": [
//    "https://nodejs.org/docs/latest/api/dns.html"
//  ],
//  "password": { "groups": { "0": "" }, "input": "" },
//  "pathname": { "groups": { "0": "dns" }, "input": "/docs/latest/api/dns.html" },
//  "port": { "groups": {}, "input": "" },
//  "protocol": { "groups": {}, "input": "https" },
//  "search": { "groups": { "0": "" }, "input": "" },
//  "username": { "groups": { "0": "" }, "input": "" }
// }
```

#### `urlPattern.test(input[, baseURL])`

* `input` {string | Object} URL တစ်ခု (သို့) URL အစိတ်အပိုင်းများ
* `baseURL` {string | undefined} Base URL string တစ်ခု
* Returns {boolean}

Input က string တစ်ခု (သို့) URL အစိတ်အပိုင်း တစ်ခုချင်းစီကို ပေးထားတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ Object ရဲ့ members တွေက `protocol`, `username`, `password`, `hostname`, `port`, `pathname`, `search`, `hash` (သို့) `baseURL` အနက်က တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`baseURL` ကို သတ်မှတ်မထားရင် `undefined` ဖြစ်ပါလိမ့်မယ်။

Input က လက်ရှိ pattern နဲ့ ကိုက်ညီမှု ရှိမရှိကို ဖော်ပြတဲ့ boolean တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const myPattern = new URLPattern('https://nodejs.org/docs/latest/api/*.html');
console.log(myPattern.test('https://nodejs.org/docs/latest/api/dns.html'));
// Prints: true
```

### Class: `URLSearchParams`

`URLSearchParams` API က `URL` တစ်ခုရဲ့ query ကို ဖတ်နိုင်/ရေးနိုင် (read and write access) ဖြစ်အောင် ပံ့ပိုးပေးပါတယ်။ `URLSearchParams` class ကို အောက်က constructor လေးမျိုးထဲက တစ်ခုနဲ့ — တစ်သီးတည်း (standalone) အနေနဲ့လည်း သုံးနိုင်ပါတယ်။
`URLSearchParams` class က global object ပေါ်မှာလည်း ရနိုင်ပါတယ်။

WHATWG ရဲ့ `URLSearchParams` interface နဲ့ [`querystring`][] module တို့က ရည်ရွယ်ချက် ဆင်တူပါတယ်။ ဒါပေမယ့် [`querystring`][] module ရဲ့ ရည်ရွယ်ချက်က ပိုပြီး ယေဘုယျကျပါတယ် — အကြောင်းကတော့ ၎င်းက delimiter characters (`&` နဲ့ `=`) တွေကို စိတ်ကြိုက် ပြောင်းလဲခွင့် ပြုလို့ပါ။ တစ်ဖက်မှာ ဒီ API ကတော့ URL query strings တွေအတွက်ပဲ သီးသန့် ဒီဇိုင်းလုပ်ထားတာပါ။

```js
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Prints 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Prints https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Prints https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// The above is equivalent to
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Prints https://example.org/?a=b
console.log(newSearchParams.toString());
// Prints a=b&a=c

// newSearchParams.toString() is implicitly called
myURL.search = newSearchParams;
console.log(myURL.href);
// Prints https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Prints https://example.org/?a=b&a=c
```

#### `new URLSearchParams()`

`URLSearchParams` object အသစ် တစ်ခုကို ဗလာအဖြစ် ဖန်တီးပါတယ်။

#### `new URLSearchParams(string)`

* `string` {string} Query string တစ်ခု

`string` ကို query string အဖြစ် parse လုပ်ပြီး — `URLSearchParams` object အသစ်တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။ ရှေ့ဆုံးက `'?'` ပါနေရင်လည်း လျစ်လျူရှုပါတယ်။

```js
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Prints 'abc'
console.log(params.toString());
// Prints 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Prints 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)`

* `obj` {Object} Key-value pairs တွေရဲ့ အစုအဝေးကို ကိုယ်စားပြုတဲ့ object တစ်ခု

Query hash map တစ်ခုနဲ့ `URLSearchParams` object အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `obj` ရဲ့ property တစ်ခုချင်းစီရဲ့ key နဲ့ value နှစ်ခုလုံးကို အမြဲတမ်း strings တွေအဖြစ် ပြောင်းလဲပါတယ်။

[`querystring`][] module နဲ့ မတူဘဲ — array values တွေအနေနဲ့ ပါတဲ့ duplicate keys တွေကို ခွင့်မပြုပါဘူး။ Arrays တွေကို [`array.toString()`][] နဲ့ string ပြောင်းပါတယ် — ဆိုလိုတာက array elements အားလုံးကို commas တွေနဲ့ ဆက်ပြီး string ဖြစ်အောင် လုပ်တာပါ။

```js
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Prints [ 'first,second' ]
console.log(params.toString());
// Prints 'user=abc&query=first%2Csecond'
```

#### `new URLSearchParams(iterable)`

* `iterable` {Iterable} Elements တွေက key-value pairs တွေ ဖြစ်တဲ့ iterable object တစ်ခု

{Map} ရဲ့ constructor နဲ့ ဆင်တူတဲ့ နည်းနဲ့ — iterable map တစ်ခုနဲ့ `URLSearchParams` object အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `iterable` က `Array` တစ်ခု (သို့) ဘယ် iterable object မဆို ဖြစ်နိုင်ပါတယ်။ ဆိုလိုတာက `iterable` က တခြား `URLSearchParams` တစ်ခုလည်း ဖြစ်နိုင်ပြီး — အဲဒီအခါ constructor က ပေးထားတဲ့ `URLSearchParams` ရဲ့ clone တစ်ခုကိုပဲ ဖန်တီးပေးမှာ ဖြစ်ပါတယ်။ `iterable` ရဲ့ elements တွေက key-value pairs တွေ ဖြစ်ပြီး — သူတို့ကိုယ်တိုင်လည်း ဘယ် iterable object မဆို ဖြစ်နိုင်ပါတယ်။

Duplicate keys တွေကို ခွင့်ပြုပါတယ်။

```js
let params;

// Using an array
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Using a Map object
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Prints 'user=abc&query=xyz'

// Using a generator function
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Each key-value pair must have exactly two elements
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Throws TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

#### `urlSearchParams.append(name, value)`

* `name` {string}
* `value` {string}

Query string ထဲကို name-value pair အသစ်တစ်ခု ထပ်ဖြည့်ပါတယ်။

#### `urlSearchParams.delete(name[, value])`

* `name` {string}
* `value` {string}

`value` ပေးထားရင် — name က `name` ဖြစ်ပြီး value က `value` ဖြစ်တဲ့ name-value pairs တွေ အားလုံးကို ဖယ်ရှားပါတယ်။

`value` မပေးထားဘူးဆိုရင် — name က `name` ဖြစ်တဲ့ name-value pairs တွေ အားလုံးကို ဖယ်ရှားပါတယ်။

#### `urlSearchParams.entries()`

* Returns: {Iterator}

Query ထဲက name-value pairs တစ်ခုချင်းစီအပေါ် ES6 `Iterator` တစ်ခုကို ပြန်ပေးပါတယ်။ Iterator ရဲ့ item တစ်ခုချင်းစီက JavaScript `Array` တစ်ခုပါ။ `Array` ရဲ့ ပထမ item က `name` ဖြစ်ပြီး — ဒုတိယ item ကတော့ `value` ပါ။

[`urlSearchParams[Symbol.iterator]()`][`urlSearchParamsSymbol.iterator()`] ရဲ့ alias တစ်ခုပါ။

#### `urlSearchParams.forEach(fn[, thisArg])`

* `fn` {Function} Query ထဲက name-value pair တစ်ခုချင်းစီအတွက် ခေါ်ယူပါတယ်
* `thisArg` {Object} `fn` ကို ခေါ်တဲ့အခါ `this` တန်ဖိုးအဖြစ် သုံးဖို့ ဖြစ်ပါတယ်

Query ထဲက name-value pair တစ်ခုချင်းစီအပေါ် လှည့်ပြီး (iterate) — ပေးထားတဲ့ function ကို ခေါ်ပါတယ်။

```js
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)`

* `name` {string}
* Returns: {string | null} String တစ်ခု — ပေးထားတဲ့ `name` နဲ့ ကိုက်ညီတဲ့ name-value pair မရှိရင်တော့ `null` ပါ။

Name က `name` ဖြစ်တဲ့ ပထမဆုံး name-value pair ရဲ့ value ကို ပြန်ပေးပါတယ်။ အဲဒီလို pairs တွေ မရှိရင် `null` ကို ပြန်ပေးပါတယ်။

#### `urlSearchParams.getAll(name)`

* `name` {string}
* Returns: {string\[]}

Name က `name` ဖြစ်တဲ့ name-value pairs တွေ အားလုံးရဲ့ values တွေကို ပြန်ပေးပါတယ်။ အဲဒီလို pairs တွေ မရှိရင် empty array တစ်ခုကို ပြန်ပေးပါတယ်။

#### `urlSearchParams.has(name[, value])`

* `name` {string}
* `value` {string}
* Returns: {boolean}

`URLSearchParams` object ထဲမှာ — `name` နဲ့ optional `value` argument ပေါ်မူတည်ပြီး — key-value pair(s) ပါဝင်မဝင် စစ်ဆေးပါတယ်။

`value` ပေးထားရင် — `name` ရော `value` ပါ တူညီတဲ့ name-value pair တည်ရှိနေရင် `true` ကို ပြန်ပေးပါတယ်။

`value` မပေးထားဘူးဆိုရင် — name က `name` ဖြစ်တဲ့ name-value pair အနည်းဆုံး တစ်ခု ရှိနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `urlSearchParams.keys()`

* Returns: {Iterator}

Name-value pair တစ်ခုချင်းစီရဲ့ names တွေအပေါ် ES6 `Iterator` တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)`

* `name` {string}
* `value` {string}

`URLSearchParams` object ထဲမှာ `name` နဲ့ ဆက်စပ်နေတဲ့ value ကို `value` အနေနဲ့ သတ်မှတ်ပါတယ်။ Name က `name` ဖြစ်တဲ့ name-value pairs တွေ အရင်ကတည်းက ရှိနေရင် — အဲဒီ pairs တွေထဲက ပထမဆုံး pair ရဲ့ value ကို `value` အနေနဲ့ သတ်မှတ်ပြီး ကျန်တဲ့ pairs တွေ အားလုံးကို ဖယ်ရှားပါတယ်။ မရှိဘူးဆိုရင် — name-value pair ကို query string ထဲကို ထပ်ဖြည့်ပါတယ်။

```js
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```

#### `urlSearchParams.size`

Parameter entries တွေရဲ့ စုစုပေါင်း အရေအတွက်ပါ။

#### `urlSearchParams.sort()`

ရှိပြီးသား name-value pairs တွေ အားလုံးကို သူတို့ရဲ့ names တွေအလိုက် — နေရာတွင် (in-place) sort လုပ်ပါတယ်။ Sorting ကို [stable sorting algorithm][] နဲ့ လုပ်တာမို့ — name တူညီတဲ့ name-value pairs တွေကြားက ဆက်စပ်အစီအစဉ် (relative order) ကို ထိန်းသိမ်းပေးပါတယ်။

ဒီ method ကို — အထူးသဖြင့် — cache hits တွေ များအောင် လုပ်ဖို့ သုံးနိုင်ပါတယ်။

```js
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```

#### `urlSearchParams.toString()`

* Returns: {string}

Search parameters တွေကို — လိုအပ်တဲ့နေရာတွေမှာ characters တွေကို percent-encoded လုပ်ပြီး — string တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

#### `urlSearchParams.values()`

* Returns: {Iterator}

Name-value pair တစ်ခုချင်းစီရဲ့ values တွေအပေါ် ES6 `Iterator` တစ်ခုကို ပြန်ပေးပါတယ်။

#### `urlSearchParams[Symbol.iterator]()`

* Returns: {Iterator}

Query string ထဲက name-value pairs တစ်ခုချင်းစီအပေါ် ES6 `Iterator` တစ်ခုကို ပြန်ပေးပါတယ်။ Iterator ရဲ့ item တစ်ခုချင်းစီက JavaScript `Array` တစ်ခုပါ။ `Array` ရဲ့ ပထမ item က `name` ဖြစ်ပြီး — ဒုတိယ item ကတော့ `value` ပါ။

[`urlSearchParams.entries()`][] ရဲ့ alias တစ်ခုပါ။

```js
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

### `url.domainToASCII(domain)`

* `domain` {string}
* Returns: {string}

`domain` ရဲ့ [Punycode][] ASCII serialization ကို ပြန်ပေးပါတယ်။ `domain` က မမှန်ကန်တဲ့ (invalid) domain တစ်ခုဆိုရင် empty string ကို ပြန်ပေးပါတယ်။

[`url.domainToUnicode()`][] ရဲ့ ပြောင်းပြန် (inverse) လုပ်ဆောင်ချက်ကို လုပ်ဆောင်ပါတယ်။

```mjs
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```cjs
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

### `url.domainToUnicode(domain)`

* `domain` {string}
* Returns: {string}

`domain` ရဲ့ Unicode serialization ကို ပြန်ပေးပါတယ်။ `domain` က မမှန်ကန်တဲ့ domain တစ်ခုဆိုရင် empty string ကို ပြန်ပေးပါတယ်။

[`url.domainToASCII()`][] ရဲ့ ပြောင်းပြန် (inverse) လုပ်ဆောင်ချက်ကို လုပ်ဆောင်ပါတယ်။

```mjs
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```cjs
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

### `url.fileURLToPath(url[, options])`

* `url` {URL | string} Path အဖြစ် ပြောင်းလဲရမယ့် file URL string (သို့) URL object ပါ။
* `options` {Object}
  * `windows` {boolean|undefined} `path` ကို windows filepath အဖြစ် ပြန်ပေးသင့်ရင် `true`၊ posix အဖြစ် ဆိုရင် `false`၊ system ရဲ့ default အတိုင်း ဆိုရင်တော့ `undefined` ပါ။ **Default:** `undefined`။
* Returns: {string} Platform အလိုက် အပြည့်အဝ resolve လုပ်ပြီးသား Node.js file path ပါ။

ဒီ function က percent-encoded characters တွေကို မှန်ကန်စွာ decode လုပ်ပေးပြီး — cross-platform အတွက် တရားဝင်တဲ့ absolute path string တစ်ခု ဖြစ်စေဖို့လည်း သေချာစေပါတယ်။

**Security Considerations (လုံခြုံရေး ထည့်သွင်းစဉ်းစားရန် အချက်များ):**

ဒီ function က percent-encoded characters တွေကို decode လုပ်ပါတယ် — encoded dot-segments (`%2e` က `.` အဖြစ်၊ `%2e%2e` က `..` အဖြစ်) တွေ အပါအဝင်ပါ။ ပြီးတော့ ရလာတဲ့ path ကို normalize လုပ်ပါတယ်။ ဒါကြောင့် — encoded directory traversal sequences (ဥပမာ `%2e%2e`) တွေကို တကယ့် path traversal အဖြစ် decode လုပ်ပြီး လုပ်ဆောင်သွားတာ ဖြစ်ပါတယ်။ Encoded slashes (`%2F`, `%5C`) တွေကိုတော့ မှန်ကန်စွာ ငြင်းပယ်ပါတယ်။

**Applications တွေက directory traversal attacks တွေကို ကာကွယ်ဖို့ `fileURLToPath()` တစ်ခုတည်းကိုပဲ အားကိုးလို့ မရပါဘူး။** File system operations တွေမှာ မသုံးခင် ပြန်ပေးလိုက်တဲ့ path value က မျှော်လင့်ထားတဲ့ နယ်ပယ်အတွင်းမှာ ရှိနေကြောင်း — အတိအလင်း path validation နဲ့ security checks တွေ အမြဲတမ်း လုပ်ဆောင်ပါ။

```mjs
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Incorrect: /C:/path/
fileURLToPath('file:///C:/path/');         // Correct:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrect: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correct:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrect: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correct:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrect: /hello%20world
fileURLToPath('file:///hello world');      // Correct:   /hello world (POSIX)
```

```cjs
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Incorrect: /C:/path/
fileURLToPath('file:///C:/path/');         // Correct:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrect: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correct:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrect: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correct:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrect: /hello%20world
fileURLToPath('file:///hello world');      // Correct:   /hello world (POSIX)
```

### `url.fileURLToPathBuffer(url[, options])`

* `url` {URL | string} Path အဖြစ် ပြောင်းလဲရမယ့် file URL string (သို့) URL object ပါ။
* `options` {Object}
  * `windows` {boolean|undefined} `path` ကို windows filepath အဖြစ် ပြန်ပေးသင့်ရင် `true`၊ posix အဖြစ် ဆိုရင် `false`၊ system ရဲ့ default အတိုင်း ဆိုရင်တော့ `undefined` ပါ။ **Default:** `undefined`။
* Returns: {Buffer} Platform အလိုက် အပြည့်အဝ resolve လုပ်ပြီးသား Node.js file path — {Buffer} အနေနဲ့ ပါ။

`url.fileURLToPath(...)` နဲ့ တူပါတယ် — ဒါပေမယ့် path ရဲ့ string ကိုယ်စားပြုမှုကို ပြန်ပေးမယ့်အစား `Buffer` တစ်ခုကို ပြန်ပေးပါတယ်။ Input URL ထဲမှာ တရားဝင် UTF-8 / Unicode sequences တွေ မဟုတ်တဲ့ percent-encoded segments တွေ ပါနေတဲ့အခါ — ဒီပြောင်းလဲမှုက အသုံးဝင်ပါတယ်။

**Security Considerations (လုံခြုံရေး ထည့်သွင်းစဉ်းစားရန် အချက်များ):**

ဒီ function မှာ [`url.fileURLToPath()`][] နဲ့ အတူတူပဲ လုံခြုံရေး ထည့်သွင်းစဉ်းစားစရာတွေ ရှိပါတယ်။ ၎င်းက percent-encoded characters တွေကို — encoded dot-segments (`%2e` က `.` အဖြစ်၊ `%2e%2e` က `..` အဖြစ်) အပါအဝင် — decode လုပ်ပြီး path ကို normalize လုပ်ပါတယ်။ **Applications တွေက directory traversal attacks တွေကို ကာကွယ်ဖို့ ဒီ function တစ်ခုတည်းကိုပဲ အားကိုးလို့ မရပါဘူး။** File system operations တွေမှာ မသုံးခင် ပြန်ပေးလိုက်တဲ့ buffer value ပေါ်မှာ အတိအလင်း path validation ကို အမြဲတမ်း လုပ်ဆောင်ပါ။

### `url.format(URL[, options])`

* `URL` {URL} [WHATWG URL][] object တစ်ခု
* `options` {Object}
  * `auth` {boolean} Serialized လုပ်ထားတဲ့ URL string ထဲမှာ username နဲ့ password ပါဝင်သင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `true`။
  * `fragment` {boolean} Serialized လုပ်ထားတဲ့ URL string ထဲမှာ fragment ပါဝင်သင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `true`။
  * `search` {boolean} Serialized လုပ်ထားတဲ့ URL string ထဲမှာ search query ပါဝင်သင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `true`။
  * `unicode` {boolean} URL string ရဲ့ host component ထဲမှာ ပေါ်လာတဲ့ Unicode characters တွေကို — Punycode encoding လုပ်မယ့်အစား — တိုက်ရိုက် encode လုပ်သင့်ရင် `true` ပါ။ **Default:** `false`။
* Returns: {string}

[WHATWG URL][] object တစ်ခုရဲ့ URL `String` ကိုယ်စားပြုမှုကို — စိတ်ကြိုက် ပြင်ဆင်နိုင်တဲ့ (customizable) serialization အနေနဲ့ ပြန်ပေးပါတယ်။

URL object မှာ URL ရဲ့ string serializations တွေကို ပြန်ပေးတဲ့ `toString()` method ရော `href` property ရော နှစ်ခုလုံး ရှိပါတယ်။ ဒါပေမယ့် ဒီနှစ်ခုကို ဘယ်လိုမှ စိတ်ကြိုက် ပြင်ဆင်လို့ မရပါဘူး။ `url.format(URL[, options])` method ကတော့ output ကို အခြေခံအဆင့် စိတ်ကြိုက် ပြင်ဆင်ခွင့် ပေးပါတယ်။

```mjs
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```cjs
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

### `url.pathToFileURL(path[, options])`

* `path` {string} File URL အဖြစ် ပြောင်းလဲရမယ့် path ပါ။
* `options` {Object}
  * `windows` {boolean|undefined} `path` ကို windows filepath အဖြစ် သဘောထားသင့်ရင် `true`၊ posix အဖြစ် ဆိုရင် `false`၊ system ရဲ့ default အတိုင်း ဆိုရင်တော့ `undefined` ပါ။ **Default:** `undefined`။
* Returns: {URL} File URL object ပါ။

ဒီ function က `path` ကို absolute အနေနဲ့ resolve လုပ်ပြီး — File URL အဖြစ် ပြောင်းတဲ့အခါ URL control characters တွေကို မှန်ကန်စွာ encode လုပ်ကြောင်း သေချာစေပါတယ်။

```mjs
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Incorrect: file:///foo#1
pathToFileURL('/foo#1');              // Correct:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrect: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correct:   file:///some/path%25.c (POSIX)
```

```cjs
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Incorrect: throws (POSIX)
new URL(__filename);                  // Incorrect: C:\... (Windows)
pathToFileURL(__filename);            // Correct:   file:///... (POSIX)
pathToFileURL(__filename);            // Correct:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Incorrect: file:///foo#1
pathToFileURL('/foo#1');              // Correct:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrect: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correct:   file:///some/path%25.c (POSIX)
```

### `url.urlToHttpOptions(url)`

* `url` {URL} Options object အဖြစ် ပြောင်းလဲရမယ့် [WHATWG URL][] object ပါ။
* Returns: {Object} Options object ပါ
  * `protocol` {string} သုံးရမယ့် protocol ပါ။
  * `hostname` {string} Request ပို့ရမယ့် server ရဲ့ domain name (သို့) IP address ပါ။
  * `hash` {string} URL ရဲ့ fragment အပိုင်းပါ။
  * `search` {string} URL ရဲ့ serialized လုပ်ထားတဲ့ query အပိုင်းပါ။
  * `pathname` {string} URL ရဲ့ path အပိုင်းပါ။
  * `path` {string} Request path ပါ။ Query string ရှိရင် ၎င်းကိုပါ ထည့်သင့်ပါတယ်။ ဥပမာ `'/index.html?page=12'` လိုမျိုးပါ။ Request path ထဲမှာ တရားမဝင် (illegal) characters တွေ ပါနေရင် exception တစ်ခုကို throw လုပ်ပါတယ်။ လောလောဆယ် spaces တွေကိုပဲ ငြင်းပယ်ထားပေမယ့် — ဒါက နောင်မှာ ပြောင်းလဲနိုင်ပါတယ်။
  * `href` {string} Serialized လုပ်ထားတဲ့ URL ပါ။
  * `port` {number} Remote server ရဲ့ port ပါ။
  * `auth` {string} Authorization header တစ်ခုကို တွက်ချက်ဖို့ ဖြစ်တဲ့ Basic authentication — ဆိုလိုတာ `'user:password'` ပါ။

ဒီ utility function က URL object တစ်ခုကို — [`http.request()`][] နဲ့ [`https.request()`][] APIs တွေက မျှော်လင့်တဲ့ပုံစံအတိုင်း — သာမန် options object တစ်ခုအဖြစ် ပြောင်းလဲပေးပါတယ်။

```mjs
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```cjs
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

## Legacy URL API (ရှေးဟောင်း URL API)

> Stability: 3 - Legacy: Use the WHATWG URL API instead.

### Legacy `urlObject` (ရှေးဟောင်း `urlObject`)

Legacy `urlObject` (`require('node:url').Url` (သို့) `import { Url } from 'node:url'`) ကို `url.parse()` function က ဖန်တီးပြီး ပြန်ပေးပါတယ်။

#### `urlObject.auth`

`auth` property က URL ရဲ့ username နဲ့ password အပိုင်း ဖြစ်ပြီး — _userinfo_ လို့လည်း ခေါ်ပါတယ်။ ဒီ string အပိုင်းက `protocol` နဲ့ double slashes တွေ (ပါရင်) ရဲ့ နောက်မှာ လိုက်ပြီး — `host` component ရဲ့ ရှေ့မှာ တည်ရှိပါတယ်။ `@` နဲ့ ပိုင်းခြားထားပါတယ်။ ဒီ string က username တစ်ခုတည်း ဖြစ်နိုင်သလို — `:` နဲ့ ခွဲထားတဲ့ username နဲ့ password တစ်စုံလည်း ဖြစ်နိုင်ပါတယ်။

ဥပမာ: `'user:pass'`။

#### `urlObject.hash`

`hash` property က URL ရဲ့ fragment identifier အပိုင်း ဖြစ်ပြီး — ရှေ့ဆုံးက `#` character ပါ ပါဝင်ပါတယ်။

ဥပမာ: `'#hash'`။

#### `urlObject.host`

`host` property က URL ရဲ့ lower-case ပြောင်းပြီးသား host အပိုင်း တစ်ခုလုံး ဖြစ်ပြီး — သတ်မှတ်ထားရင် `port` ကိုပါ ထည့်သွင်းပါတယ်။

ဥပမာ: `'sub.example.com:8080'`။

#### `urlObject.hostname`

`hostname` property က `host` component ရဲ့ lower-case ပြောင်းပြီးသား host name အပိုင်း ဖြစ်ပြီး — `port` ကိုတော့ _မထည့်သွင်း_ ပါဘူး။

ဥပမာ: `'sub.example.com'`။

#### `urlObject.href`

`href` property က parse လုပ်လိုက်တဲ့ URL string တစ်ခုလုံး ဖြစ်ပြီး — `protocol` ရော `host` components တွေပါ lower-case အဖြစ် ပြောင်းထားပါတယ်။

ဥပမာ: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`။

#### `urlObject.path`

`path` property က `pathname` နဲ့ `search` components တွေကို ဆက်စပ်ထားတဲ့ (concatenation) ရလဒ်ပါ။

ဥပမာ: `'/p/a/t/h?query=string'`။

`path` ကို ဘာ decoding မှ လုပ်မပေးပါဘူး။

#### `urlObject.pathname`

`pathname` property မှာ URL ရဲ့ path section တစ်ခုလုံး ပါဝင်ပါတယ်။ ဒါက `host` (port အပါအဝင်) ရဲ့ နောက်မှာ ရှိပြီး — `query` (သို့) `hash` components တွေရဲ့ ရှေ့မှာ ရှိတဲ့ အပိုင်း အားလုံးပါ။ ASCII question mark (`?`) (သို့) hash (`#`) characters တွေနဲ့ ပိုင်းခြားထားပါတယ်။

ဥပမာ: `'/p/a/t/h'`။

Path string ကို ဘာ decoding မှ လုပ်မပေးပါဘူး။

#### `urlObject.port`

`port` property က `host` component ရဲ့ numeric port အပိုင်းပါ။

ဥပမာ: `'8080'`။

#### `urlObject.protocol`

`protocol` property က URL ရဲ့ lower-case ပြောင်းပြီးသား protocol scheme ကို ခွဲခြားဖော်ပြပါတယ်။

ဥပမာ: `'http:'`။

#### `urlObject.query`

`query` property က — ရှေ့ဆုံးက ASCII question mark (`?`) မပါတဲ့ query string (သို့) [`querystring`][] module ရဲ့ `parse()` method က ပြန်ပေးတဲ့ object တစ်ခု ဖြစ်ပါတယ်။ `query` property က string လား object လားဆိုတာကို — `url.parse()` ဆီကို ပေးလိုက်တဲ့ `parseQueryString` argument က ဆုံးဖြတ်ပါတယ်။

ဥပမာ: `'query=string'` (သို့) `{'query': 'string'}`။

String အနေနဲ့ ပြန်ပေးရင် — query string ကို ဘာ decoding မှ လုပ်မပေးပါဘူး။ Object အနေနဲ့ ပြန်ပေးရင်တော့ — keys ရော values ရော နှစ်ခုလုံးကို decode လုပ်ပါတယ်။

#### `urlObject.search`

`search` property မှာ URL ရဲ့ "query string" အပိုင်း တစ်ခုလုံး ပါဝင်ပြီး — ရှေ့ဆုံးက ASCII question mark (`?`) character ပါ ပါဝင်ပါတယ်။

ဥပမာ: `'?query=string'`။

Query string ကို ဘာ decoding မှ လုပ်မပေးပါဘူး။

#### `urlObject.slashes`

`slashes` property က `boolean` တစ်ခုပါ — `protocol` ထဲက colon ရဲ့ နောက်မှာ ASCII forward-slash characters (`/`) နှစ်ခု လိုအပ်ရင် တန်ဖိုးက `true` ဖြစ်ပါတယ်။

### `url.format(urlObject)`

* `urlObject` {Object} URL object တစ်ခု (`url.parse()` က ပြန်ပေးတာ (သို့) တခြားနည်းနဲ့ တည်ဆောက်ထားတာ)။
* Returns: {string}

`url.format()` method က `urlObject` ကနေ ဆင်းသက်လာတဲ့ formatted URL string တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```

`urlObject` က object (သို့) string မဟုတ်ဘူးဆိုရင် `url.format()` က [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Formatting လုပ်ငန်းစဉ်က အောက်ပါအတိုင်း လုပ်ဆောင်ပါတယ်:

* String အလွတ်အသစ် တစ်ခုဖြစ်တဲ့ `result` ကို ဖန်တီးပါတယ်။
* `urlObject.protocol` က string တစ်ခုဆိုရင် ၎င်းကို `result` ဆီကို မူလအတိုင်း (as-is) append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.protocol` က `undefined` မဟုတ်ဘဲ string လည်း မဟုတ်ဘူးဆိုရင် [`Error`][] တစ်ခုကို throw လုပ်ပါတယ်။
* ASCII colon (`:`) character နဲ့ _အဆုံးမသတ်_ တဲ့ `urlObject.protocol` string values တွေ အားလုံးအတွက် — literal string `:` ကို `result` ဆီကို append လုပ်ပါလိမ့်မယ်။
* အောက်ပါ အခြေအနေတွေထဲက တစ်ခုခု မှန်နေရင် — literal string `//` ကို `result` ဆီကို append လုပ်ပါလိမ့်မယ်:
  * `urlObject.slashes` property က `true` ဖြစ်နေလျှင်;
  * `urlObject.protocol` က `http`, `https`, `ftp`, `gopher`, (သို့) `file` တွေထဲက တစ်ခုခုနဲ့ စနေလျှင်;
* `urlObject.auth` property ရဲ့ တန်ဖိုးက truthy ဖြစ်ပြီး — `urlObject.host` (သို့) `urlObject.hostname` အနက်က တစ်ခုခုက `undefined` မဟုတ်ဘူးဆိုရင် — `urlObject.auth` ရဲ့ တန်ဖိုးကို string အဖြစ် ပြောင်းပြီး literal string `@` ရဲ့ နောက်မှာ `result` ဆီကို append လုပ်ပါတယ်။
* `urlObject.host` property က `undefined` ဖြစ်နေရင်:
  * `urlObject.hostname` က string တစ်ခုဆိုရင် ၎င်းကို `result` ဆီကို append လုပ်ပါတယ်။
  * မဟုတ်ရင် — `urlObject.hostname` က `undefined` မဟုတ်ဘဲ string လည်း မဟုတ်ဘူးဆိုရင် [`Error`][] တစ်ခုကို throw လုပ်ပါတယ်။
  * `urlObject.port` property ရဲ့ တန်ဖိုးက truthy ဖြစ်ပြီး — `urlObject.hostname` က `undefined` မဟုတ်ဘူးဆိုရင်:
    * literal string `:` ကို `result` ဆီကို append လုပ်ပြီး၊
    * `urlObject.port` ရဲ့ တန်ဖိုးကို string အဖြစ် ပြောင်းပြီး `result` ဆီကို append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.host` property ရဲ့ တန်ဖိုးက truthy ဖြစ်နေရင် `urlObject.host` ရဲ့ တန်ဖိုးကို string အဖြစ် ပြောင်းပြီး `result` ဆီကို append လုပ်ပါတယ်။
* `urlObject.pathname` property က empty string မဟုတ်တဲ့ string တစ်ခု ဆိုရင်:
  * `urlObject.pathname` က ASCII forward slash (`/`) နဲ့ _မစ_ ဘူးဆိုရင် literal string `'/'` ကို `result` ဆီကို append လုပ်ပါတယ်။
  * `urlObject.pathname` ရဲ့ တန်ဖိုးကို `result` ဆီကို append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.pathname` က `undefined` မဟုတ်ဘဲ string လည်း မဟုတ်ဘူးဆိုရင် [`Error`][] တစ်ခုကို throw လုပ်ပါတယ်။
* `urlObject.search` property က `undefined` ဖြစ်ပြီး — `urlObject.query` property က `Object` တစ်ခု ဆိုရင် — `urlObject.query` ရဲ့ တန်ဖိုးကို ပေးပြီး [`querystring`][] module ရဲ့ `stringify()` method ကို ခေါ်လို့ ထွက်လာတဲ့ output ရဲ့ နောက်မှာ literal string `?` ကို `result` ဆီကို append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.search` က string တစ်ခုဆိုရင်:
  * `urlObject.search` ရဲ့ တန်ဖိုးက ASCII question mark (`?`) character နဲ့ _မစ_ ဘူးဆိုရင် literal string `?` ကို `result` ဆီကို append လုပ်ပါတယ်။
  * `urlObject.search` ရဲ့ တန်ဖိုးကို `result` ဆီကို append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.search` က `undefined` မဟုတ်ဘဲ string လည်း မဟုတ်ဘူးဆိုရင် [`Error`][] တစ်ခုကို throw လုပ်ပါတယ်။
* `urlObject.hash` property က string တစ်ခုဆိုရင်:
  * `urlObject.hash` ရဲ့ တန်ဖိုးက ASCII hash (`#`) character နဲ့ _မစ_ ဘူးဆိုရင် literal string `#` ကို `result` ဆီကို append လုပ်ပါတယ်။
  * `urlObject.hash` ရဲ့ တန်ဖိုးကို `result` ဆီကို append လုပ်ပါတယ်။
* မဟုတ်ရင် — `urlObject.hash` property က `undefined` မဟုတ်ဘဲ string လည်း မဟုတ်ဘူးဆိုရင် [`Error`][] တစ်ခုကို throw လုပ်ပါတယ်။
* `result` ကို ပြန်ပေးပါတယ်။

အလိုအလျောက် migration တစ်ခု ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/node-url-to-whatwg-url))။

```bash
npx codemod@latest @nodejs/node-url-to-whatwg-url
```

### `url.format(urlString)`

> Stability: 0 - Deprecated: Use the WHATWG URL API instead.

* `urlString` {string} `url.parse()` ဆီကို ပေးပြီး နောက်ပိုင်းမှာ format လုပ်မယ့် string တစ်ခုပါ။
* Returns: {string}

`url.format(urlString)` က `url.format(url.parse(urlString))` ရဲ့ အတိုကောက် (shorthand) ပုံစံပါ။

ဒါက deprecated ဖြစ်နေတဲ့ [`url.parse()`][] ကို အတွင်းပိုင်းမှာ ခေါ်သုံးတာမို့ — `url.format()` ဆီကို string argument တစ်ခု ပေးတာကိုယ်တိုင်လည်း deprecated ဖြစ်ပါတယ်။

URL string တစ်ခုကို canonicalize (စံပုံစံချ) လုပ်ချင်ရင် — WHATWG URL API ကို သုံးပြီး — URL object အသစ်တစ်ခု တည်ဆောက်ပြီး [`url.toString()`][] ကို ခေါ်ခြင်းအားဖြင့် လုပ်နိုင်ပါတယ်။

```mjs
import { URL } from 'node:url';

const unformatted = 'http://[fe80:0:0:0:0:0:0:1]:/a/b?a=b#abc';
const formatted = new URL(unformatted).toString();

console.log(formatted); // Prints: http://[fe80::1]/a/b?a=b#abc
```

```cjs
const { URL } = require('node:url');

const unformatted = 'http://[fe80:0:0:0:0:0:0:1]:/a/b?a=b#abc';
const formatted = new URL(unformatted).toString();

console.log(formatted); // Prints: http://[fe80::1]/a/b?a=b#abc
```

### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])`

> Stability: 0 - Deprecated: Use the WHATWG URL API instead.

* `urlString` {string} Parse လုပ်ရမယ့် URL string ပါ။
* `parseQueryString` {boolean} `true` ဆိုရင် — `query` property ကို [`querystring`][] module ရဲ့ `parse()` method က ပြန်ပေးတဲ့ object တစ်ခုအနေနဲ့ အမြဲတမ်း သတ်မှတ်ပါလိမ့်မယ်။ `false` ဆိုရင်တော့ — ပြန်ပေးတဲ့ URL object ပေါ်က `query` property က parse မလုပ်ရသေး၊ decode မလုပ်ရသေး ဖြစ်တဲ့ string တစ်ခု ဖြစ်ပါလိမ့်မယ်။ **Default:** `false`။
* `slashesDenoteHost` {boolean} `true` ဆိုရင် — literal string `//` ရဲ့ နောက်မှာ လာပြီး နောက် `/` ရဲ့ ရှေ့မှာ ရှိတဲ့ ပထမဆုံး token ကို `host` အဖြစ် အနက်ဖွင့်ပါလိမ့်မယ်။ ဥပမာ — `//foo/bar` ပေးထားရင် ရလဒ်က `{host: 'foo', pathname: '/bar'}` ဖြစ်ပြီး `{pathname: '//foo/bar'}` မဟုတ်ပါဘူး။ **Default:** `false`။

`url.parse()` method က URL string တစ်ခုကို ယူပြီး parse လုပ်ကာ URL object တစ်ခုကို ပြန်ပေးပါတယ်။

`urlString` က string မဟုတ်ဘူးဆိုရင် `TypeError` တစ်ခုကို throw လုပ်ပါတယ်။

`auth` property ရှိနေပေမယ့် decode လုပ်လို့ မရဘူးဆိုရင် `URIError` တစ်ခုကို throw လုပ်ပါတယ်။

`url.parse()` က URL strings တွေကို parse လုပ်ဖို့ လျော့ရဲရဲ (lenient)၊ စံမဟုတ်တဲ့ (non-standard) algorithm တစ်ခုကို သုံးပါတယ်။ ၎င်းမှာ [host name spoofing][] နဲ့ usernames/passwords တွေကို မမှန်ကန်စွာ ကိုင်တွယ်ခြင်း လိုမျိုး security issues တွေ ရှိနိုင်ပါတယ်။ မယုံကြည်ရတဲ့ (untrusted) input တွေနဲ့ မသုံးပါနဲ့။ `url.parse()` ရဲ့ vulnerabilities တွေအတွက် CVEs တွေကို ထုတ်ပြန်မပေးပါဘူး။ [WHATWG URL][] API ကို သုံးပါ — ဥပမာ:

```js
function getURL(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'example.com';
  return new URL(`${proto}://${host}${req.url || '/'}`);
}
```

အပေါ်က ဥပမာက — သင့် Node.js server ဆီကို reverse proxy တစ်ခုက ကောင်းမွန်စွာ ဖွဲ့စည်းထားတဲ့ (well-formed) headers တွေကို ထပ်ဆင့် ပို့ပေးနေတယ်လို့ ယူဆထားပါတယ်။ Reverse proxy တစ်ခုကို မသုံးဘူးဆိုရင် — အောက်က ဥပမာကို သုံးသင့်ပါတယ်:

```js
function getURL(req) {
  return new URL(`https://example.com${req.url || '/'}`);
}
```

အလိုအလျောက် migration တစ်ခု ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/node-url-to-whatwg-url))။

```bash
npx codemod@latest @nodejs/node-url-to-whatwg-url
```

### `url.resolve(from, to)`

> Stability: 0 - Deprecated: Use the WHATWG URL API instead.

* `from` {string} `to` က relative URL ဖြစ်နေရင် base အဖြစ် သုံးရမယ့် URL ပါ။
* `to` {string} Resolve လုပ်ရမယ့် target URL ပါ။

`url.resolve()` method က target URL တစ်ခုကို base URL တစ်ခုနဲ့ ဆက်စပ်ပြီး resolve လုပ်ပါတယ် — web browser တစ်ခုက anchor tag တစ်ခုကို resolve လုပ်တာနဲ့ ဆင်တူပါတယ်။

```js
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```

ဒါက deprecated ဖြစ်နေတဲ့ [`url.parse()`][] ကို အတွင်းပိုင်းမှာ ခေါ်သုံးတာမို့ — `url.resolve()` ကိုယ်တိုင်လည်း deprecated ဖြစ်ပါတယ်။

WHATWG URL API ကို သုံးပြီး အလားတူ ရလဒ်ကို ရဖို့:

```js
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` is a relative URL.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```

## Percent-encoding in URLs (URL များတွင် percent-encoding ပြုလုပ်ခြင်း)

URLs တွေမှာ ခွင့်ပြုထားတဲ့ characters အကွာအဝေး (range) တစ်ခုပဲ ပါဝင်ခွင့်ရှိပါတယ်။ အဲဒီအကွာအဝေး အပြင်ဘက်က character တစ်ခုခုကို encode လုပ်ရပါတယ်။ အဲဒီလို characters တွေကို ဘယ်လို encode လုပ်မလဲ၊ ဘယ် characters တွေကို encode လုပ်မလဲဆိုတာက — character က URL ရဲ့ ဖွဲ့စည်းပုံထဲက ဘယ်နေရာမှာ တည်ရှိနေလဲဆိုတဲ့အပေါ်မှာ လုံးဝ မူတည်ပါတယ်။

### Legacy API (ရှေးဟောင်း API နည်းလမ်း)

Legacy API ထဲမှာတော့ — URL objects တွေရဲ့ properties တွေထဲက spaces (`' '`) နဲ့ အောက်ပါ characters တွေကို အလိုအလျောက် escape လုပ်ပါလိမ့်မယ်:

```text
< > " ` \r \n \t { } | \ ^ '
```

ဥပမာ — ASCII space character (`' '`) ကို `%20` အဖြစ် encode လုပ်ပါတယ်။ ASCII forward slash (`/`) character ကို `%3C` အဖြစ် encode လုပ်ပါတယ်။

### WHATWG API (WHATWG API နည်းလမ်း)

[WHATWG URL Standard][] က encode လုပ်ရမယ့် characters တွေကို ရွေးချယ်ရာမှာ — Legacy API ထက် ပိုပြီး ရွေးချယ်မှု ခိုင်မာပြီး အသေးစိတ် (fine grained) ကျတဲ့ နည်းလမ်းကို သုံးပါတယ်။

WHATWG algorithm က percent-encode လုပ်ရမယ့် characters အကွာအဝေးတွေကို ဖော်ပြတဲ့ "percent-encode sets" လေးခုကို သတ်မှတ်ပါတယ်:

* _C0 control percent-encode set_ မှာ U+0000 ကနေ U+001F (နှစ်ဖက်စလုံး အပါအဝင်) အကွာအဝေးထဲက code points တွေနဲ့ — U+007E (\~) ထက် ကြီးတဲ့ code points တွေ အားလုံး ပါဝင်ပါတယ်။

* _fragment percent-encode set_ မှာ _C0 control percent-encode set_ နဲ့ U+0020 SPACE, U+0022 ("), U+003C (<), U+003E (>), U+0060 (\`) code points တွေ ပါဝင်ပါတယ်။

* _path percent-encode set_ မှာ _C0 control percent-encode set_ နဲ့ U+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (<), U+003E (>), U+003F (?), U+0060 (\`), U+007B ({), U+007D (}) code points တွေ ပါဝင်ပါတယ်။

* _userinfo encode set_ မှာ _path percent-encode set_ နဲ့ U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B (\[) ကနေ U+005E(^) အထိ၊ U+007C (|) code points တွေ ပါဝင်ပါတယ်။

_userinfo percent-encode set_ ကို URL ထဲမှာ encode လုပ်ထားတဲ့ usernames နဲ့ passwords တွေအတွက်ပဲ သီးသန့် သုံးပါတယ်။ _path percent-encode set_ ကို URLs အများစုရဲ့ path အတွက် သုံးပါတယ်။ _fragment percent-encode set_ ကို URL fragments တွေအတွက် သုံးပါတယ်။ _C0 control percent-encode set_ ကိုတော့ — သတ်မှတ်ထားတဲ့ အခြေအနေအချို့အောက်မှာ host နဲ့ path အတွက် — တခြားကိစ္စ အားလုံးတွေအပြင် သုံးပါတယ်။

Host name တစ်ခုထဲမှာ non-ASCII characters တွေ ပေါ်လာတဲ့အခါ — host name ကို [Punycode][] algorithm သုံးပြီး encode လုပ်ပါတယ်။ ဒါပေမယ့် — host name တစ်ခုမှာ Punycode encoded ရော percent-encoded ရော characters _နှစ်မျိုးလုံး_ ပါဝင်နိုင်တယ်ဆိုတာ သတိပြုပါ:

```js
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

[Punycode]: https://tools.ietf.org/html/rfc5891#section-4.4
[WHATWG URL]: #the-whatwg-url-api
[WHATWG URL Standard]: https://url.spec.whatwg.org/
[`Error`]: errors.md#class-error
[`JSON.stringify()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[`TypeError`]: errors.md#class-typeerror
[`URLSearchParams`]: #class-urlsearchparams
[`array.toString()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString
[`http.request()`]: http.md#httprequestoptions-callback
[`https.request()`]: https.md#httpsrequestoptions-callback
[`new URL()`]: #new-urlinput-base
[`querystring`]: querystring.md
[`url.domainToASCII()`]: #urldomaintoasciidomain
[`url.domainToUnicode()`]: #urldomaintounicodedomain
[`url.fileURLToPath()`]: #urlfileurltopathurl-options
[`url.format()`]: #urlformaturlobject
[`url.href`]: #urlhref
[`url.parse()`]: #urlparseurlstring-parsequerystring-slashesdenotehost
[`url.search`]: #urlsearch
[`url.toJSON()`]: #urltojson
[`url.toString()`]: #urltostring
[`urlSearchParams.entries()`]: #urlsearchparamsentries
[`urlSearchParamsSymbol.iterator()`]: #urlsearchparamssymboliterator
[converted to a string]: https://tc39.es/ecma262/#sec-tostring
[examples of parsed URLs]: https://url.spec.whatwg.org/#example-url-parsing
[host name spoofing]: https://hackerone.com/reports/678487
[legacy `urlObject`]: #legacy-urlobject
[percent-encoded]: #percent-encoding-in-urls
[stable sorting algorithm]: https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
