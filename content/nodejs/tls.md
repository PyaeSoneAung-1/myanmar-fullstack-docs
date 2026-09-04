---
title: "TLS (SSL)"
description: "node:tls module — TLS/SSL လုံခြုံရေး ချိတ်ဆက်မှုများအတွက် — tls.createServer/createSecureContext/connect, tls.TLSSocket, certificates, ALPN/SNI, session resumption စသည်"
order: 138
source: "https://nodejs.org/api/tls.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:tls` module က OpenSSL ပေါ်မှာ တည်ဆောက်ထားတဲ့ Transport Layer Security (TLS) နဲ့ Secure Socket Layer (SSL) protocol တွေရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒီ module ကို အောက်ပါအတိုင်း အသုံးပြုနိုင်ပါတယ်:

```mjs
import tls from 'node:tls';
```

```cjs
const tls = require('node:tls');
```

## Crypto support မရနိုင်တဲ့အခါ ဆုံးဖြတ်ခြင်း (Determining if crypto support is unavailable)

Node.js ကို `node:crypto` module အတွက် support (ပံ့ပိုးမှု) မပါဝင်ဘဲ build လုပ်ထားဖို့ ဖြစ်နိုင်ပါတယ်။ အဲဒီလိုအခြေအနေမျိုးမှာ `tls` ကနေ `import` လုပ်ဖို့ ကြိုးစားတာ သို့မဟုတ် `require('node:tls')` ကို ခေါ်ယူတာက error တစ်ခု throw ဖြစ်စေပါတယ်။

CommonJS ကို သုံးနေတဲ့အခါ throw ဖြစ်လာတဲ့ error ကို try/catch သုံးပြီး ဖမ်းယူနိုင်ပါတယ်:

```cjs
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```

ESM ရဲ့ lexical `import` keyword ကို သုံးတဲ့အခါမှာတော့ — module ကို load လုပ်ဖို့ မကြိုးစားခင် (ဥပမာ — preload module တစ်ခုကို သုံးပြီး) `process.on('uncaughtException')` အတွက် handler တစ်ခုကို ကြိုတင် register လုပ်ထားမှသာ error ကို ဖမ်းယူနိုင်မှာ ဖြစ်ပါတယ်။

ESM ကို သုံးတဲ့အခါ — code က crypto support မပါတဲ့ Node.js build ပေါ်မှာ run ဖြစ်နိုင်တယ်ဆိုရင် lexical `import` keyword အစား [`import()`][] function ကို သုံးစဉ်းစားပါ:

```mjs
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```

## TLS/SSL အခြေခံသဘောတရားများ (TLS/SSL concepts)

TLS/SSL ဆိုတာ client နဲ့ server အကြား လုံခြုံတဲ့ ဆက်သွယ်မှု (secure communication) ကို ဖြစ်နိုင်စေဖို့ public key infrastructure (PKI) ပေါ်မှာ မှီခိုတဲ့ protocol တစ်စုပါ။ အများအားဖြင့် — server တိုင်းမှာ private key တစ်ခု ရှိရပါတယ်။

Private keys တွေကို နည်းလမ်းမျိုးစုံနဲ့ ထုတ်လုပ်နိုင်ပါတယ်။ အောက်က ဥပမာက OpenSSL command-line interface ကို သုံးပြီး 2048-bit RSA private key တစ်ခု ထုတ်လုပ်ပုံကို ဖော်ပြပါတယ်:

```bash
openssl genrsa -out ryans-key.pem 2048
```

TLS/SSL မှာ — server အားလုံး (နဲ့ client တချို့) မှာ _certificate_ ရှိရပါတယ်။ Certificates တွေဆိုတာ private key နဲ့ ကိုက်ညီတဲ့ _public keys_ တွေ ဖြစ်ပြီး — Certificate Authority (CA) တစ်ခု သို့မဟုတ် private key ရဲ့ ပိုင်ရှင်ကိုယ်တိုင် က digital လက်မှတ်ထိုး (digitally sign) ထားပါတယ် (အဲဒီလို certificates တွေကို "self-signed" လို့ ခေါ်ပါတယ်)။ Certificate တစ်ခု ရယူဖို့ ပထမအဆင့်က _Certificate Signing Request_ (CSR) file တစ်ခုကို ဖန်တီးဖို့ ဖြစ်ပါတယ်။

OpenSSL command-line interface ကို သုံးပြီး private key တစ်ခုအတွက် CSR ကို ထုတ်လုပ်နိုင်ပါတယ်:

```bash
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```

CSR file ကို ဖန်တီးပြီးတာနဲ့ — အဲဒါကို လက်မှတ်ထိုးဖို့ Certificate Authority ဆီ ပို့နိုင်သလို၊ self-signed certificate တစ်ခု ထုတ်လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။

OpenSSL command-line interface ကို သုံးပြီး self-signed certificate တစ်ခု ဖန်တီးတာကို အောက်က ဥပမာမှာ ဖော်ပြထားပါတယ်:

```bash
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```

Certificate ကို ထုတ်လုပ်ပြီးတာနဲ့ — အဲဒါကို သုံးပြီး `.pfx` သို့မဟုတ် `.p12` file တစ်ခုကို ထုတ်လုပ်နိုင်ပါတယ်:

```bash
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```

အဲဒီမှာ:

* `in`: က လက်မှတ်ထိုးပြီးသား certificate (signed certificate) ဖြစ်ပါတယ်
* `inkey`: က ဆက်စပ်နေတဲ့ private key ဖြစ်ပါတယ်
* `certfile`: က Certificate Authority (CA) certs အားလုံးကို file တစ်ခုတည်းထဲ ပေါင်းစပ်ထားတာ ဖြစ်ပါတယ် — ဥပမာ `cat ca1-cert.pem ca2-cert.pem > ca-cert.pem`

### ပြီးပြည့်စုံသော forward secrecy (Perfect forward secrecy)

_[forward secrecy][]_ (သို့) _perfect forward secrecy_ ဆိုတဲ့ ဝေါဟာရက key-agreement (ဆိုလိုသည်မှာ key-exchange) method တွေရဲ့ အင်္ဂါရပ် (feature) တစ်ခုကို ဖော်ပြပါတယ်။ ဆိုလိုတာက — server နဲ့ client keys တွေကို သုံးပြီး လက်ရှိ ဆက်သွယ်မှု (communication session) အတွက်သာ သီးသန့် အသုံးပြုမယ့် temporary keys အသစ်တွေကို ညှိနှိုင်း (negotiate) လုပ်ပါတယ်။ လက်တွေ့မှာ ဆိုရင် — server ရဲ့ private key ကို ခိုးယူခံရသည့်တိုင် — session အတွက် သီးသန့် ထုတ်လုပ်ထားတဲ့ key-pair ကို attacker က ရယူနိုင်မှသာ ဆက်သွယ်မှုကို ခိုးနားထောင်သူ (eavesdropper) တွေ က decrypt လုပ်နိုင်မှာ ဖြစ်ပါတယ်။

Perfect forward secrecy ကို TLS/SSL handshake တိုင်းမှာ key-agreement အတွက် key pair တစ်ခုကို ကျပန်း (random) ထုတ်လုပ်ခြင်းအားဖြင့် ရရှိပါတယ် (session အားလုံးအတွက် key တစ်ခုတည်းကို သုံးတာနဲ့ ဆန့်ကျင်ဘက်ပါ)။ ဒီနည်းစနစ်ကို အကောင်အထည်ဖော်တဲ့ method တွေကို "ephemeral" လို့ ခေါ်ပါတယ်။

လက်ရှိမှာ perfect forward secrecy ရရှိဖို့ နည်းလမ်း နှစ်ခုကို အသုံးများပါတယ် (ရိုးရာ အတိုကောက်တွေမှာ ထည့်ထားတဲ့ "E" စာလုံးကို သတိပြုပါ):

* [ECDHE][]: Elliptic Curve Diffie-Hellman key-agreement protocol ရဲ့ ephemeral (ယာယီ) ဗားရှင်း ဖြစ်ပါတယ်။
* [DHE][]: Diffie-Hellman key-agreement protocol ရဲ့ ephemeral (ယာယီ) ဗားရှင်း ဖြစ်ပါတယ်။

ECDHE ကို သုံးတဲ့ perfect forward secrecy က ပုံမှန်အားဖြင့် enable လုပ်ထားပါတယ်။ TLS server တစ်ခု ဖန်တီးတဲ့အခါ `ecdhCurve` option ကို သုံးပြီး — TLSv1.2 နဲ့ အောက်ဗားရှင်းတွေအတွက် ပံ့ပိုးထားတဲ့ ECDH curves စာရင်း၊ TLSv1.3 အတွက် ပံ့ပိုးထားတဲ့ TLS groups စာရင်းတို့ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။ အသေးစိတ်ကို [`tls.createServer()`][] မှာ ကြည့်ပါ။

DHE က ပုံမှန်အားဖြင့် disable လုပ်ထားပြီး — `dhparam` option ကို `'auto'` လို့ သတ်မှတ်ခြင်းအားဖြင့် ECDHE နဲ့တွဲပြီး enable လုပ်နိုင်ပါတယ်။ Custom DHE parameters တွေကိုလည်း ပံ့ပိုးပေမယ့် — အလိုအလျောက် ရွေးချယ်ပေးတဲ့ လူသိများတဲ့ parameters တွေကို ဦးစားပေးတာမို့ custom သုံးတာကို အားမပေးပါဘူး။

Perfect forward secrecy က TLSv1.2 အထိ optional ဖြစ်ခဲ့ပါတယ်။ TLSv1.3 ကစပြီး (EC)DHE ကို အမြဲတမ်း အသုံးပြုပါတယ် (PSK-only connections တွေ ကလွဲရင်)။

### ALPN နဲ့ SNI (ALPN and SNI)

ALPN (Application-Layer Protocol Negotiation Extension) နဲ့ SNI (Server Name Indication) တို့ဟာ TLS handshake extensions တွေ ဖြစ်ပါတယ်:

* ALPN: TLS server တစ်ခုတည်းကို protocol အများအပြား (HTTP, HTTP/2) အတွက် သုံးခွင့် ပြုပါတယ်
* SNI: TLS server တစ်ခုတည်းကို certificate မတူညီတဲ့ hostname အများအပြား အတွက် သုံးခွင့် ပြုပါတယ်

### ကြိုတင်မျှဝေထားသော keys (Pre-shared keys)

TLS-PSK support က ပုံမှန် certificate-based authentication ရဲ့ အခြားရွေးချယ်စရာ (alternative) တစ်ခုအနေနဲ့ ရနိုင်ပါတယ်။ ၎င်းက TLS connection တစ်ခုကို authenticate လုပ်ဖို့ certificates တွေ အစား pre-shared key တစ်ခုကို သုံးပြီး — mutual authentication (နှစ်ဦးနှစ်ဖက် စစ်ဆေးအတည်ပြုခြင်း) ကို ပေးပါတယ်။ TLS-PSK နဲ့ public key infrastructure တို့က တစ်ခုနဲ့တစ်ခု သီးသန့် ဖယ်ထုတ်ထားတာ မဟုတ်ပါဘူး။ Clients ရော servers ပါ နှစ်မျိုးလုံးကို လက်ခံနိုင်ပြီး — ပုံမှန် cipher negotiation အဆင့်မှာ ၎င်းတို့ထဲက တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။

TLS-PSK က ချိတ်ဆက်လာတဲ့ machine တိုင်းနဲ့ key တစ်ခုကို လုံခြုံစွာ မျှဝေဖို့ နည်းလမ်း ရှိနေတဲ့နေရာမျိုးမှာသာ ကောင်းတဲ့ ရွေးချယ်မှု ဖြစ်ပါတယ် — ဒါကြောင့် TLS အသုံးပြုမှု အများစုအတွက် public key infrastructure (PKI) ကို အစားထိုးတာ မဟုတ်ပါဘူး။ OpenSSL ထဲက TLS-PSK implementation က မကြာသေးတဲ့ နှစ်တွေအတွင်း security flaws (လုံခြုံရေး ချို့ယွင်းချက်) တွေ အများအပြား တွေ့ခဲ့ရပါတယ် — အဓိကအားဖြင့် application အနည်းငယ်ကသာ ၎င်းကို သုံးလို့ ဖြစ်ပါတယ်။ PSK ciphers တွေဆီ မပြောင်းခင် အခြားရွေးချယ်စရာ အားလုံးကို ထည့်သွင်း စဉ်းစားပေးပါ။ PSK ကို ထုတ်လုပ်တဲ့အခါ — [RFC 4086][] မှာ ဆွေးနွေးထားသလို — လုံလောက်တဲ့ entropy (ကျပန်းဖြစ်မှု အတိုင်းအတာ) ကို သုံးဖို့ အလွန်အရေးကြီးပါတယ်။ Password သို့မဟုတ် အခြား low-entropy အရင်းအမြစ်တွေကနေ shared secret တစ်ခုကို ဆင်းသက်စေတာက လုံခြုံမှု မရှိပါဘူး။

PSK ciphers တွေက ပုံမှန်အားဖြင့် disable လုပ်ထားပြီး — TLS-PSK ကို သုံးဖို့ဆိုရင် `ciphers` option နဲ့ cipher suite တစ်ခုကို အတိအကျ (explicitly) သတ်မှတ်ပေးဖို့ လိုပါတယ်။ ရနိုင်တဲ့ ciphers စာရင်းကို `openssl ciphers -v 'PSK'` နဲ့ ရယူနိုင်ပါတယ်။ TLS 1.3 ciphers အားလုံးက PSK အတွက် အသုံးပြုနိုင်ပြီး — `openssl ciphers -v -s -tls1_3 -psk` နဲ့ ရယူနိုင်ပါတယ်။ Client connection မှာတော့ — certificate မရှိတဲ့အခါ ပုံမှန် (default) တစ်ခုက အလုပ်မလုပ်လို့ — custom `checkServerIdentity` တစ်ခုကို ထည့်ပေးသင့်ပါတယ်။

[RFC 4279][] အရ — အလျား 128 bytes အထိ ရှိတဲ့ PSK identities တွေနဲ့ အလျား 64 bytes အထိ ရှိတဲ့ PSKs တွေကို ပံ့ပိုးပေးရပါမယ်။ OpenSSL 1.1.0 ကစပြီး maximum identity size က 128 bytes ဖြစ်ပြီး maximum PSK length က 256 bytes ဖြစ်ပါတယ်။

လက်ရှိ implementation က နောက်ခံ OpenSSL API ရဲ့ ကန့်သတ်ချက်တွေကြောင့် asynchronous PSK callbacks တွေကို ပံ့ပိုးမပေးပါဘူး။

TLS-PSK ကို သုံးဖို့ — client ရော server ပါ `pskCallback` option ကို သတ်မှတ်ပေးရပါမယ်။ ၎င်းက သုံးမယ့် PSK ကို ပြန်ပေးတဲ့ function တစ်ခု ဖြစ်ပြီး (ရွေးချယ်ထားတဲ့ cipher ရဲ့ digest နဲ့ ကိုက်ညီရပါမယ်)။

အဲဒါကို client မှာ အရင်ဆုံး ခေါ်ပါလိမ့်မယ်:

* `hint` {string} negotiation လုပ်နေစဉ် ဘယ် identity ကို သုံးရမလဲ ဆုံးဖြတ်ဖို့ client ကို ကူညီဖို့ server ကနေ ပို့လိုက်တဲ့ optional message တစ်ခုပါ။ TLS 1.3 ကို သုံးရင် အမြဲတမ်း `null` ဖြစ်ပါတယ်။
* Returns: {Object} `{ psk: <Buffer|TypedArray|DataView>, identity:  }` (သို့) `null` ပုံစံနဲ့ ပြန်ပေးပါတယ်။

ပြီးတော့ server မှာ ခေါ်ပါတယ်:

* `socket` {tls.TLSSocket} server socket instance ဖြစ်ပြီး `this` နဲ့ တူညီပါတယ်။
* `identity` {string} client ကနေ ပို့လိုက်တဲ့ identity parameter ပါ။
* Returns: {Buffer|TypedArray|DataView} PSK (သို့) `null` ကို ပြန်ပေးပါတယ်။

`null` ကို ပြန်ပေးတာက negotiation လုပ်ငန်းစဉ်ကို ရပ်တန့်စေပြီး — အခြားဘက်ကို `unknown_psk_identity` alert message တစ်ခု ပို့ပေးပါတယ်။ PSK identity ကို မသိခဲ့ကြောင်း server က ဖုံးကွယ်ထားချင်တယ်ဆိုရင် — negotiation မပြီးဆုံးခင် connection ကို `decrypt_error` နဲ့ ကျရှုံးစေဖို့ callback က `psk` အနေနဲ့ random data တစ်ချို့ကို ပေးရပါမယ်။

### Client က အစပြုတဲ့ renegotiation attack ကို လျော့ပါးစေခြင်း (Client-initiated renegotiation attack mitigation)

TLS protocol က client တွေကို TLS session ရဲ့ အချို့သော ကဏ္ဍတွေကို renegotiate (ပြန်လည်ညှိနှိုင်း) လုပ်ခွင့် ပြုပါတယ်။ ကံမကောင်းစွာပဲ — session renegotiation က server-side resources တွေကို အချိုးမညီမျှစွာ (disproportionate) လိုအပ်တာမို့ — denial-of-service attacks တွေအတွက် အလားအလာရှိတဲ့ vector (လမ်းကြောင်း) တစ်ခု ဖြစ်လာနိုင်ပါတယ်။

အဲဒီအန္တရာယ်ကို လျော့ပါးစေဖို့ — renegotiation ကို ဆယ်မိနစ်တိုင်း သုံးကြိမ်အထိ ကန့်သတ်ထားပါတယ်။ အဲဒီကန့်သတ်ချက် ကျော်လွန်သွားတဲ့အခါ [`tls.TLSSocket`][] instance ပေါ်မှာ `'error'` event တစ်ခု emit လုပ်ပါတယ်။ ကန့်သတ်ချက်တွေကို ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်:

* `tls.CLIENT_RENEG_LIMIT` {number} renegotiation request တွေရဲ့ အရေအတွက်ကို သတ်မှတ်ပါတယ်။ **Default:** `3`။
* `tls.CLIENT_RENEG_WINDOW` {number} renegotiation window ရဲ့ အချိန် စက္ကန့်ပိုင်းကို သတ်မှတ်ပါတယ်။ **Default:** `600` (10 မိနစ်)။

ပုံမှန် renegotiation ကန့်သတ်ချက်တွေကို — ၎င်းတို့ရဲ့ သက်ရောက်မှုတွေနဲ့ အန္တရာယ်တွေကို အပြည့်အဝ နားလည်ထားခြင်းမရှိဘဲ ပြုပြင်မွမ်းမံ မလုပ်သင့်ပါဘူး။

TLSv1.3 က renegotiation ကို ပံ့ပိုးမပေးပါဘူး။

### Session ပြန်လည်အသုံးပြုခြင်း (Session resumption)

TLS session တစ်ခုကို ထူထောင်တာက အတော်လေး နှေးကွေးနိုင်ပါတယ်။ Session state ကို သိမ်းဆည်းပြီး နောက်ပိုင်းမှာ ပြန်လည်အသုံးပြုခြင်းအားဖြင့် အဲဒီလုပ်ငန်းစဉ်ကို မြန်ဆန်စေနိုင်ပါတယ်။ အဲဒီလို လုပ်ဖို့ ယန္တရား (mechanism) အများအပြား ရှိပြီး — အဟောင်းဆုံးကနေ အသစ်ဆုံး (နဲ့ ဦးစားပေးရမယ့်) အစီအစဉ်အတိုင်း ဒီမှာ ဆွေးနွေးသွားပါမယ်။

#### Session identifier များ (Session identifiers)

Servers တွေက connection အသစ်တွေအတွက် unique ID တစ်ခုကို ထုတ်လုပ်ပြီး client ဆီ ပို့ပေးပါတယ်။ Clients ရော servers ပါ session state ကို သိမ်းဆည်းပါတယ်။ ပြန်လည်ချိတ်ဆက်တဲ့အခါ — clients တွေက သိမ်းထားတဲ့ session state ရဲ့ ID ကို ပို့ပြီး — server မှာလည်း အဲဒီ ID အတွက် state ရှိနေရင် ၎င်းကို သုံးဖို့ သဘောတူနိုင်ပါတယ်။ မရှိဘူးဆိုရင်တော့ server က session အသစ်တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။ အသေးစိတ်ကို [RFC 2246][] မှာ ကြည့်ပါ — စာမျက်နှာ 23 နဲ့ 30\. တို့ပါ။

Session identifiers တွေကို သုံးပြီး ပြန်လည်အသုံးပြုခြင်း (resumption) ကို HTTPS requests တွေ လုပ်တဲ့အခါ web browsers အများစုက ပံ့ပိုးပေးပါတယ်။

Node.js မှာတော့ — clients တွေက session data ရဖို့ [`'session'`][] event ကို စောင့်ပြီး — session ကို ပြန်သုံးဖို့ နောက် [`tls.connect()`][] တစ်ခုရဲ့ `session` option မှာ အဲဒီ data ကို ထည့်ပေးပါတယ်။ Servers တွေက session data တွေကို session ID ကို lookup key အဖြစ် သုံးပြီး သိမ်းဆည်း/ပြန်ယူနိုင်ဖို့ — [`'newSession'`][] နဲ့ [`'resumeSession'`][] events တွေအတွက် handlers တွေ အကောင်အထည်ဖော်ပေးရပါမယ်။ Load balancers (သို့) cluster workers တွေ အကြား session တွေကို ပြန်သုံးနိုင်ဖို့ — servers တွေက သူတို့ရဲ့ session handlers တွေထဲမှာ shared session cache (Redis လိုမျိုး) တစ်ခုကို သုံးရပါမယ်။

#### Session ticket များ (Session tickets)

Servers တွေက session state တစ်ခုလုံးကို encrypt လုပ်ပြီး "ticket" အနေနဲ့ client ဆီ ပို့ပေးပါတယ်။ ပြန်လည်ချိတ်ဆက်တဲ့အခါ — အဲဒီ state ကို ကနဦး connection ထဲမှာ server ဆီ ပြန်ပို့ပေးပါတယ်။ ဒီယန္တရားက server-side session cache တစ်ခု လိုအပ်ချက်ကို ရှောင်ရှားပေးပါတယ်။ Server က ticket ကို ဘယ်အကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် မသုံးဘူးဆိုရင် (decrypt လုပ်လို့ မရတာ၊ အရမ်းဟောင်းသွားတာ စသဖြင့်) — session အသစ်တစ်ခုကို ဖန်တီးပြီး ticket အသစ်တစ်ခု ပို့ပေးပါလိမ့်မယ်။ အသေးစိတ်ကို [RFC 5077][] မှာ ကြည့်ပါ။

Session tickets တွေကို သုံးပြီး ပြန်လည်အသုံးပြုခြင်းကို HTTPS requests တွေ လုပ်တဲ့အခါ web browsers အများအပြားမှာ အသုံးများလာပါတယ်။

Node.js မှာတော့ — clients တွေက session identifiers နဲ့ ပြန်သုံးတာရော session tickets နဲ့ ပြန်သုံးတာရော API တွေကို အတူတူပဲ သုံးပါတယ်။ Debugging (အမှားရှာဖွေခြင်း) အတွက် — [`tls.TLSSocket.getTLSTicket()`][] က တန်ဖိုးတစ်ခု ပြန်ပေးရင် session data ထဲမှာ ticket ပါဝင်ပြီး — မပြန်ပေးရင်တော့ client-side session state ပါဝင်ပါတယ်။

TLSv1.3 နဲ့ဆိုရင် — server က tickets အများအပြား ပို့နိုင်တာကြောင့် `'session'` events အများအပြား ဖြစ်ပေါ်နိုင်တာကို သတိပြုပါ — အသေးစိတ်ကို [`'session'`][] မှာ ကြည့်ပါ။

Single process server တွေက session tickets သုံးဖို့ သီးခြား implementation တစ်ခုခု မလိုအပ်ပါဘူး။ Server restarts (သို့) load balancers တွေ အကြား session tickets တွေကို သုံးနိုင်ဖို့ — servers တွေ အားလုံးမှာ ticket keys အတူတူ ရှိရပါမယ်။ အတွင်းပိုင်းမှာ 16-byte keys သုံးခု ရှိပေမယ့် — အဆင်ပြေစေဖို့ tls API က ၎င်းတို့ကို 48-byte buffer တစ်ခုတည်းအနေနဲ့ ထုတ်ဖော်ပေးပါတယ်။

Ticket keys တွေကို server instance တစ်ခုပေါ်မှာ [`server.getTicketKeys()`][] ကို ခေါ်ပြီး ရယူကာ ဖြန့်ဝေဖို့ ဖြစ်နိုင်ပေမယ့် — ပိုပြီး ကျိုးကြောင်းဆီလျော်တာက လုံခြုံတဲ့ random data 48 bytes ကို လုံခြုံစွာ ထုတ်လုပ်ပြီး [`tls.createServer()`][] ရဲ့ `ticketKeys` option နဲ့ သတ်မှတ်တာ ဖြစ်ပါတယ်။ Keys တွေကို ပုံမှန် ပြန်လည်ထုတ်လုပ်ပေးသင့်ပြီး — server ရဲ့ keys တွေကို [`server.setTicketKeys()`][] နဲ့ ပြန်လည်သတ်မှတ်နိုင်ပါတယ်။

Session ticket keys တွေက cryptographic keys တွေ ဖြစ်ပြီး — ၎င်းတို့ကို **လုံခြုံစွာ သိမ်းဆည်းထားရမည်**။ TLS 1.2 နဲ့ အောက်မှာ — ၎င်းတို့ ခိုးယူခံရရင် အဲဒီ keys တွေနဲ့ encrypt လုပ်ထားတဲ့ tickets တွေကို သုံးထားတဲ့ sessions တွေ အားလုံးကို decrypt လုပ်နိုင်ပါတယ်။ ၎င်းတို့ကို disk ပေါ်မှာ သိမ်းဆည်းမထားသင့်ဘဲ — ပုံမှန် ပြန်လည်ထုတ်လုပ်ပေးသင့်ပါတယ်။

Clients တွေက tickets အတွက် support ရှိကြောင်း ကြေညာရင် server က ၎င်းတို့ကို ပို့ပေးပါလိမ့်မယ်။ Server က `secureOptions` ထဲမှာ `require('node:constants').SSL_OP_NO_TICKET` ကို ထည့်ပေးခြင်းအားဖြင့် tickets တွေကို disable လုပ်နိုင်ပါတယ်။

Session identifiers တွေရော session tickets တွေပါ timeout ဖြစ်တတ်ပြီး — server ကို session အသစ်တွေ ဖန်တီးစေပါတယ်။ အဲဒီ timeout ကို [`tls.createServer()`][] ရဲ့ `sessionTimeout` option နဲ့ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။

ယန္တရား အားလုံးအတွက် — resumption ကျရှုံးတဲ့အခါ servers တွေက session အသစ်တွေကို ဖန်တီးပါလိမ့်မယ်။ Session ကို ပြန်လည်အသုံးပြုဖို့ ကျရှုံးတာက TLS/HTTPS connection ကို ကျရှုံးစေတာ မဟုတ်တာမို့ — မလိုအပ်ဘဲ ညံ့ဖျင်းတဲ့ TLS performance ကို သတိမထားမိဘဲ နေတတ်ပါတယ်။ Servers တွေ session တွေကို ပြန်လည်အသုံးပြုနေလား ဆိုတာ စစ်ဆေးဖို့ OpenSSL CLI ကို သုံးနိုင်ပါတယ်။ ဥပမာ — `openssl s_client` မှာ `-reconnect` option ကို သုံးပါ:

```bash
openssl s_client -connect localhost:443 -reconnect
```

Debug output တွေကို ဖတ်ကြည့်ပါ။ ပထမဆုံး connection က "New" လို့ ပြသသင့်ပြီး — ဥပမာ:

```text
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

နောက် connections တွေကတော့ "Reused" လို့ ပြသသင့်ပါတယ် — ဥပမာ:

```text
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Default TLS cipher suite ကို ပြုပြင်ခြင်း (Modifying the default TLS cipher suite)

Node.js ကို enable/disable လုပ်ထားတဲ့ TLS ciphers တွေရဲ့ ပုံမှန် suite တစ်ခုနဲ့အတူ build လုပ်ထားပါတယ်။ ဒီပုံမှန် cipher list ကို Node.js build လုပ်တဲ့အခါ ပြင်ဆင်သတ်မှတ်နိုင်ပြီး — distributions (ဖြန့်ချီမှုများ) တွေက ကိုယ်ပိုင် default list တွေ ပေးနိုင်ဖို့ ဖြစ်ပါတယ်။

ပုံမှန် cipher suite ကို ပြသဖို့ အောက်ပါ command ကို သုံးနိုင်ပါတယ်:

```console
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```

ဒီပုံမှန် တန်ဖိုးကို [`--tls-cipher-list`][] command-line switch နဲ့ (တိုက်ရိုက်ဖြစ်စေ၊ [`NODE_OPTIONS`][] environment variable ကနေဖြစ်စေ) လုံးဝ အစားထိုးနိုင်ပါတယ်။ ဥပမာ — အောက်ပါအတိုင်း လုပ်ရင် `ECDHE-RSA-AES128-GCM-SHA256:!RC4` ကို ပုံမှန် TLS cipher suite အဖြစ် သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်:

```bash
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```

စစ်ဆေးဖို့ — သတ်မှတ်ထားတဲ့ cipher list ကို ပြသဖို့ အောက်ပါ command ကို သုံးပြီး — `defaultCoreCipherList` နဲ့ `defaultCipherList` အကြား ကွာခြားချက်ကို သတိပြုပါ:

```bash
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```

ဆိုလိုတာက — `defaultCoreCipherList` list ကို compile လုပ်ချိန်မှာ သတ်မှတ်ပြီး — `defaultCipherList` ကို runtime မှာ သတ်မှတ်ပါတယ်။

Runtime အတွင်းကနေ ပုံမှန် cipher suites တွေကို ပြုပြင်ဖို့ — `tls.DEFAULT_CIPHERS` variable ကို ပြုပြင်ပါ။ ၎င်းကို sockets တွေပေါ်မှာ listen မလုပ်ခင် လုပ်ဆောင်ရပါမယ် — ဖွင့်ပြီးသား sockets တွေကိုတော့ သက်ရောက်မှု ရှိမှာ မဟုတ်ပါဘူး။ ဥပမာ:

```js
// Remove Obsolete CBC Ciphers and RSA Key Exchange based Ciphers as they don't provide Forward Secrecy
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```

ပုံမှန် တန်ဖိုးကို client (သို့) server တစ်ခုချင်းစီ အလိုက်လည်း — [`tls.createSecureContext()`][] ကနေ ရတဲ့ `ciphers` option ကို သုံးပြီး အစားထိုးနိုင်ပါတယ်။ အဲဒီ option က [`tls.createServer()`][], [`tls.connect()`][] နဲ့ [`tls.TLSSocket`][] အသစ်တွေ ဖန်တီးတဲ့အခါတွေမှာလည်း ရနိုင်ပါတယ်။

Ciphers list ထဲမှာ TLSv1.3 cipher suite names တွေ (`'TLS_'` နဲ့ စတင်တဲ့ နာမည်တွေ) ရော — TLSv1.2 နဲ့ အောက် cipher suites တွေအတွက် သတ်မှတ်ချက် (specifications) တွေပါ ရောနှောပါဝင်နိုင်ပါတယ်။ TLSv1.2 ciphers တွေက legacy specification format ကို ပံ့ပိုးပေးပြီး — အသေးစိတ်အတွက် OpenSSL ရဲ့ [cipher list format][] documentation ကို တိုင်ပင်ပါ — ဒါပေမယ့် အဲဒီ specifications တွေက TLSv1.3 ciphers တွေကိုတော့ သက်ရောက်မှု မရှိပါဘူး။ TLSv1.3 suites တွေကို ၎င်းတို့ရဲ့ နာမည်အပြည့်အစုံကို cipher list ထဲမှာ ထည့်သွင်းခြင်းဖြင့်သာ enable လုပ်နိုင်ပါတယ်။ ဥပမာ — legacy TLSv1.2 `'EECDH'` (သို့) `'!EECDH'` specification တွေကို သုံးပြီးတော့ ၎င်းတို့ကို enable/disable လုပ်လို့ မရပါဘူး။

TLSv1.3 နဲ့ TLSv1.2 cipher suites တွေရဲ့ ဆွေမျိုး အစီအစဉ် (relative order) ဘယ်လိုပဲ ရှိရှိ — TLSv1.3 protocol က TLSv1.2 ထက် သိသိသာသာ ပိုလုံခြုံပြီး — handshake က ၎င်းကို ပံ့ပိုးကြောင်း ညွှန်ပြပြီး TLSv1.3 cipher suites တစ်ခုခု enable လုပ်ထားရင် TLSv1.2 ထက် အမြဲတမ်း ရွေးချယ်ခံရပါလိမ့်မယ်။

Node.js ထဲမှာ ပါဝင်တဲ့ ပုံမှန် cipher suite ကို — လက်ရှိ security best practices တွေနဲ့ risk mitigation (အန္တရာယ် လျော့ပါးရေး) တွေကို ထင်ဟပ်စေဖို့ ဂရုတစိုက် ရွေးချယ်ထားပါတယ်။ ပုံမှန် cipher suite ကို ပြောင်းလဲတာက application တစ်ခုရဲ့ လုံခြုံရေးအပေါ် သိသာတဲ့ သက်ရောက်မှု ရှိနိုင်ပါတယ်။ `--tls-cipher-list` switch နဲ့ `ciphers` option ကို — လုံးဝ မလိုအပ်ဘဲနဲ့တော့ မသုံးသင့်ပါဘူး။

ပုံမှန် cipher suite က [Chrome's 'modern cryptography' setting][] အတွက် GCM ciphers တွေကို ဦးစားပေးပြီး — perfect forward secrecy အတွက် ECDHE နဲ့ DHE ciphers တွေကိုလည်း ဦးစားပေးပါတယ် — တစ်ချိန်တည်းမှာ backward compatibility (နောက်ကြောင်း လိုက်ဖက်မှု) တစ်ချို့ကိုလည်း ပေးထားပါတယ်။

လုံခြုံမှု မရှိတော့တဲ့ (insecure) နဲ့ ခေတ်ကုန်နေတဲ့ (deprecated) RC4 (သို့) DES-based ciphers တွေကို မှီခိုနေတဲ့ ရှေးဟောင်း clients တွေ (Internet Explorer 6 လိုမျိုး) က ပုံမှန် configuration နဲ့ handshaking လုပ်ငန်းစဉ်ကို မပြီးမြောက်နိုင်ပါဘူး။ အဲဒီ clients တွေကို ထောက်ပံ့ပေးဖို့ မဖြစ်မနေ လိုအပ်တယ်ဆိုရင် — [TLS recommendations][] မှာ လိုက်ဖက်ညီတဲ့ cipher suite တစ်ခု ပါနိုင်ပါတယ်။ Format အကြောင်း အသေးစိတ်အတွက် OpenSSL ရဲ့ [cipher list format][] documentation ကို ကြည့်ပါ။

TLSv1.3 cipher suites တွေက ငါးခုပဲ ရှိပါတယ်:

* `'TLS_AES_256_GCM_SHA384'`
* `'TLS_CHACHA20_POLY1305_SHA256'`
* `'TLS_AES_128_GCM_SHA256'`
* `'TLS_AES_128_CCM_SHA256'`
* `'TLS_AES_128_CCM_8_SHA256'`

ပထမ သုံးခုက ပုံမှန်အားဖြင့် enable လုပ်ထားပါတယ်။ `CCM`-based suites နှစ်ခုကို — ကန့်သတ်ထားတဲ့ (constrained) systems တွေပေါ်မှာ performance ပိုကောင်းနိုင်လို့ TLSv1.3 က ပံ့ပိုးပေးပေမယ့် — ၎င်းတို့က လုံခြုံရေး ပိုနည်းတာမို့ ပုံမှန်အားဖြင့် enable လုပ်မထားပါဘူး။

## OpenSSL ၏ security level (OpenSSL security level)

OpenSSL library က cryptographic operations တွေအတွက် အနည်းဆုံး လက်ခံနိုင်တဲ့ လုံခြုံရေး အဆင့်ကို ထိန်းချုပ်ဖို့ security levels တွေကို ကျင့်သုံးပါတယ်။ OpenSSL ရဲ့ security levels တွေက 0 ကနေ 5 အထိ ရှိပြီး — level တစ်ခုချင်းစီက ပိုတင်းကျပ်တဲ့ security လိုအပ်ချက်တွေကို သတ်မှတ်ပါတယ်။ ပုံမှန် security level က 2 ဖြစ်ပြီး — ခေတ်မီ application အများစုအတွက် ယေဘုယျအားဖြင့် သင့်လျော်ပါတယ်။ ဒါပေမယ့် TLSv1 လိုမျိုး legacy features နဲ့ protocols တချို့က ကောင်းကောင်း အလုပ်လုပ်ဖို့ ပိုနိမ့်တဲ့ security level (`SECLEVEL=0`) လိုအပ်ပါတယ်။ ပိုပြီး အသေးစိတ် သိချင်ရင် — security levels အကြောင်း [OpenSSL documentation on security levels][] ကို ကိုးကားပါ။

### Security levels သတ်မှတ်ခြင်း (Setting security levels)

သင့် Node.js application ထဲမှာ security level ကို ချိန်ညှိဖို့ — cipher string တစ်ခုအတွင်းမှာ `@SECLEVEL=X` ကို ထည့်သွင်းနိုင်ပါတယ်။ အဲဒီမှာ `X` က လိုချင်တဲ့ security level ဖြစ်ပါတယ်။ ဥပမာ — ပုံမှန် OpenSSL cipher list ကို သုံးနေစဉ် security level ကို 0 အဖြစ် သတ်မှတ်ချင်ရင် အောက်ပါအတိုင်း လုပ်နိုင်ပါတယ်:

```mjs
import { createServer, connect } from 'node:tls';
import { readFileSync } from 'node:fs';
const port = 8000;

createServer({
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
  ciphers: 'DEFAULT@SECLEVEL=0',
  minVersion: 'TLSv1',
}, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, {
    ciphers: 'DEFAULT@SECLEVEL=0',
    minVersion: 'TLSv1',
    maxVersion: 'TLSv1',
    ca: [ readFileSync('server-cert.pem') ],
  });
});
```

```cjs
const { createServer, connect } = require('node:tls');
const { readFileSync } = require('node:fs');
const port = 8000;

createServer({
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
  ciphers: 'DEFAULT@SECLEVEL=0',
  minVersion: 'TLSv1',
}, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, {
    ciphers: 'DEFAULT@SECLEVEL=0',
    minVersion: 'TLSv1',
    maxVersion: 'TLSv1',
    ca: [ readFileSync('server-cert.pem') ],
  });
});
```

ဒီနည်းလမ်းက security level ကို 0 အဖြစ် သတ်မှတ်ပေးပြီး — ပုံမှန် OpenSSL ciphers တွေကို ဆက်သုံးနေရင်း legacy features တွေကို အသုံးပြုခွင့် ပေးပါတယ်။

ဒီဥပမာအတွက် certificate နဲ့ key ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run ပါ:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```

### Using [`--tls-cipher-list`][]

[Modifying the default TLS cipher suite][] မှာ ဖော်ပြထားသလို — command line ကနေလည်း `--tls-cipher-list=DEFAULT@SECLEVEL=X` ကို သုံးပြီး security level နဲ့ ciphers တွေကို သတ်မှတ်နိုင်ပါတယ်။ ဒါပေမယ့် ciphers တွေ သတ်မှတ်ဖို့ command line option ကို သုံးတာက ယေဘုယျအားဖြင့် အားမပေးလိုက်ပါဘူး — သင့် application code ထဲမှာ context တစ်ခုချင်းစီအတွက် ciphers တွေကို သတ်မှတ်တာက ပိုကောင်းပါတယ်။ အကြောင်းကတော့ ဒီနည်းက ပိုမို တိကျတဲ့ ထိန်းချုပ်မှုကို ပေးပြီး — security level ကို တစ်ကမ္ဘာလုံး အနှံ့ နှိမ့်ချလိုက်တဲ့ အန္တရာယ်ကို လျှော့ချပေးလို့ ဖြစ်ပါတယ်။

## X509 certificate error code များ (X509 certificate error codes)

OpenSSL က သတင်းပို့တဲ့ certificate errors တွေကြောင့် function အများအပြား ကျရှုံးနိုင်ပါတယ်။ အဲဒီလိုအခြေအနေမျိုးမှာ — function က ၎င်း၏ callback ကနေ {Error} တစ်ခုကို ပေးပါတယ်။ အဲဒီ {Error} မှာ `code` ဆိုတဲ့ property ပါပြီး — အောက်ပါ တန်ဖိုးတွေထဲက တစ်ခုကို ယူနိုင်ပါတယ်:

* `'UNABLE_TO_GET_ISSUER_CERT'`: Issuer certificate ကို ရယူနိုင်ခြင်း မရှိပါ။
* `'UNABLE_TO_GET_CRL'`: Certificate ရဲ့ CRL ကို ရယူနိုင်ခြင်း မရှိပါ။
* `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Certificate ရဲ့ signature ကို decrypt လုပ်နိုင်ခြင်း မရှိပါ။
* `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: CRL ရဲ့ signature ကို decrypt လုပ်နိုင်ခြင်း မရှိပါ။
* `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Issuer ရဲ့ public key ကို decode လုပ်နိုင်ခြင်း မရှိပါ။
* `'CERT_SIGNATURE_FAILURE'`: Certificate ရဲ့ signature မှားယွင်းနေပါတယ်။
* `'CRL_SIGNATURE_FAILURE'`: CRL ရဲ့ signature မှားယွင်းနေပါတယ်။
* `'CERT_NOT_YET_VALID'`: Certificate က အသက်မဝင်သေးပါဘူး။
* `'CERT_HAS_EXPIRED'`: Certificate ရဲ့ သက်တမ်း ကုန်ဆုံးသွားပါပြီ။
* `'CRL_NOT_YET_VALID'`: CRL က အသက်မဝင်သေးပါဘူး။
* `'CRL_HAS_EXPIRED'`: CRL ရဲ့ သက်တမ်း ကုန်ဆုံးသွားပါပြီ။
* `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Certificate ရဲ့ notBefore field ထဲမှာ format error ရှိနေပါတယ်။
* `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Certificate ရဲ့ notAfter field ထဲမှာ format error ရှိနေပါတယ်။
* `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: CRL ရဲ့ lastUpdate field ထဲမှာ format error ရှိနေပါတယ်။
* `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: CRL ရဲ့ nextUpdate field ထဲမှာ format error ရှိနေပါတယ်။
* `'OUT_OF_MEM'`: Memory ကုန်သွားပါပြီ။
* `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Self-signed certificate ဖြစ်ပါတယ်။
* `'SELF_SIGNED_CERT_IN_CHAIN'`: Certificate chain ထဲမှာ self-signed certificate ပါဝင်နေပါတယ်။
* `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Local issuer certificate ကို ရယူနိုင်ခြင်း မရှိပါ။
* `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: ပထမဆုံး certificate ရဲ့ signature ကို verify လုပ်နိုင်ခြင်း မရှိပါ။
* `'CERT_CHAIN_TOO_LONG'`: Certificate chain အရမ်း ရှည်လျားနေပါတယ်။
* `'CERT_REVOKED'`: Certificate ကို ပြန်ရုပ်သိမ်း (revoke) လုပ်ထားပါတယ်။
* `'INVALID_CA'`: CA certificate မမှန်ကန်ပါဘူး။
* `'PATH_LENGTH_EXCEEDED'`: Path length ကန့်သတ်ချက် ကျော်လွန်နေပါတယ်။
* `'INVALID_PURPOSE'`: ပံ့ပိုးမထားတဲ့ certificate purpose ဖြစ်ပါတယ်။
* `'CERT_UNTRUSTED'`: Certificate ကို ယုံကြည်မှု မရှိပါဘူး။
* `'CERT_REJECTED'`: Certificate ကို ပယ်ချလိုက်ပါတယ်။
* `'HOSTNAME_MISMATCH'`: Hostname နဲ့ မကိုက်ညီပါဘူး။

`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, `DEPTH_ZERO_SELF_SIGNED_CERT` (သို့) `UNABLE_TO_GET_ISSUER_CERT` လိုမျိုး certificate errors တွေ ဖြစ်ပေါ်တဲ့အခါ — Node.js က root CA ကို locally install လုပ်ထားရင် `--use-system-ca` flag နဲ့ run ကြည့်ဖို့ အကြံပြုချက် (hint) တစ်ခုကို ထည့်ပေးပါတယ် — developer တွေကို လုံခြုံတဲ့ ဖြေရှင်းနည်းဆီ ညွှန်ပြပြီး မလုံခြုံတဲ့ workarounds တွေကို တားဆီးဖို့ ဖြစ်ပါတယ်။

## Class: `tls.Server`

* Extends: {net.Server}

TLS (သို့) SSL ကို သုံးတဲ့ encrypted connections တွေကို လက်ခံပါတယ်။

### Event: `'connection'`

* `socket` {stream.Duplex}

TCP stream အသစ်တစ်ခု ထူထောင်လိုက်တဲ့အခါ — TLS handshake မစတင်ခင် — ဒီ event ကို emit လုပ်ပါတယ်။ `socket` က ပုံမှန်အားဖြင့် [`net.Socket`][] အမျိုးအစားရဲ့ object တစ်ခု ဖြစ်ပေမယ့် — [`net.Server`][] ရဲ့ `'connection'` event ကနေ ဖန်တီးတဲ့ socket နဲ့ မတူဘဲ events တွေကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး။ ပုံမှန်အားဖြင့် user တွေက ဒီ event ကို ဝင်ရောက်ကြည့်ရှုချင် မှာ မဟုတ်ပါဘူး။

User တွေက TLS server ထဲကို connections တွေ ထည့်သွင်းဖို့ (inject) ဒီ event ကို ကိုယ်တိုင် (explicitly) emit လုပ်နိုင်ပါတယ်။ အဲဒီလိုအခြေအနေမျိုးမှာ [`Duplex`][] stream တစ်ခုခုကို ထည့်သွင်းပေးနိုင်ပါတယ်။

### Event: `'keylog'`

* `line` {Buffer} NSS `SSLKEYLOGFILE` format နဲ့ ဖြစ်တဲ့ ASCII text ရဲ့ စာကြောင်း (line) တစ်ကြောင်းပါ။
* `tlsSocket` {tls.TLSSocket} ၎င်းကို ထုတ်လုပ်လိုက်တဲ့ `tls.TLSSocket` instance ပါ။

ဒီ server ဆီကို connection တစ်ခုက key material တွေ ထုတ်လုပ်တာ (သို့) လက်ခံရရှိတဲ့အခါ `keylog` event ကို emit လုပ်ပါတယ် (ပုံမှန်အားဖြင့် handshake မပြီးဆုံးခင် ဖြစ်ပေမယ့် — အမြဲတော့ မဟုတ်ပါဘူး)။ ဒီ keying material တွေကို debugging (အမှားရှာဖွေခြင်း) အတွက် သိမ်းဆည်းထားနိုင်ပါတယ် — အကြောင်းကတော့ ၎င်းက ဖမ်းယူထားတဲ့ (captured) TLS traffic တွေကို decrypt လုပ်ခွင့် ပေးလို့ ဖြစ်ပါတယ်။ Socket တစ်ခုချင်းစီအတွက် အကြိမ်များစွာ emit လုပ်နိုင်ပါတယ်။

ပုံမှန် အသုံးပြုမှု ပုံစံတစ်ခုက — လက်ခံရရှိတဲ့ lines တွေကို text file တစ်ခုထဲကို ထပ်ထည့် (append) လုပ်တာ ဖြစ်ပါတယ်။ အဲဒီ file ကို နောက်ပိုင်းမှာ traffic တွေကို decrypt လုပ်ဖို့ software (Wireshark လိုမျိုး) က သုံးပါတယ်:

```js
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Only log keys for a particular IP
  logFile.write(line);
});
```

### Event: `'newSession'`

TLS session အသစ်တစ်ခု ဖန်တီးလိုက်တဲ့အခါ `'newSession'` event ကို emit လုပ်ပါတယ်။ ၎င်းကို sessions တွေကို external storage ထဲမှာ သိမ်းဆည်းဖို့ သုံးနိုင်ပါတယ်။ အဲဒီ data ကို [`'resumeSession'`][] callback ဆီ ထည့်ပေးရပါမယ်။

Listener callback ကို ခေါ်တဲ့အခါ argument သုံးခု ထည့်ပေးပါတယ်:

* `sessionId` {Buffer} TLS session identifier ပါ
* `sessionData` {Buffer} TLS session data ပါ
* `callback` {Function} Argument မယူတဲ့ callback function တစ်ခု ဖြစ်ပြီး — secure connection ပေါ်မှာ data တွေ ပို့ဖို့ (သို့) လက်ခံဖို့ ခေါ်ယူပေးရပါမယ်။

ဒီ event ကို နားထောင်ခြင်း (listening) က event listener ထည့်သွင်းပြီးမှ ထူထောင်တဲ့ connections တွေအပေါ်မှာသာ သက်ရောက်မှု ရှိပါတယ်။

### Event: `'OCSPRequest'`

Client က certificate status request တစ်ခု ပို့တဲ့အခါ `'OCSPRequest'` event ကို emit လုပ်ပါတယ်။ Listener callback ကို ခေါ်တဲ့အခါ argument သုံးခု ထည့်ပေးပါတယ်:

* `certificate` {Buffer} Server ရဲ့ certificate ပါ
* `issuer` {Buffer} Issuer ရဲ့ certificate ပါ
* `callback` {Function} OCSP request ရဲ့ ရလဒ်တွေကို ပေးဖို့ ခေါ်ယူပေးရမယ့် callback function တစ်ခုပါ။

Server ရဲ့ လက်ရှိ certificate ကို parse လုပ်ပြီး OCSP URL နဲ့ certificate ID ကို ရယူနိုင်ပါတယ်။ OCSP response တစ်ခု ရရှိပြီးတာနဲ့ — `callback(null, resp)` ကို ခေါ်ပါတယ်။ အဲဒီမှာ `resp` က OCSP response ပါဝင်တဲ့ `Buffer` instance တစ်ခုပါ။ `certificate` ရော `issuer` ပါ — primary နဲ့ issuer ရဲ့ certificates တွေရဲ့ `Buffer` DER-representations တွေ ဖြစ်ပါတယ်။ ၎င်းတို့ကို OCSP certificate ID နဲ့ OCSP endpoint URL ရယူဖို့ သုံးနိုင်ပါတယ်။

တနည်းအားဖြင့် — OCSP response မရှိဘူးဆိုတာ ညွှန်ပြဖို့ `callback(null, null)` ကို ခေါ်နိုင်ပါတယ်။

`callback(err)` ကို ခေါ်တာက `socket.destroy(err)` ခေါ်ဆိုမှု တစ်ခုကို ဖြစ်စေပါတယ်။

OCSP request တစ်ခုရဲ့ ပုံမှန် စီးဆင်းပုံ (flow) ကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

1. Client က server ဆီ ချိတ်ဆက်ပြီး `'OCSPRequest'` တစ်ခုကို ပို့ပါတယ် (ClientHello ထဲက status info extension ကနေတဆင့်)။
2. Server က request ကို လက်ခံရရှိပြီး `'OCSPRequest'` event ကို emit လုပ်ကာ — listener register လုပ်ထားရင် ၎င်းကို ခေါ်ပါတယ်။
3. Server က `certificate` (သို့) `issuer` ထဲကနေ OCSP URL ကို ထုတ်ယူပြီး CA ဆီကို [OCSP request][] တစ်ခု လုပ်ဆောင်ပါတယ်။
4. Server က CA ကနေ `'OCSPResponse'` ကို လက်ခံရရှိပြီး `callback` argument ကနေတဆင့် client ဆီ ပြန်ပို့ပေးပါတယ်
5. Client က response ကို စစ်ဆေးအတည်ပြုပြီး — socket ကို destroy လုပ်တာ သို့မဟုတ် handshake တစ်ခုကို လုပ်ဆောင်ပါတယ်

Certificate က self-signed ဖြစ်နေရင် (သို့) issuer က root certificates စာရင်းထဲမှာ မရှိဘူးဆိုရင် `issuer` က `null` ဖြစ်နိုင်ပါတယ်။ (TLS connection ထူထောင်တဲ့အခါ `ca` option ကနေတဆင့် issuer တစ်ခုကို ပေးနိုင်ပါတယ်။)

ဒီ event ကို နားထောင်ခြင်းက event listener ထည့်သွင်းပြီးမှ ထူထောင်တဲ့ connections တွေအပေါ်မှာသာ သက်ရောက်မှု ရှိပါတယ်။

Certificates တွေကို parse လုပ်ဖို့ [asn1.js][] လိုမျိုး npm module တစ်ခုကို သုံးနိုင်ပါတယ်။

### Event: `'resumeSession'`

Client က ယခင် TLS session တစ်ခုကို ပြန်လည်အသုံးပြုဖို့ (resume) တောင်းဆိုတဲ့အခါ `'resumeSession'` event ကို emit လုပ်ပါတယ်။ Listener callback ကို ခေါ်တဲ့အခါ argument နှစ်ခု ထည့်ပေးပါတယ်:

* `sessionId` {Buffer} TLS session identifier ပါ
* `callback` {Function} ယခင် session ကို ပြန်လည်ရရှိပြီးတဲ့အခါ ခေါ်ရမယ့် callback function တစ်ခုပါ: `callback([err[, sessionData]])`
  * `err` {Error}
  * `sessionData` {Buffer}

Event listener က ပေးထားတဲ့ `sessionId` ကို သုံးပြီး — [`'newSession'`][] event handler က သိမ်းဆည်းထားတဲ့ `sessionData` ကို external storage ထဲမှာ ရှာဖွေသင့်ပါတယ်။ တွေ့ရှိရင် session ကို ပြန်လည်အသုံးပြုဖို့ `callback(null, sessionData)` ကို ခေါ်ပါ။ မတွေ့ရှိရင် session ကို ပြန်လည်အသုံးပြုလို့ မရပါဘူး။ Handshake ကို ဆက်လုပ်နိုင်ပြီး session အသစ်တစ်ခု ဖန်တီးနိုင်ဖို့ — `sessionData` မပါဘဲ `callback()` ကို ခေါ်ရပါမယ်။ ဝင်လာတဲ့ connection ကို အဆုံးသတ်ပြီး socket ကို destroy လုပ်ဖို့ `callback(err)` ကို ခေါ်နိုင်ပါတယ်။

ဒီ event ကို နားထောင်ခြင်းက event listener ထည့်သွင်းပြီးမှ ထူထောင်တဲ့ connections တွေအပေါ်မှာသာ သက်ရောက်မှု ရှိပါတယ်။

အောက်ပါအတိုင်း TLS session တစ်ခုကို ပြန်လည်အသုံးပြုတာကို ဖော်ပြထားပါတယ်:

```js
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```

### Event: `'secureConnection'`

Connection အသစ်တစ်ခုအတွက် handshaking လုပ်ငန်းစဉ် အောင်မြင်စွာ ပြီးဆုံးပြီးတဲ့အခါ `'secureConnection'` event ကို emit လုပ်ပါတယ်။ Listener callback ကို ခေါ်တဲ့အခါ argument တစ်ခုတည်း ထည့်ပေးပါတယ်:

* `tlsSocket` {tls.TLSSocket} ထူထောင်ပြီးသား TLS socket ပါ။

`tlsSocket.authorized` property က — client ကို server အတွက် ထောက်ပံ့ပေးထားတဲ့ Certificate Authorities တွေထဲက တစ်ခုက verify လုပ်ထားခြင်း ရှိ/မရှိ ဖော်ပြတဲ့ `boolean` တစ်ခုပါ။ `tlsSocket.authorized` က `false` ဖြစ်ရင် — authorization ဘယ်လို ကျရှုံးခဲ့တယ်ဆိုတာ ဖော်ပြဖို့ `socket.authorizationError` ကို သတ်မှတ်ပေးပါတယ်။ TLS server ရဲ့ ဆက်တင်တွေပေါ် မူတည်ပြီး — ခွင့်ပြုချက်မရှိတဲ့ (unauthorized) connections တွေကို ဆက်လက် လက်ခံနိုင်ပါသေးတယ်။

ဘယ် server name ကို တောင်းဆိုခဲ့တယ်၊ ဘယ် protocol ကို ညှိနှိုင်းခဲ့တယ်ဆိုတာ စစ်ဆေးဖို့ — [`tls.TLSSocket.servername`][] နဲ့ [`tls.TLSSocket.alpnProtocol`][] properties တွေကို သုံးနိုင်ပါတယ်။

### Event: `'tlsClientError'`

Secure connection တစ်ခု မထူထောင်ခင် error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ `'tlsClientError'` event ကို emit လုပ်ပါတယ်။ Listener callback ကို ခေါ်တဲ့အခါ argument နှစ်ခု ထည့်ပေးပါတယ်:

* `exception` {Error} Error ကို ဖော်ပြတဲ့ `Error` object ပါ
* `tlsSocket` {tls.TLSSocket} Error စတင် ဖြစ်ပေါ်ခဲ့တဲ့ `tls.TLSSocket` instance ပါ။

### `server.addContext(hostname, context)`

* `hostname` {string} SNI host name တစ်ခု (သို့) wildcard (ဥပမာ — `'*'`) ဖြစ်ပါတယ်
* `context` {Object|tls.SecureContext} [`tls.createSecureContext()`][] ရဲ့ `options` arguments တွေထဲက ဖြစ်နိုင်တဲ့ properties တွေ ပါဝင်တဲ့ object တစ်ခု (ဥပမာ — `key`, `cert`, `ca` စသည်) သို့မဟုတ် [`tls.createSecureContext()`][] နဲ့ ကိုယ်တိုင် ဖန်တီးထားတဲ့ TLS context object တစ်ခု ဖြစ်ပါတယ်။

`server.addContext()` method က — client request ရဲ့ SNI name က ပေးထားတဲ့ `hostname` (သို့) wildcard နဲ့ ကိုက်ညီရင် သုံးမယ့် secure context တစ်ခုကို ထည့်သွင်းပေးပါတယ်။

ကိုက်ညီတဲ့ contexts အများအပြား ရှိနေတဲ့အခါ — နောက်ဆုံး ထည့်သွင်းထားတဲ့ တစ်ခုကို သုံးပါတယ်။

### `server.address()`

* Returns: {Object}

Operating system က သတင်းပို့တဲ့အတိုင်း — server ရဲ့ bound address, address family name နဲ့ port တို့ကို ပြန်ပေးပါတယ်။ အသေးစိတ်ကို [`net.Server.address()`][] မှာ ကြည့်ပါ။

### `server.close([callback])`

* `callback` {Function} Server instance ရဲ့ `'close'` event ကို နားထောင်ဖို့ register လုပ်မယ့် listener callback တစ်ခုပါ။
* Returns: {tls.Server}

`server.close()` method က server ကို connections အသစ်တွေ လက်ခံခြင်းမှ ရပ်တန့်စေပါတယ်။

ဒီ function က asynchronous အနေနဲ့ အလုပ်လုပ်ပါတယ်။ Server မှာ ပွင့်နေတဲ့ connections တွေ မရှိတော့တဲ့အခါ `'close'` event ကို emit လုပ်ပါလိမ့်မယ်။

### `server.getTicketKeys()`

* Returns: {Buffer} Session ticket keys တွေ ပါဝင်တဲ့ 48-byte buffer တစ်ခုပါ။

Session ticket keys တွေကို ပြန်ပေးပါတယ်။

အသေးစိတ်ကို [Session Resumption][] မှာ ကြည့်ပါ။

### `server.listen()`

Server ကို encrypted connections တွေ နားထောင်ဖို့ စတင်ပါတယ်။ ဒီ method က [`net.Server`][] ရဲ့ [`server.listen()`][] နဲ့ တူညီပါတယ်။

### `server.setSecureContext(options)`

* `options` {Object} [`tls.createSecureContext()`][] ရဲ့ `options` arguments တွေထဲက ဖြစ်နိုင်တဲ့ properties တွေ ပါဝင်တဲ့ object တစ်ခုပါ (ဥပမာ — `key`, `cert`, `ca` စသည်)။

`server.setSecureContext()` method က ရှိပြီးသား server တစ်ခုရဲ့ secure context ကို အစားထိုးပါတယ်။ Server ဆီကို ရှိပြီးသား connections တွေကိုတော့ အနှောင့်အယှက် မဖြစ်စေပါဘူး။

### `server.setTicketKeys(keys)`

* `keys` {Buffer|TypedArray|DataView} Session ticket keys တွေ ပါဝင်တဲ့ 48-byte buffer တစ်ခုပါ။

Session ticket keys တွေကို သတ်မှတ်ပေးပါတယ်။

Ticket keys တွေရဲ့ အပြောင်းအလဲတွေက နောင်မှ ချိတ်ဆက်မယ့် server connections တွေအပေါ်မှာသာ သက်ရောက်မှု ရှိပါတယ်။ ရှိပြီးသား (သို့) လက်ရှိ ဆိုင်းငံ့နေတဲ့ server connections တွေက ယခင် keys တွေကို သုံးပါလိမ့်မယ်။

အသေးစိတ်ကို [Session Resumption][] မှာ ကြည့်ပါ။

## Class: `tls.TLSSocket`

* Extends: {net.Socket}

ရေးသားလိုက်တဲ့ data တွေကို transparent (ပွင့်လင်းမြင်သာစွာ) encrypt လုပ်ခြင်းနဲ့ လိုအပ်တဲ့ TLS negotiation အားလုံးကို လုပ်ဆောင်ပါတယ်။

`tls.TLSSocket` ရဲ့ instances တွေက duplex [Stream][] interface ကို အကောင်အထည်ဖော်ပါတယ်။

TLS connection metadata တွေကို ပြန်ပေးတဲ့ methods တွေ (ဥပမာ — [`tls.TLSSocket.getPeerCertificate()`][]) က connection ဖွင့်ထားစဉ်မှာသာ data တွေကို ပြန်ပေးပါလိမ့်မယ်။

### `new tls.TLSSocket(socket[, options])`

* `socket` {net.Socket|stream.Duplex} Server ဘက်မှာဆိုရင် `Duplex` stream တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ Client ဘက်မှာတော့ [`net.Socket`][] ရဲ့ instance တစ်ခုခု ဖြစ်ပါတယ် (client ဘက်မှာ ယေဘုယျ `Duplex` stream support ရဖို့ [`tls.connect()`][] ကို သုံးရပါမယ်)။
* `options` {Object}
  * `enableTrace`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `isServer`: SSL/TLS protocol က asymmetrical (အချိုးမညီ) ဖြစ်တာမို့ — TLSSockets တွေက ကိုယ့်ကိုယ်ကိုယ် server အနေနဲ့လား client အနေနဲ့လား ပြုမူရမယ်ဆိုတာ သိထားရပါမယ်။ `true` ဆိုရင် TLS socket ကို server အဖြစ် instantiate လုပ်ပါလိမ့်မယ်။ **Default:** `false`။
  * `server` {net.Server} [`net.Server`][] instance တစ်ခုပါ။
  * `requestCert`: Remote peer ကို certificate တစ်ခု တောင်းခံခြင်းအားဖြင့် authenticate လုပ်မလား ဆိုတာ သတ်မှတ်ပါတယ်။ Clients တွေက server certificate တစ်ခုကို အမြဲတမ်း တောင်းခံပါတယ်။ Servers တွေ (`isServer` က true ဖြစ်ရင်) က client certificate တစ်ခု တောင်းခံဖို့ `requestCert` ကို true အဖြစ် သတ်မှတ်နိုင်ပါတယ်။
  * `rejectUnauthorized`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `ALPNProtocols`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `SNICallback`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `ALPNCallback`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `session` {Buffer} TLS session တစ်ခု ပါဝင်တဲ့ `Buffer` instance တစ်ခုပါ။
  * `requestOCSP` {boolean} `true` ဆိုရင် — OCSP status request extension ကို client hello ထဲမှာ ထည့်သွင်းပြီး — secure communication မထူထောင်ခင် socket ပေါ်မှာ `'OCSPResponse'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်
  * `secureContext`: [`tls.createSecureContext()`][] နဲ့ ဖန်တီးထားတဲ့ TLS context object ပါ။ `secureContext` ကို မပေးထားဘူးဆိုရင် — `options` object တစ်ခုလုံးကို `tls.createSecureContext()` ဆီ ပေးပို့ပြီး context တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ်။
  * ...: `secureContext` option မရှိနေရင် သုံးမယ့် [`tls.createSecureContext()`][] options တွေပါ။ မရှိရင် ၎င်းတို့ကို လျစ်လျူရှုပါတယ်။

ရှိပြီးသား TCP socket တစ်ခုကနေ `tls.TLSSocket` object အသစ်တစ်ခုကို တည်ဆောက်ပါတယ်။

### Event: `'keylog'`

* `line` {Buffer} NSS `SSLKEYLOGFILE` format နဲ့ ဖြစ်တဲ့ ASCII text ရဲ့ စာကြောင်း (line) တစ်ကြောင်းပါ။

Socket က key material တွေ ထုတ်လုပ်တာ (သို့) လက်ခံရရှိတဲ့အခါ `keylog` event ကို `tls.TLSSocket` ပေါ်မှာ emit လုပ်ပါတယ်။ ဒီ keying material တွေကို debugging (အမှားရှာဖွေခြင်း) အတွက် သိမ်းဆည်းထားနိုင်ပါတယ် — အကြောင်းကတော့ ၎င်းက ဖမ်းယူထားတဲ့ TLS traffic တွေကို decrypt လုပ်ခွင့် ပေးလို့ ဖြစ်ပါတယ်။ Handshake မပြီးဆုံးခင် ဖြစ်စေ ပြီးဆုံးပြီးနောက် ဖြစ်စေ — အကြိမ်များစွာ emit လုပ်နိုင်ပါတယ်။

ပုံမှန် အသုံးပြုမှု ပုံစံတစ်ခုက — လက်ခံရရှိတဲ့ lines တွေကို text file တစ်ခုထဲကို ထပ်ထည့် (append) လုပ်တာ ဖြစ်ပါတယ်။ အဲဒီ file ကို နောက်ပိုင်းမှာ traffic တွေကို decrypt လုပ်ဖို့ software (Wireshark လိုမျိုး) က သုံးပါတယ်:

```js
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```

### Event: `'OCSPResponse'`

`tls.TLSSocket` ကို ဖန်တီးတဲ့အခါ `requestOCSP` option ကို သတ်မှတ်ထားပြီး — OCSP response တစ်ခု လက်ခံရရှိခဲ့ရင် `'OCSPResponse'` event ကို emit လုပ်ပါတယ်။ Listener callback ကို ခေါ်တဲ့အခါ argument တစ်ခုတည်း ထည့်ပေးပါတယ်:

* `response` {Buffer} Server ရဲ့ OCSP response ပါ

ပုံမှန်အားဖြင့် `response` က server ရဲ့ CA ကနေ digital လက်မှတ်ထိုးထားတဲ့ object တစ်ခု ဖြစ်ပြီး — server ရဲ့ certificate ရဲ့ revocation status (ပြန်ရုပ်သိမ်းမှု အခြေအနေ) အကြောင်း အချက်အလက် ပါဝင်ပါတယ်။

### Event: `'secure'`

TLS handshake အောင်မြင်စွာ ပြီးဆုံးပြီး — secure connection တစ်ခု ထူထောင်ပြီးတဲ့အခါ `'secure'` event ကို emit လုပ်ပါတယ်။

ဒီ event ကို client ရော server ရဲ့ {tls.TLSSocket} instances နှစ်ခုလုံးပေါ်မှာ — `new tls.TLSSocket()` constructor နဲ့ ဖန်တီးထားတဲ့ sockets တွေ အပါအဝင် — emit လုပ်ပါတယ်။

### Event: `'secureConnect'`

Connection အသစ်တစ်ခုအတွက် handshaking လုပ်ငန်းစဉ် အောင်မြင်စွာ ပြီးဆုံးပြီးတဲ့အခါ `'secureConnect'` event ကို emit လုပ်ပါတယ်။ Server ရဲ့ certificate ကို ခွင့်ပြုချက် (authorize) ရခဲ့လား မရခဲ့ဘူးလား ဆိုတာ မသက်ဆိုင်ဘဲ — Listener callback ကို ခေါ်ပါလိမ့်မယ်။ Server certificate ကို သတ်မှတ်ထားတဲ့ CAs တွေထဲက တစ်ခုက လက်မှတ်ထိုးထားလား ဆိုတာ ဆုံးဖြတ်ဖို့ — `tlsSocket.authorized` property ကို စစ်ဆေးတာက client ရဲ့ တာဝန်ပါ။ `tlsSocket.authorized === false` ဆိုရင် — `tlsSocket.authorizationError` property ကို စစ်ဆေးခြင်းအားဖြင့် error ကို ရှာတွေ့နိုင်ပါတယ်။ ALPN ကို သုံးခဲ့ရင် — ညှိနှိုင်းပြီးသား protocol ကို ဆုံးဖြတ်ဖို့ `tlsSocket.alpnProtocol` property ကို စစ်ဆေးနိုင်ပါတယ်။

`new tls.TLSSocket()` constructor နဲ့ {tls.TLSSocket} တစ်ခုကို ဖန်တီးတဲ့အခါ `'secureConnect'` event ကို emit လုပ်တာ မဟုတ်ပါဘူး။

### Event: `'session'`

* `session` {Buffer}

Session အသစ်တစ်ခု (သို့) TLS ticket တစ်ခု ရနိုင်တဲ့အခါ client `tls.TLSSocket` တစ်ခုပေါ်မှာ `'session'` event ကို emit လုပ်ပါတယ်။ ညှိနှိုင်းပြီးသား TLS protocol ဗားရှင်းပေါ် မူတည်ပြီး — ဒါက handshake မပြီးဆုံးခင် ဖြစ်နိုင်သလို ပြီးဆုံးပြီးမှလည်း ဖြစ်နိုင်ပါတယ်။ ဒီ event ကို server ပေါ်မှာတော့ emit လုပ်မှာ မဟုတ်ပါဘူး။ ဒါ့အပြင် — ဥပမာ connection ကို resume လုပ်ခဲ့လို့ — session အသစ်တစ်ခု မဖန်တီးခဲ့ရင်လည်း emit လုပ်မှာ မဟုတ်ပါဘူး။ TLS protocol ဗားရှင်း တချို့အတွက် ဒီ event ကို အကြိမ်များစွာ emit လုပ်နိုင်ပြီး — အဲဒီအခါ sessions အားလုံးကို resumption အတွက် သုံးနိုင်ပါတယ်။

Client ဘက်မှာ — connection ကို resume လုပ်ဖို့ `session` ကို [`tls.connect()`][] ရဲ့ `session` option ထဲမှာ ထည့်ပေးနိုင်ပါတယ်။

အသေးစိတ်ကို [Session Resumption][] မှာ ကြည့်ပါ။

TLSv1.2 နဲ့ အောက်အတွက် — handshake ပြီးဆုံးတာနဲ့ [`tls.TLSSocket.getSession()`][] ကို ခေါ်နိုင်ပါတယ်။ TLSv1.3 အတွက်တော့ — protocol အရ ticket-based resumption ကိုသာ ခွင့်ပြုပြီး — tickets အများအပြား ပို့ပေးကာ — tickets တွေကို handshake ပြီးဆုံးပြီးမှသာ ပို့ပေးပါတယ်။ ဒါကြောင့် resume လုပ်လို့ရတဲ့ session တစ်ခု ရဖို့ `'session'` event ကို စောင့်ဆိုင်းဖို့ လိုအပ်ပါတယ်။ Applications တွေက TLS ဗားရှင်း အားလုံးမှာ အလုပ်လုပ်ဖို့ သေချာစေရန် `getSession()` အစား `'session'` event ကို သုံးသင့်ပါတယ်။ Session တစ်ခုကိုသာ ရယူ/သုံးဖို့ မျှော်လင့်ထားတဲ့ applications တွေက ဒီ event ကို တစ်ကြိမ်တည်းသာ နားထောင်သင့်ပါတယ်:

```js
tlsSocket.once('session', (session) => {
  // The session can be used immediately or later.
  tls.connect({
    session: session,
    // Other connect options...
  });
});
```

### `tlsSocket.address()`

* Returns: {Object}

Operating system က သတင်းပို့တဲ့အတိုင်း — အောက်ခံ socket ရဲ့ bound `address`, address `family` နာမည် နဲ့ `port` တို့ကို ပြန်ပေးပါတယ်: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`။

### `tlsSocket.alpnProtocol`

* Type: {string|boolean|null}

ညှိနှိုင်းပြီးသား ALPN protocol ပါ။ Handshake မပြီးဆုံးခင် ဒါက `null` ဖြစ်ပါတယ်။ Handshake ပြီးဆုံးတာနဲ့ — ညှိနှိုင်းပြီးသား protocol နာမည် သို့မဟုတ် — peers တွေက ALPN protocol တစ်ခုကို မညှိနှိုင်းခဲ့ဘူးဆိုရင် `false` အဖြစ် သတ်မှတ်ပါတယ်။

### `tlsSocket.authorizationError`

Peer ရဲ့ certificate ကို ဘာကြောင့် verify မလုပ်နိုင်ခဲ့သလဲ ဆိုတဲ့ အကြောင်းရင်းကို ပြန်ပေးပါတယ်။ ဒီ property ကို `tlsSocket.authorized === false` ဖြစ်တဲ့အခါမှသာ သတ်မှတ်ပေးပါတယ်။

### `tlsSocket.authorized`

* Type: {boolean}

`tls.TLSSocket` instance ကို ဖန်တီးတဲ့အခါ သတ်မှတ်ထားတဲ့ CAs တွေထဲက တစ်ခုက peer certificate ကို လက်မှတ်ထိုးထားရင် ဒီ property က `true` ဖြစ်ပြီး — မဟုတ်ရင် `false` ဖြစ်ပါတယ်။

Peer certificate ကို TLS handshake အပြည့်အစုံ လုပ်တဲ့အခါမှသာ verify လုပ်ပါတယ်။ ယခင် session တစ်ခုကို resume လုပ်ပြီး connection ထူထောင်တဲ့အခါ (see [Session Resumption][]) — verification ကို ထပ်မလုပ်ပါဘူး။ မူလ handshake မှာ client က certificate တစ်ခု တင်ပြခဲ့ရင် — `authorized` နဲ့ `authorizationError` တို့က session နဲ့အတူ သိမ်းဆည်းထားတဲ့ ရလဒ်ကို — verification error တွေ အပါအဝင် — သယ်ဆောင်ပေးပါတယ်။ TLS 1.3 မှာ — certificate လုံးဝ မပို့ခဲ့တဲ့ client တစ်ခုက session တစ်ခုကို resume လုပ်ပြီး `authorized` ကို `true` အဖြစ် သတင်းပို့နိုင်ပြီး — [`tls.TLSSocket.getPeerCertificate()`][] က empty object တစ်ခုကို ပြန်ပေးပါတယ်။ `rejectUnauthorized: false` နဲ့ clients တွေကို ကိုယ်တိုင် authorize လုပ်တဲ့ servers တွေက ဒါကြောင့် [`tls.TLSSocket.isSessionReused()`][] ကိုရော — peer certificate တစ်ခု ရှိနေခြင်း ရှိမရှိကိုပါ စစ်ဆေးသင့်ပါတယ်။

### `tlsSocket.disableRenegotiation()`

ဒီ `TLSSocket` instance အတွက် TLS renegotiation ကို disable လုပ်ပါတယ်။ ခေါ်လိုက်တာနဲ့ — renegotiate လုပ်ဖို့ ကြိုးစားမှုတွေက `TLSSocket` ပေါ်မှာ `'error'` event တစ်ခုကို trigger လုပ်ပါလိမ့်မယ်။

### `tlsSocket.enableTrace()`

Enable လုပ်ထားရင် — TLS packet trace information တွေကို `stderr` ဆီ ရေးသားပါတယ်။ ၎င်းကို TLS connection ပြဿနာတွေကို debug လုပ်ဖို့ သုံးနိုင်ပါတယ်။

Output ရဲ့ ပုံစံက `openssl s_client -trace` (သို့) `openssl s_server -trace` ရဲ့ output နဲ့ တူညီပါတယ်။ ၎င်းကို OpenSSL ရဲ့ `SSL_trace()` function က ထုတ်လုပ်ပေးပေမယ့် — ဒီ format က မှတ်တမ်းမပြုထားဘဲ — အသိပေးစရာမလိုဘဲ ပြောင်းလဲနိုင်ပြီး — အားကိုးအားထားမပြုသင့်ပါဘူး။

### `tlsSocket.encrypted`

အမြဲတမ်း `true` ကို ပြန်ပေးပါတယ်။ ၎င်းကို TLS sockets တွေနဲ့ ပုံမှန် `net.Socket` instances တွေကို ခွဲခြားသိဖို့ သုံးနိုင်ပါတယ်။

### `tlsSocket.exportKeyingMaterial(length, label[, context])`

* `length` {number} keying material ကနေ ရယူရမယ့် bytes အရေအတွက်ပါ

* `label` {string} application အတွက် သီးသန့် (specific) label တစ်ခု ဖြစ်ပြီး — ပုံမှန်အားဖြင့် [IANA Exporter Label Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels) ကနေ ရတဲ့ တန်ဖိုးတစ်ခု ဖြစ်ပါတယ်။

* `context` {Buffer} Context တစ်ခုကို ထည့်ပေးနိုင်ပါတယ် (optional)။

* Returns: {Buffer} keying material ရဲ့ တောင်းဆိုထားတဲ့ bytes များပါ

Keying material ကို network protocols တွေထဲမှာ မတူညီတဲ့ attack အမျိုးမျိုးကို တားဆီးဖို့ validations တွေ လုပ်ရာမှာ သုံးပါတယ် — ဥပမာ IEEE 802.1X ရဲ့ specifications တွေထဲမှာ ဖြစ်ပါတယ်။

ဥပမာ (Example)

```js
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Example return value of keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```

အသေးစိတ်ကို OpenSSL ရဲ့ [`SSL_export_keying_material`][] documentation မှာ ကြည့်ပါ။

### `tlsSocket.getCertificate()`

* Returns: {Object}

Local certificate ကို ကိုယ်စားပြုတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးတဲ့ object မှာ certificate ရဲ့ fields တွေနဲ့ ကိုက်ညီတဲ့ properties တချို့ ပါဝင်ပါတယ်။

Certificate ရဲ့ ဖွဲ့စည်းပုံ ဥပမာတစ်ခုအတွက် [`tls.TLSSocket.getPeerCertificate()`][] ကို ကြည့်ပါ။

Local certificate မရှိဘူးဆိုရင် empty object တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Socket ကို destroy လုပ်ထားပြီးဆိုရင် `null` ကို ပြန်ပေးပါလိမ့်မယ်။

### `tlsSocket.getCipher()`

* Returns: {Object}
  * `name` {string} Cipher suite အတွက် OpenSSL နာမည်ပါ။
  * `standardName` {string} Cipher suite အတွက် IETF နာမည်ပါ။
  * `version` {string} ဒီ cipher suite က ပံ့ပိုးတဲ့ အနိမ့်ဆုံး TLS protocol ဗားရှင်းပါ။ လက်တွေ့ ညှိနှိုင်းပြီးသား protocol အတွက်တော့ [`tls.TLSSocket.getProtocol()`][] ကို ကြည့်ပါ။

ညှိနှိုင်းပြီးသား cipher suite အကြောင်း အချက်အလက် ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

ဥပမာ — AES256-SHA cipher နဲ့ တွဲတဲ့ TLSv1.2 protocol တစ်ခုအတွက်:

```json
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```

အသေးစိတ်ကို [SSL\_CIPHER\_get\_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name.html) မှာ ကြည့်ပါ။

### `tlsSocket.getEphemeralKeyInfo()`

* Returns: {Object}

Client connection တစ်ခုပေါ်မှာ [perfect forward secrecy][] အတွက် ephemeral key agreement ကို ဖော်ပြတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ Key agreement က ephemeral မဟုတ်ရင် empty object တစ်ခုကို ပြန်ပေးပါတယ်။ ဒါက client socket ပေါ်မှာသာ ပံ့ပိုးပေးတာမို့ — server socket ပေါ်မှာ ခေါ်ရင် `null` ကို ပြန်ပေးပါတယ်။ ပံ့ပိုးထားတဲ့ types တွေက `'DH'`, `'ECDH'` နဲ့ `'TLSGroup'` တို့ ဖြစ်ပါတယ်။ `'DH'` နဲ့ `'ECDH'` အတွက် — object က peer ရဲ့ temporary key parameters တွေကို ဖော်ပြပါတယ်။ `'TLSGroup'` အတွက် — peer temporary key object မရနိုင်တဲ့အခါ key agreement အတွက် သုံးတဲ့ ညှိနှိုင်းပြီးသား TLS Supported Group ကို object က ဖော်ထုတ်ပေးပါတယ်။

`name` property က type က `'ECDH'` (သို့) `'TLSGroup'` ဖြစ်တဲ့အခါမှသာ ရနိုင်ပါတယ်။ `size` property က type က `'TLSGroup'` ဖြစ်တဲ့အခါ မရနိုင်ပါဘူး။ `'TLSGroup'` အတွက် — `name` က ညှိနှိုင်းပြီးသား TLS Supported Group ရဲ့ နာမည် ဖြစ်ပါတယ်။ စံသတ်မှတ်ထားတဲ့ TLS group names တွေနဲ့ code points တွေကို [IANA TLS Supported Groups registry][] မှာ စာရင်းပြုစုထားပါတယ်။

ဥပမာ: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`။

### `tlsSocket.getFinished()`

* Returns: {Buffer|undefined} SSL/TLS handshake ရဲ့ တစ်စိတ်တစ်ပိုင်းအဖြစ် socket ဆီ ပို့ပြီးသား နောက်ဆုံး `Finished` message ပါ — `Finished` message တစ်ခုမှ မပို့ရသေးရင် `undefined` ပါ။

`Finished` messages တွေက handshake တစ်ခုလုံးရဲ့ message digests တွေ ဖြစ်တာမို့ (TLS 1.0 အတွက် စုစုပေါင်း 192 bits ဖြစ်ပြီး SSL 3.0 အတွက် ပိုများပါတယ်) — SSL/TLS က ပေးတဲ့ authentication ကို မလိုချင်တဲ့အခါ (သို့) မလုံလောက်တဲ့အခါ external authentication procedures တွေအတွက် ၎င်းတို့ကို သုံးနိုင်ပါတယ်။

OpenSSL ထဲက `SSL_get_finished` routine နဲ့ ကိုက်ညီပြီး — [RFC 5929][] ကနေ `tls-unique` channel binding ကို အကောင်အထည်ဖော်ဖို့ သုံးနိုင်ပါတယ်။

### `tlsSocket.getPeerCertificate([detailed])`

* `detailed` {boolean} `true` ဆိုရင် certificate chain အပြည့်အစုံ ထည့်သွင်းပြီး — မဟုတ်ရင် peer ရဲ့ certificate ကိုသာ ထည့်သွင်းပါတယ်။
* Returns: {Object} Certificate object တစ်ခုပါ။

Peer ရဲ့ certificate ကို ကိုယ်စားပြုတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ Peer က certificate တစ်ခု မပေးဘူးဆိုရင် empty object တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Socket ကို destroy လုပ်ထားပြီးဆိုရင် `null` ကို ပြန်ပေးပါလိမ့်မယ်။

Certificate chain အပြည့်အစုံကို တောင်းဆိုခဲ့ရင် — certificate တစ်ခုချင်းစီမှာ ၎င်း၏ issuer ရဲ့ certificate ကို ကိုယ်စားပြုတဲ့ object တစ်ခု ပါဝင်တဲ့ `issuerCertificate` property တစ်ခု ပါဝင်ပါလိမ့်မယ်။

#### Certificate object ၏ properties များ (Certificate object)

Certificate object တစ်ခုမှာ certificate ရဲ့ fields တွေနဲ့ ကိုက်ညီတဲ့ properties တွေ ပါဝင်ပါတယ်။

* `ca` {boolean} Certificate Authority (CA) ဖြစ်ရင် `true` — မဟုတ်ရင် `false` ပါ။
* `raw` {Buffer} DER encoded X.509 certificate data ပါ။
* `subject` {Object} Certificate ရဲ့ subject ဖြစ်ပြီး — Country (`C`), StateOrProvince (`ST`), Locality (`L`), Organization (`O`), OrganizationalUnit (`OU`) နဲ့ CommonName (`CN`) တို့နဲ့ ဖော်ပြပါတယ်။ CommonName က TLS certificates တွေမှာ ပုံမှန်အားဖြင့် DNS name တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`။
* `issuer` {Object} Certificate ရဲ့ issuer ဖြစ်ပြီး — `subject` မှာ ဖော်ပြတဲ့ ဝေါဟာရတွေနဲ့ပဲ ဖော်ပြပါတယ်။
* `valid_from` {string} Certificate က စတင် အကျုံးဝင်တဲ့ ရက်စွဲ-အချိန် (date-time) ပါ။
* `valid_to` {string} Certificate က အကျုံးဝင်မှု ကုန်ဆုံးတဲ့ ရက်စွဲ-အချိန် (date-time) ပါ။
* `serialNumber` {string} Certificate ရဲ့ serial number ဖြစ်ပြီး — hex string တစ်ခုပါ။ ဥပမာ: `'B9B0D332A1AA5635'`။
* `fingerprint` {string} DER encoded certificate ရဲ့ SHA-1 digest ပါ။ `:` နဲ့ ပိုင်းခြားထားတဲ့ hexadecimal string အဖြစ် ပြန်ပေးပါတယ်။ ဥပမာ: `'2A:7A:C2:DD:...'`။
* `fingerprint256` {string} DER encoded certificate ရဲ့ SHA-256 digest ပါ။ `:` နဲ့ ပိုင်းခြားထားတဲ့ hexadecimal string အဖြစ် ပြန်ပေးပါတယ်။ ဥပမာ: `'2A:7A:C2:DD:...'`။
* `fingerprint512` {string} DER encoded certificate ရဲ့ SHA-512 digest ပါ။ `:` နဲ့ ပိုင်းခြားထားတဲ့ hexadecimal string အဖြစ် ပြန်ပေးပါတယ်။ ဥပမာ: `'2A:7A:C2:DD:...'`။
* `ext_key_usage` {Array} (Optional) Extended key usage ဖြစ်ပြီး — OIDs တစ်စု ပါဝင်ပါတယ်။
* `subjectaltname` {string} (Optional) Subject အတွက် ပေါင်းစပ်ထားတဲ့ (concatenated) နာမည်တွေ ပါဝင်တဲ့ string တစ်ခုပါ — `subject` နာမည်တွေရဲ့ အခြားရွေးချယ်စရာတစ်ခု ဖြစ်ပါတယ်။
* `infoAccess` {Array} (Optional) AuthorityInfoAccess ကို ဖော်ပြတဲ့ array တစ်ခုဖြစ်ပြီး — OCSP နဲ့တွဲ သုံးပါတယ်။
* `issuerCertificate` {Object} (Optional) Issuer certificate object ပါ။ Self-signed certificates တွေအတွက်ဆိုရင် — ဒါက circular reference (သူ့ဘာသာသူ ပြန်ညွှန်းနေတာ) ဖြစ်နိုင်ပါတယ်။

Certificate ထဲမှာ key type ပေါ် မူတည်ပြီး public key အကြောင်း အချက်အလက်တွေလည်း ပါဝင်နိုင်ပါတယ်။

RSA keys တွေအတွက် အောက်ပါ properties တွေ သတ်မှတ်နိုင်ပါတယ်:

* `bits` {number} RSA bit size ပါ။ ဥပမာ: `1024`။
* `exponent` {string} RSA exponent ဖြစ်ပြီး — hexadecimal number notation နဲ့ string တစ်ခုပါ။ ဥပမာ: `'0x010001'`။
* `modulus` {string} RSA modulus ဖြစ်ပြီး — hexadecimal string တစ်ခုပါ။ ဥပမာ: `'B56CE45CB7...'`။
* `pubkey` {Buffer} Public key ပါ။

EC keys တွေအတွက် အောက်ပါ properties တွေ သတ်မှတ်နိုင်ပါတယ်:

* `pubkey` {Buffer} Public key ပါ။
* `bits` {number} Key ရဲ့ bits နဲ့ တိုင်းတဲ့ အရွယ်အစား ဖြစ်ပါတယ်။ ဥပမာ: `256`။
* `asn1Curve` {string} (Optional) Elliptic curve ရဲ့ OID အတွက် ASN.1 နာမည် ဖြစ်ပါတယ်။ လူသိများတဲ့ curves တွေကို OID တစ်ခုနဲ့ ခွဲခြားသတ်မှတ်ပါတယ်။ ရှားပါးပေမယ့် — curve ကို ၎င်းရဲ့ သင်္ချာ ဂုဏ်သတ္တိတွေနဲ့ ခွဲခြားသတ်မှတ်တာလည်း ဖြစ်နိုင်ပြီး — အဲဒီအခါမျိုးမှာ OID ရှိမှာ မဟုတ်ပါဘူး။ ဥပမာ: `'prime256v1'`။
* `nistCurve` {string} (Optional) Elliptic curve ရဲ့ NIST နာမည် ဖြစ်ပြီး — ရှိရင် ဖော်ပြပါတယ် (လူသိများတဲ့ curves တိုင်းကို NIST က နာမည်ပေးထားတာ မဟုတ်ပါဘူး)။ ဥပမာ: `'P-256'`။

ဥပမာ certificate တစ်ခု:

```js
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()`

* Returns: {Buffer|undefined} SSL/TLS handshake ရဲ့ တစ်စိတ်တစ်ပိုင်းအဖြစ် socket ကနေ မျှော်လင့်ရတဲ့ (သို့) လက်ခံရရှိပြီးသား နောက်ဆုံး `Finished` message ပါ — အခုအချိန်အထိ `Finished` message မရှိသေးရင် `undefined` ပါ။

`Finished` messages တွေက handshake တစ်ခုလုံးရဲ့ message digests တွေ ဖြစ်တာမို့ (TLS 1.0 အတွက် စုစုပေါင်း 192 bits ဖြစ်ပြီး SSL 3.0 အတွက် ပိုများပါတယ်) — SSL/TLS က ပေးတဲ့ authentication ကို မလိုချင်တဲ့အခါ (သို့) မလုံလောက်တဲ့အခါ external authentication procedures တွေအတွက် ၎င်းတို့ကို သုံးနိုင်ပါတယ်။

OpenSSL ထဲက `SSL_get_peer_finished` routine နဲ့ ကိုက်ညီပြီး — [RFC 5929][] ကနေ `tls-unique` channel binding ကို အကောင်အထည်ဖော်ဖို့ သုံးနိုင်ပါတယ်။


### `tlsSocket.getPeerX509Certificate()`

* Returns: {X509Certificate}

Peer certificate ကို {X509Certificate} object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Peer certificate မရှိဘူး သို့မဟုတ် socket ကို destroy လုပ်ပြီးသား ဖြစ်နေရင် `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

### `tlsSocket.getProtocol()`

* Returns: {string|null}

လက်ရှိ connection ရဲ့ ညှိနှိုင်းပြီးသား (negotiated) SSL/TLS protocol version ပါဝင်တဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။ Handshaking process ကို မပြီးမြောက်ရသေးတဲ့ ချိတ်ဆက်ပြီးသား (connected) sockets တွေအတွက်တော့ `'unknown'` တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။ Server sockets တွေ သို့မဟုတ် ချိတ်ဆက်မှု ပြတ်သွားတဲ့ client sockets တွေအတွက်တော့ `null` တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။

Protocol versions တွေကတော့:

* `'SSLv3'`
* `'TLSv1'`
* `'TLSv1.1'`
* `'TLSv1.2'`
* `'TLSv1.3'`

နောက်ထပ် အချက်အလက်တွေအတွက် OpenSSL ရဲ့ [`SSL_get_version`][] documentation ကို ကြည့်ပါ။

### `tlsSocket.getSession()`

* Type: {Buffer}

TLS session data ကို ပြန်ပေးပါတယ် — session တစ်ခုကို ညှိနှိုင်း (negotiate) လုပ်ထားခြင်း မရှိဘူးဆိုရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။ Client ဘက်မှာဆိုရင် — connection ကို ပြန်လည် စတင်ဖို့ (resume) — ဒီ data ကို [`tls.connect()`][] ရဲ့ `session` option ဆီကို ပေးပို့နိုင်ပါတယ်။ Server ဘက်မှာတော့ debugging အတွက် အသုံးဝင်နိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။

မှတ်ချက်: `getSession()` က TLSv1.2 နဲ့ အောက် versions တွေမှာသာ အလုပ်လုပ်ပါတယ်။ TLSv1.3 အတွက်တော့ applications တွေက [`'session'`][] event ကို သုံးရပါမယ် (ဒါက TLSv1.2 နဲ့ အောက် versions တွေမှာလည်း အလုပ်လုပ်ပါတယ်)။

### `tlsSocket.getSharedSigalgs()`

* Returns: {Array} Server နဲ့ client ကြားမှာ မျှဝေထားတဲ့ signature algorithms တွေရဲ့ စာရင်းပါ — ဦးစားပေးမှု နည်းပါးလာတဲ့ အစဉ်လိုက် ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [SSL\_get\_shared\_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs.html) ကို ကြည့်ပါ။

### `tlsSocket.getTLSTicket()`

* Type: {Buffer}

Client တစ်ခုအတွက်ဆိုရင် — TLS session ticket တစ်ခု ရနိုင်ရင် ၎င်းကို ပြန်ပေးပြီး — မရရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။ Server တစ်ခုအတွက်တော့ အမြဲတမ်း `undefined` ကို ပြန်ပေးပါတယ်။

Debugging အတွက် အသုံးဝင်နိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။

### `tlsSocket.getX509Certificate()`

* Returns: {X509Certificate}

Local certificate ကို {X509Certificate} object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Local certificate မရှိဘူး သို့မဟုတ် socket ကို destroy လုပ်ပြီးသား ဖြစ်နေရင် `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

### `tlsSocket.isSessionReused()`

* Returns: {boolean} Session ကို ပြန်လည် သုံးစွဲထားရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။

### `tlsSocket.localAddress`

* Type: {string}

Local IP address ရဲ့ string ပုံစံ ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။

### `tlsSocket.localPort`

* Type: {integer}

Local port ရဲ့ ဂဏန်း (numeric) ပုံစံ ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။

### `tlsSocket.remoteAddress`

* Type: {string}

Remote IP address ရဲ့ string ပုံစံ ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။ ဥပမာ — `'74.125.127.100'` သို့မဟုတ် `'2001:4860:a005::68'` ပါ။

### `tlsSocket.remoteFamily`

* Type: {string}

Remote IP family ရဲ့ string ပုံစံ ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။ `'IPv4'` သို့မဟုတ် `'IPv6'` ဖြစ်ပါတယ်။

### `tlsSocket.remotePort`

* Type: {integer}

Remote port ရဲ့ ဂဏန်း (numeric) ပုံစံ ဖော်ပြချက်ကို ပြန်ပေးပါတယ်။ ဥပမာ — `443` ပါ။

### `tlsSocket.renegotiate(options, callback)`

* `options` {Object}
  * `rejectUnauthorized` {boolean} `false` မဟုတ်ရင် server certificate ကို ပေးထားတဲ့ CAs စာရင်းနဲ့ ဆန့်ကျင် စစ်ဆေးပါတယ်။ Verification မအောင်မြင်ရင် `'error'` event တစ်ခုကို emit လုပ်ပါတယ်; `err.code` ထဲမှာ OpenSSL error code ပါဝင်ပါတယ်။ **Default:** `true`။
  * `requestCert`

* `callback` {Function} `renegotiate()` က `true` ကို ပြန်ပေးခဲ့ရင် callback ကို [`'secure'`][] event ပေါ်မှာ တစ်ကြိမ်တည်း (once) ထည့်သွင်းပါတယ်။ `renegotiate()` က `false` ကို ပြန်ပေးခဲ့ရင်တော့ — `tlsSocket` ကို destroy လုပ်ပြီးသား မဖြစ်ဘူးဆိုရင် — `callback` ကို နောက် tick တစ်ခုမှာ error တစ်ခုနဲ့အတူ ခေါ်ယူပါလိမ့်မယ်။ Destroy လုပ်ပြီးသား ဖြစ်နေရင်တော့ `callback` ကို လုံးဝ ခေါ်မှာ မဟုတ်ပါဘူး။

* Returns: {boolean} Renegotiation ကို စတင်ခဲ့ရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါတယ်။

`tlsSocket.renegotiate()` method က TLS renegotiation process တစ်ခုကို စတင်ပါတယ်။ ပြီးဆုံးတဲ့အခါ `callback` function ကို argument တစ်ခုတည်းနဲ့ ခေါ်ယူပါလိမ့်မယ် — အဲဒီ argument က `Error` တစ်ခု (တောင်းဆိုမှု မအောင်မြင်ခဲ့ရင်) သို့မဟုတ် `null` ဖြစ်ပါတယ်။

Secure connection တစ်ခု တည်ဆောက်ပြီးနောက်မှာ peer ရဲ့ certificate ကို တောင်းခံဖို့ ဒီ method ကို သုံးနိုင်ပါတယ်။

Server အဖြစ် လည်ပတ်နေတဲ့အခါ — `handshakeTimeout` အချိန်ကုန်သွားပြီးနောက်မှာ — socket ကို error တစ်ခုနဲ့အတူ destroy လုပ်ပါလိမ့်မယ်။

TLSv1.3 အတွက်တော့ renegotiation ကို စတင်လို့ မရပါဘူး — protocol က ၎င်းကို ပံ့ပိုးမထားပါဘူး။

### `tlsSocket.servername`

* Type: {string|boolean|null}

Socket နဲ့ ဆက်စပ်နေတဲ့ SNI (Server Name Indication) host name ပါ။ Handshake မပြီးဆုံးခင် ဒါက `null` ဖြစ်ပါတယ်။ Handshake ပြီးဆုံးတာနဲ့ — ၎င်းက host name string အဖြစ် သို့မဟုတ် SNI ကို မသုံးခဲ့ရင် `false` အဖြစ် — အခြေချ (settle) သွားပါတယ်။

### `tlsSocket.setKeyCert(context)`

* `context` {Object|tls.SecureContext} [`tls.createSecureContext()`][] ရဲ့ `options` ထဲက `key` နဲ့ `cert` properties တွေ အနည်းဆုံး ပါဝင်တဲ့ object တစ်ခု သို့မဟုတ် [`tls.createSecureContext()`][] ကိုယ်တိုင်နဲ့ ဖန်တီးထားတဲ့ TLS context object တစ်ခု ဖြစ်ပါတယ်။

`tlsSocket.setKeyCert()` method က socket အတွက် သုံးမယ့် private key နဲ့ certificate ကို သတ်မှတ်ပေးပါတယ်။ TLS server တစ်ခုရဲ့ `ALPNCallback` ကနေ server certificate တစ်ခုကို ရွေးချယ်ချင်တဲ့အခါမျိုးမှာ ဒါက အဓိက အသုံးဝင်ပါတယ်။

### `tlsSocket.setMaxSendFragment(size)`

* `size` {number} အများဆုံး TLS fragment size ပါ။ အများဆုံး တန်ဖိုးက `16384` ဖြစ်ပါတယ်။ **Default:** `16384`။
* Returns: {boolean}

`tlsSocket.setMaxSendFragment()` method က အများဆုံး TLS fragment size ကို သတ်မှတ်ပေးပါတယ်။ ကန့်သတ်ချက် သတ်မှတ်တာ အောင်မြင်ခဲ့ရင် `true` — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

Fragment size ငယ်တာတွေက client ဘက်မှာ buffering latency ကို လျှော့ချပေးပါတယ်: fragment ကြီးတွေကို TLS layer က — fragment တစ်ခုလုံး လက်ခံရရှိပြီး ၎င်းရဲ့ ခိုင်မာမှု (integrity) ကို အတည်ပြုပြီးသည်အထိ — buffer လုပ်ထားပါတယ်; fragment ကြီးတွေက roundtrips အများအပြားကို လွှမ်းခြုံနိုင်ပြီး — packet loss သို့မဟုတ် reordering တွေကြောင့် ၎င်းတို့ရဲ့ processing က နှောင့်နှေးသွားနိုင်ပါတယ်။ ဒါပေမယ့် fragment size ငယ်တာတွေက TLS framing bytes နဲ့ CPU overhead တွေ ထပ်ဆောင်း ထည့်သွင်းပေးတာမို့ — server တစ်ခုလုံးရဲ့ throughput ကို ကျဆင်းစေနိုင်ပါတယ်။

## `tls.checkServerIdentity(hostname, cert)`

* `hostname` {string} Certificate ကို ဆန့်ကျင် စစ်ဆေးရမယ့် host name သို့မဟုတ် IP address ပါ။
* `cert` {Object} Peer ရဲ့ certificate ကို ကိုယ်စားပြုတဲ့ [certificate object][] တစ်ခုပါ။
* Returns: {Error|undefined}

`cert` certificate ကို `hostname` အတွက် ထုတ်ပေးထားတာလားဆိုတာ စစ်ဆေးပါတယ်။

မအောင်မြင်ရင် {Error} object တစ်ခုကို ပြန်ပေးပြီး — ၎င်းထဲမှာ `reason`, `host` နဲ့ `cert` တို့ကို ဖြည့်သွင်းပေးပါတယ်။ အောင်မြင်ရင်တော့ {undefined} ကို ပြန်ပေးပါတယ်။

ဒီ function ကို [`tls.connect()`][] ဆီကို ဖြတ်သန်းပေးနိုင်တဲ့ `checkServerIdentity` option နဲ့ တွဲသုံးဖို့ ရည်ရွယ်ထားပြီး — အဲဒီအတွက်ကြောင့်ပဲ [certificate object][] တစ်ခုအပေါ်မှာ လုပ်ဆောင်ပါတယ်။ အခြား ရည်ရွယ်ချက်တွေအတွက်တော့ [`x509.checkHost()`][] ကို သုံးဖို့ စဉ်းစားပါ။

ဒီ function ကို — `tls.connect()` ဆီကို ဖြတ်သန်းပေးတဲ့ `options.checkServerIdentity` option အနေနဲ့ အခြား function တစ်ခုကို ပေးခြင်းအားဖြင့် — ပြောင်းလဲ အစားထိုး (overwrite) လုပ်နိုင်ပါတယ်။ အစားထိုးတဲ့ function က လုပ်ဆောင်ပြီးသား စစ်ဆေးမှုတွေကို ထပ်ဆောင်း verification တွေနဲ့ မြှင့်တင်ဖို့ `tls.checkServerIdentity()` ကို သေချာပေါက် ခေါ်နိုင်ပါတယ်။

ဒီ function က certificate က — trusted CA (`options.ca`) ကနေ ထုတ်ပေးထားတာမျိုးလို — တခြား စစ်ဆေးမှုတွေ အားလုံးကို ကျော်လွန်သွားမှသာ ခေါ်ယူပါတယ်။

Node.js ရဲ့ အစောပိုင်း versions တွေက — ကိုက်ညီတဲ့ `uniformResourceIdentifier` subject alternative name တစ်ခု ရှိနေရင် — ပေးထားတဲ့ `hostname` တစ်ခုအတွက် certificates တွေကို မှားယွင်းစွာ လက်ခံခဲ့ဖူးပါတယ် ([CVE-2021-44531][] ကို ကြည့်ပါ)။ `uniformResourceIdentifier` subject alternative names တွေကို လက်ခံချင်တဲ့ applications တွေက — လိုချင်တဲ့ အပြုအမူကို အကောင်အထည်ဖော်ထားတဲ့ — custom `options.checkServerIdentity` function တစ်ခုကို သုံးနိုင်ပါတယ်။

## `tls.connect(options[, callback])`

* `options` {Object}
  * `enableTrace`: [`tls.createServer()`][] ကို ကြည့်ပါ။
  * `host` {string} Client က ချိတ်ဆက်သင့်တဲ့ host ပါ။ **Default:** `'localhost'`။
  * `port` {number} Client က ချိတ်ဆက်သင့်တဲ့ port ပါ။
  * `path` {string} ပေးထားတဲ့ path ဆီကို Unix socket connection တစ်ခု ဖန်တီးပါတယ်။ ဒီ option ကို သတ်မှတ်ထားရင် `host` နဲ့ `port` တို့ကို လျစ်လျူရှုပါတယ်။
  * `socket` {stream.Duplex} Socket အသစ်တစ်ခု ဖန်တီးတာထက် — ပေးထားတဲ့ socket တစ်ခုပေါ်မှာ secure connection တစ်ခုကို တည်ဆောက်ပါတယ်။ ပုံမှန်အားဖြင့် ဒါက [`net.Socket`][] ရဲ့ instance တစ်ခု ဖြစ်ပေမယ့် — `Duplex` stream ဘယ်ဟာမဆို ခွင့်ပြုပါတယ်။
    ဒီ option ကို သတ်မှတ်ထားရင် — certificate validation ကလွဲလို့ — `path`, `host` နဲ့ `port` တို့ကို လျစ်လျူရှုပါတယ်။ ပုံမှန်အားဖြင့် socket တစ်ခုက `tls.connect()` ဆီကို ဖြတ်သန်းပေးတဲ့အခါ ချိတ်ဆက်ပြီးသား ဖြစ်နေတတ်ပေမယ့် — နောက်မှလည်း ချိတ်ဆက်နိုင်ပါတယ်။
    `socket` ရဲ့ ချိတ်ဆက်မှု/ချိတ်ဆက်မှု ဖြတ်တောက်မှု/destruction တို့ဟာ user ရဲ့ တာဝန် ဖြစ်ပါတယ်; `tls.connect()` ကို ခေါ်လိုက်တာက `net.connect()` ကို ခေါ်စေမှာ မဟုတ်ပါဘူး။
  * `allowHalfOpen` {boolean} `false` အဖြစ် သတ်မှတ်ထားရင် — readable side က အဆုံးသတ်သွားတဲ့အခါ socket က writable side ကို အလိုအလျောက် end လုပ်ပါလိမ့်မယ်။ `socket` option ကို သတ်မှတ်ထားရင်တော့ ဒီ option က သက်ရောက်မှု မရှိပါဘူး။ အသေးစိတ်အတွက် [`net.Socket`][] ရဲ့ `allowHalfOpen` option ကို ကြည့်ပါ။ **Default:** `false`။
  * `rejectUnauthorized` {boolean} `false` မဟုတ်ရင် server certificate ကို ပေးထားတဲ့ CAs စာရင်းနဲ့ ဆန့်ကျင် စစ်ဆေးပါတယ်။ Verification မအောင်မြင်ရင် `'error'` event တစ်ခုကို emit လုပ်ပါတယ်; `err.code` ထဲမှာ OpenSSL error code ပါဝင်ပါတယ်။ **Default:** `true`။
  * `pskCallback` {Function} TLS-PSK ညှိနှိုင်းမှုအတွက် [Pre-shared keys][] ကို ကြည့်ပါ။
  * `ALPNProtocols` {string\[]|Buffer|TypedArray|DataView} Strings တွေရဲ့ array တစ်ခု သို့မဟုတ် ပံ့ပိုးထားတဲ့ ALPN protocols တွေ ပါဝင်တဲ့ `Buffer`, `TypedArray` သို့မဟုတ် `DataView` တစ်ခုတည်း ဖြစ်ပါတယ်။ Buffers တွေမှာ `[len][name][len][name]...` ပုံစံ ရှိသင့်ပါတယ် — ဥပမာ `'\x08http/1.1\x08http/1.0'` လိုမျိုးပါ — `len` byte က နောက် protocol name ရဲ့ အလျားကို ဖော်ပြပါတယ်။ Array တစ်ခုကို ဖြတ်သန်းပေးတာက ပုံမှန်အားဖြင့် ပိုပြီး ရိုးရှင်းပါတယ် — ဥပမာ `['http/1.1', 'http/1.0']` လိုမျိုးပါ။ စာရင်းထဲ ရှေ့ပိုင်းက protocols တွေက နောက်ပိုင်းကဟာတွေထက် ဦးစားပေးမှု ပိုမြင့်ပါတယ်။
  * `servername` {string} SNI (Server Name Indication) TLS extension အတွက် server name ပါ။ ၎င်းက ချိတ်ဆက်နေတဲ့ host ရဲ့ နာမည် ဖြစ်ပြီး — host name တစ်ခု ဖြစ်ရပါမယ် — IP address မဖြစ်ရပါဘူး။ Multi-homed server တစ်ခုက client ဆီကို ပြသဖို့ မှန်ကန်တဲ့ certificate ကို ရွေးချယ်ဖို့ ၎င်းကို သုံးနိုင်ပါတယ် — [`tls.createServer()`][] ရဲ့ `SNICallback` option ကို ကြည့်ပါ။
  * `checkServerIdentity(servername, cert)` {Function} Server ရဲ့ host name (သို့မဟုတ် တိုက်ရိုက် (explicitly) သတ်မှတ်ထားတဲ့အခါ ပေးထားတဲ့ `servername`) ကို certificate နဲ့ ဆန့်ကျင် စစ်ဆေးတဲ့အခါ (builtin `tls.checkServerIdentity()` function အစား) သုံးမယ့် callback function တစ်ခုပါ။ Verification မအောင်မြင်ရင် ဒါက {Error} တစ်ခုကို ပြန်ပေးသင့်ပါတယ်။ `servername` နဲ့ `cert` တို့ကို အတည်ပြုနိုင်ခဲ့ရင်တော့ method က `undefined` ကို ပြန်ပေးသင့်ပါတယ်။
  * `session` {Buffer} TLS session တစ်ခု ပါဝင်တဲ့ `Buffer` instance တစ်ခုပါ။
  * `requestOCSP` {boolean} `true` ဆိုရင် — OCSP status request extension ကို client hello ထဲကို ထည့်သွင်းပြီး — secure communication တစ်ခုကို မတည်ဆောက်ခင် socket ပေါ်မှာ `'OCSPResponse'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်လို့ သတ်မှတ်ပေးပါတယ်။
  * `minDHSize` {number} TLS connection တစ်ခုကို လက်ခံဖို့အတွက် DH parameter ရဲ့ အနည်းဆုံး size (bits နဲ့) ပါ။ Server တစ်ခုက `minDHSize` ထက် ငယ်တဲ့ size ရှိတဲ့ DH parameter တစ်ခုကို ကမ်းလှမ်းတဲ့အခါ TLS connection ကို destroy လုပ်ပြီး error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `1024`။
  * `highWaterMark` {number} Readable stream ရဲ့ `highWaterMark` parameter နဲ့ ကိုက်ညီပါတယ်။ **Default:** `16 * 1024`။
  * `timeout`: {number} သတ်မှတ်ထားပြီး socket တစ်ခုကို အတွင်းပိုင်းမှာ ဖန်တီးထားရင် — socket ကို ဖန်တီးပြီးနောက် — ဒါပေမယ့် connection ကို မစတင်ခင် — [`socket.setTimeout(timeout)`][] ကို ခေါ်ပါလိမ့်မယ်။
  * `secureContext`: [`tls.createSecureContext()`][] နဲ့ ဖန်တီးထားတဲ့ TLS context object ပါ။ `secureContext` တစ်ခုကို _မပေးထားဘူးဆိုရင်_ — `options` object တစ်ခုလုံးကို `tls.createSecureContext()` ဆီကို ဖြတ်သန်းပေးခြင်းအားဖြင့် — တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။
  * `onread` {Object} `socket` option မရှိတဲ့အခါ — ဝင်လာတဲ့ data တွေကို `buffer` တစ်ခုတည်းထဲမှာ သိမ်းဆည်းပြီး socket ပေါ်ကို data ရောက်ရှိတဲ့အခါ ပေးထားတဲ့ `callback` ဆီကို ပေးပို့ပါတယ် — မဟုတ်ရင်တော့ option ကို လျစ်လျူရှုပါတယ်။ အသေးစိတ်အတွက် [`net.Socket`][] ရဲ့ `onread` option ကို ကြည့်ပါ။
  * ...: [`tls.createSecureContext()`][] options တွေပါ — `secureContext` option မရှိတဲ့အခါ သုံးပြီး — မဟုတ်ရင် လျစ်လျူရှုပါတယ်။
  * ...: အထက်မှာ စာရင်းသွင်းပြီးသား မဟုတ်တဲ့ [`socket.connect()`][] option တွေထဲက ဘယ်ဟာမဆို ဖြစ်ပါတယ်။
* `callback` {Function}
* Returns: {tls.TLSSocket}

`callback` function ကို သတ်မှတ်ထားရင် — [`'secureConnect'`][] event အတွက် listener အဖြစ် ထည့်သွင်းပါလိမ့်မယ်။

`tls.connect()` က [`tls.TLSSocket`][] object တစ်ခုကို ပြန်ပေးပါတယ်။

`https` API နဲ့ မတူဘဲ — `tls.connect()` က SNI (Server Name Indication) extension ကို default အနေနဲ့ ဖွင့်မပေးပါဘူး — ဒါက servers တစ်ချို့ကို မှားယွင်းတဲ့ certificate တစ်ခု ပြန်ပေးစေနိုင်သလို — connection တစ်ခုလုံးကို ငြင်းပယ်စေနိုင်ပါတယ်။ SNI ကို ဖွင့်ဖို့ — `host` ရဲ့ အပြင် `servername` option ကိုပါ သတ်မှတ်ပေးပါ။

အောက်မှာက [`tls.createServer()`][] ဥပမာထဲက echo server အတွက် client တစ်ခုကို ဖော်ပြထားပါတယ်:

```mjs
// Assumes an echo server that is listening on port 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Necessary only if the server requires client certificate authentication.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessary only if the server uses a self-signed certificate.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessary only if the server's cert isn't for "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```

```cjs
// Assumes an echo server that is listening on port 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Necessary only if the server requires client certificate authentication.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessary only if the server uses a self-signed certificate.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessary only if the server's cert isn't for "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```

ဒီ ဥပမာအတွက် certificate နဲ့ key ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```

ပြီးရင် ဒီ ဥပမာအတွက် `server-cert.pem` certificate ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])`

* `path` {string} `options.path` အတွက် default တန်ဖိုးပါ။
* `options` {Object} [`tls.connect()`][] ကို ကြည့်ပါ။
* `callback` {Function} [`tls.connect()`][] ကို ကြည့်ပါ။
* Returns: {tls.TLSSocket}

`path` ကို option တစ်ခုအနေနဲ့ မဟုတ်ဘဲ argument တစ်ခုအနေနဲ့ ပေးနိုင်တာကလွဲလို့ — [`tls.connect()`][] နဲ့ အတူတူပါပဲ။

Path option တစ်ခုကို သတ်မှတ်ထားရင် — path argument ထက် ဦးစားပေး အသုံးပြုပါလိမ့်မယ်။

## `tls.connect(port[, host][, options][, callback])`

* `port` {number} `options.port` အတွက် default တန်ဖိုးပါ။
* `host` {string} `options.host` အတွက် default တန်ဖိုးပါ။
* `options` {Object} [`tls.connect()`][] ကို ကြည့်ပါ။
* `callback` {Function} [`tls.connect()`][] ကို ကြည့်ပါ။
* Returns: {tls.TLSSocket}

`port` နဲ့ `host` တို့ကို options တွေအနေနဲ့ မဟုတ်ဘဲ arguments တွေအနေနဲ့ ပေးနိုင်တာကလွဲလို့ — [`tls.connect()`][] နဲ့ အတူတူပါပဲ။

Port သို့မဟုတ် host option တစ်ခုကို သတ်မှတ်ထားရင် — port သို့မဟုတ် host argument ထက် ဦးစားပေး အသုံးပြုပါလိမ့်မယ်။

## `tls.createSecureContext([options])`

* `options` {Object}
  * `allowPartialTrustChain` {boolean} Trust CA certificate list ထဲက intermediate (self-signed မဟုတ်တဲ့) certificates တွေကို trusted အဖြစ် သတ်မှတ်ပါတယ်။
  * `ca` {string|string\[]|Buffer|Buffer\[]} Trusted CA certificates တွေကို ဆန္ဒရှိရင် override လုပ်ပါတယ်။ မသတ်မှတ်ထားရင် — default အနေနဲ့ ယုံကြည်ရတဲ့ CA certificates တွေက `default` type ကို သုံးပြီး [`tls.getCACertificates()`][] က ပြန်ပေးတဲ့ဟာတွေနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။ သတ်မှတ်ထားရင်တော့ default list ကို `ca` option ထဲက certificates တွေနဲ့ လုံးဝ အစားထိုးခံရပါလိမ့်မယ် (concatenate လုပ်ခံရတာမျိုး မဟုတ်ပါဘူး)။ Default တွေကို လုံးဝ override လုပ်မယ့်အစား — certificates ထပ်ဆောင်း ထည့်သွင်းချင်တယ်ဆိုရင် — users တွေက ကိုယ်တိုင် concatenate လုပ်ပေးဖို့ လိုပါတယ်။ တန်ဖိုးက string တစ်ခု သို့မဟုတ် `Buffer` တစ်ခု သို့မဟုတ် strings နဲ့/သို့မဟုတ် `Buffer`s တွေရဲ့ `Array` တစ်ခု ဖြစ်နိုင်ပါတယ်။ String သို့မဟုတ် `Buffer` ဘယ်ဟာမဆို — concatenate လုပ်ထားတဲ့ PEM CAs အများအပြားကို ပါဝင်စေနိုင်ပါတယ်။ Connection တစ်ခု authenticate ဖြစ်ဖို့အတွက် peer ရဲ့ certificate က server က ယုံကြည်တဲ့ CA တစ်ခုဆီကို chain လုပ်လို့ ရနိုင်ရပါမယ်။ လူသိများတဲ့ (well-known) CA တစ်ခုဆီကို chain လုပ်လို့ မရတဲ့ certificates တွေကို သုံးတဲ့အခါ — certificate ရဲ့ CA ကို trusted အဖြစ် တိုက်ရိုက် (explicitly) သတ်မှတ်ပေးရပါမယ် — မဟုတ်ရင် connection က authenticate မဖြစ်ပဲ မအောင်မြင်ပါဘူး။ Peer က default CAs တွေထဲက တစ်ခုနဲ့မှ မကိုက်ညီဘူး သို့မဟုတ် chain မလုပ်နိုင်တဲ့ certificate တစ်ခုကို သုံးနေရင် — peer ရဲ့ certificate က ကိုက်ညီနိုင် သို့မဟုတ် chain လုပ်နိုင်မယ့် CA certificate တစ်ခုကို ပေးအပ်ဖို့ `ca` option ကို သုံးပါ။ Self-signed certificates တွေအတွက်ဆိုရင် — certificate က ၎င်းကိုယ်တိုင် ၎င်းရဲ့ CA ဖြစ်တာမို့ — ၎င်းကို ပေးအပ်ရပါမယ်။ PEM-encoded certificates တွေအတွက် ပံ့ပိုးထားတဲ့ types တွေကတော့ "TRUSTED CERTIFICATE", "X509 CERTIFICATE" နဲ့ "CERTIFICATE" တို့ ဖြစ်ပါတယ်။
  * `cert` {string|string\[]|Buffer|Buffer\[]} PEM format နဲ့ ရှိတဲ့ cert chains တွေပါ။ Private key တစ်ခုစီအတွက် cert chain တစ်ခု ပေးအပ်သင့်ပါတယ်။ Cert chain တစ်ခုစီမှာ — ပေးထားတဲ့ private `key` တစ်ခုအတွက် PEM-formatted certificate ၊ ၎င်းနောက်မှာ PEM-formatted intermediate certificates တွေ (ရှိရင်) — အစဉ်လိုက် ပါဝင်ပြီး — root CA ကိုတော့ မပါဝင်စေရပါဘူး (root CA က peer အတွက် ကြိုသိပြီးသား ဖြစ်ရပါမယ် — `ca` ကို ကြည့်ပါ)။ Cert chains အများအပြား ပေးအပ်တဲ့အခါ — ၎င်းတို့က `key` ထဲက သူတို့ရဲ့ private keys တွေရဲ့ အစဉ်အတိုင်း ဖြစ်နေစရာ မလိုပါဘူး။ Intermediate certificates တွေကို မပေးအပ်ထားဘူးဆိုရင် — peer က certificate ကို validate လုပ်နိုင်မှာ မဟုတ်ဘဲ — handshake က မအောင်မြင်ပါဘူး။
  * `certificateCompression` {string\[]} ဦးစားပေးမှု အစဉ်လိုက်ရှိတဲ့ ပံ့ပိုးထားသော certificate compression algorithm နာမည်တွေရဲ့ array တစ်ခုပါ။ ပံ့ပိုးထားတဲ့ တန်ဖိုးတွေက `'zlib'`, `'brotli'` နဲ့ `'zstd'` တို့ ဖြစ်ပါတယ်။ သတ်မှတ်လိုက်ရင် — TLS handshake အတွင်းမှာ certificates တွေကို compress လုပ်ပေးပြီး — handshake size ကို လျှော့ချပေးတဲ့ — TLS certificate compression ([RFC 8879][]) ကို ဖွင့်ပေးပါတယ်။ TLSv1.3 နဲ့သာ အကျိုးသက်ရောက်ပါတယ်။ **Default:** `[]` (disabled)။
  * `sigalgs` {string} ပံ့ပိုးထားတဲ့ signature algorithms တွေရဲ့ colon နဲ့ ပိုင်းခြားထားတဲ့ စာရင်းပါ။ စာရင်းထဲမှာ digest algorithms (`SHA256`, `MD5` စသည်)၊ public key algorithms (`RSA-PSS`, `ECDSA` စသည်)၊ နှစ်ခုလုံးရဲ့ ပေါင်းစပ် (ဥပမာ 'RSA+SHA384') သို့မဟုတ် TLS v1.3 scheme နာမည်တွေ (ဥပမာ `rsa_pss_pss_sha512`) ပါဝင်နိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [OpenSSL man pages](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list.html) ကို ကြည့်ပါ။
  * `ciphers` {string} Default ကို အစားထိုးတဲ့ cipher suite specification ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Modifying the default TLS cipher suite][] ကို ကြည့်ပါ။ ခွင့်ပြုထားတဲ့ ciphers တွေကို [`tls.getCiphers()`][] ကနေတစ်ဆင့် ရယူနိုင်ပါတယ်။ OpenSSL က လက်ခံနိုင်ဖို့ cipher နာမည်တွေကို စာလုံးကြီး (uppercase) နဲ့ ရေးရပါမယ်။
  * `clientCertEngine` {string} Client certificate ကို ပေးနိုင်တဲ့ OpenSSL engine တစ်ခုရဲ့ နာမည်ပါ။ **Deprecated.** (အသုံးမပြုတော့ရန် သတ်မှတ်ထား)
  * `crl` {string|string\[]|Buffer|Buffer\[]} PEM format နဲ့ ရှိတဲ့ CRLs (Certificate Revocation Lists) တွေပါ။
  * `dhparam` {string|Buffer} `'auto'` သို့မဟုတ် custom Diffie-Hellman parameters တွေ ဖြစ်ပြီး — non-ECDHE [perfect forward secrecy][] အတွက် လိုအပ်ပါတယ်။ ချန်လှပ်ထားရင် သို့မဟုတ် မမှန်ကန်ရင် — parameters တွေကို တိတ်တဆိတ် ပစ်ပယ်လိုက်ပြီး — DHE ciphers တွေ မရနိုင်တော့ပါဘူး။ [ECDHE][]-အခြေခံ [perfect forward secrecy][] ကတော့ ဆက်လက် ရနိုင်ပါသေးတယ်။
  * `ecdhCurve` {string} Key agreement အတွက် သုံးမယ့် named curve တစ်ခု၊ TLS group တစ်ခု သို့မဟုတ် named curves/TLS groups တွေရဲ့ colon နဲ့ ပိုင်းခြားထားတဲ့ စာရင်းကို ဖော်ပြတဲ့ string တစ်ခုပါ — ဥပမာ `P-521:P-384:P-256`, `X25519` သို့မဟုတ် `X25519MLKEM768` ဖြစ်ပါတယ်။ ဒီ option ရဲ့ သမိုင်းဝင် နာမည်က TLSv1.2 နဲ့ အောက်မှာရှိတဲ့ ECDH key agreement ကို ရည်ညွှန်းပါတယ်။ TLSv1.3 မှာတော့ ဒီ option က TLS stack က ကမ်းလှမ်းတဲ့ သို့မဟုတ် လက်ခံတဲ့ TLS Supported Groups နဲ့ key share groups တွေကို ပြင်ဆင်သတ်မှတ်ပေးပါတယ်။ Group ကို အလိုအလျောက် ရွေးချယ်ဖို့ `auto` အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ ရနိုင်တဲ့ elliptic curve နာမည်တွေရဲ့ စာရင်းကို ရဖို့ [`crypto.getCurves()`][] ကို သုံးပါ။ TLS group နာမည်တွေအတွက်တော့ `openssl list -tls-groups` ကို သုံးပါ သို့မဟုတ် [IANA TLS Supported Groups
    registry][] ကို တိုင်ပင်ပါ။ **Default:** [`tls.DEFAULT_ECDH_CURVE`][]။
  * `honorCipherOrder` {boolean} Client ရဲ့ အစား — server ရဲ့ cipher suite ဦးစားပေးမှုတွေကို သုံးဖို့ ကြိုးစားပါတယ်။ `true` ဖြစ်တဲ့အခါ `secureOptions` ထဲမှာ `SSL_OP_CIPHER_SERVER_PREFERENCE` ကို သတ်မှတ်စေပါတယ် — နောက်ထပ် အချက်အလက်တွေအတွက် [OpenSSL Options][] ကို ကြည့်ပါ။
  * `key` {string|string\[]|Buffer|Buffer\[]|Object\[]} PEM format နဲ့ ရှိတဲ့ private keys တွေပါ။ PEM က private keys တွေ encrypt လုပ်ထားနိုင်တဲ့ option ကို ခွင့်ပြုပါတယ်။ Encrypt လုပ်ထားတဲ့ keys တွေကို `options.passphrase` နဲ့ decrypt လုပ်ပါလိမ့်မယ်။ Algorithm အမျိုးမျိုး သုံးထားတဲ့ keys အများအပြားကို — encrypt မလုပ်ထားတဲ့ key strings သို့မဟုတ် buffers တွေရဲ့ array တစ်ခု သို့မဟုတ် `{pem: [, passphrase: ]}` ပုံစံရှိတဲ့ objects တွေရဲ့ array တစ်ခုအနေနဲ့ — ပေးအပ်နိုင်ပါတယ်။ Object ပုံစံက array တစ်ခုထဲမှာသာ ဖြစ်ပေါ်နိုင်ပါတယ်။ `object.passphrase` က optional ဖြစ်ပါတယ်။ Encrypt လုပ်ထားတဲ့ keys တွေကို — `object.passphrase` ပေးထားရင် ၎င်းနဲ့ သို့မဟုတ် မပေးထားရင် `options.passphrase` နဲ့ — decrypt လုပ်ပါလိမ့်မယ်။
  * `privateKeyEngine` {string} Private key ကို ရယူရမယ့် OpenSSL engine တစ်ခုရဲ့ နာမည်ပါ။ `privateKeyIdentifier` နဲ့တွဲပြီး သုံးသင့်ပါတယ်။ **Deprecated.** (အသုံးမပြုတော့ရန် သတ်မှတ်ထား)
  * `privateKeyIdentifier` {string} OpenSSL engine တစ်ခုက စီမံခန့်ခွဲတဲ့ private key တစ်ခုရဲ့ identifier ပါ။ `privateKeyEngine` နဲ့တွဲပြီး သုံးသင့်ပါတယ်။ `key` နဲ့တွဲပြီး သတ်မှတ်မထားသင့်ပါဘူး — options နှစ်ခုလုံးက private key တစ်ခုကို နည်းလမ်းမျိုးစုံနဲ့ သတ်မှတ်ပေးနေလို့ပါ။ **Deprecated.** (အသုံးမပြုတော့ရန် သတ်မှတ်ထား)
  * `maxVersion` {string} ခွင့်ပြုမယ့် အများဆုံး TLS version ကို ဆန္ဒရှိရင် သတ်မှတ်ပါတယ်။ `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` သို့မဟုတ် `'TLSv1'` ထဲက တစ်ခု ဖြစ်ရပါမယ်။ `secureProtocol` option နဲ့အတူ သတ်မှတ်လို့ မရပါဘူး; တစ်ခုခုကိုသာ သုံးပါ။ **Default:** [`tls.DEFAULT_MAX_VERSION`][]။
  * `minVersion` {string} ခွင့်ပြုမယ့် အနည်းဆုံး TLS version ကို ဆန္ဒရှိရင် သတ်မှတ်ပါတယ်။ `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` သို့မဟုတ် `'TLSv1'` ထဲက တစ်ခု ဖြစ်ရပါမယ်။ `secureProtocol` option နဲ့အတူ သတ်မှတ်လို့ မရပါဘူး; တစ်ခုခုကိုသာ သုံးပါ။ TLSv1.2 အောက်ကို သတ်မှတ်တာကို ရှောင်ပါ — ဒါပေမယ့် အပြန်အလှန် လုပ်ဆောင်နိုင်မှု (interoperability) အတွက် လိုအပ်နိုင်ပါတယ်။ TLSv1.2 မတိုင်ခင်က versions တွေက [OpenSSL Security Level][] ကို အောက်သို့ ချပြီး (downgrade) သတ်မှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။ **Default:** [`tls.DEFAULT_MIN_VERSION`][]။
  * `passphrase` {string} Private key တစ်ခုတည်း နဲ့/သို့မဟုတ် PFX တစ်ခုအတွက် သုံးတဲ့ မျှဝေထားသော passphrase ပါ။
  * `pfx` {string|string\[]|Buffer|Buffer\[]|Object\[]} PFX သို့မဟုတ် PKCS12-encoded private key နဲ့ certificate chain ပါ။ `pfx` က `key` နဲ့ `cert` တို့ကို တစ်ခုချင်းစီ ပေးအပ်တာရဲ့ အခြားရွေးချယ်စရာ (alternative) တစ်ခု ဖြစ်ပါတယ်။ PFX က ပုံမှန်အားဖြင့် encrypt လုပ်ထားတတ်ပါတယ် — encrypt လုပ်ထားရင် ၎င်းကို decrypt လုပ်ဖို့ `passphrase` ကို သုံးပါလိမ့်မယ်။ PFX အများအပြားကို — encrypt မလုပ်ထားတဲ့ PFX buffers တွေရဲ့ array တစ်ခု သို့မဟုတ် `{buf: [, passphrase: ]}` ပုံစံရှိတဲ့ objects တွေရဲ့ array တစ်ခုအနေနဲ့ — ပေးအပ်နိုင်ပါတယ်။ Object ပုံစံက array တစ်ခုထဲမှာသာ ဖြစ်ပေါ်နိုင်ပါတယ်။ `object.passphrase` က optional ဖြစ်ပါတယ်။ Encrypt လုပ်ထားတဲ့ PFX ကို — `object.passphrase` ပေးထားရင် ၎င်းနဲ့ သို့မဟုတ် မပေးထားရင် `options.passphrase` နဲ့ — decrypt လုပ်ပါလိမ့်မယ်။
  * `secureOptions` {number} OpenSSL protocol ရဲ့ အပြုအမူကို ဆန္ဒရှိရင် သက်ရောက်စေပါတယ် — ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ သုံးမယ်ဆိုရင်တောင် သေချာ ဂရုတစိုက် သုံးသင့်ပါတယ်! တန်ဖိုးက [OpenSSL Options][] ကနေ ရတဲ့ `SSL_OP_*` options တွေရဲ့ ဂဏန်း (numeric) bitmask တစ်ခု ဖြစ်ပါတယ်။
  * `secureProtocol` {string} သုံးမယ့် TLS protocol version ကို ရွေးချယ်ဖို့အတွက် ရှေးဟောင်း (legacy) ယန္တရားတစ်ခုပါ — ၎င်းက အနည်းဆုံးနဲ့ အများဆုံး version တွေကို သီးခြားစီ ထိန်းချုပ်မှုကို မပံ့ပိုးပါဘူး — protocol ကို TLSv1.3 ထိ ကန့်သတ်တာကိုလည်း မပံ့ပိုးပါဘူး။ `minVersion` နဲ့ `maxVersion` တို့ကို အစား သုံးပါ။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကို [SSL\_METHODS][SSL_METHODS] အဖြစ် စာရင်းပြုစုထားပြီး — function နာမည်တွေကို strings အဖြစ် သုံးပါ။ ဥပမာ — TLS version 1.1 ကို အတင်းအကျပ် သုံးဖို့ `'TLSv1_1_method'` ကို သုံးပါ သို့မဟုတ် TLSv1.3 အထိ ဘယ် TLS protocol version ကိုမဆို ခွင့်ပြုဖို့ `'TLS_method'` ကို သုံးပါ။ TLS versions 1.2 အောက်တွေကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး — ဒါပေမယ့် interoperability အတွက် လိုအပ်နိုင်ပါတယ်။ **Default:** none, `minVersion` ကို ကြည့်ပါ။
  * `sessionIdContext` {string} Servers တွေက — session state ကို applications များကြားမှာ မမျှဝေမိအောင် သေချာစေဖို့ — သုံးတဲ့ ပွင့်လင်းမြင်သာမှု မရှိတဲ့ (opaque) identifier တစ်ခုပါ။ Clients တွေအတွက်တော့ အသုံးမပြုပါဘူး။
  * `ticketKeys` {Buffer} Cryptographically အားကောင်းတဲ့ pseudorandom data 48 bytes ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။
  * `sessionTimeout` {number} Server က ဖန်တီးလိုက်တဲ့ TLS session တစ်ခုက နောက်ထပ် resume လုပ်လို့ မရတော့ခင်အထိ စက္ကန့် ဘယ်လောက်ကြာမယ်ဆိုတဲ့ အရေအတွက်ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။ **Default:** `300`။

[`tls.createServer()`][] က `honorCipherOrder` option ရဲ့ default တန်ဖိုးကို `true` အဖြစ် သတ်မှတ်ပေးပြီး — secure contexts တွေကို ဖန်တီးတဲ့ အခြား APIs တွေကတော့ ၎င်းကို သတ်မှတ်မပေးဘဲ ထားပါတယ်။

[`tls.createServer()`][] က `process.argv` ကနေ ထုတ်လုပ်ထားတဲ့ 128-bit truncated SHA1 hash တန်ဖိုးကို `sessionIdContext` option ရဲ့ default တန်ဖိုးအဖြစ် သုံးပြီး — secure contexts တွေကို ဖန်တီးတဲ့ အခြား APIs တွေမှာတော့ default တန်ဖိုး မရှိပါဘူး။

`tls.createSecureContext()` method က `SecureContext` object တစ်ခုကို ဖန်တီးပါတယ်။ ၎င်းက [`server.addContext()`][] လိုမျိုး `tls` APIs တစ်ချို့ဆီကို argument အဖြစ် သုံးလို့ ရပေမယ့် — public methods တွေတော့ မရှိပါဘူး။ [`tls.Server`][] constructor နဲ့ [`tls.createServer()`][] method တို့က `secureContext` option ကို ပံ့ပိုးမထားပါဘူး။

Certificates တွေကို သုံးတဲ့ ciphers တွေအတွက် key တစ်ခုက _လိုအပ်_ ပါတယ်။ ၎င်းကို ပေးအပ်ဖို့ `key` သို့မဟုတ် `pfx` ထဲက တစ်ခုခုကို သုံးနိုင်ပါတယ်။

`ca` option ကို မပေးထားဘူးဆိုရင် Node.js က default အနေနဲ့ [Mozilla's publicly trusted list of CAs][] ကို သုံးပါလိမ့်မယ်။

Custom DHE parameters တွေထက် — အသစ်ဖြစ်တဲ့ `dhparam: 'auto'` option ကို ဦးစားပေး အကြံပြုပါတယ်။ `'auto'` အဖြစ် သတ်မှတ်ထားရင် — လုံလောက်တဲ့ အားကောင်းမှု (strength) ရှိတဲ့ လူသိများသော DHE parameters တွေကို အလိုအလျောက် ရွေးချယ်ပါလိမ့်မယ်။ မဟုတ်ရင် — လိုအပ်ရင် — `openssl dhparam` ကို သုံးပြီး custom parameters တွေကို ဖန်တီးနိုင်ပါတယ်။ Key length က 1024 bits ထက် ကြီးရန် သို့မဟုတ် တူညီရန် လိုအပ်ပြီး — မဟုတ်ရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ 1024 bits က ခွင့်ပြုထားပေမယ့် — ပိုပြီး အားကောင်းတဲ့ လုံခြုံရေးအတွက် 2048 bits သို့မဟုတ် ပိုကြီးတာကို သုံးပါ။

## `tls.createServer([options][, secureConnectionListener])`

* `options` {Object}
  * `ALPNProtocols` {string\[]|Buffer|TypedArray|DataView} Strings တွေရဲ့ array တစ်ခု သို့မဟုတ် ပံ့ပိုးထားတဲ့ ALPN protocols တွေ ပါဝင်တဲ့ `Buffer`, `TypedArray` သို့မဟုတ် `DataView` တစ်ခုတည်း ဖြစ်ပါတယ်။ Buffers တွေမှာ `[len][name][len][name]...` ပုံစံ ရှိသင့်ပါတယ် — ဥပမာ `0x05hello0x05world` လိုမျိုးပါ — ပထမ byte က နောက် protocol name ရဲ့ အလျားကို ဖော်ပြပါတယ်။ Array တစ်ခုကို ဖြတ်သန်းပေးတာက ပုံမှန်အားဖြင့် ပိုပြီး ရိုးရှင်းပါတယ် — ဥပမာ `['hello', 'world']` လိုမျိုးပါ။ (Protocols တွေကို ၎င်းတို့ရဲ့ ဦးစားပေးမှု အစဉ်လိုက် စီစဉ်ထားသင့်ပါတယ်။)
  * `ALPNCallback` {Function} သတ်မှတ်ထားရင် — client တစ်ခုက ALPN extension ကို သုံးပြီး connection တစ်ခု ဖွင့်တဲ့အခါ ဒါကို ခေါ်ယူပါလိမ့်မယ်။ Callback ဆီကို argument တစ်ခု ဖြတ်သန်းပေးပါလိမ့်မယ်: `servername` နဲ့ `protocols` fields တွေ ပါဝင်တဲ့ object တစ်ခုပါ — အသီးသီးက SNI extension (ရှိရင်) ကနေ ရတဲ့ server name နဲ့ ALPN protocol နာမည် strings တွေရဲ့ array တစ်ခုကို ပါဝင်ပါတယ်။ Callback က — `protocols` ထဲမှာ စာရင်းသွင်းထားတဲ့ strings တွေထဲက တစ်ခုကို (အဲဒါက ရွေးချယ်ထားတဲ့ ALPN protocol အဖြစ် client ဆီကို ပြန်ပေးပါလိမ့်မယ်) သို့မဟုတ် `undefined` ကို — (fatal alert တစ်ခုနဲ့ connection ကို ငြင်းပယ်ဖို့) — ပြန်ပေးရပါမယ်။ Client ရဲ့ ALPN protocols တွေထဲက တစ်ခုနဲ့မှ မကိုက်ညီတဲ့ string တစ်ခုကို ပြန်ပေးခဲ့ရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီ option ကို `ALPNProtocols` option နဲ့တွဲပြီး သုံးလို့ မရပါဘူး — options နှစ်ခုလုံး သတ်မှတ်ထားရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။
  * `clientCertEngine` {string} Client certificate ကို ပေးနိုင်တဲ့ OpenSSL engine တစ်ခုရဲ့ နာမည်ပါ။ **Deprecated.** (အသုံးမပြုတော့ရန် သတ်မှတ်ထား)
  * `enableTrace` {boolean} `true` ဆိုရင် — connections အသစ်တွေပေါ်မှာ [`tls.TLSSocket.enableTrace()`][] ကို ခေါ်ယူပါလိမ့်မယ်။ Secure connection တည်ဆောက်ပြီးနောက်မှာလည်း tracing ကို ဖွင့်နိုင်ပါတယ် — ဒါပေမယ့် secure connection setup ကို trace လုပ်ဖို့အတွက်တော့ ဒီ option ကို သုံးရပါမယ်။ **Default:** `false`။
  * `handshakeTimeout` {number} SSL/TLS handshake က သတ်မှတ်ထားတဲ့ milliseconds အရေအတွက်အတွင်း မပြီးဆုံးရင် connection ကို ဖျက်သိမ်းပါတယ်။ Handshake တစ်ခု အချိန်ကုန်သွားတိုင်း `tls.Server` object ပေါ်မှာ `'tlsClientError'` တစ်ခုကို emit လုပ်ပါတယ်။ **Default:** `120000` (စက္ကန့် 120)။
  * `rejectUnauthorized` {boolean} `false` မဟုတ်ရင် server က — ပေးထားတဲ့ CAs စာရင်းနဲ့ authorize မဖြစ်တဲ့ connection ဘယ်ဟာကိုမဆို ငြင်းပယ်ပါလိမ့်မယ်။ ဒီ option က `requestCert` က `true` ဖြစ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ **Default:** `true`။
  * `requestCert` {boolean} `true` ဆိုရင် server က — ချိတ်ဆက်လာတဲ့ clients တွေဆီကနေ certificate တစ်ခုကို တောင်းခံပြီး — အဲဒီ certificate ကို စစ်ဆေးအတည်ပြုဖို့ ကြိုးစားပါလိမ့်မယ်။ **Default:** `false`။
  * `sessionTimeout` {number} Server က ဖန်တီးလိုက်တဲ့ TLS session တစ်ခုက နောက်ထပ် resume လုပ်လို့ မရတော့ခင်အထိ စက္ကန့် ဘယ်လောက်ကြာမယ်ဆိုတဲ့ အရေအတွက်ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။ **Default:** `300`။
  * `SNICallback(servername, callback)` {Function} Client က SNI TLS extension ကို ပံ့ပိုးရင် ခေါ်ယူမယ့် function တစ်ခုပါ။ ခေါ်ယူတဲ့အခါ arguments နှစ်ခု ဖြတ်သန်းပေးပါလိမ့်မယ်: `servername` နဲ့ `callback` တို့ပါ။ `callback` က error-first callback တစ်ခု ဖြစ်ပြီး — optional arguments နှစ်ခုကို လက်ခံပါတယ်: `error` နဲ့ `ctx` တို့ပါ။ `ctx` ကို ပေးထားရင် ၎င်းက `SecureContext` instance တစ်ခု ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ `SecureContext` တစ်ခုကို ရဖို့ [`tls.createSecureContext()`][] ကို သုံးနိုင်ပါတယ်။ `callback` ကို falsy `ctx` argument တစ်ခုနဲ့ ခေါ်လိုက်ရင် — server ရဲ့ default secure context ကို သုံးပါလိမ့်မယ်။ `SNICallback` ကို မပေးထားဘူးဆိုရင် — high-level API ပါတဲ့ default callback ကို သုံးပါလိမ့်မယ် (အောက်မှာ ကြည့်ပါ)။
  * `ticketKeys` {Buffer} Cryptographically အားကောင်းတဲ့ pseudorandom data 48 bytes ပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Session Resumption][] ကို ကြည့်ပါ။
  * `pskCallback` {Function} TLS-PSK ညှိနှိုင်းမှုအတွက် [Pre-shared keys][] ကို ကြည့်ပါ။
  * `pskIdentityHint` {string} TLS-PSK ညှိနှိုင်းမှုအတွင်း identity ရွေးချယ်တဲ့အခါ ကူညီဖို့ client ဆီကို ပို့မယ့် optional hint တစ်ခုပါ။ TLS 1.3 မှာတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။ pskIdentityHint ကို သတ်မှတ်တာ မအောင်မြင်ရင် `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'` code နဲ့ `'tlsClientError'` ကို emit လုပ်ပါလိမ့်မယ်။
  * ...: [`tls.createSecureContext()`][] option ဘယ်ဟာမဆို ပေးအပ်နိုင်ပါတယ်။ Servers တွေအတွက် — identity options တွေ (`pfx`, `key`/`cert`, သို့မဟုတ် `pskCallback`) က ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။
  * ...: [`net.createServer()`][] option ဘယ်ဟာမဆို ပေးအပ်နိုင်ပါတယ်။
* `secureConnectionListener` {Function}
* Returns: {tls.Server}

[`tls.Server`][] အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `secureConnectionListener` ကို ပေးထားရင် — [`'secureConnection'`][] event အတွက် listener အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။

`ticketKeys` option ကို `node:cluster` module workers တွေကြားမှာ အလိုအလျောက် မျှဝေပေးပါတယ်။

အောက်မှာက ရိုးရှင်းတဲ့ echo server တစ်ခုကို ဖော်ပြထားပါတယ်:

```mjs
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // This is necessary only if using client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```cjs
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // This is necessary only if using client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

ဒီ ဥပမာအတွက် certificate နဲ့ key ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```

ပြီးရင် ဒီ ဥပမာအတွက် `client-cert.pem` certificate ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```

Server ကို — [`tls.connect()`][] ကနေ ရတဲ့ ဥပမာ client ကို သုံးပြီး ချိတ်ဆက်၍ စမ်းသပ်နိုင်ပါတယ်။

## `tls.setDefaultCACertificates(certs)`

* `certs` {string\[]|ArrayBufferView\[]} PEM format နဲ့ ရှိတဲ့ CA certificates တွေရဲ့ array တစ်ခုပါ။

Node.js TLS clients တွေ သုံးတဲ့ default CA certificates တွေကို သတ်မှတ်ပေးပါတယ်။ ပေးထားတဲ့ certificates တွေကို အောင်မြင်စွာ parse လုပ်နိုင်ခဲ့ရင် — ၎င်းတို့ဟာ [`tls.getCACertificates()`][] က ပြန်ပေးတဲ့ default CA certificate list ဖြစ်လာပြီး — ကိုယ်ပိုင် CA certificates တွေကို မသတ်မှတ်တဲ့ နောက်ဆက်တွဲ TLS connections တွေမှာ သုံးပါလိမ့်မယ်။ Certificates တွေကို default အဖြစ် မသတ်မှတ်ခင် deduplicate (ထပ်နေတာတွေ ဖယ်ရှား) လုပ်ပါလိမ့်မယ်။

ဒီ function က လက်ရှိ Node.js thread ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ HTTPS agent က cache လုပ်ထားတဲ့ အရင်က sessions တွေကတော့ ဒီပြောင်းလဲမှုရဲ့ သက်ရောက်မှု ခံရမှာ မဟုတ်ပါဘူး — ဒါကြောင့် မလိုလားအပ်တဲ့ cacheable TLS connections တွေ မပြုလုပ်ခင် ဒီ method ကို ခေါ်ထားသင့်ပါတယ်။

System CA certificates တွေကို default အဖြစ် သုံးဖို့:

```cjs
const tls = require('node:tls');
tls.setDefaultCACertificates(tls.getCACertificates('system'));
```

```mjs
import tls from 'node:tls';
tls.setDefaultCACertificates(tls.getCACertificates('system'));
```

ဒီ function က default CA certificate list ကို လုံးဝ အစားထိုးပါတယ်။ ရှိပြီးသား defaults တွေဆီကို certificates ထပ်ဆောင်း ထည့်သွင်းဖို့ — လက်ရှိ certificates တွေကို ရယူပြီး ၎င်းတို့ဆီကို append လုပ်ပါ:

```cjs
const tls = require('node:tls');
const currentCerts = tls.getCACertificates('default');
const additionalCerts = ['-----BEGIN CERTIFICATE-----\n...'];
tls.setDefaultCACertificates([...currentCerts, ...additionalCerts]);
```

```mjs
import tls from 'node:tls';
const currentCerts = tls.getCACertificates('default');
const additionalCerts = ['-----BEGIN CERTIFICATE-----\n...'];
tls.setDefaultCACertificates([...currentCerts, ...additionalCerts]);
```

## `tls.getCACertificates([type])`

* `type` {string|undefined} ပြန်ပေးမယ့် CA certificates တွေရဲ့ type ပါ။ Valid တန်ဖိုးတွေက `"default"`, `"system"`, `"bundled"` နဲ့ `"extra"` တို့ ဖြစ်ပါတယ်။ **Default:** `"default"`။
* Returns: {string\[]} PEM-encoded certificates တွေရဲ့ array တစ်ခုပါ။ Certificate တစ်ခုတည်းကို source အများအပြားမှာ ထပ်ခါထပ်ခါ သိမ်းဆည်းထားရင် — array ထဲမှာ duplicates တွေ ပါဝင်နိုင်ပါတယ်။

`type` ပေါ် မူတည်ပြီး — source အမျိုးမျိုးကနေ CA certificates တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်:

* `"default"`: Node.js TLS clients တွေက default အနေနဲ့ သုံးမယ့် CA certificates တွေကို ပြန်ပေးပါတယ်။
  * [`--use-bundled-ca`][] ကို ဖွင့်ထားရင် (default) သို့မဟုတ် [`--use-openssl-ca`][] ကို မဖွင့်ထားရင် — ဒါက bundled Mozilla CA store ကနေ CA certificates တွေ ပါဝင်ပါလိမ့်မယ်။
  * [`--use-system-ca`][] ကို ဖွင့်ထားရင် — ဒါက system ရဲ့ trusted store ကနေ certificates တွေကိုပါ ထည့်သွင်းပါလိမ့်မယ်။
  * [`NODE_EXTRA_CA_CERTS`][] ကို သုံးထားရင် — ဒါက သတ်မှတ်ထားတဲ့ file ကနေ load လုပ်ထားတဲ့ certificates တွေကိုပါ ထည့်သွင်းပါလိမ့်မယ်။
* `"system"`: [`--use-system-ca`][] က သတ်မှတ်ထားတဲ့ စည်းမျဉ်းတွေအတိုင်း — system ရဲ့ trusted store ကနေ load လုပ်ထားတဲ့ CA certificates တွေကို ပြန်ပေးပါတယ်။ [`--use-system-ca`][] ကို မဖွင့်ထားတဲ့အခါ system ကနေ certificates တွေကို ရယူဖို့ ဒါကို သုံးနိုင်ပါတယ်။
* `"bundled"`: Bundled Mozilla CA store ကနေ CA certificates တွေကို ပြန်ပေးပါတယ်။ ဒါက [`tls.rootCertificates`][] နဲ့ အတူတူပဲ ဖြစ်ပါလိမ့်မယ်။
* `"extra"`: [`NODE_EXTRA_CA_CERTS`][] ကနေ load လုပ်ထားတဲ့ CA certificates တွေကို ပြန်ပေးပါတယ်။ [`NODE_EXTRA_CA_CERTS`][] ကို သတ်မှတ်မထားရင် — ဒါက empty array တစ်ခု ဖြစ်ပါတယ်။

## `tls.getCiphers()`

* Returns: {string\[]}

ပံ့ပိုးထားတဲ့ TLS ciphers တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ နာမည်တွေက သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် lowercase ဖြစ်နေပေမယ့် — [`tls.createSecureContext()`][] ရဲ့ `ciphers` option ထဲမှာ သုံးဖို့အတွက်တော့ uppercase လုပ်ရပါမယ်။

ပံ့ပိုးထားတဲ့ ciphers တွေ အားလုံးက default အနေနဲ့ ဖွင့်ထားတာ မဟုတ်ပါဘူး။ [Modifying the default TLS cipher suite][] ကို ကြည့်ပါ။

`'tls_'` နဲ့ စတင်တဲ့ cipher နာမည်တွေက TLSv1.3 အတွက်ဖြစ်ပြီး — ကျန်တဲ့ဟာတွေ အားလုံးက TLSv1.2 နဲ့ အောက် အတွက် ဖြစ်ပါတယ်။

```js
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```

## `tls.getCertificateCompressionAlgorithms()`

* Returns: {string\[]}

လက်ရှိ OpenSSL build က ပံ့ပိုးထားတဲ့ RFC 8879 certificate compression algorithms တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — [`tls.createSecureContext()`][] ရဲ့ `certificateCompression` option ထဲမှာ သုံးဖို့ သင့်လျော်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေထဲမှာ `'zlib'`, `'brotli'` နဲ့ `'zstd'` တို့ ပါဝင်ပါတယ်။

Certificate compression မရနိုင်တဲ့အခါ array က empty ဖြစ်ပါတယ်။

```js
console.log(tls.getCertificateCompressionAlgorithms()); // ['zlib', 'brotli', 'zstd']
```

## `tls.rootCertificates`

* Type: {string\[]}

လက်ရှိ Node.js version က ထောက်ပံ့ပေးထားတဲ့ — bundled Mozilla CA store ကနေ ရတဲ့ root certificates တွေ (PEM format နဲ့) ကို ကိုယ်စားပြုတဲ့ immutable (ပြုပြင် ပြောင်းလဲလို့ မရတဲ့) strings array တစ်ခုပါ။

Node.js က ထောက်ပံ့ပေးတဲ့ bundled CA store ဆိုတာ — release လုပ်ချိန်မှာ ပုံသေ (fixed) လုပ်ထားတဲ့ Mozilla CA store ရဲ့ snapshot တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက ပံ့ပိုးထားတဲ့ platforms တွေ အားလုံးမှာ တူညီပါတယ်။

လက်ရှိ Node.js instance က တကယ် သုံးနေတဲ့ CA certificates တွေကို ရဖို့အတွက် — (system store ကနေ load လုပ်ထားတဲ့ certificates တွေ (`--use-system-ca` ကို သုံးထားရင်) သို့မဟုတ် `NODE_EXTRA_CA_CERTS` က ညွှန်ပြတဲ့ file တစ်ခုကနေ load လုပ်ထားတဲ့ဟာတွေ ပါဝင်နိုင်တာမို့) — [`tls.getCACertificates()`][] ကို သုံးပါ။

## `tls.DEFAULT_ECDH_CURVE`

TLS server တစ်ခုထဲမှာ key agreement အတွက် သုံးမယ့် default named curve သို့မဟုတ် TLS group စာရင်းပါ။ Default တန်ဖိုးက `'auto'` ဖြစ်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`tls.createSecureContext()`][] ကို ကြည့်ပါ။

## `tls.DEFAULT_MAX_VERSION`

* Type: {string} [`tls.createSecureContext()`][] ရဲ့ `maxVersion` option ရဲ့ default တန်ဖိုးပါ။ ၎င်းကို ပံ့ပိုးထားတဲ့ TLS protocol versions တွေထဲက ဘယ်ဟာမဆို — `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` သို့မဟုတ် `'TLSv1'` — အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ **Default:** `'TLSv1.3'` — CLI options တွေနဲ့ ပြောင်းလဲထားခြင်း မရှိရင် ဖြစ်ပါတယ်။ `--tls-max-v1.2` ကို သုံးခြင်းက default ကို `'TLSv1.2'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ `--tls-max-v1.3` ကို သုံးခြင်းက default ကို `'TLSv1.3'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ Options တွေထဲက အများအပြား ပေးထားရင် — အမြင့်ဆုံး maximum ကို သုံးပါတယ်။

## `tls.DEFAULT_MIN_VERSION`

* Type: {string} [`tls.createSecureContext()`][] ရဲ့ `minVersion` option ရဲ့ default တန်ဖိုးပါ။ ၎င်းကို ပံ့ပိုးထားတဲ့ TLS protocol versions တွေထဲက ဘယ်ဟာမဆို — `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` သို့မဟုတ် `'TLSv1'` — အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ TLSv1.2 မတိုင်ခင်က versions တွေက [OpenSSL Security Level][] ကို အောက်သို့ ချပြီး သတ်မှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။ **Default:** `'TLSv1.2'` — CLI options တွေနဲ့ ပြောင်းလဲထားခြင်း မရှိရင် ဖြစ်ပါတယ်။ `--tls-min-v1.0` ကို သုံးခြင်းက default ကို `'TLSv1'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ `--tls-min-v1.1` ကို သုံးခြင်းက default ကို `'TLSv1.1'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ `--tls-min-v1.3` ကို သုံးခြင်းက default ကို `'TLSv1.3'` အဖြစ် သတ်မှတ်ပေးပါတယ်။ Options တွေထဲက အများအပြား ပေးထားရင် — အနိမ့်ဆုံး minimum ကို သုံးပါတယ်။

## `tls.DEFAULT_CIPHERS`

* Type: {string} [`tls.createSecureContext()`][] ရဲ့ `ciphers` option ရဲ့ default တန်ဖိုးပါ။ ၎င်းကို ပံ့ပိုးထားတဲ့ OpenSSL ciphers တွေထဲက ဘယ်ဟာမဆို အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ `--tls-default-ciphers` ကို သုံးပြီး CLI options တွေနဲ့ ပြောင်းလဲထားခြင်း မရှိရင် — `crypto.constants.defaultCoreCipherList` ရဲ့ ပါဝင်မှုကို default အဖြစ် သုံးပါတယ်။

[CVE-2021-44531]: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531
[Chrome's 'modern cryptography' setting]: https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites
[DHE]: https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
[ECDHE]: https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman
[IANA TLS Supported Groups registry]: https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-8
[Modifying the default TLS cipher suite]: #modifying-the-default-tls-cipher-suite
[Mozilla's publicly trusted list of CAs]: https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt
[OCSP request]: https://en.wikipedia.org/wiki/OCSP_stapling
[OpenSSL Options]: crypto.md#openssl-options
[OpenSSL Security Level]: #openssl-security-level
[OpenSSL documentation on security levels]: https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level.html#DEFAULT-CALLBACK-BEHAVIOUR
[Pre-shared keys]: #pre-shared-keys
[RFC 2246]: https://www.ietf.org/rfc/rfc2246.txt
[RFC 4086]: https://tools.ietf.org/html/rfc4086
[RFC 4279]: https://tools.ietf.org/html/rfc4279
[RFC 5077]: https://tools.ietf.org/html/rfc5077
[RFC 5929]: https://tools.ietf.org/html/rfc5929
[RFC 8879]: https://tools.ietf.org/html/rfc8879
[SSL_METHODS]: https://www.openssl.org/docs/man1.1.1/man7/ssl.html#Dealing-with-Protocol-Methods
[Session Resumption]: #session-resumption
[Stream]: stream.md#stream
[TLS recommendations]: https://wiki.mozilla.org/Security/Server_Side_TLS
[`'newSession'`]: #event-newsession
[`'resumeSession'`]: #event-resumesession
[`'secure'`]: #event-secure
[`'secureConnect'`]: #event-secureconnect
[`'secureConnection'`]: #event-secureconnection
[`'session'`]: #event-session
[`--tls-cipher-list`]: cli.md#--tls-cipher-listlist
[`--use-bundled-ca`]: cli.md#--use-bundled-ca---use-openssl-ca
[`--use-openssl-ca`]: cli.md#--use-bundled-ca---use-openssl-ca
[`--use-system-ca`]: cli.md#--use-system-ca
[`Duplex`]: stream.md#class-streamduplex
[`NODE_EXTRA_CA_CERTS`]: cli.md#node_extra_ca_certsfile
[`NODE_OPTIONS`]: cli.md#node_optionsoptions
[`SSL_export_keying_material`]: https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material.html
[`SSL_get_version`]: https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version.html
[`crypto.getCurves()`]: crypto.md#cryptogetcurves
[`import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[`net.Server.address()`]: net.md#serveraddress
[`net.Server`]: net.md#class-netserver
[`net.Socket`]: net.md#class-netsocket
[`net.createServer()`]: net.md#netcreateserveroptions-connectionlistener
[`server.addContext()`]: #serveraddcontexthostname-context
[`server.getTicketKeys()`]: #servergetticketkeys
[`server.listen()`]: net.md#serverlisten
[`server.setTicketKeys()`]: #serversetticketkeyskeys
[`socket.connect()`]: net.md#socketconnectoptions-connectlistener
[`socket.setTimeout(timeout)`]: net.md#socketsettimeouttimeout-callback
[`tls.DEFAULT_ECDH_CURVE`]: #tlsdefault_ecdh_curve
[`tls.DEFAULT_MAX_VERSION`]: #tlsdefault_max_version
[`tls.DEFAULT_MIN_VERSION`]: #tlsdefault_min_version
[`tls.Server`]: #class-tlsserver
[`tls.TLSSocket.alpnProtocol`]: #tlssocketalpnprotocol
[`tls.TLSSocket.enableTrace()`]: #tlssocketenabletrace
[`tls.TLSSocket.getPeerCertificate()`]: #tlssocketgetpeercertificatedetailed
[`tls.TLSSocket.getProtocol()`]: #tlssocketgetprotocol
[`tls.TLSSocket.getSession()`]: #tlssocketgetsession
[`tls.TLSSocket.getTLSTicket()`]: #tlssocketgettlsticket
[`tls.TLSSocket.isSessionReused()`]: #tlssocketissessionreused
[`tls.TLSSocket.servername`]: #tlssocketservername
[`tls.TLSSocket`]: #class-tlstlssocket
[`tls.connect()`]: #tlsconnectoptions-callback
[`tls.createSecureContext()`]: #tlscreatesecurecontextoptions
[`tls.createServer()`]: #tlscreateserveroptions-secureconnectionlistener
[`tls.getCACertificates()`]: #tlsgetcacertificatestype
[`tls.getCiphers()`]: #tlsgetciphers
[`tls.rootCertificates`]: #tlsrootcertificates
[`x509.checkHost()`]: crypto.md#x509checkhostname-options
[asn1.js]: https://www.npmjs.com/package/asn1.js
[certificate object]: #certificate-object
[cipher list format]: https://www.openssl.org/docs/man1.1.1/man1/ciphers.html#CIPHER-LIST-FORMAT
[forward secrecy]: https://en.wikipedia.org/wiki/Perfect_forward_secrecy
[perfect forward secrecy]: #perfect-forward-secrecy
