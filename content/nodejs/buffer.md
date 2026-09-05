---
title: "Buffer"
description: "node:buffer module — binary data (ဒွိစနစ် data) ကိုင်တွယ်ရာမှာ အသုံးပြုတဲ့ Buffer class အပြည့်အစုံ — character encodings, Buffer.from/alloc/allocUnsafe, Buffer.compare/concat/isBuffer, Buffers နဲ့ TypedArrays, Blob, File, node:buffer module APIs စသည်"
order: 144
source: "https://nodejs.org/api/buffer.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

`Buffer` objects တွေက သတ်မှတ်ထားတဲ့ အရှည် (fixed-length) ရှိတဲ့ bytes အစီအစဉ် (sequence) တစ်ခုကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။ Node.js APIs အများအပြားက `Buffer`s တွေကို ပံ့ပိုးပေးပါတယ်။

`Buffer` class က JavaScript ရဲ့ {Uint8Array} class ရဲ့ subclass (ဆင့်ပွား class) တစ်ခု ဖြစ်ပြီး — ထပ်ဆောင်း အသုံးပြုမှု အခြေအနေတွေ (use cases) ကို ဖုံးအုပ်ပေးတဲ့ methods တွေနဲ့ ၎င်းကို တိုးချဲ့ပေးပါတယ်။ Node.js APIs တွေက `Buffer`s တွေကို ပံ့ပိုးတဲ့ နေရာတိုင်းမှာ သာမန် {Uint8Array}s တွေကိုလည်း လက်ခံပါတယ်။

`Buffer` class က global scope (ကမ္ဘာလုံးဆိုင်ရာ နယ်ပယ်) အတွင်းမှာ ရနိုင်ပေမယ့် — import သို့မဟုတ် require statement တစ်ခုကနေတစ်ဆင့် ၎င်းကို တိုက်ရိုက် (explicitly) ရည်ညွှန်းဖို့ ဆဲဆဲ အကြံပြုထားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10,
// filled with bytes which all have the value `1`.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using fill(), write(), or other functions that fill the Buffer's
// contents.
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing the bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing the bytes [1, 1, 1, 1] – the entries
// are all truncated using `(value & 255)` to fit into the range 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Creates a Buffer containing the UTF-8-encoded bytes for the string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadecimal notation)
// [116, 195, 169, 115, 116] (in decimal notation)
const buf6 = Buffer.from('tést');

// Creates a Buffer containing the Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```cjs
const { Buffer } = require('node:buffer');

// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10,
// filled with bytes which all have the value `1`.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using fill(), write(), or other functions that fill the Buffer's
// contents.
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing the bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing the bytes [1, 1, 1, 1] – the entries
// are all truncated using `(value & 255)` to fit into the range 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Creates a Buffer containing the UTF-8-encoded bytes for the string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadecimal notation)
// [116, 195, 169, 115, 116] (in decimal notation)
const buf6 = Buffer.from('tést');

// Creates a Buffer containing the Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

## Buffers နှင့် character encodings (Buffers and character encodings)

`Buffer`s တွေနဲ့ strings တွေကြားမှာ ပြောင်းလဲတဲ့အခါ — character encoding (စာလုံး ကုဒ်ပြောင်းစနစ်) တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Character encoding တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — UTF-8 ကို default အနေနဲ့ သုံးပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

Node.js buffers တွေက သူတို့ လက်ခံရရှိတဲ့ encoding strings တွေရဲ့ case (စာလုံး အကြီး/အသေး) ပုံစံ အားလုံးကို လက်ခံပါတယ်။ ဥပမာ — UTF-8 ကို `'utf8'`, `'UTF8'`, သို့မဟုတ် `'uTf8'` စသဖြင့် သတ်မှတ်နိုင်ပါတယ်။

Node.js က လက်ရှိ ပံ့ပိုးပေးထားတဲ့ character encodings တွေကတော့ အောက်ပါအတိုင်းပါ:

* `'utf8'` (alias: `'utf-8'`): Multi-byte နဲ့ encode လုပ်ထားတဲ့ Unicode characters တွေပါ။ Web pages နဲ့ document formats တွေ အများအပြားက [UTF-8][] ကို သုံးပါတယ်။ ဒါက default character encoding ပါ။ `Buffer` တစ်ခုကို တရားဝင် (valid) UTF-8 data တွေချည်း သီးသန့် မပါဝင်တဲ့ string တစ်ခုအဖြစ် decode လုပ်တဲ့အခါ — အဲဒီ errors တွေကို ကိုယ်စားပြုဖို့ Unicode replacement character `U+FFFD` � ကို သုံးပါလိမ့်မယ်။
* `'utf16le'` (alias: `'utf-16le'`): Multi-byte နဲ့ encode လုပ်ထားတဲ့ Unicode characters တွေပါ။ `'utf8'` နဲ့ မတူပဲ — string ထဲက character တစ်ခုချင်းစီကို bytes 2 ခု သို့မဟုတ် 4 ခုနဲ့ encode လုပ်ပါလိမ့်မယ်။ Node.js က [UTF-16][] ရဲ့ [little-endian][endianness] variant ကိုသာ ပံ့ပိုးပါတယ်။
* `'latin1'`: Latin-1 ဆိုတာ [ISO-8859-1][] ကို ရည်ညွှန်းတာပါ။ ဒီ character encoding က `U+0000` ကနေ `U+00FF` အထိ ရှိတဲ့ Unicode characters တွေကိုသာ ပံ့ပိုးပါတယ်။ Character တစ်ခုချင်းစီကို byte တစ်ခုတည်းနဲ့ encode လုပ်ပါတယ်။ အဲဒီ range (အကွာအဝေး) ထဲကို မဝင်နိုင်တဲ့ characters တွေကို ဖြတ်တောက်ပြီး — အဲဒီ range ထဲက characters တွေဆီကို map လုပ်ပါလိမ့်မယ်။

အပေါ်မှာ ဖော်ပြထားတဲ့ encodings တွေထဲက တစ်ခုခုကို သုံးပြီး `Buffer` တစ်ခုကို string တစ်ခုအဖြစ် ပြောင်းလဲတာကို decoding လို့ ရည်ညွှန်းပြီး — string တစ်ခုကို `Buffer` တစ်ခုအဖြစ် ပြောင်းလဲတာကိုတော့ encoding လို့ ရည်ညွှန်းပါတယ်။

Node.js က အောက်ပါ binary-to-text encodings တွေကိုလည်း ပံ့ပိုးပေးပါတယ်။ Binary-to-text encodings တွေမှာ — အမည်ပေးခြင်း စည်းမျဉ်း (naming convention) က ပြောင်းပြန် ဖြစ်ပါတယ်: `Buffer` တစ်ခုကို string တစ်ခုအဖြစ် ပြောင်းလဲတာကို ပုံမှန်အားဖြင့် encoding လို့ ခေါ်ပြီး — string တစ်ခုကို `Buffer` အဖြစ် ပြောင်းလဲတာကိုတော့ decoding လို့ ခေါ်ပါတယ်။

* `'base64'`: [Base64][] encoding ပါ။ String တစ်ခုကနေ `Buffer` တစ်ခုကို ဖန်တီးတဲ့အခါ — ဒီ encoding က [RFC 4648, Section 5][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း "URL and Filename Safe Alphabet" ကိုပါ မှန်ကန်စွာ လက်ခံပါတယ်။ Base64 နဲ့ encode လုပ်ထားတဲ့ string အတွင်းမှာ ပါဝင်တဲ့ spaces, tabs နဲ့ new lines လိုမျိုး whitespace characters တွေကို လျစ်လျူရှုပါတယ်။
* `'base64url'`: [RFC 4648, Section 5][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း [base64url][] encoding ပါ။ String တစ်ခုကနေ `Buffer` တစ်ခုကို ဖန်တီးတဲ့အခါ — ဒီ encoding က ပုံမှန် base64 နဲ့ encode လုပ်ထားတဲ့ strings တွေကိုပါ မှန်ကန်စွာ လက်ခံပါတယ်။ `Buffer` တစ်ခုကို string တစ်ခုအဖြစ် encode လုပ်တဲ့အခါ — ဒီ encoding က padding ကို ချန်လှပ်ပါလိမ့်မယ်။
* `'hex'`: Byte တစ်ခုချင်းစီကို hexadecimal characters နှစ်ခုအနေနဲ့ encode လုပ်ပါတယ်။ ဂဏန်း အရေအတွက် ညီတဲ့ hexadecimal characters တွေချည်း သီးသန့် မပါဝင်တဲ့ strings တွေကို decode လုပ်တဲ့အခါ — data ဖြတ်တောက်ခံရမှု (truncation) ဖြစ်ပွားနိုင်ပါတယ်။ ဥပမာအတွက် အောက်မှာ ကြည့်ပါ။

အောက်ပါ ရှေးဟောင်း (legacy) character encodings တွေကိုလည်း ပံ့ပိုးပေးပါတယ်:

* `'ascii'`: 7-bit [ASCII][] data အတွက်သာ ဖြစ်ပါတယ်။ String တစ်ခုကို `Buffer` တစ်ခုအဖြစ် encode လုပ်တဲ့အခါ — ဒါက `'latin1'` ကို သုံးတာနဲ့ ညီမျှပါတယ်။ `Buffer` တစ်ခုကို string တစ်ခုအဖြစ် decode လုပ်တဲ့အခါ — ဒီ encoding ကို သုံးတာက `'latin1'` အဖြစ် decode မလုပ်ခင် byte တစ်ခုချင်းစီရဲ့ အမြင့်ဆုံး bit ကို ထပ်ဆောင်း ဖြုတ်ပေးပါလိမ့်မယ်။
  ယေဘုယျအားဖြင့် — ASCII-only text တွေကို encode သို့မဟုတ် decode လုပ်တဲ့အခါ `'utf8'` (သို့မဟုတ် — data က အမြဲတမ်း ASCII-only ဖြစ်တယ်လို့ သိရရင် — `'latin1'`) က ပိုကောင်းတဲ့ ရွေးချယ်မှု ဖြစ်တာမို့ — ဒီ encoding ကို သုံးဖို့ အကြောင်းပြချက် မရှိသင့်ပါဘူး။ ၎င်းကို legacy compatibility (နောက်ကြောင်း လိုက်ဖက်ညီမှု) အတွက်သာ ပေးထားတာပါ။
* `'binary'`: `'latin1'` ရဲ့ alias ပါ။
  ဒီ encoding ရဲ့ နာမည်က အလွန် အထင်လွဲစရာ ကောင်းနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ ဒီမှာ စာရင်းပြုထားတဲ့ encodings တွေ အားလုံးက strings တွေနဲ့ binary data တွေကြားမှာ ပြောင်းလဲပေးလို့ပါ။ Strings တွေနဲ့ `Buffer`s တွေကြားမှာ ပြောင်းလဲဖို့အတွက်ကတော့ — ပုံမှန်အားဖြင့် `'utf8'` က မှန်ကန်တဲ့ ရွေးချယ်မှုပါ။
* `'ucs2'`, `'ucs-2'`: `'utf16le'` ရဲ့ aliases တွေပါ။ UCS-2 ဆိုတာ အရင်က — code points U+FFFF ထက် ကြီးတဲ့ characters တွေကို မပံ့ပိုးခဲ့တဲ့ — UTF-16 ရဲ့ variant တစ်ခုကို ရည်ညွှန်းခဲ့တာပါ။ Node.js မှာတော့ ဒီ code points တွေကို အမြဲတမ်း ပံ့ပိုးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, all data represented.
```

```cjs
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, all data represented.
```

Modern Web browsers တွေက [WHATWG Encoding Standard][] ကို လိုက်နာပြီး — အဲဒီ standard က `'latin1'` ရော `'ISO-8859-1'` ရော နှစ်ခုလုံးကို `'win-1252'` ဆီကို alias လုပ်ပါတယ်။ ဆိုလိုတာက — `http.get()` လိုမျိုး တစ်ခုခု လုပ်နေတုန်းမှာ ပြန်ရလာတဲ့ charset က WHATWG specification ထဲမှာ စာရင်းပြုထားတဲ့ထဲက တစ်ခု ဖြစ်နေရင် — server က တကယ်တော့ `'win-1252'` နဲ့ encode လုပ်ထားတဲ့ data ကို ပြန်ပေးခဲ့တာ ဖြစ်နိုင်ပြီး — `'latin1'` encoding ကို သုံးတာက characters တွေကို မှားယွင်းစွာ decode လုပ်မိနိုင်ပါတယ်။

## Buffers နှင့် TypedArrays (Buffers and TypedArrays)

`Buffer` instances တွေက JavaScript {Uint8Array} နဲ့ {TypedArray} instances တွေလည်း ဖြစ်ပါတယ်။ {TypedArray} methods နဲ့ properties တွေ အားလုံးကို `Buffer`s တွေပေါ်မှာ ရနိုင်ပါတယ်။ ဒါပေမယ့် — `Buffer` API နဲ့ {TypedArray} API ကြားမှာတော့ သိမ်မွေ့တဲ့ (subtle) လိုက်ဖက်ညီမှု မရှိတဲ့ အချက်တွေ ရှိပါတယ်။

အထူးသဖြင့်:

* [`TypedArray.prototype.slice()`][] က `TypedArray` ရဲ့ အစိတ်အပိုင်းတစ်ခုရဲ့ copy တစ်ခုကို ဖန်တီးပေးပေမယ့် — [`Buffer.prototype.slice()`][`buf.slice()`] ကတော့ copy မလုပ်ပဲ ရှိပြီးသား `Buffer` အပေါ်မှာ view (ရှုမြင်မှု မျက်နှာပြင်) တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒီအပြုအမူက အံ့သြစရာ ကောင်းနိုင်ပြီး — legacy compatibility အတွက်သာ ရှိနေတာပါ။ [`TypedArray.prototype.subarray()`][] ကို `Buffer`s တွေရော တခြား {TypedArray}s တွေပေါ်မှာပါ [`Buffer.prototype.slice()`][`buf.slice()`] ရဲ့ အပြုအမူကို ရရှိဖို့ သုံးနိုင်ပြီး — ဦးစားပေး သုံးသင့်ပါတယ်။
* [`buf.toString()`][] က ၎င်းရဲ့ `TypedArray` နဲ့ ညီမျှတဲ့ version နဲ့ လိုက်ဖက်ညီမှု မရှိပါဘူး။
* Methods အများအပြားက — ဥပမာ [`buf.indexOf()`][] — ထပ်ဆောင်း arguments တွေကို ပံ့ပိုးပါတယ်။

`Buffer` တစ်ခုကနေ {TypedArray} instances အသစ်တွေကို ဖန်တီးဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

* `Buffer` တစ်ခုကို {TypedArray} constructor တစ်ခုဆီကို ဖြတ်သန်းပေးတာက — `Buffer` ရဲ့ contents တွေကို target type ရဲ့ byte sequence အနေနဲ့ မဟုတ်ပဲ — integers တွေရဲ့ array တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပြီး — copy လုပ်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

* `Buffer` ရဲ့ အခြေခံ (underlying) {ArrayBuffer} ကို ဖြတ်သန်းပေးတာကတော့ — `Buffer` နဲ့ memory ကို မျှဝေသုံးစွဲတဲ့ {TypedArray} တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

အလားတူ နည်းလမ်းနဲ့ပဲ — `TypedArray` object ရဲ့ `.buffer` property ကို သုံးပြီး — {TypedArray} instance တစ်ခုနဲ့ တူညီတဲ့ allocated memory ကို မျှဝေတဲ့ `Buffer` အသစ်တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ဒီအခြေအနေမှာ [`Buffer.from()`][`Buffer.from(arrayBuf)`] က `new Uint8Array()` လိုပဲ ပြုမူပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```cjs
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

{TypedArray} တစ်ခုရဲ့ `.buffer` ကို သုံးပြီး `Buffer` တစ်ခုကို ဖန်တီးတဲ့အခါ — `byteOffset` နဲ့ `length` parameters တွေကို ဖြတ်သန်းပေးခြင်းအားဖြင့် — အခြေခံ {ArrayBuffer} ရဲ့ အစိတ်အပိုင်း တစ်ခုကိုသာ သုံးနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```cjs
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

`Buffer.from()` နဲ့ [`TypedArray.from()`][] တို့မှာ မတူညီတဲ့ signatures တွေနဲ့ implementations တွေ ရှိပါတယ်။ အထူးသဖြင့် — {TypedArray} versions တွေက typed array ရဲ့ element တိုင်းပေါ်မှာ ခေါ်ယူမယ့် mapping function (ပုံဖော်သွင်း function) တစ်ခု ဖြစ်တဲ့ — ဒုတိယ argument တစ်ခုကို လက်ခံပါတယ်:

* [`TypedArray.from(source[, mapFn[, thisArg]])`][`TypedArray.from()`]

ဒါပေမယ့် — `Buffer.from()` method ကတော့ mapping function တစ်ခုရဲ့ အသုံးပြုမှုကို မပံ့ပိုးပါဘူး:

* [`Buffer.from(array)`][]
* [`Buffer.from(buffer)`][]
* [`Buffer.from(arrayBuffer[, byteOffset[, length]])`][`Buffer.from(arrayBuf)`]
* [`Buffer.from(string[, encoding])`][`Buffer.from(string)`]

### Buffer methods are callable with `Uint8Array` instances

Buffer prototype ပေါ်က methods တွေ အားလုံးကို `Uint8Array` instance တစ်ခုနဲ့ ခေါ်ယူနိုင်ပါတယ်။

```js
const { toString, write } = Buffer.prototype;

const uint8array = new Uint8Array(5);

write.call(uint8array, 'hello', 0, 5, 'utf8'); // 5
// <Uint8Array 68 65 6c 6c 6f>

toString.call(uint8array, 'utf8'); // 'hello'
```

## Buffers နှင့် iteration (Buffers and iteration)

`Buffer` instances တွေကို `for..of` syntax ကို သုံးပြီး iterate (တစ်ခုပြီးတစ်ခု ဖြတ်သန်း) လုပ်နိုင်ပါတယ်:

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

ထို့အပြင် — [`buf.values()`][], [`buf.keys()`][] နဲ့ [`buf.entries()`][] methods တွေကို iterators တွေ ဖန်တီးဖို့ သုံးနိုင်ပါတယ်။

## Class: `Blob`

{Blob} တစ်ခုက immutable (ပြောင်းလဲ၍ မရသော) raw data တွေကို စုစည်းထားပြီး — ၎င်းတို့ကို worker threads အများအပြားကြားမှာ လုံခြုံစွာ မျှဝေနိုင်ပါတယ်။

### `new buffer.Blob([sources[, options]])`

* `sources` {string\[]|ArrayBuffer\[]|TypedArray\[]|DataView\[]|Blob\[]} `Blob` အတွင်းမှာ သိမ်းဆည်းခံရမယ့် string, {ArrayBuffer}, {TypedArray}, {DataView} သို့မဟုတ် {Blob} objects တွေ (သို့မဟုတ် အဲဒီလို objects တွေရဲ့ ဘယ်လို ရောနှောမှုမဆို) ပါဝင်တဲ့ array တစ်ခုပါ။
* `options` {Object}
  * `endings` {string} `'transparent'` သို့မဟုတ် `'native'` နှစ်ခုအနက် တစ်ခုပါ။ `'native'` လို့ သတ်မှတ်ထားရင် — string source parts တွေထဲက line endings တွေကို `require('node:os').EOL` က သတ်မှတ်ထားတဲ့အတိုင်း — platform ရဲ့ native line-ending အဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။
  * `type` {string} Blob ရဲ့ content-type ပါ။ `type` က data ရဲ့ MIME media type ကို ဖော်ပြဖို့ ရည်ရွယ်ထားပေမယ့် — type format ကို validation (စိစစ်ခြင်း) လုပ်တာတော့ မရှိပါဘူး။

ပေးထားတဲ့ sources တွေရဲ့ ပေါင်းစပ်မှု (concatenation) တစ်ခု ပါဝင်တဲ့ `Blob` object အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

{ArrayBuffer}, {TypedArray}, {DataView} နဲ့ {Buffer} sources တွေကို 'Blob' ထဲကို copy လုပ်ထားတာမို့ — 'Blob' ကို ဖန်တီးပြီးနောက်မှာ ၎င်းတို့ကို လုံခြုံစွာ ပြုပြင် ပြောင်းလဲနိုင်ပါတယ်။

String sources တွေကို UTF-8 byte sequences တွေအနေနဲ့ encode လုပ်ပြီး Blob ထဲကို copy လုပ်ပါတယ်။ String part တစ်ခုချင်းစီအတွင်းမှာ တွဲမရတဲ့ (unmatched) surrogate pairs တွေကို Unicode U+FFFD replacement characters တွေနဲ့ အစားထိုးပါလိမ့်မယ်။

### `blob.arrayBuffer()`

* Returns: {Promise}

`Blob` data ရဲ့ copy တစ်ခု ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `blob.bytes()`

* Returns: {Promise}

`blob.bytes()` method က `Blob` object ရဲ့ bytes တွေကို `Promise<Uint8Array>` အနေနဲ့ ပြန်ပေးပါတယ်။

```js
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```

### `blob.size`

`Blob` ရဲ့ စုစုပေါင်း အရွယ်အစား (bytes နဲ့) ပါ။

### `blob.slice([start[, end[, type]]])`

* `start` {number} စတင်တဲ့ index ပါ။
* `end` {number} အဆုံးသတ် index ပါ။
* `type` {string} `Blob` အသစ်အတွက် content-type ပါ။
* Returns: {Blob}

ဒီ `Blob` object ရဲ့ data အစိတ်အပိုင်း (subset) တစ်ခု ပါဝင်တဲ့ `Blob` အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။ မူရင်း `Blob` ကိုတော့ မပြောင်းလဲပါဘူး။

### `blob.stream()`

* Returns: {ReadableStream}

`Blob` ရဲ့ content တွေကို ဖတ်နိုင်စေတဲ့ `ReadableStream` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

### `blob.text()`

* Returns: {Promise}

`Blob` ရဲ့ contents တွေကို UTF-8 string တစ်ခုအနေနဲ့ decode လုပ်ထားတဲ့အရာနဲ့ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `blob.textStream()`

* Returns: {ReadableStream}

`Blob` ရဲ့ content တွေကို UTF-8 နဲ့ decode လုပ်ထားတဲ့ strings တွေရဲ့ stream တစ်ခုအနေနဲ့ ဖတ်နိုင်စေတဲ့ `ReadableStream` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ ၎င်းက [`blob.stream()`][] ကို UTF-8 နဲ့ သတ်မှတ်ထားတဲ့ [`TextDecoderStream`][] တစ်ခုကနေတစ်ဆင့် pipe လုပ်တာနဲ့ ညီမျှပါတယ်။

### `blob.type`

* Type: {string}

`Blob` ရဲ့ content-type ပါ။

### `Blob` objects and `MessageChannel`

{Blob} object တစ်ခုကို ဖန်တီးပြီးတာနဲ့ — data တွေကို transfer လုပ်ခြင်း သို့မဟုတ် ချက်ချင်း copy လုပ်ခြင်း မရှိပဲ — ၎င်းကို `MessagePort` ကနေတစ်ဆင့် destinations အများအပြားဆီကို ပို့လိုက်နိုင်ပါတယ်။ `Blob` ထဲမှာ ပါဝင်တဲ့ data တွေကို `arrayBuffer()` သို့မဟုတ် `text()` methods တွေကို ခေါ်တဲ့အခါမှသာ copy လုပ်ပါတယ်။

```mjs
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```cjs
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

## Class: `Buffer`

`Buffer` class က binary data တွေကို တိုက်ရိုက် ကိုင်တွယ်ဖို့အတွက် global type (ကမ္ဘာလုံးဆိုင်ရာ အမျိုးအစား) တစ်ခုပါ။ ၎င်းကို နည်းလမ်း အမျိုးမျိုးနဲ့ construct လုပ်နိုင်ပါတယ်။

### Static method: `Buffer.alloc(size[, fill[, encoding]])`

* `size` {integer} `Buffer` အသစ်ရဲ့ လိုချင်တဲ့ အရှည်ပါ။
* `fill` {string|Buffer|Uint8Array|integer} `Buffer` အသစ်ကို ကြိုတင် ဖြည့်သွင်းရမယ့် တန်ဖိုးပါ။ **Default:** `0`.
* `encoding` {string} `fill` က string တစ်ခု ဆိုရင် — ဒါက ၎င်းရဲ့ encoding ပါ။ **Default:** `'utf8'`.
* Returns: {Buffer}

`size` bytes အရွယ်ရှိတဲ့ `Buffer` အသစ်တစ်ခုကို allocate လုပ်ပေးပါတယ်။ `fill` က `undefined` ဖြစ်နေရင် — `Buffer` ကို zero တွေနဲ့ ဖြည့်ပေးပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

`size` က [`buffer.constants.MAX_LENGTH`][] ထက် ကြီးနေရင် သို့မဟုတ် 0 ထက် ငယ်နေရင် — [`ERR_OUT_OF_RANGE`][] ကို throw လုပ်ပါတယ်။

`fill` ကို သတ်မှတ်ထားရင် — allocate လုပ်ထားတဲ့ `Buffer` ကို [`buf.fill(fill)`][`buf.fill()`] ကို ခေါ်ပြီး initialize (ကနဦး သတ်မှတ်) လုပ်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

`fill` ရော `encoding` ရော နှစ်ခုလုံး သတ်မှတ်ထားရင် — allocate လုပ်ထားတဲ့ `Buffer` ကို [`buf.fill(fill, encoding)`][`buf.fill()`] ကို ခေါ်ပြီး initialize လုပ်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

[`Buffer.alloc()`][] ကို ခေါ်တာက — အခြားရွေးချယ်စရာ [`Buffer.allocUnsafe()`][] ထက် သိသိသာသာ နှေးကွေးနိုင်ပေမယ့် — အသစ် ဖန်တီးလိုက်တဲ့ `Buffer` instance ရဲ့ contents တွေမှာ — `Buffer`s တွေအတွက် ခွဲဝေပေးခဲ့တာ မဟုတ်တဲ့ data တွေ အပါအဝင် — အရင် allocations တွေဆီက sensitive data တွေ ဘယ်တော့မှ ပါဝင်မှာ မဟုတ်ကြောင်း အာမခံပါတယ်။

`size` က number တစ်ခု မဟုတ်ရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### Static method: `Buffer.allocUnsafe(size[, alignment])`

* `size` {integer} `Buffer` အသစ်ရဲ့ လိုချင်တဲ့ အရှည်ပါ။
* `alignment` {integer} ပေးထားရင် — `Buffer` အသစ်ကို ကျောထောက်ပေးတဲ့ memory က `alignment` ရဲ့ ဆတိုးကိန်း (multiple) တစ်ခု ဖြစ်တဲ့ address တစ်ခုမှာ စတင်ပါလိမ့်မယ်။ `2 ** 30` ထက် မကြီးတဲ့ power of two (နှစ်ဆတိုး ကိန်း) တစ်ခု ဖြစ်ရပါမယ်။ [Aligned allocations][] ကို ကြည့်ပါ။
* Returns: {Buffer}

`size` bytes အရွယ်ရှိတဲ့ `Buffer` အသစ်တစ်ခုကို allocate လုပ်ပေးပါတယ်။ `size` က [`buffer.constants.MAX_LENGTH`][] ထက် ကြီးနေရင် သို့မဟုတ် 0 ထက် ငယ်နေရင် — [`ERR_OUT_OF_RANGE`][] ကို throw လုပ်ပါတယ်။

ဒီနည်းနဲ့ ဖန်တီးထားတဲ့ `Buffer` instances တွေရဲ့ အခြေခံ memory က _initialized မလုပ်ထားပါဘူး_ (_not initialized_)။ အသစ် ဖန်တီးလိုက်တဲ့ `Buffer` ရဲ့ contents တွေက မသိနိုင်တဲ့အရာတွေ ဖြစ်ပြီး — _sensitive data တွေ ပါဝင်နိုင်ပါတယ်_ (_may contain sensitive data_)။ `Buffer` instances တွေကို zeroes တွေနဲ့ initialize လုပ်ဖို့ [`Buffer.alloc()`][] ကို သုံးပါ။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (contents may vary): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (contents may vary): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

`size` က number တစ်ခု မဟုတ်ရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`Buffer` module က [`Buffer.poolSize`][] အရွယ်အစား ရှိတဲ့ internal `Buffer` instance တစ်ခုကို ကြိုတင် allocate လုပ်ထားပြီး — ၎င်းကို [`Buffer.allocUnsafe()`][], [`Buffer.from(array)`][], [`Buffer.from(string)`][] နဲ့ [`Buffer.concat()`][] တို့ကို သုံးပြီး ဖန်တီးတဲ့ `Buffer` instances အသစ်တွေကို — `size` က `Buffer.poolSize >>> 1` (ဆိုလိုတာက [`Buffer.poolSize`][] ကို နှစ်နဲ့ စားပြီး အောက်သို့ ချထားတဲ့ (floor) တန်ဖိုး) ထက် ငယ်နေမှသာ — လျင်မြန်စွာ allocate လုပ်ဖို့ pool (memory ကြိုတင် ခွဲဝေထားမှု အစု) တစ်ခုအနေနဲ့ သုံးပါတယ်။

ဒီ ကြိုတင် allocate ထားတဲ့ internal memory pool ကို သုံးခြင်း ရှိ/မရှိဆိုတာက `Buffer.alloc(size, fill)` နဲ့ `Buffer.allocUnsafe(size).fill(fill)` ခေါ်တာတွေကြားက အဓိက ကွာခြားချက် ဖြစ်ပါတယ်။ အထူးသဖြင့် — `Buffer.alloc(size, fill)` က internal `Buffer` pool ကို _ဘယ်တော့မှ_ (_never_) မသုံးပဲ — `Buffer.allocUnsafe(size).fill(fill)` ကတော့ — `size` က [`Buffer.poolSize`][] ရဲ့ တစ်ဝက် သို့မဟုတ် ထိုထက် ငယ်နေရင် — internal `Buffer` pool ကို _သုံးမှာ_ (_will_) ဖြစ်ပါတယ်။ ဒီကွာခြားချက်က သိမ်မွေ့ပေမယ့် — application တစ်ခုက [`Buffer.allocUnsafe()`][] က ပေးစွမ်းတဲ့ ထပ်ဆောင်း စွမ်းဆောင်ရည်ကို လိုအပ်တဲ့အခါ — အရေးပါလာနိုင်ပါတယ်။

### Static method: `Buffer.allocUnsafeSlow(size[, alignment])`

* `size` {integer} `Buffer` အသစ်ရဲ့ လိုချင်တဲ့ အရှည်ပါ။
* `alignment` {integer} ပေးထားရင် — `Buffer` အသစ်ကို ကျောထောက်ပေးတဲ့ memory က `alignment` ရဲ့ ဆတိုးကိန်း (multiple) တစ်ခု ဖြစ်တဲ့ address တစ်ခုမှာ စတင်ပါလိမ့်မယ်။ `2 ** 30` ထက် မကြီးတဲ့ power of two (နှစ်ဆတိုး ကိန်း) တစ်ခု ဖြစ်ရပါမယ်။ [Aligned allocations][] ကို ကြည့်ပါ။
* Returns: {Buffer}

`size` bytes အရွယ်ရှိတဲ့ `Buffer` အသစ်တစ်ခုကို allocate လုပ်ပေးပါတယ်။ `size` က [`buffer.constants.MAX_LENGTH`][] ထက် ကြီးနေရင် သို့မဟုတ် 0 ထက် ငယ်နေရင် — [`ERR_OUT_OF_RANGE`][] ကို throw လုပ်ပါတယ်။ `size` က 0 ဆိုရင် — အရှည် သုည ရှိတဲ့ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်။

ဒီနည်းနဲ့ ဖန်တီးထားတဲ့ `Buffer` instances တွေရဲ့ အခြေခံ memory က _initialized မလုပ်ထားပါဘူး_ (_not initialized_)။ အသစ် ဖန်တီးလိုက်တဲ့ `Buffer` ရဲ့ contents တွေက မသိနိုင်တဲ့အရာတွေ ဖြစ်ပြီး — _sensitive data တွေ ပါဝင်နိုင်ပါတယ်_ (_may contain sensitive data_)။ အဲဒီလို `Buffer` instances တွေကို zeroes တွေနဲ့ initialize လုပ်ဖို့ [`buf.fill(0)`][`buf.fill()`] ကို သုံးပါ။

[`Buffer.allocUnsafe()`][] ကို သုံးပြီး `Buffer` instances အသစ်တွေကို allocate လုပ်တဲ့အခါ — `Buffer.poolSize >>> 1` (default poolSize ကို သုံးတဲ့အခါ 32KiB) ထက် ငယ်တဲ့ allocations တွေကို ကြိုတင် allocate လုပ်ထားတဲ့ `Buffer` တစ်ခုတည်းကနေ slice လုပ်ယူပါတယ်။ ဒါက applications တွေကို — `Buffer` instance တစ်ခုချင်းစီ အများအပြားကို သီးခြား ဖန်တီးခြင်းရဲ့ garbage collection overhead (စွန့်ပစ်ပစ္စည်း စုဆောင်းမှု ဝန်ပို) ကို ရှောင်ရှားနိုင်စေပါတယ်။ ဒီနည်းလမ်းက — individual `ArrayBuffer` objects တွေ အများအပြားကို ခြေရာခံပြီး ရှင်းလင်းဖို့ လိုအပ်မှုကို ဖယ်ရှားပေးခြင်းအားဖြင့် — စွမ်းဆောင်ရည်ရော memory အသုံးပြုမှုပါ နှစ်မျိုးလုံးကို မြှင့်တင်ပေးပါတယ်။

ဒါပေမယ့် — developer တစ်ဦးက pool တစ်ခုကနေ memory အတုံးငယ်လေး တစ်ခုကို — ကြာချိန် အတိအကျ မသိတဲ့ (indeterminate) ကာလတစ်ခုအထိ — ထိန်းသိမ်းထားဖို့ လိုအပ်တဲ့ အခြေအနေမျိုးမှာတော့ — `Buffer.allocUnsafeSlow()` ကို သုံးပြီး pool မဟုတ်တဲ့ (un-pooled) `Buffer` instance တစ်ခုကို ဖန်တီးပြီးမှ — သက်ဆိုင်ရာ အစိတ်အပိုင်းတွေကို ကူးယူထုတ်ယူတာက သင့်လျော်နိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```cjs
const { Buffer } = require('node:buffer');

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

`size` က number တစ်ခု မဟုတ်ရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### Static method: `Buffer.byteLength(string[, encoding])`

* `string` {string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} အရှည် တွက်ချက်ရမယ့် တန်ဖိုးတစ်ခုပါ။
* `encoding` {string} `string` က string တစ်ခု ဆိုရင် — ဒါက ၎င်းရဲ့ encoding ပါ။ **Default:** `'utf8'`.
* Returns: {integer} `string` အတွင်းမှာ ပါဝင်တဲ့ bytes အရေအတွက်ပါ။

`encoding` ကို သုံးပြီး encode လုပ်လိုက်တဲ့အခါ string တစ်ခုရဲ့ byte length (bytes အရှည်) ကို ပြန်ပေးပါတယ်။ ဒါက string ကို bytes တွေအဖြစ် ပြောင်းလဲဖို့ သုံးတဲ့ encoding ကို ထည့်မတွက်တဲ့ — [`String.prototype.length`][] နဲ့ မတူပါဘူး။

`'base64'`, `'base64url'` နဲ့ `'hex'` တို့အတွက်တော့ — ဒီ function က input က တရားဝင် (valid) တယ်လို့ ယူဆပါတယ်။ Base64/hex နဲ့ encode မထားတဲ့ data တွေ (ဥပမာ — whitespace) ပါဝင်တဲ့ strings တွေအတွက်တော့ — ပြန်ပေးတဲ့ တန်ဖိုးက အဲဒီ string ကနေ ဖန်တီးထားတဲ့ `Buffer` တစ်ခုရဲ့ length ထက် ပိုကြီးနေနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```cjs
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

`string` က {Buffer|DataView|TypedArray|ArrayBuffer|SharedArrayBuffer} တစ်ခု ဖြစ်နေရင် — `.byteLength` က ဖော်ပြတဲ့အတိုင်း byte length ကို ပြန်ပေးပါတယ်။

### Static method: `Buffer.compare(buf1, buf2)`

* `buf1` {Buffer|Uint8Array}
* `buf2` {Buffer|Uint8Array}
* Returns: {integer} နှိုင်းယှဉ်မှု (comparison) ရဲ့ ရလဒ်ပေါ်မူတည်ပြီး `-1`, `0`, သို့မဟုတ် `1` ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် [`buf.compare()`][] ကို ကြည့်ပါ။

`buf1` ကို `buf2` နဲ့ နှိုင်းယှဉ်ပေးပါတယ် — ပုံမှန်အားဖြင့် `Buffer` instances တွေရဲ့ arrays တွေကို စီစဉ် (sort) ဖို့ ရည်ရွယ်ချက်နဲ့ပါ။ ဒါက [`buf1.compare(buf2)`][`buf.compare()`] ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
```

### Static method: `Buffer.concat(list[, totalLength])`

* `list` {Buffer\[] | Uint8Array\[]} ပေါင်းစပ် (concatenate) ရမယ့် `Buffer` သို့မဟုတ် {Uint8Array} instances တွေရဲ့ list ပါ။
* `totalLength` {integer} ပေါင်းစပ်လိုက်တဲ့အခါ `list` ထဲက `Buffer` instances တွေရဲ့ စုစုပေါင်း အရှည်ပါ။
* Returns: {Buffer}

`list` ထဲက `Buffer` instances တွေ အားလုံးကို အတူတကွ ပေါင်းစပ်လိုက်တဲ့ ရလဒ် ဖြစ်တဲ့ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

List ထဲမှာ items တွေ မရှိဘူးဆိုရင် သို့မဟုတ် `totalLength` က 0 ဖြစ်နေရင် — အရှည် သုည ရှိတဲ့ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

`totalLength` ကို မပေးထားဘူးဆိုရင် — `list` ထဲက `Buffer` instances တွေရဲ့ lengths တွေကို ပေါင်းခြင်းအားဖြင့် ၎င်းကို တွက်ချက်ပါတယ်။

`totalLength` ကို ပေးထားရင် — ၎င်းက unsigned integer (အပေါင်း ကိန်းပြည့်) တစ်ခု ဖြစ်ရပါမယ်။ `list` ထဲက `Buffer`s တွေရဲ့ ပေါင်းစပ် အရှည်က `totalLength` ကို ကျော်လွန်နေရင် — ရလဒ်ကို `totalLength` အထိ ဖြတ်တောက်ပါတယ်။ `list` ထဲက `Buffer`s တွေရဲ့ ပေါင်းစပ် အရှည်က `totalLength` ထက် ငယ်နေရင် — ကျန်နေတဲ့ နေရာကို zero တွေနဲ့ ဖြည့်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Create a single `Buffer` from a list of three `Buffer` instances.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

```cjs
const { Buffer } = require('node:buffer');

// Create a single `Buffer` from a list of three `Buffer` instances.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

`Buffer.concat()` ကလည်း — [`Buffer.allocUnsafe()`][] လိုပဲ — internal `Buffer` pool ကို သုံးနိုင်ပါတယ်။

### Static method: `Buffer.copyBytesFrom(view[, offset[, length]])`

* `view` {TypedArray} copy လုပ်ရမယ့် {TypedArray} ပါ။
* `offset` {integer} `view` အတွင်းမှာ စတင်မယ့် offset ပါ။ **Default:** `0`.
* `length` {integer} `view` ကနေ copy လုပ်ရမယ့် elements အရေအတွက်ပါ။ **Default:** `view.length - offset`.
* Returns: {Buffer}

`view` ရဲ့ အခြေခံ (underlying) memory ကို `Buffer` အသစ်တစ်ခုထဲကို copy လုပ်ပါတယ်။

```js
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```

### Static method: `Buffer.from(array)`

* `array` {integer\[]}
* Returns: {Buffer}

`0` – `255` range အတွင်းက bytes တွေရဲ့ `array` တစ်ခုကို သုံးပြီး `Buffer` အသစ်တစ်ခုကို allocate လုပ်ပါတယ်။ အဲဒီ range အပြင်ဘက်က array entries တွေကို အဲဒီထဲကို ဝင်ဆံ့အောင် ဖြတ်တောက်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```cjs
const { Buffer } = require('node:buffer');

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

`array` က `Array` နဲ့ ဆင်တူတဲ့ object (ဆိုလိုတာက — type `number` ရှိတဲ့ `length` property တစ်ခု ပါတဲ့ object) တစ်ခု ဆိုရင် — ၎င်းက `Buffer` သို့မဟုတ် `Uint8Array` မဟုတ်ဘူးဆိုရင် — array တစ်ခုလိုပဲ သဘောထားခံရပါတယ်။ ဆိုလိုတာက — တခြား {TypedArray} versions တွေ အားလုံးကို `Array` တစ်ခုအနေနဲ့ သဘောထားခံရပါတယ်။ `TypedArray` တစ်ခုကို ကျောထောက်နေတဲ့ bytes တွေကနေ `Buffer` တစ်ခုကို ဖန်တီးဖို့ဆိုရင် — [`Buffer.copyBytesFrom()`][] ကို သုံးပါ။

`array` က `Array` တစ်ခု သို့မဟုတ် `Buffer.from()` versions တွေအတွက် သင့်လျော်တဲ့ တခြား type တစ်ခု မဟုတ်ရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`Buffer.from(array)` နဲ့ [`Buffer.from(string)`][] တို့ကလည်း — [`Buffer.allocUnsafe()`][] လိုပဲ — internal `Buffer` pool ကို သုံးနိုင်ပါတယ်။

### Static method: `Buffer.from(arrayBuffer[, byteOffset[, length]])`

* `arrayBuffer` {ArrayBuffer|SharedArrayBuffer} {ArrayBuffer} (သို့) {SharedArrayBuffer} တစ်ခုပါ — ဥပမာ — {TypedArray} တစ်ခုရဲ့ `.buffer` property ပါ။
* `byteOffset` {integer} ထုတ်ဖော် ပြသရမယ့် ပထမဆုံး byte ရဲ့ index ပါ။ **Default:** `0`.
* `length` {integer} ထုတ်ဖော် ပြသရမယ့် bytes အရေအတွက်ပါ။ **Default:** `arrayBuffer.byteLength - byteOffset`.
* Returns: {Buffer}

ဒါက အခြေခံ memory ကို copy မလုပ်ပဲ — {ArrayBuffer} ရဲ့ view (ရှုမြင်မှု မျက်နှာပြင်) တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဥပမာ — {TypedArray} instance တစ်ခုရဲ့ `.buffer` property ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခု ဖြတ်သန်းပေးလိုက်တဲ့အခါ — အသစ် ဖန်တီးလိုက်တဲ့ `Buffer` က {TypedArray} ရဲ့ အခြေခံ `ArrayBuffer` နဲ့ တူညီတဲ့ allocated memory ကို မျှဝေပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```cjs
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

Optional ဖြစ်တဲ့ `byteOffset` နဲ့ `length` arguments တွေက `Buffer` က မျှဝေသုံးစွဲမယ့် — `arrayBuffer` အတွင်းက memory range (memory အကွာအဝေး) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

```cjs
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

`arrayBuffer` က {ArrayBuffer} (သို့) {SharedArrayBuffer} (သို့) `Buffer.from()` versions တွေအတွက် သင့်လျော်တဲ့ တခြား type တစ်ခု မဟုတ်ရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

အရေးကြီးတဲ့ မှတ်သားစရာက — ကျောထောက်ပေးတဲ့ (backing) `ArrayBuffer` တစ်ခုက {TypedArray} view ရဲ့ နယ်နိမိတ်တွေထက် ကျော်လွန် ဆန့်ထွက်နေတဲ့ memory range တစ်ခုကို ဖုံးအုပ်နိုင်ပါတယ်။ `TypedArray` တစ်ခုရဲ့ `buffer` property ကို သုံးပြီး ဖန်တီးထားတဲ့ `Buffer` အသစ်တစ်ခုက — `TypedArray` ရဲ့ range ထက်ကို ကျော်လွန် ဆန့်ထွက်နိုင်ပါတယ်:

```mjs
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

```cjs
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

### Static method: `Buffer.from(buffer)`

* `buffer` {Buffer|Uint8Array} data တွေ copy လုပ်ရမယ့် ရှိပြီးသား `Buffer` (သို့) {Uint8Array} တစ်ခုပါ။
* Returns: {Buffer}

ဖြတ်သန်းပေးလိုက်တဲ့ `buffer` ရဲ့ data တွေကို `Buffer` instance အသစ်တစ်ခုပေါ်ကို copy လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

`buffer` က `Buffer` (သို့) `Buffer.from()` versions တွေအတွက် သင့်လျော်တဲ့ တခြား type တစ်ခု မဟုတ်ရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### Static method: `Buffer.from(object[, offsetOrEncoding[, length]])`

* `object` {Object} `Symbol.toPrimitive` သို့မဟုတ် `valueOf()` ကို ပံ့ပိုးတဲ့ object တစ်ခုပါ။
* `offsetOrEncoding` {integer|string} byte-offset (သို့) encoding တစ်ခုပါ။
* `length` {integer} အရှည်တစ်ခုပါ။
* Returns: {Buffer}

`valueOf()` function က `object` နဲ့ အတိအကျ (strictly) တူညီမှု မရှိတဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးတဲ့ objects တွေအတွက် — `Buffer.from(object.valueOf(), offsetOrEncoding, length)` ကို ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

`Symbol.toPrimitive` ကို ပံ့ပိုးတဲ့ objects တွေအတွက် — `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)` ကို ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```cjs
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

`object` မှာ ဖော်ပြထားတဲ့ methods တွေ မရှိဘူးဆိုရင် သို့မဟုတ် `Buffer.from()` versions တွေအတွက် သင့်လျော်တဲ့ တခြား type တစ်ခု မဟုတ်ရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### Static method: `Buffer.from(string[, encoding])`

* `string` {string} encode လုပ်ရမယ့် string တစ်ခုပါ။
* `encoding` {string} `string` ရဲ့ encoding ပါ။ **Default:** `'utf8'`.
* Returns: {Buffer}

`string` ပါဝင်တဲ့ `Buffer` အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ `encoding` parameter က `string` ကို bytes တွေအဖြစ် ပြောင်းလဲတဲ့အခါ သုံးရမယ့် character encoding ကို ခွဲခြားဖော်ပြပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```

`string` က string (သို့) `Buffer.from()` versions တွေအတွက် သင့်လျော်တဲ့ တခြား type တစ်ခု မဟုတ်ရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

[`Buffer.from(string)`][] ကလည်း — [`Buffer.allocUnsafe()`][] လိုပဲ — internal `Buffer` pool ကို သုံးနိုင်ပါတယ်။

### Static method: `Buffer.isBuffer(obj)`

* `obj` {Object}
* Returns: {boolean}

`obj` က `Buffer` တစ်ခု ဆိုရင် `true` — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```cjs
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

### Static method: `Buffer.isEncoding(encoding)`

* `encoding` {string} စစ်ဆေးရမယ့် character encoding ရဲ့ နာမည်ပါ။
* Returns: {boolean}

`encoding` က ပံ့ပိုးထားတဲ့ character encoding တစ်ခုရဲ့ နာမည် ဆိုရင် `true` — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

```cjs
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

### `Buffer.poolSize`

* Type: {integer} **Default:** `65536`

ဒါက pooling (memory ကြိုတင် ခွဲဝေထားမှု စနစ်) အတွက် သုံးတဲ့ — ကြိုတင် allocate လုပ်ထားတဲ့ internal `Buffer` instances တွေရဲ့ အရွယ်အစား (bytes နဲ့) ပါ။ ဒီတန်ဖိုးကို ပြုပြင် ပြောင်းလဲနိုင်ပါတယ်။

### `buf[index]`

* `index` {integer}

Index operator `[index]` ကို `buf` ထဲက `index` နေရာမှာ ရှိတဲ့ octet (byte) ကို ရယူရန် နှင့် သတ်မှတ်ရန် သုံးနိုင်ပါတယ်။ တန်ဖိုးတွေက byte တစ်ခုချင်းစီကို ရည်ညွှန်းတာမို့ — တရားဝင် တန်ဖိုး range က `0x00` နဲ့ `0xFF` (hex) သို့မဟုတ် `0` နဲ့ `255` (decimal) ကြားမှာ ရှိပါတယ်။

ဒီ operator က `Uint8Array` ကနေ အမွေဆက်ခံထားတာမို့ — out-of-bounds (နယ်နိမိတ် ပြင်ပ) access တွေပေါ်မှာ ၎င်းရဲ့ အပြုအမူက `Uint8Array` နဲ့ အတူတူပါပဲ။ တစ်နည်းပြောရရင် — `index` က အနုတ်ဖြစ်နေရင် သို့မဟုတ် `buf.length` နဲ့ ညီမျှတာ သို့မဟုတ် ပိုကြီးနေရင် — `buf[index]` က `undefined` ကို ပြန်ပေးပြီး — `index` က အနုတ်ဖြစ်နေရင် သို့မဟုတ် `>= buf.length` ဖြစ်နေရင် — `buf[index] = value` က buffer ကို ပြုပြင် မွမ်းမံမှာ မဟုတ်ပါဘူး။

```mjs
import { Buffer } from 'node:buffer';

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

```cjs
const { Buffer } = require('node:buffer');

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

### `buf.buffer`

* Type: {ArrayBuffer} ဒီ `Buffer` object ကို အခြေခံပြီး ဖန်တီးထားတဲ့ underlying `ArrayBuffer` object ပါ။

ဒီ `ArrayBuffer` က မူရင်း `Buffer` နဲ့ အတိအကျ ကိုက်ညီမယ်လို့တော့ အာမခံချက် မရှိပါဘူး။ အသေးစိတ်အတွက် `buf.byteOffset` အပေါ်က မှတ်စုတွေကို ကြည့်ပါ။

```mjs
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```cjs
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

### `buf.byteOffset`

* Type: {integer} `Buffer` ရဲ့ underlying `ArrayBuffer` object ရဲ့ `byteOffset` ပါ။

`Buffer.from(ArrayBuffer, byteOffset, length)` ထဲမှာ `byteOffset` ကို သတ်မှတ်တဲ့အခါ — သို့မဟုတ် တစ်ခါတစ်ရံ `Buffer.poolSize` ထက် ငယ်တဲ့ `Buffer` တစ်ခုကို allocate လုပ်တဲ့အခါ — buffer က underlying `ArrayBuffer` ပေါ်မှာ zero offset ကနေ စတင်တာ မဟုတ်ပါဘူး။

`buf.buffer` ကို သုံးပြီး underlying `ArrayBuffer` ကို တိုက်ရိုက် ဝင်ရောက်သုံးတဲ့အခါ — ဒါက ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ `ArrayBuffer` ရဲ့ တခြား အစိတ်အပိုင်းတွေက `Buffer` object ကိုယ်တိုင်နဲ့ မသက်ဆိုင်တာ ဖြစ်နိုင်လို့ပါ။

`Buffer` တစ်ခုနဲ့ memory မျှဝေတဲ့ `TypedArray` object တစ်ခုကို ဖန်တီးတဲ့အခါ ဖြစ်လေ့ရှိတဲ့ ပြဿနာတစ်ခုက — ဒီလို အခြေအနေမျိုးမှာ `byteOffset` ကို မှန်ကန်စွာ သတ်မှတ်ပေးဖို့ လိုအပ်တာပါ:

```mjs
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```cjs
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])`

* `target` {Buffer|Uint8Array} `buf` ကို နှိုင်းယှဉ်ရမယ့် `Buffer` (သို့) {Uint8Array} တစ်ခုပါ။
* `targetStart` {integer} နှိုင်းယှဉ်မှု စတင်ရမယ့် `target` အတွင်းက offset ပါ။ **Default:** `0`.
* `targetEnd` {integer} နှိုင်းယှဉ်မှု အဆုံးသတ်ရမယ့် `target` အတွင်းက offset ပါ (ဤနေရာ မပါဝင်ပါ)။ **Default:** `target.length`.
* `sourceStart` {integer} နှိုင်းယှဉ်မှု စတင်ရမယ့် `buf` အတွင်းက offset ပါ။ **Default:** `0`.
* `sourceEnd` {integer} နှိုင်းယှဉ်မှု အဆုံးသတ်ရမယ့် `buf` အတွင်းက offset ပါ (ဤနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][].
* Returns: {integer}

`buf` ကို `target` နဲ့ နှိုင်းယှဉ်ပြီး — sort order (စီစဉ်မှု အစီအစဉ်) မှာ `buf` က `target` ရဲ့ ရှေ့မှာ လား၊ နောက်မှာ လား၊ ဒါမှမဟုတ် `target` နဲ့ အတူတူပဲ လားဆိုတာကို ညွှန်ပြတဲ့ ဂဏန်းတစ်ခုကို ပြန်ပေးပါတယ်။ နှိုင်းယှဉ်မှုက `Buffer` တစ်ခုချင်းစီအတွင်းက bytes တွေရဲ့ တကယ့် sequence (အစဉ်လိုက်) ကို အခြေခံပါတယ်။

* `target` က `buf` နဲ့ အတူတူဆိုရင် `0` ကို ပြန်ပေးပါတယ်
* `target` က စီစဉ်လိုက်တဲ့အခါ `buf` ရဲ့ _ရှေ့မှာ_ (before) လာသင့်ရင် `1` ကို ပြန်ပေးပါတယ်
* `target` က စီစဉ်လိုက်တဲ့အခါ `buf` ရဲ့ _နောက်မှာ_ (after) လာသင့်ရင် `-1` ကို ပြန်ပေးပါတယ်

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

Optional ဖြစ်တဲ့ `targetStart`, `targetEnd`, `sourceStart` နဲ့ `sourceEnd` arguments တွေကို — နှိုင်းယှဉ်မှုကို `target` နဲ့ `buf` အတွင်းက သတ်မှတ်ထားတဲ့ ranges တွေအထိ အသီးသီး ကန့်သတ်ဖို့ သုံးနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

`targetStart < 0`, `sourceStart < 0`, `targetEnd > target.byteLength` သို့မဟုတ် `sourceEnd > source.byteLength` ဖြစ်နေရင် — [`ERR_OUT_OF_RANGE`][] ကို throw လုပ်ပါတယ်။
### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])`

* `target` {Buffer|Uint8Array} ထဲကို copy လုပ်ရမယ့် `Buffer` သို့မဟုတ် {Uint8Array} တစ်ခုပါ။
* `targetStart` {integer} `target` ထဲမှာ စတင်ရေးသားမယ့် offset ပါ။ **Default:** `0`။
* `sourceStart` {integer} `buf` ထဲမှာ copy စတင်မယ့် offset ပါ။ **Default:** `0`။
* `sourceEnd` {integer} `buf` ထဲမှာ copy ရပ်တန့်မယ့် offset ပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][]။
* Returns: {integer} Copy လုပ်ပြီးသွားတဲ့ bytes အရေအတွက်ပါ။

`buf` ရဲ့ ဧရိယာ (region) တစ်ခုကနေ `target` ထဲက ဧရိယာတစ်ခုဆီကို data တွေကို copy လုပ်ပါတယ် — `target` ရဲ့ memory region က `buf` နဲ့ ထပ်နေတယ်ဆိုရင်တောင် ဖြစ်နိုင်ပါတယ်။

[`TypedArray.prototype.set()`][] ကလည်း အလားတူ လုပ်ဆောင်ချက်ကို လုပ်ဆောင်ပေးပြီး — Node.js `Buffer` တွေ အပါအဝင် — TypedArrays တွေ အားလုံးအတွက် ရနိုင်ပါတယ်။ ဒါပေမယ့် function arguments တွေကတော့ ကွဲပြားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```cjs
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```mjs
import { Buffer } from 'node:buffer';

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```cjs
const { Buffer } = require('node:buffer');

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

### `buf.entries()`

* Returns: {Iterator}

`buf` ရဲ့ contents တွေကနေ `[index, byte]` pair တွေကို ပေးတဲ့ [iterator][] တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Log the entire contents of a `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```cjs
const { Buffer } = require('node:buffer');

// Log the entire contents of a `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

### `buf.equals(otherBuffer)`

* `otherBuffer` {Buffer|Uint8Array} `buf` နဲ့ နှိုင်းယှဉ်မယ့် `Buffer` သို့မဟုတ် {Uint8Array} တစ်ခုပါ။
* Returns: {boolean}

`buf` ရော `otherBuffer` ပါ bytes အားလုံး အတိအကျ တူညီနေရင် `true` — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။ ဒါက [`buf.compare(otherBuffer) === 0`][`buf.compare()`] နဲ့ ညီမျှပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

### `buf.fill(value[, offset[, end]][, encoding])`

* `value` {string|Buffer|Uint8Array|integer} `buf` ကို ဖြည့်ဖို့ အသုံးပြုမယ့် တန်ဖိုးပါ။ ဗလာ value (string, Uint8Array, Buffer) ဆိုရင် `0` အဖြစ် အတင်းပြောင်းလဲ (coerce) ခံရပါတယ်။
* `offset` {integer} `buf` ကို စတင်ဖြည့်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ **Default:** `0`။
* `end` {integer} `buf` ဖြည့်တာ ရပ်တန့်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][]။
* `encoding` {string} `value` က string ဆိုရင် အဲဒီ `value` အတွက် encoding ပါ။ **Default:** `'utf8'`။
* Returns: {Buffer} `buf` ကိုယ်တိုင်ကို ရည်ညွှန်းတဲ့ reference ပါ။

`buf` ကို သတ်မှတ်ထားတဲ့ `value` နဲ့ ဖြည့်ပေးပါတယ်။ `offset` နဲ့ `end` တို့ကို မပေးထားဘူးဆိုရင် `buf` တစ်ခုလုံးကို ဖြည့်ပေးပါလိမ့်မယ်:

```mjs
import { Buffer } from 'node:buffer';

// Fill a `Buffer` with the ASCII character 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Fill a buffer with empty string
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```

```cjs
const { Buffer } = require('node:buffer');

// Fill a `Buffer` with the ASCII character 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Fill a buffer with empty string
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```

`value` က string, `Buffer` (သို့) integer တစ်ခုခု မဟုတ်ဘူးဆိုရင် `uint32` တန်ဖိုးတစ်ခုအဖြစ် အတင်းပြောင်းလဲခံရပါတယ်။ ရလာတဲ့ integer က `255` (ဒသမ) ထက် ကြီးနေရင် — `buf` ကို `value & 255` နဲ့ ဖြည့်ပေးပါလိမ့်မယ်။

`fill()` လုပ်ဆောင်မှုတစ်ခုရဲ့ နောက်ဆုံး ရေးသားမှုက multi-byte character တစ်ခုအပေါ်မှာ ကျရောက်နေရင် — အဲဒီ character ထဲက `buf` ထဲမှာ အံဝင်တဲ့ bytes တွေကိုသာ ရေးသားပါတယ်:

```mjs
import { Buffer } from 'node:buffer';

// Fill a `Buffer` with character that takes up two bytes in UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```

```cjs
const { Buffer } = require('node:buffer');

// Fill a `Buffer` with character that takes up two bytes in UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
```

`value` ထဲမှာ တရားဝင်မဟုတ်တဲ့ (invalid) characters တွေ ပါနေရင် — ၎င်းကို ဖြတ်တောက်လိုက်ပြီး — တရားဝင် fill data တစ်ခုမှ မကျန်ရှိတော့ဘူးဆိုရင် exception တစ်ခုကို throw လုပ်ပါတယ်:

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
```

### `buf.includes(value[, start[, end]][, encoding])`

* `value` {string|Buffer|Uint8Array|integer} ရှာဖွေရမယ့် အရာပါ။
* `start` {integer} `buf` ထဲမှာ စတင်ရှာဖွေမယ့် နေရာပါ။ အနုတ်ဖြစ်နေရင် — offset ကို `buf` ရဲ့ အဆုံးကနေ တွက်ချက်ပါတယ်။ **Default:** `0`။
* `end` {integer} `buf` ထဲမှာ ရှာဖွေတာ ရပ်တန့်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** `buf.length`။
* `encoding` {string} `value` က string ဆိုရင် ၎င်းရဲ့ encoding ပါ။ **Default:** `'utf8'`။
* Returns: {boolean} `value` ကို `buf` ထဲမှာ တွေ့ရှိရရင် `true` — မဟုတ်ရင် `false` ပါ။

ဒါက [`buf.indexOf() !== -1`][`buf.indexOf()`] နဲ့ ညီမျှပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

### `buf.indexOf(value[, start[, end]][, encoding])`

* `value` {string|Buffer|Uint8Array|integer} ရှာဖွေရမယ့် အရာပါ။
* `start` {integer} `buf` ထဲမှာ စတင်ရှာဖွေမယ့် နေရာပါ။ အနုတ်ဖြစ်နေရင် — offset ကို `buf` ရဲ့ အဆုံးကနေ တွက်ချက်ပါတယ်။ **Default:** `0`။
* `end` {integer} `buf` ထဲမှာ ရှာဖွေတာ ရပ်တန့်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** `buf.length`။
* `encoding` {string} `value` က string ဆိုရင် — `buf` ထဲမှာ ရှာဖွေမယ့် string ရဲ့ binary ပုံစံကို ဆုံးဖြတ်ဖို့ သုံးတဲ့ encoding ပါ။ **Default:** `'utf8'`။
* Returns: {integer} `value` က `buf` ထဲမှာ ပထမဆုံး တွေ့ရှိရတဲ့ နေရာရဲ့ index ပါ — `buf` ထဲမှာ `value` မပါဝင်ဘူးဆိုရင်တော့ `-1` ဖြစ်ပါတယ်။

`value` က အောက်ပါတို့ ဖြစ်နေရင်:

* string ဖြစ်ရင် — `value` ကို `encoding` ထဲမှာ ပါဝင်တဲ့ character encoding အရ အဓိပ္ပာယ်ကောက်ယူပါတယ်။
* `Buffer` သို့မဟုတ် {Uint8Array} ဖြစ်ရင် — `value` တစ်ခုလုံးကို အသုံးပြုပါတယ်။ `Buffer` တစ်ခုရဲ့ အစိတ်အပိုင်းကို နှိုင်းယှဉ်ချင်ရင် [`buf.subarray`][] ကို သုံးပါ။
* number တစ်ခု ဖြစ်ရင် — `value` ကို `0` နဲ့ `255` ကြားက unsigned 8-bit integer တန်ဖိုးတစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

`value` က string, number (သို့) `Buffer` မဟုတ်ဘူးဆိုရင် — ဒီ method က `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `value` က number ဖြစ်ရင် — 0 နဲ့ 255 ကြားက integer တစ်ခုဖြစ်တဲ့ — တရားဝင် byte တန်ဖိုးတစ်ခုအဖြစ် အတင်းပြောင်းလဲခံရပါတယ်။

`byteOffset` က number မဟုတ်ဘူးဆိုရင် — number တစ်ခုအဖြစ် အတင်းပြောင်းလဲခံရပါတယ်။ Coercion ရဲ့ ရလဒ်က `NaN` (သို့) `0` ဖြစ်နေရင် — buffer တစ်ခုလုံးကို ရှာဖွေပါလိမ့်မယ်။ ဒီအပြုအမူက [`String.prototype.indexOf()`][] နဲ့ ကိုက်ညီပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```cjs
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

`value` က ဗလာ string (သို့) ဗလာ `Buffer` ဖြစ်ပြီး `byteOffset` က `buf.length` ထက် ငယ်နေရင် — `byteOffset` ကို ပြန်ပေးပါလိမ့်မယ်။ `value` က ဗလာဖြစ်ပြီး `byteOffset` က `buf.length` နဲ့ ညီမျှခြင်း (သို့) ပိုကြီးနေရင် — `buf.length` ကို ပြန်ပေးပါလိမ့်မယ်။

### `buf.keys()`

* Returns: {Iterator}

`buf` ရဲ့ keys (indexes) တွေကို ပေးတဲ့ [iterator][] တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

### `buf.lastIndexOf(value[, start[, end]][, encoding])`

* `value` {string|Buffer|Uint8Array|integer} ရှာဖွေရမယ့် အရာပါ။
* `start` {integer} `buf` ထဲမှာ စတင်ရှာဖွေမယ့် နေရာပါ။ အနုတ်ဖြစ်နေရင် — offset ကို `buf` ရဲ့ အဆုံးကနေ တွက်ချက်ပါတယ်။ **Default:** `buf.length - 1`။
* `end` {integer} `buf` ထဲမှာ ရှာဖွေတာ ရပ်တန့်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** `buf.length`။
* `encoding` {string} `value` က string ဆိုရင် — `buf` ထဲမှာ ရှာဖွေမယ့် string ရဲ့ binary ပုံစံကို ဆုံးဖြတ်ဖို့ သုံးတဲ့ encoding ပါ။ **Default:** `'utf8'`။
* Returns: {integer} `value` က `buf` ထဲမှာ နောက်ဆုံး တွေ့ရှိရတဲ့ နေရာရဲ့ index ပါ — `buf` ထဲမှာ `value` မပါဝင်ဘူးဆိုရင်တော့ `-1` ဖြစ်ပါတယ်။

ဒါက [`buf.indexOf()`][] နဲ့ ဆင်တူပြီး — `value` ရဲ့ ပထမဆုံး ဖြစ်ပွားမှုအစား နောက်ဆုံး ဖြစ်ပွားမှုကို ရှာဖွေတာသာ ကွာခြားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

`value` က string, number (သို့) `Buffer` မဟုတ်ဘူးဆိုရင် — ဒီ method က `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `value` က number ဖြစ်ရင် — 0 နဲ့ 255 ကြားက integer တစ်ခုဖြစ်တဲ့ — တရားဝင် byte တန်ဖိုးတစ်ခုအဖြစ် အတင်းပြောင်းလဲခံရပါတယ်။

`byteOffset` က number မဟုတ်ဘူးဆိုရင် — number တစ်ခုအဖြစ် အတင်းပြောင်းလဲခံရပါတယ်။ `{}` (သို့) `undefined` လိုမျိုး — `NaN` ဆီကို ပြောင်းလဲခံရတဲ့ arguments မှန်သမျှကတော့ buffer တစ်ခုလုံးကို ရှာဖွေပါလိမ့်မယ်။ ဒီအပြုအမူက [`String.prototype.lastIndexOf()`][] နဲ့ ကိုက်ညီပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```cjs
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

`value` က ဗလာ string (သို့) ဗလာ `Buffer` ဖြစ်ရင် — `byteOffset` ကို ပြန်ပေးပါလိမ့်မယ်။

### `buf.length`

* Type: {integer}

`buf` ထဲမှာ ပါဝင်တဲ့ bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

// Create a `Buffer` and write a shorter string to it using UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```

```cjs
const { Buffer } = require('node:buffer');

// Create a `Buffer` and write a shorter string to it using UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
```

### `buf.parent`

> Stability: 0 - Deprecated: Use [`buf.buffer`][] instead.

`buf.parent` property က `buf.buffer` အတွက် deprecated (ခေတ်နောက်ကျ) alias တစ်ခုပါ။

### `buf.readBigInt64BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {bigint}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) big-endian 64-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

### `buf.readBigInt64LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {bigint}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) little-endian 64-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

### `buf.readBigUInt64BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {bigint}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) big-endian 64-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readBigUint64BE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

### `buf.readBigUInt64LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {bigint}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) little-endian 64-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readBigUint64LE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

### `buf.readDoubleBE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {number}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ 64-bit big-endian double တစ်ခုကို ဖတ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
```

### `buf.readDoubleLE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {number}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ 64-bit little-endian double တစ်ခုကို ဖတ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readFloatBE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {number}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ 32-bit big-endian float တစ်ခုကို ဖတ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Prints: 2.387939260590663e-38
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Prints: 2.387939260590663e-38
```

### `buf.readFloatLE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {number}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ 32-bit little-endian float တစ်ခုကို ဖတ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Prints: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Prints: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readInt8([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 1` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) 8-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readInt16BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) big-endian 16-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
```

### `buf.readInt16LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) little-endian 16-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Prints: 1280
console.log(buf.readInt16LE(1));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Prints: 1280
console.log(buf.readInt16LE(1));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readInt32BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) big-endian 32-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Prints: 5
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Prints: 5
```

### `buf.readInt32LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ signed (လက္ခဏာပါ) little-endian 32-bit integer တစ်ခုကို ဖတ်ပါတယ်။

`Buffer` တစ်ခုကနေ ဖတ်လိုက်တဲ့ integers တွေကို two's complement signed values အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readIntBE(offset, byteLength)`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ bytes `byteLength` အရေအတွက် ဖတ်ပြီး — accuracy (တိကျမှု) 48 bits အထိ ပံ့ပိုးတဲ့ — big-endian, two's complement signed value တစ်ခုအနေနဲ့ ရလဒ်ကို အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readIntLE(offset, byteLength)`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ bytes `byteLength` အရေအတွက် ဖတ်ပြီး — accuracy (တိကျမှု) 48 bits အထိ ပံ့ပိုးတဲ့ — little-endian, two's complement signed value တစ်ခုအနေနဲ့ ရလဒ်ကို အဓိပ္ပာယ်ကောက်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```

### `buf.readUInt8([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 1` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) 8-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readUint8` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readUInt16BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) big-endian 16-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readUint16BE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```

### `buf.readUInt16LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) little-endian 16-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readUint16LE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readUInt32BE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) big-endian 32-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readUint32BE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Prints: 12345678
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Prints: 12345678
```

### `buf.readUInt32LE([offset])`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ unsigned (လက္ခဏာမပါ) little-endian 32-bit integer တစ်ခုကို ဖတ်ပါတယ်။

ဒီ function ကို `readUint32LE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Prints: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Prints: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readUIntBE(offset, byteLength)`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ bytes `byteLength` အရေအတွက် ဖတ်ပြီး — accuracy (တိကျမှု) 48 bits အထိ ပံ့ပိုးတဲ့ — unsigned big-endian integer တစ်ခုအနေနဲ့ ရလဒ်ကို အဓိပ္ပာယ်ကောက်ပါတယ်။

ဒီ function ကို `readUintBE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

### `buf.readUIntLE(offset, byteLength)`

* `offset` {integer} မဖတ်ခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer}

သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ကနေ bytes `byteLength` အရေအတွက် ဖတ်ပြီး — accuracy (တိကျမှု) 48 bits အထိ ပံ့ပိုးတဲ့ — unsigned little-endian integer တစ်ခုအနေနဲ့ ရလဒ်ကို အဓိပ္ပာယ်ကောက်ပါတယ်။

ဒီ function ကို `readUintLE` alias အောက်မှာလည်း ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```

### `buf.subarray([start[, end]])`

* `start` {integer} `Buffer` အသစ် စတင်မယ့် နေရာပါ။ **Default:** `0`။
* `end` {integer} `Buffer` အသစ် အဆုံးသတ်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][]။
* Returns: {Buffer}

မူရင်း `Buffer` နဲ့ memory တစ်ခုတည်းကို ရည်ညွှန်းတဲ့ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ် — ဒါပေမယ့် `start` နဲ့ `end` indexes တွေအရ offset ပြောင်းပြီး ဖြတ်တောက်ထားပါတယ်။

`end` ကို [`buf.length`][] ထက် ပိုကြီးအောင် သတ်မှတ်ရင်လည်း — `end` က [`buf.length`][] နဲ့ ညီမျှနေတာနဲ့ အတူတူပဲ ရလဒ်ကို ပြန်ပေးပါလိမ့်မယ်။

ဒီ method က [`TypedArray.prototype.subarray()`][] ကနေ အမွေဆက်ခံထားတာပါ။

`Buffer` slice အသစ်ကို ပြုပြင်လိုက်ရင် — objects နှစ်ခုရဲ့ ခွဲဝေထားတဲ့ memory တွေ ထပ်နေတာမို့ — မူရင်း `Buffer` ထဲက memory ကိုပါ ပြုပြင်မိပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';

// Create a `Buffer` with the ASCII alphabet, take a slice, and modify one byte
// from the original `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```

```cjs
const { Buffer } = require('node:buffer');

// Create a `Buffer` with the ASCII alphabet, take a slice, and modify one byte
// from the original `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```

အနုတ် indexes တွေကို သတ်မှတ်လိုက်ရင် — slice ကို `buf` ရဲ့ အစပိုင်းအစား အဆုံးပိုင်းကနေ တွက်ချက်ပြီး ထုတ်ပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```

### `buf.slice([start[, end]])`

> Stability: 0 - Deprecated: Use [`buf.subarray`][] instead.

* `start` {integer} `Buffer` အသစ် စတင်မယ့် နေရာပါ။ **Default:** `0`။
* `end` {integer} `Buffer` အသစ် အဆုံးသတ်မယ့် နေရာပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][]။
* Returns: {Buffer}

မူရင်း `Buffer` နဲ့ memory တစ်ခုတည်းကို ရည်ညွှန်းတဲ့ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ် — ဒါပေမယ့် `start` နဲ့ `end` indexes တွေအရ offset ပြောင်းပြီး ဖြတ်တောက်ထားပါတယ်။

ဒီ method က — `Buffer` ရဲ့ superclass ဖြစ်တဲ့ — `Uint8Array.prototype.slice()` နဲ့တော့ လိုက်ဖက်ညီမှု မရှိပါဘူး။ Slice ကို copy လုပ်ချင်ရင် `Uint8Array.prototype.slice()` ကို သုံးပါ။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
```

### `buf.swap16()`

* Returns: {Buffer} `buf` ကိုယ်တိုင်ကို ရည်ညွှန်းတဲ့ reference ပါ။

`buf` ကို unsigned 16-bit integers တွေရဲ့ array တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပြီး — byte order ကို _နေရာတွင်း (in-place)_ မှာ လဲလှယ်ပါတယ်။ [`buf.length`][] က 2 ရဲ့ အဆမဟုတ်ရင် [`ERR_INVALID_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

`buf.swap16()` ရဲ့ အဆင်ပြေတဲ့ အသုံးတစ်ခုက — UTF-16 little-endian နဲ့ UTF-16 big-endian အကြား — မြန်ဆန်တဲ့ in-place conversion (နေရာတွင်း ပြောင်းလဲခြင်း) ကို လုပ်ဆောင်ဖို့ပါ:

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

### `buf.swap32()`

* Returns: {Buffer} `buf` ကိုယ်တိုင်ကို ရည်ညွှန်းတဲ့ reference ပါ။

`buf` ကို unsigned 32-bit integers တွေရဲ့ array တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပြီး — byte order ကို _နေရာတွင်း (in-place)_ မှာ လဲလှယ်ပါတယ်။ [`buf.length`][] က 4 ရဲ့ အဆမဟုတ်ရင် [`ERR_INVALID_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

### `buf.swap64()`

* Returns: {Buffer} `buf` ကိုယ်တိုင်ကို ရည်ညွှန်းတဲ့ reference ပါ။

`buf` ကို 64-bit numbers တွေရဲ့ array တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပြီး — byte order ကို _နေရာတွင်း (in-place)_ မှာ လဲလှယ်ပါတယ်။ [`buf.length`][] က 8 ရဲ့ အဆမဟုတ်ရင် [`ERR_INVALID_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

### `buf.toJSON()`

* Returns: {Object}

`buf` ရဲ့ JSON ပုံစံ (representation) တစ်ခုကို ပြန်ပေးပါတယ်။ `Buffer` instance တစ်ခုကို stringify လုပ်တဲ့အခါ — [`JSON.stringify()`][] က ဒီ function ကို သွယ်ဝိုက်၍ (implicitly) ခေါ်ပါတယ်။

`Buffer.from()` က ဒီ method ကနေ ပြန်လာတဲ့ format နဲ့ objects တွေကို လက်ခံပါတယ်။ အထူးသဖြင့် — `Buffer.from(buf.toJSON())` က `Buffer.from(buf)` လိုပဲ အလုပ်လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

### `buf.toString([encoding[, start[, end]]])`

* `encoding` {string} အသုံးပြုမယ့် character encoding ပါ။ **Default:** `'utf8'`။
* `start` {integer} Decoding စတင်မယ့် byte offset ပါ။ **Default:** `0`။
* `end` {integer} Decoding ရပ်တန့်မယ့် byte offset ပါ (ထိုနေရာ မပါဝင်ပါ)။ **Default:** [`buf.length`][]။
* Returns: {string}

`encoding` ထဲမှာ သတ်မှတ်ထားတဲ့ character encoding အရ `buf` ကို string တစ်ခုအဖြစ် decode လုပ်ပါတယ်။ `buf` ရဲ့ အစိတ်အပိုင်းတစ်ခုကိုသာ decode လုပ်ချင်ရင် `start` နဲ့ `end` တို့ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။

`encoding` က `'utf8'` ဖြစ်ပြီး input ထဲက byte sequence တစ်ခုက တရားဝင် UTF-8 မဟုတ်ဘူးဆိုရင် — invalid byte တစ်ခုချင်းစီကို replacement character `U+FFFD` နဲ့ အစားထိုးပါတယ်။

String instance တစ်ခုရဲ့ အများဆုံး အရှည် (UTF-16 code units နဲ့) ကို [`buffer.constants.MAX_STRING_LENGTH`][] အနေနဲ့ ရနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```cjs
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

### `buf.values()`

* Returns: {Iterator}

`buf` ရဲ့ values (bytes) တွေအတွက် [iterator][] တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။ `Buffer` တစ်ခုကို `for..of` statement ထဲမှာ သုံးတဲ့အခါ — ဒီ function ကို အလိုအလျောက် ခေါ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

### `buf.write(string[, offset[, length]][, encoding])`

* `string` {string} `buf` ဆီကို ရေးသားရမယ့် string ပါ။
* `offset` {integer} `string` ကို မစတင်ရေးခင် ကျော်သွားရမယ့် bytes အရေအတွက်ပါ။ **Default:** `0`။
* `length` {integer} ရေးသားရမယ့် အများဆုံး bytes အရေအတွက်ပါ (ရေးသားလိုက်တဲ့ bytes တွေက `buf.length - offset` ထက် မကျော်လွန်ပါ)။ **Default:** `buf.length - offset`။
* `encoding` {string} `string` ရဲ့ character encoding ပါ။ **Default:** `'utf8'`။
* Returns: {integer} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`encoding` ထဲမှာ ပါဝင်တဲ့ character encoding အရ — `buf` ဆီကို `offset` မှာ `string` ကို ရေးသားပါတယ်။ `length` parameter က ရေးသားရမယ့် bytes အရေအတွက်ပါ။ `buf` ထဲမှာ string တစ်ခုလုံး အံဝင်ဖို့ နေရာ မလုံလောက်ဘူးဆိုရင် — `string` ရဲ့ တစ်စိတ်တစ်ပိုင်းကိုသာ ရေးသားပါလိမ့်မယ်။ ဒါပေမယ့် — encoding လုပ်ထားတဲ့ character ရဲ့ တစ်စိတ်တစ်ပိုင်း (partially encoded characters) တွေကိုတော့ ရေးသားမှာ မဟုတ်ပါဘူး။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
### `buf.writeBigInt64BE(value[, offset])`

* `value` {bigint} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

### `buf.writeBigInt64LE(value[, offset])`

* `value` {bigint} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

### `buf.writeBigUInt64BE(value[, offset])`

* `value` {bigint} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။

ဒီ function ကို `writeBigUint64BE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

### `buf.writeBigUInt64LE(value[, offset])`

* `value` {bigint} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

ဒီ function ကို `writeBigUint64LE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

### `buf.writeDoubleBE(value[, offset])`

* `value` {number} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က JavaScript number တစ်ခု ဖြစ်ရပါမယ်။ `value` က JavaScript number ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

### `buf.writeDoubleLE(value[, offset])`

* `value` {number} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 8` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က JavaScript number တစ်ခု ဖြစ်ရပါမယ်။ `value` က JavaScript number ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

### `buf.writeFloatBE(value[, offset])`

* `value` {number} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က JavaScript number ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

### `buf.writeFloatLE(value[, offset])`

* `value` {number} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က JavaScript number ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

### `buf.writeInt8(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 1` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) signed 8-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က signed 8-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

### `buf.writeInt16BE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) signed 16-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က signed 16-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

### `buf.writeInt16LE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) signed 16-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က signed 16-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

### `buf.writeInt32BE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) signed 32-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က signed 32-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

### `buf.writeInt32LE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) signed 32-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က signed 32-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

`value` ကို two's complement signed integer အဖြစ် အနက်ဖွင့်ပြီး ရေးသားပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

### `buf.writeIntBE(value, offset, byteLength)`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ရေးသားရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ရဲ့ bytes `byteLength` ခုကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ တိကျမှု 48 bits အထိ ပံ့ပိုးပါတယ်။ `value` က signed integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

### `buf.writeIntLE(value, offset, byteLength)`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ရေးသားရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ရဲ့ bytes `byteLength` ခုကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ တိကျမှု 48 bits အထိ ပံ့ပိုးပါတယ်။ `value` က signed integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

### `buf.writeUInt8(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 1` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) unsigned 8-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က unsigned 8-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUint8` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

### `buf.writeUInt16BE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) unsigned 16-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က unsigned 16-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUint16BE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

### `buf.writeUInt16LE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 2` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) unsigned 16-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က unsigned 16-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUint16LE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

### `buf.writeUInt32BE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) unsigned 32-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က unsigned 32-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUint32BE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

### `buf.writeUInt32LE(value[, offset])`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - 4` ဖြစ်ရပါမယ်။ **Default:** `0`.
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ `value` က တရားဝင် (valid) unsigned 32-bit integer တစ်ခု ဖြစ်ရပါမယ်။ `value` က unsigned 32-bit integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUint32LE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

### `buf.writeUIntBE(value, offset, byteLength)`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ရေးသားရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ရဲ့ bytes `byteLength` ခုကို သတ်မှတ်ထားတဲ့ `offset` မှာ big-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ တိကျမှု 48 bits အထိ ပံ့ပိုးပါတယ်။ `value` က unsigned integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUintBE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

### `buf.writeUIntLE(value, offset, byteLength)`

* `value` {integer} `buf` ဆီသို့ ရေးသားရန် ဂဏန်းတစ်ခုပါ။
* `offset` {integer} စတင်ရေးသားခြင်း မပြုမီ ကျော်လိုက်ရမယ့် bytes အရေအတွက်ပါ။ `0 <= offset <= buf.length - byteLength` ဖြစ်ရပါမယ်။
* `byteLength` {integer} ရေးသားရမယ့် bytes အရေအတွက်ပါ။ `0 < byteLength <= 6` ဖြစ်ရပါမယ်။
* Returns: {integer} `offset` အပေါင်း ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

`value` ရဲ့ bytes `byteLength` ခုကို သတ်မှတ်ထားတဲ့ `offset` မှာ little-endian အနေနဲ့ `buf` ဆီသို့ ရေးသားပါတယ်။ တိကျမှု 48 bits အထိ ပံ့ပိုးပါတယ်။ `value` က unsigned integer ကလွဲလို့ တခြားအရာတစ်ခုခု ဖြစ်နေရင် အပြုအမူက undefined ဖြစ်ပါတယ်။

ဒီ function ကို `writeUintLE` alias အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```cjs
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

### `new Buffer(array)`

> Stability: 0 - Deprecated: Use [`Buffer.from(array)`][] instead.

* `array` {integer\[]} copy လုပ်ယူရမယ့် bytes array တစ်ခုပါ။

[`Buffer.from(array)`][] ကို ကြည့်ပါ။

### `new Buffer(arrayBuffer[, byteOffset[, length]])`

> Stability: 0 - Deprecated: Use
> [`Buffer.from(arrayBuffer[, byteOffset[, length]])`][`Buffer.from(arrayBuf)`]
> instead.

* `arrayBuffer` {ArrayBuffer|SharedArrayBuffer} {ArrayBuffer}, {SharedArrayBuffer} သို့မဟုတ် {TypedArray} တစ်ခုရဲ့ `.buffer` property ဖြစ်ပါတယ်။
* `byteOffset` {integer} ထုတ်ဖော်ပြသမယ့် ပထမဆုံး byte ရဲ့ index ပါ။ **Default:** `0`.
* `length` {integer} ထုတ်ဖော်ပြသမယ့် bytes အရေအတွက်ပါ။ **Default:** `arrayBuffer.byteLength - byteOffset`.

[`Buffer.from(arrayBuffer[, byteOffset[, length]])`][`Buffer.from(arrayBuf)`] ကို ကြည့်ပါ။

### `new Buffer(buffer)`

> Stability: 0 - Deprecated: Use [`Buffer.from(buffer)`][] instead.

* `buffer` {Buffer|Uint8Array} data copy လုပ်ယူရမယ့် ရှိပြီးသား `Buffer` သို့မဟုတ် {Uint8Array} တစ်ခုပါ။

[`Buffer.from(buffer)`][] ကို ကြည့်ပါ။

### `new Buffer(size)`

> Stability: 0 - Deprecated: Use [`Buffer.alloc()`][] instead (also see
> [`Buffer.allocUnsafe()`][]).

* `size` {integer} `Buffer` အသစ်ရဲ့ လိုချင်တဲ့ length ပါ။

[`Buffer.alloc()`][] နဲ့ [`Buffer.allocUnsafe()`][] ကို ကြည့်ပါ။ Constructor ရဲ့ ဒီပုံစံက [`Buffer.alloc()`][] နဲ့ ညီမျှပါတယ်။

### `new Buffer(string[, encoding])`

> Stability: 0 - Deprecated:
> Use [`Buffer.from(string[, encoding])`][`Buffer.from(string)`] instead.

* `string` {string} encode လုပ်ရမယ့် string ပါ။
* `encoding` {string} `string` ရဲ့ encoding ပါ။ **Default:** `'utf8'`.

[`Buffer.from(string[, encoding])`][`Buffer.from(string)`] ကို ကြည့်ပါ။

## Class: `File`

* Extends: {Blob}

{File} တစ်ခုက files တွေအကြောင်း အချက်အလက်တွေကို ပေးစွမ်းပါတယ်။

### `new buffer.File(sources, fileName[, options])`

* `sources` {string\[]|ArrayBuffer\[]|TypedArray\[]|DataView\[]|Blob\[]|File\[]}
  `File` အတွင်းမှာ သိမ်းဆည်းခံရမယ့် string, {ArrayBuffer}, {TypedArray}, {DataView}, {File} သို့မဟုတ် {Blob} objects တွေ (သို့) အဲဒီလို objects တွေရဲ့ ရောနှောမှု (mix) တစ်ခုခု ပါဝင်တဲ့ array တစ်ခုပါ။
* `fileName` {string} file ရဲ့ နာမည်ပါ။
* `options` {Object}
  * `endings` {string} `'transparent'` သို့မဟုတ် `'native'` ထဲက တစ်ခုပါ။ `'native'` လို့ သတ်မှတ်ထားရင် — string source parts တွေထဲက line endings တွေကို `require('node:os').EOL` က သတ်မှတ်ထားတဲ့အတိုင်း platform ရဲ့ native line-ending အဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။
  * `type` {string} File ရဲ့ content-type ပါ။
  * `lastModified` {number} File ကို နောက်ဆုံး ပြုပြင်မွမ်းမံခဲ့တဲ့ ရက်စွဲပါ။ **Default:** `Date.now()`.

### `file.name`

* Type: {string}

`File` ရဲ့ နာမည်ပါ။

### `file.lastModified`

* Type: {number}

`File` ကို နောက်ဆုံး ပြုပြင်မွမ်းမံခဲ့တဲ့ ရက်စွဲပါ။

## `node:buffer` module APIs

`Buffer` object ကို global အနေနဲ့ ရရှိနိုင်ပေမယ့် — `require('node:buffer')` ကို သုံးပြီး ဝင်ရောက်ရတဲ့ `node:buffer` module ကနေတစ်ဆင့်သာ ရရှိနိုင်တဲ့ ထပ်ဆောင်း `Buffer`-ဆိုင်ရာ APIs တွေလည်း ရှိပါသေးတယ်။

### `buffer.atob(data)`

> Stability: 3 - Legacy. Use `Buffer.from(data, 'base64')` instead.

* `data` {any} Base64 နဲ့ encode လုပ်ထားတဲ့ input string ပါ။
* Returns: {string}

Base64 နဲ့ encode လုပ်ထားတဲ့ data string တစ်ခုကို bytes တွေအဖြစ် decode လုပ်ပြီး — အဲဒီ bytes တွေကို Latin-1 (ISO-8859-1) သုံးပြီး string တစ်ခုအဖြစ် encode လုပ်ပါတယ်။

`data` က string အဖြစ် ပြောင်းလဲလို့ရနိုင်တဲ့ (coerce လုပ်နိုင်တဲ့) ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။

**ဒီ function ကို legacy web platform APIs တွေနဲ့ လိုက်ဖက်ညီမှု (compatibility) အတွက်သာ ပေးအပ်ထားတာ ဖြစ်ပြီး — code အသစ်တွေမှာ ဘယ်တော့မှ သုံးစွဲခြင်း မပြုသင့်ပါဘူး — အကြောင်းကတော့ ၎င်းတို့က binary data တွေကို ကိုယ်စားပြုဖို့ strings တွေကို သုံးပြီး — JavaScript မှာ typed arrays တွေ မိတ်ဆက်ခြင်း မတိုင်မီကတည်းက တည်ရှိခဲ့တာမို့ပါ။ Node.js APIs တွေကို သုံးပြီး run နေတဲ့ code တွေအတွက်ဆိုရင် — base64-encoded strings နဲ့ binary data အကြား ပြောင်းလဲခြင်းကို `Buffer.from(str, 'base64')` နဲ့ `buf.toString('base64')` တို့ကို သုံးပြီး လုပ်ဆောင်သင့်ပါတယ်။**

အလိုအလျောက် migration (ရွှေ့ပြောင်းခြင်း) တစ်ခု ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa):

```bash
npx codemod@latest @nodejs/buffer-atob-btoa
```

### `buffer.btoa(data)`

> Stability: 3 - Legacy. Use `buf.toString('base64')` instead.

* `data` {any} ASCII (Latin1) string တစ်ခုပါ။
* Returns: {string}

String တစ်ခုကို Latin-1 (ISO-8859) သုံးပြီး bytes တွေအဖြစ် decode လုပ်ကာ — အဲဒီ bytes တွေကို Base64 သုံးပြီး string တစ်ခုအဖြစ် encode လုပ်ပါတယ်။

`data` က string အဖြစ် ပြောင်းလဲလို့ရနိုင်တဲ့ (coerce လုပ်နိုင်တဲ့) ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။

**ဒီ function ကို legacy web platform APIs တွေနဲ့ လိုက်ဖက်ညီမှု (compatibility) အတွက်သာ ပေးအပ်ထားတာ ဖြစ်ပြီး — code အသစ်တွေမှာ ဘယ်တော့မှ သုံးစွဲခြင်း မပြုသင့်ပါဘူး — အကြောင်းကတော့ ၎င်းတို့က binary data တွေကို ကိုယ်စားပြုဖို့ strings တွေကို သုံးပြီး — JavaScript မှာ typed arrays တွေ မိတ်ဆက်ခြင်း မတိုင်မီကတည်းက တည်ရှိခဲ့တာမို့ပါ။ Node.js APIs တွေကို သုံးပြီး run နေတဲ့ code တွေအတွက်ဆိုရင် — base64-encoded strings နဲ့ binary data အကြား ပြောင်းလဲခြင်းကို `Buffer.from(str, 'base64')` နဲ့ `buf.toString('base64')` တို့ကို သုံးပြီး လုပ်ဆောင်သင့်ပါတယ်။**

အလိုအလျောက် migration (ရွှေ့ပြောင်းခြင်း) တစ်ခု ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa):

```bash
npx codemod@latest @nodejs/buffer-atob-btoa
```

### `buffer.isAscii(input)`

* `input` {Buffer | ArrayBuffer | TypedArray} validate (စစ်ဆေးအတည်ပြု) လုပ်ရမယ့် input ပါ။
* Returns: {boolean}

ဒီ function က — `input` ထဲမှာ တရားဝင်တဲ့ ASCII-encoded data တွေသာ ပါဝင်နေရင် — `true` ကို ပြန်ပေးပါတယ်။ `input` က ဗလာ (empty) ဖြစ်နေတဲ့ အခြေအနေလည်း အပါအဝင်ပါ။

Detached (ဖြုတ်ထားသော) `ArrayBuffer` တစ်ခု သို့မဟုတ် ၎င်းကို ကျောထောက်ထားတဲ့ `TypedArray` တစ်ခုကို ဗလာအဖြစ် သဘောထားပါတယ်။

### `buffer.isUtf8(input)`

* `input` {Buffer | ArrayBuffer | TypedArray} validate (စစ်ဆေးအတည်ပြု) လုပ်ရမယ့် input ပါ။
* Returns: {boolean}

ဒီ function က — `input` ထဲမှာ တရားဝင်တဲ့ UTF-8-encoded data တွေသာ ပါဝင်နေရင် — `true` ကို ပြန်ပေးပါတယ်။ `input` က ဗလာ (empty) ဖြစ်နေတဲ့ အခြေအနေလည်း အပါအဝင်ပါ။

Detached (ဖြုတ်ထားသော) `ArrayBuffer` တစ်ခု သို့မဟုတ် ၎င်းကို ကျောထောက်ထားတဲ့ `TypedArray` တစ်ခုကို ဗလာအဖြစ် သဘောထားပါတယ်။

### `buffer.INSPECT_MAX_BYTES`

* Type: {integer} **Default:** `50`

`buf.inspect()` ကို ခေါ်လိုက်တဲ့အခါ ပြန်ပေးမယ့် bytes အများဆုံး အရေအတွက်ကို ပြန်ပေးပါတယ်။ ဒီတန်ဖိုးကို user modules တွေက override လုပ်နိုင်ပါတယ်။ `buf.inspect()` ရဲ့ အပြုအမူအကြောင်း အသေးစိတ်ကို [`util.inspect()`][] မှာ ကြည့်ပါ။

### `buffer.kMaxLength`

* Type: {integer} `Buffer` instance တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အကြီးဆုံး အရွယ်အစားပါ။

[`buffer.constants.MAX_LENGTH`][] ရဲ့ alias တစ်ခုပါ။

### `buffer.kStringMaxLength`

* Type: {integer} `string` instance တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အကြီးဆုံး length ပါ။

[`buffer.constants.MAX_STRING_LENGTH`][] ရဲ့ alias တစ်ခုပါ။

### `buffer.resolveObjectURL(id)`

* `id` {string} `URL.createObjectURL()` ကို အရင်က ခေါ်ထားလို့ ပြန်ရလာတဲ့ `'blob:nodedata:...` URL string ပါ။
* Returns: {Blob}

`URL.createObjectURL()` ကို အရင်က ခေါ်ပြီး မှတ်ပုံတင်ထားခဲ့တဲ့ `'blob:nodedata:...'` URL တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ {Blob} object ကို ရှာဖွေဖော်ထုတ် (resolve) ပေးပါတယ်။

### `buffer.transcode(source, fromEnc, toEnc)`

* `source` {Buffer|Uint8Array} `Buffer` သို့မဟုတ် {Uint8Array} instance တစ်ခုပါ။
* `fromEnc` {string} လက်ရှိ encoding ပါ။
* `toEnc` {string} ပစ်မှတ် (target) encoding ပါ။
* Returns: {Buffer}

ပေးထားတဲ့ `Buffer` သို့မဟုတ် {Uint8Array} instance ကို character encoding တစ်ခုကနေ နောက်တစ်ခုဆီသို့ re-encode (ပြန်လည် encode) လုပ်ပါတယ်။ `Buffer` instance အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

`fromEnc` သို့မဟုတ် `toEnc` က တရားဝင်မဟုတ်တဲ့ character encodings တွေကို သတ်မှတ်ထားရင် သို့မဟုတ် `fromEnc` ကနေ `toEnc` ကို ပြောင်းလဲခြင်းကို ခွင့်မပြုရင် throw လုပ်ပါတယ်။

`buffer.transcode()` က ပံ့ပိုးပေးတဲ့ encodings တွေကတော့: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` နဲ့ `'binary'` တို့ပါ။

ပေးထားတဲ့ byte sequence တစ်ခုကို target encoding မှာ လုံလောက်စွာ ကိုယ်စားပြုလို့ မရနိုင်ရင် — transcoding process က substitution characters (အစားထိုး စာလုံးများ) တွေကို သုံးပါလိမ့်မယ်။ ဥပမာ:

```mjs
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```cjs
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

Euro (`€`) သင်္ကေတကို US-ASCII မှာ ကိုယ်စားပြုလို့ မရတာမို့ — transcoded `Buffer` ထဲမှာ `?` နဲ့ အစားထိုးပါတယ်။

### Buffer ကိန်းသေများ (Buffer constants)

#### `buffer.constants.MAX_LENGTH`

* Type: {integer} `Buffer` instance တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အကြီးဆုံး အရွယ်အစားပါ။

32-bit architectures တွေမှာ ဒီတန်ဖိုးက 231 - 1 (2 GiB ခန့်) နဲ့ ညီမျှပါတယ်။

64-bit architectures တွေမှာ ဒီတန်ဖိုးက [`Number.MAX_SAFE_INTEGER`][] (253 - 1 — 8 PiB ခန့်) နဲ့ ညီမျှပါတယ်။

အတွင်းပိုင်း mechanism (under the hood) အနေနဲ့ [`v8::Uint8Array::kMaxLength`][] ကို ထင်ဟပ်ဖော်ပြတာပါ။

ဒီတန်ဖိုးကို [`buffer.kMaxLength`][] အနေနဲ့လည်း ရရှိနိုင်ပါတယ်။

#### `buffer.constants.MAX_STRING_LENGTH`

* Type: {integer} `string` instance တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အကြီးဆုံး length ပါ။

UTF-16 code units တွေနဲ့ တွက်ချက်တဲ့အခါ — `string` primitive တစ်ခု ရရှိနိုင်တဲ့ အကြီးဆုံး `length` ကို ကိုယ်စားပြုပါတယ်။

ဒီတန်ဖိုးက သုံးစွဲနေတဲ့ JS engine အပေါ် မူတည်နိုင်ပါတယ်။

## `Buffer.from()`, `Buffer.alloc()`, and `Buffer.allocUnsafe()`

Node.js 6.0.0 မတိုင်ခင် version တွေမှာ — `Buffer` instances တွေကို `Buffer` constructor function ကို သုံးပြီး ဖန်တီးခဲ့ပါတယ်။ ဒီ constructor က — ပေးလိုက်တဲ့ arguments တွေပေါ် မူတည်ပြီး — ပြန်ပေးတဲ့ `Buffer` ကို နည်းလမ်း ကွဲပြားစွာ allocate လုပ်ပါတယ်:

* `Buffer()` ဆီကို ပထမဆုံး argument အနေနဲ့ ဂဏန်းတစ်ခု ဖြတ်သန်းလိုက်တာ (ဥပမာ — `new Buffer(10)`) က သတ်မှတ်ထားတဲ့ အရွယ်အစားရှိတဲ့ `Buffer` object အသစ်တစ်ခုကို allocate လုပ်ပါတယ်။ Node.js 8.0.0 မတိုင်ခင် version တွေမှာတော့ — ဒီလို `Buffer` instances တွေအတွက် ခွဲဝေပေးလိုက်တဲ့ memory က _not initialized_ (initialize မလုပ်ရသေး) ဖြစ်ပြီး — _can contain sensitive data_ (sensitive data တွေ ပါဝင်နိုင်ပါတယ်)။ ဒီလို `Buffer` instances တွေကို — `Buffer` ကနေ data မဖတ်ခင် — [`buf.fill(0)`][`buf.fill()`] ကို သုံးပြီးဖြစ်စေ၊ `Buffer` တစ်ခုလုံးကို ရေးသားပြီးဖြစ်စေ — နောက်ပိုင်းမှာ _must_ (မဖြစ်မနေ) initialize လုပ်ပေးရပါတယ်။ ဒီအပြုအမူက စွမ်းဆောင်ရည် မြှင့်တင်ဖို့ _intentional_ (ရည်ရွယ်ချက်ရှိရှိ) လုပ်ထားတာ ဖြစ်ပေမယ့် — မြန်ဆန်ပေမယ့် uninitialized ဖြစ်တဲ့ `Buffer` တစ်ခုကို ဖန်တီးခြင်းနဲ့ နှေးကွေးပေမယ့် ပိုလုံခြုံတဲ့ `Buffer` တစ်ခုကို ဖန်တီးခြင်းကြားမှာ ပိုရှင်းလင်းတဲ့ ခြားနားချက် (distinction) တစ်ခု လိုအပ်ကြောင်း — developer တွေရဲ့ အတွေ့အကြုံတွေက ပြသခဲ့ပါတယ်။ Node.js 8.0.0 ကစပြီး `Buffer(num)` နဲ့ `new Buffer(num)` တို့က initialized memory ပါတဲ့ `Buffer` တစ်ခုကို ပြန်ပေးပါတယ်။
* ပထမဆုံး argument အနေနဲ့ string, array သို့မဟုတ် `Buffer` တစ်ခုကို ဖြတ်သန်းလိုက်ရင် — ဖြတ်သန်းလိုက်တဲ့ object ရဲ့ data ကို `Buffer` ထဲကို copy လုပ်ပါတယ်။
* {ArrayBuffer} သို့မဟုတ် {SharedArrayBuffer} တစ်ခုကို ဖြတ်သန်းလိုက်ရင် — ပေးလိုက်တဲ့ array buffer နဲ့ allocated memory ကို မျှဝေတဲ့ `Buffer` တစ်ခုကို ပြန်ပေးပါတယ်။

`new Buffer()` ရဲ့ အပြုအမူက ပထမဆုံး argument ရဲ့ type ပေါ် မူတည်ပြီး ကွဲပြားတာမို့ — argument validation သို့မဟုတ် `Buffer` initialization ကို မလုပ်ဆောင်တဲ့အခါ — applications တွေထဲကို လုံခြုံရေးနဲ့ ယုံကြည်စိတ်ချရမှု ပြဿနာတွေ မရည်ရွယ်ပဲ ဝင်ရောက်လာနိုင်ပါတယ်။

ဥပမာ — attacker တစ်ယောက်က string မျှော်လင့်ထားတဲ့ နေရာမှာ application တစ်ခုက ဂဏန်းတစ်ခုကို လက်ခံရရှိအောင် လုပ်နိုင်ခဲ့မယ်ဆိုရင် — application က `new Buffer("100")` အစား `new Buffer(100)` ကို ခေါ်မိနိုင်ပြီး — content `"100"` ပါတဲ့ bytes 3 ခု buffer အစား bytes 100 ခု buffer တစ်ခုကို allocate လုပ်မိသွားနိုင်ပါတယ်။ ဒါမျိုးက JSON API calls တွေကနေတစ်ဆင့် မကြာခဏ ဖြစ်နိုင်ပါတယ်။ JSON က numeric types နဲ့ string types တွေကို ခွဲခြားသိမြင်တာမို့ — input ကို လုံလောက်အောင် validate မလုပ်တဲ့ ရိုးရှင်းစွာ ရေးထားတဲ့ (naively written) application တစ်ခုက string တစ်ခုကိုပဲ အမြဲတမ်း လက်ခံရမယ်လို့ မျှော်လင့်နေတဲ့ နေရာမှာ — ဂဏန်းတွေ ထိုးသွင်းခံရဖို့ (injection) အခွင့်အရေး ဖြစ်စေပါတယ်။ Node.js 8.0.0 မတိုင်ခင်က — bytes 100 ခု buffer ထဲမှာ memory အတွင်းက ကြိုတင်တည်ရှိနေတဲ့ မထင်သလို data တွေ ပါဝင်နိုင်တာမို့ — remote attacker တစ်ယောက်ဆီကို in-memory secrets (memory အတွင်းက လျှို့ဝှက်ချက်များ) တွေ ပေါက်ကြားစေဖို့ သုံးခံရနိုင်ပါတယ်။ Node.js 8.0.0 ကစပြီးတော့ — data တွေကို zero တွေနဲ့ ဖြည့်ပေးထားတာမို့ — memory ပေါက်ကြားမှု (exposure) ဖြစ်လို့ မရတော့ပါဘူး။ ဒါပေမယ့် — server ကို buffer အကြီးကြီးတွေ allocate လုပ်ခိုင်းပြီး — စွမ်းဆောင်ရည် ကျဆင်းစေတာ သို့မဟုတ် memory ကုန်ခန်းလို့ crash ဖြစ်စေတာလိုမျိုး — အခြား attacks တွေကတော့ ဖြစ်နိုင်သေးပါတယ်။

`Buffer` instances တွေရဲ့ ဖန်တီးမှုကို ပိုယုံကြည်စိတ်ချရပြီး error ဖြစ်နိုင်ခြေ နည်းအောင် လုပ်ဖို့ — `new Buffer()` constructor ရဲ့ ပုံစံအမျိုးမျိုးကို **deprecated** (အသုံးမပြုတော့ရန် သတ်မှတ်) လုပ်လိုက်ပြီး — သီးခြား `Buffer.from()`, [`Buffer.alloc()`][], နဲ့ [`Buffer.allocUnsafe()`][] methods တွေနဲ့ အစားထိုးလိုက်ပါတယ်။

_Developers တွေက `new Buffer()` constructors တွေရဲ့ ရှိပြီးသား အသုံးပြုမှုတွေ အားလုံးကို — ဒီ APIs အသစ်တွေထဲက တစ်ခုဆီကို — ပြောင်းရွှေ့ (migrate) သင့်ပါတယ်။_

* [`Buffer.from(array)`][] က — ပေးထားတဲ့ octets တွေရဲ့ _ကော်ပီတစ်စောင် ပါဝင်တဲ့ (contains a copy)_ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။
* [`Buffer.from(arrayBuffer[, byteOffset[, length]])`][`Buffer.from(arrayBuf)`] က — ပေးထားတဲ့ {ArrayBuffer} နဲ့ _တူညီတဲ့ allocated memory ကို မျှဝေတဲ့ (shares the same allocated memory)_ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။
* [`Buffer.from(buffer)`][] က — ပေးထားတဲ့ `Buffer` ရဲ့ contents တွေရဲ့ _ကော်ပီတစ်စောင် ပါဝင်တဲ့ (contains a copy)_ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။
* [`Buffer.from(string[, encoding])`][`Buffer.from(string)`] က — ပေးထားတဲ့ string ရဲ့ _ကော်ပီတစ်စောင် ပါဝင်တဲ့ (contains a copy)_ `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။
* [`Buffer.alloc(size[, fill[, encoding]])`][`Buffer.alloc()`] က — သတ်မှတ်ထားတဲ့ အရွယ်အစားရှိတဲ့ initialized `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ method က [`Buffer.allocUnsafe(size)`][`Buffer.allocUnsafe()`] ထက် နှေးပေမယ့် — အသစ်ဖန်တီးလိုက်တဲ့ `Buffer` instances တွေထဲမှာ sensitive ဖြစ်နိုင်ချေရှိတဲ့ data အဟောင်းတွေ ဘယ်တော့မှ မပါဝင်ဘူးဆိုတာကို အာမခံပါတယ်။ `size` က ဂဏန်း မဟုတ်ရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။
* [`Buffer.allocUnsafe(size)`][`Buffer.allocUnsafe()`] နဲ့ [`Buffer.allocUnsafeSlow(size)`][`Buffer.allocUnsafeSlow()`] တို့က — တစ်ခုချင်းစီ သတ်မှတ်ထားတဲ့ `size` အရွယ်အစားရှိတဲ့ uninitialized `Buffer` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ `Buffer` က uninitialized ဖြစ်နေတာမို့ — ခွဲဝေလိုက်တဲ့ memory အပိုင်းထဲမှာ sensitive ဖြစ်နိုင်ချေရှိတဲ့ data အဟောင်းတွေ ပါဝင်နိုင်ပါတယ်။

[`Buffer.allocUnsafe()`][], [`Buffer.from(string)`][], [`Buffer.concat()`][] နဲ့ [`Buffer.from(array)`][] တို့က ပြန်ပေးတဲ့ `Buffer` instances တွေက — `size` က [`Buffer.poolSize`][] ရဲ့ တစ်ဝက် သို့မဟုတ် အောက်ဆိုရင် — shared internal memory pool (အတွင်းပိုင်း memory pool) တစ်ခုကနေ _may_ (ဖြစ်နိုင်သည်) allocate လုပ်ခံရနိုင်ပါတယ်။ [`Buffer.allocUnsafeSlow()`][] က ပြန်ပေးတဲ့ instances တွေကတော့ shared internal memory pool ကို _never_ (ဘယ်တော့မှ) သုံးစွဲခြင်း မရှိပါဘူး။

### The `--zero-fill-buffers` command-line option

Node.js ကို `--zero-fill-buffers` command-line option နဲ့ စတင်နိုင်ပြီး — ဒါဆိုရင် အသစ် allocate လုပ်တဲ့ `Buffer` instances တွေ အားလုံးကို — ဖန်တီးချိန်မှာ — zero-fill လုပ်ပေးပါလိမ့်မယ်။ Option မပါဘဲနဲ့ဆိုရင် — [`Buffer.allocUnsafe()`][] နဲ့ [`Buffer.allocUnsafeSlow()`][] တို့နဲ့ ဖန်တီးတဲ့ buffers တွေက zero-fill မလုပ်ပါဘူး။ ဒီ flag ကို သုံးတာက စွမ်းဆောင်ရည်ကို သိသိသာသာ ထိခိုက်စေနိုင်ပါတယ်။ `--zero-fill-buffers` option ကို — အသစ် allocate လုပ်တဲ့ `Buffer` instances တွေထဲမှာ sensitive ဖြစ်နိုင်ချေရှိတဲ့ data အဟောင်းတွေ မပါဝင်စေဖို့ တင်းကျပ်စွာ လုပ်ဆောင်ရန် လိုအပ်မှသာ — သုံးပါ။

```console
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```

### What makes `Buffer.allocUnsafe()` and `Buffer.allocUnsafeSlow()` "unsafe"?

[`Buffer.allocUnsafe()`][] နဲ့ [`Buffer.allocUnsafeSlow()`][] တို့ကို ခေါ်တဲ့အခါ — allocate လုပ်လိုက်တဲ့ memory အပိုင်းက _uninitialized_ (zero-out — သုညတန်ဖိုး ဖြည့်ခြင်း — မလုပ်ထား) ဖြစ်ပါတယ်။ ဒီဒီဇိုင်းက memory ခွဲဝေမှုကို အတော်လေး မြန်ဆန်စေပေမယ့် — ခွဲဝေလိုက်တဲ့ memory အပိုင်းထဲမှာ sensitive ဖြစ်နိုင်ချေရှိတဲ့ data အဟောင်းတွေ ပါဝင်နိုင်ပါတယ်။ [`Buffer.allocUnsafe()`][] နဲ့ ဖန်တီးထားတဲ့ `Buffer` တစ်ခုကို — memory ကို _completely_ (လုံးလုံး) overwrite မလုပ်ပဲ — သုံးလိုက်ရင် — `Buffer` memory ကို ဖတ်တဲ့အခါ ဒီ data အဟောင်းတွေ ပေါက်ကြားသွားနိုင်ပါတယ်။

[`Buffer.allocUnsafe()`][] ကို သုံးခြင်းမှာ ထင်ရှားတဲ့ စွမ်းဆောင်ရည် အားသာချက်တွေ ရှိပေမယ့် — application တစ်ခုထဲကို လုံခြုံရေး အားနည်းချက် (vulnerability) တွေ မဝင်ရောက်အောင် — _must_ (မဖြစ်မနေ) အထူး ဂရုစိုက်ရပါမယ်။

### Alignment ပြုလုပ်ထားသော ခွဲဝေမှုများ (Aligned allocations)

Operating system interfaces တစ်ချို့က — သူတို့ လုပ်ဆောင်တဲ့ memory က alignment (ချိန်ညှိမှု) ရှိဖို့ လိုအပ်ပြီး — hardware တစ်ချို့မှာတော့ alignment က ပိုမြန်စေရုံသာ ဖြစ်ပါတယ်။ ပထမ အမျိုးအစားရဲ့ အသုံးအများဆုံး ဥပမာကတော့ unbuffered ("direct") file I/O ပါ — Linux မှာ ၎င်းက buffer address, file offset နဲ့ transfer length တွေ အားလုံးကို — underlying device ရဲ့ logical block size ရဲ့ ဆတိုက်ကိန်းဂဏန်း (multiples) တွေ ဖြစ်ဖို့ လိုအပ်ပါတယ်:

```mjs
import { open } from 'node:fs/promises';
import { constants } from 'node:fs';
import { Buffer } from 'node:buffer';

const blockSize = 4096;

// The buffer address must be block-aligned for O_DIRECT to accept it.
const buf = Buffer.allocUnsafeSlow(blockSize, blockSize);

const file = await open('/dev/sda', constants.O_RDONLY | constants.O_DIRECT);
try {
  await file.read(buf, 0, blockSize, 0);
} finally {
  await file.close();
}
```

```cjs
const fs = require('node:fs');
const { Buffer } = require('node:buffer');

const blockSize = 4096;

// The buffer address must be block-aligned for O_DIRECT to accept it.
const buf = Buffer.allocUnsafeSlow(blockSize, blockSize);

const flags = fs.constants.O_RDONLY | fs.constants.O_DIRECT;
fs.open('/dev/sda', flags, (err, fd) => {
  if (err) throw err;
  fs.read(fd, buf, 0, blockSize, 0, (err) => {
    fs.close(fd, () => {});
    if (err) throw err;
  });
});
```

Alignment ကို — ဘယ် interface ကမှ မတောင်းဆိုတဲ့အခါမှာတောင် — စွမ်းဆောင်ရည် အတွက်သက်သက် တောင်းဆိုတာ တန်ဖိုးရှိနိုင်ပါတယ်။ အသုံးများနေတဲ့ (hot) `Buffer` တစ်ခုကို cache line size (မျက်မှောက်ခေတ် CPU အများစုမှာ 64 bytes) နဲ့ align လုပ်ထားခြင်းက — ၎င်းက လိုအပ်တာထက် cache line တစ်ကြောင်း ပိုပြီး ဖြတ်ကျော် (straddle) နေတာမျိုး မဖြစ်အောင် ကာကွယ်ပေးတာမို့ — small structure တစ်ခုကို cache miss နှစ်ခါအစား တစ်ခါနဲ့သာ ဆွဲယူရရှိနိုင်ပြီး — page-aligned (4096 bytes) ခွဲဝေမှုတွေကလည်း memory ကို map သို့မဟုတ် pin လုပ်တဲ့ interfaces တွေကို အလားတူ အထောက်အကူ ပြုပါတယ်။ ဒါတွေက micro-optimizations (အသေးစား optimization များ) ပါ: ထပ်ဆောင်း bytes တွေက အခမဲ့ မရတာမို့ — ဒါတွေကို မသုံးခင် ဦးစွာ တိုင်းတာ (measure) ကြည့်ပါ။

`Buffer` တစ်ခုရဲ့ memory ရဲ့ address ကို တိုက်ရိုက် ရွေးချယ်လို့ မရတာမို့ — aligned address တစ်ခုကို ရောက်ရှိဖို့ — ထပ်ဆောင်း bytes တွေကို allocate လုပ်ရတာ သို့မဟုတ် ကျော်လိုက်ရပါတယ်။ [`Buffer.allocUnsafeSlow()`][] က `alignment - 1` bytes အထိ over-allocate လုပ်ပြီး — ပြန်ပေးလိုက်တဲ့ `Buffer` ကို အဲဒီထဲက ပထမဆုံး သင့်လျော်စွာ aligned ဖြစ်တဲ့ byte မှာ နေရာချပေးပါတယ်။ [`Buffer.allocUnsafe()`][] ကတော့ — ၎င်းရဲ့ offset ကို shared internal pool ထဲမှာ ထည့်သွင်းဖြည့်စွက် (pad) လုပ်ပေးပြီး — အဲဒီ pool ရဲ့ အစက 64 bytes နဲ့ အမြဲတမ်း aligned ဖြစ်ကာ — `alignment` က အဲဒါထက် ပိုကြီးမှသာ ကိုယ်ပိုင် allocation တစ်ခုဆီကို ပြန်ကျပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — [`buf.byteOffset`][] က ပုံမှန်အားဖြင့် 0 မဟုတ်ဘဲ [`buf.buffer`][] က `size` ထက် ပိုကြီးနေတာမို့ — `Buffer` ကို ကျော်လွန်ပြီး ၎င်းရဲ့ underlying `ArrayBuffer` ဆီကို လက်လှမ်းမှီတဲ့ code တွေက — pooled `Buffer`s တွေအတွက် လုပ်ရသလိုပဲ — offset ကို ထည့်သွင်း စဉ်းစားရပါမယ်။

Alignment က ပြန်ပေးလိုက်တဲ့ `Buffer` ရဲ့ ဂုဏ်သတ္တိ (property) တစ်ခု ဖြစ်ပြီး — ၎င်းရဲ့ သက်တမ်းတစ်လျှောက်လုံး ထိန်းသိမ်းထားပေမယ့် — တခြား views တွေဆီကိုတော့ အမွေဆက်ခံပေးခြင်း မရှိပါဘူး: [`buf.subarray`][], [`buf.slice()`][] နဲ့ `structuredClone()` တို့က unaligned `Buffer`s တွေကို ထုတ်ပေးနိုင်ပါတယ်။

Alignment က startup snapshot တစ်ခုထဲမှာ ဖမ်းယူခံရခြင်းကိုလည်း မရှင်သန်နိုင်ပါဘူး: memory က serialization ဖြတ်သန်းမှုမှာ ၎င်းရဲ့ address ကို မထိန်းသိမ်းထားနိုင်တာမို့ — [`--build-snapshot`][] သက်ရောက်နေချိန်မှာ allocate လုပ်ထားတဲ့ `Buffer` တစ်ခုက deserialized process ထဲမှာ aligned မဖြစ်တော့ပါဘူး။ Alignment က run time မှာ ဆက်လက် တည်ရှိနေရမယ်ဆိုရင် — [`v8.startupSnapshot.setDeserializeMainFunction()`][] callback တစ်ခုအတွင်းမှာ သို့မဟုတ် startup ပြီးနောက်မှာ allocate လုပ်ပါ။

[ASCII]: https://en.wikipedia.org/wiki/ASCII
[Aligned allocations]: #aligned-allocations
[Base64]: https://en.wikipedia.org/wiki/Base64
[ISO-8859-1]: https://en.wikipedia.org/wiki/ISO-8859-1
[RFC 4648, Section 5]: https://tools.ietf.org/html/rfc4648#section-5
[UTF-16]: https://en.wikipedia.org/wiki/UTF-16
[UTF-8]: https://en.wikipedia.org/wiki/UTF-8
[WHATWG Encoding Standard]: https://encoding.spec.whatwg.org/
[`--build-snapshot`]: cli.md#--build-snapshot
[`Buffer.alloc()`]: #static-method-bufferallocsize-fill-encoding
[`Buffer.allocUnsafe()`]: #static-method-bufferallocunsafesize-alignment
[`Buffer.allocUnsafeSlow()`]: #static-method-bufferallocunsafeslowsize-alignment
[`Buffer.concat()`]: #static-method-bufferconcatlist-totallength
[`Buffer.copyBytesFrom()`]: #static-method-buffercopybytesfromview-offset-length
[`Buffer.from(array)`]: #static-method-bufferfromarray
[`Buffer.from(arrayBuf)`]: #static-method-bufferfromarraybuffer-byteoffset-length
[`Buffer.from(buffer)`]: #static-method-bufferfrombuffer
[`Buffer.from(string)`]: #static-method-bufferfromstring-encoding
[`Buffer.poolSize`]: #bufferpoolsize
[`ERR_INVALID_BUFFER_SIZE`]: errors.md#err_invalid_buffer_size
[`ERR_OUT_OF_RANGE`]: errors.md#err_out_of_range
[`JSON.stringify()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[`Number.MAX_SAFE_INTEGER`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
[`String.prototype.indexOf()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
[`String.prototype.lastIndexOf()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
[`String.prototype.length`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
[`TextDecoderStream`]: webstreams.md#class-textdecoderstream
[`TypedArray.from()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from
[`TypedArray.prototype.set()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set
[`TypedArray.prototype.slice()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice
[`TypedArray.prototype.subarray()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray
[`blob.stream()`]: #blobstream
[`buf.buffer`]: #bufbuffer
[`buf.byteOffset`]: #bufbyteoffset
[`buf.compare()`]: #bufcomparetarget-targetstart-targetend-sourcestart-sourceend
[`buf.entries()`]: #bufentries
[`buf.fill()`]: #buffillvalue-offset-end-encoding
[`buf.indexOf()`]: #bufindexofvalue-start-end-encoding
[`buf.keys()`]: #bufkeys
[`buf.length`]: #buflength
[`buf.slice()`]: #bufslicestart-end
[`buf.subarray`]: #bufsubarraystart-end
[`buf.toString()`]: #buftostringencoding-start-end
[`buf.values()`]: #bufvalues
[`buffer.constants.MAX_LENGTH`]: #bufferconstantsmax_length
[`buffer.constants.MAX_STRING_LENGTH`]: #bufferconstantsmax_string_length
[`buffer.kMaxLength`]: #bufferkmaxlength
[`util.inspect()`]: util.md#utilinspectobject-options
[`v8.startupSnapshot.setDeserializeMainFunction()`]: v8.md#v8startupsnapshotsetdeserializemainfunctioncallback-data
[`v8::Uint8Array::kMaxLength`]: https://v8.github.io/api/head/classv8_1_1Uint8Array.html#a7677e3d0c9c92e4d40bef7212f5980c6
[base64url]: https://tools.ietf.org/html/rfc4648#section-5
[endianness]: https://en.wikipedia.org/wiki/Endianness
[iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
