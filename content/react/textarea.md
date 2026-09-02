---
title: "textarea"
description: "Multiline text input တစ်ခု render လုပ်ပေးတဲ့ built-in `<textarea>` component — value/defaultValue နဲ့ controlled/uncontrolled သုံးပုံ၊ children မပေးရတဲ့အကြောင်း (initial content အတွက် defaultValue သုံးရခြင်း) နဲ့ form submit ပုံ"
order: 77
source: "https://react.dev/reference/react-dom/components/textarea"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<textarea>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) က — multiline text input တစ်ခုကို render လုပ်နိုင်စေပါတယ်။

```js
<textarea />
```

## ရည်ညွှန်းချက် (Reference)

### `<textarea>`

Text area တစ်ခု ပြသဖို့ — [browser ရဲ့ built-in `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) component ကို render လုပ်ပါ။

```js
<textarea name="postContent" />
```

#### Props

`<textarea>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

`value` prop ကို ပေးခြင်းဖြင့် text area ကို controlled ဖြစ်စေနိုင်ပါတယ်:

- `value`: String တစ်ခု။ Text area အတွင်းက text ကို control လုပ်ပါတယ်။

`value` ပေးတဲ့အခါ — ပေးထားတဲ့ တန်ဖိုးကို update လုပ်ပေးမယ့် `onChange` handler တစ်ခုကိုပါ တစ်ပြိုင်နက် ပေးရပါမယ်။

သင့် `<textarea>` က uncontrolled ဖြစ်ရင် — `defaultValue` prop ကို ပေးနိုင်ပါတယ်:

- `defaultValue`: String တစ်ခု။ Text area တစ်ခုရဲ့ ကနဦးတန်ဖိုးကို သတ်မှတ်ပါတယ်။

ဒီ `<textarea>` props တွေက uncontrolled ရော controlled text areas တွေရော နှစ်မျိုးလုံးအတွက် သက်ဆိုင်ပါတယ်:

- [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): `'on'` ဒါမှမဟုတ် `'off'` တစ်ခုခု။ Autocomplete အပြုအမူကို သတ်မှတ်ပါတယ်။
- [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Boolean တစ်ခု။ `true` ဆိုရင် — React က element ကို mount ချိန်မှာ focus လုပ်ပါတယ်။
- `children`: `<textarea>` က children တွေကို လက်မခံပါဘူး။ ကနဦးတန်ဖိုး သတ်မှတ်ဖို့ `defaultValue` ကို သုံးပါ။
- [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Number တစ်ခု။ ပျမ်းမျှ character width တွေနဲ့ တွက်တဲ့ default width ကို သတ်မှတ်ပါတယ်။ Default က `20` ပါ။
- [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Boolean တစ်ခု။ `true` ဆိုရင် — input က interactive မဖြစ်တော့ဘဲ မှိန်ပြီး ပေါ်ပါတယ်။
- [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): String တစ်ခု။ ဒီ input ပါဝင်တဲ့ `<form>` ရဲ့ `id` ကို သတ်မှတ်ပါတယ်။ မပေးထားရင် — အနီးဆုံး parent form ပါ။
- [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Number တစ်ခု။ Text ရဲ့ အများဆုံး အလျားကို သတ်မှတ်ပါတယ်။
- [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Number တစ်ခု။ Text ရဲ့ အနည်းဆုံး အလျားကို သတ်မှတ်ပါတယ်။
- [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String တစ်ခု။ ဒီ input ရဲ့ form နဲ့အတူ submit လုပ်မယ့် name ကို သတ်မှတ်ပါတယ်။
- `onChange`: [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Controlled text areas တွေအတွက် မဖြစ်မနေ လိုအပ်ပါတယ်။ User က input ရဲ့ value ကို ပြောင်းလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ် (ဥပမာ — key နှိပ်တိုင်း fire ပါတယ်)။ Browser ရဲ့ [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) လိုပဲ ပြုမူပါတယ်။
- `onChangeCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onChange` ရဲ့ version တစ်ခု။
- [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ User က value ကို ပြောင်းလိုက်တာနဲ့ ချက်ချင်း fire ပါတယ်။ သမိုင်းကြောင်း အရ — React မှာ `onChange` ကို သုံးတာ ပုံမှန် ဖြစ်ပြီး အလားအယ် အလုပ်လုပ်ပါတယ်။
- `onInputCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInput` ရဲ့ version တစ်ခု။
- [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ Form submit လုပ်ချိန်မှာ input က validation မအောင်ရင် fire ပါတယ်။ Built-in `invalid` event နဲ့ မတူဘဲ — React ရဲ့ `onInvalid` event က bubble ဖြစ်ပါတယ်။
- `onInvalidCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onInvalid` ရဲ့ version တစ်ခု။
- [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` handler](/docs/react/built-in-components) function တစ်ခု။ `<textarea>` အတွင်းက selection ပြောင်းလဲပြီးချိန်မှာ fire ပါတယ်။ React က `onSelect` event ကို — selection အလွတ်တွေနဲ့ edits တွေ (selection ကို ထိခိုက်စေနိုင်တဲ့) အတွက်ပါ fire ဖြစ်အောင် တိုးချဲ့ပေးပါတယ်။
- `onSelectCapture`: [Capture phase](https://react.dev/learn/responding-to-events#capture-phase-events) မှာ fire ဖြစ်တဲ့ `onSelect` ရဲ့ version တစ်ခု။
- [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): String တစ်ခု။ Text area value အလွတ်ဖြစ်ချိန်မှာ မှိန်ပြီး ပြသပါတယ်။
- [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Boolean တစ်ခု။ `true` ဆိုရင် — user က text area ကို တည်းဖြတ်လို့ မရပါဘူး။
- [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Boolean တစ်ခု။ `true` ဆိုရင် — form submit ဖြစ်ဖို့ value ကို မဖြစ်မနေ ပေးရပါတယ်။
- [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Number တစ်ခု။ ပျမ်းမျှ character height တွေနဲ့ တွက်တဲ့ default height ကို သတ်မှတ်ပါတယ်။ Default က `2` ပါ။
- [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): `'hard'`၊ `'soft'` ဒါမှမဟုတ် `'off'` တစ်ခုခု။ Form submit လုပ်တဲ့အခါ text ကို ဘယ်လို wrap လုပ်ရမလဲ သတ်မှတ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `<textarea>something</textarea>` လိုမျိုး children ပေးတာကို ခွင့်မပြုပါဘူး။ ကနဦး content အတွက် `defaultValue` ကို သုံးပါ။
- Text area တစ်ခုက string `value` prop တစ်ခု ရရှိရင် — controlled အဖြစ် သတ်မှတ်ခံရပါတယ်။
- Text area တစ်ခုက တစ်ပြိုင်နက် controlled ရော uncontrolled ရော ဖြစ်လို့ မရပါဘူး။
- Text area တစ်ခုက သူ့ရဲ့ lifetime အတွင်း controlled/uncontrolled အကြား ပြောင်းလဲလို့ မရပါဘူး။
- Controlled text area တိုင်းမှာ — သူ့ရဲ့ backing value ကို synchronously update လုပ်ပေးတဲ့ `onChange` event handler တစ်ခု လိုအပ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Text area တစ်ခု ပြသခြင်း

Text area တစ်ခု ပြသဖို့ — `<textarea>` ကို render လုပ်ပါ။ [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) နဲ့ [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attributes တွေနဲ့ သူ့ရဲ့ default size ကို သတ်မှတ်နိုင်ပေမယ့် — ပုံမှန်အားဖြင့် user က resizing လုပ်လို့ ရပါတယ်။ Resizing ပိတ်ချင်ရင် — CSS မှာ `resize: none` သတ်မှတ်နိုင်ပါတယ်။

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

### Text area တစ်ခုအတွက် label ပေးခြင်း

ပုံမှန်အားဖြင့် `<textarea>` တိုင်းကို [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag အတွင်းမှာ ထားပါတယ်။ ဒါက browser ကို ဒီ label က ဒီ text area နဲ့ ဆက်စပ်ကြောင်း ပြောပြပြီး — user က label ကို နှိပ်လိုက်ရင် browser က text area ကို focus လုပ်ပေးပါတယ်။ Accessibility အတွက်လည်း မရှိမဖြစ်ပါ — screen reader က text area ကို focus လုပ်ချိန်မှာ label ရဲ့ စာသားကို ဖတ်ပြပေးလို့ပါ။

`<textarea>` ကို `<label>` ထဲမှာ ထည့်လို့မရရင် — `<textarea id>` နဲ့ [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) ကို id တစ်ခုတည်း ပေးပြီး ချိတ်ဆက်ပါ။ Component တစ်ခုရဲ့ instance တွေကြားမှာ conflict မဖြစ်အောင် — အဲဒီလို ID ကို [`useId`](/docs/react/use-id) နဲ့ ထုတ်ပါ။

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

### Text area အတွက် ကနဦးတန်ဖိုး (initial value) သတ်မှတ်ခြင်း

Text area အတွက် ကနဦးတန်ဖိုးကို optional အနေနဲ့ သတ်မှတ်နိုင်ပါတယ် — `defaultValue` string အဖြစ် ပေးပါ။

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

> **သတိပြုရန်:** HTML မှာ ရှိသလိုမျိုး `<textarea>Some content</textarea>` လို ကနဦး text ပေးတာကိုတော့ support မလုပ်ပါဘူး။

### Form submit လုပ်ချိန်မှာ text area value ဖတ်ခြင်း

သင့် textarea ကို [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) တစ်ခုနဲ့ ထုပ်ပြီး — အတွင်းမှာ [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) တစ်ခု ထည့်ပါ။ ဒါဆိုရင် `<form onSubmit>` event handler ကို ခေါ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် browser က form data ကို လက်ရှိ URL ဆီ ပို့ပြီး page ကို refresh လုပ်ပါတယ် — `e.preventDefault()` ခေါ်ပြီး အဲဒီ အပြုအမူကို ကျော်လွှားနိုင်ပြီး — [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) နဲ့ form data ကို ဖတ်ပါတယ်။

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

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

> **မှတ်ချက်:** သင့် `<textarea>` ကို `name` တစ်ခု ပေးပါ — ဥပမာ `<textarea name="postContent" />`။ သင်ပေးထားတဲ့ `name` ကို form data ထဲမှာ key အဖြစ် သုံးပါတယ် — ဥပမာ `{ postContent: "Your post" }`။

> **သတိပြုရန်:** `<form>` အတွင်းမှာ ရှိနေတဲ့ *မည်သည့်* `<button>` မဆို default အနေနဲ့ form ကို submit လုပ်ပါတယ်။ ဒါက မမျှော်လင့်ဘဲ ဖြစ်နိုင်ပါတယ်! ကိုယ်ပိုင် custom `Button` React component ရှိရင် — `<button>` အစား [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) ကို ပြန်ပေးဖို့ စဉ်းစားပါ။ Form ကို submit စေချင်တဲ့ buttons တွေအတွက်တော့ ရှင်းရှင်းလင်းလင်း `<button type="submit">` ကို သုံးပါ။

### State variable နဲ့ text area ကို control လုပ်ခြင်း

`<textarea />` လိုမျိုး text area တစ်ခုက *uncontrolled* ပါ။ ကနဦးတန်ဖိုး တစ်ခု ပေးထားရင်တောင် — ဥပမာ `<textarea defaultValue="Initial text" />` — သင့် JSX က ကနဦးတန်ဖိုးကိုပဲ သတ်မှတ်ပေးတာ ဖြစ်ပြီး — လက်ရှိ တန်ဖိုးကို control မလုပ်ပါဘူး။

**_Controlled_ text area တစ်ခု render လုပ်ဖို့ — `value` prop ကို ပေးပါ။** React က text area ကို သင်ပေးထားတဲ့ `value` အတိုင်း အမြဲ ဖြစ်နေအောင် အတင်းလုပ်ပါတယ်။ ပုံမှန်အားဖြင့် [state variable](/docs/react/use-state) တစ်ခု ကြေညာပြီး ဒီလို လုပ်ပါတယ်:

```js
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

ဒါက — key stroke တိုင်းကို တုံ့ပြန်ပြီး UI ရဲ့ အစိတ်အပိုင်းတစ်ခုခုကို re-render လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဒီမှာ — textarea ထဲက markdown ကို live preview လုပ်ပေးတဲ့ ဥပမာ အပြည့်အစုံ:

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

> **သတိပြုရန်:** **`value` ကို `onChange` မပါဘဲ ပေးထားရင် — text area ထဲ စာရိုက်လို့ မဖြစ်တော့ပါဘူး။** Text area ကို `value` တစ်ခု ပေးပြီး control လုပ်တဲ့အခါ — အဲဒီ တန်ဖိုးအတိုင်း အမြဲ ရှိနေအောင် *အတင်း* လုပ်တာပါ။ ဒါကြောင့် state variable တစ်ခုကို `value` အဖြစ် ပေးထားပေမယ့် — `onChange` event handler အတွင်းမှာ အဲဒီ state variable ကို synchronously update လုပ်ဖို့ မေ့သွားရင် — React က key stroke တိုင်းပြီးနောက် text area ကို သင်သတ်မှတ်ထားတဲ့ `value` ဆီ ပြန်ပြောင်းပါလိမ့်မယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### ကျွန်တော် ရိုက်လိုက်တဲ့အခါ text area က update မဖြစ်ဘူး

`value` ပါပေမယ့် `onChange` မပါတဲ့ text area တစ်ခု render လုပ်ရင် — console မှာ error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

```
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Error message ပြောထားတဲ့အတိုင်း — ကနဦးတန်ဖိုး ကိုပဲ သတ်မှတ်ချင်တာဆိုရင် `defaultValue` ကို ပေးပါ:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

ဒီ text area ကို state variable နဲ့ control ချင်ရင် — `onChange` handler တစ်ခု သတ်မှတ်ပါ:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Value က တမင် read-only ဆိုရင် — error ကို ဖိနှိပ်ဖို့ `readOnly` prop ထည့်ပါ:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

### Text area ရဲ့ caret က key stroke တိုင်း အစဆုံးကို ပြန်ခုန်သွားတယ်

Text area ကို control လုပ်နေရင် — `onChange` အတွင်းမှာ state variable ကို DOM ထဲက text area value နဲ့ update လုပ်ရပါတယ်။

`e.target.value` ကလွဲလို့ တခြားအရာတွေနဲ့ update လို့ မရပါဘူး:

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

ဒါနဲ့မှ မပြေလည်ရင် — text area ကို key stroke တိုင်း DOM ကနေ ဖယ်ပြီး ပြန်ထည့်နေတာ ဖြစ်နိုင်ပါတယ်။ Re-render တိုင်းမှာ [state ကို မတော်တဆ reset](https://react.dev/learn/preserving-and-resetting-state) ဖြစ်နေရင် ဒီလို ဖြစ်တတ်ပါတယ် — ဥပမာ text area ဒါမှမဟုတ် သူ့ရဲ့ parent တစ်ခုခုက re-render တိုင်း မတူတည်း `key` attribute ရနေတာမျိုး၊ ဒါမှမဟုတ် component definitions တွေ nested လုပ်ထားတာမျိုးပါ (React မှာ ခွင့်မပြုတဲ့အပြင် "inner" component ကို render တိုင်း remount ဖြစ်စေပါတယ်)။

### Error တစ်ခု ရနေတယ်: "A component is changing an uncontrolled input to be controlled"

Component ဆီ `value` တစ်ခု ပေးထားရင် — အဲဒါ ဟာ သူ့ရဲ့ lifetime တစ်လျှောက်လုံး string တစ်ခု ဖြစ်နေရပါမယ်။

အစမှာ `value={undefined}` ပေးပြီး — နောက်မှ `value="some string"` ပေးလို့ မရပါဘူး — ဘာဖြစ်လို့လဲဆိုတော့ React က component ကို uncontrolled လား controlled လား လုပ်ချင်မှန်း မသိနိုင်လို့ပါ။ Controlled component တစ်ခုက `null` ဒါမှမဟုတ် `undefined` မဟုတ်ဘဲ — string `value` တစ်ခုကို အမြဲ လက်ခံရပါတယ်။

သင့် `value` က API ဒါမှမဟုတ် state variable တစ်ခုကနေ လာတယ်ဆိုရင် — `null` ဒါမှမဟုတ် `undefined` နဲ့ initialize ဖြစ်နေနိုင်ပါတယ်။ အဲဒီအခါ — အစမှာ empty string (`''`) သတ်မှတ်ထားပါ၊ ဒါမှမဟုတ် `value={someValue ?? ''}` ပေးပြီး `value` က string ဖြစ်ကြောင်း သေချာအောင် လုပ်ပါ။
