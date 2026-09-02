---
title: "React Compiler — Debugging and Troubleshooting (အမှားရှာဖွေခြင်းနှင့် ပြဿနာဖြေရှင်းခြင်း)"
description: "React Compiler ပြဿနာတွေကို ရှာဖွေဖြေရှင်းနည်း — compiler errors နဲ့ runtime issues ကွာခြားချက်၊ compilation ချိုးဖျက်တတ်တဲ့ ပုံစံများ၊ debugging workflow၊ compiler bugs တင်ပြနည်း"
order: 123
source: "https://react.dev/learn/react-compiler/debugging"
status: translated
updated: 2026-09-02
---

ဒီ guide က React Compiler သုံးတဲ့အခါ ပြဿနာတွေကို ရှာဖွေ ဖြေရှင်းဖို့ ကူညီပေးပါတယ်။ Compilation ပြဿနာတွေကို ဘယ်လို debug လုပ်မလဲနဲ့ သာမန် ပြဿနာတွေကို ဘယ်လို ဖြေရှင်းမလဲ လေ့လာပါ။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- Compiler errors နဲ့ runtime issues တွေကြားက ကွာခြားချက်
- Compilation ကို ချိုးဖျက်တတ်တဲ့ သာမန် ပုံစံများ
- အဆင့်လိုက် debugging workflow

## Compiler အပြုအမူကို နားလည်ခြင်း

React Compiler က [Rules of React](https://react.dev/reference/rules) တွေကို လိုက်နာတဲ့ code တွေကို ကိုင်တွယ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။ ဒီ rules တွေကို ချိုးဖောက်နိုင်တဲ့ code တစ်ခုကို ကြုံရတဲ့အခါ — သင့် app ရဲ့ အပြုအမူကို ပြောင်းလဲပစ်နိုင်ခြေ အန္တရာယ်ထက် — optimization ကို ဘေးကင်းစွာ ကျော်သွားပါတယ်။

### Compiler Errors နဲ့ Runtime Issues တွေကြားက ကွာခြားချက်

**Compiler errors** တွေက build time မှာ ဖြစ်ပေါ်ပြီး — သင့် code compile မဖြစ်အောင် တားဆီးပါတယ်။ ဒါတွေက ရှားပါတယ် — ဘာလို့လဲဆိုတော့ compiler က fail ဖြစ်မယ့်အစား ပြဿနာရှိတဲ့ code တွေကို ကျော်သွားဖို့ ဒီဇိုင်းထုတ်ထားလို့ပါ။

**Runtime issues** တွေက compiled code က မျှော်လင့်ထားတာထက် ကွဲပြားစွာ ပြုမူတဲ့အခါ ဖြစ်ပေါ်ပါတယ်။ React Compiler နဲ့ ပြဿနာတစ်ခု ကြုံရတဲ့အခါ အများစုက runtime issue ပါ။ ဒါက ပုံမှန်အားဖြင့် — သင့် code က compiler မှန်းဆလို့မရတဲ့ သိမ်မွေ့တဲ့ နည်းလမ်းတွေနဲ့ Rules of React တွေကို ချိုးဖောက်ပြီး — compiler က ကျော်သွားသင့်တဲ့ component တစ်ခုကို မှားပြီး compile လုပ်မိတဲ့အခါ ဖြစ်တတ်ပါတယ်။

Runtime issues တွေကို debug လုပ်တဲ့အခါ — သက်ရောက်မှုရှိတဲ့ components တွေထဲမှာ ESLint rule က မှန်းဆမရတဲ့ Rules of React violations တွေကို ရှာဖွေဖို့ အာရုံစိုက်ပါ။ Compiler က သင့် code က ဒီ rules တွေကို လိုက်နာတယ်ဆိုတာအပေါ် မှီခိုပြီး — သူမှန်းဆလို့မရတဲ့ နည်းလမ်းတွေနဲ့ ချိုးဖောက်ခံရတဲ့အခါ — runtime ပြဿနာတွေ ဖြစ်ပေါ်လာတာပါ။

## Compilation ကို ချိုးဖျက်တတ်တဲ့ သာမန် ပုံစံများ

React Compiler က သင့် app ကို ချိုးဖျက်နိုင်တဲ့ အဓိက နည်းလမ်းတွေထဲက တစ်ခုက — သင့် code က မှန်ကန်မှုအတွက် memoization အပေါ် မှီခိုပြီး ရေးထားတဲ့အခါပါ။ ဆိုလိုတာက — သင့် app က မှန်ကန်စွာ အလုပ်လုပ်ဖို့ သီးခြား values တွေ memoize လုပ်ခံထားရတာပေါ်မှာ မှီခိုနေတာပါ။ Compiler က သင့် manual နည်းလမ်းနဲ့ မတူဘဲ memoize လုပ်နိုင်လို့ — effects တွေ မလိုအပ်ဘဲ ထပ်ခါထပ်ခါ fire ဖြစ်တာ၊ infinite loops တွေ၊ update တွေ ပျောက်နေတာလို မမျှော်လင့်ထားတဲ့ အပြုအမူတွေဆီ ဦးတည်သွားနိုင်ပါတယ်။

ဒီလို ဖြစ်လေ့ရှိတဲ့ အခြေအနေတွေ:

- **Referential equality အပေါ် မှီခိုတဲ့ Effects တွေ** — Effects တွေက renders တစ်လျှောက် objects ဒါမှမဟုတ် arrays တွေ reference အတူတူ ရှိနေတာပေါ်မှာ မှီခိုနေတဲ့အခါ
- **Stable references လိုအပ်တဲ့ Dependency arrays တွေ** — Unstable dependencies တွေက effects တွေကို မကြာခဏ fire ဖြစ်စေတာ ဒါမှမဟုတ် infinite loops တွေ ဖန်တီးစေတဲ့အခါ
- **Reference checks တွေကို အခြေခံတဲ့ Conditional logic** — Code က caching ဒါမှမဟုတ် optimization အတွက် referential equality checks တွေ သုံးနေတဲ့အခါ

## Debugging Workflow

ပြဿနာတွေ ကြုံရတဲ့အခါ ဒီအဆင့်တွေ လိုက်နာပါ:

### Compiler Build Errors

သင့် build ကို မမျှော်လင့်ဘဲ ချိုးဖျက်လိုက်တဲ့ compiler error တစ်ခု ကြုံရရင် — ဒါက compiler ထဲက bug တစ်ခု ဖြစ်နိုင်ပါတယ်။ ဒါကို [react/react](https://github.com/react/react/issues) repository မှာ အောက်ပါတွေနဲ့တကွ တင်ပြပါ:

- Error message
- Error ဖြစ်စေတဲ့ code
- သင့်ရဲ့ React နဲ့ compiler versions

### Runtime Issues

Runtime အပြုအမူ ပြဿနာတွေအတွက်:

#### 1. Compilation ကို ခဏတာ ပိတ်ထားခြင်း

ပြဿနာက compiler နဲ့ ဆက်စပ်လား သီးခြားခွဲထုတ်ဖို့ `"use no memo"` ကို သုံးပါ:

```js
function ProblematicComponent() {
  "use no memo"; // Skip compilation for this component
  // ... rest of component
}
```

ပြဿနာ ပျောက်သွားရင် — Rules of React violation တစ်ခုနဲ့ ဆက်စပ်နေဖွယ် ရှိပါတယ်။

ပြဿနာရှိတဲ့ component ကနေ manual memoization (useMemo, useCallback, memo) တွေကို ဖယ်ပြီး — memoization ဘာမှ မရှိဘဲ သင့် app မှန်ကန်စွာ အလုပ်လုပ်လား စစ်ဆေးကြည့်လည်း ရပါတယ်။ Memoization အားလုံး ဖယ်လိုက်တာတောင် bug ဆက်ဖြစ်နေရင် — ပြင်ရမယ့် Rules of React violation တစ်ခု ရှိနေတာပါ။

#### 2. ပြဿနာတွေကို အဆင့်ဆင့် ပြင်ဆင်ခြင်း

1. အရင်းခံ အကြောင်းရင်းကို ခွဲခြားသိရှိပါ (မကြာခဏ — correctness အတွက် memoization)
2. ပြင်ဆင်မှု တစ်ခုချင်းစီပြီးတိုင်း စမ်းသပ်ပါ
3. ပြီးတာနဲ့ `"use no memo"` ကို ဖယ်ရှားပါ
4. Component က React DevTools ထဲမှာ ✨ badge ပြလားဆိုတာ စစ်ဆေးပါ

## Compiler Bugs တွေကို တင်ပြခြင်း

သင်က compiler bug တစ်ခု ရှာတွေ့ခဲ့တယ်လို့ ယုံကြည်ရင်:

1. **ဒါက Rules of React violation မဟုတ်ဘူးဆိုတာ စစ်ဆေးပါ** — ESLint နဲ့ စစ်ဆေးပါ
2. **Minimal reproduction တစ်ခု ဖန်တီးပါ** — ပြဿနာကို သေးငယ်တဲ့ ဥပမာတစ်ခုထဲမှာ သီးခြားခွဲထုတ်ပါ
3. **Compiler မပါဘဲ စမ်းသပ်ပါ** — ပြဿနာက compilation နဲ့မှပဲ ဖြစ်တာကို အတည်ပြုပါ
4. [**Issue တစ်ခု တင်ပြပါ**](https://github.com/react/react/issues/new?template=compiler_bug_report.yml):
   - React နဲ့ compiler versions
   - Minimal reproduction code
   - မျှော်လင့်ထားတဲ့ အပြုအမူနဲ့ လက်တွေ့ အပြုအမူ
   - Error messages တွေ ရှိရင်

## နောက်အဆင့်များ

- ပြဿနာတွေ မဖြစ်အောင် [Rules of React](https://react.dev/reference/rules) တွေကို ပြန်သုံးသပ်ပါ
- တဖြည်းဖြည်း ဖြန့်ချီတဲ့ နည်းလမ်းတွေအတွက် [incremental adoption guide](/docs/react/react-compiler-incremental-adoption) ကို စစ်ဆေးပါ
