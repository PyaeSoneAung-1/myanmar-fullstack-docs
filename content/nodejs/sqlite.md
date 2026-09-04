---
title: "SQLite"
description: "node:sqlite module — SQLite databases တွေနဲ့ အလုပ်လုပ်ဖို့ DatabaseSync, StatementSync, SQLTagStore, backup, session extensions စသည့် APIs များ"
order: 127
source: "https://nodejs.org/api/sqlite.html"
status: translated
updated: 2026-09-04
---

> Stability: 1.2 - Release candidate.

`node:sqlite` module က SQLite databases တွေနဲ့ အလုပ်လုပ်ရာမှာ အဆင်ပြေချောမွေ့စေပါတယ်။ ၎င်းကို ဝင်ရောက်သုံးဖို့:

```mjs
import sqlite from 'node:sqlite';
```

```cjs
const sqlite = require('node:sqlite');
```

ဒီ module ကို `node:` scheme အောက်မှာပဲ ရရှိနိုင်ပါတယ်။ SQL trace events တွေကို [`diagnostics_channel`][] module ကနေတစ်ဆင့် ကြည့်ရှုနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`'sqlite.db.query'`][] ကို ကြည့်ပါ။

အောက်ပါ ဥပမာက in-memory database တစ်ခုကို ဖွင့်ပြီး — database ထဲကို data တွေ ရေးပြီး — အဲဒီ data တွေကို ပြန်ဖတ်ဖို့ `node:sqlite` module ရဲ့ အခြေခံ အသုံးပြုပုံကို ဖော်ပြပါတယ်။

```mjs
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Finalize the prepared statement once it is no longer needed.
insert.close();
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
query.close();
```

```cjs
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Finalize the prepared statement once it is no longer needed.
insert.close();
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
query.close();
```

## JavaScript နဲ့ SQLite အကြား Type conversion (Type conversion between JavaScript and SQLite)

Node.js က SQLite ဆီကို ရေးတဲ့အခါ သို့မဟုတ် SQLite ကနေ ဖတ်တဲ့အခါ — JavaScript data types တွေနဲ့ SQLite ရဲ့ [data types][] တွေကြားမှာ ပြောင်းလဲခြင်း (conversion) ပြုလုပ်ဖို့ လိုအပ်ပါတယ်။ JavaScript က SQLite ထက် data types အမျိုးအစား ပိုများတာကြောင့် JavaScript types တွေရဲ့ အစိတ်အပိုင်း (subset) တစ်ခုကိုပဲ support လုပ်ပါတယ်။ Support မလုပ်တဲ့ data type တစ်ခုကို SQLite ဆီ ရေးဖို့ ကြိုးစားရင် exception တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

| Storage class | JavaScript to SQLite | SQLite to JavaScript |
| --- | --- | --- |
| `NULL` | {null} | {null} |
| `INTEGER` | {number}, {bigint}, or {boolean} | {number} or {bigint} _(configurable)_ |
| `REAL` | {number} | {number} |
| `TEXT` | {string} | {string} |
| `BLOB` | {TypedArray}, {DataView}, {ArrayBuffer}, or {SharedArrayBuffer} | {Uint8Array} |

Booleans တွေကို `INTEGER` တန်ဖိုး `1` နဲ့ `0` အနေနဲ့ ရေးသားပါတယ်။ တခြား `INTEGER` တန်ဖိုးတွေလိုပဲ — ၎င်းတို့ကို default အနေနဲ့ {number} အဖြစ် ပြန်ဖတ်ပြီး — BigInts ဖတ်ခြင်းကို enable လုပ်ထားရင် {bigint} တန်ဖိုးတွေ (`1n` နဲ့ `0n`) အဖြစ် ပြန်ဖတ်ပါတယ်။ Signed 64-bit integer တစ်ခုထဲမှာ မဆံ့တဲ့ {bigint} တစ်ခုကို ရေးသားရင် `ERR_INVALID_ARG_VALUE` error တစ်ခု throw လုပ်ပါတယ်။

SQLite ကနေ တန်ဖိုးတွေ ဖတ်တဲ့ APIs တွေမှာ `INTEGER` တန်ဖိုးတွေကို JavaScript ထဲမှာ `number` အဖြစ် ပြောင်းမလား `bigint` အဖြစ် ပြောင်းမလားဆိုတာ ဆုံးဖြတ်ပေးတဲ့ configuration option တစ်ခု ပါဝင်ပါတယ် — ဥပမာ statements တွေအတွက် `readBigInts` option နဲ့ user-defined functions တွေအတွက် `useBigIntArguments` option တို့ပါ။ Node.js က SQLite ကနေ JavaScript ရဲ့ [safe integer][] range အပြင်ဘက်မှာ ရှိတဲ့ `INTEGER` တန်ဖိုးတစ်ခုကို ဖတ်ပြီး — BigInts ဖတ်ဖို့ option ကို enable မလုပ်ထားဘူးဆိုရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

## Class: `DatabaseSync`

ဒီ class က SQLite database တစ်ခုဆီကို [connection][] တစ်ခုတည်းကို ကိုယ်စားပြုပါတယ်။ ဒီ class က expose လုပ်ထားတဲ့ APIs အားလုံးက synchronously (တစ်ပြိုင်နက်တည်း) run လုပ်ပါတယ်။

### `new DatabaseSync(path[, options])`

* `path` {string | Buffer | URL} Database ရဲ့ path ပါ။ SQLite database တစ်ခုကို file တစ်ခုထဲမှာ သို့မဟုတ် [in memory][] ထဲမှာ လုံးဝ သိမ်းဆည်းနိုင်ပါတယ်။ File-backed database တစ်ခု သုံးဖို့ဆိုရင် path က file path တစ်ခု ဖြစ်ရပါမယ်။ In-memory database တစ်ခု သုံးဖို့ဆိုရင် path က `':memory:'` ဆိုတဲ့ အထူး နာမည် ဖြစ်ရပါမယ်။
* `options` {Object} Database connection အတွက် configuration options တွေပါ။ အောက်ပါ options တွေကို support လုပ်ပါတယ်:
  * `open` {boolean} `true` ဆိုရင် constructor က database ကို ဖွင့်ပေးပါတယ်။ ဒီတန်ဖိုး `false` ဖြစ်နေရင် database ကို `open()` method ကနေတစ်ဆင့် ဖွင့်ရပါမယ်။ **Default:** `true`။
  * `readOnly` {boolean} `true` ဆိုရင် database ကို read-only mode နဲ့ ဖွင့်ပါတယ်။ Database မရှိသေးဘူးဆိုရင် ဖွင့်ခြင်းက မအောင်မြင်ပါဘူး။ **Default:** `false`။
  * `enableForeignKeyConstraints` {boolean} `true` ဆိုရင် foreign key constraints တွေကို enable လုပ်ပါတယ်။ ဒါက အကြံပြုထားပေမယ့် — legacy database schemas တွေနဲ့ လိုက်ဖက်ညီဖို့ disable လုပ်ထားနိုင်ပါတယ်။ Foreign key constraints တွေရဲ့ စစ်ဆေးခြင်းကို database ဖွင့်ပြီးနောက်မှာ [`PRAGMA foreign_keys`][] သုံးပြီး enable/disable လုပ်နိုင်ပါတယ်။ **Default:** `true`။
  * `enableDoubleQuotedStringLiterals` {boolean} `true` ဆိုရင် SQLite က [double-quoted string literals][] တွေကို လက်ခံပါလိမ့်မယ်။ ဒါက အကြံပြုစရာ မဟုတ်ပေမယ့် legacy database schemas တွေနဲ့ လိုက်ဖက်ညီဖို့ enable လုပ်ထားနိုင်ပါတယ်။ **Default:** `false`။
  * `allowExtension` {boolean} `true` ဆိုရင် `loadExtension` SQL function နဲ့ `loadExtension()` method ကို enable လုပ်ပါတယ်။ ဒီ feature ကို နောက်ပိုင်းမှာ `enableLoadExtension(false)` ခေါ်ပြီး disable လုပ်နိုင်ပါတယ်။ **Default:** `false`။
  * `timeout` {number} [busy timeout][] ကို millisecond နဲ့ ဖော်ပြပါတယ်။ ဒါက SQLite က error တစ်ခု ပြန်မပေးခင် database lock တစ်ခု လွတ်မလွတ်ကို စောင့်ဆိုင်းပေးမယ့် အများဆုံး အချိန် ဖြစ်ပါတယ်။ **Default:** `0`။
  * `readBigInts` {boolean} `true` ဆိုရင် integer fields တွေကို JavaScript `BigInt` တန်ဖိုးတွေအနေနဲ့ ဖတ်ပါတယ်။ `false` ဆိုရင် integer fields တွေကို JavaScript numbers တွေအနေနဲ့ ဖတ်ပါတယ်။ **Default:** `false`။
  * `returnArrays` {boolean} `true` ဆိုရင် query results တွေကို objects တွေအစား arrays တွေအနေနဲ့ ပြန်ပေးပါတယ်။ **Default:** `false`။
  * `allowBareNamedParameters` {boolean} `true` ဆိုရင် prefix character မပါပဲ named parameters တွေကို binding လုပ်ခွင့်ပေးပါတယ် (ဥပမာ `:foo` အစား `foo`)။ **Default:** `true`။
  * `allowUnknownNamedParameters` {boolean} `true` ဆိုရင် binding လုပ်တဲ့အခါ မသိတဲ့ (unknown) named parameters တွေကို လျစ်လျူရှုပါတယ်။ `false` ဆိုရင် မသိတဲ့ named parameters တွေအတွက် exception တစ်ခု throw လုပ်ပါတယ်။ **Default:** `false`။
  * `defensive` {boolean} `true` ဆိုရင် defensive flag ကို enable လုပ်ပါတယ်။ Defensive flag enable ဖြစ်နေတဲ့အခါ — သာမန် SQL နဲ့ database file ကို တမင်တကာ ပျက်စီးအောင် လုပ်နိုင်တဲ့ language features တွေကို disable လုပ်ပါတယ်။ Defensive flag ကို `enableDefensive()` သုံးပြီးလည်း သတ်မှတ်နိုင်ပါတယ်။ **Default:** `true`။
  * `limits` {Object} SQLite limits အမျိုးမျိုးအတွက် configuration ပါ။ ဒီ limits တွေကို အန္တရာယ်ရှိနိုင်ခြေ ရှိတဲ့ input တွေကို ကိုင်တွယ်ရာမှာ resource တွေ အလွန်အကျွံ သုံးစွဲမှုကို တားဆီးဖို့ သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် SQLite documentation ထဲက [Run-Time Limits][] နဲ့ [Limit Constants][] တွေကို ကြည့်ပါ။ Default တန်ဖိုးတွေကို SQLite ရဲ့ compile-time defaults တွေက သတ်မှတ်ပြီး — SQLite ကို ဘယ်လို build လုပ်ထားလဲပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။ အောက်ပါ properties တွေကို support လုပ်ပါတယ်:
    * `length` {number} String သို့မဟုတ် BLOB တစ်ခုရဲ့ အများဆုံး အရှည်ပါ။
    * `sqlLength` {number} SQL statement တစ်ခုရဲ့ အများဆုံး အရှည်ပါ။
    * `column` {number} Columns အများဆုံး အရေအတွက်ပါ။
    * `exprDepth` {number} Expression tree တစ်ခုရဲ့ အများဆုံး အနက်ပါ။
    * `compoundSelect` {number} Compound SELECT တစ်ခုထဲမှာ ပါဝင်နိုင်တဲ့ terms အများဆုံး အရေအတွက်ပါ။
    * `vdbeOp` {number} VDBE instructions အများဆုံး အရေအတွက်ပါ။
    * `functionArg` {number} Function arguments အများဆုံး အရေအတွက်ပါ။
    * `attach` {number} Attach လုပ်ထားနိုင်တဲ့ databases အများဆုံး အရေအတွက်ပါ။
    * `likePatternLength` {number} LIKE pattern တစ်ခုရဲ့ အများဆုံး အရှည်ပါ။
    * `variableNumber` {number} SQL variables အများဆုံး အရေအတွက်ပါ။
    * `triggerDepth` {number} Trigger recursion အများဆုံး အနက်ပါ။

`DatabaseSync` instance အသစ်တစ်ခုကို တည်ဆောက်ပါတယ်။

### `database.aggregate(name, options)`

Aggregate function အသစ်တစ်ခုကို SQLite database ထဲမှာ register လုပ်ပါတယ်။ ဒီ method က [`sqlite3_create_window_function()`][] ပေါ်က wrapper တစ်ခုပါ။

* `name` {string} ဖန်တီးမယ့် SQLite function ရဲ့ နာမည်ပါ။
* `options` {Object} Function configuration settings တွေပါ။
  * `deterministic` {boolean} `true` ဆိုရင် [`SQLITE_DETERMINISTIC`][] flag ကို ဖန်တီးလိုက်တဲ့ function ပေါ်မှာ သတ်မှတ်ပါတယ်။ **Default:** `false`။
  * `directOnly` {boolean} `true` ဆိုရင် [`SQLITE_DIRECTONLY`][] flag ကို ဖန်တီးလိုက်တဲ့ function ပေါ်မှာ သတ်မှတ်ပါတယ်။ **Default:** `false`။
  * `useBigIntArguments` {boolean} `true` ဆိုရင် `options.step` နဲ့ `options.inverse` တွေဆီကို ပေးပို့တဲ့ integer arguments တွေကို `BigInt` တွေအဖြစ် ပြောင်းလဲပါတယ်။ `false` ဆိုရင် integer arguments တွေကို JavaScript numbers တွေအနေနဲ့ ပေးပို့ပါတယ်။ **Default:** `false`။
  * `varargs` {boolean} `true` ဆိုရင် `options.step` နဲ့ `options.inverse` တွေကို arguments အရေအတွက် ဘယ်လောက်နဲ့မဆို (သုညကနေ [`SQLITE_MAX_FUNCTION_ARG`][] အထိ) ခေါ်ယူနိုင်ပါတယ်။ `false` ဆိုရင် `inverse` နဲ့ `step` တွေကို `length` arguments အတိအကျနဲ့ပဲ ခေါ်ယူရပါမယ်။ **Default:** `false`။
  * `start` {number | string | null | Array | Object | Function} Aggregation function ရဲ့ identity တန်ဖိုးပါ။ Aggregation function ကို initialize လုပ်တဲ့အခါ ဒီတန်ဖိုးကို သုံးပါတယ်။ {Function} တစ်ခု ပေးလိုက်ရင် identity က ၎င်းရဲ့ return value ဖြစ်ပါလိမ့်မယ်။
  * `step` {Function} Aggregation ထဲမှာ row တစ်ခုချင်းစီအတွက် ခေါ်ယူမယ့် function ပါ။ ဒီ function က လက်ရှိ state နဲ့ row value ကို လက်ခံရရှိပါတယ်။ ဒီ function ရဲ့ return value က state အသစ် ဖြစ်သင့်ပါတယ်။
  * `result` {Function} Aggregation ရဲ့ ရလဒ်ကို ရယူဖို့ ခေါ်ယူမယ့် function ပါ။ ဒီ function က နောက်ဆုံး state ကို လက်ခံရရှိပြီး — aggregation ရဲ့ ရလဒ်ကို ပြန်ပေးသင့်ပါတယ်။
  * `inverse` {Function} ဒီ function ကို ပေးထားတဲ့အခါ `aggregate` method က window function တစ်ခုအနေနဲ့ အလုပ်လုပ်ပါလိမ့်မယ်။ ဒီ function က လက်ရှိ state နဲ့ ဖယ်ရှားလိုက်တဲ့ row value ကို လက်ခံရရှိပါတယ်။ ဒီ function ရဲ့ return value က state အသစ် ဖြစ်သင့်ပါတယ်။

Window function တစ်ခုအနေနဲ့ သုံးတဲ့အခါ `result` function ကို အကြိမ်များစွာ ခေါ်ယူပါလိမ့်မယ်။

```cjs
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE t3(x, y);
  INSERT INTO t3 VALUES ('a', 4),
                        ('b', 5),
                        ('c', 3),
                        ('d', 8),
                        ('e', 1);
`);

db.aggregate('sumint', {
  start: 0,
  step: (acc, value) => acc + value,
});

using query = db.prepare('SELECT sumint(y) as total FROM t3');
query.get(); // { total: 21 }
```

```mjs
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE t3(x, y);
  INSERT INTO t3 VALUES ('a', 4),
                        ('b', 5),
                        ('c', 3),
                        ('d', 8),
                        ('e', 1);
`);

db.aggregate('sumint', {
  start: 0,
  step: (acc, value) => acc + value,
});

using query = db.prepare('SELECT sumint(y) as total FROM t3');
query.get(); // { total: 21 }
```

### `database.close()`

Database connection ကို ပိတ်ပါတယ်။ Database မဖွင့်ထားဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။ User-defined function, aggregate function, authorizer callback, သို့မဟုတ် [`'sqlite.db.query'`][] subscriber တစ်ခုထဲမှာလိုမျိုး — statement တစ်ခု run နေတုန်း ဒီ method ကို ခေါ်ယူရင် [`ERR_INVALID_STATE`][] error တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3_close_v2()`][] ပေါ်က wrapper တစ်ခုပါ။

### `database.loadExtension(path[, entryPoint])`

* `path` {string} Load လုပ်မယ့် shared library ရဲ့ path ပါ။
* `entryPoint` {string} Extension ရဲ့ entry-point function ရဲ့ နာမည်ပါ။ ချန်လှပ်ထားတဲ့အခါ SQLite က entry point ကို shared library ရဲ့ filename ကနေ ဆင်းသက် (derive) လုပ်ပါတယ် — ဆင်းသက်လာတဲ့ နာမည် မကိုက်ညီတဲ့အခါ ဒီ argument ကို ရှင်းရှင်းလင်းလင်း ပေးပို့ပါ။

Shared library တစ်ခုကို database connection ထဲကို load လုပ်ပါတယ်။ ဒီ method က [`sqlite3_load_extension()`][] ပေါ်က wrapper တစ်ခုပါ။ `DatabaseSync` instance ကို တည်ဆောက်တဲ့အခါ `allowExtension` option ကို enable လုပ်ထားဖို့ လိုအပ်ပါတယ်။

```mjs
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:', { allowExtension: true });

// Load using the entry point derived from the filename.
database.loadExtension('./decimal.dylib');

// Override the entry point when the derived name does not match.
database.loadExtension('./base64.dylib', 'sqlite3_base64_init');
```

```cjs
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:', { allowExtension: true });

// Load using the entry point derived from the filename.
database.loadExtension('./decimal.dylib');

// Override the entry point when the derived name does not match.
database.loadExtension('./base64.dylib', 'sqlite3_base64_init');
```

### `database.enableLoadExtension(allow)`

* `allow` {boolean} Extensions တွေကို load လုပ်ခွင့်ပြုမလား မပြုမလား။

`loadExtension` SQL function နဲ့ `loadExtension()` method ကို enable သို့မဟုတ် disable လုပ်ပါတယ်။ တည်ဆောက်ချိန်မှာ `allowExtension` က `false` ဖြစ်ခဲ့ရင် — လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် extension loading ကို enable လုပ်လို့ မရပါဘူး။

### `database.enableDefensive(active)`

* `active` {boolean} Defensive flag ကို သတ်မှတ်မလား မသတ်မှတ်လား။

Defensive flag ကို enable သို့မဟုတ် disable လုပ်ပါတယ်။ Defensive flag active ဖြစ်နေတဲ့အခါ — သာမန် SQL နဲ့ database file ကို တမင်တကာ ပျက်စီးအောင် လုပ်နိုင်တဲ့ language features တွေကို disable လုပ်ပါတယ်။ အသေးစိတ်အတွက် SQLite documentation ထဲက [`SQLITE_DBCONFIG_DEFENSIVE`][] ကို ကြည့်ပါ။

### `database.location([dbName])`

* `dbName` {string} Database ရဲ့ နာမည်ပါ။ ဒါက `'main'` (default primary database) သို့မဟုတ် [`ATTACH DATABASE`][] နဲ့ ထည့်သွင်းထားတဲ့ တခြား database တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ **Default:** `'main'`။
* Returns: {string | null} Database file ရဲ့ location ပါ။ In-memory database တစ်ခုကို သုံးနေတဲ့အခါ ဒီ method က null ကို ပြန်ပေးပါတယ်။

ဒီ method က [`sqlite3_db_filename()`][] ပေါ်က wrapper တစ်ခုပါ။

### `database.exec(sql)`

* `sql` {string} Run လုပ်မယ့် SQL string ပါ။

ဒီ method က SQL statements တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး — ဘယ်ရလဒ်ကိုမှ ပြန်မပေးပဲ run လုပ်နိုင်စေပါတယ်။ File တစ်ခုကနေ ဖတ်ထားတဲ့ SQL statements တွေကို run လုပ်တဲ့အခါ ဒီ method က အသုံးဝင်ပါတယ်။ ဒီ method က [`sqlite3_exec()`][] ပေါ်က wrapper တစ်ခုပါ။
### `database.function(name[, options], fn)`

* `name` {string} ဖန်တီးမယ့် SQLite function ရဲ့ နာမည်ပါ။
* `options` {Object} Function အတွက် ရွေးချယ်နိုင်တဲ့ configuration settings တွေပါ။ အောက်ပါ properties တွေကို support လုပ်ပါတယ်:
  * `deterministic` {boolean} `true` ဆိုရင် [`SQLITE_DETERMINISTIC`][] flag ကို ဖန်တီးလိုက်တဲ့ function ပေါ်မှာ သတ်မှတ်ပါတယ်။ **Default:** `false`။
  * `directOnly` {boolean} `true` ဆိုရင် [`SQLITE_DIRECTONLY`][] flag ကို ဖန်တီးလိုက်တဲ့ function ပေါ်မှာ သတ်မှတ်ပါတယ်။ **Default:** `false`။
  * `useBigIntArguments` {boolean} `true` ဆိုရင် `function` ဆီကို ပေးပို့တဲ့ integer arguments တွေကို `BigInt` တွေအဖြစ် ပြောင်းလဲပါတယ်။ `false` ဆိုရင် integer arguments တွေကို JavaScript numbers တွေအနေနဲ့ ပေးပို့ပါတယ်။ **Default:** `false`။
  * `varargs` {boolean} `true` ဆိုရင် `function` ကို arguments အရေအတွက် ဘယ်လောက်နဲ့မဆို (သုညကနေ [`SQLITE_MAX_FUNCTION_ARG`][] အထိ) ခေါ်ယူနိုင်ပါတယ်။ `false` ဆိုရင် `function` ကို `function.length` arguments အတိအကျနဲ့ပဲ ခေါ်ယူရပါမယ်။ **Default:** `false`။
* `fn` {Function} SQLite function ကို ခေါ်ယူတဲ့အခါ ခေါ်ယူမယ့် JavaScript function ပါ။ ဒီ function ရဲ့ return value က တရားဝင်တဲ့ SQLite data type တစ်ခု ဖြစ်ရပါမယ်: [Type conversion between JavaScript and SQLite][] ကို ကြည့်ပါ။ Return value က `undefined` ဖြစ်ရင် ရလဒ်က default အနေနဲ့ `NULL` ဖြစ်ပါတယ်။

ဒီ method က SQLite user-defined functions တွေကို ဖန်တီးဖို့ သုံးပါတယ်။ ဒီ method က [`sqlite3_create_function_v2()`][] ပေါ်က wrapper တစ်ခုပါ။

### `database.setAuthorizer(callback)`

* `callback` {Function|null} သတ်မှတ်မယ့် authorizer function ပါ — သို့မဟုတ် လက်ရှိ authorizer ကို ရှင်းဖို့ `null` ပါ။

SQLite က prepared statements တွေကနေတစ်ဆင့် data တွေကို ဝင်ရောက်ဖို့ သို့မဟုတ် database schema ကို ပြုပြင်ဖို့ ကြိုးစားတိုင်း ခေါ်ယူမယ့် authorizer callback တစ်ခုကို သတ်မှတ်ပါတယ်။ ဒါကို security policies တွေ အကောင်အထည်ဖော်ဖို့၊ access တွေကို စစ်ဆေးဖို့ (audit) သို့မဟုတ် သတ်မှတ်ထားတဲ့ လုပ်ဆောင်ချက်တွေကို ကန့်သတ်ဖို့ သုံးနိုင်ပါတယ်။ ဒီ method က [`sqlite3_set_authorizer()`][] ပေါ်က wrapper တစ်ခုပါ။

ခေါ်ယူလိုက်တဲ့အခါ callback က arguments ငါးခုကို လက်ခံရရှိပါတယ်:

* `actionCode` {number} လုပ်ဆောင်နေတဲ့ operation ရဲ့ အမျိုးအစားပါ (ဥပမာ `SQLITE_INSERT`, `SQLITE_UPDATE`, `SQLITE_SELECT`)။
* `arg1` {string|null} ပထမ argument ပါ (context ပေါ် မူတည်ပြီး — မကြာခဏ table name တစ်ခု ဖြစ်တတ်ပါတယ်)။
* `arg2` {string|null} ဒုတိယ argument ပါ (context ပေါ် မူတည်ပြီး — မကြာခဏ column name တစ်ခု ဖြစ်တတ်ပါတယ်)။
* `dbName` {string|null} Database ရဲ့ နာမည်ပါ။
* `triggerOrView` {string|null} Access ကို ဖြစ်စေတဲ့ trigger သို့မဟုတ် view ရဲ့ နာမည်ပါ။

Callback က အောက်ပါ constants တွေထဲက တစ်ခုကို ပြန်ပေးရပါမယ်:

* `SQLITE_OK` - Operation ကို ခွင့်ပြုပါ။
* `SQLITE_DENY` - Operation ကို ငြင်းပယ်ပါ (error တစ်ခု ဖြစ်စေပါတယ်)။
* `SQLITE_IGNORE` - Operation ကို လျစ်လျူရှုပါ (တိတ်တဆိတ် ကျော်သွားပါ)။

SQLite က authorizer callback က ၎င်းကို ခေါ်ယူထားတဲ့ database connection ကို ပြုပြင်မွမ်းမံခြင်း မပြုရဘူးလို့ လိုအပ်ပါတယ် — အဲဒါမှာ statements တွေကို prepare လုပ်ခြင်းနဲ့ step လုပ်ခြင်းတွေလည်း ပါဝင်ပါတယ်။ အဲဒီလို လုပ်မယ့် methods တွေက callback က stack ပေါ်မှာ ရှိနေတုန်း `ERR_INVALID_STATE` code နဲ့ error တစ်ခု throw လုပ်ပါတယ် — အဲဒီထဲမှာ `database.prepare()`, `database.exec()`, အဲဒီ connection ရဲ့ statements တွေရဲ့ execution methods တွေ, iterators တွေ, tag stores တွေနဲ့ `database.setAuthorizer()` ကိုယ်တိုင်တို့ ပါဝင်ပါတယ်။ တခြား connections တွေကတော့ ပုံမှန်အတိုင်း သုံးနေနိုင်ပါတယ်။

Callback ကို `statement.run()`, `statement.get()` နဲ့ အလားတူ methods တွေထဲကနေလည်း ခေါ်ယူနိုင်ပါတယ် — အကြောင်းကတော့ schema တစ်ခု ပြောင်းလဲပြီးနောက်မှာ SQLite က statement တစ်ခုကို execution အတွင်း ပြန်-prepare (re-prepare) လုပ်တတ်လို့ပါ။

သီးခြားအနေနဲ့ — လက်ရှိ run နေတဲ့ statement တစ်ခုကို ပြန်ဝင်ရောက် (reenter) လုပ်လို့ မရပါဘူး။ ၎င်းပေါ်မှာ `statement.close()` ကို ခေါ်ယူရင် run နေတဲ့ virtual machine ကို လွတ်သွားစေပြီး — `statement.run()`, `statement.get()`, `statement.all()`, `statement.iterate()`, `iterator.next()`, `iterator.return()` သို့မဟုတ် ညီမျှတဲ့ tag store methods တွေကနေတစ်ဆင့် ပြန် run လုပ်ရင် အဲဒီ virtual machine ကို execution အလယ်မှာ ပြန်စ (reset) စေပါလိမ့်မယ်။ အဲဒါတွေအားလုံးက အဲဒီအစား `ERR_INVALID_STATE` error တစ်ခု throw လုပ်ပါတယ်။ ဒါက user-defined function တစ်ခုလိုမျိုး — execution အတွင်း SQLite က ခေါ်ယူတဲ့ ဘယ် callback မဆို သက်ရောက်ပါတယ်။ Connection ပေါ်က တခြား statements တွေကတော့ ပုံမှန်အတိုင်း သုံးနေနိုင်ပါတယ်။

SQLite state တစ်ခုကိုမှ မထိခိုက်စေတဲ့ operations တွေကတော့ callback ထဲကနေ ဆက်လက် ရရှိနိုင်ပါတယ်: `sqlTagStore.clear()` (cache လုပ်ထားတဲ့ statements တွေကိုပဲ ဖျက်ပါတယ်) နဲ့ ကုန်သွားပြီးသား (already-drained) iterator တစ်ခုပေါ်က `next()` နဲ့ `return()` (ဆက်ပြီး `{ done: true }` ပဲ ပြန်ပေးပါတယ်) တို့ပါ။

```cjs
const { DatabaseSync, constants } = require('node:sqlite');
const db = new DatabaseSync(':memory:');

// Set up an authorizer that denies all table creation
db.setAuthorizer((actionCode) => {
  if (actionCode === constants.SQLITE_CREATE_TABLE) {
    return constants.SQLITE_DENY;
  }
  return constants.SQLITE_OK;
});

// This will work
using query = db.prepare('SELECT 1');
query.get();

// This will throw an error due to authorization denial
try {
  db.exec('CREATE TABLE blocked (id INTEGER)');
} catch (err) {
  console.log('Operation blocked:', err.message);
}
```

```mjs
import { DatabaseSync, constants } from 'node:sqlite';
const db = new DatabaseSync(':memory:');

// Set up an authorizer that denies all table creation
db.setAuthorizer((actionCode) => {
  if (actionCode === constants.SQLITE_CREATE_TABLE) {
    return constants.SQLITE_DENY;
  }
  return constants.SQLITE_OK;
});

// This will work
using query = db.prepare('SELECT 1');
query.get();

// This will throw an error due to authorization denial
try {
  db.exec('CREATE TABLE blocked (id INTEGER)');
} catch (err) {
  console.log('Operation blocked:', err.message);
}
```

### `database.isOpen`

* Type: {boolean} Database က လက်ရှိ ဖွင့်ထားလား ပိတ်ထားလား။

### `database.isTransaction`

* Type: {boolean} Database က လက်ရှိ transaction တစ်ခုအတွင်းမှာ ရှိနေလားဆိုတာပါ။ ဒါက [`sqlite3_get_autocommit()`][] ပေါ်က wrapper တစ်ခုပါ။

### `database.limits`

* Type: {Object}

Run-time မှာ SQLite database limits တွေကို ရယူခြင်းနဲ့ သတ်မှတ်ခြင်းအတွက် object တစ်ခုပါ။ Property တစ်ခုချင်းစီက SQLite limit တစ်ခုနဲ့ ကိုက်ညီပြီး — ဖတ်လို့ရသလို ရေးလို့လည်း ရပါတယ်။

```js
const db = new DatabaseSync(':memory:');

// Read current limit
console.log(db.limits.length);

// Set a new limit
db.limits.sqlLength = 100000;

// Reset a limit to its compile-time maximum
db.limits.sqlLength = Infinity;
```

ရရှိနိုင်တဲ့ properties တွေကတော့: `length`, `sqlLength`, `column`, `exprDepth`, `compoundSelect`, `vdbeOp`, `functionArg`, `attach`, `likePatternLength`, `variableNumber`, `triggerDepth` တို့ပါ။

Property တစ်ခုကို `Infinity` အဖြစ် သတ်မှတ်လိုက်ရင် limit ကို ၎င်းရဲ့ compile-time အများဆုံး တန်ဖိုးဆီကို ပြန်စ (reset) လုပ်ပါတယ်။

### `database.open()`

`DatabaseSync` constructor ရဲ့ `path` argument ထဲမှာ သတ်မှတ်ထားတဲ့ database ကို ဖွင့်ပါတယ်။ ဒီ method ကို database ကို constructor ကနေတစ်ဆင့် မဖွင့်ထားတဲ့အခါမှသာ သုံးသင့်ပါတယ်။ Database က ဖွင့်ပြီးသား ဖြစ်နေရင် exception တစ်ခု throw လုပ်ပါတယ်။

### `database.serialize([dbName])`

* `dbName` {string} Serialize လုပ်မယ့် database ရဲ့ နာမည်ပါ။ ဒါက `'main'` (default primary database) သို့မဟုတ် [`ATTACH DATABASE`][] နဲ့ ထည့်သွင်းထားတဲ့ တခြား database တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ **Default:** `'main'`။
* Returns: {Uint8Array} Database ရဲ့ binary representation ပါ။

Database ကို `Uint8Array` တစ်ခုအနေနဲ့ ပြန်ပေးတဲ့ binary representation အဖြစ် serialize လုပ်ပါတယ်။ ဒါက in-memory database တစ်ခုကို သိမ်းဆည်းခြင်း၊ clone လုပ်ခြင်း သို့မဟုတ် လွှဲပြောင်းခြင်းတွေအတွက် အသုံးဝင်ပါတယ်။ ဒီ method က [`sqlite3_serialize()`][] ပေါ်က wrapper တစ်ခုပါ။

```mjs
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
db.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = db.serialize();
console.log(buffer.length); // Prints the byte length of the database
```

```cjs
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
db.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = db.serialize();
console.log(buffer.length); // Prints the byte length of the database
```

### `database.deserialize(buffer[, options])`

* `buffer` {Uint8Array} [`database.serialize()`][] ရဲ့ output လိုမျိုး — database တစ်ခုရဲ့ binary representation ပါ။
* `options` {Object} Deserialization အတွက် ရွေးချယ်နိုင်တဲ့ configuration ပါ။
  * `dbName` {string} Deserialize လုပ်မယ့် database ရဲ့ နာမည်ပါ။ **Default:** `'main'`။

Serialize လုပ်ထားတဲ့ database တစ်ခုကို ဒီ connection ထဲကို load လုပ်ပြီး — လက်ရှိ database ကို အစားထိုးပါတယ်။ Deserialize လုပ်လိုက်တဲ့ database က writable (ရေးလို့ရတဲ့) ဖြစ်ပါတယ်။ ရှိပြီးသား prepared statements တွေကို — ဒီ operation နောက်ပိုင်း မအောင်မြင်ခဲ့ရင်တောင် — deserialization ကို မကြိုးစားခင် finalize လုပ်ပါတယ်။ Database callback တစ်ခု stack ပေါ်မှာ ရှိနေတုန်း ဒီ method ကို ခေါ်ယူရင် — ဥပမာ user-defined function, aggregate function, authorizer, changeset filter သို့မဟုတ် conflict handler — [`ERR_INVALID_STATE`][] error တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3_deserialize()`][] ပေါ်က wrapper တစ်ခုပါ။

```mjs
import { DatabaseSync } from 'node:sqlite';

const original = new DatabaseSync(':memory:');
original.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
original.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = original.serialize();
original.close();

const clone = new DatabaseSync(':memory:');
clone.deserialize(buffer);
using query = clone.prepare('SELECT value FROM t');
console.log(query.get());
// Prints: { value: 'hello' }
```

```cjs
const { DatabaseSync } = require('node:sqlite');

const original = new DatabaseSync(':memory:');
original.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
original.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = original.serialize();
original.close();

const clone = new DatabaseSync(':memory:');
clone.deserialize(buffer);
using query = clone.prepare('SELECT value FROM t');
console.log(query.get());
// Prints: { value: 'hello' }
```

### `database.prepare(sql[, options])`

* `sql` {string} Prepared statement တစ်ခုအဖြစ် compile လုပ်မယ့် SQL string ပါ။
* `options` {Object} Prepared statement အတွက် ရွေးချယ်နိုင်တဲ့ configuration ပါ။
  * `readBigInts` {boolean} `true` ဆိုရင် integer fields တွေကို `BigInt` တွေအနေနဲ့ ဖတ်ပါတယ်။ **Default:** database options ကနေ အမွေဆက်ခံပြီး — မဟုတ်ရင် `false`။
  * `returnArrays` {boolean} `true` ဆိုရင် ရလဒ်တွေကို arrays တွေအနေနဲ့ ပြန်ပေးပါတယ်။ **Default:** database options ကနေ အမွေဆက်ခံပြီး — မဟုတ်ရင် `false`။
  * `allowBareNamedParameters` {boolean} `true` ဆိုရင် prefix character မပါပဲ named parameters တွေကို binding လုပ်ခွင့်ပေးပါတယ်။ **Default:** database options ကနေ အမွေဆက်ခံပြီး — မဟုတ်ရင် `true`။
  * `allowUnknownNamedParameters` {boolean} `true` ဆိုရင် မသိတဲ့ named parameters တွေကို လျစ်လျူရှုပါတယ်။ **Default:** database options ကနေ အမွေဆက်ခံပြီး — မဟုတ်ရင် `false`။
  * `persistent` {boolean} `true` ဆိုရင် ဒီ statement ကို အချိန်ကြာကြာ သိမ်းထားပြီး အကြိမ်များစွာ ပြန်သုံးဖွယ် ရှိတယ်ဆိုတဲ့ အချက်ကို SQLite ကို အသိပေးပါတယ်။ SQLite က လက်ရှိမှာ ဒီအချက်ကို lookaside memory ကို ရှောင်ရှားခြင်းဖြင့် တုံ့ပြန်ပါတယ်။ [`SQLITE_PREPARE_PERSISTENT`][] flag နဲ့ ကိုက်ညီပါတယ်။ **Default:** `false`။
* Returns: {StatementSync} Prepared statement ပါ။

SQL statement တစ်ခုကို [prepared statement][] တစ်ခုအဖြစ် compile လုပ်ပါတယ်။ ဒီ method က [`sqlite3_prepare_v3()`][] ပေါ်က wrapper တစ်ခုပါ။

### `database.createTagStore([maxSize])`

* `maxSize` {integer} Cache လုပ်မယ့် prepared statements တွေရဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1000`။
* Returns: {SQLTagStore} Prepared statements တွေကို cache လုပ်ဖို့ SQL tag store အသစ်တစ်ခုပါ။

Prepared statements တွေကို သိမ်းဆည်းဖို့ — Least Recently Used (LRU) cache တစ်ခု ဖြစ်တဲ့ [`SQLTagStore`][] အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ ဒါက prepared statements တွေကို unique identifier တစ်ခုနဲ့ tag လုပ်ပြီး ထိရောက်စွာ ပြန်သုံးနိုင်စေပါတယ်။

Tagged SQL literal တစ်ခုကို run လုပ်တဲ့အခါ `SQLTagStore` က ကိုက်ညီတဲ့ SQL query string အတွက် prepared statement တစ်ခု cache ထဲမှာ ရှိပြီးသားလားဆိုတာ စစ်ဆေးပါတယ်။ ရှိနေရင် cache လုပ်ထားတဲ့ statement ကို သုံးပါတယ်။ မရှိရင် prepared statement အသစ်တစ်ခုကို ဖန်တီး၊ run လုပ်ပြီး — နောက်ပိုင်း အသုံးပြုမှုတွေအတွက် cache ထဲမှာ သိမ်းထားပါတယ်။ ဒီယန္တရားက SQL statements တစ်ခုတည်းကို ထပ်ခါထပ်ခါ parse လုပ်ပြီး prepare လုပ်ရတဲ့ ဝန်ထုပ်ဝန်ပိုး (overhead) ကို ရှောင်ရှားဖို့ ကူညီပေးပါတယ်။

Tagged statements တွေက template literal ထဲက placeholder values တွေကို နောက်ခံ prepared statement ရဲ့ parameters တွေအဖြစ် bind လုပ်ပါတယ်။ ဥပမာ:

```js
sqlTagStore.get`SELECT ${value}`;
```

ဒါနဲ့ ညီမျှပါတယ်:

```js
using statement = db.prepare('SELECT ?');
statement.get(value);
```

ဒါပေမယ့် ပထမ ဥပမာမှာ tag store က နောက်ပိုင်း အသုံးပြုမှုတွေအတွက် နောက်ခံ prepared statement ကို cache လုပ်ပါလိမ့်မယ်။

> **Note:** Tagged statements တွေထဲက `${value}` syntax က parameter တစ်ခုကို prepared statement နဲ့ _bind_ (ချိတ်ဆက်) လုပ်ပါတယ်။ ဒါက string interpolation လုပ်ဆောင်တဲ့ _untagged_ template literals တွေထဲက အပြုအမူနဲ့ ကွဲပြားပါတယ်။
>
> ```js
> // This a safe example of binding a parameter to a tagged statement.
> sqlTagStore.run`INSERT INTO t1 (id) VALUES (${id})`;
>
> // This is an *unsafe* example of an untagged template string.
> // `id` is interpolated into the query text as a string.
> // This can lead to SQL injection and data corruption.
> db.run(`INSERT INTO t1 (id) VALUES (${id})`);
> ```

Tag store က query strings တွေ (bound placeholders တွေရဲ့ နေရာတွေ အပါအဝင်) တစ်ထပ်တည်း တူညီရင် statement တစ်ခုကို cache ထဲကနေ ကိုက်ညီအောင် ရှာပေးပါတယ်။

```js
// The following statements will match in the cache:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${12345} AND active = 1`;

// The following statements will not match, as the query strings
// and bound placeholders differ:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`SELECT * FROM t1 WHERE id = 12345 AND active = 1`;

// The following statements will not match, as matches are case-sensitive:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`select * from t1 where id = ${id} and active = 1`;
```

Tagged statements တွေထဲမှာ parameters တွေကို binding လုပ်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက `${value}` syntax ပဲ ဖြစ်ပါတယ်။ SQL query string ကိုယ်တိုင်ထဲကို parameter binding placeholders (`?` စသည်) တွေ ထပ်ထည့်လို့ မရပါဘူး။

```mjs
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
const sql = db.createTagStore();

db.exec('CREATE TABLE users (id INT, name TEXT)');

// Using the 'run' method to insert data.
// The tagged literal is used to identify the prepared statement.
sql.run`INSERT INTO users VALUES (1, 'Alice')`;
sql.run`INSERT INTO users VALUES (2, 'Bob')`;

// Using the 'get' method to retrieve a single row.
const name = 'Alice';
const user = sql.get`SELECT * FROM users WHERE name = ${name}`;
console.log(user); // { id: 1, name: 'Alice' }

// Using the 'all' method to retrieve all rows.
const allUsers = sql.all`SELECT * FROM users ORDER BY id`;
console.log(allUsers);
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ]
```

```cjs
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
const sql = db.createTagStore();

db.exec('CREATE TABLE users (id INT, name TEXT)');

// Using the 'run' method to insert data.
// The tagged literal is used to identify the prepared statement.
sql.run`INSERT INTO users VALUES (1, 'Alice')`;
sql.run`INSERT INTO users VALUES (2, 'Bob')`;

// Using the 'get' method to retrieve a single row.
const name = 'Alice';
const user = sql.get`SELECT * FROM users WHERE name = ${name}`;
console.log(user); // { id: 1, name: 'Alice' }

// Using the 'all' method to retrieve all rows.
const allUsers = sql.all`SELECT * FROM users ORDER BY id`;
console.log(allUsers);
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ]
```
### `database.createSession([options])`

* `options` {Object} Session အတွက် configuration options တွေပါ။
  * `table` {string} ပြောင်းလဲမှုတွေကို ခြေရာခံမယ့် သီးသန့် table တစ်ခုပါ။ Default အနေနဲ့ table အားလုံးရဲ့ ပြောင်းလဲမှုတွေကို ခြေရာခံပါတယ်။
  * `db` {string} ခြေရာခံမယ့် database ရဲ့ နာမည်ပါ။ [`ATTACH DATABASE`][] သုံးပြီး databases အများကြီး ထည့်ထားတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ **Default**: `'main'`။
* Returns: {Session} Session handle တစ်ခုပါ။

Session တစ်ခုကို ဖန်တီးပြီး database ထဲကို attach လုပ်ပါတယ်။ ဒီ method က [`sqlite3session_create()`][] နဲ့ [`sqlite3session_attach()`][] တို့ပေါ်က wrapper တစ်ခုပါ။

### `database.applyChangeset(changeset[, options])`

* `changeset` {Uint8Array} Binary changeset (သို့) patchset တစ်ခုပါ။

* `options` {Object} ပြောင်းလဲမှုတွေကို ဘယ်လို သက်ရောက်မလဲဆိုတဲ့ configuration options တွေပါ။
  * `filter` {Function} Changeset ထဲမှာ ပြောင်းလဲမှု အနည်းဆုံး တစ်ခုခုကြောင့် သက်ရောက်တဲ့ table တစ်ခုချင်းစီအတွက် — `filter` callback ကို table name ကို ပထမ argument အနေနဲ့ ပေးပြီး ခေါ်ယူပါတယ်။ Return value က falsy ဖြစ်ရင် table ဆီကို ဘယ်ပြောင်းလဲမှုကိုမှ သက်ရောက်ဖို့ ကြိုးစားမှာ မဟုတ်ပါဘူး။ ဒါမှမဟုတ် return value က truthy ဖြစ်ရင် သို့မဟုတ် `filter` callback မပေးထားဘူးဆိုရင် — table နဲ့ ဆက်စပ်တဲ့ ပြောင်းလဲမှုအားလုံးကို သက်ရောက်ဖို့ ကြိုးစားပါတယ်။
  * `onConflict` {Function} Conflicts တွေကို ဘယ်လို ကိုင်တွယ်မလဲဆိုတာ ဆုံးဖြတ်ပေးတဲ့ function တစ်ခုပါ။ ဒီ function က argument တစ်ခု လက်ခံရရှိပြီး — အဲဒါက အောက်ပါ တန်ဖိုးတွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

    * `SQLITE_CHANGESET_DATA`: `DELETE` သို့မဟုတ် `UPDATE` change တစ်ခုမှာ မျှော်လင့်ထားတဲ့ "before" တန်ဖိုးတွေ မပါဝင်ပါဘူး။
    * `SQLITE_CHANGESET_NOTFOUND`: `DELETE` သို့မဟုတ် `UPDATE` change ရဲ့ primary key နဲ့ ကိုက်ညီတဲ့ row တစ်ခု database ထဲမှာ မရှိပါဘူး။
    * `SQLITE_CHANGESET_CONFLICT`: `INSERT` change တစ်ခုက duplicate primary key တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။
    * `SQLITE_CHANGESET_FOREIGN_KEY`: Change တစ်ခုကို သက်ရောက်လိုက်ရင် foreign key violation တစ်ခု ဖြစ်ပေါ်စေမှာ ဖြစ်ပါတယ်။
    * `SQLITE_CHANGESET_CONSTRAINT`: Change တစ်ခုကို သက်ရောက်လိုက်ရင် `UNIQUE`, `CHECK`, သို့မဟုတ် `NOT NULL` constraint violation တစ်ခု ဖြစ်ပေါ်စေပါတယ်။

    ဒီ function က အောက်ပါ တန်ဖိုးတွေထဲက တစ်ခုကို ပြန်ပေးသင့်ပါတယ်:

    * `SQLITE_CHANGESET_OMIT`: Conflict ဖြစ်နေတဲ့ changes တွေကို ချန်လှပ်လိုက်ပါ။
    * `SQLITE_CHANGESET_REPLACE`: Conflict ဖြစ်နေတဲ့ changes တွေနဲ့ ရှိပြီးသား တန်ဖိုးတွေကို အစားထိုးပါ (`SQLITE_CHANGESET_DATA` သို့မဟုတ် `SQLITE_CHANGESET_CONFLICT` conflicts တွေနဲ့သာ တရားဝင်ပါတယ်)။
    * `SQLITE_CHANGESET_ABORT`: Conflict တစ်ခုကို ကြုံတွေ့တဲ့အခါ abort လုပ်ပြီး database ကို ပြန်လှိမ့် (roll back) လုပ်ပါ။

    Conflict handler ထဲမှာ error တစ်ခု throw လုပ်လိုက်တဲ့အခါ သို့မဟုတ် handler ကနေ တခြား တန်ဖိုးတစ်ခုခု ပြန်ပေးလိုက်တဲ့အခါ — changeset ကို သက်ရောက်ခြင်းကို ရပ်တန့် (abort) လုပ်ပြီး database ကို ပြန်လှိမ့် (roll back) လုပ်ပါတယ်။

    **Default**: `SQLITE_CHANGESET_ABORT` ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။

* Returns: {boolean} Changeset ကို မရပ်တန့်ပဲ အောင်မြင်စွာ သက်ရောက်ခဲ့လားဆိုတာပါ။

Database မဖွင့်ထားဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3changeset_apply()`][] ပေါ်က wrapper တစ်ခုပါ။

```mjs
import { DatabaseSync } from 'node:sqlite';

const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

using insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.
```

```cjs
const { DatabaseSync } = require('node:sqlite');

const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

using insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.
```

### `database[Symbol.dispose]()`

Database connection ကို ပိတ်ပါတယ်။ Database connection က ပိတ်ပြီးသား ဖြစ်နေရင် ဒါက no-op (ဘာမှ မလုပ်ပါဘူး)။

## Class: `Session`

### `session.changeset()`

* Returns: {Uint8Array} တခြား databases တွေဆီကို သက်ရောက်နိုင်တဲ့ binary changeset ပါ။

Changeset ဖန်တီးပြီးကတည်းက ဖြစ်ပေါ်ခဲ့တဲ့ ပြောင်းလဲမှုအားလုံး ပါဝင်တဲ့ changeset တစ်ခုကို ရယူပါတယ်။ အကြိမ်များစွာ ခေါ်ယူလို့ ရပါတယ်။ Database သို့မဟုတ် session က ဖွင့်မထားဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3session_changeset()`][] ပေါ်က wrapper တစ်ခုပါ။

### `session.patchset()`

* Returns: {Uint8Array} တခြား databases တွေဆီကို သက်ရောက်နိုင်တဲ့ binary patchset ပါ။

အထက်က method နဲ့ ဆင်တူပေမယ့် — ပိုပြီး ကျစ်လစ်တဲ့ patchset တစ်ခုကို ထုတ်ပေးပါတယ်။ SQLite ရဲ့ documentation ထဲက [Changesets and Patchsets][] ကို ကြည့်ပါ။ Database သို့မဟုတ် session က ဖွင့်မထားဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3session_patchset()`][] ပေါ်က wrapper တစ်ခုပါ။

### `session.close()`

Session ကို ပိတ်ပါတယ်။ Database သို့မဟုတ် session က ဖွင့်မထားဘူးဆိုရင် — သို့မဟုတ် session က လက်ရှိ changeset သို့မဟုတ် patchset တစ်ခုကို ထုတ်ပေးနေတုန်းဆိုရင် — exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က [`sqlite3session_delete()`][] ပေါ်က wrapper တစ်ခုပါ။

### `session[Symbol.dispose]()`

Session ကို ပိတ်ပါတယ်။ Session က ပိတ်ပြီးသား ဖြစ်နေရင် ဘာမှ မလုပ်ပါဘူး။

## Class: `StatementSync`

ဒီ class က [prepared statement][] တစ်ခုတည်းကို ကိုယ်စားပြုပါတယ်။ ဒီ class ကို ၎င်းရဲ့ constructor ကနေတစ်ဆင့် instantiate (ဥပမာ ဖန်တီး) လုပ်လို့ မရပါဘူး။ အဲဒီအစား — instances တွေကို `database.prepare()` method ကနေတစ်ဆင့် ဖန်တီးပါတယ်။ ဒီ class က expose လုပ်ထားတဲ့ APIs အားလုံးက synchronously run လုပ်ပါတယ်။

Prepared statement ဆိုတာ ၎င်းကို ဖန်တီးဖို့ သုံးခဲ့တဲ့ SQL ရဲ့ ထိရောက်တဲ့ binary representation တစ်ခုပါ။ Prepared statements တွေက parameterizable (parameter ထည့်လို့ရတဲ့) ဖြစ်ပြီး — bound values အမျိုးမျိုးနဲ့ အကြိမ်များစွာ ခေါ်ယူလို့ ရပါတယ်။ Parameters တွေက [SQL injection][] attacks တွေရဲ့ ရန်ကနေ ကာကွယ်မှုလည်း ပေးပါတယ်။ ဒီအကြောင်းတွေကြောင့် — user input တွေကို ကိုင်တွယ်တဲ့အခါ လက်နဲ့ရေးထားတဲ့ (hand-crafted) SQL strings တွေထက် prepared statements တွေကို ပိုပြီး ဦးစားပေးပါတယ်။

### Parameters binding ပြုလုပ်ခြင်း (Binding parameters)

`all()`, `get()`, `iterate()`, နဲ့ `run()` methods တွေက run လုပ်ခင် ၎င်းတို့ရဲ့ arguments တွေကို prepared statement ရဲ့ parameters တွေနဲ့ bind လုပ်ပါတယ်။ Parameters တွေက anonymous (အမည်မဲ့) သို့မဟုတ် named (အမည်တပ်ထား) ဆိုပြီး နှစ်မျိုး ရှိပါတယ်။

Anonymous parameters တွေကို SQL ထဲမှာ `?` အနေနဲ့ ရေးပြီး — method ဆီကို ပေးပို့လိုက်တဲ့ arguments တွေကနေ အစဉ်လိုက် bind လုပ်ပါတယ်။ `?NNN` ပုံစံက SQLite parameter index `NNN` တစ်ခုကို placeholder တစ်ခုဆီကို သတ်မှတ်ပေးပါတယ်။ Numbered နဲ့ named parameters တွေက parameter indexes တွေကို မျှဝေသုံးတာမို့ — ၎င်းတို့ ရောနှောခြင်းကို ရှောင်ပါ။

```js
db.prepare('SELECT ? AS a, ? AS b').get('x', 42);
// { a: 'x', b: 42 }
db.prepare('SELECT ?2 AS a, ?1 AS b').get('first', 'second');
// { a: 'second', b: 'first' }
```

Named parameters တွေက SQL ထဲမှာ prefix characters `$`, `:`, သို့မဟုတ် `@` တွေထဲက တစ်ခုနဲ့ စတင်ပါတယ်။ ၎င်းတို့ကို ပထမ argument အဖြစ် ပေးပို့လိုက်တဲ့ object တစ်ခုကနေ bind လုပ်ပါတယ်။ SQL ထဲမှာ နာမည်တစ်ခုကို ထပ်ခါထပ်ခါ ရေးထားရင် တန်ဖိုးတစ်ခုတည်းကို နေရာတိုင်းမှာ bind လုပ်ပေးပါတယ်။

```js
db.prepare('SELECT $a AS a, $b AS b').get({ $a: 1, $b: 2 });
// { a: 1, b: 2 }
db.prepare('SELECT :a AS a').get({ ':a': 1 });
// { a: 1 }
db.prepare('SELECT @a AS a').get({ '@a': 1 });
// { a: 1 }
db.prepare('SELECT $k AS a, $k AS b').get({ k: 7 });
// { a: 7, b: 7 }
```

နောက်ဆုံး ဥပမာက object key ကနေ prefix character ကို ချန်လှပ်ထားပါတယ်။ Bare names တွေကို default အနေနဲ့ ခွင့်ပြုပါတယ်; ၎င်းတို့ရဲ့ သတိထားစရာတွေအတွက် [`statement.setAllowBareNamedParameters()`][] ကို ကြည့်ပါ။

Statement ရဲ့ parameter တစ်ခုကို နာမည်မပေးတဲ့ key တစ်ခုကို binding လုပ်ရင် — မသိတဲ့ named parameters တွေကို လျစ်လျူရှုထားခြင်း မရှိရင် — `ERR_INVALID_STATE` error တစ်ခု throw လုပ်ပါတယ်။ [`statement.setAllowUnknownNamedParameters()`][] ကို ကြည့်ပါ။

Binding လုပ်လို့ ရတဲ့ တန်ဖိုးတွေအတွက် [Type conversion between JavaScript and SQLite][] ကို ကြည့်ပါ။ တခြား တန်ဖိုးတစ်ခုခုကို binding လုပ်ရင် `ERR_INVALID_ARG_TYPE` error တစ်ခု throw လုပ်ပါတယ်။
### `statement.all([namedParameters][, ...anonymousParameters])`

* `namedParameters` {Object} Named parameters တွေကို bind လုပ်ဖို့ ရွေးချယ်နိုင်တဲ့ object တစ်ခုပါ။ ဒီ object ရဲ့ keys တွေကို mapping ပြင်ဆင်သတ်မှတ်ဖို့ သုံးပါတယ်။
* `...anonymousParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Anonymous parameters တွေဆီကို bind လုပ်ဖို့ တန်ဖိုးတွေ သုည သို့မဟုတ် ထို့ထက်ပို ပါဝင်ပါတယ်။
* Returns: {Array} Objects တွေရဲ့ array တစ်ခုပါ။ Object တစ်ခုချင်းစီက prepared statement ကို run လုပ်လို့ ပြန်လာတဲ့ row တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ Object တစ်ခုချင်းစီရဲ့ keys နဲ့ values တွေက row ရဲ့ column names နဲ့ values တွေနဲ့ ကိုက်ညီပါတယ်။

ဒီ method က prepared statement တစ်ခုကို run လုပ်ပြီး — ရလဒ်အားလုံးကို objects တွေရဲ့ array တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Prepared statement က ဘယ်ရလဒ်မှ မပြန်ဘူးဆိုရင် ဒီ method က array အလွတ်တစ်ခုကို ပြန်ပေးပါတယ်။ Prepared statement ရဲ့ [parameters are bound][] လုပ်ဆောင်မှုကို `namedParameters` နဲ့ `anonymousParameters` ထဲက တန်ဖိုးတွေကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ [Binding parameters][] ကို ကြည့်ပါ။

### `statement.close()`

Prepared statement ကို finalize လုပ်ပါတယ်။ Statement က finalize လုပ်ပြီးသား ဖြစ်နေရင် exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ statement က လက်ရှိ run နေတဲ့အခါ — ဥပမာ statement ကိုယ်တိုင် စတင်လှုံ့ဆော်လိုက်တဲ့ callback တစ်ခုကနေ ဒီ method ကို ခေါ်ယူတဲ့အခါ (user-defined function, aggregate function, သို့မဟုတ် [`'sqlite.db.query'`][] subscriber လိုမျိုး) — [`ERR_INVALID_STATE`][] error တစ်ခု throw လုပ်ပါတယ်။ Connection တစ်ခုတည်းပေါ်က idle (အလုပ်မလုပ်နေတဲ့) statements တွေကိုတော့ အဲဒီလို callback ကနေ finalize လုပ်နိုင်ပါတယ်။ ဒီ method က [`sqlite3_finalize()`][] ပေါ်က wrapper တစ်ခုပါ။

### `statement.columns()`

* Returns: {Array} Objects တွေရဲ့ array တစ်ခုပါ။ Object တစ်ခုချင်းစီက prepared statement ထဲက column တစ်ခုနဲ့ ကိုက်ညီပြီး — အောက်ပါ properties တွေ ပါဝင်ပါတယ်:
  * `column` {string|null} Origin table ထဲက column ရဲ့ alias မထားတဲ့ (unaliased) နာမည်ပါ — column က expression သို့မဟုတ် subquery တစ်ခုရဲ့ ရလဒ် ဖြစ်နေရင် `null` ပါ။ ဒီ property က [`sqlite3_column_origin_name()`][] ရဲ့ ရလဒ်ပါ။
  * `database` {string|null} Origin database ရဲ့ alias မထားတဲ့ နာမည်ပါ — column က expression သို့မဟုတ် subquery တစ်ခုရဲ့ ရလဒ် ဖြစ်နေရင် `null` ပါ။ ဒီ property က [`sqlite3_column_database_name()`][] ရဲ့ ရလဒ်ပါ။
  * `name` {string} `SELECT` statement တစ်ခုရဲ့ result set ထဲမှာ column ကို သတ်မှတ်ပေးထားတဲ့ နာမည်ပါ။ ဒီ property က [`sqlite3_column_name()`][] ရဲ့ ရလဒ်ပါ။
  * `table` {string|null} Origin table ရဲ့ alias မထားတဲ့ နာမည်ပါ — column က expression သို့မဟုတ် subquery တစ်ခုရဲ့ ရလဒ် ဖြစ်နေရင် `null` ပါ။ ဒီ property က [`sqlite3_column_table_name()`][] ရဲ့ ရလဒ်ပါ။
  * `type` {string|null} Column ရဲ့ ကြေညာထားတဲ့ (declared) data type ပါ — column က expression သို့မဟုတ် subquery တစ်ခုရဲ့ ရလဒ် ဖြစ်နေရင် `null` ပါ။ ဒီ property က [`sqlite3_column_decltype()`][] ရဲ့ ရလဒ်ပါ။

ဒီ method ကို prepared statement က ပြန်ပေးတဲ့ columns တွေအကြောင်း အချက်အလက်တွေ ရယူဖို့ သုံးပါတယ်။

### `statement.expandedSQL`

* Type: {string} Parameter values တွေ ပါဝင်အောင် ချဲ့ထားတဲ့ (expanded) source SQL ပါ။

Prepared statement ရဲ့ source SQL text ပါ — ဒီ prepared statement ကို နောက်ဆုံး run လုပ်ခဲ့တုန်းက သုံးခဲ့တဲ့ တန်ဖိုးတွေနဲ့ parameter placeholders တွေကို အစားထိုးထားတဲ့ ပုံစံပါ။ ဒီ property က [`sqlite3_expanded_sql()`][] ပေါ်က wrapper တစ်ခုပါ။

### `statement.get([namedParameters][, ...anonymousParameters])`

* `namedParameters` {Object} Named parameters တွေကို bind လုပ်ဖို့ ရွေးချယ်နိုင်တဲ့ object တစ်ခုပါ။ ဒီ object ရဲ့ keys တွေကို mapping ပြင်ဆင်သတ်မှတ်ဖို့ သုံးပါတယ်။
* `...anonymousParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Anonymous parameters တွေဆီကို bind လုပ်ဖို့ တန်ဖိုးတွေ သုည သို့မဟုတ် ထို့ထက်ပို ပါဝင်ပါတယ်။
* Returns: {Object|undefined} Prepared statement ကို run လုပ်လို့ ပြန်လာတဲ့ ပထမ row နဲ့ ကိုက်ညီတဲ့ object တစ်ခုပါ။ Object ရဲ့ keys နဲ့ values တွေက row ရဲ့ column names နဲ့ values တွေနဲ့ ကိုက်ညီပါတယ်။ Database ကနေ ဘယ် rows မှ မပြန်ခဲ့ဘူးဆိုရင် ဒီ method က `undefined` ကို ပြန်ပေးပါတယ်။

ဒီ method က prepared statement တစ်ခုကို run လုပ်ပြီး — ပထမ ရလဒ်ကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Prepared statement က ဘယ်ရလဒ်မှ မပြန်ဘူးဆိုရင် ဒီ method က `undefined` ကို ပြန်ပေးပါတယ်။ Prepared statement ရဲ့ [parameters are bound][] လုပ်ဆောင်မှုကို `namedParameters` နဲ့ `anonymousParameters` ထဲက တန်ဖိုးတွေကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ [Binding parameters][] ကို ကြည့်ပါ။

### `statement.iterate([namedParameters][, ...anonymousParameters])`

* `namedParameters` {Object} Named parameters တွေကို bind လုပ်ဖို့ ရွေးချယ်နိုင်တဲ့ object တစ်ခုပါ။ ဒီ object ရဲ့ keys တွေကို mapping ပြင်ဆင်သတ်မှတ်ဖို့ သုံးပါတယ်။
* `...anonymousParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Anonymous parameters တွေဆီကို bind လုပ်ဖို့ တန်ဖိုးတွေ သုည သို့မဟုတ် ထို့ထက်ပို ပါဝင်ပါတယ်။
* Returns: {Iterator} Objects တွေရဲ့ iterable iterator တစ်ခုပါ။ Object တစ်ခုချင်းစီက prepared statement ကို run လုပ်လို့ ပြန်လာတဲ့ row တစ်ခုနဲ့ ကိုက်ညီပါတယ်။ Object တစ်ခုချင်းစီရဲ့ keys နဲ့ values တွေက row ရဲ့ column names နဲ့ values တွေနဲ့ ကိုက်ညီပါတယ်။

ဒီ method က prepared statement တစ်ခုကို run လုပ်ပြီး — objects တွေရဲ့ iterator တစ်ခုကို ပြန်ပေးပါတယ်။ Prepared statement က ဘယ်ရလဒ်မှ မပြန်ဘူးဆိုရင် ဒီ method က iterator အလွတ်တစ်ခုကို ပြန်ပေးပါတယ်။ Prepared statement ရဲ့ [parameters are bound][] လုပ်ဆောင်မှုကို `namedParameters` နဲ့ `anonymousParameters` ထဲက တန်ဖိုးတွေကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ [Binding parameters][] ကို ကြည့်ပါ။

### `statement.resetStats()`

[`statement.stat()`][] က အစီရင်ခံတဲ့ counter တိုင်းကို — `memused` ကလွဲပြီး — သုညဆီ ပြန်စ (reset) လုပ်ပါတယ်။ `memused` က လက်ရှိ memory အသုံးပြုမှုကို အစီရင်ခံတာမို့ reset လုပ်လို့ မရပါဘူး။ ဒီ method က [`sqlite3_stmt_status()`][] ပေါ်က wrapper တစ်ခုဖြစ်ပြီး — prepared statement တစ်ခုတည်းရဲ့ အစောပိုင်း executions တွေက စုမိနေတဲ့ counts တွေ မပါပဲ — သတ်မှတ်ထားတဲ့ workload တစ်ခုကို တိုင်းတာဖို့ အသုံးဝင်ပါတယ်။

### `statement.run([namedParameters][, ...anonymousParameters])`

* `namedParameters` {Object} Named parameters တွေကို bind လုပ်ဖို့ ရွေးချယ်နိုင်တဲ့ object တစ်ခုပါ။ ဒီ object ရဲ့ keys တွေကို mapping ပြင်ဆင်သတ်မှတ်ဖို့ သုံးပါတယ်။
* `...anonymousParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Anonymous parameters တွေဆီကို bind လုပ်ဖို့ တန်ဖိုးတွေ သုည သို့မဟုတ် ထို့ထက်ပို ပါဝင်ပါတယ်။
* Returns: {Object}
  * `changes` {number|bigint} နောက်ဆုံး ပြီးစီးသွားတဲ့ `INSERT`, `UPDATE`, သို့မဟုတ် `DELETE` statement က ပြုပြင်၊ ထည့်သွင်း သို့မဟုတ် ဖျက်လိုက်တဲ့ rows အရေအတွက်ပါ။ ဒီ field က prepared statement ရဲ့ configuration ပေါ် မူတည်ပြီး number သို့မဟုတ် `BigInt` ဖြစ်ပါတယ်။ ဒီ property က [`sqlite3_changes64()`][] ရဲ့ ရလဒ်ပါ။
  * `lastInsertRowid` {number|bigint} နောက်ဆုံး ထည့်သွင်းလိုက်တဲ့ rowid ပါ။ ဒီ field က prepared statement ရဲ့ configuration ပေါ် မူတည်ပြီး number သို့မဟုတ် `BigInt` ဖြစ်ပါတယ်။ ဒီ property က [`sqlite3_last_insert_rowid()`][] ရဲ့ ရလဒ်ပါ။

ဒီ method က prepared statement တစ်ခုကို run လုပ်ပြီး — ဖြစ်ပေါ်လာတဲ့ ပြောင်းလဲမှုတွေကို အနှစ်ချုပ် ဖော်ပြတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ Prepared statement ရဲ့ [parameters are bound][] လုပ်ဆောင်မှုကို `namedParameters` နဲ့ `anonymousParameters` ထဲက တန်ဖိုးတွေကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ [Binding parameters][] ကို ကြည့်ပါ။

### `statement.setAllowBareNamedParameters(enabled)`

* `enabled` {boolean} Prefix character မပါပဲ named parameters တွေကို binding လုပ်ခြင်းကို enable သို့မဟုတ် disable လုပ်ပါတယ်။

SQLite parameters တွေရဲ့ နာမည်တွေက prefix character တစ်ခုနဲ့ စတင်ပါတယ်။ ဒါပေမယ့် dollar sign character ကလွဲလို့ — ဒီ prefix characters တွေက object keys တွေထဲမှာ သုံးတဲ့အခါ ထပ်ဆောင်း quoting တွေ လိုအပ်ပါတယ်။

Ergonomics (အသုံးပြုရ လွယ်ကူမှု) ကောင်းစေဖို့ `node:sqlite` က default အနေနဲ့ — JavaScript code ထဲမှာ prefix character မလိုအပ်တဲ့ — bare named parameters တွေကို ခွင့်ပြုပါတယ်။ ဒီ method ကို အဲဒီအပြုအမူကို disable လုပ်ဖို့ သုံးနိုင်ပြီး — အဲဒီအခါ binding လုပ်တဲ့အခါ prefix character လိုအပ်ပါတယ်။ Bare named parameters တွေကို ခွင့်ပြုထားတဲ့အခါ သတိထားရမယ့် အချက်များစွာ ရှိပါတယ်:

* SQL ထဲမှာတော့ prefix character ကို ဆက်လက် လိုအပ်ပါတယ်။
* JavaScript ထဲမှာတော့ prefix character ကို ဆက်လက် ခွင့်ပြုပါတယ်။ တကယ်တော့ prefixed names တွေက binding performance နည်းနည်း ပိုကောင်းပါလိမ့်မယ်။
* Prepared statement တစ်ခုတည်းထဲမှာ `$k` နဲ့ `@k` လိုမျိုး ရှုပ်ထွေးနိုင်တဲ့ (ambiguous) named parameters တွေကို သုံးရင် — bare name တစ်ခုကို ဘယ်လို bind လုပ်ရမလဲ ဆုံးဖြတ်လို့ မရတာမို့ — exception တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

### `statement.setAllowUnknownNamedParameters(enabled)`

* `enabled` {boolean} မသိတဲ့ named parameters တွေအတွက် support ကို enable သို့မဟုတ် disable လုပ်ပါတယ်။

Default အနေနဲ့ parameters တွေကို binding လုပ်နေတုန်း မသိတဲ့ နာမည်တစ်ခုကို တွေ့လိုက်ရင် exception တစ်ခု throw လုပ်ပါတယ်။ ဒီ method က မသိတဲ့ named parameters တွေကို လျစ်လျူရှုစေပါတယ်။

### `statement.setReturnArrays(enabled)`

* `enabled` {boolean} Query results တွေကို arrays တွေအနေနဲ့ ပြန်ပေးခြင်းကို enable သို့မဟုတ် disable လုပ်ပါတယ်။

Enable လုပ်ထားတဲ့အခါ `all()`, `get()`, နဲ့ `iterate()` methods တွေက ပြန်ပေးတဲ့ query results တွေကို objects တွေအစား arrays တွေအနေနဲ့ ပြန်ပေးပါလိမ့်မယ်။

### `statement.setReadBigInts(enabled)`

* `enabled` {boolean} Database ကနေ `INTEGER` fields တွေကို ဖတ်တဲ့အခါ `BigInt` တွေ သုံးခြင်းကို enable သို့မဟုတ် disable လုပ်ပါတယ်။

Database ကနေ ဖတ်တဲ့အခါ SQLite `INTEGER` တွေကို default အနေနဲ့ JavaScript numbers တွေဆီကို map လုပ်ပါတယ်။ ဒါပေမယ့် SQLite `INTEGER` တွေက JavaScript numbers တွေ ကိုယ်စားပြုနိုင်တာထက် ပိုကြီးတဲ့ တန်ဖိုးတွေကို သိမ်းဆည်းနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ ဒီ method ကို `INTEGER` data တွေကို JavaScript `BigInt` တွေနဲ့ ဖတ်ဖို့ သုံးနိုင်ပါတယ်။ ဒီ method က numbers ရော `BigInt` တွေရော ဘယ်အချိန်မဆို support လုပ်ထားတဲ့ database write operations တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။

### `statement.sourceSQL`

* Type: {string} ဒီ prepared statement ကို ဖန်တီးဖို့ သုံးခဲ့တဲ့ source SQL ပါ။

Prepared statement ရဲ့ source SQL text ပါ။ ဒီ property က [`sqlite3_sql()`][] ပေါ်က wrapper တစ်ခုပါ။

### `statement[Symbol.dispose]()`

Prepared statement ကို finalize လုပ်ပါတယ်။ Prepared statement က finalize လုပ်ပြီးသား ဖြစ်နေရင် ဒါက no-op ပါ။ ဒီ statement က လက်ရှိ run နေတဲ့အခါ — [`statement.close()`][] နဲ့ တူညီတဲ့ အခြေအနေတွေအောက်မှာ — [`ERR_INVALID_STATE`][] error တစ်ခု throw လုပ်ပါတယ်။

### `statement.stat(counter)`

* `counter` {string} ဖတ်မယ့် counter ရဲ့ နာမည်ပါ။ အောက်ပါတို့ထဲက တစ်ခု:

  * `'fullscanStep'` Table တစ်ခုကို အပြည့်အစုံ scan (full table scan) လုပ်ရာမှာ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ SQLite က table ထဲကို ရှေ့သို့ ခြေလှမ်း (step) လုပ်လိုက်တဲ့ အကြိမ် အရေအတွက်ပါ။
  * `'sort'` ဖြစ်ပေါ်ခဲ့တဲ့ sort operations အရေအတွက်ပါ။
  * `'autoindex'` Joins တွေ မြန်မြန် run ဖို့ အလိုအလျောက် ဖန်တီးလိုက်တဲ့ transient indices တွေထဲကို ထည့်သွင်းလိုက်တဲ့ rows အရေအတွက်ပါ။
  * `'vmStep'` Prepared statement က run လုပ်လိုက်တဲ့ virtual machine operations အရေအတွက်ပါ။
  * `'reprepare'` Schema ပြောင်းလဲမှုတွေ သို့မဟုတ် bound parameters တွေရဲ့ ပြောင်းလဲမှုတွေကြောင့် statement ကို အလိုအလျောက် ပြန်-prepare (reprepare) လုပ်လိုက်တဲ့ အကြိမ် အရေအတွက်ပါ။
  * `'run'` Prepared statement က စတင်လိုက်တဲ့ execution cycles အရေအတွက်ပါ။
  * `'filterMiss'` Bloom filter က — join step ကို ပုံမှန်အတိုင်း လုပ်ဆောင်ဖို့ လိုအပ်တဲ့ — ရလဒ်တစ်ခုကို ပြန်ပေးလိုက်တဲ့ အကြိမ် အရေအတွက်ပါ။
  * `'filterHit'` Bloom filter က not-found ပြန်ပေးလို့ join step တစ်ခုကို ကျော်ဖြတ်လိုက်တဲ့ အကြိမ် အရေအတွက်ပါ။
  * `'memused'` Prepared statement ကို သိမ်းဆည်းဖို့ သုံးထားတဲ့ heap memory ရဲ့ ခန့်မှန်းခြေ byte အရေအတွက်ပါ။

* Returns: {number} တောင်းဆိုထားတဲ့ counter ရဲ့ လက်ရှိ တန်ဖိုးပါ။

SQLite က ဒီ prepared statement အတွက် ခြေရာခံထားတဲ့ runtime counters တွေထဲက တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ method က [`sqlite3_stmt_status()`][] ပေါ်က wrapper တစ်ခုဖြစ်ပြီး — counter ကို reset မလုပ်ပါဘူး။ Statement တစ်ခုက full table scan မလုပ်ဆောင်ဘူးဆိုတာကို စစ်ဆေးခြင်း (`statement.stat('fullscanStep') === 0`) က စွမ်းဆောင်ရည် ယိုယွင်းမှုတွေရဲ့ ရန်ကနေ ကာကွယ်ဖို့ အသုံးဝင်တဲ့ စစ်ဆေးမှုတစ်ခုပါ။

`'filterMiss'` နဲ့ `'filterHit'` counters တွေက SQLite 3.38.0 သို့မဟုတ် နောက်ပိုင်း လိုအပ်ပါတယ်။ `--shared-sqlite` နဲ့ ပိုအဟောင်းဖြစ်တဲ့ SQLite တစ်ခုကို ချိတ်ဆက် (link) ထားတဲ့ builds တွေမှာ ၎င်းတို့ကို expose မလုပ်ဘဲ — နာမည်တစ်ခုခုကို ပေးပို့ရင် `ERR_INVALID_ARG_VALUE` error တစ်ခု throw လုပ်ပါတယ်။
## Class: `SQLTagStore`

ဒီ class က prepared statements တွေကို သိမ်းဆည်းဖို့ LRU (Least Recently Used) cache တစ်ခုတည်းကို ကိုယ်စားပြုပါတယ်။

ဒီ class ရဲ့ instances တွေကို constructor သုံးပြီး မဟုတ်ပဲ — [`database.createTagStore()`][] method ကနေတစ်ဆင့် ဖန်တီးပါတယ်။ Store က ပေးထားတဲ့ SQL query string အပေါ် အခြေခံပြီး prepared statements တွေကို cache လုပ်ပါတယ်။ Query တစ်ခုတည်းကို နောက်တစ်ကြိမ် မြင်ရတဲ့အခါ store က cache လုပ်ထားတဲ့ statement ကို ပြန်ရယူပြီး — parameter binding ကနေတစ်ဆင့် တန်ဖိုးအသစ်တွေကို လုံခြုံစွာ သက်ရောက်ပေးပါတယ်။ အဲဒါကြောင့် SQL injection လိုမျိုး တိုက်ခိုက်မှုတွေကို ကာကွယ်နိုင်ပါတယ်။

Cache မှာ default အနေနဲ့ statements 1000 ခုအထိ သိမ်းနိုင်တဲ့ maxSize တစ်ခု ရှိပြီး — စိတ်ကြိုက် အရွယ်အစားလည်း ပေးနိုင်ပါတယ် (ဥပမာ `database.createTagStore(100)`)။ ဒီ class က expose လုပ်ထားတဲ့ APIs အားလုံးက synchronously run လုပ်ပါတယ်။

### `sqlTagStore.all(stringElements[, ...boundParameters])`

* `stringElements` {string\[]} SQL query ပါဝင်တဲ့ template literal elements တွေပါ။
* `...boundParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Template string ထဲက placeholders တွေဆီကို bind လုပ်မယ့် parameter values တွေပါ။
* Returns: {Array} Query က ပြန်ပေးတဲ့ rows တွေကို ကိုယ်စားပြုတဲ့ objects တွေရဲ့ array တစ်ခုပါ။

ပေးထားတဲ့ SQL query ကို run လုပ်ပြီး — ရလဒ် rows အားလုံးကို objects တွေရဲ့ array တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

ဒီ function ကို template literal tag တစ်ခုအနေနဲ့ သုံးဖို့ ရည်ရွယ်ထားပြီး — တိုက်ရိုက် ခေါ်ယူဖို့ မဟုတ်ပါဘူး။

### `sqlTagStore.get(stringElements[, ...boundParameters])`

* `stringElements` {string\[]} SQL query ပါဝင်တဲ့ template literal elements တွေပါ။
* `...boundParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Template string ထဲက placeholders တွေဆီကို bind လုပ်မယ့် parameter values တွေပါ။
* Returns: {Object | undefined} Query က ပြန်ပေးတဲ့ ပထမ row ကို ကိုယ်စားပြုတဲ့ object တစ်ခုပါ — rows ဘာမှ မပြန်ရင် `undefined` ပါ။

ပေးထားတဲ့ SQL query ကို run လုပ်ပြီး — ပထမ ရလဒ် row ကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

ဒီ function ကို template literal tag တစ်ခုအနေနဲ့ သုံးဖို့ ရည်ရွယ်ထားပြီး — တိုက်ရိုက် ခေါ်ယူဖို့ မဟုတ်ပါဘူး။

### `sqlTagStore.iterate(stringElements[, ...boundParameters])`

* `stringElements` {string\[]} SQL query ပါဝင်တဲ့ template literal elements တွေပါ။
* `...boundParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Template string ထဲက placeholders တွေဆီကို bind လုပ်မယ့် parameter values တွေပါ။
* Returns: {Iterator} Query က ပြန်ပေးတဲ့ rows တွေကို ကိုယ်စားပြုတဲ့ objects တွေကို ထုတ်ပေးတဲ့ iterator တစ်ခုပါ။

ပေးထားတဲ့ SQL query ကို run လုပ်ပြီး — ရလဒ် rows တွေအပေါ် iterator တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ function ကို template literal tag တစ်ခုအနေနဲ့ သုံးဖို့ ရည်ရွယ်ထားပြီး — တိုက်ရိုက် ခေါ်ယူဖို့ မဟုတ်ပါဘူး။

### `sqlTagStore.run(stringElements[, ...boundParameters])`

* `stringElements` {string\[]} SQL query ပါဝင်တဲ့ template literal elements တွေပါ။
* `...boundParameters` {null|number|bigint|boolean|string|Buffer|TypedArray|DataView|ArrayBuffer|SharedArrayBuffer} Template string ထဲက placeholders တွေဆီကို bind လုပ်မယ့် parameter values တွေပါ။
* Returns: {Object} `changes` နဲ့ `lastInsertRowid` အပါအဝင် — execution အကြောင်း အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

ပေးထားတဲ့ SQL query ကို run လုပ်ပါတယ် — ၎င်းက rows တွေ ပြန်ပေးဖို့ မျှော်လင့်မထားပါဘူး (ဥပမာ INSERT, UPDATE, DELETE)။

ဒီ function ကို template literal tag တစ်ခုအနေနဲ့ သုံးဖို့ ရည်ရွယ်ထားပြီး — တိုက်ရိုက် ခေါ်ယူဖို့ မဟုတ်ပါဘူး။

### `sqlTagStore.size`

* Type: {integer}

Cache ထဲမှာ လက်ရှိ ရှိနေတဲ့ prepared statements အရေအတွက်ကို ပြန်ပေးတဲ့ read-only property တစ်ခုပါ။

### `sqlTagStore.capacity`

* Type: {integer}

Cache ထဲမှာ သိမ်းထားနိုင်တဲ့ prepared statements တွေရဲ့ အများဆုံး အရေအတွက်ကို ပြန်ပေးတဲ့ read-only property တစ်ခုပါ။

### `sqlTagStore.db`

* Type: {DatabaseSync}

ဒီ `SQLTagStore` နဲ့ ဆက်စပ်နေတဲ့ `DatabaseSync` object ကို ပြန်ပေးတဲ့ read-only property တစ်ခုပါ။

### `sqlTagStore.clear()`

LRU cache ကို ပြန်စ (reset) လုပ်ပြီး — သိမ်းထားတဲ့ prepared statements အားလုံးကို ရှင်းလင်းပါတယ်။

## `sqlite.backup(sourceDb, path[, options])`

* `sourceDb` {DatabaseSync} Backup လုပ်မယ့် database ပါ။ Source database က ဖွင့်ထားရပါမယ်။
* `path` {string | Buffer | URL} Backup ကို ဖန်တီးမယ့် path ပါ။ File က ရှိပြီးသား ဖြစ်နေရင် contents တွေကို ထပ်ရေး (overwrite) လုပ်ပါလိမ့်မယ်။
* `options` {Object} Backup အတွက် ရွေးချယ်နိုင်တဲ့ configuration ပါ။ အောက်ပါ properties တွေကို support လုပ်ပါတယ်:
  * `source` {string} Source database ရဲ့ နာမည်ပါ။ ဒါက `'main'` (default primary database) သို့မဟုတ် [`ATTACH DATABASE`][] နဲ့ ထည့်သွင်းထားတဲ့ တခြား database တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ **Default:** `'main'`။
  * `target` {string} Target database ရဲ့ နာမည်ပါ။ ဒါက `'main'` (default primary database) သို့မဟုတ် [`ATTACH DATABASE`][] နဲ့ ထည့်သွင်းထားတဲ့ တခြား database တစ်ခုခု ဖြစ်နိုင်ပါတယ်။ **Default:** `'main'`။
  * `rate` {integer} Backup ရဲ့ batch တစ်ခုချင်းစီမှာ ပို့လွှတ်မယ့် pages အရေအတွက် (အပြုသဘောဆောင်တဲ့ ဂဏန်း) ပါ။ **Default:** `100`။
  * `progress` {Function} Backup step တစ်ခုချင်းစီ အပြီးမှာ ခေါ်ယူမယ့် ရွေးချယ်နိုင်တဲ့ callback function တစ်ခုပါ။ ဒီ callback ဆီကို ပေးပို့တဲ့ argument က `remainingPages` နဲ့ `totalPages` properties တွေ ပါဝင်ပြီး — backup operation ရဲ့ လက်ရှိ တိုးတက်မှုကို ဖော်ပြတဲ့ {Object} တစ်ခုပါ။
* Returns: {Promise} ပြီးစီးတဲ့အခါ backup လုပ်လိုက်တဲ့ pages စုစုပေါင်း အရေအတွက်နဲ့ fulfill ဖြစ်ပြီး — error တစ်ခု ဖြစ်ရင် reject လုပ်တဲ့ promise တစ်ခုပါ။

ဒီ method က database backup တစ်ခုကို ပြုလုပ်ပါတယ်။ ဒီ method က [`sqlite3_backup_init()`][], [`sqlite3_backup_step()`][] နဲ့ [`sqlite3_backup_finish()`][] functions တွေကို စုစည်း (abstract) လုပ်ထားပါတယ်။

Backup လုပ်နေတဲ့ ကာလအတွင်း backup လုပ်ထားတဲ့ database ကို ပုံမှန်အတိုင်း သုံးနိုင်ပါတယ်။ Connection တစ်ခုတည်း — {DatabaseSync} object တစ်ခုတည်း — ကနေ လာတဲ့ mutations တွေက backup ထဲမှာ ချက်ချင်း ထင်ဟပ်ပါလိမ့်မယ်။ ဒါပေမယ့် တခြား connections တွေကနေ လာတဲ့ mutations တွေကတော့ backup process ကို ပြန်စ (restart) စေပါလိမ့်မယ်။

```cjs
const { backup, DatabaseSync } = require('node:sqlite');

(async () => {
  const sourceDb = new DatabaseSync('source.db');
  const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
    rate: 1, // Copy one page at a time.
    progress: ({ totalPages, remainingPages }) => {
      console.log('Backup in progress', { totalPages, remainingPages });
    },
  });

  console.log('Backup completed', totalPagesTransferred);
})();
```

```mjs
import { backup, DatabaseSync } from 'node:sqlite';

const sourceDb = new DatabaseSync('source.db');
const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
  rate: 1, // Copy one page at a time.
  progress: ({ totalPages, remainingPages }) => {
    console.log('Backup in progress', { totalPages, remainingPages });
  },
});

console.log('Backup completed', totalPagesTransferred);
```

## `sqlite.constants`

* Type: {Object}

SQLite operations တွေအတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

### SQLite constants (SQLite ကိန်းသေများ)

အောက်ပါ constants တွေကို `sqlite.constants` object ကနေ export လုပ်ပါတယ်။

#### Conflict resolution constants (conflict ဖြေရှင်းရေး ကိန်းသေများ)

အောက်ပါ constants တွေထဲက တစ်ခုကို [`database.applyChangeset()`][] ဆီကို ပေးပို့တဲ့ `onConflict` conflict resolution handler ဆီ argument တစ်ခုအနေနဲ့ ရရှိနိုင်ပါတယ်။ SQLite documentation ထဲက [Constants Passed To The Conflict Handler][] ကိုလည်း ကြည့်ပါ။

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_DATA` | DELETE သို့မဟုတ် UPDATE change တစ်ခုကို လုပ်ဆောင်နေတုန်း — လိုအပ်တဲ့ PRIMARY KEY fields တွေ ပါဝင်တဲ့ row တစ်ခု database ထဲမှာ ရှိနေပေမယ့် — update က ပြုပြင်လိုက်တဲ့ တခြား (primary-key မဟုတ်တဲ့) fields တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုက မျှော်လင့်ထားတဲ့ "before" တန်ဖိုးတွေ မပါဝင်ဘူးဆိုရင် — ဒီ constant နဲ့အတူ conflict handler ကို ခေါ်ယူပါတယ်။ |
| `SQLITE_CHANGESET_NOTFOUND` | DELETE သို့မဟုတ် UPDATE change တစ်ခုကို လုပ်ဆောင်နေတုန်း — လိုအပ်တဲ့ PRIMARY KEY fields တွေ ပါဝင်တဲ့ row တစ်ခု database ထဲမှာ မရှိဘူးဆိုရင် — ဒီ constant နဲ့အတူ conflict handler ကို ခေါ်ယူပါတယ်။ |
| `SQLITE_CHANGESET_CONFLICT` | INSERT change တစ်ခုကို လုပ်ဆောင်နေတုန်း ဒီ operation က duplicate primary key values တွေကို ဖြစ်ပေါ်စေမယ်ဆိုရင် — ဒီ constant ကို conflict handler ဆီကို ပေးပို့ပါတယ်။ |
| `SQLITE_CHANGESET_CONSTRAINT` | Change တစ်ခုကို သက်ရောက်နေတုန်း တခြား constraint violation တစ်ခုခု (ဆိုလိုတာက UNIQUE, CHECK သို့မဟုတ် NOT NULL constraint) ဖြစ်ပေါ်ခဲ့ရင် — ဒီ constant နဲ့အတူ conflict handler ကို ခေါ်ယူပါတယ်။ |
| `SQLITE_CHANGESET_FOREIGN_KEY` | Foreign key handling ကို enable လုပ်ထားပြီး — changeset တစ်ခုကို သက်ရောက်လိုက်တာက database ကို foreign key violations တွေ ပါဝင်တဲ့ အခြေအနေတစ်ခုထဲ ရောက်စေမယ်ဆိုရင် — changeset ကို commit မလုပ်ခင် ဒီ constant နဲ့အတူ conflict handler ကို အတိအကျ တစ်ကြိမ် ခေါ်ယူပါတယ်။ Conflict handler က `SQLITE_CHANGESET_OMIT` ကို ပြန်ပေးရင် — foreign key constraint violation ကို ဖြစ်စေခဲ့တဲ့ changes တွေ အပါအဝင် — changes တွေကို commit လုပ်ပါတယ်။ ဒါမှမဟုတ် `SQLITE_CHANGESET_ABORT` ကို ပြန်ပေးရင်တော့ changeset ကို ပြန်လှိမ့် (roll back) လုပ်ပါတယ်။ |

အောက်ပါ constants တွေထဲက တစ်ခုကို [`database.applyChangeset()`][] ဆီကို ပေးပို့တဲ့ `onConflict` conflict resolution handler ကနေ ပြန်ပေးရပါမယ်။ SQLite documentation ထဲက [Constants Returned From The Conflict Handler][] ကိုလည်း ကြည့်ပါ။

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Conflict ဖြစ်နေတဲ့ changes တွေကို ချန်လှပ်လိုက်ပါတယ်။ |
| `SQLITE_CHANGESET_REPLACE` | Conflict ဖြစ်နေတဲ့ changes တွေက ရှိပြီးသား တန်ဖိုးတွေကို အစားထိုးပါတယ်။ ဒီတန်ဖိုးကို conflict ရဲ့ အမျိုးအစားက `SQLITE_CHANGESET_DATA` သို့မဟုတ် `SQLITE_CHANGESET_CONFLICT` ဖြစ်တဲ့အခါမှသာ ပြန်ပေးနိုင်တာ သတိပြုပါ။ |
| `SQLITE_CHANGESET_ABORT` | Change တစ်ခု conflict တစ်ခုကို ကြုံတွေ့တဲ့အခါ abort လုပ်ပြီး database ကို ပြန်လှိမ့် (roll back) လုပ်ပါတယ်။ |

#### Authorization constants (authorization ကိန်းသေများ)

အောက်ပါ constants တွေကို [`database.setAuthorizer()`][] method နဲ့အတူ သုံးပါတယ်။

##### Authorization result codes (authorization ရလဒ် codes များ)

အောက်ပါ constants တွေထဲက တစ်ခုကို [`database.setAuthorizer()`][] ဆီကို ပေးပို့တဲ့ authorizer callback function ကနေ ပြန်ပေးရပါမယ်။

| Constant | Description |
| --- | --- |
| `SQLITE_OK` | Operation ကို ပုံမှန်အတိုင်း ဆက်လုပ်ခွင့် ပြုပါတယ်။ |
| `SQLITE_DENY` | Operation ကို ငြင်းပယ်ပြီး error တစ်ခု ပြန်ပို့စေပါတယ်။ |
| `SQLITE_IGNORE` | Operation ကို လျစ်လျူရှုပြီး — တစ်ခါမှ မတောင်းဆိုခဲ့သလို ဆက်သွားပါတယ်။ |

##### Authorization action codes (authorization လုပ်ဆောင်ချက် codes များ)

အောက်ပါ constants တွေကို ဘယ်လို operation အမျိုးအစားကို authorize လုပ်နေလဲ ဖော်ပြဖို့ — authorizer callback function ရဲ့ ပထမ argument အဖြစ် ပေးပို့ပါတယ်။

| Constant | Description |
| --- | --- |
| `SQLITE_CREATE_INDEX` | Index တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TABLE` | Table တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TEMP_INDEX` | Temporary index တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TEMP_TABLE` | Temporary table တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TEMP_TRIGGER` | Temporary trigger တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TEMP_VIEW` | Temporary view တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_TRIGGER` | Trigger တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_CREATE_VIEW` | View တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_DELETE` | Table တစ်ခုကနေ ဖျက်ခြင်း |
| `SQLITE_DROP_INDEX` | Index တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TABLE` | Table တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TEMP_INDEX` | Temporary index တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TEMP_TABLE` | Temporary table တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TEMP_TRIGGER` | Temporary trigger တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TEMP_VIEW` | Temporary view တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_TRIGGER` | Trigger တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_DROP_VIEW` | View တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_INSERT` | Table တစ်ခုထဲကို ထည့်သွင်းခြင်း |
| `SQLITE_PRAGMA` | PRAGMA statement တစ်ခုကို run လုပ်ခြင်း |
| `SQLITE_READ` | Table တစ်ခုကနေ ဖတ်ခြင်း |
| `SQLITE_SELECT` | SELECT statement တစ်ခုကို run လုပ်ခြင်း |
| `SQLITE_TRANSACTION` | Transaction တစ်ခုကို စတင် (begin)၊ commit သို့မဟုတ် rollback လုပ်ခြင်း |
| `SQLITE_UPDATE` | Table တစ်ခုကို update လုပ်ခြင်း |
| `SQLITE_ATTACH` | Database တစ်ခုကို attach လုပ်ခြင်း |
| `SQLITE_DETACH` | Database တစ်ခုကို detach လုပ်ခြင်း |
| `SQLITE_ALTER_TABLE` | Table တစ်ခုကို alter လုပ်ခြင်း |
| `SQLITE_REINDEX` | Reindex လုပ်ခြင်း |
| `SQLITE_ANALYZE` | Database ကို analyze လုပ်ခြင်း |
| `SQLITE_CREATE_VTABLE` | Virtual table တစ်ခုကို ဖန်တီးခြင်း |
| `SQLITE_DROP_VTABLE` | Virtual table တစ်ခုကို ဖျက်ခြင်း (drop) |
| `SQLITE_FUNCTION` | Function တစ်ခုကို အသုံးပြုခြင်း |
| `SQLITE_SAVEPOINT` | Savepoint တစ်ခုကို ဖန်တီး (create)၊ လွှတ် (release) သို့မဟုတ် ပြန်လှိမ့် (rollback) လုပ်ခြင်း |
| `SQLITE_COPY` | Data ကို ကူးယူခြင်း (legacy) |
| `SQLITE_RECURSIVE` | Recursive query လုပ်ခြင်း |
[Binding parameters]: #binding-parameters
[Changesets and Patchsets]: https://www.sqlite.org/sessionintro.html#changesets_and_patchsets
[Constants Passed To The Conflict Handler]: https://www.sqlite.org/session/c_changeset_conflict.html
[Constants Returned From The Conflict Handler]: https://www.sqlite.org/session/c_changeset_abort.html
[Limit Constants]: https://www.sqlite.org/c3ref/c_limit_attached.html
[Run-Time Limits]: https://www.sqlite.org/c3ref/limit.html
[SQL injection]: https://en.wikipedia.org/wiki/SQL_injection
[Type conversion between JavaScript and SQLite]: #type-conversion-between-javascript-and-sqlite
[`'sqlite.db.query'`]: diagnostics_channel.md#event-sqlitedbquery
[`ATTACH DATABASE`]: https://www.sqlite.org/lang_attach.html
[`ERR_INVALID_STATE`]: errors.md#err_invalid_state
[`PRAGMA foreign_keys`]: https://www.sqlite.org/pragma.html#pragma_foreign_keys
[`SQLITE_DBCONFIG_DEFENSIVE`]: https://www.sqlite.org/c3ref/c_dbconfig_defensive.html#sqlitedbconfigdefensive
[`SQLITE_DETERMINISTIC`]: https://www.sqlite.org/c3ref/c_deterministic.html
[`SQLITE_DIRECTONLY`]: https://www.sqlite.org/c3ref/c_deterministic.html
[`SQLITE_MAX_FUNCTION_ARG`]: https://www.sqlite.org/limits.html#max_function_arg
[`SQLITE_PREPARE_PERSISTENT`]: https://sqlite.org/c3ref/c_prepare_dont_log.html#sqlitepreparepersistent
[`SQLTagStore`]: #class-sqltagstore
[`database.applyChangeset()`]: #databaseapplychangesetchangeset-options
[`database.createTagStore()`]: #databasecreatetagstoremaxsize
[`database.serialize()`]: #databaseserializedbname
[`database.setAuthorizer()`]: #databasesetauthorizercallback
[`diagnostics_channel`]: diagnostics_channel.md
[`sqlite3_backup_finish()`]: https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupfinish
[`sqlite3_backup_init()`]: https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupinit
[`sqlite3_backup_step()`]: https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupstep
[`sqlite3_changes64()`]: https://www.sqlite.org/c3ref/changes.html
[`sqlite3_close_v2()`]: https://www.sqlite.org/c3ref/close.html
[`sqlite3_column_database_name()`]: https://www.sqlite.org/c3ref/column_database_name.html
[`sqlite3_column_decltype()`]: https://www.sqlite.org/c3ref/column_decltype.html
[`sqlite3_column_name()`]: https://www.sqlite.org/c3ref/column_name.html
[`sqlite3_column_origin_name()`]: https://www.sqlite.org/c3ref/column_database_name.html
[`sqlite3_column_table_name()`]: https://www.sqlite.org/c3ref/column_database_name.html
[`sqlite3_create_function_v2()`]: https://www.sqlite.org/c3ref/create_function.html
[`sqlite3_create_window_function()`]: https://www.sqlite.org/c3ref/create_function.html
[`sqlite3_db_filename()`]: https://sqlite.org/c3ref/db_filename.html
[`sqlite3_deserialize()`]: https://sqlite.org/c3ref/deserialize.html
[`sqlite3_exec()`]: https://www.sqlite.org/c3ref/exec.html
[`sqlite3_expanded_sql()`]: https://www.sqlite.org/c3ref/expanded_sql.html
[`sqlite3_finalize()`]: https://www.sqlite.org/c3ref/finalize.html
[`sqlite3_get_autocommit()`]: https://sqlite.org/c3ref/get_autocommit.html
[`sqlite3_last_insert_rowid()`]: https://www.sqlite.org/c3ref/last_insert_rowid.html
[`sqlite3_load_extension()`]: https://www.sqlite.org/c3ref/load_extension.html
[`sqlite3_prepare_v3()`]: https://www.sqlite.org/c3ref/prepare.html
[`sqlite3_serialize()`]: https://sqlite.org/c3ref/serialize.html
[`sqlite3_set_authorizer()`]: https://sqlite.org/c3ref/set_authorizer.html
[`sqlite3_sql()`]: https://www.sqlite.org/c3ref/expanded_sql.html
[`sqlite3_stmt_status()`]: https://www.sqlite.org/c3ref/stmt_status.html
[`sqlite3changeset_apply()`]: https://www.sqlite.org/session/sqlite3changeset_apply.html
[`sqlite3session_attach()`]: https://www.sqlite.org/session/sqlite3session_attach.html
[`sqlite3session_changeset()`]: https://www.sqlite.org/session/sqlite3session_changeset.html
[`sqlite3session_create()`]: https://www.sqlite.org/session/sqlite3session_create.html
[`sqlite3session_delete()`]: https://www.sqlite.org/session/sqlite3session_delete.html
[`sqlite3session_patchset()`]: https://www.sqlite.org/session/sqlite3session_patchset.html
[`statement.close()`]: #statementclose
[`statement.setAllowBareNamedParameters()`]: #statementsetallowbarenamedparametersenabled
[`statement.setAllowUnknownNamedParameters()`]: #statementsetallowunknownnamedparametersenabled
[`statement.stat()`]: #statementstatcounter
[busy timeout]: https://sqlite.org/c3ref/busy_timeout.html
[connection]: https://www.sqlite.org/c3ref/sqlite3.html
[data types]: https://www.sqlite.org/datatype3.html
[double-quoted string literals]: https://www.sqlite.org/quirks.html#dblquote
[in memory]: https://www.sqlite.org/inmemorydb.html
[parameters are bound]: https://www.sqlite.org/c3ref/bind_blob.html
[prepared statement]: https://www.sqlite.org/c3ref/stmt.html
[safe integer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
