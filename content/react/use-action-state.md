---
title: "useActionState"
description: "Actions တွေကနေ side effects ပါတဲ့ state updates တွေကို စီမံနိုင်တဲ့ React Hook — reducerAction က sync/async ဖြစ်ပြီး side effects လုပ်နိုင်၊ dispatchAction နဲ့ isPending flag ပါ — form actions နဲ့ Server Functions တွေမှာ အသုံးဝင်ခြင်း"
order: 67
source: "https://react.dev/reference/react/useActionState"
status: translated
updated: 2026-09-02
---

`useActionState` ဆိုတာ — [Actions](https://react.dev/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) တွေနဲ့ side effects ပါတဲ့ state updates တွေကို လုပ်ဆောင်နိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

## ရည်ညွှန်းချက် (Reference)

### `useActionState(reducerAction, initialState, permalink?)`

Action တစ်ခုရဲ့ ရလဒ်အတွက် state ဖန်တီးဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useActionState` ကို ခေါ်ပါတယ်:

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

**Parameters (ပါရာမီတာများ)**

- `reducerAction` — Action ကို trigger လုပ်တဲ့အခါ ခေါ်ခံရတဲ့ function။ ခေါ်တဲ့အခါ — ပထမ argument အဖြစ် previous state (ကနဦးမှာ သင်ပေးထားတဲ့ `initialState`၊ နောက်ပိုင်းမှာ သူ့ရဲ့ ယခင် return value) ကို ရပြီး — ဒုတိယ argument အဖြစ် `dispatchAction` ဆီ ပို့လိုက်တဲ့ `actionPayload` ကို ရပါတယ်။
- `initialState` — state ရဲ့ ကနဦး value။ `dispatchAction` ကို ပထမဆုံး ခေါ်ပြီးတာနဲ့ — React က ဒီ argument ကို လျစ်လျူရှုပါတော့တယ်။
- `permalink` (**optional**) — ဒီ form က modify လုပ်တဲ့ page ရဲ့ unique URL တစ်ခု ပါဝင်တဲ့ string။
  - [React Server Components](https://react.dev/reference/rsc/server-components) ပါတဲ့ pages တွေမှာ progressive enhancement (JavaScript မတင်ခင် form အလုပ်လုပ်ခြင်း) အတွက် သုံးပါတယ်။
  - `reducerAction` က [Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခုဖြစ်ပြီး — JavaScript bundle မတင်ခင် form ကို submit လုပ်လိုက်ရင် — browser က လက်ရှိ page URL အစား သတ်မှတ်ထားတဲ့ permalink URL ဆီ navigate လုပ်ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)** — value သုံးခုပါတဲ့ array:

1. **လက်ရှိ state** — ပထမ render မှာ သင်ပေးထားတဲ့ `initialState` နဲ့ တူပြီး — `dispatchAction` ခေါ်ပြီးနောက်မှာ `reducerAction` က ပြန်ပေးတဲ့ value နဲ့ တူပါတယ်။
2. **`dispatchAction`** — [Actions](https://react.dev/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) တွေထဲမှာ ခေါ်တဲ့ function တစ်ခု။
3. **`isPending`** — ဒီ Hook အတွက် dispatch လုပ်ထားတဲ့ Actions တွေ တစ်ခုခု pending ရှိမရှိ ပြောပြတဲ့ flag။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useActionState` က Hook တစ်ခုမို့ — component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ် (loops/conditions တွေထဲ မခေါ်ရ)။
- `dispatchAction` ခေါ်မှု အများကြီးကို React က queue လုပ်ပြီး **တစ်ခုပြီးတစ်ခု (sequentially)** run ပါတယ် — `reducerAction` ခေါ်မှုတိုင်းက ယခင် ခေါ်မှုရဲ့ ရလဒ်ကို လက်ခံရပါတယ်။
- `dispatchAction` က stable identity ရှိတာမို့ — Effect dependencies ထဲက ချန်လိုက်လေ့ ရှိကြပြီး — ထည့်ထားရင်လည်း Effect က ထပ်မပြန် fire ပါဘူး။
- `permalink` သုံးတဲ့အခါ — destination page မှာ တူညီတဲ့ form component (တူညီတဲ့ `reducerAction` နဲ့ `permalink`) render ဖြစ်နေဖို့ လိုပါတယ် — ဒါမှသာ React က state ကို ဘယ်လို ပို့မလဲ သိမှာပါ။ Page က interactive ဖြစ်သွားတာနဲ့ ဒီ parameter က အကျိုးသက်ရောက်မှု မရှိတော့ပါဘူး။
- Server Functions သုံးရင် — `initialState` က [serializable](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values) (plain objects, arrays, strings, numbers စတာမျိုး) ဖြစ်ရပါတယ်။
- `dispatchAction` က error တစ်ခု throw လုပ်ရင် — React က queued actions တွေ အားလုံးကို cancel လုပ်ပြီး — အနီးဆုံး [Error Boundary](/docs/react/component) ကို ပြပါတယ်။
- Actions အများကြီး တစ်ပြိုင်နက် လုပ်ဆောင်နေရင် — React က သူတို့ကို batch လုပ်ပါတယ် (နောင်ထုတ်ဝေမှုမှာ ဖယ်ရှားနိုင်တဲ့ limitation တစ်ခုပါ)။

> **မှတ်ချက်:** `dispatchAction` ကို Action တစ်ခုကနေပဲ ခေါ်ရပါတယ် — [`startTransition`](/docs/react/start-transition) နဲ့ ထုပ်တာပဲဖြစ်ဖြစ် — [Action prop](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) ဆီ ပို့တာပဲဖြစ်ဖြစ် လုပ်ရပါတယ်။ အဲဒီ scope အပြင်ကနေ ခေါ်ရင် — Transition ရဲ့ အစိတ်အပိုင်းအဖြစ် မသတ်မှတ်ခံရဘဲ — development mode မှာ error log တက်ပါတယ်။

### `reducerAction` function

`useActionState` ဆီ ပေးလိုက်တဲ့ `reducerAction` function က — previous state ကို လက်ခံပြီး state အသစ် ပြန်ပေးပါတယ်။ [`useReducer`](/docs/react/use-reducer) ထဲက reducers တွေနဲ့ မတူဘဲ — `reducerAction` က **async ဖြစ်နိုင်ပြီး side effects တွေ လုပ်နိုင်ပါတယ်:**

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

`dispatchAction` ခေါ်လိုက်တိုင်း — React က `reducerAction` ကို `actionPayload` နဲ့ ခေါ်ပါတယ်။ Reducer က data တွေ post လုပ်တာလို side effects တွေ လုပ်ပြီး — state အသစ်ကို ပြန်ပေးပါတယ်။ `dispatchAction` ကို အကြိမ်များစွာ ခေါ်ရင် — React က queue လုပ်ပြီး အစဉ်လိုက် run တာမို့ — ယခင် ခေါ်မှုရဲ့ ရလဒ်က နောက် ခေါ်မှုအတွက် `previousState` ဖြစ်သွားပါတယ်။

**Parameters:** `previousState` — နောက်ဆုံး state (ကနဦးမှာ `initialState` နဲ့ ညီ)။ `actionPayload` (**optional**) — `dispatchAction` ဆီ ပို့လိုက်တဲ့ argument; [`useReducer`](/docs/react/use-reducer) conventions လိုပဲ ပုံမှန်အားဖြင့် type property ပါတဲ့ object တစ်ခု ဖြစ်လေ့ရှိပါတယ်။

**Returns:** `reducerAction` က state အသစ် ပြန်ပေးပြီး — အဲဒီ state နဲ့ re-render လုပ်ဖို့ Transition တစ်ခုကို trigger လုပ်ပါတယ်။

**Caveats:** `reducerAction` က sync ရော async ရော နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ် — notification ပြတာလို sync actions ရော server ကို update ပို့တာလို async actions ပါ လုပ်နိုင်ပါတယ်။ `<StrictMode>` မှာ `reducerAction` ကို နှစ်ခါ မခေါ်ပါဘူး (side effects တွေ လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားလို့)။ Return type က `initialState` ရဲ့ type နဲ့ တိုက်ရိုက် ကိုက်ညီရမယ် (TypeScript က mismatch ရှာတွေ့ရင် state type ကို ရှင်းရှင်းလင်းလင်း annotate လုပ်ပါ)။ `reducerAction` ထဲမှာ `await` ပြီးနောက် state သတ်မှတ်ရင် — လောလောဆယ် state update ကို နောက်ထပ် [`startTransition`](/docs/react/start-transition) တစ်ခုနဲ့ ထုပ်ဖို့ လိုပါသေးတယ်။ Server Functions သုံးရင် `actionPayload` ပါ [serializable](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values) ဖြစ်ရပါမယ်။

**ဘာလို့ `reducerAction` လို့ ခေါ်လဲ:** သူက state အဟောင်းကို state အသစ်အဖြစ် *reduce* လုပ်တာမို့ (`useReducer` လိုပဲ) + Transition အတွင်းမှာ ခေါ်ခံရပြီး side effects လုပ်နိုင်လို့ *Action* ဖြစ်လို့ပါ။ သဘောတရားအရ — `useActionState` က `useReducer` နဲ့ တူပေမယ့် — reducer ထဲမှာ side effects လုပ်လို့ရတဲ့ version ပါ။

## အသုံးပြုပုံ (Usage)

### Action တစ်ခုကို state ထည့်ခြင်း

Component ရဲ့ အပေါ်ဆုံးမှာ `useActionState` ခေါ်ပြီး — Action ရဲ့ ရလဒ်အတွက် state သုံးခု (current state / action dispatcher / pending state) ကို ရယူပါ။ `addToCartAction` ကို ခေါ်ဖို့ — action dispatcher ကို ခေါ်ပါ — React က previous count နဲ့ `addToCartAction` ခေါ်မှုတွေကို queue လုပ်ပါတယ်:

```js
const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
  return await addToCart(prevCount)
}, 0);

function handleClick() {
  startTransition(() => {
    dispatchAction();
  });
}
```

"Add Ticket" ကို click လုပ်တိုင်း — `addToCartAction` ခေါ်မှုတစ်ခု queue တက်ပြီး — React က tickets အားလုံး ထည့်ပြီးသည်အထိ pending state ပြကာ — နောက်ဆုံးမှာ final state နဲ့ re-render လုပ်ပါတယ်။

**Queuing ဘယ်လို အလုပ်လုပ်လဲ:** click တိုင်း `addToCartAction` အသစ် queue တက်ပါတယ်။ နောက် `addToCartAction` ခေါ်မှုကို `prevCount` ပေးနိုင်ဖို့ — ယခင် ခေါ်မှုရဲ့ ရလဒ်ကို စောင့်ရတာမို့ — React က ယခင် Action ပြီးမှသာ နောက် Action ကို ခေါ်ပါတယ် (ဥပမာ 1 စက္ကန့် delay ဆို 4 clicks ≈ 4 စက္ကန့် ကြာပါတယ် — ဒါက `useActionState` ရဲ့ ရည်ရွယ်ချက်ရှိရှိ ဒီဇိုင်းပါ)။ ချက်ချင်း တုံ့ပြန်မှု လိုရင် — [`useOptimistic`](/docs/react/use-optimistic) နဲ့ တွဲသုံးနိုင်ပြီး — ပိုရှုပ်တဲ့ ကိစ္စတွေအတွက် queued actions တွေကို cancel လုပ်တာ ဒါမှမဟုတ် `useActionState` မသုံးတာကို စဉ်းစားနိုင်ပါတယ်။

### Action types အမျိုးမျိုး ကိုင်တွယ်ခြင်း

Action types အမျိုးမျိုးကို ကိုင်တွယ်ဖို့ — `dispatchAction` ဆီ argument တစ်ခု ပို့နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် `switch` statement အနေနဲ့ ရေးလေ့ရှိပြီး — case တစ်ခုချင်းစီမှာ next state တွက်ပြီး ပြန်ပေးပါတယ်:

```js
const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD':   return await addToCart(prevCount);
    case 'REMOVE': return await removeFromCart(prevCount);
  }
  return prevCount;
}

function handleAdd() {
  startTransition(() => {
    dispatchAction({ type: 'ADD' });
  });
}
```

**`useActionState` နဲ့ `useReducer` ကွာခြားချက်:** `useReducer` က သင့် UI ရဲ့ state ကို စီမံဖို့ပါ (reducer က pure ဖြစ်ရမယ်)။ `useActionState` က သင့် Actions တွေရဲ့ state ကို စီမံဖို့ပါ (reducer မှာ side effects လုပ်လို့ရတယ်)။ `useActionState` က ယခင် Action ပေါ် မူတည်ပြီး နောက် Action ကို တွက်ရတာမို့ — ခေါ်မှုတွေကို sequential စီရပါတယ်။ Actions တွေကို parallel လုပ်ချင်ရင် — [`useState`](/docs/react/use-state) နဲ့ [`useTransition`](/docs/react/use-transition) ကို တိုက်ရိုက် သုံးပါ။

### `useOptimistic` နဲ့ တွဲသုံးခြင်း

`useActionState` ကို [`useOptimistic`](/docs/react/use-optimistic) နဲ့ ပေါင်းပြီး — UI မှာ ချက်ချင်း feedback ပြနိုင်ပါတယ်: ဥပမာ — `startTransition` အတွင်းမှာ `setOptimisticCount(c => c + 1)` နဲ့ quantity ကို ချက်ချင်း update ပြပြီး — `dispatchAction({ type: 'ADD' })` က `updateCartAction` ကို queue လုပ်ပါတယ်။ Pending indicator တွေက quantity ရော total ပါ နှစ်ခုလုံးပေါ်မှာ ပေါ်ပြီး — update ကို ဆက်လုပ်ဆောင်နေဆဲဆိုတာ user သိစေပါတယ်။

### Action props တွေနဲ့ သုံးခြင်း

`dispatchAction` function ကို [Action prop](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) ဖော်ထုတ်ထားတဲ့ component တစ်ခုဆီ ပို့ရင် — သင်ကိုယ်တိုင် `startTransition` ဒါမှမဟုတ် `useOptimistic` ခေါ်စရာ မလိုတော့ပါဘူး — Transition တွေ၊ pending state တွေနဲ့ optimistic updates တွေကို အဲဒီ component ထဲက ကိုင်တွယ်ပေးတာမို့ — Action ဆီမှာ *ဘာကို* ပြောင်းမလဲဆိုတာပဲ ပြောရပြီး — *ဘယ်လို* ပြောင်းမလဲဆိုတာ ကိုင်တွယ်ပေးပါတယ်။

### Queued Actions တွေကို cancel လုပ်ခြင်း

`AbortController` တစ်ခုသုံးပြီး — pending Actions တွေကို cancel လုပ်နိုင်ပါတယ် — `abortRef.current.abort()` ခေါ်ပြီး `AbortController` အသစ် ဖန်တီးကာ — `signal` ကို `actionPayload` ထဲ ထည့်ပို့ပါ။ ဒါဆို ဘယ်နှစ်ခါ click လုပ်လုပ် — ယခင် Action တွေ "ပြီးသွားအောင်" လုပ်ပေးလို့ — total က 1 စက္ကန့်အတွင်းမှာ update ဖြစ်ပါတယ်။

> **သတိပြုရန် —** Action တစ်ခုကို abort လုပ်တာက အမြဲတမ်း မလုံခြုံပါဘူး။ ဥပမာ — Action က mutation တစ်ခု (database ထဲ ရေးတာမျိုး) လုပ်နေရင် — network request ကို abort လုပ်တာက server-side ပြောင်းလဲမှုကို ပြန်မဖျက်ပေးပါဘူး။ ဒါကြောင့် `useActionState` က default အနေနဲ့ abort မလုပ်တာပါ — side effect ကို လုံခြုံစွာ လျစ်လျူရှုနိုင်/ပြန်ကြိုးစားနိုင်မှသာ ဒီနည်းကို သုံးသင့်ပါတယ်။

### `<form>` Action props တွေနဲ့ သုံးခြင်း

`dispatchAction` function ကို `<form>` ရဲ့ `action` prop အဖြစ် တိုက်ရိုက် ပို့လို့ရပါတယ် — ဒီလိုသုံးရင် React က submission ကို Transition ထဲမှာ အလိုအလျောက် ထုပ်ပေးလို့ `startTransition` ကိုယ်တိုင် ခေါ်စရာ မလိုပါဘူး။ `reducerAction` က previous state နဲ့ submit လုပ်လိုက်တဲ့ `FormData` ကို လက်ခံရပါတယ်:

```js
async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD':    return await addToCart(prevCount);
    case 'REMOVE': return await removeFromCart(prevCount);
  }
  return prevCount;
}

// ...
<form action={formAction} className="checkout">
  {/* dispatchAction ကို form action ထဲမှာ ခေါ်ပါ */}
</form>
```

[Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခုနဲ့ တွဲသုံးတဲ့အခါ — `useActionState` က server ရဲ့ response ကို hydration မပြီးခင် ပြနိုင်စေပြီး — dynamic content ပါတဲ့ pages တွေမှာ progressive enhancement အတွက် optional `permalink` parameter ကိုလည်း သုံးနိုင်ပါတယ် (ဒါကို ပုံမှန်အားဖြင့် framework က သင်တို့အတွက် ကိုင်တွယ်ပေးပါတယ်)။ Forms တွေမှာ Actions သုံးခြင်း အကြောင်း ပိုသိရင် — [react-dom ရဲ့ `<form>` documentation](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-function) ကို ကြည့်ပါ။

### Errors တွေကို ကိုင်တွယ်ခြင်း

`useActionState` နဲ့ error တွေကို ကိုင်တွယ်ဖို့ နည်း နှစ်နည်း ရှိပါတယ်:

- **သိထားတဲ့ errors** ("quantity not available" လို backend validation errors တွေမျိုး) — `reducerAction` ရဲ့ state ထဲမှာ return လုပ်ပြီး UI မှာ ပြနိုင်ပါတယ်။
- **မသိတဲ့ errors** (`undefined is not a function` လိုမျိုး) — error ကို throw လုပ်နိုင်ပါတယ် — React က queued Actions တွေ အားလုံးကို cancel လုပ်ပြီး — [Error Boundary](/docs/react/component) တစ်ခုဆီ error ကို ပြန်ပို့ပြီး ပြပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### ငါ့ရဲ့ `isPending` flag က update မဖြစ်ဘူး

`dispatchAction` ကို ကိုယ်တိုင် (Action prop ကနေ မဟုတ်ဘဲ) ခေါ်နေရင် — ခေါ်မှုကို [`startTransition`](/docs/react/start-transition) နဲ့ ထုပ်ထားဖို့ သေချာအောင် လုပ်ပါ:

```js
function handleClick() {
  // ✅ Correct: wrap in startTransition
  startTransition(() => {
    dispatchAction();
  });
}
```

`dispatchAction` ကို Action prop တစ်ခုဆီ ပို့ထားရင်တော့ — React က Transition ထဲမှာ အလိုအလျောက် ထုပ်ပေးပါတယ်။

### ငါ့ရဲ့ Action က form data ကို ဖတ်လို့ မရဘူး

`useActionState` သုံးတဲ့အခါ — `reducerAction` က ပထမ argument အနေနဲ့ အပို argument တစ်ခု (previous/initial state) ကို လက်ခံရပါတယ်။ ဒါကြောင့် submit လုပ်လိုက်တဲ့ form data က ပထမ argument မဟုတ်ဘဲ — **ဒုတိယ argument** ဖြစ်သွားပါတယ်:

```js
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

### ငါ့ရဲ့ actions တွေ ကျော်သွားနေတယ်

`dispatchAction` ကို အကြိမ်များစွာ ခေါ်ပြီး တချို့ run မဖြစ်ဘူးဆိုရင် — အစောက `dispatchAction` ခေါ်မှုတစ်ခုက error throw လုပ်ခဲ့လို့ ဖြစ်နိုင်ပါတယ် — `reducerAction` throw လုပ်တာနဲ့ React က နောက်မှာ queue တက်ထားတဲ့ `dispatchAction` ခေါ်မှုတွေ အားလုံးကို skip လုပ်ပါတယ်။ ဒါကို ကိုင်တွယ်ဖို့ — `reducerAction` ထဲမှာ errors တွေကို catch လုပ်ပြီး throw မလုပ်ဘဲ error state ကို return လုပ်ပါ:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

### ငါ့ရဲ့ state က reset မဖြစ်ဘူး

`useActionState` မှာ built-in reset function မပါပါဘူး။ Reset လုပ်ဖို့ — `reducerAction` ထဲမှာ reset signal တစ်ခုကို ကိုင်တွယ်အောင် ဒီဇိုင်းလုပ်နိုင်ပါတယ် (ဥပမာ payload က `null` ဆို `initialState` ပြန်ပေးတာမျိုး) — ဒါမှမဟုတ် `useActionState` သုံးထားတဲ့ component ဆီ `key` prop ထည့်ပြီး state အသစ်နဲ့ remount အောင် လုပ်နိုင်ပါတယ် — `<form>` `action` prop ဆိုရင်တော့ submit ပြီးတိုင်း အလိုအလျောက် reset ဖြစ်ပါတယ်။

### "An async function with useActionState was called outside of a transition." error တက်နေတယ်

ဒီ error က — `dispatchAction` ကို Transition တစ်ခုရဲ့ အပြင်ကနေ ခေါ်လို့ ဖြစ်တာပါ (ဒါဆို `isPending` က မှန်မှန် update မဖြစ်တော့ပါဘူး)။ ပြုပြင်ဖို့ — ခေါ်မှုကို [`startTransition`](/docs/react/start-transition) နဲ့ ထုပ်ပါ — ဒါမှမဟုတ် `dispatchAction` ကို `action` / `formAction` prop ဆီ ပို့ပါ (အဲဒါတွေက Transition ထဲမှာ အလိုအလျောက် ခေါ်ပေးလို့ပါ)။

### "Cannot update action state while rendering" error တက်နေတယ်

Render အတွင်းမှာ `dispatchAction` ကို ခေါ်လို့ မရပါဘူး — ခေါ်ရင် state update တစ်ခု schedule ဖြစ်ပြီး — re-render ကို trigger လုပ်ကာ — အဲဒီ re-render ထဲမှာ `dispatchAction` ပြန်ခေါ်လို့ — infinite loop တက်တာပါ။ Form submission ဒါမှမဟုတ် button click လို **user events တွေကို တုံ့ပြန်တဲ့အခါမှသာ** `dispatchAction` ကို ခေါ်ပါ။
