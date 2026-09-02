---
title: "Deploying (Deployment)"
description: "Production/staging database တွေမှာ prisma migrate deploy နဲ့ pending migration တွေ apply လုပ်နည်း — CI/CD pipeline ထဲ ထည့်ခြင်း၊ GitHub Actions ဥပမာ၊ shadow database နဲ့ မဆိုင်တဲ့အကြောင်း၊ deploy မလုပ်ခင် safety check"
order: 22
source: "https://www.prisma.io/docs/orm/v7/prisma-client/deployment/deploy-database-changes-with-prisma-migrate"
status: translated
updated: 2026-09-02
---

Staging, testing, ဒါမှမဟုတ် production environment တွေမှာ pending migration တွေကို apply လုပ်ဖို့ — CI/CD pipeline ရဲ့ အစိတ်အပိုင်းအနေနဲ့ `migrate deploy` command ကို run ပါ:

```npm
npx prisma migrate deploy
```

> **မှတ်ချက်:** ဒီ guide က **MongoDB နဲ့ မသက်ဆိုင်ပါဘူး။**
> `migrate deploy` အစား [MongoDB](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/mongodb) အတွက်က [`db push`](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/prototyping-your-schema) ကို သုံးပါတယ်။ MongoDB project တစ်ခုမှာ ဒီ workflow ခြားနားချက်တွေကို [Migrations](/docs/prisma/migrations) မှာ ပါ ဖတ်နိုင်ပါတယ်။

`prisma migrate deploy` ကို အတိအကျ ဘယ်အချိန် run မလဲဆိုတာ သင့် platform ပေါ်မှာ မူတည်ပါတယ်။ ဥပမာ — [Heroku](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/traditional/deploy-to-heroku) ပေါ်မှာ ရိုးရှင်းတဲ့ workflow တစ်ခုက:

1. `./prisma/migration` folder ကို source control ထဲမှာ ရှိနေအောင် သေချာစေခြင်း
2. [release phase](https://devcenter.heroku.com/articles/release-phase) အတွင်းမှာ `prisma migrate deploy` ကို run လုပ်ခြင်း

ဖြစ်နိုင်ရင် `migrate deploy` က automated CI/CD pipeline ရဲ့ အစိတ်အပိုင်း ဖြစ်သင့်ပါတယ်။ Production database တစ်ခုကို deploy လုပ်ဖို့ ဒီ command ကို local ကနေ run လုပ်တာကို ယေဘုယျအားဖြင့် အကြံမပြုပါဘူး — ဥပမာ `DATABASE_URL` environment variable ကို ခဏ ပြောင်းပြီး run တာမျိုးပါ။ Production database ရဲ့ URL ကို local မှာ သိမ်းထားတာက ကောင်းတဲ့ အလေ့အကျင့် (good practice) မဟုတ်ပါဘူး။

`prisma migrate deploy` command ကို run နိုင်ဖို့ — `prisma` dependency ကို လက်လှမ်းမီဖို့ လိုပါတယ်။ ဒီ dependency ကို ပုံမှန်အားဖြင့် `devDependencies` ထဲမှာ ထည့်လေ့ ရှိပါတယ်။ Vercel လို platform တချို့က build လုပ်ချိန်မှာ development dependencies တွေကို ဖြုတ်ပစ်တာမို့ — command ကို မခေါ်နိုင်တဲ့ အခြေအနေ ဖြစ်တတ်ပါတယ်။ ဒါကို `package.json` ထဲမှာ `prisma` ကို `dependencies` ဆီ ရွှေ့ပြီး production dependency အဖြစ် လုပ်ခြင်းဖြင့် ရှောင်ရှားလို့ရပါတယ်။

`migrate deploy` command အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက်:

- [`migrate deploy` reference](https://www.prisma.io/docs/orm/v7/reference/prisma-cli-reference#migrate-deploy)
- [`migrate deploy` ဘယ်လို အလုပ်လုပ်လဲ](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production#production-and-testing-environments)
- [Production troubleshooting](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/patching-and-hotfixing)

## GitHub Actions နဲ့ database changes တွေ deploy လုပ်ခြင်း

CI/CD ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — pending migration တွေကို production database ပေါ်မှာ apply ဖို့ `prisma migrate deploy` ကို pipeline ထဲမှာ run လို့ရပါတယ်။

ဒီဥပမာ action က သင့် database ပေါ်ကို migration တွေ run ပေးမှာ ဖြစ်ပါတယ်:

```yaml
name: Deploy
on:
  push:
    paths:
      - prisma/migrations/** # [!code highlight]
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm install
      - name: Apply all pending migrations to the database
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Highlight လုပ်ထားတဲ့ line က ပြတာက — ဒီ action က `prisma/migrations` directory ထဲမှာ အပြောင်းအလဲ ရှိမှပဲ run မယ်ဆိုတာပါ။ ဒါကြောင့် `npx prisma migrate deploy` က migration တွေ update ဖြစ်တဲ့အခါမှပဲ run ပါတယ်။

`DATABASE_URL` variable ကို [repository ရဲ့ secrets ထဲမှာ](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) သေချာ ထားပါ — connection string ရဲ့ ပတ်လည်မှာ quote တွေ မပါဘဲ ထားဖို့လည်း သတိပြုပါ။

## Deploy မလုပ်ခင် migration safety check များ

`prisma migrate deploy` ကို run မလုပ်ခင် — သင့် migration SQL file တွေထဲမှာ အန္တရာယ်ရှိနိုင်တဲ့ ပုံစံတွေ ရှိမရှိကို [pgfence](https://www.prisma.io/docs/guides/integrations/pgfence) လို migration safety tool တစ်ခုနဲ့ စစ်ဆေးနိုင်ပါတယ်။ pgfence က heavy lock တွေ ယူတဲ့ operations တွေ (`CONCURRENTLY` မပါတဲ့ `CREATE INDEX`၊ `ALTER COLUMN TYPE` စသည်) ကို ရှာဖွေပြီး — risk level တွေ အစီရင်ခံကာ လုံခြုံတဲ့ rewrite နည်းလမ်းတွေ ပေးပါတယ်။

GitHub Actions workflow ထဲမှာ pgfence ကို pre-deploy step အနေနဲ့ ထည့်ဖို့:

```yaml
- name: Run migration safety check
  run: npx @flvmnt/pgfence analyze --ci --max-risk medium prisma/migrations/**/migration.sql

- name: Apply all pending migrations to the database
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Setup အပြည့်အစုံအတွက် [pgfence integration guide](https://www.prisma.io/docs/guides/integrations/pgfence) ကို ကြည့်ပါ။

## migrate deploy က ဘာတွေ လုပ်သလဲ၊ ဘာတွေ မလုပ်ဘူးလဲ

Production မှာ `migrate deploy` က — development မှာ သုံးတဲ့ `migrate dev` နဲ့ မတူဘဲ ရည်ရွယ်ချက် တစ်ခုတည်းအတွက်ပဲ ရှိပါတယ်: pending migration တွေကို apply လုပ်ဖို့ပါ။ သူ လုပ်တာတွေက:

- Apply လုပ်ပြီးသား migration တွေကို migration history နဲ့ ယှဉ်ကြည့်ပြီး — ပြင်ဆင်ထားတဲ့ migration တွေ ရှိနေရင် **warning** ထုတ်ပါတယ်:

   ```bash
   WARNING The following migrations have been modified since they were applied:
   20210313140442_favorite_colors
   ```

- Pending migration တွေကို apply လုပ်ပါတယ်။

ပြီးတော့ — `migrate deploy` က:

- **မလုပ်တာ:** apply ပြီးသား migration တစ်ခု migration history ထဲက ပျောက်နေရင် warning မထုတ်ပါဘူး
- **မလုပ်တာ:** drift (production database schema က migration history ရဲ့ end state နဲ့ မကိုက်တာ — ဥပမာ hotfix ကြောင့်) ကို detect မလုပ်ပါဘူး
- **မလုပ်တာ:** database ကို reset လုပ်တာ၊ artifact (Prisma Client လိုမျိုး) တွေ generate လုပ်တာ ဘာမှ မလုပ်ပါဘူး
- **မလုပ်တာ:** shadow database ကို မမှီခိုပါဘူး

နောက်ဆုံး တစ်ချက်က သတိထားစရာ ကောင်းပါတယ် — development မှာ `migrate dev` က schema drift ရှိမရှိ စစ်ဖို့ shadow database ကို သုံးပြီး migration history တွေ ပြန် run လုပ်ပါတယ်။ ဒါပေမယ့် production/staging မှာ `migrate deploy` က shadow database မလိုဘဲ — apply လုပ်ရမယ့် migration တွေကိုပဲ တိုက်ရိုက် run ပါတယ်။ ဒါကြောင့် production database မှာ shadow database ဖန်တီးခွင့် မလိုအပ်ပါဘူး။

Production command တွေ (`migrate deploy`, `migrate dev`, `migrate resolve`) run လုပ်တဲ့အခါ Prisma Migrate က **advisory locking** ကို သုံးပါတယ် — pull request နှစ်ခု ဆက်တိုက် merge လုပ်လိုက်တာမျိုးမှာ command နှစ်ခု တစ်ပြိုင်နက် run မဖြစ်အောင် ဒီ safeguard က ကာကွယ်ပေးပါတယ်။ Advisory lock က **10 စက္ကန့် timeout** ရှိပြီး (ပြောင်းလို့မရပါဘူး) — timeout ဖြစ်သွားရင် command ကို ပြန် run ရုံပါပဲ။

## ဆက်စပ်ဖတ်ရန်

- [Migrations](/docs/prisma/migrations) — `migrate dev` / `migrate deploy` / `db push` command တွေ ခြုံငုံကြည့်ရန်
- [Development and production](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production) — development နဲ့ production environment တွေမှာ Prisma Migrate command တွေ သုံးပုံ အပြည့်အစုံ
- [Migration တစ်ခု Apply လုပ်ခြင်း](/docs/prisma/applying-a-migration) — Prisma 8 ရဲ့ `db migrate` workflow (version အသစ်သုံးနေသူများအတွက်)
