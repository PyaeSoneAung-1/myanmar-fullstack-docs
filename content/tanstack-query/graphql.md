---
title: "GraphQL (GraphQL နှင့် တွဲသုံးခြင်း)"
description: "React Query ကို GraphQL clients တွေနဲ့ တွဲသုံးနည်း — graphql-request နဲ့ GraphQL Code Generator သုံးပြီး full-typed GraphQL operations ရယူခြင်း"
order: 63
source: "https://tanstack.com/query/latest/docs/framework/react/graphql"
status: translated
updated: 2026-09-02
---

React Query ရဲ့ fetching mechanisms တွေက Promises တွေပေါ်မှာ agnostic (framework-မရွေး) ပုံစံနဲ့ တည်ဆောက်ထားလို့ — React Query ကို GraphQL အပါအဝင် ဘယ် asynchronous data fetching client နဲ့မဆို တွဲသုံးလို့ ရပါတယ်။

> သတိပြုပါ — React Query က normalized caching ကို မထောက်ပံ့ပါဘူး။ User အများစုက normalized cache ကို လက်တွေ့မှာ မလိုအပ်ကြတာရော — သူတို့ထင်သလောက် အကျိုးရှိကြတာရော မဟုတ်ပေမယ့် — ရှားရှားပါးပါး အခြေအနေတချို့မှာတော့ ဒါက တကယ်လို ကောင်းနိုင်ပါတယ်။ ဒါကြောင့် သေချာစေဖို့ — ဒါမျိုး မလုပ်ခင် ကျွန်ုပ်တို့ဆီ အရင် စုံစမ်းပြီး သေချာအောင် လုပ်ပါ။

## Type-Safety နဲ့ Code Generation (Type-Safety and Code Generation)

React Query ကို `graphql-request^5` နဲ့ [GraphQL Code Generator](https://graphql-code-generator.com/) တို့နဲ့ တွဲသုံးလိုက်ရင် — full-typed GraphQL operations တွေ ရနိုင်ပါတယ်:

```tsx
import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import { graphql } from './gql/gql'

const allFilmsWithVariablesQueryDocument = graphql(/* GraphQL */ `
  query allFilmsWithVariablesQuery($first: Int!) {
    allFilms(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`)

function App() {
  // `data` is fully typed!
  const { data } = useQuery({
    queryKey: ['films'],
    queryFn: async () =>
      request(
        'https://swapi-graphql.netlify.app/.netlify/functions/index',
        allFilmsWithVariablesQueryDocument,
        // variables are type-checked too!
        { first: 10 },
      ),
  })
  // ...
}
```

_[Repo ထဲမှာ ဥပမာ အပြည့်အစုံ](https://github.com/dotansimha/graphql-code-generator/tree/7c25c4eeb77f88677fd79da557b7b5326e3f3950/examples/front-end/react/tanstack-react-query) တစ်ခုကို ရှာတွေ့နိုင်ပါတယ်_

[GraphQL Code Generator documentation ပေါ်က သီးသန့် guide](https://www.the-guild.dev/graphql/codegen/docs/guides/react-vue) နဲ့ စတင်လိုက်ပါ။
