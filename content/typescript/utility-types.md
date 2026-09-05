---
title: "Utility Types (Utility Type များ)"
description: "TypeScript ရဲ့ utility types များအကြောင်း — Awaited, Partial, Required, Readonly, Record, Pick, Omit, Exclude, Extract, Parameters, ReturnType အစရှိသော type transformation များနှင့် intrinsic string manipulation types များ"
order: 66
source: "https://www.typescriptlang.org/docs/handbook/utility-types.html"
status: translated
updated: 2026-09-05
---

TypeScript က အသုံးများတဲ့ type transformations (type အသွင်ပြောင်းခြင်းများ) တွေကို လွယ်ကူစေဖို့ utility types အများအပြားကို ထောက်ပံ့ပေးပါတယ်။ ဒီ utilities တွေက project အနှံ့ (globally) ရနိုင်ပါတယ်။

## `Awaited<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:
[4.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html)

</blockquote>

ဒီ type က `async` functions တွေထဲက `await` ဒါမှမဟုတ် `Promise`s တွေရဲ့ `.then()` method လိုမျိုး operation တွေကို ပုံစံထုတ်ဖို့ ရည်ရွယ်ထားပါတယ် — အထူးသဖြင့် သူတို့က `Promise`s တွေကို ကိုယ်တိုင်ထပ်ခါထပ်ခါ (recursively) unwrap (အလွှာဖြုတ်ဖွင့်) လုပ်လိုက်တဲ့ နည်းလမ်းကို ပုံစံထုတ်ထားတာပါ။

##### Example (ဥပမာ)

```ts twoslash
type A = Awaited<Promise<string>>;
//   ^?

type B = Awaited<Promise<Promise<number>>>;
//   ^?

type C = Awaited<boolean | Promise<number>>;
//   ^?
```

## `Partial<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html)

</blockquote>

`Type` ရဲ့ properties အားလုံးကို optional (မထည့်လည်း ရသော) ဖြစ်အောင် သတ်မှတ်ထားတဲ့ type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ ဒီ utility က ပေးထားတဲ့ type တစ်ခုရဲ့ subsets (အုပ်စုခွဲများအားလုံး) ကို ကိုယ်စားပြုတဲ့ type တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

##### Example (ဥပမာ)

```ts twoslash
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Required<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

`Type` ရဲ့ properties အားလုံးကို required (မဖြစ်မနေ လိုအပ်သော) ဖြစ်အောင် သတ်မှတ်ထားတဲ့ type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ [`Partial`](https://www.typescriptlang.org/docs/handbook) ရဲ့ ဆန့်ကျင်ဘက်ပါ။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `Readonly<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html)

</blockquote>

`Type` ရဲ့ properties အားလုံးကို `readonly` (ပြန်ပြောင်းလို့မရသော) ဖြစ်အောင် သတ်မှတ်ထားတဲ့ type တစ်ခုကို တည်ဆောက်ပေးပါတယ် — ဆိုလိုတာက တည်ဆောက်လိုက်တဲ့ type ရဲ့ properties တွေကို နောက်တစ်ကြိမ် ပြန်သတ်မှတ် (reassign) လုပ်လို့ မရတော့ပါဘူး။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
```

ဒီ utility က runtime မှာ ကျရှုံးမယ့် assignment expressions တွေကို ကိုယ်စားပြုဖို့ အသုံးဝင်ပါတယ် (ဥပမာ — [frozen object (အေးခဲထားသော object)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) တစ်ခုရဲ့ properties တွေကို ပြန်သတ်မှတ်ဖို့ ကြိုးစားတဲ့အခါမျိုး)။

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html)

</blockquote>

Property keys တွေက `Keys` ဖြစ်ပြီး property values တွေက `Type` ဖြစ်တဲ့ object type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ ဒီ utility ကို type တစ်ခုရဲ့ properties တွေကို အခြား type တစ်ခုဆီ map (ပုံဖော် ပြောင်းလဲ) လုပ်ဖို့ သုံးနိုင်ပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
// ^?
```

## `Pick<Type, Keys>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html)

</blockquote>

`Type` ထဲကနေ `Keys` (string literal တစ်ခု ဒါမှမဟုတ် string literals တွေရဲ့ union) ထဲမှာ ပါဝင်တဲ့ properties အစုကို ရွေးထုတ် (pick) ပြီး type တစ်ခု တည်ဆောက်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[3.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html)

</blockquote>

`Type` ထဲက properties အားလုံးကို ရွေးထုတ်ပြီးမှ — `Keys` (string literal တစ်ခု ဒါမှမဟုတ် string literals တွေရဲ့ union) ထဲမှာ ပါဝင်တဲ့ properties တွေကို ဖယ်ရှားလိုက်ပြီး type တစ်ခု တည်ဆောက်ပေးပါတယ်။ [`Pick`](https://www.typescriptlang.org/docs/handbook) ရဲ့ ဆန့်ကျင်ဘက်ပါ။

##### Example (ဥပမာ)

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;
// ^?

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
// ^?
```

## `Exclude<UnionType, ExcludedMembers>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

`UnionType` ထဲကနေ `ExcludedMembers` ဆီ assignable ဖြစ်တဲ့ union members တွေ အားလုံးကို ဖယ်ထုတ် (exclude) လိုက်ပြီး type တစ်ခု တည်ဆောက်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>
//    ^?
```

## `Extract<Type, Union>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

`Type` ထဲကနေ `Union` ဆီ assignable ဖြစ်တဲ့ union members တွေ အားလုံးကို ထုတ်ယူ (extract) လိုက်ပြီး type တစ်ခု တည်ဆောက်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T2 = Extract<Shape, { kind: "circle" }>
//    ^?
```

## `NonNullable<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

`Type` ထဲကနေ `null` နဲ့ `undefined` တို့ကို ဖယ်ထုတ်လိုက်ပြီး type တစ်ခု တည်ဆောက်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Function type `Type` တစ်ခုရဲ့ parameters တွေမှာ သုံးထားတဲ့ types တွေကနေ tuple type တစ်ခု တည်ဆောက်ပေးပါတယ်။

Overloaded functions တွေအတွက်ကတော့ ဒါက _နောက်ဆုံး_ signature ရဲ့ parameters တွေ ဖြစ်ပါလိမ့်မယ် — [Inferring Within Conditional Types (Conditional Types ထဲတွင် Inferring ပြုလုပ်ခြင်း)](/docs/typescript/conditional-types) မှာ ကြည့်ပါ။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Constructor function type တစ်ခုရဲ့ types တွေကနေ tuple ဒါမှမဟုတ် array type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။ Parameter types အားလုံး ပါဝင်တဲ့ tuple type တစ်ခုကို ထုတ်ပေးပါတယ် — `Type` က function မဟုတ်ရင်တော့ `never` ဆိုတဲ့ type ကို ထုတ်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>;
//    ^?
type T4 = ConstructorParameters<any>;
//    ^?

type T5 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

Function `Type` တစ်ခုရဲ့ return type (ပြန်ပေးသည့် type) ပါဝင်တဲ့ type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။

Overloaded functions တွေအတွက်ကတော့ ဒါက _နောက်ဆုံး_ signature ရဲ့ return type ဖြစ်ပါလိမ့်မယ် — [Inferring Within Conditional Types (Conditional Types ထဲတွင် Inferring ပြုလုပ်ခြင်း)](/docs/typescript/conditional-types) မှာ ကြည့်ပါ။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

</blockquote>

`Type` ထဲက constructor function တစ်ခုရဲ့ instance type (ထို constructor နဲ့ ဖန်တီးလိုက်တဲ့ instances တွေရဲ့ type) ပါဝင်တဲ့ type တစ်ခုကို တည်ဆောက်ပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `NoInfer<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[5.4](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html)

</blockquote>

ပါဝင်တဲ့ type ဆီကို ဦးတည်တဲ့ inferences (type inference — type ကောက်ချက်ချမှုများ) တွေကို ပိတ်ဆို့ပေးပါတယ်။ Inferences တွေကို ပိတ်ဆို့တာကလွဲလို့ — `NoInfer<Type>` က `Type` နဲ့ တူညီပါတယ်။

##### Example (ဥပမာ)

```ts
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red");  // OK
createStreetLight(["red", "yellow", "green"], "blue");  // Error
```

## `ThisParameterType<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

Function type တစ်ခုအတွက် [this](https://www.typescriptlang.org/docs/handbook/functions.html) parameter ရဲ့ type ကို ထုတ်ယူပေးပါတယ် — function type မှာ `this` parameter မရှိရင်တော့ [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html) ကို ထုတ်ယူပေးပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

`Type` ထဲက [`this`](https://www.typescriptlang.org/docs/handbook/functions.html) parameter ကို ဖယ်ရှားပေးပါတယ်။ `Type` မှာ အတိအကျ ကြေညာထားတဲ့ `this` parameter မရှိရင် — ရလဒ်က `Type` အတိုင်းပဲ ဖြစ်ပါတယ်။ ရှိနေရင်တော့ — `Type` ကနေ `this` parameter မပါတဲ့ function type အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။ Generics တွေကို ဖျက်ပစ်ပြီး — နောက်ဆုံး overload signature တစ်ခုတည်းကိုပဲ function type အသစ်ထဲကို သယ်ဆောင်သွားပါတယ်။

##### Example (ဥပမာ)

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

<blockquote class=bg-reading>

ထုတ်ဝေခဲ့သည်:  
[2.3](https://github.com/microsoft/TypeScript/pull/14141)

</blockquote>

ဒီ utility က အသွင်ပြောင်းထားတဲ့ type တစ်ခုကို ပြန်မပေးပါဘူး။ အဲဒီအစား — contextual (နောက်ခံအခြေအနေအရ သတ်မှတ်ပေးသော) [`this`](https://www.typescriptlang.org/docs/handbook/functions.html) type တစ်ခုအတွက် marker (အမှတ်အသား) အဖြစ် ဆောင်ရွက်ပါတယ်။ ဒီ utility ကို သုံးဖို့ [`noImplicitThis`](https://www.typescriptlang.org/tsconfig) flag ကို ဖွင့်ထားရမယ်ဆိုတာ သတိပြုပါ။

##### Example (ဥပမာ)

```ts twoslash
// @noImplicitThis: true
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

အပေါ်က ဥပမာမှာ — `makeObject` ဆီ ပေးလိုက်တဲ့ argument ထဲက `methods` object က `ThisType<D & M>` ပါဝင်တဲ့ contextual type တစ်ခု ရှိပါတယ်။ ဒါကြောင့် `methods` object ထဲက methods တွေရဲ့ [this](https://www.typescriptlang.org/docs/handbook/functions.html) type က `{ x: number, y: number } & { moveBy(dx: number, dy: number): void }` ဖြစ်ပါတယ်။ `methods` property ရဲ့ type က methods တွေထဲက `this` type အတွက် inference target (ကောက်ချက်ချရန် ပစ်မှတ်) တစ်ခုလည်း ဖြစ် — source (ရင်းမြစ်) တစ်ခုလည်း ဖြစ်နေတာကို သတိပြုပါ။

`ThisType<T>` marker interface က `lib.d.ts` ထဲမှာ ကြေညာထားတဲ့ empty interface (အလွတ် interface) တစ်ခုသာ ဖြစ်ပါတယ်။ Object literal တစ်ခုရဲ့ contextual type ထဲမှာ အသိအမှတ်ပြုခံရတာကလွဲလို့ — ဒီ interface က အခြား empty interfaces တွေလိုပဲ ပြုမူပါတယ်။

## Intrinsic String Manipulation Types (ကြိုတင်ပါဝင်ပြီးသား String Manipulation Type များ)

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

Template string literals တွေနဲ့ ပတ်သက်တဲ့ string manipulation (စာကြောင်း ကိုင်တွယ်ခြင်း) ကို အထောက်အကူပြုဖို့ — TypeScript က type system ထဲမှာ string manipulation အတွက် သုံးလို့ရတဲ့ types အစုတစ်ခုကို ထည့်သွင်း ပါဝင်စေပါတယ်။ အဲဒါတွေကို [Template Literal Types (Template Literal Types များ)](/docs/typescript/template-literal-types) documentation မှာ တွေ့နိုင်ပါတယ်။
