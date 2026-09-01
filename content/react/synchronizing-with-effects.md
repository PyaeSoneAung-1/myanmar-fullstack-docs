---
title: "Effects နဲ့ ထပ်တူပြုခြင်း (Synchronizing with Effects)"
description: "Component တွေက external systems တွေနဲ့ ထပ်တူပြုဖို့ Effects တွေကို ဘယ်လို သုံးမလဲ — Effect ကြေညာခြင်း၊ dependencies သတ်မှတ်ခြင်း၊ cleanup function ထည့်ခြင်း၊ development မှာ Effect နှစ်ကြိမ် ပြေးတာကို ကိုင်တွယ်ခြင်း"
order: 15
source: "https://react.dev/learn/synchronizing-with-effects"
status: translated
updated: 2026-09-01
---

Component အချို့က external systems တွေနဲ့ ထပ်တူပြုဖို့ (synchronize) လိုပါတယ်။ ဥပမာ — React state ပေါ် အခြေခံပြီး React မဟုတ်တဲ့ component တစ်ခုကို ထိန်းချုပ်ချင်တာ၊ server connection တစ်ခု တည်ဆောက်ချင်တာ၊ ဒါမှမဟုတ် component တစ်ခု screen ပေါ် ပေါ်လာတဲ့အခါ analytics log တစ်ခု ပို့ချင်တာမျိုးပေါ့။ *Effects* တွေက render လုပ်ပြီးတဲ့နောက်မှာ code တချို့ကို လုပ်ဆောင်စေပြီး — သင့် component ကို React ရဲ့ အပြင်ဘက်က system တစ်ခုခုနဲ့ ထပ်တူပြုနိုင်စေပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Effects တွေဆိုတာ ဘာလဲ
- Effects တွေက events တွေနဲ့ ဘယ်လို ကွာခြားလဲ
- သင့် component ထဲမှာ Effect တစ်ခုကို ဘယ်လို ကြေညာမလဲ
- Effect တစ်ခုကို မလိုအပ်ဘဲ ပြန်လည် run လုပ်တာကို ဘယ်လို ရှောင်မလဲ
- Development မှာ Effects တွေ ဘာကြောင့် နှစ်ကြိမ် run လဲ — ပြီးတော့ ဘယ်လို ပြုပြင်မလဲ

## Effects ဆိုတာ ဘာလဲ — Events တွေနဲ့ ဘယ်လို ကွာခြားလဲ

Effects တွေဆီ မသွားခင် — React component တွေထဲက logic အမျိုးအစား နှစ်ခုကို သင်သိထားဖို့ လိုပါတယ်:

- **Rendering code** ([Describing the UI](/docs/react/describing-ui) မှာ မိတ်ဆက်ထား) — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ ရှိပါတယ်။ ဒီနေရာမှာ props နဲ့ state တွေကို ယူပြီး — ပြောင်းလဲပြီး — screen ပေါ်မှာ သင်မြင်ချင်တဲ့ JSX ကို ပြန်ပေးပါတယ်။ [Rendering code က pure ဖြစ်ရမယ်](/docs/react/keeping-components-pure)။ သင်္ချာပုံသေနည်းတစ်ခုလိုပဲ — ရလဒ်ကို *တွက်ချက်* ရုံပဲ လုပ်ရမှာ ဖြစ်ပြီး — တခြားဘာမှ မလုပ်ရပါဘူး။

- **Event handlers** ([Adding Interactivity](/docs/react/adding-interactivity) မှာ မိတ်ဆက်ထား) — တွက်ချက်ရုံသာမက — အရာတွေကို *လုပ်ဆောင်* ပေးတဲ့ — သင့် component တွေထဲက nested functions တွေပါ။ Event handler တစ်ခုက input field တစ်ခုကို update လုပ်တာ၊ ပစ္စည်းတစ်ခု ဝယ်ဖို့ HTTP POST request တစ်ခု ပို့တာ၊ ဒါမှမဟုတ် အသုံးပြုသူကို တစ်ခြား screen တစ်ခုဆီ ပို့ဆောင်ပေးတာ ဖြစ်နိုင်ပါတယ်။ Event handlers တွေမှာ — တိကျတဲ့ user action တစ်ခု (ဥပမာ — button click တစ်ခု ဒါမှမဟုတ် စာရိုက်ခြင်း) ကြောင့် ဖြစ်ပေါ်တဲ့ ["side effects"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (program ရဲ့ state ကို ပြောင်းလဲတာ) တွေ ပါဝင်ပါတယ်။

တခါတရံ ဒါတွေနဲ့ မလုံလောက်ပါဘူး။ Screen ပေါ်မှာ မြင်ရတိုင်း chat server ဆီ ချိတ်ဆက်ရမယ့် `ChatRoom` component တစ်ခုကို စဉ်းစားကြည့်ပါ။ Server တစ်ခုဆီ ချိတ်ဆက်တာက pure calculation မဟုတ်ပါဘူး (ဒါက side effect တစ်ခုပါ) — ဒါကြောင့် rendering အတွင်းမှာ ဖြစ်မလို့ မရပါဘူး။ ဒါပေမယ့် — `ChatRoom` ကို ပြသစေတဲ့ click တစ်ခုလိုမျိုး — တစ်ခုတည်းသော တိကျတဲ့ event တစ်ခုလည်း မရှိပါဘူး။

***Effects* တွေက တိကျတဲ့ event တစ်ခုကြောင့် မဟုတ်ဘဲ — rendering ကိုယ်တိုင်ကြောင့် ဖြစ်ပေါ်တဲ့ side effects တွေကို သတ်မှတ်ပေးနိုင်စေပါတယ်။** Chat ထဲမှာ message တစ်ခု ပို့တာက *event* တစ်ခုပါ — ဘာလို့လဲဆိုတော့ အဲဒါက အသုံးပြုသူက တိကျတဲ့ button တစ်ခုကို နှိပ်လို့ တိုက်ရိုက် ဖြစ်ပေါ်လို့ပါ။ ဒါပေမယ့် — server connection တစ်ခု တည်ဆောက်တာက *Effect* တစ်ခုပါ — ဘာလို့လဲဆိုတော့ component ကို ဘယ် interaction က ပေါ်လာစေခဲ့လဲဆိုတာ မသက်ဆိုင်ဘဲ ဖြစ်သင့်လို့ပါ။ Effects တွေက [commit](/docs/react/render-and-commit) တစ်ခုရဲ့ အဆုံးမှာ — screen က update ဖြစ်ပြီးတဲ့နောက် — run လုပ်ပါတယ်။ ဒါက React components တွေကို external system တစ်ခုခု (network ဒါမှမဟုတ် third-party library လိုမျိုး) နဲ့ ထပ်တူပြုဖို့ ကောင်းတဲ့ အချိန်ပါ။

> **မှတ်ချက်:** ဒီနေရာနဲ့ နောက်ပိုင်း ဒီစာသားတွေမှာ — စာလုံးကြီးနဲ့ ရေးထားတဲ့ "Effect" က အထက်က React-specific ဖြစ်တဲ့ အဓိပ္ပာယ်ကို ရည်ညွှန်းပါတယ် — ဆိုလိုတာက rendering ကြောင့် ဖြစ်ပေါ်တဲ့ side effect ပါ။ ပိုကျယ်ပြန့်တဲ့ programming concept ကို ရည်ညွှန်းဖို့ — "side effect" လို့ ပြောပါမယ်။

## သင်က Effect တစ်ခု မလိုအပ်နိုင်ပါ

**သင့် component တွေဆီ Effects တွေ ထည့်ဖို့ မမြန်ပါနဲ့။** Effects တွေက ပုံမှန်အားဖြင့် သင့် React code ရဲ့ "အပြင်ကို ထွက်" ပြီး *external* system တစ်ခုခုနဲ့ ထပ်တူပြုဖို့ သုံးတယ်ဆိုတာ သတိရပါ။ ဒီထဲမှာ browser APIs တွေ၊ third-party widgets တွေ၊ network စတာတွေ ပါဝင်ပါတယ်။ သင့် Effect က state တစ်ခုကို တခြား state ပေါ် အခြေခံပြီး ချိန်ညှိရုံပဲ လုပ်နေတယ်ဆိုရင် — [သင်က Effect တစ်ခု မလိုအပ်နိုင်ပါဘူး](/docs/react/you-might-not-need-an-effect)။

## Effect တစ်ခုကို ဘယ်လို ရေးမလဲ

Effect တစ်ခု ရေးဖို့ — ဒီအဆင့် သုံးဆင့်ကို လိုက်နာပါ:

1. **Effect တစ်ခုကို ကြေညာပါ။** ပုံမှန်အားဖြင့် — သင့် Effect က [commit](/docs/react/render-and-commit) တိုင်းပြီးနောက်မှာ run ပါလိမ့်မယ်။
2. **Effect dependencies တွေကို သတ်မှတ်ပါ။** Effects အများစုက render တိုင်းထက် — *လိုအပ်တဲ့အခါမှ* ပဲ ပြန် run သင့်ပါတယ်။ ဥပမာ — fade-in animation တစ်ခုက component တစ်ခု ပေါ်လာတဲ့အခါမှပဲ စတင်သင့်ပါတယ်။ Chat room တစ်ခုဆီ ချိတ်ဆက်ခြင်းနဲ့ ချိတ်ဆက်ဖြုတ်ခြင်းက component ပေါ်လာတာ/ပျောက်တဲ့အခါ ဒါမှမဟုတ် chat room ပြောင်းတဲ့အခါမှပဲ ဖြစ်သင့်ပါတယ်။ *dependencies* တွေကို သတ်မှတ်ခြင်းဖြင့် ဒါကို ဘယ်လို ထိန်းချုပ်မလဲ သင်ယူရပါမယ်။
3. **လိုအပ်ရင် cleanup ထည့်ပါ။** Effects တချို့က သူတို့ လုပ်နေတာတွေကို ဘယ်လို ရပ်ရမယ်၊ ပြန်ဖျက်ရမယ်၊ ဒါမှမဟုတ် ရှင်းလင်းရမယ်ဆိုတာ သတ်မှတ်ပေးဖို့ လိုပါတယ်။ ဥပမာ — "connect" က "disconnect" လို၊ "subscribe" က "unsubscribe" လို၊ ပြီးတော့ "fetch" က "cancel" ဒါမှမဟုတ် "ignore" တစ်ခုခု လိုပါတယ်။ *cleanup function* တစ်ခုကို ပြန်ပေးခြင်းဖြင့် ဒါကို ဘယ်လို လုပ်မလဲ သင်ယူရပါမယ်။

အဆင့်တစ်ခုချင်းစီကို အသေးစိတ် ကြည့်ရအောင်။

### အဆင့် ၁ — Effect တစ်ခုကို ကြေညာခြင်း

သင့် component ထဲမှာ Effect တစ်ခု ကြေညာဖို့ — React ကနေ [`useEffect` Hook](/docs/react/use-effect) ကို import လုပ်ပါ:

```js
import { useEffect } from 'react';
```

ပြီးရင် — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ အဲဒါကို ခေါ်ပြီး — သင့် Effect ရဲ့ အတွင်းမှာ code တချို့ ထည့်ပါ:

```js
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

သင့် component က render လုပ်တိုင်း — React က screen ကို update လုပ်ပြီး — *ပြီးမှ* `useEffect` ထဲက code ကို run ပါလိမ့်မယ်။ တစ်နည်းပြောရရင် — **`useEffect` က code တစ်ပိုင်းကို — အဲဒီ render က screen ပေါ်မှာ ထင်ဟပ်မချင်း run လုပ်တာကို "ဆိုင်းငံ့" ထားပါတယ်။**

External system တစ်ခုနဲ့ ထပ်တူပြုဖို့ Effect တစ်ခုကို ဘယ်လို သုံးနိုင်လဲ ကြည့်ရအောင်။ `<VideoPlayer>` React component တစ်ခုကို စဉ်းစားကြည့်ပါ။ အဲဒါဆီ `isPlaying` prop တစ်ခု ပေးလိုက်ခြင်းဖြင့် — သူ playing လား paused လားဆိုတာ ထိန်းချုပ်နိုင်ရင် ကောင်းပါမယ်:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

သင့်ရဲ့ custom `VideoPlayer` component က built-in browser [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tag ကို render လုပ်ပါတယ်:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

ဒါပေမယ့် — browser ရဲ့ `<video>` tag မှာ `isPlaying` prop မရှိပါဘူး။ ဒါကို ထိန်းချုပ်နိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းက — DOM element ပေါ်မှာ [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) နဲ့ [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) methods တွေကို ကိုယ်တိုင် ခေါ်ခြင်းပါ။ **Video က လက်ရှိ playing ဖြစ်*သင့်*မသင့် ပြောတဲ့ `isPlaying` prop ရဲ့ တန်ဖိုးကို — `play()` နဲ့ `pause()` ခေါ်မှုတွေနဲ့ ထပ်တူပြုဖို့ လိုပါတယ်။**

ပထမဆုံး `<video>` DOM node ဆီ [ref တစ်ခု ရယူဖို့](/docs/react/manipulating-the-dom-with-refs) လိုပါလိမ့်မယ်။

Rendering အတွင်းမှာ `play()` ဒါမှမဟုတ် `pause()` ကို ခေါ်ဖို့ စိတ်ကူးရနိုင်ပေမယ့် — အဲဒါ မမှန်ပါဘူး:

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```
```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

ဒီ code မမှန်တဲ့ အကြောင်းရင်းက — rendering အတွင်းမှာ DOM node နဲ့ တစ်ခုခု လုပ်ဖို့ ကြိုးစားလို့ပါ။ React မှာ — [rendering က JSX ရဲ့ pure calculation](/docs/react/keeping-components-pure) တစ်ခု ဖြစ်သင့်ပြီး — DOM ကို ပြုပြင်တာလိုမျိုး side effects တွေ မပါဝင်သင့်ပါဘူး။

ဒါ့အပြင် — `VideoPlayer` ကို ပထမဆုံးအကြိမ် ခေါ်တဲ့အခါ — သူ့ရဲ့ DOM က မရှိသေးပါဘူး! `play()` ဒါမှမဟုတ် `pause()` ခေါ်ဖို့ DOM node တစ်ခု မရှိသေးပါဘူး — ဘာလို့လဲဆိုတော့ သင်က JSX ကို ပြန်မပေးမချင်း React က ဘာ DOM ဖန်တီးရမယ်ဆိုတာ မသိလို့ပါ။

ဒီမှာ ဖြေရှင်းနည်းက — **side effect ကို `useEffect` နဲ့ ထုပ်ပြီး — rendering calculation ရဲ့ အပြင်ကို ရွှေ့ထားဖို့ပါ:**

```js
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM update ကို Effect တစ်ခုထဲမှာ ထုပ်လိုက်ခြင်းဖြင့် — React ကို screen ကို အရင်ဆုံး update လုပ်ခွင့် ပေးလိုက်ပါတယ်။ ပြီးရင် သင့် Effect က run ပါတယ်။

သင့် `VideoPlayer` component က render လုပ်တဲ့အခါ (ပထမဆုံးအကြိမ်ဖြစ်ဖြစ် ပြန် re-render ဖြစ်ဖြစ်) — အရာနှစ်ခုလောက် ဖြစ်ပါလိမ့်မယ်။ ပထမဆုံး — React က screen ကို update လုပ်ပြီး — `<video>` tag က မှန်ကန်တဲ့ props တွေနဲ့ DOM ထဲမှာ ရှိနေအောင် သေချာလုပ်ပါမယ်။ ပြီးရင် React က သင့် Effect ကို run ပါလိမ့်မယ်။ နောက်ဆုံးမှာ — သင့် Effect က `isPlaying` ရဲ့ တန်ဖိုးပေါ် မူတည်ပြီး `play()` ဒါမှမဟုတ် `pause()` ကို ခေါ်ပါလိမ့်မယ်။

Play/Pause ကို အကြိမ်များစွာ နှိပ်ပြီး — video player က `isPlaying` တန်ဖိုးနဲ့ ထပ်တူဖြစ်နေတာ ကြည့်ပါ:

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```
```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

ဒီဥပမာမှာ — သင်က React state နဲ့ ထပ်တူပြုခဲ့တဲ့ "external system" က browser media API ပါ။ ဒီလိုနည်းနဲ့ပဲ — jQuery plugins လိုမျိုး — အဟောင်း (legacy) React မဟုတ်တဲ့ code တွေကို declarative React components တွေအဖြစ် ထုပ်နိုင်ပါတယ်။

လက်တွေ့မှာ video player တစ်ခုကို ထိန်းချုပ်တာက အများကြီး ပိုရှုပ်ထွေးတာ သတိပြုပါ။ `play()` ခေါ်တာ မအောင်မြင်နိုင်သလို — အသုံးပြုသူက built-in browser controls တွေနဲ့ play ဒါမှမဟုတ် pause လုပ်နိုင်တာမျိုး စသဖြင့်ပါ။ ဒီဥပမာက အရမ်း ရိုးရှင်းပြီး မပြည့်စုံပါဘူး။

> **သတိပြုရန်:** ပုံမှန်အားဖြင့် — Effects တွေက render *တိုင်း* ပြီးနောက်မှာ run ပါတယ်။ ဒါကြောင့် — ဒီလိုမျိုး code က **infinite loop တစ်ခုကို ဖြစ်စေပါတယ်:**
>
> ```js
> const [count, setCount] = useState(0);
> useEffect(() => {
>   setCount(count + 1);
> });
> ```
>
> Effects တွေက rendering ရဲ့ *ရလဒ်အဖြစ်* run ပါတယ်။ State set လုပ်တာက rendering ကို *ဖြစ်စေ* ပါတယ်။ Effect တစ်ခုထဲမှာ ချက်ချင်း state set လုပ်တာက — ပလပ်ပေါက်တစ်ခုကို သူ့ကိုယ်သူ ပြန်ထိုးလိုက်သလိုပါ။ Effect က run ပြီး — state ကို set လုပ်တယ် — ဒါက re-render ကို ဖြစ်စေတယ် — ဒါက Effect ကို ပြန် run စေတယ် — state ကို ထပ် set လုပ်တယ် — ဒါက နောက်ထပ် re-render တစ်ခု ဖြစ်စေတယ် — ဒီလိုနဲ့ ဆက်သွားပါတယ်။
>
> Effects တွေက ပုံမှန်အားဖြင့် သင့် component တွေကို *external* system တစ်ခုနဲ့ ထပ်တူပြုသင့်ပါတယ်။ External system မရှိဘဲ — state တစ်ခုကို တခြား state ပေါ် အခြေခံပြီး ချိန်ညှိရုံပဲ လုပ်ချင်တယ်ဆိုရင် — [သင်က Effect တစ်ခု မလိုအပ်နိုင်ပါဘူး](/docs/react/you-might-not-need-an-effect)။

### အဆင့် ၂ — Effect Dependencies တွေကို သတ်မှတ်ခြင်း

ပုံမှန်အားဖြင့် — Effects တွေက render *တိုင်း* ပြီးနောက်မှာ run ပါတယ်။ မကြာခဏဆိုသလို — ဒါက **သင်လိုချင်တာ မဟုတ်ပါဘူး:**

- တခါတရံ — ဒါက နှေးပါတယ်။ External system တစ်ခုနဲ့ ထပ်တူပြုတာက အမြဲတမ်း ချက်ချင်း မဟုတ်ပါဘူး — ဒါကြောင့် မလိုအပ်ရင် အဲဒါကို ရှောင်ချင်နိုင်ပါတယ်။ ဥပမာ — key တိုင်း နှိပ်တိုင်း chat server ဆီ ပြန်ချိတ်ချင်မှာ မဟုတ်ပါဘူး။
- တခါတရံ — ဒါက မှားပါတယ်။ ဥပမာ — key တိုင်း နှိပ်တိုင်း component တစ်ခုရဲ့ fade-in animation ကို စတင်ချင်မှာ မဟုတ်ပါဘူး။ Animation က component ပထမဆုံးအကြိမ် ပေါ်လာတဲ့အခါ တစ်ခါပဲ ပြတ်သင့်ပါတယ်။

ပြဿနာကို သရုပ်ပြဖို့ — ဒီမှာ `console.log` ခေါ်မှုအနည်းငယ်နဲ့ parent component ရဲ့ state ကို update လုပ်တဲ့ text input တစ်ခု ပါတဲ့ — အရင်ဥပမာပါ။ စာရိုက်တာက Effect ကို ပြန် run စေတာ သတိပြုပါ:

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```
```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

`useEffect` ခေါ်မှုရဲ့ ဒုတိယ argument အဖြစ် *dependencies* တစ်ခုရဲ့ array တစ်ခုကို သတ်မှတ်ခြင်းဖြင့် — React ကို **မလိုအပ်ဘဲ Effect ကို ပြန် run လုပ်တာကို ရှောင်ဖို့** ပြောနိုင်ပါတယ်။ အထက်ပါ ဥပမာရဲ့ line 14 မှာ ဗလာ `[]` array တစ်ခု ထည့်ခြင်းဖြင့် စလိုက်ပါ:

```js
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'` လို့ ပြောတဲ့ error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```
```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

ပြဿနာက — သင့် Effect ရဲ့ အတွင်းက code က ဘာလုပ်ရမယ်ဆိုတာ ဆုံးဖြတ်ဖို့ `isPlaying` prop *ပေါ်မှာ မှီခိုနေပေမယ့်* — ဒီ dependency ကို ရှင်းလင်းစွာ ကြေညာမထားလို့ပါ။ ဒီပြဿနာကို ဖြေရှင်းဖို့ — `isPlaying` ကို dependency array ထဲ ထည့်ပါ:

```js
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

အခု dependencies တွေအားလုံး ကြေညာပြီးသားမို့ — error မရှိတော့ပါဘူး။ Dependency array အဖြစ် `[isPlaying]` ကို သတ်မှတ်ခြင်းက — `isPlaying` က အရင် render ကအတိုင်း အတူတူဆိုရင် — သင့် Effect ကို ပြန် run လုပ်တာကို ရှောင်သင့်တယ်လို့ React ကို ပြောပါတယ်။ ဒီပြောင်းလဲမှုနဲ့ဆိုရင် — input ထဲ စာရိုက်တာက Effect ကို ပြန် run မစေတော့ပေမယ့် — Play/Pause နှိပ်တာကတော့ ပြန် run စေပါတယ်:

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```
```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

Dependency array ထဲမှာ dependencies အများကြီး ပါဝင်နိုင်ပါတယ်။ သင်သတ်မှတ်ထားတဲ့ dependencies တွေ *အားလုံး* က အရင် render တုန်းကနဲ့ အတိအကျ တန်ဖိုးတွေ အတူတူဖြစ်မှပဲ — React က Effect ကို ပြန် run လုပ်တာကို ရှောင်ပါလိမ့်မယ်။ React က dependency တန်ဖိုးတွေကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှုနဲ့ နှိုင်းယှဉ်ပါတယ်။ အသေးစိတ်ကို [`useEffect` reference](/docs/react/use-effect) မှာ ကြည့်ပါ။

**သင်က သင့် dependencies တွေကို "ရွေးချယ်" လို့ မရဘူးဆိုတာ သတိပြုပါ။** သင့် Effect ရဲ့ အတွင်းက code ပေါ် အခြေခံပြီး React က မျှော်လင့်တာနဲ့ — သင်သတ်မှတ်ထားတဲ့ dependencies တွေ မကိုက်ညီရင် lint error တစ်ခု ရပါလိမ့်မယ်။ ဒါက သင့် code ထဲက bug တွေ အများကြီးကို ဖမ်းမိစေပါတယ်။ Code တချို့ကို ပြန် run မစေချင်ဘူးဆိုရင် — အဲဒီ dependency ကို "မလိုအပ်အောင်" [*Effect code ကိုယ်တိုင်ကို ပြင်ဆင်* ပါ](/docs/react/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)။

> **သတိပြုရန်:** Dependency array မပါတာနဲ့ — *ဗလာ* `[]` dependency array ပါတာရဲ့ အပြုအမူတွေက မတူပါဘူး:
>
> ```js
> useEffect(() => {
>   // This runs after every render
> });
>
> useEffect(() => {
>   // This runs only on mount (when the component appears)
> }, []);
>
> useEffect(() => {
>   // This runs on mount *and also* if either a or b have changed since the last render
> }, [a, b]);
> ```
>
> "mount" ဆိုတာ ဘာကို ဆိုလိုလဲဆိုတာကို နောက်အဆင့်မှာ အနီးကပ် လေ့လာပါမယ်။

#### Ref ကို Dependency Array ကနေ ဘာကြောင့် ချန်လှပ်ထားတာလဲ

ဒီ Effect က `ref` *ရော* `isPlaying` *ပါ* နှစ်ခုလုံး သုံးပေမယ့် — `isPlaying` တစ်ခုပဲ dependency အဖြစ် ကြေညာထားပါတယ်:

```js
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

ဒါက `ref` object က *stable identity* ရှိလို့ပါ: React က [`useRef` ခေါ်မှုတစ်ခုတည်းကနေ render တိုင်း object တစ်ခုတည်းကိုပဲ ရမယ်လို့](/docs/react/use-ref) အာမခံပါတယ်။ အဲဒါက ဘယ်တော့မှ မပြောင်းပါဘူး — ဒါကြောင့် သူ့ကိုယ်သူ Effect ကို ပြန် run စေတာ ဘယ်တော့မှ မရှိပါဘူး။ ဒါကြောင့် — ထည့်တာ/မထည့်တာ အရေးမကြီးပါဘူး။ ထည့်တာလည်း အဆင်ပြေပါတယ်:

```js
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState` က ပြန်ပေးတဲ့ [`set` functions](/docs/react/state-snapshot) တွေလည်း stable identity ရှိတာမို့ — သူတို့ကိုလည်း dependencies တွေကနေ ချန်လှပ်ထားတာ မကြာခဏ တွေ့ရပါလိမ့်မယ်။ Linter က error မရှိဘဲ dependency တစ်ခုကို ချန်လှပ်ခွင့် ပေးရင် — အဲဒါလုပ်တာ အန္တရာယ်ကင်းပါတယ်။

အမြဲတည်မြဲတဲ့ (always-stable) dependencies တွေကို ချန်လှပ်တာက — linter က object က stable ဆိုတာ "မြင်နိုင်" တဲ့အခါမှပဲ အလုပ်လုပ်ပါတယ်။ ဥပမာ — `ref` ကို parent component တစ်ခုကနေ ပို့ပေးတယ်ဆိုရင် — အဲဒါကို dependency array ထဲမှာ သတ်မှတ်ပေးရပါလိမ့်မယ်။ ဒါပေမယ့် — ဒါက ကောင်းပါတယ် — ဘာလို့လဲဆိုတော့ parent component က ref တစ်ခုတည်းကိုပဲ အမြဲ ပို့ပေးသလား၊ ဒါမှမဟုတ် ref အများကြီးထဲက တစ်ခုကို conditionally ပို့ပေးသလားဆိုတာ သင်မသိနိုင်လို့ပါ။ ဒါကြောင့် — သင့် Effect က ဘယ် ref ကို ပို့ပေးလဲဆိုတာ *ပေါ်မှာ မှီခိုနေ* ပါလိမ့်မယ်။

### အဆင့် ၃ — လိုအပ်ရင် Cleanup ထည့်ခြင်း

တခြားဥပမာတစ်ခုကို စဉ်းစားကြည့်ပါ။ ပေါ်လာတဲ့အခါ chat server ဆီ ချိတ်ဆက်ဖို့ လိုတဲ့ `ChatRoom` component တစ်ခုကို သင်ရေးနေပါတယ်။ `connect()` နဲ့ `disconnect()` methods တွေပါတဲ့ object တစ်ခုကို ပြန်ပေးတဲ့ `createConnection()` API တစ်ခုကို သင့်ကို ပေးထားပါတယ်။ Component ကို အသုံးပြုသူဆီ ပြသနေသရွေ့ — ချိတ်ဆက်ထားအောင် ဘယ်လို လုပ်မလဲ?

Effect logic ကို ရေးခြင်းဖြင့် စလိုက်ပါ:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Re-render တိုင်း chat ဆီ ချိတ်ဆက်တာက နှေးမှာမို့ — dependency array ကို ထည့်လိုက်ပါ:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect ရဲ့ အတွင်းက code က props ဒါမှမဟုတ် state ဘာမှ မသုံးတာမို့ — သင့် dependency array က `[]` (ဗလာ) ပါ။ ဒါက React ကို — ဒီ code ကို component "mount" ဖြစ်တဲ့အခါ — ဆိုလိုတာက screen ပေါ်မှာ ပထမဆုံးအကြိမ် ပေါ်လာတဲ့အခါ — ပဲ run လုပ်ဖို့ ပြောတာပါ။**

ဒီ code ကို run လုပ်ကြည့်ရအောင်:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```
```js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
```

ဒီ Effect က mount ပေါ်မှာပဲ run တာမို့ — console ထဲမှာ `"✅ Connecting..."` တစ်ကြိမ်ပဲ ပုံနှိပ်မယ်လို့ သင်မျှော်လင့်နိုင်ပါတယ်။ **ဒါပေမယ့် — console ကို စစ်ကြည့်ရင် — `"✅ Connecting..."` က နှစ်ကြိမ် ပုံနှိပ်ပါတယ်။ ဘာကြောင့် ဒီလိုဖြစ်တာလဲ?**

`ChatRoom` component က screen အများကြီး ရှိတဲ့ app ကြီးတစ်ခုရဲ့ အစိတ်အပိုင်းတစ်ခုလို့ စိတ်ကူးကြည့်ပါ။ အသုံးပြုသူက `ChatRoom` page ပေါ်မှာ သူ့ရဲ့ journey ကို စတင်ပါတယ်။ Component က mount ဖြစ်ပြီး `connection.connect()` ကို ခေါ်ပါတယ်။ ပြီးရင် အသုံးပြုသူက တစ်ခြား screen တစ်ခုဆီ သွားတယ်လို့ စိတ်ကူးကြည့်ပါ — ဥပမာ Settings page ဆီပေါ့။ `ChatRoom` component က unmount ဖြစ်ပါတယ်။ နောက်ဆုံးမှာ အသုံးပြုသူက Back ကို နှိပ်ပြီး `ChatRoom` က ပြန် mount ဖြစ်ပါတယ်။ ဒါက ဒုတိယ connection တစ်ခုကို တည်ဆောက်ပါလိမ့်မယ် — ဒါပေမယ့် — ပထမ connection က ဘယ်တော့မှ မဖျက်ဆီးခဲ့ပါဘူး! အသုံးပြုသူက app အတွင်း သွားလာနေတာနဲ့အမျှ — connections တွေက ဆက်ပြီး တပုံတပင်ကြီး ပေါက်လာပါလိမ့်မယ်။

ဒီလိုမျိုး bug တွေက — ကျယ်ကျယ်ပြန့်ပြန့် manual testing မလုပ်ရင် သတိမထားမိဘဲ လွဲသွားလွယ်ပါတယ်။ သူတို့ကို မြန်မြန် ဖမ်းမိဖို့ ကူညီပေးဖို့ — development မှာ React က component တိုင်းကို — သူ့ရဲ့ ကနဦး mount ပြီးပြီးချင်း — တစ်ကြိမ် ပြန်လည် mount (remount) လုပ်ပါတယ်။

`"✅ Connecting..."` log ကို နှစ်ကြိမ် မြင်ရတာက — တကယ့်ပြဿနာကို သတိထားမိစေပါတယ်: သင့် code က component unmount ဖြစ်တဲ့အခါ connection ကို မပိတ်ပါဘူး။

ပြဿနာကို ဖြေရှင်းဖို့ — သင့် Effect ကနေ *cleanup function* တစ်ခုကို ပြန်ပေးပါ:

```js
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React က သင့် cleanup function ကို — Effect က နောက်တစ်ကြိမ် ပြန်လည် run လုပ်ခါနီးတိုင်း — ပြီးတော့ — component unmount ဖြစ် (ဖယ်ရှားခံရ) တဲ့အခါ နောက်ဆုံးတစ်ကြိမ် — ခေါ်ပါလိမ့်မယ်။ Cleanup function implement လုပ်ပြီးတဲ့အခါ ဘာဖြစ်လဲ ကြည့်ရအောင်:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```
```js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
```

အခု development မှာ console log သုံးခု ရပါတယ်:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**ဒါက development မှာ မှန်ကန်တဲ့ အပြုအမူပါ။** Component ကို ပြန်လည် mount လုပ်ခြင်းဖြင့် — React က ဝေးရာကို သွားပြီး ပြန်လာတာက သင့် code ကို မပျက်စီးစေဘူးဆိုတာ စစ်ဆေးပါတယ်။ Disconnect လုပ်ပြီး ပြန် connect လုပ်တာက — အတိအကျ ဖြစ်သင့်တဲ့အရာပါ! Cleanup ကို ကောင်းကောင်း implement လုပ်ထားရင် — Effect ကို တစ်ကြိမ် run လုပ်တာနဲ့ — run လုပ်၊ ရှင်းလင်း၊ ပြန် run လုပ်တာကြားမှာ — အသုံးပြုသူ မြင်နိုင်တဲ့ ကွာခြားချက် မရှိသင့်ပါဘူး။ Connect/disconnect ခေါ်မှု အတွဲပိုတစ်ခု ရှိတာက — React က development မှာ သင့် code ထဲက bug တွေကို စစ်ဆေးနေလို့ပါ။ ဒါက ပုံမှန်ပါ — အဲဒါ ပျောက်အောင် မကြိုးစားပါနဲ့!

**Production မှာတော့ — `"✅ Connecting..."` တစ်ကြိမ်ပဲ ပုံနှိပ်တာ မြင်ရပါလိမ့်မယ်။** Component တွေကို ပြန်လည် mount လုပ်တာက — cleanup လိုအပ်တဲ့ Effects တွေကို ရှာဖွေဖို့ ကူညီပေးဖို့ — development မှာပဲ ဖြစ်တာပါ။ Development အပြုအမူကို ဖယ်ရှားဖို့ [Strict Mode](/docs/react/strict-mode) ကို ပိတ်နိုင်ပါတယ် — ဒါပေမယ့် — အဲဒါကို ဖွင့်ထားဖို့ပဲ အကြံပြုပါတယ်။ ဒါက အပေါ်က ဥပမာလိုမျိုး bug တွေ အများကြီးကို ရှာတွေ့စေပါတယ်။

## Development မှာ Effect နှစ်ကြိမ် ပြေးတာကို ဘယ်လို ကိုင်တွယ်မလဲ

React က သင့် component တွေကို development မှာ ရည်ရွယ်ချက်ရှိရှိ ပြန်လည် mount လုပ်ပြီး — နောက်ဆုံးဥပမာလိုမျိုး bug တွေကို ရှာဖွေပါတယ်။ **မှန်ကန်တဲ့ မေးခွန်းက "Effect တစ်ခုကို ဘယ်လို တစ်ခါပဲ run လုပ်မလဲ" မဟုတ်ဘဲ — "ပြန်လည် mount လုပ်ပြီးတဲ့နောက်မှာ အလုပ်လုပ်နိုင်အောင် ငါ့ Effect ကို ဘယ်လို ပြုပြင်မလဲ" ဆိုတာပါ။**

အများအားဖြင့် — အဖြေက cleanup function ကို implement လုပ်ဖို့ပါ။ Cleanup function က Effect လုပ်နေတာတွေကို ရပ်တန့် ဒါမှမဟုတ် ပြန်ဖျက်ပေးသင့်ပါတယ်။ အကြမ်းဖျဉ်း စည်းမျဉ်းကတော့ — အသုံးပြုသူက Effect တစ်ကြိမ် run လုပ်တာ (production မှာလို) နဲ့ — *setup → cleanup → setup* ဆိုတဲ့ sequence (development မှာ မြင်ရမယ့်အတိုင်း) ကြားမှာ — ခွဲခြားလို့ မရသင့်ပါဘူး။

သင်ရေးမယ့် Effects အများစုက — အောက်က ပုံမှန် pattern တွေထဲက တစ်ခုခုနဲ့ ကိုက်ညီပါလိမ့်မယ်။

> **သတိပြုရန်:**
>
> #### Effects တွေ ပြေးတာကို တားဆီးဖို့ Refs တွေကို မသုံးပါနဲ့
>
> Development မှာ Effects တွေ နှစ်ကြိမ် ပြေးတာကို တားဆီးဖို့ ဖြစ်လေ့ဖြစ်ထရှိတဲ့ အကွက်တစ်ခုက — Effect ကို တစ်ကြိမ်ထက် ပိုပြီး run မဖြစ်အောင် `ref` တစ်ခုကို သုံးခြင်းပါ။ ဥပမာ — အထက်က bug ကို `useRef` နဲ့ ဒီလို "ပြုပြင်" နိုင်ပါတယ်:
>
> ```js
>   const connectionRef = useRef(null);
>   useEffect(() => {
>     // 🚩 This wont fix the bug!!!
>     if (!connectionRef.current) {
>       connectionRef.current = createConnection();
>       connectionRef.current.connect();
>     }
>   }, []);
> ```
>
> ဒါက development မှာ `"✅ Connecting..."` တစ်ကြိမ်ပဲ မြင်ရအောင် လုပ်ပေးပေမယ့် — bug ကို မပြုပြင်ပါဘူး။
>
> အသုံးပြုသူက ဝေးရာကို သွားတဲ့အခါ — connection က ပိတ်မထားသေးသလို — ပြန်လာတဲ့အခါ — connection အသစ်တစ်ခု ဖန်တီးပါတယ်။ အသုံးပြုသူက app အတွင်း သွားလာနေတာနဲ့အမျှ — connections တွေက "ပြုပြင်မှု" မလုပ်ခင် ကလိုပဲ — တပုံတပင်ကြီး ပေါက်လာပါလိမ့်မယ်။
>
> Bug ကို ပြုပြင်ဖို့ — Effect ကို တစ်ခါပဲ run အောင် လုပ်ရုံနဲ့ မလုံလောက်ပါဘူး။ Effect က re-mounting ပြီးနောက်မှာ အလုပ်လုပ်ဖို့ လိုပါတယ် — ဆိုလိုတာက — connection ကို အထက်က ဖြေရှင်းချက်မှာလိုပဲ — ရှင်းလင်းဖို့ လိုပါတယ်။
>
> ပုံမှန် pattern တွေကို ဘယ်လို ကိုင်တွယ်မလဲဆိုတာ အောက်က ဥပမာတွေမှာ ကြည့်ပါ။

### React မဟုတ်တဲ့ Widgets တွေကို ထိန်းချုပ်ခြင်း

တခါတရံ React နဲ့ မရေးထားတဲ့ UI widgets တွေကို ထည့်ဖို့ လိုနိုင်ပါတယ်။ ဥပမာ — သင့် page ဆီ map component တစ်ခု ထည့်နေတယ်ဆိုပါစို့။ အဲဒီမှာ `setZoomLevel()` method တစ်ခု ရှိပြီး — သင်က zoom level ကို သင့် React code ထဲက `zoomLevel` state variable တစ်ခုနဲ့ ထပ်တူဖြစ်နေစေချင်ပါတယ်။ သင့် Effect က ဒီလိုမျိုး ဖြစ်ပါလိမ့်မယ်:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

ဒီကိစ္စမှာ cleanup မလိုဘူးဆိုတာ သတိပြုပါ။ Development မှာ — React က Effect ကို နှစ်ကြိမ် ခေါ်ပါလိမ့်မယ် — ဒါပေမယ့် — ဒါက ပြဿနာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ `setZoomLevel` ကို တန်ဖိုးတစ်ခုတည်းနဲ့ နှစ်ကြိမ် ခေါ်တာက ဘာမှ မလုပ်လို့ပါ။ နည်းနည်း နှေးကောင်း နှေးနိုင်ပေမယ့် — production မှာ မလိုအပ်ဘဲ remount မဖြစ်တာမို့ — အရေးမကြီးပါဘူး။

API တချို့က သင့်ကို ဆက်တိုက် နှစ်ကြိမ် ခေါ်ခွင့် မပေးနိုင်ပါဘူး။ ဥပမာ — built-in [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) element ရဲ့ [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method က — နှစ်ကြိမ် ခေါ်ရင် throw လုပ်ပါတယ်။ Cleanup function ကို implement လုပ်ပြီး — dialog ကို ပိတ်စေပါ:

```js
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Development မှာ — သင့် Effect က `showModal()` ကို ခေါ်ပြီး — ချက်ချင်း `close()` — ပြီးတော့ `showModal()` ကို ထပ်ခေါ်ပါလိမ့်မယ်။ ဒါက production မှာ မြင်ရမယ့် `showModal()` တစ်ခါခေါ်တာနဲ့ — အသုံးပြုသူ မြင်နိုင်တဲ့ အပြုအမူ အတူတူပါ။

### Events တွေကို Subscribe လုပ်ခြင်း

သင့် Effect က တစ်ခုခုကို subscribe လုပ်တယ်ဆိုရင် — cleanup function က unsubscribe လုပ်သင့်ပါတယ်:

```js
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Development မှာ — သင့် Effect က `addEventListener()` ကို ခေါ်ပြီး — ချက်ချင်း `removeEventListener()` — ပြီးတော့ handler တစ်ခုတည်းနဲ့ `addEventListener()` ကို ထပ်ခေါ်ပါလိမ့်မယ်။ ဒါကြောင့် — တစ်ချိန်မှာ active subscription တစ်ခုပဲ ရှိပါလိမ့်မယ်။ ဒါက production မှာလိုပဲ — `addEventListener()` တစ်ခါခေါ်တာနဲ့ — အသုံးပြုသူ မြင်နိုင်တဲ့ အပြုအမူ အတူတူပါ။

### Animations တွေကို စတင်ခြင်း

သင့် Effect က တစ်ခုခုကို animate လုပ်ရင် — cleanup function က animation ကို ကနဦးတန်ဖိုးတွေဆီ ပြန်လည်သတ်မှတ် (reset) သင့်ပါတယ်:

```js
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

Development မှာ — opacity က `1` ဖြစ်ပြီး — `0` — ပြီးတော့ `1` ကို ပြန်ဖြစ်ပါလိမ့်မယ်။ ဒါက production မှာ ဖြစ်မယ့်အတိုင်း — `1` ကို တိုက်ရိုက် set လုပ်တာနဲ့ — အသုံးပြုသူ မြင်နိုင်တဲ့ အပြုအမူ အတူတူ ဖြစ်သင့်ပါတယ်။ Tweening ကို ထောက်ပံ့တဲ့ third-party animation library တစ်ခုကို သုံးရင် — သင့် cleanup function က timeline ကို သူ့ရဲ့ ကနဦး state ဆီ ပြန်လည်သတ်မှတ်သင့်ပါတယ်။

### Data Fetching

သင့် Effect က တစ်ခုခုကို fetch လုပ်ရင် — cleanup function က [fetch ကို abort လုပ်သင့်တယ်](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ဒါမှမဟုတ် သူ့ရဲ့ result ကို ignore လုပ်သင့်ပါတယ်:

```js
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

ဖြစ်ပြီးသွားတဲ့ network request တစ်ခုကို သင်က "ပြန်ဖျက်" လို့ မရပါဘူး — ဒါပေမယ့် — သင့် cleanup function က *ဆက်စပ်မှု မရှိတော့တဲ့* fetch က သင့် application ကို ဆက်ပြီး မထိခိုက်စေဖို့ သေချာစေသင့်ပါတယ်။ `userId` က `'Alice'` ကနေ `'Bob'` ကို ပြောင်းရင် — cleanup က `'Alice'` ရဲ့ response က `'Bob'` ပြီးမှ ရောက်လာရင်တောင် — ignore လုပ်ကြောင်း သေချာစေပါတယ်။

**Development မှာ — Network tab ထဲမှာ fetch နှစ်ခု မြင်ရပါလိမ့်မယ်။** ဒါမှာ ဘာမှ မမှားပါဘူး။ အထက်က နည်းလမ်းနဲ့ဆိုရင် — ပထမ Effect က ချက်ချင်း cleanup ဖြစ်လို့ — သူ့ရဲ့ `ignore` variable copy က `true` ဖြစ်သွားပါလိမ့်မယ်။ ဒါကြောင့် — request အပိုတစ်ခု ရှိပေမယ့် — `if (!ignore)` စစ်ဆေးမှုကြောင့် — state ကို မထိခိုက်စေပါဘူး။

**Production မှာ — request တစ်ခုပဲ ရှိပါလိမ့်မယ်။** Development ထဲက ဒုတိယ request က သင့်ကို စိတ်အနှောင့်အယှက် ဖြစ်စေရင် — အကောင်းဆုံးနည်းလမ်းက — requests တွေကို deduplicate လုပ်ပြီး — သူတို့ရဲ့ responses တွေကို components တွေကြားမှာ cache လုပ်ပေးတဲ့ — ဖြေရှင်းနည်းတစ်ခုကို သုံးခြင်းပါ:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

ဒါက development experience ကို တိုးတက်စေရုံသာမက — သင့် application ကို ပိုမြန်အောင်လည်း လုပ်ပေးပါလိမ့်မယ်။ ဥပမာ — အသုံးပြုသူက Back button နှိပ်လိုက်ရင် — data က cache ဖြစ်ပြီးသားမို့ — ပြန်ပြီး စောင့်စရာ မလိုတော့ပါဘူး။ ဒီလို cache တစ်ခုကို ကိုယ်တိုင် တည်ဆောက်နိုင်သလို — Effects တွေထဲမှာ manual fetching လုပ်တာရဲ့ — အခြားရွေးချယ်စရာ အများကြီးထဲက တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

#### Effects တွေထဲမှာ Data Fetching အတွက် ကောင်းတဲ့ အခြားရွေးချယ်စရာတွေက ဘာတွေလဲ

Effects တွေရဲ့ အတွင်းမှာ `fetch` ခေါ်မှုတွေ ရေးတာက — [data fetch လုပ်ဖို့ နာမည်ကြီးတဲ့ နည်းလမ်း](https://www.robinwieruch.de/react-hooks-fetch-data/) တစ်ခုပါ — အထူးသဖြင့် client-side app တွေလုံးမှာပေါ့။ ဒါပေမယ့် — ဒါက အရမ်း manual ဖြစ်တဲ့ နည်းလမ်းဖြစ်ပြီး — သိသာတဲ့ အားနည်းချက်တွေ ရှိပါတယ်:

- **Effects တွေက server ပေါ်မှာ run မလုပ်ပါဘူး။** ဒါက ဆိုလိုတာက — ကနဦး server-rendered HTML မှာ data မပါတဲ့ loading state တစ်ခုပဲ ပါပါလိမ့်မယ်။ Client computer က JavaScript အားလုံးကို ဒေါင်းလုဒ်လုပ်ပြီး — သင့် app ကို render လုပ်ရပါလိမ့်မယ် — ပြီးမှ ဒေတာတွေ load ဖို့ လိုနေပြီဆိုတာ ရှာတွေ့ရပါလိမ့်မယ်။ ဒါက သိပ်ပြီး ထိရောက်မှု မရှိပါဘူး။
- **Effects တွေထဲမှာ တိုက်ရိုက် fetching လုပ်တာက "network waterfalls" တွေ ဖန်တီးလွယ်ပါတယ်။** သင်က parent component ကို render လုပ်တယ် — အဲဒါက data တချို့ fetch လုပ်တယ် — child components တွေကို render လုပ်တယ် — ပြီးရင် သူတို့က သူတို့ရဲ့ data တွေ စတင် fetch လုပ်ကြတယ်။ Network က သိပ်မမြန်ရင် — data အားလုံးကို parallel မှာ fetch လုပ်တာထက် — သိသိသာသာ ပိုနှေးပါတယ်။
- **Effects တွေထဲမှာ တိုက်ရိုက် fetching လုပ်တာက ပုံမှန်အားဖြင့် data ကို preload ဒါမှမဟုတ် cache မလုပ်ပါဘူး။** ဥပမာ — component တစ်ခုက unmount ပြီး ပြန် mount ဖြစ်ရင် — data ကို ပြန် fetch ရပါလိမ့်မယ်။
- **ဒါက သိပ်ပြီး ergonomic မဟုတ်ပါဘူး။** [Race conditions](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) လိုမျိုး bug တွေ မခံစားရတဲ့နည်းနဲ့ `fetch` ခေါ်မှုတွေ ရေးတဲ့အခါ — boilerplate code တွေ အတော်များများ ပါဝင်ပါတယ်။

ဒီအားနည်းချက်စာရင်းက React အတွက်ပဲ သီးသန့် မဟုတ်ပါဘူး။ Library ဘယ်ဟာနဲ့ပဲ ဆိုစမ် — mount ပေါ်မှာ data fetch လုပ်တာနဲ့ သက်ဆိုင်ပါတယ်။ Routing လိုပဲ — data fetching က ကောင်းကောင်း လုပ်ဖို့ မလွယ်ပါဘူး — ဒါကြောင့် အောက်ပါ နည်းလမ်းတွေကို အကြံပြုပါတယ်:

- **သင်က [framework](/docs/react/creating-a-react-app) တစ်ခု သုံးရင် — သူ့ရဲ့ built-in data fetching mechanism ကို သုံးပါ။** Modern React frameworks တွေမှာ — ထိရောက်ပြီး အထက်က အကွက်တွေ မခံစားရတဲ့ — integrated data fetching mechanisms တွေ ရှိပါတယ်။
- **မဟုတ်ရင် — client-side cache တစ်ခုကို သုံးဖို့ ဒါမှမဟုတ် တည်ဆောက်ဖို့ စဉ်းစားပါ။** လူကြိုက်များတဲ့ open source ဖြေရှင်းနည်းတွေထဲမှာ [TanStack Query](https://tanstack.com/query/latest)၊ [useSWR](https://swr.vercel.app/) နဲ့ [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) တွေ ပါဝင်ပါတယ်။ ကိုယ်ပိုင်ဖြေရှင်းနည်းတစ်ခုလည်း တည်ဆောက်နိုင်ပါတယ် — အဲဒီအခါ နောက်ကွယ်မှာ Effects တွေကို သုံးပေမယ့် — requests တွေကို deduplicate လုပ်တဲ့ logic၊ responses တွေကို cache လုပ်တာနဲ့ network waterfalls တွေကို ရှောင်တာ (data တွေကို preload လုပ်ခြင်း ဒါမှမဟုတ် data လိုအပ်ချက်တွေကို routes ဆီ hoist လုပ်ခြင်းဖြင့်) တွေ ထည့်ပါလိမ့်မယ်။

ဒီနည်းလမ်း နှစ်ခုလုံးက သင့်အတွက် မသင့်တော်ဘူးဆိုရင် — Effects တွေထဲမှာ တိုက်ရိုက် data fetching လုပ်တာကို ဆက်လုပ်နိုင်ပါတယ်။

### Analytics ပို့ခြင်း

Page ကို လည်ပတ်တဲ့အခါ analytics event တစ်ခု ပို့တဲ့ ဒီ code ကို စဉ်းစားကြည့်ပါ:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

Development မှာ — `logVisit` က URL တိုင်းအတွက် နှစ်ကြိမ် ခေါ်ခံရပါလိမ့်မယ် — ဒါကြောင့် ဒါကို ပြုပြင်ဖို့ စိတ်ကူးရနိုင်ပါတယ်။ **ဒီ code ကို မပြောင်းဘဲ ထားဖို့ပဲ အကြံပြုပါတယ်။** အရင်ဥပမာတွေလိုပဲ — တစ်ကြိမ် run လုပ်တာနဲ့ နှစ်ကြိမ် run လုပ်တာကြားမှာ *အသုံးပြုသူ မြင်နိုင်တဲ့* အပြုအမူ ကွာခြားချက် မရှိပါဘူး။ လက်တွေ့ကျတဲ့ ရှုထောင့်ကကြည့်ရင် — `logVisit` က development မှာ ဘာမှ မလုပ်သင့်ပါဘူး — ဘာလို့လဲဆိုတော့ development machines တွေရဲ့ logs တွေက production metrics တွေကို လွဲချော်စေတာ မလိုချင်လို့ပါ။ သင့် component က သူ့ရဲ့ file ကို သိမ်းတိုင်း remount ဖြစ်တာမို့ — development မှာ လည်ပတ်မှုတွေ အပိုတွေ log ဖြစ်နေတာပါပဲ။

**Production မှာတော့ — visit log တွေ ထပ်နေတာ ရှိမှာ မဟုတ်ပါဘူး။**

သင်ပို့နေတဲ့ analytics events တွေကို debug လုပ်ဖို့ — သင့် app ကို staging environment တစ်ခုဆီ (production mode နဲ့ run တဲ့) deploy လုပ်နိုင်ပါတယ် — ဒါမှမဟုတ် [Strict Mode](/docs/react/strict-mode) နဲ့ သူ့ရဲ့ development-only remounting checks တွေကို ယာယီ ဖယ်ရှားနိုင်ပါတယ်။ Effects တွေအစား — route change event handlers တွေကနေလည်း analytics ပို့နိုင်ပါတယ်။ ပိုတိကျတဲ့ analytics အတွက် — [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) တွေက ဘယ် components တွေ viewport ထဲမှာ ရှိနေလဲ၊ ဘယ်လောက်ကြာကြာ မြင်နေရလဲဆိုတာကို ခြေရာခံဖို့ ကူညီပေးနိုင်ပါတယ်။

### Effect မဟုတ်တဲ့အရာ — Application ကို Initialize လုပ်ခြင်း

Logic တချို့က application စတင်တဲ့အခါ တစ်ခါပဲ run သင့်ပါတယ်။ အဲဒါကို သင့် components တွေရဲ့ အပြင်မှာ ထားနိုင်ပါတယ်:

```js
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

ဒါက ဒီလိုမျိုး logic က browser က page ကို load လုပ်ပြီးတဲ့နောက်မှာ တစ်ခါပဲ run မယ်လို့ အာမခံပါတယ်။

### Effect မဟုတ်တဲ့အရာ — ပစ္စည်းတစ်ခု ဝယ်ခြင်း

တခါတရံ — cleanup function တစ်ခု ရေးထားရင်တောင် — Effect ကို နှစ်ကြိမ် run လုပ်တာရဲ့ — အသုံးပြုသူ မြင်နိုင်တဲ့ အကျိုးဆက်တွေကို တားဆီးဖို့ နည်းလမ်း မရှိပါဘူး။ ဥပမာ — သင့် Effect က ပစ္စည်းတစ်ခု ဝယ်သလိုမျိုး — POST request တစ်ခု ပို့တာမျိုးပေါ့:

```js
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

ပစ္စည်းကို နှစ်ကြိမ် ဝယ်ချင်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — ဒါကြောင့်လည်း — ဒီ logic ကို Effect တစ်ခုထဲ မထားသင့်တာပါ။ အသုံးပြုသူက တစ်ခြား page ကို သွားပြီး Back နှိပ်ရင်ရော? သင့် Effect က ပြန် run ပါလိမ့်မယ်။ အသုံးပြုသူက page တစ်ခုကို *လည်ပတ်* တဲ့အခါ ပစ္စည်း ဝယ်ချင်မှာ မဟုတ်ပါဘူး — Buy button ကို *နှိပ်* တဲ့အခါ ဝယ်ချင်တာပါ။

ဝယ်ခြင်းက rendering ကြောင့် မဟုတ်ပါဘူး — တိကျတဲ့ interaction တစ်ခုကြောင့်ပါ။ အသုံးပြုသူက button ကို နှိပ်တဲ့အခါမှပဲ run သင့်ပါတယ်။ **Effect ကို ဖျက်ပြီး — သင့် `/api/buy` request ကို Buy button ရဲ့ event handler ထဲ ရွှေ့လိုက်ပါ:**

```js
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**ဒါက — remounting က သင့် application ရဲ့ logic ကို ချိုးဖျက်ရင် — အဲဒါက ပုံမှန်အားဖြင့် ရှိပြီးသား bug တွေကို ဖော်ထုတ်တာပါလို့ သရုပ်ဖော်ပါတယ်။** အသုံးပြုသူရဲ့ ရှုထောင့်ကကြည့်ရင် — page တစ်ခုကို လည်ပတ်တာက — လည်ပတ်တာ၊ link တစ်ခု နှိပ်တာ၊ ပြီးတော့ page ကို ပြန်ကြည့်ဖို့ Back နှိပ်တာထက် — မတူသင့်ပါဘူး။ React က သင့် components တွေကို development မှာ တစ်ကြိမ် ပြန်လည် mount လုပ်ခြင်းဖြင့် — ဒီမူကို လိုက်နာကြောင်း စစ်ဆေးပါတယ်။

## အားလုံးကို ပေါင်းစပ်ခြင်း

ဒီ playground က Effects တွေ လက်တွေ့မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို "ခံစားသိရှိ" စေဖို့ ကူညီနိုင်ပါတယ်။

ဒီဥပမာက [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) ကို သုံးပြီး — Effect run ပြီး သုံးစက္ကန့်အကြာမှာ — input text နဲ့အတူ console log တစ်ခု ပေါ်လာစေဖို့ စီစဉ်ပါတယ်။ Cleanup function က ဆိုင်းငံ့ထားတဲ့ timeout ကို ပယ်ဖျက်ပါတယ်။ "Mount the component" ကို နှိပ်ခြင်းဖြင့် စလိုက်ပါ:

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

အစပိုင်းမှာ log သုံးခု တွေ့ရပါလိမ့်မယ်: `Schedule "a" log`၊ `Cancel "a" log` — ပြီးတော့ `Schedule "a" log` ထပ်ပါတယ်။ သုံးစက္ကန့် အကြာမှာ `a` လို့ ပြောတဲ့ log တစ်ခုလည်း ရှိပါလိမ့်မယ်။ အရင်က သင်လေ့လာခဲ့သလိုပဲ — အပို schedule/cancel အတွဲက — cleanup ကို ကောင်းကောင်း implement လုပ်ထားကြောင်း စစ်ဆေးဖို့ — React က component ကို development မှာ တစ်ကြိမ် ပြန်လည် mount လုပ်လို့ပါ။

အခု input ကို `abc` လို့ ပြင်ပါ။ လုံလောက်အောင် မြန်မြန် လုပ်ရင် — `Schedule "ab" log` ကို မြင်ရပြီး — ချက်ချင်း `Cancel "ab" log` နဲ့ `Schedule "abc" log` တွေ လိုက်ပါလာပါလိမ့်မယ်။ **React က နောက် render ရဲ့ Effect မလုပ်ခင် — အရင် render ရဲ့ Effect ကို အမြဲတမ်း cleanup လုပ်ပါတယ်။** ဒါကြောင့် — input ထဲ မြန်မြန် စာရိုက်ရင်တောင် — တစ်ချိန်မှာ timeout တစ်ခုထက်ပိုပြီး scheduled ဖြစ်နေမှာ မဟုတ်ပါဘူး။ Effects တွေ ဘယ်လို cleanup ဖြစ်လဲ ခံစားသိဖို့ — input ကို အကြိမ်အနည်းငယ် ပြင်ပြီး console ကို ကြည့်ပါ။

Input ထဲ တစ်ခုခု ရိုက်ပြီး — ချက်ချင်း "Unmount the component" ကို နှိပ်ပါ။ Unmounting က နောက်ဆုံး render ရဲ့ Effect ကို ဘယ်လို cleanup လုပ်လဲ သတိပြုပါ။ ဒီမှာ — သူက နောက်ဆုံး timeout ကို — သူ fire ဖို့ အခွင့်အရေး မရခင်မှာ — ရှင်းလင်းပါတယ်။

နောက်ဆုံးအနေနဲ့ — အထက်က component ကို ပြင်ပြီး — cleanup function ကို comment လုပ်လိုက်ပါ — ဒါဆို timeouts တွေ ပယ်ဖျက်ခံရတော့မှာ မဟုတ်ပါဘူး။ `abcde` ကို မြန်မြန် ရိုက်ကြည့်ပါ။ သုံးစက္ကန့်အတွင်းမှာ ဘာဖြစ်မယ်လို့ သင်မျှော်လင့်လဲ? Timeout ရဲ့ အတွင်းက `console.log(text)` က *နောက်ဆုံး* `text` ကို ပုံနှိပ်ပြီး — `abcde` log ငါးခု ထွက်မလား? သင့်ရဲ့ ထိုးထွင်းသိမြင်မှုကို စစ်ဆေးဖို့ စမ်းကြည့်ပါ!

သုံးစက္ကန့်အကြာမှာ — `abcde` log ငါးခုအစား — log တွေရဲ့ sequence တစ်ခု (`a`၊ `ab`၊ `abc`၊ `abcd` နဲ့ `abcde`) ကို မြင်ရပါလိမ့်မယ်။ **Effect တစ်ခုချင်းစီက သူ့ရဲ့ သက်ဆိုင်ရာ render ကနေ `text` တန်ဖိုးကို "ဖမ်းယူ" (capture) ပါတယ်။** `text` state က ပြောင်းသွားတာ အရေးမကြီးပါဘူး: `text = 'ab'` ပါတဲ့ render ကနေ လာတဲ့ Effect က `'ab'` ကိုပဲ အမြဲ မြင်ပါလိမ့်မယ်။ တစ်နည်းပြောရရင် — render တစ်ခုချင်းစီကနေ လာတဲ့ Effects တွေက တစ်ခုနဲ့တစ်ခု သီးခြားစီ ဖြစ်ပါတယ်။ ဒါက ဘယ်လို အလုပ်လုပ်လဲ သိချင်ရင် — [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) အကြောင်း ဖတ်နိုင်ပါတယ်။

#### Render တိုင်းမှာ ကိုယ်ပိုင် Effects တွေ ရှိတယ်

`useEffect` ကို render output ဆီ "အပြုအမူတစ်ပိုင်းကို တွဲဆက်ခြင်း" လို့ စဉ်းစားနိုင်ပါတယ်။ ဒီ Effect ကို စဉ်းစားကြည့်ပါ:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

အသုံးပြုသူက app အတွင်း သွားလာတာနဲ့အမျှ — အတိအကျ ဘာတွေ ဖြစ်လဲ ကြည့်ရအောင်။

##### ကနဦး Render

အသုံးပြုသူက `<ChatRoom roomId="general" />` ကို လည်ပတ်ပါတယ်။ `roomId` ကို `'general'` နဲ့ [စိတ်ထဲမှာ အစားထိုး](/docs/react/state-snapshot) ကြည့်ရအောင်:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect ကလည်း rendering output ရဲ့ *အစိတ်အပိုင်း* တစ်ခုပါ။** ပထမ render ရဲ့ Effect က ဒီလို ဖြစ်လာပါတယ်:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React က ဒီ Effect ကို run လုပ်ပြီး — `'general'` chat room ဆီ ချိတ်ဆက်ပါတယ်။

##### Dependencies အတူတူနဲ့ Re-render

`<ChatRoom roomId="general" />` က re-render ဖြစ်တယ်ဆိုပါစို့။ JSX output က အတူတူပါ:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React က rendering output မပြောင်းဘူးဆိုတာ မြင်တာမို့ — DOM ကို update မလုပ်ပါဘူး။

ဒုတိယ render ကနေ လာတဲ့ Effect က ဒီလို ဖြစ်ပါတယ်:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React က ဒုတိယ render ရဲ့ `['general']` ကို ပထမ render ရဲ့ `['general']` နဲ့ နှိုင်းယှဉ်ပါတယ်။ **Dependencies တွေအားလုံး အတူတူဖြစ်လို့ — React က ဒုတိယ render ရဲ့ Effect ကို *လျစ်လျူရှု* ပါတယ်။** အဲဒါကို ဘယ်တော့မှ ခေါ်မလုပ်ပါဘူး။

##### Dependencies မတူတာနဲ့ Re-render

ပြီးတော့ — အသုံးပြုသူက `<ChatRoom roomId="travel" />` ကို လည်ပတ်ပါတယ်။ ဒီတစ်ခါ — component က JSX မတူတာကို ပြန်ပေးပါတယ်:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React က DOM ကို update လုပ်ပြီး — `"Welcome to general"` ကို `"Welcome to travel"` အဖြစ် ပြောင်းပါတယ်။

တတိယ render ကနေ လာတဲ့ Effect က ဒီလို ဖြစ်ပါတယ်:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React က တတိယ render ရဲ့ `['travel']` ကို ဒုတိယ render ရဲ့ `['general']` နဲ့ နှိုင်းယှဉ်ပါတယ်။ Dependency တစ်ခု မတူပါဘူး: `Object.is('travel', 'general')` က `false` ပါ။ Effect ကို ကျော်လို့ မရပါဘူး။

**React က တတိယ render ရဲ့ Effect ကို သက်ရောက်စေခင် — နောက်ဆုံး *တကယ် run ခဲ့တဲ့* Effect ကို cleanup လုပ်ဖို့ လိုပါတယ်။** ဒုတိယ render ရဲ့ Effect ကို ကျော်လိုက်လို့ — React က ပထမ render ရဲ့ Effect ကို cleanup လုပ်ဖို့ လိုပါတယ်။ ပထမ render ဆီ အပေါ်ကို scroll လုပ်ကြည့်ရင် — သူ့ရဲ့ cleanup က `createConnection('general')` နဲ့ ဖန်တီးထားတဲ့ connection ပေါ်မှာ `disconnect()` ကို ခေါ်တာ တွေ့ရပါလိမ့်မယ်။ ဒါက app ကို `'general'` chat room ကနေ ချိတ်ဆက်ဖြုတ်ပေးပါတယ်။

အဲဒီနောက်မှာ — React က တတိယ render ရဲ့ Effect ကို run ပါတယ်။ အဲဒါက `'travel'` chat room ဆီ ချိတ်ဆက်ပါတယ်။

##### Unmount

နောက်ဆုံးအနေနဲ့ — အသုံးပြုသူက ဝေးရာကို သွားပြီး — `ChatRoom` component က unmount ဖြစ်တယ်ဆိုပါစို့။ React က နောက်ဆုံး Effect ရဲ့ cleanup function ကို run ပါတယ်။ နောက်ဆုံး Effect က တတိယ render ကနေ လာတာပါ။ တတိယ render ရဲ့ cleanup က `createConnection('travel')` connection ကို ဖျက်ဆီးပါတယ်။ ဒါကြောင့် — app က `'travel'` room ကနေ ချိတ်ဆက်ဖြုတ်ပါတယ်။

##### Development မှာပဲ ဖြစ်တဲ့ အပြုအမူတွေ

[Strict Mode](/docs/react/strict-mode) ဖွင့်ထားရင် — React က component တိုင်းကို mount ပြီးနောက်မှာ တစ်ကြိမ် ပြန်လည် mount လုပ်ပါတယ် (state နဲ့ DOM ကို ထိန်းသိမ်းထားပါတယ်)။ ဒါက [cleanup လိုအပ်တဲ့ Effects တွေကို ရှာတွေ့စေပြီး](/docs/react/synchronizing-with-effects) — race conditions လိုမျိုး bug တွေကို စောစောစီးစီး ဖော်ထုတ်စေပါတယ်။ ဒါ့အပြင် — development မှာ file တစ်ခုကို သိမ်းတိုင်း — React က Effects တွေကို ပြန်လည် mount လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူ နှစ်ခုလုံးက development မှာပဲ ဖြစ်တာပါ။

## အကျဉ်းချုပ်

- Events တွေနဲ့ မတူဘဲ — Effects တွေက တိကျတဲ့ interaction တစ်ခုထက် — rendering ကိုယ်တိုင်ကြောင့် ဖြစ်ပေါ်ပါတယ်။
- Effects တွေက component တစ်ခုကို external system တစ်ခုခု (third-party API၊ network စသည်) နဲ့ ထပ်တူပြုနိုင်စေပါတယ်။
- ပုံမှန်အားဖြင့် — Effects တွေက render တိုင်း (ကနဦး render အပါအဝင်) ပြီးနောက်မှာ run ပါတယ်။
- Effect ရဲ့ dependencies တွေအားလုံး နောက်ဆုံး render တုန်းကနဲ့ တန်ဖိုးတွေ အတူတူဆိုရင် — React က Effect ကို ရှောင်ပါလိမ့်မယ်။
- သင်က သင့် dependencies တွေကို "ရွေးချယ်" လို့ မရပါဘူး။ သူတို့က Effect ရဲ့ အတွင်းက code ကနေ ဆုံးဖြတ်ပါတယ်။
- ဗလာ dependency array (`[]`) က component "mounting" — ဆိုလိုတာက screen ဆီ ထည့်ခံရတာနဲ့ — ကိုက်ညီပါတယ်။
- Strict Mode မှာ — React က components တွေကို နှစ်ကြိမ် mount လုပ်ပြီး (development မှာပဲ!) — သင့် Effects တွေကို stress-test လုပ်ပါတယ်။
- သင့် Effect က remounting ကြောင့် ပျက်သွားရင် — cleanup function တစ်ခု implement လုပ်ဖို့ လိုပါတယ်။
- React က သင့် cleanup function ကို — Effect နောက်တစ်ကြိမ် run လုပ်ခါနီးတိုင်း — ပြီးတော့ unmount အတွင်းမှာ — ခေါ်ပါလိမ့်မယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Mount ပေါ်မှာ Field တစ်ခုကို Focus လုပ်ခြင်း

ဒီဥပမာမှာ — form က `<MyInput />` component တစ်ခုကို render လုပ်ပါတယ်။

Input ရဲ့ [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) method ကို သုံးပြီး — `MyInput` က screen ပေါ် ပေါ်လာတဲ့အခါ အလိုအလျောက် focus ဖြစ်အောင် လုပ်ပါ။ Comment လုပ်ထားတဲ့ implementation တစ်ခု ရှိပြီးသားပါ — ဒါပေမယ့် — အပြည့်အဝ အလုပ်မလုပ်ပါဘူး။ ဘာကြောင့် အလုပ်မလုပ်လဲ ရှာပြီး — ပြုပြင်ပါ။ (`autoFocus` attribute နဲ့ ရင်းနှီးရင် — အဲဒါ မရှိဘူးလို့ သဘောထားပါ: ကျွန်တော်တို့က ဒီလုပ်ဆောင်ချက်ကို အစကနေ ပြန်လည် implement လုပ်နေတာပါ။)

```js
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```
```js
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

သင့်ဖြေရှင်းချက် အလုပ်လုပ်ကြောင်း စစ်ဆေးဖို့ — "Show form" ကို နှိပ်ပြီး — input က focus ရရှိကြောင်း (highlight ဖြစ်ပြီး cursor က အတွင်းမှာ ထားပေးတာ) စစ်ဆေးပါ။ "Hide form" နဲ့ "Show form" ကို ထပ်နှိပ်ပါ။ Input က ထပ်ပြီး highlight ဖြစ်ကြောင်း စစ်ဆေးပါ။

`MyInput` က render တိုင်းပြီးနောက်မဟုတ်ဘဲ — *mount ပေါ်မှာပဲ* focus သင့်ပါတယ်။ အပြုအမူ မှန်ကြောင်း စစ်ဆေးဖို့ — "Show form" ကို နှိပ်ပြီး — "Make it uppercase" checkbox ကို ထပ်ခါထပ်ခါ နှိပ်ပါ။ Checkbox ကို နှိပ်တာက — အပေါ်က input ကို focus *မဖြစ်စေရ* ပါဘူး။

#### အဖြေ

Rendering အတွင်းမှာ `ref.current.focus()` ကို ခေါ်တာက မှားပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒါက *side effect* တစ်ခုလို့ပါ။ Side effects တွေက event handler တစ်ခုရဲ့ အတွင်းမှာ ထားသင့်သလို — ဒါမှမဟုတ် `useEffect` နဲ့ ကြေညာသင့်ပါတယ်။ ဒီကိစ္စမှာ — side effect က တိကျတဲ့ interaction တစ်ခုထက် — component ပေါ်လာတာကြောင့် *ဖြစ်ပေါ်* တာမို့ — အဲဒါကို Effect တစ်ခုထဲမှာ ထားတာ အဓိပ္ပာယ်ရှိပါတယ်။

အမှားကို ပြုပြင်ဖို့ — `ref.current.focus()` ခေါ်မှုကို Effect declaration တစ်ခုထဲမှာ ထုပ်ပါ။ ပြီးရင် — ဒီ Effect က render တိုင်း run လုပ်တာထက် — mount ပေါ်မှာပဲ run ကြောင်း သေချာစေဖို့ — ဗလာ `[]` dependencies တွေကို ထည့်ပါ။

```js
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```
```js
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

### Field တစ်ခုကို Conditionally Focus လုပ်ခြင်း

ဒီ form က `<MyInput />` component နှစ်ခုကို render လုပ်ပါတယ်။

"Show form" ကို နှိပ်ပြီး — ဒုတိယ field က အလိုအလျောက် focus ဖြစ်သွားတာ သတိပြုပါ။ ဒါက `<MyInput />` component နှစ်ခုလုံးက အတွင်းက field ကို focus လုပ်ဖို့ ကြိုးစားလို့ပါ။ Input field နှစ်ခုအတွက် `focus()` ကို ဆက်တိုက် ခေါ်လိုက်ရင် — နောက်ဆုံးခေါ်တာက အမြဲတမ်း "အနိုင်ရ" ပါတယ်။

ပထမ field ကို focus ချင်တယ်ဆိုပါစို့။ ပထမ `MyInput` component က အခု `true` လို့ set ထားတဲ့ boolean `shouldFocus` prop တစ်ခုကို လက်ခံရရှိပါတယ်။ `MyInput` က လက်ခံရရှိတဲ့ `shouldFocus` prop က `true` ဖြစ်မှပဲ `focus()` ကို ခေါ်အောင် — logic ကို ပြောင်းပါ။

```js
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```
```js
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

သင့်ဖြေရှင်းချက်ကို စစ်ဆေးဖို့ — "Show form" နဲ့ "Hide form" ကို ထပ်ခါထပ်ခါ နှိပ်ပါ။ Form ပေါ်လာတဲ့အခါ — *ပထမ* input ကပဲ focus ရသင့်ပါတယ်။ ဒါက parent component က ပထမ input ကို `shouldFocus={true}` နဲ့ — ဒုတိယ input ကို `shouldFocus={false}` နဲ့ render လုပ်လို့ပါ။ Input နှစ်ခုလုံး အလုပ်လုပ်ပြီး — နှစ်ခုလုံးထဲ စာရိုက်လို့ ရသေးကြောင်းလည်း စစ်ဆေးပါ။

> **အရိပ်အမြွက်:** Effect တစ်ခုကို conditionally ကြေညာလို့ မရပါဘူး — ဒါပေမယ့် — သင့် Effect ရဲ့ အတွင်းမှာ conditional logic တွေ ပါဝင်နိုင်ပါတယ်။

#### အဖြေ

Conditional logic ကို Effect ရဲ့ အတွင်းမှာ ထားပါ။ သင်က Effect ရဲ့ အတွင်းမှာ `shouldFocus` ကို သုံးနေတာမို့ — အဲဒါကို dependency အဖြစ် သတ်မှတ်ဖို့ လိုပါလိမ့်မယ်။ (ဆိုလိုတာက — input တစ်ခုရဲ့ `shouldFocus` က `false` ကနေ `true` ကို ပြောင်းရင် — mount ပြီးနောက်မှာ focus ဖြစ်ပါလိမ့်မယ်။)

```js
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```
```js
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

### နှစ်ကြိမ် Fire ဖြစ်တဲ့ Interval တစ်ခုကို ပြုပြင်ခြင်း

ဒီ `Counter` component က — စက္ကန့်တိုင်း တိုးသင့်တဲ့ counter တစ်ခုကို ပြပါတယ်။ Mount ပေါ်မှာ — [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) ကို ခေါ်ပါတယ်။ ဒါက `onTick` ကို စက္ကန့်တိုင်း run စေပါတယ်။ `onTick` function က counter ကို တိုးပေးပါတယ်။

ဒါပေမယ့် — စက္ကန့်တိုင်း တစ်ကြိမ် တိုးမယ့်အစား — နှစ်ကြိမ် တိုးပါတယ်။ ဘာကြောင့်လဲ? Bug ရဲ့ အကြောင်းရင်းကို ရှာပြီး — ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** `setInterval` က interval ID တစ်ခုကို ပြန်ပေးတယ်ဆိုတာ သတိရပါ — interval ကို ရပ်ဖို့ ဒီ ID ကို [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) ဆီ ပေးနိုင်ပါတယ်။

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```
```js
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

#### အဖြေ

[Strict Mode](/docs/react/strict-mode) ဖွင့်ထားတဲ့အခါ (ဒီ site ပေါ်က sandboxes တွေမှာလိုပဲ) — React က component တစ်ခုချင်းစီကို development မှာ တစ်ကြိမ် ပြန်လည် mount လုပ်ပါတယ်။ ဒါက interval ကို နှစ်ခါ တည်ဆောက်စေပြီး — ဒါကြောင့် — counter က စက္ကန့်တိုင်း နှစ်ကြိမ် တိုးတာပါ။

ဒါပေမယ့် — React ရဲ့ အပြုအမူက bug ရဲ့ *အကြောင်းရင်း* မဟုတ်ပါဘူး: bug က code ထဲမှာ ရှိပြီးသားပါ။ React ရဲ့ အပြုအမူက bug ကို ပိုသိသာစေတာပါ။ တကယ့် အကြောင်းရင်းက — ဒီ Effect က process တစ်ခုကို စတင်ပေမယ့် — အဲဒါကို cleanup လုပ်ဖို့ နည်းလမ်းတစ်ခု မပေးထားလို့ပါ။

ဒီ code ကို ပြုပြင်ဖို့ — `setInterval` က ပြန်ပေးတဲ့ interval ID ကို သိမ်းပြီး — [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) နဲ့ cleanup function တစ်ခု implement လုပ်ပါ:

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```
```js
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```
```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

Development မှာ — React က သင့် component ကို cleanup ကောင်းကောင်း implement လုပ်ထားကြောင်း စစ်ဆေးဖို့ — တစ်ကြိမ် ပြန်လည် mount လုပ်နေဦးမှာပါ။ ဒါကြောင့် — `setInterval` ခေါ်မှုတစ်ခု ရှိမယ် — ချက်ချင်း `clearInterval` — ပြီးတော့ `setInterval` ထပ်ပါမယ်။ Production မှာ — `setInterval` ခေါ်မှုတစ်ခုပဲ ရှိပါလိမ့်မယ်။ နှစ်ခုလုံးမှာ အသုံးပြုသူ မြင်နိုင်တဲ့ အပြုအမူက အတူတူပါ: counter က စက္ကန့်တိုင်း တစ်ကြိမ် တိုးပါတယ်။

### Effect တစ်ခုရဲ့ အတွင်းမှာ Fetching လုပ်တာကို ပြုပြင်ခြင်း

ဒီ component က ရွေးထားတဲ့သူရဲ့ biography ကို ပြပါတယ်။ Mount ပေါ်မှာ ပြီးတော့ `person` ပြောင်းတိုင်း — asynchronous function `fetchBio(person)` ကို ခေါ်ခြင်းဖြင့် biography ကို load လုပ်ပါတယ်။ အဲဒီ asynchronous function က — နောက်ဆုံးမှာ string တစ်ခုအဖြစ် resolve ဖြစ်တဲ့ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) တစ်ခုကို ပြန်ပေးပါတယ်။ Fetching ပြီးသွားတဲ့အခါ — select box ရဲ့ အောက်မှာ အဲဒီ string ကို ပြသဖို့ `setBio` ကို ခေါ်ပါတယ်။

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```
```js
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

ဒီ code ထဲမှာ bug တစ်ခု ရှိပါတယ်။ "Alice" ကို ရွေးခြင်းဖြင့် စလိုက်ပါ။ ပြီးရင် "Bob" ကို ရွေးပြီး — ချက်ချင်း ဆက်ပြီး "Taylor" ကို ရွေးပါ။ ဒါကို လုံလောက်အောင် မြန်မြန် လုပ်ရင် — bug ကို သတိထားမိပါလိမ့်မယ်: Taylor က ရွေးထားပေမယ့် — အောက်က paragraph က "This is Bob's bio." လို့ ပြနေပါတယ်။

ဘာကြောင့် ဒီလို ဖြစ်တာလဲ? ဒီ Effect ရဲ့ အတွင်းမှာ bug ကို ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Effect တစ်ခုက တစ်ခုခုကို asynchronously fetch လုပ်ရင် — ပုံမှန်အားဖြင့် cleanup လိုအပ်ပါတယ်။

#### အဖြေ

Bug ကို ဖြစ်ပေါ်စေဖို့ — အရာတွေက ဒီအစီအစဉ်အတိုင်း ဖြစ်ဖို့ လိုပါတယ်:

- `'Bob'` ကို ရွေးတာက `fetchBio('Bob')` ကို စတင်စေတယ်
- `'Taylor'` ကို ရွေးတာက `fetchBio('Taylor')` ကို စတင်စေတယ်
- **`'Taylor'` အတွက် fetching က `'Bob'` အတွက် fetching ထက် *စောပြီး* ပြီးစီးတယ်**
- `'Taylor'` render ကနေ လာတဲ့ Effect က `setBio('This is Taylor’s bio')` ကို ခေါ်တယ်
- `'Bob'` အတွက် fetching က ပြီးစီးတယ်
- `'Bob'` render ကနေ လာတဲ့ Effect က `setBio('This is Bob’s bio')` ကို ခေါ်တယ်

ဒါကြောင့် — Taylor က ရွေးထားပေမယ့် — Bob ရဲ့ bio ကို မြင်ရတာပါ။ ဒီလိုမျိုး bug တွေကို [race conditions](https://en.wikipedia.org/wiki/Race_condition) လို့ ခေါ်ပါတယ် — ဘာလို့လဲဆိုတော့ asynchronous operation နှစ်ခုက တစ်ခုနဲ့တစ်ခု "ပြိုင်နေတယ်" ဆိုတော့ — မမျှော်လင့်ထားတဲ့ အစီအစဉ်နဲ့ ရောက်ရှိလာနိုင်လို့ပါ။

ဒီ race condition ကို ပြုပြင်ဖို့ — cleanup function တစ်ခု ထည့်ပါ:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```
```js
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

Render တစ်ခုချင်းစီရဲ့ Effect မှာ ကိုယ်ပိုင် `ignore` variable ရှိပါတယ်။ အစပိုင်းမှာ — `ignore` variable ကို `false` လို့ set ထားပါတယ်။ ဒါပေမယ့် — Effect တစ်ခု cleanup ဖြစ်သွားရင် (ဥပမာ — တစ်ခြားသူတစ်ယောက်ကို ရွေးတဲ့အခါ) — သူ့ရဲ့ `ignore` variable က `true` ဖြစ်သွားပါတယ်။ ဒါကြောင့် — အခု requests တွေ ဘယ်အစီအစဉ်နဲ့ ပြီးစီးလဲဆိုတာ အရေးမကြီးတော့ပါဘူး။ နောက်ဆုံးသူရဲ့ Effect မှာပဲ `ignore` က `false` လို့ set ထားမှာမို့ — အဲဒါကပဲ `setBio(result)` ကို ခေါ်ပါလိမ့်မယ်။ ရှေ့က Effects တွေက cleanup ဖြစ်ပြီးသားမို့ — `if (!ignore)` စစ်ဆေးမှုက သူတို့ `setBio` ခေါ်တာကို တားဆီးပါလိမ့်မယ်:

- `'Bob'` ကို ရွေးတာက `fetchBio('Bob')` ကို စတင်စေတယ်
- `'Taylor'` ကို ရွေးတာက `fetchBio('Taylor')` ကို စတင်စေပြီး **အရင် (Bob ရဲ့) Effect ကို cleanup လုပ်တယ်**
- `'Taylor'` အတွက် fetching က `'Bob'` အတွက် fetching ထက် *စောပြီး* ပြီးစီးတယ်
- `'Taylor'` render ကနေ လာတဲ့ Effect က `setBio('This is Taylor’s bio')` ကို ခေါ်တယ်
- `'Bob'` အတွက် fetching က ပြီးစီးတယ်
- `'Bob'` render ကနေ လာတဲ့ Effect က **သူ့ရဲ့ `ignore` flag က `true` လို့ set ထားလို့ ဘာမှ မလုပ်ဘူး**

ခေတ်နောက်ကျနေတဲ့ API ခေါ်မှုတစ်ခုရဲ့ result ကို ignore လုပ်တာအပြင် — မလိုအပ်တော့တဲ့ requests တွေကို ပယ်ဖျက်ဖို့ [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ကိုလည်း သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — ဒါတစ်ခုတည်းက race conditions တွေကနေ ကာကွယ်ဖို့ မလုံလောက်ပါဘူး။ Fetch ပြီးနောက်မှာ asynchronous steps တွေ ထပ်ဆက်နိုင်တာမို့ — `ignore` လိုမျိုး တိကျတဲ့ flag တစ်ခု သုံးတာက — ဒီလိုမျိုး ပြဿနာ ပြုပြင်ဖို့ အယုံကြည်ရဆုံး နည်းလမ်းပါ။
