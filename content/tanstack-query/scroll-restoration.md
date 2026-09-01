---
title: "Scroll Restoration (Scroll ပြန်လည်တည်နေရာချခြင်း)"
description: "TanStack Query မှာ scroll restoration က ဘာကြောင့် out of the box အလုပ်လုပ်လဲ — cache ကြောင့် refetch ကြောင့် ဖြစ်တဲ့ UI resets တွေ ဖယ်ရှားခံရပြီး router ရဲ့ scroll restoration ကို ယုံကြည်စိတ်ချရအောင် လုပ်ပေးနည်း"
order: 32
source: "https://tanstack.com/query/latest/docs/framework/react/guides/scroll-restoration"
status: translated
updated: 2026-09-01
---

အစဉ်အလာအရ — web browser မှာ အရင်က လည်ပတ်ခဲ့ဖူးတဲ့ page တစ်ခုဆီ ပြန်သွားတဲ့အခါ — ဒီ page ကနေ မထွက်ခွာခင် သင်ရှိခဲ့တဲ့ အတိအကျ နေရာကို page က scroll လုပ်ပြထားတာကို တွေ့ရပါလိမ့်မယ်။ ဒါကို **scroll restoration** (scroll ပြန်လည်တည်နေရာချခြင်း) လို့ ခေါ်ပြီး — web applications တွေက client side data fetching ဘက်ကို စတင် ရွေ့လာကတည်းက အနည်းငယ် ဆုတ်ယုတ်မှု ရှိနေခဲ့ပါတယ်။ TanStack Query နဲ့တော့ — အဲဒီလို မဟုတ်တော့ပါဘူး။

TanStack Query က scroll restoration ကို ကိုယ်တိုင် implement မလုပ်ပါဘူး — ဒါပေမယ့် SPA တွေမှာ restoration ပျက်စီးစေတဲ့ အကြီးဆုံး အကြောင်းရင်းတစ်ခုကို ဖယ်ရှားပေးပါတယ်: refetch ကြောင့် ဖြစ်တဲ့ UI resets တွေပါ။ အရင်က fetch လုပ်ထားတဲ့ data ကို cache ထဲမှာ ထိန်းထားခြင်းအားဖြင့် (ဖြစ်နိုင်ရင် `placeholderData` ကိုပါ သုံးပြီး) — page တစ်ခုဆီ ပြန်သွားတဲ့အခါ stable layout နဲ့ ချက်ချင်း render လုပ်နိုင်ပြီး — router က ကိုင်တွယ်တဲ့အခါ scroll restoration ကို ယုံကြည်စိတ်ချရအောင် ဖြစ်စေပါတယ် (ဥပမာ React Router ရဲ့ ScrollRestoration၊ TanStack Router ရဲ့ scroll restoration၊ ဒါမှမဟုတ် history-based ဖြစ်တဲ့ custom solution ငယ်လေးတစ်ခု)။

Out of the box အနေနဲ့ — queries အားလုံးအတွက် (paginated နဲ့ infinite queries တွေ အပါအဝင်) "scroll restoration" က TanStack Query မှာ Just Works™️ ပါ။ ဒါဖြစ်ရတဲ့ အကြောင်းရင်းက — query results တွေက cached ဖြစ်ပြီး — query တစ်ခု render လုပ်တဲ့အခါ synchronously ပြန်ယူနိုင်လို့ပါ။ သင့် queries တွေက လုံလောက်တဲ့ အချိန် (default က ၅ မိနစ်) cache လုပ်ထားခံရပြီး — garbage collected မဖြစ်သရွေ့ — scroll restoration က အချိန်တိုင်း out of the box အလုပ်လုပ်ပါလိမ့်မယ်။
