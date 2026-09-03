---
title: "catchError function (error boundary ဖြင့် error recovery ပြုလုပ်ခြင်း)"
description: "catchError() — error.js file convention ကို programmatic နည်းဖြင့် အစားထိုးပြီး children များကို error boundary အတွင်းတွင် wrap လုပ်ပေးသော component ဖန်တီးသည့် function; fallback function သို့ props နှင့် errorInfo (error, retry, reset) ပေးပို့ကာ Client Components တွေအတွင်း component-level error recovery ရရှိစေရန် အသုံးပြုပုံ"
order: 145
source: "https://nextjs.org/docs/app/api-reference/functions/catchError"
status: translated
updated: 2026-09-03
---

`catchError` function က — သူ့ရဲ့ children တွေကို error boundary တစ်ခုထဲမှာ wrap လုပ်ပေးမယ့် component တစ်ခုကို ဖန်တီးပေးပါတယ်။ ဒါက [`error.js`](/docs/nextjs/file-conventions-error) file convention ရဲ့ programmatic (code နဲ့ ချိန်ညှိခြင်း) အစားထိုးနည်းလမ်းတစ်ခုကို ပေးစွမ်းပြီး — သင့် component tree ထဲက ဘယ်နေရာမှာမဆို component-level error recovery (component အဆင့် error ပြန်လည် ကိုင်တွယ်ခြင်း) ကို လုပ်ဆောင်နိုင်စေပါတယ်။

Custom React error boundary တစ်ခုနဲ့ ယှဉ်ကြည့်ရင် — `catchError` က Next.js နဲ့ out of the box (ဘာမှ ထပ်ပြင်စရာမလိုဘဲ) အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်:

- **Built-in error recovery (ပါဝင်ပြီးသား error ပြန်လည်ရယူနိုင်မှု)** — [`retry()`](/docs/nextjs/file-conventions-error) က page ကို [Transition](https://react.dev/reference/react/startTransition) တစ်ခုအတွင်းမှာ ပြန် render လုပ်ပြီး — error boundary ရဲ့ အပြင်ဘက်က Client Components state တွေကို ထိန်းသိမ်းပေးပါတယ်။
- **Framework-aware integration (framework နဲ့ လိုက်လျောညီထွေတဲ့ ပေါင်းစပ်မှု)** — `redirect()` နဲ့ `notFound()` လိုမျိုး APIs တွေက နောက်ကွယ်မှာ special errors တွေကို throw လုပ်ပြီး အလုပ်လုပ်ပါတယ်။ `catchError` က ဒါတွေကို ချောမွေ့စွာ ကိုင်တွယ်ပေးလို့ — သင့် error boundary က ဒါတွေကို မတော်တဆ catch လုပ်မိမှာ မဟုတ်ပါဘူး။
- **Client navigation handling (client navigation ကိုင်တွယ်မှု)** — မတူညီတဲ့ route တစ်ခုဆီ client navigation လုပ်လိုက်တဲ့အခါ error state က အလိုအလျောက် ရှင်းသွားပါတယ်။

`catchError` ကို [Client Components](/docs/nextjs/server-client-components) တွေကနေ ခေါ်နိုင်ပါတယ်။

```tsx filename="app/custom-error-boundary.tsx" switcher
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

```jsx filename="app/custom-error-boundary.js" switcher
'use client'

import { catchError } from 'next/error'

function ErrorFallback(props, { error, retry }) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

## Reference

### Parameters

`catchError` က argument တစ်ခုတည်းကို လက်ခံပါတယ်:

```ts
const ErrorWrapper = catchError(fallback)
```

#### `fallback`

Error တစ်ခုကို catch လိုက်တဲ့အခါ error UI ကို render လုပ်ပေးမယ့် function တစ်ခုပါ။ ဒါက argument နှစ်ခုကို လက်ခံပါတယ်:

- `props` — wrapper component ဆီ ပို့လိုက်တဲ့ props တွေ (`children` ကလွဲလို့)။
- `errorInfo` — error အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခု:

| Property | Type                                                                                        | Description                                                                     |
| -------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `error`  | [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) | Catch လုပ်လိုက်တဲ့ error instance။                                              |
| `retry`  | `() => void`                                                                                | Error boundary ရဲ့ children တွေကို ပြန် fetch ပြီး ပြန် render လုပ်ပေးပါတယ်။ အောင်မြင်ခဲ့ရင် — fallback ကို ပြန် render ထားတဲ့ ရလဒ်နဲ့ အစားထိုးပါတယ်။ |
| `reset`  | `() => void`                                                                                | Error state ကို ရှင်းလင်းပြီး — ပြန် fetch မလုပ်ဘဲ ပြန် render လုပ်ပါတယ်။ အများစုမှာ [`retry()`](/docs/nextjs/file-conventions-error) ကို သုံးပါ။ |

`fallback` function က Client Component တစ်ခု (သို့) `'use client'` module တစ်ခုထဲမှာ သတ်မှတ်ထားတဲ့ဟာ ဖြစ်ရပါမယ်။

### Returns

`catchError` က React component တစ်ခုကို ပြန်ပေးပါတယ် — ၎င်းက:

- သင့် fallback ရဲ့ ပထမ argument က လက်ခံတဲ့ props တွေကို `children` နဲ့အတူ လက်ခံပါတယ်။
- `children` တွေကို error boundary တစ်ခုထဲမှာ wrap လုပ်ပေးပါတယ်။
- `children` ထဲမှာ error တစ်ခု catch ဖြစ်တဲ့အခါ `fallback` ကို render လုပ်ပါတယ်။

## ဥပမာများ

### အခြေခံ အသုံးပြုပုံ (Basic usage)

Fallback တစ်ခုကို သတ်မှတ်ပြီး — ပြန်ရလာတဲ့ component ကို သင့် UI ရဲ့ အစိတ်အပိုင်းတွေကို wrap လုပ်ဖို့ သုံးပါ:

```tsx filename="app/some-component.tsx" switcher
import ErrorWrapper from '../custom-error-boundary'

export default function Component({ children }: { children: React.ReactNode }) {
  return <ErrorWrapper title="Dashboard Error">{children}</ErrorWrapper>
}
```

```jsx filename="app/some-component.js" switcher
import ErrorWrapper from '../custom-error-boundary'

export default function Component({ children }) {
  return <ErrorWrapper title="Dashboard Error">{children}</ErrorWrapper>
}
```

### Error တွေကနေ ပြန်လည် ကောင်းမွန်လာအောင် လုပ်ခြင်း (Recovering from errors)

Error ကနေ ပြန်လည် ကောင်းမွန်လာအောင် လုပ်ဖို့ user ကို တောင်းဆိုရာမှာ `retry()` ကို သုံးပါ။ ဒါကို ခေါ်လိုက်တဲ့အခါ function က error boundary ရဲ့ children တွေကို ပြန် fetch လုပ်ပြီး ပြန် render လုပ်ပါတယ်။ အောင်မြင်ခဲ့ရင် — fallback ကို ပြန် render ထားတဲ့ ရလဒ်နဲ့ အစားထိုးပါတယ်။

အများစုမှာ `reset()` အစား `retry()` ကို သုံးပါ။ `reset()` function က error state ကိုပဲ ရှင်းလင်းပြီး — ပြန် fetch မလုပ်ဘဲ ပြန် render လုပ်တာမို့ — Server Component errors တွေကနေ ပြန်လည် ကောင်းမွန်လာအောင် မလုပ်နိုင်ပါဘူး။

```tsx filename="app/custom-error-boundary.tsx" switcher
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: {}, { error, retry, reset }: ErrorInfo) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

```jsx filename="app/custom-error-boundary.js" switcher
'use client'

import { catchError } from 'next/error'

function ErrorFallback(props, { error, retry, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

### Server မှာ render လုပ်ထားတဲ့ error fallback (Server-rendered error fallback)

Server မှာ render လုပ်ထားတဲ့ content တွေကို prop တစ်ခုအနေနဲ့ ထည့်ပေးပြီး — data ပေါ်မူတည်တဲ့ fallback UI တွေကို ပြသနိုင်ပါတယ်။ ဒါက Server Component တစ်ခုကို `React.ReactNode` prop တစ်ခုအနေနဲ့ render လုပ်ခြင်းအားဖြင့် အလုပ်လုပ်ပါတယ် — error တစ်ခု catch ဖြစ်တဲ့အခါ fallback က ဒါကို ပြသပေးပါတယ်။

> **သိထားသင့်သည်:** ဒီ pattern က — error မဖြစ်တဲ့အခါမှာတောင် — page render တိုင်းမှာ fallback ကို စောစောစီးစီး (eagerly) render လုပ်ပါတယ်။ Use case အများစုအတွက်တော့ ပိုရိုးရှင်းတဲ့ client-side fallback တစ်ခုက လုံလောက်ပါတယ်။

```tsx filename="app/error-boundary.tsx" switcher
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(
  props: { fallback: React.ReactNode },
  errorInfo: ErrorInfo
) {
  return props.fallback
}

export default catchError(ErrorFallback)
```

```jsx filename="app/error-boundary.js" switcher
'use client'

import { catchError } from 'next/error'

function ErrorFallback(props, errorInfo) {
  return props.fallback
}

export default catchError(ErrorFallback)
```

```tsx filename="app/some-component.tsx" switcher
import ErrorBoundary from '../error-boundary'

async function ErrorFallback() {
  const data = await getData()
  return <div>{data.message}</div>
}

export default function Component({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
}
```

```jsx filename="app/some-component.js" switcher
import ErrorBoundary from '../error-boundary'

async function ErrorFallback() {
  const data = await getData()
  return <div>{data.message}</div>
}

export default function Component({ children }) {
  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
}
```

> **သိထားသင့်သည်:**
>
> - Route segments တွေကို scope လုပ်ထားတဲ့ `error.js` file convention နဲ့ မတူဘဲ — `catchError` ကို component-level error recovery ရရှိဖို့ သင့် component tree ရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို wrap လုပ်ဖို့ သုံးနိုင်ပါတယ်။
> - Wrapper component ဆီ ပို့လိုက်တဲ့ props တွေကို fallback function ဆီ ဆက်ပို့ပေးလို့ — configuration အမျိုးမျိုးနဲ့ ပြန်သုံးလို့ရတဲ့ (reusable) error UIs တွေကို လွယ်ကူစွာ ဖန်တီးနိုင်ပါတယ်။
> - `error.js` ရဲ့ default exports တွေကို `catchError` နဲ့ wrap လုပ်ဖို့ မလိုပါဘူး။ [`error.js`](/docs/nextjs/file-conventions-error) file convention က — Next.js က ထောက်ပံ့ပေးထားတဲ့ built-in error boundary တစ်ခုထဲမှာ ကိုယ်တိုင် render လုပ်နေပြီးသားပါ။

## Version History

| Version   | အပြောင်းအလဲ                  |
| --------- | ------------------------------ |
| `v16.3.0` | `catchError` က stable (တည်ငြိမ်) ဖြစ်လာ။ |
| `v16.2.0` | `unstable_catchError` ကို စတင် မိတ်ဆက်။ |
