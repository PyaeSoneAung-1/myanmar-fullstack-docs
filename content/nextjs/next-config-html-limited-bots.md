---
title: "htmlLimitedBots (blocking metadata လက်ခံမည့် bots စာရင်း)"
description: "htmlLimitedBots option — streaming metadata အစား blocking metadata ရရှိသင့်သော user agents များကို regex ဖြင့် သတ်မှတ်ရန်; Next.js ၏ default စာရင်း (Google crawlers, Bingbot, Twitterbot, Slackbot) ကို override လုပ်ခြင်း; /.*/ ဖြင့် streaming metadata လုံးဝ ပိတ်နိုင်; v15.2.0"
order: 205
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots"
status: translated
updated: 2026-09-03
---

`htmlLimitedBots` config က — [streaming metadata](/docs/nextjs/generate-metadata) အစား blocking metadata တွေကို လက်ခံရရှိစေချင်တဲ့ user agents စာရင်းတစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}
```

## Default list (မူလစာရင်း)

Next.js မှာ HTML limited bots တွေရဲ့ default စာရင်း ပါဝင်ပါတယ် — အောက်ပါတို့ အပါအဝင်:

- Google crawlers (ဥပမာ — Mediapartners-Google, AdsBot-Google, Google-PageRenderer)
- Bingbot
- Twitterbot
- Slackbot

စာရင်း အပြည့်အစုံကို [ဒီမှာ](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts) ကြည့်ပါ။

`htmlLimitedBots` config သတ်မှတ်လိုက်ရင် Next.js ရဲ့ default စာရင်းကို override လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် ဒါက အဆင့်မြင့် (advanced) အပြုအမူတစ်ခုပါ — အများစုအတွက်တော့ default ကပဲ လုံလောက်သင့်ပါတယ်။

```ts filename="next.config.ts" switcher
const config: NextConfig = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}
```

## Disabling (ပိတ်ခြင်း)

Streaming metadata ကို လုံးဝ ပိတ်ပစ်ဖို့:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /.*/,
}

export default config
```

```js filename="next.config.js" switcher
module.exports = {
  htmlLimitedBots: /.*/,
}
```

## Version History

| Version | Changes                              |
| ------- | ------------------------------------ |
| 15.2.0  | `htmlLimitedBots` option စတင် မိတ်ဆက်။ |
