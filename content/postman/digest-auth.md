---
title: "Digest Auth ဖြင့် authentication ပြုလုပ်ခြင်း (Authenticate with Digest Access Authentication)"
description: "Digest access authentication ဆိုတာ ဘာလဲ — Postman မှာ Digest Auth configure လုပ်နည်း, advanced configuration fields (realm, nonce, algorithm, qop, nonce count, client nonce, opaque) အကြောင်း"
order: 35
source: "https://learning.postman.com/docs/use/send-requests/authorization/digest-auth/"
status: translated
updated: 2026-09-02
---

Digest auth နဲ့ဆိုရင် — client က API ဆီကို ပထမဆုံး request တစ်ခု ပို့လိုက်ပြီး server က အသေးစိတ်တွေနဲ့ ပြန်ဖြေပါတယ်။ Response details တွေထဲမှာ — တစ်ခါပဲ သုံးလို့ရတဲ့ နံပါတ် (nonce) တစ်ခု, realm value တစ်ခု နဲ့ `401 Unauthorized` response တစ်ခု ပါဝင်ပါတယ်။ အဲဒီနောက် — ပထမ request ကနေ ရလာတဲ့ server data တွေနဲ့ ပေါင်းစပ်ထားတဲ့ username နဲ့ password အပါအဝင် — encrypt လုပ်ထားတဲ့ data array တစ်ခုကို ပြန်ပို့ပါတယ်။ Server က ဒီ data တွေကို သုံးပြီး encrypt လုပ်ထားတဲ့ string တစ်ခု generate လုပ်ပြီး — ကိုယ့်ဆီကနေ ပို့လိုက်တာနဲ့ တိုက်စစ်ပြီး request ကို authenticate လုပ်ပါတယ်။

Request တစ်ခုရဲ့ **Authorization** tab ထဲမှာ — **Auth Type** dropdown list ကနေ **Digest Auth** ကို ရွေးပါ။ Authentication request ရဲ့ အဆင့်နှစ်ဆင့်လုံးအတွက် fields တွေကို Postman က ပြသပေးပါတယ်။ ပထမ request ကနေ server ပြန်ပို့လိုက်တဲ့ data တွေကို သုံးပြီး — **Advanced configuration** section ထဲက ဒုတိယ request အတွက် fields တွေကို အလိုအလျောက် update လုပ်ပေးပါတယ်။ Postman ကို ဒီ flow အလိုအလျောက် လုပ်နိုင်စေဖို့ — **Username** နဲ့ **Password** values တွေ (ဒါမှမဟုတ် [variables](/docs/use/send-requests/variables/variables-intro/)) ရိုက်ထည့်ပါ။ ဒါတွေကို ဒုတိယ request နဲ့အတူ ပို့ပေးပါလိမ့်မယ်။

Postman က data တွေကို အလိုအလျောက် extract မလုပ်စေချင်ရင် — **Yes, disable retrying the request** ကို ရွေးပါ။ ဒါကို ရွေးလိုက်ရင် — advanced fields တွေကို ကိုယ်တိုင် ဖြည့်ပြီး request တစ်ခုချင်းစီကို manual အနေနဲ့ run လုပ်ရပါလိမ့်မယ်။

**Advanced configuration** section ထဲက fields တွေ သတ်မှတ်တာက optional ပါ။ ကိုယ့်ရဲ့ ပထမ request run လုပ်တဲ့အခါ — ဒီ fields တွေထဲကို default values တွေကို Postman က အလိုအလျောက် ဖြည့်ပေးပါတယ်။

* **Realm** — Server က `WWW-Authenticate` response header ထဲမှာ သတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။
* **Nonce** — Server က `WWW-Authenticate` response header ထဲမှာ သတ်မှတ်ပေးတဲ့ သီးခြား (unique) string တစ်ခုပါ။
* **Algorithm** — Digest နဲ့ checksum တစ်ခု ထုတ်လုပ်ဖို့ သုံးတဲ့ algorithms တစ်စုံကို ဖော်ပြတဲ့ string တစ်ခုပါ။ Postman က `MD5` နဲ့ `SHA` algorithms တွေကို ပံ့ပိုးပေးပါတယ်။
* **qop** — Message ကို သက်ရောက်တဲ့ quality of protection ပါ။ Value က server က `WWW-Authenticate` response header ထဲမှာ သတ်မှတ်ထားတဲ့ options တွေထဲက တစ်ခုဖြစ်ရပါမယ်။
* **Nonce Count** — ဒီ request ထဲမှာ nonce value နဲ့အတူ client က ပို့လိုက်တဲ့ requests အရေအတွက်ရဲ့ hexadecimal count ပါ (လက်ရှိ request အပါအဝင်)။
* **Client Nonce** — Client က ပေးတဲ့ opaque quoted string value တစ်ခုပါ။ Chosen plaintext attacks တွေကို ရှောင်ဖို့, mutual authentication ပေးဖို့ နဲ့ message integrity protection အနည်းငယ် ပေးဖို့ — client ရော server ရော ဒါကို သုံးပါတယ်။
* **Opaque** — Server က `WWW-Authenticate` response header ထဲမှာ သတ်မှတ်ပေးတဲ့ data string တစ်ခုဖြစ်ပြီး — တူညီတဲ့ protection space ထဲက URIs တွေမှာ မပြောင်းလဲဘဲ သုံးပါတယ်။
