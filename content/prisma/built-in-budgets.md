---
title: "Built-in: Budgets — Row နဲ့ Latency ဘတ်ဂျက် Middleware"
description: "Query တိုင်းရဲ့ ကုန်ကျစရိတ်ကို မျက်နှာကျက် သတ်ပေးတဲ့ budgets middleware — ခွင့်ပြုထားတာထက် rows ပိုဖတ်မယ့် queries တွေကို reject/warn လုပ်ခြင်း၊ stream လာတဲ့ rows တွေ ရေတွက်ခြင်း၊ latency ကျော်တဲ့ queries တွေကို အစီရင်ခံခြင်း — options နဲ့ error codes အသေးစိတ်"
order: 33
source: "https://www.prisma.io/docs/orm/middleware/built-in-budgets"
status: translated
updated: 2026-09-02
---

`budgets` middleware က query တိုင်းပေါ်မှာ cost ceiling (ကုန်ကျစရိတ် မျက်နှာကျက်) တစ်ခု တင်ပေးပါတယ်: သင် ခွင့်ပြုထားတာထက် rows ပိုဖတ်မယ့် queries တွေကို reject ဒါမှမဟုတ် warn လုပ်တယ်၊ rows တွေ stream လာတုန်း ရေတွက်တယ်၊ ပြီးတော့ သင့် latency budget ထက် ကြာကြာ run တဲ့ queries တွေကို အစီရင်ခံပါတယ်။

Runtime ပေါ်မှာ သင် အတင်းအကျပ် လုပ်ချင်တဲ့ row နဲ့ latency limits တွေနဲ့ register လုပ်ပါ:

```ts title="src/prisma/db.ts"
import postgres from '@prisma/orm-postgres/runtime';
import { budgets } from '@prisma/orm-postgres/family-runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [
    budgets({
      maxRows: 10_000,
      defaultTableRows: 10_000,
      tableRows: { user: 10_000, post: 10_000 },
      maxLatencyMs: 1_000,
    }),
  ],
});
```

`budgets` က SQL-family middleware ပါ (`familyId: 'sql'` ကို ကြေညာထားလို့) — PostgreSQL runtimes တွေပေါ်မှာ register လုပ်လို့ရပါတယ်။ ဒါက `@prisma/orm-postgres/family-runtime` နဲ့အတူ ပါလာပြီး — `@prisma/orm-postgres` ကနေ တစ်ဆင့် ရောက်လာတာမို့ ဘာမှ အပို install လုပ်စရာ မလိုပါဘူး။

## Options

Option တွေ အားလုံး optional ပါ။

| Option | Type | Default | ဘာကို ထိန်းချုပ်လဲ |
| --- | --- | --- | --- |
| `maxRows` | `number` | `10_000` | Query တစ်ခုတည်း ထုတ်လို့ရတဲ့ အများဆုံး rows — execution မတိုင်ခင် ခန့်မှန်းချက်ရော တကယ် လေ့လာတွေ့ရတဲ့ row stream ရောက စစ်ဆေးပါတယ် |
| `defaultTableRows` | `number` | `10_000` | `tableRows` ထဲမှာ မပါတဲ့ tables တွေအတွက် ယူဆတဲ့ row count — estimator က သုံးပါတယ် |
| `tableRows` | `Record<string, number>` | `{}` | Estimator အတွက် table အလိုက် row-count ယူဆချက်တွေ — table name နဲ့ key လုပ်ထား |
| `maxLatencyMs` | `number` | `1_000` | Query တစ်ခုအတွက် latency budget — execution ပြီးမှ စစ်ဆေးပါတယ် |
| `severities.rowCount` | `'warn' \| 'error'` | `'error'` | Execution မတိုင်ခင် row-budget ချိုးဖောက်မှုတွေက query ကို block လုပ်လား ဒါမှမဟုတ် permissive mode မှာ warning log လုပ်လား။ Strict mode က အမြဲ block လုပ်ပါတယ် |
| `severities.latency` | `'warn' \| 'error'` | (none) | Options type က လက်ခံပေမယ့် v0.14 မှာ middleware က ဖတ်မသုံးပါဘူး; latency အပြုအမူက runtime mode အတိုင်း ဖြစ်ပါတယ် (အောက်မှာ ကြည့်ပါ) |

Runtime က default အားဖြင့် strict mode ပါ။ Strict mode မှာ over-budget latency က `BUDGET.TIME_EXCEEDED` ကို throw လုပ်ပြီး — permissive mode မှာတော့ အလားတူ event ကို warning အနေနဲ့ log လုပ်ပါတယ်။ Latency check က execution ပြီးမှ လုပ်တာမို့ — cancellation mechanism မဟုတ်ဘဲ visibility tool တစ်ခုပါ။ v0.14 မှာ `severities.latency` ကို သတ်မှတ်ပေးတာက ဒါကို မပြောင်းပါဘူး: key က options type ပေါ်မှာ ရှိပေမယ့် middleware က မကြည့်ရသေးပါဘူး။

## Budget ကို ဘယ်လို အတင်းအကျပ် လုပ်လဲ

Middleware က query lifecycle ထဲက နေရာ သုံးခုမှာ စစ်ဆေးပါတယ်:

1. **Execution မတိုင်ခင်** — query plan ရဲ့ AST ကို စစ်ပါတယ်။ `LIMIT` မပါတဲ့ `SELECT` တစ်ခု (ရလဒ်ကို ချုံ့ပေးတဲ့ aggregation မပါဘဲ) ကို unbounded အနေနဲ့ သတ်မှတ်ပြီး — estimated rows က `maxRows` ထက် ကျော်တဲ့ bounded query က over budget ပါ။ Estimate က `tableRows` နဲ့ `defaultTableRows` ကနေ လာလို့ အဲဒါတွေကို သင့် data နဲ့ ကိုက်အောင် ချိန်ပါ။ ချိုးဖောက်မှုတွေက driver run မလည်ခင် `BUDGET.ROWS_EXCEEDED` ကို ပေါ်စေပြီး — `severities.rowCount` ကို `'warn'` ထားထားရင် permissive mode မှာ warn လုပ်ပါတယ်။
2. **Rows တွေ stream လာနေစဉ်** — database က တကယ် ပြန်ပေးတဲ့ rows တွေကို ရေတွက်ပါတယ်။ လေ့လာတွေ့ရတဲ့ count က `maxRows` ကို ကျော်သွားရင် `BUDGET.ROWS_EXCEEDED` ကို throw လုပ်ပြီး stream ကို ရပ်လိုက်ပါတယ် — estimate မှားသွားတဲ့အခါ သင့်ကို ကာကွယ်ပေးတာပါ။
3. **Execution ပြီးနောက်** — တိုင်းတာထားတဲ့ `latencyMs` ကို `maxLatencyMs` နဲ့ ယှဉ်ပြီး query က ကြာကြာ run သွားရင် `BUDGET.TIME_EXCEEDED` ကို အစီရင်ခံပါတယ်။ ဒီ check က အလုပ် ပြီးသွားမှ လုပ်တာမို့ — နှေးတဲ့ query ကိုယ်တိုင်ကို မကယ်တင်နိုင်ပေမယ့် — နှေးတဲ့ queries တွေ မမြင်ရဘဲ မနေအောင် ကျယ်ကျယ်လောင်လောင် ဖြစ်စေဖို့ ရည်ရွယ်ပါတယ်။

## Budget တစ်ခု ချိုးဖောက်ခံရရင် ဘာတွေ မြင်ရလဲ

Block လုပ်ခံရတဲ့ query တစ်ခုက budget code နဲ့ အသေးစိတ် အချက်အလက်တွေ ပါတဲ့ runtime error နဲ့ ငြင်းပယ်ခံရပါတယ်:

```text title="Row budget error"
BUDGET.ROWS_EXCEEDED: Unbounded SELECT query exceeds budget
  { source: 'ast', maxRows: 10000 }
```

`source` field က ချိုးဖောက်မှုက ဘယ်ကလဲ ပြောပြပါတယ် — execution မတိုင်ခင် estimate (`'ast'`) လား ဒါမှမဟုတ် လေ့လာတွေ့ရတဲ့ row stream (`'observed'`) လားဆိုတာပါ။ Strict mode မှာ latency ချိုးဖောက်မှုတွေက တိုင်းတာထားတဲ့ တန်ဖိုးနဲ့ ခွင့်ပြုထားတဲ့ တန်ဖိုး နှစ်ခုလုံးကို သယ်ဆောင်ပါတယ်:

```text title="Latency budget error"
BUDGET.TIME_EXCEEDED: Query latency exceeds budget
  { latencyMs: 2481, maxLatencyMs: 1000 }
```

Permissive mode မှာတော့ အချက်အလက် တစ်ခုတည်းကို runtime logger ကနေ warning အနေနဲ့ ထုတ်လွှင့်ပါတယ်။ Unbounded-select ချိုးဖောက်မှုကို ပြင်ဖို့ — query ကို limit တစ်ခု ထည့်ပါ ([ORM API ပေါ်က `take(...)`](https://www.prisma.io/docs/orm/fundamentals/reading-data#sort-and-paginate)၊ SQL query builder ပေါ်က `.limit(...)`) ဒါမှမဟုတ် budget ကို ရည်ရွယ်ချက်ရှိရှိ မြှင့်ပါ။

## အဖြစ်များတဲ့ မှားတတ်မှုများ

> **Warning — execution မတိုင်ခင် row check က live table statistics မဟုတ်ဘဲ `tableRows` နဲ့ `defaultTableRows` ကနေ ခန့်မှန်းပါတယ်**
>
> သင့် တကယ့် tables တွေက configure လုပ်ထားတဲ့ ယူဆချက်တွေထက် အများကြီး ကြီးနေရင် — query တစ်ခုက estimate ကို ကျော်ဖြတ်ပြီး stream အလယ်မှာ observed-row limit ကို ထိသွားနိုင်ပါတယ်။ သင် အများဆုံး query လုပ်တဲ့ tables တွေအတွက် `tableRows` ကို အကြမ်းဖျင်း မှန်အောင် ထားပါ။

## ဆက်စပ်ဖတ်ရန်

- [How middleware works](/docs/prisma/how-middleware-works) — သင့် hooks တွေ ချိတ်ဆက်ဝင်တဲ့ lifecycle
- [Built-in: lints](https://www.prisma.io/docs/orm/middleware/built-in-lints) — budgets ကို ဖြည့်စွက်ပေးတဲ့ structural query checks
- [Authoring custom middleware](/docs/prisma/authoring-custom-middleware) — ကိုယ်ပိုင် Prisma 8 middleware တစ်ခုကို step by step တည်ဆောက်ခြင်း
