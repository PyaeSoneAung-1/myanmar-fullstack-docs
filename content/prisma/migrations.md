---
title: "Migrations"
description: "Prisma Migrate နဲ့ database schema ကို version လိုက် စီမံခြင်း — migrate dev, migrate deploy, migrate diff, db push, migration file တွေရဲ့ ဖွဲ့စည်းပုံ နဲ့ အလုပ်လုပ်ပုံ"
order: 5
source: "https://www.prisma.io/docs/orm/prisma-migrate"
status: translated
updated: 2026-09-01
---

## Migration ဆိုတာ ဘာလဲ

**Migration** ဆိုတာ — Prisma schema ပြောင်းလဲမှုတိုင်းကို SQL file တွေအနေနဲ့ မှတ်တမ်းတင်ပြီး database schema ကို Prisma schema နဲ့ sync ဖြစ်နေအောင် ထားပေးတဲ့ စနစ်ပါ။ ဒါက database schema အတွက် version control လို့ တွေးကြည့်လို့ရပါတယ် — ဘယ်အချိန်မှာ ဘာပြောင်းခဲ့လဲ ဆိုတာ ပြန်ကြည့်လို့ရပြီး၊ ရှိပြီးသား data တွေကိုလည်း မပျက်စီးအောင် ထိန်းပေးပါတယ်။ Prisma Migrate က hybrid tool တစ်ခုပါ — Prisma schema ကနေ SQL migration file တွေကို အလိုအလျောက် generate လုပ်ပေးပြီး (declarative)၊ လိုအပ်ရင် အဲဒီ file တွေကို ကိုယ်တိုင် ပြင်ဆင်လို့လည်း ရပါတယ် (imperative)။

## Migration files တွေရဲ့ ဖွဲ့စည်းပုံ

Migration တစ်ခုချင်းစီက `prisma/migrations` folder ထဲမှာ — folder တစ်ခုနဲ့ ၎င်းထဲက `migration.sql` file အနေနဲ့ သိမ်းပါတယ်:

```
migrations/
  └─ 20210313140442_init/
    └─ migration.sql
  └─ 20210313140442_added_job_title/
    └─ migration.sql
```

ဒီ `migrations` folder တစ်ခုလုံးကို source control (Git) ထဲ အမြဲ commit ရပါမယ် — `migrate deploy` က production ကို ပြောင်းလဲမှုတွေ သက်ရောက်စေတာ ဒီ file တွေကနေပဲ ဖြစ်လို့ပါ။ Database ထဲမှာလည်း `_prisma_migrations` ဆိုတဲ့ table နဲ့ ဘယ် migration တွေ run ပြီးသားလဲ ဆိုတာ ခြေရာခံပါတယ်။

## Development — migrate dev

Development environment မှာ `migrate dev` ကို သုံးပါတယ်။ ဒီ command က — shadow database နဲ့ migration history နဲ့ schema အကြား drift (ကွဲလွဲမှု) ရှိမရှိ စစ်၊ pending migration တွေ run၊ Prisma schema ပြောင်းထားရင် migration အသစ် generate လုပ်ပြီး apply လုပ်၊ နောက်ဆုံး Prisma Client ကိုပါ ပြန် generate လုပ်ပေးပါတယ်:

```bash
npx prisma migrate dev --name init
npx prisma migrate dev --name added-profile
```

`--name` နဲ့ migration တစ်ခုချင်းစီကို နာမည်ပေးပါတယ်။ ဒီ command က development အတွက်သာ ဖြစ်ပြီး — production မှာ ဘယ်တော့မှ မသုံးရပါဘူး။

## Production — migrate deploy

Production ဒါမှမဟုတ် testing environment မှာတော့ `migrate deploy` ကို သုံးပါတယ် — ပုံမှန်အားဖြင့် CI/CD pipeline ထဲမှာ အလိုအလျောက် run လေ့ရှိပါတယ်:

```bash
npx prisma migrate deploy
```

ဒီ command က pending ဖြစ်နေတဲ့ migration တွေကိုပဲ apply လုပ်ပါတယ် — database ကို reset လုပ်တာ၊ Prisma Client ကို generate လုပ်တာ၊ shadow database သုံးတာ ဘာမှ မလုပ်ပါဘူး။

## migrate diff နဲ့ db push

`migrate diff` က schema source နှစ်ခုကို ယှဉ်ပြီး — ပထမ state ကနေ ဒုတိယ state ကို ရောက်ဖို့ လိုအပ်တဲ့ SQL script ကို ထုတ်ပေးပါတယ်။ Migration မဖန်တီးခင် ဘာတွေ ပြောင်းမယ်ဆိုတာ ကြိုကြည့်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။ `db push` ကတော့ migration file တွေ မဖန်တီးဘဲ — Prisma schema ကို database ပေါ် တိုက်ရိုက် sync လုပ်ပေးပါတယ်။ Prototyping (အမြန် စမ်းသပ်ချင်တဲ့အခါ) အတွက် သင့်တော်ပြီး — data ဆုံးရှုံးနိုင်တဲ့ ပြောင်းလဲမှုဆိုရင် `--accept-data-loss` flag ပါမှ လုပ်ပေးပါတယ်။ စမ်းသပ်မှုတွေ အကုန် ရှင်းပြီး အစကနေ ပြန်စချင်ရင်တော့ `migrate reset` ကို သုံးပါတယ် — database ကို ဖျက်ပြီး အသစ်ပြန်ဆောက်၊ migration တွေ အကုန် ပြန် run ပြီး seed script တွေကိုပါ run ပေးပါတယ်:

```bash
npx prisma migrate diff --from-schema=schema.prisma --to-config-datasource --script
npx prisma db push
npx prisma migrate reset
```

## အလုပ်လုပ်ပုံ — Common workflow

ပုံမှန် workflow ကတော့ ဒီလိုပါ — schema ကို ပြင်တယ် → `npx prisma migrate dev --name <migration-name>` run တယ် → ဖြစ်လာတဲ့ migration file တွေကို Git မှာ commit တယ် → production မှာ `migrate deploy` run တယ်။ ဒါတွေ အားလုံးက relational database (PostgreSQL, MySQL, SQLite စသည်) အတွက် ဖြစ်ပြီး — MongoDB သုံးနေရင်တော့ `migrate dev` အစား `db push` ကို သုံးရမှာ သတိပြုပါ။ Prisma schema ရေးနည်းကို ပြန်ကြည့်ချင်ရင် [Prisma Schema ရေးနည်း](/docs/prisma/schema) မှာ ရှိပြီး၊ client ကို သတ်မှတ်ပုံက [Prisma Client အသုံးပြုခြင်း](/docs/prisma/prisma-client) မှာ ဖတ်နိုင်ပါတယ်။
