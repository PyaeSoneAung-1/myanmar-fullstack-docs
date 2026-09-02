---
title: "Activity (children တွေရဲ့ UI နဲ့ state ကို ဖျောက်ထား/ပြန်ပြ လုပ်ရန် component)"
description: "Activity component — mode prop ဖြင့် children ကို ဖျောက်ခြင်း/ပြန်ပြခြင်း၊ state နဲ့ DOM ကို ထိန်းသိမ်းခြင်း၊ ကြိုတင် pre-render လုပ်ခြင်း၊ Selective Hydration နဲ့ performance မြှင့်တင်ခြင်း၊ troubleshooting"
order: 116
source: "https://react.dev/reference/react/Activity"
status: translated
updated: 2026-09-02
---

**`Activity`** က သူ့ရဲ့ children တွေရဲ့ UI နဲ့ အတွင်းပိုင်း state ကို ဖျောက်ထားနိုင်၊ ပြန်ပြနိုင်ပါတယ်။

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

## Reference

### `Activity` component

Activity ကို သုံးပြီး သင့် application ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ဖျောက်ထားနိုင်ပါတယ်:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Activity boundary တစ်ခုက hidden (ဖျောက်ထား) ဖြစ်နေတဲ့အခါ — React က သူ့ရဲ့ children တွေကို `display: "none"` CSS property သုံးပြီး အမြင်အားဖြင့် ဖျောက်ထားပေးပါတယ်။ ပြီးတော့ သူတို့ရဲ့ Effects တွေကိုလည်း ဖျက်ပစ်ပြီး — active ဖြစ်နေတဲ့ subscription တွေကို ရှင်းလင်းပေးပါတယ်။

Hidden ဖြစ်နေစဉ်မှာတောင် — children တွေက prop အသစ်တွေကို လက်ခံရရှိတဲ့အခါ re-render ဖြစ်နေဆဲပါ — ကျန် content တွေထက် priority နိမ့်နိမ့်နဲ့ ဖြစ်ပေမယ့်ပေါ့။

Boundary က visible (မြင်နိုင်) ဖြစ်ပြန်တဲ့အခါ — React က children တွေကို သူတို့ရဲ့ အရင် state တွေနဲ့အတူ ပြန်ပြပေးပြီး Effects တွေကိုလည်း ပြန်ဖန်တီးပေးပါတယ်။

ဒီနည်းနဲ့ — Activity ကို "နောက်ကွယ်က လှုပ်ရှားမှု (background activity)" တွေကို render လုပ်ဖို့ ယန္တရားတစ်ခုအဖြစ် မှတ်ယူနိုင်ပါတယ်။ နောက်တစ်ခါ မြင်ရဖွယ်ရှိတဲ့ content ကို လုံးဝ ဖျက်ပစ်လိုက်မယ့်အစား — အဲဒီ content ရဲ့ UI နဲ့ အတွင်းပိုင်း state ကို ထိန်းသိမ်း၊ ပြန်လည်ရယူနိုင်အောင် Activity ကို သုံးနိုင်ပြီး — ဖျောက်ထားတဲ့ content မှာ မလိုလားအပ်တဲ့ side effects တွေ မရှိကြောင်းလည်း သေချာစေပါတယ်။

အောက်မှာ ဥပမာတွေ ထပ်ကြည့်ပါ။

#### Props

- `children` — သင် ပြ/ဖျောက်ချင်တဲ့ UI။
- `mode` — `'visible'` ဒါမှမဟုတ် `'hidden'` ဆိုတဲ့ string တန်ဖိုး။ ချန်လှပ်ထားရင် default အနေနဲ့ `'visible'` ဖြစ်ပါတယ်။

#### Caveats

- Activity တစ်ခုကို [ViewTransition](/docs/react/view-transition) အတွင်းမှာ render လုပ်ပြီး — [startTransition](/docs/react/start-transition) ကြောင့် ဖြစ်တဲ့ update ရဲ့ ရလဒ်အဖြစ် visible ဖြစ်လာရင် — ViewTransition ရဲ့ `enter` animation ကို activate လုပ်ပါတယ်။ Hidden ဖြစ်သွားရင်တော့ — သူ့ရဲ့ `exit` animation ကို activate လုပ်ပါတယ်။
- စာသား (text) ပဲ ပြန်ပေးတဲ့ *hidden* Activity က — visibility ပြောင်းလဲမှု သက်ရောက်ဖို့ သက်ဆိုင်တဲ့ DOM element မရှိလို့ — hidden text ကို render လုပ်မယ့်အစား ဘာမှ render လုပ်မှာ မဟုတ်ပါဘူး။ ဥပမာ — `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` ဆိုရင် `const ComponentThatJustReturnsText = () => "Hello, World!"` အတွက် DOM ထဲမှာ output ဘာမှ ထွက်မှာ မဟုတ်ပါဘူး။ `<Activity mode="visible"><ComponentThatJustReturnsText /></Activity>` ကတော့ မြင်ရတဲ့ text ကို render လုပ်ပါလိမ့်မယ်။

## Usage

### ဖျောက်ထားတဲ့ component တွေရဲ့ state ကို ပြန်ရယူခြင်း (Restoring the state of hidden components)

React မှာ — component တစ်ခုကို သင်္ကေတအရ (conditionally) ပြ/ဖျောက်ချင်တဲ့အခါ — ပုံမှန်အားဖြင့် အဲဒီ condition အပေါ် မူတည်ပြီး component ကို mount/unmount လုပ်ပါတယ်:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

ဒါပေမယ့် — component တစ်ခုကို unmount လုပ်လိုက်ရင် သူ့ရဲ့ အတွင်းပိုင်း state တွေ ပျက်စီးသွားပါတယ် — ဒါက သင်အမြဲ လိုချင်တဲ့အရာ မဟုတ်ပါဘူး။

Activity boundary ကို သုံးပြီး component တစ်ခုကို ဖျောက်လိုက်ရင်တော့ — React က သူ့ရဲ့ state ကို နောက်မှ သုံးဖို့ "သိမ်းဆည်း" ထားပေးပါတယ်:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

ဒါက component တွေကို ဖျောက်ထားပြီး — နောက်ပိုင်းမှာ သူတို့ အရင်ရှိခဲ့တဲ့ state အတိုင်း ပြန်ရယူဖို့ ဖြစ်နိုင်စေပါတယ်။

အောက်က ဥပမာမှာ — ချဲ့လို့ရတဲ့ section တစ်ခုပါတဲ့ sidebar တစ်ခု ရှိပါတယ်။ "Overview" ကို နှိပ်ရင် အောက်က subitems သုံးခု ပေါ်လာပါတယ်။ Main app ဧရိယာမှာလည်း sidebar ကို ဖျောက်/ပြ လုပ်ပေးတဲ့ button တစ်ခု ရှိပါတယ်။

Overview section ကို ချဲ့ကြည့်ပြီး — sidebar ကို ပိတ်၊ ပြန်ဖွင့်ကြည့်ပါ:

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

Overview section က အမြဲတမ်း ခေါက်ထားတဲ့ (collapsed) အနေအထားကနေ စပါတယ်။ `isShowingSidebar` က `false` ဖြစ်တဲ့အခါ sidebar ကို unmount လုပ်လိုက်လို့ — သူ့ရဲ့ အတွင်းပိုင်း state အားလုံး ပျောက်ဆုံးသွားပါတယ်။

ဒါက Activity အတွက် အကောင်းဆုံး use case တစ်ခုပါ။ ကျွန်ုပ်တို့ရဲ့ sidebar ကို အမြင်အားဖြင့် ဖျောက်ထားရင်တောင် — သူ့ရဲ့ အတွင်းပိုင်း state ကို ထိန်းသိမ်းထားနိုင်ပါတယ်။

Sidebar ရဲ့ conditional rendering ကို Activity boundary နဲ့ အစားထိုးကြည့်ရအောင်:

```jsx
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

ပြီးတော့ အပြုအမူ အသစ်ကို ကြည့်ကြည့်ရအောင်:

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

အခုဆိုရင် — ကျွန်ုပ်တို့ရဲ့ sidebar ရဲ့ အတွင်းပိုင်း state ကို — သူ့ရဲ့ implementation ကို ဘာမှ မပြောင်းဘဲ ပြန်ရယူနိုင်ပါပြီ။

### ဖျောက်ထားတဲ့ component တွေရဲ့ DOM ကို ထိန်းသိမ်းခြင်း (Restoring the DOM of hidden components)

Activity boundaries တွေက သူတို့ရဲ့ children တွေကို `display: none` သုံးပြီး ဖျောက်ထားလို့ — children တွေရဲ့ DOM ကိုလည်း ဖျောက်ထားစဉ်မှာ ထိန်းသိမ်းထားပေးပါတယ်။ ဒါကြောင့် — user က နောက်တစ်ခါ ထပ်ပြီး သုံးဖွယ်ရှိတဲ့ UI အစိတ်အပိုင်းတွေရဲ့ ခဏတာ (ephemeral) state တွေကို ထိန်းသိမ်းဖို့ သင့်တော်ပါတယ်။

ဒီဥပမာမှာ — Contact tab မှာ user က message ရိုက်ထည့်လို့ရတဲ့ `<textarea>` တစ်ခု ပါပါတယ်။ စာတစ်ချို့ ရိုက်ထည့်ပြီး Home tab ကို ပြောင်း၊ ပြီးတော့ Contact tab ကို ပြန်ပြောင်းကြည့်ရင် — အရင်ရေးထားတဲ့ (draft) message ပျောက်သွားပါတယ်:

```js src/App.js
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

ဒါက — `App` ထဲမှာ `Contact` ကို လုံးဝ unmount လုပ်နေလို့ပါ။ Contact tab unmount ဖြစ်တဲ့အခါ — `<textarea>` element ရဲ့ အတွင်းပိုင်း DOM state ပါ ပျောက်သွားပါတယ်။

Active tab ကို ပြ/ဖျောက်ဖို့ Activity boundary ကို သုံးလိုက်ရင် — tab တစ်ခုချင်းစီရဲ့ DOM state ကို ထိန်းသိမ်းထားနိုင်ပါတယ်။ စာရိုက်ထည့်ပြီး tabs တွေ ပြန်ပြောင်းကြည့်ပါ — draft message က ပြန်မပျောက်တော့တာ တွေ့ရပါလိမ့်မယ်:

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

ဒီတစ်ခါလည်း — Activity boundary က Contact tab ရဲ့ အတွင်းပိုင်း state ကို — သူ့ရဲ့ implementation ကို မပြောင်းဘဲ ထိန်းသိမ်းပေးနိုင်ခဲ့ပါတယ်။

### မကြာခင် မြင်ရဖွယ်ရှိတဲ့ content တွေကို ကြိုတင် render လုပ်ခြင်း (Pre-rendering content that's likely to become visible)

ဒီအထိ — Activity က user နဲ့ ထိတွေ့ပြီးသား content တစ်ချို့ကို — အဲဒီ content ရဲ့ ခဏတာ state ကို မဖျက်ဘဲ ဘယ်လို ဖျောက်ထားနိုင်လဲ မြင်ခဲ့ပါတယ်။

ဒါပေမယ့် — Activity boundaries တွေကို user မမြင်ရသေးတဲ့ content ကို ပထမဆုံးအကြိမ် ပြသဖို့ _ကြိုတင်ပြင်ဆင် (prepare)_ လုပ်ရာမှာလည်း သုံးနိုင်ပါတယ်:

```jsx
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Activity boundary တစ်ခုက သူ့ရဲ့ ကနဦး render မှာ hidden ဖြစ်နေရင် — သူ့ရဲ့ children တွေက စာမျက်နှာပေါ်မှာ မပေါ်ပေမယ့် — မြင်ရတဲ့ content တွေထက် priority နိမ့်ပြီး — Effects တွေကို mount မလုပ်ဘဲ _render ဖြစ်နေဦးမှာ_ ပါ။

ဒီ _pre-rendering_ က children တွေ လိုအပ်တဲ့ code ဒါမှမဟုတ် data တွေကို ကြိုတင် load လုပ်နိုင်စေပြီး — နောက်ပိုင်း Activity boundary visible ဖြစ်တဲ့အခါ — children တွေက load ချိန် လျော့နည်းပြီး မြန်မြန် ပေါ်လာနိုင်စေပါတယ်။

ဥပမာတစ်ခု ကြည့်ရအောင်။

ဒီ demo မှာ — Posts tab က data တစ်ချို့ load လုပ်ပါတယ်။ ဒီ tab ကို နှိပ်လိုက်ရင် — data fetch လုပ်နေတုန်း Suspense fallback တစ်ခု ပြသထားတာ တွေ့ရပါမယ်:

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

ဒါက — `App` က Posts tab active မဖြစ်ခင် `Posts` ကို mount မလုပ်ထားလို့ပါ။

`App` ကို update လုပ်ပြီး active tab ကို ပြ/ဖျောက်ဖို့ Activity boundary သုံးလိုက်ရင် — `Posts` က app ပထမဆုံး load တဲ့အခါ pre-render ဖြစ်ပြီး — သူ့ရဲ့ data ကို မမြင်ရသေးခင် fetch လုပ်ထားနိုင်ပါတယ်။

အခု Posts tab ကို နှိပ်ကြည့်ပါ:

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

`Posts` က hidden Activity boundary ရဲ့ အကူအညီနဲ့ — ပိုမြန်တဲ့ render အတွက် ကြိုတင် ပြင်ဆင်နိုင်ခဲ့ပါတယ်။

Hidden Activity boundaries တွေနဲ့ components တွေကို ကြိုတင် render လုပ်တာက — user က နောက်တစ်ဆင့်မှာ သုံးဖွယ်ရှိတဲ့ UI အစိတ်အပိုင်းတွေရဲ့ loading time ကို လျှော့ချဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းတစ်ခုပါ။

> **မှတ်ချက်** — [Suspense boundary ကို activate လုပ်စေတဲ့](https://react.dev/reference/react/Suspense) source တစ်ခုကနေ ဖတ်တဲ့ data ပဲ — ဥပမာ [`use`](/docs/react/use) နဲ့ ဖတ်တဲ့ Promise — pre-rendering အတွင်းမှာ fetch လုပ်ခံရမှာ ဖြစ်ပါတယ်။ Activity က Effect တစ်ခုအတွင်းမှာ fetch လုပ်တဲ့ data ကို detect လုပ်ပေးမှာ မဟုတ်ပါဘူး။

### Page load အတွင်း interactions တွေကို မြန်ဆန်စေခြင်း (Speeding up interactions during page load)

React မှာ Selective Hydration လို့ခေါ်တဲ့ — မျက်နှာပြင်နောက်ကွယ်က performance optimization တစ်ခု ပါဝင်ပါတယ်။ ဒါက သင့် app ရဲ့ ကနဦး HTML ကို _အပိုင်းပိုင်း (chunks)_ လိုက် hydrate လုပ်ပြီး — စာမျက်နှာပေါ်က တခြား components တွေရဲ့ code ဒါမှမဟုတ် data တွေ load မပြီးသေးရင်တောင် — components တစ်ချို့ကို interactive ဖြစ်စေနိုင်ပါတယ်။

Suspense boundaries တွေက Selective Hydration မှာ ပါဝင်ပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့က သင့် component tree ကို — တစ်ခုနဲ့တစ်ခု မှီခိုမှုမရှိတဲ့ unit တွေအဖြစ် သဘာဝအလျောက် ပိုင်းခြားပေးလို့ပါ:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

ဒီမှာ — `MessageComposer` က — `Chats` mount ဖြစ်ပြီး data fetch စတင်တာတောင် မစောင့်ဘဲ — စာမျက်နှာရဲ့ ကနဦး render အတွင်းမှာ အပြည့်အဝ hydrate လုပ်ခံရနိုင်ပါတယ်။

ဒါကြောင့် — သင့် component tree ကို သီးခြား unit တွေအဖြစ် ခွဲပေးခြင်းအားဖြင့် — Suspense က React ကို သင့် app ရဲ့ server-rendered HTML ကို အပိုင်းပိုင်း hydrate လုပ်နိုင်စေပြီး — သင့် app ရဲ့ အစိတ်အပိုင်းတွေ တတ်နိုင်သမျှ မြန်မြန် interactive ဖြစ်လာစေပါတယ်။

ဒါပေမယ့် — Suspense မသုံးတဲ့ စာမျက်နှာတွေကျတော့ရော?

ဒီ tabs ဥပမာကို ကြည့်ပါ:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

ဒီမှာ — React က စာမျက်နှာ တစ်ခုလုံးကို တစ်ပြိုင်နက် hydrate လုပ်ရပါတယ်။ `Home` ဒါမှမဟုတ် `Video` က render ဖို့ နှေးနေရင် — hydration အတွင်း tab buttons တွေကို response မရှိသလို ခံစားရစေနိုင်ပါတယ်။

Active tab ပတ်လည်မှာ Suspense ထည့်ပေးတာက ဒီပြဿနာကို ဖြေရှင်းပေးနိုင်ပါတယ်:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...ဒါပေမယ့် — `Placeholder` fallback က ကနဦး render မှာ ပြသခံရမှာမို့ — UI ကိုပါ ပြောင်းလဲပစ်မှာ ဖြစ်ပါတယ်။

ဒီနေရာမှာ — Activity ကို သုံးနိုင်ပါတယ်။ Activity boundaries တွေက သူတို့ရဲ့ children တွေကို ပြ/ဖျောက် လုပ်တာမို့ — component tree ကို သီးခြားလွတ်လပ်တဲ့ unit တွေအဖြစ် သဘာဝအလျောက် ပိုင်းခြားပေးပြီးသား ဖြစ်ပါတယ်။ Suspense လိုပဲ — ဒီ feature က သူတို့ကို Selective Hydration မှာ ပါဝင်နိုင်စေပါတယ်။

ကျွန်ုပ်တို့ရဲ့ ဥပမာကို update လုပ်ပြီး — active tab ပတ်လည်မှာ Activity boundaries တွေ သုံးကြည့်ရအောင်:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

အခုဆိုရင် — ကျွန်ုပ်တို့ရဲ့ ကနဦး server-rendered HTML က မူရင်း version နဲ့ အတူတူပဲ ကြည့်ရပါတယ်။ ဒါပေမယ့် — Activity ရဲ့ အကူအညီနဲ့ — React က `Home` ဒါမှမဟုတ် `Video` ကို mount မလုပ်ခင် — tab buttons တွေကို အရင်ဆုံး hydrate လုပ်နိုင်ပါတယ်။

ဒါကြောင့် — content တွေကို ဖျောက်/ပြ လုပ်တာအပြင် — Activity boundaries တွေက — စာမျက်နှာရဲ့ ဘယ်အစိတ်အပိုင်းတွေကို သီးခြားစီ interactive ဖြစ်လာစေနိုင်လဲ React ကို အသိပေးခြင်းအားဖြင့် — hydration အတွင်း သင့် app ရဲ့ performance ကို မြှင့်တင်ပေးပါတယ်။

ပြီးတော့ — သင့်စာမျက်နှာက content တစ်ချို့ကို ဘယ်တော့မှ မဖျောက်ဘူးဆိုရင်တောင် — hydration performance မြှင့်တင်ဖို့ အမြဲ visible ဖြစ်နေတဲ့ Activity boundaries တွေကို ထည့်ထားလို့ရပါတယ်:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

## Troubleshooting

### ဖျောက်ထားတဲ့ component တွေမှာ မလိုလားအပ်တဲ့ side effects တွေ ရှိနေတာ

Activity boundary တစ်ခုက သူ့ရဲ့ content ကို — children တွေပေါ်မှာ `display: none` သတ်မှတ်ပြီး သူတို့ရဲ့ Effects တွေကို ရှင်းလင်းပေးခြင်းအားဖြင့် ဖျောက်ထားပါတယ်။ ဒါကြောင့် — သူတို့ရဲ့ side effects တွေကို ကောင်းကောင်း ရှင်းလင်းတတ်တဲ့ React components အများစုက Activity နဲ့ ဖျောက်ခံရတာကို ခံနိုင်ရည် ရှိပြီးသားပါ။

ဒါပေမယ့် — hidden component တစ်ခုက unmount လုပ်ထားတဲ့ component နဲ့ ကွဲပြားစွာ ပြုမူတဲ့ အခြေအနေတစ်ချို့ ရှိပါတယ်။ အထူးသဖြင့် — hidden component ရဲ့ DOM က မပျက်စီးဘူးဆိုတော့ — အဲဒီ DOM ကနေ ဖြစ်ပေါ်လာတဲ့ side effects တွေက component ဖျောက်ခံရပြီးနောက်မှာတောင် ဆက်ရှိနေပါတယ်။

ဥပမာအနေနဲ့ — `<video>` tag တစ်ခုကို စဉ်းစားကြည့်ပါ။ ပုံမှန်အားဖြင့် သူ့မှာ cleanup မလိုပါဘူး — ဘာလို့လဲဆိုတော့ video ဖွင့်နေရင်တောင် — tag ကို unmount လုပ်လိုက်ရင် browser ထဲမှာ video နဲ့ audio တွေ ရပ်သွားလို့ပါ။ ဒီ demo မှာ video ဖွင့်ပြီး Home ကို နှိပ်ကြည့်ပါ:

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

Video က မျှော်လင့်ထားသလို ရပ်သွားပါတယ်။

အခု — user နောက်ဆုံး ကြည့်ခဲ့တဲ့ အချိန်ကုဒ် (timecode) ကို ထိန်းသိမ်းထားချင်တယ် ဆိုပါစို့ — tab ကို ပြန်ပြောင်းတဲ့အခါ video က အစကနေ ပြန်စမနေဖို့ပေါ့။

ဒါက Activity အတွက် အကောင်းဆုံး use case တစ်ခုပါ!

`App` ကို update လုပ်ပြီး — inactive tab ကို unmount လုပ်မယ့်အစား — hidden Activity boundary နဲ့ ဖျောက်ထားကြည့်ရအောင် — demo က ဒီတစ်ခါ ဘယ်လို ပြုမူလဲ ကြည့်ပါ:

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

အို! Video နဲ့ audio တွေက — tab ရဲ့ `<video>` element က DOM ထဲမှာ ရှိနေသေးလို့ — ဖျောက်ခံရပြီးနောက်မှာတောင် ဆက်ဖွင့်နေပါတယ်။

ဒါကို ဖြေရှင်းဖို့ — video ကို ခဏရပ်ပေးတဲ့ cleanup function ပါတဲ့ Effect တစ်ခု ထည့်နိုင်ပါတယ်:

```jsx
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

`useEffect` အစား `useLayoutEffect` ကို ခေါ်တာက — အယူအဆအရ cleanup code က component ရဲ့ UI အမြင်အားဖြင့် ဖျောက်ခံရတာနဲ့ ဆက်စပ်နေလို့ပါ။ သာမန် effect တစ်ခု သုံးရင် — code က (ဥပမာ) re-suspending ဖြစ်နေတဲ့ Suspense boundary ဒါမှမဟုတ် View Transition တစ်ခုကြောင့် နှောင့်နှေးသွားနိုင်ပါတယ်။

အပြုအမူ အသစ်ကို ကြည့်ရအောင်။ Video ဖွင့်ပြီး Home tab ကို ပြောင်း၊ ပြီးတော့ Video tab ကို ပြန်ပြောင်းကြည့်ပါ:

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

ကောင်းကောင်း အလုပ်လုပ်ပါတယ်! ကျွန်ုပ်တို့ရဲ့ cleanup function က — video ကို Activity boundary တစ်ခုနဲ့ ဖျောက်ခံရရင် ရပ်သွားအောင် သေချာစေပြီး — ပိုကောင်းတာက — `<video>` tag က ဘယ်တော့မှ မပျက်စီးတာမို့ — timecode ကို ထိန်းသိမ်းထားနိုင်ကာ — user က ဆက်ကြည့်ဖို့ ပြန်ပြောင်းတဲ့အခါ — video ကိုယ်တိုင် ပြန် initialize လုပ်စရာ၊ ပြန်ဒေါင်းလုဒ်လုပ်စရာ မလိုတော့ပါဘူး။

ဒါက — ဖျောက်ခံရပေမယ့် user က မကြာခင် ထပ်ပြီး သုံးဖွယ်ရှိတဲ့ UI အစိတ်အပိုင်းတွေရဲ့ ခဏတာ DOM state ကို ထိန်းသိမ်းဖို့ Activity သုံးခြင်းရဲ့ အကောင်းဆုံး ဥပမာတစ်ခုပါ။

ဒီဥပမာက — `<video>` လို tag တစ်ချို့အတွက် — unmount လုပ်ခြင်းနဲ့ ဖျောက်ထားခြင်းက အပြုအမူ မတူဘူးဆိုတာ ပြသပါတယ်။ Component တစ်ခုက side effect ရှိတဲ့ DOM ကို render လုပ်ပြီး — Activity boundary က ဖျောက်တဲ့အခါ အဲဒီ side effect မဖြစ်အောင် တားဆီးချင်ရင် — cleanup လုပ်ဖို့ return function ပါတဲ့ Effect တစ်ခု ထည့်ပါ။

ဒီလို ဖြစ်လေ့ရှိတဲ့ ဖြစ်ရပ်တွေက အောက်က tags တွေကနေ အဓိက လာပါတယ်:

- `<video>`
- `<audio>`
- `<iframe>`

ဒါပေမယ့် — ယေဘုယျအားဖြင့် — သင့်ရဲ့ React components အများစုက Activity boundary နဲ့ ဖျောက်ခံရတာကို ခံနိုင်ရည် ရှိပြီးသား ဖြစ်သင့်ပါတယ်။ အယူအဆအရတော့ — "hidden" Activities တွေကို unmount လုပ်ပြီးသား အနေအထားလို့ မှတ်ယူသင့်ပါတယ်။

Cleanup မှန်ကန်စွာ မလုပ်ထားတဲ့ တခြား Effects တွေကို ကြိုတင် ရှာဖွေဖို့ — Activity boundaries တွေအတွက်သာမက React ရဲ့ အခြား အပြုအမူတွေအတွက်ပါ အရေးကြီးတာမို့ — [`<StrictMode>`](/docs/react/strict-mode) ကို သုံးဖို့ အကြံပြုပါတယ်။

### ဖျောက်ထားတဲ့ component တွေရဲ့ Effects တွေ run မဖြစ်တာ

`<Activity>` တစ်ခု "hidden" ဖြစ်နေတဲ့အခါ — သူ့ရဲ့ children အားလုံးရဲ့ Effects တွေကို ရှင်းလင်းပါတယ်။ အယူအဆအရ — children တွေက unmount ဖြစ်ပေမယ့် — React က သူတို့ရဲ့ state တွေကို နောက်မှ သုံးဖို့ သိမ်းထားပါတယ်။ ဒါက Activity ရဲ့ feature တစ်ခုပါ — ဘာလို့လဲဆိုတော့ — UI ရဲ့ ဖျောက်ထားတဲ့ အစိတ်အပိုင်းတွေအတွက် subscriptions တွေ active မဖြစ်တော့ဘဲ — hidden content အတွက် လိုအပ်တဲ့ အလုပ်ပမာဏကို လျှော့ချပေးလို့ပါ။

Component တစ်ခုရဲ့ side effects တွေကို ရှင်းလင်းဖို့ Effect mount ဖြစ်တာကို အားကိုးနေရင် — Effect ကို ပြန်ဖွဲ့စည်းပြီး — အဲဒီအလုပ်ကို ပြန်ပေးလိုက်တဲ့ (returned) cleanup function ထဲမှာ လုပ်အောင် ပြင်ပါ။

ပြဿနာရှိနိုင်တဲ့ Effects တွေကို ကြိုတင် ရှာဖွေဖို့ — Activity unmount/mount တွေကို ကြိုတင် လုပ်ဆောင်ပြီး မမျှော်လင့်ထားတဲ့ side effects တွေကို ဖမ်းမိစေတဲ့ [`<StrictMode>`](/docs/react/strict-mode) ကို ထည့်ဖို့ အကြံပြုပါတယ်။
