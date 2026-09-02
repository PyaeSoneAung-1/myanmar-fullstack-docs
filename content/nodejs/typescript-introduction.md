---
title: "TypeScript မိတ်ဆက် (Introduction to TypeScript)"
description: "TypeScript ဆိုတာ ဘာလဲ၊ ပထမဆုံး TypeScript code နမူနာ၊ TypeScript ရဲ့ ဖွဲ့စည်းပုံ (code နဲ့ type definitions), transform စွမ်းရည်များနဲ့ TypeScript run နည်းများအကြောင်း မိတ်ဆက်"
order: 65
source: "https://nodejs.org/learn/typescript/introduction"
status: translated
updated: 2026-09-02
---

## TypeScript မိတ်ဆက်

### TypeScript ဆိုတာ ဘာလဲ

**[TypeScript](https://www.typescriptlang.org)** ဆိုတာ — Microsoft က ထိန်းသိမ်းပြီး ဖွံ့ဖြိုးတိုးတက်အောင် လုပ်နေတဲ့ open-source language တစ်ခုပါ။

အခြေခံအားဖြင့် — TypeScript က JavaScript ပေါ်မှာ syntax အသစ်တွေ ထပ်ဖြည့်ပေးပြီး — သင့် editor နဲ့ ပိုမို နီးကပ်စွာ ပေါင်းစပ်အလုပ်လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။ Error တွေကို သင့် editor ထဲမှာဖြစ်စေ၊ CI/CD pipeline ထဲမှာဖြစ်စေ စောစောစီးစီး ဖမ်းမိနိုင်ပြီး — ပိုပြီး ထိန်းသိမ်းပြုပြင်ရလွယ်တဲ့ (maintainable) code တွေကို ရေးသားနိုင်ပါတယ်။

TypeScript ရဲ့ တခြား အကျိုးကျေးဇူးတွေကို နောက်မှ ဆက်ပြောပါဦးမယ် — အခု ဥပမာတချို့ကို အရင် ကြည့်ကြရအောင်!

### ပထမဆုံး TypeScript code

ဒီ code snippet ကို ကြည့်လိုက်ပါ — ပြီးရင် အတူတူ ခွဲခြမ်းစိတ်ဖြာကြည့်ကြမယ်:

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

ပထမ အပိုင်း (`type` keyword ပါတဲ့) က — user တွေကို ကိုယ်စားပြုတဲ့ ကိုယ်ပိုင် object type တစ်ခုကို ကြေညာတာပါ။ နောက်ပိုင်းမှာ — အခုလို ဖန်တီးထားတဲ့ type အသစ်ကို သုံးပြီး — `User` type argument တစ်ခုကို လက်ခံကာ `boolean` ပြန်ပေးတဲ့ `isAdult` function ကို ဖန်တီးပါတယ်။ ဒါပြီးတော့ — အခုနက function ကို ခေါ်ဖို့ သုံးလို့ရတဲ့ ဥပမာ data တစ်ခုဖြစ်တဲ့ `justine` ကို ဖန်တီးပါတယ်။ နောက်ဆုံးမှာတော့ — `justine` က အရွယ်ရောက်ပြီးသားလားဆိုတဲ့ အချက်အလက်ပါတဲ့ variable အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

ဒီဥပမာနဲ့ ပတ်သက်ပြီး သိထားသင့်တဲ့ အချက်တချို့လည်း ရှိပါသေးတယ်။ ပထမအချက် — ကြေညာထားတဲ့ types တွေနဲ့ မကိုက်ညီရင် TypeScript က တစ်ခုခု မှားနေတယ်လို့ အသိပေးပြီး — မှားယွင်းစွာ သုံးမိတာတွေကို တားဆီးပေးပါတယ်။ ဒုတိယအချက် — အရာအားလုံးကို ရှင်းရှင်းလင်းလင်း type သတ်မှတ်စရာ မလိုပါဘူး — TypeScript က types တွေကို ကိုယ်တိုင် ခန့်မှန်းပေး (infer) ပါတယ်။ ဥပမာ — `isJustineAnAdult` variable က ရှင်းရှင်းလင်းလင်း type သတ်မှတ်မထားပေမယ့် `boolean` type ဖြစ်ပြီး — `justine` ကိုလည်း `User` type လို့ ကြေညာမထားပေမယ့် — ကျွန်တော်တို့ function အတွက် valid argument တစ်ခု ဖြစ်နေပါတယ်။

### TypeScript က ဘာတွေနဲ့ ဖွဲ့စည်းထားသလဲ

TypeScript ကို အဓိက အစိတ်အပိုင်း နှစ်ခုနဲ့ ဖွဲ့စည်းထားပါတယ် — code ကိုယ်တိုင်နဲ့ type definitions တွေပါ။

#### TypeScript Code

Code အပိုင်းကတော့ — type annotations အတွက် TypeScript-specific syntax တွေ ထပ်ပါဝင်တဲ့ သာမန် JavaScript ပဲ ဖြစ်ပါတယ်။ TypeScript code ကို compile လုပ်တဲ့အခါ — TypeScript-specific အစိတ်အပိုင်းတွေ အားလုံးကို ဖယ်ရှားပြီး — ဘယ် environment မှာမဆို run လို့ရတဲ့ သန့်ရှင်းတဲ့ JavaScript အဖြစ် ပြောင်းလဲပေးပါတယ်။ ဥပမာ:

```ts
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

#### Type Definitions

Type definitions တွေက — ရှိပြီးသား JavaScript code တွေရဲ့ ပုံစံ (shape) ကို ဖော်ပြပေးပါတယ်။ ဒါတွေကို အများအားဖြင့် `.d.ts` files တွေထဲမှာ သိမ်းဆည်းပြီး — တကယ့် implementation (လုပ်ဆောင်ချက် code) တစ်ခုမှ မပါဝင်ဘဲ — types တွေကိုပဲ ဖော်ပြပေးပါတယ်။ ဒီ definitions တွေက JavaScript နဲ့ အပြန်အလှန် အလုပ်လုပ်နိုင်မှု (interoperability) အတွက် မရှိမဖြစ် လိုအပ်ပါတယ် — code တွေကို TypeScript အနေနဲ့ တိုက်ရိုက် ဖြန့်ဝေလေ့မရှိဘဲ — sidecar type definition files တွေပါတဲ့ JavaScript အဖြစ် transpile လုပ်ပြီးမှ ဖြန့်ဝေလေ့ရှိလို့ပါ။

ဥပမာ — Node.js ကို TypeScript နဲ့ သုံးတဲ့အခါ — Node.js APIs တွေအတွက် type definitions တွေ လိုပါတယ်။ ဒါတွေကို `@types/node` ကနေ ရနိုင်ပြီး — ဒီလို install လုပ်ပါ:

```bash
npm add --save-dev @types/node
```

ဒီ type definitions တွေကြောင့် — TypeScript က Node.js APIs တွေကို နားလည်နိုင်ပြီး — `fs.readFile` ဒါမှမဟုတ် `http.createServer` လို functions တွေကို သုံးတဲ့အခါ မှန်ကန်တဲ့ type checking နဲ့ autocompletion တွေကို ရရှိစေပါတယ်။ ဥပမာ:

```ts
// @errors: 2345
import { resolve } from 'node:path';

resolve(123, 456);
```

နာမည်ကြီး JavaScript libraries အများစုရဲ့ type definitions တွေကို — DefinitelyTyped community က ထိန်းသိမ်းထားတဲ့ `@types` namespace အောက်မှာ ရှာတွေ့နိုင်ပါတယ်။ ဒါက ရှိပြီးသား JavaScript libraries တွေကို TypeScript projects တွေနဲ့ ချောမွေ့စွာ ပေါင်းစပ်အသုံးပြုနိုင်စေပါတယ်။

#### Transform စွမ်းရည်များ

TypeScript မှာ အားကောင်းတဲ့ transformation စွမ်းရည်တွေလည်း ပါဝင်ပါတယ် — အထူးသဖြင့် JSX (React နဲ့ အလားတူ frameworks တွေမှာ သုံးတဲ့) အတွက်ပါ။ TypeScript compiler က JSX syntax တွေကို — Babel လုပ်ပေးသလိုမျိုး — သာမန် JavaScript အဖြစ် transform လုပ်ပေးနိုင်ပါတယ်။ ဒီ articles တွေမှာ ဒီ transformation features တွေကို အသေးစိတ် မဖော်ပြတော့ပေမယ့် — TypeScript က type checking tool တစ်ခုတည်း မဟုတ်ဘဲ — ခေတ်မီ JavaScript syntax တွေကို မတူညီတဲ့ environments တွေနဲ့ လိုက်ဖက်တဲ့ version တွေအဖြစ် ပြောင်းလဲပေးတဲ့ build tool တစ်ခုလည်း ဖြစ်တယ်ဆိုတာကိုတော့ မှတ်သားထားသင့်ပါတယ်။

### TypeScript code တွေကို ဘယ်လို run မလဲ

ကောင်းပြီ — ဒါဆိုရင် TypeScript code တချို့ ရှိပြီ။ အခု ဘယ်လို run မလဲ?

TypeScript code တွေကို run ဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ် — ဒါတွေအားလုံးကို နောက်လာမယ့် articles တွေမှာ အသေးစိတ် ဖော်ပြသွားမှာ ဖြစ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [TypeScript Native အသုံးပြုခြင်း](/docs/nodejs/running-typescript-natively) — transpile မလိုဘဲ Node.js မှာ TypeScript run ခြင်း
- [Transpilation ဖြင့် TypeScript သုံးခြင်း](/docs/nodejs/running-typescript-code-using-transpilation) — `tsc` နဲ့ compile လုပ်ပြီး run ခြင်း
- [TS Runner (tsx) သုံးခြင်း](/docs/nodejs/running-typescript-with-a-runner) — ts-node/tsx လို runner တွေနဲ့ run ခြင်း
- [TypeScript Package ထုတ်ဝေခြင်း](/docs/nodejs/publishing-a-typescript-package) — TypeScript package တွေကို npm မှာ ထုတ်ဝေခြင်း
