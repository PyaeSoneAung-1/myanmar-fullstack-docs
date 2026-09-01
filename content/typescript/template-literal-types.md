---
title: "Template Literal Types (Template Literal Type များ)"
description: "Template literal types — string literal types တွေကို template literal နဲ့ ပေါင်းစပ်ခြင်း, inference နဲ့ intrinsic string manipulation types (Uppercase/Lowercase/Capitalize/Uncapitalize)"
order: 12
source: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html"
status: translated
updated: 2026-09-01
---

## Template Literal Types ဆိုတာ ဘာလဲ

Template literal types တွေက [string literal types](/docs/typescript/everyday-types) ပေါ်မှာ တည်ဆောက်ထားပြီး — unions တွေကနေတစ်ဆင့် strings အများကြီးဆီ ချဲ့ထွက်နိုင်တဲ့ စွမ်းရည် ရှိပါတယ်။

[JavaScript ထဲက template literal strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) တွေနဲ့ syntax အတူတူပဲ ဖြစ်ပေမယ့် — type နေရာတွေမှာ သုံးပါတယ်။ Concrete literal types တွေနဲ့ သုံးတဲ့အခါ template literal က contents တွေကို ပေါင်းစပ်ပြီး string literal type အသစ်တစ်ခု ထုတ်လုပ်ပေးပါတယ်:

```ts
type World = "world";

type Greeting = `hello ${World}`;
```

Interpolated လုပ်ထားတဲ့ နေရာမှာ union တစ်ခု သုံးထားရင် — type က union member တစ်ခုချင်းစီက ကိုယ်စားပြုနိုင်တဲ့ string literal တိုင်းရဲ့ set ဖြစ်ပါတယ်:

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
```

Template literal ထဲက interpolated နေရာတစ်ခုချင်းစီအတွက် — unions တွေက cross multiply (တစ်ခုနဲ့တစ်ခု မြှောက်ပေါင်း) လုပ်ပါတယ်:

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
```

ကြီးမားတဲ့ string unions တွေအတွက်တော့ — ahead-of-time generation (ကြိုတင် ထုတ်လုပ်ခြင်း) ကို သုံးဖို့ ယေဘုယျအားဖြင့် အကြံပြုပါတယ် — ဒါပေမယ့် သေးငယ်တဲ့ cases တွေမှာတော့ ဒါက အသုံးဝင်ပါတယ်။

### Types တွေထဲက String Unions

Template literals တွေရဲ့ အစွမ်းက — type တစ်ခုထဲက အချက်အလက်တွေကို အခြေခံပြီး string အသစ်တစ်ခု သတ်မှတ်တဲ့အခါ ထွက်ပေါ်လာပါတယ်။

`makeWatchedObject` ဆိုတဲ့ function တစ်ခုက ပေးလိုက်တဲ့ object ပေါ်ကို `on()` ဆိုတဲ့ function အသစ်တစ်ခု ထည့်ပေးတဲ့ ကိစ္စကို စဉ်းစားကြည့်ရအောင်။ JavaScript မှာ သူ့ရဲ့ call က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်: `makeWatchedObject(baseObject)`။ Base object ကို ဒီလိုမျိုး မြင်ယောင်ကြည့်နိုင်ပါတယ်:

```ts
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

Base object ပေါ်ကို ထည့်ပေးမယ့် `on` function က arguments နှစ်ခု မျှော်လင့်ပါတယ် — `eventName` တစ်ခု (`string`) နဲ့ `callback` တစ်ခု (`function`)။

`eventName` က `attributeInThePassedObject + "Changed"` ပုံစံမျိုး ဖြစ်ရမှာပါ; ဒါကြောင့် base object ထဲက `firstName` attribute ကနေ ဆင်းသက်လာတဲ့ `firstNameChanged` လိုမျိုးပါ။

`callback` function ကို ခေါ်တဲ့အခါ:
  * `attributeInThePassedObject` နာမည်နဲ့ ဆက်စပ်နေတဲ့ type ရဲ့ value တစ်ခုကို ပေးရပါမယ်; ဒါကြောင့် `firstName` ကို `string` လို့ typed လုပ်ထားတာမို့ — `firstNameChanged` event ရဲ့ callback က call လုပ်ချိန်မှာ `string` တစ်ခု လက်ခံရပါမယ်။ အလားတူ `age` နဲ့ ဆက်စပ်တဲ့ events တွေက `number` argument နဲ့ ခေါ်ခံရမှာ ဖြစ်ပါတယ်
  * `void` return type ရှိရပါမယ် (ရှင်းလင်းစွာ ပြသဖို့အတွက်ပါ)

ဒါဆိုရင် `on()` ရဲ့ နုံအတဲ့ (naive) function signature က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်: `on(eventName: string, callback: (newValue: any) => void)`။ ဒါပေမယ့် — အပေါ်က ဖော်ပြချက်ထဲမှာ code ထဲမှာ မှတ်တမ်းတင်ချင်တဲ့ အရေးကြီးတဲ့ type constraints တွေကို ဖော်ထုတ်ခဲ့ပါတယ်။ Template Literal types တွေက ဒီ constraints တွေကို ကျွန်တော်တို့ရဲ့ code ထဲကို ယူဆောင်လာနိုင်စေပါတယ်:

```ts
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject က anonymous Object ပေါ်ကို `on` ထည့်ပေးထားပါတယ်

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

`on` က `"firstNameChanged"` event ကို နားထောင်တာ သတိပြုပါ — `"firstName"` တင်မဟုတ်ပါဘူး။ `on()` ရဲ့ naive specification က — အရည်အချင်းရှိတဲ့ event နာမည်တွေရဲ့ set ကို watched object ထဲက attribute နာမည်တွေရဲ့ union ကို "Changed" နဲ့ အဆုံးသတ်ထားတာနဲ့ ကန့်သတ်ထားမယ်ဆိုရင် ပိုခိုင်မာလာနိုင်ပါတယ်။ ဒီလို တွက်ချက်မှုမျိုး JavaScript ထဲမှာ ``Object.keys(passedObject).map(x => `${x}Changed`)`` လိုမျိုး လုပ်ဖို့ အဆင်ပြေပေမယ့် — _type system ထဲက_ template literals တွေက string manipulation အတွက် အလားတူ နည်းလမ်းတစ်ခု ပေးပါတယ်:

```ts
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

// `on` method ပါတဲ့ "watched object" တစ်ခု ဖန်တီးပါ
// properties တွေရဲ့ အပြောင်းအလဲတွေကို စောင့်ကြည့်ဖို့ပါ
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

ဒါနဲ့ဆိုရင် — မှားတဲ့ property ပေးလိုက်တဲ့အခါ error တက်စေတဲ့ အရာတစ်ခုကို တည်ဆောက်နိုင်ပါတယ်:

```ts
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// လူသားတွေရဲ့ လွယ်ကူတဲ့ အမှားကို တားဆီးပေးပါတယ် (event နာမည်အစား key ကို သုံးမိတာ)
person.on("firstName", () => {});

// စာလုံးပေါင်း အမှားတွေကိုလည်း ခံနိုင်ရည်ရှိပါတယ်
person.on("frstNameChanged", () => {});
```

### Template Literals နဲ့ Inference

မူရင်း passed object ထဲက အချက်အလက်တွေ အားလုံးကနေ အကျိုး မခံစားရခဲ့တာ သတိပြုမိပါလိမ့်မယ်။ `firstName` တစ်ခု ပြောင်းလဲမှု (ဥပမာ `firstNameChanged` event တစ်ခု) ပေးထားတဲ့အခါ — callback က `string` type ရဲ့ argument တစ်ခု လက်ခံရမယ်လို့ မျှော်လင့်သင့်ပါတယ်။ အလားတူ — `age` ရဲ့ အပြောင်းအလဲအတွက် callback က `number` argument တစ်ခု လက်ခံရပါမယ်။ `callback` ရဲ့ argument ကို type လုပ်ဖို့ `any` ကို နုံနုံအာအ သုံးနေပါတယ်။ ဒီတစ်ခါလည်း template literal types တွေက — attribute တစ်ခုရဲ့ data type က အဲဒီ attribute ရဲ့ callback ရဲ့ ပထမ argument ရဲ့ type နဲ့ အတူတူဖြစ်အောင် သေချာစေဖို့ ဖြစ်နိုင်စေပါတယ်။

ဒါကို ဖြစ်နိုင်စေတဲ့ အဓိက ထိုးထွင်းသိမြင်မှုက ဒါပါ: generic ပါတဲ့ function တစ်ခုကို သုံးနိုင်ပြီး:

1. ပထမ argument မှာ သုံးထားတဲ့ literal ကို literal type အဖြစ် ဖမ်းယူပါတယ်
2. အဲဒီ literal type က generic ထဲက valid attributes တွေရဲ့ union ထဲမှာ ရှိမရှိ validate လုပ်ပါတယ်
3. Validate လုပ်ပြီးတဲ့ attribute ရဲ့ type ကို Indexed Access သုံးပြီး generic ရဲ့ structure ထဲမှာ ရှာဖွေပါတယ်
4. အဲဒီ typing information ကို _ပြီးတော့မှ_ callback function ရဲ့ argument က ဒီ type အတိုင်း ဖြစ်အောင် သေချာစေဖို့ သက်ရောက်စေနိုင်ပါတယ်

```ts
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
    console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", newAge => {
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})
```

ဒီမှာ `on` ကို generic method တစ်ခု ဖြစ်အောင် လုပ်လိုက်ပါတယ်။

User က `"firstNameChanged"` ဆိုတဲ့ string နဲ့ ခေါ်လိုက်တဲ့အခါ — TypeScript က `Key` အတွက် မှန်ကန်တဲ့ type ကို infer လုပ်ဖို့ ကြိုးစားပါတယ်။ အဲဒါလုပ်ဖို့ `Key` ကို `"Changed"` ရဲ့ ရှေ့က contents နဲ့ ယှဉ်ပြီး `"firstName"` ဆိုတဲ့ string ကို infer လုပ်ပါတယ်။ TypeScript အဲဒါကို တွက်မိပြီဆိုတာနဲ့ — `on` method က မူရင်း object ပေါ်က `firstName` ရဲ့ type ကို ရယူနိုင်ပါတယ် — ဒီကိစ္စမှာဆိုရင် `string` ပါ။ အလားတူ — `"ageChanged"` နဲ့ ခေါ်တဲ့အခါ TypeScript က `age` property အတွက် type — `number` ကို ရှာတွေ့ပါတယ်။

Inference ကို နည်းလမ်းအမျိုးမျိုးနဲ့ ပေါင်းစပ်နိုင်ပါတယ် — မကြာခဏဆိုသလို strings တွေကို deconstruct လုပ်ပြီး နည်းလမ်းအမျိုးမျိုးနဲ့ ပြန်တည်ဆောက်ဖို့ပါ။

## Intrinsic String Manipulation Types

String manipulation ကို ကူညီဖို့ — TypeScript မှာ string manipulation အတွက် သုံးလို့ရတဲ့ type အုပ်စုတစ်စု ပါဝင်ပါတယ်။ ဒီ types တွေက performance အတွက် compiler ထဲမှာ built-in ဖြစ်ပြီး — TypeScript နဲ့ ပါလာတဲ့ `.d.ts` files တွေထဲမှာ တွေ့လို့ မရပါဘူး။

### `Uppercase<StringType>`

String ထဲက စာလုံးတိုင်းကို uppercase (စာလုံးကြီး) ဗားရှင်းအဖြစ် ပြောင်းပေးပါတယ်။

##### ဥပမာ

```ts
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
```

### `Lowercase<StringType>`

String ထဲက စာလုံးတိုင်းကို lowercase (စာလုံးသေး) အညီအမျှ အဖြစ် ပြောင်းပေးပါတယ်။

##### ဥပမာ

```ts
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
```

### `Capitalize<StringType>`

String ထဲက ပထမဆုံး စာလုံးကို uppercase အညီအမျှ အဖြစ် ပြောင်းပေးပါတယ်။

##### ဥပမာ

```ts
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
```

### `Uncapitalize<StringType>`

String ထဲက ပထမဆုံး စာလုံးကို lowercase အညီအမျှ အဖြစ် ပြောင်းပေးပါတယ်။

##### ဥပမာ

```ts
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
```

**Intrinsic string manipulation types တွေရဲ့ နည်းပညာ အသေးစိတ်** — TypeScript 4.1 မှာ ဒီ intrinsic functions တွေရဲ့ code က JavaScript string runtime functions တွေကို တိုက်ရိုက် သုံးပြီး manipulation လုပ်ပါတယ် — locale ကို သတိမထားပါဘူး:

```ts
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}
```
