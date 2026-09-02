---
title: "Suspense"
description: "Children တွေ loading ပြီးစီးတဲ့အထိ fallback (loading placeholder) ပြသပေးနိုင်တဲ့ React component — props/caveats များ၊ Suspense boundary ကို activate လုပ်စေတဲ့ အခြေအနေတွေနဲ့ အသုံးပြုပုံ ဥပမာများ"
order: 57
source: "https://react.dev/reference/react/Suspense"
status: translated
updated: 2026-09-02
---

`<Suspense>` ဆိုတာ — သူ့ရဲ့ children တွေ loading ပြီးစီးတဲ့အထိ fallback (loading placeholder) တစ်ခုကို ပြသပေးနိုင်တဲ့ React component တစ်ခုပါ။ Data (သို့) code တွေ ဆွဲယူနေရလို့ content က render လုပ်ဖို့ အဆင်သင့် မဖြစ်သေးချိန်မှာ loading indicator ကို ပြပြီး — အဆင်သင့် ဖြစ်တာနဲ့ content အစစ်ကို ပြနိုင်ပါတယ်။

```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

## ရည်ညွှန်းချက် (Reference)

### `<Suspense>` component

#### Props (props များ)

- `children` — သင်တကယ် ပြချင်တဲ့ UI ပါ။ Render လုပ်နေစဉ်မှာ `children` က suspend (ခေတ္တရပ်ဆိုင်း) ဖြစ်သွားရင် — Suspense boundary က `fallback` ကို render လုပ်ဖို့ ပြောင်းသွားပါတယ်။
- `fallback` — `children` တွေ loading မပြီးသေးတဲ့အချိန်မှာ သူ့နေရာမှာ ပြမယ့် အခြား UI ပါ။ React node မှန်သမျှ လက်ခံပါတယ် — လက်တွေ့မှာတော့ fallback ဆိုတာ loading spinner (သို့) skeleton လိုမျိုး ပေါ့ပါးတဲ့ placeholder view တစ်ခု ဖြစ်လေ့ ရှိပါတယ်။ `children` suspend ဖြစ်တာနဲ့ Suspense က `fallback` ကို အလိုအလျောက် ပြောင်းပြပြီး — data အဆင်သင့် ဖြစ်တာနဲ့ `children` ကို ပြန်ပြောင်းပြပါတယ်။ `fallback` ကိုယ်တိုင် render လုပ်ရင်း suspend ဖြစ်သွားရင်တော့ — သူ့အပေါ်က အနီးဆုံး parent Suspense boundary ကို activate လုပ်ပါတယ်။
- **optional** `defer` *(experimental)* — boolean တန်ဖိုးပါ။ `true` ဆိုရင် — children တွေထဲမှာ ဘာမှ suspend ဖြစ်စရာ မရှိရင်တောင် React က `fallback` ကို အရင်ပြပြီး `children` ကို နောက်မှ render (သို့) stream လုပ်နိုင်ပါတယ်။ Render လုပ်ရတာ စျေးကြီးတဲ့ content တွေအတွက် သုံးပါတယ်။ မူရင်း ပုံမှန်တန်ဖိုး — `false`။

#### Caveats (သတိပြုရမည့်အချက်များ)

- Suspense က Effect ထဲမှာ (သို့) event handler ထဲမှာ fetch လုပ်တဲ့ data ကို ထောက်လှမ်းလို့ မရပါဘူး — အောက်မှာ ဖော်ပြထားတဲ့ အခြေအနေတွေမှာပဲ activate ဖြစ်ပါတယ်။
- Component က ပထမဆုံးအကြိမ် mount မဖြစ်ခင် suspend ဖြစ်ခဲ့တဲ့ renders တွေအတွက် React က state ကို မသိမ်းပါဘူး။ Component loading ပြီးတာနဲ့ — suspended tree ကို အစကနေ ပြန် render လုပ်ပါတယ်။
- Suspense က tree တစ်ခုအတွက် content ပြနေတုန်း နောက်တစ်ခါ suspend ဖြစ်ပြန်ရင် — အဲဒါကို ဖြစ်စေတဲ့ update က [`startTransition`](/docs/react/start-transition) (သို့) [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) ကြောင့် မဟုတ်ဘူးဆိုရင် — `fallback` ကို ထပ်ပြပါလိမ့်မယ်။
- React က suspended content တွေကို နောက်ဆုံး reveal (ပြသလိုက်) တဲ့အချိန်ကစပြီး 300ms အတွင်းမှာ တစ်ခါထက် ပိုပြီး reveal မလုပ်ပါဘူး။ အဲဒီ window အတွင်းမှာ အဆင်သင့် ဖြစ်လာတဲ့ boundaries တွေကို — တစ်ခုပြီးတစ်ခု မဟုတ်ဘဲ — အတူတကွ reveal လုပ်ပါတယ်။
- မြင်နေရတဲ့ content ကို ထပ်ပြီး suspend လို့ ဝှက်ထားရမယ်ဆိုရင် — React က content tree ထဲက [layout Effects](https://react.dev/reference/react/useLayoutEffect) တွေကို cleanup လုပ်ပြီး — content ပြန်ပြဖို့ အဆင်သင့် ဖြစ်တဲ့အခါ layout Effects တွေကို ပြန် run ပေးပါတယ်။ ဒါက DOM layout ကို တိုင်းတာတဲ့ Effects တွေက content ဝှက်ထားချိန်မှာ တိုင်းတာဖို့ မကြိုးစားမိအောင် သေချာစေပါတယ်။
- Suspense နဲ့ ပေါင်းစပ်ထားတဲ့ *Streaming Server Rendering* နဲ့ *Selective Hydration* လိုမျိုး အတွင်းပိုင်း optimizations တွေလည်း ရှိပါသေးတယ် — [architectural overview](https://github.com/reactwg/react-18/discussions/37) ကို ဖတ်ပြီး [technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc) ကို ကြည့်နိုင်ပါတယ်။

### Suspense boundary တစ်ခုကို ဘာတွေက activate လုပ်သလဲ (What activates a Suspense boundary)

Suspense boundary တစ်ခုက သူ့ရဲ့ content အဆင်သင့် မဖြစ်ခင်အထိ စောင့်ဆိုင်းပါတယ်။ အောက်ပါ အခြေအနေတွေထဲက တစ်ခုခုက boundary ကို content မပြနိုင်အောင် ပိတ်ထားပါတယ်:

- Component code ကို [`lazy`](/docs/react/lazy) နဲ့ lazy-loading လုပ်နေတာ။
- [`use`](/docs/react/use) နဲ့ Promise တစ်ခုကို ဖတ်နေတာ — [Server Components](https://react.dev/reference/rsc/server-components) ကနေ stream လုပ်လာတဲ့ data (သို့) Suspense-enabled framework တစ်ခုကနေ load လုပ်တဲ့ data တွေ အပါအဝင်ပါ။
- [`precedence` prop ပါတဲ့ `<link rel="stylesheet">`](https://react.dev/reference/react-dom/components/link) နဲ့ render လုပ်ထားတဲ့ stylesheet တစ်ခုကို loading လုပ်နေတာ — React က stylesheet load ပြီးတဲ့အထိ (timeout အထိ) boundary ကို ပိတ်ထားပါတယ်။
- Streaming server rendering အတွင်းမှာ boundary ကြီးတစ်ခုရဲ့ HTML ရောက်ရှိဖို့ စောင့်နေတာ — HTML ပို့တာ အချိန်ယူရလို့ content အလုံအလောက်ရှိတဲ့ boundary က ဘာမှ suspend မဖြစ်ရင်တောင် activate ဖြစ်ပြီး — HTML ရောက်လာတာနဲ့ content ကို reveal လုပ်ပါတယ်။
- *(Canary)* Font တွေ loading လုပ်နေတာ — Suspense က font တွေကို မူရင်းအတိုင်း မစောင့်ပါဘူး။ ဒါပေမယ့် [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) update တစ်ခုက font အသစ်တွေ load ဖြစ်တဲ့အထိ (timeout အထိ) စောင့်ပေးလို့ — text တွေ fallback font နဲ့ ပေါ်လာပြီး မှိတ်တုတ်မှိတ်တုတ် မဖြစ်တော့ပါဘူး။
- *(Canary)* Image တွေ loading လုပ်နေတာ — မူရင်းအတိုင်း မစောင့်ပေမယ့် `<ViewTransition>` update တစ်ခုအတွင်းမှာတော့ React က image load ပြီးတဲ့အထိ (timeout အထိ) boundary ကို ပိတ်ထားပါတယ်။ `onLoad` handler ထည့်ထားတဲ့ image တစ်ခုကတော့ ဒီစောင့်ဆိုင်းမှုကနေ ဖယ်ထုတ်ခံရပါတယ်။
- *(Experimental)* `<Suspense defer>` ဆိုတဲ့ prop ကို သုံးထားတဲ့ boundary အတွင်းမှာ CPU-intensive render အလုပ်တွေ လုပ်နေတာ။

> **သတိပြုရန် — Suspense-enabled frameworks**
>
> *Suspense-enabled framework* ဆိုတာ — သင့် component ထဲမှာ data ဖတ်တဲ့အခါ အနီးဆုံး Suspense boundary ကို activate လုပ်ပေးနိုင်မယ့် နည်းလမ်း တစ်ခုကို ပေးထားတဲ့ framework ပါ။ Data တွေကို အတိအကျ ဘယ်လို load လဲဆိုတာ — framework အလိုက် ကွဲပြားပြီး — အသေးစိတ်ကို သက်ဆိုင်ရာ framework ရဲ့ documentation မှာ ကြည့်ရပါတယ်။ နောက်ကွယ်မှာတော့ Suspense-enabled framework တစ်ခုက Promises တွေရဲ့ cache ကို ထိန်းသိမ်းပြီး — Promise တစ်ခုပေါ်မှာ suspend ဖြစ်ဖို့ [`use`](/docs/react/use) ကို ခေါ်ပါတယ်။
>
> Framework မသုံးဘဲနဲ့လည်း — Promise ကို `use` နဲ့ တိုက်ရိုက် ဖတ်လို့ရပါတယ် — renders တွေကြားမှာ instance တစ်ခုတည်း ပြန်သုံးနိုင်အောင် [Promise ကို cache လုပ်ထား](/docs/react/use) သရွေ့ပါ။

## အသုံးပြုပုံ (Usage)

### Content loading လုပ်နေစဉ် fallback ပြခြင်း (Displaying a fallback while content is loading)

သင့် application ရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို Suspense boundary တစ်ခုနဲ့ ထုပ်လို့ရပါတယ်:

```js
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

Children တွေ လိုအပ်တဲ့ code နဲ့ data အားလုံး loading ပြီးတဲ့အထိ — React က loading fallback ကို ပြသပါလိမ့်မယ်။

အောက်က ဥပမာမှာ `Albums` component က album list ကို fetch လုပ်နေတုန်း *suspend* ဖြစ်နေပါတယ်။ Render လုပ်ဖို့ အဆင်သင့် မဖြစ်သေးချိန်မှာ React က အပေါ်က အနီးဆုံး Suspense boundary ကို fallback — သင့်ရဲ့ `Loading` component — ပြဖို့ ပြောင်းလိုက်ပြီး — data loading ပြီးတာနဲ့ `Loading` fallback ကို ဝှက်ပြီး data နဲ့အတူ `Albums` component ကို render လုပ်ပါတယ်:

`ArtistPage.js`:

```js
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

`Albums.js` — `use` နဲ့ Promise တစ်ခုကို ဖတ်ပါတယ်:

```js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

ဒီဥပမာကို အလုပ်လုပ်ဖို့ — `fetchData` ကို cache လုပ်တဲ့ data layer (ပုံမှန်အားဖြင့် framework ထဲမှာ ပါတတ်ပါတယ်) လိုပါတယ်။ [Client Components တွေအတွက် Promises တွေကို cache လုပ်ခြင်း](/docs/react/use) အကြောင်း `use` page မှာ ဆက်ဖတ်နိုင်ပါတယ်။

ဆန့်ကျင်ဘက်အနေနဲ့ — `use` ရဲ့ အပြင်ဘက်မှာ (ဥပမာ — Effect ထဲမှာ) data fetch လုပ်တဲ့ code ကတော့ boundary ကို activate မလုပ်ပါဘူး:

`EffectAlbums.js`:

```js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export default function EffectAlbums({ artistId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let active = true;
    fetchData(`/${artistId}/albums`).then(result => {
      if (active) {
        setAlbums(result);
      }
    });
    return () => {
      active = false;
    };
  }, [artistId]);

  // Suspense က ဒီ fetch ကို မမြင်နိုင်လို့ fallback က ဘယ်တော့မှ မပေါ်ပါဘူး
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

Streaming server rendering အတွင်းမှာလည်း — boundary ရဲ့ HTML တွေ stream ဝင်နေဆဲ အချိန်မှာ boundary က activate ဖြစ်ပါတယ်။ Streaming server rendering API တစ်ခုခုနဲ့ဆို — React က `fallback` ပါတဲ့ shell ကို အရင် ပို့လိုက်ပြီး — boundary တစ်ခုချင်းစီရဲ့ HTML ရောက်ရှိလာတာနဲ့ အဲဒီ boundary ရဲ့ `fallback` ကို အစားထိုးပါတယ်။

### Content တွေ အဆင်သင့်ဖြစ်တာနဲ့ တစ်ပြိုင်နက် အတူတူ ပြခြင်း (Revealing content together at once)

မူရင်းအတိုင်းဆို — Suspense အတွင်းက tree တစ်ခုလုံးကို unit တစ်ခုတည်းအဖြစ် သဘောထားပါတယ်။ ဥပမာ — ဒီ components တွေထဲက *တစ်ခုတည်းပဲ* data စောင့်လို့ suspend ဖြစ်ရင်တောင် — *အားလုံးကို* အတူတကွ loading indicator နဲ့ အစားထိုးခံရပြီး — အားလုံး ပြသဖို့ အဆင်သင့် ဖြစ်မှ တစ်ပြိုင်နက် အတူတူ ပေါ်လာပါတယ်:

```js
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Data load လုပ်တဲ့ components တွေက Suspense boundary ရဲ့ တိုက်ရိုက် children တွေ ဖြစ်စရာ မလိုပါဘူး — ဥပမာ — `Biography` နဲ့ `Albums` ကို `Details` component အသစ်တစ်ခုထဲ ရွှေ့ထားရင်လည်း အပြုအမူ မပြောင်းပါဘူး — သူတို့က အနီးဆုံး parent Suspense boundary တစ်ခုတည်းကို မျှဝေသုံးနေလို့ reveal ဖြစ်တာတွေ အတူတူ ညှိနှိုင်းခံရပါတယ်:

```js
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

### Content တွေ load ပြီးတာနဲ့ အဆင့်ဆင့် ပြခြင်း (Revealing nested content as it loads)

Component တစ်ခု suspend ဖြစ်ရင် — အနီးဆုံး parent Suspense component က fallback ကို ပြပါတယ်။ ဒါကြောင့် Suspense components တွေကို အသိုက်လိုက် (nest) ထားပြီး loading sequence တစ်ခု ဖန်တီးလို့ရပါတယ် — Suspense boundary တစ်ခုချင်းစီရဲ့ fallback ကို နောက်အဆင့် content အဆင်သင့် ဖြစ်လာတာနဲ့ ဖြည့်သွားပါတယ်။ ဥပမာ — album list ကို ကိုယ်ပိုင် fallback တစ်ခု ပေးထားနိုင်ပါတယ်:

```js
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

ဒီပြောင်းလဲမှုနဲ့ဆို — `Biography` ပြဖို့ `Albums` loading ပြီးတာကို စောင့်စရာ မလိုတော့ပါဘူး။ Sequence ကတော့:

1. `Biography` မပြီးသေးရင် — content area တစ်ခုလုံး နေရာမှာ `BigSpinner` ကို ပြပါတယ်။
2. `Biography` ပြီးတာနဲ့ — `BigSpinner` ကို content နဲ့ အစားထိုးပါတယ်။
3. `Albums` မပြီးသေးရင် — `Albums` နဲ့ သူ့ရဲ့ parent `Panel` နေရာမှာ `AlbumsGlimmer` ကို ပြပါတယ်။
4. နောက်ဆုံး — `Albums` ပြီးတာနဲ့ `AlbumsGlimmer` ကို အစားထိုးပါတယ်။

အကျဉ်းချုပ်က — Suspense boundaries တွေက UI ရဲ့ ဘယ်အပိုင်းတွေ တစ်ပြိုင်နက် အတူတူ "ပေါ်လာသင့်လဲ"၊ ဘယ်အပိုင်းတွေက loading states တွေရဲ့ sequence အတိုင်း တစ်ဆင့်ပြီးတစ်ဆင့် ပိုပြသင့်လဲဆိုတာကို ညှိနှိုင်းပေးပါတယ်။ Tree ထဲက ဘယ်နေရာမှာမဆို Suspense boundaries တွေကို ထည့်/ရွှေ့/ဖျက်လို့ရပြီး — app ရဲ့ ကျန် အပြုအမူတွေကို မထိခိုက်ပါဘူး။

Component တိုင်းမှာ Suspense boundary တစ်ခု ထည့်မထားသင့်ပါဘူး — Suspense boundaries တွေက အသုံးပြုသူ ခံစားစေချင်တဲ့ loading sequence ထက် ပိုပြီး granular (အသေးစိတ်) မဖြစ်သင့်ပါဘူး။ Designer တစ်ယောက်နဲ့ အလုပ်လုပ်ရင် — loading states တွေကို ဘယ်မှာ ထားသင့်လဲ မေးကြည့်ပါ — သူတို့ရဲ့ design wireframes တွေထဲမှာ ထည့်ပြီးသား ဖြစ်နိုင်ပါတယ်။

### Data အသစ် load လုပ်နေချိန်မှာ content အဟောင်း ပြထားခြင်း (Showing stale content while fresh content is loading)

ဒီဥပမာမှာ `SearchResults` component က search results တွေ fetch လုပ်နေတုန်း suspend ဖြစ်ပါတယ်။ Input ထဲမှာ `"a"` လို့ ရိုက်ပြီး — results တွေ ရောက်တဲ့အထိ စောင့်ကာ — `"ab"` လို့ ပြင်ရိုက်ကြည့်ပါ — `"a"` အတွက် results တွေက loading fallback နဲ့ အစားထိုးခံရတာကို တွေ့ရပါလိမ့်မယ်။

ပိုအသုံးများတဲ့ အခြားနည်းလမ်းတစ်ခုက — list ကို update လုပ်တာကို *ရွှေ့ဆိုင်း* ပြီး — results အသစ်တွေ အဆင်သင့် မဖြစ်ခင် results အဟောင်းတွေကို ဆက်ပြနေစေတာပါ။ [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) Hook က query ရဲ့ deferred version တစ်ခုကို အောက်ကို ပို့ပေးနိုင်ပါတယ်:

```js
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` က ချက်ချင်း update ဖြစ်လို့ — input ထဲမှာ တန်ဖိုးအသစ် ပေါ်ပါတယ်။ `deferredQuery` ကတော့ data loading ပြီးတဲ့အထိ တန်ဖိုးဟောင်းကို ဆက်ထားလို့ — `SearchResults` က results အဟောင်းတွေကို ခဏဆက် ပြပါလိမ့်မယ်။ အသုံးပြုသူ ပိုသိသာအောင် — stale result list ပြနေချိန်မှာ visual indication တစ်ခု ထည့်နိုင်ပါတယ်:

```js
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

> **သတိပြုရန်** — Deferred values တွေရော Transitions တွေပါ — Suspense fallback မပြဘဲ inline indicators (content နေရာမှာ တိုက်ရိုက် ပြတဲ့ အချက်ပြမှုတွေ) ကို သုံးနိုင်အောင် ကူညီပေးပါတယ်။ Transitions က update တစ်ခုလုံးကို urgent (အရေးတကြီး) မဟုတ်ဘဲ မှတ်လို့ — navigation အတွက် frameworks နဲ့ router libraries တွေမှာ အများအားဖြင့် သုံးကြပါတယ်။ Deferred values ကတော့ — UI ရဲ့ အစိတ်အပိုင်းတစ်ခုကို urgent မဟုတ်ဘဲ မှတ်ပြီး ကျန် UI နဲ့ ခဏ "နောက်ကျကျ လိုက်စေချင်တဲ့" application code တွေမှာ ပိုအသုံးဝင်ပါတယ်။

### မြင်နေရပြီးသား content တွေ fallback နဲ့ မဖုံးမိအောင် တားခြင်း (Preventing already revealed content from hiding)

Component တစ်ခု suspend ဖြစ်ရင် — အနီးဆုံး parent Suspense boundary က fallback ပြဖို့ ပြောင်းပါတယ်။ Content တွေ ပြပြီးသား ဖြစ်နေချိန်မှာ ဒီလိုဖြစ်ရင် — အသုံးပြုသူအတွက် မသက်မသာ အတွေ့အကြုံ (jarring experience) ဖြစ်စေနိုင်ပါတယ်။ ဥပမာ — Router တစ်ခုက page အသစ်တစ်ခုကို render လုပ်တဲ့အခါ အတွင်းက component တစ်ခု suspend ဖြစ်ပြီး — root အနားမှာ ရှိတဲ့ Suspense boundary က site layout တစ်ခုလုံးကို fallback နဲ့ အစားထိုးလိုက်တာမျိုးပါ။

ဒါကို ကာကွယ်ဖို့ — navigation state update ကို [`startTransition`](/docs/react/start-transition) နဲ့ *Transition* အဖြစ် မှတ်နိုင်ပါတယ်:

```js
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

ဒါက React ကို — ဒီ state transition က urgent မဟုတ်ဘူး၊ ပြပြီးသား content တွေကို ဝှက်မယ့်အစား အရင် page ကို ဆက်ပြထားတာ ပိုကောင်းတယ်လို့ ပြောလိုက်တာပါ။

Transition တစ်ခုက content *အားလုံး* loading ပြီးတဲ့အထိ မစောင့်ပါဘူး — ပြပြီးသား content တွေ မဝှက်မိအောင် လုံလောက်တဲ့အထိပဲ စောင့်ပါတယ်။ ဥပမာ — website `Layout` က ပြပြီးသားမို့ သူ့ကို loading spinner နောက်မှာ ဝှက်တာ မကောင်းပါဘူး — ဒါပေမယ့် `Albums` ကို ပတ်ထားတဲ့ nested `Suspense` boundary ကတော့ အသစ်မို့ — Transition က သူ့အတွက် မစောင့်ပါဘူး။

Navigation ဖြစ်နေတယ်ဆိုတဲ့ အချက်ပြမှု (indicator) လိုချင်ရင် — `startTransition` အစား [`useTransition`](https://react.dev/reference/react/useTransition) ကို သုံးပြီး — သူက ပေးတဲ့ `isPending` boolean တန်ဖိုးနဲ့ Transition ဖြစ်နေချိန်မှာ UI (ဥပမာ — header ရဲ့ style) ကို ပြောင်းပြနိုင်ပါတယ်။ Suspense-enabled routers တွေက navigation updates တွေကို Transitions အနေနဲ့ မူရင်းအတိုင်း ထုပ်ပေးဖို့ မျှော်လင့်ထားပါတယ်။

### Navigation လုပ်တဲ့အခါ Suspense boundaries တွေကို reset လုပ်ခြင်း (Resetting Suspense boundaries on navigation)

Transition အတွင်းမှာ React က ပြပြီးသား content တွေ ဝှက်တာကို ရှောင်ပါတယ်။ ဒါပေမယ့် — *မတူညီတဲ့* အကြောင်းအရာ (ဥပမာ — အသုံးပြုသူ တစ်ယောက်ရဲ့ profile ကနေ နောက်တစ်ယောက်ရဲ့ profile) ဆီ သွားတဲ့အခါမှာတော့ — content အဟောင်း အစား fallback ပြစေချင်ပါလိမ့်မယ်။ အဲဒါကို `key` တစ်ခုနဲ့ ဖော်ပြနိုင်ပါတယ်:

```js
<ProfilePage key={queryParams.id} />
```

`key` မတူညီရင် — React က profiles တွေကို content မတူတာတွေအဖြစ် သဘောထားပြီး — navigation အတွင်းမှာ Suspense boundary ကို reset လုပ်ပါတယ်။ `key` ကို boundary ပေါ်မှာ ဒါမှမဟုတ် သူ့အပေါ်က component တစ်ခုပေါ်မှာ ထားလို့ရပြီး — Suspense-integrated routers တွေက ဒါကို အလိုအလျောက် လုပ်ပေးသင့်ပါတယ်။

ဥပမာ — profile page ကို ဖွင့်တာနဲ့ profile အရင်တစ်ယောက်ကို loading လုပ်ပါတယ်။ "Bob" ကို နှိပ်လိုက်ရင် — မတူတဲ့ profile ဆီ သွားပြီး — `key` က boundary ကို reset လုပ်လို့ — အရင် user ရဲ့ bio အစား fallback ပြပါတယ်:

`ProfilePage.js`:

```js
import { Suspense, useState, startTransition } from 'react';
import Bio from './Bio.js';
import { fetchBio } from './data.js';

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    id: 'alice',
    bioPromise: fetchBio('alice'),
  }));
  function navigate(id) {
    startTransition(() => {
      setUser({ id, bioPromise: fetchBio(id) });
    });
  }
  return (
    <>
      <button onClick={() => navigate('alice')}>
        Alice
      </button>
      <button onClick={() => navigate('bob')}>
        Bob
      </button>
      <Suspense key={user.id} fallback={<p>⌛ Loading profile...</p>}>
        <Bio bioPromise={user.bioPromise} />
      </Suspense>
    </>
  );
}
```

`key` ကို ဖယ်လိုက်ရင် — bio အသစ် loading လုပ်နေချိန်မှာ အရင် user ရဲ့ bio က မြင်နေရမှာ ဖြစ်ပြီး — `key` ရှိနေရင်တော့ fallback ပြပြီး content ကို ပြန်စပါတယ်။

### Server errors တွေနဲ့ client-only content တွေအတွက် fallback ပေးခြင်း (Providing a fallback for server errors and client-only content)

[Streaming server rendering APIs](https://react.dev/reference/react-dom/server) (ဒါမှမဟုတ် သူတို့ကို မှီခိုတဲ့ framework) တစ်ခုခု သုံးနေရင် — server ပေါ်က errors တွေကို ကိုင်တွယ်ဖို့ React က သင့် `<Suspense>` boundaries တွေကိုပါ သုံးပါတယ်။ Component တစ်ခုက server မှာ error throw လုပ်ရင် — React က server render ကို မရပ်ပစ်ပါဘူး။ အစား — အပေါ်က အနီးဆုံး `<Suspense>` component ကို ရှာပြီး — သူ့ရဲ့ fallback (spinner လိုမျိုး) ကို ထုတ်လုပ်ထားတဲ့ server HTML ထဲ ထည့်ပါတယ် — အသုံးပြုသူက အစမှာ spinner တစ်ခု မြင်ရပါလိမ့်မယ်။

Client မှာတော့ React က အဲဒီ component ကို ထပ်ပြီး render လုပ်ကြည့်ပါတယ်။ Client မှာလည်း error ဖြစ်ရင် — React က error ကို throw လုပ်ပြီး အနီးဆုံး [Error Boundary](https://react.dev/reference/react/Component) မှာ ပြပါတယ်။ Client မှာ error မဖြစ်ရင်တော့ — content က နောက်ဆုံးမှာ အောင်မြင်စွာ ပြခဲ့လို့ — error ကို အသုံးပြုသူကို မပြတော့ပါဘူး။

ဒါကို သုံးပြီး — component တချို့ကို server မှာ render လုပ်တာကနေ ဖယ်ထုတ်လို့ရပါတယ် — server environment မှာ error throw လုပ်ပြီး `<Suspense>` boundary နဲ့ ထုပ်ထားရင် — သူတို့ရဲ့ HTML နေရာမှာ fallbacks တွေ နဲ့ အစားထိုးပါတယ်:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

Server HTML ထဲမှာ loading indicator ပါမယ် — client ပေါ်ရောက်တဲ့အခါ `Chat` component နဲ့ အစားထိုးခံရပါတယ်။

### Canary — Browser-only content ၊ stylesheets ၊ fonts ၊ images တွေအတွက် Suspense

အောက်ပါ pattern တွေက Suspense ကို content အမျိုးအစား အသီးသီး loading လုပ်တာနဲ့ ပေါင်းစပ်သုံးတာတွေပါ — အားလုံးက React canary releases တွေမှာ ရနိုင်တာတွေ ဖြစ်ပြီး — fonts/images/stylesheets တွေနဲ့ ပတ်သက်တဲ့ စောင့်ဆိုင်းမှုတွေက [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) update တွေအတွင်းမှာပဲ သက်ရောက်ပါတယ်:

- **Browser-only content အတွက် fallback** — Component ကို `<Suspense>` နဲ့ ထုပ်ပြီး အတွင်းမှာ [`use(browser(...))`](/docs/react/use) ကို ခေါ်ထားရင် — server rendering အတွင်းမှာ Suspense boundary ရဲ့ fallback ကို HTML ထဲ ထည့်ပြီး — browser ထဲမှာ hydration ပြီးတဲ့အခါ fallback ကို browser-only content (ဥပမာ — `localStorage` ထဲက draft) နဲ့ အစားထိုးပါတယ်။
- **Stylesheet တစ်ခု loading ပြီးတဲ့အထိ စောင့်ခြင်း** — [`precedence` prop ပါတဲ့ `<link rel="stylesheet">`](https://react.dev/reference/react-dom/components/link) နဲ့ render လုပ်ထားတဲ့ stylesheet က Suspense boundary ကို stylesheet load ပြီးတဲ့အထိ (timeout အထိ) ပိတ်ထားလို့ — content တွေ style မကျဘဲ (unstyled) မပေါ်တော့ပါဘူး။
- **Suspense content ကနေ animate လုပ်ခြင်း** — Suspense က [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) နဲ့ ပေါင်းစပ်ပြီး — fallback ကနေ content ဆီ swap ဖြစ်တာကို animate လုပ်နိုင်ပါတယ်။ Boundary ကို `<ViewTransition>` ထဲမှာ ထုပ်ထားရင် — React က swap ကို update တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး fallback နဲ့ content ကြားကို မူရင်းအတိုင်း cross-fade လုပ်ပါတယ်။ View Transition classes တွေနဲ့ animation ကို စိတ်ကြိုက်ပြင်လို့လည်း ရပါတယ်။
- **Fonts / images တွေ loading ပြီးတဲ့အထိ စောင့်ခြင်း** — `<ViewTransition>` update က Suspense boundary ရဲ့ reveal ကို animate လုပ်တဲ့အခါ — React က content အသစ်က မိတ်ဆက်လိုက်တဲ့ fonts တွေနဲ့ မြင်ရတဲ့ images တွေ loading ပြီးတဲ့အထိ (timeout အထိ) စောင့်ပေးလို့ — text တွေ fallback font နဲ့ မပေါ်တော့ဘဲ — animation ကလည်း ပုံတစ်ဝက် မပြည့်သေးတဲ့ image နဲ့ မစတင်တော့ပါဘူး။ `onLoad` handler ထည့်ထားတဲ့ image တစ်ခုကတော့ — `<ViewTransition>` အတွင်းမှာတောင် ဒီစောင့်ဆိုင်းမှုကနေ ဖယ်ထုတ်ခံရပါတယ်။
- **အားလုံး တစ်ပြိုင်နက် ညှိနှိုင်းခြင်း** — Suspense boundary တစ်ခုတည်းက data ၊ stylesheets ၊ fonts နဲ့ images တွေကို တစ်ပြိုင်နက် စောင့်နိုင်ပါတယ် — skeleton ကို data နဲ့ stylesheet loading ပြီးတဲ့အထိ မြင်နေရပြီး — `<ViewTransition>` reveal က font နဲ့ image အတွက် ထပ်စောင့်တာမို့ — card တစ်ခုလုံး အပြည့်အစုံ ပေါ်လာပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Update တစ်ခုအတွင်းမှာ UI ကို fallback နဲ့ အစားထိုးခံရတာကို ဘယ်လို တားဆီးမလဲ

မြင်နေရတဲ့ UI ကို fallback နဲ့ အစားထိုးတာက — အသုံးပြုသူအတွက် မသက်မသာ အတွေ့အကြုံ ဖြစ်စေပါတယ်။ Update တစ်ခုကြောင့် component တစ်ခု suspend ဖြစ်ပြီး — အနီးဆုံး Suspense boundary က အသုံးပြုသူကို content ပြနေပြီးသား ဆိုရင် ဒီလိုဖြစ်တတ်ပါတယ်။

ဒါကို ကာကွယ်ဖို့ — update ကို [`startTransition`](/docs/react/start-transition) သုံးပြီး urgent မဟုတ်ဘဲ မှတ်ပါ (အထက်က "မြင်နေရပြီးသား content တွေ fallback နဲ့ မဖုံးမိအောင် တားခြင်း" အပိုင်းမှာ ကြည့်ပါ)။ Transition တစ်ခုအတွင်းမှာ — React က မလိုအပ်တဲ့ fallback မပေါ်အောင် data လုံလောက်စွာ loading ပြီးတဲ့အထိ စောင့်ပါတယ်:

```js
function handleNextPageClick() {
  // ဒီ update က suspend ဖြစ်ရင် ပြထားပြီးသား content ကို မဝှက်ပါနဲ့
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

ဒါက ရှိပြီးသား content တွေ ဝှက်တာကို ရှောင်ပါတယ်။ ဒါပေမယ့် — အသစ် render လုပ်လိုက်တဲ့ `Suspense` boundaries တွေကတော့ — UI ကို မပိတ်ဆို့ဖို့အတွက် fallbacks တွေကို ချက်ချင်း ပြပါသေးတယ် — content ရနိုင်တာနဲ့ အသုံးပြုသူ မြင်ရအောင်ပါ။

**React က မလိုအပ်တဲ့ fallbacks တွေကို urgent မဟုတ်တဲ့ updates (non-urgent updates) တွေအတွင်းမှာပဲ ကာကွယ်ပေးပါတယ်** — urgent update တစ်ခုရဲ့ ရလဒ်ဆိုရင် render ကို နှောင့်နှေးစေမှာ မဟုတ်ပါဘူး။ [`startTransition`](/docs/react/start-transition) (သို့) [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) လိုမျိုး API တစ်ခုနဲ့ ကိုယ်တိုင် opt in လုပ်ရပါတယ်။

Router က Suspense နဲ့ integrated ဖြစ်ရင် — သူ့ရဲ့ updates တွေကို [`startTransition`](/docs/react/start-transition) ထဲမှာ မူရင်းအတိုင်း ထုပ်ပေးသင့်ပါတယ်။
