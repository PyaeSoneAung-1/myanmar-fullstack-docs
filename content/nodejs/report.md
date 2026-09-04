---
title: "Diagnostic report"
description: "node:report — JavaScript နဲ့ native stack traces, heap statistics, platform အချက်အလက်များ ပါဝင်သော JSON-format diagnostic report များကို file အဖြစ် ရေးထုတ်ပေးခြင်း"
order: 117
source: "https://nodejs.org/api/report.html"
status: translated
updated: 2026-09-04
---
> Stability: 2 - Stable

JSON format နဲ့ ရေးဆွဲထားတဲ့ diagnostic summary (ရောဂါရှာဖွေရေး အကျဉ်းချုပ်) တစ်ခုကို file တစ်ခုဆီ ရေးထုတ်ပေးပါတယ်။

Report က development, test, နဲ့ production use တွေအတွက် ရည်ရွယ်ပြီး — ပြဿနာ ဆုံးဖြတ်သိရှိခြင်း (problem determination) အတွက် အချက်အလက်တွေကို ဖမ်းယူ ထိန်းသိမ်းပေးပါတယ်။ အဲဒီထဲမှာ JavaScript နဲ့ native stack traces တွေ၊ heap statistics (heap ကိန်းဂဏန်း အချက်အလက်များ)၊ platform အချက်အလက်တွေ၊ resource usage (resource သုံးစွဲမှု) စတာတွေ ပါဝင်ပါတယ်။ Report option ကို enable လုပ်ထားရင် — diagnostic reports တွေကို unhandled exceptions, fatal errors, user signals တွေပေါ်မှာ trigger လုပ်နိုင်သလို — API calls တွေကနေတစ်ဆင့် programmatically လည်း trigger လုပ်နိုင်ပါတယ်။

Uncaught exception တစ်ခုပေါ်မှာ generate လုပ်ထားတဲ့ ပြည့်စုံတဲ့ report ဥပမာ တစ်ခုကို ရည်ညွှန်းချက် အနေနဲ့ အောက်မှာ ဖော်ပြထားပါတယ်။

```json
{
  "header": {
    "reportVersion": 5,
    "event": "exception",
    "trigger": "Exception",
    "filename": "report.20181221.005011.8974.0.001.json",
    "dumpEventTime": "2018-12-21T00:50:11Z",
    "dumpEventTimeStamp": "1545371411331",
    "processId": 8974,
    "cwd": "/home/nodeuser/project/node",
    "commandLine": [
      "/home/nodeuser/project/node/out/Release/node",
      "--report-uncaught-exception",
      "/home/nodeuser/project/node/test/report/test-exception.js",
      "child"
    ],
    "nodejsVersion": "v12.0.0-pre",
    "glibcVersionRuntime": "2.17",
    "glibcVersionCompiler": "2.17",
    "wordSize": "64 bit",
    "arch": "x64",
    "platform": "linux",
    "componentVersions": {
      "node": "12.0.0-pre",
      "v8": "7.1.302.28-node.5",
      "uv": "1.24.1",
      "zlib": "1.2.11",
      "ares": "1.15.0",
      "modules": "68",
      "nghttp2": "1.34.0",
      "napi": "3",
      "llhttp": "1.0.1",
      "openssl": "1.1.0j"
    },
    "release": {
      "name": "node"
    },
    "osName": "Linux",
    "osRelease": "3.10.0-862.el7.x86_64",
    "osVersion": "#1 SMP Wed Mar 21 18:14:51 EDT 2018",
    "osMachine": "x86_64",
    "cpus": [
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      },
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      }
    ],
    "networkInterfaces": [
      {
        "name": "en0",
        "internal": false,
        "mac": "13:10:de:ad:be:ef",
        "address": "10.0.0.37",
        "netmask": "255.255.255.0",
        "family": "IPv4"
      }
    ],
    "host": "test_machine"
  },
  "javascriptStack": {
    "message": "Error: *** test-exception.js: throwing uncaught Error",
    "stack": [
      "at myException (/home/nodeuser/project/node/test/report/test-exception.js:9:11)",
      "at Object.<anonymous> (/home/nodeuser/project/node/test/report/test-exception.js:12:3)",
      "at Module._compile (internal/modules/cjs/loader.js:718:30)",
      "at Object.Module._extensions..js (internal/modules/cjs/loader.js:729:10)",
      "at Module.load (internal/modules/cjs/loader.js:617:32)",
      "at tryModuleLoad (internal/modules/cjs/loader.js:560:12)",
      "at Function.Module._load (internal/modules/cjs/loader.js:552:3)",
      "at Function.Module.runMain (internal/modules/cjs/loader.js:771:12)",
      "at executeUserCode (internal/bootstrap/node.js:332:15)"
    ]
  },
  "nativeStack": [
    {
      "pc": "0x000055b57f07a9ef",
      "symbol": "report::GetNodeReport(v8::Isolate*, node::Environment*, char const*, char const*, v8::Local<v8::String>, std::ostream&) [./node]"
    },
    {
      "pc": "0x000055b57f07cf03",
      "symbol": "report::GetReport(v8::FunctionCallbackInfo<v8::Value> const&) [./node]"
    },
    {
      "pc": "0x000055b57f1bccfd",
      "symbol": " [./node]"
    },
    {
      "pc": "0x000055b57f1be048",
      "symbol": "v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) [./node]"
    },
    {
      "pc": "0x000055b57feeda0e",
      "symbol": " [./node]"
    }
  ],
  "javascriptHeap": {
    "totalMemory": 5660672,
    "executableMemory": 524288,
    "totalCommittedMemory": 5488640,
    "availableMemory": 4341379928,
    "totalGlobalHandlesMemory": 8192,
    "usedGlobalHandlesMemory": 3136,
    "usedMemory": 4816432,
    "memoryLimit": 4345298944,
    "mallocedMemory": 254128,
    "externalMemory": 315644,
    "peakMallocedMemory": 98752,
    "nativeContextCount": 1,
    "detachedContextCount": 0,
    "doesZapGarbage": 0,
    "heapSpaces": {
      "read_only_space": {
        "memorySize": 524288,
        "committedMemory": 39208,
        "capacity": 515584,
        "used": 30504,
        "available": 485080
      },
      "new_space": {
        "memorySize": 2097152,
        "committedMemory": 2019312,
        "capacity": 1031168,
        "used": 985496,
        "available": 45672
      },
      "old_space": {
        "memorySize": 2273280,
        "committedMemory": 1769008,
        "capacity": 1974640,
        "used": 1725488,
        "available": 249152
      },
      "code_space": {
        "memorySize": 696320,
        "committedMemory": 184896,
        "capacity": 152128,
        "used": 152128,
        "available": 0
      },
      "map_space": {
        "memorySize": 536576,
        "committedMemory": 344928,
        "capacity": 327520,
        "used": 327520,
        "available": 0
      },
      "large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 1520590336,
        "used": 0,
        "available": 1520590336
      },
      "new_large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 0,
        "used": 0,
        "available": 0
      }
    }
  },
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "maxRss": "36624662528",
    "constrained_memory": "36624662528",
    "userCpuSeconds": 0.040072,
    "kernelCpuSeconds": 0.016029,
    "cpuConsumptionPercent": 5.6101,
    "userCpuConsumptionPercent": 4.0072,
    "kernelCpuConsumptionPercent": 1.6029,
    "pageFaults": {
      "IORequired": 0,
      "IONotRequired": 4610
    },
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "uvthreadResourceUsage": {
    "userCpuSeconds": 0.039843,
    "kernelCpuSeconds": 0.015937,
    "cpuConsumptionPercent": 5.578,
    "userCpuConsumptionPercent": 3.9843,
    "kernelCpuConsumptionPercent": 1.5937,
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "libuv": [
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x0000000102910900",
      "details": ""
    },
    {
      "type": "timer",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfeab0",
      "repeat": 0,
      "firesInMsFromNow": 94403548320796,
      "expired": true
    },
    {
      "type": "check",
      "is_active": true,
      "is_referenced": false,
      "address": "0x00007fff5fbfeb48"
    },
    {
      "type": "idle",
      "is_active": false,
      "is_referenced": true,
      "address": "0x00007fff5fbfebc0"
    },
    {
      "type": "prepare",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfec38"
    },
    {
      "type": "check",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfecb0"
    },
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000000010188f2e0"
    },
    {
      "type": "tty",
      "is_active": false,
      "is_referenced": true,
      "address": "0x000055b581db0e18",
      "width": 204,
      "height": 55,
      "fd": 17,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "signal",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000055b581d80010",
      "signum": 28,
      "signal": "SIGWINCH"
    },
    {
      "type": "tty",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055b581df59f8",
      "width": 204,
      "height": 55,
      "fd": 19,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "loop",
      "is_active": true,
      "address": "0x000055fc7b2cb180",
      "loopIdleTimeSeconds": 22644.8
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    }
  ],
  "workers": [],
  "environmentVariables": {
    "REMOTEHOST": "REMOVED",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "REMOVED",
    "PERL5LIB": "/opt/rh/devtoolset-3/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-3/root/usr/lib/perl5:/opt/rh/devtoolset-3/root//usr/share/perl5/vendor_perl",
    "OLDPWD": "/home/nodeuser/project/node/src",
    "JAVACONFDIRS": "/opt/rh/devtoolset-3/root/etc/java:/etc/java",
    "SSH_TTY": "/dev/pts/0",
    "PCP_DIR": "/opt/rh/devtoolset-3/root",
    "GROUP": "normaluser",
    "USER": "nodeuser",
    "LD_LIBRARY_PATH": "/opt/rh/devtoolset-3/root/usr/lib64:/opt/rh/devtoolset-3/root/usr/lib",
    "HOSTTYPE": "x86_64-linux",
    "XDG_CONFIG_DIRS": "/opt/rh/devtoolset-3/root/etc/xdg:/etc/xdg",
    "MAIL": "/var/spool/mail/nodeuser",
    "PATH": "/home/nodeuser/project/node:/opt/rh/devtoolset-3/root/usr/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin",
    "PWD": "/home/nodeuser/project/node",
    "LANG": "en_US.UTF-8",
    "PS1": "\\u@\\h : \\[\\e[31m\\]\\w\\[\\e[m\\] >  ",
    "SHLVL": "2",
    "HOME": "/home/nodeuser",
    "OSTYPE": "linux",
    "VENDOR": "unknown",
    "PYTHONPATH": "/opt/rh/devtoolset-3/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-3/root/usr/lib/python2.7/site-packages",
    "MACHTYPE": "x86_64",
    "LOGNAME": "nodeuser",
    "XDG_DATA_DIRS": "/opt/rh/devtoolset-3/root/usr/share:/usr/local/share:/usr/share",
    "LESSOPEN": "||/usr/bin/lesspipe.sh %s",
    "INFOPATH": "/opt/rh/devtoolset-3/root/usr/share/info",
    "XDG_RUNTIME_DIR": "/run/user/50141",
    "_": "./node"
  },
  "userLimits": {
    "core_file_size_blocks": {
      "soft": "",
      "hard": "unlimited"
    },
    "data_seg_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "file_size_blocks": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_locked_memory_bytes": {
      "soft": "unlimited",
      "hard": 65536
    },
    "max_memory_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "open_files": {
      "soft": "unlimited",
      "hard": 4096
    },
    "stack_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "cpu_time_seconds": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_user_processes": {
      "soft": "unlimited",
      "hard": 4127290
    },
    "virtual_memory_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    }
  },
  "sharedObjects": [
    "/lib64/libdl.so.2",
    "/lib64/librt.so.1",
    "/lib64/libstdc++.so.6",
    "/lib64/libm.so.6",
    "/lib64/libgcc_s.so.1",
    "/lib64/libpthread.so.0",
    "/lib64/libc.so.6",
    "/lib64/ld-linux-x86-64.so.2"
  ]
}
```

## အသုံးပြုပုံ (Usage)

```bash
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```

* `--report-uncaught-exception` — Uncaught exceptions (ဖမ်းယူမရသော exceptions) တွေပေါ်မှာ report ကို generate လုပ်နိုင်အောင် enable လုပ်ပေးပါတယ်။ JavaScript stack ကို native stack နဲ့ တခြား runtime environment data တွေနဲ့ တွဲပြီး စစ်ဆေးကြည့်တဲ့အခါ အသုံးဝင်ပါတယ်။

* `--report-on-signal` — Run နေတဲ့ Node.js process ဆီ သတ်မှတ်ထားတဲ့ (သို့) ကြိုတင် သတ်မှတ်ထားတဲ့ signal တစ်ခု ရောက်ရှိလာတဲ့အခါ report ကို generate လုပ်နိုင်အောင် enable လုပ်ပေးပါတယ်။ (Report ကို trigger လုပ်တဲ့ signal ကို ဘယ်လို ပြောင်းလဲရမလဲဆိုတာ အောက်မှာ ကြည့်ပါ။) Default signal ကတော့ `SIGUSR2` ပါ။ Report တစ်ခုကို တခြား program တစ်ခုကနေ trigger လုပ်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်ပါတယ်။ Application monitors တွေက ဒီ feature ကို သုံးပြီး — report တွေကို ပုံမှန် ကြားကာလတွေမှာ စုဆောင်းကာ အတွင်းပိုင်း runtime data အစုံအလင်ကို သူတို့ရဲ့ views တွေပေါ်မှာ ပုံဖော်နိုင်ပါတယ်။

Windows မှာတော့ signal အခြေပြု report generation ကို support မလုပ်ပါဘူး။

ပုံမှန် အခြေအနေတွေမှာ report ကို trigger လုပ်တဲ့ signal ကို ပြောင်းလဲစရာ မလိုအပ်ပါဘူး။ ဒါပေမယ့် `SIGUSR2` ကို တခြား ရည်ရွယ်ချက်တွေအတွက် သုံးနေပြီးသားဆိုရင် — ဒီ flag က report generation အတွက် signal ကို ပြောင်းလဲပေးနိုင်ပြီး အဲဒီ ရည်ရွယ်ချက်တွေအတွက် `SIGUSR2` ရဲ့ မူလ အဓိပ္ပာယ်ကိုလည်း ထိန်းသိမ်းပေးနိုင်ပါတယ်။

* `--report-on-fatalerror` — Application ကို terminate ဖြစ်စေတဲ့ fatal errors တွေ (Node.js runtime အတွင်းက internal errors တွေ — out of memory (memory ကုန်ခမ်းခြင်း) လိုမျိုး) ပေါ်မှာ report ကို trigger လုပ်နိုင်အောင် enable လုပ်ပေးပါတယ်။ Fatal error အကြောင်း ဆင်ခြင်သုံးသပ်နိုင်ဖို့ — heap, stack, event loop state, resource consumption (resource သုံးစွဲမှု) စတဲ့ diagnostic data အစိတ်အပိုင်း အမျိုးမျိုးကို စစ်ဆေးကြည့်ဖို့ အသုံးဝင်ပါတယ်။

* `--report-compact` — Reports တွေကို single-line JSON ဖြစ်တဲ့ compact format နဲ့ ရေးပေးပါတယ်။ လူဖတ်ဖို့ ရည်ရွယ် ဒီဇိုင်းဆွဲထားတဲ့ default multi-line format ထက် log processing systems တွေအတွက် ပိုပြီး လွယ်ကူစွာ စားသုံးနိုင်ပါတယ်။

* `--report-directory` — Report ကို generate လုပ်မယ့် တည်နေရာ (location) ပါ။

* `--report-filename` — Report ကို ရေးသွင်းမယ့် file ရဲ့ နာမည်ပါ။

* `--report-signal` — Report generation အတွက် signal ကို သတ်မှတ်ခြင်း (သို့) ပြန်လည် သတ်မှတ်ခြင်း ပါ (Windows မှာ support မလုပ်ပါဘူး)။ Default signal ကတော့ `SIGUSR2` ပါ။

* `--report-exclude-network` — Diagnostic report ထဲမှာ `header.networkInterfaces` ကို ဖယ်ထုတ်ပြီး `libuv.*.(remote|local)Endpoint.host` ထဲက reverse DNS queries တွေကို disable လုပ်ပါတယ်။ Default အနေနဲ့ ဒါကို သတ်မှတ်မထားဘဲ — network interfaces တွေကို ထည့်သွင်းထားပါတယ်။

* `--report-exclude-env` — Diagnostic report ထဲက `environmentVariables` ကို ဖယ်ထုတ်ပါတယ်။ Default အနေနဲ့ ဒါကို သတ်မှတ်မထားဘဲ — environment variables တွေကို ထည့်သွင်းထားပါတယ်။

JavaScript application တစ်ခုကနေ API call ကတစ်ဆင့်လည်း report တစ်ခုကို trigger လုပ်နိုင်ပါတယ်:

```js
process.report.writeReport();
```

ဒီ function က optional ထပ်ဆောင်း argument တစ်ခုဖြစ်တဲ့ `filename` ကို လက်ခံပါတယ် — report ကို ရေးသွင်းမယ့် file ရဲ့ နာမည်ပါ။

```js
process.report.writeReport('./foo.json');
```

ဒီ function က optional ထပ်ဆောင်း argument တစ်ခုဖြစ်တဲ့ `err` ကို လက်ခံပါတယ် — report ထဲမှာ ပုံနှိပ်မယ့် JavaScript stack အတွက် context အဖြစ် သုံးမယ့် `Error` object တစ်ခုပါ။ Report ကို callback တစ်ခု (သို့) exception handler တစ်ခုထဲမှာ errors တွေကို ကိုင်တွယ်ဖို့ သုံးတဲ့အခါ — report ထဲမှာ မူရင်း error ရဲ့ တည်နေရာအပြင် အဲဒါကို ဘယ်မှာ ကိုင်တွယ်ခဲ့လဲဆိုတာကိုပါ ထည့်သွင်းနိုင်စေပါတယ်။

```js
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```

`writeReport()` ဆီ filename ရော error object ရော နှစ်ခုလုံး ထည့်ပေးလိုက်ရင် — error object က ဒုတိယ parameter အနေနဲ့ ဖြစ်ရပါမယ်။

```js
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```

Diagnostic report ရဲ့ ပါဝင်မှုတွေကို JavaScript application တစ်ခုကနေ API call ကတစ်ဆင့် JavaScript Object အနေနဲ့ ပြန်လည် ရယူနိုင်ပါတယ်:

```js
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```

ဒီ function က optional ထပ်ဆောင်း argument တစ်ခုဖြစ်တဲ့ `err` ကို လက်ခံပါတယ် — report ထဲမှာ ပုံနှိပ်မယ့် JavaScript stack အတွက် context အဖြစ် သုံးမယ့် `Error` object တစ်ခုပါ။

```js
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```

API versions တွေက application အတွင်းကနေ runtime state ကို စစ်ဆေးကြည့်တဲ့အခါ အသုံးဝင်ပါတယ် — resource consumption (resource သုံးစွဲမှု) တွေကို ကိုယ်တိုင် ချိန်ညှိခြင်း၊ load balancing (ဝန်ခွဲဝေခြင်း)၊ monitoring (စောင့်ကြည့်ခြင်း) စတာတွေ လုပ်ဆောင်နိုင်ဖို့ မျှော်လင့်ချက်နဲ့ပါ။

Report ရဲ့ ပါဝင်မှုတွေထဲမှာ — event type, date, time, PID, နဲ့ Node.js version တွေ ပါဝင်တဲ့ header section တစ်ခု၊ JavaScript နဲ့ native stack traces တွေ ပါဝင်တဲ့ sections တွေ၊ V8 heap အချက်အလက် ပါဝင်တဲ့ section တစ်ခု၊ `libuv` handle အချက်အလက်တွေ ပါဝင်တဲ့ section တစ်ခု၊ နဲ့ CPU နဲ့ memory အသုံးပြုမှု နဲ့ system limits တွေကို ပြသပေးတဲ့ OS platform information section တစ်ခု တို့ ပါဝင်ပါတယ်။ Node.js REPL ကို သုံးပြီးတော့လည်း report ဥပမာ တစ်ခုကို trigger လုပ်နိုင်ပါတယ်:

```console
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```

Report တစ်ခုကို ရေးတဲ့အခါ — စတင်ခြင်း နဲ့ ပြီးဆုံးခြင်း messages တွေကို stderr ဆီ ထုတ်ပေးပြီး report ရဲ့ filename ကို caller ဆီ ပြန်ပေးပါတယ်။ Default filename ထဲမှာ date, time, PID, နဲ့ sequence number တစ်ခု ပါဝင်ပါတယ်။ Node.js process တစ်ခုတည်းအတွက် report တွေကို အကြိမ်များစွာ generate လုပ်ထားရင် — sequence number က report dump တွေကို runtime state နဲ့ ဆက်စပ် ဖော်ထုတ်ရာမှာ အထောက်အကူ ပြုပါတယ်။

## Report ဗားရှင်း (Report version)

Diagnostic report တစ်ခုမှာ report format ကို သီးသန့် ကိုယ်စားပြုတဲ့ ဂဏန်း တစ်လုံးတည်း version number (`report.header.reportVersion`) တစ်ခု ဆက်စပ်ပါရှိပါတယ်။ Key အသစ် ထည့်တာ (သို့) ဖယ်ရှားတာ၊ (သို့) တန်ဖိုးတစ်ခုရဲ့ data type ပြောင်းလဲတာတွေ ဖြစ်တိုင်း version number ကို တိုးမြှင့်ပေးပါတယ်။ Report version ရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေက LTS releases တွေတစ်လျှောက် တသမတ်တည်း ရှိပါတယ်။

### ဗားရှင်း မှတ်တမ်း (Version history)

#### Version 5

`userLimits` section ထဲက `data_seg_size_kbytes`, `max_memory_size_kbytes`, နဲ့ `virtual_memory_kbytes` keys တွေကို — ဒီတန်ဖိုးတွေကို bytes နဲ့ ပေးထားတာမို့ — `data_seg_size_bytes`, `max_memory_size_bytes`, နဲ့ `virtual_memory_bytes` တွေနဲ့ အသီးသီး အစားထိုးပါတယ်။

```json
{
  "userLimits": {
    // Skip some keys ...
    "data_seg_size_bytes": { // replacing data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // replacing max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // replacing virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```

#### Version 4

`tcp` နဲ့ `udp` libuv handles တွေရဲ့ endpoints တွေဆီ `ipv4` နဲ့ `ipv6` fields အသစ်တွေ ထည့်သွင်းပါတယ်။ ဥပမာများ:

```json
{
  "libuv": [
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // new key
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // new key
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcd68c8",
      "localEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // new key
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // new key
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 25,
      "writeQueueSize": 0,
      "readable": false,
      "writable": false
    }
  ]
}
```

#### Version 3

`resourceUsage` section ထဲကို အောက်ပါ memory usage keys တွေ ထည့်သွင်းပါတယ်။

```json
{
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "constrained_memory": "36624662528"
  }
}
```

#### Version 2

[`Worker`][] support ကို ထည့်သွင်းပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [Interaction with workers](#interaction-with-workers) section ကို ကြည့်ပါ။

#### Version 1

ဒါက diagnostic report ရဲ့ ပထမဆုံး version ပါ။

## Configuration (ပြင်ဆင်သတ်မှတ်မှု)

Report generation ရဲ့ နောက်ထပ် runtime configuration တွေကို `process.report` ရဲ့ အောက်ပါ properties တွေကနေတစ်ဆင့် ရယူနိုင်ပါတယ်:

`reportOnFatalError` က `true` ဖြစ်နေရင် fatal errors တွေပေါ်မှာ diagnostic reporting ကို trigger လုပ်ပေးပါတယ်။ Default က `false` ပါ။

`reportOnSignal` က `true` ဖြစ်နေရင် signal ပေါ်မှာ diagnostic reporting ကို trigger လုပ်ပေးပါတယ်။ ဒါက Windows မှာ support မလုပ်ပါဘူး။ Default က `false` ပါ။

`reportOnUncaughtException` က `true` ဖြစ်နေရင် uncaught exception ပေါ်မှာ diagnostic reporting ကို trigger လုပ်ပေးပါတယ်။ Default က `false` ပါ။

`signal` က report generation အတွက် external triggers တွေကို ကြားဖြတ်ဖို့ သုံးမယ့် POSIX signal identifier ကို သတ်မှတ်ပေးပါတယ်။ Default က `'SIGUSR2'` ပါ။

`filename` က file system ထဲမှာ output file ရဲ့ နာမည်ကို သတ်မှတ်ပေးပါတယ်။ `stdout` နဲ့ `stderr` ဆိုတဲ့ နာမည်တွေမှာ အထူး အဓိပ္ပာယ် ဆောင်ပါတယ် — ဒါတွေကို သုံးရင် report ကို သက်ဆိုင်ရာ standard streams တွေဆီ ရေးပေးမှာ ဖြစ်ပါတယ်။ Standard streams တွေ သုံးတဲ့ အခြေအနေတွေမှာ `directory` ထဲက တန်ဖိုးကို လျစ်လျူရှုပါတယ်။ URLs တွေကို support မလုပ်ပါဘူး။ Default ကတော့ timestamp, PID, နဲ့ sequence number တွေ ပါဝင်တဲ့ ပေါင်းစပ်ထားတဲ့ filename တစ်ခုပါ။

`directory` က report ကို ရေးသွားမယ့် file system directory ကို သတ်မှတ်ပေးပါတယ်။ URLs တွေကို support မလုပ်ပါဘူး။ Default ကတော့ Node.js process ရဲ့ လက်ရှိ working directory ပါ။

`excludeNetwork` က diagnostic report ထဲက `header.networkInterfaces` ကို ဖယ်ထုတ်ပေးပါတယ်။

```js
// Trigger report only on uncaught exceptions.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Trigger report for both internal errors as well as external signal.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Change the default signal to 'SIGQUIT' and enable it.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Disable network interfaces reporting
process.report.excludeNetwork = true;
```

Module တစ်ခု initialize လုပ်ချိန်မှာ configuration လုပ်ဖို့အတွက်လည်း — environment variables တွေကနေတစ်ဆင့် ရနိုင်ပါတယ်:

```bash
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```

API ရဲ့ သီးသန့် documentation ကို [`process API documentation`][] section အောက်မှာ ရှာတွေ့နိုင်ပါတယ်။

## Workers နဲ့ အပြန်အလှန် ဆက်စပ်မှုများ (Interaction with workers)

[`Worker`][] threads တွေက main thread လုပ်သလိုပဲ report တွေကို ဖန်တီးနိုင်ပါတယ်။

Report တွေထဲမှာ — လက်ရှိ thread ရဲ့ child တွေ ဖြစ်တဲ့ Workers တွေအကြောင်း အချက်အလက်တွေကို `workers` section ရဲ့ အစိတ်အပိုင်း အနေနဲ့ ထည့်သွင်းပါလိမ့်မယ် — Worker တစ်ခုချင်းစီကလည်း စံ report format နဲ့ပဲ report တစ်ခုစီ ထုတ်လုပ်ပါတယ်။

Report ကို ထုတ်လုပ်နေတဲ့ thread က Worker threads တွေရဲ့ report တွေ ပြီးဆုံးတဲ့အထိ စောင့်ဆိုင်းပါလိမ့်မယ်။ ဒါပေမယ့် — report ကို ထုတ်လုပ်ဖို့ run နေတဲ့ JavaScript ရော event loop ပါ နှောင့်ယှက်ခံရတာမို့ — ဒီအတွက် ကြန့်ကြာမှု (latency) က ပုံမှန်အားဖြင့် နည်းပါတယ်။

[`Worker`]: worker_threads.md
[`process API documentation`]: process.md
