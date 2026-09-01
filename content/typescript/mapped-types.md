---
title: "Mapped Types (Mapped Type များ)"
description: "Mapped types — index signatures ပေါ်အခြေခံပြီး type အသစ်တွေ ထုတ်လုပ်ခြင်း, mapping modifiers, key remapping (as clause) နဲ့ filtering"
order: 11
source: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html"
status: translated
updated: 2026-09-01
---

## Mapped Types ဆိုတာ ဘာလဲ

ကိုယ့်ကိုယ်ကို မထပ်ချင်တဲ့အခါ — တစ်ခါတလေ type တစ်ခုက တခြား type တစ်ခုကို အခြေခံဖို့ လိုပါတယ်။

Mapped types တွေက index signatures ရဲ့ syntax ပေါ်မှာ တည်ဆောက်ထားပါတယ် — index signatures ဆိုတာ ကြိုတင် မကြေညာထားတဲ့ properties တွေရဲ့ types တွေကို ကြေညာဖို့ သုံးတာပါ:

```ts
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

Mapped type ဆိုတာ — `PropertyKey` တွေရဲ့ union တစ်ခုကို ([`keyof` ကနေတစ်ဆင့်](/docs/typescript/indexed-access-types) မကြာခဏ ဖန်တီးတာ) သုံးပြီး keys တွေကြားမှာ iterate လုပ်ကာ type တစ်ခု ဖန်တီးတဲ့ generic type တစ်ခုပါ:

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

ဒီဥပမာမှာ `OptionsFlags` က `Type` type ကနေ properties တွေ အားလုံးကို ယူပြီး — သူတို့ရဲ့ values တွေကို boolean အဖြစ် ပြောင်းလိုက်ပါမယ်:

```ts
type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;
```

### Mapping Modifiers (Mapping Modifiers များ)

Mapping လုပ်နေစဉ်မှာ ထပ်ဆင့် modifier နှစ်ခု သက်ရောက်လို့ရပါတယ်: `readonly` နဲ့ `?` — ပထမက mutability (ပြောင်းလဲနိုင်မှု) ကို သက်ရောက်ပြီး ဒုတိယက optionality (optional ဖြစ်မှု) ကို သက်ရောက်ပါတယ်။

ဒီ modifiers တွေကို `-` ဒါမှမဟုတ် `+` ရှေ့ကထည့်ပြီး ဖယ်ရှားလို့ရော ထည့်လို့ရော ရပါတယ်။ Prefix မထည့်ဘူးဆိုရင် `+` လို့ ယူဆပါတယ်။

```ts
// Type ရဲ့ properties တွေကနေ 'readonly' attributes တွေကို ဖယ်ရှားပါတယ်
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
```

```ts
// Type ရဲ့ properties တွေကနေ 'optional' attributes တွေကို ဖယ်ရှားပါတယ်
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
```

## Key Remapping — `as` နဲ့ Key ပြန်သတ်မှတ်ခြင်း

TypeScript 4.1 ကစပြီး — mapped types တွေထဲမှာ `as` clause နဲ့ keys တွေကို ပြန်သတ်မှတ် (re-map) လုပ်လို့ရပါတယ်:

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

[template literal types](/docs/typescript/template-literal-types) လို features တွေကို အသုံးချပြီး — အရင်က keys တွေကနေ property နာမည် အသစ်တွေ ဖန်တီးနိုင်ပါတယ်:

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
```

Conditional type တစ်ခုကနေတစ်ဆင့် `never` ထုတ်လုပ်ခြင်းအားဖြင့် keys တွေကို စစ်ထုတ် (filter) လို့လည်း ရပါတယ်:

```ts
// 'kind' property ကို ဖယ်ရှားပါတယ်
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
```

`string | number | symbol` ရဲ့ unions တွေတင်မကဘဲ — type ဘယ်ဟာမဆို ဖြစ်တဲ့ unions တွေအပေါ်ကိုလည်း map လုပ်လို့ရပါတယ်:

```ts
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
```

### Further Exploration (ဆက်လက်လေ့လာရန်)

Mapped types တွေက ဒီ type manipulation section ထဲက တခြား features တွေနဲ့ ကောင်းကောင်း အလုပ်လုပ်ပါတယ် — ဥပမာ ဒီမှာ [conditional type သုံးထားတဲ့ mapped type](/docs/typescript/conditional-types) တစ်ခုပါ — object တစ်ခုမှာ `pii` property က literal `true` နဲ့ set ထားလားပေါ် မူတည်ပြီး `true` ဒါမှမဟုတ် `false` ပြန်ပေးပါတယ်:

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
```
