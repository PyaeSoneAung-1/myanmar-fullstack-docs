---
title: "အခြေအနေအလိုက် Render လုပ်ခြင်း (Conditional Rendering)"
description: "if ကြေညာချက်တွေ၊ && နဲ့ ? : operator တွေလိုမျိုး JavaScript syntax သုံးပြီး — အခြေအနေ အမျိုးမျိုးပေါ်မူတည်ကာ JSX ကို အခြေအနေအလိုက် render လုပ်ခြင်း"
order: 19
source: "https://react.dev/learn/conditional-rendering"
status: translated
updated: 2026-09-01
---

သင့် component တွေက အခြေအနေ အမျိုးမျိုးပေါ်မူတည်ပြီး — မတူညီတဲ့ အရာတွေကို ပြသဖို့ မကြာခဏ လိုအပ်ပါတယ်။ React မှာ — `if` ကြေညာချက်တွေ၊ `&&` နဲ့ `? :` operator တွေလိုမျိုး — JavaScript syntax သုံးပြီး JSX ကို အခြေအနေအလိုက် render လုပ်နိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- အခြေအနေတစ်ခုပေါ်မူတည်ပြီး JSX အမျိုးမျိုးကို ဘယ်လို ပြန်ပေးမလဲ
- JSX အပိုင်းတစ်ပိုင်းကို အခြေအနေအလိုက် ထည့်သွင်း ဒါမှမဟုတ် ဖယ်ထုတ်နည်း
- React codebase တွေမှာ ကြုံရလေ့ရှိတဲ့ conditional syntax shortcuts တွေ

## JSX ကို အခြေအနေအလိုက် ပြန်ပေးခြင်း

`Item` တချို့ကို render လုပ်တဲ့ `PackingList` component တစ်ခု ရှိတယ်ဆိုပါစို့ — Item တွေက packed ဖြစ်/မဖြစ် အမှတ်အသား လုပ်ထားနိုင်ပါတယ်:

```jsx
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
`Item` component တချို့ရဲ့ `isPacked` prop က `false` အစား `true` ဖြစ်နေတာကို သတိပြုပါ။ `isPacked={true}` ဖြစ်တဲ့ item တွေအတွက် checkmark (✅) တစ်ခု ထည့်ချင်ပါတယ်။

ဒါကို [`if`/`else` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) အနေနဲ့ ဒီလိုမျိုး ရေးနိုင်ပါတယ်:

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```
`isPacked` prop က `true` ဆိုရင် — ဒီ code က **မတူညီတဲ့ JSX tree တစ်ခုကို ပြန်ပေးပါတယ်။** ဒီပြောင်းလဲမှုနဲ့ဆို — item တချို့ရဲ့ အဆုံးမှာ checkmark ရှိလာပါလိမ့်မယ်:

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
ကိစ္စတစ်ခုချင်းစီမှာ ဘာပြန်ပေးလဲဆိုတာကို edit လုပ်ပြီး — ရလဒ် ဘယ်လို ပြောင်းလဲလဲ ကြည့်ပါ!

JavaScript ရဲ့ `if` နဲ့ `return` statements တွေနဲ့ — branch logic တွေ ဖန်တီးနေတာကို သတိပြုပါ။ React မှာ — control flow (condition တွေလိုမျိုး) ကို JavaScript က ကိုင်တွယ်ပါတယ်။

### `null` နဲ့ ဘာမှ မပြန်ပေးခြင်း

အခြေအနေ တချို့မှာ — ဘာမှ လုံးဝ render မလုပ်ချင်တာမျိုး ရှိနိုင်ပါတယ်။ ဥပမာ — packed ဖြစ်နေတဲ့ item တွေကို လုံးဝ မပြချင်ဘူးဆိုပါစို့။ Component တစ်ခုက တစ်ခုခုတော့ ပြန်ပေးရပါတယ်။ ဒီကိစ္စမှာ — `null` ကို ပြန်ပေးနိုင်ပါတယ်:

```jsx
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```
`isPacked` က true ဆိုရင် — component က ဘာမှ မပြန်ပါဘူး — `null` ပါ။ မဟုတ်ရင် — render လုပ်ဖို့ JSX ကို ပြန်ပေးပါတယ်။

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
လက်တွေ့မှာ — component တစ်ခုကနေ `null` ပြန်ပေးတာက အသုံးမများပါဘူး — ဘာလို့လဲဆိုတော့ — သူ့ကို render လုပ်ဖို့ ကြိုးစားတဲ့ developer တစ်ယောက်ကို အံ့သြစေနိုင်လို့ပါ။ ပိုပြီး မကြာခဏဆိုရင် — parent component ရဲ့ JSX ထဲမှာ component ကို အခြေအနေအလိုက် ထည့်သွင်း ဒါမှမဟုတ် ဖယ်ထုတ်ပါလိမ့်မယ်။ အဲဒါ ဘယ်လို လုပ်လဲ ကြည့်ရအောင်!

## JSX ကို အခြေအနေအလိုက် ထည့်သွင်းခြင်း

ယခင် ဥပမာမှာ — component က ဘယ် (ရှိမယ်ဆိုရင်!) JSX tree ကို ပြန်ပေးမလဲဆိုတာ သင်ထိန်းချုပ်ခဲ့ပါတယ်။ Render output ထဲမှာ duplication တချို့ ရှိနေတာကို သင်သတိပြုမိပြီးသား ဖြစ်နိုင်ပါတယ်:

```jsx
<li className="item">{name} ✅</li>
```
ဒါက ဒါနဲ့ အရမ်းဆင်ပါတယ်:

```jsx
<li className="item">{name}</li>
```
Conditional branch နှစ်ခုလုံးက `<li className="item">...</li>` ကို ပြန်ပေးပါတယ်:

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```
ဒီ duplication က အန္တရာယ် မရှိပေမယ့် — သင့် code ကို ထိန်းသိမ်းဖို့ ပိုခက်စေနိုင်ပါတယ်။ `className` ကို ပြောင်းချင်တယ်ဆိုရင်ကော? သင့် code ထဲမှာ နေရာ နှစ်နေရာ ပြောင်းရပါလိမ့်မယ်! ဒီလိုအခြေအနေမှာ — သင့် code ကို ပိုပြီး [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ဖြစ်အောင် — JSX နည်းနည်းကို အခြေအနေအလိုက် ထည့်သွင်းနိုင်ပါတယ်။

### Conditional (ternary) Operator (`? :`)

JavaScript မှာ conditional expression တစ်ခုကို ရေးဖို့ — ကျစ်လျစ်တဲ့ syntax တစ်ခု ရှိပါတယ် — [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) ဒါမှမဟုတ် "ternary operator" ပါ။

ဒါမျိုး အစား:

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```
ဒီလို ရေးနိုင်ပါတယ်:

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```
ဒါကို *"`isPacked` က true ဆိုရင်၊ (`?`) `name + ' ✅'` ကို render လုပ်ပြီး — မဟုတ်ရင် (`:`) `name` ကို render လုပ်ပါ"* လို့ ဖတ်နိုင်ပါတယ်။

#### ဒီဥပမာ နှစ်ခုက လုံးဝ ညီမျှသလား

Object-oriented programming နောက်ခံကနေ လာတယ်ဆိုရင် — အထက်က ဥပမာ နှစ်ခုက `<li>` ရဲ့ "instance" မတူညီတာ နှစ်ခုကို ဖန်တီးနိုင်တာမို့ — သိမ်မွေ့စွာ ကွာခြားတယ်လို့ သင်ထင်ကောင်း ထင်နိုင်ပါတယ်။ ဒါပေမယ့် — JSX elements တွေက "instances" မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ — သူတို့မှာ internal state မရှိဘူး၊ တကယ့် DOM nodes တွေလည်း မဟုတ်လို့ပါ။ သူတို့က blueprints (ပုံစံပုံကြမ်း) တွေလိုမျိုး — ပေါ့ပါးတဲ့ ဖော်ပြချက်တွေပါ။ ဒါကြောင့် — ဒီဥပမာ နှစ်ခုက တကယ်တော့ *လုံးဝ* ညီမျှပါတယ်။ [State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း](/docs/react/preserving-and-resetting-state) က ဒါ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ အသေးစိတ် ရှင်းပြထားပါတယ်။

အခု — ပြီးစီးသွားတဲ့ item ရဲ့ text ကို `<del>` လိုမျိုး တခြား HTML tag တစ်ခုထဲ ထုပ်ပြီး — ဖြတ်မျဉ်းကြောင်းနဲ့ ပြချင်တယ်ဆိုပါစို့။ ကိစ္စတစ်ခုချင်းစီမှာ JSX တွေ ပိုပြီး nested လုပ်ရလွယ်ကူအောင် — newlines နဲ့ parentheses တွေ ထပ်ထည့်နိုင်ပါတယ်:

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
ဒီ style က ရိုးရှင်းတဲ့ conditions တွေအတွက် ကောင်းကောင်း အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် အလွန်အကျွံတော့ မသုံးပါနဲ့။ သင့် component တွေက nested conditional markup တွေ အရမ်းများလို့ ရှုပ်ပွနေရင် — သန့်ရှင်းအောင် child components တွေ ထုတ်ယူဖို့ စဉ်းစားပါ။ React မှာ — markup က သင့် code ရဲ့ အစိတ်အပိုင်းတစ်ခုဖြစ်လို့ — ရှုပ်ထွေးတဲ့ expressions တွေကို စနစ်တကျ လုပ်ဖို့ variables နဲ့ functions လိုမျိုး tools တွေကို သုံးနိုင်ပါတယ်။

### Logical AND Operator (`&&`)

ကြုံရလေ့ရှိတဲ့ နောက်ထပ် shortcut တစ်ခုက [JavaScript logical AND (`&&`) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) ပါ။ React component တွေအတွင်းမှာ — condition က true ဖြစ်တဲ့အခါ JSX တစ်ချို့ကို render လုပ်ချင်ပြီး — **မဟုတ်ရင် ဘာမှ render မလုပ်ချင်တဲ့အခါ** မကြာခဏ ပေါ်လာပါတယ်။ `&&` နဲ့ဆိုရင် — `isPacked` က `true` ဖြစ်မှသာ checkmark ကို အခြေအနေအလိုက် render လုပ်နိုင်ပါတယ်:

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```
ဒါကို *"`isPacked` ဆိုရင် (`&&`) checkmark ကို render လုပ်ပြီး — မဟုတ်ရင် ဘာမှ မလုပ်ပါ"* လို့ ဖတ်နိုင်ပါတယ်။

လက်တွေ့ အသုံးပြုပုံ:

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
[JavaScript && expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) တစ်ခုက — ဘယ်ဘက် (ကျွန်တော်တို့ရဲ့ condition) က `true` ဖြစ်ရင် — ညာဘက်ခြမ်း (ကျွန်တော်တို့ ကိစ္စမှာ checkmark) ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။ ဒါပေမယ့် — condition က `false` ဆိုရင် — expression တစ်ခုလုံးက `false` ဖြစ်သွားပါတယ်။ React က `false` ကို — `null` ဒါမှမဟုတ် `undefined` လိုမျိုးပဲ — JSX tree ထဲက "အပေါက် (hole)" တစ်ခုအဖြစ် သတ်မှတ်ပြီး — အဲဒီနေရာမှာ ဘာမှ render မလုပ်ပါဘူး။

> **သတိပြုရန်:** **`&&` ရဲ့ ဘယ်ဘက်မှာ numbers တွေကို မထားပါနဲ့။**
>
> Condition ကို စစ်ဆေးဖို့ — JavaScript က ဘယ်ဘက်ခြမ်းကို boolean အဖြစ် အလိုအလျောက် ပြောင်းပါတယ်။ ဒါပေမယ့် — ဘယ်ဘက်ခြမ်းက `0` ဆိုရင် — expression တစ်ခုလုံးက အဲဒီတန်ဖိုး (`0`) ကို ရပြီး — React က ဘာမှ မလုပ်မယ့်အစား — `0` ကိုပဲ ဝမ်းသာအားရ render လုပ်ပါလိမ့်မယ်။
>
> ဥပမာ — `messageCount && <p>New messages</p>` လိုမျိုး code ရေးတာက အဖြစ်များတဲ့ အမှားတစ်ခုပါ။ `messageCount` က `0` ဖြစ်ရင် ဘာမှ render မလုပ်ဘူးလို့ အလွယ်တကူ ထင်စရာ ရှိပေမယ့် — တကယ်တော့ `0` ကိုယ်တိုင် render ဖြစ်ပါတယ်!
>
> ပြုပြင်ဖို့ — ဘယ်ဘက်ခြမ်းကို boolean ဖြစ်အောင် လုပ်ပါ: `messageCount > 0 && <p>New messages</p>`။

### JSX ကို Variable တစ်ခုဆီ အခြေအနေအလိုက် သတ်မှတ်ခြင်း

Shortcuts တွေက ရိုးရိုး code ရေးတာကို အနှောင့်အယှက် ဖြစ်စေတဲ့အခါ — `if` statement နဲ့ variable တစ်ခုကို သုံးကြည့်ပါ။ [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) နဲ့ သတ်မှတ်ထားတဲ့ variables တွေကို ပြန်သတ်မှတ်လို့ရတာမို့ — စတင်ဖို့ — ပြသချင်တဲ့ default content ဖြစ်တဲ့ name ကို ပေးလိုက်ပါ:

```jsx
let itemContent = name;
```
`isPacked` က `true` ဆိုရင် — `itemContent` ဆီ JSX expression တစ်ခုကို ပြန်သတ်မှတ်ဖို့ `if` statement တစ်ခု သုံးပါ:

```jsx
if (isPacked) {
  itemContent = name + " ✅";
}
```
[Curly braces တွေက "JavaScript ဆီ ပြတင်းပေါက်" ကို ဖွင့်ပေးပါတယ်။](/docs/react/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) ပြန်ပေးတဲ့ JSX tree ထဲမှာ variable ကို curly braces တွေနဲ့ ထည့်ပြီး — အရင်က တွက်ထားတဲ့ expression ကို JSX အတွင်းမှာ nesting လုပ်ပါ:

```jsx
<li className="item">
  {itemContent}
</li>
```
ဒီ style က အရှည်ဆုံး ဖြစ်ပေမယ့် — အပြောင်းလွယ်ဆုံးလည်း ဖြစ်ပါတယ်။ လက်တွေ့ အသုံးပြုပုံ:

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
အရင်ကလိုပဲ — ဒါက text အတွက်ပဲ မဟုတ်ဘဲ — ကြိုက်သလို JSX တွေအတွက်ပါ အလုပ်လုပ်ပါတယ်:

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
JavaScript ကို မရင်းနှီးသေးရင် — ဒီ style အမျိုးမျိုးက အစပိုင်းမှာ လွှမ်းမိုးနေသလို ခံစားရနိုင်ပါတယ်။ ဒါပေမယ့် — ဒါတွေကို လေ့လာထားတာက — React components တွေတင်မကဘဲ — JavaScript code အားလုံးကို ဖတ်နိုင်၊ ရေးနိုင်အောင် ကူညီပေးပါလိမ့်မယ်! စတင်ဖို့ သင် ကြိုက်တဲ့ နည်းတစ်ခုကို ရွေးပြီး — တခြားဟာတွေ ဘယ်လို အလုပ်လုပ်လဲ မေ့သွားရင် ဒီ reference ကို ပြန်ကြည့်ပါ။

## အကျဉ်းချုပ်

- React မှာ — သင်က branching logic တွေကို JavaScript နဲ့ ထိန်းချုပ်ပါတယ်။
- `if` statement တစ်ခုနဲ့ JSX expression တစ်ခုကို အခြေအနေအလိုက် ပြန်ပေးနိုင်ပါတယ်။
- JSX တစ်ချို့ကို variable တစ်ခုဆီ အခြေအနေအလိုက် သိမ်းပြီး — curly braces တွေနဲ့ တခြား JSX အတွင်းမှာ ထည့်သွင်းနိုင်ပါတယ်။
- JSX ထဲမှာ `{cond ? <A /> : <B />}` ဆိုတာ *"`cond` ဆိုရင် `<A />` ကို render လုပ်ပြီး — မဟုတ်ရင် `<B />` ကို render လုပ်ပါ"* လို့ အဓိပ္ပါယ် ရပါတယ်။
- JSX ထဲမှာ `{cond && <A />}` ဆိုတာ *"`cond` ဆိုရင် `<A />` ကို render လုပ်ပြီး — မဟုတ်ရင် ဘာမှ မလုပ်ပါ"* လို့ အဓိပ္ပါယ် ရပါတယ်။
- Shortcuts တွေက အသုံးများပေမယ့် — သင်က ရိုးရိုး `if` ကို ကြိုက်ရင် သုံးစရာ မလိုပါဘူး။

## စိန်ခေါ်မှုများ (Challenges)

### `? :` နဲ့ မပြည့်စုံတဲ့ Item တွေအတွက် Icon တစ်ခု ပြခြင်း

`isPacked` က `true` မဟုတ်ရင် ❌ ကို render လုပ်ဖို့ — conditional operator (`cond ? a : b`) ကို သုံးပါ။

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
#### အဖြေ

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

### `&&` နဲ့ Item ရဲ့ အရေးပါမှုကို ပြခြင်း

ဒီဥပမာမှာ — `Item` တစ်ခုချင်းစီက numerical `importance` prop တစ်ခု လက်ခံပါတယ်။ `&&` operator ကို သုံးပြီး — non-zero importance ရှိတဲ့ item တွေအတွက်သာ — "(Importance: X)" ကို italic နဲ့ render လုပ်ပါ။ သင့် item list က ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

- Space suit _(Importance: 9)_
- Helmet with a golden leaf
- Photo of Tam _(Importance: 6)_

Label နှစ်ခုကြားမှာ space တစ်ခု ထည့်ဖို့ မမေ့ပါနဲ့!

```jsx
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
#### အဖြေ

ဒါက အလုပ်ဖြစ်စေမယ့် နည်းလမ်းပါ:

```jsx
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```
`importance && ...` အစား — `importance > 0 && ...` လို့ ရေးရမယ်ဆိုတာ သတိပြုပါ — ဒါမှ `importance` က `0` ဆိုရင် — ရလဒ်အနေနဲ့ `0` ကို render မလုပ်ဖြစ်တော့မှာပါ!

ဒီဖြေရှင်းနည်းမှာ — name နဲ့ importance label ကြားမှာ space တစ်ခု ထည့်ဖို့ — condition သီးခြား နှစ်ခုကို သုံးထားပါတယ်။ တစ်နည်းအားဖြင့် — leading space ပါတဲ့ Fragment တစ်ခု သုံးနိုင်ပါတယ်: `importance > 0 && <> <i>...</i></>` ဒါမှမဟုတ် — `<i>` ရဲ့ အတွင်းမှာ space တစ်ခု ချက်ချင်း ထည့်နိုင်ပါတယ်: `importance > 0 && <i> ...</i>`။

### `? :` တစ်တန်းကို `if` နဲ့ Variables အဖြစ် Refactor လုပ်ခြင်း

ဒီ `Drink` component က — `name` prop က `"tea"` လား `"coffee"` လားပေါ်မူတည်ပြီး — အချက်အလက် အမျိုးမျိုး ပြသဖို့ `? :` conditions တစ်တန်းကို သုံးပါတယ်။ ပြဿနာက — သောက်စရာ တစ်ခုချင်းစီရဲ့ အချက်အလက်တွေက conditions အမျိုးမျိုးမှာ ပြန့်ကျဲနေပါတယ်။ ဒီ code ကို `? :` conditions သုံးခု အစား — `if` statement တစ်ခုတည်း သုံးအောင် refactor လုပ်ပါ။

```jsx
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```
Code ကို `if` သုံးအောင် refactor လုပ်ပြီးတာနဲ့ — ပိုရိုးရှင်းအောင် လုပ်ဖို့ နောက်ထပ် စိတ်ကူးတွေ ရှိပါသလား?

#### အဖြေ

ဒါကို ချဉ်းကပ်နိုင်တဲ့ နည်းလမ်း အများကြီး ရှိပါတယ် — ဒါပေမယ့် စတင်ဖို့ အချက်တစ်ချက် ကတော့:

```jsx
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```
ဒီမှာ — သောက်စရာ တစ်ခုချင်းစီရဲ့ အချက်အလက်တွေက conditions အမျိုးမျိုးမှာ ပြန့်ကျဲနေမယ့်အစား — အတူတကွ စုစည်းထားပါတယ်။ ဒါက နောင်မှာ သောက်စရာ တွေထပ်ထည့်ဖို့ ပိုလွယ်ကူစေပါတယ်။

နောက်ထပ် ဖြေရှင်းနည်းတစ်ခုကတော့ — အချက်အလက်တွေကို objects တွေထဲ ရွှေ့ပြီး — condition ကို လုံးဝ ဖယ်ရှားပစ်တာပါ:

```jsx
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```
