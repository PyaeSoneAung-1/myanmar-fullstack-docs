---
title: "UI ကို Tree အဖြစ် နားလည်ခြင်း"
description: "React က component structure တွေကို tree အနေနဲ့ ဘယ်လို ပုံဖော်လဲ — render tree ဆိုတာ ဘာလဲ၊ module dependency tree ဆိုတာ ဘာလဲ၊ ဒါတွေက performance နဲ့ state management ကို ဘယ်လို ကူညီပေးလဲ"
order: 37
source: "https://react.dev/learn/understanding-your-ui-as-a-tree"
status: translated
updated: 2026-09-02
---

သင့် React app က — components အများအပြား တစ်ခုကိုတစ်ခု အတွင်းမှာ nested ဖြစ်နေတာနဲ့ — ပုံစံတကျ ဖြစ်လာနေပါပြီ။ React က သင့် app ရဲ့ component structure တွေကို ဘယ်လို ခြေရာခံလဲ?

React အပြင် — UI library တခြားများစွာကပါ — UI ကို tree တစ်ခုအနေနဲ့ ပုံစံချပါတယ်။ သင့် app ကို tree တစ်ခုလို တွေးကြည့်တာက — components တွေကြားက ဆက်စပ်မှုတွေကို နားလည်ဖို့ အသုံးဝင်ပါတယ်။ ဒီနားလည်မှုက — performance နဲ့ state management လိုမျိုး နောင်ကာလက concept တွေကို debug လုပ်ဖို့ ကူညီပါလိမ့်မယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React က component structure တွေကို ဘယ်လို "မြင်" လဲ
- Render tree ဆိုတာ ဘာလဲ၊ ဘာအတွက် အသုံးဝင်လဲ
- Module dependency tree ဆိုတာ ဘာလဲ၊ ဘာအတွက် အသုံးဝင်လဲ

## သင့် UI က tree တစ်ခု

Trees တွေက — item တွေကြားက ဆက်စပ်မှု ပုံစံတစ်ခုပါ။ UI ကို မကြာခဏ tree structure တွေနဲ့ ကိုယ်စားပြုပါတယ်။ ဥပမာ — browsers တွေက HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) နဲ့ CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)) တွေကို ပုံစံချဖို့ tree structures တွေကို သုံးပါတယ်။ Mobile platforms တွေကလည်း သူတို့ရဲ့ view hierarchy ကို ကိုယ်စားပြုဖို့ trees တွေကို သုံးပါတယ်။

> _Diagram:_ အပိုင်း သုံးပိုင်း — ဘယ်ဘက်မှာ 'Component A'၊ 'Component B'၊ 'Component C' ဆိုပြီး ဒေါင်လိုက် စီထားတဲ့ rectangle သုံးခု — React logo ပါတဲ့ မြှားတစ်ခုနဲ့ ဒုတိယအပိုင်း (root 'A' နဲ့ child 'B'၊ 'C' နှစ်ခုရှိတဲ့ component tree) ဆီ ကူးပြောင်း — နောက်ထပ် React DOM မြှားတစ်ခုနဲ့ browser frame တစ်ခုဆီ ကူးပြောင်း — အဲဒီထဲမှာ node ၈ ခုရှိတဲ့ tree (အလယ်အပိုင်းရဲ့ subtree ကိုပဲ မီးမောင်းထိုးပြထား)။

React က သင့် components တွေကနေ UI tree တစ်ခုကို ဖန်တီးပါတယ်။ ဒီဥပမာမှာ — UI tree ကို DOM ဆီ render လုပ်ဖို့ သုံးပါတယ်။

Browsers နဲ့ mobile platforms တွေလိုပဲ — React ကလည်း — React app တစ်ခုထဲက components တွေကြားက ဆက်စပ်မှုတွေကို စီမံခန့်ခွဲပြီး ပုံစံချဖို့ — tree structures တွေကို သုံးပါတယ်။ ဒီ trees တွေက — data တွေ React app တစ်ခုကို ဘယ်လို ဖြတ်သန်းစီးဆင်းလဲ၊ rendering နဲ့ app အရွယ်အစားကို ဘယ်လို optimize လုပ်ရမလဲဆိုတာ နားလည်ဖို့ အသုံးဝင်တဲ့ tools တွေပါ။

## Render Tree

Components တွေရဲ့ အဓိက feature တစ်ခုက — တခြား components တွေနဲ့ ဖွဲ့စည်းနိုင်စွမ်းပါ။ Components တွေကို [nest လုပ်လိုက်တာနဲ့](/docs/react/your-first-component) — parent နဲ့ child components တွေဆိုတဲ့ အယူအဆ ရှိလာပါတယ် — parent component တစ်ခုချင်းစီကလည်း တခြား component တစ်ခုရဲ့ child ဖြစ်နေနိုင်ပါတယ်။

React app တစ်ခုကို render လုပ်တဲ့အခါ — ဒီဆက်စပ်မှုကို — render tree လို့သိကြတဲ့ — tree တစ်ခုထဲမှာ ပုံစံချနိုင်ပါတယ်။

ဒီမှာ — စိတ်အားထက်သန်မှု ဖြစ်စရာ quotes တွေကို render လုပ်တဲ့ React app တစ်ခု ရှိပါတယ်။

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

> _Diagram:_ Node ငါးခုပါတဲ့ tree graph — node တစ်ခုချင်းစီက component တစ်ခုကို ကိုယ်စားပြု — tree ရဲ့ root က App ဖြစ်ပြီး 'InspirationGenerator' နဲ့ 'FancyText' ဆီ မြှားနှစ်ခု ထွက်ထား — မြှားတွေမှာ 'renders' လို့ တံဆိပ်တပ်ထား — 'InspirationGenerator' node ကနေ 'FancyText' နဲ့ 'Copyright' ဆီ မြှားနှစ်ခု ထပ်ထွက်။

React က *render tree* — render လုပ်ထားတဲ့ components တွေနဲ့ ဖွဲ့စည်းထားတဲ့ UI tree — တစ်ခုကို ဖန်တီးပါတယ်။

ဥပမာ app ကနေ — အထက်က render tree ကို တည်ဆောက်နိုင်ပါတယ်။

Tree က node တွေနဲ့ ဖွဲ့စည်းထားပြီး — node တစ်ခုချင်းစီက component တစ်ခုကို ကိုယ်စားပြုပါတယ်။ `App`၊ `FancyText`၊ `Copyright` — စတာတွေက အားလုံး ကျွန်တော်တို့ tree ထဲက nodes တွေပါ။

React render tree တစ်ခုရဲ့ root node က app ရဲ့ [root component](/docs/react/importing-and-exporting-components) ပါ။ ဒီကိစ္စမှာ — root component က `App` ဖြစ်ပြီး — React က ပထမဆုံး render လုပ်တဲ့ component လည်း ဖြစ်ပါတယ်။ Tree ထဲက မြှားတစ်ခုချင်းစီက parent component ကနေ child component ဆီ ညွှန်ပါတယ်။

#### Render tree ထဲမှာ HTML tags တွေ ဘယ်မှာလဲ

အထက်က render tree ထဲမှာ — component တစ်ခ်စီက render လုပ်တဲ့ HTML tags တွေအကြောင်း ဘာမှ ဖော်ပြမထားတာ သတိပြုမိပါလိမ့်မယ်။ ဒါက — render tree က React [components](/docs/react/your-first-component) တွေနဲ့ပဲ ဖွဲ့စည်းထားလို့ပါ။

React က — UI framework တစ်ခုအနေနဲ့ — platform agnostic ပါ။ react.dev ပေါ်မှာ — HTML markup တွေကို UI primitives အဖြစ် သုံးတဲ့ — web ဆီ render လုပ်တဲ့ ဥပမာတွေကို ပြသပါတယ်။ ဒါပေမယ့် — React app တစ်ခုက — [UIView](https://developer.apple.com/documentation/uikit/uiview) ဒါမှမဟုတ် [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0) လိုမျိုး — မတူညီတဲ့ UI primitives တွေ သုံးတဲ့ — mobile ဒါမှမဟုတ် desktop platform ဆီလည်း render လုပ်နိုင်ပါတယ်။

ဒီ platform UI primitives တွေက React ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး။ သင့် app က ဘယ် platform ဆီပဲ render လုပ်လုပ် — React render trees တွေက React app အတွက် ထိုးထွင်းသိမြင်မှု ပေးနိုင်ပါတယ်။

Render tree တစ်ခုက React application တစ်ခုရဲ့ render pass တစ်ခုတည်းကို ကိုယ်စားပြုပါတယ်။ [Conditional rendering](/docs/react/conditional-rendering) နဲ့ဆိုရင် — parent component တစ်ခုက — ပို့လိုက်တဲ့ data ပေါ်မူတည်ပြီး — child မတူညီတာတွေကို render လုပ်နိုင်ပါတယ်။

ဒီ app ကို — စိတ်အားထက်သန်မှု quote တစ်ခု ဒါမှမဟုတ် အရောင်တစ်ခုကို — conditional အနေနဲ့ render လုပ်အောင် update လုပ်နိုင်ပါတယ်။

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```

> _Diagram:_ Node ခြောက်ခုပါတဲ့ tree graph — အပေါ်ဆုံး node က 'App' ဖြစ်ပြီး 'InspirationGenerator' နဲ့ 'FancyText' ဆီ မြှားနှစ်ခု ထွက်ထား ('renders' တံဆိပ်ပါ) — 'InspirationGenerator' node ကနေ 'FancyText' နဲ့ 'Color' ဆီ dashed မြှားနှစ်ခု ('renders?' တံဆိပ်ပါ) ပြီးတော့ 'Copyright' ဆီ solid မြှားတစ်ခု ('renders' တံဆိပ်ပါ)။

Conditional rendering နဲ့ဆိုရင် — render မတူညီတာတွေကြားမှာ — render tree က components မတူညီတာတွေကို render လုပ်နိုင်ပါတယ်။

ဒီဥပမာမှာ — `inspiration.type` ဘာလဲဆိုတာပေါ်မူတည်ပြီး — `<FancyText>` ဒါမှမဟုတ် `<Color>` ကို render လုပ်နိုင်ပါတယ်။ Render pass တစ်ခုချင်းစီအတွက် — render tree က ကွဲပြားနိုင်ပါတယ်။

Render trees တွေက render passes တွေကြားမှာ ကွဲပြားနိုင်ပေမယ့် — ဒီ trees တွေက — React app တစ်ခုထဲက *top-level* နဲ့ *leaf components* တွေကို ခွဲခြားသိဖို့ ယေဘုယျအားဖြင့် အသုံးဝင်ပါတယ်။ Top-level components တွေက root component နဲ့ အနီးဆုံး components တွေဖြစ်ပြီး — သူတို့အောက်က components အားလုံးရဲ့ rendering performance ကို သက်ရောက်မှု ရှိကာ — မကြာခဏဆိုသလို ရှုပ်ထွေးမှု အများဆုံးလည်း ဖြစ်ပါတယ်။ Leaf components တွေက tree ရဲ့ အောက်ခြေအနီးမှာ ရှိပြီး — child components မရှိဘဲ — မကြာခဏ re-render ခံရလေ့ ရှိပါတယ်။

Component အမျိုးအစားတွေကို ခွဲခြားသိမှတ်နိုင်တာက — သင့် app ရဲ့ data flow နဲ့ performance ကို နားလည်ဖို့ အသုံးဝင်ပါတယ်။

## Module Dependency Tree

React app တစ်ခုထဲမှာ tree နဲ့ ပုံစံချလို့ရတဲ့ နောက်ထပ် ဆက်စပ်မှုတစ်ခုက — app တစ်ခုရဲ့ module dependencies တွေပါ။ Components တွေနဲ့ logic တွေကို [file သပ်သပ်တွေအဖြစ် ခွဲလိုက်တာနဲ့](/docs/react/importing-and-exporting-components) — components တွေ၊ functions တွေ၊ constants တွေကို export လုပ်နိုင်တဲ့ [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) တွေကို ဖန်တီးနေတာပါ။

Module dependency tree တစ်ခုထဲက node တစ်ခုချင်းစီက module တစ်ခုဖြစ်ပြီး — branch တစ်ခုချင်းစီက အဲဒီ module ထဲက `import` statement တစ်ခုကို ကိုယ်စားပြုပါတယ်။

ယခင် Inspirations app ကို ယူကြည့်ရင် — module dependency tree — အတိုကောက် dependency tree — တစ်ခုကို တည်ဆောက်နိုင်ပါတယ်။

> _Diagram:_ Node ခုနစ်ခုပါတဲ့ tree graph — node တစ်ခုချင်းစီကို module နာမည်နဲ့ တံဆိပ်တပ်ထား — အပေါ်ဆုံး node က 'App.js' — အဲဒီကနေ 'InspirationGenerator.js'၊ 'FancyText.js' နဲ့ 'Copyright.js' ဆီ မြှားသုံးခု ('imports' တံဆိပ်ပါ) — 'InspirationGenerator.js' node ကနေ 'FancyText.js'၊ 'Color.js' နဲ့ 'inspirations.js' ဆီ မြှားသုံးခု ထပ်ထွက်။

Inspirations app အတွက် module dependency tree ပါ။

Tree ရဲ့ root node က root module — entrypoint file လို့လည်း သိကြတယ် — ပါ။ သူက root component ပါဝင်တဲ့ module ဖြစ်လေ့ ရှိပါတယ်။

တူညီတဲ့ app ရဲ့ render tree နဲ့ ယှဉ်ကြည့်ရင် — structure တွေ ဆင်ပေမယ့် — ထင်ရှားတဲ့ ကွာခြားချက် တချို့ ရှိပါတယ်:

- Tree ကို ဖွဲ့စည်းတဲ့ nodes တွေက components တွေ မဟုတ်ဘဲ — modules တွေပါ။
- `inspirations.js` လိုမျိုး — non-component modules တွေလည်း — ဒီ tree ထဲမှာ ကိုယ်စားပြုခံရပါတယ်။ Render tree က components တွေကိုပဲ ချုပ်ထားပါတယ်။
- `Copyright.js` က `App.js` ရဲ့ အောက်မှာ ပေါ်ပေမယ့် — render tree ထဲမှာတော့ — `Copyright` component က `InspirationGenerator` ရဲ့ child အဖြစ် ပေါ်ပါတယ်။ ဒါက — `InspirationGenerator` က JSX တွေကို [children props](/docs/react/props) အဖြစ် လက်ခံလို့ — `Copyright` ကို child component အဖြစ် render လုပ်ပေမယ့် — module ကို import မလုပ်လို့ပါ။

Dependency trees တွေက — သင့် React app ကို run ဖို့ ဘယ် modules တွေ လိုအပ်လဲဆိုတာ ဆုံးဖြတ်ဖို့ အသုံးဝင်ပါတယ်။ Production အတွက် React app တစ်ခု တည်ဆောက်တဲ့အခါ — client ဆီ ပို့ဖို့ JavaScript အားလုံးကို bundle လုပ်ပေးမယ့် build step တစ်ခု ပုံမှန် ပါပါတယ်။ ဒီအလုပ်အတွက် တာဝန်ရှိတဲ့ tool ကို [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem) လို့ ခေါ်ပြီး — bundlers တွေက ဘယ် modules တွေ ထည့်သင့်လဲ ဆုံးဖြတ်ဖို့ dependency tree ကို သုံးပါတယ်။

App ကြီးလာတာနဲ့အမျှ — bundle size လည်း မကြာခဏ ကြီးလာပါတယ်။ Bundle size ကြီးတာက — client အတွက် download လုပ်ပြီး run ဖို့ စရိတ်ကြီးပါတယ်။ Bundle size ကြီးတာက — သင့် UI ကို စတင်ရေးဆွဲနိုင်ဖို့ အချိန် နှောင့်နှေးစေနိုင်ပါတယ်။ သင့် app ရဲ့ dependency tree ကို သဘောပေါက်ထားတာက — ဒီလို ပြဿနာတွေကို debug လုပ်ဖို့ ကူညီနိုင်ပါတယ်။

## အကျဉ်းချုပ်

- Trees တွေက entity တွေကြားက ဆက်စပ်မှုတွေကို ကိုယ်စားပြုဖို့ သာမန်နည်းလမ်းတစ်ခုပါ။ UI တွေကို ပုံစံချဖို့ မကြာခဏ သုံးပါတယ်။
- Render trees တွေက — render တစ်ခုတည်းတစ်လျှောက် — React components တွေကြားက nested ဆက်စပ်မှုကို ကိုယ်စားပြုပါတယ်။
- Conditional rendering နဲ့ဆိုရင် — render tree က render မတူညီတာတွေကြားမှာ ပြောင်းလဲနိုင်ပါတယ်။ Prop value မတူညီတာတွေနဲ့ — components တွေက child components မတူညီတာတွေကို render လုပ်နိုင်ပါတယ်။
- Render trees တွေက top-level နဲ့ leaf components တွေကို ခွဲခြားသိဖို့ ကူညီပါတယ်။ Top-level components တွေက သူတို့အောက်က components တွေအားလုံးရဲ့ rendering performance ကို သက်ရောက်ပြီး — leaf components တွေက မကြာခဏ re-render ခံရလေ့ ရှိပါတယ်။ သူတို့ကို ခွဲခြားသိမှတ်နိုင်တာက rendering performance ကို နားလည်ပြီး debug လုပ်ဖို့ အသုံးဝင်ပါတယ်။
- Dependency trees တွေက React app တစ်ခုထဲက module dependencies တွေကို ကိုယ်စားပြုပါတယ်။
- App တစ်ခု ပို့ဖို့ လိုအပ်တဲ့ code ကို bundle လုပ်ဖို့ — build tools တွေက dependency trees တွေကို သုံးပါတယ်။
- Dependency trees တွေက — screen ပေါ် ရေးဆွဲချိန် နှေးစေတဲ့ — bundle size ကြီးတာတွေကို debug လုပ်ဖို့ အသုံးဝင်ပြီး — ဘယ် code ကို bundle လုပ်မလဲ optimize လုပ်ဖို့ အခွင့်အလမ်းတွေကိုလည်း ဖော်ပြပေးပါတယ်။
