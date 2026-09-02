---
title: "State ထဲက Object Update လုပ်ခြင်း"
description: "React state ထဲက object တွေကို direct မပြောင်းဘဲ copy အသစ်ဖန်တီးပြီး update လုပ်ခြင်း — immutability၊ spread syntax၊ nested object update နဲ့ Immer အသုံးပြုနည်း"
order: 35
source: "https://react.dev/learn/updating-objects-in-state"
status: translated
updated: 2026-09-02
---

State ထဲမှာ JavaScript value အမျိုးအစား ဘယ်ဟာကိုမဆို — object တွေ အပါအဝင် — သိမ်းထားနိုင်ပါတယ်။ ဒါပေမယ့် — React state ထဲမှာ ထားထားတဲ့ object တွေကို တိုက်ရိုက် ပြောင်းလဲလို့ မရပါဘူး။ အဲဒီအစား — object တစ်ခုကို update လုပ်ချင်တဲ့အခါ — object အသစ်တစ်ခု ဖန်တီး (ဒါမှမဟုတ် ရှိပြီးသားတစ်ခုရဲ့ copy လုပ်) ပြီး — state ကို အဲဒီ copy သုံးဖို့ set လုပ်ရပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React state ထဲက object တစ်ခုကို မှန်ကန်စွာ update လုပ်နည်း
- Nested object တစ်ခုကို mutate မလုပ်ဘဲ update လုပ်နည်း
- Immutability ဆိုတာ ဘာလဲ၊ သူ့ကို ဘယ်လို မချိုးဖျက်ရဘူးဆိုတာ
- Immer နဲ့ object copying တွေကို ဘယ်လို ထပ်ခါထပ်ခါ ရေးနေစရာ မလိုအောင် လုပ်မလဲ

## Mutation ဆိုတာ ဘာလဲ

State ထဲမှာ JavaScript value ဘယ်အမျိုးအစားကိုမဆို သိမ်းနိုင်ပါတယ်။

```js
const [x, setX] = useState(0);
```

အခုထိ သင်က numbers၊ strings နဲ့ booleans တွေနဲ့ပဲ အလုပ်လုပ်ခဲ့ပါတယ်။ ဒီလို JavaScript value တွေက "immutable" — ဆိုလိုတာ မပြောင်းလဲနိုင်တဲ့ ဒါမှမဟုတ် "read-only" — ဖြစ်ပါတယ်။ Value တစ်ခုကို *အစားထိုး* ဖို့ re-render တစ်ခုကို trigger လုပ်နိုင်ပါတယ်:

```js
setX(5);
```

`x` state က `0` ကနေ `5` ကို ပြောင်းသွားပေမယ့် — *`0` ဆိုတဲ့ ဂဏန်းကိုယ်တိုင်တော့* မပြောင်းပါဘူး။ JavaScript မှာ numbers၊ strings၊ booleans လိုမျိုး built-in primitive values တွေကို ဘယ်လိုမှ ပြောင်းလဲလို့ မရနိုင်ပါဘူး။

အခု state ထဲက object တစ်ခုကို စဉ်းစားကြည့်ပါ:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

နည်းပညာအရ — *object ရဲ့ ကိုယ်ခန္ဓာတွင်းက* content တွေကို ပြောင်းလဲဖို့ ဖြစ်နိုင်ပါတယ်။ **ဒါကို mutation လို့ ခေါ်ပါတယ်:**

```js
position.x = 5;
```

ဒါပေမယ့် — React state ထဲက objects တွေက နည်းပညာအရ mutable ဖြစ်ပေမယ့် — သူတို့ကို numbers၊ booleans၊ strings တွေလိုပဲ **immutable ဖြစ်သလို** သဘောထားရပါမယ်။ Mutate လုပ်မယ့်အစား — သူတို့ကို အမြဲတမ်း အစားထိုးရပါတယ်။

## State ကို read-only အဖြစ် သဘောထားပါ

တစ်နည်းပြောရရင် — **state ထဲ ထည့်လိုက်တဲ့ JavaScript object တိုင်းကို read-only အဖြစ် သဘောထားရပါမယ်။**

ဒီဥပမာက — လက်ရှိ pointer ရဲ့ နေရာကို ကိုယ်စားပြုဖို့ — state ထဲမှာ object တစ်ခု ထားပါတယ်။ Preview area ပေါ်မှာ cursor ရွေ့တဲ့အခါ ဒါမှမဟုတ် ထိလိုက်တဲ့အခါ — အနီစက် ရွေ့ရမှာပါ။ ဒါပေမယ့် — စက်က ကနဦး နေရာမှာပဲ ရှိနေပါတယ်:

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

ပြဿနာက ဒီ code အပိုင်းမှာပါ။

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

ဒီ code က [ယခင် render တစ်ခုကနေ](/docs/react/state-snapshot) ရလာတဲ့ `position` ကို တာဝန်ပေးထားတဲ့ object ကို ပြုပြင်နေပါတယ်။ ဒါပေမယ့် — state setting function ကို မသုံးတာမို့ — object ပြောင်းသွားတာကို React က ဘာမှ မသိပါဘူး။ ဒါကြောင့် React က ဘာမှ တုံ့ပြန်မှု မလုပ်ပါဘူး။ ဒါက — ဟင်းကို စားပြီးသွားမှ — အစားအစာ ပြောင်းဖို့ ကြိုးစားသလိုမျိုးပါ။ State ကို mutate လုပ်တာက တစ်ချို့ကိစ္စတွေမှာ အလုပ်ဖြစ်နိုင်ပေမယ့် — အကြံမပြုပါဘူး။ Render တစ်ခုအတွင်း သင်လက်လှမ်းမီတဲ့ state value ကို read-only အဖြစ် သဘောထားသင့်ပါတယ်။

ဒီကိစ္စမှာ တကယ်တမ်း [re-render trigger လုပ်ဖို့](/docs/react/state-snapshot) — **object *အသစ်* တစ်ခု ဖန်တီးပြီး state setting function ဆီ ပို့ပေးပါ:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` နဲ့ — သင်က React ကို ပြောနေပါတယ်:

- `position` ကို ဒီ object အသစ်နဲ့ အစားထိုးပါ
- ပြီးတော့ ဒီ component ကို နောက်တစ်ကြိမ် render လုပ်ပါ

Preview area ပေါ်မှာ ထိလိုက်၊ hover လုပ်လိုက်တဲ့အခါ — အနီစက်က သင့် pointer နောက်ကို လိုက်သွားတာ သတိပြုပါ:

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

#### Local mutation က ရပါတယ်

ဒီလို code မျိုးက — state ထဲက object *အဟောင်း* တစ်ခုကို ပြုပြင်တာမို့ — ပြဿနာပါ:

```js
position.x = e.clientX;
position.y = e.clientY;
```

ဒါပေမယ့် — ဒီလို code မျိုးကတော့ — သင်က *ခုနက ဖန်တီးထားတဲ့* object အသစ်တစ်ခုကို mutate လုပ်နေတာမို့ — **လုံးဝ ရပါတယ်:**

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

တကယ်တော့ ဒါက ဒီလိုရေးတာနဲ့ လုံးဝ ညီမျှပါတယ်:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation က — state ထဲမှာ ရှိပြီးသား object *အဟောင်းတွေ* ကို ပြောင်းတဲ့အခါမှပဲ ပြဿနာ ဖြစ်ပါတယ်။ သင်ခုနက ဖန်တီးလိုက်တဲ့ object တစ်ခုကို mutate လုပ်တာက ရပါတယ် — ဘာလို့လဲဆိုတော့ *တခြား code ဘယ်ဟာကမှ သူ့ကို ရည်ညွှန်းထားသေးလို့ မဟုတ်လို့ပါ။* သူ့ကို ပြောင်းလိုက်တာက — သူ့အပေါ် မှီခိုနေတဲ့ တစ်ခုခုကို မတော်တဆ မထိခိုက်စေပါဘူး။ ဒါကို "local mutation" လို့ ခေါ်ပါတယ်။ [Rendering လုပ်နေစဉ်မှာတောင်](/docs/react/keeping-components-pure) local mutation လုပ်လို့ ရပါတယ်။ အရမ်းအဆင်ပြေပြီး — လုံးဝ ရပါတယ်!

## Spread syntax နဲ့ Object တွေကို Copy လုပ်ခြင်း

ယခင် ဥပမာမှာ — `position` object ကို လက်ရှိ cursor နေရာကနေ အမြဲ အသစ်ဖန်တီးပါတယ်။ ဒါပေမယ့် — သင်ဖန်တီးနေတဲ့ object အသစ်ထဲမှာ — *ရှိပြီးသား* data တစ်ချို့ ထည့်ချင်လေ့ ရှိပါတယ်။ ဥပမာ — form တစ်ခုထဲက field *တစ်ခုတည်း* ကိုပဲ update လုပ်ပြီး — ကျန် field တွေရဲ့ ယခင် တန်ဖိုးတွေကို ထိန်းထားချင်တာမျိုးပါ။

ဒီ input fields တွေက — `onChange` handlers တွေက state ကို mutate လုပ်နေလို့ — အလုပ်မလုပ်ပါဘူး:

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

ဥပမာ — ဒီ line က ယခင် render တစ်ခုကနေ ရလာတဲ့ state ကို mutate လုပ်ပါတယ်:

```js
person.firstName = e.target.value;
```

သင်လိုချင်တဲ့ အပြုအမူ ရဖို့ ယုံကြည်စိတ်ချရတဲ့ နည်းလမ်းက — object အသစ်တစ်ခု ဖန်တီးပြီး `setPerson` ဆီ ပို့ပေးတာပါ။ ဒါပေမယ့် — ဒီနေရာမှာ field တစ်ခုပဲ ပြောင်းတာမို့ — **ရှိပြီးသား data တွေကိုပါ ထဲထည့်ပြီး** copy လုပ်ချင်ပါတယ်:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

Property တစ်ခုချင်းစီကို သပ်သပ်စီ copy လုပ်စရာ မလိုအောင် — `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntax ကို သုံးနိုင်ပါတယ်။

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

အခုတော့ form က အလုပ်လုပ်ပါပြီ!

Input field တစ်ခုချင်းစီအတွက် state variable သပ်သပ် ကြေညာထားတာ မရှိတာ သတိပြုပါ။ Form ကြီးတွေအတွက် — data အားလုံးကို object တစ်ခုထဲ စုထားတာ အရမ်းအဆင်ပြေပါတယ် — မှန်ကန်စွာ update လုပ်နေသရွေ့ပေါ့!

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

`...` spread syntax က "shallow" — အဆင့်တစ်ဆင့်ပဲ နက်တယ် — ဆိုတာ သတိပြုပါ။ ဒါက မြန်ဆန်စေပေမယ့် — nested property တစ်ခုကို update လုပ်ချင်ရင် — သူ့ကို တစ်ကြိမ်ထက်ပိုပြီး သုံးရပါလိမ့်မယ်။

#### Field အများအပြားအတွက် Event Handler တစ်ခုတည်း သုံးခြင်း

သင့် object definition ထဲမှာ `[` နဲ့ `]` braces တွေကို သုံးပြီး — dynamic name ရှိတဲ့ property တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ ဒီမှာ — handler သုံးခု မတူညီတဲ့အစား event handler တစ်ခုတည်း သုံးထားတဲ့ — တူညီတဲ့ ဥပမာပါ:

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

ဒီနေရာမှာ — `e.target.name` က `<input>` DOM element ကို ပေးထားတဲ့ `name` property ကို ရည်ညွှန်းပါတယ်။

## Nested Object တစ်ခုကို Update လုပ်ခြင်း

ဒီလို nested object structure တစ်ခု ရှိတယ်ဆိုပါစို့:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city` ကို update လုပ်ချင်ရင် — mutation နဲ့ လုပ်နည်းက ရှင်းပါတယ်:

```js
person.artwork.city = 'New Delhi';
```

ဒါပေမယ့် — React မှာ state ကို immutable အဖြစ် သဘောထားရပါတယ်! `city` ကို ပြောင်းဖို့ — ပထမဆုံး `artwork` object အသစ် (ယခင် object ထဲက data တွေနဲ့ ကြိုဖြည့်ထားတဲ့) ကို ထုတ်လုပ်ပြီး — ပြီးမှ `artwork` အသစ်ကို ညွှန်တဲ့ `person` object အသစ်ကို ထုတ်လုပ်ရပါတယ်:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

ဒါမှမဟုတ် — function call တစ်ခုတည်းအနေနဲ့ ရေးရင်:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

ဒါက နည်းနည်း ရှည်လျားလာပေမယ့် — ကိစ္စ အများစုမှာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်:

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

#### Objects တွေက တကယ်တော့ Nested မဟုတ်ပါဘူး

ဒီလို object တစ်ခုက code ထဲမှာ "nested" ဖြစ်နေပုံ ရပါတယ်:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
};
```

ဒါပေမယ့် — "nesting" ဆိုတဲ့ တွေးခေါ်ပုံက object တွေရဲ့ အပြုအမူကို နားလည်ဖို့ တိကျမှု မရှိပါဘူး။ Code အလုပ်လုပ်တဲ့အခါ — "nested" object ဆိုတာမျိုး မရှိပါဘူး။ တကယ်တော့ သင်က object မတူညီတဲ့ နှစ်ခုကို ကြည့်နေတာပါ:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` object က `obj2` ရဲ့ "အတွင်းမှာ" မဟုတ်ပါဘူး။ ဥပမာ — `obj3` ကလည်း `obj1` ကို "ညွှန်" နိုင်ပါတယ်:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

`obj3.artwork.city` ကို mutate လုပ်ရင် — `obj2.artwork.city` ရော `obj1.city` ပါ ထိခိုက်ပါလိမ့်မယ်။ ဘာလို့လဲဆိုတော့ — `obj3.artwork`၊ `obj2.artwork` နဲ့ `obj1` တွေက object တစ်ခုတည်း ဖြစ်လို့ပါ။ Objects တွေကို "nested" လို့ တွေးတဲ့အခါ ဒါကို မြင်ရခက်ပါတယ်။ တကယ်တော့ သူတို့က properties တွေနဲ့ တစ်ခုကိုတစ်ခု "ညွှန်ပြနေတဲ့" object တွေ သပ်သပ်စီပါ။

### Immer နဲ့ Update Logic ကို ကျစ်လျစ်အောင် ရေးခြင်း

သင့် state က နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်နေရင် — [သူ့ကို ပြားအောင် (flatten) လုပ်ဖို့](/docs/react/choosing-the-state-structure) စဉ်းစားသင့်ပါတယ်။ ဒါပေမယ့် — state structure ကို မပြောင်းချင်ဘူးဆိုရင် — nested spreads တွေ ရေးနေရတာထက် shortcut တစ်ခုကို ပိုကြိုက်နိုင်ပါတယ်။ [Immer](https://github.com/immerjs/use-immer) က လူကြိုက်များတဲ့ library တစ်ခုဖြစ်ပြီး — အဆင်ပြေပေမယ့် mutating ဖြစ်တဲ့ syntax နဲ့ ရေးခွင့်ပေးပြီး — copies တွေ ထုတ်လုပ်ပေးတာကို ကိုယ်တိုင် လုပ်ပေးပါတယ်။ Immer နဲ့ — သင်ရေးတဲ့ code က — object တစ်ခုကို mutate လုပ်ပြီး "စည်းမျဉ်းတွေ ချိုးနေသလို" ပုံပေါက်ပါတယ်:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

ဒါပေမယ့် — ပုံမှန် mutation နဲ့ မတူဘဲ — ဒါက ယခင် state ကို မဖျက်ဆီးပါဘူး!

#### Immer က ဘယ်လို အလုပ်လုပ်လဲ

Immer က ပေးတဲ့ `draft` က — [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) လို့ခေါ်တဲ့ အထူး object အမျိုးအစားတစ်ခုဖြစ်ပြီး — သူ့ပေါ်မှာ သင်ဘာတွေ လုပ်လဲဆိုတာကို "မှတ်တမ်းတင်" ပါတယ်။ ဒါကြောင့်ပဲ — သူ့ကို ကြိုက်သလောက် လွတ်လွတ်လပ်လပ် mutate လုပ်လို့ ရတာပါ! အတွင်းပိုင်းမှာ — Immer က `draft` ရဲ့ ဘယ်အပိုင်းတွေ ပြောင်းသွားလဲဆိုတာ ရှာဖွေပြီး — သင့်ပြင်ဆင်မှုတွေ ပါဝင်တဲ့ object အသစ်တစ်ခုလုံးကို ထုတ်လုပ်ပေးပါတယ်။

Immer ကို စမ်းသုံးဖို့:

1. `npm install use-immer` ကို run ပြီး — Immer ကို dependency အဖြစ် ထည့်ပါ
2. ပြီးရင် `import { useState } from 'react'` ကို `import { useImmer } from 'use-immer'` နဲ့ အစားထိုးပါ

အထက်က ဥပမာကို Immer နဲ့ ပြောင်းထားတာက ဒီမှာပါ:

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

Event handlers တွေ ဘယ်လောက် ကျစ်လျစ်သွားလဲ သတိပြုပါ။ Component တစ်ခုထဲမှာ `useState` နဲ့ `useImmer` ကို ကြိုက်သလောက် ရောသုံးနိုင်ပါတယ်။ Immer က — update handlers တွေကို ကျစ်လျစ်အောင် ထားဖို့ ကောင်းမွန်တဲ့ နည်းလမ်းပါ — အထူးသဖြင့် state ထဲမှာ nesting ရှိပြီး — object copying တွေက ထပ်ခါထပ်ခါ ရေးနေရတဲ့အခါမျိုးမှာပေါ့။

#### React မှာ State Mutation ကို ဘာကြောင့် မထောက်ခံတာလဲ

အကြောင်းရင်း အနည်းငယ် ရှိပါတယ်:

- **Debugging:** သင်က `console.log` သုံးပြီး state ကို mutate မလုပ်ဘူးဆိုရင် — သင့် log အဟောင်းတွေက နောက်ပိုင်း state အပြောင်းအလဲတွေကြောင့် မပျက်စီးသွားပါဘူး။ ဒါကြောင့် renders တွေကြားမှာ state ဘယ်လို ပြောင်းလဲသွားလဲဆိုတာ ရှင်းရှင်းလင်းလင်း မြင်ရပါတယ်။
- **Optimizations:** React ရဲ့ သာမန် [optimization strategies](https://react.dev/reference/react/memo) တွေက — ယခင် props ဒါမှမဟုတ် state နဲ့ နောက်တစ်ခု တူရင် အလုပ်ကို ကျော်သွားတာပေါ်မှာ မှီခိုပါတယ်။ State ကို ဘယ်တော့မှ mutate မလုပ်ဘူးဆိုရင် — ပြောင်းလဲမှု ရှိ/မရှိ စစ်တာ အရမ်းမြန်ပါတယ်။ `prevObj === obj` ဆိုရင် — သူ့အတွင်းမှာ ဘာမှ ပြောင်းလဲလို့ မရနိုင်ဘူးဆိုတာ သေချာနိုင်ပါတယ်။
- **New Features:** ကျွန်တော်တို့ တည်ဆောက်နေတဲ့ React feature အသစ်တွေက — state ကို [snapshot တစ်ခုလို သဘောထားတာ](/docs/react/use-state) ပေါ်မှာ မှီခိုပါတယ်။ State ရဲ့ ယခင် version တွေကို mutate လုပ်နေရင် — feature အသစ်တွေ သုံးဖို့ တားဆီးခံရနိုင်ပါတယ်။
- **Requirement Changes:** Undo/Redo လုပ်တာ၊ အပြောင်းအလဲ မှတ်တမ်း ပြတာ၊ form တစ်ခုကို ယခင် တန်ဖိုးတွေဆီ ပြန်လည် သတ်မှတ်ခွင့်ပေးတာလိုမျိုး application feature တချို့က — ဘာမှ mutate မလုပ်တဲ့အခါ ပိုလွယ်ကူပါတယ်။ ဘာလို့လဲဆိုတော့ — state ရဲ့ ယခင် copies တွေကို memory ထဲမှာ ထားပြီး — သင့်တော်တဲ့အခါ ပြန်သုံးလို့ရလို့ပါ။ Mutative နည်းလမ်းနဲ့ စရေးထားရင် — ဒီလို features တွေ နောက်မှ ထည့်ဖို့ ခက်ခဲနိုင်ပါတယ်။
- **ပိုရိုးရှင်းတဲ့ Implementation:** React က mutation ပေါ်မှာ မမှီခိုလို့ — သင့် objects တွေအတွက် အထူးတစ်ခုခု လုပ်စရာ မလိုပါဘူး။ သူတို့ရဲ့ properties တွေကို သိမ်းယူစရာ၊ Proxies တွေနဲ့ အမြဲ ထုပ်စရာ၊ "reactive" ဖြေရှင်းနည်း အများစုလိုမျိုး initialization မှာ တခြားအလုပ်တွေ လုပ်စရာ မလိုပါဘူး။ ဒါကြောင့်လည်း — React က object ဘယ်လောက်ကြီးကြီးပဲ ဖြစ်ဖြစ် — performance ဒါမှမဟုတ် correctness ဆိုတဲ့ နောက်ဆက်တွဲ ပြဿနာတွေ မရှိဘဲ — state ထဲမှာ ထည့်ခွင့်ပေးတာပါ။

လက်တွေ့မှာ — React မှာ state ကို mutate လုပ်ပြီး မကြာခဏ "လွတ်သွား" နိုင်ပေမယ့် — ဒီချဉ်းကပ်နည်းကို ရည်ရွယ်ပြီး တည်ဆောက်ထားတဲ့ React feature အသစ်တွေ သုံးနိုင်ဖို့ — အဲဒီလို မလုပ်ဖို့ အခိုင်အမာ အကြံပြုပါတယ်။ နောင် contributors တွေရော — ဖြစ်နိုင်ရင် နောင်က သင်ကိုယ်တိုင်ပါ — ကျေးဇူးတင်ပါလိမ့်မယ်!

## အကျဉ်းချုပ်

- React ထဲက state အားလုံးကို immutable အဖြစ် သဘောထားပါ။
- State ထဲမှာ objects တွေ သိမ်းထားတဲ့အခါ — သူတို့ကို mutate လုပ်တာက renders တွေကို trigger မလုပ်ဘဲ — ယခင် render "snapshots" တွေထဲက state ကို ပြောင်းလဲပစ်ပါတယ်။
- Object တစ်ခုကို mutate လုပ်မယ့်အစား — သူ့ရဲ့ *version အသစ်* တစ်ခု ဖန်တီးပြီး — state ကို အဲဒါနဲ့ set ကာ re-render trigger လုပ်ပါ။
- Object တွေရဲ့ copies တွေ ဖန်တီးဖို့ `{...obj, something: 'newValue'}` object spread syntax ကို သုံးနိုင်ပါတယ်။
- Spread syntax က shallow ပါ: အဆင့်တစ်ဆင့်ပဲ နက်ပါတယ်။
- Nested object တစ်ခုကို update လုပ်ဖို့ — သင်ပြောင်းတဲ့ နေရာကနေ အပေါ်ဆုံးအထိ — copies တွေ ဖန်တီးရပါတယ်။
- ထပ်ခါထပ်ခါ copy လုပ်နေရတာတွေ လျှော့ချဖို့ — Immer ကို သုံးပါ။

## စိန်ခေါ်မှုများ (Challenges)

### State Updates မှားနေတာတွေကို ပြုပြင်ခြင်း

ဒီ form မှာ bug အနည်းငယ် ရှိပါတယ်။ Score တိုးစေတဲ့ button ကို နှစ်ချက် သုံးချက် နှိပ်ကြည့်ပါ။ Score မတိုးတာ သတိပြုပါ။ ပြီးရင် — first name ကို edit လုပ်ကြည့်ရင် — score က ရုတ်တရက် သင့်ပြောင်းလဲမှုတွေနဲ့ "အမီလိုက်လာ" တာ သတိပြုပါ။ နောက်ဆုံး — last name ကို edit လုပ်ကြည့်ရင် — score က လုံးဝ ပျောက်သွားတာ သတိပြုပါ။

သင့်တာဝန်က bug တွေ အားလုံးကို ပြုပြင်ဖို့ပါ။ ပြုပြင်ရင်း — တစ်ခုချင်းစီ ဘာကြောင့် ဖြစ်ရလဲဆိုတာ ရှင်းပြပါ။

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

#### အဖြေ

Bug နှစ်ခုလုံး ပြုပြင်ပြီးသား version က ဒီမှာပါ:

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

`handlePlusClick` ရဲ့ ပြဿနာက — သူက `player` object ကို mutate လုပ်ခဲ့တာပါ။ ရလဒ်အနေနဲ့ — re-render လုပ်ဖို့ အကြောင်းရင်း ရှိတာကို React က မသိခဲ့လို့ — screen ပေါ်က score ကို update မလုပ်ခဲ့ပါဘူး။ ဒါကြောင့်ပဲ — first name ကို edit လုပ်တဲ့အခါ — state က update ဖြစ်ပြီး — re-render trigger ဖြစ်ကာ — screen ပေါ်က score ကိုပါ *update* လုပ်လိုက်တာပါ။

`handleLastNameChange` ရဲ့ ပြဿနာက — သူက object အသစ်ထဲကို ရှိပြီးသား `...player` fields တွေကို copy မလုပ်ခဲ့တာပါ။ ဒါကြောင့်ပဲ — last name ကို edit ပြီးတဲ့အခါ score ပျောက်သွားတာပါ။

### Mutation ကို ရှာပြီး ပြုပြင်ခြင်း

Static နောက်ခံတစ်ခုပေါ်မှာ ဆွဲယူလို့ရတဲ့ (draggable) box တစ်ခု ရှိပါတယ်။ Select input ကို သုံးပြီး box ရဲ့ အရောင်ကို ပြောင်းနိုင်ပါတယ်။

ဒါပေမယ့် — bug တစ်ခု ရှိပါတယ်။ Box ကို အရင်ရွှေ့ပြီးမှ — အရောင်ပြောင်းကြည့်ရင် — (မရွေ့သင့်တဲ့!) နောက်ခံက box ရဲ့ နေရာဆီ "ခုန်ကူး" သွားပါတယ်။ ဒါ မဖြစ်သင့်ပါဘူး: `Background` ရဲ့ `position` prop ကို — `{ x: 0, y: 0 }` ဖြစ်တဲ့ `initialPosition` နဲ့ set ထားတာပါ။ အရောင်ပြောင်းပြီးမှ နောက်ခံ ဘာကြောင့် ရွေ့သွားတာလဲ?

Bug ကို ရှာပြီး ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** တစ်ခုခု မထင်မှတ်ဘဲ ပြောင်းသွားရင် — mutation ရှိနေတာပါ။ `App.js` ထဲက mutation ကို ရှာပြီး ပြုပြင်ပါ။

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

#### အဖြေ

ပြဿနာက `handleMove` ထဲက mutation မှာပါ။ သူက `shape.position` ကို mutate လုပ်ခဲ့ပေမယ့် — အဲဒါက `initialPosition` ညွှန်နေတဲ့ object တစ်ခုတည်းပါ။ ဒါကြောင့်ပဲ shape ရော background ပါ ရွေ့သွားတာပါ။ (ဒါက mutation ဖြစ်လို့ — မသက်ဆိုင်တဲ့ update တစ်ခု — အရောင်ပြောင်းတာ — re-render trigger လုပ်တဲ့အထိ — ပြောင်းလဲမှုက screen ပေါ် မပေါ်ပါဘူး။)

ပြုပြင်နည်းက — `handleMove` ထဲက mutation ကို ဖယ်ပြီး — shape ကို copy လုပ်ဖို့ spread syntax သုံးတာပါ။ `+=` က mutation တစ်ခုမို့ — ပုံမှန် `+` operation သုံးအောင် ပြန်ရေးဖို့ လိုတာ သတိပြုပါ။

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

### Object တစ်ခုကို Immer နဲ့ Update လုပ်ခြင်း

ဒါက ယခင် challenge ကနဲ့ တူညီတဲ့ bug ရှိတဲ့ ဥပမာပါ။ ဒီတစ်ခါ — Immer ကို သုံးပြီး mutation ကို ပြုပြင်ပါ။ သင့်အတွက် အဆင်ပြေအောင် — `useImmer` ကို ကြိုပြီး import ထားပြီးသားမို့ — `shape` state variable ကို သူ့ကို သုံးဖို့ ပြောင်းလဲရပါမယ်။

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

ဒါက Immer နဲ့ ပြန်ရေးထားတဲ့ အဖြေပါ။ Event handlers တွေကို mutating ပုံစံနဲ့ ရေးထားပေမယ့် — bug မဖြစ်တော့တာ သတိပြုပါ။ ဒါက — အတွင်းပိုင်းမှာ — Immer က ရှိပြီးသား objects တွေကို ဘယ်တော့မှ mutate မလုပ်လို့ပါ။

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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
