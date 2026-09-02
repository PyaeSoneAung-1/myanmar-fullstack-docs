---
title: "JSX နဲ့ Markup ရေးခြင်း"
description: "JavaScript file တစ်ခုထဲမှာ HTML ပုံစံ markup ရေးနိုင်စေတဲ့ JSX syntax — JSX ရဲ့ စည်းမျဉ်းများ (root element တစ်ခုတည်း၊ tag အားလုံး ပိတ်ခြင်း၊ camelCase) နဲ့ HTML ကို JSX အဖြစ် ပြောင်းခြင်း"
order: 34
source: "https://react.dev/learn/writing-markup-with-jsx"
status: translated
updated: 2026-09-02
---

*JSX* က JavaScript အတွက် syntax extension တစ်ခုဖြစ်ပြီး — JavaScript file တစ်ခုထဲမှာ HTML နဲ့တူတဲ့ markup တွေကို ရေးနိုင်စေပါတယ်။ Components တွေရေးဖို့ တခြားနည်းလမ်းတွေ ရှိပေမယ့် — React developer အများစုက JSX ရဲ့ ကျစ်လျစ်မှုကို ကြိုက်နှစ်သက်ကြပြီး — codebase အများစုမှာ သူ့ကို သုံးကြပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React က markup နဲ့ rendering logic ကို ဘာကြောင့် ရောနှောလဲ
- JSX က HTML နဲ့ ဘယ်လို ကွာခြားလဲ
- JSX နဲ့ အချက်အလက်တွေကို ဘယ်လို ပြသလဲ

## JSX — Markup ကို JavaScript ထဲ ထည့်ခြင်း

Web ကို HTML၊ CSS နဲ့ JavaScript တို့နဲ့ တည်ဆောက်ထားပါတယ်။ နှစ်ပေါင်းများစွာ — web developer တွေက content တွေကို HTML ထဲမှာ၊ design တွေကို CSS ထဲမှာ၊ logic တွေကို JavaScript ထဲမှာ — မကြာခဏဆိုသလို file တွေ သပ်သပ်ခွဲပြီး — ထားလေ့ ရှိပါတယ်! Content တွေကို HTML ထဲမှာ markup လုပ်ပြီး — စာမျက်နှာရဲ့ logic တွေက JavaScript ထဲမှာ သီးခြား နေထိုင်ပါတယ်:

> _Diagram:_ HTML — purple နောက်ခံပေါ်မှာ p နဲ့ form tag နှစ်ခုပါတဲ့ div တစ်ခု။

> _Diagram:_ JavaScript — yellow နောက်ခံပေါ်မှာ onSubmit၊ onLogin နဲ့ onClick handler သုံးခု။

ဒါပေမယ့် — Web က ပိုပြီး interactive ဖြစ်လာတာနဲ့အမျှ — logic တွေက content တွေကို ပိုပိုပြီး ဆုံးဖြတ်လာပါတယ်။ JavaScript က HTML ကို အုပ်စိုးလာတာပါ! ဒါကြောင့် **React မှာ — rendering logic နဲ့ markup တွေက နေရာတစ်ခုတည်း — components တွေထဲမှာ — အတူတကွ နေထိုင်ပါတယ်။**

> _Diagram:_ `Sidebar.js` React component — HTML နဲ့ JavaScript ရောထားတဲ့ React component — yellow နဲ့ မီးမောင်းထိုးထားတဲ့ `isLoggedIn` function ကို ခေါ်တဲ့ Sidebar function။

> _Diagram:_ `Form.js` React component — yellow နဲ့ မီးမောင်းထိုးထားတဲ့ onClick နဲ့ onSubmit handler နှစ်ခုပါတဲ့ Form function — အောက်မှာ purple HTML — form element ထဲမှာ onClick prop ပါတဲ့ nested input element တွေ။

Button တစ်ခုရဲ့ rendering logic နဲ့ markup ကို အတူထားခြင်းက — edit လုပ်တိုင်း သူတို့နှစ်ခုက တစ်ခုနဲ့တစ်ခု sync ဖြစ်နေစေပါတယ်။ အပြန်အစီအားဖြင့် — မသက်ဆိုင်တဲ့ အသေးစိတ်တွေဖြစ်တဲ့ — button တစ်ခုရဲ့ markup နဲ့ sidebar တစ်ခုရဲ့ markup — တို့က တစ်ခုနဲ့တစ်ခု သီးခြားခွဲထားလို့ — တစ်ခုခုကို သီးခြား ပြောင်းလဲဖို့ ပိုလုံခြုံပါတယ်။

React component တစ်ခုချင်းစီက JavaScript function တစ်ခုဖြစ်ပြီး — React က browser ထဲ render လုပ်ပေးတဲ့ markup တစ်ချို့ ပါဝင်နိုင်ပါတယ်။ React components တွေက အဲဒီ markup ကို ကိုယ်စားပြုဖို့ — JSX လို့ခေါ်တဲ့ syntax extension တစ်ခုကို သုံးပါတယ်။ JSX က HTML နဲ့ အများကြီး တူပေမယ့် — နည်းနည်း ပိုတင်းကျပ်ပြီး — dynamic အချက်အလက်တွေကိုလည်း ပြသနိုင်ပါတယ်။ ဒါကို နားလည်ဖို့ အကောင်းဆုံးနည်းလမ်းက — HTML markup တစ်ချို့ကို JSX markup အဖြစ် ပြောင်းကြည့်ခြင်းပါ။


> **မှတ်ချက်:** JSX နဲ့ React က သီးခြားအရာ နှစ်ခုပါ။ မကြာခဏ အတူသုံးကြပေမယ့် — တစ်ခုနဲ့တစ်ခု မှီခိုစရာမလိုဘဲ [သီးခြား သုံးနိုင်ပါတယ်](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)။ JSX က syntax extension ဖြစ်ပြီး — React က JavaScript library တစ်ခုပါ။

## HTML ကို JSX အဖြစ် ပြောင်းခြင်း

သင့်မှာ (လုံးဝ တရားဝင်တဲ့) HTML တစ်ချို့ ရှိတယ်ဆိုပါစို့:

```html
<h1>Hedy Lamarr's Todos</h1>
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

ပြီးတော့ ဒါကို သင့် component ထဲ ထည့်ချင်တယ်ဆိုပါစို့:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

ဒီအတိုင်း copy-paste လုပ်ရင် — အလုပ်မလုပ်ပါဘူး:

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

ဒါက — JSX က HTML ထက် ပိုတင်းကျပ်ပြီး — စည်းမျဉ်း အနည်းငယ် ပိုလို့ပါ! အထက်က error messages တွေကို ဖတ်ရင် markup ကို ပြုပြင်ဖို့ လမ်းညွှန်ပေးပါလိမ့်မယ် — ဒါမှမဟုတ် အောက်က လမ်းညွှန်ကို လိုက်နိုင်ပါတယ်။

အလွယ်ဆုံး ချဉ်းကပ်နည်းက — အောက်ပါ စည်းမျဉ်း သုံးခုကို တစ်ခုပြီးတစ်ခု စစ်ကြည့်တာပါ: (1) Element တွေ အားလုံးကို root tag တစ်ခုတည်းနဲ့ ထုပ်ထားလား၊ (2) Tag တိုင်းကို မှန်မှန်ကန်ကန် ပိတ်ထားလား၊ (3) Attribute နာမည်တွေကို camelCase နဲ့ ရေးထားလား။ ဒီအချက် သုံးခုစလုံး ပြည့်စုံတာနဲ့ — သင့် markup က များသောအားဖြင့် တရားဝင်တဲ့ JSX ဖြစ်သွားပါပြီ။

> **မှတ်ချက်:** အများစုမှာ — React ရဲ့ screen ပေါ်က error messages တွေက ပြဿနာဘယ်မှာဆိုတာ ရှာဖို့ ကူညီပေးပါလိမ့်မယ်။ ပိတ်မိနေရင် သူတို့ကို ဖတ်ကြည့်ပါ!

## JSX ရဲ့ စည်းမျဉ်းများ

### 1. Root element တစ်ခုတည်း ပြန်ပေးပါ

Component တစ်ခုကနေ element အများအပြား ပြန်ပေးဖို့ — **သူတို့ကို parent tag တစ်ခုတည်းနဲ့ ထုပ်ပါ။**

ဥပမာ — `<div>` ကို သုံးနိုင်ပါတယ်:

```js
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

သင့် markup ထဲ `<div>` အပိုတစ်ခု ထည့်ချင်စရာ မလိုရင် — `<>` နဲ့ `</>` အစား ရေးနိုင်ပါတယ်:

```js
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

ဒီ tag အလွတ်ကို *[Fragment](https://react.dev/reference/react/Fragment)* လို့ ခေါ်ပါတယ်။ Fragments တွေက — browser ရဲ့ HTML tree ထဲမှာ ခြေရာတစ်စုံတစ်ရာ မကျန်ရစ်ဘဲ — အရာတွေကို စုစည်းနိုင်စေပါတယ်။

#### JSX tag အများအပြားကို ဘာကြောင့် ထုပ်ပေးရတာလဲ

JSX က HTML နဲ့ တူပေမယ့် — အတွင်းပိုင်းမှာ ရိုးရိုး JavaScript objects တွေအဖြစ် ပြောင်းလဲခံရပါတယ်။ Function တစ်ခုကနေ object နှစ်ခုကို — array တစ်ခုထဲ ထုပ်မထည့်ဘဲ — ပြန်လို့ မရပါဘူး။ ဒါကြောင့်ပဲ — JSX tag နှစ်ခုကိုလည်း — တခြား tag တစ်ခု ဒါမှမဟုတ် Fragment တစ်ခုထဲ ထုပ်မထည့်ဘဲ — ပြန်လို့ မရတာပါ။

### 2. Tag တိုင်းကို ပိတ်ပါ

JSX က tag တွေကို ရှင်းရှင်းလင်းလင်း ပိတ်ဖို့ လိုပါတယ်: `<img>` လိုမျိုး self-closing tag တွေက `<img />` ဖြစ်ရပြီး — `<li>oranges` လိုမျိုး wrapping tag တွေက `<li>oranges</li>` လို့ ရေးရပါတယ်။

Hedy Lamarr ရဲ့ ပုံနဲ့ list items တွေ ပိတ်ထားပုံက ဒီလိုပါ:

```js
<>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. အားလုံးနီးပါးကို camelCase လုပ်ပါ!

JSX က JavaScript အဖြစ် ပြောင်းလဲပြီး — JSX ထဲမှာ ရေးတဲ့ attributes တွေက JavaScript objects တွေရဲ့ keys တွေ ဖြစ်လာပါတယ်။ သင့်ကိုယ်ပိုင် components တွေထဲမှာ — အဲဒီ attributes တွေကို variables တွေထဲ ဖတ်ချင်လေ့ ရှိပါတယ်။ ဒါပေမယ့် — JavaScript မှာ variable name တွေအတွက် ကန့်သတ်ချက်တွေ ရှိပါတယ်။ ဥပမာ — သူတို့ရဲ့ နာမည်ထဲမှာ dash တွေ မပါနိုင်သလို — `class` လိုမျိုး reserved word တွေလည်း မဖြစ်နိုင်ပါဘူး။

ဒါကြောင့် — React မှာ — HTML နဲ့ SVG attributes အများစုကို camelCase နဲ့ ရေးပါတယ်။ ဥပမာ — `stroke-width` အစား `strokeWidth` ကို သုံးပါတယ်။ `class` က reserved word ဖြစ်လို့ — React မှာ — [သက်ဆိုင်တဲ့ DOM property](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) ကို အစွဲပြုပြီး — `className` လို့ ရေးပါတယ်:

```js
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

ဒီ attributes အားလုံးကို [DOM component props စာရင်း](https://react.dev/reference/react-dom/components/common) ထဲမှာ ရှာနိုင်ပါတယ်။ တစ်ခုခု မှားရေးမိရင် — စိတ်မပူပါနဲ့ — React က [browser console](https://developer.mozilla.org/docs/Tools/Browser_Console) ထဲမှာ ပြင်ဆင်နည်း အကြံပြုချက်ပါတဲ့ message တစ်ခု ပြပါလိမ့်မယ်။

> **သတိပြုရန်:** သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် — [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) နဲ့ [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attributes တွေကိုတော့ — HTML ထဲမှာလိုပဲ dash တွေနဲ့ ရေးပါတယ်။

### Pro-tip: JSX Converter သုံးခြင်း

ရှိပြီးသား markup ထဲက attribute အားလုံးကို ပြောင်းရတာက ငြီးငွေ့စရာ ကောင်းနိုင်ပါတယ်! သင့်ရှိပြီးသား HTML နဲ့ SVG တွေကို JSX အဖြစ် ပြောင်းဖို့ [converter](https://transform.tools/html-to-jsx) တစ်ခု သုံးဖို့ အကြံပြုပါတယ်။ Converters တွေက လက်တွေ့မှာ အရမ်းအသုံးဝင်ပေမယ့် — ဘာတွေ ဖြစ်နေလဲဆိုတာ နားလည်ထားတာက — JSX ကို ကိုယ်တိုင် သက်တောင့်သက်သာ ရေးနိုင်ဖို့ ထိုက်တန်ပါတယ်။

နောက်ဆုံး ရလဒ်က ဒီမှာပါ:

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

## အကျဉ်းချုပ်

JSX က ဘာကြောင့် ရှိတာလဲ၊ components တွေထဲမှာ ဘယ်လို သုံးလဲဆိုတာ အခု သင်သိပါပြီ:

- React components တွေက rendering logic ကို markup နဲ့ အတူ စုစည်းပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့က ဆက်စပ်နေလို့ပါ။
- JSX က HTML နဲ့ ဆင်ပေမယ့် — ကွာခြားချက် အနည်းငယ် ရှိပါတယ်။ လိုအပ်ရင် [converter](https://transform.tools/html-to-jsx) ကို သုံးနိုင်ပါတယ်။
- Error messages တွေက သင့် markup ကို ပြုပြင်ဖို့ မကြာခဏ လမ်းကြောင်းမှန် ပြပါလိမ့်မယ်။

## စိန်ခေါ်မှုများ (Challenges)

### HTML တစ်ချို့ကို JSX အဖြစ် ပြောင်းခြင်း

ဒီ HTML ကို component တစ်ခုထဲ ကူးထည့်ထားပေမယ့် — တရားဝင်တဲ့ JSX မဟုတ်ပါဘူး။ ပြုပြင်ပါ:

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

လက်နဲ့ ပြုလုပ်ဖို့လား converter သုံးဖို့လား — ဆုံးဖြတ်ချက် က သင့်အပေါ်မှာပါ!

#### အဖြေ

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```
