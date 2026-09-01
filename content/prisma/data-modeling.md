---
title: "ဒေတာ Model ပြုလုပ်ခြင်း (Data Modeling)"
description: "Model တွေ၊ primary key တွေ၊ scalar field တွေနဲ့ relation တွေသုံးပြီး သင့် application လိုအပ်တဲ့ ဒေတာကို ဖော်ပြနည်း"
order: 14
source: "https://www.prisma.io/docs/orm/prisma-schema/data-model"
status: translated
updated: 2026-09-01
---

Data modeling ဆိုတာ သင့် application လိုအပ်တဲ့ ဒေတာကို ဖော်ပြပြီး အဲဒီဒေတာ ဘယ်လို ချိတ်ဆက်နေလဲဆိုတာ ရှင်းပြတဲ့ လုပ်ငန်းစဉ်ပါ။

ဥပမာ — blog တစ်ခုမှာ user တွေ၊ post တွေနဲ့ comment တွေ ရှိပါတယ်။ User တစ်ယောက်မှာ email နဲ့ name လိုမျိုး field တွေ ရှိပြီး post တစ်ခုမှာ title နဲ့ content လိုမျိုး field တွေ ရှိပါတယ်။ ဒီ model တွေက တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေပါတယ် — user တစ်ယောက်က post အများကြီး ရေးနိုင်ပြီး post တစ်ခုမှာ comment အများကြီး ရှိနိုင်ပါတယ်။

Prisma 8 မှာ ဒီဖွဲ့စည်းပုံကို `contract.prisma` file ထဲမှာ သတ်မှတ်ပါတယ်။ ဒီ file က သင့် application code, database migrations နဲ့ developer tools တွေကြားမှာ မျှဝေတဲ့ contract ဖြစ်လာပါတယ်။

Prisma 7 ကနေ လာတာဆိုရင် — `contract.prisma` က အရင်က သုံးခဲ့တဲ့ `schema.prisma` file နဲ့ အလားတူ အခန်းကဏ္ဍ ပါဝင်ပါတယ်။

ဒီ page က Prisma 8 contract တိုင်းရဲ့ building block လေးခုကို မိတ်ဆက်ပေးပါတယ်:

- [Models](#models) — သင့် application ကိုင်တွယ်တဲ့ အရာတွေ
- [Primary keys](#primary-keys) — record တစ်ခုစီကို ဘယ်လို ဖော်ထုတ်လဲ
- [Scalar fields](#scalar-fields) — model တစ်ခု သိမ်းထားတဲ့ value တွေ
- [Relations](#relations) — model တွေ တစ်ခုနဲ့တစ်ခု ဘယ်လို ချိတ်ဆက်လဲ

ဒီ building block တွေက database တိုင်းမှာ သက်ရောက်ပါတယ်။ Database တွေ ကွာခြားတာက relation တွေကို model လုပ်ပုံမှာပဲ ဖြစ်ပြီး — [relational](/docs/prisma/relational-databases) နဲ့ [MongoDB](https://www.prisma.io/docs/orm/data-modeling/mongodb) guides တွေမှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

## Models

Model တစ်ခုက record အမျိုးအစားတစ်ခုကို ဖော်ပြပါတယ် — user တစ်ယောက်၊ order တစ်ခု၊ blog post တစ်ခုလိုမျိုးပါ။ `model` keyword နဲ့ ကြေညာပြီး field တွေ ပေးပါတယ်:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String
  name  String?
}
```

Model တစ်ခုရဲ့ record တိုင်းမှာ ကိုယ်ပိုင် identity နဲ့ ကိုယ်ပိုင် lifecycle ရှိပါတယ်။ Title တူတဲ့ post နှစ်ခုကတောင် မတူညီတဲ့ post နှစ်ခုပဲ ဖြစ်ပြီး — email ပြောင်းတဲ့ user တစ်ယောက်က user တစ်ယောက်တည်း ဆက်ဖြစ်နေပါတယ်။

Relational database ပေါ်မှာ model တစ်ခုက table တစ်ခု ဖြစ်ပြီး — MongoDB ပေါ်မှာတော့ collection တစ်ခု ဖြစ်ပါတယ်။

## Primary Keys

**Primary key** ဆိုတာ record တစ်ခုစီကို တစ်မူထူးခြားစွာ ဖော်ထုတ်ပေးတဲ့ field ပါ။ Model တိုင်းမှာ လိုပါတယ်။ `@id` နဲ့ အမှတ်အသား လုပ်ပါတယ်:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String
}
```

```prisma
model User {
  id    ObjectId @id @map("_id")
  email String
  @@map("users")
}
```

MongoDB ပေါ်မှာ primary key က document ရဲ့ မဖြစ်မနေ `_id` field ဆီ map လုပ်ပြီး — `ObjectId` က အဲဒါအတွက် idiomatic type ပါ။

### Natural Keys

**Natural key** ဆိုတာ လက်တွေ့ကမ္ဘာမှာ record ကို ကြိုပြီး ဖော်ထုတ်နေတဲ့ value တစ်ခုပါ။ Value က တည်ငြိမ်ပြီး၊ unique ဖြစ်ကာ သင့် application အပြင်ဘက်ကနေ သတ်မှတ်ပေးတဲ့အခါ သုံးပါ — သင်ကိုယ်တိုင် မတီထွင်ဘဲ လက်ခံရရှိတဲ့ စံသတ်မှတ်ထားတဲ့ code မျိုးပါ။

Reference table တွေက ဂန္ထဝင် ကိုက်ညီမှု (classic fit) ပါပဲ။ နိုင်ငံတစ်နိုင်ငံက သူ့ရဲ့ ISO code ဖြစ်ပြီး — code က ဘယ်တော့မှ မပြောင်းပါဘူး:

```prisma
model Country {
  code String @id
  name String
}
```

`Country` ကို ညွှန်တဲ့ record တွေက အခု ဖတ်လို့ရတဲ့ value (`US`, `DE`) တွေကို သိမ်းပြီး — ရှင်းမရတဲ့ နံပါတ်တစ်ခု မဟုတ်တော့ပါဘူး။ Currency တွေ (`USD`, `EUR`) နဲ့ အလားတူ lookup table တွေက ဒီနည်းအတိုင်း အလုပ်လုပ်ပါတယ်။

### Surrogate Keys

**Surrogate key** ဆိုတာ business အဓိပ္ပာယ် မရှိတဲ့ generate လုပ်ထားတဲ့ value တစ်ခုပါ — auto-incrementing integer တစ်ခု၊ UUID တစ်ခု၊ ObjectId တစ်ခုပါ။ သင့် application က ဖန်တီးတဲ့ record တွေအတွက် ပိုကောင်းတဲ့ default ဖြစ်ပါတယ်။

အကြောင်းရင်းက တည်ငြိမ်မှုပါ။ Key အဖြစ် သုံးချင်စိတ် ဖြစ်မိနိုင်တဲ့ value တွေ — email address ဒါမှမဟုတ် product SKU လိုမျိုး — က လက်တွေ့မှာ ပြောင်းလဲတတ်ပါတယ်။ Primary key ပြောင်းတာက ဈေးကြီးပါတယ် — value အဟောင်းကို ညွှန်တဲ့ record တိုင်းကိုပါ update လုပ်ရလို့ပါ။ Surrogate key ကတော့ ဘယ်တော့မှ မပြောင်းပါဘူး။

Natural value ကို သာမန် field တစ်ခုအနေနဲ့ ထားပြီး `@unique` နဲ့ တစ်မူထူးခြားမှုကို သေချာလုပ်ပါ။ တည်ငြိမ်တဲ့ key နဲ့ uniqueness အာမခံချက် နှစ်ခုလုံး ရပါတယ်:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}

model Product {
  id  Int    @id @default(autoincrement())
  sku String @unique
}
```

### ဘယ် Surrogate Type ကို ရွေးမလဲ

Record ကို ဘယ်လို ဖန်တီးလဲ၊ သူ့ id က ဘယ်ကို သွားလဲပေါ် မူတည်ပြီး ရွေးပါ:

```prisma
// Auto-incrementing integer: index ဖို့ အသေးဆုံးနဲ့ အမြန်ဆုံး၊
// ထည့်သွင်းတဲ့ အစီအစဉ်အတိုင်း စီထားတယ်။ သင့် system ကနေ ဘယ်တော့မှ
// မထွက်တဲ့ internal record တွေအတွက် ကောင်းတယ်။
model Invoice {
  id Int @id @default(autoincrement())
}
```

Value ကို database က သတ်မှတ်ပေးလို့ insert ပြီးမှပဲ သိရပါတယ်။ Sequential လည်း ဖြစ်လို့ — URL တွေမှာ ဖော်ထုတ်မိရင် row count တွေ ပေါက်ကြားပြီး ခန့်မှန်းဖို့ ဖိတ်ခေါ်သလို ဖြစ်နိုင်ပါတယ်။

```prisma
// UUID: တစ်ကမ္ဘာလုံး unique၊ insert မလုပ်ခင် generate လုပ်တယ်။
// URL တွေမှာ ပေါ်တဲ့ id တွေ ဒါမှမဟုတ် service တွေကြား ဖန်တီးတဲ့ id တွေအတွက် ကောင်းတယ်။
model ApiToken {
  id String @id @default(uuid())
}
```

UUID က integer ထက် ပိုကျယ်ပြီး random UUID တွေက index နည်းနည်း ပိုဆိုးပေမယ့် — သီးခြား service တွေက ဘယ်တော့မှ မတိုက်မိဘဲ ဘာမှ မပေါက်ကြားပါဘူး။

```prisma
// ObjectId: idiomatic MongoDB key။ ညှိနှိုင်းစရာ မလိုဘဲ generate လုပ်ပြီး
// ကိုယ်ပိုင် ဖန်တီးချိန် (creation time) ကို ထည့်သွင်းထားတယ်။
model Post {
  id ObjectId @id @map("_id")
  @@map("posts")
}
```

### Composite Keys

**Composite key** က field အများကြီးကို လွှမ်းခြုံပြီး `@@id` နဲ့ ကြေညာပါတယ်။ Identity က ပေါင်းစပ်မှုကိုယ်တိုင် ဖြစ်တဲ့အခါ သုံးပါ — အများအားဖြင့် model နှစ်ခုကို ချိတ်ပေးတဲ့ model တစ်ခုမှာ ဖြစ်တတ်ပါတယ်:

```prisma
model UserTag {
  userId Int
  tagId  Int

  @@id([userId, tagId])
}
```

`(userId, tagId)` pair ထပ်နေတာက အဓိပ္ပာယ်မဲ့လို့ pair ကိုယ်တိုင်က key ပါ။ သာမန် model တွေမှာတော့ composite key ကို ရှောင်ပါ — model ကို ညွှန်တဲ့အရာတိုင်းက key ရဲ့ field အားလုံးကို သယ်ရလို့ပါ။

## Scalar Fields

**Scalar field** က တန်ဖိုးတစ်ခုတည်း ကိုင်ထားပါတယ်။ အသုံးများတဲ့ types တွေ:

| Type       | သိမ်းဆည်းတာ                      |
| ---------- | --------------------------- |
| `String`   | စာသား (Text)                        |
| `Int`      | 32-bit integer              |
| `BigInt`   | 64-bit integer              |
| `Float`    | Floating-point ဂဏန်း       |
| `Boolean`  | `true` / `false`            |
| `DateTime` | Timestamp                   |
| `Json`     | မဆိုစလောက် JSON value        |
| `ObjectId` | MongoDB document identifier |

Prisma 8 ရဲ့ type system က extensible ဖြစ်လို့ extension တွေက နောက်ထပ် types တွေ (vector ဒါမှမဟုတ် geometry လိုမျိုး) ထည့်နိုင်ပါတယ်။

Modifier နှစ်ခုက field တစ်ခုရဲ့ ပုံစံကို ပြောင်းပေးပါတယ်:

- နောက်က `?` က field ကို optional ဖြစ်စေတယ်: `name String?`
- နောက်က `[]` က list ဖြစ်စေတယ်: `tags String[]`

### Data Type ကို ဘယ်လို ရွေးမလဲ

Type ကို value ရဲ့ အဓိပ္ပာယ်နဲ့ ကိုက်ညီအောင် ရွေးပါ — ကြည့်ရတဲ့ ပုံစံနဲ့ မဟုတ်ပါဘူး။

Identifier တစ်ခုက `String` ဖြစ်ပါတယ် — ဂဏန်းလို ကြည့်နေရင်တောင် ပါ။ Zip code တွေ ဒါမှမဟုတ် phone number တွေကို ဘယ်တော့မှ ပေါင်းမရ၊ leading zero တွေ ရှိနိုင်ပြီး ဂဏန်းစဉ်အလိုက် sort လည်း မလုပ်ပါဘူး:

```prisma
model Address {
  id  Int    @id @default(autoincrement())
  zip String
}
```

Money က `Float` မဟုတ်ပါဘူး။ Floating-point ဂဏန်းတွေက ဒဿမ ပမာဏတွေကို အတိအကျ ဖော်ပြလို့မရလို့ — ပေါင်းတဲ့အခါ ဆင့်ရဲ့ အပိုင်းအစလေးတွေနဲ့ လွဲတတ်ပါတယ်။ အသေးဆုံး unit ရဲ့ integer အရေအတွက်ကို သိမ်းပါ:

```prisma
model Product {
  id         Int @id @default(autoincrement())
  priceCents Int
}
```

အချိန်တစ်ချက်က `DateTime` ဖြစ်ပြီး `String` မဟုတ်ပါဘူး။ တကယ့် timestamp type တစ်ခုက မှန်ကန်တဲ့ နှိုင်းယှဉ်မှု၊ sort နဲ့ range query တွေကို ပေးပါတယ်:

```prisma
model Post {
  id          Int      @id @default(autoincrement())
  publishedAt DateTime
}
```

Size နှစ်ခုကြားမှာ မသေချာရင် ပိုကျယ်တဲ့ဘက်ကို ရွေးပါ (ကြီးထွားနိုင်တဲ့ counter အတွက် `Int` ထက် `BigInt`)။ Type ကို နောက်မှ ကျယ်အောင် လုပ်တာက migration တစ်ခု ဖြစ်ပြီး — အခု ကျယ်တဲ့ type က အလကားပါ။

Field တစ်ခုကို optional (`?`) လုပ်တာက "မရှိတာ" က အဓိပ္ပာယ်ရှိတဲ့ default တစ်ခုနဲ့ မတူညီတဲ့အခါမှသာ လုပ်ပါ။ Default ပါတဲ့ required field က မကြာခဏ ပိုရှင်းတဲ့ model ပါ။

## Relations

**Relation** က model နှစ်ခုကို ချိတ်ပေးပါတယ် — user တစ်ယောက်မှာ post အများကြီး ရှိတယ်၊ post တစ်ခုက user တစ်ယောက်နဲ့ ဆိုင်တယ်ဆိုတာမျိုးပါ။

Relation တစ်ခုကို ဖော်ပြတဲ့ field နှစ်မျိုး ရှိပါတယ်:

- ချိတ်ဆက်မှုကို သိမ်းထားတဲ့ field တစ်ခု။ ဒါက တကယ့် column ဒါမှမဟုတ် document field ဖြစ်ပြီး — `authorId` လိုမျိုး — အခြား record ရဲ့ primary key ကို ကိုင်ထားပါတယ်။
- Relation field — တခြား model အနေနဲ့ type လုပ်ထားတဲ့ `author User` လိုမျိုး။ သူ့ဘာသာ ဘာမှ မသိမ်းဘဲ — query တွေမှာ ချိတ်ဆက်မှုကို ဘယ်လို သွားလာရမလဲဆိုတာ Prisma 8 ကို ပြောပြပါတယ်။

`@relation` attribute က နှစ်ခုကို ချိတ်ပေးပါတယ် — `fields` က link ကို သိမ်းထားတဲ့ ကိုယ်ပိုင် field ကို နာမည်ပေးပြီး `references` က တခြား model ပေါ်မှာ သူညွှန်တဲ့ field ကို နာမည်ပေးပါတယ်။

```prisma
model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

Relation တွေက ပုံစံသုံးမျိုး ရှိပါတယ်:

- One-to-one — user တစ်ယောက်မှာ profile အများဆုံး တစ်ခု ရှိတယ်။
- One-to-many — user တစ်ယောက်မှာ post အများကြီး ရှိတယ်။
- Many-to-many — post တစ်ခုမှာ tag အများကြီး ရှိပြီး tag တစ်ခုက post အများကြီးပေါ်မှာ ပေါ်တယ်။

ပုံစံတစ်ခုစီကို ဘယ်လို သိမ်းလဲ၊ ချိတ်ဆက်တဲ့ field ကို ဘယ် model က ကိုင်ထားသင့်လဲဆိုတာက relational နဲ့ document database တွေမှာ ကွာခြားပါတယ်။ သင့် database အတွက် guide နဲ့ ဆက်လုပ်ပါ:

- [Relational data modeling](/docs/prisma/relational-databases) — PostgreSQL နဲ့ တခြား SQL database တွေအတွက်: foreign keys, junction tables နဲ့ key ကို ဘယ်ဘက်က ပိုင်ဆိုင်လဲ။
- [MongoDB data modeling](https://www.prisma.io/docs/orm/data-modeling/mongodb) — embedding နဲ့ referencing၊ polymorphic collections။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်; `prisma-8` skill က contract authoring ကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး surrogate id နဲ့ unique sku field ပါတဲ့ Product model တစ်ခု ထည့်ပေးပါ။"
- "ISO code ကို key အနေနဲ့ သုံးတဲ့ Country reference table တစ်ခု ထည့်ပေးပါ။"
- "ကျွန်တော့် contract ထဲက String အစား enum ဒါမှမဟုတ် DateTime ဖြစ်သင့်တဲ့ field တွေ ရှိလား သုံးသပ်ပေးပါ။"
- "Post ကို User နဲ့ foreign key နဲ့ relation field တစ်ခု သုံးပြီး ချိတ်ပေးပါ။"

## နောက်တစ်ဆင့်

- [Relational data ကို model လုပ်ပါ](/docs/prisma/relational-databases) — SQL database တွေပေါ်မှာ one-to-one, one-to-many, many-to-many နဲ့ polymorphic relations။
- [MongoDB data ကို model လုပ်ပါ](https://www.prisma.io/docs/orm/data-modeling/mongodb) — embed လား reference လား၊ single-collection polymorphism။
- Schema နေရာတကျ ဖြစ်ရင် [Query လုပ်ကြည့်ပါ](/docs/prisma/reading-data)။
