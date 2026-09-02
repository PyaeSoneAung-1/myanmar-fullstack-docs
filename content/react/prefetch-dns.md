---
title: "prefetchDNS"
description: "Resources များ load လုပ်ရန် မျှော်လင့်ထားသော server တစ်ခုရဲ့ IP ကို ကြိုတင် (eagerly) ရှာဖွေရန် browser ကို အချက်ပြပေးတဲ့ react-dom API — component render ချိန်/event handler အတွင်း ခေါ်နည်းများ၊ preconnect နဲ့ နှိုင်းယှဉ်ချက်နဲ့ caveats"
order: 97
source: "https://react.dev/reference/react-dom/prefetchDNS"
status: translated
updated: 2026-09-02
---

`prefetchDNS` က သင် resources တွေ load လုပ်ဖို့ မျှော်လင့်ထားတဲ့ server တစ်ခုရဲ့ IP ကို — စောစီးစွာ (eagerly) ရှာဖွေနိုင်စေပါတယ်။

```js
prefetchDNS("https://example.com");
```

## ရည်ညွှန်းချက် (Reference)

### `prefetchDNS(href)`

Host တစ်ခုကို ရှာဖွေဖို့ — `react-dom` ကနေ `prefetchDNS` function ကို ခေါ်ပါ:

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

`prefetchDNS` function က — ပေးထားတဲ့ server တစ်ခုရဲ့ IP address ကို ရှာဖွေသင့်တယ်ဆိုတဲ့ hint တစ်ခုကို browser ကို ပေးပါတယ်။ Browser က အဲဒီလို လုပ်ဖို့ ရွေးချယ်လိုက်ရင် — အဲဒီ server ကနေ resources တွေ load လုပ်တာ မြန်ဆန်စေနိုင်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `href`: string တစ်ခု။ သင်ချိတ်ဆက်ချင်တဲ့ server ရဲ့ URL။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`prefetchDNS` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Server တစ်ခုတည်းအတွက် `prefetchDNS` ကို အကြိမ်ကြိမ် ခေါ်တာက — တစ်ကြိမ်တည်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။
- Browser ထဲမှာ — `prefetchDNS` ကို ဘယ်အခြေအနေမှာမဆို ခေါ်နိုင်ပါတယ်: component တစ်ခုကို render လုပ်နေစဉ်၊ Effect တစ်ခုအတွင်း၊ event handler တစ်ခုအတွင်း စသဖြင့်ပါ။
- Server-side rendering ဒါမှမဟုတ် Server Components တွေကို render လုပ်တဲ့အခါမှာ — `prefetchDNS` က component တစ်ခုကို render လုပ်နေစဉ် ဒါမှမဟုတ် component တစ်ခုကို render လုပ်တာကနေ စတင်တဲ့ async context တစ်ခုအတွင်းမှာ ခေါ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ တခြား call တွေကတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။
- သင်လိုအပ်မယ့် တိကျတဲ့ resources တွေကို သိပြီးသားဆိုရင် — resources တွေကို ချက်ချင်း စတင် load လုပ်ပေးမယ့် [တခြား functions တွေ](https://react.dev/reference/react-dom#resource-preloading-apis) ကို ခေါ်နိုင်ပါတယ်။
- Webpage ကိုယ်တိုင် hosted လုပ်ထားတဲ့ server တစ်ခုတည်းအတွက် prefetch လုပ်တာက အကျိုးမရှိပါဘူး — hint ပေးချိန်မှာ အဲဒီ server ကို ရှာဖွေပြီးသား ဖြစ်နေလို့ပါ။
- [`preconnect`](/docs/react/preconnect) နဲ့ ယှဉ်ရင် — domains အများကြီးဆီ speculative (ခန့်မှန်းချက်အနေနဲ့) ချိတ်ဆက်နေတဲ့အခါ `prefetchDNS` က ပိုကောင်းနိုင်ပါတယ် — အဲဒီလိုအခြေအနေမျိုးမှာ preconnections တွေရဲ့ overhead က အကျိုးခံစားရမှုထက် ပိုကြီးသွားနိုင်လို့ပါ။

## အသုံးပြုပုံ (Usage)

### Render လုပ်ချိန်မှာ DNS prefetch လုပ်ခြင်း

Component တစ်ခုရဲ့ children တွေက အဲဒီ host ကနေ external resources တွေ load လုပ်မယ်ဆိုတာ သိရင် — component ကို render လုပ်နေစဉ်မှာ `prefetchDNS` ကို ခေါ်ပါ။

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Event handler တစ်ခုအတွင်းမှာ DNS prefetch လုပ်ခြင်း

External resources တွေ လိုအပ်မယ့် page ဒါမှမဟုတ် state တစ်ခုဆီ မပြောင်းခင် — event handler တစ်ခုအတွင်းမှာ `prefetchDNS` ကို ခေါ်ပါ။ ဒါက page ဒါမှမဟုတ် state အသစ်ကို render လုပ်ချိန်မှာ ခေါ်တာထက် — လုပ်ငန်းစဉ်ကို ပိုစောပြီး စတင်စေပါတယ်။

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
