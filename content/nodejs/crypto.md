---
title: "Crypto"
description: "node:crypto module — cryptographic functionality (လျှို့ဝှက်စာဝှက် လုပ်ဆောင်ချက်များ) — hash/HMAC, cipher & decipher (Cipheriv/Decipheriv), sign/verify, DiffieHellman/ECDH, key generation နဲ့ KeyObject, X509Certificate, randomBytes, scrypt/pbkdf2, subtle (WebCrypto) စသည်"
order: 146
source: "https://nodejs.org/api/crypto.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

`node:crypto` module က OpenSSL ရဲ့ hash, HMAC, cipher, decipher, sign နဲ့
verify functions တွေအတွက် wrappers အစုတစ်စု ပါဝင်တဲ့ cryptographic
(လျှို့ဝှက်ကုဒ်ပြုခြင်းဆိုင်ရာ) လုပ်ဆောင်ချက်တွေကို ပံ့ပိုးပေးပါတယ်။

```mjs
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```cjs
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

## Crypto support မရနိုင်ခြင်း ရှိမရှိ ဆုံးဖြတ်ခြင်း (Determining if crypto support is unavailable)

Node.js ကို `node:crypto` module အတွက် support မပါဝင်ပဲ build လုပ်ထားတာ
ဖြစ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ `crypto` ကနေ `import` လုပ်ဖို့
ကြိုးစားတာ သို့မဟုတ် `require('node:crypto')` ကို ခေါ်လိုက်ရင် error တစ်ခု
throw လုပ်ခံရမှာ ဖြစ်ပါတယ်။

CommonJS ကို သုံးနေတဲ့အခါ throw လုပ်ခံရတဲ့ error ကို try/catch သုံးပြီး
ဖမ်းယူနိုင်ပါတယ်:

```cjs
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

Lexical ESM `import` keyword ကို သုံးတဲ့အခါ error ကို ဖမ်းယူနိုင်ဖို့ဆိုရင်
module ကို load လုပ်ဖို့ ကြိုးစားမှု မစတင်ခင် _ကြိုတင် (before)_
`process.on('uncaughtException')` အတွက် handler တစ်ခု register လုပ်ထားမှသာ
ဖြစ်နိုင်ပါတယ် (ဥပမာ — preload module တစ်ခုကို သုံးခြင်းအားဖြင့်)။

ESM ကို သုံးနေပြီး code က crypto support မဖွင့်ထားတဲ့ Node.js build တစ်ခုပေါ်မှာ
run ခံရနိုင်တဲ့ အလားအလာ ရှိတယ်ဆိုရင် lexical `import` keyword အစား
[`import()`][] function ကို သုံးဖို့ စဉ်းစားပါ:

```mjs
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## Asymmetric keys အမျိုးအစားများ (Asymmetric key types)

အောက်က စာရင်းတွေမှာ [`KeyObject`][] API က မှတ်မိနားလည်တဲ့ asymmetric key
types တွေကို type တစ်ခုချင်းစီအတွက် import လုပ်ခြင်းနဲ့ export လုပ်ခြင်း
အတွက် support လုပ်ထားတဲ့ formats အစုအပြည့်အစုံအလိုက် အုပ်စုဖွဲ့ ဖော်ပြထားပါတယ်။

**Formats:** `'pem'`, `'der'`

* **`'dh'` (Diffie-Hellman)** — OID `1.2.840.113549.1.3.1`
* **`'dsa'`** — OID `1.2.840.10040.4.1`
* **`'rsa-pss'`** — OID `1.2.840.113549.1.1.10`

**Formats:** `'pem'`, `'der'`, `'jwk'`

* **`'rsa'`** — OID `1.2.840.113549.1.1.1`

**Formats:** `'pem'`, `'der'`, `'jwk'`, `'raw-public'`, `'raw-private'`

* **`'ec'` (Elliptic curve)** — OID `1.2.840.10045.2.1`
* **`'ed25519'`** — OID `1.3.101.112`
* **`'ed448'`** — OID `1.3.101.113`
* **`'slh-dsa-sha2-128f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.21`
* **`'slh-dsa-sha2-128s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.20`
* **`'slh-dsa-sha2-192f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.23`
* **`'slh-dsa-sha2-192s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.22`
* **`'slh-dsa-sha2-256f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.25`
* **`'slh-dsa-sha2-256s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.24`
* **`'slh-dsa-shake-128f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.27`
* **`'slh-dsa-shake-128s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.26`
* **`'slh-dsa-shake-192f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.29`
* **`'slh-dsa-shake-192s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.28`
* **`'slh-dsa-shake-256f'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.31`
* **`'slh-dsa-shake-256s'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.30`
* **`'x25519'`** — OID `1.3.101.110`
* **`'x448'`** — OID `1.3.101.111`

**Formats:** `'pem'`, `'der'`, `'jwk'`, `'raw-public'`, `'raw-seed'`

* **`'ml-dsa-44'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.17`
* **`'ml-dsa-65'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.18`
* **`'ml-dsa-87'`[^openssl35]** — OID `2.16.840.1.101.3.4.3.19`
* **`'ml-kem-512'`[^openssl35]** — OID `2.16.840.1.101.3.4.4.1`
* **`'ml-kem-768'`[^openssl35]** — OID `2.16.840.1.101.3.4.4.2`
* **`'ml-kem-1024'`[^openssl35]** — OID `2.16.840.1.101.3.4.4.3`

### Key ဖော်မက်များ (Key formats)

Asymmetric keys တွေကို ဖော်မက်များစွာနဲ့ ကိုယ်စားပြု ဖော်ပြနိုင်ပါတယ်။
**အကြံပြုထားတဲ့ နည်းလမ်းကတော့ key material ကို [`KeyObject`][] တစ်ခုထဲကို
တစ်ကြိမ် import လုပ်ပြီး နောက်ပိုင်း လုပ်ဆောင်မှုတွေ အားလုံးအတွက်
ပြန်လည် သုံးစွဲဖို့ပါ** — ဒီလိုလုပ်ခြင်းက ထပ်ခါထပ်ခါ parsing လုပ်ရတာကို
ရှောင်ရှားပေးပြီး အကောင်းဆုံး performance ကို ရရှိစေလို့ပါ။

[`KeyObject`][] ကို သုံးဖို့ မလွယ်ကူတဲ့ အခြေအနေမျိုးမှာ — ဥပမာ key material
က protocol message တစ်ခုထဲမှာ ရောက်လာပြီး တစ်ကြိမ်တည်းသာ သုံးရတဲ့ အခါမျိုး —
cryptographic functions အများစုက PEM string တစ်ခု သို့မဟုတ် format နဲ့ key
material ကို တိုက်ရိုက် သတ်မှတ်ပေးတဲ့ object တစ်ခုကိုပါ လက်ခံပါတယ်။ Format
တစ်ခုချင်းစီအတွက် လက်ခံတဲ့ options အပြည့်အစုံကို
[`crypto.createPublicKey()`][], [`crypto.createPrivateKey()`][] နဲ့
[`keyObject.export()`][] တို့မှာ ကြည့်ပါ။

#### KeyObject

[`KeyObject`][] က parse လုပ်ပြီးသား key တစ်ခုရဲ့ in-memory ကိုယ်စားပြုမှု
ဖြစ်ပါတယ်။ ၎င်းကို [`crypto.createPublicKey()`][],
[`crypto.createPrivateKey()`][], [`crypto.createSecretKey()`][] သို့မဟုတ်
[`crypto.generateKeyPair()`][] လိုမျိုး key generation functions တွေက
ဖန်တီးပေးပါတယ်။ [`KeyObject`][] တစ်ခုနဲ့ ပထမဆုံး cryptographic operation က
နောက်ပိုင်း operation တွေထက် ပိုနှေးနိုင်ပါတယ် — အကြောင်းကတော့ OpenSSL က
internal caches တွေကို ပထမဆုံး အသုံးပြုချိန်မှာမှ lazily (လိုအပ်မှသာ)
initialize လုပ်လို့ပါ။

#### PEM နှင့် DER (PEM and DER)

PEM နဲ့ DER တို့ဟာ ASN.1 structures တွေကို အခြေခံတဲ့ asymmetric keys တွေအတွက်
ရိုးရာ encoding formats တွေပါ။

* **PEM** က Base64 နဲ့ encode လုပ်ထားတဲ့ DER data ကို header နဲ့ footer lines
  တွေကြားမှာ ပတ်ရစ် (wrap) ထားတဲ့ text encoding တစ်ခုပါ (ဥပမာ —
  `-----BEGIN PUBLIC KEY-----`)။ PEM strings တွေကို cryptographic operations
  အများစုဆီကို တိုက်ရိုက် ဖြတ်သန်းပေးနိုင်ပါတယ်။
* **DER** ကတော့ အဲဒီ ASN.1 structures တွေရဲ့ binary encoding ပါ။ DER input
  ပေးတဲ့အခါ `type` (ပုံမှန်အားဖြင့် `'spki'` သို့မဟုတ် `'pkcs8'`) ကို
  တိုက်ရိုက် (explicitly) သတ်မှတ်ပေးရပါမယ်။

#### JSON Web Key (JWK)

JSON Web Key (JWK) က [RFC 7517][] မှာ သတ်မှတ်ထားတဲ့ JSON-based key
ကိုယ်စားပြုမှု တစ်ခုပါ။ JWK က key component တစ်ခုချင်းစီကို JSON object
တစ်ခုအတွင်းမှာ Base64url နဲ့ encode လုပ်ထားတဲ့ တန်ဖိုး တစ်ခုချင်းစီအဖြစ်
encode လုပ်ပါတယ်။ RSA keys တွေအတွက်ဆိုရင် JWK က ASN.1 parsing ရဲ့ overhead ကို
ရှောင်ရှားပေးပြီး အမြန်ဆုံး serialized import format ဖြစ်ပါတယ်။

#### Raw key ဖော်မက်များ (Raw key formats)

> Stability: 1.1 - Active development

`'raw-public'`, `'raw-private'` နဲ့ `'raw-seed'` key formats တွေက encoding
wrapper ဘာမှ မပါပဲ raw key material တွေကို import လုပ်ခြင်းနဲ့ export
လုပ်ခြင်း ပြုလုပ်နိုင်စေပါတယ်။ အသုံးပြုပုံ အသေးစိတ်ကို
[`keyObject.export()`][], [`crypto.createPublicKey()`][] နဲ့
[`crypto.createPrivateKey()`][] တို့မှာ ကြည့်ပါ။

`'raw-public'` က ယေဘုယျအားဖြင့် public key တစ်ခုကို import လုပ်ဖို့
အမြန်ဆုံး နည်းလမ်း ဖြစ်ပါတယ်။ `'raw-private'` နဲ့ `'raw-seed'` တို့ကတော့
private scalar သို့မဟုတ် seed ကိုသာ ပါဝင်တာမို့ တခြား formats တွေထက်
အမြဲတမ်း မမြန်ပါဘူး — ၎င်းတို့ကို import လုပ်ဖို့ဆိုရင် public key component
ကို ဆင်းသက်ယူဖို့ (ဥပမာ — elliptic curve point multiplication သို့မဟုတ်
seed expansion) လိုအပ်ပြီး အဲဒါက စရိတ် ကြီးနိုင်ပါတယ်။ တခြား formats
တွေကတော့ private နဲ့ public components နှစ်ခုလုံး ပါဝင်တာမို့ အဲဒီ
တွက်ချက်မှုကို ရှောင်ရှားနိုင်ပါတယ်။

### Key format တစ်ခု ရွေးချယ်ခြင်း (Choosing a key format)

**[`KeyObject`][] တစ်ခုကို အမြဲတမ်း ဦးစားပေး သုံးပါ** — သင့်မှာ ရှိတဲ့ format
ဘယ်လိုပဲ ဖြစ်ပါစေ ၎င်းကနေ KeyObject တစ်ခု ဖန်တီးပြီး ပြန်လည် သုံးပါ။ အောက်က
လမ်းညွှန်ချက်တွေက [`KeyObject`][] တစ်ခုထဲကို import လုပ်ဖို့အတွက်ဖြစ်စေ၊
[`KeyObject`][] ကို သုံးဖို့ မလွယ်ကူတဲ့အခါ key material ကို inline
ဖြတ်သန်းပေးဖို့အတွက်ဖြစ်စေ — serialization formats တွေကြားမှာ ရွေးချယ်နေတဲ့
အခြေအနေမှာသာ သက်ရောက်မှု ရှိပါတယ်။

#### Keys များကို import လုပ်ခြင်း (Importing keys)

ထပ်ခါထပ်ခါ သုံးဖို့ [`KeyObject`][] တစ်ခု ဖန်တီးတဲ့အခါ import စရိတ်က
တစ်ကြိမ်တည်းသာ ကျခံရတာမို့ ပိုမြန်တဲ့ format တစ်ခုကို ရွေးချယ်ခြင်းက
startup latency (စတင်ချိန် နှောင့်နှေးမှု) ကို လျှော့ချပေးပါတယ်။

Import စရိတ်က အပိုင်းနှစ်ပိုင်း ပါဝင်ပါတယ်: **parsing overhead**
(serialization wrapper ကို decode လုပ်ခြင်း) နဲ့ **key computation**
(key အပြည့်အစုံကို ပြန်လည် တည်ဆောက်ဖို့ လိုအပ်တဲ့ သင်္ချာ တွက်ချက်မှု
မှန်သမျှ — ဥပမာ private scalar ကနေ public key ကို ဆင်းသက်ယူခြင်း သို့မဟုတ်
seed တစ်ခုကို ချဲ့ထွင်ခြင်း)။ ဘယ်အပိုင်းက ကြီးစိုးလဲဆိုတာက key type ပေါ်မှာ
မူတည်ပါတယ်။ ဥပမာ:

* Public keys — `'raw-public'` က အမြန်ဆုံး serialized format ဖြစ်ပါတယ် —
  raw format က ASN.1 နဲ့ Base64 decoding တွေ အားလုံးကို ကျော်သွားလို့ပါ။
* EC private keys — `'raw-private'` က PEM သို့မဟုတ် DER ထက် ပိုမြန်ပါတယ် —
  ASN.1 parsing ကို ရှောင်ရှားနိုင်လို့ပါ။ ဒါပေမယ့် curve ကြီးတွေ
  (ဥပမာ — P-384, P-521) အတွက်တော့ private scalar ကနေ public point ကို
  ဆင်းသက်ယူရတာက စရိတ် ကြီးလာပြီး အဲဒီ အားသာချက်ကို လျှော့ချပေးပါတယ်။
* RSA keys — `'jwk'` က အမြန်ဆုံး serialized format ဖြစ်ပါတယ်။ JWK က RSA key
  components တွေကို Base64url နဲ့ encode လုပ်ထားတဲ့ integer တစ်ခုချင်းစီအနေနဲ့
  ဖော်ပြတာမို့ ASN.1 parsing ရဲ့ overhead ကို လုံးဝ ရှောင်ရှားနိုင်ပါတယ်။

#### လုပ်ဆောင်မှုများအတွင်း inline key material (Inline key material in operations)

[`KeyObject`][] ကို ပြန်လည် သုံးလို့ မရတဲ့အခါ (ဥပမာ — key က protocol message
တစ်ခုထဲမှာ raw bytes အနေနဲ့ ရောက်လာပြီး တစ်ကြိမ်တည်းသာ သုံးရတဲ့အခါ)
cryptographic functions အများစုက PEM string တစ်ခု သို့မဟုတ် format နဲ့ key
material ကို တိုက်ရိုက် သတ်မှတ်ပေးတဲ့ object တစ်ခုကိုပါ လက်ခံပါတယ်။ ဒီလို
အခြေအနေမှာ စုစုပေါင်း စရိတ်က key import ရဲ့ စရိတ်နဲ့ cryptographic
တွက်ချက်မှုကိုယ်တိုင် ပေါင်းလဒ် ဖြစ်ပါတယ်။

Cryptographic တွက်ချက်မှုက ကြီးစိုးနေတဲ့ operations တွေ — RSA နဲ့ signing
လုပ်ခြင်း သို့မဟုတ် P-384 သို့မဟုတ် P-521 နဲ့ ECDH key agreement လုပ်ခြင်း
လိုမျိုး — အတွက်ဆိုရင် serialization format က စုစုပေါင်း throughput အပေါ်
သက်ရောက်မှု မပြောပလောက်တာမို့ ဘယ် format မဆို အဆင်ပြေတာကို ရွေးနိုင်ပါတယ်။
Ed25519 signing သို့မဟုတ် verification လိုမျိုး ပေါ့ပါးတဲ့ operations
တွေမှာတော့ import စရိတ်က စုစုပေါင်းရဲ့ ကြီးမားတဲ့ အချိုးအစားကို နေရာယူတာမို့
`'raw-public'` သို့မဟုတ် `'raw-private'` လိုမျိုး ပိုမြန်တဲ့ format တစ်ခုက
throughput ကို သိသိသာသာ တိုးတက်စေနိုင်ပါတယ်။

တူညီတဲ့ key material ကို အကြိမ် အနည်းငယ်သာ သုံးရမယ်ဆိုရင်တောင် raw သို့မဟုတ်
PEM ကိုယ်စားပြုမှုကို ထပ်ခါထပ်ခါ ဖြတ်သန်းပေးနေမယ့်အစား ၎င်းကို
[`KeyObject`][] တစ်ခုထဲကို import လုပ်ထားတာက တန်ဖိုးရှိပါတယ်။

### ဥပမာများ (Examples)

ဥပမာ: sign နဲ့ verify operations တွေမှာ [`KeyObject`][] တစ်ခုကို ပြန်လည်
သုံးစွဲခြင်း:

```mjs
import { promisify } from 'node:util';
const { generateKeyPair, sign, verify } = await import('node:crypto');

const { publicKey, privateKey } = await promisify(generateKeyPair)('ed25519');

// A KeyObject holds the parsed key in memory and can be reused
// across multiple operations without re-parsing.
const data = new TextEncoder().encode('message to sign');
const signature = sign(null, data, privateKey);
verify(null, data, publicKey, signature);
```

ဥပမာ: format အမျိုးမျိုးရှိတဲ့ keys တွေကို [`KeyObject`][]s တွေထဲကို import
လုပ်ခြင်း:

```mjs
import { promisify } from 'node:util';
const {
  createPrivateKey, createPublicKey, generateKeyPair,
} = await import('node:crypto');

const generated = await promisify(generateKeyPair)('ed25519');

// PEM
const privatePem = generated.privateKey.export({ format: 'pem', type: 'pkcs8' });
const publicPem = generated.publicKey.export({ format: 'pem', type: 'spki' });
createPrivateKey(privatePem);
createPublicKey(publicPem);

// DER - requires explicit type
const privateDer = generated.privateKey.export({ format: 'der', type: 'pkcs8' });
const publicDer = generated.publicKey.export({ format: 'der', type: 'spki' });
createPrivateKey({ key: privateDer, format: 'der', type: 'pkcs8' });
createPublicKey({ key: publicDer, format: 'der', type: 'spki' });

// JWK
const privateJwk = generated.privateKey.export({ format: 'jwk' });
const publicJwk = generated.publicKey.export({ format: 'jwk' });
createPrivateKey({ key: privateJwk, format: 'jwk' });
createPublicKey({ key: publicJwk, format: 'jwk' });

// Raw
const rawPriv = generated.privateKey.export({ format: 'raw-private' });
const rawPub = generated.publicKey.export({ format: 'raw-public' });
createPrivateKey({ key: rawPriv, format: 'raw-private', asymmetricKeyType: 'ed25519' });
createPublicKey({ key: rawPub, format: 'raw-public', asymmetricKeyType: 'ed25519' });
```

ဥပမာ: [`KeyObject`][] တစ်ခုကို အရင် မဖန်တီးပဲ key material တွေကို
[`crypto.sign()`][] နဲ့ [`crypto.verify()`][] ဆီကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း:

```mjs
import { promisify } from 'node:util';
const { generateKeyPair, sign, verify } = await import('node:crypto');

const generated = await promisify(generateKeyPair)('ed25519');

const data = new TextEncoder().encode('message to sign');

// PEM strings
const privatePem = generated.privateKey.export({ format: 'pem', type: 'pkcs8' });
const publicPem = generated.publicKey.export({ format: 'pem', type: 'spki' });
const sig1 = sign(null, data, privatePem);
verify(null, data, publicPem, sig1);

// JWK objects
const privateJwk = generated.privateKey.export({ format: 'jwk' });
const publicJwk = generated.publicKey.export({ format: 'jwk' });
const sig2 = sign(null, data, { key: privateJwk, format: 'jwk' });
verify(null, data, { key: publicJwk, format: 'jwk' }, sig2);

// Raw key bytes
const rawPriv = generated.privateKey.export({ format: 'raw-private' });
const rawPub = generated.publicKey.export({ format: 'raw-public' });
const sig3 = sign(null, data, {
  key: rawPriv, format: 'raw-private', asymmetricKeyType: 'ed25519',
});
verify(null, data, {
  key: rawPub, format: 'raw-public', asymmetricKeyType: 'ed25519',
}, sig3);
```

ဥပမာ: EC keys တွေအတွက် raw keys တွေကို import လုပ်တဲ့အခါ `namedCurve` option က
လိုအပ်ပါတယ်:

```mjs
import { promisify } from 'node:util';
const {
  createPrivateKey, createPublicKey, generateKeyPair, sign, verify,
} = await import('node:crypto');

const generated = await promisify(generateKeyPair)('ec', {
  namedCurve: 'P-256',
});

// Export the raw EC public key (uncompressed by default).
const rawPublicKey = generated.publicKey.export({ format: 'raw-public' });

// The following is equivalent.
const rawPublicKeyUncompressed = generated.publicKey.export({
  format: 'raw-public',
  type: 'uncompressed',
});

// Export compressed point format.
const rawPublicKeyCompressed = generated.publicKey.export({
  format: 'raw-public',
  type: 'compressed',
});

// Export the raw EC private key.
const rawPrivateKey = generated.privateKey.export({ format: 'raw-private' });

// Import the raw EC keys.
// Both compressed and uncompressed point formats are accepted.
const publicKey = createPublicKey({
  key: rawPublicKey,
  format: 'raw-public',
  asymmetricKeyType: 'ec',
  namedCurve: 'P-256',
});
const privateKey = createPrivateKey({
  key: rawPrivateKey,
  format: 'raw-private',
  asymmetricKeyType: 'ec',
  namedCurve: 'P-256',
});

const data = new TextEncoder().encode('message to sign');
const signature = sign('sha256', data, privateKey);
verify('sha256', data, publicKey, signature);
```

ဥပမာ: raw seeds တွေကို export လုပ်ပြီး ၎င်းတို့ကို import လုပ်ခြင်း:

```mjs
import { promisify } from 'node:util';
const {
  createPrivateKey, decapsulate, encapsulate, generateKeyPair,
} = await import('node:crypto');

const generated = await promisify(generateKeyPair)('ml-kem-768');

// Export the raw seed (64 bytes for ML-KEM).
const seed = generated.privateKey.export({ format: 'raw-seed' });

// Import the raw seed.
const privateKey = createPrivateKey({
  key: seed,
  format: 'raw-seed',
  asymmetricKeyType: 'ml-kem-768',
});

const { ciphertext } = encapsulate(generated.publicKey);
decapsulate(privateKey, ciphertext);
```

## Class: `Certificate`

SPKAC က Netscape က မူလ အကောင်အထည်ဖော်ခဲ့ပြီး HTML5 ရဲ့ `keygen` element ၏
အစိတ်အပိုင်း တစ်ခုအနေနဲ့ တရားဝင် သတ်မှတ်ခဲ့တဲ့ Certificate Signing Request
ယန္တရား တစ်ခုပါ။

`<keygen>` က [HTML 5.2][] ကတည်းက deprecated (အသုံးမပြုရန် သတ်မှတ်ထားသော)
ဖြစ်နေပြီး project အသစ်တွေမှာ ဒီ element ကို နောက်ထပ် မသုံးသင့်တော့ပါဘူး။

`node:crypto` module က SPKAC data တွေနဲ့ အလုပ်လုပ်ဖို့ `Certificate` class ကို
ပံ့ပိုးပေးပါတယ်။ အသုံးအများဆုံးကတော့ HTML5 `<keygen>` element က ထုတ်ပေးတဲ့
output တွေကို ကိုင်တွယ်ခြင်း ဖြစ်ပါတယ်။ Node.js က အတွင်းပိုင်းမှာ
[OpenSSL's SPKAC implementation][] ကို သုံးပါတယ်။

### Static method: `Certificate.exportChallenge(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {Buffer} `spkac` data structure ရဲ့ challenge component ဖြစ်ပါတယ် —
  ၎င်းမှာ public key နဲ့ challenge တစ်ခု ပါဝင်ပါတယ်။

```mjs
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```cjs
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

### Static method: `Certificate.exportPublicKey(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {Buffer} `spkac` data structure ရဲ့ public key component ဖြစ်ပါတယ် —
  ၎င်းမှာ public key နဲ့ challenge တစ်ခု ပါဝင်ပါတယ်။

```mjs
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```cjs
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

### Static method: `Certificate.verifySpkac(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {boolean} ပေးထားတဲ့ `spkac` data structure က တရားဝင် (valid) ဖြစ်ရင်
  `true` — မဟုတ်ရင် `false` ပါ။

```mjs
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```cjs
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

### Legacy API (ရှေးဟောင်း API)

> Stability: 0 - Deprecated

Legacy interface တစ်ခုအနေနဲ့ အောက်က ဥပမာတွေမှာ ဖော်ပြထားသလို
`crypto.Certificate` class ရဲ့ instance အသစ်တွေကို ဖန်တီးနိုင်ပါတယ်။

#### `new crypto.Certificate()`

`Certificate` class ရဲ့ instances တွေကို `new` keyword သုံးပြီး သို့မဟုတ်
`crypto.Certificate()` ကို function တစ်ခုအနေနဲ့ ခေါ်ပြီး ဖန်တီးနိုင်ပါတယ်:

```mjs
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```cjs
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

#### `certificate.exportChallenge(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {Buffer} `spkac` data structure ရဲ့ challenge component ဖြစ်ပါတယ် —
  ၎င်းမှာ public key နဲ့ challenge တစ်ခု ပါဝင်ပါတယ်။

```mjs
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```cjs
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

#### `certificate.exportPublicKey(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {Buffer} `spkac` data structure ရဲ့ public key component ဖြစ်ပါတယ် —
  ၎င်းမှာ public key နဲ့ challenge တစ်ခု ပါဝင်ပါတယ်။

```mjs
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```cjs
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

#### `certificate.verifySpkac(spkac[, encoding])`

* `spkac` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `spkac` string ရဲ့ [encoding][] ပါ။
* Returns: {boolean} ပေးထားတဲ့ `spkac` data structure က တရားဝင် (valid) ဖြစ်ရင်
  `true` — မဟုတ်ရင် `false` ပါ။

```mjs
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```cjs
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

## Class: `Cipheriv`

* Extends: {stream.Transform}

`Cipheriv` class ရဲ့ instances တွေက data တွေကို encrypt (ကုဒ်ဝှက်) လုပ်ဖို့
သုံးပါတယ်။ ဒီ class ကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* readable ရော writable ပါ ဖြစ်တဲ့ [stream][] တစ်ခုအနေနဲ့ — plain
  (ကုဒ်မဝှက်ရသေး) data တွေကို ရေးသားလိုက်ရင် readable side မှာ encrypted data
  တွေ ထွက်ပေါ်လာစေပြီး၊
* ဒါမှမဟုတ် [`cipher.update()`][] နဲ့ [`cipher.final()`][] methods တွေကို
  သုံးပြီး encrypted data တွေကို ထုတ်လုပ်ခြင်း ဖြစ်ပါတယ်။

`Cipheriv` instances တွေကို ဖန်တီးဖို့ [`crypto.createCipheriv()`][] method ကို
သုံးပါတယ်။ `Cipheriv` objects တွေကို `new` keyword သုံးပြီး တိုက်ရိုက်
ဖန်တီးလို့ မရပါဘူး။

ဥပမာ: `Cipheriv` objects တွေကို streams တွေအနေနဲ့ သုံးခြင်း:

```mjs
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

```cjs
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

ဥပမာ: `Cipheriv` နဲ့ piped streams တွေကို သုံးခြင်း:

```mjs
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```cjs
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

ဥပမာ: [`cipher.update()`][] နဲ့ [`cipher.final()`][] methods တွေကို သုံးခြင်း:

```mjs
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```cjs
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

### `cipher.final([outputEncoding])`

* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string} ကျန်ရှိနေသေးတဲ့ enciphered contents တွေပါ။
  `outputEncoding` ကို သတ်မှတ်ထားရင် string တစ်ခုကို ပြန်ပေးပြီး —
  `outputEncoding` မပေးထားရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

[`cipher.update()`][] ဆီကို အရင်က ခေါ်ခဲ့တုန်းက output encoding တစ်ခု သတ်မှတ်ခဲ့ဖူးရင်
`outputEncoding` မှာလည်း အဲဒီ encoding တစ်ခုတည်းကိုပဲ သုံးရပါမယ်။

`cipher.final()` method ကို ခေါ်လိုက်ပြီးတာနဲ့ `Cipheriv` object ကို data တွေ
encrypt လုပ်ဖို့ နောက်ထပ် မသုံးနိုင်တော့ပါဘူး။ `cipher.final()` ကို တစ်ကြိမ်ထက်ပိုပြီး
ခေါ်ဖို့ ကြိုးစားရင် error တစ်ခု throw လုပ်ခံရမှာ ဖြစ်ပါတယ်။

### `cipher.getAuthTag()`

* Returns: {Buffer} Authenticated encryption mode (`GCM`, `CCM`, `OCB`, `SIV`,
  `GCM-SIV` နဲ့ `chacha20-poly1305` တို့ကို လက်ရှိ support လုပ်ထားပါတယ်) ကို
  သုံးနေတဲ့အခါ `cipher.getAuthTag()` method က ပေးထားတဲ့ data ကနေ တွက်ချက်ထားတဲ့
  _authentication tag_ (အထောက်အထား စိစစ်ခြင်း tag) ပါဝင်တဲ့ [`Buffer`][]
  တစ်ခုကို ပြန်ပေးပါတယ်။

`cipher.getAuthTag()` method ကို [`cipher.final()`][] method သုံးပြီး encryption
ပြီးဆုံးသွားပြီးမှသာ ခေါ်သင့်ပါတယ်။

`cipher` instance ကို ဖန်တီးစဉ်က `authTagLength` option သတ်မှတ်ထားခဲ့ရင် ဒီ
function က `authTagLength` bytes အတိအကျကို ပြန်ပေးမှာ ဖြစ်ပါတယ်။

### `cipher.setAAD(buffer[, options])`

* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `options` {Object} [`stream.transform` options][]
  * `plaintextLength` {number}
  * `encoding` {string} `buffer` က string ဖြစ်တဲ့အခါ သုံးရမယ့် string encoding ပါ။
* Returns: {Cipheriv} Method chaining အတွက် တူညီတဲ့ `Cipheriv` instance ကိုပဲ
  ပြန်ပေးပါတယ်။

Authenticated encryption mode (`GCM`, `CCM`, `OCB`, `SIV`, `GCM-SIV` နဲ့
`chacha20-poly1305` တို့ကို လက်ရှိ support လုပ်ထားပါတယ်) ကို သုံးနေတဲ့အခါ
`cipher.setAAD()` method က _additional authenticated data_ (AAD) input parameter
အတွက် သုံးမယ့် တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။

`plaintextLength` option က `GCM`, `OCB`, `SIV` နဲ့ `GCM-SIV` တို့အတွက်တော့
optional ပါ။ `CCM` ကို သုံးတဲ့အခါ `plaintextLength` option ကို သတ်မှတ်ပေးရမှာ
ဖြစ်ပြီး ၎င်းရဲ့ တန်ဖိုးက plaintext ရဲ့ byte အရှည်နဲ့ ကိုက်ညီရပါမယ်။
[CCM mode][] ကို ကြည့်ပါ။

`cipher.setAAD()` method ကို [`cipher.update()`][] မခေါ်ခင် ခေါ်ပေးရပါမယ်။

### `cipher.setAutoPadding([autoPadding])`

* `autoPadding` {boolean} **Default:** `true`
* Returns: {Cipheriv} Method chaining အတွက် တူညီတဲ့ `Cipheriv` instance ကိုပဲ
  ပြန်ပေးပါတယ်။

Block encryption algorithms တွေကို သုံးတဲ့အခါ `Cipheriv` class က input data
ထဲကို သင့်လျော်တဲ့ block size အထိ padding ကို အလိုအလျောက် ထည့်ပေးပါတယ်။
Default padding ကို ပိတ်ချင်ရင် `cipher.setAutoPadding(false)` ကို ခေါ်ပါ။

`autoPadding` က `false` ဖြစ်နေတဲ့အခါ input data တစ်ခုလုံးရဲ့ အရှည်က cipher ရဲ့
block size ရဲ့ အဆ (multiple) ဖြစ်ရပါမယ် — မဟုတ်ရင် [`cipher.final()`][] က
error တစ်ခု throw လုပ်မှာ ဖြစ်ပါတယ်။ Automatic padding ကို ပိတ်ထားခြင်းက
standard မဟုတ်တဲ့ padding တွေအတွက် အသုံးဝင်ပါတယ် — ဥပမာ PKCS padding အစား
`0x0` ကို သုံးတာမျိုးပါ။

`cipher.setAutoPadding()` method ကို [`cipher.final()`][] မခေါ်ခင်
ခေါ်ပေးရပါမယ်။

### `cipher.update(data[, inputEncoding][, outputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} Data ရဲ့ [encoding][] ပါ။
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

`data` နဲ့ cipher ကို update လုပ်ပါတယ်။ `inputEncoding` argument ပေးထားရင်
`data` argument က သတ်မှတ်ထားတဲ့ encoding ကို သုံးထားတဲ့ string တစ်ခု ဖြစ်ပါတယ်။
`inputEncoding` argument မပေးထားဘူးဆိုရင် `data` က [`Buffer`][], `TypedArray`
သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရပါမယ်။ `data` က [`Buffer`][], `TypedArray`
သို့မဟုတ် `DataView` ဖြစ်နေရင် `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

`outputEncoding` က enciphered data တွေရဲ့ output format ကို သတ်မှတ်ပေးပါတယ်။
`outputEncoding` သတ်မှတ်ထားရင် သတ်မှတ်ထားတဲ့ encoding ကို သုံးထားတဲ့ string
တစ်ခုကို ပြန်ပေးပြီး — `outputEncoding` မပေးထားရင်တော့ [`Buffer`][] တစ်ခုကို
ပြန်ပေးပါတယ်။ `outputEncoding` သတ်မှတ်ထားတဲ့အခါ ၎င်းက `cipher.update()` ဆီကို
အရင်က ခေါ်ခဲ့တုန်းက သုံးခဲ့တဲ့ encoding နဲ့ တူညီတဲ့ encoding ကိုပဲ သုံးရပါမယ်။

`cipher.update()` method ကို [`cipher.final()`][] ခေါ်တဲ့အထိ data အသစ်တွေနဲ့
အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ [`cipher.final()`][] ပြီးမှ `cipher.update()` ကို
ခေါ်လိုက်ရင် error တစ်ခု throw လုပ်ခံရမှာ ဖြစ်ပါတယ်။

## Class: `Decipheriv`

* Extends: {stream.Transform}

`Decipheriv` class ရဲ့ instances တွေက data တွေကို decrypt (ကုဒ်ဖော်) လုပ်ဖို့
သုံးပါတယ်။ ဒီ class ကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* readable ရော writable ပါ ဖြစ်တဲ့ [stream][] တစ်ခုအနေနဲ့ — encrypted data
  တွေကို ရေးသားလိုက်ရင် readable side မှာ unencrypted data တွေ ထွက်ပေါ်လာစေပြီး၊
* ဒါမှမဟုတ် [`decipher.update()`][] နဲ့ [`decipher.final()`][] methods တွေကို
  သုံးပြီး unencrypted data တွေကို ထုတ်လုပ်ခြင်း ဖြစ်ပါတယ်။

`Decipheriv` instances တွေကို ဖန်တီးဖို့ [`crypto.createDecipheriv()`][] method
ကို သုံးပါတယ်။ `Decipheriv` objects တွေကို `new` keyword သုံးပြီး တိုက်ရိုက်
ဖန်တီးလို့ မရပါဘူး။

ဥပမာ: `Decipheriv` objects တွေကို streams တွေအနေနဲ့ သုံးခြင်း:

```mjs
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```cjs
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

ဥပမာ: `Decipheriv` နဲ့ piped streams တွေကို သုံးခြင်း:

```mjs
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```cjs
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

ဥပမာ: [`decipher.update()`][] နဲ့ [`decipher.final()`][] methods တွေကို သုံးခြင်း:

```mjs
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```cjs
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

### `decipher.final([outputEncoding])`

* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string} ကျန်ရှိနေသေးတဲ့ deciphered contents တွေပါ။
  `outputEncoding` ကို သတ်မှတ်ထားရင် string တစ်ခုကို ပြန်ပေးပြီး —
  `outputEncoding` မပေးထားရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

[`decipher.update()`][] ဆီကို အရင်က ခေါ်ခဲ့တုန်းက output encoding တစ်ခု သတ်မှတ်ခဲ့ဖူးရင်
`outputEncoding` မှာလည်း အဲဒီ encoding တစ်ခုတည်းကိုပဲ သုံးရပါမယ်။

`decipher.final()` method ကို ခေါ်လိုက်ပြီးတာနဲ့ `Decipheriv` object ကို data တွေ
decrypt လုပ်ဖို့ နောက်ထပ် မသုံးနိုင်တော့ပါဘူး။ `decipher.final()` ကို တစ်ကြိမ်ထက်ပိုပြီး
ခေါ်ဖို့ ကြိုးစားရင် error တစ်ခု throw လုပ်ခံရမှာ ဖြစ်ပါတယ်။

### `decipher.setAAD(buffer[, options])`

* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `options` {Object} [`stream.transform` options][]
  * `plaintextLength` {number}
  * `encoding` {string} `buffer` က string ဖြစ်တဲ့အခါ သုံးရမယ့် string encoding ပါ။
* Returns: {Decipheriv} Method chaining အတွက် တူညီတဲ့ `Decipheriv` instance ကိုပဲ
  ပြန်ပေးပါတယ်။

Authenticated encryption mode (`GCM`, `CCM`, `OCB`, `SIV`, `GCM-SIV` နဲ့
`chacha20-poly1305` တို့ကို လက်ရှိ support လုပ်ထားပါတယ်) ကို သုံးနေတဲ့အခါ
`decipher.setAAD()` method က _additional authenticated data_ (AAD) input parameter
အတွက် သုံးမယ့် တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။

`options` argument က `GCM`, `OCB`, `SIV` နဲ့ `GCM-SIV` တို့အတွက်တော့ optional ပါ။
`CCM` ကို သုံးတဲ့အခါ `plaintextLength` option ကို သတ်မှတ်ပေးရမှာ ဖြစ်ပြီး ၎င်းရဲ့
တန်ဖိုးက ciphertext ရဲ့ byte အရှည်နဲ့ ကိုက်ညီရပါမယ်။ [CCM mode][] ကို ကြည့်ပါ။

`decipher.setAAD()` method ကို [`decipher.update()`][] မခေါ်ခင် ခေါ်ပေးရပါမယ်။

`buffer` အဖြစ် string တစ်ခုကို ဖြတ်သန်းပေးတဲ့အခါ
[caveats when using strings as inputs to cryptographic APIs][] မှာ ဖော်ပြထားတဲ့
သတိထားစရာတွေကို ထည့်သွင်း စဉ်းစားပေးပါ။

### `decipher.setAuthTag(buffer[, encoding])`

* `buffer` {string|Buffer|ArrayBuffer|TypedArray|DataView}
* `encoding` {string} `buffer` က string ဖြစ်တဲ့အခါ သုံးရမယ့် string encoding ပါ။
* Returns: {Decipheriv} Method chaining အတွက် တူညီတဲ့ `Decipheriv` instance ကိုပဲ
  ပြန်ပေးပါတယ်။

Authenticated encryption mode (`GCM`, `CCM`, `OCB`, `SIV`, `GCM-SIV` နဲ့
`chacha20-poly1305` တို့ကို လက်ရှိ support လုပ်ထားပါတယ်) ကို သုံးနေတဲ့အခါ
`decipher.setAuthTag()` method က လက်ခံရရှိထားတဲ့ _authentication tag_ ကို
ထည့်သွင်းပေးဖို့ သုံးပါတယ်။ Tag မပေးထားဘူးဆိုရင် သို့မဟုတ် cipher text ကို
ဝင်ရောက် ဖျက်ဆီး (tamper) လုပ်ထားခဲ့ရင် [`decipher.final()`][] က throw လုပ်ပြီး —
authentication မအောင်မြင်လို့ cipher text ကို ပစ်ပယ်သင့်ကြောင်း ဖော်ပြပါတယ်။
Tag ရဲ့ အရှည်က [NIST SP 800-38D][] အရ တရားဝင် မဟုတ်ဘူးဆိုရင် သို့မဟုတ်
`authTagLength` option ရဲ့ တန်ဖိုးနဲ့ မကိုက်ညီဘူးဆိုရင် `decipher.setAuthTag()` က
error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

`decipher.setAuthTag()` method ကို `CCM`, `SIV` နဲ့ `GCM-SIV` modes တွေအတွက်ဆိုရင်
[`decipher.update()`][] မခေါ်ခင် ခေါ်ပေးရပြီး — `GCM` နဲ့ `OCB` modes တွေနဲ့
`chacha20-poly1305` အတွက်ဆိုရင် [`decipher.final()`][] မခေါ်ခင် ခေါ်ပေးရပါတယ်။
`decipher.setAuthTag()` ကို တစ်ကြိမ်တည်းသာ ခေါ်လို့ ရပါတယ်။

Authentication tag အဖြစ် string တစ်ခုကို ဖြတ်သန်းပေးတဲ့အခါ
[caveats when using strings as inputs to cryptographic APIs][] မှာ ဖော်ပြထားတဲ့
သတိထားစရာတွေကို ထည့်သွင်း စဉ်းစားပေးပါ။

### `decipher.setAutoPadding([autoPadding])`

* `autoPadding` {boolean} **Default:** `true`
* Returns: {Decipheriv} Method chaining အတွက် တူညီတဲ့ `Decipheriv` instance ကိုပဲ
  ပြန်ပေးပါတယ်။

Data တွေကို standard block padding မပါပဲ encrypt လုပ်ထားတဲ့အခါ
`decipher.setAutoPadding(false)` ကို ခေါ်လိုက်တာက automatic padding ကို
ပိတ်ပေးပြီး — [`decipher.final()`][] က padding ရှိမရှိ စစ်ဆေးခြင်းနဲ့ ဖယ်ရှားခြင်းတွေကို
မလုပ်မိအောင် ကာကွယ်ပေးပါတယ်။

Auto padding ကို ပိတ်ထားခြင်းက input data ရဲ့ အရှည်က cipher ရဲ့ block size ရဲ့
အဆ ဖြစ်နေမှသာ အလုပ်လုပ်ပါလိမ့်မယ်။

`decipher.setAutoPadding()` method ကို [`decipher.final()`][] မခေါ်ခင်
ခေါ်ပေးရပါမယ်။

### `decipher.update(data[, inputEncoding][, outputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `data` string ရဲ့ [encoding][] ပါ။
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

`data` နဲ့ decipher ကို update လုပ်ပါတယ်။ `inputEncoding` argument ပေးထားရင်
`data` argument က သတ်မှတ်ထားတဲ့ encoding ကို သုံးထားတဲ့ string တစ်ခု ဖြစ်ပါတယ်။
`inputEncoding` argument မပေးထားဘူးဆိုရင် `data` က [`Buffer`][] တစ်ခု ဖြစ်ရပါမယ်။
`data` က [`Buffer`][] ဖြစ်နေရင် `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

`outputEncoding` က enciphered data တွေရဲ့ output format ကို သတ်မှတ်ပေးပါတယ်။
`outputEncoding` သတ်မှတ်ထားရင် သတ်မှတ်ထားတဲ့ encoding ကို သုံးထားတဲ့ string
တစ်ခုကို ပြန်ပေးပြီး — `outputEncoding` မပေးထားရင်တော့ [`Buffer`][] တစ်ခုကို
ပြန်ပေးပါတယ်။ `outputEncoding` သတ်မှတ်ထားတဲ့အခါ ၎င်းက `decipher.update()` ဆီကို
အရင်က ခေါ်ခဲ့တုန်းက သုံးခဲ့တဲ့ encoding နဲ့ တူညီတဲ့ encoding ကိုပဲ သုံးရပါမယ်။

`decipher.update()` method ကို [`decipher.final()`][] ခေါ်တဲ့အထိ data အသစ်တွေနဲ့
အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ [`decipher.final()`][] ပြီးမှ `decipher.update()` ကို
ခေါ်လိုက်ရင် error တစ်ခု throw လုပ်ခံရမှာ ဖြစ်ပါတယ်။

Underlying cipher က authentication ကို အကောင်အထည်ဖော်ထားရင်တောင် ဒီ function ကနေ
ပြန်ပေးလိုက်တဲ့ plaintext ရဲ့ authenticity (စစ်မှန်မှု) နဲ့ integrity
(ပကတိအတိုင်း မပျက်မစီး ရှိမှု) က အဲဒီအချိန်မှာ မသေချာနိုင်ပါဘူး။ Authenticated
encryption algorithms တွေအတွက်ဆိုရင် application က [`decipher.final()`][] ကို
ခေါ်မှသာ authenticity က ယေဘုယျအားဖြင့် အတည်ပြုနိုင်ပါတယ်။

## Class: `DiffieHellman`

`DiffieHellman` class က Diffie-Hellman key exchanges (သော့ချင်း ဖလှယ်မှုများ)
တွေကို ဖန်တီးဖို့အတွက် utility တစ်ခုပါ။

`DiffieHellman` class ရဲ့ instances တွေကို [`crypto.createDiffieHellman()`][]
function ကို သုံးပြီး ဖန်တီးနိုင်ပါတယ်။

```mjs
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```cjs
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])`

* `otherPublicKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `otherPublicKey` string တစ်ခုရဲ့ [encoding][] ပါ။
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

`otherPublicKey` ကို အခြားဘက်အဖွဲ့ရဲ့ public key အဖြစ် သုံးပြီး shared secret ကို
တွက်ချက်ကာ — တွက်ချက်လို့ ရလာတဲ့ shared secret ကို ပြန်ပေးပါတယ်။ ပေးလိုက်တဲ့ key
ကို သတ်မှတ်ထားတဲ့ `inputEncoding` နဲ့ အနက်ဖွင့်ပြီး secret ကို သတ်မှတ်ထားတဲ့
`outputEncoding` နဲ့ encode လုပ်ပါတယ်။ `inputEncoding` မပေးထားဘူးဆိုရင်
`otherPublicKey` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမှာ
ဖြစ်ပါတယ်။

`outputEncoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မပေးထားရင်တော့
[`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

### `diffieHellman.generateKeys([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Private နဲ့ public Diffie-Hellman key values တွေကို — အရင်က generate လုပ်ပြီးသား
သို့မဟုတ် တွက်ချက်ပြီးသား မဖြစ်ဘူးဆိုရင် — generate လုပ်ပြီး public key ကို
သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ပြန်ပေးပါတယ်။ ဒီ key ကို အခြားဘက်အဖွဲ့ဆီကို
လွှဲပြောင်းပေးသင့်ပါတယ်။ `encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး —
မပေးထားရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ function က [`DH_generate_key()`][] ရဲ့ အပေါ်မှာ ပါးလွှာတဲ့ (thin) wrapper
တစ်ခုပါ။ အထူးသဖြင့် — private key တစ်ခု generate လုပ်ပြီး သို့မဟုတ်
သတ်မှတ်ပြီးတာနဲ့ ဒီ function ကို ခေါ်လိုက်ရင် ရှိပြီးသား private key ကနေ public
key ကိုသာ ပြန်လည် တွက်ချက်ပေးပါတယ်။ Public key က private key ပေါ်မှာ
မူတည်တာမို့ — [`diffieHellman.setPrivateKey()`][] ကနေတစ်ဆင့် private key ကို
ပြောင်းလဲမထားသရွေ့ ရလဒ်က အတူတူပဲ ဖြစ်ပါလိမ့်မယ်။

### `diffieHellman.getGenerator([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Diffie-Hellman generator ကို သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ပြန်ပေးပါတယ်။
`encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မပေးထားရင်တော့ [`Buffer`][]
တစ်ခုကို ပြန်ပေးပါတယ်။

### `diffieHellman.getPrime([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Diffie-Hellman prime ကို သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ပြန်ပေးပါတယ်။
`encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မပေးထားရင်တော့ [`Buffer`][]
တစ်ခုကို ပြန်ပေးပါတယ်။

### `diffieHellman.getPrivateKey([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Diffie-Hellman private key ကို သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ပြန်ပေးပါတယ်။
`encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မပေးထားရင်တော့ [`Buffer`][]
တစ်ခုကို ပြန်ပေးပါတယ်။

### `diffieHellman.getPublicKey([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Diffie-Hellman public key ကို သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ပြန်ပေးပါတယ်။
`encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မပေးထားရင်တော့ [`Buffer`][]
တစ်ခုကို ပြန်ပေးပါတယ်။

### `diffieHellman.setPrivateKey(privateKey[, encoding])`

* `privateKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `privateKey` string ရဲ့ [encoding][] ပါ။

Diffie-Hellman private key ကို သတ်မှတ်ပေးပါတယ်။ `encoding` argument ပေးထားရင်
`privateKey` က string တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး — `encoding` မပေးထားရင်
`privateKey` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမှာ
ဖြစ်ပါတယ်။

ဒီ function က ဆက်စပ်နေတဲ့ public key ကို အလိုအလျောက် တွက်ချက်ပေးမှာ
မဟုတ်ပါဘူး။ Public key ကို ကိုယ်တိုင် ပေးအပ်ဖို့ သို့မဟုတ် အလိုအလျောက်
ဆင်းသက်ယူဖို့ [`diffieHellman.setPublicKey()`][] သို့မဟုတ်
[`diffieHellman.generateKeys()`][] ကို သုံးနိုင်ပါတယ်။

### `diffieHellman.setPublicKey(publicKey[, encoding])`

* `publicKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `publicKey` string ရဲ့ [encoding][] ပါ။

Diffie-Hellman public key ကို သတ်မှတ်ပေးပါတယ်။ `encoding` argument ပေးထားရင်
`publicKey` က string တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး — `encoding` မပေးထားရင်
`publicKey` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမှာ
ဖြစ်ပါတယ်။

### `diffieHellman.verifyError`

`DiffieHellman` object ကို initialize လုပ်စဉ်က လုပ်ဆောင်တဲ့ စစ်ဆေးမှုတစ်ခုကနေ
ထွက်ပေါ်လာတဲ့ warnings နဲ့/သို့မဟုတ် errors တွေ ပါဝင်တဲ့ bit field တစ်ခုပါ။

ဒီ property အတွက် တရားဝင်တဲ့ တန်ဖိုးတွေကတော့ (`node:constants` module မှာ
သတ်မှတ်ထားသလို):

* `DH_CHECK_P_NOT_SAFE_PRIME`
* `DH_CHECK_P_NOT_PRIME`
* `DH_UNABLE_TO_CHECK_GENERATOR`
* `DH_NOT_SUITABLE_GENERATOR`

## Class: `DiffieHellmanGroup`

`DiffieHellmanGroup` class က လူသိများတဲ့ modp group တစ်ခုကို argument အဖြစ်
လက်ခံပါတယ်။ ၎င်းက `DiffieHellman` နဲ့ အတူတူပဲ အလုပ်လုပ်ပေမယ့် ဖန်တီးပြီးနောက်မှာ
၎င်းရဲ့ keys တွေကို ပြောင်းလဲခွင့် မပြုပါဘူး။ တစ်နည်းပြောရရင် `setPublicKey()`
သို့မဟုတ် `setPrivateKey()` methods တွေကို အကောင်အထည်မဖော်ပါဘူး။

```mjs
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```cjs
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

အောက်ပါ groups တွေကို support လုပ်ပါတယ်:

* `'modp14'` (2048 bits, [RFC 3526][] Section 3)
* `'modp15'` (3072 bits, [RFC 3526][] Section 4)
* `'modp16'` (4096 bits, [RFC 3526][] Section 5)
* `'modp17'` (6144 bits, [RFC 3526][] Section 6)
* `'modp18'` (8192 bits, [RFC 3526][] Section 7)

အောက်ပါ groups တွေကိုတော့ ဆက်လက် support လုပ်ထားပေမယ့် deprecated
(ခေတ်နောက်ကျသွားပြီ) ဖြစ်ပါတယ် ([Caveats][] ကို ကြည့်ပါ):

* `'modp1'` (768 bits, [RFC 2409][] Section 6.1) 
* `'modp2'` (1024 bits, [RFC 2409][] Section 6.2) 
* `'modp5'` (1536 bits, [RFC 3526][] Section 2) 

ဒီ deprecated groups တွေကို Node.js ရဲ့ အနာဂတ် versions တွေမှာ ဖယ်ရှားပစ်နိုင်ပါတယ်။

## Class: `ECDH`

`ECDH` class က Elliptic Curve Diffie-Hellman (ECDH) key exchanges တွေကို
ဖန်တီးဖို့အတွက် utility တစ်ခုပါ။

`ECDH` class ရဲ့ instances တွေကို [`crypto.createECDH()`][] function ကို
သုံးပြီး ဖန်တီးနိုင်ပါတယ်။

```mjs
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Generate Alice's keys...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```cjs
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Generate Alice's keys...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

### Static method: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])`

* `key` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `curve` {string}
* `inputEncoding` {string} `key` string ရဲ့ [encoding][] ပါ။
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* `format` {string} **Default:** `'uncompressed'`
* Returns: {Buffer | string}

`key` နဲ့ `curve` နဲ့ သတ်မှတ်ထားတဲ့ EC Diffie-Hellman public key ကို — `format` က သတ်မှတ်ထားတဲ့ format ဆီကို ပြောင်းလဲပေးပါတယ်။ `format` argument က point encoding (EC point တစ်ခုကို bytes အဖြစ် ကိုယ်စားပြုပုံ) ကို သတ်မှတ်ပေးပြီး — `'compressed'`, `'uncompressed'` သို့မဟုတ် `'hybrid'` ဖြစ်နိုင်ပါတယ်။ ပေးလိုက်တဲ့ key ကို သတ်မှတ်ထားတဲ့ `inputEncoding` ကို သုံးပြီး အဓိပ္ပာယ်ကောက်ယူပြီး — ပြန်ပေးလိုက်တဲ့ key ကိုတော့ သတ်မှတ်ထားတဲ့ `outputEncoding` နဲ့ encode လုပ်ပါတယ်။

ရနိုင်တဲ့ curve names တွေရဲ့ စာရင်းကို ရယူဖို့ [`crypto.getCurves()`][] ကို သုံးပါ။ OpenSSL ရဲ့ မကြာသေးတဲ့ releases တွေမှာ — `openssl ecparam -list_curves` က ရနိုင်တဲ့ elliptic curve တစ်ခုချင်းစီရဲ့ name နဲ့ description ကိုလည်း ဖော်ပြပေးပါလိမ့်မယ်။

`format` ကို သတ်မှတ်မထားဘူးဆိုရင် — point ကို `'uncompressed'` format နဲ့ ပြန်ပေးပါလိမ့်မယ်။

`inputEncoding` ကို မပေးထားဘူးဆိုရင် — `key` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပါတယ်။

ဥပမာ (key တစ်ခုကို uncompressed ဖြစ်အောင် ပြောင်းခြင်း):

```mjs
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// The converted key and the uncompressed public key should be the same
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```cjs
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// The converted key and the uncompressed public key should be the same
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])`

* `otherPublicKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `otherPublicKey` string ရဲ့ [encoding][] ပါ။
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

`otherPublicKey` ကို တစ်ဖက်လူရဲ့ public key အဖြစ် သုံးပြီး shared secret ကို တွက်ချက်ကာ — တွက်ချက်ပြီးသား shared secret ကို ပြန်ပေးပါတယ်။ ပေးလိုက်တဲ့ key ကို သတ်မှတ်ထားတဲ့ `inputEncoding` ကို သုံးပြီး အဓိပ္ပာယ်ကောက်ယူပြီး — ပြန်ပေးလိုက်တဲ့ secret ကိုတော့ သတ်မှတ်ထားတဲ့ `outputEncoding` နဲ့ encode လုပ်ပါတယ်။ `inputEncoding` ကို မပေးထားဘူးဆိုရင် — `otherPublicKey` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပါတယ်။

`outputEncoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

`otherPublicKey` က elliptic curve ရဲ့ အပြင်ဘက်မှာ ရှိနေရင် — `ecdh.computeSecret` က `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ `otherPublicKey` က ပုံမှန်အားဖြင့် — လုံခြုံမှု မရှိတဲ့ network တစ်ခုကနေတစ်ဆင့် — အဝေးက user တစ်ဦးဆီကနေ လာတာမို့ — ဒီ exception ကို သင့်လျော်စွာ ကိုင်တွယ်ဖို့ သေချာပြုလုပ်ပါ။

### `ecdh.generateKeys([encoding[, format]])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* `format` {string} **Default:** `'uncompressed'`
* Returns: {Buffer | string}

Private ရော public ရော EC Diffie-Hellman key values တွေကို ထုတ်လုပ်ပြီး — သတ်မှတ်ထားတဲ့ `format` နဲ့ `encoding` နဲ့ public key ကို ပြန်ပေးပါတယ်။ ဒီ key ကို တစ်ဖက်လူဆီကို လွှဲပြောင်းပေးသင့်ပါတယ်။

`format` argument က point encoding ကို သတ်မှတ်ပေးပြီး — `'compressed'` သို့မဟုတ် `'uncompressed'` ဖြစ်နိုင်ပါတယ်။ `format` ကို သတ်မှတ်မထားဘူးဆိုရင် — point ကို `'uncompressed'` format နဲ့ ပြန်ပေးပါလိမ့်မယ်။

`encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

### `ecdh.getPrivateKey([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string} သတ်မှတ်ထားတဲ့ `encoding` နဲ့ ဖော်ပြထားတဲ့ EC Diffie-Hellman ပါ။

`encoding` ကို သတ်မှတ်ထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

### `ecdh.getPublicKey([encoding][, format])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* `format` {string} **Default:** `'uncompressed'`
* Returns: {Buffer | string} သတ်မှတ်ထားတဲ့ `encoding` နဲ့ `format` နဲ့ EC Diffie-Hellman public key ပါ။

`format` argument က point encoding ကို သတ်မှတ်ပေးပြီး — `'compressed'` သို့မဟုတ် `'uncompressed'` ဖြစ်နိုင်ပါတယ်။ `format` ကို သတ်မှတ်မထားဘူးဆိုရင် — point ကို `'uncompressed'` format နဲ့ ပြန်ပေးပါလိမ့်မယ်။

`encoding` ကို သတ်မှတ်ထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

### `ecdh.setPrivateKey(privateKey[, encoding])`

* `privateKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `privateKey` string ရဲ့ [encoding][] ပါ။

EC Diffie-Hellman private key ကို သတ်မှတ်ပေးပါတယ်။ `encoding` ပေးထားရင် — `privateKey` က string တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပြီး — မဟုတ်ရင်တော့ `privateKey` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပါတယ်။

`privateKey` က — `ECDH` object ကို ဖန်တီးတဲ့အခါ သတ်မှတ်ထားတဲ့ curve အတွက် — တရားဝင် (valid) မဟုတ်ဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါတယ်။ Private key ကို သတ်မှတ်လိုက်တာနဲ့ — ဆက်စပ်နေတဲ့ public point (key) ကိုလည်း ထုတ်လုပ်ပြီး `ECDH` object ထဲမှာ သတ်မှတ်ပေးပါတယ်။

### `ecdh.setPublicKey(publicKey[, encoding])`

> Stability: 0 - Deprecated

* `publicKey` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `publicKey` string ရဲ့ [encoding][] ပါ။

EC Diffie-Hellman public key ကို သတ်မှတ်ပေးပါတယ်။ `encoding` ပေးထားရင် — `publicKey` က string တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပြီး — မဟုတ်ရင်တော့ [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပါတယ်။

Shared secret ကို တွက်ချက်ဖို့ `ECDH` က private key တစ်ခုနဲ့ တစ်ဖက်လူရဲ့ public key တစ်ခုကိုသာ လိုအပ်တာမို့ — ဒီ method ကို ခေါ်ဖို့ အကြောင်းပြချက် ပုံမှန်အားဖြင့် မရှိပါဘူး။ ပုံမှန်အားဖြင့် [`ecdh.generateKeys()`][] သို့မဟုတ် [`ecdh.setPrivateKey()`][] ထဲက တစ်ခုကို ခေါ်ပါလိမ့်မယ်။ [`ecdh.setPrivateKey()`][] method က သတ်မှတ်လိုက်တဲ့ private key နဲ့ ဆက်စပ်နေတဲ့ public point/key ကို ထုတ်လုပ်ဖို့ ကြိုးစားပါတယ်။

ဥပမာ (shared secret တစ်ခု ရယူခြင်း):

```mjs
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
```

```cjs
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
```

## Class: `Hash`

* Extends: {stream.Transform}

`Hash` class က data တွေရဲ့ hash digests တွေကို ဖန်တီးဖို့အတွက် utility တစ်ခုပါ။ ၎င်းကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* readable ရော writable ပါ ဖြစ်တဲ့ [stream][] တစ်ခုအနေနဲ့ — data တွေကို ရေးသားလိုက်ရင် readable side ပေါ်မှာ တွက်ချက်ပြီးသား hash digest တစ်ခု ထွက်ပေါ်စေတဲ့ ပုံစံနဲ့ ဖြစ်စေ၊
* [`hash.update()`][] နဲ့ [`hash.digest()`][] methods တွေကို သုံးပြီး တွက်ချက်ပြီးသား hash ကို ထုတ်လုပ်တဲ့ ပုံစံနဲ့ ဖြစ်စေ သုံးနိုင်ပါတယ်။

`Hash` instances တွေကို ဖန်တီးဖို့ [`crypto.createHash()`][] method ကို သုံးပါတယ်။ `Hash` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

ဥပမာ: `Hash` objects တွေကို streams အဖြစ် သုံးခြင်း:

```mjs
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```cjs
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

ဥပမာ: `Hash` နဲ့ piped streams တွေကို သုံးခြင်း:

```mjs
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```cjs
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

ဥပမာ: [`hash.update()`][] နဲ့ [`hash.digest()`][] methods တွေကို သုံးခြင်း:

```mjs
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```cjs
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

### `hash.copy([options])`

* `options` {Object} [`stream.transform` options][]
* Returns: {Hash}

လက်ရှိ `Hash` object ရဲ့ internal state ရဲ့ deep copy တစ်ခု ပါဝင်တဲ့ `Hash` object အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က stream ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။ `'shake256'` လိုမျိုး XOF hash functions တွေအတွက် — `outputLength` option ကို သုံးပြီး လိုချင်တဲ့ output length ကို bytes နဲ့ သတ်မှတ်ပေးနိုင်ပါတယ်။

[`hash.digest()`][] method ကို ခေါ်ပြီးနောက်မှာ `Hash` object ကို copy လုပ်ဖို့ ကြိုးစားရင် error တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
// Calculate a rolling hash.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```

```cjs
// Calculate a rolling hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```

### `hash.digest([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

Hash လုပ်ဖို့ ဖြတ်သန်းပေးခဲ့တဲ့ data တွေ အားလုံးရဲ့ digest ကို ([`hash.update()`][] method ကို သုံးပြီး) တွက်ချက်ပေးပါတယ်။ `encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

`hash.digest()` method ကို ခေါ်ပြီးနောက်မှာ `Hash` object ကို ပြန်သုံးလို့ မရတော့ပါဘူး။ အကြိမ်များစွာ ခေါ်ရင် error တစ်ခုကို throw လုပ်ခံရပါလိမ့်မယ်။

### `hash.update(data[, inputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `data` string ရဲ့ [encoding][] ပါ။

ပေးထားတဲ့ `data` နဲ့ hash content ကို update လုပ်ပါတယ် — `data` ရဲ့ encoding ကို `inputEncoding` မှာ ဖော်ပြပါတယ်။ `encoding` ကို မပေးထားပဲ `data` က string တစ်ခု ဖြစ်နေရင် — `'utf8'` encoding ကို တွန်းအားပေး (enforce) လုပ်ပါတယ်။ `data` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

Data အသစ်တွေ stream လုပ်ခံရတာနဲ့အမျှ — ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

## Class: `Hmac`

* Extends: {stream.Transform}

`Hmac` class က cryptographic HMAC digests တွေကို ဖန်တီးဖို့အတွက် utility တစ်ခုပါ။ ၎င်းကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* readable ရော writable ပါ ဖြစ်တဲ့ [stream][] တစ်ခုအနေနဲ့ — data တွေကို ရေးသားလိုက်ရင် readable side ပေါ်မှာ တွက်ချက်ပြီးသား HMAC digest တစ်ခု ထွက်ပေါ်စေတဲ့ ပုံစံနဲ့ ဖြစ်စေ၊
* [`hmac.update()`][] နဲ့ [`hmac.digest()`][] methods တွေကို သုံးပြီး တွက်ချက်ပြီးသား HMAC digest ကို ထုတ်လုပ်တဲ့ ပုံစံနဲ့ ဖြစ်စေ သုံးနိုင်ပါတယ်။

`Hmac` instances တွေကို ဖန်တီးဖို့ [`crypto.createHmac()`][] method ကို သုံးပါတယ်။ `Hmac` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

ဥပမာ: `Hmac` objects တွေကို streams အဖြစ် သုံးခြင်း:

```mjs
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```cjs
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

ဥပမာ: `Hmac` နဲ့ piped streams တွေကို သုံးခြင်း:

```mjs
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```cjs
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

ဥပမာ: [`hmac.update()`][] နဲ့ [`hmac.digest()`][] methods တွေကို သုံးခြင်း:

```mjs
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```cjs
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

### `hmac.digest([encoding])`

* `encoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

[`hmac.update()`][] ကို သုံးပြီး ဖြတ်သန်းပေးခဲ့တဲ့ data တွေ အားလုံးရဲ့ HMAC digest ကို တွက်ချက်ပေးပါတယ်။ `encoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

`hmac.digest()` ကို ခေါ်ပြီးနောက်မှာ `Hmac` object ကို ပြန်သုံးလို့ မရတော့ပါဘူး။ `hmac.digest()` ကို အကြိမ်များစွာ ခေါ်ရင် error တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `hmac.update(data[, inputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `data` string ရဲ့ [encoding][] ပါ။

ပေးထားတဲ့ `data` နဲ့ `Hmac` content ကို update လုပ်ပါတယ် — `data` ရဲ့ encoding ကို `inputEncoding` မှာ ဖော်ပြပါတယ်။ `encoding` ကို မပေးထားပဲ `data` က string တစ်ခု ဖြစ်နေရင် — `'utf8'` encoding ကို တွန်းအားပေး လုပ်ပါတယ်။ `data` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

Data အသစ်တွေ stream လုပ်ခံရတာနဲ့အမျှ — ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

## Class: `KeyObject`

Node.js က symmetric သို့မဟုတ် asymmetric key တစ်ခုကို ကိုယ်စားပြုဖို့ `KeyObject` class ကို သုံးပြီး — key အမျိုးအစား တစ်ခုချင်းစီက မတူညီတဲ့ functions တွေကို ထုတ်ဖော်ပေးပါတယ်။ `KeyObject` instances တွေကို ဖန်တီးဖို့ [`crypto.createSecretKey()`][], [`crypto.createPublicKey()`][] နဲ့ [`crypto.createPrivateKey()`][] methods တွေကို သုံးပါတယ်။ `KeyObject` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

Applications အများစုက — ပိုကောင်းမွန်တဲ့ လုံခြုံရေး အင်္ဂါရပ်တွေကြောင့် — keys တွေကို strings သို့မဟုတ် `Buffer`s တွေအနေနဲ့ ဖြတ်သန်းပေးမယ့်အစား — `KeyObject` API အသစ်ကို သုံးဖို့ စဉ်းစားသင့်ပါတယ်။

`KeyObject` instances တွေကို [`postMessage()`][] ကနေတစ်ဆင့် တခြား threads တွေဆီကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ လက်ခံသူ (receiver) က cloned `KeyObject` တစ်ခုကို ရရှိပြီး — `KeyObject` ကို `transferList` argument ထဲမှာ စာရင်းသွင်းထားဖို့ မလိုအပ်ပါဘူး။

### Static method: `KeyObject.from(key)`

* `key` {CryptoKey}
* Returns: {KeyObject}

{CryptoKey} တစ်ခုရဲ့ underlying {KeyObject} ကို ပြန်ပေးပါတယ်။ ပြန်ပေးလိုက်တဲ့ {KeyObject} က — Web Crypto API က မူရင်း {CryptoKey} အပေါ်မှာ ချမှတ်ထားတဲ့ ကန့်သတ်ချက်တွေ — ဥပမာ ခွင့်ပြုထားတဲ့ key usages, algorithm သို့မဟုတ် hash algorithm bindings တွေနဲ့ extractability flag လိုမျိုး — တစ်ခုကိုမှ ဆက်လက် ထိန်းသိမ်းမထားပါဘူး။ အထူးသဖြင့် — ပြန်ပေးလိုက်တဲ့ {KeyObject} ရဲ့ underlying key material ကို အမြဲတမ်း export လုပ်နိုင်ပါတယ်။

```mjs
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

```cjs
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();
```

### `keyObject.asymmetricKeyDetails`

* Type: {Object}
  * `modulusLength` {number} Key size ကို bits နဲ့ ဖော်ပြတာပါ (RSA, DSA)။
  * `publicExponent` {bigint} Public exponent ပါ (RSA)။
  * `hashAlgorithm` {string} Message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `mgf1HashAlgorithm` {string} MGF1 က သုံးတဲ့ message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `saltLength` {number} အနည်းဆုံး salt length ကို bytes နဲ့ ဖော်ပြတာပါ (RSA-PSS)။
  * `divisorLength` {number} `q` ရဲ့ အရွယ်အစားကို bits နဲ့ ဖော်ပြတာပါ (DSA)။
  * `namedCurve` {string} Curve ရဲ့ နာမည်ပါ (EC)။

ဒီ property က asymmetric keys တွေပေါ်မှာသာ တည်ရှိပါတယ်။ Key ရဲ့ type ပေါ်မူတည်ပြီး — ဒီ object မှာ key အကြောင်း အချက်အလက်တွေ ပါဝင်ပါတယ်။ ဒီ property ကနေတစ်ဆင့် ရယူလိုက်တဲ့ အချက်အလက်တွေထဲက ဘယ်အရာမှ — key တစ်ခုကို ထူးခြားစွာ (uniquely) ခွဲခြားသိရှိဖို့ သို့မဟုတ် key ရဲ့ လုံခြုံရေးကို ထိခိုက်စေဖို့ — သုံးလို့ မရပါဘူး။

RSA-PSS keys တွေအတွက် — key material မှာ `RSASSA-PSS-params` sequence တစ်ခု ပါဝင်နေရင် — `hashAlgorithm`, `mgf1HashAlgorithm` နဲ့ `saltLength` properties တွေကို သတ်မှတ်ပေးပါလိမ့်မယ်။

တခြား key details တွေကို ဒီ API ကနေတစ်ဆင့် ထပ်ဆောင်း attributes တွေကို သုံးပြီး ထုတ်ဖော်ပြသနိုင်ပါတယ်။

### `keyObject.asymmetricKeyType`

* Type: {string}

Asymmetric keys တွေအတွက် — ဒီ property က key ရဲ့ type ကို ကိုယ်စားပြုပါတယ်။ ပံ့ပိုးထားတဲ့ [asymmetric key types][] ကို ကြည့်ပါ။

ဒီ property က — အသိအမှတ်မပြုနိုင်တဲ့ (unrecognized) `KeyObject` types တွေနဲ့ symmetric keys တွေအတွက်တော့ `undefined` ပါ။

### `keyObject.equals(otherKeyObject)`

* `otherKeyObject` {KeyObject} `keyObject` ကို နှိုင်းယှဉ်ရမယ့် `KeyObject` တစ်ခုပါ။
* Returns: {boolean}

Keys တွေမှာ type, value နဲ့ parameters တွေ အတိအကျ တူညီမှု ရှိ/မရှိပေါ်မူတည်ပြီး `true` သို့မဟုတ် `false` ကို ပြန်ပေးပါတယ်။ ဒီ method က [constant time](https://en.wikipedia.org/wiki/Timing_attack) (အချိန်ကာလ ပုံသေ ကြာမြင့်ခြင်း) လည်း မဟုတ်ပါဘူး။

### `keyObject.export([options])`

* `options` {Object}
* Returns: {string | Buffer | Object}

Symmetric keys တွေအတွက် အောက်ပါ encoding options တွေကို သုံးနိုင်ပါတယ်:

* `format` {string} `'buffer'` (default) သို့မဟုတ် `'jwk'` ဖြစ်ရပါမယ်။

Public keys တွေအတွက် အောက်ပါ encoding options တွေကို သုံးနိုင်ပါတယ်:

* `format` {string} `'pem'`, `'der'`, `'jwk'` သို့မဟုတ် `'raw-public'` ဖြစ်ရပါမယ်။ Format ပံ့ပိုးမှုအတွက် [asymmetric key types][] ကို ကြည့်ပါ။
* `type` {string} `format` က `'pem'` သို့မဟုတ် `'der'` ဖြစ်နေရင် — `'pkcs1'` (RSA အတွက်သာ) သို့မဟုတ် `'spki'` ဖြစ်ရပါမယ်။ `'raw-public'` format နဲ့ EC keys တွေအတွက်တော့ — `'uncompressed'` (default) သို့မဟုတ် `'compressed'` ဖြစ်နိုင်ပါတယ်။ `format` က `'jwk'` ဖြစ်နေရင် လျစ်လျူရှုပါတယ်။

Private keys တွေအတွက် အောက်ပါ encoding options တွေကို သုံးနိုင်ပါတယ်:

* `format` {string} `'pem'`, `'der'`, `'jwk'`, `'raw-private'` သို့မဟုတ် `'raw-seed'` ဖြစ်ရပါမယ်။ Format ပံ့ပိုးမှုအတွက် [asymmetric key types][] ကို ကြည့်ပါ။
* `type` {string} `format` က `'pem'` သို့မဟုတ် `'der'` ဖြစ်နေရင် — `'pkcs1'` (RSA အတွက်သာ), `'pkcs8'` သို့မဟုတ် `'sec1'` (EC အတွက်သာ) ဖြစ်ရပါမယ်။ `format` က `'jwk'`, `'raw-private'` သို့မဟုတ် `'raw-seed'` ဖြစ်နေရင် လျစ်လျူရှုပါတယ်။
* `cipher` {string} သတ်မှတ်ပေးထားရင် — private key ကို ပေးထားတဲ့ `cipher` နဲ့ `passphrase` ကို သုံးပြီး — PKCS#5 v2.0 password based encryption နဲ့ encrypt လုပ်ပါလိမ့်မယ်။ `format` က `'jwk'`, `'raw-private'` သို့မဟုတ် `'raw-seed'` ဖြစ်နေရင် လျစ်လျူရှုပါတယ်။
* `passphrase` {string | Buffer} Encryption အတွက် သုံးမယ့် passphrase ပါ။ `cipher` ကို သတ်မှတ်ထားရင် လိုအပ်ပါတယ်။

ရလဒ်ရဲ့ type က ရွေးချယ်ထားတဲ့ encoding format ပေါ်မှာ မူတည်ပါတယ်: PEM ဆိုရင် ရလဒ်က string တစ်ခု — DER ဆိုရင် DER အဖြစ် encode လုပ်ထားတဲ့ data ပါဝင်တဲ့ buffer တစ်ခု — [JWK][] ဆိုရင် object တစ်ခု ဖြစ်ပါလိမ့်မယ်။ Raw formats တွေကတော့ raw key material ပါဝင်တဲ့ {Buffer} တစ်ခုကို ပြန်ပေးပါတယ်။

`cipher` နဲ့ `passphrase` တစ်ခုကို သတ်မှတ်ပေးခြင်းအားဖြင့် private keys တွေကို encrypt လုပ်နိုင်ပါတယ်။ PKCS#8 `type` က — key algorithm မရွေး — PEM ရော DER `format` နဲ့ပါ encryption ကို ပံ့ပိုးပါတယ်။ PKCS#1 နဲ့ SEC1 တို့ကတော့ PEM `format` ကို သုံးတဲ့အခါမှသာ encrypt လုပ်နိုင်ပါတယ်။ အများဆုံး လိုက်ဖက်ညီမှုအတွက် — encrypt လုပ်ထားတဲ့ private keys တွေမှာ PKCS#8 ကို သုံးပါ။ PKCS#8 က ၎င်းရဲ့ ကိုယ်ပိုင် encryption ယန္တရားကို သတ်မှတ်ထားတာမို့ — PKCS#8 key တစ်ခုကို encrypt လုပ်တဲ့အခါ PEM-level encryption ကို ပံ့ပိုးမထားပါဘူး။ PKCS#8 encryption အတွက် [RFC 5208][] ကို ကြည့်ပြီး — PKCS#1 နဲ့ SEC1 encryption တွေအတွက် [RFC 1421][] ကို ကြည့်ပါ။

### `keyObject.symmetricKeySize`

* Type: {number}

Secret keys တွေအတွက် — ဒီ property က key ရဲ့ အရွယ်အစားကို bytes နဲ့ ဖော်ပြပါတယ်။ Asymmetric keys တွေအတွက်တော့ ဒီ property က `undefined` ပါ။

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)`

* `algorithm` {string|Algorithm|RsaHashedImportParams|EcKeyImportParams|HmacImportParams}

* `extractable` {boolean}
* `keyUsages` {string\[]} [Key usages][] ကို ကြည့်ပါ။
* Returns: {CryptoKey}

`KeyObject` instance တစ်ခုကို `CryptoKey` တစ်ခုအဖြစ် ပြောင်းလဲပေးပါတယ်။

### `keyObject.type`

* Type: {string}

ဒီ `KeyObject` ရဲ့ type ပေါ်မူတည်ပြီး — secret (symmetric) keys တွေအတွက် `'secret'`, public (asymmetric) keys တွေအတွက် `'public'` သို့မဟုတ် private (asymmetric) keys တွေအတွက် `'private'` ဆိုပြီး ဖြစ်နိုင်ပါတယ်။

## Class: `Sign`

* Extends: {stream.Writable}

`Sign` class က signatures တွေကို ထုတ်လုပ်ဖို့အတွက် utility တစ်ခုပါ။ ၎င်းကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* Sign လုပ်ရမယ့် data တွေကို ရေးသားပြီး — [`sign.sign()`][] method ကို သုံးကာ signature ကို ထုတ်လုပ် ပြန်ပေးတဲ့ — writable [stream][] တစ်ခုအနေနဲ့ ဖြစ်စေ၊
* [`sign.update()`][] နဲ့ [`sign.sign()`][] methods တွေကို သုံးပြီး signature ကို ထုတ်လုပ်တဲ့ ပုံစံနဲ့ ဖြစ်စေ သုံးနိုင်ပါတယ်။

`Sign` instances တွေကို ဖန်တီးဖို့ [`crypto.createSign()`][] method ကို သုံးပါတယ်။ Argument က သုံးရမယ့် hash function ရဲ့ string နာမည် ဖြစ်ပါတယ်။ `Sign` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

ဥပမာ: `Sign` နဲ့ [`Verify`][] objects တွေကို streams အဖြစ် သုံးခြင်း:

```mjs
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

```cjs
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

ဥပမာ: [`sign.update()`][] နဲ့ [`verify.update()`][] methods တွေကို သုံးခြင်း:

```mjs
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

```cjs
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

### `sign.sign(privateKey[, outputEncoding])`

* `privateKey` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey|URL}
  * `dsaEncoding` {string}
  * `padding` {integer}
  * `saltLength` {integer}
* `outputEncoding` {string} Return value ရဲ့ [encoding][] ပါ။
* Returns: {Buffer | string}

[`sign.update()`][] သို့မဟုတ် [`sign.write()`][stream-writable-write] ကို သုံးပြီး ဖြတ်သန်းလိုက်တဲ့ data တွေ အားလုံးအပေါ်မှာ signature ကို တွက်ချက်ပေးပါတယ်။

`privateKey` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `privateKey` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။ `privateKey` က string, `ArrayBuffer`, [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — ၎င်းမှာ PEM-encoded key material ပါဝင်ရပါမယ်။ ၎င်းက object တစ်ခု ဆိုရင် — အောက်ပါ ထပ်ဆောင်း properties တွေကို ဖြတ်သန်းပေးနိုင်ပါတယ်:

* `dsaEncoding` {string} DSA နဲ့ ECDSA အတွက် — ဒီ option က ထုတ်လုပ်လိုက်တဲ့ signature ရဲ့ format ကို သတ်မှတ်ပေးပါတယ်။ အောက်ပါတွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
  * `'der'` (default): `(r, s)` တွေကို encode လုပ်ထားတဲ့ DER-encoded ASN.1 signature structure ပါ။
  * `'ieee-p1363'`: IEEE-P1363 မှာ အဆိုပြုထားတဲ့အတိုင်း `r || s` signature format ပါ။
* `padding` {integer} RSA အတွက် optional padding value ဖြစ်ပြီး — အောက်ပါတွေထဲက တစ်ခု ဖြစ်ပါတယ်:

  * `crypto.constants.RSA_PKCS1_PADDING` (default)
  * `crypto.constants.RSA_PKCS1_PSS_PADDING`

  `RSA_PKCS1_PSS_PADDING` က — [RFC 4055][] ရဲ့ section 3.1 မှာ သတ်မှတ်ထားတဲ့အတိုင်း — message ကို sign လုပ်ဖို့ သုံးခဲ့တဲ့ hash function နဲ့ အတူတူ MGF1 ကို သုံးပါလိမ့်မယ် — [RFC 4055][] ရဲ့ section 3.3 နဲ့အညီ key ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ MGF1 hash function တစ်ခု သတ်မှတ်ပေးထားခြင်း မရှိဘူးဆိုရင်ပါ။
* `saltLength` {integer} Padding က `RSA_PKCS1_PSS_PADDING` ဖြစ်တဲ့အခါအတွက် salt length ပါ။ အထူး တန်ဖိုး `crypto.constants.RSA_PSS_SALTLEN_DIGEST` က salt length ကို digest size အဖြစ် သတ်မှတ်ပေးပြီး — `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (default) ကတော့ ၎င်းကို ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးအဖြစ် သတ်မှတ်ပေးပါတယ်။

`outputEncoding` ပေးထားရင် string တစ်ခုကို ပြန်ပေးပြီး — မဟုတ်ရင်တော့ [`Buffer`][] တစ်ခုကို ပြန်ပေးပါတယ်။

`sign.sign()` method ကို ခေါ်ပြီးနောက်မှာ `Sign` object ကို ပြန်သုံးလို့ မရတော့ပါဘူး။ `sign.sign()` ကို အကြိမ်များစွာ ခေါ်ရင် error တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `sign.update(data[, inputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `data` string ရဲ့ [encoding][] ပါ။

ပေးထားတဲ့ `data` နဲ့ `Sign` content ကို update လုပ်ပါတယ် — `data` ရဲ့ encoding ကို `inputEncoding` မှာ ဖော်ပြပါတယ်။ `encoding` ကို မပေးထားပဲ `data` က string တစ်ခု ဖြစ်နေရင် — `'utf8'` encoding ကို တွန်းအားပေး လုပ်ပါတယ်။ `data` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

Data အသစ်တွေ stream လုပ်ခံရတာနဲ့အမျှ — ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

## Class: `Verify`

* Extends: {stream.Writable}

`Verify` class က signatures တွေကို စစ်ဆေး အတည်ပြုဖို့အတွက် utility တစ်ခုပါ။ ၎င်းကို နည်းလမ်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ သုံးနိုင်ပါတယ်:

* ရေးသားလိုက်တဲ့ data ကို ပေးထားတဲ့ signature နဲ့ ဆန့်ကျင် စစ်ဆေး (validate) ဖို့ သုံးတဲ့ writable [stream][] တစ်ခုအနေနဲ့ ဖြစ်စေ၊
* [`verify.update()`][] နဲ့ [`verify.verify()`][] methods တွေကို သုံးပြီး signature ကို စစ်ဆေး အတည်ပြုတဲ့ ပုံစံနဲ့ ဖြစ်စေ သုံးနိုင်ပါတယ်။

`Verify` instances တွေကို ဖန်တီးဖို့ [`crypto.createVerify()`][] method ကို သုံးပါတယ်။ `Verify` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

ဥပမာတွေအတွက် [`Sign`][] ကို ကြည့်ပါ။

### `verify.update(data[, inputEncoding])`

* `data` {string|Buffer|TypedArray|DataView}
* `inputEncoding` {string} `data` string ရဲ့ [encoding][] ပါ။

ပေးထားတဲ့ `data` နဲ့ `Verify` content ကို update လုပ်ပါတယ် — `data` ရဲ့ encoding ကို `inputEncoding` မှာ ဖော်ပြပါတယ်။ `inputEncoding` ကို မပေးထားပဲ `data` က string တစ်ခု ဖြစ်နေရင် — `'utf8'` encoding ကို တွန်းအားပေး လုပ်ပါတယ်။ `data` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — `inputEncoding` ကို လျစ်လျူရှုပါတယ်။

Data အသစ်တွေ stream လုပ်ခံရတာနဲ့အမျှ — ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

### `verify.verify(key, signature[, signatureEncoding])`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
  * `dsaEncoding` {string}
  * `padding` {integer}
  * `saltLength` {integer}
* `signature` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `signatureEncoding` {string} `signature` string ရဲ့ [encoding][] ပါ။
* Returns: {boolean} Data နဲ့ public key အတွက် signature ရဲ့ တရားဝင်မှု (validity) ပေါ်မူတည်ပြီး `true` သို့မဟုတ် `false` ပါ။

ပေးထားတဲ့ `key` နဲ့ `signature` ကို သုံးပြီး ပေးထားတဲ့ data ကို စစ်ဆေး အတည်ပြုပါတယ်။

`key` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။ `key` က string, `ArrayBuffer`, [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်နေရင် — ၎င်းမှာ PEM-encoded key material ပါဝင်ရပါမယ်။ ၎င်းက object တစ်ခု ဆိုရင် — အောက်ပါ ထပ်ဆောင်း properties တွေကို ဖြတ်သန်းပေးနိုင်ပါတယ်:

* `dsaEncoding` {string} DSA နဲ့ ECDSA အတွက် — ဒီ option က signature ရဲ့ format ကို သတ်မှတ်ပေးပါတယ်။ အောက်ပါတွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
  * `'der'` (default): `(r, s)` တွေကို encode လုပ်ထားတဲ့ DER-encoded ASN.1 signature structure ပါ။
  * `'ieee-p1363'`: IEEE-P1363 မှာ အဆိုပြုထားတဲ့အတိုင်း `r || s` signature format ပါ။
* `padding` {integer} RSA အတွက် optional padding value ဖြစ်ပြီး — အောက်ပါတွေထဲက တစ်ခု ဖြစ်ပါတယ်:

  * `crypto.constants.RSA_PKCS1_PADDING` (default)
  * `crypto.constants.RSA_PKCS1_PSS_PADDING`

  `RSA_PKCS1_PSS_PADDING` က — [RFC 4055][] ရဲ့ section 3.1 မှာ သတ်မှတ်ထားတဲ့အတိုင်း — message ကို verify လုပ်ဖို့ သုံးခဲ့တဲ့ hash function နဲ့ အတူတူ MGF1 ကို သုံးပါလိမ့်မယ် — [RFC 4055][] ရဲ့ section 3.3 နဲ့အညီ key ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ MGF1 hash function တစ်ခု သတ်မှတ်ပေးထားခြင်း မရှိဘူးဆိုရင်ပါ။
* `saltLength` {integer} Padding က `RSA_PKCS1_PSS_PADDING` ဖြစ်တဲ့အခါအတွက် salt length ပါ။ အထူး တန်ဖိုး `crypto.constants.RSA_PSS_SALTLEN_DIGEST` က salt length ကို digest size အဖြစ် သတ်မှတ်ပေးပြီး — `crypto.constants.RSA_PSS_SALTLEN_AUTO` (default) ကတော့ ၎င်းကို အလိုအလျောက် ဆုံးဖြတ်စေပါတယ်။

`signature` argument က — `signatureEncoding` နဲ့ ဖော်ပြထားတဲ့ — data အတွက် အရင်က တွက်ချက်ထားတဲ့ signature ပါ။ `signatureEncoding` ကို သတ်မှတ်ထားရင် — `signature` က string တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပြီး — မဟုတ်ရင်တော့ `signature` က [`Buffer`][], `TypedArray` သို့မဟုတ် `DataView` တစ်ခု ဖြစ်ရမယ်လို့ မျှော်လင့်ပါတယ်။

`verify.verify()` ကို ခေါ်ပြီးနောက်မှာ `verify` object ကို ပြန်သုံးလို့ မရတော့ပါဘူး။ `verify.verify()` ကို အကြိမ်များစွာ ခေါ်ရင် error တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

Public keys တွေကို private keys တွေကနေ ဆင်းသက် ထုတ်ယူနိုင်တာမို့ — public key တစ်ခုအစား private key တစ်ခုကိုလည်း ဖြတ်သန်းပေးနိုင်ပါတယ်။

## Class: `X509Certificate`

X509 certificate တစ်ခုကို ခြုံငုံ (encapsulate) ပြီး — ၎င်းရဲ့ အချက်အလက်တွေဆီကို read-only (ဖတ်ရုံသက်သက်) ဝင်ရောက်ခွင့် ပေးပါတယ်။

```mjs
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```

```cjs
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```

### `new X509Certificate(buffer)`

* `buffer` {string|TypedArray|Buffer|DataView} PEM သို့မဟုတ် DER နဲ့ encode လုပ်ထားတဲ့ X509 Certificate တစ်ခုပါ။

### `x509.ca`

* Type: {boolean} ဒါက Certificate Authority (CA) certificate တစ်ခု ဆိုရင် `true` ဖြစ်ပါတယ်။

### `x509.checkEmail(email[, options])`

* `email` {string}
* `options` {Object}
  * `subject` {string} `'default'`, `'always'` သို့မဟုတ် `'never'` ဖြစ်ပါတယ်။ **Default:** `'default'`.
* Returns: {string|undefined} Certificate က ကိုက်ညီရင် `email` ကို — မကိုက်ညီရင် `undefined` ကို ပြန်ပေးပါတယ်။

Certificate က ပေးထားတဲ့ email address နဲ့ ကိုက်ညီမှု ရှိ/မရှိ စစ်ဆေးပါတယ်။

`'subject'` option က undefined ဖြစ်နေရင် သို့မဟုတ် `'default'` လို့ သတ်မှတ်ထားရင် — subject alternative name extension က မရှိတာ သို့မဟုတ် email addresses တစ်ခုမှ မပါဝင်တဲ့ အခါမျိုးမှာသာ certificate subject ကို ထည့်သွင်း စဉ်းစားပါတယ်။

`'subject'` option ကို `'always'` လို့ သတ်မှတ်ထားပြီး — subject alternative name extension က မရှိတာ သို့မဟုတ် ကိုက်ညီတဲ့ email address မပါဝင်တဲ့ အခါမျိုးမှာ — certificate subject ကို ထည့်သွင်း စဉ်းစားပါတယ်။

`'subject'` option ကို `'never'` လို့ သတ်မှတ်ထားရင် — certificate မှာ subject alternative names တွေ မပါဝင်ဘူးဆိုရင်တောင် — certificate subject ကို ဘယ်တော့မှ ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး။

### `x509.checkHost(name[, options])`

* `name` {string}
* `options` {Object}
  * `subject` {string} `'default'`, `'always'` သို့မဟုတ် `'never'` ဖြစ်ပါတယ်။ **Default:** `'default'`.
  * `wildcards` {boolean} **Default:** `true`.
  * `partialWildcards` {boolean} **Default:** `true`.
  * `multiLabelWildcards` {boolean} **Default:** `false`.
  * `singleLabelSubdomains` {boolean} **Default:** `false`.
* Returns: {string|undefined} `name` နဲ့ ကိုက်ညီတဲ့ subject name တစ်ခုကို ပြန်ပေးပြီး — `name` နဲ့ ကိုက်ညီတဲ့ subject name မရှိရင် `undefined` ကို ပြန်ပေးပါတယ်။

Certificate က ပေးထားတဲ့ host name နဲ့ ကိုက်ညီမှု ရှိ/မရှိ စစ်ဆေးပါတယ်။

Certificate က ပေးထားတဲ့ host name နဲ့ ကိုက်ညီရင် — ကိုက်ညီတဲ့ subject name ကို ပြန်ပေးပါတယ်။ ပြန်ပေးလိုက်တဲ့ name က အတိအကျ ကိုက်ညီမှု (ဥပမာ — `foo.example.com`) တစ်ခု ဖြစ်နိုင်သလို — wildcards တွေ (ဥပမာ — `*.example.com`) ပါဝင်နိုင်ပါတယ်။ Host name နှိုင်းယှဉ်မှုတွေက case-insensitive (စာလုံး အကြီး/အသေး ခွဲခြားမှု မရှိ) ဖြစ်တာမို့ — ပြန်ပေးလိုက်တဲ့ subject name က ပေးထားတဲ့ `name` နဲ့ capitalization (စာလုံး အကြီး/အသေး ပုံစံ) ပိုင်းမှာလည်း ကွဲပြားနိုင်ပါတယ်။

`'subject'` option က undefined ဖြစ်နေရင် သို့မဟုတ် `'default'` လို့ သတ်မှတ်ထားရင် — subject alternative name extension က မရှိတာ သို့မဟုတ် DNS names တစ်ခုမှ မပါဝင်တဲ့ အခါမျိုးမှာသာ certificate subject ကို ထည့်သွင်း စဉ်းစားပါတယ်။ ဒီအပြုအမူက [RFC 2818][] ("HTTP Over TLS") နဲ့ ကိုက်ညီပါတယ်။

`'subject'` option ကို `'always'` လို့ သတ်မှတ်ထားပြီး — subject alternative name extension က မရှိတာ သို့မဟုတ် ကိုက်ညီတဲ့ DNS name မပါဝင်တဲ့ အခါမျိုးမှာ — certificate subject ကို ထည့်သွင်း စဉ်းစားပါတယ်။

`'subject'` option ကို `'never'` လို့ သတ်မှတ်ထားရင် — certificate မှာ subject alternative names တွေ မပါဝင်ဘူးဆိုရင်တောင် — certificate subject ကို ဘယ်တော့မှ ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး။

### `x509.checkIP(ip)`

* `ip` {string}
* Returns: {string|undefined} Certificate က ကိုက်ညီရင် `ip` ကို — မကိုက်ညီရင် `undefined` ကို ပြန်ပေးပါတယ်။

Certificate က ပေးထားတဲ့ IP address (IPv4 သို့မဟုတ် IPv6) နဲ့ ကိုက်ညီမှု ရှိ/မရှိ စစ်ဆေးပါတယ်။

[RFC 5280][] ရဲ့ `iPAddress` subject alternative names တွေကိုသာ ထည့်သွင်း စဉ်းစားပြီး — ၎င်းတို့က ပေးထားတဲ့ `ip` address နဲ့ အတိအကျ ကိုက်ညီရပါမယ်။ တခြား subject alternative names တွေရော certificate ရဲ့ subject field ပါ လျစ်လျူရှုခံရပါတယ်။

### `x509.checkIssued(otherCert)`

* `otherCert` {X509Certificate}
* Returns: {boolean}

Certificate metadata တွေကို နှိုင်းယှဉ်ခြင်းအားဖြင့် — ဒီ certificate ကို ပေးထားတဲ့ `otherCert` က ထုတ်ပေးခဲ့တာ ဖြစ်နိုင်လားဆိုတာ စစ်ဆေးပါတယ်။

ဒါက — subject နဲ့ issuer names တွေကိုသာ အခြေခံတဲ့ ပိုရိုးရှင်းတဲ့ filtering routine တစ်ခုနဲ့ ရွေးချယ်ထားပြီးသား — ဖြစ်နိုင်တဲ့ issuer certificates စာရင်းတစ်ခုကို ချုံ့ထုတ်ရာမှာ (pruning) အသုံးဝင်ပါတယ်။

နောက်ဆုံးအနေနဲ့ — ဒီ certificate ရဲ့ signature ကို `otherCert` ရဲ့ public key နဲ့ ကိုက်ညီတဲ့ private key တစ်ခုက ထုတ်လုပ်ခဲ့တာလားဆိုတာ စစ်ဆေးဖို့ဆိုရင် — `otherCert` ရဲ့ public key ကို [`KeyObject`][] တစ်ခုအနေနဲ့ ကိုယ်စားပြုပြီး — [`x509.verify(publicKey)`][] ကို အောက်ပါအတိုင်း သုံးပါ

```js
if (!x509.verify(otherCert.publicKey)) {
  throw new Error('otherCert did not issue x509');
}
```

### `x509.checkPrivateKey(privateKey)`

* `privateKey` {KeyObject} Private key တစ်ခုပါ။
* Returns: {boolean}

ဒီ certificate အတွက် public key က ပေးထားတဲ့ private key နဲ့ ကိုက်ညီမှု (consistent) ရှိ/မရှိ စစ်ဆေးပါတယ်။

### `x509.fingerprint`

* Type: {string}

ဒီ certificate ရဲ့ SHA-1 fingerprint ပါ။

SHA-1 က cryptographic ပိုင်းမှာ ကျိုးပေါက်နေပြီး — certificates တွေကို sign လုပ်ရာမှာ အသုံးများတဲ့ algorithms တွေရဲ့ လုံခြုံရေးထက် SHA-1 ရဲ့ လုံခြုံရေးက သိသိသာသာ အားနည်းတာမို့ — [`x509.fingerprint256`][] ကို သုံးဖို့ စဉ်းစားပါ။

### `x509.fingerprint256`

* Type: {string}

ဒီ certificate ရဲ့ SHA-256 fingerprint ပါ။

### `x509.fingerprint512`

* Type: {string}

ဒီ certificate ရဲ့ SHA-512 fingerprint ပါ။

SHA-256 fingerprint ကို တွက်ချက်တာက ပုံမှန်အားဖြင့် ပိုမြန်ပြီး — SHA-512 fingerprint ရဲ့ တစ်ဝက်ပဲ ရှိတာမို့ — [`x509.fingerprint256`][] က ပိုကောင်းတဲ့ ရွေးချယ်မှု ဖြစ်နိုင်ပါတယ်။ SHA-512 က ယေဘုယျအားဖြင့် လုံခြုံရေး ပိုမြင့်မားတယ်လို့ ယူဆရပေမယ့် — SHA-256 ရဲ့ လုံခြုံရေးက certificates တွေကို sign လုပ်ရာမှာ အသုံးများတဲ့ algorithms အများစုရဲ့ လုံခြုံရေးနဲ့ ကိုက်ညီပါတယ်။

### `x509.infoAccess`

* Type: {string}

Certificate ရဲ့ authority information access extension ရဲ့ textual (စာသား) ကိုယ်စားပြုမှု တစ်ခုပါ။

ဒါက line feed တွေနဲ့ ပိုင်းခြားထားတဲ့ access descriptions စာရင်းတစ်ခုပါ။ Line တစ်ကြောင်းချင်းစီက access method နဲ့ access location ရဲ့ အမျိုးအစားနဲ့ စတင်ပြီး — colon တစ်ခုနဲ့ access location နဲ့ ဆက်စပ်နေတဲ့ တန်ဖိုးက နောက်ကနေ လိုက်ပါတယ်။

Access method နဲ့ access location ရဲ့ အမျိုးအစားကို ဖော်ပြတဲ့ prefix ပြီးနောက်မှာ — တန်ဖိုးက JSON string literal တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြဖို့ — line တစ်ကြောင်းချင်းစီရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းကို quotes တွေနဲ့ ဝန်းရံထားနိုင်ပါတယ်။ နောက်ကြောင်း လိုက်ဖက်ညီမှု (backward compatibility) အတွက် — Node.js က JSON string literals တွေကို ဒီ property အတွင်းမှာ — ရှုပ်ထွေးမှုတွေ ရှောင်ရှားဖို့ လိုအပ်တဲ့အခါမှသာ သုံးပါတယ်။ Third-party code တွေက ဖြစ်နိုင်တဲ့ entry formats နှစ်မျိုးလုံးကို ကိုင်တွယ်ဖို့ အသင့် ဖြစ်ထားသင့်ပါတယ်။

### `x509.issuer`

* Type: {string}

ဒီ certificate ထဲမှာ ပါဝင်တဲ့ issuer identification ပါ။

### `x509.issuerCertificate`

* Type: {X509Certificate}

Issuer certificate ပါ — issuer certificate မရရှိနိုင်ဘူးဆိုရင် `undefined` ပါ။

### `x509.keyUsage`

* Type: {string\[]}

ဒီ certificate အတွက် key extended usages တွေကို အသေးစိတ် ဖော်ပြတဲ့ array တစ်ခုပါ။

### `x509.publicKey`

* Type: {KeyObject}

ဒီ certificate ရဲ့ public key {KeyObject} ပါ။

### `x509.raw`

* Type: {Buffer}

ဒီ certificate ရဲ့ DER encoding ပါဝင်တဲ့ `Buffer` တစ်ခုပါ။

### `x509.serialNumber`

* Type: {string}

ဒီ certificate ရဲ့ serial number ပါ။

Serial numbers တွေကို certificate authorities တွေက သတ်မှတ်ပေးပြီး — certificates တွေကို ထူးခြားစွာ (uniquely) ခွဲခြားဖော်ပြတာ မဟုတ်ပါဘူး။ အဲဒီအစား unique identifier တစ်ခုအဖြစ် [`x509.fingerprint256`][] ကို သုံးဖို့ စဉ်းစားပါ။

### `x509.subject`

* Type: {string}

ဒီ certificate ရဲ့ ပြည့်စုံတဲ့ subject ပါ။

### `x509.subjectAltName`

* Type: {string}

ဒီ certificate အတွက် သတ်မှတ်ထားတဲ့ subject alternative name ပါ။

ဒါက subject alternative names တွေရဲ့ comma နဲ့ ပိုင်းခြားထားတဲ့ စာရင်း တစ်ခုပါ။ Entry တစ်ခုချင်းစီက subject alternative name ရဲ့ အမျိုးအစားကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခုနဲ့ စတင်ပြီး — colon တစ်ခုနဲ့ entry နဲ့ ဆက်စပ်နေတဲ့ တန်ဖိုးက နောက်ကနေ လိုက်ပါတယ်။

Node.js ရဲ့ အစောပိုင်း versions တွေက — ဒီ property ကို `', '` ဆိုတဲ့ character နှစ်လုံး sequence မှာ ပိုင်းဖြတ်တာ လုံခြုံတယ်လို့ မှားယွင်းစွာ ယူဆခဲ့ပါတယ် ([CVE-2021-44532][] ကို ကြည့်ပါ)။ ဒါပေမယ့် — malicious ဖြစ်တဲ့ ရော legitimate ဖြစ်တဲ့ certificates တွေပါ — string တစ်ခုအနေနဲ့ ကိုယ်စားပြုတဲ့အခါ ဒီ sequence ပါဝင်တဲ့ subject alternative names တွေကို ဆံ့နိုင်ပါတယ်။

Entry ရဲ့ type ကို ဖော်ပြတဲ့ prefix ပြီးနောက်မှာ — တန်ဖိုးက JSON string literal တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြဖို့ — entry တစ်ခုချင်းစီရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းကို quotes တွေနဲ့ ဝန်းရံထားနိုင်ပါတယ်။ နောက်ကြောင်း လိုက်ဖက်ညီမှုအတွက် — Node.js က JSON string literals တွေကို ဒီ property အတွင်းမှာ — ရှုပ်ထွေးမှုတွေ ရှောင်ရှားဖို့ လိုအပ်တဲ့အခါမှသာ သုံးပါတယ်။ Third-party code တွေက ဖြစ်နိုင်တဲ့ entry formats နှစ်မျိုးလုံးကို ကိုင်တွယ်ဖို့ အသင့် ဖြစ်ထားသင့်ပါတယ်။

### `x509.toJSON()`

* Type: {string}

X509 certificates တွေအတွက် standard JSON encoding ဆိုတာ မရှိပါဘူး။ `toJSON()` method က PEM နဲ့ encode လုပ်ထားတဲ့ certificate ပါဝင်တဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

### `x509.toLegacyObject()`

* Type: {Object}

Legacy [certificate object][] encoding ကို သုံးပြီး ဒီ certificate အကြောင်း အချက်အလက်တွေကို ပြန်ပေးပါတယ်။

### `x509.toString()`

* Type: {string}

PEM နဲ့ encode လုပ်ထားတဲ့ certificate ကို ပြန်ပေးပါတယ်။

### `x509.validFrom`

* Type: {string}

ဒီ certificate က စတင် တရားဝင် (valid) ဖြစ်တဲ့ ရက်စွဲ/အချိန်ပါ။

### `x509.validFromDate`

* Type: {Date}

ဒီ certificate က စတင် တရားဝင် (valid) ဖြစ်တဲ့ ရက်စွဲ/အချိန်ပါ — `Date` object တစ်ခုအတွင်းမှာ ထည့်သွင်းထားပါတယ်။

### `x509.validTo`

* Type: {string}

ဒီ certificate က သက်တမ်းကုန်ဆုံးတဲ့ ရက်စွဲ/အချိန်ပါ။

### `x509.validToDate`

* Type: {Date}

ဒီ certificate က သက်တမ်းကုန်ဆုံးတဲ့ ရက်စွဲ/အချိန်ပါ — `Date` object တစ်ခုအတွင်းမှာ ထည့်သွင်းထားပါတယ်။

### `x509.signatureAlgorithm`

* Type: {string|undefined}

Certificate ကို sign လုပ်ဖို့ သုံးထားတဲ့ algorithm ပါ — signature algorithm ကို OpenSSL က မသိရင်တော့ `undefined` ပါ။

### `x509.signatureAlgorithmOid`

* Type: {string}

Certificate ကို sign လုပ်ဖို့ သုံးထားတဲ့ algorithm ရဲ့ OID ပါ။

### `x509.verify(publicKey)`

* `publicKey` {KeyObject} Public key တစ်ခုပါ။
* Returns: {boolean}

ဒီ certificate ကို ပေးထားတဲ့ public key နဲ့ sign လုပ်ခဲ့တာလားဆိုတာ စစ်ဆေးပေးပါတယ်။ Certificate အပေါ်မှာ တခြား validation checks တွေကိုတော့ လုပ်ဆောင်မပေးပါဘူး။

## `node:crypto` module methods and properties

### `crypto.argon2(algorithm, parameters, callback)`

* `algorithm` {string} Argon2 ရဲ့ variant ဖြစ်ပြီး — `"argon2d"`, `"argon2i"` သို့မဟုတ် `"argon2id"` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `parameters` {Object}
  * `message` {string|ArrayBuffer|Buffer|TypedArray|DataView} REQUIRED — password hashing applications တွေအတွက် ဒါက Argon2 ရဲ့ password ပါ။
  * `nonce` {string|ArrayBuffer|Buffer|TypedArray|DataView} REQUIRED — အနည်းဆုံး bytes 8 ရှည်ရပါမယ်။ Password hashing applications တွေအတွက် ဒါက Argon2 ရဲ့ salt ပါ။
  * `parallelism` {number} REQUIRED — computational chains (lanes) ဘယ်နှစ်ခု run လို့ရမလဲဆိုတာကို parallelism ရဲ့ degree က သတ်မှတ်ပါတယ်။ အနည်းဆုံး `1` နဲ့ အများဆုံး `2**24-1` ဖြစ်ရပါမယ်။
  * `tagLength` {number} REQUIRED — ထုတ်လုပ်ရမယ့် key ရဲ့ အရှည်ပါ။ အနည်းဆုံး `4` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။
  * `memory` {number} REQUIRED — memory cost ကို 1KiB blocks နဲ့ ဖော်ပြတာပါ။ အနည်းဆုံး `8 * parallelism` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။ တကယ့် blocks အရေအတွက်ကို `4 * parallelism` ရဲ့ ဆတိုးကိန်း အနီးဆုံးဆီကို အောက်သို့ ချပြီး round လုပ်ပါတယ်။
  * `passes` {number} REQUIRED — passes (iterations) အရေအတွက်ပါ။ အနည်းဆုံး `1` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။
  * `secret` {string|ArrayBuffer|Buffer|TypedArray|DataView|undefined} OPTIONAL — salt နဲ့ ဆင်တူတဲ့ random ထပ်ဆောင်း input ဖြစ်ပြီး — derived key နဲ့အတူ သိမ်းဆည်းထားခြင်း **မပြုသင့်**ပါဘူး။ Password hashing applications တွေမှာ ဒါကို pepper လို့ ခေါ်ပါတယ်။ သုံးမယ်ဆိုရင် — `2**32-1` bytes ထက် မပိုတဲ့ အရှည် ရှိရပါမယ်။
  * `associatedData` {string|ArrayBuffer|Buffer|TypedArray|DataView|undefined} OPTIONAL — hash ထဲကို ထည့်သွင်းရမယ့် ထပ်ဆောင်း data ဖြစ်ပြီး — salt သို့မဟုတ် secret နဲ့ လုပ်ဆောင်ချက်ပိုင်း ညီမျှပေမယ့် — random မဟုတ်တဲ့ data တွေအတွက် ရည်ရွယ်ပါတယ်။ သုံးမယ်ဆိုရင် — `2**32-1` bytes ထက် မပိုတဲ့ အရှည် ရှိရပါမယ်။
* `callback` {Function}
  * `err` {Error}
  * `derivedKey` {Buffer}

[Argon2][] ရဲ့ asynchronous implementation တစ်ခုကို ပေးစွမ်းပါတယ်။ Argon2 က password-based key derivation function တစ်ခု ဖြစ်ပြီး — brute-force attacks တွေကို အကျိုးမထွက်အောင် — တွက်ချက်မှုပိုင်းရော memory ပိုင်းပါ ဈေးကြီးစေဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

`nonce` က တတ်နိုင်သမျှ ထူးခြားမှု (unique) ရှိသင့်ပါတယ်။ Nonce က random ဖြစ်ပြီး အနည်းဆုံး bytes 16 ရှည်ဖို့ အကြံပြုထားပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

`message`, `nonce`, `secret` သို့မဟုတ် `associatedData` တွေအတွက် strings တွေကို ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပေးပါ။

`callback` function ကို arguments နှစ်ခုနဲ့ ခေါ်ပါတယ်: `err` နဲ့ `derivedKey` ပါ။ Key derivation မအောင်မြင်ရင် `err` က exception object တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ `err` က `null` ပါ။ `derivedKey` ကို [`Buffer`][] တစ်ခုအနေနဲ့ callback ဆီကို ဖြတ်သန်းပေးပါတယ်။

Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ (invalid) တန်ဖိုး သို့မဟုတ် type တွေကို သတ်မှတ်ပေးထားရင် exception တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
const { argon2, randomBytes } = await import('node:crypto');

const parameters = {
  message: 'password',
  nonce: randomBytes(16),
  parallelism: 4,
  tagLength: 64,
  memory: 65536,
  passes: 3,
};

argon2('argon2id', parameters, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // 'af91dad...9520f15'
});
```

```cjs
const { argon2, randomBytes } = require('node:crypto');

const parameters = {
  message: 'password',
  nonce: randomBytes(16),
  parallelism: 4,
  tagLength: 64,
  memory: 65536,
  passes: 3,
};

argon2('argon2id', parameters, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // 'af91dad...9520f15'
});
```

### `crypto.argon2Sync(algorithm, parameters)`

* `algorithm` {string} Argon2 ရဲ့ variant ဖြစ်ပြီး — `"argon2d"`, `"argon2i"` သို့မဟုတ် `"argon2id"` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `parameters` {Object}
  * `message` {string|ArrayBuffer|Buffer|TypedArray|DataView} REQUIRED — password hashing applications တွေအတွက် ဒါက Argon2 ရဲ့ password ပါ။
  * `nonce` {string|ArrayBuffer|Buffer|TypedArray|DataView} REQUIRED — အနည်းဆုံး bytes 8 ရှည်ရပါမယ်။ Password hashing applications တွေအတွက် ဒါက Argon2 ရဲ့ salt ပါ။
  * `parallelism` {number} REQUIRED — computational chains (lanes) ဘယ်နှစ်ခု run လို့ရမလဲဆိုတာကို parallelism ရဲ့ degree က သတ်မှတ်ပါတယ်။ အနည်းဆုံး 1 နဲ့ အများဆုံး `2**24-1` ဖြစ်ရပါမယ်။
  * `tagLength` {number} REQUIRED — ထုတ်လုပ်ရမယ့် key ရဲ့ အရှည်ပါ။ အနည်းဆုံး `4` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။
  * `memory` {number} REQUIRED — memory cost ကို 1KiB blocks နဲ့ ဖော်ပြတာပါ။ အနည်းဆုံး `8 * parallelism` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။ တကယ့် blocks အရေအတွက်ကို `4 * parallelism` ရဲ့ ဆတိုးကိန်း အနီးဆုံးဆီကို အောက်သို့ ချပြီး round လုပ်ပါတယ်။
  * `passes` {number} REQUIRED — passes (iterations) အရေအတွက်ပါ။ အနည်းဆုံး `1` နဲ့ အများဆုံး `2**32-1` ဖြစ်ရပါမယ်။
  * `secret` {string|ArrayBuffer|Buffer|TypedArray|DataView|undefined} OPTIONAL — salt နဲ့ ဆင်တူတဲ့ random ထပ်ဆောင်း input ဖြစ်ပြီး — derived key နဲ့အတူ သိမ်းဆည်းထားခြင်း **မပြုသင့်**ပါဘူး။ Password hashing applications တွေမှာ ဒါကို pepper လို့ ခေါ်ပါတယ်။ သုံးမယ်ဆိုရင် — `2**32-1` bytes ထက် မပိုတဲ့ အရှည် ရှိရပါမယ်။
  * `associatedData` {string|ArrayBuffer|Buffer|TypedArray|DataView|undefined} OPTIONAL — hash ထဲကို ထည့်သွင်းရမယ့် ထပ်ဆောင်း data ဖြစ်ပြီး — salt သို့မဟုတ် secret နဲ့ လုပ်ဆောင်ချက်ပိုင်း ညီမျှပေမယ့် — random မဟုတ်တဲ့ data တွေအတွက် ရည်ရွယ်ပါတယ်။ သုံးမယ်ဆိုရင် — `2**32-1` bytes ထက် မပိုတဲ့ အရှည် ရှိရပါမယ်။
* Returns: {Buffer}

[Argon2][] ရဲ့ synchronous implementation တစ်ခုကို ပေးစွမ်းပါတယ်။ Argon2 က password-based key derivation function တစ်ခု ဖြစ်ပြီး — brute-force attacks တွေကို အကျိုးမထွက်အောင် — တွက်ချက်မှုပိုင်းရော memory ပိုင်းပါ ဈေးကြီးစေဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

`nonce` က တတ်နိုင်သမျှ ထူးခြားမှု ရှိသင့်ပါတယ်။ Nonce က random ဖြစ်ပြီး အနည်းဆုံး bytes 16 ရှည်ဖို့ အကြံပြုထားပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

`message`, `nonce`, `secret` သို့မဟုတ် `associatedData` တွေအတွက် strings တွေကို ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပေးပါ။

Key derivation မအောင်မြင်ရင် exception တစ်ခုကို throw လုပ်ပြီး — မဟုတ်ရင်တော့ derived key ကို [`Buffer`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ တန်ဖိုး သို့မဟုတ် type တွေကို သတ်မှတ်ပေးထားရင် exception တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
const { argon2Sync, randomBytes } = await import('node:crypto');

const parameters = {
  message: 'password',
  nonce: randomBytes(16),
  parallelism: 4,
  tagLength: 64,
  memory: 65536,
  passes: 3,
};

const derivedKey = argon2Sync('argon2id', parameters);
console.log(derivedKey.toString('hex'));  // 'af91dad...9520f15'
```

```cjs
const { argon2Sync, randomBytes } = require('node:crypto');

const parameters = {
  message: 'password',
  nonce: randomBytes(16),
  parallelism: 4,
  tagLength: 64,
  memory: 65536,
  passes: 3,
};

const derivedKey = argon2Sync('argon2id', parameters);
console.log(derivedKey.toString('hex'));  // 'af91dad...9520f15'
```

### `crypto.checkPrime(candidate[, options], callback)`

* `candidate` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  Prime ဖြစ်နိုင်တဲ့ တန်ဖိုးတစ်ခု — arbitrary (ကန့်သတ်ချက် မရှိ) length ရှိတဲ့ big endian octets တွေရဲ့ sequence အဖြစ် encode လုပ်ထားပါတယ်။
* `options` {Object}
  * `checks` {number} လုပ်ဆောင်ရမယ့် Miller-Rabin probabilistic primality iterations အရေအတွက်ပါ။ တန်ဖိုးက `0` (သုည) ဖြစ်နေရင် — random input တွေအတွက် false positive rate 2-64 အများဆုံး ဖြစ်စေတဲ့ checks အရေအတွက်ကို သုံးပါတယ်။ Checks အရေအတွက် ရွေးချယ်တဲ့အခါ သတိထားရပါမယ်။ နောက်ထပ် အသေးစိတ်အတွက် [`BN_is_prime_ex`][] function ရဲ့ `nchecks` options နဲ့ ပတ်သက်တဲ့ OpenSSL documentation ကို ကိုးကားပါ။ **Default:** `0`
* `callback` {Function}
  * `err` {Error} Check လုပ်နေစဉ် error တစ်ခု ဖြစ်ပွားခဲ့ရင် {Error} object တစ်ခုအနေနဲ့ သတ်မှတ်ပါတယ်။
  * `result` {boolean} Candidate က — error probability `0.25 ** options.checks` ထက် ငယ်တဲ့ — prime တစ်ခု ဆိုရင် `true` ပါ။

`candidate` ရဲ့ primality (သုဒ္ဓကိန်း ဟုတ်/မဟုတ်) ကို စစ်ဆေးပါတယ်။
### `crypto.checkPrimeSync(candidate[, options])`

* `candidate` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  Prime ဖြစ်နိုင်ခြေရှိတဲ့ ကိန်းတစ်ခုကို — အလျား သတ်မှတ်ချက် မရှိဘဲ big endian octets (8-bit byte များ) အစီအစဉ်တစ်ခုအနေနဲ့ — encode လုပ်ထားတဲ့ တန်ဖိုးပါ။
* `options` {Object}
  * `checks` {number} လုပ်ဆောင်ရမယ့် Miller-Rabin probabilistic primality (ဖြစ်တန်စွမ်း အပေါ် အခြေခံတဲ့ prime စစ်ဆေးမှု) iterations အရေအတွက်ပါ။ တန်ဖိုးက `0` (သုည) ဖြစ်နေရင် — random input တွေအတွက် false positive နှုန်း အများဆုံး 2-64 သာ ရှိစေမယ့် checks အရေအတွက်ကို သုံးပါတယ်။ Checks အရေအတွက် ရွေးချယ်ရာမှာ သတိထားရပါမယ်။ အသေးစိတ်အတွက် [`BN_is_prime_ex`][] function ရဲ့ `nchecks` options အကြောင်း OpenSSL documentation ကို ရည်ညွှန်းပါ။ **Default:** `0`
* Returns: {boolean} `candidate` က prime တစ်ခု ဖြစ်ပြီး — error ဖြစ်နိုင်ခြေ `0.25 ** options.checks` ထက် နည်းတယ်ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

`candidate` က prime ဟုတ်မဟုတ် စစ်ဆေးပေးပါတယ်။

### `crypto.constants`

* Type: {Object}

Crypto နဲ့ security ဆိုင်ရာ လုပ်ဆောင်ချက်တွေအတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ လက်ရှိ သတ်မှတ်ထားတဲ့ constants တွေရဲ့ အသေးစိတ်ကို [Crypto constants][] မှာ ဖော်ပြထားပါတယ်။

### `crypto.createCipheriv(algorithm, key, iv[, options])`

* `algorithm` {string}
* `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
* `iv` {string|ArrayBuffer|Buffer|TypedArray|DataView|null}
* `options` {Object} [`stream.transform` options][]
* Returns: {Cipheriv}

ပေးထားတဲ့ `algorithm`, `key` နဲ့ initialization vector (`iv`) တို့ကို သုံးပြီး — `Cipheriv` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။

ဒီ `options` argument က stream ရဲ့ အပြုအမူကို ထိန်းချုပ်ပြီး — CCM သို့မဟုတ် OCB mode ရဲ့ cipher တစ်ခု (ဥပမာ — `'aes-128-ccm'`) ကို သုံးတဲ့အခါ ကလွဲလို့ — optional ပါ။ အဲဒီလို အခြေအနေမျိုးမှာ `authTagLength` option က မဖြစ်မနေ လိုအပ်ပြီး — authentication tag ရဲ့ အလျားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။ [CCM mode][] ကို ကြည့်ပါ။ GCM mode မှာတော့ `authTagLength` option က မလိုအပ်ပါဘူး — ဒါပေမယ့် `getAuthTag()` က ပြန်ပေးမယ့် authentication tag ရဲ့ အလျားကို သတ်မှတ်ဖို့ သုံးနိုင်ပြီး — default အနေနဲ့ 16 bytes ဖြစ်ပါတယ်။ `SIV`, `GCM-SIV` နဲ့ `chacha20-poly1305` တို့အတွက်တော့ `authTagLength` option က default အနေနဲ့ 16 bytes ပါ။ `SIV` နဲ့ `GCM-SIV` တို့က 16-byte authentication tags တွေကိုသာ support လုပ်ပါတယ်။

ဒီ `algorithm` က OpenSSL အပေါ်မှာ မူတည်ပြီး — ဥပမာတွေကတော့ `'aes192'` စသဖြင့်ပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl list -cipher-algorithms` က ရရှိနိုင်တဲ့ cipher algorithms တွေကို ပြသပေးပါတယ်။

`key` က `algorithm` က သုံးမယ့် raw key ဖြစ်ပြီး — `iv` ကတော့ [initialization vector][] တစ်ခုပါ။ Argument နှစ်ခုလုံးက `'utf8'` နဲ့ encode လုပ်ထားတဲ့ strings, [Buffers][`Buffer`], `TypedArray` (သို့) `DataView`s တွေ ဖြစ်ရပါမယ်။ `key` က optional အနေနဲ့ — `secret` type ရဲ့ [`KeyObject`][] တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ Cipher က initialization vector မလိုအပ်ဘူးဆိုရင် — `iv` ကို `null` အဖြစ် ထားနိုင်ပါတယ်။

String တွေကို `key` သို့မဟုတ် `iv` အဖြစ် ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပါ။

Initialization vectors တွေက ကြိုတင် ခန့်မှန်းလို့ မရနိုင်တဲ့ (unpredictable) တန်ဖိုးတွေ ဖြစ်ပြီး — တစ်ခုချင်းစီ ထူးခြားနေရပါမယ်; အကောင်းဆုံးကတော့ ၎င်းတို့က cryptographically random (လျှို့ဝှက်ရေးရာ ကျပန်းစနစ်နဲ့ ထုတ်လုပ်ထားသော) တန်ဖိုးတွေ ဖြစ်ဖို့ပါ။ ၎င်းတို့က လျှို့ဝှက် (secret) ဖြစ်စရာ မလိုပါဘူး: IVs တွေကို ပုံမှန်အားဖြင့် ciphertext messages တွေမှာ encrypt မလုပ်ပဲ ထည့်သွင်းလေ့ ရှိပါတယ်။ တစ်ခုခုက unpredictable ဖြစ်ပြီး ထူးခြားနေရမယ် ဆိုပေမယ့် — secret ဖြစ်စရာတော့ မလိုဘူးဆိုတာက ဆန့်ကျင်ဘက် ဖြစ်နေသလို ထင်ရနိုင်ပါတယ်; သတိရထားရမှာက — တိုက်ခိုက်သူ (attacker) တစ်ဦးက ပေးထားတဲ့ IV တစ်ခုက ဘာဖြစ်မယ်ဆိုတာကို ကြိုတင် မခန့်မှန်းနိုင်ရပါဘူး။

### `crypto.createDecipheriv(algorithm, key, iv[, options])`

* `algorithm` {string}
* `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
* `iv` {string|ArrayBuffer|Buffer|TypedArray|DataView|null}
* `options` {Object} [`stream.transform` options][]
* Returns: {Decipheriv}

ပေးထားတဲ့ `algorithm`, `key` နဲ့ initialization vector (`iv`) တို့ကို သုံးတဲ့ — `Decipheriv` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။

ဒီ `options` argument က stream ရဲ့ အပြုအမူကို ထိန်းချုပ်ပြီး — CCM သို့မဟုတ် OCB mode ရဲ့ cipher တစ်ခု (ဥပမာ — `'aes-128-ccm'`) ကို သုံးတဲ့အခါ ကလွဲလို့ — optional ပါ။ အဲဒီလို အခြေအနေမျိုးမှာ `authTagLength` option က မဖြစ်မနေ လိုအပ်ပြီး — authentication tag ရဲ့ အလျားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။ [CCM mode][] ကို ကြည့်ပါ။
AES-GCM နဲ့ `chacha20-poly1305` တို့အတွက် `authTagLength` option က default အနေနဲ့ 16 bytes ဖြစ်ပြီး — တခြား အလျားတစ်ခုကို သုံးမယ်ဆိုရင် မတူတဲ့ တန်ဖိုးတစ်ခုကို သတ်မှတ်ပေးရပါမယ်။ `SIV` နဲ့ `GCM-SIV` တို့အတွက်တော့ `authTagLength` option က default အနေနဲ့ 16 bytes ဖြစ်ပြီး — 16-byte authentication tags တွေကိုသာ support လုပ်ပါတယ်။

ဒီ `algorithm` က OpenSSL အပေါ်မှာ မူတည်ပြီး — ဥပမာတွေကတော့ `'aes192'` စသဖြင့်ပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl list -cipher-algorithms` က ရရှိနိုင်တဲ့ cipher algorithms တွေကို ပြသပေးပါတယ်။

`key` က `algorithm` က သုံးမယ့် raw key ဖြစ်ပြီး — `iv` ကတော့ [initialization vector][] တစ်ခုပါ။ Argument နှစ်ခုလုံးက `'utf8'` နဲ့ encode လုပ်ထားတဲ့ strings, [Buffers][`Buffer`], `TypedArray` (သို့) `DataView`s တွေ ဖြစ်ရပါမယ်။ `key` က optional အနေနဲ့ — `secret` type ရဲ့ [`KeyObject`][] တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။ Cipher က initialization vector မလိုအပ်ဘူးဆိုရင် — `iv` ကို `null` အဖြစ် ထားနိုင်ပါတယ်။

String တွေကို `key` သို့မဟုတ် `iv` အဖြစ် ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပါ။

Initialization vectors တွေက ကြိုတင် ခန့်မှန်းလို့ မရနိုင်တဲ့ (unpredictable) တန်ဖိုးတွေ ဖြစ်ပြီး — တစ်ခုချင်းစီ ထူးခြားနေရပါမယ်; အကောင်းဆုံးကတော့ ၎င်းတို့က cryptographically random တန်ဖိုးတွေ ဖြစ်ဖို့ပါ။ ၎င်းတို့က လျှို့ဝှက် (secret) ဖြစ်စရာ မလိုပါဘူး: IVs တွေကို ပုံမှန်အားဖြင့် ciphertext messages တွေမှာ encrypt မလုပ်ပဲ ထည့်သွင်းလေ့ ရှိပါတယ်။ တစ်ခုခုက unpredictable ဖြစ်ပြီး ထူးခြားနေရမယ် ဆိုပေမယ့် — secret ဖြစ်စရာတော့ မလိုဘူးဆိုတာက ဆန့်ကျင်ဘက် ဖြစ်နေသလို ထင်ရနိုင်ပါတယ်; သတိရထားရမှာက — တိုက်ခိုက်သူ (attacker) တစ်ဦးက ပေးထားတဲ့ IV တစ်ခုက ဘာဖြစ်မယ်ဆိုတာကို ကြိုတင် မခန့်မှန်းနိုင်ရပါဘူး။

### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])`

* `prime` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `primeEncoding` {string} `prime` string ရဲ့ [encoding][] ပါ။
* `generator` {number|string|ArrayBuffer|Buffer|TypedArray|DataView}
  **Default:** `2`
* `generatorEncoding` {string} `generator` string ရဲ့ [encoding][] ပါ။
* Returns: {DiffieHellman}

ပေးထားတဲ့ `prime` နဲ့ — optional ဖြစ်တဲ့ တိကျတဲ့ `generator` တစ်ခုကို သုံးပြီး — `DiffieHellman` key exchange object တစ်ခုကို ဖန်တီးပါတယ်။

`generator` argument က number, string (သို့) [`Buffer`][] ဖြစ်နိုင်ပါတယ်။ `generator` ကို သတ်မှတ်မထားဘူးဆိုရင် — `2` တန်ဖိုးကို သုံးပါတယ်။

`primeEncoding` ကို သတ်မှတ်ထားရင် — `prime` က string ဖြစ်ရမှာ ဖြစ်ပြီး — မဟုတ်ရင်တော့ [`Buffer`][], `TypedArray` (သို့) `DataView` ဖြစ်ရမှာ ဖြစ်ပါတယ်။

`generatorEncoding` ကို သတ်မှတ်ထားရင် — `generator` က string ဖြစ်ရမှာ ဖြစ်ပြီး — မဟုတ်ရင်တော့ number, [`Buffer`][], `TypedArray` (သို့) `DataView` ဖြစ်ရမှာ ဖြစ်ပါတယ်။

### `crypto.createDiffieHellman(primeLength[, generator])`

* `primeLength` {number}
* `generator` {number} **Default:** `2`
* Returns: {DiffieHellman}

`DiffieHellman` key exchange object တစ်ခုကို ဖန်တီးပြီး — optional ဖြစ်တဲ့ တိကျတဲ့ numeric `generator` တစ်ခုကို သုံးကာ — `primeLength` bits အရွယ်ရှိတဲ့ prime တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ `generator` ကို သတ်မှတ်မထားဘူးဆိုရင် — `2` တန်ဖိုးကို သုံးပါတယ်။

### `crypto.createDiffieHellmanGroup(name)`

* `name` {string}
* Returns: {DiffieHellmanGroup}

[`crypto.getDiffieHellman()`][] အတွက် alias တစ်ခုပါ။

### `crypto.createECDH(curveName)`

* `curveName` {string}
* Returns: {ECDH}

`curveName` string က သတ်မှတ်ပေးထားတဲ့ — ကြိုတင် သတ်မှတ်ထားသော (predefined) curve တစ်ခုကို သုံးပြီး — Elliptic Curve Diffie-Hellman (`ECDH`) key exchange object တစ်ခုကို ဖန်တီးပါတယ်။ ရရှိနိုင်တဲ့ curve names တွေရဲ့ စာရင်းကို ရယူဖို့ [`crypto.getCurves()`][] ကို သုံးပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl ecparam -list_curves` က ရရှိနိုင်တဲ့ elliptic curve တစ်ခုချင်းစီရဲ့ name နဲ့ description ကိုလည်း ပြသပေးပါတယ်။

### `crypto.createHash(algorithm[, options])`

* `algorithm` {string}
* `options` {Object} [`stream.transform` options][]
* Returns: {Hash}

ပေးထားတဲ့ `algorithm` ကို သုံးပြီး hash digests တွေကို ထုတ်လုပ်ဖို့ သုံးနိုင်တဲ့ — `Hash` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ Optional ဖြစ်တဲ့ `options` argument က stream ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။ `'shake256'` လိုမျိုး XOF hash functions တွေအတွက် — `outputLength` option ကို သုံးပြီး လိုချင်တဲ့ output length ကို bytes နဲ့ သတ်မှတ်နိုင်ပါတယ်။

Data က သေးငယ်ပြီး (< 5MB) အလွယ်တကူ ရရှိနိုင်တဲ့အခါ — [`crypto.hash()`][] က ပုံမှန်အားဖြင့် ပိုမြန်ပါတယ်။

ဒီ `algorithm` က platform ပေါ်က OpenSSL ရဲ့ version က support လုပ်ထားတဲ့ — ရရှိနိုင်တဲ့ algorithms တွေအပေါ်မှာ မူတည်ပါတယ်။ ဥပမာတွေကတော့ `'sha256'`, `'sha512'` စသဖြင့်ပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl list -digest-algorithms` က ရရှိနိုင်တဲ့ digest algorithms တွေကို ပြသပေးပါတယ်။

ဥပမာ: file တစ်ခုရဲ့ sha256 sum ကို ထုတ်လုပ်ခြင်း

```mjs
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```cjs
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

### `crypto.createHmac(algorithm, key[, options])`

* `algorithm` {string}
* `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
* `options` {Object} [`stream.transform` options][]
  * `encoding` {string} `key` က string တစ်ခု ဖြစ်တဲ့အခါ သုံးမယ့် string encoding ပါ။
* Returns: {Hmac}

ပေးထားတဲ့ `algorithm` နဲ့ `key` တို့ကို သုံးတဲ့ — `Hmac` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ Optional ဖြစ်တဲ့ `options` argument က stream ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။

ဒီ `algorithm` က platform ပေါ်က OpenSSL ရဲ့ version က support လုပ်ထားတဲ့ — ရရှိနိုင်တဲ့ algorithms တွေအပေါ်မှာ မူတည်ပါတယ်။ ဥပမာတွေကတော့ `'sha256'`, `'sha512'` စသဖြင့်ပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl list -digest-algorithms` က ရရှိနိုင်တဲ့ digest algorithms တွေကို ပြသပေးပါတယ်။

ဒီ `key` က cryptographic HMAC hash ကို ထုတ်လုပ်ဖို့ သုံးတဲ့ HMAC key ပါ။ ၎င်းက [`KeyObject`][] တစ်ခု ဆိုရင် — ၎င်းရဲ့ type က `secret` ဖြစ်ရပါမယ်။ String တစ်ခုဆိုရင်တော့ [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပါ။ [`crypto.randomBytes()`][] သို့မဟုတ် [`crypto.generateKey()`][] လိုမျိုး — cryptographically secure ဖြစ်တဲ့ entropy source တစ်ခုကနေ ရယူထားတာဆိုရင် — ၎င်းရဲ့ အလျားက `algorithm` ရဲ့ block size (ဥပမာ — SHA-256 အတွက် 512 bits) ကို မကျော်လွန်သင့်ပါဘူး။

ဥပမာ: file တစ်ခုရဲ့ sha256 HMAC ကို ထုတ်လုပ်ခြင်း

```mjs
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```cjs
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

### `crypto.createPrivateKey(key)`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|URL}
  * `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|Object|URL} Key
    material က PEM, DER, JWK (သို့) raw format တွေထဲက တစ်ခုခုနဲ့ ရှိနိုင်ပြီး — (သို့) OpenSSL STORE loader တစ်ခုအတွက် object တစ်ခုကို ရည်ညွှန်းတဲ့ {URL} တစ်ခု ဖြစ်နိုင်ပါတယ်။
  * `format` {string} `'pem'`, `'der'`, `'jwk'`, `'raw-private'` (သို့) `'raw-seed'` ဖြစ်ရပါမယ်။ **Default:** `'pem'`.
  * `type` {string} `'pkcs1'`, `'pkcs8'` (သို့) `'sec1'` ဖြစ်ရပါမယ်။ ဒီ option က `format` က `'der'` ဖြစ်တဲ့အခါမှသာ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
  * `passphrase` {string | Buffer} Decryption အတွက် သုံးမယ့် passphrase ပါ။ `key` က {URL} တစ်ခု ဖြစ်နေတဲ့အခါ — ဒါက STORE loader ဆီကို ရှေ့ဆက် ပို့ပေးတဲ့ optional PIN/passphrase ပါ။
  * `properties` {string} {URL} key တစ်ခုအတွက် STORE loader ကို ရယူတဲ့အခါ သုံးတဲ့ optional OpenSSL property query ပါ။
  * `encoding` {string} `key` က string တစ်ခု ဖြစ်တဲ့အခါ သုံးမယ့် string encoding ပါ။
  * `asymmetricKeyType` {string} `format` က `'raw-private'` (သို့) `'raw-seed'` ဖြစ်တဲ့အခါ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
    [supported key type][asymmetric key types] တစ်ခု ဖြစ်ရပါမယ်။
  * `namedCurve` {string} သုံးမယ့် curve ရဲ့ နာမည်ပါ။ `asymmetricKeyType` က `'ec'` ဖြစ်တဲ့အခါ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
* Returns: {KeyObject}

Private key တစ်ခု ပါဝင်တဲ့ key object အသစ်တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ `key` က string (သို့) `Buffer` ဖြစ်နေရင် — `format` ကို `'pem'` အဖြစ် မှတ်ယူပါတယ်; မဟုတ်ရင်တော့ — `key` က အပေါ်မှာ ဖော်ပြထားတဲ့ properties တွေ ပါဝင်တဲ့ object တစ်ခု ဖြစ်ရပါမယ်။

Private key ကို encrypt လုပ်ထားရင် — `passphrase` တစ်ခုကို သတ်မှတ်ပေးရပါမယ်။ Passphrase ရဲ့ အလျားက 1024 bytes ထိ ကန့်သတ်ထားပါတယ်။

#### OpenSSL STORE loaders များမှ private keys များ (Private keys from OpenSSL STORE loaders)

> Stability: 1.1 - Active development

`key` က {URL} တစ်ခု (သို့) `key` က {URL} ဖြစ်နေတဲ့ object တစ်ခု ဆိုရင် — private key ကို OpenSSL STORE loader တစ်ခုကနေတစ်ဆင့် load လုပ်ပါတယ်။ URL ကို URI တစ်ခုအနေနဲ့ OpenSSL ဆီကို ဖြတ်သန်းပေးပါတယ် — ဥပမာ `file:` URI တစ်ခု (သို့) `pkcs11:` လိုမျိုး provider ကျောထောက်နောက်ခံ (provider-backed) scheme တစ်ခုပါ။ [Permission Model][] ကို ဖွင့်ထားတဲ့အခါ — [`--allow-openssl-store`][] က မဖြစ်မနေ လိုအပ်ပါတယ်။

> **Warning**: URI scheme တစ်ခုက OpenSSL STORE loader တစ်ခုကို ချိတ်သွယ် အာမခံထားတာ (pin) မဟုတ်သလို — ပြန်ပေးလိုက်တဲ့ key က ဘယ်ကနေ လာတယ်ဆိုတာကိုလည်း သက်သေ မပြနိုင်ပါဘူး။ Node.js က URI ကို OpenSSL ဆီကို ရှေ့ဆက် ပို့ပေးပြီး — OpenSSL က ၎င်းရဲ့ version နဲ့ configuration အလိုက် loaders တွေကို ရွေးချယ်ပါတယ်။ ဥပမာ — OpenSSL က `pkcs11:object=...` (scheme ရဲ့ နောက်မှာ `//` မပါတဲ့) လိုမျိုး မထင်ရှားတဲ့ (opaque) URI တစ်ခုကို — `pkcs11` loader ကို မစမ်းခင် — ၎င်းရဲ့ `file` loader ဆီကို ဦးစွာ ကမ်းလှမ်းနိုင်ပါတယ်။ URI အပြည့်အစုံက တရားဝင်တဲ့ local path တစ်ခု ဖြစ်ပြီး အဲဒီ file ရှိနေမယ်ဆိုရင် — ၎င်းကို အဲဒီအစား load လုပ်ခံရနိုင်ပါတယ်။ Node.js က ဘယ် loader က key ကို ထောက်ပံ့ပေးခဲ့တယ်ဆိုတာကို စစ်ဆေးမပေးပါဘူး။ Provider အတွက် သီးသန့် (provider-specific) URI scheme တစ်ခုကို — key တစ်ခုက အဲဒီ provider (သို့) hardware device တစ်ခုကနေ လာတယ်ဆိုတဲ့ သက်သေအနေနဲ့ — မှီခို မပြုလုပ်ပါနဲ့။

Configured လုပ်ထားတဲ့ OpenSSL STORE loaders တွေက ကျယ်ပြန့်တဲ့ အခွင့်အာဏာ (authority) ရှိပြီး — files, devices, tokens (သို့) network တွေကို ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။ Loader တစ်ခုက လုပ်ဆောင်တဲ့ access ကို `fs.read`, `fs.write` (သို့) `net` permission scopes တွေနဲ့ ကန့်သတ်မထားပါဘူး။

{URL} တစ်ခုကို သုံးတဲ့အခါ — `format`, `type`, `asymmetricKeyType` နဲ့ `namedCurve` တို့ကို လျစ်လျူရှုပါတယ် — အဲဒီ options တွေက တစ်ခုနဲ့တစ်ခု မှီခိုနေတဲ့ (ဥပမာ — `format: 'der'` နဲ့ `type`၊ (သို့) `asymmetricKeyType: 'ec'` နဲ့ `namedCurve`) အခြေအနေမျိုးမှာတောင် ဖြစ်ပါတယ်။ Input ကို PEM, DER, JWK (သို့) raw key material အဖြစ် ကိုင်တွယ်တာ မဟုတ်ပဲ — URI တစ်ခုအနေနဲ့ STORE loader ဆီကို ဖြတ်သန်းပေးပါတယ်။ `passphrase` ကိုတော့ loader ဆီကို ပို့ပေးတဲ့ optional PIN/passphrase အဖြစ် ဆက်လက် သုံးပြီး — အဲဒီ `passphrase` က string တစ်ခုဆိုရင် `encoding` ကလည်း သက်ရောက်မှု ရှိပါတယ်။

STORE loader ဆီကို ဖြတ်သန်းပေးတဲ့ URI ထဲမှာ credentials တွေ ထည့်သွင်းတာမယ့်အစား — `passphrase` ကို သုံးပါ။ Node.js က ၎င်းရဲ့ permission-denial resource နဲ့ diagnostics တွေကနေ URI ကို ဖျောက်ဖျက် (redact) လုပ်ပါတယ်။ Loading စတင်ပြီးနောက်မှာ OpenSSL (သို့) provider က သတင်းပို့တဲ့ errors တွေမှာ URI ပါဝင်နိုင်ပါတယ်။

{URL} key တစ်ခုနဲ့ `properties` ကို သတ်မှတ်ထားရင် — ၎င်းကို STORE loader ကို ရွေးချယ်ဖို့အတွက် property query အဖြစ် OpenSSL ဆီကို ဖြတ်သန်းပေးပါတယ်။ ၎င်းကို URL ဆီမှာ ထပ်ဆင့် မထည့်သွင်းပဲ — provider-specific URI parameters တွေနဲ့ သီးခြားစီ ဖြစ်ပါတယ်။

### `crypto.createPublicKey(key)`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView}
  * `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|Object} Key
    material က PEM, DER, JWK (သို့) raw format တွေထဲက တစ်ခုခုနဲ့ ရှိနိုင်ပါတယ်။
  * `format` {string} `'pem'`, `'der'`, `'jwk'` (သို့) `'raw-public'` ဖြစ်ရပါမယ်။
    **Default:** `'pem'`.
  * `type` {string} `'pkcs1'` (သို့) `'spki'` ဖြစ်ရပါမယ်။ ဒီ option က `format` က `'der'` ဖြစ်တဲ့အခါမှသာ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
  * `encoding` {string} `key` က string တစ်ခု ဖြစ်တဲ့အခါ သုံးမယ့် string encoding ပါ။
  * `asymmetricKeyType` {string} `format` က `'raw-public'` ဖြစ်တဲ့အခါ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
    [supported key type][asymmetric key types] တစ်ခု ဖြစ်ရပါမယ်။
  * `namedCurve` {string} သုံးမယ့် curve ရဲ့ နာမည်ပါ။ `asymmetricKeyType` က `'ec'` ဖြစ်တဲ့အခါ လိုအပ်ပြီး — မဟုတ်ရင် လျစ်လျူရှုခံရပါတယ်။
* Returns: {KeyObject}

Public key တစ်ခု ပါဝင်တဲ့ key object အသစ်တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ `key` က string (သို့) `Buffer` ဖြစ်နေရင် — `format` ကို `'pem'` အဖြစ် မှတ်ယူပါတယ်; `key` က `'private'` type ရဲ့ `KeyObject` တစ်ခု ဖြစ်နေရင် — public key ကို ပေးထားတဲ့ private key ကနေ ဆင်းသက် (derive) လုပ်ပါတယ်; မဟုတ်ရင်တော့ — `key` က အပေါ်မှာ ဖော်ပြထားတဲ့ properties တွေ ပါဝင်တဲ့ object တစ်ခု ဖြစ်ရပါမယ်။

`format` က `'pem'` ဆိုရင် — `'key'` က X.509 certificate တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။

Public keys တွေက private keys တွေကနေ ဆင်းသက်လို့ ရတာမို့ — public key တစ်ခုရဲ့ အစား private key တစ်ခုကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — ဒီ function က [`crypto.createPrivateKey()`][] ကို ခေါ်ထားသလိုပဲ ပြုမူပေမယ့် — ပြန်ပေးလိုက်တဲ့ `KeyObject` ရဲ့ type က `'public'` ဖြစ်ပြီး — ပြန်ပေးလိုက်တဲ့ `KeyObject` ကနေ private key ကို ထုတ်ယူလို့ မရနိုင်တာပဲ ကွာပါတယ်။ အလားတူ — `'private'` type ရဲ့ `KeyObject` တစ်ခုကို ပေးလိုက်ရင် — `'public'` type နဲ့ `KeyObject` အသစ်တစ်ခုကို ပြန်ပေးပြီး — ပြန်ပေးလိုက်တဲ့ object ကနေ private key ကို ထုတ်ယူဖို့ မဖြစ်နိုင်ပါဘူး။

Store ကျောထောက်နောက်ခံ (store-backed) private key တစ်ခုကို — အရင်ဆုံး [`crypto.createPrivateKey()`][] နဲ့ load လုပ်ပြီးရင် — public key တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်; {URL} တစ်ခုကိုတော့ `crypto.createPublicKey()` ဆီကို တိုက်ရိုက် ဖြတ်သန်းလို့ မရပါဘူး။

### `crypto.createSecretKey(key[, encoding])`

* `key` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `encoding` {string} `key` က string ဖြစ်တဲ့အခါ သုံးမယ့် string encoding ပါ။
* Returns: {KeyObject}

Symmetric encryption (အချိုးညီ စာဝှက်စနစ်) (သို့) `Hmac` အတွက် secret key တစ်ခု ပါဝင်တဲ့ key object အသစ်တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။

### `crypto.createSign(algorithm[, options])`

* `algorithm` {string}
* `options` {Object} [`stream.Writable` options][]
* Returns: {Sign}

ပေးထားတဲ့ `algorithm` ကို သုံးတဲ့ — `Sign` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ ရရှိနိုင်တဲ့ digest algorithms တွေရဲ့ နာမည်တွေကို ရယူဖို့ [`crypto.getHashes()`][] ကို သုံးပါ။ Optional ဖြစ်တဲ့ `options` argument က `stream.Writable` ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။

အချို့သော အခြေအနေတွေမှာ — digest algorithm တစ်ခုရဲ့ နာမည်အစား — `'RSA-SHA256'` လိုမျိုး signature algorithm တစ်ခုရဲ့ နာမည်ကို သုံးပြီးလည်း `Sign` instance တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ အဲဒီလိုဆိုရင် သက်ဆိုင်ရာ digest algorithm ကို သုံးပါလိမ့်မယ်။ ဒါက `'ecdsa-with-SHA256'` လိုမျိုး signature algorithms တွေ အားလုံးအတွက် အလုပ်မလုပ်တာမို့ — အမြဲတမ်း digest algorithm names တွေကိုပဲ သုံးတာ အကောင်းဆုံးပါ။

### `crypto.createVerify(algorithm[, options])`

* `algorithm` {string}
* `options` {Object} [`stream.Writable` options][]
* Returns: {Verify}

ပေးထားတဲ့ algorithm ကို သုံးတဲ့ — `Verify` object တစ်ခုကို ဖန်တီးကာ ပြန်ပေးပါတယ်။ ရရှိနိုင်တဲ့ signing algorithms တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုကို ရယူဖို့ [`crypto.getHashes()`][] ကို သုံးပါ။ Optional ဖြစ်တဲ့ `options` argument က `stream.Writable` ရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။

အချို့သော အခြေအနေတွေမှာ — digest algorithm တစ်ခုရဲ့ နာမည်အစား — `'RSA-SHA256'` လိုမျိုး signature algorithm တစ်ခုရဲ့ နာမည်ကို သုံးပြီးလည်း `Verify` instance တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ အဲဒီလိုဆိုရင် သက်ဆိုင်ရာ digest algorithm ကို သုံးပါလိမ့်မယ်။ ဒါက `'ecdsa-with-SHA256'` လိုမျိုး signature algorithms တွေ အားလုံးအတွက် အလုပ်မလုပ်တာမို့ — အမြဲတမ်း digest algorithm names တွေကိုပဲ သုံးတာ အကောင်းဆုံးပါ။

### `crypto.decapsulate(key, ciphertext[, callback])`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|URL} Private Key ပါ
* `ciphertext` {ArrayBuffer|Buffer|TypedArray|DataView}
* `callback` {Function}
  * `err` {Error}
  * `sharedKey` {Buffer}
* Returns: {Buffer} `callback` function ကို မပေးထားဘူးဆိုရင် ပါ။

Private key တစ်ခုနဲ့အတူ KEM algorithm တစ်ခုကို သုံးပြီး — key decapsulation (key ကို ဖော်ထုတ်ခြင်း) လုပ်ဆောင်ပေးပါတယ်။

Support လုပ်ထားတဲ့ key types တွေနဲ့ ၎င်းတို့ရဲ့ KEM algorithms တွေကတော့:

* `'rsa'`[^openssl30] RSA Secret Value Encapsulation
* `'ec'`[^openssl32] DHKEM(P-256, HKDF-SHA256), DHKEM(P-384, HKDF-SHA256), DHKEM(P-521, HKDF-SHA256)
* `'x25519'`[^openssl32] DHKEM(X25519, HKDF-SHA256)
* `'x448'`[^openssl32] DHKEM(X448, HKDF-SHA512)
* `'ml-kem-512'`[^openssl35] ML-KEM
* `'ml-kem-768'`[^openssl35] ML-KEM
* `'ml-kem-1024'`[^openssl35] ML-KEM

`key` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။

`callback` function ကို ပေးထားရင် — ဒီ function က libuv ရဲ့ threadpool ကို သုံးပါတယ်။

### `crypto.diffieHellman(options[, callback])`

* `options` {Object}
  * `privateKey` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|URL}
  * `publicKey` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject}
* `callback` {Function}
  * `err` {Error}
  * `secret` {Buffer}
* Returns: {Buffer} `callback` function ကို မပေးထားဘူးဆိုရင် ပါ။

`privateKey` နဲ့ `publicKey` တစ်ခုကို အခြေခံပြီး — Diffie-Hellman shared secret ကို တွက်ချက်ပေးပါတယ်။ Key နှစ်ခုလုံးက တူညီတဲ့ asymmetric key type ကို ကိုယ်စားပြုရပြီး — DH (သို့) ECDH operation တစ်ခုခုကို support လုပ်ရပါမယ်။

`options.privateKey` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `options.privateKey` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။

`options.publicKey` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `options.publicKey` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။

`callback` function ကို ပေးထားရင် — ဒီ function က libuv ရဲ့ threadpool ကို သုံးပါတယ်။

### `crypto.encapsulate(key[, callback])`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject} Public Key ပါ
* `callback` {Function}
  * `err` {Error}
  * `result` {Object}
    * `sharedKey` {Buffer}
    * `ciphertext` {Buffer}
* Returns: {Object} `callback` function ကို မပေးထားဘူးဆိုရင် ပါ။
  * `sharedKey` {Buffer}
  * `ciphertext` {Buffer}

Public key တစ်ခုနဲ့အတူ KEM algorithm တစ်ခုကို သုံးပြီး — key encapsulation (key ကို ထုပ်ပိုးခြင်း) လုပ်ဆောင်ပေးပါတယ်။

Support လုပ်ထားတဲ့ key types တွေနဲ့ ၎င်းတို့ရဲ့ KEM algorithms တွေကတော့:

* `'rsa'`[^openssl30] RSA Secret Value Encapsulation
* `'ec'`[^openssl32] DHKEM(P-256, HKDF-SHA256), DHKEM(P-384, HKDF-SHA256), DHKEM(P-521, HKDF-SHA256)
* `'x25519'`[^openssl32] DHKEM(X25519, HKDF-SHA256)
* `'x448'`[^openssl32] DHKEM(X448, HKDF-SHA512)
* `'ml-kem-512'`[^openssl35] ML-KEM
* `'ml-kem-768'`[^openssl35] ML-KEM
* `'ml-kem-1024'`[^openssl35] ML-KEM

`key` က [`KeyObject`][] တစ်ခု မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးခဲ့သလိုပဲ ပြုမူပါတယ်။

`callback` function ကို ပေးထားရင် — ဒီ function က libuv ရဲ့ threadpool ကို သုံးပါတယ်။

### `crypto.fips`

> Stability: 0 - Deprecated

[FIPS mode][] ကို စစ်ဆေးခြင်းနဲ့ ထိန်းချုပ်ခြင်းအတွက် — deprecated (အသုံးမပြုတော့ရန်) ဖြစ်သွားတဲ့ property တစ်ခုပါ။ [`crypto.getFips()`][] နဲ့ [`crypto.setFips()`][] တို့ကို အစားထိုး သုံးပါ။

### `crypto.generateKey(type, options, callback)`

* `type` {string} ထုတ်လုပ်လိုက်တဲ့ secret key ရဲ့ ရည်ရွယ်ထားတဲ့ သုံးစွဲမှု (intended use) ပါ။ လက်ရှိ လက်ခံထားတဲ့ တန်ဖိုးတွေကတော့ `'hmac'` နဲ့ `'aes'` တို့ပါ။
* `options` {Object}
  * `length` {number} ထုတ်လုပ်ရမယ့် key ရဲ့ bit length ပါ။ ဒါက 0 ထက် ကြီးတဲ့ တန်ဖိုးတစ်ခု ဖြစ်ရပါမယ်။
    * `type` က `'hmac'` ဆိုရင် — အနည်းဆုံးက 8 ဖြစ်ပြီး — အများဆုံး အလျားက 231-1 ပါ။ တန်ဖိုးက 8 ရဲ့ မြှောက်ဖော် (multiple) မဟုတ်ဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ key ကို `Math.floor(length / 8)` အထိ ဖြတ်တောက် (truncate) လုပ်ပါလိမ့်မယ်။
    * `type` က `'aes'` ဆိုရင် — length က `128`, `192` (သို့) `256` ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* `callback` {Function}
  * `err` {Error}
  * `key` {KeyObject}

ပေးထားတဲ့ `length` နဲ့ random secret key အသစ်တစ်ခုကို asynchronously ထုတ်လုပ်ပေးပါတယ်။ `type` က `length` အပေါ်မှာ ဘယ် validations (စစ်ဆေးမှုများ) တွေ လုပ်ဆောင်မလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။

```mjs
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```cjs
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

ထုတ်လုပ်လိုက်တဲ့ HMAC key တစ်ခုရဲ့ အရွယ်အစားက underlying hash function ရဲ့ block size ကို မကျော်လွန်သင့်ပါဘူး။ နောက်ထပ် အချက်အလက်တွေအတွက် [`crypto.createHmac()`][] ကို ကြည့်ပါ။

### `crypto.generateKeyPair(type, options, callback)`

* `type` {string} ထုတ်လုပ်ရမယ့် asymmetric key type ပါ။ Support လုပ်ထားတဲ့ [asymmetric key types][] ကို ကြည့်ပါ။
* `options` {Object}
  * `modulusLength` {number} bits နဲ့ ဖော်ပြတဲ့ key size ပါ (RSA, DSA)။
  * `publicExponent` {number} Public exponent ပါ (RSA)။ **Default:** `0x10001`.
  * `hashAlgorithm` {string} Message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `mgf1HashAlgorithm` {string} MGF1 က သုံးတဲ့ message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `saltLength` {number} bytes နဲ့ ဖော်ပြတဲ့ အနည်းဆုံး salt length ပါ (RSA-PSS)။
  * `divisorLength` {number} bits နဲ့ ဖော်ပြတဲ့ `q` ရဲ့ အရွယ်အစားပါ (DSA)။
  * `namedCurve` {string} သုံးမယ့် curve ရဲ့ နာမည်ပါ (EC)။
  * `prime` {Buffer} Prime parameter ပါ (DH)။
  * `primeLength` {number} bits နဲ့ ဖော်ပြတဲ့ prime length ပါ (DH)။
  * `generator` {number} Custom generator ပါ (DH)။ **Default:** `2`.
  * `groupName` {string} Diffie-Hellman group name ပါ (DH)။
    [`crypto.getDiffieHellman()`][] ကို ကြည့်ပါ။
  * `paramEncoding` {string} `'named'` (သို့) `'explicit'` ဖြစ်ရပါမယ် (EC)။
    **Default:** `'named'`.
  * `publicKeyEncoding` {Object} [`keyObject.export()`][] ကို ကြည့်ပါ။
  * `privateKeyEncoding` {Object} [`keyObject.export()`][] ကို ကြည့်ပါ။
* `callback` {Function}
  * `err` {Error}
  * `publicKey` {string | Buffer | KeyObject}
  * `privateKey` {string | Buffer | KeyObject}

ပေးထားတဲ့ `type` နဲ့ asymmetric key pair အသစ်တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Support လုပ်ထားတဲ့ [asymmetric key types][] ကို ကြည့်ပါ။

`publicKeyEncoding` (သို့) `privateKeyEncoding` တစ်ခုခုကို သတ်မှတ်ထားရင် — ဒီ function က ၎င်းရဲ့ ရလဒ်ပေါ်မှာ [`keyObject.export()`][] ကို ခေါ်ထားသလိုပဲ ပြုမူပါတယ်။ မဟုတ်ရင်တော့ — key ရဲ့ သက်ဆိုင်ရာ အပိုင်းကို [`KeyObject`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Long-term storage (ရေရှည် သိမ်းဆည်းမှု) အတွက် — public keys တွေကို `'spki'` အနေနဲ့လည်းကောင်း — private keys တွေကို encryption ပါဝင်တဲ့ `'pkcs8'` အနေနဲ့လည်းကောင်း — encode လုပ်ဖို့ အကြံပြုပါတယ်:

```mjs
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```

```cjs
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```

ပြီးဆုံးတဲ့အခါ — `err` ကို `undefined` အဖြစ် သတ်မှတ်ပြီး — ထုတ်လုပ်လိုက်တဲ့ key pair ကို ကိုယ်စားပြုတဲ့ `publicKey` / `privateKey` တို့နဲ့အတူ — `callback` ကို ခေါ်ပါလိမ့်မယ်။

ဒီ method ကို ၎င်းရဲ့ [`util.promisify()`][]ed version အနေနဲ့ ခေါ်ယူလိုက်ရင် — `publicKey` နဲ့ `privateKey` properties တွေ ပါဝင်တဲ့ `Object` တစ်ခုအတွက် `Promise` တစ်ခုကို ပြန်ပေးပါတယ်။

### `crypto.generateKeyPairSync(type, options)`

* `type` {string} ထုတ်လုပ်ရမယ့် asymmetric key type ပါ။ Support လုပ်ထားတဲ့ [asymmetric key types][] ကို ကြည့်ပါ။
* `options` {Object}
  * `modulusLength` {number} bits နဲ့ ဖော်ပြတဲ့ key size ပါ (RSA, DSA)။
  * `publicExponent` {number} Public exponent ပါ (RSA)။ **Default:** `0x10001`.
  * `hashAlgorithm` {string} Message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `mgf1HashAlgorithm` {string} MGF1 က သုံးတဲ့ message digest ရဲ့ နာမည်ပါ (RSA-PSS)။
  * `saltLength` {number} bytes နဲ့ ဖော်ပြတဲ့ အနည်းဆုံး salt length ပါ (RSA-PSS)။
  * `divisorLength` {number} bits နဲ့ ဖော်ပြတဲ့ `q` ရဲ့ အရွယ်အစားပါ (DSA)။
  * `namedCurve` {string} သုံးမယ့် curve ရဲ့ နာမည်ပါ (EC)။
  * `prime` {Buffer} Prime parameter ပါ (DH)။
  * `primeLength` {number} bits နဲ့ ဖော်ပြတဲ့ prime length ပါ (DH)။
  * `generator` {number} Custom generator ပါ (DH)။ **Default:** `2`.
  * `groupName` {string} Diffie-Hellman group name ပါ (DH)။
    [`crypto.getDiffieHellman()`][] ကို ကြည့်ပါ။
  * `paramEncoding` {string} `'named'` (သို့) `'explicit'` ဖြစ်ရပါမယ် (EC)။
    **Default:** `'named'`.
  * `publicKeyEncoding` {Object} [`keyObject.export()`][] ကို ကြည့်ပါ။
  * `privateKeyEncoding` {Object} [`keyObject.export()`][] ကို ကြည့်ပါ။
* Returns: {Object}
  * `publicKey` {string | Buffer | KeyObject}
  * `privateKey` {string | Buffer | KeyObject}

ပေးထားတဲ့ `type` နဲ့ asymmetric key pair အသစ်တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Support လုပ်ထားတဲ့ [asymmetric key types][] ကို ကြည့်ပါ။

`publicKeyEncoding` (သို့) `privateKeyEncoding` တစ်ခုခုကို သတ်မှတ်ထားရင် — ဒီ function က ၎င်းရဲ့ ရလဒ်ပေါ်မှာ [`keyObject.export()`][] ကို ခေါ်ထားသလိုပဲ ပြုမူပါတယ်။ မဟုတ်ရင်တော့ — key ရဲ့ သက်ဆိုင်ရာ အပိုင်းကို [`KeyObject`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Public keys တွေကို encode လုပ်တဲ့အခါ — `'spki'` ကို သုံးဖို့ အကြံပြုပါတယ်။ Private keys တွေကို encode လုပ်တဲ့အခါ — ခိုင်မာတဲ့ (strong) passphrase တစ်ခုနဲ့အတူ `'pkcs8'` ကို သုံးဖို့ အကြံပြုပြီး — passphrase ကို လျှို့ဝှက် ထားရှိဖို့လည်း အကြံပြုပါတယ်။

```mjs
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```cjs
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

ပြန်ပေးလိုက်တဲ့ တန်ဖိုး `{ publicKey, privateKey }` က ထုတ်လုပ်လိုက်တဲ့ key pair ကို ကိုယ်စားပြုပါတယ်။ PEM encoding ကို ရွေးချယ်ထားတဲ့အခါ — သက်ဆိုင်ရာ key က string တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ DER အနေနဲ့ encode လုပ်ထားတဲ့ data တွေ ပါဝင်တဲ့ buffer တစ်ခု ဖြစ်ပါလိမ့်မယ်။

### `crypto.generateKeySync(type, options)`

* `type` {string} ထုတ်လုပ်လိုက်တဲ့ secret key ရဲ့ ရည်ရွယ်ထားတဲ့ သုံးစွဲမှု (intended use) ပါ။ လက်ရှိ လက်ခံထားတဲ့ တန်ဖိုးတွေကတော့ `'hmac'` နဲ့ `'aes'` တို့ပါ။
* `options` {Object}
  * `length` {number} ထုတ်လုပ်ရမယ့် key ရဲ့ bit length ပါ။
    * `type` က `'hmac'` ဆိုရင် — အနည်းဆုံးက 8 ဖြစ်ပြီး — အများဆုံး အလျားက 231-1 ပါ။ တန်ဖိုးက 8 ရဲ့ မြှောက်ဖော် (multiple) မဟုတ်ဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ key ကို `Math.floor(length / 8)` အထိ ဖြတ်တောက် (truncate) လုပ်ပါလိမ့်မယ်။
    * `type` က `'aes'` ဆိုရင် — length က `128`, `192` (သို့) `256` ထဲက တစ်ခု ဖြစ်ရပါမယ်။
* Returns: {KeyObject}

ပေးထားတဲ့ `length` နဲ့ random secret key အသစ်တစ်ခုကို synchronously ထုတ်လုပ်ပေးပါတယ်။ `type` က `length` အပေါ်မှာ ဘယ် validations တွေ လုပ်ဆောင်မလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။

```mjs
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```cjs
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

ထုတ်လုပ်လိုက်တဲ့ HMAC key တစ်ခုရဲ့ အရွယ်အစားက underlying hash function ရဲ့ block size ကို မကျော်လွန်သင့်ပါဘူး။ နောက်ထပ် အချက်အလက်တွေအတွက် [`crypto.createHmac()`][] ကို ကြည့်ပါ။

### `crypto.generatePrime(size[, options], callback)`

* `size` {number} ထုတ်လုပ်ရမယ့် prime ရဲ့ အရွယ်အစား (bits နဲ့) ပါ။
* `options` {Object}
  * `add` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  * `rem` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  * `safe` {boolean} **Default:** `false`.
  * `bigint` {boolean} `true` ဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ prime ကို `bigint` တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။
* `callback` {Function}
  * `err` {Error}
  * `prime` {ArrayBuffer|bigint}

`size` bits အရွယ်ရှိတဲ့ pseudorandom prime (အတုအယောင် ကျပန်း prime) တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

`options.safe` က `true` ဆိုရင် — prime က safe prime တစ်ခု ဖြစ်ပါလိမ့်မယ် — ဆိုလိုတာက `(prime - 1) / 2` ကလည်း prime တစ်ခု ဖြစ်နေမှာပါ။

`options.add` နဲ့ `options.rem` parameters တွေကို — ထပ်ဆောင်း လိုအပ်ချက်တွေ ပြဋ္ဌာန်းဖို့ သုံးနိုင်ပါတယ် — ဥပမာ Diffie-Hellman အတွက်ပါ:

* `options.add` နဲ့ `options.rem` နှစ်ခုလုံး သတ်မှတ်ထားရင် — prime က `prime % add = rem` ဆိုတဲ့ အခြေအနေကို ကျေနပ်စေပါလိမ့်မယ်။
* `options.add` တစ်ခုတည်းသာ သတ်မှတ်ပြီး `options.safe` က `true` မဟုတ်ဘူးဆိုရင် — prime က `prime % add = 1` ဆိုတဲ့ အခြေအနေကို ကျေနပ်စေပါလိမ့်မယ်။
* `options.add` တစ်ခုတည်းသာ သတ်မှတ်ပြီး `options.safe` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — prime က `prime % add = 3` ဆိုတဲ့ အခြေအနေကို အစားထိုး ကျေနပ်စေပါလိမ့်မယ်။ ဒါက လိုအပ်တာက — `options.add > 2` ဖြစ်တဲ့အခါ `prime % add = 1` ဆိုတာက `options.safe` က ပြဋ္ဌာန်းထားတဲ့ အခြေအနေကို ဆန့်ကျင်သွားလို့ပါ။
* `options.add` ကို မပေးထားရင် `options.rem` ကို လျစ်လျူရှုပါတယ်။

`options.add` ရော `options.rem` ပါ — `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` (သို့) `DataView` အနေနဲ့ ပေးထားရင် — big-endian sequences တွေအနေနဲ့ encode လုပ်ထားရပါမယ်။

Default အနေနဲ့ — prime ကို {ArrayBuffer} တစ်ခုထဲမှာ big-endian octets အစီအစဉ်တစ်ခုအနေနဲ့ encode လုပ်ပါတယ်။ `bigint` option က `true` ဆိုရင်တော့ — {bigint} တစ်ခုကို ပေးအပ်ပါတယ်။

Prime ရဲ့ `size` က prime ကို ထုတ်လုပ်ဖို့ ကြာမယ့် အချိန်အပေါ် တိုက်ရိုက် သက်ရောက်မှု ရှိပါတယ်။ Size ကြီးလေ — ကြာချိန် ရှည်လေပါ။ ကျွန်ုပ်တို့က OpenSSL ရဲ့ `BN_generate_prime_ex` function ကို သုံးတာမို့ — ၎င်းက generation process ကို ကြားဖြတ် ရပ်တန့်နိုင်မှုအပေါ် အနည်းငယ်မျှသာ ထိန်းချုပ်မှု ပေးပါတယ် — အလွန်အကျွံ ကြီးမားတဲ့ primes တွေကို ထုတ်လုပ်ဖို့ အကြံပြုလို့ မရပါဘူး — အဲဒီလို လုပ်တာက process ကို တုံ့ပြန်မှု မရှိတော့အောင် (unresponsive) ဖြစ်စေနိုင်လို့ပါ။

### `crypto.generatePrimeSync(size[, options])`

* `size` {number} ထုတ်လုပ်ရမယ့် prime ရဲ့ အရွယ်အစား (bits နဲ့) ပါ။
* `options` {Object}
  * `add` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  * `rem` {ArrayBuffer|SharedArrayBuffer|TypedArray|Buffer|DataView|bigint}
  * `safe` {boolean} **Default:** `false`.
  * `bigint` {boolean} `true` ဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ prime ကို `bigint` တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။
* Returns: {ArrayBuffer|bigint}

`size` bits အရွယ်ရှိတဲ့ pseudorandom prime တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

`options.safe` က `true` ဆိုရင် — prime က safe prime တစ်ခု ဖြစ်ပါလိမ့်မယ် — ဆိုလိုတာက `(prime - 1) / 2` ကလည်း prime တစ်ခု ဖြစ်နေမှာပါ။

`options.add` နဲ့ `options.rem` parameters တွေကို — ထပ်ဆောင်း လိုအပ်ချက်တွေ ပြဋ္ဌာန်းဖို့ သုံးနိုင်ပါတယ် — ဥပမာ Diffie-Hellman အတွက်ပါ:

* `options.add` နဲ့ `options.rem` နှစ်ခုလုံး သတ်မှတ်ထားရင် — prime က `prime % add = rem` ဆိုတဲ့ အခြေအနေကို ကျေနပ်စေပါလိမ့်မယ်။
* `options.add` တစ်ခုတည်းသာ သတ်မှတ်ပြီး `options.safe` က `true` မဟုတ်ဘူးဆိုရင် — prime က `prime % add = 1` ဆိုတဲ့ အခြေအနေကို ကျေနပ်စေပါလိမ့်မယ်။
* `options.add` တစ်ခုတည်းသာ သတ်မှတ်ပြီး `options.safe` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — prime က `prime % add = 3` ဆိုတဲ့ အခြေအနေကို အစားထိုး ကျေနပ်စေပါလိမ့်မယ်။ ဒါက လိုအပ်တာက — `options.add > 2` ဖြစ်တဲ့အခါ `prime % add = 1` ဆိုတာက `options.safe` က ပြဋ္ဌာန်းထားတဲ့ အခြေအနေကို ဆန့်ကျင်သွားလို့ပါ။
* `options.add` ကို မပေးထားရင် `options.rem` ကို လျစ်လျူရှုပါတယ်။

`options.add` ရော `options.rem` ပါ — `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` (သို့) `DataView` အနေနဲ့ ပေးထားရင် — big-endian sequences တွေအနေနဲ့ encode လုပ်ထားရပါမယ်။

Default အနေနဲ့ — prime ကို {ArrayBuffer} တစ်ခုထဲမှာ big-endian octets အစီအစဉ်တစ်ခုအနေနဲ့ encode လုပ်ပါတယ်။ `bigint` option က `true` ဆိုရင်တော့ — {bigint} တစ်ခုကို ပေးအပ်ပါတယ်။

Prime ရဲ့ `size` က prime ကို ထုတ်လုပ်ဖို့ ကြာမယ့် အချိန်အပေါ် တိုက်ရိုက် သက်ရောက်မှု ရှိပါတယ်။ Size ကြီးလေ — ကြာချိန် ရှည်လေပါ။ ကျွန်ုပ်တို့က OpenSSL ရဲ့ `BN_generate_prime_ex` function ကို သုံးတာမို့ — ၎င်းက generation process ကို ကြားဖြတ် ရပ်တန့်နိုင်မှုအပေါ် အနည်းငယ်မျှသာ ထိန်းချုပ်မှု ပေးပါတယ် — အလွန်အကျွံ ကြီးမားတဲ့ primes တွေကို ထုတ်လုပ်ဖို့ အကြံပြုလို့ မရပါဘူး — အဲဒီလို လုပ်တာက process ကို တုံ့ပြန်မှု မရှိတော့အောင် (unresponsive) ဖြစ်စေနိုင်လို့ပါ။

### `crypto.getCipherInfo(nameOrNid[, options])`

* `nameOrNid` {string|number} စစ်ဆေးမေးမြန်းရမယ့် (query) cipher ရဲ့ name (သို့) nid ပါ။
* `options` {Object}
  * `keyLength` {number} စမ်းသပ်ရန် key length တစ်ခုပါ။
  * `ivLength` {number} စမ်းသပ်ရန် IV length တစ်ခုပါ။
* Returns: {Object}
  * `name` {string} Cipher ရဲ့ နာမည်ပါ။
  * `nid` {number|undefined} Cipher ရဲ့ nid ပါ။ Cipher မှာ OpenSSL nid မရှိဘူးဆိုရင် ဒီ property က `undefined` ဖြစ်ပါတယ်။
  * `blockSize` {number|undefined} bytes နဲ့ ဖော်ပြတဲ့ cipher ရဲ့ block size ပါ။ `mode` က `'stream'` ဖြစ်တဲ့အခါ ဒီ property က `undefined` ဖြစ်ပါတယ်။
  * `ivLength` {number|undefined} bytes နဲ့ ဖော်ပြတဲ့ မျှော်လင့်ရတဲ့ (သို့) default initialization vector အလျားပါ။ Cipher က initialization vector မသုံးဘူးဆိုရင် ဒီ property က `undefined` ဖြစ်ပါတယ်။
  * `keyLength` {number} bytes နဲ့ ဖော်ပြတဲ့ မျှော်လင့်ရတဲ့ (သို့) default key length ပါ။
  * `mode` {string} Cipher ရဲ့ mode ပါ။ `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'gcm-siv'`, `'ocb'`, `'ofb'`, `'siv'`, `'stream'`, `'wrap'`, `'xts'` တို့ထဲက တစ်ခုပါ။

ပေးထားတဲ့ cipher တစ်ခုအကြောင်း အချက်အလက်တွေကို ပြန်ပေးပါတယ်။

Cipher အချို့က variable length keys (အလျား ပြောင်းလဲနိုင်တဲ့ keys) တွေနဲ့ initialization vectors တွေကို လက်ခံပါတယ်။ Default အနေနဲ့ — `crypto.getCipherInfo()` method က ဒီလို ciphers တွေအတွက် default တန်ဖိုးတွေကို ပြန်ပေးပါလိမ့်မယ်။ ပေးထားတဲ့ cipher တစ်ခုအတွက် key length (သို့) iv length တစ်ခုက လက်ခံနိုင်လားဆိုတာ စမ်းသပ်ဖို့ — `keyLength` နဲ့ `ivLength` options တွေကို သုံးပါ။ ပေးထားတဲ့ တန်ဖိုးတွေ လက်ခံလို့ မရဘူးဆိုရင် — `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

### `crypto.getCiphers()`

* Returns: {string\[]} Support လုပ်ထားတဲ့ cipher algorithms တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုပါ။

```mjs
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```cjs
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

### `crypto.getCurves()`

* Returns: {string\[]} Support လုပ်ထားတဲ့ elliptic curves တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုပါ။

```mjs
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```cjs
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

### `crypto.getDiffieHellman(groupName)`

* `groupName` {string}
* Returns: {DiffieHellmanGroup}

ကြိုတင် သတ်မှတ်ထားတဲ့ `DiffieHellmanGroup` key exchange object တစ်ခုကို ဖန်တီးပါတယ်။ Support လုပ်ထားတဲ့ groups တွေကို [`DiffieHellmanGroup`][] ရဲ့ documentation မှာ စာရင်းပြုစုထားပါတယ်။

ပြန်ပေးလိုက်တဲ့ object က [`crypto.createDiffieHellman()`][] နဲ့ ဖန်တီးထားတဲ့ objects တွေရဲ့ interface ကို အတုယူထားပေမယ့် — (ဥပမာ — [`diffieHellman.setPublicKey()`][] နဲ့) keys တွေကို ပြောင်းလဲခွင့် ပြုမှာ မဟုတ်ပါဘူး။ ဒီ method ကို သုံးခြင်းရဲ့ အားသာချက်က — ပါဝင်သူ (party) တွေက group modulus တစ်ခုကို ကြိုတင် ထုတ်လုပ်စရာ သို့မဟုတ် ဖလှယ်စရာ မလိုတာမို့ — processor ရော communication အချိန်ပါ သက်သာစေတာပါ။

ဥပမာ (shared secret တစ်ခုကို ရယူခြင်း):

```mjs
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```

```cjs
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```

### `crypto.getFips()`

* Returns: {number} FIPS mode ဖွင့်ထားရင် `1` — မဟုတ်ရင် `0` ပါ။ နောင်လာမယ့် semver-major release တစ်ခုက ဒီ API ရဲ့ return type ကို {boolean} အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။

OpenSSL 3 နဲ့ဆိုရင် — ဒါက default property query ထဲမှာ `fips=yes` ပါဝင်မဝင် ဆိုတာကို သတင်းပို့ပါတယ်။ FIPS provider တစ်ခု load လုပ်ထားတာ (သို့) validated ဖြစ်တာကိုတော့ သက်သေ မပြပါဘူး။ Load လုပ်ထားတဲ့ provider တစ်ခုမှ `fips=yes` အတွက် ကိုက်ညီမှု မပေးနိုင်လို့ — တောင်းဆိုလိုက်တဲ့ cryptographic implementation ကို ရယူလို့ မရနိုင်တဲ့ အခြေအနေမျိုးမှာတောင် `1` ကို ပြန်ပေးနိုင်ပါတယ်။ [FIPS
mode][] ကို ကြည့်ပါ။

### `crypto.getHashes()`

* Returns: {string\[]} `'RSA-SHA256'` လိုမျိုး — support လုပ်ထားတဲ့ hash algorithms တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုပါ။ Hash algorithms တွေကို "digest" algorithms လို့လည်း ခေါ်ပါတယ်။

```mjs
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```cjs
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

### `crypto.getRandomValues(typedArray)`

* `typedArray` {Buffer|TypedArray|DataView|ArrayBuffer}
* Returns: {Buffer|TypedArray|DataView|ArrayBuffer} `typedArray` ကိုပဲ ပြန်ပေးပါတယ်။

[`crypto.webcrypto.getRandomValues()`][] အတွက် အဆင်ပြေတဲ့ alias တစ်ခုပါ။ ဒီ implementation က Web Crypto spec နဲ့ ကိုက်ညီမှု မရှိပါဘူး — web နဲ့ လိုက်ဖက်တဲ့ (web-compatible) code တွေ ရေးဖို့ဆိုရင် [`crypto.webcrypto.getRandomValues()`][] ကို အစားထိုး သုံးပါ။

### `crypto.hash(algorithm, data[, options])`

* `algorithm` {string|undefined}
* `data` {string|Buffer|TypedArray|DataView} `data` က string ဖြစ်နေရင် — hash မလုပ်ခင် UTF-8 အဖြစ် encode လုပ်ပါလိမ့်မယ်။ String input တစ်ခုအတွက် တခြား input encoding တစ်ခုကို လိုချင်ရင် — user က `TextEncoder` (သို့) `Buffer.from()` တစ်ခုခုကို သုံးပြီး string ကို `TypedArray` တစ်ခုအဖြစ် encode လုပ်ကာ — encode လုပ်ထားတဲ့ `TypedArray` ကို ဒီ API ဆီကို အစားထိုး ဖြတ်သန်းပေးနိုင်ပါတယ်။
* `options` {Object|string}
  * `outputEncoding` {string} ပြန်ပေးလိုက်တဲ့ digest ကို encode လုပ်ဖို့ သုံးတဲ့ [Encoding][encoding] ပါ။ **Default:** `'hex'`.
  * `outputLength` {number} `'shake256'` လိုမျိုး XOF hash functions တွေအတွက် — `outputLength` option ကို သုံးပြီး လိုချင်တဲ့ output length ကို bytes နဲ့ သတ်မှတ်နိုင်ပါတယ်။
* Returns: {string|Buffer}

Data တွေရဲ့ one-shot hash digests တွေကို ဖန်တီးဖို့ utility တစ်ခုပါ။ အလွယ်တကူ ရရှိနိုင်တဲ့ — ပမာဏ အနည်းငယ်သာရှိတဲ့ data (<= 5MB) တွေကို hash လုပ်တဲ့အခါ — object-based ဖြစ်တဲ့ `crypto.createHash()` ထက် ပိုမြန်နိုင်ပါတယ်။ Data က ကြီးနိုင်တယ် (သို့) stream လုပ်ခံနေရတယ်ဆိုရင်တော့ — `crypto.createHash()` ကိုပဲ အစားထိုး သုံးဖို့ အကြံပြုပါတယ်။

ဒီ `algorithm` က platform ပေါ်က OpenSSL ရဲ့ version က support လုပ်ထားတဲ့ — ရရှိနိုင်တဲ့ algorithms တွေအပေါ်မှာ မူတည်ပါတယ်။ ဥပမာတွေကတော့ `'sha256'`, `'sha512'` စသဖြင့်ပါ။ မကြာသေးတဲ့ OpenSSL releases တွေမှာ `openssl list -digest-algorithms` က ရရှိနိုင်တဲ့ digest algorithms တွေကို ပြသပေးပါတယ်။

`options` က string တစ်ခုဆိုရင် — ၎င်းက `outputEncoding` ကို သတ်မှတ်ပေးပါတယ်။

ဥပမာ:

```cjs
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Hashing a string and return the result as a hex-encoded string.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Encode a base64-encoded string into a Buffer, hash it and return
// the result as a buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```mjs
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Hashing a string and return the result as a hex-encoded string.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Encode a base64-encoded string into a Buffer, hash it and return
// the result as a buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)`

* `digest` {string} သုံးမယ့် digest algorithm ပါ။
* `ikm` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject} Input keying material ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length (အလျား သုည) ဖြစ်နိုင်ပါတယ်။
* `salt` {string|ArrayBuffer|Buffer|TypedArray|DataView} Salt value ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length ဖြစ်နိုင်ပါတယ်။
* `info` {string|ArrayBuffer|Buffer|TypedArray|DataView} ထပ်ဆောင်း info value ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length ဖြစ်နိုင်သလို — 1024 bytes ထက် မပိုရပါဘူး။
* `keylen` {number} ထုတ်လုပ်ရမယ့် key ရဲ့ အလျားပါ။ 0 ထက် ကြီးရပါမယ်။ ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးက — ရွေးချယ်ထားတဲ့ digest function က ထုတ်လုပ်ပေးတဲ့ bytes အရေအတွက်ရဲ့ `255` ဆပါ (ဥပမာ — `sha512` က 64-byte hashes တွေကို ထုတ်လုပ်ပေးတာမို့ — အများဆုံး HKDF output က 16320 bytes ဖြစ်ပါတယ်)။
* `callback` {Function}
  * `err` {Error}
  * `derivedKey` {ArrayBuffer}

HKDF က RFC 5869 မှာ သတ်မှတ်ထားတဲ့ — ရိုးရှင်းတဲ့ key derivation function (key ဆင်းသက်ခြင်း လုပ်ဆောင်ချက်) တစ်ခုပါ။ ပေးထားတဲ့ `ikm`, `salt` နဲ့ `info` တို့ကို `digest` နဲ့အတူ သုံးပြီး — `keylen` bytes အလျားရှိတဲ့ key တစ်ခုကို ဆင်းသက် (derive) လုပ်ပါတယ်။

ပေးထားတဲ့ `callback` function ကို argument နှစ်ခုနဲ့ ခေါ်ပါတယ်: `err` နဲ့ `derivedKey` ပါ။ Key ကို derive လုပ်နေစဉ်မှာ error တစ်ခု ဖြစ်ခဲ့ရင် — `err` ကို သတ်မှတ်ပေးပြီး — မဟုတ်ရင်တော့ `err` က `null` ဖြစ်ပါလိမ့်မယ်။ အောင်မြင်စွာ ထုတ်လုပ်လိုက်တဲ့ `derivedKey` ကို {ArrayBuffer} တစ်ခုအနေနဲ့ callback ဆီကို ဖြတ်သန်းပေးပါလိမ့်မယ်။ Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ (invalid) တန်ဖိုး (သို့) type တွေကို သတ်မှတ်ပေးထားရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```cjs
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

### `crypto.hkdfSync(digest, ikm, salt, info, keylen)`

* `digest` {string} သုံးမယ့် digest algorithm ပါ။
* `ikm` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject} Input keying material ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length ဖြစ်နိုင်ပါတယ်။
* `salt` {string|ArrayBuffer|Buffer|TypedArray|DataView} Salt value ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length ဖြစ်နိုင်ပါတယ်။
* `info` {string|ArrayBuffer|Buffer|TypedArray|DataView} ထပ်ဆောင်း info value ပါ။ မဖြစ်မနေ ပေးရပြီး — zero-length ဖြစ်နိုင်သလို — 1024 bytes ထက် မပိုရပါဘူး။
* `keylen` {number} ထုတ်လုပ်ရမယ့် key ရဲ့ အလျားပါ။ 0 ထက် ကြီးရပါမယ်။ ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးက — ရွေးချယ်ထားတဲ့ digest function က ထုတ်လုပ်ပေးတဲ့ bytes အရေအတွက်ရဲ့ `255` ဆပါ (ဥပမာ — `sha512` က 64-byte hashes တွေကို ထုတ်လုပ်ပေးတာမို့ — အများဆုံး HKDF output က 16320 bytes ဖြစ်ပါတယ်)။
* Returns: {ArrayBuffer}

RFC 5869 မှာ သတ်မှတ်ထားတဲ့အတိုင်း — synchronous HKDF key derivation function တစ်ခုကို ပေးဆောင်ပါတယ်။ ပေးထားတဲ့ `ikm`, `salt` နဲ့ `info` တို့ကို `digest` နဲ့အတူ သုံးပြီး — `keylen` bytes အလျားရှိတဲ့ key တစ်ခုကို ဆင်းသက် (derive) လုပ်ပါတယ်။

အောင်မြင်စွာ ထုတ်လုပ်လိုက်တဲ့ `derivedKey` ကို {ArrayBuffer} တစ်ခုအနေနဲ့ ပြန်ပေးပါလိမ့်မယ်။

Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ တန်ဖိုး (သို့) type တွေကို သတ်မှတ်ထားရင် — (သို့) derived key ကို မထုတ်လုပ်နိုင်ရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

```mjs
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```cjs
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)`

* `password` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `salt` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `iterations` {number}
* `keylen` {number}
* `digest` {string}
* `callback` {Function}
  * `err` {Error}
  * `derivedKey` {Buffer}

Asynchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation တစ်ခုကို ပေးဆောင်ပါတယ်။ `digest` က သတ်မှတ်ပေးတဲ့ — ရွေးချယ်ထားတဲ့ HMAC digest algorithm တစ်ခုကို အသုံးချပြီး — `password`, `salt` နဲ့ `iterations` တို့ကနေ — တောင်းဆိုထားတဲ့ byte length (`keylen`) ရှိတဲ့ key တစ်ခုကို ဆင်းသက် (derive) လုပ်ပါတယ်။

ပေးထားတဲ့ `callback` function ကို argument နှစ်ခုနဲ့ ခေါ်ပါတယ်: `err` နဲ့ `derivedKey` ပါ။ Key ကို derive လုပ်နေစဉ်မှာ error တစ်ခု ဖြစ်ခဲ့ရင် — `err` ကို သတ်မှတ်ပေးပြီး — မဟုတ်ရင်တော့ `err` က `null` ဖြစ်ပါလိမ့်မယ်။ Default အနေနဲ့ — အောင်မြင်စွာ ထုတ်လုပ်လိုက်တဲ့ `derivedKey` ကို [`Buffer`][] တစ်ခုအနေနဲ့ callback ဆီကို ဖြတ်သန်းပေးပါလိမ့်မယ်။ Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ တန်ဖိုး (သို့) type တွေကို သတ်မှတ်ပေးထားရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`iterations` argument က — တတ်နိုင်သမျှ မြင့်မြင့် သတ်မှတ်ထားတဲ့ ဂဏန်းတစ်ခု ဖြစ်ရပါမယ်။ Iterations အရေအတွက် များလေလေ — derived key က ပိုလုံခြုံလေလေ ဖြစ်ပေမယ့် — ပြီးမြောက်ဖို့ အချိန် ပိုကြာလေလေ ဖြစ်ပါလိမ့်မယ်။

`salt` က တတ်နိုင်သမျှ တစ်မူထူးခြားနေသင့်ပါတယ်။ Salt က random ဖြစ်ပြီး — အနည်းဆုံး 16 bytes အလျား ရှိဖို့ အကြံပြုပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

String တွေကို `password` (သို့) `salt` အဖြစ် ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပါ။

```mjs
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```cjs
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

Support လုပ်ထားတဲ့ digest functions တွေရဲ့ array တစ်ခုကို [`crypto.getHashes()`][] ကို သုံးပြီး ရယူနိုင်ပါတယ်။

ဒီ API က libuv ရဲ့ threadpool ကို သုံးပါတယ် — ၎င်းက application အချို့အတွက် မမျှော်လင့်ထားတဲ့ ဆိုးကျိုး သက်ရောက်မှုတွေ (negative performance implications) ရှိနိုင်ပါတယ်; နောက်ထပ် အချက်အလက်တွေအတွက် [`UV_THREADPOOL_SIZE`][] documentation ကို ကြည့်ပါ။
### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)`

* `password` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `salt` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `iterations` {number}
* `keylen` {number}
* `digest` {string}
* Returns: {Buffer}

PBKDF2 (Password-Based Key Derivation Function 2) ရဲ့ synchronous implementation တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ `digest` နဲ့ သတ်မှတ်ထားတဲ့ HMAC digest algorithm တစ်ခုကို — `password`, `salt` နဲ့ `iterations` တို့ကနေ — တောင်းဆိုထားတဲ့ byte length (`keylen`) ရှိတဲ့ key တစ်ခုကို ဆင်းသက် (derive) စေဖို့ အသုံးချပါတယ်။

Error တစ်ခု ဖြစ်ပွားခဲ့ရင် `Error` တစ်ခုကို throw လုပ်ပြီး — မဟုတ်ရင်တော့ ဆင်းသက်လာတဲ့ key ကို [`Buffer`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

`iterations` argument က ဖြစ်နိုင်သမျှ မြင့်မြင့် သတ်မှတ်ထားတဲ့ ဂဏန်းတစ်ခု ဖြစ်ရပါမယ်။ Iterations အရေအတွက် များလေလေ — ဆင်းသက်လာတဲ့ key က ပိုလုံခြုံလေလေ ဖြစ်ပေမယ့် — ပြီးမြောက်ဖို့ အချိန် ပိုကြာလေလေ ဖြစ်ပါတယ်။

`salt` က ဖြစ်နိုင်သမျှ တစ်မူထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်သင့်ပါတယ်။ Salt က random ဖြစ်ပြီး အနည်းဆုံး 16 bytes ရှည်ဖို့ အကြံပြုထားပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

`password` (သို့) `salt` အတွက် strings တွေ ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပေးပါ။

```mjs
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```cjs
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

ပံ့ပိုးပေးထားတဲ့ digest functions တွေရဲ့ array ကို [`crypto.getHashes()`][] ကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။

### `crypto.privateDecrypt(privateKey, buffer)`

* `privateKey` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey|URL}
  * `oaepHash` {string} OAEP padding အတွက် သုံးမယ့် hash function ဖြစ်ပြီး — `mgf1Hash` ကို သတ်မှတ်မထားရင် — MGF1 အတွက်လည်း သုံးပါတယ်။ **Default:** `'sha1'`
  * `mgf1Hash` {string} OAEP padding ရဲ့ MGF1 mask generation function အတွက် သုံးမယ့် hash function ပါ။ သတ်မှတ်မထားဘူးဆိုရင် `oaepHash` ရဲ့ တန်ဖိုးကို သုံးပါတယ်။ ဒါက OAEP digest နဲ့ MGF1 digest ကွဲပြားနိုင်စေပါတယ်။
  * `oaepLabel` {string|ArrayBuffer|Buffer|TypedArray|DataView} OAEP padding အတွက် သုံးမယ့် label ပါ။ သတ်မှတ်မထားရင် label ကို မသုံးပါဘူး။
  * `padding` {crypto.constants} `crypto.constants` ထဲမှာ define လုပ်ထားတဲ့ optional padding တန်ဖိုးတစ်ခု ဖြစ်ပြီး — အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်: `crypto.constants.RSA_NO_PADDING`,
    `crypto.constants.RSA_PKCS1_PADDING`, (သို့)
    `crypto.constants.RSA_PKCS1_OAEP_PADDING`။
* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* Returns: {Buffer} Decrypt လုပ်ပြီးသား content ပါဝင်တဲ့ `Buffer` အသစ်တစ်ခုပါ။

`buffer` ကို `privateKey` နဲ့ decrypt လုပ်ပါတယ်။ `buffer` ကို အရင်က သက်ဆိုင်ရာ public key နဲ့ encrypt လုပ်ထားတာပါ — ဥပမာ [`crypto.publicEncrypt()`][] ကို သုံးပြီး လုပ်ထားတာမျိုးပါ။

`privateKey` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `privateKey` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ Object တစ်ခု ဖြစ်နေရင် `padding` property ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ မဟုတ်ရင်တော့ ဒီ function က `RSA_PKCS1_OAEP_PADDING` ကို သုံးပါတယ်။

[`crypto.privateDecrypt()`][] မှာ `crypto.constants.RSA_PKCS1_PADDING` ကို သုံးဖို့ဆိုရင် — OpenSSL က implicit rejection (`rsa_pkcs1_implicit_rejection`) ကို support လုပ်ဖို့ လိုအပ်ပါတယ်။ Node.js က သုံးနေတဲ့ OpenSSL version က ဒီ feature ကို support မလုပ်ဘူးဆိုရင် — `RSA_PKCS1_PADDING` ကို သုံးဖို့ ကြိုးစားတာက မအောင်မြင်ပါဘူး။

### `crypto.privateEncrypt(privateKey, buffer)`

* `privateKey` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey|URL}
  * `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey|URL}
    Private key material, {KeyObject} (သို့) OpenSSL STORE loader အတွက် object တစ်ခုကို ရည်ညွှန်းတဲ့ {URL} တစ်ခု ဖြစ်ပါတယ်။
  * `passphrase` {string|ArrayBuffer|Buffer|TypedArray|DataView} Private key အတွက် optional passphrase (လျှို့ဝှက် စကားစု) တစ်ခုပါ။
  * `padding` {crypto.constants} `crypto.constants` ထဲမှာ define လုပ်ထားတဲ့ optional padding တန်ဖိုးတစ်ခု ဖြစ်ပြီး — အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်: `crypto.constants.RSA_NO_PADDING` (သို့)
    `crypto.constants.RSA_PKCS1_PADDING`။
  * `encoding` {string} `buffer`, `key`, (သို့) `passphrase` တွေ strings တွေ ဖြစ်နေတဲ့အခါ သုံးမယ့် string encoding ပါ။
* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* Returns: {Buffer} Encrypt လုပ်ပြီးသား content ပါဝင်တဲ့ `Buffer` အသစ်တစ်ခုပါ။

`buffer` ကို `privateKey` နဲ့ encrypt လုပ်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ data ကို သက်ဆိုင်ရာ public key နဲ့ decrypt လုပ်နိုင်ပါတယ် — ဥပမာ [`crypto.publicDecrypt()`][] ကို သုံးပြီး။

`privateKey` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `privateKey` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ Object တစ်ခု ဖြစ်နေရင် `padding` property ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ မဟုတ်ရင်တော့ ဒီ function က `RSA_PKCS1_PADDING` ကို သုံးပါတယ်။

### `crypto.publicDecrypt(key, buffer)`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
  * `passphrase` {string|ArrayBuffer|Buffer|TypedArray|DataView} Private key အတွက် optional passphrase (လျှို့ဝှက် စကားစု) တစ်ခုပါ။
  * `padding` {crypto.constants} `crypto.constants` ထဲမှာ define လုပ်ထားတဲ့ optional padding တန်ဖိုးတစ်ခု ဖြစ်ပြီး — အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်: `crypto.constants.RSA_NO_PADDING` (သို့)
    `crypto.constants.RSA_PKCS1_PADDING`။
  * `encoding` {string} `buffer`, `key`, (သို့) `passphrase` တွေ strings တွေ ဖြစ်နေတဲ့အခါ သုံးမယ့် string encoding ပါ။
* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* Returns: {Buffer} Decrypt လုပ်ပြီးသား content ပါဝင်တဲ့ `Buffer` အသစ်တစ်ခုပါ။

`buffer` ကို `key` နဲ့ decrypt လုပ်ပါတယ်။ `buffer` ကို အရင်က သက်ဆိုင်ရာ private key နဲ့ encrypt လုပ်ထားတာပါ — ဥပမာ [`crypto.privateEncrypt()`][] ကို သုံးပြီး လုပ်ထားတာမျိုးပါ။

`key` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ Object တစ်ခု ဖြစ်နေရင် `padding` property ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ မဟုတ်ရင်တော့ ဒီ function က `RSA_PKCS1_PADDING` ကို သုံးပါတယ်။

RSA public keys တွေက private keys တွေကနေ ဆင်းသက် ရယူနိုင်တာမို့ — public key အစား private key တစ်ခုကိုလည်း ဖြတ်သန်းပေးနိုင်ပါတယ်။

### `crypto.publicEncrypt(key, buffer)`

* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
  * `key` {string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
    PEM နဲ့ encode လုပ်ထားတဲ့ public (သို့) private key တစ်ခု, {KeyObject} တစ်ခု (သို့) {CryptoKey} တစ်ခု ဖြစ်ပါတယ်။
  * `oaepHash` {string} OAEP padding အတွက် သုံးမယ့် hash function ဖြစ်ပြီး — `mgf1Hash` ကို သတ်မှတ်မထားရင် — MGF1 အတွက်လည်း သုံးပါတယ်။ **Default:** `'sha1'`
  * `mgf1Hash` {string} OAEP padding ရဲ့ MGF1 mask generation function အတွက် သုံးမယ့် hash function ပါ။ သတ်မှတ်မထားဘူးဆိုရင် `oaepHash` ရဲ့ တန်ဖိုးကို သုံးပါတယ်။ ဒါက OAEP digest နဲ့ MGF1 digest ကွဲပြားနိုင်စေပါတယ်။
  * `oaepLabel` {string|ArrayBuffer|Buffer|TypedArray|DataView} OAEP padding အတွက် သုံးမယ့် label ပါ။ သတ်မှတ်မထားရင် label ကို မသုံးပါဘူး။
  * `passphrase` {string|ArrayBuffer|Buffer|TypedArray|DataView} Private key အတွက် optional passphrase (လျှို့ဝှက် စကားစု) တစ်ခုပါ။
  * `padding` {crypto.constants} `crypto.constants` ထဲမှာ define လုပ်ထားတဲ့ optional padding တန်ဖိုးတစ်ခု ဖြစ်ပြီး — အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်: `crypto.constants.RSA_NO_PADDING`,
    `crypto.constants.RSA_PKCS1_PADDING`, (သို့)
    `crypto.constants.RSA_PKCS1_OAEP_PADDING`။
  * `encoding` {string} `buffer`, `key`, `oaepLabel`, (သို့) `passphrase` တွေ strings တွေ ဖြစ်နေတဲ့အခါ သုံးမယ့် string encoding ပါ။
* `buffer` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* Returns: {Buffer} Encrypt လုပ်ပြီးသား content ပါဝင်တဲ့ `Buffer` အသစ်တစ်ခုပါ။

`buffer` ရဲ့ content ကို `key` နဲ့ encrypt လုပ်ပြီး — encrypt လုပ်ထားတဲ့ content ပါဝင်တဲ့ [`Buffer`][] အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးလိုက်တဲ့ data ကို သက်ဆိုင်ရာ private key နဲ့ decrypt လုပ်နိုင်ပါတယ် — ဥပမာ [`crypto.privateDecrypt()`][] ကို သုံးပြီး။

`key` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ Object တစ်ခု ဖြစ်နေရင် `padding` property ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။ မဟုတ်ရင်တော့ ဒီ function က `RSA_PKCS1_OAEP_PADDING` ကို သုံးပါတယ်။

RSA public keys တွေက private keys တွေကနေ ဆင်းသက် ရယူနိုင်တာမို့ — public key အစား private key တစ်ခုကိုလည်း ဖြတ်သန်းပေးနိုင်ပါတယ်။

### `crypto.randomBytes(size[, callback])`

* `size` {number} ထုတ်လုပ်ရမယ့် bytes အရေအတွက်ပါ။ `size` က
  `2**31 - 1` ထက် ကြီးလို့ မရပါဘူး။
* `callback` {Function}
  * `err` {Error}
  * `buf` {Buffer}
* Returns: {Buffer} `callback` function ကို မပေးထားဘူးဆိုရင် ဖြစ်ပါတယ်။

Cryptographically အားကောင်းတဲ့ pseudorandom data တွေကို ထုတ်လုပ်ပေးပါတယ်။ `size` argument က ထုတ်လုပ်ရမယ့် bytes အရေအတွက်ကို ဖော်ပြတဲ့ ဂဏန်းတစ်ခုပါ။

`callback` function တစ်ခု ပေးထားရင် — bytes တွေကို asynchronously ထုတ်လုပ်ပြီး — `callback` function ကို argument နှစ်ခု — `err` နဲ့ `buf` — နဲ့ ခေါ်ယူပါတယ်။ Error တစ်ခု ဖြစ်ပွားခဲ့ရင် `err` က `Error` object တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင် `null` ပါ။ `buf` argument က ထုတ်လုပ်ထားတဲ့ bytes တွေ ပါဝင်တဲ့ [`Buffer`][] တစ်ခုပါ။

```mjs
// Asynchronous
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

```cjs
// Asynchronous
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

`callback` function ကို မပေးထားဘူးဆိုရင် — random bytes တွေကို synchronously ထုတ်လုပ်ပြီး [`Buffer`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Bytes တွေ ထုတ်လုပ်ရာမှာ ပြဿနာ တစ်ခုခု ရှိခဲ့ရင် error တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
// Synchronous
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

```cjs
// Synchronous
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

`crypto.randomBytes()` method က — လုံလောက်တဲ့ entropy (ကျပန်းမှု ရင်းမြစ်) ရရှိနိုင်သည်အထိ — ပြီးမြောက်မှာ မဟုတ်ပါဘူး။ ပုံမှန်အားဖြင့် ဒါက millisecond အနည်းငယ်ထက် ပိုကြာလေ့ မရှိပါဘူး။ Random bytes တွေ ထုတ်လုပ်တာက အချိန် ပိုကြာအောင် block ဖြစ်နိုင်တဲ့ တစ်ခုတည်းသော အချိန်က — system တစ်ခုလုံးမှာ entropy နည်းနေတုန်းဖြစ်တဲ့ — boot တက်ပြီး ချက်ချင်း အချိန်ပါ။

ဒီ API က libuv ရဲ့ threadpool ကို သုံးပါတယ် — ၎င်းက application အချို့အတွက် မမျှော်လင့်ထားတဲ့ ဆိုးကျိုး သက်ရောက်မှုတွေ ရှိနိုင်ပါတယ်; နောက်ထပ် အချက်အလက်တွေအတွက် [`UV_THREADPOOL_SIZE`][] documentation ကို ကြည့်ပါ။

`crypto.randomBytes()` ရဲ့ asynchronous version ကို threadpool request တစ်ခုတည်းနဲ့ လုပ်ဆောင်ပါတယ်။ Threadpool task တွေရဲ့ ကြာချိန် ကွဲပြားမှုကို နည်းအောင် လုပ်ဖို့ — client request တစ်ခုကို ဖြည့်ဆည်းတဲ့ အစိတ်အပိုင်းအနေနဲ့ လုပ်တဲ့အခါ — ကြီးမားတဲ့ `randomBytes` requests တွေကို ခွဲခြမ်းပေးပါ။

### `crypto.randomFill(buffer[, offset][, size], callback)`

* `buffer` {ArrayBuffer|Buffer|TypedArray|DataView} ပေးပို့ရန် လိုအပ်ပါတယ်။ ပေးထားတဲ့ `buffer` ရဲ့ အရွယ်အစားက
  `2**31 - 1` ထက် ကြီးလို့ မရပါဘူး။
* `offset` {number} စတင်မယ့် နေရာ (position) ပါ — `TypedArray` တစ်ခုအတွက် elements နဲ့ ဖြစ်ပြီး — `ArrayBuffer` (သို့) `DataView` တစ်ခုအတွက်တော့ bytes နဲ့ ဖြစ်ပါတယ်။ **Default:** `0`
* `size` {number} `offset` နဲ့ တူညီတဲ့ ယူနစ်တွေနဲ့ ဖြည့်ရမယ့် ပမာဏပါ။
  **Default:** `TypedArray` တစ်ခုအတွက် `buffer.length - offset` ဖြစ်ပြီး — `ArrayBuffer` (သို့) `DataView` တစ်ခုအတွက်တော့
  `buffer.byteLength - offset` ဖြစ်ပါတယ်။ `size`
  က `2**31 - 1` ထက် ကြီးလို့ မရပါဘူး။
* `callback` {Function} `function(err, buf) {}`.

ဒီ function က [`crypto.randomBytes()`][] နဲ့ ဆင်တူပေမယ့် — ပထမဆုံး argument က ဖြည့်သွင်းခံရမယ့် [`Buffer`][] တစ်ခု ဖြစ်ဖို့ လိုအပ်ပါတယ်။ Callback တစ်ခု ဖြတ်သန်းပေးဖို့လည်း လိုအပ်ပါတယ်။

`callback` function ကို မပေးထားဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```cjs
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

ဘယ် `ArrayBuffer`, `TypedArray` (သို့) `DataView` instance မဆို — `buffer` အဖြစ် ဖြတ်သန်းပေးနိုင်ပါတယ်။

ဒီထဲမှာ `Float32Array` နဲ့ `Float64Array` instances တွေလည်း ပါဝင်ပေမယ့် — ဒီ function ကို random floating-point numbers (ကျပန်း ဒသမကိန်းများ) ထုတ်လုပ်ဖို့တော့ မသုံးသင့်ပါဘူး။ ရလဒ်ထဲမှာ `+Infinity`, `-Infinity` နဲ့ `NaN` တွေ ပါဝင်နိုင်ပြီး — array ထဲမှာ finite numbers တွေပဲ ပါနေရင်တောင် — ၎င်းတို့က uniform random distribution (တူညီသော ကျပန်း ဖြန့်ဖြူးမှု) တစ်ခုကနေ ဆွဲယူထားတာ မဟုတ်ပဲ — အဓိပ္ပာယ်ရှိတဲ့ အနိမ့်ဆုံး (သို့) အမြင့်ဆုံး ကန့်သတ်ချက်တွေလည်း မရှိပါဘူး။

```mjs
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```cjs
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

ဒီ API က libuv ရဲ့ threadpool ကို သုံးပါတယ် — ၎င်းက application အချို့အတွက် မမျှော်လင့်ထားတဲ့ ဆိုးကျိုး သက်ရောက်မှုတွေ ရှိနိုင်ပါတယ်; နောက်ထပ် အချက်အလက်တွေအတွက် [`UV_THREADPOOL_SIZE`][] documentation ကို ကြည့်ပါ။

`crypto.randomFill()` ရဲ့ asynchronous version ကို threadpool request တစ်ခုတည်းနဲ့ လုပ်ဆောင်ပါတယ်။ Threadpool task တွေရဲ့ ကြာချိန် ကွဲပြားမှုကို နည်းအောင် လုပ်ဖို့ — client request တစ်ခုကို ဖြည့်ဆည်းတဲ့ အစိတ်အပိုင်းအနေနဲ့ လုပ်တဲ့အခါ — ကြီးမားတဲ့ `randomFill` requests တွေကို ခွဲခြမ်းပေးပါ။

### `crypto.randomFillSync(buffer[, offset][, size])`

* `buffer` {ArrayBuffer|Buffer|TypedArray|DataView} ပေးပို့ရန် လိုအပ်ပါတယ်။ ပေးထားတဲ့ `buffer` ရဲ့ အရွယ်အစားက
  `2**31 - 1` ထက် ကြီးလို့ မရပါဘူး။
* `offset` {number} စတင်မယ့် နေရာ (position) ပါ — `TypedArray` တစ်ခုအတွက် elements နဲ့ ဖြစ်ပြီး — `ArrayBuffer` (သို့) `DataView` တစ်ခုအတွက်တော့ bytes နဲ့ ဖြစ်ပါတယ်။ **Default:** `0`
* `size` {number} `offset` နဲ့ တူညီတဲ့ ယူနစ်တွေနဲ့ ဖြည့်ရမယ့် ပမာဏပါ။
  **Default:** `TypedArray` တစ်ခုအတွက် `buffer.length - offset` ဖြစ်ပြီး — `ArrayBuffer` (သို့) `DataView` တစ်ခုအတွက်တော့
  `buffer.byteLength - offset` ဖြစ်ပါတယ်။ `size`
  က `2**31 - 1` ထက် ကြီးလို့ မရပါဘူး။
* Returns: {ArrayBuffer|Buffer|TypedArray|DataView} `buffer` argument အဖြစ် ဖြတ်သန်းပေးလိုက်တဲ့ object ကိုပဲ ပြန်ပေးပါတယ်။

[`crypto.randomFill()`][] ရဲ့ synchronous version ပါ။

```mjs
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```cjs
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

ဘယ် `ArrayBuffer`, `TypedArray` (သို့) `DataView` instance မဆို — `buffer` အဖြစ် ဖြတ်သန်းပေးနိုင်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```cjs
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

### `crypto.randomInt([min, ]max[, callback])`

* `min` {integer} Random range (ကျပန်း အကွာအဝေး) ရဲ့ အစ (inclusive — အပါအဝင်) ပါ။ **Default:** `0`။
* `max` {integer} Random range ရဲ့ အဆုံး (exclusive — မပါဝင်) ပါ။
* `callback` {Function} `function(err, n) {}`။

`min <= n < max` ဖြစ်မယ့် random integer `n` တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ implementation က [modulo bias][] ကို ရှောင်ရှားပါတယ်။

Range (`max - min`) က 248 ထက် ငယ်ရပါမယ်။ `min` နဲ့ `max` တို့က [safe integers][] တွေ ဖြစ်ရပါမယ်။

`callback` function ကို မပေးထားဘူးဆိုရင် — random integer ကို synchronously ထုတ်လုပ်ပါတယ်။

```mjs
// Asynchronous
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```

```cjs
// Asynchronous
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Random number chosen from (0, 1, 2): ${n}`);
});
```

```mjs
// Synchronous
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```

```cjs
// Synchronous
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Random number chosen from (0, 1, 2): ${n}`);
```

```mjs
// With `min` argument
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```

```cjs
// With `min` argument
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`The dice rolled: ${n}`);
```

### `crypto.randomUUID([options])`

* `options` {Object}
  * `disableEntropyCache` {boolean} Default အနေနဲ့ — performance တိုးတက်စေဖို့ — Node.js က random UUIDs 128 ခုအထိ ထုတ်လုပ်နိုင်လောက်တဲ့ random data လုံလောက်စွာကို ထုတ်လုပ်ပြီး cache (ကြားခံ သိမ်းဆည်း) လုပ်ထားပါတယ်။ Cache ကို မသုံးပဲ UUID တစ်ခု ထုတ်လုပ်ချင်ရင် `disableEntropyCache` ကို `true` အဖြစ် သတ်မှတ်ပါ။
    **Default:** `false`။
* Returns: {string}

Random [RFC 4122][] version 4 UUID တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ UUID ကို cryptographic pseudorandom number generator (လျှို့ဝှက်ရေး ကျပန်းဂဏန်း ထုတ်လုပ်စက်) တစ်ခုကို သုံးပြီး ထုတ်လုပ်ပါတယ်။

### `crypto.randomUUIDv7([options])`

* `options` {Object}
  * `disableEntropyCache` {boolean} Default အနေနဲ့ — performance တိုးတက်စေဖို့ — Node.js က random UUIDs 128 ခုအထိ ထုတ်လုပ်နိုင်လောက်တဲ့ random data လုံလောက်စွာကို ထုတ်လုပ်ပြီး cache (ကြားခံ သိမ်းဆည်း) လုပ်ထားပါတယ်။ Cache ကို မသုံးပဲ UUID တစ်ခု ထုတ်လုပ်ချင်ရင် `disableEntropyCache` ကို `true` အဖြစ် သတ်မှတ်ပါ။
    **Default:** `false`။
* Returns: {string}

Random [RFC 9562][] version 7 UUID တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ UUID ထဲမှာ — အထင်ရှားဆုံး (most significant) bits 48 အတွင်းမှာ — millisecond တိကျမှု ရှိတဲ့ Unix timestamp ပါဝင်ပြီး — ကျန်နေတဲ့ fields တွေအတွက်တော့ cryptographically လုံခြုံတဲ့ random bits တွေ ပါဝင်ပါတယ် — ဒါကြောင့် time-based sorting (အချိန်အလိုက် စီစဉ်ခြင်း) နဲ့ database key တစ်ခုအနေနဲ့ သုံးရန် သင့်လျော်ပါတယ်။ မြှုပ်နှံထားတဲ့ timestamp က monotonic မဟုတ်တဲ့ clock တစ်ခုကို မှီခိုပြီး — တင်းကြပ်စွာ တိုးတက်နေမယ်လို့ (strictly increasing) အာမခံချက် မရှိပါဘူး။

### `crypto.scrypt(password, salt, keylen[, options], callback)`

* `password` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `salt` {string|ArrayBuffer|Buffer|TypedArray|DataView}
* `keylen` {number}
* `options` {Object}
  * `cost` {number} CPU/memory cost parameter ပါ။ တစ်ထက် ကြီးတဲ့ 2 ၏ ထပ်ကိန်း (power of two) တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `16384`။
  * `blockSize` {number} Block size parameter ပါ။ **Default:** `8`။
  * `parallelization` {number} Parallelization parameter ပါ။ **Default:** `1`။
  * `N` {number} `cost` အတွက် alias (အမည်ပြောင်း) ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `r` {number} `blockSize` အတွက် alias ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `p` {number} `parallelization` အတွက် alias ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `maxmem` {number} Memory ရဲ့ အထက် ကန့်သတ်ချက်ပါ။ (အကြမ်းဖျင်း) `128 * N * r > maxmem` ဖြစ်တဲ့အခါ error တစ်ခု ဖြစ်ပါတယ်။ **Default:** `32 * 1024 * 1024`။
* `callback` {Function}
  * `err` {Error}
  * `derivedKey` {Buffer}

[scrypt][] ရဲ့ asynchronous implementation တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ Scrypt က password-based key derivation function တစ်ခု ဖြစ်ပြီး — brute-force attacks (အင်အားသုံး စမ်းမှု တိုက်ခိုက်မှုများ) ကို အကျိုးမထွက်အောင် — တွက်ချက်မှုပိုင်းရော memory ပိုင်းပါ ကုန်ကျစရိတ် ကြီးမြင့်အောင် ဒီဇိုင်းထုတ်ထားပါတယ်။

`salt` က ဖြစ်နိုင်သမျှ တစ်မူထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်သင့်ပါတယ်။ Salt က random ဖြစ်ပြီး အနည်းဆုံး 16 bytes ရှည်ဖို့ အကြံပြုထားပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

`password` (သို့) `salt` အတွက် strings တွေ ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပေးပါ။

`callback` function ကို argument နှစ်ခု — `err` နဲ့ `derivedKey` — နဲ့ ခေါ်ယူပါတယ်။ Key derivation မအောင်မြင်ခဲ့ရင် `err` က exception object တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင် `err` က `null` ပါ။ `derivedKey` ကို callback ဆီကို [`Buffer`][] တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါတယ်။

Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ (invalid) တန်ဖိုး (သို့) အမျိုးအစား တစ်ခုခုကို သတ်မှတ်ပေးထားရင် exception တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
const {
  scrypt,
} = await import('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```cjs
const {
  scrypt,
} = require('node:crypto');

// Using the factory defaults.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Using a custom N parameter. Must be a power of two.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

### `crypto.scryptSync(password, salt, keylen[, options])`

* `password` {string|Buffer|TypedArray|DataView}
* `salt` {string|Buffer|TypedArray|DataView}
* `keylen` {number}
* `options` {Object}
  * `cost` {number} CPU/memory cost parameter ပါ။ တစ်ထက် ကြီးတဲ့ 2 ၏ ထပ်ကိန်း (power of two) တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `16384`။
  * `blockSize` {number} Block size parameter ပါ။ **Default:** `8`။
  * `parallelization` {number} Parallelization parameter ပါ။ **Default:** `1`။
  * `N` {number} `cost` အတွက် alias (အမည်ပြောင်း) ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `r` {number} `blockSize` အတွက် alias ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `p` {number} `parallelization` အတွက် alias ပါ။ နှစ်ခုထဲက တစ်ခုကိုသာ သတ်မှတ်နိုင်ပါတယ်။
  * `maxmem` {number} Memory ရဲ့ အထက် ကန့်သတ်ချက်ပါ။ (အကြမ်းဖျင်း) `128 * N * r > maxmem` ဖြစ်တဲ့အခါ error တစ်ခု ဖြစ်ပါတယ်။ **Default:** `32 * 1024 * 1024`။
* Returns: {Buffer}

[scrypt][] ရဲ့ synchronous implementation တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ Scrypt က password-based key derivation function တစ်ခု ဖြစ်ပြီး — brute-force attacks (အင်အားသုံး စမ်းမှု တိုက်ခိုက်မှုများ) ကို အကျိုးမထွက်အောင် — တွက်ချက်မှုပိုင်းရော memory ပိုင်းပါ ကုန်ကျစရိတ် ကြီးမြင့်အောင် ဒီဇိုင်းထုတ်ထားပါတယ်။

`salt` က ဖြစ်နိုင်သမျှ တစ်မူထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်သင့်ပါတယ်။ Salt က random ဖြစ်ပြီး အနည်းဆုံး 16 bytes ရှည်ဖို့ အကြံပြုထားပါတယ်။ အသေးစိတ်အတွက် [NIST SP 800-132][] ကို ကြည့်ပါ။

`password` (သို့) `salt` အတွက် strings တွေ ဖြတ်သန်းပေးတဲ့အခါ — [caveats when using strings as inputs to cryptographic APIs][] ကို ထည့်သွင်း စဉ်းစားပေးပါ။

Key derivation မအောင်မြင်ခဲ့ရင် exception တစ်ခုကို throw လုပ်ပြီး — မဟုတ်ရင်တော့ ဆင်းသက်လာတဲ့ key ကို [`Buffer`][] တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Input arguments တွေထဲက တစ်ခုခုက တရားဝင်မဟုတ်တဲ့ (invalid) တန်ဖိုး (သို့) အမျိုးအစား တစ်ခုခုကို သတ်မှတ်ပေးထားရင် exception တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
const {
  scryptSync,
} = await import('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```cjs
const {
  scryptSync,
} = require('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

### `crypto.secureHeapUsed()`

* Returns: {Object}
  * `total` {number} `--secure-heap=n` command-line flag နဲ့ သတ်မှတ်ထားတဲ့အတိုင်း — စုစုပေါင်း ခွဲဝေသုံးစွဲထားတဲ့ (allocated) secure heap အရွယ်အစားပါ။
  * `min` {number} `--secure-heap-min` command-line flag နဲ့ သတ်မှတ်ထားတဲ့အတိုင်း — secure heap ကနေ အနည်းဆုံး ခွဲဝေသုံးစွဲမှု ပမာဏပါ။
  * `used` {number} လက်ရှိ secure heap ကနေ ခွဲဝေသုံးစွဲထားတဲ့ စုစုပေါင်း bytes အရေအတွက်ပါ။
  * `utilization` {number} ခွဲဝေသုံးစွဲထားတဲ့ bytes တွေထဲမှာ `used` နဲ့ `total` ရဲ့ တွက်ချက်ထားတဲ့ အချိုး (ratio) ပါ။

### `crypto.setEngine(engine[, flags])`

* `engine` {string}
* `flags` {crypto.constants} **Default:** `crypto.constants.ENGINE_METHOD_ALL`

OpenSSL functions တစ်ချို့ (သို့) အားလုံးအတွက် (flags တွေနဲ့ ရွေးချယ်ထားတဲ့) `engine` ကို load လုပ်ပြီး သတ်မှတ်ပေးပါတယ်။ OpenSSL မှာ custom engines တွေအတွက် ပံ့ပိုးမှုက OpenSSL 3 ကစပြီး deprecated (ခေတ်ရပ်စဲ) ဖြစ်ပါတယ်။

`engine` က id တစ်ခု သို့မဟုတ် engine ရဲ့ shared library ဆီကို ညွှန်တဲ့ path တစ်ခု ဖြစ်နိုင်ပါတယ်။

Optional ဖြစ်တဲ့ `flags` argument က default အနေနဲ့ `ENGINE_METHOD_ALL` ကို သုံးပါတယ်။ `flags` က bit field တစ်ခု ဖြစ်ပြီး — အောက်ပါ flags တွေထဲက တစ်ခု (သို့) ရောစပ်ထားတဲ့ အစုကို လက်ခံပါတယ် (`crypto.constants` ထဲမှာ define လုပ်ထားပါတယ်):

* `crypto.constants.ENGINE_METHOD_RSA`
* `crypto.constants.ENGINE_METHOD_DSA`
* `crypto.constants.ENGINE_METHOD_DH`
* `crypto.constants.ENGINE_METHOD_RAND`
* `crypto.constants.ENGINE_METHOD_EC`
* `crypto.constants.ENGINE_METHOD_CIPHERS`
* `crypto.constants.ENGINE_METHOD_DIGESTS`
* `crypto.constants.ENGINE_METHOD_PKEY_METHS`
* `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
* `crypto.constants.ENGINE_METHOD_ALL`
* `crypto.constants.ENGINE_METHOD_NONE`

### `crypto.setFips(bool)`

* `bool` {boolean} FIPS mode ကို ဖွင့်ဖို့ `true` ၊ ပိတ်ဖို့ `false` ဖြစ်ပါတယ်။

[FIPS mode][] ကို ပြောင်းလဲပေးပါတယ်။ OpenSSL 3 နဲ့ဆိုရင် — ဒါက default property query ထဲမှာ `fips=yes` ကို ထည့်တာ (သို့) ဖယ်ရှားတာကိုသာ လုပ်ပါတယ်။ FIPS provider တစ်ခုကို install လုပ်ခြင်း၊ load လုပ်ခြင်း၊ initialize လုပ်ခြင်း (သို့) validate လုပ်ခြင်းတွေကိုတော့ မလုပ်ပါဘူး။ အသုံးပြုလို့ရတဲ့ FIPS configuration တစ်ခု ရဖို့ဆိုရင် — provider ကို install လုပ်ပြီး — [FIPS mode][] မှာ ဖော်ပြထားတဲ့အတိုင်း — Node.js စတင်တဲ့အခါ ၎င်းကို load လုပ်ဖို့ OpenSSL ကို configure လုပ်ပါ။

Load လုပ်ထားတဲ့ provider တစ်ခုမှ — `fips=yes` နဲ့ ကိုက်ညီတဲ့ တောင်းဆိုထားတဲ့ cryptographic implementation တစ်ခုကို ပံ့ပိုးမပေးဘူးဆိုရင် — call က အောင်မြင်နေနိုင်ပြီး `crypto.getFips()` က `1` ကို ပြန်ပေးနိုင်သေးပေမယ့် — အဲဒီ implementation ကို ရယူဖို့ ကြိုးစားတာကတော့ မအောင်မြင်ပါဘူး။ သက်ရောက်မှု ရှိတဲ့ `node:crypto` operations တွေက ပုံမှန်အားဖြင့် `ERR_OSSL_EVP_UNSUPPORTED` နဲ့ မအောင်မြင်ပါဘူး။ အရင်က ရယူထားပြီးသား implementations (သို့) initialize လုပ်ပြီးသား operation contexts တွေကို သုံးတဲ့ operations တွေ အပါအဝင် — ရယူမှုအသစ် (new fetch) မလိုအပ်တဲ့ operations တွေကတော့ အောင်မြင်နေနိုင်ပါသေးတယ်။ ဒီ method ကို application code က တခြား OpenSSL-backed APIs တွေ မသုံးခင် — application initialization ကာလအတွင်းမှာ ခေါ်ပါ။

ဒီ method က နောက်ပိုင်း algorithm fetches တွေကိုသာ သက်ရောက်မှု ရှိပါတယ်။ Node.js က application code မလည်ပတ်ခင် OpenSSL state အချို့ကို initialize လုပ်ပါတယ်။ Property query က process စတင်ချိန်ကတည်းက active ဖြစ်နေဖို့ လိုအပ်တဲ့အခါ — OpenSSL configuration ထဲမှာ `default_properties = fips=yes` ကို သတ်မှတ်ပါ (သို့) [`--enable-fips`][] (သို့) [`--force-fips`][] ကို သုံးပါ။ Command-line flags တွေက — `fips` လို့ အမည်ရတဲ့ configured provider တစ်ခု က ၎င်းရဲ့ self-test ကို initialize လုပ်ပြီး အောင်မြင်ဖို့ကိုပါ ထပ်ဆောင်း လိုအပ်ပါတယ်; မဟုတ်ရင် Node.js က စတင်ဖို့ မအောင်မြင်ပါဘူး။

OpenSSL က state ကို မပြောင်းလဲနိုင်ဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါတယ်။ Node.js ကို `--force-fips` နဲ့ စတင်ထားတဲ့အခါ FIPS mode ကို disable လုပ်လို့ မရပါဘူး။ OpenSSL 1.1.1 နဲ့ဆိုရင် — FIPS mode ကို ဖွင့်ဖို့ FIPS-capable OpenSSL build တစ်ခု လိုအပ်ပါတယ်။

### `crypto.sign(algorithm, data, key[, callback])`

* `algorithm` {string | null | undefined}
* `data` {ArrayBuffer|Buffer|SharedArrayBuffer|TypedArray|DataView|string}
* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey|URL}
* `callback` {Function}
  * `err` {Error}
  * `signature` {Buffer}
* Returns: {Buffer} `callback` function ကို မပေးထားဘူးဆိုရင် ဖြစ်ပါတယ်။

ပေးထားတဲ့ private key နဲ့ algorithm ကို သုံးပြီး `data` အတွက် signature (လက်မှတ်) ကို တွက်ချက်ပြီး ပြန်ပေးပါတယ်။ `algorithm` က `null` (သို့) `undefined` ဖြစ်နေရင် — algorithm က key ရဲ့ အမျိုးအစားပေါ်မှာ မူတည်ပါတယ်။

Ed25519, Ed448 နဲ့ ML-DSA တို့အတွက် `algorithm` က `null` (သို့) `undefined` ဖြစ်ရန် လိုအပ်ပါတယ်။

`key` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ `key` က string, `ArrayBuffer`, [`Buffer`][], `TypedArray` (သို့) `DataView` ဖြစ်နေတဲ့အခါ — ၎င်းထဲမှာ PEM နဲ့ encode လုပ်ထားတဲ့ key material တွေ ပါဝင်ရပါမယ်။ Object တစ်ခု ဖြစ်နေရင် — အောက်ပါ ထပ်ဆောင်း properties တွေကို ဖြတ်သန်းပေးနိုင်ပါတယ်:

* `dsaEncoding` {string} DSA နဲ့ ECDSA တို့အတွက် — ဒီ option က ထုတ်လုပ်လိုက်တဲ့ signature ရဲ့
  ပုံစံ (format) ကို သတ်မှတ်ပေးပါတယ်။ ၎င်းက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
  * `'der'` (default): DER နဲ့ encode လုပ်ထားတဲ့ ASN.1 signature structure ဖြစ်ပြီး `(r, s)` ကို encode လုပ်ပါတယ်။
  * `'ieee-p1363'`: IEEE-P1363 မှာ အဆိုပြုထားတဲ့အတိုင်း `r || s` ဆိုတဲ့ signature format ပါ။
* `padding` {integer} RSA အတွက် optional padding တန်ဖိုးပါ — အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

  * `crypto.constants.RSA_PKCS1_PADDING` (default)
  * `crypto.constants.RSA_PKCS1_PSS_PADDING`

  `RSA_PKCS1_PSS_PADDING` က — message ကို sign လုပ်ဖို့ သုံးခဲ့တဲ့ hash function နဲ့ တူညီတဲ့ hash function ကို သုံးတဲ့ MGF1 ကို သုံးပါလိမ့်မယ် — [RFC 4055][] ရဲ့ section 3.1 မှာ သတ်မှတ်ထားတဲ့အတိုင်းပါ။
* `saltLength` {integer} Padding က `RSA_PKCS1_PSS_PADDING` ဖြစ်တဲ့အခါ အတွက် salt length ပါ။
  အထူးတန်ဖိုး `crypto.constants.RSA_PSS_SALTLEN_DIGEST` က salt length ကို digest ရဲ့ အရွယ်အစားနဲ့ ညီအောင် သတ်မှတ်ပြီး — `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (default) ကတော့ ၎င်းကို ခွင့်ပြုထားတဲ့
  အများဆုံး တန်ဖိုးအဖြစ် သတ်မှတ်ပါတယ်။
* `context` {ArrayBuffer|Buffer|TypedArray|DataView} Ed25519[^openssl32] ([RFC 8032][] က Ed25519ctx ကို သုံးတဲ့), Ed448, ML-DSA နဲ့ SLH-DSA တို့အတွက် — ဒီ option က — key တစ်ခုတည်းနဲ့ မတူညီတဲ့ ရည်ရွယ်ချက်တွေအတွက် ထုတ်လုပ်လိုက်တဲ့ signatures တွေကို ခွဲခြားဖို့ — optional context ကို သတ်မှတ်ပေးပါတယ်။

`callback` function ကို ပေးထားရင် — ဒီ function က libuv ရဲ့ threadpool ကို သုံးပါတယ်။

### `crypto.subtle`

* Type: {SubtleCrypto}

[`crypto.webcrypto.subtle`][] အတွက် အဆင်ပြေတဲ့ alias (အမည်ပြောင်း) တစ်ခုပါ။

### `crypto.timingSafeEqual(a, b)`

* `a` {ArrayBuffer|Buffer|TypedArray|DataView}
* `b` {ArrayBuffer|Buffer|TypedArray|DataView}
* Returns: {boolean}

ဒီ function က ပေးထားတဲ့ `ArrayBuffer`, `TypedArray` (သို့) `DataView` instances တွေကို ကိုယ်စားပြုတဲ့ underlying bytes တွေကို — constant-time algorithm (အချိန်မကွဲပြားသော algorithm) တစ်ခုနဲ့ — နှိုင်းယှဉ်ပါတယ်။

ဒီ function က — attacker တစ်ဦးကို တန်ဖိုးတစ်ခုခုကို ခန့်မှန်းနိုင်စေမယ့် — timing information (အချိန် အချက်အလက်) တွေကို ပေါက်ကြားစေမှာ မဟုတ်ပါဘူး။ ဒါက HMAC digests တွေ (သို့) authentication cookies (အထောက်အထား စစ်ဆေးခြင်း cookies) လိုမျိုး secret values တွေ — [capability urls](https://www.w3.org/TR/capability-urls/) အပါအဝင် — ကို နှိုင်းယှဉ်ဖို့ သင့်လျော်ပါတယ်။

`a` ရော `b` ပါ `Buffer`s, `TypedArray`s (သို့) `DataView`s တွေ ဖြစ်ရမှာ ဖြစ်ပြီး — ၎င်းတို့မှာ တူညီတဲ့ byte length ရှိရပါမယ်။ `a` နဲ့ `b` ရဲ့ byte lengths တွေ မတူညီဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါတယ်။

`a` နဲ့ `b` ထဲက အနည်းဆုံး တစ်ခုက — `Uint16Array` လိုမျိုး — entry တစ်ခုအတွက် byte တစ်ခုထက် ပိုသုံးတဲ့ `TypedArray` တစ်ခု ဖြစ်နေရင် — ရလဒ်ကို platform ရဲ့ byte order နဲ့ တွက်ချက်ပါလိမ့်မယ်။

Input နှစ်ခုလုံး `Float32Array`s (သို့) `Float64Array`s တွေ ဖြစ်နေတဲ့အခါ — floating-point numbers တွေရဲ့ IEEE 754 encoding ကြောင့် — ဒီ function က မမျှော်လင့်ထားတဲ့ ရလဒ်တွေကို ပြန်ပေးနိုင်ပါတယ်။ အထူးသဖြင့် — floating-point numbers `x` နဲ့ `y` နှစ်ခုအတွက် — `x === y` ရော `Object.is(x, y)` ပါ ၎င်းတို့ရဲ့ byte representations တွေ တူညီတယ်လို့ ဆိုလိုတာ မဟုတ်ပါဘူး။

`crypto.timingSafeEqual` ကို သုံးထားတာက _ပတ်ဝန်းကျင်က (surrounding)_ code တွေ timing-safe ဖြစ်တယ်လို့ အာမခံချက် မပေးပါဘူး။ ပတ်ဝန်းကျင်က code တွေက timing vulnerabilities (အချိန်နဲ့ဆိုင်တဲ့ အားနည်းချက်များ) တွေကို မဖြစ်ပေါ်စေဖို့ သေချာ ဂရုစိုက်ရပါမယ်။

### `crypto.verify(algorithm, data, key, signature[, callback])`

* `algorithm` {string|null|undefined}
* `data` {ArrayBuffer|Buffer|SharedArrayBuffer|TypedArray|DataView|string}
* `key` {Object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey}
* `signature` {ArrayBuffer|Buffer|SharedArrayBuffer|TypedArray|DataView}
* `callback` {Function}
  * `err` {Error}
  * `result` {boolean}
* Returns: {boolean} `callback` function ကို မပေးထားဘူးဆိုရင် — data နဲ့ public key အတွက် signature ရဲ့ တရားဝင်မှုပေါ် မူတည်ပြီး `true` (သို့) `false` ကို ပြန်ပေးပါတယ်။

ပေးထားတဲ့ key နဲ့ algorithm ကို သုံးပြီး `data` အတွက် ပေးထားတဲ့ signature ကို စစ်ဆေး (verify) ပါတယ်။ `algorithm` က `null` (သို့) `undefined` ဖြစ်နေရင် — algorithm က key ရဲ့ အမျိုးအစားပေါ်မှာ မူတည်ပါတယ်။

Ed25519, Ed448 နဲ့ ML-DSA တို့အတွက် `algorithm` က `null` (သို့) `undefined` ဖြစ်ရန် လိုအပ်ပါတယ်။

`key` က [`KeyObject`][] မဟုတ်ဘူးဆိုရင် — ဒီ function က `key` ကို [`crypto.createPublicKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်သလို ပြုမူပါတယ်။ `key` က string, `ArrayBuffer`, [`Buffer`][], `TypedArray` (သို့) `DataView` ဖြစ်နေတဲ့အခါ — ၎င်းထဲမှာ PEM နဲ့ encode လုပ်ထားတဲ့ key material တွေ ပါဝင်ရပါမယ်။ Object တစ်ခု ဖြစ်နေရင် — အောက်ပါ ထပ်ဆောင်း properties တွေကို ဖြတ်သန်းပေးနိုင်ပါတယ်:

* `dsaEncoding` {string} DSA နဲ့ ECDSA တို့အတွက် — ဒီ option က signature ရဲ့
  ပုံစံ (format) ကို သတ်မှတ်ပေးပါတယ်။ ၎င်းက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
  * `'der'` (default): DER နဲ့ encode လုပ်ထားတဲ့ ASN.1 signature structure ဖြစ်ပြီး `(r, s)` ကို encode လုပ်ပါတယ်။
  * `'ieee-p1363'`: IEEE-P1363 မှာ အဆိုပြုထားတဲ့အတိုင်း `r || s` ဆိုတဲ့ signature format ပါ။
* `padding` {integer} RSA အတွက် optional padding တန်ဖိုးပါ — အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါတယ်:

  * `crypto.constants.RSA_PKCS1_PADDING` (default)
  * `crypto.constants.RSA_PKCS1_PSS_PADDING`

  `RSA_PKCS1_PSS_PADDING` က — message ကို sign လုပ်ဖို့ သုံးခဲ့တဲ့ hash function နဲ့ တူညီတဲ့ hash function ကို သုံးတဲ့ MGF1 ကို သုံးပါလိမ့်မယ် — [RFC 4055][] ရဲ့ section 3.1 မှာ သတ်မှတ်ထားတဲ့အတိုင်းပါ။
* `saltLength` {integer} Padding က `RSA_PKCS1_PSS_PADDING` ဖြစ်တဲ့အခါ အတွက် salt length ပါ။
  အထူးတန်ဖိုး `crypto.constants.RSA_PSS_SALTLEN_DIGEST` က salt length ကို digest ရဲ့ အရွယ်အစားနဲ့ ညီအောင် သတ်မှတ်ပြီး — `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (default) ကတော့ ၎င်းကို ခွင့်ပြုထားတဲ့
  အများဆုံး တန်ဖိုးအဖြစ် သတ်မှတ်ပါတယ်။
* `context` {ArrayBuffer|Buffer|TypedArray|DataView} Ed25519[^openssl32] ([RFC 8032][] က Ed25519ctx ကို သုံးတဲ့), Ed448, ML-DSA နဲ့ SLH-DSA တို့အတွက် — ဒီ option က — key တစ်ခုတည်းနဲ့ မတူညီတဲ့ ရည်ရွယ်ချက်တွေအတွက် ထုတ်လုပ်လိုက်တဲ့ signatures တွေကို ခွဲခြားဖို့ — optional context ကို သတ်မှတ်ပေးပါတယ်။

`signature` argument က `data` အတွက် အရင်က တွက်ချက်ထားပြီးသား signature ဖြစ်ပါတယ်။

Public keys တွေက private keys တွေကနေ ဆင်းသက် ရယူနိုင်တာမို့ — `key` အတွက် private key တစ်ခု (သို့) public key တစ်ခု ဖြတ်သန်းပေးနိုင်ပါတယ်။

`callback` function ကို ပေးထားရင် — ဒီ function က libuv ရဲ့ threadpool ကို သုံးပါတယ်။

### `crypto.webcrypto`

Type: {Crypto} Web Crypto API standard ရဲ့ implementation တစ်ခုပါ။

အသေးစိတ်အတွက် [Web Crypto API documentation][] ကို ကြည့်ပါ။

## မှတ်စုများ (Notes)

### Cryptographic APIs တွေထဲကို inputs အဖြစ် strings တွေ သုံးစွဲခြင်း (Using strings as inputs to cryptographic APIs)

သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် — Node.js က ပံ့ပိုးပေးတဲ့ cryptographic APIs အများအပြားက — underlying cryptographic algorithm က byte sequences တွေနဲ့ အလုပ်လုပ်တဲ့ နေရာတွေမှာ — strings တွေကို inputs အဖြစ် လက်ခံပါတယ်။ ဒီလို နေရာတွေထဲမှာ plaintexts, ciphertexts, symmetric keys, initialization vectors, passphrases, salts, authentication tags နဲ့ additional authenticated data တွေ ပါဝင်ပါတယ်။

Cryptographic APIs တွေဆီကို strings တွေ ဖြတ်သန်းပေးတဲ့အခါ — အောက်ပါ အချက်တွေကို ထည့်သွင်း စဉ်းစားပါ။

* Byte sequences တွေ အားလုံးက တရားဝင် (valid) UTF-8 strings တွေ မဟုတ်ပါဘူး။ ဒါကြောင့် — string တစ်ခုကနေ `n` အရှည်ရှိတဲ့ byte sequence တစ်ခု ဆင်းသက်လာတဲ့အခါ — ၎င်းရဲ့ entropy က random (သို့) pseudorandom ဖြစ်တဲ့ `n` byte sequence တစ်ခုရဲ့ entropy ထက် ယေဘုယျအားဖြင့် နိမ့်ပါတယ်။ ဥပမာ — ဘယ် UTF-8 string မှ `c0 af` ဆိုတဲ့ byte sequence ကို ရလာစေမှာ မဟုတ်ပါဘူး။ Secret keys တွေက လုံးလိုလုံးထ နီးပါး random (သို့) pseudorandom byte sequences တွေ ဖြစ်သင့်ပါတယ်။
* အလားတူပဲ — random (သို့) pseudorandom byte sequences တွေကို UTF-8 strings တွေအဖြစ် ပြောင်းလဲတဲ့အခါ — တရားဝင်တဲ့ code points တွေကို ကိုယ်စားမပြုတဲ့ subsequences တွေကို Unicode replacement character (`U+FFFD`) နဲ့ အစားထိုးနိုင်ပါတယ်။ ဒါကြောင့် ရလာတဲ့ Unicode string ရဲ့ byte representation က — အဲဒီ string ကို ဖန်တီးခဲ့တဲ့ byte sequence နဲ့ — မညီမျှနိုင်ပါဘူး။

  ```js
  const original = [0xc0, 0xaf];
  const bytesAsString = Buffer.from(original).toString('utf8');
  const stringAsBytes = Buffer.from(bytesAsString, 'utf8');
  console.log(stringAsBytes);
  // Prints '<Buffer ef bf bd ef bf bd>'.
  ```

  Ciphers, hash functions, signature algorithms နဲ့ key derivation functions တွေရဲ့ outputs တွေက pseudorandom byte sequences တွေ ဖြစ်ပြီး — Unicode strings တွေအနေနဲ့ မသုံးသင့်ပါဘူး။
* Strings တွေကို user input ကနေ ရယူတဲ့အခါ — Unicode characters တစ်ချို့က — မတူညီတဲ့ byte sequences တွေကို ဖြစ်ပေါ်စေတဲ့ — ညီမျှတဲ့ နည်းလမ်းမျိုးစုံနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်။ ဥပမာ — PBKDF2 (သို့) scrypt လိုမျိုး key derivation function တစ်ခုဆီကို user ရဲ့ passphrase တစ်ခု ဖြတ်သန်းပေးတဲ့အခါ — key derivation function ရဲ့ ရလဒ်က string က composed (ပေါင်းစည်းထားသော) (သို့) decomposed (ခွဲထားသော) characters တွေ သုံးထားလားပေါ်မှာ မူတည်ပါတယ်။ Node.js က character representations တွေကို normalize (စံသတ်မှတ်) လုပ်မပေးပါဘူး။ Developers တွေက user inputs တွေကို cryptographic APIs တွေဆီကို မဖြတ်သန်းခင် — [`String.prototype.normalize()`][] ကို သုံးဖို့ စဉ်းစားသင့်ပါတယ်။

### Legacy streams API (prior to Node.js 0.10)

Crypto module ကို Node.js ထဲကို ထည့်သွင်းခဲ့ချိန်က — ပေါင်းစည်းထားတဲ့ (unified) Stream API ဆိုတဲ့ concept မရှိသေးပဲ — binary data တွေကို ကိုင်တွယ်ဖို့ [`Buffer`][] objects တွေလည်း မရှိသေးပါဘူး။ ဒါကြောင့် — [streams][stream] API ကို implement လုပ်တဲ့ တခြား Node.js classes တွေမှာ ပုံမှန် တွေ့ရလေ့ မရှိတဲ့ — methods တွေ (ဥပမာ `update()`, `final()` (သို့) `digest()`) က `crypto` classes အများအပြားမှာ ရှိပါတယ်။ ထို့အပြင် — methods အများအပြားက `Buffer`s တွေအစား — default အနေနဲ့ `'latin1'` နဲ့ encode လုပ်ထားတဲ့ strings တွေကို လက်ခံပြီး ပြန်ပေးပါတယ်။ ဒီ default ကို Node.js 0.9.3 မှာ — [`Buffer`][] objects တွေကို default အနေနဲ့ သုံးအောင် ပြောင်းလဲခဲ့ပါတယ်။

### အားနည်းသော သို့မဟုတ် ပျက်စီးနေသော algorithms များအတွက် ပံ့ပိုးမှု (Support for weak or compromised algorithms)

`node:crypto` module က — ပျက်စီးသွားပြီးသား (compromised) ဖြစ်ကာ အသုံးပြုဖို့ အကြံပြုမထားတဲ့ algorithms အချို့ကို ဆက်လက် ပံ့ပိုးပေးနေဆဲ ဖြစ်ပါတယ်။ API က — လုံခြုံစွာ သုံးဖို့ အားနည်းလွန်းတဲ့ — key size ငယ်တဲ့ ciphers နဲ့ hashes တွေကို သုံးခွင့်လည်း ပြုပေးထားပါတယ်။

Users တွေက — သူတို့ရဲ့ လုံခြုံရေး လိုအပ်ချက်တွေနဲ့အညီ — crypto algorithm နဲ့ key size ကို ရွေးချယ်ခြင်းအတွက် တာဝန် အပြည့်အဝ ယူသင့်ပါတယ်။

[NIST SP 800-131A][] ရဲ့ အကြံပြုချက်တွေကို အခြေခံပြီး:

* MD5 နဲ့ SHA-1 တို့က — digital signatures (ဒစ်ဂျစ်တယ် လက်မှတ်များ) လိုမျိုး collision resistance (တိုက်မိမှု ခံနိုင်ရည်) လိုအပ်တဲ့ နေရာတွေမှာ — လက်ခံနိုင်စရာ မရှိတော့ပါဘူး။
* RSA, DSA နဲ့ DH algorithms တွေနဲ့ သုံးတဲ့ key က အနည်းဆုံး 2048 bits ရှိဖို့ — ECDSA နဲ့ ECDH ရဲ့ curve အတွက်ကတော့ အနည်းဆုံး 224 bits ရှိဖို့ — နှစ်ပေါင်းများစွာ လုံခြုံစွာ သုံးနိုင်ရန် အကြံပြုထားပါတယ်။
* `modp1`, `modp2` နဲ့ `modp5` တို့ရဲ့ DH groups တွေက 2048 bits ထက် ငယ်တဲ့ key size ရှိတာမို့ အကြံပြုမထားပါဘူး။

အခြား အကြံပြုချက်တွေနဲ့ အသေးစိတ်တွေအတွက် ကိုးကားချက် (reference) ကို ကြည့်ပါ။

လူသိများတဲ့ အားနည်းချက်တွေ ရှိပြီး — လက်တွေ့မှာ သက်ဆိုင်မှု နည်းပါးတဲ့ — algorithms အချို့ကို — default အနေနဲ့ ဖွင့်မထားတဲ့ — [legacy provider][] ကနေတစ်ဆင့်သာ ရရှိနိုင်ပါတယ်။

### CCM mode (CCM မုဒ်)

CCM က ပံ့ပိုးပေးထားတဲ့ [AEAD algorithms][] တွေထဲက တစ်ခုပါ။ ဒီ mode ကို သုံးတဲ့ applications တွေက cipher API ကို သုံးတဲ့အခါ — သတ်မှတ်ထားတဲ့ ကန့်သတ်ချက်တွေကို လိုက်နာရပါမယ်:

* Authentication tag ရဲ့ အရှည်ကို cipher ဖန်တီးစဉ်မှာ `authTagLength` option ကို သတ်မှတ်ခြင်းအားဖြင့် သတ်မှတ်ရမှာ ဖြစ်ပြီး — 4, 6, 8, 10, 12, 14 (သို့) 16 bytes တွေထဲက တစ်ခု ဖြစ်ရပါမယ်။
* Initialization vector (nonce) `N` ရဲ့ အရှည်က 7 နဲ့ 13 bytes ကြားမှာ ရှိရပါမယ် (`7 ≤ N ≤ 13`)။
* Plaintext ရဲ့ အရှည်က `2 ** (8 * (15 - N))` bytes အထိ ကန့်သတ်ထားပါတယ်။
* Decrypt လုပ်တဲ့အခါ — `update()` ကို မခေါ်ခင် authentication tag ကို `setAuthTag()` ကနေတစ်ဆင့် သတ်မှတ်ရပါမယ်။ မဟုတ်ရင် — decryption က မအောင်မြင်ပဲ — [RFC 3610][] ရဲ့ section 2.6 နဲ့အညီ — `final()` က error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။
* CCM mode မှာ `write(data)`, `end(data)` (သို့) `pipe()` လိုမျိုး stream methods တွေကို သုံးတာက မအောင်မြင်နိုင်ပါတယ် — CCM က instance တစ်ခုမှာ data chunk တစ်ခုထက် ပိုပြီး ကိုင်တွယ်လို့ မရလို့ပါ။
* Additional authenticated data (AAD) တွေ ဖြတ်သန်းပေးတဲ့အခါ — တကယ့် message ရဲ့ အရှည်ကို byte နဲ့ — `plaintextLength` option ကနေတစ်ဆင့် — `setAAD()` ဆီကို ဖြတ်သန်းပေးရပါမယ်။ Crypto libraries အများအပြားက authentication tag ကို ciphertext ထဲမှာ ထည့်သွင်းတတ်ပါတယ် — ဆိုလိုတာက ၎င်းတို့က `plaintextLength + authTagLength` အရှည်ရှိတဲ့ ciphertexts တွေကို ထုတ်လုပ်ပါတယ်။ Node.js က authentication tag ကို မထည့်သွင်းတာမို့ — ciphertext ရဲ့ အရှည်က အမြဲတမ်း `plaintextLength` ပါ။ AAD မသုံးဘူးဆိုရင် ဒါ မလိုအပ်ပါဘူး။
* CCM က message တစ်ခုလုံးကို တစ်ပြိုင်နက် process လုပ်တာမို့ — `update()` ကို တစ်ကြိမ်တည်း အတိအကျ ခေါ်ရပါမယ်။
* Message ကို encrypt/decrypt လုပ်ဖို့ `update()` ကို ခေါ်တာက လုံလောက်ပေမယ့် — applications တွေက authentication tag ကို တွက်ချက် (သို့) စစ်ဆေးဖို့ — `final()` ကို _ခေါ်ရပါမယ်_ (must)။

```mjs
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```cjs
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

### SIV နှင့် GCM-SIV modes (SIV and GCM-SIV modes)

`SIV`[^openssl30] နဲ့ `GCM-SIV`[^openssl32] တို့က — OpenSSL က ပံ့ပိုးပေးတဲ့အခါ — supported [AEAD algorithms][] တွေ ဖြစ်ပါတယ်။ ဒီ modes တွေကို သုံးတဲ့ applications တွေက cipher API ကို သုံးတဲ့အခါ — သတ်မှတ်ထားတဲ့ ကန့်သတ်ချက်တွေကို လိုက်နာရပါမယ်:

* Authentication tag ရဲ့ အရှည်က 16 bytes မှာ ပုံသေ (fixed) ပါ။
* `AES-SIV` keys တွေက အမည်ပေးထားတဲ့ AES key size ရဲ့ နှစ်ဆ ဖြစ်ပါတယ်: `aes-128-siv` က 32-byte key တစ်ခု လိုအပ်ပြီး — `aes-192-siv` က 48-byte key တစ်ခု — `aes-256-siv` ကတော့ 64-byte key တစ်ခု လိုအပ်ပါတယ်။
* `AES-SIV` ciphers တွေက initialization vector ကို မသုံးပါဘူး။ [`crypto.createCipheriv()`][] (သို့) [`crypto.createDecipheriv()`][] ဆီကို `null` (သို့) zero-length `iv` တစ်ခု ဖြတ်သန်းပေးပါ။
* `AES-SIV` နဲ့ `AES-GCM-SIV` တို့က OpenSSL 3.5 (သို့) နောက်ပိုင်းမှသာ zero-length plaintext တွေကို ပံ့ပိုးပါတယ်။
* `AES-SIV` မှာ သီးခြား nonce (သို့) IV parameter တစ်ခု မရှိပါဘူး။ RFC 5297 က `AES-SIV` ကို — associated-data inputs တွေရဲ့ အစဉ်လိုက် (ordered) list တစ်ခုအပေါ်မှာ သတ်မှတ်ပါတယ်။ `setAAD()` call တစ်ခုချင်းစီက အဲဒီ list ထဲက input တစ်ခုကို ထောက်ပံ့ပေးပါတယ်။ Protocol တစ်ခုက `AES-SIV` နဲ့ nonce တစ်ခု သုံးမယ်ဆိုရင် — တခြား associated-data inputs တွေ ပြီးနောက်၊ `update()` မခေါ်ခင် — `setAAD(nonce)` ကို ခေါ်ပါ။ Associated-data inputs တွေကို အများဆုံး 126 ခုအထိ ထောက်ပံ့ပေးနိုင်ပါတယ်။
* `AES-GCM-SIV` ciphers တွေက 12-byte initialization vector တစ်ခု လိုအပ်ပါတယ်။
* Decrypt လုပ်တဲ့အခါ — `update()` ကို မခေါ်ခင် authentication tag ကို `setAuthTag()` ကနေတစ်ဆင့် သတ်မှတ်ရပါမယ်။
* `write(data)`, `end(data)` (သို့) `pipe()` လိုမျိုး stream methods တွေကို သုံးတာက မအောင်မြင်နိုင်ပါဘူး — ဒီ modes တွေက instance တစ်ခုမှာ data chunk တစ်ခုထက် ပိုပြီး ကိုင်တွယ်လို့ မရလို့ပါ။
* ဒီ modes တွေက message တစ်ခုလုံးကို တစ်ပြိုင်နက် process လုပ်တာမို့ — `update()` ကို တစ်ကြိမ်တည်း အတိအကျ ခေါ်ရပါမယ်။
* Message ကို encrypt/decrypt လုပ်ဖို့ `update()` ကို ခေါ်တာက လုံလောက်ပေမယ့် — applications တွေက authentication tag ကို တွက်ချက် (သို့) စစ်ဆေးဖို့ — `final()` ကို _ခေါ်ရပါမယ်_ (must)။
### FIPS mode

Node.js က ၎င်းနဲ့ ချိတ်ဆက်ထားတဲ့ OpenSSL library က ပံ့ပိုးပေးတဲ့ FIPS support ကို
ထုတ်ဖော် ပြသပေးပါတယ်။ Node.js ကိုယ်တိုင်ကတော့ FIPS validated (FIPS အသိအမှတ်ပြု
စစ်ဆေးပြီးသား) မဟုတ်ပါဘူး။ Validation (အတည်ပြုချက်) က တိကျတဲ့ OpenSSL module သို့မဟုတ်
provider တစ်ခုနဲ့ သက်ဆိုင်ပြီး — ၎င်းကို ၎င်းရဲ့ security policy (လုံခြုံရေး မူဝါဒ)
အတိုင်း deploy လုပ်မှသာ သက်ရောက်မှု ရှိပါတယ်။ Vendor (ထုတ်လုပ်သူ) က ပံ့ပိုးပေးတဲ့
Node.js သို့မဟုတ် OpenSSL builds တွေက မတူညီတဲ့ configuration တစ်ခု လိုအပ်နိုင်ပါတယ် —
အဲဒီ builds တွေအတွက် vendor ရဲ့ documentation ကို လိုက်နာပါ။

OpenSSL 1.1.1 နဲ့ဆိုရင် — Node.js ကို FIPS-capable (FIPS သုံးစွဲနိုင်သော) OpenSSL
library တစ်ခုနဲ့ build လုပ်ထားရပါမယ်။

OpenSSL 3 မှာတော့ — FIPS support က [OpenSSL FIPS module guide][] မှာ ဖော်ပြထားတဲ့
provider model (provider ပုံစံ) ကို သုံးပါတယ်။ FIPS-approved (FIPS အသိအမှတ်ပြု)
implementations တွေကို သုံးစွဲဖို့ အောက်ပါတို့ လိုအပ်ပါတယ်:

* OpenSSL 3 FIPS provider တစ်ခုကို မှန်ကန်စွာ install လုပ်ထားရပါမယ်။
* OpenSSL 3 ရဲ့ [FIPS module configuration file][] တစ်ခု ရှိရပါမယ်။
* Node.js က သုံးတဲ့ OpenSSL library context ထဲကို FIPS provider ကို load လုပ်ထားရပါမယ်
  — ပုံမှန်အားဖြင့် Node.js စတင်တဲ့အခါ OpenSSL configuration file ထဲမှာ ၎င်းကို
  activate လုပ်ခြင်းအားဖြင့် ဖြစ်ပါတယ်။
* Cryptographic implementations တွေကို ရယူတဲ့အခါ default property query ထဲမှာ
  `fips=yes` ပါဝင်ရပါမယ်။ ဒါကို process startup ကတည်းက OpenSSL configuration,
  [`--enable-fips`][] သို့မဟုတ် [`--force-fips`][] တို့နဲ့ သတ်မှတ်နိုင်ပြီး —
  နောက်ပိုင်း ရယူမှုတွေအတွက်တော့ `crypto.setFips(true)` နဲ့ သတ်မှတ်နိုင်ပါတယ်။

OpenSSL 3 configuration file တစ်ခုရဲ့ ဥပမာက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```text
nodejs_conf = nodejs_init
config_diagnostics = 1

.include /<absolute path>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
# The fips section name should match the section name inside the
# included fipsmodule.cnf.
fips = fips_sect
base = base_sect

[base_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

`fipsmodule.cnf` file ကို FIPS provider installation ရဲ့ အစိတ်အပိုင်း တစ်ခုအနေနဲ့
ထုတ်လုပ်ပြီး — module ရဲ့ integrity (သမာဓိ) နဲ့ self-test (ကိုယ်တိုင် စမ်းသပ်စစ်ဆေးမှု)
အချက်အလက်တွေ ပါဝင်ပါတယ်။ တိကျတဲ့ command နဲ့ arguments တွေက installation အလိုက်
ကွဲပြားပါတယ် — [OpenSSL FIPS configuration][] နဲ့ [OpenSSL FIPS module guide][] ကို
ကြည့်ပါ။ Installation လုပ်တဲ့အခါ `openssl fipsinstall` ကို သုံးပါတယ်။

အပေါ်က ဥပမာက Node.js စတင်တဲ့အခါ provider ကို activate လုပ်ပြီး — `fips=yes`
property query ကိုပါ ဖွင့်ပေးပါတယ်။ Startup မှာ provider ကို activate လုပ်ပေမယ့်
property query ကိုတော့ နောက်မှ `crypto.setFips(true)` နဲ့ ဖွင့်ချင်ရင် —
`alg_section = algorithm_sect` နဲ့ `[algorithm_sect]` block ကို ချန်လှပ်လိုက်ပါ။
Provider ကို load လုပ်ထားရဆဲ ဖြစ်ရပါမယ် — ဒီ startup configuration ကို သုံးတဲ့အခါ
၎င်းရဲ့ activation ကို ဖွင့်ထားဆဲ ဖြစ်အောင် ထားပါ။ `crypto.setFips(true)` ကို
application code က OpenSSL-backed APIs တခြားဟာတွေ မသုံးခင် ခေါ်ပေးသင့်ပါတယ်။ ဒါက
process startup ကတည်းက property query ကို ဖွင့်ပေးတာနဲ့ ညီမျှတာ မဟုတ်ပါဘူး —
အကြောင်းကတော့ Node.js က application code မလည်ပတ်ခင် OpenSSL state အချို့ကို
initialize လုပ်ပြီးသား ဖြစ်လို့ပါ။ Property query က process startup ကတည်းက active
ဖြစ်နေဖို့ လိုအပ်တဲ့အခါ — ဥပမာကို ဖော်ပြထားတဲ့အတိုင်း သုံးပါ၊ [`--enable-fips`][]
သို့မဟုတ် [`--force-fips`][] ကို သုံးပါ။

`config_diagnostics` က configuration errors တွေကို လျစ်လျူရှုခံရမယ့်အစား — startup
ကို တားဆီးပေးစေပါတယ်။ `base` provider က FIPS provider နဲ့အတူ ပုံမှန် လိုအပ်လေ့ရှိတဲ့ —
encoders နဲ့ decoders လိုမျိုး — non-cryptographic ဖြစ်တဲ့ ထောက်ကူပေးတဲ့ (supporting)
algorithms တွေကို ထောက်ပံ့ပေးပါတယ်။ `default_properties = fips=yes` က OpenSSL ရဲ့
default algorithm ရွေးချယ်မှုကို `fips=yes` နဲ့ ကိုက်ညီတဲ့ implementations တွေဆီသာ
ကန့်သတ်လိုက်ပါတယ်။

`OPENSSL_CONF` ကို OpenSSL configuration file ဆီကို သတ်မှတ်ပေးပါ။ Dynamically load
လုပ်တဲ့ provider တစ်ခုအတွက်ဆိုရင် — `OPENSSL_MODULES` နဲ့ provider module ပါဝင်တဲ့
directory ကို သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ:

```bash
export OPENSSL_CONF=/<path to configuration file>/nodejs.cnf
export OPENSSL_MODULES=/<path to openssl lib>/ossl-modules
```

[`--openssl-config`][] command-line option က configuration file ကို ရွေးချယ်ပေးပြီး —
`OPENSSL_CONF` ထက် ဦးစားပေး အသုံးပြုပါတယ်။ နှစ်ခုလုံး သတ်မှတ်မထားရင် OpenSSL ရဲ့
default configuration file ကို သုံးပါတယ်။

Default အနေနဲ့ — Node.js က OpenSSL ရဲ့ ပုံမှန် `openssl_conf` section အစား
`nodejs_conf` section ကို ဖတ်ပါတယ်။ `openssl_conf` ကို ဖတ်စေချင်ရင်
[`--openssl-shared-config`][] ကို သုံးပါ — သို့မဟုတ် default section name ကို
ပြောင်းလဲဖို့ Node.js ကို `./configure --openssl-conf-name=<name>` နဲ့ build လုပ်ပါ။

OpenSSL 3 ပေါ်မှာ အပေါ်က configuration က startup မှာ `fips=yes` property query ကို
ဖွင့်ပေးပါတယ်။ အောက်ပါ controls တွေလည်း ရရှိနိုင်ပါတယ်:

* [`--enable-fips`][] နဲ့ [`--force-fips`][] တို့က property query ကို ဖွင့်ပေးပြီး —
  ထို့အပြင် `fips` လို့ အမည်ပေးထားတဲ့ configured provider က initialize ဖြစ်ပြီး
  ၎င်းရဲ့ self-test ကို အောင်မြင်ရန်လည်း လိုအပ်ပါတယ်။ အဲဒီစစ်ဆေးမှု မအောင်မြင်ရင်
  Node.js က ထွက်သွားပါတယ်။ `--force-fips` က script code ကနေ FIPS mode ကို disable
  လုပ်လို့ မရအောင်လည်း တားဆီးပါတယ်။
* [`crypto.setFips()`][] က FIPS/property-query state ကို ပြောင်းလဲပေးပါတယ်။ OpenSSL 3
  ပေါ်မှာ ၎င်းက provider တစ်ခုကို install, load, initialize သို့မဟုတ် validate လုပ်ပေးတာ
  မဟုတ်ပါဘူး။ ဒီ call မတိုင်ခင် ရယူထားပြီးသား implementations တွေကတော့ မပြောင်းလဲပါဘူး။
* [`crypto.getFips()`][] က FIPS/property-query state ကို အစီရင်ခံပါတယ်။ OpenSSL 3 ပေါ်မှာ
  `1` ဆိုတဲ့ return value က FIPS provider တစ်ခု load လုပ်ပြီး validate လုပ်ပြီးသား
  ဖြစ်ကြောင်းကို သက်သေ မပြနိုင်ပါဘူး။

OpenSSL 1.1.1 နဲ့ဆိုရင် — ဒီ controls တွေက library ရဲ့ FIPS mode support ကို သုံးပြီး
FIPS-capable OpenSSL build တစ်ခု လိုအပ်ပါတယ်။

Active ဖြစ်နေတဲ့ FIPS settings တွေအောက်မှာ ရရှိနိုင်တဲ့ algorithms တွေကိုသာ သုံးနိုင်ပါတယ်။
OpenSSL 3 မှာ load လုပ်ထားတဲ့ provider တစ်ခုမှ `fips=yes` နဲ့ ကိုက်ညီတဲ့ တောင်းဆိုထားတဲ့
cryptographic implementation ကို မထောက်ပံ့ဘူးဆိုရင် — အဲဒါကို ရယူဖို့ ကြိုးစားတာက
ပုံမှန်အားဖြင့် `ERR_OSSL_EVP_UNSUPPORTED` error နဲ့ မအောင်မြင်ပါဘူး။ FIPS mode
ပိတ်ထားတဲ့အခါ Node.js က support လုပ်ပေမယ့် — active FIPS settings တွေအောက်မှာ မရရှိနိုင်တဲ့
algorithms တွေမှာလည်း အလားတူ error မျိုး ဖြစ်ပွားနိုင်ပါတယ်။

OpenSSL ရဲ့ documentation အရ — process တစ်ခုအတွင်းမှာ `libcrypto` ရဲ့ copies
အများအပြားက FIPS provider တစ်ခုတည်းကို သုံးလို့ မရပါဘူး။ ဒါက `libcrypto` ရဲ့ copy
တစ်ခု ထပ်မံ load လုပ်တဲ့ native addons တွေကို ထိခိုက်စေနိုင်ပါတယ် — OpenSSL ရဲ့
documented workaround (ရှောင်ကွင်းနည်း) ကတော့ `libcrypto` instance တစ်ခုချင်းစီအတွက်
provider ရဲ့ သီးခြား copy တစ်ခုစီကို သုံးဖို့ ဖြစ်ပါတယ်။ [OpenSSL FIPS provider
limitations][] ကို ကြည့်ပါ။

## Crypto ကိန်းသေများ (Crypto constants)

`crypto.constants` ကနေ export လုပ်ထားတဲ့ အောက်ပါ constants တွေက `node:crypto`,
`node:tls`, နဲ့ `node:https` modules တွေရဲ့ အသုံးပြုမှု အမျိုးမျိုးမှာ သက်ရောက်မှု
ရှိပြီး — ယေဘုယျအားဖြင့် OpenSSL နဲ့ သီးသန့် ဆက်စပ်နေပါတယ်။

### OpenSSL ၏ options များ (OpenSSL options)

အသေးစိတ်အတွက် [list of SSL OP Flags][] ကို ကြည့်ပါ။

| Constant | Description |
| --- | --- |
| `SSL_OP_ALL` | OpenSSL အတွင်းမှာ bug workarounds (ချွတ်ယွင်းချက် ရှောင်ကွင်းနည်းများ) အများအပြားကို အသုံးချပါတယ်။ အသေးစိတ်အတွက် [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) ကို ကြည့်ပါ။ |
| `SSL_OP_ALLOW_NO_DHE_KEX` | TLS v1.3 အတွက် [EC]DHE-based မဟုတ်တဲ့ key exchange mode (သော့ချိန်း ဖလှယ်မှု မုဒ်) တစ်ခုကို ခွင့်ပြုဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | OpenSSL နဲ့ patch မထားတဲ့ (unpatched) clients သို့မဟုတ် servers တွေကြားမှာ ရှေးဟောင်း လုံခြုံမှုမရှိတဲ့ renegotiation (ပြန်လည် ညှိနှိုင်းမှု) ကို ခွင့်ပြုပါတယ်။ [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) ကို ကြည့်ပါ။ |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Cipher တစ်ခု ရွေးချယ်တဲ့အခါ client ရဲ့ preferences တွေအစား server ရဲ့ preferences တွေကို သုံးဖို့ ကြိုးစားပါတယ်။ အပြုအမူက protocol version ပေါ်မှာ မူတည်ပါတယ်။ [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html) ကို ကြည့်ပါ။ |
| `SSL_OP_CISCO_ANYCONNECT` | DTLS_BAD_VER ရဲ့ Cisco ဗားရှင်း identifier ကို သုံးဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_COOKIE_EXCHANGE` | Cookie exchange (cookie ဖလှယ်မှု) ကို ဖွင့်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | cryptopro draft ရဲ့ အစောပိုင်း ဗားရှင်းကနေ server-hello extension ကို ထည့်သွင်းဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | OpenSSL 0.9.6d မှာ ထည့်သွင်းခဲ့တဲ့ SSL 3.0/TLS 1.0 vulnerability workaround (အားနည်းချက် ရှောင်ကွင်းနည်း) တစ်ခုကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_LEGACY_SERVER_CONNECT` | RI ကို support မလုပ်တဲ့ servers တွေဆီကို ကနဦး (initial) ချိတ်ဆက်မှုကို ခွင့်ပြုပါတယ်။ |
| `SSL_OP_NO_COMPRESSION` | SSL/TLS compression (ချုံ့မှု) အတွက် support ကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | encrypt-then-MAC ကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_NO_QUERY_MTU` |  |
| `SSL_OP_NO_RENEGOTIATION` | renegotiation ကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | renegotiation လုပ်ဆောင်တဲ့အခါ session အသစ်တစ်ခုကို အမြဲတမ်း စတင်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_NO_SSLv2` | SSL v2 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_NO_SSLv3` | SSL v3 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_NO_TICKET` | RFC4507bis tickets တွေ သုံးစွဲတာကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |
| `SSL_OP_NO_TLSv1` | TLS v1 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_NO_TLSv1_1` | TLS v1.1 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_NO_TLSv1_2` | TLS v1.2 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_NO_TLSv1_3` | TLS v1.3 ကို ပိတ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ် |
| `SSL_OP_PRIORITIZE_CHACHA` | Client က ဦးစားပေးတဲ့အခါ ChaCha20-Poly1305 ကို ဦးစားပေးဖို့ OpenSSL server ကို ညွှန်ကြားပါတယ်။ `SSL_OP_CIPHER_SERVER_PREFERENCE` ကို ဖွင့်မထားရင် ဒီ option က ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ |
| `SSL_OP_TLS_ROLLBACK_BUG` | Version rollback attack detection (ဗားရှင်း နောက်ပြန် လှည့်ဖြားမှု ထောက်လှမ်းခြင်း) ကို disable လုပ်ဖို့ OpenSSL ကို ညွှန်ကြားပါတယ်။ |

### OpenSSL engine ကိန်းသေများ (OpenSSL engine constants)

| Constant | Description |
| --- | --- |
| `ENGINE_METHOD_RSA` | Engine အသုံးပြုမှုကို RSA ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_DSA` | Engine အသုံးပြုမှုကို DSA ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_DH` | Engine အသုံးပြုမှုကို DH ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_RAND` | Engine အသုံးပြုမှုကို RAND ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_EC` | Engine အသုံးပြုမှုကို EC ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_CIPHERS` | Engine အသုံးပြုမှုကို CIPHERS ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_DIGESTS` | Engine အသုံးပြုမှုကို DIGESTS ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_PKEY_METHS` | Engine အသုံးပြုမှုကို PKEY_METHS ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Engine အသုံးပြုမှုကို PKEY_ASN1_METHS ဆီသာ ကန့်သတ်ပါတယ် |
| `ENGINE_METHOD_ALL` |  |
| `ENGINE_METHOD_NONE` |  |

### အခြား OpenSSL ကိန်းသေများ (Other OpenSSL constants)

| Constant | Description |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` |  |
| `DH_CHECK_P_NOT_PRIME` |  |
| `DH_UNABLE_TO_CHECK_GENERATOR` |  |
| `DH_NOT_SUITABLE_GENERATOR` |  |
| `RSA_PKCS1_PADDING` |  |
| `RSA_SSLV23_PADDING` |  |
| `RSA_NO_PADDING` |  |
| `RSA_PKCS1_OAEP_PADDING` |  |
| `RSA_X931_PADDING` |  |
| `RSA_PKCS1_PSS_PADDING` |  |
| `RSA_PSS_SALTLEN_DIGEST` | Signing (လက်မှတ်ရေးထိုးခြင်း) သို့မဟုတ် verifying (စစ်ဆေး အတည်ပြုခြင်း) လုပ်တဲ့အခါ `RSA_PKCS1_PSS_PADDING` အတွက် salt length ကို digest size နဲ့ ညီအောင် သတ်မှတ်ပါတယ်။ |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Data တွေ signing လုပ်တဲ့အခါ `RSA_PKCS1_PSS_PADDING` အတွက် salt length ကို ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးနဲ့ ညီအောင် သတ်မှတ်ပါတယ်။ |
| `RSA_PSS_SALTLEN_AUTO` | Signature တစ်ခုကို verifying လုပ်တဲ့အခါ `RSA_PKCS1_PSS_PADDING` အတွက် salt length ကို အလိုအလျောက် ဆုံးဖြတ်စေပါတယ်။ |
| `POINT_CONVERSION_COMPRESSED` |  |
| `POINT_CONVERSION_UNCOMPRESSED` |  |
| `POINT_CONVERSION_HYBRID` |  |

### Node.js crypto ကိန်းသေများ (Node.js crypto constants)

| Constant | Description |
| --- | --- |
| `defaultCoreCipherList` | Node.js က သုံးတဲ့ built-in (အတွင်းထည့်သွင်းထားသော) default cipher list ကို သတ်မှတ်ပေးပါတယ်။ |
| `defaultCipherList` | လက်ရှိ Node.js process က သုံးနေတဲ့ active default cipher list ကို သတ်မှတ်ပေးပါတယ်။ |

[^openssl30]: Requires OpenSSL >= 3.0

[^openssl32]: Requires OpenSSL >= 3.2

[^openssl35]: Requires OpenSSL >= 3.5

[AEAD algorithms]: https://en.wikipedia.org/wiki/Authenticated_encryption
[CCM mode]: #ccm-mode
[CVE-2021-44532]: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532
[Caveats]: #support-for-weak-or-compromised-algorithms
[Crypto constants]: #crypto-constants
[FIPS mode]: #fips-mode
[FIPS module configuration file]: https://docs.openssl.org/3.0/man5/fips_config/
[HTML 5.2]: https://www.w3.org/TR/html52/changes.html#features-removed
[JWK]: https://tools.ietf.org/html/rfc7517
[Key usages]: webcrypto.md#cryptokeyusages
[NIST SP 800-131A]: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf
[NIST SP 800-132]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
[NIST SP 800-38D]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
[OpenSSL FIPS configuration]: https://docs.openssl.org/3.0/man5/fips_config/
[OpenSSL FIPS module guide]: https://docs.openssl.org/master/man7/fips_module/
[OpenSSL FIPS provider limitations]: https://docs.openssl.org/3.6/man7/OSSL_PROVIDER-FIPS/
[OpenSSL's SPKAC implementation]: https://www.openssl.org/docs/man3.0/man1/openssl-spkac.html
[Permission Model]: permissions.md#permission-model
[RFC 1421]: https://www.rfc-editor.org/rfc/rfc1421.txt
[RFC 2409]: https://www.rfc-editor.org/rfc/rfc2409.txt
[RFC 2818]: https://www.rfc-editor.org/rfc/rfc2818.txt
[RFC 3526]: https://www.rfc-editor.org/rfc/rfc3526.txt
[RFC 3610]: https://www.rfc-editor.org/rfc/rfc3610.txt
[RFC 4055]: https://www.rfc-editor.org/rfc/rfc4055.txt
[RFC 4122]: https://www.rfc-editor.org/rfc/rfc4122.txt
[RFC 5208]: https://www.rfc-editor.org/rfc/rfc5208.txt
[RFC 5280]: https://www.rfc-editor.org/rfc/rfc5280.txt
[RFC 7517]: https://www.rfc-editor.org/rfc/rfc7517.txt
[RFC 8032]: https://www.rfc-editor.org/rfc/rfc8032.txt
[RFC 9562]: https://www.rfc-editor.org/rfc/rfc9562.txt
[Web Crypto API documentation]: webcrypto.md
[`--allow-openssl-store`]: cli.md#--allow-openssl-store
[`--enable-fips`]: cli.md#--enable-fips
[`--force-fips`]: cli.md#--force-fips
[`--openssl-config`]: cli.md#--openssl-configfile
[`--openssl-shared-config`]: cli.md#--openssl-shared-config
[`BN_is_prime_ex`]: https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex.html
[`Buffer`]: buffer.md
[`DH_generate_key()`]: https://www.openssl.org/docs/man3.0/man3/DH_generate_key.html
[`DiffieHellmanGroup`]: #class-diffiehellmangroup
[`KeyObject`]: #class-keyobject
[`Sign`]: #class-sign
[`String.prototype.normalize()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
[`UV_THREADPOOL_SIZE`]: cli.md#uv_threadpool_sizesize
[`Verify`]: #class-verify
[`cipher.final()`]: #cipherfinaloutputencoding
[`cipher.update()`]: #cipherupdatedata-inputencoding-outputencoding
[`crypto.createCipheriv()`]: #cryptocreatecipherivalgorithm-key-iv-options
[`crypto.createDecipheriv()`]: #cryptocreatedecipherivalgorithm-key-iv-options
[`crypto.createDiffieHellman()`]: #cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding
[`crypto.createECDH()`]: #cryptocreateecdhcurvename
[`crypto.createHash()`]: #cryptocreatehashalgorithm-options
[`crypto.createHmac()`]: #cryptocreatehmacalgorithm-key-options
[`crypto.createPrivateKey()`]: #cryptocreateprivatekeykey
[`crypto.createPublicKey()`]: #cryptocreatepublickeykey
[`crypto.createSecretKey()`]: #cryptocreatesecretkeykey-encoding
[`crypto.createSign()`]: #cryptocreatesignalgorithm-options
[`crypto.createVerify()`]: #cryptocreateverifyalgorithm-options
[`crypto.generateKey()`]: #cryptogeneratekeytype-options-callback
[`crypto.generateKeyPair()`]: #cryptogeneratekeypairtype-options-callback
[`crypto.getCurves()`]: #cryptogetcurves
[`crypto.getDiffieHellman()`]: #cryptogetdiffiehellmangroupname
[`crypto.getFips()`]: #cryptogetfips
[`crypto.getHashes()`]: #cryptogethashes
[`crypto.hash()`]: #cryptohashalgorithm-data-options
[`crypto.privateDecrypt()`]: #cryptoprivatedecryptprivatekey-buffer
[`crypto.privateEncrypt()`]: #cryptoprivateencryptprivatekey-buffer
[`crypto.publicDecrypt()`]: #cryptopublicdecryptkey-buffer
[`crypto.publicEncrypt()`]: #cryptopublicencryptkey-buffer
[`crypto.randomBytes()`]: #cryptorandombytessize-callback
[`crypto.randomFill()`]: #cryptorandomfillbuffer-offset-size-callback
[`crypto.setFips()`]: #cryptosetfipsbool
[`crypto.sign()`]: #cryptosignalgorithm-data-key-callback
[`crypto.verify()`]: #cryptoverifyalgorithm-data-key-signature-callback
[`crypto.webcrypto.getRandomValues()`]: webcrypto.md#cryptogetrandomvaluestypedarray
[`crypto.webcrypto.subtle`]: webcrypto.md#class-subtlecrypto
[`decipher.final()`]: #decipherfinaloutputencoding
[`decipher.update()`]: #decipherupdatedata-inputencoding-outputencoding
[`diffieHellman.generateKeys()`]: #diffiehellmangeneratekeysencoding
[`diffieHellman.setPrivateKey()`]: #diffiehellmansetprivatekeyprivatekey-encoding
[`diffieHellman.setPublicKey()`]: #diffiehellmansetpublickeypublickey-encoding
[`ecdh.generateKeys()`]: #ecdhgeneratekeysencoding-format
[`ecdh.setPrivateKey()`]: #ecdhsetprivatekeyprivatekey-encoding
[`hash.digest()`]: #hashdigestencoding
[`hash.update()`]: #hashupdatedata-inputencoding
[`hmac.digest()`]: #hmacdigestencoding
[`hmac.update()`]: #hmacupdatedata-inputencoding
[`import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[`keyObject.export()`]: #keyobjectexportoptions
[`postMessage()`]: worker_threads.md#portpostmessagevalue-transferlist
[`sign.sign()`]: #signsignprivatekey-outputencoding
[`sign.update()`]: #signupdatedata-inputencoding
[`stream.Writable` options]: stream.md#new-streamwritableoptions
[`stream.transform` options]: stream.md#new-streamtransformoptions
[`util.promisify()`]: util.md#utilpromisifyoriginal
[`verify.update()`]: #verifyupdatedata-inputencoding
[`verify.verify()`]: #verifyverifykey-signature-signatureencoding
[`x509.fingerprint256`]: #x509fingerprint256
[`x509.verify(publicKey)`]: #x509verifypublickey
[argon2]: https://www.rfc-editor.org/rfc/rfc9106.html
[asymmetric key types]: #asymmetric-key-types
[caveats when using strings as inputs to cryptographic APIs]: #using-strings-as-inputs-to-cryptographic-apis
[certificate object]: tls.md#certificate-object
[encoding]: buffer.md#buffers-and-character-encodings
[initialization vector]: https://en.wikipedia.org/wiki/Initialization_vector
[legacy provider]: cli.md#--openssl-legacy-provider
[list of SSL OP Flags]: https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options
[modulo bias]: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias
[safe integers]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
[scrypt]: https://en.wikipedia.org/wiki/Scrypt
[stream]: stream.md
[stream-writable-write]: stream.md#writablewritechunk-encoding-callback
