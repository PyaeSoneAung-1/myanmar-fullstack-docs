---
title: "Edge Runtime"
description: "Edge Runtime ၏ API ကိုးကား — ပံ့ပိုးထားသော web APIs (Network, Encoding, Stream, Crypto, Web Standard), Next.js polyfills, environment variables နှင့် မထောက်ပံ့ထားသော APIs အကြောင်း"
order: 241
source: "https://nextjs.org/docs/app/api-reference/edge"
status: translated
updated: 2026-09-03
---

Next.js မှာ သင့် application အတွက် သုံးနိုင်တဲ့ server runtime နှစ်မျိုး ရှိပါတယ်:

- **Node.js Runtime** (default) — Node.js APIs အားလုံးကို သုံးခွင့် ရှိပြီး သင့် application ကို render လုပ်ဖို့ သုံးပါတယ်။
- **Edge Runtime** — ပိုပြီး ကန့်သတ်ထားတဲ့ [set of APIs](#reference) ပဲ ပါဝင်ပြီး — [Proxy](/docs/nextjs/file-conventions-proxy) ထဲမှာ သုံးပါတယ်။

## Caveats (သတိထားစရာများ)

- Edge Runtime က Node.js APIs အားလုံးကို မထောက်ပံ့ပါဘူး — ဒါကြောင့် package တချို့ မျှော်လင့်ထားသလို အလုပ်မလုပ်တာမျိုး ဖြစ်နိုင်ပါတယ်။
- Edge Runtime က Incremental Static Regeneration (ISR) ကို မထောက်ပံ့ပါဘူး။
- Runtime နှစ်ခုလုံးက — သင့် deployment adapter ပေါ် မူတည်ပြီး [streaming](/docs/nextjs/file-conventions-loading) ကို ထောက်ပံ့နိုင်ပါတယ်။

## Reference

Edge Runtime က အောက်ပါ APIs တွေကို ထောက်ပံ့ပါတယ်:

### Network APIs

| API                                                                             | Description                       |
| ------------------------------------------------------------------------------- | --------------------------------- |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) | Blob (binary data အစုအဝေး) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) | Resource တစ်ခုကို ယူဆောင်ပေးသည် (fetch လုပ်သည်) |
| [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) | Fetch event တစ်ခုကို ကိုယ်စားပြုသည် |
| [`File`](https://developer.mozilla.org/docs/Web/API/File) | File တစ်ခုကို ကိုယ်စားပြုသည် |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) | Form data များကို ကိုယ်စားပြုသည် |
| [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) | HTTP headers များကို ကိုယ်စားပြုသည် |
| [`Request`](https://developer.mozilla.org/docs/Web/API/Request) | HTTP request တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Response`](https://developer.mozilla.org/docs/Web/API/Response) | HTTP response တစ်ခုကို ကိုယ်စားပြုသည် |
| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | URL ၏ search parameters များကို ကိုယ်စားပြုသည် |
| [`WebSocket`](https://developer.mozilla.org/docs/Web/API/WebSocket) | Websocket connection တစ်ခုကို ကိုယ်စားပြုသည် |

### Encoding APIs

| API                                                                                 | Description                        |
| ----------------------------------------------------------------------------------- | ---------------------------------- |
| [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/atob) | Base-64 ဖြင့် encode လုပ်ထားသော string တစ်ခုကို decode လုပ်သည် |
| [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/btoa) | String တစ်ခုကို base-64 ဖြင့် encode လုပ်သည် |
| [`TextDecoder`](https://developer.mozilla.org/docs/Web/API/TextDecoder) | `Uint8Array` တစ်ခုကို string အဖြစ် decode လုပ်သည် |
| [`TextDecoderStream`](https://developer.mozilla.org/docs/Web/API/TextDecoderStream) | Streams များအတွက် ဆက်တွဲသုံးနိုင်သော decoder |
| [`TextEncoder`](https://developer.mozilla.org/docs/Web/API/TextEncoder) | String တစ်ခုကို `Uint8Array` အဖြစ် encode လုပ်သည် |
| [`TextEncoderStream`](https://developer.mozilla.org/docs/Web/API/TextEncoderStream) | Streams များအတွက် ဆက်တွဲသုံးနိုင်သော encoder |

### Stream APIs

| API                                                                                                     | Description                             |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) | ဖတ်နိုင်သော stream (readable stream) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`ReadableStreamBYOBReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader) | `ReadableStream` တစ်ခု၏ reader ကို ကိုယ်စားပြုသည် |
| [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader) | `ReadableStream` တစ်ခု၏ reader ကို ကိုယ်စားပြုသည် |
| [`TransformStream`](https://developer.mozilla.org/docs/Web/API/TransformStream) | ပြောင်းလဲပေးသော stream (transform stream) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) | ရေးနိုင်သော stream (writable stream) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) | `WritableStream` တစ်ခု၏ writer ကို ကိုယ်စားပြုသည် |

### Crypto APIs

| API                                                                       | Description                                                                                         |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [`crypto`](https://developer.mozilla.org/docs/Web/API/Window/crypto) | Platform ၏ cryptographic (ကုဒ်ဝှက်ခြင်းဆိုင်ရာ) လုပ်ဆောင်ချက်များသို့ ဝင်ရောက်ခွင့် ပေးသည် |
| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | Cryptographic key (ကုဒ်ဝှက်သော့) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`SubtleCrypto`](https://developer.mozilla.org/docs/Web/API/SubtleCrypto) | Hashing, signing, encryption (ကုဒ်ဝှက်ခြင်း) (သို့) decryption (ကုဒ်ဖြေခြင်း) ကဲ့သို့သော အသုံးများသည့် cryptographic primitives များသို့ ဝင်ရောက်ခွင့် ပေးသည် |

### Web Standard APIs

| API                                                                                                                   | Description                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController) | လိုအပ်သလို DOM requests တစ်ခု (သို့) အများကို abort (ရပ်စဲ) လုပ်နိုင်စေသည် |
| [`Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) | Values များ၏ array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | ယေဘုယျသဘောရှိပြီး အလျား သတ်မှတ်ထားသော (fixed-length) raw binary data buffer တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Atomics`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Atomics) | Atomic operations များကို static methods အဖြစ် ပေးသည် |
| [`BigInt`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | Arbitrary precision (ကန့်သတ်ချက်မဲ့ တိကျမှု) ရှိသော ကိန်းပြည့်တစ်ခုကို ကိုယ်စားပြုသည် |
| [`BigInt64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array) | 64-bit signed integers (အနုတ်လက္ခဏာပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`BigUint64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array) | 64-bit unsigned integers (အနုတ်လက္ခဏာမပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Boolean`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | Logical entity တစ်ခုကို ကိုယ်စားပြုပြီး — `true` နှင့် `false` ဟူသော တန်ဖိုးနှစ်ခု ရှိနိုင်သည် |
| [`clearInterval`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval) | `setInterval()` ခေါ်ခြင်းဖြင့် ယခင်က သတ်မှတ်ထားခဲ့သော အချိန်ကိုက် ထပ်ခါတလဲလဲ လုပ်ဆောင်သည့် action တစ်ခုကို ရပ်စဲသည် |
| [`clearTimeout`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout) | `setTimeout()` ခေါ်ခြင်းဖြင့် ယခင်က သတ်မှတ်ထားခဲ့သော အချိန်ကိုက် ထပ်ခါတလဲလဲ လုပ်ဆောင်သည့် action တစ်ခုကို ရပ်စဲသည် |
| [`console`](https://developer.mozilla.org/docs/Web/API/Console) | Browser ၏ debugging console သို့ ဝင်ရောက်ခွင့် ပေးသည် |
| [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | `ArrayBuffer` တစ်ခု၏ ယေဘုယျ view တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Platform နှင့် မသက်ဆိုင်သော format ဖြင့် အချိန်၏ အခိုက်အတန့်တစ်ခုကို ကိုယ်စားပြုသည် |
| [`decodeURI`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) | `encodeURI` (သို့) အလားတူ routine တစ်ခုဖြင့် ယခင်က ဖန်တီးထားသော Uniform Resource Identifier (URI) တစ်ခုကို decode လုပ်သည် |
| [`decodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) | `encodeURIComponent` (သို့) အလားတူ routine တစ်ခုဖြင့် ယခင်က ဖန်တီးထားသော Uniform Resource Identifier (URI) component တစ်ခုကို decode လုပ်သည် |
| [`DOMException`](https://developer.mozilla.org/docs/Web/API/DOMException) | DOM ထဲတွင် ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`encodeURI`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) | Character အချို့၏ instance တစ်ခုစီကို — ထို character ၏ UTF-8 encoding ကို ကိုယ်စားပြုသည့် escape sequence တစ်ခု၊ နှစ်ခု၊ သုံးခု (သို့) လေးခုဖြင့် အစားထိုးခြင်းအားဖြင့် Uniform Resource Identifier (URI) တစ်ခုကို encode လုပ်သည် |
| [`encodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) | Character အချို့၏ instance တစ်ခုစီကို — ထို character ၏ UTF-8 encoding ကို ကိုယ်စားပြုသည့် escape sequence တစ်ခု၊ နှစ်ခု၊ သုံးခု (သို့) လေးခုဖြင့် အစားထိုးခြင်းအားဖြင့် Uniform Resource Identifier (URI) component တစ်ခုကို encode လုပ်သည် |
| [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) | Statement တစ်ခုကို execute လုပ်ရန် (သို့) property တစ်ခုကို ဝင်ရောက်ရန် ကြိုးစားစဉ် ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`EvalError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | Global function `eval()` နှင့် ပတ်သက်၍ ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Float32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) | 32-bit floating point numbers ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Float64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) | 64-bit floating point numbers ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | Function တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Infinity`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | သင်္ချာဆိုင်ရာ Infinity တန်ဖိုးကို ကိုယ်စားပြုသည် |
| [`Int8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) | 8-bit signed integers (အနုတ်လက္ခဏာပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) | 16-bit signed integers (အနုတ်လက္ခဏာပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Int32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) | 32-bit signed integers (အနုတ်လက္ခဏာပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) | Internationalization (နိုင်ငံတကာသုံး စံပြုခြင်း) နှင့် localization ဆိုင်ရာ လုပ်ဆောင်ချက်များသို့ ဝင်ရောက်ခွင့် ပေးသည် |
| [`isFinite`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/isFinite) | Value တစ်ခုသည် finite number (အဆုံးရှိသော ကိန်း) ဟုတ်မဟုတ် ဆုံးဖြတ်သည် |
| [`isNaN`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/isNaN) | Value တစ်ခုသည် `NaN` ဟုတ်မဟုတ် ဆုံးဖြတ်သည် |
| [`JSON`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON) | JavaScript values များကို JSON format သို့ ပြောင်းလဲရန်နှင့် JSON format မှ ပြန်ပြောင်းရန် လုပ်ဆောင်ချက်များ ပေးသည် |
| [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) | Value တစ်ခုစီ တစ်ကြိမ်တည်းသာ ပါဝင်နိုင်သည့် values အစုတစ်ခုကို ကိုယ်စားပြုသည် |
| [`Math`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math) | သင်္ချာ functions နှင့် constants များသို့ ဝင်ရောက်ခွင့် ပေးသည် |
| [`Number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | ဂဏန်းတန်ဖိုး (numeric value) တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Object`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | JavaScript objects အားလုံး၏ အခြေခံဖြစ်သော object ကို ကိုယ်စားပြုသည် |
| [`parseFloat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) | String argument တစ်ခုကို parse လုပ်ပြီး floating point number တစ်ခုကို ပြန်ပေးသည် |
| [`parseInt`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/parseInt) | String argument တစ်ခုကို parse လုပ်ပြီး သတ်မှတ်ထားသော radix အတိုင်း integer တစ်ခုကို ပြန်ပေးသည် |
| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Asynchronous operation တစ်ခု၏ နောက်ဆုံး ပြီးစီးမှု (သို့) မအောင်မြင်မှု နှင့် ၎င်း၏ ရလဒ်တန်ဖိုးကို ကိုယ်စားပြုသည် |
| [`Proxy`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy) | အခြေခံ operations များ (ဥပမာ — property lookup, assignment, enumeration, function invocation စသည်) အတွက် custom behavior သတ်မှတ်ရန် သုံးသည့် object တစ်ခုကို ကိုယ်စားပြုသည် |
| [`queueMicrotask`](https://developer.mozilla.org/docs/Web/API/queueMicrotask) | Execute လုပ်ရန် microtask တစ်ခုကို queue တွင် ထည့်သည် |
| [`RangeError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | Value တစ်ခုသည် ခွင့်ပြုထားသော values အစု (သို့) အကွာအဝေး အတွင်း မရှိသောအခါ ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`ReferenceError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | မရှိသော variable တစ်ခုကို ရည်ညွှန်းသည့်အခါ ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Reflect`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect) | Intercept လုပ်နိုင်သော JavaScript operations များအတွက် methods များ ပေးသည် |
| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | Character ပေါင်းစပ်မှုများကို match လုပ်နိုင်စေသည့် regular expression တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) | Value တစ်ခုစီ တစ်ကြိမ်တည်းသာ ပါဝင်နိုင်သည့် values အစုတစ်ခုကို ကိုယ်စားပြုသည် |
| [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) | Function တစ်ခုကို — ခေါ်ဆိုမှုတစ်ခုစီကြား သတ်မှတ်ထားသော အချိန်ကွာဟချက်ဖြင့် — ထပ်ခါတလဲလဲ ခေါ်သည် |
| [`setTimeout`](https://developer.mozilla.org/docs/Web/API/setTimeout) | သတ်မှတ်ထားသော milliseconds အရေအတွက် ကြာပြီးနောက် function တစ်ခုကို ခေါ်သည် (သို့) expression တစ်ခုကို evaluate လုပ်သည် |
| [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | ယေဘုယျသဘောရှိပြီး အလျား သတ်မှတ်ထားသော (fixed-length) raw binary data buffer တစ်ခုကို ကိုယ်စားပြုသည် |
| [`String`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Character များ၏ အစဉ်တစ်ခုကို ကိုယ်စားပြုသည် |
| [`structuredClone`](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) | Value တစ်ခု၏ deep copy (နက်ရှိုင်းစွာ မိတ္တူပွားခြင်း) တစ်ခုကို ဖန်တီးသည် |
| [`Symbol`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol) | Object property တစ်ခု၏ key အဖြစ် သုံးသည့် — ထူးခြားပြီး မပြောင်းလဲနိုင်သော (unique and immutable) data type တစ်ခုကို ကိုယ်စားပြုသည် |
| [`SyntaxError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | Syntax အရ မမှန်ကန်သော code ကို interpret လုပ်ရန် ကြိုးစားစဉ် ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`TypeError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | Value တစ်ခုသည် မျှော်လင့်ထားသော type မဟုတ်သောအခါ ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | 8-bit unsigned integers (အနုတ်လက္ခဏာမပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Uint8ClampedArray`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) | 0–255 အတွင်း ကန့်သတ်ထားသော (clamped) 8-bit unsigned integers ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) | 32-bit unsigned integers (အနုတ်လက္ခဏာမပါ ကိန်းပြည့်များ) ၏ typed array တစ်ခုကို ကိုယ်စားပြုသည် |
| [`URIError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/URIError) | Global URI handling function တစ်ခုကို မှားယွင်းသော နည်းလမ်းဖြင့် သုံးခဲ့သည့်အခါ ဖြစ်ပွားသော error တစ်ခုကို ကိုယ်စားပြုသည် |
| [`URL`](https://developer.mozilla.org/docs/Web/API/URL) | Object URLs များ ဖန်တီးရန် သုံးသည့် static methods များ ပါဝင်သော object တစ်ခုကို ကိုယ်စားပြုသည် |
| [`URLPattern`](https://developer.mozilla.org/docs/Web/API/URLPattern) | URL pattern တစ်ခုကို ကိုယ်စားပြုသည် |
| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Key/value အတွဲများ၏ အစုတစ်ခုကို ကိုယ်စားပြုသည် |
| [`WeakMap`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) | Keys များကို weakly referenced ပြုထားသည့် key/value အတွဲများ၏ အစုတစ်ခုကို ကိုယ်စားပြုသည် |
| [`WeakSet`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) | Object တစ်ခုစီ တစ်ကြိမ်တည်းသာ ပါဝင်နိုင်သည့် objects အစုတစ်ခုကို ကိုယ်စားပြုသည် |
| [`WebAssembly`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) | WebAssembly သို့ ဝင်ရောက်ခွင့် ပေးသည် |

### Next.js Specific Polyfills

- [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage)

### Environment Variables

`process.env` ကို သုံးပြီး — `next dev` ရော `next build` မှာပါ [Environment Variables](/docs/nextjs/environment-variables) တွေကို ဝင်ရောက်နိုင်ပါတယ်။

## မထောက်ပံ့ထားသော APIs (Unsupported APIs)

Edge Runtime မှာ အောက်ပါတွေ အပါအဝင် ကန့်သတ်ချက်တချို့ ရှိပါတယ်:

- Native Node.js APIs တွေကို **မထောက်ပံ့ပါဘူး**။ ဥပမာ — filesystem ထဲ ဖတ်တာ ရေးတာ နှစ်ခုလုံး မလုပ်နိုင်ပါဘူး။
- `node_modules` တွေကတော့ — ES Modules အဖြစ် အကောင်အထည်ဖော်ထားပြီး native Node.js APIs တွေ မသုံးထားသရွေ့ _သုံးလို့ ရပါတယ်_။
- `require` ကို တိုက်ရိုက် ခေါ်တာက **မခွင့်ပြုပါဘူး**။ အဲဒီအစား ES Modules တွေကို သုံးပါ။

အောက်ပါ JavaScript language features တွေကတော့ disable လုပ်ထားပြီး — **အလုပ်လုပ်မှာ မဟုတ်ပါဘူး:**

| API                                                                                                                             | Description                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`eval`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/eval) | String အဖြစ် ကိုယ်စားပြုထားသော JavaScript code ကို evaluate လုပ်သည် |
| [`new Function(evalString)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | Argument အဖြစ် ပေးထားသော code ဖြင့် function အသစ်တစ်ခုကို ဖန်တီးသည် |
| [`WebAssembly.compile`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile) | Buffer source တစ်ခုမှ WebAssembly module တစ်ခုကို compile လုပ်သည် |
| [`WebAssembly.instantiate`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) | Buffer source တစ်ခုမှ WebAssembly module တစ်ခုကို compile ပြီး instantiate လုပ်သည် |

ရှားပါးတဲ့ အခြေအနေတွေမှာ — သင့် code ထဲမှာ runtime မှာ _လုံးဝ ရောက်ရှိမှာ မဟုတ်တဲ့_ ဖြစ်ပြီး treeshaking နဲ့လည်း ဖယ်ရှားလို့ မရတဲ့ — dynamic code evaluation statements တချို့ ပါဝင်နေ (သို့) import လုပ်ထားမိနိုင်ပါတယ်။ သင့် Proxy configuration မှာ specific files တွေကို ခွင့်ပြုပေးခြင်းဖြင့် ဒီစစ်ဆေးမှုကို ဖြေလျှော့နိုင်ပါတယ်:

```javascript filename="proxy.ts"
export const config = {
  unstable_allowDynamic: [
    // file တစ်ခုတည်းကို ခွင့်ပြုရန်
    '/lib/utilities.js',
    // function-bind third-party module ထဲက ဘာမဆို ခွင့်ပြုဖို့ glob သုံးရန်
    '**/node_modules/function-bind/**',
  ],
}
```

`unstable_allowDynamic` က [glob](https://github.com/micromatch/micromatch#matching-features) တစ်ခု (သို့) globs တွေရဲ့ array တစ်ခု ဖြစ်ပြီး — specific files တွေအတွက် dynamic code evaluation ကို လျစ်လျူရှုပါတယ်။ ဒီ globs တွေက သင့် application ရဲ့ root folder ကို အခြေခံပြီး သတ်မှတ်တာ ဖြစ်ပါတယ်။

သတိပြုရန်မှာ — ဒီ statements တွေကို Edge ပေါ်မှာ execute လုပ်မိပါက — _throw ဖြစ်ပြီး runtime error တစ်ခု ဖြစ်ပေါ်စေမှာ_ ဖြစ်ပါတယ်။
