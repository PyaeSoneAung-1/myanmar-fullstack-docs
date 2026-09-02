---
title: "Quick Start (အမြန် စတင်ခြင်း)"
description: "React Query ရဲ့ အဓိက concept ၃ ခု — Queries, Mutations, Query Invalidation — တွေကို code snippet တစ်ခုတည်းနဲ့ အမြန် နားလည်နိုင်ရန်"
order: 60
source: "https://tanstack.com/query/latest/docs/framework/react/quick-start"
status: translated
updated: 2026-09-02
---

အောက်က code snippet က React Query ရဲ့ အဓိက concept ၃ ခုကို အကျဉ်းချုပ် သရုပ်ဖော်ပေးထားပါတယ်:

- [Queries](/docs/tanstack-query/queries)
- [Mutations](/docs/tanstack-query/mutations)
- [Query Invalidation](/docs/tanstack-query/query-invalidation)

အပြည့်အစုံ အလုပ်လုပ်တဲ့ ဥပမာတစ်ခု လိုချင်ရင်တော့ — ကျွန်ုပ်တို့ရဲ့ [simple StackBlitz example](https://tanstack.com/query/latest/docs/framework/react/examples/simple) ကို ကြည့်ပါ။

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

ဒီ concept ၃ ခုက React Query ရဲ့ core functionality အများစုကို ဖုံးလွှမ်းထားပါတယ်။ Documentation ရဲ့ နောက်အပိုင်းတွေမှာ ဒီ core concept တစ်ခုချင်းစီအကြောင်းကို အသေးစိတ် ရှင်းပြသွားမှာ ဖြစ်ပါတယ်။
