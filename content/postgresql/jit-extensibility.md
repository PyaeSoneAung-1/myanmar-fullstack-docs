---
title: "Extensibility (JIT extensibility / တိုးချဲ့နိုင်မှု)"
description: "PostgreSQL JIT ရဲ့ extensibility အကြောင်း — extension များအတွက် inlining support (bitcode ဖိုင် ထည့်သွင်းခြင်း) နှင့် pluggable JIT provider များ၊ _PG_jit_provider_init interface အကြောင်း ရှင်းလင်းချက်"
order: 244
source: "https://www.postgresql.org/docs/current/jit-extensibility.html"
status: translated
updated: 2026-09-11
---

## 30.4. Extensibility (extensibility / တိုးချဲ့နိုင်မှု)

- **30.4.1. Inlining Support for Extensions (extension များအတွက် inlining support)**
- **30.4.2. Pluggable JIT Providers (plug လုပ်နိုင်သော JIT provider များ)**

### 30.4.1. Inlining Support for Extensions (extension များအတွက် inlining support)

PostgreSQL ရဲ့ JIT implementation က `C` နဲ့ `internal` အမျိုးအစားတွေရဲ့ function body တွေကိုရော — အဲဒီလို function တွေကို အခြေခံတဲ့ operator တွေကိုပါ — inline လုပ်နိုင်ပါတယ်။ Extension တွေထဲက function တွေအတွက် ဒါကို လုပ်ဖို့ — အဲဒီ function တွေရဲ့ definition တွေကို ရရှိနိုင်အောင် လုပ်ပေးရပါမယ်။ LLVM JIT support နဲ့ compile လုပ်ထားတဲ့ server တစ်ခုအပေါ် extension တစ်ခုကို build လုပ်ဖို့ [PGXS](https://www.postgresql.org/docs/current/extend-pgxs.html) ကို သုံးတဲ့အခါ — သက်ဆိုင်ရာ file တွေကို အလိုအလျောက် build လုပ်ပြီး install လုပ်ပေးပါလိမ့်မယ်။

သက်ဆိုင်ရာ file တွေကို `$pkglibdir/bitcode/$extension/` ထဲကိုလည်းကောင်း — သူတို့ရဲ့ summary တစ်ခုကို `$pkglibdir/bitcode/$extension.index.bc` ထဲကိုလည်းကောင်း install လုပ်ရပါမယ်။ ဒီမှာ `$pkglibdir` ဆိုတာ `pg_config --pkglibdir` က ပြန်ပေးတဲ့ directory ဖြစ်ပြီး — `$extension` ဆိုတာ extension ရဲ့ shared library ရဲ့ base name ဖြစ်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL ကိုယ်တိုင် ထည့်သွင်းထားတဲ့ (built-in) function တွေအတွက်တော့ bitcode ကို `$pkglibdir/bitcode/postgres` ထဲ install လုပ်ပါတယ်။

### 30.4.2. Pluggable JIT Providers (plug လုပ်နိုင်သော JIT provider များ)

PostgreSQL က LLVM ကို အခြေခံတဲ့ JIT implementation တစ်ခုကို ပေးထားပါတယ်။ JIT provider ဆီသွားတဲ့ interface က pluggable ဖြစ်ပြီး — provider ကို recompile မလုပ်ဘဲ ပြောင်းလဲနိုင်ပါတယ် (လက်ရှိမှာတော့ build process က LLVM အတွက် inlining support data ကိုသာ ပေးထားပါတယ်)။ အသုံးပြုနေတဲ့ provider ကို [jit_provider](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-JIT-PROVIDER) setting ကတစ်ဆင့် ရွေးချယ်ပါတယ်။

#### 30.4.2.1. JIT Provider Interface (JIT provider interface)

JIT provider တစ်ခုကို — အမည်ပေးထားတဲ့ shared library ကို dynamically load လုပ်ခြင်းအားဖြင့် load လုပ်ပါတယ်။ Library ကို ရှာဖွေဖို့ ပုံမှန် library search path ကို သုံးပါတယ်။ လိုအပ်တဲ့ JIT provider callback တွေကို ပေးဖို့နဲ့ — library က တကယ်တမ်း JIT provider ဖြစ်ကြောင်း ညွှန်ပြဖို့ — ဒါက `_PG_jit_provider_init` လို့ အမည်ရတဲ့ C function တစ်ခုကို ပေးရပါမယ်။ ဒီ function ကို — လုပ်ဆောင်ချက် တစ်ခုချင်းစီအတွက် callback function pointer တွေနဲ့ ဖြည့်ရမယ့် struct တစ်ခုကို ပေးအပ်ပါတယ်:

```sql
struct JitProviderCallbacks
{
    JitProviderResetAfterErrorCB reset_after_error;
    JitProviderReleaseContextCB release_context;
    JitProviderCompileExprCB compile_expr;
};

extern void _PG_jit_provider_init(JitProviderCallbacks *cb);
```
