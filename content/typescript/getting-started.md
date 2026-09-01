---
title: "TypeScript မိတ်ဆက်"
description: "TypeScript ဆိုတာ ဘာလဲ၊ type စနစ်က ဘာကြောင့် အသုံးဝင်လဲ၊ tsc နဲ့ စတင်အသုံးပြုခြင်း"
order: 1
source: "https://www.typescriptlang.org/docs/handbook/intro.html"
status: translated
updated: 2026-09-01
---

## TypeScript ဆိုတာ ဘာလဲ

**TypeScript** က JavaScript ပေါ်မှာ တည်ဆောက်ထားတဲ့ superset ဘာသာစကားတစ်ခုပါ —
JavaScript ရဲ့ လုပ်ဆောင်ချက်အားလုံး ပါဝင်ပြီး အပေါ်ကနေ **type (အမျိုးအစား) စနစ်**
တစ်ခု ထပ်ထည့်ပေးထားပါတယ်။ ဒါကြောင့် JavaScript code အားလုံးက TypeScript မှာ
အလုပ်လုပ်ပါတယ် (valid JS = valid TS)။

TypeScript code ကို browser က တိုက်ရိုက် run လို့မရပါဘူး — **compile** လုပ်ပြီး
JavaScript အဖြစ် ပြောင်းမှသာ run လို့ရပါတယ်။ ဒီပြောင်းတဲ့အဆင့်မှာ TypeScript က
type error တွေကို စစ်ဆေးပေးပါတယ်။

```ts
// TypeScript — function parameter မှာ type သတ်မှတ်ထား
function greet(name: string): string {
  return "မင်္ဂလာပါ, " + name;
}

greet("Hla");  // ✓ OK
greet(42);     // ✗ compile error — number ကို string နေရာမှာ ပို့လို့မရ
```

## ဘာကြောင့် TypeScript သုံးသလဲ

- **Error တွေကို run ချိန်မတိုင်ခင် ဖမ်းမိတယ်** — typo, မှားတဲ့ argument, မရှိတဲ့
  property စတာတွေကို editor ထဲမှာတင် မြင်ရတယ်
- **Better autocomplete** — editor က variable တွေရဲ့ shape ကို သိထားလို့
  code completion ပိုကောင်းတယ်
- **Code ကို ကိုယ့်ကိုယ်ကို documentation ဖြစ်စေတယ်** — type က function က
  ဘာယူပြီး ဘာပြန်လဲ ရှင်းရှင်းလင်းလင်း ဖော်ပြတယ်
- **Refactor လုပ်ရတာ လုံခြုံတယ်** — ဘယ်နေရာမှာ ဘာတွေ ပြောင်းရမယ်ဆိုတာ
  compiler က ပြောပြတယ်
- **ကြီးတဲ့ project တွေမှာ မရှိမဖြစ်** — team တွေနဲ့ အလုပ်လုပ်ရင် နားလည်မှု
  ကွာဟမှု နည်းစေတယ်

## Installation

TypeScript ကို npm နဲ့ install လုပ်ပြီး `tsc` (TypeScript Compiler) နဲ့
compile လုပ်ပါတယ်:

```bash
npm install -g typescript
```

Project တစ်ခုအတွက် local အနေနဲ့ install ချင်ရင်:

```bash
npm install --save-dev typescript
npx tsc --init    # tsconfig.json ဖန်တီးပေးတယ်
```

## ပထမဆုံး TypeScript program

`hello.ts` ဆိုတဲ့ file တစ်ခု ဖန်တီးပြီး:

```ts
interface Person {
  name: string;
  age: number;
}

const person: Person = { name: "Hla", age: 25 };
console.log(`အမည်: ${person.name}, အသက်: ${person.age}`);
```

Compile လုပ်ပြီး run လုပ်ရန်:

```bash
npx tsc hello.ts     # hello.js ထုတ်ပေးတယ်
node hello.js        # output: အမည်: Hla, အသက်: 25
```

`tsc` က type check လုပ်ပြီး error ရှိရင် compile မအောင်မြင်ဘဲ ပြောပြပါတယ်။

## အခြေခံ type တွေ

```ts
const name: string = "Hla";          // စာသား
const age: number = 25;              // ကိန်း
const isActive: boolean = true;      // true / false
const tags: string[] = ["react", "node"];  // array

// Union type — ဖြစ်နိုင်တဲ့ type မျိုးစုံ
const id: string | number = "abc123";

// Object type
const user: { name: string; age: number } = { name: "Hla", age: 25 };

// Interface — object shape ကို သတ်မှတ်
interface Product {
  id: number;
  title: string;
  price: number;
  inStock?: boolean;   // optional — မပါလည်းရ
}
```

## Type inference — type ကို ကိုယ်တိုင်မရေးဘဲ

TypeScript က value တွေကြည့်ပြီး type တွေကို အလိုအလျောက် မှန်းပေးတတ်ပါတယ်
(inference)။ အပေါ်က example တွေမှာ annotation (`: string`) တွေ ရှင်းရှင်းလင်းလင်း
ပြဖို့ ရေးထားပေမယ့် — တကယ်တမ်း မရေးဘဲလည်း compiler က သိပါတယ်:

```ts
let count = 0;    // count က number လို့ အလိုအလျောက် သိ
count = "hello";  // ✗ error — number နေရာမှာ string ထည့်လို့မရ
```

## tsconfig.json — project အတွက် ဆက်တင်များ

`tsc --init` က `tsconfig.json` ဖိုင်ကို ဖန်တီးပေးပြီး compile ဆက်တင်တွေ ထည့်လို့ရပါတယ်:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

- `strict: true` — type safety အတွက် အရေးကြီးဆုံး option။ TypeScript ရဲ့
  strict check တွေအားလုံးကို ဖွင့်ပေးတယ်
- `outDir` / `rootDir` — output နဲ့ input folder တွေ သတ်မှတ်တယ်

## Framework တွေနဲ့ TypeScript

React/Next.js/Node.js အားလုံးက TypeScript ကို first-class အနေနဲ့
ထောက်ပံ့ပါတယ် — `create-next-app` မှာ TypeScript option ရွေးလိုက်ရင်
အားလုံး အဆင်သင့်ပါပြီးသားပါ။ ဒီ site ထဲက [Next.js စတင်ခြင်း](/docs/nextjs/getting-started) နဲ့
[Prisma စတင်ခြင်း](/docs/prisma/getting-started) တွေမှာ TypeScript သုံးထားတာတွေ့ရပါမယ်။
