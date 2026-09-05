---
title: "IsRestoringProvider (persisted client ကို restore လုပ်နေဆဲ အချက်ပြရန် context Provider)"
description: "PersistQueryClientProvider မှ persisted client ကို restore လုပ်နေဆဲ ဟုတ်မဟုတ် signal ပေးရန် သုံးသော Provider variable — useIsRestoring က ဖတ်သည်"
order: 115
source: "https://tanstack.com/query/latest/docs/framework/react/reference/variables/IsRestoringProvider"
status: translated
updated: 2026-09-05
---

```ts
const IsRestoringProvider: Provider<boolean> = IsRestoringContext.Provider;
```

`PersistQueryClientProvider` က — persist လုပ်ထားတဲ့ client တစ်ခု လက်ရှိ restore လုပ်နေဆဲ ဟုတ်မဟုတ် အချက်ပြဖို့ သုံးတဲ့ `Provider` ဖြစ်ပြီး — `useIsRestoring` က ဒီကနေ ဖတ်ပါတယ်။
