---
title: "Compiler Options in MSBuild (MSBuild ထဲက Compiler Options)"
description: "MSBuild အခြေပြု project (ASP.NET Core စသည်) တွေမှာ TypeScript ကို configure လုပ်နည်း — tsconfig.json နဲ့ project settings နည်းလမ်းနှစ်မျိုး၊ MSBuild config name နဲ့ TSC flag mapping ဇယားအပြည့်အစုံ"
order: 71
source: "https://www.typescriptlang.org/docs/handbook/compiler-options-in-msbuild.html"
status: translated
updated: 2026-09-05
---

## Overview (ခြုံငုံကြည့်ခြင်း)

ASP.NET Core project လိုမျိုး — TypeScript ကို သုံးထားတဲ့ MSBuild အခြေပြု project တစ်ခု ရှိတဲ့အခါ — TypeScript ကို နည်းလမ်း နှစ်မျိုးနဲ့ configure လုပ်နိုင်ပါတယ်: `tsconfig.json` ကနေတစ်ဆင့် ဒါမှမဟုတ် project ရဲ့ settings ကနေတစ်ဆင့်ပါ။

## Using a `tsconfig.json` (tsconfig.json ကို အသုံးပြုခြင်း)

ဖြစ်နိုင်ရင် သင့် project အတွက် `tsconfig.json` တစ်ခု သုံးဖို့ အကြံပြုပါတယ်။ ရှိပြီးသား project တစ်ခုထဲကို ထည့်ဖို့ဆိုရင် — Visual Studio ရဲ့ ခေတ်မီ (modern) versions တွေမှာ "TypeScript JSON Configuration File" လို့ ခေါ်တဲ့ item အသစ်တစ်ခုကို သင့် project ထဲ ထည့်လိုက်ပါ။

အဲဒီ `tsconfig.json` အသစ်က — files နဲ့ configuration လိုမျိုး — TypeScript နဲ့ သက်ဆိုင်တဲ့ build အချက်အလက်တွေအတွက် — အဓိက မှီခိုရာ (source of truth) အဖြစ် နောက်ပိုင်းမှာ သုံးပါလိမ့်မယ်။ [TSConfig တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို ဒီမှာ](/docs/typescript/tsconfig-json) လေ့လာနိုင်ပြီး — [ပြည့်စုံတဲ့ reference ကို ဒီမှာ](https://www.typescriptlang.org/tsconfig) တွေ့နိုင်ပါတယ်။

## Using Project Settings (Project Settings ကို အသုံးပြုခြင်း)

TypeScript အတွက် configuration ကို သင့် project ရဲ့ settings ထဲမှာလည်း သတ်မှတ်နိုင်ပါတယ်။ ဒါကို — build က ဘယ်လို အလုပ်လုပ်နိုင်လဲဆိုတာ ဖော်ပြတဲ့ `PropertyGroups` တွေကို သတ်မှတ်ဖို့ — သင့် `.csproj` ထဲက XML ကို တည်းဖြတ်ခြင်းအားဖြင့် လုပ်ပါတယ်:

```xml
<PropertyGroup>
  <TypeScriptNoEmitOnError>true</TypeScriptNoEmitOnError>
  <TypeScriptNoImplicitReturns>true</TypeScriptNoImplicitReturns>
</PropertyGroup>
```

Common TypeScript settings တွေအတွက် mappings (ဆက်စပ်ဇယားများ) တစ်စီး ရှိပါတယ် — ဒါတွေက [TypeScript cli options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) တွေဆီ တိုက်ရိုက် ချိတ်ဆက်ထားတဲ့ settings တွေ ဖြစ်ပြီး — ပိုပြီး နားလည်လွယ်တဲ့ project file တစ်ခု ရေးနိုင်ဖို့ ကူညီပေးပါတယ်။ Mapping တစ်ခုချင်းစီအတွက် တန်ဖိုးတွေနဲ့ default တွေက ဘာတွေလဲဆိုတာ ပိုသိချင်ရင် [TSConfig reference](https://www.typescriptlang.org/tsconfig) ကို သုံးနိုင်ပါတယ်။

### CLI Mappings (CLI Mapping များ)

  <table class='cli-option' width="100%">
    <thead>
    <tr>
    <th>MSBuild Config Name</th>
    <th>TSC Flag</th>
    </tr>
  </thead>
  <tbody>

<tr class='odd' name='allowJs'>
<td><code>&#x3C;TypeScriptAllowJS&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowJs'>--allowJs</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>JavaScript files တွေကို သင့် program ထဲ ပါဝင်ခွင့်ပြုပါ။ ဒီ files တွေကနေ errors တွေ ရဖို့ <code>checkJS</code> option ကို သုံးပါ။</p>

</tr></td>
<tr class='even' name='removeComments'>
<td><code>&#x3C;TypeScriptRemoveComments&#x3E;</code></td>
<td><code><a href='/tsconfig/#removeComments'>--removeComments</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Comments (မှတ်ချက်များ) တွေ ထုတ်လွှတ်တာကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='odd' name='noImplicitAny'>
<td><code>&#x3C;TypeScriptNoImplicitAny&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitAny'>--noImplicitAny</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Expressions နဲ့ declarations တွေထဲမှာ သွယ်ဝိုက်နေတဲ့ (implied) <code>any</code> type ရှိရင် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='declaration'>
<td><code>&#x3C;TypeScriptGeneratesDeclarations&#x3E;</code></td>
<td><code><a href='/tsconfig/#declaration'>--declaration</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>သင့် project ထဲက TypeScript နဲ့ JavaScript files တွေကနေ .d.ts files တွေ ထုတ်ပေးပါ။</p>

</tr></td>
<tr class='odd' name='module'>
<td><code>&#x3C;TypeScriptModuleKind&#x3E;</code></td>
<td><code><a href='/tsconfig/#module'>--module</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ဘယ်လို module code မျိုး ထုတ်လုပ်မလဲ သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='jsx'>
<td><code>&#x3C;TypeScriptJSXEmit&#x3E;</code></td>
<td><code><a href='/tsconfig/#jsx'>--jsx</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>ဘယ်လို JSX code မျိုး ထုတ်လုပ်မလဲ သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='outDir'>
<td><code>&#x3C;TypeScriptOutDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#outDir'>--outDir</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ files တွေ အားလုံးအတွက် output folder တစ်ခု သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='sourcemap'>
<td><code>&#x3C;TypeScriptSourceMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#sourcemap'>--sourcemap</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ JavaScript files တွေအတွက် source map files တွေ ဖန်တီးပါ။</p>

</tr></td>
<tr class='odd' name='target'>
<td><code>&#x3C;TypeScriptTarget&#x3E;</code></td>
<td><code><a href='/tsconfig/#target'>--target</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ JavaScript အတွက် JavaScript language version ကို သတ်မှတ်ပြီး — လိုက်ဖက်ညီတဲ့ library declarations တွေကိုပါ ထည့်သွင်းပါ။</p>

</tr></td>
<tr class='even' name='noResolve'>
<td><code>&#x3C;TypeScriptNoResolve&#x3E;</code></td>
<td><code><a href='/tsconfig/#noResolve'>--noResolve</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p> <code>import</code>s တွေ၊ <code>require</code>s တွေ ဒါမှမဟုတ် <code>&#x3C;reference></code>s တွေကြောင့် TypeScript က project တစ်ခုထဲ ထည့်ရမယ့် file အရေအတွက် တိုးလာတာကို ခွင့်မပြုပါ။</p>

</tr></td>
<tr class='odd' name='mapRoot'>
<td><code>&#x3C;TypeScriptMapRoot&#x3E;</code></td>
<td><code><a href='/tsconfig/#mapRoot'>--mapRoot</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Debugger က map files တွေကို — ထုတ်ပေးထားတဲ့ နေရာတွေအစား — ရှာဖွေရမယ့် တည်နေရာကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='sourceRoot'>
<td><code>&#x3C;TypeScriptSourceRoot&#x3E;</code></td>
<td><code><a href='/tsconfig/#sourceRoot'>--sourceRoot</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Debuggers တွေ reference source code ကို ရှာတွေ့နိုင်ဖို့ root path ကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='charset'>
<td><code>&#x3C;TypeScriptCharset&#x3E;</code></td>
<td><code><a href='/tsconfig/#charset'>--charset</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>နောက်ထပ် ပံ့ပိုးမှု မရှိတော့ပါ။ အစောပိုင်း versions တွေမှာ — files တွေ ဖတ်တဲ့အခါ text encoding ကို ကိုယ်တိုင် သတ်မှတ်ပေးခဲ့ရပါတယ်။</p>

</tr></td>
<tr class='even' name='emitBOM'>
<td><code>&#x3C;TypeScriptEmitBOM&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitBOM'>--emitBOM</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Output files တွေရဲ့ အစမှာ UTF-8 Byte Order Mark (BOM) တစ်ခု ထုတ်လွှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='noLib'>
<td><code>&#x3C;TypeScriptNoLib&#x3E;</code></td>
<td><code><a href='/tsconfig/#noLib'>--noLib</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Default lib.d.ts အပါအဝင် — library files ဘယ်ဟာကိုမှ ထည့်သွင်းခြင်း မပြုပါ။</p>

</tr></td>
<tr class='even' name='preserveConstEnums'>
<td><code>&#x3C;TypeScriptPreserveConstEnums&#x3E;</code></td>
<td><code><a href='/tsconfig/#preserveConstEnums'>--preserveConstEnums</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ code ထဲမှာ <code>const enum</code> declarations တွေကို ဖျက်ပစ်တာ မလုပ်ပါ။</p>

</tr></td>
<tr class='odd' name='suppressImplicitAnyIndexErrors'>
<td><code>&#x3C;TypeScriptSuppressImplicitAnyIndexErrors&#x3E;</code></td>
<td><code><a href='/tsconfig/#suppressImplicitAnyIndexErrors'>--suppressImplicitAnyIndexErrors</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Index signatures မရှိတဲ့ objects တွေကို index လုပ်တဲ့အခါ <code>noImplicitAny</code> errors တွေ တင်ပြခြင်းကို ရပ်ထားပါ။</p>

</tr></td>
<tr class='even' name='noEmitHelpers'>
<td><code>&#x3C;TypeScriptNoEmitHelpers&#x3E;</code></td>
<td><code><a href='/tsconfig/#noEmitHelpers'>--noEmitHelpers</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Compiled output ထဲမှာ <code>__extends</code> လိုမျိုး custom helper functions တွေ ထုတ်လုပ်ခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='odd' name='inlineSourceMap'>
<td><code>&#x3C;TypeScriptInlineSourceMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#inlineSourceMap'>--inlineSourceMap</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ JavaScript ထဲမှာ sourcemap files တွေ ထည့်သွင်းပါ။</p>

</tr></td>
<tr class='even' name='inlineSources'>
<td><code>&#x3C;TypeScriptInlineSources&#x3E;</code></td>
<td><code><a href='/tsconfig/#inlineSources'>--inlineSources</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ JavaScript ထဲက sourcemaps တွေထဲမှာ source code ကို ထည့်သွင်းပါ။</p>

</tr></td>
<tr class='odd' name='newLine'>
<td><code>&#x3C;TypeScriptNewLine&#x3E;</code></td>
<td><code><a href='/tsconfig/#newLine'>--newLine</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Files တွေ ထုတ်လွှတ်တဲ့အခါ သုံးရမယ့် newline character ကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='isolatedModules'>
<td><code>&#x3C;TypeScriptIsolatedModules&#x3E;</code></td>
<td><code><a href='/tsconfig/#isolatedModules'>--isolatedModules</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>File တစ်ခုချင်းစီက — အခြား imports တွေကို အားမကိုးဘဲ — လုံခြုံစွာ transpile လုပ်လို့ရအောင် သေချာစေပါ။</p>

</tr></td>
<tr class='odd' name='emitDecoratorMetadata'>
<td><code>&#x3C;TypeScriptEmitDecoratorMetadata&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitDecoratorMetadata'>--emitDecoratorMetadata</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Source files တွေထဲက decorated declarations တွေအတွက် design-type metadata ကို ထုတ်လွှတ်ပါ။</p>

</tr></td>
<tr class='even' name='rootDir'>
<td><code>&#x3C;TypeScriptRootDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#rootDir'>--rootDir</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>သင့် source files တွေရဲ့ အတွင်းမှာ ရှိတဲ့ root folder ကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='experimentalDecorators'>
<td><code>&#x3C;TypeScriptExperimentalDecorators&#x3E;</code></td>
<td><code><a href='/tsconfig/#experimentalDecorators'>--experimentalDecorators</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>TC39 stage 2 draft decorators တွေအတွက် experimental (စမ်းသပ်ဆဲ) ပံ့ပိုးမှုကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='moduleResolution'>
<td><code>&#x3C;TypeScriptModuleResolution&#x3E;</code></td>
<td><code><a href='/tsconfig/#moduleResolution'>--moduleResolution</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>TypeScript က module specifier တစ်ခုကနေ file တစ်ခုကို ဘယ်လို ရှာဖွေရမလဲ သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='suppressExcessPropertyErrors'>
<td><code>&#x3C;TypeScriptSuppressExcessPropertyErrors&#x3E;</code></td>
<td><code><a href='/tsconfig/#suppressExcessPropertyErrors'>--suppressExcessPropertyErrors</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Object literals တွေ ဖန်တီးနေစဉ်အတွင်း excess property errors (ပိုနေတဲ့ property တွေရဲ့ error) တင်ပြခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='even' name='reactNamespace'>
<td><code>&#x3C;TypeScriptReactNamespace&#x3E;</code></td>
<td><code><a href='/tsconfig/#reactNamespace'>--reactNamespace</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p> <code>createElement</code> အတွက် ခေါ်ယူမယ့် object ကို သတ်မှတ်ပါ။ ဒါက <code>react</code> JSX emit ကို target လုပ်တဲ့အခါမှသာ သက်ရောက်ပါတယ်။</p>

</tr></td>
<tr class='odd' name='skipDefaultLibCheck'>
<td><code>&#x3C;TypeScriptSkipDefaultLibCheck&#x3E;</code></td>
<td><code><a href='/tsconfig/#skipDefaultLibCheck'>--skipDefaultLibCheck</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>TypeScript နဲ့အတူ ပါလာတဲ့ .d.ts files တွေကို type checking လုပ်တာ ကျော်လိုက်ပါ။</p>

</tr></td>
<tr class='even' name='allowUnusedLabels'>
<td><code>&#x3C;TypeScriptAllowUnusedLabels&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowUnusedLabels'>--allowUnusedLabels</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>အသုံးမပြုတဲ့ labels တွေအတွက် error တင်ပြခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='odd' name='noImplicitReturns'>
<td><code>&#x3C;TypeScriptNoImplicitReturns&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitReturns'>--noImplicitReturns</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Function တစ်ခုထဲမှာ အတိအကျ return မလုပ်တဲ့ code paths တွေအတွက် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='noFallthroughCasesInSwitch'>
<td><code>&#x3C;TypeScriptNoFallthroughCasesInSwitch&#x3E;</code></td>
<td><code><a href='/tsconfig/#noFallthroughCasesInSwitch'>--noFallthroughCasesInSwitch</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Switch statements တွေထဲက fallthrough cases (အောက်ကို ဆက်စီးဆင်းသွားတဲ့ case များ) တွေအတွက် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='odd' name='allowUnreachableCode'>
<td><code>&#x3C;TypeScriptAllowUnreachableCode&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowUnreachableCode'>--allowUnreachableCode</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ရောက်ရှိလို့မရတဲ့ (unreachable) code အတွက် error တင်ပြခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='even' name='forceConsistentCasingInFileNames'>
<td><code>&#x3C;TypeScriptForceConsistentCasingInFileNames&#x3E;</code></td>
<td><code><a href='/tsconfig/#forceConsistentCasingInFileNames'>--forceConsistentCasingInFileNames</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Imports တွေထဲမှာ casing (စာလုံး အကြီး/အသေး) မှန်ကန်ကြောင်း သေချာစေပါ။</p>

</tr></td>
<tr class='odd' name='allowSyntheticDefaultImports'>
<td><code>&#x3C;TypeScriptAllowSyntheticDefaultImports&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowSyntheticDefaultImports'>--allowSyntheticDefaultImports</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Module တစ်ခုမှာ default export မရှိတဲ့အခါ 'import x from y' ကို ခွင့်ပြုပါ။</p>

</tr></td>
<tr class='even' name='noImplicitUseStrict'>
<td><code>&#x3C;TypeScriptNoImplicitUseStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitUseStrict'>--noImplicitUseStrict</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>ထုတ်လွှတ်လိုက်တဲ့ JavaScript files တွေထဲမှာ 'use strict' directives တွေ ထည့်သွင်းတာကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='odd' name='lib'>
<td><code>&#x3C;TypeScriptLib&#x3E;</code></td>
<td><code><a href='/tsconfig/#lib'>--lib</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Target runtime environment (ပစ်မှတ် runtime ပတ်ဝန်းကျင်) ကို ဖော်ပြတဲ့ bundled library declaration files အစုတစ်ခုကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='baseUrl'>
<td><code>&#x3C;TypeScriptBaseUrl&#x3E;</code></td>
<td><code><a href='/tsconfig/#baseUrl'>--baseUrl</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Bare specifier module names တွေကို ရှာဖွေဖို့ base directory ကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='declarationDir'>
<td><code>&#x3C;TypeScriptDeclarationDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#declarationDir'>--declarationDir</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ထုတ်ပေးလိုက်တဲ့ declaration files တွေအတွက် output directory ကို သတ်မှတ်ပါ။</p>

</tr></td>
<tr class='even' name='noImplicitThis'>
<td><code>&#x3C;TypeScriptNoImplicitThis&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitThis'>--noImplicitThis</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p> <code>this</code> ကို <code>any</code> type ပေးထားတဲ့အခါ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='odd' name='skipLibCheck'>
<td><code>&#x3C;TypeScriptSkipLibCheck&#x3E;</code></td>
<td><code><a href='/tsconfig/#skipLibCheck'>--skipLibCheck</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>.d.ts files တွေ အားလုံးကို type checking လုပ်တာ ကျော်လိုက်ပါ။</p>

</tr></td>
<tr class='even' name='strictNullChecks'>
<td><code>&#x3C;TypeScriptStrictNullChecks&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictNullChecks'>--strictNullChecks</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Type checking လုပ်တဲ့အခါ <code>null</code> နဲ့ <code>undefined</code> တွေကို ထည့်သွင်း စဉ်းစားပါ။</p>

</tr></td>
<tr class='odd' name='noUnusedLocals'>
<td><code>&#x3C;TypeScriptNoUnusedLocals&#x3E;</code></td>
<td><code><a href='/tsconfig/#noUnusedLocals'>--noUnusedLocals</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Local variables တွေကို ဖတ်မသုံးတဲ့အခါ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='noUnusedParameters'>
<td><code>&#x3C;TypeScriptNoUnusedParameters&#x3E;</code></td>
<td><code><a href='/tsconfig/#noUnusedParameters'>--noUnusedParameters</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Function parameter တစ်ခုကို ဖတ်မသုံးတဲ့အခါ error တစ်ခု တင်ပါ</p>

</tr></td>
<tr class='odd' name='alwaysStrict'>
<td><code>&#x3C;TypeScriptAlwaysStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#alwaysStrict'>--alwaysStrict</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>'use strict' ကို အမြဲတမ်း ထုတ်လွှတ်ကြောင်း သေချာစေပါ။</p>

</tr></td>
<tr class='even' name='importHelpers'>
<td><code>&#x3C;TypeScriptImportHelpers&#x3E;</code></td>
<td><code><a href='/tsconfig/#importHelpers'>--importHelpers</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Helper functions တွေကို file တစ်ခုချင်းစီမှာ ထည့်သွင်းမယ့်အစား — project တစ်ခုလျှင် တစ်ကြိမ် tslib ကနေ import လုပ်ခွင့်ပြုပါ။</p>

</tr></td>
<tr class='odd' name='jsxFactory'>
<td><code>&#x3C;TypeScriptJSXFactory&#x3E;</code></td>
<td><code><a href='/tsconfig/#jsxFactory'>--jsxFactory</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>React JSX emit ကို target လုပ်တဲ့အခါ သုံးမယ့် JSX factory function ကို သတ်မှတ်ပါ — ဥပမာ 'React.createElement' ဒါမှမဟုတ် 'h'</p>

</tr></td>
<tr class='even' name='stripInternal'>
<td><code>&#x3C;TypeScriptStripInternal&#x3E;</code></td>
<td><code><a href='/tsconfig/#stripInternal'>--stripInternal</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>သူတို့ရဲ့ JSDoc comments တွေထဲမှာ <code>@internal</code> ပါတဲ့ declarations တွေ ထုတ်လွှတ်ခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
<tr class='odd' name='checkJs'>
<td><code>&#x3C;TypeScriptCheckJs&#x3E;</code></td>
<td><code><a href='/tsconfig/#checkJs'>--checkJs</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Type-checked လုပ်ထားတဲ့ JavaScript files တွေထဲမှာ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='downlevelIteration'>
<td><code>&#x3C;TypeScriptDownlevelIteration&#x3E;</code></td>
<td><code><a href='/tsconfig/#downlevelIteration'>--downlevelIteration</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Iteration (ထပ်ကာတလဲလဲ လုပ်ဆောင်မှု) တွေအတွက် — ပိုပြီး လိုက်နာမှုရှိတဲ့ပေမယ့် — ရှည်လျားပြီး performance ပိုနည်းတဲ့ JavaScript ကို ထုတ်လွှတ်ပါ။</p>

</tr></td>
<tr class='odd' name='strict'>
<td><code>&#x3C;TypeScriptStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#strict'>--strict</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Strict type checking options (တင်းကျပ်တဲ့ type စစ်ဆေးမှု ရွေးချယ်စရာများ) တွေ အားလုံးကို ဖွင့်ပေးပါ။</p>

</tr></td>
<tr class='even' name='noStrictGenericChecks'>
<td><code>&#x3C;TypeScriptNoStrictGenericChecks&#x3E;</code></td>
<td><code><a href='/tsconfig/#noStrictGenericChecks'>--noStrictGenericChecks</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Function types တွေထဲက generic signatures တွေကို strict စစ်ဆေးခြင်း မပြုပါ။</p>

</tr></td>
<tr class='odd' name='preserveSymlinks'>
<td><code>&#x3C;TypeScriptPreserveSymlinks&#x3E;</code></td>
<td><code><a href='/tsconfig/#preserveSymlinks'>--preserveSymlinks</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Symlinks တွေကို သူတို့ရဲ့ realpath အဖြစ် ဖြေရှင်းတာ မလုပ်ပါ။ ဒါက node ထဲက flag တစ်ခုနဲ့ တူညီပါတယ်။</p>

</tr></td>
<tr class='even' name='strictFunctionTypes'>
<td><code>&#x3C;TypeScriptStrictFunctionTypes&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictFunctionTypes'>--strictFunctionTypes</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Functions တွေ assign လုပ်တဲ့အခါ — parameters တွေနဲ့ return values တွေ subtype-compatible (subtype အဖြစ် ကိုက်ညီမှု) ရှိမရှိ စစ်ဆေးပါ။</p>

</tr></td>
<tr class='odd' name='strictPropertyInitialization'>
<td><code>&#x3C;TypeScriptStrictPropertyInitialization&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictPropertyInitialization'>--strictPropertyInitialization</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ကြေညာထားပေမယ့် constructor ထဲမှာ မသတ်မှတ်ထားတဲ့ class properties တွေကို စစ်ဆေးပါ။</p>

</tr></td>
<tr class='even' name='esModuleInterop'>
<td><code>&#x3C;TypeScriptESModuleInterop&#x3E;</code></td>
<td><code><a href='/tsconfig/#esModuleInterop'>--esModuleInterop</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>CommonJS modules တွေကို import လုပ်တာကို ပိုလွယ်ကူစေဖို့ နောက်ထပ် JavaScript တွေ ထုတ်လွှတ်ပါ။ ဒါက type compatibility အတွက် <code>allowSyntheticDefaultImports</code> ကို ဖွင့်ပေးပါတယ်။</p>

</tr></td>
<tr class='odd' name='emitDeclarationOnly'>
<td><code>&#x3C;TypeScriptEmitDeclarationOnly&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitDeclarationOnly'>--emitDeclarationOnly</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>JavaScript files တွေ မဟုတ်ဘဲ — d.ts files တွေကိုသာ output လုပ်ပါ။</p>

</tr></td>
<tr class='even' name='keyofStringsOnly'>
<td><code>&#x3C;TypeScriptKeyofStringsOnly&#x3E;</code></td>
<td><code><a href='/tsconfig/#keyofStringsOnly'>--keyofStringsOnly</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Keyof က string, numbers ဒါမှမဟုတ် symbols တွေအစား — strings တွေကိုသာ ပြန်ပေးစေပါ။ Legacy (အဟောင်း) option တစ်ခုပါ။</p>

</tr></td>
<tr class='odd' name='useDefineForClassFields'>
<td><code>&#x3C;TypeScriptUseDefineForClassFields&#x3E;</code></td>
<td><code><a href='/tsconfig/#useDefineForClassFields'>--useDefineForClassFields</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>ECMAScript standard နဲ့ ကိုက်ညီတဲ့ class fields တွေကို ထုတ်လွှတ်ပါ။</p>

</tr></td>
<tr class='even' name='declarationMap'>
<td><code>&#x3C;TypeScriptDeclarationMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#declarationMap'>--declarationMap</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>D.ts files တွေအတွက် sourcemaps တွေ ဖန်တီးပါ။</p>

</tr></td>
<tr class='odd' name='resolveJsonModule'>
<td><code>&#x3C;TypeScriptResolveJsonModule&#x3E;</code></td>
<td><code><a href='/tsconfig/#resolveJsonModule'>--resolveJsonModule</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>.json files တွေကို import လုပ်ခြင်းကို ဖွင့်ပေးပါ</p>

</tr></td>
<tr class='even' name='strictBindCallApply'>
<td><code>&#x3C;TypeScriptStrictBindCallApply&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictBindCallApply'>--strictBindCallApply</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p> <code>bind</code>, <code>call</code>, နဲ့ <code>apply</code> methods တွေရဲ့ arguments တွေက မူရင်း function နဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပါ။</p>

</tr></td>
<tr class='odd' name='noEmitOnError'>
<td><code>&#x3C;TypeScriptNoEmitOnError&#x3E;</code></td>
<td><code><a href='/tsconfig/#noEmitOnError'>--noEmitOnError</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Type checking errors တစ်ခုခု တင်ပြခံရရင် — files တွေ ထုတ်လွှတ်ခြင်းကို ပိတ်ထားပါ။</p>

</tr></td>
</tbody></table>

### Additional Flags (နောက်ထပ် Flags များ)

MSBuild system က arguments တွေကို TypeScript CLI ဆီ တိုက်ရိုက် ပေးပို့တာမို့ — အပေါ်မှာ mapping မရှိတဲ့ သီးခြား flags တွေ သတ်မှတ်ဖို့ `TypeScriptAdditionalFlags` ဆိုတဲ့ option ကို သုံးနိုင်ပါတယ်။

ဥပမာ — ဒါက [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig) ကို ဖွင့်ပေးပါလိမ့်မယ်:

```xml
<TypeScriptAdditionalFlags> $(TypeScriptAdditionalFlags) --noPropertyAccessFromIndexSignature</TypeScriptAdditionalFlags>
```

### Debug and Release Builds (Debug နဲ့ Release Builds)

PropertyGroup conditions တွေကို သုံးပြီး — configuration အစုံ မတူညီတာတွေကို သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — production မှာ comments တွေနဲ့ sourcemaps တွေကို ဖယ်ရှားတာက အသုံးများတဲ့ လုပ်ငန်းစဉ်တစ်ခုပါ။ ဒီဥပမာမှာ — TypeScript configuration မတူညီတဲ့ debug နဲ့ release property group နှစ်ခုကို သတ်မှတ်ထားပါတယ်:

```xml
<PropertyGroup Condition="'$(Configuration)' == 'Debug'">
  <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
  <TypeScriptSourceMap>true</TypeScriptSourceMap>
</PropertyGroup>

<PropertyGroup Condition="'$(Configuration)' == 'Release'">
  <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
  <TypeScriptSourceMap>false</TypeScriptSourceMap>
</PropertyGroup>

<Import
    Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
    Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
```

### ToolsVersion (Compiler ဗားရှင်း သတ်မှတ်ခြင်း)

Project file ထဲက `<TypeScriptToolsVersion>1.7</TypeScriptToolsVersion>` property ရဲ့ တန်ဖိုးက — build လုပ်ဖို့ သုံးမယ့် compiler version ကို ဖော်ပြပါတယ် (ဒီဥပမာမှာ 1.7 ဖြစ်ပါတယ်)။
ဒါက project တစ်ခုကို — machine အမျိုးမျိုးမှာ — compiler ရဲ့ တူညီတဲ့ versions တွေနဲ့ build လုပ်နိုင်စေပါတယ်။

`TypeScriptToolsVersion` ကို သတ်မှတ်မထားဘူးဆိုရင် — machine ပေါ်မှာ install လုပ်ထားတဲ့ compiler version အသစ်ဆုံးကို သုံးပြီး build လုပ်ပါလိမ့်မယ်။

TS ရဲ့ version အသစ်တွေကို သုံးနေတဲ့သူတွေက — project ကို ပထမဆုံး load လုပ်တဲ့အခါ — အဲဒီ project ကို upgrade လုပ်ဖို့ prompt တစ်ခု တွေ့ရပါလိမ့်မယ်။

### TypeScriptCompileBlocked (TypeScript compile လုပ်ခြင်းကို ပိတ်ထားခြင်း)

သင့် project ကို build လုပ်ဖို့ တခြား build tool တစ်ခုကို သုံးပြီး — development နဲ့ debugging အတွေ့အကြုံအတွက်တော့ VS ကို သုံးနေတယ်ဆိုရင် — သင့် project ထဲမှာ `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>` လို့ သတ်မှတ်လိုက်ပါ။
ဒါဆိုရင် editing support (တည်းဖြတ်မှု ပံ့ပိုးမှု) အားလုံးကို ရမှာဖြစ်ပေမယ့် — F5 နှိပ်လိုက်တဲ့အခါ build လုပ်တာတော့ မလုပ်တော့ပါဘူး။

### TypeScriptEnableIncrementalMSBuild (TypeScript 4.2 Beta and later) (MSBuild မှာ incremental build ဖွင့်ခြင်း)

Default အားဖြင့် — MSBuild က project ရဲ့ source files တွေ နောက်ဆုံး compilation နောက်ပိုင်း update ဖြစ်ထားမှသာ TypeScript compiler ကို run လုပ်ဖို့ ကြိုးစားပါတယ်။
ဒါပေမယ့် — TypeScript ရဲ့ [`incremental`](https://www.typescriptlang.org/tsconfig) option ဖွင့်ထားတုန်းလိုမျိုး — ဒီအပြုအမူက ပြဿနာတွေ ဖြစ်စေတယ်ဆိုရင် — MSBuild run တိုင်း TypeScript compiler ကို ခေါ်ယူဖို့ သေချာစေဖို့ `<TypeScriptEnableIncrementalMSBuild>false</TypeScriptEnableIncrementalMSBuild>` လို့ သတ်မှတ်လိုက်ပါ။
