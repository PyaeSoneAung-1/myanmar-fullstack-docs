---
title: "Migrating to React Query 4 (React Query 4 သို့ ပြောင်းရွှေ့ခြင်း)"
description: "react-query → @tanstack/react-query သို့ ပြောင်းလဲခြင်း, query keys array ဖြစ်ရန်, idle state ဖယ်ရှားခြင်း, networkMode, useQueries API အသစ်, codemods စသည့် breaking changes များနဲ့ React 18 support စတဲ့ feature အသစ်များ"
order: 68
source: "https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-4"
status: translated
updated: 2026-09-02
---

## Breaking Changes (ပြောင်းရွှေ့စဉ် သတိထားရမည့် အပြောင်းအလဲများ)

v4 က major version တစ်ခု ဖြစ်လို့ — သတိထားရမယ့် breaking changes တချို့ ရှိပါတယ်:

### `react-query` က အခု `@tanstack/react-query` ဖြစ်သွားပြီ

Dependencies တွေကို uninstall/install လုပ်ပြီး — imports တွေ ပြောင်းဖို့ လိုပါလိမ့်မယ်:

```
npm uninstall react-query
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

```tsx
- import { useQuery } from 'react-query' // [!code --]
- import { ReactQueryDevtools } from 'react-query/devtools' // [!code --]

+ import { useQuery } from '@tanstack/react-query' // [!code ++]
+ import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // [!code ++]
```

#### Codemod

Import migration ကို ပိုလွယ်ကူစေဖို့ — v4 မှာ codemod တစ်ခု ပါဝင်ပါတယ်။

> Codemod က breaking change ကို migrate လုပ်ဖို့ ကူညီဖို့ အကောင်းဆုံး ကြိုးစားမှု (best efforts) တစ်ခုပါ။ ထုတ်ပေးလိုက်တဲ့ code ကို သေချာ ပြန်သုံးသပ်ပါ! ဒါ့အပြင် — codemod က ရှာမတွေ့နိုင်တဲ့ edge cases တွေလည်း ရှိတာမို့ — log output ကို သေချာ စောင့်ကြည့်ပါ။

အောက်ပါ command တစ်ခု (ဒါမှမဟုတ် နှစ်ခုလုံး) ကို သုံးပြီး အလွယ်တကူ အသုံးချနိုင်ပါတယ်:

`.js` ဒါမှမဟုတ် `.jsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

`.ts` ဒါမှမဟုတ် `.tsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

`TypeScript` ရဲ့ ကိစ္စမှာ parser အဖြစ် `tsx` ကို သုံးဖို့ သတိပြုပါ — မဟုတ်ရင် codemod ကို ကောင်းကောင်း အသုံးချနိုင်မှာ မဟုတ်ပါဘူး!

**မှတ်ချက်:** Codemod ကို အသုံးချလိုက်ရင် သင့် code ရဲ့ formatting တွေ ပျက်စီးသွားနိုင်လို့ — codemod ကို အသုံးချပြီးနောက် `prettier` နဲ့/ဒါမှမဟုတ် `eslint` ကို run ဖို့ မမေ့ပါနဲ့!

**မှတ်ချက်:** Codemod က imports တွေကိုပဲ ပြောင်းပေးမှာ ဖြစ်လို့ — devtools package သီးခြားကိုတော့ သင်ကိုယ်တိုင် manual အနေနဲ့ install လုပ်ရဦးမှာ ဖြစ်ပါတယ်။

### Query Keys (နဲ့ Mutation Keys) တွေက Array ဖြစ်ရပါမယ်

v3 မှာ Query နဲ့ Mutation Keys တွေက String ဒါမှမဟုတ် Array ဖြစ်နိုင်ပါတယ်။ အတွင်းပိုင်းမှာတော့ React Query က Array Keys တွေနဲ့ပဲ အမြဲ အလုပ်လုပ်ခဲ့ပြီး — တစ်ခါတလေ ဒါကို consumers တွေဆီလည်း ပေါ်ထွက်စေခဲ့ပါတယ်။ ဥပမာ — [Default Query Functions](/docs/tanstack-query/default-query-function) တွေနဲ့ အလုပ်လုပ်ရတာ လွယ်ကူစေဖို့ — `queryFn` ထဲမှာ key ကို Array အနေနဲ့ အမြဲ ရခဲ့ပါတယ်။

ဒါပေမယ့် — ဒီ concept ကို APIs အားလုံးဆီ မသယ်ဆောင်ခဲ့ပါဘူး။ ဥပမာ — [Query Filters](/docs/tanstack-query/filters) တွေပေါ်မှာ `predicate` function ကို သုံးတဲ့အခါ raw Query Key ကို ရပါတယ်။ ဒါက — Arrays နဲ့ Strings တွေ ရောထွေးနေတဲ့ Query Keys တွေကို သုံးရင် — အဲဒီလို functions တွေနဲ့ အလုပ်လုပ်ရတာ ခက်ခဲစေပါတယ်။ Global callbacks တွေ သုံးတဲ့အခါမှာလည်း အလားတူပါပဲ။

APIs အားလုံးကို ရိုးရှင်းစေဖို့ — keys တွေအားလုံးကို Arrays တွေပဲ ဖြစ်အောင် လုပ်ဖို့ ဆုံးဖြတ်လိုက်ပါတယ်:

```tsx
;-useQuery('todos', fetchTodos) + // [!code --]
  useQuery(['todos'], fetchTodos) // [!code ++]
```

#### Codemod

ဒီ migration ကို ပိုလွယ်ကူစေဖို့ — codemod တစ်ခု ပို့ပေးဖို့ ဆုံးဖြတ်လိုက်ပါတယ်။

> Codemod က breaking change ကို migrate လုပ်ဖို့ ကူညီဖို့ အကောင်းဆုံး ကြိုးစားမှု (best efforts) တစ်ခုပါ။ ထုတ်ပေးလိုက်တဲ့ code ကို သေချာ ပြန်သုံးသပ်ပါ! ဒါ့အပြင် — codemod က ရှာမတွေ့နိုင်တဲ့ edge cases တွေလည်း ရှိတာမို့ — log output ကို သေချာ စောင့်ကြည့်ပါ။

အောက်ပါ command တစ်ခု (ဒါမှမဟုတ် နှစ်ခုလုံး) ကို သုံးပြီး အလွယ်တကူ အသုံးချနိုင်ပါတယ်:

`.js` ဒါမှမဟုတ် `.jsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

`.ts` ဒါမှမဟုတ် `.tsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

`TypeScript` ရဲ့ ကိစ္စမှာ parser အဖြစ် `tsx` ကို သုံးဖို့ သတိပြုပါ — မဟုတ်ရင် codemod ကို ကောင်းကောင်း အသုံးချနိုင်မှာ မဟုတ်ပါဘူး!

**မှတ်ချက်:** Codemod ကို အသုံးချလိုက်ရင် သင့် code ရဲ့ formatting တွေ ပျက်စီးသွားနိုင်လို့ — codemod ကို အသုံးချပြီးနောက် `prettier` နဲ့/ဒါမှမဟုတ် `eslint` ကို run ဖို့ မမေ့ပါနဲ့!

### `idle` state ကို ဖယ်ရှားလိုက်ပြီ

Offline support ပိုကောင်းစေဖို့ [fetchStatus](/docs/tanstack-query/queries) အသစ် စတင်မိတ်ဆက်တာနဲ့အတူ — `idle` state က အဓိပ္ပာယ် မရှိတော့ပါဘူး — ဘာလို့လဲဆိုတော့ `fetchStatus: 'idle'` က အဲဒီ state ကို ပိုကောင်းအောင် ဖမ်းယူနိုင်လို့ပါ။ အသေးစိတ်အတွက် — [Why two different states](/docs/tanstack-query/queries) ကို ဖတ်ပါ။

ဒါက အဓိကအားဖြင့် — `data` မရှိသေးတဲ့ `disabled` queries တွေကို သက်ရောက်ပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒါတွေက အရင်က `idle` state ထဲမှာ ရှိခဲ့လို့ပါ:

```tsx
- status: 'idle' // [!code --]
+ status: 'loading'  // [!code ++]
+ fetchStatus: 'idle' // [!code ++]
```

ပြီးတော့ — [dependent queries ဆိုင်ရာ guide](/docs/tanstack-query/dependent-queries) ကိုလည်း ကြည့်ပါ

#### Disabled queries

ဒီပြောင်းလဲမှုကြောင့် — disabled queries တွေ (ယာယီ disable လုပ်ထားတဲ့ဟာတွေတောင်) က `loading` state ကနေ စတင်ပါလိမ့်မယ်။ Migration ပိုလွယ်ကူစေဖို့ — အထူးသဖြင့် loading spinner ဘယ်အချိန် ပြရမလဲဆိုတာ သိဖို့ flag ကောင်းတစ်ခု ရှိစေဖို့ — `isLoading` အစား `isInitialLoading` ကို စစ်ဆေးနိုင်ပါတယ်:

```tsx
;-isLoading + // [!code --]
  isInitialLoading // [!code ++]
```

[disabling queries ဆိုင်ရာ guide](/docs/tanstack-query/disabling-queries) ကိုလည်း ကြည့်ပါ

### `useQueries` အတွက် API အသစ်

`useQueries` hook က အခု — `queries` prop ပါဝင်တဲ့ object တစ်ခုကို input အနေနဲ့ လက်ခံပါတယ်။ `queries` prop ရဲ့ value က queries တွေရဲ့ array တစ်ခု ဖြစ်ပြီး — (ဒီ array က v3 မှာ `useQueries` ဆီ ပို့ခဲ့တာနဲ့ တူညီပါတယ်)။

```tsx
;-useQueries([
  { queryKey1, queryFn1, options1 },
  { queryKey2, queryFn2, options2 },
]) + // [!code --]
  useQueries({
    queries: [
      { queryKey1, queryFn1, options1 },
      { queryKey2, queryFn2, options2 },
    ],
  }) // [!code ++]
```

### `undefined` က successful queries တွေအတွက် cache value အဖြစ် တရားဝင် မဟုတ်တော့ပါဘူး

`undefined` ပြန်ပို့ပြီး updates တွေကနေ bail out လုပ်နိုင်စေဖို့ — `undefined` ကို cache value အဖြစ် တရားဝင် မဟုတ်အောင် လုပ်ရပါတယ်။ ဒါက react-query ရဲ့ အခြား concepts တွေနဲ့လည်း ညီညွတ်ပါတယ် — ဥပမာ — [initialData function](/docs/tanstack-query/initial-query-data#initial-data-function) ကနေ `undefined` ပြန်ပို့ရင်လည်း data ကို သတ်မှတ်မှာ မဟုတ်ပါဘူး။

ဒါ့အပြင် — queryFn ထဲမှာ logging ထည့်လိုက်လို့ `Promise<void>` ဖြစ်သွားတာမျိုးက ဖြစ်လွယ်တဲ့ bug တစ်ခုပါ:

```tsx
useQuery(['key'], () =>
  axios.get(url).then((result) => console.log(result.data)),
)
```

ဒါကို အခု type level မှာ တားမြစ်ထားပြီး — runtime မှာ `undefined` က _failed Promise_ အဖြစ် ပြောင်းလဲသွားမှာ ဖြစ်ပြီး — ဆိုလိုတာက error တစ်ခု ရမှာ ဖြစ်ကာ — development mode မှာ console ပေါ်ကိုလည်း log တက်မှာ ဖြစ်ပါတယ်။

### Queries နဲ့ mutations တွေက default အနေနဲ့ run ဖို့ network connection လိုအပ်ပါတယ်

Online/offline support အကြောင်း — [New Features ကြေညာချက်](#proper-offline-support) ကို ဖတ်ပါ — ပြီးတော့ [Network mode](/docs/tanstack-query/network-mode) အကြောင်း သီးသန့် page ကိုလည်း ဖတ်ပါ

React Query က Promise တစ်ခု ထုတ်ပေးနိုင်တဲ့ ဘာကိုမဆို သုံးလို့ရတဲ့ Async State Manager တစ်ခု ဖြစ်ပေမယ့် — data fetching libraries တွေနဲ့ တွဲပြီး data fetching အတွက် အသုံးအများဆုံး ဖြစ်ပါတယ်။ အဲဒါကြောင့် — default အနေနဲ့ network connection မရှိရင် queries နဲ့ mutations တွေက `paused` ဖြစ်နေမှာ ဖြစ်ပါတယ်။ အရင်က အပြုအမူကို ပြန်လိုချင်ရင် — queries နဲ့ mutations နှစ်ခုလုံးအတွက် `networkMode: offlineFirst` ကို global အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

```tsx
new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})
```

### `notifyOnChangeProps` property က `"tracked"` ကို value အဖြစ် လက်မခံတော့ပါဘူး

`notifyOnChangeProps` option က `"tracked"` value ကို လက်မခံတော့ပါဘူး။ အဲဒီအစား — `useQuery` က properties တွေကို tracking လုပ်တာ default ဖြစ်သွားပါပြီ။ `notifyOnChangeProps: "tracked"` သုံးထားတဲ့ queries အားလုံးကို — ဒီ option ကို ဖယ်ရှားပြီး update လုပ်သင့်ပါတယ်။

ဘယ် queries မှာမဆို — query ပြောင်းလဲတိုင်း re-render ဖြစ်စေမယ့် v3 ရဲ့ default အပြုအမူကို အတုယူဖို့ ဒီ optimization ကို ကျော်လိုချင်ရင် — `notifyOnChangeProps` က အခု `"all"` value ကို လက်ခံပြီး default smart tracking optimization ကနေ opt-out လုပ်နိုင်ပါတယ်။

### `notifyOnChangePropsExclusion` ကို ဖယ်ရှားလိုက်ပြီ

v4 မှာ `notifyOnChangeProps` က v3 ရဲ့ `"tracked"` အပြုအမူကို `undefined` အစား default အနေနဲ့ သုံးပါတယ်။ အခု `"tracked"` က v4 ရဲ့ default အပြုအမူ ဖြစ်သွားတာမို့ — ဒီ config option ကို ထည့်ထားဖို့ အဓိပ္ပာယ် မရှိတော့ပါဘူး။

### `cancelRefetch` အတွက် တစ်သမတ်တည်း အပြုအမူ

`cancelRefetch` option ကို — query တစ်ခုကို imperative အနေနဲ့ fetch လုပ်တဲ့ functions တွေ အားလုံးဆီ ပို့နိုင်ပါတယ်:

- `queryClient.refetchQueries`
- `queryClient.invalidateQueries`
- `queryClient.resetQueries`
- `useQuery` ကနေ ပြန်လာတဲ့ `refetch`
- `useInfiniteQuery` ကနေ ပြန်လာတဲ့ `fetchNextPage` နဲ့ `fetchPreviousPage`

`fetchNextPage` နဲ့ `fetchPreviousPage` ကလွဲလို့ — ဒီ flag က `false` ကို default ထားခဲ့ပြီး — ဒါက တစ်သမတ်တည်း မဟုတ်ဘဲ ပြဿနာ ဖြစ်စေနိုင်ခဲ့ပါတယ်: mutation တစ်ခုပြီးနောက် `refetchQueries` ဒါမှမဟုတ် `invalidateQueries` ကို ခေါ်ရင် — အရင်က နှေးကွေးတဲ့ fetch တစ်ခု လုပ်ဆောင်နေပြီးသား ဆိုရင် — အဲဒီ refetch ကို skip လုပ်ခဲ့လို့ — နောက်ဆုံး result ကို မရနိုင်ဘဲ ဖြစ်နေနိုင်ပါတယ်။

သင်ရေးတဲ့ code တစ်ခုခုက query တစ်ခုကို တက်ကြွစွာ refetch လုပ်နေတယ်ဆိုရင် — fetch ကို default အနေနဲ့ ပြန်စသင့်တယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

အဲဒါကြောင့် — ဒီ flag က အခု အပေါ်က method တွေ အားလုံးအတွက် default အနေနဲ့ _true_ ဖြစ်ပါတယ်။ ဒါက ဆိုလိုတာက — `refetchQueries` ကို await မလုပ်ဘဲ နှစ်ခါ ဆက်တိုက် ခေါ်လိုက်ရင် — ပထမ fetch ကို cancel လုပ်ပြီး ဒုတိယတစ်ခုနဲ့ ပြန်စမှာ ဖြစ်ပါတယ်:

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will abort the previous refetch and start a new fetch
queryClient.refetchQueries({ queryKey: ['todos'] })
```

ဒီအပြုအမူကနေ opt-out လုပ်ချင်ရင် `cancelRefetch:false` ကို ရှင်းရှင်းလင်းလင်း ပို့နိုင်ပါတယ်:

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will not abort the previous refetch - it will just be ignored
queryClient.refetchQueries({ queryKey: ['todos'] }, { cancelRefetch: false })
```

> **မှတ်ချက်:** အလိုအလျောက် trigger ဖြစ်တဲ့ fetches တွေမှာတော့ — ဥပမာ query တစ်ခု mount ဖြစ်လို့ ဒါမှမဟုတ် window focus refetch ကြောင့် — အပြုအမူ ပြောင်းလဲမှု မရှိပါဘူး။

### Query Filters

[Query filter](/docs/tanstack-query/filters) တစ်ခုက — query တစ်ခုကို ကိုက်ညီစေဖို့ သတ်မှတ်ချက်တချို့ ပါဝင်တဲ့ object တစ်ခုပါ။ သမိုင်းကြောင်းအရ — filter options တွေက boolean flags တွေရဲ့ ပေါင်းစပ်မှု အများစု ဖြစ်ခဲ့ပါတယ်။ ဒါပေမယ့် — အဲဒီ flags တွေကို ပေါင်းစပ်လိုက်ရင် မဖြစ်နိုင်တဲ့ states တွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။ အထူးသဖြင့်:

```
active?: boolean
  - When set to true it will match active queries.
  - When set to false it will match inactive queries.
inactive?: boolean
  - When set to true it will match inactive queries.
  - When set to false it will match active queries.
```

ဒီ flags တွေက — တစ်ခုနဲ့တစ်ခု သီးသန့်ခွဲထားလို့ (mutually exclusive) — အတူတူ သုံးတဲ့အခါ ကောင်းကောင်း အလုပ်မလုပ်ပါဘူး။ Flags နှစ်ခုလုံးကို `false` လို့ သတ်မှတ်လိုက်ရင် — ဖော်ပြချက်အရဆိုရင် queries အားလုံးကို match လုပ်နိုင်သလို — queries တစ်ခုမှ မလုပ်တာမျိုးလည်း ဖြစ်နိုင်ပြီး — ဒါက အဓိပ္ပာယ် သိပ်မရှိလှပါဘူး။

v4 နဲ့အတူ — ဒီ filters တွေကို ရည်ရွယ်ချက်ကို ပိုကောင်းအောင် ဖော်ပြနိုင်ဖို့ — filter တစ်ခုတည်းအဖြစ် ပေါင်းစည်းလိုက်ပါတယ်:

```tsx
- active?: boolean // [!code --]
- inactive?: boolean // [!code --]
+ type?: 'active' | 'inactive' | 'all' // [!code ++]
```

Filter က `all` ကို default ထားပြီး — သင်က `active` ဒါမှမဟုတ် `inactive` queries တွေကိုပဲ match လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။

#### refetchActive / refetchInactive

[queryClient.invalidateQueries](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientinvalidatequeries) မှာ — အလားတူ နောက်ထပ် flags နှစ်ခု ရှိခဲ့ပါတယ်:

```
refetchActive: Boolean
  - Defaults to true
  - When set to false, queries that match the refetch predicate and are actively being rendered
    via useQuery and friends will NOT be refetched in the background, and only marked as invalid.
refetchInactive: Boolean
  - Defaults to false
  - When set to true, queries that match the refetch predicate and are not being rendered
    via useQuery and friends will be both marked as invalid and also refetched in the background
```

အလားတူ အကြောင်းပြချက်နဲ့ပဲ — ဒါတွေကိုလည်း ပေါင်းစည်းလိုက်ပါတယ်:

```tsx
- refetchActive?: boolean // [!code --]
- refetchInactive?: boolean // [!code --]
+ refetchType?: 'active' | 'inactive' | 'all' | 'none' // [!code ++]
```

ဒီ flag က `refetchActive` က `true` ကို default ထားခဲ့လို့ — `active` ကို default ထားပါတယ်။ ဒါက ဆိုလိုတာက — `invalidateQueries` ကို လုံးဝ refetch မလုပ်စေဖို့ ပြောဖို့လည်း နည်းလမ်းတစ်ခု လိုအပ်တာမို့ — စတုတ္ထ option (`none`) ကိုပါ ဒီမှာ ခွင့်ပြုထားတာ ဖြစ်ပါတယ်။

### `setQueryData` ကနေ `onSuccess` ကို ခေါ်တော့မှာ မဟုတ်ပါဘူး

ဒါက လူအများစုအတွက် ရှုပ်ထွေးစေခဲ့ပြီး — `onSuccess` ထဲကနေ `setQueryData` ခေါ်ရင် infinite loops တွေလည်း ဖန်တီးခဲ့ပါတယ်။ `staleTime` နဲ့ တွဲသုံးတဲ့အခါ error ဖြစ်စေတတ်တဲ့ အရင်းအမြစ်တစ်ခုလည်း ဖြစ်ခဲ့ပါတယ် — ဘာလို့လဲဆိုတော့ data ကို cache ကနေပဲ ဖတ်ခဲ့ရင် `onSuccess` က _မခေါ်_ တော့လို့ပါ။

`onError` နဲ့ `onSettled` တွေလိုပဲ — `onSuccess` callback က အခု request တစ်ခု ပြုလုပ်တာနဲ့ ချိတ်ဆက်နေပါတယ်။ Request မရှိရင် — callback မရှိပါဘူး။

`data` field ရဲ့ ပြောင်းလဲမှုတွေကို နားထောင်ချင်ရင် — `data` က dependency Array ထဲ ပါဝင်တဲ့ `useEffect` တစ်ခုနဲ့ အကောင်းဆုံး လုပ်နိုင်ပါတယ်။ React Query က structural sharing ကနေတစ်ဆင့် stable data တွေကို သေချာစေတာမို့ — effect က background refetch တိုင်းမှာ run မှာ မဟုတ်ဘဲ — data ထဲက တစ်ခုခု ပြောင်းလဲမှသာ run ပါလိမ့်မယ်:

```
const { data } = useQuery({ queryKey, queryFn })
React.useEffect(() => mySideEffectHere(data), [data])
```

### `persistQueryClient` နဲ့ သက်ဆိုင်တဲ့ persister plugins တွေက experimental မဟုတ်တော့ဘဲ အမည်ပြောင်းလိုက်ပြီ

`createWebStoragePersistor` နဲ့ `createAsyncStoragePersistor` plugins တွေကို [`createSyncStoragePersister`](https://tanstack.com/query/latest/docs/framework/react/plugins/createSyncStoragePersister) နဲ့ [`createAsyncStoragePersister`](https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister) တွေအဖြစ် အမည်ပြောင်းလိုက်ပါပြီ။ `persistQueryClient` ထဲက `Persistor` interface ကိုလည်း `Persister` လို့ အမည်ပြောင်းလိုက်ပါတယ်။ ဒီပြောင်းလဲမှုရဲ့ နောက်ကွယ်က အကြောင်းရင်းအတွက် — [ဒီ stackexchange thread](https://english.stackexchange.com/questions/206893/persister-or-persistor) ကို ကြည့်ပါ။

ဒီ plugins တွေက experimental မဟုတ်တော့တာမို့ — သူတို့ရဲ့ import paths တွေကိုလည်း update လုပ်ထားပါတယ်:

```tsx
- import { persistQueryClient } from 'react-query/persistQueryClient-experimental' // [!code --]
- import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental' // [!code --]
- import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental' // [!code --]

+ import { persistQueryClient } from '@tanstack/react-query-persist-client' // [!code ++]
+ import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister' // [!code ++]
+ import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'  // [!code ++]
```

### Promises ပေါ်က `cancel` method ကို ထောက်ပံ့တော့မှာ မဟုတ်ပါဘူး

အရင် `cancel` method (promises တွေပေါ်မှာ `cancel` function တစ်ခု define လုပ်ခွင့်ပေးပြီး — library က query cancellation ကို ပံ့ပိုးဖို့ သုံးခဲ့တာ) ကို ဖယ်ရှားလိုက်ပါပြီ။ Query cancellation အတွက် — အတွင်းပိုင်းမှာ [`AbortController` API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ကို သုံးပြီး — query cancellation ကို ပံ့ပိုးဖို့ သင့် query function ထဲမှာ [`AbortSignal` instance](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) တစ်ခုကို ပေးတဲ့ — [API အသစ်](/docs/tanstack-query/query-cancellation) (v3.30.0 နဲ့ စတင်မိတ်ဆက်) ကို သုံးဖို့ အကြံပြုပါတယ်။

### TypeScript

Types တွေက အခု TypeScript v4.1 ဒါမှမဟုတ် အဲဒီထက် ပိုမြင့်တာတွေ လိုအပ်ပါတယ်။

### ပံ့ပိုးထားတဲ့ Browsers

v4 ကစပြီး — React Query က modern browsers တွေအတွက် optimize လုပ်ထားပါတယ်။ ပိုပြီး modern, performant ဖြစ်ပြီး သေးငယ်တဲ့ bundle ထုတ်လုပ်နိုင်ဖို့ — browserslist ကို update လုပ်ထားပါတယ်။ လိုအပ်ချက်တွေကို [ဒီမှာ](/docs/tanstack-query/installation) ဖတ်နိုင်ပါတယ်။

### `setLogger` ကို ဖယ်ရှားလိုက်ပြီ

`setLogger` ကို ခေါ်ပြီး — logger ကို global အနေနဲ့ ပြောင်းလဲနိုင်ခဲ့ပါတယ်။ v4 မှာ — အဲဒီ function ကို `QueryClient` တစ်ခု ဖန်တီးတဲ့အခါ optional field တစ်ခုနဲ့ အစားထိုးလိုက်ပါတယ်။

```tsx
- import { QueryClient, setLogger } from 'react-query'; // [!code --]
+ import { QueryClient } from '@tanstack/react-query'; // [!code ++]

- setLogger(customLogger) // [!code --]
- const queryClient = new QueryClient(); // [!code --]
+ const queryClient = new QueryClient({ logger: customLogger }) // [!code ++]
```

### Server-side မှာ default manual Garbage Collection မရှိတော့ပါဘူး

v3 မှာ React Query က query results တွေကို default အနေနဲ့ ၅ မိနစ် cache လုပ်ပြီး — နောက်ပိုင်း အဲဒီ data ကို manual garbage collect လုပ်ပါတယ်။ ဒီ default က server-side React Query မှာပါ သက်ရောက်ခဲ့ပါတယ်။

ဒါက memory သုံးစွဲမှု မြင့်မားစေပြီး — ဒီ manual garbage collection ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေတဲ့ processes တွေကို ပိတ်ဆို့စေခဲ့ပါတယ်။ v4 မှာ — default အနေနဲ့ server-side `cacheTime` ကို အခု `Infinity` လို့ သတ်မှတ်ထားပြီး — manual garbage collection ကို ထိရောက်စွာ disable လုပ်ထားပါတယ် (NodeJS process က request တစ်ခု ပြီးဆုံးတာနဲ့ အရာအားလုံးကို ရှင်းလင်းပစ်ပါတယ်)။

ဒီပြောင်းလဲမှုက — Next.js လို server-side React Query သုံးတဲ့သူတွေကိုပဲ သက်ရောက်ပါတယ်။ `cacheTime` တစ်ခုကို ကိုယ်တိုင် သတ်မှတ်ထားရင် — ဒါက သင့်ကို မသက်ရောက်ပါဘူး (အပြုအမူကို ထပ်တူဖြစ်အောင် လုပ်ချင်ရင်တော့ ပြုလုပ်နိုင်ပါတယ်)။

### Production မှာ Logging လုပ်ခြင်း

v4 ကစပြီး — react-query က production mode မှာ errors တွေ (ဥပမာ failed fetches) ကို console ထဲ log လုပ်တော့မှာ မဟုတ်ပါဘူး — ဒါက လူအများစုအတွက် ရှုပ်ထွေးစေခဲ့လို့ပါ။ Development mode မှာတော့ errors တွေ ဆက်ပြသနေဦးမှာ ဖြစ်ပါတယ်။

### ESM Support

React Query က အခု [package.json `"exports"`](https://nodejs.org/api/packages.html#exports) ကို ပံ့ပိုးပြီး — CommonJS ရော ESM အတွက်ပါ Node ရဲ့ native resolution နဲ့ အပြည့်အဝ တွဲဖက်နိုင်ပါတယ်။ ဒါက users အများစုအတွက် breaking change ဖြစ်မယ်လို့ မမျှော်လင့်ပါဘူး — ဒါပေမယ့် — သင့် project ထဲကို import လုပ်နိုင်တဲ့ files တွေကို — ကျွန်တော်တို့ official အနေနဲ့ ပံ့ပိုးတဲ့ entry points တွေပဲ ဖြစ်အောင် ကန့်သတ်လိုက်ပါတယ်။

### NotifyEvents တွေကို ရိုးရှင်းစေခြင်း (Streamlined NotifyEvents)

`QueryCache` ကို manual အနေနဲ့ subscribe လုပ်ရင် `QueryCacheNotifyEvent` တစ်ခုကို အမြဲ ရခဲ့ပေမယ့် — `MutationCache` အတွက်တော့ အဲဒီလို မဟုတ်ခဲ့ပါဘူး။ ဒီအပြုအမူကို ရိုးရှင်းစေပြီး — event names တွေကိုလည်း လိုက်လျောညီထွေ ဖြစ်အောင် ပြောင်းလိုက်ပါတယ်။

#### QueryCacheNotifyEvent

```tsx
- type: 'queryAdded' // [!code --]
+ type: 'added' // [!code ++]
- type: 'queryRemoved' // [!code --]
+ type: 'removed' // [!code ++]
- type: 'queryUpdated' // [!code --]
+ type: 'updated' // [!code ++]
```

#### MutationCacheNotifyEvent

`MutationCacheNotifyEvent` က `QueryCacheNotifyEvent` နဲ့ အတူတူ type တွေကို သုံးပါတယ်။

> **မှတ်ချက်:** ဒါက `queryCache.subscribe` ဒါမှမဟုတ် `mutationCache.subscribe` ကနေတစ်ဆင့် caches တွေကို manual အနေနဲ့ subscribe လုပ်မှသာ သက်ဆိုင်ပါတယ်။

### Hydration exports သီးခြားတွေကို ဖယ်ရှားလိုက်ပြီ

[3.22.0](https://github.com/TanStack/query/releases/tag/v3.22.0) version နဲ့အတူ — hydration utilities တွေ React Query core ထဲကို ရွှေ့သွားခဲ့ပါတယ်။ v3 မှာ `react-query/hydration` ကနေ အရင် exports တွေကို ဆက်သုံးနိုင်ခဲ့ပေမယ့် — v4 မှာ အဲဒီ exports တွေကို ဖယ်ရှားလိုက်ပါပြီ။

```tsx
- import { dehydrate, hydrate, useHydrate, Hydrate } from 'react-query/hydration' // [!code --]
+ import { dehydrate, hydrate, useHydrate, Hydrate } from '@tanstack/react-query' // [!code ++]
```

### `queryClient`, `query` နဲ့ `mutation` တို့မှ undocumented methods တွေကို ဖယ်ရှားလိုက်ပြီ

`QueryClient` ပေါ်က `cancelMutations` နဲ့ `executeMutation` methods တွေက — undocumented ဖြစ်ပြီး အတွင်းပိုင်းမှာလည်း မသုံးတော့လို့ — ဖယ်ရှားလိုက်ပါတယ်။ အဲဒါက `mutationCache` ပေါ်က method တစ်ခုရဲ့ wrapper တစ်ခုပဲ ဖြစ်ခဲ့လို့ — `executeMutation` ရဲ့ functionality ကို ဆက်သုံးနိုင်ပါသေးတယ်:

```tsx
- executeMutation< // [!code --]
-   TData = unknown, // [!code --]
-   TError = unknown, // [!code --]
-   TVariables = void, // [!code --]
-   TContext = unknown // [!code --]
- >( // [!code --]
-   options: MutationOptions<TData, TError, TVariables, TContext> // [!code --]
- ): Promise<TData> { // [!code --]
-   return this.mutationCache.build(this, options).execute() // [!code --]
- } // [!code --]
```

ဒါ့အပြင် — `query.setDefaultOptions` ကိုလည်း မသုံးတော့လို့ ဖယ်ရှားပြီး — `mutation.cancel` ကတော့ outgoing request ကို တကယ် cancel မလုပ်ခဲ့လို့ ဖယ်ရှားလိုက်ပါတယ်။

### `src/react` directory ကို `src/reactjs` လို့ အမည်ပြောင်းလိုက်ပြီ

အရင်က React Query မှာ — `react` module ကနေ import လုပ်တဲ့ `react` ဆိုတဲ့ directory တစ်ခု ရှိခဲ့ပါတယ်။ ဒါက Jest configurations တချို့နဲ့ ပြဿနာတက်စေနိုင်ပြီး — tests တွေ run တဲ့အခါ ဒီလို errors တွေ ဖြစ်စေနိုင်ခဲ့ပါတယ်:

```
TypeError: Cannot read property 'createContext' of undefined
```

Directory ကို အမည်ပြောင်းလိုက်တာနဲ့ — ဒါ ပြဿနာ မဟုတ်တော့ပါဘူး။

သင့် project ထဲမှာ `'react-query'` ကနေ မဟုတ်ဘဲ `'react-query/react'` ကနေ တစ်ခုခုကို import လုပ်နေတယ်ဆိုရင် — imports တွေကို update လုပ်ဖို့ လိုပါမယ်:

```tsx
- import { QueryClientProvider } from 'react-query/react'; // [!code --]
+ import { QueryClientProvider } from '@tanstack/react-query/reactjs'; // [!code ++]
```

## Feature အသစ်များ (New Features) 🚀

v4 မှာ feature အသစ်တွေ အစုံအလင် ပါဝင်ပါတယ်:

### React 18 Support

React 18 ကို ဒီနှစ် အစောပိုင်းမှာ ဖြန့်ချိခဲ့ပြီး — v4 မှာ ၎င်းအတွက် first class support ရှိပြီး — ၎င်းနဲ့အတူ ပါလာတဲ့ concurrent features အသစ်တွေကိုပါ ပံ့ပိုးပါတယ်။

### Offline support အပြည့်အဝ (Proper offline support)

v3 မှာ React Query က queries နဲ့ mutations တွေကို အမြဲ fire လုပ်ပြီးမှ — retry လုပ်ချင်ရင် internet နဲ့ ချိတ်ဆက်ထားဖို့ လိုတယ်လို့ ယူဆခဲ့ပါတယ်။ ဒါက ရှုပ်ထွေးစေတဲ့ အခြေအနေများစွာ ဖြစ်စေခဲ့ပါတယ်:

- သင်က offline ဖြစ်ပြီး query တစ်ခုကို mount လုပ်လိုက်ရင် — loading state ထဲ ရောက်ပြီး request က မအောင်မြင်ကာ — တကယ်တော့ fetching မလုပ်နေပေမယ့် — online ပြန်ဖြစ်သည်အထိ loading state ထဲမှာပဲ ရှိနေခဲ့တယ်
- အလားတူ — သင်က offline ဖြစ်ပြီး retries တွေ ပိတ်ထားရင် — query က fire လုပ်ပြီး မအောင်မြင်ကာ — error state ထဲ ရောက်သွားမယ်
- သင်က offline ဖြစ်ပြီး network connection မလိုအပ်တဲ့ query တစ်ခုကို fire လုပ်ချင်ရင် (ဘာလို့လဲဆိုတော့ React Query ကို data fetching ကလွဲလို့ တခြားအရာတွေအတွက်ပါ သုံးလို့ရလို့) — ဒါပေမယ့် တခြားအကြောင်းတစ်ခုခုကြောင့် မအောင်မြင်ခဲ့ရင် — အဲဒီ query က online ပြန်ဖြစ်သည်အထိ paused ဖြစ်နေမယ်
- Window focus refetching က သင်က offline ဖြစ်နေရင် ဘာမှ မလုပ်ပေးခဲ့ဘူး

v4 မှာ — React Query က ဒီပြဿနာတွေ အားလုံးကို ဖြေရှင်းဖို့ `networkMode` အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ အသေးစိတ်အတွက် [Network mode](/docs/tanstack-query/network-mode) အကြောင်း သီးသန့် page ကို ဖတ်ပါ။

### Default အနေနဲ့ Tracked Queries

React Query က query properties တွေကို "tracking" လုပ်တာ default ဖြစ်ပြီး — render optimization မှာ ကောင်းမွန်တဲ့ တိုးတက်မှုတစ်ခု ပေးသင့်ပါတယ်။ ဒီ feature က [v3.6.0](https://github.com/TanStack/query/releases/tag/v3.6.0) ကတည်းက ရှိခဲ့ပြီး — v4 မှာ default အပြုအမူ ဖြစ်လာပါတယ်။

### setQueryData နဲ့ updates တွေကနေ bail out လုပ်ခြင်း

[setQueryData ရဲ့ functional updater form](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata) ကို သုံးတဲ့အခါ — `undefined` ပြန်ပို့ပြီး update ကနေ bail out လုပ်နိုင်ပါပြီ။ `previousValue` အနေနဲ့ `undefined` ပေးထားရင် — ဆိုလိုတာက လောလောဆယ် cached entry မရှိဘူး၊ သင်က ဖန်တီးချင်လည်း မရဘူး (todo တစ်ခုကို toggle လုပ်တဲ့ ဥပမာထဲမှာ ပြထားသလို) ဆိုရင် — အသုံးဝင်ပါတယ်:

```tsx
queryClient.setQueryData(['todo', id], (previousTodo) =>
  previousTodo ? { ...previousTodo, done: true } : undefined,
)
```

### Mutation Cache Garbage Collection

Mutations တွေကိုလည်း queries တွေလိုပဲ — အခု အလိုအလျောက် garbage collect လုပ်နိုင်ပါပြီ။ Mutations တွေအတွက် default `cacheTime` ကိုလည်း ၅ မိနစ်လို့ သတ်မှတ်ထားပါတယ်။

### Providers အများအပြားအတွက် Custom Contexts

Hooks တွေကို ၎င်းတို့နဲ့ ကိုက်ညီတဲ့ `Provider` တွေနဲ့ တွဲချိတ်ဖို့ — custom contexts တွေကို အခု သတ်မှတ်နိုင်ပါပြီ။ Component tree ထဲမှာ React Query `Provider` instance တွေ အများအပြား ရှိနိုင်ပြီး — သင့် hook က မှန်ကန်တဲ့ `Provider` instance ကို သုံးကြောင်း သေချာစေဖို့ လိုအပ်တဲ့အခါ — ဒါက အရေးကြီးပါတယ်။

ဥပမာတစ်ခု:

1. Data package တစ်ခု ဖန်တီးပါ။

```tsx
// Our first data package: @my-scope/container-data

const context = React.createContext<QueryClient | undefined>(undefined)
const queryClient = new QueryClient()

export const useUser = () => {
  return useQuery(USER_KEY, USER_FETCHER, {
    context,
  })
}

export const ContainerDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient} context={context}>
      {children}
    </QueryClientProvider>
  )
}
```

2. ဒုတိယ data package တစ်ခု ဖန်တီးပါ။

```tsx
// Our second data package: @my-scope/my-component-data

const context = React.createContext<QueryClient | undefined>(undefined)
const queryClient = new QueryClient()

export const useItems = () => {
  return useQuery(ITEMS_KEY, ITEMS_FETCHER, {
    context,
  })
}

export const MyComponentDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient} context={context}>
      {children}
    </QueryClientProvider>
  )
}
```

3. ဒီ data package နှစ်ခုကို သင့် application ထဲမှာ သုံးပါ။

```tsx
// Our application

import { ContainerDataProvider, useUser } from "@my-scope/container-data";
import { AppDataProvider } from "@my-scope/app-data";
import { MyComponentDataProvider, useItems } from "@my-scope/my-component-data";

<ContainerDataProvider> // <-- Provides container data (like "user") using its own React Query provider
  ...
  <AppDataProvider> // <-- Provides app data using its own React Query provider (unused in this example)
    ...
      <MyComponentDataProvider> // <-- Provides component data (like "items") using its own React Query provider
        <MyComponent />
      </MyComponentDataProvider>
    ...
  </AppDataProvider>
  ...
</ContainerDataProvider>

// Example of hooks provided by the "DataProvider" components above:
const MyComponent = () => {
  const user = useUser() // <-- Uses the context specified in ContainerDataProvider.
  const items = useItems() // <-- Uses the context specified in MyComponentDataProvider
  ...
}
```
