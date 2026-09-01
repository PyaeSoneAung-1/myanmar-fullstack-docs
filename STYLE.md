# မြန်မာ ဘာသာပြန် Style Guide (Translation Style Guide)

ဤ file သည် content တွေကို မြန်မာလို ပြန်ဆိုရာမှာ တစ်ပြေးညီဖြစ်စေဖို့ စည်းမျဉ်းတွေပါ။
Translation လုပ်တဲ့သူ (agent / human) အားလုံး ဒီစည်းမျဉ်းကို လိုက်နာရမည်။

## 1. ဘာကို ပြန်ဆိုမလဲ
- Prose / explanation / description / instruction → မြန်မာလို ပြန်ဆိုရမည်။
- Code, file name, command, npm package name, URL, API name → မူရင်းအတိုင်း English ထားရမည်။
- Technical term များ → English term ကို ထားပြီး မြန်မာစာနဲ့ ရောသုံးနိုင်သည်။
  ဥပမာ — "component တွေကို ပေါင်းပြီး UI ဆောက်တယ်"၊ "state ကို update လုပ်တယ်"
- ပထမဆုံးအကြိမ် ပေါ်လာတဲ့အခါ ရှင်းလင်းချက် ထည့်နိုင်သည်။
  ဥပမာ — "revalidation (ဒေတာကို နောက်တစ်ကြိမ် ပြန်စစ်ဆေးခြင်း)"

## 2. အရေးအသား ပုံစံ
- သဘာဝကျတဲ့ မြန်မာစာ။ Literal translation မလုပ်ရ။
- Tone: ဖော်ရွေပြီး professional။ "ဒီ section မှာ..."၊ "ဆက်လုပ်ကြည့်ရအောင်"
- အတိုကောက် စာလုံးတွေကို English အတိုင်း ထားရမည်။ (UI, API, DB, HTTP...)
- Heading များ: မြန်မာလို ရေးပြီး လိုအပ်ရင် English term ကို paren နဲ့ ထည့်နိုင်သည်။
  ဥပမာ — `## Component တွေက ဘာလဲ`
- Code block ရှေ့မှာ ဘာလုပ်နေတာလဲ ရှင်းတဲ့ မြန်မာစာကြောင်း ထည့်ပါ။
- Code block ထဲက comment များကိုလည်း မြန်မာလို ပြန်ဆိုနိုင်သည်။

## 3. မှန်ကန်မှု
- Official documentation ကို မှီငြမ်းရမည်။ အကြောင်းအရာ မမှန်အောင် မပြောင်းရ။
- Version-specific ဖြစ်တဲ့ အချက်တွေ ရှိရင် source ကို ကိုးကားပါ။
- မူရင်း code example ကို ပြောင်းလဲခြင်း မပြုရ (ဘာသာပြန် comment မှလွဲ၍)။

## 4. Frontmatter ပုံစံ
```markdown
---
title: "ခေါင်းစဉ် (မြန်မာ)"
description: "တစ်ကြောင်း ဖော်ပြချက်"
order: 1
source: "https://official-docs-url.example/page"
status: translated
updated: 2026-09-01
---
```

## 5. စာလုံးပေါင်း / ဝေါဟာရ
- သင်္ချာ/နည်းပညာ ဝေါဟာရများ: English အတိုင်း ထားရမည်။
- အသုံးများသော ပြန်ဆိုမှုများ:
  - data fetching → data fetching (ဒေတာယူခြင်း)
  - server component → server component
  - client component → client component
  - state management → state စီမံခန့်ခွဲမှု
  - cache → cache (ကက်ရှ်)
  - revalidation → revalidation (ပြန်လည်စစ်ဆေးခြင်း)
- မြန်မာစာတွေမှာ space ကို ချွေတာသုံးပါ။ English စာလုံးနဲ့ မြန်မာစာ ကြားမှာ space ထည့်နိုင်သည်။

## 6. ပြီးပါက
- file ကို `content/<tech>/<slug>.md` မှာ သိမ်းပါ။
- source URL က official page ဖြစ်ရမည်။
