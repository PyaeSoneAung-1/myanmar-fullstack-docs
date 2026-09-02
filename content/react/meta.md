---
title: "meta"
description: "Document ကို metadata (keywords, description, author စသည်) ထည့်ဖို့ built-in `<meta>` component — `name`/`charset`/`httpEquiv`/`itemProp` ထဲက တစ်ခုတည်း ရွေးရန် လိုအပ်ချက်နဲ့ `<head>` ထဲ အလိုအလျောက် နေရာချပေးပုံ"
order: 83
source: "https://react.dev/reference/react-dom/components/meta"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) က — document ကို metadata တွေ ထည့်နိုင်စေပါတယ်။

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

## ရည်ညွှန်းချက် (Reference)

### `<meta>`

Document metadata ထည့်ဖို့ — [browser ရဲ့ built-in `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) ကို render လုပ်ပါ။ `<meta>` ကို component ဘယ်ကနေမဆို render လုပ်လို့ရပြီး — React က သက်ဆိုင်ရာ DOM element ကို document head ထဲမှာ အမြဲ နေရာချပေးပါတယ်။

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

#### Props

`<meta>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

အောက်ပါ props တွေထဲက — `name`၊ `httpEquiv`၊ `charset`၊ `itemProp` — **တစ်ခုတည်း အတိအကျ** ရှိရပါမယ်။ ဘယ် prop ကို သတ်မှတ်ထားလဲပေါ် မူတည်ပြီး `<meta>` component က မတူညီတဲ့ အလုပ်တွေ လုပ်ပါတယ်။

- `name`: string တစ်ခု။ Document ဆီ တွဲချင်တဲ့ [metadata အမျိုးအစား](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) ကို သတ်မှတ်ပါတယ်။
- `charset`: string တစ်ခု။ Document သုံးတဲ့ character set ကို သတ်မှတ်ပါတယ်။ တစ်ခုတည်းသော တရားဝင်တန်ဖိုးက `"utf-8"` ပါ။
- `httpEquiv`: string တစ်ခု။ Document ကို process လုပ်ဖို့ directive တစ်ခု သတ်မှတ်ပါတယ်။
- `itemProp`: string တစ်ခု။ Document တစ်ခုလုံးအကြောင်း မဟုတ်ဘဲ — document ထဲက သီးခြား item တစ်ခုအကြောင်း metadata ကို သတ်မှတ်ပါတယ်။
- `content`: string တစ်ခု။ `name` ဒါမှမဟုတ် `itemProp` props တွေနဲ့ တွဲသုံးရင် တွဲချင်တဲ့ metadata ကို သတ်မှတ်ပြီး — `httpEquiv` prop နဲ့ တွဲသုံးရင် directive ရဲ့ အပြုအမူကို သတ်မှတ်ပါတယ်။

#### အထူး render ပြုလုပ်ပုံ (Special rendering behavior)

`<meta>` component ကို React tree ရဲ့ ဘယ်နေရာမှာပဲ render လုပ်လုပ် — React က သူနဲ့ ကိုက်ညီတဲ့ DOM element ကို document ရဲ့ `<head>` အတွင်းမှာ အမြဲ နေရာချပါတယ်။ DOM ထဲမှာ `<meta>` နေထိုင်လို့ရတဲ့ တစ်ခုတည်းသော နေရာက `<head>` ဖြစ်ပေမယ့် — page တစ်ခုကို ကိုယ်စားပြုတဲ့ component က သူ့ရဲ့ `<meta>` components တွေကို ကိုယ်တိုင် render လုပ်နိုင်တာက အဆင်ပြေပြီး composable ဖြစ်စေပါတယ်။ ခြွင်းချက်တစ်ခု ရှိပါတယ်:

- `<meta>` မှာ [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop ရှိရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီကိစ္စမှာ document အကြောင်း metadata ကို ကိုယ်စားမပြုဘဲ page ရဲ့ သီးခြားအပိုင်းတစ်ခုအကြောင်း metadata ကို ကိုယ်စားပြုလို့ပါ။

## အသုံးပြုပုံ (Usage)

### Document ကို metadata တွေနဲ့ မှတ်သားခြင်း

Document ကို keywords, summary ဒါမှမဟုတ် author ရဲ့ နာမည်လို metadata တွေနဲ့ မှတ်သားနိုင်ပါတယ်။ React က ဒီ metadata တွေကို React tree ထဲ ဘယ်နေရာမှာပဲ render လုပ်လုပ် — document ရဲ့ `<head>` အတွင်းမှာ နေရာချပေးပါတယ်:

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

`<meta>` component ကို component ဘယ်ကနေမဆို render လုပ်နိုင်ပြီး — React က `<meta>` DOM node တစ်ခုကို document ရဲ့ `<head>` ထဲမှာ ထားပေးပါတယ်:

```js
export default function SiteMapPage() {
  return (
    <>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </>
  );
}
```

### Document ထဲက သီးခြား items တွေကို metadata တွေနဲ့ မှတ်သားခြင်း

`<meta>` component ကို `itemProp` prop နဲ့ သုံးပြီး — document ထဲက သီးခြား items တွေကို metadata တွေနဲ့ မှတ်သားနိုင်ပါတယ်။ ဒီကိစ္စမှာ React က ဒီမှတ်သားချက်တွေကို document `<head>` ထဲ မထည့်ဘဲ — တခြား React component တစ်ခုလိုပဲ နေရာချပါတယ်:

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
