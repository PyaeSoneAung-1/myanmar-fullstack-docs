---
title: "Express Utilities (utility function module များ)"
description: "Express.js နဲ့ Node.js အတွက် အသုံးဝင်တဲ့ utility function module တွေ — cookies, CSRF protection, URL parsing, routing, file streaming စတာတွေအတွက် pillarjs organization က module များ"
order: 26
source: "https://expressjs.com/en/resources/utils.html"
status: translated
updated: 2026-09-03
---

အောက်ဖော်ပြပါ utility function module တွေက — [pillarjs](https://github.com/pillarjs) GitHub organization ထဲမှာ ရှိပြီး ယေဘုယျအားဖြင့် အသုံးဝင်နိုင်ပါတယ်။

| Utility Modules                                             | ဖော်ပြချက်                                                                                                                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cookies](https://www.npmjs.com/package/cookies)            | Keygrip ကို သုံးပြီး tamper လုပ်မရအောင် လက်မှတ်ထိုး (sign) လို့ရတဲ့ HTTP(S) cookies တွေကို ယူခြင်း/သတ်မှတ်ခြင်း ပြုလုပ်ပေးပါတယ်။ Node.js HTTP library နဲ့ တွဲသုံးလို့ရသလို — Express middleware အဖြစ်လည်း သုံးလို့ရပါတယ်။ |
| [csrf](https://www.npmjs.com/package/csrf)                  | CSRF token ဖန်တီးခြင်းနဲ့ စစ်ဆေးခြင်းရဲ့ နောက်ကွယ်က logic ပါဝင်ပါတယ်။ ကိုယ်ပိုင် CSRF middleware ဖန်တီးဖို့ ဒီ module ကို သုံးနိုင်ပါတယ်။                                  |
| [finalhandler](https://www.npmjs.com/package/finalhandler)  | HTTP request တစ်ခုကို response ပြန်ဖို့ နောက်ဆုံး အဆင့်အနေနဲ့ invoke လုပ်ရမယ့် function တစ်ခုပါ။                                                                       |
| [parseurl](https://www.npmjs.com/package/parseurl)          | Caching ပါဝင်တဲ့အနေနဲ့ URL တစ်ခုကို parse လုပ်ပေးပါတယ်။                                                                                                             |
| [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) | Express ပုံစံ path string တွေ (ဥပမာ `/user/:name`) ကို regular expression အဖြစ် ပြောင်းပေးပါတယ်။                                                               |
| [resolve-path](https://www.npmjs.com/package/resolve-path)  | Relative path တစ်ခုကို root path နဲ့ ယှဉ်ပြီး validation ပါဝင်တဲ့အနေနဲ့ ဖြေရှင်း (resolve) ပေးပါတယ်။                                                              |
| [router](https://www.npmjs.com/package/router)              | ရိုးရှင်းတဲ့ middleware ပုံစံ router တစ်ခုပါ။                                                                                                                         |
| [send](https://www.npmjs.com/package/send)                  | File တွေကို HTTP response အဖြစ် stream လုပ်ပေးတဲ့ library — partial responses (ranges), conditional-GET negotiation နဲ့ granular events တွေကို ထောက်ပံ့ပေးပါတယ်။ |

နောက်ထပ် low-level HTTP နဲ့ ဆိုင်တဲ့ module တွေအတွက် — [jshttp](https://github.com/jshttp) ကို ကြည့်ပါ။
