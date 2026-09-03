---
title: "Mocks တွေထဲမှာ requests တွေကြားမှာ state ကို ထိန်းသိမ်းခြင်း (Persist state across requests in mocks)"
description: "pm.state object နဲ့ mocks တွေထဲမှာ requests တွေကြားမှာ data တွေကို persist လုပ်ပြီး စီမံခြင်း — get, set, delete, has, keys, size, clear, toObject, increment, push နဲ့ addToSet methods တွေ"
order: 121
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-state/"
status: translated
updated: 2026-09-03
---

`pm.state` object က [mock](https://learning.postman.com/docs/design-apis/mock-apis/local-mock-servers) တစ်ခုအတွက် persistent store တစ်ခုကို ပေးပါတယ်။ Requests တွေကြားမှာ data တွေကို ဖတ်ခြင်း, ရေးခြင်း နဲ့ update လုပ်ခြင်း လုပ်နိုင်ပြီး — static responses တွေ ပြန်ပေးနေမယ့်အစား — ကိုယ့် mock က real service တစ်ခုလို ပြုမူနိုင်စေပါတယ်။ State က shared ဖြစ်ပြီး — `pm.state.clear()` ကို သုံးပြီး ရှင်းလင်းလိုက်တဲ့အထိ run တစ်ခုတည်းထက် ကျော်လွန်ပြီး persist ဖြစ်နေပါတယ်။ Methods တွေအားလုံးက asynchronous ဖြစ်ပြီး Promises တွေ ပြန်ပေးလို့ — ၎င်းတို့ရဲ့ ရလဒ်တွေကို ရဖို့ `await` ကို သုံးပါ။

## pm.state

ကိုယ့် mock ထဲမှာ requests တွေကြားမှာ data တွေကို persist လုပ်ပြီး စီမံဖို့ `pm.state` object ကို သုံးပါ။

### pm.state.get(key:String)

လက်ရှိ mock session ထဲမှာ ဒီ key အတွက် သိမ်းထားတဲ့ value ကို ပြန်ယူပါတယ်။ တွေ့ရင် value ကို — key မရှိရင် `undefined` ကို resolve လုပ်ပါတယ်။ Session data တွေကို ဖတ်ပြီး ၎င်းပေါ် အခြေခံပြီး ဆုံးဖြတ်ချက်တွေ ချဖို့ ဒါကို သုံးပါ။

```js
const user = await pm.state.get("user");

if (user) {
  return { status: 200, body: user };
}

return { status: 404, body: { error: "User not found" } };
```

### pm.state.set(key:String, value:Any)

လက်ရှိ mock session အတွက် key အောက်မှာ JSON-serializable ဖြစ်တဲ့ value တစ်ခုကို သိမ်းပါတယ်။ Session state တွေကို ဖန်တီးဖို့ ဒါမှမဟုတ် အစားထိုးဖို့ ဒါကို သုံးပါ။

```js
await pm.state.set("user", {
  id: "123",
  name: "Avery",
  role: "admin"
});

return { status: 201, body: { message: "User created" } };
```

### pm.state.delete(key:String)

လက်ရှိ mock session ကနေ key နဲ့ ၎င်းရဲ့ value ကို ဖယ်ရှားပါတယ်။ Deletes တွေ ဒါမှမဟုတ် cleanup တွေကို simulate လုပ်တဲ့အခါ အသုံးဝင်ပါတယ်။ Key ရှိခဲ့ရင် `true` ကို resolve လုပ်ပါတယ်။

```js
await pm.state.delete("user");

return { status: 204 };
```

### pm.state.has(key:String)

လက်ရှိ mock session ထဲမှာ key တစ်ခု ရှိမရှိ စစ်ဆေးပါတယ်။ Key ရှိနေရင် `true` ကို resolve လုပ်ပါတယ်။

```js
if (!(await pm.state.has("cart"))) {
  await pm.state.set("cart", []);
}

return { status: 200, body: { ready: true } };
```

### pm.state.keys()

Session state ထဲမှာ သိမ်းထားတဲ့ keys တွေအားလုံးရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const keys = await pm.state.keys();

return {
  status: 200,
  body: {
    keys
  }
};
```

### pm.state.size()

Session state ထဲမှာ သိမ်းထားတဲ့ keys တွေရဲ့ အရေအတွက်ကို ပြန်ပေးပါတယ်။

```js
const count = await pm.state.size();

return {
  status: 200,
  body: {
    stateEntries: count
  }
};
```

### pm.state.clear()

Mock server က သုံးတဲ့ shared state ကနေ keys တွေအားလုံးကို ဖယ်ရှားပါတယ်။ Flows တွေကြားမှာ data တွေ reset လုပ်ဖို့ ဒါမှမဟုတ် reset အပြည့်အစုံတစ်ခုကို simulate လုပ်ဖို့ ဒါကို သုံးပါ။

```js
await pm.state.clear();
```

### pm.state.toObject()

Session state တစ်ခုလုံးကို plain JavaScript object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Debugging လုပ်ဖို့ ဒါမှမဟုတ် response တစ်ခုထဲမှာ လက်ရှိ mock state ကို ပြန်ပို့ဖို့ အသုံးဝင်ပါတယ်။

```js
const snapshot = await pm.state.toObject();

return {
  status: 200,
  body: {
    state: snapshot
  }
};
```

### pm.state.increment(key:String, delta?:Number)

ပေးထားတဲ့ key မှာ သိမ်းထားတဲ့ numeric value ကို သတ်မှတ်ထားတဲ့ delta နဲ့ တိုးပေးပါတယ် (default ကတော့ `1` ပါ)။ Key မရှိသေးရင် — အဲဒါကို ဖန်တီးပြီး တိုးပြီးသား value နဲ့ initialize လုပ်ပါတယ်။

```js
await pm.state.increment("retryCount");

const total = await pm.state.increment("totalRequests", 5);

return {
  status: 200,
  body: {
    retryCount: await pm.state.get("retryCount"),
    totalRequests: total
  }
};
```

### pm.state.push(key:String, items:Array)

Key မှာ သိမ်းထားတဲ့ array တစ်ခုဆီကို item တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ items တွေကို ထပ်ဖြည့်ပါတယ်။ Array မရှိသေးရင် — အလိုအလျောက် ဖန်တီးပေးပါတယ်။

```js
await pm.state.push("events", {
  type: "user.created",
  userId: "123"
});

return {
  status: 200,
  body: {
    events: await pm.state.get("events")
  }
};
```

### pm.state.addToSet(key:String, item:Any)

Item တစ်ခုကို array ထဲမှာ မရှိသေးမှသာ ထည့်ပေးပါတယ်။ Item ထည့်လိုက်နိုင်ခဲ့ရင် `true` ကို resolve လုပ်ပါတယ်။

```js
const added = await pm.state.addToSet("roles", "admin");

return {
  status: 200,
  body: {
    added,
    roles: await pm.state.get("roles")
  }
};
```
