---
title: "Render လုပ်ခြင်းနဲ့ Commit လုပ်ခြင်း (Render and Commit)"
description: "Component တွေ screen ပေါ် မပေါ်ခင်မှာ ဖြတ်သန်းရတဲ့ အဆင့် သုံးဆင့် — trigger (render စတင်ခြင်း)၊ render (component ခေါ်ခြင်း)၊ commit (DOM ပြောင်းလဲခြင်း)"
order: 23
source: "https://react.dev/learn/render-and-commit"
status: translated
updated: 2026-09-01
---

သင့် component တွေ screen ပေါ် မပြသခင် — React က သူတို့ကို render လုပ်ရပါတယ်။ ဒီလုပ်ငန်းစဉ်ထဲက အဆင့်တွေကို နားလည်ထားတာက — သင့် code က ဘယ်လို လည်ပတ်တယ်ဆိုတာ စဉ်းစားနိုင်ဖို့နဲ့ သူ့ရဲ့ အပြုအမူကို ရှင်းပြနိုင်ဖို့ ကူညီပေးပါလိမ့်မယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- React မှာ rendering ဆိုတာ ဘာကို ဆိုလိုလဲ
- React က component တစ်ခုကို ဘယ်အချိန်၊ ဘာကြောင့် render လုပ်လဲ
- Component တစ်ခုကို screen ပေါ် ပြသဖို့ ပါဝင်တဲ့ အဆင့်တွေ
- Render လုပ်တိုင်း DOM update မဖြစ်ရတဲ့ အကြောင်းရင်း

သင့် component တွေက မီးဖိုချောင်ထဲက ချက်ပြုတ်သူတွေ ဖြစ်ပြီး — ပစ္စည်းတွေကနေ အရသာရှိတဲ့ ဟင်းလျာတွေကို ပြင်ဆင်နေတယ်လို့ စိတ်ကူးကြည့်ပါ။ ဒီအခြေအနေမှာ React က စားသုံးသူတွေဆီကနေ မှာစာတွေ လက်ခံပြီး — သူတို့ရဲ့ မှာထားတာတွေကို ပို့ပေးတဲ့ စားပွဲထိုး ဖြစ်ပါတယ်။ UI ကို တောင်းဆိုတာ၊ ပေးအပ်တာဆိုတဲ့ ဒီလုပ်ငန်းစဉ်မှာ အဆင့် သုံးဆင့် ရှိပါတယ်:

1. **Render တစ်ခုကို trigger လုပ်ခြင်း** (ဧည့်သည်ရဲ့ မှာစာကို မီးဖိုချောင်ဆီ ပို့ခြင်း)
2. **Component ကို render လုပ်ခြင်း** (မီးဖိုချောင်ထဲမှာ မှာစာကို ပြင်ဆင်ခြင်း)
3. **DOM ထဲ commit လုပ်ခြင်း** (မှာစာကို စားပွဲပေါ် တင်ပေးခြင်း)

> _Diagram:_ React က စားသောက်ဆိုင်က စားပွဲထိုး တစ်ယောက်လို ဖြစ်ပြီး — user တွေဆီကနေ မှာစာတွေ လက်ခံကာ Component Kitchen ဆီ ပို့ပေးနေပါတယ်။
>
> _Diagram:_ Card Chef က React ကို Card component အသစ်တစ်ခု ပေးနေပါတယ်။
>
> _Diagram:_ React က Card ကို စားပွဲမှာ ထိုင်နေတဲ့ user ဆီ ပို့ပေးနေပါတယ်။

## အဆင့် ၁ — Render တစ်ခုကို Trigger လုပ်ခြင်း

Component တစ်ခု render ဖြစ်ဖို့ အကြောင်းရင်း နှစ်ခု ရှိပါတယ်:

1. Component ရဲ့ **ကနဦး render (initial render)** ဖြစ်တာ။
2. Component (ဒါမှမဟုတ် သူ့ရဲ့ ancestor တစ်ခုခု) ရဲ့ **state ကို update လုပ်ထားတာ** ဖြစ်တာ။

### ကနဦး Render (Initial Render)

သင့် app စတင်တဲ့အခါ — ကနဦး render ကို trigger လုပ်ဖို့ လိုပါတယ်။ Framework တွေနဲ့ sandbox တွေက ဒီ code ကို တစ်ခါတစ်ရံ ဝှက်ထားတတ်ပေမယ့် — [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) ကို target DOM node နဲ့ ခေါ်ပြီး — သူ့ရဲ့ `render` method ကို သင့် component နဲ့ ခေါ်တာက ဒီလို လုပ်ဆောင်တာပါ:

```jsx
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```
```jsx
export default function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```
`root.render()` ခေါ်တာကို comment လုပ်လိုက်ပြီး — component ပျောက်သွားတာကို စမ်းကြည့်ပါ!

### State Update ဖြစ်တဲ့အခါ Re-render လုပ်ခြင်း

Component ကို ကနဦး render လုပ်ပြီးတာနဲ့ — [set function](/docs/react/use-state#setstate) နဲ့ သူ့ရဲ့ state ကို update လုပ်ခြင်းဖြင့် နောက်ထပ် render တွေ trigger လုပ်နိုင်ပါတယ်။ သင့် component ရဲ့ state ကို update လုပ်တာက render တစ်ခုကို အလိုအလျောက် queue တင်ပေးပါတယ်။ (စားသောက်ဆိုင်က ဧည့်သည် တစ်ယောက်က ပထမဆုံး မှာစာ မှာပြီးတဲ့နောက် — သူ့ရဲ့ ရေငတ်မှု ဒါမှမဟုတ် ဆာလောင်မှု အခြေအနေပေါ်မူတည်ပြီး လက်ဖက်ရည်၊ အချိုပွဲ စတာတွေကို ထပ်မှာသလို စိတ်ကူးကြည့်နိုင်ပါတယ်။)

> _Diagram:_ State update... — React က စားပွဲထိုးတစ်ယောက်လို ဖြစ်ပြီး — Card UI ကို user ဆီ ပေးနေပါတယ်။ User က အနက်ရောင် Card အစား ပန်းရောင် Card လိုချင်တယ်လို့ ပြောနေပါတယ်။
>
> _Diagram:_ ...triggers... — React က Component Kitchen ဆီ ပြန်သွားပြီး Card Chef ကို ပန်းရောင် Card လိုအပ်တယ်လို့ ပြောနေပါတယ်။
>
> _Diagram:_ ...render! — Card Chef က React ကို ပန်းရောင် Card ပေးနေပါတယ်။

## အဆင့် ၂ — React က သင့် Component တွေကို Render လုပ်ခြင်း

Render တစ်ခုကို trigger လုပ်ပြီးတဲ့နောက် — screen ပေါ်မှာ ဘာပြရမလဲဆိုတာ ဆုံးဖြတ်ဖို့ React က သင့် component တွေကို ခေါ်ပါတယ်။ **"Rendering" ဆိုတာ React က သင့် component တွေကို ခေါ်တာပါ။**

- **ကနဦး render မှာ** — React က root component ကို ခေါ်ပါလိမ့်မယ်။
- **နောက်ဆက်တွဲ render တွေမှာ** — state update ကို trigger လုပ်တဲ့ function component ကို React က ခေါ်ပါလိမ့်မယ်။

ဒီလုပ်ငန်းစဉ်က recursive ဖြစ်ပါတယ်: update ဖြစ်တဲ့ component က တခြား component တစ်ခုကို ပြန်ပေးရင် — React က အဲဒီ component ကို နောက်တစ်ခု အဖြစ် render လုပ်ပြီး — အဲဒီ component ပါ တစ်ခုခု ပြန်ပေးရင် — အဲဒါကို နောက်တစ်ခု အဖြစ် ဆက်ပြီး render လုပ်ပါတယ်။ Nested component တွေ မကျန်တော့ဘဲ — screen ပေါ်မှာ ဘာပြသရမလဲဆိုတာ React က အတိအကျ သိသွားတဲ့အထိ ဒီလုပ်ငန်းစဉ်က ဆက်သွားပါတယ်။

အောက်က ဥပမာမှာ — React က `Gallery()` နဲ့ `Image()` ကို အကြိမ်များစွာ ခေါ်ပါလိမ့်မယ်:

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```
```jsx
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```
```css
img { margin: 0 10px 10px 0; }
```
- **ကနဦး render အတွင်း** — React က `<section>`၊ `<h1>` နဲ့ `<img>` tag သုံးခုအတွက် [DOM nodes တွေကို ဖန်တီး](https://developer.mozilla.org/docs/Web/API/Document/createElement) ပါလိမ့်မယ်။
- **Re-render အတွင်း** — React က ယခင် render နဲ့ နှိုင်းယှဉ်ပြီး — သူတို့ရဲ့ property တွေထဲက ဘယ်ဟာတွေ ပြောင်းသွားလဲဆိုတာ တွက်ပါလိမ့်မယ်။ နောက်အဆင့်ဖြစ်တဲ့ commit phase မရောက်မချင်း — အဲဒီအချက်အလက်နဲ့ ဘာမှ လုပ်မှာ မဟုတ်ပါဘူး။

> **သတိပြုရန်:** Rendering က အမြဲတမ်း [pure calculation](/docs/react/keeping-components-pure) တစ်ခု ဖြစ်ရပါမယ်:
>
> - **Input တူရင် output တူရမယ်။** Input တူညီပေးထားရင် — component တစ်ခုက JSX တစ်ခုတည်းကို အမြဲတမ်း ပြန်ပေးရပါမယ်။ (တစ်ယောက်ယောက်က ခရမ်းချဉ်သီးနဲ့ salad မှာရင် — ကြက်သွန်နီနဲ့ salad မရသင့်ပါဘူး!)
> - **သူ့ကိစ္စနဲ့သူ နေရမယ်။** Render မလုပ်ခင် တည်ရှိခဲ့တဲ့ object တွေ ဒါမှမဟုတ် variable တွေကို မပြောင်းလဲသင့်ပါဘူး။ (မှာစာ တစ်ခုက သူများရဲ့ မှာစာကို မပြောင်းလဲသင့်ပါဘူး။)
>
> မဟုတ်ရင် — သင့် codebase ပိုရှုပ်ထွေးလာတာနဲ့အမျှ — ရှုပ်ထွေးတဲ့ bug တွေနဲ့ ခန့်မှန်းလို့မရတဲ့ အပြုအမူတွေကို ကြုံရနိုင်ပါတယ်။ "Strict Mode" နဲ့ develop လုပ်တဲ့အခါ — React က component တစ်ခုချင်းစီရဲ့ function ကို နှစ်ကြိမ် ခေါ်ပြီး — impure function တွေကြောင့် ဖြစ်တဲ့ အမှားတွေကို ပေါ်လွင်စေနိုင်ပါတယ်။

#### Performance ကို Optimize လုပ်ခြင်း

Update ဖြစ်တဲ့ component အောက်မှာ nested ဖြစ်နေတဲ့ component အားလုံးကို render လုပ်တဲ့ default behavior က — update ဖြစ်တဲ့ component က tree ရဲ့ အပေါ်ပိုင်း အရမ်းမှာ ရှိနေရင် — performance အတွက် အကောင်းဆုံး မဟုတ်ပါဘူး။ Performance ပြဿနာ ကြုံရင် — [Performance](https://reactjs.org/docs/optimizing-performance.html) section မှာ ဖော်ပြထားတဲ့ opt-in နည်းလမ်း အများအပြား ရှိပါတယ်။ **အချိန်မတန်ခင် premature optimize မလုပ်ပါနဲ့!**

## အဆင့် ၃ — React က ပြောင်းလဲမှုတွေကို DOM ထဲ Commit လုပ်ခြင်း

Component တွေကို render လုပ် (ခေါ်) ပြီးတဲ့နောက် — React က DOM ကို ပြုပြင်ပါလိမ့်မယ်။

- **ကနဦး render အတွက်** — React က ဖန်တီးထားတဲ့ DOM nodes တွေ အားလုံးကို screen ပေါ် တင်ဖို့ [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API ကို သုံးပါလိမ့်မယ်။
- **Re-render တွေအတွက်** — DOM က နောက်ဆုံး rendering output နဲ့ ကိုက်ညီအောင် — အနည်းဆုံး လိုအပ်တဲ့ operations တွေ (render လုပ်နေတုန်း တွက်ထားတာ!) ကို React က အသုံးပြုပါလိမ့်မယ်။

**Render တွေကြားမှာ ကွာခြားချက် ရှိမှသာ React က DOM nodes တွေကို ပြောင်းလဲပါတယ်။** ဥပမာ — ဒီမှာ သူ့ရဲ့ parent ကနေ props တွေ မတူညီတာ ရတိုင်း စက္ကန့်တိုင်း re-render ဖြစ်တဲ့ component တစ်ခု ရှိပါတယ်။ `<input>` ထဲမှာ text တစ်ချို့ ရိုက်ထည့်ပြီး သူ့ရဲ့ `value` ကို update လုပ်နိုင်ပေမယ့် — component re-render ဖြစ်တဲ့အခါ text က မပျောက်သွားတာကို သတိပြုပါ:

```jsx
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
    <Clock time={time.toLocaleTimeString()} />
  );
}
```
ဒါ အလုပ်လုပ်တာက — ဒီနောက်ဆုံး အဆင့်မှာ React က `<h1>` ရဲ့ content ကိုပဲ `time` အသစ်နဲ့ update လုပ်လို့ပါ။ `<input>` က ယခင် render နဲ့ နေရာတစ်ခုတည်းမှာ JSX ထဲ ပေါ်နေတာကို သူ မြင်တာမို့ — React က `<input>` ကို လုံးဝ မထိဘူး — သူ့ရဲ့ `value` ကိုလည်း မထိပါဘူး!

## နိဂုံးချုပ် — Browser Paint လုပ်ခြင်း

Rendering ပြီးသွားပြီး React က DOM ကို update လုပ်ပြီးတာနဲ့ — browser က screen ကို repaint လုပ်ပါတယ်။ ဒီလုပ်ငန်းစဉ်ကို "browser rendering" လို့ သိကြပေမယ့် — docs တစ်လျှောက်လုံးမှာ ရှုပ်ထွေးမှု မဖြစ်အောင် — ဒါကို "painting" လို့ ခေါ်ပါမယ်။

> _Diagram:_ Browser က "card element ပါတဲ့ still life" ကို paint လုပ်နေပုံ။

## အကျဉ်းချုပ်

- React app တစ်ခုမှာ screen update တိုင်းက အဆင့် သုံးဆင့်နဲ့ ဖြစ်ပါတယ်:
  1. Trigger
  2. Render
  3. Commit
- သင့် component တွေထဲက အမှားတွေကို ရှာဖို့ Strict Mode ကို သုံးနိုင်ပါတယ်
- Rendering ရလဒ်က ယခင် အတိုင်းပဲ ဆိုရင် — React က DOM ကို မထိပါဘူး
