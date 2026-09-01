---
title: "Window Focus Refetching (Window Focus ပြန်ရောက်တဲ့အခါ Refetch)"
description: "User က app ဆီ ပြန်ရောက်တဲ့အခါ stale query တွေကို background မှာ အလိုအလျောက် refetch လုပ်ခြင်း — refetchOnWindowFocus, custom window focus events, React Native focus management"
order: 26
source: "https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching"
status: translated
updated: 2026-09-01
---

User က သင့် application ကနေ ထွက်သွားပြီး ပြန်လာပြီး — query data က stale ဖြစ်နေရင် — **TanStack Query က သင့်အတွက် data အသစ်ကို နောက်ခံမှာ အလိုအလျောက် တောင်းယူပေးပါတယ်**။ ဒါကို `refetchOnWindowFocus` option သုံးပြီး globally ရော per-query ပါ disable လုပ်နိုင်ပါတယ်:

#### Globally Disable လုပ်ခြင်း

```tsx
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

#### Per-Query Disable လုပ်ခြင်း

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
})
```

## Custom Window Focus Event

ရှားပါးတဲ့ အခြေအနေတွေမှာ — TanStack Query ကို revalidate လုပ်စေမယ့် ကိုယ်ပိုင် window focus events တွေကို စီမံချင်တာ ဖြစ်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — TanStack Query က `focusManager.setEventListener` function တစ်ခု ထောက်ပံ့ပေးပါတယ် — ဒါက window ကို focus လုပ်တဲ့အခါ ဖြစ်ပွားစေချင်တဲ့ callback ကို သင့်ဆီ ထောက်ပံ့ပေးပြီး — ကိုယ်ပိုင် events တွေ setup လုပ်ခွင့် ပေးပါတယ်။ `focusManager.setEventListener` ကို ခေါ်လိုက်တာနဲ့ — အရင်က သတ်မှတ်ထားတဲ့ handler ကို ဖယ်ရှားပြီး (များသောအားဖြင့် ဒါက default handler ဖြစ်ပါတယ်) — သင့် handler အသစ်ကို အစားထိုး သုံးပါတယ်။ ဥပမာ — ဒီဟာက default handler ပါ:

```tsx
focusManager.setEventListener((handleFocus) => {
  // visibilitychange ကို နားထောင်ပါ
  if (typeof window !== 'undefined' && window.addEventListener) {
    const visibilitychangeHandler = () => {
      handleFocus(document.visibilityState === 'visible')
    }
    window.addEventListener('visibilitychange', visibilitychangeHandler, false)
    return () => {
      // Handler အသစ် သတ်မှတ်ရင် unsubscribe လုပ်ဖို့ သေချာပါစေ
      window.removeEventListener('visibilitychange', visibilitychangeHandler)
    }
  }
})
```

## React Native မှာ Focus စီမံခန့်ခွဲခြင်း

`window` ပေါ်က event listeners တွေ အစား — React Native က [`AppState` module](https://reactnative.dev/docs/appstate#app-states) ကနေတစ်ဆင့် focus အချက်အလက်တွေကို ထောက်ပံ့ပေးပါတယ်။ App state က "active" အဖြစ် ပြောင်းတဲ့အခါ update တစ်ခု trigger လုပ်ဖို့ — `AppState` ရဲ့ "change" event ကို သုံးနိုင်ပါတယ်:

```tsx
import { AppState } from 'react-native'
import { focusManager } from '@tanstack/react-query'

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange)

  return () => subscription.remove()
}, [])
```

## Focus state စီမံခန့်ခွဲခြင်း

```tsx
import { focusManager } from '@tanstack/react-query'

// Default focus state ကို override လုပ်ပါ
focusManager.setFocused(true)

// Default focus check ဆီ ပြန်ကျသွားပါ
focusManager.setFocused(undefined)
```
