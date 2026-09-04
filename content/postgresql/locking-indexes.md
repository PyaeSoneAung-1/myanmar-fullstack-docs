---
title: "Locking and Indexes (lock နှင့် index များ)"
description: "B-tree, GiST/SP-GiST, Hash, GIN index တွေရဲ့ locking ယန္တရားများ — concurrency နဲ့ deadlock ဆိုင်ရာ သုံးသပ်ချက်များ"
order: 134
source: "https://www.postgresql.org/docs/current/locking-indexes.html"
status: translated
updated: 2026-09-03
---

## 13.7. Locking and Indexes (lock နှင့် index များ)

PostgreSQL က table data တွေအတွက် nonblocking (ပိတ်ဆို့မှု မရှိ) read/write access ကို ပေးထားပေမယ့် — PostgreSQL မှာ အကောင်အထည်ဖော်ထားတဲ့ index access method (index ဝင်ရောက် လုပ်ဆောင်မှု နည်းလမ်း) တိုင်းအတွက်တော့ nonblocking read/write access ကို လက်ရှိမှာ မပေးရသေးပါဘူး။ Index type အမျိုးမျိုးကို အောက်ပါအတိုင်း ကိုင်တွယ်ပါတယ် —

- **B-tree, GiST နဲ့ SP-GiST index များ** — read/write access အတွက် ကာလတို (short-term) share/exclusive page-level lock တွေကို သုံးပါတယ်။ Index row တစ်ခုချင်းစီကို fetch (ထုတ်ယူ) ဒါမှမဟုတ် insert (ထည့်သွင်း) လုပ်ပြီးတာနဲ့ — lock တွေကို ချက်ချင်း လွှတ်ပေးလိုက်ပါတယ်။ ဒီ index type တွေက deadlock အခြေအနေ မရှိဘဲ အမြင့်ဆုံး concurrency ကို ပေးပါတယ်။
- **Hash index များ** — read/write access အတွက် share/exclusive hash-bucket-level lock (hash bucket တစ်ခုချင်းစီအလိုက် lock) တွေကို သုံးပါတယ်။ Bucket တစ်ခုလုံးကို process (လုပ်ဆောင်) ပြီးမှသာ lock တွေကို လွှတ်ပေးပါတယ်။ Bucket-level lock တွေက index-level lock တွေထက် concurrency ပိုကောင်းပေမယ့် — lock တွေကို index operation တစ်ခုထက် ကြာကြာ ကိုင်ထားရတာကြောင့် — deadlock ဖြစ်နိုင်ခြေ ရှိပါတယ်။
- **GIN index များ** — read/write access အတွက် ကာလတို share/exclusive page-level lock တွေကို သုံးပါတယ်။ Index row တစ်ခုချင်းစီကို fetch ဒါမှမဟုတ် insert လုပ်ပြီးတာနဲ့ — lock တွေကို ချက်ချင်း လွှတ်ပေးပါတယ်။ ဒါပေမယ့် — GIN-indexed တန်ဖိုးတစ်ခုကို insert လုပ်တာက row တစ်ခုအတွက် index key insertion (index key ထည့်သွင်းမှု) အများအပြားကို ထုတ်ပေးလေ့ ရှိတာကြောင့် — GIN က တန်ဖိုးတစ်ခုတည်းရဲ့ insertion အတွက် အလုပ် အတော်အတန် လုပ်ရနိုင်တယ်ဆိုတာ သတိပြုပါ။

လက်ရှိမှာ — B-tree index တွေက concurrent application တွေအတွက် အကောင်းဆုံး performance ကို ပေးပါတယ်။ သူတို့မှာ hash index တွေထက် feature တွေ ပိုများတာကြောင့် — scalar data (တန်ဖိုးတစ်ခုတည်းအနေနဲ့ ကိုယ်စားပြုနိုင်သော data) တွေကို index လုပ်ဖို့ လိုအပ်တဲ့ concurrent application တွေအတွက် အကြံပြုထားတဲ့ index type လည်း ဖြစ်ပါတယ်။ Non-scalar data တွေကို ကိုင်တွယ်ရတဲ့အခါမှာတော့ — B-tree က အသုံးမဝင်တဲ့အတွက် — GiST, SP-GiST ဒါမှမဟုတ် GIN index တွေကို အဲဒီအစား သုံးသင့်ပါတယ်။
