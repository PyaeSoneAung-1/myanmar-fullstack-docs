---
title: "preload"
description: "Stylesheet, font, external script စတဲ့ သင်သုံးမယ့် resource တစ်ခုကို ကြိုတင် (eagerly) fetch လုပ်ရန် browser ကို အချက်ပြပေးတဲ့ react-dom API — as/crossOrigin/referrerPolicy/integrity/type/nonce/fetchPriority/imageSrcSet/imageSizes options များ၊ script/stylesheet/font/image preloading နမူနာများနဲ့ caveats"
order: 100
source: "https://react.dev/reference/react-dom/preload"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** [React-based frameworks](https://react.dev/learn/creating-a-react-app) တွေက resource loading ကို သင့်အတွက် မကြာခဏ ကိုင်တွယ်ပေးတတ်လို့ — ဒီ API ကို ကိုယ်တိုင် ခေါ်စရာ မလိုတာမျိုး ဖြစ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် သင့် framework ရဲ့ documentation ကို တိုင်ပင်ပါ။

`preload` က stylesheet၊ font ဒါမှမဟုတ် external script လို — သင် သုံးဖို့ မျှော်လင့်ထားတဲ့ resource တစ်ခုကို စောစီးစွာ (eagerly) fetch လုပ်နိုင်စေပါတယ်။

```js
preload("https://example.com/font.woff2", {as: "font"});
```

## ရည်ညွှန်းချက် (Reference)

### `preload(href, options)`

Resource တစ်ခုကို preload လုပ်ဖို့ — `react-dom` ကနေ `preload` function ကို ခေါ်ပါ:

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

`preload` function က — ပေးထားတဲ့ resource ကို download လုပ်တာ စတင်သင့်တယ်ဆိုတဲ့ hint တစ်ခုကို browser ကို ပေးပါတယ် — ဒါက အချိန်ကုန်သက်သာစေနိုင်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `href`: string တစ်ခု။ သင်က download လုပ်ချင်တဲ့ resource ရဲ့ URL။
- `options`: object တစ်ခု။ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:
  - `as`: မဖြစ်မနေ လိုအပ်တဲ့ string တစ်ခု။ Resource ရဲ့ အမျိုးအစား။ သူ့ရဲ့ [ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker` တွေပါ။
  - `crossOrigin`: string တစ်ခု။ သုံးမယ့် [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `anonymous` နဲ့ `use-credentials` ပါ။ `as` ကို `"fetch"` လို့ သတ်မှတ်ထားရင် — မဖြစ်မနေ လိုအပ်ပါတယ်။
  - `referrerPolicy`: string တစ်ခု။ Fetch လုပ်တဲ့အခါ ပို့မယ့် [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin` နဲ့ `unsafe-url` တွေပါ။
  - `integrity`: string တစ်ခု။ [သူ့ရဲ့ စစ်မှန်မှုကို verify လုပ်ဖို့](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) — resource ရဲ့ cryptographic hash တစ်ခု။
  - `type`: string တစ်ခု။ Resource ရဲ့ MIME type။
  - `nonce`: string တစ်ခု။ တင်းကျပ်တဲ့ Content Security Policy တစ်ခု သုံးနေတဲ့အခါ [resource ကို ခွင့်ပြုပေးဖို့](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cryptographic nonce တစ်ခု။
  - `fetchPriority`: string တစ်ခု။ Resource ကို fetch လုပ်တာအတွက် နှိုင်းရ ဦးစားပေးမှု (relative priority) တစ်ခုကို အကြံပြုပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `auto` (default), `high` နဲ့ `low` ပါ။
  - `imageSrcSet`: string တစ်ခု။ `as: "image"` နဲ့တွဲမှသာ သုံးပါတယ်။ [Image ရဲ့ source set](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) ကို သတ်မှတ်ပါတယ်။
  - `imageSizes`: string တစ်ခု။ `as: "image"` နဲ့တွဲမှသာ သုံးပါတယ်။ [Image ရဲ့ sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) ကို သတ်မှတ်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`preload` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `preload` call တွေ တူညီညီမျှ (equivalent) ဖြစ်တာ အကြိမ်ကြိမ် ခေါ်တာက — တစ်ကြိမ်တည်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။ အောက်ပါ စည်းမျဉ်းတွေအတိုင်း `preload` call တွေကို equivalent အဖြစ် သတ်မှတ်ပါတယ်:
  - `href` တူညီရင် — call နှစ်ခုက equivalent ဖြစ်ပါတယ်၊ ဒါပေမယ့်:
  - `as` ကို `image` လို့ သတ်မှတ်ထားရင် — `href`, `imageSrcSet` နဲ့ `imageSizes` တွေ တူညီမှသာ call နှစ်ခု equivalent ဖြစ်ပါတယ်။
- Browser ထဲမှာ — `preload` ကို ဘယ်အခြေအနေမှာမဆို ခေါ်နိုင်ပါတယ်: component တစ်ခုကို render လုပ်နေစဉ်၊ Effect တစ်ခုအတွင်း၊ event handler တစ်ခုအတွင်း စသဖြင့်ပါ။
- Server-side rendering ဒါမှမဟုတ် Server Components တွေကို render လုပ်တဲ့အခါမှာ — `preload` က component တစ်ခုကို render လုပ်နေစဉ် ဒါမှမဟုတ် component တစ်ခုကို render လုပ်တာကနေ စတင်တဲ့ async context တစ်ခုအတွင်းမှာ ခေါ်မှသာ အကျိုးသက်ရောက်မှု ရှိပါတယ်။ တခြား call တွေကတော့ လျစ်လျူရှုခံရပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### Render လုပ်ချိန်မှာ preload လုပ်ခြင်း

Component တစ်ခု ဒါမှမဟုတ် သူ့ရဲ့ children တွေက တိကျတဲ့ resource တစ်ခုကို သုံးမယ်ဆိုတာ သိရင် — component ကို render လုပ်နေစဉ်မှာ `preload` ကို ခေါ်ပါ။

#### External script တစ်ခုကို preload လုပ်ခြင်း

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Browser ကို script ချက်ချင်း execute လုပ်စေချင်ရင် (download လုပ်တာပဲ မဟုတ်ဘဲ) — [`preinit`](/docs/react/preinit) ကို သုံးပါ။ ESM module တစ်ခုကို load လုပ်ချင်ရင် — [`preloadModule`](/docs/react/preload-module) ကို သုံးပါ။

#### Stylesheet တစ်ခုကို preload လုပ်ခြင်း

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Stylesheet ကို document ထဲကို ချက်ချင်း ထည့်သွင်းစေချင်ရင် (ဆိုလိုတာက browser က download လုပ်တာပဲ မဟုတ်ဘဲ — ချက်ချင်း parse လုပ်တာ စတင်စေချင်ရင်) — [`preinit`](/docs/react/preinit) ကို သုံးပါ။

#### Font တစ်ခုကို preload လုပ်ခြင်း

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Stylesheet တစ်ခုကို preload လုပ်ရင် — အဲဒီ stylesheet က ရည်ညွှန်းထားတဲ့ fonts တွေကိုပါ preload လုပ်ထားတာ ဉာဏ်ကောင်းပါတယ်။ အဲဒီလိုဆို — stylesheet ကို download လုပ်ပြီး parse မလုပ်ရသေးခင် — browser က font ကို download စနိုင်ပါတယ်။

#### Image တစ်ခုကို preload လုပ်ခြင်း

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Image တစ်ခုကို preload လုပ်တဲ့အခါ — `imageSrcSet` နဲ့ `imageSizes` options တွေက — [screen ရဲ့ အရွယ်အစားနဲ့ ကိုက်ညီတဲ့ image ကို မှန်ကန်တဲ့ အရွယ်နဲ့ fetch လုပ်ဖို့](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) browser ကို ကူညီပေးပါတယ်။

### Event handler တစ်ခုအတွင်းမှာ preload လုပ်ခြင်း

External resources တွေ လိုအပ်မယ့် page ဒါမှမဟုတ် state တစ်ခုဆီ မပြောင်းခင် — event handler တစ်ခုအတွင်းမှာ `preload` ကို ခေါ်ပါ။ ဒါက page ဒါမှမဟုတ် state အသစ်ကို render လုပ်ချိန်မှာ ခေါ်တာထက် — လုပ်ငန်းစဉ်ကို ပိုစောပြီး စတင်စေပါတယ်။

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
