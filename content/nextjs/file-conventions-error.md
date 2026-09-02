---
title: "error.js (မမျှော်လင့်ထားတဲ့ runtime errors တွေအတွက် UI)"
description: "error.js file convention — route segment တစ်ခုအတွင်း မမျှော်လင့်ထားတဲ့ runtime errors တွေ ဖြစ်ပေါ်လာတဲ့အခါ fallback UI ပြသပေးတဲ့ special file; error, retry, reset props နဲ့ global-error.js အကြောင်း"
order: 30
source: "https://nextjs.org/docs/app/api-reference/file-conventions/error"
status: translated
updated: 2026-09-02
---

**error** file က မမျှော်လင့်ထားတဲ့ runtime errors တွေကို ကိုင်တွယ်ပြီး — fallback UI တစ်ခု ပြသပေးဖို့ ခွင့်ပြုပါတယ်။

```tsx
// app/dashboard/error.tsx
'use client' // Error boundaries တွေက Client Components ဖြစ်ရမယ်

import { useEffect } from 'react'

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Error ကို error reporting service တစ်ခုဆီ log လုပ်ပါ
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Segment ကို ပြန် fetch လုပ်ပြီး ပြန် render လုပ်ခြင်းဖြင့် ပြန်လည်ထူထောင်ဖို့ ကြိုးစားပါ
          () => retry()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

`error.js` က route segment တစ်ခုနဲ့ သူ့ရဲ့ nested children တွေကို [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) အတွင်းမှာ wrap လုပ်ပါတယ်။ Boundary အတွင်းမှာ error တစ်ခု throw ဖြစ်သွားတဲ့အခါ — `error` component က fallback UI အဖြစ် ပြသလာပါတယ်။

> **သိထားသင့်သည်:**
>
> - [React DevTools](https://react.dev/learn/react-developer-tools) တွေက error boundaries တွေကို toggle လုပ်ပြီး — error states (error အခြေအနေများ) တွေကို စမ်းသပ်ကြည့်ဖို့ ခွင့်ပြုပါတယ်။
> - Errors တွေကို parent error boundary ဆီ အပေါ်ကို ပြန့်တက်စေချင်ရင် (bubble up) — `error` component ကို render လုပ်နေချိန်မှာ `throw` လုပ်နိုင်ပါတယ်။
> - Route segments တွေနဲ့ ချိတ်ဆက်ထားတဲ့ [`error.js`](https://nextjs.org/docs/app/api-reference/file-conventions/error) လိုမျိုး မဟုတ်ဘဲ — component-level error recovery (component တစ်ခုချင်းစီအဆင့် error ပြန်လည် ကောင်းမွန်စေခြင်း) လိုအပ်တဲ့အခါ [`catchError`](https://nextjs.org/docs/app/api-reference/functions/catchError) function ကို သုံးပါ။

[Component hierarchy](/docs/nextjs/project-structure#component-hierarchy) အရ — `error.js` က `loading.js`, `not-found.js`, `page.js` နဲ့ nested `layout.js` files တွေကို React error boundary တစ်ခုအတွင်းမှာ wrap လုပ်ပါတယ်။ တူညီတဲ့ segment ထဲက ၎င်းအထက်က `layout.js` (သို့) `template.js` တွေကိုတော့ **wrap မလုပ်ပါဘူး**။ Root layout ထဲမှာ ဖြစ်တဲ့ errors တွေကို ကိုင်တွယ်ဖို့ — [`global-error.js`](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error) ကို သုံးပါ။

## Reference

### Props

#### `error`

`error.js` Client Component ဆီ forward လုပ်လိုက်တဲ့ [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) object တစ်ခုရဲ့ instance ပါ။

> **သိထားသင့်သည်:** Development ကာလအတွင်းမှာ client ဆီ forward လုပ်တဲ့ `Error` object က serialized ဖြစ်ပြီး — debugging ပိုလွယ်ကူအောင် မူရင်း error ရဲ့ `message` ကို ထည့်သွင်းပေးပါတယ်။ ဒါပေမယ့် — error ထဲမှာ ပါဝင်နိုင်တဲ့ ထိခိုက်နိုင်ခြေရှိသော (sensitive) အသေးစိတ် အချက်အလက်တွေ client ဆီ ပေါက်ကြားမှု မရှိအောင် **production မှာတော့ ဒီအပြုအမူက ကွဲပြားပါတယ်**။

#### `error.message`

- Client Components တွေကနေ forward လုပ်လာတဲ့ errors တွေက မူရင်း `Error` message ကို ပြသပါတယ်။
- Server Components တွေကနေ forward လုပ်လာတဲ့ errors တွေက identifier (အမှတ်အသား) တစ်ခုပါတဲ့ generic message (ယေဘုယျ message) တစ်ခုကို ပြသပါတယ်။ ဒါက sensitive အသေးစိတ်တွေ ပေါက်ကြားမှုကို ကာကွယ်ဖို့ပါ။ `errors.digest` အောက်က identifier ကို သုံးပြီး — သက်ဆိုင်ရာ server-side logs တွေနဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်။

#### `error.digest`

Throw လုပ်လိုက်တဲ့ error ကနေ အလိုအလျောက် ထုတ်ပေးလိုက်တဲ့ hash တစ်ခုပါ။ Server-side logs တွေထဲမှာ သက်ဆိုင်ရာ error နဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

#### `retry`

Error တစ်ခုရဲ့ အကြောင်းရင်းက တစ်ခါတစ်ရံ ယာယီသာ ဖြစ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — နောက်တစ်ကြိမ် ပြန်ကြိုးစားကြည့်ခြင်းက ပြဿနာကို ဖြေရှင်းပေးနိုင်ပါတယ်။

Error component တစ်ခုက `retry()` function ကို သုံးပြီး — error ကနေ ပြန်လည် သက်သာလာအောင် (recover) ကြိုးစားဖို့ user ကို တိုက်တွန်းနိုင်ပါတယ်။ Function ကို execute လုပ်လိုက်တဲ့အခါ — error boundary ရဲ့ children တွေကို ပြန် fetch လုပ်ပြီး ပြန် render လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ အောင်မြင်ခဲ့ရင် — fallback error component ကို re-render ရဲ့ ရလဒ်နဲ့ အစားထိုးလိုက်ပါတယ်။

```tsx
// app/dashboard/error.tsx
'use client' // Error boundaries တွေက Client Components ဖြစ်ရမယ်

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
```

#### `reset`

အများစုမှာ — [`retry()`](#retry) ကို အသုံးပြုသင့်ပါတယ်။ ဒါပေမယ့် — content တွေကို ပြန် fetch မလုပ်ဘဲ error state ကို ရှင်းလင်းပြီး error boundary ရဲ့ children တွေကို ပြန် render လုပ်ချင်တဲ့ တိကျတဲ့ အကြောင်းရင်း ရှိရင်တော့ `reset()` function ကို သုံးနိုင်ပါတယ်။

## ဥပမာများ

### Global Error (global-error.js)

သိပ်တော့ အဖြစ်များတာ မဟုတ်ပေမယ့် — root app directory ထဲမှာ တည်ရှိတဲ့ `global-error.jsx` file ကို သုံးပြီး root layout (သို့) template ထဲက errors တွေကိုလည်း ကိုင်တွယ်နိုင်ပါတယ် — [internationalization](/docs/nextjs/internationalization) ကို အသုံးပြုနေတဲ့အခါမှာတောင် ရပါတယ်။ Global error UI က သူ့ရဲ့ ကိုယ်ပိုင် `<html>` နဲ့ `<body>` tags တွေ၊ global styles, fonts (သို့) error page လိုအပ်တဲ့ အခြား dependencies တွေကို ကိုယ်တိုင် သတ်မှတ်ရပါမယ်။ ဒီ file က active ဖြစ်တဲ့အခါ — root layout (သို့) template ကို အစားထိုးလိုက်ပါတယ်။

> **သိထားသင့်သည်:** `global-error` နဲ့ built-in 500 page တွေက သူတို့ရဲ့ ကိုယ်ပိုင် document ကို render လုပ်ပြီး — သင့် global styles တွေ **မပါဝင်ပါဘူး**။ ဒါကြောင့် app-level theme toggle (class (သို့) `data-theme` attribute) က သူတို့ဆီ ရောက်ရှိမှာ မဟုတ်ပါဘူး။ Default UI က operating system ရဲ့ color scheme ကို လိုက်နာပါတယ်; သင့် app ရဲ့ theme နဲ့ ကိုက်ညီစေဖို့ — ကိုယ့်ကိုယ်ပိုင် `global-error` component အတွင်းမှာ ကိုယ်တိုင် သက်ရောက်ပေးပါ။

> **သိထားသင့်သည်:** Error boundaries တွေက [Client Components](/docs/nextjs/server-client-components) တွေ ဖြစ်ရပါမယ် — ဆိုလိုတာက [`metadata` နဲ့ `generateMetadata`](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) exports တွေကို `global-error.jsx` ထဲမှာ ထောက်ပံ့ပေးမှာ မဟုတ်ပါဘူး။ အခြားရွေးချယ်စရာအနေနဲ့ — React ရဲ့ [`<title>`](https://react.dev/reference/react-dom/components/title) component ကို သုံးနိုင်ပါတယ်။

```tsx
// app/global-error.tsx
'use client' // Error boundaries တွေက Client Components ဖြစ်ရမယ်

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error မှာ html နဲ့ body tags တွေ ပါဝင်ရမယ်
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
```

### Graceful error recovery (custom error boundary ဖြင့်)

Client ဘက်မှာ rendering မအောင်မြင်တဲ့အခါ — ပိုကောင်းတဲ့ user experience အတွက် နောက်ဆုံး သိထားရတဲ့ (last known) server-rendered UI ကို ပြသပေးတာက အသုံးဝင်ပါတယ်။

`GracefullyDegradingErrorBoundary` က custom error boundary တစ်ခုရဲ့ ဥပမာပါ — error မဖြစ်ပွားခင် လက်ရှိ HTML ကို ဖမ်းယူပြီး ထိန်းသိမ်းထားပါတယ်။ Rendering error တစ်ခု ဖြစ်လာခဲ့ရင် — ဖမ်းယူထားတဲ့ HTML ကို ပြန် render လုပ်ပြီး — user ကို အသိပေးဖို့ အမြဲမြင်နေရတဲ့ (persistent) notification bar တစ်ခုကို ပြသပါတယ်။

```tsx
// app/dashboard/error.tsx
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class GracefullyDegradingErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private contentRef: React.RefObject<HTMLDivElement | null>

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
    this.contentRef = React.createRef()
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // လက်ရှိ HTML content ကို hydration မလုပ်ဘဲ render လုပ်ပါ
      return (
        <>
          <div
            ref={this.contentRef}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: this.contentRef.current?.innerHTML || '',
            }}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white py-4 px-6 text-center">
            <p className="font-semibold">
              An error occurred during page rendering
            </p>
          </div>
        </>
      )
    }

    return <div ref={this.contentRef}>{this.props.children}</div>
  }
}

export default GracefullyDegradingErrorBoundary
```

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v16.3.0` | `retry` prop က stable ဖြစ်လာ |
| `v16.2.0` | `unstable_retry` prop ထည့်သွင်း |
| `v15.2.0` | Development မှာပါ `global-error` ကို ပြသလာ |
| `v13.1.0` | `global-error` စတင် မိတ်ဆက် |
| `v13.0.0` | `error` စတင် မိတ်ဆက် |

## Error handling အကြောင်း ထပ်လေ့လာရန်

- [Error Handling](/docs/nextjs/error-handling) — expected errors တွေကို ဘယ်လို ပြသမလဲ၊ uncaught exceptions တွေကို ဘယ်လို ကိုင်တွယ်မလဲ ဆိုတာ လေ့လာပါ
