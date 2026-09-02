---
title: "react-dom/static"
description: "React components တွေကို static HTML အဖြစ် generate လုပ်ဖို့ react-dom/static APIs များ — Web Streams အတွက် (prerender, resumeAndPrerender) နဲ့ Node.js Streams အတွက် (prerenderToNodeStream, resumeAndPrerenderToNodeStream) — streaming APIs တွေနဲ့ ယှဉ်ရင် လုပ်ဆောင်နိုင်စွမ်း အကန့်အသတ် ရှိသည်"
order: 108
source: "https://react.dev/reference/react-dom/static"
status: translated
updated: 2026-09-02
---

`react-dom/static` ရဲ့ APIs တွေက React components တွေအတွက် static HTML generate လုပ်ပေးနိုင်ပါတယ်။ ဒါတွေက streaming APIs တွေနဲ့ ယှဉ်ရင် လုပ်ဆောင်နိုင်စွမ်း အကန့်အသတ် ရှိပါတယ်။ [Framework](/docs/react/creating-a-react-app) တစ်ခုက ဒီ APIs တွေကို သင့်အတွက် ခေါ်ပေးတတ်ပါတယ်။ သင့် components အများစုကတော့ ဒါတွေကို import လုပ်ဖို့ (သို့) သုံးဖို့ မလိုပါဘူး။

## Web Streams အတွက် Static APIs

ဒီ methods တွေက [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ရှိတဲ့ environments တွေမှာပဲ ရနိုင်ပါတယ် — browsers၊ Deno နဲ့ modern edge runtimes တချို့ အပါအဝင်ပါ:

* [`prerender`](/docs/react/prerender) က React tree တစ်ခုကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) နဲ့ static HTML အဖြစ် render လုပ်ပါတယ်။
* *(Experimental)* [`resumeAndPrerender`](/docs/react/resume-and-prerender) က prerender လုပ်ထားပြီးသား React tree တစ်ခုကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) နဲ့ static HTML အဖြစ် ဆက်လက် render လုပ်ပါတယ်။

Node.js မှာလည်း ဒီ methods တွေကို compatibility အတွက် ထည့်သွင်းထားပေမယ့် — performance ပိုဆိုးလို့ အကြံပြုလို့ မရပါဘူး။ [Node.js အတွက် သီးသန့် APIs](#static-apis-for-nodejs-streams) တွေကို အဲဒီအစား သုံးပါ။

## Node.js Streams အတွက် Static APIs

ဒီ methods တွေက [Node.js Streams](https://nodejs.org/api/stream.html) ရှိတဲ့ environments တွေမှာပဲ ရနိုင်ပါတယ်:

* [`prerenderToNodeStream`](/docs/react/prerender-to-node-stream) က React tree တစ်ခုကို [Node.js Stream](https://nodejs.org/api/stream.html) နဲ့ static HTML အဖြစ် render လုပ်ပါတယ်။
* *(Experimental)* [`resumeAndPrerenderToNodeStream`](/docs/react/resume-and-prerender-to-node-stream) က prerender လုပ်ထားပြီးသား React tree တစ်ခုကို [Node.js Stream](https://nodejs.org/api/stream.html) နဲ့ static HTML အဖြစ် ဆက်လက် render လုပ်ပါတယ်။
