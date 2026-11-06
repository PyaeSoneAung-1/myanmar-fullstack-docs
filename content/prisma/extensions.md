---
title: "Extensions — Prisma ORM ကို ချိတ်ဆက်ပေးတဲ့ Package များ"
description: "Prisma ORM ထဲကို ချိတ်ဆက်လို့ရတဲ့ package အားလုံး — database packages၊ column types၊ indexes၊ query operations နဲ့ middleware တွေကို Prisma နဲ့ community က ပံ့ပိုးထားပုံ"
order: 44
source: "https://www.prisma.io/docs/orm/extensions"
status: translated
updated: 2026-11-06
---

Extension ဆိုတာ Prisma ORM ကိုယ်တိုင် မလုပ်ပေးတဲ့ အရာတစ်ခုကို ထည့်ပေးတဲ့ npm package တစ်ခု ဖြစ်ပါတယ် — vector ဒါမှမဟုတ် geometry လိုမျိုး column type တစ်ခု၊ index type တစ်ခု၊ query operations (pgvector ရဲ့ `cosineDistance` လိုမျိုး query ထဲမှာ ခေါ်လို့ရတဲ့ function အသစ်တွေ)၊ ဒါမှမဟုတ် query တိုင်းရဲ့ ရှေ့နဲ့ နောက်မှာ သင့်ကိုယ်ပိုင် code ကို run ပေးတဲ့ middleware တို့ ဖြစ်ပါတယ်။ PostgreSQL သုံးဖို့ `@prisma/orm-postgres` ကို install လုပ်ရပြီး MongoDB သုံးဖို့ `@prisma/orm-mongo` ကို install လုပ်ရပါတယ် — database တစ်ခုအတွက် ပံ့ပိုးမှုကလည်း extension တစ်ခုကနေ လာတာမို့ပါ။

Package ကို install လုပ်ရုံနဲ့ မပြီးပါဘူး — extension တစ်ခုကို နေရာနှစ်ခုမှာ register လုပ်ရပါတယ်။ `prisma.config.ts` ထဲမှာ ထည့်ရတာက command line tools တွေ သိရအောင်ပါ၊ ပြီးတော့ client ကို ဖန်တီးတဲ့ `db.ts` ဖိုင်ထဲမှာ ထည့်ရတာက သင့် queries တွေ သူထည့်ပေးတဲ့အရာတွေကို သုံးနိုင်ရအောင်ပါ။ `@prisma/orm-postgres` က တိုက်ရိုက် ခေါ်ရတဲ့ package ပါ — `prisma.config.ts` ထဲမှာ `ormConfig(...)`၊ `db.ts` ထဲမှာ `postgres(...)`။ တခြား extension တွေကို အဲဒီ call နှစ်ခုဆီ ပေးလိုက်တဲ့ `extensions` array ထဲမှာ စာရင်းပြုစုထားပါတယ်။ [Using extensions](/docs/prisma/using-extensions) က pgvector အတွက် install command အပါအဝင် registration နှစ်ခုလုံးကို ပြပေးပါတယ်။ Middleware ကတော့ ခြွင်းချက်ပါ — client ပေါ်မှာပဲ register လုပ်ရပြီး၊ [How middleware works](/docs/prisma/how-middleware-works) က အဲဒါကို ဖော်ပြထားပါတယ်။

သင့် contract ဆိုတာ Prisma ORM 8 က သင့် schema လို့ ခေါ်တဲ့အရာပါ — `schema.prisma` အစား [`contract.prisma`](/docs/prisma/the-data-contract) ပါ။ Prisma ORM 7 project တစ်ခု ရှိရင်၊ [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) က `schema.prisma`၊ `@prisma/client` နဲ့ `$use` ကို ဘာတွေ အစားထိုးလဲ ပြောပြထားပါတယ်။

## Extension စာရင်း (Catalog)

[extension directory](https://www.prisma.io/extensions) မှာ အောက်က entry တစ်ခုချင်းစီအတွက် install command နဲ့ registration snippet ရှိပါတယ်။ MySQL ရဲ့ library ဖြစ်တဲ့ `@prisma/orm-mysql` က migrations နဲ့ reads အတွက် early preview ဖြစ်ပြီး၊ [Supported databases](/docs/prisma/supported-databases) က ဘာတွေ လွှမ်းခြုံပြီး ဘာတွေ စီစဉ်ထားလဲ ပြောပြထားပါတယ်။ experimental လို့ မှတ်ထားတဲ့ entry တစ်ခုက ယနေ့ အလုပ်လုပ်ပါတယ်၊ ဒါပေမယ့် သူ့ API က release တွေကြားမှာ ပြောင်းနိုင်ပါတယ်။

| Name | ဘာတွေ ထည့်ပေးသလဲ | Package | Databases | ပံ့ပိုးသူ |
| --- | --- | --- | --- | --- |
| [arktype-json](https://www.prisma.io/extensions/arktype-json) | arktype schema တစ်ခုနဲ့ validate လုပ်ပြီး အစအဆုံး type သတ်မှတ်ထားတဲ့ JSON columns။ | `@prisma/orm-extension-arktype-json` | PostgreSQL | Prisma |
| [Cache middleware](https://www.prisma.io/extensions/middleware-cache) | ထပ်ခါထပ်ခါ ဖတ်တဲ့ reads တွေကို in-memory ဒါမှမဟုတ် ချိတ်ဆို့လို့ရတဲ့ cache တစ်ခုကနေ ဖြည့်ပေးပြီး query တစ်ခုချင်းအလိုက် opt in လုပ်နိုင်သည်။ | `@prisma/orm-extension-middleware-cache` | PostgreSQL, MongoDB | Prisma |
| [MongoDB](https://www.prisma.io/extensions/mongodb) | Prisma ORM အတွက် MongoDB ပံ့ပိုးမှု — config၊ runtime၊ contract authoring၊ BSON values နဲ့ migrations အားလုံး package တစ်ခုတည်းမှာ။ | `@prisma/orm-mongo` | MongoDB | Prisma |
| [ParadeDB](https://www.prisma.io/extensions/paradedb) (experimental) | relevance အလိုက် အစီအစဉ်ချထားတဲ့ BM25 full-text search — fuzzy၊ phrase နဲ့ proximity queries တွေပါ။ | `@prisma/orm-extension-paradedb` | PostgreSQL | Prisma |
| [pgvector](https://www.prisma.io/extensions/pgvector) | Embeddings အတွက် vector columns နဲ့ similarity search။ | `@prisma/orm-extension-pgvector` | PostgreSQL | Prisma |
| [PostGIS](https://www.prisma.io/extensions/postgis) | Geometry columns နဲ့ distance၊ containment လိုမျိုး geospatial queries။ | `@prisma/orm-extension-postgis` | PostgreSQL | Prisma |
| [PostgreSQL](https://www.prisma.io/extensions/postgresql) | Prisma ORM အတွက် PostgreSQL ပံ့ပိုးမှု — config၊ runtime၊ contract authoring နဲ့ migrations အားလုံး package တစ်ခုတည်းမှာ။ | `@prisma/orm-postgres` | PostgreSQL | Prisma |
| [SQLite](https://www.prisma.io/extensions/sqlite) (experimental) | Prisma ORM အတွက် SQLite ပံ့ပိုးမှု — config၊ runtime၊ contract authoring နဲ့ migrations အားလုံး package တစ်ခုတည်းမှာ။ | `@prisma/orm-sqlite` | SQLite | Prisma |
| [Supabase](https://www.prisma.io/extensions/supabase) (experimental) | Supabase auth နဲ့ storage tables အပြင် row-level security အတွက် role-bound clients တွေ။ | `@prisma/orm-extension-supabase` | PostgreSQL | Prisma |
| [IndexedDB](https://www.prisma.io/extensions/indexeddb) (experimental) | IndexedDB အတွက် Prisma 8 — သင့် PSL schema ကနေ browser database တစ်ခု၊ typed accessors နဲ့ explicit migrations တွေနဲ့။ | `@prisma-idb/client-idb` | IndexedDB | [Yash Kolekar](https://whyash5114.com) |
| [typed-json](https://www.prisma.io/extensions/typed-json) | validator dependency မလိုဘဲ typed JSON နဲ့ text columns။ | `prisma-orm-extension-typed-json` | PostgreSQL | [Omar Dulaimi](https://github.com/omar-dulaimi) |
| [zod-json](https://www.prisma.io/extensions/zod-json) | zod schema တစ်ခုနဲ့ ဖော်ပြပြီး အတည်ပြုထားတဲ့ typed JSON columns။ | `prisma-orm-extension-zod-json` | PostgreSQL | [Omar Dulaimi](https://github.com/omar-dulaimi) |

ဒီထဲက သုံးခုမှာ ကိုယ်ပိုင် page ရှိပါတယ် — [PostGIS](/docs/prisma/postgis)၊ [ParadeDB](/docs/prisma/paradedb) နဲ့ [arktype-json](/docs/prisma/arktype-json)။ [Using extensions](/docs/prisma/using-extensions) က pgvector ကို အဆင့်လိုက် လမ်းညွှန်ပြပါတယ်။

Supabase row မှာ ပါတဲ့ role-bound clients ဆိုတာ PostgreSQL role တစ်ခုအတိအကျကို pin လုပ်ထားတဲ့ client instances တွေပါ — ဒါမှ database က အဲဒီ role ရဲ့ row-level security policies တွေကို သူတို့ကတစ်ဆင့် query လုပ်သမျှအပေါ် သက်ရောက်စေပါတယ်။

## ကိုယ်ပိုင် Extension ကို ထုတ်ဝေခြင်း (Publish your own)

ကိုယ်တိုင် ရေးတဲ့ extension ဆိုတာ command line tools အတွက် entry point တစ်ခုနဲ့ သင့် application အတွက် entry point တစ်ခု ပါတဲ့ npm package တစ်ခုပါ။ Entry point နှစ်ခုကို `control` နဲ့ `runtime` လို့ နာမည်ပေးပါ — pgvector လုပ်ထားသလိုပါ၊ [call for extension authors](https://www.prisma.io/blog/prisma-next-call-for-extension-authors) မှာ ဖော်ပြထားသလိုပါ။ Middleware ကတော့ entry point တစ်ခုတည်းနဲ့ ထုတ်ပေးပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒါက client ပေါ်မှာပဲ အမြဲ register လုပ်ရတာမို့ပါ။

Package ကို `prisma-orm-<name>` လို့ နာမည်ပေးပါ၊ ဒါမှမဟုတ် ကိုယ်ပိုင် npm scope အောက်မှာ ထုတ်ဝေရင် `@your-scope/prisma-orm-<name>` လို့ ပေးပါ။ `package.json` ထဲမှာ `prisma-orm-extension` keyword ကို ထည့်ပါ — ဒါမှ npm မှာ ရှာတဲ့ လူတွေနဲ့ tools တွေက community Prisma ORM 8 extension တိုင်းကို ရှာတွေ့နိုင်မှာပါ:

```json title="package.json"
{
  "name": "prisma-orm-sentry",
  "keywords": ["prisma-orm-extension"]
}
```

Middleware ရေးဖို့ဆိုရင် [Authoring custom middleware](/docs/prisma/authoring-custom-middleware) ကို လိုက်နာပါ။ Database တစ်ခုလုံးကို ထည့်နေတာဆိုရင် — SQL database အတွက် `@prisma/orm-postgres` က ကူးယူရမယ့်ဟာ ဖြစ်ပြီး document database အတွက် `@prisma/orm-mongo` ပါ။ သင့် package ကို npm ပေါ် တင်ပြီးရင်၊ [submit it to the directory](https://www.prisma.io/extensions/submit) မှာ တင်ပါ၊ catalog ထဲ မပေါ်ခင် maintainer တစ်ယောက်က သင့် entry ကို review လုပ်ပါလိမ့်မယ်။

## ဆက်စပ်ဖတ်ရန် (See also)

* [Using extensions](/docs/prisma/using-extensions): extension တစ်ခုကို install လုပ်ပြီး သူနဲ့ ပထမဆုံး query ကို run ကြည့်ပါ
* [Supported databases](/docs/prisma/supported-databases): Prisma ORM က ဘယ် database တွေကို ထောက်ပံ့ပေးလဲ၊ ဘာတွေ စီစဉ်ထားလဲ
* [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7): `@prisma/client` နဲ့ `schema.prisma` ကို သုံးနေတဲ့ project တစ်ခုမှာ ဘာတွေ ပြောင်းလဲသွားလဲ

## ဆက်စပ်သော Page များ (Related pages)

- [`Coming from Prisma ORM 7`](/docs/prisma/coming-from-prisma-orm-7): Prisma ORM 7 ရဲ့ schema attribute၊ command နဲ့ query တစ်ခုချင်းစီကို Prisma ORM 8 မှာ ဘာလို့ ခေါ်လဲ၊ ဘာတွေ မရနိုင်တော့ဘူးဆိုတာ။
- [`Core concepts`](/docs/prisma/core-concepts): Prisma ORM 8 က ဘယ်လို အစိတ်အပိုင်းတွေ ပေါင်းစပ်ထားလဲ — contract၊ contract emit က ရေးတဲ့ ဖိုင်တွေ၊ database signature၊ queries နဲ့ migrations တွေကို သင် တွေ့ရမယ့် အစီအစဉ်အတိုင်း။
- [`Overview`](/docs/prisma/data-modeling): Models၊ primary keys၊ scalar fields နဲ့ relations တွေနဲ့ သင့် application လိုအပ်တဲ့ ဒေတာကို ဖော်ပြပါ။
- [`Prisma 7`](https://www.prisma.io/docs/orm/v7): Prisma ORM ဆိုတာ type-safe database access၊ migrations နဲ့ visual data editor တို့ ပေးတဲ့ မျိုးဆက်သစ် Node.js နဲ့ TypeScript ORM တစ်ခု ဖြစ်ပါတယ်။
- [`Prisma ORM`](https://www.prisma.io/docs/orm/v6): Prisma ORM အကြောင်း လေ့လာပါ
