---
title: "Migration တွေ ဘယ်လို အလုပ်လုပ်လဲ (How Migrations Work)"
description: "Contract ကို ပြောင်းပါ၊ migration plan လုပ်ပါ၊ သုံးသပ်ပါ၊ apply လုပ်ပါ — step တိုင်းကို run မလုပ်ခင် နဲ့ လုပ်ပြီး နှစ်ကြိမ်လုံး စစ်ဆေးပါတယ်"
order: 15
source: "https://www.prisma.io/docs/orm/prisma-migrate/how-migrations-work"
status: translated
updated: 2026-09-01
---

Migration ဆိုတာ contract ပြောင်းလဲတဲ့အခါ Prisma 8 က သင့် database ကို ပြောင်းလဲပေးတဲ့ နည်းလမ်းပါ။ **Contract** ဆိုတာ သင်ရေးတဲ့ schema ဖော်ပြချက် (`.prisma` file ဒါမှမဟုတ် TypeScript) နဲ့ သူ compile လုပ်ထွက်တဲ့ `contract.json` artifact ပါ။ **Schema** ကတော့ database ရဲ့ အစစ်အမှန် ဖွဲ့စည်းပုံဖြစ်ပြီး — migration တွေက အဲဒါကို ရွှေ့ပေးတာပါ။ Model တစ်ခုကို field တစ်ခု ထည့်လိုက်ရင် — သင့် app ကို ဝန်ဆောင်ပေးနေတဲ့ database တိုင်းမှာ (laptop, staging, production) `ALTER TABLE` run ဖို့ တစ်ခုခု လိုပါတယ်။ Migration တွေက အဲဒီတစ်ခုခုပဲ ဖြစ်ပြီး — ပြောင်းလဲမှုကို ပြန်လည်သုံးသပ်လို့ရအောင်၊ ထပ်လုပ်လို့ရအောင်၊ ကုဒ်နဲ့အတူ version လိုက်အောင် repo ထဲမှာ file တွေအနေနဲ့ မှတ်တမ်းတင်ပါတယ်။

Workflow က development မှာ တစ်နေ့ အကြိမ်များစွာ လုပ်ရမယ့် loop တစ်ခုပါ:

> **Animation: migration loop** — contract ပြောင်းတာ → migration plan လုပ်တာ → review လုပ်တာ → apply လုပ်တာဆိုတဲ့ cycle ကို သရုပ်ပြထားပါတယ်။

1. **Contract ကို ပြောင်းပါ**: `.prisma` file ကို ပြင်ပြီး `contract emit` run ပါ — ဒါက contract ကို တခြား command တိုင်း ဖတ်တဲ့ `contract.json` artifact အဖြစ် compile လုပ်ပေးပါတယ်။
2. **Migration plan လုပ်ပါ**: `migration plan` က contract အသစ်ကို သင့် migration history နဲ့ ယှဉ်ပြီး `migrations/` အောက်မှာ migration directory တစ်ခု ရေးပါတယ်။
3. **သုံးသပ်ပါ**: generate လုပ်ထားတဲ့ TypeScript နဲ့ DDL preview ကို ဖတ်ပါ။ ပြောင်းလဲမှုမှာ data step လိုရင် migration ကို ပြင်ပြီး — ပြန် compile ဖို့ file ကို ပြန် run ပါ။
4. **Apply လုပ်ပါ**: `db migrate` က pending migration တွေကို သင့် database ပေါ်မှာ run ပါတယ်။

Database connection တစ်ခု configure လုပ်ထားတဲ့ project တစ်ခုမှာ ([quickstart](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql) က တစ်ခု ပေးပါတယ်) — loop တစ်ခုလုံးက command သုံးခုပါ။ သင့် `.prisma` file ထဲက model တစ်ခုကို optional `phone String?` field တစ်ခု ထည့်ပြီး:

```bash
npx prisma@latest contract emit
npx prisma@latest migration plan --name add_user_phone
npx prisma@latest db migrate
```

`migration plan` က migration အတွက် SQL ကို ပြင်ဆင်ပေးပေမယ့် run မလုပ်ပါဘူး:

```text
✔ Planned 1 operation(s)

│
└─ Add column "phone" to "user"

DDL preview

ALTER TABLE "public"."user" ADD COLUMN "phone" text;
```

ပြီးတော့ `db migrate` က migration ကို သင့် database ပေါ်မှာ apply လုပ်ပြီး ဘာကို apply လုပ်ခဲ့လဲ အတည်ပြုပေးပါတယ်:

```text
✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)
```

Contract-space ရေတွက်မှုက database extensions ထည့်မှသာ အရေးပါပါတယ်။ အခုတော့ လျစ်လျူရှုလို့ရပါတယ်။ `✔ Applied` ဆိုတဲ့ line မြင်ရရင် — workflow တစ်ခုလုံးကို ပြီးသွားပြီလို့ ဆိုလိုပါတယ်။ ဒီ page ရဲ့ ကျန်တာတွေက အပိုအသေးစိတ်တွေပါ — migration ဆိုတာ ဘာလဲ၊ ဘာလို့ ဒီလိုပုံစံ ရှိတာလဲ။

## Migration တစ်ခုထဲမှာ ဘာတွေ ပါလဲ

Migration တစ်ခုက `migrations/app/` အောက်မှာ directory တစ်ခု ဖြစ်ပြီး — timestamp နဲ့ slug နဲ့ နာမည်ပေးပါတယ်:

```text
migrations/
└── app/
    └── 20260707T1006_add_user_phone/
        ├── migration.ts         # သင်ပြင်တဲ့ file
        ├── ops.json             # Prisma run လုပ်တဲ့ file
        ├── migration.json       # ဒီ migration က history ထဲ ဘယ်နေရာမှာ ဆိုတာ
        ├── start-contract.json  # မပြောင်းခင် contract ရဲ့ snapshot
        ├── end-contract.json    # ပြောင်းပြီး contract ရဲ့ snapshot
        └── *-contract.d.ts      # အဲဒီ snapshot တွေအတွက် types; migration.ts ကို type-check လုပ်ပေးတယ်
```

နေ့စဉ်သုံးဖို့ file သုံးခု အရေးပါပါတယ်။ တစ်ခုချင်းစီမှာ တာဝန်တစ်ခုစီ ရှိပါတယ်:

| File | ရည်ရွယ်ချက် |
| --- | --- |
| `migration.ts` | သင်ပြင်တဲ့ file။ Schema နဲ့ data ပြောင်းလဲမှုတွေကို TypeScript function call တွေအနေနဲ့ ဖော်ပြပါတယ်။ |
| `ops.json` | Prisma run လုပ်တဲ့ file။ Compiled migration operations တွေကို JSON အဖြစ် ပါဝင်ပါတယ်။ |
| `migration.json` | Migration က history ထဲ ဘယ်နေရာမှာ ဆိုတာ ခြေရာခံဖို့ Prisma သုံးတဲ့ file။ |

### migration.ts — သင်ပြင်တဲ့ file

`migration.ts` က authoring file ပါ။ Migration step တွေကို သာမန် TypeScript အဖြစ် ပါဝင်ပါတယ်:

```ts
this.addColumn(...)
this.createTable(...)
this.dataTransform(...)
```

TypeScript ဖြစ်လို့ — ဘေးမှာ ရှိနေတဲ့ contract snapshot တွေနဲ့ type-check လုပ်ပြီး သင့် editor က table နဲ့ column နာမည်တွေကို autocomplete လုပ်ပေးကာ migration က database ကို မထိခင် အမှားတွေကို ဖမ်းပေးပါတယ်။

Migration က ဘာလုပ်လဲ သုံးသပ်ချင်တာ ဒါမှမဟုတ် ပြောင်းချင်ရင် ဒီ file ကို သုံးပါ။ [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) ကို ကြည့်ပါ။

### ops.json — Prisma run လုပ်တဲ့ file

`ops.json` က migration ရဲ့ compiled ပုံစံပါ။ `migration.ts` run တဲ့အခါ Prisma က TypeScript step တွေကို JSON operations အဖြစ် ပြောင်းပါတယ်။ Planner က သင့်အတွက် run ပေးပြီး — ပြင်ပြီးရင် `node migration.ts` နဲ့ ကိုယ်တိုင် ပြန် run ပါ။ Migration runner က ဒီ file ကိုပဲ ဖတ်ပါတယ်။

ဆိုလိုတာက production က သင့် TypeScript ကို ဘယ်တော့မှ execute မလုပ်ပါဘူး။ Compiled operations တွေကို ဖတ်လို့ — production credentials တွေနဲ့ application code ဘယ်တော့မှ run မဖြစ်ပါဘူး။

```text
migration.ts  ->  ops.json
သင်ပြင်တယ်        Prisma run လုပ်တယ်
```

File နှစ်ခုကို ဘေးချင်းကပ် commit လုပ်ပြီး `package.json` နဲ့ `package-lock.json` လိုမျိုး အလုပ်လုပ်ပါတယ်:

```text
package.json  ->  package-lock.json
သင်တောင်းတာ        တိကျတဲ့ ရလဒ်

migration.ts  ->  ops.json
သင်ရေးတာ           run ရမယ့် တိကျတဲ့ operations
```

### migration.json — History Marker

`migration.json` က ဒီ migration က သင့် database history ထဲ ဘယ်နေရာမှာ ဆိုတာ မှတ်တမ်းတင်ပါတယ်။ Contract တိုင်းက deterministic artifact တစ်ခုကို compile လုပ်ပြီး — hashing လုပ်တာက အဲဒီ schema state အတိအကျအတွက် တိုတောင်းတဲ့ identifier တစ်ခု ပေးပါတယ်။ Migration တစ်ခုက မှတ်တမ်းတင်တာတွေ:

- သူစတင်တဲ့ (`from`) schema hash
- သူရွှေ့သွားတဲ့ (`to`) schema hash
- ဘယ်အချိန် ဖန်တီးခဲ့လဲ
- သူ့ကိုယ်ပိုင် hash — လက်ဝင်နှောက်မှုကို ဖော်ထုတ်လို့ရအောင်

```json
{
  "from": "sha256:705b1a62f26f0913caa4bfe3f8b7cb491a1b94bd47fc43471d8711bc480bcbb5",
  "to": "sha256:925198f3cc272c5fd19c24ac02f251661775ddac21cdac4e634bbc0dda8b2d72",
  "providedInvariants": [],
  "createdAt": "2026-07-07T10:06:55.937Z",
  "migrationHash": "sha256:4b57fa2141c8ad94476d5de66c451468fd6c864210481ad00ac89b259491fbcf"
}
```

`from` နဲ့ `to` ကို Git commit range လိုမျိုး ဖတ်ပါ — အရင်က schema state နဲ့ နောက်က schema state ပါ။ ဒီ hash တွေက migration တွေကို နံပါတ်စဉ်စာရင်း အစား [graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) တစ်ခုအဖြစ် ချိတ်ပေးပါတယ်။ ရိုးရိုး linear migration system လိုချင်ရင် graph ကို လုံးဝ လျစ်လျူရှုလို့ရပါတယ်။

File သုံးခု အတူတူက migration တစ်ခုကို ပြင်လို့ရပြီး run ဖို့လည်း လုံခြုံစေပါတယ်:

```text
migration.ts     သင်က ပြောင်းလဲမှုကို ရေးတယ်
ops.json         Prisma က compiled operations တွေကို run လုပ်တယ်
migration.json   Prisma က migration ကို history ထဲမှာ ခြေရာခံတယ်
```

(`providedInvariants` ကို extension migrations တွေက သုံးပြီး — သာမန် app migration တွေအတွက် ဗလာ ကျန်နေပါတယ်။)

## Operation တိုင်း ကိုယ့်ဘာသာ စစ်ဆေးပါတယ်

`ops.json` ထဲမှာ operation တစ်ခုစီက အပိုင်းသုံးပိုင်း နဲ့ အစီအစဉ်အတိုင်း run ပါတယ်:

1. **Precheck** — ပြောင်းလဲမှု run မလုပ်ခင် database က မျှော်လင့်ထားတဲ့ state ထဲမှာ ရှိမရှိ အတည်ပြုပါတယ်။
2. **Execute** — ပြောင်းလဲမှု ဖြစ်စေတဲ့ statements တွေ။
3. **Postcheck** — run ပြီးနောက် ပြောင်းလဲမှု အလုပ်ဖြစ်ကြောင်း အတည်ပြုပါတယ်။

Operation တစ်ခုစီမှာ class တစ်ခုလည်း ပါပြီး — CLI output မှာ မြင်ရတဲ့ `(destructive)` flags နဲ့ data-loss warning တွေကို ထုတ်ပေးပါတယ်:

- **Additive** — apply လုပ်ဖို့ လုံခြုံတယ်၊ column ထည့်တာလိုမျိုး။
- **Destructive** — data ဆုံးရှုံးနိုင်တယ်၊ column ဖျက်တာလိုမျိုး။
- **Data** — structure မဟုတ်ဘဲ rows တွေကို ပြောင်းတယ်။

```json
{
  "id": "column.public.user.phone",
  "label": "Add column \"phone\" to \"user\"",
  "operationClass": "additive",
  "precheck": [
    {
      "description": "ensure column \"phone\" is missing",
      "sql": "SELECT NOT EXISTS (SELECT 1 AS \"one\" FROM \"information_schema\".\"columns\" WHERE (\"table_schema\" = $1 AND \"table_name\" = $2 AND \"column_name\" = $3)) AS \"result\"",
      "params": ["public", "user", "phone"]
    }
  ],
  "execute": [
    {
      "description": "add column \"phone\"",
      "sql": "ALTER TABLE \"public\".\"user\" ADD COLUMN \"phone\" text"
    }
  ],
  "postcheck": [
    {
      "description": "verify column \"phone\" exists",
      "sql": "SELECT EXISTS (SELECT 1 AS \"one\" FROM \"information_schema\".\"columns\" WHERE (\"table_schema\" = $1 AND \"table_name\" = $2 AND \"column_name\" = $3)) AS \"result\"",
      "params": ["public", "user", "phone"]
    }
  ]
}
```

ဒီဖွဲ့စည်းပုံက Prisma 8 migrations တွေကို ဂန္ထဝင် SQL migrations တွေ နာကျင်ရတဲ့ အခြေအနေတွေမှာ လုံခြုံစေပါတယ်:

- **Migration တစ်ခု ကျရှုံးတယ်။** PostgreSQL ပေါ်မှာ run တစ်ခုလုံးက transaction တစ်ခုတည်း ဖြစ်လို့ — ကျရှုံးမှုက အရာအားလုံးကို roll back လုပ်ပြီး database က မူလနေရာ အတိအကျ ပြန်ရောက်ပါတယ်။ အကြောင်းရင်းကို ပြင်ပြီး ပြန် run ပါ။ Runner က postcheck ကျေနပ်ပြီးသား operation တစ်ခုခုကို ကျော်သွားလို့ — ပြန် run တိုင်း database ထဲမှာ ရှိပြီးသား အလုပ်တွေကို နှစ်ခါ မလုပ်ပါဘူး။ Statement တွေကို comment လုပ်စရာ မလို၊ database ကို လက်နဲ့ ပြင်စရာ မလိုပါဘူး။
- **Database က သင်ထင်ထားတဲ့ state ထဲမှာ မရှိဘူး။** Precheck က ပြောင်းလဲမှု run မလုပ်ခင် ဖမ်းပြီး — error က ဘယ် operation နဲ့ ဘယ် check ကျရှုံးလဲ အတိအကျ နာမည်ပေးပါတယ်။ တစ်ဝက်ကျော်မှာ ပေါ်တဲ့ ယေဘုယျ SQL error မဟုတ်ပါဘူး။
- **တစ်ယောက်ယောက် (ဒါမှမဟုတ် agent တစ်ခု) က migration ကို သင့်အတွက် ရေးပေးတယ်။** ရည်ရွယ်ချက် (`migration.ts`), တိကျတဲ့ SQL (`ops.json`) နဲ့ step တိုင်းရဲ့ verification — အားလုံး diff ထဲမှာ ရှိလို့ သုံးသပ်ရတာ လွယ်ပါတယ်။

## Command တွေ

ဒီ command တွေက [Prisma 8 CLI](https://www.prisma.io/docs/cli) အောက်မှာ ရှိပါတယ်။ `npx prisma@latest <command>` နဲ့ run ပါ။ Planning နဲ့ inspection command တွေက offline အလုပ်လုပ်ပါတယ် — သူတို့က file တွေကို ဖတ်ပြီး သင့် database ကို မဖတ်ပါဘူး:

| Command                   | ဘာလုပ်လဲ                                                            |
| ------------------------- | ----------------------------------------------------------------------- |
| `migration plan`          | သင့် contract ပြောင်းလဲမှုကနေ [migration တစ်ခု generate လုပ်ပါတယ်](/docs/prisma/generating-a-migration) |
| `migration new`           | [ကိုယ်တိုင် ရေးသားခြင်း](https://www.prisma.io/docs/orm/migrations/editing-a-migration#starting-from-a-blank-migration) အတွက် ဗလာ migration တစ်ခု scaffold လုပ်ပေးပါတယ် |
| `migration show <target>` | Migration တစ်ခုရဲ့ operations, DDL preview နဲ့ metadata ကို ပြပါတယ်            |
| `migration list`          | Disk ပေါ်က migration တိုင်းကို စာရင်းပြပါတယ်                                            |
| `migration graph`         | [Migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) ကို ဆွဲပြပါတယ်   |
| `migration check`         | Migration file တွေနဲ့ graph ရဲ့ သမာဓိကို စစ်ဆေးပါတယ် (CI မှာ အသုံးဝင်တယ်)               |

Database တစ်ခုနဲ့ စကားပြောတဲ့ command သုံးခု:

| Command            | ဘာလုပ်လဲ                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| `db migrate`          | [Pending migration တွေကို apply လုပ်ပါတယ်](/docs/prisma/applying-a-migration)        |
| `migration status` | Database က graph ထဲ ဘယ်မှာ ရှိလဲ၊ ဘယ် migration တွေ pending လဲ ပြပါတယ်     |
| `migration log`    | Database က တကယ် apply လုပ်ထားတဲ့ migration တွေရဲ့ history ကို ပြပါတယ်     |

Apply လုပ်တာက `db migrate` ဖြစ်ပြီး `migration apply` မဟုတ်တာ သတိပြုပါ — `migration ...` command တွေက disk ပေါ်က migration directory တွေကို စီမံပြီး `db migrate` က database တစ်ခုကို ရွှေ့ပါတယ်။

ဒီမှာ loop တစ်ခုလုံး လှုပ်ရှားနေတာကို မြင်ရမှာပါ — idea ကနေ schema အသစ်ပေါ်မှာ type လုပ်ထားတဲ့ code အထိ:

> **Video walkthrough (30 စက္ကန့်)** — feature idea တစ်ခု contract ပြောင်းလဲမှုတစ်ခု ဖြစ်လာ၊ migration ကို plan, review, apply လုပ်တယ်၊ column အသစ်က Prisma Studio မှာ ပေါ်လာပြီး application code က schema အသစ်နဲ့ autocomplete ဖြစ်တာကို ပြထားပါတယ်။ [မူရင်းဗီဒီယို](https://www.prisma.io/docs/img/orm/v8/migrations/migration-loop.mp4)

## SQL နဲ့ MongoDB အတွက် ပုံစံတူ

ဒီ page က အကြောင်းအရာ အားလုံး database family နှစ်မျိုးလုံးမှာ သက်ရောက်ပါတယ်။ PostgreSQL ပေါ်မှာ operations တွေက SQL DDL အဖြစ် compile လုပ်ပြီး — apply လုပ်ထားတဲ့ state ကို **marker** တစ်ခုမှာ ခြေရာခံပါတယ်။ Marker ဆိုတာ Prisma 8 က database ထဲမှာပဲ သိမ်းထားတဲ့ record တစ်ခု ဖြစ်ပြီး database က အခု ကိုက်ညီနေတဲ့ contract state ကို နာမည်ပေးပါတယ်။ MongoDB ပေါ်မှာတော့ operations တွေက collections, indexes နဲ့ JSON Schema validators တွေကို ဖန်တီးပြီး — marker က `_prisma_migrations` collection ထဲမှာ နေပါတယ်။ Command တွေ၊ file layout, graph နဲ့ precheck/execute/postcheck ဖွဲ့စည်းပုံက အတူတူပါပဲ။

> **Migrations တွေက အစောပိုင်း အဆင့်ပါ**
>
> Migrations က Prisma 8 ရဲ့ အသစ်ဆုံး အစိတ်အပိုင်းတွေထဲက တစ်ခုပါ။ ဒီ page ပေါ်က core loop (plan, edit, apply, roll back) က ဒီနေ့ အလုပ်လုပ်ပြီး Prisma 8 test suite ထဲမှာ စမ်းသပ်ထားပါတယ်။ Classic migration tools တွေ နှစ်ပေါင်းများစွာ ကြီးထွားလာတဲ့ အချို့အရာတွေက မတည်ဆောက်ရသေးပါဘူး — squash/baseline command တွေ မရှိသေးသလို shadow-database dry run လည်း မရှိသေးပါဘူး။ ချို့ယွင်းချက်တွေကို ဖုံးကွယ်မထားဘဲ page တစ်ခုချင်းစီမှာ ထောက်ပြထားပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "User model ကို `phone` field တစ်ခု ထည့်ပြီး အဲဒါအတွက် migration plan လုပ်ပေးပါ။"
- "Pending migration တွေနဲ့ သူတို့ run မယ့် SQL ကို ပြပေးပါ။"
- "နောက်ဆုံး migration ထဲက ops.json က ဘာလုပ်လဲ ရှင်းပြပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Studio with Prisma 8](https://www.prisma.io/docs/studio/prisma-next) — Prisma Studio မှာ သင့် applied migration history ကို ဖတ်ပါ: migration တစ်ခုချင်းစီအတွက် visual diff, executed SQL နဲ့ schema diff
- [The migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) — migration တွေ ဘာလို့ graph တစ်ခု ဖြစ်လဲ၊ အဲဒါက ဘာတွေ ရစေလဲ
- [Generating a migration](/docs/prisma/generating-a-migration) နဲ့ [Applying a migration](/docs/prisma/applying-a-migration) — လက်တွေ့ loop
- [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) — backfills, raw SQL နဲ့ recompile step
- [Rethinking Database Migrations](https://www.prisma.io/blog/rethinking-database-migrations) — ဒီဒီဇိုင်း ဘာလို့ ရှိလဲဆိုတဲ့ blog post
