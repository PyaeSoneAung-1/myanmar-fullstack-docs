---
title: "PSL ဖြင့် Contract ရေးသားခြင်း (Author in PSL)"
description: "Prisma 8 contract ကို `.prisma` schema file အနေနဲ့ ရေးနည်း — named types, typed enums, value objects, base models (variants) နဲ့ extension types အပါအဝင် Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေ အသေးစိတ်"
order: 24
source: "https://www.prisma.io/docs/orm/contract-authoring/psl-syntax"
status: translated
updated: 2026-09-02
---

Prisma 8 contract ကို Prisma schema file အနေနဲ့ ရေးပါတယ် — သင်ပြီးသား သိထားတဲ့ schema language ကို Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေနဲ့အတူ သုံးပြီး ရေးတာပါ။

PSL က Prisma 8 ရဲ့ [data contract](https://www.prisma.io/docs/orm/contract-authoring/the-data-contract) ကို ရေးဖို့ အနှစ်သက်ဆုံး နည်းလမ်းပါ။ သင်က Prisma schema file တစ်ခုကို ရေးပါတယ် — အများအားဖြင့် `prisma/contract.prisma` — ပြီးတော့ [`contract emit`](https://www.prisma.io/docs/cli/contract-emit) က အဲဒါကို `contract.json` နဲ့ `contract.d.ts` အဖြစ် ပြောင်းပေးပါတယ်။

Prisma schema language ကို သိပြီးသားဆိုရင် contract file တစ်ခုရဲ့ အများစုက သင်မျှော်လင့်ထားတဲ့အတိုင်းပဲ ဖတ်လို့ရပါတယ်။ ဒီ page က နှစ်ဖက်စလုံးမှာ ရှိတဲ့ အခြေခံတွေကို အကျဉ်းချုပ် ဖော်ပြပြီး — Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေကို အသေးစိတ် ဖော်ပြပါတယ်: named types, typed enums, value objects, variants ပါတဲ့ base models နဲ့ extension types တွေပါ။

## ပြီးပြည့်စုံတဲ့ Contract ဥပမာ

#### PostgreSQL

```prisma title="prisma/contract.prisma" 
// use prisma-next

types {
  Uuid = String @db.Uuid
}

type Address {
  street  String
  city    String
  zip     String?
  country String
}

enum Priority {
  @@type("pg/text@1")
  Low    = "low"
  High   = "high"
  Urgent = "urgent"
}

model User {
  id        Uuid     @id @default(uuid())
  email     String
  createdAt DateTime @default(now())
  address   Address?
  posts     Post[]

  @@map("user")
}

model Post {
  id        Uuid     @id @default(uuid())
  title     String
  userId    Uuid
  priority  Priority @default(Low)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("post")
}
```

#### MongoDB

```prisma title="prisma/contract.prisma" 
// use prisma-next

type Address {
  street  String
  city    String
  zip     String?
  country String
}

enum UserRole {
  @@type("mongo/string@1")
  Admin  = "admin"
  Author = "author"
  Reader = "reader"
}

model User {
  id      ObjectId @id @map("_id")
  name    String
  email   String
  bio     String?
  role    UserRole
  address Address?
  posts   Post[]

  @@map("users")
}

model Post {
  id        ObjectId @id @map("_id")
  title     String
  content   String
  authorId  ObjectId
  createdAt DateTime

  author User @relation(fields: [authorId], references: [id])

  @@index([authorId])
  @@map("posts")
}
```

ပြောင်းလဲမှုတိုင်း ပြီးတိုင်း artifacts တွေ ပြန်လည်ဆန်းသစ်ဖို့ `npx prisma@latest contract emit` ကို run ပါ။

## Config ကို Schema ဆီ ညွှန်းခြင်း

Config ရဲ့ `contract` path က source of truth ကို နာမည်ပေးပါတယ်။ `.prisma` extension က PSL authoring ကို ရွေးပေးပါတယ်:

#### PostgreSQL

```typescript title="prisma.config.ts" 
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
  }),
});
```

#### MongoDB

```typescript title="prisma.config.ts" 
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-mongo/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
  }),
});
```

Scaffold လုပ်ထားတဲ့ project တွေ (`npx create-prisma@latest`) မှာ ဒီ wiring နဲ့ starter schema တစ်ခု ကြိုပြီး ပါပြီးသားပါ။

## Models နဲ့ Fields

Model တွေက field တွေကို type တစ်ခု၊ ချန်လို့ရတဲ့ `?` အမှတ်အသားနဲ့ attributes တွေနဲ့ ကြေညာပါတယ်:

- `@id` က primary key ကို အမှတ်အသားလုပ်ပြီး — `@@id([a, b])` က composite key ကို ကြေညာပါတယ်။
- `@unique` က unique constraint ထည့်ပေးပြီး — `@@index([...])` က secondary index တစ်ခုကို ကြေညာပါတယ်။
- `@default(...)` က default တစ်ခု သတ်မှတ်ပေးပါတယ်။ `@default(now())` လိုမျိုး database function default တွေက database ထဲမှာ column default တွေ ဖြစ်သွားပါတယ်။ `@default(uuid())` လိုမျိုး generated default တွေကတော့ write တစ်ခုစီ မတိုင်ခင် Prisma 8 က သက်ရောက်စေလို့ — database တိုင်းမှာ တစ်ပုံစံတည်း အလုပ်လုပ်ပါတယ်။ သူတို့က DDL အနေနဲ့ မဟုတ်ဘဲ contract ရဲ့ `execution` section ထဲမှာ ပေါ်ပါတယ်။
- `@map("column_name")` က field တစ်ခုရဲ့ physical name ကို သတ်မှတ်ပြီး — model နာမည်နဲ့ မတူတဲ့အခါ `@@map("table_name")` က table ဒါမှမဟုတ် collection ရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။

ID တွေ ဘယ်လို map လုပ်လဲဆိုတာ database အလိုက် ကွာပါတယ်:

#### PostgreSQL

```prisma
model User {
  id Uuid @id @default(uuid())
}
```

ဒီမှာ primary key က သာမန် column တစ်ခုပါ — သူ့ရဲ့ type နဲ့ default ကို ကိုယ်တိုင် ရွေးပါတယ်။

#### MongoDB

```prisma
model User {
  id ObjectId @id @map("_id")
}
```

ဒီမှာ primary key က MongoDB ရဲ့ `_id` ပါ — `ObjectId` လို့ type လုပ်ပြီး physical `_id` key ဆီ map လုပ်ပါတယ်။

## Named Types

`types` block က ပြန်သုံးလို့ရတဲ့ type alias တွေကို ကြေညာပါတယ်။ Alias တစ်ခုက base type တစ်ခုနဲ့ သူ့ရဲ့ storage အသေးစိတ်တွေကို နာမည်တစ်ခုတည်းအောက်မှာ ချည်နှောင်ထားပါတယ်:

```prisma
types {
  Uuid = String @db.Uuid
}
```

အဲဒီနောက် field တွေက `Uuid` ကို built-in type တစ်ခုလိုပဲ သုံးပါတယ်။ Alias က storage ဆုံးဖြတ်ချက် (`text` အစား `uuid` columns) ကို နေရာတစ်ခုတည်းမှာ ထားပေးပါတယ်။

## Enums

Prisma 8 ထဲက enum တစ်ခုက သူ့ရဲ့ storage codec ကို `@@type` နဲ့ ကြေညာပြီး — member တစ်ခုချင်းစီအတွက် သိမ်းမယ့် value ကိုလည်း ရွေးချယ်နိုင်ပါတယ်:

```prisma
enum Priority {
  @@type("pg/text@1")
  Low    = "low"
  High   = "high"
  Urgent = "urgent"
}
```

`@@type("pg/text@1")` က PostgreSQL မှာ value တွေကို `text` အနေနဲ့ သိမ်းပါတယ်။ Member တစ်ခုမှာ ကိုယ်ပိုင် value မသတ်မှတ်ရသေးရင် member နာမည်ကိုယ်တိုင်ကိုပဲ သိမ်းပါတယ်။ Database ထဲမှာတော့ Prisma 8 က enum သုံးထားတဲ့ column တစ်ခုချင်းစီပေါ်မှာ `CHECK` constraint နဲ့ ခွင့်ပြုထားတဲ့ value တွေကို ပြဋ္ဌာန်းပါတယ်။

## Value Objects

`type` block က value object တစ်ခုကို ကြေညာပါတယ် — parent record နဲ့ သက်ဆိုင်ပြီး ကိုယ်ပိုင် identity ဒါမှမဟုတ် table မရှိတဲ့ structured value တစ်ခုပါ။

```prisma
type Address {
  street  String
  city    String
  zip     String?
  country String
}

model User {
  id      Uuid     @id @default(uuid())
  address Address?
}
```

Storage က database အလိုက် ကွာပါတယ် — PostgreSQL မှာ value object field က `jsonb` column တစ်ခုတည်းထဲမှာ နေပြီး MongoDB မှာတော့ embedded document တစ်ခုပါ။ ဘယ်လိုပဲ ဖြစ်ဖြစ် `contract.d.ts` က အဲဒါကို untyped JSON အစား structured object တစ်ခုအနေနဲ့ type လုပ်ပေးပါတယ်။ MongoDB မှာတော့ embed လုပ်မလား reference လုပ်မလားဆိုတာက အဓိက modeling ဆုံးဖြတ်ချက်ဖြစ်ပြီး — [MongoDB data modeling](https://www.prisma.io/docs/orm/data-modeling/mongodb#embed-or-reference) မှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

## Relations

Relations တွေက Prisma ORM ကနေ သိပြီးသား `@relation` syntax ကိုပဲ သုံးပါတယ်။ Foreign key ကို ကိုင်ထားတဲ့ ဘက်က scalar field နဲ့ mapping ကို ကြေညာပြီး — ကျန် ဘက်ကတော့ list တစ်ခုကို ကြေညာပါတယ်:

```prisma
model Post {
  userId Uuid
  user   User @relation(fields: [userId], references: [id])
}

model User {
  posts Post[]
}
```

Many-to-many relations တွေက composite primary key ပါတဲ့ explicit join model တစ်ခုကနေ ဖြတ်သွားပါတယ်။ ဘက်နှစ်ဖက်စလုံးက list fields တွေက အဲဒီ join model ကနေတစ်ဆင့် ဖြေရှင်းပါတယ်:

```prisma
model Post {
  tags Tag[]
}

model Tag {
  posts Post[]
}

model PostTag {
  postId Uuid
  tagId  Uuid

  post Post @relation(fields: [postId], references: [id])
  tag  Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
  @@map("post_tag")
}
```

Emit လုပ်ထားတဲ့ contract က relation ကို join table ရဲ့ columns တွေနဲ့အတူ `N:M` အနေနဲ့ မှတ်တမ်းတင်လို့ — queries တွေက `post.tags` ကို တိုက်ရိုက် ဖြတ်သန်း (traverse) လုပ်နိုင်ပါတယ်။

## Base Models နဲ့ Variants

Base model တစ်ခုက discriminator field တစ်ခုကို ကြေညာပြီး — variant တစ်ခုစီက သူ့ရဲ့ base နဲ့ discriminator value ကို နာမည်ပေးပါတယ်:

```prisma
model Task {
  id     Uuid   @id @default(uuid())
  title  String
  type   String

  @@discriminator(type)
  @@map("task")
}

model Bug {
  severity     String
  stepsToRepro String?

  @@base(Task, "bug")
  @@map("bug")
}
```

`type = "bug"` ရှိတဲ့ rows တွေက `Bug` records တွေပါ။ PostgreSQL မှာ variant ရဲ့ `@@map` က သူ့ရဲ့ storage layout ကို ရွေးပေးပါတယ် — ဒီမှာ ပြထားသလို ကိုယ်ပိုင် `@@map` ရှိရင် variant ရဲ့ fields တွေက base model ရဲ့ primary key ကို မျှဝေပြီး ကိုယ်ပိုင် table ထဲမှာ နေပါတယ်။ `@@map` မရှိရင်တော့ base table ထဲမှာ nullable columns တွေအနေနဲ့ နေပါတယ်။ နှစ်မျိုးကြားထဲက ရွေးချယ်ပုံကို [Relational data modeling](/docs/prisma/relational-databases) မှာ ဖော်ပြထားပါတယ်။ MongoDB မှာတော့ variants တွေက သူတို့ရဲ့ fields တွေကို base model ရဲ့ collection ထဲက documents တွေထဲ ထည့်ပေးလို့ — variant တစ်ခုက `@@base` ကို ကြေညာပေမဲ့ ကိုယ်ပိုင် `@@map` မပါပါဘူး။

## Extension Types

Extension packs တွေက `types` block ထဲမှာ constructor expressions တွေကနေတစ်ဆင့် types တွေကို ထည့်ပေးပါတယ်။ Config ထဲမှာ pack ကို compose လုပ်ပြီးမှ သူ့ရဲ့ types တွေကို သုံးပါ:

```typescript title="prisma.config.ts"
import { definePrismaConfig } from "prisma/config";
import pgvector from "@prisma/orm-extension-pgvector/control";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    extensions: [pgvector],
  }),
});
```

```prisma title="prisma/contract.prisma"
types {
  Embedding1536 = pgvector.Vector(1536)
}

model Post {
  id        Uuid           @id @default(uuid())
  embedding Embedding1536?
}
```

`contract emit` က extension types တွေကို config ထဲမှာ compose လုပ်ထားတဲ့ packs တွေနဲ့ တိုက်စစ်ပါတယ် — စာရင်းထဲ မပါတဲ့ pack တစ်ခုကနေ လာတဲ့ type ဆိုရင် diagnostic တစ်ခုနဲ့ emit ကျရှုံးပါတယ်။ Extension list ပြောင်းပြီးတိုင်း `contract emit` ကို ပြန် run ပါ။

## Existing Database ကနေ စတင်ခြင်း

Database ရှိပြီးသားဆိုရင် schema ကို လက်နဲ့ ကိုယ်တိုင် မရေးပါနဲ့။ [`contract infer`](https://www.prisma.io/docs/cli/contract-infer) က live schema ကို ဖတ်ပြီး — သင်ပြန်လည်သုံးသပ်ပြီး တည်းဖြတ်ဖို့ starter `contract.prisma` တစ်ခု ရေးပေးပါတယ်။

အပေါ်က syntax တွေက relations တွေကို ဘယ်လို ကြေညာလဲဆိုတာ ပြတာပါ။ ဘယ်ပုံစံကို ရွေးရမလဲ၊ foreign key ကို ဘယ်ဘက်က ပိုင်ဆိုင်သင့်လဲဆိုတာအတွက် — [relational data modeling](/docs/prisma/relational-databases) နဲ့ [MongoDB data modeling](https://www.prisma.io/docs/orm/data-modeling/mongodb) ကို ကြည့်ပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ကို လွှမ်းခြုံပါတယ်။ Agent ကို ဒီလို မှာကြည့်ပါ:

- "prisma-8 skill ကို သုံးပြီး text အနေနဲ့ သိမ်းမယ့် Status enum တစ်ခု ထည့်ပြီး Order model ပေါ်မှာ သုံးပေးပါ။"
- "User နဲ့ Post ကြားမှာ foreign key က Post ပေါ်မှာ ရှိတဲ့ one-to-many ထည့်ပေးပါ။"
- "Post model ကို userId နဲ့ title ပေါ်မှာ composite unique constraint တစ်ခု ပေးပါ။"

## နောက်တစ်ဆင့်

- Schema က ထုတ်ပေးတဲ့ [artifacts](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) တွေကို emit လုပ်ပြီး စစ်ဆေးကြည့်ပါ။
- Models တွေကို code နဲ့ သတ်မှတ်ချင်တယ်ဆိုရင် — [authoring in TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) ကို ကြည့်ပါ။
- Contract ကို database တစ်ခုပေါ် သက်ရောက်စေဖို့ [`db init`](https://www.prisma.io/docs/cli/db-init) ဒါမှမဟုတ် — အပြောင်းအလဲတွေ စီစဉ်ဖို့ [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) ကို သုံးပါ။
- [The data contract](https://www.prisma.io/docs/orm/contract-authoring/the-data-contract) — data contract ဆိုတာ data model နဲ့ storage layout ရဲ့ တစ်ခုတည်းသော ဖော်ပြချက်ဖြစ်ပြီး Prisma 8 မှာ အရာအားလုံးက ဒီပေါ်မှာ type သတ်မှတ်၊ စီစဉ်၊ စစ်ဆေးပါတယ်။
- [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) — capabilities တွေက သင့် database stack က ဘာတွေ ထောက်ပံ့လဲဆိုတာ မှတ်တမ်းတင်လို့ — Prisma 8 က မထောက်ပံ့တဲ့ feature တွေကို ရှင်းလင်းတဲ့ error နဲ့ စောစောစီးစီး ငြင်းပယ်နိုင်ပါတယ်။
