---
title: "Variable Declarations (Variable ကြေညာချက်များ)"
description: "`var` ၊ `let` နဲ့ `const` declarations တွေအကြောင်း အပြည့်အစုံ — scoping rules, variable capturing, block-scoping, shadowing, `let` vs. `const` ရွေးချယ်မှု, destructuring, spread, `using` နဲ့ `await using` declarations တို့ ပါဝင်သည်"
order: 67
source: "https://www.typescriptlang.org/docs/handbook/variable-declarations.html"
status: translated
updated: 2026-09-05
---

`let` နဲ့ `const` တို့က JavaScript မှာ variable declarations တွေအတွက် အတော်လေး အသစ်ဖြစ်တဲ့ အယူအဆ နှစ်ခု ဖြစ်ပါတယ်။ [အစောက ဖော်ပြခဲ့သလိုပဲ](https://www.typescriptlang.org/docs/handbook/basic-types.html) — `let` က `var` နဲ့ အချို့သော အချက်တွေမှာ ဆင်တူပေမယ့် — JavaScript မှာ user တွေ မကြာခဏ ကြုံရလေ့ရှိတဲ့ သာမန် "gotchas" (မထင်မှတ်တဲ့ ပြဿနာများ) တစ်ချို့ကို ရှောင်ရှားနိုင်အောင် ကူညီပေးပါတယ်။

`const` ကတော့ `let` ရဲ့ တိုးချဲ့ထားသော (augmentation) ပုံစံတစ်ခု ဖြစ်ပြီး — variable တစ်ခုကို ပြန်လည် သတ်မှတ် (re-assign) လုပ်ခြင်းကို တားဆီးပေးပါတယ်။

TypeScript က JavaScript ရဲ့ extension တစ်ခု ဖြစ်တာမို့ — language အနေနဲ့ `let` နဲ့ `const` တို့ကို သဘာဝကျကျ ထောက်ပံ့ပေးပါတယ်။ ဒီမှာတော့ ဒီ declarations အသစ်တွေအကြောင်းနဲ့ — သူတို့က `var` ထက် ဘာကြောင့် ပိုပြီး နှစ်သက်ဖွယ် ကောင်းသလဲဆိုတာကို အသေးစိတ် ရှင်းပြသွားပါမယ်။

သင်က JavaScript ကို ပေါ့ပေါ့ပါးပါးပဲ သုံးဖူးတယ်ဆိုရင် — နောက် section က သင့်ရဲ့ မှတ်ဉာဏ်ကို ပြန်လန်းဆန်းစေဖို့ နည်းလမ်းကောင်းတစ်ခု ဖြစ်နိုင်ပါတယ်။ JavaScript ထဲက `var` declarations တွေရဲ့ ထူးဆန်းချက်အားလုံးကို သေချာ နားလည်ထားပြီးသားဆိုရင်တော့ — ရှေ့ကို ကျော်သွားတာက ပိုအဆင်ပြေပါလိမ့်မယ်။

## `var` declarations (`var` ကြေညာချက်များ)

JavaScript မှာ variable တစ်ခုကို ကြေညာတာက — အစဉ်အလာအားဖြင့် — `var` keyword နဲ့ပဲ လုပ်ခဲ့ကြပါတယ်။

```ts
var a = 10;
```

သင်မှန်းဆထားသလိုပဲ — အခုနက `a` လို့ နာမည်ရှိတဲ့ — value `10` ပါတဲ့ variable တစ်ခုကို ကြေညာလိုက်တာ ဖြစ်ပါတယ်။

function တစ်ခုရဲ့ အတွင်းမှာလည်း variable တစ်ခုကို ကြေညာနိုင်ပါတယ်:

```ts
function f() {
  var message = "Hello, world!";

  return message;
}
```

ပြီးတော့ အဲဒီ variable တွေကိုပဲ တခြား functions တွေထဲကနေလည်း ဝင်ရောက် အသုံးပြုနိုင်ပါတယ်:

```ts
function f() {
  var a = 10;
  return function g() {
    var b = a + 1;
    return b;
  };
}

var g = f();
g(); // returns '11'
```

အပေါ်က ဥပမာမှာ — `g` က `f` ထဲမှာ ကြေညာထားတဲ့ `a` ဆိုတဲ့ variable ကို capture (ဖမ်းယူ) လုပ်ထားပါတယ်။ `g` ကို ခေါ်လိုက်တဲ့ အချိန်တိုင်းမှာ — `a` ရဲ့ value က `f` ထဲက `a` ရဲ့ value နဲ့ ချိတ်ဆက်နေမှာ ဖြစ်ပါတယ်။ `f` က run ပြီးသွားပြီးမှ `g` ကို ခေါ်ရင်တောင် — `a` ကို ဝင်ရောက် အသုံးပြုနိုင်ပြီး ပြုပြင်လို့လည်း ရနေဦးမှာ ဖြစ်ပါတယ်။

```ts
function f() {
  var a = 1;

  a = 2;
  var b = g();
  a = 3;

  return b;

  function g() {
    return a;
  }
}

f(); // returns '2'
```

### Scoping rules (Scope ဆိုင်ရာ စည်းမျဉ်းများ)

`var` declarations တွေမှာ — တခြား languages တွေနဲ့ အကျွမ်းတဝင် ရှိသူတွေအတွက် — ထူးဆန်းတဲ့ scoping rules တစ်ချို့ ရှိပါတယ်။ အောက်ပါ ဥပမာကို ကြည့်ပါ:

```ts
function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
    var x = 10;
  }

  return x;
}

f(true); // returns '10'
f(false); // returns 'undefined'
```

ဒီ ဥပမာကို ကြည့်ပြီး တစ်ချို့ စာဖတ်သူတွေ နှစ်ခါ ပြန်ကြည့်မိနိုင်ပါတယ်။ `x` ဆိုတဲ့ variable ကို _`if` block ရဲ့ အတွင်းမှာ_ ကြေညာထားပေမယ့် — အဲဒီ block ရဲ့ အပြင်ကနေ ဝင်ရောက် အသုံးပြုနိုင်ခဲ့ပါတယ်။ ဘာလို့လဲဆိုတော့ — `var` declarations တွေက ၎င်းတို့ ပါဝင်နေတဲ့ function ၊ module ၊ namespace ဒါမှမဟုတ် global scope — ဘယ်နေရာမှာပဲ ဖြစ်ဖြစ် — ပါဝင်နေတဲ့ block ကို မသက်ဆိုင်ဘဲ — တစ်နေရာရာကနေ ဝင်ရောက် အသုံးပြုလို့ ရလို့ပါ (ဒါတွေအားလုံးကို နောက်မှာ ဆက်ပြီး လေ့လာပါမယ်)။ တစ်ချို့က ဒါကို _`var`-scoping_ ဒါမှမဟုတ် _function-scoping_ လို့ ခေါ်ပါတယ်။ Parameters တွေလည်း function scoped ပဲ ဖြစ်ပါတယ်။

ဒီ scoping rules တွေက အမှားအမျိုးမျိုး ဖြစ်စေနိုင်ပါတယ်။ သူတို့ ပိုဆိုးအောင် လုပ်ပေးနိုင်တဲ့ ပြဿနာတစ်ခုက — variable တစ်ခုတည်းကို အကြိမ်ကြိမ် ကြေညာတာက error မဟုတ်ဘူးဆိုတဲ့ အချက်ပါ:

```ts
function sumMatrix(matrix: number[][]) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (var i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }

  return sum;
}
```

အတွေ့အကြုံရှိတဲ့ JavaScript developer တစ်ချို့အတွက်တော့ ဒါက လွယ်လွယ်နဲ့ မြင်မိနိုင်ပေမယ့် — inner `for`-loop က `i` ဆိုတဲ့ variable ကို မတော်တဆ overwrite (ပြန်ရေးထား) လုပ်ပစ်မှာ ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ `i` နှစ်ခုလုံးက function-scoped variable တစ်ခုတည်းကို ရည်ညွှန်းနေလို့ပါ။ အတွေ့အကြုံရှိတဲ့ developers တွေ သိကြတဲ့အတိုင်းပဲ — အလားတူ bug မျိုးတွေက code reviews တွေကို ဖြတ်ကျော်ပြီး — မကုန်နိုင်တဲ့ စိတ်ပျက်စရာ အရင်းအမြစ်တစ်ခု ဖြစ်နေတတ်ပါတယ်။

### Variable capturing quirks (Variable Capturing ထူးဆန်းချက်များ)

အောက်ပါ snippet ရဲ့ output က ဘာဖြစ်မလဲ — ခဏလေး စဉ်းစားကြည့်ပါ:

```ts
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
```

မရင်းနှီးသေးသူတွေအတွက် ရှင်းပြရရင် — `setTimeout` က milliseconds အရေအတွက် တစ်ခု ကုန်သွားတဲ့အခါ function တစ်ခုကို execute လုပ်ဖို့ ကြိုးစားပါတယ် (တခြားအရာတွေ run ပြီးတဲ့အထိ စောင့်ပေးတာမျိုးတော့ မဟုတ်ပါဘူး)။

အဆင်သင့်လား? ကြည့်လိုက်ရအောင်:

```
10
10
10
10
10
10
10
10
10
10
```

JavaScript developer အများစုက ဒီအပြုအမူကို ရင်းနှီးစွာ သိကြပါတယ် — ဒါပေမယ့် သင်အံ့သြသွားတယ်ဆိုရင်လည်း — သင်တစ်ယောက်တည်း မဟုတ်ပါဘူး။ လူအများစုက output ကို အောက်ပါအတိုင်း ဖြစ်မယ်လို့ မျှော်လင့်ကြပါတယ်

```
0
1
2
3
4
5
6
7
8
9
```

variable capturing အကြောင်း အစောက ပြောခဲ့တာ မှတ်မိကြလား? ကျွန်တော်တို့ `setTimeout` ဆီ ပေးပို့လိုက်တဲ့ function expression တိုင်းက — တကယ်တော့ — scope တစ်ခုတည်းက `i` တစ်ခုတည်းကိုပဲ ရည်ညွှန်းနေပါတယ်။

ဒါက ဘာကို ဆိုလိုလဲဆိုတာ ခဏလေး စဉ်းစားကြည့်ရအောင်။ `setTimeout` က milliseconds အရေအတွက် တစ်ခု ကုန်သွားတဲ့အခါ function တစ်ခုကို run လုပ်မှာ ဖြစ်ပေမယ့် — _`for` loop က run လုပ်ပြီးသွားမှသာ_ ဖြစ်ပါတယ်; `for` loop က run လုပ်ပြီးသွားတဲ့အချိန်မှာတော့ — `i` ရဲ့ value က `10` ဖြစ်နေပါပြီ။ ဒါကြောင့် ပေးလိုက်တဲ့ function ကို ခေါ်လိုက်တိုင်း — `10` ကိုပဲ print ထုတ်မှာ ဖြစ်ပါတယ်!

အသုံးများတဲ့ ဖြေရှင်းနည်းတစ်ခုကတော့ — IIFE (Immediately Invoked Function Expression — ကြေညာပြီးချင်း ချက်ချင်း ခေါ်ဆိုသော function expression) တစ်ခုကို သုံးပြီး — iteration တစ်ခုချင်းစီမှာ `i` ကို capture လုပ်တာ ဖြစ်ပါတယ်:

```ts
for (var i = 0; i < 10; i++) {
  // capture the current state of 'i'
  // by invoking a function with its current value
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 100 * i);
  })(i);
}
```

ဒီထူးဆန်းပုံရတဲ့ pattern က တကယ်တော့ အတော်လေး အသုံးများပါတယ်။ Parameter list ထဲက `i` က `for` loop ထဲမှာ ကြေညာထားတဲ့ `i` ကို shadow (ဖုံးလွှမ်း) လုပ်ပါတယ် — ဒါပေမယ့် နှစ်ခုလုံးကို နာမည်တူ ပေးထားလို့ — loop body ကို သိပ်ပြီး ပြုပြင်စရာ မလိုခဲ့ပါဘူး။

## `let` declarations (`let` ကြေညာချက်များ)

ဒီအထိ ကြည့်ပြီးတဲ့အခါ — `var` မှာ ပြဿနာတစ်ချို့ ရှိတယ်ဆိုတာ သင်နားလည်လောက်ပါပြီ — အဲဒါကြောင့်ပဲ `let` statements တွေကို မိတ်ဆက်ခဲ့တာ ဖြစ်ပါတယ်။ သုံးတဲ့ keyword ကလွဲလို့ — `let` statements တွေက `var` statements တွေလိုပဲ ရေးသားပါတယ်။

```ts
let hello = "Hello!";
```

အဓိက ကွာခြားချက်က syntax ထဲမှာ မဟုတ်ဘဲ — semantics (အဓိပ္ပာယ်ဖွင့်ဆိုချက်) ထဲမှာ ဖြစ်ပါတယ် — အခု အဲဒါကို အသေးစိပ်လေး လေ့လာကြည့်ကြရအောင်။

### Block-scoping (Block အလိုက် Scope သတ်မှတ်ခြင်း)

`let` ကို သုံးပြီး variable တစ်ခုကို ကြေညာတဲ့အခါ — တစ်ချို့က _lexical-scoping_ ဒါမှမဟုတ် _block-scoping_ လို့ ခေါ်တဲ့ စနစ်ကို အသုံးပြုပါတယ်။ `var` နဲ့ ကြေညာထားတဲ့ variables တွေရဲ့ scopes တွေက ၎င်းတို့ ပါဝင်နေတဲ့ function တစ်ခုလုံးကို သက်ရောက်သွားတတ်ပေမယ့် — block-scoped variables တွေကတော့ သူတို့ ပါဝင်နေတဲ့ အနီးဆုံး block ဒါမှမဟုတ် `for`-loop ရဲ့ အပြင်ဘက်မှာ မမြင်နိုင်ပါဘူး။

```ts
function f(input: boolean) {
  let a = 100;

  if (input) {
    // Still okay to reference 'a'
    let b = a + 1;
    return b;
  }

  // Error: 'b' doesn't exist here
  return b;
}
```

ဒီမှာ local variables နှစ်ခု — `a` နဲ့ `b` — ရှိပါတယ်။ `a` ရဲ့ scope က `f` ရဲ့ body ထဲပဲ ကန့်သတ်ထားပြီး — `b` ရဲ့ scope ကတော့ ၎င်း ပါဝင်နေတဲ့ `if` statement ရဲ့ block ထဲပဲ ကန့်သတ်ပါတယ်။

`catch` clause တစ်ခုထဲမှာ ကြေညာထားတဲ့ variables တွေမှာလည်း အလားတူ scoping rules တွေ ရှိပါတယ်။

```ts
try {
  throw "oh no!";
} catch (e) {
  console.log("Oh well.");
}

// Error: 'e' doesn't exist here
console.log(e);
```

Block-scoped variables တွေရဲ့ နောက်ထပ် ဂုဏ်သတ္တိတစ်ခုက — သူတို့ကို တကယ် ကြေညာခြင်း မပြုမီ — ဖတ်လို့ရော ရေးလို့ပါ မရပါဘူး။ ဒီ variables တွေက သူတို့ရဲ့ scope တစ်လျှောက်လုံးမှာ "တည်ရှိနေ" ပေမယ့် — ကြေညာချက် မတိုင်ခင် အချက်အားလုံးက သူတို့ရဲ့ _temporal dead zone_ (ယာယီ မလှုပ်ရှားနိုင်သော ဇုန်) ရဲ့ အစိတ်အပိုင်း ဖြစ်ပါတယ်။ ဒါက `let` statement မတိုင်ခင် ဒီ variables တွေကို ဝင်ရောက်လို့ မရဘူးလို့ — နည်းနည်း ပညာရပ်ဆန်ဆန် ပြောထားတာပဲ ဖြစ်ပြီး — ကံကောင်းချင်တော့ TypeScript က အဲဒါကို သင့်ကို အသိပေးပါလိမ့်မယ်။

```ts
a++; // illegal to use 'a' before it's declared;
let a;
```

သတိပြုစရာတစ်ခုက — block-scoped variable တစ်ခုကို မကြေညာခင် _capture_ လုပ်ထားတာကတော့ ရပါသေးတယ်။ တစ်ခုတည်းသော ကန့်သတ်ချက်က — အဲဒီ function ကို ကြေညာချက် မတိုင်ခင် ခေါ်တာက တရားမဝင်တာ ဖြစ်ပါတယ်။ ES2015 ကို ရည်ရွယ်ထားရင် — ခေတ်မီ runtime တစ်ခုက error တစ်ခု ပစ်မှာ ဖြစ်ပေမယ့် — လောလောဆယ်မှာတော့ TypeScript က လိုက်လျောပေးထားပြီး ဒါကို error အနေနဲ့ မပြပါဘူး။

```ts
function foo() {
  // okay to capture 'a'
  return a;
}

// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
foo();

let a;
```

Temporal dead zones အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် — [Mozilla Developer Network](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let) ပေါ်က သက်ဆိုင်ရာ content တွေကို ကြည့်ပါ။

### Re-declarations and Shadowing (ပြန်လည်ကြေညာခြင်းနှင့် Shadowing)

`var` declarations တွေနဲ့ဆိုရင် — variable တွေကို အကြိမ်ဘယ်လောက်ပဲ ကြေညာကြေညာ — ကိစ္စမရှိဘူးလို့ အစောက ပြောခဲ့ပါတယ်; နောက်ဆုံးမှာတော့ variable တစ်ခုပဲ ရှိမှာ ဖြစ်ပါတယ်။

```ts
function f(x) {
  var x;
  var x;

  if (true) {
    var x;
  }
}
```

အပေါ်က ဥပမာမှာ — `x` ရဲ့ ကြေညာချက်အားလုံးက တကယ်တော့ _တူညီတဲ့_ `x` တစ်ခုကိုပဲ ရည်ညွှန်းပြီး — ဒါက လုံးဝ မှန်ကန်ပါတယ်။ ဒါမျိုးက မကြာခဏဆိုသလို bug တွေရဲ့ အရင်းအမြစ် ဖြစ်လာတတ်ပါတယ်။ ကံကောင်းချင်တော့ — `let` declarations တွေကတော့ ဒီလောက် ခွင့်လွှတ်မပေးပါဘူး။

```ts
let x = 10;
let x = 20; // error: can't re-declare 'x' in the same scope
```

TypeScript က ပြဿနာရှိတယ်လို့ ပြောပြဖို့ — variable နှစ်ခုလုံး block-scoped ဖြစ်နေဖို့တော့ မလိုအပ်ပါဘူး။

```ts
function f(x) {
  let x = 100; // error: interferes with parameter declaration
}

function g() {
  let x = 100;
  var x = 100; // error: can't have both declarations of 'x'
}
```

ဒါက block-scoped variable တစ်ခုကို function-scoped variable တစ်ခုနဲ့ ဘယ်တော့မှ အတူတူ ကြေညာလို့ မရဘူးလို့ ဆိုလိုတာ မဟုတ်ပါဘူး။ Block-scoped variable က ရှင်းရှင်းလင်းလင်း ကွဲပြားတဲ့ block တစ်ခုအတွင်းမှာ ကြေညာထားဖို့ပဲ လိုပါတယ်။

```ts
function f(condition, x) {
  if (condition) {
    let x = 100;
    return x;
  }

  return x;
}

f(false, 0); // returns '0'
f(true, 0); // returns '100'
```

ပိုနက်ရှိုင်းတဲ့ (more nested) scope တစ်ခုထဲမှာ နာမည်အသစ်တစ်ခုကို မိတ်ဆက်လိုက်တဲ့ အပြုအမူကို _shadowing_ လို့ ခေါ်ပါတယ်။ ဒါက သန်လျက်နှစ်ဖက် (double-edged sword) သဘောမျိုး ရှိပါတယ် — မတော်တဆ shadowing ဖြစ်သွားရင် bug တစ်ချို့ကို ကိုယ်တိုင် ဖန်တီးမိနိုင်သလို — တချို့ bug တွေကိုလည်း တားဆီးပေးနိုင်လို့ပါ။ ဥပမာ — အစောက ရေးခဲ့တဲ့ `sumMatrix` function ကို `let` variables တွေနဲ့ ရေးထားတယ်လို့ စိတ်ကူးကြည့်ပါ။

```ts
function sumMatrix(matrix: number[][]) {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (let i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }

  return sum;
}
```

ဒီ loop version ကတော့ ပေါင်းခြင်းကို မှန်မှန်ကန်ကန် လုပ်ဆောင်နိုင်မှာ ဖြစ်ပါတယ် — ဘာလို့လဲဆိုတော့ inner loop ရဲ့ `i` က outer loop ကနေ လာတဲ့ `i` ကို shadow လုပ်လိုက်လို့ပါ။

Shadowing ကို — ပိုရှင်းလင်းတဲ့ code တွေ ရေးနိုင်ဖို့ — _ယေဘုယျအားဖြင့်_ ရှောင်သင့်ပါတယ်။ အဲဒါကို အခွင့်ကောင်းယူဖို့ သင့်လျော်တဲ့ အခြေအနေတစ်ချို့ ရှိနိုင်ပေမယ့် — သင့်ရဲ့ အကောင်းဆုံး ဆုံးဖြတ်ချက်ကို သုံးသင့်ပါတယ်။

### Block-scoped variable capturing (Block-scoped Variable များကို ဖမ်းယူခြင်း)

`var` declaration တွေနဲ့ variable capturing အကြောင်း ပထမဆုံး ထိတွေ့ခဲ့တုန်းက — variable တွေ capture လုပ်ခံရပြီးတဲ့အခါ ဘယ်လို ပြုမူလဲဆိုတာကို အကျဉ်းချုပ် ကြည့်ခဲ့ပါတယ်။ ဒါကို ပိုပြီး နားလည်လွယ်အောင် ပြောရရင် — scope တစ်ခု run လုပ်တိုင်း — variable တွေရဲ့ "environment" (ပတ်ဝန်းကျင်) တစ်ခုကို ဖန်တီးပါတယ်။ အဲဒီ environment နဲ့ ၎င်းရဲ့ capture လုပ်ထားတဲ့ variables တွေဟာ — scope ထဲက အရာအားလုံး run ပြီးသွားပြီးတဲ့ အချိန်မှာတောင် — ဆက်ပြီး တည်ရှိနေနိုင်ပါတယ်။

```ts
function theCityThatAlwaysSleeps() {
  let getCity;

  if (true) {
    let city = "Seattle";
    getCity = function () {
      return city;
    };
  }

  return getCity();
}
```

`city` ကို ၎င်းရဲ့ environment ထဲကနေ capture လုပ်ထားလို့ — `if` block က run ပြီးသွားပြီ ဖြစ်ပေမယ့် — ကျွန်တော်တို့ ဆက်ပြီး ဝင်ရောက် အသုံးပြုနိုင်ပါသေးတယ်။

အစောက `setTimeout` ဥပမာမှာ — `for` loop ရဲ့ iteration တိုင်းအတွက် variable တစ်ခုရဲ့ state ကို capture လုပ်ဖို့ IIFE တစ်ခု သုံးခဲ့ရတာ မှတ်မိကြမယ် ထင်ပါတယ်။ လက်တွေ့မှာ ကျွန်တော်တို့ လုပ်နေတာက — capture လုပ်ထားတဲ့ variables တွေအတွက် variable environment အသစ်တစ်ခုစီ ဖန်တီးနေတာ ဖြစ်ပါတယ်။ အဲဒါက နည်းနည်း ဒုက္ခပေးစရာ ကောင်းပေမယ့် — ကံကောင်းချင်တော့ TypeScript မှာတော့ ဒီလို ဘယ်တော့မှ ပြန်လုပ်စရာ မလိုတော့ပါဘူး။

`let` declarations တွေက loop တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ ကြေညာလိုက်တဲ့အခါ — သိသိသာသာ ကွဲပြားတဲ့ အပြုအမူတွေ ရှိပါတယ်။ ဒီ declarations တွေက loop ကိုယ်တိုင်အတွက် environment အသစ်တစ်ခုပဲ မိတ်ဆက်ပေးတာ မဟုတ်ဘဲ — _iteration တစ်ခုချင်းစီမှာ_ scope အသစ်တစ်ခုစီ ဖန်တီးပေးတာမျိုး လုပ်ပါတယ်။ ဒါက ကျွန်တော်တို့ IIFE နဲ့ လုပ်နေခဲ့တာနဲ့ အတူတူပဲ ဖြစ်တာမို့ — အစောက `setTimeout` ဥပမာကို `let` declaration တစ်ခုတည်းနဲ့ပဲ ပြောင်းသုံးလို့ရပါတယ်။

```ts
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
```

ပြီးတော့ မျှော်လင့်ထားသလိုပဲ — ဒါက အောက်ပါအတိုင်း print ထုတ်ပါလိမ့်မယ်

```
0
1
2
3
4
5
6
7
8
9
```

## `const` declarations (`const` ကြေညာချက်များ)

`const` declarations တွေကလည်း variables တွေကို ကြေညာဖို့ နောက်ထပ် နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။

```ts
const numLivesForCat = 9;
```

သူတို့က `let` declarations တွေနဲ့ တူပေမယ့် — နာမည်အတိုင်းပဲ — တစ်ခါ bind (ချိတ်ဆက်) လုပ်လိုက်ပြီဆိုရင် သူတို့ရဲ့ value ကို ပြောင်းလဲလို့ မရတော့ပါဘူး။ တစ်နည်းပြောရရင် — `let` နဲ့ အတူတူ scoping rules တွေ ရှိပေမယ့် — ပြန်ပြီး re-assign လုပ်လို့ မရတာပါ။

ဒါက — သူတို့ ရည်ညွှန်းနေတဲ့ values တွေက _immutable_ (မပြောင်းလဲနိုင်) တယ်ဆိုတဲ့ အယူအဆနဲ့တော့ မရောထွေးသင့်ပါဘူး။

```ts
const numLivesForCat = 9;
const kitty = {
  name: "Aurora",
  numLives: numLivesForCat,
};

// Error
kitty = {
  name: "Danielle",
  numLives: numLivesForCat,
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

ဒါကို ရှောင်ဖို့ တိကျတဲ့ နည်းလမ်းတွေ မသုံးထားဘူးဆိုရင် — `const` variable တစ်ခုရဲ့ internal state ကို ဆက်ပြီး ပြုပြင်လို့ ရနေပါသေးတယ်။ ကံကောင်းချင်တော့ — TypeScript က object တစ်ခုရဲ့ members တွေကို `readonly` အဖြစ် သတ်မှတ်ခွင့် ပြုပါတယ်။ အသေးစိတ် အချက်အလက်တွေကို [Interfaces အကြောင်း အခန်း](https://www.typescriptlang.org/docs/handbook/interfaces.html) မှာ ကြည့်ပါ။

## `let` vs. `const` (`let` နဲ့ `const` နှိုင်းယှဉ်ခြင်း)

Scoping semantics ဆင်တူတဲ့ declaration အမျိုးအစား နှစ်ခု ရှိနေတော့ — ဘယ်ဟာကို သုံးသင့်လဲဆိုတဲ့ မေးခွန်း ကိုယ့်ကိုယ်ကို မေးမိတာ သဘာဝပါပဲ။ ကျယ်ပြန့်တဲ့ မေးခွန်းအများစုလိုပဲ — အဖြေကတော့: အခြေအနေပေါ် မူတည်ပါတယ်။

[Principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege) (အနည်းဆုံး အခွင့်အရေးပေးခြင်း သဘောတရား) ကို ကျင့်သုံးမယ်ဆိုရင် — သင်ပြုပြင်ဖို့ ရည်ရွယ်ထားတာတွေကလွဲလို့ — ကျန် declarations တွေ အားလုံးမှာ `const` ကို သုံးသင့်ပါတယ်။

ဒီနောက်ကွယ်က ဆင်ခြင်ချက်ကတော့ — variable တစ်ခုကို ပြန်ရေးဖို့ မလိုအပ်ဘူးဆိုရင် — တူညီတဲ့ codebase မှာ အလုပ်လုပ်နေတဲ့ တခြားသူတွေက အဲဒီ variable ကို အလိုအလျောက် ပြန်ရေးလို့ မဖြစ်သင့်ဘဲ — variable ကို တကယ် reassign လုပ်ဖို့ လိုသလားဆိုတာကို စဉ်းစားစေချင်တာပါ။

`const` ကို သုံးခြင်းက — data တွေရဲ့ စီးဆင်းမှုအကြောင်း ဆင်ခြင်တဲ့အခါ — code ကို ပိုပြီး ခန့်မှန်းရလွယ်ကူစေပါတယ်။

သင့်ရဲ့ အကောင်းဆုံး ဆုံးဖြတ်ချက်ကို သုံးပါ — သက်ဆိုင်တယ်ဆိုရင် ဒီကိစ္စကို အဖွဲ့ထဲက တခြားသူတွေနဲ့လည်း တိုင်ပင်နိုင်ပါတယ်။

ဒီ handbook ထဲက အများစုမှာ `let` declarations တွေကို သုံးထားပါတယ်။

## Destructuring (ဖြိုခွဲခြင်း)

TypeScript မှာ ပါတဲ့ နောက်ထပ် ECMAScript 2015 feature တစ်ခုကတော့ destructuring ဖြစ်ပါတယ်။ အပြည့်အစုံ ကိုးကားချက်အတွက် — [Mozilla Developer Network ပေါ်က ဆောင်းပါး](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) ကို ကြည့်ပါ။ ဒီ section မှာတော့ — အကျဉ်းချုပ် လေ့လာကြည့်ရအောင်။

### Array destructuring (Array ဖြိုခွဲခြင်း)

Destructuring ရဲ့ အရိုးရှင်းဆုံး ပုံစံကတော့ array destructuring assignment (array တစ်ခုကို ဖြိုခွဲပြီး variable တွေထဲ တာဝန်ပေးခြင်း) ဖြစ်ပါတယ်:

```ts
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
```

ဒါက `first` နဲ့ `second` ဆိုတဲ့ variable အသစ် နှစ်ခုကို ဖန်တီးပါတယ်။ ဒါက indexing သုံးတာနဲ့ ညီမျှပေမယ့် — အများကြီး ပိုအဆင်ပြေပါတယ်:

```ts
first = input[0];
second = input[1];
```

Destructuring က ကြေညာပြီးသား variables တွေနဲ့လည်း အလုပ်လုပ်ပါတယ်:

```ts
// swap variables
[first, second] = [second, first];
```

ပြီးတော့ function တစ်ခုရဲ့ parameters တွေနဲ့လည်း ရပါတယ်:

```ts
function f([first, second]: [number, number]) {
  console.log(first);
  console.log(second);
}
f([1, 2]);
```

စာရင်းတစ်ခုထဲက ကျန်နေတဲ့ items တွေအတွက် variable တစ်ခုကို `...` syntax သုံးပြီး ဖန်တီးနိုင်ပါတယ်:

```ts
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

ဒါ JavaScript ဖြစ်တာမို့ — သင်ဂရုမစိုက်တဲ့ နောက်ဆုံး elements တွေကို ချန်လှပ်ထားလို့လည်း ရပါတယ်:

```ts
let [first] = [1, 2, 3, 4];
console.log(first); // outputs 1
```

ဒါမှမဟုတ် တခြား elements တွေကိုလည်း ချန်လှပ်နိုင်ပါတယ်:

```ts
let [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // outputs 2
console.log(fourth); // outputs 4
```

### Tuple destructuring (Tuple ဖြိုခွဲခြင်း)

Tuples တွေကိုလည်း arrays တွေလိုပဲ destructure လုပ်နိုင်ပါတယ်; destructuring variables တွေက ကိုက်ညီတဲ့ tuple elements တွေရဲ့ types တွေကို ရရှိပါတယ်:

```ts
let tuple: [number, string, boolean] = [7, "hello", true];

let [a, b, c] = tuple; // a: number, b: string, c: boolean
```

Tuple တစ်ခုကို ၎င်းရဲ့ elements တွေရဲ့ အကွာအဝေး (range) ထက် ကျော်လွန်ပြီး destructure လုပ်ရင် error ဖြစ်ပါတယ်:

```ts
let [a, b, c, d] = tuple; // Error, no element at index 3
```

Arrays တွေလိုပဲ — tuple ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းကို `...` နဲ့ destructure လုပ်ပြီး — ပိုတိုတဲ့ tuple တစ်ခု ရယူနိုင်ပါတယ်:

```ts
let [a, ...bc] = tuple; // bc: [string, boolean]
let [a, b, c, ...d] = tuple; // d: [], the empty tuple
```

ဒါမှမဟုတ် နောက်ဆုံး elements တွေ ဒါမှမဟုတ် တခြား elements တွေကို ချန်လှပ်နိုင်ပါတယ်:

```ts
let [a] = tuple; // a: number
let [, b] = tuple; // b: string
```

### Object destructuring (Object ဖြိုခွဲခြင်း)

Objects တွေကိုလည်း destructure လုပ်နိုင်ပါတယ်:

```ts
let o = {
  a: "foo",
  b: 12,
  c: "bar",
};
let { a, b } = o;
```

ဒါက `o.a` နဲ့ `o.b` ကနေ variable အသစ်တွေဖြစ်တဲ့ `a` နဲ့ `b` ကို ဖန်တီးပါတယ်။ `c` ကို မလိုအပ်ဘူးဆိုရင် ချန်လှပ်လို့ရတာ သတိပြုပါ။

Array destructuring လိုပဲ — declaration မပါဘဲ assignment လုပ်လို့လည်း ရပါတယ်:

```ts
({ a, b } = { a: "baz", b: 101 });
```

ဒီ statement ကို parentheses တွေနဲ့ ဝန်းရံထားရတာ သတိပြုပါ။ JavaScript က `{` ကို သာမန်အားဖြင့် block တစ်ခုရဲ့ အစအဖြစ် parse လုပ်လို့ပါ။

Object တစ်ခုထဲက ကျန်နေတဲ့ items တွေအတွက် variable တစ်ခုကို `...` syntax သုံးပြီး ဖန်တီးနိုင်ပါတယ်:

```ts
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```

#### Property renaming (Property နာမည် ပြောင်းလဲခြင်း)

Properties တွေကို မတူညီတဲ့ နာမည်တွေနဲ့လည်း ပေးနိုင်ပါတယ်:

```ts
let { a: newName1, b: newName2 } = o;
```

ဒီနေရာကစပြီး syntax က ရှုပ်ထွေးလာနိုင်ပါတယ်။ `a: newName1` ကို "`a` ကို `newName1` အနေနဲ့" လို့ ဖတ်နိုင်ပါတယ်။ ဦးတည်ချက်က ဘယ်ကနေ ညာ — အောက်ပါအတိုင်း ရေးထားသလိုပါပဲ:

```ts
let newName1 = o.a;
let newName2 = o.b;
```

ရှုပ်ထွေးစေနိုင်တာက — ဒီမှာက colon က type ကို ညွှန်ပြတာ _မဟုတ်ပါဘူး_။ Type ကို သတ်မှတ်ချင်ရင်တောင် — destructuring တစ်ခုလုံးရဲ့ နောက်မှာပဲ ရေးရပါသေးတယ်:

```ts
let { a: newName1, b: newName2 }: { a: string; b: number } = o;
```

#### Default values (Default တန်ဖိုးများ)

Default values တွေက property တစ်ခု undefined ဖြစ်နေတဲ့ အခါမျိုးအတွက် default value သတ်မှတ်ခွင့် ပြုပါတယ်:

```ts
function keepWholeObject(wholeObject: { a: string; b?: number }) {
  let { a, b = 1001 } = wholeObject;
}
```

ဒီ ဥပမာမှာ `b?` က `b` က optional ဖြစ်လို့ — `undefined` လည်း ဖြစ်နိုင်တယ်ဆိုတာ ညွှန်ပြပါတယ်။ `keepWholeObject` မှာ အခု — `b` undefined ဖြစ်နေရင်တောင် — `wholeObject` အတွက်ရော — `a` နဲ့ `b` properties တွေအတွက်ပါ variables တွေ ရှိနေပါပြီ။

## Function declarations (Function ကြေညာချက်များ)

Destructuring က function declarations တွေမှာလည်း အလုပ်လုပ်ပါတယ်။ ရိုးရှင်းတဲ့ အခြေအနေတွေမှာဆိုရင် ဒါက ရှင်းပါတယ်:

```ts
type C = { a: string; b?: number };
function f({ a, b }: C): void {
  // ...
}
```

ဒါပေမယ့် parameters တွေအတွက်ကတော့ defaults သတ်မှတ်တာ ပိုအဖြစ်များပြီး — destructuring နဲ့တွဲပြီး defaults တွေကို မှန်မှန်ကန်ကန် သတ်မှတ်တာက နည်းနည်း လှည့်ကွက်လို ဆန်ပါတယ်။ ပထမဆုံးအနေနဲ့ — pattern ကို default value ရဲ့ ရှေ့မှာ ထားရမယ်ဆိုတာ သတိရဖို့ လိုပါတယ်။

```ts
function f({ a = "", b = 0 } = {}): void {
  // ...
}
f();
```

> အပေါ်က snippet က — handbook မှာ အစောက ရှင်းပြခဲ့တဲ့ — type inference ရဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ်။

ပြီးတော့ — main initializer မှာ မဟုတ်ဘဲ — destructure လုပ်ထားတဲ့ property ပေါ်မှာရှိတဲ့ optional properties တွေအတွက် default ပေးဖို့ သတိရဖို့ လိုပါတယ်။ `C` ကို `b` optional နဲ့ သတ်မှတ်ထားတာ မှတ်မိကြမယ် ထင်ပါတယ်:

```ts
function f({ a, b = 0 } = { a: "" }): void {
  // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to { a: "" }, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
```

Destructuring ကို သတိထားပြီး သုံးပါ။ အပေါ်က ဥပမာတွေ ပြသလိုပဲ — အရိုးရှင်းဆုံး destructuring expression ကလွဲရင် — ကျန်တာတွေက ရှုပ်ထွေးစေနိုင်ပါတယ်။ အထူးသဖြင့် — နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်နေတဲ့ destructuring တွေမှာ ဒါ ပိုမှန်ပါတယ် — renaming ၊ default values နဲ့ type annotations တွေ ထပ်ထည့်စရာ မလိုဘဲတောင် နားလည်ဖို့ _တကယ့်ကို_ ခက်ခဲပါတယ်။ Destructuring expressions တွေကို သေးငယ်ပြီး ရိုးရှင်းအောင် ထားပါ။ Destructuring က ထုတ်ပေးမယ့် assignments တွေကို ကိုယ်တိုင်ရော အမြဲတမ်း ရေးလို့ရပါတယ်။

## Spread (Spread ဖြန့်ကျက်ခြင်း)

Spread operator က destructuring ရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။ ၎င်းက array တစ်ခုကို နောက် array တစ်ခုထဲ ဒါမှမဟုတ် object တစ်ခုကို နောက် object တစ်ခုထဲ — spread (ဖြန့်ကျက်) လုပ်ဖို့ ခွင့်ပြုပါတယ်။ ဥပမာ:

```ts
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

ဒါက `bothPlus` ကို `[0, 1, 2, 3, 4, 5]` ဆိုတဲ့ value ရစေပါတယ်။ Spreading လုပ်တာက `first` နဲ့ `second` ရဲ့ shallow copy (အပေါ်ယံ မိတ္တူ) တစ်ခုကို ဖန်တီးပါတယ်။ Spread လုပ်လိုက်လို့ မူရင်းတွေ ပြောင်းလဲသွားတာ မဟုတ်ပါဘူး။

Objects တွေကိုလည်း spread လုပ်နိုင်ပါတယ်:

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

အခု `search` က `{ food: "rich", price: "$$", ambiance: "noisy" }` ဖြစ်သွားပါတယ်။ Object spreading က array spreading ထက် ပိုရှုပ်ထွေးပါတယ်။ Array spreading လိုပဲ — ဘယ်ကနေ ညာကို ဆက်သွားပေမယ့် — result ကတော့ object ပဲ ဖြစ်ပါတယ်။ ဆိုလိုတာက — spread object ထဲမှာ နောက်ကျမှ ပါလာတဲ့ properties တွေက — အစောက ပါပြီးသား properties တွေကို overwrite (အစားထိုး) လုပ်ပါတယ်။ ဒါကြောင့် အစောက ဥပမာကို — spread ကို နောက်ဆုံးမှာ လုပ်အောင် ပြင်ကြည့်ရင်:

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

ဒါဆိုရင် `defaults` ထဲက `food` property က `food: "rich"` ကို overwrite လုပ်သွားမှာ ဖြစ်ပြီး — ဒီကိစ္စမှာ ကျွန်တော်တို့ လိုချင်တာတော့ မဟုတ်ပါဘူး။

Object spread မှာ နောက်ထပ် အံ့သြစရာ ကန့်သတ်ချက်တစ်ချို့လည်း ရှိပါသေးတယ်။ ပထမဆုံး — object တစ်ခုရဲ့ [ကိုယ်ပိုင်၊ enumerable properties](https://developer.mozilla.org/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) တွေပဲ ပါဝင်ပါတယ်။ အခြေခံအားဖြင့် ဆိုရရင် — object တစ်ခုရဲ့ instances တွေကို spread လုပ်တဲ့အခါ — methods တွေ ဆုံးရှုံးသွားတယ်လို့ ဆိုလိုပါတယ်:

```ts
class C {
  p = 12;
  m() {}
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
```

ဒုတိယအချက် — TypeScript compiler က generic functions တွေကနေ လာတဲ့ type parameters တွေရဲ့ spreads တွေကို ခွင့်မပြုပါဘူး။ အဲဒီ feature ကို language ရဲ့ နောင်ထွက်မယ့် version တွေမှာ မျှော်လင့်ထားပါတယ်။

## `using` declarations (`using` ကြေညာချက်များ)

`using` declarations တွေက JavaScript အတွက် လာမယ့် feature တစ်ခု ဖြစ်ပြီး — [Stage 3 Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) (ရှင်းလင်းပြတ်သားသော resource စီမံခန့်ခွဲမှု) proposal ရဲ့ အစိတ်အပိုင်း ဖြစ်ပါတယ်။ `using` declaration တစ်ခုက `const` declaration နဲ့ အတော်လေး ဆင်တူပေမယ့် — ထူးခြားချက်က — declaration နဲ့ bind လုပ်ထားတဲ့ value ရဲ့ _lifetime_ (သက်တမ်း) ကို variable ရဲ့ _scope_ နဲ့ တွဲချိတ်ပေးတာ ဖြစ်ပါတယ်။

`using` declaration တစ်ခု ပါဝင်နေတဲ့ block ကနေ control (လုပ်ဆောင်မှု စီးကြောင်း) ထွက်သွားတဲ့အခါ — ကြေညာထားတဲ့ value ရဲ့ `[Symbol.dispose](https://www.typescriptlang.org/docs/handbook)` method ကို execute လုပ်ပြီး — အဲဒီ value က cleanup (ရှင်းလင်းခြင်း) လုပ်ဆောင်နိုင်စေပါတယ်:

```ts
function f() {
  using x = new C();
  doSomethingWith(x);
} // `x[Symbol.dispose](https://www.typescriptlang.org/docs/handbook)` is called
```

Runtime မှာ ဒါက အောက်ပါနဲ့ _အကြမ်းဖျင်း_ တူညီတဲ့ သက်ရောက်မှု ရှိပါတယ်:

```ts
function f() {
  const x = new C();
  try {
    doSomethingWith(x);
  }
  finally {
    x[Symbol.dispose](https://www.typescriptlang.org/docs/handbook);
  }
}
```

`using` declarations တွေက — file handles လိုမျိုး native references တွေကို ကိုင်ထားတဲ့ JavaScript objects တွေနဲ့ အလုပ်လုပ်ရာမှာ memory leaks (မှတ်ဉာဏ် ယိုစိမ့်မှုများ) တွေကို ရှောင်ရှားဖို့ အလွန် အသုံးဝင်ပါတယ်

```ts
{
  using file = await openFile();
  file.write(text);
  doSomethingThatMayThrow();
} // `file` is disposed, even if an error is thrown
```

ဒါမှမဟုတ် tracing (ခြေရာခံခြင်း) လိုမျိုး scoped operations တွေမှာလည်း အသုံးဝင်ပါတယ်

```ts
function f() {
  using activity = new TraceActivity("f"); // traces entry into function
  // ...
} // traces exit of function

```

`var` ၊ `let` နဲ့ `const` တို့နဲ့ မတူဘဲ — `using` declarations တွေက destructuring ကို မထောက်ပံ့ပါဘူး။

### `null` and `undefined` (`null` နှင့် `undefined`)

Value က `null` ဒါမှမဟုတ် `undefined` လည်း ဖြစ်နိုင်တယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ် — အဲဒီလိုဆိုရင် block ရဲ့ အဆုံးမှာ ဘာမှ dispose (စွန့်လွှတ်) လုပ်မှာ မဟုတ်ပါဘူး:

```ts
{
  using x = b ? new C() : null;
  // ...
}
```

ဒါက အောက်ပါနဲ့ _အကြမ်းဖျင်း_ ညီမျှပါတယ်:

```ts
{
  const x = b ? new C() : null;
  try {
    // ...
  }
  finally {
    x?.[Symbol.dispose](https://www.typescriptlang.org/docs/handbook);
  }
}
```

ဒါက ရှုပ်ထွေးတဲ့ branching (အကိုင်းခွဲခြင်း) တွေ ဒါမှမဟုတ် ထပ်ခါတလဲလဲ ရေးသားခြင်းတွေ မလိုဘဲ — `using` declaration တစ်ခု ကြေညာတဲ့အခါ resources တွေကို အခြေအနေအလိုက် ရယူနိုင်စေပါတယ်။

### Defining a disposable resource (Disposable Resource တစ်ခုကို သတ်မှတ်ခြင်း)

`Disposable` interface ကို implement (အကောင်အထည်ဖော်) လုပ်ခြင်းအားဖြင့် — သင်ဖန်တီးတဲ့ classes တွေ ဒါမှမဟုတ် objects တွေက disposable (စွန့်လွှတ်နိုင်သော) ဖြစ်ကြောင်း ညွှန်ပြနိုင်ပါတယ်:

```ts
// from the default lib:
interface Disposable {
  [Symbol.dispose](https://www.typescriptlang.org/docs/handbook): void;
}

// usage:
class TraceActivity implements Disposable {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
    console.log(`Entering: ${name}`);
  }

  [Symbol.dispose](https://www.typescriptlang.org/docs/handbook): void {
    console.log(`Exiting: ${name}`);
  }
}

function f() {
  using _activity = new TraceActivity("f");
  console.log("Hello world!");
}

f();
// prints:
//   Entering: f
//   Hello world!
//   Exiting: f
```

## `await using` declarations (`await using` ကြေညာချက်များ)

တချို့ resources တွေ ဒါမှမဟုတ် operations တွေမှာ — asynchronously (နောက်ခံမှာ သီးခြား) လုပ်ဆောင်ဖို့ လိုအပ်တဲ့ cleanup တွေ ရှိနိုင်ပါတယ်။ အဲဒါကို ဖြည့်ဆည်းဖို့ — [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) proposal က `await using` declaration ကိုပါ မိတ်ဆက်ပေးပါတယ်:

```ts
async function f() {
  await using x = new C();
} // `await x[Symbol.asyncDispose](https://www.typescriptlang.org/docs/handbook)` is invoked
```

`await using` declaration တစ်ခုက — control က ၎င်း ပါဝင်နေတဲ့ block ကနေ ထွက်သွားတဲ့အခါ — value ရဲ့ `[Symbol.asyncDispose](https://www.typescriptlang.org/docs/handbook)` method ကို ခေါ်ယူပြီး _await_ လုပ်ပါတယ်။ ဒါက asynchronous cleanup တွေကို ခွင့်ပြုပါတယ် — ဥပမာ database transaction တစ်ခုက rollback ဒါမှမဟုတ် commit လုပ်တာ — ဒါမှမဟုတ် file stream တစ်ခုက မပိတ်ခင် စောင့်ဆိုင်းနေတဲ့ writes တွေကို storage ထဲ ရောက်အောင် flush (တွန်းထုတ်) လုပ်တာမျိုးတွေပါ။

`await` လိုပဲ — `await using` ကို `async` function ဒါမှမဟုတ် method တစ်ခုထဲမှာ — ဒါမှမဟုတ် module တစ်ခုရဲ့ top level မှာပဲ သုံးလို့ရပါတယ်။

### Defining an asynchronously disposable resource (Asynchronously Disposable Resource သတ်မှတ်ခြင်း)

`using` က `Disposable` ဖြစ်တဲ့ objects တွေကို အားထားသလိုပဲ — `await using` ကလည်း `AsyncDisposable` ဖြစ်တဲ့ objects တွေကို အားထားပါတယ်:

```ts
// from the default lib:
interface AsyncDisposable {
  [Symbol.asyncDispose]: PromiseLike<void>;
}

// usage:
class DatabaseTransaction implements AsyncDisposable {
  public success = false;
  private db: Database | undefined;

  private constructor(db: Database) {
    this.db = db;
  }

  static async create(db: Database) {
    await db.execAsync("BEGIN TRANSACTION");
    return new DatabaseTransaction(db);
  }

  async [Symbol.asyncDispose](https://www.typescriptlang.org/docs/handbook) {
    if (this.db) {
      const db = this.db;
      this.db = undefined;
      if (this.success) {
        await db.execAsync("COMMIT TRANSACTION");
      }
      else {
        await db.execAsync("ROLLBACK TRANSACTION");
      }
    }
  }
}

async function transfer(db: Database, account1: Account, account2: Account, amount: number) {
  await using tx = await DatabaseTransaction.create(db);
  if (await debitAccount(db, account1, amount)) {
    await creditAccount(db, account2, amount);
  }
  // if an exception is thrown before this line, the transaction will roll back
  tx.success = true;
  // now the transaction will commit
}
```

### `await using` vs `await` (`await using` နှင့် `await` နှိုင်းယှဉ်ခြင်း)

`await using` declaration ထဲက `await` keyword က — resource ရဲ့ _disposal_ (စွန့်လွှတ်ခြင်း) ကို `await` လုပ်တယ်ဆိုတာကိုပဲ ညွှန်ပြပါတယ်။ Value ကိုယ်တိုင်ကိုတော့ *လုံးဝ* `await` လုပ်တာ မဟုတ်ပါဘူး:

```ts
{
  await using x = getResourceSynchronously();
} // performs `await x[Symbol.asyncDispose](https://www.typescriptlang.org/docs/handbook)`

{
  await using y = await getResourceAsynchronously();
} // performs `await y[Symbol.asyncDispose](https://www.typescriptlang.org/docs/handbook)`
```

### `await using` and `return` (`await using` နှင့် `return`)

သတိထားစရာ သေးငယ်တဲ့ အချက်တစ်ခုကတော့ — `await using` declaration တစ်ခုကို — `Promise` တစ်ခုကို အရင် `await` မလုပ်ဘဲ return လုပ်တဲ့ `async` function တစ်ခုထဲမှာ သုံးနေတယ်ဆိုရင် — ဒီအပြုအမူနဲ့ ပတ်သက်ပြီး ဖြစ်နိုင်ချေရှိတဲ့ အခက်အခဲတစ်ခု ရှိပါတယ်:

```ts
function g() {
  return Promise.reject("error!");
}

async function f() {
  await using x = new C();
  return g(); // missing an `await`
}
```

Return လုပ်လိုက်တဲ့ promise ကို `await` မလုပ်ထားတာမို့ — JavaScript runtime က unhandled rejection (ကိုင်တွယ်မထားသော rejection) တစ်ခုကို အစီရင်ခံနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ — return လုပ်လိုက်တဲ့ promise ကို subscribe (စောင့်ကြည့်) မထားဘဲ — `x` ရဲ့ asynchronous disposal ကို `await` လုပ်နေစဉ် — execution က ရပ်နားသွားလို့ပါ။ ဒါပေမယ့် ဒါက `await using` တစ်ခုတည်းမှာပဲ ဖြစ်တဲ့ ပြဿနာတော့ မဟုတ်ပါဘူး — `try..finally` သုံးထားတဲ့ `async` function တစ်ခုမှာလည်း ဒီလို ဖြစ်နိုင်လို့ပါ:

```ts
async function f() {
  try {
    return g(); // also reports an unhandled rejection
  }
  finally {
    await somethingElse();
  }
}
```

ဒီအခြေအနေကို ရှောင်ဖို့ဆိုရင် — သင့် return value က `Promise` ဖြစ်နိုင်တယ်ဆိုရင် — အဲဒါကို `await` လုပ်ဖို့ အကြံပြုပါတယ်:

```ts
async function f() {
  await using x = new C();
  return await g();
}
```

## `using` and `await using` in `for` and `for..of` statements (`for` နှင့် `for..of` Statements များထဲမှာ `using` နှင့် `await using`)

`using` ရော `await using` ပါ — `for` statement တစ်ခုထဲမှာ သုံးလို့ရပါတယ်:

```ts
for (using x = getReader(); !x.eof; x.next()) {
  // ...
}
```

ဒီကိစ္စမှာ `x` ရဲ့ lifetime က `for` statement တစ်ခုလုံးကို scope သက်ရောက်ပြီး — control က loop ကနေ `break` ၊ `return` ၊ `throw` တစ်ခုခုကြောင့် ဒါမှမဟုတ် loop ရဲ့ condition false ဖြစ်လို့ ထွက်သွားတဲ့အခါမှပဲ dispose လုပ်ပါတယ်။

`for` statements တွေအပြင် — ဒီ declaration နှစ်မျိုးလုံးကို `for..of` statements တွေမှာလည်း သုံးနိုင်ပါတယ်:

```ts
function * g() {
  yield createResource1();
  yield createResource2();
}

for (using x of g()) {
  // ...
}
```

ဒီမှာ `x` ကို _loop ရဲ့ iteration တစ်ခုချင်းစီရဲ့ အဆုံးမှာ_ dispose လုပ်ပြီး — နောက် value တစ်ခုနဲ့ ပြန် initialize လုပ်ပါတယ်။ ဒါက generator တစ်ခုက တစ်ခုပြီးတစ်ခု ထုတ်ပေးနေတဲ့ resources တွေကို သုံးစွဲတဲ့အခါ အထူးသဖြင့် အသုံးဝင်ပါတယ်။

## `using` and `await using` in older runtimes (Runtime အဟောင်းများတွင် `using` နှင့် `await using`)

`using` နဲ့ `await using` declarations တွေကို — `Symbol.dispose`/`Symbol.asyncDispose` အတွက် compatible polyfill တစ်ခု သုံးနေသရွေ့ — နောက်ကျတဲ့ (အဟောင်း) ECMAScript editions တွေကို ရည်ရွယ်တဲ့အခါမှာလည်း သုံးနိုင်ပါတယ် — ဥပမာ NodeJS ရဲ့ မကြာသေးတဲ့ editions တွေမှာ default အနေနဲ့ ပါဝင်တဲ့ polyfill လိုမျိုးပါ။
