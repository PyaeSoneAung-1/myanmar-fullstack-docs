---
title: "preinit"
description: "Stylesheet (style) သို့မဟုတ် external script တစ်ခုကို ကြိုတင် (eagerly) fetch လုပ်ပြီး ချက်ချင်း evaluate/အကျိုးသက်ရောက်စေတဲ့ react-dom API — as/precedence/crossOrigin/integrity/nonce/fetchPriority options များ၊ render ချိန်/event handler အတွင်း သုံးပုံနဲ့ preload နဲ့ ခွဲခြားပုံ"
order: 98
source: "https://react.dev/reference/react-dom/preinit"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** [React-based frameworks](https://react.dev/learn/creating-a-react-app) တွေက resource loading ကို သင့်အတွက် မကြာခဏ ကိုင်တွယ်ပေးတတ်လို့ — ဒီ API ကို ကိုယ်တိုင် ခေါ်စရာ မလိုတာမျိုး ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် သင့် framework ရဲ့ documentation ကို တိုင်ပင်ပါ။

`preinit` က stylesheet တစ်ခု ဒါမှမဟုတ် external script တစ်ခုကို — စောစီးစွာ (eagerly) fetch လုပ်ပြီး evaluate လုပ်နိုင်စေပါတယ်။

```js
preinit("https://example.com/script.js", {as: "script"});
```

## ရည်ညွှန်းချက် (Reference)

### `preinit(href, options)`

Script တစ်ခု ဒါမှမဟုတ် stylesheet တစ်ခုကို preinit လုပ်ဖို့ — `react-dom` ကနေ `preinit` function ကို ခေါ်ပါ:

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

`preinit` function က — ပေးထားတဲ့ resource ကို download လုပ်ပြီး execute လုပ်တာ စတင်သင့်တယ်ဆိုတဲ့ hint တစ်ခုကို browser ကို ပေးပါတယ် — ဒါက အချိန်ကုန်သက်သာစေနိုင်ပါတယ်။ သင် `preinit` လုပ်ထားတဲ့ scripts တွေက download ပြီးတာနဲ့ execute လုပ်ခံရပါတယ်။ သင် preinit လုပ်ထားတဲ့ stylesheets တွေက document ထဲကို ထည့်သွင်းခံရပြီး — ချက်ချင်း အကျိုးသက်ရောက်စေပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `href`: string တစ်ခု။ သင်က download လုပ်ပြီး execute လုပ်ချင်တဲ့ resource ရဲ့ URL။
- `options`: object တစ်ခု။ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:
  - `as`: မဖြစ်မနေ လိုအပ်တဲ့ string တစ်ခု။ Resource ရဲ့ အမျိုးအစား။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `script` နဲ့ `style` ပါ။
  - `precedence`: string တစ်ခု။ Stylesheets တွေနဲ့ဆို မဖြစ်မနေ လိုအပ်ပါတယ်။ Stylesheet ကို တခြား stylesheets တွေနဲ့ ယှဉ်ပြီး ဘယ်နေရာမှာ ထည့်သွင်းရမလဲ ပြောပါတယ်။ Precedence ပိုမြင့်တဲ့ stylesheets တွေက ပိုနိမ့်တဲ့ဟာတွေကို override လုပ်နိုင်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `reset`, `low`, `medium`, `high` ပါ။
  - `crossOrigin`: string တစ်ခု။ သုံးမယ့် [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `anonymous` နဲ့ `use-credentials` ပါ။
  - `integrity`: string တစ်ခု။ [သူ့ရဲ့ စစ်မှန်မှုကို verify လုပ်ဖို့](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) — resource ရဲ့ cryptographic hash တစ်ခု။
  - `nonce`: string တစ်ခု။ တင်းကျပ်တဲ့ Content Security Policy တစ်ခု သုံးနေတဲ့အခါ [resource ကို ခွင့်ပြုပေးဖို့](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cryptographic nonce တစ်ခု။
  - `fetchPriority`: string တစ်ခု။ Resource ကို fetch လုပ်တာအတွက် နှိုင်းရ ဦးစားပေးမှု (relative priority) တစ်ခုကို အကြံပြုပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `auto` (default), `high` နဲ့ `low` ပါ။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`preinit` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `href` တူညီတဲ့ `preinit` call တွေ အကြိမ်ကြိမ် ခေါ်တာက — တစ်ကြိမ်တည်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။
- Browser ထဲမှာ — `preinit` ကို ဘယ်အခြေအနေမှာမဆို ခေါ်နိုင်ပါတယ်: component တစ်ခုကို render လုပ်နေစဉ်၊ Effect တစ်ခုအတွင်း၊ event handler တစ်ခုအတွင်း စသဖြင့်ပါ။
- Server-side rendering ဒါမှမဟုတ် Server Components တွေကို render လုပ်တဲ့အခါမှာ — `preinit` က component တစ်ခုကို render လုပ်နေစဉ် ဒါမှမဟုတ် component တစ်ခုကို render လုပ်တာကနေ စတင်တဲ့ async context တစ်ခုအတွင်းမှာ ခေါ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ တခြား call တွေကတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### Render လုပ်ချိန်မှာ preinit လုပ်ခြင်း

Component တစ်ခု ဒါမှမဟုတ် သူ့ရဲ့ children တွေက တိကျတဲ့ resource တစ်ခုကို သုံးမယ်ဆိုတာ သိပြီး — အဲဒီ resource ကို download ပြီးတာနဲ့ evaluate လုပ်ပြီး ချက်ချင်း အကျိုးသက်ရောက်တာ လက်ခံနိုင်တယ်ဆိုရင် — component ကို render လုပ်နေစဉ်မှာ `preinit` ကို ခေါ်ပါ။

#### External script တစ်ခုကို preinit လုပ်ခြင်း

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Browser ကို script download လုပ်စေချင်ပေမယ့် — ချက်ချင်း execute လုပ်စေချင်တာ မဟုတ်ဘူးဆိုရင် — [`preload`](/docs/react/preload) ကို သုံးပါ။ ESM module တစ်ခုကို load လုပ်ချင်ရင် — [`preinitModule`](/docs/react/preinit-module) ကို သုံးပါ။

#### Stylesheet တစ်ခုကို preinit လုပ်ခြင်း

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

မဖြစ်မနေ လိုအပ်တဲ့ `precedence` option က — document အတွင်းက stylesheets တွေရဲ့ order ကို ထိန်းချုပ်ပေးပါတယ်။ Precedence ပိုမြင့်တဲ့ stylesheets တွေက ပိုနိမ့်တဲ့ဟာတွေကို override လုပ်နိုင်ပါတယ်။

Stylesheet ကို download လုပ်စေချင်ပေမယ့် — document ထဲကို ချက်ချင်း ထည့်သွင်းစေချင်တာ မဟုတ်ဘူးဆိုရင် — [`preload`](/docs/react/preload) ကို သုံးပါ။

### Event handler တစ်ခုအတွင်းမှာ preinit လုပ်ခြင်း

External resources တွေ လိုအပ်မယ့် page ဒါမှမဟုတ် state တစ်ခုဆီ မပြောင်းခင် — event handler တစ်ခုအတွင်းမှာ `preinit` ကို ခေါ်ပါ။ ဒါက page ဒါမှမဟုတ် state အသစ်ကို render လုပ်ချိန်မှာ ခေါ်တာထက် — လုပ်ငန်းစဉ်ကို ပိုစောပြီး စတင်စေပါတယ်။

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
