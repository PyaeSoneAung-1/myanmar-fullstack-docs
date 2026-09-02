---
title: "TypeScript Native အသုံးပြုခြင်း"
description: "Node.js မှာ TypeScript ကို transpile မလိုဘဲ တိုက်ရိုက် run ခြင်း — type stripping, --experimental-strip-types flag, erasable syntax နဲ့ ကန့်သတ်ချက်များ"
order: 35
source: "https://nodejs.org/en/learn/typescript/run-natively"
status: translated
updated: 2026-09-02
---

## TypeScript ကို Node.js မှာ တိုက်ရိုက် run ခြင်း

Node.js မှာ — ပထမဆုံး transpile လုပ်စရာ မလိုဘဲ — valid TypeScript code တွေကို တိုက်ရိုက် ရေးသား run လို့ရပါတယ်။

Node.js က TypeScript ကို **type stripping** လို့ခေါ်တဲ့ ပေါ့ပါးတဲ့ လုပ်ငန်းစဉ်တစ်ခုနဲ့ run ပါတယ် — ဒီလုပ်ငန်းစဉ်က type annotations နဲ့ interfaces လိုမျိုး [erasable TypeScript syntax](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option) တွေကို ဖယ်ရှားပြီး — ကျန်ရှိတဲ့ JavaScript ကို ဆက်ပြီး run ပေးပါတယ်။

### Flag မလိုဘဲ run ခြင်း

သင် v22.18.0 နဲ့ နောက်ပိုင်း version တစ်ခုကို သုံးနေပြီး — သင့် source code မှာ [erasable TypeScript syntax](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option) တွေပဲ ပါတယ်ဆိုရင် — flag တစ်ခုမှ မလိုဘဲ TypeScript code ကို execute လုပ်လို့ရပါတယ်:

```bash
node example.ts
```

### Flag နဲ့ run ခြင်း

v22.18.0 ထက် နိမ့်တဲ့ version တစ်ခုကို သုံးနေရင်တော့ — `--experimental-strip-types` flag ကို သုံးပြီး TypeScript files တွေကို Node.js မှာ တိုက်ရိုက် run နိုင်ပါတယ်:

```bash
node --experimental-strip-types example.ts
```

ဒီလောက်ပါပဲ — ဒါဆိုရင် ပထမဆုံး transpile လုပ်စရာ မလိုဘဲ — TypeScript code တွေကို Node.js မှာ တိုက်ရိုက် run နိုင်ပါပြီ။

ဒါပေမယ့် သတိထားရမှာက — Node.js က TypeScript files တွေကို run တဲ့အခါ **type checking လုပ်ပေးမှာ မဟုတ်ပါဘူး**။ Type နဲ့ ဆိုင်တဲ့ error တွေကို ဖမ်းချင်ရင် — TypeScript compiler ကို သပ်သပ်စီ သုံးရပါမယ်:

```bash
npx tsc --noEmit
```

လိုအပ်ရင် [`--no-experimental-strip-types`](https://nodejs.org/docs/latest-v22.x/api/cli.html#--no-experimental-strip-types) flag နဲ့ type stripping ကို disable လုပ်လို့လည်း ရပါတယ်:

```bash
node --no-experimental-strip-types example.ts
```

## ကန့်သတ်ချက်များ (Constraints)

Node.js ရဲ့ TypeScript support မှာ သတိထားရမယ့် ကန့်သတ်ချက်တချို့ ရှိပါတယ်။ အသေးစိတ် အချက်အလက်တွေကို [API docs](https://nodejs.org/docs/latest-v22.x/api/typescript.html#typescript-features) မှာ ကြည့်နိုင်ပါတယ်။

### Type Stripping

Type stripping က — runtime JavaScript ကို မပြောင်းလဲဘဲ ဖယ်ရှားလို့ရတဲ့ TypeScript syntax တွေအတွက်သာ အလုပ်လုပ်ပါတယ်။ ဒီထဲမှာ type annotations, interfaces, type aliases, `import type` စတဲ့ အသုံးများတဲ့ type-only syntax တွေ ပါဝင်ပါတယ်။

JavaScript code generation လိုအပ်တဲ့ syntax တွေကတော့ — type stripping တစ်ခုတည်းနဲ့ မကိုင်တွယ်နိုင်ပါဘူး။ ဥပမာတွေကတော့ `enum`၊ parameter properties၊ runtime code ပါတဲ့ namespaces နဲ့ import aliases တို့ ဖြစ်ပါတယ်။ သင့် project မှာ ဒီ features တွေ လိုအပ်ရင် — runner တစ်ခု ဒါမှမဟုတ် သပ်သပ်စီထားတဲ့ transpilation step တစ်ခုကို သုံးရပါမယ်။

### Type Checking

`.ts` file တစ်ခုကို `node` နဲ့ run တာက `tsc` နဲ့ run တာနဲ့ မတူပါဘူး — Node.js က supported type syntax တွေကို ဖယ်ရှားပြီး file ကို execute လုပ်ပေးပေမယ့် — type errors တွေကို သတင်းပို့ပေးမှာ မဟုတ်ပါဘူး။

Development အတွက် လက်တွေ့ကျတဲ့ setup တစ်ခုကတော့ — မြန်ဆန်တဲ့ feedback ရဖို့ Node.js နဲ့ တိုက်ရိုက် run ပြီး — type checking အတွက် `tsc --noEmit` ကို command သပ်သပ်စီ တစ်ခု ဒါမှမဟုတ် CI job တစ်ခုအနေနဲ့ run လုပ်တာပါ။

### Configuration

Node.js ရဲ့ TypeScript loader ([Amaro](https://github.com/nodejs/amaro)) က TypeScript code တွေကို run ဖို့ `tsconfig.json` ကို မလိုအပ်ပါဘူး — သုံးလည်း မသုံးပါဘူး။

ဒါပေမယ့် — သင့် editor နဲ့ `tsc` က Node.js ရဲ့ behavior အတိုင်း အလုပ်လုပ်နိုင်ဖို့ — [ဒီနေရာမှာ ဖော်ပြထားတဲ့ `compilerOptions`](https://nodejs.org/api/typescript.html#type-stripping) တွေ ပါဝင်တဲ့ `tsconfig.json` ဖိုင်တစ်ခုကို ဖန်တီးပြီး — TypeScript version **5.7 နဲ့ အထက်** ကို သုံးဖို့ အကြံပြုပါတယ်။

## ဆက်ဖတ်ရန်

- [Transpilation ဖြင့် TypeScript သုံးခြင်း](/docs/nodejs/running-typescript-code-using-transpilation) — `tsc` နဲ့ compile လုပ်ပြီး run ခြင်း
- [TS Runner (tsx) သုံးခြင်း](/docs/nodejs/running-typescript-with-a-runner) — ts-node/tsx လို runner တွေနဲ့ run ခြင်း
- [TypeScript Package ထုတ်ဝေခြင်း](/docs/nodejs/publishing-a-typescript-package) — TypeScript package တွေကို npm မှာ ထုတ်ဝေခြင်း
