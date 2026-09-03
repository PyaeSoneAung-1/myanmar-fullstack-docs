---
title: "Postman မှာ external registries တွေကနေ packages တွေကို import လုပ်ခြင်း (Import packages from external registries in Postman)"
description: "npm နဲ့ JSR registries တွေကနေ public packages တွေကို၊ Admin က access သတ်မှတ်ပေးထားရင် private npm packages တွေကိုပါ Postman scripts တွေထဲ import လုပ်ခြင်း — package version သတ်မှတ်ခြင်း၊ အသစ်ဆုံး version သုံးခြင်း၊ script ထဲက external packages တွေကို ကြည့်ခြင်း၊ sandbox ထဲမှာ external packages တွေ run ခြင်းရဲ့ ကန့်သတ်ချက်များ"
order: 124
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/"
status: translated
updated: 2026-09-03
---

External package registries တွေကနေ public packages တွေကို ကိုယ့် scripts တွေထဲကို import လုပ်နိုင်ပါတယ်။ Postman က [npm](https://www.npmjs.com/) နဲ့ [JSR](https://jsr.io/) registries တွေကနေ public packages တွေကို import လုပ်တာကို ပံ့ပိုးပါတယ်။ Postman Solo, Team ဒါမှမဟုတ် Enterprise plan တစ်ခုခုမှာ ရှိနေရင် — Admin တစ်ယောက်က access သတ်မှတ်ပေးထားတဲ့ npm ကနေ private packages တွေကိုလည်း import လုပ်နိုင်ပါတယ်။ External packages တွေကို ကိုယ့် internal, partner နဲ့ public workspaces တွေမှာ import လုပ်နိုင်ပါတယ်။ External packages တွေကို HTTP, gRPC နဲ့ GraphQL requests တွေမှာ ပံ့ပိုးထားပြီး — [mocks](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) တွေမှာလည်း ပံ့ပိုးပါတယ်။

Scripts တွေထဲမှာ external packages တွေကို import လုပ်ထားတဲ့ collections နဲ့ requests တွေကို run ဖို့ — [Collection Runner](/docs/postman/intro-to-collection-runs), [monitors](/docs/postman/setting-up-monitor), [Postman Flows](https://learning.postman.com/flows/build-flows/configure/requests-and-variables/) နဲ့ Postman CLI ([collection runs](https://learning.postman.com/docs/postman-cli/postman-cli-collections/) နဲ့ [monitors](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/)) တွေကို သုံးနိုင်ပါတယ်။ External packages တွေကိုတော့ [Newman](https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/) မှာ ပံ့ပိုးမထားပါဘူး။

## Public package တစ်ခုကို import လုပ်ခြင်း (Import a public package)

npm နဲ့ JSR ထဲက public external packages တွေကို ရှာပြီး — ကိုယ့် HTTP, gRPC နဲ့ GraphQL requests တွေထဲကို တိုက်ရိုက် import လုပ်နိုင်ပါတယ်။

Postman Enterprise plan တစ်ခုမှာ ရှိနေရင် — Admin တစ်ယောက်က ကိုယ့် team ရဲ့ scripts တွေမှာ သုံးခွင့်ရှိတဲ့ [external packages တွေကို စီမံနိုင်ပါတယ်](https://learning.postman.com/docs/administration/managing-your-team/manage-team-workspaces/)။

Postman Enterprise plan တစ်ခုမှာ ရှိနေရင် — Admin က scripts တွေမှာ ခွင့်ပြုထားတဲ့ external packages တွေကို ကြည့်နိုင်ပါတယ်။ Postman header ထဲက **Organization or team > Organization or team settings** ကို ရွေးပြီး — sidebar ထဲက **Team resources** ကို ရွေးကာ — **Use external packages** ကို ရွေးပါ။

Public external package တစ်ခုကို ရှာပြီး import လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။
2. **Scripts** tab ကို နှိပ်ပါ။
3. Code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ ![Package icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-entity-package-stroke.svg#icon) **Packages** ကို နှိပ်ပါ။
4. npm ဒါမှမဟုတ် JSR ထဲက public package တစ်ခုကို ရှာပါ။ ကိုယ့် ရှာဖွေမှု ရလဒ်တွေကို package registry အလိုက် စစ်ထုတ်ဖို့ — **npm**, **JSR** ဒါမှမဟုတ် နှစ်ခုလုံးကို ရွေးပါ။ ရှာဖွေမှုက package registry တစ်ခုစီအတွက် ထိပ်ဆုံး ရလဒ် ငါးခု ပြန်ပေးပါတယ်။ Postman မှာ ပံ့ပိုးထားတဲ့ public packages တွေ အကြောင်း လေ့လာပါ။
5. Code editor ထဲကို import လုပ်ဖို့ package တစ်ခုကို ရွေးပါ။

Postman က import မလုပ်နိုင်ခဲ့တဲ့ packages တွေ အပါအဝင် — ကိုယ့် script ထဲက external packages တွေကို ကြည့်နိုင်ပါတယ်။

![Find and use public packages in external registries](https://assets.postman.com/postman-docs/v11/import-external-packages-v11-46.jpg)

ရှာဖွေမှုကနေ public external package တစ်ခုကို ရွေးလိုက်တဲ့အခါ — code editor ထဲမှာ JavaScript variable တစ်ခုကို အလိုအလျောက် ကြေညာပေးပါတယ်။ Package ထဲက functions နဲ့ objects တွေကို ခေါ်ဖို့ အဲဒီ variable ကို သုံးပါ။ Default အနေနဲ့ — variable identifier က external package ရဲ့ နာမည်ကို အခြေခံပါတယ်။ Variable ရဲ့ တန်ဖိုးက `pm.require` method ဖြစ်ပြီး — package registry, နာမည်နဲ့ နောက်ဆုံးထွက် version နံပါတ်ကို `registry-name:package-name@version-number` ဖော်မက်နဲ့ argument အဖြစ် ထည့်ပါတယ်။

Request run လုပ်တဲ့အခါ script က သတ်မှတ်ထားတဲ့ package version ကိုပဲ အမြဲတမ်း သုံးပါလိမ့်မယ်။ ကိုယ့် scripts တွေအားလုံးမှာ package ရဲ့ နောက်ဆုံးထွက် version ကို သုံးချင်ရင် — argument ကနေ version နံပါတ် (`@version-number`) ကို ဖြုတ်ပစ်နိုင်ပါတယ်။

Argument ထဲမှာ တိကျတဲ့ version နံပါတ်ကိုပဲ သုံးရပါမယ်။ Version ranges ဒါမှမဟုတ် tags လိုမျိုး — version တစ်ခုကို သတ်မှတ်တဲ့ တခြား နည်းလမ်းတွေကို Postman က ပံ့ပိုးမထားပါဘူး။

```js
// package imported from npm
const npmVariableName = pm.require('npm:package-name@version-number');

npmVariableName.functionName()

// package imported from jsr
const jsrVariableName = pm.require('jsr:package-name@version-number');

jsrVariableName.functionName()
```

## Private package တစ်ခုကို import လုပ်ခြင်း (Import a private package)

Private npm packages တွေကို [Postman Solo, Team နဲ့ Enterprise plans](https://www.postman.com/pricing/) တွေမှာ ပံ့ပိုးပါတယ်။

Admin တစ်ယောက်က ကိုယ့် team ရဲ့ scripts တွေကနေ private package ကို ဝင်ရောက်ခွင့် သတ်မှတ်ပေးထားရင် — npm ကနေ private external packages တွေကို import လုပ်နိုင်ပါတယ်။ Private npm packages တွေကို ကိုယ့် HTTP, gRPC နဲ့ GraphQL requests တွေထဲကို တိုက်ရိုက် import လုပ်နိုင်ပါတယ်။

Postman Enterprise plan တစ်ခုမှာ ရှိနေရင် — Admin တစ်ယောက်က ကိုယ့် team ရဲ့ scripts တွေမှာ သုံးခွင့်ရှိတဲ့ [external packages တွေကို စီမံနိုင်ပါတယ်](https://learning.postman.com/docs/administration/managing-your-team/manage-team-workspaces/)။

Postman Team ဒါမှမဟုတ် Enterprise plan တစ်ခုမှာ ရှိနေရင် — Admin က scripts တွေမှာ ခွင့်ပြုထားတဲ့ external packages တွေကို ကြည့်နိုင်ပါတယ်။ Postman header ထဲက **Organization or team > Organization or team settings** ကို ရွေးပြီး — sidebar ထဲက **Team resources** ကို ရွေးကာ — **Use external packages** ကို ရွေးပါ။

Private external package တစ်ခုကို import လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။
2. **Scripts** tab ကို ရွေးပါ။
3. Code editor ထဲမှာ — package ထဲက functions နဲ့ objects တွေကို ခေါ်ဖို့ သုံးမယ့် JavaScript variable တစ်ခုကို ကြေညာပါ။ Variable ရဲ့ တန်ဖိုးက `npm:@scope/package-name@version-number` ဖော်မက်နဲ့ — "npm", scope, package နာမည်နဲ့ နောက်ဆုံးထွက် version နံပါတ်ကို argument အဖြစ် ထည့်ထားတဲ့ `pm.require` method ကို သုံးရပါမယ်။

Version နံပါတ် တစ်ခုကို သတ်မှတ်လိုက်ရင် — request run လုပ်တဲ့အခါ script က သတ်မှတ်ထားတဲ့ package version ကိုပဲ အမြဲတမ်း သုံးပါလိမ့်မယ်။ ကိုယ့် scripts တွေအားလုံးမှာ package ရဲ့ နောက်ဆုံးထွက် version ကို သုံးချင်ရင် — argument ကနေ version နံပါတ် (`@version-number`) ကို ဖြုတ်ပစ်နိုင်ပါတယ်။

```js
// package imported from npm
const npmVariableName = pm.require('npm:@scope/package-name@version-number');

npmVariableName.functionName()
```

Postman က import မလုပ်နိုင်ခဲ့တဲ့ packages တွေ အပါအဝင် — ကိုယ့် script ထဲက external packages တွေကို ကြည့်နိုင်ပါတယ်။

## Package ရဲ့ နောက်ဆုံးထွက် version ကို သုံးခြင်း (Use the latest package version)

External package တစ်ခုကို import လုပ်တဲ့အခါ — ကိုယ့် scripts တွေအားလုံးမှာ package ရဲ့ နောက်ဆုံးထွက် version ကို သုံးအောင် argument ကို configure လုပ်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — `pm.require` method ရဲ့ argument ကနေ version နံပါတ် (`@version-number`) ကို ဖြုတ်ပစ်ပါ။ Default အနေနဲ့ — scripts တွေက ကိုယ် request တစ်ခုကို ပထမဆုံး ဖွင့်တဲ့အခါ ဒါမှမဟုတ် run တဲ့အခါမှာ ရနိုင်တဲ့ နောက်ဆုံးထွက် version နံပါတ်ကို သုံးပါတယ်။

Version နံပါတ်မပါဘဲ package ကို import လုပ်တဲ့ ကိုယ့် Postman app ထဲက script တစ်ခုစီကတော့ — version တစ်ခုတည်းကိုပဲ သုံးပါလိမ့်မယ်။ Package version က ကိုယ့် Postman app နဲ့ တိကျစွာ ဆက်စပ်နေတာကြောင့် — ကိုယ့် collaborators တွေအတွက် version က ကွဲပြားနိုင်ပါတယ်။

ကိုယ့် Postman app ထဲက package version နံပါတ်ကို update လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Footer ပေါ်က **Library** ကို ရွေးပြီး — ![Package icon](https://assets.postman.com/postman-docs/aether-icons/entity-package-stroke.svg#icon) **Packages** ကို ရွေးပါ။
2. Import လုပ်ထားတဲ့ package ပေါ်မှာ hover လုပ်ပြီး — ![Syncing icon](https://assets.postman.com/postman-docs/aether-icons/state-syncing-stroke.svg#icon) **Update to latest version** ကို ရွေးပါ။ Version နံပါတ် မသတ်မှတ်ဘဲ package ကို import လုပ်ထားတဲ့ ကိုယ့် script တစ်ခုစီထဲမှာ — version နံပါတ်ကို update လုပ်ပေးပါလိမ့်မယ်။

## ကိုယ့် script ထဲက external packages တွေကို ကြည့်ခြင်း (View external packages in your script)

ကိုယ့် request ရဲ့ script ထဲက external packages တွေကို ကြည့်ဖို့ — Footer ပေါ်က **Library** ကို ရွေးပြီး — ![Package icon](https://assets.postman.com/postman-docs/aether-icons/entity-package-stroke.svg#icon) **Packages** ကို ရွေးပါ။ Package တစ်ခု အကြောင်း ပိုသိချင်ရင် — package ပေါ်မှာ hover လုပ်ပြီး ![Open in Postman icon](https://assets.postman.com/postman-docs/aether-icons/action-openInPostman-stroke.svg#icon) **View in npm** ဒါမှမဟုတ် ![Open in Postman icon](https://assets.postman.com/postman-docs/aether-icons/action-openInPostman-stroke.svg#icon) **View in JSR** ကို ရွေးပါ။

ကိုယ့် script ထဲက external packages တွေနဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို troubleshoot လုပ်ဖို့ အောက်ပါတို့ကို သုံးပါ:

* အပြာရောင် checkmark ပါတဲ့ packages တွေက ကိုယ့် script ထဲမှာ အောင်မြင်စွာ import လုပ်ထားတာပါ။
* အနီရောင် exclamation point ပါတဲ့ packages တွေက ကိုယ့် script ထဲမှာ import လုပ်လို့ မရခဲ့ပါဘူး။ ဥပမာ — version က မှန်ကန်မှု မရှိတာ ဒါမှမဟုတ် package ကို ကိုယ့် team မှာ ခွင့်မပြုထားတာ ဖြစ်နိုင်ပါတယ်။ ပြဿနာ အကြောင်း tooltip တစ်ခု ကြည့်ဖို့ exclamation point ပေါ်မှာ hover လုပ်ပါ။

## ပံ့ပိုးထားတဲ့ external packages များ (Supported external packages)

Postman က scripts တွေကို default အနေနဲ့ လုံခြုံတဲ့ sandbox environment တစ်ခုထဲမှာ run ပါတယ်။ Sandbox environment ထဲမှာ run တဲ့ external code တွေက — အခွင့်ထူးတွေ ဒါမှမဟုတ် access တွေ ထပ်မရအောင် တင်းကျပ်တဲ့ စီမံချက်တွေ ရှိပါတယ်။ ဒါကြောင့် — package ရဲ့ dependencies ပေါ် မူတည်ပြီး sandbox environment ထဲမှာ external packages တွေရဲ့ ပါဝင်မှုတွေကို run တဲ့အခါ ကန့်သတ်ချက်တချို့ ရှိနိုင်ပါတယ်။

External packages တွေကို Postman ထဲ import လုပ်တဲ့အခါ အောက်ပါတို့ကို ထည့်စဉ်းစားပါ:

* Postman ရဲ့ sandbox environment က code တွေကို — code က browser ပေါ်မှာ ဒါမှမဟုတ် Node.js ပေါ်မှာ run ဖြစ်ဖြစ် — တစ်ပြေးညီ (uniformly) run ပါတယ်။ Node.js ရဲ့ built-in modules တွေကို သုံးတဲ့ external packages တွေက Postman မှာ မျှော်လင့်ထားသလို အလုပ်မလုပ်နိုင်ပါဘူး — အကြောင်းကတော့ အဲဒီ modules တွေက browser ထဲမှာလည်း မရှိလို့ ဖြစ်ပါတယ်။
* Postman က JavaScript ရဲ့ [standard built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) အားလုံးကို ပံ့ပိုးမထားပါဘူး။ Postman က ပံ့ပိုးတဲ့ [JavaScript objects တွေ အကြောင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/) လေ့လာပါ။
* 50 MB ထက် ကျော်လွန်တဲ့ packages နဲ့ သူတို့ရဲ့ dependencies တွေကို ပံ့ပိုးမထားပါဘူး။
* [async function တစ်ခုရဲ့ အပြင်မှာ `await` keyword ကို သုံးတဲ့](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) packages တွေကို ပံ့ပိုးမထားပါဘူး။
* Named ရော default exports ရော နှစ်မျိုးလုံး သုံးတဲ့ packages တွေက default exports တွေကို ဝင်ရောက်ဖို့ တိကျတဲ့ syntax တစ်ခုကို သုံးရပါမယ်:

  ```js
  // access default exports
  const fooDefaultExport = pm.require("npm:foo").default

  // access named exports
  const { fooNamedExport } = pm.require("npm:foo")
  ```
