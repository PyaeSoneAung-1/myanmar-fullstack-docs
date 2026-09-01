---
title: "shallow (အမြန် နှိုင်းယှဉ်ခြင်း)"
description: "shallow function နဲ့ ရိုးရှင်းတဲ့ data structures တွေကို မြန်မြန်ဆန်ဆန် နှိုင်းယှဉ်ခြင်း — primitives, objects, sets, maps နှိုင်းယှဉ်နည်းများ"
order: 12
source: "https://zustand.docs.pmnd.rs/reference/apis/shallow"
status: translated
updated: 2026-09-01
---

`shallow` က ရိုးရှင်းတဲ့ data structures တွေပေါ်မှာ မြန်ဆန်တဲ့ စစ်ဆေးမှုတွေ လုပ်ပေးပါတယ်။ Nested objects ဒါမှမဟုတ် arrays တွေ မပါတဲ့ data structures တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — **top-level** (အပြင်ဆုံးအဆင့်) property တွေရဲ့ အပြောင်းအလဲတွေကို ထိရောက်စွာ ဖော်ထုတ်ပေးပါတယ်။

> **မှတ်ချက်:** Shallow က မြန်ဆန်တဲ့ နှိုင်းယှဉ်မှုတွေ လုပ်ပေးနိုင်ပေမယ့် — သူ့ရဲ့ ကန့်သတ်ချက်တွေကိုတော့ သတိထားထားပါ။

```js
const equal = shallow(a, b)
```

## Types

### Signature

```ts
shallow<T>(a: T, b: T): boolean
```

## Reference

### `shallow(a, b)`

#### Parameters

- `a`: ပထမ value ။
- `b`: ဒုတိယ value ။

#### Returns

`a` နဲ့ `b` တို့ရဲ့ **top-level** property တွေကို shallow comparison (အပေါ်ယံ နှိုင်းယှဉ်ခြင်း) လုပ်ပြီး တူညီတယ်ဆိုရင် `shallow` က `true` ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ `false` ပြန်ပေးပါတယ်။

## Usage

### Primitives တွေ နှိုင်းယှဉ်ခြင်း

`string`, `number`, `boolean`, `BigInt` စတဲ့ primitive value တွေကို နှိုင်းယှဉ်တဲ့အခါ — value တွေ တူညီနေရင် `Object.is` ရော `shallow` function ရောပါ `true` ပြန်ပေးပါတယ်။ ဘာကြောင့်လဲဆိုတော့ primitive value တွေကို reference (ရည်ညွှန်းချက်) နဲ့ မဟုတ်ဘဲ တကယ့် တန်ဖိုးနဲ့ နှိုင်းယှဉ်လို့ပါ။

```ts
const stringLeft = 'John Doe'
const stringRight = 'John Doe'

Object.is(stringLeft, stringRight) // -> true
shallow(stringLeft, stringRight) // -> true

const numberLeft = 10
const numberRight = 10

Object.is(numberLeft, numberRight) // -> true
shallow(numberLeft, numberRight) // -> true

const booleanLeft = true
const booleanRight = true

Object.is(booleanLeft, booleanRight) // -> true
shallow(booleanLeft, booleanRight) // -> true

const bigIntLeft = 1n
const bigIntRight = 1n

Object.is(bigIntLeft, bigIntRight) // -> true
shallow(bigIntLeft, bigIntRight) // -> true
```

### Objects တွေ နှိုင်းယှဉ်ခြင်း

Objects တွေကို နှိုင်းယှဉ်တဲ့အခါ — `Object.is` နဲ့ `shallow` function တို့ ဘယ်လို အလုပ်လုပ်သလဲဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်၊ ဘာလို့လဲဆိုတော့ သူတို့က နှိုင်းယှဉ်တဲ့ ပုံစံ မတူညီလို့ပါ။

ဒီအခြေအနေမှာ `shallow` function က `true` ပြန်ပေးပါတယ် — ဘာလို့လဲဆိုတော့ shallow က objects တွေကို shallow comparison လုပ်ပြီး — top-level property တွေနဲ့ သူတို့ရဲ့ တန်ဖိုးတွေ တူမတူ စစ်ဆေးလို့ပါ။ ဒီကိစ္စမှာ top-level property တွေ (`firstName`, `lastName`, `age`) နဲ့ သူတို့ရဲ့ တန်ဖိုးတွေက `objectLeft` နဲ့ `objectRight` မှာ အတူတူပဲ ဖြစ်လို့ — shallow က သူတို့ကို တူညီတယ်လို့ သတ်မှတ်ပါတယ်။

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

### Sets တွေ နှိုင်းယှဉ်ခြင်း

Sets တွေကို နှိုင်းယှဉ်တဲ့အခါ — `Object.is` နဲ့ `shallow` function တို့ ဘယ်လို အလုပ်လုပ်သလဲဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်၊ ဘာလို့လဲဆိုတော့ သူတို့က နှိုင်းယှဉ်တဲ့ ပုံစံ မတူညီလို့ပါ။

ဒီအခြေအနေမှာ `shallow` function က `true` ပြန်ပေးပါတယ် — ဘာလို့လဲဆိုတော့ shallow က sets တွေကို shallow comparison လုပ်ပြီး — top-level property တွေ (ဒီကိစ္စမှာ set တွေကိုယ်တိုင်) တူမတူ စစ်ဆေးလို့ပါ။ `setLeft` နဲ့ `setRight` တို့ နှစ်ခုလုံးက Set object ရဲ့ instance တွေ ဖြစ်ပြီး element တွေလည်း အတူတူ ပါဝင်လို့ — shallow က သူတို့ကို တူညီတယ်လို့ သတ်မှတ်ပါတယ်။

```ts
const setLeft = new Set([1, 2, 3])
const setRight = new Set([1, 2, 3])

Object.is(setLeft, setRight) // -> false
shallow(setLeft, setRight) // -> true
```

### Maps တွေ နှိုင်းယှဉ်ခြင်း

Maps တွေကို နှိုင်းယှဉ်တဲ့အခါ — `Object.is` နဲ့ `shallow` function တို့ ဘယ်လို အလုပ်လုပ်သလဲဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်၊ ဘာလို့လဲဆိုတော့ သူတို့က နှိုင်းယှဉ်တဲ့ ပုံစံ မတူညီလို့ပါ။

ဒီအခြေအနေမှာ `shallow` က `true` ပြန်ပေးပါတယ် — ဘာလို့လဲဆိုတော့ shallow က maps တွေကို shallow comparison လုပ်ပြီး — top-level property တွေ (ဒီကိစ္စမှာ map တွေကိုယ်တိုင်) တူမတူ စစ်ဆေးလို့ပါ။ `mapLeft` နဲ့ `mapRight` တို့ နှစ်ခုလုံးက Map object ရဲ့ instance တွေ ဖြစ်ပြီး key-value pair တွေလည်း အတူတူ ပါဝင်လို့ — shallow က သူတို့ကို တူညီတယ်လို့ သတ်မှတ်ပါတယ်။

```ts
const mapLeft = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
const mapRight = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])

Object.is(mapLeft, mapRight) // -> false
shallow(mapLeft, mapRight) // -> true
```

## Troubleshooting

### Objects တွေ အတူတူ ဖြစ်နေပေမယ့် နှိုင်းယှဉ်တဲ့အခါ `false` ပြန်တယ်

`shallow` function က shallow comparison ပဲ လုပ်ပါတယ်။ Shallow comparison ဆိုတာ — object နှစ်ခုရဲ့ top-level property တွေ တူညီမှု ရှိမရှိကိုပဲ စစ်ဆေးတာပါ။ Nested objects တွေ ဒါမှမဟုတ် နက်ရှိုင်းစွာ မြှုပ်နှံထားတဲ့ (deeply nested) property တွေကိုတော့ မစစ်ဆေးပါဘူး။ တစ်နည်းပြောရရင် — property တွေရဲ့ references တွေကိုပဲ နှိုင်းယှဉ်တာပါ။

အောက်က ဥပမာမှာ `shallow` function က `false` ပြန်ပါတယ် — ဘာလို့လဲဆိုတော့ သူက top-level property တွေနဲ့ သူတို့ရဲ့ references တွေကိုပဲ နှိုင်းယှဉ်လို့ပါ။ Object နှစ်ခုလုံးမှာရှိတဲ့ `address` property က nested object တစ်ခု ဖြစ်ပြီး — သူတို့ရဲ့ ပါဝင်ပစ္စည်းတွေ အတူတူ ဖြစ်နေပေမယ့် references တွေကတော့ မတူပါဘူး။ အဲဒါကြောင့် shallow က သူတို့ကို မတူဘူးလို့ မြင်ပြီး `false` ပြန်တာပါ။

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> false
```

`address` property ကို ဖယ်လိုက်မယ်ဆိုရင် — shallow comparison က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ပါလိမ့်မယ်၊ ဘာလို့လဲဆိုတော့ top-level property တွေအားလုံးက primitive values တွေ ဒါမှမဟုတ် တူညီတဲ့ တန်ဖိုးတွေကို ညွှန်ပြတဲ့ references တွေ ဖြစ်နေလို့ပါ:

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

ဒီပြုပြင်ထားတဲ့ ဥပမာမှာ `objectLeft` နဲ့ `objectRight` တို့မှာ top-level property တွေနဲ့ primitive values တွေ အတူတူ ရှိပါတယ်။ `shallow` function က top-level property တွေကိုပဲ နှိုင်းယှဉ်တာမို့ — object နှစ်ခုလုံးမှာရှိတဲ့ primitive values တွေ (`firstName`, `lastName`, `age`) အတူတူ ဖြစ်နေလို့ `true` ပြန်မှာ ဖြစ်ပါတယ်။

### Prototype မတူညီတဲ့ objects တွေ နှိုင်းယှဉ်ခြင်း

`shallow` function က object နှစ်ခုရဲ့ prototype တွေ တူမတူလည်း စစ်ဆေးပါတယ်။ သူတို့ရဲ့ prototypes တွေ referentially မတူညီဘူးဆိုရင် — shallow က `false` ပြန်ပါလိမ့်မယ်။ ဒီနှိုင်းယှဉ်မှုကို ဒီလိုလုပ်ပါတယ်:

```ts
Object.getPrototypeOf(a) === Object.getPrototypeOf(b)
```

> **အရေးကြီး:** Object initializer (`{}`) ဒါမှမဟုတ် `new Object()` နဲ့ ဖန်တီးထားတဲ့ objects တွေက default အားဖြင့် `Object.prototype` ကနေ အမွေဆက်ခံပါတယ်။ ဒါပေမယ့် `Object.create(proto)` နဲ့ ဖန်တီးထားတဲ့ objects တွေကတော့ — သင်ပေးလိုက်တဲ့ `proto` ကနေ အမွေဆက်ခံပြီး အဲဒါက `Object.prototype` မဟုတ်နိုင်ပါဘူး။

```ts
const a = Object.create({}) // -> prototype က `{}`
const b = {} // -> prototype က `Object.prototype`

shallow(a, b) // -> false
```
