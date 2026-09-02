---
title: "ကိုယ်ပိုင် Middleware ရေးသားခြင်း (Authoring Custom Middleware)"
description: "ကိုယ်ပိုင် Prisma 8 middleware ကို step by step တည်ဆောက်နည်း — query logger ကစပြီး ဖန်တီး, register လုပ်ကာ run ကြည့်ခြင်း၊ hooks နဲ့ context object အသေးစိတ်"
order: 28
source: "https://www.prisma.io/docs/orm/middleware/authoring-custom-middleware"
status: translated
updated: 2026-09-02
---

ဒီ guide မှာ ကိုယ်ပိုင် middleware တစ်ခုကို အစကနေ တည်ဆောက်ကြည့်ပါမယ် — query တိုင်းကို ၎င်းရဲ့ row count နဲ့ latency တွေနဲ့အတူ print လုပ်ပေးတဲ့ query logger တစ်ခုပါ။ File တစ်ခု ဖန်တီး၊ နေရာတစ်ခုမှာ register လုပ်ပြီး — query တစ်ခု run လိုက်တာနဲ့ output ကို မြင်ရပါမယ်။

Custom middleware ဆိုတာ `name` တစ်ခုနဲ့ သင်ကိုယ်တိုင် implement လုပ်တဲ့ hooks တွေ ပါဝင်တဲ့ ရိုးရိုး object တစ်ခုပါ။ Base class မလိုသလို — [How middleware works](/docs/prisma/how-middleware-works) မှာ သိပြီးသား `middleware` array ကလွဲပြီး တခြား registration API လည်း မရှိပါဘူး။

ဒီ guide တစ်ခုလုံးကို live Prisma Postgres database တစ်ခုပေါ်မှာ `create-prisma` project အသစ်တစ်ခုနဲ့ အစအဆုံး run ပြခဲ့တာ ဖြစ်ပြီး — အောက်မှာ ပြထားတဲ့ outputs တွေက အဲဒီ run ကနေ ရလာတာပါ။

## မလုပ်မီ လိုအပ်ချက်များ (Prerequisites)

- `src/prisma/db.ts` အလုပ်လုပ်နေတဲ့ Prisma 8 project တစ်ခု။ [PostgreSQL quickstart](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql) က မိနစ်အနည်းငယ်အတွင်း project တစ်ခု တည်ဆောက်ပေးပါတယ်:

```bash
npx create-prisma@latest --provider postgres
cd my-app
npm run db:init
```

## 1. Middleware ဖန်တီးခြင်း

သင့် database setup ရှိတဲ့ နေရာမှာပဲ file အသစ်တစ်ခု ဖန်တီးပါ — `src/prisma/query-logger.ts` ပါ။ Middleware က `afterExecute` ဆိုတဲ့ hook တစ်ခုကို implement လုပ်ထားပြီး — ဒီ hook က query တိုင်း ပြီးဆုံးချိန်မှာ ရလဒ် (outcome) နဲ့အတူ တစ်ခါ run ပါတယ်:

```ts
import type { SqlMiddleware } from "@prisma/orm-postgres/family-runtime";

export function queryLogger(): SqlMiddleware {
  return {
    name: "query-logger",
    familyId: "sql",

    async afterExecute(plan, result) {
      console.log(
        `[query-logger] ${result.rowCount} rows in ${Math.round(result.latencyMs)}ms · ${plan.sql}`,
      );
    },
  };
}
```

`SqlMiddleware` အဖြစ် type လုပ်ထားလို့ hook တိုင်းရဲ့ parameter types တွေ အလိုအလျောက် မှန်ကန်နေပြီး — plan ဒါမှမဟုတ် result types တွေကို ကိုယ်တိုင် import လုပ်ရတာ ရှားပါတယ်။ `familyId: "sql"` က ဒီ middleware က SQL database တွေအတွက်ဆိုတာ ညွှန်ပြပြီး — ဘယ်အခါ ထည့်ရမလဲဆိုတာကို အောက်က step 5 မှာ ရှင်းပြထားပါတယ်။

## 2. Register လုပ်ခြင်း

သင့် client setup ထဲက `middleware` array ထဲကို middleware ကို ထည့်ပါ။ ပြောင်းလဲပြီးတဲ့ နောက် `src/prisma/db.ts` file တစ်ခုလုံးက ဒီလိုပါ:

```ts
import postgres from '@prisma/orm-postgres/runtime';
import { queryLogger } from './query-logger';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [queryLogger()],
});
```

ဒါပဲ ချိတ်ဆက်စရာ တစ်ခုလုံးပါ။ ဒီ client ပေါ်က query တိုင်း — ORM API ကလာတာ ဒါမှမဟုတ် SQL query builder ကလာတာ — logger ကို ဖြတ်သွားပါတယ်။

## 3. Query တစ်ခု run ပြီး output ကြည့်ခြင်း

`src/index.ts` ထဲမှာ write ရော read ရော လုပ်တဲ့ script အသေးလေး တစ်ခု ထည့်ပါ:

```ts
import { db } from "./prisma/db";

await db.orm.public.User.create({
  email: `mia+${Date.now()}@prisma.io`,
  name: "Mia",
});

const users = await db.orm.public.User.select("id", "email").take(5).all();
console.log(`fetched ${users.length} users`);

await db.close();
```

Run လုပ်ကြည့်ပါ:

```bash
npm run dev
```

Logger က query နှစ်ခုလုံးကို — runtime က တကယ် execute လုပ်ခဲ့တဲ့ SQL နဲ့အတူ — အစီရင်ခံပါတယ်:

```text
[query-logger] 1 rows in 18ms · INSERT INTO "public"."user" ("email", "name", "updatedAt") VALUES ($1, $2, $3) RETURNING "user"."createdAt", "user"."email", "user"."id", "user"."name", "user"."updatedAt", "user"."username"
[query-logger] 1 rows in 17ms · SELECT "user"."id" AS "id", "user"."email" AS "email" FROM "public"."user" LIMIT 5
fetched 1 users
```

Query result ကို မြင်ရပေမယ့် `[query-logger]` စာကြောင်းတွေ မတွေ့ရဘူးဆိုရင် — query က middleware register မလုပ်ထားတဲ့ client တစ်ခုပေါ်မှာ run သွားတာပါ။ သင့် script က step 2 မှာ သင်ပြင်ခဲ့တဲ့ file ကနေ `db` ကို import လုပ်ထားကြောင်း စစ်ဆေးပါ။

## 4. Option တစ်ခု ထည့်ခြင်း

တကယ့် middleware တွေက ပုံမှန်အားဖြင့် options တွေ လက်ခံပါတယ်။ Logger က နှေးတဲ့ query တွေကိုပဲ အစီရင်ခံအောင် threshold တစ်ခု ထည့်ကြည့်ရအောင်:

```ts
import type { SqlMiddleware } from "@prisma/orm-postgres/family-runtime";

export interface QueryLoggerOptions {
  /** Only log queries slower than this many milliseconds. Default: 0, log everything. */
  readonly thresholdMs?: number;
}

export function queryLogger(options?: QueryLoggerOptions): SqlMiddleware {
  const thresholdMs = options?.thresholdMs ?? 0;

  return {
    name: "query-logger",
    familyId: "sql",

    async afterExecute(plan, result) {
      if (result.latencyMs < thresholdMs) return;
      console.log(
        `[query-logger] ${result.rowCount} rows in ${Math.round(result.latencyMs)}ms · ${plan.sql}`,
      );
    },
  };
}
```

`src/prisma/db.ts` ထဲမှာ threshold နဲ့ ဒီလို register လုပ်ပါ:

```ts
middleware: [queryLogger({ thresholdMs: 250 })],
```

Script ကို နောက်တစ်ခါ run ကြည့်ရင် logger က တိတ်သွားပါမယ် — query နှစ်ခုလုံးက 250ms အောက်မှာ ပြီးလို့ပါ။ Threshold ကို ပြန်လျှော့ကြည့်ရင် စာကြောင်းတွေ ပြန်မြင်ရပါမယ်။

Hooks တွေက registration order အတိုင်း run ပြီး — throw လုပ်တဲ့ middleware တစ်ခုက နောက်ကဟာတွေကို ရပ်တန့်စေပါတယ်။ ဒါကြောင့် `budgets` လိုမျိုး throw လုပ်နိုင်တဲ့ middleware တွေရဲ့ ရှေ့မှာ သင့် logger ကို register လုပ်ထားပါ — သင်အကြည့်ရဆုံး ဖြစ်ချင်တဲ့ queries တွေ ဆက်ပြီး log တက်နေဖို့ပါ။

## 5. ဘယ် family ကို ကြေညာရမလဲ

Prisma 8 က database တွေကို family တွေအဖြစ် စုပါတယ်: SQL (PostgreSQL) နဲ့ document (MongoDB)။ အထက်က logger ထဲက `plan.sql` လိုမျိုး — SQL ပုံစံ ရှိတဲ့ အရာတစ်ခုခုကို သင့် middleware က ထိမိရင် `familyId: 'sql'` ထားပါ။ အဲဒါဆိုရင် runtime က MongoDB ပေါ်မှာ query time မှာ fail ဖြစ်မယ့်အစား — startup မှာတင် `RUNTIME.MIDDLEWARE_FAMILY_MISMATCH` နဲ့ ငြင်းပယ်ပါတယ်။

Middleware က family-neutral ဖြစ်တဲ့ surface တွေ (`intercept`, `onRow`, shared result shape ပေါ်က `afterExecute`) နဲ့ပဲ ဆက်ဆံတယ်ဆိုရင်တော့ `familyId` ကို ချန်ထားလိုက်ပါ။ အဲဒီလို middleware က PostgreSQL ရော MongoDB ရောမှာ run လို့ရပြီး — [cache middleware](https://www.prisma.io/docs/orm/middleware/built-in-cache) က ဒီပုံစံအတိုင်း အလုပ်လုပ်ပါတယ်။

အခုဆိုရင် သင်မှာ အလုပ်လုပ်ပြီး configure လုပ်လို့ရတဲ့ middleware တစ်ခု ရှိပါပြီ။ ဒီ page ရဲ့ ကျန်တဲ့ အပိုင်းတွေကတော့ — သင့် middleware ကြီးထွားလာတာနဲ့အမျှ သင်လက်လှမ်းမီဖို့ လိုတဲ့ surface တွေပါ။

## Hook များ

`afterExecute` က hook ငါးခုထဲက တစ်ခုပါ။ ဘယ် subset ကိုမဆို implement လုပ်လို့ရပါတယ်:

| Hook | ဘယ်အချိန်မှာ run လဲ | ဘာအတွက် သုံးလဲ |
| --- | --- | --- |
| `beforeCompile(draft, ctx)` | Query AST က SQL မဖြစ်ခင် | Query ကို ပြန်ရေးပါ — ဥပမာ tenant filter ထည့်တာ |
| `beforeExecute(plan, ctx, params?)` | Driver မရောက်ခင် — `plan.sql` render ပြီးသား | Validate လုပ်ပါ၊ block ဖို့ throw လုပ်ပါ၊ ဒါမှမဟုတ် parameter values တွေ ချိန်ညှိပါ |
| `intercept(plan, ctx)` | Driver မတိုင်ခင် ချက်ချင်း | `{ rows }` ပြန်ပေးပြီး query ကို ကိုယ်တိုင် အဖြေပေးပါ |
| `onRow(row, plan, ctx)` | Stream လုပ်လိုက်တဲ့ row တစ်ခုစီမှာ တစ်ခါ | Rows တွေကို ရေတွက်ပါ ဒါမှမဟုတ် နမူနာယူပါ; ရပ်တန့်ချင်ရင် throw လုပ်ပါ |
| `afterExecute(plan, result, ctx)` | Query ပြီးဆုံးပြီးနောက် | Timing, row count နဲ့ ရလဒ်ကို log လုပ်ပါ |

[How middleware works](/docs/prisma/how-middleware-works) မှာ ဒီအစီအစဉ်ကို animation နဲ့ ဖော်ပြထားပါတယ်။ ဒီနေရာမှာတော့ hook နှစ်ခုကို အနီးကပ် ကြည့်ရအောင် — ဘာလို့လဲဆိုတော့ ဒီနှစ်ခုက query ကို လေ့လာရုံမက ပြောင်းလဲပစ်လို့ပါ။

### beforeCompile နဲ့ query တွေကို ပြန်ရေးခြင်း

`beforeCompile` က typed AST ကို SQL မဖြစ်ခင်ကတည်းက မြင်ရပါတယ်။ Draft အသစ်တစ်ခု ပြန်ပေးပြီး query ကို ပြန်ရေးနိုင်ပါတယ်။ ဒီ middleware က `user` table ပေါ်က `SELECT` တိုင်းကို predicate တစ်ခု ထည့်ပေးပါတယ်:

```ts
import type { SqlMiddleware } from '@prisma/orm-postgres/family-runtime';
import { AndExpr, type BinaryExpr } from '@prisma/orm-postgres/relational-core/ast';

export function scopeUserSelects(predicate: BinaryExpr): SqlMiddleware {
  return {
    name: 'scope-user-selects',
    familyId: 'sql',

    async beforeCompile(draft) {
      if (draft.ast.kind !== 'select') return undefined;
      if (draft.ast.from?.kind !== 'table-source') return undefined;
      if (draft.ast.from.name !== 'user') return undefined;
      const where = draft.ast.where ? AndExpr.of([draft.ast.where, predicate]) : predicate;
      return { ...draft, ast: draft.ast.withWhere(where) };
    },
  };
}
```

Query ကို မပြောင်းဘဲ ဖြတ်သွားချင်ရင် `undefined` ပြန်ပေးပါ။ Middleware တစ်ခုချင်းစီရဲ့ ပြန်ပေးတဲ့ draft က နောက် middleware ဆီ ရောက်သွားလို့ — rewrites တွေက registration order အတိုင်း ပေါင်းစပ်သွားပါတယ်။

### intercept နဲ့ query တွေကို အဖြေပေးခြင်း

`intercept` ကနေ rows တွေ ပြန်ပေးလိုက်ရင် driver က လုံးဝ run မလုပ်တော့ပါဘူး။ Caches, test fixtures, rate limiters နဲ့ circuit breakers တွေ အားလုံး ဒီ hook ပေါ်မှာ အံဝင်ခွင်ကျ ဖြစ်ပါတယ်။ Raw row objects တွေကို ပြန်ပေးလိုက်ရုံပါပဲ — runtime က ၎င်းတို့ကို ပုံမှန်အတိုင်း decode လုပ်ပြီး `afterExecute` က `source: 'middleware'` ဆိုပြီး အစီရင်ခံလို့ short-circuit ဖြစ်သွားတာ သင့် logging မှာ မြင်နေရပါတယ်။ [Cache middleware](https://www.prisma.io/docs/orm/middleware/built-in-cache) က ဒီ hook ရဲ့ reference implementation ပါ။

## Context object

Hook တိုင်းက နောက်ဆုံး argument အနေနဲ့ context (`ctx`) တစ်ခုကို လက်ခံရရှိပါတယ်:

| Field | ဘာတွေ ပေးလဲ |
| --- | --- |
| `ctx.planExecutionId` | Query တစ်ခုရဲ့ hook တိုင်းမှာ တူညီတဲ့ unique ID — လေ့လာတွေ့ရှိချက်တွေကို ဆက်စပ်ဖို့ |
| `ctx.now()` | Runtime ရဲ့ နာရီ — tests တွေမှာ အချိန်ကို ထိန်းချုပ်လို့ရအောင် `Date.now()` ထက် ဒါကို ဦးစားပေးပါ |
| `ctx.scope` | `'runtime'`, `'connection'` ဒါမှမဟုတ် `'transaction'` — မထိသင့်တဲ့ scopes တွေမှာ အလုပ်ကို ကျော်လိုက်ပါ |
| `ctx.mode` | `'strict'` ဒါမှမဟုတ် `'permissive'` — strict environment တွေမှာ throw လုပ်ပြီး တခြားနေရာတွေမှာ warn လုပ်ပါ |
| `ctx.contentHash(plan)` | Statement နဲ့ parameters တွေရဲ့ stable digest — cache keys အတွက် |
| `ctx.contract` | Runtime ရဲ့ contract — hook တစ်ခုက schema အချက်အလက် လိုအပ်တဲ့အခါ |
| `ctx.log` | Structured log sinks (`info`, `warn`, `error`) — runtime ရဲ့ logger နဲ့ ချိတ်ဆက်ထား |

`postgres(...)` client က log sink တစ်ခု ချိတ်ဆက်ဖို့ နည်းလမ်း မဖော်ထုတ်ရသေးလို့ — `ctx.log` ဆီ ပို့လိုက်တဲ့ events တွေက default အားဖြင့် ဘယ်နေရာမှာမှ print မဖြစ်ပါဘူး။ မြင်ရမယ့် output လိုချင်ရင် — အထက်က query logger က `console.log` နဲ့ လုပ်သလိုပဲ — ကိုယ့် logger ပေါ်ကို တိုက်ရိုက် log လုပ်ပါ။

## သတိထားရမယ့် အချက်များ

> **Warning — `afterExecute` ကို သတိနဲ့ သုံးပါ**
>
> - အောင်မြင်တဲ့ query တစ်ခုပေါ်မှာ `afterExecute` ကနေ throw လုပ်ရင် — database အလုပ် ပြီးသွားပြီးသား ဖြစ်ပေမယ့် call က fail ဖြစ်ပါတယ်။ ကျယ်ကျယ်လောင်လောင် fail ဖြစ်တာ ကိုယ်တိုင် အဓိပ္ပာယ်ရှိတဲ့ ကိစ္စတွေအတွက်ပဲ သိမ်းထားပါ — [budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets) ရဲ့ latency check လုပ်ပုံမျိုးပါ။
> - `afterExecute` က driver ကိုယ်တိုင် ကျရှုံးတဲ့အခါမှာလည်း run ပြီး — `result.completed` က `false` ဖြစ်နေပါမယ်။ အဲဒီ failure path ပေါ်မှာ သင်ပစ်လိုက်တဲ့ errors တွေကို မျိုချပါတယ် — driver error ကို ဖုံးကွယ်မသွားအောင်ပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ ဒီ guide နဲ့ ကိုက်ညီတဲ့ prompts တွေ:

- "250ms ထက် နှေးတဲ့ query တိုင်းကို log လုပ်ပြီး budgets ရဲ့ ရှေ့မှာ register လုပ်ပေးတဲ့ Prisma 8 middleware တစ်ခု ရေးပေးပါ။"
- "User table ပေါ်က SELECT တိုင်းကို လက်ရှိ tenant နဲ့ scope လုပ်ပေးတဲ့ beforeCompile middleware တစ်ခု ထည့်ပေးပါ။"
- "Tests တွေမှာ products table အတွက် fixture rows တွေ ပြန်ပေးတဲ့ intercept middleware တစ်ခု ရေးပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [How middleware works](/docs/prisma/how-middleware-works) — သင့် hooks တွေ ချိတ်ဆက်ဝင်တဲ့ lifecycle; middleware က query တိုင်းရဲ့ ရှေ့နဲ့ နောက်မှာ သင့် code ကို run လို့ policy တစ်ခုက သင့် app တစ်ခုလုံးကို လွှမ်းခြုံနိုင်ပါတယ်
- [Built-in: budgets](https://www.prisma.io/docs/orm/middleware/built-in-budgets) — row counts တွေကို ကန့်သတ်ပြီး latency ကျော်နေတဲ့ queries တွေကို မြင်သာအောင် လုပ်ပေးတဲ့ budgets middleware
- [Built-in: lints](https://www.prisma.io/docs/orm/middleware/built-in-lints) — query တစ်ခုစီရဲ့ တည်ဆောက်ပုံကို run မလုပ်ခင် စစ်ပြီး အန္တရာယ်ရှိတဲ့ ပုံစံတွေကို block ဒါမှမဟုတ် warn လုပ်ပေးတဲ့ lints middleware
- [Built-in: cache](https://www.prisma.io/docs/orm/middleware/built-in-cache) — ထပ်ခါထပ်ခါ ဖတ်တာတွေကို in-memory store ကနေ ဖြည့်ပေးပြီး query တစ်ခုချင်းအလိုက် cache annotation နဲ့ opt in လုပ်တဲ့ cache middleware
