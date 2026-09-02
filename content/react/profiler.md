---
title: "<Profiler>"
description: "React tree တစ်ခုရဲ့ rendering performance ကို programmatically တိုင်းတာနိုင်စေတဲ့ component — id နဲ့ onRender props များ၊ onRender callback ရဲ့ parameters (id, phase, actualDuration, baseDuration, startTime, commitTime) များနဲ့ production profiling build အကြောင်း"
order: 105
source: "https://react.dev/reference/react/Profiler"
status: translated
updated: 2026-09-02
---

`<Profiler>` က — React tree တစ်ခုရဲ့ rendering performance ကို programmatically (ကုဒ်နဲ့ ချ) တိုင်းတာနိုင်စေပါတယ်။

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

## ရည်ညွှန်းချက် (Reference)

### `<Profiler>`

Component tree တစ်ခုကို `<Profiler>` ထဲမှာ ထုပ်ပြီး — သူ့ရဲ့ rendering performance ကို တိုင်းတာနိုင်ပါတယ်:

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props (props များ)

- `id` — သင်တိုင်းနေတဲ့ UI အပိုင်းကို ခွဲခြားသတ်မှတ်တဲ့ string တစ်ခုပါ။
- `onRender` — profiled tree ထဲက components တွေ update ဖြစ်တိုင်း React က ခေါ်တဲ့ `onRender` callback တစ်ခုပါ။ ဘာတွေ render ဖြစ်ခဲ့လဲ၊ အချိန် ဘယ်လောက် ယူခဲ့လဲဆိုတဲ့ အချက်အလက်တွေကို သူ့ဆီ ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Profiling လုပ်တာက overhead အနည်းငယ် ထပ်တိုးစေလို့ — **production build မှာ default အနေနဲ့ ပိတ်ထားပါတယ်။** Production profiling ကို ရွေးချယ်သုံးချင်ရင် — [profiling ဖွင့်ထားတဲ့ အထူး production build](https://react.dev/reference/dev-tools/react-performance-tracks#using-profiling-builds) တစ်ခုကို enable လုပ်ဖို့ လိုပါတယ်။

---

### `onRender` callback

React က ဘာတွေ render ဖြစ်ခဲ့လဲဆိုတဲ့ အချက်အလက်တွေနဲ့ သင့် `onRender` callback ကို ခေါ်ပါတယ်:

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Parameters (ပါရာမီတာများ)

- `id` — ခုနက commit ဖြစ်ပြီးစီးသွားတဲ့ `<Profiler>` tree ရဲ့ `id` string prop ပါ။ Profilers အများကြီး သုံးထားရင် — tree ထဲက ဘယ်အပိုင်း commit ဖြစ်ခဲ့လဲ ခွဲခြားသိဖို့ ဒါက ကူညီပါတယ်။
- `phase` — `"mount"`၊ `"update"` (သို့) `"nested-update"` ဆိုပြီး ရှိပါတယ်။ Tree က ပထမဆုံးအကြိမ် mount ဖြစ်ခဲ့တာလား၊ props/state/Hooks တွေရဲ့ ပြောင်းလဲမှုကြောင့် re-render ဖြစ်ခဲ့တာလားဆိုတာ သိစေပါတယ်။
- `actualDuration` — လက်ရှိ update အတွက် `<Profiler>` နဲ့ သူ့ရဲ့ descendants တွေကို render လုပ်ဖို့ ကုန်ကျတဲ့ မီလီစက္ကန့် အရေအတွက်ပါ။ Subtree က memoization (ဥပမာ — [`memo`](/docs/react/memo) နဲ့ [`useMemo`](/docs/react/use-memo)) ကို ဘယ်လောက် ကောင်းကောင်း အသုံးချလဲဆိုတာ ဖော်ပြပါတယ်။ အကောင်းဆုံးကတော့ — initial mount ပြီးရင် ဒီတန်ဖိုး သိသိသာသာ ကျသင့်ပါတယ် — descendants အများစုက သူတို့ရဲ့ props တွေ ပြောင်းမှပဲ re-render လိုတာမို့ပါ။
- `baseDuration` — optimization တွေ ဘာမှ မပါဘဲ `<Profiler>` subtree တစ်ခုလုံးကို re-render လုပ်ရင် ဘယ်လောက် ကြာမယ်ဆိုတဲ့ ခန့်မှန်းချက် မီလီစက္ကန့် အရေအတွက်ပါ။ Tree ထဲက component တစ်ခုချင်းစီရဲ့ နောက်ဆုံး render durations တွေကို ပေါင်းပြီး တွက်ပါတယ်။ ဒီတန်ဖိုးက rendering ရဲ့ အဆိုးဆုံး (worst-case) စရိတ်ကို ခန့်မှန်းပေးပါတယ် (ဥပမာ — initial mount ဒါမှမဟုတ် memoization မပါတဲ့ tree)။ Memoization အလုပ်လုပ်မလုပ်ဆိုတာ သိဖို့ `actualDuration` နဲ့ ယှဉ်ကြည့်ပါ။
- `startTime` — React က လက်ရှိ update ကို စတင် render လုပ်တဲ့အချိန်ရဲ့ numeric timestamp ပါ။
- `commitTime` — React က လက်ရှိ update ကို commit လုပ်တဲ့အချိန်ရဲ့ numeric timestamp ပါ။ ဒီတန်ဖိုးက commit တစ်ခုထဲက profilers တွေ အားလုံးကြားမှာ အတူတူ ဖြစ်လို့ — လိုချင်ရင် အုပ်စုလိုက် စုစည်းနိုင်ပါတယ်။

---

## အသုံးပြုပုံ (Usage)

### Rendering performance ကို programmatically တိုင်းတာခြင်း

`<Profiler>` component ကို React tree တစ်ခုရဲ့ ပတ်ပတ်လည်မှာ ထုပ်ပြီး — သူ့ရဲ့ rendering performance ကို တိုင်းတာနိုင်ပါတယ်:

```js
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

ဒါက props နှစ်ခု လိုပါတယ် — `id` (string) တစ်ခုနဲ့ `onRender` callback (function) တစ်ခုပါ — tree ထဲက component တစ်ခု update တစ်ခုကို "commit" လုပ်တိုင်း React က ဒီ callback ကို ခေါ်ပါတယ်။

> **သတိပြုရန် —** Profiling လုပ်တာက overhead အနည်းငယ် ထပ်တိုးစေလို့ — **production build မှာ default အနေနဲ့ ပိတ်ထားပါတယ်။** Production profiling ကို ရွေးချယ်သုံးချင်ရင် — [profiling ဖွင့်ထားတဲ့ အထူး production build](https://react.dev/reference/dev-tools/react-performance-tracks#using-profiling-builds) တစ်ခုကို enable လုပ်ဖို့ လိုပါတယ်။

> **မှတ်ချက်:** `<Profiler>` က တိုင်းတာမှုတွေကို programmatically စုစည်းနိုင်စေပါတယ်။ Interactive profiler တစ်ခု ရှာနေတယ်ဆိုရင် — [React Developer Tools](https://react.dev/learn/react-developer-tools) ထဲက Profiler tab ကို စမ်းကြည့်ပါ — browser extension တစ်ခုအနေနဲ့ အလားတူ လုပ်ဆောင်ချက်တွေကို ပေးပါတယ်။
>
> `<Profiler>` နဲ့ ထုပ်ထားတဲ့ components တွေကို — React Performance tracks ရဲ့ [Component tracks](https://react.dev/reference/dev-tools/react-performance-tracks#components) ထဲမှာလည်း — profiling builds တွေမှာတောင် အမှတ်အသား ပြုလုပ်ပေးထားပါတယ်။ Development builds တွေမှာတော့ — component အားလုံးကို `<Profiler>` နဲ့ ထုပ်ထားတာပဲ ဖြစ်ဖြစ် — Components track ထဲမှာ အမှတ်အသား ပြုလုပ်ပေးထားပါတယ်။

---

### App ရဲ့ အပိုင်းအစ အမျိုးမျိုးကို တိုင်းတာခြင်း

`<Profiler>` components အများကြီး သုံးပြီး — သင့် application ရဲ့ အပိုင်းအစ အမျိုးမျိုးကို တိုင်းတာနိုင်ပါတယ်:

```js
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

`<Profiler>` components တွေကို အထပ်လိုက် (nest) လည်း လုပ်နိုင်ပါတယ်:

```js
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>` က ပေါ့ပါးတဲ့ component တစ်ခု ဖြစ်ပေမယ့် — လိုအပ်တဲ့အခါမှပဲ သုံးသင့်ပါတယ်။ သုံးတိုင်း — application တစ်ခုဆီ CPU နဲ့ memory overhead အနည်းငယ် ထပ်တိုးစေလို့ပါ။
