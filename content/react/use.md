---
title: "use"
description: "Render အတွင်းမှာ Promise ဒါမှမဟုတ် context လို resource တွေကို ဖတ်နိုင်တဲ့ React API — Suspense နဲ့ data reading/fetching၊ conditional ဖတ်ခြင်း၊ Promise caching နဲ့ Error Boundary အကြောင်း"
order: 42
source: "https://react.dev/reference/react/use"
status: translated
updated: 2026-09-02
---

`use` ဆိုတာ — render လုပ်နေစဉ်အတွင်းမှာ resource တစ်ခုကို ဖတ်နိုင်စေတဲ့ React API တစ်ခုပါ။ ဥပမာ — [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) တစ်ခု ဒါမှမဟုတ် context တစ်ခုလိုမျိုးပေါ့။

```js
const value = use(resource);
```

## ရည်ညွှန်းချက် (Reference)

### `use(context)` — Context ဖတ်ခြင်း

Context တစ်ခုရဲ့ value ကို ဖတ်ဖို့ `use` ကို context နဲ့ ခေါ်ပါတယ်။ `useContext` နဲ့ မတူတာက — `use` ကို `if` လို conditional statements တွေနဲ့ loops တွေရဲ့ အတွင်းမှာ ခေါ်လို့ရပါတယ်။

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

**Parameters (ပါရာမီတာများ)**

- `context`: `createContext` နဲ့ ဖန်တီးထားတဲ့ context တစ်ခု။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- ခေါ်နေတဲ့ component အပေါ်က အနီးဆုံး context provider က ဆုံးဖြတ်ပေးတဲ့ context value ကို ပြန်ပေးပါတယ်။ Provider မရှိဘူးဆိုရင် — `createContext` ဆီ ပေးထားတဲ့ `defaultValue` ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `use` ကို Component တစ်ခု ဒါမှမဟုတ် Hook တစ်ခုရဲ့ အတွင်းမှာပဲ ခေါ်ရပါတယ်။
- Server Components တွေထဲမှာတော့ context ကို `use` နဲ့ ဖတ်တာ မထောက်ပံ့ပါဘူး။

### `use(promise)` — Promise ဖတ်ခြင်း

Promise တစ်ခုရဲ့ resolved value ကို ဖတ်ဖို့ `use` ကို Promise နဲ့ ခေါ်ပါတယ်။ Promise က pending ဖြစ်နေသရွေ့ — `use` ကို ခေါ်ထားတဲ့ component က *suspend* (ခေတ္တရပ်ဆိုင်း) ဖြစ်ပါတယ်။ နာမည်က Hook လိုဆိုပေမယ့် — **`use` က Hook မဟုတ်ပါဘူး။** Hooks တွေနဲ့ မတူဘဲ — ဒါကို loops တွေနဲ့ `if` လို conditional statements တွေရဲ့ အတွင်းမှာ ခေါ်လို့ရပါတယ်။

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

`use` ကို ခေါ်တဲ့ component ကို Suspense boundary တစ်ခုအတွင်းမှာ ထုပ်ထားရင် — Promise က pending ဖြစ်နေစဉ်မှာ fallback ကို ပြသပါလိမ့်မယ်။ Promise က resolve ဖြစ်သွားရင် — Suspense fallback ကို `use` ကနေ ရတဲ့ data ကို သုံးပြီး render လုပ်ထားတဲ့ components တွေနဲ့ အစားထိုးလိုက်ပါတယ်။ Promise က rejected ဖြစ်ရင်တော့ — အနီးဆုံး Error Boundary ရဲ့ fallback ကို ပြသပါလိမ့်မယ်။

**Parameters (ပါရာမီတာများ)**

- `promise`: resolved value ကို ဖတ်ချင်တဲ့ Promise တစ်ခု။ **Promise ကို cache လုပ်ထားရမှာ ဖြစ်ပြီး** — re-render တွေကြားမှာ တူညီတဲ့ instance ကို ပြန်သုံးနိုင်ဖို့ လိုပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- Promise ရဲ့ resolved value။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `use` ကို Component တစ်ခု ဒါမှမဟုတ် Hook တစ်ခုရဲ့ အတွင်းမှာပဲ ခေါ်ရပါတယ်။
- `use` ကို try-catch block ရဲ့ အတွင်းမှာ ခေါ်လို့ မရပါဘူး။ Error ကို ဖမ်းပြီး fallback ပြချင်ရင် — component ကို Error Boundary တစ်ခုနဲ့ ထုပ်ပါ။
- `use` ဆီ ပေးတဲ့ Promises တွေကို cache လုပ်ထားရမှာ ဖြစ်ပြီး — re-render တွေကြားမှာ Promise instance တစ်ခုတည်းကို ပြန်သုံးနိုင်ရပါမယ်။
- Server Component ကနေ Client Component ဆီ Promise တစ်ခု ပို့တဲ့အခါ — သူ့ရဲ့ resolved value က serializable ဖြစ်ရပါမယ်။

### Canary သာရတဲ့ — `use(browser())`

Browser ထဲမှာပဲ render သင့်တဲ့ component တစ်ခုထဲမှာ — `browser()` က ပြန်ပေးတဲ့ value ကို `use` ဆီ ပေးပါတယ်။ Server rendering အတွင်းမှာ `use(browser())` ကို ခေါ်တဲ့ component က suspend ဖြစ်ပြီး — React က အနီးဆုံး Suspense boundary ရဲ့ fallback ကို HTML ထဲ ထည့်ပါတယ်။ Browser ထဲမှာတော့ `use(browser())` က `undefined` ကို ပြန်ပေးလို့ — component က ပုံမှန်အတိုင်း render ဖြစ်ပါတယ်။

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

**Caveats (သတိပြုရမည့်အချက်များ)**

- `use(browser())` ကို ခေါ်တဲ့ component က server rendering အတွင်းမှာ Suspense boundary တစ်ခုရဲ့ အတွင်းမှာ ရှိရပါမယ် — မရှိရင် server rendering က မအောင်မြင်ပါဘူး။
- React Server Components app တစ်ခုထဲမှာ — `use(browser())` ကို Server Component ကနေ မဟုတ်ဘဲ Client Component တစ်ခုကနေပဲ ခေါ်ရပါတယ်။

## အသုံးပြုပုံ (Usage)

### `use` နဲ့ Context ဖတ်ခြင်း

Context တစ်ခုကို `use` ဆီ ပေးလိုက်ရင် — သူက `useContext` နဲ့ ဆင်တူ အလုပ်လုပ်ပါတယ်။ `useContext` ကို component ရဲ့ အပေါ်ဆုံးအဆင့်မှာပဲ ခေါ်လို့ရပေမယ့် — `use` ကိုတော့ `if` လို conditionals တွေနဲ့ `for` လို loops တွေရဲ့ အတွင်းမှာ ခေါ်လို့ရပါတယ်။ Context value ကို ဆုံးဖြတ်ဖို့ — React က component tree ကို ရှာပြီး ဒီ context အတွက် **အပေါ်ဆုံးက အနီးဆုံး context provider** ကို ရှာပါတယ်။

`Button` ဆီ context ပို့ဖို့ — `Button` ကိုဖြစ်စေ၊ သူ့ရဲ့ parent components တစ်ခုခုကိုဖြစ်စေ သက်ဆိုင်ရာ context provider ထဲမှာ ထုပ်ထားပါ။ Provider နဲ့ `Button` ကြားမှာ component အလွှာ ဘယ်လောက်ပဲ များများ — `Form` ရဲ့ အတွင်းက ဘယ်နေရာမှာပဲ ရှိရှိ `Button` က `use(ThemeContext)` ကို ခေါ်ရင် `"dark"` value ကို ရပါလိမ့်မယ်။

```js
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

`useContext` နဲ့ မတူဘဲ — `use` ကို conditionals တွေနဲ့ loops တွေထဲမှာ ခေါ်လို့ရတာမို့ — Context ထဲက value တွေကို conditionally ဖတ်နိုင်ပါတယ်။ ဥပမာ — `show` ဖြစ်မှပဲ theme ကို ဖတ်တာမျိုးပေါ့:

```js
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

> **သတိပြုရန်:** `useContext` လိုပဲ — `use(context)` ကလည်း ခေါ်တဲ့ component ရဲ့ *အပေါ်က* အနီးဆုံး context provider ကိုပဲ အမြဲ ရှာပါတယ်။ အပေါ်ကို ပဲ ရှာတာမို့ — `use(context)` ကို ခေါ်နေတဲ့ component ကိုယ်တိုင် အတွင်းက context providers တွေကိုတော့ **ထည့်တွက်မပေးပါဘူး။**

အောက်က ဥပမာမှာ — `Panel` နဲ့ `Button` နှစ်ခုလုံးက `use(ThemeContext)` ကို ခေါ်ပါတယ်။ `Button` က `show` ဖြစ်မှပဲ ဖတ်တာမို့ — conditional ဖတ်ခြင်းကို သရုပ်ပြပါတယ်:

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

### Context ကနေ Promise တစ်ခု ဖတ်ခြင်း

Prop drilling မလုပ်ဘဲ asynchronous data တွေကို မျှဝေဖို့ — Promise တစ်ခုကို context value အဖြစ် သတ်မှတ်ပြီး — `use(context)` နဲ့ ဖတ်ကာ `use(promise)` နဲ့ resolve လုပ်နိုင်ပါတယ်:

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

Context value ကိုယ်တိုင်က awaited မဟုတ်တာမို့ — value ဖတ်ဖို့ `use` ခေါ်မှု နှစ်ကြိမ် လိုပါတယ်။ Promise ကို ဖတ်တဲ့ components တွေကို Suspense boundary တစ်ခုအတွင်းမှာ ထုပ်ထားပါ — ဒါဆို Promise pending ဖြစ်နေစဉ်မှာ သက်ဆိုင်ရာ subtree ကပဲ suspend ဖြစ်မှာပါ။ Server Components တွေနဲ့ ဒီ pattern ကို သုံးရင် — Promise ကို context ထဲမှာ tree ရဲ့ မြင့်တဲ့နေရာမှာ မထားမိစေဖို့ သတိထားပါ — ဘာလို့လဲဆိုတော့ refetch တိုင်း သိပ်များတဲ့ app အစိတ်အပိုင်းတွေ ပြန်ဆွဲခံရနိုင်လို့ပါ။

### `use` နဲ့ Promise တစ်ခု ဖတ်ခြင်း

Promise တစ်ခုကို `use` ဆီ ပေးပြီး resolved value ကို ဖတ်ပါတယ်။ Promise pending ဖြစ်နေစဉ်မှာ component က suspend ဖြစ်ပါတယ်။

```js
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

`use` ကို ခေါ်တဲ့ component ကို Suspense boundary တစ်ခုနဲ့ ထုပ်ထားပါ — React က fallback ကို ပြနိုင်ဖို့ပါ။ Promise resolve ဖြစ်တာနဲ့ — React က `use` နဲ့ value ကို ဖတ်ပြီး fallback ကို render လုပ်ပြီးသား component နဲ့ အစားထိုးပါတယ်။ Rejected ဖြစ်တဲ့ Promises တွေက အနီးဆုံး Error Boundary ဆီ ရောက်သွားပါတယ်:

```js
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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

function Loading() {
  return <h2>Loading...</h2>;
}
```

**`use` နဲ့ data fetching က Effect ထဲမှာ fetch လုပ်တာနဲ့ မတူပါဘူး။** `use` မပေါ်ခင်က — data ရောက်တဲ့အခါ Effect ထဲမှာ fetch လုပ်ပြီး state ကို update လုပ်တာ သာမန်ဖြစ်ပါတယ်။ `use` နဲ့ ယှဉ်ရင် ဒီနည်းက loading/error states တွေကို ကိုယ်တိုင် စီမံရလို့ ပိုရှုပ်ပြီး — Effect ထဲမှာ fetching လုပ်တာ ဘာကြောင့် မကောင်းလဲဆိုတာကို သီးခြားသင်ခန်းစာမှာ ရှင်းပြထားပါတယ်။

> **သတိပြုရန် — `use` ဆီ ပေးတဲ့ Promises တွေကို cache လုပ်ရမယ်:**
>
> Render အတွင်းမှာ ဖန်တီးလိုက်တဲ့ Promises တွေက render တိုင်း ပြန်လည် ဖန်တီးခံရလို့ — React က Suspense fallback ကို ထပ်ခါထပ်ခါ ပြပြီး content မပေါ်နိုင်တော့ပါဘူး:
>
> ```js
> function Albums() {
>   // 🔴 `fetch` creates a new Promise on every render.
>   const albums = use(fetch('/albums'));
>   // ...
> }
> ```
>
> အဲဒီအစား — cache တစ်ခုကနေ၊ Suspense-enabled framework တစ်ခုကနေ ဒါမှမဟုတ် Server Component တစ်ခုကနေ ရတဲ့ Promise ကိုပဲ ပေးပါ:
>
> ```js
> // ✅ fetchData reads the Promise from a cache.
> const albums = use(fetchData('/albums'));
> ```
>
> Render မစခင် (event handler၊ route loader ဒါမှမဟုတ် Server Component ထဲမှာ) Promise တွေကို ဖန်တီးပြီး `use` ကို ခေါ်တဲ့ component ဆီ ပေးတာက အကောင်းဆုံးပါ။ Render ထဲမှာ lazily fetch လုပ်တာက network request တွေကို နှောင့်နှေးစေပြီး waterfalls တွေ ဖန်တီးနိုင်လို့ပါ။

### Client Components တွေအတွက် Promises တွေကို Caching လုပ်ခြင်း

Client Components တွေထဲမှာ `use` ဆီ ပေးတဲ့ Promises တွေကို cache လုပ်ထားရမှာ ဖြစ်ပြီး — re-render တွေကြားမှာ Promise instance တစ်ခုတည်းကို ပြန်သုံးရပါမယ်။ Render ထဲမှာ Promise အသစ် တစ်ခုကို တိုက်ရိုက် ဖန်တီးရင် — re-render တိုင်းမှာ Suspense fallback ပြနေပါလိမ့်မယ်:

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

`fetchData` က URL တစ်ခုတည်းနဲ့ ခေါ်တိုင်း Promise တစ်ခုတည်းကို ပြန်ပေးပါတယ်။ Re-render တစ်ခုမှာ `use` က Promise တစ်ခုတည်းကို ပြန်ရတဲ့အခါ — suspend မလုပ်တော့ဘဲ ဖြေရှင်းပြီးသား value ကို synchronously ဖတ်လိုက်ပါတယ်။ Cache လုပ်နည်းက framework ပေါ်မှာ မူတည်ပြီး — frameworks တွေမှာ ပုံမှန်အားဖြင့် built-in caching mechanisms တွေ ပါပါတယ်။ Framework မသုံးရင် — အထက်က module-level cache လိုမျိုး ရိုးရှင်းတဲ့ cache ကို သုံးနိုင်ပါတယ်။

Promise တွေကို cache လုပ်တဲ့ အခြေခံ pattern က URL အလိုက် Promise ကို သိမ်းတာပါ။ Data ရှိပြီးသား ဖြစ်တဲ့အခါ မလိုအပ်တဲ့ Suspense fallbacks တွေကို ရှောင်ဖို့ — Promise ပေါ်မှာ `status` နဲ့ `value` (ဒါမှမဟုတ် `reason`) fields တွေကို ထားနိုင်ပါတယ်။ React က `use` ခေါ်တဲ့အခါ ဒီ fields တွေကို စစ်ပါတယ်: `status` က `'fulfilled'` ဆို `value` ကို suspend မလုပ်ဘဲ ဖတ်ပြီး — `'rejected'` ဆို `reason` ကို throw လုပ်ပြီး — field မရှိ ဒါမှမဟုတ် `'pending'` ဆို suspend လုပ်ပါတယ်။ ဒါက Suspense-compatible data layers တွေ တည်ဆောက်နေတဲ့ library authors တွေအတွက် အဓိက အသုံးဝင်ပြီး — React ကလည်း ကိုယ်တိုင် `status` field ကို set ပေးပါတယ်။

> **သတိပြုရန် — Promise က settle ဖြစ်ပြီးသားလားဆိုတာကို ကြည့်ပြီး `use` ခေါ်တာကို မကျော်လိုက်ပါနဲ့:**
>
> တခြား hooks တွေနဲ့ မတူဘဲ `use` ကို conditions နဲ့ loops ထဲမှာ ခေါ်လို့ရပေမယ့် — Promise ကိုယ်တိုင်အတွက်တော့ `use` ကို အမြဲ ခေါ်ရပါတယ်။ `use` ကို ကျော်ဖို့ `promise.status` ဒါမှမဟုတ် `promise.value` ကို တိုက်ရိုက် ဖတ်လို့ မရပါဘူး — Promise ကိုပဲ `use` ဆီ အမြဲ ပေးပြီး React ကို ကိုင်တွယ်ခွင့် ပေးပါ။ `use(promise)` ကို conditionally ခေါ်လို့ရပေမယ့် — Promise ကိုယ်တိုင်ပေါ် အခြေခံပြီး conditionally `use(promise)` ခေါ်တာတော့ မလုပ်ရပါဘူး။

### Client Components တွေထဲမှာ Data ကို ပြန်လည် Fetch လုပ်ခြင်း

URL တစ်ခုတည်းမှာ data ကို ပြန်ဆန်းသစ်ဖို့ (ဥပမာ — "Refresh" button တစ်ခုနဲ့) — cache entry ကို မသက်တော့ဘဲ (invalidate) — `startTransition` ရဲ့ အတွင်းမှာ fetch အသစ် တစ်ခုကို စပါ။ ရလာတဲ့ Promise ကို state ထဲ သိမ်းပြီး re-render ဖြစ်အောင် လုပ်ပါတယ်။ Promise အသစ်က pending ဖြစ်နေစဉ်မှာ — update က Transition ထဲမှာ ရှိတာမို့ — React က ရှိပြီးသား content ကို ဆက်ပြပါတယ်:

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData` က cache entry အဟောင်းကို ရှင်းပြီး URL တစ်ခုတည်းမှာ fetch အသစ် တစ်ခုကို စပါတယ်။ ရလာတဲ့ Promise ကို state ထဲ သိမ်းတာက Transition အတွင်းမှာ re-render ဖြစ်စေပြီး — re-render မှာ `Albums` က Promise အသစ်ကို ရတဲ့အခါ — React က content အဟောင်းကို ဆက်ပြနေစဉ်မှာ `use` က Promise အသစ်ပေါ်မှာ suspend ဖြစ်ပါတယ်။ Suspense ကို ထောက်ပံ့တဲ့ frameworks တွေမှာ ကိုယ်ပိုင် caching/invalidation mechanisms တွေ ရှိတာမို့ — လက်တွေ့မှာ framework ရဲ့ data fetching ဖြေရှင်းနည်းကိုပဲ ဦးစားပေး သုံးပါ။

### Hover လုပ်ချိန်မှာ Data ကို Preload လုပ်ခြင်း

Data မလိုခင် စောပြီး load စနိုင်ပါတယ် — hover event အတွင်းမှာ `fetchData` ကို ခေါ်ခြင်းဖြင့်ပါ။ `fetchData` က Promise ကို cache လုပ်တာမို့ — အသုံးပြုသူ click လုပ်တဲ့အခါ data က ရှိပြီးသား ဖြစ်နေနိုင်ပါတယ်။ `use` က ဖတ်တဲ့အချိန်မှာ Promise က resolve ဖြစ်ပြီးသားဆိုရင် — React က Suspense fallback မပြဘဲ ချက်ချင်း render လုပ်ပါတယ်:

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

### Server ကနေ Client ဆီ Data Streaming လုပ်ခြင်း

Server Component တစ်ခုကနေ Client Component တစ်ခုဆီ Promise ကို prop အဖြစ် ပို့ခြင်းဖြင့် — data တွေကို server ကနေ client ဆီ stream လုပ်နိုင်ပါတယ်:

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Client Component က သူရတဲ့ Promise ကို `use` API ဆီ ပေးပြီး — Server Component က စဖန်တီးခဲ့တဲ့ Promise ရဲ့ value ကို ဖတ်ပါတယ်:

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

Promise တစ်ခုရှိရင် — သူ့ရဲ့ value ကို ဖတ်ဖို့ ဘယ်နေရာမှာ ဖြေရှင်းမလဲ ဆုံးဖြတ်ရပါတယ်: Server Component ထဲမှာဆို `await` နဲ့ ဖြေရှင်းပြီး — Client Component ထဲမှာဆို `use` နဲ့ ဖြေရှင်းပါတယ်။ ပုံမှန်အားဖြင့် အလွယ်ဆုံးက Promise ကို ဖန်တီးတဲ့နေရင်းမှာ `await` လုပ်တာပါ။ ဒါပေမယ့် ချက်ချင်း မဖြေရှင်းဘဲ — Promise ကို prop အဖြစ် အောက်ကို ပို့ပြီး tree ထဲ ပိုနက်တဲ့နေရာမှာ ဖြေရှင်းလည်း ရပါတယ်။ ဒါဆိုရင် Promise ကို ဖတ်တဲ့ အစိတ်အပိုင်းကပဲ suspend ဖြစ်ပြီး — ကျန်တဲ့ page က ချက်ချင်း render ဖြစ်ပါတယ်။ Client Components တွေက render အတွင်းမှာ `await` မလုပ်နိုင်လို့ — `use` နဲ့ပဲ ဖြေရှင်းရတာ ဖြစ်ပါတယ်။

### Error Boundary တစ်ခုနဲ့ Error ပြသခြင်း

`use` ဆီ ပေးထားတဲ့ Promise က rejected ဖြစ်ရင် — error က အနီးဆုံး Error Boundary ဆီ ပျံ့နှံ့သွားပါတယ်။ `use` ကို ခေါ်တဲ့ component ကို Error Boundary တစ်ခုနဲ့ ထုပ်ထားရင် — Promise rejected ဖြစ်တဲ့အခါ fallback ကို ပြနိုင်ပါတယ်။ Error Boundary က rejection ကို ဖမ်းပြီး — "Try again" button တစ်ခုပါတဲ့ fallback ကို ပြပါတယ်။ Retry လုပ်ဖို့ — `startTransition` အတွင်းမှာ state ထဲက Promise အသစ်တစ်ခုကို `refetchData` နဲ့ set လုပ်ပြီး re-render ဖြစ်စေပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "Suspense Exception: This is not a real error!" error တစ်ခု ရနေတယ်

သင်က `use` ကို try-catch block ရဲ့ အတွင်းမှာ ခေါ်နေလို့ပါ။ `use` က Suspense နဲ့ ပေါင်းစပ်ဖို့ အတွင်းမှာ throw လုပ်တာမို့ — try-catch နဲ့ ထုပ်လို့ မရပါဘူး။ Error တွေကို ကိုင်တွယ်ဖို့ — `use` ကို ခေါ်တဲ့ component ကို Error Boundary တစ်ခုနဲ့ ထုပ်ပါ:

```jsx
function Albums({ albumsPromise }) {
  // ✅ Call `use` without try-catch
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Use an Error Boundary to handle errors
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

### "A component was suspended by an uncached promise" warning တစ်ခု ရနေတယ်

`use` ဆီ ပေးတဲ့ Promise ကို cache မလုပ်ထားလို့ — React က re-render တွေကြားမှာ ပြန်သုံးလို့ မရတာပါ။ Render ထဲမှာ `fetch` ဒါမှမဟုတ် `async` function တစ်ခုကို တိုက်ရိုက် ခေါ်တဲ့အခါ မကြာခဏ ဖြစ်တတ်ပါတယ်။

```js
function Albums() {
  // 🔴 This creates a new Promise on every render
  const albums = use(fetch('/albums'));
  // ...
}
```

ဖြေရှင်းဖို့ — URL တစ်ခုတည်းအတွက် Promise တစ်ခုတည်းကို ပြန်ပေးတဲ့ `fetchData` လိုမျိုး cached function ကနေ ရတဲ့ Promise ကိုပဲ `use` ဆီ ပေးပါ။
