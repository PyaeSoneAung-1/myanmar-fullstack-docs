---
title: "TypeScript 5.0 (TypeScript 5.0 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.0 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — decorators အသစ်, `const` type parameters, `extends` တွင် config file အများအပြား, union enums, `--moduleResolution bundler`, `--verbatimModuleSyntax`, JSDoc `@satisfies`/`@overload`, performance နဲ့ package size တိုးတက်မှု, breaking changes နဲ့ deprecation တွေအကြောင်း"
order: 90
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html"
status: translated
updated: 2026-09-05
---

## Decorators (Decorator များ)

Decorators တွေက ECMAScript မှာ မကြာမီပါဝင်လာမယ့် feature တစ်ခုဖြစ်ပြီး — class တွေနဲ့ သူတို့ရဲ့ member တွေကို ပြန်လည်အသုံးပြုနိုင်တဲ့ (reusable) နည်းလမ်းနဲ့ စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။

အောက်ပါ code ကို ကြည့်ကြည့်ရအောင်:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();
```

`greet` က ဒီမှာ တော်တော်လေး ရိုးရှင်းပါတယ် — ဒါပေမယ့် အဲဒါထက် အများကြီး ပိုရှုပ်ထွေးတာမျိုးကို စိတ်ကူးကြည့်ကြည့်ပါ — async logic တစ်ချို့ လုပ်နေတာ၊ recursive ဖြစ်နေတာ၊ side effect တွေ ရှိနေတာ စသဖြင့်ပေါ့။
ဘယ်လို ရှုပ်ထွေးပွေလီတဲ့ "ရွှံ့ဘောလုံး (ball-of-mud)" ကိုပဲ စိတ်ကူးထားပါစေ — `greet` ကို debug လုပ်ဖို့ `console.log` ခေါ်ဆိုမှုတွေ ထည့်ထားတယ်လို့ ဆိုကြပါစို့။

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet() {
        console.log("LOG: Entering method.");

        console.log(`Hello, my name is ${this.name}.`);

        console.log("LOG: Exiting method.")
    }
}
```

ဒီပုံစံက အတော်လေး အသုံးများပါတယ်။
method တိုင်းအတွက် ဒီလိုမျိုး လုပ်ပေးနိုင်မယ့် နည်းလမ်းတစ်ခု ရှိရင် ကောင်းလိုက်မလို့နော်!

ဒီနေရာမှာပဲ decorators တွေ ဝင်လာပါတယ်။
အောက်ပါပုံစံမျိုးရှိတဲ့ `loggedMethod` လို့ခေါ်တဲ့ function တစ်ခုကို ရေးနိုင်ပါတယ်:

```ts
function loggedMethod(originalMethod: any, _context: any) {

    function replacementMethod(this: any, ...args: any[]) {
        console.log("LOG: Entering method.")
        const result = originalMethod.call(this, ...args);
        console.log("LOG: Exiting method.")
        return result;
    }

    return replacementMethod;
}
```

"ဒီ `any` တွေ အကုန်လုံးက ဘာတွေလဲ?
ဒါ `any`Script လား!?"

စိတ်ရှည်ရှည်ထားပါ — ဒီ function က ဘာလုပ်နေလဲဆိုတာကိုပဲ အာရုံစိုက်နိုင်ဖို့ — အခုအချိန်မှာ အရာတွေကို ရိုးရိုးရှင်းရှင်းပဲ ထားထားတာပါ။
`loggedMethod` က မူရင်း method (`originalMethod`) ကို ယူပြီး — အောက်ပါအတိုင်း လုပ်တဲ့ function တစ်ခုကို ပြန်ပေးတာကို သတိပြုပါ:

1. "Entering..." message တစ်ခု log လုပ်တယ်
2. `this` နဲ့ သူ့ရဲ့ argument အားလုံးကို မူရင်း method ဆီ လက်ဆင့်ကမ်းပေးတယ်
3. "Exiting..." message တစ်ခု log လုပ်တယ်၊ ပြီးတော့
4. မူရင်း method က ပြန်ပေးတဲ့အရာကို ပြန်ပေးတယ်။

အခုဆို `loggedMethod` ကို သုံးပြီး `greet` method ကို *decorate* (အလှဆင်) လုပ်နိုင်ပါပြီ:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();

// Output:
//
//   LOG: Entering method.
//   Hello, my name is Ray.
//   LOG: Exiting method.
```

အခုနက `loggedMethod` ကို `greet` အပေါ်မှာ decorator အဖြစ် သုံးခဲ့တာပါ — `@loggedMethod` ဆိုပြီး ရေးထားတာကို သတိထားမိပါလိမ့်မယ်။
အဲဒီလို ရေးလိုက်တဲ့အခါ — method ရဲ့ *target* နဲ့ *context object* တစ်ခုနဲ့အတူ အဲဒီ function ကို ခေါ်ယူလိုက်ပါတယ်။
`loggedMethod` က function အသစ်တစ်ခုကို ပြန်ပေးတာမို့ — အဲဒီ function က `greet` ရဲ့ မူရင်း definition ကို အစားထိုးလိုက်ပါတယ်။

အခုထိ မပြောသေးပေမယ့် — `loggedMethod` ကို second parameter တစ်ခုနဲ့ သတ်မှတ်ထားပါတယ်။
အဲဒါကို "context object" လို့ ခေါ်ပြီး — decorate လုပ်ခံရတဲ့ method ကို ဘယ်လို ကြေညာထားလဲဆိုတဲ့ အသုံးဝင်တဲ့ အချက်အလက်တစ်ချို့ ပါဝင်ပါတယ် — `#private` member လား၊ `static` လား၊ method ရဲ့ နာမည်က ဘာလဲ ဆိုတာမျိုးပါ။
အဲဒါကို အခွင့်ကောင်းယူပြီး — decorate လုပ်ခံရတဲ့ method ရဲ့ နာမည်ကို print ထုတ်ဖို့ `loggedMethod` ကို ပြန်ရေးကြည့်ရအောင်:

```ts
function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = originalMethod.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
}
```

အခုဆို context parameter ကို သုံးနေပါပြီ — `loggedMethod` ထဲမှာ `any` နဲ့ `any[]` ထက် ပိုတင်းကျပ်တဲ့ type ရှိတဲ့ ပထမဆုံး အရာလည်း ဖြစ်ပါတယ်။
method decorator တွေ လက်ခံရရှိတဲ့ context object ကို ပုံစံထုတ်ပေးတဲ့ `ClassMethodDecoratorContext` လို့ခေါ်တဲ့ type တစ်ခုကို TypeScript က ပံ့ပိုးပေးပါတယ်။

metadata အပြင် — method တွေအတွက် context object မှာ `addInitializer` လို့ခေါ်တဲ့ အသုံးဝင်တဲ့ function တစ်ခုလည်း ပါပါတယ်။
ဒါက constructor ရဲ့ အစပိုင်း (ဒါမှမဟုတ် `static` တွေနဲ့ အလုပ်လုပ်နေတယ်ဆိုရင် class ကိုယ်တိုင်ရဲ့ initialization) ထဲကို ချိတ်ဝင်ဖို့ နည်းလမ်းတစ်ခုပါ။

ဥပမာအနေနဲ့ — JavaScript မှာ အောက်ပါပုံစံမျိုး ရေးလေ့ရှိပါတယ်:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;

        this.greet = this.greet.bind(this);
    }

    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}
```

တစ်နည်းအားဖြင့် — `greet` ကို arrow function တစ်ခုဆီ initializes လုပ်ထားတဲ့ property တစ်ခုအနေနဲ့ ကြေညာထားတာမျိုးလည်း ဖြစ်နိုင်ပါတယ်။

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet = () => {
        console.log(`Hello, my name is ${this.name}.`);
    };
}
```

ဒီ code က — `greet` ကို သီးသန့် function တစ်ခုအနေနဲ့ ခေါ်တာပဲဖြစ်ဖြစ် — callback အဖြစ် ပေးလိုက်တာပဲဖြစ်ဖြစ် — `this` က ပြန်ပြီး re-bound မဖြစ်အောင် သေချာစေဖို့ ရေးထားတာပါ။

```ts
const greet = new Person("Ray").greet;

// We don't want this to fail!
greet();
```

ကျွန်တော်တို့အတွက် constructor ထဲမှာ `bind` ကို ခေါ်ပေးမယ့် — `addInitializer` ကို သုံးတဲ့ decorator တစ်ခုကို ရေးနိုင်ပါတယ်။

```ts
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;
    if (context.private) {
        throw new Error(`'bound' cannot decorate private properties like ${methodName as string}.`);
    }
    context.addInitializer(function () {
        this[methodName] = this[methodName].bind(this);
    });
}
```

`bound` က ဘာမှ ပြန်မပေးပါဘူး — ဒါကြောင့် method တစ်ခုကို decorate လုပ်တဲ့အခါ — မူရင်းဟာကို မပြောင်းဘဲ ထားခဲ့ပါတယ်။
အဲဒီအစား — တခြား field တွေ initialize မလုပ်ခင် logic တစ်ခုကို ထည့်ပေးပါတယ်။

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @bound
    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
const greet = p.greet;

// Works!
greet();
```

decorator နှစ်ခုကို — `@bound` နဲ့ `@loggedMethod` — အထပ်လိုက် တပ်ထားတာကို သတိပြုပါ။
ဒီ decoration တွေက "ပြောင်းပြန် အစီအစဉ် (reverse order)" နဲ့ အလုပ်လုပ်ပါတယ်။
ဆိုလိုတာက — `@loggedMethod` က မူရင်း `greet` method ကို decorate လုပ်ပြီး — `@bound` က `@loggedMethod` ရဲ့ ရလဒ်ကို decorate လုပ်ပါတယ်။
ဒီဥပမာမှာတော့ အရေးမကြီးပါဘူး — ဒါပေမယ့် သင့် decorator တွေမှာ side effect တွေရှိနေရင် ဒါမှမဟုတ် အစီအစဉ်တစ်ခုကို မျှော်လင့်ထားရင်တော့ အရေးကြီးလာနိုင်ပါတယ်။

နောက်ထပ် သတိပြုစရာတစ်ခု — style အရ ကြိုက်နှစ်သက်တယ်ဆိုရင် ဒီ decorator တွေကို line တစ်ကြောင်းတည်းပေါ်မှာလည်း ထားနိုင်ပါတယ်။

```ts
    @bound @loggedMethod greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
```

သိသာမှာ မဟုတ်တဲ့အချက်တစ်ခုက — decorator function တွေကို *ပြန်ပေးတဲ့* (return) function တွေတောင် ဖန်တီးနိုင်တာပါ။
ဒါက နောက်ဆုံး decorator ကို နည်းနည်းလေး စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။
လိုချင်ရင် — `loggedMethod` ကို decorator တစ်ခု ပြန်ပေးတဲ့ပုံစံ ဖြစ်အောင် လုပ်ပြီး — သူ့ရဲ့ message တွေကို ဘယ်လို log လုပ်မလဲဆိုတာ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

```ts
function loggedMethod(headMessage = "LOG:") {
    return function actualDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        const methodName = String(context.name);

        function replacementMethod(this: any, ...args: any[]) {
            console.log(`${headMessage} Entering method '${methodName}'.`)
            const result = originalMethod.call(this, ...args);
            console.log(`${headMessage} Exiting method '${methodName}'.`)
            return result;
        }

        return replacementMethod;
    }
}
```

အဲဒီလို လုပ်မယ်ဆိုရင် — decorator အဖြစ် မသုံးခင် `loggedMethod` ကို အရင်ခေါ်ယူ (call) ရပါမယ်။
ပြီးတော့ console မှာ log လုပ်မယ့် message တွေရဲ့ prefix အဖြစ် string ဘယ်ဟာကိုမဆို ထည့်ပေးနိုင်ပါတယ်။

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod("⚠️")
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();

// Output:
//
//   ⚠️ Entering method 'greet'.
//   Hello, my name is Ray.
//   ⚠️ Exiting method 'greet'.
```

Decorators တွေက method တွေပေါ်မှာပဲ သုံးလို့ရတာ မဟုတ်ပါဘူး!
properties/fields, getters, setters နဲ့ auto-accessors တွေပေါ်မှာလည်း သုံးနိုင်ပါတယ်။
subclassing နဲ့ registration လိုအရာတွေအတွက် class ကိုယ်တိုင်ကိုတောင် decorate လုပ်နိုင်ပါတယ်။

Decorator တွေအကြောင်း အသေးစိပ် လေ့လာချင်ရင် — [Axel Rauschmayer ရဲ့ ကျယ်ကျယ်ပြန့်ပြန့် အနှစ်ချုပ်](https://2ality.com/2022/10/javascript-decorators.html) ကို ဖတ်နိုင်ပါတယ်။

ပါဝင်ပတ်သက်တဲ့ ပြောင်းလဲမှုတွေအကြောင်း ပိုမိုသိရှိဖို့ — [မူရင်း pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50820)။

### Differences with Experimental Legacy Decorators (Experimental Legacy Decorator များနှင့် ကွာခြားချက်များ)

TypeScript ကို ခဏလောက် သုံးနေတဲ့သူဆိုရင် — "experimental" decorator တွေကို နှစ်ပေါင်းများစွာကတည်းက ပံ့ပိုးပေးခဲ့တယ်ဆိုတာ သိပါလိမ့်မယ်။
ဒီ experimental decorator တွေက မယုံနိုင်လောက်အောင် အသုံးဝင်ခဲ့ပေမယ့် — သူတို့က decorators proposal ရဲ့ များစွာ အဟောင်းကျတဲ့ ဗားရှင်းတစ်ခုကို ပုံစံထုတ်ထားပြီး — `--experimentalDecorators` လို့ခေါ်တဲ့ opt-in compiler flag တစ်ခု အမြဲ လိုအပ်ခဲ့ပါတယ်။
ဒီ flag မပါဘဲ TypeScript မှာ decorator တွေ သုံးဖို့ ကြိုးစားမှုတိုင်းက အရင်က error message တစ်ခု ထုတ်ပေးခဲ့ပါတယ်။

`--experimentalDecorators` က မဝေးတော့တဲ့ အနာဂတ်အထိ ဆက်လက် တည်ရှိနေဦးမှာပါ — ဒါပေမယ့် — flag မပါဘဲနဲ့တော့ — decorator တွေက ယခုဆို code အသစ်အားလုံးအတွက် တရားဝင် syntax တစ်ခု ဖြစ်လာပါပြီ။
`--experimentalDecorators` ရဲ့ အပြင်ဘက်မှာတော့ — သူတို့ကို type-check လုပ်ပုံနဲ့ emit လုပ်ပုံက မတူညီပါဘူး။
type-checking စည်းမျဉ်းတွေနဲ့ emit က လုံလောက်လောက်အောင် ကွဲပြားတာမို့ — decorator တွေကို အဟောင်း နဲ့ အသစ် အပြုအမူ နှစ်ခုလုံးကို ပံ့ပိုးအောင် ရေးလို့ *ရနိုင်* ပေမယ့် — ရှိပြီးသား decorator function တွေက အဲဒီလို လုပ်နိုင်ဖို့တော့ မဖြစ်နိုင်လောက်ပါဘူး။

ဒီ decorators proposal အသစ်က `--emitDecoratorMetadata` နဲ့ compatible မဟုတ်သလို — parameter တွေကို decorate လုပ်တာကိုလည်း ခွင့်မပြုပါဘူး။
အနာဂတ် ECMAScript proposal တွေက အဲဒီကွာဟချက်ကို ပေါင်းကူးပေးနိုင်ဖို့ ကူညီလာနိုင်ပါတယ်။

နောက်ဆုံး မှတ်ချက်တစ်ခု — decorator တွေကို `export` keyword ရဲ့ ရှေ့မှာ ထားခွင့်ပြုတာအပြင် — decorator တွေကို `export` ဒါမှမဟုတ် `export default` ရဲ့ နောက်မှာ ထားနိုင်တဲ့ option ကိုလည်း proposal အသစ်က ပံ့ပိုးပေးပါတယ်။
တစ်ခုတည်းသော ခြွင်းချက်က — style နှစ်မျိုးကို ရောနှောသုံးတာ ခွင့်မပြုပါဘူး။

```js
// ✅ allowed
@register export default class Foo {
    // ...
}

// ✅ also allowed
export default @register class Bar {
    // ...
}

// ❌ error - before *and* after is not allowed
@before export @after class Bar {
    // ...
}
```

### Writing Well-Typed Decorators (Well-Typed Decorator များ ရေးသားခြင်း)

အပေါ်က `loggedMethod` နဲ့ `bound` decorator ဥပမာတွေက ရည်ရွယ်ချက်ရှိရှိ ရိုးရှင်းအောင် ထားထားပြီး — type တွေအကြောင်း အသေးစိတ် အများကြီးကို ချန်လှပ်ထားပါတယ်။

Decorator တွေကို type သတ်မှတ်တာက အတော်လေး ရှုပ်ထွေးနိုင်ပါတယ်။
ဥပမာ — အပေါ်က `loggedMethod` ရဲ့ type ကောင်းကောင်း သတ်မှတ်ထားတဲ့ (well-typed) ဗားရှင်းတစ်ခုက ဒီပုံစံမျိုး ဖြစ်နိုင်ပါတယ်:

```ts
function loggedMethod<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    const methodName = String(context.name);

    function replacementMethod(this: This, ...args: Args): Return {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = target.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
}
```

မူရင်း method ရဲ့ `this` ရဲ့ type၊ parameter တွေနဲ့ return type ကို — `This`, `Args`, နဲ့ `Return` ဆိုတဲ့ type parameter တွေသုံးပြီး — သပ်သပ်စီ ပုံစံထုတ်ပေးခဲ့ရပါတယ်။

သင့် decorator function တွေကို ဘယ်လောက် ရှုပ်ထွေးအောင် သတ်မှတ်မလဲဆိုတာ — သင်ဘာတွေကို အာမခံချင်လဲဆိုတဲ့အပေါ် မူတည်ပါတယ်။
သတိထားစရာတစ်ခုက — သင့် decorator တွေက ရေးတာထက် သုံးတာ ပိုများပါလိမ့်မယ် — ဒါကြောင့် type ကောင်းကောင်း သတ်မှတ်ထားတဲ့ ဗားရှင်းက များသောအားဖြင့် ပိုနှစ်သက်ဖွယ် ကောင်းပါတယ် — ဒါပေမယ့် readability နဲ့ အပေးအယူ (trade-off) ရှိတာ သေချာလို့ — အရာတွေကို ရိုးရိုးရှင်းရှင်းပဲ ထားဖို့ ကြိုးစားပါ။

Decorator တွေ ရေးသားခြင်းဆိုင်ရာ documentation တွေ နောက်ထပ် ထွက်လာပါဦးမယ် — ဒါပေမယ့် [ဒီ post](https://2ality.com/2022/10/javascript-decorators.html) မှာတော့ decorator တွေရဲ့ ယန္တရားပိုင်းအတွက် အသေးစိတ် အတော်များများ ပါဝင်ပါတယ်။
## `const` Type Parameters (`const` Type Parameter များ)

object တစ်ခုရဲ့ type ကို infer လုပ်တဲ့အခါ — TypeScript က များသောအားဖြင့် ယေဘုယျဆန်တဲ့ (general) type တစ်ခုကို ရွေးချယ်ပါတယ်။
ဥပမာ — ဒီကိစ္စမှာ `names` ရဲ့ inferred type က `string[]` ဖြစ်ပါတယ်:

```ts
type HasNames = { names: readonly string[] };
function getNamesExactly<T extends HasNames>(arg: T): T["names"] {
    return arg.names;
}

// Inferred type: string[]
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});
```

များသောအားဖြင့် ဒါရဲ့ ရည်ရွယ်ချက်က — နောက်ပိုင်းမှာ mutation (ပြောင်းလဲမှု) လုပ်နိုင်ဖို့ ဖြစ်စေချင်တာပါ။

ဒါပေမယ့် `getNamesExactly` က အတိအကျ ဘာလုပ်လဲ၊ ဘယ်လို သုံးဖို့ ရည်ရွယ်ထားလဲဆိုတဲ့အပေါ် မူတည်ပြီး — ပိုပြီး တိကျတဲ့ (more-specific) type တစ်ခုကို လိုချင်တာမျိုး မကြာခဏ ဖြစ်နိုင်ပါတယ်။

အခုအချိန်အထိ — API author တွေက လိုချင်တဲ့ inference ရဖို့ — နေရာအချို့မှာ `as const` ထည့်ဖို့ အကြံပြုနေရပါတယ်:

```ts
// The type we wanted:
//    readonly ["Alice", "Bob", "Eve"]
// The type we got:
//    string[]
const names1 = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});

// Correctly gets what we wanted:
//    readonly ["Alice", "Bob", "Eve"]
const names2 = getNamesExactly({ names: ["Alice", "Bob", "Eve"]} as const);
```

ဒါက ခပ်ရှုပ်ရှုပ်နဲ့ မေ့လွယ်တတ်ပါတယ်။
TypeScript 5.0 မှာတော့ — type parameter declaration တစ်ခုပေါ်မှာ `const` modifier ကို ထည့်လိုက်ရင် — `const` လိုမျိုး inference ကို default ဖြစ်စေနိုင်ပါပြီ:

```ts
type HasNames = { names: readonly string[] };
function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
//                       ^^^^^
    return arg.names;
}

// Inferred type: readonly ["Alice", "Bob", "Eve"]
// Note: Didn't need to write 'as const' here
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });
```

`const` modifier က mutable value တွေကို *ပယ်ချ (reject)* တာ မဟုတ်သလို — immutable constraint တွေကိုလည်း မလိုအပ်ပါဘူးဆိုတာ သတိပြုပါ။
Mutable type constraint တစ်ခု သုံးမိရင် အံ့အားသင့်စရာ ရလဒ်တွေ ထွက်နိုင်ပါတယ်။
ဥပမာ:

```ts
declare function fnBad<const T extends string[]>(args: T): void;

// 'T' is still 'string[]' since 'readonly ["a", "b", "c"]' is not assignable to 'string[]'
fnBad(["a", "b" ,"c"]);
```

ဒီမှာ `T` အတွက် inferred candidate က `readonly ["a", "b", "c"]` ဖြစ်ပြီး — mutable array တစ်ခု လိုအပ်တဲ့နေရာမှာ `readonly` array တစ်ခုကို သုံးလို့ မရပါဘူး။
ဒီကိစ္စမှာ inference က constraint ဆီ ပြန်ကျပြီး — array ကို `string[]` အနေနဲ့ သဘောထားကာ — call က အောင်မြင်စွာ ဆက်လုပ်သွားပါတယ်။

ဒီ function ရဲ့ ပိုကောင်းတဲ့ definition တစ်ခုကတော့ `readonly string[]` ကို သုံးသင့်ပါတယ်:

```ts
declare function fnGood<const T extends readonly string[]>(args: T): void;

// T is readonly ["a", "b", "c"]
fnGood(["a", "b" ,"c"]);
```

အလားတူပဲ — `const` modifier က call အတွင်းမှာ ရေးထားတဲ့ object, array နဲ့ primitive expression တွေရဲ့ inference ကိုပဲ သက်ရောက်မှုရှိပြီး — `as const` နဲ့ ပြင်ဆင်စရာ မလို (ဒါမှမဟုတ် မလိုနိုင်) တဲ့ argument တွေကတော့ အပြုအမူ ပြောင်းလဲမှု လုံးဝ မရှိဘူးဆိုတာ မှတ်ထားပါ:

```ts
declare function fnGood<const T extends readonly string[]>(args: T): void;
const arr = ["a", "b" ,"c"];

// 'T' is still 'string[]'-- the 'const' modifier has no effect here
fnGood(arr);
```

အသေးစိတ်အတွက် [pull request](https://github.com/microsoft/TypeScript/pull/51865) နဲ့ — ([ပထမ](https://github.com/microsoft/TypeScript/issues/30680) နဲ့ [ဒုတိယ](https://github.com/microsoft/TypeScript/issues/41114)) လှုံ့ဆော်ပေးတဲ့ issue တွေကို ကြည့်ပါ။

## Supporting Multiple Configuration Files in `extends` (`extends` တွင် Configuration File အများအပြား ပံ့ပိုးခြင်း)

project အများအပြားကို စီမံခန့်ခွဲတဲ့အခါ — တခြား `tsconfig.json` file တွေ extend (ဆက်ခံ) လုပ်နိုင်တဲ့ "base" configuration file တစ်ခု ရှိတာက အသုံးဝင်ပါတယ်။
ဒါကြောင့်မို့လို့ TypeScript က `compilerOptions` ကနေ field တွေကို ကူးယူဖို့ `extends` field တစ်ခုကို ပံ့ပိုးပေးတာပါ။

```jsonc
// packages/front-end/src/tsconfig.json
{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

ဒါပေမယ့် — configuration file အများအပြားကနေ extend လုပ်ချင်တဲ့ အခြေအနေတွေ ရှိနိုင်ပါတယ်။
ဥပမာ — [npm ပေါ်ကို တင်ထားတဲ့ TypeScript base configuration file တစ်ခု](https://github.com/tsconfig/bases) ကို သုံးနေတယ်ဆိုပါစို့။
သင့် project တွေအားလုံးက npm ပေါ်က `@tsconfig/strictest` package ရဲ့ option တွေကိုပါ သုံးစေချင်တယ်ဆိုရင် — ရိုးရှင်းတဲ့ ဖြေရှင်းနည်းတစ်ခု ရှိပါတယ်: `tsconfig.base.json` က `@tsconfig/strictest` ကနေ extend လုပ်လိုက်ရုံပါပဲ:

```jsonc
// tsconfig.base.json
{
    "extends": "@tsconfig/strictest/tsconfig.json",
    "compilerOptions": {
        // ...
    }
}
```

ဒါက တစ်နေရာရာအထိတော့ အလုပ်လုပ်ပါတယ်။
`@tsconfig/strictest` ကို *မသုံးချင်တဲ့* project တွေရှိရင် — အဲဒီ option တွေကို ကိုယ်တိုင် ပိတ်ပစ်ရမယ်၊ ဒါမှမဟုတ် `@tsconfig/strictest` ကနေ extend *မလုပ်ထားတဲ့* `tsconfig.base.json` ရဲ့ သီးခြား ဗားရှင်းတစ်ခု ဖန်တီးရပါတယ်။

ဒီနေရာမှာ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေဖို့ — TypeScript 5.0 က `extends` field ကို entry အများအပြား လက်ခံနိုင်အောင် လုပ်ပေးထားပါတယ်။
ဥပမာ — ဒီ configuration file ထဲမှာ:

```jsonc
{
    "extends": ["a", "b", "c"],
    "compilerOptions": {
        // ...
    }
}
```

ဒီလိုရေးတာက — `c` ကို တိုက်ရိုက် extend လုပ်နေသလိုမျိုး ဖြစ်ပြီး — `c` က `b` ကို extend လုပ်ကာ — `b` က `a` ကို extend လုပ်နေတာနဲ့ တူပါတယ်။
field တွေ "ထိပ်တိုက် (conflict)" ဖြစ်ရင် — နောက်မှာပါတဲ့ entry က အနိုင်ရပါတယ်။

ဒါကြောင့် အောက်ပါ ဥပမာမှာ — နောက်ဆုံး `tsconfig.json` ထဲမှာ `strictNullChecks` ရော `noImplicitAny` ပါ enable ဖြစ်နေပါတယ်။

```jsonc
// tsconfig1.json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}

// tsconfig2.json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}

// tsconfig.json
{
    "extends": ["./tsconfig1.json", "./tsconfig2.json"],
    "files": ["./index.ts"]
}
```

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — မူရင်း ဥပမာကို အောက်ပါအတိုင်း ပြန်ရေးလို့ ရပါတယ်။

```jsonc
// packages/front-end/src/tsconfig.json
{
    "extends": ["@tsconfig/strictest/tsconfig.json", "../../../tsconfig.base.json"],
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

အသေးစိတ်အတွက် — [မူရင်း pull request မှာ နောက်ထပ် ဖတ်ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/50403)။

## All `enum`s Are Union `enum`s (`enum` အားလုံးသည် Union `enum` များ ဖြစ်လာခြင်း)

TypeScript က enums တွေကို စတင် မိတ်ဆက်တုန်းက — သူတို့ဟာ type တစ်ခုတည်း အတူတူရှိတဲ့ numeric constant အစုတစ်စုထက် ပိုတာ ဘာမှ မဟုတ်ခဲ့ပါဘူး။

```ts
enum E {
    Foo = 10,
    Bar = 20,
}
```

`E.Foo` နဲ့ `E.Bar` ရဲ့ ထူးခြားချက်က — `E` type ကို မျှော်လင့်ထားတဲ့ ဘယ်အရာဆီမဆို assignable ဖြစ်တာပါ။
အဲဒါကလွဲလို့ — သူတို့က `number` တွေပဲ ဖြစ်ပါတယ်။

```ts
function takeValue(e: E) {}

takeValue(E.Foo); // works
takeValue(123); // error!
```

TypeScript 2.0 က enum literal types တွေကို မိတ်ဆက်ပေးတဲ့အထိ enums တွေက နည်းနည်းလေး ပိုထူးခြားလာတာ မဟုတ်ပါဘူး။
Enum literal types တွေက enum member တစ်ခုချင်းစီကို ကိုယ်ပိုင် type တစ်ခုစီ ပေးခဲ့ပြီး — enum ကိုယ်တိုင်ကို member type တစ်ခုချင်းစီရဲ့ *union* တစ်ခု ဖြစ်သွားစေခဲ့ပါတယ်။
သူတို့က enum တစ်ခုရဲ့ type တွေထဲက အုပ်စုခွဲတစ်ခုကိုပဲ ရည်ညွှန်းနိုင်အောင်၊ အဲဒီ type တွေကို narrow လုပ်ပစ်နိုင်အောင်လည်း ခွင့်ပြုပေးခဲ့ပါတယ်။

```ts
// Color is like a union of Red | Orange | Yellow | Green | Blue | Violet
enum Color {
    Red, Orange, Yellow, Green, Blue, /* Indigo, */ Violet
}

// Each enum member has its own type that we can refer to!
type PrimaryColor = Color.Red | Color.Green | Color.Blue;

function isPrimaryColor(c: Color): c is PrimaryColor {
    // Narrowing literal types can catch bugs.
    // TypeScript will error here because
    // we'll end up comparing 'Color.Red' to 'Color.Green'.
    // We meant to use ||, but accidentally wrote &&.
    return c === Color.Red && c === Color.Green && c === Color.Blue;
}
```

enum member တစ်ခုချင်းစီကို ကိုယ်ပိုင် type တစ်ခုစီ ပေးတာရဲ့ ပြဿနာတစ်ခုက — အဲဒီ type တွေက member ရဲ့ တကယ့် value နဲ့ တစ်စိတ်တစ်ပိုင်း ဆက်စပ်နေတာပါ။
တစ်ချို့ကိစ္စတွေမှာ အဲဒီ value ကို တွက်ချက်လို့ မရနိုင်ပါဘူး — ဥပမာ — enum member တစ်ခုကို function call တစ်ခုနဲ့ initialize လုပ်ထားတာမျိုးပါ။

```ts
enum E {
    Blah = Math.random()
}
```

TypeScript က ဒီလို ပြဿနာတွေနဲ့ ကြုံတိုင်း — ဘာမှမပြောဘဲ နောက်ဆုတ်ပြီး — enum strategy အဟောင်းကို သုံးလိုက်ပါတယ်။
ဆိုလိုတာက union နဲ့ literal types တွေရဲ့ အားသာချက်အားလုံးကို စွန့်လွှတ်လိုက်ရတာပါ။

TypeScript 5.0 ကတော့ — computed member တစ်ခုချင်းစီအတွက် ထူးခြားတဲ့ type တစ်ခုစီ ဖန်တီးခြင်းအားဖြင့် — enums အားလုံးကို union enums အဖြစ် ပြောင်းလဲနိုင်ခဲ့ပါတယ်။
ဆိုလိုတာက — enums အားလုံးကို ယခုဆို narrow လုပ်နိုင်ပြီး — သူတို့ရဲ့ member တွေကိုလည်း type တွေအနေနဲ့ ရည်ညွှန်းနိုင်ပါပြီ။

ဒီပြောင်းလဲမှုအကြောင်း အသေးစိတ်အတွက် — [GitHub ပေါ်မှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50528)။
## `--moduleResolution bundler`

TypeScript 4.7 က သူ့ရဲ့ `--module` နဲ့ `--moduleResolution` setting တွေအတွက် `node16` နဲ့ `nodenext` option တွေကို မိတ်ဆက်ပေးခဲ့ပါတယ်။
ဒီ option တွေရဲ့ ရည်ရွယ်ချက်က — Node.js ထဲက ECMAScript module တွေအတွက် တိကျတဲ့ lookup စည်းမျဉ်းတွေကို ပိုကောင်းအောင် ပုံစံထုတ်ဖို့ပါ — ဒါပေမယ့် — ဒီ mode မှာ တခြား tool တွေက တကယ်တမ်း မကျင့်သုံးတဲ့ ကန့်သတ်ချက်တွေ အများကြီး ပါဝင်နေပါတယ်။

ဥပမာ — Node.js ထဲက ECMAScript module တစ်ခုမှာ — relative import တိုင်းမှာ file extension ပါဝင်ဖို့ လိုပါတယ်။

```js
// entry.mjs
import * as utils from "./utils";     // ❌ wrong - we need to include the file extension.

import * as utils from "./utils.mjs"; // ✅ works
```

Node.js နဲ့ browser တွေမှာ ဒါအတွက် အကြောင်းပြချက်တွေ ရှိပါတယ် — file lookup တွေ ပိုမြန်စေပြီး — ရိုးရိုးရှင်းရှင်း file server တွေအတွက် ပိုကောင်းမွန်စေလို့ပါ။
ဒါပေမယ့် bundler လိုမျိုး tool တွေကို သုံးနေတဲ့ developer အများစုအတွက်တော့ — `node16`/`nodenext` setting တွေက ခပ်ရှုပ်ရှုပ်ပါ — အကြောင်းကတော့ bundler တွေမှာ ဒီကန့်သတ်ချက်တွေ အများစု မရှိလို့ပါ။
တစ်နည်းအားဖြင့် — bundler သုံးသူတိုင်းအတွက် `node` resolution mode က ပိုကောင်းခဲ့ပါတယ်။

ဒါပေမယ့် တစ်နည်းအားဖြင့်တော့ — မူရင်း `node` resolution mode က အခုဆို ခေတ်နောက်ကျနေပါပြီ။
ခေတ်မီ bundler အများစုက Node.js ထဲက ECMAScript module နဲ့ CommonJS lookup စည်းမျဉ်း နှစ်ခုရဲ့ ပေါင်းစပ်မှုကို သုံးကြပါတယ်။
ဥပမာ — extension မပါတဲ့ imports တွေက CommonJS မှာလိုပဲ အဆင်ပြေပြေ အလုပ်လုပ်ပေမယ့် — package တစ်ခုရဲ့ [`export` conditions](https://nodejs.org/api/packages.html#nested-conditions) တွေကို ကြည့်တဲ့အခါမှာတော့ — ECMAScript file တစ်ခုမှာလိုပဲ `import` condition ကို ဦးစားပေးပါတယ်။

Bundler တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို ပုံစံထုတ်ဖို့ — TypeScript က strategy အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်: `--moduleResolution bundler`။

```jsonc
{
    "compilerOptions": {
        "target": "esnext",
        "moduleResolution": "bundler"
    }
}
```

Vite, esbuild, swc, Webpack, Parcel စတဲ့ — hybrid lookup strategy ကို အကောင်အထည်ဖော်ထားတဲ့ ခေတ်မီ bundler တစ်ခုကို သုံးနေတယ်ဆိုရင် — `bundler` option အသစ်က သင့်အတွက် ကိုက်ညီမှု ရှိပါလိမ့်မယ်။

တစ်ဖက်မှာလည်း — npm ပေါ်မှာ ထုတ်ဝေဖို့ ရည်ရွယ်ထားတဲ့ library တစ်ခု ရေးနေတယ်ဆိုရင် — `bundler` option ကို သုံးတာက — bundler မသုံးတဲ့ သင့်သုံးစွဲသူတွေအတွက် ပေါ်ပေါက်လာနိုင်တဲ့ compatibility ပြဿနာတွေကို ဖုံးကွယ်ထားနိုင်ပါတယ်။
ဒါကြောင့် ဒီလိုကိစ္စမျိုးတွေမှာ — `node16` ဒါမှမဟုတ် `nodenext` resolution option တွေကို သုံးတာက ပိုကောင်းတဲ့ လမ်းကြောင်း ဖြစ်နိုင်ပါတယ်။

`--moduleResolution bundler` အကြောင်း ပိုဖတ်ချင်ရင် — [အကောင်အထည်ဖော်တဲ့ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/51669)။

## Resolution Customization Flags (Resolution စိတ်ကြိုက်ပြင်ဆင်မှု Flag များ)

JavaScript tool တွေက အခုဆို အပေါ်မှာ ဖော်ပြခဲ့တဲ့ `bundler` mode လိုမျိုး "hybrid" resolution စည်းမျဉ်းတွေကို ပုံစံထုတ်နိုင်ပါပြီ။
Tool တွေရဲ့ ပံ့ပိုးမှုက နည်းနည်းစီ ကွဲပြားနိုင်တာမို့ — TypeScript 5.0 က သင့် configuration နဲ့ အလုပ်လုပ်မလုပ်ပေါ် မူတည်တဲ့ feature တစ်ချို့ကို enable/disable လုပ်ဖို့ နည်းလမ်းတွေ ပေးထားပါတယ်။

### `allowImportingTsExtensions`

`--allowImportingTsExtensions` က TypeScript file တွေ အချင်းချင်း — `.ts`, `.mts`, ဒါမှမဟုတ် `.tsx` လို TypeScript-သီးသန့် extension တွေနဲ့ import လုပ်ခွင့် ပေးပါတယ်။

ဒီ flag က `--noEmit` ဒါမှမဟုတ် `--emitDeclarationOnly` enable ဖြစ်နေမှသာ ခွင့်ပြုပါတယ် — အကြောင်းကတော့ ဒီ import path တွေက JavaScript output file တွေထဲမှာ runtime မှာ resolve လုပ်လို့ မရနိုင်လို့ပါ။
ဒီမှာ မျှော်လင့်ချက်က — သင့် resolver (ဥပမာ သင့် bundler, runtime ဒါမှမဟုတ် တခြား tool တစ်ခုခု) က `.ts` file တွေကြားက ဒီ imports တွေကို အလုပ်ဖြစ်အောင် လုပ်ပေးမှာပါ။

### `resolvePackageJsonExports`

`--resolvePackageJsonExports` က TypeScript ကို — `node_modules` ထဲက package တစ်ခုကနေ ဖတ်တိုင်း — [package.json file တွေရဲ့ `exports` field](https://nodejs.org/api/packages.html#exports) ကို တိုင်ပင်ဖို့ တွန်းအားပေးပါတယ်။

ဒီ option က `--moduleResolution` အတွက် `node16`, `nodenext` နဲ့ `bundler` option တွေအောက်မှာ default အနေနဲ့ `true` ဖြစ်ပါတယ်။

### `resolvePackageJsonImports`

`--resolvePackageJsonImports` က TypeScript ကို — သူ့ရဲ့ ဘိုးဘေး directory တစ်ခုမှာ `package.json` ပါဝင်တဲ့ file တစ်ခုကနေ `#` နဲ့ စတင်တဲ့ lookup တစ်ခု လုပ်တဲ့အခါ — [package.json file တွေရဲ့ `imports` field](https://nodejs.org/api/packages.html#imports) ကို တိုင်ပင်ဖို့ တွန်းအားပေးပါတယ်။

ဒီ option က `--moduleResolution` အတွက် `node16`, `nodenext` နဲ့ `bundler` option တွေအောက်မှာ default အနေနဲ့ `true` ဖြစ်ပါတယ်။

### `allowArbitraryExtensions`

TypeScript 5.0 မှာ — import path တစ်ခုက သိထားတဲ့ JavaScript ဒါမှမဟုတ် TypeScript file extension တစ်ခုမဟုတ်တဲ့ extension တစ်ခုနဲ့ အဆုံးသတ်နေရင် — compiler က အဲဒီ path အတွက် `{file basename}.d.{extension}.ts` ပုံစံရှိတဲ့ declaration file တစ်ခုကို ရှာပါလိမ့်မယ်။
ဥပမာ — bundler project တစ်ခုမှာ CSS loader တစ်ခု သုံးနေတယ်ဆိုရင် — အဲဒီ stylesheet တွေအတွက် declaration file တွေကို ရေးချင် (ဒါမှမဟုတ် generate) လုပ်ချင်နိုင်ပါတယ်:

```css
/* app.css */
.cookie-banner {
  display: none;
}
```

```ts
// app.d.css.ts
declare const css: {
  cookieBanner: string;
};
export default css;
```

```ts
// App.tsx
import styles from "./app.css";

styles.cookieBanner; // string
```

Default အနေနဲ့ကတော့ — ဒီ import က TypeScript က ဒီ file type ကို နားမလည်ဘူးဆိုတာ၊ သင့် runtime ကလည်း ဒါကို import လုပ်တာ ပံ့ပိုးချင်မှ ပံ့ပိုးမယ်ဆိုတာ အသိပေးဖို့ error တစ်ခု တက်စေပါတယ်။
ဒါပေမယ့် — သင့် runtime ဒါမှမဟုတ် bundler ကို အဲဒါကို ကိုင်တွယ်ဖို့ configure လုပ်ထားပြီးသားဆိုရင် — `--allowArbitraryExtensions` compiler option အသစ်နဲ့ အဲဒီ error ကို ဖိနှိပ်ထားနိုင်ပါတယ်။

သမိုင်းကြောင်းအရ — အလားတူ ရလဒ်မျိုးကို `app.d.css.ts` အစား `app.css.d.ts` လို့နာမည်ပေးထားတဲ့ declaration file တစ်ခု ထည့်ခြင်းအားဖြင့်လည်း မကြာခဏ ရနိုင်ခဲ့ပါတယ် — ဒါပေမယ့် ဒါက CommonJS အတွက် Node ရဲ့ `require` resolution စည်းမျဉ်းတွေကြောင့်သာ အလုပ်လုပ်ခဲ့တာပါ။
တိတိကျကျ ပြောရရင် — ရှေ့ဟာက `app.css.js` လို့နာမည်ရှိတဲ့ JavaScript file တစ်ခုအတွက် declaration file အဖြစ် အဓိပ္ပာယ်ကောက်ယူခံရပါတယ်။
Node ရဲ့ ESM ပံ့ပိုးမှုမှာ relative file imports တွေမှာ extension တွေ ပါဝင်ဖို့ လိုတာမို့ — `--moduleResolution node16` ဒါမှမဟုတ် `nodenext` အောက်က ESM file တစ်ခုမှာ — TypeScript က ကျွန်တော်တို့ ဥပမာပေါ်မှာ error တက်စေပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီ feature အတွက် proposal](https://github.com/microsoft/TypeScript/issues/50133) နဲ့ [သူ့ရဲ့ သက်ဆိုင်ရာ pull request](https://github.com/microsoft/TypeScript/pull/51435) ကို ဖတ်ကြည့်ပါ။

### `customConditions`

`--customConditions` က — TypeScript က `package.json` တစ်ခုရဲ့ [`exports`](https://nodejs.org/api/packages.html#exports) ဒါမှမဟုတ် [`imports`](https://nodejs.org/api/packages.html#imports) field ကနေ resolve လုပ်တဲ့အခါ အောင်မြင်သင့်တဲ့ — ထပ်ဆောင်း [conditions](https://nodejs.org/api/packages.html#nested-conditions) စာရင်းတစ်ခုကို ယူပါတယ်။
ဒီ conditions တွေက resolver တစ်ခုက default အနေနဲ့ သုံးမယ့် ရှိပြီးသား conditions တွေအပေါ်ကို ထပ်ပေါင်းထည့်လိုက်တာပါ။

ဥပမာ — ဒီ field ကို `tsconfig.json` တစ်ခုထဲမှာ ဒီလို သတ်မှတ်ထားတယ်ဆိုပါစို့:

```jsonc
{
    "compilerOptions": {
        "target": "es2022",
        "moduleResolution": "bundler",
        "customConditions": ["my-condition"]
    }
}
```

`package.json` တစ်ခုမှာ `exports` ဒါမှမဟုတ် `imports` field တစ်ခုကို ရည်ညွှန်းတိုင်း — TypeScript က `my-condition` လို့ခေါ်တဲ့ conditions တွေကို ထည့်သွင်း စဉ်းစားပါလိမ့်မယ်။

ဒါကြောင့် အောက်ပါ `package.json` ပါတဲ့ package တစ်ခုကနေ import လုပ်တဲ့အခါ

```jsonc
{
    // ...
    "exports": {
        ".": {
            "my-condition": "./foo.mjs",
            "node": "./bar.mjs",
            "import": "./baz.mjs",
            "require": "./biz.mjs"
        }
    }
}
```

TypeScript က `foo.mjs` နဲ့ ကိုက်ညီတဲ့ file တွေကို ရှာဖို့ ကြိုးစားပါလိမ့်မယ်။

ဒီ field က `--moduleResolution` အတွက် `node16`, `nodenext` နဲ့ `bundler` option တွေအောက်မှာသာ တရားဝင်ပါတယ်

## `--verbatimModuleSyntax`

Default အနေနဲ့ TypeScript က *import elision* လို့ခေါ်တဲ့ အရာတစ်ခုကို လုပ်ပါတယ်။
အခြေခံအားဖြင့် — သင်က ဒီလိုမျိုး ရေးလိုက်ရင်

```ts
import { Car } from "./car";

export function drive(car: Car) {
    // ...
}
```

TypeScript က import တစ်ခုကို type တွေအတွက်ပဲ သုံးနေတာကို သိရှိပြီး — အဲဒီ import ကို လုံးဝ ပစ်ချလိုက်ပါတယ်။
သင့်ရဲ့ output JavaScript က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```js
export function drive(car) {
    // ...
}
```

အများစုမှာ ဒါက ကောင်းပါတယ် — အကြောင်းကတော့ `Car` က `./car` ကနေ export လုပ်ထားတဲ့ value တစ်ခု မဟုတ်ဘူးဆိုရင် — runtime error တစ်ခု ရမှာမို့ပါ။

ဒါပေမယ့် ဒါက edge case တစ်ချို့အတွက် ရှုပ်ထွေးမှု အလွှာတစ်ခု ထပ်တိုးပေးပါတယ်။
ဥပမာ — `import "./car";` လိုမျိုး statement တစ်ခု မရှိတော့တာကို သတိပြုပါ — import ကို လုံးဝ ပစ်ချလိုက်လို့ပါ။
ဒါက side effect ရှိတဲ့ module တွေနဲ့ မရှိတဲ့ module တွေအတွက် တကယ်ပဲ ခြားနားချက် ဖြစ်စေပါတယ်။

JavaScript အတွက် TypeScript ရဲ့ emit strategy မှာလည်း ရှုပ်ထွေးမှု နောက်ထပ် အလွှာတစ်ချို့ ရှိပါသေးတယ် — import elision က import ကို ဘယ်လို သုံးလဲဆိုတာတစ်ခုတည်းနဲ့ပဲ မောင်းနှင်တာ မဟုတ်ဘဲ — value တစ်ခုကို ဘယ်လို ကြေညာထားလဲဆိုတာကိုပါ မကြာခဏ တိုင်ပင်ပါတယ်။
ဒါကြောင့် အောက်ပါလို code မျိုး

```ts
export { Car } from "./car";
```

ကို ထိန်းသိမ်းထားသင့်လား ပစ်ချသင့်လား ဆိုတာ အမြဲတမ်း ရှင်းရှင်းလင်းလင်း မသိနိုင်ပါဘူး။
`Car` ကို `class` တစ်ခုလိုမျိုးနဲ့ ကြေညာထားရင် — ရလဒ် JavaScript file ထဲမှာ ထိန်းသိမ်းထားနိုင်ပါတယ်။
ဒါပေမယ့် `Car` ကို `type` alias ဒါမှမဟုတ် `interface` အနေနဲ့ပဲ ကြေညာထားရင်တော့ — JavaScript file က `Car` ကို လုံးဝ export မလုပ်သင့်ပါဘူး။

TypeScript က ဒီ emit ဆုံးဖြတ်ချက်တွေကို file တွေအကြား ဖြန့်ကျက်ထားတဲ့ အချက်အလက်တွေအပေါ် အခြေခံပြီး လုပ်နိုင်ပေမယ့် — compiler တိုင်း မလုပ်နိုင်ပါဘူး။

import နဲ့ export တွေပေါ်က `type` modifier က ဒီအခြေအနေတွေကို နည်းနည်း ကူညီပေးပါတယ်။
`type` modifier ကို သုံးခြင်းအားဖြင့် — import တစ်ခု ဒါမှမဟုတ် export တစ်ခုက type analysis အတွက်ပဲ သုံးတာလား၊ JavaScript file တွေထဲမှာ လုံးဝ ပစ်ချလို့ရတာလားဆိုတာကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။

```ts
// This statement can be dropped entirely in JS output
import type * as car from "./car";

// The named import/export 'Car' can be dropped in JS output
import { type Car } from "./car";
export { type Car } from "./car";
```

`type` modifier တွေက သူ့ဘာသာသူတော့ သိပ်အသုံးမဝင်ပါဘူး — default အနေနဲ့ module elision က import တွေကို ဆက်ပြီး ပစ်ချနေဦးမှာမို့ — `type` နဲ့ သာမန် import/export တွေကြားက ခြားနားချက်ကို သုံးဖို့ ဘယ်အရာကမှ သင့်ကို အတင်းအကြပ် မလုပ်ပါဘူး။
ဒါကြောင့် TypeScript မှာ — `type` modifier ကို သေချာသုံးဖို့ `--importsNotUsedAsValues` flag၊ module elision အပြုအမူ *တစ်ချို့*ကို တားဆီးဖို့ `--preserveValueImports` flag၊ ပြီးတော့ သင့် TypeScript code က compiler အမျိုးမျိုးမှာ အလုပ်လုပ်ကြောင်း သေချာစေဖို့ `--isolatedModules` flag တွေ ရှိပါတယ်။
ကံမကောင်းစရာက — အဲဒီ flag ၃ ခုရဲ့ သေးငယ်တဲ့ အသေးစိတ်တွေကို နားလည်ဖို့ ခက်ခဲပြီး — မမျှော်လင့်ထားတဲ့ အပြုအမူတွေနဲ့ edge case တစ်ချို့ ဆက်ရှိနေပါသေးတယ်။

TypeScript 5.0 က အခြေအနေကို ရိုးရှင်းစေဖို့ `--verbatimModuleSyntax` လို့ခေါ်တဲ့ option အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။
စည်းမျဉ်းတွေက အများကြီး ပိုရိုးရှင်းပါတယ် — `type` modifier မပါတဲ့ import ဒါမှမဟုတ် export တွေကို နေရာမှာ ထားခဲ့ပြီး — `type` modifier သုံးထားတဲ့အရာတွေကို လုံးဝ ပစ်ချလိုက်ပါတယ်။

```ts
// Erased away entirely.
import type { A } from "a";

// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";

// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

ဒီ option အသစ်နဲ့ဆိုရင် — မြင်ရတဲ့အတိုင်းပဲ ရတာပါ (what you see is what you get)။

ဒါပေမယ့် module interop နဲ့ ပတ်သက်လာရင်တော့ သက်ရောက်မှုတစ်ချို့ ရှိပါတယ်။
ဒီ flag အောက်မှာ — သင့် setting တွေ ဒါမှမဟုတ် file extension က တခြား module system တစ်ခုကို ရည်ညွှန်းနေရင်တောင် — ECMAScript `import` နဲ့ `export` တွေကို `require` ခေါ်ဆိုမှုတွေအဖြစ် ပြန်ရေးပေးမှာ မဟုတ်ပါဘူး။
အဲဒီအစား error တစ်ခု ရပါလိမ့်မယ်။
`require` နဲ့ `module.exports` သုံးတဲ့ code ကို emit လုပ်ဖို့ လိုရင် — ES2015 မတိုင်ခင်က TypeScript ရဲ့ module syntax ကို သုံးရပါမယ်:

**Input TypeScript (TypeScript ထည့်သွင်းကုဒ်)**

```ts
import foo = require("foo");
```

**Output JavaScript (JavaScript ထွက်ရှိသည့်ကုဒ်)**

```js
const foo = require("foo");
```

**Input TypeScript (TypeScript ထည့်သွင်းကုဒ်)**

```ts
function foo() {}
function bar() {}
function baz() {}

export = {
    foo,
    bar,
    baz
};
```

**Output JavaScript (JavaScript ထွက်ရှိသည့်ကုဒ်)**

```js
function foo() {}
function bar() {}
function baz() {}

module.exports = {
    foo,
    bar,
    baz
};
```

ဒါက ကန့်သတ်ချက်တစ်ခု ဖြစ်ပေမယ့် — ပြဿနာတစ်ချို့ကို ပိုပြီး ထင်ရှားအောင် ကူညီပေးပါတယ်။
ဥပမာ — `--module node16` အောက်မှာ [package.json ထဲက `type` field](https://nodejs.org/api/packages.html#type) ကို သတ်မှတ်ဖို့ မေ့သွားတာက အလွန် အဖြစ်များပါတယ်။
ရလဒ်အနေနဲ့ — developer တွေက သတိမထားမိဘဲ ES modules အစား CommonJS modules တွေကို ရေးမိနေပြီး — အံ့အားသင့်စရာ lookup စည်းမျဉ်းတွေနဲ့ JavaScript output တွေ ဖြစ်လာတတ်ပါတယ်။
ဒီ flag အသစ်က syntax တွေ ရည်ရွယ်ချက်ရှိရှိ ကွဲပြားနေတာမို့ — သင်သုံးနေတဲ့ file type အကြောင်းကို သေချာ ရည်ရွယ်ချက်ရှိရှိ ရွေးချယ်မိစေဖို့ သေချာစေပါတယ်။

`--verbatimModuleSyntax` က `--importsNotUsedAsValues` နဲ့ `--preserveValueImports` ထက် ပိုပြီး တသမတ်တည်း ဖြစ်တဲ့ ဇာတ်လမ်းတစ်ခုကို ပေးစွမ်းနိုင်လို့ — အဲဒီ flag အဟောင်း နှစ်ခုကို ဒီဟာကို မျက်နှာသာပေးပြီး deprecate လုပ်နေပါတယ်။

အသေးစိတ်အတွက် — [မူရင်း pull request]https://github.com/microsoft/TypeScript/pull/52203 နဲ့ [သူ့ရဲ့ proposal issue](https://github.com/microsoft/TypeScript/issues/51479) မှာ ဖတ်ရှုနိုင်ပါတယ်။

## Support for `export type *` (`export type *` အတွက် ပံ့ပိုးမှု)

TypeScript 3.8 က type-only imports တွေကို မိတ်ဆက်တုန်းက — အဲဒီ syntax အသစ်ကို `export * from "module"` ဒါမှမဟုတ် `export * as ns from "module"` re-export တွေပေါ်မှာ ခွင့်မပြုခဲ့ပါဘူး။ TypeScript 5.0 က ဒီပုံစံ နှစ်မျိုးလုံးအတွက် ပံ့ပိုးမှု ထပ်ဖြည့်ပေးပါတယ်:

```ts
// models/vehicles.ts
export class Spaceship {
  // ...
}

// models/index.ts
export type * as vehicles from "./vehicles";

// main.ts
import { vehicles } from "./models";

function takeASpaceship(s: vehicles.Spaceship) {
  // ✅ ok - `vehicles` only used in a type position
}

function makeASpaceship() {
  return new vehicles.Spaceship();
  //         ^^^^^^^^
  // 'vehicles' cannot be used as a value because it was exported using 'export type'.
}
```

[ဒီနေရာမှာ အကောင်အထည်ဖော်မှုအကြောင်း ပိုပြီး ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/52217)။

## `@satisfies` Support in JSDoc (`@satisfies` ကို JSDoc တွင် ပံ့ပိုးခြင်း)

TypeScript 4.9 က `satisfies` operator ကို မိတ်ဆက်ပေးခဲ့ပါတယ်။
ဒါက expression တစ်ခုရဲ့ type ဟာ — type ကိုယ်တိုင်ကို မထိခိုက်ဘဲ — compatible ဖြစ်ကြောင်း သေချာစေပါတယ်။
ဥပမာ — အောက်ပါ code ကို ယူကြည့်ရအောင်:

```ts
interface CompilerOptions {
    strict?: boolean;
    outDir?: string;
    // ...
}

interface ConfigSettings {
    compilerOptions?: CompilerOptions;
    extends?: string | string[];
    // ...
}

let myConfigSettings = {
    compilerOptions: {
        strict: true,
        outDir: "../lib",
        // ...
    },

    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],

} satisfies ConfigSettings;
```

ဒီမှာ TypeScript က `myConfigSettings.extends` ကို array တစ်ခုနဲ့ ကြေညာထားတာကို သိပါတယ် — အကြောင်းကတော့ `satisfies` က ကျွန်တော်တို့ object ရဲ့ type ကို validate လုပ်ပေးခဲ့ပေမယ့် — အဲဒါကို `CompilerOptions` အဖြစ် တုံးတုံးကြီး ပြောင်းပစ်ပြီး အချက်အလက်တွေ ဆုံးရှုံးအောင် မလုပ်ခဲ့လို့ပါ။
ဒါကြောင့် `extends` ပေါ်မှာ map လုပ်ချင်ရင် — အဆင်ပြေပါတယ်။

```ts
declare function resolveConfig(configPath: string): CompilerOptions;

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

ဒါက TypeScript သုံးစွဲသူတွေအတွက် အသုံးဝင်ခဲ့ပေမယ့် — လူအများစုက JSDoc annotation တွေသုံးပြီး သူတို့ရဲ့ JavaScript code တွေကို type-check လုပ်ဖို့ TypeScript ကို သုံးကြပါတယ်။
ဒါကြောင့်မို့ TypeScript 5.0 က အတိအကျ တူညီတဲ့ အလုပ်ကို လုပ်ပေးတဲ့ `@satisfies` လို့ခေါ်တဲ့ JSDoc tag အသစ်တစ်ခုကို ပံ့ပိုးပေးနေတာပါ။

`/** @satisfies */` က type mismatch တွေကို ဖမ်းမိနိုင်ပါတယ်:

```js
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @satisfies {CompilerOptions}
 */
let myCompilerOptions = {
    outdir: "../lib",
//  ~~~~~~ oops! we meant outDir
};
```

ဒါပေမယ့် ဒါက ကျွန်တော်တို့ expression တွေရဲ့ မူရင်း type ကို ထိန်းသိမ်းထားမှာ ဖြစ်လို့ — နောက်ပိုင်း code တွေထဲမှာ ကျွန်တော်တို့ value တွေကို ပိုပြီး တိကျစွာ သုံးနိုင်ပါတယ်။

```js
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @typedef ConfigSettings
 * @prop {CompilerOptions} [compilerOptions]
 * @prop {string | string[]} [extends]
 */

/**
 * @satisfies {ConfigSettings}
 */
let myConfigSettings = {
    compilerOptions: {
        strict: true,
        outDir: "../lib",
    },
    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],
};

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

`/** @satisfies */` ကို parenthesized expression တစ်ခုခုပေါ်မှာ inline အနေနဲ့လည်း သုံးနိုင်ပါတယ်။
`myCompilerOptions` ကို ဒီလိုမျိုးလည်း ရေးနိုင်ခဲ့ပါတယ်:

```ts
let myConfigSettings = /** @satisfies {ConfigSettings} */ ({
    compilerOptions: {
        strict: true,
        outDir: "../lib",
    },
    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],
});
```

ဘာကြောင့်လဲ?
ကောင်းပြီ — တခြား code တစ်ချို့ရဲ့ အတွင်းထဲ — function call တစ်ခုလိုနေရာမျိုးမှာ နက်နက်ရှိုင်းရှိုင်း ရောက်နေတဲ့အခါ — ဒီလိုရေးတာက ပိုပြီး အဓိပ္ပာယ် ရှိပါတယ်။

```js
compileCode(/** @satisfies {CompilerOptions} */ ({
    // ...
}));
```

ဒီ [feature](https://github.com/microsoft/TypeScript/pull/51753) ကို [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်!
## `@overload` Support in JSDoc (`@overload` ကို JSDoc တွင် ပံ့ပိုးခြင်း)

TypeScript မှာ function တစ်ခုအတွက် overloads တွေကို သတ်မှတ်နိုင်ပါတယ်။
Overloads တွေက — function တစ်ခုကို argument အမျိုးမျိုးနဲ့ ခေါ်နိုင်ပြီး — ရလဒ်တွေ မတူညီတာတွေ ပြန်ပေးနိုင်တယ်ဆိုတာကို ဖော်ပြနိုင်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။
သူတို့က caller တွေ ကျွန်တော်တို့ function တွေကို တကယ်ဘယ်လို သုံးနိုင်လဲဆိုတာကို ကန့်သတ်နိုင်ပြီး — သူတို့ ပြန်ရမယ့် ရလဒ်တွေကိုလည်း သေချာစေနိုင်ပါတယ်။

```ts
// Our overloads:
function printValue(str: string): void;
function printValue(num: number, maxFractionDigits?: number): void;

// Our implementation:
function printValue(value: string | number, maximumFractionDigits?: number) {
    if (typeof value === "number") {
        const formatter = Intl.NumberFormat("en-US", {
            maximumFractionDigits,
        });
        value = formatter.format(value);
    }

    console.log(value);
}
```

ဒီမှာ `printValue` က သူ့ရဲ့ ပထမ argument အနေနဲ့ `string` ဒါမှမဟုတ် `number` နှစ်မျိုးလုံးကို ယူနိုင်တယ်လို့ ဆိုထားပါတယ်။
`number` ယူလိုက်ရင် — ဂဏန်းရဲ့ ဒသမကိန်း ဘယ်နှစ်နေရာအထိ print လုပ်မလဲဆိုတာကို သတ်မှတ်ဖို့ ဒုတိယ argument တစ်ခုကို ထပ်ယူနိုင်ပါတယ်။

TypeScript 5.0 က ယခုဆို JSDoc ထဲမှာ `@overload` tag အသစ်တစ်ခုနဲ့ overloads တွေကို ကြေညာခွင့် ပြုပါတယ်။
`@overload` tag ပါတဲ့ JSDoc comment တစ်ခုချင်းစီကို — နောက်ကလိုက်တဲ့ function declaration အတွက် သီးခြား overload တစ်ခုအနေနဲ့ သဘောထားပါတယ်။

```js
// @ts-check

/**
 * @overload
 * @param {string} value
 * @return {void}
 */

/**
 * @overload
 * @param {number} value
 * @param {number} [maximumFractionDigits]
 * @return {void}
 */

/**
 * @param {string | number} value
 * @param {number} [maximumFractionDigits]
 */
function printValue(value, maximumFractionDigits) {
    if (typeof value === "number") {
        const formatter = Intl.NumberFormat("en-US", {
            maximumFractionDigits,
        });
        value = formatter.format(value);
    }

    console.log(value);
}
```

အခုဆို TypeScript file မှာပဲ ရေးနေတာ ဒါမှမဟုတ် JavaScript file မှာပဲ ရေးနေတာပဲ ဖြစ်ဖြစ် — function တွေကို မှားယွင်းစွာ ခေါ်မိရင် TypeScript က အသိပေးနိုင်ပါပြီ။

```ts
// all allowed
printValue("hello!");
printValue(123.45);
printValue(123.45, 2);

printValue("hello!", 123); // error!
```

ဒီ tag အသစ်ကို [အကောင်အထည်ဖော်နိုင်ခဲ့တာ](https://github.com/microsoft/TypeScript/pull/51234) [Tomasz Lenarcik](https://github.com/apendua) ရဲ့ ကျေးဇူးကြောင့်ပါ။

## Passing Emit-Specific Flags Under `--build` (`--build` အောက်တွင် Emit-Specific Flag များ ပေးပို့ခြင်း)

TypeScript က ယခုဆို အောက်ပါ flag တွေကို `--build` mode အောက်မှာ ပေးပို့ခွင့် ပြုပါတယ်

* `--declaration`
* `--emitDeclarationOnly`
* `--declarationMap`
* `--sourceMap`
* `--inlineSourceMap`

ဒါက — development build နဲ့ production build တွေ မတူညီနိုင်တဲ့ build တစ်ခုရဲ့ အစိတ်အပိုင်းတစ်ချို့ကို စိတ်ကြိုက် ပြင်ဆင်တာကို အများကြီး ပိုလွယ်ကူစေပါတယ်။

ဥပမာ — library တစ်ခုရဲ့ development build က declaration file တွေ ထုတ်ဖို့ မလိုပေမယ့် — production build ကတော့ လိုနိုင်ပါတယ်။
Project တစ်ခုက declaration emit ကို default အနေနဲ့ ပိတ်ထားပြီး — ဒီလိုပဲ ရိုးရိုးရှင်းရှင်း build လုပ်နိုင်ပါတယ်

```sh
tsc --build -p ./my-project-dir
```

အတွင်းစက်ဝိုင်း (inner loop) ထဲမှာ ပြန်ပြန်လှန်လှန် လုပ်ပြီးသွားတာနဲ့ — "production" build က `--declaration` flag ကိုပဲ ထပ်ပေးလိုက်ရပါတယ်။

```sh
tsc --build -p ./my-project-dir --declaration
```

[ဒီပြောင်းလဲမှုအကြောင်း နောက်ထပ် အချက်အလက်တွေကို ဒီမှာ ရနိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/51241)။

## Case-Insensitive Import Sorting in Editors (Editor များတွင် Case-Insensitive Import စီစဉ်ခြင်း)

Visual Studio နဲ့ VS Code လို editor တွေမှာ — import နဲ့ export တွေကို စုစည်း (organize) တာ၊ စီစဉ် (sort) တာတွေရဲ့ အတွေ့အကြုံကို TypeScript က ပံ့ပိုးပေးပါတယ်။
ဒါပေမယ့် — list တစ်ခုက "စီပြီးသား" လားဆိုတာနဲ့ ပတ်သက်ပြီး — အဓိပ္ပာယ် ကောက်ယူမှု အမျိုးမျိုး ရှိနိုင်တတ်ပါတယ်။

ဥပမာ — အောက်ပါ import list က စီပြီးသားလား?

```ts
import {
    Toggle,
    freeze,
    toBoolean,
} from "./utils";
```

အဖြေက အံ့အားသင့်စရာလည်း ဖြစ်နိုင်ပါတယ် — "အခြေအနေပေါ် မူတည်ပါတယ်"။
Case-sensitivity ကို ဂရုမစိုက်ဘူးဆိုရင် — ဒီ list က ရှင်းရှင်းလင်းလင်း စီထားတာ မဟုတ်ပါဘူး။
`f` အက္ခရာက `t` ရော `T` ရောရဲ့ ရှေ့မှာ ရောက်နေလို့ပါ။

ဒါပေမယ့် programming language အများစုမှာ — sorting က string တွေရဲ့ byte value တွေကို နှိုင်းယှဉ်တာကို default အနေနဲ့ လုပ်ပါတယ်။
JavaScript က string တွေကို နှိုင်းယှဉ်တဲ့ နည်းလမ်းအရ — [ASCII character encoding](https://en.wikipedia.org/wiki/ASCII) အရ စာလုံးကြီးတွေက စာလုံးသေးတွေရဲ့ ရှေ့မှာ လာတာမို့ — `"Toggle"` က `"freeze"` ရဲ့ ရှေ့မှာ အမြဲ ရောက်နေပါတယ်။
ဒါကြောင့် အဲဒီရှုထောင့်ကကြည့်ရင် — ဒီ import list က စီပြီးသားပါ။

TypeScript က အရင်က — basic case-sensitive sort တစ်ခုကို လုပ်နေတာမို့ — import list ကို စီပြီးသားလို့ သတ်မှတ်ခဲ့ပါတယ်။
ဒါက case-*insensitive* (စာလုံးအကြီး/အသေး ခွဲခြားမှုမရှိတဲ့) စီစဉ်မှုကို နှစ်သက်တဲ့ developer တွေ၊ ဒါမှမဟုတ် default အနေနဲ့ case-insensitive ordering လိုအပ်တဲ့ ESLint လိုမျိုး tool တွေကို သုံးနေသူတွေအတွက် စိတ်ပျက်စရာ အချက်တစ်ခု ဖြစ်နိုင်ပါတယ်။

TypeScript က ယခုဆို case sensitivity ကို default အနေနဲ့ ရှာဖွေ (detect) ပါတယ်။
ဆိုလိုတာက — TypeScript နဲ့ ESLint လို tool တွေက import တွေကို ဘယ်လို အကောင်းဆုံး စီမလဲဆိုတာနဲ့ ပတ်သက်ပြီး — များသောအားဖြင့် အချင်းချင်း "တိုက်ခိုက်နေ" စရာ မလိုတော့ပါဘူး။

ကျွန်တော်တို့ အဖွဲ့ကလည်း [နောက်ထပ် sorting strategy တွေနဲ့ စမ်းသပ်နေဆဲ ဖြစ်ပြီး — ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/52115)။
ဒီ option တွေက နောက်ဆုံးမှာတော့ editor တွေကနေ configure လုပ်နိုင်လာပါလိမ့်မယ်။
လောလောဆယ်တော့ — သူတို့က မတည်ငြိမ်သေးတဲ့ (unstable) experimental option တွေဖြစ်ပြီး — ဒီနေ့ ထဲက VS Code မှာ သင့် JSON options ထဲက `typescript.unstable` entry ကို သုံးပြီး opt-in လုပ်နိုင်ပါတယ်။
အောက်မှာ စမ်းကြည့်လို့ရတဲ့ option တွေ အားလုံးပါ (သူတို့ရဲ့ default တန်ဖိုးတွေနဲ့):

```jsonc
{
    "typescript.unstable": {
        // Should sorting be case-sensitive? Can be:
        // - true
        // - false
        // - "auto" (auto-detect)
        "organizeImportsIgnoreCase": "auto",

        // Should sorting be "ordinal" and use code points or consider Unicode rules? Can be:
        // - "ordinal"
        // - "unicode"
        "organizeImportsCollation": "ordinal",

        // Under `"organizeImportsCollation": "unicode"`,
        // what is the current locale? Can be:
        // - [any other locale code]
        // - "auto" (use the editor's locale)
        "organizeImportsLocale": "en",

        // Under `"organizeImportsCollation": "unicode"`,
        // should upper-case letters or lower-case letters come first? Can be:
        // - false (locale-specific)
        // - "upper"
        // - "lower"
        "organizeImportsCaseFirst": false,

        // Under `"organizeImportsCollation": "unicode"`,
        // do runs of numbers get compared numerically (i.e. "a1" < "a2" < "a100")? Can be:
        // - true
        // - false
        "organizeImportsNumericCollation": true,

        // Under `"organizeImportsCollation": "unicode"`,
        // do letters with accent marks/diacritics get sorted distinctly
        // from their "base" letter (i.e. is é different from e)? Can be
        // - true
        // - false
        "organizeImportsAccentCollation": true
    },
    "javascript.unstable": {
        // same options valid here...
    },
}
```

အသေးစိတ်ကို [case-insensitivity ကို auto-detect လုပ်ပြီး သတ်မှတ်ခြင်းဆိုင်ရာ မူရင်းအလုပ်](https://github.com/microsoft/TypeScript/pull/51733) မှာ ဖတ်နိုင်ပြီး — နောက်မှာ [ပိုကျယ်ပြန့်တဲ့ option အစုအဝေး](https://github.com/microsoft/TypeScript/pull/52115) လည်း ရှိပါသေးတယ်။

## Exhaustive `switch`/`case` Completions (switch/case အားလုံးကို ဖုံးအုပ်ပေးသော Completion များ)

`switch` statement တစ်ခု ရေးတဲ့အခါ — TypeScript က စစ်ဆေးနေတဲ့ value မှာ literal type တစ်ခု ရှိမရှိကို ယခုဆို detect လုပ်ပါတယ်။
ရှိတယ်ဆိုရင် — မဖုံးလွှမ်းရသေးတဲ့ `case` တစ်ခုချင်းစီကို scaffold (အရိုးစု) လုပ်ပေးမယ့် completion တစ်ခုကို ကမ်းလှမ်းပါလိမ့်မယ်။

![literal type တွေအပေါ် အခြေခံပြီး auto-completion ကနေ ထုတ်ပေးလိုက်တဲ့ `case` statement အစုတစ်စု။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/01/switchCaseSnippets-5-0_1.gif)

[အကောင်အထည်ဖော်မှုရဲ့ အသေးစိတ်ကို GitHub ပေါ်မှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50996)။

## Speed, Memory, and Package Size Optimizations (Speed, Memory နှင့် Package Size Optimization များ)

TypeScript 5.0 မှာ — ကျွန်တော်တို့ရဲ့ code တည်ဆောက်ပုံ၊ data structure တွေနဲ့ algorithm အကောင်အထည်ဖော်မှုတွေတစ်လျှောက် — အစွမ်းထက်တဲ့ ပြောင်းလဲမှုတွေ အများကြီး ပါဝင်ပါတယ်။
ဒါတွေအားလုံးရဲ့ အဓိပ္ပာယ်က — သင့်ရဲ့ အတွေ့အကြုံတစ်ခုလုံး ပိုမြန်သင့်တယ်ဆိုတာပါ — TypeScript run လုပ်တာတင်မက — install လုပ်တာတောင် ပါပါတယ်။

TypeScript 4.9 နဲ့ နှိုင်းယှဉ်ရင် speed နဲ့ size မှာ ကျွန်တော်တို့ ရယူနိုင်ခဲ့တဲ့ စိတ်ဝင်စားစရာ ကောင်းတဲ့ ရလဒ်တစ်ချို့ကို ဒီမှာ ဖော်ပြထားပါတယ်။

Scenario | TS 4.9 နှင့် နှိုင်းယှဉ်လျှင် အချိန် သို့မဟုတ် အရွယ်အစား
---------|--------------------
material-ui build လုပ်ချိန် | 89%
TypeScript Compiler စတင်ချိန် | 89%
Playwright build လုပ်ချိန် | 88%
TypeScript Compiler ကိုယ်တိုင် build လုပ်ချိန် | 87%
Outlook Web build လုပ်ချိန် | 82%
VS Code build လုပ်ချိန် | 80%
typescript npm Package အရွယ်အစား | 59%

![TypeScript 5.0 ရဲ့ build/run အချိန်တွေနဲ့ package size ကို TypeScript 4.9 နဲ့ နှိုင်းယှဉ်ထားတဲ့ ဇယား: material-ui docs build time: 89%; Playwright build time: 88%; tsc startup time: 87%; tsc build time: 87%; Outlook Web build time: 82%; VS Code build time: 80%; typescript Package Size: 59%](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/03/speed-and-size-5-0-rc.png?1)

ဘယ်လိုလဲ?
နောက်ထပ် အသေးစိတ် ဖော်ပြချင်စရာ ထင်ရှားတဲ့ တိုးတက်မှုတစ်ချို့ ရှိပါတယ်။
ဒါပေမယ့် အဲဒီ blog post အတွက်တော့ သင့်ကို စောင့်ခိုင်းမှာ မဟုတ်ပါဘူး။

ပထမဆုံး — TypeScript ကို namespaces ကနေ modules အဖြစ် မကြာသေးမီက ပြောင်းရွှေ့ခဲ့ပြီး — scope hoisting လိုမျိုး optimization တွေ လုပ်နိုင်တဲ့ ခေတ်မီ build tooling တွေကို အသုံးချနိုင်ခဲ့ပါတယ်။
ဒီ tooling တွေကို သုံးတာ၊ packaging strategy ကို ပြန်လည်သုံးသပ်တာ၊ deprecated code တစ်ချို့ ဖယ်ရှားတာတွေက TypeScript 4.9 ရဲ့ 63.8 MB package size ကနေ 26.4 MB လောက် လျှော့ချနိုင်ခဲ့ပါတယ်။
ဒါက direct function calls တွေကနေတစ်ဆင့် သိသာတဲ့ မြန်ဆန်မှုကိုလည်း ယူဆောင်ပေးခဲ့ပါတယ်။

TypeScript က compiler အတွင်းပိုင်း object type တွေကိုလည်း ပိုပြီး တပုံစံတည်း (uniform) ဖြစ်အောင် လုပ်ခဲ့ပြီး — အဲဒီ object type တစ်ချို့ပေါ်မှာ သိမ်းထားတဲ့ data တွေကိုလည်း ပါးအောင် (slim) လုပ်ခဲ့ပါတယ်။
ဒါက polymorphic နဲ့ megamorphic use site တွေကို လျှော့ချပေးခဲ့ပြီး — uniform shapes တွေအတွက် လိုအပ်တဲ့ memory သုံးစွဲမှု အများစုကိုလည်း ထေမိစေခဲ့ပါတယ်။

အချက်အလက်တွေကို string တွေအဖြစ် serialize လုပ်တဲ့အခါ caching တစ်ချို့ကိုလည်း လုပ်ဆောင်ခဲ့ပါတယ်။
error reporting, declaration emit, code completions စတာတွေရဲ့ အစိတ်အပိုင်းအဖြစ် ဖြစ်ပေါ်နိုင်တဲ့ Type display က အတော်လေး စရိတ်ကြီးတတ်ပါတယ်။
TypeScript က အခုဆို မကြာခဏ သုံးတတ်တဲ့ ယန္တရားတစ်ချို့ကို — ဒီ operation တွေအနှံ့ ပြန်လည်အသုံးပြုဖို့ — cache လုပ်ထားပါတယ်။

parser ကို ပိုကောင်းအောင် လုပ်ပေးခဲ့တဲ့ နောက်ထပ် ထင်ရှားတဲ့ ပြောင်းလဲမှုတစ်ခုက — closures တွေအနှံ့မှာ `let` နဲ့ `const` သုံးခြင်းရဲ့ စရိတ်ကို ရံဖန်ရံခါ ရှောင်ကွင်းဖို့ `var` ကို အသုံးချတာပါ။
ဒါက ကျွန်တော်တို့ရဲ့ parsing performance တစ်ချို့ကို ပိုကောင်းစေခဲ့ပါတယ်။

ခြုံငုံကြည့်ရင် — codebase အများစုက TypeScript 5.0 ကနေ speed တိုးတက်မှုတွေ မြင်ရမယ်လို့ မျှော်လင့်ထားပြီး — 10% ကနေ 20% ကြားက အကျိုးအမြတ်တွေကို တသမတ်တည်း ပြန်ထုတ်နိုင်ခဲ့ပါတယ်။
ဒါက hardware နဲ့ codebase ရဲ့ လက္ခဏာတွေပေါ် မူတည်မှာ သေချာပေမယ့် — ဒီနေ့ပဲ သင့် codebase ပေါ်မှာ စမ်းကြည့်ဖို့ တိုက်တွန်းချင်ပါတယ်!

နောက်ထပ် အချက်အလက်အတွက် — ကျွန်တော်တို့ရဲ့ ထင်ရှားတဲ့ optimization အချို့ကို ကြည့်ပါ:

* [Modules အဖြစ် ပြောင်းရွှေ့ခြင်း](https://github.com/microsoft/TypeScript/pull/51387)
* [`Node` ကို Monomorphization ပြုလုပ်ခြင်း](https://github.com/microsoft/TypeScript/pull/51682)
* [`Symbol` ကို Monomorphization ပြုလုပ်ခြင်း](https://github.com/microsoft/TypeScript/pull/51880)
* [`Identifier` ၏ Size လျှော့ချခြင်း](https://github.com/microsoft/TypeScript/pull/52170)
* [`Printer` Caching ပြုလုပ်ခြင်း](https://github.com/microsoft/TypeScript/pull/52382)
* [`var` အသုံးပြုမှု ကန့်သတ်ခြင်း](https://github.com/microsoft/TypeScript/issues/52924)
## Breaking Changes and Deprecations (Breaking Changes နှင့် Deprecation များ)

### Runtime Requirements (Runtime လိုအပ်ချက်များ)

TypeScript က ယခုဆို ECMAScript 2018 ကို target ထားပါတယ်။
Node သုံးစွဲသူတွေအတွက်ဆိုရင် — ဆိုလိုတာက အနည်းဆုံး Node.js 10 နဲ့ ၎င်းနောက်ပိုင်း ဗားရှင်း လိုအပ်ချက် ရှိပါတယ်။

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် type တွေကို ထုတ်လုပ်တဲ့ နည်းလမ်းတွေ ပြောင်းလဲမှုက ရှိပြီးသား code တွေအပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။
အထူးသဖြင့် — property တစ်ချို့ကို `number` ကနေ numeric literal types အဖြစ် ပြောင်းလဲခဲ့ပြီး — cut, copy, paste event handling အတွက် property နဲ့ method တွေကို interface တွေကြား ရွှေ့ပြောင်းခဲ့ပါတယ်။

### API Breaking Changes (API Breaking Changes)

TypeScript 5.0 မှာ — modules အဖြစ် ပြောင်းရွှေ့ခဲ့တာ၊ မလိုအပ်တဲ့ interface တစ်ချို့ ဖယ်ရှားခဲ့တာ၊ correctness တိုးတက်မှုတစ်ချို့ ပြုလုပ်ခဲ့တာတွေ ရှိပါတယ်။
ဘာတွေ ပြောင်းလဲသွားလဲဆိုတာ အသေးစိတ်အတွက် — ကျွန်တော်တို့ရဲ့ [API Breaking Changes](https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes) စာမျက်နှာကို ကြည့်ပါ။

### Forbidden Implicit Coercions in Relational Operators (Relational Operator များတွင် Implicit Coercion တားမြစ်ခြင်း)

TypeScript မှာ operation တစ်ချို့ကတော့ — implicit string-to-number coercion ဖြစ်စေနိုင်တဲ့ code ရေးရင် သင့်ကို သတိပေးပြီးသား ဖြစ်ပါတယ်:

```ts
function func(ns: number | string) {
  return ns * 4; // Error, possible implicit coercion
}
```

5.0 မှာတော့ ဒါကို relational operator တွေဖြစ်တဲ့ `>`, `<`, `<=`, နဲ့ `>=` တွေအပေါ်ကိုပါ သက်ရောက်စေပါတယ်:

```ts
function func(ns: number | string) {
  return ns > 4; // Now also an error
}
```

အလိုရှိရင် ဒါကို ခွင့်ပြုဖို့ — operand ကို `+` သုံးပြီး `number` အဖြစ် ရှင်းရှင်းလင်းလင်း (explicitly) coerce လုပ်နိုင်ပါတယ်:

```ts
function func(ns: number | string) {
  return +ns > 4; // OK
}
```

ဒီ [correctness တိုးတက်မှု](https://github.com/microsoft/TypeScript/pull/52048) ကို [Mateusz Burzyński](https://github.com/Andarist) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်။

### Enum Overhaul (Enum ပြန်လည်ပြင်ဆင်မှု)

TypeScript မှာ ပထမဆုံး release ကတည်းက — `enum` တွေနဲ့ ပတ်သက်ပြီး ကြာရှည်စွာ တည်ရှိခဲ့တဲ့ ထူးဆန်းချက်တွေ (oddities) ရှိခဲ့ပါတယ်။
5.0 မှာ — ဒီပြဿနာတွေထဲက တစ်ချို့ကို ရှင်းလင်းနေတာအပြင် — သင်ကြေညာနိုင်တဲ့ `enum` အမျိုးမျိုးကို နားလည်ဖို့ လိုအပ်တဲ့ concept အရေအတွက်ကိုလည်း လျှော့ချပေးနေပါတယ်။

ဒီအစီအစဉ်ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ သင်တွေ့နိုင်တဲ့ error အသစ် အဓိက နှစ်ခု ရှိပါတယ်။
ပထမတစ်ခုက — out-of-domain (သတ်မှတ်ထားတဲ့ အကွာအပြင်ဘက်က) literal တစ်ခုကို `enum` type တစ်ခုဆီ assign လုပ်ရင် — လူတိုင်း မျှော်လင့်ထားသလိုပဲ — error တက်လာပါတော့မယ်:

```ts
enum SomeEvenDigit {
    Zero = 0,
    Two = 2,
    Four = 4
}

// Now correctly an error
let m: SomeEvenDigit = 1;
```

နောက်တစ်ခုက — သွယ်ဝိုက်ပြီး string/number ရောထွေးနေတဲ့ `enum` ပုံစံတစ်ချို့ကို ကြေညာတာက — မှားယွင်းစွာ number-သက်သက် `enum` တစ်ခုကို ဖန်တီးမိခဲ့တာမျိုးပါ:

```ts
enum Letters {
    A = "a"
}
enum Numbers {
    one = 1,
    two = Letters.A
}

// Now correctly an error
const t: number = Numbers.two;
```

[သက်ဆိုင်ရာ ပြောင်းလဲမှုမှာ အသေးစိတ် နောက်ထပ် ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50528)။

### More Accurate Type-Checking for Parameter Decorators in Constructors Under `--experimentalDecorators` (`--experimentalDecorators` အောက်တွင် Constructor Parameter Decorator များအတွက် Type-Checking ပိုမိုတိကျလာခြင်း)

TypeScript 5.0 က `--experimentalDecorators` အောက်မှာ decorator တွေအတွက် type-checking ကို ပိုပြီး တိကျစေပါတယ်။
ဒါကို ထင်ရှားစွာ မြင်ရတဲ့ နေရာတစ်ခုက — constructor parameter တစ်ခုပေါ်မှာ decorator တစ်ခု သုံးတဲ့အခါပါ။

```ts
export declare const inject:
  (entity: any) =>
    (target: object, key: string | symbol, index?: number) => void;

export class Foo {}

export class C {
    constructor(@inject(Foo) private x: any) {
    }
}
```

ဒီ call က မအောင်မြင်ပါဘူး — အကြောင်းကတော့ `key` က `string | symbol` ကို မျှော်လင့်ထားပေမယ့် — constructor parameter တွေက `undefined` တန်ဖိုးရှိတဲ့ key တစ်ခုကို လက်ခံရရှိလို့ပါ။
မှန်ကန်တဲ့ ပြင်ဆင်မှုက `inject` ထဲက `key` ရဲ့ type ကို ပြောင်းလဲဖို့ပါ။
အဆင့်မြှင့်တင်လို့ မရတဲ့ library တစ်ခုကို သုံးနေတယ်ဆိုရင် သင့်တင့်လျောက်ပတ်တဲ့ နည်းလမ်းတစ်ခုက — `inject` ကို ပိုပြီး type-safe ဖြစ်တဲ့ decorator function တစ်ခုထဲမှာ ထုပ်ပိုးပြီး — `key` ပေါ်မှာ type-assertion တစ်ခု သုံးတာပါ။

အသေးစိတ်အတွက် — [ဒီ issue ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/52435)။

### Deprecations and Default Changes (Deprecation များနှင့် Default ပြောင်းလဲမှုများ)

TypeScript 5.0 မှာ အောက်ပါ setting တွေနဲ့ setting value တွေကို deprecate လုပ်ထားပါတယ်:

* `--target: ES3`
* `--out`
* `--noImplicitUseStrict`
* `--keyofStringsOnly`
* `--suppressExcessPropertyErrors`
* `--suppressImplicitAnyIndexErrors`
* `--noStrictGenericChecks`
* `--charset`
* `--importsNotUsedAsValues`
* `--preserveValueImports`
* project references တွေထဲက `prepend`

ဒီ configuration တွေက TypeScript 5.5 အထိတော့ ဆက်လက် ခွင့်ပြုထားပြီး — အဲဒီအချိန်ကျရင် လုံးဝ ဖယ်ရှားသွားမှာပါ — ဒါပေမယ့် — ဒီ setting တွေကို သုံးနေရင် warning တစ်ခု ရပါလိမ့်မယ်။
TypeScript 5.0 မှာ — နောက်ပြီး နောင်ထွက်မယ့် 5.1, 5.2, 5.3, 5.4 တွေမှာပါ — အဲဒီ warning တွေကို တိတ်ဆိတ်စေဖို့ `"ignoreDeprecations": "5.0"` လို့ သတ်မှတ်နိုင်ပါတယ်။
ပိုချောမွေ့တဲ့ အဆင့်မြှင့်တင်မှုတွေ ဖြစ်စေဖို့ — `ignoreDeprecations` သတ်မှတ်ခွင့်ပြုတဲ့ 4.9 patch တစ်ခုကိုလည်း မကြာခင် ထုတ်ပေးပါဦးမယ်။
Deprecation တွေအပြင် — TypeScript မှာ cross-platform အပြုအမူ ပိုကောင်းစေဖို့ setting တစ်ချို့ကိုလည်း ပြောင်းလဲထားပါတယ်။

JavaScript file တွေထဲမှာ emit လုပ်တဲ့ line ending တွေကို ထိန်းချုပ်ပေးတဲ့ `--newLine` က — အရင်က သတ်မှတ်မထားရင် လက်ရှိ operating system ပေါ် အခြေခံပြီး infer လုပ်ခဲ့ပါတယ်။
Build တွေက တတ်နိုင်သမျှ deterministic ဖြစ်သင့်တယ်လို့ ကျွန်တော်တို့ ထင်ပါတယ် — ပြီးတော့ Windows Notepad ကလည်း line-feed line endings တွေကို အခုဆို ပံ့ပိုးပါပြီ — ဒါကြောင့် default setting အသစ်က `LF` ဖြစ်ပါတယ်။
OS အလိုက် infer လုပ်တဲ့ အပြုအမူဟောင်းကတော့ မရှိတော့ပါဘူး။

project တစ်ခုထဲမှာ file name တစ်ခုတည်းရဲ့ ရည်ညွှန်းမှုအားလုံး casing တူညီကြောင်း သေချာစေတဲ့ `--forceConsistentCasingInFileNames` က — ယခုဆို default အနေနဲ့ `true` ဖြစ်ပါတယ်။
ဒါက case-insensitive file system တွေပေါ်မှာ ရေးထားတဲ့ code တွေမှာ ဖြစ်နိုင်တဲ့ casing ကွဲပြားမှု ပြဿနာတွေကို ဖမ်းမိဖို့ ကူညီပေးနိုင်ပါတယ်။

[5.0 deprecation တွေအတွက် tracking issue](https://github.com/microsoft/TypeScript/issues/51909) ပေါ်မှာ feedback ပေးနိုင်ပြီး — အချက်အလက် ပိုကြည့်နိုင်ပါတယ်
