---
title: "State နဲ့ Rendering"
description: "State က snapshot သဘောတရား — setState က re-render ကို ဘယ်လို trigger လုပ်သလဲ၊ render/commit၊ batching နဲ့ state update တွေ ဘာကြောင့် ချက်ချင်း မပေါ်တာလဲ"
order: 5
source: "https://react.dev/learn/state-as-a-snapshot"
status: translated
updated: 2026-09-01
---

## Setting State က Re-render ကို Trigger လုပ်တယ်

[React မိတ်ဆက်](/docs/react/getting-started) မှာ state ဆိုတာ component ရဲ့ "မှတ်ဉာဏ်" ဆိုတာ မြင်ခဲ့ရပြီးပါပြီ။ ဒီစာမျက်နှာမှာ — **state က ဘယ်လို အလုပ်လုပ်သလဲ** ဆိုတာကို နက်နက်နဲနဲ ကြည့်ပါမယ်။

React မှာ state update လုပ်တာက UI ကို တိုက်ရိုက် ပြောင်းတာမဟုတ်ဘဲ — **re-render ကို request လုပ်တာပါ**။ User က form ပို့လိုက်ရင် `setIsSent(true)` က re-render အသစ်တစ်ခုကို trigger လုပ်ပြီး React က component function ကို နောက်တစ်ကြိမ် ပြန် run လုပ်ပါတယ်:

```jsx
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>;
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Render — Snapshot တစ်ခု ရိုက်ခြင်း

"Rendering" ဆိုတာ — React က component function ကို ခေါ်ပြီး **အဲဒီ render ရဲ့ snapshot (ပုံရိပ်)** ကို ရိုက်ယူတာပါ။ Component က **အဲဒီ render ထဲမှာ ရှိတဲ့ state တန်ဖိုး** ကို သုံးပြီး — props, event handler, UI အားလုံး ပါဝင်တဲ့ snapshot တစ်ခုကို ပြန်ပေးပါတယ်။ ဒါကို render ဆိုပြီး — အဲဒီ render ရဲ့ output ကို DOM ထဲ ရေးသွင်းတာကို **commit** လို့ ခေါ်ပါတယ်။ အဆင့်နှစ်ဆင့်လုံးက state setter ခေါ်လိုက်တာနဲ့ အလိုအလျောက် ဖြစ်ပါတယ် — ဘယ် DOM ကို ပြောင်းရမယ်ဆိုတာ ကိုယ်တိုင် ပြောစရာ မလိုပါဘူး။

State က render ပြီးတာနဲ့ — **နောက် render အသစ် မဖြစ်မချင်း မပြောင်းပါဘူး**။ ဒီလို တွေးကြည့်ပါ — render တစ်ခုစီမှာ React က state ရဲ့ "photo" တစ်ပုံ ရိုက်ပြီး အဲဒီ photo ပေါ်မူတည်ပြီး UI ကို ဆွဲပေးတာပါ။ Setter ကို ခေါ်လိုက်တာနဲ့ — နောက် render အတွက် photo အသစ်တစ်ပုံ ရိုက်ဖို့ request လုပ်လိုက်တာပါပဲ။ ဒါကြောင့် event handler တစ်ခုထဲမှာ setter ကို အကြိမ်ဘယ်လောက်ပဲ ခေါ်ခေါ် — လက်ရှိ render ရဲ့ state က တစ်ကြိမ်တည်းသာ ရှိပါတယ်:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  );
}
```

ဒီမှာ `setNumber` ကို သုံးကြိမ် ခေါ်ထားပေမယ့် — button နှိပ်တိုင်း `number` က **1 ပဲ တိုးပါတယ်**။ ဘာလို့လဲဆိုတော့ — setter တစ်ခုချင်းစီက `number` variable ကိုတော့ မပြောင်းဘဲ re-render အတွက် request ကိုပဲ ပေးလိုက်လို့ပါ။ သုံးကြိမ်လုံးက render snapshot ထဲက တန်ဖိုးတစ်ခုတည်း (`0`) ကို ဖတ်နေတာဖြစ်ပါတယ်။ နောက်ဆုံးမှာတော့ React က render အသစ်တစ်ခု run ပြီး — `number` အသစ် (`1`) နဲ့ UI ကို ပြန်ဆွဲပါတယ်။

## State Update တွေက Batching လုပ်ပါတယ်

State setter တွေကို event handler ထဲမှာ အများကြီး ခေါ်ရင်လည်း — React က သူတို့ကို **တစ်ခါတည်း စုပြီး (batch)** render တစ်ခုတည်းနဲ့ ပြီးအောင် လုပ်ပါတယ်။ Batching က performance အတွက် အရေးကြီးပါတယ် — setter တိုင်းမှာ render ပြန်ဆွဲနေရင် app နှေးသွားမှာမို့ React က handler တစ်ခုလုံး ပြီးမှ render တစ်ခုတည်းနဲ့ စုပြီး လုပ်ပါတယ်။ ဒါကြောင့် handler ထဲက code တွေ အကုန်လုံး ပြီးမှ render ဖြစ်တာဖြစ်ပြီး — handler ပြီးတဲ့အထိ state က snapshot အတိုင်း ရှိနေပါတယ်။ ဒါကြောင့်လည်း — event ကြားထဲမှာ state ကို ဖတ်ရင် **update မဖြစ်သေးတဲ့ တန်ဖိုး** ကို ရပါတယ်:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number); // 0 — snapshot ထဲက တန်ဖိုး
      }}>+5</button>
    </>
  );
}
```

`alert(number)` က `5` မဟုတ်ဘဲ **`0` ကို ပြပါတယ်** — event handler က re-render မဖြစ်သေးခင် state အသစ်ကို မမြင်ရလို့ပါ။ `number` က နောက် render မှာမှ `5` ဖြစ်လာပါတယ်။

အချုပ်ပြောရရင် — state က သင်ရေးထားတဲ့ code မှာ အချိန်တိုင်း "အသက်ရှင်နေတဲ့" variable မဟုတ်ဘဲ — render တစ်ခုချင်းစီရဲ့ **snapshot** ပါ။ ဒါကို နားလည်ထားရင် state update နဲ့ ပတ်သက်တဲ့ ရှုပ်ထွေးမှုတွေ အများကြီး ရှင်းသွားပါလိမ့်မယ်။

## နောက်တစ်ဆင့်တွေ

- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) — event handler အခြေခံတွေ
- [React အတွေးအခေါ်](/docs/react/thinking-in-react) — state ဘယ်မှာ ထားရမလဲ ဆုံးဖြတ်နည်း
