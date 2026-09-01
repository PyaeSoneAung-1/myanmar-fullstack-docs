---
title: "UI ဖော်ပြခြင်း"
description: "Component တွေကို import/export လုပ်ခြင်း၊ JSX စည်းမျဉ်းတွေ၊ curly braces နဲ့ JavaScript သုံးခြင်း — props မိတ်ဆက်"
order: 2
source: "https://react.dev/learn/describing-the-ui"
status: translated
updated: 2026-09-01
---

## Component တွေကို ပြန်သုံးခြင်း

React app ရဲ့ UI တစ်ခုလုံးကို component တွေနဲ့ တည်ဆောက်တယ်ဆိုတာ [React မိတ်ဆက်](/docs/react/getting-started) မှာ မြင်ခဲ့ရပြီးပါပြီ။ Component ဆိုတာ markup ပါတဲ့ JavaScript function ဖြစ်ပြီး — တစ်ခါ ရေးထားရင် နေရာမျိုးစုံမှာ အကြိမ်ကြိမ် ပြန်သုံးလို့ရပါတယ်။ ဥပမာ — `Profile` component တစ်ခုကို သတ်မှတ်ပြီး `Gallery` ထဲမှာ သုံးကြိမ် ဆက်တိုက် သုံးထားတာကို ကြည့်ပါ:

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

သတိထားရမယ့် အချက် — React component နာမည်တွေက **capital letter (PascalCase)** နဲ့ စရပါမယ် — `Profile` လိုမျိုးပါ။ HTML tag တွေကတော့ lowercase (`<section>`, `<img>`) ဖြစ်ပါတယ်။ Component တစ်ခုက နောက် component တွေကို သူ့ရဲ့ output ထဲမှာ render လုပ်လို့ရပါတယ် — ဒါကြောင့် component တစ်ခုကို နေရာမျိုးစုံမှာ ပြန်သုံးပြီး ရှုပ်ထွေးတဲ့ UI တွေကို အပေါ်ကနေ အောက်ကို ဆောက်သွားနိုင်ပါတယ်။ Component တွေကို ထည့်သုံးတဲ့ component ကို **parent component** လို့ ခေါ်ပြီး — ဒီဥပမာမှာ `Gallery` က parent, `Profile` က child ပါ။

Component ကို အသုံးပြုဖို့ — သတ်မှတ်တဲ့ file ထဲမှာ **export** လုပ်ပြီး သုံးမယ့်နေရာမှာ **import** လုပ်ရပါတယ်။ File တွေ ခွဲထားရင် ဒီလိုမျိုးပါ:

```jsx
// Gallery.js — component ကို export လုပ်ခြင်း
export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}

// App.js — အခြား file ကနေ import လုပ်ခြင်း
import Gallery from './Gallery.js';

export default function App() {
  return <Gallery />;
}
```

Component တစ်ခုလျှင် file တစ်ခု ခွဲထားတာက project ကြီးတွေမှာ စုစည်းမှု ကောင်းစေပြီး — ပြန်သုံးလို့လည်း လွယ်ပါတယ်။ `export default` အပြင် named export (`export function Gallery() {}`) နဲ့လည်း export လုပ်ပြီး `import { Gallery } from './Gallery.js'` လိုမျိုး import လုပ်လို့ရပါတယ်။

## JSX ရဲ့ စည်းမျဉ်းတွေ

JSX က HTML နဲ့ ဆင်ပေမယ့် လိုက်နာရမယ့် စည်းမျဉ်း သုံးခု ရှိပါတယ် — (၁) Component က **root element တစ်ခုတည်း** ပြန်ပေးရမယ် (ဒါမှမဟုတ် `<>...</>` fragment ကို သုံးနိုင်တယ်)၊ (၂) Tag တိုင်းကို **ပိတ်ရမယ်** — `<img />` လို self-closing လုပ်နိုင်တယ်၊ (၃) Attribute တွေက **camelCase** နဲ့ ရေးရမယ် — HTML ရဲ့ `class` အစား `className`၊ `tabindex` အစား `tabIndex` စသဖြင့်ပါ။ JSX က HTML ထက် ပိုတင်းကျပ်တဲ့ markup ရေးနည်းတစ်ခုဖြစ်ပြီး — စည်းမျဉ်း ချိုးရင် compile error ရပါတယ်:

```jsx
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    className="photo"
  />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</div>
```

## Curly Braces နဲ့ JavaScript သုံးခြင်း

JSX ရဲ့ အားသာချက်က — `{}` (curly braces) ထဲမှာ **JavaScript expression တွေကို တိုက်ရိုက် ထည့်လို့ရတာ** ပါ။ Curly braces ကို နေရာ နှစ်မျိုးမှာ သုံးပါတယ် — (၁) JSX text ထဲမှာ `{person.name}` လိုမျိုး၊ (၂) attribute ရဲ့ `=` နောက်မှာ `src={...}` လိုမျိုးပါ။ Variable, function call, object property စသဖြင့် ဘာမဆို ထည့်နိုင်ပြီး — attribute မှာ quotes သုံးရင်တော့ string literal ဖြစ်သွားတာမို့ သတိထားပါ:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

`{person.name}` က object ထဲက တန်ဖိုးကို ဆွဲထုတ်ပြီး `style={person.theme}` က object တစ်ခုလုံးကို attribute အဖြစ် ပေးလိုက်တာပါ။ Object ကို JSX ထဲမှာ တိုက်ရိုက် ရေးချင်ရင်တော့ curly braces **နှစ်ထပ်** သုံးရပါတယ် — `style={{ color: 'pink' }}` လိုမျိုးပါ။

## Props — မိတ်ဆက်

Component တစ်ခုကနေ နောက်တစ်ခုကို data ပို့ဖို့ **props** (properties) ကို သုံးပါတယ် — HTML attribute နဲ့ ဆင်တူပြီး component ကို သုံးတဲ့အခါ data ကို ပေးလိုက်ရပါတယ်။ Built-in element တွေမှာတောင် props တွေ ရှိပြီးသားပါ — `<img>` မှာ `src`, `alt`, `width` ပေးသလိုမျိုး ကိုယ်ပိုင် component တွေကိုလည်း props နဲ့ data ပေးလို့ရပါတယ်။ ဒီစာမျက်နှာမှာ မိတ်ဆက်ပဲ ပြပါမယ် — အသေးစိတ်ကို နောက်စာမျက်နှာမှာ ဆက်လေ့လာပါမယ်။

## နောက်တစ်ဆင့်တွေ

- [Props ပေးပို့ခြင်း](/docs/react/props) — component တွေကြား data စီးဆင်းမှု
- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) — user interaction တွေကို ကိုင်တွယ်ခြင်း
