---
title: "use server"
description: "'use server' directive — function (သို့) file တစ်ခုကို server side မှာ run လုပ်ဖို့ သတ်မှတ်ပေးတဲ့ directive; file level နဲ့ inline သုံးနည်း၊ security ထည့်သွင်းစဉ်းစားချက်များ"
order: 57
source: "https://nextjs.org/docs/app/api-reference/directives/use-server"
status: translated
updated: 2026-09-02
---

`use server` directive က function (သို့) file တစ်ခုကို **server side** မှာ run လုပ်ဖို့ သတ်မှတ်ပေးပါတယ်။ File ရဲ့ ထိပ်မှာ သုံးရင် အဲဒီ file ထဲက function တွေ အားလုံး server-side ဖြစ်ကြောင်း ဖော်ပြနိုင်သလို — function တစ်ခုရဲ့ ထိပ်မှာ inline သုံးရင်တော့ အဲဒီ function ကို [Server Function](https://19.react.dev/reference/rsc/server-functions) တစ်ခုအဖြစ် မှတ်သားပေးပါတယ်။ ဒါက React feature တစ်ခု ဖြစ်ပါတယ်။

Next.js နဲ့ သက်ဆိုင်တဲ့ Server Action အပြုအမူတွေ (response model, security, configuration, deployment) အတွက်တော့ [Server Actions and Mutations](https://nextjs.org/docs/app/guides/server-actions) ကို ကြည့်ပါ။

## File ရဲ့ ထိပ်မှာ `use server` သုံးခြင်း

အောက်က ဥပမာက file ရဲ့ ထိပ်မှာ `use server` directive ပါတဲ့ file တစ်ခု ဖြစ်ပါတယ်။ အဲဒီ file ထဲက function တွေ အားလုံး server ပေါ်မှာ run ပါတယ်။

```tsx filename="app/actions.ts" highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function createUser(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

```jsx filename="app/actions.js" highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function createUser(data) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

### Client Component တစ်ခုထဲမှာ Server Functions တွေ သုံးခြင်း

Client Components တွေထဲမှာ Server Functions တွေ သုံးဖို့ — file ရဲ့ ထိပ်မှာ `use server` directive ပါတဲ့ သီးသန့် file တစ်ခုထဲမှာ Server Functions တွေကို ဖန်တီးရပါမယ်။ ဒီ Server Functions တွေကို Client ရော Server Components တွေထဲမှာပါ import လုပ်ပြီး run လုပ်နိုင်ပါတယ်။

`actions.ts` ထဲမှာ `fetchUsers` ဆိုတဲ့ Server Function တစ်ခု ရှိတယ်ဆိုပါစို့:

```tsx filename="app/actions.ts" highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function fetchUsers() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true },
  })
  return users
}
```

```jsx filename="app/actions.js" highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function fetchUsers() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true },
  })
  return users
}
```

ပြီးရင် `fetchUsers` Server Function ကို Client Component တစ်ခုထဲမှာ import လုပ်ပြီး — client-side မှာ run လုပ်နိုင်ပါတယ်။

```tsx filename="app/components/my-button.tsx" highlight={1,2,5} switcher
'use client'
import { fetchUsers } from '../actions'

export default function MyButton() {
  return <button onClick={() => fetchUsers()}>Fetch Users</button>
}
```

```jsx filename="app/components/my-button.js" highlight={1,2,5} switcher
'use client'
import { fetchUsers } from '../actions'

export default function MyButton() {
  return <button onClick={() => fetchUsers()}>Fetch Users</button>
}
```

## `use server` ကို inline သုံးခြင်း

အောက်က ဥပမာမှာ `use server` ကို function တစ်ခုရဲ့ ထိပ်မှာ inline အနေနဲ့ သုံးပြီး အဲဒီ function ကို [Server Function](https://19.react.dev/reference/rsc/server-functions) တစ်ခုအဖြစ် မှတ်သားထားပါတယ်:

```tsx filename="app/posts/[id]/page.tsx" switcher highlight={9}
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }: PageProps<'/posts/[id]'>) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData: FormData) {
    'use server'
    // Verify auth before saving (e.g. inside savePost)
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

```jsx filename="app/posts/[id]/page.js" switcher highlight={9}
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData) {
    'use server'
    // Verify auth before saving (e.g. inside savePost)
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

## Security ဆိုင်ရာ ထည့်သွင်းစဉ်းစားချက်များ

သင့် data access function တွေကို secure primitives (လုံခြုံတဲ့ အခြေခံ ယူနစ်များ) အနေနဲ့ ဒီဇိုင်းလုပ်ပါ — inputs တွေကို validate လုပ်ပါ၊ authentication နဲ့ authorization တွေ စစ်ဆေးပါ၊ return types တွေကို caller တကယ်လိုအပ်တာပဲ ရမယ့်ပုံစံ ကန့်သတ်ပါ။ Server Functions တွေက [Data Access Layer](https://nextjs.org/docs/app/guides/data-security#using-a-data-access-layer-for-mutations) တစ်ခုဆီ delegate လုပ်တဲ့အခါ — ဒီအာမခံချက်တွေ အားလုံးက နေရာတစ်ခုတည်းမှာ ရှိပြီး တစ်သမတ်တည်း သက်ရောက်ပါတယ်။

### Authentication နဲ့ authorization

Sensitive server-side operations တွေ မလုပ်ခင် user တွေကို အမြဲ authenticate နဲ့ authorize လုပ်ပါ။ Function parameters တွေအနေနဲ့ tokens တွေ လက်ခံတာမျိုး မလုပ်ဘဲ — cookies (သို့) headers တွေကနေ authentication ကို ဖတ်ပါ။

```tsx filename="app/actions.ts" highlight={1,7,8,9,10} switcher
'use server'

import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth' // Your authentication library

export async function createUser(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const newUser = await db.user.create({ data })
  return { id: newUser.id, name: newUser.name }
}
```

```jsx filename="app/actions.js" highlight={1,7,8,9,10} switcher
'use server'

import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth' // Your authentication library

export async function createUser(data) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const newUser = await db.user.create({ data })
  return { id: newUser.id, name: newUser.name }
}
```

### Return values

Server Function တွေရဲ့ return values တွေကို serialize လုပ်ပြီး client ဆီ ပို့ပါတယ်။ Raw database records တွေ မဟုတ်ဘဲ — UI က တကယ်လိုအပ်တဲ့ data ကိုပဲ return လုပ်ပါ။ [Data Security guide](https://nextjs.org/docs/app/guides/data-security#controlling-return-values) မှာ အသေးစိတ် ကြည့်ပါ။

## Reference (ကိုးကား)

`use server` အကြောင်း ပိုမို သိရှိရန် [React documentation](https://react.dev/reference/rsc/use-server) ကို ကြည့်ပါ။
