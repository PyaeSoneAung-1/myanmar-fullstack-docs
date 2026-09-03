---
title: "View Transitions တွေကို ဒီဇိုင်းဆွဲခြင်း (Designing View Transitions)"
description: "Next.js app တစ်ခုမှာ navigation, loading နဲ့ content ပြောင်းလဲမှုတွေအတွင်း အဓိပ္ပာယ် ပို့ဆောင်ဖို့ view transitions သုံးနည်း — shared element morphing, Suspense reveals, directional navigation နဲ့ same-route crossfade ပုံစံ ၄ မျိုး"
order: 116
source: "https://nextjs.org/docs/app/guides/view-transitions"
status: translated
updated: 2026-09-03
---

Web apps တွေမှာ route ပြောင်းတဲ့အခါ တစ်မျက်နှာလုံးကို တစ်ပြိုင်နက် အစားထိုးလိုက်ပါတယ်။ Element set တစ်ခု ပျောက်သွားပြီး နောက်တစ်ခု ပေါ်လာတယ် — နှစ်ခုကြားမှာ ဘာ visual ဆက်စပ်မှုမှ မရှိပါဘူး။ User တစ်ယောက်က photo thumbnail တစ်ခုကို ရွေးပြီး နောက်စာမျက်နှာတစ်ခုမှာ အသေးစိတ် ကြည့်တယ် ဆိုပါစို့။ ဒါတွေက ပုံတစ်ပုံထဲ ဖြစ်ပေမယ့် — screen ပေါ်မှာ ဒါကို ဖော်ပြနေတဲ့ ဘာ visual အချက်ပြမှုမှ မရှိပါဘူး။

ဒီလို transitions တွေ လိုအပ်တဲ့ apps တွေက ပုံမှန်အားဖြင့် — mount/unmount lifecycles တွေကို စီမံပေးတဲ့၊ route တစ်လျှောက် element တွေရဲ့ နေရာတွေကို ခြေရာခံပေးတဲ့၊ အချိန်ကိုက် timing တွေကို ကိုယ်တိုင် ညှိနှိုင်းပေးတဲ့ ရှုပ်ထွေးတဲ့ animation libraries တွေကို အားကိုးပြီး — elements တွေ ဘယ်လို ဝင်လဲ၊ ထွက်လဲ၊ state တွေကြား ရွေ့လျားလဲ ဆိုတာကို animate လုပ်ပါတယ်။

React ရဲ့ `<ViewTransition>` component ကတော့ ဒါကို declarative ပုံစံနဲ့ ကိုင်တွယ်ဖို့ browser ရဲ့ [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) နဲ့ ပေါင်းစပ်အလုပ်လုပ်ပါတယ်။ ဆက်ရှိနေစေချင်တဲ့ elements တွေကို သင် နာမည်ပေးလိုက်ရုံပါပဲ — ကျန်တာကို browser က သူတို့ရဲ့ အဟောင်း/အသစ် နေရာတွေကြားမှာ အလိုအလျောက် animate လုပ်ပေးပါတယ်။

ဒီ guide မှာ အဖြစ်အများဆုံး အခြေအနေတွေကို ဖုံးအုပ်ပေးတဲ့ ပုံစံ (pattern) ၄ မျိုး ဖြတ်သန်းသွားပါမယ်: shared elements တွေကို morph လုပ်ခြင်း၊ loading states တွေကို animate လုပ်ခြင်း၊ directional navigation ထည့်ခြင်း၊ နဲ့ route တစ်ခုတည်းအတွင်း content တွေကို crossfade လုပ်ခြင်း။

## Agent တစ်ခုနဲ့ view transitions ထည့်ခြင်း

[`vercel-react-view-transitions`](https://skills.sh/vercel-labs/agent-skills/vercel-react-view-transitions) skill က coding agent တစ်ခုကို — ဒီ guide ထဲက ပုံစံတွေ၊ ပြီးတော့ ရှိပြီးသား app တစ်ခုမှာ အသုံးချဖို့ CSS recipes နဲ့ troubleshooting တွေကို သင်ကြားပေးပါတယ်။

Skill ကို install လုပ်ပါ:

```bash filename="Terminal"
npx skills add vercel-labs/agent-skills --skill vercel-react-view-transitions
```

ပြီးရင် agent ကို ဒီလိုမျိုး prompt လုပ်ပါ:

```prompt
Add view transitions to this app using the vercel-react-view-transitions skill.
```

(သို့) တိကျတဲ့ transition တစ်ခုအတွက် prompt လုပ်နိုင်ပါတယ်၊ ဥပမာ:

- Thumbnail တစ်ခုကို hero image အဖြစ် morph လုပ်ခြင်း
- Routes တွေကြား ရှေ့/နောက် slide လုပ်ခြင်း
- Route တစ်ခုတည်းအတွင်း content တွေကို crossfade လုပ်ခြင်း

ပုံစံတွေကို ကိုယ်တိုင် အသုံးချချင်ရင် အောက်က walkthrough ကို လိုက်လုပ်ပါ။

## ဥပမာ (Example)

ဥပမာအနေနဲ့ — _Frames_ လို့ခေါ်တဲ့ photography gallery တစ်ခုကို တည်ဆောက်ကြည့်ပါမယ်။

Thumbnail တစ်ခုကို hero image အဖြစ် morph လုပ်တာ (shared elements) ကနေ စပြီး — loading skeleton ကို content အစစ်အမှန်အဖြစ် animate လုပ်တာ (Suspense reveals)၊ ရှေ့/နောက် navigation အတွက် directional slides တွေ (route transitions) ထည့်တာ၊ နောက်ဆုံး photographer tabs တွေကြား ပြောင်းတာအတွက် crossfades တွေ (same-route transitions) နဲ့ အဆုံးသတ်ပါမယ်။

ဒီဥပမာမှာ သုံးထားတဲ့ resources တွေကို ဒီနေရာတွေမှာ တွေ့နိုင်ပါတယ်:

- [Demo](https://react-view-transitions-demo.labs.vercel.dev)
- [Code](https://github.com/vercel-labs/react-view-transitions-demo)

View transitions တွေက App Router မှာ configure လုပ်စရာ မလိုဘဲ အလုပ်လုပ်ပါတယ်။ App Router က [React canary releases](https://react.dev/blog/2023/05/03/react-canaries) တွေကို သုံးပြီး — အဲဒီထဲမှာ React 19 ရဲ့ stable ပြောင်းလဲမှုတွေ အားလုံး အပြင် `ViewTransition` လို feature အသစ်တွေ ပါဝင်ပါတယ်။ `react@canary` ကို ကိုယ်တိုင် install လုပ်စရာ မလိုပါဘူး။

> [!NOTE]
> React ရဲ့ ပေါင်းစပ်မှုက View Transitions API ရဲ့ feature အသစ်တွေ (transition types နဲ့ `view-transition-class`) ကို သုံးပြီး — Chromium 125+ နဲ့ Safari/Firefox version အသစ်တွေမှာ ရနိုင်ပါတယ်။ Safari မှာတော့ animation တချို့ ကွဲပြားစွာ ပြုမူနိုင်ပါတယ်။ Browser support မရှိရင်တောင် — သင့် application က ပုံမှန်အတိုင်း အလုပ်လုပ်ပြီး transitions တွေက animate မလုပ်ဘဲ နေပါတယ်။

`ViewTransition` component ကို React ကနေ import လုပ်ပါ:

```tsx
import { ViewTransition } from 'react'
```

`<ViewTransition>` animations တွေကို [Transitions](https://react.dev/reference/react/useTransition), [`<Suspense>`](https://react.dev/reference/react/Suspense), နဲ့ [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) တွေက activate လုပ်ပေးပါတယ်။ သာမန် `setState` calls တွေကတော့ ဒါတွေကို trigger မလုပ်ပါဘူး။ Next.js မှာ route navigations တွေက transitions တွေ ဖြစ်လို့ — navigation ကာလအတွင်း `<ViewTransition>` animations တွေ အလိုအလျောက် activate ဖြစ်ပါတယ်။

### အဆင့် ၁: Thumbnail တစ်ခုကို hero image အဖြစ် morph လုပ်ခြင်း

Gallery က photos တွေကို grid တစ်ခုထဲမှာ ပြပါတယ်။ Photo တစ်ပုံကို နှိပ်လိုက်ရင် — အဲဒီပုံကြီးရဲ့ version တစ်ခုပါတဲ့ detail page ကို ဖွင့်ပေးပါတယ်။ Transitions မရှိရင် thumbnail ပျောက်သွားပြီး hero ပေါ်လာပါတယ်။ သူတို့ကို visual အနေနဲ့ ဆက်စပ်ပေးတဲ့ ဘာမှ မရှိပါဘူး။ User က သူနှိပ်လိုက်တဲ့ ပုံမှန်တစ်ပုံ ဟုတ်မဟုတ် သေချာဖို့ detail page ကို ပြန်စစ်ကြည့်ရပါတယ်။

Motion design မှာ — object တစ်ခုက cut (မြင်ကွင်းပြောင်းခြင်း) ကို ဖြတ်ပြီး ဆက်ရှိနေရင် ဒါက continuity ကို ဖော်ပြတာပါ။ ကြည့်ရှုသူက သူတို့ မြင်နေတာက အစားထိုးတစ်ခု မဟုတ်ဘဲ — တစ်ခုတည်းသော အရာပဲ ဆိုတာ နားလည်သွားပါတယ်။ ဒါက အရေးအကြီးဆုံး transition pattern ပါ: **shared element morphing**။

Grid thumbnail ရော detail hero နှစ်ခုလုံးကို `name` တူတူနဲ့ `<ViewTransition>` ထဲမှာ wrap လုပ်ပါ:

```tsx filename="components/photo-grid.tsx"
import { ViewTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function PhotoGrid({ photos }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/photo/${photo.id}`}>
          <ViewTransition name={`photo-${photo.id}`}>
            <Image src={photo.src} alt={photo.title} />
          </ViewTransition>
        </Link>
      ))}
    </div>
  )
}
```

```tsx filename="app/photo/[id]/photo-content.tsx"
import { ViewTransition } from 'react'
import Image from 'next/image'

async function PhotoContent({ id }) {
  const photo = await getPhoto(id)

  return (
    <ViewTransition name={`photo-${photo.id}`}>
      <div style={{ position: 'relative', aspectRatio: '3 / 2' }}>
        <Image src={photo.src} alt={photo.title} fill />
      </div>
    </ViewTransition>
  )
}
```

`name` prop က identity တစ်ခု ဖန်တီးပေးပါတယ်။ React က စာမျက်နှာအဟောင်းနဲ့ အသစ် နှစ်ခုလုံးမှာ name တူတဲ့ elements တွေကို ရှာပြီး — သူတို့ရဲ့ အရွယ်အစားနဲ့ နေရာကြားမှာ အလိုအလျောက် animate လုပ်ပေးပါတယ်။ Morph အလုပ်လုပ်ဖို့ နောက်ထပ် props တွေ မလိုပါဘူး။

အခု thumbnail တစ်ခုကို နှိပ်ကြည့်ရင် — ပုံက သူ့ရဲ့ grid cell ကနေ hero slot ဆီ စကေးချဲ့ပြီး နေရာရွေ့ပါတယ်။ နောက်ပြန် navigate လုပ်ရင် morph က ပြောင်းပြန် ဖြစ်သွားပါတယ်။ User က object နှစ်ခု အပြန်အလှန် လဲနေတာကို မဟုတ်ဘဲ — object တစ်ခု ရွေ့လျားနေတာကို မြင်ရပါတယ်။

Destination content က navigation နဲ့ commit တစ်ခုတည်းထဲမှာ render ဖြစ်တဲ့အခါ — morph က ပြသနိုင်ပါတယ်။ ဒါက prefetch လုပ်ထားတဲ့ (cached) pages တွေမှာ ဖြစ်တတ်ပါတယ်။ Destination က fallback တစ်ခုထဲ ဦးစွာ suspend ဖြစ်သွားရင်တော့ — pair တစ်ခု မဖွဲ့ဖြစ်ဘဲ — content ရောက်လာတဲ့အခါ သူ့ရဲ့ enter animation နဲ့ပဲ animate ဖြစ်ပါတယ်။

#### Morph animation ကို customize လုပ်ခြင်း

Morph က CSS မလိုဘဲ အလုပ်လုပ်ပါတယ်။ Customize လုပ်ချင်ရင် — `share="morph"` ကို `default="none"` နဲ့ တွဲထည့်ပါ။ `share` prop က view transition ကို `morph` class သတ်မှတ်ပေးပြီး — CSS pseudo-elements တွေနဲ့ ပစ်မှတ်ထားလို့ ရပါတယ်။ ဥပမာ — morph ကို လမ်းခုလတ်မှာ [`blur`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur) keyframe နဲ့ ပျော့ပြောင်းစေချင်ရင်:

```tsx
<ViewTransition name={`photo-${photo.id}`} share="morph" default="none">
  <Image src={photo.src} alt={photo.title} />
</ViewTransition>
```

အဆင့် ၁ က snippets နှစ်ခုလုံး (`photo-grid.tsx` နဲ့ `photo-content.tsx`) မှာ ဒီ props တွေကို အတူတူ ထည့်ပါ။ `default="none"` က named image တစ်ခုချင်းစီကို — ဆက်စပ်မှုမရှိတဲ့ transition တိုင်းမှာ ကိုယ်ပိုင် crossfade သပ်သပ် run စေတာကနေ တားဆီးပေးပါတယ်။ ဒါမပါရင် — page ပေါ်မှာ transition တစ်ခုခု run တိုင်း `<ViewTransition>` named တိုင်း animate ဖြစ်နေပါလိမ့်မယ်။ Named pair တစ်ခုကို `default="none"` ထည့်တဲ့အခါ — `share` ကို ရှင်းရှင်းလင်းလင်း ထားပေးပါ။ `default="none"` နဲ့ `share` prop မပါရင် — pair က တိတ်တဆိတ် morph လုပ်တာ ရပ်သွားပါတော့တယ်။

```css filename="app/globals.css"
::view-transition-group(.morph) {
  animation-duration: 400ms;
}
::view-transition-image-pair(.morph) {
  animation-name: via-blur;
}
@keyframes via-blur {
  30% {
    filter: blur(3px);
  }
}
```

ဒီ blur က transition ကာလအတွင်း pixel-level interpolation artifacts တွေကို ဖုံးကွယ်ပေးပါတယ်။ 400ms မှာတော့ morph က သိသာလောက်အောင် နှေးပြီး — တစ်ချက်တည်း ခံစားရလောက်အောင် မြန်ပါတယ်။

### အဆင့် ၂: Suspense reveals တွေနဲ့ loading states တွေကို animate လုပ်ခြင်း

Photo detail page က သူ့ရဲ့ content ကို asynchronously load လုပ်ပါတယ်။ Data လမ်းမှာ ရှိနေချိန်မှာ Suspense boundary တစ်ခုက skeleton တစ်ခု ပြပါတယ်။ Data ရောက်လာတဲ့အခါ — skeleton ကို content အစစ်အမှန်နဲ့ အစားထိုးလိုက်ပါတယ်။

Transition မရှိရင် ဒီအစားထိုးမှုက ချက်ချင်း ဖြစ်သွားပါတယ်။ Skeleton ပျောက်ပြီး content က ခုန်ထွက်လာသလို ပေါ်လာပါတယ်။

Motion design မှာ — ဒေါင်လိုက် ဦးတည်ချက်က အဆင့်ဆင့် (hierarchy) ကို ဖော်ပြပါတယ်။ Content က အပေါ်ကို လျှောတက်လာရင် ရောက်ရှိလာခြင်းကို ပြတာပါ။ Content က အောက်ကို လျှောဆင်းသွားရင် ထွက်ခွာခြင်းကို ပြတာပါ။ နှစ်ခု တွဲလိုက်တဲ့အခါ handoff တစ်ခု ဖြစ်ပေါ်ပါတယ်: placeholder က အစစ်အမှန်ကို လမ်းလွှဲပေးလိုက်တာပါ။

Suspense fallback ကို exit animation ပါတဲ့ `ViewTransition` တစ်ခုထဲမှာ wrap လုပ်ပြီး — content ကို enter animation ပါတဲ့ `ViewTransition` တစ်ခုထဲမှာ ထည့်ပါ:

```tsx filename="app/photo/[id]/page.tsx"
import { Suspense, ViewTransition } from 'react'

export default async function PhotoPage({ params }) {
  const { id } = await params

  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down" default="none">
          <PhotoContentSkeleton />
        </ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        <PhotoContent id={id} />
      </ViewTransition>
    </Suspense>
  )
}
```

အဆင့် ၁ မှာ ရှိသလိုပဲ — `default="none"` က ဒီ `ViewTransition` ကို shared element morph လိုမျိုး မသက်ဆိုင်တဲ့ transitions တွေမှာ animate မဖြစ်အောင် တားဆီးပါတယ်။

CSS animations တွေက asymmetric timing ကို သုံးပါတယ်။ Exit က မြန်ပါတယ် (150ms)။ Enter fade က ပိုနှေးပြီး (210ms) — exit ပြီးဆုံးတဲ့အထိ delay လုပ်ထားပြီး သူ့ရဲ့ slide လှုပ်ရှားမှုက ပိုကြာပါတယ် (400ms):

```css filename="app/globals.css"
:root {
  --duration-exit: 150ms;
  --duration-enter: 210ms;
  --duration-move: 400ms;
}

::view-transition-old(.slide-down) {
  animation:
    var(--duration-exit) ease-out both fade reverse,
    var(--duration-exit) ease-out both slide-y reverse;
}
::view-transition-new(.slide-up) {
  animation:
    var(--duration-enter) ease-in var(--duration-exit) both fade,
    var(--duration-move) ease-in both slide-y;
}

@keyframes fade {
  from {
    filter: blur(3px);
    opacity: 0;
  }
  to {
    filter: blur(0);
    opacity: 1;
  }
}
@keyframes slide-y {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(0);
  }
}
```

ဒီ asymmetry က တမင် လုပ်ထားတာပါ။ Content အဟောင်းက အာရုံစိုက်မှုအတွက် ပြိုင်ဆိုင်စရာ မလိုအောင် မြန်မြန် ထွက်သွားသင့်ပါတယ်။ Content အသစ်ကတော့ — user မှတ်မိဖို့ အချိန်ရအောင် ညင်ညင်သာသာ ရောက်သင့်ပါတယ်။ Enter fade ပေါ်က `var(--duration-exit)` delay က — content အသစ်က content အဟောင်း ထွက်ပြီးမှ မြင်ရအောင် ဆိုလိုတာပါ။

Page ကို refresh လုပ်ကြည့်ရင် — skeleton က အောက်ကို လျှောဆင်းပြီး fade ထွက်သွားပြီး — ခဏအကြာမှာ content အစစ်က အပေါ်ကို လျှောတက်ပြီး fade ဝင်လာပါတယ်။

### အဆင့် ၃: Navigation အတွက် directional motion ထည့်ခြင်း

Gallery မှာ အခု morphing images တွေရော animated loading states တွေပါ ရှိပါပြီ။ ဒါပေမယ့် — pages တွေကြား navigate လုပ်တာမှာ directional signal တစ်ခုမှ မရှိသေးပါဘူး။ ရှေ့ကို သွားတာရော နောက်ပြန် လာတာရော အတူတူပဲ မြင်ရပါတယ်။ Animation ကြည့်ရုံနဲ့ — user က သူ app ထဲ ပိုနက်နက်ဝင်သွားတာလား၊ ဒါမှမဟုတ် အရင် page တစ်ခုကို ပြန်သွားတာလားဆိုတာ ခွဲခြားလို့ မရပါဘူး။

Film နဲ့ animation မှာ — အလျားလိုက် ဦးတည်ချက်က spatial နေရာချထားမှုကို ဖော်ပြပါတယ်။ ဘယ်ကို ရွေ့တာက ရှေ့ကို တိုးတာကို ဆိုလိုပြီး (ဘယ်မှညာ စာဖတ်တဲ့ ဘာသာစကားမှာ စာမျက်နှာတစ်ခု လှန်သလိုပါ) — ညာကို ရွေ့တာက နောက်ပြန် ဆိုလိုပါတယ်။ ဒီ convention က လေးနက်စွာ စွဲမြဲနေတာမို့ — ချိုးဖောက်လိုက်ရင် စိတ်ရှုပ်ထွေးစေပါတယ်။

`<Link>` ပေါ်မှာ `transitionTypes` prop ကို သုံးပြီး ရှေ့ကို သွားတဲ့ navigations တွေကို tag လုပ်ပါ:

```tsx filename="components/photo-grid.tsx"
<Link href={`/photo/${photo.id}`} transitionTypes={['nav-forward']}>
  {/* photo thumbnail */}
</Link>
```

ဒီပုံစံပဲ — app အတွင်းက ဘယ် navigation အတွက်မဆို အလုပ်လုပ်ပါတယ်။ ဥပမာ — photo detail page တစ်ခုပေါ်က previous/next arrows တွေက သက်ဆိုင်ရာ ဦးတည်ချက်နဲ့ animate လုပ်ဖို့ `nav-back` နဲ့ `nav-forward` တွေကို သုံးနိုင်ပါတယ်။

User ကို အရင် page တစ်ခုဆီ ပြန်ပို့တဲ့ links တွေအတွက်တော့ `nav-back` ကို သုံးပါ:

```tsx filename="app/photo/[id]/page.tsx"
<Link href="/" transitionTypes={['nav-back']}>
  ← Gallery
</Link>
```

Transition type က အလိုအလျောက် မဟုတ်ပါဘူး။ ဘယ် links တွေက "forward" လဲ၊ ဘယ်ဟာတွေက "back" လဲ ဆိုတာကို — သင့် app ရဲ့ navigation hierarchy ပေါ် မူတည်ပြီး သင်ကိုယ်တိုင် ဆုံးဖြတ်ပါတယ်။

ပြီးရင် page content ကို transition types တွေကို directional animations တွေနဲ့ မြေပုံညှိပေးတဲ့ `ViewTransition` တစ်ခုထဲမှာ wrap လုပ်ပါ:

```tsx filename="app/photo/[id]/page.tsx"
<ViewTransition
  enter={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  exit={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  default="none"
>
  {/* page content */}
</ViewTransition>
```

`enter` နဲ့ `exit` props တွေက transition type တွေနဲ့ key လုပ်ထားတဲ့ object တစ်ခုကို လက်ခံပါတယ်။ Navigation တစ်ခုက `nav-forward` type ကို သယ်ဆောင်လာတဲ့အခါ — exit animation က content အဟောင်းကို ဘယ်ဘက်ကို လျှောထုတ်ပြီး — enter animation က content အသစ်ကို ညာဘက်ကနေ လျှောဝင်စေပါတယ်။ `default: "none"` ကတော့ type မရှိတဲ့ transitions တွေ (browser back/forward, `router.refresh()`, Suspense reveals) မှာ directional animation ဘာမှ မဖြစ်စေဖို့ သေချာစေပါတယ်။

ပါဝင်တဲ့ page တိုင်းကို ဒီအတိုင်းပဲ wrap လုပ်ပါ။ Gallery က forward navigation မှာ လျှောထွက်ပြီး `nav-back` မှာ ပြန်လျှောဝင်ဖို့ဆိုရင် — သူ့ရဲ့ page မှာလည်း wrap ပတ်တူညီတဲ့ wrapper လိုပါတယ်။ Wrapper ကို layout ထဲ မဟုတ်ဘဲ `page.tsx` တစ်ခုချင်းစီထဲ ထည့်ပါ။ Layouts တွေက navigations တွေကြားမှာ ဆက်ရှိနေလို့ — အဲဒီမှာ enter/exit တွေ ဘယ်တော့မှ fire မဖြစ်ပါဘူး:

```tsx filename="app/page.tsx"
<ViewTransition
  enter={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  exit={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  default="none"
>
  <PhotoGrid photos={photos} />
</ViewTransition>
```

Directional slides တွေအတွက် CSS:

```css filename="app/globals.css"
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation:
    150ms ease-in both fade reverse,
    400ms ease-in-out both slide reverse;
}
::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation:
    210ms ease-out 150ms both fade,
    400ms ease-in-out both slide;
}

::view-transition-old(.nav-back) {
  --slide-offset: 60px;
  animation:
    150ms ease-in both fade reverse,
    400ms ease-in-out both slide reverse;
}
::view-transition-new(.nav-back) {
  --slide-offset: -60px;
  animation:
    210ms ease-out 150ms both fade,
    400ms ease-in-out both slide;
}

@keyframes slide {
  from {
    translate: var(--slide-offset);
  }
  to {
    translate: 0;
  }
}
```

60px offset က — screen ဖြတ်ပြီး မြန်မြန် ရွေ့နေတဲ့ element တစ်ခုကို user က ခြေရာခံနေစရာ မလိုဘဲ — ဦးတည်ချက်ကို ဖော်ပြဖို့ လုံလောက်ပါတယ်။

#### Header ကို နေရာတည်ငြိမ်အောင် ထားခြင်း (Anchoring the header)

Directional slides တွေအတွင်း header က မရွေ့သင့်ပါဘူး။ Header လျှောသွားရင် user ရဲ့ spatial anchor ပျက်သွားပါတယ်။ _Content_ က ရွေ့တာလား၊ viewport တစ်ခုလုံး ရွေ့တာလားဆိုတာ နားလည်ဖို့ — user မှာ fixed reference point တစ်ခု လိုပါတယ်။

Header ကို `viewTransitionName` တစ်ခု သတ်မှတ်ပြီး — သူ့ရဲ့ animation ကို CSS မှာ ဖိနှိပ်ထားပါ:

```tsx filename="components/header.tsx"
<header style={{ viewTransitionName: 'site-header' }}>
  {/* navigation links */}
</header>
```

```css filename="app/globals.css"
::view-transition-group(site-header) {
  animation: none;
  z-index: 100;
}
::view-transition-old(site-header) {
  display: none;
}
::view-transition-new(site-header) {
  animation: none;
}
```

Old snapshot ပေါ်က `display: none` က — header အဟောင်းနဲ့ အသစ် နှစ်ခုလုံး ခဏတာ မြင်ရတာမျိုး (flash) မဖြစ်အောင် တားဆီးပါတယ်။ `z-index: 100` က header က လျှောနေတဲ့ content အပေါ်မှာ render ဖြစ်စေဖို့ သေချာစေပါတယ်။

Photo တစ်ခုဆီ ရှေ့ကို navigate လုပ်ရင် — content က ဘယ်ဘက် လျှောသွားပါတယ်။ "← Gallery" link ကို နှိပ်ရင် (`nav-back` နဲ့ tag လုပ်ထားတဲ့) — content က ညာဘက် လျှောလာပါတယ်။ Header ကတော့ transitions နှစ်ခုလုံးအတွင်း သူ့နေရာမှာ တည်ငြိမ်နေပါတယ်။

Browser ကနေ စတင်တဲ့ back navigations တွေ (back button (သို့) swipe gestures) က transition type တစ်ခုမှ မသယ်ဆောင်လို့ — directional slide က မပြသာပါဘူး။ အဆင့် ၁ က shared element morph ကတော့ — pages နှစ်ခုလုံးမှာ `name` props တူညီနေရင် ဆက်အလုပ်လုပ်ပါတယ်။

#### Page ကို interactive ဖြစ်နေစေခြင်း

Transition တစ်ခု run နေချိန်မှာ `::view-transition` overlay က pointer events တွေကို ဖမ်းယူထားလို့ — animation ကာလအတွင်း နှိပ်လိုက်တဲ့ clicks တွေ ပျောက်သွားပါတယ်။ သူတို့ကို live page ဆီ ဖြတ်သန်းသွားစေပါ:

```css filename="app/globals.css"
::view-transition {
  pointer-events: none;
}
```

ဒါက unnamed content တွေအတွက် interactivity ကို ပြန်လည် ရရှိစေပါတယ်။ Hit-testing ကတော့ named participants တွေ (anchored header လိုမျိုး) ကို transition ကြာချိန်အတွင်း ကျော်သွားဆဲ ဖြစ်လို့ — transitions တွေကို တိုတိုထားပြီး user က မြန်မြန် ထပ်ခါထပ်ခါ နှိပ်နိုင်တဲ့ elements တွေကို naming မလုပ်ပါနဲ့။

#### Reduced motion ကို လေးစားခြင်း (Respecting reduced motion)

Directional slides တွေက viewport ကို ဖြတ်ပြီး ရုပ်ပိုင်းဆိုင်ရာ လှုပ်ရှားမှုကို အတုယူပါတယ်။ ဒါက motion sensitivity ရဲ့ အဖြစ်အများဆုံး trigger ပါ။ Morphs, reveals နဲ့ crossfades တွေကတော့ — သေးငယ်တဲ့ နေရာတွေကိုပဲ သက်ရောက်တာ (သို့) position ထက် opacity ကို အားကိုးတာမို့ — အန္တရာယ် ပိုနည်းပါတယ်။

အရိုးရှင်းဆုံး နည်းကတော့ animation durations တွေ အားလုံးကို disable လုပ်တာပါ:

```css filename="app/globals.css"
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

Animation မရှိရင် content တွေက ချက်ချင်း အစားထိုးသွားပြီး — ဒါက browser ရဲ့ ပုံမှန် အပြုအမူပါပဲ။ ပိုပြီး သေချာတဲ့ နည်းကတော့ — positional လှုပ်ရှားမှုတွေကို ဖယ်ရှားပြီး crossfades နဲ့ opacity transitions တွေကို ထိန်းသိမ်းထားတာပါ။ ဒီအကြောင်း ပိုသိချင်ရင် ["No Motion Isn't Always prefers-reduced-motion"](https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/) ကို ကြည့်ပါ။

### အဆင့် ၄: Route တစ်ခုတည်းအတွင်း content တွေကို crossfade လုပ်ခြင်း

Gallery မှာ tabs တွေပါတဲ့ photographer section တစ်ခု ရှိပါတယ်။ Tab တစ်ခုချင်းစီက မတူညီတဲ့ photographer ရဲ့ photos တွေကို ပြပေမယ့် — route structure ကတော့ အတူတူပါပဲ: `/collection/[slug]`။ Tabs တွေကြား နှိပ်ပြောင်းတာက page အသစ်တစ်ခုဆီ navigate လုပ်သလို မခံစားရပါဘူး။ Container တစ်ခုတည်းအတွင်းမှာ content ပြောင်းနေသလို ခံစားရပါတယ်။

ဒီနေရာမှာ directional slide က မှားပါတယ်။ Slides တွေက "နေရာအသစ်တစ်ခုဆီ သွားနေတယ်" ဆိုတာကို ဆက်သွယ်ပြောပြတာပါ။ Crossfade ကတော့ "နေရာတစ်ခုတည်း — content မတူဘူး" ဆိုတာကို ပြောပြပါတယ်။ Container က ဆက်ရှိနေပြီး (continuity) — အတွင်းက grid ကပဲ ပြောင်းလဲတာပါ (swap)။

`key` ကို လက်ရှိ slug နဲ့ သတ်မှတ်ထားတဲ့ `ViewTransition` တစ်ခုကို သုံးပါ။ Key ပြောင်းလဲတဲ့အခါ — React က content အဟောင်းနဲ့ အသစ်ကြားမှာ transition တစ်ခုကို trigger လုပ်ပါတယ်:

```tsx filename="app/collection/[slug]/page.tsx"
import { Suspense, ViewTransition } from 'react'

export default async function CollectionPage({ params }) {
  const { slug } = await params

  return (
    <Suspense fallback={<CollectionGridSkeleton />}>
      <ViewTransition
        key={slug}
        name="collection-content"
        share="auto"
        enter="auto"
        default="none"
      >
        <CollectionGrid slug={slug} />
      </ViewTransition>
    </Suspense>
  )
}
```

`share="auto"` နဲ့ `enter="auto"` props တွေက React ကို သူ့ရဲ့ default crossfade animation သုံးဖို့ ပြောပါတယ်။ `name` prop က container ကို identity တစ်ခု ပေးပြီး — React က ဘာကို animate လုပ်ရမယ်ဆိုတာ သိစေပါတယ်။ Navigation က transition ကို trigger လုပ်ပြီး — `key={slug}` ပြောင်းလဲမှုက React ကို content အဟောင်းနဲ့ အသစ်ကို exit/enter pair တစ်ခုအနေနဲ့ ဆက်ဆံစေပါတယ် (`share` ကို activate လုပ်တာ) — in-place update အဖြစ် မဟုတ်ပါဘူး။

Photographer tabs တွေကြား နှိပ်ကြည့်ရင် — grid က crossfade ဖြစ်သွားပါတယ်။ Tab bar နဲ့ ပတ်ဝန်းကျင် layout ကတော့ မရွေ့ပါဘူး။ Photo grid တစ်ခုပဲ state တွေကြား transition ဖြစ်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

Navigation ကာလအတွင်း အဓိပ္ပာယ် ဆက်သွယ်ပြောဆိုဖို့ view transitions တွေကို ဘယ်လို သုံးရမလဲဆိုတာ အခု သင်သိပါပြီ။ Shared elements တွေက routes တွေကို ဖြတ်ပြီး continuity ကို ဆက်သွယ်ပါတယ်။ Suspense reveals တွေက loading handoffs တွေကို animate လုပ်ပါတယ်။ Directional slides တွေက navigation history ကို စာဝှက်ဖော်ပြတယ်။ Crossfades တွေက နေရာတစ်ခုတည်းအတွင်းက content ပြောင်းလဲမှုတွေကို အချက်ပြပါတယ်။

ပုံစံတစ်ခုချင်းစီက user ရဲ့ မေးခွန်းတစ်ခုစီကို ဖြေပေးပါတယ်:

| ပုံစံ (Pattern)                  | ဘာကို ဆက်သွယ်ပြောပြလဲ          |
| -------------------------------- | ------------------------------ |
| Shared element (morph)           | "တစ်ခုတည်းသော အရာ — ပိုနက်ရှိုင်းရာကို သွားနေတယ်" |
| Suspense reveal                  | "ဒေတာ ရောက်ရှိပြီ"              |
| Directional slide                | "ရှေ့ကို သွားနေ / နောက်ကို ပြန်လာနေ" |
| Same-route crossfade             | "နေရာတစ်ခုတည်း — content မတူဘူး" |

API အသေးစိတ်နဲ့ နောက်ထပ် ပုံစံတွေအတွက်:

- [Link ရဲ့ `transitionTypes` prop](/docs/nextjs/component-link#transitiontypes)
- [`useRouter`](/docs/nextjs/use-router) — `push()` နဲ့ `replace()` တွေမှာလည်း `transitionTypes` ကို ထောက်ပံ့ပါတယ်
- [React `ViewTransition` component](https://react.dev/reference/react/ViewTransition)
- [ဒီ guide ကနေ ပြည့်စုံတဲ့ CSS](https://github.com/vercel-labs/react-view-transitions-demo/blob/main/src/app/globals.css) — keyframes နဲ့ view transition rules အားလုံး file တစ်ခုထဲမှာ
