---
title: "startTransition"
description: "State updates တွေကို non-blocking Transition အဖြစ် မှတ်သားပြီး UI ရဲ့ တုံ့ပြန်မှုကို မထိခိုက်စေတဲ့ React API — parameters/caveats များနဲ့ အသုံးပြုပုံ"
order: 59
source: "https://react.dev/reference/react/startTransition"
status: translated
updated: 2026-09-02
---

`startTransition` ဆိုတာ — UI ရဲ့ အစိတ်အပိုင်းတစ်ခုကို နောက်ခံ (background) မှာ render လုပ်နိုင်စေတဲ့ React function တစ်ခုပါ။ State update တွေကို *Transition* အဖြစ် မှတ်သားပေးလို့ — re-render ကြီးကြီးမားမား လုပ်နေရတဲ့အခါမှာတောင် UI က ချောမွေ့စွာ တုံ့ပြန်နေနိုင်ပါတယ်။

```js
startTransition(action)
```

## ရည်ညွှန်းချက် (Reference)

### `startTransition(action)`

`startTransition` function က state update တစ်ခုကို Transition အဖြစ် မှတ်သားပေးပါတယ်:

```js
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parameters (ပါရာမီတာများ)

- `action` — [`set` functions](/docs/react/use-state) တစ်ခု (သို့) အများကြီးကို ခေါ်ပြီး state တချို့ update လုပ်တဲ့ function ပါ။ React က `action` ကို ပါရာမီတာ မပါဘဲ ချက်ချင်း ခေါ်ပြီး — `action` function ရဲ့ အတွင်းမှာ synchronously စီစဉ်ထားတဲ့ state updates တွေ အားလုံးကို Transitions အဖြစ် မှတ်ပါတယ်။ `action` ထဲမှာ awaited လုပ်ထားတဲ့ async calls တွေလည်း transition ထဲမှာ ပါဝင်ပါတယ် — ဒါပေမယ့် လောလောဆယ်တော့ `await` ပြီးနောက်က `set` functions တွေကို နောက်ထပ် `startTransition` တစ်ခုနဲ့ ထုပ်ဖို့ လိုပါသေးတယ် (Troubleshooting မှာ ကြည့်ပါ)။ Transition အဖြစ် မှတ်ထားတဲ့ state updates တွေက — non-blocking (တခြား updates တွေကို မပိတ်ဆို့တဲ့) ဖြစ်ပြီး — [မလိုအပ်တဲ့ loading indicators တွေလည်း ပြမှာ မဟုတ်ပါဘူး](https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators)။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`startTransition` က ဘာမှ ပြန်မပေးပါဘူး။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `startTransition` က Transition တစ်ခု pending (ဆက်လက်လုပ်ဆောင်နေဆဲ) ဖြစ်မဖြစ် ခြေရာခံဖို့ နည်းလမ်း မပေးပါဘူး။ Transition ဖြစ်နေချိန်မှာ pending indicator ပြချင်ရင် — [`useTransition`](https://react.dev/reference/react/useTransition) ကို သုံးရပါမယ်။
- Update တစ်ခုကို Transition ထဲ ထုပ်လို့ရတာက — အဲဒီ state ရဲ့ `set` function ကို သုံးခွင့်ရှိတဲ့အခါမှပဲ ဖြစ်ပါတယ်။ Prop (သို့) custom Hook ရဲ့ return value တစ်ခုကို တုံ့ပြန်ပြီး Transition စတင်ချင်ရင်တော့ — [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) ကို စမ်းကြည့်ပါ။
- `startTransition` ဆီ ပေးလိုက်တဲ့ function ကို ချက်ချင်း ခေါ်ပြီး — သူ run နေချိန်အတွင်းမှာ ဖြစ်ပွားတဲ့ state updates တွေကိုပဲ Transitions အဖြစ် မှတ်ပါတယ်။ ဥပမာ — `setTimeout` ထဲမှာ state update လုပ်ကြည့်ရင် — အဲဒါက Transition အဖြစ် မမှတ်ခံရတော့ပါဘူး။
- Async request တွေရဲ့ နောက်မှာ လုပ်တဲ့ state updates တွေကို Transitions အဖြစ် မှတ်ဖို့ — နောက်ထပ် `startTransition` တစ်ခုနဲ့ ထုပ်ရပါတယ်။ ဒါက သိထားတဲ့ limitation တစ်ခုဖြစ်ပြီး — နောင်မှာ ပြင်ဆင်ဖို့ ရှိပါတယ် ([Troubleshooting](https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) မှာ ကြည့်ပါ)။
- Transition အဖြစ် မှတ်ထားတဲ့ state update ကို — တခြား state updates တွေက ကြားဖြတ်နိုင်ပါတယ်။ ဥပမာ — chart component တစ်ခုကို Transition အတွင်းမှာ update လုပ်နေတုန်း — input ထဲ စာရိုက်လိုက်ရင် — React က input state update ကို အရင် ကိုင်တွယ်ပြီးမှ — chart component ပေါ်က rendering အလုပ်ကို ပြန်စပါတယ်။
- Transition updates တွေကို text inputs တွေကို ထိန်းချုပ်ဖို့ သုံးလို့ မရပါဘူး။
- Transitions အများကြီး တစ်ပြိုင်နက် ဖြစ်နေရင် — လောလောဆယ် React က သူတို့ကို အတူတကွ batch လုပ်ပါတယ်။ ဒါက နောင်ထုတ်ဝေမှုတစ်ခုမှာ ဖယ်ရှားနိုင်တဲ့ limitation တစ်ခုပါ။

## အသုံးပြုပုံ (Usage)

### State update တစ်ခုကို non-blocking Transition အဖြစ် မှတ်သားခြင်း (Marking a state update as a non-blocking Transition)

State update တစ်ခုကို `startTransition` call တစ်ခုအတွင်းမှာ ထုပ်ပြီး *Transition* အဖြစ် မှတ်နိုင်ပါတယ်:

```js
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transitions တွေက — စက်နှေးတဲ့ devices တွေမှာတောင် — user interface updates တွေ ချောမွေ့စွာ တုံ့ပြန်နေနိုင်အောင် ကူညီပေးပါတယ်။

Transition တစ်ခုနဲ့ဆို — re-render အလယ်မှာတောင် UI က တုံ့ပြန်မှု ရှိနေပါတယ်။ ဥပမာ — အသုံးပြုသူက tab တစ်ခုကို click လုပ်ပြီး စိတ်ပြောင်းသွားလို့ နောက် tab တစ်ခုကို ထပ်နှိပ်ရင် — ပထမ re-render ပြီးတဲ့အထိ စောင့်စရာ မလိုဘဲ — ချက်ချင်း နှိပ်လို့ရပါတယ်။

> **သတိပြုရန်** — `startTransition` က [`useTransition`](https://react.dev/reference/react/useTransition) နဲ့ အရမ်းဆင်ပါတယ် — ဒါပေမယ့် Transition ဖြစ်နေတုန်းလားဆိုတာ ခြေရာခံဖို့ `isPending` flag ကို မပေးပါဘူး။ `useTransition` မရနိုင်တဲ့ နေရာမှာ `startTransition` ကို ခေါ်လို့ရပါတယ် — ဥပမာ — components တွေရဲ့ အပြင်ဘက်၊ data library တစ်ခုကနေ စသဖြင့်ပါ။
>
> [Transitions အကြောင်း နဲ့ ဥပမာတွေကို `useTransition` page မှာ ကြည့်ရှုနိုင်ပါတယ်](https://react.dev/reference/react/useTransition)။
