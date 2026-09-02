---
title: "Effect တွေ မလိုတဲ့အခါ"
description: "မလိုအပ်တဲ့ Effects တွေကို ဘာကြောင့် ဖယ်ရှားရလဲ၊ ဘယ်လို ဖယ်ရှားမလဲ — rendering အတွက် data အသွင်ပြောင်းခြင်း၊ useMemo နဲ့ cache လုပ်ခြင်း၊ key နဲ့ state reset လုပ်ခြင်း၊ event handlers အတွင်း logic ထည့်ခြင်း စသည်တို့"
order: 38
source: "https://react.dev/learn/you-might-not-need-an-effect"
status: translated
updated: 2026-09-02
---

Effects တွေက React paradigm ကနေ ထွက်ပြေးဖို့ နောက်ထွက်ပေါက် (escape hatch) တစ်ခုပါ။ သူတို့က သင့်ကို React ရဲ့ "အပြင်ဘက်" ကို လှမ်းထွက်ပြီး — non-React widget တစ်ခု၊ network၊ browser DOM လိုမျိုး — external system တစ်ခုခုနဲ့ — သင့် components တွေကို synchronize လုပ်နိုင်စေပါတယ်။ External system တစ်ခုခု မပါဝင်ဘူးဆိုရင် (ဥပမာ — props ဒါမှမဟုတ် state တစ်ချို့ ပြောင်းတဲ့အခါ component ရဲ့ state ကို update လုပ်ချင်ရင်) — Effect တစ်ခု မလိုသင့်ပါဘူး။ မလိုအပ်တဲ့ Effects တွေကို ဖယ်ရှားလိုက်တာက — သင့် code ကို လိုက်လုပ်ရလွယ်ကူစေပြီး — မြန်ဆန်စေကာ — အမှားအယွင်း ဖြစ်နိုင်ခြေလည်း နည်းစေပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- သင့် components တွေကနေ မလိုအပ်တဲ့ Effects တွေကို ဘာကြောင့် ဖယ်ရှားရလဲ၊ ဘယ်လို ဖယ်ရှားမလဲ
- Effects မပါဘဲ စရိတ်ကြီးတဲ့ တွက်ချက်မှုတွေကို ဘယ်လို cache လုပ်မလဲ
- Effects မပါဘဲ component state တွေကို ဘယ်လို ပြန်လည်သတ်မှတ်၊ ချိန်ညှိမလဲ
- Event handlers တွေကြားမှာ logic တွေကို ဘယ်လို မျှဝေမလဲ
- ဘယ် logic တွေကို event handlers တွေဆီ ရွှေ့သင့်လဲ
- ပြောင်းလဲမှုတွေအကြောင်း parent components တွေကို ဘယ်လို အကြောင်းကြားမလဲ

## မလိုအပ်တဲ့ Effects တွေကို ဖယ်ရှားခြင်း

Effects တွေ မလိုတဲ့ ကိစ္စ အဖြစ်များ နှစ်မျိုး ရှိပါတယ်:

- **Rendering အတွက် data အသွင်ပြောင်းဖို့ Effects တွေ မလိုပါဘူး။** ဥပမာ — list တစ်ခုကို မပြခင် filter လုပ်ချင်တယ်ဆိုပါစို့။ List ပြောင်းတဲ့အခါ — state variable တစ်ခုကို update လုပ်ပေးမယ့် Effect တစ်ခု ရေးဖို့ စိတ်ကူးမိနိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက ထိရောက်မှု မရှိပါဘူး။ State ကို update လုပ်တဲ့အခါ — React က screen ပေါ်မှာ ဘာတွေ ရှိသင့်လဲ တွက်ချက်ဖို့ — သင့် component functions တွေကို အရင်ဆုံး ခေါ်ပါတယ်။ ပြီးရင် — React က ဒီပြောင်းလဲမှုတွေကို DOM ဆီ ["commit"](/docs/react/render-and-commit) လုပ်ပြီး — screen ကို update လုပ်ပါတယ်။ ပြီးမှ — React က သင့် Effects တွေကို run ပါတယ်။ သင့် Effect ကလည်း state ကို ချက်ချင်း update လုပ်ရင် — ဒီဖြစ်စဉ်တစ်ခုလုံးကို အစကနေ ပြန်စရပါတယ်! မလိုအပ်တဲ့ render passes တွေ ရှောင်ဖို့ — data အားလုံးကို သင့် components ရဲ့ top level မှာ အသွင်ပြောင်းပါ။ အဲဒီ code က သင့် props ဒါမှမဟုတ် state ပြောင်းတိုင်း အလိုအလျောက် ပြန် run ပါလိမ့်မယ်။
- **User events တွေကို ကိုင်တွယ်ဖို့ Effects တွေ မလိုပါဘူး။** ဥပမာ — user က product တစ်ခု ဝယ်တဲ့အခါ — `/api/buy` POST request တစ်ခု ပို့ပြီး — notification တစ်ခု ပြချင်တယ်ဆိုပါစို့။ Buy button ရဲ့ click event handler ထဲမှာ — ဘာတွေ ဖြစ်ခဲ့လဲဆိုတာ သင်အတိအကျ သိပါတယ်။ Effect တစ်ခု run ဖို့ အချိန်ရောက်တဲ့အခါ — user က ဘာလုပ်ခဲ့လဲ (ဥပမာ — ဘယ် button ကို နှိပ်ခဲ့လဲ) ဆိုတာ သင်မသိတော့ပါဘူး။ ဒါကြောင့်ပဲ — user events တွေကို သက်ဆိုင်ရာ event handlers တွေထဲမှာပဲ မကြာခဏ ကိုင်တွယ်ပါလိမ့်မယ်။

External systems တွေနဲ့ [synchronize](/docs/react/synchronizing-with-effects) လုပ်ဖို့တော့ — Effects တွေ *လိုအပ်ပါတယ်*။ ဥပမာ — jQuery widget တစ်ခုကို React state နဲ့ sync ဖြစ်နေအောင် ထားပေးတဲ့ Effect တစ်ခု ရေးနိုင်ပါတယ်။ Effects တွေနဲ့ data ကိုလည်း fetch လုပ်နိုင်ပါတယ်: ဥပမာ — search results တွေကို လက်ရှိ search query နဲ့ synchronize လုပ်နိုင်ပါတယ်။ သတိထားစရာက — ခေတ်မီ [frameworks](/docs/react/creating-a-react-app) တွေက — သင့် components တွေထဲမှာ Effects တွေ တိုက်ရိုက်ရေးတာထက် — ပိုထိရောက်တဲ့ built-in data fetching ယန္တရားတွေ ပေးထားပါတယ်။

မှန်ကန်တဲ့ intuition ရလာအောင် — လက်တွေ့ ဥပမာ တချို့ကို ကြည့်ကြရအောင်!

### Props ဒါမှမဟုတ် State ကိုအခြေခံပြီး State Update လုပ်ခြင်း

state variable နှစ်ခုဖြစ်တဲ့ — `firstName` နဲ့ `lastName` — ရှိတဲ့ component တစ်ခု ရှိတယ်ဆိုပါစို့။ သူတို့နှစ်ခုကို ဆက်စပ်ပြီး `fullName` တစ်ခုကို တွက်ချင်တယ်ဆိုပါစို့။ ဒါ့အပြင် — `firstName` ဒါမှမဟုတ် `lastName` ပြောင်းတိုင်း `fullName` ကိုပါ update ဖြစ်စေချင်ပါတယ်။ သင့်ရဲ့ ပထမဆုံး ဗီဇက — `fullName` state variable တစ်ခု ထည့်ပြီး — Effect တစ်ခုထဲမှာ update လုပ်ဖို့ ဖြစ်နိုင်ပါတယ်:

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

ဒါက လိုအပ်တာထက် ပိုရှုပ်ထွေးပါတယ်။ ထိရောက်မှုလည်း မရှိပါဘူး: `fullName` အတွက် တန်ဖိုးဟောင်း (stale) တစ်ခုနဲ့ render pass တစ်ခုလုံး လုပ်ပြီးမှ — update လုပ်ထားတဲ့ တန်ဖိုးနဲ့ ချက်ချင်း နောက်တစ်ကြိမ် re-render လုပ်ပါတယ်။ State variable ရော Effect ပါ ဖယ်လိုက်ပါ:

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**တစ်ခုခုကို ရှိပြီးသား props ဒါမှမဟုတ် state ကနေ တွက်လို့ရရင် — [သူ့ကို state ထဲ မထည့်ပါနဲ့](/docs/react/choosing-the-state-structure)။ အဲဒီအစား — rendering လုပ်နေစဉ်မှာ တွက်ချက်ပါ။** ဒါက သင့် code ကို ပိုမြန်စေပြီး (မလိုတဲ့ "cascading" updates တွေ ရှောင်လို့) — ပိုရိုးရှင်းစေကာ ("cascading" code တချို့ ဖယ်လိုက်လို့) — အမှားအယွင်း ဖြစ်နိုင်ခြေလည်း နည်းစေပါတယ် (state variable မတူညီတာတွေ တစ်ခုနဲ့တစ်ခု sync မကိုက်လို့ ဖြစ်တဲ့ bugs တွေ ရှောင်လို့)။ ဒီချဉ်းကပ်နည်းက သင့်အတွက် အသစ်ဖြစ်နေရင် — [Thinking in React](/docs/react/thinking-in-react) မှာ state ထဲ ဘာတွေ ထည့်သင့်လဲ ရှင်းပြထားပါတယ်။

### စရိတ်ကြီးတဲ့ တွက်ချက်မှုတွေကို Cache လုပ်ခြင်း

ဒီ component က — props ကနေ ရတဲ့ `todos` တွေကို — `filter` prop အရ filter လုပ်ပြီး — `visibleTodos` ကို တွက်ချက်ပါတယ်။ ရလဒ်ကို state ထဲ သိမ်းပြီး — Effect တစ်ခုကနေ update လုပ်ဖို့ စိတ်ကူးမိနိုင်ပါတယ်:

```js
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

ယခင် ဥပမာလိုပဲ — ဒါက မလိုအပ်သလို — ထိရောက်မှုလည်း မရှိပါဘူး။ ပထမဆုံး — state ရော Effect ပါ ဖယ်လိုက်ပါ:

```js
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

ပုံမှန်အားဖြင့် — ဒီ code က အဆင်ပြေပါတယ်! ဒါပေမယ့် — `getFilteredTodos()` က နှေးနေတာ ဒါမှမဟုတ် သင့်မှာ `todos` အများကြီး ရှိနေတာ ဖြစ်နိုင်ပါတယ်။ အဲဒီအခါ — `newTodo` လိုမျိုး မသက်ဆိုင်တဲ့ state variable တစ်ခုခု ပြောင်းတိုင်း — `getFilteredTodos()` ကို ပြန်တွက်မချင်တော့ပါဘူး။

ပိုကုန်ကျစရိတ်ကြီးတဲ့ တွက်ချက်မှုတစ်ခုကို [`useMemo`](https://react.dev/reference/react/useMemo) Hook ထဲ ထုပ်ပြီး — cache (ဒါမှမဟုတ် ["memoize"](https://en.wikipedia.org/wiki/Memoization)) လုပ်နိုင်ပါတယ်:

> **မှတ်ချက်:** [React Compiler](https://react.dev/learn/react-compiler) က စရိတ်ကြီးတဲ့ တွက်ချက်မှုတွေကို သင့်အတွက် အလိုအလျောက် memoize လုပ်ပေးနိုင်လို့ — ကိစ္စ အများစုမှာ manual `useMemo` မလိုအပ်တော့ပါဘူး။

```js
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

ဒါမှမဟုတ် — line တစ်ကြောင်းတည်းနဲ့ ရေးရင်:

```js
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**ဒါက React ကို — `todos` ဒါမှမဟုတ် `filter` တစ်ခုခု ပြောင်းမှသာ — အတွင်း function ကို ပြန် run ချင်တယ်လို့ ပြောနေတာပါ။** React က ကနဦး render အတွင်း `getFilteredTodos()` ရဲ့ return value ကို မှတ်မိထားပါလိမ့်မယ်။ နောက် renders တွေမှာ — `todos` ဒါမှမဟုတ် `filter` ကွဲပြားမှု ရှိမရှိ စစ်ပါလိမ့်မယ်။ သူတို့က ယခင်အတိုင်းပဲ တူနေရင် — `useMemo` က သိမ်းထားတဲ့ နောက်ဆုံး ရလဒ်ကို ပြန်ပေးပါလိမ့်မယ်။ ဒါပေမယ့် — ကွဲပြားရင်တော့ — React က အတွင်း function ကို ပြန်ခေါ်ပြီး (သူ့ရဲ့ ရလဒ်ကို သိမ်းပါလိမ့်မယ်)။

[`useMemo`](https://react.dev/reference/react/useMemo) ထဲ ထုပ်ထားတဲ့ function က rendering လုပ်နေစဉ်မှာ run လို့ — ဒါက [pure calculations](/docs/react/keeping-components-pure) တွေအတွက်ပဲ အလုပ်လုပ်ပါတယ်။

#### တွက်ချက်မှုတစ်ခု စရိတ်ကြီးလားဆိုတာ ဘယ်လို သိနိုင်မလဲ

ယေဘုယျအားဖြင့် — object ထောင်ပေါင်းများစွာကို ဖန်တီးနေတာ ဒါမှမဟုတ် loop ပတ်နေတာ မဟုတ်ဘူးဆိုရင် — စရိတ်ကြီးဖို့ မဖြစ်နိုင်ပါဘူး။ ပိုသေချာချင်ရင် — code အပိုင်းတစ်ခုမှာ ကုန်ဆုံးတဲ့ အချိန်ကို တိုင်းဖို့ console log တစ်ခု ထည့်နိုင်ပါတယ်:

```js
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

သင်တိုင်းနေတဲ့ interaction ကို လုပ်ဆောင်ပါ (ဥပမာ — input ထဲ ရိုက်ထည့်ပါ)။ ပြီးရင် — သင့် console ထဲမှာ `filter array: 0.15ms` လိုမျိုး logs တွေ တွေ့ရပါလိမ့်မယ်။ Log လုပ်ထားတဲ့ စုစုပေါင်း အချိန်က သိသာတဲ့ ပမာဏ (ဥပမာ — `1ms` ဒါမှမဟုတ် ပို) ဖြစ်နေရင် — အဲဒီ တွက်ချက်မှုကို memoize လုပ်ဖို့ အဓိပ္ပါယ် ရှိနိုင်ပါတယ်။ စမ်းသပ်မှုအနေနဲ့ — တွက်ချက်မှုကို `useMemo` ထဲ ထုပ်ပြီး — အဲဒီ interaction အတွက် စုစုပေါင်း log အချိန် လျော့ကျသွားလားဆိုတာ စစ်နိုင်ပါတယ်:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` က *ပထမဆုံး* render ကို ပိုမြန်အောင် မလုပ်ပါဘူး။ Updates တွေပေါ်မှာ မလိုအပ်တဲ့ အလုပ်တွေကို ကျော်သွားဖို့ပဲ ကူညီပါတယ်။

သင့် machine က သင့် user တွေရဲ့ machine ထက် ပိုမြန်ဖို့ များတာမို့ — performance ကို artificial slowdown တစ်ခုနဲ့ စမ်းသပ်တာ ကောင်းပါတယ်။ ဥပမာ — Chrome မှာ [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option တစ်ခု ရှိပါတယ်။

ဒါ့အပြင် — development ထဲမှာ performance တိုင်းတာတာက အမှန်ကန်ဆုံး ရလဒ်တွေ မပေးနိုင်ဘူးဆိုတာလည်း သတိပြုပါ။ (ဥပမာ — [Strict Mode](https://react.dev/reference/react/StrictMode) ဖွင့်ထားရင် — component တစ်ခုစီကို တစ်ခါမဟုတ်ဘဲ နှစ်ခါ render လုပ်တာ မြင်ရပါလိမ့်မယ်။) အမှန်ကန်ဆုံး အချိန်တွေရဖို့ — production အတွက် app ကို build လုပ်ပြီး — သင့် user တွေလိုမျိုး device တစ်ခုပေါ်မှာ စမ်းသပ်ပါ။

### Prop ပြောင်းတဲ့အခါ State အားလုံးကို ပြန်လည်သတ်မှတ်ခြင်း

ဒီ `ProfilePage` component က `userId` prop တစ်ခုကို လက်ခံပါတယ်။ စာမျက်နှာမှာ comment input တစ်ခု ပါဝင်ပြီး — သူ့ရဲ့ တန်ဖိုးကို သိမ်းဖို့ `comment` state variable တစ်ခုကို သုံးပါတယ်။ တစ်နေ့မှာ — ပြဿနာတစ်ခု သတိပြုမိပါတယ်: profile တစ်ခုကနေ နောက်တစ်ခုဆီ သွားတဲ့အခါ — `comment` state က reset မဖြစ်ပါဘူး။ ရလဒ်အနေနဲ့ — user တစ်ယောက်ရဲ့ profile ပေါ်မှာ မတော်တဆ comment တစ်ခု တင်မိဖို့ လွယ်ကူပါတယ်။ ပြဿနာကို ပြုပြင်ဖို့ — `userId` ပြောင်းတိုင်း `comment` state variable ကို ရှင်းပစ်ချင်ပါတယ်:

```js
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

ဒါက ထိရောက်မှု မရှိပါဘူး — ဘာလို့လဲဆိုတော့ — `ProfilePage` နဲ့ သူ့ရဲ့ children တွေက တန်ဖိုးဟောင်းနဲ့ အရင်ဆုံး render လုပ်ပြီး — နောက်တစ်ကြိမ် ထပ် render လုပ်လို့ပါ။ ရှုပ်ထွေးတာကလည်း — `ProfilePage` ထဲမှာ state ရှိတဲ့ component တိုင်းမှာ ဒါကို လုပ်ရလို့ပါ။ ဥပမာ — comment UI က nested ဖြစ်နေရင် — nested comment state ကိုပါ ရှင်းပစ်ချင်မှာပါ။

အဲဒီအစား — user တစ်ယောက်ချင်းစီရဲ့ profile က အယူအဆအရ *profile မတူညီတဲ့* တစ်ခုဆိုတာ — explicit key တစ်ခု ပေးခြင်းဖြင့် — React ကို ပြောပြနိုင်ပါတယ်။ သင့် component ကို နှစ်ပိုင်း ခွဲပြီး — outer component ကနေ inner component ဆီ `key` attribute တစ်ခု ပို့ပါ:

```js
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

ပုံမှန်အားဖြင့် — component တစ်ခုတည်းကို နေရာတစ်ခုတည်းမှာ render လုပ်ရင် — React က state ကို ထိန်းသိမ်းပါတယ်။ **`Profile` component ဆီ `userId` ကို `key` အနေနဲ့ ပို့လိုက်ခြင်းဖြင့် — `userId` မတူညီတဲ့ `Profile` component နှစ်ခုကို — state မျှဝေလို့ မရတဲ့ — component မတူညီတဲ့ နှစ်ခုအဖြစ် သဘောထားဖို့ React ကို တောင်းဆိုနေတာပါ။** Key (ကို `userId` နဲ့ set ထား) ပြောင်းတိုင်း — React က DOM ကို ပြန်ဖန်တီးပြီး — `Profile` component ရော သူ့ရဲ့ children အားလုံးရဲ့ [state ကိုပါ reset](/docs/react/preserving-and-resetting-state) လုပ်ပါလိမ့်မယ်။ အခုဆိုရင် — profiles တွေကြား သွားလာတဲ့အခါ — `comment` field က အလိုအလျောက် ရှင်းသွားပါလိမ့်မယ်။

ဒီဥပမာမှာ — outer `ProfilePage` component ပဲ export လုပ်ပြီး — project ထဲက တခြား files တွေကို မြင်ရတာ သတိပြုပါ။ `ProfilePage` ကို render လုပ်တဲ့ components တွေက — key ကို သူ့ဆီ ပို့စရာ မလိုပါဘူး: သူတို့က `userId` ကို ပုံမှန် prop အနေနဲ့ပဲ ပို့ပါတယ်။ `ProfilePage` က သူ့ကို inner `Profile` component ဆီ `key` အနေနဲ့ ပို့တာက implementation detail တစ်ခုပါ။

### Prop ပြောင်းတဲ့အခါ State တစ်ချို့ကို ချိန်ညှိခြင်း

တစ်ခါတစ်ရံ — prop ပြောင်းတဲ့အခါ state ရဲ့ အစိတ်အပိုင်းတစ်ချို့ကိုပဲ — အားလုံး မဟုတ်ဘဲ — reset ဒါမှမဟုတ် ချိန်ညှိချင်နိုင်ပါတယ်။

ဒီ `List` component က `items` list တစ်ခုကို prop အနေနဲ့ လက်ခံပြီး — ရွေးချယ်ထားတဲ့ item ကို `selection` state variable ထဲမှာ ထိန်းသိမ်းပါတယ်။ `items` prop က array မတူညီတာ တစ်ခု ရတိုင်း — `selection` ကို `null` အဖြစ် reset လုပ်ချင်ပါတယ်:

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

ဒါလည်း — အကောင်းဆုံး မဟုတ်ပါဘူး။ `items` ပြောင်းတိုင်း — `List` နဲ့ သူ့ရဲ့ child components တွေက — `selection` တန်ဖိုးဟောင်းနဲ့ အရင်ဆုံး render လုပ်ပါလိမ့်မယ်။ ပြီးရင် — React က DOM ကို update လုပ်ပြီး Effects တွေကို run ပါလိမ့်မယ်။ နောက်ဆုံး — `setSelection(null)` call က `List` ရော သူ့ရဲ့ child components တွေရဲ့ နောက်ထပ် re-render တစ်ခုကို ဖြစ်စေပြီး — ဒီဖြစ်စဉ်တစ်ခုလုံးကို ပြန်စေပါတယ်။

Effect ကို ဖျက်ပစ်ခြင်းဖြင့် စတင်ပါ။ အဲဒီအစား — rendering လုပ်နေစဉ်မှာ state ကို တိုက်ရိုက် ချိန်ညှိပါ:

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

ဒီလို [ယခင် renders တွေကနေ အချက်အလက်တွေ သိမ်းထားတာက](/docs/react/use-state) နားလည်ရခက်နိုင်ပေမယ့် — state တစ်ခုတည်းကို Effect တစ်ခုထဲမှာ update လုပ်တာထက် ပိုကောင်းပါတယ်။ အထက်က ဥပမာမှာ — `setSelection` ကို render လုပ်နေစဉ်အတွင်း တိုက်ရိုက် ခေါ်ထားပါတယ်။ React က `List` ကို `return` statement နဲ့ ထွက်ပြီးတာနဲ့ — *ချက်ချင်း* ပြန် re-render လုပ်ပါလိမ့်မယ်။ React က `List` ရဲ့ children တွေကို render လုပ်တာ ဒါမှမဟုတ် DOM ကို update လုပ်တာ မရှိသေးလို့ — `List` ရဲ့ children တွေက `selection` တန်ဖိုးဟောင်းကို render လုပ်တာ ရှောင်နိုင်စေပါတယ်။

Rendering လုပ်နေစဉ်မှာ component တစ်ခုကို update လုပ်တဲ့အခါ — React က ပြန်ပေးထားတဲ့ JSX ကို ပစ်ပြီး — ချက်ချင်း rendering ကို ပြန်ကြိုးစားပါတယ်။ နှေးကွေးတဲ့ cascading retries တွေ ရှောင်ဖို့ — React က rendering လုပ်နေစဉ်မှာ component *တစ်ခုတည်းရဲ့* state ကိုပဲ update လုပ်ခွင့် ပေးပါတယ်။ Render လုပ်နေစဉ်မှာ တခြား component တစ်ခုရဲ့ state ကို update လုပ်ရင် — error တစ်ခု မြင်ရပါလိမ့်မယ်။ Loops တွေ ရှောင်ဖို့ — `items !== prevItems` လိုမျိုး condition တစ်ခုက မရှိမဖြစ် လိုပါတယ်။ State ကို ဒီလိုမျိုး ချိန်ညှိနိုင်ပေမယ့် — တခြား side effects တွေ (DOM ပြောင်းတာ ဒါမှမဟုတ် timeouts သတ်မှတ်တာလိုမျိုး) ကတော့ — [components တွေကို pure ဖြစ်နေအောင်](/docs/react/keeping-components-pure) — event handlers ဒါမှမဟုတ် Effects တွေထဲမှာပဲ ရှိနေရပါမယ်။

**ဒီပုံစံက Effect တစ်ခုထက် ပိုထိရောက်ပေမယ့် — components အများစုမှာတော့ ဒါတောင် မလိုသင့်ပါဘူး။** ဘယ်လိုပဲ လုပ်လုပ် — props ဒါမှမဟုတ် တခြား state ပေါ်မူတည်ပြီး state ကို ချိန်ညှိတာက — သင့် data flow ကို နားလည်ဖို့၊ debug လုပ်ဖို့ ပိုခက်ခဲစေပါတယ်။ [key တစ်ခုနဲ့ state အားလုံးကို reset လုပ်လို့ရလား](/docs/react/preserving-and-resetting-state) ဒါမှမဟုတ် [rendering လုပ်နေစဉ်မှာ အကုန် တွက်လို့ရလား](/docs/react/choosing-the-state-structure) ဆိုတာ အမြဲ စစ်ဆေးကြည့်ပါ။ ဥပမာ — ရွေးထားတဲ့ *item* ကို သိမ်း (ပြီး reset) လုပ်မယ့်အစား — ရွေးထားတဲ့ *item ID* ကို သိမ်းနိုင်ပါတယ်:

```js
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

အခုဆိုရင် state ကို "ချိန်ညှိ" စရာ လုံးဝ မလိုတော့ပါဘူး။ ရွေးထားတဲ့ ID ပါတဲ့ item က list ထဲမှာ ရှိနေရင် — ရွေးထားဆဲပါ။ မရှိရင် — rendering အတွင်း တွက်ထားတဲ့ `selection` က — ကိုက်ညီတဲ့ item မတွေ့လို့ — `null` ဖြစ်ပါလိမ့်မယ်။ ဒီအပြုအမူက ကွဲပြားပေမယ့် — `items` အများစု ပြောင်းလဲမှုတွေက selection ကို ထိန်းသိမ်းပေးတာမို့ — ငြင်းခုံစရာရှိရင်တောင် ပိုကောင်းပါတယ်။

### Event Handlers တွေကြားမှာ Logic မျှဝေခြင်း

သင့်မှာ — product တစ်ခုကို ဝယ်ခွင့်ပေးတဲ့ button နှစ်ခု (Buy နဲ့ Checkout) ပါတဲ့ product page တစ်ခု ရှိတယ်ဆိုပါစို့။ User က product ကို cart ထဲ ထည့်တိုင်း — notification တစ်ခု ပြချင်ပါတယ်။ Button နှစ်ခုလုံးရဲ့ click handlers တွေထဲမှာ `showNotification()` ကို ခေါ်တာက ထပ်ခါထပ်ခါ ဖြစ်နေသလို ခံစားရလို့ — ဒီ logic ကို Effect တစ်ခုထဲမှာ ထားဖို့ စိတ်ကူးမိနိုင်ပါတယ်:

```js
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

ဒီ Effect က မလိုအပ်ပါဘူး။ ဖြစ်နိုင်ခြေ အများဆုံးကတော့ — bugs တွေပါ ဖြစ်စေပါလိမ့်မယ်။ ဥပမာ — သင့် app က page reload တွေကြားမှာ shopping cart ကို "မှတ်မိ" ထားတယ်ဆိုပါစို့။ Product တစ်ခုကို တစ်ခါ ထည့်ပြီး page ကို refresh လုပ်လိုက်ရင် — notification က နောက်တစ်ကြိမ် ပေါ်လာပါလိမ့်မယ်။ အဲဒီ product ရဲ့ page ကို refresh လုပ်တိုင်း — သူ ဆက်ပြီး ပေါ်နေပါလိမ့်မယ်။ ဒါက — page load မှာ `product.isInCart` က `true` ဖြစ်နေပြီးသားမို့ — အထက်က Effect က `showNotification()` ကို ခေါ်လို့ပါ။

**Code တစ်ခုက Effect ထဲမှာ ရှိသင့်လား event handler ထဲမှာ ရှိသင့်လား မသေချာရင် — ဒီ code က *ဘာကြောင့်* run ဖို့ လိုတာလဲလို့ ကိုယ့်ကိုယ်ကို မေးကြည့်ပါ။ Component ကို user ကို ပြသလို့ run သင့်တဲ့ code တွေအတွက်ပဲ Effects တွေကို သုံးပါ။** ဒီဥပမာမှာ — notification က user က *button ကို နှိပ်လို့* ပေါ်သင့်တာပါ — page ကို ပြသလို့ မဟုတ်ပါဘူး! Effect ကို ဖျက်ပြီး — event handler နှစ်ခုလုံးကနေ ခေါ်တဲ့ function တစ်ခုထဲ မျှဝေထားတဲ့ logic ကို ထည့်ပါ:

```js
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

ဒါက မလိုအပ်တဲ့ Effect ကိုပါ ဖယ်ရှားပြီး — bug ကိုပါ ပြုပြင်ပေးပါတယ်။

### POST Request ပို့ခြင်း

ဒီ `Form` component က POST request နှစ်မျိုး ပို့ပါတယ်။ Mount ဖြစ်တဲ့အခါ — analytics event တစ်ခု ပို့ပါတယ်။ Form ကို ဖြည့်ပြီး Submit button ကို နှိပ်လိုက်တဲ့အခါ — `/api/register` endpoint ဆီ POST request တစ်ခု ပို့ပါတယ်:

```js
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

ယခင် ဥပမာတွေမှာ သုံးခဲ့တဲ့ စံနှုန်းတွေကိုပဲ ဒီမှာလည်း ကျင့်သုံးကြည့်ရအောင်။

Analytics POST request ကတော့ Effect ထဲမှာ ဆက်ရှိသင့်ပါတယ်။ ဒါက — analytics event ပို့ရတဲ့ *အကြောင်းရင်းက* form ကို ပြသလို့ ဖြစ်လို့ပါ။ (Development မှာ နှစ်ခါ fire ပါလိမ့်မယ် — ဒါပေမယ့် — အဲဒါကို ကိုင်တွယ်နည်းကို [ဒီမှာ](/docs/react/synchronizing-with-effects) ကြည့်ပါ။)

ဒါပေမယ့် — `/api/register` POST request ကတော့ form ကို *ပြသလို့* ဖြစ်တာ မဟုတ်ပါဘူး။ Request ကို အချိန်တိကျတဲ့ ကာလတစ်ခုမှာပဲ ပို့ချင်ပါတယ်: user က button ကို နှိပ်တဲ့အခါမျိုးမှာပါ။ အဲဒီ *interaction တစ်ခုတည်းမှာပဲ* ဖြစ်သင့်ပါတယ်။ ဒုတိယ Effect ကို ဖျက်ပြီး — အဲဒီ POST request ကို event handler ထဲ ရွှေ့ပါ:

```js
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Logic တစ်ချို့ကို event handler တစ်ခုထဲမှာ ထားမလား Effect တစ်ခုထဲမှာ ထားမလား ရွေးတဲ့အခါ — user ရဲ့ ရှုထောင့်ကနေ — ဒါက *logic အမျိုးအစား ဘာလဲ* ဆိုတဲ့ မေးခွန်းကို ဖြေရပါမယ်။ ဒီ logic က interaction တစ်ခုကြောင့် ဖြစ်ရတာဆိုရင် — event handler ထဲမှာ ထားပါ။ User က component ကို screen ပေါ်မှာ *မြင်လို့* ဖြစ်ရတာဆိုရင် — Effect ထဲမှာ ထားပါ။

### တွက်ချက်မှု ကွင်းဆက်များ (Chains of Computations)

တစ်ခါတစ်ရံ — state တစ်ခုကို တခြား state ပေါ်မူတည်ပြီး တစ်ခုပြီးတစ်ခု ချိန်ညှိတဲ့ Effects တွေကို ကွင်းဆက်လုပ်ဖို့ စိတ်ကူးမိနိုင်ပါတယ်:

```js
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

ဒီ code မှာ ပြဿနာ နှစ်ခု ရှိပါတယ်။

ပထမ ပြဿနာက — သူက အရမ်း ထိရောက်မှု မရှိခြင်းပါ: component (နဲ့ သူ့ရဲ့ children) က ကွင်းဆက်ထဲက `set` call တစ်ခုချင်းစီကြားမှာ re-render လုပ်ရပါတယ်။ အထက်က ဥပမာမှာ — အဆိုးဆုံး အခြေအနေမှာ (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) — အောက်က tree အတွက် re-render မလိုအပ်တဲ့အရာ သုံးခု ရှိနေပါတယ်။

ဒုတိယ ပြဿနာက — နှေးတာတောင် မဟုတ်ဘဲ — သင့် code ဆင့်ကဲ ပြောင်းလဲလာတာနဲ့အမျှ — သင်ရေးထားတဲ့ "ကွင်းဆက်" က လိုအပ်ချက်အသစ်တွေနဲ့ မကိုက်ညီတော့တဲ့ အခြေအနေတွေ ကြုံရပါလိမ့်မယ်။ ဂိမ်းရဲ့ လှုပ်ရှားမှု မှတ်တမ်းတစ်လျှောက် ပြန်လျှောက်နိုင်တဲ့ နည်းလမ်းတစ်ခု ထည့်နေတယ်ဆိုပါစို့။ state variable တစ်ခ်စီကို အတိတ်က တန်ဖိုးတစ်ခုနဲ့ update လုပ်ခြင်းဖြင့် လုပ်မှာပါ။ ဒါပေမယ့် — `card` state ကို အတိတ်က တန်ဖိုးနဲ့ set လုပ်လိုက်တာက — Effect ကွင်းဆက်ကို ပြန် trigger လုပ်ပြီး — သင်ပြနေတဲ့ data တွေကို ပြောင်းပစ်ပါလိမ့်မယ်။ ဒီလို code မျိုးက မကြာခဏ တောင့်တင်းပြီး ပျက်စီးလွယ်ပါတယ်။

ဒီကိစ္စမှာ — rendering လုပ်နေစဉ်မှာ တွက်လို့ရတာတွေကို တွက်ပြီး — state ကို event handler ထဲမှာ ချိန်ညှိတာ ပိုကောင်းပါတယ်:

```js
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

ဒါက အများကြီး ပိုထိရောက်ပါတယ်။ ဒါ့အပြင် — ဂိမ်း မှတ်တမ်းကို ကြည့်နိုင်တဲ့ နည်းလမ်းတစ်ခု အကောင်အထည်ဖော်ရင် — တခြား တန်ဖိုးတွေအားလုံးကို ချိန်ညှိပေးတဲ့ Effect ကွင်းဆက်ကို trigger မလုပ်ဘဲ — state variable တစ်ခ်စီကို အတိတ်က လှုပ်ရှားမှုတစ်ခုနဲ့ set လုပ်နိုင်ပါလိမ့်မယ်။ Event handlers အများအပြားကြားမှာ logic ကို ပြန်သုံးဖို့ လိုရင် — [function တစ်ခု ထုတ်ယူပြီး](/docs/react/events) — အဲဒီ handlers တွေကနေ ခေါ်နိုင်ပါတယ်။

Event handlers တွေအတွင်းမှာ — [state က snapshot တစ်ခုလို ပြုမူတယ်](/docs/react/state-snapshot) ဆိုတာ သတိရပါ။ ဥပမာ — `setRound(round + 1)` ကို ခေါ်ပြီးတာတောင် — `round` variable က user က button နှိပ်လိုက်တဲ့ အချိန်က တန်ဖိုးကိုပဲ ထင်ဟပ်ပါလိမ့်မယ်။ တွက်ချက်မှုတွေအတွက် နောက် တန်ဖိုး လိုအပ်ရင် — `const nextRound = round + 1` လိုမျိုး ကိုယ်တိုင် သတ်မှတ်ပါ။

တစ်ချို့ ကိစ္စတွေမှာ — event handler ထဲမှာ နောက် state ကို တိုက်ရိုက် တွက်လို့ *မရ* နိုင်ပါဘူး။ ဥပမာ — dropdown အများအပြားပါတဲ့ form တစ်ခုမှာ — နောက် dropdown ရဲ့ options တွေက ယခင် dropdown ရဲ့ ရွေးချယ်ထားတဲ့ တန်ဖိုးပေါ်မှာ မူတည်နေတာမျိုးပါ။ အဲဒီအခါ — သင်က network နဲ့ synchronize လုပ်နေတာမို့ — Effect ကွင်းဆက်တစ်ခုက သင့်တော်ပါတယ်။

### Application ကို စတင်ခြင်း (Initialization)

Logic တစ်ချို့က app ကို load လုပ်တဲ့အခါ တစ်ခါပဲ run သင့်ပါတယ်။

သူ့ကို top-level component တစ်ခုထဲက Effect တစ်ခုထဲမှာ ထားဖို့ စိတ်ကူးမိနိုင်ပါတယ်:

```js
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

ဒါပေမယ့် — မကြာခင်မှာ — [ဒါက development မှာ နှစ်ခါ run](/docs/react/synchronizing-with-effects) တာ သင်ရှာတွေ့ပါလိမ့်မယ်။ ဒါက ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ် — ဥပမာ — function ကို နှစ်ခါ ခေါ်ဖို့ ဒီဇိုင်းမလုပ်ထားလို့ — authentication token ကို မလုံမလဲ ဖြစ်စေနိုင်ပါတယ်။ ယေဘုယျအားဖြင့် — သင့် components တွေက remount ခံရတာကို ခံနိုင်ရည်ရှိဖို့ လိုပါတယ်။ ဒါမှာ သင့် top-level `App` component လည်း ပါဝင်ပါတယ်။

Production မှာ လက်တွေ့ကျကျ remount ဖြစ်ချင်မှ ဖြစ်ပေမယ့် — components အားလုံးမှာ တူညီတဲ့ ကန့်သတ်ချက်တွေကို လိုက်နာထားတာက — code တွေကို ရွှေ့ပြောင်း၊ ပြန်သုံးဖို့ ပိုလွယ်ကူစေပါတယ်။ Logic တစ်ချို့က *component mount တစ်ခါစီ* မဟုတ်ဘဲ — *app load တစ်ခါစီ* run ရမယ်ဆိုရင် — သူက execute ဖြစ်ပြီးပြီလားဆိုတာ ခြေရာခံဖို့ top-level variable တစ်ခု ထည့်ပါ:

```js
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

ဒါမှမဟုတ် — module initialization အတွင်း၊ app က render မလုပ်ခင် run နိုင်ပါတယ်:

```js
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Top level မှာရှိတဲ့ code က — သင့် component ကို import လုပ်တာနဲ့ — render ဖြစ်တာတောင် မဟုတ်ဘဲ — တစ်ခါ run ပါတယ်။ ကြိုက်ရာတရား components တွေကို import လုပ်တဲ့အခါ နှေးကွေးမှု ဒါမှမဟုတ် အံ့သြစရာ အပြုအမူတွေ ရှောင်ဖို့ — ဒီပုံစံကို အလွန်အကျွံ မသုံးပါနဲ့။ App-wide initialization logic တွေကို `App.js` လိုမျိုး root component modules တွေ ဒါမှမဟုတ် သင့် application ရဲ့ entry point ထဲမှာပဲ ထားပါ။

### State ပြောင်းလဲမှုအကြောင်း Parent Components တွေကို အကြောင်းကြားခြင်း

`true` ဒါမှမဟုတ် `false` ဖြစ်နိုင်တဲ့ — internal `isOn` state တစ်ခုပါတဲ့ — `Toggle` component တစ်ခု ရေးနေတယ်ဆိုပါစို့။ သူ့ကို toggle လုပ်ဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ် (နှိပ်ခြင်း ဒါမှမဟုတ် ဆွဲယူခြင်း)။ `Toggle` ရဲ့ internal state ပြောင်းတိုင်း — parent component ကို အကြောင်းကြားချင်လို့ — `onChange` event တစ်ခု ထုတ်ပြီး — Effect တစ်ခုကနေ ခေါ်ပါတယ်:

```js
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

အရင်ကလိုပဲ — ဒါက အကောင်းဆုံး မဟုတ်ပါဘူး။ `Toggle` က သူ့ရဲ့ state ကို အရင်ဆုံး update လုပ်ပြီး — React က screen ကို update လုပ်ပါတယ်။ ပြီးရင် — React က Effect ကို run လုပ်ပြီး — အဲဒါက parent component ကနေ ပို့ထားတဲ့ `onChange` function ကို ခေါ်ပါတယ်။ အခုတော့ — parent component က သူ့ကိုယ်ပိုင် state ကို update လုပ်ပြီး — render pass နောက်တစ်ခု စတင်ပါတယ်။ အကုန်လုံးကို pass တစ်ခုတည်းမှာ လုပ်တာ ပိုကောင်းပါလိမ့်မယ်။

Effect ကို ဖျက်ပြီး — *component နှစ်ခုလုံးရဲ့* state ကို event handler တစ်ခုတည်းအတွင်းမှာ update လုပ်ပါ:

```js
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

ဒီချဉ်းကပ်နည်းနဲ့ — `Toggle` component ရော သူ့ရဲ့ parent component ပါ — event အတွင်း သူတို့ရဲ့ state တွေကို update လုပ်ပါတယ်။ React က [component မတူညီတာတွေကနေ updates တွေကို batch လုပ်](/docs/react/queueing-a-series-of-state-updates) လို့ — render pass တစ်ခုတည်းပဲ ရှိပါလိမ့်မယ်။

ပြီးတော့ — state ကို လုံးဝ ဖယ်ရှားပြီး — parent component ဆီကနေ `isOn` ကို လက်ခံတာမျိုးလည်း လုပ်နိုင်ပါလိမ့်မယ်:

```js
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["State ကို lift up လုပ်ခြင်း"](/docs/react/sharing-state-between-components) က parent component ရဲ့ ကိုယ်ပိုင် state ကို toggle လုပ်ခြင်းဖြင့် — `Toggle` ကို parent က အပြည့်အဝ ထိန်းချုပ်နိုင်စေပါတယ်။ ဆိုလိုတာက — parent component မှာ logic ပိုပြီး ပါလာမယ် — ဒါပေမယ့် — စိုးရိမ်စရာ state အလုံးစုံက နည်းသွားပါတယ်။ State variable မတူညီတဲ့ နှစ်ခုကို sync ဖြစ်နေအောင် ထားဖို့ ကြိုးစားတိုင်း — state ကို lift up လုပ်ကြည့်ပါ!

### Parent ဆီ Data ပို့ခြင်း

ဒီ `Child` component က data တစ်ချို့ fetch လုပ်ပြီး — Effect တစ်ခုထဲမှာ — `Parent` component ဆီ ပို့ပါတယ်:

```js
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React မှာ — data တွေက parent components ကနေ သူတို့ရဲ့ children တွေဆီ စီးဆင်းပါတယ်။ Screen ပေါ်မှာ တစ်ခုခု မှားနေတာ တွေ့တဲ့အခါ — prop မှားတာ ဒါမှမဟုတ် state မှားတာ ဘယ် component မှာလဲဆိုတာ ရှာတွေ့ဖို့ — component ကွင်းဆက်တစ်လျှောက် အပေါ်ကို တက်ပြီး — သတင်းအချက်အလက် ဘယ်ကလာလဲ ခြေရာခံနိုင်ပါတယ်။ Child components တွေက Effects တွေထဲမှာ သူတို့ရဲ့ parent components တွေရဲ့ state ကို update လုပ်တဲ့အခါ — data flow ကို ခြေရာခံဖို့ အရမ်းခက်ခဲပါတယ်။ Child ရော parent ပါ data တစ်ခုတည်း လိုအပ်တာမို့ — parent component ကိုယ်တိုင် အဲဒီ data ကို fetch လုပ်ပြီး — child ဆီ *အောက်ကို ပို့ချ* ပါ:

```js
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

ဒါက ပိုရိုးရှင်းပြီး — data flow ကို ကြိုတင်ခန့်မှန်းလို့ ရနေစေပါတယ်: data တွေက parent ကနေ child ဆီ အောက်ကို စီးဆင်းပါတယ်။

### External Store တစ်ခုကို Subscribe လုပ်ခြင်း

တစ်ခါတစ်ရံ — သင့် components တွေက React state ရဲ့ အပြင်ဘက်က data တစ်ချို့ကို subscribe လုပ်ဖို့ လိုနိုင်ပါတယ်။ ဒီ data က third-party library တစ်ခု ဒါမှမဟုတ် built-in browser API တစ်ခုကနေ လာနိုင်ပါတယ်။ ဒီ data က React မသိဘဲ ပြောင်းလဲနိုင်လို့ — သင့် components တွေကို သူ့ဆီ manual နဲ့ subscribe လုပ်ဖို့ လိုပါတယ်။ ဒါကို Effect တစ်ခုနဲ့ မကြာခဏ လုပ်ပါတယ်:

```js
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ဒီနေရာမှာ — component က external data store (ဒီကိစ္စမှာ browser ရဲ့ `navigator.onLine` API) တစ်ခုကို subscribe လုပ်ပါတယ်။ ဒီ API က server ပေါ်မှာ မရှိတာမို့ (ကနဦး HTML အတွက် သုံးလို့မရ) — ကနဦးမှာ state ကို `true` အဖြစ် set ထားပါတယ်။ Browser ထဲမှာ အဲဒီ data store ရဲ့ တန်ဖိုး ပြောင်းတိုင်း — component က သူ့ရဲ့ state ကို update လုပ်ပါတယ်။

ဒါအတွက် Effects တွေ သုံးတာ အဖြစ်များပေမယ့် — React မှာ — ပိုနှစ်သက်စရာဖြစ်တဲ့ — external store တစ်ခုကို subscribe လုပ်ဖို့ ရည်ရွယ်ချက်နဲ့ တည်ဆောက်ထားတဲ့ Hook တစ်ခု ရှိပါတယ်။ Effect ကို ဖျက်ပြီး — [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) ခေါ်တာနဲ့ အစားထိုးပါ:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ဒီချဉ်းကပ်နည်းက — mutable data တွေကို Effect တစ်ခုနဲ့ React state ဆီ manual sync လုပ်တာထက် — အမှားအယွင်း ဖြစ်နိုင်ခြေ ပိုနည်းပါတယ်။ ပုံမှန်အားဖြင့် — component တစ်ခုချင်းစီမှာ ဒီ code ထပ်ခါထပ်ခါ ရေးစရာမလိုအောင် — အထက်က `useOnlineStatus()` လိုမျိုး custom Hook တစ်ခု ရေးပါလိမ့်မယ်။ [React components တွေကနေ external stores တွေကို subscribe လုပ်ခြင်းအကြောင်း ဒီမှာ ပိုဖတ်ပါ။](https://react.dev/reference/react/useSyncExternalStore)

### Data Fetching

App အများအပြားက data fetching စတင်ဖို့ Effects တွေကို သုံးပါတယ်။ ဒီလို data fetching Effect တစ်ခု ရေးတာ အဖြစ်များပါတယ်:

```js
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

ဒီ fetch ကို event handler တစ်ခုဆီ ရွှေ့ဖို့ *မလိုပါဘူး*။

ဒါက — logic တွေကို event handlers တွေထဲမှာ ထားဖို့ လိုတယ်လို့ ပြောခဲ့တဲ့ ယခင် ဥပမာတွေနဲ့ ဆန့်ကျင်နေပုံ ရနိုင်ပါတယ်! ဒါပေမယ့် — fetch လုပ်ရတဲ့ အဓိက အကြောင်းရင်းက *ရိုက်ထည့်တဲ့ event* မဟုတ်ဘူးဆိုတာ စဉ်းစားကြည့်ပါ။ Search inputs တွေက URL ကနေ မကြာခဏ ကြိုဖြည့်ထားပြီး — user က input ကို မထိဘဲ — Back နဲ့ Forward သွားလာနိုင်ပါတယ်။

`page` နဲ့ `query` ဘယ်ကလာလဲဆိုတာ အရေးမကြီးပါဘူး။ ဒီ component ကို မြင်ရနေချိန်မှာ — လက်ရှိ `page` နဲ့ `query` အတွက် network ကနေ ရလာတဲ့ data နဲ့ `results` တွေကို [synchronize](/docs/react/synchronizing-with-effects) ဖြစ်နေစေချင်ပါတယ်။ ဒါကြောင့်ပဲ — ဒါက Effect တစ်ခုပါ။

ဒါပေမယ့် — အထက်က code မှာ bug တစ်ခု ရှိပါတယ်။ `"hello"` ဆိုတာကို မြန်မြန် ရိုက်ထည့်တယ်ဆိုပါစို့။ ဒါဆိုရင် — `query` က `"h"`၊ `"he"`၊ `"hel"`၊ `"hell"`၊ `"hello"` ဆိုပြီး ပြောင်းသွားပါလိမ့်မယ်။ ဒါက fetch တွေ သပ်သပ်စီ စတင်စေပေမယ့် — responses တွေ ဘယ်အစီအစဉ်နဲ့ ရောက်လာမယ်ဆိုတာ အာမခံချက် မရှိပါဘူး။ ဥပမာ — `"hell"` ရဲ့ response က `"hello"` ရဲ့ response ထက် *နောက်မှ* ရောက်လာနိုင်ပါတယ်။ သူက `setResults()` ကို နောက်ဆုံး ခေါ်မှာမို့ — search results မှားနေတာကို ပြသနေမှာပါ။ ဒါကို ["race condition"](https://en.wikipedia.org/wiki/Race_condition) လို့ ခေါ်ပါတယ်: request မတူညီတဲ့ နှစ်ခုက တစ်ခုကိုတစ်ခု "ပြိုင်ဆိုင်" ပြီး — သင်မျှော်လင့်ထားတာနဲ့ မတူတဲ့ အစီအစဉ်နဲ့ ရောက်လာတာပါ။

**Race condition ကို ပြုပြင်ဖို့ — stale responses တွေကို လျစ်လျူရှုဖို့ [cleanup function တစ်ခု ထည့်ပေးရပါမယ်](/docs/react/synchronizing-with-effects):**

```js
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

ဒါက — သင့် Effect က data fetch လုပ်တဲ့အခါ — နောက်ဆုံး တောင်းဆိုထားတဲ့ response ကလွဲပြီး — ကျန်အားလုံးကို လျစ်လျူရှုကြောင်း သေချာစေပါတယ်။

Race conditions တွေကို ကိုင်တွယ်တာက data fetching ကို အကောင်အထည်ဖော်ရာမှာ ကြုံရတဲ့ တစ်ခုတည်းသော အခက်အခဲ မဟုတ်ပါဘူး။ Responses တွေကို cache လုပ်ဖို့ (user က Back နှိပ်ပြီး ယခင် screen ကို ချက်ချင်း မြင်နိုင်ဖို့)၊ server ပေါ်မှာ data ကို ဘယ်လို fetch မလဲ (ကနဦး server-rendered HTML ထဲမှာ spinner အစား fetched content ပါဖို့)၊ network waterfalls တွေကို ဘယ်လို ရှောင်မလဲ (child တစ်ခုက parent တိုင်းကို မစောင့်ဘဲ data fetch လုပ်နိုင်ဖို့) စတာတွေကိုလည်း တွေးထားချင်ပါလိမ့်မယ်။

**ဒီပြဿနာတွေက ဘယ် UI library မဆို — React တစ်ခုတည်း မဟုတ်ဘဲ — အားလုံးနဲ့ သက်ဆိုင်ပါတယ်။ သူတို့ကို ဖြေရှင်းတာက လွယ်တဲ့ကိစ္စ မဟုတ်ပါဘူး — ဒါကြောင့်ပဲ — ခေတ်မီ [frameworks](/docs/react/creating-a-react-app) တွေက Effects တွေနဲ့ data fetch လုပ်တာထက် — ပိုထိရောက်တဲ့ built-in data fetching ယန္တရားတွေ ပေးထားတာပါ။**

Framework မသုံးဘူး (ပြီးတော့ ကိုယ်ပိုင် တစ်ခု ဆောက်ချင်စရာလည်း မလို) ဒါပေမယ့် — Effects တွေကနေ data fetching ကို ပိုအဆင်ပြေချောမွေ့အောင် လုပ်ချင်တယ်ဆိုရင် — ဒီဥပမာမှာလိုမျိုး — fetch logic ကို custom Hook တစ်ခုထဲ ထုတ်ယူဖို့ စဉ်းစားပါ:

```js
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Error handling အတွက် logic တစ်ချို့နဲ့ — content loading ဖြစ်မဖြစ် ခြေရာခံတာတွေလည်း ထည့်ချင်ပါလိမ့်မယ်။ ဒီလို Hook တစ်ခုကို ကိုယ်တိုင် တည်ဆောက်နိုင်သလို — React ecosystem ထဲမှာ ရှိပြီးသား ဖြေရှင်းနည်း အများအပြားထဲက တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။ **ဒါတစ်ခုတည်းက framework ရဲ့ built-in data fetching ယန္တရားလောက် ထိရောက်မှာ မဟုတ်ပေမယ့် — data fetching logic ကို custom Hook တစ်ခုထဲ ရွှေ့လိုက်တာက — နောင်မှာ ထိရောက်တဲ့ data fetching strategy တစ်ခုကို ကျင့်သုံးဖို့ ပိုလွယ်ကူစေပါလိမ့်မယ်။**

ယေဘုယျအားဖြင့် — Effects တွေ ရေးဖို့ အတင်းအကြပ် ကြုံလာတိုင်း — `useData` လိုမျိုး — ပိုပြီး declarative ဖြစ်ပြီး ရည်ရွယ်ချက်နဲ့ တည်ဆောက်ထားတဲ့ API တစ်ခုပါတဲ့ custom Hook တစ်ခုထဲကို လုပ်ဆောင်ချက်တစ်ခုကို ထုတ်ယူလို့ရမယ့် အချိန်ကို သတိထားကြည့်ပါ။ သင့် components တွေထဲမှာ ကုန်ကြမ်း `useEffect` calls တွေ နည်းလေလေ — သင့် application ကို ထိန်းသိမ်းရတာ ပိုလွယ်လေလေ ဖြစ်ပါလိမ့်မယ်။


## အကျဉ်းချုပ်

- Render လုပ်နေစဉ်မှာ တစ်ခုခုကို တွက်လို့ရရင် — Effect တစ်ခု မလိုပါဘူး။
- စရိတ်ကြီးတဲ့ တွက်ချက်မှုတွေကို cache လုပ်ဖို့ — `useEffect` အစား `useMemo` ကို ထည့်ပါ။
- Component tree တစ်ခုလုံးရဲ့ state ကို reset လုပ်ဖို့ — သူ့ဆီ `key` မတူညီတာတစ်ခု ပို့ပါ။
- Prop ပြောင်းလဲမှုကို တုံ့ပြန်ပြီး state အပိုင်းတစ်ပိုင်း သတ်မှတ်ဖို့ — rendering လုပ်နေစဉ်မှာ set လုပ်ပါ။
- Component တစ်ခုကို *ပြသလို့* run တဲ့ code တွေက Effects တွေထဲမှာ ရှိသင့်ပြီး — ကျန်တာတွေက events တွေထဲမှာ ရှိသင့်ပါတယ်။
- Component အများအပြားရဲ့ state ကို update လုပ်ဖို့ လိုရင် — event တစ်ခုတည်းအတွင်းမှာ လုပ်တာ ပိုကောင်းပါတယ်။
- Component မတူညီတာတွေထဲက state variable တွေကို sync လုပ်ဖို့ ကြိုးစားတိုင်း — state ကို lift up လုပ်ဖို့ စဉ်းစားပါ။
- Effects တွေနဲ့ data fetch လုပ်နိုင်ပေမယ့် — race conditions တွေ ရှောင်ဖို့ cleanup ကို အကောင်အထည်ဖော်ဖို့ လိုပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Effects မပါဘဲ Data တွေကို အသွင်ပြောင်းခြင်း

အောက်က `TodoList` က todos list တစ်ခုကို ပြသပါတယ်။ "Show only active todos" checkbox ကို အမှန်ခြစ်ထားရင် — ပြီးစီးနေတဲ့ todos တွေက list ထဲမှာ မပြတော့ပါဘူး။ ဘယ် todos တွေ မြင်ရမြင်ရ — footer က — မပြီးသေးတဲ့ todos တွေရဲ့ အရေအတွက်ကို အမြဲ ပြသပါတယ်။

မလိုအပ်တဲ့ state တွေနဲ့ Effects တွေ အားလုံးကို ဖယ်ရှားခြင်းဖြင့် — ဒီ component ကို ရိုးရှင်းအောင် လုပ်ပါ။

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

> **အရိပ်အမြွက်:** Rendering လုပ်နေစဉ်မှာ တစ်ခုခုကို တွက်လို့ရရင် — state ဒါမှမဟုတ် သူ့ကို update လုပ်ပေးမယ့် Effect တစ်ခု မလိုပါဘူး။

#### အဖြေ

ဒီဥပမာထဲမှာ မရှိမဖြစ် state အပိုင်း နှစ်ခုပဲ ရှိပါတယ်: `todos` list နဲ့ — checkbox အမှန်ခြစ်ထားလားဆိုတာ ကိုယ်စားပြုတဲ့ — `showActive` state variable ပါ။ တခြား state variable တွေ အားလုံးက [မလိုအပ်ဘဲ (redundant)](/docs/react/choosing-the-state-structure) ဖြစ်ပြီး — rendering လုပ်နေစဉ်မှာ တွက်လို့ရပါတယ်။ ဒါမှာ — ဘေးက JSX ထဲကို တိုက်ရိုက် ရွှေ့လို့ရတဲ့ `footer` လည်း ပါဝင်ပါတယ်။

သင့်ရလဒ်က ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

### Effects မပါဘဲ တွက်ချက်မှုတစ်ခုကို Cache လုပ်ခြင်း

ဒီဥပမာမှာ — todos တွေကို filter လုပ်တာကို `getVisibleTodos()` လို့ခေါ်တဲ့ function တစ်ခုထဲ ထုတ်ထားပါတယ်။ ဒီ function ထဲမှာ — သူ့ကို ဘယ်အချိန်တွေ ခေါ်ခံရလဲ သတိပြုမိစေဖို့ — `console.log()` call တစ်ခု ပါဝင်ပါတယ်။ "Show only active todos" ကို toggle လုပ်ပြီး — ဒါက `getVisibleTodos()` ကို ပြန် run စေတာ သတိပြုပါ။ ဘယ်ဟာတွေ ပြမလဲ toggle လုပ်တဲ့အခါ — visible todos တွေ ပြောင်းလို့ — ဒါက မျှော်လင့်ထားတာပါ။

သင့်တာဝန်က — `TodoList` component ထဲက `visibleTodos` list ကို ပြန်တွက်ပေးတဲ့ Effect ကို ဖယ်ရှားဖို့ပါ။ ဒါပေမယ့် — input ထဲမှာ ရိုက်ထည့်တဲ့အခါ — `getVisibleTodos()` က *ပြန် run မလုပ်တာ* (ဒါကြောင့် logs တွေ မထုတ်တာ) သေချာအောင် လုပ်ရပါမယ်။

> **အရိပ်အမြွက်:** ဖြေရှင်းနည်းတစ်ခုက — visible todos တွေကို cache လုပ်ဖို့ `useMemo` call တစ်ခု ထည့်တာပါ။ နောက်ထပ် — သိပ်မထင်ရှားတဲ့ — ဖြေရှင်းနည်း တစ်ခုလည်း ရှိပါတယ်။

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

#### အဖြေ

State variable ရော Effect ပါ ဖယ်ရှားပြီး — အဲဒီအစား — `getVisibleTodos()` ကို ခေါ်တာရဲ့ ရလဒ်ကို cache လုပ်ဖို့ `useMemo` call တစ်ခု ထည့်ပါ:

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

ဒီပြောင်းလဲမှုနဲ့ဆိုရင် — `getVisibleTodos()` ကို `todos` ဒါမှမဟုတ် `showActive` ပြောင်းမှပဲ ခေါ်ပါလိမ့်မယ်။ Input ထဲ ရိုက်ထည့်တာက `text` state variable ကိုပဲ ပြောင်းလို့ — `getVisibleTodos()` ကို ခေါ်တာ trigger မလုပ်ပါဘူး။

`useMemo` မလိုတဲ့ နောက်ထပ် ဖြေရှင်းနည်းတစ်ခုလည်း ရှိပါတယ်။ `text` state variable က todos list ကို ဘယ်လိုမှ မထိခိုက်နိုင်တာမို့ — `NewTodo` form ကို component သပ်သပ်တစ်ခုအဖြစ် ထုတ်ယူပြီး — `text` state variable ကို သူ့အတွင်းထဲ ရွှေ့နိုင်ပါတယ်:

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

ဒီချဉ်းကပ်နည်းကလည်း လိုအပ်ချက်တွေကို ပြည့်မီပါတယ်။ Input ထဲ ရိုက်ထည့်တဲ့အခါ — `text` state variable ပဲ update ဖြစ်ပါတယ်။ `text` state variable က child `NewTodo` component ထဲမှာ ရှိတာမို့ — parent `TodoList` component က re-render မဖြစ်ပါဘူး။ ဒါကြောင့်ပဲ — သင်ရိုက်ထည့်တဲ့အခါ `getVisibleTodos()` ကို မခေါ်တာပါ။ (`TodoList` က တခြား အကြောင်းရင်းတစ်ခုနဲ့ re-render ဖြစ်ရင်တော့ — ခေါ်ဦးမှာပါ။)

### Effects မပါဘဲ State ကို ပြန်လည်သတ်မှတ်ခြင်း

ဒီ `EditContact` component က — `{ id, name, email }` ပုံစံ ရှိတဲ့ contact object တစ်ခုကို — `savedContact` prop အနေနဲ့ လက်ခံပါတယ်။ Name နဲ့ email input fields တွေကို edit လုပ်ကြည့်ပါ။ Save ကို နှိပ်လိုက်တဲ့အခါ — form အပေါ်က contact ရဲ့ button က — edit လုပ်ထားတဲ့ name နဲ့ update ဖြစ်သွားပါတယ်။ Reset ကို နှိပ်လိုက်ရင် — form ထဲက ဆိုင်းငံ့ထားတဲ့ ပြောင်းလဲမှုတွေ အားလုံး ပယ်ချခံရပါတယ်။ ဒီ UI ကို နားလည်အောင် ကစားကြည့်ပါ။

အပေါ်က buttons တွေနဲ့ contact တစ်ခုကို ရွေးလိုက်တဲ့အခါ — form က အဲဒီ contact ရဲ့ အသေးစိတ်တွေကို ထင်ဟပ်စေဖို့ — ပြန်လည် သတ်မှတ်ပါတယ်။ ဒါကို `EditContact.js` ထဲက Effect တစ်ခုနဲ့ လုပ်ထားပါတယ်။ ဒီ Effect ကို ဖယ်ရှားပါ။ `savedContact.id` ပြောင်းတဲ့အခါ form ကို ပြန်လည် သတ်မှတ်ဖို့ တခြားနည်းလမ်းတစ်ခု ရှာပါ။

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

> **အရိပ်အမြွက်:** `savedContact.id` က မတူညီတဲ့အခါ — `EditContact` form က အယူအဆအရ *contact မတူညီတဲ့တစ်ခုရဲ့ form* ဖြစ်ပြီး — state ကို ထိန်းသိမ်းမထားသင့်ဘူးဆိုတာ React ကို ပြောပြနိုင်တဲ့ နည်းလမ်းတစ်ခု ရှိရင် ကောင်းမှာပေါ့နော်။ အဲဒီလို နည်းလမ်းတစ်ခုခု သတိရလား?

#### အဖြေ

`EditContact` component ကို နှစ်ပိုင်း ခွဲပါ။ Form state တွေ အားလုံးကို အတွင်းက `EditForm` component ထဲ ရွှေ့ပါ။ Outer `EditContact` component ကို export လုပ်ပြီး — သူ့ကနေ `savedContact.id` ကို — အတွင်းက `EditForm` component ဆီ `key` အနေနဲ့ ပို့ပါ။ ရလဒ်အနေနဲ့ — contact မတူညီတာတစ်ခုကို ရွေးလိုက်တိုင်း — အတွင်းက `EditForm` component က form state တွေ အားလုံးကို ပြန်လည် သတ်မှတ်ပြီး — DOM ကို ပြန်ဖန်တီးပါလိမ့်မယ်။

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

### Effects မပါဘဲ Form တစ်ခုကို Submit လုပ်ခြင်း

ဒီ `Form` component က သူငယ်ချင်းတစ်ယောက်ဆီ message တစ်ခု ပို့ခွင့်ပြုပါတယ်။ Form ကို submit လုပ်လိုက်တဲ့အခါ — `showForm` state variable ကို `false` အဖြစ် set လုပ်ပါတယ်။ ဒါက — message ကို ပို့ပေးတဲ့ (console ထဲမှာ မြင်ရမယ့်) `sendMessage(message)` ကို ခေါ်တဲ့ Effect တစ်ခုကို trigger လုပ်ပါတယ်။ Message ပို့ပြီးတာနဲ့ — form ဆီ ပြန်သွားခွင့်ပြုတဲ့ "Open chat" button တစ်ခုပါတဲ့ — "Thank you" dialog တစ်ခု မြင်ရပါတယ်။

သင့် app ရဲ့ user တွေက message တွေ အရမ်းများလွန်းအောင် ပို့နေပါတယ်။ Chat လုပ်တာ နည်းနည်း ပိုခက်အောင် — form အစား "Thank you" dialog ကို *အရင်ဆုံး* ပြဖို့ ဆုံးဖြတ်လိုက်ပါတယ်။ `showForm` state variable ကို `true` အစား `false` နဲ့ စတင်အောင် ပြောင်းပါ။ အဲဒီလို ပြောင်းလိုက်တာနဲ့ — console ထဲမှာ message အလွတ်တစ်ခု ပို့လိုက်တာ တွေ့ရပါလိမ့်မယ်။ ဒီ logic ထဲမှာ တစ်ခုခု မှားနေပါတယ်!

ဒီပြဿနာရဲ့ အရင်းခံ အကြောင်းရင်းက ဘာလဲ? ဘယ်လို ပြုပြင်နိုင်မလဲ?

> **အရိပ်အမြွက်:** Message ကို — user က "Thank you" dialog ကို *မြင်လို့* ပို့သင့်လား။ ဒါမှမဟုတ် — အပြန်အစီး ဖြစ်နေတာလား?

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

#### အဖြေ

`showForm` state variable က — form ကို ပြမလား "Thank you" dialog ကို ပြမလားဆိုတာ ဆုံးဖြတ်ပေးပါတယ်။ ဒါပေမယ့် — သင်က message ကို — "Thank you" dialog ကို *ပြသလို့* ပို့နေတာ မဟုတ်ပါဘူး။ User က form ကို *submit လုပ်လို့* message ပို့ချင်တာပါ။ လှည့်စားနေတဲ့ Effect ကို ဖျက်ပြီး — `sendMessage` call ကို `handleSubmit` event handler ထဲ ရွှေ့ပါ:

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

ဒီ version မှာ — *form ကို submit လုပ်တာပဲ* (event တစ်ခုဖြစ်တဲ့) က message ပို့စေတာ သတိပြုပါ။ `showForm` ကို ကနဦးမှာ `true` ဒါမှမဟုတ် `false` ဘယ်ဟာနဲ့ပဲ set ထားထား — ဒါက တူညီစွာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ (`false` နဲ့ set ကြည့်ပြီး — console message အပိုတွေ မရှိတာ သတိပြုပါ။)
