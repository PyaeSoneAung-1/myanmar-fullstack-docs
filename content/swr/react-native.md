---
title: "React Native"
description: "SWR ကို React Native app တွေမှာ သုံးခြင်း — browser ရဲ့ focus/online events တွေအစား React Native ရဲ့ app state detection နဲ့ native API တွေကို သုံးဖို့ isOnline, isVisible, initFocus, initReconnect တွေကို customize လုပ်နည်း"
order: 22
source: "https://swr.vercel.app/docs/advanced/react-native"
status: translated
updated: 2026-09-01
---

> **မှတ်ချက်:** ဒီ customization ကို အသုံးပြုဖို့ နောက်ဆုံး version (≥ 1.0.0) ကို upgrade လုပ်ထားပါ။

Browser တွေထဲမှာ လည်ပတ်တဲ့ React နဲ့ မတူဘဲ — React Native က လုံးဝ ကွဲပြားတဲ့ user experience တစ်ခု ရှိပါတယ်။ ဥပမာ — "tab focus" ဆိုတာ မရှိပါဘူး။ background ကနေ app ကို ပြန်ပြောင်းတာကိုပဲ "focus" အဖြစ် သတ်မှတ်ပါတယ်။ ဒီအပြုအမူတွေကို customize လုပ်ဖို့ — default browser ရဲ့ `focus` နဲ့ `online` event listeners တွေအစား React Native ရဲ့ app state detection နဲ့ တခြား native ported API တွေကို အစားထိုး သုံးပြီး — SWR ကို အဲဒါတွေ သုံးအောင် configure လုပ်နိုင်ပါတယ်။

## ဥပမာ (Example)

### Global Setup

သင့် app ကို `SWRConfig` အောက်မှာ wrap လုပ်ပြီး — configuration အားလုံးကို အဲဒီမှာ ကြိုတင် သတ်မှတ်ထားနိုင်ပါတယ်:

```jsx
<SWRConfig
  value={{
    /* ... */
  }}
>
  <App>
</SWRConfig>
```

### `focus` နဲ့ `reconnect` Events တွေကို customize လုပ်ခြင်း

သတိထား စီစဉ်ရမယ့် configuration တချို့ ရှိပါတယ် — `isOnline`, `isVisible`, `initFocus` နဲ့ `initReconnect` တို့ပါ။

`isOnline` နဲ့ `isVisible` တွေက boolean ပြန်ပေးတဲ့ functions တွေဖြစ်ပြီး — application က "active" ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ သုံးပါတယ်။ Default အားဖြင့် — ဒီအခြေအနေတွေ မပြည့်မီ SWR က revalidation ကို ရပ်ထားပါလိမ့်မယ်။

`initFocus` နဲ့ `initReconnect` တွေကို သုံးတဲ့အခါ — [custom cache provider](/docs/swr/cache) တစ်ခုကိုလည်း တွဲဖက် စနစ်ထည့်သွင်းဖို့ လိုအပ်ပါတယ်။ Empty `Map()` (သို့) သင်နှစ်သက်တဲ့ ဘယ် storage ကိုမဆို သုံးနိုင်ပါတယ်:

```jsx
<SWRConfig
  value={{
    provider: () => new Map(),
    isOnline() {
      /* Customize the network state detector */
      return true
    },
    isVisible() {
      /* Customize the visibility state detector */
      return true
    },
    initFocus(callback) {
      /* Register the listener with your state provider */
    },
    initReconnect(callback) {
      /* Register the listener with your state provider */
    }
  }}
>
  <App />
</SWRConfig>
```

`initFocus` ကို ဥပမာအဖြစ် ကြည့်ကြရအောင်:

```jsx
import { AppState } from 'react-native'

// ...

<SWRConfig
  value={{
    provider: () => new Map(),
    isVisible: () => { return true },
    initFocus(callback) {
      let appState = AppState.currentState

      const onAppStateChange = (nextAppState) => {
        /* If it's resuming from background or inactive mode to active one */
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          callback()
        }
        appState = nextAppState
      }

      // Subscribe to the app state change events
      const subscription = AppState.addEventListener('change', onAppStateChange)

      return () => {
        subscription.remove()
      }
    }
  }}
>
  <App>
</SWRConfig>
```

`initReconnect` အတွက်ကတော့ — [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo) လို third-party libraries တချို့ လိုအပ်ပြီး — network status ကို subscribe လုပ်ဖို့ သုံးပါတယ်။ အကောင်အထည်ဖော်ပုံက အပေါ်က ဥပမာနဲ့ ဆင်ပါတယ် — `callback` function တစ်ခုကို လက်ခံပြီး — network က offline ကနေ ပြန်ကောင်းလာတဲ့အခါ trigger လုပ်ပါတယ်။ အဲဒါဆိုရင် SWR က revalidation ကို စတင်ပြီး — သင့် data တွေကို up-to-date ဖြစ်အောင် ထိန်းသိမ်းပေးပါလိမ့်မယ်။
