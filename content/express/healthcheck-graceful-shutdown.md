---
title: "Health Check နဲ့ Graceful Shutdown"
description: "Express app တွေမှာ graceful shutdown (လုပ်ဆောင်နေဆဲ အလုပ်တွေ အပြီးသတ်ပြီးမှ ပိတ်ခြင်း) နဲ့ health check (ကျန်းမာရေး စစ်ဆေးမှု) တွေ ထည့်သွင်းနည်း — deployment အသစ် အစားထိုးတဲ့အခါ SIGTERM signal ကို ကိုင်တွယ်ခြင်းနဲ့ load balancer (Kubernetes လို) တွေအတွက် liveness/readiness check တွေ အကြောင်း"
order: 22
source: "https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html"
status: translated
updated: 2026-09-03
---

## Graceful Shutdown (ချောမွေ့စွာ ပိတ်ခြင်း)

Application ရဲ့ version အသစ်တစ်ခုကို deploy လုပ်တဲ့အခါ — အရင် version ကို အစားထိုးရပါတယ်။ ကိုယ်သုံးနေတဲ့ process manager က application ကို သတ်ပစ်တော့မယ်ဆိုတာ အသိပေးဖို့ SIGTERM signal ကို အရင်ပို့ပါတယ်။ ဒီ signal ကို application က ရရှိတာနဲ့ — request အသစ်တွေ လက်ခံတာ ရပ်တန့်ပြီး၊ လုပ်ဆောင်နေဆဲ request တွေကို အပြီးသတ်ကာ၊ database connection တွေနဲ့ file lock တွေ အပါအဝင် သုံးထားတဲ့ resource တွေကို ရှင်းလင်းပြီးမှ exit လုပ်ရပါတယ်။

### ဥပမာ

```js
const server = app.listen(port);

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});
```

## Health Checks (ကျန်းမာရေး စစ်ဆေးမှုများ)

Load balancer တွေက health check တွေကို သုံးပြီး — application instance တစ်ခုက ကျန်းမာရေး ကောင်းနေလား၊ request တွေ လက်ခံဖို့ အဆင်သင့် ဖြစ်နေလားဆိုတာ ဆုံးဖြတ်ပါတယ်။ ဥပမာ — [Kubernetes မှာ health check နှစ်မျိုး ရှိပါတယ်](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes//):

- `liveness` — container တစ်ခုကို ဘယ်အချိန် restart လုပ်ရမလဲ ဆုံးဖြတ်ပေးပါတယ်။
- `readiness` — container တစ်ခုက traffic တွေ စတင် လက်ခံဖို့ အဆင်သင့် ဖြစ်ပြီလား ဆုံးဖြတ်ပေးပါတယ်။ Pod တစ်ခု ready မဖြစ်သေးရင် — service ရဲ့ load balancer တွေကနေ ဖယ်ရှားခံရပါတယ်။
