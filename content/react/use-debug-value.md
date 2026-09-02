---
title: "useDebugValue"
description: "React DevTools ထဲမှာ custom Hook တစ်ခုကို label တပ်ပြဖို့ သုံးတဲ့ React Hook — ဖတ်ရလွယ်တဲ့ debug value ပြသခြင်း၊ format function ဖြင့် formatting လုပ်ငန်းကို ရွှေ့ဆိုင်းခြင်း"
order: 63
source: "https://react.dev/reference/react/useDebugValue"
status: translated
updated: 2026-09-02
---

`useDebugValue` ဆိုတာ — [React DevTools](https://react.dev/learn/react-developer-tools) ထဲမှာ custom Hook တစ်ခုကို label တစ်ခု ထည့်နိုင်စေတဲ့ React Hook တစ်ခုပါ။

```js
useDebugValue(value, format?)
```

## ရည်ညွှန်းချက် (Reference)

### `useDebugValue(value, format?)`

ဖတ်လို့ရလွယ်တဲ့ debug value တစ်ခု ပြသဖို့ — သင့် [custom Hook](https://react.dev/learn/reusing-logic-with-custom-hooks) ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useDebugValue` ကို ခေါ်ပါတယ်:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

#### Parameters

- `value` — React DevTools ထဲမှာ ပြသချင်တဲ့ တန်ဖိုးပါ။ ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။
- **optional** `format` — formatting function တစ်ခုပါ။ Component တစ်ခုကို inspect (စစ်ဆေး) လုပ်တဲ့အခါ — React DevTools က formatting function ကို `value` ကို argument အဖြစ်နဲ့ ခေါ်ပြီး — ပြန်လာတဲ့ formatted value ကို (ဘယ် type မဆို ဖြစ်နိုင်တဲ့) ပြသပါတယ်။ Formatting function ကို သတ်မှတ်မထားရင် — မူရင်း `value` ကိုယ်တိုင်ကိုပဲ ပြသပါတယ်။

#### Returns

`useDebugValue` က ဘာမှ ပြန်မပေးပါဘူး။

## အသုံးပြုပုံ (Usage)

### Custom Hook တစ်ခုကို label တပ်ခြင်း

[React DevTools](https://react.dev/learn/react-developer-tools) အတွက် ဖတ်လို့ရလွယ်တဲ့ debug value တစ်ခု ပြသဖို့ — သင့် [custom Hook](https://react.dev/learn/reusing-logic-with-custom-hooks) ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useDebugValue` ကို ခေါ်ပါတယ်:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

ဒါက — `useOnlineStatus` ကို ခေါ်နေတဲ့ components တွေကို — သင် inspect လုပ်တဲ့အခါ `OnlineStatus: "Online"` လို label တစ်ခု ရစေပါတယ်။ `useDebugValue` call မပါဘဲဆိုရင် — အောက်ခံ data (ဒီဥပမာမှာဆိုရင် `true`) ကိုပဲ ပြမှာ ဖြစ်ပါတယ်။

> **မှတ်ချက်:** Custom Hook တိုင်းကို debug values တွေ ထည့်နေဖို့ မလိုပါဘူး။ ဒါက — shared libraries တွေရဲ့ အစိတ်အပိုင်းဖြစ်ပြီး — inspect လုပ်ရခက်တဲ့ ရှုပ်ထွေးတဲ့ internal data structure တစ်ခု ရှိတဲ့ custom Hooks တွေအတွက် အဖိုးအများဆုံး အသုံးဝင်ပါတယ်။

### Debug value တစ်ခုရဲ့ formatting ကို ရွှေ့ဆိုင်းခြင်း

`useDebugValue` ရဲ့ ဒုတိယ argument အနေနဲ့ formatting function တစ်ခုကိုလည်း ပို့နိုင်ပါတယ်:

```js
useDebugValue(date, date => date.toDateString());
```

သင့် formatting function က debug value ကို parameter အဖြစ် လက်ခံပြီး — formatted display value တစ်ခုကို ပြန်ပေးရပါတယ်။ Component တစ်ခုကို inspect လုပ်တဲ့အခါ — React DevTools က ဒီ function ကို ခေါ်ပြီး — ရလဒ်ကို ပြသပါတယ်။

ဒါက — component ကို တကယ် inspect လုပ်မှသာ — စရိတ်ကြီးနိုင်တဲ့ formatting logic ကို run စေတာမို့ — ရှောင်နိုင်ပါတယ်။ ဥပမာ — `date` က Date value တစ်ခုဆိုရင် — render တိုင်း `toDateString()` ကို ခေါ်နေရတာကို ရှောင်နိုင်ပါတယ်။
