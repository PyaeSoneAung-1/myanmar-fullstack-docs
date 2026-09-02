---
title: "Postman Sandbox API ကိုးကားချက် (Postman Sandbox API reference)"
description: "Postman Sandbox ထဲက pm object ရဲ့ API ကိုးကားချက် — cookies, requests/responses, collections, variables, mocks, datasets, persistent state, visualizer, Vault, test assertions နဲ့ packages"
order: 71
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/"
status: translated
updated: 2026-09-02
---

Postman က `pm` object နဲ့ JavaScript APIs တွေကို ပံ့ပိုးပေးပြီး — [Postman Sandbox](https://github.com/postmanlabs/postman-sandbox) ထဲမှာ run တဲ့ ကိုယ့် test scripts တွေမှာ request နဲ့ response data တွေကို test လုပ်ဖို့ နဲ့ access လုပ်ဖို့ နိုင်စေပါတယ်။ Request နဲ့ response အသေးစိတ်တွေကို access လုပ်ဖို့, assertions တွေ ရေးဖို့ နဲ့ variables တွေကို access လုပ် သုံးဖို့ `pm` object ကို သုံးနိုင်ပါတယ်။ Postman Sandbox ထဲမှာ HTTP requests တွေ ပို့ဖို့ နဲ့ တခြား meta information တွေအတွက်လည်း `pm` object ကို သုံးနိုင်ပါတယ်။

## Scripts တွေနဲ့ cookies တွေကို access လုပ်ခြင်း

Cookies တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ scripts တွေထဲမှာ `pm.cookies` methods တွေကို သုံးပါ။ ပိုလေ့လာဖို့ — [Postman scripts တွေထဲမှာ cookies တွေကို access လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-cookies/) ကို ကြည့်ပါ။

## Requests နဲ့ responses တွေနဲ့အတူ scripts တွေ သုံးခြင်း

Scripts တွေထဲမှာ `pm.request` နဲ့ `pm.response` objects တွေနဲ့ requests နဲ့ responses တွေကို ကိုးကားပါ။ Streaming protocols တွေက `pm.message` object တစ်ခုကိုလည်း ပြန်ပေးပါတယ်။ `pm.info` object ထဲမှာ request နဲ့ script နဲ့ ဆက်စပ်တဲ့ meta info တွေ ပါဝင်ပါတယ်။ Postman ထဲမှာ requests တွေ ပို့ဖို့ scripts တွေထဲမှာ `pm.sendRequest` method ကို သုံးပါ။ ပိုလေ့လာဖို့ — [Postman requests တွေကို scripts တွေထဲမှာ ကိုးကားခြင်း](/docs/postman/sandbox-pm-request), [Postman ထဲမှာ requests တွေ ပို့ဖို့ scripts တွေ သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-send-request/), [Request metadata တွေကို scripts တွေထဲမှာ ကိုးကားခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-info/) နဲ့ [Message data တွေကို scripts တွေထဲမှာ ကိုးကားခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-message/) တို့ကို ကြည့်ပါ။

## Collections တွေနဲ့အတူ scripts တွေ သုံးခြင်း

`pm.execution` object က [collection run](/docs/postman/intro-to-collection-runs) တစ်ခုအတွင်းမှာ requests တွေ ပို့တာ ဒါမှမဟုတ် ဘယ် request က run နေလဲ, collection တစ်ခုထဲမှာ ၎င်းရဲ့ နေရာ နဲ့ run နဲ့ ဆက်စပ်တဲ့ metadata တွေလိုမျိုး — requests နဲ့ သူတို့ရဲ့ responses တွေအကြောင်း information နဲ့ context တွေကို ပေးပါတယ်။ ပိုလေ့လာဖို့ — [Collection runs တွေထဲမှာ scripts တွေ သုံးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-execution/) ကို ကြည့်ပါ။

## Script variables တွေ

ကိုယ့် scripts တွေထဲမှာ [variable types](/docs/postman/variables) နဲ့ scopes အမျိုးမျိုးကို access လုပ်ပြီး ကိုင်တွယ်ပါ။ ပိုလေ့လာဖို့ — [Postman scripts တွေထဲမှာ variables တွေကို ကိုးကားခြင်း](/docs/postman/sandbox-pm-variables) ကို ကြည့်ပါ။

## Mock responses တွေ define လုပ်ဖို့ scripts တွေ သုံးခြင်း

`pm.mock` object က requests တွေကို ကိုက်ညီစေဖို့ နဲ့ responses တွေ ပို့ဖို့ structured functions တွေ ပေးပါတယ်။ ကိုယ့် mock implementation file ထဲမှာ responses တွေကို hard-code လုပ်မယ့်အစား — ကိုယ့် save ထားတဲ့ Postman examples တွေကနေ responses တွေ ပေးဖို့ ၎င်းကို သုံးနိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Mocks တွေထဲမှာ requests နဲ့ examples တွေကို ကိုးကားခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-mock/) ကို ကြည့်ပါ။

## Datasets တွေနဲ့အတူ scripts တွေ သုံးခြင်း

`pm.datasets` function က scripts တွေထဲမှာ dataset data တွေကို access လုပ်ပြီး query လုပ်နိုင်စေပါတယ်။ ကိုယ့် script run တဲ့အခါ data တွေ ပြန်ယူဖို့ SQL queries တွေ ဒါမှမဟုတ် ကြိုသတ်မှတ်ထားတဲ့ views တွေကို run လုပ်ဖို့ ၎င်းကို သုံးနိုင်ပါတယ်။ ဒါက ကိုယ့် tests နဲ့ mock logic တွေက hard-coded data တွေမယ့်အစား — dynamic, data-driven values တွေကို သုံးနိုင်စေပါတယ်။ ပိုလေ့လာဖို့ — [Scripts တွေထဲမှာ datasets တွေကို စီမံ သုံးစွဲခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-datasets/) ကို ကြည့်ပါ။

## Persistent state ကို စီမံဖို့ scripts တွေ သုံးခြင်း

`pm.state` object က script executions တွေကြားမှာ data တွေ စီမံဖို့ persistent store တစ်ခု ပေးပါတယ်။ Data တွေကို ဖတ်ဖို့, ရေးဖို့ နဲ့ update လုပ်ဖို့ ၎င်းကို သုံးနိုင်ပါတယ်။ ဒါက ကိုယ့် mock implementation file ထဲမှာ static responses တွေကို အားကိုးမယ့်အစား — stateful behavior တွေ ဖြစ်စေနိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Mocks တွေထဲမှာ requests တွေကြားမှာ state ကို ထိန်းသိမ်းခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-state/) ကို ကြည့်ပါ။

## Data တွေကို visualize လုပ်ဖို့ scripts တွေ သုံးခြင်း

`pm.visualizer` object က [Postman Visualizer](https://learning.postman.com/docs/use/send-requests/response-data/visualizer/) နဲ့ ကိုယ့် API ရဲ့ request responses တွေကို မြင်သာစွာ ကိုယ်စားပြုနိုင်စေပါတယ်။ ပိုလေ့လာဖို့ — [Postman visualizations တွေကို script လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-visualizer/) ကို ကြည့်ပါ။

## Scripts တွေနဲ့ Postman Vault ကို စီမံခြင်း

[vault secrets](/docs/use/postman-vault/postman-vault-secrets/) တွေကို scripts တွေထဲမှာ `pm.vault` methods တွေနဲ့ access လုပ်ပြီး ကိုင်တွယ်ပါ။ ပိုလေ့လာဖို့ — [Postman scripts တွေထဲမှာ vault secrets တွေကို ကိုးကားခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-vault/) ကို ကြည့်ပါ။

## Scripts တွေနဲ့ test assertions တွေ ရေးသားခြင်း

Test specifications နဲ့ assertions တွေ ထည့်ဖို့ scripts တွေထဲမှာ `pm.test` နဲ့ `pm.expect` methods တွေကို သုံးပါ။ ပိုလေ့လာဖို့ — [Scripts တွေထဲမှာ tests နဲ့ assertions တွေ ရေးခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-test-expect/) ကို ကြည့်ပါ။

## Scripts တွေထဲ packages တွေ import လုပ်ခြင်း

HTTP, gRPC နဲ့ GraphQL requests တွေထဲက scripts တွေမှာ — ကိုယ့် team ရဲ့ [Package Library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/) ဒါမှမဟုတ် [external package registries](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) တွေကနေ packages တွေ import လုပ်ဖို့ `pm.require` method က နိုင်စေပါတယ်။ ပိုလေ့လာဖို့ — [Scripts တွေထဲ packages တွေ import လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/) ကို ကြည့်ပါ။

မေးခွန်းတွေ မေးပါ, အသိပညာတွေ မျှဝေပါ နဲ့ developers တွေနဲ့ ချိတ်ဆက်ပါ — Postman ရဲ့ [Discord community](https://discord.gg/postman) မှာ။
