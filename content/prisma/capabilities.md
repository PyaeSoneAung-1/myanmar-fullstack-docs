---
title: "Capabilities (Database ထောက်ပံ့နိုင်မှုများ)"
description: "သင့် database stack (target, adapter, extension packs) က ဘာတွေ ထောက်ပံ့လဲဆိုတာ မှတ်တမ်းတင်ထားတဲ့ capabilities — Prisma 8 က မထောက်ပံ့တဲ့ feature တွေကို query အလယ်မှာ database error ဖြစ်စေမယ့်အစား စောစော ရှင်းရှင်းလင်းလင်း ငြင်းပယ်ပုံ"
order: 31
source: "https://www.prisma.io/docs/orm/contract-authoring/capabilities"
status: translated
updated: 2026-09-02
---

Capabilities တွေက သင့် database stack က ဘာတွေ ထောက်ပံ့လဲဆိုတာ မှတ်တမ်းတင်ထားလို့ — Prisma 8 က မထောက်ပံ့တဲ့ features တွေကို ရှင်းရှင်းလင်းလင်း error နဲ့ စောစော ငြင်းပယ်နိုင်ပါတယ်။

Database stack တိုင်းက feature တိုင်းကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ Setup တစ်ခုက lateral joins, `RETURNING` clauses နဲ့ vector distance operations တွေ run လို့ရပေမယ့် — နောက်တစ်ခုက မရနိုင်ပါဘူး။

Capabilities ဆိုတာ [data contract](/docs/prisma/the-data-contract) ထဲမှာ သင့် stack က ဘာတွေ ထောက်ပံ့လဲ မှတ်တမ်းတင်တဲ့ နည်းလမ်းပါ။ Prisma 8 က gated feature တစ်ခုကို မသုံးခင် ဒါတွေကို စစ်ဆေးပါတယ်။ မထောက်ပံ့တဲ့ feature ဆိုရင် — query အလယ်မှာ database error အနေနဲ့ ပေါ်လာမယ့်အစား — မရတဲ့ capability နာမည်ကို ဖော်ပြတဲ့ error နဲ့ စောစော fail ဖြစ်ပါတယ်။

## Capabilities တွေ ဘယ်ကနေ လာလဲ

Capabilities တွေကို သင်ကိုယ်တိုင် ရေးစရာ မလိုပါဘူး။ [`contract emit`](https://www.prisma.io/docs/cli/contract-emit) run တဲ့အခါ — သင့် project ထဲမှာ ပေါင်းစပ်ထားတဲ့ component တိုင်းရဲ့ capability declarations တွေကို ပေါင်းလိုက်ပါတယ်: target (PostgreSQL, SQLite, MongoDB)၊ ၎င်းရဲ့ adapter နဲ့ driver၊ ပြီးတော့ config ကနေ ရတဲ့ extension packs တွေပါ။ ပေါင်းထားတဲ့ ရလဒ်က contract ရဲ့ `capabilities` section ထဲကို namespace အလိုက် စုပြီး ရောက်သွားပါတယ်:

```json title="prisma/contract.json (excerpt)"
{
  "capabilities": {
    "postgres": {
      "distinctOn": true,
      "jsonAgg": true,
      "lateral": true,
      "limit": true,
      "orderBy": true,
      "pgvector.cosine": true,
      "returning": true
    },
    "sql": {
      "defaultInInsert": true,
      "enums": true,
      "lateral": true,
      "returning": true,
      "scalarList": true
    }
  }
}
```

`sql` namespace ထဲမှာ SQL databases တွေကြား မျှဝေသုံးတဲ့ keys တွေ ရှိပြီး — `postgres` namespace ထဲမှာတော့ PostgreSQL-specific keys တွေ ရှိပါတယ်။ Extension packs တွေက ကိုယ်ပိုင် keys တွေ ထည့်ပေးပါတယ်: အထက်က `pgvector.cosine` ကို ထည့်ပေးတာက pgvector pack ကို ပေါင်းစပ်လို့ပါ။ Packs တွေက keys တွေကို ကြေညာပေးလို့ — `prisma.config.ts` ထဲမှာ extension ထည့်/ဖြုတ်ပြီး `contract emit` ပြန် run လိုက်ရင် နောက်ထပ် အလုပ်ဘာမှ မလိုဘဲ capability set ပြောင်းသွားပါတယ်။

## Capabilities တွေက ဘာတွေကို gate လုပ်လဲ

Capabilities တွေကို SQL တစ်ကြောင်းမှ database ဆီ မရောက်ခင် — နေရာ နှစ်ခုမှာ စစ်ဆေးပါတယ်။

**Contract ဆောက်ချိန်မှာ။** Schema က target မှာ သိမ်းလို့မရတဲ့ feature တစ်ခု သုံးထားရင် `contract emit` က diagnostic တစ်ခုနဲ့ fail ဖြစ်ပါတယ်။ ဥပမာ — SQLite က `scalarList` capability ကို အစီရင်ခံမပေးလို့ SQLite ကို target လုပ်ထားတဲ့ contract ထဲက scalar list field တစ်ခုက emit မဖြစ်ပါဘူး:

```text
Field "User.tags" is a scalar list, but target "sqlite" does not support
scalar lists (the adapter does not report the "scalarList" capability).
```

**Query ဆောက်ချိန်မှာ။** Capability တစ်ခုပေါ် မူတည်တဲ့ query-builder methods တွေက contract ရဲ့ `capabilities` section ကို စစ်ပြီး — key မရှိရင် method နဲ့ capability နာမည်ကို ဖော်ပြကာ throw လုပ်ပါတယ်:

```text
distinctOn() requires capability postgres.distinctOn
lateralJoin() requires capability sql.lateral
```

ဒီ error က သင့် code က query ကို ဆောက်တဲ့အချိန်မှာ ဖြစ်လို့ — query ကို တည်ဆောက်တဲ့ test တစ်ခုက ဒါကို ဖမ်းမိပါတယ်: သင့် stack မှာ မရှိတဲ့ feature ကို သုံးတဲ့ query က လုံးဝ ဆောက်လို့ မရနိုင်ပါဘူး။

## Capability နမူနာများ

Built-in components တွေ ကြေညာထားတဲ့ keys အနည်းငယ်ကို ကြည့်ရင် — ဘယ်လောက်အထိ အကွက်စိတ် (granular) လဲ မြင်ရပါမယ်:

| Capability | ဘာကို gate လုပ်လဲ |
| --- | --- |
| `sql.lateral` | Lateral joins (`lateralJoin()`); PostgreSQL က ကြေညာပြီး SQLite က မကြေညာပါ |
| `sql.returning` | Writes တွေပေါ်က `RETURNING` clauses |
| `sql.enums` | Database ထဲမှာ အတင်းအကျပ် လုပ်ထားတဲ့ enum value sets; SQLite က မကြေညာပါ |
| `sql.defaultInInsert` | Multi-row inserts တွေမှာ value အနေနဲ့ `DEFAULT` သုံးခြင်း |
| `sql.scalarList` | Schema ထဲက scalar list fields |
| `postgres.distinctOn` | `DISTINCT ON` queries (`distinctOn()`) |
| `postgres.jsonAgg` | Nested reads တွေအတွက် JSON aggregation |
| `postgres.pgvector.cosine` | pgvector pack က ထည့်ပေးတဲ့ cosine distance operations |

ဒီ table က နမူနာပဲ ဖြစ်ပြီး — စာရင်း အပြည့်အစုံ မဟုတ်ပါဘူး။ Target, adapter နဲ့ pack တစ်ခုချင်းစီက ကိုယ်ပိုင် declarations တွေ ပါလာပါတယ်။ သင့် project ရဲ့ emit လုပ်ထားတဲ့ `contract.json` ကပဲ သင့် stack က ထောက်ပံ့တဲ့အရာတွေရဲ့ authoritative စာရင်း ဖြစ်ပါတယ်။

MongoDB က လောလောဆယ် capability keys ဘာမှ မကြေညာပါဘူး: capability system က SQL targets တွေနဲ့ သူတို့ရဲ့ extensions တွေကို အဓိက ခွဲခြားပေးပြီး — MongoDB pipeline က ဒီပုံစံအတိုင်း features တွေကို မလှေ့သေးပါဘူး။

## Capabilities နဲ့ Verification

Capabilities တွေက live database ကနေ probe လုပ်တာမဟုတ်ဘဲ — target, adapter နဲ့ packs တွေ ကြေညာထားတဲ့အတိုင်း ပေါင်းစပ်ထားတဲ့ software stack က ဘာတွေ ထောက်ပံ့လဲဆိုတာ ဖော်ပြပြီး — emit ချိန်မှာ contract ထဲမှာ မှတ်တမ်းတင်လို့ environment တိုင်းမှာ contract တစ်ခုတည်းက တူညီတဲ့ အပြုအမူ ရှိပါတယ်။ Database-side verification က သီးခြားပါ: [`db verify`](https://www.prisma.io/docs/cli/db-verify) က database က contract ရဲ့ schema နဲ့ profile နဲ့ ကိုက်ညီမလဲဆိုတာကို [contract artifact](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact#the-content-hashes) ထဲမှာ ဖော်ပြထားတဲ့ hashes တွေသုံးပြီး စစ်ဆေးပါတယ်။

Extensions တွေက core ရဲ့ အပြင် capabilities တွေရဲ့ အဓိက ရင်းမြစ် ဖြစ်ပါတယ်။ [Using extensions](https://www.prisma.io/docs/orm/extensions/using-extensions) က install ကနေ ပထမဆုံး query အထိ လုပ်ငန်းစဉ် အပြည့်အစုံကို ပြပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ကို လွှမ်းခြုံပါတယ်။ Agent ကို ဒီလို မှာကြည့်ပါ:

- "ကျွန်တော်တို့ contract က လက်ရှိ ဘယ် capabilities တွေ လိုအပ်ပြီး package တစ်ခုချင်းစီက ဘယ်ဟာကို ပေးလဲ။"
- "Project ထဲကို pgvector ထည့်ပြီး capability က emit လုပ်ထားတဲ့ contract ထဲမှာ ပေါ်လာတာ အတည်ပြုပေးပါ။"

## နောက်တစ်ဆင့်

- `capabilities` block က [contract artifact](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) ထဲမှာ ဘယ်နေရာမှာ ရှိလဲ ကြည့်ပါ။
- Extension packs တွေနဲ့ သူတို့ ယူလာတဲ့ capabilities တွေကို [CLI configuration](https://www.prisma.io/docs/cli/configuration) မှာ ပေါင်းစပ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Author in PSL](/docs/prisma/psl-syntax) — သိပြီးသား schema language အပြင် Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေပါ ပါဝင်တဲ့ Prisma schema file အနေနဲ့ Prisma 8 contract ကို ရေးခြင်း
- [Author in TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) — schema file အစား typed builder API နဲ့ Prisma 8 contract ကို define လုပ်ခြင်း — models တူတူ၊ artifacts တူတူ၊ သီးခြား language မလို
- [The data contract](/docs/prisma/the-data-contract) — data contract ဆိုတာ သင့် data model နဲ့ storage layout ရဲ့ တစ်ခုတည်းသော ဖော်ပြချက် — Prisma 8 ထဲမှာ အရာအားလုံးက ဒီ contract နဲ့အညီ type သတ်မှတ်၊ စီစဉ်ပြီး verify လုပ်ပါတယ်
- [The emitted artifacts](https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact) — contract.json နဲ့ contract.d.ts က Prisma 8 ရဲ့ တခြား အစိတ်အပိုင်းတိုင်း စားသုံးတဲ့ deterministic artifacts တွေ — အထဲမှာ ဘာတွေပါလဲဆိုတာ ဒီမှာ ကြည့်ပါ
