---
title: "Enums (Enum များ)"
description: "enum (အမည်ပေးထားသော constants အစု) အင်္ဂါရပ်အကြောင်း — numeric/string enums, computed/constant members, union enums, runtime/compile time အပြုအမူ, const enums နဲ့ ambient enums အထိ"
order: 56
source: "https://www.typescriptlang.org/docs/handbook/enums.html"
status: translated
updated: 2026-09-05
---

Enums တွေက — JavaScript ကို type-level (type အဆင့်) မှာပဲ extension လုပ်ထားတာမျိုး မဟုတ်တဲ့ — TypeScript ရဲ့ အင်္ဂါရပ် အနည်းငယ်ထဲက တစ်ခု ဖြစ်ပါတယ်။

Enums တွေက developer တစ်ယောက်အနေနဲ့ — အမည်ပေးထားတဲ့ constants (ကိန်းသေများ) အစုတစ်ခုကို သတ်မှတ်နိုင်အောင် ကူညီပေးပါတယ်။
Enums သုံးခြင်းက ရည်ရွယ်ချက်တွေကို code ထဲမှာ ပိုရှင်းလင်းစွာ မှတ်တမ်းတင်ဖို့ (သို့) တစ်ခုနဲ့တစ်ခု ကွဲပြားတဲ့ cases အစုတစ်ခု ဖန်တီးဖို့ လွယ်ကူစေပါတယ်။
TypeScript က numeric enums ရော string-based enums ရော နှစ်မျိုးလုံး ပံ့ပိုးပေးပါတယ်။

## Numeric enums (Numeric Enum များ)

ပထမဆုံး numeric enums တွေနဲ့ စလိုက်ကြရအောင် — တခြား languages တွေကနေ လာတဲ့သူတွေအတွက်တော့ ဒါတွေက ပိုပြီး အကျွမ်းဝင်စရာ ကောင်းနိုင်ပါတယ်။
Enum တစ်ခုကို `enum` keyword နဲ့ သတ်မှတ်နိုင်ပါတယ်။

```ts twoslash
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

အပေါ်မှာတော့ — `Up` ကို `1` နဲ့ စတင် initialize လုပ်ထားတဲ့ numeric enum တစ်ခု ရှိပါတယ်။
အဲဒီနောက်က members (အဖွဲ့ဝင်များ) တွေ အားလုံးက အဲဒီကစပြီး auto-increment (အလိုအလျောက် တိုးသွားခြင်း) လုပ်ခံရပါတယ်။
တစ်နည်းပြောရရင် — `Direction.Up` က တန်ဖိုး `1`, `Down` က `2`, `Left` က `3`, `Right` က `4` ရှိပါတယ်။

လိုချင်ရင်တော့ initializers (ကနဦးတန်ဖိုး သတ်မှတ်ချက်များ) တွေကို လုံးဝ ချန်လှပ်ထားလို့လည်း ရပါတယ်:

```ts twoslash
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

ဒီမှာ `Up` က တန်ဖိုး `0` ရှိမယ်၊ `Down` က `1` ရှိမယ် စသဖြင့်ပါ။
ဒီ auto-increment အပြုအမူကတော့ — member တွေရဲ့ တန်ဖိုးတွေကိုယ်တိုင်ထက် — enum တစ်ခုတည်းထဲက တန်ဖိုးတစ်ခုနဲ့တစ်ခု မတူညီဖို့ပဲ အရေးကြီးတဲ့ ကိစ္စမျိုးတွေမှာ အသုံးဝင်ပါတယ်။

Enum သုံးတာက ရိုးရှင်းပါတယ် — enum ထဲက member ကို enum ရဲ့ property အနေနဲ့ ဝင်ရောက်ကြည့်ရှုရုံပါပဲ၊ ပြီးတော့ type တွေကို ကြေညာတဲ့အခါ enum ရဲ့ နာမည်ကိုပဲ သုံးပါတယ်:

```ts twoslash
enum UserResponse {
  No = 0,
  Yes = 1,
}

function respond(recipient: string, message: UserResponse): void {
  // ...
}

respond("Princess Caroline", UserResponse.Yes);
```

Numeric enums တွေကို [computed and constant members (အောက်တွင် ကြည့်ပါ)](https://www.typescriptlang.org/docs/handbook) တွေနဲ့ ရောနှော သုံးလို့ ရပါတယ်။
အကျဉ်းချုပ်ပြောရရင် — initializer မပါတဲ့ enums တွေက enum ရဲ့ ပထမဆုံး နေရာမှာ ရှိရမယ်၊ ဒါမှမဟုတ် numeric constants တွေ (သို့) တခြား constant enum members တွေနဲ့ စတင်သတ်မှတ်ထားတဲ့ numeric enums တွေရဲ့ နောက်မှသာ လိုက်ရပါတယ်။
တစ်နည်းပြောရရင် — အောက်ကဟာမျိုးကိုတော့ ခွင့်မပြုပါဘူး:

```ts twoslash
// @errors: 1061
const getSomeValue = () => 23;
// ---cut---
enum E {
  A = getSomeValue(),
  B,
}
```

## String enums (String Enum များ)

String enums တွေကလည်း အလားတူ concept တစ်ခုပါ — ဒါပေမယ့် အောက်မှာ မှတ်တမ်းတင်ထားသလို သိမ်မွေ့တဲ့ [runtime differences](https://www.typescriptlang.org/docs/handbook) (runtime မှာ ကွဲလွဲချက်များ) တစ်ချို့ ရှိပါတယ်။
String enum တစ်ခုထဲမှာ member တိုင်းကို string literal (စာသားတန်ဖိုး) တစ်ခု (သို့) တခြား string enum member တစ်ခုနဲ့သာ constant-initialized (ကိန်းသေတန်ဖိုးဖြင့် စတင်သတ်မှတ်) လုပ်ရပါတယ်။

```ts twoslash
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

String enums တွေမှာ auto-increment အပြုအမူ မရှိပေမယ့် — "serialize" (စနစ်ကျအောင် သိမ်းဆည်းခြင်း) ကောင်းတဲ့ အကျိုးကျေးဇူးတော့ ရှိပါတယ်။
တစ်နည်းပြောရရင် — debugging လုပ်နေတုန်း numeric enum တစ်ခုရဲ့ runtime value ကို ဖတ်ရမယ်ဆိုရင် — အဲဒီတန်ဖိုးက မကြာခဏ opaque (အဓိပ္ပါယ် မပေါ်လွင်) တတ်ပါတယ် — သူ့ချည်းသက်သက်ဆို ဘာအဓိပ္ပါယ်မှ မဆောင်ပါဘူး ([reverse mapping](https://www.typescriptlang.org/docs/handbook) ကတော့ မကြာခဏ အကူအညီ ပေးနိုင်ပါတယ်)။ String enums တွေက code run ချိန်မှာ — enum member ရဲ့ နာမည်နဲ့ မသက်ဆိုင်ဘဲ — အဓိပ္ပါယ်ရှိပြီး ဖတ်ရှုလို့ ကောင်းတဲ့ တန်ဖိုးတစ်ခုကို ပေးနိုင်ပါတယ်။

## Heterogeneous enums (မျိုးစုံ ရောနှောထားသော Enums)

နည်းပညာအရပြောရရင် enums တွေမှာ string နဲ့ numeric members တွေ ရောနှောထားလို့ ရပါတယ် — ဒါပေမယ့် ဘာကြောင့် အဲဒီလို လုပ်ချင်မလဲဆိုတာတော့ ရှင်းရှင်းလင်းလင်း မသိရပါဘူး:

```ts twoslash
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

JavaScript ရဲ့ runtime အပြုအမူကို လိမ္မာပါးနပ်တဲ့ နည်းလမ်းနဲ့ အသုံးချဖို့ တကယ်ကို ကြိုးစားနေတာမဟုတ်ရင် — ဒီလိုမျိုး မလုပ်ဖို့ အကြံပြုပါတယ်။

## Computed and constant members (တွက်ချက်ရသော နဲ့ ကိန်းသေ Members)

Enum member တိုင်းမှာ ဆက်စပ်နေတဲ့ တန်ဖိုးတစ်ခု ရှိပြီး — အဲဒီတန်ဖိုးက _constant_ (ကိန်းသေ) ဒါမှမဟုတ် _computed_ (တွက်ချက်ရသော) ဖြစ်နိုင်ပါတယ်။
Enum member တစ်ခုကို အောက်ပါအခြေအနေတွေမှာ constant အဖြစ် သတ်မှတ်ပါတယ်:

- Enum ထဲက ပထမဆုံး member ဖြစ်ပြီး initializer မပါဘူးဆိုရင် — အဲဒီအခါ `0` ဆိုတဲ့ တန်ဖိုး သတ်မှတ်ပေးပါတယ်:

  ```ts twoslash
  // E.X is constant:
  enum E {
    X,
  }
  ```

- Initializer မပါဘဲ — အရှေ့က enum member က _numeric_ constant ဖြစ်နေရင်။
  ဒီအခြေအနေမှာ လက်ရှိ enum member ရဲ့ တန်ဖိုးက — အရှေ့က enum member ရဲ့ တန်ဖိုး အပေါင်း တစ် ဖြစ်ပါလိမ့်မယ်။

  ```ts twoslash
  // All enum members in 'E1' and 'E2' are constant.

  enum E1 {
    X,
    Y,
    Z,
  }

  enum E2 {
    A = 1,
    B,
    C,
  }
  ```

- Enum member ကို constant enum expression (compile time မှာ အပြည့်အဝ တွက်ချက်၍ရတဲ့ expression) တစ်ခုနဲ့ စတင် initialize လုပ်ထားရင်။
  Constant enum expression ဆိုတာက — compile time မှာ အပြည့်အဝ တွက်ချက်၍ရတဲ့ TypeScript expressions တွေရဲ့ အစိတ်အပိုင်းခွဲတစ်ခုပါ။
  Expression တစ်ခုက အောက်ပါအတိုင်းဆိုရင် constant enum expression ဖြစ်ပါတယ်:

  1. literal enum expression (အခြေခံအားဖြင့် string literal (သို့) numeric literal)
  2. အရင်က သတ်မှတ်ပြီးသား constant enum member တစ်ခုကို ရည်ညွှန်းခြင်း (တခြား enum တစ်ခုကနေ လာတာလည်း ဖြစ်နိုင်ပါတယ်)
  3. ကွင်းစကွင်းပိတ် ခံထားရတဲ့ constant enum expression
  4. constant enum expression တစ်ခုကို သက်ရောက်ထားတဲ့ `+`, `-`, `~` unary operators တွေထဲက တစ်ခု
  5. operands တွေက constant enum expressions ဖြစ်တဲ့ `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` binary operators တွေထဲက တစ်ခု

  Constant enum expressions တွေကို `NaN` ဒါမှမဟုတ် `Infinity` အဖြစ် တွက်ချက်မိရင် compile time error ဖြစ်ပါတယ်။

ကျန်တဲ့ အခြေအနေအားလုံးမှာတော့ enum member ကို computed အဖြစ် သတ်မှတ်ပါတယ်။

```ts twoslash
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length,
}
```

## Union enums and enum member types (Union Enums နဲ့ Enum Member Types များ)

တွက်ချက်စရာ မလိုတဲ့ constant enum members တွေရဲ့ အထူးအစိတ်အပိုင်းတစ်ခု ရှိပါတယ် — literal enum members တွေပါ။
Literal enum member ဆိုတာက — စတင် initialize လုပ်ထားတဲ့ တန်ဖိုး မရှိတဲ့ (သို့) အောက်ပါတန်ဖိုးတွေနဲ့ initialize လုပ်ထားတဲ့ constant enum member ပါ:

- ဘယ် string literal မဆို (ဥပမာ — `"foo"`, `"bar"`, `"baz"`)
- ဘယ် numeric literal မဆို (ဥပမာ — `1`, `100`)
- ဘယ် numeric literal ကိုမဆို unary minus သက်ရောက်ထားတာ (ဥပမာ — `-1`, `-100`)

Enum တစ်ခုထဲက members အားလုံးမှာ literal enum values တွေ ရှိတဲ့အခါ — အထူး semantics (အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ) တစ်ချို့ အလုပ်လုပ်လာပါတယ်။

ပထမတစ်ချက်က — enum members တွေက types တွေအနေနဲ့ပါ ဖြစ်လာပါတယ်!
ဥပမာ — တချို့ members တွေက enum member တစ်ခုရဲ့ တန်ဖိုးကိုပဲ _သာ_ ရနိုင်တယ်လို့ ပြောနိုင်ပါတယ်:

```ts twoslash
// @errors: 2322
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square,
  radius: 100,
};
```

နောက်ထပ် ပြောင်းလဲမှုတစ်ခုက — enum types တွေကိုယ်တိုင် ထိရောက်စွာ enum member တစ်ခုချင်းစီရဲ့ _union_ (ပေါင်းစုမှု) တစ်ခု ဖြစ်လာပါတယ်။
Union enums တွေနဲ့ဆိုရင် type system က — enum ထဲမှာ တကယ်ရှိနေတဲ့ တန်ဖိုးတွေရဲ့ အတိအကျ အစုကို သိနေတယ်ဆိုတဲ့ အချက်ကို အသုံးချနိုင်ပါတယ်။
အဲဒါကြောင့် — TypeScript က တန်ဖိုးတွေကို မှားယွင်းစွာ နှိုင်းယှဉ်မိနေတဲ့ bugs တွေကို ဖမ်းမိနိုင်ပါတယ်။
ဥပမာ:

```ts twoslash
// @errors: 2367
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    //
  }
}
```

အဲဒီဥပမာမှာ — `x` က `E.Foo` _မဟုတ်_ ဘူးလားဆိုတာ အရင်ဆုံး စစ်ကြည့်ပါတယ်။
အဲဒီစစ်ဆေးမှု အောင်မြင်ခဲ့ရင် — ကျုပ်တို့ရဲ့ `||` က short-circuit ဖြစ်ပြီး — 'if' ရဲ့ body က run ပါလိမ့်မယ်။
ဒါပေမယ့် — စစ်ဆေးမှု မအောင်မြင်ခဲ့ရင် — `x` က `E.Foo` _ပဲ_ ဖြစ်နိုင်တာမို့ — `E.Bar` နဲ့ _မတူညီ_ ဘူးလားဆိုတာ ကြည့်နေတာက အဓိပ္ပါယ် မရှိပါဘူး။

## Enums at runtime (Runtime မှာ Enums)

Enums တွေက runtime မှာ တကယ်ရှိနေတဲ့ objects (အရာဝတ္ထုများ) တွေပါ။
ဥပမာ — အောက်က enum ကို

```ts twoslash
enum E {
  X,
  Y,
  Z,
}
```

functions တွေဆီ တကယ်ပဲ ပို့လို့ ရပါတယ်

```ts twoslash
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

## Enums at compile time (Compile Time မှာ Enums)

Enums တွေက runtime မှာ တကယ်ရှိတဲ့ objects တွေ ဖြစ်ပေမယ့် — `keyof` keyword ကတော့ သာမန် objects တွေမှာ သင်မျှော်လင့်တဲ့ပုံစံနဲ့ မတူဘဲ အလုပ်လုပ်ပါတယ်။ အဲဒီအစား — Enum keys အားလုံးကို strings တွေအနေနဲ့ ကိုယ်စားပြုတဲ့ Type တစ်ခုကို ရဖို့ `keyof typeof` ကို သုံးပါ။

```ts twoslash
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
```

### Reverse mappings (ပြောင်းပြန် Mapping များ)

Members တွေအတွက် property names တွေပါတဲ့ object တစ်ခုကို ဖန်တီးပေးတာအပြင် — numeric enum members တွေက enum values ကနေ enum names ဆီကို _reverse mapping_ (ပြောင်းပြန် mapping) တစ်ခုကိုပါ ရရှိပါတယ်။
ဥပမာ — ဒီဥပမာထဲမှာ:

```ts twoslash
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript က ဒါကို အောက်ပါ JavaScript အဖြစ် compile လုပ်ပါတယ်:

```ts twoslash
// @showEmit
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

ဒီ generate လုပ်ထားတဲ့ code ထဲမှာ — enum တစ်ခုကို forward (`name` -> `value`) ရော reverse (`value` -> `name`) ရော mapping နှစ်မျိုးလုံးကို သိမ်းဆည်းတဲ့ object တစ်ခုအဖြစ် compile လုပ်ပါတယ်။
တခြား enum members တွေကို ရည်ညွှန်းတာတွေက အမြဲတမ်း property accesses အဖြစ် emit လုပ်ပြီး — ဘယ်တော့မှ inlined (နေရာတွင် တိုက်ရိုက် အစားထိုးခြင်း) မလုပ်ပါဘူး။

String enum members တွေမှာတော့ reverse mapping ကို _လုံးဝ_ generate လုပ်ပေးမှာ မဟုတ်ဘူးဆိုတာ သတိပြုထားပါ။

### `const` enums (Const Enums များ)

အများစုသော အခြေအနေတွေမှာ enums တွေက လုံးဝ သင့်လျော်တဲ့ အဖြေတစ်ခုပါ။
ဒါပေမယ့် တစ်ခါတလေ requirement တွေက ပိုတင်းကျပ်ပါတယ်။
Enum values တွေကို ဝင်ရောက်ကြည့်ရှုတဲ့အခါ — အပိုထွက်လာတဲ့ generated code နဲ့ အပို indirection (ထပ်ဆင့်ညွှန်ပြမှု) ရဲ့ ကုန်ကျစရိတ်ကို ရှောင်ရှားဖို့ — `const` enums တွေကို သုံးလို့ ရပါတယ်။
Const enums တွေကို enums တွေပေါ်မှာ `const` modifier သုံးပြီး သတ်မှတ်ပါတယ်:

```ts twoslash
const enum Enum {
  A = 1,
  B = A * 2,
}
```

Const enums တွေက constant enum expressions တွေကိုပဲ သုံးနိုင်ပြီး — သာမန် enums တွေနဲ့ မတူဘဲ — compilation လုပ်ချိန်မှာ လုံးဝ ဖယ်ရှားခံရပါတယ်။
Const enum members တွေကို သုံးထားတဲ့ နေရာတွေမှာ inlined လုပ်ပါတယ်။
Const enums တွေမှာ computed members တွေ မရှိနိုင်လို့ — အဲဒီလို လုပ်နိုင်တာ ဖြစ်ပါတယ်။

```ts twoslash
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

ဆိုလိုတာက — generate လုပ်ထားတဲ့ code ထဲမှာ အောက်ပါအတိုင်း ဖြစ်သွားပါမယ်

```ts twoslash
// @showEmit
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

#### Const enum pitfalls (Const Enums ရဲ့ ထောင်ချောက်များ)

Enum values တွေကို inline လုပ်တာက အစပိုင်းမှာ ရိုးရှင်းပေမယ့် — သိမ်မွေ့တဲ့ သက်ရောက်မှုတွေ ပါလာတတ်ပါတယ်။
ဒီ pitfalls တွေက _ambient_ const enums (အခြေခံအားဖြင့် `.d.ts` files တွေထဲက const enums) တွေနဲ့ — အဲဒါတွေကို projects တွေကြား share လုပ်တာနဲ့သာ သက်ဆိုင်ပါတယ် — ဒါပေမယ့် သင်က `.d.ts` files တွေကို publish (ဖြန့်ချိ) လုပ်တာ (သို့) သုံးစွဲတာ ရှိရင်တော့ — `tsc --declaration` က `.ts` files တွေကို `.d.ts` files တွေအဖြစ် ပြောင်းပေးတာမို့ — ဒီ pitfalls တွေက သင့်နဲ့ သက်ဆိုင်နိုင်ခြေ များပါတယ်။

1. [`isolatedModules` documentation](https://www.typescriptlang.org/tsconfig) ထဲမှာ ဖော်ပြထားတဲ့ အကြောင်းပြချက်တွေအရ — အဲဒီ mode က ambient const enums တွေနဲ့ အခြေခံအားဖြင့် သဟဇာတ မဖြစ်ပါဘူး။
   ဆိုလိုတာက — သင်က ambient const enums တွေကို publish လုပ်မယ်ဆိုရင် — downstream (အောက်အဆင့်) consumers တွေက [`isolatedModules`](https://www.typescriptlang.org/tsconfig) နဲ့ အဲဒီ enum values တွေကို တစ်ပြိုင်နက် သုံးနိုင်တော့မှာ မဟုတ်ပါဘူး။
2. သင်က dependency တစ်ခုရဲ့ version A ကနေ values တွေကို compile time မှာ လွယ်ကူစွာ inline လုပ်ပြီး — runtime မှာ version B ကို import လုပ်မိနိုင်ပါတယ်။
   သတိထားမှု မရှိရင် version A နဲ့ B ရဲ့ enums တွေမှာ တန်ဖိုးတွေ မတူညီနိုင်ပြီး — `if` statements တွေရဲ့ မှားယွင်းတဲ့ branches တွေကို ရွေးမိတာမျိုး [surprising bugs](https://github.com/microsoft/TypeScript/issues/5219#issue-110947903) (မမျှော်လင့်တဲ့ bugs) တွေ ဖြစ်စေနိုင်ပါတယ်။
   ဒီ bugs တွေက အထူးသဖြင့် ဆိုးရွားပါတယ် — ဘာလို့လဲဆိုတော့ projects တွေ build လုပ်တဲ့အချိန်နဲ့ ခန့်မှန်းခြေ တစ်ချိန်တည်းမှာ — dependency versions တွေ အတူတူနဲ့ပဲ automated tests တွေ run လေ့ရှိလို့ — ဒီ bugs တွေကို လုံးဝ လွဲချော်သွားစေနိုင်လို့ပါ။
3. [`importsNotUsedAsValues: "preserve"`](https://www.typescriptlang.org/tsconfig) က — values အဖြစ် သုံးထားတဲ့ const enums တွေအတွက် imports တွေကို elide (ဖယ်ရှား) လုပ်ပေးမှာ မဟုတ်ဘူး — ဒါပေမယ့် ambient const enums တွေက runtime `.js` files တွေ ရှိမယ်လို့တော့ အာမခံချက် မပေးပါဘူး။
   အဲဒီလို ဖြေရှင်းလို့ မရတဲ့ imports တွေက runtime မှာ errors တွေ ဖြစ်စေပါတယ်။
   Imports တွေကို ရှင်းရှင်းလင်းလင်း elide လုပ်ဖို့ သာမန်နည်းလမ်း ဖြစ်တဲ့ [type-only imports](/docs/typescript/modules-reference) ကလည်း — [လောလောဆယ် const enum values တွေကို ခွင့်မပြုပါဘူး](https://github.com/microsoft/TypeScript/issues/40344)။

ဒီ pitfalls တွေကို ရှောင်ရှားဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

1. Const enums တွေကို လုံးဝ မသုံးပါနဲ့။
   Linter တစ်ခုရဲ့ အကူအညီနဲ့ [const enums တွေကို ban (တားမြစ်) လုပ်လို့](https://typescript-eslint.io/linting/troubleshooting#how-can-i-ban-specific-language-feature) လွယ်ပါတယ်။
   ဒါက const enums နဲ့ဆိုင်တဲ့ ပြဿနာတွေ အားလုံးကို ရှောင်နိုင်ပေမယ့် — သင့် project က ကိုယ်ပိုင် enums တွေကို inline လုပ်ခွင့်ကိုတော့ တားဆီးပါတယ်။
   တခြား projects တွေကနေ enums တွေကို inline လုပ်တာနဲ့ မတူဘဲ — project တစ်ခုက ကိုယ်ပိုင် enums တွေကို inline လုပ်တာက ပြဿနာ မရှိဘဲ — performance အတွက် အကျိုးရှိပါတယ်။
2. [`preserveConstEnums`](https://www.typescriptlang.org/tsconfig) ရဲ့ အကူအညီနဲ့ deconstify (const မဟုတ်တော့အောင် ပြောင်းခြင်း) လုပ်ပြီး — ambient const enums တွေကို publish မလုပ်ပါနဲ့။
   ဒါက [TypeScript project ကိုယ်တိုင်](https://github.com/microsoft/TypeScript/pull/5422) က အတွင်းပိုင်းမှာ ကျင့်သုံးတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။
   [`preserveConstEnums`](https://www.typescriptlang.org/tsconfig) က const enums တွေအတွက် — သာမန် enums တွေလိုပဲ JavaScript တစ်မျိုးတည်း emit လုပ်ပါတယ်။
   ပြီးရင် `.d.ts` files တွေကနေ `const` modifier ကို [build step တစ်ခုထဲမှာ](https://github.com/microsoft/TypeScript/blob/1a981d1df1810c868a66b3828497f049a944951c/Gulpfile.js#L144) ဘေးကင်းစွာ ဖယ်ရှားလိုက်လို့ ရပါတယ်။

   ဒီနည်းလမ်းနဲ့ဆိုရင် downstream consumers တွေက သင့် project ရဲ့ enums တွေကို inline လုပ်တော့မှာ မဟုတ်လို့ — အပေါ်က pitfalls တွေကို ရှောင်နိုင်ပေမယ့် — const enums တွေကို လုံးဝ ban လုပ်တာနဲ့ မတူဘဲ — project တစ်ခုက ကိုယ်ပိုင် enums တွေကို inline လုပ်နေတုန်း ဖြစ်ပါတယ်။

## Ambient enums (Ambient Enums များ)

Ambient enums (implementation မပါဘဲ ပုံသဏ္ဌာန်ဖော်ပြရုံသာ ကြေညာထားသော enums) တွေက — ရှိပြီးသား enum types တွေရဲ့ ပုံသဏ္ဌာန် (shape) ကို ဖော်ပြဖို့ သုံးပါတယ်။

```ts twoslash
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
```

Ambient နဲ့ non-ambient enums တွေကြားက အရေးကြီးတဲ့ ကွာခြားချက်တစ်ခုက — သာမန် enums တွေမှာ initializer မရှိတဲ့ members တွေက — အရှေ့က enum member ကို constant လို့ သတ်မှတ်ထားရင် — constant လို့ သတ်မှတ်ခံရပါတယ်။
ဆန့်ကျင်ဘက်အနေနဲ့ — initializer မရှိတဲ့ ambient (နဲ့ non-const) enum member တစ်ခုကိုတော့ _အမြဲတမ်း_ computed အဖြစ် သတ်မှတ်ပါတယ်။

## Objects vs Enums (Object များနဲ့ Enum များ)

ခေတ်သစ် TypeScript မှာ — `as const` နဲ့ လုပ်ထားတဲ့ object တစ်ခုနဲ့ လုံလောက်နိုင်ရင် — enum တစ်ခု မလိုအပ်တော့ဘူးလည်း ဖြစ်နိုင်ပါတယ်:

```ts twoslash
const enum EDirection {
  Up,
  Down,
  Left,
  Right,
}

const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

EDirection.Up;
//         ^?

ODirection.Up;
//         ^?

// Using the enum as a parameter
function walk(dir: EDirection) {}

// It requires an extra line to pull out the values
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}

walk(EDirection.Left);
run(ODirection.Right);
```

TypeScript ရဲ့ `enum` ထက် ဒီ format ကို ထောက်ခံရတဲ့ အကြီးမားဆုံး အကြောင်းပြချက်က — ဒါက သင့် codebase ကို JavaScript ရဲ့ လက်ရှိအခြေအနေနဲ့ လိုက်လျောညီထွေ ဖြစ်နေစေပြီး — [when/if](https://github.com/rbuckton/proposal-enum) enums တွေကို JavaScript ထဲကို ထည့်သွင်းလိုက်တဲ့အခါ — အဲဒီအပို syntax အသစ်ဆီ ပြောင်းရွှေ့လို့ ရနိုင်လို့ပါ။
