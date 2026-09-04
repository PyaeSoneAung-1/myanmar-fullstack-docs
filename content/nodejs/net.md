---
title: "Net"
description: "node:net module — TCP (သို့) IPC servers/clients များအတွက် stream-based asynchronous network API (createServer, net.Server, net.Socket, BlockList, SocketAddress စသည်)"
order: 123
source: "https://nodejs.org/api/net.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:net` module က stream-based TCP သို့မဟုတ် [IPC][] servers တွေ ([`net.createServer()`][]) နဲ့ clients တွေ ([`net.createConnection()`][]) ကို ဖန်တီးဖို့အတွက် asynchronous network API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import net from 'node:net';
```

```cjs
const net = require('node:net');
```

## IPC ပံ့ပိုးမှု (IPC support)

`node:net` module က Windows မှာ named pipes တွေနဲ့ — တခြား operating systems တွေမှာတော့ Unix domain sockets တွေနဲ့ — IPC ကို ပံ့ပိုးပေးပါတယ်။

### IPC connection paths များ ခွဲခြားသတ်မှတ်ခြင်း (Identifying paths for IPC connections)

[`net.connect()`][], [`net.createConnection()`][], [`server.listen()`][] နဲ့ [`socket.connect()`][] တို့က IPC endpoints တွေကို ခွဲခြားသတ်မှတ်ဖို့ `path` parameter တစ်ခုကို လက်ခံပါတယ်။

Unix မှာ local domain ကို Unix domain လို့လည်း ခေါ်ပါတယ်။ Path ဆိုတာ file system ရဲ့ pathname တစ်ခုပါ။ Pathname ရဲ့ အလျားက `sizeof(sockaddr_un.sun_path)` ရဲ့ အလျားထက် ပိုရှည်နေရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ပုံမှန် တန်ဖိုးတွေကတော့ Linux မှာ 107 bytes ဖြစ်ပြီး macOS မှာ 103 bytes ဖြစ်ပါတယ်။ Node.js API abstraction တစ်ခုက Unix domain socket ကို ဖန်တီးပေးတယ်ဆိုရင် — အဲဒီ Unix domain socket ကို unlink (ဖြုတ်ပစ်) တာကိုပါ ပြုလုပ်ပေးပါတယ်။ ဥပမာ — [`net.createServer()`][] က Unix domain socket တစ်ခုကို ဖန်တီးနိုင်ပြီး [`server.close()`][] က အဲဒါကို unlink လုပ်ပေးပါလိမ့်မယ်။ ဒါပေမယ့် user တစ်ယောက်က ဒီ abstractions တွေရဲ့ အပြင်ဘက်မှာ Unix domain socket ကို ဖန်တီးမယ်ဆိုရင်တော့ — user ကိုယ်တိုင် ဖယ်ရှားပေးဖို့ လိုပါတယ်။ Node.js API တစ်ခုက Unix domain socket ကို ဖန်တီးပြီး program က နောက်ပိုင်းမှာ crash ဖြစ်သွားတဲ့ အခါမျိုးမှာလည်း အလားတူပါပဲ။ အတိုချုပ်ပြောရရင် — Unix domain socket တစ်ခုဟာ file system ထဲမှာ မြင်နိုင်ပြီး unlink လုပ်လိုက်တဲ့အထိ ဆက်လက် တည်ရှိနေပါလိမ့်မယ်။ Linux မှာတော့ path ရဲ့ အစမှာ `\0` ကို ထည့်သွင်းပြီး — `\0abstract` လိုမျိုး — Unix abstract socket ကို သုံးနိုင်ပါတယ်။ Unix abstract socket ရဲ့ path က file system ထဲမှာ မမြင်ရပဲ — socket ဆီကို ဖွင့်ထားတဲ့ references တွေ အားလုံး ပိတ်သွားတဲ့အခါ အလိုအလျောက် ပျောက်ကွယ်သွားပါတယ်။

Windows မှာတော့ local domain ကို named pipe တစ်ခုနဲ့ အကောင်အထည်ဖော် (implement) လုပ်ပါတယ်။ Path က `\\?\pipe\` သို့မဟုတ် `\\.\pipe\` ထဲက entry တစ်ခုကို ရည်ညွှန်း_ရပါမယ်_။ Character တွေ ဘယ်ဟာမဆို ခွင့်ပြုပေမယ့် — နောက်တစ်ခုကတော့ pipe names တွေကို `..` sequences တွေ resolve လုပ်တာလိုမျိုး လုပ်ဆောင်ချက် (processing) တစ်ချို့ လုပ်ပေးနိုင်ပါတယ်။ ပုံစံအားဖြင့် ရှုပ်ထွေးပုံရပေမယ့် — pipe namespace က flat (အပြား) ဖြစ်ပါတယ်။ Pipes တွေက _မတည်မြဲ_ ပါဘူး — ၎င်းတို့ဆီကို နောက်ဆုံး reference ပိတ်သွားတဲ့အခါ ဖယ်ရှားခံရပါတယ်။ Unix domain sockets တွေနဲ့ မတူဘဲ — Windows က ပိုင်ဆိုင်တဲ့ (owning) process ထွက်သွားတဲ့အခါ pipe ကို ပိတ်ပြီး ဖယ်ရှားပါတယ်။

JavaScript string escaping (ရှောင်လွှဲရေးသားခြင်း) ကြောင့် paths တွေကို အောက်ပါအတိုင်း backslash တွေ ထပ်ဆောင်း escape လုပ်ပြီး သတ်မှတ်ပေးရပါတယ်:

```js
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Class: `net.BlockList`

`BlockList` object ကို network APIs တစ်ချို့မှာ — သတ်မှတ်ထားတဲ့ IP addresses, IP ranges တွေ သို့မဟုတ် IP subnets တွေဆီကို inbound (ဝင်လာသော) သို့မဟုတ် outbound (ထွက်သွားသော) access တွေကို ပိတ်ပင်ဖို့ စည်းမျဉ်း (rules) တွေ သတ်မှတ်ရာမှာ — သုံးနိုင်ပါတယ်။

### `blockList.addAddress(address[, type])`

* `address` {string|net.SocketAddress} IPv4 သို့မဟုတ် IPv6 address တစ်ခုပါ။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

ပေးထားတဲ့ IP address ကို block လုပ်ဖို့ rule တစ်ခုကို ထည့်သွင်းပါတယ်။

### `blockList.addAddresses(addresses[, type])`

* `addresses` {string\[]|net.SocketAddress\[]} IPv4 သို့မဟုတ် IPv6 addresses တွေရဲ့ array တစ်ခုပါ။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

Block list ထဲကို address rules အများအပြားကို လုပ်ဆောင်မှု (operation) တစ်ခုတည်းနဲ့ ထည့်သွင်းပါတယ်။ Addresses တွေကို internal lock တစ်ခုတည်း ရယူမှုအောက်မှာ ထည့်သွင်းတာမို့ — addresses အများအပြားကို ထည့်သွင်းတဲ့အခါ `blockList.addAddress()` ကို ထပ်ခါထပ်ခါ ခေါ်တာထက် ဒီနည်းက ပိုပြီး ထိရောက်မှု ရှိပါတယ်။

### `blockList.addCIDR(cidr)`

* `cidr` {string} CIDR notation နဲ့ ဖော်ပြတဲ့ IPv4 သို့မဟုတ် IPv6 subnet တစ်ခုပါ (ဥပမာ `'10.0.0.0/8'` သို့မဟုတ် `'2001:db8::/32'`)။

CIDR notation ကို သုံးပြီး subnet rule တစ်ခုကို ထည့်သွင်းပါတယ်။ Address family ကို address ကနေ အလိုအလျောက် ခွဲခြားသိရှိပါတယ် (address ထဲမှာ `':'` ပါရင် IPv6 — မပါရင် IPv4)။ ဒါက parse လုပ်ထားတဲ့ network address, prefix length နဲ့ family တို့နဲ့အတူ `blockList.addSubnet()` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

### `blockList.addCIDRs(cidrs)`

* `cidrs` {string\[]} CIDR notation နဲ့ ဖော်ပြတဲ့ IPv4 သို့မဟုတ် IPv6 subnets တွေရဲ့ array တစ်ခုပါ။

Call တစ်ခုတည်းနဲ့ CIDR notation ကို သုံးပြီး subnet rules အများအပြားကို ထည့်သွင်းပါတယ်။ Entry တစ်ခုချင်းစီအတွက် address family ကို အလိုအလျောက် ခွဲခြားသိရှိပါတယ်။ ဒါက array ရဲ့ element တစ်ခုချင်းစီအတွက် `blockList.addCIDR()` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

### `blockList.addRange(start, end[, type])`

* `start` {string|net.SocketAddress} Range ထဲက အစပိုင်း (starting) IPv4 သို့မဟုတ် IPv6 address ပါ။
* `end` {string|net.SocketAddress} Range ထဲက အဆုံးပိုင်း (ending) IPv4 သို့မဟုတ် IPv6 address ပါ။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

`start` (အပါအဝင်) ကနေ `end` (အပါအဝင်) အထိ IP addresses အကွာအဝေး (range) တစ်ခုကို block လုပ်ဖို့ rule တစ်ခု ထည့်သွင်းပါတယ်။

### `blockList.addSubnet(net, prefix[, type])`

* `net` {string|net.SocketAddress} Network ရဲ့ IPv4 သို့မဟုတ် IPv6 address ပါ။
* `prefix` {number} CIDR prefix bits အရေအတွက်ပါ။ IPv4 အတွက် `0` နဲ့ `32` ကြားက တန်ဖိုး ဖြစ်ရပါမယ်။ IPv6 အတွက်တော့ `0` နဲ့ `128` ကြားမှာ ရှိရပါမယ်။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

Subnet mask တစ်ခုအနေနဲ့ သတ်မှတ်ထားတဲ့ IP addresses အကွာအဝေး တစ်ခုကို block လုပ်ဖို့ rule တစ်ခု ထည့်သွင်းပါတယ်။

### `blockList.check(address[, type])`

* `address` {string|net.SocketAddress} စစ်ဆေးရမယ့် IP address ပါ
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။
* Returns: {boolean}

ပေးထားတဲ့ IP address က `BlockList` ထဲကို ထည့်သွင်းထားတဲ့ rules တွေထဲက တစ်ခုခုနဲ့ ကိုက်ညီမယ်ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6 notation for IPv4 addresses works:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```

### `blockList.clear()`

`BlockList` ထဲက rules တွေ အားလုံးကို ရှင်းလင်းပစ်ပါတယ်။

### `blockList.fromJSON(value)`

> Stability: 1.2 - Release candidate

```js
const blockList = new net.BlockList();
const data = [
  'Subnet: IPv4 192.168.1.0/24',
  'Address: IPv4 10.0.0.5',
  'Range: IPv4 192.168.2.1-192.168.2.10',
  'Range: IPv4 10.0.0.1-10.0.0.10',
];
blockList.fromJSON(data);
blockList.fromJSON(JSON.stringify(data));
```

* `value` Blocklist.rules

### `BlockList.isBlockList(value)`

* `value` {any} JS value တစ်ခုခုပါ
* Returns `true` — `value` က `net.BlockList` instance တစ်ခု ဖြစ်နေရင် ဖြစ်ပါတယ်။

### `BlockList.PRIVATE_RANGES`

* Type: {string\[]}

Private, loopback နဲ့ link-local IP address ranges တွေကို ကိုယ်စားပြုတဲ့ CIDR strings တွေရဲ့ frozen array (ပြုပြင် ပြောင်းလဲလို့ မရတဲ့ array) တစ်ခုပါ။ ဒါကို `blockList.addCIDRs()` ဆီကို ဖြတ်သန်းပေးခြင်းအားဖြင့် — routable မဟုတ်တဲ့ address ranges တွေ အားလုံးနဲ့ blocklist တစ်ခုကို လျင်မြန်စွာ ဖြည့်သွင်းနိုင်ပါတယ်။

ပါဝင်တဲ့ ranges တွေကတော့:

* `10.0.0.0/8` — RFC 1918 private IPv4
* `172.16.0.0/12` — RFC 1918 private IPv4
* `192.168.0.0/16` — RFC 1918 private IPv4
* `127.0.0.0/8` — IPv4 loopback
* `::1/128` — IPv6 loopback
* `169.254.0.0/16` — IPv4 link-local
* `fe80::/10` — IPv6 link-local
* `fc00::/7` — IPv6 unique local (ULA)

```js
const blockList = new net.BlockList();
blockList.addCIDRs(net.BlockList.PRIVATE_RANGES);

console.log(blockList.check('10.0.0.1'));      // Prints: true
console.log(blockList.check('127.0.0.1'));     // Prints: true
console.log(blockList.check('8.8.8.8'));       // Prints: false
```

### `blockList.removeAddress(address[, type])`

* `address` {string|net.SocketAddress} IPv4 သို့မဟုတ် IPv6 address တစ်ခုပါ။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

`blockList.addAddress()` နဲ့ အရင်က ထည့်သွင်းခဲ့တဲ့ rule တစ်ခုကို ဖယ်ရှားပါတယ်။ Address က rule ထည့်သွင်းတုန်းက သုံးခဲ့တဲ့ တန်ဖိုးနဲ့ အတိအကျ တူညီနေရပါမယ်။ သတ်မှတ်ထားတဲ့ address မရှိဘူးဆိုရင် — ဒါက no-op (ဘာမျှ မလုပ်ဆောင်ပဲ) ဖြစ်ပါတယ်။

### `blockList.removeCIDR(cidr)`

* `cidr` {string} CIDR notation နဲ့ ဖော်ပြတဲ့ IPv4 သို့မဟုတ် IPv6 subnet တစ်ခုပါ (ဥပမာ `'10.0.0.0/8'` သို့မဟုတ် `'2001:db8::/32'`)။

CIDR notation ကို သုံးပြီး subnet rule တစ်ခုကို ဖယ်ရှားပါတယ်။ Address family ကို address ကနေ အလိုအလျောက် ခွဲခြားသိရှိပါတယ်။ ဒါက parse လုပ်ထားတဲ့ network address, prefix length နဲ့ family တို့နဲ့အတူ `blockList.removeSubnet()` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။ သတ်မှတ်ထားတဲ့ subnet မရှိဘူးဆိုရင် — ဒါက no-op ဖြစ်ပါတယ်။

### `blockList.removeRange(start, end[, type])`

* `start` {string|net.SocketAddress} Range ထဲက အစပိုင်း IPv4 သို့မဟုတ် IPv6 address ပါ။
* `end` {string|net.SocketAddress} Range ထဲက အဆုံးပိုင်း IPv4 သို့မဟုတ် IPv6 address ပါ။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

`blockList.addRange()` နဲ့ အရင်က ထည့်သွင်းခဲ့တဲ့ rule တစ်ခုကို ဖယ်ရှားပါတယ်။ `start` နဲ့ `end` addresses တွေက rule ထည့်သွင်းတုန်းက သုံးခဲ့တဲ့ တန်ဖိုးတွေနဲ့ အတိအကျ တူညီနေရပါမယ်။ သတ်မှတ်ထားတဲ့ range မရှိဘူးဆိုရင် — ဒါက no-op ဖြစ်ပါတယ်။

### `blockList.removeSubnet(net, prefix[, type])`

* `net` {string|net.SocketAddress} Network ရဲ့ IPv4 သို့မဟုတ် IPv6 address ပါ။
* `prefix` {number} CIDR prefix bits အရေအတွက်ပါ။ IPv4 အတွက် `0` နဲ့ `32` ကြားက တန်ဖိုး ဖြစ်ရပါမယ်။ IPv6 အတွက်တော့ `0` နဲ့ `128` ကြားမှာ ရှိရပါမယ်။
* `type` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'ipv4'`။

`blockList.addSubnet()` နဲ့ အရင်က ထည့်သွင်းခဲ့တဲ့ rule တစ်ခုကို ဖယ်ရှားပါတယ်။ Network address နဲ့ prefix တို့က rule ထည့်သွင်းတုန်းက သုံးခဲ့တဲ့ တန်ဖိုးတွေနဲ့ အတိအကျ တူညီနေရပါမယ်။ သတ်မှတ်ထားတဲ့ subnet မရှိဘူးဆိုရင် — ဒါက no-op ဖြစ်ပါတယ်။

### `blockList.rules`

* Type: {string\[]}

Blocklist ထဲကို ထည့်သွင်းထားတဲ့ rules တွေရဲ့ စာရင်းပါ။

### `blockList.size`

* Type: {number}

Blocklist ထဲက rules အရေအတွက်ပါ။ ဒါက `blockList.rules.length` နဲ့ ညီမျှပေမယ့် — rules array ကို allocate (မှတ်ဉာဏ် ခွဲဝေသုံးစွဲ) လုပ်တာ မရှိပါဘူး။

### `blockList.toJSON()`

> Stability: 1.2 - Release candidate

* Returns Blocklist.rules

## Class: `net.SocketAddress`

### `new net.SocketAddress([options])`

* `options` {Object}
  * `address` {string} IPv4 သို့မဟုတ် IPv6 string အနေနဲ့ ရှိတဲ့ network address ပါ။ **Default**: `family` က `'ipv4'` ဆိုရင် `'127.0.0.1'` — `family` က `'ipv6'` ဆိုရင် `'::'` ဖြစ်ပါတယ်။
  * `family` {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ **Default**: `'ipv4'`။
  * `flowlabel` {number} `family` က `'ipv6'` ဖြစ်တဲ့အခါမှသာ သုံးတဲ့ IPv6 flow-label ပါ။
  * `port` {number} IP port တစ်ခုပါ။

### `socketaddress.address`

* Type: {string}

### `socketaddress.family`

* Type: {string} `'ipv4'` (သို့) `'ipv6'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။

### `socketaddress.flowlabel`

* Type: {number}

### `socketaddress.port`

* Type: {number}

### `SocketAddress.parse(input)`

* `input` {string} IP address တစ်ခုနဲ့ optional port တစ်ခု ပါဝင်တဲ့ input string ပါ — ဥပမာ `123.1.2.3:1234` သို့မဟုတ် `[1::1]:1234`။
* Returns: {net.SocketAddress} Parse လုပ်တာ အောင်မြင်ခဲ့ရင် `SocketAddress` တစ်ခုကို ပြန်ပေးပါတယ်။ မအောင်မြင်ခဲ့ရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။

## Class: `net.Server`

* Extends: {EventEmitter}

ဒီ class ကို TCP သို့မဟုတ် [IPC][] server တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။

နားဆင်နေတဲ့ (listening) TCP `net.Server` တစ်ခုကို — [`worker_threads`][] `postMessage()` call တစ်ခုရဲ့ `transferList` ထဲမှာ စာရင်းသွင်းခြင်းအားဖြင့် — worker thread တစ်ခုဆီကို လွှဲပြောင်းနိုင်ပါတယ်။ ဒါက အခြေခံ (underlying) listening socket ကို လက်ခံလိုက်တဲ့ thread ဆီကို ရွှေ့ပြောင်းပေးပြီး — အဲဒီ thread မှာ connections တွေကို ဆက်လက် လက်ခံပါတယ်။ [Transferring TCP handles to other threads][] ကို ကြည့်ပါ။

### `new net.Server([options][, connectionListener])`

* `options` {Object} [`net.createServer([options][, connectionListener])`][`net.createServer()`] ကို ကြည့်ပါ။
* `connectionListener` {Function} [`'connection'`][] event အတွက် listener တစ်ခုအနေနဲ့ အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။
* Returns: {net.Server}

`net.Server` က [`EventEmitter`][] တစ်ခု ဖြစ်ပြီး — အောက်ပါ events တွေ ရှိပါတယ်:

### Event: `'close'`

Server ပိတ်သွားတဲ့အခါ emit လုပ်ပါတယ်။ Connections တွေ ရှိနေသေးရင် — connections တွေ အားလုံး အဆုံးသတ်သွားသည်အထိ ဒီ event ကို emit လုပ်မှာ မဟုတ်ပါဘူး။

### Event: `'connection'`

* Type: {net.Socket} Connection object ပါ

Connection အသစ်တစ်ခု ပြုလုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `socket` က `net.Socket` ရဲ့ instance တစ်ခုပါ။

### Event: `'error'`

* Type: {Error}

Error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။ [`net.Socket`][] နဲ့ မတူဘဲ — [`server.close()`][] ကို လက်နဲ့ ကိုယ်တိုင် (manually) ခေါ်ထားခြင်း မရှိရင် — ဒီ event ရဲ့ နောက်ကို တိုက်ရိုက် လိုက်ပြီး [`'close'`][] event ကို emit လုပ်မှာ **မဟုတ်ပါဘူး**။ [`server.listen()`][] ရဲ့ ဆွေးနွေးချက်ထဲက ဥပမာကို ကြည့်ပါ။

### Event: `'listening'`

[`server.listen()`][] ကို ခေါ်ပြီးနောက် server က bound ဖြစ်သွားတဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'drop'`

Connections အရေအတွက်က `server.maxConnections` ရဲ့ ကန့်သတ်ချက် (threshold) ကို ရောက်ရှိတဲ့အခါ — server က connections အသစ်တွေကို ပစ်ချ (drop) ပြီး အဲဒီအစား `'drop'` event ကို emit လုပ်ပါလိမ့်မယ်။ TCP server တစ်ခု ဆိုရင် argument က အောက်ပါအတိုင်း ဖြစ်ပြီး — မဟုတ်ရင် argument က `undefined` ဖြစ်ပါတယ်။

* `data` {Object} Event listener ဆီကို ဖြတ်သန်းပေးတဲ့ argument ပါ။
  * `localAddress` {string} Local address ပါ။
  * `localPort` {number} Local port ပါ။
  * `localFamily` {string} Local family ပါ။
  * `remoteAddress` {string} Remote address ပါ။
  * `remotePort` {number} Remote port ပါ။
  * `remoteFamily` {string} Remote IP family ပါ။ `'IPv4'` (သို့) `'IPv6'` ဖြစ်ပါတယ်။

### `server.address()`

* Returns: {Object|string|null}

IP socket တစ်ခုပေါ်မှာ listening လုပ်နေတယ်ဆိုရင် — operating system က ဖော်ပြတဲ့အတိုင်း server ရဲ့ bound `address`, address `family` နာမည် နဲ့ `port` တို့ကို ပြန်ပေးပါတယ် (OS က သတ်မှတ်ပေးတဲ့ address တစ်ခုကို ရတဲ့အခါ ဘယ် port ကို ပေးအပ်ခဲ့လဲ ရှာဖွေဖို့ အသုံးဝင်ပါတယ်): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

Pipe သို့မဟုတ် Unix domain socket တစ်ခုပေါ်မှာ listening လုပ်နေတဲ့ server တစ်ခုအတွက်တော့ — name ကို string တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

```js
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
```

`'listening'` event ကို emit မလုပ်ရသေးခင် သို့မဟုတ် `server.close()` ကို ခေါ်ပြီးနောက်မှာတော့ — `server.address()` က `null` ကို ပြန်ပေးပါတယ်။

### `server.close([callback])`

* `callback` {Function} Server ပိတ်သွားတဲ့အခါ ခေါ်ယူပါတယ်။
* Returns: {net.Server}

Server က connections အသစ်တွေကို လက်ခံတာကို ရပ်တန့်စေပြီး — ရှိပြီးသား connections တွေကိုတော့ ဆက်လက် ထိန်းသိမ်းထားပါတယ်။ ဒီ function က asynchronous ဖြစ်ပြီး — connections တွေ အားလုံး အဆုံးသတ်သွားကာ server က [`'close'`][] event တစ်ခုကို emit လုပ်တဲ့အခါမှသာ နောက်ဆုံး ပိတ်သွားပါတယ်။ `'close'` event ဖြစ်ပေါ်လာတာနဲ့ optional `callback` ကို ခေါ်ယူပါလိမ့်မယ်။ အဲဒီ event နဲ့ မတူတဲ့ အချက်က — server ပိတ်လိုက်တဲ့အခါ server က ဖွင့်ထား (open) မထားခဲ့ဘူးဆိုရင် — ဒီ callback ကို `Error` တစ်ခုတည်းကို တစ်ခုတည်းသော argument အနေနဲ့ ပါဝင်တဲ့ပုံစံနဲ့ ခေါ်ယူပါလိမ့်မယ်။

### `server[Symbol.asyncDispose]()`

[`server.close()`][] ကို ခေါ်ပြီး — server ပိတ်သွားတဲ့အခါ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `server.getConnections(callback)`

* `callback` {Function}
* Returns: {net.Server}

Server ပေါ်မှာ တစ်ပြိုင်နက် ရှိနေတဲ့ (concurrent) connections အရေအတွက်ကို asynchronously ရယူပါတယ်။ Sockets တွေကို forks တွေဆီကို ပို့ထားတဲ့အခါမှာလည်း အလုပ်လုပ်ပါတယ်။

Callback က `err` နဲ့ `count` ဆိုတဲ့ arguments နှစ်ခုကို လက်ခံသင့်ပါတယ်။

### `server.listen()`

Server တစ်ခုကို connections တွေအတွက် listening စတင်စေပါတယ်။ `net.Server` တစ်ခုက — ဘာကို listen လုပ်လဲဆိုတာပေါ် မူတည်ပြီး — TCP သို့မဟုတ် [IPC][] server ဖြစ်နိုင်ပါတယ်။

ဖြစ်နိုင်တဲ့ signatures တွေကတော့:

* [`server.listen(handle[, backlog][, callback])`][`server.listen(handle)`]
* [`server.listen(options[, callback])`][`server.listen(options)`]
* [`server.listen(path[, backlog][, callback])`][`server.listen(path)`]
  [IPC][] servers တွေအတွက် ဖြစ်ပါတယ်
* [`server.listen([port[, host[, backlog]]][, callback])`][`server.listen(port)`]
  TCP servers တွေအတွက် ဖြစ်ပါတယ်

ဒီ function က asynchronous ပါ။ Server က listening စတင်တဲ့အခါ — [`'listening'`][] event ကို emit လုပ်ပါလိမ့်မယ်။ နောက်ဆုံး parameter ဖြစ်တဲ့ `callback` ကို [`'listening'`][] event အတွက် listener တစ်ခုအနေနဲ့ ထည့်သွင်းပါလိမ့်မယ်။

`listen()` methods တွေ အားလုံးက — pending connections တွေရဲ့ queue ရဲ့ အများဆုံး အလျားကို သတ်မှတ်ဖို့ `backlog` parameter တစ်ခုကို လက်ခံနိုင်ပါတယ်။ တကယ့် အလျားကို OS က — Linux ပေါ်က `tcp_max_syn_backlog` နဲ့ `somaxconn` လိုမျိုး sysctl settings တွေကနေ — ဆုံးဖြတ်ပါတယ်။ ဒီ parameter ရဲ့ default တန်ဖိုးက 511 (512 မဟုတ်ပါဘူး)။

[`net.Socket`][] တွေ အားလုံးကို `SO_REUSEADDR` အဖြစ် သတ်မှတ်ပေးထားပါတယ် (အသေးစိတ်အတွက် [`socket(7)`][] ကို ကြည့်ပါ)။

ပထမဆုံး `server.listen()` call အတွင်းမှာ error ဖြစ်ခဲ့တာ သို့မဟုတ် `server.close()` ကို ခေါ်ထားပြီးသား ဖြစ်တဲ့ အခြေအနေမျိုးမှာသာ — `server.listen()` method ကို နောက်တစ်ကြိမ် ထပ်ခေါ်လို့ ရပါတယ်။ မဟုတ်ရင် `ERR_SERVER_ALREADY_LISTEN` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Listening လုပ်တဲ့အခါ ဖြစ်ပေါ်လေ့ရှိတဲ့ errors တွေထဲက အဖြစ်အများဆုံး တစ်ခုက `EADDRINUSE` ပါ။ ဒါက — တောင်းဆိုထားတဲ့ `port`/`path`/`handle` ပေါ်မှာ တခြား server တစ်ခုက ရှေ့ကတည်းက listening လုပ်နေပြီးသား ဖြစ်နေတဲ့အခါ ဖြစ်ပေါ်ပါတယ်။ ဒါကို ကိုင်တွယ်ဖို့ နည်းလမ်းတစ်ခုကတော့ — အချိန်အတိုင်းအတာ တစ်ခုပြီးနောက်မှာ ပြန်ကြိုးစား (retry) လုပ်တာပါ:

```js
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])`

* `handle` {Object}
* `backlog` {number} [`server.listen()`][] functions တွေရဲ့ ဘုံ parameter ပါ
* `callback` {Function}
* Returns: {net.Server}

Port တစ်ခု, Unix domain socket တစ်ခု သို့မဟုတ် Windows named pipe တစ်ခုဆီကို ရှေ့ကတည်းက bound ဖြစ်နေပြီးသား `handle` တစ်ခုပေါ်မှာ — server တစ်ခုကို connections တွေအတွက် listening စတင်စေပါတယ်။

`handle` object က server တစ်ခု၊ socket တစ်ခု (အခြေခံ `_handle` member ပါတဲ့ ဘာမဆို)၊ [`BoundSocket`][] တစ်ခု သို့မဟုတ် — valid file descriptor တစ်ခု ဖြစ်တဲ့ `fd` member ပါဝင်တဲ့ object တစ်ခု — ဖြစ်နိုင်ပါတယ်။

`handle` က [`BoundSocket`][] တစ်ခု ဆိုရင် — server က ရှေ့ကတည်းက bound ဖြစ်နေတဲ့ socket ကို လွှဲပြောင်းယူ (adopt) ပြီး အဲဒီပေါ်မှာ listening စတင်ပါတယ်။ Adoption (လွှဲပြောင်းယူမှု) က bound socket ကို စားသုံး (consume) လိုက်ပါတယ် ([ownership transfer][`BoundSocket`]) ကို ကြည့်ပါ)။

File descriptor တစ်ခုပေါ်မှာ listening လုပ်တာကို Windows မှာ support မလုပ်ပါဘူး။

#### `server.listen(options[, callback])`

* `options` {Object} လိုအပ်ပါတယ် (Required)။ အောက်ပါ properties တွေကို ပံ့ပိုးပေးပါတယ်:
  * `backlog` {number} [`server.listen()`][] functions တွေရဲ့ ဘုံ parameter ဖြစ်ပါတယ်။
  * `exclusive` {boolean} **Default:** `false`
  * `handle` {net.BoundSocket} ရှေ့ကတည်းက bound ဖြစ်နေတဲ့ [`BoundSocket`][] တစ်ခုပါ။ Server က အဲဒီ bound ဖြစ်နေပြီးသား socket ကို လွှဲပြောင်းယူပြီး — `host`, `port` နဲ့ `path` တို့ကို လျစ်လျူရှုလျက် — အဲဒီပေါ်မှာ listen လုပ်ပါတယ်။ Adoption က bound socket ကို စားသုံးလိုက်ပါတယ် ([ownership transfer][`BoundSocket`]) ကို ကြည့်ပါ)။
  * `host` {string}
  * `ipv6Only` {boolean} TCP servers တွေအတွက် — `ipv6Only` ကို `true` လို့ သတ်မှတ်လိုက်ရင် dual-stack support ကို disable လုပ်ပါတယ်။ ဆိုလိုတာက — host `::` ကို binding လုပ်တာက `0.0.0.0` ကိုပါ bound ဖြစ်စေမှာ မဟုတ်ပါဘူး။ **Default:** `false`။
  * `reusePort` {boolean} TCP servers တွေအတွက် — `reusePort` ကို `true` လို့ သတ်မှတ်လိုက်ရင် တူညီတဲ့ host ပေါ်က sockets အများအပြား တစ်ခုတည်းသော port ကို bind လုပ်ဖို့ ခွင့်ပြုပါတယ်။ Incoming connections တွေကို operating system က listening sockets တွေဆီကို ဖြန့်ဝေပေးပါတယ်။ ဒီ option က Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 နဲ့ AIX 7.2.5+ လိုမျိုး platform တစ်ချို့မှာသာ ရနိုင်ပါတယ်။ Support မလုပ်တဲ့ platforms တွေမှာတော့ ဒီ option က error တစ်ခုကို ထုတ်ပေးပါတယ်။ **Default:** `false`။
  * `path` {string} `port` ကို သတ်မှတ်ထားရင် လျစ်လျူရှုခံရပါလိမ့်မယ်။ [Identifying paths for IPC connections][] ကို ကြည့်ပါ။
  * `port` {number}
  * `readableAll` {boolean} IPC servers တွေအတွက် pipe ကို users အားလုံး ဖတ်လို့ရအောင် လုပ်ပေးပါတယ်။ **Default:** `false`။
  * `signal` {AbortSignal} Listening လုပ်နေတဲ့ server တစ်ခုကို ပိတ်ဖို့ သုံးနိုင်တဲ့ AbortSignal တစ်ခုပါ။
  * `writableAll` {boolean} IPC servers တွေအတွက် pipe ကို users အားလုံး ရေးလို့ရအောင် လုပ်ပေးပါတယ်။ **Default:** `false`။
* `callback` {Function} [`server.listen()`][] functions တွေရဲ့ ဘုံ parameter ဖြစ်ပါတယ်။
* Returns: {net.Server}

`handle` ကို သတ်မှတ်ထားရင် — server က အဲဒီ pre-bound socket ကို လွှဲပြောင်းယူပါတယ်။ မဟုတ်ဘဲ `port` ကို သတ်မှတ်ထားရင် — [`server.listen([port[, host[, backlog]]][, callback])`][`server.listen(port)`] နဲ့ အတူတူပဲ ပြုမူပါတယ်။ မဟုတ်ဘဲ `path` ကို သတ်မှတ်ထားရင် — [`server.listen(path[, backlog][, callback])`][`server.listen(path)`] နဲ့ အတူတူပဲ ပြုမူပါတယ်။ ဒါတွေထဲက ဘယ်ဟာမှ မသတ်မှတ်ထားရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`exclusive` က `false` (default) ဆိုရင် — cluster workers တွေက တူညီတဲ့ underlying handle ကို သုံးစွဲပြီး — connection handling တာဝန်တွေကို မျှဝေနိုင်ပါတယ်။ `exclusive` က `true` ဆိုရင်တော့ handle ကို မျှဝေမထားပဲ — port sharing ကို ကြိုးစားရင် error တစ်ခု ဖြစ်ပေါ်ပါတယ်။ Exclusive port တစ်ခုပေါ်မှာ listen လုပ်တဲ့ ဥပမာတစ်ခုကို အောက်မှာ ပြထားပါတယ်။

```js
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```

`exclusive` က `true` ဖြစ်ပြီး underlying handle ကို မျှဝေထားတဲ့အခါ — worker အများအပြားက handle တစ်ခုကို backlogs အမျိုးမျိုးနဲ့ query လုပ်နိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ — master process ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ ပထမဆုံး `backlog` ကို သုံးပါလိမ့်မယ်။

IPC server တစ်ခုကို root အနေနဲ့ စတင်ခြင်းက server path ကို unprivileged users (အခွင့်ထူး မရှိတဲ့ users) တွေအတွက် လက်လှမ်းမမီနိုင်စေနိုင်ပါတယ်။ `readableAll` နဲ့ `writableAll` တို့ကို သုံးလိုက်ရင်တော့ server ကို users အားလုံး လက်လှမ်းမီနိုင်အောင် လုပ်ပေးပါလိမ့်မယ်။

`signal` option ကို ဖွင့်ထားရင် — သက်ဆိုင်တဲ့ `AbortController` ပေါ်မှာ `.abort()` ကို ခေါ်တာက server ပေါ်မှာ `.close()` ကို ခေါ်တာနဲ့ ဆင်တူပါတယ်:

```js
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Later, when you want to close the server.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])`

* `path` {string} Server က listen လုပ်သင့်တဲ့ path ပါ။ [Identifying paths for IPC connections][] ကို ကြည့်ပါ။
* `backlog` {number} [`server.listen()`][] functions တွေရဲ့ ဘုံ parameter ဖြစ်ပါတယ်။
* `callback` {Function}.
* Returns: {net.Server}

ပေးထားတဲ့ `path` ပေါ်မှာ [IPC][] server တစ်ခုကို connections တွေအတွက် listening စတင်စေပါတယ်။

#### `server.listen([port[, host[, backlog]]][, callback])`

* `port` {number}
* `host` {string}
* `backlog` {number} [`server.listen()`][] functions တွေရဲ့ ဘုံ parameter ဖြစ်ပါတယ်။
* `callback` {Function}.
* Returns: {net.Server}

ပေးထားတဲ့ `port` နဲ့ `host` ပေါ်မှာ TCP server တစ်ခုကို connections တွေအတွက် listening စတင်စေပါတယ်။

`port` ကို ချန်လှပ်ထားရင် သို့မဟုတ် 0 ဖြစ်နေရင် — operating system က ကြိုက်ရာမရွေး (arbitrary) မသုံးရသေးတဲ့ port တစ်ခုကို ပေးအပ်ပါလိမ့်မယ်။ [`'listening'`][] event ကို emit လုပ်ပြီးနောက်မှာ `server.address().port` ကို သုံးပြီး အဲဒါကို ပြန်ရယူနိုင်ပါတယ်။

`host` ကို ချန်လှပ်ထားရင် — server က IPv6 ရနိုင်တဲ့အခါ [unspecified IPv6 address][] (`::`) ပေါ်မှာ — မရနိုင်ရင်တော့ [unspecified IPv4 address][] (`0.0.0.0`) ပေါ်မှာ — connections တွေကို လက်ခံပါလိမ့်မယ်။

Operating systems အများစုမှာ — [unspecified IPv6 address][] (`::`) ကို listening လုပ်တာက `net.Server` ကို [unspecified IPv4 address][] (`0.0.0.0`) ပေါ်မှာပါ ထပ်ဆောင်း listen လုပ်စေနိုင်ပါတယ်။

### `server.listening`

* Type: {boolean} Server က connections တွေအတွက် listening လုပ်နေသလား ဆိုတာကို ဖော်ပြပါတယ်။

### `server.maxConnections`

* Type: {integer}

Connections အရေအတွက်က `server.maxConnections` ရဲ့ ကန့်သတ်ချက် (threshold) ကို ရောက်ရှိတဲ့အခါ:

1. Process က cluster mode မှာ မလည်ပတ်နေဘူးဆိုရင် — Node.js က connection ကို ပိတ်ပါလိမ့်မယ်။

2. Process က cluster mode မှာ လည်ပတ်နေတယ်ဆိုရင် — Node.js က default အနေနဲ့ connection ကို တခြား worker process တစ်ခုဆီကို လမ်းကြောင်းလွှဲပေးပါလိမ့်မယ်။ အဲဒီအစား connection ကို ပိတ်ချင်ရင်တော့ [`server.dropMaxConnection`][] ကို `true` အဖြစ် သတ်မှတ်ပါ။

Socket တစ်ခုကို [`child_process.fork()`][] နဲ့ child တစ်ခုဆီကို ပို့ပြီးသားဆိုရင် ဒီ option ကို သုံးဖို့ အကြံပြုလို့ မရပါဘူး။

### `server.dropMaxConnection`

* Type: {boolean}

Connections အရေအတွက်က [`server.maxConnections`][] ရဲ့ ကန့်သတ်ချက်ကို ရောက်ရှိတာနဲ့ connections တွေကို စတင် ပိတ်ဖို့အတွက် ဒီ property ကို `true` အဖြစ် သတ်မှတ်ပါ။ ဒီ setting က cluster mode မှာသာ သက်ရောက်မှု ရှိပါတယ်။

### `server.ref()`

* Returns: {net.Server}

`unref()` ရဲ့ ဆန့်ကျင်ဘက်ပါ။ အရင်က `unref` လုပ်ထားတဲ့ server တစ်ခုပေါ်မှာ `ref()` ကို ခေါ်လိုက်ရင် — ကျန်ရှိနေတဲ့ server က ဒီတစ်ခုတည်းသာ ဆိုရင်တောင် — program က ထွက်သွားဖို့ _ခွင့်မပြုတော့ပါဘူး_ (default အပြုအမူပါ)။ Server က `ref` လုပ်ထားပြီးသားဆိုရင် `ref()` ကို ထပ်ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

### `server.unref()`

* Returns: {net.Server}

Server တစ်ခုပေါ်မှာ `unref()` ကို ခေါ်လိုက်ရင် — event system ထဲမှာ တက်ကြွနေတဲ့ (active) server က ဒီတစ်ခုတည်းသာ ဆိုရင် — program က ထွက်သွားဖို့ ခွင့်ပြုပါလိမ့်မယ်။ Server က ရှေ့ကတည်းက `unref` လုပ်ထားပြီးသားဆိုရင် `unref()` ကို ထပ်ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

## Class: `net.Socket`

* Extends: {stream.Duplex}

ဒီ class က TCP socket တစ်ခု သို့မဟုတ် streaming [IPC][] endpoint တစ်ခုရဲ့ abstraction တစ်ခု ဖြစ်ပါတယ် (Windows မှာတော့ named pipes တွေကို — တခြားနေရာတွေမှာတော့ Unix domain sockets တွေကို သုံးပါတယ်)။ ၎င်းက [`EventEmitter`][] တစ်ခုလည်း ဖြစ်ပါတယ်။

`net.Socket` တစ်ခုကို user က ဖန်တီးပြီး — server တစ်ခုနဲ့ တိုက်ရိုက် အပြန်အလှန် ဆက်သွယ်ဖို့ (interact) သုံးနိုင်ပါတယ်။ ဥပမာ — [`net.createConnection()`][] က ၎င်းကို ပြန်ပေးတာမို့ user က server နဲ့ စကားပြောဆိုဖို့ သုံးနိုင်ပါတယ်။

Connection တစ်ခု လက်ခံရရှိတဲ့အခါ Node.js က ၎င်းကို ဖန်တီးပြီး user ဆီကို ပေးအပ်တာလည်း ရှိပါတယ်။ ဥပမာ — [`net.Server`][] တစ်ခုပေါ်မှာ emit လုပ်တဲ့ [`'connection'`][] event ရဲ့ listeners တွေဆီကို ၎င်းကို ပေးအပ်တာမို့ — user က client နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ သုံးနိုင်ပါတယ်။

### TCP handles တွေကို အခြား threads တွေဆီ လွှဲပြောင်းခြင်း (Transferring TCP handles to other threads)

ချိတ်ဆက်ပြီးသား (connected) TCP `net.Socket` တစ်ခုကို [`worker_threads`][] ရဲ့ `postMessage()` call တစ်ခုရဲ့ `transferList` ထဲမှာ စာရင်းသွင်းပြီး — အခြား thread တစ်ခုဆီကို ရွှေ့ပြောင်းနိုင်ပါတယ်။ လွှဲပြောင်းပြီးနောက်မှာ source socket က ပို့လွှတ်တဲ့ (sending) thread ပေါ်မှာ destroy ခံရပါတယ် (နောက်ထပ် အသုံးပြုမှုတွေက data တွေကို တိတ်တဆိတ် ချပစ်မယ့်အစား `ERR_STREAM_DESTROYED` နဲ့ မအောင်မြင်ပါဘူး) — socket က လက်ခံတဲ့ (receiving) thread ပေါ်မှာတော့ ဆက်လက် အလုပ်လုပ်ပါတယ်။ ဒါက connections တွေကို thread တစ်ခုတည်းပေါ်မှာ လက်ခံပြီး — worker threads pool တစ်ခုရဲ့အလယ်မှာ ဖြန့်ဝေဖို့ ဖြစ်နိုင်စေပါတယ်။ ဥပမာ — worker threads တွေရဲ့အပေါ်မှာ `node:cluster` ပုံစံမျိုး model တစ်ခု တည်ဆောက်ဖို့ပါ။

Socket က လက်ခံပြီးစ (freshly accepted) သို့မဟုတ် ဖန်တီးပြီးစ TCP connection တစ်ခု ဖြစ်ရပါမယ်: live handle တစ်ခုနဲ့ တွဲထားဆဲ ဖြစ်ရမယ် — connecting သို့မဟုတ် destroyed အခြေအနေ မဖြစ်ရဘူး — reading စတင်ထားတာ သို့မဟုတ် buffered data တွေ ရှိနေတာလည်း မဖြစ်ရပါဘူး။ မဟုတ်ရင် `postMessage()` က `ERR_WORKER_HANDLE_NOT_TRANSFERABLE` ကို throw လုပ်ပါလိမ့်မယ်။ TCP sockets တွေကိုသာ ပံ့ပိုးပေးပါတယ်။

```cjs
const net = require('node:net');
const { Worker } = require('node:worker_threads');

// worker.js receives `{ socket }` messages and handles each connection.
const worker = new Worker('./worker.js');

const server = net.createServer((socket) => {
  // Hand the freshly accepted connection off to the worker thread.
  worker.postMessage({ socket }, [socket]);
});
server.listen(8000);
```

Listening လုပ်နေတဲ့ [`net.Server`][] တစ်ခုကိုလည်း အလားတူ လွှဲပြောင်းနိုင်ပါတယ် — ဒါက listening socket ကိုယ်တိုင် (၎င်းရဲ့ ဆိုင်းငံ့ထားတဲ့ (pending) accept queue အပါအဝင်) ကို လက်ခံတဲ့ thread ဆီကို ရွှေ့ပြောင်းပေးပါတယ်။

### `new net.Socket([options])`

* `options` {Object} ရရှိနိုင်တဲ့ options တွေကတော့:
  * `allowHalfOpen` {boolean} `false` လို့ သတ်မှတ်ထားရင် — readable side က ဆုံးသွားတဲ့အခါ socket က writable side ကို အလိုအလျောက် end လုပ်ပါလိမ့်မယ်။ အသေးစိတ်အတွက် [`net.createServer()`][] နဲ့ [`'end'`][] event ကို ကြည့်ပါ။ **Default:** `false`။
  * `blockList` {net.BlockList} `blockList` ကို သတ်မှတ်ထားတဲ့ IP addresses, IP ranges တွေ သို့မဟုတ် IP subnets တွေဆီကို outbound access တွေ ပိတ်ပင်ဖို့ သုံးနိုင်ပါတယ်။
  * `fd` {number} သတ်မှတ်ထားရင် — ပေးထားတဲ့ file descriptor နဲ့အတူ ရှိပြီးသား socket တစ်ခုကို wrap လုပ်ပါတယ်။ မသတ်မှတ်ထားရင်တော့ socket အသစ်တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။
  * `handle` {net.BoundSocket} သတ်မှတ်ထားရင် — [`BoundSocket`][] တစ်ခုကနေ bound socket ကို wrap လုပ်ပါတယ်။ နောက်ဆက်တွဲ [`socket.connect()`][`socket.connect()`] က connection ရဲ့ source binding အဖြစ် ဒီ bound socket ကို သုံးပါတယ် (bound လုပ်ထားတဲ့ local address နဲ့ port ကို လေးစားလိုက်နာပါတယ်)။ လက်ခံယူလိုက်တာက bound socket ကို သုံးစွဲလိုက်တာ ဖြစ်ပါတယ် ([ownership transfer][`BoundSocket`] ကို ကြည့်ပါ)။
  * `keepAlive` {boolean} `true` လို့ သတ်မှတ်ထားရင် — connection တည်ဆောက်ပြီးတာနဲ့ ချက်ချင်း socket ပေါ်မှာ keep-alive လုပ်ဆောင်ချက်ကို ဖွင့်ပေးပါတယ် — [`socket.setKeepAlive()`][] မှာ လုပ်ထားတာနဲ့ ဆင်တူပါတယ်။ **Default:** `false`။
  * `keepAliveInitialDelay` {number} Positive ဖြစ်တဲ့ ဂဏန်းတစ်ခု သတ်မှတ်ထားရင် — အလုပ်မရှိတဲ့ (idle) socket တစ်ခုပေါ်မှာ ပထမဆုံး keepalive probe ကို မပို့ခင် ကနဦး စောင့်ဆိုင်းချိန် (initial delay) ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `noDelay` {boolean} `true` လို့ သတ်မှတ်ထားရင် — socket တည်ဆောက်ပြီးတာနဲ့ ချက်ချင်း Nagle's algorithm သုံးစွဲမှုကို ပိတ်ပေးပါတယ်။ **Default:** `false`။
  * `onread` {Object} သတ်မှတ်ထားရင် — ဝင်လာတဲ့ data တွေကို `buffer` တစ်ခုတည်းထဲမှာ သိမ်းဆည်းပြီး socket ပေါ်ကို data ရောက်ရှိတဲ့အခါ ပေးထားတဲ့ `callback` ဆီကို ပေးပို့ပါတယ်။ ဒါက streaming လုပ်ဆောင်ချက်ကနေ data ဘာမှ မပေးတော့အောင် ဖြစ်စေပါလိမ့်မယ်။ Socket က `'error'`, `'end'`, `'close'` လိုမျိုး events တွေကိုတော့ ပုံမှန်အတိုင်း emit လုပ်ပါလိမ့်မယ်။ `pause()` နဲ့ `resume()` လိုမျိုး methods တွေကလည်း မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ပါလိမ့်မယ်။
    * `buffer` {Buffer|Uint8Array|Function} ဝင်လာတဲ့ data တွေကို သိမ်းဆည်းဖို့ ပြန်သုံးလို့ရတဲ့ memory chunk တစ်ခု သို့မဟုတ် အဲဒီလိုမျိုး ပြန်ပေးတဲ့ function တစ်ခု ဖြစ်ပါတယ်။
    * `callback` {Function} ဝင်လာတဲ့ data chunk တိုင်းအတွက် ဒီ function ကို ခေါ်ပါတယ်။ Argument နှစ်ခုကို ၎င်းဆီကို ပေးပို့ပါတယ်: `buffer` ထဲကို ရေးသွင်းလိုက်တဲ့ bytes အရေအတွက်နဲ့ `buffer` ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ။ ဒီ function ကနေ `false` ကို ပြန်ပေးလိုက်ရင် socket ကို implicitly `pause()` လုပ်လိုက်တာ ဖြစ်ပါတယ်။ ဒီ function ကို global context ထဲမှာ လုပ်ဆောင်ပါလိမ့်မယ်။
  * `readable` {boolean} `fd` တစ်ခုကို ပေးထားတဲ့အခါ socket ပေါ်မှာ reads တွေကို ခွင့်ပြုပါတယ် — မဟုတ်ရင်တော့ လျစ်လျူရှုပါတယ်။ **Default:** `false`။
  * `signal` {AbortSignal} Socket ကို destroy လုပ်ဖို့ သုံးနိုင်တဲ့ Abort signal တစ်ခုပါ။
  * `typeOfService` {number} ကနဦး Type of Service (TOS) တန်ဖိုးပါ။
  * `writable` {boolean} `fd` တစ်ခုကို ပေးထားတဲ့အခါ socket ပေါ်မှာ writes တွေကို ခွင့်ပြုပါတယ် — မဟုတ်ရင်တော့ လျစ်လျူရှုပါတယ်။ **Default:** `false`။
* Returns: {net.Socket}

Socket object အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

အသစ်ဖန်တီးလိုက်တဲ့ socket က — ဘယ်အရာဆီကို [`connect()`][`socket.connect()`] လုပ်လဲဆိုတာပေါ် မူတည်ပြီး — TCP socket တစ်ခု သို့မဟုတ် streaming [IPC][] endpoint တစ်ခု ဖြစ်နိုင်ပါတယ်။

### Event: `'close'`

* `hadError` {boolean} Socket မှာ transmission error တစ်ခု ရှိခဲ့ရင် `true` ဖြစ်ပါတယ်။

Socket က လုံးဝ (fully) ပိတ်သွားတာနဲ့ emit လုပ်ပါတယ်။ `hadError` argument က socket ကို transmission error တစ်ခုကြောင့် ပိတ်လိုက်ရတာလားဆိုတာကို ဖော်ပြတဲ့ boolean တစ်ခု ဖြစ်ပါတယ်။

### Event: `'connect'`

Socket connection တစ်ခုကို အောင်မြင်စွာ တည်ဆောက်နိုင်တဲ့အခါ emit လုပ်ပါတယ်။ [`net.createConnection()`][] ကို ကြည့်ပါ။

### Event: `'connectionAttempt'`

* `ip` {string} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားနေတဲ့ IP ပါ။
* `port` {number} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားနေတဲ့ port ပါ။
* `family` {number} IP ရဲ့ family ပါ။ IPv6 အတွက် `6` သို့မဟုတ် IPv4 အတွက် `4` ဖြစ်နိုင်ပါတယ်။

Connection attempt အသစ်တစ်ခု စတင်တဲ့အခါ emit လုပ်ပါတယ်။ Family autoselection algorithm ကို [`socket.connect(options)`][] မှာ ဖွင့်ထားရင် — ဒီ event က အကြိမ်များစွာ emit လုပ်နိုင်ပါတယ်။

### Event: `'connectionAttemptFailed'`

* `ip` {string} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားခဲ့တဲ့ IP ပါ။
* `port` {number} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားခဲ့တဲ့ port ပါ။
* `family` {number} IP ရဲ့ family ပါ။ IPv6 အတွက် `6` သို့မဟုတ် IPv4 အတွက် `4` ဖြစ်နိုင်ပါတယ်။
* `error` {Error} မအောင်မြင်မှုနဲ့ ဆက်စပ်နေတဲ့ error ပါ။

Connection attempt တစ်ခု မအောင်မြင်တဲ့အခါ emit လုပ်ပါတယ်။ Family autoselection algorithm ကို [`socket.connect(options)`][] မှာ ဖွင့်ထားရင် — ဒီ event က အကြိမ်များစွာ emit လုပ်နိုင်ပါတယ်။

### Event: `'connectionAttemptTimeout'`

* `ip` {string} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားခဲ့တဲ့ IP ပါ။
* `port` {number} Socket က ချိတ်ဆက်ဖို့ ကြိုးစားခဲ့တဲ့ port ပါ။
* `family` {number} IP ရဲ့ family ပါ။ IPv6 အတွက် `6` သို့မဟုတ် IPv4 အတွက် `4` ဖြစ်နိုင်ပါတယ်။

Connection attempt တစ်ခု အချိန်ကုန်သွားတဲ့အခါ (timed out) emit လုပ်ပါတယ်။ Family autoselection algorithm ကို [`socket.connect(options)`][] မှာ ဖွင့်ထားမှသာလျှင် ဒီ event ကို emit လုပ်ပါတယ် (အကြိမ်များစွာလည်း ဖြစ်နိုင်ပါတယ်)။

### Event: `'data'`

* Type: {Buffer|string}

Data လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။ `data` argument က `Buffer` သို့မဟုတ် `String` တစ်ခု ဖြစ်ပါလိမ့်မယ်။ Data ရဲ့ encoding ကို [`socket.setEncoding()`][] က သတ်မှတ်ပါတယ်။

`Socket` တစ်ခုက `'data'` event ကို emit လုပ်တဲ့အခါ — listener မရှိဘူးဆိုရင် data က ပျောက်ဆုံးသွားပါလိမ့်မယ်။

### Event: `'drain'`

Write buffer က ဗလာ (empty) ဖြစ်သွားတဲ့အခါ emit လုပ်ပါတယ်။ Uploads တွေကို နှေးအောင် ထိန်းချုပ်ဖို့ (throttle) သုံးနိုင်ပါတယ်။

ဒါ့အပြင်: `socket.write()` ရဲ့ return values တွေကိုလည်း ကြည့်ပါ။

### Event: `'end'`

Socket ရဲ့ အခြားတစ်ဖက် (other end) က transmission ဆုံးသွားကြောင်း အချက်ပြတဲ့အခါ emit လုပ်ပါတယ် — ဒါကြောင့် socket ရဲ့ readable side ကို အဆုံးသတ်လိုက်ပါတယ်။

Default အနေနဲ့ (`allowHalfOpen` က `false` ဖြစ်နေတဲ့အခါ) — socket က ၎င်းရဲ့ ဆိုင်းငံ့ထားတဲ့ (pending) write queue ကို ရေးထုတ်ပြီးတာနဲ့ — transmission အဆုံးသတ်တဲ့ packet တစ်ခုကို ပြန်ပို့ပြီး ၎င်းရဲ့ file descriptor ကို destroy လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် `allowHalfOpen` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — socket က ၎င်းရဲ့ writable side ကို အလိုအလျောက် [`end()`][`socket.end()`] လုပ်မှာ မဟုတ်ပါဘူး — user က ကြိုက်သလောက် data ပမာဏတွေကို ရေးသားနိုင်ပါတယ်။ Connection ကို ပိတ်ဖို့ (ဆိုလိုတာက FIN packet တစ်ခု ပြန်ပို့ဖို့) user က [`end()`][`socket.end()`] ကို တိုက်ရိုက် (explicitly) ခေါ်ပေးရပါမယ်။

### Event: `'error'`

* Type: {Error}

Error တစ်ခု ဖြစ်ပွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ပြီးတာနဲ့ ချက်ချင်း `'close'` event ကို ခေါ်ပါလိမ့်မယ်။

### Event: `'lookup'`

Host name ကို resolve လုပ်ပြီးနောက် — ဒါပေမယ့် မချိတ်ဆက်ခင် — emit လုပ်ပါတယ်။ Unix sockets တွေနဲ့တော့ သက်ဆိုင်မှု မရှိပါဘူး။

* `err` {Error|null} Error object ပါ။ [`dns.lookup()`][] ကို ကြည့်ပါ။
* `address` {string} IP address ပါ။
* `family` {number|null} Address ရဲ့ အမျိုးအစားပါ။ [`dns.lookup()`][] ကို ကြည့်ပါ။
* `host` {string} Host name ပါ။

### Event: `'ready'`

Socket တစ်ခု အသုံးပြုဖို့ အသင့်ဖြစ်တဲ့အခါ emit လုပ်ပါတယ်။

`'connect'` ပြီးတာနဲ့ ချက်ချင်း ဖြစ်ပေါ်ပါတယ်။

### Event: `'timeout'`

Socket က လှုပ်ရှားမှုမရှိခြင်း (inactivity) ကြောင့် အချိန်ကုန်သွားရင် (times out) emit လုပ်ပါတယ်။ ဒါက socket က အလုပ်မရှိ (idle) ဖြစ်နေကြောင်း အသိပေးချက်တစ်ခုသာ ဖြစ်ပါတယ်။ Connection ကို user က ကိုယ်တိုင် ပိတ်ပေးရပါမယ်။

ဒါ့အပြင်: [`socket.setTimeout()`][] ကိုလည်း ကြည့်ပါ။

### `socket.address()`

* Returns: {Object}

Operating system က သတင်းပို့တဲ့အတိုင်း socket ရဲ့ bound `address`, address `family` name နဲ့ `port` ကို ပြန်ပေးပါတယ်:
`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

### `socket.autoSelectFamilyAttemptedAddresses`

* Type: {string\[]}

ဒီ property က — family autoselection algorithm ကို [`socket.connect(options)`][] မှာ ဖွင့်ထားမှသာလျှင် တည်ရှိပြီး — ကြိုးစားခဲ့ပြီးသား addresses တွေရဲ့ array တစ်ခု ဖြစ်ပါတယ်။

Address တစ်ခုချင်းစီက `$IP:$PORT` ပုံစံရှိတဲ့ string တစ်ခု ဖြစ်ပါတယ်။ Connection က အောင်မြင်ခဲ့တယ်ဆိုရင် — နောက်ဆုံး address ကတော့ socket က လက်ရှိ ချိတ်ဆက်ထားတဲ့ address ဖြစ်ပါတယ်။

### `socket.bufferSize`

> Stability: 0 - Deprecated: Use [`writable.writableLength`][] instead.

* Type: {integer}

ဒီ property က writing အတွက် buffer လုပ်ထားတဲ့ characters အရေအတွက်ကို ဖော်ပြပါတယ်။ Buffer ထဲမှာ — encoding လုပ်ပြီးရင် အလျား (length) ကို မသိရသေးတဲ့ strings တွေ ပါဝင်နိုင်ပါတယ်။ ဒါကြောင့် ဒီဂဏန်းက buffer ထဲက bytes အရေအတွက်ရဲ့ ခန့်မှန်းချက် (approximation) တစ်ခုသာ ဖြစ်ပါတယ်။

`net.Socket` မှာ `socket.write()` က အမြဲတမ်း အလုပ်လုပ်တယ်ဆိုတဲ့ ဂုဏ်သတ္တိ (property) ရှိပါတယ်။ ဒါက users တွေ မြန်မြန်ဆန်ဆန် စတင်လည်ပတ်နိုင်ဖို့ ကူညီပေးတာပါ။ Computer က socket တစ်ခုဆီကို ရေးသားလိုက်တဲ့ data ပမာဏနဲ့ အမြဲတမ်း အမီလိုက်နိုင်မှာ မဟုတ်ပါဘူး။ Network connection က ရိုးရိုးရှင်းရှင်း နှေးလွန်းနေတာ ဖြစ်နိုင်ပါတယ်။ Node.js က socket တစ်ခုဆီကို ရေးသားလိုက်တဲ့ data ကို အတွင်းပိုင်းမှာ queue လုပ်ပြီး — ဖြစ်နိုင်တဲ့အခါ wire ပေါ်ကို ပို့ပေးပါလိမ့်မယ်။

ဒီအတွင်းပိုင်း buffering ရဲ့ အကျိုးဆက်ကတော့ memory က ကြီးထွားလာနိုင်တာပါ။ ကြီးမားတဲ့ သို့မဟုတ် တဖြည်းဖြည်း ကြီးထွားလာတဲ့ `bufferSize` ကို တွေ့ကြုံနေရတဲ့ users တွေက — [`socket.pause()`][] နဲ့ [`socket.resume()`][] တို့နဲ့ သူတို့ရဲ့ program ထဲက data flows တွေကို "throttle" (ထိန်းချုပ်) လုပ်ဖို့ ကြိုးစားသင့်ပါတယ်။

### `socket.bytesRead`

* Type: {integer}

လက်ခံရရှိခဲ့တဲ့ bytes ပမာဏပါ။

### `socket.bytesWritten`

* Type: {integer}

ပို့လွှတ်လိုက်တဲ့ bytes ပမာဏပါ။

### `socket.connect()`

ပေးထားတဲ့ socket တစ်ခုပေါ်မှာ connection တစ်ခုကို စတင်ပါတယ်။

ဖြစ်နိုင်တဲ့ signatures တွေကတော့:

* [`socket.connect(options[, connectListener])`][`socket.connect(options)`]
* [`socket.connect(path[, connectListener])`][`socket.connect(path)`]
  [IPC][] connections တွေအတွက် ဖြစ်ပါတယ်
* [`socket.connect(port[, host][, connectListener])`][`socket.connect(port)`]
  TCP connections တွေအတွက် ဖြစ်ပါတယ်
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

ဒီ function က asynchronous ဖြစ်ပါတယ်။ Connection တည်ဆောက်ပြီးတဲ့အခါ — [`'connect'`][] event ကို emit လုပ်ပါလိမ့်မယ်။ ချိတ်ဆက်ဖို့ ပြဿနာရှိနေရင်တော့ — [`'connect'`][] event အစား — error ကို [`'error'`][] listener ဆီကို ပေးပို့ပြီး [`'error'`][] event ကို emit လုပ်ပါလိမ့်မယ်။ နောက်ဆုံး parameter ဖြစ်တဲ့ `connectListener` ကို ပေးထားရင် — [`'connect'`][] event အတွက် listener အဖြစ် **တစ်ကြိမ်တည်း** (once) ထည့်သွင်းပါလိမ့်မယ်။

ဒီ function ကို — `'close'` ကို emit လုပ်ပြီးတဲ့နောက် socket တစ်ခုကို ပြန်လည်ချိတ်ဆက်ဖို့ (reconnecting) အတွက်သာ သုံးသင့်ပါတယ်။ မဟုတ်ရင် undefined behavior တွေ ဖြစ်လာနိုင်ပါတယ်။

#### `socket.connect(options[, connectListener])`

* `options` {Object}
* `connectListener` {Function} [`socket.connect()`][] methods တွေရဲ့ အသုံးများတဲ့ parameter ပါ။ [`'connect'`][] event အတွက် listener အဖြစ် တစ်ကြိမ်တည်း ထည့်သွင်းပါလိမ့်မယ်။
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

ပေးထားတဲ့ socket တစ်ခုပေါ်မှာ connection တစ်ခုကို စတင်ပါတယ်။ ပုံမှန်အားဖြင့် ဒီ method က မလိုအပ်ပါဘူး — socket ကို [`net.createConnection()`][] နဲ့ ဖန်တီးပြီး ဖွင့်လှစ်သင့်ပါတယ်။ Custom Socket တစ်ခုကို အကောင်အထည်ဖော်တဲ့အခါမှသာ ဒါကို သုံးပါ။

TCP connections တွေအတွက် ရရှိနိုင်တဲ့ `options` တွေကတော့:

* `autoSelectFamily` {boolean}: `true` လို့ သတ်မှတ်ထားရင် — [RFC 8305][] ရဲ့ section 5 ကို အကြမ်းဖျင်း (loosely) အကောင်အထည်ဖော်တဲ့ family autodetection algorithm တစ်ခုကို ဖွင့်ပေးပါတယ်။ Lookup ဆီကို ပေးပို့တဲ့ `all` option ကို `true` အဖြစ် သတ်မှတ်ပြီး — socket က ရရှိလာတဲ့ IPv6 နဲ့ IPv4 addresses အားလုံးဆီကို — connection တစ်ခု တည်ဆောက်နိုင်သည်အထိ — အစဉ်လိုက် (in sequence) ချိတ်ဆက်ဖို့ ကြိုးစားပါတယ်။ ပထမဆုံး ပြန်လာတဲ့ AAAA address ကို အရင်ဆုံး စမ်းပြီး — ပြီးရင် ပထမဆုံး ပြန်လာတဲ့ A address — ပြီးရင် ဒုတိယမြောက် ပြန်လာတဲ့ AAAA address — စသဖြင့် စမ်းသပ်ပါတယ်။ Connection attempt တစ်ခုချင်းစီ (နောက်ဆုံးတစ်ခုကလွဲလို့) ကို — အချိန်ကုန်ပြီး နောက် address တစ်ခုကို မစမ်းခင် — `autoSelectFamilyAttemptTimeout` option မှာ သတ်မှတ်ထားတဲ့ အချိန်ပမာဏကို ပေးပါတယ်။ `family` option က `0` မဟုတ်ရင် သို့မဟုတ် `localAddress` ကို သတ်မှတ်ထားရင် ဒါကို လျစ်လျူရှုပါတယ်။ အနည်းဆုံး connection တစ်ခု အောင်မြင်ရင် connection errors တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။ Connection attempts အားလုံး မအောင်မြင်ရင်တော့ — မအောင်မြင်ခဲ့တဲ့ attempts အားလုံးပါတဲ့ `AggregateError` တစ်ခုတည်းကို emit လုပ်ပါတယ်။ **Default:** [`net.getDefaultAutoSelectFamily()`][]။
* `autoSelectFamilyAttemptTimeout` {number}: `autoSelectFamily` option ကို သုံးနေတဲ့အခါ — နောက် address တစ်ခုကို မစမ်းခင် connection attempt တစ်ခု ပြီးဆုံးဖို့ စောင့်ဆိုင်းရမယ့် အချိန်ပမာဏ (milliseconds) ပါ။ `10` ထက် ငယ်တဲ့ positive integer တစ်ခုကို သတ်မှတ်ထားရင် — `10` ဆိုတဲ့ တန်ဖိုးကို အစားထိုး သုံးပါလိမ့်မယ်။ **Default:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`][]။
* `family` {number}: IP stack ရဲ့ version ပါ။ `4`, `6`, သို့မဟုတ် `0` ဖြစ်ရပါမယ်။ `0` ဆိုတဲ့ တန်ဖိုးက IPv4 ရော IPv6 addresses တွေပါ ခွင့်ပြုထားကြောင်း ဖော်ပြပါတယ်။ **Default:** `0`။
* `hints` {number} Optional ဖြစ်တဲ့ [`dns.lookup()` hints][] ပါ။
* `host` {string} Socket က ချိတ်ဆက်သင့်တဲ့ host ပါ။ **Default:** `'localhost'`။
* `localAddress` {string} Socket က ချိတ်ဆက်သင့်တဲ့ (ထွက်ရာ) local address ပါ။
* `localPort` {number} Socket က ချိတ်ဆက်သင့်တဲ့ (ထွက်ရာ) local port ပါ။
* `lookup` {Function} Custom lookup function ပါ။ **Default:** [`dns.lookup()`][]။
* `port` {number} မဖြစ်မနေ လိုအပ်ပါတယ်။ Socket က ချိတ်ဆက်သင့်တဲ့ port ပါ။

[IPC][] connections တွေအတွက် ရရှိနိုင်တဲ့ `options` တွေကတော့:

* `path` {string} မဖြစ်မနေ လိုအပ်ပါတယ်။ Client က ချိတ်ဆက်သင့်တဲ့ path ပါ။ [Identifying paths for IPC connections][] ကို ကြည့်ပါ။ ပေးထားရင် — အပေါ်က TCP-specific options တွေကို လျစ်လျူရှုပါတယ်။

#### `socket.connect(path[, connectListener])`

* `path` {string} Client က ချိတ်ဆက်သင့်တဲ့ path ပါ။ [Identifying paths for IPC connections][] ကို ကြည့်ပါ။
* `connectListener` {Function} [`socket.connect()`][] methods တွေရဲ့ အသုံးများတဲ့ parameter ပါ။ [`'connect'`][] event အတွက် listener အဖြစ် တစ်ကြိမ်တည်း ထည့်သွင်းပါလိမ့်မယ်။
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

ပေးထားတဲ့ socket ပေါ်မှာ [IPC][] connection တစ်ခုကို စတင်ပါတယ်။

[`socket.connect(options[, connectListener])`][`socket.connect(options)`] ကို `options` အဖြစ် `{ path: path }` နဲ့ ခေါ်လိုက်တာရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

#### `socket.connect(port[, host][, connectListener])`

* `port` {number} Client က ချိတ်ဆက်သင့်တဲ့ port ပါ။
* `host` {string} Client က ချိတ်ဆက်သင့်တဲ့ host ပါ။
* `connectListener` {Function} [`socket.connect()`][] methods တွေရဲ့ အသုံးများတဲ့ parameter ပါ။ [`'connect'`][] event အတွက် listener အဖြစ် တစ်ကြိမ်တည်း ထည့်သွင်းပါလိမ့်မယ်။
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

ပေးထားတဲ့ socket ပေါ်မှာ TCP connection တစ်ခုကို စတင်ပါတယ်။

[`socket.connect(options[, connectListener])`][`socket.connect(options)`] ကို `options` အဖြစ် `{port: port, host: host}` နဲ့ ခေါ်လိုက်တာရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။
### `socket.connecting`

* Type: {boolean}

`true` ဖြစ်နေရင် — [`socket.connect(options[, connectListener])`][`socket.connect(options)`] ကို ခေါ်ထားပြီး မပြီးဆုံးသေးဘူးလို့ ဆိုလိုပါတယ်။ Socket က ချိတ်ဆက်ပြီးသွားတဲ့အထိ `true` အဖြစ် ဆက်ရှိနေပြီး — ပြီးတဲ့အခါမှာ `false` အဖြစ် သတ်မှတ်ပြီး `'connect'` event ကို emit လုပ်ပါတယ်။ [`socket.connect(options[, connectListener])`][`socket.connect(options)`] ရဲ့ callback က `'connect'` event ရဲ့ listener တစ်ခု ဖြစ်တာကို သတိပြုပါ။

### `socket.destroy([error])`

* `error` {Object}
* Returns: {net.Socket}

လက်ရှိ connection ပေါ်မှာ I/O လုပ်ဆောင်ချက် နောက်ထပ် မဖြစ်ပွားတော့အောင် သေချာ ဆောင်ရွက်ပေးပါတယ်။ Stream ကို destroy လုပ်ပြီး connection ကို ပိတ်ပါတယ်။

အသေးစိတ်အတွက် [`writable.destroy()`][] ကို ကြည့်ပါ။

### `socket.destroyed`

* Type: {boolean} Connection က destroy လုပ်ထားလား မလုပ်ထားဘူးလားဆိုတာ ဖော်ပြပါတယ်။ Destroy လုပ်ထားတဲ့ connection တစ်ခုကို သုံးပြီး data တွေ နောက်ထပ် လွှဲပြောင်းလို့ မရတော့ပါဘူး။

အသေးစိတ်အတွက် [`writable.destroyed`][] ကို ကြည့်ပါ။

### `socket.destroySoon()`

Data အားလုံး ရေးသားပြီးတာနဲ့ socket ကို destroy လုပ်ပါတယ်။ `'finish'` event ကို ရှေ့ကတည်းက emit လုပ်ပြီးသားဆိုရင် — socket ကို ချက်ချင်း destroy လုပ်ပါတယ်။ Socket က ရေးလို့ရဆဲ (writable) ဖြစ်နေရင် — implicitly `socket.end()` ကို ခေါ်ပါတယ်။

### `socket.end([data[, encoding]][, callback])`

* `data` {string|Buffer|Uint8Array}
* `encoding` {string} `data` က `string` ဖြစ်တဲ့အခါမှသာ သုံးပါတယ်။ **Default:** `'utf8'`။
* `callback` {Function} Socket ပြီးဆုံးသွားတဲ့အခါအတွက် optional callback ပါ။
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Socket ကို half-close လုပ်ပါတယ်။ ဆိုလိုတာက FIN packet တစ်ခုကို ပို့ပေးတာပါ။ Server က data တစ်ချို့ ဆက်ပြီး ပို့ပေးနိုင်တာ ဖြစ်နိုင်ပါတယ်။

အသေးစိတ်အတွက် [`writable.end()`][] ကို ကြည့်ပါ။

### `socket.localAddress`

* Type: {string}

Remote client က ချိတ်ဆက်နေတဲ့ local IP address ရဲ့ string ပုံစံ ဖော်ပြချက်ပါ။ ဥပမာ — `'0.0.0.0'` ပေါ်မှာ listening လုပ်နေတဲ့ server တစ်ခုမှာ client တစ်ခုက `'192.168.1.1'` ကနေ ချိတ်ဆက်ရင် — `socket.localAddress` ရဲ့ တန်ဖိုးက `'192.168.1.1'` ဖြစ်ပါလိမ့်မယ်။

### `socket.localPort`

* Type: {integer}

Local port ရဲ့ ဂဏန်း (numeric) ပုံစံ ဖော်ပြချက်ပါ။ ဥပမာ — `80` သို့မဟုတ် `21`။

### `socket.localFamily`

* Type: {string}

Local IP family ရဲ့ string ပုံစံ ဖော်ပြချက်ပါ။ `'IPv4'` သို့မဟုတ် `'IPv6'` ဖြစ်ပါတယ်။

### `socket.pause()`

* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Data ဖတ်ခြင်းကို ရပ်နားပါတယ်။ ဆိုလိုတာက [`'data'`][] events တွေကို emit လုပ်တော့မှာ မဟုတ်ပါဘူး။ Upload တစ်ခုကို နှေးအောင် ထိန်းချုပ်ဖို့ (throttle back) အသုံးဝင်ပါတယ်။

### `socket.pending`

* Type: {boolean}

Socket က မချိတ်ဆက်ရသေးဘူးဆိုရင် — `.connect()` ကို မခေါ်ရသေးလို့ပဲ ဖြစ်ဖြစ်၊ ချိတ်ဆက်နေတုန်း ဖြစ်နေလို့ပဲ ဖြစ်ဖြစ် — ဒါက `true` ဖြစ်ပါတယ် ([`socket.connecting`][] ကို ကြည့်ပါ)။

### `socket.ref()`

* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

`unref()` ရဲ့ ဆန့်ကျင်ဘက်ပါ။ အရင်က `unref` လုပ်ထားတဲ့ socket တစ်ခုပေါ်မှာ `ref()` ကို ခေါ်လိုက်ရင် — ကျန်ရှိနေတဲ့ socket က ဒီတစ်ခုတည်းသာ ဆိုရင်တောင် — program က ထွက်သွားဖို့ _ခွင့်မပြုတော့ပါဘူး_ (default အပြုအမူပါ)။ Socket က `ref` လုပ်ထားပြီးသားဆိုရင် `ref()` ကို ထပ်ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

### `socket.remoteAddress`

* Type: {string}

Remote IP address ရဲ့ string ပုံစံ ဖော်ပြချက်ပါ။ ဥပမာ — `'74.125.127.100'` သို့မဟုတ် `'2001:4860:a005::68'`။ Socket က destroy လုပ်ထားရင် (ဥပမာ — client က ချိတ်ဆက်မှု ဖြတ်လိုက်ရင်) တန်ဖိုးက `undefined` ဖြစ်နိုင်ပါတယ်။

### `socket.remoteFamily`

* Type: {string}

Remote IP family ရဲ့ string ပုံစံ ဖော်ပြချက်ပါ။ `'IPv4'` သို့မဟုတ် `'IPv6'` ဖြစ်ပါတယ်။ Socket က destroy လုပ်ထားရင် (ဥပမာ — client က ချိတ်ဆက်မှု ဖြတ်လိုက်ရင်) တန်ဖိုးက `undefined` ဖြစ်နိုင်ပါတယ်။

### `socket.remotePort`

* Type: {integer}

Remote port ရဲ့ ဂဏန်း (numeric) ပုံစံ ဖော်ပြချက်ပါ။ ဥပမာ — `80` သို့မဟုတ် `21`။ Socket က destroy လုပ်ထားရင် (ဥပမာ — client က ချိတ်ဆက်မှု ဖြတ်လိုက်ရင်) တန်ဖိုးက `undefined` ဖြစ်နိုင်ပါတယ်။

### `socket.server`

* Type: {net.Server|null}

Socket ကို လက်ခံခဲ့တဲ့ server ဆီကို ရည်ညွှန်းချက် (reference) ပါ။ Server တစ်ခုက လက်မခံခဲ့တဲ့ sockets တွေအတွက်တော့ ဒါက `null` ဖြစ်ပါတယ်။

### `socket.resetAndDestroy()`

* Returns: {net.Socket}

RST packet တစ်ခု ပို့ပြီး stream ကို destroy လုပ်ခြင်းအားဖြင့် TCP connection ကို ပိတ်ပါတယ်။ ဒီ TCP socket က connecting အခြေအနေမှာ ရှိနေရင် — ချိတ်ဆက်ပြီးတာနဲ့ RST packet တစ်ခု ပို့ပြီး ဒီ TCP socket ကို destroy လုပ်ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ `ERR_SOCKET_CLOSED` Error တစ်ခုနဲ့ `socket.destroy` ကို ခေါ်ပါလိမ့်မယ်။ ဒါက TCP socket မဟုတ်ဘူးဆိုရင် (ဥပမာ — pipe တစ်ခု) — ဒီ method ကို ခေါ်လိုက်တာနဲ့ `ERR_INVALID_HANDLE_TYPE` Error တစ်ခုကို ချက်ချင်း throw လုပ်ပါလိမ့်မယ်။

### `socket.resume()`

* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

[`socket.pause()`][] ကို ခေါ်ပြီးနောက် reading ကို ပြန်လည် စတင်ပါတယ်။

### `socket.setEncoding([encoding])`

* `encoding` {string}
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Socket အတွက် encoding ကို [Readable Stream][] တစ်ခုအနေနဲ့ သတ်မှတ်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`readable.setEncoding()`][] ကို ကြည့်ပါ။

### `socket.setKeepAlive()`

Keep-alive လုပ်ဆောင်ချက်ကို ဖွင့်/ပိတ် လုပ်ပြီး — keepalive probe အချိန်ကိုက်မှုကို ဆန္ဒရှိရင် ပြင်ဆင်သတ်မှတ်ပေးပါတယ်။ Socket ကိုယ်တိုင်ကို ပြန်ပေးပါတယ်။

ဖြစ်နိုင်တဲ့ signatures တွေကတော့:

* [`socket.setKeepAlive([options])`][`socket.setKeepAlive(options)`]
* [`socket.setKeepAlive([enable][, initialDelay][, interval][, count])`][`socket.setKeepAlive(enable)`]

Keep-alive ကို ဖွင့်လိုက်တာက — အလုပ်မရှိတဲ့ (idle) socket တစ်ခုပေါ်မှာ ပထမဆုံး keepalive probe ကို မပို့ခင် ကနဦး စောင့်ဆိုင်းချိန် (initial delay) ကို သတ်မှတ်ပေးပါတယ်။

`initialDelay` ကို (milliseconds နဲ့) သတ်မှတ်လိုက်တာက — နောက်ဆုံး လက်ခံရရှိတဲ့ data packet နဲ့ ပထမဆုံး keepalive probe ကြားက စောင့်ဆိုင်းချိန်ကို သတ်မှတ်ပေးပါတယ်။ `initialDelay` အတွက် `0` ကို သတ်မှတ်လိုက်ရင် — တန်ဖိုးက default (သို့မဟုတ် အရင်) setting ကနေ မပြောင်းလဲဘဲ ချန်ထားပါလိမ့်မယ်။

`interval` ကို (milliseconds နဲ့) သတ်မှတ်လိုက်တာက — keepalive probes တွေ စတင်ပြီးတာနဲ့ ၎င်းတို့ကြားက စောင့်ဆိုင်းချိန်ကို သတ်မှတ်ပေးပါတယ် (`TCP_KEEPINTVL`)။ `count` ကို သတ်မှတ်လိုက်တာက — connection ကို မဖြတ်ခင် ပို့လိုက်တဲ့ အဖြေမပြန်တဲ့ (unacknowledged) probes အရေအတွက်ကို သတ်မှတ်ပေးပါတယ် (`TCP_KEEPCNT`)။ နှစ်ခုလုံးကို keep-alive ဖွင့်ထားတဲ့အခါမှသာ အသုံးပြုပါတယ်။ `interval` သို့မဟုတ် `count` ကို ချန်လှပ်ထားရင် — `1000` ms နဲ့ `10` ဆိုတဲ့ defaults တွေကို သုံးပါတယ်။ `initialDelay` မှာ ရှိသလိုပဲ — positive မဟုတ်တဲ့ `interval` သို့မဟုတ် `count` တစ်ခုက သက်ဆိုင်ရာ system default ကို မပြောင်းလဲဘဲ ချန်ထားပါတယ်။

`initialDelay` နဲ့ `interval` တို့ကို milliseconds နဲ့ သတ်မှတ်ပေမယ့် — အခြေခံ socket options တွေကိုတော့ တစ်စက္ကန့်လုံး (whole seconds) နဲ့ ပြင်ဆင်ပါတယ်; တန်ဖိုးတွေကို အသုံးမပြုခင် `1000` နဲ့ စားပြီး အောက်သို့ ပတ်လုံးချ (rounded down) ပါတယ်။

Keep-alive လုပ်ဆောင်ချက်ကို ဖွင့်လိုက်တာက အောက်ပါ socket options တွေကို သတ်မှတ်ပေးပါလိမ့်မယ်:

* `SO_KEEPALIVE=1`
* `TCP_KEEPIDLE=initialDelay / 1000`
* `TCP_KEEPCNT=count`
* `TCP_KEEPINTVL=interval / 1000`

Build 1709 ထက် နည်းတဲ့ (အဟောင်း) Windows versions တွေမှာတော့ — keep-alive ကို `SIO_KEEPALIVE_VALS` ကနေတစ်ဆင့် ပြင်ဆင်ပါတယ် — ၎င်းမှာ probe-count field မရှိတာမို့ — အဲဒီ platforms တွေမှာ `count` ကို လျစ်လျူရှုပါတယ်။

#### `socket.setKeepAlive([options])`

* `options` {Object}
  * `enable` {boolean} **Default:** `false`
  * `initialDelay` {number} **Default:** `0`
  * `interval` {number} **Default:** `1000`
  * `count` {number} **Default:** `10`
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Options object တစ်ခုကို သုံးပြီး keep-alive ကို ပြင်ဆင်ပါတယ်။ Property တစ်ခုချင်းစီရဲ့ ဖော်ပြချက်အတွက် [`socket.setKeepAlive()`][] ကို ကြည့်ပါ။

```js
socket.setKeepAlive({ enable: true, initialDelay: 1000, interval: 1000, count: 10 });
```

#### `socket.setKeepAlive([enable][, initialDelay][, interval][, count])`

* `enable` {boolean} **Default:** `false`
* `initialDelay` {number} **Default:** `0`
* `interval` {number} **Default:** `1000`
* `count` {number} **Default:** `10`
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Positional arguments တွေကို သုံးပြီး keep-alive ကို ပြင်ဆင်ပါတယ်။ Argument တစ်ခုချင်းစီရဲ့ ဖော်ပြချက်အတွက် [`socket.setKeepAlive()`][] ကို ကြည့်ပါ။

### `socket.setNoDelay([noDelay])`

* `noDelay` {boolean} **Default:** `true`
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Nagle's algorithm သုံးစွဲမှုကို ဖွင့်/ပိတ် လုပ်ပါတယ်။

TCP connection တစ်ခု ဖန်တီးလိုက်တဲ့အခါ — Nagle's algorithm က ဖွင့်ထားပြီးသား ဖြစ်ပါလိမ့်မယ်။

Nagle's algorithm က network ပေါ်ကို မပို့ခင် data တွေကို နှောင့်နှေးစေပါတယ်။ ၎င်းက latency ရဲ့ ကုန်ကျစရိတ်နဲ့ throughput ကို အကောင်းဆုံးဖြစ်အောင် ကြိုးစားပါတယ်။

`noDelay` အတွက် `true` ကို ပေးလိုက်တာ သို့မဟုတ် argument လုံးဝ မပေးဘဲ ထားလိုက်တာက — socket အတွက် Nagle's algorithm ကို ပိတ်ပေးပါလိမ့်မယ်။ `noDelay` အတွက် `false` ကို ပေးလိုက်တာကတော့ Nagle's algorithm ကို ဖွင့်ပေးပါလိမ့်မယ်။

### `socket.setTimeout(timeout[, callback])`

* `timeout` {number}
* `callback` {Function}
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Socket ပေါ်မှာ လှုပ်ရှားမှုမရှိဘဲ `timeout` milliseconds ကြာသွားရင် အချိန်ကုန်စေဖို့ (timeout) socket ကို သတ်မှတ်ပေးပါတယ်။ Default အနေနဲ့ `net.Socket` တွေမှာ timeout မရှိပါဘူး။

အလုပ်မရှိတဲ့ (idle) timeout တစ်ခု ဖြစ်ပေါ်တဲ့အခါ socket က [`'timeout'`][] event တစ်ခုကို လက်ခံရရှိပါလိမ့်မယ် — ဒါပေမယ့် connection ကိုတော့ မဖြတ်ပါဘူး။ Connection ကို အဆုံးသတ်ဖို့ user က [`socket.end()`][] သို့မဟုတ် [`socket.destroy()`][] ကို ကိုယ်တိုင် ခေါ်ပေးရပါမယ်။

```js
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```

`timeout` က 0 ဆိုရင် — ရှိပြီးသား idle timeout ကို ပိတ်လိုက်ပါတယ်။

Optional ဖြစ်တဲ့ `callback` parameter ကို [`'timeout'`][] event အတွက် one-time listener အဖြစ် ထည့်သွင်းပါလိမ့်မယ်။

### `socket.getTypeOfService()`

* Returns: {integer} လက်ရှိ TOS တန်ဖိုးပါ။

ဒီ socket အတွက် IPv4 packets တွေရဲ့ Type of Service (TOS) field သို့မဟုတ် IPv6 packets တွေရဲ့ Traffic Class ရဲ့ လက်ရှိ တန်ဖိုးကို ပြန်ပေးပါတယ်။

`setTypeOfService()` ကို socket မချိတ်ဆက်ခင် ခေါ်နိုင်ပါတယ်; တန်ဖိုးကို cache လုပ်ထားပြီး — socket က connection တစ်ခု တည်ဆောက်တဲ့အခါ အသုံးပြုပါလိမ့်မယ်။ `getTypeOfService()` က ချိတ်ဆက်မှု မရှိသေးခင် အချိန်မှာတောင် လက်ရှိ သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။

Platform အချို့မှာ (ဥပမာ — Linux) TOS/ECN bits အချို့ကို mask လုပ်ထား သို့မဟုတ် လျစ်လျူရှုထားနိုင်ပြီး — IPv4 နဲ့ IPv6 သို့မဟုတ် dual-stack sockets တွေကြားမှာလည်း အပြုအမူ ကွဲပြားနိုင်ပါတယ်။ Callers တွေက platform-specific ဖြစ်တဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေကို စိစစ်သင့်ပါတယ်။

### `socket.setTypeOfService(tos)`

* `tos` {integer} သတ်မှတ်ရမယ့် TOS တန်ဖိုး (0-255) ပါ။
* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

ဒီ socket ကနေ ပို့လွှတ်တဲ့ IPv4 packets တွေရဲ့ Type of Service (TOS) field သို့မဟုတ် IPv6 Packets တွေရဲ့ Traffic Class ကို သတ်မှတ်ပါတယ်။ Network traffic တွေကို ဦးစားပေးဖို့ (prioritize) ဒါကို သုံးနိုင်ပါတယ်။

`setTypeOfService()` ကို socket မချိတ်ဆက်ခင် ခေါ်နိုင်ပါတယ်; တန်ဖိုးကို cache လုပ်ထားပြီး — socket က connection တစ်ခု တည်ဆောက်တဲ့အခါ အသုံးပြုပါလိမ့်မယ်။ `getTypeOfService()` က ချိတ်ဆက်မှု မရှိသေးခင် အချိန်မှာတောင် လက်ရှိ သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။

Platform အချို့မှာ (ဥပမာ — Linux) TOS/ECN bits အချို့ကို mask လုပ်ထား သို့မဟုတ် လျစ်လျူရှုထားနိုင်ပြီး — IPv4 နဲ့ IPv6 သို့မဟုတ် dual-stack sockets တွေကြားမှာလည်း အပြုအမူ ကွဲပြားနိုင်ပါတယ်။ Callers တွေက platform-specific ဖြစ်တဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေကို စိစစ်သင့်ပါတယ်။

### `socket.timeout`

* Type: {number|undefined}

[`socket.setTimeout()`][] နဲ့ သတ်မှတ်ထားတဲ့အတိုင်း socket ရဲ့ timeout ကို milliseconds နဲ့ ဖော်ပြပါတယ်။ Timeout တစ်ခုကို သတ်မှတ်မထားရင် `undefined` ဖြစ်ပါတယ်။

### `socket.unref()`

* Returns: {net.Socket} Socket ကိုယ်တိုင် ဖြစ်ပါတယ်။

Socket တစ်ခုပေါ်မှာ `unref()` ကို ခေါ်လိုက်ရင် — event system ထဲမှာ တက်ကြွနေတဲ့ (active) socket က ဒီတစ်ခုတည်းသာ ဆိုရင် — program က ထွက်သွားဖို့ ခွင့်ပြုပါလိမ့်မယ်။ Socket က ရှေ့ကတည်းက `unref` လုပ်ထားပြီးသားဆိုရင် `unref()` ကို ထပ်ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

### `socket.write(data[, encoding][, callback])`

* `data` {string|Buffer|Uint8Array}
* `encoding` {string} `data` က `string` ဖြစ်တဲ့အခါမှသာ သုံးပါတယ်။ **Default:** `utf8`။
* `callback` {Function}
* Returns: {boolean}

Socket ပေါ်မှာ data ကို ပို့လွှတ်ပါတယ်။ ဒုတိယ parameter က — data က string ဖြစ်တဲ့ အခြေအနေမှာ encoding ကို သတ်မှတ်ပေးပါတယ်။ ၎င်းက UTF8 encoding ကို default အနေနဲ့ သုံးပါတယ်။

Data တစ်ခုလုံးကို kernel buffer ဆီကို အောင်မြင်စွာ flush လုပ်နိုင်ခဲ့ရင် `true` ကို ပြန်ပေးပါတယ်။ Data အားလုံး သို့မဟုတ် တစ်စိတ်တစ်ပိုင်းကို user memory ထဲမှာ queue လုပ်ထားရရင်တော့ `false` ကို ပြန်ပေးပါတယ်။ Buffer က နောက်တစ်ကြိမ် လွတ်လပ်သွားတဲ့အခါ [`'drain'`][] ကို emit လုပ်ပါလိမ့်မယ်။

Optional ဖြစ်တဲ့ `callback` parameter ကို — data က နောက်ဆုံး ရေးထုတ်ပြီးတဲ့အခါ လုပ်ဆောင်ပါလိမ့်မယ် — ချက်ချင်း ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် `Writable` stream ရဲ့ [`write()`][stream_writable_write] method ကို ကြည့်ပါ။

### `socket.readyState`

* Type: {string}

ဒီ property က connection ရဲ့ အခြေအနေကို string တစ်ခုအနေနဲ့ ဖော်ပြပါတယ်။

* Socket က ချိတ်ဆက်နေတုန်း ဆိုရင် `socket.readyState` က `opening` ဖြစ်ပါတယ်။
* Socket က readable ရော writable ပါ ဖြစ်နေရင် — `open` ဖြစ်ပါတယ်။
* Socket က readable ဖြစ်ပြီး writable မဟုတ်ရင် — `readOnly` ဖြစ်ပါတယ်။
* Socket က readable မဟုတ်ပဲ writable ဖြစ်နေရင် — `writeOnly` ဖြစ်ပါတယ်။
* ကျန်တဲ့ အခြေအနေတွေမှာတော့ — `closed` ဖြစ်ပါတယ်။
## Class: `net.BoundSocket`

ကြိုတင်-bind လုပ်ထားတဲ့ (pre-bound) socket တစ်ခုကို synchronously ဖန်တီးနိုင်စေပြီး — ၎င်းကို နောက်ပိုင်းမှာ `listen()` သို့မဟုတ် `new net.Socket()` ဆီကို ပေးပို့နိုင်ပါတယ်။ `listen()` အတွက်ဆိုရင် ဒါက synchronous port ကြိုတင်သိမ်းဆည်းမှု (reservation) ကို ဖြစ်စေပြီး — `new net.Socket()` အတွက်ကတော့ — `bind(2)` semantics တွေကနေတစ်ဆင့် — local egress port/IP အပေါ် ထိန်းချုပ်မှု ပြုလုပ်နိုင်စေပါတယ်။

`BoundSocket` တစ်ခုက TCP endpoint တစ်ခု (`host` သို့မဟုတ် `port`) ကို ဖြစ်စေ — Unix domain/named-pipe endpoint တစ်ခု (`path`) ကို ဖြစ်စေ bind လုပ်ပါတယ်; နှစ်ခုက တစ်ခုနဲ့တစ်ခု သီးသန့် (mutually exclusive) ဖြစ်ပါတယ်။ `path` တစ်ခုအတွက်ဆိုရင် — file system entry ကို constructor ထဲမှာ ကြိုတင် သိမ်းဆည်းလိုက်တာမို့ — `EADDRINUSE` လိုမျိုး ပဋိပက္ခတွေက TCP bind လုပ်တာမှာ ရှိသလိုပဲ synchronously throw လုပ်ပါတယ်။ Linux မှာ `path` ရဲ့ ရှေ့ဆုံးမှာ `'\0'` ပါနေရင် abstract namespace ကို ရွေးချယ်လိုက်တာ ဖြစ်ပါတယ် (file system entry မရှိပါဘူး); တခြား platform တစ်ခုခုမှာ abstract path တစ်ခုက [`ERR_INVALID_ARG_VALUE`][] ကို throw လုပ်ပါတယ်။

လက်ခံယူလိုက်တာ (adoption) က socket ရဲ့ ပိုင်ဆိုင်မှုကို လွှဲပြောင်းပေးပါတယ်; နောက်ပိုင်းမှာ `address()` နဲ့ `close()` တို့က [`ERR_SOCKET_HANDLE_ADOPTED`][] ကို throw လုပ်ပါလိမ့်မယ်။ ဘယ်တော့မှ လက်ခံယူမခံရတဲ့ handle တစ်ခုကို — socket ပေါက်ကြားမှု (leak) မဖြစ်အောင် — ပိတ်ပေးရပါမယ်။ Pipe `BoundSocket` တစ်ခုကို ပိတ်လိုက်တာက ၎င်းရဲ့ file system entry ကို ဖယ်ရှားပေးပါတယ်; abstract နဲ့ TCP binds တွေမှာတော့ ဖယ်ရှားစရာ entry မရှိပါဘူး။

Source `path` တစ်ခုမှာ bind လုပ်ထားတဲ့ pipe `BoundSocket` တစ်ခုကို client တစ်ခုအနေနဲ့ လက်ခံယူလိုက်တဲ့အခါ — ၎င်းက ချိတ်ဆက်လိုက်တာနဲ့ အဲဒီ path ကို socket ရဲ့ `localAddress` အဖြစ် သတင်းပို့ပါတယ်။

လက်ခံယူလိုက်တဲ့ `BoundSocket` တစ်ခုက ဂဏန်း (numeric) IP literal တစ်ခုဆီကို ချိတ်ဆက်တဲ့အခါ — `connect(2)` ကို synchronously ထုတ်ပေးတာမို့ — [`socket.connect()`][] ပြန်လာတာနဲ့ [`socket.localAddress`][] က resolve လုပ်ပြီးသား ဖြစ်ပါတယ်။ Connection မအောင်မြင်မှုတွေကိုတော့ deferred `'error'` event တစ်ခုကနေတစ်ဆင့် သတင်းပို့ဆဲ ဖြစ်ပါတယ်။

```mjs
import net from 'node:net';

const bound = new net.BoundSocket();
const { port } = bound.address();
console.log(`Reserved port ${port} for server`);

const server = net.createServer();
server.listen(bound); // Adopt as a server, or pass to new net.Socket() instead.
```

### `new net.BoundSocket([options])`

* `options` {Object}
  * `host` {string} Bind လုပ်ရမယ့် local address ပါ။ ဂဏန်း (numeric) IP literal တစ်ခု ဖြစ်ရပါမယ်; DNS resolution လုပ်မပေးပါဘူး။ **Default:** `'0.0.0.0'` — ဒါမှမဟုတ် `ipv6Only` က `true` ဆိုရင် `'::'` ပါ။
  * `port` {number} Local port ပါ။ `0` ဆိုရင် OS က သတ်မှတ်ပေးတဲ့ ယာယီ (ephemeral) port တစ်ခုကို တောင်းဆိုပါတယ်။ **Default:** `0`။
  * `ipv6Only` {boolean} `IPV6_V6ONLY` ကို သတ်မှတ်ပေးပြီး — dual-stack ပံ့ပိုးမှုကို ပိတ်လိုက်တာမို့ socket က IPv6 ကိုသာ bind လုပ်ပါတယ်။ IPv6 binds တွေအတွက်သာ အဓိပ္ပာယ်ရှိပါတယ်။ **Default:** `false`။
  * `reusePort` {boolean} `SO_REUSEPORT` ကို သတ်မှတ်ပေးပြီး — kernel-level load balancing အတွက် address နဲ့ port တစ်ခုတည်းကို sockets အများအပြား bind လုပ်ခွင့်ပြုပါတယ်။ ပံ့ပိုးမှုက platform ပေါ် မူတည်ပါတယ်။ **Default:** `false`။
  * `path` {string} TCP endpoint အစား — ပေးထားတဲ့ path မှာ Unix domain socket (သို့မဟုတ် Windows named pipe) တစ်ခုကို bind လုပ်ပါတယ်။ ရှေ့ဆုံး `'\0'` က Linux abstract namespace ကို ရွေးချယ်ပါတယ်။ `host`, `port`, `ipv6Only`, `reusePort` တို့နဲ့ တစ်ခုနဲ့တစ်ခု သီးသန့် (mutually exclusive) ဖြစ်ပြီး — ပေါင်းပြီး သုံးလိုက်ရင် [`ERR_INVALID_ARG_VALUE`][] ကို throw လုပ်ပါတယ်။

### `boundSocket.address()`

* Returns: {Object|string} TCP bind တစ်ခုအတွက်ဆိုရင် — [`server.address()`][] က ပြန်ပေးသလို — `address`, `family`, `port` properties တွေပါတဲ့ object တစ်ခုပါ။ Pipe bind တစ်ခုအတွက်ဆိုရင် — pipe server တစ်ခုအတွက် [`server.address()`][] က ပြန်ပေးသလို — bound path string ပါ။

Bound လုပ်ထားတဲ့ local address ကို ပြန်ပေးပါတယ်။ `port: 0` နဲ့ bind လုပ်ထားတဲ့အခါ — `port` က OS က သတ်မှတ်ပေးတဲ့ ယာယီ (ephemeral) port ဖြစ်ပါတယ်။

### `boundSocket.isPipe`

* {boolean}

Socket ကို `path` တစ်ခုနဲ့ bind လုပ်ထားတဲ့အခါ (Unix domain socket သို့မဟုတ် Windows named pipe) — `true` ဖြစ်ပြီး — TCP bind တစ်ခုအတွက်တော့ `false` ဖြစ်ပါတယ်။ `net.BoundSocket.prototype` ပေါ်မှာ ဒီ getter ရှိနေတာကိုယ်တိုင်က — `path` ပံ့ပိုးမှုအတွက် capability probe (စွမ်းဆောင်နိုင်မှု စမ်းသပ်ချက်) တစ်ခုအနေနဲ့လည်း ဆောင်ရွက်ပါတယ်။

### `boundSocket.fd()`

* Returns: {integer} အခြေခံ OS file descriptor ပါ — sockets တွေအတွက် file descriptor ကို ထုတ်မပေးတဲ့ platforms တွေမှာ (Windows လိုမျိုး) `-1` ဖြစ်ပါတယ်။

Bound socket ရဲ့ file descriptor ကို ပြန်ပေးပါတယ်။ ပိုင်ဆိုင်မှုက `BoundSocket` မှာ ရှိနေဆဲမို့ — caller က descriptor ကို ပိတ်ပစ်လို့ မရပါဘူး။ Descriptor ကို handle ကို လက်ခံယူလိုက်တဲ့အချိန်အထိသာ ရရှိနိုင်ပြီး — နောက်ပိုင်းမှာ ၎င်းက လက်ခံယူလိုက်တဲ့ [`net.Server`][] သို့မဟုတ် [`net.Socket`][] ရဲ့ ပိုင်ဆိုင်မှု ဖြစ်သွားပြီး `fd()` က [`ERR_SOCKET_HANDLE_ADOPTED`][] ကို throw လုပ်ပါတယ်။

### `boundSocket.close()`

Bound socket ကို လွှတ်ပေးပါတယ်။ Handle ကို ဘယ်တော့မှ လက်ခံယူမခံရဘူးဆိုရင် ဒါမျိုးသာ လိုအပ်ပါတယ်။

### `boundSocket[Symbol.dispose]()`

Handle ကို လက်ခံယူထားခြင်း မရှိ၊ ပိတ်ထားခြင်း မရှိဘူးဆိုရင် — handle ကို ပိတ်ပေးပါတယ်; မဟုတ်ရင်တော့ ဘာမှ မလုပ်ဘဲ နေပါတယ် (no-op)။

## `net.connect()`

[`net.createConnection()`][`net.createConnection()`] ရဲ့ aliases တွေ ဖြစ်ပါတယ်။

ဖြစ်နိုင်တဲ့ signatures တွေကတော့:

* [`net.connect(options[, connectListener])`][`net.connect(options)`]
* [`net.connect(path[, connectListener])`][`net.connect(path)`]
  [IPC][] connections တွေအတွက် ဖြစ်ပါတယ်
* [`net.connect(port[, host][, connectListener])`][`net.connect(port, host)`]
  TCP connections တွေအတွက် ဖြစ်ပါတယ်

### `net.connect(options[, connectListener])`

* `options` {Object}
* `connectListener` {Function}
* Returns: {net.Socket}

[`net.createConnection(options[, connectListener])`][`net.createConnection(options)`] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

### `net.connect(path[, connectListener])`

* `path` {string}
* `connectListener` {Function}
* Returns: {net.Socket}

[`net.createConnection(path[, connectListener])`][`net.createConnection(path)`] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

### `net.connect(port[, host][, connectListener])`

* `port` {number}
* `host` {string}
* `connectListener` {Function}
* Returns: {net.Socket}

[`net.createConnection(port[, host][, connectListener])`][`net.createConnection(port, host)`] ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

## `net.createConnection()`

Factory function တစ်ခု ဖြစ်ပြီး — [`net.Socket`][] အသစ်တစ်ခုကို ဖန်တီးကာ — [`socket.connect()`][] နဲ့ ချက်ချင်း connection ကို စတင်ပြီး — connection ကို စတင်တဲ့ `net.Socket` ကို ပြန်ပေးပါတယ်။

Connection တည်ဆောက်ပြီးတဲ့အခါ — ပြန်ပေးလိုက်တဲ့ socket ပေါ်မှာ [`'connect'`][] event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ နောက်ဆုံး parameter ဖြစ်တဲ့ `connectListener` ကို ပေးထားရင် — [`'connect'`][] event အတွက် listener အဖြစ် **တစ်ကြိမ်တည်း** (once) ထည့်သွင်းပါလိမ့်မယ်။

ဖြစ်နိုင်တဲ့ signatures တွေကတော့:

* [`net.createConnection(options[, connectListener])`][`net.createConnection(options)`]
* [`net.createConnection(path[, connectListener])`][`net.createConnection(path)`]
  [IPC][] connections တွေအတွက် ဖြစ်ပါတယ်
* [`net.createConnection(port[, host][, connectListener])`][`net.createConnection(port, host)`]
  TCP connections တွေအတွက် ဖြစ်ပါတယ်

[`net.connect()`][] function က ဒီ function ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။

### `net.createConnection(options[, connectListener])`

* `options` {Object} မဖြစ်မနေ လိုအပ်ပါတယ်။ [`new net.Socket([options])`][`new net.Socket(options)`] call ရော [`socket.connect(options[, connectListener])`][`socket.connect(options)`] method ရဲ့ ဆီကိုပါ နှစ်ခုလုံးကို ပေးပို့ပါလိမ့်မယ်။
* `connectListener` {Function} [`net.createConnection()`][] functions တွေရဲ့ အသုံးများတဲ့ parameter ပါ။ ပေးထားရင် — ပြန်ပေးလိုက်တဲ့ socket ပေါ်က [`'connect'`][] event အတွက် listener အဖြစ် တစ်ကြိမ်တည်း ထည့်သွင်းပါလိမ့်မယ်။
* Returns: {net.Socket} Connection ကို စတင်ဖို့ သုံးတဲ့ အသစ်ဖန်တီးလိုက်တဲ့ socket ပါ။

ရရှိနိုင်တဲ့ options တွေအတွက် — [`new net.Socket([options])`][`new net.Socket(options)`] နဲ့ [`socket.connect(options[, connectListener])`][`socket.connect(options)`] တို့ကို ကြည့်ပါ။

နောက်ထပ် options တွေကတော့:

* `handle` {net.BoundSocket} Connection ရဲ့ source binding အဖြစ် သုံးတဲ့ ကြိုတင်-bind လုပ်ထားတဲ့ [`BoundSocket`][] တစ်ခုပါ — ၎င်းရဲ့ local address နဲ့ port ကို လေးစားလိုက်နာပါတယ်။ လက်ခံယူလိုက်တာက bound socket ကို သုံးစွဲလိုက်တာ ဖြစ်ပါတယ် ([ownership transfer][`BoundSocket`] ကို ကြည့်ပါ)။
* `timeout` {number} သတ်မှတ်ထားရင် — socket ကို ဖန်တီးပြီးနောက် — ဒါပေမယ့် connection ကို မစတင်ခင် — [`socket.setTimeout(timeout)`][] ကို ခေါ်ဖို့ သုံးပါလိမ့်မယ်။

အောက်မှာက [`net.createServer()`][] section မှာ ဖော်ပြထားတဲ့ echo server ရဲ့ client တစ်ခုရဲ့ ဥပမာ ဖြစ်ပါတယ်:

```mjs
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```cjs
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

`/tmp/echo.sock` socket ပေါ်မှာ ချိတ်ဆက်ဖို့:

```js
const client = net.createConnection({ path: '/tmp/echo.sock' });
```

အောက်မှာက `port` နဲ့ `onread` option ကို သုံးတဲ့ client တစ်ခုရဲ့ ဥပမာ ဖြစ်ပါတယ်။ ဒီကိစ္စမှာ — `onread` option ကို `new net.Socket([options])` ကို ခေါ်ဖို့သာ သုံးပြီး — `port` option ကို `socket.connect(options[, connectListener])` ကို ခေါ်ဖို့ သုံးပါလိမ့်မယ်။

```mjs
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```cjs
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

### `net.createConnection(path[, connectListener])`

* `path` {string} Socket က ချိတ်ဆက်သင့်တဲ့ path ပါ။ [`socket.connect(path[, connectListener])`][`socket.connect(path)`] ဆီကို ပေးပို့ပါလိမ့်မယ်။ [Identifying paths for IPC connections][] ကို ကြည့်ပါ။
* `connectListener` {Function} [`net.createConnection()`][] functions တွေရဲ့ အသုံးများတဲ့ parameter ပါ — connection ကို စတင်တဲ့ socket ပေါ်က `'connect'` event အတွက် "once" listener တစ်ခု ဖြစ်ပါတယ်။ [`socket.connect(path[, connectListener])`][`socket.connect(path)`] ဆီကို ပေးပို့ပါလိမ့်မယ်။
* Returns: {net.Socket} Connection ကို စတင်ဖို့ သုံးတဲ့ အသစ်ဖန်တီးလိုက်တဲ့ socket ပါ။

[IPC][] connection တစ်ခုကို စတင်ပါတယ်။

ဒီ function က options အားလုံး default အဖြစ်နဲ့ [`net.Socket`][] အသစ်တစ်ခုကို ဖန်တီးပြီး — [`socket.connect(path[, connectListener])`][`socket.connect(path)`] နဲ့ ချက်ချင်း connection ကို စတင်ကာ — connection ကို စတင်တဲ့ `net.Socket` ကို ပြန်ပေးပါတယ်။

### `net.createConnection(port[, host][, connectListener])`

* `port` {number} Socket က ချိတ်ဆက်သင့်တဲ့ port ပါ။ [`socket.connect(port[, host][, connectListener])`][`socket.connect(port)`] ဆီကို ပေးပို့ပါလိမ့်မယ်။
* `host` {string} Socket က ချိတ်ဆက်သင့်တဲ့ host ပါ။ [`socket.connect(port[, host][, connectListener])`][`socket.connect(port)`] ဆီကို ပေးပို့ပါလိမ့်မယ်။ **Default:** `'localhost'`။
* `connectListener` {Function} [`net.createConnection()`][] functions တွေရဲ့ အသုံးများတဲ့ parameter ပါ — connection ကို စတင်တဲ့ socket ပေါ်က `'connect'` event အတွက် "once" listener တစ်ခု ဖြစ်ပါတယ်။ [`socket.connect(port[, host][, connectListener])`][`socket.connect(port)`] ဆီကို ပေးပို့ပါလိမ့်မယ်။
* Returns: {net.Socket} Connection ကို စတင်ဖို့ သုံးတဲ့ အသစ်ဖန်တီးလိုက်တဲ့ socket ပါ။

TCP connection တစ်ခုကို စတင်ပါတယ်။

ဒီ function က options အားလုံး default အဖြစ်နဲ့ [`net.Socket`][] အသစ်တစ်ခုကို ဖန်တီးပြီး — [`socket.connect(port[, host][, connectListener])`][`socket.connect(port)`] နဲ့ ချက်ချင်း connection ကို စတင်ကာ — connection ကို စတင်တဲ့ `net.Socket` ကို ပြန်ပေးပါတယ်။

## `net.createServer([options][, connectionListener])`

* `options` {Object}
  * `allowHalfOpen` {boolean} `false` လို့ သတ်မှတ်ထားရင် — readable side က ဆုံးသွားတဲ့အခါ socket က writable side ကို အလိုအလျောက် end လုပ်ပါလိမ့်မယ်။ **Default:** `false`။
  * `highWaterMark` {number} [`net.Socket`][] တွေအားလုံးရဲ့ `readableHighWaterMark` နဲ့ `writableHighWaterMark` တို့ကို ဆန္ဒရှိရင် ထပ်ဆင့် override လုပ်ပေးပါတယ်။ **Default:** See [`stream.getDefaultHighWaterMark()`][]။
  * `keepAlive` {boolean} `true` လို့ သတ်မှတ်ထားရင် — incoming connection အသစ်တစ်ခုကို လက်ခံရရှိပြီးတာနဲ့ ချက်ချင်း socket ပေါ်မှာ keep-alive လုပ်ဆောင်ချက်ကို ဖွင့်ပေးပါတယ် — [`socket.setKeepAlive()`][] မှာ လုပ်ထားတာနဲ့ ဆင်တူပါတယ်။ **Default:** `false`။
  * `keepAliveInitialDelay` {number} Positive ဖြစ်တဲ့ ဂဏန်းတစ်ခု သတ်မှတ်ထားရင် — အလုပ်မရှိတဲ့ (idle) socket တစ်ခုပေါ်မှာ ပထမဆုံး keepalive probe ကို မပို့ခင် ကနဦး စောင့်ဆိုင်းချိန် (initial delay) ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `0`။
  * `noDelay` {boolean} `true` လို့ သတ်မှတ်ထားရင် — incoming connection အသစ်တစ်ခုကို လက်ခံရရှိပြီးတာနဲ့ ချက်ချင်း Nagle's algorithm သုံးစွဲမှုကို ပိတ်ပေးပါတယ်။ **Default:** `false`။
  * `pauseOnConnect` {boolean} Incoming connections တွေပေါ်မှာ socket ကို pause လုပ်ထားသင့်လားဆိုတာ ဖော်ပြပါတယ်။ **Default:** `false`။
  * `blockList` {net.BlockList} `blockList` ကို သတ်မှတ်ထားတဲ့ IP addresses, IP ranges တွေ သို့မဟုတ် IP subnets တွေဆီကို inbound access တွေ ပိတ်ပင်ဖို့ သုံးနိုင်ပါတယ်။ Server က reverse proxy, NAT စတာတွေရဲ့ နောက်မှာ ရှိနေရင်တော့ ဒါက အလုပ်မလုပ်ပါဘူး — block list နဲ့ စစ်ဆေးခံရတဲ့ address က proxy ရဲ့ address (သို့မဟုတ်) NAT က သတ်မှတ်ပေးတဲ့ address ဖြစ်နေလို့ပါ။

* `connectionListener` {Function} [`'connection'`][] event အတွက် listener အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။

* Returns: {net.Server}

TCP သို့မဟုတ် [IPC][] server အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

`allowHalfOpen` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — socket ရဲ့ အခြားတစ်ဖက်က transmission ဆုံးသွားကြောင်း အချက်ပြတဲ့အခါ — server က [`socket.end()`][] ကို တိုက်ရိုက် (explicitly) ခေါ်လိုက်မှသာ transmission အဆုံးသတ်ကြောင်းကို ပြန်ပို့ပေးပါလိမ့်မယ်။ ဥပမာ — TCP ရဲ့ ဆက်စပ်အခြေအနေမှာ FIN packet တစ်ခုကို လက်ခံရရှိတဲ့အခါ — [`socket.end()`][] ကို တိုက်ရိုက် ခေါ်လိုက်မှသာ FIN packet တစ်ခုကို ပြန်ပို့ပေးပါတယ်။ အဲဒီအချိန်အထိ connection က half-closed (non-readable ဖြစ်ပြီး writable ဖြစ်ဆဲ) ဖြစ်နေပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`'end'`][] event နဲ့ [RFC 1122][half-closed] (section 4.2.2.13) ကို ကြည့်ပါ။

`pauseOnConnect` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — incoming connection တစ်ခုချင်းစီနဲ့ ဆက်စပ်နေတဲ့ socket ကို pause လုပ်ထားပြီး — ၎င်းရဲ့ handle ကနေ data ဘာမှ ဖတ်မှာ မဟုတ်ပါဘူး။ ဒါက connections တွေကို — မူရင်း process က data ဘာမှ မဖတ်မိဘဲ — processes တွေကြားမှာ လွှဲပြောင်းနိုင်စေပါတယ်။ Pause လုပ်ထားတဲ့ socket တစ်ခုကနေ data ဖတ်ခြင်းကို စတင်ဖို့ — [`socket.resume()`][] ကို ခေါ်ပါ။

Server က — ဘယ်အရာကို [`listen()`][`server.listen()`] လုပ်လဲဆိုတာပေါ် မူတည်ပြီး — TCP server တစ်ခု သို့မဟုတ် [IPC][] server တစ်ခု ဖြစ်နိုင်ပါတယ်။

အောက်မှာက port 8124 ပေါ်မှာ connections တွေအတွက် listening လုပ်တဲ့ TCP echo server တစ်ခုရဲ့ ဥပမာ ဖြစ်ပါတယ်:

```mjs
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```cjs
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

`telnet` ကို သုံးပြီး ဒါကို စမ်းသပ်ကြည့်ပါ:

```bash
telnet localhost 8124
```

`/tmp/echo.sock` socket ပေါ်မှာ listen လုပ်ဖို့:

```js
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```

Unix domain socket server တစ်ခုဆီကို ချိတ်ဆက်ဖို့ `nc` ကို သုံးပါ:

```bash
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()`

[`socket.connect(options)`][] ရဲ့ `autoSelectFamily` option ရဲ့ လက်ရှိ default တန်ဖိုးကို ရယူပါတယ်။ `--no-network-family-autoselection` ဆိုတဲ့ command line option ကို ပေးထားခြင်း မရှိရင် — ကနဦး default တန်ဖိုးက `true` ဖြစ်ပါတယ်။

* Returns: {boolean} `autoSelectFamily` option ရဲ့ လက်ရှိ default တန်ဖိုးပါ။

## `net.setDefaultAutoSelectFamily(value)`

[`socket.connect(options)`][] ရဲ့ `autoSelectFamily` option ရဲ့ default တန်ဖိုးကို သတ်မှတ်ပါတယ်။

* `value` {boolean} Default တန်ဖိုးအသစ်ပါ။ `--no-network-family-autoselection` ဆိုတဲ့ command line option ကို ပေးထားခြင်း မရှိရင် — ကနဦး default တန်ဖိုးက `true` ဖြစ်ပါတယ်။

## `net.getDefaultAutoSelectFamilyAttemptTimeout()`

[`socket.connect(options)`][] ရဲ့ `autoSelectFamilyAttemptTimeout` option ရဲ့ လက်ရှိ default တန်ဖိုးကို ရယူပါတယ်။ ကနဦး default တန်ဖိုးက `500` ဖြစ်ပြီး — `--network-family-autoselection-attempt-timeout` ဆိုတဲ့ command line option ကနေတစ်ဆင့် သတ်မှတ်ထားတဲ့ တန်ဖိုးလည်း ဖြစ်နိုင်ပါတယ်။

* Returns: {number} `autoSelectFamilyAttemptTimeout` option ရဲ့ လက်ရှိ default တန်ဖိုးပါ။

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)`

[`socket.connect(options)`][] ရဲ့ `autoSelectFamilyAttemptTimeout` option ရဲ့ default တန်ဖိုးကို သတ်မှတ်ပါတယ်။

* `value` {number} Default တန်ဖိုးအသစ်ပါ — positive ဖြစ်တဲ့ ဂဏန်းတစ်ခု ဖြစ်ရပါမယ်။ ဂဏန်းက `10` ထက် ငယ်နေရင် — `10` ဆိုတဲ့ တန်ဖိုးကို အစားထိုး သုံးပါတယ်။ ကနဦး default တန်ဖိုးက `250` ဖြစ်ပြီး — `--network-family-autoselection-attempt-timeout` ဆိုတဲ့ command line option ကနေတစ်ဆင့် သတ်မှတ်ထားတဲ့ တန်ဖိုးလည်း ဖြစ်နိုင်ပါတယ်။

## `net.isIP(input)`

* `input` {string}
* Returns: {integer}

`input` က IPv6 address တစ်ခုဆိုရင် — IPv4-mapped IPv6 address တစ်ခု အပါအဝင် — `6` ကို ပြန်ပေးပါတယ်။ `input` က [dot-decimal notation][] နဲ့ ဖော်ပြပြီး ရှေ့ဆုံးမှာ zeroes တွေ မပါတဲ့ IPv4 address တစ်ခုဆိုရင် `4` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် `0` ကို ပြန်ပေးပါတယ်။

```js
net.isIP('::1'); // returns 6
net.isIP('::ffff:127.0.0.1'); // returns 6
net.isIP('127.0.0.1'); // returns 4
net.isIP('127.000.000.001'); // returns 0
net.isIP('127.0.0.1/24'); // returns 0
net.isIP('fhqwhgads'); // returns 0
```

## `net.isIPv4(input)`

* `input` {string}
* Returns: {boolean}

`input` က [dot-decimal notation][] နဲ့ ဖော်ပြပြီး ရှေ့ဆုံးမှာ zeroes တွေ မပါတဲ့ IPv4 address တစ်ခုဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

```js
net.isIPv4('127.0.0.1'); // returns true
net.isIPv4('127.000.000.001'); // returns false
net.isIPv4('127.0.0.1/24'); // returns false
net.isIPv4('fhqwhgads'); // returns false
```

## `net.isIPv6(input)`

* `input` {string}
* Returns: {boolean}

`input` က IPv6 address တစ်ခုဆိုရင် — IPv4-mapped IPv6 address တစ်ခု အပါအဝင် — `true` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

```js
net.isIPv6('::1'); // returns true
net.isIPv6('::ffff:127.0.0.1'); // returns true
net.isIPv6('fhqwhgads'); // returns false
```

[IPC]: #ipc-support
[Identifying paths for IPC connections]: #identifying-paths-for-ipc-connections
[RFC 8305]: https://www.rfc-editor.org/rfc/rfc8305.txt
[Readable Stream]: stream.md#class-streamreadable
[Transferring TCP handles to other threads]: #transferring-tcp-handles-to-other-threads
[`'close'`]: #event-close
[`'connect'`]: #event-connect
[`'connection'`]: #event-connection
[`'data'`]: #event-data
[`'drain'`]: #event-drain
[`'end'`]: #event-end
[`'error'`]: #event-error_1
[`'listening'`]: #event-listening
[`'timeout'`]: #event-timeout
[`BoundSocket`]: #class-netboundsocket
[`ERR_INVALID_ARG_VALUE`]: errors.md#err_invalid_arg_value
[`ERR_SOCKET_HANDLE_ADOPTED`]: errors.md#err_socket_handle_adopted
[`EventEmitter`]: events.md#class-eventemitter
[`child_process.fork()`]: child_process.md#child_processforkmodulepath-args-options
[`dns.lookup()`]: dns.md#dnslookuphostname-options-callback
[`dns.lookup()` hints]: dns.md#supported-getaddrinfo-flags
[`net.Server`]: #class-netserver
[`net.Socket`]: #class-netsocket
[`net.connect()`]: #netconnect
[`net.connect(options)`]: #netconnectoptions-connectlistener
[`net.connect(path)`]: #netconnectpath-connectlistener
[`net.connect(port, host)`]: #netconnectport-host-connectlistener
[`net.createConnection()`]: #netcreateconnection
[`net.createConnection(options)`]: #netcreateconnectionoptions-connectlistener
[`net.createConnection(path)`]: #netcreateconnectionpath-connectlistener
[`net.createConnection(port, host)`]: #netcreateconnectionport-host-connectlistener
[`net.createServer()`]: #netcreateserveroptions-connectionlistener
[`net.getDefaultAutoSelectFamily()`]: #netgetdefaultautoselectfamily
[`net.getDefaultAutoSelectFamilyAttemptTimeout()`]: #netgetdefaultautoselectfamilyattempttimeout
[`new net.Socket(options)`]: #new-netsocketoptions
[`readable.setEncoding()`]: stream.md#readablesetencodingencoding
[`server.address()`]: #serveraddress
[`server.close()`]: #serverclosecallback
[`server.dropMaxConnection`]: #serverdropmaxconnection
[`server.listen()`]: #serverlisten
[`server.listen(handle)`]: #serverlistenhandle-backlog-callback
[`server.listen(options)`]: #serverlistenoptions-callback
[`server.listen(path)`]: #serverlistenpath-backlog-callback
[`server.listen(port)`]: #serverlistenport-host-backlog-callback
[`server.maxConnections`]: #servermaxconnections
[`socket(7)`]: https://man7.org/linux/man-pages/man7/socket.7.html
[`socket.connect()`]: #socketconnect
[`socket.connect(options)`]: #socketconnectoptions-connectlistener
[`socket.connect(path)`]: #socketconnectpath-connectlistener
[`socket.connect(port)`]: #socketconnectport-host-connectlistener
[`socket.connecting`]: #socketconnecting
[`socket.destroy()`]: #socketdestroyerror
[`socket.end()`]: #socketenddata-encoding-callback
[`socket.localAddress`]: #socketlocaladdress
[`socket.pause()`]: #socketpause
[`socket.resume()`]: #socketresume
[`socket.setEncoding()`]: #socketsetencodingencoding
[`socket.setKeepAlive()`]: #socketsetkeepalive
[`socket.setKeepAlive(enable)`]: #socketsetkeepaliveenable-initialdelay-interval-count
[`socket.setKeepAlive(options)`]: #socketsetkeepaliveoptions
[`socket.setTimeout()`]: #socketsettimeouttimeout-callback
[`socket.setTimeout(timeout)`]: #socketsettimeouttimeout-callback
[`stream.getDefaultHighWaterMark()`]: stream.md#streamgetdefaulthighwatermarkobjectmode
[`worker_threads`]: worker_threads.md
[`writable.destroy()`]: stream.md#writabledestroyerror
[`writable.destroyed`]: stream.md#writabledestroyed
[`writable.end()`]: stream.md#writableendchunk-encoding-callback
[`writable.writableLength`]: stream.md#writablewritablelength
[dot-decimal notation]: https://en.wikipedia.org/wiki/Dot-decimal_notation
[half-closed]: https://tools.ietf.org/html/rfc1122
[stream_writable_write]: stream.md#writablewritechunk-encoding-callback
[unspecified IPv4 address]: https://en.wikipedia.org/wiki/0.0.0.0
[unspecified IPv6 address]: https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address
