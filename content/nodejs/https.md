---
title: "HTTPS"
description: "node:https module — TLS/SSL ပါတဲ့ HTTP (https.Server/https.Agent, request/get)။"
order: 94
source: "https://nodejs.org/api/https.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

HTTPS ဆိုတာ TLS/SSL ပေါ်မှာ အလုပ်လုပ်တဲ့ HTTP protocol ဖြစ်ပါတယ်။ Node.js မှာ ဒါကို သီးခြား module တစ်ခုအနေနဲ့ ထည့်သွင်းထားပါတယ်။

## Crypto support မရနိုင်ခြင်း စစ်ဆေးခြင်း (Determining if crypto support is unavailable)

Node.js ကို `node:crypto` module အတွက် support မပါဝင်ဘဲ build လုပ်ထားတာမျိုး ဖြစ်နိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ `https` ကနေ `import` လုပ်ဖို့ ကြိုးစားတာ (သို့) `require('node:https')` ကို ခေါ်လိုက်ရင် error တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

CommonJS သုံးတဲ့အခါ throw လုပ်လိုက်တဲ့ error ကို try/catch သုံးပြီး ဖမ်းလို့ရပါတယ်:

```cjs
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```

Lexical ESM `import` keyword ကို သုံးတဲ့အခါမှာတော့ — module ကို load လုပ်ဖို့ မကြိုးစားခင် (ဥပမာ — preload module တစ်ခုကို သုံးပြီး) `process.on('uncaughtException')` အတွက် handler တစ်ခုကို ကြိုတင် register လုပ်ထားမှသာ error ကို ဖမ်းနိုင်မှာ ဖြစ်ပါတယ်။

ESM သုံးတဲ့အခါ code က crypto support မဖွင့်ထားတဲ့ Node.js build ပေါ်မှာ run ခံရနိုင်တဲ့ အလားအလာ ရှိနေရင် — lexical `import` keyword အစား [`import()`][] function ကို သုံးဖို့ စဉ်းစားပါ:

```mjs
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```

## Class: `https.Agent`

HTTPS အတွက် [`Agent`][] object တစ်ခုဖြစ်ပြီး [`http.Agent`][] နဲ့ ဆင်တူပါတယ်။ အသေးစိတ်ကို [`https.request()`][] မှာ ကြည့်ပါ။

`http.Agent` လိုပဲ — TLS connections တွေ ဘယ်လို ထူထောင်မလဲ စိတ်ကြိုက် ပြင်ဆင်နိုင်ဖို့ `createConnection(options[, callback])` method ကို override လုပ်လို့ရပါတယ်။

> ဒီ method ကို override လုပ်ခြင်းအကြောင်း — callback နဲ့ asynchronous socket ဖန်တီးခြင်း အပါအဝင် — အသေးစိတ်ကို [`agent.createConnection()`][] မှာ ကြည့်ပါ။

### `new Agent([options])`

* `options` {Object} agent ပေါ်မှာ သတ်မှတ်လို့ရတဲ့ configurable options တွေရဲ့ အစုအဝေး။
  [`http.Agent(options)`][] မှာလိုမျိုး field တွေ ထည့်လို့ရပြီး —
  * `maxCachedSessions` {number} TLS cached sessions အများဆုံး အရေအတွက်။
    TLS session caching ကို ပိတ်ချင်ရင် `0` သုံးပါ။ **Default:** `100`.
  * `servername` {string} server ဆီ ပို့ရမယ့်
    [Server Name Indication extension][sni wiki] ရဲ့ တန်ဖိုး။ Extension မပို့ချင်ရင်
    empty string `''` ကို သုံးပါ။
    **Default:** target server ရဲ့ host name — target server ကို
    IP address နဲ့ သတ်မှတ်ထားရင်တော့ default က `''` (extension
    မပါ) ဖြစ်ပါတယ်။

    TLS session reuse အကြောင်း အချက်အလက်အတွက် [`Session Resumption`][] ကို ကြည့်ပါ။

Custom `checkServerIdentity` option ကို သတ်မှတ်ထားတဲ့ requests တွေက — Agent ကို ဆောက်တဲ့အခါ `checkServerIdentity` option ပါ သတ်မှတ်ထားတာ မဟုတ်ရင် — `https.Agent` ရဲ့ connection reuse (သို့) TLS session reuse အတွက် အရည်အချင်း မပြည့်မီပါဘူး။

#### Event: `'keylog'`

* `line` {Buffer} NSS `SSLKEYLOGFILE` format နဲ့ ASCII text စာကြောင်း တစ်ကြောင်း။
* `tlsSocket` {tls.TLSSocket} အဲဒါကို ထုတ်လုပ်ခဲ့တဲ့ `tls.TLSSocket` instance။

`keylog` event က — ဒီ agent က စီမံခန့်ခွဲတဲ့ connection တစ်ခုကနေ key material ကို ထုတ်လုပ်တဲ့အခါ (သို့) လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ် (ပုံမှန်အားဖြင့် handshake မပြီးမြောက်ခင် ဖြစ်တတ်ပေမယ့် အမြဲတော့ မဟုတ်ပါဘူး)။ ဒီ keying material ကို debugging အတွက် သိမ်းထားလို့ရပါတယ် — ဘာလို့လဲဆိုတော့ ဖမ်းယူထားတဲ့ TLS traffic တွေကို decrypt လုပ်နိုင်လို့ပါ။ Socket တစ်ခုချင်းစီအတွက် အကြိမ်များစွာ emit ဖြစ်နိုင်ပါတယ်။

ပုံမှန် use case တစ်ခုကတော့ — လက်ခံရရှိတဲ့ lines တွေကို text file တစ်ခုတည်းထဲ append လုပ်သိမ်းထားပြီး နောက်ပိုင်းမှာ (Wireshark လိုမျိုး) software တွေက traffic ကို decrypt လုပ်ဖို့ သုံးတာပါ:

```js
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```

## Class: `https.Server`

* Extends: {tls.Server}

အသေးစိတ်အတွက် [`http.Server`][] ကို ကြည့်ပါ။

### `server.close([callback])`

* `callback` {Function}
* Returns: {https.Server}

`node:http` module ထဲက [`server.close()`][] ကို ကြည့်ပါ။

### `server[Symbol.asyncDispose]()`

[`server.close()`][httpsServerClose] ကို ခေါ်ပြီး — server ပိတ်သွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `server.closeAllConnections()`

`node:http` module ထဲက [`server.closeAllConnections()`][] ကို ကြည့်ပါ။

### `server.closeIdleConnections()`

`node:http` module ထဲက [`server.closeIdleConnections()`][] ကို ကြည့်ပါ။

### `server.headersTimeout`

* Type: {number} **Default:** `60000`

`node:http` module ထဲက [`server.headersTimeout`][] ကို ကြည့်ပါ။

### `server.listen()`

HTTPS server ကို encrypted connections တွေ နားထောင်နေအောင် စတင်ပါတယ်။ ဒီ method က [`net.Server`][] ကနေ လာတဲ့ [`server.listen()`][] နဲ့ တူညီပါတယ်။

### `server.maxHeadersCount`

* Type: {number} **Default:** `2000`

`node:http` module ထဲက [`server.maxHeadersCount`][] ကို ကြည့်ပါ။

### `server.requestTimeout`

* Type: {number} **Default:** `300000`

`node:http` module ထဲက [`server.requestTimeout`][] ကို ကြည့်ပါ။

### `server.setTimeout([msecs][, callback])`

* `msecs` {number} **Default:** `120000` (2 မိနစ်)
* `callback` {Function}
* Returns: {https.Server}

`node:http` module ထဲက [`server.setTimeout()`][] ကို ကြည့်ပါ။

### `server.timeout`

* Type: {number} **Default:** 0 (timeout မရှိ)

`node:http` module ထဲက [`server.timeout`][] ကို ကြည့်ပါ။

### `server.keepAliveTimeout`

* Type: {number} **Default:** `5000` (5 စက္ကန့်)

`node:http` module ထဲက [`server.keepAliveTimeout`][] ကို ကြည့်ပါ။

## `https.createServer([options][, requestListener])`

* `options` {Object} [`tls.createServer()`][], [`tls.createSecureContext()`][] နဲ့
  [`http.createServer()`][] တို့ဆီက `options` တွေကို လက်ခံပါတယ်။
* `requestListener` {Function} `'request'` event ပေါ် ထည့်ပေးရမယ့် listener တစ်ခု။
* Returns: {https.Server}

```mjs
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```cjs
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

သို့မဟုတ်

```mjs
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```cjs
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

ဒီဥပမာအတွက် certificate နဲ့ key ထုတ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```

ပြီးတော့ ဒီဥပမာအတွက် `pfx` certificate ထုတ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])`

## `https.get(url[, options][, callback])`

* `url` {string | URL}
* `options` {Object | string | URL} [`https.request()`][] မှာလိုပဲ `options` တွေကို လက်ခံပြီး — method ကို default အားဖြင့် GET အဖြစ် သတ်မှတ်ထားပါတယ်။
* `callback` {Function}
* Returns: {http.ClientRequest}

[`http.get()`][] နဲ့ တူညီပေမယ့် HTTPS အတွက် ဖြစ်ပါတယ်။

`options` က object (သို့) string (သို့) [`URL`][] object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `options` က string ဆိုရင် [`new URL()`][] နဲ့ အလိုအလျောက် parse လုပ်ပေးပါတယ်။ [`URL`][] object ဖြစ်ရင်လည်း သာမန် `options` object တစ်ခုအဖြစ် အလိုအလျောက် ပြောင်းပေးပါတယ်။

```mjs
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```cjs
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

## `https.globalAgent`

HTTPS client requests အားလုံးအတွက် [`https.Agent`][] ရဲ့ global instance ပါ။ Default [`https.Agent`][] configuration နဲ့ ကွဲပြားတာက — `keepAlive` ဖွင့်ထားပြီး `timeout` က 5 စက္ကန့် ဆိုတဲ့ အချက်ပါ။

## `https.request(options[, callback])`

## `https.request(url[, options][, callback])`

* `url` {string | URL}
* `options` {Object | string | URL} [`http.request()`][] က `options` အားလုံးကို လက်ခံပြီး — default values တွေမှာ ကွဲလွဲချက် အချို့ ရှိပါတယ်:
  * `protocol` **Default:** `'https:'`
  * `port` **Default:** `443`
  * `agent` **Default:** `https.globalAgent`
* `callback` {Function}
* Returns: {http.ClientRequest}

Secure web server တစ်ခုဆီ request လုပ်ပေးပါတယ်။

အောက်ပါ [`tls.connect()`][] ကပါတဲ့ နောက်ထပ် `options` တွေကိုလည်း လက်ခံပါတယ်: `ca`, `cert`, `ciphers`, `clientCertEngine` (deprecated), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`။

`options` က object (သို့) string (သို့) [`URL`][] object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `options` က string ဆိုရင် [`new URL()`][] နဲ့ အလိုအလျောက် parse လုပ်ပေးပါတယ်။ [`URL`][] object ဖြစ်ရင်လည်း သာမန် `options` object တစ်ခုအဖြစ် အလိုအလျောက် ပြောင်းပေးပါတယ်။

`https.request()` က [`http.ClientRequest`][] class ရဲ့ instance တစ်ခုကို ပြန်ပေးပါတယ်။ `ClientRequest` instance က writable stream တစ်ခု ဖြစ်ပါတယ်။ POST request တစ်ခုနဲ့ file တစ်ခု upload လုပ်ဖို့ လိုအပ်ရင် `ClientRequest` object ထဲကို write လုပ်ပါ။

```mjs
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```cjs
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

[`tls.connect()`][] က options တွေ သုံးထားတဲ့ ဥပမာ:

```js
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```

တစ်နည်းအားဖြင့် [`Agent`][] ကို မသုံးဘဲ connection pooling ကနေ ရှောင်ထွက်လို့လည်း ရပါတယ်:

```js
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```

[`URL`][] တစ်ခုကို `options` အဖြစ် သုံးထားတဲ့ ဥပမာ:

```js
const options = new URL('https://abc:xyz@example.com');

const req = https.request(options, (res) => {
  // ...
});
```

Certificate fingerprint (သို့) public key ပေါ်ကို pin လုပ်ထားတဲ့ ဥပမာ (`pin-sha256` နဲ့ ဆင်တူ):

```mjs
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```cjs
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

ဥပမာအတွက် outputs:

```text
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```

[`Agent`]: #class-httpsagent
[`Session Resumption`]: tls.md#session-resumption
[`URL`]: url.md#the-whatwg-url-api
[`agent.createConnection()`]: http.md#agentcreateconnectionoptions-callback
[`http.Agent(options)`]: http.md#new-agentoptions
[`http.Agent`]: http.md#class-httpagent
[`http.ClientRequest`]: http.md#class-httpclientrequest
[`http.Server`]: http.md#class-httpserver
[`http.createServer()`]: http.md#httpcreateserveroptions-requestlistener
[`http.get()`]: http.md#httpgetoptions-callback
[`http.request()`]: http.md#httprequestoptions-callback
[`https.Agent`]: #class-httpsagent
[`https.request()`]: #httpsrequestoptions-callback
[`import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[`net.Server`]: net.md#class-netserver
[`new URL()`]: url.md#new-urlinput-base
[`server.close()`]: http.md#serverclosecallback
[`server.closeAllConnections()`]: http.md#servercloseallconnections
[`server.closeIdleConnections()`]: http.md#servercloseidleconnections
[`server.headersTimeout`]: http.md#serverheaderstimeout
[`server.keepAliveTimeout`]: http.md#serverkeepalivetimeout
[`server.listen()`]: net.md#serverlisten
[`server.maxHeadersCount`]: http.md#servermaxheaderscount
[`server.requestTimeout`]: http.md#serverrequesttimeout
[`server.setTimeout()`]: http.md#serversettimeoutmsecs-callback
[`server.timeout`]: http.md#servertimeout
[`tls.connect()`]: tls.md#tlsconnectoptions-callback
[`tls.createSecureContext()`]: tls.md#tlscreatesecurecontextoptions
[`tls.createServer()`]: tls.md#tlscreateserveroptions-secureconnectionlistener
[httpsServerClose]: #serverclosecallback
[sni wiki]: https://en.wikipedia.org/wiki/Server_Name_Indication
