---
title: "useTransition"
description: "UI တစ်စိတ်တစ်ပိုင်းကို background မှာ render လုပ်နိုင်တဲ့ React Hook — isPending flag နဲ့ startTransition function ကို ပြန်ပေးခြင်း၊ Actions သုံးပြီး non-blocking updates များ၊ loading indicators မလိုအပ်တဲ့ UI transitions တွေ ဆောက်ခြင်း"
order: 61
source: "https://react.dev/reference/react/useTransition"
status: translated
updated: 2026-09-02
---

`useTransition` ဆိုတာ — UI တစ်စိတ်တစ်ပိုင်းကို background မှာ render လုပ်ခွင့်ပေးတဲ့ React Hook တစ်ခုပါ။

```js
const [isPending, startTransition] = useTransition()
```

## ရည်ညွှန်းချက် (Reference)

### `useTransition()`

State updates တချို့ကို Transitions အဖြစ် မှတ်သားဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useTransition` ကို ခေါ်ပါတယ်:

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

#### Parameters

`useTransition` က parameter တစ်ခုမှ မယူပါဘူး။

#### Returns

`useTransition` က item နှစ်ခု အတိအကျ ပါတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်:

1. `isPending` flag — Transition တစ်ခု ဆက်လက် လုပ်ဆောင်နေသေးလား ဆိုတာကို ပြောပြတဲ့ flag ပါ။
2. `startTransition` function — update တစ်ခုကို Transition အဖြစ် မှတ်သားဖို့ သုံးတဲ့ function ပါ။

---

### `startTransition(action)`

`useTransition` က ပြန်ပေးတဲ့ `startTransition` function က update တစ်ခုကို Transition အဖြစ် မှတ်သားနိုင်စေပါတယ်:

```js
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

> **မှတ်ချက် — `startTransition` ထဲမှာ ခေါ်တဲ့ functions တွေကို "Actions" လို့ ခေါ်ပါတယ်:**
>
> `startTransition` ဆီ ပို့လိုက်တဲ့ function ကို "Action" လို့ ခေါ်ပါတယ်။ ထုံးစံအရ — `startTransition` အတွင်းမှာ ခေါ်တဲ့ callback တိုင်း (callback prop လိုမျိုး) ကို `action` လို့ နာမည်ပေးသင့်ပြီး — ဒါမှမဟုတ် "Action" suffix ထည့်သင့်ပါတယ်:

```js
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}
```

#### Parameters

- `action` — [`set` functions](/docs/react/use-state) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ခေါ်ကာ state တချို့ကို update လုပ်တဲ့ function တစ်ခုပါ။ React က `action` ကို argument မပါဘဲ ချက်ချင်း ခေါ်ပြီး — `action` function run နေစဉ်အတွင်း synchronously schedule လုပ်လိုက်တဲ့ state updates အားလုံးကို Transitions အဖြစ် မှတ်သားပါတယ်။ `action` ထဲမှာ awaited လုပ်ထားတဲ့ async calls တွေလည်း Transition ထဲ ပါဝင်ပေမယ့် — လောလောဆယ်တော့ `await` နောက်မှာ ရှိတဲ့ `set` functions တွေကို နောက်ထပ် `startTransition` တစ်ခုနဲ့ ထုပ်ပေးဖို့ လိုပါတယ် (အောက်က Troubleshooting မှာ ကြည့်ပါ)။ Transition အဖြစ် မှတ်သားထားတဲ့ state updates တွေက non-blocking ဖြစ်ပြီး — မလိုလားအပ်တဲ့ loading indicators တွေကိုလည်း ပြမှာ မဟုတ်ပါဘူး (အောက်က Usage section တွေမှာ အသေးစိတ် ကြည့်ပါ)။

#### Returns

`startTransition` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats

- `useTransition` က Hook တစ်ခုမို့ — components ဒါမှမဟုတ် custom Hooks တွေထဲမှာပဲ ခေါ်လို့ရပါတယ်။ တခြားနေရာ (data library တစ်ခုကနေ စတာမျိုး) မှာ Transition စတင်ဖို့လိုရင် — သီးခြား [startTransition](/docs/react/start-transition) ကို သုံးပါ။
- Update တစ်ခုကို Transition ထဲ ထုပ်နိုင်ဖို့ — အဲဒီ state ရဲ့ `set` function ကို လက်လှမ်းမီဖို့ လိုပါတယ်။ Prop ဒါမှမဟုတ် custom Hook value တစ်ခုကို တုံ့ပြန်ဖို့ Transition စတင်ချင်ရင်တော့ [useDeferredValue](https://react.dev/reference/react/useDeferredValue) ကို စဉ်းစားကြည့်ပါ။
- `startTransition` ဆီ ပို့တဲ့ function ကို ချက်ချင်း ခေါ်ပြီး — သူ run နေစဉ်အတွင်း ဖြစ်ပျက်တဲ့ state updates အားလုံးကို Transitions အဖြစ် မှတ်သားပါတယ်။ ဥပမာ — `setTimeout` ထဲမှာ state update လုပ်ဖို့ ကြိုးစားရင် — အဲဒါတွေက Transition အဖြစ် မှတ်သားခံရမှာ မဟုတ်ပါဘူး။
- Async request တစ်ခုခု ပြီးနောက်မှာ ရှိတဲ့ state updates တွေကို Transition အဖြစ် မှတ်သားဖို့ — နောက်ထပ် `startTransition` တစ်ခုနဲ့ ထုပ်ပေးရပါတယ်။ ဒါက နောင်မှာ ပြုပြင်မယ့် သိထားပြီးသား limitation တစ်ခုပါ (Troubleshooting မှာ ကြည့်ပါ)။
- `startTransition` function ရဲ့ identity က stable မို့ — Effect dependencies တွေထဲကနေ ချန်လှပ်ထားလေ့ ရှိပါတယ် — ထည့်ထားရင်လည်း Effect က ပြန် run မဖြစ်စေပါဘူး။
- Transition အဖြစ် မှတ်သားထားတဲ့ state update တစ်ခုကို တခြား state updates တွေက ကြားဖြတ် ရပ်တန့်နိုင်ပါတယ်။ ဥပမာ — Transition ထဲမှာ chart component တစ်ခုကို update လုပ်နေတုန်း — chart re-render လုပ်နေချိန်မှာ input ထဲ စရိုက်လိုက်ရင် — React က input update ကို ကိုင်တွယ်ပြီးမှ chart ရဲ့ rendering အလုပ်ကို အစကနေ ပြန်စပါတယ်။
- Transition updates တွေကို text inputs တွေကို ထိန်းချုပ်ဖို့ သုံးလို့ မရပါဘူး။
- Transitions အများကြီး တစ်ပြိုင်နက် လုပ်ဆောင်နေရင် — React က လောလောဆယ် အကုန် အတူတူ batch လုပ်ပါတယ်။ ဒါက နောင်ထွက်ရှိမှုမှာ ဖယ်ရှားနိုင်တဲ့ limitation တစ်ခုပါ။

## အသုံးပြုပုံ (Usage)

### Actions နဲ့ non-blocking updates တွေ လုပ်ဆောင်ခြင်း

Actions တွေ ဖန်တီးပြီး pending state ကို လက်လှမ်းမီဖို့ — သင့် component ရဲ့ ထိပ်မှာ `useTransition` ကို ခေါ်ပါတယ်:

```js
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` က item နှစ်ခု ပါတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်:

1. `isPending` flag — Transition တစ်ခု ဆက်လက် လုပ်ဆောင်နေသေးလား ဆိုတာ ပြောပြတဲ့ flag ပါ။
2. `startTransition` function — Action တစ်ခု ဖန်တီးဖို့ သုံးတဲ့ function ပါ။

Transition တစ်ခု စတင်ဖို့ — `startTransition` ဆီ function တစ်ခုကို ဒီလို ပို့ပါ:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

`startTransition` ဆီ ပို့လိုက်တဲ့ function ကို "Action" လို့ ခေါ်ပါတယ်။ Action တစ်ခုထဲမှာ state ကို update လုပ်လို့ရပြီး — side effects တွေကိုလည်း (ချင်ရင်) လုပ်လို့ရပါတယ် — အလုပ်တွေကို background မှာ လုပ်ဆောင်လို့ page ပေါ်က user interactions တွေကို မပိတ်ဆို့စေပါဘူး။ Transition တစ်ခုထဲမှာ Actions အများကြီး ပါဝင်နိုင်ပြီး — Transition လုပ်ဆောင်နေစဉ်အတွင်း သင့် UI က တုံ့ပြန်မှု ရှိနေပါတယ်။ ဥပမာ — user က tab တစ်ခုကို click ပြီး စိတ်ပြောင်းလို့ နောက် tab တစ်ခုကို ထပ် click လိုက်ရင် — ဒုတိယ click ကို ပထမ update ပြီးအောင် မစောင့်ဘဲ ချက်ချင်း ကိုင်တွယ်ပါတယ်။

လုပ်ဆောင်ဆဲ Transitions တွေအကြောင်း user ကို အသိပေးဖို့ — `isPending` state က `startTransition` ပထမဆုံး ခေါ်ချိန်မှာ `true` ပြောင်းပြီး — Actions အားလုံး ပြီးစီးကာ နောက်ဆုံး state ကို user မြင်ရတဲ့အထိ `true` အတိုင်း ရှိနေပါတယ်။

**Action သုံးတာနဲ့ သာမန် event handling သုံးတာရဲ့ ကွာခြားချက်** — Action ထဲမှာ update လုပ်တဲ့အခါ: request တွေ လုပ်ဆောင်နေချိန်မှာ pending "Total" state ကို ပြပြီး — နောက်ဆုံး request ပြီးမှသာ "Total" က update ဖြစ်ပါတယ်။ Request လုပ်ဆောင်နေတုန်းမှာလည်း "quantity" ကို ဆက်ပြီး update လုပ်နိုင်ပါတယ်။ Action မသုံးဘဲ သာမန် event handler နဲ့ဆိုရင် — `isPending` ကို ကိုယ်တိုင် manage လုပ်ရပြီး — click တစ်ချက်ချင်းစီအတွက် "Total" က အကြိမ်ကြိမ် update ဖြစ်ကာ — အများအားဖြင့် update လုပ်နေချိန်မှာ input ကို disable လုပ်ထားရလို့ app က နှေးတယ်လို့ ခံစားရစေပါတယ်။

ဒါပေမယ့် — ဒီပုံစံမျိုးက request တွေ အစီအစဉ်မကျဘဲ ပြီးဆုံးတာကို ကိုင်တွယ်မပေးနိုင်တာ သတိပြုပါ (အောက်က Troubleshooting မှာ ကြည့်ပါ)။ သာမန် use cases တွေအတွက် React က — [useActionState](https://react.dev/reference/react/useActionState)၊ [form actions](https://react.dev/reference/react-dom/components/form) နဲ့ [Server Functions](https://react.dev/reference/rsc/server-functions) လို built-in abstractions တွေ ပံ့ပိုးပေးထားပါတယ် — ဒါတွေက request ordering ကို သင့်အတွက် ကိုင်တွယ်ပေးပါတယ်။

### Component တွေကနေ `action` prop ထုတ်ပေးခြင်း

Component တစ်ခုကနေ `action` prop တစ်ခုကို ထုတ်ပေးပြီး — parent တစ်ခုက Action တစ်ခုကို ခေါ်နိုင်အောင် လုပ်နိုင်ပါတယ်။ ဥပမာ — ဒီ `TabButton` component က သူ့ရဲ့ `onClick` logic ကို `action` prop ထဲမှာ ထုပ်ထားပါတယ်:

```js
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Parent က သူ့ရဲ့ state ကို `action` အတွင်းမှာ update လုပ်တာမို့ — အဲဒီ state update က Transition အဖြစ် မှတ်သားခံရပါတယ်။ ဆိုလိုတာက — "Posts" ကို click ပြီး ချက်ချင်း "Contact" ကို ထပ် click လုပ်လည်း — user interactions တွေ မပိတ်ဆို့ပါဘူး။

> **မှတ်ချက်:** Component တစ်ခုကနေ `action` prop ထုတ်ပေးတဲ့အခါ — အဲဒါကို transition အတွင်းမှာ `await` လုပ်ထားသင့်ပါတယ်။ ဒါက — `action` callback က synchronous ဖြစ်ဖြစ် asynchronous ဖြစ်ဖြစ် — `await` ကို ထုပ်ဖို့ နောက်ထပ် `startTransition` တစ်ခု မလိုအပ်ဘဲ အလုပ်လုပ်စေပါတယ်။

### Pending visual state တစ်ခု ပြသခြင်း

`useTransition` က ပြန်ပေးတဲ့ `isPending` boolean ကို သုံးပြီး — Transition တစ်ခု လုပ်ဆောင်နေကြောင်း user ကို အချက်ပြနိုင်ပါတယ်။ ဥပမာ — tab button မှာ "pending" ဆိုတဲ့ အထူး visual state တစ်ခု ထားနိုင်ပါတယ်:

```js
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

ဒီလိုဆို — "Posts" ကို click လုပ်တာက ပိုပြီး တုံ့ပြန်မှု မြန်တယ်လို့ ခံစားရပါတယ် — ဘာလို့လဲဆိုတော့ tab button ကိုယ်တိုင်က ချက်ချင်း update ဖြစ်လို့ပါ။

### မလိုလားအပ်တဲ့ loading indicators တွေကို ကာကွယ်ခြင်း

ဒီဥပမာမှာ — `PostsTab` component က [use](https://react.dev/reference/react/use) နဲ့ data ကို ယူပါတယ်။ "Posts" tab ကို click လုပ်တဲ့အခါ — `PostsTab` က *suspend* ဖြစ်ပြီး — အနီးဆုံး loading fallback ကို ပြပါတယ်။ Tab container တစ်ခုလုံးကို ဖျောက်ပြီး loading indicator ပြတာက — user အတွက် ရုတ်တရက် ပြောင်းသွားသလို (jarring) ခံစားရစေတဲ့ experience ပါ။

`TabButton` ထဲကို `useTransition` ထည့်လိုက်ရင် — loading indicator အစား — tab button ထဲမှာကိုပဲ pending state ကို ပြနိုင်ပါတယ်။ "Posts" ကို click လုပ်တာက — tab container တစ်ခုလုံးကို spinner နဲ့ အစားမထိုးတော့ပါဘူး။

Transitions က *ပြပြီးသား* content (tab container လိုမျိုး) ကို မဖျောက်ဖို့ အတိုင်းအတာတစ်ခုအထိပဲ "စောင့်ပေးပါတယ်"။ Posts tab မှာ [nested `<Suspense>` boundary](https://react.dev/reference/react/Suspense) တစ်ခု ရှိနေရင်တော့ — Transition က အဲဒါအတွက် "စောင့်" ပေးမှာ မဟုတ်ပါဘူး။ [Transitions တွေကို Suspense နဲ့ တွဲသုံးခြင်းအကြောင်း ပိုဖတ်ပါ](https://react.dev/reference/react/Suspense#preventing-already-revealed-content-from-hiding)။

### Suspense-enabled router တစ်ခု တည်ဆောက်ခြင်း

React framework ဒါမှမဟုတ် router တစ်ခု တည်ဆောက်နေတယ်ဆိုရင် — page navigations တွေကို Transitions အဖြစ် မှတ်သားဖို့ အကြံပြုပါတယ်:

```js
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

ဒီလိုလုပ်ဖို့ အကြောင်းပြချက် သုံးခု ရှိပါတယ်:

- **Transitions တွေက ကြားဖြတ်ရပ်တန့်လို့ရတယ်** — re-render ပြီးအောင် မစောင့်ဘဲ user က ချက်ချင်း တခြားနေရာကို click သွားနိုင်ပါတယ်။
- **Transitions တွေက မလိုလားအပ်တဲ့ loading indicators တွေကို ကာကွယ်ပေးတယ်** — navigation မှာ ရုတ်တရက် ပြောင်းသွားတာမျိုး ရှောင်နိုင်ပါတယ်။
- **Transitions တွေက pending actions အားလုံး ပြီးအောင် စောင့်ပေးတယ်** — စာမျက်နှာအသစ် မပြခင် side effects တွေ ပြီးစီးအောင် စောင့်နိုင်ပါတယ်။

[Suspense-enabled](https://react.dev/reference/react/Suspense) routers တွေက navigation updates တွေကို Transitions ထဲ ပုံမှန် ထုပ်ပေးဖို့ မျှော်လင့်ရပါတယ်။

### Error boundary တစ်ခုနဲ့ user ကို error ပြသခြင်း

`startTransition` ဆီ ပို့ထားတဲ့ function တစ်ခုက error တစ်ခု throw လုပ်ခဲ့ရင် — [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) တစ်ခုနဲ့ အဲဒီ error ကို user ကို ပြနိုင်ပါတယ်။ Error boundary သုံးဖို့ — သင်က `useTransition` ခေါ်နေတဲ့ component ကို error boundary တစ်ခုထဲမှာ ထုပ်ပါ။ `startTransition` ဆီ ပို့ထားတဲ့ function က error ဖြစ်တာနဲ့ — error boundary ရဲ့ fallback ကို ပြပါလိမ့်မယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Transition ထဲမှာ input တစ်ခုကို update လုပ်လို့ အလုပ်မလုပ်တာ

Input တစ်ခုကို ထိန်းချုပ်တဲ့ state variable အတွက် Transition ကို သုံးလို့ မရပါဘူး:

```js
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

ဘာလို့လဲဆိုတော့ — Transitions တွေက non-blocking ဖြစ်ပေမယ့် — change event ကို တုံ့ပြန်တဲ့ input update က synchronous ဖြစ်သင့်လို့ပါ။ စာရိုက်တာကို တုံ့ပြန်ပြီး Transition run ချင်ရင် — ရွေးစရာ နှစ်ခု ရှိပါတယ်:

1. State variable နှစ်ခု သီးခြား ကြေညာပါ — input state (အမြဲ synchronous update ဖြစ်တဲ့ဟာ) နဲ့ Transition ထဲမှာ update လုပ်မယ့်ဟာ တစ်ခု။ ဒါဆို input ကို synchronous state နဲ့ ထိန်းချုပ်ပြီး — Transition state variable ကို (input နောက်ကို "လိုက်နောက်ကျနေမယ့်") ကျန် rendering logic တွေဆီ ပို့လို့ရပါတယ်။
2. တစ်နည်းအားဖြင့် — state variable တစ်ခုတည်း ထားပြီး — တကယ့် value နောက်ကို "လိုက်နောက်ကျ" နေမယ့် [useDeferredValue](https://react.dev/reference/react/useDeferredValue) ထပ်ထည့်ပါ။ အဲဒါက value အသစ်ကို "အမီလိုက်" ဖို့ non-blocking re-renders တွေကို အလိုအလျောက် trigger လုပ်ပါလိမ့်မယ်။

### React က ငါ့ရဲ့ state update ကို Transition တစ်ခုအနေနဲ့ မသတ်မှတ်ဘူး

State update တစ်ခုကို Transition ထဲ ထုပ်တဲ့အခါ — အဲဒါက `startTransition` call ရဲ့ *အတွင်းမှာ* ဖြစ်ပျက်နေဖို့ သေချာပါစေ:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

`startTransition` ဆီ ပို့တဲ့ function က synchronous ဖြစ်ရပါတယ်။ ဒီလို မှတ်သားလို့ မရပါဘူး:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

ဒီလိုတော့ လုပ်လို့ရပါတယ်:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

### `await` ပြီးနောက်က state update ကို React က Transition အဖြစ် မသတ်မှတ်ဘူး

`startTransition` function တစ်ခုထဲမှာ `await` သုံးတဲ့အခါ — `await` ပြီးနောက်မှာ ဖြစ်ပျက်တဲ့ state updates တွေက Transitions အဖြစ် မှတ်သားခံရမှာ မဟုတ်ပါဘူး။ `await` တစ်ခုချင်းစီ နောက်မှာရှိတဲ့ state updates တွေကို `startTransition` call တစ်ခုနဲ့ ထုပ်ပေးရပါတယ်:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

ဒါကတော့ အလုပ်လုပ်ပါတယ်:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

ဒါက — async context ရဲ့ scope ကို React က ဆုံးရှုံးသွားလို့ ဖြစ်တဲ့ JavaScript limitation တစ်ခုပါ။ နောင်မှာ [AsyncContext](https://github.com/tc39/proposal-async-context) ရနိုင်တဲ့အခါ — ဒီ limitation ကို ဖယ်ရှားသွားမှာ ဖြစ်ပါတယ်။

### Component အပြင်ကနေ `useTransition` ခေါ်ချင်တယ်

Component အပြင်ကနေ `useTransition` ခေါ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒါက Hook တစ်ခုမို့ပါ။ ဒီကိစ္စမှာ — သီးခြား [startTransition](/docs/react/start-transition) method ကို သုံးပါ။ အလုပ်လုပ်ပုံက အတူတူပါပဲ — ဒါပေမယ့် `isPending` indicator ကိုတော့ မပေးပါဘူး။

### ငါ `startTransition` ဆီ ပို့တဲ့ function က ချက်ချင်း execute ဖြစ်နေတယ်

ဒီ code ကို run ရင် — 1, 2, 3 လို့ ပုံနှိပ်ပါလိမ့်မယ်:

```js
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1, 2, 3 လို့ ပုံနှိပ်တာက မျှော်လင့်ထားတဲ့အတိုင်းပါ။** `startTransition` ဆီ ပို့တဲ့ function ကို ရွှေ့ဆိုင်းထားတာ မဟုတ်ပါဘူး။ Browser ရဲ့ `setTimeout` နဲ့ မတူဘဲ — callback ကို နောက်မှ မခေါ်ပါဘူး။ React က သင့် function ကို ချက်ချင်း execute လုပ်ပြီး — *သူ run နေစဉ်အတွင်း* schedule လုပ်လိုက်တဲ့ state updates တွေကိုပဲ Transitions အဖြစ် မှတ်သားပါတယ်။ React အလုပ်လုပ်ပုံရဲ့ ရိုးရှင်းတဲ့ version တစ်ခုအနေနဲ့ ဒီလို မြင်ယောင်ကြည့်နိုင်ပါတယ်:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### Transitions ထဲက ငါ့ရဲ့ state updates တွေ အစီအစဉ်ပျက်နေတယ်

`startTransition` အတွင်းမှာ `await` လုပ်ရင် — updates တွေ အစီအစဉ်ပျက်ပြီး ဖြစ်ပျက်တာကို မြင်ရနိုင်ပါတယ်။ အကြိမ်များများ click လုပ်တဲ့အခါ — နောက်ပိုင်း request တွေပြီးမှ အရင် request တွေ နောက်ကျပြီး ပြီးဆုံးသွားနိုင်ပါတယ်။ ဒီလိုဖြစ်ရင် — React မှာ ရည်ရွယ်ထားတဲ့ အစီအစဉ်ကို သိဖို့ လောလောဆယ် နည်းလမ်း မရှိပါဘူး — updates တွေကို asynchronously schedule လုပ်လို့ — async boundary တစ်လျှောက် အစီအစဉ်ရဲ့ context ကို React က ဆုံးရှုံးလို့ပါ။

ဒါက မျှော်လင့်ထားတဲ့အတိုင်းပါ — Transition တစ်ခုထဲက Actions တွေက execution order ကို အာမခံချက် မပေးလို့ပါ။ သာမန် use cases တွေအတွက် — React က [useActionState](https://react.dev/reference/react/useActionState) နဲ့ [form actions](https://react.dev/reference/react-dom/components/form) လို — ordering ကို ကိုင်တွယ်ပေးတဲ့ higher-level abstractions တွေ ပံ့ပိုးပေးပါတယ်။ အဆင့်မြင့် use cases တွေအတွက်တော့ — ကိုယ်ပိုင် queuing နဲ့ abort logic တွေ ကိုယ်တိုင် ရေးသုံးဖို့ လိုပါလိမ့်မယ်။
