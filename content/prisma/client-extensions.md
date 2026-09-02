---
title: "Client Extensions"
description: "Prisma Client ရဲ့ လုပ်ဆောင်ချက်တွေကို တိုးချဲ့နည်း — model, client, query, result component တွေ၊ $extends နဲ့ extended client ဆောက်ခြင်း၊ extensions အများအပြား ပေါင်းသုံးခြင်းနဲ့ type များ"
order: 21
source: "https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions"
status: translated
updated: 2026-09-02
---

**Prisma Client extensions** တွေကို သုံးပြီး — သင့် model တွေ၊ result object တွေ၊ query တွေကို လုပ်ဆောင်ချက် အသစ်တွေ ထည့်နိုင်သလို client-level method တွေလည်း ထည့်လို့ရပါတယ်။

Extension တစ်ခုကို အောက်က component type တစ်ခု ဒါမှမဟုတ် အများအပြားနဲ့ ဖန်တီးပါတယ်:

- **`model`** — [model တွေမှာ custom method ဒါမှမဟုတ် field တွေ ထည့်ခြင်း](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/model)
- **`client`** — [Prisma Client မှာ client-level method တွေ ထည့်ခြင်း](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/client)
- **`query`** — [Prisma Client ရဲ့ custom query တွေ ဖန်တီးခြင်း](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/query) — query တစ်ခုရဲ့ ဘဝစက်ဝိုင်း (life-cycle) ထဲ ဝင်ပြီး ပြင်ဆင်တာ
- **`result`** — [query result တွေမှာ custom field တွေ ထည့်ခြင်း](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/result)

ဥပမာ — `model` နဲ့ `client` component နှစ်မျိုးလုံး သုံးတဲ့ extension တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

## Prisma Client extensions အကြောင်း

Extension တစ်ခု သုံးလိုက်တာနဲ့ **extended client** တစ်ခု ဖန်တီးရာရောက်ပါတယ်။ Extended client ဆိုတာ — extension တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရစ်ပတ်ထားတဲ့ standard Prisma Client ရဲ့ lightweight variant တစ်ခုပါ။ Standard client ကိုတော့ ဘယ်လိုမှ ပြောင်းလဲ (mutate) မခံရပါဘူး — သင့် project ထဲမှာ extended client ဘယ်နှစ်ခုဖြစ်ဖြစ် ထပ်ထည့်လို့ရပါတယ်။

Extended client တစ်ခုမှာ extension တစ်ခုတည်း ဒါမှမဟုတ် အများအပြားကို တွဲထားလို့ရပါတယ်။ ကိုယ်ရေးထားတဲ့ extension တွေကို တခြား Prisma ORM သုံးသူတွေနဲ့ [မျှဝေနိုင်သလို](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/shared-extensions) — တခြားသူတွေ ရေးထားတဲ့ extension တွေကိုလည်း [project ထဲကို import လုပ်သုံးလို့ရပါတယ်](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/shared-extensions#install-a-shared-packaged-extension)။

### Extended clients တွေ ဘယ်လို အပြန်အလှန် ဆက်ဆံလဲ

Extended client တွေက standard client နဲ့ရော အချင်းချင်းရော ဒီလို ဆက်ဆံပါတယ်:

- Extended client တစ်ခုစီက သီးခြား instance တစ်ခုအနေနဲ့ လွတ်လပ်စွာ အလုပ်လုပ်ပါတယ်။
- Extended client တွေက တစ်ခုနဲ့တစ်ခု ဒါမှမဟုတ် standard client နဲ့ conflict ဖြစ်လို့ မရပါဘူး။
- Extended client တွေ အားလုံးနဲ့ standard client က connection pool တစ်ခုတည်းကို မျှဝေသုံးပါတယ်။

> **မှတ်ချက်:** Extension ရဲ့ ရေးသားသူက ဒီအပြုအမူတွေကို ပြောင်းလဲပစ်နိုင်ပါတယ် — extension ထဲမှာ code မဆို run လို့ရလို့ပါ။ ဥပမာ — extension တစ်ခုက PrismaClient instance အသစ် လုံးလုံး (ကိုယ်ပိုင် query engine နဲ့ connection pool အပါအဝင်) ဖန်တီးပစ်လို့ရပါတယ်။ သုံးမယ့် extension တစ်ခုချင်းစီရဲ့ documentation ကို စစ်ပြီး သူ့ရဲ့ ထူးခြားတဲ့ အပြုအမူတွေ ရှိမရှိ သေချာ ကြည့်ပါ။

### Extended clients တွေရဲ့ အသုံးဝင်တဲ့ နေရာတွေ

Extended client တွေက instance သီးခြား လည်ပတ်နိုင်လို့ — ဥပမာ ဒီလို ကိစ္စတွေမှာ ကောင်းကောင်း သုံးလို့ရပါတယ်:

- **Row-level security (RLS)** — HTTP request တစ်ခုချင်းစီအတွက် ကိုယ်ပိုင် RLS extension ပါတဲ့ client တစ်ခုစီ ထားပြီး session data နဲ့ customize လုပ်တာ။ User တစ်ယောက်ချင်းစီကို client တစ်ခုစီနဲ့ လုံးဝ သီးခြားထားနိုင်ပါတယ်။
- `User` model မှာ `user.current()` method တစ်ခု ထည့်ပြီး — လက်ရှိ login ဝင်နေတဲ့ user ကို ပြန်ပေးတာ။
- Debug cookie တစ်ခု ရှိနေရင် request တွေရဲ့ logging ကို ပိုပြီး အသေးစိတ် (verbose) ဖွင့်ပေးတာ။
- Log တိုင်းမှာ request id သီးခြား တစ်ခု တွဲထည့်ထားပြီး — နောက်ပိုင်း Prisma Client ရဲ့ လုပ်ဆောင်ချက်တွေကို ဆက်စပ်ပြီး ခွဲခြမ်းစိတ်ဖြာလို့ရအောင် လုပ်တာ။
- App က admin endpoint ကို မခေါ်ဘူး၊ ဒါမှမဟုတ် user မှာ လိုအပ်တဲ့ privilege မရှိဘူးဆိုရင် — model တွေကနေ `delete` method ကို ဖြုတ်ပစ်လိုက်တာ။

## Prisma Client မှာ extension တစ်ခု ထည့်ခြင်း

Extension တစ်ခုကို ဖန်တီးဖို့ နည်း အဓိက နှစ်နည်း ရှိပါတယ်:

- Client-level [`$extends`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#client-methods) method ကို တိုက်ရိုက် သုံးတာ

  ```ts
  const prisma = new PrismaClient().$extends({
    name: 'signUp', // Optional: name appears in error logs
    model: {        // This is a `model` component
      user: { ... } // The extension logic for the `user` model goes inside the curly braces
    },
  })
  ```

- `Prisma.defineExtension` method နဲ့ extension ကို variable တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — အဲဒီ extension ကို client-level `$extends` method ဆီ ပေးတာ

  ```ts
  import { Prisma } from '@prisma/client'

  // Define the extension
  const myExtension = Prisma.defineExtension({
    name: 'signUp', // Optional: name appears in error logs
    model: {        // This is a `model` component
      user: { ... } // The extension logic for the `user` model goes inside the curly braces
    },
  })

  // Pass the extension to a Prisma Client instance
  const prisma = new PrismaClient().$extends(myExtension)
  ```

  > **အကြံပြုချက်:** ဒီပုံစံက — extension တွေကို project ထဲမှာ file ဒါမှမဟုတ် directory အများအပြား ခွဲထားချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

အပေါ်က ဥပမာ နှစ်ခုလုံးက [`model` extension component](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/model) နဲ့ `User` model ကို extension လုပ်ထားတာပါ။ သင့် `$extends` ထဲမှာ လိုအပ်တဲ့ component တစ်ခု ဒါမှမဟုတ် အများအပြား — [`model`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/model), [`client`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/client), [`result`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/result), [`query`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/query) — ကို သုံးပါ။

## Extension တွေကို error log ထဲမှာ ခွဲခြားသိရအောင် name ပေးခြင်း

Extension တွေကို error log တွေထဲမှာ မှတ်မိလွယ်အောင် — optional `name` field နဲ့ နာမည် ပေးလို့ရပါတယ်။ ဥပမာ:

```ts
const prisma = new PrismaClient().$extends({
  name: `signUp`,  // (Optional) Extension name
  model: {
    user: { ... }
 },
})
```

## Extensions အများအပြား

Extension တစ်ခုကို extended client တစ်ခုနဲ့ ချိတ်တွဲတဲ့ နည်း နှစ်နည်း ရှိပါတယ်:

- ကိုယ်ပိုင် extended client တစ်ခုတည်းနဲ့ သီးခြား ချိတ်တာ၊ ဒါမှမဟုတ်
- တခြား extension တွေနဲ့ ပေါင်းပြီး extended client တစ်ခုတည်းမှာ အကုန် ချိတ်တာ — ဒီအခါ ပေါင်းထားတဲ့ extension တွေရဲ့ လုပ်ဆောင်ချက်တွေ အကုန် extended client တစ်ခုတည်းပေါ်မှာ သက်ရောက်ပါတယ်။ (ပေါင်းထားတဲ့ extension တွေ conflict ဖြစ်နိုင်တာကို အောက်မှာ သတိပြုပါ။)

ဒီနည်း နှစ်နည်းကို ရောပြီးလည်း သုံးလို့ရပါတယ် — ဥပမာ extension တစ်ခုကို extended client တစ်ခုတည်းနဲ့ ချိတ်ပြီး၊ နောက် extension နှစ်ခုကို extended client နောက်တစ်ခုမှာ ပေါင်းထည့်တာမျိုးပါ။ Client instance တွေ အချင်းချင်း ဘယ်လို ဆက်ဆံလဲဆိုတာကို အပေါ်က extended clients အကြောင်း ရှင်းလင်းချက်မှာ ပြန်ကြည့်နိုင်ပါတယ်။

### Extended client တစ်ခုမှာ extension အများအပြား apply လုပ်ခြင်း

အောက်က ဥပမာမှာ `extensionA` နဲ့ `extensionB` ဆိုတဲ့ extension နှစ်ခု ရှိတယ် ဆိုပါစို့ — ဒီနှစ်ခုကို ပေါင်းစပ်ဖို့ နည်း နှစ်နည်း ရှိပါတယ်။

#### Option 1 — client အသစ်ကို တစ်ကြောင်းတည်းမှာ ကြေညာခြင်း

ဒီနည်းက extension နှစ်ခုလုံးကို client အသစ်တစ်ခုပေါ်မှာ တစ်ကြောင်းတည်း apply လုပ်တာပါ:

```ts
// First of all, store your original Prisma Client in a variable as usual
const prisma = new PrismaClient();

// Declare an extended client that has an extensionA and extensionB
const prismaAB = prisma.$extends(extensionA).$extends(extensionB);
```

ပြီးရင် code ထဲမှာ `prismaAB` ကို ဒီလို သုံးလို့ရပါတယ် — `prismaAB.myExtensionMethod()` ပေါ့။

#### Option 2 — extended client အများအပြား ကြေညာခြင်း

ဒီနည်းရဲ့ အားသာချက်က — extended client တစ်ခုချင်းစီကို သီးခြားစီ ခေါ်လို့ရတာပါ:

```ts
// First of all, store your original Prisma Client in a variable as usual
const prisma = new PrismaClient();

// Declare an extended client that has extensionA applied
const prismaA = prisma.$extends(extensionA);

// Declare an extended client that has extensionB applied
const prismaB = prisma.$extends(extensionB);

// Declare an extended client that is a combination of clientA and clientB
const prismaAB = prismaA.$extends(extensionB);
```

Code ထဲမှာ ဒီ client တွေ ထဲက ဘယ်ဟာကိုမဆို သီးခြားစီ ခေါ်လို့ရပါတယ် — `prismaA.myExtensionMethod()`၊ `prismaB.myExtensionMethod()` ဒါမှမဟုတ် `prismaAB.myExtensionMethod()` ပေါ့။

### ပေါင်းစပ်ထားတဲ့ extension တွေမှာ conflict ဖြစ်ခြင်း

Extension နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုကို extended client တစ်ခုထဲ ပေါင်းတဲ့အခါ — conflict ဖြစ်ရင် **နောက်ဆုံး ကြေညာထားတဲ့ extension** က အနိုင်ရပါတယ်။ Option 1 ရဲ့ ဥပမာမှာ `myExtensionMethod()` က extensionA ရော extensionB မှာပါ ရှိတယ် ဆိုပါစို့ — `prismaAB.myExtensionMethod()` ကို ခေါ်တဲ့အခါ Prisma Client က extensionB ထဲက `myExtensionMethod()` ကို သုံးပါတယ်။

### query extension တွေနဲ့ middleware chaining

[`query`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/query) extension တွေကို ဆက်တိုက် chain လုပ်ပြီး middleware တွေ ပေါင်းစပ်လို့ရပါတယ်။ Extension တွေက ကြေညာထားတဲ့ အစီအစဉ်အတိုင်း — first in, first out — run ပါတယ်:

```ts
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient()
  // Extension 1: Logging - measures query execution time
  .$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = Date.now();
          const result = await query(args);
          console.log(`[LOGGING] ${model}.${operation}: ${Date.now() - start}ms`);
          return result;
        },
      },
    },
  })
  // Extension 2: Audit - logs write operations
  .$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (["create", "update", "delete"].includes(operation)) {
            console.log(`[AUDIT] ${operation} on ${model}:`, JSON.stringify(args));
          }
          return query(args);
        },
      },
    },
  });
```

ဒီဥပမာမှာ extension 1 က query တစ်ခုစီရဲ့ execution time ကို တိုင်းပြီး log လုပ်ပြီး — extension 2 က write operation တွေ (`create`, `update`, `delete`) ကို audit log ထုတ်ပါတယ်။ ဒီလို ပုံစံမျိုးနဲ့ — logging, validation, authorization စတဲ့ လုပ်ငန်းဆောင်တာတွေကို query များစွာအတွက် တစ်နေရာတည်းက စီမံနိုင်ပါတယ်။

## Extended client ရဲ့ type

Extended Prisma Client instance ရဲ့ type ကို [`typeof`](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html) utility နဲ့ ဒီလို ရယူနိုင်ပါတယ်:

```ts
const extendedPrismaClient = new PrismaClient().$extends({
  /** extension */
});

type ExtendedPrismaClient = typeof extendedPrismaClient;
```

Prisma Client ကို singleton အနေနဲ့ သုံးနေတယ်ဆိုရင် — `typeof` နဲ့ [`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) utility တွေ ပေါင်းပြီး extended client ရဲ့ type ကို ရယူပါတယ်:

```ts
function getExtendedClient() {
  return new PrismaClient().$extends({
    /* extension */
  });
}

type ExtendedPrismaClient = ReturnType<typeof getExtendedClient>;
```

## Prisma.Result နဲ့ model type တွေကို တိုးချဲ့ခြင်း

[`Prisma.Result`](https://www.prisma.io/docs/orm/v7/prisma-client/client-extensions/type-utilities) type utility ကို သုံးပြီး — client extension တွေက ထည့်လိုက်တဲ့ property တွေ ပါဝင်အောင် model type တွေကို တိုးချဲ့လို့ရပါတယ်။ ဒါဆိုရင် extended model ရဲ့ type ကို — extended property တွေ အပါအဝင် — TypeScript က သူ့အလိုလို သိရှိနိုင်ပါတယ် (type inference)။

### ဥပမာ

အောက်က ဥပမာက `Prisma.Result` ကို သုံးပြီး — client extension ကနေ ထည့်ထားတဲ့ `__typename` property ပါအောင် `User` model ရဲ့ type ကို တိုးချဲ့ထားတာပါ:

```ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      __typename: {
        needs: {},
        compute() {
          return "User";
        },
      },
    },
  },
});

type ExtendedUser = Prisma.Result<typeof prisma.user, { select: { id: true } }, "findFirstOrThrow">;

async function main() {
  const user: ExtendedUser = await prisma.user.findFirstOrThrow({
    select: {
      id: true,
      __typename: true,
    },
  });

  console.log(user.__typename); // Output: 'User'
}

main();
```

ဒီဥပမာက `result` component ရဲ့ အသုံးဝင်ပုံကို ပြတာပါ — field တစ်ခုကို တခြား field တွေအပေါ် အခြေခံပြီး **compute** (တွက်ထုတ်) လုပ်နိုင်ပါတယ် (`needs` ထဲမှာ လိုအပ်တဲ့ field တွေကို ကြေညာပြီး `compute` ထဲမှာ တန်ဖိုး ထုတ်ပေးတာ)။ ဒီလို computed field တွေကို — `fullName` လို field နှစ်ခု ပေါင်းထားတဲ့ တန်ဖိုးမျိုး ထည့်ချင်တဲ့အခါ သုံးလေ့ ရှိပါတယ်။

## ကန့်သတ်ချက်များ

### Extended client တွေမှာ client-level method တွေ သုံးခြင်း

[Client-level method](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#client-methods) တွေက extended client တွေပေါ်မှာ မရှိနိုင်ဘူးလို့ မဆိုလိုပါဘူး — သုံးခင် method ရှိမရှိ အရင်စစ်ဖို့ လိုပါတယ်:

```ts
const xPrisma = new PrismaClient().$extends(...);

if (xPrisma.$connect) {
  xPrisma.$connect()
}
```

### Nested operations တွေနဲ့ သုံးခြင်း

`query` extension type က nested read နဲ့ write operations တွေကို ထောက်ပံ့မပေးပါဘူး။

## နောက်တစ်ဆင့်

- [Prisma Client အသုံးပြုခြင်း](/docs/prisma/prisma-client) — client ဖွဲ့စည်းပုံ၊ singleton pattern နဲ့ client extension အကျဉ်းချုပ်
- [Logging (Prisma ရဲ့ Log)](/docs/prisma/logging) — `$on()` နဲ့ event-based logging အသေးစိတ်
- [Middleware တွေ ဘယ်လို အလုပ်လုပ်လဲ](/docs/prisma/how-middleware-works) — Prisma 8 မှာ query တွေကို wrap လုပ်တဲ့ ချဉ်းကပ်ပုံ
- [Query အသေးစိတ် (CRUD)](/docs/prisma/queries) — extension နဲ့ ပေါင်းစပ်ထားတဲ့ CRUD query တွေ ရေးနည်း
