---
title: "String decoder"
description: "node:string_decoder module — Buffer တွေကို string အဖြစ် decode လုပ်ခြင်း (multi-byte UTF-8 safety)။"
order: 102
source: "https://nodejs.org/api/string_decoder.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:string_decoder` module က — encoded လုပ်ထားတဲ့ multi-byte UTF-8 နဲ့ UTF-16 characters တွေကို ထိန်းသိမ်းပေးတဲ့ ပုံစံနဲ့ `Buffer` objects တွေကို strings အဖြစ် decode လုပ်ဖို့ API တစ်ခု ပေးပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း သုံးနိုင်ပါတယ်:

```mjs
import { StringDecoder } from 'node:string_decoder';
```

```cjs
const { StringDecoder } = require('node:string_decoder');
```

အောက်က ဥပမာက `StringDecoder` class ရဲ့ အခြေခံ အသုံးပြုပုံကို ပြသပါတယ်။

```mjs
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```

```cjs
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```

`Buffer` instance တစ်ခုကို `StringDecoder` instance ဆီ ရေးလိုက်တဲ့အခါ — decoded string ထဲမှာ မပြည့်စုံတဲ့ (incomplete) multibyte characters တွေ မပါဝင်အောင် internal buffer တစ်ခုကို သုံးပါတယ်။ ဒါတွေကို နောက် `stringDecoder.write()` ခေါ်တဲ့အထိ (သို့) `stringDecoder.end()` ခေါ်တဲ့အထိ buffer ထဲမှာ ထိန်းထားပါတယ်။

အောက်က ဥပမာမှာ European Euro သင်္ကေတ (`€`) ရဲ့ UTF-8 encoded bytes သုံးခုကို သီးခြား operations သုံးခုနဲ့ ရေးလိုက်ပါတယ်:

```mjs
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```

```cjs
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```

## Class: `StringDecoder`

### `new StringDecoder([encoding])`

* `encoding` {string} `StringDecoder` က သုံးမယ့် character [encoding][] ပါ။ **Default:** `'utf8'`။

`StringDecoder` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

### `stringDecoder.end([buffer])`

* `buffer` {string|Buffer|TypedArray|DataView} Decode လုပ်မယ့် bytes တွေပါ။
* Returns: {string}

Internal buffer ထဲမှာ သိမ်းထားတဲ့ ကျန်ရှိနေသေးတဲ့ input ကို string အနေနဲ့ ပြန်ပေးပါတယ်။ မပြည့်စုံတဲ့ UTF-8 နဲ့ UTF-16 characters တွေကို ကိုယ်စားပြုတဲ့ bytes တွေကို — သက်ဆိုင်ရာ character encoding အတွက် သင့်လျော်တဲ့ substitution characters တွေနဲ့ အစားထိုးပါလိမ့်မယ်။

`buffer` argument ကို ပေးထားရင် — ကျန်ရှိတဲ့ input ကို မပြန်ခင် `stringDecoder.write()` ကို နောက်ဆုံး ခေါ်တစ်ကြိမ် လုပ်ဆောင်ပါတယ်။ `end()` ခေါ်ပြီးတာနဲ့ `stringDecoder` object ကို input အသစ်တွေအတွက် ပြန်သုံးနိုင်ပါတယ်။

### `stringDecoder.write(buffer)`

* `buffer` {string|Buffer|TypedArray|DataView} Decode လုပ်မယ့် bytes တွေပါ။
* Returns: {string}

Decoded string တစ်ခုကို ပြန်ပေးပြီး — `Buffer` (သို့) `TypedArray` (သို့) `DataView` ရဲ့ အဆုံးမှာရှိတဲ့ မပြည့်စုံတဲ့ multibyte characters တွေကို ပြန်ပေးတဲ့ string ထဲကနေ ဖယ်ထုတ်ပြီး — နောက် `stringDecoder.write()` (သို့) `stringDecoder.end()` ခေါ်မှုအတွက် internal buffer ထဲမှာ သိမ်းဆည်းထားပါတယ်။

[encoding]: buffer.md#buffers-and-character-encodings
