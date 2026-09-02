---
title: "TS Runner (tsx) သုံးခြင်း"
description: "Node.js မှာ TypeScript ကို runner တွေနဲ့ run ခြင်း — ts-node, tsx, node --import=tsx နဲ့ register လုပ်ခြင်း — type checking အကြံပြုချက်များ"
order: 37
source: "https://nodejs.org/en/learn/typescript/run"
status: translated
updated: 2026-09-02
---

## Runner တွေနဲ့ TypeScript run ခြင်း

Node.js ရဲ့ built-in TypeScript support က erasable syntax လိုမျိုး — type stripping နဲ့ ကိုင်တွယ်လို့ရတဲ့ syntax တွေအတွက်သာ သင့်တော်ပြီး — ပိုပြီး အဆင့်မြင့်တဲ့ TypeScript processing လိုအပ်ရင် (ဒါမှမဟုတ် v22.7.0 မတိုင်ခင် Node.js version တွေကို သုံးနေရင်) — ရွေးစရာ နှစ်ခု ရှိပါတယ်: ရှုပ်ထွေးမှု အများစုကို ကိုယ်စား ကိုင်တွယ်ပေးတဲ့ **runner** တစ်ခုကို သုံးတာ — ဒါမှမဟုတ် [transpilation](/docs/nodejs/running-typescript-code-using-transpilation) ကနေ ကိုယ်တိုင် အားလုံး ကိုင်တွယ်တာပါ။ Runner တွေက TypeScript code တွေကို run တဲ့အခါ လိုအပ်တဲ့ ရှုပ်ထွေးမှု အများစုကို သင့်ကိုယ်စား စီမံပေးတာမို့ — developer အနေနဲ့ code ရေးတာကိုပဲ အာရုံစိုက်နိုင်ပါတယ်။ ဒီစာမျက်နှာမှာ — TypeScript execution environment နှစ်ခု ဖြစ်တဲ့ `ts-node` နဲ့ `tsx` အကြောင်း လေ့လာကြည့်ပါမယ်။

## ts-node နဲ့ TypeScript Code run ခြင်း

[ts-node](https://typestrong.org/ts-node/) က Node.js အတွက် TypeScript execution environment တစ်ခုပါ — အရင်ဆုံး compile လုပ်စရာ မလိုဘဲ — TypeScript code တွေကို Node.js မှာ တိုက်ရိုက် run နိုင်စေပါတယ်။ Default အားဖြင့် — `transpileOnly` ကို enable မလုပ်ရသေးသရွေ့ — `ts-node` က type checking ကို လုပ်ပေးပါတယ်။ `ts-node` က runtime မှာ type errors တွေကို ဖမ်းနိုင်ပေမယ့် — code ကို ship မလုပ်ခင် `tsc` နဲ့ အရင်ဆုံး type-check လုပ်ဖို့တော့ အကြံပြုပါသေးတယ် — ဒါမှ ဖြစ်နိုင်ခြေရှိတဲ့ type errors တွေ အကုန်လုံးကို runtime မရောက်ခင် ဖမ်းမိမှာ ဖြစ်ပါတယ်။

`ts-node` ကို သုံးဖို့ အရင်ဆုံး install လုပ်ရပါမယ် — `-D` flag က package ကို devDependency အဖြစ် install လုပ်ပေးပါတယ်:

```bash
npm i -D ts-node
```

ပြီးရင် သင့် TypeScript code ကို ဒီလို run နိုင်ပါတယ်:

```bash
npx ts-node example.ts
```

ဒါဆိုရင် — JavaScript file အဖြစ် အရင်ဆုံး compile လုပ်စရာ မလိုဘဲ — `example.ts` ကို Node.js မှာ တိုက်ရိုက် run နိုင်ပါပြီ။

## tsx နဲ့ TypeScript Code run ခြင်း

[tsx](https://tsx.hirok.io/) က Node.js အတွက် နောက်ထပ် TypeScript execution environment တစ်ခုပါ — အရင်ဆုံး compile လုပ်စရာ မလိုဘဲ — TypeScript code တွေကို Node.js မှာ တိုက်ရိုက် run နိုင်စေပါတယ်။ ဒါပေမယ့် သတိပြုရမှာက — သူက type checking လုပ်ပေးမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် code ကို ship မလုပ်ခင် — အရင်ဆုံး `tsc` နဲ့ type check လုပ်ပြီးမှ — `tsx` နဲ့ run ဖို့ အကြံပြုပါတယ်။

`tsx` ကို သုံးဖို့ အရင်ဆုံး install လုပ်ရပါမယ် — `ts-node` လိုပဲ devDependency အဖြစ် install လုပ်တာပါ:

```bash
npm i -D tsx
```

ပြီးရင် သင့် TypeScript code ကို ဒီလို run နိုင်ပါတယ်:

```bash
npx tsx example.ts
```

`tsx` မှာ type checking မပါတာမို့ — type errors တွေကို runtime ရောက်မှ သိရမယ့်အစား — `tsc` နဲ့ အရင်ဆုံး စစ်ဆေးပြီးမှ run မယ်ဆိုရင် — bugs တွေကို production မရောက်ခင် အချိန်မှာ ဖမ်းမိနိုင်ပါတယ်။

### node ကနေ tsx ကို Register လုပ်ခြင်း

`node` ကနေ `tsx` ကို သုံးချင်ရင် — `--import` flag နဲ့ `tsx` ကို register လုပ်နိုင်ပါတယ် — `--import` က node process စတင်တဲ့အခါ သတ်မှတ်ထားတဲ့ module တစ်ခုကို ကြိုတင် import လုပ်ပေးတာမို့ — ဒီနည်းနဲ့ `tsx` ရဲ့ TypeScript support ကို node ထဲမှာ ထည့်သွင်းလိုက်တာ ဖြစ်ပါတယ်:

```bash
node --import=tsx example.ts
```

ဒါဆိုရင် — `npx` ကို မသုံးဘဲ — node command တစ်ခုတည်းနဲ့ TypeScript files တွေကို run နိုင်ပါပြီ။

## ဆက်ဖတ်ရန်

- [TypeScript Native အသုံးပြုခြင်း](/docs/nodejs/running-typescript-natively) — Node.js ရဲ့ built-in type stripping support
- [Transpilation ဖြင့် TypeScript သုံးခြင်း](/docs/nodejs/running-typescript-code-using-transpilation) — `tsc` နဲ့ compile လုပ်ပြီး run ခြင်း
- [TypeScript Package ထုတ်ဝေခြင်း](/docs/nodejs/publishing-a-typescript-package) — TypeScript package တွေကို npm မှာ ထုတ်ဝေခြင်း
