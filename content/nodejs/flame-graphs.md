---
title: "Flame Graphs (Flame Graph ဖန်တီးခြင်း)"
description: "CPU time ကို function အလိုက် မြင်သာစေတဲ့ flame graph ဖန်တီးနည်း — perf နဲ့ Node.js profiling options (--perf-basic-prof) သုံးပြီး 0x / FlameGraph tools နဲ့ ဆွဲခြင်း"
order: 49
source: "https://nodejs.org/learn/diagnostics/flame-graphs"
status: translated
updated: 2026-09-02
---

## Flame Graphs (Flame Graph ဖန်တီးခြင်း)

### Flame graph က ဘာအတွက် အသုံးဝင်လဲ

Flame graphs တွေက functions တွေထဲမှာ ကုန်ဆုံးတဲ့ CPU time ကို မြင်သာအောင် ပြပေးတဲ့ နည်းလမ်းတစ်ခုပါ။ Synchronous operations တွေမှာ အချိန် ဘယ်မှာ ပိုကုန်နေလဲဆိုတာကို အတိအကျ ဖော်ထုတ်ဖို့ ကူညီပေးပါတယ်။

### Flame graph ကို ဘယ်လို ဖန်တီးမလဲ

Node.js အတွက် flame graph ဖန်တီးတာ ခက်တယ်လို့ ကြားဖူးနေနိုင်ပေမယ့် — အခုတော့ (တကယ်တော့) မခက်ပါဘူး။ Flame graphs အတွက် Solaris vms တွေ မလိုတော့ပါဘူး!

Flame graphs တွေကို `perf` ရဲ့ output ကနေ ထုတ်လုပ်ပါတယ် — ဒါက node-specific tool တစ်ခု မဟုတ်ပါဘူး။ CPU time ကို မြင်သာအောင် ပြတဲ့ နည်းလမ်းတွေထဲမှာ အစွမ်းထက်ဆုံး ဖြစ်ပေမယ့် — Node.js 8 နဲ့ အထက်မှာ JavaScript code တွေကို optimize လုပ်တဲ့ပုံနဲ့ ပတ်သက်ပြီး ပြဿနာ တချို့ ရှိနိုင်ပါတယ်။ အောက်က 'perf output ပြဿနာများ' section ကို ကြည့်ပါ။

#### Pre-packaged tool တစ်ခု သုံးခြင်း

Local မှာ တစ်ဆင့်တည်းနဲ့ flame graph ထုတ်ချင်ရင် — [0x](https://www.npmjs.com/package/0x) ကို စမ်းကြည့်ပါ။

Production deployments တွေကို diagnose လုပ်ဖို့ဆိုရင် ဒီမှတ်စုတွေကို ဖတ်ပါ — [0x production servers](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md)။

#### System perf tools တွေနဲ့ flame graph ဖန်တီးခြင်း

ဒီ guide ရဲ့ ရည်ရွယ်ချက်က flame graph ဖန်တီးခြင်းရဲ့ အဆင့်တွေကို ပြသပြီး — အဆင့်တစ်ခုချင်းစီကို ကိုယ်တိုင် ထိန်းချုပ်နိုင်အောင် ကူညီပေးဖို့ပါ။

အဆင့်တစ်ခုချင်းစီကို ပိုနားလည်ချင်ရင် အောက်မှာ အသေးစိတ် ရှင်းပြထားတဲ့ sections တွေကို ကြည့်ပါ။

အခု စလုပ်ကြရအောင်:

- `perf` ကို install လုပ်ပါ (ပုံမှန်အားဖြင့် `linux-tools-common` package ကနေ ရနိုင်ပါတယ်)
- `perf` ကို run ကြည့်ပါ — kernel modules တွေ မရှိဘူးလို့ complain လုပ်ရင် အဲဒါတွေကိုပါ install လုပ်ပါ
- Node ကို perf enabled နဲ့ run ပါ (Node.js version အလိုက် tips တွေအတွက် အောက်က 'perf output ပြဿနာများ' ကို ကြည့်ပါ):

```bash
perf record -e cycles:u -g -- node --perf-basic-prof --interpreted-frames-native-stack app.js
```

- Warnings တွေကို ဂရုမစိုက်ပါနဲ့ — perf ကို packages တွေ မရှိလို့ run လို့မရဘူးလို့ ပြောနေတာမျိုးကလွဲရင်၊ kernel module samples တွေဆီ ဝင်လို့မရတာနဲ့ ပတ်သက်တဲ့ warnings တချို့ ရနိုင်ပေမယ့် အဲဒါတွေက ကိုယ်လိုချင်တာ မဟုတ်ပါဘူး။
- နောက်တစ်ခဏမှာ မြင်သာအောင် ပြမယ့် data file ကို ထုတ်ဖို့ `perf script > perfs.out` ကို run ပါ။ ပိုဖတ်ရလွယ်တဲ့ graph ရဖို့ cleanup နည်းနည်း လုပ်ထားတာ အသုံးဝင်ပါတယ်။
- Flame graph ကို preview (သို့) ထုတ်လုပ်ပါ:

Browser preview (local setup မလိုဘူး):

- ထွက်လာတဲ့ `perfs.out` file ကို https://flamegraph.com ဆီ upload လုပ်ပြီး flame graph ကို မြင်ယောင်ကြည့်ပါ။

Brendan Gregg ရဲ့ FlameGraph tools တွေကို clone လုပ်ပါ: https://github.com/brendangregg/FlameGraph

```bash
cat perfs.out | ./FlameGraph/stackcollapse-perf.pl | ./FlameGraph/flamegraph.pl --colors=js > profile.svg
```

အခု flame graph file ကို ကိုယ်ကြိုက်တဲ့ browser မှာ ဖွင့်ကြည့်လိုက်ပါ။

Flame graph ပေါ်လာပြီဆိုရင် — အရောင်ရင့်ဆုံး orange bars တွေကို အရင်ဆုံး စစ်ဆေးပါ။ အဲဒါတွေက CPU-heavy function တွေ ဖြစ်နိုင်ခြေ များပါတယ်။

သတိပြုစရာ — flame graph ရဲ့ element တစ်ခုကို click လုပ်ရင် click လုပ်ထားတဲ့ အပိုင်းကို zoom-in လုပ်ပေးပါတယ်။

### Run နေတဲ့ process တစ်ခုကို `perf` နဲ့ sample လုပ်ခြင်း

ဒါက — မရပ်တန့်ချင်တဲ့ run နေပြီးသား process တစ်ခုကနေ flame graph data တွေ မှတ်တမ်းတင်ဖို့ အကောင်းဆုံးပါ။ ပြန်ထုတ်ဖို့ ခက်တဲ့ issue တစ်ခု ရှိနေတဲ့ production process တစ်ခုကို စိတ်ကူးကြည့်ပါ။

```bash
perf record -F99 -p `pgrep -n node` -g -- sleep 3
```

ခဏစောင့် — အဲဒီ `sleep 3` က ဘာအတွက်လဲ? အဲဒါက perf ကို ဆက်အလုပ်လုပ်နေအောင် လုပ်ဖို့ပါ — `-p` option က တခြား pid တစ်ခုကို ညွှန်ပြနေပေမယ့် — command က process တစ်ခုပေါ်မှာ execute ဖြစ်ပြီး process နဲ့အတူ အဆုံးသတ်ရပါတယ်။ Perf က ကိုယ် ပေးလိုက်တဲ့ command ရဲ့ သက်တမ်းအတိုင်း run ပါတယ် — အဲဒီ command ကိုယ်တိုင်ကို profile လုပ်နေတာလား မလုပ်ဘူးလားဆိုတာ မသက်ဆိုင်ပါဘူး။ `sleep 3` က perf ကို ၃ စက္ကန့်ကြာ run စေဖို့ သေချာစေပါတယ်။

`-F` (profiling frequency) ကို ဘာလို့ 99 ထားတာလဲ? ဒါက သင့်တင့်လုံလောက်တဲ့ default တန်ဖိုးတစ်ခုပါ။ လိုအပ်ရင် ချိန်ညှိနိုင်ပါတယ်။ `-F99` က perf ကို တစ်စက္ကန့်ကို sample ၉၉ ခု ယူခိုင်းတာပါ — ပိုတိကျချင်ရင် တန်ဖိုးကို မြှင့်ပါ။ တန်ဖိုး နိမ့်လေ output နည်းပြီး တိကျမှု နည်းလေပါ။ လိုအပ်တဲ့ တိကျမှုက ကိုယ့်ရဲ့ CPU-intensive functions တွေ တကယ် ဘယ်လောက်ကြာကြာ run လဲပေါ်မှာ မူတည်ပါတယ်။ သိသာတဲ့ နှေးကွေးမှုတစ်ခုရဲ့ အကြောင်းရင်းကို ရှာနေတာဆိုရင် — တစ်စက္ကန့် frame ၉၉ ခုဆိုတာ လုံလောက်ပါတယ်။

ဒီ ၃ စက္ကန့် perf record ရပြီဆိုရင် — အပေါ်က နောက်ဆုံး အဆင့်နှစ်ခုနဲ့ flame graph ကို ဆက်ထုတ်လိုက်ပါ။

### Node.js internal functions တွေကို စစ်ထုတ်ခြင်း

ပုံမှန်အားဖြင့် ကိုယ့် code တွေရဲ့ performance ကိုပဲ ကြည့်ချင်တာမို့ — Node.js နဲ့ V8 ရဲ့ internal functions တွေကို စစ်ထုတ်လိုက်ရင် graph ကို ပိုလွယ်လွယ်နဲ့ ဖတ်လို့ရပါတယ်။ Perf file ကို ဒီလို သန့်ရှင်းလို့ရပါတယ်:

```bash
sed -i -r \
  -e "/( __libc_start| LazyCompile | v8::internal::| Builtin:| Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)/d" \
  -e 's/ LazyCompile:[*~]?/ /' \
  perfs.out
```

Flame graph ကို ဖတ်ကြည့်တော့ ထူးဆန်းနေတယ် — အချိန်အများဆုံး ယူနေတဲ့ key function ထဲမှာ တစ်ခုခု ပျောက်နေသလိုမျိုး ခံစားရရင် — filter တွေ မပါဘဲ flame graph ကို ပြန်ထုတ်ကြည့်ပါ — Node.js ကိုယ်တိုင်နဲ့ ပတ်သက်တဲ့ ရှားပါးတဲ့ issue တစ်ခု ဖြစ်နေနိုင်လို့ပါ။

### Node.js ရဲ့ profiling options တွေ

`--perf-basic-prof-only-functions` နဲ့ `--perf-basic-prof` ဆိုတာ ကိုယ့် JavaScript code တွေကို debug လုပ်ဖို့ အသုံးဝင်တဲ့ option နှစ်ခုပါ။ တခြား options တွေကတော့ Node.js ကိုယ်တိုင်ကို profiling လုပ်ဖို့ သုံးတာမို့ — ဒီ guide ရဲ့ ဘောင်အပြင်ဘက်ပါ။

`--perf-basic-prof-only-functions` က output နည်းပါးတာမို့ — overhead အနည်းဆုံး option ဖြစ်ပါတယ်။

### ဒါတွေ ဘာကြောင့် လိုတာလဲ

ဒီ options တွေ မပါဘဲဆိုရင် — flame graph ရပါသေးတယ်၊ ဒါပေမယ့် bars အများစုက `v8::Function::Call` လို့ပဲ တံဆိပ်ကပ်ထားတာ တွေ့ရပါလိမ့်မယ်။

## `perf` output ပြဿနာများ

### Node.js 8.x — V8 pipeline အပြောင်းအလဲများ

Node.js 8.x နဲ့ အထက်မှာ V8 engine ရဲ့ JavaScript compilation pipeline အတွက် optimization အသစ်တွေ ပါဝင်လာပါတယ် — (ဒါကို Turbofan လို့ ခေါ်ပါတယ်) — ဒါက function names/references တွေကို perf အတွက် တစ်ခါတစ်ရံ လက်လှမ်းမမှီဖြစ်စေပါတယ်။

အကျိုးဆက်အနေနဲ့ — flame graph ထဲမှာ function names တွေ မှန်မှန် မရတော့ဘဲ ဖြစ်နိုင်ပါတယ်။

Function names တွေ ရှိရမယ့် နေရာမှာ `ByteCodeHandler:` ဆိုတာမျိုး တွေ့ရပါလိမ့်မယ်။

0x မှာ ဒီအတွက် mitigation တချို့ built-in ပါရှိပါတယ်။

အသေးစိတ်အတွက်:

- https://github.com/nodejs/benchmarking/issues/168
- https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961

### Node.js 10+

Node.js 10.x က `--interpreted-frames-native-stack` flag နဲ့ Turbofan ရဲ့ ပြဿနာကို ဖြေရှင်းပေးပါတယ်။

V8 က JavaScript ကို ဘယ် pipeline နဲ့ compile လုပ်ပဲ လုပ်လုပ် — flame graph ထဲမှာ function names တွေ ရဖို့:

```bash
node --interpreted-frames-native-stack --perf-basic-prof-only-functions
```

လို့ run ပါ။

### Flame graph ထဲမှာ Labels တွေ ပျက်နေခြင်း

ဒီလိုပုံစံမျိုး labels တွေ တွေ့နေရရင် —

```text
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPNS0_8ZoneListIPNS0_9StatementEEE
```

ဆိုရင် — ကိုယ်သုံးနေတဲ့ Linux perf ကို demangle support မပါဘဲ compile လုပ်ထားတာ ဖြစ်ပါတယ်။ ဥပမာအတွက် https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654 ကို ကြည့်ပါ။

## ဥပမာများ (Examples)

Flame graph ဖမ်းယူတာကို ကိုယ်တိုင် လေ့ကျင့်ကြည့်ချင်ရင် — [flame graph exercise](https://github.com/naugtur/node-example-flamegraph) နဲ့ လေ့ကျင့်ကြည့်ပါ။
