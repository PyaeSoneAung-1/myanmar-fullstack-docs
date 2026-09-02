---
title: "Postman scripts တွေထဲမှာ cookies တွေကို ဝင်ရောက်ကြည့်ရှုခြင်း (Access cookies in Postman scripts)"
description: "pm.cookies methods နဲ့ pm.cookies.jar() methods သုံးပြီး cookies တွေကို access လုပ်ခြင်း/ပြုပြင်ခြင်း — has, get, toObject, set, getAll, unset, clear"
order: 86
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-cookies/"
status: translated
updated: 2026-09-02
---

Request URL ထဲက domain အတွက် cookies တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ `pm.cookies` methods တွေကို သုံးနိုင်ပါတယ်။ သတ်မှတ်ထားတဲ့ domain တစ်ခုခုအတွက် cookies တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ `pm.cookies.jar()` methods တွေကိုလည်း သုံးနိုင်ပါတယ်။

Postman Collection SDK ထဲမှာ [cookies](https://www.postmanlabs.com/postman-collection/Cookie.html) နဲ့ [cookie lists](https://www.postmanlabs.com/postman-collection/CookieList.html) တွေ သုံးခြင်းအကြောင်း လေ့လာနိုင်ပါတယ်။

## pm.cookies methods

Request လုပ်လိုက်တဲ့ domain အတွက် cookies တွေကို access လုပ်ပြီး ကိုင်တွယ်ဖို့ သင့် scripts တွေထဲမှာ `pm.cookies` methods တွေကို သုံးပါ။

### pm.cookies.has(cookieName:String)

Request လုပ်လိုက်တဲ့ domain အတွက် သတ်မှတ်ထားတဲ့ နာမည်နဲ့ cookie တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။

အောက်ပါတို့ထဲက တစ်ခုကို ပြန်ပေးပါတယ်:

* `true` — Cookie က request လုပ်လိုက်တဲ့ domain အတွက် ရှိနေပါတယ်။
* `false` — Cookie က request လုပ်လိုက်တဲ့ domain အတွက် မရှိပါဘူး။

### pm.cookies.get(cookieName:String)

Request လုပ်လိုက်တဲ့ domain အတွက် သတ်မှတ်ထားတဲ့ cookie ရဲ့ တန်ဖိုးကို ရယူပါတယ်။

Cookie ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

Method ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်မှာ `+` operator ကို သုံးပြီး cookie တစ်ခုရဲ့ တန်ဖိုးကို string တစ်ခုနဲ့ ဆက်စပ်နိုင်ပါတယ်။

### pm.cookies.toObject()

Request လုပ်လိုက်တဲ့ domain အတွက် cookies တွေအားလုံးနဲ့ ၎င်းတို့ရဲ့ တန်ဖိုးတွေကို ရယူပါတယ်။

Cookies တွေအားလုံးနဲ့ ၎င်းတို့ရဲ့ တန်ဖိုးတွေကို object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

## pm.cookies.jar methods

Domain တစ်ခုကို သတ်မှတ်ပြီး ၎င်းရဲ့ cookies တွေကို access လုပ်ကာ ကိုင်တွယ်ဖို့ `pm.cookies.jar()` methods တွေကို သုံးပါ။ ဒီ methods တွေကို သင့် scripts တွေကနေ သုံးနိုင်ဖို့ — အရင်ဆုံး [domain တစ်ခုကို allowlist ထဲ ထည့်ရပါမယ်](/docs/postman/cookies)။

Function calls တွေက asynchronously run လုပ်ပါတယ်။ Functions တွေ အစီအစဉ်ကျ run ဖို့ callback function တစ်ခုကို သုံးပါ။

### pm.cookies.jar().set(URL:String, cookieName:String, cookieValue:String, callback(error, cookie))

Domain တစ်ခုအတွက် သတ်မှတ်ထားတဲ့ နာမည်နဲ့ တန်ဖိုးရှိတဲ့ cookie တစ်ခုကို သတ်မှတ်ပါတယ်။

ဥပမာ:

```js
pm.cookies.jar().set("example.com", "session-id", "abc123", (error, cookie) => {
    if (error) {
      console.error(`An error occurred: ${error}`);
      } else {
        console.log(`Cookie saved: ${cookie}`);
        }
});
```

### pm.cookies.jar().set(URL:String, \{ name:String, value:String, httpOnly:Bool }, callback(error, cookie))

[Cookie](https://www.postmanlabs.com/postman-collection/Cookie.html) object တစ်ခုကို သုံးပြီး cookie တစ်ခုကို သတ်မှတ်ပါတယ်။

ဥပမာ:

```js
var Cookie = require('postman-collection').Cookie,
    myCookie = new Cookie({
        name: 'session-id',
        value: 'abc123e',
        httpOnly: true
    });

pm.cookies.jar().set("example.com", myCookie, (error, cookie) => {
    if (error) {
      console.error(`An error occurred: ${error}`);
      } else {
        console.log(`Cookie saved: ${cookie}`);
        }
});
```

### pm.cookies.jar().get(URL:String, cookieName:String, callback(error, value))

သတ်မှတ်ထားတဲ့ domain မှာ ရှိတဲ့ cookie တစ်ခုရဲ့ တန်ဖိုးကို ရယူပါတယ် — callback function ထဲမှာ ရနိုင်ပါတယ်။

Cookie ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

### pm.cookies.jar().getAll(URL:String, callback(error, cookies))

သတ်မှတ်ထားတဲ့ domain တစ်ခုအတွက် cookies တွေအားလုံးကို ရယူပါတယ် — callback function ထဲမှာ ရနိုင်ပါတယ်။

Cookies တွေအားလုံးရဲ့ နာမည်နဲ့ တန်ဖိုးတွေကို ပြန်ပေးပါတယ်။

### pm.cookies.jar().unset(URL:String, cookieName:String, callback(error))

Domain တစ်ခုကနေ သတ်မှတ်ထားတဲ့ cookie တစ်ခုကို ဖယ်ရှားပါတယ်။

### pm.cookies.jar().clear(URL:String, callback(error))

သတ်မှတ်ထားတဲ့ domain ကနေ cookies တွေအားလုံးကို ရှင်းလင်းပါတယ်။

အောက်ပါ ဥပမာက cookies တွေအားလုံးကို ရှင်းပြီးမှ — သတ်မှတ်ထားတဲ့ domain တစ်ခုအတွက် cookie တစ်ခုကို အစီအစဉ်ကျ သတ်မှတ်ပါတယ်:

```js
pm.cookies.jar().clear("example.com", (error) => {
    pm.cookies.jar().set("example.com", "session-id", "jkl456p", (error, cookie) => {
        if (error) {
          console.error(`An error occurred: ${error}`);
        } else {
          console.log(`Cookie saved: ${cookie}`);
        }
    })
});
```
