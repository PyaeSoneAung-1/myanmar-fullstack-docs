---
title: "Performance & Request Waterfalls (စွမ်းဆောင်ရည်နဲ့ Request Waterfalls)"
description: "Request waterfalls ဆိုတာ ဘာလဲ၊ ဘယ်လို ရှာဖွေတွေ့ရှိမလဲ၊ ဘယ်လို ရှောင်ရှားမလဲ — serial queries, nested component waterfalls, code splitting တွေကို ပြားချပ်အောင် လုပ်နည်း"
order: 31
source: "https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls"
status: translated
updated: 2026-09-01
---

Application performance က ကျယ်ပြန့်ပြီး ရှုပ်ထွေးတဲ့ နယ်ပယ်တစ်ခုပါ — React Query က သင့် APIs တွေကို ပိုမြန်အောင် လုပ်ပေးနိုင်မှာ မဟုတ်ပေမယ့် — React Query ကို ဘယ်လို သုံးမလဲဆိုတာမှာ အကောင်းဆုံး performance ရဖို့ သတိထားစရာ အချက်တွေ ရှိပါတယ်။

React Query သုံးတဲ့အခါ — ဒါမှမဟုတ် components တွေထဲမှာ data fetch လုပ်ခွင့်ပေးတဲ့ ဘယ် data fetching library သုံးတဲ့အခါမဆို — အကြီးဆုံး performance အန္တရာယ်က request waterfalls ပါ။ ဒီ page ရဲ့ ကျန်တဲ့ အပိုင်းတွေက — ဒါတွေက ဘာလဲ၊ ဘယ်လို ရှာဖွေတွေ့ရှိမလဲ၊ သင့် application ဒါမှမဟုတ် APIs တွေကို ဘယ်လို ပြန်ဖွဲ့စည်းပြီး ရှောင်ရှားနိုင်မလဲဆိုတာ ရှင်းပြပါလိမ့်မယ်။

[Prefetching & Router Integration guide](/docs/tanstack-query/prefetching) က ဒါပေါ်မှာ ဆက်တည်ဆောက်ပြီး — သင့် application ဒါမှမဟုတ် APIs တွေကို ပြန်ဖွဲ့စည်းဖို့ မဖြစ်နိုင် ဒါမှမဟုတ် မလွယ်ကူတဲ့အခါ — data တွေကို ကြိုတင် (prefetch) ဘယ်လို ယူရမလဲဆိုတာ သင်ပေးပါတယ်။

[Server Rendering & Hydration guide](/docs/tanstack-query/ssr) က — server ပေါ်မှာ data တွေကို ဘယ်လို prefetch လုပ်ပြီး — client မှာ ပြန် fetch လုပ်စရာ မလိုအောင် ဒီ data တွေကို client ဆီ ဘယ်လို ပို့ပေးရမလဲဆိုတာ သင်ပေးပါတယ်။

[Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) ကတော့ — ဒီ patterns တွေကို Server Components နဲ့ Streaming Server Rendering မှာ ဘယ်လို အသုံးချရမလဲဆိုတာကို ထပ်ဆင့် သင်ပေးပါတယ်။

## Request Waterfall ဆိုတာ ဘာလဲ

Request waterfall ဆိုတာ — resource တစ်ခုအတွက် (code, css, images, data) request တစ်ခုက တခြား resource တစ်ခုအတွက် request တစ်ခု ပြီးသွားမှသာ စတင်တဲ့ အဖြစ်အပျက်ပါ။

Web page တစ်ခုကို စဉ်းစားကြည့်ပါ။ CSS၊ JS စတာတွေကို load မလုပ်ခင် — browser က markup ကို အရင်ဆုံး load လုပ်ဖို့ လိုပါတယ်။ ဒါက request waterfall ပါ။

```
1. |-> Markup
2.   |-> CSS
2.   |-> JS
2.   |-> Image
```

CSS ကို JS file တစ်ခုထဲမှာ fetch လုပ်မယ်ဆိုရင် — double waterfall (နှစ်ထပ် waterfall) ရပါပြီ:

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
```

အဲဒီ CSS က background image တစ်ခု သုံးမယ်ဆိုရင် — triple waterfall (သုံးထပ် waterfall) ဖြစ်ပါတယ်:

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
4.       |-> Image
```

သင့် request waterfalls တွေကို ရှာဖွေပြီး ခွဲခြမ်းစိတ်ဖြာဖို့ အကောင်းဆုံး နည်းလမ်းက — ပုံမှန်အားဖြင့် သင့် browser ရဲ့ devtools "Network" tab ကို ဖွင့်ကြည့်တာပါ။

Waterfall တစ်ခုချင်းစီက server ဆီ roundtrip အနည်းဆုံး တစ်ကြိမ် ကိုယ်စားပြုပါတယ် — resource က local မှာ cached မဖြစ်ရင် (လက်တွေ့မှာတော့ ဒီ waterfalls တစ်ချို့က roundtrip တစ်ခုထက်ပိုပြီး ကိုယ်စားပြုနိုင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ browser က connection တစ်ခု တည်ဆောက်ဖို့ အပြန်အလှန် လုပ်ဆောင်ချက်တွေ လိုလို့ပါ — ဒါပေမယ့် ဒီမှာ အဲဒါကို မစဉ်းစားတော့ပါဘူး)။ ဒါကြောင့် — request waterfalls တွေရဲ့ ဆိုးကျိုးတွေက user ရဲ့ latency ပေါ်မှာ အများကြီး မူတည်ပါတယ်။ Triple waterfall ရဲ့ ဥပမာကို ကြည့်ကြည့်ပါ — ဒါက တကယ်တော့ server roundtrip ၄ ကြိမ် ကိုယ်စားပြုပါတယ်။ 3g networks တွေ ဒါမှမဟုတ် network အခြေအနေ ဆိုးတဲ့နေရာတွေမှာ မဆန်းတဲ့ 250ms latency နဲ့ဆိုရင် — latency ကိုပဲ ရေတွက်ရင် 4\*250=1000ms စုစုပေါင်း အချိန် ဖြစ်ပါတယ်။ ဒါကို roundtrip ၂ ခုပဲ ရှိတဲ့ ပထမဆုံး ဥပမာလို ပြားချပ်အောင် လုပ်နိုင်ခဲ့ရင် — 500ms ရမှာပါ — နောက်ခံ image ကို တစ်ဝက်လောက် အချိန်ထဲမှာ load လုပ်နိုင်မှာပါ!

## Request Waterfalls နဲ့ React Query

အခု React Query ကို စဉ်းစားကြည့်ရအောင်။ Server Rendering မပါတဲ့ အခြေအနေကို အရင်ကြည့်ပါမယ်။ Query စလုပ်ဖို့တောင် — JS ကို အရင်ဆုံး load လုပ်ဖို့ လိုပါတယ် — ဒါကြောင့် data ကို screen ပေါ်မှာ မပြခင် — double waterfall ရှိပါတယ်:

```
1. |-> Markup
2.   |-> JS
3.     |-> Query
```

ဒါကို အခြေခံပြီး — React Query မှာ Request Waterfalls တွေ ဖြစ်စေနိုင်တဲ့ pattern အချို့နဲ့ ဒါတွေကို ဘယ်လို ရှောင်ရမလဲဆိုတာ ကြည့်ကြရအောင်။

- Single Component Waterfalls / Serial Queries
- Nested Component Waterfalls
- Code Splitting

### Single Component Waterfalls / Serial Queries

Component တစ်ခုတည်းက query တစ်ခုကို အရင်ဆုံး fetch လုပ်ပြီး နောက်တစ်ခုကို ဆက်လုပ်တဲ့အခါ — အဲဒါ request waterfall ပါ။ ဒုတိယ query က [Dependent Query](/docs/tanstack-query/dependent-queries) ဖြစ်နေရင် — ဆိုလိုတာက fetch လုပ်တဲ့အခါ ပထမ query ရဲ့ data ပေါ် မူတည်နေရင် — ဒီလို ဖြစ်တတ်ပါတယ်:

```tsx
// User ကို ယူမယ်
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// ပြီးတော့ user ရဲ့ projects တွေကို ယူမယ်
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // userId ရှိမှသာ query က execute ဖြစ်ပါမယ်
  enabled: !!userId,
})
```

အမြဲတမ်း ဖြစ်နိုင်တာတော့ မဟုတ်ပေမယ့် — အကောင်းဆုံး performance အတွက်တော့ ဒီနှစ်ခုလုံးကို query တစ်ခုတည်းထဲမှာ fetch လုပ်နိုင်အောင် သင့် API ကို ပြန်ဖွဲ့စည်းတာက ပိုကောင်းပါတယ်။ အပေါ်က ဥပမာမှာ — `getProjectsByUser` ကို လုပ်နိုင်ဖို့ `getUserByEmail` ကို အရင် fetch လုပ်မယ့်အစား — `getProjectsByUserEmail` ဆိုတဲ့ query အသစ်တစ်ခု ထည့်လိုက်ရင် waterfall ကို ပြားချပ်အောင် လုပ်နိုင်ပါတယ်။

> Dependent queries တွေကို API ကို ပြန်ဖွဲ့စည်းစရာ မလိုဘဲ လျော့ပါးစေမယ့် နောက်တစ်နည်းက — waterfall ကို latency ပိုနည်းတဲ့ server ဆီ ရွှေ့လိုက်တာပါ။ ဒါက [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) မှာ ဖော်ပြထားတဲ့ Server Components တွေရဲ့ နောက်ကွယ်က အယူအဆပါ။

Serial queries တွေရဲ့ နောက်ထပ် ဥပမာတစ်ခုက — React Query ကို Suspense နဲ့ သုံးတဲ့အခါပါ:

```tsx
function App () {
  // အောက်က queries တွေက serial ဖြစ်ဖြစ် execute လုပ်ပြီး server ဆီ သီးခြား roundtrips တွေ ဖြစ်စေပါတယ်:
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects })

  // အပေါ်က queries တွေက rendering ကို suspend လုပ်လို့ — queries တွေ အားလုံး ပြီးတဲ့အထိ
  // data ဘာမှ render မဖြစ်ဘူးဆိုတာ သတိပြုပါ
  ...
}
```

ပုံမှန် `useQuery` နဲ့ဆိုရင် ဒါတွေက parallel ဖြစ်ဖြစ် ဖြစ်မယ်ဆိုတာ သတိပြုပါ။

ကံကောင်းချင်တော့ — component တစ်ခုထဲမှာ suspenseful queries များစွာ ရှိတဲ့အခါ `useSuspenseQueries` hook ကို အမြဲ သုံးခြင်းအားဖြင့် ဒါကို လွယ်လွယ်ကူကူ ပြင်လို့ ရပါတယ်။

```tsx
const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
    { queryKey: ['projects'], queryFn: fetchProjects },
  ],
})
```

### Nested Component Waterfalls

Nested Component Waterfalls ဆိုတာ — parent နဲ့ child component နှစ်ခုလုံးမှာ queries တွေ ရှိပြီး — parent ရဲ့ query ပြီးမှသာ child ကို render လုပ်တဲ့ အခြေအနေပါ။ ဒါက `useQuery` ရော `useSuspenseQuery` နဲ့ပါ ဖြစ်နိုင်ပါတယ်။

Child က parent ထဲက data ပေါ် အခြေခံပြီး conditional ဖြစ် render လုပ်တယ် — ဒါမှမဟုတ် child က သူ့ရဲ့ query လုပ်ဖို့ parent ကနေ prop အဖြစ် အောက်ကို ပို့ပေးတဲ့ result ရဲ့ အစိတ်အပိုင်းတစ်ခုခုပေါ် မူတည်နေတယ်ဆိုရင် — ဒါက _dependent_ (မှီခိုနေတဲ့) nested component waterfall ပါ။

Child က parent ပေါ် **မမှီခို**တဲ့ ဥပမာတစ်ခုကို အရင်ကြည့်ရအောင်။

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

`<Comments>` က parent ကနေ `id` prop တစ်ခု ယူပေမယ့် — `<Article>` render လုပ်တဲ့အခါ အဲဒီ id က ရှိပြီးသားမို့ — comments တွေကို article နဲ့ အတူတူ တစ်ချိန်တည်း fetch မလုပ်နိုင်စရာ အကြောင်းမရှိဘူးဆိုတာ သတိပြုပါ။ Real world applications တွေမှာ — child က parent ရဲ့ အောက်နက် နေရာတွေမှာ ရှိနေနိုင်ပြီး — ဒီလို waterfalls တွေက ရှာဖွေရ ပြင်ရ ပိုခက်တတ်ပါတယ် — ဒါပေမယ့် ကျွန်တော်တို့ ဥပမာအတွက်တော့ — waterfall ကို ပြားချပ်အောင် လုပ်နိုင်တဲ့ နည်းတစ်နည်းက comments query ကို parent ဆီ hoist (မြှောက်တင်) လုပ်လိုက်တာပါ:

```tsx
function Article({ id }) {
  const { data: articleData, isPending: articlePending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  const { data: commentsData, isPending: commentsPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  if (articlePending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      {commentsPending ? (
        'Loading comments...'
      ) : (
        <Comments commentsData={commentsData} />
      )}
    </>
  )
}
```

Query နှစ်ခုက အခုဆိုရင် parallel ဖြစ်ဖြစ် fetch လုပ်ပါလိမ့်မယ်။ Suspense သုံးနေတယ်ဆိုရင် — ဒီ query နှစ်ခုကို `useSuspenseQueries` တစ်ခုတည်းထဲ ပေါင်းထည့်ချင်ပါလိမ့်မယ်ဆိုတာ သတိပြုပါ။

ဒီ waterfall ကို ပြားချပ်အောင် လုပ်မယ့် နောက်တစ်နည်းက — `<Article>` component ထဲမှာ comments တွေကို prefetch လုပ်တာ ဒါမှမဟုတ် — page load ဒါမှမဟုတ် page navigation မှာ router အဆင့်ကနေ ဒီ query နှစ်ခုလုံးကို prefetch လုပ်တာပါ — [Prefetching & Router Integration guide](/docs/tanstack-query/prefetching) မှာ ဒီအကြောင်း ထပ်ဖတ်ပါ။

နောက်တစ်ခု — _Dependent Nested Component Waterfall_ ကို ကြည့်ရအောင်။

```tsx
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

function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

ဒုတိယ query `getGraphDataById` က သူ့ parent ပေါ် နည်းနှစ်မျိုးနဲ့ မှီခိုနေပါတယ်။ ပထမဆုံး — `feedItem` က graph ဖြစ်မှသာ ဒါက ဘယ်တော့မှ မဖြစ်ပါဘူး၊ ဒုတိယ — parent ကနေ `id` တစ်ခု လိုပါတယ်။

```
1. |> getFeed()
2.   |> getGraphDataById()
```

ဒီဥပမာမှာတော့ — query ကို parent ဆီ hoist လုပ်ရုံ ဒါမှမဟုတ် prefetching ထည့်ရုံနဲ့ waterfall ကို လွယ်လွယ် ပြားချပ်အောင် မလုပ်နိုင်ပါဘူး။ ဒီ guide ရဲ့ အစမှာ ရှိတဲ့ dependent query ဥပမာလိုပဲ — ရွေးစရာတစ်ခုက graph data ကို `getFeed` query ထဲမှာ ထည့်သွင်းဖို့ ကျွန်တော်တို့ရဲ့ API ကို ပြန်ဖွဲ့စည်းလိုက်တာပါ။ နောက်ထပ် ပိုအဆင့်မြင့်တဲ့ solution တစ်ခုက — waterfall ကို latency ပိုနည်းတဲ့ server ဆီ ရွှေ့ဖို့ Server Components တွေကို အသုံးချတာပါ ([Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) မှာ ထပ်ဖတ်ပါ) — ဒါပေမယ့် ဒါက အတော်ကြီးမားတဲ့ architectural change တစ်ခု ဖြစ်နိုင်တာကို သတိပြုပါ။

ဒီနေရာလေးမှာ ဒီလို query waterfalls အနည်းငယ် ရှိနေရင်တောင် performance ကောင်းကောင်း ရနိုင်ပါတယ် — ဒါတွေက အဖြစ်များတဲ့ performance စိုးရိမ်စရာတစ်ခုဆိုတာကို သိထားပြီး သတိထားနေဖို့ပဲ လိုပါတယ်။ အထူးသဖြင့် ဆိုးရွားတဲ့ ပုံစံတစ်ခုက Code Splitting ပါလာတဲ့အခါပါ — ဒါကို နောက်တစ်ခု ကြည့်ရအောင်။

### Code Splitting

Application တစ်ခုရဲ့ JS-code ကို သေးငယ်တဲ့ chunks တွေအဖြစ် ခွဲပြီး လိုအပ်တဲ့ အပိုင်းတွေကိုသာ load လုပ်တာက — ကောင်းတဲ့ performance ရဖို့ မကြာခဏ အရေးကြီးတဲ့ step တစ်ခုပါ။ ဒါပေမယ့် အားနည်းချက်တစ်ခု ရှိပါတယ် — မကြာခဏ request waterfalls တွေကို ဖြစ်စေတတ်လို့ပါ။ အဲဒီ code split လုပ်ထားတဲ့ code ထဲမှာ query တစ်ခုပါ ပါနေရင် — ဒီပြဿနာက ပိုဆိုးလာပါတယ်။

Feed ဥပမာရဲ့ အနည်းငယ် ပြုပြင်ထားတဲ့ ဗားရှင်းတစ်ခုကို စဉ်းစားကြည့်ပါ။

```tsx
// ဒါက GraphFeedItem component ကို lazy load လုပ်ပါတယ် — ဆိုလိုတာက
// တစ်ခုခုက ဒါကို render လုပ်တဲ့အထိ load စတင်မှာ မဟုတ်ပါဘူး
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

ဒီဥပမာမှာ double waterfall ရှိပြီး ဒီလို ပုံစံ ဖြစ်ပါတယ်:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

ဒါက ဥပမာထဲက code ကိုပဲ ကြည့်တာပါ — ဒီ page ရဲ့ ပထမဆုံး page load က ဘယ်လိုပုံစံ ဖြစ်မလဲ စဉ်းစားကြည့်ရင် — graph ကို render မလုပ်နိုင်ခင် server ဆီ round trips ၅ ကြိမ် ပြီးမြောက်ဖို့ လိုပါတယ်!

```
1. |> Markup
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

Server rendering လုပ်တဲ့အခါ ဒါက နည်းနည်း ကွဲပြားတာကို သတိပြုပါ — ဒါကို [Server Rendering & Hydration guide](/docs/tanstack-query/ssr) မှာ ထပ်လေ့လာပါမယ်။ `<Feed>` ပါတဲ့ route ကိုယ်တိုင်လည်း code split လုပ်ထားတာ မဆန်းဘူးဆိုတာလည်း သတိပြုပါ — ဒါက နောက်ထပ် hop တစ်ခု ထပ်ဖြစ်စေနိုင်ပါတယ်။

Code split ဖြစ်တဲ့ အခြေအနေမှာ — `getGraphDataById` query ကို `<Feed>` component ဆီ hoist လုပ်ပြီး conditional ဖြစ်အောင် လုပ်တာ ဒါမှမဟုတ် conditional prefetch တစ်ခု ထည့်တာက တကယ် အကူအညီ ဖြစ်နိုင်ပါတယ်။ အဲဒီ query ကို code နဲ့ parallel ဖြစ်အောင် fetch လုပ်နိုင်ပြီး — ဥပမာ အပိုင်းကို ဒီလို ပြောင်းနိုင်ပါတယ်:

```
1. |> getFeed()
2.   |> getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

ဒါပေမယ့် ဒါက tradeoff တစ်ခုပါ။ သင်က အခုဆိုရင် `getGraphDataById` အတွက် data fetching code ကို `<Feed>` နဲ့ အတူတူ bundle တစ်ခုတည်းထဲ ထည့်လိုက်တာပါ — ဒါကြောင့် သင့် case အတွက် ဘာက အကောင်းဆုံးလဲ ဆုံးဖြတ်ပါ။ ဒါကို ဘယ်လို လုပ်ရမလဲဆိုတာ [Prefetching & Router Integration guide](/docs/tanstack-query/prefetching) မှာ ထပ်ဖတ်ပါ။

> ဒီ tradeoff က —
>
> - Data fetching code အားလုံးကို main bundle ထဲမှာ ထည့်ထားတာ — သုံးခဲပေမယ့်
> - Data fetching code ကို code split bundle ထဲမှာ ထည့်ထားတာ — request waterfall နဲ့အတူ
>
> — နှစ်ခုလုံး မကောင်းတာမို့ — Server Components တွေရဲ့ motivation တွေထဲက တစ်ခု ဖြစ်ခဲ့ပါတယ်။ Server Components တွေနဲ့ဆိုရင် နှစ်ခုလုံးကို ရှောင်နိုင်ပါတယ် — React Query မှာ ဒါက ဘယ်လို အသုံးချရမလဲဆိုတာ [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) မှာ ထပ်ဖတ်ပါ။

## အကျဉ်းချုပ်နဲ့ သင်ယူစရာတွေ

Request Waterfalls တွေက — tradeoffs တွေ အများကြီးရှိတဲ့ အဖြစ်များပြီး ရှုပ်ထွေးတဲ့ performance စိုးရိမ်စရာတစ်ခုပါ။ သင့် application ထဲမှာ မတော်တဆ ဒါတွေ ထည့်မိစေနိုင်တဲ့ နည်းလမ်းတွေ အများကြီး ရှိပါတယ်:

- Child တစ်ခုကို query ထည့်လိုက်တာ — parent မှာ query ရှိပြီးသားဆိုတာ မသိလိုက်ဘဲ
- Parent တစ်ခုကို query ထည့်လိုက်တာ — child မှာ query ရှိပြီးသားဆိုတာ မသိလိုက်ဘဲ
- Query ရှိတဲ့ descendants တွေပါတဲ့ component ကို — query ရှိတဲ့ ancestor တစ်ခုရှိတဲ့ parent အသစ်ဆီ ရွှေ့လိုက်တာ
- စသဖြင့်...

ဒီလို မတော်တဆ ဖြစ်တတ်တဲ့ ရှုပ်ထွေးမှုတွေကြောင့် — waterfalls တွေကို သတိထားပြီး သင့် application ကို မှန်မှန် စစ်ဆေးနေဖို့ (Network tab ကို မကြာခဏ ကြည့်တာ နည်းကောင်းတစ်ခုပါ!) အကျိုးရှိပါတယ်။ Performance ကောင်းဖို့ အားလုံးကို ပြားချပ်အောင် လုပ်ဖို့တော့ မလိုပါဘူး — ဒါပေမယ့် impact ကြီးတဲ့ဟာတွေကို သတိထား ကြည့်နေပါ။

နောက်လာမယ့် guide မှာတော့ — [Prefetching & Router Integration](/docs/tanstack-query/prefetching) ကို အသုံးချပြီး waterfalls တွေကို ပြားချပ်အောင် လုပ်မယ့် နည်းလမ်း နောက်ထပ်တွေကို ကြည့်ပါမယ်။
