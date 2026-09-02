---
title: "ViewTransition"
description: "Transitions နဲ့ Suspense သုံးပြီး component tree တစ်ခုကို animate လုပ်နိုင်စေတဲ့ React component — enter/exit/update/share animations များ၊ View Transition Class နဲ့ View Transition Events တွေသုံးပြီး animations များကို customize လုပ်ခြင်း"
order: 115
source: "https://react.dev/reference/react/ViewTransition"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက် (Canary):** `<ViewTransition />` API က လောလောဆယ် React ရဲ့ Canary နဲ့ Experimental channels တွေမှာပဲ ရနိုင်ပါသေးတယ်။
>
> [React ရဲ့ release channels တွေအကြောင်း ဒီမှာ လေ့လာပါ။](https://react.dev/community/versioning-policy#all-release-channels)

`<ViewTransition>` က သင့်ကို Transitions နဲ့ Suspense ပါတဲ့ component tree တစ်ခုကို animate လုပ်နိုင်စေပါတယ်။

```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

## ရည်ညွှန်းချက် (Reference)

### `<ViewTransition>`

Component tree တစ်ခုကို `<ViewTransition>` ထဲမှာ ထုပ်ပြီး — animate လုပ်နိုင်ပါတယ်:

```js
<ViewTransition>
  <Page />
</ViewTransition>
```

[အောက်မှာ နောက်ထပ် ဥပမာတွေကို ကြည့်နိုင်ပါတယ်။](#usage)

#### `<ViewTransition>` က ဘယ်လို အလုပ်လုပ်သလဲ (How does `<ViewTransition>` work?)

နောက်ကွယ်မှာ — React က `<ViewTransition>` component ရဲ့ အတွင်းဘက် အနီးဆုံး DOM node ရဲ့ inline styles ဆီ `view-transition-name` ကို အသုံးပြုပါတယ်။ `<ViewTransition><div /><div /></ViewTransition>` လိုမျိုး sibling DOM nodes အများကြီး ရှိနေရင် — React က name တစ်ခုချင်းစီ ထူးခြားသွားအောင် name ရဲ့ နောက်မှာ suffix တစ်ခု ထပ်ဖြည့်ပေးပါတယ် — ဒါပေမယ့် အယူအဆအရတော့ သူတို့အားလုံးက တစ်ခုတည်းရဲ့ အစိတ်အပိုင်းတွေပါ။ React က ဒါတွေကို ချက်ချင်း အသုံးမပြုဘဲ — အဲဒီ boundary က animation တစ်ခုမှာ ပါဝင်သင့်တဲ့ အချိန်မှာပဲ အသုံးပြုပါတယ်။

React က `startViewTransition` ကို နောက်ကွယ်မှာ ကိုယ်တိုင် အလိုအလျောက် ခေါ်ပေးပါတယ် — ဒါကြောင့် သင်ကိုယ်တိုင်တော့ ဘယ်တော့မှ မခေါ်သင့်ပါဘူး။ တကယ်တော့ — page ပေါ်မှာ View Transition တစ်ခုကို run နေတဲ့ တခြားအရာတစ်ခုခု ရှိရင် React က အဲဒါကို ကြားဖြတ် ရပ်တန့်လိမ့်မယ်။ ဒါကြောင့် — ဒါတွေကို ညှိနှိုင်းဖို့ React ကိုယ်တိုင်ကိုပဲ သုံးဖို့ အကြံပြုပါတယ်။ အရင်တုန်းက View Transitions တွေကို စတင်ဖို့ တခြားနည်းလမ်းတွေ သုံးခဲ့ဖူးရင် — built-in နည်းလမ်းဆီ ပြောင်းရွှေ့ဖို့ အကြံပြုပါတယ်။

တခြား React ViewTransitions တွေ လက်ရှိ run နေပြီးသား ဆိုရင် — React က နောက်တစ်ခုကို မစတင်ခင် သူတို့ ပြီးဆုံးတာကို စောင့်ပါတယ်။ ဒါပေမယ့် — အရေးကြီးတာက — ပထမ animation run နေတုန်း update တွေ အများကြီး ဖြစ်ခဲ့ရင် — အဲဒါတွေ အားလုံးက တစ်ခုတည်းထဲ batch လုပ်ခံရပါတယ်။ A->B ကို စတင်လိုက်ပြီး — ကြားထဲမှာ C ကိုသွားဖို့၊ ပြီးတော့ D ကိုသွားဖို့ update တွေ ရလိုက်တယ်ဆိုပါစို့။ ပထမ A->B animation ပြီးဆုံးတဲ့အခါ — နောက် animation က B->D ကို animate လုပ်ပါလိမ့်မယ်။

`getSnapshotBeforeUpdate` lifecycle ကို `startViewTransition` မခေါ်ခင် ခေါ်ပြီး — `view-transition-name` တချို့က တစ်ချိန်တည်းမှာ update ဖြစ်ပါလိမ့်မယ်။

ပြီးတော့ React က `startViewTransition` ကို ခေါ်ပါတယ်။ `updateCallback` ရဲ့ အတွင်းမှာ — React က:

- DOM ဆီ သူ့ရဲ့ mutations တွေကို အသုံးပြုပြီး — `useInsertionEffect` ကို ခေါ်ပါတယ်။
- Fonts တွေ load ဖြစ်တာကို စောင့်ပါတယ်။
- `componentDidMount`၊ `componentDidUpdate`၊ `useLayoutEffect` နဲ့ refs တွေကို ခေါ်ပါတယ်။
- ဆိုင်းငံ့ထားတဲ့ (pending) Navigation တစ်ခုခု ပြီးဆုံးတာကို စောင့်ပါတယ်။
- ပြီးတော့ — ဘယ် boundaries တွေ animate လုပ်ဖို့ လိုမလဲ ကြည့်ဖို့ — React က layout ရဲ့ ပြောင်းလဲမှုတွေကို တိုင်းတာပါတယ်။

`startViewTransition` ရဲ့ ready Promise က resolved ဖြစ်ပြီးတဲ့နောက် — React က `view-transition-name` ကို ပြန်လည် မူလအတိုင်း ထားပေးပါတယ်။ ပြီးတော့ — animations တွေအပေါ် manual programmatic ထိန်းချုပ်မှု ဖြစ်စေဖို့ `onEnter`၊ `onExit`၊ `onUpdate` နဲ့ `onShare` callbacks တွေကို React က ခေါ်ပါတယ်။ ဒါက — built-in default တွေကို တွက်ချက်ပြီးသားဖြစ်မှ ဖြစ်ပါတယ်။

ဒီ sequence ရဲ့ အလယ်မှာ `flushSync` တစ်ခု ရောက်လာခဲ့ရင် — React က synchronously ပြီးမြောက်နိုင်တာပေါ် မှီခိုလို့ — Transition ကို ကျော်လိုက်ပါတယ်။

`startViewTransition` ရဲ့ finished Promise က resolved ဖြစ်ပြီးတဲ့နောက် — React က `useEffect` ကို ခေါ်ပါတယ်။ ဒါက သူတို့က animation ရဲ့ စွမ်းဆောင်ရည်ကို အနှောင့်အယှက် မဖြစ်စေဖို့ ကာကွယ်ပေးပါတယ်။ ဒါပေမယ့် — ဒါက အာမခံချက် မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ animation run နေတုန်း `setState` တစ်ခုခု ဖြစ်ခဲ့ရင် — sequential guarantees တွေကို ထိန်းသိမ်းဖို့ `useEffect` ကို စောစော ခေါ်ရဦးမှာ ဖြစ်လို့ပါ။

#### Props

- **optional** `name`: String တစ်ခု (သို့) object တစ်ခု။ Shared element transitions တွေအတွက် သုံးတဲ့ View Transition ရဲ့ name ပါ။ မပေးထားဘူးဆိုရင် — မမျှော်လင့်ထားတဲ့ animations တွေ မဖြစ်အောင် — React က View Transition တစ်ခုချင်းစီအတွက် unique name တစ်ခုကို သုံးပါလိမ့်မယ်။
- [View Transition Class](#view-transition-class) ရဲ့ props တွေ။
- [View Transition Event](#view-transition-event) ရဲ့ props တွေ။

#### Caveats (သတိပြုရမည့်အချက်များ)

- [shared element transitions](#animating-a-shared-element) တွေအတွက်ပဲ `name` ကို သုံးပါ။ တခြား animations တွေ အားလုံးအတွက် — မမျှော်လင့်ထားတဲ့ animations တွေ မဖြစ်အောင် React က unique name တစ်ခုကို အလိုအလျောက် ထုတ်ပေးပါတယ်။
- Default အနေနဲ့ — `setState` updates တွေက ချက်ချင်း ဖြစ်ပြီး — `<ViewTransition>` ကို activate မလုပ်ပါဘူး။ [Transition](/docs/react/use-transition) တစ်ခုထဲမှာ ထုပ်ထားတဲ့ update တွေ၊ [`<Suspense>`](/docs/react/suspense) (သို့) `useDeferredValue` တွေပဲ ViewTransition ကို activate လုပ်ပါတယ်။
- `<ViewTransition>` က — ရွှေ့လို့ရတဲ့၊ scale လုပ်လို့ရတဲ့၊ cross-fade လုပ်လို့ရတဲ့ ပုံရိပ် (image) တစ်ခုကို ဖန်တီးပါတယ်။ React Native ဒါမှမဟုတ် Motion မှာ မြင်ဖူးနိုင်တဲ့ Layout Animations တွေနဲ့ မတူဘဲ — ဒါက သူ့အတွင်းက element တစ်ခုချင်းစီတိုင်း သူ့ရဲ့ position ကို animate လုပ်တာ မဟုတ်ဘူးလို့ ဆိုလိုပါတယ်။ ဒါက — အပိုင်းတစ်ခုချင်းစီကို animate လုပ်တာထက် — performance ပိုကောင်းပြီး — ပိုပြီး အဆက်မပြတ် ချောမွေ့တဲ့ animation ကို ဖြစ်စေနိုင်ပါတယ်။ ဒါပေမယ့် — သူ့ဘာသာ ရွေ့လျားသင့်တဲ့အရာတွေမှာတော့ အဆက်အစပ် ပျောက်ဆုံးသွားနိုင်ပါတယ်။ ဒါကြောင့် — ရလဒ်အနေနဲ့ `<ViewTransition>` boundaries တွေကို manual အနေနဲ့ ပိုထည့်ဖို့ လိုလာနိုင်ပါတယ်။
- လောလောဆယ် — `<ViewTransition>` က DOM ထဲမှာပဲ အလုပ်လုပ်ပါတယ်။ React Native နဲ့ တခြား platforms တွေအတွက် support ထည့်ဖို့ ကျွန်တော်တို့ လုပ်ဆောင်နေပါတယ်။

#### Animation triggers (Animation စတင်စေသည့် အခြေအနေများ)

React က စတင်ဖို့ View Transition animation ရဲ့ အမျိုးအစားကို အလိုအလျောက် ဆုံးဖြတ်ပါတယ်:

- `enter`: `ViewTransition` တစ်ခုက ဒီ Transition ထဲမှာ ထည့်လိုက်တဲ့ (inserted) ပထမဆုံး component ဆိုရင် — ဒါက activate ဖြစ်ပါတယ်။
- `exit`: `ViewTransition` တစ်ခုက ဒီ Transition ထဲမှာ ဖျက်လိုက်တဲ့ (deleted) ပထမဆုံး component ဆိုရင် — ဒါက activate ဖြစ်ပါတယ်။
- `update`: `<ViewTransition>` ရဲ့ အတွင်းမှာ React က လုပ်နေတဲ့ DOM mutations တစ်ခုခု ရှိရင် (ဥပမာ — prop တစ်ခု ပြောင်းတာ) ဒါမှမဟုတ် — တိုက်ရိုက် (immediate) sibling တစ်ခုကြောင့် `<ViewTransition>` boundary ကိုယ်တိုင်က size (သို့) position ပြောင်းရင် — ဒါက activate ဖြစ်ပါတယ်။ Nested `<ViewTransition>` တွေ ရှိရင် — mutation က parent ကို မဟုတ်ဘဲ သူတို့ဆီကို သက်ရောက်ပါတယ်။
- `share`: name ပါတဲ့ `ViewTransition` တစ်ခုက ဖျက်လိုက်တဲ့ subtree ထဲမှာ ရှိပြီး — name တူတဲ့ နောက် `ViewTransition` တစ်ခုက Transition တစ်ခုတည်းရဲ့ အတွင်းမှာ ထည့်လိုက်တဲ့ subtree ရဲ့ အစိတ်အပိုင်း ဖြစ်နေရင် — သူတို့က Shared Element Transition တစ်ခု ဖွဲ့ပြီး — ဖျက်လိုက်တဲ့ဟာကနေ ထည့်လိုက်တဲ့ဟာဆီ animate လုပ်ပါတယ်။

Default အနေနဲ့ — `<ViewTransition>` က ချောမွေ့တဲ့ cross-fade (browser ရဲ့ default view transition) နဲ့ animate လုပ်ပါတယ်။

Trigger အမျိုးအစား တစ်ခုချင်းစီအတွက် `<ViewTransition>` component ဆီ [View Transition Class](#view-transition-class) တစ်ခု ပေးပြီး (သို့) [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) ကို သုံးပြီး JavaScript နဲ့ animation ကို ထိန်းချုပ်ဖို့ [ViewTransition Events](#view-transition-events) တွေကို သုံးပြီး — animation ကို customize လုပ်နိုင်ပါတယ် (အသေးစိတ်အတွက် [View Transitions တွေကို Styling လုပ်ခြင်း](#styling-view-transitions) မှာ ကြည့်ပါ)။

> **မှတ်ချက် — `prefers-reduced-motion` ကို အမြဲ စစ်ဆေးပါ** (Always check `prefers-reduced-motion`)
>
> အသုံးပြုသူ အများစုက page ပေါ်မှာ animations တွေ မပါစေချင်တာ နှစ်သက်နိုင်ပါတယ်။ ဒီကိစ္စအတွက် React က animations တွေကို အလိုအလျောက် disable မလုပ်ပါဘူး။
>
> အသုံးပြုသူရဲ့ နှစ်သက်မှုပေါ် မူတည်ပြီး — animations တွေကို disable လုပ်ဖို့ (သို့) လျှော့ချဖို့ `@media (prefers-reduced-motion)` media query ကို အမြဲတမ်း သုံးဖို့ အကြံပြုပါတယ်။
>
> နောင်တွင် — CSS libraries တွေက ဒါကို သူတို့ရဲ့ presets တွေထဲမှာ built-in အနေနဲ့ ထည့်လာနိုင်ပါတယ်။

### View Transition Class

`<ViewTransition>` က ဘယ် animations တွေ စတင်လဲ သတ်မှတ်ဖို့ props တွေ ပေးပါတယ်:

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

#### Props

- **optional** `enter`: `"auto"`၊ `"none"`၊ string တစ်ခု (သို့) object တစ်ခု။
- **optional** `exit`: `"auto"`၊ `"none"`၊ string တစ်ခု (သို့) object တစ်ခု။
- **optional** `update`: `"auto"`၊ `"none"`၊ string တစ်ခု (သို့) object တစ်ခု။
- **optional** `share`: `"auto"`၊ `"none"`၊ string တစ်ခု (သို့) object တစ်ခု။
- **optional** `default`: `"auto"`၊ `"none"`၊ string တစ်ခု (သို့) object တစ်ခု။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `default` က `"none"` ဆိုရင် — တခြား triggers တွေ အားလုံးကို ရှင်းရှင်းလင်းလင်း စာရင်းသွင်းမထားဘူးဆိုရင် ပိတ်ထားခံရပါတယ်။

#### Values (တန်ဖိုးများ)

View Transition class တန်ဖိုးတွေက အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ်:
- `auto`: default တန်ဖိုး။ Browser ရဲ့ default animation ကို သုံးပါတယ်။
- `none`: ဒီအမျိုးအစားအတွက် animations တွေကို disable လုပ်ပါတယ်။
- `<classname>`: [View Transitions တွေကို customize လုပ်ဖို့](#styling-view-transitions) သုံးမယ့် custom CSS class name တစ်ခု။

Object တန်ဖိုးတွေက — string keys တွေနဲ့ တန်ဖိုးက `auto`၊ `none` (သို့) custom className ဖြစ်တဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်:
- `{[type]: value}`: animation က [Transition Type](https://react.dev/reference/react/addTransitionType) တစ်ခုနဲ့ ကိုက်ညီရင် — `value` ကို အသုံးပြုပါတယ်။
- `{default: value}`: [Transition Type](https://react.dev/reference/react/addTransitionType) တစ်ခုနဲ့မှ မကိုက်ညီဘူးဆိုရင် အသုံးပြုမယ့် default တန်ဖိုး။

ဥပမာ — ViewTransition တစ်ခုကို ဒီလို သတ်မှတ်နိုင်ပါတယ်:

```js
<ViewTransition
  /* turn off any animation not defined below */
  default="none"
  enter={{
    /* apply slide-in for Transition Type `forward` */
    "forward": 'slide-in',
    /* otherwise use the browser default animation */
    "default": 'auto'
  }}
  /* use the browser default for exit animations*/
  exit="auto"
  /* apply a custom `cross-fade` class for updates */
  update="cross-fade"
>
```

[Styling View Transitions](#styling-view-transitions) မှာ — custom animations တွေအတွက် CSS classes တွေကို ဘယ်လို သတ်မှတ်ရမလဲဆိုတာ ကြည့်နိုင်ပါတယ်။

---

### View Transition Event

View Transition Events တွေက — [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) ကို သုံးပြီး animation ကို JavaScript နဲ့ ထိန်းချုပ်နိုင်စေပါတယ်:

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
/>
```

#### Props

- **optional** `onEnter`: "enter" animation တစ်ခု စတင်တဲ့အခါ ခေါ်ပါတယ်။
- **optional** `onExit`: "exit" animation တစ်ခု စတင်တဲ့အခါ ခေါ်ပါတယ်။
- **optional** `onShare`: "share" animation တစ်ခု စတင်တဲ့အခါ ခေါ်ပါတယ်။
- **optional** `onUpdate`: "update" animation တစ်ခု စတင်တဲ့အခါ ခေါ်ပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Transition တစ်ခုတွင် — `<ViewTransition>` တစ်ခုအတွက် event တစ်ခုတည်းပဲ fire ဖြစ်ပါတယ်။ `onShare` က `onEnter` နဲ့ `onExit` တို့ထက် ဦးစားပေးမှု (precedence) ရှိပါတယ်။
- Event တစ်ခုချင်းစီက **cleanup function** တစ်ခုကို ပြန်ပေးသင့်ပါတယ်။ View Transition ပြီးဆုံးတဲ့အခါ cleanup function ကို ခေါ်ပြီး — animations တွေကို cancel (သို့) cleanup လုပ်နိုင်ပါတယ်။

#### Arguments (အာဂျူမင့်များ)

Event တစ်ခုချင်းစီက arguments နှစ်ခု လက်ခံပါတယ်:

- `instance`: View transition ရဲ့ [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_process) တွေဆီ ဝင်ရောက်ခွင့် ပေးတဲ့ View Transition instance တစ်ခု။
  - `old`: `::view-transition-old` pseudo-element။
  - `new`: `::view-transition-new` pseudo-element။
  - `name`: ဒီ boundary အတွက် `view-transition-name` string။
  - `group`: `::view-transition-group` pseudo-element။
  - `imagePair`: `::view-transition-image-pair` pseudo-element။
- `types`: Animation ထဲမှာ ပါဝင်တဲ့ [Transition Types](https://react.dev/reference/react/addTransitionType) တွေရဲ့ `Array<string>` တစ်ခု။ Types တစ်ခုမှ သတ်မှတ်မထားဘူးဆိုရင် — ဗလာ (empty) array ပါ။

ဥပမာ — JavaScript သုံးပြီး animation ကို မောင်းနှင်တဲ့ `onEnter` event တစ်ခုကို ဒီလို သတ်မှတ်နိုင်ပါတယ်:

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

[JavaScript နဲ့ animate လုပ်ခြင်း](#animating-with-javascript) မှာ နောက်ထပ် ဥပမာတွေ ကြည့်နိုင်ပါတယ်။

---

## View Transitions တွေကို Styling လုပ်ခြင်း (Styling View Transitions)

> **မှတ်ချက်:** web ပေါ်က View Transitions ရဲ့ အစောပိုင်း ဥပမာတွေ အများကြီးမှာ — [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) တစ်ခုကို သုံးပြီး — `::view-transition-...(my-name)` selectors တွေနဲ့ style လုပ်တာကို မြင်ဖူးကြမှာပါ။ Styling အတွက် အဲဒါကို အကြံမပြုပါဘူး။ အဲဒီအစား — View Transition Class တစ်ခုကို သုံးဖို့ပဲ ပုံမှန် အကြံပြုပါတယ်။

`<ViewTransition>` တစ်ခုအတွက် animation ကို customize လုပ်ဖို့ — activation props တွေထဲက တစ်ခုဆီ View Transition Class တစ်ခုကို ပေးနိုင်ပါတယ်။ View Transition Class ဆိုတာ — ViewTransition က activate ဖြစ်တဲ့အခါ React က child elements တွေဆီ အသုံးပြုပေးတဲ့ CSS class name တစ်ခုပါ။

ဥပမာ — "enter" animation တစ်ခုကို customize လုပ်ဖို့ — `enter` prop ဆီ class name တစ်ခု ပေးပါ:

```js
<ViewTransition enter="slide-in">
```

`<ViewTransition>` က "enter" animation တစ်ခုကို activate လုပ်တဲ့အခါ — React က `slide-in` ဆိုတဲ့ class name ကို ထည့်ပေးပါတယ်။ ပြီးရင် — [view transition pseudo selectors](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) တွေနဲ့ ဒီ class ကို ညွှန်းပြီး — ပြန်သုံးလို့ရတဲ့ (reusable) animations တွေကို တည်ဆောက်နိုင်ပါတယ်:

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

နောင်တွင် — CSS libraries တွေက View Transition Classes တွေကို သုံးပြီး ဒါကို ပိုလွယ်ကူအောင် built-in animations တွေ ထည့်လာနိုင်ပါတယ်။

---

## အသုံးပြုပုံ (Usage)

### Element တစ်ခုကို enter/exit မှာ animate လုပ်ခြင်း (Animating an element on enter/exit)

Enter/Exit Transitions တွေက — transition တစ်ခုထဲက component တစ်ခုက `<ViewTransition>` တစ်ခုကို ထည့်လိုက်တဲ့အခါ (သို့) ဖယ်လိုက်တဲ့အခါ စတင်ပါတယ်:

```js
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>Hi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

`setShow` ကို ခေါ်တဲ့အခါ — `show` က `true` ကို ပြောင်းပြီး — `Child` component ကို render လုပ်ပါတယ်။ `setShow` ကို `startTransition` ရဲ့ အတွင်းမှာ ခေါ်ပြီး — `Child` က တခြား DOM nodes တွေ မတိုင်ခင် `ViewTransition` တစ်ခုကို render လုပ်တဲ့အခါ — `enter` animation တစ်ခု စတင်ပါတယ်။

`show` က `false` ကို ပြန်ပြောင်းတဲ့အခါ — `exit` animation တစ်ခု စတင်ပါတယ်။

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

> **သတိပြုရန် — Top-level ViewTransitions တွေပဲ exit/enter မှာ animate ဖြစ်ပါတယ်** (Only top-level ViewTransitions animate on exit/enter)
>
> `<ViewTransition>` က DOM nodes တွေ မတိုင်ခင် _ရှေ့မှာ_ နေရာချထားမှသာ exit/enter ကို activate လုပ်ပါတယ်။
>
> `<ViewTransition>` ရဲ့ အပေါ်မှာ `<div>` တစ်ခု ရှိရင် — exit/enter animations တွေ ဘာမှ စတင်မှာ မဟုတ်ပါဘူး:
>
> ```js
> function Item() {
>   return (
>     <div> {/* 🚩<div> above <ViewTransition> breaks exit/enter */}
>       <ViewTransition enter="auto" exit="auto" default="none">
>         <Video video={videos[0]} />
>       </ViewTransition>
>     </div>
>   );
> }
> ```
>
> ဒီကန့်သတ်ချက်က — အရမ်းများတာ (သို့) အရမ်းနည်းတာ animate ဖြစ်စေနိုင်တဲ့ သိမ်မွေ့တဲ့ (subtle) bugs တွေကို ကာကွယ်ပေးပါတယ်။

---

### Activity နဲ့ enter/exit ကို animate လုပ်ခြင်း (Animating enter/exit with Activity)

Component တစ်ခုကို သူ့ရဲ့ state ကို ထိန်းသိမ်းထားရင်း အတွင်းကို/အပြင်ကို animate လုပ်ချင်ရင် — ဒါမှမဟုတ် animation တစ်ခုအတွက် content တွေကို ကြိုတင် render လုပ်ချင်ရင် — [`<Activity>`](https://react.dev/reference/react/Activity) ကို သုံးနိုင်ပါတယ်။ `<Activity>` တစ်ခုရဲ့ အတွင်းက `<ViewTransition>` တစ်ခု visible ဖြစ်လာတဲ့အခါ — `enter` animation က activate ဖြစ်ပါတယ်။ သူက hidden ဖြစ်သွားတဲ့အခါ — `exit` animation က activate ဖြစ်ပါတယ်:

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>

```

ဒီဥပမာမှာ — `Counter` မှာ အတွင်းပိုင်း state ပါတဲ့ counter တစ်ခု ရှိပါတယ်။ Counter ကို တိုးကြည့်ပြီး — ဝှက်ပြီး — နောက်တစ်ခါ ပြန်ပြကြည့်ပါ။ Sidebar က အတွင်း/အပြင် animate ဖြစ်နေတုန်းမှာလည်း — counter ရဲ့ တန်ဖိုး ထိန်းသိမ်းထားတာ တွေ့ရပါလိမ့်မယ်:

```js
import { Activity, ViewTransition, useState, startTransition } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="layout">
      <Toggle show={show} setShow={setShow} />
      <Activity mode={show ? 'visible' : 'hidden'}>
        <ViewTransition enter="auto" exit="auto" default="none">
          <Counter />
        </ViewTransition>
      </Activity>
    </div>
  );
}
function Toggle({show, setShow}) {
  return (
    <button
      className="toggle"
      onClick={() => {
        startTransition(() => {
          setShow(s => !s);
        });
      }}>
      {show ? 'Hide' : 'Show'}
    </button>
  )
}
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

```

```css
.layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 200px;
}
.counter {
  padding: 15px;
  background: #f0f4f8;
  border-radius: 8px;
  width: 200px;
}
.counter h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.counter p {
  margin: 0 0 10px 0;
}
.toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f0f8ff;
  cursor: pointer;
  font-size: 14px;
}
.toggle:hover {
  background: #e0e8ff;
}
.counter button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

`<Activity>` မရှိဘူးဆိုရင် — sidebar ပြန်ပေါ်လာတိုင်း counter က `0` ကို ပြန် reset ဖြစ်ပါလိမ့်မယ်။

---

### Shared element တစ်ခုကို animate လုပ်ခြင်း (Animating a shared element)

ပုံမှန်အားဖြင့် — `<ViewTransition>` တစ်ခုဆီ name တစ်ခု assign လုပ်ဖို့ အကြံမပြုပါဘူး။ အဲဒီအစား React ကို name တစ်ခု အလိုအလျောက် သတ်မှတ်ခိုင်းပါ။ Name တစ်ခု assign လုပ်ချင်စေနိုင်တဲ့ အကြောင်းရင်းက — tree တစ်ခု unmount ဖြစ်ပြီး နောက် tree တစ်ခု တစ်ချိန်တည်း mount ဖြစ်တဲ့အခါ — လုံးဝ မတူညီတဲ့ components တွေကြားမှာ animate လုပ်ပြီး — အဆက်အစပ် (continuity) ကို ထိန်းသိမ်းဖို့ပါ။

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Tree တစ်ခု unmount ဖြစ်ပြီး နောက်တစ်ခု mount ဖြစ်တဲ့အခါ — unmount ဖြစ်နေတဲ့ tree ထဲမှာရော mount ဖြစ်နေတဲ့ tree ထဲမှာပါ name တူတဲ့ အတွဲတစ်တွဲ ရှိခဲ့ရင် — သူတို့ နှစ်ခုလုံးမှာ "share" animation ကို စတင်ပါတယ်။ Unmount ဖြစ်နေတဲ့ဘက်ကနေ mount ဖြစ်နေတဲ့ဘက်ဆီ animate လုပ်ပါတယ်။

exit/enter animation နဲ့ မတူဘဲ — ဒါက deleted/mounted tree ရဲ့ အတွင်းနက်နက်မှာ ရှိနိုင်ပါတယ်။ `<ViewTransition>` တစ်ခုက exit/enter အတွက်လည်း အရည်အချင်း ပြည့်မီနေရင် — "share" animation က ဦးစားပေးမှု ရပါတယ်။

Transition က ဘက်တစ်ဖက်ကို ဦးစွာ unmount လုပ်ပြီး — name အသစ် မတပ်ဆင်ခင်မှာ `<Suspense>` fallback တစ်ခုကို ဦးစွာ ပြသလာတယ်ဆိုရင် — shared element transition ဘာမှ မဖြစ်ပါဘူး။

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video, Thumbnail, FullscreenVideo} from './Video';
import videos from './data';

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return (
      <FullscreenVideo
        video={videos[0]}
        onExit={() => startTransition(() => setFullscreen(false))}
      />
    );
  }
  return (
    <Video
      video={videos[0]}
      onClick={() => startTransition(() => setFullscreen(true))}
    />
  );
}
```

```js src/Video.js
import {ViewTransition} from 'react';

const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video, children}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({video, onClick}) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

> **မှတ်ချက်:** အတွဲတစ်တွဲရဲ့ mounted (သို့) unmounted ဘက်က viewport ရဲ့ အပြင်ဘက်မှာ ရှိနေရင် — အတွဲ မဖွဲ့ပါဘူး။ တစ်ခုခုကို scroll လုပ်တဲ့အခါ — အဲဒါက viewport ထဲကို ပျံဝင်လာ (သို့) အပြင်ကို ပျံထွက်မသွားအောင် ဒါက သေချာစေပါတယ်။ အဲဒီအစား — သာမန် enter/exit တစ်ခုအနေနဲ့ပဲ သူ့ဘာသာ သဘောထားခံရပါတယ်။
>
> Component instance တစ်ခုတည်းက နေရာ ပြောင်းတာကတော့ ဒီလို မဟုတ်ပါဘူး — အဲဒါက "update" တစ်ခုကို စတင်ပါတယ်။ Position တစ်ခုက viewport အပြင်ဘက်မှာ ရှိနေရင်တောင် — အဲဒါတွေက animate ဖြစ်ပါတယ်။
>
> သိထားသင့်တဲ့ ကိစ္စတစ်ခုရှိပါတယ် — နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်နေတဲ့ unmounted `<ViewTransition>` တစ်ခုက viewport အတွင်းမှာ ရှိပေမယ့် — mounted ဘက်က viewport အတွင်းမှာ မရှိဘူးဆိုရင် — unmounted ဘက်က parent animation ရဲ့ အစိတ်အပိုင်းအနေနဲ့ မဟုတ်ဘဲ — နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်နေတာတောင် ကိုယ်ပိုင် "exit" animation အနေနဲ့ animate လုပ်ပါတယ်။

> **သတိပြုရန်:** App တစ်ခုလုံးမှာ — name တူတဲ့ အရာတစ်ခုတည်းပဲ တစ်ချိန်တည်း mounted ဖြစ်နေဖို့ အရေးကြီးပါတယ်။ ဒါကြောင့် — conflicts တွေ မဖြစ်အောင် name အတွက် unique namespaces တွေကို သုံးဖို့ အရေးကြီးပါတယ်။ ဒါကို သေချာစေဖို့ — သင်က import လုပ်မယ့် module တစ်ခုသပ်သပ်ထဲမှာ constant တစ်ခု ထည့်ထားချင်လောက်ပါတယ်:
>
> ```js
> export const MY_NAME = "my-globally-unique-name";
> import {MY_NAME} from './shared-name';
> ...
> <ViewTransition name={MY_NAME}>
> ```

---

### List ထဲက items တွေ ပြန်စီခြင်းကို animate လုပ်ခြင်း (Animating reorder of items in a list)

```js
items.map((item) => <Component key={item.id} item={item} />);
```

Content ကို update မလုပ်ဘဲ list တစ်ခုကို ပြန်စီတဲ့အခါ — list ထဲက `<ViewTransition>` တစ်ခုချင်းစီပေါ်မှာ — သူတို့က DOM node တစ်ခုရဲ့ အပြင်ဘက်မှာ ရှိနေရင် — "update" animation က စတင်ပါတယ်။ enter/exit animations တွေနဲ့ ဆင်တူပါတယ်။

ဆိုလိုတာက — ဒီ `<ViewTransition>` ပေါ်မှာ animation က စတင်ပါလိမ့်မယ်:

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}
```

```js src/Video.js
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

ဒါပေမယ့် — ဒါက item တစ်ခုချင်းစီကို animate လုပ်မှာ မဟုတ်ပါဘူး:

```js
function Component() {
  return (
    <div>
      <ViewTransition>...</ViewTransition>
    </div>
  );
}
```

အဲဒီအစား — parent `<ViewTransition>` တစ်ခုခုက cross-fade လုပ်ပါလိမ့်မယ်။ Parent `<ViewTransition>` မရှိဘူးဆိုရင် — ဒီကိစ္စမှာ animation ဘာမှ မရှိပါဘူး။

```js src/Video.js
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

ဆိုလိုတာက — Component ကို သူ့ရဲ့ ကိုယ်ပိုင် reorder animation ကို ထိန်းချုပ်ခွင့်ပေးချင်တဲ့ lists တွေမှာ — wrapper elements တွေကို ရှောင်ချင်လောက်ပါတယ်:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

အထက်က စည်းမျဉ်းက — items တွေထဲက တစ်ခုက size ပြောင်းဖို့ update ဖြစ်ပြီး — siblings တွေကိုပါ resize ဖြစ်စေတဲ့အခါမှာလည်း သက်ရောက်ပါတယ် — ဒါပေမယ့် — သူတို့က တိုက်ရိုက် (immediate) siblings တွေ ဖြစ်နေမှပဲ သူ့ရဲ့ sibling `<ViewTransition>` ကိုပါ animate လုပ်ပါလိမ့်မယ်။

ဆိုလိုတာက — re-layout အများကြီး ဖြစ်စေတဲ့ update တစ်ခုအတွင်းမှာ — page ပေါ်က `<ViewTransition>` တိုင်းကို တစ်ခုချင်းစီ animate မလုပ်ပါဘူး။ အဲဒါက — တကယ့် ပြောင်းလဲမှုကနေ အာရုံလွှဲစေမယ့် ဆူညံတဲ့ animations တွေ အများကြီး ဖြစ်စေလို့ပါ။ ဒါကြောင့် — React က animation တစ်ခုချင်းစီ ဘယ်တော့ စတင်မလဲဆိုတာကို ပိုပြီး ရှေးရှု့ထိန်းညှိ (conservative) ဆန်ပါတယ်။

> **သတိပြုရန်:** Lists တွေကို ပြန်စီတဲ့အခါ — identity ကို ထိန်းသိမ်းဖို့ keys တွေကို မှန်ကန်စွာ သုံးဖို့ အရေးကြီးပါတယ်။ Reorders တွေကို animate လုပ်ဖို့ — shared element transitions တွေဖြစ်တဲ့ "name" ကို သုံးလို့ရမယ်လို့ ထင်ရနိုင်ပေမယ့် — ဘက်တစ်ဖက်က viewport အပြင်ဘက်မှာ ရှိနေရင် အဲဒါက စတင်မှာ မဟုတ်ပါဘူး။ Reorder တစ်ခုကို animate လုပ်ဖို့ — viewport အပြင်ဘက်က နေရာတစ်ခုဆီ သွားတာကို မကြာခဏ ပြချင်လေ့ ရှိပါတယ်။

---

### Suspense content ကနေ animate လုပ်ခြင်း (Animating from Suspense content)

Transition တိုင်းလိုပဲ — React က animation ကို run လုပ်ခင် — data နဲ့ CSS အသစ် (`<link rel="stylesheet" precedence="...">`) တွေကို စောင့်ပါတယ်။ ဒါအပြင် — ViewTransitions တွေက animation ကို မစတင်ခင် font အသစ်တွေ load ဖြစ်ဖို့ 500ms အထိ စောင့်ပါတယ် — နောက်မှ flicker (မှိတ်တုတ်မှိတ်တုတ်) ဖြစ်မသွားအောင်ပါ။ အလားတူ အကြောင်းပြချက်နဲ့ပဲ — ViewTransition ထဲမှာ ထုပ်ထားတဲ့ image တစ်ခုက image ကို load ဖြစ်တာကို စောင့်ပါလိမ့်မယ်။ Suspense page ပေါ်မှာ [font တစ်ခု load ဖြစ်တာကို စောင့်ခြင်း](/docs/react/suspense) နဲ့ [image တစ်ခု load ဖြစ်တာကို စောင့်ခြင်း](/docs/react/suspense) ရဲ့ ဥပမာတွေကို ကြည့်နိုင်ပါတယ်။

ဒါက Suspense boundary instance အသစ်တစ်ခုရဲ့ အတွင်းမှာ ဆိုရင် — fallback ကို အရင် ပြပါတယ်။ Suspense boundary က အပြည့်အဝ load ဖြစ်ပြီးတဲ့နောက် — content ဆီ ပြသမှု ပေါ်လာတာကို animate လုပ်ဖို့ `<ViewTransition>` ကို စတင်ပါတယ်။

`<ViewTransition>` ကို ဘယ်မှာ နေရာချလဲပေါ် မူတည်ပြီး — Suspense boundaries တွေကို animate လုပ်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

**Update:**

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

ဒီအခြေအနေမှာ — content က A ကနေ B ကို ပြောင်းတဲ့အခါ — "update" တစ်ခုအနေနဲ့ သဘောထားပြီး — သင့်တော်ရင် အဲဒီ class ကို အသုံးပြုပါတယ်။ A ရော B ရောက `view-transition-name` တစ်ခုတည်း ရပါတယ် — ဒါကြောင့် သူတို့က default အနေနဲ့ cross-fade တစ်ခုလို ပြုမူပါတယ်။

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

**Enter/Exit:**

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

ဒီအခြေအနေမှာ — ဒါတွေက ViewTransition instance သီးခြား နှစ်ခုပါ — တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် `view-transition-name` ရှိပါတယ်။ ဒါက `<A>` ရဲ့ "exit" တစ်ခုနဲ့ `<B>` ရဲ့ "enter" တစ်ခုအနေနဲ့ သဘောထားခံရပါတယ်။

`<ViewTransition>` boundary ကို ဘယ်မှာ ထားမလဲ ရွေးချယ်မှုပေါ် မူတည်ပြီး — မတူညီတဲ့ effects တွေ ရနိုင်ပါတယ်။

---

### Animation တစ်ခုကနေ opt-out လုပ်ခြင်း (Opting-out of an animation)

တချို့အချိန်တွေမှာ — page တစ်ခုလုံးလို component ကြီးကြီးတစ်ခုကို ထုပ်ပြီး — theme ပြောင်းတာလို updates တချို့ကို animate လုပ်ချင်ပေမယ့် — page တစ်ခုလုံးရဲ့ အတွင်းက updates အားလုံးကို update ဖြစ်တိုင်း cross-fade ဖြစ်အောင် opt-in မလုပ်ချင်ဘူးဆိုရင် — အထူးသဖြင့် animations တွေကို တဖြည်းဖြည်းချင်း ထပ်ဖြည့်နေတယ်ဆိုရင် — ဒီလိုမျိုး ဖြစ်တတ်ပါတယ်။

Animation တစ်ခုကနေ opt-out လုပ်ဖို့ "none" class ကို သုံးနိုင်ပါတယ်။ Children တွေကို "none" တစ်ခုနဲ့ ထုပ်လိုက်ခြင်းဖြင့် — parent က ဆက်ပြီး စတင်နေတုန်းမှာပဲ — သူတို့ဆီ updates တွေအတွက် animations တွေကို disable လုပ်နိုင်ပါတယ်။

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

ဒါက theme ပြောင်းမှပဲ animate ဖြစ်ပြီး — children တွေပဲ update ဖြစ်ရင် animate မဖြစ်ပါဘူး။ Children တွေက သူတို့ရဲ့ ကိုယ်ပိုင် `<ViewTransition>` တွေနဲ့ နောက်တစ်ခါ opt-in လုပ်နိုင်ပါသေးတယ် — ဒါပေမယ့် အနည်းဆုံးတော့ အဲဒါက နောက်တစ်ခါ manual ဖြစ်သွားပါပြီ။

---

### Animations တွေကို customize လုပ်ခြင်း (Customizing animations)

Default အနေနဲ့ — `<ViewTransition>` က browser ရဲ့ default cross-fade ကို ပါဝင်စေပါတယ်။

Animations တွေကို customize လုပ်ဖို့ — `<ViewTransition>` က ဘယ်လို activate ဖြစ်လဲပေါ် မူတည်ပြီး — ဘယ် animations တွေ သုံးရမလဲ သတ်မှတ်ဖို့ `<ViewTransition>` component ဆီ props တွေ ပေးနိုင်ပါတယ်။

ဥပမာ — default cross fade animation ကို နှေးအောင် လုပ်နိုင်ပါတယ်:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

ပြီးတော့ — view transition classes တွေကို သုံးပြီး CSS ထဲမှာ slow-fade ကို သတ်မှတ်ပါ:

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

`default` ကို သတ်မှတ်တာအပြင် — `enter`၊ `exit`၊ `update` နဲ့ `share` animations တွေအတွက်လည်း configurations တွေ ပေးနိုင်ပါတယ်။

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

---

### Animations တွေကို types တွေနဲ့ customize လုပ်ခြင်း (Customizing animations with types)

Activation trigger တစ်ခုအတွက် — transition type တစ်ခုက activate ဖြစ်တဲ့အခါ — child elements တွေဆီ class name တစ်ခု ထည့်ဖို့ [`addTransitionType`](https://react.dev/reference/react/addTransitionType) API ကို သုံးနိုင်ပါတယ်။ ဒါက transition အမျိုးအစား တစ်ခုချင်းစီအတွက် animation ကို customize လုပ်နိုင်စေပါတယ်။

ဥပမာ — forward နဲ့ backward navigations အားလုံးအတွက် animation ကို customize လုပ်ဖို့:

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>;

// in your router:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

ViewTransition က "navigation-back" animation တစ်ခုကို activate လုပ်တဲ့အခါ — React က "slide-right" ဆိုတဲ့ class name ကို ထည့်ပါတယ်။ ViewTransition က "navigation-forward" animation တစ်ခုကို activate လုပ်တဲ့အခါ — React က "slide-left" ဆိုတဲ့ class name ကို ထည့်ပါတယ်။

နောင်တွင် — routers နဲ့ တခြား libraries တွေက standard view-transition types နဲ့ styles တွေအတွက် support တွေ ထည့်လာနိုင်ပါတယ်။

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

---

### JavaScript နဲ့ animate လုပ်ခြင်း (Animating with JavaScript)

[View Transition Classes](#view-transition-class) တွေက CSS နဲ့ animations တွေကို သတ်မှတ်ခွင့် ပေးပေမယ့် — တချို့အချိန်တွေမှာ animation အပေါ် imperative (တိုက်ရိုက် ညွှန်ကြား) ထိန်းချုပ်မှု လိုအပ်ပါတယ်။ `onEnter`၊ `onExit`၊ `onUpdate` နဲ့ `onShare` callbacks တွေက view transition pseudo-elements တွေဆီ တိုက်ရိုက် ဝင်ရောက်ခွင့် ပေးပါတယ် — [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) ကို သုံးပြီး သူတို့ကို animate လုပ်နိုင်ပါတယ်။

Callback တစ်ခုချင်းစီက view transition pseudo-elements တွေကို ကိုယ်စားပြုတဲ့ `.old` နဲ့ `.new` properties တွေ ပါတဲ့ `instance` တစ်ခုကို လက်ခံပါတယ်။ DOM element တစ်ခုပေါ်မှာ လုပ်သလိုပဲ — သူတို့ပေါ်မှာ `.animate()` ကို ခေါ်နိုင်ပါတယ်:

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

ဒါက CSS-driven animations တွေနဲ့ JavaScript-driven animations တွေကို ပေါင်းစပ်နိုင်စေပါတယ်။

အောက်က ဥပမာမှာ — default cross-fade ကို CSS က ကိုင်တွယ်ပြီး — slide animations တွေကို `onEnter` နဲ့ `onExit` animations တွေထဲမှာ JavaScript က မောင်းနှင်ပါတယ်:

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      default="none"
      /* CSS driven cross fade defaults */
      enter="auto"
      exit="auto"
      /* JS driven slide animations */
      onEnter={(instance) => {
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: 500, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: 300, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {transform: 'translateY(20px)'},
  {transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {transform: 'translateY(0)'},
  {transform: 'translateY(-20px)'},
];
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

> **မှတ်ချက် — View Transition Events တွေကို အမြဲတမ်း clean up လုပ်ပါ** (Always clean up View Transition Events)
>
> View Transition Events တွေက cleanup function တစ်ခုကို အမြဲ ပြန်ပေးသင့်ပါတယ်:
>
> ```js
> <ViewTransition
>   onEnter={(instance) => {
>     const anim = instance.new.animate(
>       SLIDE_IN,
>       {duration: 500, easing: 'ease-out'}
>     );
>     return () => anim.cancel();
>   }}
> >
> ```
>
> ဒါက View Transition ကို ကြားဖြတ် ရပ်တန့်လိုက်တဲ့အခါ — browser က animation ကို cancel လုပ်နိုင်စေပါတယ်။

---

### Transition types တွေကို JavaScript နဲ့ animate လုပ်ခြင်း (Animating transition types with JavaScript)

`ViewTransition` events တွေဆီ ပို့လိုက်တဲ့ `types` တွေကို သုံးပြီး — Transition ကို ဘယ်လို စတင်ခဲ့လဲပေါ် မူတည်ပြီး — မတူညီတဲ့ animations တွေကို အခြေအနေအလိုက် (conditionally) အသုံးပြုနိုင်ပါတယ်။

```js
 <ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

ဒီဥပမာက Transition တစ်ခုကို "fast" အဖြစ် မှတ်သားဖို့ [`addTransitionType`](https://react.dev/reference/react/addTransitionType) ကို ခေါ်ပြီး — animation duration ကို ချိန်ညှိပါတယ်:

```js src/Video.js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, addTransitionType} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      onEnter={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 2000;
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: duration, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 500;
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: duration, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  const [isFast, setIsFast] = useState(false);
  return (
    <>
      <div>
        Fast: <input type="checkbox" onChange={() => {setIsFast(f => !f)}} value={isFast}></input>
      </div><br />
      <button
        onClick={() => {
          startTransition(() => {
            if (isFast) {
              addTransitionType('fast');
            }
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {opacity: 1, transform: 'translateY(0)'},
  {opacity: 0, transform: 'translateY(-20px)'},
];
```

```js src/data.js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

---

### View Transition ဖွင့်ထားတဲ့ Routers တွေ တည်ဆောက်ခြင်း (Building View Transition enabled routers)

Scroll restoration က animation အတွင်းမှာ ဖြစ်ပေါ်ဖို့ သေချာစေဖို့ — React က ဆိုင်းငံ့ထားတဲ့ (pending) Navigation တစ်ခုခု ပြီးဆုံးတာကို စောင့်ပါတယ်။ Navigation က React ပေါ်မှာ blocked ဖြစ်နေရင် — `useEffect` က deadlock (လုံးထွေးပိတ်ဆို့မှု) ဖြစ်စေလို့ — သင့် router က `useLayoutEffect` ထဲမှာ unblock လုပ်ရပါမယ်။

"back"-navigation လိုမျိုး — legacy popstate event ကနေ `startTransition` တစ်ခုကို စတင်ခဲ့ရင် — scroll နဲ့ form restoration တွေ မှန်ကန်စွာ အလုပ်လုပ်ဖို့ — အဲဒါက synchronously ပြီးဆုံးရပါမယ်။ ဒါက View Transition animation တစ်ခု run လုပ်တာနဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။ ဒါကြောင့် — React က popstate ကနေ လာတဲ့ animations တွေကို ကျော်သွားပြီး — back button အတွက် animations တွေ run မှာ မဟုတ်ပါဘူး။ သင့် router ကို Navigation API သုံးဖို့ အဆင့်မြှင့်ခြင်းဖြင့် ဒါကို ပြုပြင်နိုင်ပါတယ်။

---

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### `<ViewTransition>` က activate မဖြစ်နေဘူး (My `<ViewTransition>` is not activating)

`<ViewTransition>` က DOM node တစ်ခုခုရဲ့ ရှေ့မှာ နေရာချထားမှသာ activate ဖြစ်ပါတယ်:

```js
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

ပြုပြင်ဖို့ — `<ViewTransition>` က တခြား DOM nodes တွေ အားလုံးရဲ့ ရှေ့မှာ ရောက်နေအောင် သေချာစေပါ:

```js
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### "There are two `<ViewTransition name=%s>` components with the same name mounted at the same time." error တစ်ခု ရနေတယ်

ဒီ error က — `name` တူတဲ့ `<ViewTransition>` components နှစ်ခုကို တစ်ချိန်တည်း mounted လုပ်လိုက်တဲ့အခါ ဖြစ်ပါတယ်:

```js
function Item() {
  // 🚩 All items will get the same "name".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </>
  );
}
```

ဒါက View Transition ကို error ဖြစ်စေပါလိမ့်မယ်။ Development မှာ — React က ဒီပြဿနာကို မျက်နှာပြင်ပေါ် ပေါ်လာစေဖို့ ရှာဖွေပြီး — error နှစ်ခုကို log လုပ်ပါတယ်:

```console
There are two `<ViewTransition name=%s>` components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
  at Item
  at ItemList

The existing `<ViewTransition name=%s>` duplicate has this stack trace.
  at Item
  at ItemList
```

ပြုပြင်ဖို့ — `name` ကို unique ဖြစ်အောင် လုပ်ပြီး (သို့) name ဆီ `id` တစ်ခု ထည့်ပြီး — app တစ်ခုလုံးမှာ name တူတဲ့ `<ViewTransition>` တစ်ခုတည်းပဲ တစ်ချိန်တည်း mounted ဖြစ်နေဖို့ သေချာစေပါ:

```js
function Item({id}) {
  // ✅ All items will get a unique name.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
```
