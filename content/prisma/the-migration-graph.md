---
title: "Migration Graph ဆိုတာ ဘာလဲ (The Migration Graph)"
description: "Migration တွေက file name အစား schema state တွေရဲ့ hash တွေကို ချိတ်ဆက်ပြီး graph (ဂရပ်) တစ်ခု ဖွဲ့ပါတယ် — branch တွေ ပေါင်းတာ၊ rollback လုပ်တာ၊ database တစ်ခုကို state တစ်ခုဆီ ရွှေ့တာ အားလုံး ဒီ graph ပေါ်မှာ ဖြစ်တယ်"
order: 25
source: "https://www.prisma.io/docs/orm/migrations/the-migration-graph"
status: translated
updated: 2026-09-02
---

သင်က သင့် branch ပေါ်မှာ `phone` column တစ်ခု ထည့်လိုက်တယ်။ သင့်အဖွဲ့သားတစ်ယောက်က သူ့ branch ပေါ်မှာ `avatarUrl` column တစ်ခု ထည့်လိုက်တယ်။ Branch နှစ်ခုလုံးက နေ့လည်ခင်းတစ်ခုတည်းမှာ merge ဖြစ်သွားတယ်။ အခုတော့ သင့် laptop၊ သင့်အဖွဲ့သားရဲ့ laptop၊ staging နဲ့ production — တစ်ခုချင်းစီက schema ရဲ့ နည်းနည်းစီ ကွဲပြားတဲ့ version တစ်ခုပေါ်မှာ ထိုင်နေပြီး — အလုပ်တွေ မဆုံးရှုံးဘဲ၊ တူညီတဲ့ ပြောင်းလဲမှုကို နှစ်ခါ run မဖြစ်ဘဲ database တိုင်းကို merged state အထိ ရောက်အောင် တစ်ခုခုက လုပ်ပေးရပါမယ်။

ဂန္ထဝင် (classic) migration tools တွေက ဒါကို ခက်ခဲစေပါတယ်။ သူတို့က migrations တွေကို folder တစ်ခုတည်းထဲမှာ ထားပြီး — timestamp အစီအစဉ်အတိုင်း တစ်ကြိမ်တည်း အတိအကျ run ပါတယ်။ Branch နှစ်ခုစလုံးက migration တစ်ခုစီ ထည့်လိုက်တဲ့အခါ — timestamp တွေ ရောထွေးသွားပြီး "order အတိုင်း တစ်ကြိမ်တည်း run မယ်" ဆိုတဲ့ အခြေခံယူဆချက် ပျက်သွားကာ — တစ်ယောက်ယောက်က file တွေကို ပြန်နာမည်ပေးပြီး သန့်ရှင်းတဲ့ line တစ်ကြောင်း အတင်းဖန်တီးရတဲ့ နေ့လည်ခင်း တစ်ခုလုံး ကုန်သွားပါတယ်။ Migration graph က Prisma 8 မှာ အဲဒါကို ရှောင်တဲ့ နည်းလမ်းပါ။

## ဘယ်အချိန်မှာ အရေးပါလဲ

Graph အကြောင်း မစဉ်းစားဘဲ app တစ်ခုလုံး တည်ဆောက်လို့ရပါတယ်။ History line တစ်ခုထက်ပို ရှိလာတဲ့ အခိုက်အတန့်မှာ ဒါက သူ့နေရာ ရလာပါတယ်:

- လူနှစ်ယောက် (ဒါမှမဟုတ် AI agent နှစ်ခု) က branch သီးခြားတွေပေါ်မှာ schema ကို ပြောင်းပြီး merge လုပ်တယ်။
- Database တစ်ခုကို အစောပိုင်း schema တစ်ခုဆီ ပြန်လှိမ့်ပြီး နောက်တစ်ခါ ရှေ့ပြန် ရွှေ့ဖို့ လိုတယ်။
- Database တစ်ခုက နောက်ကျနေတယ် (clone အသစ်၊ ကြာကြာ သုံးနေတဲ့ staging box) — ပြောင်းလဲမှုများစွာကို ဖြတ်ပြီး မီအောင် လိုက်ရမယ်။
- Environment တစ်ခုကို schema state တိကျတစ်ခုမှာ ညွှန်ပြပြီး review ထဲမှာ အဲဒီနေရာမှာ ရှိတယ်ဆိုတာ သက်သေပြချင်တယ်။

ဒါတွေထဲက တစ်ခုမှ မသက်ဆိုင်သေးရင် — [How migrations work](/docs/prisma/how-migrations-work) ကို ဖတ်ပြီး သက်ဆိုင်လာတဲ့အခါ ပြန်လာပါ။

## အကျဉ်းချုပ်

Prisma 8 က migrations တွေကို timestamp စီထားတဲ့ list တစ်ခုအနေနဲ့ မသတ်မှတ်ပါဘူး။ Migration တစ်ခုစီက သူ စတင်တဲ့ schema state နဲ့ သူ ထုတ်လုပ်တဲ့ schema state ကို မှတ်တမ်းတင်ပြီး — အဲဒီချိတ်ဆက်မှုတွေက graph တစ်ခု ဖွဲ့ပါတယ်။ Database တစ်ခုက အခု ရှိနေတဲ့နေရာကနေ သင်ရွှေ့ချင်တဲ့နေရာဆီ migration တွေကို လိုက်ပြီး graph ထဲမှာ ဖြတ်သန်းသွားပါတယ်။ Migration တိုင်းက folder ထဲက သူ့နေရာ ထက် — schema state အစစ်တွေနဲ့ ကျောက်ဆူးချထားလို့ — branches၊ merges နဲ့ rollbacks တွေက graph တစ်ခုတည်းရဲ့ လမ်းကြောင်းတွေ အားလုံး ဖြစ်နေပါတယ်။

> **သင်တကယ် လိုချင်တာက command သုံးခုပဲ ဖြစ်နိုင်တယ်**
>
> နေ့အများစုမှာ သင်က graph ကို တိုက်ရိုက် ထိစရာ မလိုပါဘူး။ ကြည့်ချင်ရင် `migration graph` run ပါ။ Database တစ်ခု ဘယ်မှာလဲ၊ ဘာတွေ pending လဲ စစ်ချင်ရင် `migration status` run ပါ။ Database တစ်ခုကို state တစ်ခုဆီ ရွှေ့ချင်ရင် `db migrate --to <ref>` run ပါ။ ဒီ page ရဲ့ ကျန်တာက အဲဒီ command တွေ ဘာပြနေလဲဆိုတာ ရှင်းပြတာပါ။

## ဒီ page မှာ သုံးတဲ့ ဝေါဟာရများ

| Term | အဓိပ္ပာယ် |
| --- | --- |
| **Contract** | သင်ရေးတဲ့ schema နဲ့ သူ compile လုပ်ထွက်တဲ့ `contract.json` artifact |
| **Contract state** | History ထဲက အချိန်တစ်ချိန်မှာ schema ရဲ့ ပုံသဏ္ဍာန် အတိအကျ တစ်ခု |
| **Hash** | Contract state တစ်ခုရဲ့ တိုတောင်းတဲ့ fingerprint — `sha256:705b1a6…` လိုမျိုး။ Git commit hash က သင့် file တွေရဲ့ state အတိအကျကို နာမည်ပေးသလိုပါပဲ |
| **Node** | Graph ထဲက contract state တစ်ခု — သူ့ hash နဲ့ ဖော်ထုတ်တယ် |
| **Edge** | Migration တစ်ခု။ Database ကို node တစ်ခုကနေ (`from`) နောက်တစ်ခုဆီ (`to`) ရွှေ့ပေးတယ် |
| **Marker** | Prisma 8 က database ထဲမှာ သိမ်းထားတဲ့ record — database က အခု ကိုက်ညီနေတဲ့ node တစ်ခုတည်းကို နာမည်ပေးတယ် |
| **Ref** | Node တစ်ခုအတွက် လူဖတ်လို့ရတဲ့ နာမည် — `prod` လိုမျိုး။ သင့် repo ထဲမှာ file တစ်ခုအနေနဲ့ သိမ်းထားတယ် |

## ဘယ်လို အလုပ်လုပ်လဲ

Contract ကို emit လုပ်တိုင်း — deterministic JSON artifact တစ်ခု ရပါတယ်။ အဲဒါကို hashing လုပ်တာက schema ပုံသဏ္ဍာန် အတိအကျအတွက် identifier တစ်ခု ထုတ်ပေးပါတယ်။ အဲဒီ hash တွေက graph ရဲ့ **nodes** တွေပါ။

Migration တစ်ခုက **edge** တစ်ခုပါ။ သူ စတင်တဲ့ (`from`) contract hash နဲ့ database ကို ရွှေ့သွားတဲ့ (`to`) hash ကို မှတ်တမ်းတင်ပါတယ်။ Migration တစ်ခုရဲ့ history ထဲက နေရာက သူ့ file name ကနေ ဘာမှ မလာပါဘူး: directory နာမည်ထဲက timestamps တွေက လူသားတွေ အတွက်ပါ — တကယ့် ချိတ်ဆက်မှုက migration တစ်ခုချင်းစီရဲ့ `migration.json` ထဲက `from`/`to` hash တွေထဲမှာ နေပါတယ်။

> **Animation: migration graph** — contract states (node တွေ) တွေကို migrations (edge တွေ) တွေက graph တစ်ခုအနေနဲ့ ဘယ်လို ချိတ်ဆက်ပေးလဲ သရုပ်ပြထားပါတယ်။

Database တစ်ခုက node တစ်ခုတည်းမှာ အမြဲ ထိုင်ပါတယ်။ သူ့ရဲ့ **marker** — Prisma 8 က database ထဲမှာပဲ သိမ်းထားတဲ့ record — က အခု ကိုက်ညီနေတဲ့ contract ရဲ့ hash ကို ကိုင်ထားပါတယ်။ Migration တစ်ခု apply လုပ်တာက edge တစ်ခုကို လျှောက်ပြီး marker ကို ရွှေ့လိုက်တာပါ။

## လက်တွေ့ ဥပမာ တစ်ခု

Alice-and-Bob အခြေအနေကို graph အစစ်တစ်ခုအနေနဲ့ ကြည့်ကြရအောင်။ Alice က `phone` ထည့်တယ်၊ Bob က `avatarUrl` ထည့်တယ်၊ branch နှစ်ခုလုံး merge ဖြစ်တယ်:

```bash
npx prisma@latest migration graph
```

```text
*     f9a41d7  (prod)
|-\
|^|   20260303T1000_merge_alice          93be6c2 -> f9a41d7  1 ops
| |^  20260303T1100_merge_bob            7e3fa7f -> f9a41d7  1 ops
* |   93be6c2
|^|   20260302T1000_alice_add_phone      705b1a6 -> 93be6c2  1 ops
| *   7e3fa7f
| |^  20260302T1100_bob_add_avatar_url   705b1a6 -> 7e3fa7f  1 ops
|-/
*     705b1a6
|^    20260301T1000_init                       - -> 705b1a6  1 ops
*     -

1 space(s), 5 contract(s), 5 migration(s)
```

အောက်ကနေ အပေါ်ကို ဖတ်ပါ။ Database အလွတ်တစ်ခုကနေ (`-`) `init` က state `705b1a6` ကို တည်ဆောက်ပါတယ်။ Alice ရော Bob ရော `705b1a6` ကနေ branch ခွဲပါတယ်: သူ့ migration က `93be6c2` ကို ထုတ်ပြီး — သူ့ဟာက `7e3fa7f` ကို ထုတ်ပါတယ်။ Branch တစ်ခုစီမှာ ပေါင်းစည်းထားတဲ့ state `f9a41d7` ဆီ ရောက်တဲ့ merge migration တစ်ခုစီ ရှိပြီး — `prod` ref က အဲဒါကို ညွှန်ပါတယ်။ ဒီပုံစံက diamond (စိန်ပုံသဏ္ဍာန်) ပါ: အစတစ်ခု၊ parallel branch နှစ်ခု၊ အဆုံးတစ်ခု အတူတူ။

အကျိုးခံစားမှုက နောက်ဆုံး column နဲ့ merge edge နှစ်ခုမှာပါ။ Alice ရဲ့ branch ကို လိုက်ခဲ့တဲ့ database တစ်ခုက `93be6c2` မှာ ရှိပြီး `merge_alice` ကနေတစ်ဆင့် `f9a41d7` ကို ရောက်ပါတယ်။ Bob ရဲ့ဟာကို လိုက်ခဲ့တဲ့ database တစ်ခုက `7e3fa7f` မှာ ရှိပြီး `merge_bob` ကို စီးပါတယ်။ Developer တစ်ယောက်မှ နောက်တစ်ယောက်ရဲ့ migration အကြောင်း သိစရာ မလိုခဲ့ပါဘူး — timestamps တွေ တန်းစီဖို့ file တစ်ခုမှ ပြန်နာမည် မပေးခဲ့ရပါဘူး။

(Summary line က contract *spaces* တွေကို ရေတွက်ပါတယ်: လွတ်လပ်တဲ့ migration lanes — သင့် app အတွက် တစ်ခု နဲ့ [database extension](https://www.prisma.io/docs/orm/migrations/applying-a-migration#extension-spaces) တစ်ခုချင်းစီအတွက် တစ်ခုပါ။)

## `db migrate` Run လုပ်တဲ့အခါ ဘာဖြစ်လဲ

`db migrate` run တဲ့အခါ — runner က သင့်အတွက် graph ကို လျှောက်ပေးပါတယ်:

1. Database ရဲ့ **marker** ကို ဖတ်ပြီး database က အခု ဘယ် node ပေါ်မှာလဲ ရှာပါတယ်။
2. သင့် target ကို ဖြေရှင်းပါတယ်: merged state၊ `prod` လို ref တစ်ခု၊ ဒါမှမဟုတ် `--to` မပေးရင် နောက်ဆုံး state။
3. Marker ကနေ target ဆီ edge တွေရဲ့ လမ်းကြောင်းတစ်ခု ရှာပါတယ်။
4. Edge တစ်ခုချင်းစီကို order အတိုင်း apply လုပ်ပြီး — တစ်ခုပြီးတိုင်း marker ကို ရွှေ့ပါတယ်။
5. Migration တစ်ခုခုရဲ့ precheck ကျရှုံးရင် — SQL run မလုပ်ခင် ရပ်ပြီး ကိုက်ညီမှု မရှိတာကို နာမည်ပေးပါတယ်။

Branch tip နှစ်ခုလုံး ရောက်လို့ရပြီး တစ်ခုမှ target ဆိုတာ ရှင်းရှင်းလင်းလင်း မရှိရင် — runner က မှန်းဆ မလုပ်ပါဘူး။ ရပ်ပြီး `--to` နဲ့ တစ်ခုကို ရွေးခိုင်းပါတယ်။

## Graph ကို စစ်ဆေးခြင်း

Read-only command လေးခု — တစ်ခုချင်းစီက မေးခွန်းတစ်ခုစီကို ဖြေပါတယ်:

| သင့်မှာ ရှိတဲ့ မေးခွန်း | Command | Database လိုလား? |
| --- | --- | --- |
| Topology တစ်ခုလုံး ဘယ်လိုပုံလဲ | `migration graph` | မလို |
| Disk ပေါ်မှာ migration directory တွေ ဘယ်ဟာတွေ ရှိလဲ | `migration list` | မလို |
| ငါ့ database ဘယ်မှာလဲ၊ ဘာတွေ pending လဲ | `migration status` | လို |
| တကယ် apply ဖြစ်ထားတာ ဘာတွေလဲ၊ ဘယ်အချိန်လဲ | `migration log` | လို |

`migration graph` က machine ဖတ်လို့ရတဲ့ output အတွက် `--json`၊ Graphviz နဲ့ render လုပ်ဖို့ `--dot` နဲ့ glyph တွေရဲ့ key ကို ရိုက်ထုတ်ဖို့ `--legend` တွေလည်း ယူပါတယ်။ `migration log` က runner က apply တိုင်း append လုပ်ထားတဲ့ **ledger** တစ်ခုကို ဖတ်ပါတယ် — ဒါကြောင့် rollback တစ်ခုတောင် ဖျက်လိုက်တဲ့ history အစား — history တစ်ခုအနေနဲ့ ပေါ်ပါတယ်။

### Real fixtures တွေနဲ့ စမ်းကြည့်ပါ

Prisma 8 repo က ဥပမာ graph တွေ (diamond၊ wide fan-out၊ converging branches၊ rollback chains) ကို render လုပ်ဖို့ အသင့်သုံးလို့ရတဲ့ fixtures တွေအနေနဲ့ တင်ပို့ပါတယ်:

```bash
git clone https://github.com/prisma/orm
cd prisma && pnpm install && pnpm -w build && pnpm install
cd examples/prisma-8-demo
npx prisma@latest migration graph --config fixtures/showcase/prisma.config.ts --legend
```

`showcase` ကို `diamond`၊ `wide-fan`၊ `converging-branches`၊ `multi-branch`၊ `long-spine` ဒါမှမဟုတ် `skip-rollback` နဲ့ လဲလိုက်ပြီး ပုံစံတစ်ခုချင်းစီကို စူးစမ်းပါ။

## အရေးကြီးတဲ့ State တွေကို Refs နဲ့ နာမည်ပေးပါ

Raw hash တွေက ရိုက်ရ ခက်ပြီး မှတ်မိဖို့လည်း မဖြစ်နိုင်ပါဘူး — ဒါကြောင့် အရေးကြီးတဲ့ state တွေကို နာမည်ပေးထားပါ။ **Ref** တစ်ခုက node တစ်ခုဆီ ညွှန်တဲ့ လူဖတ်လို့ရတဲ့ pointer ဖြစ်ပြီး — `migrations/app/refs/` ထဲမှာ file သေးသေးလေးတစ်ခုအနေနဲ့ သိမ်းကာ သင့် repo ထဲ commit လုပ်ထားပါတယ်:

```bash
npx prisma@latest migration ref set prod sha256:f9a41d7...
npx prisma@latest migration ref list
npx prisma@latest db migrate --to prod
```

Refs တွေကို commit လုပ်ထားလို့ — "production က ဘယ်မှာ ရှိသင့်လဲ" ဆိုတာက တစ်စုံတစ်ယောက်ရဲ့ terminal history ထဲက နှုတ်မှတ်ဉာဏ် အစား — pull request တစ်ခုထဲမှာ ပြန်လည်သုံးသပ်လို့ရတဲ့ အချက်အလက် ဖြစ်ပါတယ်။

Ref နာမည်တစ်ခုက အထူးပါ။ `db` လို့ခေါ်တဲ့ ref က `--from` မပေးဘဲ `migration plan` သုံးတဲ့အခါ ပုံမှန် စမှတ် ဖြစ်ပါတယ်။ `db migrate --advance-ref db` နဲ့ နောက်ဆုံး ဖြစ်အောင် ထားပါ — planning က သူ့ဘာသာ incremental ဖြစ်နေမှာပါ။

Reserved token နှစ်ခုလည်း — ref တစ်ခု သတ်မှတ်စရာမလိုဘဲ — contract reference လက်ခံတဲ့နေရာ ဘယ်မှာမဆို အလုပ်လုပ်ပါတယ်:

- `@contract`: သင်နောက်ဆုံး emit လုပ်ထားတဲ့ contract
- `@db`: ချိတ်ထားတဲ့ database ရဲ့ marker က ကိုင်ထားတဲ့ state ဘယ်ဟာဖြစ်ဖြစ်

## Graph က ဘာတွေ ပေးလဲ

### Ordering conflict (အစီအစဉ် ပဋိပက္ခ) မရှိဘဲ Parallel အလုပ်လုပ်ခြင်း

Alice ရော Bob ရော ကိုယ့် branch တွေပေါ်မှာ `705b1a6` ကနေ migration တစ်ခုစီ plan လုပ်ခဲ့ပါတယ်။ Timestamp-order စနစ်မှာ — ဒုတိယ merge လုပ်တဲ့သူက ပျက်နေတဲ့ history တစ်ခုကို အမွေရပါတယ်။ ဒီမှာတော့ edge နှစ်ခုလုံး graph ထဲမှာ ရှိပြီး environment တိုင်းက merged state ဆီ ကိုယ့်လမ်းကြောင်း ရှာပါတယ်။ "Developer နှစ်ယောက်" က migrations တွေကို တစ်ပြိုင်တည်း plan လုပ်နေတဲ့ AI agent နှစ်ခု ဖြစ်နေတဲ့အခါ — တစ်ယောက်က နောက်တစ်ယောက်အကြောင်း သိစရာ မလိုလို့ — ဒါက နှစ်ဆ အရေးပါပါတယ်။

### ယုံကြည်လို့ရတဲ့ History

Edge တစ်ခုစီက သူ့ရဲ့ `from` state ကို ကြေညာထားလို့ — migration တစ်ခုက ပုံစံမှားနေတဲ့ database တစ်ခုပေါ်မှာ run မဖြစ်ပါဘူး။ Marker က မကိုက်ညီရင် — SQL ဘာမှ execute မလုပ်ခင် run က ရပ်သွားပြီး ကိုက်ညီမှု မရှိတာကို နာမည်ပေးတဲ့ error တစ်ခု ထွက်ပါတယ်။

### Rollback က သာမန် လှုပ်ရှားမှုတစ်ခုပါ

Edge တစ်ခုက နောက်ပြန် ညွှန်လို့ရပါတယ် — နောက်ကျတဲ့ contract state တစ်ခုကနေ အစောပိုင်းတစ်ခုဆီ။ Rollback ဆိုတာ အထူးမုဒ် မဟုတ်ပါဘူး: သင်ရောက်ဖူးပြီးသား state တစ်ခုကို ဦးတည်တဲ့ migration တစ်ခု ထပ် plan လုပ်တာပါ။ [Rollbacks and recovery](https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery) ကို ကြည့်ပါ။

### History ပုံစံ တစ်ခုထက်မက

Graph က သင့် workflow က ထုတ်သမျှ ပုံစံတွေကို လိုက်လျောပါတယ်: ရှည်လျားတဲ့ linear spines တွေ၊ node တစ်ခုကနေ branch များစွာ ထွက်တဲ့ wide fan-outs တွေ၊ ပြန်ဆုံတဲ့ diamonds တွေ၊ state အများကြီးကို hop တစ်ချက်တည်းနဲ့ ခုန်ကျော်တဲ့ fast-forward edges တွေအထိပါ။

## Database အလိုက် အသေးစိတ်

Graph model က database family တိုင်းမှာ တူညီပါတယ်: node တွေ အတူတူ၊ edge တွေ အတူတူ၊ command တွေ အတူတူပါပဲ။ ကွဲပြားတာက marker နဲ့ ledger ကို သိမ်းတဲ့နေရာတွေပါ။

- **PostgreSQL**: marker က `prisma_contract.marker` table ထဲမှာ နေပြီး — apply တစ်ခုစီက advisory lock တစ်ခုနဲ့ ကာထားတဲ့ transaction ထဲမှာ run လို့ — runner နှစ်ခုက database တစ်ခုတည်းကို တစ်ပြိုင်တည်း ရွှေ့လို့ မရပါဘူး။
- **MongoDB**: marker နဲ့ ledger တွေက `_prisma_migrations` collection ထဲမှာ နေပြီး — compare-and-swap နဲ့ update လုပ်လို့ — concurrent apply တစ်ခုက interleave ဖြစ်တာထက် ငြင်းပယ်ခံရပါတယ်။

## Release-candidate ကန့်သတ်ချက်များ

Graph၊ pathfinding၊ refs နဲ့ marker/ledger model တွေက ဒီနေ့ အလုပ်လုပ်ပါတယ်။ သင်လက်လှမ်းမှီချင်နိုင်တဲ့ အချို့အရာတွေက မရှိသေးပါဘူး:

- **Squash မရှိသေး။** Migration တွေရဲ့ ရှည်လျားတဲ့ chain တစ်ခုကို တစ်ခုတည်းအဖြစ် ပြိုကျအောင် မလုပ်နိုင်သေးပါဘူး။ Chain က မူလအတိုင်း နေပါတယ်။
- **Baseline မရှိသေး။** ရှိပြီးသား database တစ်ခုရဲ့ history ကို ပြန်ဖွင့်စရာမလိုဘဲ — starting node အဖြစ် လက်ခံလို့ မရသေးပါဘူး။
- **Split မရှိသေး။** Migration ကြီးတစ်ခုကို ဖြစ်ပြီးမှ အပိုင်းငယ်တွေ ခွဲလို့ မရသေးပါဘူး။
- **Target မရေရာရင် ရွေးချယ်မှု လိုပါတယ်။** Branch tip နှစ်ခုလုံး ရောက်လို့ရတဲ့အခါ — `db migrate` က မှန်းဆတာထက် `--to` နဲ့ တစ်ခုကို ရွေးခိုင်းပါတယ်။

Graph က ဒါတွေကို စိတ်ထဲ ထားပြီး ဒီဇိုင်းထုတ်ထားပါတယ်; command တွေက မပို့ရသေးပါဘူး။ Migration page တစ်ခုချင်းစီက ဖုံးကွယ်မထားဘဲ — ဘာတွေ မရှိသေးလဲ ထောက်ပြပါတယ်။

## အသုံးများတဲ့ အလုပ်များ

| အလုပ် | Command |
| --- | --- |
| Graph တစ်ခုလုံး ကြည့်ခြင်း | `migration graph` |
| Database တစ်ခု ဘယ်မှာလဲ စစ်ခြင်း | `migration status` |
| Database တစ်ခုကို အမည်ရှိ state တစ်ခုဆီ ရွှေ့ခြင်း | `db migrate --to prod` |
| လက်ရှိ state ကို `prod` လို့ နာမည်ပေးခြင်း | `ref set prod @db` |
| နာမည်ပေးထားတဲ့ refs တွေ စာရင်းပြခြင်း | `ref list` |
| Database တစ်ခုကို state တစ်ခု နောက်ပြန် လှိမ့်ခြင်း | `db migrate --to <earlier-ref-or-hash>` |
| Migration file တွေနဲ့ graph ရဲ့ သမာဓိ စစ်ဆေးခြင်း | `migration check` |

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ်။ Agent ကို ဒီလို တောင်းဆိုပါ:

- "ဒီ project အတွက် migration graph ဆွဲပြီး branch တွေကို ရှင်းပြပေးပါ။"
- "`prod` ref က ဘယ် contract state ကို ညွှန်နေလဲ၊ database က အဲဒီကို ရောက်ပြီးပြီလား?"
- "Feature branch နှစ်ခုလုံး migrations တွေ ထည့်ထားတယ်။ သူတို့ conflict ဖြစ်မဖြစ် စစ်ပေးပါ။"

## ဆက်စပ်ဖတ်ရန်

- [How migrations work](/docs/prisma/how-migrations-work) — plan-review-apply loop (plan လုပ်ခြင်း၊ သုံးသပ်ခြင်း၊ apply လုပ်ခြင်း)
- [Applying a migration](/docs/prisma/applying-a-migration) — runner က graph ကို ဘယ်လို လျှောက်လဲ
- [Studio with Prisma 8](https://www.prisma.io/docs/studio/prisma-next) — တူညီတဲ့ ledger ကို Prisma Studio မှာ visual အနေနဲ့ ဖတ်ပါ — migration တစ်ခုချင်းစီအတွက် contract edge တစ်ခုစီ
- [Rollbacks and recovery](https://www.prisma.io/docs/orm/migrations/rollbacks-and-recovery) — နောက်ပြန် edges တွေ လက်တွေ့မှာ
- [Generating a migration](/docs/prisma/generating-a-migration) — contract ပြောင်းလဲမှုတစ်ခုကို migration plan command နဲ့ ပြန်လည်သုံးသပ်လို့ရတဲ့ migration အဖြစ် ပြောင်းခြင်း
- [Editing a migration](https://www.prisma.io/docs/orm/migrations/editing-a-migration) — migration က သင်ပိုင်တဲ့ TypeScript ပါ — backfills တွေ ဖြည့်ပါ၊ step တွေ ပြန်စီပါ၊ ဒါမှမဟုတ် raw SQL ချသုံးပြီး command တစ်ခုနဲ့ ပြန် compile လုပ်ပါ
