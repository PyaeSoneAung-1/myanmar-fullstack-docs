---
title: "Interactive apps များ တည်ဆောက်ခြင်း (Building interactive apps)"
description: "Server Functions, transitions, optimistic UI နဲ့ pending feedback တွေသုံးပြီး responsive interactions (ချက်ချင်း တုံ့ပြန်မှုရှိသော အပြန်အလှန် ဆောင်ရွက်မှုများ) တွေကို တည်ဆောက်နည်း"
order: 226
source: "https://nextjs.org/docs/app/guides/interactive-apps"
status: translated
updated: 2026-09-03
---

User တစ်ယောက်ရဲ့ interaction (အပြန်အလှန် ဆောင်ရွက်မှု) တစ်ခုက server-side အလုပ်တစ်ခု လိုအပ်တဲ့အခါ — ရလဒ်က ချက်ချင်း မရနိုင်ပါဘူး။ Network requests တွေဟာ ဘယ်လောက်ကြာကြာ ပြီးမြောက်မယ်ဆိုတာ မသိနိုင်ဘဲ — အောင်မြင်လည်း ဖြစ်နိုင်သလို ကျရှုံးလည်း ဖြစ်နိုင်ပါတယ်။ စောင့်ဆိုင်းနေရတဲ့အချိန်မှာ client ဘက်က feedback ပေးပြီး အဲဒီအခြေအနေတွေကို တုံ့ပြန်သင့်ပါတယ်။ မဟုတ်ရင် — user တွေက ဒေတာဟောင်းတွေကိုပဲ ကြည့်နေရပြီး — တစ်ခုခု ဖြစ်နေသလားလို့ တွေးမိနိုင်ပါတယ်။

ဒီ guide က _Taskboard_ လို့ခေါ်တဲ့ task management app တစ်ခုမှာ ချက်ချင်း တုံ့ပြန်နိုင်တဲ့ feedback (responsive feedback) တွေကို ထည့်သွင်းပြထားပါတယ်။ အဆင့် (step) တစ်ခုချင်းစီက — နှေးကွေးတဲ့ reads တွေကို streaming လုပ်တာကနေ server က မဖြေကြားခင်မှာ mutations တွေကို confirm လုပ်တာအထိ — မတူညီတဲ့ pending အလုပ်မျိုးစုံကို ကိုင်တွယ်ပါတယ်။

> **သိထားသင့်သည်:** ဒီ guide ထဲက patterns တွေက [Core Web Vitals](https://web.dev/articles/vitals) တွေကိုလည်း တိုးတက်စေပါတယ်။ [`<Suspense>`](https://react.dev/reference/react/Suspense) နဲ့ streaming လုပ်တာက shell ကို အရင်ဆုံး paint လုပ်ခွင့်ပေးပြီး — နှေးကွေးတဲ့ reads တွေ ပြီးဆုံးချိန်အထိ [FCP](https://web.dev/articles/fcp) နဲ့ [LCP](https://web.dev/articles/lcp) တွေကို နိမ့်ကျစေပါတယ်။ Optimistic UI နဲ့ transitions တွေက click frame ကို မြန်ဆန်စေပြီး [INP](https://web.dev/articles/inp) ကို နိမ့်ကျစေပါတယ်။ နောက်လာမယ့် route ကို prefetch လုပ်ထားတာက ဦးတည်ရာ page ပေါ်မှာ FCP, LCP, INP တွေကို ချက်ချင်းနီးပါး ဖြစ်စေပါတယ်။ ဒီ patterns တွေက အထောက်အကူဖြစ်ပေမယ့် — ပုံမှန် INP အလုပ်တွေကို အစားမထိုးပါဘူး: client JavaScript ကို လျှော့ပို့တာနဲ့ interaction တွေအတွင်း blocking roundtrips တွေကို ရှောင်တာမျိုး ဆက်လုပ်ဖို့ လိုပါသေးတယ်။

## ဥပမာ (Example)

Patterns တွေက အစဉ်လိုက် တည်ဆောက်သွားပါတယ်: loading boundaries တွေနောက်မှာ နှေးကွေးတဲ့ data တွေကို stream လုပ်တာ၊ priority toggle ကို ချက်ချင်း (instant) တုံ့ပြန်အောင် လုပ်တာ၊ callback prop တစ်ခုပါတဲ့ reusable filter တစ်ခု တည်ဆောက်တာ၊ confirm မဖြစ်သေးခင်မှာ comments တွေကို ပြသပေးတာ၊ drop လုပ်တဲ့အခါ cards တွေကို column တွေကြား ရွှေ့တာ၊ create dialog တစ်ခုထဲမှာ form lifecycle ကို စီမံတာ၊ ပြီးတော့ delete လုပ်ဆောင်နေတာကို parent ဆီ signal ပေးတာတို့ ပါဝင်ပါတယ်။ နောက်ဆုံး step ကတော့ — navigations တွေ ချက်ချင်းဖြစ်နေစေဖို့ reusable reads တွေကို cache လုပ်ပါတယ်။

ဒီ guide ထဲက pattern တစ်ခုချင်းစီရဲ့ လက်တွေ့ အလုပ်လုပ်ပုံကို ကြည့်ဖို့ — companion [Taskboard demo](https://async-react-demo.labs.vercel.dev) ([source](https://github.com/vercel-labs/async-react-demo)) ကို သုံးနိုင်ပါတယ်။

App ကို feature အလိုက် စုစည်းထားပါတယ်။ Task domain အတွက် ဖြစ်တဲ့ အရာအားလုံး (queries, Server Functions, components) က `features/task/` အောက်မှာ နေထိုင်ပါတယ်။ Shared UI primitives တွေက `components/ui/` ထဲမှာ ရှိပြီး — `app/` ထဲက pages တွေက feature components တွေကို ပေါင်းစပ်ပါတယ်။ ဒီ guide တစ်လျှောက်လုံးက file paths တွေက အဲဒီ structure ကို လိုက်နာပါတယ်။

အစပြုချိန်မှာတော့ — app က database ကနေ tasks နဲ့ comments တွေကို ဖတ်တဲ့ Server Component app တစ်ခုဖြစ်ပြီး — [`<Suspense>`](/docs/nextjs/streaming) boundaries မရှိသလို caching လည်း မရှိပါဘူး။ Client Components တွေက အဲဒီ data တွေကို mutate လုပ်ဖို့ [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေကို ခေါ်ပါတယ်။ Mutation တစ်ခုစီပြီးတိုင်း — Server Function က [`refresh()`](/docs/nextjs/refresh) ကို ခေါ်လို့ server က data အသစ်တွေနဲ့ ပြန်လည် render လုပ်ပါတယ်:

```ts filename="features/task/task-actions.ts"
'use server'

import { refresh } from 'next/cache'
import { PRIORITY_CYCLE } from '@/lib/data'
import { getTaskById, updateTaskPriority } from '@/lib/db'

export async function cyclePriority(taskId: string) {
  const task = await getTaskById(taskId)
  if (!task) return null
  const newPriority = PRIORITY_CYCLE[task.priority]
  await updateTaskPriority(taskId, newPriority)
  refresh()
  return newPriority
}
```

### အဆင့် ၁: Suspense နဲ့ နှေးကွေးတဲ့ data တွေကို stream လုပ်ခြင်း (Stream slow data with Suspense)

Task detail page က task နဲ့ ၎င်းရဲ့ comments တွေကို ဖတ်ပါတယ်။ နှစ်ခုလုံးကို page component ရဲ့ ထိပ်မှာ await လုပ်ထားတဲ့အခါ — page တစ်ခုလုံးက အနှေးဆုံး read ပြီးမြောက်တဲ့အထိ ပိတ်ဆို့နေပါတယ် (block)။

```tsx filename="app/task/[id]/page.tsx"
import { getTask } from '@/features/task/task-queries'
import { TaskDetail } from '@/features/task/components/task-detail'
import { CommentSection } from '@/features/task/components/comment-section'

export default async function TaskPage({ params }) {
  const { id } = await params
  const task = await getTask(id)

  return (
    <div>
      <TaskDetail task={task} />
      <CommentSection taskId={id} />
    </div>
  )
}
```

ဒီ version နဲ့ဆိုရင် — `getTask` ပြီးမြောက်တဲ့အထိ ဘာမှ render မဖြစ်ဘဲ — comments read က အဲဒီနောက်မှပဲ စတင်ပါတယ်။

Reads တွေကို component တစ်ခုချင်းစီအဖြစ် ခွဲပြီး — တစ်ခုချင်းစီကို promise တစ်ခု ဖြတ်ပေးကာ — [`<Suspense>`](https://react.dev/reference/react/Suspense) တွေနဲ့ wrap လုပ်ပါ။ Page က synchronous ဖြစ်သွားပြီး — shell ကို ချက်ချင်း ပြန်ပေးလိုက်ကာ — server က section တစ်ခုချင်းစီရဲ့ data ပြီးမြောက်တာနဲ့ အဲဒီ section တစ်ခုချင်းစီကို stream လုပ်ပေးပါတယ်:

```tsx filename="app/task/[id]/page.tsx"
import { Suspense } from 'react'
import {
  TaskDetail,
  TaskDetailSkeleton,
} from '@/features/task/components/task-detail'
import {
  CommentSection,
  CommentSectionSkeleton,
} from '@/features/task/components/comment-section'

export default function TaskPage({ params }) {
  return (
    <div>
      <Suspense fallback={<TaskDetailSkeleton />}>
        {params.then(({ id }) => (
          <>
            <TaskDetail id={id} />
            <Suspense fallback={<CommentSectionSkeleton />}>
              <CommentSection taskId={id} />
            </Suspense>
          </>
        ))}
      </Suspense>
    </div>
  )
}
```

Section component တစ်ခုချင်းစီက ၎င်းရဲ့ ကိုယ်ပိုင် data ကို await လုပ်ပါတယ်:

```tsx filename="features/task/components/task-detail.tsx"
export async function TaskDetail({ id }) {
  const task = await getTask(id)
  return <TaskHeader task={task} />
}
```

JSX ထဲမှာ `params.then()` ကို inline ခေါ်တာက page ကို synchronous ဖြစ်စေပါတယ်။ အပြင်ဘက်က `<Suspense>` က params ရဲ့ resolution နဲ့ task detail read ကို ဖုံးအုပ်ထားပါတယ်။ `TaskDetail` ပြီးမြောက်တာနဲ့ — React က task header ကို ဖော်ပြပြီး — nested `<Suspense>` boundary ပေါ်လာကာ — comments တွေ load လုပ်နေချိန်မှာ `CommentSectionSkeleton` ကို ပြသပါတယ်။

အခု page shell က ချက်ချင်း paint ဖြစ်ပြီး — `getTask` ပြီးမြောက်တာနဲ့ task header က stream ဝင်လာကာ — `getComments` ပြီးမြောက်တာနဲ့ comments section က နောက်ကနေ လိုက်ပါတယ်။

Streaming patterns တွေအကြောင်း ပိုမို လေ့လာဖို့ — [Streaming](/docs/nextjs/streaming) guide ကို ကြည့်ပါ။

### အဆင့် ၂: Toggle တစ်ခုကို ချက်ချင်း တုံ့ပြန်ခြင်း (Respond instantly to a toggle)

Task card တစ်ခုချင်းစီမှာ — click လုပ်တိုင်း low, medium, high အစဉ်အတိုင်း လည်ပတ်သွားတဲ့ (cycle) priority indicator ပါပါတယ်။

Button က server ကနေလာတဲ့ `priority` prop ကို render လုပ်ပါတယ်။ Server Function တစ်ခုကို ခေါ်တာက mutation ကို စတင်ပေးပေမယ့် — လက်ရှိ render ထဲက အဲဒီ prop ကို ပြောင်းလဲမပေးပါဘူး။

ဒီနေရာမှာ Server Function ကို တိုက်ရိုက် ခေါ်ထားပါတယ်:

```tsx filename="features/task/components/task-card.tsx"
'use client'

import { cyclePriority } from '@/features/task/task-actions'

export function TaskCard({ id, priority }) {
  return (
    <button onClick={() => cyclePriority(id)} className={priorityDot[priority]}>
      {priority}
    </button>
  )
}
```

Dot ကို click လုပ်လိုက်ရင် — Server Function က run ပေမယ့် — နောက် server render တစ်ခု ရောက်လာတဲ့အထိ button က `priority` prop အဟောင်းကိုပဲ ဆက်ပြသနေပါတယ်။

တိုက်ရိုက်ခေါ်တာအစား — [`useOptimistic`](https://react.dev/reference/react/useOptimistic) နဲ့ [`useTransition`](https://react.dev/reference/react/useTransition) တွေကို သုံးပါ။ `useOptimistic` က stale prop နေရာမှာ render လုပ်ဖို့ value တစ်ခု ပေးပြီး — `useTransition` က Server Function ကို transition တစ်ခုရဲ့ အစိတ်အပိုင်းအဖြစ် run စေပါတယ်။ Optimistic value က အဲဒီ transition pending ဖြစ်နေသမျှ ကာလပတ်လုံး အကျုံးဝင်ပါတယ်:

```tsx filename="features/task/components/task-card.tsx"
'use client'

import { useOptimistic, useTransition } from 'react'
import { cyclePriority } from '@/features/task/task-actions'
import { PRIORITY_CYCLE } from '@/lib/data'

export function TaskCard({ id, priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority)
  const [, startTransition] = useTransition()

  function handlePriority() {
    startTransition(async () => {
      setOptimisticPriority(PRIORITY_CYCLE[optimisticPriority])
      await cyclePriority(id)
    })
  }

  return (
    <button
      onClick={handlePriority}
      className={priorityDot[optimisticPriority]}
    >
      {optimisticPriority}
    </button>
  )
}
```

`setOptimisticPriority` ခေါ်တာက — cycle ထဲက နောက် value နဲ့ UI ကို လက်ရှိ frame မှာပဲ update လုပ်ပါတယ်။ Prop အစား `optimisticPriority` ကနေ ဖတ်တာကြောင့် — မြန်မြန် double-click လုပ်တဲ့အခါမျိုးမှာလည်း stale closure value ကို ဖတ်မိတာမျိုး မဖြစ်ဘဲ — cycle က မှန်ကန်စွာ လည်ပတ်ပါတယ်။

Transition ပြီးဆုံးပြီး data အသစ် ရောက်လာတဲ့အခါ — optimistic value က server က အသစ် render လုပ်လိုက်တဲ့ prop ဆီ ပြန်ရောက်သွားပါတယ်။ `useTransition` အတွင်းက Server Function က error တစ်ခု throw လုပ်ခဲ့ရင် — manual `try`/`catch` မလိုဘဲ — error က အနီးဆုံး [error boundary](https://nextjs.org/docs/app/api-reference/file-conventions/error) ဆီ အလိုအလျောက် ပို့ပေးပါတယ်။

Mouse လွှတ်လိုက်တာနဲ့ အခု အရောင်က ချက်ချင်း ပြောင်းသွားပါတယ်။ ပထမ mutation မပြီးမချင်း နောက်တစ်ကြိမ် click လုပ်ရင်လည်း — နောက် value ဆီ ဆက်လည်နိုင်ပါတယ်။

### အဆင့် ၃: Pending feedback နဲ့ filter လုပ်ခြင်း (Filter with pending feedback)

Board မှာ label filter chips တွေ (Design, Frontend, Backend) ပါပါတယ်။ Chip တစ်ခုကို click လုပ်တာက task list ကို filter လုပ်ဖို့ query param တစ်ခုကို update လုပ်ပါတယ်။

ရွေးထားတဲ့ filter က URL ကနေ လာပါတယ်။ `router.push()` ကို ခေါ်တာက client navigation တစ်ခုကို စတင်ပြီး — server က search params အသစ်တွေနဲ့ board ကို ပြန် render လုပ်ပါတယ်။ အဲဒီ navigation မပြီးမချင်း — page က URL state အဟောင်းကိုပဲ ဆက်ပြသနေပါတယ်။

ဒီနေရာမှာ `router.push()` ကို တိုက်ရိုက် ခေါ်ထားပါတယ်:

```tsx filename="features/task/components/label-filter.tsx"
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function LabelFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('label', value)
    else params.delete('label')
    router.push(`/?${params.toString()}`)
  }

  // ...render chips with onClick={handleFilter}
}
```

ဒီ version နဲ့ဆိုရင် — `router.push()` က navigation ကို စတင်ပေမယ့် — local pending state မရှိပါဘူး။ Chip က URL value အဟောင်းကိုပဲ ဆက်ပြသနေပြီး — server render အသစ်တစ်ခု load ဖြစ်နေတာကို board ဘက်က ဘာအချက်ပြမှုမှ မပေးပါဘူး။

Filter ကို component နှစ်ခု ခွဲလိုက်ပါ။ `LabelFilter` က query string update ကို ပိုင်ဆိုင်ပြီး — pending feedback အားလုံးကို ကိုင်တွယ်တဲ့ reusable `ChipGroup` ဆီ navigation callback ကို ဖြတ်ပေးပါတယ်:

```tsx filename="features/task/components/label-filter.tsx"
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChipGroup } from '@/components/ui/chip-group'

const labels = [
  { label: 'Design', value: 'design' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
]

export function LabelFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('label') ?? null

  function filterAction(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('label', value)
    } else {
      params.delete('label')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <ChipGroup items={labels} value={current} changeAction={filterAction} />
  )
}
```

`LabelFilter` က app ကို ဘယ်ကို navigate လုပ်မယ်ဆိုတာကိုပဲ ဆုံးဖြတ်ပြီး — သူ့ဘာသာ pending state မထားပါဘူး။

#### Pending feedback ကို အတွင်းပိုင်းမှာ ကိုင်တွယ်ခြင်း (Handle pending feedback internally)

`ChipGroup` က `changeAction` prop တစ်ခုကို လက်ခံပြီး — ၎င်းရဲ့ ကိုယ်ပိုင် `startTransition` အတွင်းမှာ ခေါ်ပါတယ်။ `useOptimistic` hooks နှစ်ခု သုံးပါတယ်: တစ်ခုက ရွေးထားတဲ့ chip အတွက် — နောက်တစ်ခုက ancestor components တွေ styling လုပ်ဖို့ သုံးနိုင်တဲ့ `data-pending` attribute အတွက်ပါ:

```tsx filename="components/ui/chip-group.tsx"
'use client'

import { startTransition, useOptimistic } from 'react'

export function ChipGroup({ items, value, changeAction }) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value)
  const [isPending, setIsPending] = useOptimistic(false)

  function handleClick(newValue) {
    startTransition(async () => {
      setOptimisticValue(newValue)
      setIsPending(true)
      await changeAction(newValue)
    })
  }

  return (
    <div className="flex gap-1.5" data-pending={isPending ? '' : undefined}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() =>
            handleClick(item.value === optimisticValue ? null : item.value)
          }
          className={item.value === optimisticValue ? 'active' : ''}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
```

အသုံးပြုသူ (consumer) က callback (`changeAction`) တစ်ခု ဖြတ်ပေးပြီး — design component က transition တစ်ခုအတွင်းမှာ run စေပါတယ်။ စည်းမျဉ်းအရ — `action` လို့ နာမည်ပေးထားတဲ့ (သို့) `Action` နဲ့ အဆုံးသတ်တဲ့ props တွေက ဒီအပြုအမူကို အချက်ပြပါတယ်။ ဒီ pattern အတွက် React docs ထဲက [Exposing `action` props from components](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) ကို ကြည့်ပါ။

`ChipGroup` root element ပေါ်က `data-pending` attribute က — ဘာ coordination မှ မလိုဘဲ — ancestor components တွေကို CSS ကနေတစ်ဆင့် တုံ့ပြန်ခွင့်ပေးပါတယ်။ Home page ပေါ်က board က — transition run နေချိန်မှာ board တစ်ခုလုံးကို skeleton နဲ့ အစားမထိုးဘဲ — `group-has-data-pending:opacity-50` ကို သုံးပြီး မှိန်ဖျော့ပြသပါတယ်။ `ChipGroup` က `group` element အတွင်းမှာ render ဖြစ်လို့ — အဲဒီ attribute ကို styling အတွက် ancestor တိုင်း အသုံးပြုနိုင်ပါတယ်။

> **သိထားသင့်သည်:** `group-has-data-pending:` နဲ့ `has-data-pending:` တွေက CSS [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) selector အဖြစ် compile လုပ်ပြီး — `data-pending` toggle ဖြစ်တိုင်း browser က anchored subtree ပေါ်မှာ အဲဒါကို ပြန်လည် အကဲဖြတ်ပါတယ်။ ဒီနေရာမှာတော့ — board က filter တစ်ကြိမ်လုပ်တိုင်း နှစ်ခါပဲ toggle လုပ်ပြီး — dragging (Step 5) က ဒါကို တမင် ရှောင်ထားလို့ — စရိတ် သက်သာပါတယ်။ Drag (သို့) scroll လိုမျိုး ကြိမ်နှုန်းမြင့် interaction တစ်ခုမှာ broad `:has()` anchor က subtree ကြီးတစ်ခုပေါ်မှာ ခဏခဏ toggle ဖြစ်နေရင် — ထပ်ခါထပ်ခါ တွက်ချက်မှုတွေ ပိုလာလို့ — client state ကို သုံးတာ ပိုကောင်းပါတယ်။

"Frontend" chip က အခု လက်ရှိ frame မှာပဲ highlight ဖြစ်ပါတယ်။ Filtered data တွေ load လုပ်နေချိန်မှာ board က မှိန်နေပြီး — filtered tasks တွေနဲ့ update ဖြစ်ပါတယ်။

### အဆင့် ၄: ချက်ချင်း feedback နဲ့ comments ထည့်ခြင်း (Add comments with instant feedback)

Task detail page မှာ comment section ပါပါတယ်။ Comment တစ်ခု တင်လိုက်တာက server ပေါ်မှာ data အသစ်ကို ရေးပါတယ် — ဒါပေမယ့် server component က သိမ်းဆည်းပြီးသား list ကို render လုပ်တာမို့ — နောက် server render မရောက်မချင်း comment အသစ်ကို ထည့်သွင်းပြနိုင်မှာ မဟုတ်ပါဘူး။

ဒီနေရာမှာ comment form က input အတွက် controlled state ကို သုံးပြီး — Server Function ကို တိုက်ရိုက် ခေါ်ပါတယ်:

```tsx filename="features/task/components/comment-form.tsx"
'use client'

import { useState } from 'react'
import { addComment } from '@/features/task/task-actions'

export function CommentForm({ taskId }) {
  const [content, setContent] = useState('')

  async function handleSubmit() {
    if (!content.trim()) return
    await addComment(taskId, content)
    setContent('')
  }

  return (
    <div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  )
}
```

ဒီ version နဲ့ဆိုရင် — submit လုပ်တာနဲ့ Server Function က run ပေမယ့် — server တုံ့ပြန်တဲ့အထိ input ထဲမှာ စာတွေ ကျန်နေပြီး list ကလည်း မပြောင်းလဲပါဘူး။

Comment list ကို အပိုင်းနှစ်ပိုင်း ခွဲလိုက်ပါ။ Server component တစ်ခုက သိမ်းဆည်းပြီးသား comments တွေကို render လုပ်ပြီး — client component တစ်ခုက empty initial array နဲ့ `useOptimistic([])` ကို သုံးကာ **pending** comments တွေကိုပဲ ခြေရာခံပါတယ်။ Transition ပြီးဆုံးပြီး data အသစ်နဲ့ render အသစ် ရောက်လာတဲ့အခါ — pending list က empty ဆီ ပြန်လည် သတ်မှတ်ပြီး — comment အစစ်က server-rendered list ထဲမှာ ပေါ်လာပါတယ်:

```tsx filename="features/task/components/optimistic-comments.tsx"
'use client'

import { useOptimistic, useRef } from 'react'
import { addComment } from '@/features/task/task-actions'
import { CommentCard } from './comment-card'

export function OptimisticComments({ taskId }) {
  const [pendingComments, setPendingComments] = useOptimistic([])
  const formRef = useRef(null)

  return (
    <>
      <form
        ref={formRef}
        action={async (formData) => {
          const content = formData.get('content')?.trim()
          if (!content) return
          formRef.current?.reset()

          const id = crypto.randomUUID()
          setPendingComments((current) => [
            {
              id,
              content,
              userName: 'You',
              createdAt: new Date().toISOString(),
            },
            ...current,
          ])

          await addComment(taskId, content)
        }}
      >
        <input name="content" placeholder="Write a comment..." required />
        <button type="submit">Send</button>
      </form>
      {pendingComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} pending />
      ))}
    </>
  )
}
```

Submit လုပ်တဲ့အခါ အချက်သုံးချက် ဖြစ်ပေါ်ပါတယ်:

1. `formRef.current?.reset()` က DOM ကို တိုက်ရိုက် ကိုင်တွယ်ပြီး input ကို ရှင်းလင်းပါတယ်။ Transition တစ်ခုအတွင်းမှာ — [`useState`](https://react.dev/reference/react/useState) setters တွေက transition ပြီးဆုံးတဲ့အထိ ဆိုင်းငံ့ထားပေမယ့် — `useOptimistic` setters တွေနဲ့ `formRef.reset()` လို တိုက်ရိုက် DOM ခေါ်ဆိုမှုတွေက လက်ရှိ frame မှာပဲ အကျိုးသက်ရောက်ပါတယ်။
2. `setPendingComments` က client ဘက်မှာ generate လုပ်ထားတဲ့ UUID တစ်ခုနဲ့ comment အသစ်ကို pending list ထဲ ထည့်ပါတယ်။
3. Form `action` က handler ကို transition တစ်ခုအတွင်းမှာ run စေပါတယ်။

Server component က အစစ်အမှန် list ကို ၎င်းနဲ့အတူ render လုပ်ပါတယ်:

```tsx filename="features/task/components/comment-section.tsx"
import { getComments } from '@/features/task/task-queries'
import { CommentCard } from './comment-card'
import { OptimisticComments } from './optimistic-comments'

async function CommentSection({ taskId }) {
  const comments = await getComments(taskId)

  return (
    <div>
      <OptimisticComments taskId={taskId} />
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
```

အခု submit လုပ်တာနဲ့ input က ရှင်းသွားပြီး — list ရဲ့ ထိပ်မှာ ဖျော့ဖျော့ (faded) comment card တစ်ခု ပေါ်လာပါတယ်။ Server က confirm လုပ်တဲ့အခါ — faded card က ပျောက်ကွယ်ပြီး — comment အစစ်က server-rendered list ထဲမှာ နေရာယူပါတယ်။

### အဆင့် ၅: Cards တွေကို column တွေကြား ရွှေ့ခြင်း (Move cards between columns)

Board မှာ column သုံးခု ပါပါတယ်: Todo, In Progress, နဲ့ Done။ Column တစ်ခုချင်းစီက server ကနေ ပေးအပ်တဲ့ `tasks` prop ကနေ tasks တွေကို render လုပ်ပါတယ်။

Card တစ်ခုကို drop လုပ်တာက status အသစ်တစ်ခုကို ရေးပေးတဲ့ Server Function တစ်ခုကို စတင်ပါတယ်။ `tasks` prop က နောက် server render မရောက်မချင်း ပြောင်းလဲမှု မရှိလို့ — pending move အတွက် client ဘက်မှာ ယာယီ task list တစ်ခု လိုအပ်ပါတယ်။

ဒီနေရာမှာ Server Function ကို drop လုပ်တဲ့အခါ ခေါ်ထားပါတယ်:

```tsx filename="features/task/components/board.tsx"
'use client'

import { use } from 'react'
import { updateStatus } from '@/features/task/task-actions'

export function Board({ tasksPromise }) {
  const tasks = use(tasksPromise)

  function handleDrop(targetStatus, taskId) {
    updateStatus(taskId, targetStatus)
  }

  // ...render columns from tasks
}
```

Component က parent server component ကနေ promise တစ်ခုကို လက်ခံပြီး (Step 1 ရဲ့ `<Suspense>` boundary ကို ကြည့်ပါ) — [`use`](https://react.dev/reference/react/use) နဲ့ ဖြန့်ထုတ်ပါတယ်။ ဒီ version နဲ့ဆိုရင် — "Todo" ကနေ "In Progress" ဆီ ဆွဲချလိုက်တဲ့ card တစ်ခုက — server က update ကို လုပ်ဆောင်နေချိန်မှာ column အဟောင်းထဲမှာပဲ ရှိနေပြီး — response ရောက်ရှိမှ column အသစ်ဆီ ခုန်ကူးသွားပါတယ်။

Card ရဲ့ status ကို လက်ရှိ frame မှာ ပြန်မြေပုံဆွဲဖို့ (remap) — reducer တစ်ခုပါတဲ့ `useOptimistic` ကို ထည့်သွင်းပါ။ Reducer က task list တစ်ခုလုံးနဲ့ — ဘယ် card က ဘယ်နေရာကို ရွှေ့သွားလဲ ဖော်ပြတဲ့ action တစ်ခုကို လက်ခံပါတယ်:

```tsx filename="features/task/components/board.tsx"
'use client'

import { startTransition, use, useOptimistic } from 'react'
import { toast } from 'sonner'
import { updateStatus } from '@/features/task/task-actions'

export function Board({ tasksPromise }) {
  const tasks = use(tasksPromise)
  const [optimisticTasks, moveTask] = useOptimistic(
    tasks,
    (currentTasks, action: { taskId: string; status: Status }) =>
      currentTasks.map((t) =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      )
  )

  function handleDrop(targetStatus, taskId) {
    startTransition(async () => {
      moveTask({ taskId, status: targetStatus })
      const result = await updateStatus(taskId, targetStatus)
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => (
        <Column
          key={col.status}
          tasks={optimisticTasks.filter((t) => t.status === col.status)}
          onDrop={(taskId) => handleDrop(col.status, taskId)}
        />
      ))}
    </div>
  )
}
```

Reducer က task list ပေါ်မှာ map လုပ်ပြီး — ဆွဲချလိုက်တဲ့ card ရဲ့ status ကိုပဲ update လုပ်ကာ — ကျန်တာတွေကို မပြောင်းလဲထားပါဘူး။ ဆွဲနေတုန်း (mid-drag) အတွင်းမှာ နောက်ခံ refresh တစ်ခု ဝင်လာခဲ့ရင် — ဥပမာ polling ကနေ (သို့) အခြား user တစ်ယောက်ရဲ့ mutation ကနေ — React က updated base data နဲ့ reducer ကို ပြန် run လို့ — optimistic move က data အသစ်ရဲ့ အပေါ်မှာ တည်ဆောက်ခံရပါတယ်။ Task မရှိတော့တဲ့အခါ Server Function က error result တစ်ခုကို ပြန်ပေးပြီး — client က toast နဲ့ ပြသပါတယ်။

ဒီ step က `useTransition` အစား standalone `startTransition` ကို သုံးပါတယ် — ဘာလို့လဲဆိုတော့ hook ရဲ့ `isPending` က Step 3 ကနေ board fade ကို ဖြစ်ပေါ်စေလို့ပါ။ Optimistic move က visual feedback ကို လုံလောက်စွာ ဖုံးအုပ်ထားပြီးသားမို့ — pending indicator မလိုအပ်ပါဘူး။ Server Function က မျှော်လင့်ထားတဲ့ error တစ်ခု ပြန်ပေးခဲ့ရင် — card က ပြန် ပျက်သွားပါတယ်။ မမျှော်လင့်ထားတဲ့ errors တွေကတော့ အနီးဆုံး [error boundary](/docs/nextjs/error-handling) ဆီ ပို့ပေးပါတယ်။

အခု "Todo" ကနေ "In Progress" ဆီ ဆွဲချလိုက်တဲ့ card က — လွှတ်လိုက်တာနဲ့ ချက်ချင်း ပစ်မှတ် column ထဲ ရောက်ရှိသွားပါတယ်။

### အဆင့် ၆: Form lifecycle ကို စီမံခြင်း (Manage form lifecycle)

Board မှာ create dialog တစ်ခုကို ဖွင့်ပေးတဲ့ "New Task" button ပါပါတယ်။ Form action က task ကို server ပေါ်မှာ ဖန်တီးပြီး — board ကို refresh လုပ်ပါတယ်။

Dialog က action pending ဖြစ်နေချိန်မှာ client state အပိုင်းသုံးပိုင်းကို ညှိနှိုင်းပေးရပါတယ်: submit button, field values တွေ၊ ပြီးတော့ dialog ဖွင့်ထားလား ပိတ်ထားလား ဆိုတာပါ။ [`useActionState`](https://react.dev/reference/react/useActionState) က သုံးခုစလုံးကို ကိုင်တွယ်ပါတယ်။

ဒီနေရာမှာ form က submission state ကို ကိုယ်တိုင် စီမံပြီး — `onSubmit` handler အတွင်းမှာ Server Function ကို ခေါ်ပါတယ်:

```tsx filename="features/task/components/create-task-modal.tsx"
'use client'

import { useState } from 'react'
import { createTask } from '@/features/task/task-actions'

export function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title')
    if (!title.trim()) return

    setIsSubmitting(true)
    await createTask({ title /* ... */ })
    setIsSubmitting(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Task title..." required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </Dialog>
  )
}
```

ဒီ version နဲ့ဆိုရင် — submit handler က run ပေမယ့် — pending state ကို သီးခြား `useState` ခေါ်ဆိုမှု နှစ်ခုနဲ့ စီမံထားပါတယ်။ `setIsOpen(false)` က transition တစ်ခုရဲ့ အပြင်ဘက်မှာ ဖြစ်ပေါ်လို့ — board က task အသစ်ကို မပြသေးခင် dialog က စောစီးစွာ ပိတ်သွားပါတယ်။ Form fields တွေကလည်း — reset key တစ်ခုကို ကိုယ်တိုင် ခြေရာခံမထားရင် — submission တစ်ခုကနေ နောက်တစ်ခုအထိ ၎င်းတို့ရဲ့ values တွေကို ဆက်ထိန်းထားပါတယ်။

`useActionState` က စိုးရိမ်ရမယ့် အချက်သုံးခုစလုံးကို ကိုင်တွယ်ပါတယ်: button အတွက် `isPending`၊ fields တွေအတွက် key-based reset၊ ပြီးတော့ dialog ပိတ်ခြင်းကို wrap လုပ်ပေးတာပါ:

```tsx filename="features/task/components/create-task-modal.tsx"
'use client'

import { useActionState, startTransition, useState } from 'react'
import { createTask } from '@/features/task/task-actions'

export function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false)

  const [{ key }, formAction, isPending] = useActionState(
    async (prev, formData) => {
      const title = String(formData.get('title'))
      if (!title.trim()) return prev

      await createTask({
        title,
        description: String(formData.get('description')),
        status: 'todo',
        priority: 'medium',
      })

      startTransition(() => setIsOpen(false))
      return { key: prev.key + 1 }
    },
    { key: 0 }
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form action={formAction}>
        <div key={key}>
          <input name="title" placeholder="Task title..." required />
          <input name="description" placeholder="Describe the task..." />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </Dialog>
  )
}
```

ပြန်ပေးလိုက်တဲ့ state ထဲက `key` က form reset ကို ထိန်းချုပ်ပါတယ်။ အောင်မြင်တဲ့အခါ `key` က တိုးလို့ — `<div key={key}>` ကို ပြန်လည် mount လုပ်ပြီး — အတွင်းက input တိုင်းကို reset လုပ်ပါတယ်။

`useActionState` က action ကို transition တစ်ခုအနေနဲ့ run လို့ — `createTask` run နေချိန်မှာ dialog က ဖွင့်ထားပြီး `isPending` က `true` အဖြစ် ဆက်ရှိနေပါတယ်။ `await` ပြီးနောက်က state updates တွေက အလိုအလျောက် အဲဒီ transition ထဲ မပါဝင်လို့ — `setIsOpen(false)` ကို `startTransition` ထဲမှာ wrap လုပ်တာက ပိတ်လုပ်ဆောင်ချက်ကို transition ရဲ့ အစိတ်အပိုင်းအဖြစ် run စေပါတယ်။

ဒီ wrap နဲ့ဆိုရင် — React က dialog ပိတ်ခြင်းနဲ့ `createTask` အတွင်းမှာ `refresh()` က ဖြစ်ပေါ်စေတဲ့ board update ကို အတူတကွ batch လုပ်လို့ — dialog ပိတ်တဲ့အချိန်မှာပဲ task အသစ် ပေါ်လာပါတယ်။ Wrap မရှိရင်တော့ — dialog က အရင်ပိတ်ပြီး board က frame တစ်ခု နောက်ကျမှ update ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:** ဒီကန့်သတ်ချက်ကို React docs မှာ [React doesn't treat my state update after `await` as a transition](https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) ဆိုပြီး မှတ်တမ်းတင်ထားပါတယ်။ ဒါကို မဖြေရှင်းရသေးသရွေ့ — `await` ပြီးနောက်က state updates တွေကို `startTransition` ထဲမှာ wrap လုပ်တာက အကြံပြုထားတဲ့ နည်းလမ်း (workaround) ဖြစ်ပါတယ်။

`await` ပြီးနောက် ပေါ်လာတဲ့ အဲဒီအချိန်ကွက်အတွင်းမှာပဲ — toasts တွေလို side effects တွေကို ထည့်လေ့ရှိပါတယ်:

```tsx
await createTask({
  /* … */
})

startTransition(() => setIsOpen(false))
toast.success('Task created')
```

Rendered state ကို မထိခိုက်စေတဲ့ side effects တွေ — analytics, toasts, focus changes လိုမျိုးတွေ — `await` ပြီးမြောက်ပြီးမှ run ပါတယ်။ သူတို့က React state ကို update မလုပ်လို့ — transition မလိုအပ်ပါဘူး။

အခု submit လုပ်တာနဲ့ button ရဲ့ စာသားက "Creating..." အဖြစ် ပြောင်းပြီး မှိန်သွားပါတယ်။ Server တုံ့ပြန်တဲ့အခါ — fields တွေ ရှင်းသွားပြီး — dialog ပိတ်ကာ — board ပေါ်မှာ task အသစ် ပေါ်လာပြီး — toast က လုပ်ဆောင်ချက်ကို confirm လုပ်ပါတယ်။

> **သိထားသင့်သည်:** Companion app က modal ထဲမှာ status, priority, assignee နဲ့ label pickers တွေကိုပါ ထည့်ထားပါတယ်။ Pattern က အတူတူပါပဲ: hidden inputs တွေက picker တစ်ခုချင်းစီရဲ့ state ကို ခြေရာခံပြီး — `key` က အောင်မြင်တဲ့အခါ အားလုံးကို reset လုပ်ပါတယ်။

### အဆင့် ၇: Pending deletion ကို parent ဆီ signal ပေးခြင်း (Signal pending deletion to a parent)

Comment card တစ်ခုချင်းစီမှာ — comment ကို server ပေါ်မှာ ဖျက်ပေးတဲ့ delete button ပါပြီး — နောက် render တစ်ခု ပြီးတာနဲ့ comment က list ကနေ ပျောက်ကွယ်သွားပါတယ်။

Click လုပ်တာနဲ့ အဲဒီ render ကြားကာလမှာ — card က data အဟောင်းကိုပဲ ပြသနေပါသေးတယ်။ List ကိုယ်တိုင်က pending removal ကို ပြသနိုင်တဲ့ နည်းလမ်း မရှိလို့ — signal က button ကနေ လာရပါမယ်။

ဒီ step က Step 3 ကနေ `data-pending` CSS hook ကို ပြန်သုံးပြီး — `useTransition` ရဲ့ `isPending` အစား `useOptimistic(false)` ကနေ မောင်းနှင်ပါတယ်။

ဒီနေရာမှာ Server Function ကို တိုက်ရိုက် ခေါ်ထားပါတယ်:

```tsx filename="features/task/components/delete-button.tsx"
'use client'

import { Trash2 } from 'lucide-react'
import { deleteComment } from '@/features/task/task-actions'

export function DeleteButton({ commentId }) {
  return (
    <button
      onClick={() => deleteComment(commentId)}
      aria-label="Delete comment"
    >
      <Trash2 className="size-3" />
    </button>
  )
}
```

ဒီ version နဲ့ဆိုရင် — နောက် server render မရောက်မချင်း comment က အပြည့်အဝ မြင်နေရပါတယ်။

Action ကို `<form>` တစ်ခုအတွင်းမှာ wrap လုပ်ပြီး — `useOptimistic(false)` နဲ့ pending state ကို ခြေရာခံကာ — `data-pending` attribute တစ်ခုကနေတစ်ဆင့် ဖော်ထုတ်ပါတယ်။ Action ကို `deleteAction` prop အဖြစ် လက်ခံထားလို့ — parent comment card က CSS နဲ့ တုံ့ပြန်နိုင်ပါတယ်:

```tsx filename="features/task/components/delete-button.tsx"
'use client'

import { useOptimistic } from 'react'
import { Trash2 } from 'lucide-react'

export function DeleteButton({
  deleteAction,
}: {
  deleteAction: () => void | Promise<void>
}) {
  const [isPending, setIsPending] = useOptimistic(false)

  return (
    <form
      action={async () => {
        setIsPending(true)
        await deleteAction()
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        data-pending={isPending ? '' : undefined}
        aria-label="Delete comment"
      >
        <Trash2 className="size-3" />
      </button>
    </form>
  )
}
```

Parent comment card က Tailwind ရဲ့ `has-data-pending:` variant ကို သုံးပြီး — ဘယ် descendant က `data-pending` attribute ကို သတ်မှတ်လိုက်ရင်ပဲ — သူ့ဘာသာ ဖျော့သွားအောင် လုပ်ပါတယ်။ Deletion ဘယ်အချိန်မှာ pending ဖြစ်နေလဲဆိုတာကို button ကပဲ သိတာမို့ — အဲဒီ state ကို CSS attribute အဖြစ် ဖော်ထုတ်ပေးတာက — state ကို lift လုပ်စရာ (သို့) callbacks တွေ ချိတ်ဆက်စရာ မလိုဘဲ — ဘယ် ancestor မဆို သူ့ဘာသာ မှိန်နိုင်စေပါတယ်:

```tsx filename="features/task/components/comment-card.tsx"
<div className="rounded-lg px-3 transition-all has-data-pending:opacity-30">
  {/* comment content */}
  {deleteAction && <DeleteButton deleteAction={deleteAction} />}
</div>
```

Parent server component က Server Function ကို comment ID နဲ့ bind လုပ်ပြီး — `DeleteButton` ကို ပြန်လည် အသုံးပြုနိုင် (reusable) ဖြစ်စေပါတယ်:

```tsx filename="features/task/components/comment-section.tsx"
<CommentCard
  comment={comment}
  deleteAction={
    comment.userName === 'You'
      ? deleteComment.bind(null, comment.id)
      : undefined
  }
/>
```

Card က အခု click မှတ်ပုံတင်လိုက်တာနဲ့ — opacity 30% အထိ ချက်ချင်း ဖျော့သွားပါတယ်။ Server က confirm လုပ်ပြီး နောက် render ရောက်လာတဲ့အခါ — card က list ကနေ unmount ဖြစ်ပါတယ်။

### အဆင့် ၈: ထပ်တလဲလဲ navigation ကို ချက်ချင်း ဖြစ်စေခြင်း (Make repeat navigation instant)

ဒီအထိ pattern တိုင်းက interaction တစ်ခုတည်းကိုပဲ ချောမွေ့စေပါတယ်။ Navigations တွေကြားမှာတော့ — read တွေက ပြန်ပြန် run ဖြစ်ပြီး — fallbacks တွေက ပြန်ပြန် paint ဖြစ်နေပါတယ်။ Reusable reads တွေကို [cache](/docs/nextjs/caching) လုပ်ပြီး — တကယ့် request နဲ့ [prefetch](/docs/nextjs/prefetching) လုပ်တာက — data model ကို browser ထဲ ရွှေ့စရာ မလိုဘဲ — အဲဒီကွာဟချက်ကို ပိတ်ပေးပါတယ်။

ဒီ step က Next.js 16 မှာ မိတ်ဆက်ခဲ့တဲ့ [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) တွေကို အသုံးပြုပါတယ်။ Steps 1 ကနေ 7 အထိက ဒါမပါဘဲ အလုပ်လုပ်ပါတယ်။ Cache Components ကို မသုံးဘူးဆိုရင် — [Caching without Cache Components](/docs/nextjs/caching-without-cache-components) ကို ကြည့်ပါ။

`next.config.ts` ထဲမှာ enable လုပ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

Cache Components ကို enable လုပ်တာက — ဒီ step ထဲက routes တွေတင်မကဘဲ — route တိုင်းပေါ်မှာ prerender validation ကို သက်ရောက်စေပါတယ်။ [`<Suspense>`](https://react.dev/reference/react/Suspense) အပြင်ဘက်မှာ `cookies()`, `headers()`, (သို့) `searchParams` လိုမျိုး request data တွေကို ဖတ်တဲ့ route တစ်ခုက — အခု prerendering ကို ပိတ်ဆို့ပြီး — Step 1 ရဲ့ နည်းလမ်း (treatment) လိုအပ်ပါတယ်။ ရှိပြီးသား app တစ်ခုမှာ ဖွင့်ဖို့ဆိုရင် — [Migrating to Cache Components](/docs/nextjs/migrating-to-cache-components) ကို ကြည့်ပါ။

#### Reusable reads တွေကို cache လုပ်ခြင်း (Cache reusable reads)

Server read တစ်ခုချင်းစီအတွက် — ဒီ read က requests တွေကြားမှာ ပြန်သုံးသင့်လား၊ write တစ်ခုချင်းစီက ဒါကို တိကျစွာ invalidate လုပ်နိုင်လားဆိုတာ မေးကြည့်ပါ။ Task တစ်ခုက cache လုပ်လောက်အောင် တည်ငြိမ်ပြီး — id တစ်ခုချင်းစီအတွက် ရှင်းလင်းတဲ့ tag ရှိပါတယ်:

```ts filename="features/task/task-queries.ts"
import { cacheLife, cacheTag } from 'next/cache'
import { getTaskById } from '@/lib/db'

export async function getTask(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('tasks', `task-${id}`)

  return getTaskById(id)
}
```

Id တစ်ခုချင်းစီရဲ့ tag `task-${id}` က task တစ်ခုတည်းအတွက် သီးသန့် handle တစ်ခုကို ပေးပါတယ်။ ပိုကျယ်ပြန့်တဲ့ `tasks` tag ကတော့ list ကို ဖုံးအုပ်ပါတယ်။ Cache scoping (`'use cache: private'`, `'use cache: remote'`), cache lifetimes နဲ့ tag patterns တွေအတွက် [Caching guide](/docs/nextjs/caching) ကို ကြည့်ပါ။

#### Mutations တွေကနေ invalidate လုပ်ခြင်း (Invalidate from mutations)

[`refresh()`](/docs/nextjs/refresh) က dynamic work တွေကို ပြန် run ပေမယ့် — cached entries တွေကို နေရာတိုင်းမှာ ချန်ထားခဲ့ပါတယ်။ Write တစ်ခုစီက ထိမိခဲ့တဲ့ tags တွေအတွက် — အဲဒီအစား [`updateTag`](/docs/nextjs/update-tag) ကို သုံးပါ:

```ts filename="features/task/task-actions.ts"
'use server'

import { updateTag } from 'next/cache'
import { updateTaskStatus } from '@/lib/db'

export async function updateStatus(taskId: string, newStatus: Status) {
  const updated = await updateTaskStatus(taskId, newStatus)
  if (!updated) {
    return { success: false as const, error: 'Task no longer exists' }
  }

  updateTag('tasks')
  updateTag(`task-${taskId}`)
  return { success: true as const, status: newStatus }
}
```

Server Function တိုင်းက ပုံစံတူပါပဲ: write ကို run ပြီး — ပြောင်းလဲသွားတဲ့ cached reads တွေအတွက် `updateTag` ကို ခေါ်ပါတယ်။ Dynamic reads တွေမှာ invalidate လုပ်ဖို့ tags မရှိလို့ — အဲဒီ mutations တွေအတွက် `refresh()` ကို သုံးပါ။

ဒီ demo မှာ comment thread က dynamic အဖြစ် ဆက်ရှိနေပါတယ် — ဘာလို့လဲဆိုတော့ readers တွေက ဖွင့်ထားတဲ့ task page ပေါ်မှာ လက်ရှိ discussion ကို ချက်ချင်း update ဖြစ်တာ မျှော်လင့်လို့ပါ။ Comment တစ်ခု ထည့်တာ (သို့) ဖျက်တာက `refresh()` ကို ခေါ်ပြီး — လက်ရှိ route အတွက် dynamic comment read ကို ပြန် run စေကာ — task caches တွေကို နေရာတိုင်းမှာ ချန်ထားခဲ့ပါတယ်။ Tag patterns, time-based revalidation နဲ့ route handlers တွေကနေ on-demand invalidation အကြောင်း — [Revalidating guide](/docs/nextjs/revalidating) မှာ ကြည့်ပါ။

#### တကယ့် request နဲ့အတူ ဦးတည်ရာကို prefetch လုပ်ခြင်း (Prefetch the destination with the real request)

[Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) (Next.js 16.3 နဲ့ နောက်ပိုင်း) အောက်မှာ — `<Link>` က ဦးတည်ရာရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို prefetch လုပ်ပါတယ်: လက်ရှိ user အတွက် links တွေကြားမှာ share လုပ်ထားတဲ့ route output ပါ။ Shell ထဲမှာ [URL data](https://nextjs.org/docs/app/glossary#url-data) မပါဝင်ပါဘူး — ဘာလို့လဲဆိုတော့ `params` နဲ့ `searchParams` တွေက link တစ်ခုချင်းစီနဲ့ သက်ဆိုင်လို့ပါ။ Link ကို `prefetch={true}` နဲ့ [per-link prefetching](/docs/nextjs/optimizing-prefetching) အတွက် opt-in လုပ်ပြီး — click မလုပ်ခင် အဲဒီ URL data ကို ဖြေရှင်းထားနိုင်ပါတယ်:

```tsx filename="features/task/components/task-card.tsx"
<Link href={`/task/${id}`} prefetch={true}>
  {/* … */}
</Link>
```

Per-link prefetching က ဦးတည်ရာမှာ URL-specific အလုပ်တွေ ရှိပြီး — user တွေ နောက်တစ်ဆင့် လိုအပ်ဖို့ များတဲ့အခါ အကျိုးအရှိဆုံး ဖြစ်ပါတယ်။ Cached reads တွေက prefetch လုပ်ထားတဲ့ output ကို [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ထဲမှာ reusable နဲ့ tag-invalidatable ဖြစ်စေပါတယ်; dynamic reads တွေကလည်း click မလုပ်ခင် ဖြေရှင်းနိုင်ပေမယ့် — prefetch တစ်ခုချင်းစီက တကယ့် server အလုပ်တွေ လုပ်ဆောင်နိုင်ပါတယ်။ Companion app မှာတော့ — task cards တွေက viewport ထဲ ဝင်လာတာနဲ့ detail page ကို prefetch လုပ်လို့ — user click လုပ်တဲ့အချိန်မှာတော့ ချက်ချင်း paint ဖြစ်နေပါပြီ။

## နောက်ထပ် ဆက်လုပ်ရန် (Next steps)

ဒီ guide ထဲက patterns တွေက primitives အနည်းငယ်ကို ပေါင်းစပ်ထားပါတယ်:

| အခြေအနေ (Situation)                                                                 | သုံးစရာ (Use)                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| နှေးကွေးတဲ့ data တွေက page ကို မပိတ်ဆို့ဘဲ stream ဝင်လာသင့်တဲ့အခါ                      | [`<Suspense>`](https://react.dev/reference/react/Suspense)                                                                                                                                                                                                                   |
| Async အလုပ် run နေချိန်မှာ value တစ်ခု update ဖြစ်သင့်တဲ့အခါ                               | [`useOptimistic`](https://react.dev/reference/react/useOptimistic)                                                                                                                                                                                                           |
| Async အလုပ်က pending state, error handling (သို့) coordinated UI updates တွေ လိုအပ်တဲ့အခါ | [`useTransition`](https://react.dev/reference/react/useTransition)                                                                                                                                                                                                           |
| Form တစ်ခုက pending, reset နဲ့ result state တွေ လိုအပ်တဲ့အခါ                             | [`useActionState`](https://react.dev/reference/react/useActionState)                                                                                                                                                                                                         |
| တစ်နေရာရာမှာ ဖြစ်ပေါ်နေတဲ့ အလုပ်အတွက် ancestor တစ်ခုက pending state ပြသသင့်တဲ့အခါ        | [`data-pending`](https://react.dev/reference/react-dom/components/form#props) attribute ကို CSS နဲ့ styling လုပ်ခြင်း                                                                                                                                                      |
| Reusable reads တွေက requests တွေကြားမှာ ခံနိုင်ပြီး — writes တွေပြီးနောက် fresh ဖြစ်နေသင့်တဲ့အခါ | [`'use cache'`](/docs/nextjs/use-cache) ကို [`cacheTag`](/docs/nextjs/cache-tag) နဲ့တွဲသုံးပြီး — [`updateTag`](/docs/nextjs/update-tag) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) နဲ့ revalidate လုပ်ခြင်း |
| Interactive app တစ်ခုရဲ့ pages တွေကြား navigation က instant လို့ ခံစားရသင့်တဲ့အခါ        | [`<Link>`](https://nextjs.org/docs/app/api-reference/components/link) prefetching — [Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) နဲ့အတူ — URL data ပေါ် မူတည်တဲ့ content တွေအတွက် `prefetch={true}` ကနေတစ်ဆင့် [per-link prefetching](/docs/nextjs/optimizing-prefetching) လုပ်ခြင်း |

Patterns အများစုက ဒီထဲက နှစ်ခု (သို့) နှစ်ခုထက်ပိုပြီး ပေါင်းစပ်သုံးပါတယ်။ သင်ဖြေရှင်းနေတဲ့ ကန့်သတ်ချက်နဲ့ ကိုက်ညီတဲ့ primitive ကိုပဲ ရွေးချယ်သုံးပါ။

ဆက်စပ် guides များ:

- [Client-side data fetching](/docs/nextjs/client-side-data-fetching) — browser ကနေ တိုက်ရိုက် fetching လုပ်ခြင်း၊ Server Component တစ်ခုကနေ initial data ပေးခြင်း၊ client cache coordination တို့အတွက်
- [Streaming](/docs/nextjs/streaming) — loading boundaries နဲ့ `<Suspense>` patterns တွေအတွက်
- [Instant Navigation](/docs/nextjs/instant-navigation) — navigations တွေ instant ဖြစ်နေကြောင်း စစ်ဆေးခြင်းအတွက်
- [View Transitions](/docs/nextjs/view-transitions) — state changes တွေကို animate လုပ်ခြင်းအတွက်
- [Single-page applications](/docs/nextjs/single-page-applications) — client နဲ့ server list updates တွေကို ထပ်တူကျအောင် ထိန်းထားတဲ့ shared-reducer `useOptimistic` ဥပမာတစ်ခုအတွက်
