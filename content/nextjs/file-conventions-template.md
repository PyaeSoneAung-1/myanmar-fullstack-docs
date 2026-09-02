---
title: "template.js (Navigation တိုင်း state ပြန်စတင်တဲ့ wrapper)"
description: "template.js file convention — layout လိုပဲ မိမိအောက်က UI တွေကို wrap လုပ်ပေးပြီး navigation တစ်ကြိမ်စီမှာ children Client Components တွေရဲ့ state ကို ပြန်လည်စတင်စေတဲ့ file; component hierarchy မှာ layout.js နဲ့ error.js ကြားမှာ render လုပ်တယ်"
order: 32
source: "https://nextjs.org/docs/app/api-reference/file-conventions/template"
status: translated
updated: 2026-09-02
---

**template** file က [layout](/docs/nextjs/pages-layouts) တစ်ခုနဲ့ ဆင်တူပြီး — layout (သို့) page တစ်ခုကို wrap လုပ်ပေးပါတယ်။ Routes တွေကြားမှာ ဆက်လက် တည်ရှိနေပြီး state ထိန်းသိမ်းပေးတဲ့ layouts တွေနဲ့ မတူဘဲ — templates တွေကို unique key (သီးသန့် key) တစ်ခုစီ ပေးထားပါတယ်။ ဆိုလိုတာက — template အတွင်းက children Client Components တွေဟာ navigation လုပ်တဲ့အခါ ကိုယ့် state တွေကို ပြန်လည် စတင်သွားပါတယ်။

ဒီ template တွေက အောက်ပါကိစ္စတွေမှာ အသုံးဝင်ပါတယ်:

- Navigation လုပ်တိုင်း `useEffect` တွေကို ပြန်လည် ချိန်ကိုက် (resynchronize) စေချင်တဲ့အခါ။
- Navigation လုပ်တိုင်း children Client Component တစ်ခုရဲ့ state ကို ပြန်လည် စတင်စေချင်တဲ့အခါ — ဥပမာ input field တစ်ခုရဲ့ တန်ဖိုး။
- Framework ရဲ့ ပုံမှန် အပြုအမူ (default behavior) တွေကို ပြောင်းလဲချင်တဲ့အခါ။ ဥပမာ — layouts အတွင်းက Suspense boundaries တွေက fallback ကို ပထမဆုံး load မှာပဲ ပြသပြီး — templates တွေကတော့ navigation တိုင်းမှာ ပြသပါတယ်။

## Convention

`template.js` file ကနေ React component တစ်ခုကို default export လုပ်ခြင်းအားဖြင့် template တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Component က `children` prop တစ်ခုကို လက်ခံရပါမယ်။

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

အထပ်လိုက် နေရာချပုံ (nesting) အနေနဲ့ — `template.js` က layout နဲ့ ၎င်းရဲ့ children တွေကြားမှာ render လုပ်ပါတယ်။ ရိုးရှင်းအောင် ချုံ့ပြထားတဲ့ output က ဒီလိုပါ:

```jsx
<Layout>
  {/* Note that the template is given a unique key. */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

[Component hierarchy](/docs/nextjs/project-structure) အရ — `template.js` က `layout.js` နဲ့ `error.js` ကြားမှာ render လုပ်ပါတယ်။ ၎င်းက `error.js`, `loading.js`, `not-found.js` နဲ့ `page.js` တွေကို wrap လုပ်ပေးပေမယ့် — တူညီတဲ့ segment ထဲက `layout.js` ကိုတော့ **wrap မလုပ်ပါဘူး**။

## Props

### `children` (required)

Template က `children` prop တစ်ခုကို လက်ခံပါတယ် — template ကို unique key တစ်ခု အလိုအလျောက် ပေးထားကြောင်း သတိပြုပါ။

```jsx
<Layout>
  {/* Note that the template is automatically given a unique key. */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

## Behavior

- **Server Components**: Templates တွေက ပုံမှန် default အနေနဲ့ Server Components တွေ ဖြစ်ပါတယ်။
- **With navigation**: Templates တွေက ကိုယ့် segment အဆင့်အတွက် unique key တစ်ခုစီ ရရှိပါတယ် — အဲဒီ segment (dynamic params တွေ အပါအဝင်) ပြောင်းလဲတဲ့အခါ remount (ပြန်လည် mount လုပ်ခြင်း) ဖြစ်ပါတယ်။ ပိုနက်တဲ့ segments တွေအတွင်းက navigations တွေက — အထက်အဆင့် templates တွေကို remount ဖြစ်စေမှာ မဟုတ်ပါဘူး။ Search params တွေကလည်း remount တွေကို trigger လုပ်မပေးပါဘူး။
- **State reset**: Template အတွင်းက Client Component တိုင်းဟာ navigation လုပ်တဲ့အခါ ကိုယ့် state ကို ပြန်လည် စတင်ပါလိမ့်မယ်။
- **Effect re-run**: `useEffect` လို effects တွေက component remount ဖြစ်တာနဲ့အမျှ ပြန်လည် ချိန်ကိုက် (re-synchronize) လုပ်ပါလိမ့်မယ်။
- **DOM reset**: Template အတွင်းက DOM elements တွေကို လုံးဝ အသစ် ပြန်လည် ဖန်တီးပါတယ်။

### Navigation နဲ့ remounting အတွင်း Templates တွေ

ဒီ section က navigation အတွင်းမှာ templates တွေ ဘယ်လို ပြုမူလဲဆိုတာ ဖော်ပြပေးပါတယ် — route change တစ်ခုချင်းစီမှာ ဘယ် templates တွေ remount ဖြစ်ပြီး ဘာကြောင့်လဲဆိုတာကို အဆင့်ဆင့် ပြသထားပါတယ်။

ဥပမာအတွက် ဒီ project tree ကို သုံးကြည့်ရအောင်:

```
app
├── about
│   ├── page.tsx
├── blog
│   ├── [slug]
│   │   └── page.tsx
│   ├── page.tsx
│   └── template.tsx
├── layout.tsx
├── page.tsx
└── template.tsx
```

`/` ကနေ စတင်တဲ့အခါ React tree က အကြမ်းဖျင်း ဒီလိုပုံ ရှိပါတယ်။

> **သတိပြုရန်:** ဥပမာတွေထဲမှာ ပြထားတဲ့ `key` တန်ဖိုးတွေက သရုပ်ပြသရုံသက်သက်ပါ — သင့် application ထဲမှာတော့ တန်ဖိုးတွေ ကွဲပြားနိုင်ပါတယ်။

```jsx
<RootLayout>
  {/* app/template.tsx */}
  <Template key="/">
    <Page />
  </Template>
</RootLayout>
```

`/about` ကို navigate လုပ်တဲ့အခါ (ပထမဆုံး segment ပြောင်းတာ) — root template ရဲ့ key ပြောင်းသွားပြီး remount ဖြစ်ပါတယ်:

```jsx
<RootLayout>
  {/* app/template.tsx */}
  <Template key="/about">
    <AboutPage />
  </Template>
</RootLayout>
```

`/blog` ကို navigate လုပ်တဲ့အခါ (ပထမဆုံး segment ပြောင်းတာ) — root template ရဲ့ key ပြောင်းပြီး remount ဖြစ်ကာ blog အဆင့် template ပါ mount ဖြစ်ပါတယ်:

```jsx
<RootLayout>
  {/* app/template.tsx (root) */}
  <Template key="/blog">
    {/* app/blog/template.tsx */}
    <Template key="/blog">
      <BlogIndexPage />
    </Template>
  </Template>
</RootLayout>
```

ပထမဆုံး segment တစ်ခုတည်းအတွင်းမှာပဲ `/blog/first-post` ကို navigate လုပ်တဲ့အခါ (child segment ပြောင်းတာ) — root template ရဲ့ key မပြောင်းပေမယ့် — blog အဆင့် template ရဲ့ key ပြောင်းပြီး remount ဖြစ်ပါတယ်:

```jsx
<RootLayout>
  {/* app/template.tsx (root) */}
  <Template key="/blog">
    {/* app/blog/template.tsx */}
    {/* remounts because the child segment at this level changed */}
    <Template key="/blog/first-post">
      <BlogPostPage slug="first-post" />
    </Template>
  </Template>
</RootLayout>
```

`/blog/second-post` ကို navigate လုပ်တဲ့အခါ (ပထမဆုံး segment တူ၊ child segment မတူတာ) — root template ရဲ့ key မပြောင်းပေမယ့် — blog အဆင့် template ရဲ့ key ပြောင်းပြီး နောက်တစ်ကြိမ် remount ဖြစ်ပြန်ပါတယ်:

```jsx
<RootLayout>
  {/* app/template.tsx (root) */}
  <Template key="/blog">
    {/* app/blog/template.tsx */}
    {/* remounts again due to changed child segment */}
    <Template key="/blog/second-post">
      <BlogPostPage slug="second-post" />
    </Template>
  </Template>
</RootLayout>
```

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v13.0.0` | `template` စတင် မိတ်ဆက်။ |

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — layout နဲ့ page တွေ ဘယ်လို တွဲဖက် အလုပ်လုပ်လဲ
- [Project Structure](/docs/nextjs/project-structure) — component hierarchy အသေးစိတ်
- [Parallel Routes](/docs/nextjs/parallel-routes) — slots တွေနဲ့ pages အများအပြားကို တစ်ပြိုင်နက် render လုပ်ခြင်း
