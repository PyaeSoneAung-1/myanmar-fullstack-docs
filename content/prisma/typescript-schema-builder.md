---
title: "TypeScript နဲ့ Contract ရေးသားခြင်း (Author in TypeScript)"
description: "Schema file အစား typed builder API (defineContract) နဲ့ Prisma 8 contract ကို code ထဲမှာ define လုပ်ခြင်း — PSL နဲ့ တူညီတဲ့ artifacts တွေ ထွက်တာ၊ fields/enums/relations/storage mapping တွေနဲ့ contract file ကို pure ထားရမယ့် စည်းမျဉ်းတွေ"
order: 32
source: "https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder"
status: translated
updated: 2026-09-02
---

TypeScript authoring ဆိုတာ — Prisma 8 [data contract](/docs/prisma/the-data-contract) ကို schema file အစား code ထဲမှာ define လုပ်တာပါ။ `.prisma` file အစား — `defineContract` builder နဲ့ `prisma/contract.ts` ကို ရေးလိုက်ရင် [`contract emit`](https://www.prisma.io/docs/cli/contract-emit) က PSL schema တစ်ခု ထုတ်ပေးမယ့် `contract.json` နဲ့ `contract.d.ts` ကို အတိအကျ တူညီအောင် ထုတ်ပေးပါတယ်။

## PSL အစား TypeScript ကို ဘယ်အချိန်မှာ ရွေးမလဲ

[PSL](/docs/prisma/psl-syntax) က contract ရေးဖို့ အနှစ်သက်ဆုံး နည်းလမ်းပါ။ Mode နှစ်ခုလုံးက တူညီတဲ့ artifacts တွေ ထုတ်လို့ — PSL နဲ့ပဲ ဆက်နေရင် ဘာမှ မဆုံးရှုံးပါဘူး။ TypeScript builder က PSL မလွှမ်းခြုံတဲ့ ကိစ္စတွေအတွက် escape hatch တစ်ခုပါ။ ဒီအခြေအနေတွေမှာ သုံးပါ:

* model definitions တွေကို သာမန် TypeScript modules ဒါမှမဟုတ် packages တွေကြားမှာ ခွဲထုတ်၊ ပေါင်းစပ် ဒါမှမဟုတ် ပြန်သုံးရမယ်ဆိုရင်
* schema ရဲ့ အစိတ်အပိုင်းတွေကို တခြား static definitions တွေကနေ programmatically စုစည်းရမယ်ဆိုရင် ([purity စည်းမျဉ်းတွေ](#contract-file-ကို-pure-ထားပါ) သက်ဆိုင်ဆဲပါ)

ဒီနှစ်ခုလုံး မဟုတ်ဘူးဆိုရင် PSL နဲ့ပဲ ရေးပါ: ပိုကျစ်လျစ်ပြီး — `create-prisma` က scaffold လုပ်ပေးတာရော [`contract infer`](https://www.prisma.io/docs/cli/contract-infer) က ရေးပေးတာရော ဒီ PSL ပဲ ဖြစ်လို့ပါ။

## Config ကို Contract File ဆီ ညွှန်ပြခြင်း

Config ရဲ့ `contract` path က source of truth ကို အမည်ပေးပါတယ်။ `.ts` extension ဆိုရင် TypeScript authoring ကို ရွေးလိုက်တာပါ:

#### PostgreSQL

```typescript title="prisma.config.ts"
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.ts",
  }),
});
```

#### MongoDB

```typescript title="prisma.config.ts"
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-mongo/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.ts",
  }),
});
```

## Contract အပြည့်အစုံ တစ်ခု

Builder က သင့် database ရဲ့ target package ကနေ လာပါတယ်: PostgreSQL အတွက် `@prisma/orm-postgres/contract-builder`၊ MongoDB အတွက် `@prisma/orm-mongo/contract-builder` ပါ။

#### PostgreSQL

```typescript title="prisma/contract.ts"
import pgvector from "@prisma/orm-extension-pgvector/pack";
import { defineContract, enumType, member, rel } from "@prisma/orm-postgres/contract-builder";

const pgText = { codecId: "pg/text@1", nativeType: "text" } as const;

const Priority = enumType(
  "Priority",
  pgText,
  member("Low", "low"),
  member("High", "high"),
  member("Urgent", "urgent"),
);

export const contract = defineContract(
  {
    extensionPacks: { pgvector },
  },
  ({ field, model, type }) => {
    const types = {
      Embedding1536: type.pgvector.Vector(1536),
    } as const;

    const User = model("User", {
      fields: {
        id: field.id.uuidv4String(),
        email: field.text(),
        createdAt: field.temporal.createdAt(),
        updatedAt: field.temporal.updatedAt(),
        address: field.json().optional(),
      },
    });

    const Post = model("Post", {
      fields: {
        id: field.id.uuidv4String(),
        title: field.text(),
        userId: field.uuidString(),
        priority: field.namedType(Priority).default(Priority.members.Low),
        createdAt: field.temporal.createdAt(),
        updatedAt: field.temporal.updatedAt(),
        embedding: field.namedType(types.Embedding1536).optional(),
      },
    });

    return {
      enums: { Priority },
      types,
      models: {
        User: User.relations({
          posts: rel.hasMany(Post, { by: "userId" }),
        }).sql({
          table: "user",
        }),
        Post: Post.relations({
          user: rel.belongsTo(User, { from: "userId", to: "id" }),
        }).sql(({ cols, constraints }) => ({
          table: "post",
          foreignKeys: [
            constraints.foreignKey(cols.userId, User.refs.id, {
              name: "post_userId_fkey",
            }),
          ],
        })),
      },
    };
  },
);
```

#### MongoDB

```typescript title="prisma/contract.ts"
import { defineContract, field, model, rel } from "@prisma/orm-mongo/contract-builder";

const User = model("User", {
  collection: "users",
  fields: {
    _id: field.objectId(),
    name: field.string(),
    email: field.string(),
    bio: field.string().optional(),
  },
  relations: {
    posts: rel.hasMany("Post", { from: "_id", to: "authorId" }),
  },
});

const Post = model("Post", {
  collection: "posts",
  fields: {
    _id: field.objectId(),
    authorId: field.objectId(),
    title: field.string(),
    publishedAt: field.date().optional(),
  },
  relations: {
    author: rel.belongsTo(User, { from: "authorId", to: User.ref("_id") }),
  },
});

export const contract = defineContract({
  models: {
    User,
    Post,
  },
});
```

ပြောင်းလဲမှု တစ်ခုခု လုပ်ပြီးတိုင်း `npx prisma@latest contract emit` ကို run ပြီး artifacts တွေကို refresh လုပ်ပါ။

Builder နှစ်ခုက ပုံစံချင်း တူပေမယ့် — databases တွေ ကွဲတဲ့နေရာမှာ ကွဲပါတယ်။ PostgreSQL မှာ fields တွေက column types တွေကို ရွေးပြီး models တွေက storage ကို map ဖို့ `.sql({ table })` ကို chain လုပ်ပါတယ်။ MongoDB မှာတော့ ID က `_id` လို့ နာမည်ပေးထားတဲ့ `field.objectId()` ဖြစ်ပြီး — scalar helpers တွေက `field.string()`, `field.int32()`, `field.double()`, `field.bool()` နဲ့ `field.date()` တွေပါ။ Collection က chained call မဟုတ်ဘဲ model ပေါ်က inline `collection` option ဖြစ်ပါတယ်။

## defineContract ဘယ်လို အလုပ်လုပ်လဲ

`defineContract` က arguments နှစ်ခု လက်ခံပါတယ်: options object တစ်ခုနဲ့ factory function တစ်ခုပါ။

Options object က contract ကို ဘာတွေကနေ ဆောက်လဲ ကြေညာပြီး — အရေးအကြီးဆုံးက `extensionPacks` ပါ။ Target နဲ့ database family က import ကတည်းက ချိတ်ပြီးသား ဖြစ်လို့: `@prisma/orm-postgres/contract-builder` က PostgreSQL contracts တွေကိုပဲ ထုတ်ပေးပြီး — သူတို့နာမည်တွေကို သင်ကိုယ်တိုင် ဖော်ပြစရာ မလိုပါဘူး။

Factory က target နဲ့ သင် ကြေညာထားတဲ့ extension pack တိုင်းကနေ ပေါင်းစပ်ထားတဲ့ authoring helpers တွေကို လက်ခံရရှိပါတယ်: field definitions တွေအတွက် `field`၊ models တွေအတွက် `model`၊ pack ကပေးတဲ့ types တွေအတွက် `type` ပါ။ နမူနာထဲက `type.pgvector` က `extensionPacks` ထဲမှာ `pgvector` ကို စာရင်းသွင်းထားလို့ပဲ ရှိနေတာပါ။ Factory က contract ရဲ့ content ကို ပြန်ပေးပါတယ်: `models` တွေ၊ အပြင် optional `enums` နဲ့ `types` တွေပါ။

MongoDB builder ကတော့ ပိုရိုးရှင်းပါတယ်: `field`, `model`, `rel` တွေကို တိုက်ရိုက် export လုပ်ပြီး — ၎င်းရဲ့ `defineContract` က အထက်က MongoDB tab ထဲမှာလိုမျိုး — `models` ပါတဲ့ definition object တစ်ခုတည်းကို လက်ခံပါတယ်။ အောက်က sections တွေက PostgreSQL builder ကို သုံးပါတယ်။

## Fields

`field` က အဖြစ်များတဲ့ field ပုံစံတွေအတွက် typed constructors တွေ ပေးပါတယ်:

* Scalar fields တွေအတွက် `field.text()`, `field.uuidString()`, `field.json()`
* Client-generated default ပါတဲ့ UUID primary key အတွက် `field.id.uuidv4String()`
* စီမံထားတဲ့ timestamps တွေအတွက် `field.temporal.createdAt()` နဲ့ `field.temporal.updatedAt()`
* Enums တွေနဲ့ ကြေညာထားတဲ့ named types တွေအတွက် `field.namedType(x)`

တိကျတဲ့ helper set က target နဲ့ ပေါင်းစပ်ထားတဲ့ extension packs တွေကနေ လာပါတယ်။ Field builder တိုင်းမှာ chain လုပ်လို့ရတဲ့ modifiers တွေ ရှိပါတယ်:

* `.optional()` — field ကို nullable ဖြစ်စေတယ်။
* `.default(value)` — literal default တစ်ခု သတ်မှတ်တယ်; `.defaultSql(expression)` — database function default တစ်ခု သတ်မှတ်တယ်။
* `.unique()` — unique constraint တစ်ခု ထည့်တယ်; `.id()` — primary key အမှတ်အသား လုပ်တယ်။
* `.column("column_name")` — field name နဲ့ မတူတဲ့အခါ physical column name ကို သတ်မှတ်တယ်။

## Enums

`enumType` က storage codec နဲ့ members တွေ အတိအကျ ပါတဲ့ enum တစ်ခုကို ကြေညာပါတယ်:

```typescript
const Priority = enumType(
  "Priority",
  { codecId: "pg/text@1", nativeType: "text" } as const,
  member("Low", "low"),
  member("High", "high"),
);
```

`member(name, storedValue)` တစ်ခုချင်းစီက TypeScript-visible name နဲ့ column ထဲမှာ သိမ်းတဲ့ value ကို တွဲပေးပါတယ်။ Fields တွေက `field.namedType(Priority)` နဲ့ enum ကို ရည်ညွှန်းပြီး — defaults တွေက member တစ်ခုကို `Priority.members.Low` အနေနဲ့ ရည်ညွှန်းပါတယ်။ Enum ကို emit ဖြစ်အောင် factory ရဲ့ ပြန်ပေးတဲ့ `enums` map ထဲမှာ ထည့်ပေးပါ။

## Relations

Relations တွေကို model builder ပေါ်မှာ `.relations(...)` နဲ့ `rel` helpers တွေနဲ့ ကြေညာပါတယ်:

```typescript
User.relations({
  posts: rel.hasMany(Post, { by: "userId" }),
});

Post.relations({
  user: rel.belongsTo(User, { from: "userId", to: "id" }),
});
```

`rel.hasMany(Model, { by })` က တခြား model ပေါ်က foreign key field ကို အမည်ပေးပါတယ်။ `rel.belongsTo(Model, { from, to })` က local foreign key field ကို referenced field ဆီ map လုပ်ပါတယ်။ `rel.hasOne` နဲ့ `rel.manyToMany` က ကျန်တဲ့ ပုံစံတွေကို လွှမ်းခြုံပါတယ်။ Relation target ထဲမှာ စာလုံးပေါင်း မှားရင် ဘယ်လိုပဲ ဖြစ်ဖြစ် compile error ပါ: PostgreSQL builder က model objects တွေကို ယူပြီး — MongoDB builder ကတော့ ကြေညာထားတဲ့ models တွေနဲ့ type-check လုပ်ထားတဲ့ model names တွေကို ယူပါတယ်။

## Storage Mapping

`.sql(...)` က model တစ်ခုကို ၎င်းရဲ့ table ဆီ map လုပ်ပါတယ်။ Object ပုံစံက အဖြစ်များတဲ့ ကိစ္စတွေကို လွှမ်းခြုံပါတယ်:

```typescript
User.relations({ ... }).sql({ table: "user" });
```

Callback ပုံစံကတော့ model ရဲ့ columns နဲ့ constraint builders တွေကို ထပ်ပြီး ဖော်ထုတ်ပေးပါတယ် — နာမည် အတိအကျ ပါတဲ့ foreign keys တွေအတွက်ပါ:

```typescript
Post.relations({ ... }).sql(({ cols, constraints }) => ({
  table: "post",
  foreignKeys: [
    constraints.foreignKey(cols.userId, User.refs.id, { name: "post_userId_fkey" }),
  ],
}));
```

`Model.refs` က တခြား model တစ်ခုရဲ့ fields တွေဆီ typed references တွေ ပေးလို့ — `User.refs.id` က တကယ့် `User` definition နဲ့ စစ်ဆေးခံရပါတယ်။

## Extension Types

`defineContract` ရဲ့ options ထဲမှာ packs တွေကို ကြေညာပြီး — factory ရဲ့ `type` helper က သူတို့ရဲ့ constructors တွေကို ဖော်ထုတ်ပေးပါတယ်:

```typescript
import pgvector from "@prisma/orm-extension-pgvector/pack";

export const contract = defineContract(
  { extensionPacks: { pgvector } },
  ({ field, model, type }) => {
    const types = { Embedding1536: type.pgvector.Vector(1536) } as const;
    // ... use field.namedType(types.Embedding1536) in a model
    return { types, models: { /* ... */ } };
  },
);
```

Pack တစ်ခုတည်းကိုပဲ `prisma.config.ts` ထဲမှာလည်း (pack ရဲ့ `/control` export ကို သုံးပြီး `extensions: [pgvector]` အနေနဲ့) ပေါင်းစပ်ထားရပါမယ် — CLI ရော runtime ရော contract နဲ့ သဘောတူညီမှု ရှိနေဖို့ပါ။

## Contract File ကို Pure ထားပါ

Contract file က structure ကို ဖော်ပြပါတယ်။ Emit လုပ်တဲ့အခါ Prisma 8 က ဒါကို JSON အဖြစ် canonicalize လုပ်ပြီး hash လုပ်ပါတယ် — source တစ်ခုတည်းက bytes တွေ အမြဲတမ်း တူညီအောင် ထုတ်ပေးရပါမယ်။ File က pure data ဖြစ်မှပဲ အဲဒါ အလုပ်လုပ်နိုင်ပါတယ်:

* Contract ထဲကို `process.env`, လက်ရှိအချိန် ဒါမှမဟုတ် random values တွေ ဖတ်မထည့်ပါနဲ့။ Machine အလိုက် ဒါမှမဟုတ် run အလိုက် ပြောင်းတဲ့ contract က hashing နဲ့ verification ကို ချိုးဖျက်ပါတယ်။
* Field values တွေကို ရိုးရိုးထားပါ: strings, numbers, booleans နဲ့ builder ရဲ့ ကိုယ်ပိုင် objects တွေပဲ။ Functions, class instances နဲ့ `Date` objects တွေက serialize မလုပ်နိုင်ပါဘူး။
* File ထဲမှာ side effects မပါအောင် ထားပါ။ Emission က contract object ရဖို့ file ကို evaluate လုပ်တာပဲ — အဲဒါထက် ပိုမလုပ်ပါဘူး။

Environment အလိုက် တရားဝင် ကွဲပြားတတ်တဲ့ configuration — ဥပမာ database URL — က contract ထဲ မဟုတ်ဘဲ `prisma.config.ts` ထဲမှာ ရှိရပါမယ်။

## PSL နဲ့ ညီမျှမှု (Parity)

TypeScript ရော [PSL](/docs/prisma/psl-syntax) ရော authoring နှစ်မျိုးလုံးက — ညီမျှတဲ့ schema တစ်ခုအတွက် တူညီတဲ့ canonical artifact ကို ထုတ်ပေးပါတယ်။ Mode တွေကြား ပြောင်းလဲရင် downstream မှာ ဘာမှ ပြောင်းစရာ မလိုပါဘူး။ Project တစ်ခုက source of truth တစ်ခုကိုပဲ တိကျစွာ ကြေညာတုန်းပါ: config ထဲမှာ နာမည်ပေးထားတဲ့ file ပါ။ ကျန် ပုံစံကို project ထဲ မထည့်ပါနဲ့ — ဒါမှ နှစ်ခုက ဘယ်တော့မှ သဘောကွဲလို့ မရတော့ပါဘူး။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ကို လွှမ်းခြုံပါတယ်။ Agent ကို ဒီလို မှာကြည့်ပါ:

- "ဒီ contract.prisma ကို TypeScript schema builder နဲ့ ပြောင်းပေးပါ။"
- "prisma-8 skill ကို သုံးပြီး ကျွန်တော်တို့ TypeScript schema ထဲက email field မှာ unique index တစ်ခု ထည့်ပေးပါ။"

## နောက်တစ်ဆင့်

- Contract က ထုတ်ပေးတဲ့ [artifacts](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) တွေကို emit လုပ်ပြီး စစ်ဆေးပါ။
- [`db init`](https://www.prisma.io/docs/cli/db-init) နဲ့ contract ကို database တစ်ခုဆီ apply လုပ်ပါ ဒါမှမဟုတ် [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) နဲ့ အပြောင်းအလဲတွေကို စီစဉ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Author in PSL](/docs/prisma/psl-syntax) — သိပြီးသား schema language အပြင် Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေပါ ပါဝင်တဲ့ Prisma schema file အနေနဲ့ Prisma 8 contract ကို ရေးခြင်း
- [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) — capabilities တွေက သင့် database stack က ဘာတွေ ထောက်ပံ့လဲ မှတ်တမ်းတင်လို့ Prisma 8 က မထောက်ပံ့တဲ့ features တွေကို ရှင်းရှင်းလင်းလင်း error နဲ့ စောစော ငြင်းပယ်နိုင်တယ်
- [The data contract](/docs/prisma/the-data-contract) — data contract ဆိုတာ သင့် data model နဲ့ storage layout ရဲ့ တစ်ခုတည်းသော ဖော်ပြချက် — Prisma 8 ထဲမှာ အရာအားလုံးက ဒီ contract နဲ့အညီ type သတ်မှတ်၊ စီစဉ်ပြီး verify လုပ်ပါတယ်
- [The emitted artifacts](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) — contract.json နဲ့ contract.d.ts က Prisma 8 ရဲ့ တခြား အစိတ်အပိုင်းတိုင်း စားသုံးတဲ့ deterministic artifacts တွေ — အထဲမှာ ဘာတွေပါလဲဆိုတာ ဒီမှာ ကြည့်ပါ
