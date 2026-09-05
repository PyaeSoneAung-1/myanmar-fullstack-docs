---
title: "Upgrading (နောက်ဆုံး version ဆီ အဆင့်မြှင့်တင်ခြင်း)"
description: "သင့် Next.js application ကို နောက်ဆုံး version (သို့) canary ဆီ upgrade လုပ်နည်း — `next upgrade` command, @next/codemod package, ကိုယ်တိုင် ပြောင်းရွှေ့ခြင်းနဲ့ canary မှာ ရနိုင်တဲ့ features (forbidden, unauthorized, authInterrupts)"
order: 263
source: "https://nextjs.org/docs/app/getting-started/upgrading"
status: translated
updated: 2026-09-05
---

## နောက်ဆုံး version (Latest version)

Next.js ရဲ့ နောက်ဆုံး version ကို update လုပ်ဖို့ — `upgrade` command ကို သုံးနိုင်ပါတယ်:

```bash package="pnpm"
pnpm next upgrade
```

```bash package="npm"
npx next upgrade
```

```bash package="yarn"
yarn next upgrade
```

```bash package="bun"
bunx next upgrade
```

Next.js 16.1.0 မတိုင်ခင် versions တွေက `upgrade` command ကို မထောက်ပံ့ပါဘူး — အဲဒီအစား သီးခြား package တစ်ခုကို သုံးဖို့ လိုပါတယ်:

```bash filename="Terminal"
npx @next/codemod@canary upgrade latest
```

ကိုယ်တိုင် upgrade လုပ်ချင်တယ်ဆိုရင် — Next.js နဲ့ React ရဲ့ နောက်ဆုံး versions တွေကို install လုပ်ပါ:

```bash package="pnpm"
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="npm"
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="yarn"
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="bun"
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary version

နောက်ဆုံး canary ဆီ update လုပ်ဖို့ — သင်က Next.js ရဲ့ နောက်ဆုံး version ပေါ်မှာ ရှိနေပြီး အရာအားလုံး ကောင်းမွန်စွာ အလုပ်လုပ်နေတာ သေချာအောင် ဦးစွာ လုပ်ပါ။ ပြီးရင် အောက်ပါ command ကို run လုပ်ပါ:

```bash package="pnpm"
pnpm add next@canary
```

```bash package="npm"
npm i next@canary
```

```bash package="yarn"
yarn add next@canary
```

```bash package="bun"
bun add next@canary
```

### Canary မှာ ရနိုင်တဲ့ features

အောက်ပါ features တွေက လက်ရှိ canary မှာ ရနိုင်ပါတယ်:

**Authentication**:

- [`forbidden`](/docs/nextjs/forbidden)
- [`unauthorized`](/docs/nextjs/unauthorized)
- [`forbidden.js`](/docs/nextjs/file-conventions-forbidden)
- [`unauthorized.js`](/docs/nextjs/file-conventions-unauthorized)
- [`authInterrupts`](/docs/nextjs/next-config-auth-interrupts)
