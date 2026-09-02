---
title: "title"
description: "Document ရဲ့ ခေါင်းစဉ် (title) သတ်မှတ်ဖို့ built-in `<title>` component — `<head>` ထဲ အလိုအလျောက် နေရာချပေးခြင်း၊ children က text string တစ်ခုတည်း ဖြစ်ရန် လိုအပ်ချက်နဲ့ `<svg>`/`itemProp` ခြွင်းချက်များ"
order: 81
source: "https://react.dev/reference/react-dom/components/title"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) က — document ရဲ့ ခေါင်းစဉ်ကို သတ်မှတ်နိုင်စေပါတယ်။

```js
<title>My Blog</title>
```

## ရည်ညွှန်းချက် (Reference)

### `<title>`

Document ရဲ့ ခေါင်းစဉ် သတ်မှတ်ဖို့ — [browser ရဲ့ built-in `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) ကို render လုပ်ပါ။ `<title>` ကို component ဘယ်ကနေမဆို render လုပ်လို့ရပြီး — React က သက်ဆိုင်ရာ DOM element ကို document head ထဲမှာ အမြဲ နေရာချပေးပါတယ်။

```js
<title>My Blog</title>
```

#### Props

`<title>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

- `children`: `<title>` က child အဖြစ် **text ကိုပဲ** လက်ခံပါတယ်။ ဒီ text က document ရဲ့ ခေါင်းစဉ် ဖြစ်လာပါမယ်။ Text ကိုပဲ render လုပ်သရွေ့ — ကိုယ်ပိုင် components တွေကိုလည်း ပေးနိုင်ပါတယ်။

#### အထူး render ပြုလုပ်ပုံ (Special rendering behavior)

`<title>` component ကို React tree ရဲ့ ဘယ်နေရာမှာပဲ render လုပ်လုပ် — React က သူနဲ့ ကိုက်ညီတဲ့ DOM element ကို document ရဲ့ `<head>` အတွင်းမှာ အမြဲ နေရာချပါတယ်။ DOM ထဲမှာ `<title>` နေထိုင်လို့ရတဲ့ တစ်ခုတည်းသော နေရာက `<head>` ဖြစ်ပေမယ့် — page တစ်ခုကို ကိုယ်စားပြုတဲ့ component က သူ့ရဲ့ `<title>` ကို ကိုယ်တိုင် render လုပ်နိုင်တာက အဆင်ပြေပြီး composable ဖြစ်စေပါတယ်။ ခြွင်းချက်နှစ်ခု ရှိပါတယ်:

- `<title>` က `<svg>` component တစ်ခုရဲ့ အတွင်းမှာ ဆိုရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီနေရာမှာ သူက document ရဲ့ ခေါင်းစဉ်ကို ကိုယ်စားမပြုဘဲ [အဲဒီ SVG graphic အတွက် accessibility မှတ်ချက်](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) တစ်ခုပဲ ဖြစ်လို့ပါ။
- `<title>` မှာ [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop ရှိရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီကိစ္စမှာ document ရဲ့ ခေါင်းစဉ်ကို ကိုယ်စားမပြုဘဲ page ရဲ့ သီးခြားအပိုင်းတစ်ခုအကြောင်း metadata ကို ကိုယ်စားပြုလို့ပါ။

> **သတိပြုရန်:** တစ်ချိန်တည်းမှာ `<title>` တစ်ခုတည်းကိုပဲ render လုပ်ပါ။ Components တစ်ခုထက်ပိုပြီး `<title>` tag တွေကို တစ်ပြိုင်နက် render လုပ်ရင် — React က အဲဒီ titles တွေအားလုံးကို document head ထဲမှာ နေရာချပါလိမ့်မယ်။ အဲဒီလို ဖြစ်တဲ့အခါ browsers နဲ့ search engines တွေရဲ့ အပြုအမူက သတ်မှတ်မထားပါဘူး။

## အသုံးပြုပုံ (Usage)

### Document title သတ်မှတ်ခြင်း

`<title>` component ကို — text ကို children အဖြစ်နဲ့ component ဘယ်ကနေမဆို render လုပ်ပါ။ React က `<title>` DOM node တစ်ခုကို document ရဲ့ `<head>` ထဲမှာ ထားပေးပါလိမ့်မယ်:

```js
export default function ContactUsPage() {
  return (
    <>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </>
  );
}
```

### Title ထဲမှာ variables တွေ သုံးခြင်း

`<title>` component ရဲ့ children က — text string တစ်ခုတည်း ဖြစ်ရပါမယ်။ (ဒါမှမဟုတ် number တစ်ခုတည်း ဒါမှမဟုတ် `toString` method ရှိတဲ့ object တစ်ခုတည်း။) ရှင်းရှင်းလင်းလင်း မသိသာပေမယ့် — JSX curly braces တွေကို ဒီလို သုံးလိုက်ရင်:

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: ဒါက string တစ်ခုတည်း မဟုတ်ပါဘူး
```

...တကယ်တော့ `<title>` component က children အဖြစ် element နှစ်ခု ပါတဲ့ array တစ်ခုကို ရရှိသွားပါတယ် (string `"Results page"` နဲ့ `pageNumber` ရဲ့ တန်ဖိုး)။ ဒါက error ဖြစ်စေပါလိမ့်မယ်။ အဲဒီအစား — `<title>` ဆီ string တစ်ခုတည်း ပေးဖို့ string interpolation ကို သုံးပါ:

```js
<title>{`Results page ${pageNumber}`}</title>
```
