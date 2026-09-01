---
title: "Component များကို Pure ဖြစ်အောင် ထားခြင်း (Keeping Components Pure)"
description: "Pure function ဆိုတာ ဘာလဲ — render phase ထဲက ပြောင်းလဲမှုတွေ (mutation) ကို ရှောင်ဖို့ component တွေကို ဘယ်လို pure ဖြစ်အောင် ထားမလဲ၊ Strict Mode နဲ့ အမှားရှာနည်း"
order: 21
source: "https://react.dev/learn/keeping-components-pure"
status: translated
updated: 2026-09-01
---

JavaScript function တချို့က *pure* ဖြစ်ပါတယ်။ Pure functions တွေက တွက်ချက်မှုတစ်ခုပဲ လုပ်ပြီး — ဘာမှ ပိုမလုပ်ပါဘူး။ သင့် component တွေကို pure functions အဖြစ်ပဲ တင်းကြပ်စွာ ရေးခြင်းဖြင့် — သင့် codebase ကြီးထွားလာတာနဲ့အမျှ — ရှုပ်ထွေးတဲ့ bug တွေနဲ့ ခန့်မှန်းလို့မရတဲ့ အပြုအမူ တစ်မျိုးလုံးကို ရှောင်ရှားနိုင်ပါတယ်။ ဒါပေမယ့် — ဒီအကျိုးကျေးဇူးတွေ ရဖို့ — သင်လိုက်နာရမယ့် စည်းမျဉ်း အနည်းငယ် ရှိပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Purity ဆိုတာ ဘာလဲ — သူက bug တွေကို ရှောင်ရှားဖို့ ဘယ်လို ကူညီလဲ
- Render phase ကနေ ပြောင်းလဲမှုတွေကို ထုတ်ထားခြင်းဖြင့် — component တွေကို pure ဖြစ်အောင် ဘယ်လို ထားမလဲ
- သင့် component တွေထဲက အမှားတွေကို ရှာဖို့ Strict Mode ကို ဘယ်လို သုံးမလဲ

## Purity — Component တွေက Formula တွေလိုပါပဲ

Computer science (အထူးသဖြင့် functional programming လောက) မှာ — [pure function](https://wikipedia.org/wiki/Pure_function) တစ်ခုဆိုတာ ဒီလက္ခဏာတွေ ရှိတဲ့ function ပါ:

- **သူ့ကိစ္စနဲ့သူ နေပါတယ်။** သူ့ကို မခေါ်ခင်က တည်ရှိခဲ့တဲ့ object တွေ ဒါမှမဟုတ် variable တွေကို မပြောင်းလဲပါဘူး။
- **Input တူရင် output တူပါတယ်။** Input တူညီပေးထားရင် — pure function တစ်ခုက ရလဒ်တူတူကို အမြဲတမ်း ပြန်ပေးရပါတယ်။

Pure functions တွေရဲ့ ဥပမာတစ်ခုကို သင်သိပြီးသား ဖြစ်နိုင်ပါတယ်: သင်္ချာမှာက formula တွေပါ။

ဒီသင်္ချာ formula ကို ကြည့်ပါ: `y = 2x`။

`x = 2` ဆိုရင် `y = 4` ဖြစ်ပါတယ်။ အမြဲတမ်းပါ။

`x = 3` ဆိုရင် `y = 6` ဖြစ်ပါတယ်။ အမြဲတမ်းပါ။

`x = 3` ဆိုရင် — `y` က တစ်ခါတစ်ရံ `9` ဒါမှမဟုတ် `–1` ဒါမှမဟုတ် `2.5` ဖြစ်မှာ မဟုတ်ပါဘူး — နေ့အချိန် ဒါမှမဟုတ် စတော့ဈေးကွက် အခြေအနေပေါ်မူတည်ပြီးတော့လည်း မဟုတ်ပါဘူး။

`y = 2x` ဖြစ်ပြီး `x = 3` ဆိုရင် — `y` က _အမြဲတမ်း_ `6` ဖြစ်ပါတယ်။

ဒါကို JavaScript function တစ်ခု အနေနဲ့ လုပ်လိုက်ရင် — ဒီလိုမျိုး ဖြစ်ပါလိမ့်မယ်:

```jsx
function double(number) {
  return 2 * number;
}
```
အထက်က ဥပမာမှာ — `double` က **pure function** တစ်ခုပါ။ သူ့ဆီ `3` ပို့ရင် — `6` ပြန်ပေးပါတယ်။ အမြဲတမ်းပါ။

React က ဒီအယူအဆကို ဗဟိုပြုပြီး ဒီဇိုင်းထားပါတယ်။ **React က သင်ရေးတဲ့ component တိုင်းက pure function တစ်ခုလို့ ယူဆပါတယ်။** ဒါက ဆိုလိုတာက — သင်ရေးတဲ့ React components တွေက input တူညီပေးထားရင် — JSX တူတူကို အမြဲတမ်း ပြန်ပေးရပါမယ်:

```jsx
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```
`Recipe` ဆီ `drinkers={2}` ပို့လိုက်တဲ့အခါ — `2 cups of water` ပါတဲ့ JSX ကို ပြန်ပေးပါလိမ့်မယ်။ အမြဲတမ်းပါ။

`drinkers={4}` ပို့လိုက်ရင် — `4 cups of water` ပါတဲ့ JSX ကို ပြန်ပေးပါလိမ့်မယ်။ အမြဲတမ်းပါ။

သင်္ချာ formula တစ်ခုလိုပါပဲ။

သင့် component တွေကို recipe (ချက်နည်း) တွေလို့ ထင်နိုင်ပါတယ်: ချက်နည်းအတိုင်း လိုက်လုပ်ပြီး — ချက်နေတုန်း ပါဝင်ပစ္စည်း အသစ်တွေ မထည့်ရင် — တစ်ခါတိုင်း ဟင်းတစ်ခွက်တည်း ရပါလိမ့်မယ်။ အဲဒီ "ဟင်း" က — component က React ဆီ [render](/docs/react/render-and-commit) လုပ်ဖို့ ပေးတဲ့ JSX ပါ။

> _Diagram:_ x ယောက်အတွက် လက်ဖက်ရည် recipe တစ်ခု — ရေ x ခွက် ယူပြီး — လက်ဖက်ခြောက် x ဇွန်းနဲ့ ဟင်းခတ်အမွှေးအကြိုင် 0.5x ဇွန်း၊ နို့ 0.5x ခွက် ထည့်ပါ။

## Side Effects — (မလိုလားအပ်တဲ့) ဆိုးကျိုးတွေ

React ရဲ့ rendering လုပ်ငန်းစဉ်က အမြဲတမ်း pure ဖြစ်ရပါမယ်။ Component တွေက သူတို့ရဲ့ JSX ကိုပဲ *ပြန်ပေး* ရပြီး — rendering မလုပ်ခင် တည်ရှိခဲ့တဲ့ object တွေ ဒါမှမဟုတ် variable တွေကို *မပြောင်းလဲ* ရပါဘူး — ပြောင်းလဲရင် impure ဖြစ်သွားပါတယ်!

ဒီစည်းမျဉ်းကို ချိုးဖောက်တဲ့ component တစ်ခု ဒီမှာ ရှိပါတယ်:

```jsx
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable! → မကောင်းဘူး: ရှိပြီးသား variable တစ်ခုကို ပြောင်းနေတာ!
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
ဒီ component က — သူ့အပြင်မှာ ကြေညာထားတဲ့ `guest` variable တစ်ခုကို ဖတ်ပြီး ရေးနေပါတယ်။ ဒါက ဆိုလိုတာက — **ဒီ component ကို အကြိမ်များစွာ ခေါ်ရင် — JSX မတူညီတာတွေ ထွက်လာပါလိမ့်မယ်!** ဒါ့အပြင် — _တခြား_ component တွေက `guest` ကို ဖတ်ရင် — သူတို့ ဘယ်အချိန် render ဖြစ်လဲပေါ်မူတည်ပြီး — သူတို့ပါ JSX မတူညီတာ ထွက်လာပါလိမ့်မယ်! အဲဒါက ခန့်မှန်းလို့ မရပါဘူး။

ကျွန်တော်တို့ရဲ့ formula `y = 2x` ဆီ ပြန်သွားရင် — အခု `x = 2` ဖြစ်ရင်တောင် — `y = 4` လို့ ယုံကြည်လို့ မရတော့ပါဘူး။ ကျွန်တော်တို့ရဲ့ tests တွေ ကျရှုံးနိုင်တယ်၊ user တွေ ရှုပ်ထွေးသွားနိုင်တယ်၊ လေယာဉ်တွေ ကောင်းကင်ကနေ ပြုတ်ကျနိုင်တယ် — ဒါက ဘယ်လို ရှုပ်ထွေးတဲ့ bug တွေ ဖြစ်စေနိုင်လဲ သင်မြင်ရပါတယ်!

ဒီ component ကို [`guest` ကို prop အဖြစ် ပို့ခြင်း](/docs/react/passing-props-to-a-component) ဖြင့် ပြုပြင်နိုင်ပါတယ်:

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
အခု သင့် component က pure ဖြစ်ပါပြီ — ဘာလို့လဲဆိုတော့ — သူပြန်ပေးတဲ့ JSX က `guest` prop ပေါ်မှာပဲ မူတည်လို့ပါ။

ယေဘုယျအားဖြင့် — သင့် component တွေက အစဉ်တကျ သီးသန့်တစ်ခုခု render ဖြစ်မယ်လို့ မမျှော်လင့်သင့်ပါဘူး။ `y = 2x` ကို `y = 5x` ရဲ့ ရှေ့မှာ ခေါ်တာ ဒါမှမဟုတ် နောက်မှာ ခေါ်တာ — အရေးမကြီးပါဘူး: formula နှစ်ခုလုံးက တစ်ခုနဲ့တစ်ခု မသက်ဆိုင်ဘဲ သီးခြား ဖြေရှင်းပါတယ်။ ဒီနည်းအတိုင်းပဲ — component တစ်ခုချင်းစီက "ကိုယ့်ဟာကိုယ် စဉ်းစား" ရမှာဖြစ်ပြီး — rendering အတွင်း တခြားသူတွေနဲ့ ညှိနှိုင်းဖို့ ဒါမှမဟုတ် မှီခိုဖို့ မကြိုးစားသင့်ပါဘူး။ Rendering က ကျောင်းစာမေးပွဲတစ်ခုလိုပါ: component တစ်ခုချင်းစီက JSX ကို ကိုယ်တိုင် တွက်သင့်ပါတယ်!

#### StrictMode နဲ့ Impure တွက်ချက်မှုတွေကို ရှာဖွေခြင်း

သင် အကုန်လုံး မသုံးရသေးပေမယ့် — React မှာ rendering လုပ်နေတုန်း ဖတ်လို့ရတဲ့ input သုံးမျိုး ရှိပါတယ်: [props](/docs/react/passing-props-to-a-component)၊ [state](/docs/react/state-a-components-memory) နဲ့ [context](/docs/react/passing-data-deeply-with-context) တို့ပါ။ ဒီ inputs တွေကို အမြဲတမ်း read-only အဖြစ် သဘောထားရပါမယ်။

User input ကို တုံ့ပြန်တဲ့အနေနဲ့ တစ်ခုခုကို *ပြောင်းလဲ* ချင်တဲ့အခါ — variable တစ်ခုကို ရေးမယ့်အစား — [state ကို set လုပ်](/docs/react/state-a-components-memory) သင့်ပါတယ်။ သင့် component render လုပ်နေတုန်း — ရှိပြီးသား variables တွေ ဒါမှမဟုတ် objects တွေကို ဘယ်တော့မှ မပြောင်းသင့်ပါဘူး။

React က "Strict Mode" တစ်ခု ပေးထားပြီး — အဲဒီထဲမှာ development အတွင်း — component တစ်ခုချင်းစီရဲ့ function ကို နှစ်ကြိမ် ခေါ်ပါတယ်။ **Component functions တွေကို နှစ်ကြိမ် ခေါ်ခြင်းဖြင့် — Strict Mode က ဒီစည်းမျဉ်းတွေကို ချိုးဖောက်တဲ့ components တွေကို ရှာတွေ့အောင် ကူညီပေးပါတယ်။**

မူရင်း ဥပမာက "Guest #1"၊ "Guest #2"၊ "Guest #3" အစား — "Guest #2"၊ "Guest #4"၊ "Guest #6" တွေကို ပြခဲ့တာကို သတိပြုပါ။ မူရင်း function က impure ဖြစ်လို့ — နှစ်ကြိမ် ခေါ်လိုက်တာနဲ့ ပျက်စီးသွားပါတယ်။ ဒါပေမယ့် — ပြုပြင်ထားတဲ့ pure version ကတော့ — function ကို နှစ်ကြိမ်တိုင်း ခေါ်ရင်တောင် — ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ **Pure functions တွေက တွက်ချက်ရုံပဲ လုပ်လို့ — သူတို့ကို နှစ်ကြိမ် ခေါ်တာက ဘာမှ မပြောင်းလဲစေပါဘူး** — `double(2)` ကို နှစ်ကြိမ် ခေါ်တာက ပြန်ရတဲ့အရာကို မပြောင်းသလိုပဲ — `y = 2x` ကို နှစ်ကြိမ် ဖြေရှင်းတာက `y` ရဲ့ တန်ဖိုးကို မပြောင်းပါဘူး။ Input တူတူဆိုရင် — output တူတူပါ။ အမြဲတမ်းပါ။

Strict Mode က production မှာ ဘာသက်ရောက်မှုမှ မရှိလို့ — သင့် user တွေအတွက် app ကို နှေးစေမှာ မဟုတ်ပါဘူး။ Strict Mode ကို opt in လုပ်ဖို့ — သင့် root component ကို `<React.StrictMode>` ထဲမှာ ထုပ်ပေးနိုင်ပါတယ်။ Framework တချို့က ဒါကို default အနေနဲ့ လုပ်ပေးပါတယ်။

### Local Mutation — သင့် Component ရဲ့ လျှို့ဝှက်ချက်လေး

အထက်က ဥပမာမှာ — ပြဿနာက component က render လုပ်နေတုန်း — *ရှိပြီးသား* variable တစ်ခုကို ပြောင်းလဲလို့ပါ။ ဒါကို နည်းနည်း ကြောက်စရာကောင်းအောင် — **"mutation"** လို့ မကြာခဏ ခေါ်ပါတယ်။ Pure functions တွေက — function ရဲ့ scope အပြင်က variables တွေ ဒါမှမဟုတ် — ခေါ်ချိန်မတိုင်ခင် ဖန်တီးထားတဲ့ objects တွေကို mutate မလုပ်ပါဘူး — အဲဒါတွေက impure ဖြစ်စေပါတယ်!

ဒါပေမယ့် — **rendering လုပ်နေတုန်း သင်က *အခုမှ* ဖန်တီးထားတဲ့ variables တွေနဲ့ objects တွေကို ပြောင်းလဲတာက လုံးဝ အဆင်ပြေပါတယ်။** ဒီဥပမာမှာ — `[]` array တစ်ခု ဖန်တီးပြီး — `cups` variable ဆီ သတ်မှတ်ကာ — ခွက် ဒါဇင်တစ်ဝက် push လုပ်ထားပါတယ်:

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```
`cups` variable ဒါမှမဟုတ် `[]` array ကို `TeaGathering` function ရဲ့ အပြင်မှာ ဖန်တီးထားရင် — ဒါက ကြီးမားတဲ့ ပြဿနာတစ်ခု ဖြစ်ပါလိမ့်မယ်! အဲဒီ array ထဲ items တွေ push လုပ်ခြင်းဖြင့် — *ရှိပြီးသား* object တစ်ခုကို ပြောင်းလဲနေတာ ဖြစ်လို့ပါ။

ဒါပေမယ့် — သူတို့ကို `TeaGathering` ရဲ့ အတွင်းမှာ — *render တစ်ခုတည်းအတွင်း* ဖန်တီးထားတာမို့ — အဆင်ပြေပါတယ်။ `TeaGathering` ရဲ့ အပြင်က code ဘယ်ဟာမှ ဒီဖြစ်ရပ်ကို သိမှာ မဟုတ်ပါဘူး။ ဒါကို **"local mutation"** လို့ ခေါ်ပြီး — သင့် component ရဲ့ လျှို့ဝှက်ချက်လေး လိုပါပဲ။

## Side Effects တွေကို ဘယ်မှာ ဖြစ်စေနိုင်လဲ

Functional programming က purity ပေါ်မှာ အများကြီး မှီခိုပေမယ့် — တစ်ချိန်ချိန်မှာ၊ တစ်နေရာရာမှာ — _တစ်ခုခု_ ကတော့ ပြောင်းလဲရပါတယ်။ အဲဒါက programming ရဲ့ ရည်ရွယ်ချက်လိုပါပဲ! ဒီပြောင်းလဲမှုတွေ — screen ကို update လုပ်တာ၊ animation စတင်တာ၊ data ကို ပြောင်းတာ — ကို **side effects** လို့ ခေါ်ပါတယ်။ သူတို့က rendering အတွင်း မဟုတ်ဘဲ — _"ဘေးချင်း"_ ဖြစ်ပျက်တဲ့ အရာတွေပါ။

React မှာ — **side effects တွေက များသောအားဖြင့် [event handlers](/docs/react/responding-to-events) အတွင်းမှာ ဖြစ်လေ့ ရှိပါတယ်။** Event handlers တွေက — သင်တစ်ခုခု လုပ်ဆောင်တဲ့အခါ (ဥပမာ — button တစ်ခု နှိပ်လိုက်တဲ့အခါ) React က run လုပ်ပေးတဲ့ functions တွေပါ။ Event handlers တွေက သင့် component ရဲ့ *အတွင်းမှာ* သတ်မှတ်ထားပေမယ့် — သူတို့က rendering အတွင်း *မှာ* run လုပ်တာ မဟုတ်ပါဘူး! **ဒါကြောင့် — event handlers တွေက pure ဖြစ်စရာ မလိုပါဘူး။**

တခြား နည်းလမ်းတွေ အကုန်ကုန်ပြီး — သင့် side effect အတွက် မှန်ကန်တဲ့ event handler တစ်ခုကို မတွေ့နိုင်ဘူးဆိုရင် — သင့် component ထဲမှာ [`useEffect`](https://react.dev/reference/react/useEffect) ခေါ်တာနဲ့ — ပြန်ပေးတဲ့ JSX ဆီ ချိတ်ဆက်နိုင်ပါသေးတယ်။ ဒါက side effects တွေ ခွင့်ပြုထားတဲ့ — rendering ပြီးတဲ့နောက်မှာ — နောက်မှ execute လုပ်ဖို့ React ကို ပြောပါတယ်။ **ဒါပေမယ့် — ဒီနည်းလမ်းက နောက်ဆုံး နည်းလမ်းဖြစ်သင့်ပါတယ်။**

တတ်နိုင်ရင် — သင့် logic ကို rendering တစ်ခုတည်းနဲ့ ဖော်ပြဖို့ ကြိုးစားပါ။ ဒါက ဘယ်လောက်အထိ ခေါ်သွားနိုင်လဲဆိုတာ သင်အံ့သြသွားပါလိမ့်မယ်!

#### React က Purity ကို ဘာကြောင့် ဂရုစိုက်တာလဲ

Pure functions တွေ ရေးတာက အလေ့အကျင့်နဲ့ စည်းကမ်း လိုအပ်ပါတယ်။ ဒါပေမယ့် — အံ့ဖွယ်ကောင်းတဲ့ အခွင့်အလမ်းတွေကိုလည်း ဖွင့်ပေးပါတယ်:

- သင့် component တွေက မတူညီတဲ့ environment တစ်ခုမှာ — ဥပမာ — server ပေါ်မှာ run နိုင်ပါတယ်! Input တူတူအတွက် ရလဒ်တူတူ ပြန်ပေးတာမို့ — component တစ်ခုက user requests အများအပြားကို ဆောင်ရွက်ပေးနိုင်ပါတယ်။
- Input တွေ မပြောင်းတဲ့ [component တွေရဲ့ rendering ကို ကျော်လိုက်ခြင်း](/reference/react/memo) ဖြင့် — performance ကို မြှင့်တင်နိုင်ပါတယ်။ Pure functions တွေက ရလဒ်တူတူ အမြဲ ပြန်ပေးလို့ — cache လုပ်ဖို့ လုံခြုံတာမို့ — ဒါက ဘေးကင်းပါတယ်။
- Component tree တစ်ခု နက်နက်ရှိုင်းရှိုင်း render လုပ်နေတုန်း — data တစ်ချို့ ပြောင်းသွားရင် — React က ခေတ်မမီတော့တဲ့ render ကို အပြီးသတ်ဖို့ အချိန်မဖြုန်းဘဲ — rendering ကို ပြန်စနိုင်ပါတယ်။ Purity က ဘယ်အချိန် မဆို တွက်ချက်မှု ရပ်လိုက်တာ လုံခြုံစေပါတယ်။

ကျွန်တော်တို့ တည်ဆောက်နေတဲ့ React feature အသစ်တိုင်းက purity ကို အခွင့်ကောင်း ယူပါတယ်။ Data fetching ကနေ animations တွေ၊ performance အထိ — component တွေကို pure ဖြစ်အောင် ထားတာက React paradigm ရဲ့ အစွမ်းကို ဖွင့်ပေးပါတယ်။

## အကျဉ်းချုပ်

- Component တစ်ခုက pure ဖြစ်ရပါမယ် — ဆိုလိုတာက:
  - **သူ့ကိစ္စနဲ့သူ နေရမယ်။** Rendering မလုပ်ခင် တည်ရှိခဲ့တဲ့ object တွေ ဒါမှမဟုတ် variable တွေကို မပြောင်းလဲသင့်ပါဘူး။
  - **Input တူရင် output တူရမယ်။** Input တူညီပေးထားရင် — component တစ်ခုက JSX တူတူကို အမြဲတမ်း ပြန်ပေးရပါမယ်။
- Rendering က ဘယ်အချိန် မဆို ဖြစ်နိုင်လို့ — component တွေက တစ်ခုနဲ့တစ်ခုရဲ့ rendering sequence ပေါ်မှာ မမှီခိုသင့်ပါဘူး။
- သင့် component တွေ rendering အတွက် သုံးတဲ့ inputs တွေထဲက ဘယ်ဟာကိုမှ mutate မလုပ်သင့်ပါဘူး။ အဲဒါတွေထဲမှာ props၊ state နဲ့ context တွေ ပါဝင်ပါတယ်။ Screen ကို update လုပ်ဖို့ — ရှိပြီးသား objects တွေကို mutate လုပ်မယ့်အစား — state ကို ["set" လုပ်](/docs/react/state-a-components-memory) ပါ။
- သင့် component ရဲ့ logic ကို သင်ပြန်ပေးတဲ့ JSX ထဲမှာ ဖော်ပြဖို့ ကြိုးစားပါ။ "အရာတွေ ပြောင်းလဲဖို့" လိုတဲ့အခါ — များသောအားဖြင့် event handler တစ်ခုထဲမှာ လုပ်ချင်ပါလိမ့်မယ်။ နောက်ဆုံး နည်းလမ်းအနေနဲ့ — `useEffect` ကို သုံးနိုင်ပါတယ်။
- Pure functions တွေ ရေးတာက လေ့ကျင့်မှု နည်းနည်း လိုပေမယ့် — React ရဲ့ paradigm ရဲ့ အစွမ်းကို ဖွင့်ပေးပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### ပျက်နေတဲ့ နာရီတစ်လုံးကို ပြုပြင်ခြင်း

ဒီ component က — သန်းခေါင်ယံကနေ မနက် ခြောက်နာရီ အတွင်းမှာ — `<h1>` ရဲ့ CSS class ကို `"night"` အဖြစ် သတ်မှတ်ပြီး — တခြားအချိန် အားလုံးမှာ `"day"` အဖြစ် သတ်မှတ်ဖို့ ကြိုးစားပါတယ်။ ဒါပေမယ့် — အလုပ်မလုပ်ပါဘူး။ ဒီ component ကို ပြုပြင်နိုင်ပါသလား?

ကွန်ပျူတာရဲ့ timezone ကို ခဏ ပြောင်းပြီး — သင့် ဖြေရှင်းနည်း အလုပ်လုပ်မလုပ် စစ်ဆေးနိုင်ပါတယ်။ လက်ရှိ အချိန်က သန်းခေါင်ယံကနေ မနက် ခြောက်နာရီကြားမှာ ဆိုရင် — နာရီက ပြောင်းပြန် အရောင်တွေ ရှိသင့်ပါတယ်!

> **အရိပ်အမြွက်:** Rendering က *တွက်ချက်မှု* တစ်ခုပါ — အဲဒါက "အရာတွေကို လုပ်ဆောင်" ဖို့ မကြိုးစားသင့်ပါဘူး။ တူညီတဲ့ အတွေးကို နည်းလမ်း တစ်မျိုးတည်းနဲ့ ဖော်ပြနိုင်ပါသလား?

```jsx
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```
```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```
#### အဖြေ

`className` ကို တွက်ပြီး — render output ထဲမှာ ထည့်ခြင်းဖြင့် — ဒီ component ကို ပြုပြင်နိုင်ပါတယ်:

```jsx
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```
```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```
ဒီဥပမာမှာ — side effect (DOM ကို ပြုပြင်တာ) က လုံးဝ မလိုအပ်ပါဘူး။ JSX ပြန်ပေးဖို့ပဲ လိုပါတယ်။

### ပျက်နေတဲ့ Profile တစ်ခုကို ပြုပြင်ခြင်း

`Profile` component နှစ်ခုကို — data မတူညီတာတွေနဲ့ — ဘေးချင်းကပ် render လုပ်ထားပါတယ်။ ပထမ profile ပေါ်မှာ "Collapse" ကို နှိပ်ပြီး — ပြီးရင် "Expand" လုပ်ကြည့်ပါ။ Profile နှစ်ခုလုံးက အခု လူတစ်ယောက်တည်းကိုပဲ ပြနေတာကို သတိပြုမိပါလိမ့်မယ်။ ဒါက bug တစ်ခုပါ။

Bug ရဲ့ အကြောင်းရင်းကို ရှာပြီး — ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Buggy code က `Profile.js` ထဲမှာပါ။ အပေါ်ကနေ အောက်အထိ — အကုန် ဖတ်ဖို့ သေချာပါစေ!

```jsx
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```
```jsx
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```
```jsx
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```
```jsx
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```
```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```
#### အဖြေ

ပြဿနာက — `Profile` component က `currentPerson` လို့ ခေါ်တဲ့ ရှိပြီးသား variable တစ်ခုကို ရေးနေပြီး — `Header` နဲ့ `Avatar` components တွေက အဲဒီကနေ ဖတ်နေလို့ပါ။ ဒါက *သုံးခုလုံးကို* impure ဖြစ်စေပြီး — ခန့်မှန်းဖို့ ခက်စေပါတယ်။

Bug ကို ပြုပြင်ဖို့ — `currentPerson` variable ကို ဖယ်ရှားပါ။ အဲဒီအစား — `Profile` ကနေ `Header` နဲ့ `Avatar` ဆီ — အချက်အလက် အားလုံးကို props တွေကနေ ပို့ပါ။ Component နှစ်ခုလုံးဆီ `person` prop တစ်ခု ထည့်ပြီး — အောက်ဆုံးအထိ ပို့ပေးဖို့ လိုပါလိမ့်မယ်။

```jsx
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```
```jsx
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```
```jsx
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```
```jsx
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```
```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```
React က component functions တွေ ဘယ်အစဉ်လိုက် execute ဖြစ်မယ်ဆိုတာ အာမမခံဘူးဆိုတာ သတိရပါ — ဒါကြောင့် — variables တွေ သတ်မှတ်ခြင်းဖြင့် သူတို့ကြားမှာ ဆက်သွယ်လို့ မရပါဘူး။ ဆက်သွယ်မှု အားလုံးက props တွေကနေ ဖြစ်ရပါမယ်။

### ပျက်နေတဲ့ Story Tray တစ်ခုကို ပြုပြင်ခြင်း

သင့် ကုမ္ပဏီရဲ့ CEO က — သင့် online clock app ထဲ "stories" တွေ ထည့်ဖို့ တောင်းဆိုနေပြီး — ငြင်းလို့ မရပါဘူး။ သင် `StoryTray` component တစ်ခု ရေးထားပြီး — ဒါက `stories` list တစ်ခု လက်ခံပြီး — နောက်မှာ "Create Story" placeholder တစ်ခု ပါပါတယ်။

သင် "Create Story" placeholder ကို — prop အဖြစ် လက်ခံရတဲ့ `stories` array ရဲ့ အဆုံးမှာ — fake story တစ်ခု ထပ်ပြီး push လုပ်ခြင်းဖြင့် implement လုပ်ထားပါတယ်။ ဒါပေမယ့် — တစ်ချို့ အကြောင်းရင်းကြောင့် — "Create Story" က တစ်ကြိမ်ထက် ပိုပြီး ပေါ်နေပါတယ်။ ပြဿနာကို ပြုပြင်ပါ။

```jsx
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  // → HACK: docs ဖတ်နေတုန်း memory က ထာဝရ မကြီးထွားအောင် ကာကွယ်တာပါ။
  // → ဒီမှာ ကျွန်တော်တို့က ကိုယ့် စည်းမျဉ်းတွေကိုယ် ချိုးနေတာပါ။
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```
```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```
#### အဖြေ

Clock update ဖြစ်တိုင်း — "Create Story" က *နှစ်ကြိမ်* ထပ်တိုးသွားတာကို သတိပြုပါ။ ဒါက rendering အတွင်း mutation တစ်ခု ရှိနေတယ်ဆိုတဲ့ အရိပ်အမြွက်ပါ — Strict Mode က ဒီပြဿနာတွေ ပိုသိသာစေဖို့ components တွေကို နှစ်ကြိမ် ခေါ်တာပါ။

`StoryTray` function က pure မဟုတ်ပါဘူး။ လက်ခံရတဲ့ `stories` array (prop တစ်ခုပါ!) ပေါ်မှာ `push` ခေါ်ခြင်းဖြင့် — `StoryTray` rendering မစခင် *ကတည်းက* ဖန်တီးထားတဲ့ object တစ်ခုကို mutate လုပ်နေပါတယ်။ ဒါက သူ့ကို buggy ဖြစ်စေပြီး — ခန့်မှန်းဖို့ အရမ်း ခက်စေပါတယ်။

အရိုးရှင်းဆုံး ပြုပြင်နည်းက — array ကို လုံးဝ မထိဘဲ — "Create Story" ကို သီးခြား render လုပ်တာပါ:

```jsx
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  // → HACK: docs ဖတ်နေတုန်း memory က ထာဝရ မကြီးထွားအောင် ကာကွယ်တာပါ။
  // → ဒီမှာ ကျွန်တော်တို့က ကိုယ့် စည်းမျဉ်းတွေကိုယ် ချိုးနေတာပါ။
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```
```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```
တစ်နည်းအားဖြင့် — item တစ်ခု push မလုပ်ခင် — _array အသစ်_ တစ်ခု (ရှိပြီးသား တစ်ခုကို copy လုပ်ပြီး) ဖန်တီးနိုင်ပါတယ်:

```jsx
export default function StoryTray({ stories }) {
  // Copy the array! → Array ကို copy လုပ်ပါ!
  const storiesToDisplay = stories.slice();

  // Does not affect the original array: → မူရင်း array ကို မထိခိုက်ပါဘူး:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  // → HACK: docs ဖတ်နေတုန်း memory က ထာဝရ မကြီးထွားအောင် ကာကွယ်တာပါ။
  // → ဒီမှာ ကျွန်တော်တို့က ကိုယ့် စည်းမျဉ်းတွေကိုယ် ချိုးနေတာပါ။
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```
```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```
ဒါက သင့် mutation ကို local ဖြစ်စေပြီး — သင့် rendering function ကို pure ဖြစ်စေပါတယ်။ ဒါပေမယ့် — သတိထားဖို့ ဆဲဆဲ လိုပါသေးတယ်: ဥပမာ — array ထဲက ရှိပြီးသား item တစ်ခုခုကို ပြောင်းချင်ရင် — အဲဒီ items တွေကိုပါ clone လုပ်ရပါလိမ့်မယ်။

Array တွေပေါ်မှာ ဘယ် operations တွေက သူတို့ကို mutate လုပ်ပြီး — ဘယ်ဟာတွေက မလုပ်ဘူးဆိုတာ မှတ်ထားတာ အသုံးဝင်ပါတယ်။ ဥပမာ — `push`၊ `pop`၊ `reverse` နဲ့ `sort` တွေက မူရင်း array ကို mutate လုပ်ပါတယ် — ဒါပေမယ့် `slice`၊ `filter` နဲ့ `map` တွေကတော့ array အသစ်တစ်ခုကို ဖန်တီးပါတယ်။
