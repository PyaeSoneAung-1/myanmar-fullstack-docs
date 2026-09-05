---
title: "Unions and Intersections (Union နှင့် Intersection များ)"
description: "Union type နဲ့ intersection type ဆိုတာ ဘာလဲ — types တွေကို ပေါင်းစပ်ဖွဲ့စည်းခြင်း, discriminated unions, exhaustiveness checking, common fields နဲ့ error handling ပေါင်းစပ်ခြင်း ဥပမာများ"
order: 80
source: "https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html"
status: translated
updated: 2026-09-05
---

ဒီအထိ — handbook မှာ atomic objects တွေဖြစ်တဲ့ types တွေကို ဖော်ပြခဲ့ပါတယ်။ ဒါပေမယ့် — types တွေ ပိုများများ model လုပ်လာတာနဲ့အမျှ — types တွေကို အစကနေ ဖန်တီးနေတာအစား — ရှိပြီးသား types တွေကို ပေါင်းစပ်ဖွဲ့စည်းခွင့်ပေးတဲ့ tools တွေကို သင်ကိုယ်တိုင် ရှာနေတာကို တွေ့ရပါလိမ့်မယ်။

Intersection နဲ့ Union types တွေက — types တွေကို ပေါင်းစပ်ဖွဲ့စည်းနိုင်တဲ့ နည်းလမ်းတွေထဲက တစ်ခုပါ။

## Union Types (Union Types များ)

ရံဖန်ရံခါ — parameter တစ်ခုကို `number` ဒါမှမဟုတ် `string` ဖြစ်ဖို့ မျှော်လင့်တဲ့ library တစ်ခုကို ကြုံတွေ့ရပါလိမ့်မယ်။ ဥပမာ — အောက်က function ကို ကြည့်ပါ:

```ts twoslash
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${typeof padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
```

အပေါ်က ဥပမာထဲက `padLeft` ရဲ့ ပြဿနာက — ၎င်းရဲ့ `padding` parameter ကို `any` အဖြစ် typed လုပ်ထားတာပါ။ ဆိုလိုတာက — `number` ရော `string` ရော မဟုတ်တဲ့ argument တစ်ခုနဲ့ ၎င်းကို ခေါ်လို့ရပြီး — TypeScript က အဆင်ပြေပါလိမ့်မယ်။

```ts twoslash
declare function padLeft(value: string, padding: any): string;
// ---cut---
// passes at compile time, fails at runtime.
let indentedString = padLeft("Hello world", true);
```

ရိုးရာ object-oriented code တွေမှာ — types တွေရဲ့ hierarchy (အဆင့်ဆင့်) တစ်ခုကို ဖန်တီးခြင်းအားဖြင့် type နှစ်ခုအပေါ် ကျော်လွန်၍ ခြုံငုံနိုင်ပါတယ်။ ဒါက အများကြီး ပိုရှင်းလင်းပေမယ့် — နည်းနည်း အလွန်အကျွံလည်း ဖြစ်ပါတယ်။ `padLeft` ရဲ့ မူရင်း version ရဲ့ ကောင်းတဲ့အချက်တွေထဲက တစ်ခုက — primitives တွေကို တိုက်ရိုက် ထည့်ပေးလို့ရတာပါ။ ဆိုလိုတာက — အသုံးပြုမှုက ရိုးရှင်းပြီး တိုတောင်းပါတယ်။ ဒီချဉ်းကပ်နည်းသစ်က — တခြားနေရာမှာ ရှိပြီးသား function တစ်ခုကို သုံးဖို့ ကြိုးစားနေရုံသာဆိုရင်လည်း အထောက်အကူ ဖြစ်မှာ မဟုတ်ပါဘူး။

`any` အစား — `padding` parameter အတွက် _union type_ တစ်ခုကို သုံးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2345
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: string | number) {
  // ...
}

let indentedString = padLeft("Hello world", true);
```

Union type တစ်ခုက — types အများအပြားထဲက တစ်ခု ဖြစ်နိုင်တဲ့ value တစ်ခုကို ဖော်ပြပါတယ်။ Type တစ်ခုချင်းစီကို ခွဲခြားဖို့ vertical bar (`|`) ကို သုံးပါတယ် — ဒါကြောင့် `number | string | boolean` ဆိုတာ `number`၊ `string` ဒါမှမဟုတ် `boolean` ဖြစ်နိုင်တဲ့ value တစ်ခုရဲ့ type ပါ။

### Unions with Common Fields (Common Fields ပါသော Unions)

Union type တစ်ခုဖြစ်တဲ့ value တစ်ခု ရှိရင် — union ထဲက types တွေ အားလုံးမှာ ဘုံဖြစ်တဲ့ members တွေကိုပဲ ဝင်ရောက်နိုင်ပါတယ်။

```ts twoslash
// @errors: 2339

interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
pet.layEggs();

// Only available in one of the two possible types
pet.swim();
```

Union types တွေက ဒီနေရာမှာ နည်းနည်း စိတ်ညစ်စရာ ကောင်းနိုင်ပေမယ့် — ကျင့်သားရဖို့ အလိုလိုသိမြင်မှု (intuition) နည်းနည်းပဲ လိုပါတယ်။ Value တစ်ခုမှာ `A | B` type ရှိရင် — `A` ရော `B` ရော နှစ်ခုလုံးမှာ ရှိတဲ့ members တွေပဲ ရှိတယ်ဆိုတာကိုပဲ _သေချာပေါက်_ သိပါတယ်။ ဒီဥပမာမှာ — `Bird` မှာ `fly` ဆိုတဲ့ member ရှိပါတယ်။ `Bird | Fish` လို့ typed လုပ်ထားတဲ့ variable တစ်ခုမှာ `fly` method ရှိမရှိကို သေချာ မပြောနိုင်ပါဘူး။ Variable က runtime မှာ တကယ် `Fish` ဖြစ်နေရင် — `pet.fly()` ကို ခေါ်တာက ကျရှုံးပါလိမ့်မယ်။

### Discriminating Unions (Discriminating Unions များ)

Unions တွေနဲ့ အလုပ်လုပ်ဖို့ သုံးလေ့ရှိတဲ့ နည်းလမ်းတစ်ခုက — literal types တွေကို သုံးတဲ့ field တစ်ခုတည်း ထားရှိပြီး — အဲဒါကနေတစ်ဆင့် TypeScript က ဖြစ်နိုင်တဲ့ လက်ရှိ type ကို ကျဉ်းမြောင်းအောင် (narrow down) လုပ်နိုင်စေတာပါ။ ဥပမာ — ဘုံ field တစ်ခုတည်း ရှိတဲ့ type သုံးခုရဲ့ union တစ်ခုကို ဖန်တီးပါမယ်။

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

// Create a type which represents only one of the above types
// but you aren't sure which it is yet.
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;
```

အပေါ်က types တွေ အားလုံးမှာ `state` ဆိုတဲ့ field ရှိပြီး — ၎င်းတို့မှာ ကိုယ်ပိုင် fields တွေလည်း ရှိပါတယ်:

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
|---|---|---|
| state | state | state |
|  | code | response |

`state` field က `NetworkState` ထဲက type တိုင်းမှာ ဘုံဖြစ်တာမို့ — existence check (ရှိမရှိ စစ်ဆေးခြင်း) မလုပ်ဘဲ ဝင်ရောက်တာက သင့် code အတွက် အန္တရာယ်ကင်းပါတယ်။

`state` ကို literal type တစ်ခုအနေနဲ့ ထားပြီး — `state` ရဲ့ တန်ဖိုးကို ညီမျှတဲ့ string နဲ့ နှိုင်းယှဉ်ကြည့်နိုင်ပြီး — ဘယ် type ကို လက်ရှိ သုံးနေလဲဆိုတာကို TypeScript က သိပါလိမ့်မယ်။

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
|---|---|---|
| "loading" | "failed" | "success" |

ဒီကိစ္စမှာ — runtime မှာ ဘယ် type ကို ကိုယ်စားပြုနေလဲဆိုတာ ကျဉ်းမြောင်းအောင် လုပ်ဖို့ `switch` statement တစ်ခုကို သုံးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2339
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// ---cut---
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function logger(state: NetworkState): string {
  // Right now TypeScript does not know which of the three
  // potential types state could be.

  // Trying to access a property which isn't shared
  // across all types will raise an error
  state.code;

  // By switching on state, TypeScript can narrow the union
  // down in code flow analysis
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // The type must be NetworkFailedState here,
      // so accessing the `code` field is safe
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}
```

### Union Exhaustiveness checking (Union Exhaustiveness စစ်ဆေးခြင်း)

Discriminated union ရဲ့ variants (မျိုးကွဲများ) အားလုံးကို လွှမ်းခြုံမထားတဲ့အခါ compiler က ပြောပြစေချင်ပါတယ်။ ဥပမာ — `NetworkFromCachedState` ကို `NetworkState` ထဲ ထည့်လိုက်ရင် — `logger` ကိုပါ update လုပ်ဖို့ လိုပါတယ်:

```ts twoslash
// @errors: 2366
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// ---cut---
type NetworkFromCachedState = {
  state: "from_cache";
  id: string;
  response: NetworkSuccessState["response"];
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;

function logger(s: NetworkState) {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

ဒါလုပ်ဖို့ နည်း နှစ်နည်း ရှိပါတယ်။ ပထမနည်းက — [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ကို ဖွင့်ပြီး return type တစ်ခု သတ်မှတ်ခြင်းပါ:

```ts twoslash
// @errors: 2366
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = { state: "success" };
type NetworkFromCachedState = { state: "from_cache" };

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;

// ---cut---
function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

`switch` က နောက်တော့ exhaustive (အကုန်လွှမ်းခြုံ) မဟုတ်တော့တာမို့ — function က တစ်ခါတစ်ရံ `undefined` ကို return လုပ်နိုင်တယ်ဆိုတာ TypeScript က သိပါတယ်။ Explicit return type `string` တစ်ခု ရှိရင် — return type က တကယ်တော့ `string | undefined` ဖြစ်နေတယ်ဆိုတဲ့ error တစ်ခု ရပါလိမ့်မယ်။ ဒါပေမယ့် — ဒီနည်းလမ်းက အတော်လေး သိမ်မွေ့ပြီး — ဒါ့အပြင် — [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) က အဟောင်း code တွေနဲ့ အမြဲတမ်း အလုပ်မဖြစ်ပါဘူး။

ဒုတိယ နည်းလမ်းက — compiler က exhaustiveness စစ်ဆေးဖို့ သုံးတဲ့ `never` type ကို အသုံးပြုပါတယ်:

```ts twoslash
// @errors: 2345
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = { state: "success" };
type NetworkFromCachedState = { state: "from_cache" };

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;
// ---cut---
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
    default:
      return assertNever(s);
  }
}
```

ဒီမှာ — `assertNever` က `s` က `never` type ဖြစ်ကြောင်း စစ်ဆေးပါတယ် — အဲဒါက cases တခြား အားလုံးကို ဖယ်ရှားပြီးနောက် ကျန်ရစ်တဲ့ type ပါ။ Case တစ်ခုကို မေ့သွားရင် — `s` မှာ တကယ့် type တစ်ခု ရှိနေပြီး — type error တစ်ခု ရပါလိမ့်မယ်။ ဒီနည်းလမ်းက အပို function တစ်ခုကို သတ်မှတ်ဖို့ လိုအပ်ပေမယ့် — error message ထဲမှာ ပျောက်နေတဲ့ type နာမည် ပါဝင်တာမို့ — မေ့သွားတဲ့အခါ အများကြီး ပိုပြီး သိသာပါတယ်။

## Intersection Types (Intersection Types များ)

Intersection types တွေက union types တွေနဲ့ နီးကပ်စွာ ဆက်စပ်ပေမယ့် — အသုံးပြုပုံကတော့ အရမ်းကို ကွဲပြားပါတယ်။ Intersection type တစ်ခုက types အများအပြားကို တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ပါတယ်။ ဒါက — ရှိပြီးသား types တွေကို ပေါင်းစပ်ပြီး — သင်လိုအပ်တဲ့ features တွေ အားလုံး ပါတဲ့ type တစ်ခုတည်းကို ရရှိစေပါတယ်။ ဥပမာ — `Person & Serializable & Loggable` ဆိုတာ `Person` _ရော_ `Serializable` _ရော_ `Loggable` _ရော_ အားလုံး ဖြစ်တဲ့ type တစ်ခုပါ။ ဆိုလိုတာက — ဒီ type ရဲ့ object တစ်ခုမှာ type သုံးခုလုံးရဲ့ members တွေ အားလုံး ရှိပါလိမ့်မယ်။

ဥပမာ — တစ်သမတ်တည်း error handling ရှိတဲ့ networking requests တွေ ရှိမယ်ဆိုရင် — error handling ကို သီးခြား type တစ်ခုအဖြစ် ခွဲထုတ်ပြီး — response type တစ်ခုတည်းနဲ့ ကိုက်ညီတဲ့ types တွေနဲ့ ပေါင်းစပ်နိုင်ပါတယ်။

```ts twoslash
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces are composed to have
// consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```
