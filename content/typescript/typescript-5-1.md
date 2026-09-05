---
title: "TypeScript 5.1 (TypeScript 5.1 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.1 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — `undefined`-returning function တွေအတွက် implicit return ခွင့်ပြုချက်, getter/setter type များ သီးခြားခွင့်ပြုချက်, JSX type-checking ပြောင်းလဲမှုများ, namespaced JSX attributes, `typeRoots` module resolution, editor feature များ, performance optimizations နဲ့ breaking changes အကြောင်း"
order: 91
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html"
status: translated
updated: 2026-09-05
---

## Easier Implicit Returns for `undefined`-Returning Functions (`undefined` ပြန်ပေးသော Function များအတွက် Implicit Return များ ပိုမိုလွယ်ကူလာခြင်း)

JavaScript မှာ — function တစ်ခုက `return` တစ်ခုကို မထိဘဲ လည်ပတ်ပြီးသွားရင် — `undefined` တန်ဖိုးကို ပြန်ပေးပါတယ်။

```ts
function foo() {
    // no return
}
// x = undefined
let x = foo();
```

ဒါပေမယ့် — TypeScript ရဲ့ အရင်ဗားရှင်းတွေမှာ — return statement လုံးဝ မရှိနိုင်တဲ့ function တွေက `void`- နဲ့ `any`-returning function တွေပဲ ဖြစ်ခဲ့ပါတယ်။
ဆိုလိုတာက — "ဒီ function က `undefined` ပြန်ပေးတယ်" လို့ ရှင်းရှင်းလင်းလင်း ပြောထားရင်တောင် — အနည်းဆုံး return statement တစ်ခု ရှိဖို့ အတင်းအကျပ် တွန်းအားပေးခံခဲ့ရပါတယ်။

```ts
// ✅ fine - we inferred that 'f1' returns 'void'
function f1() {
    // no returns
}
// ✅ fine - 'void' doesn't need a return statement
function f2(): void {
    // no returns
}
// ✅ fine - 'any' doesn't need a return statement
function f3(): any {
    // no returns
}
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
function f4(): undefined {
    // no returns
}
```

ဒါက — `undefined` ပြန်ပေးတဲ့ function တစ်ခုကို API တစ်ချို့က မျှော်လင့်ထားရင် အတော်လေး စိတ်ညစ်စရာ ဖြစ်နိုင်ပါတယ် — `undefined` ကို ရှင်းရှင်းလင်းလင်း return လုပ်တဲ့ statement အနည်းဆုံး တစ်ခု ဒါမှမဟုတ် `return` statement တစ်ခု *နဲ့အတူ* ရှင်းလင်းတဲ့ annotation တစ်ခု ထည့်ထားဖို့ လိုအပ်လို့ပါ။

```ts
declare function takesFunction(f: () => undefined): undefined;
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    // no returns
});
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
takesFunction((): undefined => {
    // no returns
});
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
    return;
});
// ✅ works
takesFunction(() => {
    return undefined;
});
// ✅ works
takesFunction((): undefined => {
    return;
});
```

ဒီအပြုအမူက စိတ်ပျက်စရာကောင်းပြီး ရှုပ်ထွေးစေတာမို့ — အထူးသဖြင့် ကိုယ်ပိုင် ထိန်းချုပ်မှုအောက်မှာ မရှိတဲ့ function တွေကို ခေါ်တဲ့အခါ ပိုဆိုးပါတယ်။
`undefined` ထက် `void` ကို infer လုပ်တာကြားက၊ `undefined`-returning function တစ်ခုက `return` statement လိုအပ်လားဆိုတာကြားက အပြန်အလှန် ဆက်စပ်မှုတွေကို နားလည်ရတာက အာရုံလွှဲစရာ တစ်ခုလို ထင်ရပါတယ်။

ပထမဆုံး — TypeScript 5.1 က `undefined`-returning function တွေကို return statement မပါဘဲ ရှိနေခွင့် ပြုပါတယ်။

```ts
// ✅ Works in TypeScript 5.1!
function f4(): undefined {
    // no returns
}
// ✅ Works in TypeScript 5.1!
takesFunction((): undefined => {
    // no returns
});
```

ဒုတိယအနေနဲ့ — function တစ်ခုမှာ return expression တွေ မရှိဘဲ — `undefined` ပြန်ပေးတဲ့ function တစ်ခုကို မျှော်လင့်နေတဲ့နေရာဆီ ပေးပို့ခံရရင် — TypeScript က အဲဒီ function ရဲ့ return type အတွက် `undefined` ကို infer လုပ်ပါတယ်။

```ts
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    // no returns
});
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
    //                 ^ return type is undefined
    return;
});
```

နောက်ထပ် အလားတူ စိတ်ညစ်စရာ တစ်ချက်ကို ဖြေရှင်းဖို့ — TypeScript ရဲ့ `--noImplicitReturns` option အောက်မှာ — `undefined` ကိုပဲ *သီးသန့်* ပြန်ပေးတဲ့ function တွေက အခုဆို `void` နဲ့ ဆင်တူတဲ့ ခြွင်းချက်တစ်ခု ရပါတယ် — code path တိုင်းက ရှင်းလင်းတဲ့ `return` တစ်ခုနဲ့ အဆုံးသတ်ဖို့ မလိုအပ်တော့ပါဘူး။

```ts
// ✅ Works in TypeScript 5.1 under '--noImplicitReturns'!
function f(): undefined {
    if (Math.random()) {
        // do some stuff...
        return;
    }
}
```

နောက်ထပ် အချက်အလက်အတွက် — [မူရင်း issue](https://github.com/microsoft/TypeScript/issues/36288) နဲ့ [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/53607) တွေမှာ ဖတ်နိုင်ပါတယ်။

## Unrelated Types for Getters and Setters (Getter နှင့် Setter များအတွက် ဆက်စပ်မှုမရှိသော Type များ)

TypeScript 4.3 က `get` နဲ့ `set` accessor တွဲတစ်ခုက type နှစ်မျိုး သတ်မှတ်နိုင်အောင် လုပ်ပေးခဲ့ပါတယ်။

```ts
interface Serializer {
    set value(v: string | number | boolean);
    get value(): string;
}
declare let box: Serializer;
// Allows writing a 'boolean'
box.value = true;
// Comes out as a 'string'
console.log(box.value.toUpperCase());
```

အစပိုင်းမှာ `get` ရဲ့ type က `set` ရဲ့ type ရဲ့ subtype တစ်ခု ဖြစ်ရမယ်လို့ ကျွန်တော်တို့ လိုအပ်ခဲ့ပါတယ်။
ဒါကြောင့်

```ts
box.value = box.value;
```

ဆိုတဲ့ ရေးသားမှုက အမြဲတမ်း တရားဝင် ဖြစ်နေခဲ့ပါတယ်။

ဒါပေမယ့် — သူတို့ရဲ့ getter နဲ့ setter ကြားမှာ လုံးဝ ဆက်စပ်မှုမရှိတဲ့ type တွေ ရှိတဲ့ — ရှိပြီးသား နဲ့ အဆိုပြုထားတဲ့ API တွေ အများကြီး ရှိပါတယ်။
ဥပမာ — အသုံးအများဆုံး ဥပမာတွေထဲက တစ်ခုဖြစ်တဲ့ DOM ထဲက `style` property နဲ့ [`CSSStyleRule`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule) API ကို စဉ်းစားကြည့်ပါ။
style rule တိုင်းမှာ [`CSSStyleDeclaration`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration) တစ်ခု ဖြစ်တဲ့ [a `style` property](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule/style) ရှိပါတယ်;
ဒါပေမယ့် — အဲဒီ property ဆီ ရေးဖို့ ကြိုးစားရင် — string တစ်ခုနဲ့သာ မှန်မှန်ကန်ကန် အလုပ်လုပ်မှာပါ!

TypeScript 5.1 က ယခုဆို — ရှင်းလင်းတဲ့ type annotation တွေ ရှိမယ်ဆိုရင် — `get` နဲ့ `set` accessor property တွေအတွက် လုံးဝ ဆက်စပ်မှုမရှိတဲ့ type တွေကို ခွင့်ပြုပါတယ်။
ဒီ TypeScript ဗားရှင်းက ဒီ built-in interface တွေအတွက် type တွေကို မပြောင်းလဲရသေးပေမယ့် — `CSSStyleRule` ကို အောက်ပါအတိုင်း သတ်မှတ်နိုင်ပါပြီ:

```ts
interface CSSStyleRule {
    // ...
    /** Always reads as a `CSSStyleDeclaration` */
    get style(): CSSStyleDeclaration;
    /** Can only write a `string` here. */
    set style(newValue: string);
    // ...
}
```

ဒါက — `set` accessor တွေက "တရားဝင်" data တွေကိုပဲ လက်ခံဖို့ လိုအပ်ပြီး — `get` accessor တွေက နောက်ခံ state တစ်ချို့ စတင်မသတ်မှတ်ရသေးရင် `undefined` ပြန်ပေးနိုင်တာမျိုး — တခြား pattern တွေကိုပါ ခွင့်ပြုပါတယ်။

```ts
class SafeBox {
    #value: string | undefined;
    // Only accepts strings!
    set value(newValue: string) {
    }
    // Must check for 'undefined'!
    get value(): string | undefined {
        return this.#value;
    }
}
```

တကယ်တော့ — ဒါက `--exactOptionalProperties` အောက်မှာ optional property တွေကို စစ်ဆေးတာနဲ့ ဆင်တူပါတယ်။

[အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/53417) မှာ နောက်ထပ် ဖတ်နိုင်ပါတယ်။

## Decoupled Type-Checking Between JSX Elements and JSX Tag Types (JSX Element များနှင့် JSX Tag Type များကြား သီးခြားခွဲထားသော Type-Checking)

TypeScript မှာ JSX နဲ့ ပတ်သက်ပြီး စိတ်ညစ်စရာ တစ်ခုက — JSX element တိုင်းရဲ့ tag ရဲ့ type အပေါ် လိုအပ်ချက်တွေပါ။

နောက်ခံအကြောင်းအရာအနေနဲ့ — JSX element တစ်ခုက အောက်ပါတို့ထဲက တစ်ခုပါ:

```tsx
// A self-closing JSX tag
<Foo />
// A regular element with an opening/closing tag
<Bar></Bar>
```

`<Foo />` ဒါမှမဟုတ် `<Bar></Bar>` ကို type-check လုပ်တဲ့အခါ — TypeScript က `JSX` လို့ခေါ်တဲ့ namespace တစ်ခုကို အမြဲ ရှာဖွေပြီး — အဲဒီထဲက `Element` လို့ခေါ်တဲ့ type တစ်ခုကို ယူပါတယ် — ဒါမှမဟုတ် ပိုတိုက်ရိုက်ပြောရရင် `JSX.Element` ကို ရှာဖွေပါတယ်။

ဒါပေမယ့် — `Foo` ဒါမှမဟုတ် `Bar` ကိုယ်တိုင်က tag name တွေအဖြစ် သုံးဖို့ တရားဝင် ဟုတ်မဟုတ် စစ်ဆေးဖို့ — TypeScript က အကြမ်းဖျင်း `Foo` ဒါမှမဟုတ် `Bar` က ပြန်ပေးတဲ့ ဒါမှမဟုတ် ဆောက်လုပ်ပေးတဲ့ type တွေကို ယူပြီး `JSX.Element` (ဒါမှမဟုတ် type က constructable ဆိုရင် `JSX.ElementClass` လို့ခေါ်တဲ့ တခြား type တစ်ခု) နဲ့ compatible ဖြစ်မဖြစ် စစ်ဆေးပါတယ်။

ဒီနေရာက ကန့်သတ်ချက်တွေက — `JSX.Element` တစ်ခုတည်းထက် ပိုကျယ်ပြန့်တဲ့ type တစ်ခုကို ပြန်ပေးတဲ့ ဒါမှမဟုတ် "render" လုပ်တဲ့ component တွေကို မသုံးနိုင်အောင် ဖြစ်စေခဲ့ပါတယ်။
ဥပမာ — JSX library တစ်ခုက `string` တွေ ဒါမှမဟုတ် `Promise` တွေ ပြန်ပေးတဲ့ component တွေကို လက်ခံဖို့ အဆင်ပြေနိုင်ပါတယ်။

ပိုတိကျတဲ့ ဥပမာတစ်ခုအနေနဲ့ — [React က `Promise` တွေ ပြန်ပေးတဲ့ component တွေအတွက် ကန့်သတ်ထားတဲ့ ပံ့ပိုးမှုတစ်ခု ထည့်သွင်းဖို့ စဉ်းစားနေပါတယ်](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md) — ဒါပေမယ့် — ရှိပြီးသား TypeScript ဗားရှင်းတွေက `JSX.Element` ရဲ့ type ကို တစ်စုံတစ်ယောက်က အကြီးအကျယ် လျှော့ချမပေးဘူးဆိုရင် အဲဒါကို ဖော်ပြနိုင်စွမ်း မရှိပါဘူး။

```tsx
import * as React from "react";
async function Foo() {
    return <div></div>;
}
let element = <Foo />;
//             ~~~
// 'Foo' cannot be used as a JSX component.
//   Its return type 'Promise<Element>' is not a valid JSX element.
```

ဒါကို ဖော်ပြနိုင်ဖို့ library တွေကို နည်းလမ်းတစ်ခု ပေးဖို့ — TypeScript 5.1 က `JSX.ElementType` လို့ခေါ်တဲ့ type တစ်ခုကို ယခုဆို ရှာဖွေပါတယ်။
`ElementType` က JSX element တစ်ခုထဲမှာ tag အဖြစ် သုံးဖို့ ဘာက တရားဝင်လဲဆိုတာကို တိကျစွာ သတ်မှတ်ပေးပါတယ်။
ဒါကြောင့် ဒီနေ့ခေတ်မှာ ဒီလိုမျိုး type သတ်မှတ်ထားနိုင်ပါတယ်:

```tsx
namespace JSX {
    export type ElementType =
        // All the valid lowercase tags
        keyof IntrinsicAttributes
        // Function components
        (props: any) => Element
        // Class components
        new (props: any) => ElementClass;
    export interface IntrinsicAttributes extends /*...*/ {}
    export type Element = /*...*/;
    export type ElementClass = /*...*/;
}
```

ဒီ [ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/51328) ကို ပံ့ပိုးပေးခဲ့တဲ့ [Sebastian Silbermann](https://github.com/eps1lon) ကို ကျေးဇူးတင်ပါတယ်!

## Namespaced JSX Attributes (Namespace ဖြင့် ခွဲထားသော JSX Attribute များ)

TypeScript က JSX သုံးတဲ့အခါ namespaced attribute name တွေကို ယခုဆို ပံ့ပိုးပါတယ်။

```tsx
import * as React from "react";
// Both of these are equivalent:
const x = <Foo a:b="hello" />;
const y = <Foo a : b="hello" />;
interface FooProps {
    "a:b": string;
}
function Foo(props: FooProps) {
    return <div>{props["a:b"]}</div>;
}
```

Namespaced tag name တွေကို — နာမည်ရဲ့ ပထမ segment က lowercase name တစ်ခုဆိုရင် — `JSX.IntrinsicAttributes` ပေါ်မှာ အလားတူ နည်းလမ်းနဲ့ ရှာဖွေပါတယ်။

```tsx
// In some library's code or in an augmentation of that library:
namespace JSX {
    interface IntrinsicElements {
        ["a:b"]: { prop: string };
    }
}
// In our code:
let x = <a:b prop="hello!" />;
```

ဒီ [ပံ့ပိုးမှု](https://github.com/microsoft/TypeScript/pull/53799) ကို [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်။

## `typeRoots` Are Consulted In Module Resolution (Module Resolution တွင် `typeRoots` များကို တိုင်ပင်ခြင်း)

TypeScript ရဲ့ သတ်မှတ်ထားတဲ့ module lookup strategy က path တစ်ခုကို resolve လုပ်နိုင်စွမ်း မရှိတဲ့အခါ — သတ်မှတ်ထားတဲ့ `typeRoots` တွေနဲ့ ဆက်စပ်ပြီး package တွေကို အခုဆို resolve လုပ်ပါလိမ့်မယ်။

အသေးစိတ်အတွက် [ဒီ pull request](https://github.com/microsoft/TypeScript/pull/51715) ကို ကြည့်ပါ။

## Move Declarations to Existing Files (Declaration များကို ရှိပြီးသား File များဆီ ရွှေ့ပြောင်းခြင်း)

Declaration တွေကို file အသစ်တွေဆီ ရွှေ့ပြောင်းတာအပြင် — TypeScript က declaration တွေကို ရှိပြီးသား file တွေဆီ ရွှေ့ပြောင်းခြင်းအတွက် preview feature တစ်ခုကိုပါ ယခုဆို တင်ပို့ပါတယ်။
ဒီလုပ်ဆောင်ချက်ကို Visual Studio Code ရဲ့ မကြာသေးခင်က ဗားရှင်းတစ်ခုမှာ စမ်းသုံးကြည့်နိုင်ပါတယ်။

![workspace ထဲက ရှိပြီးသား file တစ်ခုဆီ 'getThanks' function တစ်ခုကို ရွှေ့ပြောင်းနေပုံ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/05/moveToFile-5.1-preview.gif)

ဒီ feature က လောလောဆယ် preview အဆင့်မှာ ရှိနေတယ်ဆိုတာ သတိပြုပါ — နောက်ထပ် တုံ့ပြန်ချက်တွေကို ရှာဖွေနေပါတယ်။

https://github.com/microsoft/TypeScript/pull/53542

## Linked Cursors for JSX Tags (JSX Tag များအတွက် Linked Cursor များ)

TypeScript က JSX tag name တွေအတွက် *linked editing* ကို ယခုဆို ပံ့ပိုးပါတယ်။
Linked editing (တစ်ခါတစ်ရံ "mirrored cursors" လို့ ခေါ်ပါတယ်) က editor တစ်ခုကို နေရာမျိုးစုံကို တစ်ပြိုင်နက်တည်း အလိုအလျောက် တည်းဖြတ်နိုင်စေပါတယ်။

![JSX fragment တစ်ခုနဲ့ div element တစ်ခုကို linked editing နဲ့ ပြင်ဆင်နေတဲ့ JSX tag တွေရဲ့ ဥပမာ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/04/linkedEditingJsx-5.1-1.gif)

ဒီ feature အသစ်က TypeScript ရော JavaScript file တွေမှာပါ အလုပ်လုပ်သင့်ပြီး — Visual Studio Code Insiders မှာ enable လုပ်နိုင်ပါတယ်။
Visual Studio Code မှာ — Settings UI ထဲက `Editor: Linked Editing` option ကို ပြင်ဆင်နိုင်သလို:

![Visual Studio Code ရဲ့ Editor: Linked Editing option](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/04/linkedEditing-5.1-vscode-ui-1.png)

သင့်ရဲ့ JSON settings file ထဲမှာ `editor.linkedEditing` ကိုလည်း configure လုပ်နိုင်ပါတယ်:

```jsonc
{
    // ...
    "editor.linkedEditing": true,
}
```

ဒီ feature ကို Visual Studio 17.7 Preview 1 မှာလည်း ပံ့ပိုးသွားမှာပါ။

[linked editing ရဲ့ ကျွန်တော်တို့ရဲ့ အကောင်အထည်ဖော်မှု](https://github.com/microsoft/TypeScript/pull/53284) ကို ဒီမှာ ကြည့်နိုင်ပါတယ်!

## Snippet Completions for `@param` JSDoc Tags (`@param` JSDoc Tag များအတွက် Snippet Completion များ)

TypeScript က TypeScript ရော JavaScript file တွေမှာပါ `@param` tag တစ်ခုကို ရိုက်နေတဲ့အခါ snippet completion တွေကို ယခုဆို ပံ့ပိုးပေးပါတယ်။
ဒါက သင့် code တွေကို document လုပ်တဲ့အခါ ဒါမှမဟုတ် JavaScript မှာ JSDoc type တွေ ထည့်တဲ့အခါ — စာရိုက်ခြင်းနဲ့ စာသားတစ်နေရာမှ တစ်နေရာသို့ ခုန်ကူးခြင်း တစ်ချို့ကို လျှော့ချပေးနိုင်ပါတယ်။

![တခြားနေရာ 'add' function တစ်ခုပေါ်မှာ JSDoc `param` comment တွေကို complete လုပ်နေတဲ့ ဥပမာ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/04/paramTagSnippets-5-1-1.gif)

ဒီ feature အသစ်ကို ဘယ်လို အကောင်အထည်ဖော်ခဲ့လဲဆိုတာ [GitHub ပေါ်မှာ စစ်ဆေးကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/53260)။

## Optimizations (Optimization များ)

### Avoiding Unnecessary Type Instantiation (မလိုအပ်သော Type Instantiation များကို ရှောင်ကြဉ်ခြင်း)

TypeScript 5.1 က — အပြင်ဘက် type parameter တွေဆီ ရည်ညွှန်းချက်တွေ မပါဝင်ဘူးလို့ သိရတဲ့ object type တွေထဲမှာ — type instantiation လုပ်ဆောင်ခြင်းကို အခုဆို ရှောင်ကြဉ်ပါတယ်။
ဒါက မလိုအပ်တဲ့ တွက်ချက်မှု အများကြီးကို ဖြတ်တောက်နိုင်စွမ်း ရှိပြီး — [material-ui ရဲ့ docs directory](https://github.com/mui/material-ui/tree/b0351248fb396001a30330daac86d0e0794a0c1d/docs) ရဲ့ type-checking အချိန်ကို 50% ကျော် လျှော့ချပေးခဲ့ပါတယ်။

ဒီပြောင်းလဲမှုအတွက် ပါဝင်တဲ့ အပြောင်းအလဲတွေကို [GitHub ပေါ်မှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/53246)။

### Negative Case Checks for Union Literals (Union Literal များအတွက် Negative Case စစ်ဆေးမှုများ)

source type တစ်ခုက union type တစ်ခုရဲ့ အစိတ်အပိုင်း ဟုတ်မဟုတ် စစ်ဆေးတဲ့အခါ — TypeScript က အဲဒီ source အတွက် internal type identifier တစ်ခုကို သုံးပြီး အမြန် look-up တစ်ခု အရင်လုပ်ပါတယ်။
အဲဒီ look-up က မအောင်မြင်ရင် — union ထဲက type တိုင်းနဲ့ TypeScript က compatibility စစ်ဆေးပါတယ်။

literal type တစ်ခုကို literal type သက်သက်တွေရဲ့ union တစ်ခုနဲ့ ဆက်စပ်တဲ့အခါ — TypeScript က အခုဆို union ထဲက တခြား type တိုင်းကို ဖြတ်ပြီး အပြည့်အဝ လျှောက်တာကို ရှောင်နိုင်ပါပြီ။
TypeScript က literal type တွေကို အမြဲ intern/cache လုပ်တာမို့ ဒီယူဆချက်က လုံခြုံပါတယ် — ဒါပေမယ့် "fresh" literal type တွေနဲ့ ဆက်စပ်တဲ့ ကိုင်တွယ်စရာ edge case တစ်ချို့တော့ ရှိပါသေးတယ်။

[ဒီ optimization](https://github.com/microsoft/TypeScript/pull/53192) က [ဒီ issue ထဲက code](https://github.com/microsoft/TypeScript/issues/53191) ရဲ့ type-checking အချိန်ကို ၄၅ စက္ကန့်လောက်ကနေ ၀.၄ စက္ကန့်လောက်အထိ လျှော့ချနိုင်ခဲ့ပါတယ်။

### Reduced Calls into Scanner for JSDoc Parsing (JSDoc Parsing အတွက် Scanner ထဲသို့ ခေါ်ဆိုမှုများ လျှော့ချခြင်း)

TypeScript ရဲ့ ဗားရှင်းအဟောင်းတွေက JSDoc comment တစ်ခုကို parse လုပ်တဲ့အခါ — comment ကို အကွက်ကောင်း (fine-grained) token တွေအဖြစ် ခွဲဖို့ scanner/tokenizer ကို သုံးပြီး — အကြောင်းအရာတွေကို ပြန်စုစည်းပါတယ်။
ဒါက comment စာသားကို normalize လုပ်ဖို့ အသုံးဝင်နိုင်ပါတယ် — space အများကြီးကို တစ်ခုတည်းအဖြစ် ပြိုကျစေတာမျိုးပေါ့;
ဒါပေမယ့် အလွန် "စကားများ (chatty)" ပြီး — parser နဲ့ scanner က ရှေ့နောက် ခုန်ကူးနေရတာမို့ — JSDoc parsing အတွက် overhead ဖြစ်စေပါတယ်။

TypeScript 5.1 က JSDoc comment တွေကို ခွဲခြမ်းတဲ့ logic အများစုကို scanner/tokenizer ထဲကို ရွှေ့ပြောင်းထားပါတယ်။
Scanner က အခုဆို ပိုကြီးတဲ့ content အပိုင်းအစတွေကို parser ဆီ တိုက်ရိုက် ပြန်ပေးလိုက်ရုံပါပဲ။

[ဒီပြောင်းလဲမှုတွေ](https://github.com/microsoft/TypeScript/pull/53081) က 10Mb လောက်ရှိတဲ့ prose-comment JavaScript file များစွာရဲ့ parse အချိန်ကို ထက်ဝက်လောက် လျှော့ချပေးနိုင်ခဲ့ပါတယ်။
ပိုလက်တွေ့ကျတဲ့ ဥပမာတစ်ခုအနေနဲ့ — ကျွန်တော်တို့ရဲ့ performance suite ရဲ့ [xstate](https://github.com/statelyai/xstate) snapshot က parse အချိန် 300ms လောက် ကျဆင်းသွားပြီး — load လုပ်ပြီး analyze လုပ်ဖို့ ပိုမြန်လာပါတယ်။

## Breaking Changes (Breaking Change များ)

### ES2020 and Node.js 14.17 as Minimum Runtime Requirements (အနည်းဆုံး Runtime လိုအပ်ချက်များအဖြစ် ES2020 နှင့် Node.js 14.17)

TypeScript 5.1 က ECMAScript 2020 မှာ မိတ်ဆက်ခဲ့တဲ့ JavaScript လုပ်ဆောင်ချက်တွေကို ယခုဆို တင်ပို့ပါတယ်။
ရလဒ်အနေနဲ့ — TypeScript ကို အနည်းဆုံး ကျိုးကြောင်းဆီလျော်တဲ့ (reasonably modern) runtime တစ်ခုမှာ run ရပါမယ်။
သုံးစွဲသူ အများစုအတွက်တော့ — TypeScript က Node.js 14.17 နဲ့ ၎င်းနောက်ပိုင်းမှာသာ run နိုင်တော့မယ်လို့ ဆိုလိုပါတယ်။

Node 10 ဒါမှမဟုတ် 12 လိုမျိုး Node.js ဗားရှင်းအဟောင်းတွေအောက်မှာ TypeScript 5.1 ကို run ဖို့ ကြိုးစားရင် — `tsc.js` ဒါမှမဟုတ် `tsserver.js` ကို run တဲ့အခါ အောက်ပါလို error မျိုး မြင်ရနိုင်ပါတယ်:

```
node_modules/typescript/lib/tsserver.js:2406
  for (let i = startIndex ?? 0; i < array.length; i++) {
                           ^
 
SyntaxError: Unexpected token '?'
    at wrapSafe (internal/modules/cjs/loader.js:915:16)
    at Module._compile (internal/modules/cjs/loader.js:963:27)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
    at internal/main/run_main_module.js:17:47
```

ဒါ့အပြင် TypeScript ကို install လုပ်ဖို့ ကြိုးစားရင် — npm ကနေ အောက်ပါလို error message တွေ ရပါလိမ့်မယ်:

```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'typescript@5.1.1-rc',
npm WARN EBADENGINE   required: { node: '>=14.17' },
npm WARN EBADENGINE   current: { node: 'v12.22.12', npm: '8.19.2' }
npm WARN EBADENGINE }
```

Yarn ကနေဆိုရင်:

```
error typescript@5.1.1-rc: The engine "node" is incompatible with this module. Expected version ">=14.17". Got "12.22.12"
error Found incompatible module.
```

[ဒီပြောင်းလဲမှုနဲ့ ပတ်သက်တဲ့ နောက်ထပ် အချက်အလက်တွေ ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/53291)။

### Explicit `typeRoots` Disables Upward Walks for `node_modules/@types` (Explicit `typeRoots` က `node_modules/@types` အတွက် အပေါ်သို့ Walk များကို ပိတ်လိုက်ခြင်း)

အရင်က — `tsconfig.json` တစ်ခုမှာ `typeRoots` option ကို သတ်မှတ်ထားပေမယ့် — `typeRoots` directory တွေဆီ resolution က မအောင်မြင်ခဲ့ရင် — TypeScript က parent directory တွေဆီ ဆက်ပြီး တက်လျှောက်ကာ — parent တစ်ခုချင်းစီရဲ့ `node_modules/@types` folder ထဲမှာ package တွေကို resolve လုပ်ဖို့ ကြိုးစားနေခဲ့ပါတယ်။

ဒီအပြုအမူက အလွန်အကျွံ look-up တွေ ဖြစ်စေနိုင်တာမို့ — TypeScript 5.1 မှာ ပိတ်ထားလိုက်ပါပြီ။
ရလဒ်အနေနဲ့ — သင့် `tsconfig.json` ရဲ့ `types` option ဒါမှမဟုတ် `/// <reference >` directive တွေထဲက entry တွေအပေါ် အခြေခံပြီး — အောက်ပါလို error တွေ စတင် မြင်ရနိုင်ပါတယ်

```
error TS2688: Cannot find type definition file for 'node'.
error TS2688: Cannot find type definition file for 'mocha'.
error TS2688: Cannot find type definition file for 'jasmine'.
error TS2688: Cannot find type definition file for 'chai-http'.
error TS2688: Cannot find type definition file for 'webpack-env"'.
```

ဖြေရှင်းနည်းကတော့ ပုံမှန်အားဖြင့် — သင့် `typeRoots` ထဲကို `node_modules/@types` အတွက် တိကျတဲ့ entry တွေ ထည့်ဖို့ပါ:

```jsonc
{
    "compilerOptions": {
        "types": [
            "node",
            "mocha"
        ],
        "typeRoots": [
            // Keep whatever you had around before.
            "./some-custom-types/",
            // You might need your local 'node_modules/@types'.
            "./node_modules/@types",
            // You might also need to specify a shared 'node_modules/@types'
            // if you're using a "monorepo" layout.
            "../../node_modules/@types",
        ]
    }
}
```

နောက်ထပ် အချက်အလက်ကို [ကျွန်တော်တို့ရဲ့ issue tracker ပေါ်က မူရင်း ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/51715) မှာ ရနိုင်ပါတယ်။
