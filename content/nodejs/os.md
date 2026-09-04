---
title: "OS"
description: "node:os module — OS ဆိုင်ရာ utility methods/properties (arch, cpus, EOL, networkInterfaces, constants စသည်)"
order: 96
source: "https://nodejs.org/api/os.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:os` module က operating system နဲ့ ဆက်စပ်တဲ့ utility methods နဲ့ properties တွေကို ပံ့ပိုးပေးပါတယ်။ အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import os from 'node:os';
```

```cjs
const os = require('node:os');
```

## `os.EOL`

* Type: {string}

Operating system အလိုက် သီးသန့် end-of-line marker ပါ။

* `\n` (POSIX တွင်)
* `\r\n` (Windows တွင်)

## `os.availableParallelism()`

* Returns: {integer}

Program တစ်ခု သုံးသင့်တဲ့ default parallelism ပမာဏရဲ့ ခန့်မှန်းချက်ကို ပြန်ပေးပါတယ်။ အမြဲတမ်း သုညထက် ကြီးတဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

ဒီ function က libuv ရဲ့ [`uv_available_parallelism()`][] အပေါ် အသေးစား wrapper တစ်ခုပါ။

## `os.arch()`

* Returns: {string}

Node.js binary ကို compile လုပ်ထားတဲ့ operating system ရဲ့ CPU architecture ကို ပြန်ပေးပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc64'`, `'riscv64'`, `'s390x'`, နဲ့ `'x64'` တို့ပါ။

ပြန်ပေးတဲ့ တန်ဖိုးက [`process.arch`][] နဲ့ ညီမျှပါတယ်။

## `os.constants`

* Type: {Object}

Error codes, process signals စတဲ့ operating system အလိုက် ကွဲပြားတဲ့ အသုံးများ constant တွေ ပါဝင်ပါတယ်။ သတ်မှတ်ထားတဲ့ constant တွေရဲ့ အသေးစိတ်ကို [OS constants](#os-constants) မှာ ဖော်ပြထားပါတယ်။

## `os.cpus()`

* Returns: {Object\[]}

Logical CPU core တစ်ခုချင်းစီရဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ object တွေရဲ့ array ကို ပြန်ပေးပါတယ်။ `/proc` file system မရနိုင်တာလိုမျိုး CPU အချက်အလက် လုံးဝ မရရှိနိုင်ဘူးဆိုရင် array က ဗလာ ဖြစ်နေပါလိမ့်မယ်။

Object တစ်ခုချင်းစီမှာ ပါဝင်တဲ့ properties တွေကတော့:

* `model` {string}
* `speed` {number} (MHz ဖြင့်)
* `times` {Object}
  * `user` {number} CPU က user mode မှာ ကုန်ဆုံးစေခဲ့တဲ့ millisecond အရေအတွက်။
  * `nice` {number} CPU က nice mode မှာ ကုန်ဆုံးစေခဲ့တဲ့ millisecond အရေအတွက်။
  * `sys` {number} CPU က sys mode မှာ ကုန်ဆုံးစေခဲ့တဲ့ millisecond အရေအတွက်။
  * `idle` {number} CPU က idle mode မှာ ကုန်ဆုံးစေခဲ့တဲ့ millisecond အရေအတွက်။
  * `irq` {number} CPU က irq mode မှာ ကုန်ဆုံးစေခဲ့တဲ့ millisecond အရေအတွက်။

```js
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
];
```

`nice` တန်ဖိုးတွေက POSIX မှာပဲ ရှိပါတယ်။ Windows မှာတော့ processor အားလုံးရဲ့ `nice` တန်ဖိုးတွေက အမြဲတမ်း 0 ပါ။

`os.cpus().length` ကို application တစ်ခုအတွက် ရရှိနိုင်တဲ့ parallelism ပမာဏကို တွက်ချက်ဖို့ မသုံးသင့်ပါဘူး။ ဒီရည်ရွယ်ချက်အတွက် [`os.availableParallelism()`](#osavailableparallelism) ကို သုံးပါ။

## `os.devNull`

* Type: {string}

Null device ရဲ့ platform အလိုက် သီးသန့် file path ပါ။

* `\\.\nul` (Windows တွင်)
* `/dev/null` (POSIX တွင်)

## `os.endianness()`

* Returns: {string}

Node.js binary ကို compile လုပ်ထားတဲ့ CPU ရဲ့ endianness ကို ဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ big endian အတွက် `'BE'` နဲ့ little endian အတွက် `'LE'` တို့ပါ။

## `os.freemem()`

* Returns: {integer}

လွတ်နေတဲ့ system memory ပမာဏကို byte အနေနဲ့ integer အဖြစ် ပြန်ပေးပါတယ်။

## `os.getPriority([pid])`

* `pid` {integer} scheduling priority ကို ရယူလိုတဲ့ process ရဲ့ ID ပါ။
  **Default:** `0`။
* Returns: {integer}

`pid` နဲ့ သတ်မှတ်ထားတဲ့ process ရဲ့ scheduling priority ကို ပြန်ပေးပါတယ်။ `pid` မပေးထားဘူး သို့မဟုတ် `0` ဆိုရင် — လက်ရှိ process ရဲ့ priority ကို ပြန်ပေးပါတယ်။

## `os.homedir()`

* Returns: {string}

လက်ရှိ user ရဲ့ home directory ရဲ့ string path ကို ပြန်ပေးပါတယ်။

POSIX မှာ `$HOME` environment variable သတ်မှတ်ထားရင် အဲဒါကို သုံးပါတယ်။ မရှိရင်တော့ user ရဲ့ home directory ကို ရှာဖွေဖို့ [effective UID][EUID] ကို သုံးပါတယ်။

Windows မှာ `USERPROFILE` environment variable သတ်မှတ်ထားရင် အဲဒါကို သုံးပြီး — မရှိရင်တော့ လက်ရှိ user ရဲ့ profile directory ရဲ့ path ကို သုံးပါတယ်။

## `os.hostname()`

* Returns: {string}

Operating system ရဲ့ host name ကို string အဖြစ် ပြန်ပေးပါတယ်။

## `os.loadavg()`

* Returns: {number\[]}

1, 5, နဲ့ 15 မိနစ် load averages တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

Load average ဆိုတာ operating system က တွက်ချက်ပြီး fractional number (အပိုင်းဂဏန်း) အနေနဲ့ ဖော်ပြတဲ့ system activity ရဲ့ အတိုင်းအတာ တစ်ခုပါ။

Load average က Unix မှာပဲ ရှိတဲ့ concept တစ်ခုပါ။ Windows မှာတော့ ပြန်ပေးတဲ့ တန်ဖိုးက အမြဲတမ်း `[0, 0, 0]` ပါ။

## `os.machine()`

* Returns: {string}

Machine type ကို string အနေနဲ့ ပြန်ပေးပါတယ် — ဥပမာ `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390x`, `i386`, `i686`, `x86_64` စသဖြင့်ပါ။

POSIX systems တွေမှာ machine type ကို [`uname(3)`][] ကို ခေါ်ပြီး ဆုံးဖြတ်ပါတယ်။ Windows မှာတော့ `RtlGetVersion()` ကို သုံးပြီး — မရနိုင်ဘူးဆိုရင် `GetVersionExW()` ကို သုံးပါလိမ့်မယ်။ အသေးစိတ်ကို <https://en.wikipedia.org/wiki/Uname#Examples> မှာ ကြည့်ပါ။

## `os.networkInterfaces()`

* Returns: {Object}

Network address တစ်ခု သတ်မှတ်ပေးထားတဲ့ network interfaces တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ object ပေါ်က key တစ်ခုချင်းစီက network interface တစ်ခုကို ခွဲခြားဖော်ပြပြီး — ဆက်စပ်နေတဲ့ value ကတော့ သတ်မှတ်ပေးထားတဲ့ network address တစ်ခုချင်းစီကို ဖော်ပြတဲ့ object တွေရဲ့ array ပါ။

သတ်မှတ်ပေးထားတဲ့ network address object ပေါ်မှာ ရရှိနိုင်တဲ့ properties တွေကတော့:

* `address` {string} သတ်မှတ်ပေးထားတဲ့ IPv4 သို့မဟုတ် IPv6 address
* `netmask` {string} IPv4 သို့မဟုတ် IPv6 network mask
* `family` {string} `IPv4` (သို့) `IPv6` နှစ်ခုအနက် တစ်ခု
* `mac` {string} network interface ရဲ့ MAC address
* `internal` {boolean} network interface က loopback သို့မဟုတ် အဝေးကနေ ဝင်ရောက်လို့မရတဲ့ အလားတူ interface ဆိုရင် `true` — မဟုတ်ရင် `false`
* `scopeid` {number} numeric IPv6 scope ID (`family` က `IPv6` ဖြစ်တဲ့အခါမှသာ သတ်မှတ်ပါတယ်)
* `cidr` {string} routing prefix ကို CIDR notation နဲ့ ပါဝင်တဲ့ သတ်မှတ်ပေးထားတဲ့ IPv4 သို့မဟုတ် IPv6 address။ `netmask` က မမှန်ကန်ဘူးဆိုရင် ဒီ property ကို `null` အဖြစ် သတ်မှတ်ပါတယ်။

```json
{
  "lo": [
    {
      "address": "127.0.0.1",
      "netmask": "255.0.0.0",
      "family": "IPv4",
      "mac": "00:00:00:00:00:00",
      "internal": true,
      "cidr": "127.0.0.1/8"
    },
    {
      "address": "::1",
      "netmask": "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
      "family": "IPv6",
      "mac": "00:00:00:00:00:00",
      "scopeid": 0,
      "internal": true,
      "cidr": "::1/128"
    }
  ],
  "eth0": [
    {
      "address": "192.168.1.108",
      "netmask": "255.255.255.0",
      "family": "IPv4",
      "mac": "01:02:03:0a:0b:0c",
      "internal": false,
      "cidr": "192.168.1.108/24"
    },
    {
      "address": "fe80::a00:27ff:fe4e:66a1",
      "netmask": "ffff:ffff:ffff:ffff::",
      "family": "IPv6",
      "mac": "01:02:03:0a:0b:0c",
      "scopeid": 1,
      "internal": false,
      "cidr": "fe80::a00:27ff:fe4e:66a1/64"
    }
  ]
}
```

## `os.platform()`

* Returns: {string}

Node.js binary ကို compile လုပ်ထားတဲ့ operating system platform ကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီတန်ဖိုးကို compile လုပ်ချိန်မှာ သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့ `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'`, နဲ့ `'win32'` တို့ပါ။

ပြန်ပေးတဲ့ တန်ဖိုးက [`process.platform`][] နဲ့ ညီမျှပါတယ်။

Node.js ကို Android operating system ပေါ်မှာ build လုပ်ထားရင် `'android'` ဆိုတဲ့ တန်ဖိုးလည်း ပြန်ပေးနိုင်ပါတယ်။ [Android support is experimental][Android building]

## `os.release()`

* Returns: {string}

Operating system ရဲ့ release ကို string အဖြစ် ပြန်ပေးပါတယ်။

POSIX systems တွေမှာ operating system release ကို [`uname(3)`][] ကို ခေါ်ပြီး ဆုံးဖြတ်ပါတယ်။ Windows မှာတော့ `GetVersionExW()` ကို သုံးပါတယ်။ အသေးစိတ်ကို <https://en.wikipedia.org/wiki/Uname#Examples> မှာ ကြည့်ပါ။

## `os.setPriority([pid, ]priority)`

* `pid` {integer} scheduling priority ကို သတ်မှတ်ပေးမယ့် process ရဲ့ ID ပါ။
  **Default:** `0`။
* `priority` {integer} process ကို သတ်မှတ်ပေးမယ့် scheduling priority ပါ။

`pid` နဲ့ သတ်မှတ်ထားတဲ့ process အတွက် scheduling priority ကို သတ်မှတ်ဖို့ ကြိုးစားပါတယ်။ `pid` မပေးထားဘူး သို့မဟုတ် `0` ဆိုရင် လက်ရှိ process ရဲ့ process ID ကို သုံးပါတယ်။

`priority` input က `-20` (မြင့်မားတဲ့ priority) နဲ့ `19` (နိမ့်တဲ့ priority) ကြားက integer တစ်ခု ဖြစ်ရပါမယ်။ Unix ရဲ့ priority levels တွေနဲ့ Windows ရဲ့ priority classes တွေ ကွဲပြားတာမို့ — `priority` ကို `os.constants.priority` ထဲက priority constants ခြောက်ခုထဲက တစ်ခုဆီကို map လုပ်ပါတယ်။ Process တစ်ခုရဲ့ priority level ကို ပြန်ယူတဲ့အခါ ဒီ range mapping ကြောင့် Windows မှာ ပြန်ပေးတဲ့ တန်ဖိုး နည်းနည်း ကွဲပြားသွားနိုင်ပါတယ်။ ရှုပ်ထွေးမှု မဖြစ်စေဖို့ `priority` ကို priority constants တွေထဲက တစ်ခုအနေနဲ့ပဲ သတ်မှတ်ပါ။

Windows မှာ priority ကို `PRIORITY_HIGHEST` အဖြစ် သတ်မှတ်ဖို့ elevated user privileges (မြင့်မားသော user အခွင့်အရေးများ) လိုအပ်ပါတယ်။ မဟုတ်ရင် သတ်မှတ်လိုက်တဲ့ priority ကို `PRIORITY_HIGH` ဆီကို တိတ်တဆိတ် လျှော့ချလိုက်ပါလိမ့်မယ်။

## `os.tmpdir()`

* Returns: {string}

Operating system ရဲ့ temporary files (ယာယီဖိုင်များ) အတွက် default directory ကို string အဖြစ် ပြန်ပေးပါတယ်။

Windows မှာ ရလဒ်ကို `TEMP` နဲ့ `TMP` environment variables တွေနဲ့ override လုပ်နိုင်ပြီး — `TEMP` က `TMP` ထက် ဦးစားပေးပါတယ်။ နှစ်ခုလုံး မသတ်မှတ်ထားရင် `%SystemRoot%\temp` သို့မဟုတ် `%windir%\temp` ကို default အနေနဲ့ သုံးပါတယ်။

Windows မဟုတ်တဲ့ platform တွေမှာ ဒီ method ရဲ့ ရလဒ်ကို override လုပ်ဖို့ `TMPDIR`, `TMP` နဲ့ `TEMP` environment variables တွေကို ဖော်ပြထားတဲ့ အစီအစဉ်အတိုင်း စစ်ဆေးပါတယ်။ တစ်ခုမှ မသတ်မှတ်ထားရင် `/tmp` ကို default အနေနဲ့ သုံးပါတယ်။

Operating system distribution အချို့က system administrator တွေရဲ့ ထပ်ဆောင်း configuration တွေ မလိုပဲ — `TMPDIR` (Windows မဟုတ်တဲ့ platform) သို့မဟုတ် `TEMP` နဲ့ `TMP` (Windows) တွေကို default အနေနဲ့ သတ်မှတ်ပေးထားတတ်ပါတယ်။ User တွေက ရှင်းရှင်းလင်းလင်း override မလုပ်ထားသရွေ့ `os.tmpdir()` ရဲ့ ရလဒ်က ပုံမှန်အားဖြင့် system ရဲ့ ဦးစားပေး ရွေးချယ်မှုကိုပဲ ထင်ဟပ်နေပါတယ်။

## `os.totalmem()`

* Returns: {integer}

System memory စုစုပေါင်း ပမာဏကို byte အနေနဲ့ integer အဖြစ် ပြန်ပေးပါတယ်။

## `os.type()`

* Returns: {string}

[`uname(3)`][] က ပြန်ပေးသလို operating system ရဲ့ နာမည်ကို ပြန်ပေးပါတယ်။ ဥပမာ — Linux မှာ `'Linux'`၊ macOS မှာ `'Darwin'`၊ Windows မှာ `'Windows_NT'` လို့ ပြန်ပေးပါတယ်။

Operating system အမျိုးမျိုးပေါ်မှာ [`uname(3)`][] run လုပ်တဲ့အခါ ထွက်လာတဲ့ output အကြောင်း ထပ်ဆောင်း အချက်အလက်တွေအတွက် <https://en.wikipedia.org/wiki/Uname#Examples> ကို ကြည့်ပါ။

## `os.uptime()`

* Returns: {integer}

System ရဲ့ uptime (စက်ဖွင့်ထားချိန်) ကို စက္ကန့် အရေအတွက် အနေနဲ့ ပြန်ပေးပါတယ်။

## `os.userInfo([options])`

* `options` {Object}
  * `encoding` {string} ရလာတဲ့ strings တွေကို အနက်ဖွင့်ဖို့ သုံးတဲ့ character encoding ပါ။ `encoding` ကို `'buffer'` လို့ သတ်မှတ်ထားရင် `username`, `shell`, နဲ့ `homedir` တန်ဖိုးတွေက `Buffer` instances တွေ ဖြစ်ပါလိမ့်မယ်။ **Default:** `'utf8'`။
* Returns: {Object}

လက်ရှိ effective user (သက်ရောက်မှုရှိနေတဲ့ user) အကြောင်း အချက်အလက်တွေကို ပြန်ပေးပါတယ်။ POSIX platforms တွေမှာ ဒါက ပုံမှန်အားဖြင့် password file ရဲ့ အစိတ်အပိုင်း တစ်ခုပါ။ ပြန်ပေးတဲ့ object ထဲမှာ `username`, `uid`, `gid`, `shell`, နဲ့ `homedir` တို့ ပါဝင်ပါတယ်။ Windows မှာတော့ `uid` နဲ့ `gid` fields တွေက `-1` ဖြစ်ပြီး `shell` က `null` ပါ။

`os.userInfo()` က ပြန်ပေးတဲ့ `homedir` တန်ဖိုးကို operating system က ပံ့ပိုးပေးတာပါ။ ဒါက home directory အတွက် environment variables တွေကို အရင်စစ်ပြီးမှ operating system ရဲ့ အဖြေဆီကို ပြန်ကျတဲ့ `os.homedir()` ရဲ့ ရလဒ်နဲ့ ကွဲပြားပါတယ်။

User တစ်ယောက်မှာ `username` သို့မဟုတ် `homedir` မရှိဘူးဆိုရင် [`SystemError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `os.version()`

* Returns: {string}

Kernel version ကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

POSIX systems တွေမှာ operating system release ကို [`uname(3)`][] ကို ခေါ်ပြီး ဆုံးဖြတ်ပါတယ်။ Windows မှာတော့ `RtlGetVersion()` ကို သုံးပြီး — မရနိုင်ဘူးဆိုရင် `GetVersionExW()` ကို သုံးပါလိမ့်မယ်။ အသေးစိတ်ကို <https://en.wikipedia.org/wiki/Uname#Examples> မှာ ကြည့်ပါ။

## OS constants (OS ကိန်းသေများ)

အောက်ပါ constants တွေကို `os.constants` ကနေ export လုပ်ပါတယ်။

Constants တိုင်း operating system တိုင်းမှာ ရနိုင်မှာ မဟုတ်ပါဘူး။

### Signal constants (signal ကိန်းသေများ)

အောက်ပါ signal constants တွေကို `os.constants.signals` ကနေ export လုပ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `SIGHUP` | Controlling terminal တစ်ခု ပိတ်သွားတဲ့အခါ သို့မဟုတ် parent process တစ်ခု ထွက်သွားတဲ့အခါ အသိပေးဖို့ ပို့ပေးပါတယ်။ |
| `SIGINT` | User က process တစ်ခုကို ကြားဖြတ်ချင်တဲ့အခါ အသိပေးဖို့ ပို့ပေးပါတယ် (`Ctrl`+`C`)။ |
| `SIGQUIT` | User က process တစ်ခုကို terminate လုပ်ပြီး core dump လုပ်ချင်တဲ့အခါ အသိပေးဖို့ ပို့ပေးပါတယ်။ |
| `SIGILL` | Illegal, malformed, unknown (သို့) privileged instruction တစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားခဲ့တယ်ဆိုတာ အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGTRAP` | Exception တစ်ခု ဖြစ်ပွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGABRT` | Process တစ်ခုကို abort လုပ်ဖို့ တောင်းဆိုဖို့ ပို့ပေးပါတယ်။ |
| `SIGIOT` | `SIGABRT` ရဲ့ synonym (အဓိပ္ပာယ်တူ) ပါ။ |
| `SIGBUS` | Bus error တစ်ခု ဖြစ်ပွားစေခဲ့တယ်ဆိုတာ အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGFPE` | တရားမဝင်တဲ့ arithmetic operation တစ်ခုကို လုပ်ဆောင်ခဲ့တယ်ဆိုတာ အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGKILL` | Process တစ်ခုကို ချက်ချင်း terminate လုပ်ဖို့ ပို့ပေးပါတယ်။ |
| `SIGUSR1` `SIGUSR2` | User က သတ်မှတ်ထားတဲ့ အခြေအနေတွေကို ခွဲခြားသိစေဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGSEGV` | Segmentation fault ဖြစ်တယ်ဆိုတာ အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGPIPE` | ပြတ်တောက်နေတဲ့ pipe တစ်ခုဆီကို ရေးဖို့ ကြိုးစားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGALRM` | System timer တစ်ခု ကုန်ဆုံးသွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGTERM` | Terminate လုပ်ဖို့ တောင်းဆိုဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGCHLD` | Child process တစ်ခု terminate သွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGSTKFLT` | Coprocessor တစ်ခုပေါ်မှာ stack fault ဖြစ်တယ်ဆိုတာ ဖော်ပြဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGCONT` | ရပ်နေတဲ့ process တစ်ခုကို ဆက်လုပ်ဖို့ operating system ကို ညွှန်ကြားဖို့ ပို့ပေးပါတယ်။ |
| `SIGSTOP` | Process တစ်ခုကို ရပ်တန့်စေဖို့ operating system ကို ညွှန်ကြားဖို့ ပို့ပေးပါတယ်။ |
| `SIGTSTP` | ရပ်တန့်ဖို့ တောင်းဆိုဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGBREAK` | User က process တစ်ခုကို ကြားဖြတ်ချင်တဲ့အခါ အသိပေးဖို့ ပို့ပေးပါတယ်။ |
| `SIGTTIN` | Background မှာ ရှိနေတုန်း TTY ကနေ ဖတ်တဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGTTOU` | Background မှာ ရှိနေတုန်း TTY ဆီကို ရေးတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGURG` | Socket တစ်ခုမှာ ဖတ်ဖို့ urgent data ရှိနေတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGXCPU` | CPU အသုံးပြုမှု ကန့်သတ်ချက် ကျော်လွန်သွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGXFSZ` | File တစ်ခု ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားထက် ကြီးလာတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGVTALRM` | Virtual timer တစ်ခု ကုန်ဆုံးသွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGPROF` | System timer တစ်ခု ကုန်ဆုံးသွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGWINCH` | Controlling terminal ရဲ့ အရွယ်အစား ပြောင်းသွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGIO` | I/O ရရှိနိုင်တဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGPOLL` | `SIGIO` ရဲ့ synonym ပါ။ |
| `SIGLOST` | File lock တစ်ခု ဆုံးရှုံးသွားတဲ့အခါ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGPWR` | Power failure (လျှပ်စစ်ပြတ်တောက်မှု) အကြောင်း အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGINFO` | `SIGPWR` ရဲ့ synonym ပါ။ |
| `SIGSYS` | Argument မမှန်ကန်ဘူးဆိုတာ အသိပေးဖို့ process တစ်ခုဆီကို ပို့ပေးပါတယ်။ |
| `SIGUNUSED` | `SIGSYS` ရဲ့ synonym ပါ။ |

### Error constants (error ကိန်းသေများ)

အောက်ပါ error constants တွေကို `os.constants.errno` ကနေ export လုပ်ပါတယ်။

#### POSIX error constants (POSIX error ကိန်းသေများ)

| Constant | Description |
| --- | --- |
| `E2BIG` | Argument တွေရဲ့ စာရင်းက မျှော်လင့်ထားတာထက် ပိုရှည်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `EACCES` | လုပ်ဆောင်မှုမှာ လုံလောက်တဲ့ permissions မရှိခဲ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `EADDRINUSE` | Network address ကို အသုံးပြုနေပြီးဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EADDRNOTAVAIL` | Network address က လက်ရှိ အသုံးပြုဖို့ မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EAFNOSUPPORT` | Network address family ကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EAGAIN` | ဒေတာ မရနိုင်သေးဘဲ လုပ်ဆောင်မှုကို နောက်မှ ထပ်ကြိုးစားရန် လိုကြောင်း ညွှန်ပြပါတယ်။ |
| `EALREADY` | Socket မှာ ဆက်လုပ်ဆောင်နေတဲ့ pending connection တစ်ခု ရှိနှင့်ပြီးဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EBADF` | File descriptor တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EBADMSG` | Data message တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EBUSY` | Device သို့မဟုတ် resource တစ်ခု အလုပ်ရှုပ်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `ECANCELED` | လုပ်ဆောင်မှုတစ်ခုကို ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ECHILD` | Child processes မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ECONNABORTED` | Network connection ကို ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ECONNREFUSED` | Network connection ကို ငြင်းပယ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ECONNRESET` | Network connection ကို ပြန်စ (reset) လုပ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EDEADLK` | Resource deadlock တစ်ခုကို ရှောင်ရှားနိုင်ခဲ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `EDESTADDRREQ` | Destination address တစ်ခု လိုအပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EDOM` | Argument တစ်ခုက function ရဲ့ domain အပြင်ဘက် ရောက်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `EDQUOT` | Disk quota ကို ကျော်လွန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `EEXIST` | File က ရှိပြီးသားဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EFAULT` | Pointer address တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EFBIG` | File က ကြီးလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EHOSTUNREACH` | Host ဆီကို မရောက်ရှိနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EIDRM` | Identifier ကို ဖယ်ရှားလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EILSEQ` | Byte sequence တစ်ခု တရားမဝင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EINPROGRESS` | လုပ်ဆောင်မှုတစ်ခု လုပ်ဆောင်နေပြီးဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EINTR` | Function call တစ်ခုကို ကြားဖြတ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EINVAL` | Argument တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EIO` | အခြားနည်းဖြင့် သတ်မှတ်မထားတဲ့ I/O error တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `EISCONN` | Socket က ချိတ်ဆက်ပြီးသား ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EISDIR` | Path က directory တစ်ခု ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ELOOP` | Path တစ်ခုထဲမှာ symbolic links အဆင့် များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EMFILE` | ဖွင့်ထားတဲ့ files တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EMLINK` | File တစ်ခုဆီကို hard links တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EMSGSIZE` | ပေးလိုက်တဲ့ message က ရှည်လွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EMULTIHOP` | Multihop တစ်ခုကို ကြိုးစားခဲ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENAMETOOLONG` | Filename က ရှည်လွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `ENETDOWN` | Network က ကျဆင်းနေကြောင်း ညွှန်ပြပါတယ်။ |
| `ENETRESET` | Connection ကို network က ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENETUNREACH` | Network ဆီကို မရောက်ရှိနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENFILE` | System ထဲမှာ ဖွင့်ထားတဲ့ files တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOBUFS` | Buffer space မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENODATA` | Stream head ရဲ့ read queue ထဲမှာ message မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENODEV` | ဒီလို device မျိုး မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOENT` | ဒီလို file သို့မဟုတ် directory မျိုး မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOEXEC` | Exec format error တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `ENOLCK` | ရနိုင်တဲ့ locks တွေ မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOLINK` | Link တစ်ခု ပြတ်တောက်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOMEM` | နေရာ လုံလောက်စွာ မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOMSG` | လိုချင်တဲ့ အမျိုးအစားနဲ့ ကိုက်ညီတဲ့ message မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOPROTOOPT` | ပေးထားတဲ့ protocol တစ်ခု မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOSPC` | Device ပေါ်မှာ နေရာလွတ် မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOSR` | Stream resources တွေ မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOSTR` | ပေးထားတဲ့ resource က stream တစ်ခု မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOSYS` | Function တစ်ခုကို အကောင်အထည် မဖော်ရသေးကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTCONN` | Socket က ချိတ်ဆက်မထားကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTDIR` | Path က directory တစ်ခု မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTEMPTY` | Directory က ဗလာ မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTSOCK` | ပေးထားတဲ့ item က socket တစ်ခု မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTSUP` | ပေးထားတဲ့ လုပ်ဆောင်မှုတစ်ခုကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ENOTTY` | မသင့်လျော်တဲ့ I/O control operation တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `ENXIO` | ဒီလို device သို့မဟုတ် address မျိုး မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `EOPNOTSUPP` | Socket ပေါ်မှာ လုပ်ဆောင်မှုတစ်ခုကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ Linux မှာ `ENOTSUP` နဲ့ `EOPNOTSUPP` တန်ဖိုး တူညီပေမယ့် — POSIX.1 အရတော့ ဒီ error values တွေက ကွဲပြားသင့်ပါတယ်။ |
| `EOVERFLOW` | တန်ဖိုးတစ်ခုက ပေးထားတဲ့ data type ထဲမှာ သိမ်းဖို့ ကြီးလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EPERM` | လုပ်ဆောင်မှုကို ခွင့်မပြုကြောင်း ညွှန်ပြပါတယ်။ |
| `EPIPE` | ပြတ်တောက်နေတဲ့ pipe တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `EPROTO` | Protocol error တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `EPROTONOSUPPORT` | Protocol တစ်ခုကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `EPROTOTYPE` | Socket အတွက် protocol အမျိုးအစား မှားနေကြောင်း ညွှန်ပြပါတယ်။ |
| `ERANGE` | ရလဒ်တွေ ကြီးလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `EROFS` | File system က read-only ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `ESPIPE` | Invalid seek operation တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `ESRCH` | ဒီလို process မျိုး မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `ESTALE` | File handle က ခေတ်မမီတော့ကြောင်း ညွှန်ပြပါတယ်။ |
| `ETIME` | Timer တစ်ခု သက်တမ်းကုန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `ETIMEDOUT` | Connection က အချိန်ကုန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `ETXTBSY` | Text file တစ်ခု အလုပ်ရှုပ်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `EWOULDBLOCK` | လုပ်ဆောင်မှုက block ဖြစ်နေမယ်ဆိုတာ ညွှန်ပြပါတယ်။ |
| `EXDEV` | Link တစ်ခု မသင့်လျော်ကြောင်း ညွှန်ပြပါတယ်။ |

#### Windows-specific error constants (Windows အတွက် သီးသန့် error ကိန်းသေများ)

အောက်ပါ error codes တွေက Windows operating system အတွက် သီးသန့် ဖြစ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `WSAEINTR` | ကြားဖြတ်ခံထားရတဲ့ function call တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `WSAEBADF` | File handle တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEACCES` | လုပ်ဆောင်မှု ပြီးမြောက်ဖို့ permissions မလုံလောက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEFAULT` | Pointer address တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEINVAL` | Argument တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEMFILE` | ဖွင့်ထားတဲ့ files တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEWOULDBLOCK` | Resource တစ်ခု ခဏတာ မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEINPROGRESS` | လုပ်ဆောင်မှုတစ်ခု လက်ရှိ လုပ်ဆောင်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEALREADY` | လုပ်ဆောင်မှုတစ်ခု လုပ်ဆောင်နေပြီးဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOTSOCK` | Resource က socket တစ်ခု မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEDESTADDRREQ` | Destination address တစ်ခု လိုအပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEMSGSIZE` | Message ရဲ့ အရွယ်အစား ကြီးလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEPROTOTYPE` | Socket အတွက် protocol အမျိုးအစား မှားနေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOPROTOOPT` | Protocol option တစ်ခု မကောင်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEPROTONOSUPPORT` | Protocol ကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAESOCKTNOSUPPORT` | Socket type ကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEOPNOTSUPP` | လုပ်ဆောင်မှုကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEPFNOSUPPORT` | Protocol family ကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEAFNOSUPPORT` | Address family ကို support မလုပ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEADDRINUSE` | Network address ကို အသုံးပြုနေပြီးဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEADDRNOTAVAIL` | Network address က မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENETDOWN` | Network က ကျဆင်းနေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENETUNREACH` | Network ဆီကို မရောက်ရှိနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENETRESET` | Network connection ကို ပြန်စ (reset) လုပ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAECONNABORTED` | Connection ကို ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAECONNRESET` | Connection ကို peer ဘက်က ပြန်စ (reset) လုပ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOBUFS` | Buffer space မရနိုင်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEISCONN` | Socket က ချိတ်ဆက်ပြီးသား ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOTCONN` | Socket က ချိတ်ဆက်မထားကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAESHUTDOWN` | Socket ကို shutdown လုပ်ပြီးနောက် data ပို့လို့ မရတော့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAETOOMANYREFS` | References တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAETIMEDOUT` | Connection က အချိန်ကုန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAECONNREFUSED` | Connection ကို ငြင်းပယ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAELOOP` | Name တစ်ခုကို ဘာသာပြန်ဆိုလို့ မရကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENAMETOOLONG` | Name တစ်ခု ရှည်လွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEHOSTDOWN` | Network host တစ်ခု ကျဆင်းနေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEHOSTUNREACH` | Network host တစ်ခုဆီကို လမ်းကြောင်း (route) မရှိကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOTEMPTY` | Directory က ဗလာ မဟုတ်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEPROCLIM` | Processes တွေ များလွန်းကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEUSERS` | User quota ကို ကျော်လွန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEDQUOT` | Disk quota ကို ကျော်လွန်သွားကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAESTALE` | File handle reference တစ်ခု ခေတ်မမီတော့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEREMOTE` | Item က အဝေးမှာ ရှိနေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSASYSNOTREADY` | Network subsystem က အဆင်သင့် မဖြစ်သေးကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAVERNOTSUPPORTED` | `winsock.dll` ရဲ့ version က ခွင့်ပြုထားတဲ့ အကွာအဝေး အပြင်ဘက် ရောက်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSANOTINITIALISED` | အောင်မြင်တဲ့ WSAStartup ကို မလုပ်ဆောင်ရသေးကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEDISCON` | Graceful shutdown တစ်ခု လုပ်ဆောင်နေကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAENOMORE` | နောက်ထပ် ရလဒ်တွေ မရှိတော့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAECANCELLED` | လုပ်ဆောင်မှုတစ်ခုကို ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEINVALIDPROCTABLE` | Procedure call table က မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEINVALIDPROVIDER` | Service provider တစ်ခု မမှန်ကန်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEPROVIDERFAILEDINIT` | Service provider က initialize လုပ်ဖို့ မအောင်မြင်ခဲ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSASYSCALLFAILURE` | System call failure တစ်ခုကို ညွှန်ပြပါတယ်။ |
| `WSASERVICE_NOT_FOUND` | Service တစ်ခုကို ရှာမတွေ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSATYPE_NOT_FOUND` | Class type တစ်ခုကို ရှာမတွေ့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSA_E_NO_MORE` | နောက်ထပ် ရလဒ်တွေ မရှိတော့ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSA_E_CANCELLED` | Call ကို ဖျက်သိမ်းလိုက်ကြောင်း ညွှန်ပြပါတယ်။ |
| `WSAEREFUSED` | Database query တစ်ခုကို ငြင်းပယ်လိုက်ကြောင်း ညွှန်ပြပါတယ်။ |

### dlopen constants (dlopen ကိန်းသေများ)

Operating system ပေါ်မှာ ရနိုင်မယ်ဆိုရင် အောက်ပါ constants တွေကို `os.constants.dlopen` ထဲမှာ export လုပ်ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် dlopen(3) ကို ကြည့်ပါ။

| Constant | Description |
| --- | --- |
| `RTLD_LAZY` | Lazy binding ကို လုပ်ဆောင်ပါတယ်။ Node.js က ဒီ flag ကို default အနေနဲ့ သတ်မှတ်ပါတယ်။ |
| `RTLD_NOW` | dlopen(3) ပြန်မလာခင် library ထဲက undefined symbols တွေ အားလုံးကို resolve လုပ်ပါတယ်။ |
| `RTLD_GLOBAL` | Library က define လုပ်ထားတဲ့ symbols တွေကို နောက်ပိုင်း load လုပ်တဲ့ libraries တွေရဲ့ symbol resolution အတွက် ရနိုင်အောင် လုပ်ပေးပါတယ်။ |
| `RTLD_LOCAL` | `RTLD_GLOBAL` ရဲ့ ဆန့်ကျင်ဘက်ပါ။ Flag နှစ်ခုလုံး မသတ်မှတ်ထားရင် ဒါက default အပြုအမူ ဖြစ်ပါတယ်။ |
| `RTLD_DEEPBIND` | ကိုယ်ပိုင် ပြည့်စုံတဲ့ library တစ်ခုက အရင်က load လုပ်ထားတဲ့ libraries တွေရဲ့ symbols တွေထက် ကိုယ်ပိုင် symbols တွေကို ဦးစားပေး သုံးစေပါတယ်။ |

### Priority constants (priority ကိန်းသေများ)

အောက်ပါ process scheduling constants တွေကို `os.constants.priority` ကနေ export လုပ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `PRIORITY_LOW` | အနိမ့်ဆုံး process scheduling priority ပါ။ Windows မှာ `IDLE_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `19` နဲ့ ညီမျှပါတယ်။ |
| `PRIORITY_BELOW_NORMAL` | `PRIORITY_LOW` ထက် မြင့်ပြီး `PRIORITY_NORMAL` အောက်မှာ ရှိတဲ့ process scheduling priority ပါ။ Windows မှာ `BELOW_NORMAL_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `10` နဲ့ ညီမျှပါတယ်။ |
| `PRIORITY_NORMAL` | Default process scheduling priority ပါ။ Windows မှာ `NORMAL_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `0` နဲ့ ညီမျှပါတယ်။ |
| `PRIORITY_ABOVE_NORMAL` | `PRIORITY_NORMAL` ထက် မြင့်ပြီး `PRIORITY_HIGH` အောက်မှာ ရှိတဲ့ process scheduling priority ပါ။ Windows မှာ `ABOVE_NORMAL_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `-7` နဲ့ ညီမျှပါတယ်။ |
| `PRIORITY_HIGH` | `PRIORITY_ABOVE_NORMAL` ထက် မြင့်ပြီး `PRIORITY_HIGHEST` အောက်မှာ ရှိတဲ့ process scheduling priority ပါ။ Windows မှာ `HIGH_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `-14` နဲ့ ညီမျှပါတယ်။ |
| `PRIORITY_HIGHEST` | အမြင့်ဆုံး process scheduling priority ပါ။ Windows မှာ `REALTIME_PRIORITY_CLASS` နဲ့ ညီမျှပြီး — တခြား platform အားလုံးမှာ nice value `-20` နဲ့ ညီမျှပါတယ်။ |

### libuv constants (libuv ကိန်းသေများ)

| Constant | Description |
| --- | --- |
| `UV_UDP_REUSEADDR` |  |

[Android building]: https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android
[EUID]: https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID
[`SystemError`]: errors.md#class-systemerror
[`process.arch`]: process.md#processarch
[`process.platform`]: process.md#processplatform
[`uname(3)`]: https://linux.die.net/man/3/uname
[`uv_available_parallelism()`]: https://docs.libuv.org/en/v1.x/misc.html#c.uv_available_parallelism
