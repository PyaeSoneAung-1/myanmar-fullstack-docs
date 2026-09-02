---
title: "option"
description: "Select box အတွင်းမှာ option တစ်ခုကို render လုပ်ပေးတဲ့ built-in `<option>` component — disabled/label/value props နဲ့ `selected` attribute ကို React က support မလုပ်ကြောင်း (parent select ရဲ့ defaultValue/value ကို သုံးရခြင်း)"
order: 78
source: "https://react.dev/reference/react-dom/components/option"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) က — [`<select>`](/docs/react/select) box တစ်ခုအတွင်းမှာ option တစ်ခုကို render လုပ်နိုင်စေပါတယ်။

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

## ရည်ညွှန်းချက် (Reference)

### `<option>`

[Browser ရဲ့ built-in `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) က — [`<select>`](/docs/react/select) box တစ်ခုအတွင်းမှာ option တစ်ခုကို render လုပ်နိုင်စေပါတယ်။

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

#### Props

`<option>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

ဒါ့အပြင် `<option>` က ဒီ props တွေကိုပါ ထောက်ပံ့ပါတယ်:

- [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Boolean တစ်ခု။ `true` ဆိုရင် — option ကို ရွေးလို့ မရတော့ဘဲ မှိန်ပြီး ပေါ်ပါတယ်။
- [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): String တစ်ခု။ Option ရဲ့ အဓိပ္ပာယ်ကို သတ်မှတ်ပါတယ်။ မသတ်မှတ်ထားရင် — option အတွင်းက text ကို သုံးပါတယ်။
- [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): ဒီ option ကို ရွေးထားရင် — [form တစ်ခုထဲမှာ parent `<select>` ကို submit လုပ်တဲ့အခါ](/docs/react/select) သုံးမယ့် တန်ဖိုး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- React က `<option>` ပေါ်က `selected` attribute ကို support မလုပ်ပါဘူး။ အစား — uncontrolled select box တစ်ခုအတွက် ဒီ option ရဲ့ `value` ကို parent [`<select defaultValue>`](/docs/react/select) ဆီ ပေးပါ၊ ဒါမှမဟုတ် controlled select တစ်ခုအတွက် [`<select value>`](/docs/react/select) ဆီ ပေးပါ။

## အသုံးပြုပုံ (Usage)

### Options တွေနဲ့အတူ select box တစ်ခု ပြသခြင်း

Select box တစ်ခု ပြသဖို့ — `<option>` components စာရင်းတစ်ခုကို အတွင်းမှာ ထည့်ထားတဲ့ `<select>` တစ်ခုကို render လုပ်ပါ။ `<option>` တစ်ခုချင်းစီကို — form နဲ့အတူ submit လုပ်မယ့် data ကို ကိုယ်စားပြုတဲ့ `value` တစ်ခု ပေးပါ။

[`<select>` တစ်ခုကို `<option>` components စာရင်းတွေနဲ့ ပြသခြင်းအကြောင်း ပိုဖတ်ရန်](/docs/react/select)။

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```
