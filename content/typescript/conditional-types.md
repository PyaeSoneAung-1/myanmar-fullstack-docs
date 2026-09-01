---
title: "Conditional Types (Conditional Type များ)"
description: "Conditional types — extends စစ်ဆေးမှု, conditional type constraints, infer keyword နဲ့ distributive conditional types အကြောင်း"
order: 10
source: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html"
status: translated
updated: 2026-09-01
---

## Conditional Types ဆိုတာ ဘာလဲ

အသုံးဝင်တဲ့ program အများစုရဲ့ ဗဟိုမှာ — input တွေအပေါ် အခြေခံပြီး ဆုံးဖြတ်ချက်တွေ ချရပါတယ်။ JavaScript programs တွေလည်း ချွင်းချက် မဟုတ်ပါဘူး — ဒါပေမယ့် values တွေကို အလွယ်တကူ စစ်ဆေးလို့ရတာမို့ အဲဒီဆုံးဖြတ်ချက်တွေက inputs တွေရဲ့ types တွေအပေါ်မှာလည်း အခြေခံပါတယ်။ _Conditional types_ တွေက input နဲ့ output types တွေကြားက ဆက်စပ်မှုကို ဖော်ပြဖို့ ကူညီပေးပါတယ်။

```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;

type Example2 = RegExp extends Animal ? number : string;
```

Conditional types တွေက JavaScript ထဲက conditional expressions (`condition ? trueExpression : falseExpression`) နဲ့ ပုံစံတူပါတယ်:

```ts
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff = SomeType extends OtherType ? TrueType : FalseType;
```

`extends` ရဲ့ ဘယ်ဘက်က type က ညာဘက်က type ဆီ assign လို့ရတဲ့အခါ — ပထမ branch (the "true" branch) ရဲ့ type ကို ရပါတယ်; မရနိုင်ရင် — နောက် branch (the "false" branch) ရဲ့ type ကို ရပါတယ်။

အပေါ်က ဥပမာတွေကြည့်ရင် conditional types တွေက ချက်ချင်း အသုံးဝင်ပုံ မပေါ်နိုင်ပါဘူး — `Dog extends Animal` ဟုတ်မဟုတ် ကိုယ့်ဘာသာ ပြောပြီး `number` ဒါမှမဟုတ် `string` ရွေးလို့ရတာပဲလေ! ဒါပေမယ့် conditional types ရဲ့ အစွမ်းက generics တွေနဲ့ တွဲသုံးတဲ့အခါမှာ ထွက်ပေါ်လာပါတယ်။

ဥပမာ — အောက်ပါ `createLabel` function ကို ကြည့်ရအောင်:

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

createLabel အတွက် ဒီ overloads တွေက — inputs တွေရဲ့ types တွေအပေါ် အခြေခံပြီး ဆုံးဖြတ်ချက်ချတဲ့ JavaScript function တစ်ခုတည်းကို ဖော်ပြပါတယ်။ အချက်တချို့ သတိပြုပါ:

1. Library တစ်ခုက ဒီလိုမျိုး ဆုံးဖြတ်ချက်မျိုး API တစ်လျှောက်လုံးမှာ ထပ်ခါထပ်ခါ ချနေရရင် — ဒါက ပင်ပန်းစရာ ဖြစ်လာပါတယ်။
2. Overload သုံးခု ဖန်တီးရပါတယ်: type ကို _သေချာ_ သိတဲ့ case တစ်ခုချင်းစီအတွက် တစ်ခုစီ (`string` အတွက် တစ်ခု ၊ `number` အတွက် တစ်ခု) ၊ ပြီးတော့ အယေဘုယျဆုံး case အတွက် တစ်ခု (`string | number` လက်ခံတဲ့ဟာ)။ `createLabel` ကိုင်တွယ်နိုင်တဲ့ type အသစ်တိုင်းအတွက် overload အရေအတွက်က exponential လို တိုးလာပါတယ်။

အဲဒီအစား — အဲဒီ logic ကို conditional type တစ်ခုထဲမှာ ထည့်သွင်းနိုင်ပါတယ်:

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

ပြီးတော့ အဲဒီ conditional type ကိုသုံးပြီး overloads တွေကို overload မပါတဲ့ function တစ်ခုတည်းဆီ ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်:

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");

let b = createLabel(2.8);

let c = createLabel(Math.random() ? "hello" : 42);
```

### Conditional Type Constraints (Conditional Type Constraints များ)

မကြာခဏဆိုသလို — conditional type ထဲက checks တွေက အချက်အလက်သစ် တချို့ ပေးပါတယ်။ Type guards တွေနဲ့ narrowing လုပ်တာက type ပိုတိကျတာကို ပေးသလိုပဲ — conditional type ရဲ့ true branch က generics တွေကို ကျွန်တော်တို့ check လုပ်တဲ့ type နဲ့ ထပ်ပြီး ကန့်သတ်ပေးပါတယ်။

ဥပမာ — အောက်ပါဟာကို ကြည့်ရအောင်:

```ts
type MessageOf<T> = T["message"];
```

ဒီဥပမာမှာ `T` မှာ `message` ဆိုတဲ့ property ရှိတယ်လို့ မသိတာမို့ TypeScript က error တက်ပါတယ်။ `T` ကို constrain လုပ်လိုက်ရင် TypeScript က မကျေနပ်တော့ပါဘူး:

```ts
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
```

ဒါပေမယ့် — `MessageOf` ကို type ဘယ်ဟာမဆို လက်ခံပြီး — `message` property မရှိရင် `never` လိုမျိုး default ပြန်ပေးစေချင်ရင်ကော? Constraint ကို ဖယ်ထုတ်ပြီး conditional type တစ်ခု မိတ်ဆက်ခြင်းအားဖြင့် ဒါကို လုပ်လို့ရပါတယ်:

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;

type DogMessageContents = MessageOf<Dog>;
```

True branch ထဲမှာ — TypeScript က `T` မှာ `message` property _ရှိမယ်_ ဆိုတာ သိပါတယ်။

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — array types တွေကို သူတို့ရဲ့ element types တွေဆီ flatten လုပ်ပြီး — ကျန်တဲ့ types တွေကိုတော့ မပြောင်းဘဲ ထားတဲ့ `Flatten` ဆိုတဲ့ type ကို ရေးလို့ရပါတယ်:

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

// Element type ကို ထုတ်ယူပါတယ်
type Str = Flatten<string[]>;

// Type ကို မပြောင်းဘဲ ထားပါတယ်
type Num = Flatten<number>;
```

`Flatten` ကို array type တစ်ခု ပေးလိုက်ရင် — `string[]` ရဲ့ element type ကို ထုတ်ယူဖို့ `number` နဲ့ indexed access ကို သုံးပါတယ်။ မဟုတ်ရင် — ပေးလိုက်တဲ့ type ကိုပဲ ပြန်ပေးပါတယ်။

### Conditional Types ထဲမှာ Inferring (ကောက်ချက်ချခြင်း)

Conditional types တွေကိုသုံးပြီး constraints တွေ သက်ရောက်ပြီး types တွေ ထုတ်ယူနေတာ တွေ့ခဲ့ရပါတယ်။ ဒါက အရမ်းအသုံးများတဲ့ လုပ်ဆောင်ချက်ဖြစ်လို့ — conditional types တွေက အဲဒါကို ပိုလွယ်ကူစေပါတယ်။

Conditional types တွေက true branch ထဲမှာ ကျွန်တော်တို့ နှိုင်းယှဉ်တဲ့ types တွေကနေ `infer` keyword ကိုသုံးပြီး infer (ကောက်ချက်ချ) လုပ်ဖို့ နည်းလမ်း ပေးပါတယ်။ ဥပမာ — `Flatten` ထဲက element type ကို indexed access type နဲ့ "ကိုယ်တိုင်" ထုတ်ယူမယ့်အစား infer လုပ်နိုင်ပါတယ်:

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

ဒီမှာ `infer` keyword ကိုသုံးပြီး — true branch ထဲမှာ `Type` ရဲ့ element type ကို ဘယ်လို ထုတ်ယူရမယ်ဆိုတာ သတ်မှတ်စရာမလိုဘဲ `Item` ဆိုတဲ့ generic type variable အသစ်တစ်ခုကို declarative ပုံစံနဲ့ မိတ်ဆက်လိုက်ပါတယ်။ ဒါက ကျွန်တော်တို့ စိတ်ဝင်စားတဲ့ types တွေရဲ့ structure ကို တူးဆွနေဖို့ ဒါမှမဟုတ် ခွဲစိတ်ကြည့်ဖို့ စဉ်းစားစရာကနေ လွတ်မြောက်စေပါတယ်။

`infer` keyword ကိုသုံးပြီး အသုံးဝင်တဲ့ helper type aliases တွေ ရေးလို့ရပါတယ်။ ဥပမာ — ရိုးရှင်းတဲ့ cases တွေမှာ function types တွေကနေ return type ကို ထုတ်ယူနိုင်ပါတယ်:

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;

type Str = GetReturnType<(x: string) => string>;

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

Call signatures အများကြီး ပါတဲ့ type ကနေ infer လုပ်တဲ့အခါ (overloaded function တစ်ခုရဲ့ type လိုမျိုး) — inferences တွေက _နောက်ဆုံး_ signature ကနေ လုပ်ပါတယ် (အဲဒါက ဖြစ်နိုင်ခြေ အရှိဆုံး catch-all case ဖြစ်လို့ပါ)။ Argument types တွေရဲ့ list ပေါ်အခြေခံပြီး overload resolution လုပ်ဖို့တော့ မဖြစ်နိုင်ပါဘူး:

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
```

## Distributive Conditional Types (Distributive Conditional Types များ)

Conditional types တွေက generic type တစ်ခုပေါ်မှာ အလုပ်လုပ်တဲ့အခါ — union type တစ်ခု ပေးလိုက်ရင် _distributive_ ဖြစ်သွားပါတယ်။ ဥပမာ — အောက်ပါဟာကို ကြည့်ရအောင်:

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
```

`ToArray` ထဲကို union type တစ်ခု ထည့်လိုက်ရင် — conditional type က အဲဒီ union ရဲ့ member တစ်ခုချင်းစီအပေါ်ကို သက်ရောက်ပါလိမ့်မယ်:

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
```

ဒီမှာ ဖြစ်သွားတာက — `ToArray` က ဒီအပေါ်မှာ distribute လုပ်ပါတယ်:

```ts
type StrArrOrNumArr = string | number;
```

ပြီးတော့ union ရဲ့ member type တစ်ခုချင်းစီအပေါ်ကို map လုပ်ပြီး — ထိရောက်စွာတော့:

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string> | ToArray<number>;
```

ဖြစ်သွားပြီး — ကျွန်တော်တို့ဆီမှာ:

```ts
type StrArrOrNumArr = string[] | number[];
```

ကျန်ခဲ့ပါတယ်။

ပုံမှန်အားဖြင့် — distributivity က လိုချင်တဲ့ အပြုအမူပါ။ အဲဒီအပြုအမူကို ရှောင်ချင်ရင် — `extends` keyword ရဲ့ ဘယ်ဘက်ခြမ်းတစ်ခုစီကို square brackets တွေနဲ့ ဝိုင်းထားနိုင်ပါတယ်:

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'ArrOfStrOrNum' က union မဟုတ်တော့ပါဘူး
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
```
