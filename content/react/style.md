---
title: "style"
description: "Document ထဲကို inline CSS stylesheets တွေ ထည့်ဖို့ built-in `<style>` component — `href` + `precedence` props ပေးထားရင် `<head>` ထဲ ရွှေ့ပြီး တူညီတဲ့ styles တွေကို လျော့ပေါင်းစု (de-duplicate) လုပ်ကာ load ချိန်မှာ suspend ဖြစ်စေခြင်း"
order: 84
source: "https://react.dev/reference/react-dom/components/style"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) က — သင့် document ထဲကို inline CSS stylesheets တွေ ထည့်နိုင်စေပါတယ်။

```js
<style>{` p { color: red; } `}</style>
```

## ရည်ညွှန်းချက် (Reference)

### `<style>`

Document ထဲကို inline styles တွေ ထည့်ဖို့ — [browser ရဲ့ built-in `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) ကို render လုပ်ပါ။ `<style>` ကို component ဘယ်ကနေမဆို render လုပ်လို့ရပြီး — React က (အချို့သော case တွေမှာ) သက်ဆိုင်ရာ DOM element ကို document head ထဲမှာ နေရာချပြီး — ထပ်တူကျတဲ့ styles တွေကို လျော့ပေါင်းစုပေးပါတယ်။

```js
<style>{` p { color: red; } `}</style>
```

#### Props

`<style>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

- `children`: string တစ်ခု၊ **လိုအပ်ပါတယ်**။ Stylesheet ရဲ့ အတွင်းအကြောင်းအရာ။
- `precedence`: string တစ်ခု။ `<style>` DOM node ကို document `<head>` ထဲက တခြား nodes တွေနဲ့ ယှဉ်ရင် ဘယ်နေရာမှာ ရပ်တည်စေရမလဲ React ကို ပြောပြပြီး — ဘယ် stylesheet က ဘယ်ဟာကို override လုပ်နိုင်လဲ ဆုံးဖြတ်ပါတယ်။ React က ပထမဆုံး တွေ့ရှိတဲ့ precedence values တွေကို "အနိမ့်" လို့လည်းကောင်း၊ နောက်မှ တွေ့ရှိတဲ့ဟာတွေကို "အမြင့်" လို့လည်းကောင်း မှတ်ယူပါတယ်။ Style rules တွေက atomic (သီးခြားစီ) ဖြစ်လို့ — style system တော်တော်များများက precedence value တစ်ခုတည်းနဲ့တင် အဆင်ပြေစွာ အလုပ်လုပ်နိုင်ပါတယ်။ Precedence တူတဲ့ stylesheets တွေက `<link>` ဖြစ်ဖြစ်၊ inline `<style>` tags ဖြစ်ဖြစ်၊ [`preinit`](https://react.dev/reference/react-dom/preinit) functions နဲ့ load လုပ်တာဖြစ်ဖြစ် — အတူတကွ စုစည်းခံရပါတယ်။
- `href`: string တစ်ခု။ `href` တူတဲ့ styles တွေကို လျော့ပေါင်းစုနိုင်အောင် React ကို ခွင့်ပြုပါတယ်။
- `media`: string တစ်ခု။ Stylesheet ကို သတ်မှတ်ထားတဲ့ [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) တစ်ခုအတွင်းမှာပဲ ကန့်သတ်ပါတယ်။
- `nonce`: string တစ်ခု။ တင်းကျပ်တဲ့ Content Security Policy သုံးတဲ့အခါ [resource ကို ခွင့်ပြုဖို့](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cryptographic nonce တစ်ခု။
- `title`: string တစ်ခု။ [Alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) တစ်ခုရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။

React နဲ့ သုံးဖို့ **အကြံမပြုတဲ့** props:

- `blocking`: string တစ်ခု။ `"render"` လို့ သတ်မှတ်ထားရင် — stylesheet load မပြီးမချင်း page ကို render မလုပ်ဖို့ browser ကို ညွှန်ကြားပါတယ်။ React က Suspense သုံးပြီး ပိုကောင်းမွန်တဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။

#### အထူး render ပြုလုပ်ပုံ (Special rendering behavior)

React က `<style>` components တွေကို document ရဲ့ `<head>` ထဲကို ရွှေ့ပြီး — ထပ်တူကျတဲ့ stylesheets တွေကို လျော့ပေါင်းစုကာ — stylesheet load လုပ်နေချိန်မှာ [suspend](/docs/react/suspense) ဖြစ်စေနိုင်ပါတယ်။

ဒီအပြုအမူကို ရွေးချယ်အသုံးပြုဖို့ — `href` နဲ့ `precedence` props တွေ ပေးပါ။ React က `href` တူတဲ့ styles တွေကို လျော့ပေါင်းစုပါလိမ့်မယ်။ `precedence` prop က — `<style>` DOM node ကို document `<head>` ထဲက တခြား nodes တွေနဲ့ ယှဉ်ရင် ဘယ်နေရာမှာ ရပ်တည်ရမလဲ React ကို ပြောပြပြီး — ဘယ် stylesheet က ဘယ်ဟာကို override လုပ်နိုင်လဲ ဆုံးဖြတ်ပါတယ်။

ဒီအထူး ပြုမူပုံမှာ သတိထားစရာ သုံးချက် ပါဝင်ပါတယ်:

- Style render ပြီးသွားရင် — props တွေ ပြောင်းလဲမှုတွေကို React က လျစ်လျူရှုပါတယ်။ (Development မှာ ဒါမျိုး ဖြစ်ရင် React က warning ထုတ်ပါတယ်။)
- `precedence` prop သုံးတဲ့အခါ — React က `href` နဲ့ `precedence` ကလွဲလို့ တခြား အပို props တွေကို အားလုံး ဖြုတ်ပစ်ပါတယ်။
- Style ကို render လုပ်ခဲ့တဲ့ component ကို unmount လုပ်ပြီးသွားရင်တောင် — React က style ကို DOM ထဲမှာ ချန်ထားနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Inline CSS stylesheet တစ်ခုကို render လုပ်ခြင်း

Component တစ်ခုက ကောင်းစွာ ပြသနိုင်ဖို့ CSS styles တချို့အပေါ် မှီခိုနေရင် — component အတွင်းမှာ inline stylesheet တစ်ခုကို render လုပ်နိုင်ပါတယ်။

`href` prop က stylesheet ကို တစ်မူထူးခြားစွာ ခွဲခြားသတ်မှတ်ပေးသင့်ပါတယ် — React က `href` တူတဲ့ stylesheets တွေကို လျော့ပေါင်းစုလို့ပါ။ `precedence` prop ပေးထားရင် — React က ဒီ values တွေ component tree ထဲမှာ ပေါ်လာတဲ့ အစီအစဉ်အတိုင်း inline stylesheets တွေကို ပြန်စီပေးပါတယ်။

Inline stylesheets တွေက load လုပ်နေချိန်မှာ Suspense boundaries တွေကို မစတင်ပါဘူး။ Fonts ဒါမှမဟုတ် images လို async resources တွေကို သူတို့က load လုပ်နေရင်တောင် ဖြစ်ပါတယ်။

ဒီဥပမာမှာ — `PieChart` component က သူ့ရဲ့ `colors` props ပေါ် မူတည်တဲ့ inline stylesheet တစ်ခုကို render လုပ်ပြီး — `useId` ကနေ ထုတ်ထားတဲ့ id နဲ့ CSS selectors တွေကို သီးသန့်ဖြစ်အောင် ပြုလုပ်ထားပါတယ်:

```js
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}
```
