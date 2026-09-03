---
title: "Server Actions နဲ့ Mutations"
description: "Next.js မှာ Server Actions အလုပ်လုပ်ပုံ — single-roundtrip response model (return value နဲ့ re-rendered UI တစ်ပြိုင်နက်), client ပေါ်မှာ sequential dispatch, security (CSRF, body size limit, action ID encryption), caching နဲ့ configuration"
order: 177
source: "https://nextjs.org/docs/app/guides/server-actions"
status: translated
updated: 2026-09-03
---

**Server Action** ဆိုတာ React ရဲ့ action mechanisms တွေ — `<form action>`, `<button formAction>` (သို့) client-side transition တစ်ခုလိုမျိုး — ကနေတစ်ဆင့် invoke လုပ်တဲ့ [React Server Function](https://react.dev/reference/rsc/server-functions) တစ်ခုပါ။

[`'use server'`](/docs/nextjs/use-server) directive ကို ထည့်ပြီး ဖန်တီးကာ — form တစ်ခုကနေ (သို့) `startTransition` ထဲမှာ wrap လုပ်ထားတဲ့ event handler (သို့) `useEffect` တစ်ခုကနေ invoke လုပ်ပါတယ်။ Server Functions တွေ ဖန်တီးခြင်းနဲ့ invoke လုပ်ခြင်းရဲ့ အခြေခံတွေအတွက် [Mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Forms guide](/docs/nextjs/forms) ကို ကြည့်ပါ။

ဒီ page က Next.js နဲ့ သက်ဆိုင်တဲ့ Server Actions ရဲ့ အပိုင်းတွေကို ဖော်ပြပါတယ်: သူတို့က mutations တွေနဲ့ ပုံမှန် ဘယ်လို ဆက်စပ်လဲ၊ response က return လုပ်လိုက်တဲ့ data ရော re-render လုပ်ထားတဲ့ UI ကိုပါ ဘယ်လို သယ်ဆောင်လဲ၊ client က သူတို့ကို ဘယ်လို dispatch လုပ်လဲ၊ framework က စီမံပေးတဲ့ security boundary နဲ့ ရရှိနိုင်တဲ့ configuration တွေ အကြောင်းပါ။

## Client ပေါ်မှာ sequential dispatch လုပ်ခြင်း

Next.js က Server Actions တွေကို client တစ်ခုစီမှာ တစ်ခုပြီးတစ်ခု (sequential) dispatch လုပ်ပါတယ်။ User တစ်ယောက်က action သုံးခုကို လျင်မြန်စွာ ဆက်တိုက် trigger လုပ်ခဲ့ရင် — ဒုတိယ action က ပထမ ပြီးတဲ့အထိ စောင့်ပြီး — တတိယ action က ဒုတိယ ပြီးတဲ့အထိ စောင့်ပါတယ်။ ဒါက re-render လုပ်ထားတဲ့ server tree ကို သူ့ကို ဖြစ်ပေါ်စေတဲ့ action result နဲ့ ညီညွတ်နေအောင် ထိန်းသိမ်းပေးပါတယ်။

အကျိုးဆက်အနေနဲ့ — Server Actions တွေကို client ကနေ parallel လုပ်ဖို့ `Promise.all` ကို အားမကိုးပါနဲ့။ Parallel အလုပ်တွေ လိုအပ်ရင် — Server Action တစ်ခုတည်းထဲမှာ လုပ်ပါ၊ [Server Component](https://nextjs.org/docs/app/getting-started/fetching-data#server-components) တစ်ခုကနေ parallel fetch လုပ်ပါ၊ (သို့) mutation မဟုတ်တဲ့ requests တွေအတွက် [Route Handler](https://nextjs.org/docs/app/guides/backend-for-frontend#manipulating-data) တစ်ခုကို သုံးပါ။

> **သိထားသင့်သည်:** ဒါက client dispatcher ရဲ့ ဂုဏ်သတ္တိတစ်ခုပါ — Server Functions တွေရဲ့ ယေဘုယျ ဂုဏ်သတ္တိတော့ မဟုတ်ပါဘူး။ Server ဘက်မှာ — action တစ်ခုက သူ့ရဲ့ကိုယ်ပိုင် request ထဲမှာ run ပြီး — async function တစ်ခု လုပ်နိုင်သမျှ အားလုံး လုပ်နိုင်ပါတယ်။

## Response တစ်ခုတည်းမှာ data နဲ့ UI ပါသယ်ဆောင်ခြင်း

Server Action တစ်ခုက ချက်ချင်း revalidation တစ်ခုကို trigger လုပ်တဲ့အခါ — Next.js က အလုပ်တစ်ခုလုံးကို HTTP request တစ်ခုတည်းထဲမှာ လုပ်ဆောင်ပါတယ်: action ကို run လုပ်ပြီး — လက်ရှိ route ကို server ဘက်မှာ ပြန် render လုပ်ပါတယ်။ ပြန်လာတဲ့ response ထဲမှာ အပိုင်းနှစ်ပိုင်းလုံး — တစ်ခုတည်းသော Flight stream ထဲမှာ — ပါဝင်ပါတယ်:

- Action ရဲ့ return value — ဒါကို client ပေါ်မှာ `useActionState` (သို့) await လုပ်ထားတဲ့ promise က စားသုံးပါတယ်။
- လက်ရှိ route အတွက် အသစ်ပြန် render လုပ်ထားတဲ့ [RSC Payload](https://nextjs.org/docs/app/glossary#rsc-payload) တစ်ခု — client က ဒါကို seeded navigation အဖြစ် commit လုပ်ပါတယ်။

လက်ရှိ page ရဲ့ updated UI ကို မြင်ရဖို့ — သင့် application code က နောက်ထပ် follow-up fetch တစ်ခု မလိုအပ်ပါဘူး။

Action က ဒါတွေထဲက တစ်ခုခု လုပ်တဲ့အခါ — re-render တစ်ခုကို response တစ်ခုတည်းထဲမှာ ထည့်သွင်းပါတယ်:

- Cached data တွေကို ချက်ချင်း invalidate လုပ်ဖို့ [`updateTag`](/docs/nextjs/update-tag) (သို့) [`revalidatePath`](/docs/nextjs/revalidate-path) ကို ခေါ်တာ။
- လက်ရှိ route ရဲ့ RSC Payload ကို ပြန် fetch လုပ်ဖို့ [`refresh`](/docs/nextjs/refresh) ကို ခေါ်တာ။
- [`cookies()`](/docs/nextjs/cookies) ကနေတစ်ဆင့် cookies တွေကို mutate လုပ်တာ။ Cookie တစ်ခုကို set (သို့) delete လုပ်လိုက်ရင် — UI က value အသစ်ကို ထင်ဟပ်စေဖို့ လက်ရှိ page ကို အလိုအလျောက် ပြန် render လုပ်ပါတယ်။
- [`redirect`](/docs/nextjs/redirect) ကို ခေါ်တာ။ Response က router ကို navigate လုပ်ပြီး — destination ရဲ့ RSC Payload ကို stream လုပ်ပါတယ်။

```ts filename="app/posts/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await db.post.create({
    data: {
      title: String(formData.get('title')),
      authorId: session.user.id,
    },
  })

  revalidatePath('/posts')
}
```

Mutation, cache invalidation နဲ့ page re-render တွေအားလုံးက roundtrip တစ်ခုတည်းအတွင်းမှာ ပြီးဆုံးပါတယ်။ [`redirect`](/docs/nextjs/redirect) က control-flow exception တစ်ခုကို throw လုပ်လို့ — သူ့နောက်က code တွေက run မလုပ်ပါဘူး။ Destination မှာ fresh data လိုအပ်တယ်ဆိုရင် — revalidation calls တွေကို `redirect` မတိုင်ခင် ထားပါ။

Stale-while-revalidate profile ပါတဲ့ [`revalidateTag`](/docs/nextjs/revalidate-tag) ကတော့ ခြွင်းချက်ပါ: သူက tag ကို background refresh အတွက် အမှတ်အသား လုပ်ပြီး — action response ထဲမှာ re-render တစ်ခု မထည့်ပါဘူး။ Page က နောက်တစ်ကြိမ် ဖတ်တဲ့အခါမှသာ အပြောင်းအလဲကို ထင်ဟပ်ပါတယ်။ အထက်ပါထဲက တစ်ခုမှ မလုပ်တဲ့ action တစ်ခုက — သူ့ရဲ့ return value ကိုပဲ သယ်ဆောင်ပြီး — လက်ရှိ route ကို ပြန် render မလုပ်ပါဘူး။

## Security (လုံခြုံရေး)

Server Action တစ်ခုက သူ့ကို invoke လုပ်တဲ့ page ကို ဦးတည်တဲ့ POST request အဖြစ် run ပါတယ်။ Build time မှာ — `'use server'` directive က client bundles တွေထဲက function ရဲ့ implementation ကို server ဆီ POST ပြန်ပို့တဲ့ reference (action ID တစ်ခုနဲ့ dispatcher တစ်ခု) အဖြစ် လဲလှယ်ဖို့ compiler ကို ပြောပါတယ်။ Implementation က server ပေါ်မှာ ကျန်နေပေမယ့် — တူညီတဲ့ POST ကို ပို့နိုင်တဲ့သူတိုင်း ဒီ route ကို ဝင်ရောက်လို့ရပါတယ်။ Action တိုင်းကို မယုံကြည်ရတဲ့ entry point အဖြစ် သဘောထားပါ။

Next.js က framework-level ကာကွယ်မှုတချို့ စီမံပေးပါတယ်:

- **CSRF check။** Request ရဲ့ `Origin` ကို `Host` (သို့) `X-Forwarded-Host` နဲ့ ယှဉ်ကြည့်ပြီး — မကိုက်ညီရင် ပယ်ချပါတယ်။ Proxy (သို့) CDN domains တွေအတွက် [`serverActions.allowedOrigins`](/docs/nextjs/next-config-server-actions) ကို configure လုပ်ပါ။
- **Body size limit။** Action requests တွေကို default အနေနဲ့ 1MB နဲ့ ကန့်သတ်ထားပါတယ်။ ပိုကြီးတဲ့ payloads တွေ လက်ခံတဲ့အခါ [`serverActions.bodySizeLimit`](/docs/nextjs/next-config-server-actions) ကို configure လုပ်ပါ။
- **Encrypted action IDs နဲ့ dead code elimination။** Action references တွေကို build time မှာ encrypt လုပ်ပြီး — မသုံးတဲ့ Server Functions တွေကို client bundles တွေကနေ ဖယ်ထုတ်လိုက်လို့ — သူတို့မှာ public endpoint မရှိပါဘူး။ [Built-in Server Actions security features](https://nextjs.org/docs/app/guides/data-security#built-in-server-actions-security-features) ကို ကြည့်ပါ။
- **Closure variable encryption။** Inline action တစ်ခုက ဖမ်းယူထားတဲ့ variables တွေကို client ဆီ မပို့ခင် encrypt လုပ်ပါတယ်။ Multi-instance နဲ့ self-hosted deployments တွေအတွက် — instances တွေအနှံ့ မျှဝေထားတဲ့ stable key တစ်ခုအနေနဲ့ `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` ကို သတ်မှတ်ပါ။ [Closures နဲ့ encryption](https://nextjs.org/docs/app/guides/data-security#closures-and-encryption) ကို ကြည့်ပါ။

Framework ရဲ့ ကာကွယ်မှုတွေက application-level checks တွေရဲ့ အစားထိုးတော့ မဟုတ်ပါဘူး။ Action တိုင်းထဲမှာ:

- **Authenticate လုပ်ပြီး authorize လုပ်ပါ။** Render-time gating (authenticated page တစ်ခုပေါ်မှာ form တစ်ခုကိုပဲ render လုပ်ခြင်း) က security boundary မဟုတ်ပါဘူး — requests တွေကို UI ကနေတစ်ဆင့် မသွားဘဲ ပို့နိုင်လို့ပါ။
- **Inputs တွေကို validate လုပ်ပါ။** `FormData`, query parameters နဲ့ headers တွေကို မယုံကြည်ရတဲ့အရာအဖြစ် သဘောထားပါ။
- **Return values တွေကို ချုပ်တည်းပါ။** Action returns တွေကို client ဆီ serialize လုပ်ပါတယ်။ Raw database records တွေအဖြစ် မဟုတ်ဘဲ — UI က render လုပ်တဲ့ပုံစံအတိုင်း ပုံဖော်ပါ။

Data Access Layer, return-value tainting နဲ့ rate limiting အပါအဝင် end-to-end patterns တွေအတွက် [Data Security guide](https://nextjs.org/docs/app/guides/data-security#mutating-data) ကို ကြည့်ပါ။

Deletes လို ပျက်စီးစေနိုင်တဲ့ လုပ်ဆောင်ချက်တွေက ပိုပြင်းထန်တဲ့ ကိုင်တွယ်မှုတွေ — elevated session checks (သို့) re-authentication လိုမျိုး — လိုအပ်နိုင်ပြီး — အဲဒီ checks တွေ လွတ်သွားရင် ထင်ရှားတဲ့ failure တစ်ခု ဖြစ်သင့်ပါတယ်။

```ts filename="app/posts/actions.ts" highlight={6,7,8}
'use server'

import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  if (!(await canDelete(session.user, postId))) throw new Error('Forbidden')

  await db.post.delete({ where: { id: postId } })
}
```

Experimental [`authInterrupts`](/docs/nextjs/next-config-auth-interrupts) flag ကို enable လုပ်ထားရင် — `next/navigation` ကနေ [`unauthorized()`](/docs/nextjs/unauthorized) နဲ့ [`forbidden()`](/docs/nextjs/forbidden) တွေကို throw လုပ်နိုင်ပြီး — Next.js က သက်ဆိုင်ရာ `unauthorized.tsx` / `forbidden.tsx` UI segment ကို အလိုအလျောက် render လုပ်ပေးပါတယ်။

ဥပမာ — client တစ်ခုက ဘယ် item ပေါ်မှာ လုပ်ဆောင်ရမလဲဆိုတာကို တရားဝင် ပြောပြနိုင်ပေမယ့် — row ရဲ့ contents (သို့) ownership ကိုတော့ ထောက်ပံ့မပေးသင့်ပါဘူး။ Reference (ပုံမှန်အားဖြင့် ID တစ်ခု) နဲ့ user ရဲ့ အပြောင်းအလဲကို ပို့ပြီး — ကျန်တာတွေကို session ကို သုံးပြီး ယုံကြည်ရတဲ့ source ကနေ ပြန်ဖတ်ပါ။ Schema validation (zod လိုမျိုး) က input ရဲ့ _ပုံသဏ္ဍာန်_ ကိုပဲ စစ်ဆေးပါတယ်။ ကောင်းမွန်စွာ ဖွဲ့စည်းထားတဲ့ `Item` object တစ်ခုက — caller မပိုင်တဲ့ row တစ်ခုကို ရည်ညွှန်းနေနိုင်ပါသေးတယ်။

```ts filename="app/items/actions.ts"
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Unsafe: no auth, no ownership check. The whole item, including its id, comes
// from the client, so anyone who can POST here can mark any item complete.
export async function completeItemUnsafe(item: Item) {
  await db.item.update({ where: { id: item.id }, data: { completed: true } })
}

// Safe: take only the change, derive identity from the session, look up by ownership.
export async function completeItem(itemId: string) {
  const session = await auth()
  if (!session?.user) return

  const item = await db.item.findFirst({
    where: { id: itemId, ownerId: session.user.id },
  })
  if (!item) return

  await db.item.update({ where: { id: item.id }, data: { completed: true } })
}
```

## Cache update တစ်ခု ရွေးချယ်ခြင်း

Data mutate လုပ်ပြီးနောက် — on-demand revalidation က server cache, client router (သို့) နှစ်ခုလုံးကို update လုပ်ပါတယ်။ ဘာတွေ ပြောင်းဖို့ လိုလဲဆိုတာပေါ် မူတည်ပြီး ရွေးပါ:

- [`updateTag`](/docs/nextjs/update-tag): Tag တစ်ခုရဲ့ ချက်ချင်း expiration။ နောက် read (action ရဲ့ response နဲ့အတူ ပါလာတဲ့ route re-render အပါအဝင်) က fresh data ကို စောင့်ပါတယ်။ Action က **read-your-own-writes** လိုအပ်တဲ့အခါ — user က သူ့ရဲ့ အပြောင်းအလဲကို ချက်ချင်း မြင်ရအောင် — သုံးပါ။ Server Actions တွေမှာပဲ ရပါတယ်။
- [`revalidateTag`](/docs/nextjs/revalidate-tag): Cache-life profile ပါတဲ့ tag တစ်ခုရဲ့ stale-while-revalidate refresh။ နောက်ဆက်တွဲ reads တွေက stale value ကို ရပြီး — fresh fetch တစ်ခုက နောက်ခံမှာ ဖြစ်နေလို့ — action ရဲ့ ကိုယ်ပိုင် re-render က data အသစ်ကို မစောင့်ပါဘူး။
- [`revalidatePath`](/docs/nextjs/revalidate-path): URL path နဲ့ invalidate လုပ်ခြင်း။ Route တစ်ခုတည်းကိုပဲ သက်ရောက်ပြီး tagging က အလွန်အကျွံ ဖြစ်နေတဲ့အခါ သုံးပါ။
- [`refresh`](/docs/nextjs/refresh): Cached data တွေကို invalidate မလုပ်ဘဲ လက်ရှိ route ရဲ့ RSC Payload ကို ပြန် fetch လုပ်ခြင်း။ View က action ကနေ အခုနက ပြောင်းလိုက်တဲ့ cache ပြင်ပက state တစ်ခုပေါ် မှီခိုနေတဲ့အခါ သုံးပါ။

`updateTag`, `revalidatePath` (သို့) `refresh` တွေ run တဲ့အခါ — Next.js က လက်ရှိ route ကို server ဘက်မှာ ပြန် render လုပ်ပြီး — action ရဲ့ response ထဲမှာ အသစ်ပြန် render လုပ်ထားတဲ့ [RSC Payload](https://nextjs.org/docs/app/glossary#rsc-payload) တစ်ခု ထည့်ပေးလို့ — page က roundtrip တစ်ခုတည်းအတွင်းမှာ အပြောင်းအလဲကို ထင်ဟပ်စေပါတယ်။ Stale-while-revalidate profile ပါတဲ့ `revalidateTag` ကတော့ အဲဒီ ချက်ချင်း re-render ကို ရည်ရွယ်ချက်ရှိရှိ ကျော်သွားပါတယ်။

[`redirect`](/docs/nextjs/redirect) နဲ့ မတူဘဲ — ဒါတွေထဲက ဘယ်ဟာမှ throw မလုပ်တာမို့ — action တစ်ခုက ဒါတွေကို ခေါ်ပြီး caller ဆီ value တစ်ခုကို ဆက်ပြီး return လုပ်နိုင်ပါသေးတယ်။ နောက်ခံ model အကြောင်း [How revalidation works](/docs/nextjs/how-revalidation-works) မှာ ကြည့်ပါ။

## Configuration (ပြင်ဆင်သတ်မှတ်ချက်)

`next.config.js` ထဲက [`serverActions`](/docs/nextjs/next-config-server-actions) option က framework-level အပြုအမူကို ထိန်းချုပ်ပါတယ်:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb',
    },
  },
}
```

Closure encryption key အတွက် — deployment environment ထဲမှာ `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` ကို သတ်မှတ်ပါ။ Deployment-specific လမ်းညွှန်ချက်တွေအတွက် [Self-hosting: Server Functions encryption key](/docs/nextjs/self-hosting) ကို ကြည့်ပါ။

## Deployment ဆိုင်ရာ ထည့်သွင်းစဉ်းစားချက်များ

Server Action တစ်ခုစီကို သူ့ရဲ့ [action ID](#security) — build artifacts တွေရဲ့ အစိတ်အပိုင်းတစ်ခု — နဲ့ မှတ်သားပါတယ်။ Deployment အသစ်တွေက ပုံမှန်အားဖြင့် ID အသစ်တွေ ထုတ်ပေးပါတယ် (source မပြောင်းရင်တောင် Next.js က ရက် 14 တစ်ကြိမ်ထက် ပိုပြီး မကြာခဏ လှည့်မပေးပါဘူး) — ဒါကြောင့် အရင် build ကို ဆက်သုံးနေတဲ့ client တစ်ခုက မရှိတော့တဲ့ action ID တစ်ခုကို invoke လုပ်မိနိုင်ပါတယ်။ Error က "[Failed to find Server Action](https://nextjs.org/docs/messages/failed-to-find-server-action)" အနေနဲ့ ပေါ်လာပါတယ်။

အနှောင့်အယှက် နည်းအောင်:

- Active users တွေ mutation လုပ်နေချိန် ဖြစ်နိုင်တယ်ဆိုရင် — ရုတ်တရက် cutover တွေထက် rolling deployments တွေကို ဦးစားပေးပါ။
- Action references တွေ နေရာတိုင်းမှာ decrypt လုပ်လို့ရနေအောင် — `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` ကို instances တွေအနှံ့ stable ထားပါ။
- Refresh တစ်ခုက user ကို ပြန်ကောင်းစေနိုင်လို့ — error ကို hard failure အဖြစ် မဟုတ်ဘဲ UI ထဲမှာ retry path တစ်ခုအနေနဲ့ ပြသပါ။
