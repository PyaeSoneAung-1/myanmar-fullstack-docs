---
title: "Node.js မှာ Filesystem အမျိုးမျိုးနဲ့ အလုပ်လုပ်ခြင်း"
description: "filesystem တစ်ခုချင်းစီရဲ့ case sensitivity / Unicode form / timestamp resolution စတဲ့ အပြုအမူ ကွာခြားချက်တွေနဲ့ — filesystem အမျိုးမျိုးပေါ်မှာ လုံခြုံစွာ အလုပ်လုပ်နိုင်ဖို့ superset approach နဲ့ normalization ကို comparison အတွက်သာ သုံးခြင်း စတဲ့ best practices"
order: 44
source: "https://nodejs.org/learn/manipulating-files/working-with-different-filesystems"
status: translated
updated: 2026-09-02
---

Node.js က filesystem (ဖိုင်စနစ်) ရဲ့ feature များစွာကို အသုံးပြုနိုင်အောင် လုပ်ပေးထားပါတယ်။ ဒါပေမယ့် filesystem တိုင်းတော့ တူညီတာ မဟုတ်ပါဘူး။ Filesystem အမျိုးမျိုးနဲ့ အလုပ်လုပ်တဲ့အခါ သင့် code ကို ရိုးရှင်းပြီး ဘေးကင်းလုံခြုံအောင် ထားနိုင်ဖို့ အောက်မှာ အကြံပြုထားတဲ့ best practices တွေကို လိုက်နာသင့်ပါတယ်။

## Filesystem တွေရဲ့ အပြုအမူ

Filesystem တစ်ခုနဲ့ အလုပ်မလုပ်ခင် ဦးစွာ သူ ဘယ်လို အပြုအမူ ရှိတယ်ဆိုတာကို သိထားဖို့ လိုပါတယ်။ Filesystem အမျိုးမျိုးဟာ အပြုအမူ ကွဲပြားကြပြီး feature တွေလည်း တစ်ခုနဲ့တစ်ခု ပိုလျှံနည်းပါး ကွာခြားပါတယ် — case sensitivity (စာလုံးအကြီးအသေး ခွဲခြားမှု)၊ case insensitivity (စာလုံးအကြီးအသေး မခွဲခြားမှု)၊ case preservation (စာလုံးအကြီးအသေး မူရင်းအတိုင်း သိမ်းဆည်းမှု)၊ Unicode form preservation (Unicode ပုံစံ မူရင်းအတိုင်း သိမ်းဆည်းမှု)၊ timestamp resolution (timestamp တိုင်းတာရာမှာ အသေးစိတ်ဆုံး ခွဲခြားနိုင်တဲ့ အဆင့်)၊ extended attributes (အပိုဆောင်း attribute များ)၊ inodes (ဖိုင်တစ်ခုစီရဲ့ အချက်အလက်တွေကို သိမ်းဆည်းတဲ့ ဒေတာဖွဲ့စည်းပုံ)၊ Unix permissions (Unix ခွင့်ပြုချက်များ)၊ alternate data streams (အခြားရွေးချယ်နိုင်တဲ့ data stream များ) စသဖြင့် ပါဝင်ပါတယ်။

`process.platform` ကနေ filesystem ရဲ့ အပြုအမူကို မှန်းဆတာကို သတိထားပါ။ ဥပမာ — သင့် program က Darwin ပေါ်မှာ run နေလို့ case-insensitive filesystem (HFS+) နဲ့ အလုပ်လုပ်နေရတယ်လို့ မယူဆပါနဲ့၊ အသုံးပြုသူက case-sensitive filesystem (HFSX) ကို သုံးနေတာလည်း ဖြစ်နိုင်လို့ပါ။ အလားတူပဲ — သင့် program က Linux ပေါ်မှာ run နေလို့ Unix permissions နဲ့ inodes တွေကို ထောက်ပံ့တဲ့ filesystem ပေါ်မှာ အလုပ်လုပ်နေရတယ်လို့လည်း မယူဆပါနဲ့၊ အသုံးပြုသူက external drive၊ USB ဒါမှမဟုတ် network drive တစ်ခုခုပေါ်မှာ ဆိုရင် အဲဒါတွေ မပါနိုင်လို့ပါ။

Operating system ကလည်း filesystem ရဲ့ အပြုအမူကို မှန်းဆဖို့ လွယ်ကူအောင် မလုပ်ပေးတတ်ပါဘူး — ဒါပေမယ့် နည်းလမ်း မရှိဘူးတော့ မဟုတ်ပါဘူး။ သိထားတဲ့ filesystem တွေနဲ့ သူတို့ရဲ့ အပြုအမူတွေ အားလုံးရဲ့ စာရင်းကို သိမ်းထားမယ့်အစား (အဲဒီစာရင်းက ဘယ်တော့မှ ပြည့်စုံမှာ မဟုတ်ပါဘူး) — filesystem ကို probe လုပ် (စမ်းသပ်စစ်ဆေး) ကြည့်ပြီး သူ တကယ် ဘယ်လို အပြုအမူ ရှိတယ်ဆိုတာ သိနိုင်ပါတယ်။ Probe လုပ်ဖို့ လွယ်ကူတဲ့ feature တချို့ ရှိ/မရှိ ဆိုတာက မကြာခဏဆိုသလို probe လုပ်ဖို့ ပိုခက်တဲ့ တခြား feature တွေရဲ့ အပြုအမူကို မှန်းဆဖို့ လုံလောက်ပါတယ်။

သတိရထားရမှာက — အသုံးပြုသူတချို့ဟာ မတူညီတဲ့ filesystem တွေကို working tree ရဲ့ path အမျိုးမျိုးမှာ mount လုပ်ထားနိုင်ပါတယ်။

## Lowest Common Denominator ချဉ်းကပ်နည်းကို ရှောင်ကြဉ်ခြင်း

သင့် program ကို lowest common denominator (အသုံးပြုသူအားလုံးနဲ့ ကိုက်ညီအောင် အနိမ့်ဆုံး ဘုံအဆင့်) filesystem တစ်ခုလို ပြုမူစေချင်စိတ် ဖြစ်လာနိုင်ပါတယ် — filename တွေအားလုံးကို uppercase ဖြစ်အောင် normalize လုပ်တာ၊ filename တွေအားလုံးကို NFC Unicode form ဖြစ်အောင် normalize လုပ်တာ၊ file timestamp တွေအားလုံးကို ဥပမာ 1-second resolution ဖြစ်အောင် normalize လုပ်တာမျိုးတွေပါ။ ဒါက lowest common denominator ချဉ်းကပ်နည်း ဖြစ်ပါတယ်။

ဒါမျိုး မလုပ်ပါနဲ့။ အဲဒီလို လုပ်ရင် အရာအားလုံးမှာ အဲဒီ lowest common denominator ရဲ့ လက္ခဏာတွေနဲ့ အတိအကျ တူညီတဲ့ filesystem တစ်ခုနဲ့ပဲ လုံခြုံစွာ အလုပ်လုပ်နိုင်မှာ ဖြစ်ပါတယ်။ ပိုအဆင့်မြင့်တဲ့ filesystem တွေနဲ့ အသုံးပြုသူတွေ မျှော်လင့်တဲ့အတိုင်း အလုပ်လုပ်နိုင်တော့မှာ မဟုတ်သလို — filename ဒါမှမဟုတ် timestamp collision (တိုက်မိမှု) တွေလည်း ကြုံရမှာ ဖြစ်ပါတယ်။ ရှုပ်ထွေးပြီး အပြန်အလှန် ဆက်နွှယ်နေတဲ့ အဖြစ်အပျက် အတွဲလိုက်တွေကနေတစ်ဆင့် အသုံးပြုသူရဲ့ ဒေတာတွေ ဆုံးရှုံးပျက်စီးဖို့ သေချာသလောက် ဖြစ်ပြီး — ဖြေရှင်းဖို့ မဖြစ်နိုင်သလောက် ခက်ခဲတဲ့ bug တွေကိုပါ ဖန်တီးမိမှာ ဖြစ်ပါတယ်။

နောက်ပိုင်းမှာ 2-second ဒါမှမဟုတ် 24-hour timestamp resolution ပဲ ရှိတဲ့ filesystem တစ်ခုကို ထောက်ပံ့ဖို့ လိုအပ်လာရင် ဘယ်လို လုပ်မလဲ? Unicode standard က အရင်တုန်းက ဖြစ်ခဲ့သလိုပဲ — နည်းနည်း ကွဲပြားတဲ့ normalization algorithm တစ်ခု ထပ်ပါဝင်လာတဲ့အထိ တိုးတက်လာရင်ရော ဘယ်လို လုပ်မလဲ?

Lowest common denominator ချဉ်းကပ်နည်းက "portable" (ပလက်ဖောင်း အမျိုးမျိုးမှာ ရွှေ့သုံးလို့ရတဲ့) system calls တွေကိုပဲ သုံးပြီး portable program တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားတတ်ပါတယ်။ ဒါက program တွေကို ယိုစိမ့်နေပြီး တကယ်တော့ portable မဟုတ်တဲ့ program တွေ ဖြစ်စေပါတယ်။

## Superset ချဉ်းကပ်နည်းကို ကျင့်သုံးခြင်း

သင်ထောက်ပံ့တဲ့ ပလက်ဖောင်းတစ်ခုစီကို အကောင်းဆုံး အသုံးချနိုင်ဖို့ superset (ဖြစ်နိုင်ခြေရှိတဲ့ feature တွေ အားလုံးပါဝင်တဲ့ အစုအဝေး) ချဉ်းကပ်နည်းကို ကျင့်သုံးပါ။ ဥပမာ — portable backup program တစ်ခုက Windows စနစ်တွေကြားမှာ btimes (file ဒါမှမဟုတ် folder တစ်ခုကို ဖန်တီးခဲ့တဲ့ အချိန်) တွေကို မှန်ကန်စွာ sync လုပ်နိုင်ပြီး — Linux စနစ်တွေမှာ btimes ကို ထောက်ပံ့မထားဘူးဆိုရင်တောင် — btimes တွေကို မဖျက်ဆီးသင့်သလို မပြောင်းလဲသင့်ပါဘူး။ အဲဒီ portable backup program တစ်ခုတည်းက Unix permissions တွေကို Linux စနစ်တွေကြားမှာ မှန်ကန်စွာ sync လုပ်နိုင်ပြီး — Windows စနစ်တွေမှာ Unix permissions ကို ထောက်ပံ့မထားဘူးဆိုရင်တောင် — Unix permissions တွေကို မဖျက်ဆီးသင့်သလို မပြောင်းလဲသင့်ပါဘူး။

Filesystem အမျိုးမျိုးကို ကိုင်တွယ်ဖို့ သင့် program ကို ပိုအဆင့်မြင့်တဲ့ filesystem တစ်ခုလို ပြုမူစေပါ။ ဖြစ်နိုင်ခြေရှိတဲ့ feature အားလုံးရဲ့ superset ကို ထောက်ပံ့ပါ — case-sensitivity၊ case-preservation၊ Unicode form sensitivity၊ Unicode form preservation၊ Unix permissions၊ အနုစိတ်အဆင့် မြင့်မားတဲ့ nanosecond timestamps၊ extended attributes စသဖြင့်ပါ။

သင့် program ထဲမှာ case-preservation ရှိပြီဆိုရင် — case-insensitive filesystem တစ်ခုနဲ့ ဆက်သွယ်ဖို့ လိုအပ်လာတဲ့အခါ case-insensitivity ကို အမြဲတမ်း ထပ်ဖြည့်သုံးလို့ ရနိုင်ပါတယ်။ ဒါပေမယ့် သင့် program ထဲမှာ case-preservation ကို မထည့်ထားဘူးဆိုရင်တော့ case-preserving filesystem တစ်ခုနဲ့ လုံခြုံစွာ ဆက်သွယ်လို့ မရနိုင်ပါဘူး။ Unicode form preservation နဲ့ timestamp resolution preservation အတွက်လည်း အလားတူပါပဲ။

Filesystem တစ်ခုက filename ကို lowercase ရော uppercase ရော ရောနှောထားတဲ့ ပုံစံနဲ့ ပေးလိုက်ရင် — ပေးလိုက်တဲ့ case အတိုင်း အတိအကျ ထိန်းထားပါ။ Filesystem တစ်ခုက filename ကို Unicode form ရောနှောထားတဲ့အတိုင်း ဒါမှမဟုတ် NFC ဒါမှမဟုတ် NFD (ဒါမှမဟုတ် NFKC ဒါမှမဟုတ် NFKD) ပုံစံနဲ့ ပေးလိုက်ရင် — ပေးလိုက်တဲ့ byte sequence အတိုင်း အတိအကျ ထိန်းထားပါ။ Filesystem တစ်ခုက timestamp ကို millisecond အဆင့်နဲ့ ပေးလိုက်ရင် — timestamp ကို millisecond resolution အတိုင်း ထိန်းထားပါ။

အဆင့်နိမ့်တဲ့ filesystem တစ်ခုနဲ့ အလုပ်လုပ်တဲ့အခါ — သင့် program run နေတဲ့ filesystem ရဲ့ အပြုအမူအရ လိုအပ်တဲ့ comparison functions တွေနဲ့အတူ သင့်လျော်သလို downsample (အနုစိတ်အဆင့် လျှော့ချ) လုပ်လို့ အမြဲ ရပါတယ်။ Filesystem က Unix permissions တွေကို မထောက်ပံ့ဘူးဆိုတာ သိရင် — သင်ရေးလိုက်တဲ့ Unix permissions အတိုင်း ပြန်ဖတ်ရမယ်လို့ မမျှော်လင့်သင့်ပါဘူး။ Filesystem က case ကို မထိန်းသိမ်းဘူးဆိုတာ သိရင် — သင့် program က `abc` လို့ ဖန်တီးလိုက်ပေမယ့် directory listing ထဲမှာ `ABC` လို့ တွေ့ရနိုင်တာကို ပြင်ဆင်ထားသင့်ပါတယ်။ ဒါပေမယ့် filesystem က case ကို ထိန်းသိမ်းတယ်ဆိုတာ သိရင်တော့ — file rename တွေကို ရှာဖွေတွေ့ရှိတဲ့အခါ ဒါမှမဟုတ် filesystem က case-sensitive ဖြစ်တဲ့အခါ — `ABC` ကို `abc` နဲ့ မတူညီတဲ့ filename တစ်ခုအနေနဲ့ သတ်မှတ်သင့်ပါတယ်။

## Case Preservation (စာလုံးအကြီးအသေး မူရင်းထိန်းသိမ်းမှု)

`test/abc` ဆိုတဲ့ directory တစ်ခုကို ဖန်တီးပြီး — တစ်ခါတစ်ရံ `fs.readdir('test')` က `['ABC']` ဆိုပြီး ပြန်ပေးတာကို တွေ့ရင် အံ့ဩသွားနိုင်ပါတယ်။ ဒါ Node ရဲ့ bug မဟုတ်ပါဘူး။ Node က filename ကို filesystem ထဲမှာ သိမ်းထားတဲ့အတိုင်း ပြန်ပေးတာဖြစ်ပြီး — filesystem တိုင်းက case-preservation ကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ Filesystem တချို့က filename အားလုံးကို uppercase (ဒါမှမဟုတ် lowercase) အဖြစ် ပြောင်းလဲ သိမ်းဆည်းပါတယ်။

## Unicode Form Preservation (Unicode ပုံစံ မူရင်းထိန်းသိမ်းမှု)

Case preservation နဲ့ Unicode form preservation တို့ဟာ သဘောတရား ဆင်တူပါတယ်။ Unicode form ကို ဘာကြောင့် ထိန်းသိမ်းသင့်လဲဆိုတာ နားလည်ဖို့ — case ကို ဘာကြောင့် ထိန်းသိမ်းသင့်လဲဆိုတာကို အရင်ဦးဆုံး သေချာ နားလည်ထားပါ။ Unicode form preservation ကလည်း မှန်မှန်ကန်ကန် နားလည်လိုက်ရင် အဲဒီလောက်ပဲ ရိုးရှင်းပါတယ်။

Unicode ဟာ စာလုံးတူတွေကိုတောင် byte sequence အမျိုးမျိုးနဲ့ encode လုပ်နိုင်ပါတယ်။ String အများကြီးဟာ ကြည့်ရတာ တူနေပေမယ့် — byte sequence ချင်း ကွဲပြားနိုင်ပါတယ်။ UTF-8 strings တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — သင့်ရဲ့ မျှော်လင့်ချက်တွေက Unicode အလုပ်လုပ်ပုံနဲ့ ကိုက်ညီဖို့ သတိထားပါ။ UTF-8 character တိုင်းက byte တစ်ခုတည်းနဲ့ပဲ encode လုပ်မယ်လို့ မမျှော်လင့်သလိုပဲ — လူမျက်စိနဲ့ ကြည့်ရတာ တူနေတဲ့ UTF-8 strings အများကြီးမှာ byte representation ချင်း တူညီမယ်လို့လည်း မမျှော်လင့်သင့်ပါဘူး။ ဒီလို မျှော်လင့်ချက်မျိုးက ASCII အတွက်တော့ ထားနိုင်ပေမယ့် — UTF-8 အတွက်တော့ မထားနိုင်ပါဘူး။

`test/café` ဆိုတဲ့ directory တစ်ခုကို ဖန်တီးပြီး (NFC Unicode form ဖြစ်ပြီး byte sequence `<63 61 66 c3 a9>` နဲ့ `string.length === 5`) — တစ်ခါတစ်ရံ `fs.readdir('test')` က `['café']` (NFD Unicode form ဖြစ်ပြီး byte sequence `<63 61 66 65 cc 81>` နဲ့ `string.length === 6`) ဆိုပြီး ပြန်ပေးတာကို တွေ့ရင် အံ့ဩသွားနိုင်ပါတယ်။ ဒါ Node ရဲ့ bug မဟုတ်ပါဘူး။ Node.js က filename ကို filesystem ထဲမှာ သိမ်းထားတဲ့အတိုင်း ပြန်ပေးတာဖြစ်ပြီး — filesystem တိုင်းက Unicode form preservation ကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။

ဥပမာ HFS+ ကတော့ filename အားလုံးကို NFD form နဲ့ အမြဲလိုလို တူညီတဲ့ ပုံစံတစ်ခုအဖြစ် normalize လုပ်ပါတယ်။ HFS+ က NTFS ဒါမှမဟုတ် EXT4 တို့လို ပြုမူမယ်လို့ မမျှော်လင့်ပါနဲ့ — အပြန်အလှန်အားဖြင့်လည်း အလားတူပါပဲ။ Filesystem တွေကြားက Unicode ကွာခြားချက်တွေကို ဖုံးကွယ်ဖို့ leaky abstraction (အတွင်းပိုင်း ချို့ယွင်းချက်တွေ ပေါက်ကြားနေတဲ့ abstraction) တစ်ခုအနေနဲ့ normalization ကို သုံးပြီး ဒေတာတွေကို အမြဲတမ်း ပြောင်းလဲဖို့ မကြိုးစားပါနဲ့။ အဲဒါက ဘာပြဿနာမှ မဖြေရှင်းဘဲ ပြဿနာတွေကိုပဲ ဖန်တီးမိစေမှာ ဖြစ်ပါတယ်။ ဒါထက် Unicode form ကို ထိန်းသိမ်းပြီး normalization ကို comparison function တစ်ခုအနေနဲ့သာ သုံးပါ။

## Unicode Form Insensitivity (Unicode ပုံစံ အာရုံမခံနိုင်မှု)

Unicode form insensitivity နဲ့ Unicode form preservation တို့ဟာ filesystem ရဲ့ အပြုအမူ နှစ်မျိုး ဖြစ်ပြီး — တစ်ခုနဲ့တစ်ခု မကြာခဏ ရောထွေးတတ်ပါတယ်။ Case-insensitivity ကို တစ်ခါတစ်ရံမှာ filename တွေ သိမ်းတဲ့အခါရော ပို့လွှတ်တဲ့အခါမှာရော filename တွေကို uppercase အဖြစ် အမြဲတမ်း normalize လုပ်ခြင်းအားဖြင့် မှားယွင်းစွာ အကောင်အထည် ဖော်ထားတတ်သလိုပဲ — Unicode form insensitivity ကိုလည်း တစ်ခါတစ်ရံမှာ filename တွေ သိမ်းတဲ့အခါရော ပို့လွှတ်တဲ့အခါမှာရော filename တွေကို Unicode form တစ်မျိုးတည်း (HFS+ ရဲ့ ကိစ္စမှာဆိုရင် NFD) အဖြစ် အမြဲတမ်း normalize လုပ်ခြင်းအားဖြင့် မှားယွင်းစွာ အကောင်အထည် ဖော်ထားတတ်ပါတယ်။ Unicode normalization ကို comparison အတွက်သာ သုံးခြင်းအားဖြင့် — Unicode form preservation ကို မစွန့်လွှတ်ဘဲ Unicode form insensitivity ကို အကောင်အထည် ဖော်နိုင်ပြီး အဲဒါက ပိုကောင်းတဲ့ နည်းလမ်း ဖြစ်ပါတယ်။

## Unicode Form အမျိုးမျိုး နှိုင်းယှဉ်ခြင်း

Node.js က UTF-8 string တစ်ခုကို NFC ဒါမှမဟုတ် NFD အဖြစ် normalize လုပ်ဖို့ သုံးလို့ရတဲ့ `string.normalize('NFC' / 'NFD')` ကို ပေးထားပါတယ်။ ဒီ function ကနေ ထွက်လာတဲ့ ရလဒ်ကို ဘယ်တော့မှ သိမ်းဆည်းမထားသင့်ဘဲ — UTF-8 string နှစ်ခုက အသုံးပြုသူအတွက် ကြည့်ရတာ တူညီမလားဆိုတာ စစ်ဆေးဖို့ comparison function တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့သာ သုံးသင့်ပါတယ်။

`string1.normalize('NFC') === string2.normalize('NFC')` ဒါမှမဟုတ် `string1.normalize('NFD') === string2.normalize('NFD')` ကို သင့်ရဲ့ comparison function အနေနဲ့ သုံးနိုင်ပါတယ်။ ဘယ် form ကို သုံးလဲဆိုတာ အရေးမကြီးပါဘူး။

Normalization က မြန်ဆန်ပါတယ် — ဒါပေမယ့် string တစ်ခုတည်းကို အကြိမ်ကြိမ် normalize လုပ်နေရတာကို ရှောင်ဖို့ သင့် comparison function ထဲကို cache (ကက်ရှ်) တစ်ခုရဲ့ အကူအညီနဲ့ ထည့်သွင်းချင်စိတ် ဖြစ်လာနိုင်ပါတယ်။ String က cache ထဲမှာ မရှိဘူးဆိုရင် — normalize လုပ်ပြီး cache ထဲ ထည့်ပါ။ Cache ကို သိမ်းဆည်းထားတာ ဒါမှမဟုတ် ထာဝရ မထားမိဖို့ သတိထားပါ — cache အနေနဲ့သာ သုံးပါ။

မှတ်ချက် — `normalize()` ကို သုံးဖို့အတွက် သင့်ရဲ့ Node.js version မှာ ICU ပါဝင်ဖို့ လိုအပ်ပါတယ် (မပါရင် `normalize()` က မူရင်း string ကိုပဲ ပြန်ပေးမှာ ဖြစ်ပါတယ်)။ Node.js ရဲ့ နောက်ဆုံးထွက် version ကို website ကနေ download လုပ်မယ်ဆိုရင် ICU ပါဝင်မှာ ဖြစ်ပါတယ်။

## Timestamp Resolution (timestamp တိုင်းတာမှု အနုစိတ်အဆင့်)

File တစ်ခုရဲ့ `mtime` (နောက်ဆုံး ပြုပြင်ခဲ့တဲ့ အချိန်) ကို `1444291759414` (millisecond resolution) အနေနဲ့ သတ်မှတ်လိုက်ပြီး — တစ်ခါတစ်ရံ `fs.stat` က mtime အသစ်ကို `1444291759000` (1-second resolution) ဒါမှမဟုတ် `1444291758000` (2-second resolution) အနေနဲ့ ပြန်ပေးတာကို တွေ့ရင် အံ့ဩသွားနိုင်ပါတယ်။ ဒါ Node ရဲ့ bug မဟုတ်ပါဘူး။ Node.js က timestamp ကို filesystem ထဲမှာ သိမ်းထားတဲ့အတိုင်း ပြန်ပေးတာဖြစ်ပြီး — filesystem တိုင်းက nanosecond၊ millisecond ဒါမှမဟုတ် 1-second timestamp resolution တွေကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ Filesystem တချို့မှာ အထူးသဖြင့် atime timestamp အတွက်ဆိုရင် resolution က အလွန်ပင် ကြမ်းတတ်ပါတယ် — ဥပမာ FAT filesystem တချို့မှာ 24 နာရီ ကြားကာလအထိ ရှိနိုင်ပါတယ်။

## Normalization ကြောင့် Filename နဲ့ Timestamp ဒေတာတွေ မပျက်စီးစေရန်

Filename တွေနဲ့ timestamp တွေဟာ အသုံးပြုသူရဲ့ ဒေတာ ဖြစ်ပါတယ်။ အသုံးပြုသူရဲ့ file data တွေကို uppercase အဖြစ် အလိုအလျောက် ပြန်ရေးတာ ဒါမှမဟုတ် `CRLF` line endings တွေကို `LF` အဖြစ် normalize လုပ်တာမျိုး ဘယ်တော့မှ မလုပ်သလိုပဲ — case / Unicode form / timestamp normalization တွေကနေတစ်ဆင့် filename ဒါမှမဟုတ် timestamp တွေကို ပြောင်းလဲခြင်း၊ ဝင်ရောက်စွက်ဖက်ခြင်း၊ ပျက်စီးစေခြင်းတွေ ဘယ်တော့မှ မလုပ်သင့်ပါဘူး။ Normalization ကို comparison အတွက်သာ အသုံးပြုသင့်ပြီး — ဒေတာ ပြောင်းလဲဖို့အတွက် ဘယ်တော့မှ မသုံးသင့်ပါဘူး။

Normalization ဆိုတာ တကယ်တော့ lossy (အချက်အလက် တချို့ ဆုံးရှုံးစေတဲ့) hash code တစ်ခုပါ။ သီးခြား equivalence အမျိုးအစားတွေကို စစ်ဆေးဖို့ သုံးနိုင်ပါတယ် (ဥပမာ — byte sequence တွေ ကွဲပြားနေပေမယ့် string အများကြီး ကြည့်ရတာ တူညီနေသလားဆိုတာ) — ဒါပေမယ့် တကယ့် ဒေတာအစား အစားထိုးဖို့တော့ ဘယ်တော့မှ မသုံးနိုင်ပါဘူး။ သင့် program က filename နဲ့ timestamp ဒေတာတွေကို မူလအတိုင်း ထပ်ဆင့် ပေးပို့သင့်ပါတယ်။

သင့် program က NFC (ဒါမှမဟုတ် သူကြိုက်နှစ်သက်တဲ့ Unicode form ပေါင်းစပ်မှု ဘယ်ဟာမဆို) ပုံစံနဲ့ ဒါမှမဟုတ် lowercase ဒါမှမဟုတ် uppercase filename တွေနဲ့ ဒါမှမဟုတ် 2-second resolution timestamp တွေနဲ့ ဒေတာအသစ်တွေကို ဖန်တီးနိုင်ပါတယ် — ဒါပေမယ့် case / Unicode form / timestamp normalization တွေကို အတင်းအကျပ် ကျင့်သုံးပြီး ရှိပြီးသား အသုံးပြုသူ ဒေတာတွေကိုတော့ မပျက်စီးစေသင့်ပါဘူး။ ဒါထက် superset ချဉ်းကပ်နည်းကို ကျင့်သုံးပြီး — သင့် program ထဲမှာ case၊ Unicode form နဲ့ timestamp resolution တွေကို ထိန်းသိမ်းပါ။ အဲဒီလိုဆိုရင် — အဲဒီအတိုင်း ပြုမူတဲ့ filesystem တွေနဲ့ လုံခြုံစွာ အလုပ်လုပ်နိုင်မှာ ဖြစ်ပါတယ်။

## Normalization Comparison Functions တွေကို သင့်လျော်စွာ အသုံးပြုခြင်း

Case / Unicode form / timestamp comparison functions တွေကို သင့်လျော်စွာ သုံးဖို့ သေချာပါစေ။ Case-sensitive filesystem တစ်ခုပေါ်မှာ အလုပ်လုပ်နေရင် case-insensitive filename comparison function ကို မသုံးပါနဲ့။ Unicode form sensitive filesystem တစ်ခုပေါ်မှာ အလုပ်လုပ်နေရင် (ဥပမာ — NFC ရော NFD ရော ဒါမှမဟုတ် Unicode form ရောနှောထားတာတွေကိုပါ ထိန်းသိမ်းတဲ့ NTFS နဲ့ Linux filesystem အများစု) Unicode form insensitive comparison function ကို မသုံးပါနဲ့။ Nanosecond timestamp resolution filesystem တစ်ခုပေါ်မှာ အလုပ်လုပ်နေရင် timestamp တွေကို 2-second resolution နဲ့ နှိုင်းယှဉ်မနေပါနဲ့။

## Comparison Functions ကွာခြားချက် အနည်းငယ်အတွက် ပြင်ဆင်ထားခြင်း

သင့်ရဲ့ comparison functions တွေက filesystem ရဲ့ functions တွေနဲ့ ကိုက်ညီဖို့ သတိထားပါ (ဒါမှမဟုတ် ဖြစ်နိုင်ရင် filesystem ကို probe လုပ်ပြီး သူ တကယ် ဘယ်လို နှိုင်းယှဉ်မလဲ ကြည့်ပါ)။ ဥပမာ — case-insensitivity ဆိုတာ ရိုးရှင်းတဲ့ `toLowerCase()` နှိုင်းယှဉ်မှုထက် ပိုရှုပ်ထွေးပါတယ်။ တကယ်တော့ `toUpperCase()` က `toLowerCase()` ထက် များသောအားဖြင့် ပိုကောင်းပါတယ် (နိုင်ငံခြား ဘာသာစကား character တချို့ကို ကွဲပြားစွာ ကိုင်တွယ်လို့ ဖြစ်ပါတယ်)။ ဒါပေမယ့် ဒီထက်ပိုကောင်းတာကတော့ filesystem ကို probe လုပ်တာပါ — filesystem တိုင်းမှာ ကိုယ်ပိုင် case comparison table ကို အလိုအလျောက် ထည့်သွင်းထားလို့ ဖြစ်ပါတယ်။

ဥပမာအနေနဲ့ — Apple ရဲ့ HFS+ က filename တွေကို NFD form အဖြစ် normalize လုပ်ပါတယ် — ဒါပေမယ့် အဲဒီ NFD form က တကယ်တော့ လက်ရှိ NFD form ရဲ့ အဟောင်းဗားရှင်း ဖြစ်ပြီး — နောက်ဆုံး Unicode standard ရဲ့ NFD form နဲ့ တစ်ခါတစ်ရံ နည်းနည်းလေး ကွဲပြားနိုင်ပါတယ်။ HFS+ ရဲ့ NFD က Unicode ရဲ့ NFD နဲ့ အချိန်တိုင်း အတိအကျ တူညီမယ်လို့ မမျှော်လင့်ပါနဲ့။

## ဆက်ဖတ်ရန်

- [File System](/docs/nodejs/file-system) — `fs` module နဲ့ file operations တွေ
- [Node.js File Paths](/docs/nodejs/nodejs-file-paths) — path တွေနဲ့ အလုပ်လုပ်ခြင်း (join, resolve, normalize)
- [Node.js file stats](/docs/nodejs/file-stats) — file stats (ဖိုင်အချက်အလက်များ) စစ်ဆေးခြင်း
- [Node.js မှာ Folders တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/nodejs/working-with-folders) — folder operations တွေ
