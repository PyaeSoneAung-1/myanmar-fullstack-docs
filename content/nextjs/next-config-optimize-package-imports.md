---
title: "optimizePackageImports (package imports များ optimize လုပ်ခြင်း)"
description: "optimizePackageImports option — modules အများအပြား export လုပ်သော packages များမှ အသုံးပြုနေသော modules များကိုသာ load လုပ်စေရန် experimental သတ်မှတ်ချက်; default optimize လုပ်ထားသော libraries စာရင်း ပါဝင်"
order: 195
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports"
status: translated
updated: 2026-09-03
---

Package အချို့က modules ရာပေါင်းများစွာ (သို့) ထောင်ပေါင်းများစွာအထိ export လုပ်နိုင်ပြီး — development ရော production မှာပါ performance ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။

Package တစ်ခုကို `experimental.optimizePackageImports` ထဲ ထည့်လိုက်ရင် — သင်အမှန်တကယ် သုံးနေတဲ့ modules တွေကိုပဲ load လုပ်ပြီး — named exports အများအပြားပါတဲ့ import statements တွေကို ရေးရတဲ့ အဆင်ပြေမှုကိုတော့ ဆက်လက် ထိန်းထားပေးပါတယ်။

```js filename="next.config.js"
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

အောက်ပါ libraries တွေကိုတော့ default အနေနဲ့ optimize လုပ်ပြီးသား ဖြစ်ပါတယ်:

- `lucide-react`
- `date-fns`
- `lodash-es`
- `ramda`
- `antd`
- `react-bootstrap`
- `ahooks`
- `@ant-design/icons`
- `@headlessui/react`
- `@headlessui-float/react`
- `@heroicons/react/20/solid`
- `@heroicons/react/24/solid`
- `@heroicons/react/24/outline`
- `@visx/visx`
- `@tremor/react`
- `rxjs`
- `@mui/material`
- `@mui/icons-material`
- `recharts`
- `react-use`
- `@material-ui/core`
- `@material-ui/icons`
- `@tabler/icons-react`
- `mui-core`
- `react-icons/*`
- `effect`
- `@effect/*`
