---
title: "Indexed Access Types (Indexed Access Type များ)"
description: "Indexed access types (Type['a'] syntax) ကိုသုံးပြီး type တစ်ခုပေါ်က specific property တစ်ခုရဲ့ type ကို ရှာဖွေခြင်း"
order: 9
source: "https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html"
status: translated
updated: 2026-09-01
---

## Indexed Access Types (Indexed Access Type များ)

_indexed access type_ ကိုသုံးပြီး — တခြား type တစ်ခုပေါ်က specific property တစ်ခုရဲ့ type ကို ရှာဖွေနိုင်ပါတယ်:

```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
```

Indexing လုပ်တဲ့ type ကိုယ်တိုင်က type တစ်ခုမို့ — unions တွေ ၊ `keyof` ၊ ဒါမှမဟုတ် တခြား types တွေကို လုံးဝ သုံးလို့ရပါတယ်:

```ts
type Person = { age: number; name: string; alive: boolean };

type I1 = Person["age" | "name"];

type I2 = Person[keyof Person];

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
```

မရှိတဲ့ property ကို index လုပ်ဖို့ ကြိုးစားရင် error တောင်တွေ့ရပါလိမ့်မယ်:

```ts
type Person = { age: number; name: string; alive: boolean };

type I1 = Person["alve"];
```

ကျပန်း type တစ်ခုနဲ့ indexing လုပ်တဲ့ နောက်ထပ် ဥပမာက — array တစ်ခုရဲ့ elements တွေရဲ့ type ကို ရဖို့ `number` သုံးတာပါ။ `typeof` နဲ့ ပေါင်းသုံးရင် array literal တစ်ခုရဲ့ element type ကို အဆင်ပြေပြေ ဖမ်းယူနိုင်ပါတယ်:

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
type Age = typeof MyArray[number]["age"];
// Or
type Age2 = Person["age"];
```

Indexing လုပ်တဲ့အခါ types တွေပဲ သုံးလို့ရပြီး — variable reference လုပ်ဖို့ `const` ကို သုံးလို့ မရပါဘူး:

```ts
type Person = { age: number; name: string; alive: boolean };

const key = "age";
type Age = Person[key];
```

ဒါပေမယ့် — အလားတူ refactor လုပ်ဖို့ type alias ကိုတော့ သုံးလို့ရပါတယ်:

```ts
type Person = { age: number; name: string; alive: boolean };

type key = "age";
type Age = Person[key];
```
