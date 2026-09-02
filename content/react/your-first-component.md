---
title: "ပထမဆုံး Component ရေးခြင်း"
description: "Component ဆိုတာ ဘာလဲ၊ component တွေက React app ထဲမှာ ဘယ်လို အခန်းကဏ္ဍကနေ ပါဝင်လဲ၊ ပထမဆုံး React component တစ်ခုကို ဘယ်လို ရေးမလဲ"
order: 33
source: "https://react.dev/learn/your-first-component"
status: translated
updated: 2026-09-02
---

*Components* တွေက React ရဲ့ အဓိက concept တွေထဲက တစ်ခုပါ။ သူတို့က user interface (UI) တည်ဆောက်ရာမှာ အုတ်မြစ်တွေ ဖြစ်တာကြောင့် — React ကို စတင်လေ့လာဖို့ အကောင်းဆုံး နေရာလည်း ဖြစ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Component ဆိုတာ ဘာလဲ
- Component တွေက React application တစ်ခုမှာ ဘယ်လို အခန်းကဏ္ဍကနေ ပါဝင်လဲ
- သင့်ရဲ့ ပထမဆုံး React component ကို ဘယ်လို ရေးမလဲ

## Components — UI တည်ဆောက်ရေး အစိတ်အပိုင်းများ

Web ပေါ်မှာ — HTML က သူ့ရဲ့ built-in tag တွေဖြစ်တဲ့ `<h1>` နဲ့ `<li>` တို့လိုမျိုးနဲ့ — ကြွယ်ဝပြီး ဖွဲ့စည်းတည်ဆောက်ထားတဲ့ document တွေကို ဖန်တီးနိုင်စေပါတယ်:

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

ဒီ markup က ဒီဆောင်းပါး `<article>`၊ သူ့ရဲ့ ခေါင်းစဉ် `<h1>` နဲ့ (အတိုချုံးထားတဲ့) အကြောင်းအရာဇယား `<ol>` တို့ကို ကိုယ်စားပြုပါတယ်။ ဒီလို markup တွေဟာ — style အတွက် CSS နဲ့ — interactivity အတွက် JavaScript တို့နဲ့ ပေါင်းစပ်ပြီး — sidebar တွေ၊ avatar တွေ၊ modal တွေ၊ dropdown တွေ—Web ပေါ်မှာ သင်မြင်ရတဲ့ UI အပိုင်းတိုင်းရဲ့ နောက်ကွယ်မှာ ရှိပါတယ်။

React က သင့်ရဲ့ markup၊ CSS နဲ့ JavaScript တွေကို custom "components" — **သင့် app အတွက် ပြန်သုံးလို့ရတဲ့ UI အစိတ်အပိုင်းတွေ** — အဖြစ် ပေါင်းစပ်နိုင်စေပါတယ်။ အထက်က မြင်ခဲ့တဲ့ table of contents code ကို — စာမျက်နှာတိုင်းမှာ render လုပ်လို့ရတဲ့ `<TableOfContents />` component အဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ အတွင်းပိုင်းမှာတော့ `<article>`၊ `<h1>` စတဲ့ HTML tag တွေကိုပဲ သုံးနေတုန်းပါ။

HTML tag တွေလိုပဲ — components တွေကို compose (ပေါင်းစပ်) လုပ်၊ order (အစဉ်လိုက်) လုပ်ပြီး — nest (အထဲထည့်) လုပ်ကာ စာမျက်နှာ တစ်ခုလုံးကို ဒီဇိုင်းဆွဲနိုင်ပါတယ်။ ဥပမာ — သင်ဖတ်နေတဲ့ ဒီ documentation စာမျက်နှာကိုယ်တိုင်က React components တွေနဲ့ ဖွဲ့စည်းထားပါတယ်:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Project ကြီးလာတာနဲ့အမျှ — သင်ရေးထားပြီးသား components တွေကို ပြန်သုံးခြင်းဖြင့် ဒီဇိုင်းအများကြီးကို လျင်မြန်စွာ တည်ဆောက်နိုင်တာ သတိပြုမိပါလိမ့်မယ်။ အထက်က table of contents ကို `<TableOfContents />` တစ်ခုတည်းနဲ့ screen ဘယ်နေရာမှာမဆို ထည့်နိုင်ပါတယ်! React open source community က မျှဝေထားတဲ့ [Chakra UI](https://chakra-ui.com/) နဲ့ [Material UI](https://material-ui.com/) လိုမျိုး component ထောင်ပေါင်းများစွာနဲ့လည်း project ကို အစပြုနိုင်ပါတယ်။

## Component တစ်ခု သတ်မှတ်ခြင်း

အရင်တုန်းက — web developer တွေက သူတို့ရဲ့ content တွေကို markup လုပ်ပြီး — JavaScript အနည်းငယ် ဖြန်းခြင်းဖြင့် interaction ထည့်လေ့ ရှိပါတယ်။ Interaction က web ပေါ်မှာ "ရှိရင် ကောင်းတဲ့အရာ" ဖြစ်နေတုန်းက ဒါက ကောင်းကောင်း အလုပ်လုပ်ခဲ့ပါတယ်။ အခုတော့ — site အများစုနဲ့ app အားလုံးအတွက် မရှိမဖြစ် ဖြစ်လာပါပြီ။ React က တူညီတဲ့ technology ကိုပဲ သုံးပြီး — interactivity ကို ဦးစားပေးပါတယ်: **React component တစ်ခုဆိုတာ — markup တွေနဲ့ *ဖြန်းထားလို့ရတဲ့* JavaScript function တစ်ခုပါ။** ဒီလိုပုံပါ (အောက်က ဥပမာကို သင်ကိုယ်တိုင် edit လုပ်ကြည့်လို့ရပါတယ်):

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

Component တစ်ခု တည်ဆောက်နည်းက ဒီလိုပါ:

### အဆင့် 1: Component ကို export လုပ်ခြင်း

`export default` prefix က [standard JavaScript syntax](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) တစ်ခုပါ (React အတွက်သက်သက် မဟုတ်ပါဘူး)။ သူ့အားဖြင့် file တစ်ခုထဲက အဓိက function ကို အမှတ်အသားလုပ်ပြီး — တခြား file တွေကနေ နောက်ပိုင်းမှာ import လုပ်နိုင်စေပါတယ်။ (Import လုပ်ခြင်းအကြောင်း အသေးစိတ်ကို [Importing နဲ့ Exporting Components](/docs/react/importing-and-exporting-components) မှာ ကြည့်ပါ!)

### အဆင့် 2: Function ကို သတ်မှတ်ခြင်း

`function Profile() { }` ဖြင့် — `Profile` လို့ အမည်ရတဲ့ JavaScript function တစ်ခုကို သတ်မှတ်ပါတယ်။

> **သတိပြုရန်:** React components တွေက ပုံမှန် JavaScript functions တွေပါ — ဒါပေမယ့် — **သူတို့ရဲ့ နာမည်တွေက စာလုံးကြီးနဲ့ စရမယ်** — မဟုတ်ရင် အလုပ်မလုပ်ပါဘူး!

### အဆင့် 3: Markup ထည့်ခြင်း

Component က `src` နဲ့ `alt` attributes ပါတဲ့ `<img />` tag တစ်ခုကို ပြန်ပေးပါတယ်။ `<img />` က HTML လိုပဲ ရေးရပေမယ့် — အတွင်းပိုင်းမှာ တကယ်တော့ JavaScript ပါ! ဒီ syntax ကို [JSX](/docs/react/writing-markup-with-jsx) လို့ ခေါ်ပြီး — JavaScript ထဲမှာ markup တွေကို ထည့်သွင်းနိုင်စေပါတယ်။

Return statements တွေကို — ဒီ component လိုမျိုး — line တစ်ကြောင်းတည်းနဲ့ ရေးနိုင်ပါတယ်:

```js
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

ဒါပေမယ့် — သင့် markup က `return` keyword နဲ့ line တစ်တွဲတည်း မဟုတ်ရင် — parentheses တစ်စုံနဲ့ ထုပ်ပေးရပါမယ်:

```js
return (
  <div>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

> **သတိပြုရန်:** Parentheses မပါရင် — `return` ရဲ့ နောက် line တွေပေါ်က code တွေက [ထည့်တွက်ခံရမှာ မဟုတ်ပါဘူး](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

## Component တစ်ခုကို အသုံးပြုခြင်း

အခု သင့် `Profile` component ကို သတ်မှတ်ပြီးပြီဆိုတော့ — တခြား components တွေထဲမှာ သူ့ကို nest လုပ်နိုင်ပါပြီ။ ဥပမာ — `Profile` components အများအပြားကို သုံးတဲ့ `Gallery` component တစ်ခုကို export လုပ်နိုင်ပါတယ်:

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

### Browser က မြင်ရတဲ့အရာ

စာလုံးအသေး/အကြီး (casing) ကွာခြားချက်ကို သတိပြုပါ:

- `<section>` က စာလုံးသေးဖြစ်လို့ — React က ဒါ HTML tag တစ်ခုကို ရည်ညွှန်းတယ်ဆိုတာ သိပါတယ်။
- `<Profile />` က စာလုံးကြီး `P` နဲ့ စတင်လို့ — React က `Profile` လို့ခေါ်တဲ့ ကိုယ့် component ကို သုံးချင်တယ်ဆိုတာ သိပါတယ်။

`Profile` ထဲမှာ HTML တွေ ထပ်ပါတယ်: `<img />`။ အဆုံးမှာတော့ browser က ဒါကို မြင်ရပါတယ်:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Components တွေကို Nesting လုပ်ခြင်းနဲ့ စုစည်းခြင်း

Components တွေက ပုံမှန် JavaScript functions တွေမို့ — file တစ်ခုထဲမှာ components အများအပြား ထားနိုင်ပါတယ်။ Components တွေက သေးငယ်ပြီး တစ်ခုနဲ့တစ်ခု နီးကပ်စွာ ဆက်စပ်နေရင် ဒါက အဆင်ပြေပါတယ်။ File က ရှုပ်ထွေးလာရင်တော့ — `Profile` ကို file သပ်သပ်တစ်ခုဆီ အမြဲ ရွှေ့နိုင်ပါတယ်။ ဒါကို [import လုပ်ခြင်းအကြောင်း စာမျက်နှာ](/docs/react/importing-and-exporting-components) မှာ မကြာမီ လေ့လာရပါမယ်။

`Profile` components တွေကို `Gallery` ထဲမှာ render လုပ်ထားလို့ — အကြိမ်များစွာတောင် ဖြစ်နိုင်လို့! — `Gallery` က **parent component** ဖြစ်ပြီး — `Profile` တစ်ခုချင်းစီကို "child" အဖြစ် render လုပ်တယ်လို့ ပြောနိုင်ပါတယ်။ ဒါက React ရဲ့ မှော်ဆန်မှုရဲ့ အစိတ်အပိုင်းပါ: component တစ်ခုကို တစ်ကြိမ် သတ်မှတ်ပြီးရင် — ကြိုက်သလောက် နေရာများများ၊ အကြိမ်များများ သုံးနိုင်ပါတယ်။

> **သတိပြုရန်:** Components တွေက တခြား components တွေကို render လုပ်နိုင်ပေမယ့် — **သူတို့ရဲ့ definition တွေကို တစ်ခုထဲမှာ တစ်ခါမှ nest မလုပ်ရပါဘူး:**
>
> ```js
> export default function Gallery() {
>   // 🔴 Never define a component inside another component!
>   function Profile() {
>     // ...
>   }
>   // ...
> }
> ```
>
> အထက်က snippet က [အရမ်းနှေးပြီး bugs တွေ ဖြစ်စေပါတယ်](/docs/react/preserving-and-resetting-state)။ အဲဒီအစား — component တိုင်းကို top level မှာ သတ်မှတ်ပါ:
>
> ```js
> export default function Gallery() {
>   // ...
> }
>
> // ✅ Declare components at the top level
> function Profile() {
>   // ...
> }
> ```
>
> Child component က parent ဆီက data တစ်ချို့ လိုအပ်ရင် — definition တွေ nest လုပ်မယ့်အစား — [props နဲ့ ပို့ပေးပါ](/docs/react/props)။

#### Components တွေက အောက်ဆုံးအထိ ဆက်သွားတယ်

သင့် React application က "root" component တစ်ခုကနေ စတင်ပါတယ်။ ပုံမှန်အားဖြင့် — project အသစ်တစ်ခု စတင်တဲ့အခါ သူ့ကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ဥပမာ — [CodeSandbox](https://codesandbox.io/) သုံးရင် ဒါမှမဟုတ် [Next.js](https://nextjs.org/) framework သုံးရင် — root component ကို `pages/index.js` မှာ သတ်မှတ်ပါတယ်။ ဒီဥပမာတွေမှာ — root components တွေကို သင်ကိုယ်တိုင် export လုပ်ခဲ့တာပါ။

React app အများစုက — components တွေကို အောက်ဆုံးအထိ သုံးပါတယ်။ ဆိုလိုတာက — button လိုမျိုး ပြန်သုံးလို့ရတဲ့ အပိုင်းလေးတွေအတွက်သာမက — sidebar တွေ၊ list တွေ၊ နောက်ဆုံးမှာတော့ စာမျက်နှာ တစ်ခုလုံးလိုမျိုး — ကြီးမားတဲ့ အပိုင်းတွေအတွက်ပါ components တွေကို သုံးပါတယ်! တစ်ချို့ components တွေက တစ်ခါပဲ သုံးရတာတောင် — UI code နဲ့ markup တွေကို စုစည်းဖို့ components တွေက အဆင်ပြေတဲ့ နည်းလမ်းပါ။

[React-based frameworks](/docs/react/creating-a-react-app) တွေက ဒါကို နောက်တစ်ဆင့် ပိုသွားပါတယ်။ HTML file အလွတ်ကို သုံးပြီး — React က JavaScript နဲ့ စာမျက်နှာကို စီမံခိုင်းမယ့်အစား — သူတို့က သင့် React components တွေကနေ HTML ကိုပါ အလိုအလျောက် generate လုပ်ပေးပါတယ်။ ဒါက JavaScript code မတင်ခင် — သင့် app က content တစ်ချို့ ပြသစေနိုင်ပါတယ်။

ဒါပေမယ့် — website အများစုက React ကို [ရှိပြီးသား HTML စာမျက်နှာတွေမှာ interactivity ထည့်ဖို့ပဲ](/docs/react/getting-started) သုံးပါသေးတယ်။ စာမျက်နှာ တစ်ခုလုံးအတွက် root component တစ်ခုတည်း မဟုတ်ဘဲ — root components အများအပြား ရှိပါတယ်။ လိုအပ်သလောက်ပဲ — React ကို အများကြီးဖြစ်စေ၊ နည်းနည်းဖြစ်စေ — သုံးနိုင်ပါတယ်။

## အကျဉ်းချုပ်

React ရဲ့ ပထမဆုံး အရသာကို ခံစားလိုက်ရပါပြီ! အဓိက အချက်တွေကို ပြန်ချုပ်ရရင်:

- React က components တွေ — **သင့် app အတွက် ပြန်သုံးလို့ရတဲ့ UI အစိတ်အပိုင်းတွေ** — ဖန်တီးနိုင်စေပါတယ်။
- React app တစ်ခုမှာ — UI အပိုင်းတိုင်းက component တစ်ခုပါ။
- React components တွေက ပုံမှန် JavaScript functions တွေပါ — ဒါပေမယ့်:

  1. သူတို့ရဲ့ နာမည်တွေက စာလုံးကြီးနဲ့ အမြဲ စတင်ပါတယ်။
  2. သူတို့က JSX markup တွေကို ပြန်ပေးပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Component ကို export လုပ်ခြင်း

ဒီ sandbox က — root component ကို export မလုပ်ထားလို့ — အလုပ်မလုပ်ပါဘူး:

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

အဖြေကို မကြည့်ခင် ကိုယ်တိုင် ပြုပြင်ကြည့်ပါ!

#### အဖြေ

Function definition ရဲ့ ရှေ့မှာ `export default` ထည့်ပါ:

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

`export` တစ်ခုတည်း ရေးရုံနဲ့ ဘာကြောင့် မပြီးတာလဲလို့ သင်တွေးမိနိုင်ပါတယ်။ `export` နဲ့ `export default` ရဲ့ ကွာခြားချက်ကို [Importing နဲ့ Exporting Components](/docs/react/importing-and-exporting-components) မှာ လေ့လာနိုင်ပါတယ်။

### Return statement ကို ပြုပြင်ခြင်း

ဒီ `return` statement မှာ တစ်ခုခု မမှန်ပါဘူး။ ပြုပြင်နိုင်မလား?

> **အရိပ်အမြွက်:** ပြုပြင်ဖို့ ကြိုးစားတုန်းမှာ "Unexpected token" error မြင်ရနိုင်ပါတယ်။ အဲဒီအခါ — semicolon က ပိတ်တဲ့ parenthesis ရဲ့ *နောက်မှာ* ရှိမရှိ စစ်ပါ။ `return ( )` ထဲမှာ semicolon ကျန်နေရင် error ဖြစ်စေပါတယ်။

```js
export default function Profile() {
  return
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

#### အဖြေ

Return statement ကို line တစ်ကြောင်းတည်းဆီ ရွှေ့ပြီး ပြုပြင်နိုင်ပါတယ်:

```js
export default function Profile() {
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

ဒါမှမဟုတ် — ပြန်ပေးတဲ့ JSX markup ကို `return` ရဲ့ နောက်မှာ ချက်ချင်းဖွင့်တဲ့ parentheses တွေနဲ့ ထုပ်ပြီး ပြုပြင်နိုင်ပါတယ်:

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

### အမှားကို ရှာဖွေခြင်း

`Profile` component ကို ကြေညာပုံနဲ့ သုံးပုံမှာ တစ်ခုခု မှားနေပါတယ်။ အမှားကို ရှာတွေ့နိုင်မလား? (React က components တွေကို ပုံမှန် HTML tags တွေကနေ ဘယ်လို ခွဲခြားလဲဆိုတာ ပြန်မှတ်မိအောင် ကြိုးစားကြည့်ပါ!)

```js
function profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

#### အဖြေ

React component နာမည်တွေက စာလုံးကြီးနဲ့ စတင်ရပါတယ်။

`function profile()` ကို `function Profile()` အဖြစ် ပြောင်းပြီး — `<profile />` တိုင်းကိုလည်း `<Profile />` အဖြစ် ပြောင်းပါ:

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

### သင့်ကိုယ်ပိုင် Component တစ်ခု

အစကနေ component တစ်ခု ရေးပါ။ ကြိုက်တဲ့ တရားဝင် နာမည်တစ်ခု ပေးပြီး — ဘယ် markup မဆို ပြန်ပေးနိုင်ပါတယ်။ စိတ်ကူးမရရင် — `<h1>Good job!</h1>` ကို ပြတဲ့ `Congratulations` component တစ်ခု ရေးနိုင်ပါတယ်။ Export လုပ်ဖို့ မမေ့ပါနဲ့!

```js
// Write your component below!

```

#### အဖြေ

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```
