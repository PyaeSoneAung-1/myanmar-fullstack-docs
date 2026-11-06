---
title: "ငွေကြေးနဲ့ ဒဿမ (Money and decimals)"
description: "Prisma ORM 8 မှာ ဈေးနှုန်းနဲ့ တိကျတဲ့ ပမာဏတွေကို integer cents ဒါမှမဟုတ် decimal column အနေနဲ့ သိမ်းပြီး တစ်ပြားမှ မလွဲအောင် ဖတ်၊ ရေး၊ round နဲ့ ပေါင်းနည်း"
order: 41
source: "https://www.prisma.io/docs/orm/data-modeling/money"
status: translated
updated: 2026-11-06
---

ငွေကြေး ပမာဏတစ်ခုက database ထဲ ထည့်လိုက်တဲ့အတိုင်း အတိအကျ ပြန်ထွက်လာရပါမယ်၊ ပြီးတော့ အဲဒါ တစ်ထောင်ကို ပေါင်းလိုက်တာက တစ်ပြားတောင် လွဲမသွားရပါဘူး။ JavaScript ရဲ့ `number` က နှစ်ခုလုံးကို ကတိမပေးနိုင်ပါဘူး: `0.1 + 0.2` က `0.30000000000000004` ဖြစ်ပါတယ်။ ဒီ page မှာ အဲဒါကို လုပ်နိုင်တဲ့ PostgreSQL type သုံးမျိုး၊ ဘယ်တစ်မျိုး ရွေးရမလဲ၊ ပြီးတော့ Prisma ORM 8 မှာ အဲဒီတန်ဖိုးတွေကို ဖတ်၊ ရေး၊ ပေါင်း၊ မြှောက်ပုံကို ပြပါမယ်။

Prisma ORM 8 က schema file ကို contract လို့ ခေါ်ပါတယ်။ အဲဒါက `src/prisma/contract.prisma` ဖြစ်ပြီး `schema.prisma` ကို အစားထိုးပါတယ်။ ဒီ page ထဲက example တွေမှာ အောက်က model ကို သုံးထားပါတယ်။ အဲဒါကို ထည့်ပြီးရင် သင့် code import လုပ်တဲ့ file တွေ update ဖို့ `npx prisma contract emit` ကို run ပါ၊ ပြီးရင် သင့် development database မှာ table ဖန်တီးဖို့ `npx prisma migration plan --name add-order` နဲ့ `npx prisma db migrate --advance-ref db` ကို run ပါ; [Generating a migration](/docs/prisma/generating-a-migration) မှာ နှစ်ခုလုံးကို ရှင်းပြထားပါတယ်။ Code ထဲမှာ `db` ဆိုတာ `src/prisma/db.ts` က export လုပ်တဲ့ client ပါ — အဲဒီ file ကို `npm create prisma` နဲ့ `npx prisma orm init` က သင့်အတွက် ရေးပေးပါတယ်။

```prisma title="src/prisma/contract.prisma"
model Order {
  id         Int            @id @default(autoincrement())
  totalCents Int
  total      Numeric(10, 2)
  taxRate    Decimal
}
```

ဒီ model က type သုံးမျိုးကို ဘေးချင်းယှဉ် ပြထားပါတယ်။ တကယ့် model တစ်ခုမှာတော့ ပမာဏတစ်ခုချင်းစီကို အဲဒီထဲက တစ်မျိုးတည်းမှာပဲ သိမ်းပါတယ်။

## Type ရွေးချယ်ခြင်း (Pick a type)

| Contract ထဲက type | PostgreSQL column | ဘာအတွက် သုံးမလဲ |
| --- | --- | --- |
| `Int` — cents အနေနဲ့ | `integer` | ဈေးနှုန်းနဲ့ စုစုပေါင်းတွေ — cents နဲ့တွက်တဲ့ အကြီးဆုံး ပမာဏက 2,147,483,647 (ဒေါ်လာ 21 သန်းလောက်) ထဲ ဝင်သရွေ့ပါ။ အဲဒါထက် ကျော်ရင် `BigInt` သုံးပါ။ |
| `Numeric(10, 2)` | `numeric(10,2)` | ဒဿမအမှတ်နဲ့ လာပြီး သတ်မှတ်ထားတဲ့ ဒဿမ နေရာအရေအတွက် ထိန်းထားရမယ့် ပမာဏတွေ — ဥပမာ accounting system ကနေ လာတဲ့ ကိန်းဂဏန်းတွေ |
| `Decimal` | `numeric` | ငွေကြေးထက် ဒဿမ နေရာ ပိုလိုတဲ့ တန်ဖိုးတွေ — ဥပမာ tax rate ဒါမှမဟုတ် exchange rate |

သာမန် product ဈေးနှုန်းတွေအတွက်ဆိုရင် မလိုအပ်တဲ့ အကြောင်းပြချက် မရှိသရွေ့ integer cents ကို သုံးပါ။ ဒါဆို သင့် code က အပြည့်ကိန်းတွေနဲ့ အလုပ်လုပ်ပြီး — JavaScript က အတိအကျ ပေါင်းပေးပါတယ်။ ပမာဏကို ငွေကြေးရဲ့ အသေးဆုံး unit နဲ့ သိမ်းပါ — ဥပမာ US dollar အတွက် cents။ ပိုသေးတဲ့ unit မရှိတဲ့ ငွေကြေး — ဥပမာ ဂျပန် yen — ကတော့ ရှိအတိုင်း သိမ်းပါတယ်။ ငွေကြေး အမျိုးမျိုး ရောင်းချရင် — cents အရေအတွက် တူတူပေမယ့် ငွေကြေးတစ်ခုစီမှာ ပမာဏ မတူနိုင်လို့ — ငွေကြေး code ကို ပမာဏဘေးက field တစ်ခုမှာ သိမ်းပါ။

`Numeric(10, 2)` မှာ 2 ဆိုတာ တန်ဖိုးတိုင်း ထိန်းထားတဲ့ ဒဿမ နေရာအရေအတွက်ဖြစ်ပြီး 10 ကတော့ တန်ဖိုးတစ်ခုမှာ စုစုပေါင်း ဂဏန်း ဘယ်လောက်ရှိလဲဆိုတာပါ။ ဒါကြောင့် အကြီးဆုံး တန်ဖိုးက 99,999,999.99 ဖြစ်ပါတယ်။ ကိုယ့်ပမာဏတွေနဲ့ ကိုက်ညီအောင် နှစ်ခုလုံးကို ရွေးပါ။

ငွေကြေးကို `Float` မှာ မသိမ်းပါနဲ့။ အဲဒါက floating-point column ဖြစ်လို့ JavaScript number တွေလိုပဲ round လုပ်ပါတယ်။

## ပမာဏ ဖတ်ခြင်းနဲ့ ရေးခြင်း (Read and write amounts)

`Int` field က JavaScript `number` ဖြစ်ပြီး `BigInt` field က JavaScript `bigint` ပါ။ `Numeric` ဒါမှမဟုတ် `Decimal` field ကတော့ string ဖြစ်ပါတယ် — ဖတ်တဲ့အခါရော ရေးတဲ့အခါပါ:

```ts
const order = await db.orm.public.Order.create({
  totalCents: 1999,
  total: "19.99",
  taxRate: "0.0725",
});

order.total; // "19.99"
```

String တစ်ခု ထည့်လို့ရတဲ့ နေရာတိုင်းမှာ အဲဒီတန်ဖိုးကို သုံးနိုင်ပါတယ်။ `total Numeric(10, 2)?` လို optional field က တန်ဖိုးမရှိရင် `null` အနေနဲ့ ဖတ်ပါတယ်။ Decimal field အတွက် JavaScript number ကို TypeScript က လက်မခံပါဘူး။ ပမာဏတစ်ခုကို သင့် app ထဲ ဝင်လာတဲ့ အခန်းကတည်းက string အနေနဲ့ ထားပါ: form field တွေကို string အနေနဲ့ ဖတ်ပါ၊ API client တွေကိုလည်း ပမာဏတွေကို string အနေနဲ့ ပို့ခိုင်းပါ — ဘာလို့လဲဆိုတော့ `"0.123456789012345678"` ကို JSON number အနေနဲ့ parse လုပ်လိုက်တာက သင့် code မမြင်ခင် ဂဏန်းတွေ ကျသွားပြီးသားပါ။ သင့် code က ပမာဏတစ်ခုကို တွက်ချက်ခဲ့ရင် — [Multiply and round](#မြှောက်ခြင်းနဲ့-round-လုပ်ခြင်း-multiply-and-round) မှာ ပြထားသလို — cents နဲ့ ဒါမှမဟုတ် decimal library တစ်ခုနဲ့ တွက်ပြီး library ရဲ့ string ကို ပေးပို့ပါ။

TypeScript က decimal field အတွက် string မှန်သမျှ လက်ခံပါတယ် — ဂဏန်းမဟုတ်တဲ့ string တွေပါ။ ဒါကြောင့် မရေးခင် input ကို validate လုပ်ပါ။ PostgreSQL က `"abc"` လိုမျိုး တန်ဖိုးကို `invalid input syntax for type numeric` နဲ့ ငြင်းပါတယ်။

Filter နဲ့ sorting တွေက decimal တန်ဖိုးတွေကို text အနေနဲ့ မဟုတ်ဘဲ ဂဏန်းအနေနဲ့ နှိုင်းယှဉ်ပါတယ် — ဒါကြောင့် `"9.50"` က `"10.00"` ရဲ့ အရှေ့မှာ ရပါတယ်။ နှိုင်းယှဉ်မယ့် တန်ဖိုးကို string အနေနဲ့ ပေးပို့ပါ:

```ts
const large = await db.orm.public.Order.where((o) => o.total.gt("10.00"))
  .orderBy((o) => o.total.asc())
  .all();
```

အသုံးပြုသူကို ပမာဏပြဖို့ `Intl.NumberFormat` နဲ့ format လုပ်ပါ။ ဒီအဆင့်အတွက်ပဲ JavaScript number ကို ပြောင်းတာက ဂဏန်း 15 လုံးအထိ ရှည်တဲ့ ဈေးနှုန်းတိုင်းအတွက် လုံခြုံပါတယ်:

```ts
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
usd.format(Number(order.total)); // "$19.99"
usd.format(order.totalCents / 100); // "$19.99"
```

cents နဲ့ ရှိတဲ့ `BigInt` field က `bigint` ဖြစ်ပြီး အပိုင်းကိန်းအဖြစ် ခွဲလို့ မရပါဘူး။ ပြီးတော့ အလွန်ကြီးတဲ့ ပမာဏတွေမှာ `Number(cents) / 100` က တစ်ပြား လွဲနိုင်ပါတယ်။ အဲဒီအစား အနုတ်မဟုတ်တဲ့ ပမာဏကို `bigint` arithmetic နဲ့ decimal string အဖြစ် ပြောင်းပါ — ဘယ်လောက်ကြီးကြီး အတိအကျ ဖြစ်ပါတယ်: `${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`။

## Column က ဘယ်လို Round လုပ်သလဲ (How the column rounds)

String က JavaScript ကနေ သင့်တန်ဖိုး ပြောင်းသွားတာကို တားပေးပေမယ့် — database ကတော့ သိမ်းတဲ့အခါ column ရဲ့ ဒဿမ နေရာအရေအတွက်အထိ round လုပ်ပါသေးတယ်။ `Numeric(10, 2)` column က ဒဿမ နေရာ နှစ်ခု ထိန်းပါတယ်။ တန်ဖိုးတစ်ခုက `1.005` လို အတိအကျ တစ်ဝက်ဖြစ်နေရင် — သုညကနေ ဝေးတဲ့ဘက်ကို round လုပ်ပြီး `1.01` ဖြစ်ပါတယ်။ `Decimal` column ကတော့ သင် ရေးလိုက်တဲ့အတိုင်း ထိန်းထားပါတယ်။

| သင် ရေးတာ | `Numeric(10, 2)` သိမ်းတာ | `Decimal` သိမ်းတာ |
| --- | --- | --- |
| `"19.99"` | `19.99` | `19.99` |
| `"1.005"` | `1.01` | `1.005` |
| `"2.675"` | `2.68` | `2.675` |
| `String(0.1 + 0.2)` | `0.30` | `0.30000000000000004` |

နောက်ဆုံး row က string ထဲမှာ သင် ဆိုလိုတဲ့ ပမာဏ ပါရမယ့် အကြောင်းကို ပြပါတယ်။ `Decimal` column က string ပြောသမျှ — JavaScript တွက်ချက်မှုက ထည့်ထားတဲ့ အမှိုက်တွေအပါအဝင် — သိမ်းပါတယ်။

ဒဿမအမှတ်ရှေ့မှာ column က ခွင့်ပြုတာထက် ဂဏန်း ပိုများတဲ့ တန်ဖိုးကို round မလုပ်ဘဲ ငြင်းပါတယ်။ `Numeric(10, 2)` column ထဲကို `"123456789.00"` ရေးရင် `numeric field overflow` ဆိုတဲ့ message နဲ့ error ထွက်ပါတယ်။ ဒါကို ကိုင်တွယ်ဖို့ error ရဲ့ `sqlState` — PostgreSQL ရဲ့ error code — ကို စစ်ပါ:

```ts
try {
  await db.orm.public.Order.create({ totalCents: 0, total: amount, taxRate: "0" });
} catch (error) {
  if (error instanceof Error && "sqlState" in error && error.sqlState === "22003") {
    // the amount is too large for the column
  } else {
    throw error;
  }
}
```

## Default တန်ဖိုးများ (Defaults)

Default တစ်ခုမှာ သူ့ column ထက် ဒဿမ နေရာ ပိုများလို့ မရပါဘူး။ Contract ထဲမှာ အဲဒါက ရိုးရိုး ဂဏန်းတစ်ခုပါ:

```prisma
fee Numeric(10, 2) @default(1.50)
```

အဲဒီ field ပေါ်မှာ `@default(1.505)` ဆိုရင် error ဖြစ်ပြီး `npx prisma contract emit` က `PSL_INVALID_DEFAULT_LITERAL` အနေနဲ့ ဖော်ပြပါတယ်။ [Default values](/docs/prisma/psl-syntax) မှာ type တစ်ခုချင်းစီ လက်ခံတာကို စာရင်းပြထားပါတယ်။

## စုစုပေါင်းနဲ့ ပျမ်းမျှ (Totals and averages)

ပမာဏတွေကို database ကိုပဲ ပေါင်းခိုင်းပါ — အတိအကျ ပေါင်းပေးလို့ပါ။ `aggregate` က model ရဲ့ row တွေပေါ်မှာ sum ဒါမှမဟုတ် average ကို run လုပ်ပါတယ်:

```ts
const totals = await db.orm.public.Order.aggregate((a) => ({
  total: a.sum("total"), // "43.97"
  totalCents: a.sum("totalCents"), // 4397
  averageCents: a.avgDecimal("totalCents"), // "879.4000000000000000"
}));
```

Row တချို့ကိုပဲ ပေါင်းချင်ရင် `db.orm.public.Order.where((o) => o.total.gt("10.00")).aggregate(...)` လိုမျိုး filter ကို အရင်ထားပါ။ `sum` က decimal column အတွက် string ပြန်ပေးပြီး `Int` column အတွက် `number` ပြန်ပေးပါတယ်။ Row တစ်ခုမှ မကိုက်ညီရင် sum နဲ့ average တိုင်းက `null` ဖြစ်ပါတယ်။ `Int` စုစုပေါင်းက `Number.MAX_SAFE_INTEGER` — 9 quadrillion လောက် — ကို ကျော်နိုင်ရင် `bigint` ပြန်ပေးတဲ့ `sumBigInt` ကို သုံးပါ။

Integer cents ရဲ့ average အတွက် `avgDecimal` ကို သုံးပါ။ `avg("totalCents")` က JavaScript `number` ပြန်ပေးပြီး — တစ်ပြားရဲ့ သုံးပုံတစ်ပုံလို average မှာ အတိအကျဖြစ်တဲ့ JavaScript number မရှိပါဘူး။ `avgDecimal` ကတော့ average ကို string အနေနဲ့ ပြန်ပေးပြီး PostgreSQL က significant digit အနည်းဆုံး 16 လုံးအထိ round ပေးပါတယ် — ငွေကြေးအတွက် လိုတာထက် အများကြီး ပိုပါတယ်။ Decimal column ပေါ်မှာတော့ `avg` နဲ့ `avgDecimal` က string အတူတူပဲ ပြန်ပေးပါတယ်။ Average မှာ ပြချင်တာထက် ဒဿမ နေရာ ပိုများနေတတ်လို့ — နောက် section မှာ ပြထားသလို decimal library နဲ့ round ပါ။ [`aggregate()`](https://www.prisma.io/docs/orm/reference/orm-client#aggregate) မှာ function တိုင်းနဲ့ သူ့ result type ကို စာရင်းပြထားပါတယ်။

## မြှောက်ခြင်းနဲ့ Round လုပ်ခြင်း (Multiply and round)

Line total ဒါမှမဟုတ် tax ပမာဏဆိုတာ မြှောက်ခြင်းတစ်ခုပါ၊ ပြီးတော့ သူ့ result မှာ ငွေကြေးထက် ဒဿမ နေရာ ပိုများနိုင်လို့ ဘယ်နေရာမှာ round မလဲ ဆုံးဖြတ်ရပါမယ်။ အဲဒါကို [Decimal.js](https://mikemcl.github.io/decimal.js/) လို decimal library တစ်ခုနဲ့ လုပ်ပါ:

#### bun

```bash
bun add decimal.js
```

#### pnpm

```bash
pnpm add decimal.js
```

#### yarn

```bash
yarn add decimal.js
```

#### npm

```bash
npm install decimal.js
```

```ts
import Decimal from "decimal.js";

const netCents = 1999 * 3; // 5997, exact
const taxCents = new Decimal(netCents)
  .mul(order.taxRate) // 434.7825
  .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
  .toNumber(); // 435
```

Whole quantity နဲ့ မြှောက်တဲ့အခါ — result က `Number.MAX_SAFE_INTEGER` (cents နဲ့ဆို ဒေါ်လာ 90 trillion လောက်) ထက် မကြီးသရွေ့ — JavaScript မှာ အတိအကျ ဖြစ်ပါတယ်။ Rate နဲ့ တွက်တဲ့ အဆင့်တစ်ခုပဲ library လိုပါတယ်။ Decimal field အတွက် decimal string ပြန်ယူဖို့ `toFixed` ကို သုံးပါ — ဥပမာ `new Decimal(order.total).plus("0.01").toFixed(2)`။

## Prisma ORM 7 ကနေ ပြောင်းလာသူများအတွက် (Coming from Prisma ORM 7)

* `Decimal @db.Decimal(10, 2)` က အခု `Numeric(10, 2)` ဖြစ်ပါပြီ။ Contract ထဲက လိုင်းကို ကိုယ်တိုင် ပြင်ပြီး `npx prisma contract emit` ကို run ပါ။ Column က `numeric(10,2)` အတိုင်းပဲ ရှိလို့ migration မလိုပါဘူး။ `Decimal` တစ်ခုတည်းကတော့ ဒဿမ နေရာ သတ်မှတ်မထားတဲ့ `numeric` column အတိုင်းပဲ ဖြစ်ပါတယ်။
* `Prisma.Decimal` မရှိတော့ပါဘူး။ Decimal field က Decimal.js object မဟုတ်ဘဲ string အနေနဲ့ ဖတ်ပြီး string အနေနဲ့ပဲ ရေးပါတယ်။ `Prisma.Decimal` က Decimal.js ဖြစ်ခဲ့လို့ — `npm install decimal.js` နဲ့ ကိုယ်တိုင် install ပြီး `.plus()` ဒါမှမဟုတ် `.toFixed()` မခေါ်ခင် field တန်ဖိုးကို wrap လုပ်ပါ — ဥပမာ `new Decimal(order.total).plus("1.00")`။
* [Coming from Prisma ORM 7](/docs/prisma/coming-from-prisma-orm-7) မှာ ကျန်တဲ့ type အပြောင်းအလဲတွေကို စာရင်းပြထားပါတယ်။

## MongoDB အတွက် (MongoDB)

MongoDB မှာ အတိအကျ decimal ဆိုတာ `Decimal128` type ရဲ့ field ဖြစ်ပြီး အဲဒါလည်း သင့် code ဆီ string အနေနဲ့ ရောက်လာလို့ ဂဏန်း တစ်လုံးမှ မပျောက်ပါဘူး။ `Int32` ဒါမှမဟုတ် `Int64` field ထဲက integer cents တွေက PostgreSQL မှာလိုပဲ အလုပ်လုပ်ပါတယ်။ [MongoDB data modeling](/docs/prisma/mongodb) မှာ field types တွေကို စာရင်းပြထားပါတယ်။

## ဆက်စပ်ဖတ်ရန် (Related pages)

- [`MongoDB data modeling`](/docs/prisma/mongodb): MongoDB အတွက် document တွေ၊ embedded document တွေနဲ့ reference တွေကို model လုပ်ပါ၊ ပြီးတော့ ဘယ်အခါ embed လုပ်မလဲ ဘယ်အခါ reference လုပ်မလဲ ဆုံးဖြတ်ပါ။
- [`Relational data modeling`](/docs/prisma/relational-databases): PostgreSQL အတွက် one-to-one၊ one-to-many၊ many-to-many နဲ့ polymorphic relation တွေကို model လုပ်ပါ။
