---
title: "TypeScript Package ထုတ်ဝေခြင်း"
description: "TypeScript package တွေကို npm မှာ ထုတ်ဝေခြင်း — source structure နဲ့ published structure, types (.d.ts) generate လုပ်ခြင်း, CI type checks, tsconfig build setup, .npmignore နဲ့ prepack"
order: 38
source: "https://nodejs.org/en/learn/typescript/publishing-a-ts-package"
status: translated
updated: 2026-09-02
---

## နိဒါန်း

ဒီ article က TypeScript publishing နဲ့ သက်ဆိုင်တဲ့ အချက်တွေကို သီးသန့် ဖော်ပြပါတယ်။ Publishing ဆိုတာ — npm (ဒါမှမဟုတ် တခြား package manager) ကနေ package အဖြစ် ဖြန့်ဝေတာကို ဆိုလိုပြီး — production မှာ run ဖို့ app / server တစ်ခုကို compile လုပ်တာ (PWA ဒါမှမဟုတ် endpoint server လိုမျိုး) နဲ့တော့ မသက်ဆိုင်ပါဘူး။

သတိပြုရမယ့် အချက်အချို့:

- *Publishing a package* guide ထဲက အချက်အားလုံး ဒီမှာလည်း သက်ရောက်ပါတယ်။
  - `main` လိုမျိုး fields တွေက **published content** ပေါ်မှာ အလုပ်လုပ်ပါတယ် — TypeScript source code ကို JavaScript အဖြစ် transpile လုပ်ပြီးတဲ့အခါ JavaScript က published content ဖြစ်လာပြီး — `main` က JavaScript file extension နဲ့ JavaScript file ကို ညွှန်ပြရပါမယ် (ဥပမာ — `main.ts` → `"main": "main.js"`)။
  - `scripts.test` လိုမျိုး fields တွေကတော့ **source code** ပေါ်မှာ အလုပ်လုပ်ပြီး — source code ရဲ့ file extensions တွေကို သုံးရပါမယ် (ဥပမာ — `"test": "node --test './src/**/*.test.ts'`)။
- Node.js က TypeScript code တွေကို "[type stripping](https://nodejs.org/api/typescript.html#type-stripping)" လို့ခေါ်တဲ့ လုပ်ငန်းစဉ်နဲ့ run ပါတယ် — ဒီမှာ node က ([Amaro](https://github.com/nodejs/amaro) ကတစ်ဆင့်) TypeScript-specific syntax တွေကို ဖယ်ရှားပြီး — node နားလည်းလို့ရတဲ့ vanilla JavaScript ကို ချန်ထားပေးပါတယ်။ ဒီ behavior က node version 22.18.0 ကစပြီး default အနေနဲ့ enable ဖြစ်ပါတယ်။
  - Node က `node_modules` ထဲမှာ types တွေကို strip လုပ်ပေးမှာ မဟုတ်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ ဒါက တရားဝင် TypeScript compiler (`tsc`) နဲ့ VS Code ရဲ့ အစိတ်အပိုင်းတချို့အတွက် သိသာတဲ့ performance ပြဿနာတွေ ဖြစ်စေနိုင်လို့ပါ — ဒါကြောင့် TypeScript maintainers တွေက လူတွေအနေနဲ့ raw TypeScript ကို ထုတ်ဝေတာကို — အနည်းဆုံး လောလောဆယ်တော့ — မထောက်ခံချင်ကြပါဘူး။
- `enum` လိုမျိုး TypeScript-specific features တွေကို သုံးဖို့ဆိုရင် node မှာ flag တစ်ခု ([`--experimental-transform-types`](https://nodejs.org/api/typescript.html#typescript-features)) လိုအပ်ပါသေးတယ်။ ဒီ features တွေအတွက် ပိုကောင်းတဲ့ အခြားရွေးချယ်စရာတွေ ရှိတတ်ပါတယ်။
  - Code ထဲမှာ TypeScript-specific features တွေ မပါအောင် (ကိုယ့် code က node မှာ ရိုးရိုး run လို့ရအောင်) — TypeScript version 5.8+ မှာ ရှိတဲ့ [`erasableSyntaxOnly`](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option) config option ကို သတ်မှတ်နိုင်ပါတယ်။
- [dependabot](https://docs.github.com/en/code-security/dependabot) ကို သုံးပြီး — github actions တွေထဲက dependency တွေ အပါအဝင် — ကိုယ့် dependencies တွေ နောက်ဆုံးပေါ် ဖြစ်နေအောင် ထားပါ — အရမ်းလွယ်ကူတဲ့ set-and-forget configuration တစ်ခုပါ။
- `.nvmrc` က [`nvm`](https://github.com/nvm-sh/nvm) (node အတွက် multi-version manager တစ်ခု) ကနေ လာတာပါ — project အတွက် ယေဘုယျအားဖြင့် သုံးသင့်တဲ့ node version ကို သတ်မှတ်နိုင်စေပါတယ်။

Repository တစ်ခုရဲ့ directory အသွင်အပြင်က ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```text
example-ts-pkg/
├ .github/
│ ├ workflows/
│ │ ├ ci.yml
│ │ └ publish.yml
│ └ dependabot.yml
├ src/
│ ├ foo.fixture.js
│ ├ main.ts
│ ├ main.test.ts
│ ├ some-util.ts
│ └ some-util.test.ts
├ LICENSE
├ package.json
├ README.md
└ tsconfig.json
```

```text
example-ts-pkg/
├ .github/
│ ├ workflows/
│ │ ├ ci.yml
│ │ └ publish.yml
│ └ dependabot.yml
├ src/
│ ├ __test__/
│ │ ├ foo.fixture.js
│ │ ├ main.test.ts
│ ├ main.ts
│ └ some-util/
│   ├ __test__
│   │ └ some-util.test.ts
│   └ some-util.ts
├ LICENSE
├ package.json
├ README.md
└ tsconfig.json
```

```text
example-ts-pkg/
├ .github/
│ ├ workflows/
│ │ ├ ci.yml
│ │ └ publish.yml
│ └ dependabot.yml
├ src/
│ ├ main.ts
│ ├ some-util.ts
├ test/
│ ├ foo.fixture.js
│ ├ main.ts
│ └ some-util.ts
├ LICENSE
├ package.json
├ README.md
└ tsconfig.json
```

ပြီးတော့ ထုတ်ဝေပြီးသား package ရဲ့ directory အသွင်အပြင်ကတော့ ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```text
example-ts-pkg/
├ LICENSE
├ main.d.ts
├ main.d.ts.map
├ main.js
├ package.json
├ README.md
├ some-util.d.ts
├ some-util.d.ts.map
└ some-util.js
```

```text
example-ts-pkg/
├ dist/
│ ├ main.d.ts
│ ├ main.d.ts.map
│ ├ main.js
│ ├ some-util.d.ts
│ ├ some-util.d.ts.map
│ └ some-util.js
├ LICENSE
├ package.json
└ README.md
```

Directory စီစဉ်မှုနဲ့ ပတ်သက်ပြီး — tests တွေကို နေရာချတဲ့အခါ သုံးလေ့ရှိတဲ့ နည်းလမ်းအနည်းငယ် ရှိပါတယ်။ Principle of least knowledge အရ — tests တွေကို implementation နဲ့ ကပ်ပြီး (co-locate) ထားလေ့ရှိပါတယ်။ တစ်ခါတစ်ရံ တစ်ခုတည်းသော directory ထဲမှာ ဖြစ်ဖြစ် — implementation နဲ့ ကပ်နေတဲ့ `__test__` လို drawer တစ်ခုထဲမှာ ဖြစ်ဖြစ် ထားပါတယ် ("Files co-located but segregated")။ တစ်ချို့ကတော့ `src/` ရဲ့ ဘေးမှာ `test/` ဆိုတဲ့ sibling directory တစ်ခု ဖန်တီးပြီး ("'src' and 'test' fully segregated") — mirrored structure ဒါမှမဟုတ် "junk drawer" ပုံစံနဲ့ ခွဲထားလေ့ ရှိပါတယ်။

## Types တွေနဲ့ ဘာလုပ်ရမလဲ

### Types တွေကို Test တစ်ခုလို သဘောထားပါ

Types တွေရဲ့ ရည်ရွယ်ချက်က — implementation တစ်ခု အလုပ်လုပ်မှာ မဟုတ်ဘူးဆိုတာကို ကြိုတင် သတိပေးဖို့ပါ:

```ts
// @errors: 2322
const foo = 'a';
const bar: number = 1 + foo;
```

TypeScript က အပေါ်က code က ရည်ရွယ်ထားတဲ့အတိုင်း အလုပ်လုပ်မှာ မဟုတ်ဘူးဆိုတာ သတိပေးပါတယ် — unit test တစ်ခုက code က ရည်ရွယ်ထားတဲ့အတိုင်း အလုပ်လုပ်မှာ မဟုတ်ဘူးလို့ သတိပေးသလိုပါပဲ။ ဒီနှစ်ခုက တစ်ခုနဲ့တစ်ခု ဖြည့်စွက်ပေးပြီး — မတူညီတဲ့ အရာတွေကို စစ်ဆေးပေးတာမို့ — နှစ်ခုလုံး ရှိထားသင့်ပါတယ်။

သင့် editor (ဥပမာ VS Code) မှာ TypeScript အတွက် built-in support ပါလေ့ ရှိပြီး — အလုပ်လုပ်နေတုန်းမှာကို errors တွေ ပြပေးပါတယ်။ အဲဒီလို မဟုတ်ရင် ဒါမှမဟုတ် အဲဒါတွေကို လွတ်သွားခဲ့ရင် — CI က နောက်ကနေ ဖမ်းပေးပါလိမ့်မယ်။

အောက်က [GitHub Action](https://github.com/features/actions) က — `main` branch ဆီ PR တစ်ခု ဝင်တဲ့အခါ types တွေ inspection ကို အောင်မြင်စွာ ဖြတ်သွားကြောင်း အလိုအလျောက် စစ်ဆေး (ပြီး လိုအပ်) စေတဲ့ CI task တစ်ခုကို setup လုပ်ပေးပါတယ်:

```yaml
# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json

name: Tests

on:
  pull_request:
    branches: ['*']

jobs:
  check-types:
    # Separate these from tests because
    # they are platform and node-version independent
    # and need be run only once.

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - name: npm clean install
        run: npm ci
      # You may want to run a lint check here too
      - run: node --run types:check

  get-matrix:
    # Automatically pick active LTS versions
    runs-on: ubuntu-latest
    outputs:
      latest: ${{ steps.set-matrix.outputs.requireds }}
    steps:
      - uses: ljharb/actions/node/matrix@main
        id: set-matrix
        with:
          versionsAsRoot: true
          type: majors
          preset: '>= 22' # glob is not backported below 22.x

  test:
    needs: [get-matrix]
    runs-on: ${{ matrix.os }}

    strategy:
      fail-fast: false
      matrix:
        node-version: ${{ fromJson(needs.get-matrix.outputs.latest) }}
        os:
          - macos-latest
          - ubuntu-latest
          - windows-latest

    steps:
      - uses: actions/checkout@v4
      - name: Use node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - name: npm clean install
        run: npm ci
      - run: node --run test
```

ဒီ workflow နဲ့ တွဲသုံးဖို့ `package.json` ထဲမှာ လိုအပ်တဲ့ scripts တွေ:

```json
{
  "name": "example-ts-pkg",
  "scripts": {
    "test": "node --test './src/**/*.test.ts'",
    "types:check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

`tsc` က compile လုပ်တဲ့အခါ — `.d.ts` declarations တွေနဲ့ `.js` files တွေကို ဘယ်နေရာမှာ ရေးမလဲ သတ်မှတ်ပေးတဲ့ tsconfig file တစ်ခုလည်း လိုပါတယ် — ပထမ ဥပမာက `outDir` ကို `./` ထားပြီး — output files တွေကို project root မှာ (published "flat" structure လိုမျိုး) ရေးပါတယ်:

```json
{
  "compilerOptions": {
    "allowArbitraryExtensions": true,
    "declaration": true,
    "declarationMap": true,
    "lib": ["es2023"],
    "module": "NodeNext",
    "outDir": "./",
    "resolveJsonModule": true,
    "rewriteRelativeImportExtensions": true,
    "target": "es2022"
  },
  // These may be different for your repo:
  "include": ["./src"],
  "exclude": ["**/*/*.test.*", "**/*.fixture.*"]
}
```

ဒုတိယ ဥပမာကတော့ — output files တွေကို `dist/` ဆိုတဲ့ folder တစ်ခုထဲ ထည့်ချင်တဲ့သူတွေအတွက် မူကွဲတစ်ခုပါ:

```json
{
  "compilerOptions": {
    "allowArbitraryExtensions": true,
    "declaration": true,
    "declarationMap": true,
    "lib": ["es2023"],
    "module": "NodeNext",
    "outDir": "./dist",
    "resolveJsonModule": true,
    "rewriteRelativeImportExtensions": true,
    "target": "es2022"
  },
  // These may be different for your repo:
  "include": ["./src"],
  "exclude": ["**/*/*.test.*", "**/*.fixture.*"]
}
```

Test files တွေမှာ မတူညီတဲ့ `tsconfig.json` တစ်ခု သက်ရောက်နေနိုင်လို့ (ဒါကြောင့် အပေါ်က samples တွေမှာ exclude လုပ်ထားတာ) သတိပြုပါ။

### Type Declarations တွေ Generate လုပ်ခြင်း

Type declarations (`.d.ts` နဲ့ ဆက်စပ်ဖိုင်တွေ) က type information တွေကို sidecar file တစ်ခုအနေနဲ့ ထောက်ပံ့ပေးပြီး — execution code ကိုတော့ vanilla JavaScript အဖြစ် ထားနိုင်ကာ — types တွေ ရှိနေဆဲ ဖြစ်စေပါတယ်။

ဒါတွေက source code ပေါ်မူတည်ပြီး generate လုပ်တာမို့ — သင့် publication process ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ build လုပ်နိုင်ပြီး — repository ထဲမှာ commit လုပ်ထားစရာ မလိုပါဘူး။

အောက်က ဥပမာမှာ — npm registry ဆီ မထုတ်ဝေခင် ချက်ချင်း type declarations တွေကို generate လုပ်ထားပါတယ်:

```yaml
# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json

# This is mostly boilerplate.

name: Publish to npm
on:
  push:
    tags:
      - '**@*'

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci

      # - name: Publish to npm
      #   run: … npm publish …
```

`npm publish` run တိုင်း `tsc` ကို အလိုအလျောက် run ဖြစ်အောင် — `package.json` ထဲမှာ `prepack` script ကို ဒီလို ထည့်နိုင်ပါတယ်:

```diff
{
  "name": "example-ts-pkg",
  "scripts": {
+   "prepack": "tsc",
    "types:check": "tsc --noEmit"
  }
}
```

Published package ကို minimal ဖြစ်အောင် — `.npmignore` နဲ့ မပါစေချင်တဲ့ files တွေကို ဖယ်ထားနိုင်ပါတယ်:

```ini
*.*ts       # foo.cts foo.mts foo.ts
!*.d.*ts
*.fixture.*
```

```ini
src
test
```

သင့် package ကို စားသုံးမယ့်သူ (consumer) က ဘယ် Node.js version ကို run နေမယ်ဆိုတာ မသိနိုင်လို့ — Node.js LTS versions အားလုံးကို support လုပ်အောင် compile လုပ်ထားတဲ့ package တစ်ခုကို ထုတ်ဝေချင်ပါလိမ့်မယ် — ဒီ article ထဲက `tsconfig` တွေက node 18.x နဲ့ နောက်ပိုင်းတွေကို support လုပ်ပါတယ်။

`npm publish` က [`prepack` ကို အရင်ဆုံး အလိုအလျောက် run ပေးပါတယ်](https://docs.npmjs.com/cli/using-npm/scripts#npm-publish)။ `npm` က `npm pack --dry-run` မတိုင်ခင် (တကယ် မထုတ်ဝေဘဲ — ထုတ်ဝေမယ့် package ထဲမှာ ဘာတွေ ပါမယ်ဆိုတာ အလွယ်တကူ မြင်နိုင်အောင်) `prepack` ကိုလည်း အလိုအလျောက် run ပေးပါတယ်။ **သတိပြုရမှာ** — [node --run](/docs/nodejs/run-nodejs-scripts) ကတော့ ဒါကို မလုပ်ပေးပါဘူး။ ဒီ step အတွက် `node --run` ကို သုံးလို့မရတာမို့ — အဲဒီ caveat က ဒီနေရာမှာ သက်ရောက်မှု မရှိပေမယ့် — တခြား steps တွေအတွက်တော့ သက်ရောက်နိုင်ပါတယ်။

npm ဆီ တကယ် ထုတ်ဝေဖို့ လုပ်ရမယ့် အဆင့်တွေကိုတော့ သပ်သပ်စီ article တစ်ခုမှာ ထည့်သွင်းဖော်ပြသွားမှာ ဖြစ်ပါတယ် (ဒီ article ရဲ့ scope ထက် ကျော်လွန်တဲ့ pros/cons တွေ အများကြီး ရှိလို့ပါ)။

#### အပိုင်းလိုက် ရှင်းပြချက်

Type declarations တွေကို generate လုပ်ခြင်းက deterministic ဖြစ်ပါတယ် — input တူရင် output က အမြဲတမ်း တူညီပါတယ်။ ဒါကြောင့် ဒါတွေကို git ထဲ commit လုပ်စရာ မလိုပါဘူး။

[`npm publish`](https://docs.npmjs.com/cli/commands/npm-publish) က command run လုပ်တဲ့ အချိန်မှာ ရနိုင်တဲ့/သက်ဆိုင်တဲ့ အရာအားလုံးကို ယူပါတယ် — ဒါကြောင့် မထုတ်ဝေခင် ချက်ချင်း type declarations တွေ generate လုပ်ထားရင် — အဲဒါတွေ ရနေပြီး package ထဲ ပါသွားမှာ ဖြစ်ပါတယ်။

Default အနေနဲ့ `npm publish` က (အကုန်လိုလို) ယူပါတယ် ([Files included in package](https://docs.npmjs.com/cli/commands/npm-publish#files-included-in-package) ကို ကြည့်ပါ)။ ထုတ်ဝေတဲ့ package ကို minimal ဖြစ်အောင် (node_modules အကြောင်း ပြောတဲ့ "Heaviest Objects in the Universe" meme ကို မှတ်မိလား) — tests နဲ့ test fixtures လို files တချို့ကို packaging ကနေ ဖယ်ထားချင်ပါလိမ့်မယ်။ ဒါတွေကို [`.npmignore`](https://docs.npmjs.com/cli/using-npm/developers#keeping-files-out-of-your-package) မှာ သတ်မှတ်ထားတဲ့ opt-out list ထဲ ထည့်ပါ — `!*.d.ts` exception ပါအောင် သေချာစေပါ — မပါရင် generate လုပ်ထားတဲ့ type declarations တွေ ထုတ်ဝေမှာ မဟုတ်ပါဘူး! တစ်နည်းအနေနဲ့ — [package.json ရဲ့ "files"](https://docs.npmjs.com/cli/configuring-npm/package-json#files) ကို သုံးပြီး opt-in list တစ်ခု ဖန်တီးနိုင်ပါတယ် (file တစ်ခုကို မတော်တဆ ချန်လွှတ်မိရင် သင့် package က downstream users တွေအတွက် ပျက်သွားနိုင်လို့ — ဒါက ပိုပြီး မလုံခြုံတဲ့ option ပါ)။

## ဆက်ဖတ်ရန်

- [TypeScript Native အသုံးပြုခြင်း](/docs/nodejs/running-typescript-natively) — Node.js မှာ type stripping နဲ့ တိုက်ရိုက် run ခြင်း
- [Command line ကနေ Node.js scripts များကို run ခြင်း](/docs/nodejs/run-nodejs-scripts) — `node --run` task runner အကြောင်း အပါအဝင်
- [npm အခြေခံ](/docs/nodejs/npm-basics) — npm packages နဲ့ scripts တွေ အလုပ်လုပ်ပုံ
