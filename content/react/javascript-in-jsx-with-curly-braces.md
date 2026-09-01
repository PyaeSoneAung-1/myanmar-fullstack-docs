---
title: "Curly Braces များဖြင့် JSX ထဲ JavaScript ရေးခြင်း (JavaScript in JSX with Curly Braces)"
description: "JSX ထဲမှာ curly braces ({}) သုံးပြီး string, variable, function call နဲ့ object တွေကို ထည့်သုံးနည်း — quotes တွေနဲ့ \"double curlies\" အပါအဝင်"
order: 26
source: "https://react.dev/learn/javascript-in-jsx-with-curly-braces"
status: translated
updated: 2026-09-01
---

JSX က JavaScript file တစ်ခုထဲမှာ — HTML နဲ့ဆင်တဲ့ markup ကို ရေးခွင့် ပေးပြီး — rendering logic နဲ့ content တွေကို နေရာတစ်ခုတည်းမှာ ထားနိုင်စေပါတယ်။ တစ်ခါတစ်ရံ — အဲဒီ markup ထဲမှာ JavaScript logic နည်းနည်း ထည့်ချင်တာ ဒါမှမဟုတ် dynamic property တစ်ခုကို ကိုးကားချင်တာ ဖြစ်တတ်ပါတယ်။ ဒီလိုအခြေအနေမှာ — JSX ထဲမှာ curly braces တွေကို သုံးပြီး — JavaScript ဆီ ပြတင်းပေါက် (window) တစ်ခု ဖွင့်နိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Quotes တွေနဲ့ string တွေကို ဘယ်လို ပို့မလဲ
- JSX ထဲမှာ curly braces တွေနဲ့ JavaScript variable တစ်ခုကို ဘယ်လို ကိုးကားမလဲ
- JSX ထဲမှာ curly braces တွေနဲ့ JavaScript function တစ်ခုကို ဘယ်လို ခေါ်မလဲ
- JSX ထဲမှာ curly braces တွေနဲ့ JavaScript object တစ်ခုကို ဘယ်လို သုံးမလဲ

## Quotes တွေနဲ့ String တွေကို ပို့ခြင်း

JSX ထဲက attribute တစ်ခုဆီ string တစ်ခု ပို့ချင်တဲ့အခါ — single ဒါမှမဟုတ် double quotes တွေထဲမှာ ထည့်ပါတယ်:

```jsx
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```
```css
.avatar { border-radius: 50%; height: 90px; }
```
ဒီမှာ — `"https://react.dev/images/docs/scientists/7vQD0fPs.jpg"` နဲ့ `"Gregorio Y. Zara"` တို့ကို string တွေအဖြစ် ပို့ထားပါတယ်။

ဒါပေမယ့် — `src` ဒါမှမဟုတ် `alt` text ကို dynamic ဖြစ်အောင် သတ်မှတ်ချင်တယ်ဆိုရင်ကော? **`"` နဲ့ `"` အစား `{` နဲ့ `}` တွေကို သုံးပြီး — JavaScript ကနေ value တစ်ခုကို သုံးနိုင်ပါတယ်**:

```jsx
export default function Avatar() {
  const avatar = 'https://react.dev/images/docs/scientists/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```
```css
.avatar { border-radius: 50%; height: 90px; }
```
`className="avatar"` — ပုံကို ဝိုင်းစေတဲ့ `"avatar"` CSS class name ကို သတ်မှတ်တာနဲ့ — `src={avatar}` — `avatar` လို့ ခေါ်တဲ့ JavaScript variable ရဲ့ တန်ဖိုးကို ဖတ်တာ — ကြားက ကွာခြားချက်ကို သတိပြုပါ။ ဒါက curly braces တွေက သင့် markup ထဲမှာ JavaScript နဲ့ အလုပ်လုပ်ခွင့် ပေးလို့ပါ!

## Curly Braces သုံးခြင်း — JavaScript လောကဆီ ပြတင်းပေါက်တစ်ခု

JSX က JavaScript ရေးနည်း အထူးတစ်မျိုးပါ။ ဆိုလိုတာက — curly braces `{ }` တွေနဲ့ — သူ့အတွင်းမှာ JavaScript သုံးဖို့ ဖြစ်နိုင်ပါတယ်။ အောက်က ဥပမာက — သိပ္ပံပညာရှင်ရဲ့ နာမည်ကို `name` ဆိုပြီး ပထမဆုံး ကြေညာပြီး — `<h1>` အတွင်းမှာ curly braces တွေနဲ့ ထည့်သွင်းပါတယ်:

```jsx
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```
`name` ရဲ့ တန်ဖိုးကို `'Gregorio Y. Zara'` ကနေ `'Hedy Lamarr'` အဖြစ် ပြောင်းကြည့်ပါ။ List ရဲ့ ခေါင်းစဉ် ပြောင်းသွားတာကို သတိပြုမိပါလား?

JavaScript expression တိုင်းက curly braces တွေကြားမှာ အလုပ်လုပ်ပါတယ် — `formatDate()` လိုမျိုး function call တွေ အပါအဝင်ပါ:

```jsx
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

### Curly Braces တွေကို ဘယ်မှာ သုံးမလဲ

JSX အတွင်းမှာ curly braces တွေကို နည်း နှစ်မျိုးပဲ သုံးနိုင်ပါတယ်:

1. **Text အဖြစ်** — JSX tag တစ်ခုရဲ့ အတွင်းမှာ တိုက်ရိုက်: `<h1>{name}'s To Do List</h1>` က အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` ကတော့ မလုပ်ပါဘူး။
2. **Attributes အဖြစ်** — `=` sign ရဲ့ နောက်မှာ ချက်ချင်း: `src={avatar}` က `avatar` variable ကို ဖတ်ပါတယ် — ဒါပေမယ့် `src="{avatar}"` ကတော့ `"{avatar}"` ဆိုတဲ့ string ကိုပဲ ပို့ပါတယ်။

## "Double Curlies" သုံးခြင်း — JSX ထဲ CSS နဲ့ တခြား Object တွေ

String တွေ၊ number တွေနဲ့ တခြား JavaScript expression တွေ အပြင် — JSX ထဲမှာ object တွေကိုပါ ပို့နိုင်ပါတယ်။ Object တွေကိုလည်း curly braces တွေနဲ့ပဲ ဖော်ပြတာမို့ — `{ name: "Hedy Lamarr", inventions: 5 }` လိုမျိုး ဖြစ်ပါတယ်။ ဒါကြောင့် — JSX ထဲမှာ JS object တစ်ခုကို ပို့ဖို့ — object ကို curly braces တစ်စုံ ထပ်ပြီး ထုပ်ပေးရပါတယ်: `person={{ name: "Hedy Lamarr", inventions: 5 }}`။

ဒါကို JSX ထဲက inline CSS styles တွေမှာ တွေ့ရတတ်ပါတယ်။ React က inline styles တွေကို သုံးဖို့ မတောင်းဆိုပါဘူး (CSS classes တွေက ကိစ္စ အများစုအတွက် ကောင်းကောင်း အလုပ်လုပ်ပါတယ်)။ ဒါပေမယ့် — inline style တစ်ခု လိုအပ်တဲ့အခါ — `style` attribute ဆီ object တစ်ခုကို ပို့ပါတယ်:

```jsx
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```
```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```
`backgroundColor` နဲ့ `color` တန်ဖိုးတွေကို ပြောင်းကြည့်ပါ။

ဒီလိုမျိုး ရေးလိုက်တဲ့အခါ — curly braces တွေရဲ့ အတွင်းမှာ JavaScript object ကို တကယ်မြင်ရပါတယ်:

```jsx
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```
နောက်တစ်ခါ JSX ထဲမှာ `{{` နဲ့ `}}` တွေ့ရင် — အဲဒါက JSX curlies အတွင်းမှာ ဝှက်ထားတဲ့ JavaScript object တစ်ခုပဲ ဆိုတာ သိထားပါ!

> **သတိပြုရန်:** Inline `style` properties တွေကို camelCase နဲ့ ရေးပါတယ်။ ဥပမာ — HTML `<ul style="background-color: black">` ကို သင့် component ထဲမှာ `<ul style={{ backgroundColor: 'black' }}>` လို့ ရေးရပါတယ်။

## JavaScript Object တွေနဲ့ Curly Braces တွေနဲ့ ပိုပျော်စရာကောင်းအောင်

Expression အများအပြားကို object တစ်ခုထဲ ရွှေ့ပြီး — သင့် JSX ထဲမှာ curly braces တွေအတွင်းက ကိုးကားနိုင်ပါတယ်:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```
ဒီဥပမာမှာ — `person` JavaScript object ထဲမှာ `name` string တစ်ခုနဲ့ `theme` object တစ်ခု ပါပါတယ်:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```
Component က ဒီတန်ဖိုးတွေကို `person` ကနေ ဒီလိုမျိုး သုံးနိုင်ပါတယ်:

```jsx
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```
JSX က templating language တစ်ခုအနေနဲ့ အရမ်း minimal ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ — data နဲ့ logic တွေကို JavaScript သုံးပြီး စုစည်းနိုင်လို့ပါ။

## အကျဉ်းချုပ်

အခု JSX အကြောင်း အကုန်နီးပါး သိပြီပဲ ဖြစ်ပါတယ်:

- Quotes အတွင်းက JSX attributes တွေကို string တွေအနေနဲ့ ပို့ပါတယ်။
- Curly braces တွေက JavaScript logic နဲ့ variable တွေကို သင့် markup ထဲ ယူဆောင်လာနိုင်စေပါတယ်။
- သူတို့က JSX tag content အတွင်းမှာ ဒါမှမဟုတ် attributes တွေရဲ့ `=` နောက်မှာ ချက်ချင်း အလုပ်လုပ်ပါတယ်။
- `{{` နဲ့ `}}` က အထူး syntax မဟုတ်ပါဘူး: အဲဒါက JSX curly braces အတွင်းမှာ ဝှက်ထားတဲ့ JavaScript object တစ်ခုပါ။

## စိန်ခေါ်မှုများ (Challenges)

### အမှားကို ပြုပြင်ခြင်း (Fix the Mistake)

ဒီ code က `Objects are not valid as a React child` ဆိုတဲ့ error နဲ့ crash ဖြစ်ပါတယ်:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```
ပြဿနာကို ရှာတွေ့ပါသလား?

> **အရိပ်အမြွက်:** Curly braces တွေရဲ့ အတွင်းမှာ ဘာရှိနေလဲ ကြည့်ပါ။ အဲဒီနေရာမှာ မှန်ကန်တဲ့အရာကို ထည့်ထားပါသလား?

#### အဖြေ

ဒါ ဖြစ်တာက — ဒီဥပမာက markup ထဲမှာ string တစ်ခု အစား *object ကိုယ်တိုင်ကို* render လုပ်နေလို့ပါ: `<h1>{person}'s Todos</h1>` က `person` object တစ်ခုလုံးကို render လုပ်ဖို့ ကြိုးစားနေတာပါ! Object အကြမ်းတွေကို text content အဖြစ် ထည့်သွင်းတာက error တစ်ခု ဖြစ်စေပါတယ် — ဘာလို့လဲဆိုတော့ — သူတို့ကို ဘယ်လို ပြသချင်လဲဆိုတာ React က မသိလို့ပါ။

ဒါကို ပြုပြင်ဖို့ — `<h1>{person}'s Todos</h1>` ကို `<h1>{person.name}'s Todos</h1>` နဲ့ အစားထိုးပါ:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

### အချက်အလက်တွေကို Object တစ်ခုထဲ ထုတ်ယူခြင်း (Extract Information Into an Object)

Image URL ကို `person` object ထဲ ထုတ်ယူထည့်ပါ။

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```
#### အဖြေ

Image URL ကို `person.imageUrl` လို့ ခေါ်တဲ့ property တစ်ခုထဲ ရွှေ့ပြီး — `<img>` tag ကနေ curlies တွေနဲ့ ဖတ်ပါ:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

### JSX Curly Braces အတွင်းမှာ Expression တစ်ခု ရေးခြင်း (Write an Expression Inside JSX Curly Braces)

အောက်က object မှာ — image URL အပြည့်အစုံကို အပိုင်း လေးပိုင်း ခွဲထားပါတယ်: base URL၊ `imageId`၊ `imageSize` နဲ့ file extension တို့ပါ။

ကျွန်တော်တို့ လိုချင်တာက — image URL က ဒီ attribute တွေကို ပေါင်းစပ်ဖို့ပါ: base URL (အမြဲတမ်း `'https://react.dev/images/docs/scientists/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) နဲ့ file extension (အမြဲတမ်း `'.jpg'`)။ ဒါပေမယ့် — `<img>` tag က သူ့ရဲ့ `src` ကို သတ်မှတ်ပုံမှာ တစ်ခုခု မှားနေပါတယ်။

ဒါကို ပြုပြင်နိုင်ပါသလား?

```jsx
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```
သင့် ပြုပြင်မှု အလုပ်ဖြစ်မဖြစ် စစ်ကြည့်ဖို့ — `imageSize` ရဲ့ တန်ဖိုးကို `'b'` အဖြစ် ပြောင်းကြည့်ပါ။ သင် edit လုပ်ပြီးတာနဲ့ image က size ပြောင်းသင့်ပါတယ်။

#### အဖြေ

ဒါကို `src={baseUrl + person.imageId + person.imageSize + '.jpg'}` လို့ ရေးနိုင်ပါတယ်။

1. `{` က JavaScript expression ကို ဖွင့်ပါတယ်
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` က မှန်ကန်တဲ့ URL string ကို ထုတ်ပေးပါတယ်
3. `}` က JavaScript expression ကို ပိတ်ပါတယ်

```jsx
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```
ဒီ expression ကို အောက်က `getImageUrl` လိုမျိုး — function တစ်ခုသီးခြားထဲကိုလည်း ရွှေ့နိုင်ပါတယ်:

```jsx
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```
```jsx
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```
```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```
Variable တွေနဲ့ function တွေက markup ကို ရိုးရှင်းအောင် ထိန်းသိမ်းဖို့ ကူညီပေးနိုင်ပါတယ်!
