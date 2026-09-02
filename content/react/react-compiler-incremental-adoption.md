---
title: "React Compiler — Incremental Adoption (တဖြည်းဖြည်း စတင်အသုံးပြုခြင်း)"
description: "React Compiler ကို တဖြည်းဖြည်း မိတ်ဆက်နည်း — Babel overrides နဲ့ directory-based adoption၊ \"use memo\" directive နဲ့ opt-in၊ \"use no memo\" directive၊ runtime feature flags (gating) နဲ့ adoption တိုးတက်မှု စောင့်ကြည့်ခြင်း"
order: 122
source: "https://react.dev/learn/react-compiler/incremental-adoption"
status: translated
updated: 2026-09-02
---

React Compiler ကို တဖြည်းဖြည်း (incrementally) စတင်အသုံးပြုနိုင်ပြီး — သင့် codebase ရဲ့ သီးခြား အစိတ်အပိုင်းတွေပေါ်မှာ အရင်ဆုံး စမ်းသုံးခွင့် ပြုပါတယ်။ ဒီ guide က ရှိပြီးသား projects တွေထဲမှာ compiler ကို တဖြည်းဖြည်း ဘယ်လို ဖြန့်ချီမလဲ ပြသပါတယ်။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- ဘာကြောင့် incremental adoption ကို အကြံပြုလဲ
- Directory-based adoption အတွက် Babel overrides သုံးခြင်း
- Opt-in compilation အတွက် "use memo" directive သုံးခြင်း
- Components တွေကို ဖယ်ထုတ်ဖို့ "use no memo" directive သုံးခြင်း
- Gating ပါတဲ့ runtime feature flags
- သင့် adoption တိုးတက်မှုကို စောင့်ကြည့်ခြင်း

## ဘာကြောင့် Incremental Adoption လဲ?

React Compiler က သင့် codebase တစ်ခုလုံးကို အလိုအလျောက် optimize လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပေမယ့် — အားလုံးကို တစ်ပြိုင်နက် စတင်သုံးစရာ မလိုပါဘူး။ Incremental adoption က ဖြန့်ချီမှု လုပ်ငန်းစဉ်အပေါ် ထိန်းချုပ်မှု ပေးပြီး — ကျန်တဲ့ သင့် app ဆီ မချဲ့ခင် — သင့် app ရဲ့ သေးငယ်တဲ့ အစိတ်အပိုင်းတွေပေါ်မှာ compiler ကို စမ်းသပ်ခွင့် ပြုပါတယ်။

သေးငယ်စွာ စတင်တာက compiler ရဲ့ optimizations တွေအပေါ် ယုံကြည်မှု တည်ဆောက်ဖို့ ကူညီပါတယ်။ Compiled code နဲ့ သင့် app က မှန်ကန်စွာ ပြုမူကြောင်း စစ်ဆေးနိုင်ပြီး — performance တိုးတက်မှုတွေကို တိုင်းတာနိုင်ကာ — သင့် codebase အတွက် သီးခြားဖြစ်တဲ့ edge cases တွေကိုပါ ခွဲခြားသိရှိနိုင်ပါတယ်။ ဒီနည်းလမ်းက stability အရေးကြီးဆုံး production applications တွေအတွက် အထူး တန်ဖိုးရှိပါတယ်။

Incremental adoption က compiler တွေ့ရှိနိုင်တဲ့ Rules of React violations တွေကို ကိုင်တွယ်ဖို့လည်း ပိုလွယ်ကူစေပါတယ်။ Violations တွေကို သင့် codebase တစ်ခုလုံးမှာ တစ်ပြိုင်နက် ပြင်မယ့်အစား — compiler coverage ကို ချဲ့ထွင်လာတာနဲ့အမျှ — စနစ်တကျ ကိုင်တွယ်နိုင်ပါတယ်။ ဒါက migration ကို စီမံနိုင်စေပြီး — bugs တွေ မိတ်ဆက်နိုင်ခြေ အန္တရာယ်ကို လျှော့ချပေးပါတယ်။

သင့် code ရဲ့ ဘယ်အပိုင်းတွေကို compile လုပ်မလဲ ထိန်းချုပ်ခြင်းအားဖြင့် — compiler ရဲ့ optimizations တွေရဲ့ လက်တွေ့ကမ္ဘာ သက်ရောက်မှုကို တိုင်းတာဖို့ A/B tests တွေလည်း run နိုင်ပါတယ်။ ဒီ data က အပြည့်အဝ adoption အကြောင်း အသိဉာဏ်ရှိရှိ ဆုံးဖြတ်ချက်တွေ ချနိုင်စေပြီး — သင့် team ကို တန်ဖိုး သက်သေပြနိုင်ပါတယ်။

## Incremental Adoption အတွက် နည်းလမ်းများ

React Compiler ကို တဖြည်းဖြည်း စတင်သုံးဖို့ အဓိက နည်းလမ်း သုံးခု ရှိပါတယ်:

1. **Babel overrides** — Compiler ကို သီးခြား directories တွေဆီ သက်ရောက်စေခြင်း
2. **"use memo" နဲ့ opt-in** — အတိအကျ opt in လုပ်ထားတဲ့ components တွေကိုပဲ compile လုပ်ခြင်း
3. **Runtime gating** — Feature flags တွေနဲ့ compilation ကို ထိန်းချုပ်ခြင်း

နည်းလမ်း အားလုံးက အပြည့်အဝ ဖြန့်ချီခြင်း မလုပ်ခင် — သင့် application ရဲ့ သီးခြား အစိတ်အပိုင်းတွေပေါ်မှာ compiler ကို စမ်းသပ်ခွင့် ပြုပါတယ်။

## Babel Overrides တွေနဲ့ Directory-Based Adoption

Babel ရဲ့ `overrides` option က သင့် codebase ရဲ့ မတူတဲ့ အစိတ်အပိုင်းတွေဆီ မတူတည်တဲ့ plugins တွေကို သက်ရောက်စေနိုင်ပါတယ်။ ဒါက React Compiler ကို directory တစ်ခုချင်းစီအလိုက် တဖြည်းဖြည်း စတင်သုံးဖို့ အကောင်းဆုံးပါ။

### အခြေခံ Configuration

Compiler ကို သီးခြား directory တစ်ခုဆီ ဦးစွာ သက်ရောက်စေခြင်းဖြင့် စတင်ပါ:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### Coverage ချဲ့ထွင်ခြင်း

ယုံကြည်မှု တိုးလာတာနဲ့အမျှ — directories တွေ ထပ်ထည့်ပါ:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### Compiler Options တွေနဲ့

Override တစ်ခုချင်းစီအတွက် compiler options တွေကိုလည်း configure လုပ်နိုင်ပါတယ်:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    }
  ]
};
```

## "use memo" နဲ့ Opt-in Mode

အမြင့်ဆုံး ထိန်းချုပ်မှုအတွက် — `compilationMode: 'annotation'` ကို သုံးပြီး — `"use memo"` directive နဲ့ အတိအကျ opt in လုပ်တဲ့ components နဲ့ hooks တွေကိုပဲ compile လုပ်နိုင်ပါတယ်။

> **မှတ်ချက်** — ဒီနည်းလမ်းက components နဲ့ hooks တစ်ခုချင်းစီအပေါ် အနုစိတ်တဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။ Directories တစ်ခုလုံးကို မထိခိုက်စေဘဲ — သီးခြား components တွေပေါ်မှာ compiler ကို စမ်းသပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

### Annotation Mode Configuration

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### Directive ကို သုံးခြင်း

Compile လုပ်ချင်တဲ့ functions တွေရဲ့ အစမှာ `"use memo"` ကို ထည့်ပါ:

```js
function TodoList({ todos }) {
  "use memo"; // Opt this component into compilation

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Opt this hook into compilation

  return data.slice().sort();
}
```

`compilationMode: 'annotation'` နဲ့ဆိုရင် သင်က အောက်ပါတို့ကို လုပ်ရပါမယ်:

- Optimize လုပ်ချင်တဲ့ component တိုင်းမှာ `"use memo"` ထည့်ခြင်း
- Custom hook တိုင်းမှာ `"use memo"` ထည့်ခြင်း
- Component အသစ်တွေမှာ ထည့်ဖို့ မမေ့ခြင်း

ဒါက compiler ရဲ့ သက်ရောက်မှုကို အကဲဖြတ်နေစဉ် — ဘယ် components တွေကို compile လုပ်မလဲအပေါ် တိကျတဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။

## Gating ပါတဲ့ Runtime Feature Flags

`gating` option က feature flags တွေကို သုံးပြီး runtime မှာ compilation ကို ထိန်းချုပ်နိုင်စေပါတယ်။ ဒါက A/B tests run ဖို့ ဒါမှမဟုတ် — user segments တွေကို အခြေခံပြီး compiler ကို တဖြည်းဖြည်း ဖြန့်ချီဖို့ အသုံးဝင်ပါတယ်။

### Gating ဘယ်လို အလုပ်လုပ်လဲ

Compiler က optimized code ကို runtime check တစ်ခုထဲမှာ ထုပ်ပေးပါတယ်။ Gate က `true` ပြန်ပေးရင် — optimized version က run ပါတယ်။ မဟုတ်ရင် — မူရင်း code က run ပါတယ်။

### Gating Configuration

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### Feature Flag ကို အကောင်အထည်ဖော်ခြင်း

သင့် gating function ကို export လုပ်တဲ့ module တစ်ခု ဖန်တီးပါ:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

## Adoption Troubleshooting

Adoption အတွင်း ပြဿနာတွေ ကြုံရရင်:

1. ပြဿနာရှိတဲ့ components တွေကို ခဏတာ ဖယ်ထုတ်ဖို့ `"use no memo"` ကို သုံးပါ
2. သာမန် ပြဿနာတွေအတွက် [debugging guide](/docs/react/react-compiler-debugging) ကို ကြည့်ပါ
3. ESLint plugin က ခွဲခြားသိရှိတဲ့ Rules of React violations တွေကို ပြင်ပါ
4. ပိုပြီး တဖြည်းဖြည်း စတင်သုံးဖို့ `compilationMode: 'annotation'` ကို သုံးစဉ်းစားပါ

## နောက်အဆင့်များ

- Options တွေ ပိုသိရဖို့ [configuration guide](https://react.dev/reference/react-compiler/configuration) ကို ဖတ်ပါ
- [Debugging techniques](/docs/react/react-compiler-debugging) အကြောင်း လေ့လာပါ
- Compiler options တွေ အားလုံးအတွက် [API reference](https://react.dev/reference/react-compiler/configuration) ကို စစ်ဆေးပါ
