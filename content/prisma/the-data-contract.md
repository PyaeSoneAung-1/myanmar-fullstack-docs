---
title: "ဒေတာ Contract (The Data Contract)"
description: "Prisma 8 မှာ data model နဲ့ storage layout ကို တစ်ခုတည်းသော ဖော်ပြချက်အနေနဲ့ သတ်မှတ်တဲ့ data contract — queries တွေ type-check လုပ်တာ၊ migrations တွေ စီစဉ်တာ၊ database ကို verify လုပ်တာအားလုံး ဒီ contract ပေါ်မှာ အခြေခံပါတယ်"
order: 23
source: "https://www.prisma.io/docs/orm/contract-authoring/the-data-contract"
status: translated
updated: 2026-09-02
---

Data contract ဆိုတာ သင့် data model နဲ့ သူ့ရဲ့ storage layout (သိမ်းဆည်းမှု အသေးစိတ်) ကို တစ်ခုတည်းသော ဖော်ပြချက်အနေနဲ့ သတ်မှတ်ပေးတာပါ။ Prisma 8 ထဲမှာ အရာအားလုံးက ဒီ contract နဲ့အညီပဲ — type သတ်မှတ်တာ (typed)၊ စီစဉ်တာ (planned) နဲ့ စစ်ဆေးတာ (verified) အားလုံး ဖြစ်ပါတယ်။

Prisma 8 project တိုင်းမှာ သူ့ဒေတာအတွက် ဖော်ပြချက် တစ်ခုတည်း ရှိပါတယ် — models တွေ၊ သူတို့ရဲ့ fields တွေနဲ့ database table တွေဆီ ဘယ်လို map လုပ်ထားလဲဆိုတာပါ။ အဲဒီ ဖော်ပြချက်ကိုပဲ data contract လို့ ခေါ်ပါတယ်။

ဥပမာ — blog တစ်ခုရဲ့ contract က `User` နဲ့ `Post` ကို ကြေညာပြီး တစ်ခုချင်းစီမှာ ပါတဲ့ field တွေနဲ့ သူတို့ ဆက်စပ်ပုံကိုပါ ဖော်ပြပါတယ်။ ဒါကို Prisma ရဲ့ schema language ဖြစ်တဲ့ PSL နဲ့ ရေးပါတယ်:

```prisma title="prisma/contract.prisma"
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id     Int    @id @default(autoincrement())
  title  String
  userId Int

  user User @relation(fields: [userId], references: [id])
}
```

Prisma 8 က ဒါကို machine-readable artifact အဖြစ် compile လုပ်ပြီး — ကျန် toolchain တစ်ခုလုံးက အဲဒီ artifact ပေါ်မှာ အလုပ်လုပ်ပါတယ်: queries တွေကို contract နဲ့ ဆန့်ကျင်ပြီး type-check လုပ်တယ်၊ migrations တွေကို contract ပေါ်က အပြောင်းအလဲတွေအနေနဲ့ စီစဉ်တယ်၊ database ကိုလည်း သင့် code မလည်ခင် contract နဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပါတယ်။

ဒါကို သင့်ဒေတာအတွက် `package-lock.json` တစ်ခုလို့ မြင်ကြည့်ပါ — သင့် application က database ဆီက ဘာတွေ မျှော်လင့်ထားလဲဆိုတဲ့ တိကျပြီး version သတ်မှတ်ထားတဲ့ မှတ်တမ်း တစ်ခုပါ။

> **Contract နဲ့ Schema**
>
> Prisma 8 မှာ **contract** ဆိုတာ သင့် code ထဲမှာ ရေးလိုက်တဲ့အရာ ဖြစ်ပြီး — **schema** ဆိုတာ သင့် database ရဲ့ အစစ်အမှန် ဖွဲ့စည်းပုံပါ။ တချို့ tool တွေက ဒီစကားလုံး နှစ်လုံးကို ပြောင်းပြန် သုံးတတ်လို့ ဒီကွာခြားချက်ကို သတိထားပါ: သင်က contract ကို ရေးရပြီး — Prisma 8 က database ရဲ့ schema က အဲဒီ contract ကို ဖြည့်ဆည်းနေလားဆိုတာ စစ်ဆေးပေးပါတယ်။

## Contract ဘာကြောင့်လဲ

Prisma ORM ရဲ့ လက်ရှိ architecture က သင့် schema ကို generate လုပ်ထားတဲ့ client code အဖြစ် compile လုပ်ပါတယ်။ Schema အကြောင်း အသိပညာက ရှိပါတယ် — ဒါပေမယ့် client ကိုယ်တိုင်ပဲ အနက်ကောက်နိုင်တဲ့ code ထဲမှာ မြှုပ်နှံနေပါတယ်။

Prisma 8 ကတော့ schema အသိပညာကို ပွင့်လင်းစွာ ထားပါတယ်။ သင့် contract source က plain file နှစ်ခုအဖြစ် compile လုပ်ပါတယ် — models, storage နဲ့ capabilities တွေရဲ့ canonical JSON ဖော်ပြချက် ဖြစ်တဲ့ `contract.json` နဲ့ အဲဒီကနေ ဆင်းသက်လာတဲ့ TypeScript types တွေ ဖြစ်တဲ့ `contract.d.ts` တို့ပါ။ နှစ်ခုလုံးက deterministic ဖြစ်ပါတယ် — source အတူတူဆို byte-အဆင့်အထိ တူညီတဲ့ output ကို အမြဲ ထုတ်ပေးလို့ code review မှာ diff ကြည့်လို့ရတယ်၊ verification အတွက် hash လုပ်လို့ရတယ်၊ tools နဲ့ AI agents တွေလည်း တိုက်ရိုက် ဖတ်လို့ရပါတယ်။

Contract က သူဖော်ပြနေတဲ့ schema version အတိအကျကိုလည်း ဖော်ထုတ်ပေးပါတယ်။ Contract ကို emit လုပ်တဲ့အခါ Prisma 8 က content ပေါ်မှာ hash တွေ တွက်ပြီး — [`db sign`](https://www.prisma.io/docs/cli/db-sign) က အဲဒီ hash တွေကို database ထဲက marker အသေးလေးတစ်ခုမှာ မှတ်တမ်းတင်ပါတယ်။ Query တွေ မစတင်ခင် Prisma 8 က ကိုယ် build လုပ်ထားတဲ့ contract ကို ဆက်သွယ်နေတဲ့ database ထဲက marker နဲ့ ယှဉ်ကြည့်ပါတယ်။ မကိုက်ညီဘူးဆိုရင် — ဥပမာ migration မလုပ်ရသေးတဲ့ database ပေါ်ကို deploy လုပ်လိုက်တာမျိုးမှာ — query တစ်ခုမှ မလည်ခင် verification က ကျရှုံးပါတယ်။

## ဘယ်လို အလုပ်လုပ်လဲ

Prisma 8 project တစ်ခုက contract source တစ်ခုကို `prisma.config.ts` ထဲမှာ ကြေညာပါတယ်:

```typescript title="prisma.config.ts"
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
  }),
});
```

Source က Prisma schema file (`contract.prisma`) ဒါမှမဟုတ် TypeScript file (`contract.ts`) ဖြစ်နိုင်ပါတယ်။ File extension က authoring mode ကို ရွေးပေးပါတယ်။ Mode နှစ်မျိုးလုံးက တူညီတဲ့အရာတွေကို ဖော်ပြပါတယ် — fields နဲ့ relations ပါတဲ့ models တွေ၊ သူတို့ map လုပ်တဲ့ tables နဲ့ columns တွေ၊ named types တွေ၊ enums တွေနဲ့ extension က ထောက်ပံ့ပေးတဲ့ types တွေပါ။

Emit လုပ်ခြင်းက source ကို artifact တွေအဖြစ် ပြောင်းပေးပါတယ်:

#### bun

```bash
bunx prisma@latest contract emit
```

#### pnpm

```bash
pnpm dlx prisma@latest contract emit
```

#### yarn

```bash
yarn dlx prisma@latest contract emit
```

#### npm

```bash
npx prisma@latest contract emit
```

ဒါက `contract.json` နဲ့ `contract.d.ts` ကို source ရဲ့ ဘေးမှာ ရေးပေးပါတယ်။ အဲဒီကစပြီး ကျန် toolchain က ဆက်လုပ်ပါတယ်:

- Query API တွေက `contract.d.ts` ကို load လုပ်ပြီး — typed models, fields နဲ့ results တွေ ပေးပါတယ်။
- Runtime က `contract.json` ကို လက်ခံပြီး — သူ့ရဲ့ hash တွေကို database ထဲက marker နဲ့ စစ်ဆေးပါတယ်။
- Migration tooling က contract နှစ်ခုကို diff လုပ်ပြီး schema အပြောင်းအလဲတွေ စီစဉ်ကာ [`db verify`](https://www.prisma.io/docs/cli/db-verify) က live database ကို လက်ရှိ contract နဲ့ စစ်ဆေးပါတယ်။

## Authoring Mode နှစ်မျိုး၊ Artifact တစ်ခုတည်း

[PSL](https://www.prisma.io/docs/orm/contract-authoring/psl-syntax) က contract ရေးဖို့ အနှစ်သက်ဆုံး နည်းလမ်းပါ — ဒေတာဖော်ပြဖို့အတွက်ပဲ သီးသန့် တည်ဆောက်ထားတဲ့ ကျစ်လစ်တဲ့ language တစ်ခုပါ။ `create-prisma` က scaffold လုပ်တာ၊ existing database တစ်ခုကနေ စတင်တဲ့အခါ [`contract infer`](https://www.prisma.io/docs/cli/contract-infer) က ရေးပေးတာ၊ ဒီ docs တစ်လျှောက်က နမူနာတွေအားလုံးက ဒီ PSL ကိုပဲ သုံးပါတယ်။

PSL မလွှမ်းခြုံတဲ့ ကိစ္စတွေအတွက်တော့ model တွေကို **[TypeScript builder](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder)** နဲ့ပဲ define လုပ်ပါ။ Model definition တွေကို သာမန် TypeScript modules တွေအနေနဲ့ compose လုပ်၊ generate လုပ် ဒါမှမဟုတ် မျှဝေရမယ့် အခြေအနေမျိုးမှာ အဲဒါကို သုံးပါ။

Mode နှစ်မျိုးလုံးက တူညီတဲ့ contract ကို ထုတ်ပေးပါတယ်။ ညီမျှတဲ့ schema တစ်ခုအတွက် တူညီတဲ့ `contract.json` ကို emit လုပ်လို့ — ဘယ် mode နဲ့ ရေးရေး migrations, verification နဲ့ query APIs တွေရဲ့ အပြုအမူက အတူတူပါပဲ။ PSL နဲ့ပဲ ဆက်နေရင် ဘာမှ မဆုံးရှုံးပါဘူး။ Project တစ်ခုက source of truth တစ်ခုကိုပဲ တိကျစွာ ကြေညာပါတယ် — config ထဲက `contract` နာမည်နဲ့ ဖော်ပြတဲ့ file ပါ။ ကျန် ပုံစံကို project ထဲ မထည့်ပါနဲ့ — ဒါမှမဟုတ် generated reference တစ်ခုလိုပဲ သဘောထားပါ — ဒါဆို နှစ်ခုက ဘယ်တော့မှ သဘောကွဲလို့ မရတော့ပါဘူး။

## Contract ထဲမှာ ဘာတွေ ပါဝင်လဲ

Contract က structure ကို ဖော်ပြတာပါ — data ကို မဟုတ်ပါဘူး:

- Models, fields နဲ့ relations တွေ၊ tables နဲ့ columns တွေဆီ ဘယ်လို map လုပ်လဲဆိုတာ
- Storage အသေးစိတ် — primary keys, unique constraints, indexes နဲ့ foreign keys
- Named types, enums နဲ့ value objects
- Extension packs တွေက ထည့်ပေးတဲ့ types နဲ့ capabilities — ဥပမာ pgvector ရဲ့ `Vector`
- ဒီ schema version အတိအကျကို ဖော်ထုတ်ပေးတဲ့ content hashes

သူ့ထဲမှာ rows တွေ၊ credentials တွေ၊ connection အသေးစိတ်တွေ မပါတာမို့ — source ရော emit လုပ်ထားတဲ့ artifacts ပါ version control ထဲ commit လုပ်တာက လုံခြုံပြီး ပုံမှန် လုပ်သင့်တဲ့အရာပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ကို လွှမ်းခြုံပါတယ်။ Agent ကို ဒီလို မှာကြည့်ပါ:

- "prisma-8 skill ကို သုံးပြီး ကျွန်တော်တို့ရဲ့ contract.json က လက်ရှိ ဘာတွေ ကြေညာထားလဲ ရှင်းပြပေးပါ။"
- "Contract ထဲကို Invoice model တစ်ခု ထည့်ပြီး emit လုပ်ပေးပါ။"
- "ကျွန်တော်တို့ရဲ့ database က contract ကို ဆက်ပြီး ဖြည့်ဆည်းနေသေးလား စစ်ဆေးပေးပါ။"

## နောက်တစ်ဆင့်

- [သင့် ဒေတာကို model လုပ်ပါ](/docs/prisma/data-modeling) — contract မရေးခင် models, keys နဲ့ relations တွေ အကြောင်း လေ့လာပါ။
- [Contract ပေါ်မှာ query လုပ်ပါ](/docs/prisma/reading-data) — ဒီမှာ ရေးထားတဲ့အရာနဲ့အညီ result တိုင်း type သတ်မှတ်ပြီးသား ဖြစ်ပါတယ်။
- [Author in PSL](https://www.prisma.io/docs/orm/contract-authoring/psl-syntax) — contract ကို Prisma schema file အနေနဲ့ ရေးနည်း — သိပြီးသား schema language အပြင် Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေပါ ပါဝင်ပါတယ်။
- [Author in TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) — schema file အစား typed contract builder နဲ့ တူညီတဲ့ models တွေကို သတ်မှတ်နည်း။
- [The contract artifact](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) — `contract.json` နဲ့ `contract.d.ts` ထဲမှာ ဘာတွေ ပါလဲ၊ hash တွေ ဘယ်လို အလုပ်လုပ်လဲ။
- [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) — Prisma 8 က contract လိုအပ်တာတွေကို သင့် database က ထောက်ပံ့နိုင်လားဆိုတာ ဘယ်လို စစ်ဆေးလဲ။
