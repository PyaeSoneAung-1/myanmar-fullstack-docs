---
title: "useMemo"
description: "Re-renders တွေကြားမှာ တွက်ချက်မှုတစ်ခုရဲ့ ရလဒ်ကို cache လုပ်ထားနိုင်တဲ့ React Hook — dependencies တွေ မပြောင်းမချင်း calculation ကို ထပ်မလုပ်အောင် ရှောင်ခြင်း၊ child components တွေ re-render မဖြစ်အောင် ကူညီခြင်း"
order: 51
source: "https://react.dev/reference/react/useMemo"
status: translated
updated: 2026-09-02
---

`useMemo` ဆိုတာ — re-renders တွေကြားမှာ တွက်ချက်မှုတစ်ခုရဲ့ ရလဒ်ကို cache (သိမ်းဆည်း) လုပ်ထားနိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

> **မှတ်ချက်:** [React Compiler](https://react.dev/learn/react-compiler) က values တွေနဲ့ functions တွေကို အလိုအလျောက် memoize လုပ်ပေးတာမို့ — manual `useMemo` calls တွေ လိုအပ်မှုကို လျှော့ချပေးပါတယ်။ Memoization ကို အလိုအလျောက် ကိုင်တွယ်ဖို့ compiler ကို သုံးနိုင်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `useMemo(calculateValue, dependencies)`

Re-renders တွေကြားမှာ တွက်ချက်မှုတစ်ခုကို cache လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useMemo` ကို ခေါ်ပါတယ်:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

**Parameters (ပါရာမီတာများ)**

- `calculateValue`: သင်က cache လုပ်ချင်တဲ့ တန်ဖိုးကို တွက်ချက်ပေးတဲ့ function တစ်ခု။ ဒီ function က **pure** ဖြစ်ရပြီး — argument တွေ မယူရဘဲ — type မရွေး တန်ဖိုးတစ်ခုခုကို ပြန်ပေးရပါတယ်။ ကနဦး render အတွင်းမှာ React က သင့် function ကို ခေါ်ပါတယ်။ နောက် render တွေမှာတော့ — နောက်ဆုံး render နောက်ပိုင်း `dependencies` တွေ မပြောင်းလဲဘူးဆိုရင် — React က တူညီတဲ့ value ကိုပဲ ပြန်ပေးပါတယ်။ ပြောင်းလဲခဲ့ရင်တော့ — `calculateValue` ကို ခေါ်ပြီး ရလဒ်ကို ပြန်ပေး၊ နောက်မှာ ပြန်သုံးနိုင်အောင်လည်း သိမ်းထားပါတယ်။

- `dependencies`: `calculateValue` code ရဲ့ အတွင်းမှာ ကိုးကားထားတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ သင့် component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables နဲ့ functions တွေ အားလုံး ပါဝင်ပါတယ်။ သင့် linter ကို [React အတွက် သတ်မှတ်ပြီးသား ဖြစ်ရင်](https://react.dev/learn/editor-setup#linting) — reactive value တိုင်းကို dependency အဖြစ် မှန်မှန်ကန်ကန် သတ်မှတ်ထားကြောင်း စစ်ဆေးပေးပါလိမ့်မယ်။ Dependency list က item အရေအတွက် မပြောင်းလဲဘဲ — `[dep1, dep2, dep3]` လို inline ရေးရပါတယ်။ React က dependency တစ်ခုချင်းစီကို ယခင် တန်ဖိုးနဲ့ [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှု သုံးပြီး နှိုင်းယှဉ်ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- ကနဦး render မှာ — `useMemo` က argument တွေ မပါဘဲ `calculateValue` ကို ခေါ်လို့ ရလာတဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။
- နောက် render တွေမှာတော့ — dependencies တွေ မပြောင်းခဲ့ရင် နောက်ဆုံး render ကနေ သိမ်းထားပြီးသား value ကို ပြန်ပေးပြီး — ပြောင်းခဲ့ရင်တော့ `calculateValue` ကို နောက်တစ်ကြိမ် ခေါ်ပြီး အဲဒီ function က ပြန်ပေးတဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useMemo` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ လိုအပ်ရင် — component အသစ်တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- Strict Mode မှာ — React က မရည်ရွယ်ဘဲ ဖြစ်တဲ့ impurities တွေကို ရှာတွေ့စေဖို့ သင့် calculation function ကို **နှစ်ကြိမ် ခေါ်ပါတယ်** (ဒါက development-only behavior ဖြစ်ပြီး production ကို မထိခိုက်ပါဘူး)။ သင့် calculation function က pure ဖြစ်နေရင် (ဖြစ်သင့်တဲ့အတိုင်း) — ဒါက သင့် logic ကို မထိခိုက်ပါဘူး။ ခေါ်မှုတစ်ခုရဲ့ ရလဒ်ကို လျစ်လျူရှုလိုက်မှာ ဖြစ်ပါတယ်။
- React က cache လုပ်ထားတဲ့ value ကို — ဒီလိုလုပ်ဖို့ **တိကျတဲ့ အကြောင်းပြချက် ရှိမှသာ ပစ်ပယ်ပါတယ်**။ ဥပမာ — development မှာ သင်က component ရဲ့ file ကို edit လုပ်လိုက်တဲ့အခါ React က cache ကို ပစ်ပယ်ပါတယ်။ Development ရော production ရော နှစ်ခုလုံးမှာ — သင့် component က ကနဦး mount အတွင်းမှာ suspend ဖြစ်ခဲ့ရင်လည်း React က cache ကို ပစ်ပယ်ပါတယ်။ နောင်နောင်မှာ React က cache ပစ်ပယ်ခြင်းကို အခွင့်ကောင်းယူတဲ့ feature တွေ ထပ်ထည့်လာနိုင်ပါတယ် — ဥပမာ — နောင်နောင်မှာ React က virtualized lists တွေအတွက် built-in support ထည့်လိုက်ရင် — virtualized table viewport ကနေ scroll ထွက်သွားတဲ့ items တွေရဲ့ cache ကို ပစ်ပယ်လိုက်တာ အဓိပ္ပာယ်ရှိပါလိမ့်မယ်။ `useMemo` ကို performance optimization တစ်ခုအနေနဲ့ပဲ မှီခိုသုံးစွဲနေတယ်ဆိုရင် ဒါတွေက ပြဿနာ မရှိပါဘူး။ ဒါမှမဟုတ်ရင်တော့ — [state variable](/docs/react/use-state) တစ်ခု ဒါမှမဟုတ် [ref](/docs/react/use-ref) တစ်ခုက ပိုသင့်လျော်နိုင်ပါတယ်။

> **မှတ်ချက်:** ဒီလို return values တွေကို cache လုပ်တာကို [*memoization*](https://en.wikipedia.org/wiki/Memoization) လို့လည်း ခေါ်ပါတယ် — ဒါကြောင့်ပဲ ဒီ Hook ကို `useMemo` လို့ နာမည်ပေးထားတာပါ။

## အသုံးပြုပုံ (Usage)

### တွက်ချက်မှုတွေ ထပ်ခါထပ်ခါ လုပ်နေတာကို ရှောင်ခြင်း (Skipping expensive recalculations)

Re-renders တွေကြားမှာ တွက်ချက်မှုတစ်ခုကို cache လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useMemo` call ထဲမှာ အဲဒီ တွက်ချက်မှုကို ထုပ်လိုက်ပါ:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo` ကို ပစ္စည်း နှစ်ခု ပေးရပါတယ်:

1. `() =>` လို argument မယူတဲ့ **calculation function** တစ်ခု — သင်တွက်ချင်တာကို ပြန်ပေးရမှာ ဖြစ်ပါတယ်။
2. သင့် calculation ထဲမှာ သုံးထားတဲ့ — သင့် component အတွင်းက value တိုင်း ပါဝင်တဲ့ **dependencies စာရင်း** တစ်ခု။

ကနဦး render မှာ — `useMemo` ကနေ ရမယ့် **value** က သင့် **calculation** ကို ခေါ်လို့ ရလာတဲ့ ရလဒ် ဖြစ်ပါတယ်။

နောက် render တိုင်းမှာ — React က **dependencies** တွေကို နောက်ဆုံး render က ပေးခဲ့တဲ့ dependencies တွေနဲ့ နှိုင်းယှဉ်ပါတယ်။ Dependency တစ်ခုမှ မပြောင်းခဲ့ရင် ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်လို့) — `useMemo` က အရင်က တွက်ပြီးသား value ကိုပဲ ပြန်ပေးပါတယ်။ မဟုတ်ရင် — React က သင့် calculation ကို ပြန် run ပြီး value အသစ်ကို ပြန်ပေးပါတယ်။

တစ်နည်းပြောရရင် — `useMemo` က dependencies တွေ မပြောင်းမချင်း — re-renders တွေကြားမှာ တွက်ချက်မှုရဲ့ ရလဒ်ကို cache လုပ်ထားပါတယ်။

**ဒါက ဘယ်အချိန်မှာ အသုံးဝင်လဲ ဥပမာတစ်ခုနဲ့ ကြည့်ကြည့်ရအောင်။**

ပုံမှန်အားဖြင့် — React က သင့် component ရဲ့ body တစ်ခုလုံးကို re-render တိုင်းမှာ ပြန် run ပါတယ်။ ဥပမာ — ဒီ `TodoList` က သူ့ရဲ့ state ကို update လုပ်တာ ဒါမှမဟုတ် parent ဆီကနေ props အသစ်တွေ လက်ခံရရှိတိုင်း — `filterTodos` function က ပြန် run ပါလိမ့်မယ်:

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

ပုံမှန်အားဖြင့် — calculation အများစုက အရမ်းမြန်တာမို့ ဒါက ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — array ကြီးတစ်ခုကို filter/transform လုပ်နေတာ ဒါမှမဟုတ် စရိတ်ကြီးတဲ့ တွက်ချက်မှုတစ်ခုခု လုပ်နေတယ်ဆိုရင် — data မပြောင်းဘူးဆိုရင် အဲဒါကို နောက်တစ်ကြိမ် မလုပ်တော့ဘဲ ရှောင်ချင်လာပါလိမ့်မယ်။ `todos` ရော `tab` ရော နှစ်ခုလုံး နောက်ဆုံး render ကအတိုင်း တူနေမယ်ဆိုရင် — အစောက ဥပမာလို calculation ကို `useMemo` နဲ့ ထုပ်ထားတာက — အရင်က တွက်ပြီးသား `visibleTodos` ကို ပြန်သုံးစေပါတယ်။

ဒီလို caching အမျိုးအစားကို *[memoization](https://en.wikipedia.org/wiki/Memoization)* လို့ ခေါ်ပါတယ်။

> **မှတ်ချက်:** **`useMemo` ကို performance optimization တစ်ခုအနေနဲ့ပဲ မှီခိုသင့်ပါတယ်။** မပါဘဲ သင့် code အလုပ်မလုပ်ဘူးဆိုရင် — မူရင်းပြဿနာကို ရှာပြီး အရင်ဆုံး ပြုပြင်ပါ။ ပြီးမှ performance တိုးတက်စေဖို့ `useMemo` ကို ထပ်ထည့်နိုင်ပါတယ်။

#### တွက်ချက်မှုတစ်ခုက စရိတ်ကြီးလား ဆိုတာ ဘယ်လို သိနိုင်မလဲ

ယေဘုယျအားဖြင့် — object ထောင်ပေါင်းများစွာကို ဖန်တီးနေတာ ဒါမှမဟုတ် loop ပတ်နေတာ မဟုတ်ဘူးဆိုရင် — calculation က စရိတ်ကြီးလေ့ မရှိပါဘူး။ ပိုသေချာချင်ရင် — code တစ်ပိုင်းမှာ ကုန်ဆုံးတဲ့ အချိန်ကို တိုင်းတာဖို့ console log တစ်ခု ထည့်နိုင်ပါတယ်:

```js
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

သင်တိုင်းတာနေတဲ့ interaction ကို လုပ်ကြည့်ပါ (input ထဲ စာရိုက်တာမျိုး)။ ဒါဆိုရင် — console ထဲမှာ `filter array: 0.15ms` လိုမျိုး log တွေ မြင်ရပါလိမ့်မယ်။ စုစုပေါင်း logged time က သိသာတဲ့ ပမာဏ (ဥပမာ `1ms` ဒါမှမဟုတ် ပို) ဖြစ်လာရင် — အဲဒီ calculation ကို memoize လုပ်တာ အဓိပ္ပာယ်ရှိပါတယ်။ စမ်းသပ်မှုတစ်ခုအနေနဲ့ — calculation ကို `useMemo` ထဲ ထုပ်ပြီး — အဲဒီ interaction အတွက် total logged time လျော့သွားလား မလျော့ဘူးလား စစ်ဆေးကြည့်နိုင်ပါတယ်:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` က *ပထမ* render ကို မြန်အောင် မလုပ်ပေးပါဘူး — updates တွေမှာ မလိုအပ်တဲ့ အလုပ်တွေကို ရှောင်ပေးရုံပဲ ဖြစ်ပါတယ်။

သင့် machine က user တွေရဲ့ machine တွေထက် ပိုမြန်နိုင်တာမို့ — artificial slowdown (တမင်နှေးအောင် လုပ်ထားခြင်း) တစ်ခုနဲ့ performance ကို စမ်းသပ်တာ ကောင်းပါတယ်။ ဥပမာ — Chrome မှာ [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option ရှိပါတယ်။

Development မှာ performance တိုင်းတာတာက အမှန်ကန်ဆုံး ရလဒ်တွေကို မပေးနိုင်တာကိုလည်း သတိပြုပါ။ (ဥပမာ — [Strict Mode](https://react.dev/reference/react/StrictMode) ဖွင့်ထားရင် — component တစ်ခုချင်းစီကို တစ်ခါအစား နှစ်ခါ render လုပ်တာကို မြင်ရပါလိမ့်မယ်။) အမှန်ကန်ဆုံး အချိန်တွေကို ရဖို့ — သင့် app ကို production အတွက် build လုပ်ပြီး — သင့် user တွေမှာရှိတဲ့ပုံစံ device တစ်ခုပေါ်မှာ စမ်းသပ်ပါ။

#### useMemo ကို နေရာတိုင်းမှာ ထည့်သင့်လား

သင့် app က ဒီ site လိုမျိုး — interaction အများစုက coarse (page တစ်ခုလုံး ဒါမှမဟုတ် section တစ်ခုလုံး အစားထိုးတာမျိုး) ဆိုရင် — memoization က ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ တစ်ဖက်မှာ — သင့် app က drawing editor လိုမျိုး — interaction အများစုက granular (shape တွေ ရွှေ့တာမျိုး) ဆိုရင်တော့ — memoization က အရမ်း အသုံးဝင်တာကို တွေ့ရပါလိမ့်မယ်။

`useMemo` နဲ့ optimize လုပ်တာက ကိစ္စအနည်းငယ်မှာပဲ တန်ဖိုးရှိပါတယ်:

- `useMemo` ထဲ ထည့်ထားတဲ့ တွက်ချက်မှုက သိသိသာသာ နှေးနေပြီး — သူ့ရဲ့ dependencies တွေက ခဲယဉ်းမှသာ ပြောင်းတယ်။
- အဲဒီ value ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတဲ့ component တစ်ခုဆီ prop အဖြစ် ပို့တယ်။ Value မပြောင်းရင် re-render ကို ရှောင်ချင်တာပါ။ Memoization က သင့် component ကို dependencies တွေ မတူမှသာ re-render ဖြစ်စေပါတယ်။
- ပို့နေတဲ့ value ကို နောက်ပိုင်းမှာ Hook တစ်ခုခုရဲ့ dependency အဖြစ် သုံးတယ်။ ဥပမာ — တခြား `useMemo` တွက်ချက်မှုတစ်ခုရဲ့ တန်ဖိုးက ဒါပေါ်မှာ မူတည်နေတာမျိုး၊ ဒါမှမဟုတ် [`useEffect`](/docs/react/use-effect) ကနေ ဒီ value ကို dependency လုပ်ထားတာမျိုးပါ။

တခြားကိစ္စတွေမှာ — calculation တစ်ခုကို `useMemo` နဲ့ ထုပ်တာက အကျိုးကျေးဇူး မရှိပါဘူး။ ဒီလိုလုပ်တာက သိသာတဲ့ ထိခိုက်မှုလည်း မရှိတာမို့ — အသင်းတချို့က ကိစ္စတစ်ခုချင်းစီကို မစဉ်းစားတော့ဘဲ — တတ်နိုင်သမျှ အကုန် memoize လုပ်တာကို ရွေးချယ်ကြပါတယ်။ ဒီနည်းလမ်းရဲ့ အားနည်းချက်က — code က ဖတ်ရခက်လာတာပါ။ ပြီးတော့ — memoization တိုင်း အကျိုးရှိတာ မဟုတ်ဘူး: "အမြဲ အသစ်" ဖြစ်နေတဲ့ value တစ်ခုတည်းက — component တစ်ခုလုံးရဲ့ memoization ကို ပျက်ပြယ်စေဖို့ လုံလောက်ပါတယ်။

**လက်တွေ့မှာ — အောက်က principle အနည်းငယ်ကို လိုက်နာရင် — memoization အများကြီး မလိုအပ်တော့အောင် လုပ်နိုင်ပါတယ်:**

1. Component တစ်ခုက တခြား components တွေကို visually ထုပ်ပေးနေတယ်ဆိုရင် — [JSX တွေကို children အဖြစ် လက်ခံပါစေ](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)။ ဒီလိုဆို — wrapper component က သူ့ရဲ့ state ကို update လုပ်တဲ့အခါ — သူ့ရဲ့ children တွေ re-render လုပ်စရာ မလိုကြောင်း React က သိပါတယ်။
2. Local state ကို ဦးစားပေးသုံးပြီး — [state ကို လိုအပ်တာထက် ပိုမြှင့် (lift up)](/docs/react/sharing-state-between-components) မလုပ်ပါနဲ့။ ဥပမာ — forms နဲ့ item တစ်ခုကို hover လုပ်နေလားဆိုတာလို ခဏတပ်မျှ state တွေကို — tree ရဲ့ ထိပ်မှာ ဒါမှမဟုတ် global state library တစ်ခုထဲမှာ မသိမ်းပါနဲ့။
3. သင့် [rendering logic ကို pure ဖြစ်အောင် ထားပါ](/docs/react/keeping-components-pure)။ Component တစ်ခုကို re-render လုပ်တာက ပြဿနာတစ်ခုခု ဖြစ်စေတာ ဒါမှမဟုတ် သိသာတဲ့ visual artifact တစ်ခုခု ထုတ်ပေးနေတယ်ဆိုရင် — အဲဒါ သင့် component ထဲက bug တစ်ခုပါ! Memoization ထည့်တာထက် — bug ကို ပြုပြင်ပါ။
4. [state တွေကို update လုပ်တဲ့ မလိုအပ်တဲ့ Effects တွေ](https://react.dev/learn/you-might-not-need-an-effect)ကို ရှောင်ပါ။ React app တွေမှာ performance ပြဿနာ အများစုက — Effects တွေကနေ စတင်တဲ့ update ကွင်းဆက်တွေကြောင့် ဖြစ်ပြီး — အဲဒါတွေက သင့် components တွေကို ထပ်ခါထပ်ခါ render ဖြစ်စေပါတယ်။
5. သင့် [Effects တွေဆီက မလိုအပ်တဲ့ dependencies တွေကို ဖယ်ရှားဖို့ ကြိုးစားပါ](https://react.dev/learn/removing-effect-dependencies)။ ဥပမာ — memoization အစား — object ဒါမှမဟုတ် function တစ်ခုကို Effect ရဲ့ အတွင်း ဒါမှမဟုတ် component ရဲ့ အပြင်ဘက်ကို ရွှေ့လိုက်တာ မကြာခဏ ပိုရိုးရှင်းပါတယ်။

သီးခြား interaction တစ်ခုခု ကြန့်ကြာနေသေးတယ်ဆိုရင် — [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) ကို သုံးပြီး — ဘယ် components တွေက memoization ကနေ အကျိုးအများဆုံး ရမလဲ ကြည့်ကာ — လိုတဲ့နေရာမှာ memoization ထည့်ပါ။ ဒီ principles တွေက သင့် components တွေကို debug လုပ်ရတာ နားလည်ရတာ ပိုလွယ်ကူစေတာမို့ — ဘယ်အခြေအနေမှာမဆို လိုက်နာတာ ကောင်းပါတယ်။ ရေရှည်မှာ — ဒီပြဿနာကို တစ်ကြိမ်တည်းနဲ့ ဖြေရှင်းဖို့ [granular memoization တွေကို အလိုအလျောက် လုပ်တာ](https://www.youtube.com/watch?v=lGEMwh32soc)ကို ကျွန်တော်တို့ သုတေသန လုပ်နေပါတယ်။

#### ဥပမာ — `useMemo` နဲ့ calculation ကို ထပ်မလုပ်အောင် ရှောင်ခြင်း

ဒီဥပမာမှာ — rendering အတွင်း ခေါ်နေတဲ့ JavaScript function တစ်ခုက တကယ် နှေးတဲ့အခါ ဘာဖြစ်လဲ မြင်နိုင်အောင် — `filterTodos` ရဲ့ implementation ကို **တမင် နှေးအောင်လုပ်ထား**ပါတယ်။ Tabs တွေ ပြောင်းကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

Tab တွေ ပြောင်းတာ နှေးနေတာက — နှေးအောင်လုပ်ထားတဲ့ `filterTodos` ကို ပြန် run စေလို့ပါ။ ဒါက မျှော်လင့်ထားတဲ့အတိုင်းပါ — `tab` က ပြောင်းသွားတာမို့ calculation တစ်ခုလုံး ပြန် run ဖို့ *လိုအပ်*လို့ပါ။ (ဘာလို့ နှစ်ကြိမ် run လဲ သိချင်ရင် — အောက်က troubleshooting section မှာ ကြည့်ပါ။)

အခု theme ကို toggle လုပ်ကြည့်ပါ — **`useMemo` ရှိတာမို့ — တမင်နှေးအောင်လုပ်ထားပေမယ့် မြန်နေပါတယ်!** `todos` ရော `tab` ရော (သင်က `useMemo` ဆီ dependencies အဖြစ် ပေးထားတဲ့ဟာတွေ) နှစ်ခုလုံး နောက်ဆုံး render ကအတိုင်း မပြောင်းလဲတာမို့ — နှေးတဲ့ `filterTodos` ခေါ်မှုကို ရှောင်လိုက်တာပါ။

ဒီဥပမာမှာ `useMemo` ကို အသုံးပြုထားတဲ့ အဓိက file က `TodoList.js` ပါ — `App.js` က tab buttons တွေနဲ့ dark mode checkbox ကို ပြပြီး — `utils.js` က `createTodos` နဲ့ 500ms လောက် တမင် နှေးအောင်လုပ်ထားတဲ့ `filterTodos` တို့ကို သတ်မှတ်ပေးပါတယ်:

```js
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### ဥပမာ — တန်ဖိုးကို အမြဲ ပြန်တွက်ချက်နေခြင်း

ဒီဥပမာမှာလည်း — `filterTodos` ကို **တမင်နှေးအောင် လုပ်ထား**ပြီး — rendering အတွင်း ခေါ်နေတဲ့ JavaScript function တစ်ခု တကယ်နှေးရင် ဘာဖြစ်လဲ မြင်ရမှာပါ။ Tabs တွေ ပြောင်းကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

ယခင် ဥပမာနဲ့ မတူဘဲ — အခု theme ကို toggle လုပ်တာပါ နှေးနေပါတယ်! ဘာလို့လဲဆိုတော့ — **ဒီ version မှာ `useMemo` call မရှိလို့ပါ** — ဒါကြောင့် တမင်နှေးအောင်လုပ်ထားတဲ့ `filterTodos` က re-render တိုင်း ခေါ်ခံရပြီး — `theme` တစ်ခုတည်းပဲ ပြောင်းရင်တောင် ခေါ်ခံရတာပါ။ `App.js` နဲ့ `utils.js` (အပါအဝင် artificial slowdown) က အထက်က ဥပမာနဲ့ အတူတူပါပဲ — ကွာတာက ဒီ `TodoList.js` မှာ `useMemo` မပါတာပဲ ဖြစ်ပါတယ်:

```js
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

ဒါပေမယ့် — ဒီတစ်ခါ **artificial slowdown ဖယ်လိုက်တဲ့** တူညီတဲ့ code ကို ကြည့်ကြရအောင်။ `useMemo` မရှိတာကို သိသာလား မသိသာဘူးလား?

မကြာခဏဆိုသလို — memoization မပါတဲ့ code က ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ သင့် interactions တွေက လုံလောက်အောင် မြန်နေရင် — memoization မလိုနိုင်ပါဘူး။

`utils.js` ထဲက todo items အရေအတွက်ကို တိုးကြည့်ပြီး အပြုအမူ ဘယ်လို ပြောင်းလဲလဲ ကြည့်နိုင်ပါတယ်။ ဒီ calculation က အစကတည်းက သိပ်မစရိတ်ကြီးပါဘူး — ဒါပေမယ့် todos အရေအတွက် သိသိသာသာ ကြီးထွားလာရင်တော့ — overhead အများစုက filtering ထက် re-rendering ဘက်မှာ ရှိပါလိမ့်မယ်။ `useMemo` နဲ့ re-rendering ကို ဘယ်လို optimize လုပ်မလဲဆိုတာ ဆက်ဖတ်ကြည့်ပါ။

---

### Component တွေ Re-render လုပ်ခြင်းကို ရှောင်ခြင်း (Skipping re-rendering of components)

ကိစ္စတချို့မှာ — `useMemo` က child components တွေကို re-render လုပ်တာရဲ့ performance ကိုပါ optimize လုပ်ဖို့ ကူညီနိုင်ပါတယ်။ ဒါကို သရုပ်ပြဖို့ — ဒီ `TodoList` component က child `List` component ဆီ `visibleTodos` ကို prop အဖြစ် ပို့တယ်ဆိုပါစို့:

```js
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`theme` prop ကို toggle လုပ်တိုင်း app က တစ်ခဏ ရပ်သွားတာ သတိထားမိပေမယ့် — JSX ကနေ `<List />` ကို ဖယ်လိုက်ရင် မြန်သွားတာကို တွေ့ရပါတယ်။ ဒါက — `List` component ကို optimize လုပ်ဖို့ ကြိုးစားကြည့်ရကျိုး နပ်ကြောင်း ပြောနေတာပါ။

**ပုံမှန်အားဖြင့် — component တစ်ခု re-render ဖြစ်တဲ့အခါ — React က သူ့ရဲ့ children အားလုံးကို recursive ပြန် re-render လုပ်ပါတယ်။** ဒါကြောင့်ပဲ — `TodoList` က `theme` မတူတာနဲ့ re-render ဖြစ်တဲ့အခါ — `List` component ပါ *re-render ဖြစ်တာ* ဖြစ်ပါတယ်။ Re-render လုပ်ဖို့ တွက်ချက်မှု သိပ်မလိုတဲ့ components တွေအတွက်တော့ ဒါက ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — re-render တစ်ခုက နှေးတယ်လို့ သေချာအောင် စစ်ဆေးပြီးပြီဆိုရင် — props တွေ နောက်ဆုံး render ကအတိုင်း အတူတူဆိုရင် re-render ကို ရှောင်ဖို့ — `List` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ပြီး ပြောပြနိုင်ပါတယ်:

```js
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**ဒီပြောင်းလဲမှုနဲ့ဆို — `List` ရဲ့ props တွေ အားလုံး နောက်ဆုံး render ကနဲ့ *အတူတူ* ဆိုရင် — `List` က re-render ကို ရှောင်ပါလိမ့်မယ်။** ဒီနေရာမှာပဲ calculation ကို cache လုပ်တာ အရေးကြီးလာပါတယ်! `useMemo` မပါဘဲ `visibleTodos` ကို တွက်ခဲ့တယ်ဆိုပါစို့:

```js
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**အထက်က ဥပမာမှာ — `filterTodos` function က *ကွဲပြားတဲ့* array တစ်ခုကို အမြဲ ဖန်တီးပါတယ်** — `{}` object literal က object အသစ် အမြဲ ဖန်တီးသလိုပါပဲ။ ပုံမှန်အားဖြင့် ဒါက ပြဿနာ မဟုတ်ပေမယ့် — `List` ရဲ့ props တွေ ဘယ်တော့မှ အတူတူ မဖြစ်တော့ဘူးဆိုတော့ — သင့်ရဲ့ [`memo`](https://react.dev/reference/react/memo) optimization က အလုပ်မလုပ်တော့ပါဘူး။ ဒီနေရာမှာ `useMemo` က အသုံးဝင်လာပါတယ်:

```js
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**`visibleTodos` တွက်ချက်မှုကို `useMemo` နဲ့ ထုပ်လိုက်ခြင်းဖြင့် — re-renders တွေကြားမှာ *တူညီတဲ့* value ဖြစ်နေတာ သေချာစေပါတယ်** (dependencies မပြောင်းမချင်း)။ တိကျတဲ့ အကြောင်းပြချက်တစ်ခုခု ရှိမှသာလွဲလို့ — calculation တစ်ခုကို `useMemo` နဲ့ ထုပ်စရာ *မလိုပါဘူး*။ ဒီဥပမာမှာ အကြောင်းပြချက်က — အဲဒါကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတဲ့ component တစ်ခုဆီ ပို့နေလို့ ဖြစ်ပြီး — ဒါက re-render ကို ရှောင်စေတာပါ။ `useMemo` ထည့်ဖို့ တခြား အကြောင်းပြချက်အနည်းငယ်လည်း ရှိပါသေးတယ် — ဒီစာမျက်နှာမှာ ဆက်ဖတ်ရပါမယ်။

#### JSX Nodes တစ်ခုချင်းစီကို Memoize လုပ်ခြင်း

`List` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်မယ့်အစား — `<List />` JSX node ကိုယ်တိုင်ကို `useMemo` ထဲမှာ ထုပ်နိုင်ပါတယ်:

```js
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

အပြုအမူက အတူတူပါပဲ — `visibleTodos` မပြောင်းရင် — `List` က re-render မဖြစ်ပါဘူး။

`<List items={visibleTodos} />` လို JSX node တစ်ခုက — `{ type: List, props: { items: visibleTodos } }` လို object တစ်ခုပါ။ ဒီ object ကို ဖန်တီးတာ အရမ်းစျေးပေါပေမယ့် — သူ့ရဲ့ အကြောင်းအရာက ယခင်တစ်ခါနဲ့ အတူတူလားဆိုတာ React က မသိပါဘူး။ ဒါကြောင့်ပဲ — React က `List` component ကို re-render လုပ်တာ ဖြစ်ပါတယ်။

ဒါပေမယ့် — React က ယခင် render ကနဲ့ အတိအကျ တူညီတဲ့ JSX ကို မြင်ရရင် — သင့် component ကို re-render လုပ်ဖို့ မကြိုးစားတော့ပါဘူး။ ဘာလို့လဲဆိုတော့ — JSX nodes တွေက [immutable](https://en.wikipedia.org/wiki/Immutable_object) ဖြစ်လို့ပါ။ JSX node object တစ်ခုက အချိန်ကြာလာတာနဲ့ ပြောင်းလဲလို့ မရတာမို့ — re-render ကို ရှောင်လိုက်တာ အန္တရာယ်ကင်းကြောင်း React က သိပါတယ်။ ဒါပေမယ့် — ဒါ အလုပ်လုပ်ဖို့ — node က code ထဲမှာ ကြည့်ရတာ တူနေရုံနဲ့ မလုံလောက်ဘဲ — *တကယ့် object တစ်ခုတည်း* ဖြစ်နေရပါမယ်။ ဒီဥပမာမှာ `useMemo` က ဒါကို လုပ်ပေးတာပါ။

JSX nodes တွေကို `useMemo` ထဲ ကိုယ်တိုင် ထုပ်တာက အဆင်မပြေပါဘူး — ဥပမာ — ဒါကို conditionally လုပ်လို့ မရပါဘူး။ ဒါကြောင့်ပဲ — JSX nodes တွေ ထုပ်တာထက် — components တွေကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်တာကို ပုံမှန် ရွေးချယ်ကြတာပါ။

#### ဥပမာ — `useMemo` နဲ့ `memo` ကို သုံးပြီး Re-render ကို ရှောင်ခြင်း

ဒီဥပမာမှာ — `List` component ကို **တမင် နှေးအောင် လုပ်ထား**ပြီး — သင် render လုပ်နေတဲ့ React component တစ်ခုက တကယ်နှေးရင် ဘာဖြစ်လဲ မြင်ရမှာပါ။ Tabs တွေ ပြောင်းကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

Tab တွေ ပြောင်းတာ နှေးနေတာက — နှေးအောင်လုပ်ထားတဲ့ `List` ကို re-render စေလို့ပါ။ ဒါက မျှော်လင့်ထားတဲ့အတိုင်းပါ — `tab` ပြောင်းသွားတာမို့ — user ရဲ့ ရွေးချယ်မှုအသစ်ကို screen ပေါ်မှာ ထင်ဟပ်စေဖို့ လိုအပ်လို့ပါ။

ဒီနောက် — theme ကို toggle လုပ်ကြည့်ပါ။ **`useMemo` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ တွဲသုံးထားတာမို့ — တမင်နှေးအောင်လုပ်ထားပေမယ့် မြန်နေပါတယ်!** `visibleTodos` array က နောက်ဆုံး render ကနောက်ပိုင်း မပြောင်းတာမို့ — `List` က re-render ကို ရှောင်လိုက်တာပါ။ `visibleTodos` array မပြောင်းတာကလည်း — `todos` ရော `tab` ရော (သင်က `useMemo` ဆီ dependencies အဖြစ် ပေးထားတဲ့ဟာတွေ) နှစ်ခုလုံး နောက်ဆုံး render ကအတိုင်း မပြောင်းလို့ပါ။

ဒီဥပမာမှာ အဓိက file နှစ်ခု ရှိပါတယ် — `TodoList.js` က `visibleTodos` ကို `useMemo` နဲ့ တွက်ပြီး `<List />` ကို render လုပ်ပါတယ်။ `List.js` ကတော့ — `memo` နဲ့ ထုပ်ထားပြီး — items အရေအတွက်ကို log တဲ့ နေရာမှာ 500ms လောက် တမင် နှေးအောင် လုပ်ထားတဲ့ component ပါ:

```js
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

`App.js` (tab buttons တွေ၊ dark mode checkbox) နဲ့ `utils.js` (`createTodos` နဲ့ `filterTodos`) တို့က အထက်က ဥပမာတွေမှာ မြင်ခဲ့ရတဲ့အတိုင်းပါပဲ။

#### ဥပမာ — Component တစ်ခုကို အမြဲ Re-render လုပ်နေခြင်း

ဒီဥပမာမှာလည်း — `List` ကို **တမင် နှေးအောင် လုပ်ထား**ပြီး — React component တစ်ခု တကယ်နှေးရင် ဘာဖြစ်လဲ မြင်ရမှာပါ။ Tabs တွေ ပြောင်းကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

ယခင် ဥပမာနဲ့ မတူဘဲ — အခု theme toggle လုပ်တာပါ နှေးနေပါတယ်! ဘာလို့လဲဆိုတော့ — **ဒီ version မှာ `useMemo` call မရှိလို့ပါ** — `visibleTodos` က array အသစ် အမြဲ ဖြစ်နေတာမို့ — နှေးအောင်လုပ်ထားတဲ့ `List` component က re-render ကို မရှောင်နိုင်လို့ပါ။

ဒီမှာ ကွာခြားချက်ကို မြင်ရအောင် — `TodoList.js` ရဲ့ ဒီ version ကို ကြည့်ပါ (`List.js`၊ `App.js` နဲ့ `utils.js` တို့က အထက်ကအတိုင်းပါ):

```js
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

ဒါပေမယ့် — ဒီတစ်ခါ **artificial slowdown ဖယ်လိုက်တဲ့** တူညီတဲ့ code ကို ကြည့်ကြရအောင်။ `useMemo` မရှိတာကို သိသာလား မသိသာဘူးလား?

မကြာခဏဆိုသလို — memoization မပါတဲ့ code က ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ သင့် interactions တွေ လုံလောက်အောင် မြန်နေရင် — memoization မလိုပါဘူး။

သင့် app ကို တကယ်ဘာတွေက နှေးစေလဲ လက်တွေ့ကျကျ သိဖို့ — React ကို production mode နဲ့ run ပြီး — [React Developer Tools](https://react.dev/learn/react-developer-tools) ကို ပိတ်ထားကာ — သင့် app ရဲ့ user တွေမှာရှိတဲ့ device နဲ့ ဆင်တူတဲ့ devices တွေကို သုံးဖို့ လိုအပ်တာ သတိပြုပါ။

---

### Effect တစ်ခု မကြာခဏ run မဖြစ်အောင် ကာကွယ်ခြင်း (Preventing an Effect from firing too often)

တစ်ခါတရံ — [Effect](/docs/react/use-effect) တစ်ခုရဲ့ အတွင်းမှာ value တစ်ခုကို သုံးချင်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

ဒါက ပြဿနာတစ်ခု ဖန်တီးပါတယ် — [reactive value တိုင်းကို သင့် Effect ရဲ့ dependency အဖြစ် ကြေညာရပါတယ်](https://react.dev/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)။ ဒါပေမယ့် — `options` ကို dependency အဖြစ် ကြေညာလိုက်ရင် — သင့် Effect က chat room ဆီ ထပ်ခါထပ်ခါ ပြန်ချိတ်ဆက်နေစေပါလိမ့်မယ်:

```js
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problem: This dependency changes on every render
  // ...
```

ဒါကို ဖြေရှင်းဖို့ — Effect တစ်ခုကနေ ခေါ်ဖို့ လိုအပ်တဲ့ object ကို `useMemo` ထဲမှာ ထုပ်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Only changes when options changes
  // ...
```

ဒါက — `useMemo` က cache လုပ်ထားတဲ့ object ကို ပြန်ပေးနေသရွေ့ — re-renders တွေကြားမှာ `options` object က အတူတူပဲ ဖြစ်နေတာ သေချာစေပါတယ်။

ဒါပေမယ့် — `useMemo` က performance optimization တစ်ခုပဲ ဖြစ်ပြီး semantic guarantee (အဓိပ္ပာယ် အာမခံချက်) မဟုတ်တာမို့ — React က တိကျတဲ့ အကြောင်းပြချက်ရှိရင် (အထက်က Caveats မှာ ဆွေးနွေးခဲ့သလို) — cache လုပ်ထားတဲ့ value ကို ပစ်ပယ်နိုင်ပါတယ်။ ဒါက Effect ကိုပါ ပြန် run စေမှာမို့ — **သင့် object ကို Effect ရဲ့ အတွင်းဘက် ရွှေ့လိုက်ခြင်းဖြင့် — function dependency တစ်ခုရဲ့ လိုအပ်ချက်ကိုယ်တိုင် ဖယ်ရှားလိုက်တာ ပိုတောင် ကောင်းပါတယ်:**

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

အခုဆို သင့် code က ပိုရိုးရှင်းပြီး `useMemo` မလိုတော့ပါဘူး။ [Effect dependencies တွေကို ဖယ်ရှားခြင်း အကြောင်း ပိုလေ့လာပါ](https://react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)။

### တခြား Hook တစ်ခုရဲ့ Dependency ကို Memoize လုပ်ခြင်း

သင့်မှာ component body ထဲမှာ တိုက်ရိုက် ဖန်တီးထားတဲ့ object တစ်ခုပေါ် မူတည်တဲ့ calculation တစ်ခု ရှိတယ်ဆိုပါစို့:

```js
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

ဒီလို object တစ်ခုပေါ် မှီခိုနေတာက memoization ရဲ့ ရည်ရွယ်ချက်ကို အဓိပ္ပာယ်မဲ့ ဖြစ်စေပါတယ်။ Component တစ်ခု re-render ဖြစ်တဲ့အခါ — component body ထဲက code အားလုံး ပြန် run ပါတယ်။ **`searchOptions` object ကို ဖန်တီးတဲ့ code line တွေပါ re-render တိုင်း ပြန် run မှာပါ။** `searchOptions` က သင့် `useMemo` call ရဲ့ dependency တစ်ခု ဖြစ်ပြီး — သူက အခါတိုင်း မတူတာမို့ — React က dependencies တွေ မတူဘူးလို့ သိပြီး — `searchItems` ကို အခါတိုင်း ပြန်တွက်ပါတယ်။

ဒါကို ပြုပြင်ဖို့ — `searchOptions` object ကိုယ်တိုင်ကို — dependency အဖြစ် မပို့ခင် memoize လုပ်နိုင်ပါတယ်:

```js
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

အထက်က ဥပမာမှာ — `text` မပြောင်းရင် — `searchOptions` object လည်း မပြောင်းပါဘူး။ ဒါပေမယ့် — ပိုတောင် ကောင်းတဲ့ ပြုပြင်နည်းက — `searchOptions` object ရဲ့ ကြေညာချက်ကို `useMemo` calculation function ရဲ့ *အတွင်းဘက်* ရွှေ့လိုက်တာပါ:

```js
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

အခုဆို သင့် calculation က `text` ပေါ်မှာ တိုက်ရိုက် မူတည်ပါတယ် — (string ဖြစ်တာမို့ "မတော်တဆ" ကွဲပြားသွားလို့ မရတဲ့ တန်ဖိုးပါ)။

### Function တစ်ခုကို Memoize လုပ်ခြင်း

`Form` component ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတယ်ဆိုပါစို့ — သူ့ဆီ function တစ်ခုကို prop အဖြစ် ပို့ချင်တယ်ဆိုရင်:

```js
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`{}` က object အသစ် ဖန်တီးသလိုပဲ — `function() {}` လို function declarations တွေရော `() => {}` လို expressions တွေပါ — re-render တိုင်းမှာ *ကွဲပြားတဲ့* function တစ်ခုကို ထုတ်ပေးပါတယ်။ Function အသစ် ဖန်တီးတာက သူ့ဘာသာ ပြဿနာ မဟုတ်ပါဘူး — ဒါကို ရှောင်စရာ မလိုပါဘူး! ဒါပေမယ့် — `Form` component က memoized ဖြစ်နေတယ်ဆိုရင် — props တွေ မပြောင်းရင် re-render ကို ရှောင်စေချင်တာ ဖြစ်မှာပါ — *အမြဲ* ကွဲပြားနေတဲ့ prop တစ်ခုက memoization ရဲ့ ရည်ရွယ်ချက်ကို ပျက်ပြယ်စေပါတယ်။

Function တစ်ခုကို `useMemo` နဲ့ memoize လုပ်ဖို့ — သင့် calculation function က တခြား function တစ်ခုကို ပြန်ပေးရပါလိမ့်မယ်:

```js
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

ဒါက ကြည့်ရတာ ရှုပ်ထွေးပါတယ်! **Function တွေကို memoize လုပ်တာက သာမန် ကိစ္စဖြစ်လို့ — React မှာ အဲဒါအတွက် သီးသန့် built-in Hook တစ်ခု ရှိပါတယ်။** nested function တစ်ခု အပိုရေးနေစရာ မလိုအောင် — `useMemo` အစား သင့် functions တွေကို [`useCallback`](https://react.dev/reference/react/useCallback) ထဲမှာ ထုပ်ပါ:

```js
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

အထက်က ဥပမာ နှစ်ခုလုံးက လုံးဝ ညီမျှပါတယ်။ `useCallback` ရဲ့ တစ်ခုတည်းသော အကျိုးကျေးဇူးက — အတွင်းမှာ nested function တစ်ခု အပိုရေးရတာကို ရှောင်ပေးတာပါ — တခြား ဘာမှ မလုပ်ပေးပါဘူး။ [`useCallback` အကြောင်း ပိုဖတ်ပါ](https://react.dev/reference/react/useCallback)။

---

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### ငါ့ရဲ့ calculation က re-render တိုင်း နှစ်ကြိမ် run ဖြစ်နေတယ်

[Strict Mode](https://react.dev/reference/react/StrictMode) မှာ — React က သင့် function တချို့ကို တစ်ခါအစား နှစ်ခါ ခေါ်ပါတယ်:

```js
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

ဒါက မျှော်လင့်ထားတဲ့အတိုင်းဖြစ်ပြီး — သင့် code ကို မပျက်စီးစေပါဘူး။

ဒီ **development-only** အပြုအမူက [components တွေ pure ဖြစ်အောင်](/docs/react/keeping-components-pure) ကူညီပေးပါတယ်။ React က ခေါ်မှုတစ်ခုရဲ့ ရလဒ်ကို သုံးပြီး — နောက်တစ်ခုရဲ့ ရလဒ်ကို လျစ်လျူရှုပါတယ်။ သင့် component ရော calculation function ပါ pure ဖြစ်နေသရွေ့ — ဒါက သင့် logic ကို မထိခိုက်ပါဘူး။ ဒါပေမယ့် — မတော်တဆ impure ဖြစ်နေခဲ့ရင် — ဒါက အမှားကို သတိထားမိပြီး ပြုပြင်ဖို့ ကူညီပေးပါတယ်။

ဥပမာ — ဒီ impure calculation function က prop အဖြစ် ရထားတဲ့ array တစ်ခုကို mutate လုပ်ပါတယ်:

```js
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React က သင့် function ကို နှစ်ခါ ခေါ်တာမို့ — todo က နှစ်ခါ ထည့်ခံရတာကို သတိထားမိပါလိမ့်မယ်။ သင့် calculation က ရှိပြီးသား object တွေကို မပြောင်းလဲသင့်ပေမယ့် — calculation အတွင်းမှာ သင်ဖန်တီးလိုက်တဲ့ object *အသစ်* တွေကိုတော့ ပြောင်းလဲတာ အဆင်ပြေပါတယ်။ ဥပမာ — `filterTodos` function က *ကွဲပြားတဲ့* array တစ်ခုကို အမြဲ ပြန်ပေးနေတယ်ဆိုရင် — အဲဒီ array ကိုတော့ mutate လုပ်နိုင်ပါတယ်:

```js
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Purity အကြောင်း ပိုလေ့လာဖို့ — [components တွေကို pure ဖြစ်အောင် ထားခြင်း](/docs/react/keeping-components-pure) ကို ဖတ်ပါ။

ပြီးတော့ — mutation မပါဘဲ [objects တွေကို update လုပ်ခြင်း](https://react.dev/learn/updating-objects-in-state) နဲ့ [arrays တွေကို update လုပ်ခြင်း](https://react.dev/learn/updating-arrays-in-state) အတွက် လမ်းညွှန်တွေကိုလည်း ကြည့်နိုင်ပါတယ်။

### ငါ့ရဲ့ `useMemo` ခေါ်မှုက object ပြန်ပေးရမှာ — undefined ပြန်ပေးနေတယ်

ဒီ code က အလုပ်မလုပ်ပါဘူး:

```js
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScript မှာ — `() => {` က arrow function ရဲ့ body ကို စတင်တာမို့ — `{` brace က သင့် object ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး။ ဒါကြောင့် — object ကို ပြန်မပေးဖြစ်ဘဲ — အမှားတွေ ဖြစ်စေပါတယ်။ `({` နဲ့ `})` လို parentheses တွေ ထည့်ပြီး ပြုပြင်နိုင်ပါတယ်:

```js
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

ဒါပေမယ့် — ဒါက ရှုပ်ထွေးနေပြီး — တစ်ယောက်ယောက်က parentheses တွေကို ဖယ်လိုက်ရင် ပြန်ပျက်စီးဖို့ လွယ်ကူလွန်းပါတယ်။

ဒီအမှားကို ရှောင်ဖို့ — `return` statement တစ်ခုကို ရှင်းရှင်းလင်းလင်း ရေးပါ:

```js
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

### Component render တိုင်း — `useMemo` ထဲက calculation က ပြန် run နေတယ်

Dependency array ကို ဒုတိယ argument အနေနဲ့ သေချာ သတ်မှတ်ထားကြောင်း စစ်ဆေးပါ!

Dependency array ကို မေ့သွားရင် — `useMemo` က calculation ကို အခါတိုင်း ပြန် run ပါလိမ့်မယ်:

```js
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

ဒါက dependency array ကို ဒုတိယ argument အဖြစ် ပေးထားတဲ့ မှန်ကန်တဲ့ version ပါ:

```js
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

ဒါနဲ့ မပြေလည်ရင် — ပြဿနာက သင့် dependencies တစ်ခုခုက ယခင် render ကနဲ့ မတူနေလို့ပါ။ ဒီပြဿနာကို debug လုပ်ဖို့ — သင့် dependencies တွေကို console မှာ ကိုယ်တိုင် log လုပ်ကြည့်နိုင်ပါတယ်:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

ပြီးရင် — console ထဲက re-render အမျိုးမျိုးရဲ့ arrays တွေပေါ်မှာ right-click လုပ်ပြီး — နှစ်ခုလုံးကို "Store as a global variable" လို့ ရွေးနိုင်ပါတယ်။ ပထမတစ်ခုကို `temp1` အနေနဲ့၊ ဒုတိယတစ်ခုကို `temp2` အနေနဲ့ သိမ်းပြီးပြီဆိုရင် — array နှစ်ခုထဲက dependency တစ်ခုချင်းစီ တူမတူကို browser console နဲ့ စစ်နိုင်ပါတယ်:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

ဘယ် dependency က memoization ကို ပျက်စေလဲ တွေ့ပြီဆိုရင် — အဲဒါကို ဖယ်ရှားဖို့ နည်းလမ်းရှာပါ — ဒါမှမဟုတ် အဲဒါကိုပါ memoize လုပ်ပါ (အထက်က "တခြား Hook တစ်ခုရဲ့ Dependency ကို Memoize လုပ်ခြင်း" ဆောင်းပါးကို ကြည့်ပါ)။

### List item တစ်ခုချင်းစီအတွက် loop ထဲမှာ `useMemo` ခေါ်ချင်တယ် — ခွင့်မပြုဘူး

`Chart` component ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတယ်ဆိုပါစို့။ `ReportList` component re-render ဖြစ်တဲ့အခါ — list ထဲက `Chart` တစ်ခုချင်းစီ re-render မဖြစ်အောင် ရှောင်ချင်ပါတယ်။ ဒါပေမယ့် — loop တစ်ခုထဲမှာ `useMemo` ခေါ်လို့ မရပါဘူး:

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

ဒီအစား — item တစ်ခုချင်းစီအတွက် component တစ်ခု ခွဲထုတ်ပြီး — data ကို item တစ်ခုချင်းစီအတွက် memoize လုပ်ပါ:

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

တစ်နည်းအားဖြင့် — `useMemo` ကို ဖယ်ပြီး — `Report` ကိုယ်တိုင်ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်နိုင်ပါတယ်။ `item` prop မပြောင်းရင် — `Report` က re-render ကို ရှောင်ပြီး — `Chart` ပါ re-render ရှောင်သွားပါလိမ့်မယ်:

```js
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
