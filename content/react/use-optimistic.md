---
title: "useOptimistic"
description: "Action တစ်ခု လုပ်ဆောင်နေချိန်မှာ UI ကို ချက်ချင်း optimistic ပုံစံ update လုပ်ပြနိုင်တဲ့ React Hook — pending Actions မရှိရင် မူရင်း value ကို ပြန် ပြ၊ Action အတွင်းမှာ set function (နဲ့ optional reducer) သုံးပြီး ယာယီ state ပြခြင်း"
order: 66
source: "https://react.dev/reference/react/useOptimistic"
status: translated
updated: 2026-09-02
---

`useOptimistic` ဆိုတာ — UI ကို optimistic ပုံစံ (ရလဒ်ကို မစောင့်ဘဲ ချက်ချင်း မျှော်လင့်ထားတဲ့အတိုင်း) update လုပ်ပြနိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

## ရည်ညွှန်းချက် (Reference)

### `useOptimistic(value, reducer?)`

Value တစ်ခုအတွက် optimistic state ဖန်တီးဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useOptimistic` ကို ခေါ်ပါတယ်:

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

**Parameters (ပါရာမီတာများ)**

- `value` — pending Actions မရှိတဲ့အခါ ပြန်ပေးတဲ့ value။
- `reducer` (**optional**) — optimistic state ဘယ်လို update ဖြစ်မလဲ သတ်မှတ်ပေးတဲ့ `(currentState, action)` function။ **Pure** ဖြစ်ရပြီး — next optimistic state ကို ပြန်ပေးရပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)** — value နှစ်ခုပါတဲ့ array:

1. `optimisticState` — လက်ရှိ optimistic state။ Action တစ်ခု pending မဖြစ်ရင် `value` နဲ့ ညီပြီး — pending ဖြစ်ရင် `reducer` ရဲ့ ရလဒ် (reducer မပေးရင် set function ဆီ ပေးလိုက်တဲ့ value) နဲ့ ညီပါတယ်။
2. `setOptimistic` — Action တစ်ခုရဲ့ အတွင်းမှာ optimistic state ကို update လုပ်ဖို့ set function တစ်ခု။

### `set` functions

`useOptimistic` ကနေ ပြန်ရတဲ့ set function က — [Action](https://react.dev/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) တစ်ခု လုပ်ဆောင်နေတဲ့ ကာလအတွက် state ကို update လုပ်ပေးပါတယ်။ Next state ကို တိုက်ရိုက်ဖြစ်စေ၊ ယခင် state ကနေ တွက်ယူတဲ့ function အနေနဲ့ဖြစ်စေ ပို့လို့ရပါတယ်:

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

**Caveats (သတိပြုရမည့်အချက်များ)**

- Set function ကို [Action](https://react.dev/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) တစ်ခုရဲ့ **အတွင်းမှာပဲ** ခေါ်ရပါတယ်။ Action အပြင်မှာ ခေါ်ရင် — React က warning ပြပြီး optimistic state က ခဏပဲ ပေါ်ပြီး ပြန်ပျောက်သွားပါတယ်။
- `optimisticState` အနေနဲ့ function တစ်ခု ပေးရင် — အဲဒါကို *updater function* အဖြစ် သဘောတယ်ပြီး — pending state ကို တစ်ခုတည်းသော argument အဖြစ် ယူကာ — next optimistic state ပြန်ပေးရပါတယ် ([`useState` updaters](/docs/react/use-state) နဲ့ ဆင်တူ — React က updater တွေကို queue လုပ်ပြီး re-render လုပ်ပါတယ်)။
- Set functions တွေက ဘာမှ ပြန်မပေးပါဘူး။

**Optimistic state ဘယ်လို အလုပ်လုပ်လဲ — အနှစ်ချုပ်**

Action တစ်ခု လုပ်ဆောင်နေချိန်မှာ ယာယီ value တစ်ခုကို ပြဖို့ `useOptimistic` ကို သုံးပါတယ်:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

Update တွေ စီးဆင်းပုံ — ① `setOptimistic('b')` ခေါ်တာနဲ့ React က `'b'` ကို ချက်ချင်း render လုပ်တယ်။ ② Action ထဲမှာ `await` လုပ်ထားရင် React က `'b'` ကို ဆက်ပြနေတယ်။ ③ `setValue(newValue)` က real state အတွက် update ကို စီစဉ်ပေးတယ်။ ④ `newValue` က suspend ဖြစ်ရင်တောင် `'b'` ကို ဆက်ပြနေတယ်။ ⑤ နောက်ဆုံးမှာ Transition ပြီးတာနဲ့ `value` ရော `optimistic` ပါ `newValue` တစ်ခုတည်းနဲ့ commit ဖြစ်သွားတယ် — optimistic state ကို "ရှင်းဖို့" render အပို မလိုပါဘူး။

Optimistic state က **ယာယီ**ပါ — Action လုပ်ဆောင်နေတုန်းမှာပဲ ပေါ်ပြီး — ကျန်တဲ့အချိန်တွေမှာ `value` ကိုပဲ ပြပါတယ်။ `saveChanges` က `'c'` ပြန်ပေးရင် `value` ရော `optimistic` ပါ `'c'` ဖြစ်သွားမှာ ဖြစ်ပြီး `'b'` မဟုတ်ပါဘူး။

နောက်ဆုံး state ကို ဘယ်လို ဆုံးဖြတ်လဲ: (က) **Hardcoded values** (`useOptimistic(false)` လို) — Action ပြီးရင် state က မူလအတိုင်းပဲ ရှိနေလို့ pending states တွေအတွက် အသုံးဝင်တယ်။ (ခ) **Props/state တွေ ပို့ထားရင်** (`useOptimistic(isLiked)` လို) — Action အတွင်းမှာ parent က value ကို update လုပ်ရင် — ရလဒ်ကို Action ပြီးချိန်မှာ UI က ထင်ဟပ်ပြတယ်။ (ဂ) **Reducer pattern** (`useOptimistic(items, fn)` လို) — Action pending အတွင်း `items` ပြောင်းရင် React က reducer ကို items အသစ်နဲ့ ပြန် run ပြီး — optimistic additions တွေက data အသစ်ပေါ်မှာ အမြဲ တည်နေစေတယ်။

**Action မအောင်မြင်ရင် ဘာဖြစ်လဲ?** Action က error throw လုပ်ရင် Transition က ပြီးဆုံးသွားပြီး — React က လက်ရှိ `value` နဲ့ပဲ render လုပ်ပါတယ်။ Parent က ပုံမှန်အားဖြင့် အောင်မြင်မှသာ `value` ကို update လုပ်တာမို့ — မအောင်မြင်ရင် UI က optimistic update မလုပ်ခင် မြင်နေရတဲ့ပုံအတိုင်း ပြန်ပြပြီး — error ကို catch လုပ်ပြီး message ပြနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Component တစ်ခုကို optimistic state ထည့်ခြင်း

`useOptimistic` က array တစ်ခုကို ပြန်ပေးပါတယ် — (၁) optimistic state (ကနဦးမှာ value နဲ့ ညီ)၊ (၂) Action အတွင်းမှာ state ကို ယာယီပြောင်းဖို့ set function (reducer ပေးထားရင် optimistic state ပြန်မပေးခင် reducer က run ပါမယ်)။ Optimistic state ကို သုံးဖို့ — Action တစ်ခုအတွင်းမှာ set function ကို ခေါ်ပါတယ်:

```js
function onAgeChange(e) {
  startTransition(async () => {
    setOptimisticAge(42);
    const newAge = await postAge(42);
    setAge(newAge);
  });
}
```

React က `age` က မူလအတိုင်း ရှိနေတုန်း — optimistic state `42` ကို အရင် render လုပ်ပါတယ်။ Action က POST ပြီးတာနဲ့ — `newAge` ကို `age` ရော `optimisticAge` ပါ နှစ်ခုလုံးအတွက် render လုပ်ပါတယ်။

> **မှတ်ချက်:** [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) တွေကို သုံးတဲ့အခါ — set function ကို `startTransition` မပါဘဲ တိုက်ရိုက် ခေါ်လို့ရပါတယ်။ ဘာလို့လဲဆိုတော့ — Action props တွေက ကတည်းက `startTransition` အတွင်းမှာ ခေါ်ခံထားရလို့ပါ။

### Action props တွေမှာ optimistic state သုံးခြင်း

ဒီဥပမာမှာ — `<form>` ကို submit လုပ်တာနဲ့ `optimisticName` က server request လုပ်ဆောင်နေတုန်း `newName` ကို ချက်ချင်း ပြပါတယ်။ Request ပြီးတာနဲ့ — `name` ရော `optimisticName` ပါ response ကရတဲ့ actual `updatedName` နဲ့ ပြန်တူသွားပါတယ်:

```js
import { useOptimistic, startTransition } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, action }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    startTransition(() => {
      action(updatedName);
    })
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      {/* ... */}
    </form>
  );
}
```

ဒီပုံစံမျိုးနဲ့ပဲ — button တစ်ခုထဲမှာ pending state ကို ချက်ချင်း ပြနိုင်ပါတယ်: `const [isPending, setIsPending] = useOptimistic(false);` ပြီးရင် click handler ထဲမှာ `startTransition(async () => { setIsPending(true); await action(); })` လို့ ခေါ်လိုက်ရုံပါပဲ — Action ပြီးတာနဲ့ `isPending` က `false` အဖြစ် အလိုအလျောက် ပြန်ဖြစ်သွားပြီး — "Submitting..." လို state တွေ ပြနိုင်ပါတယ်။ `action` prop ထဲက အရာအားလုံး ပြီးသည်အထိ pending state က ပေါ်နေမှာ ဖြစ်ပါတယ်။ ([`useTransition`](/docs/react/use-transition) ကိုလည်း `isPending` အတွက် သုံးနိုင်ပါတယ် — ကွာတာက `useTransition` က `startTransition` function ကို ပေးပြီး — `useOptimistic` ကတော့ ဘယ် Transition နဲ့မဆို အလုပ်လုပ်ပါတယ်။)

### Multiple values တွေကို အတူတကွ update လုပ်ခြင်း (reducer သုံးပြီး)

Optimistic update တစ်ခုက ဆက်စပ်နေတဲ့ value တွေ အများကြီးကို ထိခိုက်ရင် — သူတို့ကို အတူတကွ update လုပ်ဖို့ reducer တစ်ခုကို သုံးပါ။ ဒါက UI က ညီညွတ်နေအောင် သေချာစေပါတယ်။ ဒီ follow button က follow state ရော follower count ပါ နှစ်ခုလုံးကို update လုပ်ပါတယ်:

```js
export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

Reducer က `isFollowing` value အသစ်ကို လက်ခံပြီး — follow state အသစ် ရော follower count ပါ တစ်ကြိမ်တည်းနဲ့ တွက်ပေးလို့ — button text ရော count ပါ အမြဲ sync ဖြစ်နေပါတယ်။

**Updaters နဲ့ reducers ကြား ရွေးချယ်ခြင်း:** Setter ကိုယ်တိုင်က update ကို သဘာဝကျကျ ဖော်ပြနိုင်ရင် **updater function** (`setOptimistic(current => !current)` လို) ကို သုံးပါ။ Update ကို လုပ်ဖို့ data တွေ ပို့ဖို့လို တာ သို့မဟုတ် update အမျိုးအစား အများကြီးကို hook တစ်ခုတည်းနဲ့ ကိုင်တွယ်ဖို့လိုရင် — **reducer** ကို သုံးပါ။ Reducer တွေက — Transition pending အတွင်း base state (ဥပမာ `todos`) ပြောင်းလဲနိုင်တဲ့အခါ မရှိမဖြစ် အရေးကြီးပါတယ် — ဥပမာ တခြား user တစ်ယောက်က todo ထပ်ထည့်ရင် — React က reducer ကို `todos` အသစ်နဲ့ ပြန် run ပြီး သင့် todo အသစ်က ခေတ်နောက်ကျနေတဲ့ list မိတ္တူပေါ်မဟုတ်ဘဲ — နောက်ဆုံး list ပေါ်မှာ တက်နေအောင် လုပ်ပေးပါတယ်။ Updater function ကတော့ Transition စချိန်က state ကိုပဲ မြင်နိုင်လို့ — async အလုပ်အတွင်း ဖြစ်ပျက်တဲ့ updates တွေကို လွဲချော်စေနိုင်ပါတယ်။

### List ထဲကို optimistic ပုံစံ item ထည့်ခြင်း

List တစ်ခုထဲကို items တွေ optimistically ထည့်ဖို့ reducer သုံးပါ:

```js
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (currentTodos, newTodo) => [
    ...currentTodos,
    { id: newTodo.id, text: newTodo.text, pending: true }
  ]
);

function handleAddTodo(text) {
  const newTodo = { id: crypto.randomUUID(), text: text };
  startTransition(async () => {
    addOptimisticTodo(newTodo);
    await addTodoAction(newTodo);
  });
}
```

Optimistic item တစ်ခုစီမှာ `pending: true` flag ပါလို့ — item တစ်ခုချင်းစီအတွက် loading state ပြနိုင်ပါတယ်။ Server က ပြန်ဖြေပြီး parent က canonical `todos` list ကို saved item နဲ့ update လုပ်တာနဲ့ — optimistic state က pending flag မပါတဲ့ confirmed item အဖြစ် ပြောင်းသွားပါတယ်။ ဒီပုံစံအတိုင်းပဲ — action objects တွေနဲ့ (`{ type: 'add' }` လို) `switch` ပုံစံ reducer သုံးပြီး — add/remove/update စတဲ့ action types အမျိုးမျိုးကိုပါ ကိုင်တွယ်နိုင်ပြီး — ဥပမာ shopping cart တစ်ခုမှာ `pending` flags တွေနဲ့ visual feedback ပြနိုင်ပါတယ်။

**Optimistic delete — error recovery နဲ့:** Item တွေကို optimistically ဖျက်တဲ့အခါ — Action မအောင်မြင်တဲ့ ကိစ္စကိုပါ ကိုင်တွယ်ထားသင့်ပါတယ်။ `try/catch` သုံးပြီး error ကို catch လုပ်ရင် — error message ပြနိုင်ပြီး — React က နောက်ဆုံးမှာ item ကို ပြန်ပြတဲ့အတွက် UI က အလိုအလျောက် roll back ဖြစ်ပြီး item ပြန်ပေါ်လာပါတယ် (reducer က item ကို မဖျက်ဘဲ `deleting: true` လိုမျိုး flag တစ်ခုသာ ပေးထားလို့ပါ)။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "An optimistic state update occurred outside a Transition or Action" error တက်နေတယ်

Optimistic setter function ကို Action တစ်ခုရဲ့ အတွင်းကနေပဲ ခေါ်ရပါတယ်:

```js
// 🚩 Incorrect: outside a Transition
function handleClick() {
  setOptimistic(newValue);  // Warning!
  // ...
}

// ✅ Correct: inside a Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

Action အပြင်မှာ setter ကို ခေါ်ရင် — optimistic state က ခဏပေါ်ပြီး ချက်ချင်း မူရင်း value ဆီ ပြန်ကျသွားပါတယ် — Action run နေချိန်မှာ optimistic state ကို "ထိန်းထား" ပေးမယ့် Transition မရှိလို့ပါ။

### "Cannot update optimistic state while rendering" error တက်နေတယ်

ဒီ error က — component ရဲ့ render phase အတွင်းမှာ optimistic setter ကို ခေါ်လို့ ဖြစ်တာပါ။ Event handlers၊ effects ဒါမှမဟုတ် တခြား callbacks တွေထဲကနေပဲ ခေါ်လို့ရပါတယ် — render ကိုယ်တိုင်ထဲကနေ ခေါ်လို့ မရပါဘူး။

### ငါ့ရဲ့ optimistic updates တွေက stale (ခေတ်နောက်ကျ) values တွေ ပြနေတယ်

Action လုပ်ဆောင်နေချိန်အတွင်း state ပြောင်းနိုင်တယ်ဆိုရင် — setter ကို absolute value တစ်ခု ပေးတာထက် — updater function ဒါမှမဟုတ် reducer သုံးပြီး လက်ရှိ state ပေါ် မူတည်တဲ့ relative update တွေ လုပ်ပါ:

```js
// May show stale data if state changes during Action
setOptimistic(5);  // Always sets to 5, even if count changed

// Better: relative updates handle state changes correctly
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Always adds 1 to whatever the current count is
```

### `useOptimistic` pending ဖြစ်မဖြစ် ဘယ်လို သိနိုင်မလဲ

နည်း သုံးနည်း ရှိပါတယ်: ① `optimistic !== value` ဆိုရင် Transition တစ်ခု လုပ်ဆောင်နေတယ်လို့ သိနိုင်တယ် (`const isPending = optimistic !== value;`)။ ② [`useTransition`](/docs/react/use-transition) သုံးပြီး `isPending` flag ကို ယူနိုင်တယ် (`useTransition` က ကိုယ်တွင်းမှာ `useOptimistic` ကိုပဲ သုံးထားလို့ ဒါက နည်း ① နဲ့ ညီမျှပါတယ်)။ ③ Reducer ထဲမှာ `pending` flag တစ်ခု ထည့်ပြီး — optimistic item တစ်ခုချင်းစီရဲ့ loading state ကို ပြနိုင်တယ်။
