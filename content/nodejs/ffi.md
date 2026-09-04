---
title: "FFI"
description: "node:ffi module (experimental) — dynamic libraries တွေကို load လုပ်ပြီး native symbols တွေကို JavaScript ကနေ ခေါ်ဆိုနိုင်တဲ့ foreign function interface (pointer/memory helpers များ အပါအဝင်)"
order: 128
source: "https://nodejs.org/api/ffi.html"
status: translated
updated: 2026-09-04
---

> Stability: 1 - Experimental

`node:ffi` module က dynamic libraries တွေကို load လုပ်ပြီး native symbols တွေကို JavaScript ကနေ ခေါ်ဆိုနိုင်ဖို့ experimental (စမ်းသပ်ဆဲ) foreign function interface တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

ဒီ API က လုံခြုံမှု မရှိပါဘူး။ Invalid pointers တွေကို ပေးပို့တာ, မှားနေတဲ့ symbol signature တစ်ခုကို သုံးတာ, (သို့) memory ကို free လုပ်ပြီးသွားမှ ၎င်းကို ဝင်ရောက်ကြည့်ရှုတာတွေက process ကို crash ဖြစ်စေနိုင်သလို — memory ကိုလည်း ပျက်စီးစေနိုင်ပါတယ်။

ဒါကို ဝင်ရောက်သုံးနိုင်ဖို့:

```mjs
import ffi from 'node:ffi';
```

```cjs
const ffi = require('node:ffi');
```

ဒီ module ကို FFI support ပါတဲ့ builds တွေမှာ `node:` scheme အောက်မှာပဲ ရနိုင်ပြီး — `--experimental-ffi` flag နဲ့ ဖွင့်ပေးမှသာ သုံးလို့ ရပါတယ်။

`node:ffi` support ပါအောင် Node.js ကို build လုပ်တာက `libffi` က compatible static backend ပေးတဲ့ platform တွေမှာ bundled `libffi` ကနေ ရနိုင်သလို — `--shared-ffi` configure flag ကို သုံးပြီး shared `libffi` ကနေလည်း ရနိုင်ပါတယ်။ Unofficial GN build ကတော့ `node:ffi` ကို support မလုပ်ပါဘူး။

အောက်ပါ targets တွေကိုတော့ bundled libffi က support မလုပ်ပါဘူး:

* `s390x` ။
* FreeBSD, Linux, နဲ့ OpenBSD တို့ကလွဲပြီး တခြား targets တွေပေါ်မှာ `mips`, `mipsel`, နဲ့ `mips64el` တို့ပါ။
* Android, CloudABI, iOS, OpenHarmony, OS/400, Solaris, နဲ့ Windows တွေပေါ်မှာ `ppc64` ပါ။

[Permission Model][] ကို သုံးနေတဲ့အခါ — [`--allow-ffi`][] flag ကို ပေးထားမှသာ FFI APIs တွေကို သုံးခွင့်ရှိပြီး မပေးထားရင်တော့ ကန့်သတ်ခံရပါတယ်။

## ခြုံငုံ သုံးသပ်ချက် (Overview)

`node:ffi` module က API အုပ်စု နှစ်ခုကို ထုတ်ပေးပါတယ်:

* Libraries တွေကို load လုပ်ခြင်း, symbols တွေကို resolve လုပ်ခြင်း, နဲ့ ခေါ်ဆိုလို့ရတဲ့ JavaScript wrappers တွေ ဖန်တီးခြင်းအတွက် dynamic library APIs တွေပါ။
* Pointers တွေကနေ primitive values တွေကို ဖတ်ခြင်း/ရေးခြင်း, pointers တွေကို JavaScript strings, `Buffer` instances, နဲ့ `ArrayBuffer` instances အဖြစ် ပြောင်းခြင်း, ပြီးတော့ data တွေကို native memory ထဲကို ပြန်ကူးခြင်း စတာတွေအတွက် raw memory helpers တွေပါ။

## Type names (type name များ)

FFI signatures တွေက string type names တွေကို သုံးပါတယ်။

ပံ့ပိုးထားတဲ့ type names တွေကတော့:

* `void`
* `char`
* `int8`
* `uint8`
* `int16`
* `uint16`
* `int32`
* `uint32`
* `int64`
* `uint64`
* `float32`
* `float64`
* `pointer`
* `string`
* `buffer`
* `arraybuffer`
* `function`

Alternative spellings (အခြား ရွေးချယ်စရာ spellings များ)

* `i8` (`int8` အတွက်)
* `u8` နဲ့ `bool` (`uint8` အတွက်)
* `i16` (`int16` အတွက်)
* `u16` (`uint16` အတွက်)
* `i32` (`int32` အတွက်)
* `u32` (`uint32` အတွက်)
* `i64` (`int64` အတွက်)
* `u64` (`uint64` အတွက်)
* `f32` နဲ့ `float` (`float32` အတွက်)
* `f64` နဲ့ `double` (`float64` အတွက်)
* `ptr` (`pointer` အတွက်)
* `str` (`string` အတွက်)

ဒီ type names တွေကိုလည်း `ffi.types` ပေါ်မှာ constants တွေအနေနဲ့ ရရှိနိုင်ပါတယ်:

* `ffi.types.VOID` = `'void'`
* `ffi.types.POINTER` = `'pointer'`
* `ffi.types.BUFFER` = `'buffer'`
* `ffi.types.ARRAY_BUFFER` = `'arraybuffer'`
* `ffi.types.FUNCTION` = `'function'`
* `ffi.types.BOOL` = `'bool'`
* `ffi.types.CHAR` = `'char'`
* `ffi.types.STRING` = `'string'`
* `ffi.types.FLOAT` = `'float'`
* `ffi.types.DOUBLE` = `'double'`
* `ffi.types.INT_8` = `'int8'`
* `ffi.types.UINT_8` = `'uint8'`
* `ffi.types.INT_16` = `'int16'`
* `ffi.types.UINT_16` = `'uint16'`
* `ffi.types.INT_32` = `'int32'`
* `ffi.types.UINT_32` = `'uint32'`
* `ffi.types.INT_64` = `'int64'`
* `ffi.types.UINT_64` = `'uint64'`
* `ffi.types.FLOAT_32` = `'float32'`
* `ffi.types.FLOAT_64` = `'float64'`

Pointer နဲ့တူတဲ့ types (`pointer`, `string`, `buffer`, `arraybuffer`, နဲ့ `function`) တွေအားလုံးကို native layer မှာ pointers တွေအနေနဲ့ ဖြတ်သန်းပေးပါတယ်။

`Buffer`, `ArrayBuffer`, (သို့) typed array values တွေကို pointer နဲ့တူတဲ့ arguments တွေအနေနဲ့ ပေးပို့တဲ့အခါ — Node.js က ၎င်းတို့ရဲ့ backing memory ဆီကို raw pointer တစ်ခုကို native call ကြာချိန် အတွက် ငှားယူသုံးပါတယ်။ Caller အနေနဲ့ အဲဒီ backing store က call တစ်ခုလုံး ကြာချိန်မှာ တရားဝင်ပြီး တည်ငြိမ်နေအောင် သေချာစေရပါမယ်။

Native call အလုပ်လုပ်နေတုန်း အဲဒီ backing store ကို resize, transfer, detach (သို့) တခြားနည်းနဲ့ invalid ဖြစ်အောင် လုပ်တာက — FFI callbacks တွေလိုမျိုး reentrant JavaScript ကနေ ဖြစ်တာတွေ အပါအဝင် — support မလုပ်တဲ့အပြင် အန္တရာယ်လည်း ရှိပါတယ်။ အဲဒီလို လုပ်မိရင် process က crash ဖြစ်နိုင်တယ်, မှားယွင်းတဲ့ output တွေ ထွက်နိုင်တယ်, (သို့) memory ကို ပျက်စီးစေနိုင်ပါတယ်။

`char` type က platform ရဲ့ C ABI အတိုင်း လိုက်နာပါတယ်။ Plain C `char` က signed ဖြစ်တဲ့ platform တွေမှာ `int8` လို ပြုမူပြီး — ကျန်တဲ့ platform တွေမှာတော့ `uint8` လို ပြုမူပါတယ်။

`bool` type ကို 8-bit unsigned integer အနေနဲ့ marshaling လုပ်ပါတယ်။ `0` နဲ့ `1` လိုမျိုး numeric values တွေကို ပေးပို့ပါ။ JavaScript ရဲ့ `true` နဲ့ `false` တွေကတော့ လက်ခံမှာ မဟုတ်ပါဘူး။

Optimized Fast FFI calls တွေမှာ `pointer` နဲ့ `function` parameters တွေက raw pointer `bigint` values တွေကို လက်ခံပါတယ်။ Pointer နဲ့တူတဲ့ parameters တွေအတွက်တော့ `null`, `undefined`, strings, `Buffer`, typed array, `DataView`, နဲ့ `ArrayBuffer` values တွေကို optimized native wrapper ကို မခေါ်ခင် JavaScript ဘက်မှာ convert လုပ်ပါတယ်။

Optimized Fast FFI calls တွေက function တစ်ခုရဲ့ arguments (သို့) return type က platform-specific fast trampoline နဲ့ မကိုက်ညီတဲ့အခါ — generic FFI call path ဆီကို ပြန်ကျသွားပါတယ်။ Fast FFI calls တွေက စုစုပေါင်း arguments အများဆုံး 8 ခုအထိပဲ support လုပ်ပြီး — register နဲ့ argument ကန့်သတ်ချက်တွေက architecture အလိုက် ကွဲပြားပါတယ်:

| Architecture | Integer/pointer args အများဆုံး | Floating-point args အများဆုံး | Buffer-shaped args | Buffer-shaped + FP ပေါင်းစပ် | Narrow (8/16-bit) return |
| --- | --- | --- | --- | --- | --- |
| AArch64 | 7 (buffer-shaped arg တစ်ခု ပါနေရင် 6) | 8 | ရနိုင်ပါတယ် | မရနိုင်ပါ | ရနိုင်ပါတယ် |
| x86-64, Linux/macOS (SysV) | 6 (buffer-shaped arg တစ်ခု ပါနေရင် 4) | 8 | ရနိုင်ပါတယ် | မရနိုင်ပါ | ရနိုင်ပါတယ် |
| x86-64, Windows (Win64) | 3 (စုစုပေါင်း arguments ကိုလည်း 3 မှာ ကန့်သတ်ထားပါတယ်) | 3 | မရနိုင်ပါ | N/A | ရနိုင်ပါတယ် |
| s390x | 4 | 4 | မရနိုင်ပါ | N/A | မရနိုင်ပါ |
| PPC64LE | 7 | 8 | မရနိုင်ပါ | N/A | မရနိုင်ပါ |
| LoongArch64 | 7 | 8 | မရနိုင်ပါ | N/A | မရနိုင်ပါ |
| RISC-V (64-bit) | 7 | 8 | မရနိုင်ပါ | N/A | မရနိုင်ပါ |

PPC64BE မှာ fast-call trampoline မရှိတာမို့ အမြဲတမ်း generic call path ကို သုံးပါတယ်။ "Buffer-shaped args" ဆိုတာ pointer နဲ့တူတဲ့ arguments တွေအနေနဲ့ ပေးပို့တဲ့ `Buffer`, typed array, `DataView`, (သို့) `ArrayBuffer` values တွေကို ဆိုလိုပါတယ်။ Arguments (သို့) return types တွေက လက်ရှိ platform အတွက် ကန့်သတ်ချက်တွေကို ကျော်လွန်နေတဲ့ functions တွေကတော့ generic FFI call path ကို သုံးပါတယ်။

## Signature objects (signature objects များ)

Functions နဲ့ callbacks တွေကို signature objects တွေနဲ့ ဖော်ပြပါတယ်။

Signature objects တွေမှာ အောက်ပါ properties တွေ ပါဝင်နိုင်ပြီး — နှစ်ခုလုံးက optional ပါ:

* `return` {string} Function (သို့) callback ရဲ့ return type ကို သတ်မှတ်တဲ့ [type name][type names] တစ်ခုပါ။ **Default:** `'void'`။
* `arguments` {string\[]} Function (သို့) callback ရဲ့ argument type list ကို သတ်မှတ်တဲ့ [type names][] array တစ်ခုပါ။ **Default:** `[]`။

```js
const signature = {
  return: 'int32',
  arguments: ['int32', 'int32'],
};
```

## `ffi.suffix`

* {string}

လက်ရှိ platform အတွက် native shared library ရဲ့ suffix ပါ:

* `'dylib'` (macOS တွင်)
* `'so'` (Unix လိုမျိုး platforms တွေမှာ)
* `'dll'` (Windows တွင်)

ဒါကို portable library paths တွေ တည်ဆောက်ဖို့ သုံးနိုင်ပါတယ်:

```cjs
const { suffix } = require('node:ffi');

const path = `libsqlite3.${suffix}`;
```

## `ffi.dlopen(path[, definitions])`

* `path` {string|null} Dynamic library တစ်ခုဆီကို ညွှန်တဲ့ path (သို့) လက်ရှိ process image ကနေ symbols တွေကို resolve လုပ်ဖို့ `null` ပါ။
* `definitions` {Object} ချက်ချင်း resolve လုပ်ရမယ့် symbol definitions တွေပါ။
* Returns: {Object}

Dynamic library တစ်ခုကို load လုပ်ပြီး တောင်းဆိုထားတဲ့ function definitions တွေကို resolve လုပ်ပါတယ်။

Windows မှာ `null` ကို ပေးပို့တာက support မလုပ်ပါဘူး။

`definitions` ကို ချန်လှပ်ထားရင် — symbols တွေကို ရှင်းရှင်းလင်းလင်း resolve မလုပ်မချင်း `functions` က empty object အဖြစ် ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ object ထဲမှာ ပါဝင်တာတွေက:

* `lib` {DynamicLibrary} Load လုပ်ထားတဲ့ library handle ပါ။
* `functions` {Object} တောင်းဆိုထားတဲ့ symbols တွေအတွက် callable wrappers တွေပါ။

ပြန်ပေးတဲ့ object က explicit resource management protocol ကိုလည်း လိုက်နာတာမို့ — [`using`][] declaration နဲ့တွဲ သုံးနိုင်ပါတယ်။ ဒီ object ကို dispose လုပ်လိုက်ရင် library handle ကို ပိတ်လိုက်ပါတယ်။

```mjs
import { dlopen, suffix } from 'node:ffi';

{
  using handle = dlopen(`./mylib.${suffix}`, {
    add_i32: { arguments: ['int32', 'int32'], return: 'int32' },
  });
  console.log(handle.functions.add_i32(20, 22));
} // handle.lib.close() is invoked automatically here.
```

```mjs
import { dlopen, suffix } from 'node:ffi';

const { lib, functions } = dlopen(`./mylib.${suffix}`, {
  add_i32: { arguments: ['int32', 'int32'], return: 'int32' },
  string_length: { arguments: ['pointer'], return: 'uint64' },
});

console.log(functions.add_i32(20, 22));
```

```cjs
const { dlopen, suffix } = require('node:ffi');

const { lib, functions } = dlopen(`./mylib.${suffix}`, {
  add_i32: { arguments: ['int32', 'int32'], return: 'int32' },
  string_length: { arguments: ['pointer'], return: 'uint64' },
});

console.log(functions.add_i32(20, 22));
```

## `ffi.dlclose(handle)`

* `handle` {DynamicLibrary}

Dynamic library တစ်ခုကို ပိတ်ပါတယ်။

ဒါက `handle.close()` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

## `ffi.dlsym(handle, symbol)`

* `handle` {DynamicLibrary}
* `symbol` {string}
* Returns: {bigint}

Load လုပ်ထားတဲ့ library တစ်ခုကနေ symbol address တစ်ခုကို resolve လုပ်ပါတယ်။

ဒါက `handle.getSymbol(symbol)` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

## Class: `DynamicLibrary`

Load လုပ်ထားတဲ့ dynamic library တစ်ခုကို ကိုယ်စားပြုပါတယ်။

### `new DynamicLibrary(path)`

* `path` {string|null} Dynamic library တစ်ခုဆီကို ညွှန်တဲ့ path (သို့) လက်ရှိ process image ကနေ symbols တွေကို resolve လုပ်ဖို့ `null` ပါ။

Functions တွေကို ချက်ချင်း resolve မလုပ်ပဲ dynamic library ကို load လုပ်ပါတယ်။

Windows မှာ `null` ကို ပေးပို့တာက support မလုပ်ပါဘူး။

```cjs
const { DynamicLibrary, suffix } = require('node:ffi');

const lib = new DynamicLibrary(`./mylib.${suffix}`);
```

### `library.path`

* {string}

Library ကို load လုပ်ဖို့ သုံးခဲ့တဲ့ path ပါ။

### `library.functions`

* {Object}

အရင်က resolve လုပ်ထားတဲ့ function wrappers တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

### `library.symbols`

* {Object}

အရင်က resolve လုပ်ထားတဲ့ symbol addresses တွေကို `bigint` values တွေအနေနဲ့ ပါဝင်တဲ့ object တစ်ခုပါ။

### `library.close()`

Library handle ကို ပိတ်ပါတယ်။

`DynamicLibrary` က explicit resource management protocol ကို လိုက်နာတာမို့ — library instance တစ်ခုကို [`using`][] declaration နဲ့ စီမံနိုင်ပါတယ်။ ပါဝင်နေတဲ့ scope ကနေ ထွက်သွားရင် `library.close()` ကို အလိုအလျောက် ခေါ်ပေးပါတယ်။

```mjs
import { DynamicLibrary, suffix } from 'node:ffi';

{
  using lib = new DynamicLibrary(`./mylib.${suffix}`);
  // Use `lib` here; `lib.close()` is called when the block exits.
}
```

`library.close()` ကို (သို့) library ကို dispose လုပ်တာကို တစ်ကြိမ်ထက် ပိုပြီး ခေါ်ရင် no-op (ဘာမှ မဖြစ်ပါဘူး)။

Library တစ်ခု ပိတ်ပြီးသွားတဲ့ နောက်မှာ:

* Resolve လုပ်ထားပြီးသား function wrappers တွေ invalid ဖြစ်သွားပါတယ်။
* Symbol နဲ့ function တွေကို ထပ်ပြီး resolve လုပ်ရင် throw လုပ်ပါတယ်။
* Register လုပ်ထားတဲ့ callbacks တွေ invalid ဖြစ်သွားပါတယ်။

Library တစ်ခုကို ပိတ်လိုက်တာက အရင်က export လုပ်ပေးခဲ့တဲ့ callback pointers တွေကို ပြန်သုံးလို့ ရအောင် မလုပ်ပေးပါဘူး။ Native code ဆီကို ပေးအပ်ပြီးသား callback pointers တွေကို Node.js က ခြေရာခံခြင်း (သို့) ပြန်ရုပ်သိမ်းခြင်း မလုပ်ပါဘူး။

`library.close()` (သို့) `library.unregisterCallback(pointer)` ပြီးနောက်မှာ native code က callback pointer တစ်ခုကို ကိုင်ထားဆဲ ဆိုရင် — အဲဒီ pointer ကို ခေါ်ဆိုတာက undefined behavior ဖြစ်ပြီး ခွင့်မပြုပါဘူး, အန္တရာယ်လည်း ရှိပါတယ်: process ကို crash ဖြစ်စေနိုင်တယ်, မှားယွင်းတဲ့ output တွေ ထွက်စေနိုင်တယ်, (သို့) memory ကို ပျက်စီးစေနိုင်ပါတယ်။ Native code က library မပိတ်ခင် (သို့) callback ကို unregister မလုပ်ခင် callback addresses တွေကို သုံးတာ ရပ်တန့်ရပါမယ်။

Library ရဲ့ active callbacks တွေထဲက တစ်ခုကနေ `library.close()` ကို ခေါ်တာက support မလုပ်တဲ့အပြင် အန္တရာယ်လည်း ရှိပါတယ်။ Callback က library မပိတ်ခင် အရင် ပြန်ထွက်သွားရပါမယ်။

### `library[Symbol.dispose]()`

`library.close()` ကို ခေါ်ပါတယ်။ ဒါက `DynamicLibrary` instances တွေကို — ပါဝင်နေတဲ့ scope ကနေ ထွက်သွားတဲ့အခါ အလိုအလျောက် ရှင်းလင်းပေးတဲ့ [`using`][] declaration နဲ့ သုံးနိုင်စေပါတယ်။ ပိတ်ပြီးသား library တစ်ခုအတွက်တော့ no-op (ဘာမှ မလုပ်ပါဘူး)။

### `library.getFunction(name, signature)`

* `name` {string}
* `signature` {Object}
* Returns: {Function}

Symbol တစ်ခုကို resolve လုပ်ပြီး callable JavaScript wrapper တစ်ခုကို ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ function မှာ native function address ကို `bigint` အနေနဲ့ ပါဝင်တဲ့ `.pointer` property တစ်ခု ရှိပါတယ်။

တူညီတဲ့ symbol ကို အရင်ကတည်းက resolve လုပ်ပြီးသား ဆိုရင် — မတူညီတဲ့ signature တစ်ခုနဲ့ ထပ်တောင်းဆိုရင် throw လုပ်ပါတယ်။ Signature တူတူပဲ ထပ်တောင်းဆိုရင်တော့ — [`library.functions`][] ကနေ ဖတ်တာလိုပဲ — တူညီတဲ့ function ကိုပဲ ပြန်ပေးပါတယ်။

```cjs
const { DynamicLibrary, suffix } = require('node:ffi');

const lib = new DynamicLibrary(`./mylib.${suffix}`);
const add = lib.getFunction('add_i32', {
  arguments: ['int32', 'int32'],
  return: 'int32',
});

console.log(add(20, 22));
console.log(add.pointer);
```

### `library.getFunctions([definitions])`

* `definitions` {Object}
* Returns: {Object}

`definitions` ပေးထားရင် — နာမည်တပ်ထားတဲ့ symbol တစ်ခုချင်းစီကို resolve လုပ်ပြီး callable wrappers တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

`definitions` ကို ချန်လှပ်ထားရင် — library ပေါ်မှာ အရင်က resolve လုပ်ပြီးသား functions အားလုံးအတွက် wrappers တွေကို ပြန်ပေးပါတယ်။

### `library.getSymbol(name)`

* `name` {string}
* Returns: {bigint}

Symbol တစ်ခုကို resolve လုပ်ပြီး ၎င်းရဲ့ native address ကို `bigint` အနေနဲ့ ပြန်ပေးပါတယ်။

### `library.getSymbols()`

* Returns: {Object}

အရင်က resolve လုပ်ထားတဲ့ symbol addresses တွေ အားလုံး ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

### `library.registerCallback([signature,] callback)`

* `signature` {Object}
* `callback` {Function}
* Returns: {bigint}

JavaScript function တစ်ခုကို ကျောထောက်နောက်ခံပြုထားတဲ့ native callback pointer တစ်ခုကို ဖန်တီးပါတယ်။

`signature` ကို ချန်လှပ်ထားရင် — callback က default `void ()` signature ကို သုံးပါတယ်။

ပြန်ပေးတဲ့ တန်ဖိုးက callback pointer ရဲ့ address ကို `bigint` အနေနဲ့ ပါ။ ၎င်းကို callback pointer တစ်ခုကို မျှော်လင့်နေတဲ့ native functions တွေဆီကို ပေးပို့နိုင်ပါတယ်။

```cjs
const { DynamicLibrary, suffix } = require('node:ffi');

const lib = new DynamicLibrary(`./mylib.${suffix}`);

const callback = lib.registerCallback(
  { arguments: ['int32'], return: 'int32' },
  (value) => value * 2,
);
```

Callbacks တွေမှာ အောက်ပါ ကန့်သတ်ချက်တွေ ရှိပါတယ်:

* ဖန်တီးခဲ့တဲ့ system thread တစ်ခုတည်းပေါ်မှာပဲ ခေါ်ဆိုရပါမယ်။
* Exceptions တွေ throw မလုပ်ရပါဘူး။
* Promises တွေကို ပြန်မပေးရပါဘူး။
* ကြေညာထားတဲ့ return type နဲ့ ကိုက်ညီတဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးရပါမယ်။
* အလုပ်လုပ်နေတုန်း ကိုယ်ပိုင် library ပေါ်မှာ `library.close()` ကို မခေါ်ရပါဘူး။
* အလုပ်လုပ်နေတုန်း ကိုယ့်ကိုယ်ကိုယ် unregister မလုပ်ရပါဘူး။

Callback အတွင်းကနေ ကိုယ်ပိုင် library ကို ပိတ်တာ (သို့) လက်ရှိ execute လုပ်နေတဲ့ callback ကို unregister လုပ်တာက support မလုပ်တဲ့အပြင် အန္တရာယ်လည်း ရှိပါတယ်။ အဲဒီလို လုပ်မိရင် process က crash ဖြစ်နိုင်တယ်, မှားယွင်းတဲ့ output တွေ ထွက်နိုင်တယ်, (သို့) memory ကို ပျက်စီးစေနိုင်ပါတယ်။

### `library.unregisterCallback(pointer)`

* `pointer` {bigint}

`library.registerCallback()` နဲ့ အရင်က ဖန်တီးထားတဲ့ callback တစ်ခုကို release (လွှတ်ပေး) လုပ်ပါတယ်။

လက်ရှိ execute လုပ်နေတဲ့ callback တစ်ခုအတွက် `library.unregisterCallback(pointer)` ကို ခေါ်တာက support မလုပ်တဲ့အပြင် အန္တရာယ်လည်း ရှိပါတယ်။ Callback ကို unregister မလုပ်ခင် callback က အရင် ပြန်ထွက်သွားရပါမယ်။

`library.unregisterCallback(pointer)` ပြန်လာပြီးနောက်မှာ အဲဒီ callback pointer ကို native code ကနေ ခေါ်ဆိုတာက undefined behavior ဖြစ်ပြီး ခွင့်မပြုပါဘူး, အန္တရာယ်လည်း ရှိပါတယ်: process ကို crash ဖြစ်စေနိုင်တယ်, မှားယွင်းတဲ့ output တွေ ထွက်စေနိုင်တယ်, (သို့) memory ကို ပျက်စီးစေနိုင်ပါတယ်။

### `library.refCallback(pointer)`

* `pointer` {bigint}

Callback ကို JavaScript ကနေ strongly referenced (ခိုင်မာစွာ ကိုးကားခံထားရသော) အနေနဲ့ ထိန်းထားပါတယ်။

အရင်က `library.unrefCallback(pointer)` ခေါ်ပြီးနောက် callback function ကို garbage collect လုပ်ပြီးသွားပြီ ဆိုရင် — collect လုပ်ပြီးသား function တစ်ခုကို ပြန်ပြီး reference လုပ်လို့ မရတာမို့ — `ERR_INVALID_ARG_VALUE` ကို throw လုပ်ပါတယ်။

### `library.unrefCallback(pointer)`

* `pointer` {bigint}

Callback ကို JavaScript ကနေ weakly referenced (အားနည်းစွာ ကိုးကားခံထားရသော) အနေနဲ့ ထားရှိခွင့် ပြုပါတယ်။

နောက်ပိုင်းမှာ callback function ကို garbage collect လုပ်လိုက်ရင် — နောက်ထပ် native invocations တွေက no-op ဖြစ်သွားပါတယ်။ Non-void return values တွေကိုတော့ native code ဆီကို ပြန်မပို့ခင် zero-initialize (သုညဖြင့် စတင်သတ်မှတ်ခြင်း) လုပ်ပါတယ်။

Callback function ကို garbage collect လုပ်ပြီးသွားပြီ ဆိုရင် `ERR_INVALID_ARG_VALUE` ကို throw လုပ်ပါတယ်။

## Native functions များကို ခေါ်ဆိုခြင်း (Calling native functions)

Argument conversion တွေက ကြေညာထားတဲ့ FFI type ပေါ်မှာ မူတည်ပါတယ်။

8-, 16-, 32-bit integer types တွေနဲ့ floating-point types တွေအတွက်တော့ — ကြေညာထားတဲ့ type နဲ့ ကိုက်ညီတဲ့ JavaScript `number` values တွေကို ပေးပို့ပါ။

64-bit integer types (`int64` နဲ့ `uint64`) တွေအတွက်တော့ JavaScript `bigint` values တွေကို ပေးပို့ပါ။

Pointer နဲ့တူတဲ့ arguments တွေအတွက်:

* `null` နဲ့ `undefined` တွေကို null pointers တွေအနေနဲ့ ပေးပို့ပါတယ်။
* `string` values တွေကို call ကြာချိန် အတွက် temporary NUL-terminated UTF-8 strings တွေဆီကို ကူးယူပါတယ်။
* `Buffer`, typed arrays, နဲ့ `DataView` instances တွေက ၎င်းတို့ရဲ့ backing memory ဆီကို pointer တစ်ခု ပေးပို့ပါတယ်။
* `ArrayBuffer` က ၎င်းရဲ့ backing memory ဆီကို pointer တစ်ခု ပေးပို့ပါတယ်။
* `bigint` values တွေကို raw pointer addresses တွေအနေနဲ့ ပေးပို့ပါတယ်။

Pointer return values တွေကို `bigint` addresses တွေအနေနဲ့ ထုတ်ပေးပါတယ်။

## Primitive memory access helpers (primitive memory access helper များ)

အောက်ပါ helpers တွေက native pointer တစ်ခုမှာ primitive values တွေကို — byte offset တစ်ခု ထည့်ပြီးလည်း ဖြစ်သလို ထည့်စရာမလိုပဲလည်း ဖြစ် — ဖတ်ခြင်း/ရေးခြင်း လုပ်ပေးပါတယ်:

* `ffi.getInt8(pointer[, offset])`
* `ffi.getUint8(pointer[, offset])`
* `ffi.getInt16(pointer[, offset])`
* `ffi.getUint16(pointer[, offset])`
* `ffi.getInt32(pointer[, offset])`
* `ffi.getUint32(pointer[, offset])`
* `ffi.getInt64(pointer[, offset])`
* `ffi.getUint64(pointer[, offset])`
* `ffi.getFloat32(pointer[, offset])`
* `ffi.getFloat64(pointer[, offset])`
* `ffi.setInt8(pointer, offset, value)`
* `ffi.setUint8(pointer, offset, value)`
* `ffi.setInt16(pointer, offset, value)`
* `ffi.setUint16(pointer, offset, value)`
* `ffi.setInt32(pointer, offset, value)`
* `ffi.setUint32(pointer, offset, value)`
* `ffi.setInt64(pointer, offset, value)`
* `ffi.setUint64(pointer, offset, value)`
* `ffi.setFloat32(pointer, offset, value)`
* `ffi.setFloat64(pointer, offset, value)`

ဒီ helpers တွေက တိုက်ရိုက် memory ဖတ်ခြင်း/ရေးခြင်းတွေကို လုပ်ဆောင်ပါတယ်။ `pointer` က တရားဝင်ပြီး ဖတ်လို့ရ (သို့) ရေးလို့ရတဲ့ native memory တစ်ခုကို ညွှန်တဲ့ `bigint` တစ်ခု ဖြစ်ရပါမယ်။ `offset` ပေးထားရင် — `pointer` ကနေ byte offset တစ်ခုအနေနဲ့ အဓိပ္ပာယ် ဖွင့်ဆိုပါတယ်။

Getter helpers တွေက 8-, 16-, 32-bit integer types တွေနဲ့ floating-point types တွေအတွက် JavaScript `number` values တွေကို ပြန်ပေးပါတယ်။ 64-bit integer types တွေအတွက်တော့ `bigint` values တွေကို ပြန်ပေးပါတယ်။

Setter helpers တွေက explicit byte offset တစ်ခု လိုအပ်ပြီး — memory ထဲကို မရေးခင် ပေးပို့လိုက်တဲ့ JavaScript value ကို target native type နဲ့ တိုက်ဆိုင်စစ်ဆေးပါတယ်။ `setInt64()` နဲ့ `setUint64()` တွေအတွက်တော့ `bigint` values တွေကို တိုက်ရိုက် လက်ခံပြီး — numeric inputs တွေက JavaScript ရဲ့ safe integer range အတွင်းက integers တွေ ဖြစ်ရပါမယ်။

```cjs
const {
  getInt32,
  setInt32,
} = require('node:ffi');

setInt32(ptr, 0, 42);
console.log(getInt32(ptr, 0));
```

ဒီ module ထဲက တခြား raw memory helpers တွေလိုပဲ — ဒီ APIs တွေက ownership, bounds, (သို့) lifetime တွေကို ခြေရာခံခြင်း မလုပ်ပါဘူး။ Invalid pointer တစ်ခုကို ပေးပို့တာ, offset မှားသုံးတာ, (သို့) ခေတ်မမီတော့တဲ့ (stale) pointer တစ်ခုကနေ ရေးတာတွေက memory ကို ပျက်စီးစေနိုင်သလို — process ကိုလည်း crash ဖြစ်စေနိုင်ပါတယ်။

## `ffi.toString(pointer)`

* `pointer` {bigint}
* Returns: {string|null}

Native memory ကနေ NUL-terminated UTF-8 string တစ်ခုကို ဖတ်ပါတယ်။

`pointer` က `0n` ဆိုရင် — `null` ကို ပြန်ပေးပါတယ်။

ဒီ function က `pointer` က readable memory တစ်ခုကို ညွှန်တယ်ဆိုတာ (သို့) ညွှန်ထားတဲ့ data က `\0` နဲ့ အဆုံးသတ်ထားတယ်ဆိုတာကို စစ်ဆေးခြင်း မလုပ်ပါဘူး။ Invalid pointer တစ်ခု, free လုပ်ပြီးသား memory ဆီကို ညွှန်တဲ့ pointer တစ်ခု, (သို့) terminating NUL မပါတဲ့ bytes တွေဆီကို ညွှန်တဲ့ pointer တစ်ခုကို ပေးပို့ရင် — မသက်ဆိုင်တဲ့ memory တွေကို ဖတ်မိနိုင်တယ်, process က crash ဖြစ်နိုင်တယ်, (သို့) ပြတ်တောက်နေတဲ့ (သို့) ရှုပ်ထွေးနေတဲ့ output တွေ ထွက်နိုင်ပါတယ်။

```cjs
const { toString } = require('node:ffi');

const value = toString(ptr);
```

## `ffi.toBuffer(pointer, length[, copy])`

* `pointer` {bigint}
* `length` {number}
* `copy` {boolean} `false` ဆိုရင် zero-copy view တစ်ခုကို ဖန်တီးပါတယ်။ **Default:** `true`။
* Returns: {Buffer}

Native memory ကနေ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်။

`copy` က `true` ဆိုရင် — ပြန်ပေးတဲ့ `Buffer` က ကိုယ်ပိုင် ကူးယူထားတဲ့ memory ကို ပိုင်ဆိုင်ပါတယ်။ `copy` က `false` ဆိုရင်တော့ — ပြန်ပေးတဲ့ `Buffer` က မူရင်း native memory ကို တိုက်ရိုက် ညွှန်ပြ (reference လုပ်) ပါတယ်။

`copy: false` ကို သုံးတာက zero-copy escape hatch တစ်ခုပါ။ ပြန်ပေးတဲ့ `Buffer` က တခြားပိုင် (foreign) memory အပေါ်ကို ရေးလို့ရတဲ့ view တစ်ခု ဖြစ်တာမို့ — JavaScript ထဲက writes တွေက မူရင်း native memory ကို တိုက်ရိုက် update လုပ်ပါတယ်။ Caller က အောက်ပါအတိုင်း အာမခံပေးရပါမယ်:

* `pointer` က ပြန်ပေးတဲ့ `Buffer` ရဲ့ lifetime တစ်လျှောက်လုံး တရားဝင် ဖြစ်နေရပါမယ်။
* `length` က သတ်မှတ်ထားတဲ့ native region အတွင်းမှာ ရှိနေရပါမယ်။
* JavaScript က `Buffer` ကို သုံးနေတုန်း အဲဒီ memory ကို native code က free လုပ်ခြင်း (သို့) တခြားရည်ရွယ်ချက်နဲ့ ပြန်သုံးခြင်း မလုပ်ရပါဘူး။
* Memory protection ကို လိုက်နာရပါမယ်။ ဥပမာ — read-only memory pages တွေကို မရေးရပါဘူး။

ဒီ အာမခံချက်တွေ မပြည့်စုံရင် — `Buffer` ကို ဖတ်တာ (သို့) ရေးတာက memory ကို ပျက်စီးစေနိုင်သလို process ကိုလည်း crash ဖြစ်စေနိုင်ပါတယ်။

## `ffi.toArrayBuffer(pointer, length[, copy])`

* `pointer` {bigint}
* `length` {number}
* `copy` {boolean} `false` ဆိုရင် zero-copy view တစ်ခုကို ဖန်တီးပါတယ်။ **Default:** `true`။
* Returns: {ArrayBuffer}

Native memory ကနေ `ArrayBuffer` တစ်ခုကို ဖန်တီးပါတယ်။

`copy` က `true` ဆိုရင် — ပြန်ပေးတဲ့ `ArrayBuffer` မှာ ကူးယူထားတဲ့ bytes တွေ ပါဝင်ပါတယ်။ `copy` က `false` ဆိုရင်တော့ — ပြန်ပေးတဲ့ `ArrayBuffer` က မူရင်း native memory ကို တိုက်ရိုက် ညွှန်ပြပါတယ်။

[`ffi.toBuffer(pointer, length, copy)`][] အတွက် ဖော်ပြထားတဲ့ lifetime နဲ့ bounds လိုအပ်ချက်တွေက ဒီမှာလည်း အလားတူ သက်ရောက်ပါတယ်။ `copy: false` နဲ့ဆိုရင် — ပြန်ပေးတဲ့ `ArrayBuffer` က foreign memory အပေါ်က zero-copy view တစ်ခု ဖြစ်ပြီး အဲဒီ memory က ထုတ်ပြထားတဲ့ range တစ်ခုလုံးအတွက် သတ်မှတ်ထားသလို ဆက်လက် တည်ရှိနေပြီး layout မပြောင်းပဲ တရားဝင် ဖြစ်နေမှသာ လုံခြုံပါတယ်။

## `ffi.exportString(string, pointer, length[, encoding])`

* `string` {string}
* `pointer` {bigint}
* `length` {number}
* `encoding` {string} **Default:** `'utf8'`။

JavaScript string တစ်ခုကို native memory ထဲကို ကူးယူပြီး နောက်ဆုံးမှာ NUL terminator တစ်ခု ထပ်ထည့်ပါတယ်။

`length` က encode လုပ်ထားတဲ့ string တစ်ခုလုံးနဲ့ နောက်က NUL terminator ပါ ဝင်ဆံ့ဖို့ လုံလောက်တဲ့ အရွယ်အစား ရှိရပါမယ်။ UTF-16 နဲ့ UCS-2 encodings တွေမှာတော့ နောက်ဆုံး terminator က zero bytes နှစ်ခု သုံးပါတယ်။

`pointer` က အနည်းဆုံး `length` bytes လောက် သိုလှောင်နိုင်တဲ့ writable native memory တစ်ခုကို ညွှန်ရပါမယ်။ ဒီ function က memory ကို သူ့ဘာသာ ခွဲဝေပေးခြင်း (allocate) မလုပ်ပါဘူး။

`string` က JavaScript string တစ်ခု ဖြစ်ရပြီး — `encoding` က string တစ်ခု ဖြစ်ရပါမယ်။

## `ffi.exportBuffer(buffer, pointer, length)`

* `buffer` {Buffer}
* `pointer` {bigint}
* `length` {number}

`Buffer` တစ်ခုထဲက bytes တွေကို native memory ထဲကို ကူးယူပါတယ်။

`length` က အနည်းဆုံး `buffer.length` လောက် ရှိရပါမယ်။

`pointer` က အနည်းဆုံး `length` bytes လောက် သိုလှောင်နိုင်တဲ့ writable native memory တစ်ခုကို ညွှန်ရပါမယ်။ ဒီ function က memory ကို သူ့ဘာသာ ခွဲဝေပေးခြင်း မလုပ်ပါဘူး။

`buffer` က Node.js `Buffer` တစ်ခု ဖြစ်ရပါမယ်။

## `ffi.exportArrayBuffer(arrayBuffer, pointer, length)`

* `arrayBuffer` {ArrayBuffer}
* `pointer` {bigint}
* `length` {number}

`ArrayBuffer` တစ်ခုထဲက bytes တွေကို native memory ထဲကို ကူးယူပါတယ်။

`length` က အနည်းဆုံး `arrayBuffer.byteLength` လောက် ရှိရပါမယ်။

`pointer` က အနည်းဆုံး `length` bytes လောက် သိုလှောင်နိုင်တဲ့ writable native memory တစ်ခုကို ညွှန်ရပါမယ်။ ဒီ function က memory ကို သူ့ဘာသာ ခွဲဝေပေးခြင်း မလုပ်ပါဘူး။

## `ffi.exportArrayBufferView(arrayBufferView, pointer, length)`

* `arrayBufferView` {ArrayBufferView}
* `pointer` {bigint}
* `length` {number}

`ArrayBufferView` တစ်ခုထဲက bytes တွေကို native memory ထဲကို ကူးယူပါတယ်။

`length` က အနည်းဆုံး `arrayBufferView.byteLength` လောက် ရှိရပါမယ်။

`pointer` က အနည်းဆုံး `length` bytes လောက် သိုလှောင်နိုင်တဲ့ writable native memory တစ်ခုကို ညွှန်ရပါမယ်။ ဒီ function က memory ကို သူ့ဘာသာ ခွဲဝေပေးခြင်း မလုပ်ပါဘူး။

## `ffi.getRawPointer(source)`

* `source` {Buffer|ArrayBuffer|SharedArrayBuffer|ArrayBufferView}
* Returns: {bigint}

JavaScript က စီမံခန့်ခွဲတဲ့ byte storage တစ်ခုရဲ့ raw memory address ကို ပြန်ပေးပါတယ်။

ဒါက လုံခြုံမှု မရှိပြီး အန္တရာယ် ရှိပါတယ်။ ပြန်ပေးလိုက်တဲ့ pointer က — အောက်ခံ memory ကို detach, resize, transfer (သို့) တခြားနည်းနဲ့ invalid ဖြစ်အောင် လုပ်လိုက်ရင် — မတရားတော့ပါဘူး။ Stale pointers တွေကို သုံးတာက memory ပျက်စီးခြင်း (သို့) process crashes တွေကို ဖြစ်စေနိုင်ပါတယ်။

## `ffi.getCurrentEventLoop()`

* Returns: {bigint}

လက်ရှိ thread ရဲ့ `uv_loop_t` address ကို `bigint` အနေနဲ့ ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ address က လက်ရှိ Node.js environment အတွက် ဖြစ်ပါတယ်။ Main thread မှာဆိုရင် main thread ရဲ့ event loop ဖြစ်ပြီး — worker thread တစ်ခုမှာဆိုရင်တော့ အဲဒီ worker ရဲ့ event loop ဖြစ်ပါတယ်။

ဒါက လုံခြုံမှု မရှိပြီး အန္တရာယ် ရှိပါတယ်။ ပြန်ပေးတဲ့ pointer က လက်ရှိ environment ရဲ့ lifetime အတွင်းမှာပဲ တရားဝင်ပါတယ်။ Environment ထွက်သွားပြီးနောက် (သို့) တခြား thread (သို့) lifetime တစ်ခုကို ယူဆထားတဲ့ native code ကနေ ၎င်းကို သုံးရင် — process က crash ဖြစ်နိုင်သလို memory လည်း ပျက်စီးနိုင်ပါတယ်။

## Safety notes (လုံခြုံရေး မှတ်ချက်များ)

`node:ffi` module က pointer validity, memory ownership, (သို့) native object lifetimes တွေကို ခြေရာခံခြင်း မလုပ်ပါဘူး။

အထူးသဖြင့်:

* Free လုပ်ပြီးသား memory ကနေ ဖတ်ခြင်း (သို့) ရေးခြင်း မလုပ်ပါနဲ့။
* Native memory ကို ပြန်လွှတ်လိုက်ပြီးနောက် zero-copy views တွေကို မသုံးပါနဲ့။
* Native symbols တွေအတွက် မှားယွင်းတဲ့ signatures တွေကို မကြေညာပါနဲ့။
* Native code က callbacks တွေကို ခေါ်နိုင်သေးတုန်း callbacks တွေကို unregister မလုပ်ပါနဲ့။
* `library.close()` (သို့) `library.unregisterCallback(pointer)` ပြီးနောက် callback pointers တွေကို မခေါ်ပါနဲ့။
* Undefined callback behavior က process ကို crash ဖြစ်စေနိုင်တယ်, မှားယွင်းတဲ့ output တွေ ထွက်စေနိုင်တယ်, (သို့) memory ကို ပျက်စီးစေနိုင်တယ်ဆိုတာ ယူဆထားပါ။
* Pointer return values တွေက ownership ကို ဆိုလိုတယ်လို့ မယူဆပါနဲ့ — caller က ပြန်ပေးလိုက်တဲ့ address ကို free လုပ်ရမလား ဆိုတာက native API အပေါ်မှာ လုံးဝ မူတည်ပါတယ်။

ယေဘုယျ စည်းမျဉ်းအနေနဲ့ — zero-copy access မလိုအပ်ရင် ကူးယူထားတဲ့ (copied) values တွေကို ဦးစားပေး သုံးပြီး — callback နဲ့ pointer lifetimes တွေကို native ဘက်မှာ ရှင်းရှင်းလင်းလင်း ထားရှိပါ။

[Permission Model]: permissions.md#permission-model
[`--allow-ffi`]: cli.md#--allow-ffi
[`ffi.toBuffer(pointer, length, copy)`]: #ffitobufferpointer-length-copy
[`library.functions`]: #libraryfunctions
[`using`]: https://tc39.es/proposal-explicit-resource-management/#sec-using-declarations
[type names]: #type-names
