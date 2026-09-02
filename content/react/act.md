---
title: "act"
description: "Test တွေမှာ assertions မလုပ်ခင် React ရဲ့ pending updates တွေ အကုန်လုံး process လုပ်ပြီး DOM ပေါ်မှာ အသုံးချပြီးသား ဖြစ်အောင် သေချာလုပ်ပေးတဲ့ test helper — rendering နဲ့ event dispatching တွေကို act() နဲ့ ထုပ်ပြီး browser မှာ React အလုပ်လုပ်ပုံနဲ့ နီးကပ်စွာ test လုပ်နည်း"
order: 102
source: "https://react.dev/reference/react/act"
status: translated
updated: 2026-09-02
---

`act` က — assertions (စစ်ဆေးမှုများ) မလုပ်ခင် React ရဲ့ pending updates တွေ အားလုံးကို အသုံးချပြီးသား ဖြစ်အောင် လုပ်ပေးတဲ့ test helper တစ်ခုပါ။

```js
await act(async actFn)
```

Component တစ်ခုကို assertions တွေအတွက် ပြင်ဆင်ဖို့ — component ကို render လုပ်တဲ့ code ရော updates တွေ လုပ်တဲ့ code ပါ `await act()` call တစ်ခုရဲ့ အတွင်းမှာ ထုပ်ပါ။ ဒီလိုလုပ်ရင် — သင့် test က React က browser မှာ အလုပ်လုပ်ပုံနဲ့ ပိုနီးကပ်စွာ run ပါလိမ့်မယ်။

> **မှတ်ချက်:** `act()` ကို တိုက်ရိုက် သုံးတာက နည်းနည်း ရှည်လျားတယ်လို့ ခံစားရနိုင်ပါတယ်။ Boilerplate တချို့ ရှောင်ဖို့ — [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) လို library တစ်ခုကို သုံးနိုင်ပါတယ် — သူ့ရဲ့ helpers တွေက `act()` နဲ့ ထုပ်ပြီးသား ဖြစ်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `await act(async actFn)`

UI tests တွေ ရေးတဲ့အခါ — rendering လုပ်တာ၊ user events တွေ၊ data fetching တွေလို အလုပ်တွေကို user interface နဲ့ အပြန်အလှန် ဆက်ဆံမှုရဲ့ "ယူနစ် (units)" တွေလို့ သဘောထားနိုင်ပါတယ်။ `act()` ဆိုတဲ့ helper က — ဒီ "ယူနစ်" တွေနဲ့ ဆက်စပ်တဲ့ updates တွေ အားလုံးကို — သင် assertions မလုပ်ခင် — process လုပ်ပြီး DOM ပေါ်မှာ အသုံးချပြီးသား ဖြစ်အောင် သေချာ လုပ်ပေးပါတယ်။

`act` ဆိုတဲ့ နာမည်က [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) pattern ကနေ ဆင်းသက်လာတာပါ။

```js
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

> **မှတ်ချက်:** `act` ကို `await` နဲ့ async function တစ်ခုနဲ့ တွဲသုံးဖို့ အကြံပြုပါတယ်။ Sync version က ကိစ္စ အများစုမှာ အလုပ်လုပ်ပေမယ့် — အကုန်လုံးမှာတော့ မလုပ်ပါဘူး။ React က updates တွေကို အတွင်းပိုင်းမှာ schedule လုပ်ပုံကြောင့် — sync version ကို ဘယ်အချိန်မှာ သုံးလို့ရမလဲဆိုတာ ကြိုတင် ခန့်မှန်းရတာ ခက်ပါတယ်။ နောင်မှာ sync version ကို deprecated လုပ်ပြီး ဖယ်ရှားမှာ ဖြစ်ပါတယ်။

#### Parameters (ပါရာမီတာများ)

- `async actFn` — စမ်းသပ်နေတဲ့ components တွေအတွက် renders (သို့) interactions တွေကို ထုပ်ပေးထားတဲ့ async function တစ်ခုပါ။ `actFn` အတွင်းမှာ trigger ဖြစ်တဲ့ updates တွေ အားလုံးကို internal act queue ထဲ ထည့်ပြီး — ပြီးရင် အတူတကွ flush လုပ်ကာ — DOM ပေါ်မှာ ပြောင်းလဲမှုတွေကို process လုပ်ပြီး အသုံးချပေးပါတယ်။ Async ဖြစ်လို့ — React က async boundary တစ်ခုကို ဖြတ်သွားတဲ့ code တွေကိုပါ run ပြီး — schedule လုပ်ထားတဲ့ updates တွေကိုလည်း flush လုပ်ပေးပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`act` က ဘာမှ ပြန်မပေးပါဘူး။

## အသုံးပြုပုံ (Usage)

Component တစ်ခုကို test လုပ်တဲ့အခါ — သူ့ရဲ့ output အကြောင်း assertions လုပ်ဖို့ `act` ကို သုံးနိုင်ပါတယ်။

ဥပမာ — အောက်က usage ဥပမာတွေက ဒီ `Counter` component ကို ဘယ်လို test လုပ်မလဲဆိုတာ ပြပါတယ်:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Component တွေကို test တွေထဲမှာ render လုပ်ခြင်း (Rendering components in tests)

Component တစ်ခုရဲ့ render output ကို test လုပ်ဖို့ — render ကို `act()` အတွင်းမှာ ထုပ်ပါ:

```js
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  // ✅ Render the component inside act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

ဒီမှာ — container တစ်ခု ဖန်တီးပြီး — document ထဲ ထည့်ကာ — `Counter` component ကို `act()` အတွင်းမှာ render လုပ်ပါတယ်။ ဒါက — assertions မလုပ်ခင် component က render ဖြစ်ပြီး — သူ့ရဲ့ effects တွေ အသုံးချပြီးသား ဖြစ်ကြောင်း သေချာစေပါတယ်။

`act` သုံးခြင်းက — assertions မလုပ်ခင် updates တွေ အားလုံး အသုံးချပြီးသား ဖြစ်ကြောင်း သေချာစေပါတယ်။

### Test တွေထဲမှာ events တွေ dispatch လုပ်ခြင်း (Dispatching events in tests)

Events တွေကို test လုပ်ဖို့ — event dispatch ကို `act()` အတွင်းမှာ ထုပ်ပါ:

```js
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  // ✅ Dispatch the event inside act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

ဒီမှာ — component ကို `act` နဲ့ render လုပ်ပြီး — event ကို နောက် `act()` တစ်ခုရဲ့ အတွင်းမှာ dispatch လုပ်ပါတယ်။ ဒါက — event ကနေ ဖြစ်လာတဲ့ updates တွေ အားလုံး — assertions မလုပ်ခင် အသုံးချပြီးသား ဖြစ်ကြောင်း သေချာစေပါတယ်။

> **သတိပြုရန် —** DOM events တွေ dispatch လုပ်တာက — DOM container ကို document ထဲ ထည့်ထားမှသာ အလုပ်လုပ်တယ်ဆိုတာ မမေ့ပါနဲ့။ Boilerplate code တွေ လျှော့ချဖို့ [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) လို library တစ်ခုကို သုံးနိုင်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "The current testing environment is not configured to support act(...)" error တစ်ခု ရနေတယ်

`act` သုံးဖို့ — သင့် test environment ထဲမှာ `global.IS_REACT_ACT_ENVIRONMENT=true` လို့ သတ်မှတ်ထားဖို့ လိုပါတယ်။ ဒါက — `act` ကို မှန်ကန်တဲ့ environment ထဲမှာပဲ သုံးကြောင်း သေချာစေဖို့ပါ။

ဒီ global ကို မသတ်မှတ်ရင် — ဒီလိုမျိုး error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```
Warning: The current testing environment is not configured to support act(...)
```

ဖြေရှင်းဖို့ — React tests တွေအတွက် သင့် global setup file ထဲမှာ ဒါကို ထည့်ပါ:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

> **မှတ်ချက်:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) လို testing frameworks တွေမှာ — `IS_REACT_ACT_ENVIRONMENT` ကို သင်အတွက် ကြိုပြီး သတ်မှတ်ပေးထားပါတယ်။
