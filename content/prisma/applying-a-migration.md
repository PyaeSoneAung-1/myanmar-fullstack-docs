---
title: "Migration တစ်ခု Apply လုပ်ခြင်း (Applying a Migration)"
description: "db migrate command က သင့် database ရှိတဲ့နေရာကနေ သင်ရောက်ချင်တဲ့နေရာအထိ graph ကို လျှောက်သွားပြီး — preview, step တိုင်းမှာ checkpoint နဲ့ လုံခြုံတဲ့ retry တွေနဲ့အတူ"
order: 17
source: "https://www.prisma.io/docs/orm/prisma-migrate/applying-a-migration"
status: translated
updated: 2026-09-01
---

Applying က database တစ်ခုကို ထိတဲ့ တစ်ခုတည်းသော step ဖြစ်ပြီး — command တစ်ခုတည်း ရှိပါတယ်:

```bash
npx prisma@latest db migrate
```

Command က `db migrate` ဖြစ်ပြီး `migration apply` မဟုတ်ပါဘူး။ `migration ...` subcommands တွေက disk ပေါ်က file တွေကို စီမံပြီး — `db migrate` က database တစ်ခုကို ရွှေ့ပါတယ်။ Database က အခု ဘယ်မှာ ရှိလဲ (သူ့ရဲ့ **marker**) ကို ဖတ်ပြီး — [migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) ကနေ target ဆီ လမ်းကြောင်းတစ်ခု ရှာကာ လမ်းတစ်လျှောက် migration တစ်ခုချင်းစီကို apply လုပ်ပါတယ်။ လုပ်သွားတိုင်း operation တိုင်းရဲ့ precheck, execute နဲ့ postcheck ကို run ပါတယ်။

ပုံမှန်အားဖြင့် connection က `prisma.config.ts` ထဲက `db.connection` ကနေ လာပါတယ်။ Override လုပ်ဖို့ `--db` ပေးပါ:

```bash
npx prisma@latest db migrate --db $DATABASE_URL
```

အောင်မြင်တဲ့ run တစ်ခုက လုပ်ဆောင်ခဲ့တဲ့ operation တိုင်းနဲ့ သူ ချန်ထားခဲ့တဲ့ marker ကို အစီရင်ခံပါတယ်:

```text
✔ Applied 1 migration(s) (3 operation(s)) across 1 contract space(s)

App space
  ├─ Add column "displayName" to "user"
  ├─ Data transform: backfill-user-displayName
  └─ Set NOT NULL on "user"."displayName" (destructive)
  marker: sha256:e6b5c2849eca8d24ff1e8e88ab2a4234db8e74c497c035cb7ce42e814f31cd63

Next: prisma-cli migration status
```

အဲဒီ hint ထဲက `prisma-cli` က binary ရဲ့ ကိုယ့်ကိုယ်ကို ခေါ်တဲ့ နာမည်ပါ။ `npx prisma@latest` အနေနဲ့ ခေါ်တဲ့အခါ — အကြံပြုထားတဲ့ subcommand ကို အလားတူ ပုံစံနဲ့ run ပါ (`npx prisma@latest migration status`)။

`App space` က သင့် application ရဲ့ migration lane ဖြစ်ပြီး — run တစ်ခုရဲ့ *contract spaces* တွေထဲက တစ်ခုပါ။ Database extensions သုံးတဲ့ project တွေက အောက်က [Extension spaces](#extension-spaces) မှာ ဖော်ပြထားတဲ့အတိုင်း spaces အပိုတွေ ရရှိပါတယ်။

## အရင်စစ်ပါ၊ ပြီးရင် Preview၊ ပြီးမှ Apply လုပ်ပါ

တည်ဆောက်သင့်တဲ့ အလေ့အထက — အထူးသဖြင့် shared databases တွေမှာ — အဆင့်သုံးဆင့် စည်းချက်ပါ:

```bash
# 1. Database က ဘယ်မှာလဲ၊ ဘာတွေ pending လဲ?
npx prisma@latest migration status --db $DATABASE_URL

# 2. အတိအကျ ဘာတွေ run မလဲ?
npx prisma@latest db migrate --show --db $DATABASE_URL

# 3. Run လုပ်ပါ။
npx prisma@latest db migrate --db $DATABASE_URL
```

`migration status` က database ရဲ့ marker နဲ့ target ကြား လမ်းကြောင်းကို ဆွဲပြပြီး — migration တစ်ခုချင်းစီကို applied ဒါမှမဟုတ် pending အဖြစ် အမှတ်အသား လုပ်ပါတယ်:

```text
*   925198f  @contract
|^  20260707T1006_add_user_phone  705b1a6 -> 925198f  1 ops  > pending
*   705b1a6  @db (db)
|^  20260707T1005_init                  - -> 705b1a6  2 ops  + applied
*   -

1 pending — run `prisma-cli migrate --to 925198f3cc27`
```

အပေါ်က output က မူရင်းအတိုင်းပါ။ `prisma-cli migrate` က command ရဲ့ binary အတွင်းပိုင်း နာမည်ပါ; `npx prisma@latest db migrate --to 925198f3cc27` အနေနဲ့ run ပါ။

ညာဘက်က markers တွေကို ဖတ်ပါ: `@db` က database ရှိနေတဲ့နေရာ၊ `@contract` က သင့် emitted contract ရှိတဲ့နေရာ၊ ပြီးတော့ `(db)` က node တစ်ခုတည်းကို ညွှန်တဲ့ အဲဒီအမည်ရှိတဲ့ [ref](https://www.prisma.io/docs/orm/migrations/the-migration-graph#name-important-states-with-refs) ပါ။

`db migrate --show` က read-only dry run ပါ — database ရဲ့ နေရာကနေ target ဆီ လမ်းကြောင်းကို ဆွဲပြပြီး ရပ်လိုက်ပါတယ်။ ဘာမှ database ကို မထိပါဘူး:

```text
│↑  20260707T1006_add_user_phone  705b1a6 → 925198f  ↑ will run
○   705b1a6
│↑  20260707T1005_init                  ∅ → 705b1a6  ↑ will run
○   ∅  @db

The following 2 migrations will run:
  20260707T1005_init                ∅ → 705b1a6
  20260707T1006_add_user_phone  705b1a6 → 925198f
```

Apply လုပ်ပြီးနောက် `migration log` က database ရဲ့ ကိုယ်ပိုင် မှတ်တမ်းကို ပြပါတယ် — runner က marker ဘေးမှာ ရေးတဲ့ append-only **ledger** (မှတ်တမ်း) ပါ:

```text
 Applied at             Migration                       Change                 Ops
---------------------- ------------------------------- -------------------- ------
 2026-07-07 10:05:32Z   20260707T1005_init              - -> 705b1a6         2 ops
 2026-07-07 10:09:55Z   20260707T1006_add_user_phone    705b1a6 -> 925198f   1 ops
```

## Target ရွေးချယ်ခြင်း

`--to` မပါဘဲ — `db migrate` က သင့် emitted contract ဆီ ရှေ့ရွှေ့ပါတယ်။ တိကျတဲ့နေရာကို ပစ်မှတ်ထားချင်ရင် `--to` နဲ့ နာမည်ပေးပါ — ဥပမာ ref တစ်ခု:

```bash
npx prisma@latest db migrate --to prod --db $DATABASE_URL
```

Graph က branch ခွဲထားပြီး tip တစ်ခုထက် ပိုပြီး ရောက်လို့ရရင် — `db migrate` က ရပ်ပြီး explicit `--to` တောင်းပါတယ်။ အဲဒါက graph ရဲ့ အကာအကွယ်ပါ: feature branch နှစ်ခုလုံးက valid futures တွေ ဖြစ်နိုင်လို့ — တစ်ခုကို ရွေးတာက လူသားရဲ့ ဆုံးဖြတ်ချက်ပါ။

`--advance-ref` က အမည်ရှိတဲ့ ref တစ်ခုကို တစ်ဆင့်တည်းမှာ post-apply state ဆီ ရွှေ့ပေးပြီး — အဲဒါက [`migration plan`](/docs/prisma/generating-a-migration#the-db-ref-skipping---from) ကို incremental ဖြစ်စေတဲ့အရာပါ။ [`db migrate` reference](https://www.prisma.io/docs/cli/db-migrate#options) မှာ `--to` grammar အပြည့်အစုံ (refs, hashes, migration names, `<dir>^`) နဲ့ flag contract ကို ဖော်ပြထားပါတယ်။

## တစ်ခုခု မှားသွားတဲ့အခါ

Runner က ပထမဆုံး ကျရှုံးတဲ့ operation မှာ ရပ်ပြီး — ဘယ်ဟာ၊ ဘာကြောင့်၊ ဘာလုပ်ရမလဲဆိုတာ ပြောပါတယ်:

```text
✖ Operation pgvector.install-vector-extension failed during execution: create extension "vector" (PN-RUN-3000)
  Why: extension "vector" is not available
  Fix: Fix the issue and re-run `prisma-cli migrate --to <contract>` — previously applied migrations are preserved.
```

အဲဒီ hint က CLI ရဲ့ မူရင်း output ပါ; `prisma-cli migrate` က `db migrate` ရဲ့ အတွင်းပိုင်း နာမည်ဖြစ်လို့ — `npx prisma@latest db migrate --to <contract>` အနေနဲ့ ပြန် run ပါ။

Property သုံးခုက failure တွေကို ကြောက်စရာမဟုတ်တော့အောင် လုပ်ပေးပါတယ်:

- **PostgreSQL ပေါ်မှာ failed run တစ်ခုက ဘာမှ မချန်ထားပါဘူး။** `db migrate` run တစ်ခုလုံးက transaction တစ်ခုတည်းထဲမှာ run လို့ — operation တစ်ခု ကျရှုံးရင် run ထဲက အရာအားလုံး roll back ဖြစ်ပြီး database က သင်စတင်ခင် အတိအကျ နေရာကို ပြန်ရောက်ပါတယ်။ *အရင်က* runs တွေမှာ apply လုပ်ထားတဲ့ migrations တွေက မထိပါဘူး။ အဲဒါက "previously applied migrations are preserved" ဆိုတဲ့ အဓိပ္ပာယ်ပါ။
- **Error က တိကျပါတယ်။** ဘယ် operation၊ ဘယ် phase (precheck, execute, ဒါမှမဟုတ် postcheck) နဲ့ ဘယ် check ကျရှုံးလဲ နာမည်ပေးလို့ — ရှာဖွေစရာ မလိုဘဲ အကြောင်းရင်းကို ပြင်လို့ရပါတယ်။
- **ပြန် run လုပ်တာ လုံခြုံပါတယ်။** Operations တွေက idempotent ပါ — တစ်ခုကို run မလုပ်ခင် runner က သူ့ရဲ့ postcheck ကို အကဲဖြတ်ပြီး database က ကျေနပ်နေပြီးသားဆိုရင် ကျော်လိုက်ပါတယ်။ Migrations အပြင်ဘက်ကနေ လုပ်ထားတဲ့ ပြောင်းလဲမှုတစ်ခုက run ကို မချိုးပါဘူး။ Runner က operation ကို ကျော်လိုက်ရုံပါပဲ။ Cross-collection transactions မရှိတဲ့ MongoDB ပေါ်မှာတော့ — တစ်ဝက်တစ်ပျက် apply လုပ်ထားတဲ့ run တစ်ခုက retry လုပ်တိုင်း ဆုံချက်ရောက်အောင် (converge) စေတာ ဒီယန္တရားတစ်ခုတည်းပါ။ Failure playbook အပြည့်အစုံအတွက် [Rollbacks and recovery](https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery) ကို ကြည့်ပါ။

DDL တစ်ခုခု run မလုပ်ခင် `db migrate` က database ရဲ့ marker ကို graph သိတဲ့ state တစ်ခုလား စစ်ပါတယ်။ Migrations အပြင်ဘက်ကနေ ပြောင်းထားတဲ့ database တစ်ခုက — မသိတဲ့ drift အပေါ်မှာ SQL ထပ်မလောင်းဘဲ marker mismatch နဲ့ ချက်ချင်း fail ဖြစ်ပါတယ်။

## Development နဲ့ Production

Command တွေက နေရာတိုင်း အတူတူပါပဲ။ ပြောင်းတာက file တွေ ဘယ်ကလာလဲ၊ ဘယ်သူ run လဲဆိုတာပါ။

**Development မှာ** သင်က planning နဲ့ editing လုပ်ပြီး — ချက်ချင်း apply လုပ်ပါတယ်:

```bash
npx prisma@latest migration plan --name my_change && npx prisma@latest db migrate --advance-ref db
```

**CI နဲ့ production မှာ** migrations တွေက သင့် repo ကနေ ရောက်လာပြီး — ကြိုပြီး plan, review, merge လုပ်ပြီးသားပါ။ အဲဒါကြောင့် [editing rule](https://www.prisma.io/docs/orm/migrations/editing-a-migration) က အရေးကြီးတာပါ: `migration.ts` နဲ့ `ops.json` ကို အတူ commit လုပ်ပြီး deploy မလုပ်ခင် နောက်ကျနေတဲ့ recompile တစ်ခုကို ဖမ်းဖို့ `migration check` run ပါ။ Exit codes တွေအတွက် [Generating a migration](/docs/prisma/generating-a-migration#reviewing-what-you-planned) ကို ကြည့်ပါ။ Deploy step က:

```bash
npx prisma@latest migration check          # files တွေ နဂိုအတိုင်း၊ graph ကောင်းမွန်တယ် (offline)
npx prisma@latest db migrate --show --db $DATABASE_URL   # ဘာတွေ run တော့မယ်ဆိုတာ log လုပ်
npx prisma@latest db migrate --db $DATABASE_URL
```

Runner က `ops.json` ကိုပဲ execute လုပ်ပြီး — အဲဒါက ရိုးရိုး data ဖြစ်လို့ သင့် `migration.ts` files တွေနဲ့ သူတို့ import လုပ်တဲ့ TypeScript တွေက production credentials တွေနဲ့ ဘယ်တော့မှ execute မဖြစ်ပါဘူး။

Concurrent deploys တွေ လုံခြုံပါတယ်: PostgreSQL ပေါ်မှာ apply တစ်ခုလုံးက advisory lock တစ်ခုနဲ့ စောင့်ကြပ်ထားတဲ့ transaction ထဲမှာ run လို့ — `db migrate` run နှစ်ခုက ရောထွေးမသွားဘဲ အစီအစဉ်လိုက် (serialize) ဖြစ်ပါတယ်။ MongoDB ပေါ်မှာတော့ cross-collection DDL transactions တွေ မရှိပါဘူး။ အစား — migration တစ်ခုစီက marker ကို compare-and-swap နဲ့ ရှေ့ရွှေ့ပြီး runner က marker ကို commit မလုပ်ခင် ရလာတဲ့ schema ကို verify လုပ်ပါတယ်။ ဒါကြောင့် re-run တစ်ခုက double-apply မလုပ်ဘဲ converge ဖြစ်ပါတယ်။

## Extension Spaces

သင့် project က [database extensions](https://www.prisma.io/docs/orm/extensions/using-extensions) (pgvector လိုမျိုး) သုံးရင် — output မှာ *contract space* တစ်ခုထက် ပိုပြီး တွေ့ရပါမယ်။ Extensions တွေက ကိုယ်ပိုင် migrations တွေ သယ်ဆောင်ပြီး (ဥပမာ `CREATE EXTENSION vector`) — သင့် app ရဲ့ ဘေးက `migrations/<extension>/` မှာ ခြေရာခံပါတယ်။ `db migrate` run တစ်ခုက အားလုံးကို လျှောက်သွားပြီး (extensions အရင်၊ ပြီးမှ သင့် app) — space တစ်ခုချင်းစီကို သီးခြား အစီရင်ခံပါတယ်:

```text
✔ Applied 2 migration(s) (20 operation(s)) across 2 contract space(s)

Extension space: pgvector
  └─ Enable extension "vector"

App space
  ├─ Create table "user"
  └─ ...
```

> **အစောပိုင်း အဆင့်မှာ ဘာတွေလဲ**
>
> Apply, targeting, preview, refs, ledger နဲ့ multi-space runs တွေက ဒီနေ့ အလုပ်လုပ်ပါတယ်။ မတည်ဆောက်ရသေးတာတွေ: shadow-database rehearsal နဲ့ `ops.json` က `migration.ts` နဲ့ ကိုက်သေးလားဆိုတဲ့ apply-time check ပါ။ အဲဒါအထိ `db migrate` က target အစစ်အမှန်ပေါ်မှာ run လို့ — `--show` နဲ့ staging database တစ်ခုကို သုံးပြီး rehearsal လုပ်ပါ၊ ပြီးတော့ stale `ops.json` တစ်ခုကို ဖမ်းဖို့ CI မှာ `migration check` run ပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "Staging ကို migration status စစ်ပြီး pending ဖြစ်နေတာတွေ အကုန် apply လုပ်ပေးပါ။"
- "`db migrate --to prod` က ဘာတွေ run မလဲ preview လုပ်ပြီး destructive operations တွေကို အကျဉ်းချုပ် ပြပေးပါ။"
- "Pending migrations တွေ apply လုပ်ပြီး `db` ref ကို ရှေ့ရွှေ့ပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Rollbacks and recovery](https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery) — ရှေ့မရွေ့ဘဲ နောက်ပြန်သွားဖို့ လိုအပ်တဲ့အခါ
- [The migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) — markers, refs နဲ့ pathfinding
- [Generating a migration](/docs/prisma/generating-a-migration) — `db migrate` run လုပ်တဲ့ဟာကို ထုတ်လုပ်ခြင်း
- [Studio with Prisma 8](https://www.prisma.io/docs/studio/prisma-next) — သင်ရေးလိုက်တဲ့ ledger ကို visual timeline အဖြစ် ဖတ်ပါ — migration တစ်ခုချင်းစီအတွက် executed SQL နဲ့ schema diff ပါ
