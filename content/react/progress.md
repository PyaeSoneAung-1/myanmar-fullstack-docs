---
title: "progress"
description: "Progress indicator (တိုးတက်မှု အညွှန်း) တစ်ခု render လုပ်ပေးတဲ့ built-in `<progress>` component — max နဲ့ value props (value ကို 0–max ကြား ဒါမှမဟုတ် indeterminate state အတွက် null ပေးခြင်း)"
order: 79
source: "https://react.dev/reference/react-dom/components/progress"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<progress>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) က — progress indicator (တိုးတက်မှု အညွှန်း) တစ်ခုကို render လုပ်နိုင်စေပါတယ်။

```js
<progress value={0.5} />
```

## ရည်ညွှန်းချက် (Reference)

### `<progress>`

Progress indicator တစ်ခု ပြသဖို့ — [browser ရဲ့ built-in `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) component ကို render လုပ်ပါ။

```js
<progress value={0.5} />
```

#### Props

`<progress>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

ဒါ့အပြင် `<progress>` က ဒီ props တွေကိုပါ ထောက်ပံ့ပါတယ်:

- [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): Number တစ်ခု။ `value` ရဲ့ အများဆုံး တန်ဖိုးကို သတ်မှတ်ပါတယ်။ Default က `1` ပါ။
- [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): `0` နဲ့ `max` ကြားက number တစ်ခု — ဒါမှမဟုတ် indeterminate progress အတွက် `null`။ ဘယ်လောက် ပြီးမြောက်ပြီလဲ သတ်မှတ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Progress indicator တစ်ခုကို control လုပ်ခြင်း

Progress indicator တစ်ခု ပြသဖို့ — `<progress>` component တစ်ခုကို render လုပ်ပါ။ သင်သတ်မှတ်လိုက်တဲ့ `max` တန်ဖိုးနဲ့ `0` ကြားက number `value` တစ်ခုကို ပေးနိုင်ပါတယ်။ `max` တန်ဖိုး မပေးထားရင် — default အနေနဲ့ `1` လို့ ယူဆပါတယ်။

Operation တစ်ခု လက်ရှိ မလုပ်ဆောင်နေဘူးဆိုရင် — progress indicator ကို indeterminate state တစ်ခုထဲ ရောက်စေဖို့ `value={null}` ပေးပါ။

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```
