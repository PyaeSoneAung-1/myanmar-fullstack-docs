---
title: "MongoDB Data Modeling (ဒေတာ Model ရေးဆွဲခြင်း)"
description: "MongoDB မှာ documents, collections နဲ့ _id key တွေကို model လုပ်ခြင်း — ဘယ်အခါ embed လုပ်ရမလဲ ဘယ်အခါ reference လုပ်ရမလဲ ဆုံးဖြတ်နည်း၊ embedded types, cross-collection references နဲ့ polymorphic collections အသေးစိတ်"
order: 36
source: "https://www.prisma.io/docs/orm/data-modeling/mongodb"
status: translated
updated: 2026-09-02
---

MongoDB က data တွေကို collections တွေထဲမှာ စုထားတဲ့ documents တွေအနေနဲ့ သိမ်းပါတယ်။ Document တစ်ခုက objects နဲ့ arrays တွေကို တိုက်ရိုက် nest လုပ်လို့ရတာမို့ — ဆက်စပ်တဲ့ data တွေအတွက် ရွေးချယ်စရာ အစစ်အမှန် တစ်ခု ရှိပါတယ်: document ထဲမှာပဲ ထားမလား (embed လုပ်မလား) ဒါမှမဟုတ် ကိုယ်ပိုင် collection တစ်ခုထဲမှာ သိမ်းပြီး ချိတ်မလား (reference လုပ်မလား)။

အဲဒီ ရွေးချယ်မှုကို ကောင်းကောင်း လုပ်နိုင်ဖို့ကပဲ MongoDB data modeling ရဲ့ အနှစ်သာရ ဖြစ်ပြီး — ဒီ page ရဲ့ အဓိက အာရုံစိုက်ရာလည်း ဖြစ်ပါတယ်။ Models နဲ့ keys တွေကို အသစ် လေ့လာနေတယ်ဆိုရင် [data modeling overview](/docs/prisma/data-modeling) ကနေ စပါ။

## Documents, Collections နဲ့ _id Key

Prisma 8 model တစ်ခုက collection တစ်ခုဆီ map လုပ်ပြီး — record တစ်ခုချင်းစီက document တစ်ခုပါ။ Document တိုင်းမှာ primary key အနေနဲ့ `_id` field ရှိပါတယ်။ `ObjectId` က အဲဒါအတွက် idiomatic type ပါ:

```prisma
model User {
  id    ObjectId @id @map("_id")
  name  String
  email String
  @@map("users")
}
```

`@map("_id")` က model ရဲ့ `id` field ကို MongoDB ရဲ့ မဖြစ်မနေ `_id` field ဆီ map လုပ်ပြီး — `@@map("users")` က collection ကို နာမည်ပေးပါတယ်။

## Embed လုပ်မလား Reference လုပ်မလား

ဆက်စပ်နေတဲ့ data နှစ်ခုက document တစ်ခုတည်းထဲမှာ အတူ နေနိုင်ပါတယ် (embedded) — ဒါမှမဟုတ် id တစ်ခုနဲ့ ချိတ်ထားတဲ့ collection တွေချင်း သီးခြား ရှိနိုင်ပါတယ် (referenced)။

Embedding က data ကို သူ့ parent ထဲမှာ nest လုပ်ပါတယ်: order တစ်ခုနဲ့ သူ့ line items တွေ document တစ်ခုထဲမှာပါ။ Read တစ်ခါလုပ်ရင် အကုန်လုံး ပြန်ရပြီး — write တစ်ခါလုပ်ရင် parent ရော children ရော အတူတူ၊ atomically update လုပ်ပါတယ်။ အပေးအယူ (trade-off) ကတော့ embedded data မှာ ကိုယ်ပိုင် သီးခြားဘဝ မရှိပါဘူး။ သူ့ချည်းသက်သက် query လုပ်လို့မရသလို — parent ကို ဖတ်တိုင်း ပါပါလာပါတယ်။

Referencing ကတော့ data ကို ကိုယ်ပိုင် collection ထဲမှာ သိမ်းပြီး — ချိတ်ထားတဲ့ document ရဲ့ `_id` ကို သိမ်းပါတယ်။ နှစ်ခုလုံး load ဖို့ ဒုတိယ lookup တစ်ခု လိုပေမယ့် — record တစ်ခုချင်းစီက ကိုယ့်ခြေထောက်ပေါ် ကိုယ် ရပ်နိုင်ပါတယ်: သူ့ချည်းသက်သက် query လုပ်လို့ရတယ်၊ စာရင်းပြန်လို့ရတယ်၊ update လုပ်လို့ရတယ်၊ ပြီးတော့ parents အများကြီးက ညွှန်တဲ့အခါ ပုံတူပွားမနေပါဘူး။

အမြန် ဆုံးဖြတ်နည်း တစ်ခု:

| Signal (အချက်ပြ) | ဥပမာ | ဘက်ကို စောင်းမလဲ |
| --- | --- | --- |
| Parent နဲ့ အမြဲတမ်း တွဲ load လုပ်ရတယ် | Order တစ်ခုရဲ့ line items | Embed |
| အရွယ်အစား သေးငယ်ပြီး ကန့်သတ်ထားလို့ရတယ် | User တစ်ယောက်ရဲ့ mailing address | Embed |
| Parent အပြင် ဘာမှ အဓိပ္ပာယ် မရှိဘူး | Post တစ်ခုရဲ့ SEO metadata | Embed |
| ကန့်သတ်ချက် မရှိဘဲ ကြီးထွားတယ် | User တစ်ယောက်ရဲ့ activity events | Reference |
| သူ့ချည်းသက်သက် query ဒါမှမဟုတ် update လုပ်တယ် | Catalog ထဲက products | Reference |
| Parents အများကြီးက မျှဝေသုံးတယ် | Posts ထောင်ပေါင်းများစွာပေါ်က tag တစ်ခု | Reference |

Blog post တစ်ခုရဲ့ comments တွေနဲ့ ကြည့်ရင် ပိုထင်ရှားပါတယ်။ Post နဲ့ အမြဲတမ်း တွဲ render လုပ်ပြီး — သူတို့ရဲ့ အရေအတွက်က အတန်အသင့်ပဲ ဆိုရင် embed လုပ်ပါ။ Comments တွေက ထောင်ဂဏန်းအထိ ကြီးထွားနိုင်ရင် ဒါမှမဟုတ် "ဒီ author ရဲ့ post တွေအနှံ့က comment တိုင်း" လိုမျိုး လိုအပ်ရင်တော့ reference လုပ်ပါ။

## Embedded Documents

Embedded data ရဲ့ ပုံသဏ္ဍာန်ကို `type` block တစ်ခုနဲ့ ဖော်ပြပြီး — field တစ်ခုအနေနဲ့ သုံးပါ။ Embedded type တစ်ခုမှာ ကိုယ်ပိုင် collection မရှိပါဘူး; သူ့ parent document ထဲမှာပဲ ရှိပါတယ်။

```prisma
type Address {
  street  String
  city    String
  zip     String?
  country String
}

model User {
  id      ObjectId @id @map("_id")
  name    String
  address Address?
  @@map("users")
}
```

Embedded value တစ်ခုတည်းက one-to-one တစ်ခုကို model လုပ်ပြီး — embedded values တစ်စုကတော့ one-to-many တစ်ခုကို model လုပ်ပါတယ်:

```prisma
type CartItem {
  productId String
  name      String
  amount    Int
}

model Cart {
  id    ObjectId   @id @map("_id")
  items CartItem[]
  @@map("carts")
}
```

`Cart.items` က cart document ထဲမှာပဲ ရှိပါတယ်။ Items တွေ load လုပ်ဖို့ သီးခြား collection ရော join ရော မရှိပါဘူး — cart ကို ဖတ်တိုင်း သူတို့ပါ ပြန်လာပါတယ်။

Embedded `Address` တစ်ခုမှာ `_id` မရှိသလို — သူ့ချည်းသက်သက် query လုပ်လို့လည်း မရပါဘူး။ သူ့ကို ထိန်းထားတဲ့ document နဲ့အတူ load လုပ်၊ update လုပ်ပြီး delete လုပ်ရပါတယ်။ ဒါက သူတို့ parent နဲ့ သက်ဆိုင်တဲ့ values တွေအတွက် မှန်ကန်တဲ့ အပြုအမူ ဖြစ်ပြီး — ကိုယ်ပိုင်ဘဝ ရှိတဲ့ records တွေအတွက်တော့ မှားတဲ့ အပြုအမူ ဖြစ်ပါတယ်။

> **Warning — Embedded arrays တွေက ကန့်သတ်ထားနေသရွေ့ပဲ ကောင်းပါတယ်**
>
> အဆုံးမရှိ ကြီးထွားနေတဲ့ array တစ်ခုက parent ကို ဖတ်တိုင်း နှေးစေပြီး — document ကို MongoDB ရဲ့ 16 MB limit ဆီ နီးကပ်စေပါတယ်။ List တစ်ခုမှာ သဘာဝအလျောက် မျက်နှာကျက် မရှိဘူးဆိုရင် အဲဒီအစား reference လုပ်ပါ။

## Collections ဖြတ်ကျော်တဲ့ References

ဆက်စပ်နေတဲ့ records တွေက ကိုယ်ပိုင် collection လိုအပ်တဲ့အခါ — document တစ်ခုရဲ့ `_id` ကို တစ်ခုပေါ်မှာ သိမ်းပြီး Prisma 8 မှာ နေရာတိုင်း သုံးနေကျ `@relation(fields:, references:)` နဲ့ပဲ relation ကို ကြေညာပါ:

```prisma
model User {
  id    ObjectId @id @map("_id")
  name  String
  posts Post[]
  @@map("users")
}

model Post {
  id       ObjectId @id @map("_id")
  title    String
  authorId ObjectId
  author   User     @relation(fields: [authorId], references: [id])
  @@map("posts")
}
```

ဒါက reference နဲ့ လုပ်ထားတဲ့ one-to-many တစ်ခုပါ: posts အများကြီးက user တစ်ယောက်ဆီ ညွှန်ပြီး — post တစ်ခုချင်းစီက သူ့ချည်းသက်သက် query လုပ်လို့ရပါတယ်။ [Query တစ်ခုထဲမှာ relation ကို include လုပ်တဲ့အခါ](https://www.prisma.io/docs/orm/fundamentals/relations-and-joins) — Prisma 8 က `$lookup` aggregation တစ်ခုနဲ့ ဖြေရှင်းပေးပါတယ်။

`$lookup` တစ်ခုက hot paths တွေပေါ်မှာ ကုန်ကျစရိတ် အစစ်အမှန် တစ်ခုမို့ — document models တွေက မကြာခဏ denormalize လုပ်ပါတယ်: read တစ်ခုက လိုအပ်တဲ့ fields တွေရဲ့ သေးငယ်တဲ့ ပုံတူတစ်ခုကို embed လုပ်ပြီး (comment တစ်ခုက သူ့ author ရဲ့ နာမည်ကို သိမ်းထားသလိုမျိုး) — full record ကတော့ ကိုယ်ပိုင် collection ထဲမှာ ဆက်ရှိပါတယ်။ ပုံတူကူးထားတာနဲ့ အဲဒီ ပုံတူကို ထပ်တူထားဖို့ လိုအပ်တဲ့ အလုပ်တွေကို အပေးအယူ လုပ်လိုက်ရပြီး — document တစ်ခုတည်းကိုပဲ ထိရတဲ့ reads တွေ ရလာပါတယ်။

## Polymorphic Collections

MongoDB collections တွေက ပုံစံတစ်ခုတည်းကို အတင်းအကျပ် မလုပ်ပါဘူး — ဒါကြောင့် မျိုးစုံတဲ့ documents တွေကို collection တစ်ခုထဲမှာ သိမ်းပြီး — discriminator field တစ်ခုနဲ့ ခွဲခြားတာက idiomatic ပါ။

Prisma 8 က ဒါကို base model တစ်ခုနဲ့ variant models တွေနဲ့ ပုံစံဖော်ပါတယ် — collection တစ်ခုတည်းကို အားလုံး မျှဝေသုံးပါတယ်:

```prisma
model Post {
  id       ObjectId @id @map("_id")
  title    String
  kind     String

  @@discriminator(kind)
  @@map("posts")
}

model Article {
  summary String

  @@base(Post, "article")
}

model Tutorial {
  difficulty String
  duration   Int

  @@base(Post, "tutorial")
}
```

`@@discriminator(kind)` က document တစ်ခုချင်းစီရဲ့ variant ကို မှတ်တမ်းတင်တဲ့ field ကို နာမည်ပေးပြီး — `@@base(Post, "article")` က `Article` ကို `Post` ရဲ့ `"article"` variant အဖြစ် ကြေညာပါတယ်။ Posts အတွက် query တစ်ခုက articles ရော tutorials ရော အတူတူ ပြန်ပေးပြီး — queries တွေမှာ variant တစ်ခုဆီကို ကျဉ်းမြောင်းအောင် လုပ်လို့လည်း ရပါတယ်။

Variants တွေကို သီးခြားစီ ထက် အတူတူ ကိုင်တွယ်တာက အများကြီး ပိုများတဲ့အခါ polymorphic collection တစ်ခုကို သုံးပါ: email, SMS နဲ့ push messages တွေကို stream တစ်ခုတည်းအဖြစ် ဖတ်ရတဲ့ notifications collection တစ်ခုလိုမျိုးပါ။ Types တွေက query တစ်ခုတည်းထဲမှာ ခဲခဲယဉ်းယဉ်းပဲ ပေါ်တာ ဒါမှမဟုတ် အရမ်းကွဲပြားတဲ့ indexes တွေ လိုအပ်တယ်ဆိုရင် — collection တွေကို သီးခြားစီ ထားတာ ပိုကောင်းပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က document modeling ကို လွှမ်းခြုံပါတယ်။ Section တစ်ခုချင်းစီနဲ့ ကိုက်ညီတဲ့ prompts တွေ:

- "prisma-8 skill ကို သုံးပြီး User model မှာ embedded Address type တစ်ခု ထည့်ပေးပါ။"
- "Cart items တွေကို cart နဲ့ အမြဲတမ်း တွဲဖတ်တယ်။ သူတို့ကို embedded list အနေနဲ့ model လုပ်ပေးပါ။"
- "Comments တွေက ကန့်သတ်ချက် မရှိဘဲ ကြီးထွားနိုင်တယ်။ သူတို့ကို embedded array ကနေ referenced collection ဆီ ပြောင်းပေးပါ။"
- "Posts collection ကို discriminator တစ်ခုနဲ့ Article နဲ့ Tutorial variants နှစ်ခုအဖြစ် ခွဲပေးပါ။"

## နောက်တစ်ဆင့်

- [Documents တွေကို query လုပ်ပြီး](/docs/prisma/reading-data) [references တွေကို `.include(...)` နဲ့ ဖြေရှင်းပါ](/docs/prisma/relations-and-joins)။
- [Pipeline builder](/docs/prisma/advanced-queries) နဲ့ documents တွေကို aggregate လုပ်ပြီး ပုံစံပြောင်းပါ။
- Relational data တွေကို model လုပ်ဖို့ [relational data modeling guide](/docs/prisma/relational-databases) ကို ကြည့်ပါ။
