---
title: "Mocha မှ Node.js Test Runner သို့"
description: "Mocha 8.x test suites တွေကို Node.js ရဲ့ built-in test runner (node:test) ဆီ codemod နဲ့ ပြောင်းရွှေ့ခြင်း — node:test imports ထည့်ခြင်း, hooks, done callbacks, this.skip() နဲ့ timeouts အသွင်ပြောင်းမှု ဥပမာများ"
order: 71
source: "https://nodejs.org/learn/userland-migrations/mocha-to-node-test-runner"
status: translated
updated: 2026-09-02
---

ဒီ codemod က [Mocha](https://mochajs.org/) 8.x test suites တွေကို — Node.js ရဲ့ built-in [test runner](https://nodejs.org/api/test.html) (`node:test` — Node.js 22.x နဲ့ 24.x တွေမှာ ရနိုင်ပါတယ်) ဆီ ပြောင်းရွှေ့ပေးပါတယ်။ File တစ်ခုက သုံးနေတဲ့ globals တွေ (`describe`, `it`, `before`, `after`, `beforeEach`, `afterEach`) အတွက် လိုအပ်တဲ့ `node:test` imports တွေကို ထည့်ပေးပြီး — `done` callbacks တွေကို `(t, done)` signature အဖြစ် ပြောင်းပေးကာ — `this.skip()` ကို `t.skip()` အဖြစ်၊ `this.timeout(N)` ကို `{ timeout: N }` options အဖြစ် ပြန်ရေးပေးပါတယ်။ မူရင်း function style ကိုတော့ ထိန်းသိမ်းပေးပါတယ် — (`function()` နဲ့ arrow functions အကြား ဘယ်တော့မှ ပြောင်းမပေးပါဘူး)။ CommonJS ရော ESM files တွေရော နှစ်မျိုးလုံး ပံ့ပိုးပြီး — ပြီးတဲ့အခါ `package.json` ကနေ `mocha` နဲ့ `@types/mocha` dependencies တွေကို ဖယ်ရှားပေးပါတယ်။

## အသုံးပြုပုံ (Usage)

ဒီ codemod ကို ဒီလို run ပါ:

```sh
npx codemod @nodejs/mocha-to-node-test-runner
```

## ဥပမာများ

### `node:test` imports ထည့်ခြင်း (CommonJS)

လိုက်ဖက်တဲ့ `require('node:test')` ကို ထည့်လိုက်တာနဲ့ — global `describe`/`it` အသုံးပြုမှုတွေ ဆက်အလုပ်လုပ်သွားပါတယ်။ `describe.skip` လို modifiers တွေကတော့ ကတည်းက လိုက်ဖက်ပြီးသားပါ:

```diff
 const assert = require('assert');
+const { describe, it } = require('node:test');

 describe('Array', function() {
   describe.skip('#indexOf()', function() {
     it('should return -1 when the value is not present', function() {
       const arr = [1, 2, 3];
       assert.strictEqual(arr.indexOf(4), -1);
     });
   });
 });
```

### `node:test` imports ထည့်ခြင်း (ESM)

ESM files တွေမှာတော့ အဲဒီအစား `import` statement တစ်ခု ထည့်ပေးပါတယ်:

```diff
 import assert from 'assert';
+import { describe, it } from 'node:test';

 describe('Array', function() {
   describe.skip('#indexOf()', function() {
     it('should return -1 when the value is not present', function() {
```

### Hooks

File ထဲမှာ တကယ်သုံးထားတဲ့ hooks တွေကိုပဲ import list ထဲ ထည့်ပေးပါတယ်:

```diff
 const assert = require('assert');
 const fs = require('fs');
+const { describe, before, after, it } = require('node:test');

 describe('File System', () => {
   before(function() {
     fs.writeFileSync('test.txt', 'Hello, World!');
   });

   after(() => {
     fs.unlinkSync('test.txt');
   });
```

### `done` callbacks

Mocha က `done` ကို callback ရဲ့ ပထမဆုံး argument အနေနဲ့ ပေးပါတယ်။ `node:test` ကတော့ test context ကို အရင်ပေးလို့ — `(done)` က `(t, done)` ဖြစ်သွားပါတယ်:

```diff
 const assert = require('assert');
+const { describe, it } = require('node:test');

 describe('Callback Test', function() {
-  it('should call done when complete', function(done) {
+  it('should call done when complete', function(t, done) {
     setTimeout(() => {
       assert.strictEqual(1 + 1, 2);
       done();
     }, 100);
   });
 });
```

### `this.skip()` နဲ့ test ကို ကျော်ခြင်း

`this.skip()` က `t.skip()` ဖြစ်သွားပြီး — လိုအပ်ရင် callback signature ထဲကို test context parameter `t` ကို ထည့်ပေးပါတယ်:

```diff
 const assert = require('assert');
+const { describe, it } = require('node:test');

 describe('Skipped Test', () => {
   it.skip('should not run this test', () => {
     assert.strictEqual(1 + 1, 3);
   });
-  it('should also be skipped', () => {
-    this.skip();
+  it('should also be skipped', (t) => {
+    t.skip();
     assert.strictEqual(1 + 1, 3);
   });

-  it('should also be skipped 2', (done) => {
-    this.skip();
+  it('should also be skipped 2', (t, done) => {
+    t.skip();
     assert.strictEqual(1 + 1, 3);
   });
 });
```

### Timeouts

Suites နဲ့ tests တွေပေါ်က `this.timeout(N)` calls တွေကို — `{ timeout: N }` options argument ထဲကို ရွှေ့ပေးပါတယ်:

```diff
 const assert = require('assert');
+const { describe, it } = require('node:test');

-describe('Timeout Test', function() {
-  this.timeout(500);
+describe('Timeout Test', { timeout: 500 }, function() {

-  it('should complete within 100ms', (done) => {
-    this.timeout(100);
+  it('should complete within 100ms', { timeout: 100 }, (t, done) => {
     setTimeout(done, 500); // ဒါက fail ဖြစ်ပါမယ်
   });

-  it('should complete within 200ms', function(done) {
-    this.timeout(200);
+  it('should complete within 200ms', { timeout: 200 }, function(t, done) {
     setTimeout(done, 100); // ဒါက pass ဖြစ်ပါမယ်
   });
 });
```

## မှတ်ချက်များ (Notes)

- Transformation ပြီးတဲ့အခါ — codemod က သင့် package manager ကို ရှာဖွေသိရှိပြီး — `package.json` ကနေ `mocha` နဲ့ `@types/mocha` dependencies တွေကို ဖယ်ရှားပေးပါတယ်။

### ကန့်သတ်ချက်များ (Limitations)

- `node:test` က Mocha ရဲ့ `retry` option ကို မပံ့ပိုးတာမို့ — အဲဒါကို မှီခိုနေတဲ့ tests တွေကို သပ်သပ်စီ ကိုင်တွယ်ဖို့ လိုပါတယ်။

## ဆက်ဖတ်ရန်

- [Userland Migrations မိတ်ဆက်](/docs/nodejs/userland-migrations) — Node.js ရဲ့ official codemods များအကြောင်း
- [Node.js Test Runner မိတ်ဆက်](/docs/nodejs/test-runner) — `node:test` module အကျဉ်းချုပ်
- [Test Runner အသုံးပြုခြင်း](/docs/nodejs/using-test-runner) — test suites တည်ဆောက်ပုံ
