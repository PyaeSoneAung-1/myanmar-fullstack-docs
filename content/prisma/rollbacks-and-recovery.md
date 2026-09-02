---
title: "Rollback နဲ့ Recovery (Rollbacks and Recovery)"
description: "Rollback ဆိုတာ သင်ရောက်ဖူးပြီးသား state တစ်ခုဆီ ဦးတည်တဲ့ migration တစ်ခု ထပ် plan လုပ်တာပါ — recovery ကတော့ အကြောင်းရင်းကို ပြင်ပြီး လုံခြုံစွာ ပြန် run တာပါ"
order: 27
source: "https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery"
status: translated
updated: 2026-09-02
---

Rollback လုပ်တာက သင်ရောက်ဖူးပြီးသား state တစ်ခုဆီ ဦးတည်တဲ့ migration တစ်ခု ထပ် plan လုပ်တာပါ။ Recovery ကတော့ အကြောင်းရင်းကို ပြင်ပြီး — လုံခြုံစွာ ပြန် run တာပါ။

"Rollback" လို့ ခေါ်တဲ့ အခြေအနေ နှစ်မျိုး ရှိပြီး — Prisma 8 က သူတို့ကို မတူအောင် ဆက်ဆံပါတယ်:

- **Migration က apply ဖြစ်ခဲ့ပေမယ့် — ပြောင်းလဲမှုက မှားနေတယ်။** Database ကို အစောပိုင်း state တစ်ခုဆီ *ပြန်* ရွှေ့ဖို့ လိုပါတယ်။ အဲဒါက **rollback** ဖြစ်ပြီး — Prisma 8 မှာ ဒါက migration တစ်ခု နောက်ထပ်ပါ။
- **Migration က တစ်ဝက်မှာ ကျရှုံးသွားတယ်။** *မှီဝဲဆွဲထားတဲ့အခြေအနေ* ကနေ လွတ်အောင် လုပ်ဖို့ လိုပါတယ်။ အဲဒါက **recovery** ဖြစ်ပြီး — ပုံမှန်အားဖြင့် အကြောင်းရင်းကို ပြင်ပြီး ပြန် run တာပါ — ဘာလို့လဲဆိုတော့ ပြန် run တာ လုံခြုံလို့ပါ။

## Rollback: တခြား Migration တွေလိုပဲ သာမန် Migration တစ်ခု

`migrate down` command မရှိပါဘူး။ သီးခြား "down migration" files တွေလည်း မရှိပါဘူး။ [graph model](https://www.prisma.io/docs/orm/migrations/the-migration-graph) ထဲမှာ — သင်ပြန်ရောက်ချင်တဲ့ state က သင်ရောက်ဖူးပြီးသား node တစ်ခုမို့ — rollback လုပ်တာက အဲဒါကို ညွှန်တဲ့ edge အသစ်တစ်ခု plan လုပ်တာပါ။ Git သိရင် — ဒါက `git reset` မဟုတ်ဘဲ `git revert` ပါ။ History က တိုးလာရုံပဲ ရှိပြီး — ledger (database တိုင်း သိမ်းထားတဲ့ applied-history record) က round trip အပြည့် ထိန်းထားပါတယ်။

> **Animation: migration rollback** — migration တစ်ခုကို ရှေ့ပြန် apply လုပ်ပြီး နောက်ပြန် roll back လုပ်တဲ့အခါ history က ဘယ်လို တိုးလာလဲ သရုပ်ပြထားပါတယ်။

`20260707T1008_add_display_name` က ပို့ပြီးသား ဖြစ်ပြီး ပြန်ထုတ်ပစ်ဖို့ လိုတယ် ဆိုပါစို့။ ပြောင်းပြန် edge ကို plan လုပ်ပါ။ `<dir>^` ဆိုတာ "အဲဒီ migration မတိုင်ခင် state" ကို ဆိုလိုပါတယ်:

```bash
npx prisma@latest migration plan \
  --from 20260707T1008_add_display_name \
  --to 20260707T1008_add_display_name^ \
  --name rollback_display_name
```

```text
✔ Planned 1 operation(s)

│
└─ Drop column "displayName" from "user" (destructive)

⚠ This migration contains destructive operations that may cause data loss.

from:   sha256:e6b5c2849eca8d24ff1e8e88ab2a4234db8e74c497c035cb7ce42e814f31cd63
to:     sha256:705b1a62f26f0913caa4bfe3f8b7cb491a1b94bd47fc43471d8711bc480bcbb5

DDL preview

ALTER TABLE "public"."user" DROP COLUMN "displayName";
```

Planner က contract state နှစ်ခုကို diff လုပ်ပြီး — ပြောင်းလဲမှုကို ပြန်ဖျက်တဲ့ operations တွေ ရေးပါတယ်။ သူတို့က ဖျက်ဆီးတတ်တာတွေ ဖြစ်လို့ **destructive** လို့ အမှတ်အသား လုပ်ပါတယ်။ ဒါက migration အစစ်ပါ: သုံးသပ်ပါ၊ တည်းဖြတ်ပါ (ဥပမာ — `DROP` မလုပ်ခင် column ရဲ့ data ကို တခြား table တစ်ခုထဲ archive လုပ်ဖို့)၊ commit လုပ်ပါ။ ပြီးရင် တခြား migration တွေလိုပဲ apply လုပ်ပါ:

```bash
npx prisma@latest db migrate --to 20260707T1008_add_display_name^
```

Rollback တစ်ခုက graph ထဲမှာ cycle တစ်ခုလည်း ချန်ထားလို့ — နောက် `migration plan` က သူ့စမှတ်ကို အလိုအလျောက် ရွေးလို့ မရတော့ပါဘူး။ `MIGRATION.NO_TARGET` error နဲ့ ကျရှုံးပြီး — ရောက်လို့ရတဲ့ states တွေကို စာရင်းပြပါတယ်။ History ရှေ့ပြန် ရွေ့သွားတဲ့အထိ — ရှင်းရှင်းလင်းလင်း `--from <state>` နဲ့ plan လုပ်ပါ။

Database နောက်ပြန် ရောက်သွားပြီးနောက်မှာလည်း ချည်ကြိုးတစ်ချောင်း ကျန်နေပါသေးတယ်: သင့် contract source ထဲမှာ ပြောင်းလဲမှုက ပါနေသေးလို့ — schema ကို ပြန်မပြင်ဘဲ `contract emit` ကို ပြန်မလုပ်ရင် `db verify` က hash mismatch တစ်ခု အစီရင်ခံပါတယ်။ Rollback migration နဲ့ အတူတူ commit တစ်ခုထဲမှာ contract ကိုပါ ပြန်လှိမ့်ပါ — နှစ်ခု ခြေလှမ်းချင်း ညီနေမှာပါ။

ပြီးနောက်မှာ graph က round trip ကို ပြပါတယ်: forward edge တစ်ခု အပေါ်၊ rollback edge တစ်ခု အောက်ပြန်:

```text
*   e6b5c28  @contract
|^  20260707T1008_add_display_name       705b1a6 -> e6b5c28  3 ops
|v  20260707T1010_rollback_display_name  e6b5c28 -> 705b1a6  1 ops
*   705b1a6
|^  20260707T1005_init                         - -> 705b1a6  2 ops
*   -
```

Database ရဲ့ marker (သူ လက်ရှိ ကိုက်ညီနေတဲ့ graph node ရဲ့ မှတ်တမ်း) က `705b1a6` ကို ပြန်ရောက်ပြီး — ledger က apply ရော rollback ရော နှစ်ခုလုံးကို မှတ်တမ်းတင်ပါတယ်။ ဘာမှ ပြန်ရေး (rewrite) တာ ဒါမှမဟုတ် ဖျက်တာ မရှိပါဘူး။

ရှင်းရှင်းလင်းလင်း မြင်ထားရမယ့် အချက် နှစ်ခု:

- **Rollback တစ်ခုက data တွေကို ပြန်မရှင်စေပါဘူး။** Column ကို drop လုပ်တာက forward migration ရော app ရော အဲဒီထဲ ရေးထားတာ အားလုံးကို စွန့်ပစ်လိုက်တာပါ။ အဲဒီ data အရေးကြီးရင် — rollback migration ကို တည်းဖြတ်ပြီး အရင်ဆုံး တစ်နေရာရာမှာ သိမ်းထားလိုက်ပါ။ Rollback က automatic mechanism တစ်ခု မဟုတ်ဘဲ — တည်းဖြတ်လို့ရတဲ့ migration တစ်ခု ဖြစ်ရတဲ့ အကြောင်းရင်း အတိအကျ ဒါပါ။
- **Step တိုင်းကို ပြန်တက်စရာ မလိုပါဘူး။** Edge တစ်ခုက လက်ရှိ state ကနေ အစောပိုင်း node ဘယ်ဟာကိုမဆို — intermediate states တွေကို ကျော်ပြီး — တိုက်ရိုက် ခုန်လို့ရပါတယ်: ပြောင်းလဲမှု သုံးခုကို ပြန်လှိမ့်နေရင်တောင် — planned migration တစ်ခု၊ apply တစ်ကြိမ်ပဲ လိုပါတယ်။

### Rollback ပြီးနောက် Planning Caveat တစ်ခု

Rollback edge တစ်ခုက graph ထဲမှာ cycle တစ်ခု (`A → B → A`) ဖန်တီးပြီး — cycle ရှိတဲ့အခါ planner က "နောက်ဆုံး state" ကို သူ့ဘာသာ ခန့်မှန်းလို့ မရတော့ပါဘူး။ နောက်တစ်ခါ `migration plan` run တဲ့အခါ — `--from` ကို (migration directory နာမည် ဒါမှမဟုတ် hash တစ်ခု) ရှင်းရှင်းလင်းလင်း ပေးပါ။ တခြားနည်းနဲ့ ရလာမယ့် `MIGRATION.NO_TARGET` error က ဒါကို အတိအကျ ပြောပါတယ်။

## Recovery: Migration တစ်ခု တစ်ဝက်မှာ ကျရှုံးတဲ့အခါ

ကျရှုံးတဲ့ `db migrate` run တစ်ခုက ကျရှုံးတဲ့ operation မှာ ရပ်ပြီး — အတိအကျ အစီရင်ခံပါတယ်:

```text
✖ Operation alterNullability.setNotNull.user.nickname failed during precheck:
  ensure no NULL values in "nickname" (PN-RUN-3000)
  Why: Migration runner failed
  Fix: Fix the issue and re-run `prisma-cli migrate --to <contract>` — previously applied migrations are preserved.
```

အဲဒီ hint က CLI ရဲ့ literal output ပါ: `prisma-cli migrate` က `db migrate` ရဲ့ internal နာမည်မို့ — ပြန် run ရမယ့် command က `npx prisma@latest db migrate --to <contract>` ပါ။

လုပ်နည်း (playbook):

1. **ဘယ် check ကျရှုံးလဲ ဖတ်ပါ။** Error က operation ရော ဘယ် precheck ဒါမှမဟုတ် postcheck ဆိုတာပါ — ရိုးရိုးဘာသာစကားနဲ့ နာမည်ပေးပါတယ်။ ဒီမှာဆို `NULL` တွေနဲ့ rows တွေ ရှိနေသေးလို့ — constraint ကို တင်းကြပ်လိုက်တာ ကျရှုံးမှာပါ။
2. **သန့်ရှင်းရေး လုပ်စရာ မလိုပါဘူး။** PostgreSQL ပေါ်မှာ run တစ်ခုလုံးက transaction တစ်ခုတည်းမို့ — ကျရှုံးမှုက အရာအားလုံးကို လုံးလုံး roll back လုပ်ပြီးပါပြီ: database က run မလုပ်ခင် ရှိခဲ့တဲ့နေရာ အတိအကျ ပြန်ရောက်ပြီး — အစောပိုင်း run တွေမှာ apply လုပ်ထားတဲ့ migrations တွေက မထိခိုက်ပါဘူး။ လက်နဲ့ ဖြေဖျက်ရမယ့် "half-applied migration" ဆိုတာ မရှိပါဘူး။
3. **အကြောင်းရင်းကို ပြင်ပြီး — `db migrate` ပြန် run ပါ။** တစ်ခါတစ်ရံ အကြောင်းရင်းက environment ပါ (extension ပျောက်နေတာ၊ permissions)။ တစ်ခါတစ်ရံ migration ကိုယ်တိုင်ပါ; ဒီမှာဆို `setNotNull` မတိုင်ခင် backfill တစ်ခု ထည့်ဖို့ [migration ကို တည်းဖြတ်](https://www.prisma.io/docs/orm/migrations/editing-a-migration) ပြီး — `node migration.ts` နဲ့ ပြန် compile ကာ ပြန် apply လုပ်မှာပါ။ [failure model](/docs/prisma/applying-a-migration) မှာ ဖော်ပြထားတဲ့ အကြောင်းရင်းတွေကြောင့် ပြန် run တာ လုံခြုံပါတယ်။

Migration တစ်ခုက development မှာ အလုပ်ဖြစ်ပေမယ့် production မှာ ကျရှုံးမယ့် အခြေအနေမှာလည်း precheck က သင့်ကို ကာကွယ်ပါတယ်။ သင့် dev database မှာ `NULL` တွေ မရှိခဲ့ပေမယ့် production မှာ ရှိပါတယ်။ Precheck က destructive `ALTER` တစ်ခုခုကို မထိခိုက်စေခင် — production ကို ရပ်တန့်လိုက်ပြီး — generic constraint violation တစ်ခု statement အလယ်မှာ ပေါ်တာမျိုး မဟုတ်ဘဲ — rows-with-NULLs အခြေအနေကို အတိအကျ ညွှန်တဲ့ error တစ်ခု ထွက်ပါတယ်။

### Drift: Database က Migrations တွေ ချန်ထားခဲ့တဲ့နေရာမှာ မရှိတဲ့အခါ

တစ်စုံတစ်ယောက်က migrations တွေရဲ့ အပြင်မှာ database ကို ပြောင်းလိုက်ရင် (လက်နဲ့ run တဲ့ `ALTER`၊ backup အဟောင်းကနေ restore) — အခြေအနေ နှစ်မျိုး ဖြစ်နိုင်ပါတယ်။ အဲဒီပြောင်းလဲမှုက marker ကိုပါ graph မသိတဲ့ state တစ်ခုဆီ ရွှေ့လိုက်တဲ့အခါ — `db migrate` က SQL ဘာမှ run မလုပ်ခင် ကျရှုံးပြီး — drift အပေါ်မှာ ပြောင်းလဲမှုတွေ ထပ်ပုံမထားပါဘူး။ Marker က နဂိုအတိုင်း ရှိပြီး live schema ပဲ ပြောင်းသွားတဲ့အခါ — `db migrate` က ဆက်ပဲ run ပါတယ်: operation တစ်ခုချင်းစီရဲ့ postcheck က အလုပ်က ပြီးပြီးသားလားဆိုတာ ဆုံးဖြတ်လို့ — သူ မှတ်မိတဲ့ လက်နဲ့ apply ထားတဲ့ ပြောင်းလဲမှုတစ်ခုကို ကျော်သွားပြီး — မမှတ်မိတာက အဲဒီ operation ကို ကျရှုံးစေပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — database က တကယ် ဘယ်မှာလဲ ရှာဖွေခြင်းကနေ စပါ။ သင့် ရွေးစရာတွေ — ဦးစားပေး အစီအစဉ်အတိုင်း:

- **`db verify`** က database က သင့် contract နဲ့ ကိုက်ညီနေသေးလားဆိုတာ စစ်ပြီး — မကိုက်ညီရင် တိကျတဲ့ error တစ်ခုနဲ့ ကျရှုံးပါတယ်။
- **Development မှာ** `db update` က graph ကို မလျှောက်ဘဲ — database ကို သင့် contract ဆီ တိုက်ရိုက် ပြန်ညှိပေးပါတယ်။ မြန်ပါတယ် — ဒါပေမယ့် migration history ထဲမှာ မှတ်တမ်း မကျန်ခဲ့လို့ — dev-only reset တစ်ခုအနေနဲ့ သဘောထားပါ။
- **History လုံးဝ မရှိတဲ့ database တစ်ခုအတွက်** (environment အသစ်၊ ဒါမှမဟုတ် ရှိပြီးသား schema တစ်ခုပေါ်မှာ Prisma 8 ကို စတင်သုံးတာ) — `db init` က သူ့ကို လက်ရှိ contract ဆီ bootstrap လုပ်ပြီး marker ကို လက်မှတ်ထိုးပေးပါတယ်။

> **အစောပိုင်း အဆင့်မှာ ဘာတွေလဲ**
>
> Reverse planning (`--to <dir>^`)၊ destructive-operation warnings၊ resumable re-runs နဲ့ ledger — အပေါ်မှာ ပြထားသလို ဒီနေ့ အလုပ်လုပ်ပါတယ်။ Gaps တချို့ ကျန်နေပါသေးတယ်။ Migration တစ်ခုကို shadow copy တစ်ခုပေါ်မှာ အရင်ဆုံး execute လုပ်ကြည့်တဲ့ rehearsal mode မရှိပါဘူး။ `db verify`/`db update`/`db init` trio ထက်ပိုတဲ့ drift recovery က manual ပါ။ Cycles ပြီးနောက် planning caveat (ရှင်းလင်းတဲ့ `--from`) က ကျွန်တော်တို့ ချောမွေ့အောင် လုပ်ဖို့ မျှော်လင့်ထားတဲ့ papercut အစစ်တစ်ခုပါ။ နက်နက်ရှိုင်းရှိုင်း ဒါမှမဟုတ် ပုံမှန်မဟုတ်တဲ့ အခြေအနေတွေအတွက် — [Discord](https://pris.ly/discord) ပေါ်က `#prisma-next` က အမြန်ဆုံး လမ်းကြောင်းပါ။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "နောက်ဆုံး migration အတွက် rollback တစ်ခု plan လုပ်ပြီး — ကျွန်တော် မဆုံးဖြတ်ခင် သူ့ရဲ့ destructive operations တွေကို ပြပေးပါ။"
- "ဒီ db migrate run ကျရှုံးသွားတယ်။ Error ကို ဖတ်၊ migration ကို ပြင်၊ ပြန် run လုပ်ပေးပါ။"
- "Staging က contract ကနေ drift ဖြစ်နေလား စစ်ပြီး ကွဲလွဲချက်တွေကို ရှင်းပြပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [Applying a migration](/docs/prisma/applying-a-migration) — apply flow ထဲက failure model
- [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) — data အကြောင်းကြောင့် ကျရှုံးတဲ့ migration တစ်ခုကို ပြုပြင်ခြင်း
- [The migration graph](https://www.prisma.io/docs/orm/migrations/the-migration-graph) — နောက်ပြန်ဆိုတာ နောက်ထပ် edge တစ်ခုသာ ဖြစ်ရတဲ့ အကြောင်း
- [Generating a migration](/docs/prisma/generating-a-migration) — contract ပြောင်းလဲမှုတစ်ခုကို migration plan command နဲ့ ပြန်လည်သုံးသပ်လို့ရတဲ့ migration အဖြစ် ပြောင်းခြင်း
- [How migrations work](/docs/prisma/how-migrations-work) — contract ပြောင်း၊ migration plan လုပ်၊ သုံးသပ်၊ apply — step တိုင်း run မလုပ်ခင် နဲ့ လုပ်ပြီး စစ်ဆေးတယ်
