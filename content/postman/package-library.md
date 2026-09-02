---
title: "Postman မှာ internal scripts တွေကို Package Library ထဲ ထည့်ခြင်း (Add internal scripts to the Package Library in Postman)"
description: "Postman Package Library ထဲမှာ scripts နဲ့ tests တွေကို ဗဟိုတစ်နေရာတည်းမှာ ထိန်းသိမ်းပြီး team နဲ့ မျှဝေခြင်း — package အသစ်ဖန်တီးခြင်း, code ရေးခြင်း, import လုပ်ခြင်း, edit/delete လုပ်ခြင်း"
order: 92
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/"
status: translated
updated: 2026-09-02
---

Postman Package Library နဲ့ဆိုရင် scripts တွေနဲ့ tests တွေကို ဗဟိုတစ်နေရာတည်းမှာ ထိန်းသိမ်းပြီး — သင့် team နဲ့ မျှဝေနိုင်ပါတယ်။ အသုံးများတဲ့ scripts နဲ့ tests တွေကို သင့် team ရဲ့ package library ထဲက packages တွေထဲ ထည့်ပြီး — သင့် internal workspaces တွေမှာ ပြန်သုံးနိုင်ပါတယ်။ Package library က HTTP, gRPC နဲ့ GraphQL requests တွေကို ပံ့ပိုးပါတယ်။ [Mocks](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) တွေထဲကို packages တွေ import လုပ်တာကိုလည်း package library က ပံ့ပိုးပါတယ်။

[External package registry တစ်ခုကနေ packages တွေ import လုပ်ခြင်း](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) အကြောင်းကိုလည်း လေ့လာနိုင်ပါတယ်။

## Package library အကြောင်း (About the package library)

အသုံးများတဲ့ scripts နဲ့ tests တွေကို သင့် Postman team ထဲမှာ packages တွေအနေနဲ့ သိမ်းဆည်းဖို့ package library ကို သုံးပါ။ သင့် teammates တွေက package library ကနေ packages တွေကို access လုပ်ပြီး import လုပ်နိုင်လို့ — scripts နဲ့ tests တွေကို Postman ထဲမှာ တိုက်ရိုက် မျှဝေနိုင်ပါတယ်။ Package library က JavaScript code တွေကို ပံ့ပိုးပါတယ်။

သင့် team က package library ထဲမှာ သိမ်းဆည်းနိုင်တဲ့ packages အရေအတွက်က သင့် [Postman plan](https://www.postman.com/pricing/) ပေါ်မှာ မူတည်ပါတယ်။ Postman ထဲက [resource usage](https://learning.postman.com/docs/billing/resource-usage/#packages) အကြောင်း ပိုလေ့လာပါ။

Packages တွေကို သင့် team ရဲ့ HTTP, gRPC ဒါမှမဟုတ် GraphQL requests တွေထဲက **Scripts** tab ထဲမှာ import လုပ်ပါ။ Script တစ်ခုက request တစ်ခု၊ folder တစ်ခု ဒါမှမဟုတ် collection တစ်ခုနဲ့ ဆက်စပ်နိုင်လို့ — Postman က scripts တွေအတွက် တစ်သမတ်တည်း ဖြစ်တဲ့ [run order](/docs/postman/intro-to-scripts) တစ်ခုကို လိုက်နာပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုခုကို run လုပ်တဲ့အခါ packages တွေရဲ့ ပါဝင်မှုတွေက run ပါလိမ့်မယ်:

* Packages တွေကို import လုပ်ထားတဲ့ scripts တွေ ပါဝင်တဲ့ Requests တွေ

* HTTP collections တွေရဲ့ runs တွေအတွက် Collection Runner — [manual](/docs/postman/intro-to-collection-runs) ရော [scheduled](/docs/postman/scheduling-collection-runs) ရော

* [Monitors](/docs/postman/setting-up-monitor)

* [Postman Flows](https://learning.postman.com/flows/build-flows/configure/requests-and-variables/) တွေနဲ့

* Postman CLI ရဲ့ [collection runs](https://learning.postman.com/docs/postman-cli/postman-cli-collections/) နဲ့ [monitors](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/)

Packages တွေရဲ့ ပါဝင်မှုတွေက [Newman](https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/) ကနေတော့ run မှာ မဟုတ်ပါဘူး။

သင့် team ရဲ့ package library ကနေ packages တွေကို import လုပ်ထားတဲ့ collection တစ်ခုကို Postman CLI နဲ့ run ဖို့ — [Solo, Team ဒါမှမဟုတ် Enterprise plan](https://www.postman.com/pricing/) တစ်ခုခုမှာ ရှိနေရပါမယ်။

## Package တစ်ခု ထည့်ခြင်း (Add a package)

Package library ထဲမှာ package တစ်ခုကို အစအဆုံး ဖန်တီးနိုင်ပါတယ်။ ရှိပြီးသား code တွေကို package အသစ်တစ်ခု ဒါမှမဟုတ် ရှိပြီးသား package တစ်ခုထဲကိုလည်း ထည့်နိုင်ပါတယ်။ Package library ကို internal workspaces တွေကနေသာ ဖွင့်နိုင်ပါတယ်။ Package တစ်ခုကို သုံးဖို့ — package ထဲမှာ code ရေးပြီး မှ သင့် scripts တွေထဲကို package ကို import လုပ်ပါ။ (အောက်က section တွေမှာ အသေးစိတ် ဖော်ပြထားပါတယ်။)

သင်ဖန်တီးတဲ့ packages တွေရဲ့ ပိုင်ရှင်က သင်ပါ။ Package တစ်ခုရဲ့ ပိုင်ရှင်က team ကနေ ထွက်သွားတဲ့အခါ ဒါမှမဟုတ် team ကနေ ဖယ်ရှားခံရတဲ့အခါ — packages တွေက သင့် team ရဲ့ package library ထဲမှာ ကျန်နေပါတယ်။

### Package အသစ်တစ်ခု ထည့်ခြင်း (Add a new package)

Package အသစ်တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။

2. **Scripts** tab ကို နှိပ်ပါ။

3. Code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ **Packages** ကို နှိပ်ပြီး — **Open package library** ကို နှိပ်ပါ။

4. **New Package** ကို နှိပ်ပါ။

5. အောက်ပါတို့ကို ထည့်သွင်းပါ:

   * **Name** — Package ရဲ့ နာမည်ပါ။ ဒါကို package ကို သင့် scripts တွေထဲ ထည့်ပေးတဲ့ import statement ထဲမှာ သုံးပါတယ်။

     Package နာမည်တွေက lowercase alphanumeric characters တွေ ဖြစ်ရပြီး — lowercase alphabetical letter တစ်လုံးနဲ့ စတင်ကာ dashes နဲ့ underscores တွေသာ ပါဝင်နိုင်ပြီး space တွေ မပါဝင်ရပါဘူး။

     ရှိပြီးသား package တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် ဖျက်လိုက်ပြီးသား package တစ်ခုရဲ့ နာမည်ကို သုံးလို့ မရပါဘူး။ နောက်ပိုင်းမှာ package တစ်ခုရဲ့ နာမည်ကိုလည်း ပြောင်းလို့ မရပါဘူး။

   * **Summary** — Package ရဲ့ အကျဉ်းချုပ်ပါ — သင့် teammates တွေ ဘာလုပ်တယ်ဆိုတာ နားလည်နိုင်ဖို့ ဖြစ်ပါတယ်။

   * **Code** — Package ထဲမှာ code တွေ ထည့်ပါ။ Package တစ်ခုထဲမှာ code ဘယ်လို ရေးလဲ ဆိုတာကို အောက်က Write code in a package section မှာ လေ့လာပါ။

6. **Create** ကို နှိပ်ပါ။

### Package တစ်ခုထဲကို ရှိပြီးသား code တွေ ထည့်ခြင်း (Add existing code to a package)

Package တစ်ခုထဲကို ရှိပြီးသား code တွေ ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။

2. **Scripts** tab ကို နှိပ်ပါ။

3. Package တစ်ခုထဲကို ထည့်ချင်တဲ့ code တွေကို ရေးပါ။ Package တစ်ခုထဲမှာ code ဘယ်လို ရေးလဲ ဆိုတာကို အောက်က Write code in a package section မှာ လေ့လာပါ။

4. Code ကို မျဉ်းသားပြီး — မျဉ်းသားထားတဲ့ code ပေါ်မှာ right-click နှိပ်ပါ။

5. Package တစ်ခုထဲကို ရှိပြီးသား code တွေ ထည့်နိုင်တဲ့ နည်းလမ်းတွေကတော့:

   * ရှိပြီးသား package တစ်ခုထဲကို code ထည့်ဖို့ — **Save to Package Library > Existing Package** ကို ရွေးပါ။ နာမည်နဲ့ ရှိပြီးသား package တစ်ခုကို ရှာပြီး ရွေးကာ **Select** ကို နှိပ်ပါ။
   * Package အသစ်တစ်ခုထဲကို code ထည့်ဖို့ — **Save to Package Library > New Package** ကို ရွေးပါ။

6. Package ရဲ့ **Summary** နဲ့ **Code** တွေကို လိုအပ်သလို update လုပ်ပါ။

   ရှိပြီးသား package တစ်ခုရဲ့ နာမည် ဒါမှမဟုတ် ဖျက်လိုက်ပြီးသား package တစ်ခုရဲ့ နာမည်ကို သုံးလို့ မရပါဘူး။ နောက်ပိုင်းမှာ package တစ်ခုရဲ့ နာမည်ကိုလည်း ပြောင်းလို့ မရပါဘူး။

7. **Save** ကို နှိပ်ပါ။

## Package တစ်ခုထဲမှာ code ရေးခြင်း (Write code in a package)

JavaScript code တွေ, functions တွေနဲ့ objects တွေကို သင့် team ရဲ့ package library ထဲက packages တွေထဲမှာ ထည့်ပါ။ [Postman Sandbox API](/docs/postman/sandbox-overview) ရဲ့ လုပ်ဆောင်ချက်တွေကိုလည်း သုံးနိုင်ပါတယ် — ဒါမှ request နဲ့ response data တွေကို `pm` object နဲ့ access လုပ်ပြီး ပြောင်းလဲခြင်း၊ test assertions တွေ ရေးခြင်း စတာတွေ လုပ်နိုင်မှာ ဖြစ်ပါတယ်။ Packages တွေရဲ့ ပါဝင်မှုတွေက စာရင်းသွင်းထားတဲ့ အစဉ်အတိုင်း run ပါတယ်။ Package တစ်ခုထဲမှာ code ရေးပြီးရင် — package တစ်ခုကို import လုပ်နိုင်ပါတယ် (အောက်က section မှာ ကြည့်ပါ)။

Package library ထဲက packages တွေမှာ Postman tests တွေရေးတဲ့ ယခင် ပုံစံဟောင်း (`tests` object သုံးတဲ့) ကို သုံးလို့ မရပါဘူး။

သင့် functions တွေနဲ့ objects တွေကို `module.exports` object property နဲ့ export လုပ်ပါ — ဒါမှ သင့် scripts တွေကနေ ခေါ်လို့ ရမှာ ဖြစ်ပါတယ်။ Export လုပ်တဲ့ နာမည်က သင့် package ထဲမှာ ရှိတဲ့ function declaration ဒါမှမဟုတ် object ရဲ့ နာမည်နဲ့ တူညီရပါမယ်။

```js
function functionName {
    return result
}

module.exports = {
    functionName
}
```

သင့် packages တွေထဲမှာ JavaScript functions တွေကို ဘယ်လို document လုပ်လဲ ဆိုတာကို အောက်က Add documentation to a package section မှာ လေ့လာနိုင်ပါတယ်။

သင့် package ထဲမှာ JavaScript code ဒါမှမဟုတ် `pm` object instances တွေပဲ ပါပြီး — ခေါ်လို့ရတဲ့ functions ဒါမှမဟုတ် objects တွေ မပါရင် — ဘာမှ export လုပ်ဖို့ မလိုပါဘူး။

အောက်ပါ ဥပမာက `postman_logger` လို့ အမည်ရတဲ့ package တစ်ခုပါ:

* Package ထဲမှာ `data` လို့ အမည်ရတဲ့ parameter တစ်ခုကို လက်ခံပြီး Postman Console ဆီကို argument တစ်ခု ရိုက်ထုတ်ပေးတဲ့ `logger` လို့ အမည်ရတဲ့ function တစ်ခု ရှိပါတယ်။ Function ကို `module.exports` နဲ့ export လုပ်ထားပါတယ်။
* Package က `pm` object ကိုလည်း သုံးပြီး `test` method ကို run လုပ်ပါတယ်။ Test ထဲက function က API တစ်ခုက `200` response code ကို ပြန်ပေးမပေး စစ်ဆေးပါတယ်။ Test result က request ရဲ့ response area ထဲက **Test Results** tab မှာ ပေါ်ပါတယ်။

```js
// package name: postman_logger
function logger (data) {
    console.log(`Logging information to the console, ${data}`)
}

pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

module.exports = {
    logger
}
```

## Package တစ်ခုကို documentation ထည့်ခြင်း (Add documentation to a package)

သင့် packages တွေထဲမှာ JavaScript functions တွေကို document လုပ်ဖို့ Postman က JSDoc ကို ပံ့ပိုးပါတယ်။ JSDoc နဲ့ သင့် functions တွေဆီကို ထည့်ထားတဲ့ documentation တွေက — သင့် scripts တွေကနေ function တစ်ခုချင်းစီကို ခေါ်တဲ့အခါ popup window တစ်ခုထဲမှာ ပေါ်ပါလိမ့်မယ်။ သင့် packages တွေထဲမှာ documentation တွေ ဘယ်လို ထည့်လဲ လေ့လာဖို့ — တရားဝင် [JSDoc documentation](https://jsdoc.app/) ကို သုံးနိုင်ပါတယ်။

အောက်ပါ ဥပမာမှာ JSDoc သုံးပြီး `logger` function အတွက် documentation ပါပါတယ်။ Documentation က function က ဘာလုပ်သလဲ ရှင်းပြပြီး — `data` parameter ကို ဘာအတွက် သုံးလဲ၊ string data type တစ်ခုကို လက်ခံတယ်ဆိုတာ သတ်မှတ်ပါတယ်။

```js
/**
 * This function prints a string to the Postman Console.
 * @param {string} data - The text to print to the Postman Console.
 */
function logger (data) {
    console.log(`Logging information to the console, ${data}`)
}

module.exports = {
    logger
}
```

## Package တစ်ခုကို import လုပ်ခြင်း (Import a package)

Package တစ်ခုထဲမှာ code ရေးပြီးရင် — package တစ်ခုကို သင့် scripts တွေထဲကို import လုပ်နိုင်ပါတယ်။ ဒါက သင့် packages တွေထဲက scripts နဲ့ tests တွေကို access လုပ်ပြီး — တိကျတဲ့ functions နဲ့ objects တွေကို ခေါ်နိုင်စေပါတယ်။ Packages တွေရဲ့ ပါဝင်မှုတွေက internal workspaces တွေကနေသာ run ပါလိမ့်မယ်။

Package library ထဲက တခြား package တစ်ခုရဲ့ ပါဝင်မှုတွေထဲကို package တစ်ခု import လုပ်လို့ မရပါဘူး။

Footer ထဲက **Library** ကို နှိပ်ပြီး **Packages** ကို ရွေးပါ။ Code editor ထဲကို import လုပ်ဖို့ packages တွေကို ရှာပါ။ သင့် team ရဲ့ package library ထဲက packages တွေနဲ့ ရှာဖွေမှု ရလဒ်တွေကို စစ်ထုတ်ဖို့ **Postman packages** ကို ရွေးပါ။ Code editor ထဲကို import လုပ်ဖို့ package တစ်ခုကို ရွေးပါ။

Packages တွေကို `pm.require` method နဲ့ code editor ထဲကို import လုပ်ပါတယ်။ သင့် team domain နဲ့ package နာမည်ကို argument အနေနဲ့ အောက်ပါ format နဲ့ ထည့်ပါတယ် — `@team-domain/package-name`။ ဒါက သင့် packages တွေထဲက functions နဲ့ objects တွေကို ခေါ်ဖို့ သုံးလို့ရတဲ့ JavaScript variable တစ်ခုကိုလည်း ကြေညာပေးပါတယ်။ Variable identifier က default အနေနဲ့ package နာမည်ကို အခြေခံပါတယ်။

သင့် [publisher profile](https://learning.postman.com/docs/administration/managing-your-team/team-settings/#manage-your-publisher-profile) ထဲမှာ team domain ကို ပြောင်းရင် — `pm.require` method ရဲ့ ဖြစ်ပွားမှုတစ်ခုစီတိုင်းမှာပါ team domain ကို ပြောင်းရပါမယ်။ Team domain ကို ကိုယ်တိုင် update လုပ်နိုင်သလို — package တစ်ခုစီကိုလည်း ပြန် import လုပ်နိုင်ပါတယ်။

```js
const variableName = pm.require('@team-domain/package-name');

variableName.functionName()
```

သင့် package ထဲမှာ JavaScript code ဒါမှမဟုတ် `pm` object instances တွေပဲ ပါပြီး — ခေါ်လို့ရတဲ့ functions ဒါမှမဟုတ် objects တွေ မပါရင် — သင့် scripts တွေထဲမှာ import လုပ်ရုံနဲ့ ရပါတယ်။ JavaScript variable တစ်ခုအနေနဲ့လည်း ကြေညာဖို့ မလိုပါဘူး။

```js
pm.require('@team-domain/package-name');
```

သင့် request ရဲ့ script ထဲမှာ import လုပ်ထားတဲ့ packages တွေအားလုံးကို ကြည့်ဖို့ — code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ **Packages** ကို နှိပ်ပါ။ အပြာရောင် checkmark ပါတဲ့ packages တွေက သင့် script ထဲမှာ import လုပ်ထားတာပါ။

အောက်ပါ ဥပမာက `postman_logger` လို့ အမည်ရတဲ့ package တစ်ခုကို import လုပ်ပါတယ်:

* Package ကို `postmanLogger` လို့ အမည်ရတဲ့ variable တစ်ခုအနေနဲ့ ကြေညာပြီး — variable ကို သုံးပြီး package ထဲမှာ ရှိတဲ့ `logger` function ကို ခေါ်ပါတယ်။ Function က parameter တစ်ခုကို လက်ခံပြီး — function ဆီကို ပေးလိုက်တဲ့ argument က `The test passed` ဆိုတဲ့ string ဖြစ်ပြီး Postman Console ထဲမှာ ရိုက်ထုတ်ပါတယ်။
* Package က `pm` object ကိုလည်း သုံးပြီး `test` method ကို run လုပ်ပါတယ်။ Test result က request ရဲ့ response area ထဲက **Test Results** tab မှာ ပေါ်ပါတယ်။

```js
// team domain: postman
// package name: postman_logger
const postmanLogger = pm.require('@postman/postman_logger');

postmanLogger.logger("The test passed")

// output in the Postman Console: Logging information to the console, The test passed
```

## Package တစ်ခုကို တည်းဖြတ်ခြင်း (Edit a package)

သင့် Postman team ထဲက team members တွေအားလုံးက packages တွေကို ကြည့်ရှုပြီး တည်းဖြတ်နိုင်ပါတယ်။

Package တစ်ခုကို တည်းဖြတ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။
2. **Scripts** tab ကို နှိပ်ပါ။
3. Code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ **Packages** ကို နှိပ်ပြီး — **Open package library** ကို နှိပ်ပါ။
4. တည်းဖြတ်ချင်တဲ့ package တစ်ခုကို ရှာပါ။
5. Package ရဲ့ **Summary** နဲ့ **Code** တွေကို လိုအပ်သလို တည်းဖြတ်ပါ။
6. **Save** ကို နှိပ်ပါ။

## Package တစ်ခုကို ဖျက်ခြင်း (Delete a package)

သင့် team ရဲ့ package library ကနေ package တစ်ခုကို ဖျက်ဖို့ — သင် [Team ဒါမှမဟုတ် Super Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) ဒါမှမဟုတ် package ရဲ့ ပိုင်ရှင် ဖြစ်ရပါမယ်။ Package တစ်ခုရဲ့ ပိုင်ရှင်ကို ရှာဖို့ — package library ကို ဖွင့်ပြီး package တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ team member ကို ကြည့်ပါ။

သင့် package library ကနေ ဖျက်လိုက်တဲ့ package တစ်ခုရဲ့ နာမည်ကို ပြန်သုံးလို့ မရပါဘူး။

Package တစ်ခုကို ဖျက်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. HTTP collection, folder ဒါမှမဟုတ် request တစ်ခုကို ဖွင့်ပါ။ gRPC ဒါမှမဟုတ် GraphQL request တစ်ခုကိုလည်း ဖွင့်နိုင်ပါတယ်။
2. **Scripts** tab ကို နှိပ်ပါ။
3. Code editor ရဲ့ အောက်ညာဘက်မှာ ရှိတဲ့ **Packages** ကို နှိပ်ပြီး — **Open package library** ကို ရွေးပါ။
4. ဖျက်ချင်တဲ့ package တစ်ခုကို ရှာပါ။
5. **Options** ကို နှိပ်ပြီး — **Delete** ကို ရွေးပါ။
6. Package ရဲ့ နာမည်ကို ရိုက်ထည့်ပြီး — **Delete package** ကို နှိပ်ပါ။

## Packages တွေထဲမှာ external libraries တွေ သုံးခြင်း (Use external libraries in packages)

Packages တွေထဲမှာ external library modules တွေကို သုံးနိုင်ပါတယ်။ [Supported external library modules တွေနဲ့ ၎င်းတို့ကို ဘယ်လို သုံးလဲ](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/#use-external-libraries) အကြောင်း လေ့လာပါ။

Packages တွေထဲမှာ အောက်ပါ external library modules တွေကို သုံးဖို့ `require` method ကို သုံးရပါမယ်:

* [cheerio](https://cheerio.js.org/)
* [xml2js](https://www.npmjs.com/package/xml2js)

အောက်ပါ libraries တွေက deprecated (အသုံးမပြုတော့ပါ) ဖြစ်ပြီး — နောက်ထပ် ပံ့ပိုးမထားတော့ပါဘူး:

* [atob](https://www.npmjs.com/package/atob) ([atob method](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/#use-global-objects) ကို သုံးပါ)
* [btoa](https://www.npmjs.com/package/btoa) ([btoa method](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/#use-global-objects) ကို သုံးပါ)
* [crypto-js](https://www.npmjs.com/package/crypto-js) ([Web Crypto objects](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/#use-global-objects) တွေကို သုံးပါ)
* [tv4](https://github.com/geraintluff/tv4) ([ajv library](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-require/#use-external-libraries) ကို သုံးပါ)
