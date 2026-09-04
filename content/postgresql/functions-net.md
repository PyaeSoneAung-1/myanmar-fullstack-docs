---
title: "Network Address Functions and Operators (network address လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ network address functions များနှင့် operators များ — inet/cidr အတွက် subnet ပါဝင်မှုနှင့် bitwise operators များ၊ IP address functions နှင့် macaddr/macaddr8 functions ဇယားများ (abbrev, broadcast, host, network, set_masklen, trunc, macaddr8_set7bit စသည်)"
order: 79
source: "https://www.postgresql.org/docs/current/functions-net.html"
status: translated
updated: 2026-09-04
---

## 9.12. Network Address Functions and Operators (network address လုပ်ဆောင်ချက်များနှင့် operator များ)

IP network address types တွေဖြစ်တဲ့ `cidr` နဲ့ `inet` တို့က — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ ပုံမှန် comparison operators (နှိုင်းယှဉ် operator များ) တွေကို လည်းကောင်း — ဇယား 9.39 နဲ့ ဇယား 9.40 မှာ ပြထားတဲ့ အထူးပြု (specialized) operators နဲ့ functions တွေကို လည်းကောင်း — ထောက်ပံ့ပေးပါတယ်။

`cidr` တန်ဖိုး မှန်သမျှကို `inet` အဖြစ် implicitly (သွယ်ဝိုက်၍) cast လုပ်လို့ ရပါတယ်; ဒါကြောင့် — အောက်မှာ `inet` ပေါ်မှာ အလုပ်လုပ်တယ်လို့ ပြထားတဲ့ operators နဲ့ functions တွေက — `cidr` တန်ဖိုးတွေမှာလည်း အလုပ်လုပ်ပါတယ်။ (`inet` နဲ့ `cidr` အတွက် functions တွေ သီးခြားစီ ရှိနေတဲ့ နေရာတွေမှာဆိုရင် — အခြေအနေ နှစ်မျိုးအတွက် အပြုအမူ (behavior) ကွဲပြားသင့်လို့ ဖြစ်ပါတယ်။) ဒါ့အပြင် — `inet` တန်ဖိုးတစ်ခုကို `cidr` အဖြစ် cast လုပ်တာကိုလည်း ခွင့်ပြုပါတယ်။ ဒီလို လုပ်လိုက်တဲ့အခါ — netmask ရဲ့ ညာဘက်မှာ ရှိတဲ့ bits တွေကို — valid (မှန်ကန်သော) `cidr` တန်ဖိုးတစ်ခု ဖန်တီးနိုင်ဖို့ — silently (တိတ်တဆိတ်) zeroed (သုည သတ်မှတ်) လုပ်ပါတယ်။

**ဇယား 9.39. IP Address Operators (IP address operator များ)**

| Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| inet << inet → boolean Subnet (ကွန်ရက်ခွဲ) တစ်ခုက နောက် subnet တစ်ခုထဲမှာ strictly contained (တင်းကျပ်စွာ ပါဝင်သည်) လား။ ဒီ operator ရော ၎င်းနောက်က လေးခုပါ — subnet inclusion (subnet ပါဝင်မှု) ကို စမ်းသပ်ပေးပါတယ်။ ၎င်းတို့ဟာ address နှစ်ခုရဲ့ network အပိုင်းတွေကိုပဲ ထည့်သွင်း စဉ်းစားပြီး (netmasks တွေရဲ့ ညာဘက်မှာ ရှိတဲ့ bits တွေကို လျစ်လျူရှုပါတယ်) — network တစ်ခုက နောက် network တစ်ခုနဲ့ တူညီသလား သို့မဟုတ် ၎င်းရဲ့ subnet တစ်ခု ဟုတ်မဟုတ်ကို ဆုံးဖြတ်ပေးပါတယ်။ inet '192.168.1.5' << inet '192.168.1/24' → t inet '192.168.0.5' << inet '192.168.1/24' → f inet '192.168.1/24' << inet '192.168.1/24' → f |
| inet <<= inet → boolean Subnet တစ်ခုက နောက် subnet တစ်ခုထဲမှာ ပါဝင်သလား သို့မဟုတ် ၎င်းနဲ့ တူညီသလား။ inet '192.168.1/24' <<= inet '192.168.1/24' → t |
| inet >> inet → boolean Subnet တစ်ခုက နောက် subnet တစ်ခုကို strictly contain (တင်းကျပ်စွာ ပါဝင်စေသည်) လား။ inet '192.168.1/24' >> inet '192.168.1.5' → t |
| inet >>= inet → boolean Subnet တစ်ခုက နောက် subnet တစ်ခုကို ပါဝင်စေသလား သို့မဟုတ် ၎င်းနဲ့ တူညီသလား။ inet '192.168.1/24' >>= inet '192.168.1/24' → t |
| inet && inet → boolean Subnet တစ်ခုခုက ကျန် တစ်ခုကို ပါဝင်စေသလား သို့မဟုတ် နှစ်ခုလုံး တူညီသလား။ inet '192.168.1/24' && inet '192.168.1.80/28' → t inet '192.168.1/24' && inet '192.168.2.0/28' → f |
| ~ inet → inet bitwise NOT ကို တွက်ချက်ပေးပါတယ်။ ~ inet '192.168.1.6' → 63.87.254.249 |
| inet & inet → inet bitwise AND ကို တွက်ချက်ပေးပါတယ်။ inet '192.168.1.6' & inet '0.0.0.255' → 0.0.0.6 |
| inet \| inet → inet bitwise OR ကို တွက်ချက်ပေးပါတယ်။ inet '192.168.1.6' \| inet '0.0.0.255' → 192.168.1.255 |
| inet + bigint → inet address တစ်ခုကို offset (နေရာရွှေ့ကိန်း) တစ်ခု ပေါင်းထည့်ပေးပါတယ်။ inet '192.168.1.6' + 25 → 192.168.1.31 |
| bigint + inet → inet address တစ်ခုကို offset (နေရာရွှေ့ကိန်း) တစ်ခု ပေါင်းထည့်ပေးပါတယ်။ 200 + inet '::ffff:fff0:1' → ::ffff:255.240.0.201 |
| inet - bigint → inet address တစ်ခုကနေ offset (နေရာရွှေ့ကိန်း) တစ်ခုကို နုတ်ပေးပါတယ်။ inet '192.168.1.43' - 36 → 192.168.1.7 |
| inet - inet → bigint address နှစ်ခုရဲ့ ကွာခြားချက် (difference) ကို တွက်ချက်ပေးပါတယ်။ inet '192.168.1.43' - inet '192.168.1.19' → 24 inet '::1' - inet '::ffff:1' → -4294901760 |

**ဇယား 9.40. IP Address Functions (IP address functions များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| abbrev ( inet ) → text Abbreviated (အတိုကောက်) display format တစ်ခုကို text အဖြစ် ဖန်တီးပေးပါတယ်။ (ရလဒ်က inet output function က ထုတ်ပေးတာနဲ့ အတူတူပါပဲ; “abbreviated” လို့ ဆိုတာက — text အဖြစ် explicit cast လုပ်တဲ့ ရလဒ်နဲ့ ယှဉ်လို့သာ ဖြစ်ပြီး — အဲဒီ cast ကတော့ သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့် netmask အပိုင်းကို ဘယ်တော့မှ မဖျောက်ပါဘူး။) abbrev(inet '10.1.0.0/32') → 10.1.0.0 |
| abbrev ( cidr ) → text Abbreviated (အတိုကောက်) display format တစ်ခုကို text အဖြစ် ဖန်တီးပေးပါတယ်။ (Abbreviation လုပ်တာက — netmask ရဲ့ ညာဘက်မှာ ရှိတဲ့ all-zero octets (သုညချည်း ဖြစ်နေသော octets) တွေကို ဖြုတ်ချလိုက်တာ ဖြစ်ပါတယ်; နောက်ထပ် ဥပမာတွေကို ဇယား 8.22 မှာ ကြည့်ပါ။) abbrev(cidr '10.1.0.0/16') → 10.1/16 |
| broadcast ( inet ) → inet address ရဲ့ network အတွက် broadcast address (broadcast လိပ်စာ) ကို တွက်ချက်ပေးပါတယ်။ broadcast(inet '192.168.1.5/24') → 192.168.1.255/24 |
| family ( inet ) → integer address ရဲ့ family ကို ပြန်ပေးပါတယ်: IPv4 အတွက် 4 ၊ IPv6 အတွက် 6။ family(inet '::1') → 6 |
| host ( inet ) → text Netmask ကို လျစ်လျူရှုပြီး — IP address ကို text အဖြစ် ပြန်ပေးပါတယ်။ host(inet '192.168.1.0/24') → 192.168.1.0 |
| hostmask ( inet ) → inet address ရဲ့ network အတွက် host mask ကို တွက်ချက်ပေးပါတယ်။ hostmask(inet '192.168.23.20/30') → 0.0.0.3 |
| inet_merge ( inet, inet ) → cidr ပေးထားတဲ့ network နှစ်ခုလုံး ပါဝင်တဲ့ — အသေးငယ်ဆုံး network ကို တွက်ချက်ပေးပါတယ်။ inet_merge(inet '192.168.1.5/24', inet '192.168.2.5/24') → 192.168.0.0/22 |
| inet_same_family ( inet, inet ) → boolean addresses တွေက IP family တစ်ခုတည်း ထဲမှာ ပါဝင်မဝင် စစ်ဆေးပေးပါတယ်။ inet_same_family(inet '192.168.1.5/24', inet '::1') → f |
| masklen ( inet ) → integer Netmask ရဲ့ အလျားကို bits နဲ့ ပြန်ပေးပါတယ်။ masklen(inet '192.168.1.5/24') → 24 |
| netmask ( inet ) → inet address ရဲ့ network အတွက် network mask ကို တွက်ချက်ပေးပါတယ်။ netmask(inet '192.168.1.5/24') → 255.255.255.0 |
| network ( inet ) → cidr Netmask ရဲ့ ညာဘက်မှာ ရှိတာမှန်သမျှကို သုည သတ်မှတ်ပြီး — address ရဲ့ network အပိုင်းကို ပြန်ပေးပါတယ်။ (ဒါက တန်ဖိုးကို cidr အဖြစ် cast လုပ်တာနဲ့ ညီမျှပါတယ်။) network(inet '192.168.1.5/24') → 192.168.1.0/24 |
| set_masklen ( inet, integer ) → inet inet တန်ဖိုးတစ်ခုအတွက် netmask အလျားကို သတ်မှတ်ပေးပါတယ်။ Address အပိုင်းကတော့ မပြောင်းလဲပါဘူး။ set_masklen(inet '192.168.1.5/24', 16) → 192.168.1.5/16 |
| set_masklen ( cidr, integer ) → cidr cidr တန်ဖိုးတစ်ခုအတွက် netmask အလျားကို သတ်မှတ်ပေးပါတယ်။ New netmask ရဲ့ ညာဘက်မှာ ရှိတဲ့ address bits တွေကို သုည သတ်မှတ်ပါတယ်။ set_masklen(cidr '192.168.1.0/24', 16) → 192.168.0.0/16 |
| text ( inet ) → text Abbreviation မလုပ်ထားတဲ့ (unabbreviated) IP address နဲ့ netmask အလျားကို text အဖြစ် ပြန်ပေးပါတယ်။ (ဒါက text အဖြစ် explicit cast လုပ်တာနဲ့ ရလဒ် တူညီပါတယ်။) text(inet '192.168.1.5') → 192.168.1.5/32 |

> **အကြံပြုချက်:** `abbrev` ၊ `host` နဲ့ `text` functions တွေက — IP addresses တွေအတွက် မတူညီတဲ့ display formats (ပြသမှု ပုံစံများ) တွေကို ပေးအပ်ဖို့ အဓိက ရည်ရွယ်ထားပါတယ်။

MAC address types တွေဖြစ်တဲ့ `macaddr` နဲ့ `macaddr8` တို့က — [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ ပုံမှန် comparison operators တွေကို လည်းကောင်း — ဇယား 9.41 မှာ ပြထားတဲ့ အထူးပြု functions တွေကို လည်းကောင်း — ထောက်ပံ့ပေးပါတယ်။ ဒါ့အပြင် — bitwise logical operators တွေဖြစ်တဲ့ `~` ၊ `&` နဲ့ `|` (NOT, AND နဲ့ OR) တို့ကိုလည်း — IP addresses တွေအတွက် အပေါ်မှာ ပြထားသလိုပဲ — ထောက်ပံ့ပေးပါတယ်။

**ဇယား 9.41. MAC Address Functions (MAC address functions များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| trunc ( macaddr ) → macaddr address ရဲ့ နောက်ဆုံး 3 bytes တွေကို သုည သတ်မှတ်ပါတယ်။ ကျန်ရှိနေတဲ့ prefix ကို — ထုတ်လုပ်သူ (manufacturer) တစ်ဦးချင်းစီနဲ့ ဆက်စပ်လို့ ရပါတယ် (PostgreSQL ထဲမှာ မပါဝင်တဲ့ data တွေကို သုံးပြီး)။ trunc(macaddr '12:34:56:78:90:ab') → 12:34:56:00:00:00 |
| trunc ( macaddr8 ) → macaddr8 address ရဲ့ နောက်ဆုံး 5 bytes တွေကို သုည သတ်မှတ်ပါတယ်။ ကျန်ရှိနေတဲ့ prefix ကို — ထုတ်လုပ်သူ (manufacturer) တစ်ဦးချင်းစီနဲ့ ဆက်စပ်လို့ ရပါတယ် (PostgreSQL ထဲမှာ မပါဝင်တဲ့ data တွေကို သုံးပြီး)။ trunc(macaddr8 '12:34:56:78:90:ab:cd:ef') → 12:34:56:00:00:00:00:00 |
| macaddr8_set7bit ( macaddr8 ) → macaddr8 address ရဲ့ 7 မြောက် bit ကို one (1) အဖြစ် သတ်မှတ်ပြီး — modified EUI-64 လို့ သိကြတဲ့ ပုံစံကို ဖန်တီးပေးပါတယ် — IPv6 address တစ်ခုထဲမှာ ထည့်သွင်းဖို့အတွက်ပါ။ macaddr8_set7bit(macaddr8 '00:34:56:ab:cd:ef') → 02:34:56:ff:fe:ab:cd:ef |
