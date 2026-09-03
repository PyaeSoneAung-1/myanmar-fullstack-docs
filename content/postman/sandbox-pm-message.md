---
title: "Scripts တွေထဲမှာ message data တွေကို ကိုးကားခြင်း (Reference message data in scripts)"
description: "pm.message object နဲ့ On message scripts တွေထဲမှာ server ကနေ လက်ခံရရှိတဲ့ message data တွေကို access လုပ်ခြင်း — data နဲ့ timestamp properties တွေ"
order: 118
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-message/"
status: translated
updated: 2026-09-03
---

`pm.message` object က server ကနေ လက်ခံရရှိတဲ့ message ထဲမှာ ပါဝင်တဲ့ data တွေကို access ပေးပါတယ်။ `pm.message` ကို **On message** scripts တွေမှာပဲ ရနိုင်ပါတယ်။

## pm.message properties တွေ

`pm.message` object ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:

Incoming message တစ်ခုအတွက်:

* `pm.message: PropertyList<{ data: any, timestamp: Date }>` — `key` နဲ့ `value` properties တွေ ပါဝင်တဲ့ message တစ်ခုချင်းစီရဲ့ [`PropertyList`](https://www.postmanlabs.com/postman-collection/PropertyList.html) object ပါ:
* `data` — လက်ခံရရှိတဲ့ message ရဲ့ content ပါ။
* `timestamp` — Message ကို လက်ခံရရှိတဲ့ အချိန်ပါ — `Date` object တစ်ခုအနေနဲ့ ကိုယ်စားပြုပါတယ်။
