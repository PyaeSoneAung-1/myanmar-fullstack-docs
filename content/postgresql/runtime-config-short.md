---
title: "Short Options (အတိုကောက် Option များ)"
description: "PostgreSQL parameter အချို့အတွက် single letter command-line option switch အတိုကောက်များနှင့် ၎င်းတို့နှင့် ညီမျှသော setting များ — ဇယား 19.5 Short Option Key အကြောင်း"
order: 173
source: "https://www.postgresql.org/docs/current/runtime-config-short.html"
status: translated
updated: 2026-09-11
---

## 19.18. Short Options (အတိုကောက် Option များ)

အဆင်ပြေစေဖို့ — parameter အချို့အတွက် single letter command-line option switch များလည်း ရရှိနိုင်ပါတယ်။ ဒါတွေကို [ဇယား 19.5](/docs/postgresql/runtime-config-short) မှာ ဖော်ပြထားပါတယ်။ ဒီ option တချို့က သမိုင်းဝင် အကြောင်းရင်းများကြောင့် ရှိနေတာ ဖြစ်ပြီး — single-letter option အဖြစ် ရှိနေခြင်းက အဲဒီ option ကို အများကြီး သုံးသင့်တယ်လို့ ထောက်ခံချက် ပေးတာ မဟုတ်ပါဘူး။

**Table 19.5. Short Option Key (အတိုကောက် Option Key)**

| အတိုကောက် Option | ညီမျှသော သတ်မှတ်ချက် |
| --- | --- |
| `-B x` | `shared_buffers = x` |
| `-d x` | `log_min_messages = DEBUGx` |
| `-e` | `datestyle = euro` |
| `-fb`, `-fh`, `-fi`, `-fm`, `-fn`, `-fo`, `-fs`, `-ft` | `enable_bitmapscan = off`, `enable_hashjoin = off`, `enable_indexscan = off`, `enable_mergejoin = off`, `enable_nestloop = off`, `enable_indexonlyscan = off`, `enable_seqscan = off`, `enable_tidscan = off` |
| `-F` | `fsync = off` |
| `-h x` | `listen_addresses = x` |
| `-i` | `listen_addresses = '*'` |
| `-k x` | `unix_socket_directories = x` |
| `-l` | `ssl = on` |
| `-N x` | `max_connections = x` |
| `-O` | `allow_system_table_mods = on` |
| `-p x` | `port = x` |
| `-P` | `ignore_system_indexes = on` |
| `-s` | `log_statement_stats = on` |
| `-S x` | `work_mem = x` |
| `-tpa`, `-tpl`, `-te` | `log_parser_stats = on`, `log_planner_stats = on`, `log_executor_stats = on` |
| `-W x` | `post_auth_delay = x` |
