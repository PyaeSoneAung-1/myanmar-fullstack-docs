---
title: "renderToStaticMarkup"
description: "Non-interactive React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ပေးတဲ့ react-dom/server API — hydrate လုပ်လို့မရတဲ့ static HTML (emails စသည်) အတွက် သင့်တော်သည်; parameters/returns/caveats များနဲ့ သုံးပုံ"
order: 91
source: "https://react.dev/reference/react-dom/server/renderToStaticMarkup"
status: translated
updated: 2026-09-02
---

`renderToStaticMarkup` က non-interactive React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ပါတယ်။

```js
const html = renderToStaticMarkup(reactNode, options?)
```

## ရည်ညွှန်းချက် (Reference)

### `renderToStaticMarkup(reactNode, options?)`

Server ပေါ်မှာ — သင့် app ကို HTML အဖြစ် render လုပ်ဖို့ `renderToStaticMarkup` ကို ခေါ်ပါ:

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

ဒါက သင့် React components တွေရဲ့ non-interactive HTML output ကို ထုတ်ပေးပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `reactNode`: HTML အဖြစ် render လုပ်ချင်တဲ့ React node တစ်ခု။ ဥပမာ — `<Page />` လို JSX node တစ်ခု။
- **optional** `options`: Server render အတွက် option တွေ ပါတဲ့ object တစ်ခု။
  - **optional** `identifierPrefix`: [`useId`](/docs/react/use-id) က generate လုပ်တဲ့ IDs တွေအတွက် React သုံးမယ့် string prefix တစ်ခု။ Page တစ်ခုတည်းမှာ roots အများကြီး သုံးတဲ့အခါ conflicts တွေ ရှောင်ရှားဖို့ အသုံးဝင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

HTML string တစ်ခု ဖြစ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `renderToStaticMarkup` ရဲ့ output ကို hydrate လုပ်လို့ မရပါဘူး။
- `renderToStaticMarkup` မှာ Suspense support အကန့်အသတ်ပဲ ရှိပါတယ်။ Component တစ်ခု suspend ဖြစ်ရင် — `renderToStaticMarkup` က fallback ကို HTML အဖြစ် ချက်ချင်း ပို့လိုက်ပါတယ်။
- `renderToStaticMarkup` က browser ထဲမှာလည်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် client code ထဲမှာ သုံးတာကိုတော့ မအကြံပြုပါဘူး။ Browser ထဲမှာ component တစ်ခုကို HTML အဖြစ် render လုပ်ချင်ရင် — [DOM node တစ်ခုထဲ render လုပ်ပြီး HTML ကို ရယူပါ](/docs/react/render-to-string)။

## အသုံးပြုပုံ (Usage)

### Non-interactive React tree တစ်ခုကို HTML string အဖြစ် render လုပ်ခြင်း

သင့် app ကို HTML string အဖြစ် render လုပ်ဖို့ `renderToStaticMarkup` ကို ခေါ်ပါ — ပြီးရင် အဲဒီ string ကို သင့် server response နဲ့အတူ ပို့နိုင်ပါတယ်:

```js
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

ဒါက သင့် React components တွေရဲ့ ကနဦး non-interactive HTML output ကို ထုတ်ပေးပါတယ်။

> **သတိပြုရန်:** ဒီ method က **hydrate လုပ်လို့မရတဲ့ non-interactive HTML** ကို render လုပ်ပေးပါတယ်။ React ကို static page generator အရိုးရှင်းတစ်ခုအနေနဲ့ သုံးချင်ရင် (သို့) emails လို လုံးဝ static content တွေကို render လုပ်နေရင် အသုံးဝင်ပါတယ်။
>
> Interactive apps တွေကတော့ — server ပေါ်မှာ [`renderToString`](/docs/react/render-to-string) ကို သုံးပြီး client ပေါ်မှာ [`hydrateRoot`](/docs/react/hydrate-root) ကို သုံးရပါမယ်။
