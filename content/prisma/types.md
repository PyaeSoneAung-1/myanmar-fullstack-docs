---
title: "သင့် Code အတွက် Types (Types for your code)"
description: "Prisma ORM 8 မှာ row တစ်ခု၊ query result တစ်ခု ဒါမှမဟုတ် create၊ update၊ filter argument တွေရဲ့ type ကို နာမည်ပေးပုံနဲ့ Prisma ORM 7 က အမည်တွေနဲ့ တွဲဖက်ချက်"
order: 40
source: "https://www.prisma.io/docs/orm/fundamentals/types"
status: translated
updated: 2026-11-06
---

Function တစ်ခုက user တစ်ယောက်ကို return လုပ်တဲ့အခါ ဒါမှမဟုတ် filter တစ်ခုကို လက်ခံတဲ့အခါ — field တွေကို ထပ်ခါထပ်ခါ ရေးမယ့်အစား အဲဒီ type ကို နာမည်ပေးချင်ပါတယ်။ ဒီ page မှာ နှစ်မျိုးလုံးအတွက် types တွေကို ပြထားပါတယ် — PostgreSQL ကို အရင်ပြပြီး နောက်မှ MongoDB ကို ပြပါမယ်။

Types တွေက သင့် contract ဖြစ်တဲ့ `src/prisma/contract.prisma` — model တွေ ကြေညာတဲ့ file — ကနေ စပါတယ်။ အဲဒါကို ပြောင်းတိုင်း `npx prisma contract emit` ကို run ပါ; contract ရဲ့ဘေးမှာ model တစ်ခုလျှင် type တစ်ခုပါတဲ့ `contract.d.ts` ကို ရေးပေးပါတယ်။ အဲဒီ type ကို ဒီ page ထဲက helper types တွေဆီ ပေးပို့ပါတယ်။ အဲဒါတွေက သင့် app သုံးနေပြီးသား package ဖြစ်တဲ့ `@prisma/orm-postgres` ကနေ လာပါတယ်။ Example တွေထဲက `db` က `src/prisma/db.ts` ကနေ `import { db } from "./prisma/db";` နဲ့ import လုပ်ထားတဲ့ client ပါ။

Example တွေမှာ ဒီ contract ကို သုံးထားပါတယ်:

```prisma title="src/prisma/contract.prisma"
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

## Model တွေရဲ့ Type (Model types)

`contract.d.ts` က `Models` (model တစ်ခုလျှင် type တစ်ခု) နဲ့ `Contract` (contract တစ်ခုလုံးရဲ့ type — အောက်မှာ ပါတဲ့ argument types တွေအတွက် လိုအပ်ပါတယ်) ကို export လုပ်ပါတယ်။ ကိုယ့် file ကနေ ဆက်စပ်တဲ့ path နဲ့ import ပါ; `src/` ထဲက file တစ်ခုကဆိုရင် ဒီလိုပါ:

```ts
import type { Contract, Models } from "./prisma/contract.d";
```

PostgreSQL မှာ model တစ်ခုရဲ့ type နာမည်က သူ့ table ရှိတဲ့ PostgreSQL schema နဲ့ စပါတယ်။ ဒါကြောင့် default `public` schema ထဲက model တစ်ခုက `Models.public_User` ဖြစ်ပါတယ်။ Model type တစ်ခုမှာ scalar field တိုင်းနဲ့ relation တိုင်း ပါပါတယ်။ Query တစ်ခုမှ အဲဒါအားလုံးကို ပြန်မပေးပါဘူး — ဒါကြောင့် row တစ်ခုရဲ့ type အနေနဲ့ မသုံးပါနဲ့။ အဲဒီအစား `Scalars` ဒါမှမဟုတ် `Shape` ဆီ ပေးပို့ပါ။

## Query တစ်ခု ပြန်ပေးတဲ့ Row (The row a query returns)

`Scalars<M>` ဆိုတာ scalar field တိုင်းပါပြီး relation မပါတဲ့ row တစ်ခုပါ။ `select()` ရော `include()` ရော မခေါ်ဘဲ `first()` နဲ့ `all()` ကို ခေါ်တဲ့အခါ အဲဒါကို ပြန်ပေးပါတယ်:

```ts
import type { Scalars } from "@prisma/orm-postgres/family-contract/types";

type User = Scalars<Models.public_User>;

async function getUser(id: number): Promise<User | null> {
  return db.orm.public.User.where({ id }).first();
}
```

`ResultType<typeof query>` ဆိုတာ သင် ရေးပြီးသား query တစ်ခုရဲ့ row ပါ။ Query က argument တစ်ခုအပေါ် မူတည်တဲ့အခါ — query ကို return လုပ်တဲ့ function တစ်ခုထဲ ထည့်ပြီး function က ပြန်ပေးတဲ့အရာရဲ့ type ကို ယူပါ:

```ts
import type { ResultType } from "@prisma/orm-postgres/components/runtime";

function userWithPosts(id: number) {
  return db.orm.public.User.where({ id }).include("posts");
}

type UserWithPosts = ResultType<ReturnType<typeof userWithPosts>>;
```

အဲဒီ query ပေါ်က `first()` က `UserWithPosts | null` ကို ပြန်ပေးပြီး `all()` က `UserWithPosts[]` ကို ပြန်ပေးပါတယ်။

## Row တစ်ခုရဲ့ Field တွေ ရွေးချယ်ခြင်း (Choose the fields of a row)

`Shape<M, Spec>` က သင် ရွေးချယ်တဲ့ field တွေနဲ့ relation တွေပါတဲ့ row တစ်ခုကို ဖော်ပြပါတယ်။ ဒါကြောင့် query မရေးခင် function တစ်ခု ဘာပြန်ပေးမလဲ ကြေညာနိုင်ပါတယ်။ Post အားလုံးပါတဲ့ user တစ်ယောက်ဆိုရင် ဒီလိုပါ:

```ts
import type { Shape } from "@prisma/orm-postgres/family-contract/types";

type UserWithPosts = Shape<Models.public_User, { "+": "posts" }>;

async function getUserWithPosts(id: number): Promise<UserWithPosts | null> {
  return db.orm.public.User.where({ id }).include("posts").first();
}
```

Query ရဲ့ result က အဲဒီ type နဲ့ တိုက်ရိုက် ကိုက်ညီလို့ function က တိုက်ရိုက် ပြန်ပေးပါတယ်။ ဒုတိယ argument ဖြစ်တဲ့ spec က ဒီလို အလုပ်လုပ်ပါတယ်:

* `"+"` က ဘာတွေ ထားရမလဲ ဖော်ပြပါတယ် — `"id" | "posts"` လိုမျိုး union တစ်ခုအနေနဲ့ပါ။ Scalar field တစ်ခုခုကို နာမည်ပေးရင် နာမည်ပေးထားတဲ့ scalar field တွေနဲ့ နာမည်ပေးထားတဲ့ relation တွေကိုပဲ ရပါတယ်။ Relation တွေကိုပဲ နာမည်ပေးရင်တော့ scalar field အားလုံးနဲ့ အဲဒီ relation တွေကို ရပါတယ်။ `"+"` ထဲက relation တစ်ခုက သူ့ရဲ့ scalar field အားလုံးနဲ့ လာပြီး သူ့ကိုယ်ပိုင် relation တွေ မပါပါဘူး။
* `"-"` က ချန်လှပ်မယ့် scalar field တွေကို ဖော်ပြပါတယ်။ Relation ကို ဖော်ပြလို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ သင် တောင်းမှပဲ row တစ်ခုမှာ relation တွေ ပါတာပါ။
* Spec တစ်ခုတည်းရဲ့ `"+"` နဲ့ `"-"` နှစ်ခုလုံးမှာ scalar field တွေကို နာမည်ပေးလို့ မရပါဘူး။
* ကျန်တဲ့ key တိုင်းက relation ဖြစ်ပြီး key တစ်ခုတည်းက row ထဲ ထည့်ပေးပါတယ်။ သူ့ value ကတော့ အဲဒီ relation ရဲ့ row တွေအတွက် spec ပါ — ဥပမာ `posts: { "+": "id" | "title" }`။
* `"+"` ရော `"-"` ရော မပါရင် scalar field အားလုံးကို ရပါတယ်။ ဒါကြောင့် `Shape<Models.public_User>` က `Scalars<Models.public_User>` နဲ့ အတူတူပါပဲ။

ဒီစည်းမျဉ်းတွေထဲက တစ်ခုကို ချိုးဖောက်တာ ဒါမှမဟုတ် model မှာ မရှိတဲ့ field တစ်ခုကို နာမည်ပေးတာက အဲဒီ key ကို ဖော်ပြတဲ့ TypeScript error ဖြစ်ပါတယ်။ Query တစ်ခုမှ မပြန်ပေးတဲ့ field တစ်ခု — ဥပမာ တွက်ချက်ထားတဲ့ count — ထည့်ချင်ရင် types တွေကို ပေါင်းပါ: `Shape<Models.public_User> & { postCount: number }`။

Type ထဲက field တစ်ခုကို ချန်လှပ်လိုက်တာက data ထဲကနေ ဖယ်ရှားတာ မဟုတ်ပါဘူး။ Type မှာ `email` မပါပေမယ့် `email` ပါနေတုန်း row တစ်ခုကို TypeScript က လက်ခံပါတယ်။ ဒါကြောင့် client ဆီ `email` မပို့ရမယ့် function တစ်ခုက လိုအပ်တဲ့ field တွေကိုပဲ select လုပ်သင့်ပါတယ်:

```ts
type PublicUser = Shape<Models.public_User, { "-": "email" }>;

async function getPublicUser(id: number): Promise<PublicUser | null> {
  return db.orm.public.User.where({ id }).select("id", "name").first();
}
```

## သင် ပေးပို့တဲ့ Argument တွေ (The arguments you pass in)

Argument types တွေက `@prisma/orm-postgres/orm-client` ကနေ လာပါတယ်။ တစ်ခုချင်းစီက `Contract` ကို အရင်ယူပြီး နောက် model နာမည်ကို ယူပါတယ်။ `ShorthandWhereFilter` နဲ့ `ModelAccessor` ကတော့ PostgreSQL schema ကိုပါ ယူပါသေးတယ် — example တွေမှာ ပြထားသလို တစ်ခုနဲ့တစ်ခု နေရာ မတူပါဘူး:

```ts
import type {
  CreateInput,
  ScalarUpdateInput,
  ShorthandWhereFilter,
  UniqueConstraintCriterion,
} from "@prisma/orm-postgres/orm-client";

function createUser(data: CreateInput<Contract, "User">) {
  return db.orm.public.User.create(data);
}

function updateUser(id: number, data: ScalarUpdateInput<Contract, "User">) {
  return db.orm.public.User.where({ id }).update(data);
}

function findUsers(filter: ShorthandWhereFilter<Contract, "public", "User">) {
  return db.orm.public.User.where(filter).all();
}

function findByKey(key: UniqueConstraintCriterion<Contract, "User">) {
  return db.orm.public.User.whereUnique(key).first();
}
```

* `CreateInput` ဆိုတာ `create()` လက်ခံတဲ့အရာပါ။ Default ရှိတဲ့ field က optional ဖြစ်ပြီး relation field တစ်ခုက ဆက်စပ် row တွေကို ဖန်တီးနိုင်ပါတယ် — ဥပမာ `posts: (p) => p.create([{ title: "Hello" }])` က Prisma ORM 7 ရဲ့ `posts: { create: [...] }` ကို အစားထိုးပါတယ်။ `create()` က row အသစ်ကို `Scalars<Models.public_User>` အနေနဲ့ ပြန်ပေးပါတယ်။
* `ScalarUpdateInput` ဆိုတာ `update()` လက်ခံတဲ့ scalar field တွေပါ၊ တစ်ခုချင်းစီ optional ပါ။ `connect` လိုမျိုး relation အပြောင်းအလဲတွေ မပါပါဘူး။ အဲဒါကို export လုပ်ထားတဲ့ type မရှိသေးလို့ — relation အပြောင်းအလဲတွေကို သင့် function ရဲ့ သီးသန့် argument တစ်ခုအနေနဲ့ ပေးပို့ပြီး `update()` ခေါ်တဲ့နေရာမှာ ရေးပါ။
* `ShorthandWhereFilter` ဆိုတာ object တစ်ခုအနေနဲ့ ရေးထားတဲ့ filter ပါ — ဥပမာ `{ name: "Ada" }` — field တွေရဲ့ တန်ဖိုးတွေ ညီတဲ့ row တွေကို match လုပ်ပါတယ်။ ဒုတိယ argument က model ရဲ့ PostgreSQL schema ပါ။
* `UniqueConstraintCriterion` ဆိုတာ `whereUnique()` လက်ခံတဲ့အရာပါ — `@id`၊ `@unique` field တစ်ခု ဒါမှမဟုတ် `@@unique` တစ်ခုရဲ့ field အားလုံး — ဥပမာ `{ email: "ada@example.com" }`။ ပြီးရင် `first()` က အဲဒီ row ဒါမှမဟုတ် `null` ကို ပြန်ပေးပါတယ်။

`ilike` ဒါမှမဟုတ် `or` လို operator တွေ သုံးတဲ့ filter၊ ဒါမှမဟုတ် relation တစ်ခုပေါ်မှာ filter လုပ်တဲ့ filter က object အစား function တစ်ခု ဖြစ်ပါတယ်။ Function က `ModelAccessor` ကို ယူပြီး `Condition` ကို ပြန်ပေးပါတယ်:

```ts
import { or, type Condition, type ModelAccessor } from "@prisma/orm-postgres/orm-client";

type UserFields = ModelAccessor<Contract, "User", "public">;

function findUsersWhere(filter: (user: UserFields) => Condition) {
  return db.orm.public.User.where(filter).all();
}

await findUsersWhere((user) => user.email.ilike("%@example.com"));
await findUsersWhere((user) => or(user.name.eq("Ada"), user.name.eq("Grace")));
await findUsersWhere((user) => user.posts.some((post) => post.title.eq("Hello")));
```

[Reading data](https://www.prisma.io/docs/orm/fundamentals/reading-data) မှာ operator တွေကို စာရင်းပြထားပါတယ်။

## Prisma ORM 7 ကနေ ပြောင်းလာသူများအတွက် (Coming from Prisma ORM 7)

Prisma ORM 8 မှာ `Prisma` namespace မရှိတော့ပါဘူး; အပေါ်က type တစ်ခုချင်းစီက Prisma ORM 7 က type တစ်ခုကို အစားထိုးပါတယ်:

| Prisma ORM 7 | Prisma ORM 8 |
| --- | --- |
| သင့် generated client ထဲက `User` | `Scalars<Models.public_User>` |
| `Prisma.UserGetPayload<{ include: { posts: true } }>` | `Shape<Models.public_User, { "+": "posts" }>` |
| `Prisma.UserGetPayload<{ select: { id: true; posts: { select: { title: true } } } }>` | `Shape<Models.public_User, { "+": "id"; posts: { "+": "title" } }>` |
| `Awaited<ReturnType<typeof getUsers>>` | အလုပ်လုပ်နေဆဲပါ; `ResultType<ReturnType<typeof userWithPosts>>` က query ပြန်ပေးတဲ့ function တစ်ခုရဲ့ row ကို နာမည်ပေးပါတယ် |
| `Prisma.UserCreateInput` | `CreateInput<Contract, "User">` |
| `Prisma.UserUpdateInput` | `ScalarUpdateInput<Contract, "User">` — scalar field တွေအတွက် |
| `Prisma.UserWhereInput` | equality အတွက် `ShorthandWhereFilter<Contract, "public", "User">`; operator နဲ့ relation filter တွေအတွက် `ModelAccessor` ရဲ့ function |
| `Prisma.UserWhereUniqueInput` | `UniqueConstraintCriterion<Contract, "User">` |

ပထမဆုံး သတိထားရမယ့် ကွာခြားချက်က ရိုးရိုး row မှာ ပါပါတယ်။ Prisma ORM 7 မှာ `User` type က scalar field တွေပဲ ပါပါတယ်။ Prisma ORM 8 မှာတော့ `Models.public_User` မှာ relation တိုင်းပါ ပါတယ် — ဒါကြောင့် ရိုးရိုး row က `Scalars<Models.public_User>` ဖြစ်ပါတယ်။

## MongoDB အတွက် (MongoDB)

MongoDB မှာ contract က `namespace` block တွေ မပါတဲ့အတွက် model တစ်ခုက `Models.unbound_User` ဖြစ်ပြီး types တွေက `@prisma/orm-mongo` ကနေ လာပါတယ်:

| Type | ဘယ်ကနေ import လုပ်မလဲ |
| --- | --- |
| `Scalars`, `Shape` | `@prisma/orm-mongo/family-contract` |
| `ResultType` | `@prisma/orm-mongo/components/runtime` |
| `CreateInput<Contract, "User">`, `UpdateInput<Contract, "User">` | `@prisma/orm-mongo/orm` |
| `MongoWhereFilter<Contract, "User">` — `where()` အတွက် filter | `@prisma/orm-mongo/orm` |

## နောက်တစ်ဆင့် (Next steps)

* Client reference ထဲက [Model and result types](https://www.prisma.io/docs/orm/reference/orm-client#model-and-result-types)။
* [Reading data](https://www.prisma.io/docs/orm/fundamentals/reading-data) မှာ `select()`၊ `include()` နဲ့ `where()` တို့ကို ပြထားပြီး — ဒီ types တွေက အဲဒါတွေရဲ့ result တွေကို ဖော်ပြတာပါ။

## ဆက်စပ်ဖတ်ရန် (Related pages)

- [`Advanced queries`](https://www.prisma.io/docs/orm/fundamentals/advanced-queries): ORM API နဲ့ ဖော်ပြလို့ မရတဲ့ query တွေအတွက် PostgreSQL မှာ SQL query builder နဲ့ MongoDB မှာ pipeline builder ကို သုံးပါ။
- [`Reading data`](https://www.prisma.io/docs/orm/fundamentals/reading-data): Prisma ORM နဲ့ record တစ်ခု ဒါမှမဟုတ် အများအပြားကို ဆွဲယူပြီး result တွေကို filter, select, sort, paginate နဲ့ iterate လုပ်ပါ။
- [`Relations and joins`](https://www.prisma.io/docs/orm/fundamentals/relations-and-joins): `.include()` နဲ့ ဆက်စပ် record တွေကို query တစ်ခုတည်းမှာ ဖတ်ပါ၊ ပြီးတော့ one-to-one၊ one-to-many နဲ့ many-to-many ဆက်စပ်မှုတွေ ဘယ်လို အလုပ်လုပ်လဲ နားလည်ပါ။
- [`Transactions`](https://www.prisma.io/docs/orm/fundamentals/transactions): `db.transaction()` နဲ့ write အများအပြားကို အားလုံး အောင်မြင်တာ ဒါမှမဟုတ် အားလုံး ကျရှုံးတာ တစ်ပြိုင်နက် ဖြစ်အောင် run ပါ။
- [`Writing data`](https://www.prisma.io/docs/orm/fundamentals/writing-data): Prisma ORM နဲ့ record တွေကို တစ်ခုချင်း ဒါမှမဟုတ် အစုလိုက် create, update, delete နဲ့ upsert လုပ်ပါ။
