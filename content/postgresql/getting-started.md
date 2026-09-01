---
title: "PostgreSQL မိတ်ဆက်"
description: "PostgreSQL ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်ပြီး server စတင်မလဲ — psql နဲ့ database အသစ် ဖန်တီးတာအထိ"
order: 1
source: "https://www.postgresql.org/docs/current/tutorial-start.html"
status: translated
updated: 2026-09-01
---

## PostgreSQL ဆိုတာ ဘာလဲ

**PostgreSQL** က open-source **object-relational database management system**
(ORDBMS) တစ်ခုပါ — ၁၉၉၆ ကစပြီး နှစ်ပေါင်း ၃၀ ကျော် တိုးတက် ပြောင်းလဲလာတဲ့
ရင့်ကျက်တဲ့ database engine ဖြစ်ပြီး — ကမ္ဘာ့အစွမ်းထက်ဆုံး open-source
relational database တွေထဲက တစ်ခုလို့ သတ်မှတ်ခံထားရပါတယ်။

PostgreSQL ရဲ့ အဓိက အားသာချက်တွေကတော့:

- **ACID compliant** — Atomicity, Consistency, Isolation, Durability ဆိုတဲ့
  စံနှုန်း လေးရပ်ကို အပြည့်အဝ လိုက်နာတာမို့ data တွေ ယုံကြည်စိတ်ချရပါတယ်
- **SQL standard ကို ကျယ်ကျယ်ပြန့်ပြန့် ထောက်ပံ့ခြင်း** — standard SQL နဲ့
  ရေးထားတဲ့ query တွေက database အမျိုးမျိုးမှာလည်း အလားတူ အလုပ်လုပ်ပါတယ်
- **Extensible** — custom data type, function, operator တွေကို ကိုယ်တိုင်
  ထပ်ထည့်လို့ရပါတယ်
- Object-relational ဖြစ်လို့ — relational table တွေအပြင် inheritance လို
  object-oriented အင်္ဂါရပ်တွေပါ ပါဝင်ပါတယ်

PostgreSQL က **client/server architecture** ကို သုံးပါတယ် — server ဘက်မှာ
`postgres` ဆိုတဲ့ server process က request တွေကို လက်ခံပြီး database တွေကို
manage လုပ်ပါတယ်။ Client ဘက်ကတော့ `psql` လို program တွေက server နဲ့
ချိတ်ဆက်ပြီး SQL query တွေ ပို့ပါတယ်။

## Installation နဲ့ Server စတင်ခြင်း

PostgreSQL install လုပ်တာက operating system ပေါ် မူတည်ပြီး ကွဲပြားပါတယ် —
Linux မှာ package manager (`apt`, `dnf` စသည်), macOS မှာ Homebrew,
Windows မှာ official installer ကို သုံးလေ့ရှိပါတယ်။ Install ပြီးရင်
server process ကို စတင်ဖို့လိုပါတယ်:

```bash
# Linux (systemd သုံးတဲ့ distro တွေမှာ)
sudo systemctl start postgresql

# macOS (Homebrew နဲ့ install ထားရင်)
brew services start postgresql
```

Windows မှာတော့ PostgreSQL က Windows service အနေနဲ့ run ပြီး — install
လုပ်တုန်းက configure လုပ်ထားတဲ့အတိုင်း system နဲ့အတူ အလိုအလျောက်
စတင်ပါတယ်။

## psql — Interactive Shell

**psql** က PostgreSQL ရဲ့ interactive terminal program ပါ — SQL command
တွေကို တိုက်ရိုက် ရိုက်ထည့်ပြီး ရလဒ်ကို ချက်ချင်း ကြည့်လို့ရပါတယ်။
Install လုပ်တုန်းက default admin user က `postgres` ဖြစ်ပါတယ်:

```bash
psql -U postgres
```

ဒါဆိုရင် `postgres=#` ဆိုတဲ့ prompt ပေါ်လာပြီး — ဒီကနေ SQL command တွေ
ရိုက်ထည့်လို့ရပါပြီ။ `psql` မှာ backslash (`\`) နဲ့ စတဲ့ built-in command
တွေ ရှိပါတယ် — database စာရင်း ကြည့်ဖို့ `\l`, psql ကနေ ထွက်ဖို့ `\q`:

```sql
postgres=# \l
```

`\l` က server ပေါ်က database အားလုံးရဲ့ စာရင်းကို ပြပေးပါတယ်။
`\q` ရိုက်ရင် psql က ပိတ်ပြီး shell ကို ပြန်ရောက်သွားပါတယ်။

## Database အသစ် ဖန်တီးခြင်း

Server ကို စစ်ဆေးဖို့ ပထမဆုံး လုပ်လေ့ရှိတာက database အသစ် တစ်ခု
ဖန်တီးတာပါ။ psql ထဲမှာ SQL command နဲ့ ဒီလို ဖန်တီးပါတယ်:

```sql
CREATE DATABASE mydb;
```

Command က မှန်ကန်ရင် `CREATE DATABASE` ဆိုတဲ့ response ပြန်လာပါလိမ့်မယ်။
Database name က စာလုံး (alphabetic) နဲ့ စရပြီး အရှည်ဆုံး 63 bytes အထိ
ဖြစ်နိုင်ပါတယ်။ Terminal ကနေ တိုက်ရိုက် ဖန်တီးချင်ရင် `createdb mydb`
ဆိုတဲ့ command လည်း သုံးလို့ရပါတယ်။

## Role (User) ဖန်တီးပြီး ချိတ်ဆက်ခြင်း

PostgreSQL ရဲ့ user account (role) တွေက operating system ရဲ့ user account
တွေနဲ့ သီးခြားစီ ဖြစ်ပါတယ်။ Login လို့ရတဲ့ role အသစ် တစ်ခုကို ဒီလို
ဖန်တီးပါတယ်:

```sql
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword';
```

ပြီးရင် `mydb` database ကို သုံးခွင့်ရအောင် grant လုပ်ပေးပါ:

```sql
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

ဒါက database အဆင့် ခွင့်ပြုချက်ပါ — table တွေ ဖန်တီးသုံးဖို့ အတွက်တော့
PostgreSQL version ပေါ် မူတည်ပြီး schema/table အဆင့် ခွင့်ပြုချက် သီးခြား
လိုနိုင်ပါတယ်။ အခု အဲဒီ user နဲ့ database ထဲကို ဝင်ကြည့်ရအောင်:

```bash
psql -d mydb -U myuser
```

`-d` က database name, `-U` က user name ပါ။ ဒါဆိုရင် `mydb=>` prompt နဲ့
database ထဲ ရောက်ပါပြီ — SQL command တွေ စမ်းရေးလို့ရပါပြီ။

## နောက်တစ်ဆင့်တွေ

- [SQL အခြေခံ](/docs/postgresql/sql-basics) — table ဖန်တီးတာ, data ထည့်တာ,
  query လုပ်တာ စတဲ့ SQL အခြေခံတွေ ဆက်လေ့လာပါ
- Official docs: https://www.postgresql.org/docs/current/tutorial.html
