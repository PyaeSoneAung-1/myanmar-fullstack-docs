---
title: "useId"
description: "Accessibility attributes တွေအတွက် unique ID တွေ generate လုပ်ပေးတဲ့ React Hook — aria-* attributes တွေနဲ့ တွဲသုံးခြင်း၊ server/client နှစ်ဖက်မှာ ID တူညီမှု ရှိစေခြင်း၊ identifierPrefix နဲ့ apps အများကြား clash မဖြစ်အောင် ကာကွယ်ခြင်း"
order: 60
source: "https://react.dev/reference/react/useId"
status: translated
updated: 2026-09-02
---

`useId` ဆိုတာ — accessibility attributes တွေဆီ ပို့လို့ရတဲ့ unique ID တွေကို generate (ထုတ်လုပ်) ပေးတဲ့ React Hook တစ်ခုပါ။

```js
const id = useId()
```

## ရည်ညွှန်းချက် (Reference)

### `useId()`

Unique ID တစ်ခု generate လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useId` ကို ခေါ်ပါတယ်:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
}
```

#### Parameters

`useId` က parameter တစ်ခုမှ မယူပါဘူး။

#### Returns

`useId` က — ဒီ component ထဲက ဒီ `useId` call နဲ့ သီးခြားဆက်စပ်နေတဲ့ unique ID string တစ်ခုကို ပြန်ပေးပါတယ်။

#### Caveats

- `useId` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ လိုအပ်ရင် — component အသစ်တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- `useId` ကို [use()](/docs/react/use) အတွက် **cache keys တွေ generate လုပ်ဖို့ မသုံးသင့်ပါဘူး**။ Component တစ်ခု mount ဖြစ်နေစဉ် ID က stable ဖြစ်ပေမယ့် — rendering အတွင်း ပြောင်းလဲနိုင်ပါတယ်။ Cache keys တွေကို သင့် data ကနေပဲ generate သင့်ပါတယ်။
- `useId` ကို list ထဲက **keys တွေ ထုတ်ဖို့ မသုံးသင့်ပါဘူး**။ [Keys တွေကို သင့် data ကနေ ထုတ်သင့်ပါတယ်](https://react.dev/learn/rendering-lists#where-to-get-your-key)။
- `useId` ကို [async Server Components](https://react.dev/reference/rsc/server-components) တွေထဲမှာ လောလောဆယ် သုံးလို့ မရသေးပါဘူး။

## အသုံးပြုပုံ (Usage)

> **သတိပြုရန်:** List ထဲက keys တွေထုတ်ဖို့ `useId` ကို မခေါ်ပါနဲ့။ [Keys တွေကို သင့် data ကနေ ထုတ်သင့်ပါတယ်](https://react.dev/learn/rendering-lists#where-to-get-your-key)။

### Accessibility attributes တွေအတွက် unique IDs တွေ ထုတ်ခြင်း

Unique ID တစ်ခု generate လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useId` ကို ခေါ်ပြီး — ရလာတဲ့ ID ကို attributes အမျိုးမျိုးဆီ ပို့လို့ရပါတယ်:

```js
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) လို [HTML accessibility attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) တွေက — tag နှစ်ခု တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေကြောင်း သတ်မှတ်ပေးပါတယ်။ ဥပမာ — element တစ်ခု (input လိုမျိုး) ကို နောက် element တစ်ခု (paragraph လိုမျိုး) က ဖော်ပြနေတယ်လို့ ဆိုလိုတာပါ။

သာမန် HTML မှာဆိုရင် — ဒီလို ရေးပါတယ်:

```html
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

ဒါပေမယ့် — React မှာ ID တွေကို ဒီလို ကိုယ်တိုင် hardcode လုပ်တာက မကောင်းတဲ့ အလေ့အကျင့်ပါ။ Component တစ်ခုက စာမျက်နှာပေါ်မှာ တစ်ကြိမ်ထက်ပိုပြီး render ဖြစ်နိုင်ပေမယ့် — **IDs တွေက unique ဖြစ်ရပါတယ်!** ID ကို hardcode လုပ်မယ့်အစား — `useId` နဲ့ unique ID တစ်ခုကို ထုတ်ပါ:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

အခုဆို — `PasswordField` က screen ပေါ်မှာ အကြိမ်ကြိမ် ပေါ်နေရင်တောင် — generate လုပ်ထားတဲ့ IDs တွေ တစ်ခုနဲ့တစ်ခု clash ဖြစ်တော့မှာ မဟုတ်ပါဘူး။

> **သတိပြုရန်:** [Server rendering](https://react.dev/reference/react-dom/server) နဲ့ သုံးတဲ့အခါ — **`useId` က server နဲ့ client ပေါ်မှာ component tree တစ်ခုတည်း အတိအကျ တူညီနေဖို့ လိုအပ်ပါတယ်။** Server နဲ့ client ပေါ်မှာ render လုပ်တဲ့ trees တွေ အတိအကျ မတူညီရင် — generate လုပ်ထားတဲ့ IDs တွေလည်း မတူတော့ပါဘူး။

#### `useId` က incrementing counter ထက် ဘာကြောင့် ပိုကောင်းတာလဲ

`nextId++` လို global variable တစ်ခုကို တိုးသွားတာထက် `useId` က ဘာကြောင့် ပိုကောင်းလဲလို့ တွေးမိနိုင်ပါတယ်။

`useId` ရဲ့ အဓိက အားသာချက်က — [server rendering](https://react.dev/reference/react-dom/server) နဲ့ အလုပ်လုပ်ဖို့ React က သေချာ စီစဉ်ပေးထားတာပါ။ Server rendering အတွင်း — သင့် components တွေက HTML output ကို ထုတ်ပါတယ်။ နောက်ပိုင်း client ပေါ်မှာ — [hydration](https://react.dev/reference/react-dom/client/hydrateRoot) က သင့် event handlers တွေကို ထုတ်ထားတဲ့ HTML နဲ့ ချိတ်ပါတယ်။ Hydration အလုပ်လုပ်ဖို့ — client ရဲ့ output က server HTML နဲ့ တူညီရပါတယ်။

Incrementing counter တစ်ခုနဲ့ဆို ဒါကို အာမခံဖို့ အရမ်းခက်ပါတယ် — ဘာလို့လဲဆိုတော့ Client Components တွေ hydrate ဖြစ်တဲ့ အစီအစဉ်က server HTML ထုတ်ခဲ့တဲ့ အစီအစဉ်နဲ့ မတူညီနိုင်လို့ပါ။ `useId` ကို ခေါ်ခြင်းဖြင့် — hydration အလုပ်လုပ်မယ်ဆိုတာ ရော — server နဲ့ client ကြားမှာ output တူညီမယ်ဆိုတာပါ သေချာစေပါတယ်။

React အတွင်းမှာ — `useId` ကို ခေါ်နေတဲ့ component ရဲ့ "parent path" ကနေ ထုတ်ပါတယ်။ ဒါကြောင့် — client နဲ့ server tree တွေ တူညီနေရင် — rendering အစီအစဉ် ဘယ်လိုပဲ ဖြစ်နေပါစေ "parent path" တွေ တိုက်ဆိုင်နေမှာ ဖြစ်ပါတယ်။

### ဆက်စပ်နေတဲ့ element တွေ အများကြီးအတွက် IDs တွေ ထုတ်ခြင်း

ဆက်စပ်နေတဲ့ element တွေ အများကြီးကို ID တွေ ပေးဖို့လိုရင် — `useId` ကို တစ်ခါပဲ ခေါ်ပြီး သူတို့အားလုံးအတွက် shared prefix တစ်ခု ထုတ်နိုင်ပါတယ်:

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

ဒါက — unique ID လိုအပ်တဲ့ element တိုင်းအတွက် `useId` ကို တစ်လုံးချင်း ခေါ်နေရတာကို ရှောင်ပေးပါတယ်။

### Generate လုပ်ထားတဲ့ IDs အားလုံးအတွက် shared prefix တစ်ခု သတ်မှတ်ခြင်း

စာမျက်နှာတစ်ခုတည်းပေါ်မှာ React application အများကြီး သီးခြား render လုပ်နေတယ်ဆိုရင် — သင့် [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#parameters) ဒါမှမဟုတ် [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) calls တွေဆီ `identifierPrefix` ကို option အနေနဲ့ ပို့ပါ။ ဒါက — `useId` နဲ့ ထုတ်တဲ့ identifier တိုင်း သင်သတ်မှတ်ထားတဲ့ prefix နဲ့ စတင်မှာမို့ — app နှစ်ခုရဲ့ IDs တွေ ဘယ်တော့မှ clash မဖြစ်အောင် သေချာစေပါတယ်:

```js
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

### Client နဲ့ server ပေါ်မှာ ID prefix တစ်ခုတည်း သုံးခြင်း

စာမျက်နှာတစ်ခုတည်းပေါ်မှာ React apps အများကြီး render လုပ်နေပြီး — တချို့က server-rendered ဖြစ်နေတယ်ဆိုရင် — client ဘက်က [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) call ဆီ ပို့တဲ့ `identifierPrefix` က — [server APIs](https://react.dev/reference/react-dom/server) တွေဖြစ်တဲ့ [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) ဆီ ပို့တဲ့ `identifierPrefix` နဲ့ အတူတူ ဖြစ်နေဖို့ သေချာပါစေ:

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

စာမျက်နှာပေါ်မှာ React app တစ်ခုပဲ ရှိတယ်ဆိုရင် — `identifierPrefix` ပို့စရာ မလိုပါဘူး။
