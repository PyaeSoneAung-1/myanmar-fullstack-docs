---
title: "react-dom/server"
description: "React components တွေကို server ပေါ်မှာ HTML အဖြစ် render လုပ်ဖို့ react-dom/server APIs များ — Web Streams (renderToReadableStream, resume) ၊ Node.js Streams (renderToPipeableStream, resumeToPipeableStream) နဲ့ streaming မဟုတ်တဲ့ environments အတွက် legacy APIs (renderToString, renderToStaticMarkup) တို့ ပါဝင်သည်"
order: 89
source: "https://react.dev/reference/react-dom/server"
status: translated
updated: 2026-09-02
---

`react-dom/server` ရဲ့ APIs တွေက React components တွေကို server ပေါ်မှာ HTML အဖြစ် [server-side render](/docs/react/creating-a-react-app) လုပ်ပေးနိုင်ပါတယ်။ ဒီ APIs တွေကို သင့် app ရဲ့ ထိပ်ဆုံးအဆင့်မှာပဲ — ကနဦး HTML ထုတ်ဖို့အတွက် server ပေါ်မှာ သုံးပါတယ်။ [Framework](/docs/react/creating-a-react-app) တစ်ခုက ဒီ APIs တွေကို သင့်အတွက် ခေါ်ပေးတတ်ပါတယ်။ သင့် components အများစုကတော့ ဒါတွေကို import လုပ်ဖို့ (သို့) သုံးဖို့ မလိုပါဘူး။

## Web Streams အတွက် Server APIs

ဒီ methods တွေက [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ရှိတဲ့ environments တွေမှာပဲ ရနိုင်ပါတယ် — browsers၊ Deno နဲ့ modern edge runtimes တချို့ အပါအဝင်ပါ:

* [`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream) က React tree တစ်ခုကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) အဖြစ် render လုပ်ပါတယ်။
* [`resume`](/docs/react/resume) က [`prerender`](https://react.dev/reference/react-dom/static/prerender) ရဲ့ ရလဒ်ကို [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) အဖြစ် ဆက်လက် (resume) လုပ်ပါတယ်။

> **မှတ်ချက်:** Node.js မှာလည်း ဒီ methods တွေကို compatibility အတွက် ထည့်သွင်းထားပေမယ့် — performance ပိုဆိုးလို့ အကြံပြုလို့ မရပါဘူး။ အဲဒီအစား [Node.js အတွက် သီးသန့် APIs](#server-apis-for-nodejs-streams) တွေကို သုံးပါ။

## Node.js Streams အတွက် Server APIs

ဒီ methods တွေက [Node.js Streams](https://nodejs.org/api/stream.html) ရှိတဲ့ environments တွေမှာပဲ ရနိုင်ပါတယ်:

* [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) က React tree တစ်ခုကို pipe လုပ်လို့ရတဲ့ [Node.js Stream](https://nodejs.org/api/stream.html) အဖြစ် render လုပ်ပါတယ်။
* [`resumeToPipeableStream`](/docs/react/resume-to-pipeable-stream) က [`prerenderToNodeStream`](https://react.dev/reference/react-dom/static/prerenderToNodeStream) ရဲ့ ရလဒ်ကို pipe လုပ်လို့ရတဲ့ [Node.js Stream](https://nodejs.org/api/stream.html) အဖြစ် ဆက်လက် (resume) လုပ်ပါတယ်။

## Streaming မဟုတ်တဲ့ environments အတွက် Legacy Server APIs

Streams တွေကို support မလုပ်တဲ့ environments တွေမှာတော့ ဒီ methods တွေကို သုံးနိုင်ပါတယ်:

* [`renderToString`](/docs/react/render-to-string) က React tree တစ်ခုကို string အဖြစ် render လုပ်ပါတယ်။
* [`renderToStaticMarkup`](/docs/react/render-to-static-markup) က non-interactive React tree တစ်ခုကို string အဖြစ် render လုပ်ပါတယ်။

ဒါတွေက streaming APIs တွေနဲ့ ယှဉ်ရင် လုပ်ဆောင်နိုင်စွမ်း အကန့်အသတ် ရှိပါတယ်။
