---
title: "ထောက်ပံ့ထားတဲ့ Database များ (Supported databases)"
description: "Prisma ORM 8 က ဒီနေ့အထိ ဘယ် database တွေကို ထောက်ပံ့သလဲ၊ တစ်ခုချင်းစီမှာ ဘာတွေ ရသလဲ၊ ဘယ် hosted provider တွေ အလုပ်လုပ်သလဲနဲ့ နောက်ထပ် ဘာတွေ လာမလဲ"
order: 37
source: "https://www.prisma.io/docs/orm/supported-databases"
status: translated
updated: 2026-11-06
---

ဒီနေ့အထိ Prisma ORM 8 က ဘယ် database တွေကို ထောက်ပံ့ပေးသလဲ၊ တစ်ခုချင်းစီက ဘာတွေ ရသလဲ၊ ဘယ် hosted provider တွေ အလုပ်လုပ်သလဲ၊ ပြီးတော့ နောက်ထပ် ဘယ် database တွေ လာမလဲဆိုတာကို ဒီ page မှာ ကြည့်ရှုနိုင်ပါတယ်။

Prisma ORM 8 မှာ database တစ်ခုကို library တစ်ခုနဲ့ တွဲထားပါတယ်။ ကိုယ့် database နဲ့ ကိုက်ညီတဲ့ library ကို install လုပ်လိုက်တာနဲ့ config၊ client၊ contract authoring နဲ့ migrations အားလုံး ပါလာပါတယ်။ လက်ရှိမှာ တည်ဆောက်လို့ရတဲ့ နှစ်ခု၊ experimental အနေနဲ့ တတိယတစ်ခု၊ ပြီးတော့ စတုတ္ထတစ်ခုရဲ့ early preview တစ်ခု ရှိပါတယ်။

| Database | Status | Library | Install |
| --- | --- | --- | --- |
| PostgreSQL၊ Prisma Postgres အပါအဝင် | Release candidate | `@prisma/orm-postgres` | `npm install @prisma/orm-postgres` |
| MongoDB | Early access | `@prisma/orm-mongo` | `npm install @prisma/orm-mongo` |
| MySQL | Early preview၊ migrations နဲ့ reads | `@prisma/orm-mysql` | `npm install @prisma/orm-mysql` |
| MariaDB | မကြာမီ လာမည် |  |  |
| SQLite | Experimental | `@prisma/orm-sqlite` | `npm install @prisma/orm-sqlite` |
| Microsoft SQL Server | မကြာမီ လာမည် |  |  |
| CockroachDB | မကြာမီ လာမည် |  |  |

`npm create prisma@latest -- my-app` က ဘယ် database ကို သုံးသလဲ မေးပြီး ကိုက်ညီတဲ့ library ကို install ပေးပါတယ်။ [PostgreSQL နဲ့ app အသစ်တစ်ခု ဖန်တီးခြင်း](/docs/prisma/quickstart-postgresql) ဒါမှမဟုတ် [MongoDB နဲ့ app အသစ်တစ်ခု ဖန်တီးခြင်း](/docs/prisma/quickstart-mongodb) ကို ကြည့်ပါ။

## Label တွေရဲ့ အဓိပ္ပာယ် (What the labels mean)

**Release candidate။** ဒီနေ့ပဲ install လုပ်ပြီး တည်ဆောက်လို့ ရပါပြီ။ နောက်ဆုံး release မထွက်ခင် API အသေးစိတ်တချို့ ပြောင်းလဲနိုင်သေးတာမို့ — အခု ရေးလိုက်တဲ့ code တွေကို နောက်ပိုင်း ပြင်လိုက်ရတာ အနည်းငယ် ရှိနိုင်ပါတယ်။ Release candidate တစ်ခုစီက ယခင်တစ်ခုမှာ တွေ့ရတဲ့ bug တွေကို ပြင်ပေးပါတယ်။ ရက်စွဲတွေနဲ့ `npm install` က ဘာပေးသလဲဆိုတာကို [Release status](/docs/prisma/release-status) မှာ ကြည့်ပါ။

**Early access။** Library က အလုပ်လုပ်ပါတယ်၊ တည်ဆောက်လို့လည်း ရပါတယ် — ဒါပေမယ့် PostgreSQL library က လုပ်ပေးတဲ့ တချို့အရာတွေ မရသေးပါဘူး။ အောက်က table နဲ့ reference page တွေက MongoDB ပေါ်မှာ ဘာတွေ အလုပ်လုပ်သလဲ ဖော်ပြပြီး — [ဘာတွေ မရသေးသလဲ](/docs/prisma/coming-from-prisma-orm-7) ဆိုတာကို ကွက်လပ်တွေအနေနဲ့ စာရင်းပြုထားပါတယ်။ ကြုံတွေ့ရတာတွေကို [GitHub](https://github.com/prisma/orm/issues) မှာ report လုပ်ပါ။

**Experimental။** SQLite ကို experimental package အနေနဲ့ [`@prisma/orm-sqlite`](https://www.prisma.io/extensions/sqlite) အဖြစ် ထုတ်ထားပြီး quickstart မရှိသေးပါဘူး။ `db.transaction(...)` က PostgreSQL ပေါ်မှာလိုပဲ အတူတူ အလုပ်လုပ်ပါတယ်။

**Early preview။** MySQL ကို စမ်းကြည့်လို့ရအောင် `@prisma/orm-mysql` အနေနဲ့ ထုတ်ထားပါတယ်။ သင့် app က MySQL ကနေ ORM နဲ့ SQL builder ကို သုံးပြီး ဖတ်နိုင်ပါတယ် — nested နဲ့ ordered includes တွေပါ အပါအဝင်ပါ။ ဒါက `@prisma/orm-mysql/runtime` ကနေ `mysql({ contract, url })` နဲ့ `@prisma/orm-mysql/static` ကနေ `contractFromJson` ကို သုံးတာပါ။ Raw SQL နဲ့ `db.transaction(...)` ကိုလည်း run နိုင်ပါတယ်။ ဒါပေမယ့် ORM ဒါမှမဟုတ် SQL builder ကနေ row တွေ ရေးတာနဲ့၊ `FOR UPDATE` လို row lock တွေနဲ့ `LATERAL` join တွေကိုတော့ MySQL မှာ မထောက်ပံ့သေးဘူးဆိုတဲ့ message နဲ့ ငြင်းပယ်ပါတယ်။ Statement တစ်ခုချင်းစီကို run ပေးတဲ့ `mariadb` package က value တွေကို သူ့ရဲ့ escaping နည်းနဲ့ statement ထဲ ရေးထည့်တာမို့ — Prisma ရဲ့ code က value တစ်ခုကို SQL ထဲ ဘယ်တော့မှ မထည့်ပါဘူး။ `prisma.config.ts` ထဲမှာ `@prisma/orm-mysql/config` ကနေ `defineConfig` ကို သုံးထားရင် `npx prisma contract emit`၊ `migration plan`၊ `db migrate`၊ `db verify` နဲ့ `db sign` တို့က MySQL 8.4 ပေါ်မှာ table၊ column၊ index၊ unique constraint နဲ့ foreign key တွေ ဖန်တီးတာ၊ ဖျက်တာအတွက် အလုပ်လုပ်ပါတယ်။ ကျန်တဲ့ schema အပြောင်းအလဲတွေကိုတော့ MySQL မှာ မထောက်ပံ့သေးဘူးဆိုတဲ့ message နဲ့ ငြင်းပယ်ပါတယ်။ [`prisma-8-demo-mysql` နမူနာ](https://github.com/prisma/orm/tree/v8.0.0-rc.22/examples/prisma-8-demo-mysql) က workflow တစ်ခုလုံးကို ပြပေးပါတယ်။ MySQL က schema အပြောင်းအလဲကို roll back လုပ်လို့ မရတာမို့ — migration တစ်ခု ကျရှုံးရင် ကျရှုံးတဲ့အထိ run ပြီးသား operation တွေက အဲဒီအတိုင်း apply ဖြစ်နေပါတယ် (MongoDB ပေါ်မှာလိုပါပဲ)။ `db migrate` ကို ပြန် run လိုက်ရင် ကျန်တာတွေ ပြီးသွားပါလိမ့်မယ်။

**မကြာမီ လာမည်။** အဲဒီ database အတွက် Prisma ORM 8 library မရှိသေးပါဘူး။ Prisma ORM 7 က ထောက်ပံ့ပေးပြီး — Prisma ORM 8 general availability ရောက်ပြီးနောက် 18 လအထိ bug fix နဲ့ security update တွေ ဆက်ရနေပါမယ်။ Version ကို ဘယ်လို lock လုပ်မလဲဆိုတာကို [Prisma ORM 7 ပေါ်မှာ ဆက်နေနည်း](/docs/prisma/release-status) မှာ ကြည့်ပါ။

## Database တစ်ခုချင်းစီက ဘာတွေ ထောက်ပံ့သလဲ (What each database supports)

ORM client က database နှစ်ခုစလုံးပေါ်မှာ အတူတူ အလုပ်လုပ်ပါတယ်။ အောက်ခြေ layer က query API တွေကတော့ database ရဲ့ ကိုယ်ပိုင် query model အတိုင်း လိုက်ပါတယ်။

| Feature | PostgreSQL | MongoDB |
| --- | --- | --- |
| [ORM client](https://www.prisma.io/docs/orm/reference/orm-client) | ရပါတယ် | ရပါတယ် |
| [SQL query builder](https://www.prisma.io/docs/orm/reference/sql-query-builder) | ရပါတယ် | မရပါဘူး |
| [Pipeline builder](https://www.prisma.io/docs/orm/reference/pipeline-builder) | မရပါဘူး | ရပါတယ် |
| [Raw queries](https://www.prisma.io/docs/orm/reference/raw-queries) | Raw SQL | Raw commands |
| [Transactions](https://www.prisma.io/docs/orm/fundamentals/transactions) | ရပါတယ် | အခုထိ မရသေးပါ |
| [Migrations](https://www.prisma.io/docs/orm/migrations/how-migrations-work) | ရပါတယ် | ရပါတယ် |
| [Extensions](/docs/prisma/extensions) (pgvector, PostGIS, ParadeDB စသည်) | ရပါတယ် | အခုထိ မရသေးပါ |
| [Middleware](https://www.prisma.io/docs/orm/middleware/how-middleware-works) | ရပါတယ် | ရပါတယ်၊ `beforeCompile` ကလွဲပြီး |

`db.transaction()` က PostgreSQL client ပေါ်မှာပဲ ရှိပါတယ် — ဘာလို့လဲဆိုတော့ Prisma ORM က MongoDB transaction တွေကို အခုထိ မထောက်ပံ့သေးလို့ပါ။ MongoDB ပေါ်မှာ document အများအပြားကို ရေးတဲ့အခါ client နဲ့အတူ [MongoDB driver ရဲ့ session API ကို သုံးပါ](https://www.prisma.io/docs/orm/fundamentals/transactions#transactions-on-mongodb)။

`beforeCompile` ကလွဲရင် middleware hook တွေက database နှစ်ခုစလုံးပေါ်မှာ အတူတူပါပဲ။ `beforeCompile` က SQL query ကို မ run ခင် ပြန်ရေးတာမို့ PostgreSQL ပေါ်မှာပဲ ရှိပါတယ်။ ပါလာတဲ့ `lints` နဲ့ `budgets` middleware တွေက SQL ကို စစ်ပြီး PostgreSQL ပေါ်မှာ run ပါတယ်။ `cache` middleware ကတော့ နှစ်ခုစလုံးပေါ်မှာ run ပါတယ်။ [Middleware တစ်ခုက ဘယ် database တွေပေါ်မှာ run သလဲ](https://www.prisma.io/docs/orm/middleware/how-middleware-works#which-databases-a-middleware-runs-on) ကို ကြည့်ပါ။

[Directory](https://www.prisma.io/extensions) ထဲက extension တိုင်းက သူပစ်မှတ်ထားတဲ့ database တွေကို စာရင်းပြုထားပါတယ်။ ဒီနေ့အထိ column type၊ operator ဒါမှမဟုတ် index type ထည့်ပေးတဲ့ extension တိုင်းက PostgreSQL ကို ပစ်မှတ်ထားပြီး — MongoDB ကို စာရင်းပြုထားတဲ့ တစ်ခုတည်းသော entries တွေကတော့ database library တွေနဲ့ `cache` middleware ပဲ ဖြစ်ပါတယ်။

## Manage လုပ်ထားတဲ့နဲ့ Host လုပ်ထားတဲ့ Database များ (Managed and hosted databases)

Prisma ORM က standard connection string နဲ့ ချိတ်ဆက်တာမို့ — connection string ပေးနိုင်တဲ့ host တိုင်း အလုပ်လုပ်ပါတယ်။

| Provider | Database | မှတ်ချက် |
| --- | --- | --- |
| [Prisma Postgres](https://www.prisma.io/docs/postgres) | PostgreSQL | `npm create prisma@latest` ရဲ့ default ပါ။ CLI ကနေ provision လုပ်ပေးပြီး connection pooling ပါ ပါလာပါတယ်။ |
| Supabase | PostgreSQL | [Supabase extension](https://www.prisma.io/extensions/supabase) က auth နဲ့ storage table တွေ၊ role-bound client တွေကို ထည့်ပေးပါတယ်။ |
| Neon, Railway, Render, AWS RDS, Cloud SQL, self-hosted | PostgreSQL | PostgreSQL server တိုင်း ရပါတယ်။ pgvector နဲ့ PostGIS လို extension တွေအတွက်တော့ server-side extension ကို install လုပ်လို့ရဖို့ လိုပြီး — managed provider အများစုမှာ ပါပါတယ်။ |
| MongoDB Atlas, self-hosted MongoDB | MongoDB | `mongodb://` ဒါမှမဟုတ် `mongodb+srv://` URL နဲ့ ရောက်နိုင်တဲ့ MongoDB deployment တိုင်း ရပါတယ်။ |

Database တစ်ခု လိုနေပြီလား? [`npx create-db`](https://www.prisma.io/docs/postgres/npx-create-db) က စာရင်းသွင်းစရာ မလိုဘဲ စက္ကန့်ပိုင်းအတွင်း [Prisma Postgres](https://www.prisma.io/docs/postgres) database ယာယီတစ်ခုကို ဖန်တီးပေးပါတယ်။ App ကို host လုပ်ဖို့ဆိုရင်တော့ [Prisma Compute](https://www.prisma.io/docs/compute) ပေါ်မှာ deploy လုပ်နိုင်ပါတယ်။

`create-db` database က claim မလုပ်ရင် 24 နာရီအကြာမှာ ဖျက်ခံရပြီး — claim လုပ်ဖို့ Prisma account လိုပါတယ်။ Prisma CLI က app တွေကို [Prisma Composer](https://www.prisma.io/docs/composer) နဲ့ Prisma Compute ပေါ်မှာ deploy လုပ်ပါတယ်။ လက်ရှိမှာ Prisma Compute က WebSocket server တွေကို မထောက်ပံ့သေးဘဲ multi-region deployment လည်း မရှိပါဘူး ([ကန့်သတ်ချက်များ](https://www.prisma.io/docs/compute/limitations))။ Prisma Postgres မှာ point-in-time recovery မရှိသေးဘဲ 2026 ခုနှစ် နိုဝင်ဘာလမှာ လာမှာ ဖြစ်ပါတယ် ([backups](https://www.prisma.io/docs/postgres/database/backups))။

## လာမယ့် Database များ (Databases that are coming)

MySQL မှာ migrations တွေ run ပြီး ဒေတာ ဖတ်နိုင်တဲ့ early preview တစ်ခု ရှိပါတယ် — ဒါပေမယ့် MySQL ပေါ်မှာ ORM ကနေ row တွေ ရေးတာကတော့ မရသေးပါဘူး။ MariaDB၊ Microsoft SQL Server နဲ့ CockroachDB တို့အတွက် Prisma ORM 8 library မရှိသေးပါဘူး။ အဲဒီ database တွေအတွက် ဒီနေ့ ထောက်ပံ့ထားတဲ့ လမ်းကြောင်းပေါ်မှာ ဆက်နေချင်ရင် — ဒါမှမဟုတ် MySQL ကို ရေးတဲ့ app တစ်ခုအတွက်ဆိုရင် — အားလုံးကို ထောက်ပံ့ပေးတဲ့ [Prisma ORM 7](https://www.prisma.io/docs/orm/v7/reference/supported-databases) ကို သုံးပါ။

ကိုယ်လိုအပ်တဲ့ database အတွက် GitHub issue မှာ 👍 ထည့်ပါ၊ မရှိသေးရင် အသစ်တစ်ခု ဖွင့်ပါ — ဘာလို့လဲဆိုတော့ reaction အရေအတွက်က နောက်ထပ် ဘာတွေ တည်ဆောက်မလဲဆိုတာရဲ့ input တစ်ခု ဖြစ်လို့ပါ။ Database တစ်ခုကို အမြန်လိုအပ်တဲ့ organization တွေကတော့ [Prisma enterprise support](https://www.prisma.io/enterprise) နဲ့ ဆွေးနွေးနိုင်ပါတယ်။

Database library ဆိုတာ extension တစ်ခု ဖြစ်တာမို့ — Prisma မထုတ်တဲ့ database တစ်ခုကို community package တစ်ခုက ထည့်ပေးနိုင်ပါတယ်။ ကိုယ်တိုင် publish လုပ်မယ်ဆိုရင် [directory ကို submit လုပ်ပါ](https://www.prisma.io/extensions/submit)၊ ပြီးတော့ submission ထဲမှာ သူထည့်ပေးတဲ့ database နာမည်ကို ဖော်ပြပါ။

## နောက်တစ်ဆင့် (Next steps)

* Quickstart က [PostgreSQL](/docs/prisma/quickstart-postgresql) ဒါမှမဟုတ် [MongoDB](/docs/prisma/quickstart-mongodb) ပေါ်မှာ project တစ်ခု set up လုပ်ပေးပါတယ်။
* [Release status](/docs/prisma/release-status) က version တွေ၊ ရက်စွဲတွေနဲ့ Prisma ORM 7 ပေါ်မှာ ဆက်နေနည်းကို ဖော်ပြထားပါတယ်။
* [Supported versions](/docs/prisma/supported-versions) မှာ Node.js၊ database နဲ့ TypeScript အတွက် အနိမ့်ဆုံး version တွေ ရှိပါတယ်။
* [Prisma ORM 7 ရဲ့ ထောက်ပံ့ထားတဲ့ database များ](https://www.prisma.io/docs/orm/v7/reference/supported-databases) မှာ လက်ရှိ general availability release အတွက် matrix အပြည့်အစုံ ရှိပါတယ်။
* [Extensions](/docs/prisma/extensions) က PostgreSQL မှာ ဘာတွေ ထည့်နိုင်သလဲ စာရင်းပြုထားပါတယ်။

## ဆက်စပ် Page များ (Related pages)

- [`Prisma ORM 7 ကနေ ပြောင်းလာခြင်း`](/docs/prisma/coming-from-prisma-orm-7): Prisma ORM 7 ရဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘယ်လို ခေါ်သလဲ၊ ပြီးတော့ ဘာတွေ မရသေးသလဲ။
- [`Core concepts`](/docs/prisma/core-concepts): Prisma ORM 8 က ဘယ်လို အစိတ်အပိုင်းတွေ ပေါင်းစပ်ထားသလဲ — contract၊ contract emit က ရေးတဲ့ file တွေ၊ database signature၊ queries နဲ့ migrations အစဉ်အတိုင်း။
- [`Extensions`](/docs/prisma/extensions): Prisma ORM ထဲ ချိတ်ဆက်လို့ရတဲ့ package တိုင်း — database package တွေ၊ column type တွေ၊ index တွေ၊ query operation တွေနဲ့ middleware တွေ၊ Prisma နဲ့ community ကနေ ထုတ်တာမျိုးပါ။
- [`Overview`](/docs/prisma/data-modeling): သင့် application လိုအပ်တဲ့ ဒေတာကို model တွေ၊ primary key တွေ၊ scalar field တွေနဲ့ relation တွေနဲ့ ဖော်ပြပါ။
- [`Prisma 7`](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access၊ migrations နဲ့ visual data editor ကို ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM ဖြစ်ပါတယ်။
