---
title: "Route Handlers (API)"
description: "route.ts နဲ့ GET/POST handler တွေ, Request/Response web APIs, dynamic route params, streaming responses — Route Handlers နဲ့ Server Actions ဘယ်အခါ သုံးမလဲ"
order: 6
source: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers"
status: translated
updated: 2026-09-01
---

## Route Handlers ဆိုတာ ဘာလဲ

**Route Handlers** ဆိုတာ — Web `Request` နဲ့ `Response` API တွေကို သုံးပြီး route တစ်ခုအတွက် custom request handler တွေ ဖန်တီးတဲ့ နည်းလမ်းပါ။ Pages Router ရဲ့ **API Routes** နဲ့ ညီမျှပြီး — `app` folder ထဲမှာပဲ ရှိတာမို့ API Routes နဲ့ Route Handlers ကို တွဲသုံးစရာ မလိုပါဘူး။ `app/api/route.ts` ဆိုရင် `/api` မှာ API endpoint တစ်ခု ဖြစ်လာပါတယ်။

## route.ts နဲ့ GET/POST Handler

Route handler ကို `route.ts` file ထဲမှာ — HTTP method နာမည်နဲ့ function ကို export လုပ်ပြီး သတ်မှတ်ပါတယ်:

```ts
// app/api/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello from Next.js!' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body }, { status: 201 })
}
```

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` စတဲ့ HTTP method တွေ အားလုံး ထောက်ပံ့ပေးပြီး — မထောက်ပံ့တဲ့ method နဲ့ ခေါ်ရင် Next.js က `405 Method Not Allowed` ပြန်ပို့ပါတယ်။ သတိထားရမှာက — `route.ts` နဲ့ `page.tsx` ကို **segment တစ်ခုတည်းမှာ တွဲမထားရပါဘူး** (conflict ဖြစ်ပါတယ်)။

## Request/Response Web APIs

Route Handlers က ပုံမှန် **Web API** တွေကို သုံးတာဖြစ်လို့ — `request.json()`, `request.headers`, `new Response()`, `Response.json()` စတာတွေကို standard အတိုင်း သုံးလို့ရပါတယ်။ ပိုပြီး အဆင်ပြေတဲ့ helper တွေလိုရင် `next/server` ကနေ `NextRequest` နဲ့ `NextResponse` တွေကို import လုပ်ပြီး — cookies, redirect စတဲ့ အဆင့်မြင့် case တွေမှာ သုံးနိုင်ပါတယ်။ မှတ်ထားရမှာက — server component ထဲကနေ `fetch('/api/...')` လို့ ခေါ်ရင် request က route handler ဆီ မရောက်နိုင်ပါဘူး (server-to-server မဟုတ်လို့) — ဒါကြောင့် server ထဲမှာ လိုအပ်တဲ့ logic ကို တိုက်ရိုက် ရေးတာ ပိုကောင်းပါတယ်။

## Dynamic Route Params

Route handler ထဲမှာလည်း dynamic segment တွေကို သုံးလို့ရပါတယ် — second argument ဖြစ်တဲ့ context ထဲက `params` ကနေ ဖတ်ပါတယ်:

```ts
// app/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUser(id)

  return Response.json({ user })
}
```

`params` က Promise ဖြစ်လို့ `await` လုပ်ရပါတယ် — [Dynamic Routes](/docs/nextjs/dynamic-routes) မှာ ရှင်းပြထားတဲ့ ပုံစံအတိုင်းပါပဲ။ Route handler ထဲမှာလည်း `generateStaticParams` ကို export လုပ်ရင် GET handler တွေကို build time မှာ static generate လုပ်လို့ရပါတယ်။

## Streaming Responses

Data အားလုံးကို တစ်ခါတည်း မပို့ဘဲ — **stream** လုပ်ပြီး အပိုင်းလိုက် ပို့ချင်ရင် `ReadableStream` ကို response အနေနဲ့ ပြန်ပို့လို့ရပါတယ်:

```ts
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('Hello '))
      controller.enqueue(encoder.encode('World'))
      controller.close()
    },
  })

  return new Response(stream)
}
```

ဒီလိုမျိုး — CSV export, AI response, event stream (SSE) စတဲ့ — client က ရောက်သလောက် အပိုင်းလိုက် လက်ခံနိုင်တဲ့ response တွေအတွက် သုံးပါတယ်။

## Route Handlers နဲ့ Server Actions — ဘယ်အခါ ဘာသုံးမလဲ

Route Handlers က **external** ကနေ လာတဲ့ request တွေအတွက် — third-party client, mobile app, webhook စတာတွေ သုံးတဲ့ API endpoint ဖြစ်ပါတယ်။ ဒါပေမယ့် app ထဲက form submit, button click လို — **mutation** (data ပြောင်းလဲမှု) တွေအတွက်တော့ **Server Actions** ကို သုံးတာ ပိုကောင်းပါတယ်။ Server Actions က `"use server"` နဲ့ ကြေညာထားတဲ့ server function ဖြစ်လို့ — client ကနေ တိုက်ရိုက် ခေါ်လို့ရပြီး form handling, revalidation စတာတွေနဲ့ ပေါင်းစပ်ပါတယ်။ အကြမ်းဖျင်း ရွေးနည်း — external API / webhook လို့ ပြင်ပက သုံးမယ်ဆိုရင် Route Handler၊ app ကိုယ်တိုင် သုံးမယ့် mutation ဆိုရင် Server Action ပါ။

## နောက်တစ်ဆင့်တွေ

- [Data Fetching](/docs/nextjs/data-fetching) — server component တွေမှာ data ယူနည်း
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — dynamic param တွေ အသေးစိတ်
- [Linking & Navigation](/docs/nextjs/linking) — client ကနေ navigation လုပ်နည်း
