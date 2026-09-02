---
title: "transpilePackages (dependencies transpile လုပ်ခြင်း)"
description: "transpilePackages option — monorepo workspace packages (သို့) TypeScript/JSX/modern syntax ပါသော `node_modules` libraries များကို transpile လုပ်ပြီး bundle လုပ်ရန် သတ်မှတ်ချက်"
order: 98
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages"
status: translated
updated: 2026-09-02
---

`transpilePackages` ကို သုံးပြီး dependency တစ်ခုကို လက်နဲ့မထိဘဲ ထားတဲ့ runtime code အဖြစ် မဆက်ဆံဘဲ — compile လုပ်ပြီး bundle လုပ်နိုင်ပါတယ်။ Values တွေက package names တွေဖြစ်ပြီး — `@scope/pkg` လိုမျိုး scoped names တွေ အပါအဝင်ပါ။ Paths နဲ့ glob patterns တွေကို ထောက်ပံ့မထားပါဘူး။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['package-name', '@scope/pkg'],
}

module.exports = nextConfig
```

ဒါက `next-transpile-modules` package ကို အစားထိုးပါတယ်။

## ဘယ်အခါ လိုအပ်လဲ

Turbopack က router နှစ်မျိုးလုံးအောက်မှာ သင့် monorepo ထဲက workspace packages တွေ (npm, pnpm, (သို့) Yarn workspaces) ကို အလိုအလျောက် transpile လုပ်ပေးပါတယ်။ Webpack က App Router အတွက် အလားတူ လုပ်ပေးပါတယ်။ အောက်ပါ အခြေအနေတွေမှာ package တစ်ခုကို `transpilePackages` ထဲ ထည့်ပါ:

- **`node_modules` dependency တစ်ခုက raw TypeScript (သို့) JSX တွေ ပါလာတယ်။** Next.js က `node_modules` ထဲက code တွေကို default အားဖြင့် compile မလုပ်ပါဘူး။ Package ကို စာရင်းထဲ ထည့်လိုက်ရင် opt-in ဖြစ်သွားပြီး — (သို့) package ကို plain JavaScript အဖြစ် build လုပ်ပြီး ၎င်းရဲ့ `main`/`exports` တွေကို compiled output ဆီ ညွှန်ပြနိုင်ပါတယ်။
- **Pages Router အတွက် webpack နဲ့ build လုပ်ပြီး dependency ရဲ့ source က next app ရဲ့ directory အပြင်ဘက်မှာ ရှိတယ်။** ဥပမာ — monorepo တစ်ခုထဲက `apps/web` app က `packages/ui` ကို import လုပ်တာမျိုးပါ။
- **Pages Router ကို သုံးပြီး `node_modules` dependency တစ်ခုကို route ထဲ bundle လုပ်ချင်တယ်။** Pages Router က `node_modules` server-side dependencies တွေကို runtime မှာ Node.js `require` ကနေ load လုပ်ပါတယ်။ Package ကို စာရင်းထဲ ထည့်လိုက်ရင် ၎င်းရဲ့ source ကို route ထဲ bundle လုပ်ပေးပါတယ်။ App Router ကတော့ — package ကို [`serverExternalPackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) ထဲမှာ စာရင်းမသွင်းထားဘူးဆိုရင် Server Component နဲ့ Route Handler dependencies တွေကို ပြီးသား bundle လုပ်ပေးပါတယ်။

> **သိထားသင့်သည်:** Package တစ်ခုက `transpilePackages` နဲ့ [`serverExternalPackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) နှစ်ခုလုံးထဲမှာ တစ်ပြိုင်နက် ပါနေလို့ မရပါဘူး — ပါနေရင် Next.js က build စတင်ချိန်မှာ error ပစ်ပါတယ်။ [`optimizePackageImports`](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) ထဲမှာ စာရင်းသွင်းထားတဲ့ packages တွေနဲ့ [`default-transpiled-packages.json`](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/default-transpiled-packages.json) ထဲက entries တွေကို အလိုအလျောက် ထည့်ပေးပါတယ် — သင်ကိုယ်တိုင် ထပ်စာရင်းသွင်းစရာ မလိုပါဘူး။

## Version History

| Version   | အပြောင်းအလဲ                    |
| --------- | -------------------------- |
| `v13.0.0` | `transpilePackages` စတင် မိတ်ဆက်။ |
