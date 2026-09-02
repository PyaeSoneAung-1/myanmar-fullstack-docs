---
title: "State — Component တစ်ခုရဲ့ Memory"
description: "useState Hook နဲ့ state variable တွေ ထည့်သွင်းခြင်း — useState က ဘာ value တွဲတွေ ပြန်ပေးလဲ၊ state variable အများအပြား ထည့်နည်း၊ state ကို local လို့ ဘာကြောင့် ခေါ်လဲ"
order: 22
source: "https://react.dev/learn/state-a-components-memory"
status: translated
updated: 2026-09-01
---

Component တွေက — interaction တစ်ခုရဲ့ ရလဒ်အဖြစ် — screen ပေါ်မှာ ရှိတာကို မကြာခဏ ပြောင်းလဲဖို့ လိုအပ်ပါတယ်။ Form ထဲ ရိုက်ထည့်တာက input field ကို update သင့်တယ်၊ image carousel တစ်ခုပေါ်မှာ "next" နှိပ်တာက ပြတဲ့ image ကို ပြောင်းသင့်တယ်၊ "buy" နှိပ်တာက shopping cart ထဲ product တစ်ခု ထည့်သင့်တယ်။ Component တွေက အရာတွေကို "မှတ်မိ" ဖို့ လိုပါတယ်: လက်ရှိ input value၊ လက်ရှိ image၊ shopping cart စတာတွေပါ။ React မှာ — component နဲ့ သီးသန့် ဆက်စပ်တဲ့ ဒီ memory အမျိုးအစားကို *state* လို့ ခေါ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- [`useState`](/docs/react/use-state) Hook နဲ့ state variable တစ်ခု ဘယ်လို ထည့်မလဲ
- `useState` Hook က value တွဲ ဘယ်လိုမျိုး ပြန်ပေးလဲ
- State variable တစ်ခုထက်ပို ဘယ်လို ထည့်မလဲ
- State ကို local လို့ ဘာကြောင့် ခေါ်လဲ

## ပုံမှန် Variable တစ်ခု မလုံလောက်တဲ့အခါ

ပန်းပုရုပ်ပုံတစ်ခုကို render လုပ်တဲ့ component တစ်ခု ဒီမှာ ရှိပါတယ်။ "Next" button ကို နှိပ်လိုက်တဲ့အခါ — `index` ကို `1`၊ ပြီးတော့ `2` စသဖြင့် ပြောင်းခြင်းဖြင့် — နောက် ပန်းပုရုပ်ကို ပြသင့်ပါတယ်။ ဒါပေမယ့် — ဒါက **အလုပ်မလုပ်ပါဘူး** (သင်စမ်းကြည့်လို့ရပါတယ်!):

```jsx
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```
`handleClick` event handler က local variable တစ်ခုဖြစ်တဲ့ `index` ကို update လုပ်နေပါတယ်။ ဒါပေမယ့် — ဒီပြောင်းလဲမှုကို မြင်ရအောင် တားဆီးနေတဲ့ အချက် နှစ်ခု ရှိပါတယ်:

1. **Local variables တွေက renders တွေကြားမှာ မရှင်သန်ပါဘူး။** React က ဒီ component ကို ဒုတိယအကြိမ် render လုပ်တဲ့အခါ — သူ့ကို အစကနေ render လုပ်ပါတယ် — local variables တွေရဲ့ ပြောင်းလဲမှုတွေကို ထည့်တွက်မထားပါဘူး။
2. **Local variables တွေရဲ့ ပြောင်းလဲမှုတွေက renders တွေကို trigger မလုပ်ပါဘူး။** React က component ကို data အသစ်နဲ့ နောက်တစ်ကြိမ် render လုပ်ဖို့ လိုတယ်ဆိုတာ သတိမပြုမိပါဘူး။

Component တစ်ခုကို data အသစ်နဲ့ update လုပ်ဖို့ — အချက် နှစ်ခု ဖြစ်ဖို့ လိုပါတယ်:

1. Data ကို renders တွေကြားမှာ **ထိန်းသိမ်း** ထားဖို့။
2. Component ကို data အသစ်နဲ့ render လုပ်ဖို့ (re-rendering) React ကို **trigger** လုပ်ဖို့။

[`useState`](/docs/react/use-state) Hook က ဒီအချက် နှစ်ခုကို ပေးပါတယ်:

1. Renders တွေကြားမှာ data ကို ထိန်းသိမ်းဖို့ **state variable** တစ်ခု။
2. Variable ကို update လုပ်ပြီး — component ကို နောက်တစ်ကြိမ် render ဖို့ React ကို trigger လုပ်ဖို့ — **state setter function** တစ်ခု။

## State Variable တစ်ခု ထည့်သွင်းခြင်း

State variable တစ်ခု ထည့်ဖို့ — file ရဲ့ ထိပ်ပိုင်းမှာ React ကနေ `useState` ကို import လုပ်ပါ:

```jsx
import { useState } from 'react';
```
ပြီးရင် — ဒီ line ကို:

```jsx
let index = 0;
```
ဒီနဲ့ အစားထိုးပါ:

```jsx
const [index, setIndex] = useState(0);
```
`index` က state variable တစ်ခုဖြစ်ပြီး — `setIndex` က setter function ပါ။

> ဒီမှာက `[` နဲ့ `]` syntax ကို [array destructuring](https://javascript.info/destructuring-assignment) လို့ ခေါ်ပြီး — array တစ်ခုကနေ တန်ဖိုးတွေကို ဖတ်နိုင်စေပါတယ်။ `useState` က ပြန်ပေးတဲ့ array မှာ item အတိအကျ နှစ်ခု အမြဲတမ်း ပါပါတယ်။

သူတို့ `handleClick` ထဲမှာ ဘယ်လို အတူတကွ အလုပ်လုပ်လဲ ဒီမှာ ကြည့်ပါ:

```jsx
function handleClick() {
  setIndex(index + 1);
}
```
အခု "Next" button ကို နှိပ်လိုက်တာနဲ့ — လက်ရှိ ပန်းပုရုပ်ကို ပြောင်းပါတယ်:

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

### သင့် ပထမဆုံး Hook နဲ့ မိတ်ဆက်

React မှာ — `useState` ရော — "`use`" နဲ့ စတင်တဲ့ တခြား function တွေ အားလုံးကိုပါ Hook လို့ ခေါ်ပါတယ်။

*Hooks* တွေက — React [rendering](/docs/react/render-and-commit#step-1-trigger-a-render) လုပ်နေချိန်မှာပဲ (နောက်စာမျက်နှာမှာ ပိုအသေးစိတ် လေ့လာရပါမယ်) — ရနိုင်တဲ့ အထူး functions တွေပါ။ သူတို့က React feature အမျိုးမျိုးထဲကို "ချိတ်ဝင်ခွင့်" (hook into) ပေးပါတယ်။

State က အဲဒီ features တွေထဲက တစ်ခုပဲ ဖြစ်ပြီး — တခြား Hooks တွေကို နောက်ပိုင်းမှာ သင်တွေ့ပါလိမ့်မယ်။

> **သတိပြုရန်:** **Hooks တွေ — `use` နဲ့ စတင်တဲ့ functions တွေ — ကို သင့် components တွေရဲ့ top level ဒါမှမဟုတ် [သင့်ကိုယ်ပိုင် Hooks](/docs/react/reusing-logic-with-custom-hooks) တွေမှာပဲ ခေါ်လို့ရပါတယ်။** Conditions တွေ၊ loops တွေ ဒါမှမဟုတ် တခြား nested functions တွေထဲမှာ Hooks တွေကို ခေါ်လို့ မရပါဘူး။ Hooks တွေက functions တွေပါ — ဒါပေမယ့် — သူတို့ကို သင့် component ရဲ့ လိုအပ်ချက်တွေအကြောင်း — unconditional ကြေညာချက်တွေလို့ တွေးကြည့်တာ အထောက်အကူ ဖြစ်ပါတယ်။ File ရဲ့ ထိပ်မှာ modules တွေကို "import" လုပ်သလိုမျိုး — သင့် component ရဲ့ ထိပ်မှာ React features တွေကို "use" လုပ်ပါတယ်။

### `useState` ရဲ့ ခန္ဓာဗေဒ (Anatomy)

[`useState`](/docs/react/use-state) ကို ခေါ်တဲ့အခါ — ဒီ component က တစ်ခုခုကို မှတ်မိစေချင်တယ်လို့ React ကို ပြောနေတာပါ:

```jsx
const [index, setIndex] = useState(0);
```
ဒီကိစ္စမှာ — `index` ကို React က မှတ်မိစေချင်ပါတယ်။

> **မှတ်ချက်:** ဒီတွဲကို `const [something, setSomething]` လိုမျိုး နာမည်ပေးတာ စည်းမျဉ်းပါ။ ကြိုက်တဲ့ နာမည် ဘာမဆို ပေးလို့ရပေမယ့် — စည်းမျဉ်းတွေက project တွေကြားမှာ အရာတွေကို နားလည်ဖို့ ပိုလွယ်ကူစေပါတယ်။

`useState` ရဲ့ တစ်ခုတည်းသော argument က သင့် state variable ရဲ့ **ကနဦး တန်ဖိုး (initial value)** ပါ။ ဒီဥပမာမှာ — `index` ရဲ့ ကနဦး တန်ဖိုးကို `useState(0)` နဲ့ `0` အဖြစ် သတ်မှတ်ထားပါတယ်။

သင့် component render ဖြစ်တိုင်း — `useState` က — တန်ဖိုး နှစ်ခု ပါတဲ့ array တစ်ခုကို ပေးပါတယ်:

1. သင်သိမ်းထားတဲ့ တန်ဖိုးပါတဲ့ **state variable** (`index`) ပါ။
2. State variable ကို update လုပ်ပြီး — component ကို နောက်တစ်ကြိမ် render ဖို့ React ကို trigger လုပ်နိုင်တဲ့ **state setter function** (`setIndex`) ပါ။

လက်တွေ့မှာ ဒီလို ဖြစ်ပျက်ပုံက ဒီလိုပါ:

```jsx
const [index, setIndex] = useState(0);
```
1. **သင့် component က ပထမဆုံးအကြိမ် render လုပ်ပါတယ်။** `index` ရဲ့ ကနဦး တန်ဖိုးအဖြစ် `useState` ဆီ `0` ပို့ထားလို့ — သူက `[0, setIndex]` ပြန်ပေးပါလိမ့်ယ်။ `0` က state ရဲ့ နောက်ဆုံး တန်ဖိုးဆိုတာ React က မှတ်မိပါတယ်။
2. **သင် state ကို update လုပ်ပါတယ်။** User က button ကို နှိပ်လိုက်တဲ့အခါ — `setIndex(index + 1)` ကို ခေါ်ပါတယ်။ `index` က `0` ဖြစ်လို့ — `setIndex(1)` ဖြစ်ပါတယ်။ ဒါက `index` က အခု `1` ဖြစ်ကြောင်း မှတ်မိပြီး — render တစ်ခု ထပ် trigger လုပ်ဖို့ React ကို ပြောပါတယ်။
3. **သင့် component ရဲ့ ဒုတိယ render။** React က `useState(0)` ကို မြင်ရဆဲပါ — ဒါပေမယ့် — `index` ကို `1` အဖြစ် သင် set ထားတာ React က *မှတ်မိ* နေလို့ — `[1, setIndex]` ကို အဲဒီအစား ပြန်ပေးပါတယ်။
4. စသဖြင့် ဆက်သွားပါတယ်!

## Component တစ်ခုကို State Variable အများအပြား ပေးခြင်း

Component တစ်ခုထဲမှာ — type ဘယ်လိုပဲ ဖြစ်ဖြစ် — state variable ဘယ်နှစ်ခုပဲ ဖြစ်ဖြစ် — ကြိုက်သလောက် ရှိနိုင်ပါတယ်။ ဒီ component ထဲမှာ — state variable နှစ်ခု ရှိပါတယ် — number `index` တစ်ခုနဲ့ — "Show details" နှိပ်တဲ့အခါ toggle လုပ်တဲ့ boolean `showMore` တစ်ခုပါ:

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```
သူတို့ရဲ့ state တွေ မသက်ဆိုင်ရင် — ဒီဥပမာထဲက `index` နဲ့ `showMore` လိုမျိုး — state variable အများအပြား ရှိတာ ကောင်းတဲ့ အကြံတစ်ခုပါ။ ဒါပေမယ့် — state variable နှစ်ခုကို မကြာခဏ အတူတူ ပြောင်းနေရတာ တွေ့ရရင် — သူတို့ကို တစ်ခုတည်း ပေါင်းစပ်တာ ပိုလွယ်ပါလိမ့်မယ်။ ဥပမာ — field အများကြီး ပါတဲ့ form တစ်ခု ရှိရင် — field တစ်ခုချင်းစီအတွက် state variable တစ်ခုစီ ထားမယ့်အစား — object တစ်ခုကို ကိုင်ထားတဲ့ state variable တစ်ခုတည်း ရှိတာ ပိုအဆင်ပြေပါတယ်။ နောက်ထပ် အကြံပြုချက်တွေအတွက် [State Structure ရွေးချယ်ခြင်း](/docs/react/choosing-the-state-structure) ကို ဖတ်ပါ။

#### React က ဘယ် state ကို ပြန်ပေးရမယ်ဆိုတာ ဘယ်လို သိလဲ

`useState` ခေါ်တာက — သူ ဘယ် state variable ကို ရည်ညွှန်းနေလဲဆိုတဲ့ အချက်အလက် ဘာမှ မလက်ခံတာကို သတိပြုမိပါလိမ့်မယ်။ `useState` ဆီ "identifier" တစ်ခု ပို့မထားဘူးဆိုရင် — သူက state variables တွေထဲက ဘယ်ဟာကို ပြန်ပေးရမယ်ဆိုတာ ဘယ်လို သိလဲ? သင့် functions တွေကို parse လုပ်တာလိုမျိုး magic တစ်ခုခုပေါ်မှာ မှီခိုနေတာလား? အဖြေက မဟုတ်ဘူးပါ။

အဲဒီအစား — သူတို့ရဲ့ ကျစ်လျစ်တဲ့ syntax ကို ဖြစ်နိုင်စေဖို့ — Hooks တွေက **component တစ်ခုတည်းရဲ့ render တိုင်းမှာ — တည်ငြိမ်တဲ့ call order ပေါ်မှာ** မှီခိုပါတယ်။ ဒါက လက်တွေ့မှာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ် — ဘာလို့လဲဆိုတော့ — အထက်က စည်းမျဉ်းကို ("Hooks တွေကို top level မှာပဲ ခေါ်ပါ") လိုက်နာရင် — Hooks တွေက အစဉ်တစ်ခုတည်းမှာ အမြဲတမ်း ခေါ်ခံရလို့ပါ။ ဒါ့အပြင် — [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) တစ်ခုက အမှား အများစုကို ဖမ်းမိပါတယ်။

အတွင်းပိုင်းမှာ — React က component တစ်ခုချင်းစီအတွက် — state pairs တွေရဲ့ array တစ်ခုကို ကိုင်ထားပါတယ်။ သူဟာ လက်ရှိ pair index ကိုလည်း ထိန်းသိမ်းထားပြီး — rendering မလုပ်ခင် `0` အဖြစ် သတ်မှတ်ပါတယ်။ `useState` ကို ခေါ်တိုင်း — React က နောက် state pair ကို ပေးပြီး — index ကို increment လုပ်ပါတယ်။ ဒီယန္တရားအကြောင်း [React Hooks: Not Magic, Just Arrays.](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) မှာ ပိုဖတ်နိုင်ပါတယ်။

ဒီဥပမာက **React ကို မသုံးပေမယ့်** — `useState` က အတွင်းပိုင်းမှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အကြံတစ်ခု ပေးပါတယ်:

```jsx
let componentHooks = [];
let currentHookIndex = 0;

// How useState works inside React (simplified).
// → React အတွင်းမှာ useState ဘယ်လို အလုပ်လုပ်လဲ (ရိုးရှင်းအောင် လုပ်ထားတာ)။
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // This is not the first render,
    // so the state pair already exists.
    // Return it and prepare for next Hook call.
    // → ဒါက ပထမဆုံး render မဟုတ်ဘူး၊
    // → ဒါကြောင့် state pair က ရှိပြီးသားပါ။
    // → သူ့ကို ပြန်ပေးပြီး နောက် Hook ခေါ်ဖို့ ပြင်ဆင်ပါ။
    currentHookIndex++;
    return pair;
  }

  // This is the first time we're rendering,
  // so create a state pair and store it.
  // → ဒါက ပထမဆုံးအကြိမ် render လုပ်တာမို့
  // → state pair တစ်ခု ဖန်တီးပြီး သိမ်းပါ။
  pair = [initialState, setState];

  function setState(nextState) {
    // When the user requests a state change,
    // put the new value into the pair.
    // → User က state ပြောင်းဖို့ တောင်းဆိုတဲ့အခါ
    // → တန်ဖိုးအသစ်ကို pair ထဲ ထည့်ပါ။
    pair[0] = nextState;
    updateDOM();
  }

  // Store the pair for future renders
  // and prepare for the next Hook call.
  // → နောင် renders တွေအတွက် pair ကို သိမ်းပြီး
  // → နောက် Hook ခေါ်ဖို့ ပြင်ဆင်ပါ။
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Each useState() call will get the next pair.
  // → useState() ခေါ်တိုင်း နောက် pair ကို ရပါလိမ့်မယ်။
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // This example doesn't use React, so
  // return an output object instead of JSX.
  // → ဒီဥပမာက React မသုံးလို့
  // → JSX အစား output object တစ်ခု ပြန်ပေးပါတယ်။
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Reset the current Hook index
  // before rendering the component.
  // → Component ကို render မလုပ်ခင်
  // → လက်ရှိ Hook index ကို ပြန်သတ်မှတ်ပါ။
  currentHookIndex = 0;
  let output = Gallery();

  // Update the DOM to match the output.
  // This is the part React does for you.
  // → output နဲ့ ကိုက်ညီအောင် DOM ကို update လုပ်ပါ။
  // → ဒါက React က သင့်အတွက် လုပ်ပေးတဲ့ အပိုင်းပါ။
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// Make UI match the initial state.
// → UI က ကနဦး state နဲ့ ကိုက်ညီအောင် လုပ်ပါ။
updateDOM();
```
```html
<button id="nextButton">
  Next
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```
```css
button { display: block; margin-bottom: 10px; }
```
React ကို သုံးဖို့ ဒါကို နားလည်စရာ မလိုပါဘူး — ဒါပေမယ့် — ဒါက အသုံးဝင်တဲ့ mental model တစ်ခု ဖြစ်နိုင်ပါတယ်။

## State က သီးခြားဖြစ်ပြီး Private ဖြစ်တယ်

State က screen ပေါ်က component instance တစ်ခုအတွက် local ဖြစ်ပါတယ်။ တစ်နည်းပြောရရင် — **component တစ်ခုတည်းကို နှစ်ကြိမ် render လုပ်ရင် — copy တစ်ခုချင်းစီမှာ လုံးဝ သီးခြားဖြစ်တဲ့ state ရှိပါလိမ့်မယ်!** တစ်ခုကို ပြောင်းလဲတာက နောက်တစ်ခုကို မထိခိုက်ပါဘူး။

ဒီဥပမာမှာ — အရင်က ပါခဲ့တဲ့ `Gallery` component ကို — logic ဘာမှ မပြောင်းဘဲ — နှစ်ကြိမ် render လုပ်ထားပါတယ်။ Gallery တစ်ခုချင်းစီထဲက buttons တွေကို နှိပ်ကြည့်ပါ။ သူတို့ရဲ့ state တွေ အမှီအခိုကင်းတာကို သတိပြုပါ:

```jsx
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}
```
```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </section>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```
ဒါက — state က — သင့် module ရဲ့ ထိပ်မှာ ကြေညာလေ့ရှိတဲ့ ပုံမှန် variables တွေနဲ့ ဘယ်လို ကွာခြားလဲဆိုတာပါ။ State က function call တစ်ခု ဒါမှမဟုတ် code ထဲက နေရာတစ်ခုနဲ့ ချိတ်ဆက်မထားဘဲ — screen ပေါ်က သီးခြားနေရာတစ်ခုအတွက် "local" ဖြစ်ပါတယ်။ သင် `<Gallery />` component နှစ်ခု render လုပ်ထားလို့ — သူတို့ရဲ့ state တွေက သီးခြား သိမ်းထားပါတယ်။

`Page` component က `Gallery` ရဲ့ state အကြောင်း ဒါမှမဟုတ် — state ရှိတယ်ဆိုတာတောင် — ဘာမှ "မသိ" ဘူးဆိုတာလည်း သတိပြုပါ။ Props တွေနဲ့ မတူဘဲ — **state က သူ့ကို ကြေညာတဲ့ component အတွက်ပဲ လုံးဝ private ပါ။** Parent component က သူ့ကို မပြောင်းလဲနိုင်ပါဘူး။ ဒါက — တခြား components တွေကို မထိခိုက်ဘဲ — component တစ်ခုခုကို state ထည့်နိုင်သလို ဖယ်လည်း ဖယ်နိုင်စေပါတယ်။

Gallery နှစ်ခုလုံးရဲ့ state တွေကို sync ဖြစ်နေအောင် ထားချင်တယ်ဆိုရင်ကော? React မှာ မှန်ကန်တဲ့ နည်းလမ်းက — child components တွေကနေ state ကို *ဖယ်ရှား* ပြီး — သူတို့နှစ်ခုလုံးရဲ့ အနီးဆုံး shared parent ဆီ ထည့်တာပါ။ နောက်စာမျက်နှာ အနည်းငယ်မှာ component တစ်ခုတည်းရဲ့ state ကို စုစည်းခြင်းအကြောင်း အာရုံစိုက်ပါမယ် — ဒါပေမယ့် — [Component များကြား State မျှဝေခြင်း](/docs/react/sharing-state-between-components) မှာ ဒီအကြောင်းကို ပြန်လာပါမယ်။

## အကျဉ်းချုပ်

- Component တစ်ခုက renders တွေကြားမှာ အချက်အလက် တစ်ချို့ကို "မှတ်မိ" ဖို့ လိုတဲ့အခါ — state variable တစ်ခုကို သုံးပါ။
- State variables တွေကို `useState` Hook ကို ခေါ်ခြင်းဖြင့် ကြေညာပါတယ်။
- Hooks တွေက `use` နဲ့ စတင်တဲ့ အထူး functions တွေပါ။ သူတို့က state လိုမျိုး React features တွေထဲကို "hook into" (ချိတ်ဝင်) ခွင့် ပေးပါတယ်။
- Hooks တွေက imports တွေကို သတိရစေနိုင်ပါတယ်: သူတို့ကို unconditional ခေါ်ရပါမယ်။ `useState` အပါအဝင် Hooks တွေကို ခေါ်တာက — component တစ်ခု ဒါမှမဟုတ် တခြား Hook တစ်ခုရဲ့ top level မှာပဲ ခွင့်ပြုပါတယ်။
- `useState` Hook က value တွဲတစ်ခုကို ပြန်ပေးပါတယ်: လက်ရှိ state နဲ့ သူ့ကို update လုပ်ဖို့ function ပါ။
- State variable တစ်ခုထက်ပို ရှိနိုင်ပါတယ်။ အတွင်းပိုင်းမှာ — React က သူတို့ကို order အလိုက် တွဲပေးပါတယ်။
- State က component အတွက် private ပါ။ နေရာ နှစ်နေရာမှာ render လုပ်ရင် — copy တစ်ခုချင်းစီက သူ့ကိုယ်ပိုင် state ရပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Gallery ကို ပြီးပြည့်စုံအောင် လုပ်ခြင်း

နောက်ဆုံး ပန်းပုရုပ်ပေါ်မှာ "Next" ကို နှိပ်လိုက်တဲ့အခါ — code က crash ဖြစ်ပါတယ်။ Crash မဖြစ်အောင် — logic ကို ပြုပြင်ပါ။ Event handler ထဲမှာ logic အပိုတစ်ခု ထည့်ခြင်း ဒါမှမဟုတ် — action မဖြစ်နိုင်တဲ့အခါ button ကို disable လုပ်ခြင်းဖြင့် လုပ်နိုင်ပါတယ်။

Crash ကို ပြုပြင်ပြီးတာနဲ့ — ယခင် ပန်းပုရုပ်ကို ပြတဲ့ "Previous" button တစ်ခု ထည့်ပါ။ ပထမ ပန်းပုရုပ်ပေါ်မှာတော့ crash မဖြစ်သင့်ပါဘူး။

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```
#### အဖြေ

ဒါက event handler နှစ်ခုလုံးအတွင်းမှာ — guard condition တစ်ခု ထည့်ပြီး — လိုအပ်တဲ့အခါ buttons တွေကို disable လုပ်ပါတယ်:

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```
```jsx
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```
```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```
`hasPrev` နဲ့ `hasNext` တွေကို — ပြန်ပေးတဲ့ JSX အတွက်ရော — event handlers တွေအတွင်းမှာပါ *နှစ်ခုလုံးမှာ* သုံးထားတာကို သတိပြုပါ! ဒီအဆင်ပြေတဲ့ ပုံစံက အလုပ်လုပ်တာက — event handler functions တွေက rendering လုပ်နေတုန်း ကြေညာထားတဲ့ variable တွေကို ["close over"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) လုပ်လို့ပါ။

### ပိတ်နေတဲ့ Form Input တွေကို ပြုပြင်ခြင်း

Input fields တွေထဲ ရိုက်ထည့်လိုက်တဲ့အခါ — ဘာမှ မပေါ်ပါဘူး။ Input တန်ဖိုးတွေက empty strings တွေနဲ့ "ပိတ်နေ" သလို ဖြစ်နေပါတယ်။ ပထမ `<input>` ရဲ့ `value` က `firstName` variable နဲ့ အမြဲတမ်း ကိုက်ညီအောင် သတ်မှတ်ထားပြီး — ဒုတိယ `<input>` ရဲ့ `value` က `lastName` variable နဲ့ အမြဲတမ်း ကိုက်ညီအောင် သတ်မှတ်ထားပါတယ်။ ဒါက မှန်ပါတယ်။ Input နှစ်ခုလုံးမှာ — နောက်ဆုံး user input (`e.target.value`) ကို အခြေခံပြီး variables တွေကို update လုပ်ဖို့ ကြိုးစားတဲ့ `onChange` event handlers တွေ ရှိပါတယ်။ ဒါပေမယ့် — variables တွေက re-renders တွေကြားမှာ သူတို့ရဲ့ တန်ဖိုးတွေကို "မှတ်မိ" ပုံ မပေါ်ပါဘူး။ State variables တွေကို သုံးခြင်းဖြင့် ပြုပြင်ပါ။

```jsx
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```
```css
h1 { margin-top: 10px; }
```
#### အဖြေ

ပထမဆုံး — React ကနေ `useState` ကို import လုပ်ပါ။ ပြီးရင် — `firstName` နဲ့ `lastName` တွေကို — `useState` ခေါ်ခြင်းဖြင့် ကြေညာထားတဲ့ state variables တွေနဲ့ အစားထိုးပါ။ နောက်ဆုံး — `firstName = ...` assignment တိုင်းကို `setFirstName(...)` နဲ့ အစားထိုးပြီး — `lastName` အတွက်လည်း အလားတူ လုပ်ပါ။ Reset button အလုပ်လုပ်ဖို့ — `handleReset` ကိုပါ update လုပ်ဖို့ မမေ့ပါနဲ့။

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```
```css
h1 { margin-top: 10px; }
```

### Crash တစ်ခုကို ပြုပြင်ခြင်း

ဒီမှာ user တစ်ယောက်က feedback ချန်ထားနိုင်ဖို့ ရည်ရွယ်ထားတဲ့ form ငယ်လေးတစ်ခု ရှိပါတယ်။ Feedback submit လုပ်လိုက်တဲ့အခါ — ကျေးဇူးတင်ကြောင်း message တစ်ခု ပြသဖို့ ရည်ရွယ်ပါတယ်။ ဒါပေမယ့် — "Rendered fewer hooks than expected" ဆိုတဲ့ error message နဲ့ crash ဖြစ်ပါတယ်။ အမှားကို ရှာတွေ့ပြီး — ပြုပြင်နိုင်ပါသလား?

> **အရိပ်အမြွက်:** Hooks တွေကို _ဘယ်နေရာမှာ_ ခေါ်လို့ရလဲဆိုတာနဲ့ ပတ်သက်ပြီး — ကန့်သတ်ချက်တွေ ရှိပါသလား? ဒီ component က စည်းမျဉ်း တစ်ခုခု ချိုးနေပါသလား? Linter စစ်ဆေးမှုတွေကို disable လုပ်ထားတဲ့ comments တွေ ရှိမရှိ စစ်ကြည့်ပါ — bug တွေ မကြာခဏ ပုန်းနေတာ အဲဒီနေရာတွေမှာပါ!

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```
#### အဖြေ

Hooks တွေကို component function ရဲ့ top level မှာပဲ ခေါ်လို့ရပါတယ်။ ဒီမှာ — ပထမ `isSent` definition က ဒီစည်းမျဉ်းကို လိုက်နာပေမယ့် — `message` definition က condition တစ်ခုထဲမှာ nested ဖြစ်နေပါတယ်။

ပြဿနာကို ဖြေရှင်းဖို့ — သူ့ကို condition ကနေ ထုတ်ယူပါ:

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```
သတိရပါ — Hooks တွေကို unconditional ခေါ်ရပြီး — အစဉ်တစ်ခုတည်းမှာ အမြဲတမ်း ခေါ်ရပါတယ်!

Nesting ကို လျှော့ချဖို့ — မလိုအပ်တဲ့ `else` branch ကိုလည်း ဖယ်ရှားနိုင်ပါတယ်။ ဒါပေမယ့် — Hooks တွေကို ခေါ်တာ အားလုံး — ပထမဆုံး `return` ရဲ့ *ရှေ့မှာ* ဖြစ်ဖို့က ဆဲဆဲ အရေးကြီးပါတယ်။

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```
ဒုတိယ `useState` ခေါ်တာကို `if` condition ရဲ့ နောက်ကို ရွှေ့ကြည့်ပြီး — ဒါက ဘယ်လို ပြန်ပျက်စေလဲ သတိပြုပါ။

သင့် linter က [React အတွက် configure](/docs/react/editor-setup#linting) လုပ်ထားရင် — ဒီလိုမျိုး အမှားတစ်ခု လုပ်မိတဲ့အခါ — lint error တစ်ခု မြင်ရပါလိမ့်မယ်။ Faulty code ကို locally စမ်းတဲ့အခါ error တစ်ခု မမြင်ရရင် — သင့် project အတွက် linting ကို setup လုပ်ဖို့ လိုပါတယ်။

### မလိုအပ်တဲ့ State ကို ဖယ်ရှားခြင်း

Button ကို နှိပ်လိုက်တဲ့အခါ — ဒီဥပမာက user ရဲ့ နာမည်ကို မေးပြီး — သူတို့ကို နှုတ်ဆက်တဲ့ alert တစ်ခု ပြသသင့်ပါတယ်။ နာမည်ကို ထိန်းသိမ်းဖို့ state ကို သုံးဖို့ ကြိုးစားခဲ့ပေမယ့် — တစ်ချို့ အကြောင်းရင်းကြောင့် — ပထမဆုံးအကြိမ်မှာ "Hello, !" ပြပြီး — နောက်တစ်ကြိမ်ကစပြီး — ယခင် input နဲ့ "Hello, [name]!" ဆိုပြီး ပြနေပါတယ်။

ဒီ code ကို ပြုပြင်ဖို့ — မလိုအပ်တဲ့ state variable ကို ဖယ်ရှားပါ။ (ဒါက [ဘာကြောင့် အလုပ်မလုပ်ခဲ့လဲ](/docs/react/state-snapshot) ဆိုတာကို နောက်ပိုင်းမှာ ဆွေးနွေးပါမယ်။)

ဒီ state variable က ဘာကြောင့် မလိုအပ်ခဲ့တာလဲ ရှင်းပြနိုင်ပါသလား?

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('What is your name?'));
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```
#### အဖြေ

ဒီမှာ လိုအပ်တဲ့ function ထဲမှာ ကြေညာထားတဲ့ ပုံမှန် `name` variable တစ်ခုကို သုံးထားတဲ့ — ပြုပြင်ထားတဲ့ version ပါ:

```jsx
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('What is your name?');
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```
State variable တစ်ခုက — component တစ်ခုရဲ့ re-renders တွေကြားမှာ အချက်အလက်တွေကို ထိန်းသိမ်းဖို့ပဲ လိုအပ်ပါတယ်။ Event handler တစ်ခုတည်းအတွင်းမှာဆိုရင် — ပုံမှန် variable တစ်ခုက လုံလောက်ပါတယ်။ ပုံမှန် variable တစ်ခုက ကောင်းကောင်း အလုပ်လုပ်နေတဲ့အခါ — state variables တွေကို မိတ်ဆက် မလုပ်ပါနဲ့။
