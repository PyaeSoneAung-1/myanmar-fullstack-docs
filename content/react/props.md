---
title: "Props ပေးပို့ခြင်း"
description: "Props ဆိုတာ ဘာလဲ — parent ကနေ child ကို data ပို့ခြင်း၊ component ထဲမှာ props ဖတ်ခြင်း၊ default value၊ spread syntax နဲ့ children prop"
order: 3
source: "https://react.dev/learn/passing-props-to-a-component"
status: translated
updated: 2026-09-01
---

## Props ဆိုတာ ဘာလဲ

**Props** ဆိုတာ — JSX tag တစ်ခုဆီကို ပို့လိုက်တဲ့ information တွေပါ။ Built-in element တွေမှာတောင် props တွေ ရှိပြီးသားပါ — `<img src="..." alt="..." width={100} />` ထဲက `src`, `alt`, `width` တွေက props တွေပါပဲ (ReactDOM က ကြိုသတ်မှတ်ပေးထားတာပါ)။ ကိုယ်ပိုင် component တွေမှာတော့ props ရဲ့ အဓိပ္ပါယ်ကို ကိုယ်တိုင် သတ်မှတ်လို့ရပါတယ်။

React component တွေက function တွေဖြစ်ပြီး — function ကို argument ပေးခေါ်သလိုမျိုး **component တစ်ခုကနေ နောက်တစ်ခုကို props (properties) နဲ့ data ပို့ပါတယ်**။ Data စီးဆင်းမှုက **parent → child တစ်ဖက်တည်း** ဖြစ်ပြီး — child က parent ကို ပြန်ပို့လို့မရပါဘူး။ Props က HTML attribute နဲ့ ဆင်တူပါတယ် — component ကို သုံးတဲ့အခါ `person={...}` လိုမျိုး ပေးလိုက်ပြီး component function ထဲမှာ parameter အဖြစ် လက်ခံပါတယ်။ အောက်က code မှာ props ပေးပို့တာနဲ့ လက်ခံဖတ်တာ နှစ်မျိုးလုံး ပါပါတယ်:

```jsx
function Avatar({ person, size }) {
  return (
    <img
      src={`https://i.imgur.com/${person.imageId}.jpg`}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

// Avatar ကို props နဲ့ သုံးခြင်း — HTML attribute လိုမျိုး
<Avatar
  person={{ name: 'Katsuko Saruhashi', imageId: 'YfeOqp2' }}
  size={100}
/>
```

## Component ထဲမှာ props ဖတ်ခြင်း

Component function ထဲမှာ props ကို — **destructuring** နဲ့ ဖတ်တာ အသုံးအများဆုံးပါ။ `{ person, size }` လိုမျိုး parameter ထဲမှာ တိုက်ရိုက် ဆွဲထုတ်ပြီး — function body ထဲမှာ variable လို သုံးပါတယ်။ Destructuring မလုပ်ဘဲ props object တစ်ခုလုံးကို parameter အနေနဲ့ လက်ခံပြီး `props.person` လိုမျိုး dot notation နဲ့လည်း ဖတ်လို့ရပါတယ် — component က props တစ်ခုတည်းကိုပဲ လက်ခံတာမို့ပါ။ ဒါပေမယ့် destructure လုပ်ထားတာ ပိုရှင်းပြီး အမှားနည်းပါတယ်။ `person.imageId` ကို template literal ထဲမှာ သုံးပြီး image URL ကို ဆောက်ထားတာကို အပေါ်က code မှာ မြင်ရပါတယ်။

## Default တန်ဖိုး သတ်မှတ်ခြင်း

Prop တစ်ခုကို ပေးမလာဘူးဆိုရင် — destructuring ထဲမှာ `= defaultValue` ပုံစံနဲ့ **default value သတ်မှတ်လို့ရပါတယ်**။ `size` prop ကို မပေးရင် `100` ကို အလိုအလျောက် သုံးမယ်ဆိုတာမျိုးပါ:

```jsx
function Avatar({ person, size = 100 }) {
  // size prop မပေးရင် 100 ကို default အနေနဲ့ သုံးမယ်
  return (
    <img
      src={`https://i.imgur.com/${person.imageId}.jpg`}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

Default value က prop တန်ဖိုး **မရှိတဲ့အခါမှသာ** အလုပ်လုပ်ပြီး — `size={null}` လို null ပေးထားရင်လည်း default ကို ပြန်သုံးပါတယ်။

## Spread Syntax နဲ့ props လွှဲခြင်း

Props တွေ အများကြီးကို တစ်လုံးချင်းစီ ရေးစရာမလိုဘဲ — **spread syntax (`...`)** နဲ့ လက်ခံရရှိထားတဲ့ props တွေ အားလုံးကို နောက် component တစ်ခုဆီ တစ်ခါတည်း လွှဲလို့ရပါတယ်:

```jsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

ဒါမျိုး ရေးမယ့်အစား `<Avatar {...props} />` လိုမျိုး spread သုံးပြီး `Profile` ရတဲ့ props တွေ အားလုံးကို `Avatar` ဆီ လွှဲလို့ရပါတယ်။ ဒါပေမယ့် — spread က ဘယ် prop တွေ ရောက်သွားလဲ မရှင်းတာမို့ သုံးတိုင်း ရှင်းရှင်းရေးတာ ပိုကောင်းပါတယ်။

## Children Prop — JSX ထဲက အကြောင်းအရာတွေ

Component တွေကို nest လုပ်တဲ့အခါ — JSX tag နှစ်ခုကြားထဲက အကြောင်းအရာတွေကို **`children` prop** အနေနဲ့ ရပါတယ်။ Card, Modal လို "frame" wrapper component တွေမှာ အသုံးဝင်ပါတယ်:

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ name: 'Katsuko Saruhashi', imageId: 'YfeOqp2' }}
      />
    </Card>
  );
}
```

`<Card>` ရဲ့ အတွင်းထဲက `<Avatar />` က `Card` ရဲ့ `children` ဖြစ်သွားပြီး — `{children}` နေရာမှာ render လုပ်ပါတယ်။ ဒါကြောင့် Card လို wrapper ကို ဘယ် content မဆို ထည့်ပြီး ပြန်သုံးလို့ရပြီး — `children` က JSX ဖြစ်လို့ component, element, string ဘာမဆို ဖြစ်နိုင်ပါတယ်။

## Props တွေက မပြောင်းလဲနိုင်ပါဘူး

Props တွေက immutable (မပြောင်းလဲနိုင်တဲ့) ဖြစ်ပါတယ် — component က မိမိ props ကို ကိုယ်တိုင် ပြောင်းလို့မရပါဘူး။ ဒါက component တွေကို ခန့်မှန်းရလွယ်စေပါတယ် — props ပေးထားတဲ့အတိုင်းပဲ render ဖြစ်မယ်ဆိုတာ သေချာလို့ပါ။ ဒါပေမယ့် parent ရဲ့ state ပြောင်းရင် props အသစ်တွေ ရပြီး ပြန် render ဖြစ်တတ်ပါတယ် — Interaction လိုအပ်တဲ့အခါ (ဥပမာ input တန်ဖိုး ပြောင်းတာ) state ကို သုံးရပါမယ် — အဲဒါကို နောက်စာမျက်နှာတွေမှာ လေ့လာပါမယ်။

## နောက်တစ်ဆင့်တွေ

- [UI ဖော်ပြခြင်း](/docs/react/describing-ui) — component နဲ့ JSX အခြေခံတွေ
- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) — event handler တွေကို prop အဖြစ် ပို့ခြင်း
