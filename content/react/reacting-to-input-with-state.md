---
title: "State ဖြင့် User Input ကို တုံ့ပြန်ခြင်း"
description: "Declarative UI programming — component ရဲ့ visual state အမျိုးမျိုးကို ဖော်ထုတ်ခြင်း၊ state change ကို trigger လုပ်တဲ့အရာတွေကို ဆုံးဖြတ်ခြင်း၊ useState ဖြင့် state ကို ကိုယ်စားပြုခြင်းနဲ့ event handler တွေကို ချိတ်ဆက်ခြင်း"
order: 7
source: "https://react.dev/learn/reacting-to-input-with-state"
status: translated
updated: 2026-09-01
---

React က UI ကို ကိုင်တွယ်ဖို့ **declarative** (ဘာဖြစ်စေချင်လဲ ဖော်ပြသော) နည်းလမ်းတစ်ခုကို ပေးထားပါတယ်။ UI ရဲ့ အစိတ်အပိုင်းတစ်ခုချင်းစီကို တိုက်ရိုက် ကိုင်တွယ်မယ့်အစား — သင့် component ရှိနိုင်တဲ့ state အမျိုးမျိုးကို ဖော်ပြပြီး user input ပေါ်မူတည်ပြီး အဲဒီ state တွေကြား ပြောင်းလဲပေးပါတယ်။ ဒါက designer တွေ UI ကို တွေးတဲ့ပုံနဲ့ ဆင်တူပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Declarative UI programming က imperative UI programming နဲ့ ဘယ်လို ကွာခြားသလဲ
- သင့် component ရှိနိုင်တဲ့ visual state အမျိုးမျိုးကို ဘယ်လို ဖော်ထုတ်မလဲ
- Visual state တွေကြားက အပြောင်းအလဲတွေကို code ကနေ ဘယ်လို trigger လုပ်မလဲ

## Declarative UI က Imperative UI နဲ့ ဘယ်လို ကွာခြားလဲ

UI interaction တွေကို ဒီဇိုင်းလုပ်တဲ့အခါ — user ရဲ့ လုပ်ဆောင်ချက်တွေကို တုံ့ပြန်ပြီး UI က ဘယ်လို *ပြောင်းလဲ* လဲဆိုတာကို သင်စဉ်းစားမိတတ်ပါတယ်။ User က အဖြေတစ်ခု ပို့လို့ရတဲ့ form တစ်ခုကို ကြည့်ကြည့်ပါ:

- Form ထဲ တစ်ခုခု ရိုက်လိုက်တဲ့အခါ — "Submit" button က **enable ဖြစ်လာပါတယ်။**
- "Submit" ကို နှိပ်လိုက်တဲ့အခါ — form ရော button ပါ **disabled ဖြစ်သွားပြီး** spinner တစ်ခု **ပေါ်လာပါတယ်။**
- Network request အောင်မြင်ရင် — form **ပျောက်သွားပြီး** "Thank you" message **ပေါ်လာပါတယ်။**
- Network request မအောင်မြင်ရင် — error message **ပေါ်လာပြီး** form က **နောက်တစ်ကြိမ် enable ဖြစ်လာပါတယ်။**

**Imperative programming** မှာတော့ — အထက်ပါအချက်တွေက interaction ကို implement လုပ်ပုံနဲ့ တိုက်ရိုက် ကိုက်ညီပါတယ်။ ဖြစ်ပျက်သွားတဲ့အရာပေါ်မူတည်ပြီး UI ကို ကိုင်တွယ်ဖို့ တိကျတဲ့ ညွှန်ကြားချက်တွေကို ရေးပေးရပါတယ်။ ဒီလိုလည်း တွေးကြည့်နိုင်ပါတယ် — ကားထဲမှာ လူတစ်ယောက်နဲ့အတူ စီးနင်းရင်း လမ်းတစ်ခုချင်းစီကို ဘယ်ကို သွားရမယ်ဆိုပြီး ပြောပြနေသလိုပါပဲ။

သူတို့က သင်ဘယ်ကို သွားချင်လဲ မသိဘူး — သင်ပေးတဲ့ command တွေကိုပဲ လိုက်လုပ်ပါတယ်။ (ပြီးတော့ လမ်းညွှန်ချက် မှားရင် နေရာမှား ရောက်သွားမှာပေါ့!) အဲဒါကို *imperative* လို့ ခေါ်တာက — spinner ကစလို့ button အထိ element တစ်ခုချင်းစီကို "command" လုပ်ပြီး computer ကို UI ကို *ဘယ်လို* update လုပ်ရမယ်ဆိုတာ ပြောပြနေရလို့ပါ။

Imperative UI programming ရဲ့ ဒီဥပမာမှာ — form ကို React *မပါဘဲ* တည်ဆောက်ထားပါတယ်။ Browser ရဲ့ [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) ကိုပဲ သုံးထားပါတယ်:

```js
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```
```js
{
  "hardReloadOnChange": true
}
```
```html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```
Imperative နည်းနဲ့ UI ကို ကိုင်တွယ်တာက သီးခြားဥပမာတွေအတွက်တော့ အဆင်ပြေပါတယ် — ဒါပေမယ့် ပိုရှုပ်ထွေးတဲ့ system တွေမှာတော့ စီမံဖို့ အဆမတန် ခက်ခဲလာပါတယ်။ ဒီလိုပုံစံမျိုး form အမျိုးမျိုးနဲ့ ပြည့်နေတဲ့ စာမျက်နှာတစ်ခုကို update လုပ်တာကို စိတ်ကူးကြည့်ပါ။ UI element အသစ် ဒါမှမဟုတ် interaction အသစ်တစ်ခု ထည့်တိုင်း — bug တစ်ခုခု မထည့်မိအောင် (ဥပမာ — တစ်ခုခုကို ပြဖို့ ဒါမှမဟုတ် ဖျောက်ဖို့ မေ့နေတာမျိုး) ရှိပြီးသား code အကုန်လုံးကို သေချာ စစ်ဆေးရပါတယ်။

React က ဒီပြဿနာကို ဖြေရှင်းဖို့ တည်ဆောက်ထားတာပါ။

React မှာ — UI ကို တိုက်ရိုက် ကိုင်တွယ်မှာ မဟုတ်ပါဘူး။ ဆိုလိုတာက component တွေကို enable/disable လုပ်တာ၊ ပြတာ၊ ဖျောက်တာတွေကို တိုက်ရိုက် လုပ်မှာ မဟုတ်ပါဘူး။ အဲဒီအစား — **ဘာကို ပြချင်လဲဆိုတာကို ကြေညာလိုက်ရုံပါပဲ (declare)**၊ ပြီးတော့ React က UI ကို ဘယ်လို update လုပ်ရမယ်ဆိုတာ ကိုယ်တိုင် ရှာဖွေပေးပါတယ်။ Taxi ထဲဝင်ပြီး ဘယ်လမ်းကို ချိုးရမယ်ဆိုတာ ပြောမယ့်အစား — ဘယ်နေရာကို သွားချင်လဲဆိုတာကို ယာဉ်မောင်းကို ပြောသလိုပါပဲ။ သင့်ကို အဲဒီနေရာ ရောက်အောင် ပို့ပေးဖို့က ယာဉ်မောင်းရဲ့ အလုပ်ဖြစ်ပြီး — သူတို့မှာ သင်မစဉ်းစားမိတဲ့ shortcut တွေတောင် ရှိနိုင်ပါတယ်!

## UI ကို Declarative နည်းနဲ့ တွေးခြင်း

အထက်မှာ form တစ်ခုကို imperative နည်းနဲ့ ဘယ်လို implement လုပ်လဲ မြင်ခဲ့ရပါပြီ။ React နဲ့ တွေးတတ်ဖို့ ပိုနားလည်စေဖို့ — ဒီ UI ကို React နဲ့ ပြန်တည်ဆောက်တာကို အောက်မှာ အဆင့်ဆင့် လေ့လာပါမယ်:

1. သင့် component ရဲ့ visual state အမျိုးမျိုးကို **ဖော်ထုတ်ပါ**
2. အဲဒီ state တွေ ပြောင်းလဲစေတဲ့အရာတွေကို **ဆုံးဖြတ်ပါ**
3. `useState` သုံးပြီး state ကို memory ထဲ **ကိုယ်စားပြုပါ**
4. မလိုအပ်တဲ့ state variable တွေကို **ဖယ်ရှားပါ**
5. Event handler တွေကို state နဲ့ **ချိတ်ဆက်ပါ**

### အဆင့် ၁ — Component ရဲ့ Visual State အမျိုးမျိုးကို ဖော်ထုတ်ပါ

Computer science မှာ — ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine) က "state" အမျိုးမျိုးထဲက တစ်ခုခုမှာ ရှိနေတယ်ဆိုတာကို ကြားဖူးနိုင်ပါတယ်။ Designer တစ်ယောက်နဲ့ အလုပ်လုပ်ဖူးရင် — "visual state" အမျိုးမျိုးအတွက် mockup (ပုံကြမ်း) တွေကို မြင်ဖူးနိုင်ပါတယ်။ React က design နဲ့ computer science ရဲ့ ဆုံရာမှာ တည်ရှိပြီး — အဲဒီအယူအဆ နှစ်ခုလုံးက စိတ်ကူးရင်းမြစ်တွေ ဖြစ်ပါတယ်။

ပထမဆုံး — user မြင်နိုင်တဲ့ UI ရဲ့ "state" အမျိုးမျိုးကို စိတ်ထဲ မြင်ယောင်ကြည့်ပါ:

- **Empty:** Form မှာ disabled ဖြစ်နေတဲ့ "Submit" button ရှိပါတယ်။
- **Typing:** Form မှာ enabled ဖြစ်နေတဲ့ "Submit" button ရှိပါတယ်။
- **Submitting:** Form က လုံးဝ disabled ဖြစ်ပြီး spinner ပြထားပါတယ်။
- **Success:** Form အစား "Thank you" message ကို ပြထားပါတယ်။
- **Error:** Typing state နဲ့ တူပြီး error message တစ်ခု အပိုပါပါတယ်။

Designer တစ်ယောက်လိုပဲ — logic မထည့်ခင် state အမျိုးမျိုးအတွက် "mock up" (ပုံကြမ်းဆွဲ) လုပ်ချင်ပါလိမ့်မယ်။ ဥပမာ — အောက်က ဟာက form ရဲ့ visual အပိုင်းတစ်ခုတည်းအတွက် mock ပါ။ ဒီ mock ကို `status` ဆိုတဲ့ prop က ထိန်းချုပ်ထားပြီး default တန်ဖိုးက `'empty'` ဖြစ်ပါတယ်:

```jsx
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```
အဲဒီ prop ကို ကြိုက်တဲ့နာမည် ဘာပဲပေးပေး ရပါတယ် — နာမည်က အရေးမကြီးပါဘူး။ `status = 'empty'` ကို `status = 'success'` ဆိုပြီး ပြောင်းကြည့်ပြီး success message ပေါ်လာတာကို စမ်းကြည့်နိုင်ပါတယ်။ Mocking က logic တွေ မချိတ်ဆက်ခင် UI ပေါ်မှာ မြန်မြန် စမ်းသပ်လို့ရအောင် လုပ်ပေးပါတယ်။ အောက်က ဟာက အဲဒီ component ရဲ့ ပိုပြည့်စုံတဲ့ prototype တစ်ခုဖြစ်ပြီး — `status` prop နဲ့ပဲ "ထိန်းချုပ်" ထားဆဲ ဖြစ်ပါတယ်:

```jsx
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```
```css
.Error { color: red; }
```
#### Visual State အများအပြားကို တစ်ပြိုင်နက် ပြသခြင်း

Component တစ်ခုမှာ visual state အများကြီး ရှိတဲ့အခါ — အားလုံးကို စာမျက်နှာတစ်ခုတည်းမှာ ပြထားတာ အဆင်ပြေပါတယ်:

```jsx
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```
```jsx
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```
```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```
ဒီလိုစာမျက်နှာမျိုးကို "living styleguide" ဒါမှမဟုတ် "storybook" လို့ မကြာခဏ ခေါ်ပါတယ်။

### အဆင့် ၂ — State ပြောင်းလဲမှုကို ဘာက Trigger လုပ်သလဲ ဆုံးဖြတ်ပါ

Input အမျိုးအစား နှစ်မျိုးကို တုံ့ပြန်ပြီး state update ကို trigger လုပ်နိုင်ပါတယ်:

- **Human inputs** — button နှိပ်တာ၊ field ထဲ ရိုက်တာ၊ link ကို သွားတာတွေလိုမျိုး
- **Computer inputs** — network response ရောက်လာတာ၊ timeout ပြီးသွားတာ၊ image load ဖြစ်တာတွေလိုမျိုး

ကိစ္စနှစ်မျိုးလုံးမှာ — UI ကို update လုပ်ဖို့ [state variable](/docs/react/state-a-components-memory#anatomy-of-usestate) တွေကို set လုပ်ရပါတယ်။ သင်တည်ဆောက်နေတဲ့ form အတွက်ဆိုရင် — input အမျိုးမျိုးကို တုံ့ပြန်ပြီး state ကို ပြောင်းရပါမယ်:

- **Text input ပြောင်းလဲတာ** (human) — text box ထဲ အလွတ်ရှိ/မရှိပေါ်မူတည်ပြီး *Empty* state ကနေ *Typing* state ကို ဒါမှမဟုတ် ပြန်ပြောင်းသင့်ပါတယ်။
- **Submit button နှိပ်တာ** (human) — *Submitting* state ကို ပြောင်းသင့်ပါတယ်။
- **Network response အောင်မြင်တာ** (computer) — *Success* state ကို ပြောင်းသင့်ပါတယ်။
- **Network response မအောင်မြင်တာ** (computer) — ကိုက်ညီတဲ့ error message နဲ့အတူ *Error* state ကို ပြောင်းသင့်ပါတယ်။

> **မှတ်ချက်:** Human inputs တွေက [event handler](/docs/react/events) တွေ မကြာခဏ လိုအပ်တာကို သတိပြုပါ!

ဒီ flow ကို မြင်ယောင်လွယ်စေဖို့ — state တစ်ခုချင်းစီကို စာရွက်ပေါ်မှာ label တပ်ထားတဲ့ စက်ဝိုင်းတွေအဖြစ် ဆွဲပြီး — state နှစ်ခုကြားက အပြောင်းအလဲတစ်ခုချင်းစီကို မြားတစ်ချောင်းအဖြစ် ဆွဲကြည့်ပါ။ ဒီနည်းနဲ့ flow အများကြီးကို ပုံကြမ်းဆွဲပြီး — implement မလုပ်ခင် အကြာကြီး bug တွေကို ရှာဖွေ ဖယ်ရှားနိုင်ပါတယ်။

### အဆင့် ၃ — `useState` ဖြင့် State ကို Memory ထဲ ကိုယ်စားပြုပါ

နောက်တစ်ဆင့်မှာ — သင့် component ရဲ့ visual state တွေကို [`useState`](/docs/react/useState) နဲ့ memory ထဲ ကိုယ်စားပြုဖို့ လိုပါတယ်။ ရိုးရှင်းမှုက အဓိကပါ — state အပိုင်းတစ်ခုချင်းစီက "ရွေ့လျားနေတဲ့ အစိတ်အပိုင်း" တစ်ခုဖြစ်ပြီး **"ရွေ့လျားနေတဲ့ အစိတ်အပိုင်း" တွေကို တတ်နိုင်သမျှ နည်းနည်းပဲ ထားချင်ပါတယ်။** ပိုရှုပ်ထွေးလေ bug ပိုများလေပါပဲ!

*လုံးဝမဖြစ်မနေ* လိုအပ်တဲ့ state ကနေ စပါ။ ဥပမာ — input အတွက် `answer` ကို သိမ်းဖို့ လိုပြီး — နောက်ဆုံး error ကို သိမ်းဖို့ `error` (ရှိရင်) လိုပါတယ်:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```
ပြီးတော့ — ဘယ် visual state ကို ပြချင်လဲဆိုတာကို ကိုယ်စားပြုတဲ့ state variable တစ်ခု လိုပါတယ်။ အဲဒါကို memory ထဲ ကိုယ်စားပြုဖို့ နည်းလမ်းက တစ်ခုထက်ပိုပြီး ရှိတတ်လို့ — စမ်းသပ်ကြည့်ဖို့ လိုပါလိမ့်မယ်။

အကောင်းဆုံးနည်းလမ်းကို ချက်ချင်း မတွေးနိုင်ရင် — ဖြစ်နိုင်တဲ့ visual state တွေ အားလုံး ပါဝင်မှာ *သေချာ* တဲ့ state ပမာဏကို အရင် ထည့်ပြီး စပါ:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```
ပထမဆုံး စိတ်ကူးက အကောင်းဆုံး ဖြစ်ချင်မှ ဖြစ်မယ် — ဒါပေမယ့် အဆင်ပြေပါတယ်။ State ကို refactor လုပ်တာက လုပ်ငန်းစဉ်ရဲ့ အစိတ်အပိုင်းတစ်ခုပါ!

### အဆင့် ၄ — မလိုအပ်တဲ့ State Variable တွေကို ဖယ်ရှားပါ

State content ထဲမှာ duplication (ထပ်နေခြင်း) ကို ရှောင်ပြီး — မရှိမဖြစ်တဲ့အရာတွေကိုပဲ ခြေရာခံချင်ပါတယ်။ State structure ကို refactor လုပ်ဖို့ အချိန်နည်းနည်း ပေးတာက — component တွေကို နားလည်လွယ်စေပြီး duplication ကို လျှော့ချပေးပြီး မရည်ရွယ်တဲ့ အဓိပ္ပါယ်တွေကို ရှောင်ရှားပေးပါတယ်။ သင့်ရည်မှန်းချက်က — **memory ထဲက state က user ကို ပြချင်တဲ့ တရားဝင်တဲ့ UI တစ်ခုခုကို ကိုယ်စားမပြုတဲ့ အခြေအနေတွေကို တားဆီးဖို့** ဖြစ်ပါတယ်။ (ဥပမာ — error message ပြထားတုန်း input ကို disable လုပ်ထားတာမျိုး ဘယ်တော့မှ မလုပ်ချင်ပါဘူး — ဒါဆိုရင် user က error ကို ပြန်ပြင်လို့ မရတော့ဘူးလေ!)

State variable တွေအကြောင်း ကိုယ့်ကိုယ်ကို မေးနိုင်တဲ့ မေးခွန်းတချို့ ဒီမှာပါ:

- **ဒီ state က paradox (ဆန့်ကျင်ကွဲလွဲမှု) တစ်ခုကို ဖြစ်စေလား?** ဥပမာ — `isTyping` နဲ့ `isSubmitting` က တစ်ပြိုင်နက် `true` ဖြစ်လို့ မရပါဘူး။ Paradox ဆိုတာ များသောအားဖြင့် state က လုံလောက်စွာ ချုပ်ချယ်မထားဘူးဆိုတာကို ပြတာပါ။ Boolean နှစ်ခုရဲ့ ပေါင်းစပ်မှု လေးမျိုး ရှိတဲ့အနက် — သုံးမျိုးပဲ တရားဝင်တဲ့ state တွေနဲ့ ကိုက်ညီပါတယ်။ "မဖြစ်နိုင်တဲ့" state ကို ဖယ်ရှားဖို့ — ဒီနှစ်ခုကို တန်ဖိုးသုံးမျိုးထဲက တစ်မျိုး ဖြစ်ရမယ့် `status` တစ်ခုတည်းအဖြစ် ပေါင်းစပ်နိုင်ပါတယ်: `'typing'`၊ `'submitting'` ဒါမှမဟုတ် `'success'`။
- **အချက်အလက်တစ်ခုတည်းကို အခြား state variable မှာ ရှိပြီးသားလား?** နောက်ထပ် paradox တစ်ခု — `isEmpty` နဲ့ `isTyping` က တစ်ပြိုင်နက် `true` ဖြစ်လို့ မရပါဘူး။ သူတို့ကို သီးခြား state variable တွေအဖြစ် ခွဲထားရင် — သူတို့ ကိုက်ညီမှု ပျက်ပြီး bug တွေ ဖြစ်နိုင်ခြေ ရှိပါတယ်။ ကံကောင်းတာက — `isEmpty` ကို ဖယ်ပြီး `answer.length === 0` ဆိုပြီး စစ်လို့ ရပါတယ်။
- **အခြား state variable ရဲ့ ပြောင်းပြန်ကနေ အချက်အလက်တစ်ခုတည်းကို ရနိုင်လား?** `isError` က မလိုပါဘူး — ဘာလို့လဲဆိုတော့ `error !== null` ဆိုပြီး စစ်လို့ရလို့ပါ။

ဒီရှင်းလင်းမှု ပြီးတဲ့အခါ — (၇ ခုကနေ ၃ ခုအထိ လျှော့ပြီး) *မရှိမဖြစ်* state variable ၃ ခုပဲ ကျန်ပါတော့တယ်:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```
သူတို့ မရှိမဖြစ်ဆိုတာ သိပါတယ် — ဘာလို့လဲဆိုတော့ တစ်ခုခုကို ဖယ်လိုက်ရင် functionality တွေ ပျက်သွားလို့ပါ။

#### Reducer ဖြင့် "မဖြစ်နိုင်တဲ့" State တွေကို ဖယ်ရှားခြင်း

ဒီ variable သုံးခုက ဒီ form ရဲ့ state ကို လုံလောက်ကောင်းမွန်စွာ ကိုယ်စားပြုပါတယ်။ ဒါပေမယ့် — အဓိပ္ပါယ် အပြည့်အဝ မရှိသေးတဲ့ intermediate state တချို့ ရှိနေပါသေးတယ်။ ဥပမာ — `status` က `'success'` ဖြစ်နေချိန်မှာ `error` က `null` မဟုတ်တာမျိုးက အဓိပ္ပါယ် မရှိပါဘူး။ State ကို ပိုတိကျအောင် ပုံစံထုတ်ဖို့ — [reducer အဖြစ် ထုတ်ယူ](/docs/react/extracting-state-logic-into-a-reducer) နိုင်ပါတယ်။ Reducer တွေက state variable အများကြီးကို object တစ်ခုတည်းအဖြစ် ပေါင်းစည်းပြီး — ဆက်စပ်တဲ့ logic အားလုံးကို စုစည်းနိုင်စေပါတယ်!

### အဆင့် ၅ — State ကို Set လုပ်ဖို့ Event Handler တွေကို ချိတ်ဆက်ပါ

နောက်ဆုံးအနေနဲ့ — state ကို update လုပ်တဲ့ event handler တွေကို ဖန်တီးပါ။ အောက်က ဟာက — event handler အားလုံး ချိတ်ဆက်ပြီးသား နောက်ဆုံး form ပါ:

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
  // Pretend it's hitting the network.
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
```css
.Error { color: red; }
```
ဒီ code က မူရင်း imperative ဥပမာထက် ပိုရှည်ပေမယ့် — ပိုပြီး ခိုင်မာပါတယ် (မပျက်စီးလွယ်ပါဘူး)။ Interaction တွေ အားလုံးကို state change တွေအဖြစ် ဖော်ပြထားတာကြောင့် — ရှိပြီးသား state တွေကို မချိုးဖဲ့ဘဲ visual state အသစ်တွေကို နောက်မှ ထည့်နိုင်ပါတယ်။ State တစ်ခုချင်းစီမှာ ဘာပြရမယ်ဆိုတာကိုလည်း — interaction ရဲ့ logic ကိုယ်တိုင် မပြောင်းဘဲ ပြောင်းလဲနိုင်ပါတယ်။

## အကျဉ်းချုပ်

- Declarative programming ဆိုတာ — UI ကို အသေးစိတ် ထိန်းချုပ်နေတာမျိုး (imperative) မဟုတ်ဘဲ — visual state တစ်ခုချင်းစီအတွက် UI ကို ဖော်ပြခြင်းပါ။
- Component တစ်ခုကို တည်ဆောက်တဲ့အခါ:
  1. Visual state အားလုံးကို ဖော်ထုတ်ပါ။
  2. State ပြောင်းလဲမှုတွေအတွက် human နဲ့ computer trigger တွေကို ဆုံးဖြတ်ပါ။
  3. `useState` နဲ့ state ကို ပုံစံထုတ်ပါ။
  4. Bug နဲ့ paradox တွေကို ရှောင်ဖို့ မလိုအပ်တဲ့ state ကို ဖယ်ရှားပါ။
  5. State ကို set လုပ်ဖို့ event handler တွေကို ချိတ်ဆက်ပါ။

## စိန်ခေါ်မှုများ (Challenges)

### CSS Class တစ်ခုကို ထည့်ခြင်းနဲ့ ဖယ်ရှားခြင်း

ပုံကို နှိပ်လိုက်တဲ့အခါ — အပြင်ဘက် `<div>` ကနေ `background--active` CSS class ကို *ဖယ်ရှား* ပြီး — `<img>` မှာ `picture--active` class ကို *ထည့်* ပေးပါ။ Background ကို နောက်တစ်ကြိမ် နှိပ်ရင် — မူလ CSS class တွေ ပြန်ဖြစ်သင့်ပါတယ်။

Visual အနေနဲ့ — ပုံကို နှိပ်ရင် ခရမ်းရောင် background ပျောက်ပြီး ပုံရဲ့ border ကို မီးမောင်းထိုးပြ ဖြစ်လာမယ်လို့ မျှော်လင့်သင့်ပါတယ်။ ပုံအပြင်ဘက်ကို နှိပ်ရင် — background ကို မီးမောင်းထိုးပြပြီး ပုံရဲ့ border မီးမောင်းထိုးပြကို ဖယ်ရှားပါတယ်။

```jsx
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```
```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```
#### အဖြေ

ဒီ component မှာ visual state နှစ်ခု ရှိပါတယ် — image active ဖြစ်နေချိန်နဲ့ image inactive ဖြစ်နေချိန်ပါ:

- Image active ဖြစ်နေချိန်မှာ — CSS classes တွေက `background` နဲ့ `picture picture--active` ဖြစ်ပါတယ်။
- Image inactive ဖြစ်နေချိန်မှာ — CSS classes တွေက `background background--active` နဲ့ `picture` ဖြစ်ပါတယ်။

Image active ဖြစ်မဖြစ် မှတ်မိဖို့ boolean state variable တစ်ခုတည်းနဲ့ လုံလောက်ပါတယ်။ မူလတာဝန်က CSS class တွေကို ဖယ်ရှားခြင်း/ထည့်ခြင်း ဖြစ်ပါတယ်။ ဒါပေမယ့် React မှာတော့ — UI element တွေကို *ကိုင်တွယ်* မယ့်အစား ဘာကို မြင်ချင်လဲဆိုတာကို *ဖော်ပြ* ရပါတယ်။ ဒါကြောင့် CSS class နှစ်ခုလုံးကို လက်ရှိ state ပေါ်မူတည်ပြီး တွက်ချက်ရပါတယ်။ ပြီးတော့ — ပုံကို နှိပ်တာက background ပေါ်က click အဖြစ် မမှတ်မိစေဖို့ [propagation ကို ရပ်တန့်](/docs/react/events#stopping-propagation) ဖို့လည်း လိုပါတယ်။

ပုံကို နှိပ်ပြီး ပုံအပြင်ဘက်ကို နှိပ်ကြည့်ပြီး — ဒီ version အလုပ်လုပ်လားဆိုတာ စစ်ဆေးပါ:

```jsx
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```
```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```
တနည်းအားဖြင့် — JSX အပိုင်းနှစ်ခု သီးခြား ပြန်ပေးနိုင်ပါတယ်:

```jsx
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```
```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```
JSX အပိုင်းနှစ်ခုက tree တစ်ခုတည်းကို ဖော်ပြနေတယ်ဆိုရင် — သူတို့ရဲ့ nesting (ပထမ `<div>` → ပထမ `<img>`) တွေ တန်းညီနေဖို့ လိုပါတယ်။ မဟုတ်ရင် — `isActive` ကို ပြောင်းလိုက်တာနဲ့ အောက်က tree တစ်ခုလုံး ပြန်ဆောက်ခံရပြီး [state ကို ပြန်လည်သတ်မှတ် (reset)](/docs/react/preserving-and-resetting-state) ခံရပါလိမ့်မယ်။ ဒါကြောင့် — ကိစ္စနှစ်မျိုးလုံးမှာ ဆင်တူတဲ့ JSX tree ကို ပြန်ပေးရမယ်ဆိုရင် — JSX တစ်ပိုင်းတည်းအဖြစ် ရေးတာ ပိုကောင်းပါတယ်။

### Profile Editor

ဒီမှာ plain JavaScript နဲ့ DOM ကို သုံးပြီး implement လုပ်ထားတဲ့ form အသေးလေးတစ်ခု ရှိပါတယ်။ သူ့ရဲ့ အပြုအမူကို နားလည်ဖို့ စမ်းသပ်ကြည့်ပါ:

```js
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```
```js
{
  "hardReloadOnChange": true
}
```
```html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```
ဒီ form က mode နှစ်ခုကြား ပြောင်းလဲပါတယ် — editing mode မှာ inputs တွေကို မြင်ရပြီး — viewing mode မှာ ရလဒ်ကိုပဲ မြင်ရပါတယ်။ Button ရဲ့ label က — သင်ရောက်နေတဲ့ mode ပေါ်မူတည်ပြီး "Edit" နဲ့ "Save" ကြား ပြောင်းလဲပါတယ်။ Input တွေကို ပြောင်းလိုက်တဲ့အခါ — အောက်ဆုံးက welcome message က real time မှာ update ဖြစ်ပါတယ်။

သင့်တာဝန်က — အောက်က sandbox ထဲမှာ React နဲ့ ပြန် implement လုပ်ဖို့ပါ။ အဆင်ပြေအောင် markup ကို JSX အဖြစ် ပြောင်းပြီးသား ပေးထားပါတယ် — ဒါပေမယ့် မူလအတိုင်း inputs တွေကို ပြ/ဖျောက် လုပ်အောင် သင်ပြင်ဆင်ရပါမယ်။

အောက်ဆုံးက text ကိုလည်း update ဖြစ်အောင် သေချာ လုပ်ပါ!

```jsx
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```
```css
label { display: block; margin-bottom: 20px; }
```
#### အဖြေ

Input တန်ဖိုးတွေ သိမ်းဖို့ state variable နှစ်ခု လိုပါမယ် — `firstName` နဲ့ `lastName` ပါ။ ပြီးတော့ inputs တွေကို ပြသင့်လားဆိုတာကို သိမ်းဖို့ `isEditing` state variable တစ်ခုလည်း လိုပါမယ်။ `fullName` variable တော့ မလိုသင့်ပါဘူး — ဘာလို့လဲဆိုတော့ full name ကို `firstName` နဲ့ `lastName` ကနေ အမြဲ တွက်လို့ရလို့ပါ။

နောက်ဆုံးအနေနဲ့ — `isEditing` ပေါ်မူတည်ပြီး inputs တွေကို ပြ/ဖျောက်ဖို့ [conditional rendering](/docs/react/conditional-rendering) ကို သုံးသင့်ပါတယ်။

```jsx
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```
```css
label { display: block; margin-bottom: 20px; }
```
ဒီအဖြေကို မူရင်း imperative code နဲ့ နှိုင်းယှဉ်ကြည့်ပါ။ ဘယ်လို ကွာခြားပါသလဲ?

### React မပါဘဲ Imperative Solution ကို Refactor လုပ်ခြင်း

ဒီမှာ ယခင် challenge က မူရင်း sandbox ပါ — React မပါဘဲ imperative နည်းနဲ့ ရေးထားတာပါ:

```js
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```
```js
{
  "hardReloadOnChange": true
}
```
```html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```
React မရှိဘူးလို့ စိတ်ကူးကြည့်ပါ။ ဒီ code ကို — logic ပိုခိုင်မာပြီး React version နဲ့ ပိုဆင်အောင် refactor လုပ်နိုင်မလား? State က React မှာလိုပဲ ရှင်းလင်းစွာ (explicit) ရှိနေရင် — ဘယ်လိုပုံစံ ဖြစ်မလဲ?

ဘယ်ကစရမလဲ တွေးလို့ ခက်နေရင် — အောက်က stub မှာ structure အများစု ရှိပြီးသားပါ။ ဒီကနေ စရင် — `updateDOM` function ထဲက ပျောက်နေတဲ့ logic တွေကို ဖြည့်ပါ။ (လိုအပ်ရင် မူရင်း code ကို ကိုးကားပါ။)

```js
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```
```js
{
  "hardReloadOnChange": true
}
```
```html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```
#### အဖြေ

ပျောက်နေတဲ့ logic တွေက — inputs နဲ့ content တွေရဲ့ display ကို ပြောင်းလဲခြင်းနဲ့ labels တွေကို update လုပ်ခြင်း ပါဝင်ပါတယ်:

```js
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```
```js
{
  "hardReloadOnChange": true
}
```
```html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```
သင်ရေးထားတဲ့ `updateDOM` function က — state ကို set လုပ်တဲ့အခါ React က နောက်ကွယ်မှာ ဘာတွေ လုပ်လဲဆိုတာကို ပြသပါတယ်။ (ဒါပေမယ့် React က — နောက်ဆုံး set လုပ်ပြီးကတည်းက မပြောင်းလဲခဲ့တဲ့ properties တွေအတွက် DOM ကို ထိမှာ မဟုတ်ပါဘူး။)

## နောက်တစ်ဆင့်တွေ

- [State Structure ရွေးချယ်ခြင်း](/docs/react/choosing-the-state-structure) — state ကို ဖွဲ့စည်းပုံ ကောင်းကောင်းနဲ့ စီစဉ်နည်း
- [React အတွေးအခေါ်](/docs/react/thinking-in-react) — UI ကို component တွေနဲ့ တည်ဆောက်ပုံ
