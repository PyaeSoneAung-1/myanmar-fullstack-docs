---
title: "CI (Continuous Integration) Build Caching ကို Configure လုပ်ခြင်း"
description: "CI environments တွေမှာ Next.js builds တွေကြား .next/cache ကို ထိန်းသိမ်းနိုင်အောင် configure လုပ်နည်း — Vercel, CircleCI, Travis CI, GitLab CI, Netlify, AWS CodeBuild, GitHub Actions, Bitbucket Pipelines, Heroku, Azure Pipelines နဲ့ Jenkins အတွက် ဥပမာ config တွေ"
order: 119
source: "https://nextjs.org/docs/app/guides/ci-build-caching"
status: translated
updated: 2026-09-03
---

Build performance ပိုကောင်းအောင် — Next.js က builds တွေကြားမှာ မျှဝေသုံးတဲ့ cache တစ်ခုကို `.next/cache` ထဲမှာ သိမ်းဆည်းပါတယ်။

Continuous Integration (CI) environments တွေမှာ ဒီ cache ရဲ့ အကျိုးကို ခံစားရဖို့ — သင့် CI workflow က builds တွေကြားမှာ cache ကို မှန်ကန်စွာ ထိန်းသိမ်းနိုင်အောင် (persist) configure လုပ်ထားဖို့ လိုပါတယ်။

> သင့် CI က builds တွေကြားမှာ `.next/cache` ကို ထိန်းသိမ်းဖို့ configure မထားရင် — [No Cache Detected](https://nextjs.org/docs/messages/no-cache) error တစ်ခုကို မြင်ရနိုင်ပါတယ်။

အသုံးများတဲ့ CI providers တွေအတွက် cache configuration ဥပမာတချို့ ဒီမှာ ပါပါတယ်:

## Vercel

Next.js caching ကို သင့်အတွက် အလိုအလျောက် configure လုပ်ပေးပါတယ်။ သင် ဘာမှ လုပ်စရာ မလိုပါဘူး။ Vercel ပေါ်မှာ Turborepo သုံးနေတယ်ဆိုရင် — [ဒီမှာ ပိုလေ့လာပါ](https://vercel.com/docs/monorepos/turborepo)。

## CircleCI

`.circleci/config.yml` ထဲက သင့် `save_cache` step ထဲ `.next/cache` ကို ထည့်ပါ:

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

`save_cache` key တစ်ခု မရှိသေးရင် — build caching သတ်မှတ်ခြင်းဆိုင်ရာ CircleCI ရဲ့ [documentation](https://circleci.com/docs/2.0/caching/) ကို လိုက်နာပါ။

## Travis CI

အောက်ပါတွေကို သင့် `.travis.yml` ထဲ ထည့်ပါ (သို့) ပေါင်းစပ်လိုက်ပါ:

```yaml
cache:
  directories:
    - $HOME/.cache/yarn
    - node_modules
    - .next/cache
```

## GitLab CI

အောက်ပါတွေကို သင့် `.gitlab-ci.yml` ထဲ ထည့်ပါ (သို့) ပေါင်းစပ်လိုက်ပါ:

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/
```

## Netlify CI

[`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs) နဲ့အတူ [Netlify Plugins](https://www.netlify.com/products/build/plugins/) တွေကို သုံးပါ။

## AWS CodeBuild

အောက်ပါတွေကို သင့် `buildspec.yml` ထဲ ထည့်ပါ (သို့) ပေါင်းစပ်လိုက်ပါ:

```yaml
cache:
  paths:
    - 'node_modules/**/*' # Cache `node_modules` for faster `yarn` or `npm i`
    - '.next/cache/**/*' # Cache Next.js for faster application rebuilds
```

## GitHub Actions

GitHub ရဲ့ [actions/cache](https://github.com/actions/cache) ကို သုံးပြီး — သင့် workflow file ထဲမှာ အောက်ပါ step ကို ထည့်ပါ:

```yaml
uses: actions/cache@v4
with:
  # See here for caching with `yarn`, `bun` or other package managers https://github.com/actions/cache/blob/main/examples.md or you can leverage caching with actions/setup-node https://github.com/actions/setup-node
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  # Generate a new cache whenever packages or source files change.
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  # If source files changed but packages didn't, rebuild from a prior cache.
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

## Bitbucket Pipelines

အောက်ပါတွေကို သင့် `bitbucket-pipelines.yml` ရဲ့ ထိပ်ဆုံး အဆင့်မှာ (`pipelines` နဲ့ အဆင့်တူ) ထည့်ပါ (သို့) ပေါင်းစပ်လိုက်ပါ:

```yaml
definitions:
  caches:
    nextcache: .next/cache
```

ပြီးရင် သင့် pipeline ရဲ့ `step` ထဲက `caches` section မှာ ဒါကို ရည်ညွှန်းပါ:

```yaml
- step:
    name: your_step_name
    caches:
      - node
      - nextcache
```

## Heroku

Heroku ရဲ့ [custom cache](https://devcenter.heroku.com/articles/nodejs-support#custom-caching) ကို သုံးပြီး — သင့် package.json ရဲ့ ထိပ်ဆုံးအဆင့်မှာ `cacheDirectories` array တစ်ခု ထည့်ပါ:

```javascript
"cacheDirectories": [".next/cache"]
```

## Azure Pipelines

Azure Pipelines ရဲ့ [Cache task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/cache) ကို သုံးပြီး — `next build` ကို run လုပ်တဲ့ task မတိုင်ခင် နေရာတစ်ခုခုမှာ အောက်ပါ task ကို သင့် pipeline yaml file ထဲ ထည့်ပါ:

```yaml
- task: Cache@2
  displayName: 'Cache .next/cache'
  inputs:
    key: next | $(Agent.OS) | yarn.lock
    path: '$(System.DefaultWorkingDirectory)/.next/cache'
```

## Jenkins (Pipeline)

Jenkins ရဲ့ [Job Cacher](https://www.jenkins.io/doc/pipeline/steps/jobcacher/) plugin ကို သုံးပြီး — သာမန်အားဖြင့် `next build` (သို့) `npm install` run လုပ်မယ့် နေရာမှာ သင့် `Jenkinsfile` ထဲကို အောက်ပါ build step ကို ထည့်ပါ:

```yaml
stage("Restore npm packages") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: "node_modules",
                includes: "**/*",
                cacheValidityDecidingFile: "package-lock.json"
            )
        ]) {
            sh "npm install"
        }
    }
}
stage("Build") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: ".next/cache",
                includes: "**/*",
                cacheValidityDecidingFile: "next-lock.cache"
            )
        ]) {
            // aka `next build`
            sh "npm run build"
        }
    }
}
```
