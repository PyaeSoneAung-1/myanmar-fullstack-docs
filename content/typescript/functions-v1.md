---
title: "Functions (Function များ)"
description: "Handbook (v1) ရဲ့ Functions စာမျက်နှာ — function types ရေးသားခြင်း၊ contextual typing၊ optional/default/rest parameters များ၊ `this` ကို မှန်ကန်စွာ ကိုင်တွယ်ခြင်း (arrow functions နဲ့ `this` parameters)၊ overloads များအကြောင်း ဥပမာများစွာနဲ့ ရှင်းပြထားချက်"
order: 76
source: "https://www.typescriptlang.org/docs/handbook/functions.html"
status: translated
updated: 2026-09-05
---

Functions တွေဟာ JavaScript ထဲက application တိုင်းရဲ့ အခြေခံအုတ်မြစ် (fundamental building block) ပါ။ သူတို့ဟာ — classes တွေ၊ information hiding (အချက်အလက် ဖုံးကွယ်ခြင်း) နဲ့ modules တွေကို အတုယူရင်း — abstraction (စိတ္တဇအလွှာ ခွဲခြားခြင်း) အလွှာတွေ တည်ဆောက်တဲ့ နည်းလမ်းလည်း ဖြစ်ပါတယ်။

TypeScript မှာ classes, namespaces, နဲ့ modules တွေ ရှိပေမယ့် — အရာတွေကို ဘယ်လို _လုပ်ဆောင်_ ရမလဲဆိုတာ ဖော်ပြရာမှာ functions တွေက အဓိက အခန်းကဏ္ဍကနေ ပါဝင်နေဆဲပါ။ TypeScript က standard JavaScript functions တွေကို ပိုလွယ်ကူစွာ အလုပ်လုပ်နိုင်ဖို့ စွမ်းရည်အသစ်တွေလည်း ထပ်ဖြည့်ပေးပါတယ်။

## Functions (Function များ)

စလိုက်ရအောင် — JavaScript မှာလိုပဲ TypeScript မှာလည်း functions တွေကို named function (နာမည်ရှိ function) အနေနဲ့ရော anonymous function (အမည်မဲ့ function) အနေနဲ့ရော ဖန်တီးနိုင်ပါတယ်။ ဒါက — API တစ်ခုထဲမှာ functions တွေရဲ့ စာရင်းတစ်ခု တည်ဆောက်နေတာပဲဖြစ်ဖြစ် — တခြား function တစ်ခုဆီ လွှဲပြောင်းပေးဖို့ ဖန်တီးတဲ့ one-off function တစ်ခုပဲဖြစ်ဖြစ် — ကိုယ့် application အတွက် အသင့်တော်ဆုံး နည်းလမ်းကို ရွေးချယ်နိုင်စေပါတယ်။

ဒီနည်းလမ်းနှစ်ခုက JavaScript မှာ ဘယ်လိုပုံ ရှိလဲ မြန်မြန် ပြန်သုံးသပ်ကြည့်ရအောင်:

```ts twoslash
// @strict: false
// Named function
function add(x, y) {
  return x + y;
}

// Anonymous function
let myAdd = function (x, y) {
  return x + y;
};
```

JavaScript မှာလိုပဲ — functions တွေဟာ function body ရဲ့ အပြင်ဘက်က variables တွေကိုလည်း ရည်ညွှန်းနိုင်ပါတယ်။ အဲဒီလို ရည်ညွှန်းတဲ့အခါ — အဲဒီ variables တွေကို _capture_ (ဖမ်းယူခြင်း) လုပ်တယ်လို့ ဆိုပါတယ်။ ဒါက ဘယ်လို အလုပ်လုပ်လဲ (ပြီးတော့ ဒီနည်းစနစ်ကို သုံးတဲ့အခါ ရှိတဲ့ trade-offs (အပေးအယူများ)) ဆိုတာ နားလည်တာက ဒီဆောင်းပါးရဲ့ အတိုင်းအတာ အပြင်ဘက်မှာ ရှိပေမယ့် — ဒီယန္တရားက ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို ခိုင်ခိုင်မာမာ နားလည်ထားတာက JavaScript နဲ့ TypeScript နဲ့ အလုပ်လုပ်ရာမှာ အရေးကြီးတဲ့ အစိတ်အပိုင်းတစ်ခုပါ။

```ts twoslash
// @strict: false
let z = 100;

function addToZ(x, y) {
  return x + y + z;
}
```

## Function Types (Function Types များ)

### Typing the function (Function ကို Type သတ်မှတ်ခြင်း)

အစောပိုင်းက ကျွန်တော်တို့ရဲ့ ရိုးရိုး ဥပမာတွေပေါ်မှာ types တွေ ထည့်ကြည့်ရအောင်:

```ts twoslash
function add(x: number, y: number): number {
  return x + y;
}

let myAdd = function (x: number, y: number): number {
  return x + y;
};
```

Parameter တစ်ခုချင်းစီပေါ်မှာ types တွေ ထည့်နိုင်သလို — return type (ပြန်ပေးတဲ့ type) တစ်ခု ထည့်ဖို့ function ကိုယ်တိုင်ပေါ်မှာလည်း ထည့်နိုင်ပါတယ်။ TypeScript က return statements တွေကို ကြည့်ပြီး return type ကို သူ့ဘာသာ တွက်ဆနိုင်လို့ — အခြေအနေ အများစုမှာ ဒါကို ချန်လိုက်လည်း ရပါတယ်။

### Writing the function type (Function Type ရေးသားခြင်း)

Function ကို type သတ်မှတ်ပြီးပြီဆိုတော့ — function type ရဲ့ အစိတ်အပိုင်းတစ်ခုချင်းစီကို ကြည့်ပြီး — function ရဲ့ type အပြည့်အစုံကို ရေးကြည့်ရအောင်။

```ts twoslash
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

Function တစ်ခုရဲ့ type မှာလည်း အပိုင်းနှစ်ပိုင်း ရှိပါတယ်: arguments တွေရဲ့ type နဲ့ return type ပါ။ Function type တစ်ခုလုံးကို ရေးထုတ်တဲ့အခါ အပိုင်းနှစ်ခုလုံး လိုအပ်ပါတယ်။ Parameter types တွေကို parameter list တစ်ခု ရေးသလိုပဲ — parameter တစ်ခုချင်းစီကို နာမည်တစ်ခုနဲ့ type တစ်ခု ပေးပြီး — ရေးထုတ်ပါတယ်။ ဒီနာမည်တွေက ဖတ်ရှုရ လွယ်ကူအောင်ပဲ ဖြစ်ပါတယ်။ ဒီအစား အောက်ပါအတိုင်းလည်း ရေးနိုင်ပါတယ်:

```ts twoslash
let myAdd: (baseValue: number, increment: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

Parameter types တွေ ကိုက်ညီနေသရွေ့ — function type ထဲမှာ parameters တွေကို ဘယ်လို နာမည်တွေ ပေးထားပါစေ — function အတွက် valid (တရားဝင်) type တစ်ခုအဖြစ် သတ်မှတ်ပါတယ်။

ဒုတိယ အပိုင်းကတော့ return type ပါ။ Parameters တွေနဲ့ return type ကြားမှာ arrow (`=>`) တစ်ခုကို သုံးပြီး ဘယ်ဟာက return type လဲဆိုတာ ရှင်းရှင်းလင်းလင်း ဖော်ပြပါတယ်။ အရင်က ပြောခဲ့သလို — ဒါက function type ရဲ့ မဖြစ်မနေ လိုအပ်တဲ့ အစိတ်အပိုင်းတစ်ခုမို့ — function က value တစ်ခု ပြန်မပေးဘူးဆိုရင် ချန်ထားလိုက်တာထက် `void` ကို သုံးရပါမယ်။

သတိပြုစရာက — function type ကို ဖွဲ့စည်းတာက parameters တွေနဲ့ return type ပဲ ဖြစ်ပါတယ်။ Captured (ဖမ်းယူထားတဲ့) variables တွေကတော့ type ထဲမှာ ထင်ဟပ်မနေပါဘူး။ လက်တွေ့မှာတော့ — captured variables တွေဟာ function တိုင်းရဲ့ "hidden state" (ဖုံးကွယ်ထားတဲ့ အခြေအနေ) ရဲ့ အစိတ်အပိုင်းဖြစ်ပြီး — သူ့ရဲ့ API ကို ဖွဲ့စည်းမပေးပါဘူး။

### Inferring the types (Types များကို ခန့်မှန်းခြင်း)

ဥပမာကို စမ်းသပ်ကြည့်တဲ့အခါ — equation ရဲ့ တစ်ဖက်တည်းမှာပဲ types တွေ ရှိနေရင်တောင် TypeScript compiler က type ကို တွက်ဆနိုင်တာ သတိပြုမိလောက်ပါတယ်:

```ts twoslash
// The parameters 'x' and 'y' have the type number
let myAdd = function (x: number, y: number): number {
  return x + y;
};

// myAdd has the full function type
let myAdd2: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
```

ဒါကို "contextual typing" (context အရ type သတ်မှတ်ခြင်း) လို့ ခေါ်ပြီး — type inference (type ခန့်မှန်းခြင်း) ပုံစံတစ်မျိုး ဖြစ်ပါတယ်။ ဒါက ကိုယ့် program ကို typed (type သတ်မှတ်ထားတဲ့ အနေအထား) ဖြစ်နေအောင် ထိန်းသိမ်းဖို့ လိုအပ်တဲ့ အားထုတ်မှုတွေကို လျှော့ချပေးပါတယ်။

## Optional and Default Parameters (Optional နှင့် Default Parameters များ)

TypeScript မှာ parameter တိုင်းကို function အတွက် မဖြစ်မနေ လိုအပ်တယ်လို့ ယူဆပါတယ်။ ဒါက parameter တစ်ခုကို `null` ဒါမှမဟုတ် `undefined` ပေးလို့ မရဘူးလို့ ဆိုလိုတာ မဟုတ်ဘဲ — function ကို ခေါ်လိုက်တဲ့အခါ user က parameter တစ်ခုချင်းစီအတွက် value တစ်ခု ပေးထားလားဆိုတာကို compiler က စစ်ဆေးမှာ ဖြစ်ပါတယ်။ ဒီ parameters တွေကပဲ function ဆီ ပို့မယ့် တစ်ခုတည်းသော parameters တွေလို့လည်း compiler က ယူဆပါတယ်။ အတိုချုပ်ပြောရရင် — function တစ်ခုဆီ ပေးလိုက်တဲ့ arguments အရေအတွက်ဟာ function က မျှော်လင့်ထားတဲ့ parameters အရေအတွက်နဲ့ ကိုက်ညီရပါမယ်။

```ts twoslash
// @errors: 2554
function buildName(firstName: string, lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
```

JavaScript မှာတော့ parameter တိုင်းက optional (ထည့်လည်းရ မထည့်လည်းရတဲ့) ဖြစ်ပြီး — user တွေက သင့်တော်သလို ချန်လိုက်လို့ ရပါတယ်။ အဲဒီလို ချန်လိုက်တဲ့အခါ သူတို့ရဲ့ value က `undefined` ဖြစ်ပါတယ်။ TypeScript မှာတော့ optional ဖြစ်စေချင်တဲ့ parameters တွေရဲ့ အဆုံးမှာ `?` တစ်ခု ထည့်ခြင်းအားဖြင့် ဒီ functionality ကို ရနိုင်ပါတယ်။ ဥပမာ — အပေါ်က ဥပမာထဲက last name parameter ကို optional ဖြစ်စေချင်တယ်ဆိုပါစို့:

```ts twoslash
// @errors: 2554
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

let result1 = buildName("Bob"); // works correctly now
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
```

Optional parameters တွေ အားလုံးဟာ required parameters တွေရဲ့ နောက်မှာ လိုက်ရပါမယ်။ Last name အစား first name ကို optional ဖြစ်စေချင်တယ်ဆိုရင် — function ထဲက parameters တွေရဲ့ အစဉ်ကို ပြောင်းပြီး — first name ကို စာရင်းရဲ့ နောက်ဆုံးမှာ ထားရပါလိမ့်မယ်။

TypeScript မှာ — user က value တစ်ခု မပေးဘူးဆိုရင် ဒါမှမဟုတ် အဲဒီနေရာမှာ `undefined` ပို့လိုက်ရင် — parameter ကို သတ်မှတ်ပေးမယ့် value တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ ဒါတွေကို default-initialized parameters (default value နဲ့ ကနဦး သတ်မှတ်ထားတဲ့ parameters) လို့ ခေါ်ပါတယ်။ အရင် ဥပမာကို ယူပြီး — last name ရဲ့ default ကို `"Smith"` လို့ သတ်မှတ်ကြည့်ရအောင်။

```ts twoslash
// @errors: 2554
function buildName(firstName: string, lastName = "Smith") {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined); // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result4 = buildName("Bob", "Adams"); // ah, just right
```

Required parameters တွေ အားလုံးရဲ့ နောက်မှာ လာတဲ့ default-initialized parameters တွေကို optional အဖြစ် သဘောထားပြီး — optional parameters တွေလိုပဲ — သက်ဆိုင်တဲ့ function ကို ခေါ်တဲ့အခါ ချန်လိုက်လို့ ရပါတယ်။ ဆိုလိုတာက optional parameters တွေနဲ့ နောက်ဆုံးမှာ ရှိတဲ့ default parameters တွေဟာ သူတို့ရဲ့ types တွေမှာ တူညီမှု ရှိမှာမို့ — အောက်ပါ နှစ်ခုလုံး

```ts
function buildName(firstName: string, lastName?: string) {
  // ...
}
```

နဲ့

```ts
function buildName(firstName: string, lastName = "Smith") {
  // ...
}
```

ဟာ type `(firstName: string, lastName?: string) => string` ကို အတူတူ မျှဝေပါတယ်။ `lastName` ရဲ့ default value ကတော့ type ထဲမှာ ပျောက်ကွယ်သွားပြီး — parameter က optional ဖြစ်တယ်ဆိုတဲ့ အချက်ပဲ ကျန်ရစ်ပါတယ်။

သာမန် optional parameters တွေနဲ့ မတူဘဲ — default-initialized parameters တွေက required parameters တွေရဲ့ နောက်မှာ လာဖို့ _မလို_ ပါဘူး။ Default-initialized parameter တစ်ခုက required parameter တစ်ခုရဲ့ ရှေ့မှာ လာနေရင် — default-initialized value ကို ရဖို့ user တွေက `undefined` ကို အတိအကျ ပို့ပေးရပါတယ်။ ဥပမာ — ကျွန်တော်တို့ရဲ့ နောက်ဆုံး ဥပမာကို `firstName` ပေါ်မှာ default initializer တစ်ခုပဲ ထည့်ပြီး ရေးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2554
function buildName(firstName = "Will", lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams"); // okay and returns "Will Adams"
```

### Rest Parameters (Rest Parameters များ)

Required, optional, နဲ့ default parameters တွေ အားလုံးမှာ တူညီတဲ့ အချက်တစ်ခု ရှိပါတယ်: သူတို့က parameter တစ်ခုချင်းစီအလိုက်ပဲ ဆွေးနွေးကြတာပါ။ တစ်ခါတလေ — parameters အများအပြားကို အစုတစ်ခုအနေနဲ့ ကိုင်တွယ်ချင်တာမျိုး ဒါမှမဟုတ် function တစ်ခုက နောက်ဆုံးမှာ parameter ဘယ်နှစ်ခု လက်ခံမယ်ဆိုတာ မသိတာမျိုး ရှိနိုင်ပါတယ်။ JavaScript မှာ function body တိုင်းရဲ့ အတွင်းမှာ မြင်ရတဲ့ `arguments` variable ကို သုံးပြီး arguments တွေကို တိုက်ရိုက် ကိုင်တွယ်နိုင်ပါတယ်။

TypeScript မှာတော့ ဒီ arguments တွေကို variable တစ်ခုထဲကို စုစည်းနိုင်ပါတယ်:

```ts twoslash
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

// employeeName will be "Joseph Samuel Lucas MacKinzie"
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

_Rest parameters_ တွေကို အကန့်အသတ်မရှိတဲ့ optional parameters အရေအတွက်တစ်ခုလို သဘောထားပါတယ်။ Rest parameter တစ်ခုအတွက် arguments တွေ ပို့တဲ့အခါ — ကိုယ်လိုသလောက် များများ ပို့လို့ ရသလို — လုံးဝ မပို့ဘဲလည်း နေလို့ ရပါတယ်။ Compiler က ellipsis (`...`) ရဲ့ နောက်မှာ ပေးထားတဲ့ နာမည်နဲ့အတူ — ပို့လိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို တည်ဆောက်ပေးပြီး — ကိုယ့် function ထဲမှာ အသုံးပြုခွင့် ပေးပါတယ်။

Ellipsis က rest parameters ပါတဲ့ function ရဲ့ type ထဲမှာလည်း သုံးပါတယ်:

```ts twoslash
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## `this`

JavaScript မှာ `this` ကို ဘယ်လို သုံးရမလဲ သင်ယူရတာက — မဖြစ်မနေ ဖြတ်သန်းရတဲ့ အဆင့်တစ်ခုလိုပါပဲ။ TypeScript က JavaScript ရဲ့ superset တစ်ခုဖြစ်တာမို့ — TypeScript developer တွေလည်း `this` ကို ဘယ်လို သုံးရမလဲ၊ မှားယွင်းစွာ သုံးနေတာကို ဘယ်လို ရှာဖွေရမလဲဆိုတာ သင်ယူထားဖို့ လိုပါတယ်။ ကံကောင်းတာက TypeScript က `this` ကို မှားယွင်းစွာ သုံးတာတွေကို နည်းစနစ်တစ်ချို့နဲ့ ဖမ်းမိစေနိုင်ပါတယ်။ ဒါပေမယ့် JavaScript မှာ `this` က ဘယ်လို အလုပ်လုပ်လဲဆိုတာ သင်ယူဖို့ လိုသေးရင်တော့ — Yehuda Katz ရဲ့ [JavaScript Function Invocation နဲ့ "this" ကို နားလည်ခြင်း](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) ကို အရင်ဆုံး ဖတ်ကြည့်ပါ။ Yehuda ရဲ့ ဆောင်းပါးက `this` ရဲ့ အတွင်းပိုင်း အလုပ်လုပ်ပုံတွေကို ကောင်းကောင်း ရှင်းပြထားလို့ — ဒီမှာတော့ အခြေခံတွေကိုပဲ ဖော်ပြသွားပါမယ်။

### `this` and arrow functions (`this` နဲ့ Arrow Functions များ)

JavaScript မှာ `this` က function တစ်ခုကို ခေါ်လိုက်တဲ့အခါ သတ်မှတ်လိုက်တဲ့ variable တစ်ခုပါ။ ဒါက အလွန် အားကောင်းပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိတဲ့ feature တစ်ခု ဖြစ်စေပေမယ့် — function တစ်ခု run လုပ်နေတဲ့ context (နောက်ခံ အခြေအနေ) အကြောင်းကို အမြဲ သိထားရတဲ့ စရိတ်နဲ့အတူ လာပါတယ်။ ဒါက အထူးသဖြင့် function တစ်ခုကို ပြန်ပေးတဲ့အခါ ဒါမှမဟုတ် function တစ်ခုကို argument အနေနဲ့ ပို့လိုက်တဲ့အခါ — နာမည်ကြီးလောက်အောင် ရှုပ်ထွေးစေတတ်ပါတယ်။

ဥပမာတစ်ခုကို ကြည့်ရအောင်:

```ts twoslash
// @strict: false
let deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function () {
    return function () {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

`createCardPicker` က function တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုဖြစ်တာ သတိပြုပါ။ ဥပမာကို run လုပ်ကြည့်ရင် — မျှော်လင့်ထားတဲ့ alert box အစား error တစ်ခု ရမှာပါ။ အကြောင်းကတော့ `createCardPicker` က ဖန်တီးလိုက်တဲ့ function ထဲမှာ သုံးထားတဲ့ `this` က ကျွန်တော်တို့ရဲ့ `deck` object အစား `window` ကို ညွှန်ပြနေလို့ပါ။ ဒါက `cardPicker()` ကို သူ့ဘာသာ သီးသန့် ခေါ်လိုက်လို့ ဖြစ်တာပါ။ ဒီလို top-level မှာ method syntax မဟုတ်ဘဲ ခေါ်တာမျိုးက `this` အတွက် `window` ကို သုံးပါလိမ့်မယ်။ (မှတ်ချက်: strict mode အောက်မှာတော့ `this` က `window` အစား `undefined` ဖြစ်ပါလိမ့်မယ်)။

နောက်မှ သုံးဖို့ function ကို ပြန်မပေးခင် — function ကို မှန်ကန်တဲ့ `this` နဲ့ bind (ချိတ်ဆက်) ထားဖို့ သေချာစေခြင်းအားဖြင့် ဒါကို ပြင်နိုင်ပါတယ်။ ဒီလိုဆိုရင် — နောက်ပိုင်း ဘယ်လိုပဲ သုံးသုံး — မူလ `deck` object ကို မြင်နိုင်ဆဲ ဖြစ်ပါတယ်။ ဒါလုပ်ဖို့ function expression ကို ECMAScript 6 ရဲ့ arrow syntax သုံးတဲ့ ပုံစံဆီ ပြောင်းလိုက်ပါတယ်။ Arrow functions တွေက function ကို ခေါ်လိုက်တဲ့ နေရာမဟုတ်ဘဲ — function ကို ဖန်တီးလိုက်တဲ့ နေရာက `this` ကို ဖမ်းယူပါတယ်:

```ts twoslash
// @strict: false
let deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function () {
    // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

ပိုကောင်းတာက — ဒီလို အမှားမျိုး လုပ်မိရင် [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) flag ကို compiler ဆီ ပေးထားရင် TypeScript က သတိပေးပါလိမ့်မယ်။ `this.suits[pickedSuit]` ထဲက `this` က type `any` ဖြစ်နေတယ်ဆိုတာကို ထောက်ပြပါလိမ့်မယ်။

### `this` parameters (`this` Parameters များ)

ကံမကောင်းတာက `this.suits[pickedSuit]` ရဲ့ type က `any` ဖြစ်နေဆဲပါ။ အကြောင်းကတော့ `this` က object literal ထဲက function expression ကနေ လာနေလို့ပါ။ ဒါကို ပြင်ဖို့ — explicit (အတိအကျ) `this` parameter တစ်ခု ပေးနိုင်ပါတယ်။ `this` parameters တွေက function တစ်ခုရဲ့ parameter list ထဲမှာ ပထမဆုံး လာတဲ့ fake (အတုအယောင်) parameters တွေပါ:

```ts
function f(this: void) {
  // make sure `this` is unusable in this standalone function
}
```

Types တွေ ပိုရှင်းလင်းပြီး ပြန်သုံးဖို့ လွယ်ကူစေဖို့ — အပေါ်က ဥပမာထဲကို interface နှစ်ခုဖြစ်တဲ့ `Card` နဲ့ `Deck` တွေ ထည့်ကြည့်ရအောင်:

```ts twoslash
interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

အခုတော့ `createCardPicker` က `Deck` object တစ်ခုပေါ်မှာ ခေါ်ခံရဖို့ မျှော်လင့်ထားတယ်ဆိုတာ TypeScript က သိပါပြီ။ ဆိုလိုတာက အခု `this` က `any` မဟုတ်တော့ဘဲ type `Deck` ဖြစ်နေလို့ — [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) က error တစ်ခုမှ ဖြစ်စေတော့မှာ မဟုတ်ပါဘူး။

#### `this` parameters in callbacks (Callbacks ထဲက `this` Parameters များ)

နောက်ပိုင်းမှာ ပြန်ခေါ်ပေးမယ့် library တစ်ခုဆီ functions တွေ ပို့တဲ့အခါ — callbacks တွေထဲမှာ `this` နဲ့ ပတ်သက်ပြီး errors တွေလည်း ကြုံရနိုင်ပါတယ်။ ကိုယ့် callback ကို ခေါ်တဲ့ library က သာမန် function တစ်ခုလို ခေါ်မှာမို့ — `this` က `undefined` ဖြစ်နေပါလိမ့်မယ်။ အားထုတ်မှု နည်းနည်းနဲ့ `this` parameters တွေကို သုံးပြီး callbacks တွေမှာ ဖြစ်တတ်တဲ့ errors တွေကိုလည်း ကာကွယ်နိုင်ပါတယ်။ ပထမဆုံး — library ရေးသူ (author) က callback ရဲ့ type ကို `this` နဲ့ annotate (မှတ်သား) လုပ်ပေးဖို့ လိုပါတယ်:

```ts twoslash
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

`this: void` ဆိုတာ `addClickListener` က `onclick` ကို — `this` type တစ်ခု မလိုအပ်တဲ့ function တစ်ခုအနေနဲ့ မျှော်လင့်တယ်လို့ ဆိုလိုပါတယ်။ ဒုတိယ — ကိုယ့်ရဲ့ ခေါ်သုံးတဲ့ code ကိုလည်း `this` နဲ့ annotate လုပ်ပါ:

```ts twoslash
// @strict: false
// @errors: 2345
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
interface Event {
  message: string;
}
declare const uiElement: UIElement;
// ---cut---
class Handler {
  info: string;
  onClickBad(this: Handler, e: Event) {
    // oops, used `this` here. using this callback would crash at runtime
    this.info = e.message;
  }
}

let h = new Handler();
uiElement.addClickListener(h.onClickBad); // error!
```

`this` ကို annotate လုပ်ထားတာနဲ့ — `onClickBad` ကို `Handler` ရဲ့ instance တစ်ခုပေါ်မှာ ခေါ်ရမယ်ဆိုတာ အတိအကျ ဖော်ပြလိုက်တာပါ။ ဒါဆိုရင် `addClickListener` က `this: void` ရှိတဲ့ function တစ်ခု လိုအပ်တယ်ဆိုတာကို TypeScript က ရှာဖွေ တွေ့ရှိပါလိမ့်မယ်။ Error ကို ပြင်ဖို့ `this` ရဲ့ type ကို ပြောင်းလိုက်ပါ:

```ts twoslash
// @strict: false
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
interface Event {
  message: string;
}
declare const uiElement: UIElement;
// ---cut---
class Handler {
  info: string;
  onClickGood(this: void, e: Event) {
    // can't use `this` here because it's of type void!
    console.log("clicked!");
  }
}

let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

`onClickGood` က သူ့ရဲ့ `this` type ကို `void` လို့ သတ်မှတ်ထားတာမို့ — `addClickListener` ဆီ ပို့တာ တရားဝင် (legal) ပါ။ ဒါကြောင့် သဘာဝကျတာက — `this.info` ကိုတော့ သူ သုံးလို့ မရတော့ပါဘူး။ နှစ်ခုလုံး လိုချင်ရင်တော့ arrow function တစ်ခုကို သုံးရပါလိမ့်မယ်:

```ts twoslash
// @strict: false
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
interface Event {
  message: string;
}
declare const uiElement: UIElement;
// ---cut---
class Handler {
  info: string;
  onClickGood = (e: Event) => {
    this.info = e.message;
  };
}
```

Arrow functions တွေက အပြင်ဘက်က `this` ကို သုံးတာမို့ — `this: void` ကို မျှော်လင့်တဲ့ နေရာဆီ အမြဲတမ်း ပို့လို့ရတာကြောင့် ဒါက အလုပ်လုပ်ပါတယ်။ အားနည်းချက်ကတော့ — Handler type ရဲ့ object တစ်ခုစီအတွက် arrow function တစ်ခုစီ ဖန်တီးခံရတာပါ။ Methods တွေကတော့ — တစ်ကြိမ်ပဲ ဖန်တီးပြီး Handler ရဲ့ prototype ပေါ်မှာ တွဲထားလို့ — Handler type ရဲ့ object အားလုံးကြားမှာ မျှဝေသုံးပါတယ်။

## Overloads (Overloads များ)

JavaScript က သဘာဝအရ တော်တော် dynamic (ပြောင်းလွယ်ပြင်လွယ်) ရှိတဲ့ language တစ်ခုပါ။ JavaScript function တစ်ခုတည်းက — ပို့လိုက်တဲ့ arguments တွေရဲ့ ပုံသဏ္ဌာန်ပေါ် မူတည်ပြီး — object type အမျိုးမျိုး ပြန်ပေးတာဟာ မဆန်းပါဘူး။

```ts twoslash
// @strict: false
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];

let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

ဒီမှာ `pickCard` function က — user ပို့လိုက်တဲ့အရာပေါ် မူတည်ပြီး — မတူညီတဲ့ အရာနှစ်မျိုး ပြန်ပေးပါလိမ့်မယ်။ User က deck ကို ကိုယ်စားပြုတဲ့ object တစ်ခု ပို့လိုက်ရင် — function က card တစ်ခုကို ရွေးပေးပါလိမ့်မယ်။ User က card နံပါတ်တစ်ခု ရွေးလိုက်ရင်တော့ — သူတို့ ဘယ် card ရွေးမိလဲဆိုတာကို ပြောပြပေးပါတယ်။ ဒါပေမယ့် ဒါကို type system ကို ဘယ်လို ဖော်ပြမလဲ?

အဖြေကတော့ — function တစ်ခုတည်းအတွက် function types အများအပြားကို overloads (ထပ်ဆင့် သတ်မှတ်ချက်များ) စာရင်းတစ်ခုအနေနဲ့ ပေးအပ်တာပါ။ ဒီစာရင်းက function calls တွေကို ဖြေရှင်းဖို့ compiler က သုံးမယ့်အရာပါ။ ကျွန်တော်တို့ရဲ့ `pickCard` က ဘာတွေ လက်ခံလဲ၊ ဘာတွေ ပြန်ပေးလဲဆိုတာကို ဖော်ပြတဲ့ overloads စာရင်းတစ်ခု ဖန်တီးကြည့်ရအောင်။

```ts twoslash
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];

let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

ဒီပြောင်းလဲမှုနဲ့အတူ — overloads တွေက အခု `pickCard` function ဆီ type-checked (type စစ်ဆေးပြီးသား) ခေါ်ဆိုမှုတွေကို ပေးစွမ်းနိုင်ပါပြီ။

Compiler က မှန်ကန်တဲ့ type check ကို ရွေးချယ်ဖို့ — နောက်ခံ JavaScript ရဲ့ လုပ်ငန်းစဉ်နဲ့ ဆင်တူတဲ့ လုပ်ငန်းစဉ်တစ်ခုကို လိုက်နာပါတယ်။ Overload list ကို ကြည့်ပြီး — ပထမ overload ကနေ စတင်ကာ — ပေးထားတဲ့ parameters တွေနဲ့ function ကို ခေါ်ဖို့ ကြိုးစားပါတယ်။ ကိုက်ညီမှုတစ်ခု တွေ့ရင် — အဲဒီ overload ကို မှန်ကန်တဲ့ overload အဖြစ် ရွေးချယ်ပါတယ်။ ဒါကြောင့် overloads တွေကို အသေးစိတ် အကျဆုံးကနေ အသေးစိတ် အနည်းဆုံးအထိ စီစဉ်ထားတာ ထုံးစံပါ။

`function pickCard(x): any` ဆိုတဲ့ အပိုင်းက overload list ရဲ့ အစိတ်အပိုင်း မဟုတ်တာ သတိပြုပါ — ဒါကြောင့် overload နှစ်ခုပဲ ရှိပါတယ်: object တစ်ခုကို လက်ခံတဲ့ဟာ တစ်ခုနဲ့ number တစ်ခုကို လက်ခံတဲ့ဟာ တစ်ခုပါ။ တခြား parameter types တွေနဲ့ `pickCard` ကို ခေါ်ရင်တော့ error တစ်ခု ဖြစ်စေပါလိမ့်မယ်။
