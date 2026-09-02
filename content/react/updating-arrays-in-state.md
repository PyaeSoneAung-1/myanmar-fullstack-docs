---
title: "State ထဲက Array Update လုပ်ခြင်း"
description: "State ထဲက arrays တွေကို read-only အဖြစ် သဘောထားပြီး array အသစ်များဖြင့် ထည့်ခြင်း/ဖယ်ခြင်း/ပြောင်းလဲခြင်း — filter၊ map၊ spread syntax၊ Immer နဲ့ array ထဲက nested object များ update လုပ်နည်း"
order: 36
source: "https://react.dev/learn/updating-arrays-in-state"
status: translated
updated: 2026-09-02
---

JavaScript မှာ arrays တွေက mutable ပါ — ဒါပေမယ့် — သူတို့ကို state ထဲမှာ သိမ်းတဲ့အခါ — immutable အဖြစ် သဘောထားရပါမယ်။ Objects တွေလိုပဲ — state ထဲမှာ သိမ်းထားတဲ့ array တစ်ခုကို update လုပ်ချင်တဲ့အခါ — array အသစ်တစ်ခု ဖန်တီး (ဒါမှမဟုတ် ရှိပြီးသား တစ်ခုရဲ့ copy လုပ်) ပြီး — state ကို array အသစ်နဲ့ set ရပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React state ထဲက array တစ်ခုမှာ item တွေကို ဘယ်လို ထည့်၊ ဖယ်၊ ပြောင်းမလဲ
- Array တစ်ခုထဲက object တစ်ခုကို ဘယ်လို update လုပ်မလဲ
- Immer နဲ့ array copying တွေကို ဘယ်လို ထပ်ခါထပ်ခါ ရေးနေစရာ မလိုအောင် လုပ်မလဲ

## Mutation မပါဘဲ Arrays တွေကို Update လုပ်ခြင်း

JavaScript မှာ — arrays တွေက object တစ်မျိုးပဲ ဖြစ်ပါတယ်။ [Objects တွေလိုပဲ](/docs/react/updating-objects-in-state) — **React state ထဲက arrays တွေကို read-only အဖြစ် သဘောထားရပါမယ်။** ဆိုလိုတာက — `arr[0] = 'bird'` လိုမျိုး array ထဲက item တစ်ခုကို ပြန်သတ်မှတ် (reassign) လုပ်လို့ မရသလို — `push()` နဲ့ `pop()` လိုမျိုး array ကို mutate လုပ်တဲ့ methods တွေလည်း မသုံးရပါဘူး။

အဲဒီအစား — array တစ်ခုကို update လုပ်ချင်တိုင်း — state setting function ဆီ array *အသစ်* တစ်ခုကို ပို့ပေးရပါတယ်။ အဲဒီလိုလုပ်ဖို့ — state ထဲက မူရင်း array ကနေ — `filter()` နဲ့ `map()` လိုမျိုး non-mutating methods တွေကို ခေါ်ပြီး — array အသစ်တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ပြီးရင် ရလာတဲ့ array အသစ်နဲ့ state ကို set လုပ်နိုင်ပါတယ်။

အသုံးများတဲ့ array operations တွေရဲ့ ကိုးကားဇယား ဒီမှာပါ။ React state ထဲက arrays တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — ဘယ်ဘက် column က methods တွေကို ရှောင်ပြီး — ညာဘက် column က methods တွေကို ဦးစားပေးသုံးရပါမယ်:

| | ရှောင်ရန် (array ကို mutate လုပ်သည်) | ဦးစားပေးသုံးရန် (array အသစ် ပြန်ပေးသည်) |
| --------- | ----------------------------------- | ----------------------------------------------------------- |
| ထည့်ခြင်း | `push`, `unshift` | `concat`, `[...arr]` spread syntax |
| ဖယ်ခြင်း | `pop`, `shift`, `splice` | `filter`, `slice` |
| အစားထိုးခြင်း | `splice`, `arr[i] = ...` assignment | `map` |
| စီခြင်း | `reverse`, `sort` | array ကို အရင်ဆုံး copy လုပ်ပါ |

ဒါမှမဟုတ် — column နှစ်ခုလုံးက methods တွေကို သုံးခွင့်ပေးတဲ့ [Immer](#write-concise-update-logic-with-immer) ကို သုံးနိုင်ပါတယ်။

> **သတိပြုရန်:** ကံမကောင်းစွာပဲ — [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) နဲ့ [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) တို့က — နာမည်ချင်း ဆင်ပေမယ့် — အရမ်းကို ကွာခြားပါတယ်:
>
> - `slice` က array တစ်ခု ဒါမှမဟုတ် သူ့ရဲ့ အစိတ်အပိုင်းတစ်ခုကို copy လုပ်ပေးပါတယ်။
> - `splice` က (item တွေ ထည့်ဖို့ ဒါမှမဟုတ် ဖျက်ဖို့) array ကို **mutate** လုပ်ပါတယ်။
>
> React မှာ — state ထဲက objects ဒါမှမဟုတ် arrays တွေကို mutate မလုပ်ချင်တာမို့ — `slice` (`p` မပါတဲ့!) ကို ပိုပြီး မကြာခဏ သုံးပါလိမ့်မယ်။ [State ထဲက Object Update လုပ်ခြင်း](/docs/react/updating-objects-in-state) မှာ mutation ဆိုတာ ဘာလဲ၊ state အတွက် ဘာကြောင့် မထောက်ခံလဲဆိုတာ ရှင်းပြထားပါတယ်။

### Array တစ်ခုဆီ ထည့်ခြင်း

`push()` က array တစ်ခုကို mutate လုပ်ပါလိမ့်မယ် — အဲဒါ မလိုချင်ပါဘူး:

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

အဲဒီအစား — ရှိပြီးသား items တွေ *နဲ့* အဆုံးမှာ item အသစ်တစ်ခုပါတဲ့ array *အသစ်* တစ်ခုကို ဖန်တီးပါ။ ဒါကို လုပ်ဖို့ နည်းလမ်းများစွာ ရှိပေမယ့် — အလွယ်ဆုံးက `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) syntax ကို သုံးတာပါ:

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

အခုတော့ မှန်မှန်ကန်ကန် အလုပ်လုပ်ပါပြီ:

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

Array spread syntax က — item တစ်ခုကို မူရင်း `...artists` ရဲ့ *ရှေ့မှာ* ထားခြင်းဖြင့် — prepend လုပ်ဖို့လည်း ခွင့်ပြုပါတယ်:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

ဒီနည်းနဲ့ — spread က — array ရဲ့ အဆုံးကို ထည့်တဲ့ `push()` ရော — array ရဲ့ အစကို ထည့်တဲ့ `unshift()` ရဲ့ အလုပ်ကိုပါ လုပ်နိုင်ပါတယ်။ အထက်က sandbox ထဲမှာ စမ်းကြည့်ပါ!

### Array တစ်ခုကနေ ဖယ်ခြင်း

Array တစ်ခုကနေ item တစ်ခုကို ဖယ်ဖို့ အလွယ်ဆုံးနည်းလမ်းက — သူ့ကို *filter ထုတ်ပစ်တာပါ*။ တစ်နည်းပြောရရင် — အဲဒီ item မပါတဲ့ array အသစ်တစ်ခုကို ထုတ်လုပ်မှာပါ။ ဒါကိုလုပ်ဖို့ `filter` method ကို သုံးပါ:

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

"Delete" button ကို နှစ်ချက် သုံးချက် နှိပ်ပြီး — သူ့ရဲ့ click handler ကို ကြည့်ပါ။

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

ဒီနေရာမှာ — `artists.filter(a => a.id !== artist.id)` ဆိုတာ "ID တွေက `artist.id` နဲ့ မတူတဲ့ `artists` တွေနဲ့ ဖွဲ့စည်းထားတဲ့ array တစ်ခုကို ဖန်တီးပါ" လို့ အဓိပ္ပါယ်ရပါတယ်။ တစ်နည်းပြောရရင် — artist တစ်ယောက်ချင်းစီရဲ့ "Delete" button က အဲဒီ artist ကို array ကနေ filter ထုတ်ပြီး — ရလာတဲ့ array နဲ့ re-render တစ်ခုကို တောင်းဆိုပါတယ်။ `filter` က မူရင်း array ကို မပြုပြင်ဘူးဆိုတာ သတိပြုပါ။

### Array တစ်ခုကို အသွင်ပြောင်းခြင်း

Array ရဲ့ item တစ်ချို့ ဒါမှမဟုတ် အားလုံးကို ပြောင်းချင်ရင် — `map()` ကို သုံးပြီး array **အသစ်** တစ်ခု ဖန်တီးနိုင်ပါတယ်။ `map` ဆီ ပို့တဲ့ function က — item တစ်ခုချင်းစီကို — သူ့ရဲ့ data ဒါမှမဟုတ် သူ့ရဲ့ index (ဒါမှမဟုတ် နှစ်ခုလုံး) ပေါ်မူတည်ပြီး — ဘာလုပ်ရမလဲ ဆုံးဖြတ်နိုင်ပါတယ်။

ဒီဥပမာမှာ — array တစ်ခုက circle နှစ်ခုနဲ့ square တစ်ခုရဲ့ coordinates တွေကို သိမ်းထားပါတယ်။ Button ကို နှိပ်လိုက်တဲ့အခါ — circles တွေကိုပဲ 50 pixels အောက်ကို ရွှေ့ပါတယ်။ ဒါကို `map()` သုံးပြီး data array အသစ်တစ်ခု ထုတ်လုပ်ခြင်းဖြင့် လုပ်ပါတယ်:

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

### Array တစ်ခုထဲက Items တွေကို အစားထိုးခြင်း

Array တစ်ခုထဲက item တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတာတွေကို အစားထိုးချင်တာက အထူးသဖြင့် အဖြစ်များပါတယ်။ `arr[0] = 'bird'` လိုမျိုး assignments တွေက မူရင်း array ကို mutate လုပ်တာမို့ — ဒါအတွက်လည်း `map` ကို သုံးချင်ပါလိမ့်မယ်။

Item တစ်ခုကို အစားထိုးဖို့ — `map` နဲ့ array အသစ်တစ်ခု ဖန်တီးပါ။ သင့် `map` call ထဲမှာ — item index ကို second argument အနေနဲ့ ရပါလိမ့်မယ်။ အဲဒါကို သုံးပြီး — မူရင်း item (first argument) ကို ပြန်ပေးမလား ဒါမှမဟုတ် တခြားတစ်ခုခုကို ပြန်ပေးမလား ဆုံးဖြတ်ပါ:

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

### Array တစ်ခုထဲ ထည့်သွင်းခြင်း

တစ်ခါတစ်ရံ — item တစ်ခုကို အစမဟုတ်သလို အဆုံးလည်း မဟုတ်တဲ့ — သီးခြားနေရာတစ်ခုမှာ ထည့်ချင်နိုင်ပါတယ်။ ဒါကိုလုပ်ဖို့ — `...` array spread syntax ကို `slice()` method နဲ့ တွဲသုံးနိုင်ပါတယ်။ `slice()` method က array ရဲ့ "အချပ် (slice)" တစ်ခုကို ဖြတ်ယူနိုင်စေပါတယ်။ Item တစ်ခု ထည့်ဖို့ — ထည့်မယ့်နေရာရဲ့ *ရှေ့* က slice ကို spread လုပ်ပြီး — item အသစ် — ပြီးတော့ မူရင်း array ရဲ့ ကျန်အပိုင်းကို ပါဝင်စေတဲ့ array တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။

ဒီဥပမာမှာ — Insert button က index `1` မှာ အမြဲ ထည့်ပါတယ်:

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

### Array တစ်ခုကို တခြားပြောင်းလဲမှုတွေ လုပ်ခြင်း

Spread syntax နဲ့ `map()`၊ `filter()` လိုမျိုး non-mutating methods တွေ တစ်ခုတည်းနဲ့ မလုပ်နိုင်တဲ့ အရာတွေ ရှိပါတယ်။ ဥပမာ — array တစ်ခုကို reverse ဒါမှမဟုတ် sort လုပ်ချင်နိုင်ပါတယ်။ JavaScript ရဲ့ `reverse()` နဲ့ `sort()` methods တွေက မူရင်း array ကို mutate လုပ်လို့ — သူတို့ကို တိုက်ရိုက် သုံးလို့ မရပါဘူး။

**ဒါပေမယ့် — array ကို အရင်ဆုံး copy လုပ်ပြီးတော့ — အဲဒီ copy ပေါ်မှာ ပြောင်းလဲမှုတွေ လုပ်နိုင်ပါတယ်။**

ဥပမာ:

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

ဒီနေရာမှာ — မူရင်း array ရဲ့ copy တစ်ခုကို ဖန်တီးဖို့ `[...list]` spread syntax ကို သုံးထားပါတယ်။ Copy ရှိပြီဆိုတော့ — `nextList.reverse()` ဒါမှမဟုတ် `nextList.sort()` လိုမျိုး mutating methods တွေ သုံးနိုင်သလို — `nextList[0] = "something"` နဲ့ item တစ်ခုချင်းစီကိုတောင် assign လုပ်နိုင်ပါတယ်။

ဒါပေမယ့် — **array တစ်ခုကို copy လုပ်ထားရင်တောင် — သူ့အတွင်းက ရှိပြီးသား items တွေကို တိုက်ရိုက် mutate လုပ်လို့ မရပါဘူး။** ဒါက — copying က shallow ဖြစ်လို့ပါ — array အသစ်ထဲမှာ မူရင်းနဲ့ item တွေ တစ်ခုတည်း ပါဝင်ပါလိမ့်မယ်။ ဒါကြောင့် — copy လုပ်ထားတဲ့ array ထဲက object တစ်ခုကို ပြုပြင်ရင် — သင်က ရှိပြီးသား state ကို mutate လုပ်နေတာပါ။ ဥပမာ — ဒီလို code မျိုးက ပြဿနာပါ။

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

`nextList` နဲ့ `list` တို့က array မတူညီတဲ့ နှစ်ခုဖြစ်ပေမယ့် — **`nextList[0]` နဲ့ `list[0]` တို့က object တစ်ခုတည်းကို ညွှန်ပါတယ်။** ဒါကြောင့် — `nextList[0].seen` ကို ပြောင်းလိုက်ရင် — `list[0].seen` ကိုပါ ပြောင်းလိုက်တာပါ။ ဒါက state mutation ဖြစ်ပြီး — ရှောင်ရပါမယ်! ဒီပြဿနာကို [nested JavaScript objects တွေကို update လုပ်သလိုမျိုး](/docs/react/updating-objects-in-state) — ပြောင်းချင်တဲ့ item တစ်ခုချင်းစီကို mutate လုပ်မယ့်အစား copy လုပ်ခြင်းဖြင့် — ဖြေရှင်းနိုင်ပါတယ်။ ဒီလိုပါ။

## Array တွေထဲက Objects တွေကို Update လုပ်ခြင်း

Objects တွေက တကယ်တော့ arrays တွေရဲ့ "အတွင်းမှာ" ရှိနေတာ မဟုတ်ပါဘူး။ Code ထဲမှာ "အတွင်းမှာ" ရှိနေပုံ ပေါက်ပေမယ့် — array တစ်ခုထဲက object တစ်ခုချင်းစီက — array က "ညွှန်ပြနေတဲ့" — သီးခြား value တစ်ခုပါ။ ဒါကြောင့် — `list[0]` လိုမျိုး nested fields တွေကို ပြောင်းတဲ့အခါ သတိထားရပါတယ်။ တခြားလူတစ်ယောက်ရဲ့ artwork list က array ရဲ့ element တစ်ခုတည်းကို ညွှန်နေနိုင်လို့ပါ!

**Nested state ကို update လုပ်တဲ့အခါ — သင်ပြောင်းချင်တဲ့ နေရာကနေ — top level အထိ — copies တွေ ဖန်တီးရပါတယ်။** ဒါ ဘယ်လို အလုပ်လုပ်လဲ ကြည့်ရအောင်။

ဒီဥပမာမှာ — artwork list သီးခြား နှစ်ခုက တူညီတဲ့ ကနဦး state ရှိပါတယ်။ သူတို့က သီးခြားစီ ဖြစ်သင့်ပေမယ့် — mutation တစ်ခုကြောင့် — သူတို့ရဲ့ state က မတော်တဆ မျှဝေခံရပြီး — list တစ်ခုထဲမှာ box တစ်ခု အမှတ်ခြစ်လိုက်ရင် — နောက် list တစ်ခုကိုပါ ထိခိုက်ပါတယ်:

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

ပြဿနာက ဒီလို code ထဲမှာပါ:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

`myNextList` array ကိုယ်တိုင်က အသစ်ဖြစ်ပေမယ့် — *items တွေကိုယ်တိုင်ကတော့* မူရင်း `myList` array ထဲကအတိုင်း တစ်ခုတည်းပါ။ ဒါကြောင့် — `artwork.seen` ကို ပြောင်းလိုက်တာက မူရင်း artwork item ကို ပြောင်းလိုက်တာပါ။ အဲဒီ artwork item က `yourList` ထဲမှာလည်း ပါတာမို့ — bug ဖြစ်စေပါတယ်။ ဒီလို bugs တွေက တွေးရခက်နိုင်ပေမယ့် — ကံကောင်းချင်တော့ — state ကို mutate မလုပ်ဘူးဆိုရင် သူတို့ ပျောက်သွားပါတယ်။

**Mutation မပါဘဲ — item အဟောင်းတစ်ခုကို သူ့ရဲ့ update လုပ်ထားတဲ့ version အသစ်နဲ့ အစားထိုးဖို့ `map` ကို သုံးနိုင်ပါတယ်။**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

ဒီနေရာမှာ — `...` က [object တစ်ခုရဲ့ copy ဖန်တီးဖို့](/docs/react/updating-objects-in-state) သုံးတဲ့ object spread syntax ပါ။

ဒီချဉ်းကပ်နည်းနဲ့ — ရှိပြီးသား state items တွေ ဘယ်ဟာမှ mutate မဖြစ်တော့ဘဲ — bug က ပြေလည်သွားပါတယ်:

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

ယေဘုယျအားဖြင့် — **သင်ကိုယ်တိုင် ခုနက ဖန်တီးထားတဲ့ objects တွေကိုပဲ mutate လုပ်သင့်ပါတယ်။** Artwork *အသစ်* တစ်ခု ထည့်သွင်းနေတယ်ဆိုရင် — သူ့ကို mutate လုပ်လို့ရပေမယ့် — state ထဲမှာ ရှိပြီးသား တစ်ခုခုနဲ့ အလုပ်လုပ်နေရရင်တော့ — copy တစ်ခု လုပ်ရပါတယ်။

### Immer နဲ့ Update Logic ကို ကျစ်လျစ်အောင် ရေးခြင်း

Mutation မပါဘဲ nested arrays တွေကို update လုပ်တာက နည်းနည်း ထပ်ခါထပ်ခါ ဖြစ်လာနိုင်ပါတယ်။ [Objects တွေနဲ့ လုပ်ခဲ့သလိုပဲ](/docs/react/updating-objects-in-state):

- ယေဘုယျအားဖြင့် — state ကို အဆင့် နှစ်ဆင့်ထက် ပိုနက်တဲ့ နေရာတွေအထိ update လုပ်စရာ မလိုသင့်ပါဘူး။ သင့် state objects တွေ အရမ်းနက်နေရင် — သူတို့ကို flat ဖြစ်အောင် [ဖွဲ့စည်းပုံ ပြန်ပြောင်း](/docs/react/choosing-the-state-structure) ချင်နိုင်ပါတယ်။
- State structure ကို မပြောင်းချင်ဘူးဆိုရင် — [Immer](https://github.com/immerjs/use-immer) ကို သုံးချင်နိုင်ပါတယ် — သူက အဆင်ပြေပေမယ့် mutating ဖြစ်တဲ့ syntax နဲ့ ရေးခွင့်ပြုပြီး — copies တွေ ထုတ်လုပ်ပေးတာကို ကိုယ်တိုင် လုပ်ပေးပါတယ်။

ဒီမှာ Art Bucket List ဥပမာကို Immer နဲ့ ပြန်ရေးထားတာပါ:

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

Immer နဲ့ဆိုရင် — **`artwork.seen = nextSeen` လိုမျိုး mutation က အခု ရပါတယ်** ဆိုတာ သတိပြုပါ:

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

ဒါက — သင်က မူရင်း state ကို mutate လုပ်နေတာ မဟုတ်ဘဲ — Immer က ပေးတဲ့ `draft` လို့ခေါ်တဲ့ အထူး object တစ်ခုကို mutate လုပ်နေလို့ပါ။ အလားတူပဲ — `push()` နဲ့ `pop()` လိုမျိုး mutating methods တွေကိုလည်း `draft` ရဲ့ content တွေပေါ်မှာ သုံးနိုင်ပါတယ်။

နောက်ကွယ်မှာ — Immer က `draft` ပေါ်မှာ သင်လုပ်ခဲ့တဲ့ ပြောင်းလဲမှုတွေအရ — နောက် state ကို အမြဲတမ်း အစကနေ တည်ဆောက်ပါတယ်။ ဒါက သင့် event handlers တွေကို state ကို ဘယ်တော့မှ mutate မလုပ်ဘဲ — အရမ်း ကျစ်လျစ်နေစေပါတယ်။

## အကျဉ်းချုပ်

- Arrays တွေကို state ထဲမှာ ထားနိုင်ပေမယ့် — ပြောင်းလဲလို့တော့ မရပါဘူး။
- Array တစ်ခုကို mutate လုပ်မယ့်အစား — သူ့ရဲ့ *version အသစ်* တစ်ခု ဖန်တီးပြီး — state ကို အဲဒါနဲ့ update လုပ်ပါ။
- Item အသစ်တွေပါတဲ့ arrays တွေ ဖန်တီးဖို့ `[...arr, newItem]` array spread syntax ကို သုံးနိုင်ပါတယ်။
- Item တွေ စစ်ထုတ်ပြီး ဒါမှမဟုတ် အသွင်ပြောင်းပြီး arrays အသစ်တွေ ဖန်တီးဖို့ `filter()` နဲ့ `map()` ကို သုံးနိုင်ပါတယ်။
- သင့် code ကျစ်လျစ်နေဖို့ Immer ကို သုံးနိုင်ပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Shopping Cart ထဲက Item တစ်ခုကို Update လုပ်ခြင်း

"+" ကို နှိပ်လိုက်ရင် သက်ဆိုင်ရာ ဂဏန်း တိုးသွားအောင် — `handleIncreaseClick` logic ကို ဖြည့်ပါ:

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

#### အဖြေ

`map` function ကို သုံးပြီး array အသစ်တစ်ခု ဖန်တီးနိုင်ပြီး — ပြောင်းလဲလိုက်တဲ့ object ရဲ့ copy ကို array အသစ်အတွက် ဖန်တီးဖို့ `...` object spread syntax ကို သုံးနိုင်ပါတယ်:

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

### Shopping Cart ကနေ Item တစ်ခုကို ဖယ်ခြင်း

ဒီ shopping cart မှာ "+" button က အလုပ်လုပ်ပေမယ့် — "–" button က ဘာမှ မလုပ်ပါဘူး။ Count က `1` ဖြစ်နေတုန်း "–" ကို နှိပ်ရင် product က cart ကနေ အလိုအလျောက် ဖယ်ရှားသွားအောင် — "–" button ကို နှိပ်တဲ့အခါ သက်ဆိုင်ရာ product ရဲ့ `count` ကို လျှော့ချပေးဖို့ — event handler တစ်ခု ထည့်ပေးရပါမယ်။ သူက `0` ကို ဘယ်တော့မှ မပြဖို့ သေချာအောင် လုပ်ပါ။

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

#### အဖြေ

ပထမဆုံး — array အသစ်တစ်ခု ထုတ်လုပ်ဖို့ `map` ကို သုံးပြီး — ပြီးရင် — `count` က `0` ဖြစ်နေတဲ့ products တွေကို ဖယ်ဖို့ `filter` ကို သုံးနိုင်ပါတယ်:

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

### Non-mutative Methods သုံးပြီး Mutations တွေကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — `App.js` ထဲက event handlers တွေ အားလုံးက mutation သုံးထားပါတယ်။ ရလဒ်အနေနဲ့ — todos တွေကို edit လုပ်တာ၊ ဖျက်တာ အလုပ်မလုပ်ပါဘူး။ Non-mutative methods တွေ သုံးအောင် `handleAddTodo`၊ `handleChangeTodo` နဲ့ `handleDeleteTodo` တွေကို ပြန်ရေးပါ:

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

#### အဖြေ

`handleAddTodo` ထဲမှာ — array spread syntax ကို သုံးနိုင်ပါတယ်။ `handleChangeTodo` ထဲမှာ — `map` နဲ့ array အသစ်တစ်ခု ဖန်တီးနိုင်ပါတယ်။ `handleDeleteTodo` ထဲမှာ — `filter` နဲ့ array အသစ်တစ်ခု ဖန်တီးနိုင်ပါတယ်။ အခုတော့ list က မှန်မှန်ကန်ကန် အလုပ်လုပ်ပါပြီ:

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

### Immer သုံးပြီး Mutations တွေကို ပြုပြင်ခြင်း

ဒါက ယခင် challenge ကနဲ့ တူညီတဲ့ ဥပမာပါ။ ဒီတစ်ခါ — Immer ကို သုံးပြီး mutations တွေကို ပြုပြင်ပါ။ သင့်အတွက် အဆင်ပြေအောင် — `useImmer` ကို ကြိုပြီး import ထားပြီးသားမို့ — `todos` state variable ကို သူ့ကို သုံးဖို့ ပြောင်းလဲရပါမယ်။

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

#### အဖြေ

Immer နဲ့ဆိုရင် — Immer က ပေးတဲ့ `draft` ရဲ့ အစိတ်အပိုင်းတွေကိုပဲ mutate လုပ်နေသရွေ့ — mutative ပုံစံနဲ့ code ရေးနိုင်ပါတယ်။ ဒီနေရာမှာ — mutations တွေ အားလုံးကို `draft` ပေါ်မှာ လုပ်ထားလို့ — code က အလုပ်လုပ်ပါတယ်:

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

Immer နဲ့ဆိုရင် — mutative နဲ့ non-mutative ချဉ်းကပ်နည်း နှစ်ခုကိုလည်း ရောသုံးနိုင်ပါတယ်။

ဥပမာ — ဒီ version မှာ `handleAddTodo` ကို Immer `draft` ကို mutate လုပ်ခြင်းဖြင့် အကောင်အထည်ဖော်ထားပြီး — `handleChangeTodo` နဲ့ `handleDeleteTodo` တို့က non-mutative ဖြစ်တဲ့ `map` နဲ့ `filter` methods တွေကို သုံးထားပါတယ်:

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

Immer နဲ့ဆိုရင် — ကိစ္စတစ်ခုချင်းစီအတွက် အသင့်တော်ဆုံး ခံစားရတဲ့ style ကို ရွေးနိုင်ပါတယ်။
