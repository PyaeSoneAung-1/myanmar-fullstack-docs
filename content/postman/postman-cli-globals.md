---
title: "Globals commands (Globals command များ)"
description: "Postman CLI ရဲ့ globals commands — `postman globals lint` command နဲ့ local global variables files တွေကို validate လုပ်နည်း, options နဲ့ ဥပမာများ"
order: 161
source: "https://learning.postman.com/docs/postman-cli/postman-cli-globals/"
status: translated
updated: 2026-09-03
---

ဒီ topic က [Postman CLI](/docs/postman/postman-cli-overview) အတွက် globals commands တွေအကြောင်း ဖော်ပြပါတယ်။

[Global variables](/docs/postman/define-variables) တွေက — active environment ဘယ်လိုပဲ ဖြစ်နေဖြစ်နေ — workspace တစ်ခုလုံးမှာ variables အစုတစ်ခုကို ဝင်ရောက်သုံးပြီး ပြန်သုံးနိုင်စေပါတယ်။ ကိုယ့် local global variables file ကို [Postman workspace တစ်ခုဆီ push မလုပ်ခင်](https://learning.postman.com/docs/postman-cli/postman-cli-workspace/#postman-workspace-push) — globals commands တွေကို သုံးပြီး validate လုပ်နိုင်ပါတယ်။

## `postman globals lint`

ဒီ command က local global variables file တစ်ခုက YAML ခိုင်လုံမှု (valid) ရှိမရှိနဲ့ — မျှော်လင့်ထားတဲ့ structure, field types နဲ့ မဖြစ်မနေ လိုအပ်တဲ့ (required) fields တွေ ပါမပါ စစ်ဆေးပါတယ်။

### Usage (အသုံးပြုပုံ)

```bash
postman globals lint <path> [options]
```

**`<path>`**

Lint လုပ်ချင်တဲ့ global variables file ဒါမှမဟုတ် directory ဆီက path။

---

### Options

**`-o, --output <format>`** — default: cli

Terminal ထဲမှာ ပုံနှိပ်မယ့် lint results တွေရဲ့ format ကို သတ်မှတ်ပါတယ်။ လက်ခံနိုင်တဲ့ values တွေကတော့ — `cli` (လူဖတ်လို့ရတဲ့ output), `table` (လူဖတ်လို့ရတဲ့ table), `json` နဲ့ `csv` တို့ပါ။ Results တွေက file တစ်ခုထဲ သိမ်းမယ့်အစား terminal ထဲမှာပဲ ပုံနှိပ်ပေးပါတယ်။ Results တွေကို သိမ်းချင်ရင် — output ကို file တစ်ခုဆီ redirect လုပ်ပါ။ ဥပမာ — `--output json > results.json`။

---

**`-f, --fail-severity <level>`** — default: error

Command က အရာအားလုံးကို အမြဲတမ်း lint လုပ်ပြီး ပြဿနာအားလုံးကို report လုပ်ပါတယ်။ ဒီ option က exit code ကိုပဲ သတ်မှတ်ပေးတာပါ — diagnostics တွေက ဒီ severity level ဒါမှမဟုတ် အထက်မှာ ရှိနေရင် failure code တစ်ခု ပြန်ပေးပါတယ်။

`error` နဲ့ဆိုရင် — errors တွေ ရှိနေမှသာ command က failure code ပြန်ပေးပါတယ်။ `warning` နဲ့ဆိုရင် — warnings ဒါမှမဟုတ် errors တွေ ရှိနေရင် failure code ပြန်ပေးပါတယ်။ ဒီ failure code က CI/CD ထဲမှာ အရေးအကြီးဆုံးပါ — မခိုင်လုံတဲ့ entities တွေ cloud ဆီ မရောက်ခင် pipeline ကို ရပ်တန့်ဖို့ ဒါမှမဟုတ် pull request check တစ်ခုကို fail လုပ်ဖို့ သုံးနိုင်လို့ပါ။

---

### Examples (ဥပမာများ)

```bash
postman globals lint ./postman/globals

postman globals lint ./postman/globals/workspace.globals.yaml --fail-severity warning

postman globals lint ./postman/globals/workspace.globals.yaml --output json
```
