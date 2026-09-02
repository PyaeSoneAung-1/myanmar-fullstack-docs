---
title: "cache"
description: "Data fetch (ဒေတာယူခြင်း) (သို့) တွက်ချက်မှုတစ်ခုရဲ့ ရလဒ်ကို cache (ကက်ရှ်) လုပ်နိုင်စေတဲ့ React API — Server Components တွေထဲမှာ component အများကြား အလုပ်တွေ မျှဝေခြင်း၊ server request တစ်ခုစီမှာ cache invalidation ဖြစ်ခြင်း၊ memo/useMemo တို့နဲ့ ကွာခြားပုံ"
order: 103
source: "https://react.dev/reference/react/cache"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** `cache` ကို [React Server Components](https://react.dev/reference/rsc/server-components) တွေနဲ့ပဲ သုံးလို့ရပါတယ်။

`cache` က — data fetch (ဒေတာယူခြင်း) (သို့) တွက်ချက်မှုတစ်ခုရဲ့ ရလဒ်ကို cache (ကက်ရှ်) လုပ်ထားနိုင်စေပါတယ်။

```js
const cachedFn = cache(fn);
```

## ရည်ညွှန်းချက် (Reference)

### `cache(fn)`

`cache` ကို component တွေရဲ့ အပြင်ဘက်မှာ ခေါ်ပြီး — caching ပါဝင်တဲ့ function version တစ်ခုကို ဖန်တီးပါတယ်:

```js
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

`getMetrics` ကို `data` နဲ့ ပထမဆုံးအကြိမ် ခေါ်တဲ့အခါ — `getMetrics` က `calculateMetrics(data)` ကို ခေါ်ပြီး — ရလဒ်ကို cache ထဲမှာ သိမ်းပါတယ်။ အဲဒီ `data` အတိုင်း `getMetrics` ကို နောက်တစ်ခါ ခေါ်ရင် — `calculateMetrics(data)` ကို ထပ်မခေါ်တော့ဘဲ — cache လုပ်ထားတဲ့ ရလဒ်ကို ပြန်ပေးပါတယ်။

အောက်မှာ ဥပမာ တွေ ထပ်ကြည့်ပါ။

#### Parameters (ပါရာမီတာများ)

- `fn` — ရလဒ်တွေကို cache လုပ်ချင်တဲ့ function ပါ။ `fn` က argument တွေ ဘာမဆို လက်ခံပြီး — value ဘာမဆို ပြန်ပေးနိုင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`cache` က `fn` ရဲ့ cached version တစ်ခုကို — type signature အတူတူနဲ့ ပြန်ပေးပါတယ်။ ဖန်တီးတဲ့အခါမှာ `fn` ကို မခေါ်ပါဘူး။

`cachedFn` ကို argument တွေနဲ့ ခေါ်တဲ့အခါ — အရင်ဆုံး cache ထဲမှာ ရလဒ် ရှိမရှိ စစ်ပါတယ်။ Cache ထဲမှာ ရှိပြီးသားဆိုရင် — အဲဒီ ရလဒ်ကို ပြန်ပေးပါတယ်။ မရှိဘူးဆိုရင် — argument တွေနဲ့ `fn` ကို ခေါ်ပြီး — ရလဒ်ကို cache ထဲမှာ သိမ်းကာ — ပြန်ပေးပါတယ်။ `fn` ကို ခေါ်တာက cache miss ဖြစ်တဲ့အခါမှပဲ ဖြစ်ပါတယ်။

> **မှတ်ချက်:** Input တွေကို အခြေခံပြီး ပြန်တန်ဖိုးတွေကို cache လုပ်တဲ့ optimization ကို [_memoization_](https://en.wikipedia.org/wiki/Memoization) လို့ ခေါ်ပါတယ်။ `cache` ကနေ ပြန်ရတဲ့ function ကို memoized function လို့ ဒီမှာ ခေါ်ပါမယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- React က memoized functions တွေ အားလုံးရဲ့ cache ကို — server request တစ်ခုစီမှာ invalidate (မသက်တော့အောင်) လုပ်ပါတယ်။
- `cache` ခေါ်မှု တစ်ခုစီက function အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ ဆိုလိုတာက — function တစ်ခုတည်းနဲ့ `cache` ကို အကြိမ်များစွာ ခေါ်ရင် — cache ချင်း မမျှဝေတဲ့ memoized functions အမျိုးမျိုး ရပါလိမ့်မယ်။
- `cachedFn` က errors တွေကိုလည်း cache လုပ်ပါတယ်။ `fn` က argument တချို့အတွက် error throw လုပ်ရင် — အဲဒါကို cache လုပ်ထားပြီး — `cachedFn` ကို အဲဒီ argument တွေနဲ့ ခေါ်တိုင်း — error အတူတူကို ပြန် throw လုပ်ပါတယ်။
- `cache` ကို [Server Components](https://react.dev/reference/rsc/server-components) တွေမှာပဲ သုံးလို့ရပါတယ်။

---

## အသုံးပြုပုံ (Usage)

### စရိတ်ကြီးတဲ့ တွက်ချက်မှုတစ်ခုကို cache လုပ်ခြင်း

ထပ်တူအလုပ်တွေ ရှောင်ဖို့ `cache` ကို သုံးပါတယ်:

```js
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

`user` object တစ်ခုတည်းကို `Profile` ရော `TeamReport` ရော render လုပ်နေတယ်ဆိုရင် — component နှစ်ခုက အလုပ်တွေ မျှဝေပြီး — အဲဒီ `user` အတွက် `calculateUserMetrics` ကို တစ်ခါပဲ ခေါ်နိုင်ပါတယ်။

`Profile` က အရင်ဆုံး render ဖြစ်တယ် ဆိုပါစို့။ သူက `getUserMetrics` ကို ခေါ်ပြီး — cache ထဲမှာ ရလဒ်ရှိမရှိ စစ်ပါတယ်။ အဲဒီ `user` နဲ့ `getUserMetrics` ကို ပထမဆုံးအကြိမ် ခေါ်တာမို့ — cache miss ဖြစ်ပါတယ်။ ဒါကြောင့် `getUserMetrics` က အဲဒီ `user` နဲ့ `calculateUserMetrics` ကို ခေါ်ပြီး — ရလဒ်ကို cache ထဲ ရေးပါတယ်။

`TeamReport` က သူ့ရဲ့ `users` စာရင်းကို render လုပ်ပြီး — `user` object တစ်ခုတည်းကို ရောက်တဲ့အခါ — `getUserMetrics` ကို ခေါ်ပြီး — cache ထဲကနေ ရလဒ်ကို ဖတ်ပါတယ်။

`calculateUserMetrics` ကို [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) ပို့ပြီး ဖျက်သိမ်းလို့ရတယ်ဆိုရင် — React က rendering ပြီးသွားပြီဆိုရင် စရိတ်ကြီးတဲ့ တွက်ချက်မှုကို ပယ်ဖျက်ဖို့ [`cacheSignal()`](https://react.dev/reference/react/cacheSignal) ကို သုံးနိုင်ပါတယ်။ `calculateUserMetrics` က ကိုယ်တိုင် `cacheSignal` ကို တိုက်ရိုက်သုံးပြီး cancellation ကို အတွင်းပိုင်းမှာ ကိုင်တွယ်ပြီးသား ဖြစ်နိုင်ပါတယ်။

**သတိပြုရန် — မတူညီတဲ့ memoized functions တွေကို ခေါ်ရင် မတူညီတဲ့ caches တွေကနေ ဖတ်ပါတယ်။** Cache တစ်ခုတည်းကို သုံးချင်ရင် — components တွေက memoized function တစ်ခုတည်းကိုပဲ ခေါ်ရပါမယ်။

အောက်က ဥပမာမှာ — `Temperature` ရော `Precipitation` ရော `cache` ကို သီးခြား ခေါ်ပြီး — ကိုယ်ပိုင် cache ရှိတဲ့ memoized function အသစ်တွေကို ဖန်တီးနေပါတယ်။ Component နှစ်ခုလုံးက `cityData` တစ်ခုတည်းအတွက် render လုပ်ရင် — `calculateWeekReport` ကို ခေါ်တဲ့ ထပ်တူအလုပ်တွေ ဖြစ်ပါလိမ့်မယ်:

```js
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

ဒါတွေအပြင် — `Temperature` က component render ဖြစ်တိုင်း memoized function အသစ် တစ်ခု ဖန်တီးတာမို့ — cache မျှဝေမှု လုံးဝ မရှိနိုင်ပါဘူး။

Cache hits အများဆုံး ရပြီး အလုပ်တွေ လျှော့ချဖို့ — component နှစ်ခုလုံးက memoized function တစ်ခုတည်းကိုပဲ ခေါ်ပြီး cache တစ်ခုတည်းကို သုံးသင့်ပါတယ်။ ဒါဆိုရင် — memoized function ကို components တွေကြား [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) လုပ်လို့ရတဲ့ သီးသန့် module တစ်ခုမှာ သတ်မှတ်ပါ:

```js
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

ဒီမှာ — component နှစ်ခုလုံးက `./getWeekReport.js` ကနေ export လုပ်ထားတဲ့ memoized function တစ်ခုတည်းကို ခေါ်ပြီး — cache တစ်ခုတည်းကို ဖတ်ရေး (read/write) လုပ်ကြပါတယ်။

### Data တစ်ခုရဲ့ snapshot ကို မျှဝေခြင်း

Component တွေကြားမှာ data တစ်ခုရဲ့ snapshot ကို မျှဝေဖို့ — `fetch` လို data-fetching function တစ်ခုကို `cache` နဲ့ ခေါ်ပါတယ်။ Components အများကြီးက data fetch တစ်ခုတည်း လုပ်နေရင် — request တစ်ခုပဲ ဖြစ်ပြီး — ပြန်ရတဲ့ data ကို cache လုပ်ကာ — components တွေကြားမှာ မျှဝေပါတယ်။ Server render တစ်လျှောက်လုံးမှာ components တွေ အားလုံးက data ရဲ့ snapshot တစ်ခုတည်းကိုပဲ ကိုးကားပါတယ်။

```js
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

`AnimatedWeatherCard` ရော `MinimalWeatherCard` ရော city တစ်ခုတည်းအတွက် render လုပ်ရင် — memoized function ကနေ data ရဲ့ snapshot တစ်ခုတည်းကိုပဲ ရပါတယ်။

`AnimatedWeatherCard` နဲ့ `MinimalWeatherCard` က `getTemperature` ဆီ city argument တွေ မတူညီတဲ့ဟာတွေ ပို့ရင်တော့ — `fetchTemperature` ကို နှစ်ခါ ခေါ်ပြီး — call site တစ်ခုစီက data မတူညီတာတွေ ရပါလိမ့်မယ်။

City argument က cache key အဖြစ် ဆောင်ရွက်ပါတယ်။

**မှတ်ချက် — Asynchronous rendering ကို Server Components တွေမှာပဲ support လုပ်ပါတယ်။**

```js
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

Client Components တွေမှာ asynchronous data သုံးတဲ့ components တွေကို render လုပ်ဖို့ — [`use()` documentation](/docs/react/use) ကို ကြည့်ပါ။

### Data တွေကို ကြိုတင် (preload) လုပ်ခြင်း

Long-running data fetch တစ်ခုကို cache လုပ်ထားခြင်းဖြင့် — component ကို render မလုပ်ခင် — asynchronous အလုပ်ကို စတင်နိုင်ပါတယ်:

```jsx
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page` ကို render လုပ်တဲ့အခါ — component က `getUser` ကို ခေါ်ပေမယ့် — ပြန်လာတဲ့ data ကို သုံးမထားတာ သတိပြုပါ။ ဒီစောစော `getUser` ခေါ်မှုက — `Page` က တခြား တွက်ချက်မှုတွေ လုပ်နေပြီး children တွေ render လုပ်နေချိန်မှာ — asynchronous database query ကို စတင်လိုက်တာပါ။

`Profile` ကို render လုပ်တဲ့အခါ — `getUser` ကို နောက်တစ်ခါ ခေါ်ပါတယ်။ အစောပိုင်း `getUser` ခေါ်မှုက ပြီးသွားပြီး user data ကို cache လုပ်ပြီးသား ဖြစ်ရင် — `Profile` က ဒီ data ကို တောင်းပြီး စောင့်တဲ့အခါ — remote procedure call တစ်ခု ထပ်မလိုဘဲ cache ထဲကနေ ရိုးရိုး ဖတ်လိုက်ရုံပါပဲ။ ကနဦး data request က မပြီးသေးဘူးဆိုရင်လည်း — ဒီပုံစံနဲ့ data ကို ကြိုတင် load လုပ်ထားတာက — data-fetching ရဲ့ နှောင့်နှေးချိန်ကို လျှော့ချပေးပါတယ်။

#### Asynchronous အလုပ်တွေကို cache လုပ်ခြင်း

[Asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) တစ်ခုကို evaluate လုပ်တဲ့အခါ — အဲဒီအလုပ်အတွက် [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) တစ်ခုကို ရပါတယ်။ Promise က အဲဒီအလုပ်ရဲ့ state (_pending_၊ _fulfilled_၊ _failed_) နဲ့ — နောက်ဆုံး settle ဖြစ်တဲ့ ရလဒ်ကို သိမ်းထားပါတယ်။

ဒီဥပမာမှာ — asynchronous function `fetchData` က `fetch` ကို စောင့်နေတဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်:

```js
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work
  await getData();
  // ...
}
```

`getData` ကို ပထမဆုံးအကြိမ် ခေါ်တဲ့အခါ — `fetchData` ကနေ ပြန်လာတဲ့ promise ကို cache လုပ်ပါတယ်။ နောက်ပိုင်း ရှာဖွေမှုတွေက promise တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။

ပထမဆုံး `getData` ခေါ်မှုက `await` မလုပ်ဘဲ — ဒုတိယ ခေါ်မှုကတော့ `await` လုပ်တာ သတိပြုပါ။ [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) က promise ရဲ့ settled result ကို စောင့်ပြီး ပြန်ပေးတဲ့ JavaScript operator တစ်ခုပါ။ ပထမဆုံး `getData` ခေါ်မှုက — ဒုတိယ `getData` ခေါ်မှုအတွက် ရှာဖွေနိုင်ဖို့ promise ကို cache လုပ်ဖို့ `fetch` ကို စတင်ပေးရုံပါပဲ။

ဒုတိယ ခေါ်မှုရောက်တဲ့အခါ promise က _pending_ ဖြစ်နေသေးရင် — `await` က ရလဒ်အတွက် ခေတ္တရပ်ပါတယ်။ Optimization က — `fetch` ကို စောင့်နေတဲ့အချိန်မှာ React က တွက်ချက်မှုတွေ ဆက်လုပ်နိုင်လို့ — ဒုတိယ ခေါ်မှုရဲ့ စောင့်ဆိုင်းချိန်ကို လျှော့ချပေးတာပါ။

Promise က error (သို့) _fulfilled_ ရလဒ်နဲ့ settle ဖြစ်ပြီးသား ဆိုရင် — `await` က အဲဒီ value ကို ချက်ချင်း ပြန်ပေးပါတယ်။ ရလဒ် နှစ်မျိုးလုံးမှာ — performance အကျိုးကျေးဇူး ရှိပါတယ်။

**သတိပြုရန် — Component တစ်ခုရဲ့ အပြင်ဘက်မှာ memoized function တစ်ခုကို ခေါ်ရင် cache ကို သုံးမှာ မဟုတ်ပါဘူး။**

```jsx
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React က memoized function ကို cache access ပေးတာက — component တစ်ခုထဲမှာပဲ ဖြစ်ပါတယ်။ Component ရဲ့ အပြင်ဘက်မှာ `getUser` ကို ခေါ်ရင် — function ကို evaluate တော့ လုပ်ပေမယ့် — cache ကို ဖတ်တာ/update လုပ်တာ မရှိပါဘူး။

ဒါက — cache access ကို component တစ်ခုကနေပဲ ဝင်လို့ရတဲ့ [context](/docs/react/passing-data-deeply-with-context) တစ်ခုကနေ ပေးထားလို့ပါ။

### `cache`၊ `memo`၊ `useMemo` — ဘယ်အချိန်မှာ ဘယ်ဟာကို သုံးမလဲ

ဖော်ပြခဲ့တဲ့ APIs တွေ အားလုံးက memoization ကို ပေးပါတယ် — ဒါပေမယ့် ကွာခြားချက်က — ဘာတွေကို memoize လုပ်ဖို့ ရည်ရွယ်လဲ၊ cache ကို ဘယ်သူတွေ ဝင်သုံးလို့ရလဲ၊ cache ကို ဘယ်အချိန်မှာ invalidate လုပ်လဲဆိုတာတွေပါ။

#### `useMemo`

ယေဘုယျအားဖြင့် — Client Component တစ်ခုထဲမှာ render တွေကြား စရိတ်ကြီးတဲ့ တွက်ချက်မှုတစ်ခုကို cache လုပ်ဖို့ [`useMemo`](/docs/react/use-memo) ကို သုံးသင့်ပါတယ်။ ဥပမာ — component တစ်ခုထဲမှာ data တစ်ခုရဲ့ transformation ကို memoize လုပ်တာမျိုးပါ:

```jsx
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```

ဒီဥပမာမှာ — `App` က record တစ်ခုတည်းနဲ့ `WeatherReport` နှစ်ခုကို render လုပ်ပါတယ်။ Component နှစ်ခုလုံးက အလုပ်တူတူ လုပ်နေရပေမယ့် — အလုပ်တွေ မျှဝေလို့ မရပါဘူး။ `useMemo` ရဲ့ cache က component အတွင်းမှာပဲ သက်ဆိုင်လို့ပါ။

ဒါပေမယ့် — `App` က re-render ဖြစ်ပြီး `record` object မပြောင်းဘူးဆိုရင် — component instance တစ်ခုစီက အလုပ် ကျော်လိုက်ပြီး `avgTemp` ရဲ့ memoized value ကို သုံးမယ်ဆိုတာကိုတော့ `useMemo` က သေချာစေပါတယ်။ `useMemo` က `avgTemp` ရဲ့ နောက်ဆုံး တွက်ချက်မှုကိုပဲ — ပေးထားတဲ့ dependencies တွေနဲ့ cache လုပ်မှာပါ။

#### `cache`

ယေဘုယျအားဖြင့် — Server Components တွေထဲမှာ components တွေကြား မျှဝေလို့ရတဲ့ အလုပ်တွေကို memoize လုပ်ဖို့ `cache` ကို သုံးသင့်ပါတယ်။

```js
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```

အရင် ဥပမာကို `cache` သုံးဖို့ ပြန်ရေးကြည့်ရင် — ဒီကိစ္စမှာ `WeatherReport` ရဲ့ ဒုတိယ instance က ထပ်တူအလုပ်တွေ ကျော်လိုက်ပြီး — ပထမ `WeatherReport` နဲ့ cache တစ်ခုတည်းကနေ ဖတ်နိုင်ပါတယ်။ အရင် ဥပမာနဲ့ နောက်ထပ် ကွာခြားချက်က — `cache` ကို data fetches တွေကို memoize လုပ်ဖို့လည်း အကြံပြုထားပြီး — `useMemo` ကတော့ တွက်ချက်မှုတွေအတွက်ပဲ သုံးသင့်တာပါ။

လောလောဆယ် — `cache` ကို Server Components တွေထဲမှာပဲ သုံးသင့်ပြီး — cache က server requests တွေကြားမှာ invalidate ဖြစ်မှာ ဖြစ်ပါတယ်။

#### `memo`

Component တစ်ခုရဲ့ props တွေ မပြောင်းရင် re-render မဖြစ်အောင် တားဖို့ [`memo`](/docs/react/memo) ကို သုံးသင့်ပါတယ်:

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

ဒီဥပမာမှာ — `MemoWeatherReport` component နှစ်ခုလုံးက ပထမဆုံး render လုပ်တဲ့အခါ `calculateAvg` ကို ခေါ်ပါလိမ့်မယ်။ ဒါပေမယ့် — `App` က re-render ဖြစ်ပြီး — `record` မှာ ပြောင်းလဲမှု မရှိရင် — props တွေ ဘာမှ မပြောင်းတာမို့ — `MemoWeatherReport` က re-render မဖြစ်တော့ပါဘူး။

`useMemo` နဲ့ ယှဉ်ရင် — `memo` က တွက်ချက်မှု တစ်ခုချင်းစီအစား — props တွေကို အခြေခံပြီး component ရဲ့ render ကို memoize လုပ်ပါတယ်။ `useMemo` လိုပဲ — memoized component က နောက်ဆုံး render ကိုပဲ — prop values တွေ နောက်ဆုံးပေါ်နဲ့ cache လုပ်ပါတယ်။ Props တွေ ပြောင်းတာနဲ့ — cache က invalidate ဖြစ်ပြီး — component က re-render ဖြစ်ပါတယ်။

---

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Argument တွေ အတူတူနဲ့ ခေါ်နေပေမယ့် — ကျွန်တော့် memoized function က ဆက်ပြီး run နေတယ်

အထက်က ဖော်ပြခဲ့တဲ့ သတိပေးချက်တွေကို ကြည့်ပါ:

- မတူညီတဲ့ memoized functions တွေကို ခေါ်ရင် — မတူညီတဲ့ caches တွေကနေ ဖတ်ပါတယ်။
- Component တစ်ခုရဲ့ အပြင်ဘက်မှာ memoized function တစ်ခုကို ခေါ်ရင် — cache ကို သုံးမှာ မဟုတ်ပါဘူး။

အထက်ပါ အချက်တွေထဲက တစ်ခုမှ မဟုတ်ဘူးဆိုရင် — React က cache ထဲမှာ တစ်ခုခု ရှိမရှိ စစ်တဲ့နည်းနဲ့ ဆိုင်တဲ့ ပြဿနာ ဖြစ်နိုင်ပါတယ်။

သင့် arguments တွေက [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) တွေ မဟုတ်ဘဲ — objects၊ functions၊ arrays လိုမျိုး (non-primitive) တွေ ဆိုရင် — object reference တစ်ခုတည်းကိုပဲ ပို့နေကြောင်း သေချာပါစေ။

Memoized function တစ်ခုကို ခေါ်တဲ့အခါ — React က input arguments တွေကို ရှာကြည့်ပြီး — ရလဒ် တစ်ခုခု cache လုပ်ပြီးသား ရှိမရှိ စစ်ပါတယ်။ React က arguments တွေရဲ့ shallow equality ကို သုံးပြီး — cache hit ရှိမရှိ ဆုံးဖြတ်ပါတယ်။

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

ဒီကိစ္စမှာ — `MapMarker` နှစ်ခုက အလုပ်တူတူ လုပ်နေပြီး — `{x: 10, y: 10, z: 10}` ဆိုတဲ့ value တစ်ခုတည်းနဲ့ `calculateNorm` ကို ခေါ်နေတာလို ပုံရပါတယ်။ Object တွေထဲမှာ value တွေ တူညီနေပေမယ့် — component တစ်ခုစီက ကိုယ်ပိုင် `props` object ကို ဖန်တီးတာမို့ — object reference ချင်း မတူပါဘူး။

React က input ပေါ်မှာ [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ကို သုံးပြီး — cache hit ရှိမရှိ စစ်ပါတယ်။

```js
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

ဒါကို ဖြေရှင်းနည်း တစ်ခုက — vector ရဲ့ dimensions တွေကို `calculateNorm` ဆီ ပို့တာပါ။ Dimensions တွေကိုယ်တိုင် primitives တွေ ဖြစ်လို့ — ဒါ အလုပ်လုပ်ပါတယ်။

နောက်ထပ် ဖြေရှင်းနည်းတစ်ခုက — vector object ကိုယ်တိုင်ကို component ရဲ့ prop အဖြစ် ပို့တာပါ။ Component instance နှစ်ခုလုံးဆီ object တစ်ခုတည်းကိုပဲ ပို့ဖို့ လိုပါတယ်:

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
