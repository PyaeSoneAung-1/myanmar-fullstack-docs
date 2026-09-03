---
title: "OpenTelemetry နဲ့ Instrumentation ပြင်ဆင်ခြင်း"
description: "သင့် Next.js app ကို OpenTelemetry နဲ့ instrument (စောင့်ကြည့်တိုင်းတာမှု ပြုလုပ်ခြင်း) လုပ်နည်း — @vercel/otel သုံးခြင်း, manual OpenTelemetry configuration, testing, deployment (Vercel နဲ့ self-hosting), custom spans, Next.js ရဲ့ default spans တွေအကြောင်း အပြည့်အစုံ"
order: 134
source: "https://nextjs.org/docs/app/guides/open-telemetry"
status: translated
updated: 2026-09-03
---

Observability (စောင့်ကြည့်လေ့လာနိုင်မှု) က သင့် Next.js app ရဲ့ အပြုအမူ နဲ့ performance တွေကို နားလည်ပြီး optimize လုပ်ဖို့ အရေးပါပါတယ်။

Applications တွေ ပိုရှုပ်ထွေးလာတာနဲ့အမျှ — ဖြစ်ပေါ်လာနိုင်တဲ့ ပြဿနာတွေကို ဖော်ထုတ် စစ်ဆေးဖို့ကလည်း ပိုခက်ခဲလာပါတယ်။ Logging နဲ့ metrics လို observability tools တွေကို အသုံးချခြင်းဖြင့် — developer တွေက သူတို့ရဲ့ application ရဲ့ အပြုအမူအကြောင်း ထိုးထွင်းသိမြင်မှုတွေ ရရှိနိုင်ပြီး — optimize လုပ်ရမယ့် နေရာတွေကိုလည်း ဖော်ထုတ်နိုင်ပါတယ်။ Observability နဲ့ဆိုရင် — developer တွေက ပြဿနာတွေ ကြီးထွားမလာခင် ကြိုတင် ကိုင်တွယ်နိုင်ပြီး — user experience ပိုကောင်းအောင်လည်း ဖန်တီးပေးနိုင်ပါတယ်။ ဒါကြောင့် — performance မြှင့်တင်ဖို့, resources တွေ optimize လုပ်ဖို့ နဲ့ user experience မြှင့်တင်ဖို့အတွက် သင့် Next.js applications တွေမှာ observability သုံးဖို့ အခိုင်အမာ အကြံပြုပါတယ်။

သင့် apps တွေကို instrument လုပ်ဖို့ OpenTelemetry သုံးဖို့ အကြံပြုပါတယ်။ ဒါက platform-agnostic (platform မရွေး အလုပ်လုပ်တဲ့) instrument လုပ်နည်းတစ်ခုဖြစ်ပြီး — code ကို မပြောင်းဘဲ သင့် observability provider ကို လဲလှယ်နိုင်ပါတယ်။ OpenTelemetry အကြောင်း နဲ့ အလုပ်လုပ်ပုံ ပိုလေ့လာဖို့ — [Official OpenTelemetry docs](https://opentelemetry.io/docs/) ကို ဖတ်ပါ။

ဒီ documentation ထဲမှာ _Span_, _Trace_ (သို့) _Exporter_ လို ဝေါဟာရတွေကို တစ်လျှောက်လုံး သုံးထားပြီး — အားလုံးကို [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) ထဲမှာ တွေ့နိုင်ပါတယ်။

Next.js က OpenTelemetry instrumentation ကို out of the box (ဘာမှ ထပ်မလုပ်ရဘဲ) ထောက်ပံ့ပါတယ် — ဆိုလိုတာက Next.js ကိုယ်တိုင်ကို ကျွန်ုပ်တို့ ကြိုတင် instrument လုပ်ထားပြီးသားပါ။

## စတင်ခြင်း (Getting Started)

OpenTelemetry က extensible (ချဲ့ထွင်နိုင်တဲ့) ပေမယ့် — မှန်ကန်စွာ setup လုပ်ရတာက အတော်လေး ရှည်လျားနိုင်ပါတယ်။ ဒါကြောင့်ပဲ — မြန်မြန်ဆန်ဆန် စတင်နိုင်ဖို့ `@vercel/otel` ဆိုတဲ့ package တစ်ခုကို ကျွန်ုပ်တို့ ပြင်ဆင်ပေးထားပါတယ်။

### `@vercel/otel` ကို အသုံးပြုခြင်း

စတင်ဖို့ — အောက်ပါ packages တွေကို install လုပ်ပါ:

```bash package="pnpm"
pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash package="npm"
npm install @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash package="yarn"
yarn add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash package="bun"
bun add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

ပြီးရင် — သင့် project ရဲ့ **root directory** (သို့) `src` folder သုံးနေတယ်ဆိုရင် အဲဒီထဲမှာ — custom [`instrumentation.ts`](/docs/nextjs/instrumentation) (သို့) `.js` file တစ်ခု ဖန်တီးပါ:

```ts filename="your-project/instrumentation.ts" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

```js filename="your-project/instrumentation.js" switcher
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

နောက်ထပ် configuration options တွေအတွက် — [`@vercel/otel` documentation](https://www.npmjs.com/package/@vercel/otel) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:**
>
> - `instrumentation` file က သင့် project ရဲ့ root မှာ ရှိရမှာ ဖြစ်ပြီး — `app` (သို့) `pages` directory ထဲမှာတော့ မထည့်ရပါဘူး။ `src` folder သုံးနေတယ်ဆိုရင် — `pages` နဲ့ `app` တွေနဲ့အတူ `src` ထဲမှာ file ကို ထားပါ။
> - [`pageExtensions` config option](https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions) ကို သုံးပြီး suffix တစ်ခု ထည့်ထားတယ်ဆိုရင် — `instrumentation` filename ကိုပါ လိုက်ပြောင်းဖို့ လိုပါလိမ့်မယ်။
> - သုံးလို့ရတဲ့ အခြေခံ [with-opentelemetry](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry) example တစ်ခုကို ကျွန်ုပ်တို့ ဖန်တီးထားပါတယ်။

### OpenTelemetry ကို ကိုယ်တိုင် သတ်မှတ်ခြင်း (Manual Configuration)

`@vercel/otel` package က configuration options အများအပြား ပေးထားပြီး — အသုံးများတဲ့ use cases အများစုကို ဖြည့်ဆည်းပေးနိုင်ပါတယ်။ ဒါပေမယ့် — သင့်လိုအပ်ချက်နဲ့ မကိုက်ညီဘူးဆိုရင် OpenTelemetry ကို ကိုယ်တိုင် configure လုပ်နိုင်ပါတယ်။

ပထမဆုံး — OpenTelemetry packages တွေကို install လုပ်ဖို့ လိုပါတယ်:

```bash package="pnpm"
pnpm add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash package="npm"
npm install @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash package="yarn"
yarn add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash package="bun"
bun add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

အခု သင့် `instrumentation.ts` ထဲမှာ `NodeSDK` ကို initialize လုပ်နိုင်ပါပြီ။ `@vercel/otel` နဲ့ မတူဘဲ — `NodeSDK` က edge runtime နဲ့ လိုက်ဖက်မှု မရှိလို့ — `process.env.NEXT_RUNTIME === 'nodejs'` ဖြစ်တဲ့အခါမှပဲ import လုပ်ကြောင်း သေချာရပါမယ်။ Node သုံးတဲ့အခါမှပဲ conditional import လုပ်မယ့် `instrumentation.node.ts` ဆိုတဲ့ file အသစ်တစ်ခု ဖန်တီးဖို့ အကြံပြုပါတယ်:

```ts filename="instrumentation.ts" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.ts')
  }
}
```

```js filename="instrumentation.js" switcher
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.js')
  }
}
```

```ts filename="instrumentation.node.ts" switcher
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

```js filename="instrumentation.node.js" switcher
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

ဒီလိုလုပ်တာက `@vercel/otel` သုံးတာနဲ့ ညီမျှပါတယ် — ဒါပေမယ့် `@vercel/otel` မှာ မပါဝင်တဲ့ features တစ်ချို့ကို ပြင်ဆင် (modify) ပြီး ချဲ့ထွင်နိုင်ပါတယ်။ Edge runtime support မဖြစ်မနေ လိုအပ်တယ်ဆိုရင်တော့ — `@vercel/otel` ကိုပဲ သုံးရပါလိမ့်မယ်။

## သင့် instrumentation ကို စမ်းသပ်ခြင်း (Testing Your Instrumentation)

OpenTelemetry traces တွေကို local မှာ စမ်းသပ်ဖို့ — compatible backend တစ်ခုပါတဲ့ OpenTelemetry collector တစ်ခု လိုပါတယ်။ ကျွန်ုပ်တို့ရဲ့ [OpenTelemetry dev environment](https://github.com/vercel/opentelemetry-collector-dev-setup) ကို သုံးဖို့ အကြံပြုပါတယ်။

အရာအားလုံး ကောင်းကောင်း အလုပ်လုပ်ရင် — `GET /requested/pathname` လို့ label တပ်ထားတဲ့ root server span ကို မြင်ရပါလိမ့်မယ်။ အဲဒီ trace ထဲက တခြား spans တွေ အားလုံးက သူ့အောက်မှာ nested (အဆင့်ဆင့် ထည့်သွင်းထား) ဖြစ်နေပါလိမ့်မယ်။

Next.js က default အနေနဲ့ ထုတ်လွှတ်တာထက် spans တွေ ပိုပြီး trace လုပ်ပါတယ်။ Spans တွေ ပိုမြင်ချင်ရင် — `NEXT_OTEL_VERBOSE=1` လို့ သတ်မှတ်ရပါမယ်။

## Deployment (ဖြန့်ကျက်ခြင်း)

### OpenTelemetry Collector သုံးခြင်း

OpenTelemetry Collector နဲ့ deploy လုပ်တဲ့အခါ — `@vercel/otel` ကို သုံးနိုင်ပါတယ်။ ဒါက Vercel ပေါ်မှာရော self-hosted လုပ်တဲ့အခါမှာပါ အလုပ်လုပ်ပါတယ်။

#### Vercel ပေါ်မှာ Deploy လုပ်ခြင်း

OpenTelemetry က Vercel ပေါ်မှာ out of the box အလုပ်လုပ်ကြောင်း ကျွန်ုပ်တို့ သေချာလုပ်ထားပါတယ်။

သင့် project ကို observability provider တစ်ခုနဲ့ ချိတ်ဆက်ဖို့ — [Vercel documentation](https://vercel.com/docs/tracing/instrumentation) ကို လိုက်နာပါ။

#### Self-hosting (ကိုယ်တိုင် hosting)

အခြား platforms တွေပေါ်မှာ deploy လုပ်တာကလည်း ရိုးရှင်းပါတယ်။ သင့် Next.js app ကနေ telemetry data တွေကို လက်ခံပြီး လုပ်ဆောင်ဖို့ — ကိုယ်ပိုင် OpenTelemetry Collector တစ်ခုကို စတင်ဖို့ လိုပါလိမ့်မယ်။

ဒါကိုလုပ်ဖို့ — collector ကို setup လုပ်ပြီး သင့် Next.js app ကနေ data တွေ လက်ခံဖို့ configure လုပ်နည်းကို ပြသပေးမယ့် [OpenTelemetry Collector Getting Started guide](https://opentelemetry.io/docs/collector/getting-started/) ကို လိုက်နာပါ။

Collector ကို run လို့ရပြီဆိုရင် — သင့် Next.js app ကို သင်ရွေးချယ်ထားတဲ့ platform ရဲ့ deployment guides တွေအတိုင်း deploy လုပ်နိုင်ပါပြီ။

### Custom Exporters (စိတ်ကြိုက် exporter များ)

OpenTelemetry Collector မဖြစ်မနေ လိုအပ်တာ မဟုတ်ပါဘူး။ [`@vercel/otel`](#using-vercelotel) (သို့) [manual OpenTelemetry configuration](#manual-opentelemetry-configuration) တွေနဲ့ — custom OpenTelemetry exporter တစ်ခုကို သုံးနိုင်ပါတယ်။

## Custom Spans (ကိုယ်ပိုင် span များ)

[OpenTelemetry APIs](https://opentelemetry.io/docs/instrumentation/js/instrumentation) တွေနဲ့ custom span တစ်ခု ထည့်နိုင်ပါတယ်။

```bash package="pnpm"
pnpm add @opentelemetry/api
```

```bash package="npm"
npm install @opentelemetry/api
```

```bash package="yarn"
yarn add @opentelemetry/api
```

```bash package="bun"
bun add @opentelemetry/api
```

အောက်က ဥပမာက — GitHub stars တွေကို fetch လုပ်ပြီး fetch request ရဲ့ ရလဒ်ကို ခြေရာခံဖို့ custom `fetchGithubStars` span တစ်ခု ထည့်တဲ့ function တစ်ခုကို ပြသပါတယ်:

```ts
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

`register` function က environment အသစ်တစ်ခုမှာ သင့် code run မလုပ်ခင် ဦးစွာ execute လုပ်ပါလိမ့်မယ်။ အဲဒီမှာ spans အသစ်တွေ စတင်ဖန်တီးနိုင်ပြီး — သူတို့ကို exported trace ထဲမှာ မှန်ကန်စွာ ထည့်သွင်းပေးပါလိမ့်မယ်။

## Next.js ထဲက Default Spans

Next.js က သင့် application ရဲ့ performance အကြောင်း အသုံးဝင်တဲ့ ထိုးထွင်းသိမြင်မှုတွေ ပေးဖို့ — spans အများအပြားကို သင့်အတွက် အလိုအလျောက် instrument လုပ်ပေးပါတယ်။

Spans တွေပေါ်က Attributes တွေက [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/) တွေကို လိုက်နာပါတယ်။ `next` namespace အောက်မှာ custom attributes တစ်ချို့လည်း ထပ်ထည့်ပါတယ်:

- `next.span_name` — span name ကို ထပ်ပွားထားတာပါ
- `next.span_type` — span type တစ်ခုစီမှာ unique identifier (ထူးခြားတဲ့ သတ်မှတ်ကိန်း) တစ်ခုစီ ရှိပါတယ်
- `next.route` — Request ရဲ့ route pattern (ဥပမာ — `/[param]/user`)
- `next.rsc` (true/false) — Request က RSC request (prefetch လိုမျိုး) ဟုတ်မဟုတ်
- `next.page`
  - ဒါက app router က သုံးတဲ့ internal value တစ်ခုပါ
  - `page.ts`, `layout.ts`, `loading.ts` စတဲ့ special file တစ်ခုဆီကို ဦးတည်တဲ့ route တစ်ခုလို့ စဉ်းစားနိုင်ပါတယ်
  - `next.route` နဲ့ တွဲမှသာ unique identifier အဖြစ် သုံးလို့ရပါတယ် — `/layout` က `/(groupA)/layout.ts` ရော `/(groupB)/layout.ts` ရော နှစ်ခုလုံးကို ခွဲခြားဖို့ သုံးနိုင်လို့ပါ

### `[http.method] [next.route]`

- `next.span_type`: `BaseServer.handleRequest`

ဒီ span က သင့် Next.js application ဆီ ဝင်လာတဲ့ request တစ်ခုစီအတွက် root span ကို ကိုယ်စားပြုပါတယ်။ Request ရဲ့ HTTP method, route, target နဲ့ status code တွေကို ခြေရာခံပါတယ်။

Attributes:

- [Common HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
  - `http.status_code`
- [Server HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-server-semantic-conventions)
  - `http.route`
  - `http.target`
- `next.span_name`
- `next.span_type`
- `next.route`

### `render route (app) [next.route]`

- `next.span_type`: `AppRender.getBodyResult`

ဒီ span က app router ထဲမှာ route တစ်ခုကို render လုပ်တဲ့ process ကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `fetch [http.method] [http.url]`

- `next.span_type`: `AppRender.fetch`

ဒီ span က သင့် code ထဲမှာ execute လုပ်တဲ့ fetch request ကို ကိုယ်စားပြုပါတယ်။

Attributes:

- [Common HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
- [Client HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-client)
  - `http.url`
  - `net.peer.name`
  - `net.peer.port` (သတ်မှတ်ထားမှသာ)
- `next.span_name`
- `next.span_type`

ဒီ span ကို သင့် environment ထဲမှာ `NEXT_OTEL_FETCH_DISABLED=1` လို့ သတ်မှတ်ခြင်းဖြင့် ပိတ်နိုင်ပါတယ်။ Custom fetch instrumentation library တစ်ခု သုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

### `executing api route (app) [next.route]`

- `next.span_type`: `AppRouteRouteHandlers.runHandler`

ဒီ span က app router ထဲမှာ API Route Handler တစ်ခု execute လုပ်တာကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `getServerSideProps [next.route]`

- `next.span_type`: `Render.getServerSideProps`

ဒီ span က route တစ်ခုသတ်မှတ်ချက်အတွက် `getServerSideProps` execute လုပ်တာကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `getStaticProps [next.route]`

- `next.span_type`: `Render.getStaticProps`

ဒီ span က route တစ်ခုသတ်မှတ်ချက်အတွက် `getStaticProps` execute လုပ်တာကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `render route (pages) [next.route]`

- `next.span_type`: `Render.renderDocument`

ဒီ span က route တစ်ခုသတ်မှတ်ချက်အတွက် document ကို render လုပ်တဲ့ process ကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `generateMetadata [next.page]`

- `next.span_type`: `ResolveMetadata.generateMetadata`

ဒီ span က page တစ်ခုသတ်မှတ်ချက်အတွက် metadata generate လုပ်တဲ့ process ကို ကိုယ်စားပြုပါတယ် (route တစ်ခုတည်းမှာ ဒီ span တွေ အများအပြား ရှိနိုင်ပါတယ်)။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.page`

### `resolve page components`

- `next.span_type`: `NextNodeServer.findPageComponents`

ဒီ span က page တစ်ခုသတ်မှတ်ချက်အတွက် page components တွေကို resolve လုပ်တဲ့ process ကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.route`

### `resolve segment modules`

- `next.span_type`: `NextNodeServer.getLayoutOrPageModule`

ဒီ span က layout (သို့) page တစ်ခုအတွက် code modules တွေ load လုပ်တာကို ကိုယ်စားပြုပါတယ်။

Attributes:

- `next.span_name`
- `next.span_type`
- `next.segment`

### `start response`

- `next.span_type`: `NextNodeServer.startResponse`

ဒီ zero-length span က response ထဲက ပထမဆုံး byte ပို့လိုက်တဲ့ အချိန်ကို ကိုယ်စားပြုပါတယ်။
