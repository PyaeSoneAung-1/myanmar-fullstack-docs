---
title: "React Native (React Native တွင် အသုံးပြုခြင်း)"
description: "TanStack Query ကို React Native မှာ သုံးနည်း — DevTools options များ, online status စီမံခန့်ခွဲမှု (onlineManager), app/screen focus ပေါ်လိုက် refetch (focusManager, useFocusEffect), out-of-focus screens တွေမှာ queries ပိတ်နည်း (subscribed)"
order: 62
source: "https://tanstack.com/query/latest/docs/framework/react/react-native"
status: translated
updated: 2026-09-02
---

React Query က React Native နဲ့ out of the box (ဘာ configure မှ မလိုဘဲ) အလုပ်လုပ်ဖို့ design လုပ်ထားပါတယ်။

## DevTools ပံ့ပိုးမှု (DevTools Support)

React Native DevTools integration အတွက် ရွေးစရာ အများအပြား ရှိပါတယ်:

1. **Rozenite Plugin** — [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) သုံးသူတွေအတွက် 3rd party plugin တစ်ခု: https://www.rozenite.dev/docs/official-plugins/tanstack-query

2. **Native macOS App** — js-based application တစ်ခုခုမှာ React Query ကို debug လုပ်ဖို့ 3rd party app တစ်ခု:
   https://github.com/LovesWorking/rn-better-dev-tools

3. **Flipper Plugin** — Flipper သုံးသူတွေအတွက် 3rd party plugin တစ်ခု:
   https://github.com/bgaleotti/react-query-native-devtools

4. **Reactotron Plugin** — Reactotron သုံးသူတွေအတွက် 3rd party plugin တစ်ခု:
   https://github.com/hsndmr/reactotron-react-query

## Online status စီမံခန့်ခွဲမှု (Online Status Management)

React Query က browser web မှာ reconnect ဖြစ်တဲ့အခါ auto refetch ကို ထောက်ပံ့ပြီးသားပါ။ React Native မှာ ဒီအပြုအမူ ထည့်ဖို့ဆိုရင် — အောက်က ဥပမာမှာ ပြထားသလို React Query ရဲ့ `onlineManager` ကို သုံးရပါမယ်:

```tsx
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})
```

သို့မဟုတ်

```tsx
import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'

onlineManager.setEventListener((setOnline) => {
  let initialised = false

  const eventSubscription = Network.addNetworkStateListener((state) => {
    initialised = true
    setOnline(!!state.isConnected)
  })

  Network.getNetworkStateAsync()
    .then((state) => {
      if (!initialised) {
        setOnline(!!state.isConnected)
      }
    })
    .catch(() => {
      // getNetworkStateAsync can reject on some platforms/SDK versions
    })

  return eventSubscription.remove
})
```

## App focus ဖြစ်တဲ့အခါ Refetch (Refetch on App Focus)

`window` ပေါ်က event listeners တွေအစား — React Native က focus information တွေကို [`AppState` module](https://reactnative.dev/docs/appstate#app-states) ကနေ ပေးပါတယ်။ App state က "active" ဖြစ်သွားတဲ့အခါ update တစ်ခု trigger ဖြစ်အောင် `AppState` ရဲ့ "change" event ကို သုံးနိုင်ပါတယ်:

```tsx
import { useEffect } from 'react'
import { AppState, Platform } from 'react-native'
import type { AppStateStatus } from 'react-native'
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

## Screen focus ဖြစ်တဲ့အခါ Refresh (Refresh on Screen Focus)

တချို့အခြေအနေတွေမှာ — React Native Screen တစ်ခုကို ပြန် focus လုပ်တဲ့အခါ query ကို refetch လုပ်စေချင်နိုင်ပါတယ်။ အောက်က custom hook က screen ကို ပြန် focus လုပ်တိုင်း — **active ဖြစ်နေတဲ့ stale queries အားလုံး** ကို refetch လုပ်ပေးပါလိမ့်မယ်။

```tsx
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'

export function useRefreshOnFocus() {
  const queryClient = useQueryClient()
  const firstTimeRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        queryKey: ['posts'],
        stale: true,
        type: 'active',
      })
    }, [queryClient]),
  )
}
```

အပေါ်က code မှာ — ပထမဆုံး focus (screen ကို ကနဦး mount လုပ်ချိန်) ကို ကျော်လိုက်တာပါ — `useFocusEffect` က mount ဖြစ်ချိန်မှာရော screen focus ဖြစ်ချိန်မှာပါ callback ကို ခေါ်လို့ပါ။

## Focus မရှိတဲ့ screens တွေမှာ queries ပိတ်ခြင်း (Disable Queries on Out of Focus Screens)

Screen တစ်ခုက focus ပြင်ထွက်သွားချိန်မှာ တချို့ queries တွေ "live" ဖြစ်နေတာ မလိုချင်ဘူးဆိုရင် — useQuery ပေါ်က `subscribed` prop ကို သုံးနိုင်ပါတယ်။ ဒီ prop က query တစ်ခုက updates တွေကို subscribe လုပ်ထားမလား ဆိုတာကို ထိန်းချုပ်ပေးပါတယ်။ React Navigation ရဲ့ `useIsFocused` နဲ့ တွဲသုံးလိုက်ရင် — screen က focus မဖြစ်တဲ့အချိန်မှာ queries တွေကနေ ချောမွေ့စွာ unsubscribe လုပ်နိုင်ပါတယ်:

ဥပမာ သုံးပုံ:

```tsx
import React from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Text } from 'react-native'

function MyComponent() {
  const isFocused = useIsFocused()

  const { dataUpdatedAt } = useQuery({
    queryKey: ['key'],
    queryFn: () => fetch(...),
    subscribed: isFocused,
  })

  return <Text>DataUpdatedAt: {dataUpdatedAt}</Text>
}
```

`subscribed` က `false` ဖြစ်နေချိန်မှာ — query က updates တွေကနေ unsubscribe လုပ်ပြီး — အဲဒီ screen အတွက် re-renders ဒါမှမဟုတ် data အသစ် fetch တွေ ဖြစ်စေမှာ မဟုတ်ပါဘူး။ နောက်တစ်ခါ `true` ပြန်ဖြစ်တာနဲ့ (ဥပမာ — screen က focus ပြန်ရတဲ့အခါ) — query က re-subscribe လုပ်ပြီး up to date ဖြစ်နေစေမှာ ဖြစ်ပါတယ်။
