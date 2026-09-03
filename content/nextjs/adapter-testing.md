---
title: "Testing Adapters (adapter များ စမ်းသပ်ခြင်း)"
description: "Next.js compatibility test harness နှင့် custom lifecycle scripts ဖြင့် adapter စစ်ဆေးခြင်း"
order: 250
source: "https://nextjs.org/docs/app/api-reference/adapters/testing-adapters"
status: translated
updated: 2026-09-03
---

Next.js က adapter များကို စစ်ဆေး အတည်ပြုနိုင်ဖို့ test harness တစ်ခု ပံ့ပိုးပေးပါတယ် — deployment တစ်ခုစီအတွက် end-to-end tests တွေ run လုပ်ပေးတာပဲ ဖြစ်ပါတယ်။

ဥပမာ GitHub Actions workflow:

```yaml filename=".github/workflows/test-e2e-deploy.yml"
name: test-e2e-deploy

on:
  workflow_dispatch:
    inputs:
      nextjsRef:
        description: 'Next.js repo ref (branch/tag/SHA)'
        default: 'canary'
        type: string
  # schedule:
  #   - cron: '0 2 * * *'

jobs:
  build:
    name: Build Next.js + adapter
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
        with:
          path: adapter

      - uses: actions/checkout@v4
        with:
          repository: vercel/next.js
          ref: ${{ inputs.nextjsRef || 'canary' }}
          path: nextjs
          fetch-depth: 25

      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Setup pnpm
        run: npm i -g corepack@0.31 && corepack enable

      - name: Install & build Next.js
        working-directory: nextjs
        run: pnpm install && pnpm build && pnpm install

      - name: Install Playwright
        working-directory: nextjs
        run: pnpm playwright install --with-deps chromium

      - name: Build adapter
        working-directory: adapter
        run: pnpm install && pnpm build

      - uses: actions/cache/save@v4
        with:
          path: |
            nextjs
            adapter
            ~/.cache/ms-playwright
          key: build-${{ github.sha }}-${{ github.run_id }}

  test:
    name: Tests (${{ matrix.group }})
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 60
    strategy:
      fail-fast: false
      matrix:
        group:
          [
            1/16,
            2/16,
            3/16,
            4/16,
            5/16,
            6/16,
            7/16,
            8/16,
            9/16,
            10/16,
            11/16,
            12/16,
            13/16,
            14/16,
            15/16,
            16/16,
          ]
    steps:
      - uses: actions/cache/restore@v4
        with:
          path: |
            nextjs
            adapter
            ~/.cache/ms-playwright
          key: build-${{ github.sha }}-${{ github.run_id }}

      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Setup pnpm
        run: npm i -g corepack@0.31 && corepack enable

      - name: Ensure Playwright browser
        working-directory: nextjs
        run: pnpm playwright install chromium

      - name: Make scripts executable
        run: chmod +x adapter/scripts/e2e-deploy.sh
          adapter/scripts/e2e-logs.sh
          adapter/scripts/e2e-cleanup.sh

      - name: Run deploy tests
        working-directory: nextjs
        env:
          NEXT_TEST_MODE: deploy
          NEXT_E2E_TEST_TIMEOUT: 240000
          NEXT_EXTERNAL_TESTS_FILTERS: test/deploy-tests-manifest.json
          ADAPTER_DIR: ${{ github.workspace }}/adapter
          IS_TURBOPACK_TEST: 1
          NEXT_TEST_JOB: 1
          NEXT_TELEMETRY_DISABLED: 1

          # Change these to your adapter's scripts
          # Keep as-is if the scripts are in the adapter repository `scripts` directory
          NEXT_TEST_DEPLOY_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-deploy.sh
          NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-logs.sh
          NEXT_TEST_CLEANUP_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-cleanup.sh
        run: node run-tests.js --timings -g ${{ matrix.group }} -c 2 --type e2e
```

Test harness က အောက်ပါ environment variables တွေကို ရှာဖွေ အသုံးပြုပါတယ်:

- `NEXT_TEST_DEPLOY_SCRIPT_PATH`: Isolated test app ကို build လုပ်ပြီး deploy လုပ်ပေးမယ့် executable ရဲ့ path
- `NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH`: အဲဒီ deployment အတွက် build နဲ့ runtime logs တွေကို ပြန်ပေးမယ့် executable ရဲ့ path
- `NEXT_TEST_CLEANUP_SCRIPT_PATH`: Test run ပြီးသွားတဲ့အခါ deployment ကို ဖျက်သိမ်းပေးမယ့် optional executable ရဲ့ path

## Custom deploy script contract (custom deploy script ၏ သတ်မှတ်ချက်များ)

Deploy script (`NEXT_TEST_DEPLOY_SCRIPT_PATH`) ကို — Next.js test harness က ဖန်တီးပေးလိုက်တဲ့ isolated temporary app ကို `cwd` အဖြစ် သတ်မှတ်ပြီး — execute လုပ်ပါတယ်။

Deploy script က အောက်ပါ contract ကို လိုက်နာရပါမယ်:

- Failure ဖြစ်ရင် non-zero code နဲ့ exit လုပ်ရပါမယ်။
- Deployment URL ကို `stdout` ဆီ print လုပ်ရပါမယ်။ ဒါကို deployment ကို verify လုပ်ဖို့ သုံးမှာ ဖြစ်လို့ — `stdout` ဆီ တခြားဘာမှ မရေးသင့်ပါဘူး။
- Diagnostic output တွေကို `stderr` (သို့) working directory ထဲက files တွေဆီ ရေးပါ။

Deploy script နဲ့ logs script တွေက process သီးခြားစီ run လုပ်ကြတာမို့ — နောက်မှာ ပြန်သုံးချင်တဲ့ data တွေ (build IDs (သို့) server logs လိုမျိုး) ကို working directory ထဲက files တွေဆီ persist (သိမ်းဆည်း) ထားသင့်ပါတယ်။

ဥပမာ deploy script:

```bash filename="scripts/e2e-deploy.sh"
#!/usr/bin/env bash
set -euo pipefail

# Install the adapter, build the app, and deploy or start it.
node -e "
const pkg=JSON.parse(require('fs').readFileSync('package.json','utf8'));
pkg.dependencies=pkg.dependencies||{};
pkg.dependencies['adapter']='file:${ADAPTER_DIR}';
require('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));
" >&2

# Set the adapter path so that the app uses it.
export NEXT_ADAPTER_PATH="${ADAPTER_DIR}/dist/index.js"

# Build the app
pnpm build

# Write any metadata needed later to files in the working directory.
BUILD_ID="$(cat .next/BUILD_ID)"
DEPLOYMENT_ID="my-adapter-local"
# If your adapter enables immutable static assets, set this to "1".
NEXT_SUPPORTS_IMMUTABLE_ASSETS="0"

{
  echo "BUILD_ID: $BUILD_ID"
  echo "DEPLOYMENT_ID: $DEPLOYMENT_ID"
  echo "NEXT_SUPPORTS_IMMUTABLE_ASSETS: $NEXT_SUPPORTS_IMMUTABLE_ASSETS"
} >> .adapter-build.log

# Start or deploy the app. Capture the URL at this point or make the script output the URL to stdout.
provider-cli-to-deploy

# Example URL output:
# echo "http://127.0.0.1:3000"
```

## Custom logs script contract (custom logs script ၏ သတ်မှတ်ချက်များ)

Logs script (`NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH`) ကိုလည်း — Next.js test harness က ဖန်တီးပေးလိုက်တဲ့ isolated temporary app ကို `cwd` အဖြစ် သတ်မှတ်ပြီး — execute လုပ်ပါတယ်။

ထို့အပြင် ၎င်းက `NEXT_TEST_DIR` နဲ့ `NEXT_TEST_DEPLOY_URL` တို့ကို environment variables အနေနဲ့ လက်ခံရရှိပါတယ်။

၎င်းရဲ့ output မှာ အောက်ပါတို့နဲ့ စတင်တဲ့ lines တွေ ပါဝင်ရပါမယ်:

- `BUILD_ID:`
- `DEPLOYMENT_ID:`
- `NEXT_SUPPORTS_IMMUTABLE_ASSETS:`

ဒီ markers တွေ ပြီးတဲ့နောက်မှာ — logs script က failures တွေကို debug လုပ်ရာမှာ အထောက်အကူ ဖြစ်စေမယ့် အပိုဆောင်း build (သို့) server logs တွေကို print လုပ်နိုင်ပါတယ်။

```bash filename="scripts/e2e-logs.sh"
#!/usr/bin/env bash
set -euo pipefail

if [ -f ".adapter-build.log" ]; then
  cat ".adapter-build.log"
fi

if [ -f ".adapter-server.log" ]; then
  echo "=== .adapter-server.log ==="
  cat ".adapter-server.log"
fi
```

အသုံးများတဲ့ pattern တစ်ခုကတော့ — deploy script က `.adapter-build.log` နဲ့ `.adapter-server.log` files တွေကို ရေးထားပြီး — logs script က အဲဒီ files တွေကို ပြန်ဖတ်ကာ harness က လိုအပ်တဲ့ markers တွေကို ထုတ်ယူနိုင်အောင် လုပ်တာ ဖြစ်ပါတယ်။ ဒါက ရွေးစရာ နည်းလမ်း တစ်ခုပဲ ဖြစ်ပြီး — platform တစ်ခုချင်းစီမှာ logs ရယူဖို့ နည်းလမ်း မတူညီကြပါဘူး။

## Custom cleanup script contract (custom cleanup script ၏ သတ်မှတ်ချက်များ)

Cleanup script (`NEXT_TEST_CLEANUP_SCRIPT_PATH`) ကိုလည်း — Next.js test harness က ဖန်တီးပေးလိုက်တဲ့ isolated temporary app ကို `cwd` အဖြစ် သတ်မှတ်ပြီး — execute လုပ်ပါတယ်။

ထို့အပြင် ၎င်းကလည်း `NEXT_TEST_DIR` နဲ့ `NEXT_TEST_DEPLOY_URL` တို့ကို environment variables အနေနဲ့ လက်ခံရရှိပါတယ်။

Cleanup script ကို deploy script က ဖန်တီးခဲ့တဲ့ resources တွေကို ရှင်းလင်းဖို့ (clean up) သုံးနိုင်ပါတယ်။ Tests တွေ ပြီးစီးသွားပြီးနောက်မှာ run လုပ်ပါတယ်။

