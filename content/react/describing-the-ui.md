---
title: "UI ဖော်ပြခြင်း (Describing the UI)"
description: "React ရဲ့ UI တည်ဆောက်ပုံ အခြေခံ — component ဖန်တီးခြင်း၊ import/export လုပ်ခြင်း၊ JSX စည်းမျဉ်းတွေ၊ curly braces နဲ့ JavaScript၊ props ပို့ခြင်း၊ conditional rendering၊ list rendering၊ pure component တွေနဲ့ UI tree သဘောတရား"
order: 27
source: "https://react.dev/learn/describing-the-ui"
status: translated
updated: 2026-09-01
---

React က user interface (UI) တွေကို render လုပ်ဖို့အတွက် JavaScript library တစ်ခုပါ။ UI ကို button၊ text၊ image လိုမျိုး — သေးငယ်တဲ့ အစိတ်အပိုင်းလေးတွေကနေ တည်ဆောက်ထားပါတယ်။ React က ဒီအစိတ်အပိုင်းတွေကို ပြန်သုံးလို့ရပြီး အသိုက်အမြုံလိုက် ထည့်သွင်းလို့ရတဲ့ *component* တွေအဖြစ် ပေါင်းစပ်ခွင့် ပေးပါတယ်။ Website တွေကနေ phone app တွေအထိ — screen ပေါ်က အရာအားလုံးကို component တွေအဖြစ် ခွဲခြမ်းနိုင်ပါတယ်။ ဒီ chapter မှာ — React component တွေကို ဖန်တီးခြင်း၊ စိတ်ကြိုက်ပြင်ဆင်ခြင်းနဲ့ အခြေအနေအလိုက် ပြသခြင်းတွေကို သင်ယူရမှာ ဖြစ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- [ပထမဆုံး React Component ရေးခြင်း](/docs/react/your-first-component) — component တစ်ခုကို ဘယ်လို ကြေညာ/သုံးမလဲ
- [Component များ Import နဲ့ Export လုပ်ခြင်း](/docs/react/importing-and-exporting-components) — component အများအပြား ပါတဲ့ file တွေကို ဘယ်အချိန်မှာ/ဘယ်လို ဖွဲ့စည်းမလဲ
- [JSX နဲ့ Markup ရေးခြင်း](/docs/react/writing-markup-with-jsx) — JavaScript ထဲ markup ထည့်နည်း
- [Curly Braces များဖြင့် JSX ထဲ JavaScript ရေးခြင်း](/docs/react/javascript-in-jsx-with-curly-braces) — JSX ထဲကနေ JavaScript လုပ်ဆောင်ချက်တွေ သုံးနည်း
- [Props ပေးပို့ခြင်း](/docs/react/props) — component တွေကို props နဲ့ configure လုပ်ခြင်း
- [အခြေအနေအလိုက် Render လုပ်ခြင်း](/docs/react/conditional-rendering) — component တွေကို conditionally ပြသခြင်း
- [List များ Render လုပ်ခြင်း](/docs/react/rendering-lists) — component အများအပြားကို တစ်ပြိုင်နက် render လုပ်ခြင်း
- [Component များကို Pure ဖြစ်အောင် ထားခြင်း](/docs/react/keeping-components-pure) — component တွေ pure ဖြစ်နေမှ ရှုပ်ထွေးတဲ့ bug တွေကို ရှောင်နိုင်တာ
- [သင့် UI ကို Tree အဖြစ် နားလည်ခြင်း](/docs/react/understanding-your-ui-as-a-tree) — UI ကို tree အဖြစ် မြင်ခြင်းက ဘာကြောင့် အသုံးဝင်လဲ

## ပထမဆုံး Component

React application တွေက *component* လို့ခေါ်တဲ့ — UI ရဲ့ သီးခြားအစိတ်အပိုင်းတွေကနေ တည်ဆောက်ပါတယ်။ React component ဆိုတာ markup ထည့်ထားလို့ရတဲ့ JavaScript function တစ်ခုပါ။ Component တစ်ခုက button လောက် သေးနိုင်သလို — page တစ်ခုလုံးလောက်လည်း ကြီးနိုင်ပါတယ်။ ဒီမှာ `Profile` component သုံးခုကို render လုပ်တဲ့ `Gallery` component ကို ကြည့်ပါ:

```jsx
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

အသေးစိတ်ကို [ပထမဆုံး React Component](/docs/react/your-first-component) မှာ ကြည့်ပါ။

## Component တွေကို Import နဲ့ Export လုပ်ခြင်း

File တစ်ခုထဲမှာ component အများကြီး ကြေညာလို့ရပေမယ့် — file ကြီးလာတာနဲ့အမျှ သွားလာရခက်လာပါတယ်။ ဒါကို ဖြေရှင်းဖို့ — component တစ်ခုကို သူ့ရဲ့ file တစ်ခုထဲ *export* လုပ်ပြီး — အခြား file ကနေ *import* လုပ်နိုင်ပါတယ်။

[Component များ Import နဲ့ Export လုပ်ခြင်း](/docs/react/importing-and-exporting-components) မှာ component တွေကို ကိုယ်ပိုင် file တွေထဲ ဘယ်လို ခွဲထားမလဲဆိုတာ ဆက်ဖတ်ပါ။

## JSX နဲ့ Markup ရေးခြင်း

React component တစ်ခုစီဟာ — React က browser မှာ render လုပ်ပေးတဲ့ markup တချို့ ပါဝင်နိုင်တဲ့ JavaScript function တစ်ခုပါ။ React component တွေက အဲဒီ markup ကို ကိုယ်စားပြုဖို့ **JSX** လို့ခေါ်တဲ့ syntax extension တစ်ခုကို သုံးပါတယ်။ JSX က HTML နဲ့ အရမ်းဆင်ပေမယ့် — နည်းနည်း ပိုတင်းကျပ်ပြီး — dynamic information တွေကိုလည်း ပြသနိုင်ပါတယ်။

ရှိပြီးသား HTML markup ကို React component ထဲ တိုက်ရိုက် paste လုပ်ရင် — အမြဲတမ်း အလုပ်မလုပ်ပါဘူး။ ဥပမာ — HTML ရဲ့ `class` attribute အစား `className` သုံးရပါတယ်။ ရှိပြီးသား HTML တွေကို [converter](https://transform.tools/html-to-jsx) တစ်ခုနဲ့ ပြုပြင်နိုင်ပါတယ်:

```jsx
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
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

မှန်ကန်တဲ့ JSX ဘယ်လို ရေးမလဲဆိုတာ [JSX နဲ့ Markup ရေးခြင်း](/docs/react/writing-markup-with-jsx) မှာ ဆက်လေ့လာပါ။

## Curly Braces နဲ့ JavaScript သုံးခြင်း

JSX က JavaScript file တစ်ခုထဲမှာ HTML နဲ့တူတဲ့ markup ရေးနိုင်စေပြီး — rendering logic နဲ့ content ကို နေရာတစ်ခုတည်းမှာ ထားနိုင်ပါတယ်။ တစ်ခါတစ်ရံ — markup ထဲမှာ JavaScript logic နည်းနည်း ထည့်ချင်တာ၊ dynamic property တစ်ခုကို ကိုးကားချင်တာမျိုး ရှိပါတယ်။ အဲဒီအခါ — JSX ထဲမှာ curly braces `{}` သုံးပြီး JavaScript ဆီ "ပြတင်းပေါက် ဖွင့်" လို့ရပါတယ်:

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

JSX ကနေ JavaScript data တွေကို ဘယ်လို သုံးမလဲဆိုတာ [Curly Braces များဖြင့် JSX ထဲ JavaScript ရေးခြင်း](/docs/react/javascript-in-jsx-with-curly-braces) မှာ ဆက်ဖတ်ပါ။

## Props ပေးပို့ခြင်း

React component တွေက တစ်ခုနဲ့တစ်ခု ဆက်သွယ်ဖို့ *props* တွေကို သုံးပါတယ်။ Parent component တိုင်းက — child component တွေဆီ props တွေ ပေးခြင်းဖြင့် — အချက်အလက်တချို့ ပို့နိုင်ပါတယ်။ Props က HTML attribute တွေကို သတိရစေနိုင်ပေမယ့် — object၊ array၊ function နဲ့ JSX တောင် အပါအဝင် — JavaScript တန်ဖိုး ဘာကိုမဆို ပို့လို့ရပါတယ်။

[Props ပေးပို့ခြင်း](/docs/react/props) မှာ props တွေကို ဘယ်လို ပို့ပြီး ဖတ်မလဲ ဆက်လေ့လာပါ။

## အခြေအနေအလိုက် Render လုပ်ခြင်း

သင့် component တွေက — အခြေအနေအမျိုးမျိုးပေါ် မူတည်ပြီး — မတူတဲ့ အရာတွေ ပြသဖို့ မကြာခဏ လိုအပ်ပါတယ်။ React မှာ — `if` statements၊ `&&` နဲ့ `? :` operators လိုမျိုး JavaScript syntax တွေသုံးပြီး — JSX ကို conditionally render လုပ်နိုင်ပါတယ်။ ဒီဥပမာမှာ — JavaScript ရဲ့ `&&` operator ကို checkmark တစ်ခု conditionally ပြသဖို့ သုံးထားပါတယ်:

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

Content တွေကို conditionally render လုပ်တဲ့ နည်းလမ်းအမျိုးမျိုးကို [အခြေအနေအလိုက် Render လုပ်ခြင်း](/docs/react/conditional-rendering) မှာ လေ့လာပါ။

## List များ Render လုပ်ခြင်း

Data collection တစ်ခုကနေ — ဆင်တူတဲ့ component အများအပြားကို ပြသချင်တာ မကြာခဏ ရှိပါတယ်။ JavaScript ရဲ့ `filter()` နဲ့ `map()` တွေကို React နဲ့ တွဲသုံးပြီး — သင့် data array ကို component array တစ်ခုအဖြစ် ပြောင်းလဲနိုင်ပါတယ်။ Array item တစ်ခုချင်းစီအတွက် `key` တစ်ခု သတ်မှတ်ဖို့ လိုပါတယ် — ပုံမှန်အားဖြင့် database ကနေ ID ကို `key` အဖြစ် သုံးပါတယ်။ Keys တွေက — list ပြောင်းလဲသွားရင်တောင် — item တစ်ခုချင်းစီရဲ့ နေရာကို React က ခြေရာခံနိုင်စေပါတယ်။

[List များ Render လုပ်ခြင်း](/docs/react/rendering-lists) မှာ component list တစ်ခုကို ဘယ်လို render လုပ်ပြီး — key တစ်ခုကို ဘယ်လို ရွေးမလဲ ဆက်ဖတ်ပါ။

## Component တွေကို Pure ဖြစ်အောင် ထားခြင်း

JavaScript function တချို့က *pure* ဖြစ်ပါတယ်။ Pure function တစ်ခုမှာ:

- **ကိုယ့်ကိစ္စကိုယ် လုပ်တယ်** — ခေါ်လိုက်ခင် ရှိပြီးသား object တွေ၊ variable တွေကို မပြောင်းပါဘူး။
- **တူညီတဲ့ input၊ တူညီတဲ့ output** — input အတူတူ ပေးရင် — pure function က အမြဲတမ်း ရလဒ်အတူတူ ပြန်ပေးပါတယ်။

Component တွေကို pure functions တွေအဖြစ်သာ တင်းတင်းကျပ်ကျပ် ရေးခြင်းဖြင့် — codebase ကြီးလာတာနဲ့အမျှ — ရှုပ်ထွေးတဲ့ bug တွေနဲ့ ခန့်မှန်းလို့မရတဲ့ အပြုအမူတွေ တစ်မျိုးလုံးကို ရှောင်ရှားနိုင်ပါတယ်။ ဒီမှာ impure component ဥပမာတစ်ခုပါ:

```jsx
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable! → မကောင်းပါ — ရှိပြီးသား variable ကို ပြောင်းနေပါတယ်!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

ရှိပြီးသား variable တစ်ခုကို ပြုပြင်မယ့်အစား — prop တစ်ခု ပေးခြင်းဖြင့် — ဒီ component ကို pure ဖြစ်အောင် လုပ်နိုင်ပါတယ်:

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

Component တွေကို pure၊ predictable functions တွေအဖြစ် ဘယ်လို ရေးမလဲ — [Component များကို Pure ဖြစ်အောင် ထားခြင်း](/docs/react/keeping-components-pure) မှာ ဆက်လေ့လာပါ။

## သင့် UI ကို Tree အဖြစ် နားလည်ခြင်း

React က component တွေနဲ့ module တွေကြားက ဆက်နွယ်မှုတွေကို ပုံဖော်ဖို့ tree တွေကို သုံးပါတယ်။ React **render tree** က component တွေကြားက parent-child ဆက်နွယ်မှုကို ကိုယ်စားပြုပါတယ် — tree ရဲ့ အပေါ်ဆုံး (root အနီး) မှာ ရှိတဲ့ component တွေကို top-level component လို့ သတ်မှတ်ပြီး — child component မရှိတာတွေကို leaf component လို့ ခေါ်ပါတယ်။ ဒီအမျိုးအစားခွဲခြားမှုက data flow နဲ့ rendering performance တွေကို နားလည်ဖို့ အသုံးဝင်ပါတယ်။

JavaScript module တွေကြားက ဆက်နွယ်မှုကို **module dependency tree** အနေနဲ့လည်း ပုံဖော်လို့ရပါတယ် — build tools တွေက client ကို download လုပ်စေဖို့ လိုအပ်တဲ့ JavaScript code တွေအားလုံးကို bundle လုပ်ဖို့ ဒီ tree ကို မကြာခဏ သုံးပါတယ်။ Bundle size ကြီးရင် React app တွေရဲ့ user experience ကို ထိခိုက်စေတာမို့ — module dependency tree ကို နားလည်ထားတာက ဒီလို ပြဿနာတွေကို debug လုပ်ဖို့ အထောက်အကူ ဖြစ်ပါတယ်။

အသေးစိတ်ကို [သင့် UI ကို Tree အဖြစ် နားလည်ခြင်း](/docs/react/understanding-your-ui-as-a-tree) မှာ ကြည့်ပါ။

## နောက်တစ်ဆင့်တွေ

- [ပထမဆုံး React Component](/docs/react/your-first-component) ကနေ စပြီး — ဒီ chapter ကို page တစ်ခုချင်းစီ ဖတ်သွားနိုင်ပါတယ်။
- ဒီအကြောင်းအရာတွေ သိပြီးသားဆိုရင် — [Interactivity ထည့်သွင်းခြင်း](/docs/react/adding-interactivity) ကို ဆက်ဖတ်ပါ။
