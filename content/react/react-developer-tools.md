---
title: "React Developer Tools"
description: "React Developer Tools ကို install လုပ်နည်း — browser extension၊ Safari နဲ့ တခြား browser တွေအတွက် standalone ဗားရှင်း၊ React Native (mobile) အတွက် React Native DevTools"
order: 119
source: "https://react.dev/learn/react-developer-tools"
status: translated
updated: 2026-09-02
---

React Developer Tools ကို သုံးပြီး React [components](/docs/react/your-first-component) တွေကို စစ်ဆေးခြင်း၊ [props](/docs/react/props) နဲ့ [state](/docs/react/state-a-components-memory) တွေကို ပြင်ဆင်ခြင်း၊ performance ပြဿနာတွေကို ခွဲခြားသိရှိခြင်း လုပ်နိုင်ပါတယ်။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- React Developer Tools ကို install လုပ်နည်း

## Browser extension

React နဲ့ တည်ဆောက်ထားတဲ့ websites တွေကို debug လုပ်ဖို့ အလွယ်ဆုံး နည်းလမ်းက React Developer Tools browser extension ကို install လုပ်တာပါ။ နာမည်ကြီး browser တွေ အများအပြားအတွက် ရနိုင်ပါတယ်:

- [**Chrome** အတွက် install](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [**Firefox** အတွက် install](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- [**Edge** အတွက် install](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

အခု — **React နဲ့ တည်ဆောက်ထားတဲ့** website တစ်ခုကို သွားကြည့်ရင် — _Components_ နဲ့ _Profiler_ panel တွေကို တွေ့ရပါလိမ့်မယ်။

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari နဲ့ တခြား browser တွေအတွက်

တခြား browser တွေအတွက် (ဥပမာ — Safari) — [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package ကို install လုပ်ပါ:

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

ပြီးရင် terminal ကနေ developer tools ကို ဖွင့်ပါ:

```bash
react-devtools
```

ပြီးရင် သင့် website ရဲ့ `<head>` ရဲ့ အစမှာ အောက်က `<script>` tag ကို ထည့်ပြီး သင့် website ကို ချိတ်ဆက်ပါ:

```html
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

အခု သင့် website ကို browser ထဲမှာ reload လုပ်ပြီး developer tools ထဲမှာ ကြည့်ပါ။

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native)

[React Native](https://reactnative.dev/) နဲ့ တည်ဆောက်ထားတဲ့ apps တွေကို စစ်ဆေးဖို့ — React Developer Tools ကို နက်ရှိုင်းစွာ ပေါင်းစပ်ထားတဲ့ built-in debugger ဖြစ်တဲ့ [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) ကို သုံးနိုင်ပါတယ်။ Native element highlighting နဲ့ selection အပါအဝင် — features တွေ အားလုံးက browser extension နဲ့ အတူတူ အလုပ်လုပ်ပါတယ်။

[React Native မှာ debugging လုပ်ခြင်းအကြောင်း ပိုလေ့လာပါ။](https://reactnative.dev/docs/debugging)

> React Native ရဲ့ 0.76 ထက် စောတဲ့ versions တွေအတွက်တော့ — အပေါ်မှာ ဖော်ပြထားတဲ့ **Safari နဲ့ တခြား browser တွေအတွက်** section အတိုင်း လိုက်နာပြီး React DevTools ရဲ့ standalone build ကို သုံးပါ။
