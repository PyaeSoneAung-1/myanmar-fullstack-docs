---
title: "Supporting Immutable Static Assets (immutable static assets ထောက်ပံ့ခြင်း)"
description: "adapter ထဲ immutable static asset ထောက်ပံ့ပုံ — fingerprinting, caching headers"
order: 258
source: "https://nextjs.org/docs/app/api-reference/adapters/immutable-static-assets"
status: translated
updated: 2026-09-03
---

ဒီ feature အကြောင်း end-user (နောက်ဆုံး အသုံးပြုသူ) ရှုထောင့်က အချက်အလက်များအတွက် — [`config.supportsImmutableAssets`](/docs/nextjs/next-config-supports-immutable-assets) ကို ကြည့်ပါ။

`config.supportsImmutableAssets` ကို enable လုပ်ထားတဲ့အခါ — Next.js က immutable (မပြောင်းလဲနိုင်သော), content-addressed (content ပေါ် မူတည်၍ အမည်တပ်ထားသော) static assets တွေကို `/_next/static/immutable/*` ဆိုတဲ့ public path အောက်မှာ ထုတ်ပေးပါတယ်။ CDN အဆင့်မှာ immutable static assets တွေကို non-immutable static assets တွေနဲ့ ခွဲခြားဖို့ ဒီ prefix ကို အသုံးပြုနိုင်ပါတယ်။

Runtime မှာတော့ — ဒီ immutable static assets တွေကို `?dpl` query parameter မပါဘဲ request လုပ်တာမို့ — deployments တွေကြားမှာ shared namespace (မျှဝေသုံးစွဲထားသော namespace) တစ်ခုထဲမှာ တည်ရှိနေပါတယ်။ ဒီ assets တွေက immutable ဖြစ်ပြီး — deployment အသစ်တစ်ခု ပြီးနောက်မှာတောင် — မပြောင်းလဲအောင်၊ ပြီးတော့ ၎င်းတို့ကို အသုံးပြုနေတဲ့ active deployments တွေ ရှိနေသမျှ — ဖျက်ပစ်ခြင်း မရှိအောင် သေချာ လုပ်ထားရပါမယ်။ Next.js က filename အဖြစ် ပိုတိုအောင် ဖြတ်ထားတဲ့ (truncated) content hash ကို သုံးနိုင်တာမို့ — `outputs.staticFiles[].immutableHash` မှာ hash collision (hash တိုက်မိမှု) ဖြစ်ခဲ့မဖြစ်ခဲ့ စစ်ဆေးအတည်ပြုဖို့ အသုံးပြုနိုင်တဲ့ full content hash ပါဝင်ပါတယ်။

Content hashes တွေအတွက် salt (ကာကွယ်စာလုံး) တစ်ခု သတ်မှတ်ချင်တယ်ဆိုရင် — hashes တွေကို ဘာအကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် (ဥပမာ — hash collision တစ်ခု တွေ့ရှိပြီးနောက်) လှည့်ပြောင်း (rotate) လုပ်ချင်တဲ့အခါ — `config.outputHashSalt` ကို အသုံးပြုနိုင်ပါတယ်။

Non-immutable static assets တွေ (deployments အကြားမှာ ပြောင်းလဲနိုင်ပြီး `?dpl` query parameter နဲ့ပဲ ဆက်လက် request လုပ်ခံရတဲ့) ကိုလည်း — ဥပမာ `public` folder (သို့) Next.js ဗားရှင်းအဟောင်းတွေအတွက် — ဆက်လက် ထောက်ပံ့ဖို့ လိုအပ်ကြောင်း သတိပြုပါ။

## Adapter Implementation (adapter ထဲ အကောင်အထည်ဖော်ခြင်း)

သင် လုပ်ဆောင်ရမှာတွေကတော့:

1. `modifyConfig` ထဲမှာ — သင် immutable static assets တွေကို deploy လုပ်တာကို ထောက်ပံ့ကြောင်း အချက်ပြဖို့ — `config.supportsImmutableAssets` property ကို `true` အဖြစ် သတ်မှတ်ပါ (user က `false` အဖြစ် သတ်မှတ်ပြီးသား မဟုတ်ရင်)၊ ပြီးတော့
2. `onBuildComplete` ထဲမှာ — ဘယ် static assets တွေက immutable ဖြစ်ပြီး `?dpl` query parameter မပါဘဲ request လုပ်ရမယ်ဆိုတာ ဆုံးဖြတ်ဖို့ — `outputs.staticFiles[].immutableHash` property ကို ဖတ်ပါ။

```js filename="my-adapter.js"
/** @type {import('next').NextAdapter} */
const adapter = {
  name: 'my-custom-adapter',

  async modifyConfig(config, { phase }) {
    if (phase === 'phase-production-build') {
      config.supportsImmutableAssets =
        // Default to true, but allow users to opt-out
        config.supportsImmutableAssets ?? true

      // Optionally, pass a salt for the content hashes
      // config.outputHashSalt = getSaltForCurrentProject()
    }
    return config
  },

  async onBuildComplete({ outputs }) {
    for (const output of outputs.staticFiles) {
      if (output.immutableHash != null) {
        // This has to be requestable at `output.pathname`
        // even without the `?dpl` query parameter.
        uploadOrVerifyImmutableStaticAsset(
          output.filePath,
          output.pathname,
          output.immutableHash
        )
      } else {
        // This is a non-immutable static asset and will be requested with
        // the `?dpl` query parameter, scoped to the deployment.
        uploadStaticAsset(output.filePath, output.pathname)
      }
    }

    // Process other outputs....
  },
}
```
