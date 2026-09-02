---
title: "link"
description: "External resources (stylesheet, font, icon စသည်) တွေကို ချိတ်ဆက်ဖို့ ဒါမှမဟုတ် link metadata ထည့်ဖို့ built-in `<link>` component — `<head>` ထဲ အလိုအလျောက် နေရာချပေးခြင်း၊ stylesheet တွေအတွက် precedence/လျော့ပေါင်းစု (de-duplicate) ပြုလုပ်ပေးခြင်း၊ preload/modulepreload props များ"
order: 80
source: "https://react.dev/reference/react-dom/components/link"
status: translated
updated: 2026-09-02
---

[Browser ရဲ့ built-in `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) က — stylesheet လို external resources တွေကို သုံးနိုင်စေဖို့ ဒါမှမဟုတ် document ကို link metadata တွေနဲ့ မှတ်သားဖို့ ခွင့်ပြုပါတယ်။

```js
<link rel="icon" href="favicon.ico" />
```

## ရည်ညွှန်းချက် (Reference)

### `<link>`

Stylesheets, fonts, icons လို external resources တွေကို ချိတ်ဆက်ဖို့ ဒါမှမဟုတ် document ကို link metadata တွေနဲ့ မှတ်သားဖို့ — [browser ရဲ့ built-in `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ကို render လုပ်ပါ။ `<link>` ကို component ဘယ်ကနေမဆို render လုပ်လို့ရပြီး — React က သက်ဆိုင်ရာ DOM element ကို — အချို့သော case တွေမှာ — document ရဲ့ `<head>` ထဲမှာ နေရာချပေးပါတယ်။

```js
<link rel="icon" href="favicon.ico" />
```

#### Props

`<link>` က [common element props](/docs/react/built-in-components) အားလုံးကို ထောက်ပံ့ပါတယ်။

- `rel`: string တစ်ခု၊ **လိုအပ်ပါတယ်**။ [Resource နဲ့ ရှိတဲ့ ဆက်စပ်မှု (relationship)](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) ကို သတ်မှတ်ပါတယ်။ React က `rel="stylesheet"` ပါတဲ့ links တွေကို တခြား links တွေနဲ့ မတူညီစွာ ဆက်ဆံပါတယ်။

`rel="stylesheet"` ဖြစ်တဲ့အခါ သက်ဆိုင်တဲ့ props:

- `precedence`: string တစ်ခု။ `<link>` DOM node ကို document `<head>` ထဲက တခြား nodes တွေနဲ့ ယှဉ်ရင် ဘယ်နေရာမှာ ရပ်တည်စေရမလဲ React ကို ပြောပြပြီး — ဘယ် stylesheet က ဘယ်ဟာကို override လုပ်နိုင်လဲ ဆုံးဖြတ်ပါတယ်။ React က ပထမဆုံး တွေ့ရှိတဲ့ precedence values တွေကို "အနိမ့်" လို့လည်းကောင်း၊ နောက်မှ တွေ့ရှိတဲ့ဟာတွေကို "အမြင့်" လို့လည်းကောင်း မှတ်ယူပါတယ်။ Style rules တွေက atomic (သီးခြားစီ) ဖြစ်လို့ — style system တော်တော်များများက precedence value တစ်ခုတည်းနဲ့တင် အဆင်ပြေစွာ အလုပ်လုပ်နိုင်ပါတယ်။ Precedence တူတဲ့ stylesheets တွေက `<link>` ဖြစ်ဖြစ်၊ inline `<style>` tags ဖြစ်ဖြစ်၊ [`preinit`](https://react.dev/reference/react-dom/preinit) functions နဲ့ load လုပ်တာဖြစ်ဖြစ် — အတူတကွ စုစည်းခံရပါတယ်။
- `media`: string တစ်ခု။ Stylesheet ကို သတ်မှတ်ထားတဲ့ [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) တစ်ခုအတွင်းမှာပဲ ကန့်သတ်ပါတယ်။
- `title`: string တစ်ခု။ [Alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) တစ်ခုရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။

`rel="stylesheet"` ဖြစ်ပေမယ့် React ရဲ့ stylesheet အထူး ပြုမူပုံကို ပိတ်ထားတဲ့ props:

- `disabled`: boolean တစ်ခု။ Stylesheet ကို disable လုပ်ပါတယ်။
- `onError`: function တစ်ခု။ Stylesheet load မဖြစ်နိုင်တဲ့အခါ ခေါ်ခံရပါတယ်။
- `onLoad`: function တစ်ခု။ Stylesheet load ပြီးဆုံးတဲ့အခါ ခေါ်ခံရပါတယ်။

`rel="preload"` ဒါမှမဟုတ် `rel="modulepreload"` ဖြစ်တဲ့အခါ သက်ဆိုင်တဲ့ props:

- `as`: string တစ်ခု။ Resource ရဲ့ အမျိုးအစား။ တန်ဖိုးတွေက `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker` ဖြစ်နိုင်ပါတယ်။
- `imageSrcSet`: string တစ်ခု။ `as="image"` ဖြစ်တဲ့အခါမှပဲ သက်ဆိုင်ပြီး — [image ရဲ့ source set](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) ကို သတ်မှတ်ပါတယ်။
- `imageSizes`: string တစ်ခု။ `as="image"` ဖြစ်တဲ့အခါမှပဲ သက်ဆိုင်ပြီး — [image ရဲ့ sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) ကို သတ်မှတ်ပါတယ်။

`rel="icon"` ဒါမှမဟုတ် `rel="apple-touch-icon"` ဖြစ်တဲ့အခါ သက်ဆိုင်တဲ့ props:

- `sizes`: string တစ်ခု။ [Icon ရဲ့ sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) ကို သတ်မှတ်ပါတယ်။

အားလုံးမှာ သက်ဆိုင်တဲ့ props:

- `href`: string တစ်ခု။ ချိတ်ဆက်ထားတဲ့ resource ရဲ့ URL။
- `crossOrigin`: string တစ်ခု။ သုံးမယ့် [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)။ တန်ဖိုးတွေက `anonymous` နဲ့ `use-credentials` ဖြစ်နိုင်ပါတယ်။ `as` ကို `"fetch"` လို့ သတ်မှတ်ထားရင် လိုအပ်ပါတယ်။
- `referrerPolicy`: string တစ်ခု။ Fetch လုပ်တဲ့အခါ ပို့မယ့် [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)။ တန်ဖိုးတွေက `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, `unsafe-url` ဖြစ်နိုင်ပါတယ်။
- `fetchPriority`: string တစ်ခု။ Resource ကို fetch လုပ်တဲ့အခါ ဦးစားပေးအဆင့် အကြံပြုချက်။ တန်ဖိုးတွေက `auto` (default), `high`, `low` ဖြစ်နိုင်ပါတယ်။
- `hrefLang`: string တစ်ခု။ ချိတ်ဆက်ထားတဲ့ resource ရဲ့ ဘာသာစကား။
- `integrity`: string တစ်ခု။ Resource ရဲ့ cryptographic hash — [စစ်မှန်ကြောင်း စစ်ဆေးဖို့](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)။
- `type`: string တစ်ခု။ Resource ရဲ့ MIME type။

React နဲ့ သုံးဖို့ **အကြံမပြုတဲ့** props:

- `blocking`: string တစ်ခု။ `"render"` လို့ သတ်မှတ်ထားရင် — stylesheet load မပြီးမချင်း page ကို render မလုပ်ဖို့ browser ကို ညွှန်ကြားပါတယ်။ React က Suspense သုံးပြီး ပိုကောင်းမွန်တဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။

#### အထူး render ပြုလုပ်ပုံ (Special rendering behavior)

`<link>` component ကို React tree ရဲ့ ဘယ်နေရာမှာပဲ render လုပ်လုပ် — React က သူနဲ့ ကိုက်ညီတဲ့ DOM element ကို document ရဲ့ `<head>` အတွင်းမှာ အမြဲ နေရာချပါတယ်။ DOM ထဲမှာ `<link>` နေထိုင်လို့ရတဲ့ တစ်ခုတည်းသော နေရာက `<head>` ဖြစ်ပေမယ့် — page တစ်ခုကို ကိုယ်စားပြုတဲ့ component က သူ့ရဲ့ `<link>` components တွေကို ကိုယ်တိုင် render လုပ်နိုင်တာက အဆင်ပြေပြီး composable ဖြစ်စေပါတယ်။ ခြွင်းချက်တချို့ ရှိပါတယ်:

- `<link>` မှာ `rel="stylesheet"` prop ရှိရင် — ဒီအထူး ပြုမူပုံ ရဖို့ `precedence` prop လည်း ပါရပါမယ်။ Document အတွင်းက stylesheets တွေရဲ့ အစီအစဉ်က အရေးပါလို့ — React က ဒီ stylesheet ကို တခြားဟာတွေနဲ့ ယှဉ်ရင် ဘယ်လို အစီအစဉ်ချရမလဲ သိဖို့လိုပါတယ် (ဒါကို `precedence` prop နဲ့ သတ်မှတ်ပါတယ်)။ `precedence` prop မပါရင် အထူး ပြုမူပုံ မရှိပါဘူး။
- `<link>` မှာ [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop ရှိရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီကိစ္စမှာ document နဲ့ မဆိုင်ဘဲ page ရဲ့ သီးခြားအပိုင်းတစ်ခုအကြောင်း metadata ကို ကိုယ်စားပြုလို့ပါ။
- `<link>` မှာ `onLoad` ဒါမှမဟုတ် `onError` prop ရှိရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီကိစ္စမှာ ချိတ်ဆက်ထားတဲ့ resource ရဲ့ loading ကို React component ထဲမှာ ကိုယ်တိုင် စီမံနေလို့ပါ။

#### Stylesheet များအတွက် အထူး ပြုမူပုံ (Special behavior for stylesheets)

ဒါ့အပြင် `<link>` က stylesheet တစ်ခုဆီ ညွှန်တယ်ဆိုရင် (ဆိုလိုတာ props ထဲ `rel="stylesheet"` ပါရင်) — React က အောက်ပါအတိုင်း အထူး ဆက်ဆံပါတယ်:

- Stylesheet load လုပ်နေချိန်မှာ `<link>` ကို render လုပ်တဲ့ component က [suspend](/docs/react/suspense) ဖြစ်သွားပါတယ်။
- Components အများကြီးက stylesheet တစ်ခုတည်းကို ညွှန်တဲ့ links တွေ render လုပ်ရင် — React က ၎င်းတို့ကို လျော့ပေါင်းစုပြီး DOM ထဲမှာ link တစ်ခုတည်းပဲ ထည့်ပါတယ်။ `href` prop တူတဲ့ links နှစ်ခုကို တစ်ခုတည်းအဖြစ် သတ်မှတ်ပါတယ်။

ဒီအထူး ပြုမူပုံအတွက် ခြွင်းချက်နှစ်ခု ရှိပါတယ်:

- Link မှာ `precedence` prop မရှိရင် အထူး ပြုမူပုံ မရှိပါဘူး — document အတွင်းက stylesheets တွေရဲ့ အစီအစဉ်က အရေးပါလို့ React က ဒီ stylesheet ကို ဘယ်လို အစီအစဉ်ချရမလဲ သိဖို့လိုပြီး ဒါကို `precedence` prop နဲ့ သတ်မှတ်လို့ပါ။
- `onLoad`, `onError` ဒါမှမဟုတ် `disabled` props တွေထဲက တစ်ခုခု ပေးထားရင် အထူး ပြုမူပုံ မရှိပါဘူး — ဒီ props တွေက component ထဲမှာ stylesheet ရဲ့ loading ကို ကိုယ်တိုင် စီမံနေတာကို ညွှန်ပြလို့ပါ။

ဒီအထူး ပြုမူပုံမှာ သတိထားစရာ နှစ်ချက် ပါဝင်ပါတယ်:

- Link render ပြီးသွားရင် — props တွေ ပြောင်းလဲမှုတွေကို React က လျစ်လျူရှုပါတယ်။ (Development မှာ ဒါမျိုး ဖြစ်ရင် React က warning ထုတ်ပါတယ်။)
- Link ကို render လုပ်ခဲ့တဲ့ component ကို unmount လုပ်ပြီးသွားရင်တောင် — React က link ကို DOM ထဲမှာ ချန်ထားနိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### ဆက်စပ် resources တွေဆီ ချိတ်ဆက်ခြင်း

Icon, canonical URL ဒါမှမဟုတ် pingback လို ဆက်စပ် resources တွေဆီ ညွှန်တဲ့ links တွေနဲ့ document ကို မှတ်သားနိုင်ပါတယ်။ React က ဒီ metadata တွေကို React tree ထဲ ဘယ်နေရာမှာပဲ render လုပ်လုပ် — document ရဲ့ `<head>` အတွင်းမှာ နေရာချပေးပါတယ်:

```js
export default function BlogPage() {
  return (
    <>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </>
  );
}
```

### Stylesheet တစ်ခုဆီ ချိတ်ဆက်ခြင်း

Component တစ်ခုက ကောင်းစွာ ပြသနိုင်ဖို့ stylesheet တစ်ခုအပေါ် မှီခိုနေရင် — အဲဒီ stylesheet ဆီ ညွှန်တဲ့ link တစ်ခုကို component အတွင်းမှာ render လုပ်နိုင်ပါတယ်။ Stylesheet load လုပ်နေချိန်မှာ သင့် component က [suspend](/docs/react/suspense) ဖြစ်ပါလိမ့်မယ်။ `precedence` prop ကို မဖြစ်မနေ ပေးရပါတယ် — ဒါက React ကို ဒီ stylesheet ကို တခြားဟာတွေနဲ့ ယှဉ်ရင် ဘယ်နေရာမှာ ထားရမလဲ ပြောပြပြီး — precedence ပိုမြင့်တဲ့ stylesheets တွေက ပိုနိမ့်တဲ့ဟာတွေကို override လုပ်နိုင်ပါတယ်:

```js
export default function SiteMapPage() {
  return (
    <>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </>
  );
}
```

> **မှတ်ချက်:** Stylesheet တစ်ခုကို သုံးချင်တဲ့အခါ — [`preinit`](https://react.dev/reference/react-dom/preinit) function ကို ခေါ်တာက အကျိုးရှိနိုင်ပါတယ်။ ဒီ function က `<link>` component တစ်ခုကို render လုပ်တာထက် stylesheet ကို စောစော fetch စေနိုင်ပါတယ် — ဥပမာ [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) ပို့ခြင်းအားဖြင့်ပါ။

### Stylesheet precedence ကို ထိန်းချုပ်ခြင်း

Stylesheets တွေ တစ်ခုနဲ့တစ်ခု ဆန့်ကျင်နိုင်ပြီး — အဲဒီအခါ browser က document ထဲမှာ နောက်ကျမှ ပါတဲ့ဟာကို လိုက်နာပါတယ်။ React မှာတော့ `precedence` prop နဲ့ stylesheets တွေရဲ့ အစီအစဉ်ကို ထိန်းချုပ်နိုင်ပါတယ်။ ဒီဥပမာမှာ component သုံးခုက stylesheets တွေ render လုပ်ပြီး — precedence တူတဲ့ဟာတွေက `<head>` ထဲမှာ အုပ်စုဖွဲ့ ခံရပါတယ်:

```js
function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}
```

`precedence` values တွေကိုယ်တိုင်က လိုသလို နာမည်ပေးလို့ရတဲ့ အစမဲ့ တန်ဖိုးတွေပါ — React က ပထမဆုံး တွေ့တဲ့ precedence values တွေကို "အနိမ့်"၊ နောက်မှ တွေ့တဲ့ဟာတွေကို "အမြင့်" အဖြစ် မှတ်ယူတာ သတိပြုပါ။

### Stylesheet render လုပ်ခြင်းကို လျော့ပေါင်းစုခြင်း

Stylesheet တစ်ခုတည်းကို components အများကြီးကနေ render လုပ်ရင် — React က document head ထဲမှာ `<link>` တစ်ခုတည်းပဲ နေရာချပါတယ်:

```js
function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

ဒီ `Component` ကို page ထဲမှာ ဘယ်နှစ်ကြိမ်ပဲ render လုပ်လုပ် — DOM ထဲကို link တစ်ခုတည်းပဲ ရောက်သွားမှာ ဖြစ်ပါတယ်။

### Document ထဲက သီးခြား items တွေကို links နဲ့ မှတ်သားခြင်း

`<link>` component ကို `itemProp` prop နဲ့ သုံးပြီး — document ထဲက သီးခြား items တွေကို ဆက်စပ် resources တွေဆီ ညွှန်တဲ့ links တွေနဲ့ မှတ်သားနိုင်ပါတယ်။ ဒီကိစ္စမှာ React က ဒီမှတ်သားချက်တွေကို document `<head>` ထဲ မထည့်ဘဲ — တခြား React component တစ်ခုလိုပဲ နေရာချပါတယ်:

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
