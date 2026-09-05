---
title: "TypeScript 4.9 (TypeScript 4.9 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.9 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — `satisfies` operator, `in` operator နဲ့ property narrowing, class တွေထဲက auto-accessors, `NaN` equality စစ်ဆေးမှု, file-watching အသစ်, editor import command တွေ, performance တိုးတက်မှုတွေနဲ့ breaking changes အကြောင်း"
order: 89
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html"
status: translated
updated: 2026-09-05
---

## The `satisfies` Operator (satisfies Operator အကြောင်း)

TypeScript developer တွေ မကြာခဏ ရင်ဆိုင်ရတဲ့ အခြေအနေတစ်ခု ရှိပါတယ် — expression တစ်ခုဟာ type တစ်ခုနဲ့ *ကိုက်ညီ (match)* ကြောင်း သေချာစေချင်ပေမယ့် — inference အတွက် အဲဒီ expression ရဲ့ *အတိကျဆုံး (most specific)* type ကိုလည်း ထိန်းထားချင်ပါတယ်။

ဥပမာ:

```ts
// Each property can be a string or an RGB tuple.
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ^^^^ sacrebleu - we've made a typo!
};

// We want to be able to use string methods on 'green'...
const greenNormalized = palette.green.toUpperCase();
```

ဒီမှာ `bleu` လို့ ရေးထားတာကို သတိထားမိပါလိမ့်မယ် — တကယ်တော့ `blue` လို့ ရေးသင့်တာပါ။
`palette` ပေါ်မှာ type annotation သုံးပြီး အဲဒီ `bleu` အမှားကို ဖမ်းမိအောင် ကြိုးစားလို့ ရနိုင်ပေမယ့် — property တစ်ခုချင်းစီရဲ့ အချက်အလက်တွေကို ဆုံးရှုံးသွားစေပါတယ်။

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette: Record<Colors, string | RGB> = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ The typo is now correctly detected
};

// But we now have an undesirable error here - 'palette.green' "could" be of type RGB and
// property 'toUpperCase' does not exist on type 'string | RGB'.
const greenNormalized = palette.green.toUpperCase();
```

`satisfies` operator အသစ်က expression တစ်ခုရဲ့ type ဟာ type တစ်ခုနဲ့ ကိုက်ညီမှု ရှိမရှိ — အဲဒီ expression ရဲ့ ရလဒ် type ကို မပြောင်းလဲဘဲ — validate လုပ်နိုင်စေပါတယ်။
ဥပမာအနေနဲ့ — `palette` ရဲ့ property အားလုံးက `string | number[]` နဲ့ compatible ဖြစ်မဖြစ် စစ်ဆေးဖို့ `satisfies` ကို သုံးနိုင်ပါတယ်:

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ The typo is now caught!
} satisfies Record<Colors, string | RGB>;

// toUpperCase() method is still accessible!
const greenNormalized = palette.green.toUpperCase();
```

`satisfies` က ဖြစ်နိုင်ခြေရှိတဲ့ error တွေ အများကြီးကို ဖမ်းမိဖို့ သုံးနိုင်ပါတယ်။
ဥပမာ — object တစ်ခုမှာ type တစ်ခုရဲ့ key *အားလုံး* ပါဝင်ပြီး — အဲဒါတွေထက် ပိုတဲ့ key တွေ မပါအောင် သေချာစေနိုင်ပါတယ်:

```ts
type Colors = "red" | "green" | "blue";

// Ensure that we have exactly the keys from 'Colors'.
const favoriteColors = {
    "red": "yes",
    "green": false,
    "blue": "kinda",
    "platypus": false
//  ~~~~~~~~~~ error - "platypus" was never listed in 'Colors'.
} satisfies Record<Colors, unknown>;

// All the information about the 'red', 'green', and 'blue' properties are retained.
const g: boolean = favoriteColors.green;
```

တစ်ခါတလေ property name တွေ တစ်နည်းနည်းနဲ့ ကိုက်ညီမှု ရှိမရှိထက် — property တစ်ခုချင်းစီရဲ့ type တွေကိုပဲ ဂရုစိုက်ချင်တာမျိုး ရှိနိုင်ပါတယ်။
အဲဒီအခြေအနေမှာလည်း — object တစ်ခုရဲ့ property value အားလုံးက type တစ်ခုနဲ့ ကိုက်ညီကြောင်း သေချာစေနိုင်ပါတယ်။

```ts
type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0]
    //    ~~~~~~ error!
} satisfies Record<string, string | RGB>;

// Information about each property is still maintained.
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

နောက်ထပ် ဥပမာတွေအတွက် — ဒီ feature ကို အဆိုပြုထားတဲ့ [issue](https://github.com/microsoft/TypeScript/issues/47920) နဲ့ [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/46827) ကို ကြည့်နိုင်ပါတယ်။
ဒီ feature ကို ကျွန်တော်တို့နဲ့အတူ အကောင်အထည်ဖော်ပြီး ထပ်ခါထပ်ခါ မြှင့်တင်ပေးခဲ့တဲ့ [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျေးဇူးတင်ပါတယ်။

## Unlisted Property Narrowing with the `in` Operator (in Operator ဖြင့် Property စာရင်းမသွင်းထားသော Type များကို Narrowing ပြုလုပ်ခြင်း)

developer တွေအနေနဲ့ runtime မှာ အပြည့်အဝ မသိနိုင်သေးတဲ့ value တွေကို မကြာခဏ ကိုင်တွယ်ရပါတယ်။
တကယ်တော့ — server ကနေ response ရလာတာပဲ ဖြစ်ဖြစ် — configuration file တစ်ခုကို ဖတ်နေတာပဲ ဖြစ်ဖြစ် — property တွေ ရှိမရှိကို မကြာခဏ မသိနိုင်ပါဘူး။
JavaScript ရဲ့ `in` operator က object တစ်ခုပေါ်မှာ property တစ်ခု ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်။

အရင်က TypeScript က — property တစ်ခုကို ရှင်းရှင်းလင်းလင်း စာရင်းမသွင်းထားတဲ့ type တွေကို narrow လုပ်ပစ်နိုင်ခဲ့ပါတယ်။

```ts
interface RGB {
    red: number;
    green: number;
    blue: number;
}

interface HSV {
    hue: number;
    saturation: number;
    value: number;
}

function setColor(color: RGB | HSV) {
    if ("hue" in color) {
        // 'color' now has the type HSV
    }
    // ...
}
```

ဒီမှာ `RGB` type က `hue` ကို စာရင်းမသွင်းထားတာမို့ narrow လုပ်ခံလိုက်ရပြီး — `HSV` type ကိုပဲ ကျန်ခဲ့ပါတယ်။

ဒါပေမယ့် — type တစ်ခုမှ ပေးထားတဲ့ property ကို စာရင်းမသွင်းထားတဲ့ ဥပမာတွေကျရော?
အဲဒီလို အခြေအနေမျိုးမှာ — ဘာသာစကားက သိပ်အကူအညီ မပေးနိုင်ခဲ့ပါဘူး။
JavaScript မှာ အောက်ပါ ဥပမာကို ကြည့်ကြည့်ရအောင်:

```js
function tryGetPackageName(context) {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            return packageJSON.name;
        }
    }

    return undefined;
}
```

ဒါကို canonical TypeScript အဖြစ် ပြန်ရေးဖို့ဆိုတာ — `context` အတွက် type တစ်ခု သတ်မှတ်ပြီး သုံးရုံပါပဲ။
ဒါပေမယ့် — `packageJSON` property အတွက် `unknown` လိုမျိုး safe type တစ်ခု ရွေးမိရင် — TypeScript ဗားရှင်းအဟောင်းတွေမှာ ပြဿနာ တက်စေနိုင်ပါတယ်။

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context) {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
        //                                              ~~~~
        // error! Property 'name' does not exist on type 'object.
            return packageJSON.name;
        //                     ~~~~
        // error! Property 'name' does not exist on type 'object.
        }
    }

    return undefined;
}
```

အကြောင်းကတော့ — `packageJSON` ရဲ့ type က `unknown` ကနေ `object` ဆီ narrow လုပ်ခံရပေမယ့် — `in` operator က စစ်ဆေးနေတဲ့ property ကို တကယ် သတ်မှတ်ထားတဲ့ type တွေဆီကိုပဲ တင်းတင်းကျပ်ကျပ် narrow လုပ်ခဲ့လို့ပါ။
ရလဒ်အနေနဲ့ — `packageJSON` ရဲ့ type က `object` အဖြစ်ပဲ ကျန်ခဲ့ပါတယ်။

TypeScript 4.9 က `in` operator ကို — property ကို *လုံးဝ* စာရင်းမသွင်းထားတဲ့ type တွေကို narrow လုပ်ရာမှာ နည်းနည်း ပိုအစွမ်းထက်စေပါတယ်။
သူတို့ကို အရင်အတိုင်း ထားလိုက်မယ့်အစား — ဘာသာစကားက သူတို့ရဲ့ type တွေကို `Record<"property-key-being-checked", unknown>` နဲ့ intersect လုပ်ပါလိမ့်မယ်။

ဒါကြောင့် ကျွန်တော်တို့ ဥပမာထဲမှာ — `packageJSON` ရဲ့ type က `unknown` ကနေ `object` ဆီ၊ အဲဒီကနေ `object & Record<"name", unknown>` ဆီ narrow လုပ်ခံရပါမယ်။
အဲဒါဆိုရင် `packageJSON.name` ကို တိုက်ရိုက် ဝင်ရောက်နိုင်ပြီး — သူ့ဘာသာသူ သပ်သပ်ရပ်ရပ် narrow လုပ်နိုင်ပါပြီ။

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context): string | undefined {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            // Just works!
            return packageJSON.name;
        }
    }

    return undefined;
}
```

TypeScript 4.9 က `in` ကို ဘယ်လို သုံးလဲဆိုတဲ့ check တစ်ချို့ကိုလည်း တင်းကျပ်စေပါတယ် — left side က `string | number | symbol` type ဆီ assignable ဖြစ်ရမယ်၊ right side က `object` ဆီ assignable ဖြစ်ရမယ် ဆိုတာမျိုးပါ။
ဒါက ကျွန်တော်တို့ တရားဝင် property key တွေကိုပဲ သုံးနေကြောင်း သေချာစေပြီး — primitive တွေကို မတော်တဆ စစ်ဆေးမိတာမျိုး မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

အသေးစိတ်အတွက် — [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/50666) ကို ဖတ်ကြည့်ပါ

## Auto-Accessors in Classes (Class များတွင် Auto-Accessor များ)

TypeScript 4.9 က ECMAScript မှာ မကြာမီလာမယ့် auto-accessors လို့ခေါ်တဲ့ feature တစ်ခုကို ပံ့ပိုးပေးပါတယ်။
Auto-accessor တွေကို class ပေါ်က property တွေလိုပဲ ကြေညာနိုင်ပြီး — ခြားနားချက်က `accessor` keyword နဲ့ ကြေညာရတာပါ။

```ts
class Person {
    accessor name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

မျက်နှာပြင်အောက်မှာတော့ — ဒီ auto-accessor တွေက လက်လှမ်းမမီနိုင်တဲ့ private property တစ်ခုပါတဲ့ `get` နဲ့ `set` accessor အဖြစ် "de-sugar" (ပြန်ဖြန့်ကျက်) လုပ်ခံရပါတယ်။

```ts
class Person {
    #__name: string;

    get name() {
        return this.#__name;
    }
    set name(value: string) {
        this.#__name = value;
    }

    constructor(name: string) {
        this.name = name;
    }
}
```

auto-accessors pull request အကြောင်း နောက်ထပ် [မူရင်း PR ပေါ်မှာ](https://github.com/microsoft/TypeScript/pull/49705) ဖတ်ရှုနိုင်ပါတယ်။

## Checks For Equality on `NaN` (NaN ပေါ်တွင် Equality စစ်ဆေးခြင်း)

JavaScript developer တွေ မကြာခဏ မှားတတ်တဲ့ အချက်ကြီးတစ်ခုကတော့ — built-in equality operator တွေသုံးပြီး `NaN` ဆိုတဲ့ value ကို စစ်ဆေးတာပါ။

နောက်ခံအနေနဲ့ ပြောရရင် — `NaN` က "Not a Number" ကို ကိုယ်စားပြုတဲ့ အထူး numeric value တစ်ခုပါ။
ဘယ်အရာမှ `NaN` နဲ့ တူညီတာ မရှိပါဘူး — `NaN` ကိုယ်တိုင်တောင် မဟုတ်ပါဘူး!

```js
console.log(NaN == 0)  // false
console.log(NaN === 0) // false

console.log(NaN == NaN)  // false
console.log(NaN === NaN) // false
```

ဒါပေမယ့် အနည်းဆုံး symmetrical အနေနဲ့ကတော့ — *အရာရာတိုင်းက* `NaN` နဲ့ မညီမျှတာ အမြဲပါပဲ။

```js
console.log(NaN != 0)  // true
console.log(NaN !== 0) // true

console.log(NaN != NaN)  // true
console.log(NaN !== NaN) // true
```

ဒါက နည်းပညာအရ JavaScript တစ်ခုတည်းရဲ့ ပြဿနာတော့ မဟုတ်ပါဘူး — IEEE-754 float တွေ ပါဝင်တဲ့ ဘာသာစကားတိုင်း ဒီလိုပဲ ပြုမူလို့ပါ။
ဒါပေမယ့် JavaScript ရဲ့ အဓိက numeric type က floating point number ဖြစ်ပြီး — JavaScript မှာ number parsing လုပ်တာတွေက `NaN` ကို မကြာခဏ ထွက်စေနိုင်ပါတယ်။
အဲဒါကြောင့် `NaN` ကို စစ်ဆေးတာတွေ အတော်လေး အသုံးများလာပြီး — အဲဒါကို လုပ်ဖို့ မှန်ကန်တဲ့ နည်းကတော့ [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) ကို သုံးတာပါ — *ဒါပေမယ့်* ကျွန်တော်တို့ ပြောခဲ့သလိုပဲ — လူအများစုက `someValue === NaN` နဲ့ မတော်တဆ စစ်မိနေတတ်ပါတယ်။

TypeScript က ယခုဆို `NaN` နဲ့ တိုက်ရိုက် နှိုင်းယှဉ်တာတွေကို error ထုတ်ပေးပြီး — အဲဒီအစား `Number.isNaN` ရဲ့ variant တစ်မျိုးမျိုး သုံးဖို့ အကြံပြုပါတယ်။

```ts
function validate(someValue: number) {
    return someValue !== NaN;
    //     ~~~~~~~~~~~~~~~~~
    // error: This condition will always return 'true'.
    //        Did you mean '!Number.isNaN(someValue)'?
}
```

ဒီပြောင်းလဲမှုက TypeScript က object နဲ့ array literal တွေနဲ့ နှိုင်းယှဉ်တာတွေကို error ထုတ်ပေးနေသလိုပဲ — အစပြုသူတွေရဲ့ အမှားတွေကို ဖမ်းမိဖို့ ဧကန်မုချ အထောက်အကူ ပြုပါလိမ့်မယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

ဒီ check ကို [ပံ့ပိုးပေးခဲ့တဲ့](https://github.com/microsoft/TypeScript/pull/50626) [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျေးဇူးတင်ရှိပါတယ်။
## File-Watching Now Uses File System Events (File-Watching ယခု File System Events ကို အသုံးပြုလာခြင်း)

အစောပိုင်း ဗားရှင်းတွေမှာ TypeScript က file တစ်ခုချင်းစီကို စောင့်ကြည့်ဖို့ *polling* ကို အဓိက အားပြုခဲ့ပါတယ်။
Polling strategy ဆိုတာ — file တစ်ခုရဲ့ အခြေအနေ အပြောင်းအလဲရှိမရှိ သိဖို့ အချိန်ကာလအလိုက် စစ်ဆေးနေတာမျိုးပါ။
Node.js မှာဆိုရင် [`fs.watchFile`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilefilename-options-listener) က polling file-watcher တစ်ခု ရဖို့ built-in နည်းလမ်းပါ။
Polling က platform တွေ၊ file system တွေကြားမှာ ပိုပြီး ခန့်မှန်းရလွယ်ကူတတ်ပေမယ့် — ဘာမှ မပြောင်းလဲဘူးဆိုတောင် file ရဲ့ အခြေအနေကို စစ်ဆေးဖို့ CPU ကို အခါအားလျော်စွာ အနှောင့်အယှက် ပေးနေရပါတယ်။
file အနည်းငယ်ဆိုရင် ဒါကို သတိထားမိမှာ မဟုတ်ပေမယ့် — file အများကြီးပါတဲ့ project ကြီးတစ်ခု — ဒါမှမဟုတ် `node_modules` ထဲမှာ file အများကြီးရှိတာမျိုးဆိုရင် — resource တွေကို အကုန်အကျခံနေရတဲ့ ပြဿနာ (resource hog) ဖြစ်လာနိုင်ပါတယ်။

ယေဘုယျအားဖြင့် ပိုကောင်းတဲ့ နည်းလမ်းကတော့ file system events တွေကို သုံးတာပါ။
Polling လုပ်နေမယ့်အစား — ကျွန်တော်တို့က file တစ်ချို့ရဲ့ အပ်ဒိတ်တွေကို စိတ်ဝင်စားကြောင်း ကြေညာပြီး — အဲဒီ file တွေ *တကယ်ပဲ* ပြောင်းလဲတဲ့အခါ လှမ်းခေါ်မယ့် callback တစ်ခု ပေးလိုက်တာပါ။
အသုံးပြုနေတဲ့ ခေတ်မီ platform အများစုက `CreateIoCompletionPort`, `kqueue`, `epoll`, `inotify` စတဲ့ စက်ကိရိယာတွေနဲ့ API တွေ ပံ့ပိုးပေးပါတယ်။
Node.js ကတော့ [`fs.watch`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilename-options-listener) ကို ပေးခြင်းအားဖြင့် အဲဒါတွေကို အများစု ဖုံးကွယ်ပေးထားပါတယ်။
File system events တွေက များသောအားဖြင့် ကောင်းကောင်း အလုပ်လုပ်ပေမယ့် — သုံးတဲ့အခါ [caveat တွေ အများကြီး](https://nodejs.org/docs/latest-v18.x/api/fs.html#caveats) ရှိပြီး — အဲဒါတွေက `fs.watch` API ကို သုံးတာနဲ့လည်း သက်ဆိုင်ပါတယ်။
Watcher တစ်ခုအနေနဲ့ [inode watching](https://nodejs.org/docs/latest-v18.x/api/fs.html#inodes)၊ [file system တစ်ချို့မှာ မရနိုင်တာ](https://nodejs.org/docs/latest-v18.x/api/fs.html#availability) (ဥပမာ network file system တွေ)၊ recursive file watching ရနိုင်မရနိုင်တာ၊ directory rename တွေက event တွေကို စေလွှတ်မလွှတ်တာ၊ file watcher တွေ ကုန်ဆုံးသွားတာတောင် ဂရုစိုက်စဉ်းစားဖို့ လိုပါတယ်!
တစ်နည်းပြောရရင် — အထူးသဖြင့် cross-platform ဖြေရှင်းချက် လိုချင်နေတယ်ဆိုရင် — ဒါက အခမဲ့ ထမင်းစားပွဲတော့ မဟုတ်ပါဘူး။

အဲဒါကြောင့် ကျွန်တော်တို့ရဲ့ default က — အားလုံးနဲ့ ဆက်စပ်နိုင်ဆုံး (lowest common denominator) ဖြစ်တဲ့ polling ကို ရွေးချယ်ခဲ့တာပါ။
အမြဲတော့ မဟုတ်ပေမယ့် — အများစုမှာ အဲဒီလိုပါ။

အချိန်ကြာလာတာနဲ့အမျှ — [တခြား file-watching strategy တွေကို ရွေးချယ်နိုင်တဲ့ နည်းလမ်း](/docs/typescript/configuring-watch) တွေကို ကျွန်တော်တို့ ပံ့ပိုးပေးခဲ့ပါတယ်။
ဒါက ကျွန်တော်တို့ကို — ဒီ platform အလိုက် ထူးခြားချက်တွေအများစုကို ခံနိုင်ရည်ရှိအောင် file-watching implementation ကို feedback ရယူပြီး ခိုင်မာစေဖို့ အခွင့်ပေးခဲ့ပါတယ်။
TypeScript က codebase ကြီးတွေအထိ scale လုပ်ဖို့ လိုအပ်လာပြီး — ဒီနယ်ပယ်မှာ တိုးတက်လာတာနဲ့အမျှ — default အနေနဲ့ file system events ဆီ ပြောင်းလဲလိုက်တာ တန်ဖိုးရှိတဲ့ ရင်းနှီးမြှုပ်နှံမှုတစ်ခုလို့ ခံစားမိခဲ့ပါတယ်။

TypeScript 4.9 မှာ file watching က default အနေနဲ့ file system events တွေကို သုံးပြီး — event-based watcher တွေ တပ်ဆင်လို့ မရမှသာ polling ဆီ ပြန်ကျပါတယ်။
developer အများစုအတွက် — `--watch` mode မှာ ဖြစ်ဖြစ် — Visual Studio ဒါမှမဟုတ် VS Code လို TypeScript-powered editor တစ်ခုနဲ့ ဖြစ်ဖြစ် — resource အကုန်အကျ သိသိသာသာ သက်သာတဲ့ အတွေ့အကြုံကို ရစေပါလိမ့်မယ်။

[file-watching အလုပ်လုပ်ပုံကို](/docs/typescript/configuring-watch) environment variable တွေနဲ့ `watchOptions` ကနေ ဆက်လက် configure လုပ်နိုင်ဆဲပါ — ပြီးတော့ [VS Code လို editor တစ်ချို့က `watchOptions` ကို သီးခြား ပံ့ပိုးနိုင်ပါတယ်](https://code.visualstudio.com/docs/getstarted/settings#:~:text=typescript%2etsserver%2ewatchOptions)။
source code တွေက network file system (NFS, SMB လိုမျိုး) ပေါ်မှာ ရှိနေတဲ့ ပိုထူးခြားတဲ့ setup တွေ သုံးနေတဲ့ developer တွေက အဟောင်း အပြုအမူဆီ ပြန်ရွေးချယ်ဖို့ လိုနိုင်ပါတယ် — ဒါပေမယ့် server မှာ လုံလောက်တဲ့ processing power ရှိရင်တော့ SSH ဖွင့်ပြီး TypeScript ကို remote ကနေ run လုပ်တာက ပိုကောင်းနိုင်ပါတယ် — အဲဒီအခါ file တွေကို တိုက်ရိုက် local ကနေ ဝင်ရောက်နိုင်လို့ပါ။
VS Code မှာ ဒါကို လွယ်ကူစေဖို့ [remote extensions](https://marketplace.visualstudio.com/search?term=remote&target=VSCode&category=All%20categories&sortBy=Relevance) တွေ အများကြီး ရှိပါတယ်။

ဒီပြောင်းလဲမှုအကြောင်း [GitHub ပေါ်မှာ နောက်ထပ် ဖတ်ရှုနိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50366)။

## "Remove Unused Imports" and "Sort Imports" Commands for Editors (Editor များအတွက် "Remove Unused Imports" နှင့် "Sort Imports" Command များ)

အရင်က TypeScript က import တွေကို စီမံဖို့ editor command နှစ်ခုကိုပဲ ပံ့ပိုးပေးခဲ့ပါတယ်။
ကျွန်တော်တို့ ဥပမာအတွက် အောက်ပါ code ကို ယူကြည့်ရအောင်:

```ts
import { Zebra, Moose, HoneyBadger } from "./zoo";
import { foo, bar } from "./helper";

let x: Moose | HoneyBadger = foo();
```

ပထမတစ်ခုက "Organize Imports" လို့ ခေါ်ပြီး — unused import တွေကို ဖယ်ရှားပြီးမှ ကျန်တဲ့ဟာတွေကို စီစဉ်ပေးပါတယ်။
အဲဒီ file ကို ဒီလိုပုံစံမျိုး ပြန်ရေးပေးပါလိမ့်မယ်:

```ts
import { foo } from "./helper";
import { HoneyBadger, Moose } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

TypeScript 4.3 မှာ "Sort Imports" လို့ခေါ်တဲ့ command တစ်ခုကို မိတ်ဆက်ခဲ့ပြီး — အဲဒါက file ထဲက import တွေကို *ဖယ်ရှားခြင်းမရှိဘဲ* စီစဉ်ပေးရုံပဲ လုပ်ပါတယ် — file ကို ဒီလို ပြန်ရေးပေးပါလိမ့်မယ်။

```ts
import { bar, foo } from "./helper";
import { HoneyBadger, Moose, Zebra } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

"Sort Imports" ရဲ့ ကန့်သတ်ချက်ကတော့ — Visual Studio Code မှာ ဒီ feature ကို save လုပ်တဲ့အခါမှသာ ရနိုင်ပြီး — ကိုယ်တိုင် နှိပ်ပြီး ခေါ်ယူလို့ မရဘဲ ဖြစ်နေခဲ့တာပါ။

TypeScript 4.9 က ကျန်တဲ့ တစ်ဝက်ကို ထပ်ဖြည့်ပေးပြီး — ယခု "Remove Unused Imports" ကို ပံ့ပိုးပေးပါတယ်။
TypeScript က unused import name တွေနဲ့ statement တွေကို ဖယ်ရှားပေးပေမယ့် — ကျန်တဲ့ စီစဉ်မှု (relative ordering) ကိုတော့ မပြောင်းပါဘူး။

```ts
import { Moose, HoneyBadger } from "./zoo";
import { foo } from "./helper";

let x: Moose | HoneyBadger = foo();
```

ဒီ feature က command နှစ်ခုထဲက တစ်ခုခုကို သုံးချင်တဲ့ editor တိုင်းအတွက် ရနိုင်ပါတယ် — ဒါပေမယ့် အထူးသဖြင့် Visual Studio Code (1.73 နဲ့ ၎င်းနောက်ပိုင်း) မှာ built-in ပံ့ပိုးမှု ရှိမှာ ဖြစ်ပြီး — အဲဒီ command တွေကို Command Palette ကနေ ခေါ်ယူနိုင်ပါလိမ့်မယ်။
ပိုပြီး သီးခြားစီ ခွဲထားတဲ့ "Remove Unused Imports" ဒါမှမဟုတ် "Sort Imports" command တွေကို သုံးချင်တဲ့ သုံးစွဲသူတွေက — အလိုရှိပါက "Organize Imports" ရဲ့ key combination ကို အဲဒါတွေဆီ ပြန်သတ်မှတ်နိုင်ပါတယ်။

ဒီ feature ရဲ့ [အသေးစိတ်အချက်တွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/50931)။

## Go-to-Definition on `return` Keywords (return Keyword များပေါ်တွင် Go-to-Definition)

editor ထဲမှာ `return` keyword ပေါ်မှာ go-to-definition လုပ်တဲ့အခါ — TypeScript က ယခုဆို သက်ဆိုင်ရာ function ရဲ့ ထိပ်ဆုံးကို ခုန်သွားပါလိမ့်မယ်။
ဒါက `return` တစ်ခုက ဘယ် function နဲ့ သက်ဆိုင်လဲဆိုတာကို မြန်မြန်ဆန်ဆန် သဘောပေါက်ဖို့ အထောက်အကူ ဖြစ်စေနိုင်ပါတယ်။

TypeScript က ဒီလုပ်ဆောင်ချက်ကို [keyword တွေဖြစ်တဲ့ `await` နဲ့ `yield`](https://github.com/microsoft/TypeScript/issues/51223) ဒါမှမဟုတ် [`switch`, `case`, နဲ့ `default`](https://github.com/microsoft/TypeScript/issues/51225) စတာတွေအထိ ချဲ့ထွင်သွားဖို့ မျှော်လင့်ပါတယ်။

[ဒီ feature ကို](https://github.com/microsoft/TypeScript/pull/51227) [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် အကောင်အထည်ဖော်နိုင်ခဲ့ပါတယ်။

## Performance Improvements (Performance မြှင့်တင်မှုများ)

TypeScript မှာ သေးငယ်ပေမယ့် သိသာထင်ရှားတဲ့ performance တိုးတက်မှု တစ်ချို့ ရှိပါတယ်။

ပထမဆုံး — TypeScript ရဲ့ `forEachChild` function ကို — syntax node အားလုံးမှာ `switch` statement သုံးမယ့်အစား — function table lookup သုံးအောင် ပြန်ရေးခဲ့ပါတယ်။
`forEachChild` က compiler ထဲမှာ syntax node တွေကို ဖြတ်သန်းလျှောက်လှမ်းတဲ့ လုပ်ငန်းအဓိက (workhorse) တစ်ခုဖြစ်ပြီး — compiler ရဲ့ binding stage နဲ့ language service ရဲ့ အစိတ်အပိုင်းတွေမှာ အသုံးများပါတယ်။
`forEachChild` ကို refactoring လုပ်ခြင်းက — binding phase နဲ့ language service operation တွေမှာ ကုန်ဆုံးတဲ့ အချိန်ရဲ့ 20% အထိ လျှော့ချပေးနိုင်ခဲ့ပါတယ်။

`forEachChild` အတွက် ဒီ performance အကျိုးအမြတ်ကို ရှာတွေ့ပြီးတာနဲ့ — compiler နဲ့ language service ထဲမှာ node တွေကို transform လုပ်ဖို့ သုံးတဲ့ `visitEachChild` ဆိုတဲ့ function ပေါ်မှာလည်း စမ်းသပ်ကြည့်ခဲ့ပါတယ်။
အလားတူ refactoring က project output ထုတ်လုပ်ရာမှာ ကုန်ဆုံးတဲ့ အချိန်ရဲ့ 3% အထိ လျှော့ချပေးနိုင်ခဲ့ပါတယ်။

`forEachChild` ထဲက ကနဦး စူးစမ်းရှာဖွေမှုက [Artemis Everfree](https://artemis.sh/) ရေးတဲ့ [blog post တစ်ပုဒ်](https://artemis.sh/2022/08/07/emulating-calculators-fast-in-js.html) ကနေ စေ့ဆော်မှု ရခဲ့တာပါ။
ကျွန်တော်တို့ မြန်ဆန်လာတဲ့ အဓိက အကြောင်းရင်းက blog post ထဲက ဖော်ပြချက်တွေထက် function ရဲ့ အရွယ်အစား/ရှုပ်ထွေးမှုနဲ့ ပိုဆက်စပ်နေနိုင်တယ်လို့ ယုံကြည်စရာ အကြောင်းရင်းတွေ ရှိပေမယ့် — ဒီအတွေ့အကြုံကနေ သင်ယူပြီး TypeScript ကို ပိုမြန်အောင် လုပ်ပေးတဲ့ လျင်မြန်တဲ့ refactoring တစ်ခုကို စမ်းကြည့်နိုင်ခဲ့တဲ့အတွက် ဝမ်းသာမိပါတယ်။

နောက်ဆုံးအနေနဲ့ — conditional type တစ်ခုရဲ့ true branch ထဲမှာ type တစ်ခုအကြောင်း အချက်အလက်ကို TypeScript က ထိန်းသိမ်းတဲ့ နည်းလမ်းကိုလည်း optimize လုပ်ခဲ့ပါတယ်။
ဒီလို type မျိုးမှာ

```ts
interface Zoo<T extends Animal> {
    // ...
}

type MakeZoo<A> = A extends Animal ? Zoo<A> : never;
```

`Zoo<A>` က တရားဝင်မဝင်ဆိုတာ စစ်ဆေးတဲ့အခါ `A` က `Animal` လည်း ဖြစ်ရမယ်ဆိုတာကို TypeScript က "မှတ်ထား" ဖို့ လိုပါတယ်။
ဒါကို အခြေခံအားဖြင့် — `A` နဲ့ `Animal` ရဲ့ intersection ကို ကိုင်ထားဖို့ အထူး type တစ်ခု ဖန်တီးခြင်းအားဖြင့် လုပ်ပါတယ်။
ဒါပေမယ့် TypeScript က အရင်က ဒါကို မလိုအပ်ဘဲ တစ်ခါတည်း (eagerly) လုပ်ခဲ့ပြီး — နောက်ပြီး type-checker ထဲက code အမှားတစ်ချို့က ဒီအထူး type တွေ ရိုးရှင်းအောင် (simplify) မလုပ်နိုင်အောင် တားဆီးနေခဲ့ပါတယ်။
TypeScript က ယခုတော့ ဒီ type တွေကို intersect လုပ်တာကို လိုအပ်တဲ့အခါကျမှ ရွှေ့ဆိုင်းလုပ်ပါတယ်။
conditional type တွေကို အကြီးအကျယ် သုံးတဲ့ codebase တွေမှာ TypeScript ရဲ့ သိသာတဲ့ မြန်ဆန်မှုတွေကို မြင်တွေ့ရနိုင်ပေမယ့် — ကျွန်တော်တို့ရဲ့ performance စမ်းသပ်မှု suite ထဲမှာတော့ type-checking အချိန်ရဲ့ နှိမ့်ချတဲ့ 3% လျှော့ချမှုကိုပဲ တွေ့ခဲ့ရပါတယ်။

ဒီ optimization တွေအကြောင်း သူတို့ရဲ့ သက်ဆိုင်ရာ pull request တွေမှာ နောက်ထပ် ဖတ်ရှုနိုင်ပါတယ်:

* [`forEachChild` ကို jump-table အဖြစ်](https://github.com/microsoft/TypeScript/pull/50225)
* [`visitEachChild` ကို jump-table အဖြစ်](https://github.com/microsoft/TypeScript/pull/50266)
* [substitition types တွေကို optimize လုပ်ခြင်း](https://github.com/microsoft/TypeScript/pull/50397)

## Correctness Fixes and Breaking Changes (Correctness ပြင်ဆင်မှုများနှင့် Breaking Changes)

### lib.d.ts Updates (lib.d.ts အပ်ဒိတ်များ)

TypeScript က ကြီးမားတဲ့ breaks တွေကို ရှောင်ရှားဖို့ ကြိုးစားပေမယ့် — built-in library တွေထဲက သေးငယ်တဲ့ ပြောင်းလဲမှုတွေတောင် ပြဿနာ တက်စေနိုင်ပါတယ်။
DOM နဲ့ `lib.d.ts` အပ်ဒိတ်တွေကြောင့် ကြီးမားတဲ့ breaks တွေ ဖြစ်လိမ့်မယ်လို့ မမျှော်လင့်ထားပေမယ့် — သေးငယ်တဲ့ ပြဿနာတစ်ချို့တော့ ရှိနိုင်ပါတယ်။

### Better Types for `Promise.resolve` (Promise.resolve အတွက် ပိုမိုကောင်းမွန်သော Type များ)

`Promise.resolve` က ယခုဆို — သူ့ဆီ ပို့လိုက်တဲ့ Promise-like type တွေကို ဖြေဖျက်ဖို့ `Awaited` type ကို သုံးပါတယ်။
ဆိုလိုတာက — သင့်တော်တဲ့ `Promise` type ကို ပိုပြီး မကြာခဏ ပြန်ပေးနိုင်ပေမယ့် — အဲဒီ တိုးတက်လာတဲ့ type က — `Promise` အစား `any` ဒါမှမဟုတ် `unknown` ကို မျှော်လင့်ထားတဲ့ ရှိပြီးသား code တွေကို ပျက်စေနိုင်ပါတယ်။
အသေးစိတ်အတွက် — [မူရင်း ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/33074)။

### JavaScript Emit No Longer Elides Imports (JavaScript Emit သည် Import များကို ဖျောက်ဖျက်တော့မည် မဟုတ်)

TypeScript က JavaScript အတွက် type-checking နဲ့ compilation ကို စတင် ပံ့ပိုးတဲ့အခါ — import elision လို့ခေါ်တဲ့ feature တစ်ခုကို မတော်တဆ ပံ့ပိုးမိခဲ့ပါတယ်။
အတိုချုပ်ပြောရရင် — import တစ်ခုကို value အဖြစ် မသုံးဘူး၊ ဒါမှမဟုတ် compiler က အဲဒီ import က runtime မှာ value တစ်ခုကို ရည်ညွှန်းမထားဘူးလို့ သိရှိနိုင်ရင် — compiler က emit လုပ်တဲ့အခါ အဲဒီ import ကို ချန်လှပ်ပစ်လိုက်ပါတယ်။

ဒီအပြုအမူက မေးခွန်းထုတ်စရာ ဖြစ်ခဲ့ပါတယ် — အထူးသဖြင့် import က value တစ်ခုကို ရည်ညွှန်းမထားဘူးလားဆိုတဲ့ စစ်ဆေးမှုပိုင်းမှာပါ — အကြောင်းကတော့ TypeScript က တစ်ခါတစ်ရံ မမှန်ကန်တဲ့ declaration file တွေကို ယုံကြည်ရလို့ပါ။
အဲဒါကြောင့် TypeScript က ယခုဆို JavaScript file တွေထဲမှာ import တွေကို ထိန်းသိမ်းထားပါတယ်။

```js
// Input:
import { someValue, SomeClass } from "some-module";

/** @type {SomeClass} */
let val = someValue;

// Previous Output:
import { someValue } from "some-module";

/** @type {SomeClass} */
let val = someValue;

// Current Output:
import { someValue, SomeClass } from "some-module";

/** @type {SomeClass} */
let val = someValue;
```

နောက်ထပ် အချက်အလက်တွေကို [အကောင်အထည်ဖော်တဲ့ ပြောင်းလဲမှုမှာ](https://github.com/microsoft/TypeScript/pull/50404) ရနိုင်ပါတယ်။

### `exports` is Prioritized Over `typesVersions` (exports သည် typesVersions ထက် ဦးစားပေးခံရခြင်း)

အရင်က TypeScript က `--moduleResolution node16` အောက်မှာ `package.json` တစ်ခုကနေ resolve လုပ်တဲ့အခါ — `exports` field ထက် `typesVersions` field ကို မှားယွင်းစွာ ဦးစားပေးခဲ့ပါတယ်။
ဒီပြောင်းလဲမှုက သင့် library ကို ထိခိုက်ရင် — သင့် `package.json` ရဲ့ `exports` field ထဲမှာ `types@` version selector တွေ ထည့်ဖို့ လိုနိုင်ပါတယ်။

```diff
  {
      "type": "module",
      "main": "./dist/main.js"
      "typesVersions": {
          "<4.8": { ".": ["4.8-types/main.d.ts"] },
          "*": { ".": ["modern-types/main.d.ts"] }
      },
      "exports": {
          ".": {
+             "types@<4.8": "./4.8-types/main.d.ts",
+             "types": "./modern-types/main.d.ts",
              "import": "./dist/main.js"
          }
      }
  }
```

အသေးစိတ်အတွက် — [ဒီ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/50890)။

## `substitute` Replaced With `constraint` on `SubstitutionType`s (SubstitutionType များပေါ်တွင် substitute ကို constraint ဖြင့် အစားထိုးခြင်း)

substitution type တွေအပေါ် optimization တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ — `SubstitutionType` object တွေက — ထိရောက်တဲ့ substitution ကို ကိုယ်စားပြုတဲ့ `substitute` property (များသောအားဖြင့် base type နဲ့ implicit constraint ရဲ့ intersection) — မပါဝင်တော့ဘဲ — `constraint` property ကိုပဲ ထည့်ထားပါတော့တယ်။

အသေးစိတ်အတွက် — [မူရင်း pull request မှာ နောက်ထပ် ဖတ်ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/50397)။
