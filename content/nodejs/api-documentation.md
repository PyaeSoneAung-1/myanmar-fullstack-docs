---
title: "About this documentation (Node.js API documentation အကြောင်း)"
description: "Node.js ရဲ့ API reference documentation — ဖွဲ့စည်းပုံ (structure), stability index (တည်ငြိမ်မှု အညွှန်း) နဲ့ tags များအကြောင်း ရှင်းလင်းချက်"
order: 154
source: "https://nodejs.org/api/documentation.html"
status: translated
updated: 2026-09-05
---

Node.js ရဲ့ တရားဝင် API reference documentation ဆီကို ကြိုဆိုပါတယ်။

Node.js က [V8 JavaScript engine][] ပေါ်မှာ တည်ဆောက်ထားတဲ့ JavaScript runtime တစ်ခုပါ။

## ပံ့ပိုးကူညီခြင်း (Contributing)

ဒီ documentation ထဲမှာ error တွေ တွေ့ရင် [the issue tracker][] မှာ တင်ပြနိုင်ပါတယ်။ Pull requests တွေ ဘယ်လို တင်သွင်းရမလဲ ဆိုတဲ့ လမ်းညွှန်ချက်တွေအတွက် [the contributing guide][] ကို ကြည့်ရှုပါ။

## တည်ငြိမ်မှု အညွှန်း (Stability index)

ဒီ documentation တစ်လျှောက်လုံးမှာ section တစ်ခုစီရဲ့ stability (တည်ငြိမ်မှု) အဆင့်ကို ညွှန်ပြတဲ့ အမှတ်အသားတွေ ပါဝင်ပါတယ်။ အချို့ APIs တွေက သက်သေပြပြီးသား ဖြစ်ပြီး အများက အလွန် အားကိုးအားထား ပြုထားတာမို့ — လုံးဝ ပြောင်းလဲနိုင်ဖွယ် မရှိပါဘူး။ နောက်ထပ် အချို့ကတော့ အသစ်စက်စက် ဖြစ်ပြီး experimental (စမ်းသပ်ဆဲ) ဖြစ်တာ — ဒါမှမဟုတ် အန္တရာယ် ရှိတယ်လို့ သိထားကြတဲ့ အရာတွေ ဖြစ်ပါတယ်။

Stability index တွေကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

> Stability: 0 - Deprecated. Feature က warning တွေ ထုတ်လွှတ်နိုင်ပါတယ်။ Backward compatibility ကိုတော့ အာမခံထားခြင်း မရှိပါဘူး။

> Stability: 1 - Experimental. ဒီ feature က [semantic versioning][] rules တွေရဲ့ နယ်ပယ်ထဲ မပါဝင်ပါဘူး။ Backward compatibility မရှိတဲ့ ပြောင်းလဲမှုတွေ (သို့) feature ကို ဖယ်ရှားလိုက်တာတွေက နောင် release တစ်ခုခုမှာ ဖြစ်ပေါ်နိုင်ပါတယ်။ ဒီ feature ကို production environments တွေမှာ သုံးဖို့ အကြံမပြုပါဘူး။
>
> Experimental features တွေကို stage အဆင့်တွေ ထပ်ခွဲထားပါတယ်:
>
> * 1.0 - Early development. ဒီ stage က experimental features တွေက မပြီးဆုံးသေးဘဲ — သိသိသာသာ ပြောင်းလဲမှုတွေ ရှိနိုင်ပါတယ်။
> * 1.1 - Active development. ဒီ stage က experimental features တွေက အနည်းဆုံး ဖြစ်နိုင်သည့် အဆင့် (minimum viability) ဆီ နီးစပ်နေပါပြီ။
> * 1.2 - Release candidate. ဒီ stage က experimental features တွေက stable ဖြစ်လာဖို့ အသင့်ဖြစ်နေပါပြီလို့ မျှော်လင့်ရပါတယ်။ နောက်ထပ် breaking changes တွေ မရှိတော့ဘူးလို့ ခန့်မှန်းထားပေမယ့် — user feedback (သို့) feature ရဲ့ နောက်ခံ specification ဖွံ့ဖြိုးတိုးတက်မှုကို တုံ့ပြန်တဲ့အနေနဲ့ ဖြစ်ပေါ်လာနိုင်ပါသေးတယ်။ ဒီ feature က stable အဖြစ် မှတ်သားဖို့ အသင့်ဖြစ်ကြောင်း သိရှိနိုင်ဖို့ user testing နဲ့ feedback တွေကို အားပေးတိုက်တွန်းပါတယ်။
>
> Experimental features တွေက ပုံမှန်အားဖြင့် stable အဖြစ်သို့ တိုးမြှင့်လိုက်တာ (သို့) deprecation cycle မရှိဘဲ ဖယ်ရှားခံလိုက်ရတာဆိုတဲ့ နည်းလမ်း နှစ်ခုထဲက တစ်ခုနဲ့ပဲ experimental status ကနေ ထွက်သွားလေ့ ရှိပါတယ်။

> Stability: 2 - Stable. npm ecosystem နဲ့ လိုက်ဖက်ညီမှု (compatibility) က ဦးစားပေး အဆင့်မြင့်တဲ့ ကိစ္စတစ်ခု ဖြစ်ပါတယ်။

> Stability: 3 - Legacy. ဒီ feature က ဖယ်ရှားခံရနိုင်ခြေ နည်းပြီး semantic versioning guarantees တွေရဲ့ အကာအကွယ် ရနေဆဲ ဖြစ်ပေမယ့် — တက်ကြွစွာ ထိန်းသိမ်း ပြုပြင်မှု (actively maintained) မရှိတော့ဘဲ တခြား ရွေးချယ်စရာတွေ ရှိနေပါတယ်။

Feature တစ်ခုကို သုံးတာက ထိခိုက်မှု မရှိဘူး၊ ပြီးတော့ npm ecosystem ထဲမှာ ကျယ်ကျယ်ပြန့်ပြန့် အားကိုးသုံးစွဲနေကြတယ်ဆိုရင် — အဲဒီ feature ကို deprecated အဖြစ် မှတ်သားမယ့်အစား legacy အဖြစ်ပဲ မှတ်သားပါတယ်။ Legacy features တွေထဲမှာ တွေ့ရတဲ့ bugs တွေကိုတော့ ပြုပြင်ပေးနိုင်ဖွယ် မရှိပါဘူး။

Experimental features တွေကို သုံးတဲ့အခါ — အထူးသဖြင့် libraries တွေ ရေးသားနေချိန်မှာ — သတိထားပါ။ Users တွေက သူတို့ သုံးနေတဲ့အရာထဲမှာ experimental features တွေ ပါနေတယ်ဆိုတာကို သတိမထားမိနိုင်ပါဘူး။ Experimental API တွေ ပြောင်းလဲတဲ့အခါ bugs (သို့) အပြုအမူ ပြောင်းလဲမှုတွေက users တွေကို အံ့အားသင့်စေနိုင်ပါတယ်။ အံ့အားသင့်မှုတွေ မဖြစ်စေဖို့ Experimental feature တစ်ခုကို သုံးဖို့ command-line flag တစ်ခု လိုအပ်နိုင်ပါတယ်။ Experimental features တွေက [warning][] တစ်ခုကိုလည်း ထုတ်လွှတ်နိုင်ပါတယ်။

## တည်ငြိမ်မှု ခြုံငုံ သုံးသပ်ချက် (Stability overview)

## JSON ထုတ်ပေးမှု (JSON output)

`.html` document တိုင်းအတွက် သက်ဆိုင်ရာ `.json` document တစ်ခုစီ ရှိပါတယ်။ ဒါတွေက documentation ကို စားသုံး အသုံးပြုတဲ့ IDEs တွေနဲ့ တခြား utility tools တွေအတွက် ဖြစ်ပါတယ်။

## System calls များနှင့် man pages (System calls and man pages)

System call တစ်ခုကို wrap လုပ်ထားတဲ့ Node.js functions တွေက အဲဒီအကြောင်းကို documentation ထဲမှာ ဖော်ပြထားပါတယ်။ Docs တွေက system call ရဲ့ အလုပ်လုပ်ပုံကို ဖော်ပြတဲ့ သက်ဆိုင်ရာ man pages တွေဆီကို link ချိတ်ပေးပါတယ်။

Unix system calls အများစုမှာ Windows နဲ့ ဆင်တူတဲ့ analogues တွေ ရှိပါတယ်။ ဒါပေမယ့် — အပြုအမူ ကွဲပြားမှုတွေကတော့ မလွှဲမရှောင်သား ရှိနေနိုင်ပါတယ်။

[V8 JavaScript engine]: https://v8.dev/
[semantic versioning]: https://semver.org/
[the contributing guide]: https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md
[the issue tracker]: https://github.com/nodejs/node/issues/new
[warning]: process.md#event-warning
