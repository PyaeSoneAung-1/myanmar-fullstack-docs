---
title: "use client"
description: "'use client' directive — component တွေကို client side မှာ render လုပ်ဖို့ entry point သတ်မှတ်ပေးတဲ့ directive; ဘယ်အချိန်မှာ သုံးမလဲ၊ Client Components ရဲ့ props တွေ serializable ဖြစ်ရခြင်း အကြောင်း"
order: 56
source: "https://nextjs.org/docs/app/api-reference/directives/use-client"
status: translated
updated: 2026-09-02
---

`'use client'` directive က component တွေကို **client side** မှာ render လုပ်ဖို့အတွက် entry point (ဝင်ပေါက်) တစ်ခုအဖြစ် သတ်မှတ်ပေးပါတယ်။ State management, event handling နဲ့ browser APIs တွေ ဝင်ရောက်သုံးစွဲမှုလိုမျိုး — client-side JavaScript စွမ်းရည်တွေ လိုအပ်တဲ့ interactive user interfaces (UI) တွေ ဖန်တီးတဲ့အခါ ဒါကို သုံးသင့်ပါတယ်။ ဒါက React feature တစ်ခု ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:**
>
> Client Components တွေ ပါဝင်တဲ့ file တိုင်းမှာ `'use client'` directive ထည့်စရာ မလိုပါဘူး။ Server Components တွေထဲမှာ တိုက်ရိုက် render လုပ်ချင်တဲ့ component တွေ ရှိတဲ့ file တွေမှာပဲ ထည့်ဖို့ လိုပါတယ်။ `'use client'` directive က [server နဲ့ client boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) ကို သတ်မှတ်ပေးပြီး — အဲဒီ file ကနေ export လုပ်ထားတဲ့ component တွေက client အတွက် entry points တွေ ဖြစ်လာပါတယ်။

## အသုံးပြုပုံ (Usage)

Client Components တွေရဲ့ entry point တစ်ခုကို ကြေညာဖို့ — imports တွေ မတိုင်ခင် **file ရဲ့ ထိပ်ဆုံးမှာ** `'use client'` directive ကို ထည့်ပါ:

```tsx filename="app/components/counter.tsx" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

```jsx filename="app/components/counter.js" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

`'use client'` directive ကို သုံးတဲ့အခါ Client Components တွေရဲ့ props တွေက [serializable](https://react.dev/reference/rsc/use-client#serializable-types) (အသွင်ပြောင်း၍ ရနိုင်သော) ဖြစ်ရပါမယ်။ ဆိုလိုတာက — server ကနေ client ဆီ data ပို့တဲ့အခါ React က serialize လုပ်နိုင်တဲ့ ပုံစံမျိုးနဲ့ props တွေ ရှိရပါမယ်။

```tsx filename="app/components/counter.tsx" highlight={4} switcher
'use client'

export default function Counter({
  onClick /* ❌ Function is not serializable */,
}) {
  return (
    <div>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}
```

```jsx filename="app/components/counter.js" highlight={4} switcher
'use client'

export default function Counter({
  onClick /* ❌ Function is not serializable */,
}) {
  return (
    <div>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}
```

## Client Components တွေကို Server Components တွေထဲမှာ nesting လုပ်ခြင်း

Server နဲ့ Client Components တွေကို ပေါင်းစပ်ခြင်းဖြင့် — performance ကောင်းပြီး interactive ဖြစ်တဲ့ application တွေ တည်ဆောက်နိုင်ပါတယ်:

1. **Server Components**: static content, data fetching နဲ့ SEO-friendly ဖြစ်တဲ့ အစိတ်အပိုင်းတွေအတွက် သုံးပါ။
2. **Client Components**: state, effects (သို့) browser APIs တွေ လိုအပ်တဲ့ interactive အစိတ်အပိုင်းတွေအတွက် သုံးပါ။
3. **Component composition**: server နဲ့ client logic တွေ ရှင်းလင်းစွာ ခွဲခြားထားနိုင်ဖို့ — Server Components တွေထဲမှာ Client Components တွေကို လိုအပ်သလို nest လုပ်ပါ။

အောက်က ဥပမာမှာ:

- `Header` က static content တွေကို ကိုင်တွယ်တဲ့ Server Component တစ်ခု ဖြစ်ပါတယ်။
- `Counter` က page ထဲမှာ interactivity ရစေတဲ့ Client Component တစ်ခု ဖြစ်ပါတယ်။

```tsx filename="app/page.tsx" highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // This is a Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

```jsx filename="app/page.js" highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // This is a Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

## Reference (ကိုးကား)

`'use client'` အကြောင်း ပိုမို သိရှိရန် [React documentation](https://react.dev/reference/rsc/use-client) ကို ကြည့်ပါ။
