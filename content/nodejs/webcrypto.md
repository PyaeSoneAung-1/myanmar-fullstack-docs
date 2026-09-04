---
title: "Web Crypto API"
description: "globalThis.crypto — Web Crypto API စံနှုန်းရဲ့ Node.js implementation (SubtleCrypto, CryptoKey, CryptoKeyPair, KeyObject interop, algorithm parameters အပါအဝင်)"
order: 126
source: "https://nodejs.org/api/webcrypto.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

Node.js က [Web Crypto API][] စံနှုန်းရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

ဒီ module ကို ဝင်ရောက်သုံးဖို့ `globalThis.crypto` (သို့) `require('node:crypto').webcrypto` ကို သုံးပါ။

```js
const { subtle } = globalThis.crypto;

(async function() {

  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const enc = new TextEncoder();
  const message = enc.encode('I love cupcakes');

  const digest = await subtle.sign({
    name: 'HMAC',
  }, key, message);

})();
```

## Web Cryptography API မှာရှိတဲ့ ခေတ်မီ Algorithms များ (Modern Algorithms in the Web Cryptography API)

> Stability: 1.1 - Active development

Node.js က [Modern Algorithms in the Web Cryptography API](https://wicg.github.io/webcrypto-modern-algos/) WICG proposal ထဲက အောက်ပါ feature တွေရဲ့ implementation ကို ပံ့ပိုးပေးပါတယ်:

Algorithms များကတော့:

* `'AES-OCB'`[^openssl30]
* `'Argon2d'`[^openssl32]
* `'Argon2i'`[^openssl32]
* `'Argon2id'`[^openssl32]
* `'ChaCha20-Poly1305'`
* `'cSHAKE128'`
* `'cSHAKE256'`
* `'KMAC128'`[^openssl30]
* `'KMAC256'`[^openssl30]
* `'KT128'`
* `'KT256'`
* `'ML-DSA-44'`[^openssl35]
* `'ML-DSA-65'`[^openssl35]
* `'ML-DSA-87'`[^openssl35]
* `'ML-KEM-512'`[^openssl35]
* `'ML-KEM-768'`[^openssl35]
* `'ML-KEM-1024'`[^openssl35]
* `'SHA3-256'`
* `'SHA3-384'`
* `'SHA3-512'`
* `'TurboSHAKE128'`
* `'TurboSHAKE256'`

Key Formats များကတော့:

* `'raw-public'`
* `'raw-secret'`
* `'raw-seed'`

Methods များကတော့:

* [`subtle.decapsulateBits()`][]
* [`subtle.decapsulateKey()`][]
* [`subtle.encapsulateBits()`][]
* [`subtle.encapsulateKey()`][]
* [`subtle.getPublicKey()`][]
* [`SubtleCrypto.supports()`][]

## Web Cryptography API မှာရှိတဲ့ Secure Curves များ (Secure Curves in the Web Cryptography API)

> Stability: 1.1 - Active development

Node.js က [Secure Curves in the Web Cryptography API](https://wicg.github.io/webcrypto-secure-curves/) WICG proposal ထဲက အောက်ပါ feature တွေရဲ့ implementation ကို ပံ့ပိုးပေးပါတယ်:

Algorithms များကတော့:

* `'Ed448'`
* `'X448'`

## ဥပမာများ (Examples)

### Keys များ ထုတ်လုပ်ခြင်း (Generating keys)

{SubtleCrypto} class ကို symmetric (secret) keys တွေ (သို့) asymmetric key pairs (public key နဲ့ private key) တွေ ထုတ်လုပ်ဖို့ သုံးနိုင်ပါတယ်။

#### AES သော့များ (AES keys)

```js
const { subtle } = globalThis.crypto;

async function generateAesKey(length = 256) {
  const key = await subtle.generateKey({
    name: 'AES-CBC',
    length,
  }, true, ['encrypt', 'decrypt']);

  return key;
}
```

#### ECDSA သော့တွဲများ (ECDSA key pairs)

```js
const { subtle } = globalThis.crypto;

async function generateEcKey(namedCurve = 'P-521') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'ECDSA',
    namedCurve,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}
```

#### Ed25519/X25519 သော့တွဲများ (Ed25519/X25519 key pairs)

```js
const { subtle } = globalThis.crypto;

async function generateEd25519Key() {
  return subtle.generateKey({
    name: 'Ed25519',
  }, true, ['sign', 'verify']);
}

async function generateX25519Key() {
  return subtle.generateKey({
    name: 'X25519',
  }, true, ['deriveKey']);
}
```

#### HMAC သော့များ (HMAC keys)

```js
const { subtle } = globalThis.crypto;

async function generateHmacKey(hash = 'SHA-256') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}
```

#### RSA သော့တွဲများ (RSA key pairs)

```js
const { subtle } = globalThis.crypto;
const publicExponent = new Uint8Array([1, 0, 1]);

async function generateRsaKey(modulusLength = 2048, hash = 'SHA-256') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength,
    publicExponent,
    hash,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}
```

### ကုဒ်သွင်းခြင်းနှင့် ကုဒ်ဖြေခြင်း (Encryption and decryption)

```js
const crypto = globalThis.crypto;

async function aesEncrypt(plaintext) {
  const ec = new TextEncoder();
  const key = await generateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = await crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv,
  }, key, ec.encode(plaintext));

  return {
    key,
    iv,
    ciphertext,
  };
}

async function aesDecrypt(ciphertext, key, iv) {
  const dec = new TextDecoder();
  const plaintext = await crypto.subtle.decrypt({
    name: 'AES-CBC',
    iv,
  }, key, ciphertext);

  return dec.decode(plaintext);
}
```

### Keys များ export လုပ်ခြင်းနှင့် import လုပ်ခြင်း (Exporting and importing keys)

```js
const { subtle } = globalThis.crypto;

async function generateAndExportHmacKey(format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return subtle.exportKey(format, key);
}

async function importHmacKey(keyData, format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.importKey(format, keyData, {
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}
```

### Keys များ wrap လုပ်ခြင်းနှင့် unwrap လုပ်ခြင်း (Wrapping and unwrapping keys)

```js
const { subtle } = globalThis.crypto;

async function generateAndWrapHmacKey(format = 'jwk', hash = 'SHA-512') {
  const [
    key,
    wrappingKey,
  ] = await Promise.all([
    subtle.generateKey({
      name: 'HMAC', hash,
    }, true, ['sign', 'verify']),
    subtle.generateKey({
      name: 'AES-KW',
      length: 256,
    }, true, ['wrapKey', 'unwrapKey']),
  ]);

  const wrappedKey = await subtle.wrapKey(format, key, wrappingKey, 'AES-KW');

  return { wrappedKey, wrappingKey };
}

async function unwrapHmacKey(
  wrappedKey,
  wrappingKey,
  format = 'jwk',
  hash = 'SHA-512') {

  const key = await subtle.unwrapKey(
    format,
    wrappedKey,
    wrappingKey,
    'AES-KW',
    { name: 'HMAC', hash },
    true,
    ['sign', 'verify']);

  return key;
}
```

### လက်မှတ်ထိုးခြင်းနှင့် စိစစ်ခြင်း (Sign and verify)

```js
const { subtle } = globalThis.crypto;

async function sign(key, data) {
  const ec = new TextEncoder();
  const signature =
    await subtle.sign('RSASSA-PKCS1-v1_5', key, ec.encode(data));
  return signature;
}

async function verify(key, signature, data) {
  const ec = new TextEncoder();
  const verified =
    await subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature,
      ec.encode(data));
  return verified;
}
```

### Bits နှင့် keys များကို ဆင်းသက်ထုတ်ယူခြင်း (Deriving bits and keys)

```js
const { subtle } = globalThis.crypto;

async function pbkdf2(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveBits']);
  const bits = await subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, key, length);
  return bits;
}

async function pbkdf2Key(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']);
  const key = await subtle.deriveKey({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, keyMaterial, {
    name: 'AES-GCM',
    length,
  }, true, ['encrypt', 'decrypt']);
  return key;
}
```

### Digest တွက်ချက်ခြင်း (Digest)

```js
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}
```

### Runtime မှာ algorithm ပံ့ပိုးမှု ရှိမရှိ စစ်ဆေးခြင်း (Checking for runtime algorithm support)

[`SubtleCrypto.supports()`][] က Web Crypto API မှာ feature detection (လုပ်ဆောင်ချက် ရှိမရှိ စစ်ဆေးခြင်း) ကို ခွင့်ပြုပေးပါတယ် — ပေးထားတဲ့ algorithm identifier (parameter တွေ အပါအဝင်) က ပေးထားတဲ့ operation အတွက် support လုပ်ထားလား ဆိုတာ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

ဒီဥပမာက — ရနိုင်မယ်ဆိုရင် Argon2 ကို သုံးပြီး၊ မဟုတ်ရင် PBKDF2 ကို သုံးကာ password တစ်ခုကနေ key တစ်ခုကို ဆင်းသက် ထုတ်ယူပြီး — ရနိုင်မယ်ဆိုရင် AES-OCB နဲ့၊ မဟုတ်ရင် AES-GCM နဲ့ text တစ်ချို့ကို ကုဒ်သွင်း/ကုဒ်ဖြေ လုပ်ပြပါတယ်။

```mjs
const { SubtleCrypto, crypto } = globalThis;

const password = 'correct horse battery staple';
const derivationAlg =
  SubtleCrypto.supports?.('importKey', 'Argon2id') ?
    'Argon2id' :
    'PBKDF2';
const encryptionAlg =
  SubtleCrypto.supports?.('importKey', 'AES-OCB') ?
    'AES-OCB' :
    'AES-GCM';
const passwordKey = await crypto.subtle.importKey(
  derivationAlg === 'Argon2id' ? 'raw-secret' : 'raw',
  new TextEncoder().encode(password),
  derivationAlg,
  false,
  ['deriveKey'],
);
const nonce = crypto.getRandomValues(new Uint8Array(16));
const derivationParams =
  derivationAlg === 'Argon2id' ?
    {
      nonce,
      parallelism: 4,
      memory: 2 ** 21,
      passes: 1,
    } :
    {
      salt: nonce,
      iterations: 100_000,
      hash: 'SHA-256',
    };
const key = await crypto.subtle.deriveKey(
  {
    name: derivationAlg,
    ...derivationParams,
  },
  passwordKey,
  {
    name: encryptionAlg,
    length: 256,
  },
  false,
  ['encrypt', 'decrypt'],
);
const plaintext = 'Hello, world!';
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt(
  { name: encryptionAlg, iv },
  key,
  new TextEncoder().encode(plaintext),
);
const decrypted = new TextDecoder().decode(await crypto.subtle.decrypt(
  { name: encryptionAlg, iv },
  key,
  encrypted,
));
```

## Algorithm ပံ့ပိုးမှု (Algorithm support)

အောက်ပါ section တွေမှာ Node.js Web Crypto API implementation က support လုပ်ထားတဲ့ algorithms တွေနဲ့ — algorithm တစ်ခုချင်းစီအတွက် support လုပ်ထားတဲ့ APIs တွေကို အသေးစိတ် ဖော်ပြထားပါတယ်:

### Key စီမံခန့်ခွဲမှု APIs (Key Management APIs)

* [`subtle.generateKey()`][], [`subtle.exportKey()`][], နဲ့ [`subtle.importKey()`][] တွေက `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-KW'`, `'AES-OCB'`, `'ChaCha20-Poly1305'`[^modern-algos], `'HMAC'`, `'KMAC128'`[^modern-algos], နဲ့ `'KMAC256'`[^modern-algos] တွေကို support လုပ်ပါတယ်။
* [`subtle.importKey()`][] က `'Argon2d'`, `'Argon2i'`, `'Argon2id'`, `'HKDF'`, နဲ့ `'PBKDF2'` တွေကို support လုပ်ပါတယ်။
* [`subtle.generateKey()`][], [`subtle.exportKey()`][], [`subtle.importKey()`][], နဲ့ [`subtle.getPublicKey()`][] တွေက `'ECDH'`, `'ECDSA'`, `'Ed25519'`, `'Ed448'`[^secure-curves], `'ML-DSA-44'`[^modern-algos], `'ML-DSA-65'`[^modern-algos], `'ML-DSA-87'`[^modern-algos], `'ML-KEM-512'`[^modern-algos], `'ML-KEM-768'`[^modern-algos], `'ML-KEM-1024'`[^modern-algos], `'RSA-OAEP'`, `'RSA-PSS'`, `'RSASSA-PKCS1-v1_5'`, `'X25519'`, နဲ့ `'X448'`[^secure-curves] တွေကို support လုပ်ပါတယ်။

### Crypto လုပ်ဆောင်ချက် APIs (Crypto Operation APIs)

* [`subtle.encrypt()`][] နဲ့ [`subtle.decrypt()`][] တွေက `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-OCB'`, `'ChaCha20-Poly1305'`[^modern-algos], နဲ့ `'RSA-OAEP'` တွေကို support လုပ်ပါတယ်။
* [`subtle.sign()`][] နဲ့ [`subtle.verify()`][] တွေက `'ECDSA'`, `'Ed25519'`, `'Ed448'`[^secure-curves], `'HMAC'`, `'KMAC128'`[^modern-algos], `'KMAC256'`[^modern-algos], `'ML-DSA-44'`[^modern-algos], `'ML-DSA-65'`[^modern-algos], `'ML-DSA-87'`[^modern-algos], `'RSA-PSS'`, နဲ့ `'RSASSA-PKCS1-v1_5'` တွေကို support လုပ်ပါတယ်။
* [`subtle.deriveBits()`][] နဲ့ [`subtle.deriveKey()`][] တွေက `'Argon2d'`, `'Argon2i'`, `'Argon2id'`, `'ECDH'`, `'HKDF'`, `'PBKDF2'`, `'X25519'`, နဲ့ `'X448'`[^secure-curves] တွေကို support လုပ်ပါတယ်။
* [`subtle.wrapKey()`][] နဲ့ [`subtle.unwrapKey()`][] တွေက `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-KW'`, `'AES-OCB'`, `'ChaCha20-Poly1305'`[^modern-algos], နဲ့ `'RSA-OAEP'` တွေကို support လုပ်ပါတယ်။
* [`subtle.encapsulateBits()`][], [`subtle.decapsulateBits()`][], [`subtle.encapsulateKey()`][], နဲ့ [`subtle.decapsulateKey()`][] တွေက `'ML-KEM-512'`[^modern-algos], `'ML-KEM-768'`[^modern-algos], နဲ့ `'ML-KEM-1024'`[^modern-algos] တွေကို support လုပ်ပါတယ်။
* [`subtle.digest()`][] က `'cSHAKE128'`[^modern-algos], `'cSHAKE256'`[^modern-algos], `'KT128'`[^modern-algos], `'KT256'`[^modern-algos], `'SHA-1'`, `'SHA-256'`, `'SHA-384'`, `'SHA-512'`, `'SHA3-256'`[^modern-algos], `'SHA3-384'`[^modern-algos], `'SHA3-512'`[^modern-algos], `'TurboSHAKE128'`[^modern-algos], နဲ့ `'TurboSHAKE256'`[^modern-algos] တွေကို support လုပ်ပါတယ်။

### Key formats များ (Key Formats)

အောက်ပါ စာရင်းက [`subtle.importKey()`][] နဲ့ [`subtle.exportKey()`][] တွေက support လုပ်ထားတဲ့ formats တွေကို ဖော်ပြပါတယ်။

* **`'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-KW'`, နဲ့ `'HMAC'`** တွေကို `'jwk'`, `'raw'`, နဲ့ `'raw-secret'`[^modern-algos] formats တွေနဲ့ import လည်း export လည်း လုပ်နိုင်ပါတယ်။
* **`'AES-OCB'`[^modern-algos], `'ChaCha20-Poly1305'`[^modern-algos], `'KMAC128'`[^modern-algos], နဲ့ `'KMAC256'`[^modern-algos]** တွေကို `'jwk'` နဲ့ `'raw-secret'`[^modern-algos] formats တွေနဲ့ import လည်း export လည်း လုပ်နိုင်ပါတယ်။
* **`'Argon2d'`[^modern-algos], `'Argon2i'`[^modern-algos], နဲ့ `'Argon2id'`[^modern-algos]** တွေကို `'raw-secret'`[^modern-algos] format နဲ့ import လုပ်နိုင်ပြီး — export ကတော့ support မလုပ်ပါဘူး။
* **`'ECDH'`, `'ECDSA'`, `'Ed25519'`, `'Ed448'`[^secure-curves], `'X25519'`, နဲ့ `'X448'`[^secure-curves]** တွေကို `'spki'`, `'pkcs8'`, `'jwk'`, `'raw'`, နဲ့ `'raw-public'`[^modern-algos] formats တွေနဲ့ import လည်း export လည်း လုပ်နိုင်ပါတယ်။
* **`'HKDF'` နဲ့ `'PBKDF2'`** တွေကို `'raw'` နဲ့ `'raw-secret'`[^modern-algos] formats တွေနဲ့ import လုပ်နိုင်ပြီး — export ကတော့ support မလုပ်ပါဘူး။
* **`'ML-DSA-44'`[^modern-algos], `'ML-DSA-65'`[^modern-algos], `'ML-DSA-87'`[^modern-algos], `'ML-KEM-512'`[^modern-algos], `'ML-KEM-768'`[^modern-algos], နဲ့ `'ML-KEM-1024'`[^modern-algos]** တွေကို `'spki'`, `'pkcs8'`, `'jwk'`, `'raw-public'`[^modern-algos], နဲ့ `'raw-seed'`[^modern-algos] formats တွေနဲ့ import လည်း export လည်း လုပ်နိုင်ပါတယ်။
* **`'RSA-OAEP'`, `'RSA-PSS'`, နဲ့ `'RSASSA-PKCS1-v1_5'`** တွေကို `'spki'`, `'pkcs8'`, နဲ့ `'jwk'` formats တွေနဲ့ import လည်း export လည်း လုပ်နိုင်ပါတယ်။

## Class: `Crypto`

`globalThis.crypto` က `Crypto` class ရဲ့ instance တစ်ခုပါ။ `Crypto` က ကျန် crypto API တွေဆီကို ဝင်ရောက်ခွင့် ပေးတဲ့ singleton တစ်ခု ဖြစ်ပါတယ်။

### `crypto.subtle`

* Type: {SubtleCrypto}

`SubtleCrypto` API ကို ဝင်ရောက်သုံးခွင့် ပေးပါတယ်။

### `crypto.getRandomValues(typedArray)`

* `typedArray` {Buffer|TypedArray}
* Returns: {Buffer|TypedArray}

Cryptographically ခိုင်မာတဲ့ random values (ကျပန်းတန်ဖိုးများ) တွေကို ထုတ်ပေးပါတယ်။ ပေးထားတဲ့ `typedArray` ကို random values တွေနဲ့ ဖြည့်ပြီး — `typedArray` ရဲ့ reference ကို ပြန်ပေးပါတယ်။

ပေးထားတဲ့ `typedArray` က {TypedArray} ရဲ့ integer-based instance တစ်ခု ဖြစ်ရပါမယ် — ဆိုလိုတာက `Float32Array` နဲ့ `Float64Array` တွေကိုတော့ လက်မခံပါဘူး။

ပေးထားတဲ့ `typedArray` က 65,536 bytes ထက် ကြီးရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

### `crypto.randomUUID()`

* Returns: {string}

[RFC 4122][] version 4 UUID တစ်ခုကို ကျပန်း ထုတ်ပေးပါတယ်။ UUID ကို cryptographic pseudorandom number generator တစ်ခုနဲ့ ထုတ်လုပ်ပါတယ်။

## Class: `CryptoKey`

### `cryptoKey.algorithm`

* Type: {KeyAlgorithm|RsaHashedKeyAlgorithm|EcKeyAlgorithm|AesKeyAlgorithm|HmacKeyAlgorithm|KmacKeyAlgorithm}

Key ကို သုံးနိုင်မယ့် algorithm အကြောင်း algorithm-specific ဖြစ်တဲ့ ထပ်ဆောင်း parameters တွေနဲ့အတူ အသေးစိတ် ဖော်ပြတဲ့ object တစ်ခုပါ။

Read-only (ဖတ်ရန်သာ) ဖြစ်ပါတယ်။

### `cryptoKey.extractable`

* Type: {boolean}

`true` ဖြစ်တဲ့အခါ {CryptoKey} ကို [`subtle.exportKey()`][] (သို့) [`subtle.wrapKey()`][] တစ်ခုခုနဲ့ extract လုပ်နိုင်ပါတယ်။

Read-only (ဖတ်ရန်သာ) ဖြစ်ပါတယ်။

### `cryptoKey.type`

* Type: {string} `'secret'`, `'private'`, (သို့) `'public'` တို့ထဲက တစ်ခု ဖြစ်ပါတယ်။

Key က symmetric (`'secret'`) လား asymmetric (`'private'` (သို့) `'public'`) လား ခွဲခြားဖော်ပြတဲ့ string တစ်ခုပါ။

### `cryptoKey.usages`

* Type: {string\[]}

Key ကို ဘယ် operations တွေအတွက် သုံးနိုင်လဲ ဖော်ပြတဲ့ strings တွေရဲ့ array တစ်ခုပါ။

ဖြစ်နိုင်တဲ့ usages တွေကတော့:

* `'encrypt'` - key ကို [`subtle.encrypt()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'decrypt'` - key ကို [`subtle.decrypt()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'sign'` - key ကို [`subtle.sign()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'verify'` - key ကို [`subtle.verify()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'deriveKey'` - key ကို [`subtle.deriveKey()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'deriveBits'` - key ကို [`subtle.deriveBits()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'encapsulateBits'` - key ကို [`subtle.encapsulateBits()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'decapsulateBits'` - key ကို [`subtle.decapsulateBits()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'encapsulateKey'` - key ကို [`subtle.encapsulateKey()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'decapsulateKey'` - key ကို [`subtle.decapsulateKey()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'wrapKey'` - key ကို [`subtle.wrapKey()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်
* `'unwrapKey'` - key ကို [`subtle.unwrapKey()`][] နဲ့ သုံးနိုင်အောင် ဖွင့်ပေးပါတယ်

တရားဝင် key usages တွေက key algorithm (ခွဲခြားသတ်မှတ်ထားတဲ့ `cryptokey.algorithm.name`) အပေါ် မူတည်ပါတယ်။ Key algorithm တစ်ခုချင်းစီအတွက် support လုပ်ထားတဲ့ operations တွေကို [Crypto operation APIs][] မှာ ကြည့်ပါ။

## Class: `CryptoKeyPair`

`CryptoKeyPair` က asymmetric key pair တစ်ခုကို ကိုယ်စားပြုတဲ့ `publicKey` နဲ့ `privateKey` properties တွေ ပါဝင်တဲ့ ရိုးရှင်းတဲ့ dictionary object တစ်ခုပါ။

### `cryptoKeyPair.privateKey`

* Type: {CryptoKey} `type` က `'private'` ဖြစ်မယ့် {CryptoKey} တစ်ခုပါ။

### `cryptoKeyPair.publicKey`

* Type: {CryptoKey} `type` က `'public'` ဖြစ်မယ့် {CryptoKey} တစ်ခုပါ။

## Class: `SubtleCrypto`

### Static method: `SubtleCrypto.supports(operation, algorithm[, lengthOrAdditionalAlgorithm])`

> Stability: 1.1 - Active development

* `operation` {string} "encrypt", "decrypt", "sign", "verify", "digest", "generateKey", "deriveKey", "deriveBits", "importKey", "exportKey", "getPublicKey", "wrapKey", "unwrapKey", "encapsulateBits", "encapsulateKey", "decapsulateBits", or "decapsulateKey"
* `algorithm` {string|Algorithm}
* `lengthOrAdditionalAlgorithm` {null|number|string|Algorithm|undefined} Operation ပေါ် မူတည်ပြီး — ဒါက လျစ်လျူရှုခံရတာ ဖြစ်နိုင်သလို၊ operation က "deriveBits" ဆိုရင် length argument ရဲ့ တန်ဖိုး၊ operation က "deriveKey" ဆိုရင် ဆင်းသက်ထုတ်ယူမယ့် key ရဲ့ algorithm၊ operation က "wrapKey" ဆိုရင် wrap မလုပ်ခင် export လုပ်မယ့် key ရဲ့ algorithm၊ operation က "unwrapKey" ဆိုရင် unwrap လုပ်ပြီးနောက် import လုပ်မယ့် key ရဲ့ algorithm၊ (သို့) operation က "encapsulateKey" (သို့) "decapsulateKey" ဆိုရင် key တစ်ခုကို en/decapsulate လုပ်ပြီးနောက် import လုပ်မယ့် key ရဲ့ algorithm လည်း ဖြစ်နိုင်ပါတယ်။ **Default:** `null` — operation က "deriveBits" ဖြစ်တဲ့အခါ၊ ကျန်တဲ့ ကိစ္စတွေမှာတော့ `undefined`။
* Returns: {boolean} Implementation က ပေးထားတဲ့ operation ကို support လုပ်လား မလုပ်လား ဆိုတာ ဖော်ပြတဲ့ တန်ဖိုးပါ။

Web Crypto API မှာ feature detection (လုပ်ဆောင်ချက် ရှိမရှိ စစ်ဆေးခြင်း) ကို လုပ်ဆောင်နိုင်စေပါတယ် — ပေးထားတဲ့ algorithm identifier (parameter တွေ အပါအဝင်) က ပေးထားတဲ့ operation အတွက် support လုပ်ထားလား ဆိုတာ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

ဒီ method ရဲ့ သုံးစွဲမှု ဥပမာတစ်ခုအတွက် [Checking for runtime algorithm support][] ကို ကြည့်ပါ။

### `subtle.decapsulateBits(decapsulationAlgorithm, decapsulationKey, ciphertext)`

> Stability: 1.1 - Active development

* `decapsulationAlgorithm` {string|Algorithm}
* `decapsulationKey` {CryptoKey}
* `ciphertext` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Message လက်ခံသူ (recipient) တစ်ယောက်က သူတို့ရဲ့ asymmetric private key ကို သုံးပြီး "encapsulated key" (ciphertext) တစ်ခုကို ကုဒ်ဖြေပါတယ် — ဒါကနေတစ်ဆင့် message တစ်ခုကို ကုဒ်ဖြေဖို့ သုံးမယ့် ယာယီ symmetric key (ကို {ArrayBuffer} အနေနဲ့ ကိုယ်စားပြုပါတယ်) ကို ပြန်လည် ရရှိပါတယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]

### `subtle.decapsulateKey(decapsulationAlgorithm, decapsulationKey, ciphertext, sharedKeyAlgorithm, extractable, keyUsages)`

> Stability: 1.1 - Active development

* `decapsulationAlgorithm` {string|Algorithm}
* `decapsulationKey` {CryptoKey}
* `ciphertext` {ArrayBuffer|TypedArray|DataView|Buffer}
* `sharedKeyAlgorithm` {string|Algorithm|HmacImportParams|AesDerivedKeyParams|KmacImportParams}
* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Message လက်ခံသူ (recipient) တစ်ယောက်က သူတို့ရဲ့ asymmetric private key ကို သုံးပြီး "encapsulated key" (ciphertext) တစ်ခုကို ကုဒ်ဖြေပါတယ် — ဒါကနေတစ်ဆင့် message တစ်ခုကို ကုဒ်ဖြေဖို့ သုံးမယ့် ယာယီ symmetric key (ကို {CryptoKey} အနေနဲ့ ကိုယ်စားပြုပါတယ်) ကို ပြန်လည် ရရှိပါတယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]

### `subtle.decrypt(algorithm, key, data)`

* `algorithm` {RsaOaepParams|AesCtrParams|AesCbcParams|AeadParams}
* `key` {CryptoKey}
* `data` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ သတ်မှတ်ထားတဲ့ method နဲ့ parameters တွေကို သုံးပြီး `key` ကနေ ပံ့ပိုးပေးတဲ့ keying material နဲ့အတူ — ဒီ method က ပေးထားတဲ့ `data` ကို ကုဒ်ဖြေဖို့ ကြိုးစားပါတယ်။ အောင်မြင်ရင် plaintext ရလဒ် ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'RSA-OAEP'`

### `subtle.deriveBits(algorithm, baseKey[, length])`

* `algorithm` {EcdhKeyDeriveParams|HkdfParams|Pbkdf2Params|Argon2Params}
* `baseKey` {CryptoKey}
* `length` {number|null} **Default:** `null`
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ သတ်မှတ်ထားတဲ့ method နဲ့ parameters တွေကို သုံးပြီး `baseKey` ကနေ ပံ့ပိုးပေးတဲ့ keying material နဲ့အတူ — ဒီ method က `length` bits တွေကို ထုတ်လုပ်ဖို့ ကြိုးစားပါတယ်။

`length` ကို မပေးထားဘူး (သို့) `null` ဆိုရင် — ပေးထားတဲ့ algorithm အတွက် အများဆုံး bit အရေအတွက်ကို ထုတ်ပေးပါတယ်။ ဒါက `'ECDH'`, `'X25519'`, နဲ့ `'X448'`[^secure-curves] algorithms တွေအတွက်တော့ ခွင့်ပြုထားပြီး — တခြား algorithms တွေအတွက်တော့ `length` က number တစ်ခု ဖြစ်ဖို့ လိုအပ်ပါတယ်။

အောင်မြင်ရင် ထုတ်လုပ်ထားတဲ့ ဒေတာ ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'Argon2d'`[^modern-algos]
* `'Argon2i'`[^modern-algos]
* `'Argon2id'`[^modern-algos]
* `'ECDH'`
* `'HKDF'`
* `'PBKDF2'`
* `'X25519'`
* `'X448'`[^secure-curves]

### `subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages)`

* `algorithm` {EcdhKeyDeriveParams|HkdfParams|Pbkdf2Params|Argon2Params}
* `baseKey` {CryptoKey}
* `derivedKeyType` {string|Algorithm|HmacImportParams|AesDerivedKeyParams|KmacImportParams}
* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ သတ်မှတ်ထားတဲ့ method နဲ့ parameters တွေ၊ `baseKey` ကနေ ပံ့ပိုးပေးတဲ့ keying material တွေကို သုံးပြီး — `derivedKeyType` ထဲက method နဲ့ parameters တွေကို အခြေခံတဲ့ {CryptoKey} အသစ်တစ်ခုကို ထုတ်လုပ်ဖို့ ဒီ method က ကြိုးစားပါတယ်။

ဒီ method ကို ခေါ်တာက — raw keying material ထုတ်လုပ်ဖို့ [`subtle.deriveBits()`][] ကို ခေါ်ပြီး ရလာတဲ့ ရလဒ်ကို `derivedKeyType`, `extractable`, နဲ့ `keyUsages` parameters တွေကို input အနေနဲ့ သုံးကာ [`subtle.importKey()`][] method ထဲကို ပေးပို့တာနဲ့ ညီမျှပါတယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'Argon2d'`[^modern-algos]
* `'Argon2i'`[^modern-algos]
* `'Argon2id'`[^modern-algos]
* `'ECDH'`
* `'HKDF'`
* `'PBKDF2'`
* `'X25519'`
* `'X448'`[^secure-curves]

### `subtle.digest(algorithm, data)`

* `algorithm` {string|Algorithm|CShakeParams|TurboShakeParams|KangarooTwelveParams}
* `data` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ method ကို သုံးပြီး — `data` ရဲ့ digest တစ်ခုကို ထုတ်လုပ်ဖို့ ဒီ method က ကြိုးစားပါတယ်။ အောင်မြင်ရင် တွက်ချက်ပြီးသား digest ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

`algorithm` ကို {string} အနေနဲ့ ပေးထားရင် အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'cSHAKE128'`[^modern-algos]
* `'cSHAKE256'`[^modern-algos]
* `'KT128'`[^modern-algos]
* `'KT256'`[^modern-algos]
* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]
* `'TurboSHAKE128'`[^modern-algos]
* `'TurboSHAKE256'`[^modern-algos]

`algorithm` ကို {Object} အနေနဲ့ ပေးထားရင် — အထက်ပါ တန်ဖိုးတွေထဲက တစ်ခုကို တန်ဖိုးအဖြစ် ထားတဲ့ `name` property တစ်ခု ရှိရပါမယ်။

### `subtle.encapsulateBits(encapsulationAlgorithm, encapsulationKey)`

> Stability: 1.1 - Active development

* `encapsulationAlgorithm` {string|Algorithm}
* `encapsulationKey` {CryptoKey}
* Returns: {Promise} အောင်မြင်ရင် {EncapsulatedBits} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Message လက်ခံသူရဲ့ asymmetric public key ကို သုံးပြီး ယာယီ symmetric key တစ်ခုကို ကုဒ်သွင်းပါတယ်။ ဒီကုဒ်သွင်းပြီးသား key က {EncapsulatedBits} အနေနဲ့ ကိုယ်စားပြုတဲ့ "encapsulated key" ပါ။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]

### `subtle.encapsulateKey(encapsulationAlgorithm, encapsulationKey, sharedKeyAlgorithm, extractable, keyUsages)`

> Stability: 1.1 - Active development

* `encapsulationAlgorithm` {string|Algorithm}
* `encapsulationKey` {CryptoKey}
* `sharedKeyAlgorithm` {string|Algorithm|HmacImportParams|AesDerivedKeyParams|KmacImportParams}
* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {EncapsulatedKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Message လက်ခံသူရဲ့ asymmetric public key ကို သုံးပြီး ယာယီ symmetric key တစ်ခုကို ကုဒ်သွင်းပါတယ်။ ဒီကုဒ်သွင်းပြီးသား key က {EncapsulatedKey} အနေနဲ့ ကိုယ်စားပြုတဲ့ "encapsulated key" ပါ။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]

### `subtle.encrypt(algorithm, key, data)`

* `algorithm` {RsaOaepParams|AesCtrParams|AesCbcParams|AeadParams}
* `key` {CryptoKey}
* `data` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ သတ်မှတ်ထားတဲ့ method နဲ့ parameters တွေကို သုံးပြီး `key` ကနေ ပံ့ပိုးပေးတဲ့ keying material နဲ့အတူ — ဒီ method က `data` ကို ကုဒ်သွင်းဖို့ ကြိုးစားပါတယ်။ အောင်မြင်ရင် ကုဒ်သွင်းပြီးသား ရလဒ် ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'RSA-OAEP'`

### `subtle.exportKey(format, key)`

* `format` {string} `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[^modern-algos],
  `'raw-public'`[^modern-algos], (သို့) `'raw-seed'`[^modern-algos] တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* `key` {CryptoKey}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer|Object} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

ပေးထားတဲ့ key ကို — support လုပ်ထားမယ်ဆိုရင် — သတ်မှတ်ထားတဲ့ format အနေနဲ့ export လုပ်ပါတယ်။

{CryptoKey} က extractable မဟုတ်ဘူးဆိုရင် promise က reject ဖြစ်ပါလိမ့်မယ်။

`format` က `'pkcs8'` (သို့) `'spki'` ဖြစ်ပြီး export အောင်မြင်တဲ့အခါ — ပြန်ပေးတဲ့ promise က export လုပ်ထားတဲ့ key data ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ resolve ဖြစ်ပါလိမ့်မယ်။

`format` က `'jwk'` ဖြစ်ပြီး export အောင်မြင်တဲ့အခါ — [JSON Web Key][] specification နဲ့ ကိုက်ညီတဲ့ JavaScript object တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

Algorithm တစ်ခုချင်းစီအတွက် support လုပ်ထားတဲ့ formats တွေကို [Key formats][] မှာ ကြည့်ပါ။

### `subtle.getPublicKey(key, keyUsages)`

> Stability: 1.1 - Active development

* `key` {CryptoKey} သက်ဆိုင်ရာ public key ကို ဆင်းသက်ထုတ်ယူမယ့် private key တစ်ခုပါ။
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

ပေးထားတဲ့ private key တစ်ခုကနေ public key ကို ဆင်းသက် ထုတ်ယူပါတယ်။

### `subtle.generateKey(algorithm, extractable, keyUsages)`

* `algorithm` {string|Algorithm|RsaHashedKeyGenParams|EcKeyGenParams|HmacKeyGenParams|AesKeyGenParams|KmacKeyGenParams}

* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey|CryptoKeyPair} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ ပံ့ပိုးပေးထားတဲ့ parameters တွေကို သုံးပြီး — ဒီ method က keying material အသစ်တွေကို ထုတ်လုပ်ဖို့ ကြိုးစားပါတယ်။ သုံးတဲ့ algorithm ပေါ် မူတည်ပြီး {CryptoKey} တစ်ခုတည်း (သို့) {CryptoKeyPair} တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

{CryptoKeyPair} (public နဲ့ private key) ထုတ်လုပ်ပေးတဲ့ algorithms တွေကတော့:

* `'ECDH'`
* `'ECDSA'`
* `'Ed25519'`
* `'Ed448'`[^secure-curves]
* `'ML-DSA-44'`[^modern-algos]
* `'ML-DSA-65'`[^modern-algos]
* `'ML-DSA-87'`[^modern-algos]
* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]
* `'RSA-OAEP'`
* `'RSA-PSS'`
* `'RSASSA-PKCS1-v1_5'`
* `'X25519'`
* `'X448'`[^secure-curves]

{CryptoKey} (secret key) ထုတ်လုပ်ပေးတဲ့ algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-KW'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'HMAC'`
* `'KMAC128'`[^modern-algos]
* `'KMAC256'`[^modern-algos]

### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)`

* `format` {string} `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[^modern-algos],
  `'raw-public'`[^modern-algos], (သို့) `'raw-seed'`[^modern-algos] တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* `keyData` {ArrayBuffer|TypedArray|DataView|Buffer|Object}

* `algorithm` {string|Algorithm|RsaHashedImportParams|EcKeyImportParams|HmacImportParams|KmacImportParams}

* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

ဒီ method က ပေးထားတဲ့ `keyData` ကို ပေးထားတဲ့ `format` အနေနဲ့ အနက်ဖွင့်ပြီး — `algorithm`, `extractable`, နဲ့ `keyUsages` arguments တွေကို သုံးကာ {CryptoKey} instance တစ်ခု ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Import အောင်မြင်ရင် key material ရဲ့ {CryptoKey} ကိုယ်စားပြုမှု တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

KDF algorithm keys တွေကို import လုပ်ရင် `extractable` က `false` ဖြစ်ရပါမယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms နဲ့ formats တွေကို [Key formats][] မှာ ကြည့်ပါ။

### `subtle.sign(algorithm, key, data)`

* `algorithm` {string|Algorithm|RsaPssParams|EcdsaParams|ContextParams|KmacParams}
* `key` {CryptoKey}
* `data` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ ပေးထားတဲ့ method နဲ့ parameters တွေကို သုံးပြီး `key` ကနေ ပံ့ပိုးပေးတဲ့ keying material နဲ့အတူ — ဒီ method က `data` ရဲ့ cryptographic signature တစ်ခုကို ထုတ်လုပ်ဖို့ ကြိုးစားပါတယ်။ အောင်မြင်ရင် ထုတ်လုပ်ထားတဲ့ signature ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ECDSA'`
* `'Ed25519'`
* `'Ed448'`[^secure-curves]
* `'HMAC'`
* `'KMAC128'`[^modern-algos]
* `'KMAC256'`[^modern-algos]
* `'ML-DSA-44'`[^modern-algos]
* `'ML-DSA-65'`[^modern-algos]
* `'ML-DSA-87'`[^modern-algos]
* `'RSA-PSS'`
* `'RSASSA-PKCS1-v1_5'`

### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages)`

* `format` {string} `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[^modern-algos],
  `'raw-public'`[^modern-algos], (သို့) `'raw-seed'`[^modern-algos] တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* `wrappedKey` {ArrayBuffer|TypedArray|DataView|Buffer}
* `unwrappingKey` {CryptoKey}

* `unwrapAlgorithm` {string|Algorithm|RsaOaepParams|AesCtrParams|AesCbcParams|AeadParams}
* `unwrappedKeyAlgorithm` {string|Algorithm|RsaHashedImportParams|EcKeyImportParams|HmacImportParams|KmacImportParams}

* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {Promise} အောင်မြင်ရင် {CryptoKey} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Cryptography (လျှို့ဝှက်ကုဒ်ပညာ) မှာ "key တစ်ခုကို wrap လုပ်ခြင်း" ဆိုတာက keying material ကို export လုပ်ပြီး ကုဒ်သွင်းခြင်းကို ရည်ညွှန်းပါတယ်။ ဒီ method က wrap လုပ်ထားတဲ့ key တစ်ခုကို ကုဒ်ဖြေပြီး {CryptoKey} instance တစ်ခု ဖန်တီးဖို့ ကြိုးစားပါတယ်။ ဒါက — ကုဒ်သွင်းထားတဲ့ key data ပေါ်မှာ [`subtle.decrypt()`][] ကို အရင်ခေါ်ပြီး (`wrappedKey`, `unwrapAlgorithm`, နဲ့ `unwrappingKey` arguments တွေကို input အနေနဲ့ သုံးပါတယ်) ရလာတဲ့ ရလဒ်တွေကို `unwrappedKeyAlgorithm`, `extractable`, နဲ့ `keyUsages` arguments တွေကို input အနေနဲ့ သုံးကာ [`subtle.importKey()`][] method ဆီကို ပေးပို့တာနဲ့ ညီမျှပါတယ်။ အောင်မြင်ရင် {CryptoKey} object တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ wrapping algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-KW'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'RSA-OAEP'`

Unwrap လုပ်ပြီးသား key တွေအတွက် support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-KW'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'ECDH'`
* `'ECDSA'`
* `'Ed25519'`
* `'Ed448'`[^secure-curves]
* `'HMAC'`
* `'KMAC128'`[^modern-algos]
* `'KMAC256'`[^modern-algos]
* `'ML-DSA-44'`[^modern-algos]
* `'ML-DSA-65'`[^modern-algos]
* `'ML-DSA-87'`[^modern-algos]
* `'ML-KEM-512'`[^modern-algos]
* `'ML-KEM-768'`[^modern-algos]
* `'ML-KEM-1024'`[^modern-algos]
* `'RSA-OAEP'`
* `'RSA-PSS'`
* `'RSASSA-PKCS1-v1_5'`
* `'X25519'`
* `'X448'`[^secure-curves]

### `subtle.verify(algorithm, key, signature, data)`

* `algorithm` {string|Algorithm|RsaPssParams|EcdsaParams|ContextParams|KmacParams}
* `key` {CryptoKey}
* `signature` {ArrayBuffer|TypedArray|DataView|Buffer}
* `data` {ArrayBuffer|TypedArray|DataView|Buffer}
* Returns: {Promise} အောင်မြင်ရင် {boolean} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`algorithm` မှာ ပေးထားတဲ့ method နဲ့ parameters တွေကို သုံးပြီး `key` ကနေ ပံ့ပိုးပေးတဲ့ keying material နဲ့အတူ — ဒီ method က `signature` က `data` ရဲ့ တရားဝင် cryptographic signature ဟုတ်မဟုတ် စစ်ဆေးဖို့ ကြိုးစားပါတယ်။ Promise က `true` (သို့) `false` တစ်ခုခုနဲ့ resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ algorithms တွေကတော့:

* `'ECDSA'`
* `'Ed25519'`
* `'Ed448'`[^secure-curves]
* `'HMAC'`
* `'KMAC128'`[^modern-algos]
* `'KMAC256'`[^modern-algos]
* `'ML-DSA-44'`[^modern-algos]
* `'ML-DSA-65'`[^modern-algos]
* `'ML-DSA-87'`[^modern-algos]
* `'RSA-PSS'`
* `'RSASSA-PKCS1-v1_5'`

### `subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm)`

* `format` {string} `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[^modern-algos],
  `'raw-public'`[^modern-algos], (သို့) `'raw-seed'`[^modern-algos] တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* `key` {CryptoKey}
* `wrappingKey` {CryptoKey}
* `wrapAlgorithm` {string|Algorithm|RsaOaepParams|AesCtrParams|AesCbcParams|AeadParams}
* Returns: {Promise} အောင်မြင်ရင် {ArrayBuffer} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Cryptography (လျှို့ဝှက်ကုဒ်ပညာ) မှာ "key တစ်ခုကို wrap လုပ်ခြင်း" ဆိုတာက keying material ကို export လုပ်ပြီး ကုဒ်သွင်းခြင်းကို ရည်ညွှန်းပါတယ်။ ဒီ method က keying material ကို `format` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ format အနေနဲ့ export လုပ်ပြီး — `wrapAlgorithm` မှာ သတ်မှတ်ထားတဲ့ method နဲ့ parameters တွေ၊ `wrappingKey` ကနေ ပံ့ပိုးပေးတဲ့ keying material တွေကို သုံးကာ ကုဒ်သွင်းပါတယ်။ ဒါက — `format` နဲ့ `key` တွေကို arguments အဖြစ် သုံးပြီး [`subtle.exportKey()`][] ကို ခေါ်ကာ ရလာတဲ့ ရလဒ်ကို `wrappingKey` နဲ့ `wrapAlgorithm` တွေကို input အဖြစ် သုံးပြီး [`subtle.encrypt()`][] method ဆီကို ပေးပို့တာနဲ့ ညီမျှပါတယ်။ အောင်မြင်ရင် ကုဒ်သွင်းထားတဲ့ key data ပါဝင်တဲ့ {ArrayBuffer} တစ်ခုနဲ့ promise က resolve ဖြစ်ပါလိမ့်မယ်။

လက်ရှိ support လုပ်ထားတဲ့ wrapping algorithms တွေကတော့:

* `'AES-CBC'`
* `'AES-CTR'`
* `'AES-GCM'`
* `'AES-KW'`
* `'AES-OCB'`[^modern-algos]
* `'ChaCha20-Poly1305'`[^modern-algos]
* `'RSA-OAEP'`

## Algorithm parameter များ (Algorithm parameters)

Algorithm parameter objects တွေက {SubtleCrypto} methods အမျိုးမျိုးက သုံးတဲ့ methods နဲ့ parameters တွေကို သတ်မှတ်ပေးပါတယ်။ ဒီနေရာမှာ "classes" တွေအနေနဲ့ ဖော်ပြထားပေမယ့် — သူတို့က ရိုးရှင်းတဲ့ JavaScript dictionary objects တွေပါ။

### Class: `Algorithm`

#### `Algorithm.name`

* Type: {string}

### Class: `AeadParams`

#### `aeadParams.additionalData`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

ကုဒ်မသွင်းရပေမယ့် data ရဲ့ authentication ထဲမှာ ပါဝင်တဲ့ အပိုထည့်သွင်းမှု (extra input) ပါ။ `additionalData` ကို သုံးတာက optional ဖြစ်ပါတယ်။

#### `aeadParams.iv`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Initialization vector က ပေးထားတဲ့ key တစ်ခုကို သုံးတဲ့ ကုဒ်သွင်း operation တိုင်းအတွက် ထူးခြား (unique) ဖြစ်ရပါမယ်။

#### `aeadParams.name`

* Type: {string} `'AES-GCM'`, `'AES-OCB'`, (သို့) `'ChaCha20-Poly1305'` ဖြစ်ရပါမယ်။

#### `aeadParams.tagLength`

* Type: {number} ထုတ်လုပ်လိုက်တဲ့ authentication tag ရဲ့ bit အရွယ်အစားပါ။

### Class: `AesDerivedKeyParams`

#### `aesDerivedKeyParams.name`

* Type: {string} `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-OCB'`, (သို့) `'AES-KW'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်

#### `aesDerivedKeyParams.length`

* Type: {number}

ဆင်းသက်ထုတ်ယူမယ့် AES key ရဲ့ length ပါ။ ဒါက `128`, `192`, (သို့) `256` တစ်ခုခု ဖြစ်ရပါမယ်။

### Class: `AesCbcParams`

#### `aesCbcParams.iv`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Initialization vector ကို ပံ့ပိုးပေးပါတယ်။ ဒါက length အတိအကျ 16 bytes ဖြစ်ရပြီး — ကြိုတင် ခန့်မှန်းလို့ မရတဲ့ cryptographically random တန်ဖိုး ဖြစ်သင့်ပါတယ်။

#### `aesCbcParams.name`

* Type: {string} `'AES-CBC'` ဖြစ်ရပါမယ်။

### Class: `AesCtrParams`

#### `aesCtrParams.counter`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Counter block ရဲ့ ကနဦး တန်ဖိုးပါ။ ဒါက အတိအကျ 16 bytes ရှည်ရပါမယ်။

`AES-CTR` method က block ရဲ့ ညာဘက်ဆုံး `length` bits တွေကို counter အဖြစ် သုံးပြီး ကျန်တဲ့ bits တွေကိုတော့ nonce အဖြစ် သုံးပါတယ်။

#### `aesCtrParams.length`

* Type: {number} `aesCtrParams.counter` ထဲက counter အဖြစ် သုံးမယ့် bit အရေအတွက်ပါ။

#### `aesCtrParams.name`

* Type: {string} `'AES-CTR'` ဖြစ်ရပါမယ်။

### Class: `AesKeyAlgorithm`

#### `aesKeyAlgorithm.length`

* Type: {number}

AES key ရဲ့ bit နဲ့ တိုင်းတဲ့ length ပါ။

#### `aesKeyAlgorithm.name`

* Type: {string}

### Class: `AesKeyGenParams`

#### `aesKeyGenParams.length`

* Type: {number}

ထုတ်လုပ်မယ့် AES key ရဲ့ length ပါ။ ဒါက `128`, `192`, (သို့) `256` တစ်ခုခု ဖြစ်ရပါမယ်။

#### `aesKeyGenParams.name`

* Type: {string} `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, (သို့)
  `'AES-KW'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်

### Class: `Argon2Params`

#### `argon2Params.associatedData`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Optional ဖြစ်တဲ့ associated data ကို ကိုယ်စားပြုပါတယ်။

#### `argon2Params.memory`

* Type: {number}

Memory အရွယ်အစားကို kibibytes နဲ့ ကိုယ်စားပြုပါတယ်။ ဒါက degree of parallelism ရဲ့ အနည်းဆုံး 8 ဆ ဖြစ်ရပါမယ်။

#### `argon2Params.name`

* Type: {string} `'Argon2d'`, `'Argon2i'`, (သို့) `'Argon2id'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `argon2Params.nonce`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Nonce ကို ကိုယ်စားပြုပါတယ် — password hashing applications တွေအတွက် salt တစ်ခု ဖြစ်ပါတယ်။

#### `argon2Params.parallelism`

* Type: {number}

Degree of parallelism ကို ကိုယ်စားပြုပါတယ်။

#### `argon2Params.passes`

* Type: {number}

Passes အရေအတွက်ကို ကိုယ်စားပြုပါတယ်။

#### `argon2Params.secretValue`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Optional ဖြစ်တဲ့ secret value ကို ကိုယ်စားပြုပါတယ်။

#### `argon2Params.version`

* Type: {number}

Argon2 version နံပါတ်ကို ကိုယ်စားပြုပါတယ်။ Default ဖြစ်ပြီး လက်ရှိ သတ်မှတ်ထားတဲ့ တစ်ခုတည်းသော version ကတော့ `19` (`0x13`) ပါ။

### Class: `ContextParams`

#### `contextParams.name`

* Type: {string} `'Ed448'`[^secure-curves], `'ML-DSA-44'`[^modern-algos], `'ML-DSA-65'`[^modern-algos], (သို့) `'ML-DSA-87'`[^modern-algos] ဖြစ်ရပါမယ်။

#### `contextParams.context`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

`context` member က message နဲ့ ဆက်စပ်ဖို့ optional ဖြစ်တဲ့ context data ကို ကိုယ်စားပြုပါတယ်။

### Class: `CShakeParams`

#### `cShakeParams.name`

* Type: {string} `'cSHAKE128'`[^modern-algos] (သို့) `'cSHAKE256'`[^modern-algos] ဖြစ်ရပါမယ်။

#### `cShakeParams.outputLength`

* Type: {number} တောင်းဆိုထားတဲ့ output length ကို bits နဲ့ ဖော်ပြပါတယ်။

#### `cShakeParams.functionName`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

`functionName` member က cSHAKE ပေါ်မှာ တည်ဆောက်ထားတဲ့ functions တွေကို domain-separate လုပ်ဖို့ သုံးတဲ့ NIST function-name byte string ကို ကိုယ်စားပြုပါတယ်။ လက်ခံနိုင်တဲ့ တန်ဖိုးတွေကတော့:

* ဗလာ (သို့) `undefined` — ဒီအခြေအနေမှာ cSHAKE က plain SHAKE နဲ့ ညီမျှပါတယ်
* `'KMAC'` ဆိုတဲ့ ASCII byte sequence
* `'TupleHash'` ဆိုတဲ့ ASCII byte sequence
* `'ParallelHash'` ဆိုတဲ့ ASCII byte sequence

#### `cShakeParams.customization`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

`customization` member က customization data ကို ကိုယ်စားပြုပါတယ်။ လက်ခံနိုင်တဲ့ တန်ဖိုးတွေကတော့:

* ဗလာ (သို့) `undefined` — ဒီအခြေအနေမှာ cSHAKE က plain SHAKE နဲ့ ညီမျှပါတယ်
* arbitrary data 512 bytes အထိ

### Class: `EcdhKeyDeriveParams`

#### `ecdhKeyDeriveParams.name`

* Type: {string} `'ECDH'`, `'X25519'`, (သို့) `'X448'`[^secure-curves] ဖြစ်ရပါမယ်။

#### `ecdhKeyDeriveParams.public`

* Type: {CryptoKey}

ECDH key derivation က — တစ်ဖက်ရဲ့ private key နဲ့ နောက်တစ်ဖက်ရဲ့ public key ကို input အဖြစ် ယူပြီး နှစ်ခုလုံးကို သုံးကာ ဘုံ shared secret တစ်ခု ထုတ်လုပ်ခြင်းဖြင့် လုပ်ဆောင်ပါတယ်။ `ecdhKeyDeriveParams.public` property ကို အခြားတစ်ဖက်ရဲ့ public key နဲ့ သတ်မှတ်ပေးပါတယ်။

### Class: `EcdsaParams`

#### `ecdsaParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `ecdsaParams.name`

* Type: {string} `'ECDSA'` ဖြစ်ရပါမယ်။

### Class: `EcKeyAlgorithm`

#### `ecKeyAlgorithm.name`

* Type: {string}

#### `ecKeyAlgorithm.namedCurve`

* Type: {string}

### Class: `EcKeyGenParams`

#### `ecKeyGenParams.name`

* Type: {string} `'ECDSA'` (သို့) `'ECDH'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `ecKeyGenParams.namedCurve`

* Type: {string} `'P-256'`, `'P-384'`, `'P-521'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

### Class: `EcKeyImportParams`

#### `ecKeyImportParams.name`

* Type: {string} `'ECDSA'` (သို့) `'ECDH'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `ecKeyImportParams.namedCurve`

* Type: {string} `'P-256'`, `'P-384'`, `'P-521'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

### Class: `EncapsulatedBits`

Message ကုဒ်သွင်းဖို့ အတွက် ယာယီ symmetric secret key (ကို {ArrayBuffer} အနေနဲ့ ကိုယ်စားပြုပါတယ်) နဲ့ — ဒီ shared key နဲ့ ကုဒ်သွင်းထားတဲ့ ciphertext (message နဲ့အတူ message လက်ခံသူဆီကို ပို့လို့ရတဲ့) တို့ ဖြစ်ပါတယ်။ Recipient က သူတို့ရဲ့ private key ကို သုံးပြီး shared key က ဘာလဲ ဆိုတာ ဆုံးဖြတ်ကာ — အဲဒါကြောင့် message ကို ကုဒ်ဖြေနိုင်ပါတယ်။

#### `encapsulatedBits.ciphertext`

* Type: {ArrayBuffer}

#### `encapsulatedBits.sharedKey`

* Type: {ArrayBuffer}

### Class: `EncapsulatedKey`

Message ကုဒ်သွင်းဖို့ အတွက် ယာယီ symmetric secret key (ကို {CryptoKey} အနေနဲ့ ကိုယ်စားပြုပါတယ်) နဲ့ — ဒီ shared key နဲ့ ကုဒ်သွင်းထားတဲ့ ciphertext (message နဲ့အတူ message လက်ခံသူဆီကို ပို့လို့ရတဲ့) တို့ ဖြစ်ပါတယ်။ Recipient က သူတို့ရဲ့ private key ကို သုံးပြီး shared key က ဘာလဲ ဆိုတာ ဆုံးဖြတ်ကာ — အဲဒါကြောင့် message ကို ကုဒ်ဖြေနိုင်ပါတယ်။

#### `encapsulatedKey.ciphertext`

* Type: {ArrayBuffer}

#### `encapsulatedKey.sharedKey`

* Type: {CryptoKey}

### Class: `HkdfParams`

#### `hkdfParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `hkdfParams.info`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

HKDF algorithm ဆီကို application-specific ဖြစ်တဲ့ contextual input ကို ပံ့ပိုးပေးပါတယ်။ ဒါက zero-length ဖြစ်နိုင်ပေမယ့် — ပေးထားရပါမယ်။

#### `hkdfParams.name`

* Type: {string} `'HKDF'` ဖြစ်ရပါမယ်။

#### `hkdfParams.salt`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

Salt value က HKDF algorithm ရဲ့ ခိုင်မာမှုကို သိသိသာသာ တိုးတက်စေပါတယ်။ ဒါက random (သို့) pseudorandom ဖြစ်သင့်ပြီး digest function ရဲ့ output နဲ့ အလျားတူညီနေသင့်ပါတယ် (ဥပမာ — digest အဖြစ် `'SHA-256'` ကို သုံးရင် salt က 256-bit ရှိတဲ့ random data ဖြစ်သင့်ပါတယ်)။

### Class: `HmacImportParams`

#### `hmacImportParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `hmacImportParams.length`

* Type: {number}

HMAC key ထဲက optional bit အရေအတွက်ပါ။ ဒါက optional ဖြစ်ပြီး ကိစ္စအများစုမှာ ချန်လှပ်ထားသင့်ပါတယ်။

#### `hmacImportParams.name`

* Type: {string} `'HMAC'` ဖြစ်ရပါမယ်။

### Class: `HmacKeyAlgorithm`

#### `hmacKeyAlgorithm.hash`

* Type: {Algorithm}

#### `hmacKeyAlgorithm.length`

* Type: {number}

HMAC key ရဲ့ bit နဲ့ တိုင်းတဲ့ length ပါ။

#### `hmacKeyAlgorithm.name`

* Type: {string}

### Class: `HmacKeyGenParams`

#### `hmacKeyGenParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `hmacKeyGenParams.length`

* Type: {number}

HMAC key အတွက် ထုတ်လုပ်မယ့် bit အရေအတွက်ပါ။ ချန်လှပ်ထားရင် — သုံးထားတဲ့ hash algorithm အလိုက် length ကို ဆုံးဖြတ်ပေးပါလိမ့်မယ်။ ဒါက optional ဖြစ်ပြီး ကိစ္စအများစုမှာ ချန်လှပ်ထားသင့်ပါတယ်။

#### `hmacKeyGenParams.name`

* Type: {string} `'HMAC'` ဖြစ်ရပါမယ်။

### Class: `KeyAlgorithm`

#### `keyAlgorithm.name`

* Type: {string}

### Class: `KangarooTwelveParams`

#### `kangarooTwelveParams.customization`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

KangarooTwelve အတွက် optional customization string ပါ။ ဒါက 512 bytes ထက် မကျော်ရပါဘူး။

#### `kangarooTwelveParams.name`

* Type: {string} `'KT128'`[^modern-algos] (သို့) `'KT256'`[^modern-algos] ဖြစ်ရပါမယ်။

#### `kangarooTwelveParams.outputLength`

* Type: {number} တောင်းဆိုထားတဲ့ output length ကို bits နဲ့ ဖော်ပြပါတယ်။

### Class: `KmacImportParams`

#### `kmacImportParams.length`

* Type: {number}

KMAC key ထဲက optional bit အရေအတွက်ပါ။ ဒါက optional ဖြစ်ပြီး ကိစ္စအများစုမှာ ချန်လှပ်ထားသင့်ပါတယ်။

#### `kmacImportParams.name`

* Type: {string} `'KMAC128'` (သို့) `'KMAC256'` ဖြစ်ရပါမယ်။

### Class: `KmacKeyAlgorithm`

#### `kmacKeyAlgorithm.length`

* Type: {number}

KMAC key ရဲ့ bit နဲ့ တိုင်းတဲ့ length ပါ။

#### `kmacKeyAlgorithm.name`

* Type: {string}

### Class: `KmacKeyGenParams`

#### `kmacKeyGenParams.length`

* Type: {number}

KMAC key အတွက် ထုတ်လုပ်မယ့် bit အရေအတွက်ပါ။ ချန်လှပ်ထားရင် — သုံးထားတဲ့ KMAC algorithm အလိုက် length ကို ဆုံးဖြတ်ပေးပါလိမ့်မယ်။ ဒါက optional ဖြစ်ပြီး ကိစ္စအများစုမှာ ချန်လှပ်ထားသင့်ပါတယ်။

#### `kmacKeyGenParams.name`

* Type: {string} `'KMAC128'` (သို့) `'KMAC256'` ဖြစ်ရပါမယ်။

### Class: `KmacParams`

#### `kmacParams.algorithm`

* Type: {string} `'KMAC128'` (သို့) `'KMAC256'` ဖြစ်ရပါမယ်။

#### `kmacParams.outputLength`

* Type: {number} တောင်းဆိုထားတဲ့ output length ကို bits နဲ့ ဖော်ပြပါတယ်။

#### `kmacParams.customization`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer|undefined}

`customization` member က optional ဖြစ်တဲ့ customization string ကို ကိုယ်စားပြုပါတယ်။

### Class: `Pbkdf2Params`

#### `pbkdf2Params.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `pbkdf2Params.iterations`

* Type: {number}

Bits ဆင်းသက်ထုတ်ယူတဲ့အခါ PBKDF2 algorithm က လုပ်ဆောင်ရမယ့် iterations အရေအတွက်ပါ။

#### `pbkdf2Params.name`

* Type: {string} `'PBKDF2'` ဖြစ်ရပါမယ်။

#### `pbkdf2Params.salt`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

အနည်းဆုံး random (သို့) pseudorandom bytes 16 ခု ဖြစ်သင့်ပါတယ်။

### Class: `RsaHashedImportParams`

#### `rsaHashedImportParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `rsaHashedImportParams.name`

* Type: {string} `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, (သို့)
  `'RSA-OAEP'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

### Class: `RsaHashedKeyAlgorithm`

#### `rsaHashedKeyAlgorithm.hash`

* Type: {Algorithm}

#### `rsaHashedKeyAlgorithm.modulusLength`

* Type: {number}

RSA modulus ရဲ့ bit length ပါ။

#### `rsaHashedKeyAlgorithm.name`

* Type: {string}

#### `rsaHashedKeyAlgorithm.publicExponent`

* Type: {Uint8Array}

RSA public exponent ပါ။

### Class: `RsaHashedKeyGenParams`

#### `rsaHashedKeyGenParams.hash`

* Type: {string|Algorithm}

{string} အနေနဲ့ ကိုယ်စားပြုထားရင် တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ရပါမယ်:

* `'SHA-1'`
* `'SHA-256'`
* `'SHA-384'`
* `'SHA-512'`
* `'SHA3-256'`[^modern-algos]
* `'SHA3-384'`[^modern-algos]
* `'SHA3-512'`[^modern-algos]

{Algorithm} အနေနဲ့ ကိုယ်စားပြုထားရင် object ရဲ့ `name` property က အထက်မှာ စာရင်းပြုထားတဲ့ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `rsaHashedKeyGenParams.modulusLength`

* Type: {number}

RSA modulus ရဲ့ bit length ပါ။ အကောင်းဆုံး ကျင့်သုံးမှု (best practice) အနေနဲ့ အနည်းဆုံး `2048` ဖြစ်သင့်ပါတယ်။

#### `rsaHashedKeyGenParams.name`

* Type: {string} `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, (သို့)
  `'RSA-OAEP'` တို့ထဲက တစ်ခု ဖြစ်ရပါမယ်။

#### `rsaHashedKeyGenParams.publicExponent`

* Type: {Uint8Array}

RSA public exponent ပါ။ ဒါက 32-bits အတွင်းမှာ ကိုက်ညီရမယ့် big-endian, unsigned integer တစ်ခု ပါဝင်တဲ့ {Uint8Array} တစ်ခု ဖြစ်ရပါမယ်။ {Uint8Array} ထဲမှာ ရှေ့ဆုံးမှာ zero-bits တွေ ဘယ်နှစ်ခုမဆို ပါနိုင်ပါတယ်။ တန်ဖိုးက prime number တစ်ခု ဖြစ်ရပါမယ်။ တခြား တန်ဖိုးတစ်ခုကို သုံးဖို့ အကြောင်းပြချက် မရှိရင် public exponent အဖြစ် `new Uint8Array([1, 0, 1])` (65537) ကို သုံးပါ။

### Class: `RsaOaepParams`

#### `rsaOaepParams.label`

* Type: {ArrayBuffer|TypedArray|DataView|Buffer}

ကုဒ်သွင်းမခံရပေမယ့် ထုတ်လုပ်လိုက်တဲ့ ciphertext နဲ့ ချိတ်ဆက်ထားမယ့် အပို bytes အစုတစ်ခုပါ။

`rsaOaepParams.label` parameter က optional ဖြစ်ပါတယ်။

#### `rsaOaepParams.name`

* Type: {string} `'RSA-OAEP'` ဖြစ်ရပါမယ်။

### Class: `RsaPssParams`

#### `rsaPssParams.name`

* Type: {string} `'RSA-PSS'` ဖြစ်ရပါမယ်။

#### `rsaPssParams.saltLength`

* Type: {number}

သုံးမယ့် random salt ရဲ့ (byte နဲ့ တိုင်းတဲ့) length ပါ။

### Class: `TurboShakeParams`

#### `turboShakeParams.domainSeparation`

* Type: {number|undefined}

Optional ဖြစ်တဲ့ domain separation byte (0x01-0x7f) ပါ။ Default က `0x1f` ဖြစ်ပါတယ်။

#### `turboShakeParams.name`

* Type: {string} `'TurboSHAKE128'`[^modern-algos] (သို့) `'TurboSHAKE256'`[^modern-algos] ဖြစ်ရပါမယ်။

#### `turboShakeParams.outputLength`

* Type: {number} တောင်းဆိုထားတဲ့ output length ကို bits နဲ့ ဖော်ပြပါတယ်။

[^secure-curves]: See [Secure Curves in the Web Cryptography API][]

[^modern-algos]: See [Modern Algorithms in the Web Cryptography API][]

[^openssl30]: Requires OpenSSL >= 3.0

[^openssl32]: Requires OpenSSL >= 3.2

[^openssl35]: Requires OpenSSL >= 3.5

[Checking for runtime algorithm support]: #checking-for-runtime-algorithm-support
[Crypto operation APIs]: #crypto-operation-apis
[JSON Web Key]: https://tools.ietf.org/html/rfc7517
[Key formats]: #key-formats
[Key usages]: #cryptokeyusages
[Modern Algorithms in the Web Cryptography API]: #modern-algorithms-in-the-web-cryptography-api
[RFC 4122]: https://www.rfc-editor.org/rfc/rfc4122.txt
[Secure Curves in the Web Cryptography API]: #secure-curves-in-the-web-cryptography-api
[Web Crypto API]: https://www.w3.org/TR/WebCryptoAPI/
[`SubtleCrypto.supports()`]: #static-method-subtlecryptosupportsoperation-algorithm-lengthoradditionalalgorithm
[`subtle.decapsulateBits()`]: #subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext
[`subtle.decapsulateKey()`]: #subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages
[`subtle.decrypt()`]: #subtledecryptalgorithm-key-data
[`subtle.deriveBits()`]: #subtlederivebitsalgorithm-basekey-length
[`subtle.deriveKey()`]: #subtlederivekeyalgorithm-basekey-derivedkeytype-extractable-keyusages
[`subtle.digest()`]: #subtledigestalgorithm-data
[`subtle.encapsulateBits()`]: #subtleencapsulatebitsencapsulationalgorithm-encapsulationkey
[`subtle.encapsulateKey()`]: #subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages
[`subtle.encrypt()`]: #subtleencryptalgorithm-key-data
[`subtle.exportKey()`]: #subtleexportkeyformat-key
[`subtle.generateKey()`]: #subtlegeneratekeyalgorithm-extractable-keyusages
[`subtle.getPublicKey()`]: #subtlegetpublickeykey-keyusages
[`subtle.importKey()`]: #subtleimportkeyformat-keydata-algorithm-extractable-keyusages
[`subtle.sign()`]: #subtlesignalgorithm-key-data
[`subtle.unwrapKey()`]: #subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgorithm-unwrappedkeyalgorithm-extractable-keyusages
[`subtle.verify()`]: #subtleverifyalgorithm-key-signature-data
[`subtle.wrapKey()`]: #subtlewrapkeyformat-key-wrappingkey-wrapalgorithm
