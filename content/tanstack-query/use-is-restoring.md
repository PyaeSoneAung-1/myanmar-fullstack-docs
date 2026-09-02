---
title: "useIsRestoring (persist လုပ်ထားသော state restore လုပ်နေစဉ် စောင့်ဆိုင်းရန် hook)"
description: "useIsRestoring hook — persist လုပ်ထားတဲ့ client state ကို restore လုပ်နေဆဲ ဟုတ်မဟုတ် boolean နဲ့ စစ်ဆေးပေးခြင်း (restore နဲ့ mounting queries ကြား race conditions ကာကွယ်ရန်)"
order: 54
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useIsRestoring"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useIsRestoring(): boolean;
```

Defined in: [react-query/src/IsRestoringProvider.ts:13](https://github.com/TanStack/query/blob/main/packages/react-query/src/IsRestoringProvider.ts#L13)

`PersistQueryClientProvider` ကို သုံးနေတယ်ဆိုရင် — restore တစ်ခု လက်ရှိ လုပ်ဆောင်နေလားဆိုတာ စစ်ဆေးဖို့ `useIsRestoring` hook ကို ၎င်းနဲ့ တွဲသုံးနိုင်ပါတယ် ([PersistQueryClientProvider](/docs/tanstack-query/persist-query-client#persistqueryclientprovider) ကို ကြည့်ပါ)။ `useQuery` နဲ့ အခြား hooks တွေကလည်း — restore လုပ်ခြင်းနဲ့ အသစ် mount ဖြစ်လာတဲ့ queries တွေကြားမှာ race conditions (ပြိုင်ဆိုင်မှု အခြေအနေများ) မဖြစ်အောင် ဒါကို အတွင်းပိုင်းကနေ စစ်ဆေးအသုံးပြုပါတယ်။

## Returns

`boolean`

- `true` — persist လုပ်ထားတဲ့ client တစ်ခုကို restore လုပ်နေဆဲ ဖြစ်နေချိန်
- `false` — မဟုတ်ရင်
