---
title: "TypeScript 5.2 (TypeScript 5.2 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.2 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — `using` declarations နဲ့ explicit resource management, decorator metadata, tuple element နာမည်စည်းမျဉ်းများ ဖြေလျှော့ခြင်း, union of arrays များအတွက် method ခေါ်ဆိုမှု, type-only import paths, editor refactorings, performance နဲ့ breaking changes/correctness fixes အကြောင်း"
order: 92
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html"
status: translated
updated: 2026-09-05
---

## `using` Declarations and Explicit Resource Management (`using` Declaration များနှင့် Explicit Resource Management)

TypeScript 5.2 က ECMAScript မှာ လာမယ့် [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) feature အတွက် ပံ့ပိုးမှု ထပ်ဖြည့်ပေးပါတယ်။
ဒီ feature က ဘာတွေ ယူဆောင်လာပေးလဲဆိုတာ နားလည်ဖို့ — လှုံ့ဆော်မှု (motivations) တစ်ချို့ကို စူးစမ်းကြည့်ရအောင်။

object တစ်ခုကို ဖန်တီးပြီးတာနဲ့ "clean-up" (ရှင်းလင်းခြင်း) လိုမျိုး တစ်ခုခု လုပ်ဖို့ လိုအပ်တာက အဖြစ်များပါတယ်။
ဥပမာ — network connection တွေ ပိတ်ဖို့၊ temporary file တွေ ဖျက်ဖို့၊ ဒါမှမဟုတ် memory တစ်ချို့ ပြန်လွှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။

temporary file တစ်ခုကို ဖန်တီးပြီး — operation အမျိုးမျိုးအတွက် အဲဒီထဲ ဖတ်/ရေး လုပ်ကာ — နောက်ဆုံးမှာ ပိတ်ပြီး ဖျက်ပစ်တဲ့ function တစ်ခုကို စိတ်ကူးကြည့်ပါ။

```ts
import * as fs from "fs";

export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

ဒါက အဆင်ပြေပါတယ် — ဒါပေမယ့် — စောစောစီးစီး ထွက်သွားဖို့ (early exit) လိုအပ်လာရင် ဘာဖြစ်မလဲ?

```ts
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...
    if (someCondition()) {
        // do some more work...

        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
        return;
    }

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

clean-up code တွေ ထပ်ချထားချ ဖြစ်နေတာကို စတင် မြင်နေရပြီ — အဲဒါတွေက မေ့ပစ်ရလွယ်ပါတယ်။
ပြီးတော့ — error တစ်ခု ပစ်ချလိုက်ရင် file ကို ပိတ်ပြီး ဖျက်ပစ်ဖို့ အာမခံချက် မရှိတော့ပါဘူး။
ဒါကို အကုန်လုံး `try`/`finally` block တစ်ခုထဲမှာ ထုပ်ပိုးခြင်းအားဖြင့် ဖြေရှင်းနိုင်ပါတယ်။

```ts
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    try {
        // use file...

        if (someCondition()) {
            // do some more work...
            return;
        }
    }
    finally {
        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
    }
}
```

ဒါက ပိုခိုင်မာပေမယ့် — ကျွန်တော်တို့ code ထဲကို "ဆူညံမှု (noise)" အတော်များများ ထပ်ဖြည့်မိပါတယ်။
ကျွန်တော်တို့ရဲ့ `finally` block ထဲကို clean-up logic တွေ ပိုထည့်လာတာနဲ့အမျှ — ရင်ဆိုင်ရနိုင်တဲ့ တခြား foot-gun တွေလည်း ရှိပါသေးတယ် — ဥပမာ — exceptions တွေက တခြား resource တွေကို dispose လုပ်တာကို တားဆီးပစ်တာမျိုးပါ။
ဒါကိုပဲ [explicit resource management](https://github.com/tc39/proposal-explicit-resource-management) proposal က ဖြေရှင်းဖို့ ရည်ရွယ်ပါတယ်။
ဒီ proposal ရဲ့ အဓိက အယူအဆက — ကျွန်တော်တို့ ကိုင်တွယ်ဖို့ ကြိုးစားနေတဲ့ ဒီ clean-up အလုပ်ဖြစ်တဲ့ — resource disposal ကို JavaScript မှာ first-class idea တစ်ခုအနေနဲ့ ပံ့ပိုးဖို့ပါ။

ဒါက `Symbol.dispose` လို့ခေါ်တဲ့ built-in `symbol` အသစ်တစ်ခု ထည့်သွင်းခြင်းကနေ စတင်ပြီး — `Symbol.dispose` လို့ အမည်ပေးထားတဲ့ method တွေပါတဲ့ object တွေကို ဖန်တီးနိုင်ပါတယ်။
အဆင်ပြေစေဖို့ — TypeScript က ဒါတွေကို ဖော်ပြတဲ့ `Disposable` လို့ခေါ်တဲ့ global type အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}
```

နောက်ပိုင်းမှာ အဲဒီ method တွေကို ခေါ်နိုင်ပါတယ်။

```ts
export function doSomeWork() {
    const file = new TempFile(".some_temp_file");

    try {
        // ...
    }
    finally {
        file[Symbol.dispose]();
    }
}
```

clean-up logic ကို `TempFile` ကိုယ်တိုင်ဆီ ရွှေ့ပြောင်းတာက ကျွန်တော်တို့အတွက် သိပ်အကျိုး မရှိပါဘူး;
အခြေခံအားဖြင့် — clean-up အလုပ်အားလုံးကို `finally` block ကနေ method တစ်ခုထဲကို ရွှေ့လိုက်ရုံပါပဲ — ပြီးတော့ အဲဒါက အမြဲတမ်း လုပ်နိုင်ခဲ့တာပါ။
ဒါပေမယ့် ဒီ method အတွက် လူသိများတဲ့ "နာမည်" တစ်ခု ရှိနေတာက — JavaScript က အဲဒီအပေါ်မှာ တခြား feature တွေ တည်ဆောက်နိုင်တယ်လို့ ဆိုလိုပါတယ်။

ဒါက ဒီ feature ရဲ့ ပထမဆုံး ကြယ်ပွင့်ဆီ ခေါ်ဆောင်သွားပါတယ်: `using` declarations!
`using` က `const` လိုမျိုး — fixed binding အသစ်တွေ ကြေညာနိုင်စေတဲ့ keyword အသစ်တစ်ခုပါ။
အဓိက ကွာခြားချက်က — `using` နဲ့ ကြေညာထားတဲ့ variable တွေရဲ့ `Symbol.dispose` method ကို scope ရဲ့ အဆုံးမှာ ခေါ်ပေးတာပါ!

ဒါကြောင့် ကျွန်တော်တို့ code ကို ဒီလိုမျိုး ရိုးရိုးရှင်းရှင်း ရေးလိုက်လို့ ရပါတယ်:

```ts
export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

ကြည့်လိုက်ပါ — `try`/`finally` blocks တွေ မလိုတော့ဘူး!
အနည်းဆုံးတော့ — ကျွန်တော်တို့ မြင်ရတဲ့နေရာမှာ မရှိတော့ပါဘူး။
လုပ်ဆောင်ချက်အရ — `using` declarations တွေက ကျွန်တော်တို့အတွက် အတိအကျ အဲဒါတွေကို လုပ်ပေးမှာပါ — ဒါပေမယ့် ကျွန်တော်တို့က အဲဒါတွေကို ကိုင်တွယ်စရာ မလိုတော့ပါဘူး။

[C# ထဲက `using` declarations](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-8.0/using), [Python ထဲက `with` statements](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement), ဒါမှမဟုတ် [Java ထဲက `try`-with-resource declarations](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) တွေကို သင်ရင်းနှီးပြီးသား ဖြစ်နိုင်ပါတယ်။
ဒါတွေအားလုံးက JavaScript ရဲ့ `using` keyword အသစ်နဲ့ ဆင်တူပြီး — scope တစ်ခုရဲ့ အဆုံးမှာ object တစ်ခုရဲ့ "tear-down" (ဖြုတ်ချခြင်း) ကို လုပ်ဆောင်ဖို့ အလားတူ ရှင်းလင်းတဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။

`using` declarations တွေက ဒီ clean-up ကို — သူတို့ ပါဝင်တဲ့ scope ရဲ့ အဆုံးစွန်မှာ ဒါမှမဟုတ် `return` ဒါမှမဟုတ် `throw` လုပ်လိုက်တဲ့ error တစ်ခုလိုမျိုး "စောစောပြန်ထွက်ခြင်း (early return)" ရဲ့ ရှေ့မှာ လုပ်ဆောင်ပါတယ်။
သူတို့က stack တစ်ခုလိုမျိုး — ရှေ့ဦးစွာ ဝင်နောက်ဆုံး ထွက် (first-in-last-out) အစီအစဉ်နဲ့လည်း dispose လုပ်ပါတယ်။

```ts
function loggy(id: string): Disposable {
    console.log(`Creating ${id}`);

    return {
        [Symbol.dispose]() {
            console.log(`Disposing ${id}`);
        }
    }
}

function func() {
    using a = loggy("a");
    using b = loggy("b");
    {
        using c = loggy("c");
        using d = loggy("d");
    }
    using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    using f = loggy("f");
}

func();
// Creating a
// Creating b
// Creating c
// Creating d
// Disposing d
// Disposing c
// Creating e
// Disposing e
// Disposing b
// Disposing a
```

`using` declarations တွေက exceptions တွေကို ခံနိုင်ရည်ရှိဖို့ ရည်ရွယ်ထားပါတယ်;
error တစ်ခု ပစ်ချလိုက်ရင် — disposal ပြီးတဲ့နောက်မှာ အဲဒီ error ကို ပြန်ပစ်ချပါတယ်။
တစ်ဖက်မှာလည်း — သင့် function ရဲ့ body က မျှော်လင့်ထားတဲ့အတိုင်း လည်ပတ်နိုင်ပေမယ့် — `Symbol.dispose` က ပစ်ချလိုက်တာမျိုး ဖြစ်နိုင်ပါတယ်။
အဲဒီကိစ္စမှာလည်း — အဲဒီ exception ကို ပြန်ပစ်ချပါတယ်။

ဒါပေမယ့် — disposal မတိုင်ခင်က logic ရော disposal အတွင်းမှာပါ error တွေ ပစ်ချလိုက်ရင် ဘာဖြစ်မလဲ?
ဒီလိုကိစ္စတွေအတွက် — `SuppressedError` ကို `Error` ရဲ့ subtype အသစ်တစ်ခုအနေနဲ့ မိတ်ဆက်ပေးထားပါတယ်။
အဲဒီမှာ နောက်ဆုံး ပစ်ချလိုက်တဲ့ error ကို သိမ်းထားတဲ့ `suppressed` property တစ်ခု နဲ့ — လက်ရှိ အလိုလို ပစ်ချလိုက်တဲ့ error အတွက် `error` property တစ်ခု ပါဝင်ပါတယ်။

```ts
class ErrorA extends Error {
    name = "ErrorA";
}
class ErrorB extends Error {
    name = "ErrorB";
}

function throwy(id: string) {
    return {
        [Symbol.dispose]() {
            throw new ErrorA(`Error from ${id}`);
        }
    };
}

function func() {
    using a = throwy("a");
    throw new ErrorB("oops!")
}

try {
    func();
}
catch (e: any) {
    console.log(e.name); // SuppressedError
    console.log(e.message); // An error was suppressed during disposal.

    console.log(e.error.name); // ErrorA
    console.log(e.error.message); // Error from a

    console.log(e.suppressed.name); // ErrorB
    console.log(e.suppressed.message); // oops!
}
```

ဒီဥပမာတွေမှာ synchronous method တွေ သုံးနေတာကို သတိထားမိပါလိမ့်မယ်။
ဒါပေမယ့် — resource disposal အများစုက *asynchronous* operation တွေ ပါဝင်ပြီး — တခြား code တွေ ဆက်မလည်ပတ်ခင် အဲဒါတွေ ပြီးစီးဖို့ စောင့်ဆိုင်းဖို့ လိုအပ်ပါတယ်။

ဒါကြောင့်မို့ `Symbol.asyncDispose` အသစ်တစ်ခုလည်း ရှိပြီး — ဒါက ဒီ feature ရဲ့ နောက်ထပ် ကြယ်ပွင့်ဆီ ခေါ်ဆောင်သွားပါတယ် — `await using` declarations!
ဒါတွေက `using` declarations တွေနဲ့ ဆင်တူပေမယ့် — အဓိက ကွာခြားချက်က — ဘယ်သူ့ရဲ့ disposal ကို `await` လုပ်ရမလဲဆိုတာကို သူတို့ ရှာဖွေတာပါ။
သူတို့က `Symbol.dispose` ရှိတဲ့ ဘယ်အရာပေါ်မှာမဆို လုပ်ဆောင်နိုင်ပေမယ့် — `Symbol.asyncDispose` လို့ အမည်ပေးထားတဲ့ မတူညီတဲ့ method တစ်ခုကို သုံးပါတယ်။
အဆင်ပြေစေဖို့ — TypeScript က asynchronous dispose method ရှိတဲ့ ဘယ် object ကိုမဆို ဖော်ပြတဲ့ `AsyncDisposable` လို့ခေါ်တဲ့ global type တစ်ခုကိုလည်း မိတ်ဆက်ပေးပါတယ်။

```ts
async function doWork() {
    // Do fake work for half a second.
    await new Promise(resolve => setTimeout(resolve, 500));
}

function loggy(id: string): AsyncDisposable {
    console.log(`Constructing ${id}`);
    return {
        async [Symbol.asyncDispose]() {
            console.log(`Disposing (async) ${id}`);
            await doWork();
        },
    }
}

async function func() {
    await using a = loggy("a");
    await using b = loggy("b");
    {
        await using c = loggy("c");
        await using d = loggy("d");
    }
    await using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    await using f = loggy("f");
}

func();
// Constructing a
// Constructing b
// Constructing c
// Constructing d
// Disposing (async) d
// Disposing (async) c
// Constructing e
// Disposing (async) e
// Disposing (async) b
// Disposing (async) a
```

`Disposable` နဲ့ `AsyncDisposable` တို့ကို သုံးပြီး type တွေ သတ်မှတ်တာက — တခြားသူတွေက tear-down logic တွေကို တသမတ်တည်း လုပ်ဆောင်မယ်လို့ မျှော်လင့်ရတဲ့နေရာမှာ — သင့် code ကို အများကြီး ပိုလွယ်ကူစေပါတယ်။
တကယ်တော့ — `dispose()` ဒါမှမဟုတ် `close()` method တွေ ရှိတဲ့ ရှိပြီးသား type တွေ အများကြီး အပြင်မှာ ရှိပါတယ်။
ဥပမာ — Visual Studio Code API တွေက [သူတို့ရဲ့ ကိုယ်ပိုင် `Disposable` interface](https://code.visualstudio.com/api/references/vscode-api#Disposable) ကိုတောင် သတ်မှတ်ထားပါတယ်။
Browser နဲ့ Node.js, Deno, Bun လိုမျိုး runtime တွေထဲက API တွေကလည်း — file handle တွေ, connection တွေ စတဲ့ clean-up method တွေ ရှိပြီးသား object တွေအတွက် `Symbol.dispose` နဲ့ `Symbol.asyncDispose` တွေကို ရွေးချယ်သုံးနိုင်ပါတယ်။

အခုဆို — ဒါတွေအားလုံး library တွေအတွက်တော့ ကောင်းပုံရပေမယ့် — သင့်ရဲ့ အခြေအနေတွေအတွက်တော့ နည်းနည်း လေးလံနေနိုင်ပါတယ်။
သင်က ad-hoc clean-up တွေ အများကြီး လုပ်နေတယ်ဆိုရင် — type အသစ်တစ်ခု ဖန်တီးတာက over-abstraction တွေနဲ့ best-practices ဆိုင်ရာ မေးခွန်းတွေ အများကြီး ဖြစ်စေနိုင်ပါတယ်။
ဥပမာ — ကျွန်တော်တို့ရဲ့ `TempFile` ဥပမာကို ပြန်ကြည့်ပါ။

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

ကျွန်တော်တို့ လိုချင်တာက function နှစ်ခုကို ခေါ်ဖို့ မှတ်မိဖို့ပဲ — ဒါပေမယ့် ဒါက ရေးဖို့ အကောင်းဆုံး နည်းလမ်းလား?
constructor ထဲမှာ `openSync` ကို ခေါ်သင့်လား၊ `open()` method တစ်ခု ဖန်တီးသင့်လား၊ ဒါမှမဟုတ် handle ကို ကိုယ်တိုင် ထည့်ပေးသင့်လား?
လုပ်ဆောင်ဖို့ လိုအပ်တဲ့ operation တိုင်းအတွက် method တစ်ခုစီ ထုတ်ပြသင့်လား၊ ဒါမှမဟုတ် property တွေကို public လုပ်ပစ်သင့်လား?

ဒါက ဒီ feature ရဲ့ နောက်ဆုံး ကြယ်ပွင့်တွေဆီ ခေါ်ဆောင်သွားပါတယ်: `DisposableStack` နဲ့ `AsyncDisposableStack`။
ဒီ object တွေက — တစ်ကြိမ်တည်းအတွက် clean-up ရော မတရားတဲ့ ပမာဏ (arbitrary amounts) အတွက် clean-up ပါ နှစ်မျိုးလုံးအတွက် အသုံးဝင်ပါတယ်။
`DisposableStack` က `Disposable` object တွေကို ခြေရာခံဖို့ method များစွာ ရှိတဲ့ object တစ်ခုဖြစ်ပြီး — arbitrary clean-up အလုပ်တွေ လုပ်ဖို့ function တွေကိုလည်း ပေးနိုင်ပါတယ်။
သူတို့ကို `using` variable တွေဆီလည်း assign လုပ်နိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ — ဒီကို ကြည့်ပါ — *သူတို့ကိုယ်တိုင်ကလည်း `Disposable` တွေပါ*!
ဒါကြောင့် မူရင်း ဥပမာကို ဒီလိုမျိုး ရေးခဲ့လို့ ရပါတယ်။

```ts
function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    using cleanup = new DisposableStack();
    cleanup.defer(() => {
        fs.closeSync(file);
        fs.unlinkSync(path);
    });

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }

    // ...
}
```

ဒီမှာ — `defer()` method က callback တစ်ခုကိုပဲ ယူပြီး — `cleanup` ကို dispose လုပ်လိုက်တာနဲ့ အဲဒီ callback ကို run လုပ်ပေးပါတယ်။
ပုံမှန်အားဖြင့် — `defer` (နဲ့ `use`, `adopt` လိုမျိုး တခြား `DisposableStack` method တွေ) ကို resource တစ်ခု ဖန်တီးပြီးချင်း ချက်ချင်း ခေါ်သင့်ပါတယ်။
နာမည်က ဖော်ပြသလိုပဲ — `DisposableStack` က သူ ခြေရာခံထားသမျှ အကုန်လုံးကို stack တစ်ခုလိုမျိုး — first-in-last-out အစီအစဉ်နဲ့ dispose လုပ်တာမို့ — value တစ်ခု ဖန်တီးပြီးချင်း ချက်ချင်း `defer` လုပ်တာက ထူးဆန်းတဲ့ dependency ပြဿနာတွေကို ရှောင်ရှားဖို့ ကူညီပါတယ်။
`AsyncDisposableStack` က အလားတူ အလုပ်လုပ်ပေမယ့် — `async` function တွေနဲ့ `AsyncDisposable` တွေကို ခြေရာခံနိုင်ပြီး — သူ့ကိုယ်တိုင်ကလည်း `AsyncDisposable` တစ်ခုပါ။

`defer` method က [Go](https://go.dev/tour/flowcontrol/12), [Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/statements/#Defer-Statement), [Zig](https://ziglang.org/documentation/master/#defer), [Odin](https://odin-lang.org/docs/overview/#defer-statement) စတဲ့ ဘာသာစကားတွေထဲက `defer` keyword နဲ့ နည်းလမ်းများစွာမှာ ဆင်တူပြီး — သူတို့မှာ ကျင့်သုံးပုံတွေက အလားတူ ဖြစ်သင့်ပါတယ်။

ဒီ feature က အတော်လေး မကြာသေးခင်ကမှ ဖြစ်တာမို့ — runtime အများစုက သူ့ကို natively ပံ့ပိုးမှာ မဟုတ်ပါဘူး။
သုံးဖို့ဆိုရင် — အောက်ပါတို့အတွက် runtime polyfill တွေ လိုအပ်ပါလိမ့်မယ်:

* `Symbol.dispose`
* `Symbol.asyncDispose`
* `DisposableStack`
* `AsyncDisposableStack`
* `SuppressedError`

ဒါပေမယ့် — သင်စိတ်ဝင်စားတာ `using` နဲ့ `await using` ပဲဆိုရင် — built-in `symbol` တွေကိုပဲ polyfill လုပ်ရင် လုံလောက်ပါလိမ့်မယ်။
အောက်ပါလို ရိုးရှင်းတဲ့အရာက အများစုအတွက် အလုပ်လုပ်သင့်ပါတယ်:

```ts
Symbol.dispose ??= Symbol("Symbol.dispose");
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
```

သင့်ရဲ့ compilation `target` ကို `es2022` ဒါမှမဟုတ် အောက်ပိုင်းအဖြစ် သတ်မှတ်ဖို့လည်း လိုအပ်ပြီး — သင့် `lib` setting ထဲမှာ `"esnext"` ဒါမှမဟုတ် `"esnext.disposable"` ကို ထည့်သွင်းဖို့ လိုပါတယ်။

```json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.disposable", "dom"]
    }
}
```

ဒီ feature အကြောင်း နောက်ထပ် အချက်အလက်အတွက် — [GitHub ပေါ်က အလုပ်ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54505)!

## Decorator Metadata (Decorator Metadata အကြောင်း)

TypeScript 5.2 က [decorator metadata လို့ခေါ်တဲ့ လာမယ့် ECMAScript feature](https://github.com/tc39/proposal-decorator-metadata) တစ်ခုကို အကောင်အထည်ဖော်ပါတယ်။

ဒီ feature ရဲ့ အဓိက အယူအဆက — decorator တွေက သူတို့ သုံးထားတဲ့ ဒါမှမဟုတ် သူတို့ အတွင်းမှာ ရှိတဲ့ class တစ်ခုခုပေါ်မှာ metadata တွေကို ဖန်တီးပြီး သုံးစွဲဖို့ လွယ်ကူစေခြင်းပါ။

Decorator function တွေ သုံးလိုက်တိုင်း — သူတို့ရဲ့ context object ပေါ်မှာ `metadata` property အသစ်တစ်ခုကို အခုဆို ဝင်ရောက်ကြည့်ရှုနိုင်ပါပြီ။
`metadata` property က ရိုးရှင်းတဲ့ object တစ်ခုကိုပဲ သိမ်းထားပါတယ်။
JavaScript က property တွေကို စိတ်ကြိုက် ထပ်ဖြည့်ခွင့် ပြုတာမို့ — decorator တစ်ခုချင်းစီက အပ်ဒိတ်လုပ်ပေးတဲ့ dictionary တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။
တစ်နည်းအားဖြင့် — class တစ်ခုရဲ့ decorate လုပ်ထားတဲ့ အပိုင်းတိုင်းအတွက် `metadata` object တိုင်း တူညီနေမှာမို့ — `Map` တစ်ခုထဲကို key တစ်ခုအနေနဲ့လည်း သုံးနိုင်ပါတယ်။
Class တစ်ခုပေါ်မှာ ဒါမှမဟုတ် အတွင်းမှာ ရှိတဲ့ decorator တွေ အားလုံး run ပြီးသွားတာနဲ့ — အဲဒီ object ကို class ပေါ်ကနေ `Symbol.metadata` ကတစ်ဆင့် ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။

```ts
interface Context {
    name: string;
    metadata: Record<PropertyKey, unknown>;
}

function setMetadata(_target: any, context: Context) {
    context.metadata[context.name] = true;
}

class SomeClass {
    @setMetadata
    foo = 123;

    @setMetadata
    accessor bar = "hello!";

    @setMetadata
    baz() { }
}

const ourMetadata = SomeClass[Symbol.metadata];

console.log(JSON.stringify(ourMetadata));
// { "bar": true, "baz": true, "foo": true }
```

ဒါက အခြေအနေ အမျိုးမျိုးမှာ အသုံးဝင်နိုင်ပါတယ်။
Metadata တွေက debugging, serialization, ဒါမှမဟုတ် decorator တွေနဲ့ dependency injection လုပ်ဆောင်ခြင်းလိုမျိုး အသုံးပြုမှု အများကြီးအတွက် တွဲထားနိုင်ပါတယ်။
Metadata object တွေက decorate လုပ်ထားတဲ့ class တစ်ခုစီအတွက် ဖန်တီးတာမို့ — framework တွေက သူတို့ကို `Map` ဒါမှမဟုတ် `WeakMap` တစ်ခုထဲကို key တွေအဖြစ် သီးသန့်သုံးနိုင်သလို — လိုအပ်သလို property တွေကိုလည်း ကပ်ထည့်နိုင်ပါတယ်။

ဥပမာ — `JSON.stringify` သုံးတဲ့အခါ ဘယ် property တွေ၊ ဘယ် accessor တွေ serializable ဖြစ်လဲဆိုတာကို ခြေရာခံဖို့ decorator တွေကို သုံးချင်တယ်ဆိုပါစို့:

```ts
import { serialize, jsonify } from "./serializer";

class Person {
    firstName: string;
    lastName: string;

    @serialize
    age: number

    @serialize
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toJSON() {
        return jsonify(this)
    }

    constructor(firstName: string, lastName: string, age: number) {
        // ...
    }
}
```

ဒီမှာ ရည်ရွယ်ချက်က — `@serialize` decorator နဲ့ မှတ်သားထားလို့ — `age` နဲ့ `fullName` ကိုပဲ serialize လုပ်သင့်တာပါ။
ဒီရည်ရွယ်ချက်အတွက် `toJSON` method တစ်ခုကို ကျွန်တော်တို့ သတ်မှတ်ထားပေမယ့် — အဲဒါက `@serialize` ဖန်တီးထားတဲ့ metadata ကို သုံးတဲ့ `jsonify` ကိုပဲ ခေါ်လိုက်တာပါ။

`./serialize.ts` module ကို ဘယ်လို သတ်မှတ်နိုင်လဲဆိုတဲ့ ဥပမာက ဒီမှာပါ:

```ts
const serializables = Symbol();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name === "symbol") {
        throw new Error("Cannot serialize symbol-named properties.");
    }

    const propNames =
        (context.metadata[serializables] as string[] | undefined) ??= [];
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata?.[serializables] as string[] | undefined;
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }

    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

ဒီ module မှာ `@serializable` လို့ မှတ်သားထားတဲ့ property တွေရဲ့ နာမည်တွေကို သိမ်းပြီး ပြန်ယူဖို့ `serializables` လို့ခေါ်တဲ့ local `symbol` တစ်ခု ရှိပါတယ်။
`@serializable` ခေါ်လိုက်တိုင်း — ဒီ property နာမည်တွေရဲ့ စာရင်းတစ်ခုကို metadata ပေါ်မှာ သိမ်းပါတယ်။
`jsonify` ကို ခေါ်တဲ့အခါ — property တွေရဲ့ စာရင်းကို metadata ပေါ်ကနေ ယူပြီး — instance ကနေ တကယ့် တန်ဖိုးတွေကို ပြန်ယူဖို့ သုံးကာ — နောက်ဆုံးမှာ အဲဒီ နာမည်တွေနဲ့ တန်ဖိုးတွေကို serialize လုပ်ပါတယ်။

`symbol` တစ်ခု သုံးတာက — ဒီ data ကို တခြားသူတွေ ဝင်ရောက်ကြည့်ရှုနိုင်အောင် လုပ်ပေးပါတယ်။
အခြားရွေးချယ်စရာတစ်ခုက — metadata object ကို key အဖြစ် သုံးတဲ့ `WeakMap` တစ်ခုကို သုံးတာပါ။
ဒါက data တွေကို သီးသန့်ဖြစ်စေပြီး — ဒီကိစ္စမှာ type assertion တွေလည်း ပိုနည်းပါတယ် — ဒါပေမယ့် တခြားအရာတွေကတော့ ဆင်တူပါတယ်။

```ts
const serializables = new WeakMap<object, string[]>();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name !== "string") {
        throw new Error("Can only serialize string properties.");
    }

    let propNames = serializables.get(context.metadata);
    if (propNames === undefined) {
        serializables.set(context.metadata, propNames = []);
    }
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata && serializables.get(metadata);
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }
    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

မှတ်ချက်တစ်ခုအနေနဲ့ — ဒီ implementations တွေက subclassing နဲ့ inheritance တွေကို ကိုင်တွယ်မပေးပါဘူး။
ဒါက သင့်အတွက် လေ့ကျင့်ခန်းအဖြစ် ချန်ထားပါတယ် (ပြီးတော့ file ရဲ့ ဗားရှင်းတစ်ခုမှာ တစ်ခုထက်ပိုပြီး လွယ်ကူတာကို သင်တွေ့နိုင်ပါတယ်!)

ဒီ feature က အတော်လေး အသစ်ဖြစ်နေသေးတာမို့ — runtime အများစုက သူ့ကို natively ပံ့ပိုးမှာ မဟုတ်ပါဘူး။
သုံးဖို့ဆိုရင် — `Symbol.metadata` အတွက် polyfill တစ်ခု လိုအပ်ပါလိမ့်မယ်။
အောက်ပါလို ရိုးရှင်းတဲ့အရာက အများစုအတွက် အလုပ်လုပ်သင့်ပါတယ်:

```ts
Symbol.metadata ??= Symbol("Symbol.metadata");
```

သင့်ရဲ့ compilation `target` ကို `es2022` ဒါမှမဟုတ် အောက်ပိုင်းအဖြစ် သတ်မှတ်ဖို့လည်း လိုအပ်ပြီး — သင့် `lib` setting ထဲမှာ `"esnext"` ဒါမှမဟုတ် `"esnext.decorators"` ကို ထည့်သွင်းဖို့ လိုပါတယ်။

```json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.decorators", "dom"]
    }
}
```

TypeScript 5.2 အတွက် decorator metadata ရဲ့ [အကောင်အထည်ဖော်မှု](https://github.com/microsoft/TypeScript/pull/54657) ကို ပံ့ပိုးပေးခဲ့တဲ့ [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျေးဇူးတင်ပါတယ်!

## Named and Anonymous Tuple Elements (အမည်တပ်ထားသော နှင့် အမည်မဲ့ Tuple Element များ)

Tuple type တွေက element တစ်ခုစီအတွက် optional label (ဒါမှမဟုတ် နာမည်) တွေကို ပံ့ပိုးထားပါတယ်။

```ts
type Pair<T> = [first: T, second: T];
```

ဒီ label တွေက သူတို့နဲ့ ဘာတွေ လုပ်လို့ရလဲဆိုတာကို မပြောင်းလဲပါဘူး — ဖတ်ရှုနိုင်မှု (readability) နဲ့ tooling အတွက် ကူညီဖို့ပဲ ဖြစ်ပါတယ်။

ဒါပေမယ့် — TypeScript က အရင်က — tuple တွေက labeled နဲ့ unlabeled element တွေကို ရောနှော သုံးလို့မရဘူးဆိုတဲ့ စည်းမျဉ်းတစ်ခု ရှိခဲ့ပါတယ်။
တစ်နည်းပြောရရင် — tuple တစ်ခုထဲမှာ element တစ်ခုမှ label မရှိနိုင်သလို၊ ဒါမှမဟုတ် အားလုံးမှာ label ရှိဖို့ လိုအပ်ခဲ့ပါတယ်။

```ts
// ✅ fine - no labels
type Pair1<T> = [T, T];

// ✅ fine - all fully labeled
type Pair2<T> = [first: T, second: T];

// ❌ previously an error
type Pair3<T> = [first: T, T];
//                         ~
// Tuple members must all have names
// or all not have names.
```

ဒါက — `rest` ဒါမှမဟုတ် `tail` လိုမျိုး label တစ်ခုကိုပဲ အတင်းထည့်ခိုင်းခံရတဲ့ rest element တွေအတွက် စိတ်ညစ်စရာ ဖြစ်နိုင်ပါတယ်။

```ts
// ❌ previously an error
type TwoOrMore_A<T> = [first: T, second: T, ...T[]];
//                                          ~~~~~~
// Tuple members must all have names
// or all not have names.

// ✅
type TwoOrMore_B<T> = [first: T, second: T, rest: ...T[]];
```

ဒါက — ဒီကန့်သတ်ချက်ကို type system ရဲ့ အတွင်းပိုင်းမှာပါ ပြဋ္ဌာန်းထားရတာမို့ — TypeScript က label တွေ ဆုံးရှုံးသွားစေနိုင်တယ်လို့လည်း ဆိုလိုပါတယ်။

```ts
type HasLabels = [a: string, b: string];
type HasNoLabels = [number, number];
type Merged = [...HasNoLabels, ...HasLabels];
//   ^ [number, number, string, string]
//
//     'a' and 'b' were lost in 'Merged'
```

TypeScript 5.2 မှာ — tuple label တွေအပေါ် အားလုံး-သို့မဟုတ်-ဘာမှမဟုတ် (all-or-nothing) ဆိုတဲ့ ကန့်သတ်ချက်ကို ရုတ်သိမ်းလိုက်ပါပြီ။
ဘာသာစကားက အခုဆို unlabeled tuple တစ်ခုထဲကို spread လုပ်တဲ့အခါ label တွေကိုပါ ထိန်းသိမ်းနိုင်ပါပြီ။

ဒီကန့်သတ်ချက်ကို [ဖယ်ရှားဖို့ ပူးပေါင်း ဆောင်ရွက်ခဲ့ကြတဲ့](https://github.com/microsoft/TypeScript/pull/53356) [Josh Goldberg](https://github.com/JoshuaKGoldberg) နဲ့ [Mateusz Burzyński](https://github.com/Andarist) တို့ကို ကျေးဇူးတင်ပါတယ်။

## Easier Method Usage for Unions of Arrays (Array များ၏ Union များအတွက် Method အသုံးပြုမှု ပိုမိုလွယ်ကူလာခြင်း)

TypeScript ရဲ့ အရင်ဗားရှင်းတွေမှာ — array တွေရဲ့ union တစ်ခုပေါ်မှာ method တစ်ခုကို ခေါ်တာက စိတ်ညစ်စရာအဖြစ် အဆုံးသတ်နိုင်ပါတယ်။

```ts
declare let array: string[] | number[];

array.filter(x => !!x);
//    ~~~~~~ error!
// This expression is not callable.
//   Each member of the union type '...' has signatures,
//   but none of those signatures are compatible
//   with each other.
```

ဒီဥပမာမှာ — TypeScript က `filter` ရဲ့ ဗားရှင်းတစ်ခုချင်းစီက `string[]` နဲ့ `number[]` ကြားမှာ compatible ဖြစ်မဖြစ် ကြည့်ဖို့ ကြိုးစားပါတယ်။
တသမတ်တည်း ဖြစ်တဲ့ strategy မရှိဘဲနဲ့ — TypeScript က လက်မြှောက်ပြီး "ငါ ဒါကို အလုပ်ဖြစ်အောင် မလုပ်နိုင်ဘူး" လို့ ပြောလိုက်ပါတယ်။

TypeScript 5.2 မှာ — ဒီလိုကိစ္စတွေမှာ လက်မလွှတ်ခင် — array တွေရဲ့ union တွေကို special case တစ်ခုအနေနဲ့ သဘောထားပါတယ်။
member တစ်ခုစီရဲ့ element type ကနေ array type အသစ်တစ်ခုကို တည်ဆောက်ပြီး — အဲဒီအပေါ်မှာ method ကို ခေါ်ပါတယ်။

အပေါ်က ဥပမာကို ယူရင် — `string[] | number[]` ကို `(string | number)[]` (ဒါမှမဟုတ် `Array<string | number>`) အဖြစ် ပြောင်းလဲပြီး — `filter` ကို အဲဒီ type ပေါ်မှာ ခေါ်ပါတယ်။
သိမ်မွေ့တဲ့ သတိထားစရာ (caveat) တစ်ခု ရှိပါတယ် — `filter` က `string[] | number[]` အစား `Array<string | number>` တစ်ခုကို ထုတ်ပေးမှာပါ;
ဒါပေမယ့် အသစ်ဖန်တီးလိုက်တဲ့ value တစ်ခုအတွက်တော့ "မှားသွားစရာ" အန္တရာယ် ပိုနည်းပါတယ်။

ဒါကြောင့် — `filter`, `find`, `some`, `every`, `reduce` လိုမျိုး method တွေ အများကြီးက — အရင်က မရခဲ့တဲ့နေရာတွေမှာ — array တွေရဲ့ union တွေပေါ်မှာ ခေါ်လို့ရသွားပါပြီ။

[အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/53489) မှာ အသေးစိတ် နောက်ထပ် ဖတ်နိုင်ပါတယ်။

## Type-Only Import Paths with TypeScript Implementation File Extensions (TypeScript Implementation File Extension များပါသော Type-Only Import Path များ)

TypeScript က `allowImportingTsExtensions` enable ဖြစ်မဖြစ် မသက်ဆိုင်ဘဲ — type-only import path တွေထဲမှာ declaration ရော implementation file extension တွေပါ ထည့်သွင်းခွင့် ပြုပါတယ်။

ဆိုလိုတာက — အခုဆို `.ts`, `.mts`, `.cts`, နဲ့ `.tsx` file extension တွေ သုံးတဲ့ `import type` statement တွေကို ရေးနိုင်ပါပြီ။

```ts
import type { JustAType } from "./justTypes.ts";

export function f(param: JustAType) {
    // ...
}
```

ဒါက — TypeScript ရော JSDoc ပါတဲ့ JavaScript မှာပါ သုံးလို့ရတဲ့ `import()` types တွေက အဲဒီ file extension တွေကို သုံးနိုင်တယ်လို့လည်း ဆိုလိုပါတယ်။

```js
/**
 * @param {import("./justTypes.ts").JustAType} param
 */
export function f(param) {
    // ...
}
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54746)။

## Comma Completions for Object Members (Object Member များအတွက် Comma Completion များ)

object တစ်ခုကို property အသစ်တစ်ခု ထပ်ဖြည့်တဲ့အခါ comma တစ်ခု ထည့်ဖို့ မေ့ပစ်လွယ်ပါတယ်။
အရင်က — comma ကို မေ့ပစ်ပြီး auto-completion ကို တောင်းဆိုလိုက်ရင် — TypeScript က ရှုပ်ထွေးစေတဲ့ မသက်ဆိုင်တဲ့ completion ရလဒ်ဆိုးတွေကို ပေးလေ့ ရှိခဲ့ပါတယ်။

TypeScript 5.2 က — comma တစ်ခု ပျောက်နေတဲ့အခါ — object member completion တွေကို ယခုဆို ချောမွေ့စွာ ပေးပါတယ်။
ဒါပေမယ့် — syntax error တစ်ခုနဲ့ သင့်ကို ရိုက်မသွားဖို့ဆိုပြီး — ပျောက်နေတဲ့ comma ကိုလည်း *အလိုအလျောက်* ထည့်သွင်းပေးပါတယ်။

![ရှေ့က property တစ်ခုရဲ့ နောက်မှာ comma မပါဘဲ ဖြစ်နေပေမယ့် object literal တစ်ခုထဲက property တွေကို complete လုပ်ပေးနေပုံ။ Property နာမည်ကို complete လုပ်ပြီးတာနဲ့ ပျောက်နေတဲ့ comma ကို အလိုအလျောက် ထည့်သွင်းပေးပါတယ်။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/06/comma-completions-5-2-beta.gif)

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက အကောင်အထည်ဖော်မှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/52899)။

## Inline Variable Refactoring (Variable ကို Inline လုပ်သည့် Refactoring)

TypeScript 5.2 မှာ variable တစ်ခုရဲ့ အကြောင်းအရာတွေကို သုံးတဲ့နေရာ (usage site) အားလုံးဆီ inline လုပ်ဖို့ refactoring တစ်ခု အခုဆို ပါဝင်ပါတယ်။

!['path' လို့ခေါ်တဲ့ string တစ်ခုကို initializer အဖြစ်ထားတဲ့ variable တစ်ခု — သူ့ရဲ့ usage နှစ်ခုလုံးကို အစားထိုးခံရပုံ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/06/inline-variable-5-2-beta.gif).

"inline variable" refactoring ကို သုံးခြင်းက variable ကို ဖယ်ရှားပြီး — variable ရဲ့ usage အားလုံးကို သူ့ရဲ့ initializer နဲ့ အစားထိုးပါလိမ့်မယ်။
ဒါက အဲဒီ initializer ရဲ့ side-effect တွေကို — မတူညီတဲ့ အချိန်တစ်ခုမှာ၊ variable ကို သုံးထားသလောက် အကြိမ်ရေ အတိုင်း — run ဖြစ်စေနိုင်တာ သတိပြုပါ။

အသေးစိတ်အတွက် — [အကောင်အထည်ဖော်တဲ့ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54281)။

## Optimized Checks for Ongoing Type Compatibility (ဆက်လက်ဖြစ်ပွားနေသော Type Compatibility အတွက် ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ထားသော စစ်ဆေးမှုများ)

TypeScript က structural type system တစ်ခုဖြစ်တာမို့ — type တွေကို ရံဖန်ရံခါ member တစ်ခုချင်းအလိုက် (member-wise) နှိုင်းယှဉ်ဖို့ လိုအပ်ပါတယ်;
ဒါပေမယ့် recursive type တွေက ဒီနေရာမှာ ပြဿနာတစ်ချို့ ထပ်ဖြည့်ပေးပါတယ်။
ဥပမာ:

```ts
interface A {
    value: A;
    other: string;
}

interface B {
    value: B;
    other: number;
}
```

`A` type က `B` type နဲ့ compatible ဖြစ်မဖြစ် စစ်ဆေးတဲ့အခါ — TypeScript က `A` နဲ့ `B` ထဲက `value` တွေရဲ့ type တွေ အသီးသီး compatible ဖြစ်မဖြစ် စစ်ဆေးတဲ့အထိ ရောက်သွားပါလိမ့်မယ်။
ဒီအချက်မှာ — type system က နောက်ထပ် စစ်ဆေးတာတွေကို ရပ်ပြီး — တခြား member တွေကို ဆက်လုပ်ဖို့ လိုအပ်ပါတယ်။
ဒါလုပ်ဖို့ — type system က type နှစ်ခုကို ဆက်စပ်နေပြီးသား ဖြစ်မဖြစ် ခြေရာခံရပါတယ်။

အရင်က TypeScript က type တွဲတွေရဲ့ stack တစ်ခုကို သိမ်းထားပြီး — အဲဒီ type တွေ ဆက်စပ်နေလားဆိုတာ ဆုံးဖြတ်ဖို့ အဲဒီ stack ကို ဖြတ်ပြီး iterate လုပ်ခဲ့ပါတယ်။
ဒီ stack က ပေါ့ပါးနေတဲ့အခါ အဲဒါက ပြဿနာ မဟုတ်ပါဘူး; ဒါပေမယ့် stack က ပေါ့ပါးမနေဘူးဆိုရင် — အဲဒါက [ပြဿနာတစ်ခုပါ](https://accidentallyquadratic.tumblr.com/)။

TypeScript 5.3 မှာ — ရိုးရှင်းတဲ့ `Set` တစ်ခုက ဒီအချက်အလက်ကို ခြေရာခံဖို့ ကူညီပါတယ်။
ဒါက [drizzle](https://github.com/drizzle-team/drizzle-orm) library ကို သုံးထားတဲ့ အစီရင်ခံထားတဲ့ test case တစ်ခုမှာ ကုန်ဆုံးတဲ့ အချိန်ကို 33% ကျော် လျှော့ချပေးခဲ့ပါတယ်!

```
Benchmark 1: old
  Time (mean ± σ):      3.115 s ±  0.067 s    [User: 4.403 s, System: 0.124 s]
  Range (min … max):    3.018 s …  3.196 s    10 runs
 
Benchmark 2: new
  Time (mean ± σ):      2.072 s ±  0.050 s    [User: 3.355 s, System: 0.135 s]
  Range (min … max):    1.985 s …  2.150 s    10 runs
 
Summary
  'new' ran
    1.50 ± 0.05 times faster than 'old'
```

[ဒီပြောင်းလဲမှုအကြောင်း ဒီမှာ ပိုဖတ်ပါ](https://github.com/microsoft/TypeScript/pull/55224)။

## Breaking Changes and Correctness Fixes (Breaking Changes နှင့် Correctness ပြင်ဆင်မှုများ)

TypeScript က မလိုအပ်ဘဲ breaks တွေ မိတ်ဆက်ဖို့ မကြိုးစားပါဘူး;
ဒါပေမယ့် — code တွေကို ပိုကောင်းအောင် analyze လုပ်နိုင်ဖို့ — ရံဖန်ရံခါ correction တွေနဲ့ တိုးတက်မှုတွေ ပြုလုပ်ဖို့ လိုအပ်ပါတယ်။

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် ထုတ်ပေးတဲ့ type တွေက သင့် codebase အပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [TypeScript 5.2 အတွက် DOM အပ်ဒိတ်တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54725)။

### `labeledElementDeclarations` May Hold `undefined` Elements (`labeledElementDeclarations` တွင် `undefined` Element များ ပါဝင်နိုင်ခြင်း)

[labeled နဲ့ unlabeled element တွေ ရောနှောမှုကို ပံ့ပိုးဖို့](https://github.com/microsoft/TypeScript/pull/53356) — TypeScript ရဲ့ API က နည်းနည်း ပြောင်းလဲသွားပါတယ်။
`TupleType` ရဲ့ `labeledElementDeclarations` property က — element တစ်ခုက unlabeled ဖြစ်တဲ့ နေရာတစ်ခုစီမှာ `undefined` ကို ကိုင်ထားနိုင်ပါတယ်။

```diff
  interface TupleType {
-     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration)[];
+     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration | undefined)[];
  }
```

### `module` and `moduleResolution` Must Match Under Recent Node.js settings (မကြာသေးခင်က Node.js setting များအောက်တွင် `module` နှင့် `moduleResolution` ကိုက်ညီရန် လိုအပ်ခြင်း)

`--module` နဲ့ `--moduleResolution` option တွေက `node16` နဲ့ `nodenext` setting တစ်ခုစီကို ပံ့ပိုးပါတယ်။
ဒါတွေက လက်တွေ့အားဖြင့် — မကြာသေးခင်က Node.js project တိုင်းမှာ သုံးသင့်တဲ့ "ခေတ်မီ Node.js" setting တွေပါ။
ကျွန်တော်တို့ တွေ့ရှိခဲ့တာက — ဒီ option နှစ်ခုက Node.js နဲ့ ဆက်စပ်တဲ့ setting တွေ သုံးနေလားဆိုတာနဲ့ ပတ်သက်ပြီး သဘောမတူညီတဲ့အခါ — project တွေက ထိရောက်စွာ misconfigure ဖြစ်နေတာပါ။

TypeScript 5.2 မှာ — `--module` နဲ့ `--moduleResolution` option နှစ်ခုထဲက တစ်ခုအတွက် `node16` ဒါမှမဟုတ် `nodenext` သုံးထားရင် — TypeScript က ကျန်တစ်ခုမှာလည်း အလားတူ Node.js နဲ့ ဆက်စပ်တဲ့ setting ရှိဖို့ အခုဆို လိုအပ်ပါတယ်။
setting တွေ ကွဲပြားနေတဲ့ ကိစ္စတွေမှာ — အောက်ပါလို error message မျိုး ရနိုင်ပါတယ်

```
Option 'moduleResolution' must be set to 'NodeNext' (or left unspecified) when option 'module' is set to 'NodeNext'.
```

ဒါမှမဟုတ်

```
Option 'module' must be set to 'Node16' when option 'moduleResolution' is set to 'Node16'.
```

ဒါကြောင့် ဥပမာ — `--module esnext --moduleResolution node16` ကို ပယ်ချခံရပါလိမ့်မယ် — ဒါပေမယ့် — `--module nodenext` ကိုပဲ သီးသန့်သုံးတာ၊ ဒါမှမဟုတ် `--module esnext --moduleResolution bundler` ကို သုံးတာက ပိုကောင်းနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54567)။

### Consistent Export Checking for Merged Symbols (Merged Symbol များအတွက် တသမတ်တည်း Export စစ်ဆေးမှု)

declaration နှစ်ခု merge လုပ်တဲ့အခါ — သူတို့ နှစ်ခုလုံး exported ဖြစ်မဖြစ်ဆိုတာနဲ့ ပတ်သက်ပြီး သဘောတူညီမှု ရှိရပါမယ်။
bug တစ်ခုကြောင့် — TypeScript က declaration file တွေ ဒါမှမဟုတ် `declare module` blocks တွေလိုမျိုး ambient context တွေထဲက တိကျတဲ့ ကိစ္စတွေကို လွတ်သွားခဲ့ပါတယ်။
ဥပမာ — `replaceInFile` ကို exported function တစ်ခုအနေနဲ့ တစ်ကြိမ်၊ un-exported namespace တစ်ခုအနေနဲ့ တစ်ကြိမ် ကြေညာထားတဲ့ အောက်ပါလို ကိစ္စမျိုးမှာ error မထုတ်ပေးခဲ့ပါဘူး။

```ts
declare module 'replace-in-file' {
    export function replaceInFile(config: unknown): Promise<unknown[]>;
    export {};

    namespace replaceInFile {
        export function sync(config: unknown): unknown[];
  }
}
```

ambient module တစ်ခုမှာ — `export { ... }` ဒါမှမဟုတ် `export default ...` လိုမျိုး တည်ဆောက်ပုံတစ်ခု ထည့်လိုက်တာက — declaration အားလုံး အလိုအလျောက် exported ဖြစ်မဖြစ်ဆိုတာကို သွယ်ဝိုက်ပြီး ပြောင်းလဲပစ်ပါတယ်။
TypeScript က ဒီကံမကောင်းစွာနဲ့ပဲ ရှုပ်ထွေးစေတဲ့ အဓိပ္ပာယ်တွေကို အခုဆို ပိုပြီး တသမတ်တည်း မှတ်မိပြီး — `replaceInFile` ရဲ့ declaration အားလုံးက သူတို့ရဲ့ modifiers တွေမှာ သဘောတူညီဖို့ လိုအပ်တယ်ဆိုတဲ့အချက်ပေါ် error တစ်ခု ထုတ်ပေးကာ — အောက်ပါ error ကို ပေးပါလိမ့်မယ်:

```
Individual declarations in merged declaration 'replaceInFile' must be all exported or all local.
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54659)။
