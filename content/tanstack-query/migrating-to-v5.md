---
title: "Migrating to TanStack Query v5 (TanStack Query v5 သို့ ပြောင်းရွှေ့ခြင်း)"
description: "TanStack Query v4 ကနေ v5 သို့ ပြောင်းရွှေ့ရာမှာ သိထားရမယ့် breaking changes များနဲ့ feature အသစ်များ — object signature တစ်မျိုးတည်း, cacheTime → gcTime, loading → pending, placeholderData/keepPreviousData, maxPages, HydrationBoundary စသည်"
order: 69
source: "https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5"
status: translated
updated: 2026-09-02
---

## Breaking Changes (ပြောင်းရွှေ့စဉ် သတိထားရမည့် အပြောင်းအလဲများ)

v5 က major version တစ်ခု ဖြစ်လို့ — သတိထားရမယ့် breaking changes တချို့ ရှိပါတယ်:

### Signature တစ်မျိုးတည်းကိုသာ ပံ့ပိုးပါတယ် — object တစ်ခုတည်း

useQuery နဲ့ အခြား hooks တွေမှာ TypeScript overloads အများကြီး ရှိခဲ့ပါတယ် — function ကို ခေါ်ဆိုနိုင်တဲ့ နည်းလမ်း အမျိုးမျိုးကို ဆိုလိုတာပါ။ ဒါက type ပိုင်းမှာ maintain လုပ်ရခက်စေရုံတင် မကဘဲ — options တွေကို မှန်ကန်စွာ ဖန်တီးဖို့ — ပထမ နဲ့ ဒုတိယ parameter တွေက ဘယ် types တွေလဲဆိုတာ runtime check လုပ်ဖို့လည်း လိုအပ်ခဲ့ပါတယ်။

အခုတော့ object format ကိုပဲ ပံ့ပိုးပါတယ်။

```tsx
useQuery(key, fn, options) // [!code --]
useQuery({ queryKey, queryFn, ...options }) // [!code ++]
useInfiniteQuery(key, fn, options) // [!code --]
useInfiniteQuery({ queryKey, queryFn, ...options }) // [!code ++]
useMutation(fn, options) // [!code --]
useMutation({ mutationFn, ...options }) // [!code ++]
useIsFetching(key, filters) // [!code --]
useIsFetching({ queryKey, ...filters }) // [!code ++]
useIsMutating(key, filters) // [!code --]
useIsMutating({ mutationKey, ...filters }) // [!code ++]
```

```tsx
queryClient.isFetching(key, filters) // [!code --]
queryClient.isFetching({ queryKey, ...filters }) // [!code ++]
queryClient.getQueriesData(key, filters) // [!code --]
queryClient.getQueriesData({ queryKey, ...filters }) // [!code ++]
queryClient.setQueriesData(key, updater, filters, options) // [!code --]
queryClient.setQueriesData({ queryKey, ...filters }, updater, options) // [!code ++]
queryClient.removeQueries(key, filters) // [!code --]
queryClient.removeQueries({ queryKey, ...filters }) // [!code ++]
queryClient.resetQueries(key, filters, options) // [!code --]
queryClient.resetQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.cancelQueries(key, filters, options) // [!code --]
queryClient.cancelQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.invalidateQueries(key, filters, options) // [!code --]
queryClient.invalidateQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.refetchQueries(key, filters, options) // [!code --]
queryClient.refetchQueries({ queryKey, ...filters }, options) // [!code ++]
```

```tsx
queryCache.find(key, filters) // [!code --]
queryCache.find({ queryKey, ...filters }) // [!code ++]
queryCache.findAll(key, filters) // [!code --]
queryCache.findAll({ queryKey, ...filters }) // [!code ++]
```

### Imperative QueryClient methods

`queryClient.query` နဲ့ `queryClient.infiniteQuery` တွေ စတင်မိတ်ဆက်လာတာနဲ့အတူ — ဒီ methods တွေက deprecated ဖြစ်ပြီး v6 မှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။

v4 ဒါမှမဟုတ် အစောပိုင်း version တွေကနေ လာတယ်ဆိုရင်:

```tsx
queryClient.fetchQuery(key, fn, options) // [!code --]
queryClient.query({ queryKey: key, queryFn: fn, ...options }) // [!code ++]
queryClient.fetchInfiniteQuery(key, fn, options) // [!code --]
queryClient.infiniteQuery({
  queryKey: key,
  queryFn: fn,
  ...options,
}) // [!code ++]

queryClient.prefetchQuery(key, fn, options) // [!code --]
queryClient.query({ queryKey: key, queryFn: fn, ...options }).catch(noop) // [!code ++]

queryClient.prefetchInfiniteQuery(key, fn, options) // [!code --]
queryClient
  .infiniteQuery({ queryKey: key, queryFn: fn, ...options })
  .catch(noop) // [!code ++]

queryClient.ensureQueryData(key, options) // [!code --]
queryClient.query({ queryKey: key, ...options, staleTime: 'static' }) // [!code ++]

queryClient.ensureInfiniteQueryData(key, options) // [!code --]
queryClient.infiniteQuery({ queryKey: key, ...options, staleTime: 'static' }) // [!code ++]
```

အရင် v5 code တွေကို update လုပ်နေတယ်ဆိုရင် — single options object ကို ထိန်းထားတာကလွဲလို့ — အပေါ်ကအတိုင်းပဲ ဖြစ်ပါလိမ့်မယ်။

### `queryClient.getQueryData` က argument အဖြစ် queryKey ကိုပဲ လက်ခံပါတယ်

`queryClient.getQueryData` ရဲ့ argument ကို `queryKey` တစ်ခုတည်းပဲ လက်ခံအောင် ပြောင်းလိုက်ပါတယ်

```tsx
queryClient.getQueryData(queryKey, filters) // [!code --]
queryClient.getQueryData(queryKey) // [!code ++]
```

### `queryClient.getQueryState` က argument အဖြစ် queryKey ကိုပဲ လက်ခံပါတယ်

`queryClient.getQueryState` ရဲ့ argument ကို `queryKey` တစ်ခုတည်းပဲ လက်ခံအောင် ပြောင်းလိုက်ပါတယ်

```tsx
queryClient.getQueryState(queryKey, filters) // [!code --]
queryClient.getQueryState(queryKey) // [!code ++]
```

#### Codemod

Overloads တွေ ဖယ်ရှားတဲ့ migration ကို ပိုလွယ်ကူစေဖို့ — v5 မှာ codemod တစ်ခု ပါဝင်ပါတယ်။

> Codemod က breaking change ကို migrate လုပ်ဖို့ ကူညီဖို့ အကောင်းဆုံး ကြိုးစားမှု (best efforts) တစ်ခုပါ။ ထုတ်ပေးလိုက်တဲ့ code ကို သေချာ ပြန်သုံးသပ်ပါ! ဒါ့အပြင် — codemod က ရှာမတွေ့နိုင်တဲ့ edge cases တွေလည်း ရှိတာမို့ — log output ကို သေချာ စောင့်ကြည့်ပါ။

အောက်ပါ command တစ်ခု (ဒါမှမဟုတ် နှစ်ခုလုံး) ကို သုံးပြီး အလွယ်တကူ အသုံးချနိုင်ပါတယ်:

`.js` ဒါမှမဟုတ် `.jsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

`.ts` ဒါမှမဟုတ် `.tsx` files တွေမှာ run ချင်ရင် — အောက်က command ကို သုံးပါ:

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

`TypeScript` ရဲ့ ကိစ္စမှာ parser အဖြစ် `tsx` ကို သုံးဖို့ သတိပြုပါ — မဟုတ်ရင် codemod ကို ကောင်းကောင်း အသုံးချနိုင်မှာ မဟုတ်ပါဘူး!

**မှတ်ချက်:** Codemod ကို အသုံးချလိုက်ရင် သင့် code ရဲ့ formatting တွေ ပျက်စီးသွားနိုင်လို့ — codemod ကို အသုံးချပြီးနောက် `prettier` နဲ့/ဒါမှမဟုတ် `eslint` ကို run ဖို့ မမေ့ပါနဲ့!

Codemod ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ မှတ်စုတချို့:

- ယေဘုယျအားဖြင့် — ပထမ parameter က object expression ဖြစ်ပြီး "queryKey" ဒါမှမဟုတ် "mutationKey" property (ဘယ် hook/method call ကို transform လုပ်နေလဲပေါ် မူတည်ပြီး) ပါဝင်တဲ့ lucky case ကို ရှာဖွေပါတယ်။ အဲဒီလို ဖြစ်နေရင် — သင့် code က signature အသစ်နဲ့ ကိုက်ညီနေပြီမို့ — codemod က အဲဒါကို ထိတော့မှာ မဟုတ်ပါဘူး။ 🎉
- အပေါ်က အခြေအနေ ပြည့်စုံမှု မရှိရင် — codemod က ပထမ parameter က array expression လား၊ array expression တစ်ခုကို ရည်ညွှန်းတဲ့ identifier လားဆိုတာ စစ်ဆေးပါတယ်။ အဲဒီလို ဖြစ်နေရင် — codemod က အဲဒါကို object expression ထဲ ထည့်ပြီး — အဲဒါက ပထမ parameter ဖြစ်သွားပါမယ်။
- Object parameters တွေကို infer လုပ်လို့ရရင် — codemod က ရှိပြီးသား properties တွေကို အသစ်ဖန်တီးလိုက်တဲ့ဟာဆီ ကူးဖို့ ကြိုးစားပါလိမ့်မယ်။
- Codemod က အသုံးပြုမှုကို infer မလုပ်နိုင်ရင် — console ပေါ်မှာ message တစ်ခု ချန်ထားခဲ့ပါလိမ့်မယ်။ Message ထဲမှာ — အဲဒီအသုံးပြုမှုရဲ့ file name နဲ့ line number ပါဝင်ပါတယ်။ ဒီကိစ္စမှာ migration ကို ကိုယ်တိုင် လုပ်ဖို့ လိုပါတယ်။
- Transformation က error တစ်ခု ဖြစ်သွားရင်လည်း — console ပေါ်မှာ message တစ်ခု တွေ့ရပါလိမ့်မယ်။ ဒီ message က မမျှော်လင့်ထားတဲ့ အရာတစ်ခု ဖြစ်ခဲ့ကြောင်း အသိပေးတာမို့ — migration ကို ကိုယ်တိုင် လုပ်ဖို့ လိုပါတယ်။

### useQuery (နဲ့ QueryObserver) ပေါ်က Callbacks တွေကို ဖယ်ရှားလိုက်ပြီ

`onSuccess`, `onError` နဲ့ `onSettled` တွေကို Queries တွေကနေ ဖယ်ရှားလိုက်ပါပြီ။ Mutations တွေကတော့ မထိခိုက်ပါဘူး။ ဒီပြောင်းလဲမှုရဲ့ နောက်ကွယ်က အကြောင်းရင်းတွေနဲ့ အဲဒီအစား ဘာလုပ်ရမလဲဆိုတာအတွက် — [ဒီ RFC](https://github.com/TanStack/query/discussions/5279) ကို ကြည့်ပါ။

### `refetchInterval` callback function ကို `query` တစ်ခုတည်းပဲ ပို့ပါတယ်

ဒါက callbacks တွေကို invoke လုပ်ပုံကို ရိုးရှင်းစေပြီး (`refetchOnWindowFocus`, `refetchOnMount` နဲ့ `refetchOnReconnect` callbacks တွေကလည်း query တစ်ခုတည်းကိုပဲ ရတာမို့) — `select` နဲ့ transform လုပ်ထားတဲ့ data တွေကို callbacks တွေက ရတဲ့အခါ ဖြစ်တတ်တဲ့ typing issues တချို့ကိုလည်း ဖြေရှင်းပေးပါတယ်။

```tsx
- refetchInterval: number | false | ((data: TData | undefined, query: Query) => number | false | undefined) // [!code --]
+ refetchInterval: number | false | ((query: Query) => number | false | undefined) // [!code ++]
```

`query.state.data` နဲ့ data ကို ဆက်ပြီး ဝင်ရောက်နိုင်ပါသေးတယ် — ဒါပေမယ့် အဲဒါက `select` နဲ့ transform လုပ်ထားတဲ့ data မဟုတ်ပါဘူး။ Transform လုပ်ထားတဲ့ data ကို ဝင်ရောက်ဖို့ လိုအပ်ရင် — `query.state.data` ပေါ်မှာ transformation ကို နောက်တစ်ခါ ပြန်ခေါ်နိုင်ပါတယ်။

### useQuery ကနေ `remove` method ကို ဖယ်ရှားလိုက်ပြီ

အရင်က remove method က — observers တွေကို အကြောင်းကြားစရာ မလိုဘဲ — queryCache ကနေ query ကို ဖယ်ရှားခဲ့ပါတယ်။ မလိုအပ်တော့တဲ့ data တွေကို imperative အနေနဲ့ ဖယ်ရှားဖို့ (ဥပမာ — user logout လုပ်တဲ့အခါ) အကောင်းဆုံး သုံးခဲ့ပါတယ်။

ဒါပေမယ့် — query တစ်ခု ဆက်ပြီး active ဖြစ်နေချိန်မှာ ဒီလိုလုပ်တာက အဓိပ္ပာယ် မရှိလှပါဘူး — ဘာလို့လဲဆိုတော့ နောက် re-render တစ်ခုနဲ့ hard loading state တစ်ခုကို trigger လုပ်ရုံပဲ ဖြစ်လို့ပါ။

Query တစ်ခုကို ဖယ်ရှားဖို့ လိုအပ်နေသေးရင် — `queryClient.removeQueries({queryKey: key})` ကို သုံးနိုင်ပါတယ်:

```tsx
const queryClient = useQueryClient()
const query = useQuery({ queryKey, queryFn })

query.remove() // [!code --]
queryClient.removeQueries({ queryKey }) // [!code ++]
```

### TypeScript ရဲ့ အနည်းဆုံး လိုအပ်တဲ့ version က အခု 4.7 ဖြစ်ပါတယ်

အဓိကအားဖြင့် — type inference ပတ်ဝန်းကျင်မှာ အရေးကြီးတဲ့ fix တစ်ခု ပို့ပေးခဲ့လို့ပါ။ အသေးစိတ်အတွက် — [ဒီ TypeScript issue](https://github.com/microsoft/TypeScript/issues/43371) ကို ကြည့်ပါ။

### useQuery ကနေ `isDataEqual` option ကို ဖယ်ရှားလိုက်ပြီ

အရင်က ဒီ function က — query ရဲ့ resolved data အဖြစ် အရင် `data` (`true`) ကို သုံးမလား၊ data အသစ် (`false`) ကို သုံးမလားဆိုတာ ညွှန်ပြဖို့ သုံးခဲ့ပါတယ်။

`structuralSharing` ဆီ function တစ်ခု ပို့ခြင်းဖြင့် — အလားတူ functionality ကို ရနိုင်ပါတယ်:

```tsx
import { replaceEqualDeep } from '@tanstack/react-query'

- isDataEqual: (oldData, newData) => customCheck(oldData, newData) // [!code --]
+ structuralSharing: (oldData, newData) => customCheck(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData) // [!code ++]
```

### Deprecated ဖြစ်နေတဲ့ custom logger ကို ဖယ်ရှားလိုက်ပြီ

Custom loggers တွေက version 4 မှာ ကတည်းက deprecated ဖြစ်ခဲ့ပြီး — ဒီ version မှာ ဖယ်ရှားလိုက်ပါပြီ။ Logging က development mode မှာပဲ အကျိုးသက်ရောက်မှု ရှိခဲ့တာမို့ — custom logger တစ်ခု ပို့ဖို့ မလိုအပ်ပါဘူး။

### ပံ့ပိုးထားတဲ့ Browsers

ပိုပြီး modern, performant ဖြစ်ပြီး သေးငယ်တဲ့ bundle ထုတ်လုပ်နိုင်ဖို့ — browserslist ကို update လုပ်ထားပါတယ်။ လိုအပ်ချက်တွေကို [ဒီမှာ](/docs/tanstack-query/installation) ဖတ်နိုင်ပါတယ်။

### Private class fields နဲ့ methods

TanStack Query မှာ classes တွေပေါ်မှာ private fields နဲ့ methods တွေ အမြဲ ရှိခဲ့ပေမယ့် — အဲဒါတွေက တကယ့် private တွေ မဟုတ်ခဲ့ပါဘူး — `TypeScript` ထဲမှာပဲ private ဖြစ်ခဲ့တာပါ။ အခုတော့ [ECMAScript Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) တွေကို သုံးထားလို့ — အဲဒီ fields တွေက အခု တကယ့် private တွေ ဖြစ်ပြီး — runtime မှာ အပြင်ကနေ ဝင်ရောက်လို့ မရတော့ပါဘူး။

### `cacheTime` ကို `gcTime` လို့ အမည်ပြောင်းလိုက်ပြီ

လူတိုင်းနီးပါးက `cacheTime` ကို မှားယွင်းစွာ နားလည်ကြပါတယ်။ "data ကို ဘယ်လောက်ကြာကြာ cache လုပ်ထားလဲ" ဆိုတဲ့ အသံမျိုး ထွက်ပေမယ့် — ဒါက မှားပါတယ်။

`cacheTime` က query တစ်ခု ဆက်ပြီး အသုံးပြုနေသရွေ့ ဘာမှ မလုပ်ပါဘူး။ Query က အသုံးမပြုတော့တာနဲ့ မှသာ အလုပ်လုပ်ပါတယ်။ အဲဒီအချိန် ကုန်လွန်သွားရင် — cache ကြီးမထွားအောင် — data ကို "garbage collected" လုပ်ပါတယ်။

`gc` ဆိုတာက "garbage collect" time ကို ရည်ညွှန်းပါတယ်။ နည်းပညာပိုင်း အနည်းငယ် ပိုဆန်ပေမယ့် — computer science မှာ [လူသိများတဲ့ အတိုကောက်](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>) တစ်ခုလည်း ဖြစ်ပါတယ်။

```tsx
const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
-      cacheTime: 10 * MINUTE, // [!code --]
+      gcTime: 10 * MINUTE, // [!code ++]
    },
  },
})
```

### `useErrorBoundary` option ကို `throwOnError` လို့ အမည်ပြောင်းလိုက်ပြီ

`useErrorBoundary` option ကို — framework-agnostic ဖြစ်စေဖို့ ပြီးတော့ — hooks တွေအတွက် သတ်မှတ်ထားတဲ့ React ရဲ့ "use" function prefix နဲ့ "ErrorBoundary" component name တို့နဲ့ ရောထွေးမှု မဖြစ်စေဖို့ — ၎င်းရဲ့ functionality ကို ပိုတိကျစွာ ထင်ဟပ်စေမယ့် `throwOnError` လို့ အမည်ပြောင်းလိုက်ပါတယ်။

### TypeScript: errors တွေအတွက် `unknown` အစား `Error` က default type ဖြစ်လာပြီ

JavaScript မှာ ဘာကိုမဆို `throw` လုပ်နိုင်တာမို့ (`unknown` က အမှန်ကန်ဆုံး type ဖြစ်စေပါတယ်) — ဒါပေမယ့် — အများစုကတော့ `Error` (ဒါမှမဟုတ် `Error` ရဲ့ subclasses) တွေကိုပဲ throw လုပ်ကြပါတယ်။ ဒီပြောင်းလဲမှုက TypeScript ထဲမှာ `error` field နဲ့ အလုပ်လုပ်ရတာကို အများစုအတွက် ပိုလွယ်ကူစေပါတယ်။

Error မဟုတ်တဲ့ အရာတစ်ခုခုကို throw ချင်ရင် — generic ကို ကိုယ်တိုင် သတ်မှတ်ရပါလိမ့်မယ်:

```ts
useQuery<number, string>({
  queryKey: ['some-query'],
  queryFn: async () => {
    if (Math.random() > 0.5) {
      throw 'some error'
    }
    return 42
  },
})
```

Error အမျိုးအစား မတူတာတစ်ခုကို global အနေနဲ့ သတ်မှတ်ဖို့ နည်းလမ်းတစ်ခုအတွက် — [TypeScript Guide](/docs/tanstack-query/typescript) ကို ကြည့်ပါ။

### eslint ရဲ့ `prefer-query-object-syntax` rule ကို ဖယ်ရှားလိုက်ပြီ

အခု ပံ့ပိုးထားတဲ့ syntax က object syntax တစ်ခုတည်းမို့ — ဒီ rule က မလိုအပ်တော့ပါဘူး။

### `keepPreviousData` ကို ဖယ်ရှားပြီး `placeholderData` identity function ကို သုံးပါ

`keepPreviousData` option နဲ့ `isPreviousData` flag တွေက `placeholderData` နဲ့ `isPlaceholderData` flag တို့နဲ့ အများအားဖြင့် တူညီတာတွေပဲ လုပ်နေလို့ — ဖယ်ရှားလိုက်ပါတယ်။

`keepPreviousData` ရဲ့ လုပ်ဆောင်ချက်ကို ရဖို့ — `placeholderData` ဆီ argument အနေနဲ့ အရင် query ရဲ့ `data` ကို ထည့်ပေးထားပြီး — အဲဒါက identity function တစ်ခုကို လက်ခံပါတယ်။ ဒါကြောင့် `placeholderData` ဆီ identity function တစ်ခု ပေးရုံပဲ လိုပြီး — TanStack Query ထဲမှာ ပါဝင်တဲ့ `keepPreviousData` function ကိုလည်း သုံးနိုင်ပါတယ်။

ဒီမှာ သတိပြုစရာတစ်ခုက — `useQueries` ကတော့ `placeholderData` function ထဲကို `previousData` ကို argument အနေနဲ့ မရပါဘူး။ ဒါက array ထဲ ပို့ထားတဲ့ queries တွေရဲ့ dynamic သဘာဝကြောင့် ဖြစ်ပြီး — placeholder နဲ့ queryFn ကနေ ထွက်လာတဲ့ result ရဲ့ ပုံစံ မတူညီတာတွေ ဖြစ်စေနိုင်လို့ပါ။

```tsx
import {
   useQuery,
+  keepPreviousData // [!code ++]
} from "@tanstack/react-query";

const {
   data,
-  isPreviousData, // [!code --]
+  isPlaceholderData, // [!code ++]
} = useQuery({
  queryKey,
  queryFn,
- keepPreviousData: true, // [!code --]
+ placeholderData: keepPreviousData // [!code ++]
});
```

Identity function ဆိုတာ — TanStack Query ရဲ့ ဆက်စပ်အခြေအနေမှာ — ပေးလိုက်တဲ့ argument (ဆိုလိုတာ data) ကို မပြောင်းလဲဘဲ အမြဲ ပြန်ပေးတဲ့ function တစ်ခုကို ရည်ညွှန်းပါတယ်။

```ts
useQuery({
  queryKey,
  queryFn,
  placeholderData: (previousData, previousQuery) => previousData, // identity function with the same behaviour as `keepPreviousData`
})
```

ဒါပေမယ့် — ဒီပြောင်းလဲမှုမှာ သတိထားရမယ့် caveats တချို့ ရှိပါတယ်:

- `placeholderData` က သင့်ကို `success` state ထဲ အမြဲ ရောက်စေပြီး — `keepPreviousData` ကတော့ အရင် query ရဲ့ status ကို ပေးပါတယ်။ အဲဒီ status က — data ကို အောင်မြင်စွာ fetch လုပ်ပြီးနောက် background refetch error ဖြစ်ခဲ့ရင် — `error` ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် error ကိုယ်တိုင်က shared မလုပ်ခဲ့တာမို့ — `placeholderData` ရဲ့ အပြုအမူနဲ့ပဲ ဆက်သွားဖို့ ဆုံးဖြတ်လိုက်ပါတယ်။
- `keepPreviousData` က အရင် data ရဲ့ `dataUpdatedAt` timestamp ကို ပေးခဲ့ပြီး — `placeholderData` နဲ့တော့ `dataUpdatedAt` က `0` မှာ ရှိနေမှာ ဖြစ်ပါတယ်။ ဒီ timestamp ကို screen ပေါ်မှာ ဆက်ပြချင်ရင် စိတ်ညစ်စရာ ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် `useEffect` နဲ့ ဖြေရှင်းလို့ရနိုင်ပါတယ်:

  ```ts
  const [updatedAt, setUpdatedAt] = useState(0)

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
  })

  useEffect(() => {
    if (dataUpdatedAt > updatedAt) {
      setUpdatedAt(dataUpdatedAt)
    }
  }, [dataUpdatedAt])
  ```

### Window focus refetching က `focus` event ကို နားထောင်တော့မှာ မဟုတ်ပါဘူး

`visibilitychange` event ကိုပဲ အခု သီးသန့် သုံးပါတယ်။ ဒါ ဖြစ်နိုင်တာက — `visibilitychange` event ကို ပံ့ပိုးတဲ့ browsers တွေကိုပဲ ကျွန်တော်တို့ ပံ့ပိုးလို့ပါ။ ဒါက [ဒီမှာ စာရင်းပြုစုထားတဲ့](https://github.com/TanStack/query/pull/4805) ပြဿနာ အစုအဝေးကို ဖြေရှင်းပေးပါတယ်။

### Network status က `navigator.onLine` property ကို မှီခိုတော့မှာ မဟုတ်ပါဘူး

`navigator.onLine` က Chromium အခြေခံ browsers တွေမှာ ကောင်းကောင်း အလုပ်မလုပ်ပါဘူး။ False negatives တွေ ပတ်ဝန်းကျင်မှာ [ပြဿနာတွေ အများကြီး](https://bugs.chromium.org/p/chromium/issues/list?q=navigator.online) ရှိပြီး — အဲဒါတွေက Queries တွေကို `offline` လို့ မှားယွင်းစွာ မှတ်သားစေခဲ့ပါတယ်။

ဒါကို ရှောင်ရှားဖို့ — အခု `online: true` နဲ့ အမြဲ စတင်ပြီး — status ကို update လုပ်ဖို့ `online` နဲ့ `offline` events တွေကိုပဲ နားထောင်ပါတယ်။

ဒါက false negatives တွေရဲ့ ဖြစ်နိုင်ခြေကို လျှော့ချပေးသင့်ပေမယ့် — internet connection မလိုဘဲ အလုပ်လုပ်နိုင်တဲ့ serviceWorkers တွေကနေတစ်ဆင့် load လုပ်တဲ့ offline apps တွေအတွက်တော့ false positives တွေ ဖြစ်စေနိုင်ပါတယ်။

### Custom `context` prop ကို ဖယ်ရှားပြီး custom `queryClient` instance ကို သုံးပါ

v4 မှာ — react-query hooks အားလုံးဆီ custom `context` တစ်ခုကို ပို့နိုင်အောင် မိတ်ဆက်ခဲ့ပါတယ်။ ဒါက MicroFrontends တွေ သုံးတဲ့အခါ သင့်လျော်တဲ့ isolation ရစေခဲ့ပါတယ်။

ဒါပေမယ့် — `context` က react-only feature တစ်ခုပါ။ `context` က လုပ်ပေးတာက `queryClient` ကို ဝင်ရောက်ခွင့် ပေးတာပဲ ဖြစ်ပါတယ်။ Custom `queryClient` တစ်ခုကို တိုက်ရိုက် ပို့ခွင့်ပြုခြင်းဖြင့်လည်း — အလားတူ isolation ကို ရနိုင်ပါတယ်။ ဒါက တစ်ဖန် — အခြား frameworks တွေကိုပါ framework-agnostic နည်းလမ်းနဲ့ တူညီတဲ့ functionality ရှိစေမှာ ဖြစ်ပါတယ်။

```tsx
import { queryClient } from './my-client'

const { data } = useQuery(
  {
    queryKey: ['users', id],
    queryFn: () => fetch(...),
-   context: customContext // [!code --]
  },
+  queryClient, // [!code ++]
)
```

### `refetchPage` ကို ဖယ်ရှားပြီး `maxPages` ကို သုံးပါ

v4 မှာ — infinite queries တွေအတွက် refetch လုပ်ရမယ့် pages တွေကို `refetchPage` function နဲ့ သတ်မှတ်ခွင့် မိတ်ဆက်ခဲ့ပါတယ်။

ဒါပေမယ့် — pages အားလုံးကို refetch လုပ်တာက UI inconsistencies တွေ ဖြစ်စေနိုင်ပါတယ်။ ဒါ့အပြင် — ဒီ option က ဥပမာ `queryClient.refetchQueries` မှာ ရနိုင်ပေမယ့် — "သာမန်" queries တွေအတွက် မဟုတ်ဘဲ infinite queries တွေအတွက်ပဲ တစ်ခုခု လုပ်ပေးပါတယ်။

v5 မှာ infinite queries တွေအတွက် `maxPages` option အသစ် ပါဝင်ပြီး — query data ထဲမှာ သိမ်းဆည်းဖို့ ပြီးတော့ refetch လုပ်ဖို့ — pages အရေအတွက်ကို ကန့်သတ်ပေးပါတယ်။ ဒီ feature အသစ်က `refetchPage` အတွက် ကနဦး ဖော်ထုတ်ခဲ့တဲ့ use cases တွေကို — ဆက်စပ်ပြဿနာတွေ မပါဘဲ — ကိုင်တွယ်ပေးပါတယ်။

### `dehydrate` API အသစ်

`dehydrate` ဆီ ပို့နိုင်တဲ့ options တွေကို ရိုးရှင်းစေပါတယ်။ Queries နဲ့ Mutations တွေက (default function implementation အရ) အမြဲ dehydrate လုပ်ခံရပါတယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ — ဖယ်ရှားလိုက်တဲ့ `dehydrateMutations` နဲ့ `dehydrateQueries` boolean options တွေ အစား — function ပုံစံ `shouldDehydrateQuery` ဒါမှမဟုတ် `shouldDehydrateMutation` တွေကို implement လုပ်နိုင်ပါတယ်။ Queries/mutations တွေကို လုံးဝ hydrate မလုပ်တဲ့ အရင်က အပြုအမူကို ရဖို့ဆိုရင် — `() => false` ကို ပို့လိုက်ပါ။

```tsx
- dehydrateMutations?: boolean // [!code --]
- dehydrateQueries?: boolean // [!code --]
```

### Infinite queries တွေမှာ အခု `initialPageParam` လိုအပ်ပါတယ်

အရင်က — `pageParam` အနေနဲ့ `undefined` ကို `queryFn` ဆီ ပို့ပြီး — `queryFn` function signature ထဲမှာ `pageParam` parameter အတွက် default value တစ်ခု သတ်မှတ်လို့ ရခဲ့ပါတယ်။ ဒါမှာ `undefined` ကို `queryCache` ထဲမှာ သိမ်းမိတဲ့ အားနည်းချက် ရှိခဲ့ပြီး — အဲဒါက serializable မဟုတ်ပါဘူး။

အဲဒီအစား — infinite query options တွေဆီ ရှင်းရှင်းလင်းလင်း `initialPageParam` တစ်ခုကို အခု ပို့ရပါမယ်။ ဒါက ပထမ page အတွက် `pageParam` အနေနဲ့ သုံးမှာ ဖြစ်ပါတယ်:

```tsx
useInfiniteQuery({
   queryKey,
-  queryFn: ({ pageParam = 0 }) => fetchSomething(pageParam), // [!code --]
+  queryFn: ({ pageParam }) => fetchSomething(pageParam), // [!code ++]
+  initialPageParam: 0, // [!code ++]
   getNextPageParam: (lastPage) => lastPage.next,
})
```

### Infinite queries တွေအတွက် manual mode ကို ဖယ်ရှားလိုက်ပြီ

အရင်က — `getNextPageParam` ဒါမှမဟုတ် `getPreviousPageParam` ကနေ ပြန်လာမယ့် `pageParams` တွေကို — `fetchNextPage` ဒါမှမဟုတ် `fetchPreviousPage` ဆီ `pageParam` value တစ်ခု တိုက်ရိုက် ပို့ပြီး overwrite လုပ်ခွင့် ရှိခဲ့ပါတယ်။ ဒီ feature က refetches တွေနဲ့ လုံးဝ အလုပ်မဖြစ်ခဲ့သလို — သိပ်ပြီး လူသိများခြင်း/အသုံးပြုခြင်း မရှိခဲ့ပါဘူး။ ဒါက infinite queries တွေအတွက် `getNextPageParam` ကို အခု required ဖြစ်စေပါတယ်။

### `getNextPageParam` ဒါမှမဟုတ် `getPreviousPageParam` ကနေ `null` ပြန်ပို့ရင် — နောက်ထပ် page မရှိတော့ဘူးလို့ ညွှန်ပြပါတယ်

v4 မှာ — နောက်ထပ် page မရှိတော့ဘူးဆိုတာ ညွှန်ပြဖို့ `undefined` ကို ရှင်းရှင်းလင်းလင်း ပြန်ပို့ဖို့ လိုခဲ့ပါတယ်။ ဒီစစ်ဆေးမှုကို `null` ပါ ပါဝင်အောင် ကျယ်ချဲ့လိုက်ပါတယ်။

### Server ပေါ်မှာ retries မလုပ်တော့ပါဘူး

Server ပေါ်မှာ — `retry` က အခု `3` အစား `0` ကို default ထားပါတယ်။ Prefetching အတွက်တော့ retries တွေကို အမြဲ `0` လို့ default ထားခဲ့ပြီးသားပါ — ဒါပေမယ့် `suspense` enabled ဖြစ်တဲ့ queries တွေက (React 18 ကစပြီး) server ပေါ်မှာပါ တိုက်ရိုက် run လို့ရလာတာမို့ — server ပေါ်မှာ ဘယ်တော့မှ retry မလုပ်ဖို့ သေချာစေရပါမယ်။

### `status: loading` ကို `status: pending` အဖြစ်၊ `isLoading` ကို `isPending` အဖြစ် ပြောင်းလိုက်ပြီး — `isInitialLoading` ကို `isLoading` လို့ အမည်ပြောင်းလိုက်ပါပြီ

`loading` status ကို `pending` လို့ အမည်ပြောင်းပြီး — အလားတူ ဆင်းသက်လာတဲ့ `isLoading` flag ကိုလည်း `isPending` လို့ ပြောင်းလိုက်ပါတယ်။

Mutations တွေအတွက်လည်း — `status` ကို `loading` ကနေ `pending` အဖြစ် ပြောင်းပြီး — `isLoading` flag ကို `isPending` အဖြစ် ပြောင်းလိုက်ပါတယ်။

နောက်ဆုံးအနေနဲ့ — queries တွေအတွက် `isPending && isFetching` အနေနဲ့ implement လုပ်ထားတဲ့ `isLoading` flag သစ်တစ်ခုကို ထပ်ထည့်လိုက်ပါတယ်။ ဆိုလိုတာက — `isLoading` နဲ့ `isInitialLoading` တွေက အတူတူပဲ ဖြစ်ပေမယ့် — `isInitialLoading` က အခု deprecated ဖြစ်ပြီး နောက် major version မှာ ဖယ်ရှားမှာ ဖြစ်ပါတယ်။

ဒီပြောင်းလဲမှုရဲ့ နောက်ကွယ်က ဆင်ခြင်မှုကို နားလည်ဖို့ — [v5 roadmap discussion](https://github.com/TanStack/query/discussions/4252) ကို ကြည့်ပါ။

### `hashQueryKey` ကို `hashKey` လို့ အမည်ပြောင်းလိုက်ပြီ

ဘာလို့လဲဆိုတော့ — အဲဒါက mutation keys တွေကိုပါ hash လုပ်ပြီး — mutations တွေကို လက်ခံရရှိတဲ့ `useIsMutating` နဲ့ `useMutationState` တို့ရဲ့ `predicate` functions တွေထဲမှာလည်း သုံးလို့ရလို့ပါ။

### React ရဲ့ အနည်းဆုံး လိုအပ်တဲ့ version က အခု 18.0 ဖြစ်ပါတယ်

React Query v5 က React 18.0 ဒါမှမဟုတ် အဲဒီထက် နောက်ကျတဲ့ version တွေ လိုအပ်ပါတယ်။ ဒါက React 18.0 နဲ့ အထက်မှာပဲ ရနိုင်တဲ့ `useSyncExternalStore` hook အသစ်ကို သုံးထားလို့ပါ။ အရင်က — React က ပေးတဲ့ shim ကို သုံးခဲ့ပါတယ်။

### `QueryClientProvider` ကနေ `contextSharing` prop ကို ဖယ်ရှားလိုက်ပြီ

အရင်က `contextSharing` property ကို သုံးပြီး — query client context ရဲ့ ပထမဆုံး (ပြီးတော့ အနည်းဆုံး တစ်ခု) instance ကို window တစ်လျှောက် မျှဝေနိုင်ခဲ့ပါတယ်။ ဒါက TanStack Query ကို bundles ဒါမှမဟုတ် microfrontends အမျိုးမျိုးမှာ သုံးထားရင်တောင် — module scoping မရွေး — context ရဲ့ instance တစ်ခုတည်းကိုပဲ အားလုံး သုံးမယ်ဆိုတာ သေချာစေခဲ့ပါတယ်။

v5 မှာ custom context prop ကို ဖယ်ရှားလိုက်တာနဲ့ — အပေါ်က custom `queryClient` instance အကြောင်း အပိုင်းကို ရည်ညွှန်းပါတယ်။ Application တစ်ခုရဲ့ packages အများအပြားကြားမှာ query client တစ်ခုတည်းကို မျှဝေချင်ရင် — shared custom `queryClient` instance တစ်ခုကို တိုက်ရိုက် ပို့နိုင်ပါတယ်။

### React နဲ့ React Native မှာ `unstable_batchedUpdates` ကို batching function အဖြစ် သုံးတော့မှာ မဟုတ်ပါဘူး

`unstable_batchedUpdates` function က React 18 မှာ noop ဖြစ်သွားလို့ — `react-query` ထဲမှာ batching function အဖြစ် အလိုအလျောက် သတ်မှတ်တော့မှာ မဟုတ်ပါဘူး။

သင့် framework က custom batching function တစ်ခုကို ပံ့ပိုးရင် — `notifyManager.setBatchNotifyFunction` ကို ခေါ်ပြီး TanStack Query ကို အသိပေးနိုင်ပါတယ်။

ဥပမာ — `solid-query` မှာ batch function ကို ဒီလို သတ်မှတ်ပါတယ်:

```ts
import { notifyManager } from '@tanstack/query-core'
import { batch } from 'solid-js'

notifyManager.setBatchNotifyFunction(batch)
```

### Hydration API ပြောင်းလဲမှုများ

Concurrent features တွေနဲ့ transitions တွေကို ပိုကောင်းအောင် ပံ့ပိုးဖို့ — hydration APIs တွေမှာ ပြောင်းလဲမှုတချို့ လုပ်ခဲ့ပါတယ်။ `Hydrate` component ကို `HydrationBoundary` လို့ အမည်ပြောင်းပြီး — `useHydrate` hook ကို ဖယ်ရှားလိုက်ပါတယ်။

`HydrationBoundary` က mutations တွေကို hydrate မလုပ်တော့ဘဲ — queries တွေကိုပဲ လုပ်ပါတယ်။ Mutations တွေကို hydrate လုပ်ဖို့ — low level `hydrate` API ဒါမှမဟုတ် `persistQueryClient` plugin ကို သုံးပါ။

နောက်ဆုံးအနေနဲ့ — နည်းပညာပိုင်း အသေးစိတ်တစ်ခုအနေနဲ့ — queries တွေကို hydrate လုပ်တဲ့ timing တွေ နည်းနည်း ပြောင်းသွားပါတယ်။ SSR ပုံမှန်အတိုင်း အလုပ်လုပ်နိုင်ဖို့ — query အသစ်တွေကို render phase မှာ ဆက်ပြီး hydrate လုပ်ပေမယ့် — cache ထဲမှာ ရှိပြီးသား queries တွေကိုတော့ (သူတို့ရဲ့ data က cache ထဲကဟာထက် ပိုသစ်နေသရွေ့) effect တစ်ခုထဲမှာ အခု hydrate လုပ်ပါတယ်။ Application ရဲ့ အစမှာ တစ်ခါပဲ hydrate လုပ်တတ်တဲ့ သာမန် အသုံးပြုမှုဆိုရင် — ဒါက သင့်ကို မထိခိုက်ပါဘူး — ဒါပေမယ့် Server Components တွေကို သုံးပြီး page navigation တစ်ခုမှာ hydration အတွက် data အသစ်တွေ ပို့ချနေတယ်ဆိုရင် — page က ချက်ချင်း ပြန် render မလုပ်ခင် — အရင် data ဟောင်း တစ်ခဏ ပေါ်လာတာမျိုး သတိထားမိနိုင်ပါတယ်။

ဒီနောက်ဆုံး ပြောင်းလဲမှုက နည်းပညာအရ breaking ဖြစ်ပြီး — page transition တစ်ခု အပြည့်အဝ commit မဖြစ်ခင် — _ရှိပြီးသား_ page ပေါ်မှာ content တွေကို အချိန်မတိုင်ခင် update မလုပ်မိအောင် လုပ်ထားတာပါ။ သင့်ဘက်က ဘာမှ လုပ်ဆောင်စရာ မလိုပါဘူး။

```tsx
- import { Hydrate } from '@tanstack/react-query' // [!code --]
+ import { HydrationBoundary } from '@tanstack/react-query' // [!code ++]


- <Hydrate state={dehydratedState}> // [!code --]
+ <HydrationBoundary state={dehydratedState}> // [!code ++]
  <App />
- </Hydrate> // [!code --]
+ </HydrationBoundary> // [!code ++]
```

### Query defaults ပြောင်းလဲမှုများ

`queryClient.getQueryDefaults` က အခု — ပထမဆုံး matching registration တစ်ခုတည်း အစား — matching registrations တွေ အားလုံးကို အတူတကွ merge လုပ်ပါလိမ့်မယ်။

အကျိုးဆက်အနေနဲ့ — `queryClient.setQueryDefaults` ကို ခေါ်တာတွေကို အခု _specificity မြင့်လာတဲ့_ အစီအစဉ်နဲ့ ခေါ်သင့်ပါတယ်။ ဆိုလိုတာက — registrations တွေကို **အယေဘုယျဆုံး key** ကနေ **အသေးစိတ်အကျဆုံး** ဆီကို စီစဉ်သင့်ပါတယ်။

ဥပမာ:

```ts
+ queryClient.setQueryDefaults(['todo'], {   // [!code ++]
+   retry: false,  // [!code ++]
+   staleTime: 60_000,  // [!code ++]
+ })  // [!code ++]
queryClient.setQueryDefaults(['todo', 'detail'], {
+   retry: true,  // [!code --]
  retryDelay: 1_000,
  staleTime: 10_000,
})
- queryClient.setQueryDefaults(['todo'], { // [!code --]
-   retry: false, // [!code --]
-   staleTime: 60_000, // [!code --]
- }) // [!code --]
```

ဒီတိကျတဲ့ ဥပမာထဲမှာ — `retry: true` ကို `['todo', 'detail']` registration ထဲ ထည့်လိုက်တာက — ပိုအယေဘုယျကျတဲ့ registration ကနေ အခု အမွေရလာမယ့် `retry: false` ကို ချေဖျက်ဖို့ ဖြစ်ပါတယ်။ အတိအကျ အပြုအမူတွေကို ထိန်းသိမ်းဖို့ လိုအပ်တဲ့ ပြောင်းလဲမှုတွေက သင့် defaults တွေပေါ်မှာ မူတည်ပြီး ကွဲပြားပါလိမ့်မယ်။

## Feature အသစ်များ (New Features) 🚀

v5 မှာလည်း feature အသစ်တွေ ပါဝင်ပါတယ်:

### Optimistic updates ရိုးရှင်းလာခြင်း

`useMutation` ကနေ ပြန်လာတဲ့ `variables` တွေကို အသုံးချပြီး — optimistic updates တွေ လုပ်ဖို့ ရိုးရှင်းတဲ့ နည်းလမ်းသစ်တစ်ခု ရှိပါတယ်:

```tsx
const queryInfo = useTodos()
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

if (queryInfo.data) {
  return (
    <ul>
      {queryInfo.data.items.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
      {addTodoMutation.isPending && (
        <li key={String(addTodoMutation.submittedAt)} style={{ opacity: 0.5 }}>
          {addTodoMutation.variables}
        </li>
      )}
    </ul>
  )
}
```

ဒီမှာ — data တွေကို cache ထဲ တိုက်ရိုက် ရေးသားမယ့်အစား — mutation run နေချိန်မှာ UI က ဘယ်လိုပုံ ပေါက်မလဲဆိုတာကိုပဲ ပြောင်းလဲနေတာပါ။ Optimistic update ကို ပြသဖို့ လိုအပ်တဲ့ နေရာတစ်ခုတည်းပဲ ရှိတဲ့အခါ ဒါက အကောင်းဆုံး အလုပ်လုပ်ပါတယ်။ အသေးစိတ်အတွက် — [optimistic updates documentation](/docs/tanstack-query/optimistic-updates) ကို ကြည့်ပါ။

### `maxPages` option အသစ်နဲ့ infinite queries အရေအတွက် ကန့်သတ်ခြင်း

Infinite scroll ဒါမှမဟုတ် pagination လိုအပ်တဲ့အခါ infinite queries တွေက ကောင်းပါတယ်။ ဒါပေမယ့် — pages တွေ များလေလေ — memory ပိုသုံးရလေလေ ဖြစ်ပြီး — pages အားလုံးကို တစ်ခုပြီးတစ်ခု sequential အနေနဲ့ refetch လုပ်ရတာမို့ — query refetching process ကိုလည်း နှေးကွေးစေပါတယ်။

Version 5 မှာ infinite queries တွေအတွက် `maxPages` option အသစ် ပါဝင်ပြီး — developers တွေကို query data ထဲမှာ သိမ်းဆည်းပြီး နောက်ပိုင်း refetch လုပ်မယ့် pages အရေအတွက်ကို ကန့်သတ်ခွင့် ပေးပါတယ်။ ပို့ချင်တဲ့ UX နဲ့ refetching performance ပေါ် မူတည်ပြီး — `maxPages` value ကို ချိန်ညှိနိုင်ပါတယ်။

Infinite list က bi-directional ဖြစ်ရမှာ ဖြစ်ပြီး — `getNextPageParam` နဲ့ `getPreviousPageParam` နှစ်ခုလုံး define လုပ်ထားဖို့ လိုအပ်တာ သတိပြုပါ။

### Infinite Queries တွေက pages အများအပြားကို prefetch လုပ်နိုင်ပါတယ်

Infinite Queries တွေကို သာမန် Queries တွေလိုပဲ prefetch လုပ်နိုင်ပါတယ်။ Default အနေနဲ့ — Query ရဲ့ ပထမ page ကိုပဲ prefetch လုပ်ပြီး — ပေးထားတဲ့ QueryKey အောက်မှာ သိမ်းပါတယ်။ Page တစ်ခုထက်ပိုပြီး prefetch လုပ်ချင်ရင် — `pages` option ကို သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [prefetching guide](/docs/tanstack-query/prefetching) ကို ဖတ်ပါ။

### `useQueries` အတွက် `combine` option အသစ်

အသေးစိတ်အတွက် — [useQueries docs](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQueries#combine) ကို ကြည့်ပါ။

### Experimental `fine grained storage persister`

အသေးစိတ်အတွက် — [experimental_createPersister docs](https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister) ကို ကြည့်ပါ။

### Query Options တွေကို Typesafe ဖြစ်အောင် ဖန်တီးနည်း

အသေးစိတ်အတွက် — [TypeScript docs](/docs/tanstack-query/typescript) ကို ကြည့်ပါ။

### Suspense အတွက် hooks အသစ်များ

v5 နဲ့အတူ — data fetching အတွက် suspense က နောက်ဆုံးမှာ "stable" ဖြစ်လာပါပြီ။ `useSuspenseQuery`, `useSuspenseInfiniteQuery` နဲ့ `useSuspenseQueries` hooks သီးသန့်တွေကို ထပ်ထည့်လိုက်ပါတယ်။ ဒီ hooks တွေနဲ့ — `data` က type level မှာ ဘယ်တော့မှ `undefined` ဖြစ်နိုင်မှာ မဟုတ်ပါဘူး:

```js
const { data: post } = useSuspenseQuery({
  // ^? const post: Post
  queryKey: ['post', postId],
  queryFn: () => fetchPost(postId),
})
```

Query hooks တွေပေါ်က experimental `suspense: boolean` flag ကို ဖယ်ရှားလိုက်ပါပြီ။

သူတို့အကြောင်း [suspense docs](/docs/tanstack-query/suspense) မှာ ပိုပြီး ဖတ်နိုင်ပါတယ်။
