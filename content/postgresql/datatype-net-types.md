---
title: "Network Address Types (network address type များ)"
description: "PostgreSQL ရဲ့ network address types — inet, cidr, macaddr, macaddr8 တို့ဖြင့် IPv4/IPv6/MAC address သိုလှောင်မှု၊ input/output ပုံစံများနှင့် sort order"
order: 56
source: "https://www.postgresql.org/docs/current/datatype-net-types.html"
status: translated
updated: 2026-09-03
---

## 8.9. Network Address Types (network address type များ)

- **8.9.1. inet (IPv4/IPv6 host address type)**
- **8.9.2. cidr (IPv4/IPv6 network type)**
- **8.9.3. inet vs. cidr (inet နှင့် cidr ကွာခြားချက်)**
- **8.9.4. macaddr (MAC address type)**
- **8.9.5. macaddr8 (EUI-64 MAC address type)**

PostgreSQL က IPv4, IPv6 နဲ့ MAC addresses တွေကို သိမ်းဆည်းဖို့ data types တွေ ပေးထားပါတယ် — [ဇယား 8.21](/docs/postgresql/datatype-net-types) မှာ ပြထားပါတယ်။ Network addresses (network လိပ်စာများ) တွေကို သိမ်းဆည်းတဲ့အခါ — သာမန် text types တွေအစား ဒီ types တွေကို သုံးတာ ပိုကောင်းပါတယ် — အကြောင်းကတော့ ဒီ types တွေမှာ input error checking (input အမှား စစ်ဆေးခြင်း) နဲ့ အထူးပြု (specialized) operators နဲ့ functions တွေ ပါဝင်လို့ပါ ([အပိုင်း 9.12](/docs/postgresql/functions-net) ကို ကြည့်ပါ)။

**ဇယား 8.21. Network Address Types (network address type များ)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် |
| --- | --- | --- |
| `cidr` | 7 or 19 bytes | IPv4 နှင့် IPv6 networks (ကွန်ရက်များ) |
| `inet` | 7 or 19 bytes | IPv4 နှင့် IPv6 hosts (host များ) နှင့် networks (ကွန်ရက်များ) |
| `macaddr` | 6 bytes | MAC addresses (MAC လိပ်စာများ) |
| `macaddr8` | 8 bytes | MAC addresses (MAC လိပ်စာများ) — EUI-64 format ဖြင့် |

`inet` ဒါမှမဟုတ် `cidr` data types တွေကို sort (စီခြင်း) လုပ်တဲ့အခါ — IPv4 addresses တွေက IPv6 addresses တွေရဲ့ ရှေ့မှာ အမြဲ စီစဉ်ခံရပါတယ် — IPv6 addresses တွေထဲကို encapsulate (ထည့်သွင်း) လုပ်ထားတဲ့ ဒါမှမဟုတ် map (ပြောင်းလဲဖော်ပြ) ထားတဲ့ IPv4 addresses တွေ (ဥပမာ — ::10.2.3.4 သို့မဟုတ် ::ffff:10.4.3.2) တွေလည်း အပါအဝင် ဖြစ်ပါတယ်။

### 8.9.1. `inet` (IPv4/IPv6 host address type)

`inet` type က IPv4 ဒါမှမဟုတ် IPv6 host address (host လိပ်စာ) ကို ထားရှိပြီး — ရွေးချယ်နိုင်တဲ့ အနေနဲ့ ၎င်းရဲ့ subnet (ကွန်ရက်ခွဲ) ကိုပါ field တစ်ခုတည်းထဲမှာ သိမ်းပါတယ်။ Subnet ကို host address ထဲမှာ ပါဝင်တဲ့ network address bits (network လိပ်စာ bit များ) ရဲ့ အရေအတွက်နဲ့ ကိုယ်စားပြုပါတယ် (“netmask” လို့ ခေါ်ပါတယ်)။ Netmask က 32 ဖြစ်ပြီး address က IPv4 ဆိုရင် — အဲဒီ တန်ဖိုးက subnet တစ်ခုကို မဆိုလိုဘဲ host တစ်ခုတည်းကိုပဲ ဆိုလိုပါတယ်။ IPv6 မှာတော့ address ရဲ့ အလျားက 128 bits ဖြစ်လို့ — 128 bits က တမူထူးခြားတဲ့ (unique) host address တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Networks (ကွန်ရက်များ) တွေကိုပဲ လက်ခံချင်တယ်ဆိုရင် — `inet` အစား `cidr` type ကို သုံးသင့်တယ်ဆိုတာ သတိပြုပါ။

ဒီ type အတွက် input format က `address/y` ဖြစ်ပြီး — `address` က IPv4 ဒါမှမဟုတ် IPv6 address ဖြစ်ကာ — `y` က netmask ထဲက bit အရေအတွက် ဖြစ်ပါတယ်။ `/y` အပိုင်းကို ချန်လိုက်ရင် — IPv4 အတွက် netmask ကို 32 လို့ သတ်မှတ်ပြီး — IPv6 အတွက်တော့ 128 လို့ သတ်မှတ်ပါတယ် — ဒါကြောင့် တန်ဖိုးက host တစ်ခုတည်းကိုပဲ ကိုယ်စားပြုပါတယ်။ ပြသမှု (display) မှာတော့ — netmask က host တစ်ခုတည်းကို သတ်မှတ်ပေးရင် `/y` အပိုင်းကို ဖျောက်ထားပါတယ်။

### 8.9.2. `cidr` (IPv4/IPv6 network type)

`cidr` type က IPv4 ဒါမှမဟုတ် IPv6 network specification (ကွန်ရက် သတ်မှတ်ချက်) တစ်ခုကို ထားရှိပါတယ်။ Input နဲ့ output formats တွေက Classless Internet Domain Routing (CIDR) conventions (စည်းမျဉ်းများ) ကို လိုက်နာပါတယ်။ Networks တွေကို သတ်မှတ်တဲ့ format က `address/y` ဖြစ်ပြီး — `address` က network ရဲ့ အနိမ့်ဆုံး address ကို IPv4 ဒါမှမဟုတ် IPv6 address အနေနဲ့ ကိုယ်စားပြုတာ ဖြစ်ကာ — `y` က netmask ထဲက bit အရေအတွက် ဖြစ်ပါတယ်။ `y` ကို ချန်လိုက်ရင် — အရင်ခေတ် classful (အတန်းအလိုက် သတ်မှတ်သော) network numbering system ရဲ့ ယူဆချက်တွေကို သုံးပြီး တွက်ချက်ပါတယ် — ဒါပေမယ့် input ထဲမှာ ရေးထားတဲ့ octets (bytes) တွေ အားလုံး ပါဝင်နိုင်လောက်တဲ့ အနည်းဆုံး အရွယ်အစားတော့ ဖြစ်ရပါမယ်။ သတ်မှတ်ထားတဲ့ netmask ရဲ့ ညာဘက်ခြမ်းမှာ 1 ဖြစ်နေတဲ့ bit တွေ ပါဝင်တဲ့ network address တစ်ခုကို သတ်မှတ်တာကတော့ error (အမှား) ဖြစ်ပါတယ်။

[ဇယား 8.22](/docs/postgresql/datatype-net-types) မှာ ဥပမာ တချို့ ပြထားပါတယ်။

**ဇယား 8.22. cidr Type Input Examples (cidr type input ဥပမာများ)**

| `cidr` Input (ထည့်သွင်းသော တန်ဖိုး) | `cidr` Output (ပြသသော တန်ဖိုး) | `abbrev(cidr)` |
| --- | --- | --- |
| 192.168.100.128/25 | 192.168.100.128/25 | 192.168.100.128/25 |
| 192.168/24 | 192.168.0.0/24 | 192.168.0/24 |
| 192.168/25 | 192.168.0.0/25 | 192.168.0.0/25 |
| 192.168.1 | 192.168.1.0/24 | 192.168.1/24 |
| 192.168 | 192.168.0.0/24 | 192.168.0/24 |
| 128.1 | 128.1.0.0/16 | 128.1/16 |
| 128 | 128.0.0.0/16 | 128.0/16 |
| 128.1.2 | 128.1.2.0/24 | 128.1.2/24 |
| 10.1.2 | 10.1.2.0/24 | 10.1.2/24 |
| 10.1 | 10.1.0.0/16 | 10.1/16 |
| 10 | 10.0.0.0/8 | 10/8 |
| 10.1.2.3/32 | 10.1.2.3/32 | 10.1.2.3/32 |
| 2001:4f8:3:ba::/64 | 2001:4f8:3:ba::/64 | 2001:4f8:3:ba/64 |
| 2001:4f8:3:ba:​2e0:81ff:fe22:d1f1/128 | 2001:4f8:3:ba:​2e0:81ff:fe22:d1f1/128 | 2001:4f8:3:ba:​2e0:81ff:fe22:d1f1/128 |
| ::ffff:1.2.3.0/120 | ::ffff:1.2.3.0/120 | ::ffff:1.2.3/120 |
| ::ffff:1.2.3.0/128 | ::ffff:1.2.3.0/128 | ::ffff:1.2.3.0/128 |

### 8.9.3. `inet` vs. `cidr` (`inet` နှင့် `cidr` ကွာခြားချက်)

`inet` နဲ့ `cidr` data types တွေကြားက အဓိက ကွာခြားချက်ကတော့ — `inet` က netmask ရဲ့ ညာဘက်မှာ သုည မဟုတ်တဲ့ (nonzero) bit တွေ ပါတဲ့ တန်ဖိုးတွေကို လက်ခံပြီး — `cidr` ကတော့ လက်မခံပါဘူး။ ဥပမာ — `192.168.0.1/24` သည် `inet` အတွက် မှန်ကန်သော်လည်း — `cidr` အတွက်တော့ မမှန်ကန်ပါ။

> **အကြံပြုချက်:** `inet` ဒါမှမဟုတ် `cidr` တန်ဖိုးတွေရဲ့ output format ကို မကြိုက်ဘူးဆိုရင် — `host`, `text` နဲ့ `abbrev` function တွေကို စမ်းကြည့်ပါ။

### 8.9.4. `macaddr` (MAC address type)

`macaddr` type က MAC addresses (MAC လိပ်စာများ) တွေကို သိမ်းဆည်းပါတယ် — ဥပမာ Ethernet card ရဲ့ hardware addresses (hardware လိပ်စာများ) တွေကနေ သိကြတဲ့ ပုံစံပါ (MAC addresses တွေကို တခြား ရည်ရွယ်ချက်တွေအတွက်လည်း သုံးကြပေမယ့်)။ Input (ထည့်သွင်းမှု) ကို အောက်ပါ formats တွေနဲ့ လက်ခံပါတယ်:

| `'08:00:2b:01:02:03'` |
| --- |
| `'08-00-2b-01-02-03'` |
| `'08002b:010203'` |
| `'08002b-010203'` |
| `'0800.2b01.0203'` |
| `'0800-2b01-0203'` |
| `'08002b010203'` |

ဒီ ဥပမာတွေ အားလုံးက လိပ်စာ တစ်ခုတည်းကိုပဲ သတ်မှတ်ပါတယ်။ `a` ကနေ `f` အထိ digit တွေအတွက် upper case ရော lower case ပါ လက်ခံပါတယ်။ Output ကတော့ အမြဲတမ်း ပြထားတဲ့ ပုံစံတွေထဲက ပထမ ပုံစံနဲ့ ထွက်ပါတယ်။

IEEE Standard 802-2001 က ပြထားတဲ့ ပုံစံတွေထဲက ဒုတိယ ပုံစံ (hyphen တွေနဲ့) ကို MAC addresses တွေအတွက် canonical (စံသတ်မှတ်) ပုံစံအဖြစ် သတ်မှတ်ပြီး — ပထမ ပုံစံ (colon တွေနဲ့) ကိုတော့ bit-reversed (bit ပြောင်းပြန် လှန်ထားသော) ၊ MSB-first notation တွေမှာ သုံးတာလို့ သတ်မှတ်ပါတယ် — ဒါကြောင့် 08-00-2b-01-02-03 = 10:00:D4:80:40:C0 ဖြစ်ပါတယ်။ ဒီ convention (စည်းမျဉ်း) ကို ယနေ့ခေတ်မှာတော့ ကျယ်ကျယ်ပြန့်ပြန့် လျစ်လျူရှုထားကြပြီး — Token Ring လိုမျိုး အသုံးမပြုတော့တဲ့ (obsolete) network protocols တွေအတွက်ပဲ သက်ဆိုင်ပါတယ်။ PostgreSQL က bit reversal (bit ပြောင်းပြန် လှန်ခြင်း) အတွက် ဘာမှ မပံ့ပိုးပါဘူး; လက်ခံတဲ့ formats တွေ အားလုံးက canonical LSB order (LSB အစီအစဉ်) ကို သုံးပါတယ်။

ကျန်တဲ့ input formats ငါးခုကတော့ ဘယ် standard ရဲ့ အစိတ်အပိုင်းမှ မဟုတ်ပါဘူး။

### 8.9.5. `macaddr8` (EUI-64 MAC address type)

`macaddr8` type က MAC addresses (MAC လိပ်စာများ) တွေကို EUI-64 format နဲ့ သိမ်းဆည်းပါတယ် — ဥပမာ Ethernet card ရဲ့ hardware addresses (hardware လိပ်စာများ) တွေကနေ သိကြတဲ့ ပုံစံပါ (MAC addresses တွေကို တခြား ရည်ရွယ်ချက်တွေအတွက်လည်း သုံးကြပေမယ့်)။ ဒီ type က 6 bytes ရော 8 bytes အလျားရှိတဲ့ MAC addresses နှစ်မျိုးလုံးကို လက်ခံပြီး — 8 bytes အလျား format နဲ့ သိမ်းဆည်းပါတယ်။ 6 byte format နဲ့ ပေးထားတဲ့ MAC addresses တွေကို — 4 နဲ့ 5 မြောက် bytes တွေကို FF နဲ့ FE အသီးသီး (respectively) သတ်မှတ်ပြီး — 8 bytes အလျား format နဲ့ သိမ်းဆည်းပါတယ်။ IPv6 က modified EUI-64 format (ပြုပြင်ထားသော EUI-64 ပုံစံ) ကို သုံးတယ်ဆိုတာ သတိပြုပါ — EUI-48 ကနေ ပြောင်းလဲပြီးတဲ့အခါ 7 မြောက် bit ကို one (1) အဖြစ် သတ်မှတ်ရပါတယ်။ ဒီပြောင်းလဲမှုကို လုပ်ဆောင်ဖို့ `macaddr8_set7bit` function ကို ပေးထားပါတယ်။ ယေဘုယျအားဖြင့် — byte boundaries (byte နယ်နိမိတ်) တွေပေါ်မှာ hex digits (ဆယ့်ခြောက်လွန်း ဂဏန်းများ) အတွဲတွေနဲ့ ဖွဲ့စည်းထားပြီး — `':'`, `'-'` ဒါမှမဟုတ် `'.'` တစ်ခုခုနဲ့ တစ်ပြေးညီ (consistently) ခြားထားတဲ့ input တွေကို လက်ခံပါတယ်။ Hex digits အရေအတွက်က 16 (8 bytes) ဒါမှမဟုတ် 12 (6 bytes) ဖြစ်ရပါမယ်။ ရှေ့ဆုံးနဲ့ နောက်ဆုံးက whitespace (နေရာလပ်) တွေကိုတော့ လျစ်လျူရှုပါတယ်။ အောက်မှာတော့ လက်ခံနိုင်တဲ့ input formats တွေရဲ့ ဥပမာတွေ ဖြစ်ပါတယ်:

| `'08:00:2b:01:02:03:04:05'` |
| --- |
| `'08-00-2b-01-02-03-04-05'` |
| `'08002b:0102030405'` |
| `'08002b-0102030405'` |
| `'0800.2b01.0203.0405'` |
| `'0800-2b01-0203-0405'` |
| `'08002b01:02030405'` |
| `'08002b0102030405'` |

ဒီ ဥပမာတွေ အားလုံးက လိပ်စာ တစ်ခုတည်းကိုပဲ သတ်မှတ်ပါတယ်။ `a` ကနေ `f` အထိ digit တွေအတွက် upper case ရော lower case ပါ လက်ခံပါတယ်။ Output ကတော့ အမြဲတမ်း ပြထားတဲ့ ပုံစံတွေထဲက ပထမ ပုံစံနဲ့ ထွက်ပါတယ်။

အပေါ်မှာ ပြထားတဲ့ input formats နောက်ဆုံး ခြောက်ခုကတော့ ဘယ် standard ရဲ့ အစိတ်အပိုင်းမှ မဟုတ်ပါဘူး။

EUI-48 format ထဲက ရိုးရာ 48 bit MAC address တစ်ခုကို — IPv6 address တစ်ခုရဲ့ host အပိုင်း (host portion) အနေနဲ့ ထည့်သွင်းနိုင်ဖို့ modified EUI-64 format အဖြစ် ပြောင်းလဲချင်ရင် — `macaddr8_set7bit` ကို အောက်မှာ ပြထားတဲ့အတိုင်း သုံးပါ:

```sql
SELECT macaddr8_set7bit('08:00:2b:01:02:03');

    macaddr8_set7bit
-------------------------
 0a:00:2b:ff:fe:01:02:03
(1 row)
```
