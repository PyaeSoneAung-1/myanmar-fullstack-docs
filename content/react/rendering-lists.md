---
title: "List များ Render လုပ်ခြင်း (Rendering Lists)"
description: "Data array တွေကနေ JavaScript ရဲ့ map() နဲ့ filter() သုံးပြီး component list တွေ render လုပ်ခြင်း — React key တွေ ဘယ်အချိန်၊ ဘာကြောင့် သုံးရလဲ"
order: 20
source: "https://react.dev/learn/rendering-lists"
status: translated
updated: 2026-09-01
---

Data collection တစ်ခုကနေ — ဆင်တူတဲ့ component အများအပြားကို မကြာခဏ ပြသချင်တတ်ပါတယ်။ Data array တစ်ခုကို ကိုင်တွယ်ဖို့ — [JavaScript array methods](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) တွေကို သုံးနိုင်ပါတယ်။ ဒီစာမျက်နှာမှာ — သင့် data array ကို component array အဖြစ် filter လုပ်ပြီး transform လုပ်ဖို့ — React နဲ့တွဲပြီး [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) နဲ့ [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) တွေကို သုံးပါမယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- JavaScript ရဲ့ `map()` ကို သုံးပြီး array တစ်ခုကနေ component တွေ ဘယ်လို render လုပ်မလဲ
- JavaScript ရဲ့ `filter()` ကို သုံးပြီး — component တိကျတဲ့ဟာတွေပဲ ဘယ်လို render လုပ်မလဲ
- React keys တွေကို ဘယ်အချိန်၊ ဘာကြောင့် သုံးမလဲ

## Array တွေကနေ Data Render လုပ်ခြင်း

သင့်မှာ content list တစ်ခု ရှိတယ်ဆိုပါစို့။

```jsx
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```
ဒီ list items တွေကြားမှာ တစ်ခုတည်းသော ကွာခြားချက်က — သူတို့ရဲ့ content တွေ၊ သူတို့ရဲ့ data တွေပါ။ Interface တွေ တည်ဆောက်တဲ့အခါ — comment list တွေကနေ profile image gallery တွေအထိ — component တစ်ခုတည်းရဲ့ instance အများအပြားကို data မတူညီတာတွေနဲ့ ပြသဖို့ မကြာခဏ လိုအပ်ပါတယ်။ ဒီလိုအခြေအနေတွေမှာ — အဲဒီ data တွေကို JavaScript objects တွေနဲ့ arrays တွေထဲ သိမ်းပြီး — သူတို့ကနေ component list တွေ render လုပ်ဖို့ [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) နဲ့ [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) လိုမျိုး methods တွေကို သုံးနိုင်ပါတယ်။

Array တစ်ခုကနေ item list တစ်ခု ထုတ်လုပ်နည်း ဥပမာ အတိုတစ်ခု ဒီမှာ ရှိပါတယ်:

1. Data ကို array တစ်ခုထဲ **ရွှေ့ပါ**:

```jsx
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```
2. `people` ရဲ့ အဖွဲ့ဝင်တွေကို — JSX nodes ရဲ့ array အသစ်တစ်ခု `listItems` ထဲ **map** လုပ်ပါ:

```jsx
const listItems = people.map(person => <li>{person}</li>);
```
3. သင့် component ကနေ `listItems` ကို `<ul>` ထဲ ထုပ်ပြီး **ပြန်ပေးပါ**:

```jsx
return <ul>{listItems}</ul>;
```
ရလဒ်က ဒီလိုပါ:

```jsx
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```
```css
li { margin-bottom: 10px; }
```
အထက်က sandbox က console error တစ်ခု ပြနေတာကို သတိပြုပါ:

> Warning: Each child in a list should have a unique "key" prop.

ဒီ error ကို ဘယ်လို ပြုပြင်ရမလဲဆိုတာ — ဒီစာမျက်နှာ နောက်ပိုင်းမှာ လေ့လာရပါမယ်။ အဲဒါကို မရောက်ခင် — သင့် data ကို structure နည်းနည်း ထပ်ထည့်ကြည့်ရအောင်။

## Item Array တွေကို Filter လုပ်ခြင်း

ဒီ data ကို ပိုပြီးတောင် structure လုပ်နိုင်ပါသေးတယ်။

```jsx
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```
profession က `'chemist'` ဖြစ်တဲ့ လူတွေကိုပဲ ပြချင်တယ်ဆိုပါစို့။ JavaScript ရဲ့ `filter()` method ကို သုံးပြီး — အဲဒီလူတွေကိုပဲ ပြန်ပေးနိုင်ပါတယ်။ ဒီ method က item array တစ်ခုကို ယူပြီး — သူတို့ကို "test" ( `true` ဒါမှမဟုတ် `false` ပြန်ပေးတဲ့ function တစ်ခု) ကနေ ဖြတ်သွားကာ — test ကို အောင်မြင်တဲ့ ( `true` ပြန်ခဲ့တဲ့) items တွေပဲ ပါတဲ့ array အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

သင် `profession` က `'chemist'` ဖြစ်တဲ့ items တွေပဲ လိုချင်ပါတယ်။ ဒီအတွက် "test" function က `(person) => person.profession === 'chemist'` ပုံစံ ဖြစ်ပါလိမ့်မယ်။ ဘယ်လို ပေါင်းစပ်လဲဆိုတာ ဒီမှာ ကြည့်ပါ:

1. `people` ပေါ်မှာ `person.profession === 'chemist'` နဲ့ filter လုပ်ပြီး — "chemist" လူတွေပဲ ပါတဲ့ array အသစ် `chemists` ကို **ဖန်တီးပါ**:

```jsx
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```
2. အခု `chemists` ပေါ်မှာ **map** လုပ်ပါ:

```jsx
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```
3. နောက်ဆုံး — သင့် component ကနေ `listItems` ကို **ပြန်ပေးပါ**:

```jsx
return <ul>{listItems}</ul>;
```
```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```
```jsx
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```
> **သတိပြုရန်:** Arrow functions တွေက `=>` ရဲ့ နောက်မှာ ရှိတဲ့ expression ကို implicitly return လုပ်ပါတယ် — ဒါကြောင့် — `return` statement တစ်ခု မလိုအပ်ခဲ့ပါဘူး:
>
> ```jsx
> const listItems = chemists.map(person =>
>   <li>...</li> // Implicit return! → မရေးထားဘဲ ပြန်ပေးတာ!
> );
> ```
>
> ဒါပေမယ့် — **သင့် `=>` ရဲ့ နောက်မှာ `{` curly brace တစ်ခု လိုက်နေရင် — `return` ကို ရှင်းလင်းစွာ ရေးရပါမယ်!**
>
> ```jsx
> const listItems = chemists.map(person => { // Curly brace
>   return <li>...</li>;
> });
> ```
>
> `=> {` ပါဝင်တဲ့ Arrow functions တွေကို ["block body"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) ရှိတယ်လို့ ဆိုပါတယ်။ သူတို့က line တစ်ကြောင်းထက် ပိုပြီး ရေးခွင့် ပေးပါတယ် — ဒါပေမယ့် — `return` statement ကို ကိုယ်တိုင် ရေးရပါတယ်။ မေ့သွားရင် — ဘာမှ ပြန်မပေးတော့ပါဘူး!

## `key` နဲ့ List Items တွေကို အစဉ်လိုက် ထားခြင်း

အထက်က sandbox တွေ အားလုံးက console ထဲမှာ error တစ်ခု ပြနေတာကို သတိပြုပါ:

> Warning: Each child in a list should have a unique "key" prop.

Array item တစ်ခုချင်းစီကို `key` တစ်ခု ပေးဖို့ လိုပါတယ် — အဲဒီ array ထဲက တခြား items တွေကြားမှာ သူ့ကို သီးသန့် ခွဲခြားသိနိုင်တဲ့ string ဒါမှမဟုတ် number တစ်ခုပါ:

```jsx
<li key={person.id}>...</li>
```
> **မှတ်ချက်:** `map()` ခေါ်တာတစ်ခုရဲ့ အတွင်းမှာ တိုက်ရိုက် ရှိတဲ့ JSX elements တွေက အမြဲတမ်း keys တွေ လိုပါတယ်!

Keys တွေက — component တစ်ခုချင်းစီက array item ဘယ်ဟာနဲ့ ကိုက်ညီတယ်ဆိုတာ React ကို ပြောပြပြီး — နောက်ပိုင်းမှာ သူတို့ကို တွဲဖက်နိုင်အောင် လုပ်ပေးပါတယ်။ သင့် array items တွေ — ရွေ့လျားနိုင်ရင် (sorting ကြောင့်လိုမျိုး)၊ ထည့်ခံရရင်၊ ဒါမှမဟုတ် ဖျက်ခံရရင် — ဒါက အရေးကြီးလာပါတယ်။ ကောင်းကောင်းရွေးထားတဲ့ `key` တစ်ခုက — ဘာတွေ အတိအကျ ဖြစ်ပျက်ခဲ့လဲဆိုတာ React က ဆင်ခြင်နိုင်ပြီး — DOM tree ကို မှန်ကန်တဲ့ updates တွေ လုပ်နိုင်အောင် ကူညီပါတယ်။

Keys တွေကို လိုအပ်သလို generate လုပ်မယ့်အစား — သင့် data ထဲမှာ ထည့်သွင်းထားသင့်ပါတယ်:

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```
```jsx
export const people = [{
  id: 0, // Used in JSX as a key → JSX ထဲမှာ key အဖြစ် သုံးပါတယ်
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key → JSX ထဲမှာ key အဖြစ် သုံးပါတယ်
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key → JSX ထဲမှာ key အဖြစ် သုံးပါတယ်
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key → JSX ထဲမှာ key အဖြစ် သုံးပါတယ်
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key → JSX ထဲမှာ key အဖြစ် သုံးပါတယ်
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

#### List Item တစ်ခုချင်းစီအတွက် DOM Node အများအပြား ပြသခြင်း

Item တစ်ခုချင်းစီက DOM node တစ်ခုတည်း မဟုတ်ဘဲ — အများအပြား render လုပ်ဖို့ လိုတဲ့အခါ ဘာလုပ်မလဲ?

တိုတောင်းတဲ့ [`<>...</>` Fragment](https://react.dev/reference/react/Fragment) syntax က key တစ်ခု ပို့ခွင့် မပေးလို့ — သူတို့ကို `<div>` တစ်ခုတည်းထဲ စုစည်းဖို့ ဒါမှမဟုတ် — နည်းနည်း ပိုရှည်ပြီး ပိုရှင်းလင်းတဲ့ [`<Fragment>` syntax](https://react.dev/reference/react/Fragment#rendering-a-list-of-fragments) ကို သုံးဖို့ လိုပါတယ်:

```jsx
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```
Fragments တွေက DOM ကနေ ပျောက်ကွယ်သွားလို့ — ဒါက `<h1>`၊ `<p>`၊ `<h1>`၊ `<p>` စသဖြင့် — flat list တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။

### သင့် `key` ကို ဘယ်ကနေ ရမလဲ

Data ရင်းမြစ် အမျိုးမျိုးက — keys တွေရဲ့ ရင်းမြစ် အမျိုးမျိုး ပေးပါတယ်:

- **Database ကနေ ရတဲ့ data:** သင့် data က database ကနေ လာရင် — database keys/IDs တွေကို သုံးနိုင်ပါတယ် — သူတို့က သဘာဝအတိုင်း unique ဖြစ်လို့ပါ။
- **Locally generate လုပ်ထားတဲ့ data:** သင့် data က locally generate လုပ်ပြီး သိမ်းဆည်းထားတာဆိုရင် (ဥပမာ — note-taking app ထဲက notes) — items တွေ ဖန်တီးတဲ့အခါ incrementing counter တစ်ခု၊ [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) ဒါမှမဟုတ် [`uuid`](https://www.npmjs.com/package/uuid) လိုမျိုး package တစ်ခုကို သုံးပါ။

### Keys တွေရဲ့ စည်းမျဉ်းတွေ

- **Keys တွေက siblings တွေကြားမှာ unique ဖြစ်ရပါမယ်။** ဒါပေမယ့် — _မတူညီတဲ့_ arrays တွေထဲက JSX nodes တွေအတွက် — keys တူတူ သုံးတာ အဆင်ပြေပါတယ်။
- **Keys တွေ မပြောင်းရပါဘူး** — ပြောင်းရင် သူတို့ရဲ့ ရည်ရွယ်ချက်ကို ပျက်ပြားစေပါတယ်! Rendering လုပ်နေတုန်း သူတို့ကို generate မလုပ်ပါနဲ့။

### React က ဘာကြောင့် Keys တွေ လိုအပ်တာလဲ

သင့် desktop ပေါ်က files တွေမှာ နာမည်တွေ မရှိဘူးဆိုပါစို့။ အဲဒီအစား — သူတို့ကို order အလိုက် ညွှန်းရမယ် — ပထမ file၊ ဒုတိယ file စသဖြင့်ပါ။ အကျင့်ရသွားနိုင်ပေမယ့် — file တစ်ခု ဖျက်လိုက်တာနဲ့ — ရှုပ်ထွေးသွားပါလိမ့်မယ်။ ဒုတိယ file က ပထမ file ဖြစ်သွားပြီး — တတိယ file က ဒုတိယ file ဖြစ်သွားမယ် စသဖြင့်ပါ။

Folder တစ်ခုထဲက file names တွေနဲ့ — array တစ်ခုထဲက JSX keys တွေက အလားတူ ရည်ရွယ်ချက်ကို ဆောင်ရွက်ပါတယ်။ သူတို့က item တစ်ခုကို သူ့ရဲ့ siblings တွေကြားမှာ သီးသန့် ခွဲခြားနိုင်စေပါတယ်။ ကောင်းကောင်းရွေးထားတဲ့ key တစ်ခုက — array အတွင်းက နေရာထက် — အချက်အလက် ပိုပေးပါတယ်။ _နေရာ_ က reordering ကြောင့် ပြောင်းသွားရင်တောင် — `key` က React ကို — item ကို သူ့ရဲ့ တည်ရှိမှု တစ်လျှောက်လုံး ခွဲခြားသိစေပါတယ်။

> **သတိပြုရန်:** Item တစ်ခုရဲ့ index ကို သူ့ရဲ့ key အဖြစ် သုံးဖို့ သွေးဆောင်ခံရနိုင်ပါတယ်။ တကယ်တော့ — `key` ကို လုံးဝ မသတ်မှတ်ရင် — React က အဲဒါကိုပဲ သုံးပါလိမ့်မယ်။ ဒါပေမယ့် — item တစ်ခု ထည့်ခံရရင်၊ ဖျက်ခံရရင်၊ ဒါမှမဟုတ် array က reorder ခံရရင် — items တွေ render ဖြစ်တဲ့ order က အချိန်နဲ့အမျှ ပြောင်းလဲသွားပါတယ်။ Index ကို key အဖြစ် သုံးတာက — သိမ်မွေ့ပြီး ရှုပ်ထွေးတဲ့ bug တွေကို မကြာခဏ ဖြစ်စေပါတယ်။
>
> အလားတူပဲ — `key={Math.random()}` နဲ့လိုမျိုး — keys တွေကို နေရာမှာ generate လည်း မလုပ်ပါနဲ့။ ဒါက renders တွေကြားမှာ keys တွေ ဘယ်တော့မှ ကိုက်ညီမှာ မဟုတ်တာကြောင့် — သင့် component တွေနဲ့ DOM အားလုံး — အချိန်တိုင်း ပြန်လည် ဖန်တီးခံရစေပါလိမ့်မယ်။ ဒါက နှေးရုံတင်မကဘဲ — list items အတွင်းက user input တွေကိုပါ ဆုံးရှုံးစေပါလိမ့်မယ်။ အဲဒီအစား — data ကို အခြေခံတဲ့ stable ID တစ်ခုကို သုံးပါ။
>
> သင့် component တွေက `key` ကို prop အဖြစ် လက်ခံရရှိမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။ ဒါကို React ကိုယ်တိုင်က hint တစ်ခုအနေနဲ့ပဲ သုံးပါတယ်။ သင့် component က ID တစ်ခု လိုအပ်ရင် — သီးခြား prop တစ်ခုအနေနဲ့ ပို့ပေးရပါမယ်: `<Profile key={id} userId={id} />`။

## အကျဉ်းချုပ်

ဒီစာမျက်နှာမှာ သင်လေ့လာခဲ့တာတွေ:

- Component တွေကနေ data တွေကို ထုတ်ပြီး — arrays နဲ့ objects လိုမျိုး data structures တွေထဲ ဘယ်လို ရွှေ့မလဲ
- JavaScript ရဲ့ `map()` နဲ့ ဆင်တူတဲ့ component အစုတစ်ခု ဘယ်လို ထုတ်လုပ်မလဲ
- JavaScript ရဲ့ `filter()` နဲ့ filter လုပ်ထားတဲ့ items တွေရဲ့ array တွေ ဘယ်လို ဖန်တီးမလဲ
- Collection တစ်ခုထဲက component တစ်ခုချင်းစီပေါ်မှာ `key` ကို ဘာကြောင့်၊ ဘယ်လို သတ်မှတ်မလဲ — ဒါမှ သူတို့ရဲ့ နေရာ ဒါမှမဟုတ် data ပြောင်းသွားရင်တောင် — React က တစ်ခုချင်းစီကို ခြေရာခံနိုင်မှာပါ။

## စိန်ခေါ်မှုများ (Challenges)

### List တစ်ခုကို နှစ်ပိုင်း ခွဲခြင်း

ဒီဥပမာက လူအားလုံးရဲ့ list တစ်ခုကို ပြပါတယ်။

လူတစ်ယောက် chemist လားဆိုတာ — `person.profession === 'chemist'` ဆိုပြီး စစ်ခြင်းဖြင့် — သိရှိနိုင်ပါတယ်။ **Chemists** နဲ့ **Everyone Else** ဆိုတဲ့ — list သီးခြား နှစ်ခုကို — တစ်ခုပြီးတစ်ခု ပြအောင် ပြောင်းပါ။

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```
```jsx
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```
#### အဖြေ

`filter()` ကို နှစ်ကြိမ် သုံးပြီး — array သီးခြား နှစ်ခု ဖန်တီးကာ — နှစ်ခုလုံးပေါ်မှာ `map` လုပ်နိုင်ပါတယ်:

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```
```jsx
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```
ဒီဖြေရှင်းနည်းမှာ — `map` ခေါ်တွေကို parent `<ul>` elements တွေထဲမှာ တိုက်ရိုက် inline ထည့်ထားပါတယ် — ဒါပေမယ့် — ပိုဖတ်ရလွယ်တယ်လို့ ထင်ရင် — သူတို့အတွက် variables တွေ မိတ်ဆက်နိုင်ပါတယ်။

Render လုပ်ထားတဲ့ list တွေကြားမှာ duplication နည်းနည်း ကျန်သေးပါတယ်။ ထပ်ပြီး — ထပ်တလဲလဲ ဖြစ်နေတဲ့ အပိုင်းတွေကို `<ListSection>` component တစ်ခုထဲ ထုတ်ယူနိုင်ပါတယ်:

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```
```jsx
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```
အရမ်း သေချာဖတ်တတ်တဲ့ စာဖတ်သူတစ်ယောက်က — `filter` ခေါ် နှစ်ခုနဲ့ — လူတစ်ယောက်ချင်းစီရဲ့ profession ကို နှစ်ကြိမ် စစ်နေတာကို သတိပြုမိပါလိမ့်မယ်။ Property တစ်ခုကို စစ်တာက အရမ်းမြန်လို့ — ဒီဥပမာမှာ အဆင်ပြေပါတယ်။ သင့် logic က ဒီထက် ပိုစျေးကြီးရင် — `filter` ခေါ်တွေ အစား — array တွေကို ကိုယ်တိုင် ဆောက်ပြီး လူတစ်ယောက်စီကို တစ်ခါပဲ စစ်တဲ့ loop တစ်ခုနဲ့ အစားထိုးနိုင်ပါတယ်။

တကယ်တော့ — `people` တွေ ဘယ်တော့မှ မပြောင်းရင် — ဒီ code ကို သင့် component ရဲ့ အပြင်ကို ရွှေ့နိုင်ပါတယ်။ React ရဲ့ ရှုထောင့်ကနေဆိုရင် — အရေးကြီးတာက — နောက်ဆုံးမှာ JSX nodes တွေရဲ့ array တစ်ခုကို သူ့ဆီ ပေးတာပဲ ဖြစ်ပါတယ်။ အဲဒီ array ကို သင်ဘယ်လို ထုတ်လုပ်လဲဆိုတာကို သူ ဂရုမစိုက်ပါဘူး:

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```
```jsx
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```
```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

### Component တစ်ခုအတွင်း Nested Lists

ဒီ array ကနေ recipe list တစ်ခု ဖန်တီးပါ! Array ထဲက recipe တစ်ခုချင်းစီအတွက် — သူ့ရဲ့ name ကို `<h2>` အနေနဲ့ ပြပြီး — သူ့ရဲ့ ingredients တွေကို `<ul>` တစ်ခုထဲမှာ စာရင်းပြုပါ။

> **အရိပ်အမြွက်:** ဒါက `map` ခေါ် မတူညီတာ နှစ်ခုကို nesting လုပ်ဖို့ လိုအပ်ပါလိမ့်မယ်။

```jsx
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```
```jsx
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```
#### အဖြေ

ဒါက ချဉ်းကပ်နိုင်တဲ့ နည်းလမ်းတစ်ခုပါ:

```jsx
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```
```jsx
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```
`recipes` တစ်ခုချင်းစီမှာ `id` field တစ်ခု ပါပြီးသားမို့ — အပြင်က loop က သူ့ရဲ့ `key` အတွက် အဲဒါကို သုံးပါတယ်။ Ingredients တွေပေါ်မှာ loop လုပ်ဖို့ သုံးလို့ရမယ့် ID တစ်ခု မရှိပါဘူး။ ဒါပေမယ့် — ingredient တစ်ခုတည်းက recipe တစ်ခုတည်းထဲမှာ နှစ်ကြိမ် စာရင်းမဝင်ဘူးလို့ ယူဆရတာ ကျိုးကြောင်းဆီလျော်တာမို့ — သူ့ရဲ့ name ကို `key` အဖြစ် သုံးနိုင်ပါတယ်။ တစ်နည်းအားဖြင့် — IDs တွေ ထည့်ဖို့ data structure ကို ပြောင်းနိုင်သလို — index ကို `key` အဖြစ်လည်း သုံးနိုင်ပါတယ် (ingredients တွေကို လုံခြုံစွာ reorder လုပ်လို့ မရတဲ့ သတိပေးချက်နဲ့ပါ)။

### List Item Component တစ်ခုကို ထုတ်ယူခြင်း

ဒီ `RecipeList` component ထဲမှာ — `map` ခေါ် nested နှစ်ခု ပါပါတယ်။ ရိုးရှင်းအောင် — `id`၊ `name` နဲ့ `ingredients` props တွေ လက်ခံတဲ့ `Recipe` component တစ်ခုကို — ဒီကနေ ထုတ်ယူပါ။ အပြင်က `key` ကို ဘယ်မှာ ထားမလဲ — ဘာကြောင့်လဲ?

```jsx
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```
```jsx
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```
#### အဖြေ

အပြင်က `map` ကနေ JSX ကို `Recipe` component အသစ်တစ်ခုထဲ copy-paste ပြီး — အဲဒီ JSX ကို ပြန်ပေးနိုင်ပါတယ်။ ပြီးရင် — `recipe.name` ကို `name` အဖြစ်၊ `recipe.id` ကို `id` အဖြစ် စသဖြင့် ပြောင်းပြီး — `Recipe` ဆီ props အဖြစ် ပို့နိုင်ပါတယ်:

```jsx
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```
```jsx
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```
ဒီမှာ — `<Recipe {...recipe} key={recipe.id} />` က — "`recipe` object ရဲ့ property တွေ အားလုံးကို `Recipe` component ဆီ props အဖြစ် ပို့ပါ" လို့ ဆိုလိုတဲ့ syntax shortcut တစ်ခုပါ။ Prop တစ်ခုချင်းစီကို ရှင်းလင်းစွာလည်း ရေးနိုင်ပါတယ်: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`။

**`key` ကို `Recipe` ရဲ့ root `<div>` ပေါ်မှာ မဟုတ်ဘဲ — `<Recipe>` ကိုယ်တိုင်ပေါ်မှာ သတ်မှတ်ထားတာကို သတိပြုပါ။** ဒါက ဒီ `key` ကို — ပတ်ဝန်းကျင်က array ရဲ့ context အတွင်းမှာ တိုက်ရိုက် လိုအပ်လို့ပါ။ အရင်က — သင့်မှာ `<div>` တွေရဲ့ array တစ်ခု ရှိခဲ့လို့ — တစ်ခုချင်းစီကို `key` လိုခဲ့ပါတယ် — ဒါပေမယ့် — အခုတော့ `<Recipe>` တွေရဲ့ array တစ်ခု ရှိနေပါပြီ။ တစ်နည်းပြောရရင် — component တစ်ခုကို ထုတ်ယူတဲ့အခါ — copy-paste လုပ်ထားတဲ့ JSX ရဲ့ အပြင်မှာ `key` ကို ထားဖို့ မမေ့ပါနဲ့။

### Separator ပါတဲ့ List

ဒီဥပမာက Tachibana Hokushi ရဲ့ နာမည်ကြီး haiku တစ်ပုဒ်ကို render လုပ်ပြီး — line တစ်ကြောင်းချင်းစီကို `<p>` tag တစ်ခုထဲ ထုပ်ထားပါတယ်။ သင့် အလုပ်က — paragraph တစ်ခုချင်းစီကြားမှာ `<hr />` separator တစ်ခု ထည့်ဖို့ပါ။ သင့် ရလဒ် structure က ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

```jsx
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```
Haiku တစ်ပုဒ်မှာ line သုံးကြောင်းပဲ ပါပေမယ့် — သင့် ဖြေရှင်းနည်းက line ဘယ်နှစ်ကြောင်းနဲ့မဆို အလုပ်လုပ်သင့်ပါတယ်။ `<hr />` elements တွေက `<p>` elements တွေကြားမှာပဲ ပေါ်ပြီး — အစမှာ ဒါမှမဟုတ် အဆုံးမှာ မပေါ်ဘူးဆိုတာ သတိပြုပါ!

```jsx
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```
```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```
(ဒါက index ကို key အဖြစ် သုံးတာ လက်ခံနိုင်တဲ့ ရှားပါးကိစ္စတစ်ခုပါ — ဘာလို့လဲဆိုတော့ — poem ရဲ့ lines တွေက ဘယ်တော့မှ reorder မဖြစ်လို့ပါ။)

> **အရိပ်အမြွက်:** `map` ကို manual loop တစ်ခုအဖြစ် ပြောင်းဖို့ ဒါမှမဟုတ် — Fragment တစ်ခု သုံးဖို့ လိုပါလိမ့်မယ်။

#### အဖြေ

`<hr />` နဲ့ `<p>...</p>` တွေကို output array ထဲ ထည့်သွင်းရင်း — manual loop တစ်ခု ရေးနိုင်ပါတယ်:

```jsx
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array → output array ကို ဖြည့်ပါ
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr /> → ပထမဆုံး <hr /> ကို ဖယ်ရှားပါ
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```
```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```
မူရင်း line index ကို `key` အဖြစ် သုံးတာ — အခု အလုပ်မလုပ်တော့ပါဘူး — ဘာလို့လဲဆိုတော့ — separator တစ်ခုချင်းစီနဲ့ paragraph တစ်ခုချင်းစီက အခု array တစ်ခုတည်းထဲမှာ ရှိနေလို့ပါ။ ဒါပေမယ့် — suffix တစ်ခုသုံးပြီး — တစ်ခုချင်းစီကို key သီးခြားစီ ပေးနိုင်ပါတယ် — ဥပမာ `key={i + '-text'}` လိုမျိုးပါ။

တစ်နည်းအားဖြင့် — `<hr />` နဲ့ `<p>...</p>` တွေ ပါဝင်တဲ့ Fragments တစ်စုကို render လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် — `<>...</>` shorthand syntax က keys တွေ ပို့ခွင့် မပေးလို့ — `<Fragment>` ကို ရှင်းလင်းစွာ ရေးရပါလိမ့်မယ်:

```jsx
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```
```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```
Fragments တွေ (မကြာခဏ `<> </>` လို့ ရေးတတ်တယ်) က — `<div>` တွေ ထပ်မထည့်ဘဲ — JSX nodes တွေကို စုစည်းခွင့် ပေးတယ်ဆိုတာ သတိရပါ!
