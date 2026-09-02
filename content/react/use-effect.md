---
title: "useEffect"
description: "Component တွေကို external systems တွေနဲ့ ထပ်တူပြုဖို့ သုံးတဲ့ React Hook — setup နဲ့ cleanup function များ၊ dependencies array သတ်မှတ်ပုံ၊ Effect ဘယ်အချိန် run လဲ၊ Strict Mode မှာ နှစ်ကြိမ် ပြေးခြင်း"
order: 43
source: "https://react.dev/reference/react/useEffect"
status: translated
updated: 2026-09-02
---

`useEffect` ဆိုတာ — component တစ်ခုကို [external system တစ်ခုနဲ့ ထပ်တူပြုဖို့ (synchronize)](/docs/react/synchronizing-with-effects) သုံးတဲ့ React Hook တစ်ခုပါ။

```js
useEffect(setup, dependencies?)
```

## ရည်ညွှန်းချက် (Reference)

### `useEffect(setup, dependencies?)`

Effect တစ်ခုကို ကြေညာဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useEffect` ကို ခေါ်ပါတယ်:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

**Parameters (ပါရာမီတာများ)**

- `setup`: သင့် Effect ရဲ့ logic ပါတဲ့ function တစ်ခု။ ဒီ setup function က *cleanup* function တစ်ခုကို ပြန်ပေးနိုင်ပါတယ်။ Component က [commit](/docs/react/render-and-commit) ဖြစ်တဲ့အခါ React က setup function ကို run ပါတယ်။ Dependencies ပြောင်းလဲတဲ့ commit တိုင်းမှာ — React က cleanup function ကို (ပေးထားရင်) တန်ဖိုးအဟောင်းတွေနဲ့ အရင်ပြေး — ပြီးမှ setup function ကို တန်ဖိုးအသစ်တွေနဲ့ ပြေးပါတယ်။ Component ကို DOM ကနေ ဖယ်ရှားလိုက်ရင်လည်း — React က cleanup function ကို ပြေးပေးပါတယ်။
- **optional** `dependencies`: `setup` code ရဲ့ အတွင်းမှာ သုံးထားတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables/functions တွေ ပါဝင်ပါတယ်။ Linter က reactive value တိုင်း ကို dependency အဖြစ် မှန်မှန် သတ်မှတ်ထားကြောင်း စစ်ဆေးပါတယ်။ Dependency list က item အရေအတွက် မပြောင်းလဲဘဲ `[dep1, dep2, dep3]` လို inline ရေးရပါတယ်။ React က dependency တစ်ခုချင်းစီကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှုနဲ့ ယခင် တန်ဖိုးနဲ့ နှိုင်းယှဉ်ပါတယ်။ ဒီ argument ကို ချန်လိုက်ရင် — Effect က component ရဲ့ commit တိုင်းပြီးနောက် ပြန် run ပါလိမ့်မယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- `useEffect` က `undefined` ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useEffect` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ လိုအပ်ရင် — component အသစ်တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- **External system တစ်ခုခုနဲ့ ထပ်တူပြုဖို့ မဟုတ်ဘူးဆိုရင်** — Effect တစ်ခု မလိုအပ်နိုင်ပါဘူး။
- Strict Mode ဖွင့်ထားရင် — React က ပထမဆုံး real setup မလုပ်ခင် development-only setup+cleanup cycle တစ်ခု **အပိုဆောင်း run** ပါတယ်။ ဒါက သင့် cleanup logic က setup logic ကို "မှန်မှန် ထင်ဟပ်" ပြီး setup လုပ်နေတာကို ရပ်/ပြန်ဖျက်နိုင်ကြောင်း စစ်ဆေးတဲ့ stress-test တစ်ခုပါ။ ပြဿနာ တစ်ခုခု ဖြစ်ရင် cleanup function ကို implement လုပ်ပါ။
- Dependencies တချို့က component အတွင်းမှာ သတ်မှတ်ထားတဲ့ objects ဒါမှမဟုတ် functions တွေဆိုရင် — Effect က လိုအပ်တာထက် ပိုပြီး မကြာခဏ ပြန် run နိုင်ပါတယ်။ ဒါဆိုရင် မလိုအပ်တဲ့ [object](#removing-unnecessary-object-dependencies) နဲ့ [function](#removing-unnecessary-function-dependencies) dependencies တွေကို ဖယ်ရှားပါ။
- သင့် Effect က interaction (click လိုမျိုး) ကြောင့် မဟုတ်ဘူးဆိုရင် — React က ပုံမှန်အားဖြင့် Effect ကို run မလုပ်ခင် browser က screen အသစ်ကို **အရင်ဆုံး paint** လုပ်ခွင့် ပေးပါတယ်။ Effect က visual တစ်ခုခု လုပ်နေပြီး နှောင့်နှေးမှု သိသာရင် (flicker ဖြစ်တာမျိုး) — `useEffect` အစား `useLayoutEffect` ကို သုံးပါ။
- သင့် Effect က interaction (click လိုမျိုး) ကြောင့် ဖြစ်ရင် — React က browser paint မလုပ်ခင် Effect ကို run နိုင်ပါတယ်။ Paint ပြီးမှပဲ လုပ်စေချင်တဲ့ အလုပ်ရှိရင် — `alert()` လိုမျိုးဆို — `setTimeout` ကို သုံးနိုင်ပါတယ်။
- Effects တွေက **client ပေါ်မှာပဲ run ပါတယ်** — server rendering အတွင်းမှာ မပြေးပါဘူး။

## အသုံးပြုပုံ (Usage)

### External System တစ်ခုနဲ့ ချိတ်ဆက်ခြင်း

Component တချို့က page ပေါ်မှာ ပြသနေတုန်း network၊ browser API ဒါမှမဟုတ် third-party library တစ်ခုခုနဲ့ ချိတ်ဆက်ထားဖို့ လိုပါတယ်။ ဒီ systems တွေက React ရဲ့ ထိန်းချုပ်မှု အောက်မှာ မဟုတ်တာမို့ — *external* လို့ ခေါ်ပါတယ်။ External system တစ်ခုဆီ ချိတ်ဆက်ဖို့ — component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useEffect` ကို ခေါ်ပြီး argument နှစ်ခု ပေးပါ:

1. အဲဒီ system ဆီ ချိတ်ဆက်တဲ့ *setup code* ပါတဲ့ **setup function** တစ်ခု — ဒါက system ကနေ ချိတ်ဖြုတ်တဲ့ *cleanup code* ပါတဲ့ **cleanup function** တစ်ခုကို ပြန်ပေးသင့်ပါတယ်။
2. အဲဒီ functions တွေရဲ့ အတွင်းမှာ သုံးထားတဲ့ component ရဲ့ တန်ဖိုးတိုင်း ပါဝင်တဲ့ **dependencies စာရင်း** တစ်ခု။

**React က သင့် setup နဲ့ cleanup functions တွေကို လိုအပ်တိုင်း ခေါ်ပါတယ် — အကြိမ်များစွာ ဖြစ်နိုင်ပါတယ်:**

- Component ကို page ထဲ ထည့်လိုက်တဲ့အခါ *(mount)* — setup code က run ပါတယ်။
- Dependencies ပြောင်းလဲသွားတဲ့ commit တိုင်းပြီးနောက် — အရင်ဆုံး cleanup code က props/state အဟောင်းတွေနဲ့ run ပြီး — ပြီးမှ setup code က props/state အသစ်တွေနဲ့ run ပါတယ်။
- Component ကို page ကနေ ဖယ်ရှားလိုက်တဲ့အခါ *(unmount)* — cleanup code က နောက်ဆုံးတစ်ကြိမ် run ပါတယ်။

အထက်က `ChatRoom` ဥပမာမှာဆို — page ပေါ် ရောက်တာနဲ့ ကနဦး `serverUrl` နဲ့ `roomId` နဲ့ chat room ဆီ ချိတ်ဆက်ပြီး — တစ်ခုခု ပြောင်းရင် (ဥပမာ dropdown ကနေ room တစ်ခုခု ရွေးရင်) — Effect က room အဟောင်းကနေ ချိတ်ဖြုတ်ပြီး room အသစ်ဆီ ချိတ်ဆက်ပါတယ်။ Component ကို page ကနေ ဖယ်ရှားရင်တော့ နောက်ဆုံးတစ်ကြိမ် ချိတ်ဖြုတ်ပါတယ်။

**[Bug တွေ ရှာတွေ့စေဖို့](/docs/react/synchronizing-with-effects) development မှာ React က setup+cleanup ကို setup အစစ် မလုပ်ခင် တစ်ကြိမ် အပိုပြေးပါတယ်။** ဒါက Effect ရဲ့ logic မှန်မမှန် စစ်ဆေးတဲ့ stress-test တစ်ခုပါ။ မြင်သာတဲ့ ပြဿနာတွေ ပေါ်ရင် — သင့် cleanup function မှာ logic တချို့ ပျောက်နေတာပါ — setup လုပ်နေတာကို ရပ်/ပြန်ဖျက်ဖို့ cleanup က လိုပါတယ်။ အသုံးပြုသူအနေနဲ့ — setup တစ်ခါခေါ်တာ (production မှာလို) နဲ့ *setup* → *cleanup* → *setup* ဆိုတဲ့ sequence (development မှာလို) ကို ခွဲခြားလို့ မရအောင် ရေးသင့်ပါတယ်။

> **မှတ်ချက်:** Effect က သင့် component ကို external system တစ်ခုခုနဲ့ ထပ်တူဖြစ်နေအောင် ထားပေးပါတယ်။ ဒီမှာ *external system* ဆိုတာ React က မထိန်းချုပ်တဲ့ code အားလုံးပါ — [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)/[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) နဲ့ စီမံတဲ့ timer၊ [`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)/[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) သုံးတဲ့ event subscription၊ `animation.start()`/`animation.reset()` API ပါတဲ့ third-party animation library စသဖြင့်ပါ။ **External system တစ်ခုခုနဲ့ ချိတ်ဆက်နေတာ မဟုတ်ဘူးဆိုရင် — Effect တစ်ခု မလိုအပ်နိုင်ပါဘူး။**

#### ဥပမာ — Chat Server တစ်ခုဆီ ချိတ်ဆက်ခြင်း

အောက်က ဥပမာမှာ — `ChatRoom` component က `chat.js` ထဲမှာ သတ်မှတ်ထားတဲ့ external system ဆီ ချိတ်ဆက်ထားဖို့ Effect တစ်ခုကို သုံးပါတယ်။ `roomId` ဒါမှမဟုတ် `serverUrl` ပြောင်းတဲ့အခါ — Effect က chat ဆီ ပြန်ချိတ်ဆက်တာကို မြင်ရပါလိမ့်မယ်:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

#### ဥပမာ — Global Browser Event တစ်ခုကို နားထောင်ခြင်း

ဒီဥပမာမှာ external system က browser DOM ကိုယ်တိုင်ပါ။ JSX နဲ့ဆို global `window` object ကို event listener ချိတ်လို့ မရတာမို့ — Effect က `window` object နဲ့ ချိတ်ဆက်ပြီး သူ့ရဲ့ events တွေကို နားထောင်ပေးပါတယ်:

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

### Effects တွေကို Custom Hooks တွေထဲမှာ ထုပ်ခြင်း

Effects တွေက ["escape hatch"](/docs/react/escape-hatches) တစ်ခုပါ — React ရဲ့ အပြင်ကို ထွက်ဖို့၊ ပိုကောင်းတဲ့ built-in ဖြေရှင်းနည်း မရှိတဲ့အခါ သုံးတာပါ။ Effects တွေကို ကိုယ်တိုင် ထပ်ခါထပ်ခါ ရေးနေရတာက — component တွေ အားကိုးတဲ့ common behaviors တွေအတွက် [custom Hooks](/docs/react/reusing-logic-with-custom-hooks) တချို့ ခွဲထုတ်ဖို့ လိုနေပြီဆိုတဲ့ လက္ခဏာပါ။ ဥပမာ — ဒီ `useChatRoom` custom Hook က Effect ရဲ့ logic ကို ပိုပြီး declarative ဖြစ်တဲ့ API တစ်ခုရဲ့ နောက်ကွယ်မှာ "ဝှက်" ထားပါတယ်:

```js
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

ပြီးရင် ဘယ် component ကမဆို ဒီလို သုံးနိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

### React မဟုတ်တဲ့ Widget တစ်ခုကို ထိန်းချုပ်ခြင်း

တခါတရံ external system တစ်ခုကို သင့် component ရဲ့ prop ဒါမှမဟုတ် state တစ်ခုခုနဲ့ ထပ်တူဖြစ်နေအောင် ထားချင်ပါတယ်။ ဥပမာ — React နဲ့ မရေးထားတဲ့ third-party map widget တစ်ခု ဒါမှမဟုတ် video player component တစ်ခုရှိရင် — သူ့ရဲ့ state က သင့် React component ရဲ့ လက်ရှိ state နဲ့ ကိုက်ညီအောင် သူ့ဆီက methods တွေကို ခေါ်ဖို့ Effect ကို သုံးနိုင်ပါတယ်။ ဒီ Effect က `map-widget.js` ထဲမှာ သတ်မှတ်ထားတဲ့ `MapWidget` class ရဲ့ instance တစ်ခုကို ဖန်တီးပြီး — `Map` component ရဲ့ `zoomLevel` prop ပြောင်းတိုင်း — class instance ရဲ့ `setZoom()` method ကို ခေါ်ပြီး ထပ်တူဖြစ်နေအောင် လုပ်ပါတယ်:

```js
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

ဒီဥပမာမှာ cleanup function မလိုပါဘူး — ဘာလို့လဲဆိုတော့ `MapWidget` class က သူ့ဆီ ပေးထားတဲ့ DOM node ကိုပဲ စီမံလို့ပါ။ `Map` component ကို tree ကနေ ဖယ်လိုက်ရင် — DOM node ရော `MapWidget` instance ပါ browser JavaScript engine ရဲ့ garbage collector က အလိုအလျောက် ရှင်းပေးပါတယ်။

### Effects တွေနဲ့ Data Fetching

Effect တစ်ခုနဲ့ သင့် component အတွက် data fetch လုပ်နိုင်ပါတယ်။ [Framework](/docs/react/creating-a-react-app) တစ်ခု သုံးရင်တော့ — framework ရဲ့ data fetching mechanism က Effects တွေကို ကိုယ်တိုင်ရေးတာထက် အများကြီး ပိုထိရောက်ပါတယ်။ Effect ကနေ data fetch လုပ်ချင်ရင် — code က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

`false` နဲ့ စပြီး cleanup အတွင်းမှာ `true` လို့ set လုပ်တဲ့ `ignore` variable ကို သတိပြုပါ။ ဒါက သင့် code ကို "race conditions" တွေကနေ ကာကွယ်ပေးပါတယ် — network responses တွေက သင်ပို့လိုက်တဲ့ အစီအစဉ်နဲ့ မတူဘဲ ရောက်လာနိုင်လို့ပါ။ `async`/`await` syntax နဲ့လည်း ပြန်ရေးလို့ရပေမယ့် — cleanup function ကတော့ လိုအပ်နေဦးမှာပါ။ Effect တွေထဲမှာ data fetching ကို တိုက်ရိုက် ရေးတာက ထပ်ခါထပ်ခါ ဖြစ်ပြီး — caching နဲ့ server rendering လို optimizations တွေ နောက်မှ ထည့်ဖို့ ခက်ခဲစေပါတယ်။

> **နက်နက်နဲနဲ — Effect တွေထဲမှာ data fetching ရဲ့ အားနည်းချက်တွေ:**
>
> - **Effects တွေက server ပေါ်မှာ run မလုပ်ပါဘူး** — ဒါကြောင့် ကနဦး server-rendered HTML မှာ data မပါတဲ့ loading state ပဲ ပါမှာပါ။
> - **Effect တွေထဲမှာ တိုက်ရိုက် fetching လုပ်တာက "network waterfalls" တွေ ဖန်တီးလွယ်ပါတယ်** — parent က fetch လုပ်၊ ပြီးမှ child တွေက သူတို့ရဲ့ data စ fetch လုပ်တာမျိုးပေါ့။
> - **Preload ဒါမှမဟုတ် cache မလုပ်ပေးပါဘူး** — component unmount ပြီး ပြန် mount ဖြစ်ရင် data ကို ပြန် fetch ရပါမယ်။
>
> အကြံပြုချက်က — **framework တစ်ခု သုံးရင် သူ့ရဲ့ built-in data fetching mechanism ကို သုံးပါ။** မဟုတ်ရင် — client-side cache တစ်ခုကို သုံးဖို့ စဉ်းစားပါ — လူကြိုက်များတဲ့ open source ဖြေရှင်းနည်းတွေထဲမှာ [TanStack Query](https://tanstack.com/query/latest/)၊ [useSWR](https://swr.vercel.app/) တွေ ပါဝင်ပါတယ်။

### Reactive Dependencies တွေကို သတ်မှတ်ခြင်း

**သင့် Effect ရဲ့ dependencies တွေကို သင်က "ရွေးချယ်" လို့ မရပါဘူး။** Effect code က သုံးတဲ့ reactive value တိုင်းကို dependency အဖြစ် ကြေညာရပါတယ် — dependency list က ပတ်ဝန်းကျင် code ပေါ်မှာ မူတည်ပါတယ်:

```js
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

**Reactive values တွေထဲမှာ props တွေနဲ့ component ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables/functions တွေအားလုံး ပါဝင်ပါတယ်။** သူတို့ကို dependencies ကနေ ဖယ်လို့ မရပါဘူး — ဖယ်ကြည့်ရင် React အတွက် ပြင်ဆင်ထားတဲ့ linter က `React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'` လိုမျိုး error ပြပါလိမ့်မယ်။ Dependency တစ်ခုကို ဖယ်ချင်ရင် — အဲဒါ ဘာကြောင့် dependency *မလို*ကြောင်း linter ကို "သက်သေပြ" ရပါတယ်။ ဥပမာ — `serverUrl` ကို component ရဲ့ အပြင်ကို ရွှေ့လိုက်ရင် — သူက reactive မဟုတ်တော့ဘဲ re-render တွေမှာ မပြောင်းတော့လို့ dependency မလိုတော့ပါဘူး:

```js
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

**သင့် Effect ရဲ့ code က reactive value ဘာမှ မသုံးဘူးဆိုရင် — dependency list က ဗလာ (`[]`) ဖြစ်သင့်ပါတယ်။** ဗလာ dependency array ပါတဲ့ Effect က component ရဲ့ props ဒါမှမဟုတ် state ဘာပြောင်းပြောင်း ပြန် run မလုပ်ပါဘူး။ Linter ကို ချိုးနှိမ်ပြီး (`eslint-ignore-next-line` လိုမျိုး) dependencies ကို code နဲ့ မကိုက်ညီအောင် ထားတာက bug တွေ ဖြစ်စေနိုင်လို့ — ရှောင်ရပါမယ်။

- **Dependency array ပေးထားရင်** — Effect က ကနဦး commit ပြီးနောက် *ရော* dependencies ပြောင်းတဲ့ commits တွေပြီးနောက်မှာပါ run ပါတယ်။
- **ဗလာ `[]` ပေးထားရင်** — Effect က ကနဦး commit ပြီးနောက်မှာပဲ run ပါတယ် (development မှာ တစ်ကြိမ် အပို run လုပ်တာ မှလွဲရင်)။
- **Dependency array လုံးဝ မပေးရင်** — Effect က component ရဲ့ commit *တိုင်း* ပြီးနောက် run ပါတယ်။

### Effect တစ်ခုကနေ ယခင် State ကို အခြေခံပြီး State Update လုပ်ခြင်း

Effect တစ်ခုကနေ ယခင်တန်ဖိုး state ပေါ် အခြေခံပြီး update လုပ်ချင်ရင် ပြဿနာ တစ်ခု ကြုံရနိုင်ပါတယ် — `count` ကို dependency အဖြစ် ထည့်ထားရတာမို့ — `count` ပြောင်းတိုင်း interval က cleanup/setup ပြန်ဖြစ်နေလို့ပါ။ ဖြေရှင်းဖို့ — `count + 1` အစား `c => c + 1` state updater ကို `setCount` ဆီ ပေးပါ:

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

ဒါဆိုရင် Effect က `count` ပေါ် မှီခိုနေတာ မလိုတော့ဘဲ — `count` ပြောင်းတိုင်း interval ကို cleanup/setup ပြန်လုပ်စရာ မလိုတော့ပါဘူး။

### မလိုအပ်တဲ့ Object Dependencies တွေကို ဖယ်ရှားခြင်း

သင့် Effect က render အတွင်းမှာ ဖန်တီးလိုက်တဲ့ object တစ်ခုပေါ် မှီခိုနေရင် — မကြာခဏ run လွန်းနိုင်ပါတယ်။ ဥပမာ — ဒီ Effect က `options` object က render တိုင်း မတူတာမို့ — commit တိုင်းမှာ ပြန်ချိတ်ဆက်နေပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a commit
  // ...
```

Render အတွင်းမှာ ဖန်တီးတဲ့ object တစ်ခုကို dependency အဖြစ် မသုံးပါနဲ့။ အဲဒီအစား — object ကို Effect ရဲ့ အတွင်းမှာ ဖန်တီးပါ:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

အခု `options` object ကို Effect ရဲ့ အတွင်းမှာ ဖန်တီးတာမို့ — Effect ကိုယ်တိုင်က `roomId` string ပေါ်မှာပဲ မှီခိုပါတယ်။ Object တွေနဲ့ မတူဘဲ — string ကို ပြန်သတ်မှတ်မှသာ ပြောင်းတာမို့ — input ထဲ စာရိုက်တာက chat ကို ပြန်ချိတ်ဆက်စေမှာ မဟုတ်ပါဘူး။

### မလိုအပ်တဲ့ Function Dependencies တွေကို ဖယ်ရှားခြင်း

Function တစ်ခုကိုလည်း ဒီအတိုင်းပါပဲ — render တိုင်း function အသစ် ဖန်တီးတာက သူ့ဘာသာသူ ပြဿနာ မဟုတ်ပေမယ့် — Effect ရဲ့ dependency အဖြစ် သုံးရင်တော့ commit တိုင်းမှာ Effect ကို ပြန် run စေပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a commit
  // ...
```

Render အတွင်းမှာ ဖန်တီးတဲ့ function တစ်ခုကို dependency အဖြစ် မသုံးပါနဲ့ — function ကို Effect ရဲ့ အတွင်းမှာ ကြေညာပါ။ ဒါဆိုရင် Effect က `roomId` string ပေါ်မှာပဲ မှီခိုတော့တာမို့ — input ထဲ စာရိုက်တာက chat ကို ပြန်ချိတ်ဆက်စေမှာ မဟုတ်ပါဘူး။

### Effect တစ်ခုကနေ Props နဲ့ State အသစ်ဆုံးတွေကို ဖတ်ခြင်း

ပုံမှန်အားဖြင့် — Effect ကနေ reactive value တစ်ခုကို ဖတ်ရင် အဲဒါကို dependency အဖြစ် ထည့်ရပါတယ်။ ဒါပေမယ့် တခါတရံ — တန်ဖိုးတွေကို "react" မလုပ်ဘဲ Effect ကနေ *အသစ်ဆုံး* props/state တွေကို ဖတ်ချင်တာမျိုး ရှိပါတယ်။ ဥပမာ — page visit တိုင်း shopping cart ထဲက items အရေအတွက်ကို log ချင်တယ်ဆိုပါစို့ — `url` ပြောင်းတိုင်းပဲ log လုပ်ချင်ပြီး `shoppingCart` တစ်ခုတည်း ပြောင်းရင်တော့ log မလုပ်ချင်ဘူးဆိုရင် — react မလုပ်စေချင်တဲ့ code ကို [`useEffectEvent`](/docs/react/use-effect-event) Hook နဲ့ *Effect Event* တစ်ခုအနေနဲ့ ကြေညာပြီး — `shoppingCart` ကို ဖတ်တဲ့ code ကို အဲဒီထဲ ရွှေ့ပါ:

```js
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**Effect Events တွေက reactive မဟုတ်ဘဲ — သင့် Effect ရဲ့ dependencies ထဲကနေ အမြဲ ချန်လှပ်ထားရပါတယ်။** `shoppingCart` ကို `onVisit` အတွင်းမှာ ဖတ်လိုက်တာမို့ — `shoppingCart` က သင့် Effect ကို ပြန် run စေမှာ မဟုတ်တော့ပါဘူး။

### Server နဲ့ Client မှာ မတူတဲ့ Content တွေ ပြသခြင်း

သင့် app က server rendering သုံးရင် — component က server မှာ ကနဦး HTML ထုတ်ဖို့ render ပြီး — client မှာ event handlers တွေ တွဲဖို့ ထပ်ပြီး render လုပ်ပါတယ်။ ရှားရှားပါးပါး အခြေအနေတွေမှာ client မှာ မတူတဲ့ content ပြချင်နိုင်ပါတယ် — ဥပမာ app က `localStorage` ကနေ data ဖတ်ရင် server မှာ မဖတ်နိုင်ပါဘူး။ ဒီလိုမျိုး ဖြေရှင်းနိုင်ပါတယ်:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

App load ဖြစ်နေစဉ်မှာ အသုံးပြုသူက ကနဦး render output ကို မြင်ရပြီး — hydrated ဖြစ်တာနဲ့ Effect က run ပြီး `didMount` ကို `true` လို့ set လုပ်လို့ re-render ဖြစ်ကာ — client-only content ကို ပြောင်းပြပါတယ်။ Effects တွေက server ပေါ်မှာ မပြေးတာမို့ — ကနဦး server render မှာ `didMount` က `false` ဖြစ်နေတာပါ။ ဒီ pattern ကို ချဲ့ထွင်သုံးဖို့ မသင့်ပါဘူး — slow connection ရှိတဲ့ အသုံးပြုသူတွေက ကနဦး content ကို စက္ကန့်ပေါင်းများစွာ မြင်နေရနိုင်လို့ပါ။ ဖြစ်နိုင်ရင် CSS နဲ့ပဲ conditional ပြတာမျိုး ရှောင်နိုင်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Component mount ဖြစ်တဲ့အခါ Effect က နှစ်ကြိမ် ပြေးနေတယ်

Strict Mode ဖွင့်ထားရင် — development မှာ React က setup+cleanup ကို setup အစစ် မလုပ်ခင် တစ်ကြိမ် အပို run ပါတယ်။ ဒါက သင့် Effect logic မှန်မမှန် စစ်ဆေးတဲ့ stress-test တစ်ခုပါ။ မြင်သာတဲ့ ပြဿနာတွေ ရှိရင် — cleanup function မှာ logic ပျောက်နေတာပါ။ Cleanup က setup လုပ်နေတာကို ရပ်/ပြန်ဖျက်ရပါမယ် — အသုံးပြုသူအနေနဲ့ setup တစ်ခါခေါ်တာ (production) နဲ့ setup → cleanup → setup (development) ကို ခွဲခြားလို့ မရအောင် ရေးပါ။

### Effect က re-render တိုင်း ပြန်ပြေးနေတယ်

အရင်ဆုံး dependency array ထည့်ဖို့ မေ့နေလားဆိုတာ စစ်ပါ:

```js
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every commit!
```

Dependency array ထည့်ပြီးသားဖြစ်ပေမယ့် Effect က loop ထဲမှာ ပြန်ပြေးနေသေးရင် — dependency တစ်ခုခုက re-render တိုင်း မတူညီလို့ပါ။ Dependencies တွေကို console မှာ log လုပ်ပြီး စစ်ဆေးကြည့်ပါ — re-render နှစ်ခုကနေ ရတဲ့ arrays တွေကို "Store as a global variable" နဲ့ သိမ်းပြီး `Object.is` နဲ့ နှိုင်းယှဉ်ပါ:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

Re-render တိုင်း မတူတဲ့ dependency ကို တွေ့တဲ့အခါ — [အထက်က state updater နည်း](#updating-state-based-on-previous-state-from-an-effect)၊ [object](#removing-unnecessary-object-dependencies) ဒါမှမဟုတ် [function dependencies](#removing-unnecessary-function-dependencies) ဖယ်ရှားနည်းတွေနဲ့ ဖြေရှင်းနိုင်ပါတယ်။ မရသေးရင် — `useMemo` ဒါမှမဟုတ် `useCallback` (functions တွေအတွက်) နဲ့ ဖန်တီးမှုကို ထုပ်ကြည့်ပါ။

### Effect က infinite cycle ထဲမှာ ပြန်ပြေးနေတယ်

ဒီလိုဆို အချက်နှစ်ချက် မှန်နေတာပါ — (၁) Effect က state တစ်ခုခုကို update လုပ်နေပြီး (၂) အဲဒီ state က re-render ဖြစ်စေပြီး — re-render က Effect ရဲ့ dependencies တွေကို ပြောင်းစေပါတယ်။ ကိုယ့်ကိုယ်ကို မေးကြည့်ပါ — Effect က external system (DOM, network, third-party widget စသည်) တစ်ခုခုနဲ့ တကယ် ချိတ်ဆက်နေလား? External system မရှိဘူးဆိုရင် — Effect ကိုယ်တိုင် ဖယ်လိုက်ရင် logic ရိုးသွားနိုင်လား စဉ်းစားပါ။ Rendering မှာ မသုံးတဲ့ data ကို ခြေရာခံဖို့ဆိုရင် — re-render မဖြစ်စေတဲ့ [ref](/docs/react/use-ref) တစ်ခုက ပိုသင့်လျော်နိုင်ပါတယ်။

### Component unmount မဖြစ်ဘဲ Cleanup Logic က ပြေးနေတယ်

Cleanup function က unmount အတွင်းမှာပဲ မဟုတ်ဘဲ — dependencies ပြောင်းတဲ့ re-render တိုင်းရဲ့ ရှေ့မှာလည်း ပြေးပါတယ်။ ဒါ့အပြင် development မှာ — React က component mount ပြီးချင်း setup+cleanup ကို တစ်ကြိမ် အပိုပြေးပါတယ်။ သက်ဆိုင်တဲ့ setup code မရှိဘဲ cleanup code တစ်ခုတည်း ရှိနေရင် ဒါက code smell တစ်ခုပါ — cleanup logic က setup logic နဲ့ "အချိုးကျ" ဖြစ်ပြီး setup လုပ်နေတာကို ရပ်/ပြန်ဖျက်ပေးရပါမယ်။

### Effect က visual တစ်ခုခု လုပ်ပြီး run မလုပ်ခင် flicker တစ်ခု မြင်နေရတယ်

သင့် Effect က browser ကို [screen paint](/docs/react/render-and-commit) မလုပ်အောင် တားဆီးဖို့ လိုအပ်ရင် — `useEffect` အစား `useLayoutEffect` ကို သုံးပါ။ ဒါက Effects အများစုအတွက် မလိုပါဘူး — tooltip တစ်ခုကို အသုံးပြုသူ မမြင်ခင် တိုင်းတာ/နေရာချဖို့လိုမျိုး browser paint မလုပ်ခင် Effect run ဖို့ အရေးကြီးတဲ့အခါမှပဲ လိုပါတယ်။
