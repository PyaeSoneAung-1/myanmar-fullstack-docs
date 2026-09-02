---
title: "API specification တစ်ခုကို validate လုပ်ခြင်း (Validate an API specification)"
description: "Specification ကို validate လုပ်ခြင်း — syntax errors တွေနဲ့ API governance rule violations တွေကို ကြည့်ရှုခြင်း, Issues tab ထဲက Syntax နဲ့ Governance sections, validation pane"
order: 57
source: "https://learning.postman.com/docs/design-apis/specifications/validate-a-specification/"
status: translated
updated: 2026-09-02
---

[ကိုယ့် specification ကို တည်းဖြတ်](/docs/postman/edit-a-specification)နေတုန်း — data types မှားနေခြင်း ဒါမှမဟုတ် nesting မှားနေခြင်း စတဲ့ [syntax errors](#specification-ထဲက-syntax-errors-တွေကို-ကြည့်ရှုခြင်း) တွေကို Postman က ဖော်ထုတ်ပြီး — ပြုပြင်နိုင်ဖို့ error တွေအကြောင်း အသေးစိတ်တွေကို ပြသပေးပါတယ်။ ကိုယ့် team အတွက် configure လုပ်ထားတဲ့ rules တွေအပေါ် အခြေခံပြီး — OpenAPI specifications တွေထဲက [API governance ပြဿနာတွေကိုလည်း](#specification-ထဲက-rule-violations-တွေကို-ကြည့်ရှုခြင်း) Postman က ဖော်ထုတ်ပေးပါတယ်။

Specification editor ရဲ့ အောက်မှာ — default အနေနဲ့ ရွေးထားတဲ့ **Issues** tab ထဲမှာ validation pane ကို Postman က ပြသပေးပါတယ်။ Validation pane မှာ **Syntax** နဲ့ **Governance** ဆိုတဲ့ section နှစ်ခု ပါပါတယ်။ ကိုယ့် specification ထဲက ပြဿနာတွေ ကြည့်ဖို့ section တစ်ခုခုကို ချဲ့ပါ။

Validation pane က — ကိုယ် တည်းဖြတ်နေတဲ့ specification file ထဲက syntax errors နဲ့ governance rule violations တွေကိုပဲ ပြသပေးပါတယ်။

Postman footer ထဲမှာလည်း — ကိုယ့် specification မှာ syntax errors ဒါမှမဟုတ် governance rule violations တွေ ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်။ ပြဿနာတွေ ရှိရင် — footer က severity အလိုက် ပြဿနာ အရေအတွက်ကို ပြသပေးပါတယ်။ Validation pane ကို ဖွင့်ဖို့ error icon ![Error icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-error-stroke.svg#icon) ဒါမှမဟုတ် warning icon ![Warning icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-warning-stroke.svg#icon) ကို နှိပ်ပါ။

## Specification ထဲက syntax errors တွေကို ကြည့်ရှုခြင်း

API specification ကို တည်းဖြတ်နေတုန်း — syntax errors တွေကို Postman က အလိုအလျောက် ဖော်ထုတ်ပေးပါတယ်။ Errors တွေမှာ — fields တွေ ပျောက်နေခြင်း, field names တွေ ပုံစံမမှန်ခြင်း, data types တွေ မှားနေခြင်း, nesting မှားနေခြင်း ဒါမှမဟုတ် တခြား ပြဿနာတွေ ပါဝင်နိုင်ပါတယ်။ Postman က ကိုယ့် specification ရဲ့ element တွေကို စစ်ဆေးနိုင်ဖို့ — valid JSON ဒါမှမဟုတ် YAML ကို သုံးရပါမယ်။

Syntax errors တွေ ကြည့်ဖို့ — validation pane ထဲက **Syntax** ကို နှိပ်ပါ။ Syntax error တစ်ခုချင်းစီမှာ — Postman က အဲဒီ error ကို specification ထဲမှာ အကြိမ်ရေ ဘယ်လောက် တွေ့ခဲ့လဲ, error က ဘယ်မှာ ဖြစ်တယ်, error အကြောင်း အသေးစိတ်တွေ နဲ့ severity တို့ကို ပြသပေးပါတယ်။ Specification ထဲက အဲဒီနေရာဆီ သွားဖို့ syntax error တစ်ခုကို နှိပ်ပါ။

ကိုယ့် specification ကို [files နဲ့ folders အများအပြားအဖြစ် စုစည်းထားရင်](/docs/postman/add-files-to-a-specification) — syntax error တစ်ခုချင်းစီရဲ့ instance တိုင်းမှာ သက်ဆိုင်ရာ file ဆီက path လည်း ပါပါတယ်။ အဲဒီ file ဆီ သွားဖို့ syntax error တစ်ခုကို နှိပ်ပါ။

## Specification ထဲက rule violations တွေကို ကြည့်ရှုခြင်း

API Governance rule validation က [Postman Enterprise plans](https://www.postman.com/pricing/) တွေမှာ ရပါတယ်။

ကိုယ့် OpenAPI specification ကို တည်းဖြတ်နေတုန်း — ကိုယ့် team အတွက် configure လုပ်ထားတဲ့ [Postman API Governance](https://learning.postman.com/docs/api-governance/api-governance-overview/) rules တွေနဲ့ ကိုက်ညီမှု ရှိမရှိ Postman က အလိုအလျောက် စစ်ဆေးပေးပါတယ်။

Governance rule violations တွေ ကြည့်ဖို့ — validation pane ထဲက **Governance** ကို နှိပ်ပါ။ Rule violation တစ်ခုချင်းစီမှာ — Postman က အဲဒီ rule violation ကို specification ထဲမှာ အကြိမ်ရေ ဘယ်လောက် တွေ့ခဲ့လဲ, rule violation က ဘယ်မှာ ဖြစ်တယ်, rule violation အကြောင်း အသေးစိတ်တွေ နဲ့ severity တို့ကို ပြသပေးပါတယ်။ Specification ထဲက အဲဒီနေရာဆီ သွားဖို့ governance rule violation တစ်ခုကို နှိပ်ပါ။

ကိုယ့် specification ကို [files နဲ့ folders အများအပြားအဖြစ် စုစည်းထားရင်](/docs/postman/add-files-to-a-specification) — rule violation တစ်ခုချင်းစီရဲ့ instance တိုင်းမှာ သက်ဆိုင်ရာ file ဆီက path လည်း ပါပါတယ်။ အဲဒီ file ဆီ သွားဖို့ governance rule violation တစ်ခုကို နှိပ်ပါ။

API Governance Managers တွေက — ကိုယ့် specifications တွေထဲက API Governance rule compliance အကြောင်း [အသေးစိတ် metrics တွေကို ကြည့်ရှု](https://learning.postman.com/docs/reports/api-governance-specifications-reports/)နိုင်ပါတယ်။
