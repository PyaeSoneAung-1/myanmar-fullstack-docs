---
title: "Mutations အသေးစိတ်"
description: "useMutation နဲ့ data ပြောင်းလဲခြင်း — mutate vs mutateAsync, onSuccess/onError/onSettled, invalidate, optimistic updates"
order: 4
source: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations"
status: translated
updated: 2026-09-01
---

## Mutation ဆိုတာ ဘာလဲ

Query တွေက data ဖတ်ဖို့ဆိုရင် — **mutation** တွေက data ဖန်တီးခြင်း/ပြင်ခြင်း/ဖျက်ခြင်းနဲ့ server side-effect တွေအတွက်ပါ။ ဒီအတွက် TanStack Query က `useMutation` hook ကို ပေးပါတယ်:

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post("/todos", newTodo);
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Do Laundry" });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

`mutate` ကို ခေါ်တဲ့အခါ variable တစ်ခု ဒါမှမဟုတ် object တစ်ခုကို `mutationFn` ဆီ ပို့လို့ရပါတယ် — ဥပမာ အပေါ်မှာ `{ id, title }` object ကို `axios.post` ဆီ ပို့ထားတာပါ။

## Mutation ရဲ့ state တွေ

Mutation တစ်ခုက တစ်ချိန်မှာ အောက်ပါ state တစ်ခုထဲပဲ ရှိပါတယ်:

| state | အဓိပ္ပာယ် |
|---|---|
| `idle` | အသစ်စက်စက် / reset လုပ်ထားတဲ့ အခြေအနေ (isIdle) |
| `pending` | လက်ရှိ run နေတယ် (isPending) |
| `error` | အမှားဖြစ်သွားတယ် (isError) — `error` property ကနေ အသေးစိတ် ရနိုင် |
| `success` | အောင်မြင်ပြီး — mutation ရဲ့ data ကို `data` property ကနေ ရနိုင် (isSuccess) |

Query နဲ့ ကွာတာက mutation မှာ `idle` state ပါပြီး — `pending` ဖြစ်နေတာက **data မရှိလို့** မဟုတ်ဘဲ **mutation လုပ်နေလို့** ဖြစ်ပါတယ်။

## mutate vs mutateAsync

`mutate` က fire-and-forget သဘောပါ — ခေါ်လိုက်ရုံပဲ၊ ပြန်စောင့်စရာ promise မရှိပါဘူး။ `mutateAsync` ကတော့ promise ပြန်ပေးလို့ `await` လုပ်ပြီး — success မှာ resolve, error မှာ throw ဖြစ်ပါတယ်:

```tsx
const mutation = useMutation({ mutationFn: addTodo });

try {
  const todo = await mutation.mutateAsync(todo);
  console.log(todo);
} catch (error) {
  console.error(error);
} finally {
  console.log("done");
}
```

Side effect တွေကို ဆက်တွဲ compose လုပ်ချင်ရင် — ဥပမာ mutation အောင်မြင်မှသာ navigation လုပ်တာမျိုး — `mutateAsync` က ပိုအဆင်ပြေပါတယ်။

## Side-effect callbacks — onSuccess / onError / onSettled

`useMutation` မှာ mutation lifecycle ရဲ့ အဆင့်တိုင်းအတွက် callback option တွေ ပါပါတယ်:

- **onSuccess** — mutation အောင်မြင်တဲ့အခါ
- **onError** — အမှားဖြစ်တဲ့အခါ
- **onSettled** — အောင်မြင်သည်ဖြစ်စေ၊ မအောင်မြင်သည်ဖြစ်စေ — နောက်ဆုံးမှာ အမြဲခေါ်ပါတယ်

Mutation အောင်မြင်ပြီးနောက် ဆက်စပ်နေတဲ့ query တွေကို ပြန် fetch လုပ်ဖို့ အသုံးအများဆုံး pattern က `invalidateQueries` နဲ့ cache ကို invalidate လုပ်တာပါ:

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    // todos list query တွေကို stale လုပ်ပြီး ပြန် refetch ဖြစ်စေမယ်
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
  onError: (error) => {
    console.error("Todo ထည့်ရာမှာ မအောင်မြင်ပါ:", error);
  },
  onSettled: () => {
    console.log("Mutation ပြီးဆုံးပါပြီ");
  },
});
```

`onSuccess`/`onError`/`onSettled` တွေက promise ပြန်ပေးရင် — နောက် callback ကို မခေါ်ခင် အဲဒီ promise ကို အရင် `await` လုပ်ပါတယ်။ Query key တွေက prefix match ဖြစ်လို့ `["todos"]` ကို invalidate လုပ်ရင် todos နဲ့ဆိုင်တဲ့ query အကုန် ပြန် fetch ဖြစ်ပါတယ် — အသေးစိတ်ကို [Query Keys](/docs/tanstack-query/query-keys) မှာ ကြည့်ပါ။

## Optimistic updates — UI ကို ချက်ချင်း update လုပ်ခြင်း

**Optimistic update** ဆိုတာ — server response ကို မစောင့်ဘဲ user ရဲ့ action ကို UI မှာ ချက်ချင်းပြပြီး၊ အမှားဖြစ်ရင် မူလအတိုင်း ပြန်ပြောင်းပေးတဲ့ နည်းပါတယ်။ Pattern က — `onMutate` မှာ cache ကို ကြိုပြင်၊ `onError` မှာ ပြန်ပြောင်း (rollback):

```tsx
const queryClient = useQueryClient();

useMutation({
  mutationFn: updateTodo,
  // mutate ခေါ်လိုက်တာနဲ့ ချက်ချင်း:
  onMutate: async (newTodo) => {
    // todos နဲ့ဆိုင်တဲ့ လက်ရှိ query တွေကို ရပ်လိုက်မယ်
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // မူလ data ကို သိမ်းထားမယ် (rollback ဖို့)
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Optimistically (မျှော်လင့်ချက်နဲ့ ကြိုတင်) update လုပ်မယ်
    queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);

    // context အနေနဲ့ မူလ data ကို ပြန်ပေးမယ်
    return { previousTodos };
  },
  // အမှားဖြစ်ရင် onMutate က ပြန်ပေးတဲ့ context နဲ့ ပြန်ပြောင်းမယ်
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },
  // အောင်မြင်သည်ဖြစ်စေ၊ မအောင်မြင်သည်ဖြစ်စေ — server data နဲ့ ညှိဖို့ ပြန် fetch မယ်
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

ဒီနည်းနဲ့ user က button နှိပ်လိုက်တာနဲ့ todo အသစ်ကို ချက်ချင်းမြင်ရပြီး — server မှာ မအောင်မြင်ရင်လည်း cache က မူလအခြေအနေကို ပြန်ရောက်သွားပါတယ်။ `cancelQueries` က background refetch တွေနဲ့ ပဋိပက္ခ မဖြစ်အောင် လုပ်ပေးတာပါ။ Cache ရဲ့ နောက်ကွယ် ယန္တရားကို [Caching အခြေခံ](/docs/tanstack-query/cache) မှာ ဆက်ဖတ်နိုင်ပြီး — mutation မစခင် query state တွေအကြောင်း [Queries အသေးစိတ်](/docs/tanstack-query/queries) မှာ ကြည့်နိုင်ပါတယ်။
