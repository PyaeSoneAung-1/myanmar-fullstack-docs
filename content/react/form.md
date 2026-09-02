---
title: "form"
description: "သတင်းအချက်အလက် ပေးပို့ဖို့ interactive controls တွေ ဖန်တီးပေးတဲ့ built-in `<form>` component — URL ဒါမှမဟုတ် function လက်ခံတဲ့ `action` prop၊ form Actions (onSubmit / Server Functions) နဲ့ submission ကိုင်တွယ်ပုံများ"
order: 74
source: "https://react.dev/reference/react-dom/components/form"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) က — သတင်းအချက်အလက် ပေးပို့ဖို့ interactive controls တွေ ဖန်တီးနိုင်စေပါတယ်။

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

## ရည်ညွှန်းချက် (Reference)

### `<form>`

သတင်းအချက်အလက် ပေးပို့ဖို့ interactive controls တွေ ဖန်တီးရန် — [browser ရဲ့ built-in `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ကို render လုပ်ပါ။

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

#### Props

`<form>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

- [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL (string) ဒါမှမဟုတ် function တစ်ခု။ `action` ဆီ URL ပေးလိုက်ရင် — form က HTML form component တစ်ခုလို ပြုမူပါတယ်။ Function ပေးလိုက်ရင်တော့ — အဲဒီ function က form submission ကို [Action props pattern](/docs/react/use-transition) အတိုင်း Transition တစ်ခုအတွင်းမှာ ကိုင်တွယ်ပါတယ်။ `action` ဆီ ပေးတဲ့ function က async ဖြစ်နိုင်ပြီး — submit လုပ်လိုက်တဲ့ form ရဲ့ [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ပါဝင်တဲ့ argument တစ်ခုတည်းနဲ့ ခေါ်ခံရပါတယ်။ `action` prop ကို `<button>`၊ `<input type="submit">` ဒါမှမဟုတ် `<input type="image">` component ပေါ်က `formAction` attribute နဲ့ override လုပ်လို့ရပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `action` ဒါမှမဟုတ် `formAction` ဆီ function ပေးလိုက်ရင် — `method` prop ရဲ့ တန်ဖိုး ဘာပဲ ဖြစ်ဖြစ် HTTP method က **POST** ဖြစ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Event handler နဲ့ form submission ကို ကိုင်တွယ်ခြင်း

Form submit ဖြစ်တဲ့အခါ code run လုပ်စေဖို့ — `onSubmit` event handler ဆီ function တစ်ခု ပေးပါ။ ပုံမှန်အားဖြင့် browser က form data ကို လက်ရှိ URL ဆီ ပို့ပြီး page ကို refresh လုပ်ပါတယ် — ဒါကြောင့် အဲဒီ အပြုအမူကို ကျော်လွှားဖို့ [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) ကို ခေါ်ပါ။

ဒီဥပမာက submit လုပ်လိုက်တဲ့ values တွေကို [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) နဲ့ ဖတ်ပါတယ် — field တိုင်းကို သူ့ရဲ့ `name` နဲ့ စုစည်းပေးပါတယ်။ ဒါက inputs တွေကို [uncontrolled](/docs/react/input) ဖြစ်အောင် ထားတာပါ။ [Input ကို state variable နဲ့ control](/docs/react/input) လုပ်မယ်ဆိုရင် — submit ချိန်မှာ `FormData` ကနေ မဟုတ်ဘဲ အဲဒီ state ကနေ ဖတ်ပါ။

```js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

> **မှတ်ချက်:** `onSubmit` နဲ့ form data ဖတ်တာက React version တိုင်းမှာ အလုပ်လုပ်ပြီး — [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event) ကို တိုက်ရိုက် လက်လှမ်းမီလို့ `e.preventDefault()` ခေါ်ပြီး data ကို ကိုယ်တိုင် ဖတ်နိုင်ပါတယ်။ Function ကို `action` prop ဆီ ပေးမယ်ဆိုရင်တော့ — submission က [Transition](/docs/react/use-transition) တစ်ခုအတွင်းမှာ run ပါတယ်။ React က pending state ကို ခြေရာခံပြီး — throw လုပ်လိုက်တဲ့ errors တွေကို အနီးဆုံး error boundary ဆီ ပို့ကာ — form က [`useActionState`](/docs/react/use-action-state) နဲ့ [`useOptimistic`](/docs/react/use-optimistic) တို့နဲ့ တွဲဖက် အလုပ်လုပ်စေပါတယ်။ `action` က [Server Function](https://react.dev/reference/rsc/server-functions) လည်း ဖြစ်နိုင်ပြီး — `onSubmit` ကတော့ Server Function ကို support မလုပ်ပါဘူး။

### `action` prop နဲ့ form submission ကို ကိုင်တွယ်ခြင်း

Form submit ဖြစ်ချိန်မှာ function run စေဖို့ — form ရဲ့ `action` prop ဆီ function တစ်ခု ပေးပါ။ [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ကို argument အဖြစ် လက်ခံရရှိလို့ — form က ပို့လိုက်တဲ့ data တွေကို လှမ်းယူနိုင်ပါတယ်။ ဒါက URL တွေကိုပဲ လက်ခံတဲ့ သမားရိုးကျ [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) နဲ့ မတူပါဘူး။ `onSubmit` နဲ့ မတူဘဲ — `action` က [Transition](/docs/react/use-transition) တစ်ခုအတွင်းမှာ run ပြီး `e.preventDefault()` ခေါ်စရာ မလိုပါဘူး။ `action` function အောင်မြင်ပြီးတာနဲ့ — form ထဲက uncontrolled field elements တွေ အားလုံး reset ဖြစ်သွားပါတယ်။

```js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Server Function နဲ့ form submission ကို ကိုင်တွယ်ခြင်း

Input နဲ့ submit button ပါတဲ့ `<form>` တစ်ခုကို render လုပ်ပြီး — [`'use server'`](https://react.dev/reference/rsc/use-server) နဲ့ မှတ်သားထားတဲ့ Server Function တစ်ခုကို form ရဲ့ `action` prop ဆီ ပေးပါ။

`<form action>` ဆီ Server Function တစ်ခု ပေးထားရင် — JavaScript ဖွင့်မထားဘဲ ဒါမှမဟုတ် code မရောက်ရှိသေးခင် သုံးသူတွေ form ကို submit လုပ်နိုင်ပါတယ်။ Connection နှေးတဲ့သူ၊ စက်ပစ္စည်း အားနည်းတဲ့သူ ဒါမှမဟုတ် JavaScript ပိတ်ထားတဲ့သူတွေအတွက် အကျိုးရှိပြီး — `action` prop ဆီ URL ပေးထားတဲ့ form တွေ အလုပ်လုပ်ပုံနဲ့လည်း ဆင်တူပါတယ်။

`<form>` ရဲ့ action ဆီ data ပေးဖို့ hidden form fields တွေကို သုံးနိုင်ပါတယ် — Server Function ကို [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instance တစ်ခုအနေနဲ့ ဒီ hidden field data တွေနဲ့ ခေါ်ခံရပါတယ်။

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

Hidden form fields အစား — `<form>` ရဲ့ action ဆီ အပို arguments တွေ ထည့်ပေးဖို့ `bind` method ကိုလည်း သုံးနိုင်ပါတယ်။ ဒါက function ဆီ argument အဖြစ် ရောက်လာမယ့် `formData` အပြင် — argument အသစ် (`productId`) တစ်ခုကိုပါ ထပ်တွဲပေးပါလိမ့်မယ်။

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

`<form>` ကို [Server Component](https://react.dev/reference/rsc/use-client) တစ်ခုက render လုပ်ပြီး — [Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခုကို `<form>` ရဲ့ `action` prop ဆီ ပေးလိုက်ရင် — form က [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) ဖြစ်ပါတယ်။

### Form submission အတွင်း pending state ပြသခြင်း

Form တစ်ခု submit လုပ်နေချိန်မှာ pending state ပြဖို့ — `<form>` အတွင်းမှာ render လုပ်ထားတဲ့ component တစ်ခုထဲက `useFormStatus` Hook ကို ခေါ်ပြီး ပြန်ရတဲ့ `pending` property ကို ဖတ်နိုင်ပါတယ်။ ဒီမှာ — form submitting ဖြစ်နေကြောင်း ဖော်ပြဖို့ `pending` property ကို သုံးထားပါတယ်:

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

`useFormStatus` Hook အကြောင်း အသေးစိတ်ကို [reference documentation](/docs/react/use-form-status) မှာ ကြည့်ပါ။

### Form data တွေကို optimistically update လုပ်ခြင်း

`useOptimistic` Hook က — network request လို background operation တစ်ခု မပြီးဆုံးခင် — UI ကို optimistically update လုပ်ဖို့ နည်းလမ်း ပေးပါတယ်။ Form တွေမှာ ဒီနည်းက app ကို ပိုတုံ့ပြန်မြန်တယ်လို့ ခံစားရစေပါတယ် — user က form submit လိုက်ချိန်မှာ server ရဲ့ response ကို မစောင့်ဘဲ — မျှော်လင့်ထားတဲ့ ရလဒ်နဲ့အတူ interface ကို ချက်ချင်း update လုပ်လိုက်လို့ပါ။

ဥပမာ — user က form ထဲ message ရိုက်ပြီး "Send" button နှိပ်လိုက်တာနဲ့ — message က server ဆီ တကယ် မရောက်ရှိသေးခင် list ထဲမှာ "Sending..." label နဲ့ ချက်ချင်း ပေါ်လာပါတယ်။ ဒီ "optimistic" နည်းလမ်းက မြန်ဆန်မှုကို ထင်ဟပ်စေပြီး — form က message ကို background မှာ တကယ် ပို့ဖို့ ကြိုးစားပါတယ်။ Server က message လက်ခံရရှိကြောင်း အတည်ပြုတာနဲ့ — "Sending..." label ကို ဖယ်ရှားလိုက်ပါတယ်။

```js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

### Form submission errors တွေကို ကိုင်တွယ်ခြင်း

တချို့ case တွေမှာ `<form>` ရဲ့ `action` prop က ခေါ်တဲ့ function က error ကို throw လုပ်နိုင်ပါတယ်။ `<form>` ကို Error Boundary တစ်ခုအတွင်းမှာ ထုပ်ပြီး ဒီ errors တွေကို ကိုင်တွယ်နိုင်ပါတယ် — `<form>` ရဲ့ `action` prop ကနေ ခေါ်တဲ့ function က error throw လုပ်ရင် — error boundary ရဲ့ fallback ကို ပြသပါလိမ့်မယ်။

```js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}
```

### JavaScript မပါဘဲ form submission error ပြသခြင်း

JavaScript bundle မရောက်ရှိခင် (progressive enhancement အတွက်) form submission error message ပြသဖို့ ဆိုရင်:

1. `<form>` ကို [Client Component](https://react.dev/reference/rsc/use-client) တစ်ခုက render လုပ်ရပါမယ်
2. `<form>` ရဲ့ `action` prop ဆီ ပေးတဲ့ function က [Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခု ဖြစ်ရပါမယ်
3. error message ပြသဖို့ `useActionState` Hook ကို သုံးရပါမယ်

`useActionState` က parameters နှစ်ခု ယူပါတယ်: [Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခုနဲ့ initial state တစ်ခု။ Returns က state variable တစ်ခုနဲ့ action တစ်ခုပါ။ `useActionState` က ပြန်ပေးတဲ့ action ကို form ရဲ့ `action` prop ဆီ ပေးရပြီး — state variable ကို error message ပြသဖို့ သုံးပါတယ်။ `useActionState` ဆီ ပေးထားတဲ့ Server Function က ပြန်ပေးတဲ့ တန်ဖိုးက state variable ကို update လုပ်ဖို့ သုံးပါတယ်။

```js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

Form action တစ်ခုကနေ state update လုပ်ခြင်းအကြောင်း — [`useActionState`](/docs/react/use-action-state) docs မှာ ပိုဖတ်ပါ။

### Submission အမျိုးအစားမျိုးစုံ ကိုင်တွယ်ခြင်း

Form တွေကို — user နှိပ်လိုက်တဲ့ button ပေါ် မူတည်ပြီး submission action အမျိုးမျိုး ကိုင်တွယ်နိုင်အောင် ဒီဇိုင်းထုတ်လို့ရပါတယ်။ Form အတွင်းက button တစ်ခုစီကို — `formAction` prop နဲ့ သီးခြား action/behavior တစ်ခုနဲ့ ချိတ်ဆက်နိုင်ပါတယ်။

User က button တစ်ခုခုကို နှိပ်လိုက်ရင် — form က submit ဖြစ်ပြီး အဲဒီ button ရဲ့ attributes နဲ့ action နဲ့ ကိုက်ညီတဲ့ action ကို run လုပ်ပါတယ်။ ဥပမာ — form တစ်ခုက article ကို review အတွက် default အနေနဲ့ submit လုပ်ပေမယ့် — draft အဖြစ် သိမ်းဖို့ `formAction` ပါတဲ့ သီးခြား button တစ်ခုလည်း ပါဝင်နိုင်ပါတယ်။

```js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```
