---
title: "Deploying"
description: "Next.js application ကို Node.js server, Docker container, static export (သို့) adapters တွေနဲ့ platform အမျိုးမျိုးမှာ ဘယ်လို deploy လုပ်မလဲ"
order: 12
source: "https://nextjs.org/docs/app/getting-started/deploying"
status: translated
updated: 2026-09-01
---

Next.js ကို Node.js server, Docker container, static export အဖြစ် (သို့) platform အမျိုးမျိုးမှာ run လုပ်ဖို့ adapters တွေနဲ့ လိုက်လျောညီထွေ ပြောင်းလဲပြီး deploy လုပ်နိုင်ပါတယ်။

| Deployment Option                | Feature Support                                                     |
| -------------------------------- | ------------------------------------------------------------------- |
| [Node.js server](#nodejs-server) | All                                                                 |
| [Docker container](#docker)      | All                                                                 |
| [Static export](#static-export)  | Limited                                                             |
| [Adapters](#adapters)            | Varies ([verified](#verified-adapters) adapters တွေက test suite ကို run လုပ်ပါတယ်) |

## Node.js server

Next.js ကို Node.js ကို support လုပ်တဲ့ provider မဆီ deploy လုပ်နိုင်ပါတယ်။ သင့် `package.json` ထဲမှာ `"build"` နဲ့ `"start"` scripts တွေ ရှိဖို့ သေချာပါစေ:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

ပြီးတော့ `npm run build` ကို run လုပ်ပြီး [သင့် application ကို build လုပ်ပါ](https://nextjs.org/docs/app/getting-started/deploying) — `npm run start` နဲ့ Node.js server ကို စတင်ပါ။ ဒီ server က Next.js ရဲ့ features အားလုံးကို support လုပ်ပါတယ်။ လိုအပ်ရင် [custom server](https://nextjs.org/docs/app/building-your-application/configuring/custom-server) တစ်ခုဆီ eject လုပ်လို့လည်း ရပါတယ်။

Node.js deployments တွေက Next.js features အားလုံးကို support လုပ်ပါတယ်။ သင့် infrastructure အတွက် [ဘယ်လို configure လုပ်ရမလဲ](https://nextjs.org/docs/app/guides/self-hosting) ကို လေ့လာပါ။

### Templates

- [Flightcontrol](https://github.com/nextjs/deploy-flightcontrol)
- [Railway](https://github.com/nextjs/deploy-railway)
- [Replit](https://github.com/nextjs/deploy-replit)
- [Hostinger](https://github.com/hostinger/deploy-nextjs)

## Docker

Next.js ကို [Docker](https://www.docker.com/) containers တွေကို support လုပ်တဲ့ provider မဆီ deploy လုပ်နိုင်ပါတယ် — Kubernetes လို container orchestrators တွေ (သို့) Docker run လုပ်ပေးတဲ့ cloud provider တွေ အပါအဝင်ပါ။ သင့် app ကို containerize လုပ်တဲ့ အကောင်းဆုံး အလေ့အကျင့်တွေအတွက် Docker ရဲ့ တရားဝင် [Next.js](https://docs.docker.com/guides/nextjs) နဲ့ [React.js](https://docs.docker.com/guides/reactjs) guides တွေကို ကိုးကားပါ။

Docker deployments တွေက Next.js features အားလုံးကို support လုပ်ပါတယ်။ သင့် infrastructure အတွက် [ဘယ်လို configure လုပ်ရမလဲ](https://nextjs.org/docs/app/guides/self-hosting) ကို လေ့လာပါ။

> **Development အတွက် မှတ်ချက်** — Docker က production deployments တွေအတွက် ကောင်းပေမယ့် — Mac နဲ့ Windows ပေါ်မှာ development ကာလအတွင်းတော့ performance ပိုကောင်းဖို့ Docker အစား local development (`npm run dev`) ကို သုံးစဉ်းစားပါ။ [Local development ကို optimize လုပ်ခြင်းအကြောင်း ပိုလေ့လာပါ](https://nextjs.org/docs/app/getting-started/deploying)။

### Templates

ဒီဥပမာတွေက Next.js applications တွေကို containerize လုပ်တဲ့ အကောင်းဆုံး အလေ့အကျင့်တွေကို သရုပ်ပြပါတယ်:

- [Docker Standalone Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker) — `output: "standalone"` သုံးပြီး — လိုအပ်တဲ့ runtime files နဲ့ dependencies တွေပဲ ပါတဲ့ minimal, production-ready Docker image တစ်ခု ထုတ်ဖို့
- [Docker Export Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker-export-output) — `output: "export"` သုံးပြီး — lightweight container (သို့) static hosting environment မဆီကနေ ပေးနိုင်တဲ့ optimized HTML files တွေ ထုတ်လုပ်ပြီး fully static Next.js application တစ်ခုကို deploy လုပ်ဖို့
- [Docker Multi-Environment](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env) — environment variables အမျိုးမျိုးနဲ့ development, staging နဲ့ production environments တွေအတွက် Docker configurations သီးခြားစီ စီမံခန့်ခွဲဖို့

ဒါတွေအပြင် hosting providers တွေကလည်း Next.js deploy လုပ်တဲ့ လမ်းညွှန်ချက်တွေ ပေးထားပါတယ်:

- [DigitalOcean](https://github.com/nextjs/deploy-digitalocean)
- [Fly.io](https://github.com/nextjs/deploy-fly)
- [Google Cloud Run](https://github.com/nextjs/deploy-google-cloud-run)
- [Render](https://github.com/nextjs/deploy-render)
- [SST](https://github.com/nextjs/deploy-sst)

## Static export

Next.js က static site (သို့) [Single-Page Application (SPA)](https://nextjs.org/docs/app/guides/single-page-applications) အဖြစ် စတင်နိုင်ပြီး — နောက်ပိုင်းမှာ server လိုအပ်တဲ့ features တွေကို သုံးဖို့ optionally upgrade လုပ်နိုင်ပါတယ်။

Next.js က [static exports](/docs/nextjs/static-exports) တွေကို support လုပ်လို့ — HTML/CSS/JS static assets တွေကို ပေးနိုင်တဲ့ web server မဆီ deploy လုပ်ပြီး host လုပ်နိုင်ပါတယ်။ AWS S3, Nginx (သို့) Apache လို tools တွေ အပါအဝင်ပါ။

[Static export](/docs/nextjs/static-exports) အနေနဲ့ run လုပ်ရင် — server လိုအပ်တဲ့ Next.js features တွေကို **support မလုပ်ပါဘူး**။ [ပိုလေ့လာပါ](/docs/nextjs/static-exports#unsupported-features)။

### Templates

- [GitHub Pages](https://github.com/nextjs/deploy-github-pages)

## Adapters

Next.js ကို platform အမျိုးမျိုးရဲ့ infrastructure capabilities တွေကို support လုပ်ဖို့ လိုက်လျောညီထွေ ပြောင်းလဲနိုင်ပါတယ်။ [Deployment Adapter API](https://nextjs.org/docs/app/api-reference/next-config-js/adapterPath) က platforms တွေကို Next.js applications တွေ ဘယ်လို build လုပ်ပြီး deploy လုပ်မလဲ စိတ်ကြိုက် ပြောင်းလဲခွင့် ပေးပါတယ်။

### Verified Adapters

Verified adapters တွေက open source ဖြစ်ပြီး — [Next.js compatibility test suite](https://nextjs.org/docs/app/getting-started/deploying) အပြည့်အစုံကို run လုပ်ကာ [Next.js GitHub organization](https://github.com/nextjs) အောက်မှာ host လုပ်ထားပါတယ်။ Next.js team က major releases တွေ မတိုင်ခင် ဒီ platforms တွေနဲ့ testing တွေကို ညှိနှိုင်း လုပ်ဆောင်ပါတယ်။ Adapter တစ်ခုချင်းစီအတွက် လူသိရှင်ကြား မြင်နိုင်တဲ့ test results တွေက မကြာခင် ထွက်လာပါမယ်။ [Verified adapters အကြောင်း ပိုလေ့လာပါ](https://nextjs.org/docs/app/getting-started/deploying#verified-adapters)။

- [Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Bun](https://bun.com/docs/guides/ecosystem/nextjs)

Cloudflare နဲ့ Netlify တို့က Adapter API ပေါ်မှာ တည်ဆောက်ထားတဲ့ verified adapters တွေကို လုပ်ဆောင်နေပါတယ်။ ထိုအချိန်အထိ — သူတို့က ကိုယ်ပိုင် Next.js integrations တွေ ပေးထားပါတယ် (အောက်မှာ ကြည့်ပါ)။

### အခြား Platforms များ

အောက်ဖော်ပြပါ platforms တွေက သူတို့ရဲ့ ကိုယ်ပိုင် Next.js integrations တွေ ပေးထားပါတယ်။ ဒါတွေက public [Adapter API](https://nextjs.org/docs/app/api-reference/next-config-js/adapterPath) ပေါ်မှာ တည်ဆောက်ထားတာ မဟုတ်ဘဲ Next.js team ရဲ့ verification လည်း မခံရတာမို့ — feature support နဲ့ compatibility ကွဲပြားနိုင်ပါတယ်။ အသေးစိတ်အတွက် provider တစ်ခုချင်းစီရဲ့ documentation တွေကို ကိုးကားပါ:

- [Appwrite Sites](https://appwrite.io/docs/products/sites/quick-start/nextjs)
- [AWS Amplify Hosting](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components)
- [Cloudflare](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs)
- [Deno Deploy](https://docs.deno.com/examples/next_tutorial)
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting/get-started)
- [Netlify](https://docs.netlify.com/frameworks/next-js/overview/#next-js-support-on-netlify)

ဘယ် Next.js features တွေက platform capabilities အချို့ လိုအပ်လဲဆိုတဲ့ အသေးစိတ်အတွက် — [Deploying to Platforms](https://nextjs.org/docs/app/getting-started/deploying) ကို ကြည့်ပါ။
