---
title: "Editor Setup (Editor ပြင်ဆင်ခြင်း)"
description: "React development အတွက် editor ပြင်ဆင်ခြင်း — VS Code နဲ့ အခြား editors, ESLint + eslint-plugin-react-hooks နဲ့ linting, Prettier နဲ့ format on save"
order: 48
source: "https://react.dev/learn/editor-setup"
status: translated
updated: 2026-09-02
---

## Editor ပြင်ဆင်ခြင်း

ကောင်းကောင်း configure လုပ်ထားတဲ့ editor တစ်ခုက — code တွေကို ပိုရှင်းရှင်းလင်းလင်း ဖတ်လို့ရအောင်၊ ပိုမြန်မြန် ရေးလို့ရအောင် လုပ်ပေးပါတယ်။ ရေးနေတုန်းမှာကို bugs တွေ ဖမ်းမိအောင်တောင် ကူညီပေးနိုင်ပါတယ်။ Editor တစ်ခုကို ပထမဆုံးအကြိမ် setup လုပ်တာပဲ ဖြစ်ဖြစ် — လက်ရှိ editor ကို ပြုပြင်ချင်တာပဲ ဖြစ်ဖြစ် — အကြံပြုချက်တချို့ ရှိပါတယ်။ ဒီစာမျက်နှာမှာ — လူကြိုက်အများဆုံး editors တွေက ဘာတွေလဲ၊ ကိုယ့် code တွေကို အလိုအလျောက် ဘယ်လို format လုပ်မလဲ ဆိုတာ လေ့လာရမှာ ဖြစ်ပါတယ်။

## Editor ရွေးချယ်ခြင်း

[VS Code](https://code.visualstudio.com/) က ဒီနေ့ခေတ် အသုံးအများဆုံး editors တွေထဲက တစ်ခုပါ — extensions တွေရဲ့ marketplace ကြီးကြီး ရှိပြီး — GitHub လို လူကြိုက်များတဲ့ services တွေနဲ့ ကောင်းကောင်း ပေါင်းစပ်အလုပ်လုပ်နိုင်ပါတယ်။ အောက်မှာ ဖော်ပြမယ့် features အများစုကို VS Code မှာ extensions အနေနဲ့ ထည့်လို့ရတာမို့ — highly configurable ဖြစ်ပါတယ်!

React community မှာ သုံးနေကြတဲ့ တခြား popular text editors တွေကတော့:

- [WebStorm](https://www.jetbrains.com/webstorm/) — JavaScript အတွက် သီးသန့် ဒီဇိုင်းလုပ်ထားတဲ့ integrated development environment (IDE) တစ်ခုပါ။
- [Sublime Text](https://www.sublimetext.com/) — JSX နဲ့ TypeScript အတွက် [syntax highlighting](https://stackoverflow.com/a/70960574/458193) နဲ့ autocomplete တွေ built-in ပါဝင်ပါတယ်။
- [Vim](https://www.vim.org/) — text တွေကို ဖန်တီးခြင်း/ပြောင်းလဲခြင်း မှန်သမျှကို အလွန် ထိရောက်အောင် လုပ်ဖို့ တည်ဆောက်ထားတဲ့ highly configurable text editor တစ်ခုပါ — UNIX systems အများစုနဲ့ Apple OS X တွေမှာ "vi" အနေနဲ့ ပါဝင်ပါတယ်။

## အကြံပြုထားတဲ့ Editor Features တွေ

Editor တချို့မှာ ဒီ features တွေ built-in ပါဝင်ပေမယ့် — တချို့မှာတော့ extension တစ်ခု ထပ်ထည့်ဖို့ လိုနိုင်ပါတယ်။ ကိုယ်ရွေးထားတဲ့ editor က ဘယ်အထိ support လုပ်ပေးလဲ သေချာအောင် စစ်ကြည့်ပါ။

### Linting

Code linters တွေက သင် ရေးနေတုန်းမှာကို code ထဲက ပြဿနာတွေကို ရှာဖွေပေးပြီး — စောစောစီးစီး ပြုပြင်နိုင်အောင် ကူညီပေးပါတယ်။ [ESLint](https://eslint.org/) က JavaScript အတွက် လူကြိုက်များတဲ့ open source linter တစ်ခုပါ။

- [React အတွက် အကြံပြုထားတဲ့ configuration နဲ့အတူ ESLint ကို install လုပ်ပါ](https://www.npmjs.com/package/eslint-config-react-app) ([Node တစ်ခု install ထားဖို့ သေချာပါစေ!](https://nodejs.org/en/download/current/))
- [VS Code ထဲမှာ official extension နဲ့ ESLint ကို integrate လုပ်ပါ](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**သင့် project အတွက် [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) rules တွေ အားလုံးကို enable လုပ်ထားဖို့ သေချာပါစေ။** ဒီ rules တွေက မရှိမဖြစ် လိုအပ်ပြီး — အဆိုးရွားဆုံး bugs တွေကို စောစောစီးစီး ဖမ်းပေးပါတယ်။ အကြံပြုထားတဲ့ [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset ထဲမှာ ဒီ rules တွေ ပါပြီးသားပါ။

### Formatting

ကိုယ့် code ကို တခြား contributor တစ်ယောက်နဲ့ share လုပ်တဲ့အခါ — [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces) အကြောင်း ငြင်းခုံချင်မှာ မဟုတ်ပါဘူး! ကံကောင်းတာက [Prettier](https://prettier.io/) က — ကြိုတင်သတ်မှတ်ထားတဲ့ configurable rules တွေနဲ့ ကိုက်ညီအောင် code ကို reformat လုပ်ပြီး သန့်ရှင်းပေးပါလိမ့်မယ်။ Prettier ကို run လိုက်ရင် — tabs တွေ အားလုံး spaces တွေ ဖြစ်သွားပြီး — indentation, quotes စတာတွေပါ configuration နဲ့ ကိုက်ညီအောင် ပြောင်းလဲသွားပါလိမ့်မယ်။ အကောင်းဆုံး setup မှာတော့ — file ကို save လုပ်တဲ့အခါ Prettier က အလိုအလျောက် run ပြီး — ဒီပြောင်းလဲမှုတွေကို ချက်ချင်း လုပ်ပေးမှာ ဖြစ်ပါတယ်။

[VS Code ထဲမှာ Prettier extension ကို](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) ဒီအဆင့်တွေအတိုင်း လုပ်ပြီး install လုပ်နိုင်ပါတယ်:

1. VS Code ကို ဖွင့်ပါ
2. Quick Open ကို သုံးပါ (Ctrl/Cmd+P နှိပ်ပါ)
3. `ext install esbenp.prettier-vscode` ကို paste လုပ်ပါ
4. Enter နှိပ်ပါ

#### Save လုပ်တိုင်း Format လုပ်ခြင်း (Formatting on Save)

စံပြအနေနဲ့ဆိုရင် — save လုပ်တိုင်း code ကို format လုပ်ထားသင့်ပါတယ် — VS Code မှာ ဒီအတွက် settings တွေ ရှိပါတယ်!

1. VS Code ထဲမှာ `CTRL/CMD + SHIFT + P` ကို နှိပ်ပါ
2. "settings" လို့ ရိုက်ပါ
3. Enter နှိပ်ပါ
4. Search bar ထဲမှာ "format on save" လို့ ရိုက်ပါ
5. "format on save" option tick ဖြစ်နေဖို့ သေချာပါစေ!

> သင့် ESLint preset မှာ formatting rules တွေ ပါနေရင် — Prettier နဲ့ conflict ဖြစ်နိုင်ပါတယ်။ [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) ကို သုံးပြီး ESLint preset ထဲက formatting rules တွေ အားလုံးကို disable လုပ်ဖို့ အကြံပြုပါတယ် — ဒါဆိုရင် ESLint က logical mistakes တွေကို ဖမ်းဖို့အတွက်ပဲ သီးသန့် သုံးဖြစ်မှာ ဖြစ်ပါတယ်။ Pull request တစ်ခု merge မလုပ်ခင် files တွေ formatted ဖြစ်နေဖို့ enforce လုပ်ချင်ရင် — သင့် continuous integration ထဲမှာ [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) ကို သုံးပါ။
