---
title: "useDeferredValue"
description: "UI တစ်စိတ်တစ်ပိုင်းရဲ့ update ကို ရွှေ့ဆိုင်းပေးနိုင်တဲ့ React Hook — value နဲ့ 'လိုက်မမီသေး' တဲ့ deferred version ကို ပြန်ပေးခြင်း၊ ဒေတာအသစ် မရောက်ခင် ပုံဟောင်းပြခြင်း၊ re-render performance ပိုင်း optimize လုပ်ခြင်း"
order: 62
source: "https://react.dev/reference/react/useDeferredValue"
status: translated
updated: 2026-09-02
---

`useDeferredValue` ဆိုတာ — UI တစ်စိတ်တစ်ပိုင်းရဲ့ update လုပ်ခြင်းကို ရွှေ့ဆိုင်း (defer) ပေးနိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const deferredValue = useDeferredValue(value)
```

## ရည်ညွှန်းချက် (Reference)

### `useDeferredValue(value, initialValue?)`

အဲဒီ value ရဲ့ deferred version တစ်ခုကို ရဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useDeferredValue` ကို ခေါ်ပါတယ်:

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

#### Parameters

- `value` — သင်က defer (ရွှေ့ဆိုင်း) ချင်တဲ့ တန်ဖိုးပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။
- **optional** `initialValue` — component တစ်ခုရဲ့ ကနဦး render အတွင်း သုံးမယ့် တန်ဖိုးပါ။ ဒီ option ကို ချန်လိုက်ရင် — `useDeferredValue` က ကနဦး render မှာ defer လုပ်မှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒီအစား render လုပ်ဖို့ `value` ရဲ့ ယခင် version တစ်ခု မရှိသေးလို့ပါ။

#### Returns

- `currentValue` — ကနဦး render အတွင်းမှာ — ပြန်ပေးတဲ့ deferred value က `initialValue` ဖြစ်မယ်၊ ဒါမှမဟုတ် သင်ပေးလိုက်တဲ့ value အတိုင်းပဲ ဖြစ်ပါလိမ့်မယ်။ Updates တွေအတွင်းမှာ — React က အရင်ဆုံး value အဟောင်းနဲ့ re-render တစ်ခါ လုပ်ဖို့ ကြိုးစားပြီး (ဒါကြောင့် value အဟောင်း ပြန်ရမယ်) — နောက်မှ value အသစ်နဲ့ background မှာ နောက်ထပ် re-render တစ်ခါ လုပ်ပါတယ် (ဒါကြောင့် update ဖြစ်ပြီးသား value ကို ပြန်ရမယ်)။

#### Caveats

- Update တစ်ခုက Transition တစ်ခုရဲ့ အတွင်းမှာ ရှိနေရင် — update ကိုယ်တိုင် deferred ဖြစ်နေပြီးသားမို့ — `useDeferredValue` က value အသစ်ကိုပဲ အမြဲ ပြန်ပေးပြီး — deferred render တစ်ခုကို ထပ်မထုတ်ပါဘူး။
- `useDeferredValue` ဆီ ပို့တဲ့ values တွေက — primitive values (strings နဲ့ numbers လိုမျိုး) ဒါမှမဟုတ် rendering အပြင်မှာ ဖန်တီးထားတဲ့ objects တွေ ဖြစ်သင့်ပါတယ်။ Rendering အတွင်း object အသစ်တစ်ခု ဖန်တီးပြီး ချက်ချင်း `useDeferredValue` ဆီ ပို့ရင် — render တိုင်း မတူတဲ့ object ဖြစ်နေလို့ — မလိုအပ်တဲ့ background re-renders တွေ ဖြစ်စေပါတယ်။
- `useDeferredValue` က value မတူတာတစ်ခုကို လက်ခံရရှိတဲ့အခါ ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်လို့) — လက်ရှိ render (value အဟောင်းကို သုံးနေတုန်း) အပြင် — value အသစ်နဲ့ background မှာ re-render တစ်ခုကို schedule လုပ်ပါတယ်။ ဒီ background re-render က ကြားဖြတ်ရပ်တန့်လို့ရတယ်: `value` ကို နောက်ထပ် update တစ်ခု ရှိလာရင် — React က background re-render ကို အစကနေ ပြန်စပါတယ်။ ဥပမာ — user က deferred value လက်ခံတဲ့ chart တစ်ခု re-render လုပ်နိုင်တာထက် ပိုမြန်မြန် input ထဲ စာရိုက်နေရင် — chart က user စာရိုက်တာ ရပ်မှသာ re-render ဖြစ်ပါလိမ့်မယ်။
- `useDeferredValue` က [`<Suspense>`](/docs/react/suspense) နဲ့ ပေါင်းစပ်ထားပါတယ်။ Value အသစ်ကြောင့် ဖြစ်တဲ့ background update က UI ကို suspend လုပ်ခဲ့ရင် — user က fallback ကို မြင်ရမှာ မဟုတ်ပါဘူး။ Data မရောက်မချင်း — deferred value အဟောင်းကိုပဲ မြင်နေရပါလိမ့်မယ်။
- `useDeferredValue` က network requests တွေ အပိုမဖြစ်အောင် သူ့ဘာသာ မကာကွယ်ပေးပါဘူး။
- `useDeferredValue` ကိုယ်တိုင်ကြောင့် ဖြစ်တဲ့ ပုံသေ delay ဆိုတာ မရှိပါဘူး။ React က မူရင်း re-render ကို ပြီးတာနဲ့ — deferred value အသစ်နဲ့ background re-render ကို ချက်ချင်း စလုပ်ပါတယ်။ Events တွေ (စာရိုက်တာလိုမျိုး) ကြောင့် ဖြစ်တဲ့ updates တွေက background re-render ကို ကြားဖြတ်ပြီး — ဦးစားပေး လုပ်ဆောင်ပါတယ်။
- `useDeferredValue` ကြောင့် ဖြစ်တဲ့ background re-render က — screen ပေါ်ကို commit မဖြစ်မချင်း Effects တွေကို မဖွင့်ပါဘူး။ Background re-render က suspend ဖြစ်ရင် — သူ့ရဲ့ Effects တွေက data ရောက်ပြီး UI update ဖြစ်ပြီးမှသာ run ပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### ဒေတာအသစ် မရောက်သေးခင် ပုံဟောင်းကို ဆက်ပြခြင်း

UI တစ်စိတ်တစ်ပိုင်းရဲ့ update ကို defer လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useDeferredValue` ကို ခေါ်ပါတယ်:

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

ကနဦး render အတွင်းမှာ — deferred value က သင်ပေးလိုက်တဲ့ value နဲ့ အတူတူပါပဲ။

Updates တွေအတွင်းမှာတော့ — deferred value က နောက်ဆုံး value နောက်ကို "လိုက်နောက်ကျ" နေပါလိမ့်မယ်။ အထူးသဖြင့် — React က အရင်ဆုံး deferred value ကို update မလုပ်ဘဲ re-render တစ်ခါ လုပ်ပြီး — နောက်မှ လက်ခံရရှိထားတဲ့ value အသစ်နဲ့ background မှာ re-render လုပ်ဖို့ ကြိုးစားပါတယ်။

ဒါက ဘယ်အချိန်မှာ အသုံးဝင်လဲ ဥပမာနဲ့ ကြည့်ကြည့်ရအောင်။ ဒီဥပမာမှာ — `SearchResults` component က search results တွေ ယူနေချိန်မှာ [suspend](/docs/react/suspense) ဖြစ်ပါတယ်။ သင်က `"a"` လို့ ရိုက်ပြီး ရလဒ်တွေ စောင့်ကြည့်၊ ပြီးတော့ `"ab"` လို့ ပြင်ကြည့်ရင် — `"a"` ရဲ့ ရလဒ်တွေကို loading fallback နဲ့ အစားထိုးသွားတာ တွေ့ရပါလိမ့်မယ်။ (ဒီဥပမာက — [`use`](https://react.dev/reference/react/use) နဲ့ ဖတ်တဲ့ Promise လို — Suspense boundary တစ်ခုကို activate လုပ်ပေးတဲ့ data source တစ်ခုကို သုံးထားတယ်လို့ ယူဆပါတယ်။)

ဒီပြဿနာကို ရှောင်တဲ့ နည်းတစ်ခုက — results list ရဲ့ update ကို *defer* လုပ်ပြီး — ရလဒ်အသစ်တွေ အသင့်မဖြစ်မချင်း ရလဒ်အဟောင်းတွေကို ဆက်ပြနေတာပါ။ Query ရဲ့ deferred version တစ်ခုကို အောက်ကို ပို့ဖို့ `useDeferredValue` ကို ခေါ်ပါ:

```js
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` က ချက်ချင်း update ဖြစ်လို့ — input ထဲမှာ တန်ဖိုးအသစ် ပေါ်ပါတယ်။ ဒါပေမယ့် — `deferredQuery` က data အကုန် load မဖြစ်မချင်း ယခင် တန်ဖိုးကိုပဲ ထားထားလို့ — `SearchResults` က ခဏလောက် ရလဒ်အဟောင်းတွေကိုပဲ ပြနေပါလိမ့်မယ်။ Suspense fallback အစား — ရလဒ်အသစ်တွေ load မဖြစ်မချင်း stale result list ကို မြင်ရတော့မှာ ဖြစ်ပါတယ်။

#### Defer လုပ်ခြင်းက အောက်ခြေမှာ ဘယ်လို အလုပ်လုပ်လဲ

အဆင့် နှစ်ဆင့်လို့ မြင်ယောင်ကြည့်နိုင်ပါတယ်:

1. **ပထမ — React က `query` အသစ် (`"ab"`) နဲ့ re-render လုပ်ပေမယ့် `deferredQuery` အဟောင်း (စလိုက်တုန်းက `"a"`) နဲ့ပဲ လုပ်ပါတယ်။** ရလဒ် list ဆီ ပို့ထားတဲ့ `deferredQuery` value က *deferred* ဖြစ်လို့ — `query` value နောက်ကို "လိုက်နောက်ကျ" နေပါတယ်။
2. **Background မှာ — React က `query` ရော `deferredQuery` ပါ `"ab"` အဖြစ် update ဖြစ်ပြီးသား နဲ့ re-render လုပ်ဖို့ ကြိုးစားပါတယ်။** ဒီ re-render ပြီးရင် — React က screen ပေါ်မှာ ပြပါတယ်။ ဒါပေမယ့် — suspend ဖြစ်ခဲ့ရင် (`"ab"` ရဲ့ ရလဒ်တွေ မရောက်သေးရင်) — React က ဒီ rendering ကြိုးစားမှုကို စွန့်လွှတ်ပြီး — data ရောက်ပြီးမှ ဒီ re-render ကို ပြန်ကြိုးစားပါတယ်။ Data အသင့်မဖြစ်မချင်း — user က deferred value အဟောင်းကိုပဲ ဆက်မြင်နေရပါတယ်။

Deferred "background" rendering က ကြားဖြတ်ရပ်တန့်လို့ရပါတယ်။ ဥပမာ — input ထဲ နောက်တစ်ခါ ထပ်ရိုက်လိုက်ရင် — React က အဲဒါကို စွန့်လွှတ်ပြီး value အသစ်နဲ့ ပြန်စပါတယ်။ React က နောက်ဆုံး ပေးထားတဲ့ value ကိုပဲ အမြဲ သုံးပါတယ်။

Keystroke တစ်ချက်ချင်းစီအတွက် network request တစ်ခုစီ ရှိနေတုန်းပဲ ဆိုတာ သတိပြုပါ — ဒီမှာ defer လုပ်တာက ရလဒ်တွေ ပြသခြင်းကိုပါ — network requests တွေကို မဟုတ်ပါဘူး။ User ဆက်ရိုက်နေရင်တောင် — keystroke တစ်ခုချင်းစီရဲ့ responses တွေကို cache လုပ်ထားလို့ — Backspace နှိပ်တာက ချက်ချင်း ဖြစ်ပြီး ထပ်ပြီး fetch မလုပ်တော့ပါဘူး။

### Content က stale ဖြစ်နေကြောင်း အချက်ပြခြင်း

အထက်က ဥပမာမှာ — နောက်ဆုံး query အတွက် ရလဒ် list က ဆက်လက် loading ဖြစ်နေသေးတယ်ဆိုတဲ့ အချက်ပြမှု မပါပါဘူး။ ရလဒ်အသစ်တွေ load ဖို့ အချိန်ယူရရင် — user အတွက် ရှုပ်ထွေးစေနိုင်ပါတယ်။ ရလဒ် list က နောက်ဆုံး query နဲ့ မကိုက်ညီဘူးဆိုတာ ပိုသိသာအောင် — stale result list ပြနေချိန်မှာ visual အချက်ပြမှု တစ်ခု ထည့်နိုင်ပါတယ်:

```js
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

ဒီပြောင်းလဲမှုနဲ့ဆို — စာစရိုက်တာနဲ့ — stale result list က ရလဒ်အသစ် load မဖြစ်မချင်း အနည်းငယ် မှိန်ဖျော့သွားပါတယ်။ CSS transition တစ်ခု ထည့်ပြီး မှိန်တာကို ဖြည်းဖြည်းချင်း ဖြစ်အောင်လည်း လုပ်နိုင်ပါတယ် — ဥပမာ `transition: 'opacity 0.2s 0.2s linear'` လိုမျိုးပါ။

### UI တစ်စိတ်တစ်ပိုင်းရဲ့ re-render ကို ရွှေ့ဆိုင်းခြင်း

`useDeferredValue` ကို performance optimization တစ်ခုအနေနဲ့လည်း သုံးနိုင်ပါတယ်။ သင့် UI ရဲ့ တစ်စိတ်တစ်ပိုင်းက re-render လုပ်ရတာ နှေးနေပြီး — အလွယ်တကူ optimize လုပ်ဖို့ နည်းလမ်း မရှိတဲ့အခါ — ကျန် UI ကို မပိတ်ဆို့အောင် ကာကွယ်ချင်တဲ့အခါမျိုးမှာ အသုံးဝင်ပါတယ်။

Text field တစ်ခုနဲ့ — keystroke တိုင်းမှာ re-render ဖြစ်နေတဲ့ component တစ်ခု (chart ဒါမှမဟုတ် list ရှည်ကြီးတစ်ခုလိုမျိုး) ရှိတယ် ဆိုပါစို့:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

ပထမဆုံး — `SlowList` ကို props တွေ အတူတူဆိုရင် re-render ရှောင်ဖို့ optimize လုပ်ပါ — [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ပြီး:

```js
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

ဒါပေမယ့် — ဒါက `SlowList` ရဲ့ props တွေ ယခင် render ကနဲ့ *အတူတူ* ဆိုမှသာ အကူအညီ ဖြစ်ပါတယ်။ အခု ကြုံနေတဲ့ ပြဿနာက — props တွေ *မတူ* တဲ့အခါ (တကယ်ကို visual output မတူ ပြသဖို့လိုတဲ့အခါ) နှေးနေတာပါ။

တိတိကျကျပြောရရင် — အဓိက performance ပြဿနာက — input ထဲ စာရိုက်တိုင်း `SlowList` က props အသစ်တွေ ရပြီး — သူ့ရဲ့ tree တစ်ခုလုံး re-render လုပ်တာက စာရိုက်ရတာ တုံ့ဆိုင်းစေလို့ပါ။ ဒီကိစ္စမှာ — `useDeferredValue` က input update (မြန်ဖို့ လိုတဲ့ဟာ) ကို — ရလဒ် list update (နှေးတာ ခံနိုင်ရတဲ့ဟာ) ထက် ဦးစားပေးနိုင်စေပါတယ်:

```js
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

ဒါက `SlowList` ရဲ့ re-render ကို မြန်အောင် မလုပ်ပေးပါဘူး။ ဒါပေမယ့် — React ကို ပြောတာက — list ရဲ့ re-render ကို ဦးစားနိမ့် သတ်မှတ်လို့ရလို့ — keystrokes တွေကို မပိတ်ဆို့တော့ဘူးဆိုတာပါ။ List က input နောက်ကို "လိုက်နောက်ကျ" ပြီး နောက်ပိုင်း "အမီလိုက်" ပါလိမ့်မယ်။ React က list ကို တတ်နိုင်သမျှ မြန်မြန် update ဖို့ ကြိုးစားဦးမှာပါ — ဒါပေမယ့် user စာရိုက်တာကိုတော့ မပိတ်ဆို့ပါဘူး။

> **သတိပြုရန်:** ဒီ optimization က `SlowList` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားဖို့ လိုအပ်ပါတယ်။ ဘာလို့လဲဆိုတော့ — `text` ပြောင်းတိုင်း — React က parent component ကို မြန်မြန် re-render လုပ်နိုင်ဖို့ လိုလို့ပါ။ အဲဒီ re-render အတွင်း — `deferredText` က ယခင် တန်ဖိုးအတိုင်း ရှိနေသေးတာမို့ — `SlowList` က re-render ကို ရှောင်နိုင်ပါတယ် (props တွေ မပြောင်းလို့)။ [`memo`](https://react.dev/reference/react/memo) မပါရင် — ဘာပဲဖြစ်ဖြစ် re-render လုပ်ရမှာမို့ — optimization ရဲ့ ရည်ရွယ်ချက် ပျက်ပြယ်သွားပါတယ်။

#### Deferring value က debouncing နဲ့ throttling နဲ့ ဘာကွာလဲ

ဒီအခြေအနေမျိုးမှာ အရင်က သုံးဖူးနိုင်တဲ့ optimization နည်းစနစ် နှစ်ခု ရှိပါတယ်:

- *Debouncing* ဆိုတာ — list ကို update မလုပ်ခင် user စာရိုက်တာ ရပ်တည့်တာ (ဥပမာ တစ်စက္ကန့်လောက်) စောင့်တာပါ။
- *Throttling* ဆိုတာ — list ကို ခဏခဏပဲ update လုပ်တာပါ (ဥပမာ တစ်စက္ကန့်ကို တစ်ခါထက် မပို)။

ဒီနည်းစနစ်တွေက ကိစ္စတချို့မှာ အသုံးဝင်ပေမယ့် — `useDeferredValue` က rendering ကို optimize လုပ်ဖို့ ပိုသင့်တော်ပါတယ် — ဘာလို့လဲဆိုတော့ သူက React နဲ့ကိုယ်တိုင် နက်ရှိုင်းစွာ ပေါင်းစပ်ထားပြီး — user ရဲ့ device နဲ့ပါ လိုက်လျောညီထွေ ဖြစ်နေလို့ပါ။

Debouncing ဒါမှမဟုတ် throttling နဲ့ မတူဘဲ — ပုံသေ delay တစ်ခုကို ရွေးစရာ မလိုပါဘူး။ User ရဲ့ device က မြန်ရင် (ဥပမာ laptop ကောင်းကောင်းတစ်လုံး) — deferred re-render က ချက်ချင်းနီးပါး ဖြစ်ပြီး သိသာမှာ မဟုတ်ပါဘူး။ Device နှေးရင်တော့ — list က device ဘယ်လောက် နှေးလဲ အချိုးကျ — input နောက်ကို "လိုက်နောက်ကျ" နေပါလိမ့်မယ်။

ဒါ့အပြင် — debouncing ဒါမှမဟုတ် throttling နဲ့ မတူဘဲ — `useDeferredValue` လုပ်တဲ့ deferred re-renders တွေက ပုံမှန်အားဖြင့် ကြားဖြတ်ရပ်တန့်လို့ရပါတယ်။ ဆိုလိုတာက — React က list ကြီးတစ်ခုကို re-render လုပ်နေချိန်မှာ user က နောက်ထပ် keystroke တစ်ခု ရိုက်လိုက်ရင် — React က အဲဒီ re-render ကို စွန့်လွှတ်ပြီး — keystroke ကို ကိုင်တွယ်ကာ — background မှာ ပြန်စပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — debouncing နဲ့ throttling က *blocking* ဖြစ်လို့ — rendering က keystroke ကို ပိတ်ဆို့တဲ့ အချိန်ကို ရွှေ့ပေးရုံပဲ ရှိလို့ — ဆက်ပြီး တုံ့ဆိုင်းတဲ့ experience ဖြစ်စေပါတယ်။

သင်က optimize လုပ်နေတဲ့ အလုပ်က rendering အတွင်း မဖြစ်ဘူးဆိုရင် — debouncing နဲ့ throttling က အသုံးဝင်နေဦးမှာပါ။ ဥပမာ — network requests အရေအတွက် လျှော့ချဖို့ သုံးနိုင်ပါတယ်။ နည်းစနစ် နှစ်မျိုးလုံးကို အတူတကွလည်း သုံးနိုင်ပါတယ်။
