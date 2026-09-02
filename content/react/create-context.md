---
title: "createContext"
description: "Component tree ထဲ နက်နက်ရှိုင်းရှိုင်း data မျှဝေနိုင်ဖို့ context object တစ်ခု ဖန်တီးပေးတဲ့ React API — createContext(defaultValue)၊ Provider/Consumer အသုံးပြုပုံများနဲ့ context value ပြောင်းလဲခြင်း"
order: 56
source: "https://react.dev/reference/react/createContext"
status: translated
updated: 2026-09-02
---

`createContext` က components တွေက ပေးပို့ (provide) တာ ဒါမှမဟုတ် ဖတ် (read) တာ လုပ်နိုင်တဲ့ — [context](/docs/react/passing-data-deeply-with-context) တစ်ခုကို ဖန်တီးပေးနိုင်စေပါတယ်။

```js
const SomeContext = createContext(defaultValue)
```

## ရည်ညွှန်းချက် (Reference)

### `createContext(defaultValue)`

Context တစ်ခု ဖန်တီးဖို့ — component တွေရဲ့ အပြင်မှာ `createContext` ကို ခေါ်ပါတယ်:

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

**Parameters (ပါရာမီတာများ)**

- `defaultValue`: Context ကို ဖတ်နေတဲ့ component ရဲ့ အပေါ်က tree ထဲမှာ — ကိုက်ညီတဲ့ context provider တစ်ခုမှ မရှိတဲ့အခါ — context မှာ ရှိစေချင်တဲ့ တန်ဖိုးပါ။ အဓိပ္ပါယ်ရှိတဲ့ default value တစ်ခုမှ မရှိဘူးဆိုရင် — `null` ကို သတ်မှတ်ပါ။ ဒီ default value က "နောက်ဆုံး မှီခိုစရာ" (last resort) fallback တစ်ခုအနေနဲ့ ရည်ရွယ်ထားတာပါ — static ဖြစ်ပြီး — အချိန်နဲ့အမျှ ဘယ်တော့မှ မပြောင်းလဲပါဘူး။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`createContext` က context object တစ်ခုကို ပြန်ပေးပါတယ်။

**Context object ကိုယ်တိုင်က ဘာအချက်အလက်မှ မကိုင်ထားပါဘူး။** သူက — တခြား components တွေ ဖတ်/ပေးပို့နေတဲ့ context *ဘယ်ဟာ* ဆိုတာကိုပဲ ကိုယ်စားပြုပါတယ်။ ပုံမှန်အားဖြင့် — context value ကို သတ်မှတ်ဖို့ အပေါ်က components တွေမှာ `SomeContext` ကို သုံးပြီး — အောက်က components တွေမှာ [useContext(SomeContext)](https://react.dev/reference/react/useContext) ကို ခေါ်ပြီး ဖတ်ပါတယ်။ Context object မှာ property အနည်းငယ် ရှိပါတယ်:

- `SomeContext` က components တွေဆီ context value ကို ပေးပို့နိုင်စေပါတယ်။
- `SomeContext.Consumer` က context value ကို ဖတ်တဲ့ နည်းလမ်းတစ်ခုဖြစ်ပြီး — ရှားရှားပါးပါးပဲ သုံးပါတယ်။
- `SomeContext.Provider` က React 19 မတိုင်ခင်က — context value ပေးပို့တဲ့ နည်းလမ်းဟောင်းပါ။

### `SomeContext` Provider

သင့် components တွေကို context provider တစ်ခုထဲ ထုပ်ပြီး — အတွင်းမှာ ရှိတဲ့ component တွေအားလုံးအတွက် — ဒီ context ရဲ့ တန်ဖိုးကို သတ်မှတ်နိုင်ပါတယ်:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

> **မှတ်ချက်:** React 19 ကစပြီး `<SomeContext>` ကိုပဲ provider အနေနဲ့ render လုပ်နိုင်ပါတယ်။ React version အဟောင်းတွေမှာတော့ `<SomeContext.Provider>` ကို သုံးပါ။

**Props (property များ)**

- `value`: ဒီ provider ရဲ့ အတွင်းမှာ — ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — ဒီ context ကို ဖတ်နေတဲ့ components တွေအားလုံးဆီ ပို့ချင်တဲ့ တန်ဖိုးပါ။ Context value က ဘယ် type မဆို ဖြစ်နိုင်ပါတယ်။ Provider အတွင်းမှာ [useContext(SomeContext)](https://react.dev/reference/react/useContext) ကို ခေါ်ထားတဲ့ component တစ်ခုက — သူ့အပေါ်မှာ ရှိတဲ့ အနီးဆုံး ကိုက်ညီသော context provider ရဲ့ `value` ကို လက်ခံရရှိပါတယ်။

### `SomeContext.Consumer`

`useContext` မပေါ်ခင်က — context ကို ဖတ်တဲ့ နည်းလမ်းဟောင်း တစ်ခု ရှိခဲ့ပါတယ်:

```js
function Button() {
  // 🟡 နည်းလမ်းဟောင်း (မထောက်ခံတော့ပါ)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

ဒီနည်းလမ်းဟောင်းက အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — **code အသစ်တွေမှာတော့ [useContext()](https://react.dev/reference/react/useContext) နဲ့ပဲ context ကို ဖတ်သင့်ပါတယ်:**

```js
function Button() {
  // ✅ အကြံပြုထားတဲ့ နည်းလမ်း
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

**Props (property များ)**

- `children`: Function တစ်ခုပါ။ React က — [useContext()](https://react.dev/reference/react/useContext) နဲ့ အတူတူ algorithm နဲ့ ဆုံးဖြတ်ထားတဲ့ လက်ရှိ context value ကို — သင်ပေးလိုက်တဲ့ function ဆီ argument အဖြစ် ပေးပြီး ခေါ်ပါတယ် — ပြီးတော့ ဒီ function က ပြန်ပေးတဲ့ ရလဒ်ကို render လုပ်ပါတယ်။ Parent components တွေဆီက context ပြောင်းလဲတဲ့အခါ — React က ဒီ function ကို ပြန် run ပြီး — UI ကိုလည်း update လုပ်ပေးပါတယ်။

## အသုံးပြုပုံ (Usage)

### Context ဖန်တီးခြင်း

Context က components တွေကို — props တွေကို ရှင်းရှင်းလင်းလင်း မပို့ဘဲ — [အချက်အလက်တွေကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်](/docs/react/passing-data-deeply-with-context)နိုင်စေပါတယ်။

Context တစ်ခု ဒါမှမဟုတ် အများကြီး ဖန်တီးဖို့ — component တွေရဲ့ အပြင်မှာ `createContext` ကို ခေါ်ပါ:

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` က context object တစ်ခုကို ပြန်ပေးပါတယ်။ Components တွေက — context ကို [useContext()](https://react.dev/reference/react/useContext) ဆီ ပေးပြီး — ဖတ်နိုင်ပါတယ်:

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

ပုံမှန်အားဖြင့် — သူတို့ လက်ခံရရှိတဲ့ တန်ဖိုးတွေက — context တွေကို ဖန်တီးတုန်းက သင်သတ်မှတ်ခဲ့တဲ့ default values တွေပါ။ ဒါပေမယ့် — default values တွေက ဘယ်တော့မှ မပြောင်းတာမို့ — ဒါတစ်ခုတည်းနဲ့တော့ အသုံးမဝင်ပါဘူး။

Context က အသုံးဝင်တာက — သင့် components တွေကနေ **တခြား dynamic values တွေကို ပေးပို့ (provide)** လို့ရလို့ပါ:

```js
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

အခု — `Page` component နဲ့ သူ့အတွင်းက component တွေအားလုံးက — ဘယ်လောက်နက်နက်ပဲ ဖြစ်ဖြစ် — ပို့လိုက်တဲ့ context values တွေကို "မြင်" ရပါလိမ့်မယ်။ ပို့လိုက်တဲ့ context values တွေ ပြောင်းလဲသွားရင် — React က context ကို ဖတ်နေတဲ့ components တွေကိုပါ re-render လုပ်ပေးပါတယ်။

Context တွေကို ဖတ်ခြင်းနဲ့ ပေးပို့ခြင်းအကြောင်း နောက်ထပ်ဖတ်ရှုပြီး ဥပမာတွေ ကြည့်ဖို့ — [useContext](https://react.dev/reference/react/useContext) ကို ကြည့်ပါ။

### Context တစ်ခုကို File တစ်ခုကနေ Import/Export လုပ်ခြင်း

မကြာခဏဆိုသလို — file အမျိုးမျိုးထဲက components တွေက — context တစ်ခုတည်းကို ဝင်ရောက်ဖို့ လိုအပ်တတ်ပါတယ်။ ဒါကြောင့်ပဲ — contexts တွေကို file သပ်သပ်တစ်ခုမှာ ကြေညာတာ အသုံးများပါတယ်။ ပြီးရင် — [`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ကို သုံးပြီး — context ကို တခြား files တွေ သုံးနိုင်အောင် လုပ်နိုင်ပါတယ်:

```js
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

တခြား files တွေထဲက components တွေက — [`import` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) ကို သုံးပြီး — ဒီ context ကို ဖတ်/ပေးပို့နိုင်ပါတယ်:

```js
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

ဒါက [components တွေကို import/export လုပ်ခြင်း](/docs/react/importing-and-exporting-components) နဲ့ ဆင်တူပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Context Value ကို ပြောင်းလဲဖို့ နည်းလမ်း ရှာမတွေ့ဘူး

ဒီလိုမျိုး code က context ရဲ့ *default* တန်ဖိုးကို သတ်မှတ်ပါတယ်:

```js
const ThemeContext = createContext('light');
```

ဒီတန်ဖိုးက ဘယ်တော့မှ မပြောင်းပါဘူး။ React က ဒီတန်ဖိုးကို — အပေါ်မှာ ကိုက်ညီတဲ့ provider တစ်ခု ရှာမတွေ့မှသာ — fallback အဖြစ် သုံးပါတယ်။

Context ကို အချိန်နဲ့အမျှ ပြောင်းလဲစေဖို့ — [state ထည့်ပြီး — components တွေကို context provider တစ်ခုထဲ ထုပ်ပါ](https://react.dev/reference/react/useContext#updating-data-passed-via-context)။
