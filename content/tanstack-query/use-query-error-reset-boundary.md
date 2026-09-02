---
title: "useQueryErrorResetBoundary (Query errors ကို reset လုပ်ရန် hook)"
description: "useQueryErrorResetBoundary ရဲ့ Returns — အနီးဆုံး QueryErrorResetBoundary အတွင်းက query errors တွေကို reset လုပ်ပေးတဲ့ hook; boundary မရှိရင် global အနေနဲ့ reset လုပ်"
order: 53
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQueryErrorResetBoundary"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useQueryErrorResetBoundary(): QueryErrorResetBoundaryValue;
```

ဒီ hook က — အနီးဆုံး [QueryErrorResetBoundary](/docs/tanstack-query/query-error-reset-boundary) ရဲ့ အတွင်းမှာရှိတဲ့ query errors တွေ အားလုံးကို reset လုပ်ပေးပါတယ်။ Boundary တစ်ခုမှ မသတ်မှတ်ထားရင် — global အနေနဲ့ reset လုပ်ပေးပါတယ်။

[QueryErrorResetBoundary](/docs/tanstack-query/query-error-reset-boundary) component ရဲ့ render prop pattern ကို မသုံးချင်ဘဲ — hook ကနေ တိုက်ရိုက် `reset` ကို ယူပြီး error boundary တစ်ခုနဲ့ တွဲသုံးချင်တဲ့အခါ ဒီ hook ကို သုံးပါတယ်။ `suspense`/`throwOnError` သုံးတဲ့ queries တွေမှာ error တစ်ခု ဖြစ်ပြီးနောက် "နောက်တစ်ခါ ပြန်ကြိုးစားမယ်" ဆိုတာကို queries တွေ သိစေဖို့ — error retry pattern အပြည့်အစုံကို [Suspense guide](/docs/tanstack-query/suspense) မှာ ကြည့်ပါ။

## Returns

`QueryErrorResetBoundaryValue` — အနီးဆုံး boundary ရဲ့ value:

| Member | အဓိပ္ပာယ် |
|---|---|
| `reset` | `() => void` — boundary ထဲက query errors တွေကို reset လုပ်ပြီး — queries တွေ နောက်တစ်ခါ ပြန်ကြိုးစားနိုင်အောင် လုပ်ပေးတယ် |
| `isReset` | `() => boolean` — boundary က reset ဖြစ်ခဲ့လားဆိုတာ စစ်ပေးတယ် |
| `clearReset` | `() => void` — reset state ကို ရှင်းပစ်လို့ — boundary နောက်တစ်ခါ reset ပြန်မဖြစ်မချင်း queries တွေ ပြန်ကြိုးစားမှာ မဟုတ်တော့ဘူး |

## ဥပမာများ

`reset` ကို error boundary ရဲ့ `onReset` မှာ ထည့်ပြီး — error ဖြစ်သွားတဲ့ UI ကနေ ပြန်လည် ကြိုးစားနိုင်အောင် လုပ်ခြင်း:

```tsx
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

function App({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <button onClick={() => resetErrorBoundary()}>Try again</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
```
