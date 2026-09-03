---
title: "Row Security Policies (row လုံခြုံရေး မူဝါဒများ)"
description: "Row security policy ဆိုတာ ဘာလဲ — rows တွေကို user/role အလိုက် ကန့်သတ်ခြင်း၊ CREATE/ALTER/DROP POLICY, permissive နဲ့ restrictive policies, RLS ဥပမာများ"
order: 30
source: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html"
status: translated
updated: 2026-09-03
---

## 5.9. Row Security Policies (row လုံခြုံရေး မူဝါဒများ)

[GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command ကနေ ရရှိနိုင်တဲ့ SQL-standard [privilege system (ခွင့်ပြုချက် စနစ်)](/docs/postgresql/ddl-priv) အပြင် — table တွေမှာ *row security policies* (row လုံခြုံရေး မူဝါဒများ) ဆိုတာလည်း ရှိနိုင်ပါတယ်။ ဒီ policies တွေက user တစ်ဦးချင်းစီအလိုက် — ပုံမှန် query တွေကနေ ပြန်ရနိုင်တဲ့ row တွေ ဒါမှမဟုတ် data modification command တွေကနေ insert, update ဒါမှမဟုတ် delete လုပ်လို့ရတဲ့ row တွေကို ကန့်သတ်ပေးပါတယ်။ ဒီ feature ကို *Row-Level Security* (row အဆင့် လုံခြုံရေး) လို့လည်း ခေါ်ပါတယ်။ ပုံမှန်အားဖြင့်တော့ table တွေမှာ policy တစ်ခုမှ မရှိပါဘူး — ဒါကြောင့် SQL privilege system အရ user တစ်ယောက်က table တစ်ခုအပေါ် access privileges ရှိနေရင် — အဲဒီ table ထဲက row အားလုံးကို query လုပ်ဖို့ဖြစ်စေ update လုပ်ဖို့ဖြစ်စေ — တန်းတူ ရနိုင်ပါတယ်။

Table တစ်ခုပေါ်မှာ row security ကို enable လုပ်လိုက်တဲ့အခါ ([ALTER TABLE ... ENABLE ROW LEVEL SECURITY](https://www.postgresql.org/docs/current/sql-altertable.html) နဲ့) — အဲဒီ table က row တွေကို ရွေးဖို့ဖြစ်စေ ပြုပြင်ဖို့ဖြစ်စေ လုပ်တဲ့ ပုံမှန် access အားလုံးကို row security policy တစ်ခုက ခွင့်ပြုထားမှသာ ရပါတယ်။ (ဒါပေမယ့် — table ရဲ့ owner ကိုတော့ row security policies တွေက ပုံမှန်အားဖြင့် သက်ရောက်မှု မရှိပါဘူး။) Table အတွက် policy တစ်ခုမှ မရှိဘူးဆိုရင် — default-deny policy (ပုံမှန်အားဖြင့် ငြင်းပယ်တဲ့ policy) ကို သုံးပါတယ် — ဆိုလိုတာက row တစ်ခုမှ မမြင်ရသလို — ပြုပြင်လို့လည်း မရပါဘူး။ `TRUNCATE` နဲ့ `REFERENCES` လို table တစ်ခုလုံးကို သက်ရောက်တဲ့ operations တွေကတော့ row security နဲ့ မသက်ဆိုင်ပါဘူး။

Row security policies တွေက command တွေအတွက်ပဲ ဖြစ်စေ — role တွေအတွက်ပဲ ဖြစ်စေ — နှစ်ခုလုံးအတွက်ပဲ ဖြစ်စေ သီးသန့် သတ်မှတ်နိုင်ပါတယ်။ Policy တစ်ခုကို `ALL` commands တွေအတွက် ဒါမှမဟုတ် `SELECT`, `INSERT`, `UPDATE`, `DELETE` တစ်ခုခုအတွက် သက်ရောက်အောင် သတ်မှတ်နိုင်ပါတယ်။ Policy တစ်ခုအတွက် role အများကြီးကို သတ်မှတ်ပေးလို့ရပြီး — ပုံမှန် role membership (role အဖွဲ့ဝင်ဖြစ်မှု) နဲ့ inheritance (အမွေဆက်ခံမှု) စည်းမျဉ်းတွေ သက်ရောက်ပါတယ်။

Policy တစ်ခုအရ ဘယ် rows တွေက မြင်ရမယ် ဒါမှမဟုတ် ပြုပြင်လို့ရမယ်ဆိုတာ သတ်မှတ်ဖို့ — Boolean result (အမှန်/အမှား ရလဒ်) ပြန်ပေးတဲ့ expression တစ်ခု လိုအပ်ပါတယ်။ ဒီ expression ကို user ရဲ့ query ကနေ လာတဲ့ conditions ဒါမှမဟုတ် functions တွေ မလုပ်ဆောင်ခင် — row တစ်ခုချင်းစီအတွက် အကဲဖြတ်ပေးပါတယ်။ (ဒီစည်းမျဉ်းရဲ့ တစ်ခုတည်းသော ချွင်းချက်တွေကတော့ `leakproof` functions တွေပါ — ဒါတွေက သတင်းအချက်အလက် မပေါက်ကြားစေဘူးလို့ အာမခံထားလို့ — optimizer က ဒီလို functions တွေကို row-security check မတိုင်ခင် ကြိုပြီး အသုံးပြုဖို့ ရွေးချယ်နိုင်ပါတယ်။) Expression က `true` ကို ပြန်မပေးတဲ့ rows တွေကိုတော့ process လုပ်မှာ မဟုတ်ပါဘူး။ မြင်ရတဲ့ rows တွေနဲ့ ပြုပြင်ခွင့်ရှိတဲ့ rows တွေကို သီးခြား ထိန်းချုပ်နိုင်ဖို့ — expression တွေကို သီးခြားစီ သတ်မှတ်လို့လည်း ရပါတယ်။ Policy expressions တွေကို query ရဲ့ အစိတ်အပိုင်းအနေနဲ့ — query ကို run နေတဲ့ user ရဲ့ privileges တွေနဲ့ပဲ run လုပ်ပါတယ်။ ဒါပေမယ့် — call လုပ်တဲ့ user အတွက် မရနိုင်တဲ့ data တွေကို ဝင်ရောက်ဖို့ security-definer functions တွေကိုတော့ သုံးနိုင်ပါတယ်။

Superusers တွေနဲ့ `BYPASSRLS` attribute ရှိတဲ့ roles တွေက table တစ်ခုကို access လုပ်တဲ့အခါ row security system ကို အမြဲတမ်း bypass (ကျော်လွှား) လုပ်ပါတယ်။ Table owners တွေကလည်း ပုံမှန်အားဖြင့် row security ကို bypass လုပ်ပါတယ် — ဒါပေမယ့် table owner တစ်ယောက်က [ALTER TABLE ... FORCE ROW LEVEL SECURITY](https://www.postgresql.org/docs/current/sql-altertable.html) နဲ့ ကိုယ်တိုင် row security ကို လိုက်နာရမယ့် အနေအထားမျိုး ရွေးချယ်လို့လည်း ရပါတယ်။

Row security ကို enable ဒါမှမဟုတ် disable လုပ်ခြင်းနဲ့ table တစ်ခုထဲကို policies တွေ ထည့်ခြင်းက — table owner တစ်ယောက်တည်းရဲ့ သီးသန့် privilege (ခွင့်ပြုချက်) အမြဲ ဖြစ်ပါတယ်။

Policies တွေကို [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html) command နဲ့ ဖန်တီးပြီး — [ALTER POLICY](https://www.postgresql.org/docs/current/sql-alterpolicy.html) command နဲ့ ပြုပြင် — [DROP POLICY](https://www.postgresql.org/docs/current/sql-droppolicy.html) command နဲ့ ဖျက်ပါတယ်။ Table တစ်ခုအတွက် row security ကို enable ဒါမှမဟုတ် disable လုပ်ဖို့ကတော့ [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) command ကို သုံးပါတယ်။

Policy တစ်ခုချင်းစီမှာ နာမည် တစ်ခု ရှိပြီး — table တစ်ခုအတွက် policy အများကြီး သတ်မှတ်လို့ရပါတယ်။ Policies တွေက table တစ်ခုချင်းစီနဲ့ သီးသန့် ဆက်စပ်နေတာမို့ — table တစ်ခုရဲ့ policy တစ်ခုချင်းစီမှာ ထူးခြားတဲ့ နာမည် (unique name) ရှိရပါမယ်။ Table မတူညီတဲ့ နေရာတွေမှာတော့ — နာမည် တူညီတဲ့ policies တွေ ရှိနေလို့ရပါတယ်။

Query တစ်ခုကို policy အများကြီး သက်ရောက်နေရင် — ဒါတွေကို `OR` (permissive policies — ပုံမှန် ဖြစ်တဲ့ ခွင့်ပြုတတ်တဲ့ policies တွေအတွက်) ဒါမှမဟုတ် `AND` (restrictive policies — တင်းကျပ်တဲ့ policies တွေအတွက်) သုံးပြီး ပေါင်းစပ်ပါတယ်။ `OR` အပြုအမူက — role တစ်ခုက သူ အဖွဲ့ဝင်ဖြစ်တဲ့ roles အားလုံးရဲ့ privileges တွေကို ရတယ်ဆိုတဲ့ စည်းမျဉ်းနဲ့ ဆင်တူပါတယ်။ Permissive နဲ့ restrictive policies တွေရဲ့ ခြားနားချက်ကို အောက်မှာ ထပ်ပြီး ဆွေးနွေးပါမယ်။

ရိုးရှင်းတဲ့ ဥပမာ တစ်ခုအနေနဲ့ — `managers` role ရဲ့ အဖွဲ့ဝင်တွေပဲ `account` relation ပေါ်က rows တွေကို — သူတို့ကိုယ်ပိုင် accounts တွေရဲ့ rows တွေကိုပဲ — access လုပ်နိုင်အောင် policy တစ်ခု ဘယ်လို ဖန်တီးရမလဲ ကြည့်ရအောင်:

```sql
CREATE TABLE accounts (manager text, company text, contact_email text);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY account_managers ON accounts TO managers
    USING (manager = current_user);
```

အပေါ်က policy က — သူ့ရဲ့ `USING` clause နဲ့ တူညီတဲ့ `WITH CHECK` clause တစ်ခုကို သွယ်ဝိုက် (implicitly) ပံ့ပိုးပေးပါတယ်။ ဒါကြောင့် ဒီကန့်သတ်ချက်က command တစ်ခုက ရွေးချယ်လိုက်တဲ့ rows တွေအပေါ်ရော (manager တစ်ယောက်က တခြား manager တစ်ယောက်ရဲ့ ရှိပြီးသား rows တွေကို `SELECT`, `UPDATE` ဒါမှမဟုတ် `DELETE` လုပ်လို့ မရအောင်) — command တစ်ခုက ပြုပြင်လိုက်တဲ့ rows တွေအပေါ်ပါ (တခြား manager တစ်ယောက်ရဲ့ rows တွေကို `INSERT` ဒါမှမဟုတ် `UPDATE` ကနေ ဖန်တီးလို့ မရအောင်) သက်ရောက်ပါတယ်။

Role တစ်ခုမှ သတ်မှတ်မထားရင် ဒါမှမဟုတ် အထူး user name ဖြစ်တဲ့ `PUBLIC` ကို သုံးထားရင် — policy က system ပေါ်က user အားလုံးကို သက်ရောက်ပါတယ်။ `users` table တစ်ခုထဲမှာ user တိုင်း ကိုယ့်ရဲ့ row တစ်ခုကိုပဲ access လုပ်နိုင်အောင် — ရိုးရှင်းတဲ့ policy တစ်ခု သုံးနိုင်ပါတယ်:

```sql
CREATE POLICY user_policy ON users
    USING (user_name = current_user);
```

ဒါက အပေါ်က ဥပမာနဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ်။

Table ထဲကို အသစ် ထည့်နေတဲ့ rows တွေအတွက် — မြင်ရတဲ့ rows တွေအတွက်နဲ့ မတူညီတဲ့ policy တစ်ခုကို သုံးချင်ရင် — policy အများကြီးကို ပေါင်းစပ်နိုင်ပါတယ်။ ဒီ policy အတွဲက user အားလုံးကို `users` table ထဲက row အားလုံး ကြည့်ခွင့် ပေးပေမယ့် — ကိုယ့်ရဲ့ rows တွေကိုပဲ ပြုပြင်ခွင့် ပေးပါလိမ့်မယ်:

```sql
CREATE POLICY user_sel_policy ON users
    FOR SELECT
    USING (true);
CREATE POLICY user_mod_policy ON users
    USING (user_name = current_user);
```

`SELECT` command တစ်ခုထဲမှာတော့ ဒီ policy နှစ်ခုကို `OR` နဲ့ ပေါင်းစပ်လို့ — ရလဒ် အနေနဲ့ row အားလုံးကို ရွေးချယ်လို့ရပါတယ်။ တခြား command type တွေမှာတော့ ဒုတိယ policy ကပဲ သက်ရောက်တာမို့ — အကျိုးသက်ရောက်မှုက အရင်ကလိုပဲ တူညီပါတယ်။

Row security ကို `ALTER TABLE` command နဲ့လည်း disable လုပ်လို့ရပါတယ်။ Row security ကို disable လုပ်တာက table ပေါ်မှာ သတ်မှတ်ထားတဲ့ policies တွေကို ဖယ်ရှားပေးတာ မဟုတ်ပါဘူး — ဒါတွေကို ရိုးရိုးလေး လျစ်လျူရှုလိုက်တာပဲ ဖြစ်ပါတယ်။ ဒါဆိုရင် table ထဲက row အားလုံးက standard SQL privilege system ရဲ့ သတ်မှတ်ချက်တွေနဲ့အညီ — မြင်လို့ရပြီး ပြုပြင်လို့လည်း ရပါတယ်။

အောက်မှာတော့ — ဒီ feature ကို production environments (လက်တွေ့ ပတ်ဝန်းကျင်များ) တွေမှာ ဘယ်လို သုံးနိုင်လဲဆိုတဲ့ ပိုကြီးတဲ့ ဥပမာ တစ်ခု ဖြစ်ပါတယ်။ `passwd` table က Unix password file တစ်ခုကို အတုယူ (emulate) ထားတာပါ:

```sql
-- Simple passwd-file based example
CREATE TABLE passwd (
  user_name             text UNIQUE NOT NULL,
  pwhash                text,
  uid                   int  PRIMARY KEY,
  gid                   int  NOT NULL,
  real_name             text NOT NULL,
  home_phone            text,
  extra_info            text,
  home_dir              text NOT NULL,
  shell                 text NOT NULL
);

CREATE ROLE admin;  -- Administrator
CREATE ROLE bob;    -- Normal user
CREATE ROLE alice;  -- Normal user

-- Populate the table
INSERT INTO passwd VALUES
  ('admin','xxx',0,0,'Admin','111-222-3333',null,'/root','/bin/dash');
INSERT INTO passwd VALUES
  ('bob','xxx',1,1,'Bob','123-456-7890',null,'/home/bob','/bin/zsh');
INSERT INTO passwd VALUES
  ('alice','xxx',2,1,'Alice','098-765-4321',null,'/home/alice','/bin/zsh');

-- Be sure to enable row-level security on the table
ALTER TABLE passwd ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Administrator can see all rows and add any rows
CREATE POLICY admin_all ON passwd TO admin USING (true) WITH CHECK (true);
-- Normal users can view all rows
CREATE POLICY all_view ON passwd FOR SELECT USING (true);
-- Normal users can update their own records, but
-- limit which shells a normal user is allowed to set
CREATE POLICY user_mod ON passwd FOR UPDATE
  USING (current_user = user_name)
  WITH CHECK (
    current_user = user_name AND
    shell IN ('/bin/bash','/bin/sh','/bin/dash','/bin/zsh','/bin/tcsh')
  );

-- Allow admin all normal rights
GRANT SELECT, INSERT, UPDATE, DELETE ON passwd TO admin;
-- Users only get select access on public columns
GRANT SELECT
  (user_name, uid, gid, real_name, home_phone, extra_info, home_dir, shell)
  ON passwd TO public;
-- Allow users to update certain columns
GRANT UPDATE
  (pwhash, real_name, home_phone, extra_info, shell)
  ON passwd TO public;
```

လုံခြုံရေး settings တွေ အားလုံးမှာ ဖြစ်သလိုပဲ — system က မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်နေလားဆိုတာ စမ်းသပ်ပြီး သေချာစေဖို့ အရေးကြီးပါတယ်။ အပေါ်က ဥပမာကို သုံးကြည့်ရင် — permission system က ကောင်းမွန်စွာ အလုပ်လုပ်နေတာကို ဒီမှာ တွေ့ရပါတယ်။

```sql
-- admin can view all rows and fields
postgres=> set role admin;
SET
postgres=> table passwd;
 user_name | pwhash | uid | gid | real_name |  home_phone  | extra_info | home_dir    |   shell
-----------+--------+-----+-----+-----------+--------------+------------+-------------+-----------
 admin     | xxx    |   0 |   0 | Admin     | 111-222-3333 |            | /root       | /bin/dash
 bob       | xxx    |   1 |   1 | Bob       | 123-456-7890 |            | /home/bob   | /bin/zsh
 alice     | xxx    |   2 |   1 | Alice     | 098-765-4321 |            | /home/alice | /bin/zsh
(3 rows)

-- Test what Alice is able to do
postgres=> set role alice;
SET
postgres=> table passwd;
ERROR:  permission denied for table passwd
postgres=> select user_name,real_name,home_phone,extra_info,home_dir,shell from passwd;
 user_name | real_name |  home_phone  | extra_info | home_dir    |   shell
-----------+-----------+--------------+------------+-------------+-----------
 admin     | Admin     | 111-222-3333 |            | /root       | /bin/dash
 bob       | Bob       | 123-456-7890 |            | /home/bob   | /bin/zsh
 alice     | Alice     | 098-765-4321 |            | /home/alice | /bin/zsh
(3 rows)

postgres=> update passwd set user_name = 'joe';
ERROR:  permission denied for table passwd
-- Alice is allowed to change her own real_name, but no others
postgres=> update passwd set real_name = 'Alice Doe';
UPDATE 1
postgres=> update passwd set real_name = 'John Doe' where user_name = 'admin';
UPDATE 0
postgres=> update passwd set shell = '/bin/xx';
ERROR:  new row violates WITH CHECK OPTION for "passwd"
postgres=> delete from passwd;
ERROR:  permission denied for table passwd
postgres=> insert into passwd (user_name) values ('xxx');
ERROR:  permission denied for table passwd
-- Alice can change her own password; RLS silently prevents updating other rows
postgres=> update passwd set pwhash = 'abc';
UPDATE 1
```

အခုအထိ တည်ဆောက်ခဲ့တဲ့ policies တွေ အားလုံးက permissive policies (ခွင့်ပြုတတ်တဲ့ policies) တွေပါ — ဆိုလိုတာက policy အများကြီး သက်ရောက်နေတဲ့အခါ "OR" Boolean operator နဲ့ ပေါင်းစပ်ပါတယ်။ Permissive policies တွေကို ရည်ရွယ်ထားတဲ့ အခြေအနေတွေမှာပဲ rows တွေကို access ခွင့်ပြုတဲ့ ပုံစံမျိုး တည်ဆောက်နိုင်ပေမယ့် — permissive policies တွေနဲ့ restrictive policies (record တွေ မဖြစ်မနေ ကျော်ဖြတ်ရပြီး "AND" Boolean operator နဲ့ ပေါင်းစပ်တဲ့ policies) တွေကို ပေါင်းစပ်တာက ပိုပြီး ရိုးရှင်းနိုင်ပါတယ်။ အပေါ်က ဥပမာကို ဆက်ပြီး — administrator က `passwd` table ရဲ့ records တွေကို access လုပ်ဖို့ local Unix socket တစ်ခုကနေ ချိတ်ဆက်ထားရမယ်လို့ လိုအပ်တဲ့ restrictive policy တစ်ခု ထပ်ထည့်ကြည့်ပါမယ်:

```sql
CREATE POLICY admin_local_only ON passwd AS RESTRICTIVE TO admin
    USING (pg_catalog.inet_client_addr() IS NULL);
```

ဒါဆိုရင် — restrictive policy ကြောင့် network ကနေ ချိတ်ဆက်ထားတဲ့ administrator တစ်ယောက်က record တစ်ခုမှ မမြင်ရတာကို အောက်မှာ မြင်ရပါတယ်:

```
=> SELECT current_user;
 current_user
--------------
 admin
(1 row)

=> select inet_client_addr();
 inet_client_addr
------------------
 127.0.0.1
(1 row)

=> TABLE passwd;
 user_name | pwhash | uid | gid | real_name | home_phone | extra_info | home_dir | shell
-----------+--------+-----+-----+-----------+------------+------------+----------+-------
(0 rows)

=> UPDATE passwd set pwhash = NULL;
UPDATE 0
```

Referential integrity checks တွေ — unique ဒါမှမဟုတ် primary key constraints နဲ့ foreign key references လိုမျိုးပေါ့ — ဒါတွေက data integrity ထိန်းသိမ်းနိုင်ဖို့ row security ကို အမြဲတမ်း bypass လုပ်ပါတယ်။ Schemas နဲ့ row level policies တွေ တည်ဆောက်တဲ့အခါ — ဒီလို referential integrity checks တွေကတစ်ဆင့် "covert channel" (လျှို့ဝှက် လမ်းကြောင်း) သုံးပြီး သတင်းအချက်အလက် ပေါက်ကြားမှုတွေ မဖြစ်အောင် သတိထားရပါမယ်။

Context တချို့မှာ — row security ကို အသုံးမချဘူးဆိုတာ သေချာစေဖို့ အရေးကြီးပါတယ်။ ဥပမာ — backup (အရန်ကူး) တစ်ခု လုပ်တဲ့အခါ row security က row တချို့ကို backup ထဲကနေ တိတ်တဆိတ် ချန်လှပ်သွားခဲ့ရင် — အဲဒါက ဆိုးဝါးတဲ့ အကျိုးဆက် ဖြစ်စေနိုင်ပါတယ်။ ဒီလို အခြေအနေမျိုးမှာ — [row_security](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-ROW-SECURITY) configuration parameter ကို `off` လို့ သတ်မှတ်နိုင်ပါတယ်။ ဒါက row security ကို bypass လုပ်ပေးတာ မဟုတ်ပါဘူး — ဒါက လုပ်ပေးတာက — query တစ်ခုရဲ့ ရလဒ်တွေကို policy တစ်ခုက filter လုပ်မယ်ဆိုရင် error တစ်ခု ထုတ်ပစ်လိုက်တာပါ။ ဒါဆိုရင် error ရဲ့ အကြောင်းရင်းကို စုံစမ်းပြီး ပြုပြင်နိုင်ပါတယ်။

အပေါ်က ဥပမာတွေမှာ policy expressions တွေက access လုပ်ခံရမယ့် ဒါမှမဟုတ် update လုပ်ခံရမယ့် row ထဲက လက်ရှိ values တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။ ဒါက အရိုးရှင်းဆုံး ဖြစ်ပြီး performance အကောင်းဆုံး အခြေအနေပါ — ဖြစ်နိုင်ရင် row security applications တွေကို ဒီနည်းအတိုင်း အလုပ်လုပ်အောင် ဒီဇိုင်းဆွဲတာ အကောင်းဆုံးပါ။ Policy ဆုံးဖြတ်ချက် တစ်ခု ချဖို့ တခြား rows တွေ ဒါမှမဟုတ် တခြား tables တွေကို စစ်ဆေးဖို့ လိုအပ်ရင် — policy expressions တွေထဲမှာ sub-`SELECT`s တွေ ဒါမှမဟုတ် `SELECT`s တွေ ပါဝင်တဲ့ functions တွေကို သုံးပြီး ဆောင်ရွက်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီလို access တွေက သတိမထားရင် သတင်းအချက်အလက် ပေါက်ကြားမှုကို ခွင့်ပြုနိုင်တဲ့ race conditions (ပြိုင်ဆိုင်မှု အခြေအနေများ) တွေ ဖန်တီးနိုင်တာ သတိပြုပါ။ ဥပမာအနေနဲ့ — အောက်က table design ကို ကြည့်ကြည့်ပါ:

```sql
-- definition of privilege groups
CREATE TABLE groups (group_id int PRIMARY KEY,
                     group_name text NOT NULL);

INSERT INTO groups VALUES
  (1, 'low'),
  (2, 'medium'),
  (5, 'high');

GRANT ALL ON groups TO alice;  -- alice is the administrator
GRANT SELECT ON groups TO public;

-- definition of users' privilege levels
CREATE TABLE users (user_name text PRIMARY KEY,
                    group_id int NOT NULL REFERENCES groups);

INSERT INTO users VALUES
  ('alice', 5),
  ('bob', 2),
  ('mallory', 2);

GRANT ALL ON users TO alice;
GRANT SELECT ON users TO public;

-- table holding the information to be protected
CREATE TABLE information (info text,
                          group_id int NOT NULL REFERENCES groups);

INSERT INTO information VALUES
  ('barely secret', 1),
  ('slightly secret', 2),
  ('very secret', 5);

ALTER TABLE information ENABLE ROW LEVEL SECURITY;

-- a row should be visible to/updatable by users whose security group_id is
-- greater than or equal to the row's group_id
CREATE POLICY fp_s ON information FOR SELECT
  USING (group_id <= (SELECT group_id FROM users WHERE user_name = current_user));
CREATE POLICY fp_u ON information FOR UPDATE
  USING (group_id <= (SELECT group_id FROM users WHERE user_name = current_user));

-- we rely only on RLS to protect the information table
GRANT ALL ON information TO public;
```

အခု — `alice` က "slightly secret" (အနည်းငယ် လျှို့ဝှက်) အချက်အလက်ကို ပြောင်းလဲချင်ပေမယ့် — အဲဒီ row ရဲ့ အကြောင်းအရာ အသစ်ကို `mallory` ကို ယုံကြည်လို့ မရဘူးလို့ ဆုံးဖြတ်လိုက်တယ်ဆိုပါစို့ — ဒါကြောင့် သူမက ဒီလို လုပ်ပါတယ်:

```sql
BEGIN;
UPDATE users SET group_id = 1 WHERE user_name = 'mallory';
UPDATE information SET info = 'secret from mallory' WHERE group_id = 2;
COMMIT;
```

ဒါက လုံခြုံတယ်လို့ ထင်ရပါတယ် — `mallory` က "secret from mallory" ဆိုတဲ့ string ကို မြင်နိုင်မယ့် အချိန်ကွာဟချက် (window) ဆိုတာ မရှိပါဘူး။ ဒါပေမယ့် — ဒီမှာ race condition တစ်ခု ရှိပါတယ်။ `mallory` က တစ်ပြိုင်နက် (concurrently) ဒီလိုမျိုး လုပ်နေတယ်ဆိုပါစို့ — ဥပမာ

```sql
SELECT * FROM information WHERE group_id = 2 FOR UPDATE;
```

ပြီးတော့ သူမရဲ့ transaction က `READ COMMITTED` mode မှာ ရှိနေရင် — သူမ "secret from mallory" ကို မြင်နိုင်ဖို့ ဖြစ်နိုင်ပါတယ်။ ဒါက သူမရဲ့ transaction က `alice` ရဲ့ transaction ပြီးဆုံးပြီး ခဏအကြာမှာ `information` row ဆီ ရောက်သွားရင် ဖြစ်ပါတယ်။ အဲဒီအခါ — `alice` ရဲ့ transaction commit လုပ်ဖို့ စောင့်ပြီး block ဖြစ်နေပြီးနောက် — `FOR UPDATE` clause ကြောင့် update လုပ်ထားတဲ့ row contents အသစ်ကို ပြန်ယူပါတယ်။ ဒါပေမယ့် — `users` ကနေ သွယ်ဝိုက် (implicit) `SELECT` လုပ်တာအတွက်ကတော့ update လုပ်ထားတဲ့ row အသစ်ကို ပြန်မယူပါဘူး — အကြောင်းက အဲဒီ sub-`SELECT` မှာ `FOR UPDATE` မပါလို့ပါ။ အဲဒီအစား `users` row ကို query စတင်ချိန်မှာ ယူထားတဲ့ snapshot နဲ့ ဖတ်ပါတယ်။ ဒါကြောင့် policy expression က `mallory` ရဲ့ privilege level အဟောင်းကို စမ်းသပ်ပြီး — update လုပ်ထားတဲ့ row ကို သူမ မြင်ခွင့် ရစေပါတယ်။

ဒီပြဿနာကို ရှောင်ရှားဖို့ နည်းလမ်း အများကြီး ရှိပါတယ်။ ရိုးရှင်းတဲ့ အဖြေ တစ်ခုက — row security policies တွေထဲက sub-`SELECT`s တွေမှာ `SELECT ... FOR SHARE` ကို သုံးတာပါ။ ဒါပေမယ့် — အဲဒါက referenced table (ဒီမှာ `users`) အပေါ်မှာ သက်ရောက်တဲ့ `UPDATE` privilege ကို သက်ရောက်မှု ခံရမယ့် users တွေကို grant လုပ်ဖို့ လိုအပ်တာမို့ — မလိုလားအပ်တဲ့ ကိစ္စ ဖြစ်နိုင်ပါတယ်။ (ဒါပေမယ့် — သူတို့ အဲဒီ privilege ကို တကယ် အသုံးမချနိုင်အောင် တခြား row security policy တစ်ခု ထားလို့ရပါတယ် — ဒါမှမဟုတ် sub-`SELECT` ကို security definer function တစ်ခုထဲမှာ ထည့်သွင်းထားလို့လည်း ရပါတယ်။) ပြီးတော့ — referenced table ပေါ်မှာ row share locks တွေကို တစ်ပြိုင်နက် အသုံးပြုမှု များနေတာက performance ပြဿနာ တစ်ခု ဖြစ်စေနိုင်ပါတယ် — အထူးသဖြင့် update တွေ မကြာခဏ ဖြစ်နေရင် ပိုဆိုးပါတယ်။ နောက်ထပ် ဖြေရှင်းနည်း တစ်ခုကတော့ — referenced table ရဲ့ update တွေ မကြာခဏ မဟုတ်ဘူးဆိုရင် လက်တွေ့ ကျတဲ့ နည်းလမ်း ဖြစ်ပြီး — referenced table ကို update လုပ်တဲ့အခါ `ACCESS EXCLUSIVE` lock တစ်ခု ယူလိုက်တာပါ — ဒါဆိုရင် တစ်ပြိုင်နက် run နေတဲ့ transaction တစ်ခုမှ row values အဟောင်းတွေကို စစ်ဆေးနေတာ မရှိတော့ပါဘူး။ ဒါမှမဟုတ် — referenced table ရဲ့ update တစ်ခုကို commit လုပ်ပြီးနောက် — လုံခြုံရေး အခြေအနေ အသစ်ကို အားကိုးတဲ့ အပြောင်းအလဲတွေ မလုပ်ခင် — တစ်ပြိုင်နက် run နေတဲ့ transaction အားလုံး ပြီးဆုံးတဲ့အထိ စောင့်ဆိုင်းလိုက်ရုံပါပဲ။

နောက်ထပ် အသေးစိတ်အတွက် [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html) နဲ့ [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) ကို ကြည့်ပါ။
