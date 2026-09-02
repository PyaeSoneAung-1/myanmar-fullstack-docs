---
title: "useImperativeHandle"
description: "Ref ကနေ ထုတ်ဖော်ပြတဲ့ handle ကို စိတ်ကြိုက်ပြင်ဆင်နိုင်တဲ့ React Hook — parent component ကို custom imperative handle (methods) ထုတ်ပေးခြင်း၊ dependencies နဲ့ re-create လုပ်ခြင်း"
order: 45
source: "https://react.dev/reference/react/useImperativeHandle"
status: translated
updated: 2026-09-02
---

`useImperativeHandle` ဆိုတာ — [ref](/docs/react/manipulating-the-dom-with-refs) တစ်ခုအနေနဲ့ ထုတ်ဖော်ပြတဲ့ handle ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်စေတဲ့ React Hook တစ်ခုပါ။

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

ပုံမှန်အားဖြင့် — ကိုယ်ပိုင် components တွေက သူတို့ရဲ့ အတွင်းက DOM nodes တွေကို refs တွေအနေနဲ့ ထုတ်မပေးတတ်ပါဘူး (ဒီအကြောင်းကို `useRef` page ရဲ့ troubleshooting မှာ ကြည့်နိုင်ပါတယ်)။ Component တစ်ခုက သူ့ရဲ့ ref ကနေ ဘယ်အရာတွေကို parent က ဝင်ရောက်လို့ရမလဲ — ဆိုတာကို ဒီ Hook နဲ့ ထိန်းချုပ်နိုင်ပါတယ်။ ဥပမာ — `<input>` DOM node တစ်ခုလုံးကို ထုတ်ပြမယ့်အစား `focus()` လိုမျိုး method တစ်ခုကိုပဲ ထုတ်ပြတာမျိုးပါ။ ဒါမျိုးကို *imperative handle* (parent က တိုက်ရိုက် ခေါ်နိုင်တဲ့ command တွေပါတဲ့ object) လို့ ခေါ်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `useImperativeHandle(ref, createHandle, dependencies?)`

Component တစ်ခုက ထုတ်ဖော်ပြတဲ့ ref handle ကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ — component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useImperativeHandle` ကို ခေါ်ပါတယ်:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

**Parameters (ပါရာမီတာများ)**

- `ref`: `MyInput` component ဆီ prop အဖြစ် လက်ခံရရှိထားတဲ့ ref ။
- `createHandle`: Argument မယူဘဲ — သင်ထုတ်ဖော်ပြချင်တဲ့ ref handle ကို ပြန်ပေးတဲ့ function တစ်ခု။ Ref handle က ဘယ် type မဆို ဖြစ်နိုင်ပြီး — ပုံမှန်အားဖြင့် သင်ထုတ်ပြချင်တဲ့ methods တွေပါတဲ့ object တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ဒီ function ကို component ရဲ့ render အတွင်းမှာ ခေါ်တာမို့ — pure ဖြစ်ရပြီး — ပြင်ပကို သက်ရောက်မှု (side effects) မရှိစေရပါဘူး။
- **optional** `dependencies`: `createHandle` code ရဲ့ အတွင်းမှာ သုံးထားတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables/functions တွေ ပါဝင်ပါတယ်။ React က dependency တစ်ခုချင်းစီကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ ယခင်တန်ဖိုးနဲ့ နှိုင်းယှဉ်ပါတယ်။ Re-render တစ်ခုမှာ dependency တစ်ခုခု ပြောင်းသွားရင် ဒါမှမဟုတ် ဒီ argument ကို ချန်လိုက်ရင် — `createHandle` function က re-render တိုင်းမှာ ပြန် run ပြီး — အသစ်ဖန်တီးထားတဲ့ handle ကို ref ဆီ သတ်မှတ်ပေးပါတယ်။ ဒါကြောင့် — handle ထဲက method တစ်ခုက props ဒါမှမဟုတ် state တစ်ခုရဲ့ တန်ဖိုးပေါ် မူတည်နေရင် — အဲဒီ props/state ကို dependencies စာရင်းထဲ ထည့်ထားဖို့ လိုပြီး — မပါရင် parent က ခေါ်တဲ့အခါ တန်ဖိုးဟောင်း (stale) တွေကိုပဲ မြင်နေနိုင်ပါတယ်။

> **မှတ်ချက်:** React 19 ကစပြီး `ref` ကို prop အဖြစ် တိုက်ရိုက် လက်ခံနိုင်ပါတယ်။ React 18 နဲ့ အစောပိုင်းတွေမှာတော့ `forwardRef` ကနေပဲ `ref` ကို ရခဲ့ရပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- `useImperativeHandle` က `undefined` ကို ပြန်ပေးပါတယ်။ ဒီ Hook က ဘာ value မှ ပြန်မပေးဘဲ — ref ကို ဘေးထွက် ပြုပြင်ပေးတာပါ: `createHandle` က ပြန်ပေးတဲ့ object ကို သင်ပေးလိုက်တဲ့ `ref` ရဲ့ နေရာမှာ တပ်ဆင်ပေးလိုက်တာပါ။

## အသုံးပြုပုံ (Usage)

### Parent Component ဆီ Custom Ref Handle တစ်ခု ထုတ်ပေးခြင်း

Parent element ဆီ DOM node တစ်ခုကို ထုတ်ပေးဖို့ — `ref` prop ကို node ဆီ ပေးပါ:

```js
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

ဒီ code နဲ့ဆိုရင် — `MyInput` ဆီရှိတဲ့ ref တစ်ခုက `<input>` DOM node ကို လက်ခံရရှိပါတယ်။ ဒါပေမယ့် — သင်က custom value တစ်ခုကိုလည်း ထုတ်ပေးနိုင်ပါတယ်။ ဒါက ဘာကြောင့် အသုံးဝင်လဲဆိုရင် — DOM node တစ်ခုလုံးကို ထုတ်ပေးလိုက်ရင် parent က `style` တွေ ပြောင်းတာ၊ အတွင်းပိုင်း structure ကို မှီခိုတာလိုမျိုး — component ရဲ့ encapsulation ကို ချိုးဖျက်နိုင်တဲ့ အခွင့်အရေးတွေ အကုန်ရသွားလို့ပါ။ ဘယ် methods တွေကို ထုတ်ပြမလဲဆိုတာ ထိန်းချုပ်ထားခြင်းဖြင့် — component က သူ့ရဲ့ အတွင်းပိုင်းကို လွတ်လပ်စွာ ပြောင်းလဲနိုင်ပြီး — parent နဲ့ထားတဲ့ contract (ဒီ handle ပေါ်က methods တွေ) ကိုတော့ တည်ငြိမ်အောင် ထားနိုင်ပါတယ်။ ထုတ်ပြတဲ့ handle ကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ — component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useImperativeHandle` ကို ခေါ်ပါ:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

အထက်က code မှာ `ref` ကို `<input>` ဆီ ထပ်မပို့တော့တာ သတိပြုပါ။

ဥပမာ — `<input>` DOM node တစ်ခုလုံးကို မထုတ်ပြချင်ဘဲ — သူ့ရဲ့ method နှစ်ခုဖြစ်တဲ့ `focus` နဲ့ `scrollIntoView` ကိုပဲ ထုတ်ပြချင်တယ်ဆိုပါစို့။ ဒါဆိုရင် — browser DOM အစစ်ကို ref တစ်ခုသပ်သပ် ထဲမှာ ထားပြီး — parent component က ခေါ်စေချင်တဲ့ methods တွေပဲ ပါတဲ့ handle တစ်ခုကို `useImperativeHandle` နဲ့ ထုတ်ပေးပါ:

```js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

  return <input ref={inputRef} />;
};
```

အခုဆို — parent component က `MyInput` ဆီ ref တစ်ခု ရရင် — အဲဒီ ref ပေါ်မှာ `focus` နဲ့ `scrollIntoView` methods တွေကို ခေါ်နိုင်ပေမယ့် — အတွင်းက `<input>` DOM node တစ်ခုလုံးကိုတော့ ဝင်ရောက်ခွင့် မရတော့ပါဘူး။

ဒီ MyInput ထဲမှာ ဘာတွေ ဖြစ်နေလဲ ဆန်းစစ်ကြည့်ရအောင်: `useRef` က တကယ့် browser DOM node ကို ကိုင်ထားတဲ့ အတွင်းပိုင်း ref (`inputRef`) တစ်ခုကို ဖန်တီးပြီး — `<input>` ကို အဲဒီ ref နဲ့ ချိတ်ထားပါတယ်။ ပြီးရင် `useImperativeHandle` က — parent ဆီက လာတဲ့ `ref` ရဲ့ နေရာမှာ — `inputRef` ကို ဖြတ်ပြီး `focus()` နဲ့ `scrollIntoView()` ဆိုတဲ့ method နှစ်ခုကို ခေါ်ပေးတဲ့ object တစ်ခုကို တပ်ဆင်ပေးပါတယ်။ ဒါကြောင့် parent က ဒီ handle ပေါ်က method တွေကိုပဲ သုံးနိုင်ပြီး — သူ့ရဲ့ အတွင်းက DOM node ကို တိုက်ရိုက် ကိုင်တွယ်ခွင့် မရတော့ပါဘူး။

ဒီ pattern ရဲ့ အလုပ်လုပ်ပုံ အစီအစဉ်ကို ကြည့်ရအောင် — parent `Form` က `useRef(null)` နဲ့ ref တစ်ခု ကြေညာပြီး — `<MyInput ref={ref} />` လို့ render လုပ်ပါတယ်။ `MyInput` က mount ဖြစ်တဲ့အခါ — `useImperativeHandle` က ဖန်တီးထားတဲ့ handle (methods တွေပါတဲ့ object) ကို ဒီ ref ရဲ့ `current` နေရာမှာ တပ်ပေးပါတယ်။ User က "Edit" button ကို နှိပ်လိုက်ရင် — `handleClick` ထဲက `ref.current.focus()` က handle ရဲ့ `focus` method ကို ခေါ်လို့ — နောက်ကွယ်မှာ `inputRef.current.focus()` ကနေတစ်ဆင့် — DOM input ကို focus ဖြစ်သွားစေပါတယ်။ Handle ထဲမှာ မထည့်ထားတဲ့ DOM features တွေ (ဥပမာ `style` ပြောင်းတာ) ကတော့ — parent ဘက်ကနေ ဝင်ရောက်လို့ မရတော့ပါဘူး — ဒါက component ရဲ့ ထိန်းချုပ်မှုကို ထိန်းသိမ်းပေးတာပါ။

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### ကိုယ်ပိုင် Imperative Methods တွေ ထုတ်ပေးခြင်း

Imperative handle ကနေ ထုတ်ပေးတဲ့ methods တွေက DOM methods တွေနဲ့ အတိအကျ တူစရာ မလိုပါဘူး။ Component တစ်ခုကို — သူ့ရဲ့ internal state အများကြီးကို လုပ်ဆောင်ပေးတဲ့ method နာမည် ပိုအဓိပ္ပာယ်ရှိတာတွေနဲ့ — အသုံးပြုသူကို ရည်ရွယ်ချက်ရှင်းတဲ့ API တစ်ခုအနေနဲ့ ထုတ်ပေးနိုင်ပါတယ်။ ဥပမာ — ဒီ `Post` component က `scrollAndFocusAddComment` method တစ်ခုကို imperative handle တစ်ခုကနေ ထုတ်ပေးပါတယ် — ဒါက parent `Page` ကို — button နှိပ်လိုက်ရင် comment စာရင်းကို scroll လုပ်ပြီး input field ကိုပါ focus လုပ်စေနိုင်ပါတယ် — ဒါတွေက component နှစ်ခုကို ဖြတ်ပြီး လုပ်ရတဲ့ အလုပ်တွေပါ:

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

`Post` ကိုယ်တိုင်က — `CommentList` နဲ့ `AddComment` ဆိုတဲ့ child components နှစ်ခုဆီ refs တွေ ပို့ပြီး — သူ့ရဲ့ handle ထဲမှာ child တွေရဲ့ methods တွေကို ပေါင်းစပ်ထားပါတယ်:

```js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```

ဒီမှာ ချိတ်ဆက်မှု ကွင်းဆက် (chain) တစ်ခု ဖြစ်ပေါ်နေပါတယ် — `CommentList` က သူ့ရဲ့ ref ကနေ `scrollToBottom()` method ကို ထုတ်ပေးပြီး — `AddComment` က input DOM node ကိုယ်တိုင်ကို ထုတ်ပေးပါတယ် — `Post` က သူ့ ref ကနေ ဒီနှစ်ခုလုံးကို ပေါင်းစပ်ထားတဲ့ `scrollAndFocusAddComment()` method တစ်ခုတည်းကို ထုတ်ပေးပါတယ်။ ဒါဆိုရင် parent `Page` က component တစ်ခုချင်းစီရဲ့ အတွင်းပိုင်း ဖွဲ့စည်းပုံကို မသိဘဲ — `postRef.current.scrollAndFocusAddComment()` ဆိုတဲ့ command တစ်ခုနဲ့ — scroll ရော focus ရော နှစ်ခုလုံးကို တစ်ပြိုင်နက် လုပ်ခိုင်းနိုင်ပါတယ်။ ဒီနည်းနဲ့ — child component တစ်ခုချင်းစီရဲ့ DOM ကို parent က တိုက်ရိုက် ကိုင်တွယ်စရာ မလိုတော့ဘဲ — component တစ်ခုချင်းစီရဲ့ ကိုယ်ပိုင် handle တွေ ပေါင်းစပ်ပြီး — အလွှာလိုက် API တွေ တည်ဆောက်နိုင်ပါတယ်။

ဒီဥပမာတွေမှာ dependencies က `[]` (ဗလာ) ပါ — `createHandle` ရဲ့ အတွင်းက code က props/state တစ်ခုခုကို မမှီခိုလို့ပါ။ Handle ထဲက method တွေက props ဒါမှမဟုတ် state ရဲ့ တန်ဖိုးတွေကို သုံးနေရင် — အဲဒီတန်ဖိုးတွေကို dependencies စာရင်းထဲ ထည့်ထားရမှာ ဖြစ်ပြီး — ပြောင်းလဲတာနဲ့ handle အသစ် ဖန်တီးပြီး ref ဆီ ပြန်တပ်ပေးမှာပါ — ဒါမှ parent က ခေါ်တိုင်း နောက်ဆုံးတန်ဖိုးတွေနဲ့ အလုပ်လုပ်မှာ ဖြစ်ပါတယ်။

> **သတိပြုရန် — Refs တွေကို အလွန်အကျွံ မသုံးပါနဲ့:**
>
> Refs တွေကို props အဖြစ် ဖော်ပြလို့ မရတဲ့ *imperative* အပြုအမူတွေအတွက်ပဲ သုံးသင့်ပါတယ် — node တစ်ခုဆီ scroll လုပ်တာ၊ node တစ်ခုကို focus လုပ်တာ၊ animation တစ်ခု trigger လုပ်တာ၊ text ရွေးတာစသဖြင့်ပါ။
>
> **တစ်ခုခုကို prop အဖြစ် ဖော်ပြနိုင်ရင် — ref ကို မသုံးသင့်ပါဘူး။** ဥပမာ — `Modal` component တစ်ခုကနေ `{ open, close }` လို imperative handle တစ်ခု ထုတ်ပေးမယ့်အစား — `<Modal isOpen={isOpen} />` လို prop တစ်ခုအနေနဲ့ လက်ခံတာ ပိုကောင်းပါတယ်။ Imperative အပြုအမူတွေကို props တွေကနေ ဖော်ပြဖို့ Effects တွေက ကူညီနိုင်ပါတယ်။

**အကျဉ်းချုပ်ပြောရရင်** — `useImperativeHandle` က သာမန်အားဖြင့် မလိုအပ်တဲ့ tool တစ်ခုပါ: component တစ်ခုရဲ့ ref ကနေ parent က DOM node ကိုယ်တိုင် မရဘဲ — သတ်မှတ်ထားတဲ့ methods တချို့ကိုပဲ ရစေချင်တဲ့အခါ (ဥပမာ — `MyInput` လို reusable form components တွေ၊ animation ထိန်းချုပ်တဲ့ wrapper တွေ) သုံးပါတယ်။ အခြေခံ နားလည်မှုအတွက် — [refs နဲ့ value တွေကို ကိုးကားခြင်း](/docs/react/referencing-values-with-refs) နဲ့ [DOM ကို refs နဲ့ ကိုင်တွယ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) စာမျက်နှာတွေကို ဦးစွာ ဖတ်ပြီး — refs တွေရဲ့ အခြေခံကို နားလည်ထားဖို့ အကြံပြုပါတယ်။
