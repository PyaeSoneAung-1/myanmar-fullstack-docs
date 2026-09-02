---
title: "input"
description: "Form inputs အမျိုးမျိုး (text, checkbox, radio စသည်) render လုပ်ပေးတဲ့ built-in `<input>` component — controlled (value/checked + onChange) နဲ့ uncontrolled (defaultValue/defaultChecked) သုံးပုံ၊ formAction စတဲ့ props များ"
order: 75
source: "https://react.dev/reference/react-dom/components/input"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<input>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) က — form inputs အမျိုးအစားမျိုးစုံကို render လုပ်နိုင်စေပါတယ်။

```js
<input />
```

## ရည်ညွှန်းချက် (Reference)

### `<input>`

Input တစ်ခု ပြသဖို့ — [browser ရဲ့ built-in `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) component ကို render လုပ်ပါ။

```js
<input name="myInput" />
```

#### Props

`<input>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

ဒီ prop တွေထဲက တစ်ခုကို ပေးခြင်းဖြင့် input ကို controlled ဖြစ်စေနိုင်ပါတယ်:

- [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Boolean တစ်ခု။ Checkbox input ဒါမှမဟုတ် radio button အတွက် — ရွေးချယ်ထားမထား သတ်မှတ်ပါတယ်။
- [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): String တစ်ခု။ Text input အတွက် — သူ့ရဲ့ text ကို control လုပ်ပါတယ်။ (Radio button အတွက်တော့ — သူ့ရဲ့ form data ကို သတ်မှတ်ပါတယ်။)

ဒီ props တွေထဲက တစ်ခုခု ပေးတဲ့အခါ — ပေးထားတဲ့ တန်ဖိုးကို update လုပ်ပေးမယ့် `onChange` handler တစ်ခုကိုပါ တစ်ပြိုင်နက် ပေးရပါမယ်။

ဒီ `<input>` props တွေက uncontrolled inputs တွေအတွက်သာ သက်ဆိုင်ပါတယ်:

- [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Boolean တစ်ခု။ `type="checkbox"` နဲ့ `type="radio"` inputs တွေရဲ့ ကနဦးတန်ဖိုးကို သတ်မှတ်ပါတယ်။
- [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): String တစ်ခု။ Text input တစ်ခုရဲ့ ကနဦးတန်ဖိုးကို သတ်မှတ်ပါတယ်။

ဒီ `<input>` props တွေက uncontrolled ရော controlled inputs တွေရော နှစ်မျိုးလုံးအတွက် သက်ဆိုင်ပါတယ်:

- [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): String တစ်ခု။ `type="file"` input တစ်ခုက လက်ခံမယ့် filetypes တွေကို သတ်မှတ်ပါတယ်။
- [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): String တစ်ခု။ `type="image"` input တစ်ခုရဲ့ သရုပ်ဖော် image text ကို သတ်မှတ်ပါတယ်။
- [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): String တစ်ခု။ `type="file"` input တစ်ခုက ဖမ်းယူမယ့် media (microphone, video, camera) ကို သတ်မှတ်ပါတယ်။
- [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): String တစ်ခု။ ဖြစ်နိုင်တဲ့ [autocomplete behaviors](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) တွေထဲက တစ်ခုကို သတ်မှတ်ပါတယ်။
- [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Boolean တစ်ခု။ `true` ဆိုရင် — React က element ကို mount ချိန်မှာ focus လုပ်ပါတယ်။
- [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): String တစ်ခု။ Element ရဲ့ directionality အတွက် form field name ကို သတ်မှတ်ပါတယ်။
- [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Boolean တစ်ခု။ `true` ဆိုရင် — input က interactive မဖြစ်တော့ဘဲ မှိန်ပြီး ပေါ်ပါတယ်။
- `children`: `<input>` က children တွေကို လက်မခံပါဘူး။
- [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): String တစ်ခု။ ဒီ input ပါဝင်တဲ့ `<form>` ရဲ့ `id` ကို သတ်မှတ်ပါတယ်။ မပေးထားရင် — အနီးဆုံး parent form ပါ။
- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): String ဒါမှမဟုတ် function တစ်ခု။ `type="submit"` နဲ့ `type="image"` တွေအတွက် parent `<form action>` ကို override လုပ်ပါတယ်။ URL ပေးလိုက်ရင် — form က standard HTML form တစ်ခုလို ပြုမူပြီး — function ပေးလိုက်ရင်တော့ အဲဒီ function က form submission ကို ကိုင်တွယ်ပါတယ်။ [`<form action>`](/docs/react/form) မှာ ကြည့်ပါ။
- [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): String တစ်ခု။ `type="submit"` နဲ့ `type="image"` တွေအတွက် parent `<form enctype>` ကို override လုပ်ပါတယ်။
- [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): String တစ်ခု။ `type="submit"` နဲ့ `type="image"` တွေအတွက် parent `<form method>` ကို override လုပ်ပါတယ်။
- [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): String တစ်ခု။ `type="submit"` နဲ့ `type="image"` တွေအတွက် parent `<form noValidate>` ကို override လုပ်ပါတယ်။
- [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): String တစ်ခု။ `type="submit"` နဲ့ `type="image"` တွေအတွက် parent `<form target>` ကို override လုပ်ပါတယ်။
- [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): String တစ်ခု။ `type="image"` input ရဲ့ image height ကို သတ်မှတ်ပါတယ်။
- [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): String တစ်ခု။ Autocomplete options တွေပါတဲ့ `<datalist>` ရဲ့ `id` ကို သတ်မှတ်ပါတယ်။
- [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Number တစ်ခု။ Numerical နဲ့ datetime inputs တွေရဲ့ အများဆုံး တန်ဖိုးကို သတ်မှတ်ပါတယ်။
- [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Number တစ်ခု။ Text နဲ့ တခြား inputs တွေရဲ့ အများဆုံး အလျားကို သတ်မှတ်ပါတယ်။
- [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Number တစ်ခု။ Numerical နဲ့ datetime inputs တွေရဲ့ အနည်းဆုံး တန်ဖိုးကို သတ်မှတ်ပါတယ်။
- [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Number တစ်ခု။ Text နဲ့ တခြား inputs တွေရဲ့ အနည်းဆုံး အလျားကို သတ်မှတ်ပါတယ်။
- [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Boolean တစ်ခု။ `type="file"` နဲ့ `type="email"` တွေအတွက် — values အများအပြား ခွင့်ပြုမပြု သတ်မှတ်ပါတယ်။
- [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String တစ်ခု။ ဒီ input ရဲ့ form နဲ့အတူ submit လုပ်မယ့် name ကို သတ်မှတ်ပါတယ်။
- `onChange`: [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Controlled inputs တွေအတွက် မဖြစ်မနေ လိုအပ်ပါတယ်။ User က input ရဲ့ value ကို ပြောင်းလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ် (ဥပမာ — key နှိပ်တိုင်း fire ပါတယ်)။ Browser ရဲ့ [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) လိုပဲ ပြုမူပါတယ်။
- `onChangeCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onChange` ရဲ့ version တစ်ခု။
- [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ User က value ကို ပြောင်းလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ်။ သမိုင်းကြောင်း အရ — React မှာ `onChange` ကို သုံးတာ ပုံမှန် ဖြစ်ပြီး အလားတူ အလုပ်လုပ်ပါတယ်။
- `onInputCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInput` ရဲ့ version တစ်ခု။
- [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Form submit လုပ်ချိန်မှာ input က validation မအောင်ရင် fire ပါတယ်။ Built-in `invalid` event နဲ့ မတူဘဲ — React ရဲ့ `onInvalid` event က bubble ဖြစ်ပါတယ်။
- `onInvalidCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInvalid` ရဲ့ version တစ်ခု။
- [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ `<input>` အတွင်းက selection ပြောင်းလဲပြီးချိန်မှာ fire ပါတယ်။ React က `onSelect` event ကို — selection အလွတ်တွေနဲ့ edits တွေ (selection ကို ထိခိုက်စေနိုင်တဲ့) အတွက်ပါ fire ဖြစ်အောင် တိုးချဲ့ပေးပါတယ်။
- `onSelectCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onSelect` ရဲ့ version တစ်ခု။
- [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): String တစ်ခု။ `value` က ကိုက်ညီရမယ့် pattern ကို သတ်မှတ်ပါတယ်။
- [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): String တစ်ခု။ Input value အလွတ်ဖြစ်ချိန်မှာ မှိန်ပြီး ပြသပါတယ်။
- [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Boolean တစ်ခု။ `true` ဆိုရင် — user က input ကို တည်းဖြတ်လို့ မရပါဘူး။
- [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Boolean တစ်ခု။ `true` ဆိုရင် — form submit ဖြစ်ဖို့ value ကို မဖြစ်မနေ ပေးရပါတယ်။
- [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Number တစ်ခု။ Width သတ်မှတ်တာနဲ့ ဆင်ပေမယ့် — unit က control အပေါ် မူတည်ပါတယ်။
- [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): String တစ်ခု။ `type="image"` input တစ်ခုရဲ့ image source ကို သတ်မှတ်ပါတယ်။
- [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Positive number တစ်ခု ဒါမှမဟုတ် `'any'` string တစ်ခု။ Valid values တွေကြားက အကွာအဝေးကို သတ်မှတ်ပါတယ်။
- [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): String တစ်ခု။ [Input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) တွေထဲက တစ်ခု။
- [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): String တစ်ခု။ `type="image"` input ရဲ့ image width ကို သတ်မှတ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Checkboxes တွေက `value` (ဒါမှမဟုတ် `defaultValue`) မဟုတ်ဘဲ — `checked` (ဒါမှမဟုတ် `defaultChecked`) ကို သုံးရပါတယ်။
- Text input တစ်ခုက string `value` prop တစ်ခု ရရှိရင် — controlled အဖြစ် သတ်မှတ်ခံရပါတယ်။
- Checkbox ဒါမှမဟုတ် radio button တစ်ခုက boolean `checked` prop တစ်ခု ရရှိရင် — controlled အဖြစ် သတ်မှတ်ခံရပါတယ်။
- Input တစ်ခုက တစ်ပြိုင်နက် controlled ရော uncontrolled ရော ဖြစ်လို့ မရပါဘူး။
- Input တစ်ခုက သူ့ရဲ့ lifetime အတွင်း controlled/uncontrolled အကြား ပြောင်းလဲလို့ မရပါဘူး။
- Controlled input တိုင်းမှာ — သူ့ရဲ့ backing value ကို synchronously update လုပ်ပေးတဲ့ `onChange` event handler တစ်ခု လိုအပ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Input အမျိုးအစားမျိုးစုံ ပြသခြင်း

Input တစ်ခု ပြသဖို့ — `<input>` component တစ်ခုကို render လုပ်ပါ။ ပုံမှန်အားဖြင့် text input တစ်ခု ဖြစ်ပါတယ်။ `type="checkbox"` ဆို checkbox တစ်ခု၊ `type="radio"` ဆို radio button တစ်ခု — [ဒါမှမဟုတ် တခြား input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) တွေ ပေးနိုင်ပါတယ်။

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

### Input တစ်ခုအတွက် label ပေးခြင်း

ပုံမှန်အားဖြင့် `<input>` တိုင်းကို [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag အတွင်းမှာ ထားပါတယ်။ ဒါက browser ကို ဒီ label က ဒီ input နဲ့ ဆက်စပ်ကြောင်း ပြောပြပြီး — user က label ကို နှိပ်လိုက်ရင် browser က input ကို အလိုအလျောက် focus လုပ်ပေးပါတယ်။ Accessibility အတွက်လည်း မရှိမဖြစ်ပါ — screen reader က input ကို focus လုပ်ချိန်မှာ label ရဲ့ စာသားကို ဖတ်ပြပေးလို့ပါ။

`<input>` ကို `<label>` ထဲမှာ ထည့်လို့မရရင် — `<input id>` နဲ့ [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) ကို id တစ်ခုတည်း ပေးပြီး ချိတ်ဆက်ပါ။ Component တစ်ခုရဲ့ instance အများကြီးကြားမှာ conflict မဖြစ်အောင် — အဲဒီလို ID ကို [`useId`](/docs/react/use-id) နဲ့ ထုတ်ပါ။

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

### Input အတွက် ကနဦးတန်ဖိုး (initial value) သတ်မှတ်ခြင်း

Input တိုင်းအတွက် ကနဦးတန်ဖိုးကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ Text inputs တွေအတွက် `defaultValue` string အဖြစ် ပေးပြီး — checkboxes နဲ့ radio buttons တွေကတော့ `defaultChecked` boolean နဲ့ သတ်မှတ်ရပါတယ်။

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

### Form submit လုပ်ချိန်မှာ input values ဖတ်ခြင်း

သင့် inputs တွေကို [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) တစ်ခုနဲ့ ထုပ်ပြီး — အတွင်းမှာ [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) တစ်ခု ထည့်ပါ။ ဒါဆိုရင် `<form onSubmit>` event handler ကို ခေါ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် browser က form data ကို လက်ရှိ URL ဆီ ပို့ပြီး page ကို refresh လုပ်ပါတယ် — `e.preventDefault()` ခေါ်ပြီး အဲဒီ အပြုအမူကို ကျော်လွှားနိုင်ပြီး — [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) နဲ့ form data ကို ဖတ်ပါတယ်။

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

> **မှတ်ချက်:** `<input>` တိုင်းကို `name` တစ်ခု ပေးပါ — ဥပမာ `<input name="firstName" defaultValue="Taylor" />`။ သင်ပေးထားတဲ့ `name` ကို form data ထဲမှာ key အဖြစ် သုံးပါတယ် — ဥပမာ `{ firstName: "Taylor" }`။

> **သတိပြုရန်:** `type` attribute မပါတဲ့ `<button>` တစ်ခုက `<form>` အတွင်းမှာ ရှိနေရင် — default အနေနဲ့ form ကို submit လုပ်ပါတယ်။ ဒါက မမျှော်လင့်ဘဲ ဖြစ်နိုင်ပါတယ်! ကိုယ်ပိုင် custom `Button` React component ရှိရင် — `<button>` (type မပါဘဲ) အစား [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) ကို သုံးစဉ်းစားပါ။ Form ကို submit စေချင်တဲ့ buttons တွေအတွက်တော့ ရှင်းရှင်းလင်းလင်း `<button type="submit">` ကို သုံးပါ။

### State variable နဲ့ input ကို control လုပ်ခြင်း

`<input />` လိုမျိုး input တစ်ခုက *uncontrolled* ပါ။ ကနဦးတန်ဖိုး တစ်ခု ပေးထားရင်တောင် — ဥပမာ `<input defaultValue="Initial text" />` — သင့် JSX က ကနဦးတန်ဖိုးကိုပဲ သတ်မှတ်ပေးတာ ဖြစ်ပြီး — လက်ရှိ တန်ဖိုးက ဘာဖြစ်သင့်လဲဆိုတာကို control မလုပ်ပါဘူး။

**_Controlled_ input တစ်ခု render လုပ်ဖို့ — `value` prop ကို ပေးပါ (checkbox/radio တွေအတွက်တော့ `checked`)။** React က input ကို သင်ပေးထားတဲ့ `value` အတိုင်း အမြဲ ဖြစ်နေအောင် အတင်းလုပ်ပါတယ်။ ပုံမှန်အားဖြင့် [state variable](/docs/react/use-state) တစ်ခု ကြေညာပြီး ဒီလို လုပ်ပါတယ်:

```js
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

Controlled input က state လိုအပ်နေပြီးသား ကိစ္စမှာ အဓိပ္ပာယ်ရှိပါတယ် — ဥပမာ edit တိုင်း UI ကို re-render လုပ်ချင်တာမျိုး၊ ဒါမှမဟုတ် input state ကို နည်းလမ်းမျိုးစုံနဲ့ ပြောင်းလို့ရအောင် (button နှိပ်တာလိုမျိုး) လုပ်ချင်တာမျိုးပါ:

```js
function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

Controlled components တွေဆီ ပေးတဲ့ `value` က `undefined` ဒါမှမဟုတ် `null` မဖြစ်သင့်ပါဘူး။ ကနဦးတန်ဖိုး အလွတ် ဖြစ်စေချင်ရင် (အောက်က `firstName` field လိုမျိုး) — state variable ကို empty string (`''`) နဲ့ initialize လုပ်ပါ။

> **သတိပြုရန်:** **`value` ကို `onChange` မပါဘဲ ပေးထားရင် — input ထဲ စာရိုက်လို့ မဖြစ်တော့ပါဘူး။** Input ကို `value` တစ်ခု ပေးပြီး control လုပ်တဲ့အခါ — အဲဒီ တန်ဖိုးအတိုင်း အမြဲ ရှိနေအောင် *အတင်း* လုပ်တာပါ။ ဒါကြောင့် state variable တစ်ခုကို `value` အဖြစ် ပေးထားပေမယ့် — `onChange` event handler အတွင်းမှာ အဲဒီ state variable ကို synchronously update လုပ်ဖို့ မေ့သွားရင် — React က key stroke တိုင်းပြီးနောက် input ကို သင်သတ်မှတ်ထားတဲ့ `value` ဆီ ပြန်ပြောင်းပါလိမ့်မယ်။

### Keystroke တိုင်း re-render ဖြစ်တာကို optimize လုပ်ခြင်း

Controlled input သုံးတဲ့အခါ — key stroke တိုင်းမှာ state သတ်မှတ်နေတာပါ။ State ပါတဲ့ component က ကြီးမားတဲ့ tree တစ်ခုကို re-render လုပ်နေရရင် — နှေးကွေးလာနိုင်ပါတယ်။ ဥပမာ — page content တစ်ခုလုံးကို key stroke တိုင်း re-render လုပ်နေတဲ့ form တစ်ခု ရှိတယ်ဆိုပါစို့:

```js
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />` က input state ပေါ် မမူတည်တာမို့ — input state ကို သူ့ရဲ့ကိုယ်ပိုင် component တစ်ခုဆီ ရွှေ့လိုက်လို့ရပါတယ်:

```js
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

ဒါဆိုရင် — key stroke တိုင်းမှာ `SignupForm` တစ်ခုတည်းပဲ re-render ဖြစ်တာမို့ — performance သိသိသာသာ တိုးတက်လာပါတယ်။ Re-render ကို ရှောင်လို့ မရတဲ့ အခြေအနေမျိုးမှာ (ဥပမာ — `PageContent` က search input ရဲ့ value ပေါ် မူတည်နေရင်) — [`useDeferredValue`](/docs/react/use-deferred-value) က ကြီးမားတဲ့ re-render တစ်ခု အတွင်းမှာတောင် controlled input ကို တုံ့ပြန်မြန်နေအောင် ကူညီပေးပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### ကျွန်တော် ရိုက်လိုက်တဲ့အခါ text input က update မဖြစ်ဘူး

`value` ပါပေမယ့် `onChange` မပါတဲ့ input တစ်ခု render လုပ်ရင် — console မှာ error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

```
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Error message ပြောထားတဲ့အတိုင်း — ကနဦးတန်ဖိုး ကိုပဲ သတ်မှတ်ချင်တာဆိုရင် `defaultValue` ကို ပေးပါ:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

ဒီ input ကို state variable နဲ့ control ချင်ရင် — `onChange` handler တစ်ခု သတ်မှတ်ပါ:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Value က တမင် read-only ဖြစ်တာဆိုရင် — error ကို ဖိနှိပ်ဖို့ `readOnly` prop ထည့်ပါ:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

### ကျွန်တော် နှိပ်လိုက်တဲ့အခါ checkbox က update မဖြစ်ဘူး

`checked` ပါပေမယ့် `onChange` မပါတဲ့ checkbox တစ်ခု render လုပ်ရင် — console မှာ error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

```
You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.
```

ကနဦးတန်ဖိုး ကိုပဲ သတ်မှတ်ချင်တာဆိုရင် — `defaultChecked` ကို ပေးပါ:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

Checkbox ကို state variable နဲ့ control ချင်ရင် — `onChange` handler တစ်ခု သတ်မှတ်ပါ:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

> **သတိပြုရန်:** Checkbox တွေအတွက် `e.target.value` မဟုတ်ဘဲ `e.target.checked` ကို ဖတ်ရပါတယ်။

Checkbox က တမင် read-only ဆိုရင် — `readOnly` prop ထည့်ပါ:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

### Input ရဲ့ caret က key stroke တိုင်း အစဆုံးကို ပြန်ခုန်သွားတယ်

Input ကို control လုပ်နေရင် — `onChange` အတွင်းမှာ state variable ကို DOM ထဲက input value နဲ့ update လုပ်ရပါတယ်။

`e.target.value` (checkbox တွေအတွက် `e.target.checked`) ကလွဲလို့ တခြားအရာတွေနဲ့ update လို့ မရပါဘူး:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Asynchronously လည်း update လို့ မရပါဘူး:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

ပြုပြင်ဖို့ — `e.target.value` ဆီ synchronously update လုပ်ပါ:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

ဒါနဲ့မှ မပြေလည်ရင် — input ကို key stroke တိုင်း DOM ကနေ ဖယ်ပြီး ပြန်ထည့်နေတာ ဖြစ်နိုင်ပါတယ်။ Re-render တိုင်းမှာ [state ကို မတော်တဆ reset](https://react.dev/learn/preserving-and-resetting-state) ဖြစ်နေရင် ဒီလို ဖြစ်တတ်ပါတယ် — ဥပမာ input ဒါမှမဟုတ် သူ့ရဲ့ parent တစ်ခုခုက re-render တိုင်း မတူတဲ့ `key` attribute ရနေတာမျိုး၊ ဒါမှမဟုတ် component function definitions တွေ nested လုပ်ထားတာမျိုးပါ (React မှာ support မလုပ်တဲ့အပြင် "inner" component ကို tree အသစ်တစ်ခုလို အမြဲ သတ်မှတ်စေပါတယ်)။

### Error တစ်ခု ရနေတယ်: "A component is changing an uncontrolled input to be controlled"

Component ဆီ `value` တစ်ခု ပေးထားရင် — အဲဒါ ဟာ သူ့ရဲ့ lifetime တစ်လျှောက်လုံး string တစ်ခု ဖြစ်နေရပါမယ်။

အစမှာ `value={undefined}` ပေးပြီး — နောက်မှ `value="some string"` ပေးလို့ မရပါဘူး — ဘာဖြစ်လို့လဲဆိုတော့ React က component ကို uncontrolled လား controlled လား လုပ်ချင်မှန်း မသိနိုင်လို့ပါ။ Controlled component တစ်ခုက `null` ဒါမှမဟုတ် `undefined` မဟုတ်ဘဲ — string `value` တစ်ခုကို အမြဲ လက်ခံရပါတယ်။

သင့် `value` က API ဒါမှမဟုတ် state variable တစ်ခုကနေ လာတယ်ဆိုရင် — `null` ဒါမှမဟုတ် `undefined` နဲ့ initialize ဖြစ်နေနိုင်ပါတယ်။ အဲဒီအခါ — အစမှာ empty string (`''`) သတ်မှတ်ထားပါ၊ ဒါမှမဟုတ် `value={someValue ?? ''}` ပေးပြီး `value` က string ဖြစ်ကြောင်း သေချာအောင် လုပ်ပါ။

အလားတူ — checkbox ဆီ `checked` ပေးရင် — အမြဲတမ်း boolean တစ်ခု ဖြစ်နေဖို့ သေချာပါစေ။
