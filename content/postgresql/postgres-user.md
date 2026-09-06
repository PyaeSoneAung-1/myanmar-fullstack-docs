---
title: "The PostgreSQL User Account (PostgreSQL user အကောင့်)"
description: "PostgreSQL ကို သီးခြား user account တစ်ခုအောက်မှာ run လုပ်သင့်ရခြင်း အကြောင်းရင်းများ — ထို user account သည် server က စီမံခန့်ခွဲသော data များကိုသာ ပိုင်ဆိုင်သင့်ပြီး executable files များကို မပိုင်ဆိုင်သင့်ခြင်း၊ pre-packaged version များတွင် အလိုအလျောက် ဖန်တီးပေးခြင်း၊ `useradd`/`adduser` command ဖြင့် Unix user account ထည့်သွင်းခြင်း"
order: 140
source: "https://www.postgresql.org/docs/current/postgres-user.html"
status: translated
updated: 2026-09-06
---

## 18.1. The PostgreSQL User Account (PostgreSQL user အကောင့်)

ပြင်ပ လောကကနေ ဝင်ရောက် သုံးစွဲနိုင်တဲ့ server daemon (နောက်ခံ ဆာဗာ လုပ်ငန်းစဉ်) တစ်ခုခုနဲ့မဆို တူညီစွာပဲ — PostgreSQL ကို သီးခြား user account တစ်ခုအောက်မှာ run လုပ်ဖို့ အကြံပြုလိုပါတယ်။ ဒီ user account က server က စီမံခန့်ခွဲတဲ့ data တွေကိုပဲ ပိုင်ဆိုင်သင့်ပြီး — တခြား daemons တွေနဲ့ မျှဝေ သုံးစွဲလို့ မရပါဘူး။ (ဥပမာ — `nobody` user ကို သုံးတာက မကောင်းတဲ့ အကြံတစ်ခုပါ။) အထူးသဖြင့် — ဒီ user account က PostgreSQL ရဲ့ executable files (လုပ်ဆောင်နိုင်သော ဖိုင်များ) တွေကို မပိုင်ဆိုင်တာက ပိုကောင်းပါတယ် — အကြောင်းကတော့ — ထိုးဖောက် ခံရတဲ့ (compromised) server process တစ်ခု ဖြစ်သွားခဲ့ရင်တောင် — အဲဒီ executables တွေကို ပြုပြင် မွမ်းမံနိုင်စွမ်း မရှိအောင် သေချာ စေဖို့ပါ။

Pre-packaged (ကြိုတင် ထုပ်ပိုး ဖြန့်ချီထားသော — package ပုံစံ) PostgreSQL version တွေက — ပုံမှန်အားဖြင့် — package တပ်ဆင် (install) လုပ်တဲ့အချိန်အတွင်းမှာပဲ — သင့်လျော်တဲ့ user account တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။

သင့် system ထဲကို Unix user account တစ်ခု ထပ်ဖြည့်ဖို့ဆိုရင် — `useradd` ဒါမှမဟုတ် `adduser` ဆိုတဲ့ command တစ်ခုကို ရှာကြည့်ပါ။ postgres ဆိုတဲ့ user name ကို အသုံးများပြီး — ဒီစာအုပ်တစ်အုပ်လုံးမှာလည်း အဲဒီ user name ကိုပဲ ယူဆထားပါတယ် — ဒါပေမယ့် သင်နှစ်သက်ရင် တခြား နာမည် တစ်ခုခုကိုလည်း သုံးလို့ ရပါတယ်။
