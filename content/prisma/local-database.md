---
title: "သင့်စက်ထဲမှာ Database တစ်ခု (A database on your machine)"
description: "Account မလိုဘဲ Prisma ORM project အတွက် PostgreSQL ဒါမှမဟုတ် MongoDB database တစ်ခု ရယူနည်းနဲ့ သင့် app ရေးလိုက်တဲ့ rows တွေကို ကြည့်နည်း"
order: 48
source: "https://www.prisma.io/docs/prisma-orm/local-database"
status: translated
updated: 2026-11-06
---

Prisma ORM project တစ်ခုအတွက် PostgreSQL ဒါမှမဟုတ် MongoDB database တစ်ခုကို ဘာအတွက်မှ sign up မလုပ်ဘဲ ရယူပြီး သင့် app က ရေးလိုက်တဲ့ rows တွေကို ကြည့်နိုင်ပါတယ်။

Prisma ORM setup page တိုင်းက သင့်ဆီက connection string တစ်ခု တောင်းပြီး `DATABASE_URL` ထဲမှာ ထည့်ခိုင်းပါတယ်။ Database မရှိသေးရင် ဒီ page က တစ်ခု ပေးပါလိမ့်မယ်။ PostgreSQL အတွက်ဆိုရင် ရွေးချယ်စရာ သုံးခု ရှိပါတယ် — ဘာမှ install မလုပ်ရတဲ့ ယာယီ hosted database တစ်ခု၊ သင့်စက်ပေါ်က Docker ထဲမှာ PostgreSQL တစ်ခု၊ ဒါမှမဟုတ် `npm create prisma` နဲ့ ဖန်တီးထားတဲ့ app အတွက်ဆိုရင် အဲဒီ app ကိုယ်တိုင် start လုပ်နိုင်တဲ့ database ပါ။ MongoDB အတွက်ကတော့ သီးသန့် section ရှိပါတယ်။ နောက်ဆုံး section မှာတော့ app က rows တွေ ရေးပြီးသွားတဲ့အခါ အဲဒါတွေကို ဘယ်လို ကြည့်မလဲ ပြထားပါတယ်။

## ဘာမှ install မလုပ်ဘဲ ရနိုင်တဲ့ ယာယီ database (A temporary database, with nothing to install)

`create-db` က Prisma ရဲ့ hosted PostgreSQL ဖြစ်တဲ့ [Prisma Postgres](https://www.prisma.io/docs/postgres) database တစ်ခုကို account မလိုဘဲ၊ install မလုပ်ဘဲ ဖန်တီးပေးပါတယ်။ အမြန်ဆုံး ရွေးချယ်စရာဖြစ်ပြီး — ဒီ page မှာ သင့်စက်ပေါ်မဟုတ်ဘဲ Prisma ရဲ့ server တွေပေါ်မှာ run တဲ့ တစ်ခုတည်းသော option ပါ။

#### bun

```bash
bunx create-db@latest
```

#### pnpm

```bash
pnpm dlx create-db@latest
```

#### yarn

```bash
yarn dlx create-db@latest
```

#### npm

```bash
npx create-db@latest
```

Output မှာ **Connection String** line တစ်ခု (ဒါက `DATABASE_URL` အတွက် value) နဲ့ **Claim Your Database** link တစ်ခု ပါပါတယ်။ Connection string ကို `DATABASE_URL` ထဲ ထည့်ပါ။ `npm create prisma` နဲ့ စတဲ့ setup page တွေက အဲဒါကို shell ထဲမှာ export လုပ်ပြီး ကျန်တဲ့ setup page တွေကတော့ `.env` ထဲမှာ ထည့်ပါတယ်:

```bash
export DATABASE_URL="<the connection string create-db printed>"
```

Database ကို claim မလုပ်ရင် ၂၄ နာရီအကြာမှာ ဖျက်ခံရပါတယ် — claim link ကို ဖွင့်ပြီး Prisma account နဲ့ sign in လုပ်လိုက်ရင် database ကို အခမဲ့ ဆက်ထားနိုင်ပါတယ်။ စောစော ဖျက်ချင်ရင်တော့ ဖန်တီးတဲ့အခါ lifetime ကို သတ်မှတ်လိုက်ပါ၊ ဥပမာ `npx create-db@latest --ttl 1h`။ ကျန်တဲ့ options တွေကို [create-db](https://www.prisma.io/docs/postgres/npx-create-db) မှာ ဖော်ပြထားပါတယ်။

## Docker ထဲက PostgreSQL (PostgreSQL in Docker)

Database ကို ကိုယ့်စက်ပေါ်မှာပဲ ထားချင်တဲ့အခါ PostgreSQL ကို container တစ်ခုထဲမှာ run လုပ်ပါ။ Docker install လုပ်ထားဖို့ လိုပါတယ် — ဥပမာ [Docker Desktop](https://docs.docker.com/get-started/get-docker/)။ `docker compose version` က သင့်မှာ ရှိမရှိ ပြောပြပါလိမ့်မယ်။ Prisma ORM 8 က PostgreSQL 15 ဒါမှမဟုတ် အထက်ကို လိုအပ်ပြီး အောက်က file က 17 ကို run ပါတယ်။

ဒီ file ကို သင့် project root မှာ ဖန်တီးပါ:

```yml title="docker-compose.postgres.yml"
services:
  postgres:
    image: postgres:17
    restart: always
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=prisma
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 5s
      timeout: 2s
      retries: 20
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start လုပ်ပါ:

```bash
docker compose -f docker-compose.postgres.yml up -d
```

Command က container စ run ပြီးတာနဲ့ ချက်ချင်း ပြန်ထွက်လာပြီး — database က connection တွေ လက်ခံဖို့ နောက်ထပ် စက္ကန့် အနည်းငယ် ကြာပါသေးတယ်။ အဆင်သင့်ဖြစ်တဲ့အခါ `docker compose -f docker-compose.postgres.yml ps` က status column မှာ `healthy` ပြပါလိမ့်မယ်။

Container က port 5432 ပေါ်မှာ၊ ဒီစက်ကနေပဲ ဖြေပါတယ်။ User က `postgres`၊ password က `prisma`၊ database နာမည်က `postgres` ဖြစ်လို့ connection string က ဒီလိုပါ:

```bash title=".env"
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres"
```

`npm create prisma` နဲ့ စတဲ့ setup page တွေက အဲဒီ variable ကို `.env` ကမဟုတ်ဘဲ shell ကနေ ဖတ်ပါတယ် — ဒါကြောင့် အဲဒီ page တွေမှာဆိုရင် shell ထဲမှာ export လုပ်ပါ:

```bash
export DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres"
```

Setup page တွေက hosted ဥပမာတွေနဲ့ မတူဘဲ ဒီ string ရဲ့ အဆုံးမှာ `sslmode=require` မပါပါဘူး။ မထည့်ပါနဲ့ — connection က သင့်စက်ကနေ ဘယ်တော့မှ မထွက်ပါဘူး။

Port 5432 ကို တခြားတစ်ခုက ယူထားပြီးသားဆိုရင် — ဥပမာ အရင်က သင် install လုပ်ထားတဲ့ PostgreSQL — `ports` အောက်က `127.0.0.1:5432:5432` ထဲက အလယ်က `5432` ကို `5433` လိုမျိုး နံပါတ်တစ်ခုခုကို ပြောင်းပြီး connection string မှာလည်း အဲဒီနံပါတ်ကို သုံးပါ။

Data တွေက `postgres_data` volume ထဲမှာ သိမ်းထားလို့ container ကို ရပ်လိုက်၊ ပြန် start လုပ်လိုက် လုပ်တိုင်း သင့် rows တွေ ကျန်နေပါတယ်:

```bash
docker compose -f docker-compose.postgres.yml stop
docker compose -f docker-compose.postgres.yml up -d
```

Database အလွတ်နဲ့ အစကနေ ပြန်စချင်ရင် container နဲ့ volume ကို အတူတူ ဖျက်ပစ်ပါ:

```bash
docker compose -f docker-compose.postgres.yml down -v
```

Homebrew ဒါမှမဟုတ် Postgres.app လိုမျိုး တခြားနည်းနဲ့ install လုပ်ထားတဲ့ PostgreSQL လည်း အတူတူပဲ အလုပ်လုပ်ပါတယ်။ သူ့ရဲ့ connection string က အဲဒီ install ရဲ့ user၊ password၊ port နဲ့ database နာမည်ကို သုံးပါတယ်။

## App အသစ်နဲ့အတူ ပါလာတဲ့ database (The database that comes with a new app)

သင့် app ကို `npm create prisma` နဲ့ ဖန်တီးထားတာဆိုရင် သူ့ `package.json` မှာ `dev:composer` script ရှိပြီး — အဲဒီ script က ဘာမှ ထပ်ပြီး install လုပ်စရာ မလိုဘဲ database တစ်ခု ပေးပါတယ်။ တခြားနည်းနဲ့ ဖန်တီးထားတဲ့ app မှာတော့ အဲဒီ script မရှိလို့ Docker ကို သုံးပါ။

#### bun

```bash
bun run dev:composer
```

#### pnpm

```bash
pnpm run dev:composer
```

#### yarn

```bash
yarn dev:composer
```

#### npm

```bash
npm run dev:composer
```

Script က သင့်စက်ပေါ်မှာ PostgreSQL database တစ်ခု start လုပ်၊ scaffold က ရေးထားတဲ့ migration ကို apply လုပ်ပြီး သင့် tables တွေ ဖန်တီး၊ ပြီးတော့ သင့် app ကို start လုပ်ပါတယ်။ ဒါအတွက် သင့် app မှာ `DATABASE_URL` မလိုပါဘူး၊ database က run တစ်ခုကနေ နောက်တစ်ခုအထိ သူ့ rows တွေ ထိန်းထားပြီး `Ctrl-C` က နှစ်ခုလုံးကို ရပ်ပါတယ်။ Script က `npm create prisma` install လုပ်ပေးခဲ့တဲ့ [Prisma Composer](https://www.prisma.io/docs/composer) ကို သုံးပါတယ် — အလုပ်လုပ်ဖို့ သင် ဘာမှ ပြင်စရာ မလိုပါဘူး။

Migration တစ်ခုကို database ဆီ apply လုပ်တဲ့ `npx prisma db migrate` လိုမျိုး commands တွေကတော့ script run နေတုန်းမှာတောင် `DATABASE_URL` ကို လိုအပ်ပါသေးတယ်။ Project directory ထဲက terminal နောက်တစ်ခုကနေ connection string ကို ယူပါ:

```bash
npx prisma dev url my-app.database
```

`my-app.database` က database ရဲ့ address ပါ — သင့် app နာမည်၊ ပြီးတော့ `module.ts` က database ကို ပေးတဲ့ နာမည်။ `npm create prisma` က app ကို project directory နာမည်နဲ့ မှည့်တာမို့ `my-app` နေရာမှာ သင့်ဟာကို ထည့်ပါ။ Command က connection string ကို print ထုတ်ပြီး အောက်က command က အဲဒီ shell ထဲမှာပဲ `DATABASE_URL` ကို အဲဒါနဲ့ set လုပ်ပေးပါတယ်:

```bash
export DATABASE_URL="$(npx prisma dev url my-app.database)"
```

`dev url` က `prisma` ထဲမှာ 8.0.0-rc.24 ကတည်းက ပါပြီး `npx prisma --version` က သင့် project မှာ ဘယ် version ရှိလဲ ပြပါတယ်။

Database ကို အလွတ်လုပ်ချင်ရင် script ကို ရပ်၊ `npm run build` ကို run ပြီးတော့ `npx prisma dev --fresh` ကို run ပါ။ အဲဒါက database နဲ့ သူ့ rows တွေကို ဖျက်ပြီး script လုပ်သလိုပဲ app ကို start လုပ်ပါတယ်။ ပြီးရင် `Ctrl-C` နဲ့ ရပ်ပြီး နောက်တစ်ခါ `npm run dev:composer` ကို သုံးပါ။ App ကို background မှာ run နည်းကို [Local development](https://www.prisma.io/docs/composer/local-development) မှာ ဖော်ပြထားပါတယ်။

## MongoDB ကို Docker ထဲမှာ run လုပ်ခြင်း (MongoDB)

Prisma ORM 8 က MongoDB 8.0 ဒါမှမဟုတ် အထက်ကို လိုအပ်ပါတယ်။ Docker ထဲမှာ run ဖို့ ဒီ file ကို သင့် project root မှာ ဖန်တီးပါ:

```yml title="docker-compose.mongodb.yml"
services:
  mongodb:
    image: mongo:8
    restart: always
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Start လုပ်ပါ:

```bash
docker compose -f docker-compose.mongodb.yml up -d
```

Server က port 27017 ပေါ်မှာ၊ ဒီစက်ကနေပဲ၊ user ဒါမှမဟုတ် password မပါဘဲ ဖြေပါတယ်။ Connection string ရဲ့ အဆုံးက database နာမည် — ဒီမှာဆိုရင် `mydb` — က သင့်ကြိုက်တဲ့ နာမည် ဖြစ်နိုင်ပြီး အရင်ဆုံး ဖန်တီးထားဖို့ မလိုပါဘူး။

```bash title=".env"
DATABASE_URL="mongodb://localhost:27017/mydb?directConnection=true"
```

`npm create prisma` နဲ့ စတဲ့ setup page တွေက variables တွေကို `.env` ကမဟုတ်ဘဲ shell ကနေ ဖတ်ပြီး — MongoDB scaffold က နာမည် နှစ်ခု သုံးပါတယ်: `prisma` commands တွေက `MONGODB_URL` ကို ဖတ်ပြီး app က `DATABASE_URL` ကို ဖတ်ပါတယ်။ အဲဒီ page တွေမှာဆိုရင် `.env` မရေးဘဲ နှစ်ခုလုံးကို export လုပ်ပါ:

```bash
export MONGODB_URL="mongodb://localhost:27017/mydb?directConnection=true"
export DATABASE_URL="$MONGODB_URL"
```

ဒါက standalone server ပါ၊ replica set မဟုတ်ပါဘူး။ Replica set က transactions နဲ့ change streams အတွက်ပဲ လိုအပ်ပြီး setup page တွေက နှစ်ခုလုံးကို မသုံးပါဘူး; သင့် app ကိုယ်တိုင် transactions သုံးရင်တော့ အောက်က Atlas option ကို သုံးပါ။ MongoDB setup page တွေ ပြတဲ့ string မှာ `replicaSet=rs0` ပါပြီး အဲဒါက replica set ကိုပဲ connect လုပ်ပါတယ်။ ဒီ server အတွက်တော့ အဲဒါမပါတဲ့ အပေါ်က string ကို သုံးပါ။

အခမဲ့ [MongoDB Atlas](https://www.mongodb.com/atlas) cluster က hosted ရွေးချယ်စရာပါ။ အဲဒါက replica set ဖြစ်ပြီးသားမို့ Atlas ပြသင့်တဲ့ connection string ကို အတိုင်း သုံးနိုင်ပါတယ်။

PostgreSQL အတွက် သုံးခဲ့တဲ့ stop၊ start နဲ့ `down -v` commands တွေပဲ ဒီမှာလည်း သက်ဆိုင်ပြီး file က `docker-compose.mongodb.yml` ဖြစ်ပါတယ်။

## သင့် rows တွေကို ကြည့်ခြင်း (Look at your rows)

### PostgreSQL

ဒီက command တိုင်းက အပေါ်မှာ သင် set up လုပ်ခဲ့တဲ့ database ရဲ့ connection string ကို ယူပါတယ် — ဒါကြောင့် အရင်ဆုံး shell ထဲမှာ export လုပ်ပါ။ Docker setup အတွက်ဆိုရင် `.env` ထဲက string၊ `create-db` database အတွက်ဆိုရင် အဲဒါ print ထုတ်တဲ့ string၊ `dev:composer` script က start လုပ်ထားတဲ့ database အတွက်ဆိုရင် `dev url` print ထုတ်တဲ့ string ပါ:

```bash
export DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres"
```

`psql` က PostgreSQL ရဲ့ command line ပါ။ သင့်စက်မှာ install လုပ်ထားရင်:

```bash
psql "$DATABASE_URL"
```

Docker setup မှာဆိုရင် install လုပ်စရာ မလိုပါဘူး — container ထဲမှာ ပါပြီးသားပါ:

```bash
docker compose -f docker-compose.postgres.yml exec postgres psql -U postgres -d postgres
```

`psql` ထဲမှာ `\dt` က သင့် tables တွေကို စာရင်းပြပါတယ်။ Table တစ်ခုက သူ့ model နာမည်နဲ့ ဖြစ်ပြီး model မှာ `@@map` ရှိရင် အဲဒီနာမည်နဲ့ ဖြစ်ပါတယ်။ ဒါကြောင့် starter contract ရဲ့ `User` model က `"User"` table ဖြစ်ပြီး `\d "User"` က သူ့ columns တွေကို ပြ၊ `SELECT * FROM "User";` က သူ့ rows တွေကို print ထုတ်ပါတယ်။ Quote တွေ အရေးကြီးပါတယ် — မထည့်ဘဲ ရေးထားတဲ့ နာမည်ကို PostgreSQL က lowercase ပြောင်းပစ်လို့ပါ။

[Prisma Studio](https://www.prisma.io/docs/studio) က သင့် tables တွေနဲ့ Prisma ORM apply လုပ်ထားတဲ့ migrations တွေကို browser မှာ ပြပါတယ်။ သင့် project ရဲ့ အထက်က directory ကနေ run ပြီး connection string ကို ပေးပါ:

```bash
cd .. && npx prisma@prev studio --url "$DATABASE_URL"
```

Studio က Prisma ORM 8 databases တွေနဲ့ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် အဲဒါက `prisma@prev` install လုပ်တဲ့ Prisma ORM 7 command-line tool နဲ့ပဲ ပို့ချပေးနေပါသေးတယ်။ အဲဒီ tool က Prisma ORM 8 project ထဲမှာ error နဲ့ ရပ်သွားလို့ အထက်က directory ကနေ run ပြီး ပြီးတဲ့အခါ ပြန် `cd` လုပ်ပါ။ Studio က သူ serve လုပ်တဲ့ address ကို print ထုတ်ပြီး များသောအားဖြင့် `http://localhost:5555` ပါ။ [Studio with Prisma ORM](https://www.prisma.io/docs/studio/prisma-next) က applied migration တစ်ခုချင်းစီက ဘာတွေ ပြောင်းခဲ့လဲ ပြတဲ့ Migrations view ကို ရှင်းပြပါတယ်။

pgAdmin၊ TablePlus၊ DBeaver ဒါမှမဟုတ် DataGrip လိုမျိုး database editor တွေက connection string ရဲ့ အစိတ်အပိုင်းတွေကို မေးပါတယ်။ Docker setup အတွက်ဆိုရင် host က `localhost`၊ port က `5432`၊ user က `postgres`၊ password က `prisma`၊ database က `postgres` ဖြစ်ပြီး SSL ကို off ထားပါ။ [Viewing data](https://www.prisma.io/docs/guides/postgres/viewing-data) မှာ editor အတော်များများရဲ့ connection dialog တွေကို ပြထားပါတယ်။

### MongoDB

Prisma Studio က MongoDB ကို မထောက်ပံ့ပါဘူး။ `mongosh` က MongoDB shell ဖြစ်ပြီး container ထဲမှာ ပါပါတယ်:

```bash
docker compose -f docker-compose.mongodb.yml exec mongodb mongosh mydb
```

`mongosh` ထဲမှာ `show collections` က သင့် collections တွေကို စာရင်းပြပြီး `db.users.find()` က `users` collection ထဲက documents တွေကို print ထုတ်ပါတယ်။ Collection တစ်ခုက သူ့ model နာမည်နဲ့ ဖြစ်ပါတယ် — ဒါကြောင့် `Comment` model က `Comment` collection ဖြစ်ပါတယ်၊ model မှာ `@@map` ရှိရင်တော့ မဟုတ်ပါဘူး: starter contract က `User` ကို `users`၊ `Post` ကို `posts` ဆိုပြီး map လုပ်ထားပါတယ်။ [MongoDB Compass](https://www.mongodb.com/products/tools/compass) က graphical ရွေးချယ်စရာပါ — `mongodb://localhost:27017` နဲ့ connect လုပ်ပါ။

## နောက်တစ်ဆင့် (Next steps)

* သင် လာခဲ့တဲ့ setup page ဆီ ပြန်သွားပါ — [Create a new app with PostgreSQL](/docs/prisma/quickstart-postgresql)၊ [Create a new app with MongoDB](/docs/prisma/quickstart-mongodb)၊ ဒါမှမဟုတ် [Add Prisma ORM and PostgreSQL to an existing app](https://www.prisma.io/docs/prisma-orm/quickstart/existing-app/postgresql)။
* [Deploy with Docker](https://www.prisma.io/docs/guides/deployment/docker) က သင့် app နဲ့ PostgreSQL ကို containers ထဲမှာ အတူတူ run စေပြီး အပေါ်က file လိုမျိုး Compose file တစ်ခု သုံးပါတယ်။ App container က သူ့ဆီ connect လုပ်တာမို့ သူ့ PostgreSQL port ကို ဒီစက်တစ်ခုတည်းမဟုတ်ဘဲ network ဆီကိုပါ publish လုပ်ထားပါတယ်။

## ဆက်စပ် page များ (Related pages)

- [`create-prisma`](/docs/prisma/create-prisma): Prisma Composer၊ Prisma Postgres နဲ့ deploy လုပ်နည်းပါ တပ်ဆင်ထားတဲ့ create-prisma နဲ့ Prisma ORM app အသစ် တည်ဆောက်ခြင်း။
- [`From scratch`](/docs/prisma/from-scratch): config file တစ်ခု၊ contract တစ်ခုနဲ့ index.ts တစ်ခုတည်းနဲ့ PostgreSQL အတွက် Prisma ORM ကို ကိုယ်တိုင် set up လုပ်ခြင်း။
