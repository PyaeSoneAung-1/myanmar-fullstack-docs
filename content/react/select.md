---
title: "select"
description: "Options တွေနဲ့အတူ select box တစ်ခု render လုပ်ပေးတဲ့ built-in `<select>` component — value/defaultValue နဲ့ controlled/uncontrolled သုံးပုံ၊ multiple selection နဲ့ `<option>` `selected` attribute ပတ်သက်တဲ့ အချက်များ"
order: 76
source: "https://react.dev/reference/react-dom/components/select"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<select>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) က — options တွေပါတဲ့ select box တစ်ခုကို render လုပ်နိုင်စေပါတယ်။

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

## ရည်ညွှန်းချက် (Reference)

### `<select>`

Select box တစ်ခု ပြသဖို့ — [browser ရဲ့ built-in `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) component ကို render လုပ်ပါ။

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

#### Props

`<select>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

`value` prop ကို ပေးခြင်းဖြင့် select box ကို controlled ဖြစ်စေနိုင်ပါတယ်:

- `value`: String တစ်ခု (ဒါမှမဟုတ် `multiple={true}` အတွက် strings array တစ်ခု)။ ဘယ် option ကို ရွေးထားမလဲ သတ်မှတ်ပါတယ်။ Value string တိုင်းက `<select>` အတွင်းမှာ nested ဖြစ်နေတဲ့ `<option>` တစ်ခုခုရဲ့ `value` နဲ့ ကိုက်ညီရပါမယ်။

`value` ပေးတဲ့အခါ — ပေးထားတဲ့ တန်ဖိုးကို update လုပ်ပေးမယ့် `onChange` handler တစ်ခုကိုပါ တစ်ပြိုင်နက် ပေးရပါမယ်။

သင့် `<select>` က uncontrolled ဖြစ်ရင် — `defaultValue` prop ကို ပေးနိုင်ပါတယ်:

- `defaultValue`: String တစ်ခု (ဒါမှမဟုတ် `multiple={true}` အတွက် strings array တစ်ခု)။ ကနဦး ရွေးချယ်ထားတဲ့ option ကို သတ်မှတ်ပါတယ်။

ဒီ `<select>` props တွေက uncontrolled ရော controlled select boxes တွေရော နှစ်မျိုးလုံးအတွက် သက်ဆိုင်ပါတယ်:

- [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): String တစ်ခု။ ဖြစ်နိုင်တဲ့ [autocomplete behaviors](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) တွေထဲက တစ်ခုကို သတ်မှတ်ပါတယ်။
- [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Boolean တစ်ခု။ `true` ဆိုရင် — React က element ကို mount ချိန်မှာ focus လုပ်ပါတယ်။
- `children`: `<select>` က [`<option>`](/docs/react/option)၊ [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) နဲ့ [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) components တွေကို children အဖြစ် လက်ခံပါတယ်။ နောက်ဆုံးမှာ ခွင့်ပြုထားတဲ့ components တွေထဲက တစ်ခုကို render လုပ်သရွေ့ — ကိုယ်ပိုင် components တွေကိုလည်း ပေးလို့ရပါတယ်။ နောက်ဆုံးမှာ `<option>` tags တွေ render လုပ်တဲ့ ကိုယ်ပိုင် components တွေ ပေးမယ်ဆိုရင် — သင်က `<option>` တိုင်းမှာ `value` ပါရှိရပါမယ်။
- [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Boolean တစ်ခု။ `true` ဆိုရင် — select box က interactive မဖြစ်တော့ဘဲ မှိန်ပြီး ပေါ်ပါတယ်။
- [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): String တစ်ခု။ ဒီ select box ပါဝင်တဲ့ `<form>` ရဲ့ `id` ကို သတ်မှတ်ပါတယ်။ မပေးထားရင် — အနီးဆုံး parent form ပါ။
- [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Boolean တစ်ခု။ `true` ဆိုရင် — browser က multiple selection ကို ခွင့်ပြုပါတယ်။
- [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): String တစ်ခု။ ဒီ select box ရဲ့ form နဲ့အတူ submit လုပ်မယ့် name ကို သတ်မှတ်ပါတယ်။
- `onChange`: [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Controlled select boxes တွေအတွက် မဖြစ်မနေ လိုအပ်ပါတယ်။ User က တခြား option တစ်ခုကို ရွေးလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ်။ Browser ရဲ့ [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) လိုပဲ ပြုမူပါတယ်။
- `onChangeCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onChange` ရဲ့ version တစ်ခု။
- [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ User က value ကို ပြောင်းလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ်။ သမိုင်းကြောင်း အရ — React မှာ `onChange` ကို သုံးတာ ပုံမှန် ဖြစ်ပြီး အလားအယ် အလုပ်လုပ်ပါတယ်။
- `onInputCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInput` ရဲ့ version တစ်ခု။
- [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Form submit လုပ်ချိန်မှာ input က validation မအောင်ရင် fire ပါတယ်။ Built-in `invalid` event နဲ့ မတူဘဲ — React ရဲ့ `onInvalid` event က bubble ဖြစ်ပါတယ်။
- `onInvalidCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInvalid` ရဲ့ version တစ်ခု။
- [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Boolean တစ်ခု။ `true` ဆိုရင် — form submit ဖြစ်ဖို့ value ကို မဖြစ်မနေ ပေးရပါတယ်။
- [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Number တစ်ခု။ `multiple={true}` selects တွေအတွက် — ကနဦးမှာ မြင်ရမယ့် items အရေအတွက်ကို သတ်မှတ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- HTML မှာ ရှိသလိုမျိုး `<option>` တစ်ခုဆီ `selected` attribute ပေးတာကိုတော့ support မလုပ်ပါဘူး။ အစား — uncontrolled select boxes တွေအတွက် `<select defaultValue>` ကို သုံးပြီး — controlled select boxes တွေအတွက် `<select value>` ကို သုံးပါ။
- Select box တစ်ခုက `value` prop ရရှိရင် — controlled အဖြစ် သတ်မှတ်ခံရပါတယ်။
- Select box တစ်ခုက တစ်ပြိုင်နက် controlled ရော uncontrolled ရော ဖြစ်လို့ မရပါဘူး။
- Select box တစ်ခုက သူ့ရဲ့ lifetime အတွင်း controlled/uncontrolled အကြား ပြောင်းလဲလို့ မရပါဘူး။
- Controlled select box တိုင်းမှာ — သူ့ရဲ့ backing value ကို synchronously update လုပ်ပေးတဲ့ `onChange` event handler တစ်ခု လိုအပ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Options တွေနဲ့အတူ select box တစ်ခု ပြသခြင်း

Select box တစ်ခု ပြသဖို့ — `<option>` components စာရင်းတစ်ခုကို အတွင်းမှာ ထည့်ထားတဲ့ `<select>` တစ်ခုကို render လုပ်ပါ။ `<option>` တစ်ခုချင်းစီကို — form နဲ့အတူ submit လုပ်မယ့် data ကို ကိုယ်စားပြုတဲ့ `value` တစ်ခု ပေးပါ။

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

### Select box တစ်ခုအတွက် label ပေးခြင်း

ပုံမှန်အားဖြင့် `<select>` တိုင်းကို [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag အတွင်းမှာ ထားပါတယ်။ ဒါက browser ကို ဒီ label က ဒီ select box နဲ့ ဆက်စပ်ကြောင်း ပြောပြပြီး — user က label ကို နှိပ်လိုက်ရင် browser က select box ကို အလိုအလျောက် focus လုပ်ပေးပါတယ်။ Accessibility အတွက်လည်း မရှိမဖြစ်ပါ — screen reader က select box ကို focus လုပ်ချိန်မှာ label ရဲ့ စာသားကို ဖတ်ပြပေးလို့ပါ။

`<select>` ကို `<label>` ထဲမှာ ထည့်လို့မရရင် — `<select id>` နဲ့ [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) ကို id တစ်ခုတည်း ပေးပြီး ချိတ်ဆက်ပါ။ Component တစ်ခုရဲ့ instance အများကြီးကြားမှာ conflict မဖြစ်အောင် — အဲဒီလို ID ကို [`useId`](/docs/react/use-id) နဲ့ ထုတ်ပါ။

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

### ကနဦး ရွေးချယ်ထားတဲ့ option တစ်ခု သတ်မှတ်ခြင်း

ပုံမှန်အားဖြင့် browser က စာရင်းထဲက ပထမဆုံး `<option>` ကို ရွေးပါတယ်။ Default အနေနဲ့ တခြား option တစ်ခုကို ရွေးချင်ရင် — အဲဒီ `<option>` ရဲ့ `value` ကို `<select>` element ဆီ `defaultValue` အဖြစ် ပေးပါ။

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

> **သတိပြုရန်:** HTML မှာ ရှိသလိုမျိုး `<option>` တစ်ခုချင်းစီဆီ `selected` attribute ပေးတာကိုတော့ support မလုပ်ပါဘူး။

### Multiple selection ဖွင့်ခြင်း

User တွေ options အများအပြား ရွေးလို့ရအောင် `<select>` ဆီ `multiple={true}` ပေးပါ။ အဲဒီအခါ — ကနဦး ရွေးထားတဲ့ options တွေကို သတ်မှတ်ဖို့ `defaultValue` ပါ ပေးမယ်ဆိုရင် — array တစ်ခု ဖြစ်ရပါမယ်။

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

### Form submit လုပ်ချိန်မှာ select box value ဖတ်ခြင်း

သင့် select box ကို [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) တစ်ခုနဲ့ ထုပ်ပြီး — အတွင်းမှာ [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) တစ်ခု ထည့်ပါ။ ဒါဆိုရင် `<form onSubmit>` event handler ကို ခေါ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် browser က form data ကို လက်ရှိ URL ဆီ ပို့ပြီး page ကို refresh လုပ်ပါတယ် — `e.preventDefault()` ခေါ်ပြီး အဲဒီ အပြုအမူကို ကျော်လွှားနိုင်ပြီး — [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) နဲ့ form data ကို ဖတ်ပါတယ်။

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

> **မှတ်ချက်:** သင့် `<select>` ကို `name` တစ်ခု ပေးပါ — ဥပမာ `<select name="selectedFruit" />`။ သင်ပေးထားတဲ့ `name` ကို form data ထဲမှာ key အဖြစ် သုံးပါတယ် — ဥပမာ `{ selectedFruit: "orange" }`။
>
> `<select multiple={true}>` သုံးထားရင် — form ကနေ ဖတ်ရမယ့် [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ထဲမှာ ရွေးထားတဲ့ value တစ်ခုချင်းစီကို သီးခြား name-value pair အဖြစ် ပါဝင်ပါလိမ့်မယ်။ အထက်က ဥပမာထဲက console logs တွေကို သေချာ ကြည့်ပါ။

> **သတိပြုရန်:** `<form>` အတွင်းမှာ ရှိနေတဲ့ *မည်သည့်* `<button>` မဆို default အနေနဲ့ form ကို submit လုပ်ပါတယ်။ ဒါက မမျှော်လင့်ဘဲ ဖြစ်နိုင်ပါတယ်! ကိုယ်ပိုင် custom `Button` React component ရှိရင် — `<button>` အစား [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) ကို ပြန်ပေးဖို့ စဉ်းစားပါ။ Form ကို submit စေချင်တဲ့ buttons တွေအတွက်တော့ ရှင်းရှင်းလင်းလင်း `<button type="submit">` ကို သုံးပါ။

### State variable နဲ့ select box ကို control လုပ်ခြင်း

`<select />` လိုမျိုး select box တစ်ခုက *uncontrolled* ပါ။ ကနဦး ရွေးထားတဲ့ တန်ဖိုး တစ်ခု ပေးထားရင်တောင် — ဥပမာ `<select defaultValue="orange" />` — သင့် JSX က ကနဦးတန်ဖိုးကိုပဲ သတ်မှတ်ပေးတာ ဖြစ်ပြီး — လက်ရှိ တန်ဖိုးကို control မလုပ်ပါဘူး။

**_Controlled_ select box တစ်ခု render လုပ်ဖို့ — `value` prop ကို ပေးပါ။** React က select box ကို သင်ပေးထားတဲ့ `value` အတိုင်း အမြဲ ဖြစ်နေအောင် အတင်းလုပ်ပါတယ်။ ပုံမှန်အားဖြင့် [state variable](/docs/react/use-state) တစ်ခု ကြေညာပြီး ဒီလို လုပ်ပါတယ်:

```js
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

ဒါက — selection တိုင်းကို တုံ့ပြန်ပြီး UI ရဲ့ အစိတ်အပိုင်းတစ်ခုခုကို re-render လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဒီမှာ `multiple={true}` select box တစ်ခုကိုပါ state နဲ့ control လုပ်ထားတဲ့ ဥပမာ အပြည့်အစုံ:

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

> **သတိပြုရန်:** **`value` ကို `onChange` မပါဘဲ ပေးထားရင် — option တစ်ခုကို ရွေးလို့ မဖြစ်တော့ပါဘူး။** Select box ကို `value` တစ်ခု ပေးပြီး control လုပ်တဲ့အခါ — အဲဒီ တန်ဖိုးအတိုင်း အမြဲ ရှိနေအောင် *အတင်း* လုပ်တာပါ။ ဒါကြောင့် state variable တစ်ခုကို `value` အဖြစ် ပေးထားပေမယ့် — `onChange` event handler အတွင်းမှာ အဲဒီ state variable ကို synchronously update လုပ်ဖို့ မေ့သွားရင် — React က သင်သတ်မှတ်ထားတဲ့ `value` ဆီ select box ကို ပြန်ပြောင်းပါလိမ့်မယ်။
>
> HTML မှာ ရှိသလိုမျိုး `<option>` တစ်ခုချင်းစီဆီ `selected` attribute ပေးတာကိုတော့ support မလုပ်ပါဘူး။
