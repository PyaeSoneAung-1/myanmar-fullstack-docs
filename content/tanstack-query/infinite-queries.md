---
title: "Infinite Queries"
description: "useInfiniteQuery နဲ့ infinite scroll — data.pages, getNextPageParam, fetchNextPage, IntersectionObserver, chat အတွက် reverse"
order: 6
source: "https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries"
status: translated
updated: 2026-09-01
---

## Infinite query ဆိုတာ ဘာလဲ

"Load more" ခလုတ် ဒါမှမဟုတ် infinite scroll လို — list ထဲကို data တွေ ဆက်တိုက်ထည့်သွားတဲ့ UI pattern တွေအတွက် `useQuery` ရဲ့ အထူးပုံစံ **`useInfiniteQuery`** ကို သုံးပါတယ်။ ပုံမှန် query ([Queries အသေးစိတ်](/docs/tanstack-query/queries)) နဲ့ ကွာတာတွေက:

- `data` က object ဖြစ်ပြီး — `data.pages` (fetch လုပ်ပြီးသား page တွေရဲ့ array) နဲ့ `data.pageParams` (page တစ်ခုချင်းစီအတွက် သုံးခဲ့တဲ့ param တွေ) ပါတယ်
- `fetchNextPage` / `fetchPreviousPage` function တွေ ရှိတယ်
- `initialPageParam` — ပထမဆုံး page အတွက် param (required)
- `getNextPageParam` / `getPreviousPageParam` — နောက်ထပ် data ရှိသေးလားနဲ့ ဘယ် param နဲ့ ယူရမလဲ ဆုံးဖြတ်တဲ့ function
- `hasNextPage` — `getNextPageParam` က `null`/`undefined` မဟုတ်တဲ့ တန်ဖိုး ပြန်ပေးနေသရွေ့ `true`
- `isFetchingNextPage` — နောက်ထပ် page ယူနေတာကို background refresh နဲ့ ခွဲခြားဖို့

## Cursor pattern — getNextPageParam

API က page တွေကို cursor နဲ့ ပြန်ပေးတယ်ဆိုပါစို့ — `{ data: [...], nextCursor: 3 }` လိုမျိုး `nextCursor` က နောက် page ကို ယူဖို့ cursor ပါ။ ဒါဆိုရင်:

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

function Projects() {
  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch("/api/projects?cursor=" + pageParam);
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
```

ဒါက **last page cursor** ပုံစံပါ — `getNextPageParam` က နောက်ဆုံး page (`lastPage`) ကိုကြည့်ပြီး နောက် page ရှိရင် cursor ပြန်ပေးပါတယ်။ `undefined` ပြန်ပေးလိုက်တာနဲ့ `hasNextPage` က `false` ဖြစ်ပြီး "Load More" ရပ်သွားပါတယ်။ Render လုပ်တဲ့အခါ `data.pages` ထဲက page တစ်ခုချင်းစီကို loop ပတ်ပြီး ပြပါတယ်။

သတိထားစရာ — infinite query တစ်ခုမှာ **တစ်ကြိမ်တည်း fetch တစ်ခုပဲ ရှိရမယ်**။ Fetch လုပ်နေချိန်မှာ `fetchNextPage` ထပ်ခေါ်ရင် data တွေ overwrite ဖြစ်နိုင်လို့ — ခေါ်တိုင်း `!isFetching` ဆိုတာ စစ်ဖို့ official docs က အကြံပြုပါတယ်:

```jsx
<List onEndReached={() => hasNextPage && !isFetching && fetchNextPage()} />
```

## Infinite scroll — IntersectionObserver နဲ့ ပေါင်းစပ်ခြင်း

"Infinite scroll" လုပ်ဖို့ — button အစား scroll က list ရဲ့ အောက်ခြေနားရောက်တာနဲ့ `fetchNextPage` ကို အလိုအလျောက် ခေါ်ပါတယ်။ အသုံးများတဲ့ နည်းက **IntersectionObserver** နဲ့ — list ရဲ့အောက်ဆုံးမှာ sentinel element (စောင့်ကြည့်စရာ element) တစ်ခုထားပြီး အဲဒါ viewport ထဲ ဝင်လာတာနဲ့ နောက် page ယူတာပါ:

```tsx
// သဘောတရားပြပုံ — sentinel element ကို စောင့်ကြည့်ပြီး
// viewport ထဲရောက်တာနဲ့ (page ကျန်သေးရင်) fetchNextPage ခေါ်မယ်
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
});
observer.observe(sentinelRef.current);
```

ဒါက concept ပြပုံပါ — production မှာ useEffect ထဲမှာ observer ကို cleanup နဲ့တကွ စနစ်တကျ ထည့်ပြီး၊ list က container တစ်ခုအတွင်းမှာ scroll ဖြစ်နေရင် `root` option နဲ့ အဲဒီ container ကို သတ်မှတ်ပေးရပါမယ်။

## Stale ဖြစ်ရင် ဘယ်လို refetch ဖြစ်လဲ

Infinite query က stale ဖြစ်ပြီး refetch လိုအပ်ရင် — page တွေကို **ပထမ page ကစပြီး တစ်ခုချင်းစီ sequential အနေနဲ့ ပြန် fetch** ပါတယ်။ ဒါက နောက်ခံ data တွေ ပြောင်းသွားရင်တောင် cursor ဟောင်းတွေနဲ့ မသုံးတော့ဘဲ — duplicate (ထပ်နေတာ) ဒါမှမဟုတ် record တွေ ကျော်သွားတာမျိုး မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

## Chat လိုမျိုး — page တွေကို ပြောင်းပြန်ပြခြင်း

Chat app တွေမှာ message အသစ်တွေက အောက်ခြေမှာ ရှိပြီး — ဟောင်းတာတွေကို အပေါ်ကို scroll လုပ်ပြီး ယူရပါတယ်။ ဒီလို **reverse order** နဲ့ ပြတဲ့ list အတွက် `select` option နဲ့ page တွေကို ပြောင်းပြန်လှန်နိုင်ပါတယ်:

```tsx
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  select: (data) => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
});
```

အပေါ်ကို ဆွဲတဲ့အခါ ဟောင်းတဲ့ message တွေ ထပ်ယူဖို့ `getPreviousPageParam` + `fetchPreviousPage` + `hasPreviousPage` တို့ကို သုံးပြီး — bi-directional infinite list အဖြစ်လည်း ဆောက်လို့ရပါတယ်။ Cache ရဲ့ နောက်ကွယ်မှာ ဖြစ်ပျက်ပုံကို [Caching အခြေခံ](/docs/tanstack-query/cache) မှာ ကြည့်နိုင်ပါတယ်။
