---
title: "React မိတ်ဆက်"
description: "React ဆိုတာ ဘာလဲ၊ component ဆိုတာ ဘာလဲ — user interface တွေကို ဘယ်လို တည်ဆောက်သလဲ"
order: 1
source: "https://react.dev/learn"
status: translated
updated: 2026-09-01
---

## React ဆိုတာ ဘာလဲ

**React** က user interface (UI) တွေ တည်ဆောက်ဖို့အတွက် JavaScript library တစ်ခုပါ။
React ရဲ့ အဓိက အတွေးအခေါ်ကတော့ — **UI ကို component (အစိတ်အပိုင်း) တွေ ခွဲပြီး
တည်ဆောက်တာ** ဖြစ်ပါတယ်။ Component တစ်ခုစီက သူ့ရဲ့ကိုယ်ပိုင် logic နဲ့
appearance ရှိပြီး၊ component တွေကို ပေါင်းစပ်ပြီး ရှုပ်ထွေးတဲ့ UI တစ်ခုလုံးကို
ဆောက်လို့ရပါတယ် — ဥပမာ အုတ်ခဲတွေနဲ့ အိမ်ဆောက်သလိုပါပဲ။

```jsx
function MyButton() {
  return <button>ငါ နှိပ်လို့ရတဲ့ button</button>;
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

အပေါ်က code မှာ `MyButton` ဆိုတဲ့ component ကို သတ်မှတ်ပြီး `MyApp` ထဲမှာ
သုံးထားပါတယ်။ React က web, mobile (React Native), desktop (Electron လို
framework တွေနဲ့) အစရှိတဲ့ platform တွေမှာ အလုပ်လုပ်ပါတယ်။

## Component တွေက ဘာလဲ

Component ဆိုတာ — **markup (HTML) ပါတဲ့ JavaScript function** ပါ။ Component
တွေက React ရဲ့ အခြေခံအဆောက်အဦးတွေဖြစ်ပြီး ဘယ်နေရာမှာမဆို ပြန်သုံးလို့ရပါတယ်။
Component function တစ်ခုက JSX လို့ခေါ်တဲ့ syntax နဲ့ ဘာကို ပြချင်လဲ ပြန်ပေးရပါတယ်။

## JSX ဆိုတာ ဘာလဲ

**JSX** က JavaScript ထဲမှာ markup (HTML လို) ရေးလို့ရတဲ့ syntax extension ပါ။
HTML နီးပါးတူပေမယ့် JavaScript ရဲ့ စွမ်းအားတွေနဲ့ ပေါင်းထားတာပါ — ဥပမာ
variable တွေ၊ expression တွေကို `{}` အတွင်းမှာ တိုက်ရိုက်သုံးလို့ရတယ်။

```jsx
const user = { name: "Hla", age: 25 };

// JSX ထဲမှာ expression သုံးခြင်း
const element = <h1>မင်္ဂလာပါ, {user.name}!</h1>;
```

JSX က browser က နားလည်တဲ့ code မဟုတ်ဘူးဆိုတာ သတိထားပါ — build လုပ်တဲ့အခါ
React က JSX ကို JavaScript အဖြစ် compile (ပြောင်း) ပေးပါတယ်။

## Props — Component တွေကို data ပို့ခြင်း

Component တစ်ခုကနေ နောက်တစ်ခုကို data ပို့ဖို့ **props** (properties) ကို
သုံးပါတယ်။ Props က function argument တွေနဲ့တူပြီး — HTML attribute လိုမျိုး
component ကို သုံးတဲ့အခါ ပေးလိုက်ပါတယ်။

```jsx
function Avatar({ name, size }) {
  return (
    <img
      src="https://example.com/avatar.jpg"
      alt={name}
      width={size}
      height={size}
    />
  );
}

<Avatar name="Hla" size={100} />
```

## State — Component တွေကို “မှတ်ဉာဏ်” ပေးခြင်း

Component တွေက user ရဲ့ action ပေါ်မူတည်ပြီး ပြောင်းလဲတဲ့ အရာတွေကို
မှတ်ထားဖို့လိုပါတယ် — ဥပမာ button နှိပ်လိုက်တဲ့အချိန်ရေတွက်တာ။ ဒါမျိုးအတွက်
**state** ကို သုံးပါတယ်။ State က component ရဲ့ “မှတ်ဉာဏ်” လို့ မှတ်ယူလို့ရပြီး
`useState` hook နဲ့ သတ်မှတ်ပါတယ်။

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      နှိပ်ပြီးသား အကြိမ်ရေ: {count}
    </button>
  );
}
```

`useState(0)` က ကနဦးတန်ဖိုး `0` နဲ့ state တစ်ခုကို ဖန်တီးပေးပါတယ်။
`count` က လက်ရှိတန်ဖိုး၊ `setCount` က အဲဒီတန်ဖိုးကို ပြောင်းဖို့ function ပါ။
State ပြောင်းတိုင်း React က UI ကို အလိုအလျောက် ပြန်ဆွဲပေးပါတယ် (re-render)။

## React က UI ကို ဘယ်လို update လုပ်သလဲ

React ရဲ့ ထူးခြားချက်က — **declarative (ဘာဖြစ်စေချင်လဲ ပြောရုံ)** ဖြစ်တာပါ။
သင်က DOM ကို တိုက်ရိုက်ပြောင်းစရာမလိုဘဲ “state က ဒါဆိုရင် UI က ဒီလိုဖြစ်ရမယ်”
လို့ပဲ ရေးရပါတယ်။ React က state တွေ ပြောင်းတဲ့အခါ ဘယ် component တွေ
ပြန်ဆွဲရမယ်ဆိုတာ virtual DOM နဲ့ နှိုင်းယှဉ်ပြီး ဆုံးဖြတ်ပေးပါတယ်။ ဒါကြောင့်
complex UI တွေမှာတောင် performance ကောင်းပါတယ်။

## ဘာလို့ React သုံးသလဲ

- **Component ပြန်သုံးလို့ရတယ်** — ရေးထားပြီးသား UI ကို နေရာမျိုးစုံ သုံးနိုင်
- **ကြီးမားတဲ့ ecosystem** — library, tool, tutorial တွေ အများကြီး ရှိ
- **Declarative** — UI logic က ပိုရှင်းပြီး စမ်းသပ်ရတာ လွယ်
- **React Native နဲ့ mobile ပါ** — web မှာ သုံးတဲ့ skill နဲ့ mobile app ပါ ဆောက်နိုင်

## စတင်ဖို့

React ကို သုံးဖို့ framework တစ်ခုခုနဲ့ စတင်တာ အကောင်းဆုံးပါ — Next.js လိုမျိုး
production-ready framework တွေက routing, performance optimization, data fetching
စတာတွေကို အဆင်သင့် ပါပေးထားပါတယ်။ ဒီ site ရဲ့ [Next.js မိတ်ဆက်](/docs/nextjs/getting-started) မှာ
ဆက်ဖတ်နိုင်ပါတယ်။
