---
title: "serverExternalPackages (Server Components bundling မှ ဖယ်ထုတ်ရန်)"
description: "serverExternalPackages option — Node.js အတွက် သီးသန့် features သုံးသော dependencies များကို Server Components/Route Handlers bundling မှ opt-out လုပ်ပြီး native Node.js `require` သုံးရန်; v15.0.0 တွင် stable သို့ ပြောင်း (serverComponentsExternalPackages မှ အမည်ပြောင်း)"
order: 169
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages"
status: translated
updated: 2026-09-03
---

[Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) နဲ့ [Route Handlers](/docs/nextjs/file-conventions-route) တွေထဲမှာ သုံးတဲ့ dependencies တွေကို Next.js က အလိုအလျောက် bundle လုပ်ပါလိမ့်မယ်။

တစ်စုံတစ်ခုသော dependency က Node.js အတွက် သီးသန့် features တွေကို သုံးနေရင် — အဲဒီ dependency တွေကို Server Components bundling ကနေ opt-out (ဖယ်ထုတ်) လုပ်ပြီး native Node.js `require` ကို သုံးဖို့ ရွေးချယ်နိုင်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

Next.js မှာ လက်ရှိ compatibility အတွက် ဆောင်ရွက်နေပြီး — အလိုအလျောက် opt-out လုပ်ပေးထားတဲ့ [popular packages စာရင်း](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/server-external-packages.jsonc) လည်း ပါဝင်ပါတယ်:

- `@alinea/generated`
- `@appsignal/nodejs`
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-presigned-post`
- `@blockfrost/blockfrost-js`
- `@highlight-run/node`
- `@huggingface/transformers`
- `@jpg-store/lucid-cardano`
- `@libsql/client`
- `@mikro-orm/core`
- `@mikro-orm/knex`
- `@node-rs/argon2`
- `@node-rs/bcrypt`
- `@prisma/client`
- `@react-pdf/renderer`
- `@sentry/profiling-node`
- `@sparticuz/chromium`
- `@sparticuz/chromium-min`
- `@statsig/statsig-node-core`
- `@swc/core`
- `@xenova/transformers`
- `@zenstackhq/runtime`
- `argon2`
- `autoprefixer`
- `aws-crt`
- `bcrypt`
- `better-sqlite3`
- `canvas`
- `chromadb-default-embed`
- `config`
- `cpu-features`
- `cypress`
- `dd-trace`
- `eslint`
- `express`
- `firebase-admin`
- `htmlrewriter`
- `import-in-the-middle`
- `isolated-vm`
- `jest`
- `jsdom`
- `keyv`
- `libsql`
- `mdx-bundler`
- `mongodb`
- `mongoose`
- `newrelic`
- `next-mdx-remote`
- `next-seo`
- `node-cron`
- `node-pty`
- `node-web-audio-api`
- `onnxruntime-node`
- `oslo`
- `pg`
- `pino`
- `pino-pretty`
- `pino-roll`
- `playwright`
- `playwright-core`
- `postcss`
- `prettier`
- `prisma`
- `puppeteer-core`
- `puppeteer`
- `ravendb`
- `require-in-the-middle`
- `rimraf`
- `sharp`
- `shiki`
- `sqlite3`
- `thread-stream`
- `ts-morph`
- `ts-node`
- `typescript`
- `vscode-oniguruma`
- `webpack`
- `websocket`
- `zeromq`

| Version   | အပြောင်းအလဲ                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `v15.0.0` | Experimental ကနေ stable သို့ ပြောင်းလဲ။ `serverComponentsExternalPackages` ကနေ `serverExternalPackages` သို့ အမည်ပြောင်းလဲ။ |
