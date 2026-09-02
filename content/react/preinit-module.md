---
title: "preinitModule"
description: "ESM module တစ်ခုကို ကြိုတင် (eagerly) fetch လုပ်ပြီး ချက်ချင်း evaluate/အကျိုးသက်ရောက်စေတဲ့ react-dom API — as/crossOrigin/integrity/nonce options များ၊ render ချိန်/event handler အတွင်း သုံးပုံနဲ့ preinit/preloadModule တို့နဲ့ ခွဲခြားပုံ"
order: 99
source: "https://react.dev/reference/react-dom/preinitModule"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** [React-based frameworks](https://react.dev/learn/creating-a-react-app) တွေက resource loading ကို သင့်အတွက် မကြာခဏ ကိုင်တွယ်ပေးတတ်လို့ — ဒီ API ကို ကိုယ်တိုင် ခေါ်စရာ မလိုတာမျိုး ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် သင့် framework ရဲ့ documentation ကို တိုင်ပင်ပါ။

`preinitModule` က ESM module တစ်ခုကို — စောစီးစွာ (eagerly) fetch လုပ်ပြီး evaluate လုပ်နိုင်စေပါတယ်။

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

## ရည်ညွှန်းချက် (Reference)

### `preinitModule(href, options)`

ESM module တစ်ခုကို preinit လုပ်ဖို့ — `react-dom` ကနေ `preinitModule` function ကို ခေါ်ပါ:

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

`preinitModule` function က — ပေးထားတဲ့ module ကို download လုပ်ပြီး execute လုပ်တာ စတင်သင့်တယ်ဆိုတဲ့ hint တစ်ခုကို browser ကို ပေးပါတယ် — ဒါက အချိန်ကုန်သက်သာစေနိုင်ပါတယ်။ သင် `preinit` လုပ်ထားတဲ့ modules တွေက download ပြီးတာနဲ့ execute လုပ်ခံရပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `href`: string တစ်ခု။ သင်က download လုပ်ပြီး execute လုပ်ချင်တဲ့ module ရဲ့ URL။
- `options`: object တစ်ခု။ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:
  - `as`: မဖြစ်မနေ လိုအပ်တဲ့ string တစ်ခု။ `'script'` ပဲ ဖြစ်ရပါမယ်။
  - `crossOrigin`: string တစ်ခု။ သုံးမယ့် [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `anonymous` နဲ့ `use-credentials` ပါ။
  - `integrity`: string တစ်ခု။ [သူ့ရဲ့ စစ်မှန်မှုကို verify လုပ်ဖို့](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) — module ရဲ့ cryptographic hash တစ်ခု။
  - `nonce`: string တစ်ခု။ တင်းကျပ်တဲ့ Content Security Policy တစ်ခု သုံးနေတဲ့အခါ [module ကို ခွင့်ပြုပေးဖို့](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cryptographic nonce တစ်ခု။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`preinitModule` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `href` တူညီတဲ့ `preinitModule` call တွေ အကြိမ်ကြိမ် ခေါ်တာက — တစ်ကြိမ်တည်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။
- Browser ထဲမှာ — `preinitModule` ကို ဘယ်အခြေအနေမှာမဆို ခေါ်နိုင်ပါတယ်: component တစ်ခုကို render လုပ်နေစဉ်၊ Effect တစ်ခုအတွင်း၊ event handler တစ်ခုအတွင်း စသဖြင့်ပါ။
- Server-side rendering ဒါမှမဟုတ် Server Components တွေကို render လုပ်တဲ့အခါမှာ — `preinitModule` က component တစ်ခုကို render လုပ်နေစဉ် ဒါမှမဟုတ် component တစ်ခုကို render လုပ်တာကနေ စတင်တဲ့ async context တစ်ခုအတွင်းမှာ ခေါ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ တခြား call တွေကတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### Render လုပ်ချိန်မှာ preinit လုပ်ခြင်း

Component တစ်ခု ဒါမှမဟုတ် သူ့ရဲ့ children တွေက တိကျတဲ့ module တစ်ခုကို သုံးမယ်ဆိုတာ သိပြီး — အဲဒီ module ကို download ပြီးတာနဲ့ evaluate လုပ်ပြီး ချက်ချင်း အကျိုးသက်ရောက်တာ လက်ခံနိုင်တယ်ဆိုရင် — component ကို render လုပ်နေစဉ်မှာ `preinitModule` ကို ခေါ်ပါ။

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Browser ကို module download လုပ်စေချင်ပေမယ့် — ချက်ချင်း execute လုပ်စေချင်တာ မဟုတ်ဘူးဆိုရင် — [`preloadModule`](/docs/react/preload-module) ကို သုံးပါ။ ESM module မဟုတ်တဲ့ script တစ်ခုကို preinit လုပ်ချင်ရင် — [`preinit`](/docs/react/preinit) ကို သုံးပါ။

### Event handler တစ်ခုအတွင်းမှာ preinit လုပ်ခြင်း

Module လိုအပ်မယ့် page ဒါမှမဟုတ် state တစ်ခုဆီ မပြောင်းခင် — event handler တစ်ခုအတွင်းမှာ `preinitModule` ကို ခေါ်ပါ။ ဒါက page ဒါမှမဟုတ် state အသစ်ကို render လုပ်ချိန်မှာ ခေါ်တာထက် — လုပ်ငန်းစဉ်ကို ပိုစောပြီး စတင်စေပါတယ်။

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
