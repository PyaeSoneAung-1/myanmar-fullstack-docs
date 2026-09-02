---
title: "forwardRef"
description: "Ref ကို prop အနေနဲ့ လက်ခံပြီး child component ဆီ ဆက်ပို့ (forward) နိုင်စေတဲ့ React API — component ရဲ့ DOM node ဒါမှမဟုတ် imperative handle ကို parent component ဆီ ထုတ်ဖော်ပြခြင်း"
order: 55
source: "https://react.dev/reference/react/forwardRef"
status: translated
updated: 2026-09-02
---

> **Deprecated (ခေတ်ကုန်သွားပါပြီ):** React 19 မှာ `forwardRef` မလိုအပ်တော့ပါဘူး — `ref` ကို prop အဖြစ် တိုက်ရိုက် ပေးနိုင်ပါပြီ။ `forwardRef` ကို နောင်ထွက်လာမယ့် release တစ်ခုမှာ deprecated လုပ်ဖို့ စီစဉ်ထားပါတယ်။ အသေးစိတ်ကို [ဒီမှာ ဖတ်ပါ](https://react.dev/blog/2024/04/25/react-19#ref-as-a-prop)။

`forwardRef` က သင့် component ရဲ့ DOM node တစ်ခုကို [ref](/docs/react/manipulating-the-dom-with-refs) တစ်ခုနဲ့ — parent component က ဝင်ရောက်နိုင်အောင် ထုတ်ဖော်ပြနိုင်စေပါတယ်။

```js
const SomeComponent = forwardRef(render)
```

## ရည်ညွှန်းချက် (Reference)

### `forwardRef(render)`

`forwardRef()` ကို ခေါ်လိုက်တာနဲ့ — သင့် component က `ref` တစ်ခုကို လက်ခံနိုင်ပြီး — အဲဒီ ref ကို child component တစ်ခုဆီ ဆက်ပို့ (forward) နိုင်ပါတယ်:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

**Parameters (ပါရာမီတာများ)**

- `render`: သင့် component ရဲ့ render function ပါ။ React က ဒီ function ကို ခေါ်တဲ့အခါ — component က parent ဆီကနေ လက်ခံရရှိတဲ့ `props` တွေနဲ့ `ref` ကို argument အဖြစ် ပေးပါတယ်။ သင်ပြန်ပေးတဲ့ JSX က သင့် component ရဲ့ output ဖြစ်ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`forwardRef` က React component တစ်ခုကို ပြန်ပေးပြီး — အဲဒါကို JSX ထဲမှာ render လုပ်နိုင်ပါတယ်။ သာမန် function တွေအနေနဲ့ သတ်မှတ်ထားတဲ့ React components တွေနဲ့ မတူဘဲ — `forwardRef` က ပြန်ပေးတဲ့ component က `ref` prop တစ်ခုကိုလည်း လက်ခံနိုင်စွမ်း ရှိပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- Strict Mode မှာ — မရည်ရွယ်ဘဲ ပါဝင်လာတဲ့ impurities တွေ [ရှာတွေ့စေဖို့ — React က သင့် render function ကို နှစ်ကြိမ် ခေါ်ပါတယ်](/docs/react/use-state)။ ဒါက development မှာပဲ ဖြစ်တဲ့ အပြုအမူပါ — production ကို မထိခိုက်ပါဘူး။ သင့် render function က pure ဖြစ်နေရင် (ဖြစ်သင့်သလိုပါ) — ဒါက သင့် component ရဲ့ logic ကို မထိခိုက်စေပါဘူး။ ခေါ်မှုတွေထဲက တစ်ခုရဲ့ ရလဒ်ကို ပစ်ပယ်လိုက်ပါတယ်။

### `render` function

`forwardRef` က render function တစ်ခုကို argument အဖြစ် လက်ခံပါတယ်။ React က ဒီ function ကို `props` နဲ့ `ref` — နှစ်ခုလုံးနဲ့အတူ ခေါ်ပါတယ်:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

**Parameters (ပါရာမီတာများ)**

- `props`: Parent component က ပို့လိုက်တဲ့ props တွေပါ။
- `ref`: Parent component က ပို့လိုက်တဲ့ `ref` attribute ပါ။ `ref` က object လည်း ဖြစ်နိုင်ပြီး — function လည်း ဖြစ်နိုင်ပါတယ်။ Parent component က ref တစ်ခု မပို့ထားဘူးဆိုရင် — `null` ဖြစ်နေပါလိမ့်မယ်။ သင်လက်ခံရရှိတဲ့ `ref` ကို တခြား component တစ်ခုဆီ ဆက်ပို့သင့်ပါတယ် ဒါမှမဟုတ် — [`useImperativeHandle`](/docs/react/use-imperative-handle) ဆီ ပေးသင့်ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`forwardRef` က React component တစ်ခုကို ပြန်ပေးပြီး — အဲဒါကို JSX ထဲမှာ render လုပ်နိုင်ပါတယ်။ သာမန် function တွေအနေနဲ့ သတ်မှတ်ထားတဲ့ React components တွေနဲ့ မတူဘဲ — `forwardRef` က ပြန်ပေးတဲ့ component က `ref` prop တစ်ခုကို လက်ခံနိုင်စွမ်း ရှိပါတယ်။

## အသုံးပြုပုံ (Usage)

### DOM Node တစ်ခုကို Parent Component ဆီ ထုတ်ဖော်ပြခြင်း

ပုံမှန်အားဖြင့် — component တစ်ခုချင်းစီရဲ့ DOM nodes တွေက private ပါ။ ဒါပေမယ့် — တစ်ခါတလေ DOM node တစ်ခုကို parent ဆီ ထုတ်ဖော်ပြဖို့ အသုံးဝင်ပါတယ် — ဥပမာ — အဲဒါကို focus လုပ်ခွင့်ပေးဖို့ဆိုရင်ပေါ့။ ဒါကို ရွေးချယ်လုပ်ဖို့ — သင့် component definition ကို `forwardRef()` နဲ့ ထုပ်ပါ:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

props တွေပြီးရင် — ဒုတိယ argument အနေနဲ့ `ref` တစ်ခုကို ရပါလိမ့်မယ်။ သင်ထုတ်ဖော်ပြချင်တဲ့ DOM node ဆီ အဲဒီ ref ကို ပေးလိုက်ပါ — အထက်က code ထဲမှာ `<input>` ကို `ref={ref}` နဲ့ ချိတ်ထားတာကို မြင်ရပါလိမ့်မယ်။ ဒါက `MyInput` က ထုတ်ဖော်ပြတဲ့ `<input>` DOM node ကို — parent `Form` component က ဝင်ရောက်နိုင်စေပါတယ်:

```js
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

ဒီ `Form` component က `MyInput` ဆီ [ref တစ်ခု ပို့ပါတယ်](/docs/react/use-ref)။ `MyInput` component က အဲဒီ ref ကို browser ရဲ့ `<input>` tag ဆီ *forward* (ဆက်ပို့) လုပ်ပါတယ်။ ရလဒ်အနေနဲ့ — `Form` component က အဲဒီ `<input>` DOM node ကို ဝင်ရောက်ပြီး — [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) ကို ခေါ်နိုင်ပါတယ်။

သတိထားရမှာက — component ထဲက DOM node ဆီ ref ကို ထုတ်ဖော်ပြထားခြင်းက — နောက်ပိုင်းမှာ သင့် component ရဲ့ အတွင်းပိုင်း ပြောင်းလဲဖို့ ပိုခက်ခဲစေပါတယ်။ ပုံမှန်အားဖြင့် — button ဒါမှမဟုတ် text input လိုမျိုး — ပြန်လည်အသုံးပြုလို့ရတဲ့ low-level components တွေကနေ DOM nodes တွေကို ထုတ်ဖော်ပြလေ့ရှိပြီး — avatar ဒါမှမဟုတ် comment လိုမျိုး — application-level components တွေကနေတော့ မထုတ်ဖော်ပြပါဘူး။

### Ref တစ်ခုကို Component အများကြားမှာ ဖြတ်၍ Forwarding လုပ်ခြင်း

`ref` တစ်ခုကို DOM node ဆီ တိုက်ရိုက် forwarding လုပ်မယ့်အစား — `MyInput` လိုမျိုး — သင့်ကိုယ်ပိုင် component ဆီလည်း forwarding လုပ်နိုင်ပါတယ်:

```js
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

အဲဒီ `MyInput` component က သူ့ရဲ့ `<input>` ဆီ ref တစ်ခုကို forwarding လုပ်တယ်ဆိုရင် — `FormField` ဆီပေးတဲ့ ref တစ်ခုက — အဲဒီ `<input>` ကိုပဲ သင့်ကို ပေးပါလိမ့်မယ်:

```js
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` component က ref တစ်ခု သတ်မှတ်ပြီး `FormField` ဆီ ပို့ပါတယ်။ `FormField` component က အဲဒီ ref ကို `MyInput` ဆီ ဆက်ပို့ပြီး — `MyInput` က browser ရဲ့ `<input>` DOM node ဆီ ထပ်ဆက်ပို့ပါတယ်။ ဒါကြောင့်ပဲ `Form` က အဲဒီ DOM node ကို ဝင်ရောက်နိုင်တာပါ။

### DOM Node အစား Imperative Handle တစ်ခု ထုတ်ဖော်ပြခြင်း

DOM node တစ်ခုလုံး ထုတ်ဖော်ပြမယ့်အစား — *imperative handle* လို့ခေါ်တဲ့ — methods တွေ ပိုကန့်သတ်ထားတဲ့ — custom object တစ်ခုကို ထုတ်ဖော်ပြနိုင်ပါတယ်။ ဒါလုပ်ဖို့ — DOM node ကို ကိုင်ထားဖို့ ref သပ်သပ် တစ်ခုကို သတ်မှတ်ရပါမယ်:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

သင်လက်ခံရရှိတဲ့ `ref` ကို [`useImperativeHandle`](/docs/react/use-imperative-handle) ဆီ ပေးပြီး — `ref` ကနေ ထုတ်ဖော်ပြချင်တဲ့ တန်ဖိုးကို သတ်မှတ်ပါ:

```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

တချို့ component တစ်ခုက `MyInput` ဆီ ref တစ်ခု ရတယ်ဆိုရင် — DOM node အစား — သင့် `{ focus, scrollIntoView }` object ကိုပဲ လက်ခံရရှိပါလိမ့်မယ်။ ဒါက — သင့် DOM node အကြောင်း ထုတ်ဖော်ပြတဲ့ အချက်အလက်တွေကို အနည်းဆုံးအထိ ကန့်သတ်နိုင်စေပါတယ်။

Imperative handles တွေ အသုံးပြုခြင်းအကြောင်း [ဒီမှာ ဆက်ဖတ်ပါ](/docs/react/use-imperative-handle)။

> **သတိပြုရန်: Ref တွေကို အလွန်အကျွံ မသုံးပါနဲ့။** Ref တွေကို — props တွေအနေနဲ့ ဖော်ပြလို့မရတဲ့ *imperative* အပြုအမူတွေအတွက်ပဲ သုံးသင့်ပါတယ် — ဥပမာ node တစ်ခုဆီ scroll လုပ်ခြင်း၊ node တစ်ခုကို focus လုပ်ခြင်း၊ animation တစ်ခု စတင်ခြင်း၊ text ရွေးချယ်ခြင်း စသဖြင့်ပါ။
>
> တစ်ခုခုကို prop အနေနဲ့ ဖော်ပြနိုင်ရင် — ref ကို မသုံးသင့်ပါဘူး။ ဥပမာ — `Modal` component တစ်ခုကနေ `{ open, close }` ဆိုတဲ့ imperative handle တစ်ခုကို ထုတ်ဖော်ပြမယ့်အစား — `<Modal isOpen={isOpen} />` လိုမျိုး `isOpen` ကို prop အဖြစ် လက်ခံတာ ပိုကောင်းပါတယ်။ Imperative behaviors တွေကို props တွေကနေတစ်ဆင့် ထုတ်ဖော်ပြနိုင်အောင် — [Effects](https://react.dev/learn/synchronizing-with-effects) တွေက ကူညီပေးနိုင်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Component ကို `forwardRef` နဲ့ ထုပ်ထားပေမယ့် — သူ့ဆီက `ref` က အမြဲ `null` ဖြစ်နေတယ်

ဒါက များသောအားဖြင့် — သင်လက်ခံရရှိတဲ့ `ref` ကို တကယ် အသုံးမပြုလို့ပါ။

ဥပမာ — ဒီ component က သူ့ရဲ့ `ref` နဲ့ ဘာမှ မလုပ်ပါဘူး:

```js
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

ဖြေရှင်းဖို့ — `ref` ကို ref တစ်ခု လက်ခံနိုင်တဲ့ DOM node ဒါမှမဟုတ် တခြား component တစ်ခုဆီ အောက်ကို ပို့လိုက်ပါ:

```js
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`MyInput` ဆီက `ref` က — logic တစ်ချို့က conditional ဖြစ်နေရင်လည်း `null` ဖြစ်နိုင်ပါတယ်:

```js
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput` က `false` ဆိုရင် — ref ကို node တစ်ခုခုဆီ forward လုပ်မှာ မဟုတ်တော့ဘဲ — `MyInput` ဆီက ref က ဗလာ ဖြစ်နေပါလိမ့်မယ်။ ဒီ condition က တခြား component တစ်ခုရဲ့ အတွင်းမှာ ဝှက်ထားခံရရင် — ဒီဥပမာထဲက `Panel` လိုမျိုးပေါ့ — ဒါကို သတိမထားမိဖို့ အထူးလွယ်ပါတယ်:

```js
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
