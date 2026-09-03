---
title: "Newman command ကိုးကားချက် (Newman command reference)"
description: "Newman ရဲ့ command line options အားလုံးအတွက် ကိုးကားချက် — collection run setup လုပ်ခြင်း, request delays/timeouts, SSL, output, reporters စတဲ့ options တွေ၊ exit statuses နဲ့ data file ဥပမာများ"
order: 151
source: "https://learning.postman.com/docs/reference/newman-cli/newman-options/"
status: translated
updated: 2026-09-03
---

Newman ရဲ့ command line options တွေကို သုံးပြီး — သင့် collection runs တွေကို customize လုပ်နိုင်ပါတယ်။ Options တွေနဲ့ collection run တစ်ခုကို setup လုပ်ခြင်း၊ request delays နဲ့ timeouts တွေ configure လုပ်ခြင်း၊ SSL အသေးစိတ်တွေ သတ်မှတ်ခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။ Collection တစ်ခုကို iteration အများအပြားနဲ့ run တဲ့အခါ — iteration တစ်ခုချင်းစီအတွက် [data sets နဲ့ variables အမျိုးမျိုး သတ်မှတ်နိုင်ပါတယ်](#data-file-example-ဒေတာ-file-ဥပမာ)။ Run တစ်ခု ပြီးတာနဲ့ Newman က သင့် continuous integration (CI) tool ဆီ ပေးပို့နိုင်တဲ့ [status code](#exit-status-ထွက်ပေါက်-status-code) တစ်ခုနဲ့ ထွက်ပါတယ်။

Options တွေ သုံးဖို့ — [collection file ဒါမှမဟုတ် URL ကို သတ်မှတ်ပြီး](/docs/postman/newman-installing-running) `newman run` command မှာ ထည့်ပါ:

```bash
newman run my-collection.json [options]
```

Newman အတွက် ရနိုင်တဲ့ options တွေရဲ့ စာရင်းကို ကြည့်ဖို့ အောက်ပါ command ကို run ပါ:

```bash
newman run -h
```

## Basic options (အခြေခံ option များ)

**`-h, --help`**

Usage (အသုံးပြုပုံ) အချက်အလက်တွေကို ပြသပါတယ်။

---

**`-v, --version`**

Version နံပါတ်ကို ပြသပါတယ်။

---

## Setup options (run ပြင်ဆင်ရန် option များ)

**`-e, --environment [file\|URL]`**

Environment variables တွေရဲ့ file path ဒါမှမဟုတ် URL ကို သတ်မှတ်ပါ။

---

**`-g, --globals [file\|URL]`**

Global variables တွေရဲ့ file path ဒါမှမဟုတ် URL ကို သတ်မှတ်ပါ။

---

**`-d, --iteration-data [file]`**

Iteration တစ်ခုချင်းစီအတွက် သုံးမယ့် data file (JSON ဒါမှမဟုတ် CSV) တစ်ခုရဲ့ local file path ကို သတ်မှတ်ပါ။ ပိုလေ့လာချင်ရင် — [Data file example](#data-file-example-ဒေတာ-file-ဥပမာ) ကို ကြည့်ပါ။

---

**`-n, --iteration-count [number]`**

Collection run လုပ်ရမယ့် အကြိမ်အရေအတွက်ကို သတ်မှတ်ပါ။ Iteration data file နဲ့ တွဲပြီး သုံးပါ။

---

**`--folder [folderName]`**

Requests တွေ run လုပ်မယ့် folder တစ်ခုကို သတ်မှတ်ပါ။ ဒီ option ကို အကြိမ်များစွာ သုံးပြီး folder တစ်ခုထက်ပိုပြီးလည်း သတ်မှတ်နိုင်ပါတယ် — option ကို သုံးတိုင်း folder တစ်ခုစီ သတ်မှတ်ရပါတယ်။

---

**`--working-dir [path]`**

Relative paths တွေနဲ့ files တွေကို ဖတ်တဲ့အခါ သုံးမယ့် working directory ရဲ့ path ကို သတ်မှတ်ပါ။ ပုံမှန်အားဖြင့် လက်ရှိ directory ကို သုံးပါတယ်။

---

**`--no-insecure-file-read`**

Working directory အပြင်ဘက်မှာ ရှိတဲ့ files တွေကို ဖတ်တာကို တားဆီးပါတယ်။

---

**`--export-environment [path]`**

Run တစ်ခု မပြီးဆုံးခင် — Newman က နောက်ဆုံး environment variables file ကို ထုတ်ပေးမယ့် file ရဲ့ path ပါ။

---

**`--export-globals [path]`**

Run တစ်ခု မပြီးဆုံးခင် — Newman က နောက်ဆုံး global variables file ကို ထုတ်ပေးမယ့် file ရဲ့ path ပါ။

---

**`--export-collection [path]`**

Run တစ်ခု မပြီးဆုံးခင် — Newman က နောက်ဆုံး collection file ကို ထုတ်ပေးမယ့် file ရဲ့ path ပါ။

---

**`--postman-api-key [api-key]`**

Postman API ကို သုံးပြီး resources တွေ load လုပ်ဖို့ သုံးတဲ့ [Postman API key](https://learning.postman.com/docs/reference/postman-api/authentication/) ပါ။

---

## Request options (request ဆိုင်ရာ option များ)

**`--delay-request [number]`**

Requests တွေကြားမှာ delay (milliseconds) တစ်ခုကို သတ်မှတ်ပါ။

---

**`--timeout [number]`**

Collection run တစ်ခုလုံး ပြီးမြောက်ဖို့ စောင့်ဆိုင်းရမယ့် အချိန် (milliseconds) ကို သတ်မှတ်ပါ။

---

**`--timeout-request [number]`**

Requests တွေ response ပြန်ရဖို့ စောင့်ဆိုင်းရမယ့် အချိန် (milliseconds) ကို သတ်မှတ်ပါ။

---

**`--timeout-script [number]`**

Scripts တွေ ပြီးမြောက်ဖို့ စောင့်ဆိုင်းရမယ့် အချိန် (milliseconds) ကို သတ်မှတ်ပါ။

---

## SSL options (SSL ဆိုင်ရာ option များ)

**`--ssl-client-cert [path]`**

Public client certificate file ရဲ့ path ပါ။ Authenticated requests တွေ လုပ်ဖို့ ဒီ option ကို သုံးပါ။

---

**`--ssl-client-key [path]`**

Optional — certificate ရဲ့ ပိုင်ဆိုင်မှုကို စစ်ဆေးပေးတဲ့ private client key ရဲ့ path ကို ထည့်နိုင်ပါတယ်။

---

**`--ssl-client-passphrase [passphrase]`**

Optional — private client key ကို ကာကွယ်ဖို့ secret passphrase တစ်ခု ထည့်နိုင်ပါတယ်။

---

**`--ssl-client-cert-list [path]`**

SSL client certificates စာရင်း ပါဝင်တဲ့ configuration JSON file ရဲ့ path ပါ။ URL ဒါမှမဟုတ် hostname တစ်ခုအလိုက် SSL client certificates အများအပြားကို သတ်မှတ်ဖို့ ဒီ option ကို သုံးပါ။ ပိုလေ့လာချင်ရင် — [client certificate list ဥပမာတစ်ခု](https://github.com/postmanlabs/newman/blob/develop/examples/ssl-client-cert-list.json) ကို ကြည့်ပါ။

ဒီ option က `--ssl-client-cert`, `--ssl-client-key` နဲ့ `--ssl-client-passphrase` options တွေထက် ဦးစားပေးမှု ပိုမြင့်ပါတယ်။ SSL client certificate list ထဲမှာ URL နဲ့ ကိုက်ညီမှု မရှိဘူးဆိုရင် — ဒီ options တွေကို အဲဒီအစား သုံးပါတယ်။

---

**`--ssl-extra-ca-certs [path]`**

PEM format နဲ့ trusted CA certificates တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ပါဝင်တဲ့ file ရဲ့ path ပါ။ [`--insecure` option](#output-options-output-ပြသမှု-ဆိုင်ရာ-option-များ) ကို မသုံးချင်တဲ့အခါ ဒီ option ကို သုံးနိုင်ပါတယ်။

---

## Output options (output ပြသမှု ဆိုင်ရာ option များ)

**`--color [value]`**

CLI output ရဲ့ အရောင်ကို သတ်မှတ်ပါ: `on`, `off` ဒါမှမဟုတ် `auto` (ပုံမှန်)။

---

**`--verbose`**

Collection run နဲ့ ပို့လိုက်တဲ့ request တစ်ခုချင်းစီရဲ့ အသေးစိတ် အချက်အလက်တွေကို ပြသပါတယ်။

---

**`--silent`**

Newman က CLI output ပြသမှုကို တားဆီးပါတယ်။

---

**`-x, --suppress-exit-code`**

လက်ရှိ run အတွက် ပုံမှန် exit code ကို override လုပ်မလား ဆိုတာ သတ်မှတ်ပါ။ Failure ဖြစ်ပြီးနောက်မှာလည်း tests တွေ ဆက်ပြီး run ပါ — ဒါပေမဲ့ `code=0` နဲ့ ထွက်ပါတယ်။ ပိုလေ့လာချင်ရင် — [Exit status](#exit-status-ထွက်ပေါက်-status-code) ကို ကြည့်ပါ။

---

**`--disable-unicode`**

Unicode text encoding ကို ပိတ်ပါ။ ဒီ option ကို ပေးထားရင် output ထဲက သင်္ကေတ အားလုံးကို ၎င်းတို့ရဲ့ plain text နဲ့ ညီမျှတဲ့ပုံစံတွေနဲ့ အစားထိုးပါတယ်။

---

**`-r [reporter-name], --reporters [reporter-name]`**

လက်ရှိ collection run အကြောင်း report တစ်ခု ထုတ်ပေးပါ။ Reporter name တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး သတ်မှတ်ပါ: `cli` (Newman ကို CLI အဖြစ် သုံးတဲ့အခါ ပုံမှန်), `json`, `junit`, `progress` နဲ့ `emojitrain`။ Reporter name တစ်ခုထက်ပိုရင် comma နဲ့ ခွဲထားတဲ့ စာရင်းအနေနဲ့ သတ်မှတ်ပါ — ဥပမာ `-r cli,json`။ [Newman နဲ့ reporters တွေ သုံးခြင်း](/docs/postman/newman-built-in-reporters) အကြောင်း ပိုလေ့လာပါ။

---

## More configuration options (နောက်ထပ် configuration option များ)

**`--bail [optionalModifiers]`**

Test script တစ်ခု fail ဖြစ်တဲ့အခါ collection run ကို ရပ်လိုက်ပါတယ်။

Optional — ဒီ option မှာ modifiers တွေ ထည့်နိုင်ပါတယ်: `folder` နဲ့ `failure`။ `--folder` option နဲ့ folder တစ်ခုကို မမှန်မကန် သတ်မှတ်ခဲ့ရင် ဒါမှမဟုတ် ယေဘုယျအားဖြင့် error တစ်ခု ကြုံခဲ့ရရင် collection run တစ်ခုလုံးကို ကျော်လိုက်ဖို့ `folder` ကို ထည့်နိုင်ပါတယ်။ Test တစ်ခု fail ဖြစ်တဲ့အခါ (လက်ရှိ test script ပြီးတာနဲ့) collection run တစ်ခုလုံးကို ရပ်လိုက်ဖို့ `failure` ကို ထည့်နိုင်ပါတယ်။

---

**`-k, --insecure`**

SSL verification checks တွေကို ပိတ်ပြီး self-signed SSL certificates တွေကို ခွင့်ပြုပါတယ်။

---

**`--ignore-redirects`**

`3XX` redirect responses တွေကို အလိုအလျောက် လိုက်ပါတာကို ပိတ်ပါတယ်။

---

**`--cookie-jar [path]`**

JSON Cookie Jar တစ်ခုရဲ့ file path ကို သတ်မှတ်ပါ။ File ကို deserialize လုပ်ဖို့ `tough-cookie` ကို သုံးပါတယ်။

---

**`--export-cookie-jar [path]`**

Run တစ်ခု မပြီးဆုံးခင် — Newman က နောက်ဆုံး cookie jar file ကို ထုတ်ပေးမယ့် file ရဲ့ path ပါ။ File ကို serialize လုပ်ဖို့ `tough-cookie` ကို သုံးပါတယ်။

---

**`--global-var "[global-variable-name]=[global-variable-value]"`**

Global variables တွေကို command line ပေါ်မှာ key=value format နဲ့ သတ်မှတ်ပေးပါတယ်။ `--global-var` ကို အကြိမ်များစွာ သုံးပြီး global variables အများကြီး ထည့်နိုင်ပါတယ် — ဥပမာ — `--global-var "color=blue" --global-var "pet=cat".`

---

**`--env-var "[environment-variable-name]=[environment-variable-value]"`**

Environment variables တွေကို command line ပေါ်မှာ key=value format နဲ့ သတ်မှတ်ပေးပါတယ်။ `--env-var` ကို အကြိမ်များစွာ သုံးပြီး environment variables အများကြီး ထည့်နိုင်ပါတယ် — ဥပမာ — `--env-var "color=blue" --env-var "pet=cat"`။

---

## Exit status (ထွက်ပေါက် status code)

ပုံမှန်အားဖြင့် Newman က exception တစ်ခုမှ မရှိဘဲ အရာအားလုံး မျှော်လင့်ထားတဲ့အတိုင်း run ပြီးရင် `0` ဆိုတဲ့ status code နဲ့ ထွက်ပါတယ်။ Newman ရဲ့ exit codes တွေပေါ် မူတည်ပြီး build တစ်ခုကို pass ဒါမှမဟုတ် fail ဖြစ်စေဖို့ သင့် continuous integration (CI) tool ကို configure လုပ်နိုင်ပါတယ်။ လက်ရှိ run အတွက် ပုံမှန် exit code ကို override လုပ်ဖို့ — `-x` ဒါမှမဟုတ် `--suppress-exit-code` option ကို သုံးပါ။

Test case error တစ်ခု ကြုံရတဲ့အခါ `1` ဆိုတဲ့ status code နဲ့ run တစ်ခုကို ရပ်စေဖို့ `--bail` option ကို သုံးပါ။ ဒီ status code ကို သင့် CI tool ဒါမှမဟုတ် build system က သုံးနိုင်ပါတယ်။ ဥပမာ:

```bash
newman run my-collection.json -e dev-environment.json --bail
```

## Data file example (ဒေတာ file ဥပမာ)

Collection run တစ်ခုထဲမှာ iteration တစ်ခုချင်းစီအတွက် data ဒါမှမဟုတ် variables အစုံအသစ်တွေ သုံးဖို့ — `-d` option နဲ့ JSON ဒါမှမဟုတ် CSV file တစ်ခုကို သတ်မှတ်ပါ။

အောက်ပါ ဥပမာက iterations နှစ်ခုပါတဲ့ run တစ်ခုအတွက် JSON data file တစ်ခုကို ပြပါတယ် — iteration တစ်ခုချင်းစီမှာ variables တစ်စုအတွက် မတူညီတဲ့ values တွေ သုံးထားပါတယ်။

```json
[
    {
        "url": "http://127.0.0.1:5000",
        "user_id": "1",
        "id": "1",
        "token_id": "123123"
    },
    {
        "url": "http://postman-echo.com",
        "user_id": "2",
        "id": "2",
        "token_id": "899899"
    }
]
```

Collection ကို run ဖို့ — `-d` option ကို သုံးပြီး data file ကို သတ်မှတ်ပါ။ ဥပမာ:

```bash
newman run my-collection.json -d data-file.json
```

အောက်ပါ ဥပမာက အဲဒီ data ကိုပဲ CSV file နဲ့ format လုပ်ထားတာပါ။

```bash
url, user_id, id, token_id
http://127.0.0.1:5000, 1, 1, 123123123
http://postman-echo.com, 2, 2, 899899
```

Collection runs တွေအတွက် data files တွေ format လုပ်ခြင်းအကြောင်း ပိုလေ့လာချင်ရင် — [Imported data သုံးပြီး collections တွေ run လုပ်ခြင်း](/docs/postman/working-with-data-files) ကို ကြည့်ပါ။
