---
title: "Transpilation ဖြင့် TypeScript သုံးခြင်း"
description: "TypeScript code ကို tsc compiler နဲ့ JavaScript အဖြစ် transpile လုပ်ပြီး Node.js မှာ run ခြင်း — အဆင့်ဆင့် လုပ်နည်းနဲ့ type errors ကြိုတင်ဖမ်းခြင်း"
order: 36
source: "https://nodejs.org/en/learn/typescript/transpile"
status: translated
updated: 2026-09-02
---

## Transpilation ဆိုတာ ဘာလဲ

**Transpilation** ဆိုတာ — source code တစ်ခုကို ဘာသာစကားတစ်ခုကနေ နောက်တစ်ခုဆီ ပြောင်းလဲပေးတဲ့ လုပ်ငန်းစဉ်ပါ။ TypeScript အတွက်ဆိုရင် — TypeScript code တွေကို JavaScript code အဖြစ် ပြောင်းလဲပေးတာပါ။ Browsers နဲ့ Node.js တွေက TypeScript code တွေကို တိုက်ရိုက် run မပေးနိုင်လို့ ဒီလို ပြောင်းလဲခြင်း လိုအပ်ပါတယ် — TypeScript ရဲ့ type annotations လိုမျိုး syntax တွေက runtime မှာ မလိုအပ်တဲ့အရာတွေမို့ — transpilation က ဒါတွေကို ဖယ်ရှားပြီး — browser ရော Node.js ရော တိုက်ရိုက် run လို့ရတဲ့ plain JavaScript အဖြစ် ပြောင်းပေးတာပါ။

## TypeScript ကို JavaScript အဖြစ် Compile လုပ်ခြင်း

TypeScript code တွေကို run ဖို့ အသုံးအများဆုံး နည်းကတော့ — JavaScript အဖြစ် အရင်ဆုံး compile လုပ်ပြီးမှ run တာပါ။ ဒါကို TypeScript compiler ဖြစ်တဲ့ `tsc` နဲ့ လုပ်နိုင်ပါတယ်။

**အဆင့် ၁** — `example.ts` လို file တစ်ခုထဲမှာ သင့် TypeScript code ကို ရေးပါ:

```ts
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine = {
  name: 'Justine',
  age: 23,
} satisfies User;

const isJustineAnAdult = isAdult(justine);
```

ဒီ code ထဲမှာ — `name` နဲ့ `age` ဆိုတဲ့ property နှစ်ခုပါတဲ့ `User` type ကို သတ်မှတ်ထားပြီး — `isAdult` function က `User` တစ်ယောက်ကို လက်ခံကာ — အသက် 18 နဲ့ အထက်ဆိုရင် `true` ပြန်ပေးပါတယ်။ `justine` object ကို `satisfies User` နဲ့ သတ်မှတ်ထားလို့ — ဒီ object က `User` type ရဲ့ ပုံစံ (shape) နဲ့ ကိုက်ညီကြောင်း TypeScript က compile ချိန်မှာ စစ်ဆေးပေးပါတယ်။

**အဆင့် ၂** — package manager တစ်ခုကို သုံးပြီး TypeScript ကို local မှာ install လုပ်ပါ:

ဒီဥပမာမှာ npm ကို သုံးသွားမှာ ဖြစ်ပါတယ် — npm အကြောင်း ပိုပြီး သိချင်ရင် ကျွန်တော်တို့ရဲ့ [npm package manager မိတ်ဆက်](/docs/nodejs/npm-basics) ကို ကြည့်နိုင်ပါတယ်။

```bash
npm i -D typescript # -D is a shorthand for --save-dev
```

**အဆင့် ၃** — `tsc` command ကို သုံးပြီး သင့် TypeScript code ကို JavaScript အဖြစ် compile လုပ်ပါ:

```bash
npx tsc example.ts
```

> **မှတ်ချက်:** `npx` ဆိုတာ — Node.js packages တွေကို globally install လုပ်စရာ မလိုဘဲ run နိုင်အောင် လုပ်ပေးတဲ့ tool တစ်ခုပါ။

`tsc` က TypeScript compiler ဖြစ်ပြီး — ကျွန်တော်တို့ရဲ့ TypeScript code ကို ယူပြီး JavaScript အဖြစ် compile လုပ်ပေးပါတယ်။ ဒီ command ကြောင့် `example.js` ဆိုတဲ့ file အသစ်တစ်ခု ထွက်လာပြီး — Node.js နဲ့ run လို့ရပါတယ်။ Compile လုပ်နည်းနဲ့ run နည်းကို အခုဆို သိပြီ ဖြစ်လို့ — TypeScript က bugs တွေကို ကြိုတင် ကာကွယ်ပေးနိုင်တဲ့ စွမ်းရည်တွေကို လက်တွေ့ မြင်ကြည့်ရအောင်။

**အဆင့် ၄** — ရလာတဲ့ JavaScript code ကို Node.js နဲ့ run ပါ:

```bash
node example.js
```

Terminal ထဲမှာ သင့် TypeScript code ရဲ့ output ကို မြင်ရမှာ ဖြစ်ပါတယ်။

## Type Errors တွေ ရှိနေရင်

သင့် TypeScript code ထဲမှာ type errors တွေ ရှိနေရင် — TypeScript compiler က သူတို့ကို ဖမ်းမိပြီး — code ကို run လို့မရအောင် တားဆီးပေးပါတယ်။ ဥပမာ — `justine` ရဲ့ `age` property ကို string တစ်ခုအဖြစ် ပြောင်းလိုက်ရင် TypeScript က error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်:

Type error တစ်ခုကို ရည်ရွယ်ချက်ရှိရှိ ထည့်ကြည့်ဖို့ — ကျွန်တော်တို့ရဲ့ code ကို ဒီလို ပြုပြင်ကြည့်ပါမယ်:

```ts
// @errors: 2322 2554
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine: User = {
  name: 'Justine',
  age: 'Secret!',
};

const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
```

ဒီ code မှာ error နှစ်ခု ရှိပါတယ် — `age` ကို number အစား string `'Secret!'` ထည့်ထားလို့ `User` type နဲ့ မကိုက်ညီတော့ဘဲ — `isAdult` ကို ခေါ်တဲ့အခါမှာလည်း parameter တစ်ခုတည်းပဲ လက်ခံတဲ့ function ထဲကို argument တစ်ခု ပိုပြီး ပို့ထားပါတယ်။

အပေါ်က ဥပမာမှာ တွေ့ရတဲ့အတိုင်း — TypeScript က bugs တွေ မဖြစ်ပွားခင် အချိန်မတိုင်ခင် ဖမ်းဆီးပေးရာမှာ အလွန် အထောက်အကူ ပြုပါတယ်။ ဒါက developer တွေကြားမှာ TypeScript ဘာကြောင့် ဒီလောက် ရေပန်းစားတဲ့ အကြောင်းရင်းတွေထဲက တစ်ခုပါ။

## ဆက်ဖတ်ရန်

- [TypeScript Native အသုံးပြုခြင်း](/docs/nodejs/running-typescript-natively) — transpile မလိုဘဲ Node.js မှာ တိုက်ရိုက် run ခြင်း
- [TS Runner (tsx) သုံးခြင်း](/docs/nodejs/running-typescript-with-a-runner) — ts-node/tsx လို runner တွေနဲ့ run ခြင်း
- [npm အခြေခံ](/docs/nodejs/npm-basics) — npm packages နဲ့ အလုပ်လုပ်ပုံ
