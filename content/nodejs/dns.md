---
title: "DNS"
description: "node:dns module — DNS lookup/resolve functions (callback + dns/promises versions)၊ Resolver classes၊ error codes စသည်။"
order: 92
source: "https://nodejs.org/api/dns.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:dns` module က name resolution (host name များကို IP လိပ်စာများအဖြစ် ရှာဖွေဖော်ထုတ်ခြင်း) ကို လုပ်ဆောင်ပေးနိုင်ပါတယ်။ ဥပမာ — host name တွေရဲ့ IP လိပ်စာတွေကို ရှာဖွေဖို့ သုံးနိုင်ပါတယ်။

[Domain Name System (DNS)][] ကို အစွဲပြုပြီး နာမည် ပေးထားပေမယ့် — ဒီ module က lookup တွေမှာ DNS protocol ကို အမြဲတမ်း သုံးတာတော့ မဟုတ်ပါဘူး။ [`dns.lookup()`][] က operating system ရဲ့ ယန္တရားတွေကို သုံးပြီး name resolution လုပ်တာမို့ — network communication တစ်စုံတစ်ရာ မလုပ်ရဘဲနဲ့လည်း ဖြစ်နိုင်ပါတယ်။ တစ်တန်းတည်းက အခြား application တွေ လုပ်ဆောင်သလိုမျိုး name resolution လုပ်ချင်ရင် [`dns.lookup()`][] ကို သုံးပါ။

```mjs
import dns from 'node:dns';

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```
```cjs
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```

`node:dns` module ထဲက တခြား function တွေ အားလုံးကတော့ name resolution လုပ်ဖို့ DNS server အစစ်တစ်ခုနဲ့ ချိတ်ဆက်ပါတယ်။ သူတို့က DNS queries တွေကို လုပ်ဆောင်ဖို့ network ကို အမြဲတမ်း သုံးပါတယ်။ ဒီ function တွေက [`dns.lookup()`][] သုံးတဲ့ configuration file အစုအဝေး (ဥပမာ `/etc/hosts`) ကို မသုံးပါဘူး။ တခြား name-resolution ယန္တရားတွေကို ရှောင်ကွင်းပြီး DNS queries တွေကို အမြဲတမ်း လုပ်ဆောင်ချင်ရင် ဒီ function တွေကို သုံးပါ။

```mjs
import dns from 'node:dns';

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```
```cjs
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```

အသေးစိတ်ကို [Implementation considerations section][] မှာ ကြည့်ပါ။

## Class: `dns.Resolver`

DNS requests တွေအတွက် သီးခြား သီးသန့် resolver တစ်ခု ဖြစ်ပါတယ်။

Resolver အသစ်တစ်ခု ဖန်တီးတဲ့အခါ default server settings တွေကို သုံးပါတယ်။ [`resolver.setServers()`][`dns.setServers()`] နဲ့ resolver တစ်ခုအတွက် သုံးမယ့် server တွေကို သတ်မှတ်လိုက်ရင် — တခြား resolver တွေကို သက်ရောက်မှု မရှိပါဘူး:

```mjs
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
```cjs
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

`node:dns` module ထဲက အောက်ပါ method တွေကို ရရှိနိုင်ပါတယ်:

* [`resolver.getServers()`][`dns.getServers()`]
* [`resolver.resolve()`][`dns.resolve()`]
* [`resolver.resolve4()`][`dns.resolve4()`]
* [`resolver.resolve6()`][`dns.resolve6()`]
* [`resolver.resolveAny()`][`dns.resolveAny()`]
* [`resolver.resolveCaa()`][`dns.resolveCaa()`]
* [`resolver.resolveCname()`][`dns.resolveCname()`]
* [`resolver.resolveMx()`][`dns.resolveMx()`]
* [`resolver.resolveNaptr()`][`dns.resolveNaptr()`]
* [`resolver.resolveNs()`][`dns.resolveNs()`]
* [`resolver.resolvePtr()`][`dns.resolvePtr()`]
* [`resolver.resolveSoa()`][`dns.resolveSoa()`]
* [`resolver.resolveSrv()`][`dns.resolveSrv()`]
* [`resolver.resolveTlsa()`][`dns.resolveTlsa()`]
* [`resolver.resolveTxt()`][`dns.resolveTxt()`]
* [`resolver.reverse()`][`dns.reverse()`]
* [`resolver.setServers()`][`dns.setServers()`]
### `Resolver([options])`

Resolver အသစ်တစ်ခု ဖန်တီးပါတယ်။

* `options` {Object}
  * `timeout` {integer} Query timeout ကို milliseconds နဲ့ သတ်မှတ်သည် — default timeout သုံးချင်ရင်တော့ `-1` ဖြစ်သည်။
  * `tries` {integer} Resolver က name server တစ်ခုချင်းစီကို မစွန့်လွှတ်ခင် ဆက်သွယ်ကြည့်မယ့် အကြိမ်အရေအတွက် ဖြစ်သည်။ **Default:** `4`
  * `maxTimeout` {integer} အများဆုံး retry timeout ကို milliseconds နဲ့ သတ်မှတ်သည်။ **Default:** `0` — disabled ဖြစ်သည်။

### `resolver.cancel()`

ဒီ resolver က လုပ်ဆောင်နေဆဲ (outstanding) DNS queries တွေ အားလုံးကို ပယ်ဖျက်ပါတယ်။ သက်ဆိုင်တဲ့ callbacks တွေကို `ECANCELLED` code ပါတဲ့ error တစ်ခုနဲ့ ခေါ်ပေးပါလိမ့်မယ်။

### `resolver.setLocalAddress([ipv4][, ipv6])`

* `ipv4` {string} IPv4 လိပ်စာတစ်ခုရဲ့ string ပုံစံ ဖြစ်သည်။ **Default:** `'0.0.0.0'`
* `ipv6` {string} IPv6 လိပ်စာတစ်ခုရဲ့ string ပုံစံ ဖြစ်သည်။ **Default:** `'::0'`

Resolver instance က သတ်မှတ်ထားတဲ့ IP လိပ်စာကနေ သူ့ရဲ့ requests တွေကို ပို့ပါလိမ့်မယ်။ ဒါက multi-homed systems တွေမှာ program တွေကို outbound interfaces တွေ သတ်မှတ်ခွင့် ပေးပါတယ်။

v4 (သို့) v6 လိပ်စာ သတ်မှတ်မထားရင် — default တန်ဖိုးကို သုံးပြီး operating system က local address တစ်ခုကို အလိုအလျောက် ရွေးချယ်ပါလိမ့်မယ်။

Resolver က IPv4 DNS servers တွေဆီ requests လုပ်တဲ့အခါ v4 local address ကို သုံးပြီး — IPv6 DNS servers တွေဆီ requests လုပ်တဲ့အခါ v6 local address ကို သုံးပါတယ်။ Resolution requests တွေရဲ့ `rrtype` က သုံးမယ့် local address အပေါ် သက်ရောက်မှု မရှိပါဘူး။

## `dns.getServers()`

* Returns: {string\[]}

DNS resolution အတွက် လက်ရှိ သတ်မှတ်ထားတဲ့ IP လိပ်စာ string တွေရဲ့ array ကို [RFC 5952][] ပုံစံအတိုင်း ဖော်မတ်ပြီး ပြန်ပေးပါတယ်။ Custom port တစ်ခု သုံးထားရင် string ထဲမှာ port အပိုင်း ပါဝင်ပါလိမ့်မယ်။

```json
[
  "8.8.8.8",
  "2001:4860:4860::8888",
  "8.8.8.8:1053",
  "[2001:4860:4860::8888]:1053",
]
```

## `dns.lookup(hostname[, options], callback)`

* `hostname` {string}
* `options` {integer | Object}
  * `family` {integer|string} Record family ဖြစ်ပြီး `4`, `6` (သို့) `0` ဖြစ်ရပါမယ်။ Backward compatibility အတွက် `'IPv4'` နဲ့ `'IPv6'` တန်ဖိုးတွေကို `4` နဲ့ `6` အဖြစ် အသီးသီး သတ်မှတ်ပေးပါတယ်။ `0` တန်ဖိုးက IPv4 (သို့) IPv6 လိပ်စာ တစ်ခုခုကို ပြန်ပေးတယ်လို့ ဆိုလိုပါတယ်။ `0` ကို `{ all: true }` (အောက်မှာ ကြည့်ပါ) နဲ့ တွဲသုံးရင် — system ရဲ့ DNS resolver ပေါ် မူတည်ပြီး IPv4 နဲ့ IPv6 လိပ်စာတွေထဲက တစ်ခု (သို့) နှစ်ခုလုံးကို ပြန်ပေးပါတယ်။ **Default:** `0`.
  * `hints` {number} [supported `getaddrinfo` flags][] ထဲက flag တစ်ခု (သို့) အများကြီး ဖြစ်သည်။ Flag အများကြီးကို bitwise `OR` လုပ်ပြီး ပေါင်းပေးနိုင်ပါတယ်။
  * `all` {boolean} `true` ဆိုရင် callback က resolve လုပ်ပြီးသား လိပ်စာ အားလုံးကို array အနေနဲ့ ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ လိပ်စာ တစ်ခုတည်းကို ပြန်ပေးပါတယ်။ **Default:** `false`.
  * `order` {string} `verbatim` ဆိုရင် resolve လုပ်ထားတဲ့ လိပ်စာတွေကို စီစဉ်မှု မရှိဘဲ ပြန်ပေးပါတယ်။ `ipv4first` ဆိုရင် IPv4 လိပ်စာတွေကို IPv6 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပြီး စီပေးပါတယ်။ `ipv6first` ဆိုရင် IPv6 လိပ်စာတွေကို IPv4 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပြီး စီပေးပါတယ်။ **Default:** `verbatim` (လိပ်စာတွေကို ပြန်စီစဉ် မပေးပါ)။ Default တန်ဖိုးကို [`dns.setDefaultResultOrder()`][] (သို့) [`--dns-result-order`][] သုံးပြီး ပြင်ဆင်နိုင်ပါတယ်။
  * `verbatim` {boolean} `true` ဆိုရင် callback က IPv4 နဲ့ IPv6 လိပ်စာတွေကို DNS resolver ပြန်ပေးလိုက်တဲ့ အစီအစဉ်အတိုင်း လက်ခံရပါတယ်။ `false` ဆိုရင် IPv4 လိပ်စာတွေကို IPv6 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပေးပါတယ်။ ဒီ option က `order` ကို ဦးစားပေးပြီး deprecated ဖြစ်တော့မှာ ဖြစ်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားရင် `order` က precedence ပိုမြင့်ပါတယ်။ Code အသစ်တွေမှာ `order` တစ်ခုတည်းကိုပဲ သုံးသင့်ပါတယ်။ **Default:** `true` (လိပ်စာတွေကို ပြန်စီစဉ် မပေးပါ)။ Default တန်ဖိုးကို [`dns.setDefaultResultOrder()`][] (သို့) [`--dns-result-order`][] သုံးပြီး ပြင်ဆင်နိုင်ပါတယ်။
* `callback` {Function}
  * `err` {Error}
  * `address` {string} IPv4 (သို့) IPv6 လိပ်စာတစ်ခုရဲ့ string ပုံစံ ဖြစ်သည်။ `options.all` က `true` ဆိုရင် ထည့်မပေးပါ။
  * `family` {integer} `address` ရဲ့ family ကို ဖော်ပြတဲ့ `4` (သို့) `6` ဖြစ်သည် — လိပ်စာက IPv4 (သို့) IPv6 မဟုတ်ရင်တော့ `0` ဖြစ်သည်။ `0` ဆိုတာ operating system သုံးတဲ့ name resolution service ထဲမှာ bug ရှိနေတာရဲ့ လက္ခဏာ ဖြစ်နိုင်ပါတယ်။ `options.all` က `true` ဆိုရင် ထည့်မပေးပါ။
  * `addresses` {Object\[]} `options.all` က `true` ဆိုရင် address objects တွေရဲ့ array ဖြစ်သည်။ Object တစ်ခုချင်းစီမှာ အောက်ပါ property တွေ ရှိပါတယ်:
    * `address` {string} IPv4 (သို့) IPv6 လိပ်စာတစ်ခုရဲ့ string ပုံစံ ဖြစ်သည်။
    * `family` {integer} `address` ရဲ့ family ကို ဖော်ပြတဲ့ `4` (သို့) `6` ဖြစ်သည်။

Host name (ဥပမာ `'nodejs.org'`) တစ်ခုကို ပထမဆုံး တွေ့ရှိတဲ့ A (IPv4) (သို့) AAAA (IPv6) record အဖြစ် resolve လုပ်ပေးပါတယ်။ `option` property တွေ အားလုံးက မထည့်လည်း ရပါတယ်။ `options` က integer ဆိုရင် `4` (သို့) `6` ဖြစ်ရပါမယ် — `options` မပေးထားဘူးဆိုရင် တွေ့ရှိတဲ့ IPv4 (သို့) IPv6 လိပ်စာတွေ၊ (သို့) နှစ်မျိုးလုံးကို ပြန်ပေးပါတယ်။

`all` option ကို `true` ပေးထားရင် `callback` ရဲ့ arguments တွေက `(err, addresses)` အဖြစ် ပြောင်းသွားပြီး — `addresses` က `address` နဲ့ `family` property တွေ ပါတဲ့ objects တွေရဲ့ array ဖြစ်ပါတယ်။

Error ဖြစ်ရင် `err` က [`Error`][] object တစ်ခု ဖြစ်ပြီး `err.code` က error code ဖြစ်ပါတယ်။ `err.code` က host name မရှိတဲ့အခါမှာတင် မကဘဲ — file descriptors မရနိုင်တာလိုမျိုး lookup က တခြားနည်းတွေနဲ့ ကျရှုံးတဲ့အခါတွေမှာပါ `'ENOTFOUND'` ဖြစ်မယ်ဆိုတာ သတိပြုထားပါ။

`dns.lookup()` က DNS protocol နဲ့ မဆက်စပ်ဘဲ ရှိနေတတ်ပါတယ်။ ဒီ implementation က operating system ရဲ့ ယန္တရားတစ်ခုကို သုံးပြီး — name တွေကို addresses တွေနဲ့ ချိတ်ဆက်ပေးသလို — အပြန်အလှန် အားဖြင့် addresses တွေကို name တွေနဲ့လည်း ချိတ်ဆက်ပေးပါတယ်။ ဒီ implementation က Node.js program တွေရဲ့ အပြုအမူအပေါ် သိမ်မွေ့ပေမယ့် အရေးကြီးတဲ့ အကျိုးဆက်တွေ ရှိနိုင်ပါတယ်။ `dns.lookup()` မသုံးခင် [Implementation considerations section][] ကို အချိန်ယူပြီး ဖတ်ပေးပါ။

အသုံးပြုပုံ ဥပမာ:

```mjs
import dns from 'node:dns';
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
```cjs
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```

ဒီ method ကို [`util.promisify()`][] လုပ်ထားတဲ့ version အနေနဲ့ ခေါ်ပြီး `all` ကို `true` မပေးထားဘူးဆိုရင် — `address` နဲ့ `family` property တွေ ပါတဲ့ `Object` တစ်ခုအတွက် `Promise` ကို ပြန်ပေးပါတယ်။

### Supported getaddrinfo flags (ပံ့ပိုးပေးထားသော getaddrinfo flags များ)

အောက်ပါ flag တွေကို [`dns.lookup()`][] ရဲ့ `hints` အဖြစ် ပေးနိုင်ပါတယ်။

* `dns.ADDRCONFIG`: ပြန်ပေးတဲ့ address type တွေကို system ပေါ်မှာ သတ်မှတ်ထားတဲ့ non-loopback addresses တွေရဲ့ type များသာ ကန့်သတ်ပါတယ်။ ဥပမာ — လက်ရှိ system မှာ IPv4 လိပ်စာ အနည်းဆုံး တစ်ခု သတ်မှတ်ထားမှသာ IPv4 လိပ်စာတွေကို ပြန်ပေးပါတယ်။
* `dns.V4MAPPED`: IPv6 family ကို သတ်မှတ်ထားပေမယ့် IPv6 လိပ်စာ တစ်ခုမှ မတွေ့ခဲ့ရင် — IPv4 mapped IPv6 လိပ်စာတွေကို ပြန်ပေးပါတယ်။ အချို့ operating system တွေ (ဥပမာ FreeBSD 10.1) မှာတော့ ပံ့ပိုးမှု မရှိပါဘူး။
* `dns.ALL`: `dns.V4MAPPED` ကို သတ်မှတ်ထားရင် — resolve လုပ်ထားတဲ့ IPv6 လိပ်စာတွေအပြင် IPv4 mapped IPv6 လိပ်စာတွေကိုပါ ပြန်ပေးပါတယ်။
## `dns.lookupService(address, port, callback)`

* `address` {string}
* `port` {number}
* `callback` {Function}
  * `err` {Error}
  * `hostname` {string} ဥပမာ `example.com`
  * `service` {string} ဥပမာ `http`

ပေးထားတဲ့ `address` နဲ့ `port` ကို operating system ရဲ့ အောက်ခံ `getnameinfo` implementation ကို သုံးပြီး host name နဲ့ service အဖြစ် resolve လုပ်ပေးပါတယ်။

`address` က တရားဝင် IP လိပ်စာ မဟုတ်ရင် `TypeError` တစ်ခု throw လုပ်ပါလိမ့်မယ်။ `port` ကို number အဖြစ် အတင်းပြောင်းပေးပါတယ်။ အဲဒါက တရားဝင် port မဟုတ်ရင်လည်း `TypeError` throw လုပ်ပါလိမ့်မယ်။

Error ဖြစ်ရင် `err` က [`Error`][] object ဖြစ်ပြီး `err.code` က error code ဖြစ်ပါတယ်။

```mjs
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```
```cjs
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```

ဒီ method ကို [`util.promisify()`][] လုပ်ထားတဲ့ version အနေနဲ့ ခေါ်ရင် — `hostname` နဲ့ `service` property တွေ ပါတဲ့ `Object` တစ်ခုအတွက် `Promise` ကို ပြန်ပေးပါတယ်။

## `dns.resolve(hostname[, rrtype], callback)`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `rrtype` {string} Resource record type ဖြစ်သည်။ **Default:** `'A'`.
* `callback` {Function}
  * `err` {Error}
  * `records` {string\[] | Object\[] | Object}

DNS protocol ကို သုံးပြီး host name (ဥပမာ `'nodejs.org'`) တစ်ခုကို resource records တွေရဲ့ array အဖြစ် resolve လုပ်ပေးပါတယ်။ `callback` function မှာ `(err, records)` ဆိုတဲ့ arguments တွေ ရှိပါတယ်။ အောင်မြင်ရင် `records` က resource records တွေရဲ့ array ဖြစ်ပါလိမ့်မယ်။ တစ်ခုချင်းစီရဲ့ ရလဒ် type နဲ့ ဖွဲ့စည်းပုံက `rrtype` ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်:

| `rrtype`  | `records` ထဲ ပါဝင်သော အရာများ | Result type (ရလဒ် အမျိုးအစား) | Shorthand method (အတိုကောက် method) |
| --------- | ------------------------------ | ----------- | ------------------------ |
| `'A'`     | IPv4 လိပ်စာများ (default)       | {string}    | [`dns.resolve4()`][]     |
| `'AAAA'`  | IPv6 လိပ်စာများ                 | {string}    | [`dns.resolve6()`][]     |
| `'ANY'`   | record အမျိုးမျိုး              | {Object}    | [`dns.resolveAny()`][]   |
| `'CAA'`   | CA ခွင့်ပြုချက် record များ     | {Object}    | [`dns.resolveCaa()`][]   |
| `'CNAME'` | canonical name record များ      | {string}    | [`dns.resolveCname()`][] |
| `'MX'`    | mail exchange record များ       | {Object}    | [`dns.resolveMx()`][]    |
| `'NAPTR'` | name authority pointer record များ | {Object} | [`dns.resolveNaptr()`][] |
| `'NS'`    | name server record များ         | {string}    | [`dns.resolveNs()`][]    |
| `'PTR'`   | pointer record များ             | {string}    | [`dns.resolvePtr()`][]   |
| `'SOA'`   | start of authority record များ  | {Object}    | [`dns.resolveSoa()`][]   |
| `'SRV'`   | service record များ             | {Object}    | [`dns.resolveSrv()`][]   |
| `'TLSA'`  | certificate association record များ | {Object} | [`dns.resolveTlsa()`][]  |
| `'TXT'`   | text record များ                | {string\[]} | [`dns.resolveTxt()`][]   |

Error ဖြစ်ရင် `err` က [`Error`][] object ဖြစ်ပြီး `err.code` က [DNS error codes][] ထဲက တစ်ခု ဖြစ်ပါတယ်။

## `dns.resolve4(hostname[, options], callback)`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `options` {Object}
  * `ttl` {boolean} Record တစ်ခုချင်းစီရဲ့ Time-To-Live (TTL) တန်ဖိုးကို ထုတ်ယူပေးပါတယ်။ `true` ဆိုရင် callback က string array အစား — TTL ကို seconds နဲ့ ဖော်ပြထားတဲ့ `{ address: '1.2.3.4', ttl: 60 }` objects တွေရဲ့ array ကို လက်ခံရပါတယ်။
* `callback` {Function}
  * `err` {Error}
  * `addresses` {string\[] | Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် IPv4 လိပ်စာတွေ (`A` records) ကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ IPv4 လိပ်စာတွေရဲ့ array (ဥပမာ `['74.125.79.104', '74.125.79.105', '74.125.79.106']`) ပါဝင်ပါလိမ့်မယ်။

## `dns.resolve6(hostname[, options], callback)`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `options` {Object}
  * `ttl` {boolean} Record တစ်ခုချင်းစီရဲ့ Time-To-Live (TTL) တန်ဖိုးကို ထုတ်ယူပေးပါတယ်။ `true` ဆိုရင် callback က string array အစား — TTL ကို seconds နဲ့ ဖော်ပြထားတဲ့ `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` objects တွေရဲ့ array ကို လက်ခံရပါတယ်။
* `callback` {Function}
  * `err` {Error}
  * `addresses` {string\[] | Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် IPv6 လိပ်စာတွေ (`AAAA` records) ကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ IPv6 လိပ်စာတွေရဲ့ array ပါဝင်ပါလိမ့်မယ်။

## `dns.resolveAny(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `ret` {Object\[]}

DNS protocol ကို သုံးပြီး record တွေ အားလုံး (ထို့ပြင် `ANY` (သို့) `*` query လို့လည်း ခေါ်သည်) ကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `ret` argument က record အမျိုးမျိုး ပါဝင်တဲ့ array တစ်ခု ဖြစ်ပါလိမ့်မယ်။ Object တစ်ခုချင်းစီမှာ လက်ရှိ record ရဲ့ type ကို ဖော်ပြတဲ့ `type` property ပါဝင်ပြီး — `type` ပေါ် မူတည်ပြီး object ပေါ်မှာ နောက်ထပ် property တွေ ပါဝင်လာပါလိမ့်မယ်:

| Type (အမျိုးအစား) | Properties (property များ) |
| --------- | -------------------------------------------------------------------------------- |
| `'A'`     | `address`/`ttl`                                                                  |
| `'AAAA'`  | `address`/`ttl`                                                                  |
| `'CAA'`   | [`dns.resolveCaa()`][] ကို ကိုးကားပါ                                           |
| `'CNAME'` | `value`                                                                          |
| `'MX'`    | [`dns.resolveMx()`][] ကို ကိုးကားပါ                                            |
| `'NAPTR'` | [`dns.resolveNaptr()`][] ကို ကိုးကားပါ                                         |
| `'NS'`    | `value`                                                                          |
| `'PTR'`   | `value`                                                                          |
| `'SOA'`   | [`dns.resolveSoa()`][] ကို ကိုးကားပါ                                            |
| `'SRV'`   | [`dns.resolveSrv()`][] ကို ကိုးကားပါ                                            |
| `'TLSA'`  | [`dns.resolveTlsa()`][] ကို ကိုးကားပါ                                           |
| `'TXT'`   | ဒီ record type ထဲမှာ `entries` လို့ ခေါ်တဲ့ array property တစ်ခု ပါဝင်ပြီး — [`dns.resolveTxt()`][] ကို ရည်ညွှန်းပါတယ်၊ ဥပမာ `{ entries: ['...'], type: 'TXT' }` |

ဒီမှာ callback ဆီ ပို့လိုက်တဲ့ `ret` object ရဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ်:

```js
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ];
```

DNS server operator တွေက `ANY` queries တွေကို ပြန်မဖြေဘဲ နေဖို့ ရွေးချယ်နိုင်ပါတယ်။ [`dns.resolve4()`][], [`dns.resolveMx()`][] စတဲ့ method တစ်ခုချင်းစီကို ခေါ်တာက ပိုကောင်းပါတယ်။ အသေးစိတ်အတွက် [RFC 8482][] ကို ကြည့်ပါ။

## `dns.resolveCname(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {string\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် `CNAME` records တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ `hostname` အတွက် ရရှိနိုင်တဲ့ canonical name records တွေရဲ့ array (ဥပမာ `['bar.example.com']`) ပါဝင်ပါလိမ့်မယ်။

## `dns.resolveCaa(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `records` {Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် `CAA` records တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `records` argument မှာ `hostname` အတွက် ရရှိနိုင်တဲ့ certification authority authorization records တွေရဲ့ array (ဥပမာ `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`) ပါဝင်ပါလိမ့်မယ်။

## `dns.resolveMx(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် mail exchange records (`MX` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ `priority` နဲ့ `exchange` property နှစ်ခုလုံး ပါဝင်တဲ့ objects တွေရဲ့ array (ဥပမာ `[{priority: 10, exchange: 'mx.example.com'}, ...]`) ပါဝင်ပါလိမ့်မယ်။

## `dns.resolveNaptr(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် regular expression အခြေပြု record တွေ (`NAPTR` records) ကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array ဖြစ်ပါလိမ့်မယ်:

* `flags`
* `service`
* `regexp`
* `replacement`
* `order`
* `preference`

```js
({
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100,
});
```
## `dns.resolveNs(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {string\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် name server records (`NS` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ `hostname` အတွက် ရရှိနိုင်တဲ့ name server records တွေရဲ့ array (ဥပမာ `['ns1.example.com', 'ns2.example.com']`) ပါဝင်ပါလိမ့်မယ်။

## `dns.resolvePtr(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {string\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် pointer records (`PTR` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument က reply records တွေ ပါဝင်တဲ့ strings တွေရဲ့ array တစ်ခု ဖြစ်ပါလိမ့်မယ်။

## `dns.resolveSoa(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `address` {Object}

DNS protocol ကို သုံးပြီး `hostname` အတွက် start of authority record တစ်ခု (`SOA` record) ကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `address` argument မှာ အောက်ပါ property တွေ ပါဝင်တဲ့ object တစ်ခု ဖြစ်ပါလိမ့်မယ်:

* `nsname`
* `hostmaster`
* `serial`
* `refresh`
* `retry`
* `expire`
* `minttl`

```js
({
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600,
});
```

## `dns.resolveSrv(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `addresses` {Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် service records (`SRV` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `addresses` argument မှာ အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခု ဖြစ်ပါလိမ့်မယ်:

* `priority`
* `weight`
* `port`
* `name`

```js
({
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com',
});
```

## `dns.resolveTlsa(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `records` {Object\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် certificate associations (`TLSA` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `records` argument က အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခု ဖြစ်ပါတယ်:

* `certUsage`
* `selector`
* `match`
* `data`

```js
({
  certUsage: 3,
  selector: 1,
  match: 1,
  data: [ArrayBuffer],
});
```

## `dns.resolveTxt(hostname, callback)`

* `hostname` {string}
* `callback` {Function}
  * `err` {Error}
  * `records` {string\[]}

DNS protocol ကို သုံးပြီး `hostname` အတွက် text queries (`TXT` records) တွေကို resolve လုပ်ပေးပါတယ်။ `callback` function ဆီ ပို့လိုက်တဲ့ `records` argument က `hostname` အတွက် ရရှိနိုင်တဲ့ text records တွေရဲ့ two-dimensional array (ဥပမာ `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`) ဖြစ်ပါတယ်။ Sub-array တစ်ခုချင်းစီမှာ record တစ်ခုရဲ့ TXT chunks တွေ ပါဝင်ပါတယ်။ Use case ပေါ် မူတည်ပြီး ဒါတွေကို အတူတကွ ပေါင်းလိုက်လို့လည်း ရသလို — တစ်ခုချင်းစီ သီးခြားအနေနဲ့လည်း သုံးလို့ရပါတယ်။

## `dns.reverse(ip, callback)`

* `ip` {string}
* `callback` {Function}
  * `err` {Error}
  * `hostnames` {string\[]}

IPv4 (သို့) IPv6 လိပ်စာတစ်ခုကို host names တွေရဲ့ array အဖြစ် resolve လုပ်ပေးတဲ့ reverse DNS query တစ်ခုကို လုပ်ဆောင်ပါတယ်။

Error ဖြစ်ရင် `err` က [`Error`][] object ဖြစ်ပြီး `err.code` က [DNS error codes][] ထဲက တစ်ခု ဖြစ်ပါတယ်။

## `dns.setDefaultResultOrder(order)`

* `order` {string} `'ipv4first'`, `'ipv6first'` (သို့) `'verbatim'` ဖြစ်ရပါမယ်။

`order` ရဲ့ default တန်ဖိုးကို [`dns.lookup()`][] နဲ့ [`dnsPromises.lookup()`][] အတွက် သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးတွေကတော့:

* `ipv4first`: default `order` ကို `ipv4first` အဖြစ် သတ်မှတ်ပေးသည်။
* `ipv6first`: default `order` ကို `ipv6first` အဖြစ် သတ်မှတ်ပေးသည်။
* `verbatim`: default `order` ကို `verbatim` အဖြစ် သတ်မှတ်ပေးသည်။

Default က `verbatim` ဖြစ်ပြီး — [`dns.setDefaultResultOrder()`][] က [`--dns-result-order`][] ထက် priority ပိုမြင့်ပါတယ်။ [worker threads][] သုံးတဲ့အခါ main thread ကနေ [`dns.setDefaultResultOrder()`][] ခေါ်လိုက်ရင် — workers တွေထဲက default dns orders တွေကို သက်ရောက်မှာ မဟုတ်ပါဘူး။

## `dns.getDefaultResultOrder()`

[`dns.lookup()`][] နဲ့ [`dnsPromises.lookup()`][] မှာ `order` ရဲ့ default တန်ဖိုးကို ရယူပါတယ်။ တန်ဖိုးတွေကတော့:

* `ipv4first`: `order` က `ipv4first` အဖြစ် default ဖြစ်နေတဲ့ အခြေအနေအတွက် ဖြစ်သည်။
* `ipv6first`: `order` က `ipv6first` အဖြစ် default ဖြစ်နေတဲ့ အခြေအနေအတွက် ဖြစ်သည်။
* `verbatim`: `order` က `verbatim` အဖြစ် default ဖြစ်နေတဲ့ အခြေအနေအတွက် ဖြစ်သည်။

## `dns.setServers(servers)`

* `servers` {string\[]} [RFC 5952][] ဖော်မတ်နဲ့ ရေးထားတဲ့ လိပ်စာတွေရဲ့ array ဖြစ်သည်။

DNS resolution လုပ်တဲ့အခါ သုံးရမယ့် servers တွေရဲ့ IP လိပ်စာနဲ့ port ကို သတ်မှတ်ပေးပါတယ်။ `servers` argument က [RFC 5952][] ဖော်မတ်နဲ့ ရေးထားတဲ့ လိပ်စာတွေရဲ့ array ဖြစ်ပါတယ်။ Port က IANA ရဲ့ default DNS port (53) ဆိုရင် ချန်လိုက်လို့ ရပါတယ်။

```js
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```

မမှန်ကန်တဲ့ လိပ်စာတစ်ခု ပေးလိုက်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

DNS query တစ်ခု လုပ်ဆောင်နေချိန်မှာ `dns.setServers()` method ကို မခေါ်ရပါဘူး။

[`dns.setServers()`][] method က [`dns.resolve()`][], `dns.resolve*()` နဲ့ [`dns.reverse()`][] တို့ကိုပဲ သက်ရောက်ပါတယ် (အထူးသဖြင့် [`dns.lookup()`][] ကိုတော့ မသက်ရောက်ပါဘူး)။

ဒီ method က [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5.html) နဲ့ ပုံစံတူ အလုပ်လုပ်ပါတယ်။ ဆိုလိုတာက — ပထမဆုံး ပေးထားတဲ့ server နဲ့ resolve လုပ်ကြည့်လို့ `NOTFOUND` error ရလာရင် — `resolve()` method က နောက်ထပ် ပေးထားတဲ့ servers တွေနဲ့ ဆက်ပြီး resolve လုပ်ဖို့ မကြိုးစားပါဘူး။ အစောပိုင်း servers တွေ timeout ဖြစ်တာ (သို့) တခြား error တစ်ခုခု ဖြစ်မှသာ Fallback DNS servers တွေကို သုံးပါတယ်။
## DNS promises API (Promise အခြေပြု DNS API)

`dns.promises` API က callbacks တွေ သုံးမယ့်အစား — `Promise` objects တွေကို ပြန်ပေးတဲ့ asynchronous DNS methods တွေရဲ့ အခြားရွေးချယ်စရာ အစုံကို ပေးပါတယ်။ ဒီ API ကို `require('node:dns').promises` (သို့) `require('node:dns/promises')` ကနေ ရယူနိုင်ပါတယ်။

### Class: `dnsPromises.Resolver`

DNS requests တွေအတွက် သီးခြား သီးသန့် resolver တစ်ခု ဖြစ်ပါတယ်။

Resolver အသစ်တစ်ခု ဖန်တီးတဲ့အခါ default server settings တွေကို သုံးပါတယ်။ [`resolver.setServers()`][`dnsPromises.setServers()`] နဲ့ resolver တစ်ခုအတွက် သုံးမယ့် server တွေကို သတ်မှတ်လိုက်ရင် — တခြား resolver တွေကို သက်ရောက်မှု မရှိပါဘူး:

```mjs
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
const addresses = await resolver.resolve4('example.org');
```
```cjs
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternatively, the same code can be written using async-await style.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```

`dnsPromises` API ထဲက အောက်ပါ method တွေကို ရရှိနိုင်ပါတယ်:

* [`resolver.getServers()`][`dnsPromises.getServers()`]
* [`resolver.resolve()`][`dnsPromises.resolve()`]
* [`resolver.resolve4()`][`dnsPromises.resolve4()`]
* [`resolver.resolve6()`][`dnsPromises.resolve6()`]
* [`resolver.resolveAny()`][`dnsPromises.resolveAny()`]
* [`resolver.resolveCaa()`][`dnsPromises.resolveCaa()`]
* [`resolver.resolveCname()`][`dnsPromises.resolveCname()`]
* [`resolver.resolveMx()`][`dnsPromises.resolveMx()`]
* [`resolver.resolveNaptr()`][`dnsPromises.resolveNaptr()`]
* [`resolver.resolveNs()`][`dnsPromises.resolveNs()`]
* [`resolver.resolvePtr()`][`dnsPromises.resolvePtr()`]
* [`resolver.resolveSoa()`][`dnsPromises.resolveSoa()`]
* [`resolver.resolveSrv()`][`dnsPromises.resolveSrv()`]
* [`resolver.resolveTlsa()`][`dnsPromises.resolveTlsa()`]
* [`resolver.resolveTxt()`][`dnsPromises.resolveTxt()`]
* [`resolver.reverse()`][`dnsPromises.reverse()`]
* [`resolver.setServers()`][`dnsPromises.setServers()`]

### `resolver.cancel()`

ဒီ resolver က လုပ်ဆောင်နေဆဲ (outstanding) DNS queries တွေ အားလုံးကို ပယ်ဖျက်ပါတယ်။ သက်ဆိုင်တဲ့ promises တွေကို `ECANCELLED` code ပါတဲ့ error တစ်ခုနဲ့ reject လုပ်ပါလိမ့်မယ်။

### `dnsPromises.getServers()`

* Returns: {string\[]}

DNS resolution အတွက် လက်ရှိ သတ်မှတ်ထားတဲ့ IP လိပ်စာ string တွေရဲ့ array ကို [RFC 5952][] ပုံစံအတိုင်း ဖော်မတ်ပြီး ပြန်ပေးပါတယ်။ Custom port တစ်ခု သုံးထားရင် string ထဲမှာ port အပိုင်း ပါဝင်ပါလိမ့်မယ်။

```json
[
  "8.8.8.8",
  "2001:4860:4860::8888",
  "8.8.8.8:1053",
  "[2001:4860:4860::8888]:1053"
]
```

### `dnsPromises.lookup(hostname[, options])`

* `hostname` {string}
* `options` {integer | Object}
  * `family` {integer} Record family ဖြစ်ပြီး `4`, `6` (သို့) `0` ဖြစ်ရပါမယ်။ `0` တန်ဖိုးက IPv4 (သို့) IPv6 လိပ်စာ တစ်ခုခုကို ပြန်ပေးတယ်လို့ ဆိုလိုပါတယ်။ `0` ကို `{ all: true }` (အောက်မှာ ကြည့်ပါ) နဲ့ တွဲသုံးရင် — system ရဲ့ DNS resolver ပေါ် မူတည်ပြီး IPv4 နဲ့ IPv6 လိပ်စာတွေထဲက တစ်ခု (သို့) နှစ်ခုလုံးကို ပြန်ပေးပါတယ်။ **Default:** `0`.
  * `hints` {number} [supported `getaddrinfo` flags][] ထဲက flag တစ်ခု (သို့) အများကြီး ဖြစ်သည်။ Flag အများကြီးကို bitwise `OR` လုပ်ပြီး ပေါင်းပေးနိုင်ပါတယ်။
  * `all` {boolean} `true` ဆိုရင် `Promise` က လိပ်စာ အားလုံးနဲ့အတူ array အနေနဲ့ resolve လုပ်ပါတယ်။ မဟုတ်ရင်တော့ လိပ်စာ တစ်ခုတည်းကို ပြန်ပေးပါတယ်။ **Default:** `false`.
  * `order` {string} `verbatim` ဆိုရင် `Promise` က IPv4 နဲ့ IPv6 လိပ်စာတွေကို DNS resolver ပြန်ပေးလိုက်တဲ့ အစီအစဉ်အတိုင်း resolve လုပ်ပါတယ်။ `ipv4first` ဆိုရင် IPv4 လိပ်စာတွေကို IPv6 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပေးပါတယ်။ `ipv6first` ဆိုရင် IPv6 လိပ်စာတွေကို IPv4 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပေးပါတယ်။ **Default:** `verbatim` (လိပ်စာတွေကို ပြန်စီစဉ် မပေးပါ)။ Default တန်ဖိုးကို [`dns.setDefaultResultOrder()`][] (သို့) [`--dns-result-order`][] သုံးပြီး ပြင်ဆင်နိုင်ပါတယ်။ Code အသစ်တွေမှာ `{ order: 'verbatim' }` ကို သုံးသင့်ပါတယ်။
  * `verbatim` {boolean} `true` ဆိုရင် `Promise` က IPv4 နဲ့ IPv6 လိပ်စာတွေကို DNS resolver ပြန်ပေးလိုက်တဲ့ အစီအစဉ်အတိုင်း resolve လုပ်ပါတယ်။ `false` ဆိုရင် IPv4 လိပ်စာတွေကို IPv6 လိပ်စာတွေရဲ့ ရှေ့မှာ ထားပေးပါတယ်။ ဒီ option က `order` ကို ဦးစားပေးပြီး deprecated ဖြစ်တော့မှာ ဖြစ်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားရင် `order` က precedence ပိုမြင့်ပါတယ်။ Code အသစ်တွေမှာ `order` တစ်ခုတည်းကိုပဲ သုံးသင့်ပါတယ်။ **Default:** `true` (လိပ်စာတွေကို ပြန်စီစဉ် မပေးပါ)။ Default တန်ဖိုးကို [`dns.setDefaultResultOrder()`][] (သို့) [`--dns-result-order`][] သုံးပြီး ပြင်ဆင်နိုင်ပါတယ်။

Host name (ဥပမာ `'nodejs.org'`) တစ်ခုကို ပထမဆုံး တွေ့ရှိတဲ့ A (IPv4) (သို့) AAAA (IPv6) record အဖြစ် resolve လုပ်ပေးပါတယ်။ `option` property တွေ အားလုံးက မထည့်လည်း ရပါတယ်။ `options` က integer ဆိုရင် `4` (သို့) `6` ဖြစ်ရပါမယ် — `options` မပေးထားဘူးဆိုရင် တွေ့ရှိတဲ့ IPv4 (သို့) IPv6 လိပ်စာတွေ၊ (သို့) နှစ်မျိုးလုံးကို ပြန်ပေးပါတယ်။

`all` option ကို `true` ပေးထားရင် `Promise` က — `address` နဲ့ `family` property တွေ ပါတဲ့ objects တွေရဲ့ array ဖြစ်တဲ့ `addresses` နဲ့အတူ resolve လုပ်ပါတယ်။

Error ဖြစ်ရင် `Promise` ကို [`Error`][] object တစ်ခုနဲ့ reject လုပ်ပြီး `err.code` က error code ဖြစ်ပါတယ်။ `err.code` က host name မရှိတဲ့အခါမှာတင် မကဘဲ — file descriptors မရနိုင်တာလိုမျိုး lookup က တခြားနည်းတွေနဲ့ ကျရှုံးတဲ့အခါတွေမှာပါ `'ENOTFOUND'` ဖြစ်မယ်ဆိုတာ သတိပြုထားပါ။

[`dnsPromises.lookup()`][] က DNS protocol နဲ့ မဆက်စပ်ဘဲ ရှိနေတတ်ပါတယ်။ ဒီ implementation က operating system ရဲ့ ယန္တရားတစ်ခုကို သုံးပြီး — name တွေကို addresses တွေနဲ့ ချိတ်ဆက်ပေးသလို — အပြန်အလှန် အားဖြင့် addresses တွေကို name တွေနဲ့လည်း ချိတ်ဆက်ပေးပါတယ်။ ဒီ implementation က Node.js program တွေရဲ့ အပြုအမူအပေါ် သိမ်မွေ့ပေမယ့် အရေးကြီးတဲ့ အကျိုးဆက်တွေ ရှိနိုင်ပါတယ်။ `dnsPromises.lookup()` မသုံးခင် [Implementation considerations section][] ကို အချိန်ယူပြီး ဖတ်ပေးပါ။

အသုံးပြုပုံ ဥပမာ:

```mjs
import dns from 'node:dns';
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
```cjs
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```

### `dnsPromises.lookupService(address, port)`

* `address` {string}
* `port` {number}

ပေးထားတဲ့ `address` နဲ့ `port` ကို operating system ရဲ့ အောက်ခံ `getnameinfo` implementation ကို သုံးပြီး host name နဲ့ service အဖြစ် resolve လုပ်ပေးပါတယ်။

`address` က တရားဝင် IP လိပ်စာ မဟုတ်ရင် `TypeError` တစ်ခု throw လုပ်ပါလိမ့်မယ်။ `port` ကို number အဖြစ် အတင်းပြောင်းပေးပါတယ်။ အဲဒါက တရားဝင် port မဟုတ်ရင်လည်း `TypeError` throw လုပ်ပါလိမ့်မယ်။

Error ဖြစ်ရင် `Promise` ကို [`Error`][] object တစ်ခုနဲ့ reject လုပ်ပြီး `err.code` က error code ဖြစ်ပါတယ်။

```mjs
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Prints: localhost ssh
```
```cjs
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Prints: localhost ssh
});
```
### `dnsPromises.resolve(hostname[, rrtype])`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `rrtype` {string} Resource record type ဖြစ်သည်။ **Default:** `'A'`.

DNS protocol ကို သုံးပြီး host name (ဥပမာ `'nodejs.org'`) တစ်ခုကို resource records တွေရဲ့ array အဖြစ် resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က resource records တွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်။ တစ်ခုချင်းစီရဲ့ ရလဒ် type နဲ့ ဖွဲ့စည်းပုံက `rrtype` ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်:

| `rrtype`  | `records` ထဲ ပါဝင်သော အရာများ | Result type (ရလဒ် အမျိုးအစား) | Shorthand method (အတိုကောက် method) |
| --------- | ------------------------------ | ----------- | -------------------------------- |
| `'A'`     | IPv4 လိပ်စာများ (default)       | {string}    | [`dnsPromises.resolve4()`][]     |
| `'AAAA'`  | IPv6 လိပ်စာများ                 | {string}    | [`dnsPromises.resolve6()`][]     |
| `'ANY'`   | record အမျိုးမျိုး              | {Object}    | [`dnsPromises.resolveAny()`][]   |
| `'CAA'`   | CA ခွင့်ပြုချက် record များ     | {Object}    | [`dnsPromises.resolveCaa()`][]   |
| `'CNAME'` | canonical name record များ      | {string}    | [`dnsPromises.resolveCname()`][] |
| `'MX'`    | mail exchange record များ       | {Object}    | [`dnsPromises.resolveMx()`][]    |
| `'NAPTR'` | name authority pointer record များ | {Object} | [`dnsPromises.resolveNaptr()`][] |
| `'NS'`    | name server record များ         | {string}    | [`dnsPromises.resolveNs()`][]    |
| `'PTR'`   | pointer record များ             | {string}    | [`dnsPromises.resolvePtr()`][]   |
| `'SOA'`   | start of authority record များ  | {Object}    | [`dnsPromises.resolveSoa()`][]   |
| `'SRV'`   | service record များ             | {Object}    | [`dnsPromises.resolveSrv()`][]   |
| `'TLSA'`  | certificate association record များ | {Object} | [`dnsPromises.resolveTlsa()`][]  |
| `'TXT'`   | text record များ                | {string\[]} | [`dnsPromises.resolveTxt()`][]   |

Error ဖြစ်ရင် `Promise` ကို [`Error`][] object တစ်ခုနဲ့ reject လုပ်ပြီး `err.code` က [DNS error codes][] ထဲက တစ်ခု ဖြစ်ပါတယ်။

### `dnsPromises.resolve4(hostname[, options])`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `options` {Object}
  * `ttl` {boolean} Record တစ်ခုချင်းစီရဲ့ Time-To-Live (TTL) တန်ဖိုးကို ထုတ်ယူပေးပါတယ်။ `true` ဆိုရင် `Promise` က string array အစား — TTL ကို seconds နဲ့ ဖော်ပြထားတဲ့ `{ address: '1.2.3.4', ttl: 60 }` objects တွေရဲ့ array နဲ့ resolve လုပ်ပါတယ်။

DNS protocol ကို သုံးပြီး `hostname` အတွက် IPv4 လိပ်စာတွေ (`A` records) ကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က IPv4 လိပ်စာတွေရဲ့ array (ဥပမာ `['74.125.79.104', '74.125.79.105', '74.125.79.106']`) နဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolve6(hostname[, options])`

* `hostname` {string} Resolve လုပ်ရမယ့် host name ဖြစ်သည်။
* `options` {Object}
  * `ttl` {boolean} Record တစ်ခုချင်းစီရဲ့ Time-To-Live (TTL) တန်ဖိုးကို ထုတ်ယူပေးပါတယ်။ `true` ဆိုရင် `Promise` က string array အစား — TTL ကို seconds နဲ့ ဖော်ပြထားတဲ့ `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` objects တွေရဲ့ array နဲ့ resolve လုပ်ပါတယ်။

DNS protocol ကို သုံးပြီး `hostname` အတွက် IPv6 လိပ်စာတွေ (`AAAA` records) ကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က IPv6 လိပ်စာတွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolveAny(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး record တွေ အားလုံး (ထို့ပြင် `ANY` (သို့) `*` query လို့လည်း ခေါ်သည်) ကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က record အမျိုးမျိုး ပါဝင်တဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်။ Object တစ်ခုချင်းစီမှာ လက်ရှိ record ရဲ့ type ကို ဖော်ပြတဲ့ `type` property ပါဝင်ပြီး — `type` ပေါ် မူတည်ပြီး object ပေါ်မှာ နောက်ထပ် property တွေ ပါဝင်လာပါလိမ့်မယ်:

| Type (အမျိုးအစား) | Properties (property များ) |
| --------- | ---------------------------------------------------------------------------------------- |
| `'A'`     | `address`/`ttl`                                                                          |
| `'AAAA'`  | `address`/`ttl`                                                                          |
| `'CAA'`   | [`dnsPromises.resolveCaa()`][] ကို ကိုးကားပါ                                          |
| `'CNAME'` | `value`                                                                                  |
| `'MX'`    | [`dnsPromises.resolveMx()`][] ကို ကိုးကားပါ                                            |
| `'NAPTR'` | [`dnsPromises.resolveNaptr()`][] ကို ကိုးကားပါ                                         |
| `'NS'`    | `value`                                                                                  |
| `'PTR'`   | `value`                                                                                  |
| `'SOA'`   | [`dnsPromises.resolveSoa()`][] ကို ကိုးကားပါ                                            |
| `'SRV'`   | [`dnsPromises.resolveSrv()`][] ကို ကိုးကားပါ                                            |
| `'TLSA'`  | [`dnsPromises.resolveTlsa()`][] ကို ကိုးကားပါ                                           |
| `'TXT'`   | ဒီ record type ထဲမှာ `entries` လို့ ခေါ်တဲ့ array property တစ်ခု ပါဝင်ပြီး — [`dnsPromises.resolveTxt()`][] ကို ရည်ညွှန်းပါတယ်၊ ဥပမာ `{ entries: ['...'], type: 'TXT' }` |

ရလဒ် object ရဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ်:

```js
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ];
```

### `dnsPromises.resolveCaa(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် `CAA` records တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က `hostname` အတွက် ရရှိနိုင်တဲ့ certification authority authorization records တွေ ပါဝင်တဲ့ objects တွေရဲ့ array (ဥပမာ `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`) နဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolveCname(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် `CNAME` records တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က `hostname` အတွက် ရရှိနိုင်တဲ့ canonical name records တွေရဲ့ array (ဥပမာ `['bar.example.com']`) နဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolveMx(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် mail exchange records (`MX` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က `priority` နဲ့ `exchange` property နှစ်ခုလုံး ပါဝင်တဲ့ objects တွေရဲ့ array (ဥပမာ `[{priority: 10, exchange: 'mx.example.com'}, ...]`) နဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolveNaptr(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် regular expression အခြေပြု record တွေ (`NAPTR` records) ကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်:

* `flags`
* `service`
* `regexp`
* `replacement`
* `order`
* `preference`

```js
({
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100,
});
```

### `dnsPromises.resolveNs(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် name server records (`NS` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က `hostname` အတွက် ရရှိနိုင်တဲ့ name server records တွေရဲ့ array (ဥပမာ `['ns1.example.com', 'ns2.example.com']`) နဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolvePtr(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် pointer records (`PTR` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က reply records တွေ ပါဝင်တဲ့ strings တွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်။

### `dnsPromises.resolveSoa(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် start of authority record တစ်ခု (`SOA` record) ကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က အောက်ပါ property တွေ ပါဝင်တဲ့ object တစ်ခုနဲ့ resolve လုပ်ပါတယ်:

* `nsname`
* `hostmaster`
* `serial`
* `refresh`
* `retry`
* `expire`
* `minttl`

```js
({
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600,
});
```

### `dnsPromises.resolveSrv(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် service records (`SRV` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်:

* `priority`
* `weight`
* `port`
* `name`

```js
({
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com',
});
```

### `dnsPromises.resolveTlsa(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် certificate associations (`TLSA` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က အောက်ပါ property တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုနဲ့ resolve လုပ်ပါတယ်:

* `certUsage`
* `selector`
* `match`
* `data`

```js
({
  certUsage: 3,
  selector: 1,
  match: 1,
  data: [ArrayBuffer],
});
```

### `dnsPromises.resolveTxt(hostname)`

* `hostname` {string}

DNS protocol ကို သုံးပြီး `hostname` အတွက် text queries (`TXT` records) တွေကို resolve လုပ်ပေးပါတယ်။ အောင်မြင်ရင် `Promise` က `hostname` အတွက် ရရှိနိုင်တဲ့ text records တွေရဲ့ two-dimensional array (ဥပမာ `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`) တစ်ခုနဲ့ resolve လုပ်ပါတယ်။ Sub-array တစ်ခုချင်းစီမှာ record တစ်ခုရဲ့ TXT chunks တွေ ပါဝင်ပါတယ်။ Use case ပေါ် မူတည်ပြီး ဒါတွေကို အတူတကွ ပေါင်းလိုက်လို့လည်း ရသလို — တစ်ခုချင်းစီ သီးခြားအနေနဲ့လည်း သုံးလို့ရပါတယ်။

### `dnsPromises.reverse(ip)`

* `ip` {string}

IPv4 (သို့) IPv6 လိပ်စာတစ်ခုကို host names တွေရဲ့ array အဖြစ် resolve လုပ်ပေးတဲ့ reverse DNS query တစ်ခုကို လုပ်ဆောင်ပါတယ်။

Error ဖြစ်ရင် `Promise` ကို [`Error`][] object တစ်ခုနဲ့ reject လုပ်ပြီး `err.code` က [DNS error codes][] ထဲက တစ်ခု ဖြစ်ပါတယ်။

### `dnsPromises.setDefaultResultOrder(order)`

* `order` {string} `'ipv4first'`, `'ipv6first'` (သို့) `'verbatim'` ဖြစ်ရပါမယ်။

`order` ရဲ့ default တန်ဖိုးကို [`dns.lookup()`][] နဲ့ [`dnsPromises.lookup()`][] အတွက် သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးတွေကတော့:

* `ipv4first`: default `order` ကို `ipv4first` အဖြစ် သတ်မှတ်ပေးသည်။
* `ipv6first`: default `order` ကို `ipv6first` အဖြစ် သတ်မှတ်ပေးသည်။
* `verbatim`: default `order` ကို `verbatim` အဖြစ် သတ်မှတ်ပေးသည်။

Default က `verbatim` ဖြစ်ပြီး — [`dnsPromises.setDefaultResultOrder()`][] က [`--dns-result-order`][] ထက် priority ပိုမြင့်ပါတယ်။ [worker threads][] သုံးတဲ့အခါ main thread ကနေ [`dnsPromises.setDefaultResultOrder()`][] ခေါ်လိုက်ရင် — workers တွေထဲက default dns orders တွေကို သက်ရောက်မှာ မဟုတ်ပါဘူး။

### `dnsPromises.getDefaultResultOrder()`

`dnsOrder` ရဲ့ တန်ဖိုးကို ရယူပါတယ်။

### `dnsPromises.setServers(servers)`

* `servers` {string\[]} [RFC 5952][] ဖော်မတ်နဲ့ ရေးထားတဲ့ လိပ်စာတွေရဲ့ array ဖြစ်သည်။

DNS resolution လုပ်တဲ့အခါ သုံးရမယ့် servers တွေရဲ့ IP လိပ်စာနဲ့ port ကို သတ်မှတ်ပေးပါတယ်။ `servers` argument က [RFC 5952][] ဖော်မတ်နဲ့ ရေးထားတဲ့ လိပ်စာတွေရဲ့ array ဖြစ်ပါတယ်။ Port က IANA ရဲ့ default DNS port (53) ဆိုရင် ချန်လိုက်လို့ ရပါတယ်။

```js
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```

မမှန်ကန်တဲ့ လိပ်စာတစ်ခု ပေးလိုက်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

DNS query တစ်ခု လုပ်ဆောင်နေချိန်မှာ `dnsPromises.setServers()` method ကို မခေါ်ရပါဘူး။

ဒီ method က [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5.html) နဲ့ ပုံစံတူ အလုပ်လုပ်ပါတယ်။ ဆိုလိုတာက — ပထမဆုံး ပေးထားတဲ့ server နဲ့ resolve လုပ်ကြည့်လို့ `NOTFOUND` error ရလာရင် — `resolve()` method က နောက်ထပ် ပေးထားတဲ့ servers တွေနဲ့ ဆက်ပြီး resolve လုပ်ဖို့ မကြိုးစားပါဘူး။ အစောပိုင်း servers တွေ timeout ဖြစ်တာ (သို့) တခြား error တစ်ခုခု ဖြစ်မှသာ Fallback DNS servers တွေကို သုံးပါတယ်။

## Error codes (error code များ)

DNS query တစ်ခုချင်းစီက အောက်ပါ error codes တွေထဲက တစ်ခုကို ပြန်ပေးနိုင်ပါတယ်:

* `dns.NODATA`: DNS server က data မပါတဲ့ အဖြေတစ်ခုကို ပြန်ပေးခဲ့သည်။
* `dns.FORMERR`: DNS server က query ကို ပုံစံမမှန်ဘူးလို့ ဆိုသည်။
* `dns.SERVFAIL`: DNS server က ယေဘုယျ failure တစ်ခု ပြန်ပေးခဲ့သည်။
* `dns.NOTFOUND`: Domain name ကို မတွေ့ပါ။
* `dns.NOTIMP`: DNS server က တောင်းဆိုထားတဲ့ operation ကို implement မလုပ်ထားပါ။
* `dns.REFUSED`: DNS server က query ကို ငြင်းပယ်ခဲ့သည်။
* `dns.BADQUERY`: DNS query ရဲ့ ပုံစံ မမှန်ပါ။
* `dns.BADNAME`: Host name ရဲ့ ပုံစံ မမှန်ပါ။
* `dns.BADFAMILY`: မပံ့ပိုးထားတဲ့ address family ဖြစ်သည်။
* `dns.BADRESP`: DNS reply ရဲ့ ပုံစံ မမှန်ပါ။
* `dns.CONNREFUSED`: DNS servers တွေကို ဆက်သွယ်လို့ မရခဲ့ပါ။
* `dns.TIMEOUT`: DNS servers တွေကို ဆက်သွယ်ရာမှာ timeout ဖြစ်ခဲ့သည်။
* `dns.EOF`: File ရဲ့ အဆုံး ဖြစ်သည်။
* `dns.FILE`: File ဖတ်ရာမှာ error ဖြစ်ခဲ့သည်။
* `dns.NOMEM`: Memory မလုံလောက်တော့ပါ။
* `dns.DESTRUCTION`: Channel ကို ဖျက်ဆီးနေသည်။
* `dns.BADSTR`: String ရဲ့ ပုံစံ မမှန်ပါ။
* `dns.BADFLAGS`: တရားမဝင် flags တွေ သတ်မှတ်ထားသည်။
* `dns.NONAME`: ပေးထားတဲ့ host name က numeric မဟုတ်ပါ။
* `dns.BADHINTS`: တရားမဝင်တဲ့ hints flags တွေ သတ်မှတ်ထားသည်။
* `dns.NOTINITIALIZED`: c-ares library ရဲ့ initialization ကို မလုပ်ရသေးပါ။
* `dns.LOADIPHLPAPI`: `iphlpapi.dll` ကို load လုပ်ရာမှာ error ဖြစ်ခဲ့သည်။
* `dns.ADDRGETNETWORKPARAMS`: `GetNetworkParams` function ကို ရှာမတွေ့ပါ။
* `dns.CANCELLED`: DNS query ကို ပယ်ဖျက်လိုက်သည်။

`dnsPromises` API ကလည်း အထက်ပါ error codes တွေကို export လုပ်ပေးပါတယ် — ဥပမာ `dnsPromises.NODATA` ဖြစ်သည်။

## Implementation considerations (အကောင်အထည်ဖော်မှု သုံးသပ်ချက်များ)

[`dns.lookup()`][] နဲ့ `dns.resolve*()`/`dns.reverse()` function အမျိုးမျိုးက network name တစ်ခုကို network address တစ်ခုနဲ့ (သို့) အပြန်အလှန် ချိတ်ဆက်ဖို့ ရည်ရွယ်ချက် အတူတူ ရှိပေမယ့် — သူတို့ရဲ့ အပြုအမူတွေကတော့ အတော်ကို ကွဲပြားပါတယ်။ ဒီကွဲပြားမှုတွေက Node.js program တွေရဲ့ အပြုအမူအပေါ် သိမ်မွေ့ပေမယ့် သိသာတဲ့ အကျိုးဆက်တွေ ရှိနိုင်ပါတယ်။

### `dns.lookup()`

အောက်ခံမှာ [`dns.lookup()`][] က အခြား program အများစုလိုပဲ operating system ရဲ့ ယန္တရားတွေကိုပဲ သုံးပါတယ်။ ဥပမာ — [`dns.lookup()`][] က ပေးထားတဲ့ name တစ်ခုကို `ping` command နဲ့ ဆင်တူတဲ့ နည်းနဲ့ resolve လုပ်ပေးလေ့ ရှိပါတယ်။ POSIX-like operating system အများစုမှာ `dns.lookup()` function ရဲ့ အပြုအမူကို nsswitch.conf(5) နဲ့/သို့မဟုတ် resolv.conf(5) ထဲက settings တွေကို ပြောင်းပြီး ပြုပြင်နိုင်ပေမယ့် — ဒီ file တွေကို ပြောင်းလိုက်ရင် အဲဒီ operating system ပေါ်မှာ run နေတဲ့ တခြား program တွေ အားလုံးရဲ့ အပြုအမူပါ ပြောင်းသွားပါလိမ့်မယ်။

`dns.lookup()` ကို ခေါ်တာက JavaScript ရှုထောင့်ကနေ ကြည့်ရင် asynchronous ဖြစ်ပေမယ့် — အတွင်းမှာတော့ libuv ရဲ့ threadpool ပေါ်မှာ run တဲ့ getaddrinfo(3) ဆီ synchronous call တစ်ခု အနေနဲ့ implement လုပ်ထားပါတယ်။ ဒါက application တချို့အတွက် မထင်မှတ်တဲ့ ဆိုးကျိုး performance သက်ရောက်မှုတွေ ရှိစေနိုင်ပါတယ် — အသေးစိတ်အတွက် [`UV_THREADPOOL_SIZE`][] documentation ကို ကြည့်ပါ။

Networking API အမျိုးမျိုးက host names တွေကို resolve လုပ်ဖို့ `dns.lookup()` ကို အတွင်းပိုင်းကနေ ခေါ်သုံးပါတယ်။ အဲဒါက ပြဿနာ ဖြစ်နေရင် — `dns.resolve()` ကို သုံးပြီး host name ကို address အဖြစ် resolve လုပ်ကာ host name အစား အဲဒီ address ကို သုံးဖို့ စဉ်းစားကြည့်ပါ။ ဒါ့အပြင် networking API တချို့ (ဥပမာ [`socket.connect()`][] နဲ့ [`dgram.createSocket()`][]) က default resolver ဖြစ်တဲ့ `dns.lookup()` ကို အစားထိုးခွင့် ပြုပါတယ်။

### `dns.resolve()`, `dns.resolve*()`, and `dns.reverse()`

ဒီ function တွေက [`dns.lookup()`][] နဲ့ အတော်ကို ခြားနားတဲ့ နည်းနဲ့ implement လုပ်ထားပါတယ်။ သူတို့က getaddrinfo(3) ကို မသုံးဘဲ — network ပေါ်မှာ DNS query တစ်ခုကို အမြဲတမ်း လုပ်ဆောင်ပါတယ်။ ဒီ network communication က အမြဲတမ်း asynchronously လုပ်ဆောင်ပြီး libuv ရဲ့ threadpool ကို မသုံးပါဘူး။

အကျိုးဆက်အနေနဲ့ — ဒီ function တွေက libuv ရဲ့ threadpool ပေါ်မှာ ဖြစ်ပျက်တဲ့ တခြား processing တွေအပေါ် [`dns.lookup()`][] လို ဆိုးကျိုး သက်ရောက်မှုမျိုး မရှိပါဘူး။

သူတို့က [`dns.lookup()`][] သုံးတဲ့ configuration file အစုအဝေး အတူတူကို မသုံးပါဘူး။ ဥပမာ — `/etc/hosts` ထဲက configuration ကို သူတို့ မသုံးပါဘူး။

[DNS error codes]: #error-codes
[Domain Name System (DNS)]: https://en.wikipedia.org/wiki/Domain_Name_System
[Implementation considerations section]: #implementation-considerations
[RFC 5952]: https://tools.ietf.org/html/rfc5952#section-6
[RFC 8482]: https://tools.ietf.org/html/rfc8482
[`--dns-result-order`]: cli.md#--dns-result-orderorder
[`Error`]: errors.md#class-error
[`UV_THREADPOOL_SIZE`]: cli.md#uv_threadpool_sizesize
[`dgram.createSocket()`]: dgram.md#dgramcreatesocketoptions-callback
[`dns.getServers()`]: #dnsgetservers
[`dns.lookup()`]: #dnslookuphostname-options-callback
[`dns.resolve()`]: #dnsresolvehostname-rrtype-callback
[`dns.resolve4()`]: #dnsresolve4hostname-options-callback
[`dns.resolve6()`]: #dnsresolve6hostname-options-callback
[`dns.resolveAny()`]: #dnsresolveanyhostname-callback
[`dns.resolveCaa()`]: #dnsresolvecaahostname-callback
[`dns.resolveCname()`]: #dnsresolvecnamehostname-callback
[`dns.resolveMx()`]: #dnsresolvemxhostname-callback
[`dns.resolveNaptr()`]: #dnsresolvenaptrhostname-callback
[`dns.resolveNs()`]: #dnsresolvenshostname-callback
[`dns.resolvePtr()`]: #dnsresolveptrhostname-callback
[`dns.resolveSoa()`]: #dnsresolvesoahostname-callback
[`dns.resolveSrv()`]: #dnsresolvesrvhostname-callback
[`dns.resolveTlsa()`]: #dnsresolvetlsahostname-callback
[`dns.resolveTxt()`]: #dnsresolvetxthostname-callback
[`dns.reverse()`]: #dnsreverseip-callback
[`dns.setDefaultResultOrder()`]: #dnssetdefaultresultorderorder
[`dns.setServers()`]: #dnssetserversservers
[`dnsPromises.getServers()`]: #dnspromisesgetservers
[`dnsPromises.lookup()`]: #dnspromiseslookuphostname-options
[`dnsPromises.resolve()`]: #dnspromisesresolvehostname-rrtype
[`dnsPromises.resolve4()`]: #dnspromisesresolve4hostname-options
[`dnsPromises.resolve6()`]: #dnspromisesresolve6hostname-options
[`dnsPromises.resolveAny()`]: #dnspromisesresolveanyhostname
[`dnsPromises.resolveCaa()`]: #dnspromisesresolvecaahostname
[`dnsPromises.resolveCname()`]: #dnspromisesresolvecnamehostname
[`dnsPromises.resolveMx()`]: #dnspromisesresolvemxhostname
[`dnsPromises.resolveNaptr()`]: #dnspromisesresolvenaptrhostname
[`dnsPromises.resolveNs()`]: #dnspromisesresolvenshostname
[`dnsPromises.resolvePtr()`]: #dnspromisesresolveptrhostname
[`dnsPromises.resolveSoa()`]: #dnspromisesresolvesoahostname
[`dnsPromises.resolveSrv()`]: #dnspromisesresolvesrvhostname
[`dnsPromises.resolveTlsa()`]: #dnspromisesresolvetlsahostname
[`dnsPromises.resolveTxt()`]: #dnspromisesresolvetxthostname
[`dnsPromises.reverse()`]: #dnspromisesreverseip
[`dnsPromises.setDefaultResultOrder()`]: #dnspromisessetdefaultresultorderorder
[`dnsPromises.setServers()`]: #dnspromisessetserversservers
[`socket.connect()`]: net.md#socketconnectoptions-connectlistener
[`util.promisify()`]: util.md#utilpromisifyoriginal
[supported `getaddrinfo` flags]: #supported-getaddrinfo-flags
[worker threads]: worker_threads.md
