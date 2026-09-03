---
title: "Output Types (output type များ)"
description: "adapter တွေကို ထုတ်ပေးတဲ့ build output types အကုန် — pages, appPages, prerenders, staticFiles, middleware စသည်"
order: 255
source: "https://nextjs.org/docs/app/api-reference/adapters/output-types"
status: translated
updated: 2026-09-03
---

`outputs` object မှာ build output type တစ်ခုချင်းစီအတွက် arrays များ ပါဝင်ပါတယ်:

- `outputs.pages`: `pages/` directory ထဲက React pages (React ဖြင့် ရေးသားထားသော စာမျက်နှာများ)
- `outputs.pagesApi`: `pages/api/` ထဲက API routes များ
- `outputs.appPages`: `app/` directory ထဲက React pages များ
- `outputs.appRoutes`: `app/` ထဲက API နဲ့ metadata routes များ
- `outputs.prerenders`: ISR-enabled routes (ISR ဖွင့်ထားသော routes) များနဲ့ static prerenders များ
- `outputs.staticFiles`: Static assets များနဲ့ auto-static ဖြင့် optimize လုပ်ထားသော pages များ
- `outputs.middleware`: Middleware function (ရှိပါက)

> **မှတ်ချက်:** `config.output` ကို `'export'` လို့ သတ်မှတ်ထားတဲ့အခါ — `outputs.staticFiles` တစ်ခုတည်းသာ populate (ဖြည့်တင်) လုပ်ခံရပါတယ်။ Application တစ်ခုလုံးကို static files အဖြစ် export လုပ်လိုက်လို့ — ကျန် arrays တွေအားလုံး (`pages`, `appPages`, `pagesApi`, `appRoutes`, `prerenders`) က empty ဖြစ်နေပါလိမ့်မယ်။

`runtime: 'edge'` သတ်မှတ်ထားတဲ့ route output တိုင်းအတွက် — `edgeRuntime` ပါဝင်ပြီး — သင့်ရဲ့ edge runtime ထဲမှာ အဲဒီ output ကို invoke (ခေါ်ယူ run) လုပ်ဖို့ လိုအပ်တဲ့ canonical entry metadata (တရားဝင် သတ်မှတ်ထားသော entry ၏ metadata) ကို သယ်ဆောင်ပေးပါတယ်။ Edge Runtime က [deprecated (အသုံးမပြုတော့ပါ)](https://nextjs.org/docs/messages/edge-runtime-deprecated) ဖြစ်ကြောင်း သတိပြုပါ။

## Pages (`outputs.pages`) (Pages Router မှ React pages)

`pages/` directory ထဲက React pages များ:

```typescript
{
  type: 'PAGES'
  id: string           // Route identifier
  filePath: string     // Path to the built file
  pathname: string     // URL pathname
  sourcePage: string   // Original source file path in pages/ directory
  runtime: 'nodejs' | 'edge'
  assets: Record<string, string>  // Traced dependencies (key: relative path from repo root, value: absolute path)
  assetsHashes: Record<string, string>  // Content hashes of each `assets` entry (key: same as `assets`, value: content hash)
  wasmAssets?: Record<string, string>  // Bundled wasm files (key: name, value: absolute path)
  edgeRuntime?: {
    modulePath: string    // Absolute path to the module registered in the edge runtime
    entryKey: string      // Canonical key used by the edge entry registry
    handlerExport: string // Export name to invoke, currently 'handler'
  }
  config: {
    maxDuration?: number  // Maximum duration of the route in seconds
    preferredRegion?: string | string[]  // Preferred deployment region (deprecated)
    env?: Record<string, string>  // Environment variables (edge runtime only)
  }
}
```

## API Routes (`outputs.pagesApi`) (`pages/api/` မှ API routes)

`pages/api/` directory ထဲက API routes များ:

```typescript
{
  type: 'PAGES_API'
  id: string           // Route identifier
  filePath: string     // Path to the built file
  pathname: string     // URL pathname
  sourcePage: string   // Original relative source file path
  runtime: 'nodejs' | 'edge'
  assets: Record<string, string>  // Traced dependencies (key: relative path from repo root, value: absolute path)
  assetsHashes: Record<string, string>  // Content hashes of each `assets` entry (key: same as `assets`, value: content hash)
  wasmAssets?: Record<string, string>  // Bundled wasm files (key: name, value: absolute path)
  edgeRuntime?: {
    modulePath: string    // Absolute path to the module registered in the edge runtime
    entryKey: string      // Canonical key used by the edge entry registry
    handlerExport: string // Export name to invoke, currently 'handler'
  }
  config: {
    maxDuration?: number  // Maximum duration of the route in seconds
    preferredRegion?: string | string[]  // Preferred deployment region (deprecated)
    env?: Record<string, string>  // Environment variables (edge runtime only)
  }
}
```

## App Pages (`outputs.appPages`) (`app/` directory မှ React pages)

`app/` directory ထဲက React pages များ:

```typescript
{
  type: 'APP_PAGE'
  id: string           // Route identifier
  filePath: string     // Path to the built file
  pathname: string     // URL pathname. Includes .rsc suffix for RSC routes
  sourcePage: string   // Original relative source file path
  runtime: 'nodejs' | 'edge' // Runtime the route is built for
  assets: Record<string, string>  // Traced dependencies (key: relative path from repo root, value: absolute path)
  assetsHashes: Record<string, string>  // Content hashes of each `assets` entry (key: same as `assets`, value: content hash)
  wasmAssets?: Record<string, string>  // Bundled wasm files (key: name, value: absolute path)
  edgeRuntime?: {
    modulePath: string    // Absolute path to the module registered in the edge runtime
    entryKey: string      // Canonical key used by the edge entry registry
    handlerExport: string // Export name to invoke, currently 'handler'
  }
  config: {
    maxDuration?: number  // Maximum duration of the route in seconds
    preferredRegion?: string | string[]  // Preferred deployment region (deprecated)
    env?: Record<string, string>  // Environment variables (edge runtime only)
  }
}
```

## App Routes (`outputs.appRoutes`) (`app/` directory မှ API နဲ့ metadata routes)

`app/` directory ထဲက API နဲ့ metadata routes များ:

```typescript
{
  type: 'APP_ROUTE'
  id: string           // Route identifier
  filePath: string     // Path to the built file
  pathname: string     // URL pathname
  sourcePage: string   // Original relative source file path
  runtime: 'nodejs' | 'edge' // Runtime the route is built for
  assets: Record<string, string>  // Traced dependencies (key: relative path from repo root, value: absolute path)
  assetsHashes: Record<string, string>  // Content hashes of each `assets` entry (key: same as `assets`, value: content hash)
  wasmAssets?: Record<string, string>  // Bundled wasm files (key: name, value: absolute path)
  edgeRuntime?: {
    modulePath: string    // Absolute path to the module registered in the edge runtime
    entryKey: string      // Canonical key used by the edge entry registry
    handlerExport: string // Export name to invoke, currently 'handler'
  }
  config: {
    maxDuration?: number  // Maximum duration of the route in seconds
    preferredRegion?: string | string[]  // Preferred deployment region (deprecated)
    env?: Record<string, string>  // Environment variables (edge runtime only)
  }
}
```

## Prerenders (`outputs.prerenders`) (ISR-enabled routes များနဲ့ static prerenders)

ISR-enabled routes များနဲ့ static prerenders များ:

```typescript
{
  type: 'PRERENDER'
  id: string           // Route identifier
  pathname: string     // URL pathname
  parentOutputId: string  // ID of the source page/route
  groupId: number        // Revalidation group identifier (prerenders with same groupId revalidate together)
  route: string           // Source route matcher aligned with the filesystem route, keeping dynamic segments (e.g. /blog/[slug] for the prerendered path /blog/first)
  routeType?: 'route' | 'fallback' | 'shell' | 'page'  // Kind of canonical response
  response?: 'empty' | 'initial' | 'complete'  // Completeness before request-time work
  compute?: 'blocking' | 'resuming' | 'static'  // Request-time compute needed for the completed response
  htmlSize?: number       // Byte size of the prerendered App Router HTML shell
  pprChain?: {
    headers: Record<string, string>  // PPR chain headers (e.g., 'next-resume': '1')
  }
  parentFallbackMode?: false | null | string  // false: no additional paths (fallback: false), null: blocking render, string: path to HTML fallback
  fallback?: {
    filePath: string | undefined  // Path to the fallback file (HTML, JSON, or RSC)
    initialStatus?: number  // Initial status code
    initialHeaders?: Record<string, string | string[]>  // Initial headers
    initialExpiration?: number  // Initial expiration time in seconds
    initialRevalidate?: number | false  // Initial revalidate time in seconds, or false for fully static
    postponedState: string | undefined  // Serialized PPR state used for resuming rendering
  }
  config: {
    allowQuery?: string[]     // Allowed query parameters considered for the cache key
    allowHeader?: string[]    // Allowed headers for ISR
    bypassFor?: RouteHas[]    // Cache bypass conditions
    renderingMode?: 'STATIC' | 'PARTIALLY_STATIC'  // STATIC: fully static, PARTIALLY_STATIC: PPR-enabled
    partialFallback?: boolean  // Serves a partial fallback shell that should be upgraded to a full route in the background
    bypassToken?: string      // Generated token that signals the prerender cache should be bypassed
  }
}
```

### Prerender classification (prerender များကို အမျိုးအစား ခွဲခြားခြင်း)

`routeType`, `response` နဲ့ `compute` တို့ကို prerender group တစ်ခုရဲ့ primary response (အဓိက တုံ့ပြန်မှု) ပေါ်မှာ အတူတကွ ထုတ်ပေးပါတယ်။ ဆက်စပ်နေတဲ့ RSC, data နဲ့ segment outputs တွေမှာတော့ ဒီ fields တွေ ပါဝင်မှာ မဟုတ်ပါဘူး။ `fallback: false` သတ်မှတ်ထားတဲ့ Pages Router templates တွေကလည်း — အဲဒီ templates တွေက မကိုက်ညီတဲ့ (unmatched) URLs တွေအတွက် ဘယ်တော့မှ serve လုပ်ရမှာ မဟုတ်လို့ — ဒီ fields တွေကို ချန်လှပ်ထားပါတယ်။

`routeType` က canonical response (တရားဝင် တုံ့ပြန်မှု) ရဲ့ အမျိုးအစားကို ဖော်ပြပါတယ်:

- `route`: Route Handler လိုမျိုး UI မဟုတ်တဲ့ route
- `page`: URL မှာ ပျောက်နေတဲ့ prerenderable parameters မရှိတဲ့ page
- `shell`: သူ့ရဲ့ URL အမျိုးအစား (class) အတွက် အသေးစိတ်အကျဆုံး ပြန်လည် အသုံးပြုနိုင်တဲ့ (reusable) page shell
- `fallback`: prerenderable parameters တွေ ထပ်ဖြည့်ခြင်းဖြင့် အထူးပြု သတ်မှတ်လို့ရတဲ့ (specialize) reusable page response

`response` က request-time အလုပ်မစတင်မီ — response ရဲ့ ပြည့်စုံမှု အတိုင်းအတာကို ဖော်ပြပါတယ်:

- `empty`: ကနဦး (initial) page response ကို serve လုပ်လို့ မရပါဘူး
- `initial`: ကနဦး response တစ်ခုကို serve လုပ်လို့ ရပေမယ့် — အဲဒါက ပြီးပြည့်စုံတဲ့ page UI မဟုတ်ပါဘူး။ လက်တွေ့မှာ ဒါက တစ်စိတ်တစ်ပိုင်း prerender လုပ်လို့ရတဲ့ (partially prerenderable) UI routes တွေမှာပဲ သက်ရောက်ပါတယ်
- `complete`: response က ပြည့်စုံနေပါပြီ။ ဒါမှာ — `204` Route Handler response လိုမျိုး — zero-byte response body တွေလည်း ပါဝင်နိုင်ပါတယ်

`compute` က ပြီးပြည့်စုံတဲ့ response ကို serve လုပ်ဖို့ လိုအပ်တဲ့ request-time compute (request အချိန်တွင် တွက်ချက်ရမှု) ကို ဖော်ပြပါတယ်:

- `blocking`: request-time compute မစတင်ခင် ကနဦး response ကို ပို့လို့ မရပါဘူး; စတင်လိုက်သည်နဲ့ — compute ဆက်လုပ်နေတုန်း — response ကို stream လုပ်နိုင်ပါတယ်
- `resuming`: server ပေါ်မှာ postponed အလုပ်တွေ resume (ပြန်လည် စတင်) လုပ်နေစဉ်မှာ — ကနဦး response တစ်ခုကို serve လုပ်ပါတယ်
- `static`: request တစ်ခုချင်းစီအတွက် server compute မလိုအပ်ပါဘူး

`htmlSize` က primary App Router HTML output မှာပဲ ပါဝင်ပါတယ်။ `0` တန်ဖိုးဆိုရင် — HTML shell က empty ဖြစ်နေတယ်လို့ ဆိုလိုပါတယ်။ Pages Router prerenders တွေ, Route Handlers တွေနဲ့ ဆက်စပ်တဲ့ RSC, data နဲ့ segment outputs တွေမှာတော့ ဒါကို ချန်လှပ်ထားပါတယ်။

## Static Files (`outputs.staticFiles`) (static assets များနဲ့ auto-static optimized pages)

Static assets များနဲ့ auto-static ဖြင့် optimize လုပ်ထားသော pages များ:

```typescript
{
  type: 'STATIC_FILE'
  id: string // Unique identifier for this static file output
  filePath: string // Absolute filesystem path to the built file
  pathname: string // The routable URL pathname for this static file
  immutableHash: string | undefined // Content hash when the filename contains a hash, indicating the file is immutable
}
```

`immutableHash` အကြောင်း ပိုမို သိရှိရန် — [Supporting immutable static assets](/docs/nextjs/adapter-static-assets) ကို ကြည့်ပါ။

## Middleware (`outputs.middleware`) (middleware function ရှိပါက)

`middleware.ts` (`.js`/`.ts`) (သို့) `proxy.ts` (`.js`/`.ts`) function (ရှိပါက):

```typescript
{
  type: 'MIDDLEWARE'
  id: string           // Route identifier
  filePath: string     // Path to the built file
  pathname: string      // Always '/_middleware'
  sourcePage: string    // Always 'middleware'
  runtime: 'nodejs' | 'edge' // Runtime the route is built for
  assets: Record<string, string>  // Traced dependencies (key: relative path from repo root, value: absolute path)
  assetsHashes: Record<string, string>  // Content hashes of each `assets` entry (key: same as `assets`, value: content hash)
  wasmAssets?: Record<string, string>  // Bundled wasm files (key: name, value: absolute path)
  edgeRuntime?: {
    modulePath: string    // Absolute path to the module registered in the edge runtime
    entryKey: string      // Canonical key used by the edge entry registry
    handlerExport: string // Export name to invoke, currently 'handler'
  }
  config: {
    maxDuration?: number  // Maximum duration of the route in seconds
    preferredRegion?: string | string[]  // Preferred deployment region (deprecated)
    env?: Record<string, string>  // Environment variables (edge runtime only)
    matchers?: Array<{
      source: string  // Source pattern
      sourceRegex: string  // Compiled regex for matching requests
      has: RouteHas[] | undefined  // Positive matching conditions
      missing: RouteHas[] | undefined  // Negative matching conditions
    }>
  }
}
```
