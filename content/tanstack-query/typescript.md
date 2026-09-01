---
title: "TypeScript (TypeScript အသုံးပြုခြင်း)"
description: "React Query ရဲ့ TypeScript သုံးစွဲမှု — type inference, type narrowing, error field ကို typing လုပ်ခြင်း, global Error/Meta/QueryKey registration, queryOptions နဲ့ mutationOptions, skipToken"
order: 35
source: "https://tanstack.com/query/latest/docs/framework/react/typescript"
status: translated
updated: 2026-09-01
---

React Query ကို အခု **TypeScript** နဲ့ ရေးထားပါတယ် — ဒါက library ရော သင့် projects တွေပါ type-safe ဖြစ်စေဖို့ပါ!

သတိထားစရာတွေ:

- TanStack Query က [DefinitelyTyped ရဲ့ support window](https://github.com/DefinitelyTyped/DefinitelyTyped#support-window) ကို လိုက်နာပြီး — လွန်ခဲ့တဲ့ ၂ နှစ်အတွင်း ထွက်ခဲ့တဲ့ TypeScript ဗားရှင်းတွေကို ထောက်ပံ့ပါတယ်။ လောလောဆယ်မှာ ဆိုလိုတာက TypeScript **5.6** နဲ့ နောက်ပိုင်းတွေပါ။
- ဒီ repository ထဲက types တွေရဲ့ အပြောင်းအလဲတွေကို **non-breaking** လို့ သတ်မှတ်ပြီး — ပုံမှန်အားဖြင့် semver ရဲ့ **patch** အနေနဲ့ ဖြန့်ချိပါတယ် (မဟုတ်ရင် type enhancement တိုင်းက major version ဖြစ်နေမှာမို့ပါ!)
- **သင့် react-query package ဗားရှင်းကို တိကျတဲ့ patch release တစ်ခုမှာ သော့ခတ်ထားဖို့ ပြင်းပြင်းထန်ထန် အကြံပြုပါတယ် — ပြီးတော့ release တစ်ခုနဲ့တစ်ခုကြားမှာ types တွေ ပြုပြင်ခံရခြင်း ဒါမှမဟုတ် အဆင့်မြှင့်ခံရခြင်း ရှိနိုင်တယ်ဆိုပြီး မျှော်လင့်ပြီး upgrade လုပ်ပါ**
- React Query ရဲ့ type နဲ့ မဆိုင်တဲ့ public API ကတော့ semver ကို တင်းတင်းကျပ်ကျပ် လိုက်နာဆဲပါ။

## Type Inference

React Query မှာ types တွေက ယေဘုယျအားဖြင့် ကောင်းကောင်း စီးဆင်းတာမို့ — သင်ကိုယ်တိုင် type annotations တွေ ပေးစရာ မလိုပါဘူး

```tsx
const { data } = useQuery({
  //    ^? const data: number | undefined
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
})
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSqDkIAEa4qAXQA0cFQEo5APjgAFciGAYAdLVQQANgDd0KgKxmzXgB6ILgw8IA9AH5eIA)

```tsx
const { data } = useQuery({
  //      ^? const data: string | undefined
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
  select: (data) => data.toString(),
})
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSox0IqgF0ANHBUBKOQD44ABXIhgGAHS1UEADYA3dCoCsxw0gwu6EwAXHASUuZhknT2MBAAyjBQwIIA5iaExrwA9Nlw+QUAegD8vEA)

သင့် `queryFn` က ရှင်းလင်းစွာ သတ်မှတ်ထားတဲ့ (well-defined) return type ရှိနေရင် ဒါက အကောင်းဆုံး အလုပ်လုပ်ပါတယ်။ Data fetching library အများစုက default အနေနဲ့ `any` ကို return လုပ်တာမို့ — ဒါကို စနစ်တကျ typed ဖြစ်တဲ့ function တစ်ခုအဖြစ် ထုတ်ယူဖို့ သေချာပါစေ:

```tsx
const fetchGroups = (): Promise<Group[]> =>
  axios.get('/groups').then((response) => response.data)

const { data } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const data: Group[] | undefined
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFCiSw4dAB7AIqUuUpURY1Nx68YeMOjgBxcsjBwAvIjjAAJgC44AO2QgARriK9eDCOdTwS6GAwAWmiNon6ABQAlGYAClLAGAA8vtoA2gC6AHx6qbLiAHQA5h6BVAD02Vpg8sGZMF7o5oG0qJAuarqpdQ0YmUZ0MHTBDjxOLvBInd1EeigY2Lh4gfFUxX6lVIkANKQe3nGlvTwFBXAHhwB6APxwA65wI3RmW0lwAD4o5kboJMDm6Ea8QA)

## Type Narrowing

React Query က query result အတွက် [discriminated union type](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) ကို သုံးပါတယ် — `status` field နဲ့ ဆင်းသက်လာတဲ့ (derived) status boolean flags တွေနဲ့ ခွဲခြားသတ်မှတ်ထားပါတယ်။ ဒါက ဥပမာ `success` status ကို စစ်ပြီး `data` ကို defined ဖြစ်အောင် လုပ်နိုင်စေပါတယ်:

```tsx
const { data, isSuccess } = useQuery({
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
})

if (isSuccess) {
  data
  //  ^? const data: number
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0ANHGCoAysgYN0qVETgBeFBmy48ACgDaVGGphUAurMMBKbQD44ABXIh56AHS1UEADYAbuiGAKx2dry8wCRwhvJKKmqoDgi8cBlwElK8APS5GQB6APy8hLxAA)

## error field ကို Typing လုပ်ခြင်း

error အတွက် type က `Error` ဆိုပြီး default ဖြစ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ user အများစု မျှော်လင့်တာ ဒါမို့ပါ။

```tsx
const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: Error
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFZVLWR9VQ5ADSkwWGZ9WOSnJxwl1cAegD8QA)

Custom error တစ်ခုကို throw ချင်တာ ဒါမှမဟုတ် `Error` လုံးဝမဟုတ်တဲ့ အရာတစ်ခုခုကို throw ချင်တယ်ဆိုရင် — error field ရဲ့ type ကို သတ်မှတ်နိုင်ပါတယ်:

```tsx
const { error } = useQuery<Group[], string>(['groups'], fetchGroups)
//      ^? const error: string | null
```

ဒါပေမယ့် — ဒါမှာ အားနည်းချက်က `useQuery` ရဲ့ တခြား generics တွေ အားလုံးအတွက် type inference က အလုပ်မလုပ်တော့တာပါ။ `Error` မဟုတ်တဲ့ အရာတစ်ခုခုကို throw လုပ်တာက ယေဘုယျအားဖြင့် ကောင်းတဲ့ အလေ့အကျင့် မဟုတ်လို့ — `AxiosError` လို subclass တစ်ခု ရှိတယ်ဆိုရင် error field ကို ပိုတိကျအောင် _type narrowing_ ကို သုံးနိုင်ပါတယ်:

```tsx
import axios from 'axios'

const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: Error | null

if (axios.isAxiosError(error)) {
  error
  // ^? const error: AxiosError
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFIIisA0uh4zllUtZH1VDkANHAb+ABijM5BIeF1qoRjkpyccJ9fAHoA-OPAEhwGLFVAlVIAQSUKgAolBZjEZtA4nFEFJPkioOi4O84H8pIQgA)

### Global Error တစ်ခု Register လုပ်ခြင်း

TanStack Query v5 က — call-sides တွေမှာ generics တွေ သတ်မှတ်စရာ မလိုဘဲ — `Register` interface ကို ပြင်ဆင်ခြင်းအားဖြင့် — အရာတိုင်းအတွက် global Error type တစ်ခု သတ်မှတ်နည်း ပေးထားပါတယ်။ ဒါက inference ဆက်အလုပ်လုပ်နေစေပြီး — error field က သတ်မှတ်ထားတဲ့ type ဖြစ်နေပါလိမ့်မယ်။ Call-sides တွေမှာ explicit type-narrowing လုပ်ရမယ်လို့ တွန်းအားပေးချင်တယ်ဆိုရင် — `defaultError` ကို `unknown` လို့ သတ်မှတ်ပါ:

```tsx
import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    // Call sites တွေမှာ explicit ဖြစ်အောင် narrow လုပ်ရမယ်လို့ unknown သုံးပါ။
    defaultError: unknown
  }
}

const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: unknown | null
```

## meta ကို Typing လုပ်ခြင်း

### Global Meta တစ်ခု Register လုပ်ခြင်း

[global error type](#registering-a-global-error) register လုပ်သလိုပဲ — global `Meta` type တစ်ခုကိုလည်း register လုပ်နိုင်ပါတယ်။ ဒါက [queries](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) နဲ့ [mutations](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) တွေပေါ်က optional `meta` field ကို တသမတ်တည်း ဖြစ်ပြီး type-safe ဖြစ်နေစေပါတယ်။ Register လုပ်ထားတဲ့ type က `Record<string, unknown>` ကို extend လုပ်ရမယ်ဆိုတာ သတိပြုပါ — `meta` က object ဖြစ်နေဖို့ပါ။

```ts
import '@tanstack/react-query'

interface MyMeta extends Record<string, unknown> {
  // သင့် meta type ရဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်။
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: MyMeta
    mutationMeta: MyMeta
  }
}
```

## Query နဲ့ mutation keys တွေကို Typing လုပ်ခြင်း

### Query နဲ့ mutation key types တွေကို Register လုပ်ခြင်း

[global error type](#registering-a-global-error) register လုပ်သလိုပဲ — global `QueryKey` နဲ့ `MutationKey` type တစ်ခုကိုလည်း register လုပ်နိုင်ပါတယ်။ ဒါက သင့် application ရဲ့ hierarchy နဲ့ ကိုက်ညီတဲ့ keys တွေအတွက် structure ပိုပေးနိုင်ပြီး — library ရဲ့ surface area တစ်လျှောက်လုံးမှာ typed ဖြစ်စေနိုင်ပါတယ်။ Register လုပ်ထားတဲ့ type က `Array` type ကို extend လုပ်ရမယ်ဆိုတာ သတိပြုပါ — သင့် keys တွေ array ဖြစ်နေဖို့ပါ။

```ts
import '@tanstack/react-query'

type QueryKey = ['dashboard' | 'marketing', ...ReadonlyArray<unknown>]

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKey
    mutationKey: QueryKey
  }
}
```

## Query Options တွေကို Typing လုပ်ခြင်း

Query options တွေကို `useQuery` ထဲမှာ inline လုပ်ထားရင် — type inference ကို အလိုအလျောက် ရပါတယ်။ ဒါပေမယ့် — query options တွေကို သီးခြား function တစ်ခုအဖြစ် ထုတ်ယူပြီး — `useQuery` နဲ့ ဥပမာ `query` တို့ကြားမှာ မျှဝေချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။ အဲဒီလိုအခါ type inference ပျောက်သွားပါလိမ့်မယ်။ ပြန်ရဖို့ — `queryOptions` helper ကို သုံးနိုင်ပါတယ်:

```ts
import { queryOptions } from '@tanstack/react-query'

function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  })
}

useQuery(groupOptions())
queryClient.query(groupOptions())
```

ထို့အပြင် — `queryOptions` ကနေ return လုပ်တဲ့ `queryKey` က သူနဲ့ ဆက်စပ်နေတဲ့ `queryFn` အကြောင်းကို သိပြီး — `queryClient.getQueryData` လို functions တွေကိုပါ ဒီ type information တွေကို သိစေဖို့ အသုံးချနိုင်ပါတယ်:

```ts
function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  })
}

const data = queryClient.getQueryData(groupOptions().queryKey)
//     ^? const data: Group[] | undefined
```

`queryOptions` မရှိရင် — `data` ရဲ့ type က `unknown` ဖြစ်နေမှာပါ — ဒါမှမဟုတ် generic တစ်ခုကို ထည့်ပေးမှသာ:

```ts
const data = queryClient.getQueryData<Group[]>(['groups'])
```

`queryOptions` ကနေတစ်ဆင့် type inference က `queryClient.getQueriesData` အတွက်တော့ အလုပ်မလုပ်ဘူးဆိုတာ သတိပြုပါ — ဘာကြောင့်လဲဆိုတော့ ဒါက heterogeneous၊ `unknown` data တွေပါတဲ့ tuples တွေရဲ့ array တစ်ခုကို return လုပ်လို့ပါ။ သင့် query က return လုပ်မယ့် data ရဲ့ type ကို သေချာသိရင် — ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပါ:

```ts
const entries = queryClient.getQueriesData<Group[]>(groupOptions().queryKey)
//     ^? const entries: Array<[QueryKey, Group[] | undefined]>
```

## Mutation Options တွေကို Typing လုပ်ခြင်း

`queryOptions` လိုပဲ — mutation options တွေကို သီးခြား function တစ်ခုအဖြစ် ထုတ်ယူဖို့ `mutationOptions` ကို သုံးနိုင်ပါတယ်:

```ts
function groupMutationOptions() {
  return mutationOptions({
    mutationKey: ['addGroup'],
    mutationFn: addGroup,
  })
}

useMutation({
  ...groupMutationOptions(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
})
useIsMutating(groupMutationOptions())
queryClient.isMutating(groupMutationOptions())
```

## `skipToken` သုံးပြီး queries တွေကို Typesafe ဖြစ်အောင် Disable လုပ်ခြင်း

TypeScript သုံးနေတယ်ဆိုရင် — query တစ်ခုကို disable လုပ်ဖို့ `skipToken` ကို သုံးနိုင်ပါတယ်။ Condition တစ်ခုပေါ် အခြေခံပြီး query တစ်ခုကို disable လုပ်ချင်ပေမယ့် — query ကို type safe ဖြစ်နေဆဲ ထားချင်တဲ့အခါ အသုံးဝင်ပါတယ်။
ဒီအကြောင်း [Disabling Queries guide](/docs/tanstack-query/disabling-queries) မှာ ထပ်ဖတ်ပါ။

## ထပ်ဆင့် ဖတ်ရှုရန်

Type inference အတွက် tips နဲ့ tricks တွေ သိချင်ရင် — [React Query and TypeScript](https://tkdodo.eu/blog/react-query-and-type-script) ဆောင်းပါးကို ကြည့်ပါ။ အကောင်းဆုံး type-safety ဘယ်လို ရမလဲဆိုတာ သိဖို့ — [Type-safe React Query](https://tkdodo.eu/blog/type-safe-react-query) ကို ဖတ်နိုင်ပါတယ်။ [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) ကတော့ `queryOptions` helper function နဲ့ type inference ဘယ်လို အလုပ်လုပ်လဲဆိုတာ ဖော်ပြထားပါတယ်။
