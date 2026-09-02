---
title: "Live Debugging (App Run နေစဉ် အမှားရှာပြင်ခြင်း)"
description: "Node.js process တစ်ခုကို live debugging (လက်ရှိ run နေချိန် debug) လုပ်နည်း — app က မျှော်လင့်ထားတဲ့အတိုင်း မပြုမူတဲ့အခါ code path တွေကို ခြေရာခံခြင်း"
order: 47
source: "https://nodejs.org/learn/diagnostics/live-debugging"
status: translated
updated: 2026-09-02
---

## Live Debugging (App Run နေစဉ် အမှားရှာပြင်ခြင်း)

ဒီ document ထဲမှာ Node.js process တစ်ခုကို live debug လုပ်နည်း — ဆိုလိုတာက application run နေတုန်း အချိန်နဲ့တပြေးညီ debugger တစ်ခုနဲ့ ချိတ်ဆက်ပြီး စစ်ဆေးနည်း — အကြောင်း လေ့လာနိုင်မှာ ဖြစ်ပါတယ်။

## Application က မျှော်လင့်ထားတဲ့အတိုင်း မပြုမူခြင်း

### Symptoms (လက္ခဏာများ)

User က အချို့သော inputs တွေအတွက် application က မျှော်လင့်ထားတဲ့ output ကို မပေးဘူးလို့ သတိပြုမိနိုင်ပါတယ် — ဥပမာ HTTP server တစ်ခုက field တချို့ အလွတ်ဖြစ်နေတဲ့ JSON response တစ်ခုကို ပြန်ပေးတာမျိုးပါ။ Process ထဲမှာ အမှားအမျိုးမျိုး ဖြစ်နိုင်ပေမယ့် — ဒီ use case မှာတော့ application logic နဲ့ သူ့ရဲ့ မှန်ကန်မှု (correctness) ကို အဓိက အာရုံစိုက်ပါတယ်။

### Debugging (အမှားရှာပြင်ခြင်း)

ဒီ use case မှာ user က — HTTP request တစ်ခု ဝင်လာတာလိုမျိုး trigger တစ်ခုအတွက် application က ဘယ် code path ကို လုပ်ဆောင်သွားလဲဆိုတာကို နားလည်ချင်ပါတယ်။ Code ထဲကို step by step လျှောက်ပြီး execution ကို ထိန်းချုပ်ချင်သလို — variable တွေက memory ထဲမှာ ဘာတန်ဖိုးတွေ ကိုင်ထားလဲဆိုတာကိုလည်း စစ်ဆေးချင်တတ်ပါတယ်။

ဒီလိုလုပ်ဖို့ အောက်ပါ guide ကို ကြည့်ပါ:

- [Inspector အသုံးပြုခြင်း (Using Inspector)](/docs/nodejs/using-inspector) — inspector ကို သုံးပြီး application တစ်ခုကို live debug လုပ်ခြင်း

## ဆက်ဖတ်ရန်

- [Node.js Debugging (အမှားရှာပြင်ခြင်း)](/docs/nodejs/debugging) — `--inspect` flag နဲ့ Inspector ဖွင့်ခြင်း၊ Inspector clients များ
- [Using Inspector (official)](https://nodejs.org/learn/diagnostics/live-debugging/using-inspector) — Live debugging guide ထဲက Inspector သုံးပုံ အခန်း
