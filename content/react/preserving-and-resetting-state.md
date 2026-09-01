---
title: "State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း"
description: "React က UI tree ထဲက component ရဲ့ နေရာပေါ်မူတည်ပြီး state ကို ဘယ်အချိန် ထိန်းသိမ်း/ပြန်လည်သတ်မှတ်လဲ — key နဲ့ component type တွေက state ထိန်းသိမ်းမှုကို ဘယ်လို သက်ရောက်လဲ"
order: 10
source: "https://react.dev/learn/preserving-and-resetting-state"
status: translated
updated: 2026-09-01
---

State က component တွေကြားမှာ သီးခြားစီ ဖြစ်ပါတယ်။ ဘယ် state က ဘယ် component နဲ့ သက်ဆိုင်လဲဆိုတာကို React က — UI tree ထဲမှာ သူတို့ရဲ့ နေရာပေါ်မူတည်ပြီး ခြေရာခံပါတယ်။ Re-render တွေကြားမှာ state ကို ဘယ်အချိန် ထိန်းသိမ်းမလဲ၊ ဘယ်အချိန် ပြန်လည်သတ်မှတ်မလဲဆိုတာကို သင်ထိန်းချုပ်နိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React က state ကို ဘယ်အချိန် ထိန်းသိမ်း ဒါမှမဟုတ် ပြန်လည်သတ်မှတ်လဲ
- Component ရဲ့ state ကို ပြန်လည်သတ်မှတ်အောင် React ကို ဘယ်လို အတင်းလုပ်မလဲ
- Key နဲ့ type တွေက state ထိန်းသိမ်းမှုကို ဘယ်လို သက်ရောက်လဲ

## State က Render Tree ထဲက နေရာတစ်ခုနဲ့ ချိတ်ဆက်ထားတယ်

React က သင့် UI ထဲက component structure အတွက် [render tree](/docs/react/understanding-your-ui-as-a-tree#the-render-tree) တွေကို တည်ဆောက်ပါတယ်။

Component တစ်ခုကို state ပေးလိုက်တဲ့အခါ — state က component ရဲ့ *အတွင်းမှာ* "နေထိုင်" တယ်လို့ သင်ထင်ကောင်း ထင်နိုင်ပါတယ်။ ဒါပေမယ့် တကယ်တော့ state ကို React က ကိုင်ထားပါတယ်။ React က သူကိုင်ထားတဲ့ state အပိုင်းတစ်ခုချင်းစီကို — အဲဒီ component က render tree ထဲ ထိုင်နေတဲ့ နေရာနဲ့ ဆက်စပ်ပေးပါတယ်။

ဒီမှာ `<Counter />` JSX tag တစ်ခုတည်း ရှိပေမယ့် — နေရာ နှစ်နေရာမှာ render လုပ်ထားပါတယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```
> _Diagram:_ React component tree — root node က `div` ဖြစ်ပြီး child နှစ်ခု ရှိပါတယ်။ Child တစ်ခုချင်းစီက `Counter` ဖြစ်ပြီး တစ်ခုချင်းစီမှာ တန်ဖိုး 0 ရှိတဲ့ `count` state bubble ပါပါတယ်။

**ဒါတွေက counter နှစ်ခု သီးခြားစီပါ — ဘာလို့လဲဆိုတော့ တစ်ခုချင်းစီက tree ထဲမှာ သူ့နေရာနဲ့သူ render လုပ်ထားလို့ပါ။** React သုံးဖို့ ဒီနေရာတွေအကြောင်း စဉ်းစားနေစရာ မလိုပါဘူး — ဒါပေမယ့် ဘယ်လို အလုပ်လုပ်လဲဆိုတာ နားလည်ထားတာ အသုံးဝင်ပါတယ်။

React မှာ — screen ပေါ်က component တစ်ခုချင်းစီမှာ လုံးဝ သီးခြားစီ ဖြစ်တဲ့ state ရှိပါတယ်။ ဥပမာ — `Counter` component နှစ်ခုကို ဘေးချင်းကပ် render လုပ်ရင် — တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင်၊ အမှီအခိုကင်းတဲ့ `score` နဲ့ `hover` states တွေ ရပါလိမ့်မယ်။

Counter နှစ်ခုလုံးကို နှိပ်ကြည့်ပြီး — တစ်ခုနဲ့တစ်ခု မထိခိုက်ဘူးဆိုတာ သတိပြုပါ:

```jsx
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```
မြင်ရတဲ့အတိုင်းပဲ — counter တစ်ခု update လုပ်တဲ့အခါ — အဲဒီ component ရဲ့ state ကိုပဲ update လုပ်ပါတယ်:

> _Diagram:_ State update — ဘယ်ဘက် `Counter` မှာ `count` 0 ရှိပြီး ညာဘက် `Counter` မှာ `count` 1 ဖြစ်နေတာကို အဝါရောင်နဲ့ မီးမောင်းထိုးပြထားပါတယ်။

Component တစ်ခုတည်းကို tree ထဲမှာ နေရာတစ်ခုတည်းမှာ render လုပ်နေသရွေ့ — React က state ကို ဆက်ထိန်းထားပါလိမ့်မယ်။ ဒါကိုကြည့်ဖို့ — counter နှစ်ခုလုံးကို increment လုပ်ပြီး — "Render the second counter" checkbox ကို ဖြုတ်ပြီး ဒုတိယ component ကို ဖယ်ရှားပြီး — နောက်တစ်ကြိမ် အမှတ်ခြစ်ပြီး ပြန်ထည့်ကြည့်ပါ:

```jsx
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```
ဒုတိယ counter ကို render လုပ်တာ ရပ်လိုက်တာနဲ့ — သူ့ရဲ့ state က လုံးဝ ပျောက်သွားတာကို သတိပြုပါ။ ဒါက React က component တစ်ခုကို ဖယ်ရှားလိုက်တဲ့အခါ — သူ့ရဲ့ state ကိုပါ ဖျက်ဆီးလိုက်လို့ပါ။

> _Diagram:_ Component တစ်ခုကို ဖျက်ခြင်း — ညာဘက် child က tree ထဲကနေ ဖျက်ခံရတာကို အဝါရောင် 'poof' ပုံနဲ့ ပြထားပါတယ်။

"Render the second counter" ကို အမှတ်ခြစ်လိုက်တဲ့အခါ — ဒုတိယ `Counter` နဲ့ သူ့ရဲ့ state ကို အစကနေ (`score = 0`) ပြန်စတင်သတ်မှတ်ပြီး DOM ထဲ ထည့်ပါတယ်။

> _Diagram:_ Component တစ်ခုကို ထည့်ခြင်း — ညာဘက် child တစ်ခုလုံးကို အဝါရောင်နဲ့ မီးမောင်းထိုးပြထားပြီး tree ထဲကို အခုမှ ထည့်လိုက်တာကို ပြပါတယ်။

**Component တစ်ခုကို UI tree ထဲမှာ သူ့ရဲ့နေရာမှာ render လုပ်နေသရွေ့ — React က သူ့ရဲ့ state ကို ထိန်းသိမ်းထားပါတယ်။** ဖယ်ရှားခံရရင် ဒါမှမဟုတ် အဲဒီနေရာမှာ တခြား component တစ်ခု render ခံရရင် — React က သူ့ရဲ့ state ကို စွန့်ပစ်ပါတယ်။

## နေရာတစ်ခုတည်းမှာ Component တစ်ခုတည်း ဆိုရင် State ကို ထိန်းသိမ်းတယ်

ဒီဥပမာမှာ — `<Counter />` tag နှစ်ခု မတူညီတာ ရှိပါတယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```
Checkbox ကို အမှတ်ခြစ်သည်ဖြစ်စေ၊ ဖြုတ်သည်ဖြစ်စေ — counter state က reset မဖြစ်ပါဘူး။ `isFancy` က `true` ဖြစ်ဖြစ် `false` ဖြစ်ဖြစ် — root `App` component က ပြန်ပေးတဲ့ `div` ရဲ့ ပထမဆုံး child အဖြစ် `<Counter />` တစ်ခု အမြဲတမ်း ရှိပါတယ်:

> _Diagram:_ `App` state ကို update လုပ်တာက `Counter` ကို reset မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ `Counter` က နေရာတစ်ခုတည်းမှာ ဆက်ရှိနေလို့ပါ။

နေရာတစ်ခုတည်းမှာ component တစ်ခုတည်း ဆိုတော့ — React ရဲ့ အမြင်အရတော့ counter တစ်ခုတည်း ဖြစ်ပါတယ်။

> **သတိပြုရန်:** React အတွက် အရေးကြီးတာက **UI tree ထဲက နေရာ — JSX markup ထဲက နေရာ မဟုတ်ဘူး** ဆိုတာ သတိရပါ! ဒီ component မှာ `if` ရဲ့ အတွင်းနဲ့ အပြင်မှာ `<Counter />` JSX tag တွေ မတူညီတာနဲ့ `return` clause နှစ်ခု ရှိပါတယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```
Checkbox အမှတ်ခြစ်လိုက်ရင် state reset ဖြစ်မယ်လို့ သင်ထင်နိုင်ပေမယ့် — မဖြစ်ပါဘူး! ဒါက **ဒီ `<Counter />` tag နှစ်ခုလုံးက နေရာတစ်ခုတည်းမှာ render လုပ်ခံရလို့ပါ။** သင့် function ထဲမှာ condition တွေ ဘယ်မှာ ထားလဲဆိုတာကို React က မသိပါဘူး။ သူ "မြင်ရတာ" အားလုံးက သင်ပြန်ပေးတဲ့ tree ပဲ ဖြစ်ပါတယ်။

ကိစ္စနှစ်မျိုးလုံးမှာ — `App` component က `<Counter />` ကို ပထမဆုံး child အဖြစ် ပါတဲ့ `<div>` တစ်ခုကို ပြန်ပေးပါတယ်။ React အတွက်တော့ — counter နှစ်ခုလုံးက "လိပ်စာ" တစ်ခုတည်း ရှိပါတယ်: root ရဲ့ ပထမဆုံး child ရဲ့ ပထမဆုံး child ပါ။ ဒါကြောင့် — သင့် logic ကို ဘယ်လိုပဲ ဖွဲ့စည်းဖွဲ့စည်း — ယခင် render နဲ့ နောက် render တွေကြားမှာ React က သူတို့ကို ဒီနည်းနဲ့ ကိုက်ညီပေးတာပါ။

## နေရာတစ်ခုတည်းမှာ Component မတူညီရင် State ကို ပြန်လည်သတ်မှတ်တယ်

ဒီဥပမာမှာ — checkbox အမှတ်ခြစ်လိုက်တာနဲ့ `<Counter>` ကို `<p>` နဲ့ အစားထိုးပါလိမ့်မယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```
ဒီမှာ — နေရာတစ်ခုတည်းမှာ *မတူညီတဲ့* component type တွေကြား ပြောင်းလဲနေပါတယ်။ အစပိုင်းမှာ `<div>` ရဲ့ ပထမဆုံး child က `Counter` တစ်ခု ဖြစ်ခဲ့ပါတယ်။ ဒါပေမယ့် `p` နဲ့ ပြောင်းလိုက်တဲ့အခါ — React က `Counter` ကို UI tree ကနေ ဖယ်ရှားပြီး သူ့ရဲ့ state ကို ဖျက်ဆီးပစ်လိုက်ပါတယ်။

> _Diagram:_ `Counter` က `p` အဖြစ် ပြောင်းတဲ့အခါ — `Counter` ကို ဖျက်ပြီး `p` ကို ထည့်ပါတယ်။ ပြန်ပြောင်းတဲ့အခါ — `p` ကို ဖျက်ပြီး `Counter` ကို ထည့်ပါတယ်။

ဒါ့အပြင် — **နေရာတစ်ခုတည်းမှာ component မတူညီတာ render လုပ်ရင် — သူ့ရဲ့ subtree တစ်ခုလုံးရဲ့ state ကို ပြန်လည်သတ်မှတ်ပါတယ်။** ဒါ ဘယ်လို အလုပ်လုပ်လဲကြည့်ဖို့ — counter ကို increment လုပ်ပြီး checkbox ကို အမှတ်ခြစ်ကြည့်ပါ:

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```
Checkbox ကို နှိပ်လိုက်တာနဲ့ — counter state က reset ဖြစ်ပါတယ်။ သင်က `Counter` တစ်ခုကို render လုပ်ပေမယ့် — `div` ရဲ့ ပထမဆုံး child က `section` ကနေ `div` အဖြစ် ပြောင်းသွားပါတယ်။ Child `section` ကို DOM ကနေ ဖယ်ရှားလိုက်တဲ့အခါ — သူ့အောက်က tree တစ်ခုလုံး (`Counter` နဲ့ သူ့ရဲ့ state အပါအဝင်) ပါ ဖျက်ဆီးခံလိုက်ရပါတယ်။

> _Diagram:_ `section` က `div` အဖြစ် ပြောင်းတဲ့အခါ — `section` ကို ဖျက်ပြီး `div` အသစ်ကို ထည့်ပါတယ်။ ပြန်ပြောင်းတဲ့အခါ — `div` ကို ဖျက်ပြီး `section` အသစ်ကို ထည့်ပါတယ်။

စည်းမျဉ်းအရဆိုရင် — **re-render တွေကြားမှာ state ကို ထိန်းသိမ်းချင်ရင် — သင့် tree ရဲ့ structure က render တစ်ခုကနေ နောက်တစ်ခုဆီ "ကိုက်ညီ" နေဖို့ လိုပါတယ်။** Structure မတူညီရင် — state က ဖျက်ဆီးခံရပါတယ် — ဘာလို့လဲဆိုတော့ React က component တစ်ခုကို tree ကနေ ဖယ်ရှားတဲ့အခါ state ကို ဖျက်ဆီးလို့ပါ။

> **သတိပြုရန်:** ဒါကြောင့် — component function definition တွေကို တစ်ခုထဲမှာ တစ်ခု nested မလုပ်သင့်ပါဘူး။
>
> ဒီမှာ — `MyTextField` component function ကို `MyComponent` ရဲ့ *အတွင်းမှာ* သတ်မှတ်ထားပါတယ်:
>
> ```jsx
> import { useState } from 'react';
> 
> export default function MyComponent() {
>   const [counter, setCounter] = useState(0);
> 
>   function MyTextField() {
>     const [text, setText] = useState('');
> 
>     return (
>       <input
>         value={text}
>         onChange={e => setText(e.target.value)}
>       />
>     );
>   }
> 
>   return (
>     <>
>       <MyTextField />
>       <button onClick={() => {
>         setCounter(counter + 1)
>       }}>Clicked {counter} times</button>
>     </>
>   );
> }
> ```
>
> Button ကို နှိပ်တိုင်း — input state က ပျောက်သွားပါတယ်! ဒါက `MyComponent` ရဲ့ render တစ်ခုချင်းစီမှာ — `MyTextField` function *အသစ်တစ်ခု* ဖန်တီးခံရလို့ပါ။ နေရာတစ်ခုတည်းမှာ component *မတူညီတာ* တစ်ခုကို render လုပ်နေတာမို့ — React က အောက်က state အားလုံးကို ပြန်လည်သတ်မှတ်ပါတယ်။ ဒါက bug တွေရော performance ပြဿနာတွေပါ ဖြစ်စေပါတယ်။ ဒီပြဿနာကို ရှောင်ဖို့ — **component function တွေကို အမြဲတမ်း top level မှာ ကြေညာပြီး သူတို့ရဲ့ definition တွေကို nested မလုပ်ပါနဲ့။**

## နေရာတစ်ခုတည်းမှာ State ကို ပြန်လည်သတ်မှတ်ခြင်း

Default အနေနဲ့ — component တစ်ခုက နေရာတစ်ခုတည်းမှာ ဆက်ရှိနေသရွေ့ React က သူ့ရဲ့ state ကို ထိန်းသိမ်းပါတယ်။ များသောအားဖြင့် ဒါက သင်လိုချင်တာအတိအကျပါပဲ — ဒါကြောင့် default behavior အနေနဲ့ သဘာဝကျပါတယ်။ ဒါပေမယ့် တခါတရံ — component တစ်ခုရဲ့ state ကို ပြန်လည်သတ်မှတ်ချင်တာမျိုး ရှိနိုင်ပါတယ်။ Player နှစ်ယောက်က သူတို့ရဲ့ score တွေကို turn တစ်ခုချင်းစီမှာ ခြေရာခံထားနိုင်တဲ့ ဒီ app ကို ကြည့်ပါ:

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```
လက်ရှိမှာ — player ကို ပြောင်းလိုက်ရင် score က ထိန်းသိမ်းခံရပါတယ်။ `Counter` နှစ်ခုက နေရာတစ်ခုတည်းမှာ ပေါ်နေတာမို့ — React က သူတို့ကို `person` prop ပြောင်းသွားတဲ့ *`Counter` တစ်ခုတည်း* အဖြစ် မြင်ပါတယ်။

ဒါပေမယ့် — အယူအဆအရတော့ ဒီ app ထဲမှာ သူတို့က counter နှစ်ခု သီးခြားစီ ဖြစ်သင့်ပါတယ်။ UI ထဲမှာ နေရာတစ်ခုတည်းမှာ ပေါ်နေပေမယ့် — တစ်ခုက Taylor အတွက် counter ဖြစ်ပြီး — နောက်တစ်ခုက Sarah အတွက် counter ဖြစ်ပါတယ်။

သူတို့ကြား ပြောင်းတဲ့အခါ state ကို ပြန်လည်သတ်မှတ်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

1. Component တွေကို နေရာ မတူညီတာမှာ render လုပ်ခြင်း
2. `key` နဲ့ component တစ်ခုချင်းစီကို သီးခြားမှတ်ပုံတင် (explicit identity) ပေးခြင်း

### ရွေးချယ်စရာ ၁ — Component ကို နေရာ မတူညီတာမှာ Render လုပ်ခြင်း

`Counter` နှစ်ခုကို အမှီအခိုကင်းစေချင်ရင် — နေရာ မတူညီတာ နှစ်နေရာမှာ render လုပ်နိုင်ပါတယ်:

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```
- အစပိုင်းမှာ `isPlayerA` က `true` ဖြစ်ပါတယ်။ ဒါကြောင့် — ပထမနေရာမှာ `Counter` state ရှိပြီး ဒုတိယနေရာက အလွတ်ပါ။
- "Next player" button ကို နှိပ်လိုက်တဲ့အခါ — ပထမနေရာ ရှင်းသွားပြီး ဒုတိယနေရာမှာ `Counter` တစ်ခု ရှိလာပါတယ်။

> _Diagram:_ ကနဦး state — `Scoreboard` မှာ `isPlayerA` တန်ဖိုး `true` ရှိပြီး ဘယ်ဘက်မှာ `Counter` တစ်ခုပဲ ရှိပါတယ်။ "next" နှိပ်လိုက်တဲ့အခါ — ဘယ်ဘက် child ဖျက်ခံရပြီး ညာဘက်မှာ `Counter` အသစ် ပေါ်လာပါတယ်။ "next" ကို နောက်တစ်ကြိမ် နှိပ်တဲ့အခါ — ပြောင်းပြန် ဖြစ်သွားပါတယ်။

`Counter` တစ်ခုချင်းစီရဲ့ state က DOM ကနေ ဖယ်ရှားခံရတိုင်း ဖျက်ဆီးခံရပါတယ်။ ဒါကြောင့် button နှိပ်တိုင်း သူတို့ reset ဖြစ်တာပါ။

ဒီဖြေရှင်းနည်းက — နေရာတစ်ခုတည်းမှာ render လုပ်ထားတဲ့ အမှီအခိုကင်း component အနည်းငယ်ပဲ ရှိတဲ့အခါ အဆင်ပြေပါတယ်။ ဒီဥပမာမှာ — နှစ်ခုပဲ ရှိတာမို့ JSX ထဲမှာ နှစ်ခုလုံးကို သီးခြား render လုပ်တာ မခက်ပါဘူး။

### ရွေးချယ်စရာ ၂ — Key တစ်ခုနဲ့ State ကို ပြန်လည်သတ်မှတ်ခြင်း

Component တစ်ခုရဲ့ state ကို ပြန်လည်သတ်မှတ်ဖို့ — နောက်ထပ် ပိုအသုံးများတဲ့ နည်းလမ်းတစ်ခုလည်း ရှိပါတယ်။

[List တွေ render လုပ်တဲ့အခါ](/docs/react/rendering-lists#keeping-list-items-in-order-with-key) `key` တွေကို မြင်ဖူးနိုင်ပါတယ်။ Key တွေက list တွေအတွက်ပဲ မဟုတ်ပါဘူး! Component တစ်ခုခုကို React က ခွဲခြားသိစေဖို့ key တွေကို သုံးနိုင်ပါတယ်။ Default အနေနဲ့ — React က component တွေကို ခွဲခြားဖို့ parent အတွင်းက order ("ပထမ counter"၊ "ဒုတိယ counter") ကို သုံးပါတယ်။ ဒါပေမယ့် key တွေက — ဒါက *ပထမ* counter ဒါမှမဟုတ် *ဒုတိယ* counter ပဲ မဟုတ်ဘဲ — တိကျတဲ့ counter တစ်ခု (ဥပမာ — *Taylor ရဲ့* counter) ဆိုတာကို React ကို ပြောပြနိုင်စေပါတယ်။ ဒီနည်းနဲ့ — Taylor ရဲ့ counter က tree ထဲမှာ ဘယ်နေရာမှာ ပေါ်ပေါ် React က သိပါလိမ့်မယ်!

ဒီဥပမာမှာ — `<Counter />` နှစ်ခုက JSX ထဲမှာ နေရာတစ်ခုတည်းမှာ ပေါ်နေပေမယ့် state တွေ မမျှဝေပါဘူး:

```jsx
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```
```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```
Taylor နဲ့ Sarah ကြား ပြောင်းလဲတာက state ကို မထိန်းသိမ်းပါဘူး။ ဒါက **သူတို့ကို `key` မတူညီတာတွေ ပေးထားလို့ပါ:**

```jsx
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```
`key` တစ်ခု သတ်မှတ်ပေးတာက — parent အတွင်းက order အစား — `key` ကိုယ်တိုင်ကို နေရာရဲ့ အစိတ်အပိုင်းတစ်ခုအဖြစ် သုံးဖို့ React ကို ပြောတာပါ။ ဒါကြောင့် — JSX ထဲမှာ နေရာတစ်ခုတည်းမှာ render လုပ်ပေမယ့် — React က သူတို့ကို counter နှစ်ခု မတူညီတာအဖြစ် မြင်ပြီး — ဘယ်တော့မှ state မမျှဝေပါဘူး။ Counter တစ်ခု screen ပေါ် ပေါ်လာတိုင်း — သူ့ရဲ့ state ကို ဖန်တီးပါတယ်။ ဖယ်ရှားခံရတိုင်း — သူ့ရဲ့ state ကို ဖျက်ဆီးပါတယ်။ သူတို့ကြား toggle လုပ်တိုင်း — state တွေ ထပ်ခါထပ်ခါ reset ဖြစ်ပါတယ်။

> **မှတ်ချက်:** Key တွေက globally unique မဟုတ်ဘူးဆိုတာ သတိရပါ။ သူတို့က *parent အတွင်းမှာ* ရှိတဲ့ နေရာကိုပဲ သတ်မှတ်ပေးတာပါ။

### Key တစ်ခုနဲ့ Form ကို ပြန်လည်သတ်မှတ်ခြင်း

Key တစ်ခုနဲ့ state ကို ပြန်လည်သတ်မှတ်တာက — form တွေနဲ့ ဆက်ဆံတဲ့အခါ အထူးသဖြင့် အသုံးဝင်ပါတယ်။

ဒီ chat app မှာ — `<Chat>` component က text input state ကို ကိုင်ထားပါတယ်:

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```
```jsx
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```
```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
input ထဲ တစ်ခုခု ရိုက်ပြီး — မတူတဲ့ လက်ခံသူ (recipient) ရွေးဖို့ "Alice" ဒါမှမဟုတ် "Bob" ကို နှိပ်ကြည့်ပါ။ `<Chat>` က tree ထဲမှာ နေရာတစ်ခုတည်းမှာ render လုပ်ထားလို့ — input state က ထိန်းသိမ်းခံရတာကို သတိပြုမိပါလိမ့်မယ်။

**App အများစုမှာ ဒါက လိုချင်တဲ့ အပြုအမူ ဖြစ်နိုင်ပေမယ့် — chat app တစ်ခုမှာတော့ မဟုတ်ပါဘူး!** User တစ်ယောက် ရိုက်ပြီးသား message ကို — မတော်တဆ နှိပ်မိတာကြောင့် လူမှားဆီ ပို့မိစေချင်မှာ မဟုတ်ပါဘူး။ ဖြေရှင်းဖို့ — `key` တစ်ခု ထည့်ပါ:

```jsx
<Chat key={to.id} contact={to} />
```
ဒါက လက်ခံသူ မတူညီတာတစ်ယောက် ရွေးလိုက်တဲ့အခါ — `Chat` component ကို သူ့အောက်က tree ထဲက state တွေ အပါအဝင် — အစကနေ ပြန်ဖန်တီးစေပါတယ်။ React က DOM element တွေကိုလည်း ပြန်သုံးမယ့်အစား ပြန်လည် ဖန်တီးပါလိမ့်မယ်။

အခုဆိုရင် လက်ခံသူ ပြောင်းတိုင်း — text field က အမြဲတမ်း ရှင်းသွားပါတယ်:

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```
```jsx
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```
```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```
#### ဖယ်ရှားလိုက်တဲ့ Component တွေရဲ့ State ကို ထိန်းသိမ်းခြင်း

တကယ့် chat app တစ်ခုမှာဆိုရင် — user က ယခင် လက်ခံသူကို ပြန်ရွေးလိုက်တဲ့အခါ — input state ကို ပြန်ရယူချင်ဖို့ များပါတယ်။ မြင်ရတော့မရှိတော့တဲ့ component တစ်ခုအတွက် state ကို "အသက်ရှင်နေအောင်" ထားဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ်:

- Chat *အားလုံး* ကို လက်ရှိတစ်ခုတည်း အစား render လုပ်ပြီး — တစ်ခြားဟာတွေကို CSS နဲ့ ဖျောက်ထားနိုင်ပါတယ်။ Chat တွေက tree ကနေ ဖယ်ရှားခံရမှာ မဟုတ်လို့ — သူတို့ရဲ့ local state တွေ ထိန်းသိမ်းခံရပါမယ်။ ဒီဖြေရှင်းနည်းက ရိုးရှင်းတဲ့ UI တွေအတွက် ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် ဖျောက်ထားတဲ့ tree တွေ ကြီးပြီး DOM node တွေ အများကြီး ပါနေရင် — အရမ်း နှေးသွားနိုင်ပါတယ်။
- [State ကို lift up လုပ်ပြီး](/docs/react/sharing-state-between-components) လက်ခံသူတစ်ဦးချင်းစီအတွက် မပို့ရသေးတဲ့ message (pending message) ကို parent component ထဲမှာ ကိုင်ထားနိုင်ပါတယ်။ ဒီနည်းနဲ့ — child component တွေ ဖယ်ရှားခံရတာက ပြဿနာ မဟုတ်တော့ပါဘူး — ဘာလို့လဲဆိုတော့ အရေးကြီးတဲ့ အချက်အလက်တွေကို parent က ထားထားလို့ပါ။ ဒါက အသုံးအများဆုံး ဖြေရှင်းနည်းပါ။
- React state အပြင် တခြား အရင်းအမြစ်တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာ — user က စာမျက်နှာကို မတော်တဆ ပိတ်လိုက်ရင်တောင် message draft က ဆက်ရှိနေစေချင်ဖို့ များပါတယ်။ ဒါကို implement လုပ်ဖို့ — `Chat` component က [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) ကနေ ဖတ်ပြီး သူ့ရဲ့ state ကို စတင်သတ်မှတ်နိုင်ပြီး — drafts တွေကိုလည်း အဲဒီမှာ သိမ်းနိုင်ပါတယ်။

ဘယ် strategy ပဲ ရွေးရွေး — *Alice* နဲ့ စကားပြောတာက *Bob* နဲ့ စကားပြောတာနဲ့ အယူအဆအရ ကွဲပြားပါတယ် — ဒါကြောင့် လက်ရှိ လက်ခံသူပေါ်မူတည်ပြီး `<Chat>` tree ကို `key` တစ်ခု ပေးထားတာ သဘာဝကျပါတယ်။

## အကျဉ်းချုပ်

- Component တစ်ခုတည်းကို နေရာတစ်ခုတည်းမှာ render လုပ်နေသရွေ့ — React က state ကို ထိန်းသိမ်းထားပါတယ်။
- State က JSX tags တွေထဲမှာ သိမ်းမထားပါဘူး။ အဲဒီ JSX ကို သင်ထည့်ထားတဲ့ tree ထဲက နေရာနဲ့ ဆက်စပ်နေပါတယ်။
- Subtree တစ်ခုကို key မတူညီတာ ပေးခြင်းဖြင့် သူ့ရဲ့ state ကို ပြန်လည်သတ်မှတ်အောင် အတင်း လုပ်နိုင်ပါတယ်။
- Component definition တွေကို nested မလုပ်ပါနဲ့ — မဟုတ်ရင် မတော်တဆ state တွေ reset ဖြစ်ပါလိမ့်မယ်။

## စိန်ခေါ်မှုများ (Challenges)

### ပျောက်ကွယ်နေတဲ့ Input Text ကို ပြုပြင်ခြင်း

ဒီဥပမာက — button နှိပ်လိုက်တဲ့အခါ message တစ်ခုကို ပြပါတယ်။ ဒါပေမယ့် — button နှိပ်လိုက်တာက input ကိုပါ မတော်တဆ reset လုပ်လိုက်ပါတယ်။ ဘာကြောင့် ဒီလိုဖြစ်တာလဲ? Button နှိပ်တာက input text ကို reset မလုပ်အောင် ပြုပြင်ပါ။

```jsx
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```
```css
textarea { display: block; margin: 10px 0; }
```
#### အဖြေ

ပြဿနာက — `Form` ကို နေရာ မတူညီတာတွေမှာ render လုပ်နေလို့ပါ။ `if` branch မှာ — သူက `<div>` ရဲ့ ဒုတိယမြောက် child ဖြစ်ပြီး — `else` branch မှာ — ပထမဆုံး child ဖြစ်ပါတယ်။ ဒါကြောင့် နေရာတစ်ခုချင်းစီမှာ component type က ပြောင်းလဲပါတယ်။ ပထမနေရာက `p` နဲ့ `Form` ကြား ပြောင်းပြီး — ဒုတိယနေရာက `Form` နဲ့ `button` ကြား ပြောင်းပါတယ်။ Component type ပြောင်းတိုင်း — React က state ကို ပြန်လည်သတ်မှတ်ပါတယ်။

အလွယ်ဆုံး ဖြေရှင်းနည်းက — branches တွေကို ပေါင်းစည်းပြီး `Form` က နေရာတစ်ခုတည်းမှာ အမြဲတမ်း render ဖြစ်အောင် လုပ်တာပါ:

```jsx
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```
```css
textarea { display: block; margin: 10px 0; }
```
နည်းပညာအရ — `else` branch ထဲမှာ `<Form />` ရှေ့မှာ `null` ကို ထည့်ပြီး `if` branch ရဲ့ structure နဲ့ ကိုက်ညီအောင် လုပ်လို့လည်း ရပါတယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```
```css
textarea { display: block; margin: 10px 0; }
```
ဒီနည်းနဲ့ — `Form` က အမြဲတမ်း ဒုတိယမြောက် child ဖြစ်နေတာမို့ — နေရာတစ်ခုတည်းမှာ ဆက်ရှိနေပြီး သူ့ရဲ့ state ကို ထိန်းသိမ်းပါတယ်။ ဒါပေမယ့် — ဒီနည်းလမ်းက သိပ်မထင်ရှားဘဲ — တစ်ခြားတစ်ယောက်ယောက်က အဲဒီ `null` ကို ဖယ်ပစ်မယ့် အန္တရာယ် ရှိပါတယ်။

### Form Field နှစ်ခုကို နေရာချင်းလဲလှယ်ခြင်း

ဒီ form က first name နဲ့ last name ထည့်လို့ရပါတယ်။ ဘယ် field က အရင်လာမလဲဆိုတာကို ထိန်းချုပ်တဲ့ checkbox တစ်ခုလည်း ရှိပါတယ်။ Checkbox ကို အမှတ်ခြစ်လိုက်တဲ့အခါ — "Last name" field က "First name" field ရဲ့ ရှေ့မှာ ပေါ်လာပါမယ်။

အလုပ်လုပ်လုနီးပါး ဖြစ်ပေမယ့် — bug တစ်ခု ရှိပါတယ်။ "First name" input ထဲ ဖြည့်ပြီး checkbox ကို အမှတ်ခြစ်လိုက်ရင် — text က ပထမ input ထဲမှာပဲ ကျန်နေပါလိမ့်မယ် (အဲဒါက အခု "Last name" ဖြစ်နေပါပြီ)။ Order ပြောင်းပြန်လုပ်တဲ့အခါ — input text *ပါ* ရွေ့သွားအောင် ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** ဒီ field တွေအတွက် — parent အတွင်းက သူတို့ရဲ့ နေရာတစ်ခုတည်းနဲ့ မလုံလောက်ဘူးလို့ ထင်ရပါတယ်။ Re-render တွေကြားမှာ state ကို ဘယ်လို ကိုက်ညီပေးရမလဲဆိုတာ React ကို ပြောပြနိုင်တဲ့ နည်းလမ်းတစ်ခုခု ရှိလား?

```jsx
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" />
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" />
        <Field label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```
```css
label { display: block; margin: 10px 0; }
```
#### အဖြေ

`if` ရော `else` branch နှစ်ခုလုံးမှာ `<Field>` component နှစ်ခုလုံးကို `key` တစ်ခု ပေးပါ။ ဒါက — parent အတွင်းက သူတို့ရဲ့ order ပြောင်းသွားရင်တောင် — `<Field>` တစ်ခ်ချင်းစီအတွက် မှန်ကန်တဲ့ state ကို ဘယ်လို "ကိုက်ညီပေး" ရမလဲဆိုတာ React ကို ပြောပြပါတယ်:

```jsx
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" />
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" />
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```
```css
label { display: block; margin: 10px 0; }
```
### Detail Form တစ်ခုကို ပြန်လည်သတ်မှတ်ခြင်း

ဒါက edit လုပ်လို့ရတဲ့ contact list တစ်ခုပါ။ ရွေးထားတဲ့ contact ရဲ့ အသေးစိတ်တွေကို edit လုပ်ပြီး — update လုပ်ဖို့ "Save" ဒါမှမဟုတ် — သင့်ပြောင်းလဲမှုတွေကို ပြန်ဖျက်ဖို့ "Reset" ကို နှိပ်နိုင်ပါတယ်။

Contact မတူညီတာ (ဥပမာ Alice) ရွေးလိုက်တဲ့အခါ — state က update ဖြစ်ပေမယ့် form က ယခင် contact ရဲ့ အသေးစိတ်တွေကို ဆက်ပြနေပါတယ်။ ရွေးထားတဲ့ contact ပြောင်းတဲ့အခါ — form က reset ဖြစ်အောင် ပြုပြင်ပါ။

```jsx
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```
```jsx
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```
```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```
#### အဖြေ

`EditContact` component ကို `key={selectedId}` ပေးပါ။ ဒီနည်းနဲ့ — contact မတူညီတာတွေကြား ပြောင်းတိုင်း — form က reset ဖြစ်ပါလိမ့်မယ်:

```jsx
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```
```jsx
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```
```jsx
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```
```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```
### Image Load ဖြစ်နေချိန်မှာ ပုံအဟောင်းကို ရှင်းလင်းခြင်း

"Next" ကို နှိပ်လိုက်တဲ့အခါ — browser က နောက် image ကို load စလုပ်ပါတယ်။ ဒါပေမယ့် — အဲဒါက `<img>` tag တစ်ခုတည်းထဲမှာ ပြထားတာမို့ — default အနေနဲ့ နောက် image load မပြီးမချင်း — ယခင် image ကို ဆက်မြင်နေရပါလိမ့်မယ်။ Text က image နဲ့ အမြဲတမ်း ကိုက်ညီနေတာ အရေးကြီးရင် — ဒါက မလိုချင်တဲ့ အပြုအမူ ဖြစ်နိုင်ပါတယ်။ "Next" ကို နှိပ်လိုက်တာနဲ့ — ယခင် image က ချက်ချင်း ရှင်းသွားအောင် ပြောင်းလဲပါ။

> **အရိပ်အမြွက်:** DOM ကို ပြန်သုံးမယ့်အစား ပြန်လည်ဖန်တီးဖို့ React ကို ပြောနိုင်တဲ့ နည်းလမ်းတစ်ခု ရှိလား?

```jsx
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```
```css
img { width: 150px; height: 150px; }
```
#### အဖြေ

`<img>` tag ကို `key` တစ်ခု ပေးနိုင်ပါတယ်။ အဲဒီ `key` ပြောင်းတဲ့အခါ — React က `<img>` DOM node ကို အစကနေ ပြန်ဖန်တီးပါလိမ့်မယ်။ ဒါက image တစ်ခုချင်းစီ load ဖြစ်တဲ့အခါ flash ခဏ ဖြစ်စေတာမို့ — သင့် app ထဲက image တိုင်းအတွက် ဒါကို လုပ်ချင်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် image က text နဲ့ အမြဲတမ်း ကိုက်ညီနေစေချင်ရင်တော့ အဓိပ္ပါယ် ရှိပါတယ်။

```jsx
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```
```css
img { width: 150px; height: 150px; }
```
### List ထဲမှာ နေရာလွဲနေတဲ့ State ကို ပြုပြင်ခြင်း

ဒီ list မှာ — `Contact` တစ်ခုချင်းစီမှာ သူ့အတွက် "Show email" နှိပ်ပြီးပြီလားဆိုတာကို ဆုံးဖြတ်တဲ့ state တစ်ခု ရှိပါတယ်။ Alice အတွက် "Show email" ကို နှိပ်ပြီး — "Show in reverse order" checkbox ကို အမှတ်ခြစ်ကြည့်ပါ။ အခု _Taylor_ ရဲ့ email က ဖြန့်ပြထားပြီး — အောက်ကို ရွေ့သွားတဲ့ Alice ရဲ့ဟာက ခေါက်ထားတဲ့အတိုင်း ပေါ်နေတာကို သတိပြုမိပါလိမ့်မယ်။

Expanded state က ရွေးထားတဲ့ order ဘယ်လိုပဲ ဖြစ်ဖြစ် — contact တစ်ခုချင်းစီနဲ့ ဆက်စပ်နေအောင် ပြုပြင်ပါ။

```jsx
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```
```jsx
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```
```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```
#### အဖြေ

ပြဿနာက — ဒီဥပမာက index ကို `key` အဖြစ် သုံးထားလို့ပါ:

```jsx
{displayedContacts.map((contact, i) =>
  <li key={i}>
```
ဒါပေမယ့် — state က *contact တစ်ခုချင်းစီနဲ့* ဆက်စပ်နေစေချင်ပါတယ်။

`key` အဖြစ် contact ID ကို သုံးတာက ပြဿနာကို ဖြေရှင်းပါတယ်:

```jsx
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```
```jsx
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```
```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```
State က tree ထဲက နေရာနဲ့ ဆက်စပ်နေပါတယ်။ `key` တစ်ခုက — order ကို မှီခိုမယ့်အစား နာမည်တပ်ထားတဲ့ နေရာတစ်ခုကို သတ်မှတ်ခွင့် ပေးပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း](/docs/react/extracting-state-logic-into-a-reducer) — state update logic တွေကို function တစ်ခုတည်းမှာ စုစည်းခြင်း
- [Component များကြား State မျှဝေခြင်း](/docs/react/sharing-state-between-components) — state lifting ဖြင့် component နှစ်ခုကို ညှိနှိုင်းခြင်း
