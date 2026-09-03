---
title: "taint (Objects နှင့် values များကို taint လုပ်ခြင်း ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "taint option — experimental React APIs (experimental_taintObjectReference, experimental_taintUniqueValue) ဖြင့် sensitive data (objects/values) များ Server-Client boundary ကို ဖြတ်ကျော်မသွားအောင် တားဆီးရန် tainting ဖွင့်ခြင်း; flag ဖွင့်လျှင် React ၏ experimental channel ကိုပါ activate လုပ်ပေး"
order: 219
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/taint"
status: translated
updated: 2026-09-03
---

## အသုံးပြုပုံ (Usage)

`taint` option က objects နဲ့ values တွေကို taint လုပ်ဖို့အတွက် experimental React APIs တွေရဲ့ support ကို ဖွင့်ပေးပါတယ်။ ဒီ feature က sensitive data တွေ client ဆီ မတော်တဆ ရောက်မသွားအောင် ကာကွယ်ပေးပါတယ်။ ဖွင့်ထားတဲ့အခါ အောက်ပါတို့ကို သုံးနိုင်ပါတယ်:

- [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference) — objects တွေရဲ့ references တွေကို taint လုပ်ဖို့
- [`experimental_taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) — unique values တွေကို taint လုပ်ဖို့

> **သိထားသင့်သည် (Good to know):** ဒီ flag ကို activate လုပ်တာက `app` directory အတွက် React ရဲ့ `experimental` channel ကိုပါ ဖွင့်ပေးပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
}

module.exports = nextConfig
```

> **သတိပေးချက် (Warning):** Sensitive data တွေ client ဆီ ပေါက်ကြားမှုကို ကာကွယ်ဖို့ taint API ကိုပဲ တစ်ခုတည်းသော နည်းလမ်းအနေနဲ့ အားမကိုးပါနဲ့။ ကျွန်ုပ်တို့ရဲ့ [security recommendations](https://nextjs.org/blog/security-nextjs-server-components-actions) ကို ကြည့်ပါ။

Taint APIs တွေက Server-Client boundary ကို ဖြတ်သွားခွင့်မရှိတဲ့ data တွေကို declaratively (ကြေညာလွှာသဘော) နဲ့ ရှင်းရှင်းလင်းလင်း အမှတ်အသား လုပ်ပေးခြင်းအားဖြင့် ကာကွယ်ရေး (defensive) သဘောမျိုး ဆောင်ရွက်နိုင်စေပါတယ်။ Object (သို့) value တစ်ခုကို Server-Client boundary ကနေ ဖြတ်ပို့လိုက်ရင် — React က error တစ်ခု throw လုပ်ပါတယ်။

ဒါက အောက်ပါ အခြေအနေတွေမှာ အသုံးဝင်ပါတယ်:

- Data တွေကို ဖတ်ဖို့ methods တွေက သင့်ထိန်းချုပ်မှုအောက်မှာ မရှိတဲ့အခါ
- သင့်ကိုယ်ပိုင် သတ်မှတ်ထားတာ မဟုတ်တဲ့ sensitive data shapes တွေနဲ့ အလုပ်လုပ်ရတဲ့အခါ
- Sensitive data တွေကို Server Component rendering ကာလအတွင်းမှာ ဝင်ရောက်ကြည့်ရှုမိတဲ့အခါ

Sensitive data တွေ မလိုအပ်တဲ့ contexts တွေဆီ ပြန်မရောက်စေဖို့ — သင့် data နဲ့ APIs တွေကို ဒီဇိုင်းလုပ်ထားဖို့ အကြံပြုပါတယ်။

## Caveats (သတိပြုရမည့် အချက်များ)

- Tainting က objects တွေကို reference နဲ့ပဲ ခြေရာခံနိုင်ပါတယ်။ Object တစ်ခုကို copy လုပ်လိုက်ရင် untainted version တစ်ခု ဖြစ်သွားပြီး — API ရဲ့ အာမခံချက်တွေ အားလုံး ဆုံးရှုံးသွားပါတယ်။ Copy အသစ်ကိုလည်း taint လုပ်ဖို့ လိုပါတယ်။
- Tainting က tainted value တစ်ခုကနေ ဆင်းသက်လာတဲ့ (derived) data တွေကို ခြေရာခံလို့ မရပါဘူး။ Derived value အသစ်ကိုလည်း သင်ကိုယ်တိုင် taint လုပ်ဖို့ လိုပါတယ်။
- Values တွေက သူတို့ရဲ့ lifetime reference က scope အတွင်းမှာ ရှိနေသရွေ့ taint ခံထားရပါတယ်။ အသေးစိတ်အတွက် [`experimental_taintUniqueValue` parameters reference](https://react.dev/reference/react/experimental_taintUniqueValue#parameters) ကို ကြည့်ပါ။

## Examples

### Object reference တစ်ခုကို taint လုပ်ခြင်း

ဒီအခြေအနေမှာ `getUserDetails` function က ပေးထားတဲ့ user တစ်ယောက်အကြောင်း data တွေကို ပြန်ပေးပါတယ်။ User object ရဲ့ reference ကို taint လုပ်ထားလိုက်လို့ — Server-Client boundary တစ်ခုကို ဖြတ်ကျော်လို့ မရတော့ပါဘူး။ ဥပမာ — `UserCard` က Client Component တစ်ခုလို့ ယူဆပါ။

```ts switcher
import { experimental_taintObjectReference } from 'react'

async function getUserDetails(id: string): Promise<UserDetails> {
  const user = await db.queryUserById(id)

  experimental_taintObjectReference(
    'Do not use the entire user info object. Instead, select only the fields you need.',
    user
  )

  return user
}
```

```js switcher
import { experimental_taintObjectReference } from 'react'

async function getUserDetails(id) {
  const user = await db.queryUserById(id)

  experimental_taintObjectReference(
    'Do not use the entire user info object. Instead, select only the fields you need.',
    user
  )

  return user
}
```

Taint လုပ်ထားတဲ့ `userDetails` object ကနေ field တစ်ခုချင်းစီကိုတော့ ဆက်ပြီး ဝင်ရောက်သုံးလို့ ရပါသေးတယ်။

```tsx filename="app/contact/page.tsx" switcher
export async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  return (
    <UserCard
      firstName={userDetails.firstName}
      lastName={userDetails.lastName}
    />
  )
}
```

```jsx filename="app/contact/page.js" switcher
export async function ContactPage({ params }) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  return (
    <UserCard
      firstName={userDetails.firstName}
      lastName={userDetails.lastName}
    />
  )
}
```

အခု — object တစ်ခုလုံးကို Client Component ဆီ ပို့လိုက်ရင်တော့ error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်။

```tsx switcher
export async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userDetails = await getUserDetails(id)

  // Error throw ဖြစ်ပါတယ်
  return <UserCard user={userDetails} />
}
```

```jsx switcher
export async function ContactPage({ params }) {
  const { id } = await params
  const userDetails = await getUserDetails(id)

  // Error throw ဖြစ်ပါတယ်
  return <UserCard user={userDetails} />
}
```

### Unique value တစ်ခုကို taint လုပ်ခြင်း

ဒီအခြေအနေမှာ `configService.getConfigDetails` ကို await လုပ်ပြီး server configuration ကို ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။ ဒါပေမယ့် system configuration ထဲမှာ client တွေကို မဖော်ထုတ်ချင်တဲ့ `SERVICE_API_KEY` ပါဝင်နေပါတယ်။

`config.SERVICE_API_KEY` value ကို taint လုပ်နိုင်ပါတယ်:

```ts switcher
import { experimental_taintUniqueValue } from 'react'

async function getSystemConfig(): Promise<SystemConfig> {
  const config = await configService.getConfigDetails()

  experimental_taintUniqueValue(
    'Do not pass configuration tokens to the client',
    config,
    config.SERVICE_API_KEY
  )

  return config
}
```

```js switcher
import { experimental_taintUniqueValue } from 'react'

async function getSystemConfig() {
  const config = await configService.getConfigDetails()

  experimental_taintUniqueValue(
    'Do not pass configuration tokens to the client',
    config,
    config.SERVICE_API_KEY
  )

  return config
}
```

`systemConfig` object ရဲ့ တခြား properties တွေကိုတော့ ဆက်ပြီး ဝင်ရောက်သုံးလို့ ရပါသေးတယ်။

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()

  return <ClientDashboard version={systemConfig.SERVICE_API_VERSION} />
}
```

ဒါပေမယ့် — `SERVICE_API_KEY` ကို `ClientDashboard` ဆီ ပို့လိုက်ရင်တော့ error တစ်ခု throw ဖြစ်ပါတယ်။

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()
  // PR တစ်ခုထဲမှာ တစ်စုံတစ်ယောက်က အမှားလုပ်မိတယ်
  const version = systemConfig.SERVICE_API_KEY

  return <ClientDashboard version={version} />
}
```

`systemConfig.SERVICE_API_KEY` ကို variable အသစ်တစ်ခုဆီ reassign လုပ်ထားပေမယ့် — Client Component ဆီ ပို့လိုက်ရင် error တစ်ခု throw ဖြစ်နေဦးမှာ သတိပြုပါ။

ဆန့်ကျင်ဘက်အနေနဲ့ — tainted unique value တစ်ခုကနေ ဆင်းသက်လာတဲ့ value တစ်ခုကတော့ client ဆီ ပေါက်ကြားသွားပါလိမ့်မယ်။

```tsx
export async function Dashboard() {
  const systemConfig = await getSystemConfig()
  // PR တစ်ခုထဲမှာ တစ်စုံတစ်ယောက်က အမှားလုပ်မိတယ်
  const version = `version::${systemConfig.SERVICE_API_KEY}`

  return <ClientDashboard version={version} />
}
```

ပိုကောင်းတဲ့ နည်းလမ်းကတော့ — `getSystemConfig` က ပြန်ပေးတဲ့ data ထဲကနေ `SERVICE_API_KEY` ကို ဖယ်ရှားပစ်လိုက်တာပါ။
