---
title: "Event များနဲ့ အပြန်အလှန်"
description: "Event handler ဆိုတာ ဘာလဲ — onClick နဲ့ handler ထည့်ခြင်း၊ props ဖတ်ခြင်း၊ handler ကို prop အဖြစ် ပို့ခြင်း၊ event propagation နဲ့ preventDefault"
order: 4
source: "https://react.dev/learn/responding-to-events"
status: translated
updated: 2026-09-01
---

## Event Handler ဆိုတာ ဘာလဲ

User က button နှိပ်တာ၊ input ရိုက်တာ၊ form ပို့တာ စတဲ့ action တွေကို **event** လို့ ခေါ်ပြီး — အဲဒီ event တွေကို ကိုင်တွယ်ဖို့ **event handler** function တွေကို သုံးပါတယ်။ Event handler ဆိုတာ — user action ဖြစ်တဲ့အခါ run လုပ်မယ့် function ပါ။ Handler တွေက component ထဲမှာ သတ်မှတ်ပြီး JSX element ရဲ့ prop အဖြစ် **pass လုပ်ပေးရပါတယ်** — `onClick`, `onChange`, `onSubmit` စသဖြင့်ပါ:

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

သတိထားရမှာ — `onClick={handleClick}` က **function ကိုယ်တိုင်ကို ပေးတာ** ဖြစ်ပြီး `onClick={handleClick()}` လိုမျိုး function ကို ခေါ်ပြီး မပေးရပါဘူး။ Function ကို ခေါ်ပြီး ပေးလိုက်ရင် render လုပ်တုန်းမှာတည်း run ဖြစ်သွားပြီး — click ဖြစ်တဲ့အခါမှ မဟုတ်တော့ပါဘူး။ React က click ဖြစ်တဲ့အခါ ပေးထားတဲ့ function ကို ပြန်ခေါ်ပေးပါတယ်။ Inline arrow function နဲ့လည်း `onClick={() => alert('You clicked me!')}` လိုမျိုး တိုက်ရိုက် ရေးလို့ရပါတယ်။ Handler နာမည်တွေက `handleClick` လိုမျိုး `handle` နဲ့ စတင်တာ အလေ့အထကောင်းတစ်ခုပါ — code ဖတ်ရတာ လွယ်စေပါတယ်။

## Handler ထဲမှာ props ဖတ်ခြင်း

Event handler တွေက component ထဲမှာ သတ်မှတ်ထားတာဖြစ်လို့ — component ရဲ့ **props တွေကို လွတ်လပ်စွာ ဖတ်လို့ရပါတယ်**။ ဒါကြောင့် component တစ်ခုတည်းကို data အမျိုးမျိုး ပေးပြီး နေရာမျိုးစုံမှာ ပြန်သုံးနိုင်ပါတယ်:

```jsx
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

`AlertButton` က `message` prop ကို handler ထဲမှာ သုံးပြီး — `Toolbar` က button တစ်ခုချင်းစီကို message အမျိုးမျိုး ပေးထားပါတယ်။ Handler function ကို prop အဖြစ်လည်း ပို့လို့ရပါတယ် — `<Button onClick={handleClick}>Play Movie</Button>` လိုမျိုး component တစ်ခုကို `onClick` prop နဲ့ ခေါ်ပြီး သုံးတာပါ။ ဒီ pattern က component တွေကို သီးခြား ပြန်သုံးနိုင်စေပါတယ် — Button က ဘာ action လုပ်မယ်ဆိုတာ မသိဘဲ `onClick` prop ရှိတယ်ဆိုတာပဲ သိပါတယ်။ ဘယ် button က ဘာလုပ်မယ်ဆိုတဲ့ ဆုံးဖြတ်ချက်တွေကိုလည်း parent မှာ စုထားနိုင်ပါတယ်။

## Event Propagation

Click လို event တွေက child ကနေ parent ဆီ **အလိုအလျောက် ပျံ့နှံ့ (propagate)** သွားပါတယ် — ဒါကို **bubbling** လို့ ခေါ်ပြီး React ရဲ့ သဘောတရားမဟုတ်ဘဲ browser ရဲ့ native behavior ပါ။ Child မှာ handler ရှိတဲ့အပြင် parent မှာပါ handler ရှိရင် နှစ်ခုလုံး run ပါတယ်။ အောက်က code မှာ button ကို နှိပ်ရင် — button ရဲ့ alert ပြီးမှ `div` ရဲ့ alert ပါ ဆက်ပေါ်ပါလိမ့်မယ်:

```jsx
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

Child မှာတင် ရပ်စေချင်ရင် — event object ရဲ့ `e.stopPropagation()` ကို handler ထဲမှာ ခေါ်ပါတယ်: `onClick={(e) => { e.stopPropagation(); ... }}`။ ဒါဆိုရင် parent handler တွေ run မှာ မဟုတ်တော့ပါဘူး။

## preventDefault — Default အပြုအမူ ရပ်တန့်ခြင်း

Event အချို့မှာ browser ရဲ့ default အပြုအမူတွေ ရှိပါတယ် — ဥပမာ form submit လုပ်ရင် page ကို reload လုပ်ပြီး URL ထဲမှာ data ထည့်တာမျိုးပါ။ SPA (single-page app) တွေမှာ ဒီလို reload မဖြစ်စေချင်တာမို့ — `e.preventDefault()` နဲ့ default အပြုအမူကို ရပ်တန့်လို့ရပါတယ်:

```jsx
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

`e.preventDefault()` က propagation ကို မရပ်ပါဘူး — default အပြုအမူကိုပဲ ရပ်တာပါ။ နှစ်မျိုးလုံး လိုအပ်ရင် နှစ်ခုလုံး ခေါ်လို့ရပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Props ပေးပို့ခြင်း](/docs/react/props) — component တွေကြား data စီးဆင်းမှု
- [State နဲ့ Rendering](/docs/react/state-snapshot) — interaction ပြီးတဲ့အခါ state က ဘယ်လို အလုပ်လုပ်သလဲ
