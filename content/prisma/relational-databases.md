---
title: "Relational Database Data Modeling"
description: "PostgreSQL နဲ့ တခြား SQL database တွေအတွက် one-to-one, one-to-many, many-to-many, polymorphic relation တွေ model လုပ်နည်း — foreign key ကို ဘယ်ဘက်က ကိုင်ထားသင့်လဲဆိုတာ အပါအဝင်"
order: 12
source: "https://www.prisma.io/docs/orm/prisma-schema/data-model/relational-databases"
status: translated
updated: 2026-09-01
---

Relational database တစ်ခုမှာ model တစ်ခုစီက table တစ်ခု ဖြစ်ပြီး — scalar field တစ်ခုစီက column တစ်ခု ဖြစ်ပါတယ်။ Model တွေက foreign key တွေနဲ့ ချိတ်ဆက်ပါတယ် — table တစ်ခုထဲက column တစ်ခုက အခြား table ထဲက row တစ်ခုရဲ့ primary key ကို ကိုင်ထားတာပါ။

ဒီ page က relation ပုံစံ တစ်ခုချင်းစီကို ဘယ်လို model လုပ်မလဲ — ပြီးတော့ ပုံစံတစ်ခုစီအတွက် foreign key က ဘယ်မှာ ရှိသင့်လဲဆိုတာ ပြပါတယ်။ Model နဲ့ key တွေကို အသစ် စလေ့လာနေတယ်ဆိုရင် — [data modeling overview](https://www.prisma.io/docs/orm/data-modeling) ကနေ စပါ။

## Relation တွေကို ဘယ်လို ကြေညာမလဲ

ချိတ်ဆက်မှုကို သိမ်းထားတဲ့ model မှာ field နှစ်ခု ပါပါတယ် — foreign key column အတွက် scalar field တစ်ခု၊ အဲဒါကို သွားလာဖို့ relation field တစ်ခု။ `@relation(fields:, references:)` က နှစ်ခုကို ချိတ်ပေးပါတယ်:

```prisma
model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

`fields` argument ကို သယ်ဆောင်တဲ့ ဘက်က foreign key ကို ပိုင်ဆိုင်ပါတယ်။ ဘယ်ဘက်က ပိုင်ဆိုင်သင့်လဲဆိုတာက — အောက်က ပုံစံတွေထဲမှာ အဓိက ဆုံးဖြတ်ချက်ပါပဲ။

## One-to-many (တစ်ခုနဲ့အများ)

One-to-many relation (`1:n`) က record တစ်ခုကို အများကြီးနဲ့ ချိတ်ပေးပါတယ် — user တစ်ယောက်က post အများကြီး ရေးပြီး post တစ်ခုစီက user တစ်ယောက်တည်းနဲ့ ဆိုင်ပါတယ်။ ဒါက အသုံးအများဆုံး relation ပုံစံပါ။

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

Foreign key က "many" ဘက်ဖြစ်တဲ့ `Post.authorId` ပေါ်မှာ ရှိပါတယ် — ဘာလို့လဲဆိုတော့ post တစ်ခုစီက user အတိအကျ တစ်ယောက်ကို ညွှန်ပြီး user တစ်ယောက်ကတော့ post list အဖွင့်အဆုံးမရှိ ညွှန်နေလို့ပါ။ `User` ပေါ်က `posts Post[]` field က back-relation ပါ — database ထဲမှာ ဘာမှ မသိမ်းဘဲ `Post` ပေါ်က foreign key ကနေ အလိုအလျောက် ကောက်ချက်ချပါတယ်။

Record တစ်ခုက parent တစ်ခုတည်းနဲ့ ဆိုင်ပြီး parent က child အများကြီး ရှိတိုင်း one-to-many သုံးပါ — post တစ်ခုပေါ်က comments တွေ၊ order တစ်ခုထဲက line items တွေ၊ department တစ်ခုထဲက employees တွေလိုမျိုးပါ။

List field က virtual ဖြစ်လို့ — သူ့ဆီ ဘယ်တော့မှ ရေးမရပါဘူး။ Post တစ်ခုကို user တစ်ယောက်နဲ့ ချိတ်ဖို့ foreign key ကို သတ်မှတ်ပါ:

```ts
const post = await db.orm.public.Post.create({
  title: "Hello",
  authorId: user.id,
});
```

ဘက်နှစ်ဖက်စလုံးကနေ query လုပ်နည်းအတွက် [Relations and joins](/docs/prisma/relations-and-joins) ကို ကြည့်ပါ။

## One-to-one (တစ်ခုနဲ့တစ်ခု)

One-to-one relation (`1:1`) က ဘက်တစ်ခုစီမှာ record တစ်ခုထက် ပိုမချိတ်ပါဘူး — user တစ်ယောက်မှာ profile အများဆုံး တစ်ခု ရှိနိုင်ပြီး profile တစ်ခုက user အတိအကျ တစ်ယောက်နဲ့ပဲ ဆိုင်ပါတယ်။

One-to-many လိုပဲ model လုပ်ပြီး — foreign key ပေါ်မှာ `@unique` ထည့်ပါ။ Unique constraint ကမှ "many" ကို "အများဆုံး တစ်ခု" အဖြစ် ပြောင်းပေးပါတယ် — profile နှစ်ခု တည်းက user တစ်ယောက်တည်းကို ညွှန်လို့ မရတော့ပါဘူး:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

Relation ကို foreign key ကိုင်တဲ့ ဘက်မှာ ကြေညာပါ (ဒီမှာဆို `Profile`)။ အခြား model ပေါ်က mirror field (`User` ပေါ်က `profile Profile?`) ကို မထောက်ပံ့သေးလို့ — [relation ကို profile ဘက်ကနေ query လုပ်ပါ](/docs/prisma/relations-and-joins)။

### Foreign Key ကို ဘယ်ဘက်က ပိုင်ဆိုင်သလဲ

Foreign key ကို dependent ဘက်မှာ ထားပါ — သူ့ဘာသာ သီးခြား မတည်ရှိနိုင်တဲ့ record ပါ။

Profile က user လိုပါတယ်။ User က profile မလိုပါဘူး။ ဒါကြောင့် `Profile` က `userId` ကို သယ်ဆောင်ပါတယ်:

```prisma
model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

အခြား signal တွေအားလုံးကလည်း အဲဒီဘက်ကိုပဲ ညွှန်ပါတယ်။ Dependent record ဆိုတာ:

- ဒုတိယမှ ဖန်တီးတဲ့ဟာ။ `User` ကို အရင် ထည့်ပြီးမှ သူ့ `Profile` ကို ထည့်ပါ။
- Parent ပျောက်သွားရင် ဖျက်ရမယ့်ဟာ။
- မရှိတာ ပုံမှန်ဖြစ်တဲ့ဟာ။ User တစ်ယောက်မှာ profile မရှိတာ အဆင်ပြေပြီး — profile တစ်ခုမှာ user မရှိတာက ကျိုးပဲ့နေတဲ့ ဒေတာပါ။

Key ကို dependent ဘက်မှာ ထားတာက — `User` ကို profile ကိစ္စတွေကနေ ကင်းစေပြီး user တစ်ယောက် profile မရှိဘဲ ရှိနေခွင့် ပေးကာ profile တိုင်းမှာ user အတိအကျ တစ်ယောက် ရှိတာကို အာမခံပါတယ်။

ဘယ်ဘက်မှ ရှင်းရှင်းလင်းလင်း dependent မဟုတ်ဘူးဆိုရင် — key ကို query နည်းနည်းပဲ လုပ်တဲ့ ဘက်မှာ ထားပါ။

## Many-to-many (အများနဲ့အများ)

Many-to-many relation (`m:n`) က ဘက်တစ်ခုစီမှာ record အများကြီးနဲ့ ချိတ်ပါတယ် — post တစ်ခုမှာ tag အများကြီး ရှိနိုင်ပြီး tag တစ်ခုက post အများကြီးပေါ်မှာ သက်ရောက်နိုင်ပါတယ်။

Foreign key တစ်ခုတည်းနဲ့ ဒါကို ဖော်ပြလို့မရပါဘူး — ဘာလို့လဲဆိုတော့ ဘက်တစ်ခုစီက record အများကြီးကို ညွှန်နေလို့ပါ။ အဖြေက junction model ပါ — ချိတ်ဆက်ထားတဲ့ pair တစ်ခုစီအတွက် record တစ်ခုစီ ကိုင်ထားတဲ့ တတိယ model တစ်ခုပါ။

```prisma
model Post {
  id    Int       @id @default(autoincrement())
  title String
  tags  PostTag[]
}

model Tag {
  id    Int       @id @default(autoincrement())
  label String    @unique
  posts PostTag[]
}

model PostTag {
  postId Int
  tagId  Int
  post   Post @relation(fields: [postId], references: [id])
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
}
```

Junction model က one-to-many relation နှစ်ခု ကျောချင်းကပ် ထားတာပါ။ သူ့ရဲ့ composite primary key ဖြစ်တဲ့ `@@id([postId, tagId])` က pair တစ်ခုကို record တစ်ခုစီပဲ ဆိုတာ အာမခံပါတယ်။

Post တစ်ခုကို tag တစ်ခုနဲ့ ချိတ်တာက junction model ပေါ်မှာ သာမန် create ဖြစ်ပြီး — ဖြုတ်တာက delete ပါ:

```ts
await db.orm.public.PostTag.create({ postId: post.id, tagId: tag.id });
```

Junction က သာမန် model တစ်ခုမို့ — pair ကိုယ်တိုင်အကြောင်း ဒေတာတွေကိုပါ သယ်ဆောင်နိုင်ပါတယ်။ Tag ကို ဘယ်အချိန် ထည့်ခဲ့လဲ၊ ဘယ်သူ ထည့်ခဲ့လဲ၊ sort order — field တွေကို junction model ထဲ ထည့်ပါ:

```prisma
model PostTag {
  postId  Int
  tagId   Int
  addedAt DateTime @default(now())
  post    Post     @relation(fields: [postId], references: [id])
  tag     Tag      @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
}
```

Implicit many-to-many (Prisma 7 မှာလိုမျိုး junction model မပါဘဲ ဘက်နှစ်ဖက်စလုံးမှာ list field တွေ ထားတာ) ကို မထောက်ပံ့သေးပါဘူး — schema compiler က ငြင်းပြီး explicit join model တစ်ခု တောင်းပါတယ်။ Junction ကို ရှင်းရှင်းလင်းလင်း model လုပ်ပါ — [Relations and joins](/docs/prisma/relations-and-joins) မှာ query တစ်ခုထဲမှာ ဘယ်လို ဖြတ်သွားလဲ ပြထားပါတယ်။

## Polymorphic Relation များ

တစ်ခါတစ်ရံ record အမျိုးအစား အများကြီးက ဘုံ core တစ်ခုကို မျှဝေပြီး — တစ်ခုချင်းစီက ကိုယ်ပိုင် အပိုဆောင်း field တွေ သယ်ဆောင်ပါတယ်: `Task` တိုင်းမှာ title ရှိပြီး `Bug` မှာ severity ပါ၊ `Feature` မှာ target release ပါ။

Prisma 8 က ဒါကို base model တစ်ခုနဲ့ variant model တွေနဲ့ model လုပ်ပါတယ်။ Discriminator field တစ်ခုက row တစ်ခုစီ ဘယ် variant လဲဆိုတာ မှတ်တမ်းတင်ပါတယ်:

```prisma
model Task {
  id    Int    @id @default(autoincrement())
  title String
  type  String

  @@discriminator(type)
}

model Bug {
  severity String

  @@base(Task, "bug")
}

model Feature {
  targetRelease String?

  @@base(Task, "feature")

  @@map("features")
}
```

`@@discriminator(type)` က variant ကို မှတ်တမ်းတင်တဲ့ field ကို အမှတ်အသားလုပ်ပြီး — `@@base(Task, "bug")` က `Bug` ဟာ `Task` ရဲ့ `"bug"` variant ဖြစ်ကြောင်း ကြေညာပါတယ်။

Variant တွေက query တွေမှာ ကိုယ်ပိုင် model တွေအနေနဲ့ ပေါ်ပါတယ် (`db.orm.public.Bug` က `db.orm.public.Task` နဲ့အတူ) — ပြီးတော့ base model ပေါ်က query က variant တိုင်းကို ပြန်ပေးပါတယ်။ ရေးတဲ့အခါ variant တစ်ခုကနေ create လုပ်ရင် discriminator value ကို ကိုယ်တိုင် ထည့်ပေးရပါတယ် (`{ title, severity, type: "bug" }`) — အလိုအလျောက် ဖြည့်ပေးတာ မရသေးပါဘူး။

Variant တစ်ခုစီက storage layout နှစ်မျိုးထဲက တစ်မျိုးကို ရွေးပါတယ်:

- `@@map` မပါတဲ့ variant — `Bug` လိုမျိုး — က base table ကို မျှဝေပါတယ်။ သူ့ရဲ့ အပိုဆောင်း column တွေက base column တွေဘေးမှာ ရှိပြီး storage level မှာ nullable ဖြစ်ရပါမယ် — ဘာလို့လဲဆိုတော့ `Feature` row တစ်ခုမှာ severity မရှိလို့ပါ။
- ကိုယ်ပိုင် `@@map` ပါတဲ့ variant — `Feature` လိုမျိုး — က သူ့ရဲ့ အပိုဆောင်း column တွေပဲ ပါတဲ့ ကိုယ်ပိုင် table ရပြီး base table ရဲ့ primary key နဲ့ ပြန်ချိတ်ပါတယ်။ သူ့ရဲ့ column တွေက ကိုယ့် constraint တွေ ဆက်ထိန်းထားပြီး — variant အပြည့်အစုံ ဖတ်ဖို့ join တစ်ခု လိုပါတယ်။

Variant တွေကို အတူတူ query လုပ်တဲ့အခါ (task feed တစ်ခု၊ event stream တစ်ခု) နဲ့ variant တစ်ခုစီမှာ ကိုယ်ပိုင် ဖွဲ့စည်းပုံ အစစ်အမှန် ရှိနေတဲ့အခါ polymorphism သုံးပါ။ သူတို့ကို အတူတူ ဘယ်တော့မှ query မလုပ်ဘူးဆိုရင် — model တွေ သီးခြားစီ ထားတာ ပိုရိုးပါတယ်။ Variant တွေက nullable field တစ်ခုနဲ့ပဲ ကွာတယ်ဆိုရင် — model တစ်ခုတည်းနဲ့တင် ပိုရိုးသေးပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က relation modeling ကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုစီနဲ့ ကိုက်ညီတဲ့ prompt တွေ:

- "prisma-8 skill ကို သုံးပြီး User နဲ့ Post ကြားမှာ foreign key က Post ပေါ်မှာ ရှိတဲ့ one-to-many ထည့်ပေးပါ။"
- "Profile relation ရဲ့ foreign key ပေါ်မှာ unique constraint ထည့်ပြီး one-to-one ဖြစ်အောင် လုပ်ပေးပါ။"
- "Post နဲ့ Tag ကြားမှာ explicit junction model နဲ့ addedAt timestamp ပါတဲ့ many-to-many ကို model လုပ်ပေးပါ။"
- "Task ကို discriminator field နဲ့ Bug နဲ့ Feature variant တွေအဖြစ် ခွဲပေးပါ။"

## နောက်တစ်ဆင့်

- [Relation တွေ Query လုပ်ခြင်း](/docs/prisma/relations-and-joins) — `.include(...)`, relation predicates, junction traversal နဲ့။
- MongoDB အတွက် model လုပ်ဖို့ဆိုရင် — [MongoDB data modeling guide](https://www.prisma.io/docs/orm/data-modeling/mongodb) ကို ကြည့်ပါ။
- Referential actions (delete လုပ်တဲ့အခါ ဆက်စပ်နေတဲ့ row တွေကို ဘာဖြစ်စေမလဲ) ကို relations reference ထဲမှာ ပါလာတာနဲ့ ဖော်ပြပါမယ်။
