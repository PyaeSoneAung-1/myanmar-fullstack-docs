---
title: "preconnect"
description: "Resources များ load လုပ်ရန် မျှော်လင့်ထားသော server တစ်ခုဆီ ကြိုတင် (eagerly) ချိတ်ဆက်ရန် browser ကို အချက်ပြပေးတဲ့ react-dom API — component render ချိန်/event handler အတွင်း ခေါ်နည်းများနဲ့ server-side rendering အတွက် caveats"
order: 96
source: "https://react.dev/reference/react-dom/preconnect"
status: translated
updated: 2026-09-02
---

`preconnect` က သင် resources တွေ load လုပ်ဖို့ မျှော်လင့်ထားတဲ့ server တစ်ခုဆီကို — စောစီးစွာ (eagerly) ချိတ်ဆက်နိုင်စေပါတယ်။

```js
preconnect("https://example.com");
```

## ရည်ညွှန်းချက် (Reference)

### `preconnect(href)`

Host တစ်ခုဆီ preconnect လုပ်ဖို့ — `react-dom` ကနေ `preconnect` function ကို ခေါ်ပါ:

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

`preconnect` function က — ပေးထားတဲ့ server တစ်ခုဆီ connection တစ်ခု ဖွင့်သင့်တယ်ဆိုတဲ့ hint တစ်ခုကို browser ကို ပေးပါတယ်။ Browser က အဲဒီလို လုပ်ဖို့ ရွေးချယ်လိုက်ရင် — အဲဒီ server ကနေ resources တွေ load လုပ်တာ မြန်ဆန်စေနိုင်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `href`: string တစ်ခု။ သင်ချိတ်ဆက်ချင်တဲ့ server ရဲ့ URL။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`preconnect` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Server တစ်ခုတည်းဆီ `preconnect` ကို အကြိမ်ကြိမ် ခေါ်တာက — တစ်ကြိမ်တည်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။
- Browser ထဲမှာ — `preconnect` ကို ဘယ်အခြေအနေမှာမဆို ခေါ်နိုင်ပါတယ်: component တစ်ခုကို render လုပ်နေစဉ်၊ Effect တစ်ခုအတွင်း၊ event handler တစ်ခုအတွင်း စသဖြင့်ပါ။
- Server-side rendering ဒါမှမဟုတ် Server Components တွေကို render လုပ်တဲ့အခါမှာ — `preconnect` က component တစ်ခုကို render လုပ်နေစဉ် ဒါမှမဟုတ် component တစ်ခုကို render လုပ်တာကနေ စတင်တဲ့ async context တစ်ခုအတွင်းမှာ ခေါ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ တခြား call တွေကတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။
- သင်လိုအပ်မယ့် တိကျတဲ့ resources တွေကို သိပြီးသားဆိုရင် — resources တွေကို ချက်ချင်း စတင် load လုပ်ပေးမယ့် [တခြား functions တွေ](https://react.dev/reference/react-dom#resource-preloading-apis) ကို ခေါ်နိုင်ပါတယ်။
- Webpage ကိုယ်တိုင် hosted လုပ်ထားတဲ့ server တစ်ခုတည်းဆီ preconnect လုပ်တာက အကျိုးမရှိပါဘူး — hint ပေးချိန်မှာ အဲဒီ server ကို ချိတ်ဆက်ပြီးသား ဖြစ်နေလို့ပါ။

## အသုံးပြုပုံ (Usage)

### Render လုပ်ချိန်မှာ preconnect လုပ်ခြင်း

Component တစ်ခုရဲ့ children တွေက အဲဒီ host ကနေ external resources တွေ load လုပ်မယ်ဆိုတာ သိရင် — component ကို render လုပ်နေစဉ်မှာ `preconnect` ကို ခေါ်ပါ။

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Event handler တစ်ခုအတွင်းမှာ preconnect လုပ်ခြင်း

External resources တွေ လိုအပ်မယ့် page ဒါမှမဟုတ် state တစ်ခုဆီ မပြောင်းခင် — event handler တစ်ခုအတွင်းမှာ `preconnect` ကို ခေါ်ပါ။ ဒါက page ဒါမှမဟုတ် state အသစ်ကို render လုပ်ချိန်မှာ ခေါ်တာထက် — လုပ်ငန်းစဉ်ကို ပိုစောပြီး စတင်စေပါတယ်။

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
