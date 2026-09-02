---
title: "script"
description: "Document ထဲကို inline ဒါမှမဟုတ် external script တွေ ထည့်ဖို့ built-in `<script>` component — `src` + `async={true}` ပေးထားရင် `<head>` ထဲ ရွှေ့ပြီး တူညီတဲ့ scripts တွေကို လျော့ပေါင်းစုပေးခြင်း၊ props များ"
order: 82
source: "https://react.dev/reference/react-dom/components/script"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) က — သင့် document ထဲကို script တစ်ခု ထည့်နိုင်စေပါတယ်။

```js
<script> alert("hi!") </script>
```

## ရည်ညွှန်းချက် (Reference)

### `<script>`

Document ထဲကို inline ဒါမှမဟုတ် external scripts တွေ ထည့်ဖို့ — [browser ရဲ့ built-in `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) ကို render လုပ်ပါ။ `<script>` ကို component ဘယ်ကနေမဆို render လုပ်လို့ရပြီး — React က (အချို့သော case တွေမှာ) သက်ဆိုင်ရာ DOM element ကို document head ထဲမှာ နေရာချပြီး — ထပ်တူကျတဲ့ scripts တွေကို လျော့ပေါင်းစုပေးပါတယ်။

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

#### Props

`<script>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

`children` ဒါမှမဟုတ် `src` prop — နှစ်ခုထဲက **တစ်ခုခု** ရှိရပါမယ်။

- `children`: string တစ်ခု။ Inline script တစ်ခုရဲ့ source code။
- `src`: string တစ်ခု။ External script တစ်ခုရဲ့ URL။

အခြား ထောက်ပံ့ထားတဲ့ props:

- `async`: boolean တစ်ခု။ Document ရဲ့ ကျန်အစိတ်အပိုင်းတွေ process လုပ်ပြီးမှ script ကို run ဖို့ browser ကို ခွင့်ပြုပါတယ် — performance အတွက် ဦးစားပေးလို့ရတဲ့ အပြုအမူပါ။
- `crossOrigin`: string တစ်ခု။ သုံးမယ့် [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)။ တန်ဖိုးတွေက `anonymous` နဲ့ `use-credentials` ဖြစ်နိုင်ပါတယ်။
- `fetchPriority`: string တစ်ခု။ Scripts အများကြီးကို တစ်ပြိုင်နက် fetch လုပ်တဲ့အခါ — browser ကို ဘယ် script ကို အရင်ဦးစားပေးရမလဲ ခွင့်ပြုပါတယ်။ `"high"`, `"low"` ဒါမှမဟုတ် `"auto"` (default) ဖြစ်နိုင်ပါတယ်။
- `integrity`: string တစ်ခု။ Script ရဲ့ cryptographic hash — [စစ်မှန်ကြောင်း စစ်ဆေးဖို့](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)။
- `noModule`: boolean တစ်ခု။ ES modules တွေကို ထောက်ပံ့တဲ့ browsers တွေမှာ script ကို disable လုပ်ပြီး — မထောက်ပံ့တဲ့ browsers တွေအတွက် fallback script တစ်ခု ထားနိုင်စေပါတယ်။
- `nonce`: string တစ်ခု။ တင်းကျပ်တဲ့ Content Security Policy သုံးတဲ့အခါ [resource ကို ခွင့်ပြုဖို့](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) cryptographic [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) တစ်ခု။
- `referrer`: string တစ်ခု။ Script နဲ့ သူက ဆင့်ပွား fetch လုပ်တဲ့ resources တွေအတွက် [ဘယ် Referer header ပို့ရမလဲ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) သတ်မှတ်ပါတယ်။
- `type`: string တစ်ခု။ Script က [classic script လား၊ ES module လား၊ import map လား](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type) သတ်မှတ်ပါတယ်။

React ရဲ့ script အထူး ပြုမူပုံကို ပိတ်ထားတဲ့ props:

- `onError`: function တစ်ခု။ Script load မဖြစ်နိုင်တဲ့အခါ ခေါ်ခံရပါတယ်။
- `onLoad`: function တစ်ခု။ Script load ပြီးဆုံးတဲ့အခါ ခေါ်ခံရပါတယ်။

React နဲ့ သုံးဖို့ **အကြံမပြုတဲ့** props:

- `blocking`: string တစ်ခု။ `"render"` လို့ သတ်မှတ်ထားရင် — script load မပြီးမချင်း page ကို render မလုပ်ဖို့ browser ကို ညွှန်ကြားပါတယ်။ React က Suspense သုံးပြီး ပိုကောင်းမွန်တဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။
- `defer`: string တစ်ခု။ Document load ပြီးတဲ့အထိ script ကို run မလုပ်ဖို့ browser ကို တားဆီးပါတယ်။ Streaming server-rendered components တွေနဲ့ ကိုက်ညီမှု မရှိပါဘူး။ `async` prop ကို သုံးပါ။

#### အထူး render ပြုလုပ်ပုံ (Special rendering behavior)

React က `<script>` components တွေကို document ရဲ့ `<head>` ထဲကို ရွှေ့ပြီး — ထပ်တူကျတဲ့ scripts တွေကို လျော့ပေါင်းစုနိုင်ပါတယ်။

ဒီအပြုအမူကို ရွေးချယ်အသုံးပြုဖို့ — `src` နဲ့ `async={true}` props တွေ ပေးပါ။ React က `src` တူတဲ့ scripts တွေကို လျော့ပေါင်းစုပါလိမ့်မယ်။ Scripts တွေကို လုံခြုံစွာ ရွှေ့ပြောင်းနိုင်ဖို့ `async` prop က `true` ဖြစ်ရပါမယ်။

ဒီအထူး ပြုမူပုံမှာ သတိထားစရာ နှစ်ချက် ပါဝင်ပါတယ်:

- Script render ပြီးသွားရင် — props တွေ ပြောင်းလဲမှုတွေကို React က လျစ်လျူရှုပါတယ်။ (Development မှာ ဒါမျိုး ဖြစ်ရင် React က warning ထုတ်ပါတယ်။)
- Script ကို render လုပ်ခဲ့တဲ့ component ကို unmount လုပ်ပြီးသွားရင်တောင် — React က script ကို DOM ထဲမှာ ချန်ထားနိုင်ပါတယ်။ (Scripts တွေက DOM ထဲ ထည့်လိုက်တာနဲ့ တစ်ကြိမ်ပဲ run လုပ်တာမို့ — ဒါက ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။)

## အသုံးပြုပုံ (Usage)

### External script တစ်ခုကို render လုပ်ခြင်း

Component တစ်ခုက ကောင်းစွာ ပြသနိုင်ဖို့ script တချို့အပေါ် မှီခိုနေရင် — component အတွင်းမှာ `<script>` တစ်ခုကို render လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် — script load ပြီးမပြီးခင် component က commit ဖြစ်သွားနိုင်ပါတယ်။ Script ရဲ့ content ပေါ် စတင် မှီခိုဖို့အတွက် — `load` event fire ဖြစ်တာကို စောင့်ရပါမယ် — ဥပမာ `onLoad` prop ကို သုံးပြီး။

React က `src` တူတဲ့ scripts တွေကို လျော့ပေါင်းစုပြီး — components အများကြီးက script တစ်ခုတည်းကို render လုပ်ရင်တောင် DOM ထဲကို တစ်ခုတည်းပဲ ထည့်ပါလိမ့်မယ်:

```js
function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}
```

> **မှတ်ချက်:** Script တစ်ခုကို သုံးချင်တဲ့အခါ — [`preinit`](https://react.dev/reference/react-dom/preinit) function ကို ခေါ်တာက အကျိုးရှိနိုင်ပါတယ်။ ဒီ function က `<script>` component တစ်ခုကို render လုပ်တာထက် script ကို စောစော fetch စေနိုင်ပါတယ် — ဥပမာ [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) ပို့ခြင်းအားဖြင့်ပါ။

### Inline script တစ်ခုကို render လုပ်ခြင်း

Inline script တစ်ခု ထည့်ဖို့ — script ရဲ့ source code ကို children အဖြစ်နဲ့ `<script>` component ကို render လုပ်ပါ။ Inline scripts တွေကို လျော့ပေါင်းစုတာ ဒါမှမဟုတ် document `<head>` ထဲကို ရွှေ့တာ မလုပ်ပါဘူး:

```js
function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}
```
