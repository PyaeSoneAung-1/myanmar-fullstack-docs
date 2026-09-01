---
title: "State စီမံခန့်ခွဲမှု (Managing State)"
description: "App ကြီးလာတာနဲ့ state ကို စနစ်တကျ ဖွဲ့စည်းခြင်း — state ဖြင့် input တုံ့ပြန်ခြင်း၊ state structure ရွေးချယ်ခြင်း၊ lifting state up၊ state ထိန်းသိမ်း/reset လုပ်ခြင်း၊ reducer ထုတ်ယူခြင်း၊ context နဲ့ data နက်နက်ပို့ခြင်း၊ reducer + context ပေါင်းသုံးခြင်း"
order: 29
source: "https://react.dev/learn/managing-state"
status: translated
updated: 2026-09-01
---

သင့် application ကြီးထွားလာတာနဲ့အမျှ — state ကို ဘယ်လို ဖွဲ့စည်းထားလဲ၊ component တွေကြားမှာ data တွေ ဘယ်လို စီးဆင်းလဲဆိုတာကို — ပိုပြီး ရည်ရွယ်ချက်ရှိရှိ စဉ်းစားဖို့ လိုအပ်လာပါတယ်။ Redundant ဖြစ်တဲ့ ဒါမှမဟုတ် ထပ်နေတဲ့ state တွေက bug တွေရဲ့ အဖြစ်များတဲ့ အရင်းအမြစ်တစ်ခုပါ။ ဒီ chapter မှာ — state ကို ကောင်းကောင်း ဖွဲ့စည်းနည်း၊ state update logic ကို ထိန်းသိမ်းရလွယ်အောင် ထားနည်း၊ component တွေကြားမှာ state ကို မျှဝေနည်းတွေကို သင်ယူရမှာ ဖြစ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- [State ဖြင့် User Input ကို တုံ့ပြန်ခြင်း](/docs/react/reacting-to-input-with-state) — UI ပြောင်းလဲမှုတွေကို state ပြောင်းလဲမှုတွေအနေနဲ့ ဘယ်လို တွေးမလဲ
- [State Structure ရွေးချယ်ခြင်း](/docs/react/choosing-the-state-structure) — state ကို ကောင်းကောင်း ဘယ်လို ဖွဲ့စည်းမလဲ
- [Component များကြား State မျှဝေခြင်း](/docs/react/sharing-state-between-components) — component တွေကြား state မျှဝေဖို့ "lifting state up" လုပ်နည်း
- [State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း](/docs/react/preserving-and-resetting-state) — state ကို ထိန်းသိမ်း/reset လုပ်ခြင်းကို ဘယ်လို ထိန်းချုပ်မလဲ
- [State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း](/docs/react/extracting-state-logic-into-a-reducer) — ရှုပ်ထွေးတဲ့ state logic တွေကို function တစ်ခုထဲ ဘယ်လို စုစည်းမလဲ
- [Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း](/docs/react/passing-data-deeply-with-context) — "prop drilling" မလုပ်ဘဲ အချက်အလက် ပို့နည်း
- [Reducer နဲ့ Context ပေါင်း၍ Scale လုပ်ခြင်း](/docs/react/scaling-up-with-reducer-and-context) — app ကြီးလာတာနဲ့ state management ကို ဘယ်လို scale လုပ်မလဲ

## State ဖြင့် User Input ကို တုံ့ပြန်ခြင်း

React နဲ့ဆိုရင် — UI ကို code ကနေ တိုက်ရိုက် ပြုပြင်လို့ မရပါဘူး။ ဥပမာ — "button ကို disable လုပ်ပါ"၊ "button ကို enable လုပ်ပါ"၊ "success message ပြပါ" လိုမျိုး command တွေ ရေးမှာ မဟုတ်ပါဘူး။ အဲဒီအစား — သင့် component ရဲ့ visual state အမျိုးမျိုးအတွက် ("initial state"၊ "typing state"၊ "success state") မြင်ချင်တဲ့ UI ကို ဖော်ပြပြီး — user input တွေကို တုံ့ပြန်ပြီး state changes တွေကို trigger လုပ်ပါတယ်။ ဒါက designer တွေ UI ကို တွေးတဲ့ပုံနဲ့ ဆင်တူပါတယ်။

ဒီမှာ React နဲ့ တည်ဆောက်ထားတဲ့ quiz form တစ်ခုပါ — submit button ကို enable/disable လုပ်ဖို့နဲ့ success message ပြဖို့ `status` state variable ကို သုံးထားတာ သတိပြုပါ:

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network. → network ကို ထိသလို သရုပ်ဆောင်ထားပါတယ်။
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

State-driven mindset နဲ့ interactions တွေကို ဘယ်လို ချဉ်းကပ်မလဲ — [State ဖြင့် User Input ကို တုံ့ပြန်ခြင်း](/docs/react/reacting-to-input-with-state) မှာ ဆက်လေ့လာပါ။

## State Structure ရွေးချယ်ခြင်း

State ကို ကောင်းကောင်း ဖွဲ့စည်းထားခြင်းက — ပြုပြင်ရတာ၊ debug လုပ်ရတာ သာယာတဲ့ component တစ်ခုနဲ့ — bug တွေရဲ့ စဉ်ဆက်မပြတ် အရင်းအမြစ်တစ်ခု ဖြစ်နေတဲ့ component တစ်ခုကြားက ခြားနားချက်ကို ဖန်တီးပေးနိုင်ပါတယ်။ အရေးကြီးဆုံး မူက — **state ထဲမှာ redundant ဒါမှမဟုတ် ထပ်နေတဲ့ အချက်အလက်တွေ မပါဝင်သင့်ဘူး** ဆိုတာပါ။ မလိုအပ်တဲ့ state ရှိနေရင် — အဲဒါကို update လုပ်ဖို့ မေ့သွားလွယ်ပြီး — bug တွေ ဝင်လာနိုင်လို့ပါ။

ဥပမာ — ဒီ form မှာ **redundant** ဖြစ်တဲ့ `fullName` state variable တစ်ခု ရှိပါတယ်:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

အဲဒါကို ဖယ်ရှားပြီး — `fullName` ကို component rendering လုပ်နေတုန်း တွက်ချက်ခြင်းဖြင့် — code ကို ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

ဒါက ပြောင်းလဲမှုလေးတစ်ခုလို ထင်ရပေမယ့် — React app တွေထဲက bug အများကြီးကို ဒီနည်းနဲ့ ပြုပြင်ရပါတယ်။ Bug တွေ ရှောင်နိုင်ဖို့ state ပုံစံကို ဘယ်လို ဒီဇိုင်းဆွဲမလဲ — [State Structure ရွေးချယ်ခြင်း](/docs/react/choosing-the-state-structure) မှာ ဆက်လေ့လာပါ။

## Component များကြား State မျှဝေခြင်း

တစ်ခါတစ်ရံ — component နှစ်ခုရဲ့ state တွေက အမြဲတမ်း အတူတူ ပြောင်းလဲစေချင်ပါတယ်။ အဲဒါလုပ်ဖို့ — နှစ်ခုလုံးကနေ state ကို ဖယ်ရှားပြီး — သူတို့ရဲ့ အနီးဆုံး common parent ဆီ ရွှေ့ပြီး — props တွေကနေ အောက်ကို ပို့ပေးရပါတယ်။ ဒါကို "lifting state up" လို့ ခေါ်ပြီး — React code ရေးရာမှာ အသုံးအများဆုံး အလုပ်တွေထဲက တစ်ခုပါ။

ဒီဥပမာမှာ — panel တစ်ခုတည်းပဲ တစ်ချိန်မှာ active ဖြစ်သင့်ပါတယ်။ ဒါကို ရရှိဖို့ — active state ကို panel တစ်ခုချင်းစီရဲ့ အတွင်းမှာ ထားမယ့်အစား — parent component က state ကို ကိုင်ထားပြီး — child တွေအတွက် props တွေ သတ်မှတ်ပေးပါတယ်:

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

State ကို ဘယ်လို lift လုပ်ပြီး — component တွေကို sync ဖြစ်အောင် ထားမလဲ — [Component များကြား State မျှဝေခြင်း](/docs/react/sharing-state-between-components) မှာ ဆက်လေ့လာပါ။

## State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း

Component တစ်ခုကို re-render လုပ်တဲ့အခါ — React က tree ရဲ့ ဘယ်အပိုင်းတွေကို ထိန်းသိမ်းထားရမယ် (ပြီး update လုပ်ရမယ်)၊ ဘယ်အပိုင်းတွေကို စွန့်ပစ်ပြီး သုညကနေ ပြန်ဖန်တီးရမယ်ဆိုတာ ဆုံးဖြတ်ဖို့ လိုပါတယ်။ အများစုမှာ — React ရဲ့ အလိုအလျောက် အပြုအမူက လုံလောက်ပါတယ်။ ပုံမှန်အားဖြင့် — React က အရင် render လုပ်ထားတဲ့ component tree နဲ့ "ကိုက်ညီနေတဲ့" tree အပိုင်းတွေကို ထိန်းသိမ်းပါတယ်။

ဒါပေမယ့် — တစ်ခါတစ်ရံ — ဒါက သင်လိုချင်တာ မဟုတ်ပါဘူး။ React က မူရင်း အပြုအမူကို ကျော်လွှားပြီး — `key` တစ်ခု မတူအောင် ပေးခြင်းဖြင့် — component တစ်ခုကို state ပြန်လည်သတ်မှတ်ဖို့ *အတင်းအကျပ်* လုပ်နိုင်ပါတယ် — `<Chat key={email} />` လိုမျိုးပေါ့။ ဒါက React ကို — recipient မတူရင် — data အသစ် (နဲ့ input လိုမျိုး UI) တွေနဲ့ သုညကနေ ပြန်ဖန်တီးရမယ့် *component အမျိုးမျိုး* အနေနဲ့ သတ်မှတ်ဖို့ ပြောတာပါ။

State ရဲ့ သက်တမ်းနဲ့ သူ့ကို ဘယ်လို ထိန်းချုပ်မလဲ — [State ကို ထိန်းသိမ်းခြင်းနဲ့ ပြန်လည်သတ်မှတ်ခြင်း](/docs/react/preserving-and-resetting-state) မှာ ဆက်လေ့လာပါ။

## State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း

State updates အများအပြား — event handler အများအပြားမှာ ပြန့်ကျဲနေတဲ့ component တွေက လွှမ်းမိုးသွားနိုင်ပါတယ်။ ဒီလိုကိစ္စတွေအတွက် — state update logic အားလုံးကို — သင့် component ရဲ့ အပြင်ဘက်မှာ — "reducer" လို့ခေါ်တဲ့ function တစ်ခုတည်းထဲ စုစည်းနိုင်ပါတယ်။ သင့် event handlers တွေက တိုတောင်းသွားပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ သူတို့က user "actions" တွေကိုပဲ သတ်မှတ်လို့ပါ။ File ရဲ့ အောက်ခြေမှာ — reducer function က action တစ်ခုချင်းစီကို တုံ့ပြန်ပြီး state က ဘယ်လို update ဖြစ်သင့်လဲဆိုတာ သတ်မှတ်ပေးပါတယ်:

```jsx
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Logic တွေကို reducer function ထဲမှာ ဘယ်လို စုစည်းမလဲ — [State Logic ကို Reducer အဖြစ် ထုတ်ယူခြင်း](/docs/react/extracting-state-logic-into-a-reducer) မှာ ဆက်လေ့လာပါ။

## Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း

ပုံမှန်အားဖြင့် — parent component ကနေ child component ဆီ props တွေကနေ အချက်အလက် ပို့ပါလိမ့်မယ်။ ဒါပေမယ့် — prop တစ်ခုကို component အများကြီးကနေ ဖြတ်ပို့ရတာမျိုး၊ ဒါမှမဟုတ် component အများကြီးက အချက်အလက်တစ်ခုတည်း လိုအပ်တာမျိုးဆိုရင် — props ပို့တာ အဆင်မပြေတော့ပါဘူး။ **Context** က parent component ကို — အောက်က tree ထဲက component ဘယ်နေရာမှာမဆို — ဘယ်လောက်ပဲ နက်နက်ဖြစ်ဖြစ် — props တွေကနေ တိုက်ရိုက် ပို့စရာမလိုဘဲ — အချက်အလက်တချို့ ရနိုင်အောင် လုပ်ပေးပါတယ်။

[Context ဖြင့် Data ကို နက်နက်ရှိုင်းရှိုင်း ပို့ဆောင်ခြင်း](/docs/react/passing-data-deeply-with-context) မှာ — props ပို့တာရဲ့ အခြားရွေးချယ်စရာ context သုံးခြင်းအကြောင်း ဆက်လေ့လာပါ။

## Reducer နဲ့ Context ပေါင်း၍ Scale လုပ်ခြင်း

Reducers တွေက component တစ်ခုရဲ့ state update logic ကို စုစည်းနိုင်စေပြီး — Context တွေက အချက်အလက်တွေကို တခြား component တွေဆီ နက်နက်ရှိုင်းရှိုင်း ပို့နိုင်စေပါတယ်။ Reducers နဲ့ context တွေကို ပေါင်းစပ်ပြီး — ရှုပ်ထွေးတဲ့ screen တစ်ခုရဲ့ state ကို စီမံခန့်ခွဲနိုင်ပါတယ်။ ဒီနည်းလမ်းနဲ့ဆိုရင် — ရှုပ်ထွေးတဲ့ state ရှိတဲ့ parent component တစ်ခုက — အဲဒါကို reducer တစ်ခုနဲ့ စီမံပြီး — tree ထဲက ဘယ်နေရာမှာမဆို ရှိတဲ့ component တွေက — context ကနေ သူ့ရဲ့ state ကို ဖတ်နိုင်ပြီး — အဲဒီ state ကို update လုပ်ဖို့ actions တွေ dispatch လုပ်နိုင်ပါတယ်။

App ကြီးလာတာနဲ့ state management ဘယ်လို scale ဖြစ်လဲ — [Reducer နဲ့ Context ပေါင်း၍ Scale လုပ်ခြင်း](/docs/react/scaling-up-with-reducer-and-context) မှာ ဆက်လေ့လာပါ။

## နောက်တစ်ဆင့်တွေ

- [State ဖြင့် User Input ကို တုံ့ပြန်ခြင်း](/docs/react/reacting-to-input-with-state) ကနေ စပြီး — ဒီ chapter ကို page တစ်ခုချင်းစီ ဖတ်သွားနိုင်ပါတယ်။
- ဒီအကြောင်းအရာတွေ သိပြီးသားဆိုရင် — [Escape Hatches (လွတ်မြောက်ရေး ပေါက်ပေါက်များ)](/docs/react/escape-hatches) ကို ဆက်ဖတ်ပါ။
