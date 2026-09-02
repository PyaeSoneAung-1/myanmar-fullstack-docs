---
title: "ရှိပြီးသား Project တစ်ခုထဲကို React ထည့်သွင်းခြင်း (Add React to an Existing Project)"
description: "React ကို ရှိပြီးသား project ထဲကို ထည့်နည်း — website ရဲ့ subroute တစ်ခုလုံးအတွက် React framework သုံးခြင်း၊ စာမျက်နှာ တစ်စိတ်ပိုင်းမှာ interactive components render လုပ်ခြင်း၊ React Native ထည့်သွင်းခြင်း"
order: 118
source: "https://react.dev/learn/add-react-to-an-existing-project"
status: translated
updated: 2026-09-02
---

သင့် ရှိပြီးသား project ထဲကို interactivity တစ်ချို့ ထည့်ချင်တယ်ဆိုရင် — React နဲ့ အစကနေ ပြန်ရေးစရာ မလိုပါဘူး။ React ကို သင့် ရှိပြီးသား stack ထဲကို ထည့်ပြီး — interactive React components တွေကို နေရာမရွေး render လုပ်နိုင်ပါတယ်။

> **မှတ်ချက်** — Local development အတွက် [Node.js](https://nodejs.org/en/) ကို install လုပ်ထားဖို့ လိုပါတယ်။ React ကို online မှာ ဒါမှမဟုတ် ရိုးရှင်းတဲ့ HTML page တစ်ခုနဲ့ [စမ်းသုံးကြည့်လို့](https://react.dev/learn/installation) ရပေမယ့် — လက်တွေ့မှာ development အတွက် သုံးချင်တဲ့ JavaScript tooling အများစုက Node.js လိုအပ်ပါတယ်။

## သင့် website ရဲ့ subroute တစ်ခုလုံးအတွက် React သုံးခြင်း

သင့်မှာ တခြား server technology (Rails လိုမျိုး) နဲ့ တည်ဆောက်ထားတဲ့ `example.com` မှာ ရှိပြီးသား web app တစ်ခု ရှိပြီး — `example.com/some-app/` နဲ့ စတင်တဲ့ routes တွေ အားလုံးကို React နဲ့ အပြည့်အဝ အကောင်အထည်ဖော်ချင်တယ် ဆိုပါစို့။

ဒီလို setup လုပ်ဖို့ ကျွန်ုပ်တို့ အကြံပြုနည်း:

1. [React-based frameworks](/docs/react/creating-a-react-app) တစ်ခုကို သုံးပြီး သင့် app ရဲ့ React အပိုင်းကို **တည်ဆောက်ပါ**။
2. သင့် framework ရဲ့ configuration ထဲမှာ `/some-app` ကို ***base path*** အဖြစ် **သတ်မှတ်ပါ** (ဒီလို — [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/))။
3. `/some-app/` အောက်က requests တွေ အားလုံးကို သင့် React app က ကိုင်တွယ်နိုင်အောင် သင့် server ဒါမှမဟုတ် proxy တစ်ခုကို **configure လုပ်ပါ**။

ဒါက သင့် app ရဲ့ React အပိုင်းက [အကောင်းဆုံး လုပ်ထုံးလုပ်နည်းတွေကနေ အကျိုးခံစားနိုင်စေပါတယ်](/docs/react/build-a-react-app-from-scratch)။

React-based frameworks အများစုက full-stack ဖြစ်ပြီး — သင့် React app ကို server ရဲ့ အကျိုးကျေးဇူးတွေ သုံးခွင့် ပေးပါတယ်။ ဒါပေမယ့် — server ပေါ်မှာ JavaScript run လို့မရဘူး ဒါမှမဟုတ် run ချင်မှုမရှိဘူးဆိုရင်တောင် — ဒီနည်းလမ်းကို သုံးနိုင်ပါတယ်။ အဲဒီအခါမျိုးမှာ — HTML/CSS/JS export (Next.js အတွက် [`next export` output](https://nextjs.org/docs/advanced-features/static-html-export), Gatsby အတွက် default) ကို `/some-app/` မှာ serve လုပ်ပါ။

## သင့် ရှိပြီးသား စာမျက်နှာရဲ့ အစိတ်အပိုင်းတစ်ခုအတွက် React သုံးခြင်း

သင့်မှာ တခြား technology (server-side ဖြစ်တဲ့ Rails ဒါမှမဟုတ် client-side ဖြစ်တဲ့ Backbone လိုမျိုး) နဲ့ တည်ဆောက်ထားတဲ့ ရှိပြီးသား စာမျက်နှာ တစ်ခု ရှိပြီး — အဲဒီ စာမျက်နှာပေါ်က တစ်နေရာရာမှာ interactive React components တွေ render လုပ်ချင်တယ် ဆိုပါစို့။ ဒါက React ကို ပေါင်းစည်းဖို့ သာမန် နည်းလမ်းတစ်ခုပါ — တကယ်တော့ Meta မှာ React အသုံးပြုမှု အများစုက ဒီလိုပုံစံမျိုးနဲ့ပဲ နှစ်ပေါင်းများစွာ ဖြစ်ခဲ့ပါတယ်!

ဒါကို အဆင့် နှစ်ခုနဲ့ လုပ်နိုင်ပါတယ်:

1. [JSX syntax](/docs/react/writing-markup-with-jsx) သုံးနိုင်စေမယ့်၊ [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) syntax တွေနဲ့ သင့် code ကို modules တွေအဖြစ် ခွဲနိုင်စေမယ့်၊ [npm](https://www.npmjs.com/) package registry ကနေ packages တွေ (ဥပမာ React) သုံးနိုင်စေမယ့် **JavaScript environment တစ်ခု setup လုပ်ပါ**။
2. စာမျက်နှာပေါ်မှာ သင်မြင်ချင်တဲ့ နေရာတွေမှာ **သင့် React components တွေကို render လုပ်ပါ**။

တိကျတဲ့ နည်းလမ်းက သင့် ရှိပြီးသား စာမျက်နှာရဲ့ setup ပေါ် မူတည်ပါတယ် — အသေးစိတ် တစ်ချို့ကို လမ်းလျှောက်ကြည့်ရအောင်။

### အဆင့် 1 — Modular JavaScript environment တစ်ခု setup လုပ်ခြင်း

Modular JavaScript environment တစ်ခုက — သင့် React components တွေကို code အားလုံး file တစ်ခုတည်းထဲ ရေးမယ့်အစား — file တစ်ခုချင်းစီမှာ ရေးနိုင်စေပါတယ်။ [npm](https://www.npmjs.com/) registry ပေါ်မှာ တခြား developer တွေ publish လုပ်ထားတဲ့ packages တွေ — React ကိုယ်တိုင်အပါအဝင် — အားလုံးကိုလည်း သုံးနိုင်စေပါတယ်။ ဒါကို ဘယ်လို လုပ်လဲဆိုတာ သင့် ရှိပြီးသား setup ပေါ် မူတည်ပါတယ်:

- **သင့် app က `import` statements တွေ သုံးတဲ့ files တွေအဖြစ် ခွဲထားပြီးသားဆိုရင်** — သင့်မှာ ရှိပြီးသား setup ကိုပဲ သုံးကြည့်ပါ။ သင့် JS code ထဲမှာ `<div />` ရေးကြည့်တဲ့အခါ syntax error တက်မလား စစ်ကြည့်ပါ။ Syntax error တက်ရင် — [Babel နဲ့ သင့် JavaScript code ကို transform လုပ်ဖို့](https://babeljs.io/setup) လိုနိုင်ပြီး — JSX သုံးဖို့ [Babel React preset](https://babeljs.io/docs/babel-preset-react) ကို enable လုပ်ရပါမယ်။

- **သင့် app မှာ JavaScript modules တွေ compile လုပ်ဖို့ setup မရှိသေးဘူးဆိုရင်** — [Vite](https://vite.dev/) နဲ့ setup လုပ်ပါ။ Vite community က Rails, Django, Laravel အပါအဝင် backend frameworks တွေနဲ့ [integrations အများကြီးကို ထိန်းသိမ်းထားပါတယ်](https://github.com/vitejs/awesome-vite#integrations-with-backends)။ သင့် backend framework က စာရင်းထဲမှာ မပါရင် — Vite builds တွေကို သင့် backend နဲ့ ကိုယ်တိုင် ပေါင်းစည်းဖို့ [ဒီ guide](https://vite.dev/guide/backend-integration.html) ကို လိုက်နာပါ။

သင့် setup အလုပ်လုပ်မလား စစ်ဆေးဖို့ — သင့် project folder ထဲမှာ ဒီ command ကို run ပါ:

```bash
npm install react react-dom
```

ပြီးရင် ဒီ code lines တွေကို သင့် main JavaScript file (နာမည်က `index.js` ဒါမှမဟုတ် `main.js` ဖြစ်နိုင်ပါတယ်) ရဲ့ ထိပ်ဆုံးမှာ ထည့်ပါ:

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

သင့် စာမျက်နှာရဲ့ content တစ်ခုလုံး "Hello, world!" နဲ့ အစားထိုးခံလိုက်ရရင် — အရာအားလုံး အလုပ်လုပ်ပါပြီ! ဆက်ဖတ်ပါ။

> **မှတ်ချက်** — Modular JavaScript environment တစ်ခုကို ရှိပြီးသား project တစ်ခုထဲကို ပထမဆုံးအကြိမ် ပေါင်းစည်းတာက ခြိမ်းခြောက်စရာ ခံစားရနိုင်ပေမယ့် — တန်ဖိုးရှိပါတယ်! ရှုပ်ထွေးသွားရင် — ကျွန်ုပ်တို့ရဲ့ [community resources](https://react.dev/community) ဒါမှမဟုတ် [Vite Chat](https://chat.vite.dev/) ကို စမ်းကြည့်ပါ။

### အဆင့် 2 — စာမျက်နှာပေါ်က ဘယ်နေရာမှာမဆို React components တွေ render လုပ်ခြင်း

အရင် အဆင့်မှာ — သင် ဒီ code ကို သင့် main file ရဲ့ ထိပ်ဆုံးမှာ ထည့်ခဲ့ပါတယ်:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

တကယ်တော့ — သင် ရှိပြီးသား HTML content ကို ရှင်းပစ်ချင်မှာ မဟုတ်ပါဘူး!

ဒီ code ကို ဖျက်ပစ်လိုက်ပါ။

ဒီအစား — သင် ဖြစ်နိုင်ခြေ အများဆုံးက သင့် React components တွေကို သင့် HTML ထဲက သီးခြားနေရာတွေမှာ render လုပ်ချင်တာပါ။ သင့် HTML page (ဒါမှမဟုတ် အဲဒါကို ထုတ်ပေးတဲ့ server templates) ကို ဖွင့်ပြီး — tag တစ်ခုခုပေါ်မှာ unique တစ်ခုဖြစ်တဲ့ [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute တစ်ခု ထည့်ပါ — ဥပမာ:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

ဒါက သင့်ကို အဲဒီ HTML element ကို [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) နဲ့ ရှာတွေ့စေပြီး — သင့်ကိုယ်ပိုင် React component ကို အထဲမှာ render လုပ်နိုင်ဖို့ [`createRoot`](/docs/react/create-root) ဆီ ပို့နိုင်စေပါတယ်:

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

`index.html` ကနေ မူရင်း HTML content က ထိန်းသိမ်းထားပေမယ့် — သင့်ကိုယ်ပိုင် `NavigationBar` React component က သင့် HTML ထဲက `<nav id="navigation">` အတွင်းမှာ ပေါ်လာတာကို သတိပြုပါ။ ရှိပြီးသား HTML page တစ်ခုထဲမှာ React components တွေ render လုပ်ခြင်းအကြောင်း ပိုသိရဖို့ — [`createRoot` usage documentation](/docs/react/create-root) ကို ဖတ်ပါ။

ရှိပြီးသား project တစ်ခုထဲမှာ React ကို စတင် သုံးတဲ့အခါ — သေးငယ်တဲ့ interactive components တွေ (buttons လိုမျိုး) နဲ့ စပြီး — တဖြည်းဖြည်း "အပေါ်ကို ရွှေ့တင်" သွားကာ — နောက်ဆုံးမှာ သင့် စာမျက်နှာ တစ်ခုလုံး React နဲ့ တည်ဆောက်ဖြစ်သွားတာ သာမန်ပါ။ အဲဒီအဆင့်ကို ရောက်ခဲ့ရင် — React ရဲ့ အကျိုးကျေးဇူးတွေ အပြည့်အဝ ရဖို့ [React framework](/docs/react/creating-a-react-app) တစ်ခုဆီ ချက်ချင်း migrate လုပ်ဖို့ အကြံပြုပါတယ်။

## ရှိပြီးသား native mobile app တစ်ခုထဲမှာ React Native သုံးခြင်း

[React Native](https://reactnative.dev/) ကိုလည်း ရှိပြီးသား native apps တွေထဲကို တဖြည်းဖြည်း ပေါင်းစည်းနိုင်ပါတယ်။ Android (Java ဒါမှမဟုတ် Kotlin) ဒါမှမဟုတ် iOS (Objective-C ဒါမှမဟုတ် Swift) အတွက် ရှိပြီးသား native app တစ်ခု ရှိရင် — React Native screen တစ်ခု ထည့်ဖို့ [ဒီ guide](https://reactnative.dev/docs/integration-with-existing-apps) ကို လိုက်နာပါ။
