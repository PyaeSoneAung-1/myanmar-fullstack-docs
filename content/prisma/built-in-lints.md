---
title: "Built-in: Lints — Query ဖွဲ့စည်းပုံ စစ်ဆေး Middleware"
description: "Query တိုင်းရဲ့ ဖွဲ့စည်းပုံကို run မလုပ်ခင် စစ်ပြီး — WHERE မပါတဲ့ DELETE/UPDATE လိုမျိုး ပုံမှန် မှားတတ်တဲ့ ပုံစံတွေကို block ဒါမှမဟုတ် warn လုပ်ပေးတဲ့ lints middleware — rules, severities ချိန်ညှိခြင်း နဲ့ raw SQL fallback အသေးစိတ်"
order: 34
source: "https://www.prisma.io/docs/orm/middleware/built-in-lints"
status: translated
updated: 2026-09-02
---

`lints` middleware က query တိုင်းရဲ့ ဖွဲ့စည်းပုံကို execute မလုပ်ခင် စစ်ဆေးပြီး — `WHERE` clause မပါတဲ့ `DELETE` တစ်ခုလိုမျိုး ပုံမှန်အားဖြင့် အမှားတွေ ဖြစ်တတ်တဲ့ ပုံစံတွေကို block ဒါမှမဟုတ် warn လုပ်ပါတယ်။

Runtime ပေါ်မှာ register လုပ်ပါ; defaults တွေက configuration မလိုဘဲ အသုံးဝင်ပါတယ်:

```ts title="src/prisma/db.ts"
import postgres from '@prisma/orm-postgres/runtime';
import { lints } from '@prisma/orm-postgres/family-runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [lints()],
});
```

`lints` က SQL-family middleware ပါ (`familyId: 'sql'` ကို ကြေညာထားလို့) — PostgreSQL runtimes တွေပေါ်မှာ register လုပ်လို့ရပါတယ်။ ဒါက `@prisma/orm-postgres/family-runtime` နဲ့အတူ ပါလာပြီး — `@prisma/orm-postgres` ကနေ တစ်ဆင့် ရောက်လာပါတယ်။

## Rules များ

Lints တွေက `beforeExecute` ထဲမှာ — query plan ရဲ့ AST ပေါ်မှာ run ပါတယ်။ Rule တစ်ခုချင်းစီမှာ severity တစ်ခု ရှိပါတယ်: `error` က throw လုပ်ပြီး query ကို database ဆီ မရောက်ခင် block လုပ်ပြီး — `warn` က runtime log ကနေ log တက်စေပြီး query ကို run ခွင့်ပေးပါတယ်။

| Rule | Code | Default severity | ဘယ်အခါ fire လဲ |
| --- | --- | --- | --- |
| WHERE မပါတဲ့ DELETE | `LINT.DELETE_WITHOUT_WHERE` | `error` | `DELETE` တစ်ခုမှာ `WHERE` clause မရှိရင် |
| WHERE မပါတဲ့ UPDATE | `LINT.UPDATE_WITHOUT_WHERE` | `error` | `UPDATE` တစ်ခုမှာ `WHERE` clause မရှိရင် |
| LIMIT မရှိ | `LINT.NO_LIMIT` | `warn` | `SELECT` တစ်ခုမှာ `LIMIT` clause မရှိရင် |
| SELECT star | `LINT.SELECT_STAR` | `warn` | Query တစ်ခုက column တွေကို နာမည်နဲ့ ရွေးမယ့်အစား အားလုံး ရွေးရင် |

Warning တစ်ခုကို runtime ရဲ့ log ပေါ်မှာ structured event တစ်ခုအနေနဲ့ ထုတ်လွှင့်ပါတယ်:

```text title="Lint warning"
warn {
  code: 'LINT.NO_LIMIT',
  message: 'Unbounded SELECT may return large result sets',
  details: { table: 'user' }
}
```

> **Note**
>
> `postgres(...)` client က log sink တစ်ခု ချိတ်ဆက်ဖို့ နည်းလမ်း မဖော်ထုတ်ရသေးလို့ — `warn` findings တွေက default အားဖြင့် ဘယ်နေရာမှာမှ print မဖြစ်ပါဘူး; `error` severities တွေပဲ လေ့လာလို့ရတယ် — ဘာလို့လဲဆိုတော့ သူတို့က query ကို block လုပ်လို့ပါ။ Client က logger တစ်ခု လက်ခံတဲ့အထိ `warn` rules တွေကို forward-looking အနေနဲ့ သဘောထားပါ။

## Severities ချိန်ညှိခြင်း

Project အလိုက် rule တစ်ခုချင်းစီကို `severities` ကနေ မြှင့် ဒါမှမဟုတ် လျှော့လို့ရပါတယ်။ ဥပမာ — list endpoint တိုင်း paginate လုပ်ရမယ့် service တစ်ခုမှာ unbounded selects တွေကို hard failure အနေနဲ့ သဘောထားဖို့:

```ts title="src/prisma/db.ts"
lints({
  severities: {
    noLimit: 'error',
    selectStar: 'warn',
  },
});
```

Severity keys တွေက `deleteWithoutWhere`, `updateWithoutWhere`, `noLimit` နဲ့ `selectStar` — ပြီးတော့ အောက်မှာ ဖော်ပြထားတဲ့ raw-SQL guardrail အတွက် `readOnlyMutation` ပါ။ Options type က `unindexedPredicate` ကိုလည်း လက်ခံပေမယ့် — v0.14 မှာ ဘယ် rule ကမှ အဲဒီ finding ကို မထုတ်ပါဘူး။

## Raw SQL

ORM client ဒါမှမဟုတ် SQL query builder နဲ့ ဆောက်ထားတဲ့ Queries တွေမှာ typed AST ပါလို့ — အထက်က rules တွေက အဲဒါကို structural အနေနဲ့ စစ်ဆေးပါတယ်။ Raw SQL မှာတော့ အဲဒီ structure မရှိလို့ — `lints` က raw plans တွေအတွက် text heuristics တွေဆီ ပြန်ကျပါတယ်: `select *`, `LIMIT` မရှိတာတွေကို အလံပြပြီး — read-only လို့ အမှတ်အသား လုပ်ထားတဲ့ raw query တစ်ခုကနေ ခိုးဝင်လာတဲ့ mutation (`LINT.READ_ONLY_MUTATION`) ကိုပါ ဖမ်းပါတယ်။ Raw heuristics တွေမှာ ကိုယ်ပိုင် defaults တွေ ရှိပါတယ်: `select *` က raw plans တွေအတွက် `error` အထိ တက်သွားတယ် (AST rule ရဲ့ `warn` ထက် ပိုတင်းကျပ်တယ်)၊ `LIMIT` မရှိတာက warning အတိုင်း ဆက်ရှိပြီး — read-only ရည်ရွယ်ချက်နဲ့ mutation က `error` ပါ။ အထက်က `severities` keys တွေက raw findings တွေကိုပါ override လုပ်ပါတယ်။ AST မရှိတဲ့အခါ fallback ကို `fallbackWhenAstMissing` နဲ့ ထိန်းချုပ်ပါ:

```ts title="src/prisma/db.ts"
lints({ fallbackWhenAstMissing: 'raw' }); // default: heuristic checks on the SQL text
lints({ fallbackWhenAstMissing: 'skip' }); // skip linting for plans without an AST
```

Heuristics တွေက structural check တစ်ခုက မှန်မှန်ကန်ကန် ခွဲခြားနိုင်မယ့် SQL ကို လွဲမှားစွာ ဖတ်တတ်လို့ — raw-SQL lint findings တွေကို တရားစီရင်ချက်တစ်ခုအဖြစ် မဟုတ်ဘဲ query ကို ပြန်ကြည့်ဖို့ အချက်ပြချက်တစ်ခုအနေနဲ့ သဘောထားပါ။

## အဖြစ်များတဲ့ မှားတတ်မှုများ

> **Warning — `LINT.DELETE_WITHOUT_WHERE` နဲ့ `LINT.UPDATE_WITHOUT_WHERE` တွေက default အနေနဲ့ `error` ဖြစ်လို့ — ရည်ရွယ်ချက်ရှိရှိ လုပ်တဲ့ full-table mutation တစ်ခု (ဥပမာ backfill) က block ခံရပါမယ်**
>
> One-off script တစ်ခုအတွက်ဆိုရင် — tautological ဖြစ်ပေမယ့် ရှင်းလင်းတဲ့ `WHERE` clause တစ်ခု ထည့်ပါ ဒါမှမဟုတ် အဲဒီ script ရဲ့ runtime setup ထဲမှာ rule ကို `warn` လို့ ထားတဲ့ `lints` ကို register လုပ်ပါ။ Severity ကို ကမ္ဘာ့အနှံ့ လျှော့ချလိုက်ရင် ကာကွယ်မှုကို နေရာတိုင်းမှာ စွန့်လွှတ်လိုက်တာနဲ့ တူပါတယ်။

## ဆက်စပ်ဖတ်ရန်

- [How middleware works](/docs/prisma/how-middleware-works) — သင့် hooks တွေ ချိတ်ဆက်ဝင်တဲ့ lifecycle
- [Built-in: budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets) — row-count နဲ့ latency မျက်နှာကျက်တွေအတွက်
- [Authoring custom middleware](/docs/prisma/authoring-custom-middleware) — ကိုယ်ပိုင် Prisma 8 middleware တစ်ခုကို step by step တည်ဆောက်ခြင်း
