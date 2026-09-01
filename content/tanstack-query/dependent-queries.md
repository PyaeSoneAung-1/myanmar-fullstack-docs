---
title: "မှီခို Queries (Dependent Queries)"
description: "enabled option သုံးပြီး query တစ်ခုကို နောက်တစ်ခု ပြီးမှ run လုပ်စေခြင်း — useQuery နဲ့ useQueries နှစ်မျိုးလုံးအတွက် ဥပမာတွေ ပါဝင်ပါတယ်"
order: 7
source: "https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries"
status: translated
updated: 2026-09-01
---

## useQuery နဲ့ dependent query

Dependent (သို့မဟုတ် serial) query တွေက သူတို့ run မလုပ်ခင် အရင်က query တွေ ပြီးစီးဖို့ စောင့်ရပါတယ်။ ဒါကို အောင်မြင်ဖို့ဆိုရင် `enabled` option ကို သုံးပြီး query က ဘယ်အချိန်မှာ run ဖို့ အဆင်သင့်ဖြစ်လဲ ပြောပြရုံပါပဲ:

```tsx
// သုံးစွဲသူ (user) ကို ယူမယ်
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// ပြီးမှ user ရဲ့ projects တွေကို ယူမယ်
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // userId ရှိမှသာ query က execute ဖြစ်မယ်
  enabled: !!userId,
})
```

`projects` query က ဒီလို state တွေနဲ့ စတင်ပါလိမ့်မယ်:

```tsx
status: 'pending'
isPending: true
fetchStatus: 'idle'
```

`user` ရရှိတာနဲ့ `projects` query က `enabled` ဖြစ်သွားပြီး ဒီလို state တွေကို ပြောင်းသွားပါလိမ့်မယ်:

```tsx
status: 'pending'
isPending: true
fetchStatus: 'fetching'
```

Projects တွေ ရပြီဆိုရင်တော့ ဒီလို ဖြစ်သွားပါမယ်:

```tsx
status: 'success'
isPending: false
fetchStatus: 'idle'
```

## useQueries နဲ့ dependent query

Dynamic parallel query ဖြစ်တဲ့ `useQueries` ကလည်း အရင် query တစ်ခုကို မှီခိုနိုင်ပါတယ် — ဒီလို ပြုလုပ်နိုင်ပါတယ်:

```tsx
// Users ရဲ့ ids တွေကို ယူမယ်
const { data: userIds } = useQuery({
  queryKey: ['users'],
  queryFn: getUsersData,
  select: (users) => users.map((user) => user.id),
})

// ပြီးမှ users တွေရဲ့ messages တွေကို ယူမယ်
const usersMessages = useQueries({
  queries: userIds
    ? userIds.map((id) => {
        return {
          queryKey: ['messages', id],
          queryFn: () => getMessagesByUsers(id),
        }
      })
    : [], // userIds က undefined ဖြစ်နေရင် empty array ပြန်ပေးမယ်
})
```

**မှတ်ချက်** — `useQueries` က **query result တွေရဲ့ array** တစ်ခုကို ပြန်ပေးပါတယ်။

## Performance အကြောင်း မှတ်ချက်

Dependent query တွေက သဘာဝအားဖြင့် [request waterfall](/docs/tanstack-query/request-waterfalls) (request တစ်ခုပြီးမှ တစ်ခု အစဉ်လိုက် စီးဆင်းသွားတဲ့ပုံစံ) ကို ဖြစ်ပေါ်စေပြီး — ဒါက performance ကို ထိခိုက်စေပါတယ်။ Query နှစ်ခုလုံးက အချိန်တူ ယူတယ်လို့ ယူဆကြည့်ရင် parallel လုပ်မယ့်အစား serial လုပ်တာက အမြဲတမ်း အချိန် နှစ်ဆ ပိုကြာပါတယ် — latency (ကြန့်ကြာချိန်) မြင့်တဲ့ client မှာ ဆိုရင် ပိုပြီး ဆိုးပါတယ်။ ဖြစ်နိုင်ရင် backend API တွေကို ပြန်စီစဉ်ပြီး query နှစ်ခုလုံးကို parallel နဲ့ fetch လုပ်နိုင်အောင် လုပ်တာက ပိုကောင်းပါတယ် — ဒါပေမယ့် လက်တွေ့မှာ အမြဲတမ်းတော့ မဖြစ်နိုင်တာလည်း ရှိပါတယ်။

အပေါ်က ဥပမာမှာဆိုရင် — `getUserByEmail` ကို အရင်ယူပြီးမှ `getProjectsByUser` ကို ယူနေမယ့်အစား `getProjectsByUserEmail` ဆိုတဲ့ query အသစ်တစ်ခု ထည့်လိုက်ရင် waterfall ကို ပြားသွားစေပါလိမ့်မယ်။
