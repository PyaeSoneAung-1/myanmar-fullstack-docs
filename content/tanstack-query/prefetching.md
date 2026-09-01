---
title: "Prefetching နဲ့ Router ပေါင်းစပ်ခြင်း (Prefetching & Router Integration)"
description: "ဒေတာကို ကြိုတင်ယူ (prefetch) နည်း — `query` method သုံးပြီး prefetch လုပ်နည်း, event handlers, components, router integration, dependent queries & code splitting, manual priming"
order: 21
source: "https://tanstack.com/query/latest/docs/framework/react/guides/prefetching"
status: translated
updated: 2026-09-01
---

ဒေတာတစ်ချို့ လိုအပ်လာမယ်ဆိုတာ သိရင် (ဒါမှမဟုတ် သံသယရှိရင်) — prefetching ကို သုံးပြီး အဲဒီဒေတာကို ကြိုတင် ယူထားနိုင်ပြီး — cache ကို ကြိုဖြည့်ထားလို့ ပိုမြန်တဲ့ အတွေ့အကြုံ ရစေပါတယ်။

Prefetching pattern မျိုးစုံ ရှိပါတယ်:

1. Event handlers တွေထဲမှာ
2. Components တွေထဲမှာ
3. Router integration ကနေတစ်ဆင့်
4. Server Rendering လုပ်နေစဉ် (router integration ရဲ့ နောက်ထပ် ပုံစံတစ်ခု)

ဒီ guide မှာတော့ ပထမ သုံးမျိုးကို ကြည့်ပါမယ် — စတုတ္ထမြောက် နည်းလမ်းကိုတော့ [Server Rendering & Hydration guide](/docs/tanstack-query/ssr) နဲ့ [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) တွေမှာ အသေးစိတ် လေ့လာရပါမယ်။

Prefetching ရဲ့ အသုံးဝင်တဲ့ နေရာတစ်ခုက Request Waterfalls တွေကို ရှောင်ဖို့ပါ — အဲဒီအကြောင်း နက်နက်ရှိုင်းရှိုင်း နောက်ခံ ရှင်းလင်းချက်တွေအတွက် [Performance & Request Waterfalls guide](/docs/tanstack-query/request-waterfalls) ကို ကြည့်ပါ။

## `query` နဲ့ Prefetch လုပ်ခြင်း

> မှတ်ချက်: ဒီ tips တွေက အခု deprecated (ခေတ်နောက်ကျ) ဖြစ်သွားတဲ့ `prefetchQuery` နဲ့ `ensureQueryData` methods တွေရဲ့ နေရာကို အစားထိုးပါတယ်။ ဒီ guide ရဲ့ အဟောင်း ဗားရှင်းကို သုံးခဲ့ဖူးရင် — အဲဒီ methods တွေက TanStack Query ရဲ့ နောက် major version မှာ ဖယ်ရှားခံရမှာ ဖြစ်လို့ သတိပြုပါ။

Query တစ်ခုကို prefetch လုပ်ဖို့ `query` method ကို သုံးပါတယ်။ ဒီ method က default အနေနဲ့ —

- Query function ကို run လုပ်ပါတယ်
- Result ကို cache လုပ်ပါတယ်
- အဲဒီ query ရဲ့ result ကို ပြန်ပေးပါတယ်
- Error တစ်ခုခု ကြုံရရင် throw လုပ်ပါတယ်

Prefetching လုပ်တဲ့အခါ ဒီ defaults တွေကို ပြင်ဆင်ချင်တတ်ပါတယ်:

- Box ထဲက ထွက်တဲ့အတိုင်းဆိုရင် — `query` က `queryClient` အတွက် configure လုပ်ထားတဲ့ default `staleTime` ကို သုံးပြီး cache ထဲက ရှိပြီးသား data က fresh လား ဒါမှမဟုတ် ပြန် fetch ရမှာလား ဆုံးဖြတ်ပါတယ်
- ဒီလို သီးခြား `staleTime` တစ်ခုကိုလည်း ထည့်ပေးနိုင်ပါတယ်: `query({ queryKey: ['todos'], queryFn: fn, staleTime: 5000 })`
  - ဒီ `staleTime` က အဲဒီ query fetch အတွက်သာ သုံးတာပါ — `useQuery` ခေါ်တိုင်းမှာလည်း သီးခြား သတ်မှတ်ပေးရပါဦးမယ်
  - Cache ထဲမှာ data ရှိနေရင် default `staleTime` နဲ့ မသက်ဆိုင်ဘဲ အမြဲတမ်း ပြန်ပေးချင်တယ်ဆိုရင် — `staleTime` အတွက် `"static"` ကို ထည့်ပေးနိုင်ပါတယ်
  - Tip: Server ပေါ်မှာ prefetch လုပ်နေတယ်ဆိုရင် — prefetch ခေါ်တိုင်း သီးခြား `staleTime` ထည့်စရာ မလိုအောင် အဲဒီ `queryClient` အတွက် default `staleTime` ကို `0` ထက် ပိုမြင့်အောင် သတ်မှတ်ထားပါ
- Prefetch လုပ်ထားတဲ့ query အတွက် `useQuery` instance တွေ ဘာမှ မပေါ်ဘူးဆိုရင် — အဲဒီ query က `gcTime` မှာ သတ်မှတ်ထားတဲ့ အချိန် ပြည့်တာနဲ့ ဖျက်ပစ်ပြီး garbage collected ဖြစ်သွားပါမယ်
- သင့် prefetch က အရေးမကြီးတဲ့ data အတွက်ဆိုရင် — promise ကို `void` နဲ့ စွန့်ပစ်ပြီး `.catch(noop)` သုံးကာ errors တွေကို မျိုချနိုင်ပါတယ်။ Query က ပုံမှန်အားဖြင့် `useQuery` ထဲမှာ နောက်တစ်ကြိမ် ပြန် fetch ဖို့ ကြိုးစားပါလိမ့်မယ် — ဒါက ကောင်းမွန်တဲ့ graceful fallback (ချောမွေ့သော အရံရွေးချယ်မှု) တစ်ခုပါ။

`query` ကို သုံးပြီး prefetch လုပ်နည်း ဒီမှာ ကြည့်ရအောင်:

```tsx
import { noop } from '@tanstack/react-query'

const prefetchTodos = async () => {
  await queryClient
    .query({
      queryKey: ['todos'],
      queryFn: fetchTodos,
      // ဒီမှာ errors တွေကို မျိုချထားပါတယ် — ဘာကြောင့်လဲဆိုတော့
      // များသောအားဖြင့် `useQuery` ထဲမှာ နောက်တစ်ကြိမ် ပြန် fetch လုပ်လို့ပါ
    })
    .catch(noop)
}
```

Infinite Queries တွေကိုလည်း ပုံမှန် Queries တွေလိုပဲ prefetch လုပ်လို့ ရပါတယ်။ Default အနေနဲ့ — Query ရဲ့ ပထမဆုံး page တစ်ခုတည်းကိုသာ prefetch လုပ်ပြီး — သတ်မှတ်ထားတဲ့ QueryKey အောက်မှာ သိမ်းပါတယ်။ Page တစ်ခုထက်ပိုပြီး prefetch ချင်တယ်ဆိုရင် — `pages` option ကို သုံးနိုင်ပြီး — အဲဒီအခါ `getNextPageParam` function တစ်ခုကိုလည်း ထည့်ပေးရပါမယ်:

```tsx
import { noop } from '@tanstack/react-query'

const prefetchProjects = () => {
  await queryClient
    .infiniteQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      pages: 3, // ပထမ page ၃ ခုကို prefetch လုပ်ပါမယ်
    })
    .catch(noop)
}
```

ဆက်ပြီးတော့ — ဒီနည်းလမ်းတွေနဲ့ တခြားနည်းလမ်းတွေကို အခြေအနေအမျိုးမျိုးမှာ ဘယ်လို prefetch လုပ်နိုင်လဲ ကြည့်ရအောင်။

## Event Handlers တွေထဲမှာ Prefetch လုပ်ခြင်း

Prefetching ရဲ့ ရိုးရှင်းတဲ့ ပုံစံတစ်ခုက — user က တစ်ခုခုနဲ့ interact လုပ်တဲ့အခါ prefetch လုပ်တာပါ။ ဒီဥပမာမှာ `onMouseEnter` ဒါမှမဟုတ် `onFocus` ပေါ်မှာ prefetch စတင်ဖို့ `queryClient.query` ကို သုံးပါမယ်။

```tsx
function ShowDetailsButton() {
  const queryClient = useQueryClient()

  const prefetch = () => {
    void queryClient.query({
      queryKey: ['details'],
      queryFn: getDetailsData,
      // Prefetch က data က staleTime ထက် ပိုဟောင်းမှသာ ဖြစ်ပွားလို့
      // ဒီလိုအခြေအနေမျိုးမှာ တစ်ခု သေချာပေါက် သတ်မှတ်ထားချင်ပါတယ်
      staleTime: 60000,
    }).catch(noop)
  }

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch} onClick={...}>
      Show Details
    </button>
  )
}
```

## Components တွေထဲမှာ Prefetch လုပ်ခြင်း

Component lifecycle အတွင်း prefetching လုပ်တာက — တစ်ချို့ child ဒါမှမဟုတ် descendant တစ်ခုက ဒေတာတစ်ချို့ လိုအပ်မယ်ဆိုတာ သိပေမယ့် — တခြား query တစ်ခု loading ပြီးတဲ့အထိ အဲဒါကို render မလုပ်နိုင်တဲ့အခါ အသုံးဝင်ပါတယ်။ ရှင်းပြဖို့ Request Waterfall guide ကနေ ဥပမာတစ်ခု ငှားသုံးကြည့်ရအောင်:

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

ဒါက ဒီလို request waterfall တစ်ခုကို ဖြစ်စေပါတယ်:

```
1. |> getArticleById()
2.   |> getArticleCommentsById()
```

အဲဒီ guide ထဲမှာ ပြောထားသလို — ဒီ waterfall ကို ပြားချပ်စေဖို့ နဲ့ performance မြှင့်တင်ဖို့ နည်းလမ်းတစ်ခုက — `getArticleCommentsById` query ကို parent ဆီ မြှောက်တင်ပြီး ရလဒ်ကို prop အဖြစ် အောက်ကို ပို့ပေးတာပါ — ဒါပေမယ့် ဒါက မဖြစ်နိုင်ဘူး ဒါမှမဟုတ် မလိုချင်ဘူးဆိုရင်ကော — ဥပမာ components တွေက တစ်ခုနဲ့တစ်ခု မဆိုင်ဘဲ — ကြားထဲမှာ အဆင့်ပေါင်းများစွာ ရှိနေရင်ကောပါ။

အဲဒီလိုအခြေအနေမျိုးမှာ — parent ထဲမှာပဲ query ကို prefetch လုပ်လို့ ရပါတယ်။ အရိုးရှင်းဆုံး နည်းကတော့ — query တစ်ခုကို သုံးပြီး result ကို ignore လုပ်တာပါ:

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  // Prefetch
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    // ဒီ query ပြောင်းတဲ့အခါ rerenders တွေ မဖြစ်အောင် optional optimization:
    notifyOnChangeProps: [],
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

ဒါက `'article-comments'` ကို ချက်ချင်း fetch စေပြီး waterfall ကို ပြားချပ်စေပါတယ်:

```
1. |> getArticleById()
1. |> getArticleCommentsById()
```

Suspense နဲ့အတူ prefetch လုပ်ချင်တယ်ဆိုရင်တော့ — နည်းနည်း ခြားနားစွာ လုပ်ရပါမယ်။ Prefetch လုပ်ဖို့ `useSuspenseQueries` ကို သုံးလို့ မရပါဘူး — prefetch က component ကို render မဖြစ်အောင် ပိတ်ဆို့ (block) ထားလို့ပါ။ `useQuery` ကိုလည်း prefetch အတွက် မသုံးနိုင်ပါဘူး — suspenseful query က resolve မဖြစ်မချင်း prefetch ကို စတင်မှာ မဟုတ်လို့ပါ။ ဒီလိုအခြေအနေမျိုးအတွက် — library ထဲမှာ ပါဝင်တဲ့ [`usePrefetchQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/usePrefetchQuery) ဒါမှမဟုတ် [`usePrefetchInfiniteQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/usePrefetchInfiniteQuery) hooks တွေကို သုံးနိုင်ပါတယ်။

Data တကယ် လိုအပ်တဲ့ component ထဲမှာ `useSuspenseQuery` ကို အခု သုံးလို့ ရပါပြီ။ ဒီနောက်က component ကို ကိုယ်ပိုင် `<Suspense>` boundary တစ်ခုနဲ့ ထုပ်ဖို့ စဉ်းစားချင်ပါလိမ့်မယ် — ဒါကြောင့် ကျွန်တော်တို့ prefetch လုပ်နေတဲ့ "secondary" query က "primary" data ရဲ့ rendering ကို မပိတ်ဆို့အောင် လုပ်ပေးမှာပါ။

```tsx
function ArticleLayout({ id }) {
  usePrefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  return (
    <Suspense fallback="Loading article">
      <Article id={id} />
    </Suspense>
  )
}

function Article({ id }) {
  const { data: articleData, isPending } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  ...
}
```

နောက်ထပ် နည်းတစ်ခုက — query function ထဲမှာပဲ prefetch လုပ်တာပါ။ Article တစ်ခုကို fetch လုပ်တိုင်း comments တွေလည်း လိုအပ်ဖို့ အလားအလာ မြင့်မားတယ်ဆိုတာ သိနေရင် ဒါက အဓိပ္ပာယ်ရှိပါတယ်။ ဒီအတွက် `queryClient.query` ကို သုံးပါမယ်:

```tsx
const queryClient = useQueryClient()
const { data: articleData, isPending } = useQuery({
  queryKey: ['article', id],
  queryFn: (...args) => {
    void queryClient
      .query({
        queryKey: ['article-comments', id],
        queryFn: getArticleCommentsById,
      })
      .catch(noop)

    return getArticleById(...args)
  },
})
```

Effect ထဲမှာ prefetching လုပ်တာလည်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် သတိပြုရမှာက — တူညီတဲ့ component ထဲမှာ `useSuspenseQuery` သုံးနေတယ်ဆိုရင် — ဒီ effect က query ပြီးတဲ့ **နောက်မှသာ** run မှာမို့ — သင်လိုချင်တာနဲ့ မတူညီနိုင်ပါဘူး။

```tsx
const queryClient = useQueryClient()

useEffect(() => {
  void queryClient
    .query({
      queryKey: ['article-comments', id],
      queryFn: getArticleCommentsById,
    })
    .catch(noop)
}, [queryClient, id])
```

အကျဉ်းချုပ်ပြောရရင် — component lifecycle အတွင်း query တစ်ခုကို prefetch လုပ်ချင်တယ်ဆိုရင် နည်းလမ်းမျိုးစုံ ရှိပြီး — သင့်အခြေအနေနဲ့ အသင့်တော်ဆုံး တစ်ခုကို ရွေးပါ:

- Suspense boundary ရဲ့ ရှေ့မှာ `usePrefetchQuery` ဒါမှမဟုတ် `usePrefetchInfiniteQuery` hooks တွေနဲ့ prefetch လုပ်ပါ
- `useQuery` ဒါမှမဟုတ် `useSuspenseQueries` ကို သုံးပြီး result ကို ignore လုပ်ပါ
- Query function ထဲမှာ prefetch လုပ်ပါ
- Effect တစ်ခုထဲမှာ prefetch လုပ်ပါ

ဆက်ပြီးတော့ — နည်းနည်း ပိုအဆင့်မြင့်တဲ့ ကိစ္စတစ်ခုကို ကြည့်ရအောင်။

### Dependent Queries နဲ့ Code Splitting

တစ်ခါတလေ — တခြား fetch တစ်ခုရဲ့ ရလဒ်ကို အခြေခံပြီး ခြွင်းချက်အလိုက် (conditionally) prefetch လုပ်ချင်တတ်ပါတယ်။ [Performance & Request Waterfalls guide](/docs/tanstack-query/request-waterfalls) ကနေ ယူထားတဲ့ ဒီဥပမာကို စဉ်းစားကြည့်ပါ:

```tsx
// ဒါက GraphFeedItem component ကို lazy load လုပ်ပါတယ် — ဆိုလိုတာက
// တစ်ခုခုက ဒါကို render လုပ်တဲ့အထိ loading စတင်မှာ မဟုတ်ပါဘူး
const GraphFeedItem = React.lazy(() => import('./GraphFeedItem'))

function Feed() {
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  })

  if (isPending) {
    return 'Loading feed...'
  }

  return (
    <>
      {data.map((feedItem) => {
        if (feedItem.type === 'GRAPH') {
          return <GraphFeedItem key={feedItem.id} feedItem={feedItem} />
        }

        return <StandardFeedItem key={feedItem.id} feedItem={feedItem} />
      })}
    </>
  )
}

// GraphFeedItem.tsx
function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

အဲဒီ guide မှာ မှတ်ချက်ပြုထားသလို — ဒီဥပမာက ဒီလို request waterfall နှစ်ထပ် ဖြစ်စေပါတယ်:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

သင့် API ကို ပြန်စီစဉ်ပြီး `getFeed()` က `getGraphDataById()` ရဲ့ data ကိုပါ လိုအပ်တဲ့အခါ ပြန်ပေးနိုင်အောင် လုပ်လို့ မရဘူးဆိုရင် — `getFeed->getGraphDataById` waterfall ကို လုံးဝ ဖယ်ရှားဖို့ နည်းလမ်း မရှိပါဘူး — ဒါပေမယ့် conditional prefetching ကို အသုံးချပြီး code ရော data ရော အနည်းဆုံး parallel ဖြစ်အောင် load လုပ်နိုင်ပါတယ်။ အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ — ဒါကို လုပ်ဖို့ နည်းလမ်းမျိုးစုံ ရှိပါတယ် — ဒါပေမယ့် ဒီဥပမာမှာတော့ query function ထဲမှာ လုပ်ပါမယ်:

```tsx
function Feed() {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: async (...args) => {
      const feed = await getFeed(...args)

      for (const feedItem of feed) {
        if (feedItem.type === 'GRAPH') {
          void queryClient.query({
            queryKey: ['graph', feedItem.id],
            queryFn: getGraphDataById,
          }).catch(noop)
        }
      }

      return feed
    }
  })

  ...
}
```

ဒါက code ရော data ရော parallel ဖြစ်အောင် load လုပ်ပါလိမ့်မယ်:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
2.   |> getGraphDataById()
```

ဒါပေမယ့် tradeoff (အပေးအယူ) တစ်ခု ရှိပါတယ် — `getGraphDataById` ရဲ့ code က အခုဆို `JS for <GraphFeedItem>` ထဲမှာ အစား parent bundle ထဲမှာ ပါဝင်သွားပါတယ် — ဒါကြောင့် ကိစ္စတစ်ခုချင်းစီအလိုက် ဘယ်ဟာက performance အတွက် အကောင်းဆုံး tradeoff လဲ သင်ကိုယ်တိုင် ဆုံးဖြတ်ရပါမယ်။ `GraphFeedItem` တွေ ဖြစ်နိုင်ခြေ များတယ်ဆိုရင် — code ကို parent ထဲ ထည့်တာ ထိုက်တန်ပါတယ်။ အလွန် ရှားပါးတယ်ဆိုရင်တော့ — မထည့်တာ ဖြစ်နိုင်ပါတယ်။

## Router Integration

Component tree ထဲမှာ data fetching လုပ်တာက request waterfalls တွေကို အလွယ်တကူ ဖြစ်စေနိုင်ပြီး — အဲဒါတွေအတွက် ပြင်ဆင်ချက်တွေက application တစ်လျှောက် စုပုံလာတာနဲ့ ခက်ခဲလာတတ်လို့ — prefetching လုပ်ဖို့ ဆွဲဆောင်မှုရှိတဲ့ နည်းလမ်းတစ်ခုက — router အဆင့်မှာ ပေါင်းစပ်လုပ်တာပါ။

ဒီ approach မှာ — _route_ တစ်ခုချင်းစီအတွက် အဲဒီ component tree က ဘယ်ဒေတာတွေ လိုအပ်မယ်ဆိုတာကို ကြိုတင် ရှင်းရှင်းလင်းလင်း ကြေညာထားပါတယ်။ Server Rendering က အစဉ်အလာအရ rendering မစတင်ခင် data အားလုံး load ဖြစ်ဖို့ လိုတာမို့ — ဒါက SSR လုပ်ထားတဲ့ apps တွေအတွက် ကြာမြင့်စွာ လွှမ်းမိုးထားတဲ့ approach ဖြစ်ခဲ့ပါတယ်။ ဒါက ဆက်ပြီး အသုံးများတဲ့ approach တစ်ခု ဖြစ်နေဆဲပါ — [Server Rendering & Hydration guide](/docs/tanstack-query/ssr) မှာ ပိုပြီး ဖတ်နိုင်ပါတယ်။

အခုတော့ client ဘက်ကို အာရုံစိုက်ပြီး — [TanStack Router](https://tanstack.com/router) နဲ့ ဒါကို ဘယ်လို အလုပ်ဖြစ်အောင် လုပ်မလဲဆိုတဲ့ ဥပမာကို ကြည့်ရအောင်။ ဒီဥပမာတွေက concise ဖြစ်အောင် setup နဲ့ boilerplate တွေ အများကြီး ချန်လှပ်ထားပါတယ် — [TanStack Router docs](https://tanstack.com/router/latest/docs) ထဲက [full React Query example](https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query-file-based) ကို ကြည့်နိုင်ပါတယ်။

Router အဆင့်မှာ ပေါင်းစပ်တဲ့အခါ — ရွေးချယ်စရာ နှစ်မျိုး ရှိပါတယ်: data အားလုံး ရောက်တဲ့အထိ အဲဒီ route ရဲ့ rendering ကို _ပိတ်ဆို့ (block)_ ထားနိုင်သလို — prefetch ကို စတင်ပြီး result ကို မစောင့်ဘဲလည်း ထားနိုင်ပါတယ်။ အဲဒီလိုဆိုရင် route ကို တတ်နိုင်သမျှ မြန်မြန် render စနိုင်ပါတယ်။ ဒီနည်း နှစ်မျိုးကို ရောသုံးပြီး — အရေးကြီးတဲ့ data တစ်ချို့ကို စောင့်ပေမယ့် — secondary data တွေ အားလုံး ပြီးတာကို မစောင့်ဘဲ rendering စတင်တာမျိုးလည်း လုပ်နိုင်ပါတယ်။ ဒီဥပမာမှာ — article data မပြီးမချင်း `/article` route ကို render မလုပ်အောင် configure လုပ်ပြီး — comments တွေကိုတော့ တတ်နိုင်သမျှ မြန်မြန် prefetch စတင်ပေမယ့် — comments မပြီးသေးရင်လည်း route ရဲ့ rendering ကို မပိတ်ဆို့ပါဘူး။

Route loaders အများစုက error fallbacks တွေကို trigger လုပ်ဖို့ error boundaries တွေကို သုံးတာကို သတိပြုပါ။ အခုအထိ ကျွန်တော်တို့က `useQuery` က ပြန် retry လုပ်မယ့် data တွေရဲ့ errors တွေကို ignore လုပ်ဖို့ `.catch(noop)` ကို သုံးခဲ့ပေမယ့် — route က မရှိဘဲ အလုပ်မဖြစ်တဲ့ အရေးကြီး data တွေအတွက်တော့ — `noop` မပါဘဲ promise ကို `await` လုပ်ပြီး error ကို `try` block ထဲမှာ ဒါမှမဟုတ် router ရဲ့ error handling (TanStack Router ရဲ့ `errorComponent` လိုမျိုး) နဲ့ ကိုင်တွယ်သင့်ပါတယ်။

```tsx
const queryClient = new QueryClient()
const routerContext = new RouterContext()
const rootRoute = routerContext.createRootRoute({
  component: () => { ... }
})

const articleRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'article',
  beforeLoad: () => {
    return {
      articleQueryOptions: { queryKey: ['article'], queryFn: fetchArticle },
      commentsQueryOptions: { queryKey: ['comments'], queryFn: fetchComments },
    }
  },
  loader: async ({
    context: { queryClient },
    routeContext: { articleQueryOptions, commentsQueryOptions },
  }) => {
    // Comments တွေကို တတ်နိုင်သမျှ မြန်မြန် fetch လုပ်ပါ — ဒါပေမယ့်
    // မပိတ်ဆို့ဘူး၊ errors တွေကိုလည်း မပစ်ဘူး
    void queryClient.query(commentsQueryOptions).catch(noop)

    // Article fetch ပြီးတဲ့အထိ route ကို လုံးဝ render မလုပ်ပါနဲ့
    // ဒါက အရေးကြီးတဲ့ data မို့ တစ်ခုခု မှားရင် error component က
    // တတ်နိုင်သမျှ မြန်မြန် trigger ဖြစ်စေချင်ပါတယ်
    await queryClient.query({
      ...articleQueryOptions,
      // Article ကို အရင်ကတည်းက load ပြီးသားဆိုရင် အပို prefetch ပေါ်မှာ
      // မပိတ်ဆို့ချင်ပါဘူး; data ကို fresh ဖြစ်အောင် ထားဖို့
      // default useQuery အပြုအမူပေါ်ကို မှီခိုပါ
      staleTime: 'static'
    })
  },
  component: ({ useRouteContext }) => {
    const { articleQueryOptions, commentsQueryOptions } = useRouteContext()
    const articleQuery = useQuery(articleQueryOptions)
    const commentsQuery = useQuery(commentsQueryOptions)

    return (
      ...
    )
  },
  errorComponent: () => 'Oh crap!',
})
```

တခြား routers တွေနဲ့လည်း ပေါင်းစပ်လုပ်လို့ ရပါတယ် — နောက်ထပ် သရုပ်ပြမှုတစ်ခုအတွက် [react-router](https://tanstack.com/query/latest/docs/framework/react/examples/react-router) ကို ကြည့်ပါ။

## Query တစ်ခုကို Manually Prime လုပ်ခြင်း

သင့်ရဲ့ query အတွက် data ကို synchronously (ထပ်တူကျစွာ) ရနိုင်ပြီးသားဆိုရင် — prefetch လုပ်စရာ မလိုပါဘူး။ [Query Client ရဲ့ `setQueryData` method](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata) ကို သုံးပြီး query တစ်ခုရဲ့ cached result ကို key နဲ့ တိုက်ရိုက် ထည့်သွင်း ဒါမှမဟုတ် update လုပ်နိုင်ပါတယ်။

```tsx
queryClient.setQueryData(['todos'], todos)
```

## ဆက်လက်ဖတ်ရှုရန်

Fetch မလုပ်ခင် သင့် Query Cache ထဲကို data တွေ ဘယ်လို ထည့်သွင်းမလဲဆိုတဲ့ နက်နက်ရှိုင်းရှိုင်း လေ့လာမှုအတွက် — TkDodo ရဲ့ [Seeding the Query Cache](https://tkdodo.eu/blog/seeding-the-query-cache) ဆောင်းပါးကို ကြည့်ပါ။

Server ဘက်က routers နဲ့ frameworks တွေနဲ့ ပေါင်းစပ်တာက ကျွန်တော်တို့ အခုလေးတင် မြင်ခဲ့တာနဲ့ အတော်လေး ဆင်ပါတယ် — ထပ်ဆောင်းချက်ကတော့ data ကို server ကနေ client ဆီ ပို့ပြီး အဲဒီမှာ cache ထဲကို hydrate လုပ်ရတာပါ။ ဘယ်လို လုပ်ရမလဲ သိချင်ရင် — [Server Rendering & Hydration guide](/docs/tanstack-query/ssr) ကို ဆက်ဖတ်ပါ။
