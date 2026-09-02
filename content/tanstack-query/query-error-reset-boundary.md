---
title: "QueryErrorResetBoundary (Query error များကို reset ပြုလုပ်ရန် component)"
description: "QueryErrorResetBoundary ရဲ့ props နဲ့ Returns — suspense / throwOnError သုံးထားတဲ့ queries တွေရဲ့ error များကို နယ်နိမိတ်အတွင်းမှာ reset လုပ်ပြီး error retry pattern တည်ဆောက်ပေးတဲ့ component"
order: 52
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/QueryErrorResetBoundary"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function QueryErrorResetBoundary(__namedParameters): Element;
```

Queries တွေမှာ `suspense` ဒါမှမဟုတ် `throwOnError` သုံးထားတဲ့အခါ — error တစ်ခု ဖြစ်ပြီးနောက် re-render ပြန်လုပ်တဲ့အခါ "နောက်တစ်ခါ ပြန်ကြိုးစားချင်ပါတယ်" ဆိုတာကို queries တွေ သိအောင် ပြောဖို့ နည်းလမ်းတစ်ခု လိုပါတယ်။ `QueryErrorResetBoundary` component က — သူ့ရဲ့ နယ်နိမိတ် (boundaries) အတွင်းမှာရှိတဲ့ query errors တွေ အားလုံးကို reset လုပ်ပေးပါတယ်။

ဒီ reset ကို error boundary တစ်ခုရဲ့ `onReset` ဒါမှမဟုတ် "Try again" button နဲ့ တွဲသုံးတဲ့အခါ — error state တွေ ရှင်းသွားပြီး queries တွေက နောက်တစ်ကြိမ် ပြန်ကြိုးစားပါတယ်။ Suspense + error retry pattern အသေးစိတ်ကို [Suspense guide](/docs/tanstack-query/suspense) မှာ၊ suspense/`throwOnError` option သုံးတဲ့ hook ပုံစံတွေကို [useQuery](/docs/tanstack-query/use-query) မှာ ကြည့်နိုင်ပါတယ်။

## Parameters

**`__namedParameters`** — [`QueryErrorResetBoundaryProps`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/QueryErrorResetBoundaryProps) interface:

| Property | အဓိပ္ပာယ် |
|---|---|
| `children` | `ReactNode` ဒါမှမဟုတ် `QueryErrorResetBoundaryFunction` — သာမန် node တစ်ခု ဖြစ်နိုင်သလို၊ boundary ရဲ့ `QueryErrorResetBoundaryValue` ကို လက်ခံပြီး node ပြန်ပေးတဲ့ function (render prop) လည်း ဖြစ်နိုင်ပါတယ် |

ဒီ `QueryErrorResetBoundaryValue` ထဲမှာ — `reset` (boundary ထဲက query errors တွေကို reset လုပ်ပြီး queries တွေ ပြန်ကြိုးစားနိုင်အောင် လုပ်ပေး), `isReset` (reset ဖြစ်ခဲ့လားဆိုတာ စစ်ပေးတဲ့ function), `clearReset` (reset state ကို ပြန်ရှင်းပစ်တဲ့ function) ဆိုတဲ့ members တွေ ပါဝင်ပါတယ် — [useQueryErrorResetBoundary](/docs/tanstack-query/use-query-error-reset-boundary) ကို ကြည့်ပါ။

## Returns

`Element` — `children` ကို မူရင်းအတိုင်း render လုပ်ပြီး — `children` က function ဆိုရင်တော့ boundary ရဲ့ `QueryErrorResetBoundaryValue` နဲ့ ခေါ်ပေးပါတယ်။

## ဥပမာများ

ပုံမှန် pattern — `reset` ကို error boundary ရဲ့ `onReset` မှာ ထည့်ပြီး "Try again" button ကနေ error state ရှင်းလိုက်တာနဲ့ query တွေ ပြန် run စေခြင်း:

```tsx
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <button onClick={() => resetErrorBoundary()}>Try again</button>
            </div>
          )}
        >
          <Page />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

Suspense mode မှာ error တွေက အနီးဆုံး error boundary ဆီ ရောက်သွားပြီး — retry လုပ်တဲ့အခါ ဒီ component က ဘယ်လို ပြန်လည် ချိန်ညှိပေးလဲဆိုတာ [Suspense guide ရဲ့ Resetting Error Boundaries section](/docs/tanstack-query/suspense) မှာ ဆက်ဖတ်ပါ။
