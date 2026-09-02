---
title: "Enterprise Network ပြင်ဆင်သတ်မှတ်ခြင်း (Enterprise Network Configuration)"
description: "Enterprise network ပတ်ဝန်းကျင်အတွက် Node.js ကို ပြင်ဆင်သတ်မှတ်ခြင်း — `NODE_USE_ENV_PROXY`/`--use-env-proxy` နဲ့ proxy သုံးခြင်း၊ `NODE_USE_SYSTEM_CA`/`--use-system-ca` နဲ့ CA certificates ထည့်ခြင်း"
order: 43
source: "https://nodejs.org/learn/http/enterprise-network-configuration"
status: translated
updated: 2026-09-02
---

## ခြုံငုံသုံးသပ်ချက်

Enterprise (လုပ်ငန်းကြီး) ပတ်ဝန်းကျင်တွေမှာ — application တွေက corporate proxy တွေရဲ့ နောက်ကွယ်မှာ အလုပ်လုပ်ရပြီး SSL/TLS validation အတွက် custom certificate authority (CA) တွေကို သုံးရတတ်ပါတယ်။ Node.js က ဒီလိုလိုအပ်ချက်တွေအတွက် environment variable တွေနဲ့ command-line flag တွေကနေတစ်ဆင့် built-in support ပေးထားပါတယ် — အများစုသော အခြေအနေတွေမှာ third-party proxy library တွေ မလိုအပ်တော့ပါဘူး။

ဒီ guide က Node.js application တွေကို enterprise network environment တွေမှာ အလုပ်လုပ်အောင် ဘယ်လို ပြင်ဆင်သတ်မှတ်ရမလဲဆိုတာ ဖော်ပြပေးပါတယ်:

- `NODE_USE_ENV_PROXY` environment variable (သို့) `--use-env-proxy` flag ကနေတစ်ဆင့် proxy တွေ configure လုပ်ခြင်း
- `NODE_USE_SYSTEM_CA` environment variable (သို့) `--use-system-ca` flag ကနေတစ်ဆင့် system store ကနေ certificate authority တွေ ထည့်ခြင်း

## Proxy ပြင်ဆင်သတ်မှတ်ခြင်း

Enterprise environment တွေ အများကြီးမှာ — external service တွေဆီ internet access ကို security နဲ့ monitoring အတွက် HTTP/HTTPS proxy တွေကနေတစ်ဆင့် လမ်းကြောင်းလွှဲဖို့ လိုအပ်တတ်ပါတယ်။ ဒါက application တွေ network request တွေ လုပ်တဲ့အခါ ဒီ proxy တွေကို သတိပြုမိပြီး သုံးဖို့ လိုအပ်ပါတယ်။

Proxy settings တွေကို `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` လိုမျိုး environment variable တွေကနေတစ်ဆင့် ပေးလေ့ရှိပါတယ်။ `NODE_USE_ENV_PROXY` (သို့) `--use-env-proxy` ကို enable လုပ်ထားရင် Node.js က ဒါတွေကို ထောက်ပံ့ပေးပါတယ်။ ဒါက `node:http` နဲ့ `node:https` (v22.21.0 (သို့) v24.5.0+) methods တွေမှာရော — `fetch()` (v22.21.0 (သို့) v24.0.0+) မှာပါ အလုပ်လုပ်ပါတယ်။

ဥပမာ (POSIX shells):

```bash
# Proxy settings တွေကို IT department က system ထဲမှာ configure လုပ်ထားပြီး
# tool တွေ အမျိုးမျိုးကြားမှာ share လုပ်ထားလေ့ ရှိပါတယ်။
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.company.com

# Node.js application တွေအတွက် enable လုပ်ဖို့။
export NODE_USE_ENV_PROXY=1
node app.js
```

တစ်နည်းအားဖြင့် — Node.js v22.21.0 (သို့) v24.5.0 နဲ့ အထက်မှာ `--use-env-proxy` ဆိုတဲ့ command-line flag နဲ့လည်း enable လုပ်လို့ရပါတယ်:

```bash
# Proxy settings တွေကို IT department က system ထဲမှာ configure လုပ်ထားပြီး
# tool တွေ အမျိုးမျိုးကြားမှာ share လုပ်ထားလေ့ ရှိပါတယ်။
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.company.com

# Node.js application တွေအတွက် enable လုပ်ဖို့။
node --use-env-proxy app.js
```

ဒါမှမဟုတ် — file တစ်ခုကနေ environment variable တွေကို load လုပ်ဖို့ `--env-file` ကို သုံးထားရင်လည်း ရပါတယ်:

```txt
# .env file ထဲမှာ
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1,.company.com
NODE_USE_ENV_PROXY=1
```

Enable ဖြစ်သွားတာနဲ့ — `http`, `https`, `fetch()` request တွေက configure လုပ်ထားတဲ့ proxy တွေကို default အနေနဲ့ သုံးပါတယ် — agent တစ်ခုကို override လုပ်ထားရင် (သို့) target က `NO_PROXY` နဲ့ ကိုက်ညီနေရင် ကလွဲပါတယ်။

### Proxy ကို Programmatically ပြင်ဆင်သတ်မှတ်ခြင်း

Proxy ကို programmatically (code ကနေ) configure လုပ်ဖို့ — agent တွေကို override လုပ်ပါ။ ဒါက လောလောဆယ် `https.request()` နဲ့ သူ့ပေါ်မှာ တည်ဆောက်ထားတဲ့ `https.get()` လိုမျိုး methods တွေမှာ support လုပ်ပါတယ်။

Request တစ်ခုချင်းစီအတွက် agent ကို override လုပ်ဖို့ — `http.request()`/`https.request()` နဲ့ အလားတူ methods တွေမှာ `agent` option ကို သုံးပါ:

```js
const https = require('node:https');

// Custom proxy support ပါတဲ့ custom agent တစ်ခု ဖန်တီးခြင်း။
const agent = new https.Agent({
  proxyEnv: { HTTPS_PROXY: 'http://proxy.company.com:8080' },
});

https.request(
  {
    hostname: 'www.external.com',
    port: 443,
    path: '/',
    agent,
  },
  res => {
    // ဒီ request ကို HTTP protocol သုံးပြီး proxy.company.com:8080 ကနေတစ်ဆင့် ပို့ပေးပါလိမ့်မယ်။
  }
);
```

Agent ကို global အနေနဲ့ override လုပ်ဖို့ — `http.globalAgent` နဲ့ `https.globalAgent` တွေကို reset လုပ်ပါ:

**မှတ်ချက်**: Global agent တွေက `fetch()` ကိုတော့ သက်ရောက်မှု မရှိပါဘူး။

```js
const http = require('node:http');
const https = require('node:https');

http.globalAgent = new http.Agent({
  proxyEnv: { HTTP_PROXY: 'http://proxy.company.com:8080' },
});
https.globalAgent = new https.Agent({
  proxyEnv: { HTTPS_PROXY: 'http://proxy.company.com:8080' },
});

// ဒီနောက် request တွေ အားလုံးက သူတို့ဘာသာ agent option ကို override မလုပ်ထားရင်
// configure လုပ်ထားတဲ့ proxy တွေကို သုံးပါလိမ့်မယ်။
http.request('http://external.com', res => {
  /* ... */
});
https.request('https://external.com', res => {
  /* ... */
});
```

### Authentication ပါတဲ့ Proxy တွေ သုံးခြင်း

Proxy က authentication လိုအပ်ရင် — proxy URL ထဲမှာ credentials တွေ ထည့်ပါ:

`export HTTPS_PROXY=http://username:password@proxy.company.com:8080`

**Security Note**: Env files တွေထဲမှာ credentials တွေ commit မလုပ်ပါနဲ့။ Secret manager နဲ့ programmatic configuration ကို ပိုဦးစားပေးပါ။

### Proxy Bypass ပြင်ဆင်သတ်မှတ်ခြင်း

`NO_PROXY` variable က အောက်ပါတွေကို support လုပ်ပါတယ်:

- `*` — host အားလုံးအတွက် proxy ကို ကျော်လိုက်တယ်
- `company.com` — hostname နဲ့ အတိအကျ တိုက်ဆိုင်တာ
- `.company.com` — domain suffix နဲ့ တိုက်ဆိုင်တာ (`sub.company.com` ပါ အကျုံးဝင်တယ်)
- `*.company.com` — wildcard domain နဲ့ တိုက်ဆိုင်တာ
- `192.168.1.100` — IP address နဲ့ အတိအကျ တိုက်ဆိုင်တာ
- `192.168.1.1-192.168.1.100` — IP address range
- `company.com:8080` — port သတ်မှတ်ထားတဲ့ hostname

Target တစ်ခုက `NO_PROXY` နဲ့ တိုက်ဆိုင်ရင် — request က proxy ကို ကျော်ပြီး တိုက်ရိုက် သွားပါတယ်။

## Certificate Authority (CA) ပြင်ဆင်သတ်မှတ်ခြင်း

Default အနေနဲ့ Node.js က Mozilla ရဲ့ bundled root CA တွေကို သုံးပြီး — OS store ကို တိုင်ပင်တာ မရှိပါဘူး။ Enterprise environment တွေ အများကြီးမှာ internal CA တွေကို OS store ထဲ install လုပ်ထားပြီး — internal service တွေဆီ ချိတ်ဆက်တဲ့အခါ trust လုပ်ဖို့ မျှော်လင့်ထားတတ်ပါတယ်။ ဒီလို CA တွေက လက်မှတ်ထိုးထားတဲ့ certificate တွေဆီ ချိတ်ဆက်တာက validation မှာ error တွေနဲ့ ကျရှုံးနိုင်ပါတယ်။ ဥပမာ:

```text
Error: self signed certificate in certificate chain
```

Node.js v22.19.0, v24.6.0 နဲ့ အထက်ကစပြီး — Node.js ကို system ရဲ့ certificate store ကို သုံးပြီး ဒီလို custom CA တွေကို trust လုပ်အောင် configure လုပ်လို့ရပါတယ်။

### System Store ကနေ CA Certificates တွေ ထည့်ခြင်း

- Environment variable ကနေ: `NODE_USE_SYSTEM_CA=1 node app.js`
- Command-line flag ကနေ: `node --use-system-ca app.js`

Enable လုပ်ထားရင် Node.js က system CA တွေကို load ပြီး — TLS validation အတွက် သူ့ရဲ့ bundled CA တွေအပြင် ဒါတွေကိုပါ ထပ်သုံးပါတယ်။

Node.js က platform ပေါ်မူတည်ပြီး certificate တွေကို နေရာ အမျိုးမျိုးကနေ ဖတ်ပါတယ်:

- Windows: Windows Certificate Store (Windows Crypto API ကနေတစ်ဆင့်)
- macOS: macOS Keychain
- Linux: OpenSSL defaults — ပုံမှန်အားဖြင့် `SSL_CERT_FILE`/`SSL_CERT_DIR` ကနေဖြစ်ပြီး — OpenSSL build ပေါ်မူတည်ပြီး `/etc/ssl/cert.pem` နဲ့ `/etc/ssl/certs/` လိုမျိုး path တွေကနေလည်း ဖြစ်ပါတယ်

Node.js က Chromium နဲ့ ဆင်တူတဲ့ policy တစ်ခုကို လိုက်နာပါတယ်။ အသေးစိတ်ကို [Node.js documentation](https://nodejs.org/api/cli.html#--use-system-ca) မှာ ကြည့်ပါ။

### နောက်ထပ် CA Certificates တွေ ထည့်ခြင်း

System store ကို အားမကိုးဘဲ — သီးခြား CA certificate တွေ ထည့်ဖို့:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem
node app.js
```

File ထဲမှာ PEM-encoded certificate တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ပါဝင်သင့်ပါတယ်။

#### Options တွေ ပေါင်းစပ်ခြင်း

`NODE_USE_SYSTEM_CA` ကို `NODE_EXTRA_CA_CERTS` နဲ့ ပေါင်းစပ်သုံးလို့ရပါတယ်:

```bash
export NODE_USE_SYSTEM_CA=1
export NODE_EXTRA_CA_CERTS=/path/to/additional-cas.pem
node app.js
```

နှစ်ခုလုံး enable လုပ်ထားရင် — Node.js က bundled CA တွေ၊ system CA တွေနဲ့ `NODE_EXTRA_CA_CERTS` က သတ်မှတ်ထားတဲ့ နောက်ထပ် certificate တွေ အားလုံးကို trust လုပ်ပါတယ်။

### CA Certificates တွေကို Programmatically ပြင်ဆင်သတ်မှတ်ခြင်း

#### Global CA Certificates တွေ ပြင်ဆင်သတ်မှတ်ခြင်း

Global CA certificate တွေကို configure လုပ်ဖို့ — [tls.getCACertificates()](https://nodejs.org/api/tls.html#tlsgetcacertificatestype) နဲ့ [tls.setDefaultCACertificates()](https://nodejs.org/api/tls.html#tlssetdefaultcacertificatescerts) တွေကို သုံးပါ။ ဥပမာ — default store ထဲ system certificate တွေ ထည့်ဖို့:

```js
const https = require('node:https');
const tls = require('node:tls');
const currentCerts = tls.getCACertificates('default');
const systemCerts = tls.getCACertificates('system');
tls.setDefaultCACertificates([...currentCerts, ...systemCerts]);

// ဒီနောက် request တွေက verification လုပ်တဲ့အခါ system certificate တွေကို သုံးပါတယ်။
https.get('https://internal.company.com', res => {
  /* ... */
});
fetch('https://internal.company.com').then(res => {
  /* ... */
});
```

#### Request တစ်ခုချင်းစီအတွက် CA Certificates တွေ ပြင်ဆင်သတ်မှတ်ခြင်း

CA certificate တွေကို request တစ်ခုချင်းစီအလိုက် override လုပ်ဖို့ — `ca` option ကို သုံးပါ။ ဒါက လောလောဆယ် `tls.connect()`/`https.request()` နဲ့ သူ့ပေါ်မှာ တည်ဆောက်ထားတဲ့ `https.get()` လိုမျိုး methods တွေမှာပဲ support လုပ်ပါတယ်။

```js
const https = require('node:https');
const specialCerts = ['-----BEGIN CERTIFICATE-----\n...'];
https.get(
  {
    hostname: 'internal.company.com',
    port: 443,
    path: '/',
    method: 'GET',
    // `ca` option က defaults တွေကို အစားထိုးပါတယ် — လိုအပ်ရင် bundled certs တွေကို ထပ်ပေါင်းပေးပါ။
    ca: specialCerts,
  },
  res => {
    /* ... */
  }
);
```

## ဆက်ဖတ်ရန်

- [Anatomy of an HTTP Transaction](/docs/nodejs/anatomy-of-an-http-transaction) — HTTP request/response တွေ ဘယ်လို အလုပ်လုပ်လဲ
- [Fetching Data with Node.js](/docs/nodejs/fetching-data-with-nodejs) — Node.js မှာ HTTP request တွေ ပို့ခြင်း
- [Node.js Environment Variables](/docs/nodejs/nodejs-environment-variables) — environment variable တွေ ဖတ်ခြင်းနဲ့ အသုံးပြုခြင်း
