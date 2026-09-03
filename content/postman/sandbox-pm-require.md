---
title: "Scripts တွေထဲ packages တွေ import လုပ်ခြင်း (Import packages into your scripts)"
description: "pm.require method နဲ့ HTTP, gRPC နဲ့ GraphQL requests တွေထဲက scripts တွေမှာ Package Library ဒါမှမဟုတ် external package registries တွေကနေ packages တွေ import လုပ်ခြင်း — global objects တွေ, sandbox built-in libraries တွေနဲ့ NodeJS modules တွေလည်း ပါဝင်"
order: 120
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/"
status: translated
updated: 2026-09-03
---

HTTP, gRPC နဲ့ GraphQL requests တွေထဲက scripts တွေမှာ — ကိုယ့် team ရဲ့ [Package Library](/docs/postman/package-library) ဒါမှမဟုတ် [external package registries](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) တွေကနေ packages တွေ import လုပ်ဖို့ `pm.require` method ကို သုံးနိုင်ပါတယ်။

## pm.require

`pm.require` method က package တစ်ခုရဲ့ နာမည်ကို လက်ခံပါတယ်။ Package မှာ ကိုယ် call လုပ်ချင်တဲ့ functions ဒါမှမဟုတ် objects တွေ ရှိရင် — method ကို variable တစ်ခုအနေနဲ့ declare လုပ်ပါ။ Package မှာ code တွေ ဒါမှမဟုတ် `pm` object ရဲ့ instances တွေပဲ ပါတယ်ဆိုရင် — method ကို variable အနေနဲ့ declare လုပ်ဖို့ မလိုပါဘူး။

### Examples

Package Library ကနေ package တစ်ခု import လုပ်ဖို့ အောက်ပါ format ကို သုံးပါ:

```js
const variableName = pm.require('@team-domain/package-name');

variableName.functionName()
```

Package registry တစ်ခုကနေ external package တစ်ခု import လုပ်ဖို့ အောက်ပါ format ကို သုံးပါ:

```js
// package imported from npm
const npmVariableName = pm.require('npm:package-name@version-number');

npmVariableName.functionName()

// package imported from jsr
const jsrVariableName = pm.require('jsr:package-name@version-number');

jsrVariableName.functionName()
```

## Global objects တွေကို အသုံးပြုခြင်း (Use global objects)

Postman က အောက်ပါ JavaScript objects တွေကို ကိုယ့် scripts တွေထဲမှာ globally ပံ့ပိုးပေးပါတယ်:

* Standard objects တွေ
  * [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
  * [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
  * [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [BigInt64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)
  * [BigUint64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)
  * [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
  * [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  * [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
  * [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  * [EvalError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)
  * [Float32Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)
  * [Float64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)
  * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  * [Infinity property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)
  * [Int8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)
  * [Int16Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)
  * [Int32Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)
  * [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
  * [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
  * [NaN property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
  * [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  * [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  * [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  * [RangeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
  * [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
  * [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
  * [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
  * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
  * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
  * [SyntaxError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
  * [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
  * [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
  * [Uint8ClampedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)
  * [Uint16Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)
  * [Uint32Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)
  * [URIError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)
  * [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
  * [WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
* Document Object Model (DOM) objects တွေ
  * [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
  * [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
  * [DOMException](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)
  * [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
  * [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
* Encoding objects တွေ
  * [atob method](https://developer.mozilla.org/en-US/docs/Web/API/Window/atob)
  * [btoa method](https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa)
  * [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
  * [TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)
  * [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
  * [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)
* File objects တွေ
  * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
  * [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
* JavaScript objects တွေ
  * [decodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
  * [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
  * [encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
  * [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  * [escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape)
  * [isFinite](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
  * [isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN)
  * [parseFloat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)
  * [parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
  * [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
  * [unescape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape)
* HTML DOM objects တွေ
  * [structuredClone method](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
  * [queueMicrotask method](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
* Streams objects တွေ
  * [ByteLengthQueuingStrategy](https://developer.mozilla.org/en-US/docs/Web/API/ByteLengthQueuingStrategy)
  * [CountQueuingStrategy](https://developer.mozilla.org/en-US/docs/Web/API/CountQueuingStrategy)
  * [CompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)
  * [DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)
  * [ReadableByteStreamController](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController)
  * [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
  * [ReadableStreamBYOBReader](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader)
  * [ReadableStreamBYOBRequest](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBRequest)
  * [ReadableStreamDefaultController](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController)
  * [ReadableStreamDefaultReader](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader)
  * [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
  * [TransformStreamDefaultController](https://developer.mozilla.org/en-US/docs/Web/API/TransformStreamDefaultController)
  * [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
  * [WritableStreamDefaultController](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultController)
  * [WritableStreamDefaultWriter](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)
* URL objects တွေ
  * [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
  * [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
* Web Crypto objects တွေ
  * [Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
  * [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)
  * [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
  * [crypto property](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto)

## External libraries တွေကို အသုံးပြုခြင်း (Use external libraries)

`require` method က sandbox ရဲ့ built-in library modules တွေကို သုံးနိုင်စေပါတယ်။ Library တစ်ခုကို သုံးဖို့ — `require` method ကို call လုပ်ပြီး module ရဲ့ နာမည်ကို parameter အနေနဲ့ ထည့်ကာ — method ကနေ ပြန်ပေးတဲ့ object ကို variable တစ်ခုကို assign လုပ်ပါ:

```bash
require(moduleName:String):function
```

Sandbox ထဲမှာ သုံးလို့ရတဲ့ ပံ့ပိုးထားတဲ့ libraries တွေကတော့:

* [ajv](https://www.npmjs.com/package/ajv/v/6.12.5)
* [chai](https://www.chaijs.com/)
* [cheerio](https://cheerio.js.org/)
* [csv-parse/lib/sync](https://csv.js.org/parse/)
* [lodash](https://lodash.com/)
* [moment](https://momentjs.com/docs/)
* [postman-collection](http://www.postmanlabs.com/postman-collection/)
* [uuid](https://www.npmjs.com/package/uuid)
* [xml2js](https://www.npmjs.com/package/xml2js)

အောက်ပါ libraries တွေကတော့ deprecated ဖြစ်နေပြီး နောက်ထပ် ပံ့ပိုးမပေးတော့ပါဘူး:

* [atob](https://www.npmjs.com/package/atob) — ဒီအစား atob method ကို သုံးပါ။
* [btoa](https://www.npmjs.com/package/btoa) — ဒီအစား btoa method ကို သုံးပါ။
* [crypto-js](https://www.npmjs.com/package/crypto-js) — ဒီအစား Web Crypto objects တွေကို သုံးပါ။
* [tv4](https://github.com/geraintluff/tv4) — ဒီအစား [ajv](https://www.npmjs.com/package/ajv/v/6.12.5) library ကို သုံးပါ။

အောက်ပါ NodeJS modules တွေလည်း ရနိုင်ပါတယ်:

* [path](https://nodejs.org/api/path.html)
* [assert](https://nodejs.org/api/assert.html)
* [buffer](https://nodejs.org/api/buffer.html)
* [util](https://nodejs.org/api/util.html)
* [url](https://nodejs.org/api/url.html)
* [punycode](https://nodejs.org/api/punycode.html)
* [querystring](https://nodejs.org/api/querystring.html)
* [string-decoder](https://nodejs.org/api/string_decoder.html)
* [stream](https://nodejs.org/api/stream.html)
* [timers](https://nodejs.org/api/timers.html)
* [events](https://nodejs.org/api/events.html)

Postman က buffer module ထဲမှာ အောက်ပါတို့ကို ပံ့ပိုးမပေးပါဘူး: [isAscii](https://nodejs.org/api/buffer.html#bufferisasciiinput), [isUtf8](https://nodejs.org/api/buffer.html#bufferisutf8input), [resolveObjectURL](https://nodejs.org/api/buffer.html#bufferresolveobjecturlid), [transcode](https://nodejs.org/api/buffer.html#buffertranscodesource-fromenc-toenc) နဲ့ [copyBytesFrom](https://nodejs.org/api/buffer.html#static-method-buffercopybytesfromview-offset-length).
