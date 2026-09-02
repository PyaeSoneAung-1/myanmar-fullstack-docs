---
title: "useFormStatus"
description: "နောက်ဆုံး form submission ရဲ့ status အချက်အလက်တွေ (pending, data, method, action) ကို ပေးတဲ့ react-dom Hook — `<form>` အတွင်းမှာ render လုပ်ထားတဲ့ components တွေက form ရဲ့ အခြေအနေကို သိစေရန်"
order: 73
source: "https://react.dev/reference/react-dom/hooks/useFormStatus"
status: translated
updated: 2026-09-02
---

`useFormStatus` ဆိုတာ — နောက်ဆုံး form submission ရဲ့ status အချက်အလက်တွေကို ပေးတဲ့ react-dom Hook တစ်ခုပါ။

```js
const { pending, data, method, action } = useFormStatus();
```

## ရည်ညွှန်းချက် (Reference)

### `useFormStatus()`

`useFormStatus` Hook က နောက်ဆုံး form submission ရဲ့ status အချက်အလက်တွေကို ပေးပါတယ်:

```js
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Status အချက်အလက်တွေ ရဖို့ — `Submit` component က `<form>` တစ်ခုရဲ့ အတွင်းမှာ render လုပ်ထားရပါမယ်။ Hook က — form က တက်ကြွစွာ submitting ဖြစ်နေလားဆိုတာ ပြောပြတဲ့ `pending` property လို အချက်အလက်တွေကို ပြန်ပေးပါတယ်။

အထက်က ဥပမာမှာ — `Submit` က ဒီအချက်အလက်ကို သုံးပြီး — form submitting ဖြစ်နေချိန်မှာ `<button>` ကို နှိပ်လို့မရအောင် (disabled) လုပ်ထားပါတယ်။

#### Parameters (ပါရာမီတာများ)

`useFormStatus` က ပါရာမီတာ ဘာမှ မယူပါဘူး။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

အောက်ပါ properties တွေ ပါဝင်တဲ့ `status` object တစ်ခုကို ပြန်ပေးပါတယ်:

- `pending` — boolean တစ်ခု။ `true` ဆိုရင် parent `<form>` က submission အတွက် pending (ဆိုင်းငံ့) ဖြစ်နေတယ်လို့ ဆိုလိုပြီး — မဟုတ်ရင် `false` ပါ။
- `data` — parent `<form>` က submit လုပ်နေတဲ့ data တွေ ပါဝင်တဲ့ [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ကို အကောင်အထည်ဖော်ထားတဲ့ object တစ်ခု။ Active submission မရှိဘူး ဒါမှမဟုတ် parent `<form>` မရှိဘူးဆိုရင် — `null` ဖြစ်ပါတယ်။
- `method` — `'get'` ဒါမှမဟုတ် `'post'` ထဲက တစ်ခုဖြစ်တဲ့ string တစ်ခု။ Parent `<form>` က [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) `GET` ဒါမှမဟုတ် `POST` ထဲက ဘယ်ဟာနဲ့ submit လုပ်နေလဲဆိုတာကို ကိုယ်စားပြုပါတယ်။ ပုံမှန်အားဖြင့် `<form>` က `GET` method ကို သုံးပြီး — [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method) property နဲ့ သတ်မှတ်နိုင်ပါတယ်။
- `action` — parent `<form>` ရဲ့ `action` prop ဆီ ပေးထားတဲ့ function ရဲ့ reference တစ်ခု။ Parent `<form>` မရှိရင် — property က `null` ပါ။ `action` prop ဆီ URI value တစ်ခု ပေးထားတယ် ဒါမှမဟုတ် `action` prop ကို လုံးဝ မသတ်မှတ်ထားဘူးဆိုရင် — `status.action` က `null` ဖြစ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `useFormStatus` Hook ကို `<form>` တစ်ခုရဲ့ အတွင်းမှာ render လုပ်ထားတဲ့ component တစ်ခုကနေပဲ ခေါ်ရပါတယ်။
- `useFormStatus` က parent `<form>` တစ်ခုအတွက်ပဲ status အချက်အလက်တွေ ပြန်ပေးပါတယ်။ အဲဒီ component ကိုယ်တိုင် ဒါမှမဟုတ် child components တွေမှာ render လုပ်ထားတဲ့ `<form>` တစ်ခုခုအတွက်တော့ ပြန်မပေးပါဘူး။

## အသုံးပြုပုံ (Usage)

### Form Submission အတွင်း Pending State ပြသခြင်း (Display a pending state during form submission)

Form တစ်ခု submitting ဖြစ်နေချိန်မှာ pending state ပြဖို့ — `<form>` အတွင်းမှာ render လုပ်ထားတဲ့ component တစ်ခုထဲမှာ `useFormStatus` Hook ကို ခေါ်ပြီး — ပြန်ရတဲ့ `pending` property ကို ဖတ်နိုင်ပါတယ်။ ဒီမှာ — form submitting ဖြစ်နေကြောင်း ဖော်ပြဖို့ `pending` property ကို သုံးထားပါတယ်:

```js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

Form submitting ဖြစ်နေချိန်မှာ — `<button>` က disabled ဖြစ်ပြီး label က "Submitting..." ဆိုပြီး ပြောင်းပြပါတယ်။

> **သတိပြုရန်** — `useFormStatus` က Hook ကို ခေါ်နေတဲ့ component ကိုယ်တိုင်မှာ render လုပ်ထားတဲ့ `<form>` အတွက် status အချက်အလက်တွေ ပြန်မပေးပါဘူး။
>
> `useFormStatus` Hook က parent `<form>` အတွက်ပဲ status အချက်အလက်တွေ ပြန်ပေးတာမို့ — Hook ကို ခေါ်နေတဲ့ component ကိုယ်တိုင် ဒါမှမဟုတ် child components တွေမှာ render လုပ်ထားတဲ့ `<form>` တစ်ခုခုအတွက် မဟုတ်ပါဘူး။
>
> ```js
> function Form() {
>   // 🚩 `pending` will never be true
>   // useFormStatus does not track the form rendered in this component
>   const { pending } = useFormStatus();
>   return <form action={submit}></form>;
> }
> ```
>
> အဲဒီအစား — `<form>` ရဲ့ အတွင်းဘက်မှာ တည်ရှိတဲ့ component တစ်ခုကနေ `useFormStatus` ကို ခေါ်ပါ:
>
> ```js
> function Submit() {
>   // ✅ `pending` will be derived from the form that wraps the Submit component
>   const { pending } = useFormStatus();
>   return <button disabled={pending}>...</button>;
> }
>
> function Form() {
>   // This is the <form> `useFormStatus` tracks
>   return (
>     <form action={submit}>
>       <Submit />
>     </form>
>   );
> }
> ```

### Submit လုပ်နေတဲ့ Form Data တွေကို ဖတ်ခြင်း (Read the form data being submitted)

`useFormStatus` ကနေ ပြန်ရတဲ့ status အချက်အလက်ထဲက `data` property ကို သုံးပြီး — user က ဘာ data တွေ submit လုပ်နေလဲ ပြသနိုင်ပါတယ်။ ဒီမှာ — user တွေ username တစ်ခု တောင်းဆိုလို့ရတဲ့ form တစ်ခု ရှိပြီး — သူတို့ တောင်းဆိုလိုက်တဲ့ username ကို အတည်ပြုပေးတဲ့ ယာယီ status message တစ်ခု ပြဖို့ `useFormStatus` ကို သုံးထားပါတယ်:

```js
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

ဒီ `UsernameForm` component ကို — `<form>` element တစ်ခုရဲ့ အတွင်းမှာ render လုပ်ထားပါတယ် (App ထဲမှာ) — ဒါကြောင့် `useFormStatus` က အဲဒီ form ရဲ့ status ကို ခြေရာခံပြီး — `data?.get("username")` က input ထဲ တရိုက်ထည့်ထားတဲ့ username ကို ပြန်ပေးပါတယ်:

```js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### `status.pending` က ဘယ်တော့မှ `true` မဖြစ်ဘူး

`useFormStatus` က parent `<form>` တစ်ခုအတွက်ပဲ status အချက်အလက်တွေ ပြန်ပေးပါတယ်။

`useFormStatus` ကို ခေါ်နေတဲ့ component က `<form>` တစ်ခုရဲ့ အတွင်းမှာ nested ဖြစ်မနေဘူးဆိုရင် — `status.pending` က အမြဲ `false` ပြန်ပေးပါလိမ့်မယ်။ `useFormStatus` ကို `<form>` element တစ်ခုရဲ့ child ဖြစ်တဲ့ component တစ်ခုထဲမှာ ခေါ်ထားကြောင်း သေချာအောင် စစ်ဆေးပါ။

`useFormStatus` က — component ကိုယ်တိုင်မှာ render လုပ်ထားတဲ့ `<form>` တစ်ခုရဲ့ status ကိုလည်း ခြေရာခံ မပေးပါဘူး။ အသေးစိတ်အတွက် အထက်က "သတိပြုရန်" box မှာ ကြည့်ပါ။
