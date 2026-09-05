---
title: "QUIC"
description: "node:quic module (experimental) — QUIC protocol ၏ implementation — quic.connect/listen/listEndpoints, QuicEndpoint, QuicSession (+ Stats), QuicStream (+ Stats), QuicError, QUIC datagrams, stream priorities/aborting, HTTP/3 support, transport parameters, types စသည်"
order: 152
source: "https://nodejs.org/api/quic.html"
status: translated
updated: 2026-09-05
---

> Stability: 1.0 - Early development

`node:quic` module က QUIC protocol ရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ၎င်းကို ဝင်ရောက်သုံးစွဲဖို့ Node.js ကို `--experimental-quic` option နဲ့ စတင်ပြီး အောက်ပါအတိုင်း သုံးပါ:

```mjs
import quic from 'node:quic';
```

```cjs
const quic = require('node:quic');
```

ဒီ module ကို `node:` scheme အောက်မှာသာ ရရှိနိုင်ပါတယ်။

## ခြုံငုံ သုံးသပ်ချက် (Overview)

`quic` module က QUIC clients နဲ့ servers တွေကို ဖန်တီးဖို့အတွက် APIs တွေကို ပံ့ပိုးပေးပါတယ်။

### သက်ဆိုင်ရာ RFCs များနှင့် specifications များ (Relevant RFCs and specifications)

QUIC နဲ့ HTTP/3 protocols တွေကို IETF QUIC Working Group က အဓိကထုတ်ဝေထားတဲ့ RFCs အစုအဝေးတွေနဲ့ သတ်မှတ် ဖော်ပြပါတယ်။ ဒီ module ကို သုံးစွဲသူတွေအနေနဲ့ ဒီ document တွေနဲ့ အကျွမ်းတဝင် ရှိထားဖို့ အထူး အကြံပြုပါတယ်။

**Core QUIC transport (အဓိက QUIC transport):**

* [RFC 8999][] — Version-Independent Properties of QUIC
* [RFC 9000][] — QUIC: A UDP-Based Multiplexed and Secure Transport
* [RFC 9001][] — Using TLS to Secure QUIC
* [RFC 9002][] — QUIC Loss Detection and Congestion Control

**Core HTTP/3 (အဓိက HTTP/3):**

* [RFC 9114][] — HTTP/3
* [RFC 9204][] — QPACK: Field Compression for HTTP/3

**QUIC extensions (QUIC တိုးချဲ့မှုများ):**

* [RFC 9221][] — An Unreliable Datagram Extension to QUIC
* [RFC 9287][] — Greasing the QUIC Bit
* [RFC 9368][] — Compatible Version Negotiation for QUIC
* [RFC 9369][] — QUIC Version 2
* [RFC 9443][] — Multiplexing Scheme Updates for QUIC

**HTTP/3 extensions (HTTP/3 တိုးချဲ့မှုများ):**

* [RFC 9218][] — Extensible Prioritization Scheme for HTTP
* [RFC 9220][] — Bootstrapping WebSockets with HTTP/3
* [RFC 9297][] — HTTP Datagrams and the Capsule Protocol
* [RFC 9412][] — The ORIGIN Extension in HTTP/3

**Operational and informational (လည်ပတ်မှုနှင့် အချက်အလက်ဆိုင်ရာ):**

* [RFC 9308][] — Applicability of the QUIC Transport Protocol
* [RFC 9312][] — Manageability of the QUIC Transport Protocol

## Architecture (ဗိသုကာဖွဲ့စည်းပုံ)

`quic` module ကို core abstractions (အဓိက စိတ္တဇ သဘောတရားများ) သုံးခုပေါ်မှာ အခြေခံ တည်ဆောက်ထားပါတယ်:

* `QuicEndpoint`: QUIC အတွက် local UDP socket binding (ချိတ်ဆက်မှု) ကို ကိုယ်စားပြုပါတယ်။ ၎င်းကို QUIC packets တွေ ပို့ခြင်းနဲ့ လက်ခံခြင်းအတွက် သုံးပြီး — sessions အများအပြားကြားမှာ မျှဝေသုံးစွဲနိုင်ပါတယ်။ Endpoint တစ်ခုတည်းကို client ရော server အဖြစ်ပါ တစ်ပြိုင်နက် သုံးနိုင်ပါတယ်။

* `QuicSession`: local endpoint နဲ့ remote peer တစ်ခုကြားက QUIC connection ကို ကိုယ်စားပြုပါတယ်။ Session တစ်ခုကို `quic.connect()` ကို သုံးပြီး remote peer တစ်ခုဆီကို connection စတင်ခြင်း (သို့) `quic.listen()` ကနေတစ်ဆင့် remote peer တစ်ခုရဲ့ incoming connection ကို လက်ခံခြင်းအားဖြင့် ဖန်တီးပါတယ်။

* `QuicStream`: session တစ်ခုအတွင်းမှာရှိတဲ့ QUIC stream တစ်ခုကို ကိုယ်စားပြုပါတယ်။ Streams တွေကို local (သို့) remote peers နှစ်ဖက်စလုံးက ဖန်တီးနိုင်ပြီး — bidirectional (လမ်းကြောင်းနှစ်ဖက်) (သို့) unidirectional (လမ်းကြောင်းတစ်ဖက်) ဖြစ်နိုင်ပါတယ်။

ရိုးရာ TCP-based protocols တွေနဲ့ မတူပဲ — QUIC ရဲ့ "connections" တွေက တိကျတဲ့ local port / remote port တွဲတစ်ခုနဲ့ ပင်ကိုယ်အားဖြင့် ချည်နှောင်ထားတာ မဟုတ်ပါဘူး။ Session တစ်ခုကို QUIC endpoint တစ်ခုကနေတစ်ဆင့် စတင်ပေမယ့် — ၎င်းရဲ့ သက်တမ်းတစ်လျှောက်မှာ မတူညီတဲ့ local (သို့) remote address တစ်ခုဆီကို ရွှေ့ပြောင်းနိုင်ပြီး — သူ့ကို ဖန်တီးခဲ့တဲ့ endpoint ထက် ပိုကြာရှည် ခံနိုင်ကာ — endpoints အများအပြားနဲ့တောင် တစ်ပြိုင်နက် ဆက်စပ်နေနိုင်ပါတယ်။ ဒီလိုပြောင်းလွယ်မှုက connection migration (ချိတ်ဆက်မှု ရွှေ့ပြောင်းခြင်း), multi-homing နဲ့ load balancing (ဝန်ခွဲဝေခြင်း) စတဲ့ အဆင့်မြင့် အသုံးပြုမှု အခြေအနေတွေကို ဖြစ်နိုင်စေပါတယ်။ ဒါပေမယ့် — အများအားဖြင့်တော့ endpoint နဲ့ session ကြားက ရိုးရှင်းတဲ့ one-to-one ဆက်စပ်မှု တစ်ခုတည်းနဲ့ လုံလောက်ပါတယ်။

### Integrated TLS 1.3 (TLS 1.3 ပေါင်းစည်းထားခြင်း)

QUIC protocol က connection တည်ဆောက်ခြင်းနဲ့ လုံခြုံရေးအတွက် TLS 1.3 ကို protocol ထဲကို တိုက်ရိုက် ပေါင်းစည်းထားပါတယ်။ `quic` module ရဲ့ API ကလည်း TLS နဲ့ ဆက်စပ်တဲ့ အချက်အလက်တွေနဲ့ configuration options တွေကို ထုတ်ဖော်ပေးခြင်းအားဖြင့် ဒီပေါင်းစည်းမှုကို ထင်ဟပ်ပါတယ်။ လက်ရှိမှာ QUIC ကို TLS မပါပဲ (သို့) TLS ရဲ့ တခြား version တစ်ခုနဲ့ သုံးဖို့ မဖြစ်နိုင်ပါဘူး။

QUIC session တိုင်းက client နဲ့ server နှစ်ဖက်စလုံး TLS handshake တစ်ခုကို လုပ်ဆောင်ခြင်းအားဖြင့် စတင်ပါတယ် — application protocol ကို (ALPN ကနေတစ်ဆင့်) ညှိနှိုင်းခြင်း၊ server (နဲ့ optional အနေနဲ့ client) ကို authenticate လုပ်ခြင်း၊ transport parameters တွေ ဖလှယ်ခြင်းနဲ့ encryption အတွက် shared keys တွေ တည်ဆောက်ခြင်းတို့ ပါဝင်ပါတယ်။

#### Certificate အရွယ်အစားနှင့် handshake စွမ်းဆောင်ရည် (Certificate size and handshake performance)

QUIC မှာ anti-amplification limit (ချဲ့ထွင်တိုက်ခိုက်မှု တားဆီးရေး ကန့်သတ်ချက်) ([RFC 9000 Section 8.1][]) တစ်ခု ပါဝင်ပြီး — client ရဲ့ address ကို validate မလုပ်ရသေးခင် server က client ဆီကနေ လက်ခံရရှိတဲ့ data ရဲ့ သုံးဆထက် ပိုပြီး မပို့နိုင်အောင် ကန့်သတ်ထားပါတယ်။ Client ရဲ့ Initial packet က ပုံမှန်အားဖြင့် 1200 bytes လောက် ရှိတာမို့ — server က client ရဲ့ acknowledge ကို မစောင့်ရသေးခင် အများဆုံး ခန့်မှန်းခြေ 3600 bytes လောက်အထိသာ ပို့နိုင်ပါတယ်။

Server ရဲ့ ကနဦး response ထဲမှာ သူ့ရဲ့ TLS certificate chain က နေရာအများဆုံး ယူထားပါတယ်။ Certificate chain က amplification limit ကို ကျော်လွန်သွားရင် — handshake က round trip တစ်ခု ထပ်လိုအပ်ပါတယ် — server က ခဏရပ်ပြီး client ရဲ့ acknowledgement ကို စောင့်ကာ — ကျန်နေတဲ့ certificate အပိုင်းတွေကို ဆက်ပို့ရပါတယ်။ ဒါက TCP+TLS ထက် QUIC ရဲ့ 1-RTT handshake အားသာချက်ကို ဖျောက်ပစ်လိုက်ပြီး — network path ပေါ် မူတည်ပြီး ပထမဆုံး connection မှာ latency 50–100 ms (သို့) ပိုများတာ ထပ်တိုးစေနိုင်ပါတယ်။

ဒါကို ရှောင်ရှားဖို့ — servers တွေက compact certificate chains (ကျစ်လစ်သော certificate ကွင်းဆက်များ) တွေကို သုံးသင့်ပါတယ်:

* **ECDSA certificates တွေကို သုံးပါ** (P-256 (သို့) P-384) — RSA အစား။ ECDSA keys နဲ့ signatures တွေက သိသိသာသာ ပိုငယ်ပါတယ်။ Intermediate တစ်ခုပါတဲ့ ပုံမှန် ECDSA P-256 certificate chain တစ်ခုက ခန့်မှန်းခြေ 1.5–2 KB လောက် ရှိပြီး — amplification limit အတွင်းမှာ ကောင်းကောင်း အံဝင်ပါတယ်။ ညီမျှတဲ့ RSA-2048 chain ကတော့ မကြာခဏ 3–5 KB ရှိတတ်ပြီး — limit ကို ကျော်လွန်သွားနိုင်ပါတယ်။

* **Certificate chain ကို အနည်းဆုံးဖြစ်အောင် ထားပါ။** Leaf certificate နဲ့ လိုအပ်တဲ့ intermediate(s) တွေကိုသာ ထည့်ပါ။ Root certificate ကိုတော့ မထည့်ပါနဲ့ (clients တွေမှာ သူတို့ရဲ့ trust store ထဲမှာ ရှိပြီးသားပါ)။ Self-signed root ကို ကျယ်ကျယ်ပြန့်ပြန့် ယုံကြည်ထားပြီးသားဆိုရင် cross-signed intermediates တွေကို ရှောင်ပါ။

* **Certificate chain တိုတိုနဲ့ ထုတ်ပေးတဲ့ certificate authorities တွေကို ဦးစားပေးပါ။** CA အချို့က intermediate ငယ်တစ်ခုတည်းနဲ့ certificates တွေကို ထုတ်ပေးပြီး — တချို့ကတော့ RSA intermediates ကြီးတွေ အများအပြား လိုအပ်ပါတယ်။ CA ရွေးချယ်မှုက handshake latency ကို တိုက်ရိုက် သက်ရောက်ပါတယ်။

Certificate compression (certificate ချုံ့ခြင်း) ([RFC 8879][]) ကလည်း ဒီပြဿနာကို ဖြေရှင်းနိုင်ပါတယ် — handshake အတွင်းမှာ certificate chain ကို ချုံ့ပေးခြင်းအားဖြင့် server ရဲ့ Certificate message ကို amplification limit အတွင်းမှာ ထားနိုင်စေပြီး — round trip အပိုတစ်ခုကို ရှောင်ရှားနိုင်ပါတယ်။ Certificate compression က [`certificateCompression`][] TLS option ကနေတစ်ဆင့် opt-in လုပ်ရတဲ့ သဘောဖြစ်ပြီး — default အနေနဲ့ disabled ပါ။ Enable လုပ်ထားရင် server ရဲ့ certificate ရော — mutual TLS အတွက်ဆိုရင် client ရဲ့ certificate ပါ နှစ်ခုလုံးကို သက်ရောက်ပါတယ်။

### Rate limiting (နှုန်း ကန့်သတ်ခြင်း)

QUIC endpoints တွေမှာ denial-of-service attacks (ဝန်ဆောင်မှု ငြင်းပယ်သည့် တိုက်ခိုက်မှုများ) တွေကနေ ကာကွယ်ဖို့အတွက် built-in rate limiting (နှုန်း ကန့်သတ်စနစ်) ပါဝင်ပါတယ်။ ကာကွယ်ရေး အလွှာ နှစ်ခု ရှိပါတယ်:

**Global rate limits (ကမ္ဘာလုံးဆိုင်ရာ နှုန်း ကန့်သတ်ချက်များ)** က source address မည်သို့ပင်ဖြစ်စေ — endpoint က ပို့မယ့် stateless responses တွေရဲ့ စုစုပေါင်း နှုန်းကို ကန့်သတ်ပါတယ်။ ဒါတွေက spoofed (အတုအယောင်) source IP addresses တွေကနေ လာတဲ့ floods တွေကို ကာကွယ်ပေးပါတယ် — attacker က per-host limits တွေကို ကျော်လွှားဖို့ source address အတု အများအပြားကို အလှည့်ကျ သုံးတတ်ပါတယ်။ Stateless responses အမျိုးအစား လေးမျိုးကို တစ်ခုချင်းစီ သီးခြား rate-limit လုပ်ပါတယ်:

* **Retry packets** — connection setup ကာလအတွင်းမှာ client တစ်ဦးရဲ့ address ကို validate လုပ်ဖို့ ပို့ပေးပါတယ်။ [`endpointOptions.retryRate`][] နဲ့ [`endpointOptions.retryBurst`][] တို့ကနေ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။
* **Stateless reset packets** — endpoint က မသိတဲ့ (unknown) session တစ်ခုအတွက် packet တစ်ခု လက်ခံရရှိတဲ့အခါ ပို့ပေးပါတယ်။ [`endpointOptions.statelessResetRate`][] နဲ့ [`endpointOptions.statelessResetBurst`][] တို့ကနေ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။
* **Version negotiation packets** — client တစ်ဦးက support မလုပ်ထားတဲ့ QUIC version တစ်ခုကို သုံးတဲ့အခါ ပို့ပေးပါတယ်။ [`endpointOptions.versionNegotiationRate`][] နဲ့ [`endpointOptions.versionNegotiationBurst`][] တို့ကနေ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။
* **Immediate connection close packets** — server က အလုပ်ရှုပ်နေတဲ့အခါ (သို့) token တစ်ခု မမှန်ကန်တဲ့အခါ ပို့ပေးပါတယ်။ [`endpointOptions.immediateCloseRate`][] နဲ့ [`endpointOptions.immediateCloseBurst`][] တို့ကနေ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။

Rate limit တစ်ခုချင်းစီက token bucket (token ပုံး) စနစ်ကို သုံးပါတယ်: endpoint က burst capacity အထိကို ချက်ချင်း ပို့နိုင်ပြီး — tokens တွေက သတ်မှတ်ထားတဲ့ နှုန်းအတိုင်း တစ်စက္ကန့်ကို ပြန်ဖြည့်ပေးပါတယ်။ Bucket က ဗလာဖြစ်နေတဲ့အခါ — အဲဒီအမျိုးအစားရဲ့ နောက်ထပ် responses တွေကို တိတ်တဆိတ် ပစ်ချလိုက်ပါတယ်။ Default တန်ဖိုးတွေ (တစ်စက္ကန့် 100 ခု၊ burst 200) က deployment အများစုအတွက် သင့်လျော်ပါတယ်။

**Per-host session creation rate limits (host တစ်ခုချင်းစီအတွက် session ဖန်တီးမှု နှုန်း ကန့်သတ်ချက်များ)** က remote address တစ်ခုတည်းက session အသစ်တွေကို ဘယ်လောက်မြန်မြန် ဖန်တီးနိုင်လဲဆိုတာကို ကန့်သတ်ပါတယ်။ ဒါကို validated remote address တစ်ခုချင်းစီအလိုက် ခြေရာခံပြီး — client တစ်ဦးတည်းက sessions တွေကို (အမြန်ဆက် connect လုပ်ပြီး disconnect လုပ်တဲ့ပုံစံနဲ့) အလျှံပယ် ဖန်တီးကာ server resources တွေကို စားသုံးပစ်တာကို တားဆီးပါတယ်။ [`endpointOptions.sessionCreationRate`][] နဲ့ [`endpointOptions.sessionCreationBurst`][] တို့ကနေ ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။ Default တန်ဖိုးတွေ (တစ်စက္ကန့် 50 ခု၊ burst 100) က ပုံမှန် traffic ပုံစံတွေအတွက် ရက်ရက်ရောရော လုံလောက်ပါတယ်။ Traffic တစ်ခုတည်းကနေ လာတဲ့ benchmarking (စွမ်းဆောင်ရည် တိုင်းတာခြင်း) အခြေအနေတွေမှာတော့ ဒီတန်ဖိုးတွေကို တိုးပေးပါ။

Rate limiting အပြင် — endpoint က `maxConnectionsPerHost` နဲ့ `maxConnectionsTotal` ကနေတစ်ဆင့် **concurrent connection limits (တစ်ပြိုင်နက် ချိတ်ဆက်မှု ကန့်သတ်ချက်များ)** ကိုလည်း ပံ့ပိုးပြီး — connection အသစ်တွေ အားလုံးကို ငြင်းပယ်တဲ့ [`endpoint.busy`][] ကနေတစ်ဆင့် **busy mode (အလုပ်ရှုပ်နေသည့် mode)** တစ်ခုလည်း ရှိပါတယ်။

Rate limiting လုပ်ဆောင်ချက်တွေကို endpoint ရဲ့ statistics object ကနေတစ်ဆင့် စောင့်ကြည့်နိုင်ပါတယ်။ Rate limiter တစ်ခုချင်းစီမှာ သက်ဆိုင်တဲ့ counter (ဥပမာ — `endpoint.stats.retryRateLimited`, `endpoint.stats.sessionCreationRateLimited`) တစ်ခု ရှိပြီး — responses ဘယ်နှစ်ခု ပစ်ချခံရလဲဆိုတာကို ခြေရာခံပါတယ်။ Non-zero တန်ဖိုး တစ်ခု ရှိနေရင် rate limiter က endpoint ကို တက်ကြွစွာ ကာကွယ်နေတယ်လို့ ညွှန်ပြပါတယ်။

#### Block lists (ပိတ်ပင်စာရင်းများ)

Endpoints တွေက [`net.BlockList`][] ကို သုံးပြီး incoming packets တွေကို source address အလိုက် filter လုပ်နိုင်ပါတယ်။ Block list ကို QUIC processing ဘာမှ မလုပ်ခင် အရင်စစ်ဆေးတာမို့ — block လုပ်ခံရတဲ့ packets တွေက စစ်ဆေးမှုကိုယ်တိုင်ကလွဲလို့ resources ဘာမှ မသုံးစွဲပါဘူး။

**deny** mode (default) မှာတော့ — list ထဲမှာပါတဲ့ addresses တွေကနေ လာတဲ့ packets တွေကို ပစ်ချပါတယ်:

```mjs
import { BlockList } from 'node:net';
import { listen } from 'node:quic';

const blocked = new BlockList();
blocked.addSubnet('192.168.1.0', 24);  // Block an entire subnet
blocked.addAddress('10.0.0.5');        // Block a specific address

const endpoint = await listen(onSession, {
  endpoint: {
    blockList: blocked,
    blockListPolicy: 'deny',
  },
  // ...
});
```

**allow** mode မှာတော့ — list ထဲမှာပါတဲ့ addresses တွေကနေ လာတဲ့ packets တွေကိုသာ လက်ခံပါတယ်:

```mjs
const trusted = new BlockList();
trusted.addSubnet('10.0.0.0', 8);

const endpoint = await listen(onSession, {
  endpoint: {
    blockList: trusted,
    blockListPolicy: 'allow',
  },
  // ...
});
```

Block list ကို live ဖတ်ပါတယ် — endpoint ကို ဖန်တီးပြီးမှ rules တွေ ထပ်ထည့်တာ (သို့) ဖယ်ရှားတာတွေက ချက်ချင်း အသက်ဝင်ပါတယ်။ `endpoint.stats.packetsBlocked` counter က filter ကြောင့် packets ဘယ်နှစ်ခု ပစ်ချခံရလဲဆိုတာကို ခြေရာခံပါတယ်။

### Applications (အသုံးချမှုများ)

`QuicSession` တစ်ခုချင်းစီက application protocol တစ်ခုတည်းနဲ့ ဆက်စပ်ပြီး — အဲဒီ protocol ကို TLS handshake အတွင်းမှာ ALPN ကနေတစ်ဆင့် ညှိနှိုင်း သတ်မှတ်ပါတယ်။ `quic` module က ယေဘုယျအားဖြင့် application-agnostic (application မရွေးချယ်ဘဲ သုံးနိုင်သော) ဖြစ်အောင် ဒီဇိုင်းထုတ်ထားပေမယ့် — တိကျတဲ့ application protocol တစ်ခုအနေနဲ့ HTTP/3 အတွက် built-in support တွေ ပါဝင်ပါတယ်။ HTTP/3 ကို သုံးတဲ့အခါ `quic` module က headers, trailers, prioritization (ဦးစားပေး သတ်မှတ်ခြင်း) စတဲ့ HTTP/3-specific feature တွေကို ကိုင်တွယ်ဖို့ APIs အပိုတွေကို ပံ့ပိုးပေးပါတယ်။ တခြား application protocols တွေအတွက်တော့ users တွေက core QUIC transport features တွေရဲ့ အပေါ်မှာ ကိုယ်ပိုင် message framing နဲ့ multiplexing ကို အကောင်အထည်ဖော်နိုင်ပါတယ်။

TLS handshake တစ်ခုကို စတင်တဲ့အခါ client က support လုပ်ထားတဲ့ ALPN protocols စာရင်းကို `ClientHello` ထဲမှာ ထည့်ပို့ပါတယ်။ Server က အဲဒီ protocols တွေထဲက တစ်ခုကို (ရှိရင်) ရွေးချယ်ပြီး `ServerHello` ထဲမှာ ထည့်သွင်းပါတယ်။ ညှိနှိုင်းပြီးသား protocol က `QuicSession` နဲ့ `QuicStream` APIs တွေရဲ့ အပြုအမူကို ဆုံးဖြတ်ပါတယ်။ ဥပမာ — HTTP/3 အတွက် `h3` protocol ကို ညှိနှိုင်းလိုက်တဲ့အခါ `QuicSession` နဲ့ `QuicStream` တွေက HTTP/3-specific feature တွေကို support လုပ်ပါလိမ့်မယ်။

လက်ရှိမှာတော့ `quic` module က built-in application protocol အနေနဲ့ HTTP/3 ကိုသာ support လုပ်ပါတယ်။ တခြား protocols တွေ အားလုံးကို ပေးထားတဲ့ JavaScript API ရဲ့ အပေါ်မှာ user ကိုယ်တိုင် အကောင်အထည်ဖော်ရပါမယ်။

### Configuration (ပြင်ဆင်သတ်မှတ်မှု)

QUIC API က use cases အမျိုးမျိုးကို support လုပ်နိုင်ဖို့ ပြောင်းလွယ်ပြင်လွယ် ရှိပြီး အလွန် configurable (ပြင်ဆင်သတ်မှတ်နိုင်သော) ဖြစ်အောင် ဒီဇိုင်းထုတ်ထားပါတယ်။ Users တွေက `quic.connect()` နဲ့ `quic.listen()` functions တွေဆီကို ဖြတ်သန်းပေးတဲ့ options တွေကနေလည်းကောင်း — `QuicEndpoint` နဲ့ `QuicSession` instances တွေပေါ်မှာ dynamic အနေနဲ့လည်းကောင်း — QUIC transport, TLS handshake နဲ့ application အပြုအမူရဲ့ ကဏ္ဍအမျိုးမျိုးကို ပြင်ဆင်သတ်မှတ်နိုင်ပါတယ်။ ဒီ API က monitoring နဲ့ debugging အတွက် အသေးစိတ် statistics တွေနဲ့ events တွေဆီကိုလည်း ဝင်ရောက်ခွင့် ပေးပါတယ်။

QUIC transport parameters တွေကို TLS handshake အတွင်းမှာ ဖလှယ်ပြီး — maximum stream counts, idle timeouts, datagram support စတဲ့ transport-level settings အမျိုးမျိုးကို ညှိနှိုင်းပါတယ်။ `quic` module က users တွေအနေနဲ့ သူတို့ရဲ့ endpoint က peers တွေဆီကို ကြေညာတဲ့ (advertise) transport parameters တွေကို ပြင်ဆင်သတ်မှတ်နိုင်စေပြီး — peers တွေက ကြေညာထားတဲ့ transport parameters တွေကိုလည်း ဝင်ရောက်ကြည့်ရှုနိုင်စေပါတယ်။ ဒါတွေက peer နဲ့ ပူးပေါင်းပြီး QUIC connection ရဲ့ စွမ်းဆောင်နိုင်မှုတွေနဲ့ ကန့်သတ်ချက်တွေကို သတ်မှတ်ပေးပါတယ်။

Local endpoint နဲ့ sessions တွေရဲ့ အပြုအမူကို ပြင်ဆင်သတ်မှတ်ဖို့ local settings အစုအဝေး ကြွယ်ဝစွာလည်း ရနိုင်ပါတယ်။ ဒါတွေထဲမှာ connection limits, congestion control (ပိတ်ဆို့မှု ထိန်းချုပ်ခြင်း), stream prioritization စတဲ့ settings တွေ ပါဝင်ပါတယ်။

### Callbacks များနှင့် Promises များ (Callbacks and Promises)

`quic` module က asynchronous operations တွေအတွက် callbacks နဲ့ promises နှစ်မျိုးလုံးကို ပေါင်းစပ်သုံးပါတယ်။ ဥပမာ — `quic.connect()` နဲ့ connection တစ်ခု စတင်ရင် ပြီးမြောက်လာတဲ့ session အတွက် promise တစ်ခုကို ပြန်ပေးပြီး — server ဘက်က incoming sessions တွေကိုတော့ `quic.listen()` ဆီကို ဖြတ်သန်းပေးထားတဲ့ callback တစ်ခုကနေတစ်ဆင့် ကိုင်တွယ်ပါတယ်။ Session တစ်ခုအတွင်းမှာတော့ incoming streams, datagrams, session state အပြောင်းအလဲတွေလိုမျိုး events တွေကို `QuicSession` instance ပေါ်က callbacks တွေကနေတစ်ဆင့် ကိုင်တွယ်ပါတယ်။ TLS handshake ပြီးဆုံးခြင်း (သို့) session တစ်ခုကို ချောမွေ့စွာ ပိတ်သိမ်းခြင်းလိုမျိုး — ပြီးဆုံးမှတ် (completion point) ရှင်းရှင်းလင်းလင်း ရှိတဲ့ operations တွေအတွက်တော့ promises တွေကို သုံးပါတယ်။

Callbacks တွေ အားလုံးကို synchronously ခေါ်ပြီး — synchronously ပြန်လည်း ပြန်နိုင်သလို promise တစ်ခုကိုလည်း ပြန်နိုင်ပါတယ်။ Callback တစ်ခုက reject ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးခဲ့ရင် (သို့) error တစ်ခုကို throw လုပ်ခဲ့ရင် — `onerror` callback တစ်ခု သတ်မှတ်မထားဘူးဆိုရင် — object ကို အဲဒီ error ကို reason အဖြစ်နဲ့ destroy လုပ်ပါလိမ့်မယ်။

### Streams (stream များ)

Streams တွေက QUIC မှာ data သယ်ဆောင်ပေးတဲ့ အဓိက abstraction ပါ။ Session တစ်ခု တည်ဆောက်ပြီးတာနဲ့ stream တစ်ခုကို local endpoint (သို့) remote peer နှစ်ဖက်စလုံးက စတင်နိုင်ပါတယ်။

Streams တွေက bidirectional (data နှစ်ဖက်စလုံး စီးဆင်းသည်) (သို့) unidirectional (data တစ်ဖက်တည်းသာ စီးဆင်းသည်) ဖြစ်နိုင်ပါတယ်။ `quic` module က အမျိုးအစားတစ်ခုချင်းစီ ဖန်တီးဖို့ သီးခြား APIs တွေကို ပံ့ပိုးပေးပါတယ်: [`session.createBidirectionalStream()`][] နဲ့ [`session.createUnidirectionalStream()`][]။ Remote peer တစ်ဦးက စတင်လိုက်တဲ့ streams တွေကို [`session.onstream`][] callback ကနေတစ်ဆင့် ပေးပို့ပါတယ်။ ညှိနှိုင်းပြီးသား application protocol က stream-level callbacks တွေကို support လုပ်ပြီး (ဥပမာ HTTP/3) — `onheaders` callback တစ်ခု သတ်မှတ်ထားရင် — incoming streams တွေကို အဲဒီ callback ကနေတစ်ဆင့်ပဲ အပြည့်အဝ စားသုံးနိုင်ပြီး `onstream` ကို register လုပ်တာက optional ပါ။

Stream တစ်ခုဆီကို data ရေးသားဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

* **Body source** — stream ကို ဖန်တီးတဲ့အခါ `body` option တစ်ခုကို ဖြတ်သန်းပေးပါ (သို့) [`stream.setBody()`][] ကို ခေါ်ပါ။ Body က string, `ArrayBuffer`, `ArrayBufferView`, `Blob`, `FileHandle`, `AsyncIterable`, sync `Iterable` (သို့) ဒါတွေထဲက တစ်ခုခုကို resolve လုပ်တဲ့ `Promise` ဖြစ်နိုင်ပါတယ်။ `null` body က writable side ကို ချက်ချင်း ပိတ်ပါတယ်။ Data က ကြိုတင် ရနိုင်တဲ့အခါ (သို့) iterable တစ်ခုအနေနဲ့ ဖော်ပြနိုင်တဲ့အခါ — ဒါက အရိုးရှင်းဆုံး နည်းလမ်းပါ။
* **Writer** — data တွေကို တစ်ဆင့်ချင်း (incrementally) push လုပ်ဖို့ [`stream.writer`][] ကို ဝင်ရောက်သုံးပါ။ Writer က ချက်ချင်း ပြန်တဲ့ synchronous methods တွေ (`writeSync()`, `writevSync()`, `endSync()`) နဲ့ — backpressured (နောက်ပြန် ဖိအားရှိ) နေတဲ့အခါ drain ဖြစ်တာကို စောင့်ပေးတဲ့ async equivalents တွေ (`write()`, `writev()`, `end()`) ကို ထုတ်ဖော်ပေးပါတယ်။ Write buffer ပြည့်နေတဲ့အခါ `writeSync()` က `false` ကို ပြန်ပေးပါတယ် — ပြန်ကြိုးစားခင် caller က drain ဖြစ်တာကို စောင့်သင့်ပါတယ်။

ဒီနည်းလမ်း နှစ်ခုက stream တစ်ခုအတွက် တစ်ပြိုင်နက် သုံးလို့မရပါဘူး (mutually exclusive)။

ဖတ်ရှုခြင်းကို stream ကို async iterable တစ်ခုအနေနဲ့ iterate လုပ်ခြင်းအားဖြင့် လုပ်ပါတယ်။ Iteration တစ်ခုချင်းစီက `Uint8Array` chunks တွေရဲ့ batch တစ်ခုကို yield လုပ်ပါတယ်:

```mjs
for await (const chunks of stream) {
  for (const chunk of chunks) {
    // Process each Uint8Array chunk
  }
}
```

Stream တစ်ခုအတွက် async iterator တစ်ခုတည်းကိုသာ ရယူနိုင်ပါတယ်။ Stream က `Stream.bytes()`, `Stream.text()`, `Stream.pipeTo()` စတဲ့ `node:stream/iter` utilities တွေနဲ့လည်း လိုက်ဖက်ညီပါတယ်။

### Datagrams (datagram များ)

Streams တွေအပြင် — QUIC က low-latency, best-effort messaging (အကောင်းဆုံး ကြိုးပမ်းမှုဖြင့် ပို့ခြင်း) လိုအပ်တဲ့ use cases တွေအတွက် unreliable datagrams တွေကိုလည်း support လုပ်ပါတယ် ([RFC 9221][])။

Datagram support ကို အဆင့်နှစ်ဆင့်မှာ ဖွင့်ပေးပါတယ်။ QUIC transport အဆင့်မှာတော့ — peers နှစ်ဖက်စလုံးက handshake အတွင်းမှာ non-zero ဖြစ်တဲ့ [`maxDatagramFrameSize`][] transport parameter ကို ကြေညာရပါမယ်။ HTTP/3 sessions တွေအတွက်တော့ — peers နှစ်ဖက်စလုံးက [`application.enableDatagrams`][] ကို `true` အဖြစ် ထပ်ဆောင်း သတ်မှတ်ရပြီး — ဒါက HTTP/3 control stream ပေါ်မှာ `SETTINGS_H3_DATAGRAM` setting ကို ဖလှယ်ပါတယ်။

Datagram တစ်ခုကို [`session.sendDatagram()`][] ဆီကို တစ်ကြိမ်တည်း ခေါ်ပြီး ပို့ပါတယ်။ Datagram တစ်ခုချင်းစီက QUIC packet တစ်ခုတည်းအတွင်းမှာ အံဝင်ရပါမယ် — datagrams တွေကို fragment လုပ်လို့ မရပါဘူး။ အများဆုံး payload အရွယ်အစားကို peer ရဲ့ `maxDatagramFrameSize` နဲ့ path MTU က ဆုံးဖြတ်ပါတယ်။ Datagram က ကြီးလွန်းနေရင် (သို့) peer က datagrams တွေကို support မလုပ်ဘူးဆိုရင် — `sendDatagram()` က error တစ်ခု throw လုပ်မယ့်အစား `0n` ကို ပြန်ပေးပါတယ်။

ပို့လိုက်တာနဲ့ ရောက်မယ်လို့ အာမခံချက် မရှိပါဘူး။ Datagrams တွေက ပျောက်ဆုံးသွားနိုင်သလို — ပွားနိုင်ပြီး — အစီအစဉ်မကျ ရောက်ရှိနိုင်ပါတယ်။ [`session.ondatagramstatus`][] callback က ပို့လိုက်တဲ့ datagram တစ်ခုချင်းစီက `'acknowledged'`, `'lost'`, (သို့) `'abandoned'` (wire ပေါ်ကို ဘယ်တော့မှ မရောက်ခဲ့) ထဲက ဘယ်ဟာဖြစ်လဲဆိုတာကို အစီရင်ခံပါတယ်။

### 0-RTT early data နှင့် session resumption (0-RTT early data and session resumption)

QUIC က 0-RTT early data ကို support လုပ်ပြီး — အရင်က server တစ်ခုဆီကို ချိတ်ဆက်ဖူးတဲ့ client တစ်ဦးက handshake ပြီးဆုံးတာကို မစောင့်ပဲ — သူ့ရဲ့ ပထမဆုံး packet နဲ့အတူ application data တွေကို ပို့နိုင်စေပါတယ်။ ဒါက ပြန်လည်ချိတ်ဆက်တဲ့အခါမှာ latency ရဲ့ round-trip တစ်ခုလုံးကို ဖယ်ရှားပေးနိုင်ပါတယ်။

အရင်က connection တစ်ခုရဲ့ state အပိုင်း နှစ်ပိုင်းက ဒါကို ဖြစ်နိုင်စေပါတယ်:

* **Session ticket** တစ်ခုကို [`session.onsessionticket`][] callback ကနေတစ်ဆင့် လက်ခံရရှိပြီး — TLS session resumption နဲ့ 0-RTT encryption ကို ဖွင့်ပေးပါတယ်။ Server တစ်ခုတည်းဆီကို နောက်တစ်ကြိမ် ချိတ်ဆက်တဲ့အခါ [`sessionOptions.sessionTicket`][] option အနေနဲ့ ဖြတ်သန်းပေးပါ။
* **Address validation token** တစ်ခုကို [`session.onnewtoken`][] callback ကနေတစ်ဆင့် လက်ခံရရှိပြီး — client က server ရဲ့ address validation အဆင့်ကို ကျော်သွားနိုင်စေပါတယ် (Retry round-trip တစ်ခုကို ရှောင်ရှားခြင်း)။ [`sessionOptions.token`][] option အနေနဲ့ ဖြတ်သန်းပေးပါ။

Server က session ticket ကို လက်ခံလိုက်ရင် — handshake မပြီးဆုံးခင် ပို့လိုက်တဲ့ data တွေ အားလုံးက 0-RTT early data ပါ။ Server ဘက်မှာတော့ early data သယ်ဆောင်တဲ့ streams တွေအတွက် `stream.early` က `true` ဖြစ်ပါတယ်။ Server က 0-RTT ကြိုးပမ်းမှုကို ငြင်းပယ်နိုင်ပါတယ် (ဥပမာ — ticket ထုတ်ပေးပြီးနောက်မှာ သူ့ရဲ့ configuration ပြောင်းသွားခဲ့ရင်)။ ဒီလိုဖြစ်တဲ့အခါ 0-RTT အဆင့်အတွင်းမှာ ဖွင့်ထားတဲ့ streams တွေ အားလုံးကို destroy လုပ်ပြီး — client ရဲ့ [`session.onearlyrejected`][] callback က fire ဖြစ်ပါတယ်။ Connection က ပုံမှန် 1-RTT handshake ဆီကို ပြန်ကျပြီး — application က streams တွေကို ပြန်ဖွင့်နိုင်ပါတယ်။

Early data က handshake ပြီးဆုံးပြီးမှ ပို့တဲ့ data တွေထက် လုံခြုံမှု နည်းပါတယ် — attacker တစ်ဦးက ၎င်းကို ပြန်လည် ထပ်ဆင့်ပို့ (replay) လုပ်နိုင်ခြေ ရှိပါတယ်။ Applications တွေက 0-RTT data ကို သင့်လျော်တဲ့ သတိထားမှုနဲ့ ကိုင်တွယ်သင့်ပြီး — early data အဆင့်အတွင်းမှာ non-idempotent (ထပ်ခေါ်လို့မရသော) operations တွေကို လုပ်ဆောင်တာကို ရှောင်ရှားသင့်ပါတယ်။

### Connection lifecycle (connection ၏ သက်တမ်းစက်ဝန်း)

ပုံမှန် client session တစ်ခုက အောက်ပါ အဆင့်တွေကနေတစ်ဆင့် ဆက်လက် ဖြစ်ပေါ်ပါတယ်:

1. Server address တစ်ခုနဲ့ options တွေနဲ့အတူ [`quic.connect()`][] ကို ခေါ်ပါ။ ၎င်းက
   `QuicSession` တစ်ခုကို ပြန်ပေးပါတယ်။
2. TLS handshake က အလိုအလျောက် လည်ပတ်ပါတယ်။ Handshake ပြီးဆုံးတဲ့အခါ `session.opened`
   က resolve ဖြစ်ပြီး — ညှိနှိုင်းပြီးသား ALPN, cipher နဲ့ certificate validation ရလဒ်တွေကို
   ပေးပါတယ်။
3. Streams တွေ ဖွင့်ပါ၊ datagrams တွေ ပို့ပါ၊ data တွေ ဖလှယ်ပါ။
4. Graceful shutdown (ချောမွေ့သော ပိတ်သိမ်းမှု) တစ်ခုကို စတင်ဖို့ [`session.close()`][] ကို ခေါ်ပါ။
   ရှိပြီးသား streams တွေကို ပြီးဆုံးခွင့် ပေးပြီးမှ session ကို destroy လုပ်ပါတယ်။ ပြန်ပေးလိုက်တဲ့
   promise (`session.closed` အနေနဲ့လည်း ရနိုင်ပါတယ်) က teardown ပြီးဆုံးတဲ့အခါ resolve ဖြစ်ပါတယ်။

Server ဘက်မှာတော့ callback တစ်ခုနဲ့အတူ [`quic.listen()`][] ကို ခေါ်ပါ။ TLS handshake စတင်ပြီးနောက် incoming session တစ်ခုချင်းစီအတွက် callback က fire ဖြစ်ပါတယ်။ Incoming streams တွေက [`session.onstream`][] callback ကနေတစ်ဆင့် — ဒါမှမဟုတ် — `onheaders` callback သတ်မှတ်ထားတဲ့ HTTP/3 sessions တွေအတွက်ဆိုရင် အဲဒီ callback ကနေ တိုက်ရိုက် ရောက်ရှိပါတယ် ([minimal HTTP/3 server][] ဥပမာကို ကြည့်ပါ)။

[`session.destroy()`][] က ချက်ချင်း teardown လုပ်ဖို့အတွက် ရနိုင်ပါတယ် — ဖွင့်ထားတဲ့ streams တွေ အားလုံးကို destroy လုပ်ပြီး — သူတို့ ပြီးဆုံးတာကို မစောင့်ပဲ session ကို ပိတ်ပါတယ်။

`QuicEndpoint` နဲ့ `QuicSession` တွေက `Symbol.asyncDispose` ကို support လုပ်တာမို့ — automatic cleanup (အလိုအလျောက် ရှင်းလင်းခြင်း) အတွက် `await using` နဲ့ သုံးနိုင်ပါတယ်။

### Error ကိုင်တွယ်ခြင်း (Error handling)

`quic` module ထဲက errors တွေကို ဖြည့်စွက်လုပ်ဆောင်တဲ့ ယန္တရား နှစ်ခုကနေတစ်ဆင့် ဆက်သွယ် အသိပေးပါတယ်: `onerror` callback နဲ့ `closed` promise ပါ။

`QuicSession` ရော `QuicStream` ပါ optional `onerror` callback တစ်ခုကို ထုတ်ဖော်ပေးပါတယ်။ Session (သို့) stream တစ်ခုကို error တစ်ခုနဲ့ destroy လုပ်တဲ့အခါ — တခြား user callbacks တွေက throw လုပ်လိုက်တဲ့ errors တွေ အပါအဝင် — object ကို teardown မလုပ်ခင် `onerror` callback ကို အဲဒီ error နဲ့အတူ ခေါ်ပါတယ်။ `onerror` ကို သတ်မှတ်လိုက်တာက `closed` promise ကို handled အဖြစ် မှတ်သားစေပြီး — unhandled rejection warnings တွေ မဖြစ်အောင် တားဆီးပါတယ်။ `onerror` မသတ်မှတ်ထားဘူးဆိုရင် — error ကို `closed` promise ရဲ့ rejection ကနေတစ်ဆင့်သာ ပို့ပေးပါတယ်။

[`QuicError`][] class က ပုံမှန် `message` နဲ့ `code` properties တွေနဲ့အတူ — ရှင်းလင်းတဲ့ numeric QUIC error code တစ်ခု ([`error.errorCode`][]) ကိုပါ သယ်ဆောင်ပါတယ်။ `QuicError` တစ်ခုကို [`stream.destroy()`][] (သို့) [`writer.fail()`][] ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့အခါ — peer ဆီကို ပို့တဲ့ `RESET_STREAM` (သို့) `STOP_SENDING` frame ထဲမှာ ၎င်းရဲ့ `errorCode` ကို သုံးပါတယ်။ တခြား error type တွေကတော့ ညှိနှိုင်းပြီးသား protocol ရဲ့ generic internal error code ကို ပြန်ကျသုံးပါတယ်။

### Permission model (ခွင့်ပြုချက် ပုံစံ)

[Permission Model][] ကို သုံးတဲ့အခါ — QUIC network operations တွေကို ခွင့်ပြုဖို့အတွက် `--allow-net` flag ကို ဖြတ်သန်းပေးရပါမယ်။ အဲဒါမရှိပဲ [`quic.connect()`][] (သို့) [`quic.listen()`][] ကို ခေါ်လိုက်ရင် `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

```console
$ node --permission --allow-fs-read=* --experimental-quic index.mjs
Error: Access to this API has been restricted. Use --allow-net to manage permissions.
  code: 'ERR_ACCESS_DENIED',
  permission: 'Net',
}
```

[`quic.connect()`][] (သို့) [`quic.listen()`][] ကို မခေါ်မချင်း network I/O ဘာမှ မဖြစ်ပွားတာမို့ — connect (သို့) listen မလုပ်ပဲ [`QuicEndpoint`][] instance တစ်ခုကို ဖန်တီးတာက `--allow-net` မရှိပဲတောင် ခွင့်ပြုပါတယ်။

## `quic.connect(address[, options])`

* `address` {string|net.SocketAddress}
* `options` {quic.SessionOptions}
* Returns: {Promise} {quic.QuicSession} တစ်ခုအတွက် promise တစ်ခုပါ။

Client-side session အသစ်တစ်ခုကို စတင်ပါတယ်။

```mjs
import { connect } from 'node:quic';
import { Buffer } from 'node:buffer';

const enc = new TextEncoder();
const alpn = 'foo';
const client = await connect('123.123.123.123:8888', { alpn });
await client.createUnidirectionalStream({
  body: enc.encode('hello world'),
});
```

Default အနေနဲ့ — `connect(...)` ခေါ်တိုင်း random local IP port အသစ်တစ်ခုနဲ့ bind လုပ်ထားတဲ့ local `QuicEndpoint` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ သုံးချင်တဲ့ တိကျတဲ့ local address တစ်ခုကို သတ်မှတ်ဖို့ (သို့) local port တစ်ခုတည်းပေါ်မှာ QUIC sessions အများအပြားကို multiplex လုပ်ဖို့ဆိုရင် — argument အနေနဲ့ `QuicEndpoint` (သို့) `EndpointOptions` ထဲက တစ်ခုခုပါတဲ့ `endpoint` option ကို ဖြတ်သန်းပေးပါ။

```mjs
import { QuicEndpoint, connect } from 'node:quic';

const endpoint = new QuicEndpoint({
  address: '127.0.0.1:1234',
});

const client = await connect('123.123.123.123:8888', { endpoint });
```

## `quic.listen(onsession[, options])`

* `onsession` {quic.OnSessionCallback}
* `options` {quic.SessionOptions}
* Returns: {Promise} {quic.QuicEndpoint} တစ်ခုအတွက် promise တစ်ခုပါ။

Endpoint ကို server အနေနဲ့ listen လုပ်ဖို့ သတ်မှတ်ပေးပါတယ်။ Remote peer တစ်ဦးက session အသစ်တစ်ခုကို စတင်လိုက်တဲ့အခါ — ပေးထားတဲ့ `onsession` callback ကို ဖန်တီးပြီးသား session နဲ့အတူ ခေါ်ပါလိမ့်မယ်။

```mjs
import { listen } from 'node:quic';

const endpoint = await listen((session) => {
  // ... handle the session
});

// Closing the endpoint allows any sessions open when close is called
// to complete naturally while preventing new sessions from being
// initiated. Once all existing sessions have finished, the endpoint
// will be destroyed. The call returns a promise that is resolved once
// the endpoint is destroyed.
await endpoint.close();
```

Default အနေနဲ့ — `listen(...)` ခေါ်တိုင်း random local IP port အသစ်တစ်ခုနဲ့ bind လုပ်ထားတဲ့ local `QuicEndpoint` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ သုံးချင်တဲ့ တိကျတဲ့ local address တစ်ခုကို သတ်မှတ်ဖို့ (သို့) local port တစ်ခုတည်းပေါ်မှာ QUIC sessions အများအပြားကို multiplex လုပ်ဖို့ဆိုရင် — argument အနေနဲ့ `QuicEndpoint` (သို့) `EndpointOptions` ထဲက တစ်ခုခုပါတဲ့ `endpoint` option ကို ဖြတ်သန်းပေးပါ။

`QuicEndpoint` တစ်ခုကို server အနေနဲ့ listen လုပ်ဖို့ အများဆုံး တစ်ကြိမ်သာ သတ်မှတ်နိုင်ပါတယ်။

## `quic.listEndpoints([options])`

* `options` {object}
  * `active` {boolean} `true` (default) ဆိုရင် — active (destroy မဖြစ်သေး၊ closing မဖြစ်သေး၊ busy မဖြစ်သေး) ဖြစ်တဲ့ endpoints တွေကိုသာ ပြန်ပေးပါတယ်။ `false` ဆိုရင် endpoints အားလုံးကို ပြန်ပေးပါတယ်။
* Returns: {quic.QuicEndpoint\[]}

`QuicEndpoint` instances တွေ အားလုံးရဲ့ စာရင်းကို ပြန်ပေးပါတယ်။ Default အနေနဲ့ — active endpoints တွေကိုသာ ပြန်ပေးပါတယ်။

## `quic.constants`

* {Object}

QUIC configuration အတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

### `quic.constants.cc`

* {Object}

Congestion control algorithm တွေရဲ့ identifiers တွေပါ — [`sessionOptions.cc`][] option နဲ့ တွဲသုံးဖို့အတွက် ဖြစ်ပါတယ်:

* `quic.constants.cc.RENO` — Reno congestion control ကို ကိုယ်စားပြုပါတယ်။
* `quic.constants.cc.CUBIC` — CUBIC congestion control ကို ကိုယ်စားပြုပါတယ်။
* `quic.constants.cc.BBR` — BBR congestion control ကို ကိုယ်စားပြုပါတယ်။

### `quic.constants.DEFAULT_CIPHERS`

* {string}

[`sessionOptions.ciphers`][] ကို သတ်မှတ်မထားတဲ့အခါ သုံးမယ့် default TLS 1.3 cipher suite စာရင်းပါ။

### `quic.constants.DEFAULT_GROUPS`

* {string}

[`sessionOptions.groups`][] ကို သတ်မှတ်မထားတဲ့အခါ သုံးမယ့် default TLS 1.3 key-exchange group စာရင်းပါ။

## Class: `QuicEndpoint`

`QuicEndpoint` တစ်ခုက QUIC အတွက် local UDP-port binding ကို ခြုံငုံ ထားရှိပါတယ်။ ၎င်းကို client ရော server အဖြစ်ပါ သုံးနိုင်ပါတယ်။

### `new QuicEndpoint([options])`

* `options` {quic.EndpointOptions}

### `endpoint.address`

* Type: {net.SocketAddress|undefined}

Endpoint က bind လုပ်ထားတဲ့ local UDP socket address ပါ (ရှိရင်)။

Endpoint က လောလောဆယ် bind မလုပ်ထားဘူးဆိုရင် တန်ဖိုးက `undefined` ဖြစ်ပါလိမ့်မယ်။ Read only ဖြစ်ပါတယ်။

### `endpoint.busy`

* Type: {boolean}

`endpoint.busy` ကို true အဖြစ် သတ်မှတ်လိုက်ရင် — endpoint က session အသစ်တွေ ဖန်တီးခံရတာကို ယာယီ ငြင်းပယ်ပါလိမ့်မယ်။ Read/write ဖြစ်ပါတယ်။

```mjs
// Mark the endpoint busy. New sessions will be prevented.
endpoint.busy = true;

// Mark the endpoint free. New session will be allowed.
endpoint.busy = false;
```

`busy` property က endpoint က heavy load (ဝန်ပိနေချိန်) အောက်မှာ ရှိပြီး — သူ့ကိုယ်သူ ပြန်လည် ထိန်းကျောင်းနိုင်တဲ့အထိ session အသစ်တွေကို ယာယီ ငြင်းပယ်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်ပါတယ်။

### `endpoint.close()`

* Returns: {Promise}

Endpoint ကို ချောမွေ့စွာ (gracefully) ပိတ်ပါတယ်။ လက်ရှိ ဖွင့်ထားတဲ့ sessions တွေ အားလုံး ပိတ်သွားတဲ့အခါ — endpoint က ကိုယ်တိုင် ပိတ်ပြီး destroy ဖြစ်ပါလိမ့်မယ်။ ခေါ်လိုက်တာနဲ့ — session အသစ်တွေကို ငြင်းပယ်ပါလိမ့်မယ်။

Endpoint destroy ဖြစ်တဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `endpoint.closed`

* Type: {Promise}

Endpoint destroy ဖြစ်တဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုပါ။ ဒါက `endpoint.close()` function က ပြန်ပေးတဲ့ promise နဲ့ အတူတူပဲ ဖြစ်ပါလိမ့်မယ်။ Read only ဖြစ်ပါတယ်။

### `endpoint.closing`

* Type: {boolean}

`endpoint.close()` ကို ခေါ်ထားပြီး endpoint ပိတ်ခြင်းက မပြီးဆုံးသေးဘူးဆိုရင် `true` ပါ။ Read only ဖြစ်ပါတယ်။

### `endpoint.destroy([error])`

* `error` {any}

ဖွင့်ထားတဲ့ sessions တွေ အားလုံးကို ချက်ချင်း ပိတ်စေခြင်းအားဖြင့် endpoint ကို အတင်းအကြပ် (forcefully) ပိတ်ပါတယ်။

### `endpoint.destroyed`

* Type: {boolean}

`endpoint.destroy()` ကို ခေါ်ထားရင် `true` ပါ။ Read only ဖြစ်ပါတယ်။

### `endpoint.listening`

* Type: {boolean}

Endpoint က incoming connections တွေအတွက် တက်ကြွစွာ listen လုပ်နေရင် `true` ပါ။ Read only ဖြစ်ပါတယ်။

### `endpoint.maxConnectionsPerHost`

* Type: {number}

Remote IP address တစ်ခုစီအတွက် ခွင့်ပြုထားတဲ့ concurrent connections အများဆုံး အရေအတွက်ပါ။ `0` ဆိုရင် unlimited (ကန့်သတ်ချက် မရှိ) လို့ ဆိုလိုပါတယ် (default)။ `maxConnectionsPerHost` option ကနေတစ်ဆင့် ဖန်တီးချိန်မှာ သတ်မှတ်နိုင်ပြီး — ဘယ်အချိန်မဆို dynamic ပြောင်းလဲနိုင်ပါတယ်။ တရားဝင် range က `0` ကနေ `65535` အထိပါ။

### `endpoint.maxConnectionsTotal`

* Type: {number}

Remote addresses အားလုံးပေါ်မှာ စုစုပေါင်း concurrent connections အများဆုံး အရေအတွက်ပါ။ `0` ဆိုရင် unlimited (ကန့်သတ်ချက် မရှိ) လို့ ဆိုလိုပါတယ် (default)။ `maxConnectionsTotal` option ကနေတစ်ဆင့် ဖန်တီးချိန်မှာ သတ်မှတ်နိုင်ပြီး — ဘယ်အချိန်မဆို dynamic ပြောင်းလဲနိုင်ပါတယ်။ တရားဝင် range က `0` ကနေ `65535` အထိပါ။

### `endpoint.setSNIContexts(entries[, options])`

* `entries` {object} Host names တွေကို TLS identity options တွေဆီကို map လုပ်ပေးတဲ့ object တစ်ခုပါ။ Entry တစ်ခုချင်းစီမှာ `keys` နဲ့ `certs` ပါဝင်ရပါမယ်။
* `options` {object}
  * `replace` {boolean} `true` ဆိုရင် SNI map တစ်ခုလုံးကို အစားထိုးပါတယ်။ `false` (default) ဆိုရင် entries တွေကို ရှိပြီးသား map ထဲကို ပေါင်းစည်းပါတယ်။

ဒီ endpoint အတွက် SNI TLS contexts တွေကို အစားထိုးခြင်း (သို့) အပ်ဒိတ်လုပ်ခြင်း ဖြစ်ပါတယ်။ ဒါက endpoint ကို restart မလုပ်ပဲ host names တစ်ချို့အတွက် သုံးနေတဲ့ TLS identity (key/certificate) ကို ပြောင်းလဲနိုင်စေပါတယ်။ ရှိပြီးသား sessions တွေကိုတော့ မထိခိုက်ပါဘူး — session အသစ်တွေကသာ အပ်ဒိတ်လုပ်ထားတဲ့ contexts တွေကို သုံးပါလိမ့်မယ်။

```mjs
endpoint.setSNIContexts({
  'api.example.com': { keys: [newApiKey], certs: [newApiCert] },
});

// Replace the entire SNI map
endpoint.setSNIContexts({
  'api.example.com': { keys: [newApiKey], certs: [newApiCert] },
}, { replace: true });
```

### `endpoint.stats`

* Type: {quic.QuicEndpoint.Stats}

Active endpoint တစ်ခုအတွက် စုဆောင်းထားတဲ့ statistics တွေပါ။ Read only ဖြစ်ပါတယ်။

### `endpoint[Symbol.asyncDispose]()`

`endpoint.close()` ကို ခေါ်ပြီး — endpoint ပိတ်သွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

## Class: `QuicEndpoint.Stats`

Endpoint တစ်ခုအတွက် စုဆောင်းထားတဲ့ statistics တွေရဲ့ view (မြင်ကွင်း) တစ်ခုပါ။

### `endpointStats.createdAt`

* Type: {bigint} Endpoint ကို ဖန်တီးလိုက်တဲ့ အခိုက်အတန့်ကို ဖော်ပြတဲ့ timestamp ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.destroyedAt`

* Type: {bigint} Endpoint ကို destroy လုပ်လိုက်တဲ့ အခိုက်အတန့်ကို ဖော်ပြတဲ့ timestamp ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.bytesReceived`

* Type: {bigint} ဒီ endpoint က လက်ခံရရှိခဲ့တဲ့ စုစုပေါင်း bytes အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.bytesSent`

* Type: {bigint} ဒီ endpoint က ပို့လွှတ်ခဲ့တဲ့ စုစုပေါင်း bytes အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.packetsReceived`

* Type: {bigint} ဒီ endpoint က အောင်မြင်စွာ လက်ခံရရှိခဲ့တဲ့ QUIC packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.packetsSent`

* Type: {bigint} ဒီ endpoint က အောင်မြင်စွာ ပို့လွှတ်ခဲ့တဲ့ QUIC packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.serverSessions`

* Type: {bigint} Peer တွေက စတင်ပြီး ဒီ endpoint က လက်ခံရရှိခဲ့တဲ့ sessions စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.clientSessions`

* Type: {bigint} ဒီ endpoint က စတင်ခဲ့တဲ့ sessions စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.serverBusyCount`

* Type: {bigint} Endpoint က busy အဖြစ် မှတ်သားထားလို့ initial packet တစ်ခု ငြင်းပယ်ခံခဲ့ရတဲ့ အကြိမ် စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.retryCount`

* Type: {bigint} ဒီ endpoint က ပို့လွှတ်ခဲ့တဲ့ retry packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.retryRateLimited`

* Type: {bigint} Global rate limiter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ retry packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။ Non-zero တန်ဖိုး တစ်ခု ရှိနေရင် endpoint က retry flood ဖိအားအောက်မှာ ရှိနေတယ်လို့ ညွှန်ပြပါတယ်။

### `endpointStats.versionNegotiationCount`

* Type: {bigint} ဒီ endpoint က ပို့လွှတ်ခဲ့တဲ့ version negotiation packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.versionNegotiationRateLimited`

* Type: {bigint} Global rate limiter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ version negotiation packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.statelessResetCount`

* Type: {bigint} ဒီ endpoint က ပို့လွှတ်ခဲ့တဲ့ stateless reset packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.statelessResetRateLimited`

* Type: {bigint} Global rate limiter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ stateless reset packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.immediateCloseCount`

* Type: {bigint} ဒီ endpoint က ပို့လွှတ်ခဲ့တဲ့ immediate connection close packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.immediateCloseRateLimited`

* Type: {bigint} Global rate limiter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ immediate connection close packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

### `endpointStats.sessionCreationRateLimited`

* Type: {bigint} Per-host rate limiter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ session creation ကြိုးပမ်းမှု စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။ Non-zero တန်ဖိုး တစ်ခု ရှိနေရင် remote addresses တစ်ခု (သို့) တစ်ခုထက်ပိုက သတ်မှတ်ထားတဲ့ နှုန်းထက် ပိုမြန်မြန် sessions တွေကို ဖန်တီးနေတယ်လို့ ညွှန်ပြပါတယ်။

### `endpointStats.packetsBlocked`

* Type: {bigint} Block list filter ကြောင့် ပစ်ချခံခဲ့ရတဲ့ incoming packets စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

## Class: `QuicSession`

`QuicSession` တစ်ခုက QUIC connection တစ်ခုရဲ့ local ဘက်ခြမ်းကို ကိုယ်စားပြုပါတယ်။

### `session.applicationOptions`

* Type: {quic.ApplicationOptions}

ဒီ session အတွက် လက်ရှိ application-level options တွေပါ။ ဒါတွေထဲမှာ ညှိနှိုင်းပြီးသား application protocol (ဥပမာ HTTP/3) အတွက် သီးသန့်ဖြစ်တဲ့ settings တွေ ပါဝင်ပြီး — transport parameters တွေကနေ သီးခြား ညှိနှိုင်းနိုင်ပါတယ်။ Read only ဖြစ်ပါတယ်။ Remote ဘက်ကနေ settings တွေ ရောက်ရှိလာတဲ့အခါ အသိပေးခံရဖို့ [`session.onapplication`][] callback ကို သုံးနိုင်ပါတယ်။

### `session.close([options])`

* `options` {Object}
  * `code` {bigint|number} Peer ဆီကို ပို့တဲ့ `CONNECTION_CLOSE` frame ထဲမှာ ထည့်သွင်းမယ့် error code ပါ။ **Default:** `0` (error မရှိ)။
  * `type` {string} `'transport'` (သို့) `'application'` ထဲက တစ်ခု ဖြစ်ရပါမယ်။ `CONNECTION_CLOSE` frame ထဲမှာ သုံးမယ့် error code namespace ကို ဆုံးဖြတ်ပေးပါတယ်။ `'transport'` (default) ဖြစ်ရင် frame type က `0x1c` ဖြစ်ပြီး code ကို QUIC transport error အဖြစ် အဓိပ္ပာယ်ကောက်ပါတယ်။ `'application'` ဖြစ်ရင် frame type က `0x1d` ဖြစ်ပြီး code က application-specific ဖြစ်ပါတယ်။ **Default:** `'transport'`။
  * `reason` {string} `CONNECTION_CLOSE` frame ထဲမှာ ထည့်သွင်းတဲ့ optional ဖြစ်ပြီး လူဖတ်လို့ရတဲ့ (human-readable) reason string ပါ။ RFC 9000 အရ — ဒါက diagnostic ရည်ရွယ်ချက်အတွက်သာ ဖြစ်ပြီး — machine-readable error descriptions တွေအတွက် မသုံးသင့်ပါဘူး။
* Returns: {Promise}

Session ကို ချောမွေ့စွာ (gracefully) ပိတ်သိမ်းခြင်းကို စတင်ပါတယ်။ ရှိပြီးသား streams တွေကို ပြီးဆုံးခွင့် ပေးမယ်ဖြစ်ပြီး — stream အသစ်တွေကိုတော့ ဖွင့်တော့မှာ မဟုတ်ပါဘူး။ Streams တွေ အားလုံး ပိတ်သွားတာနဲ့ — session ကို destroy လုပ်ပါလိမ့်မယ်။ Session destroy ဖြစ်သွားတာနဲ့ ပြန်ပေးလိုက်တဲ့ promise က fulfill ဖြစ်ပါလိမ့်မယ်။ Non-zero `code` တစ်ခု သတ်မှတ်ထားရင် — promise က `type` ပေါ် မူတည်ပြီး `ERR_QUIC_TRANSPORT_ERROR` (သို့) `ERR_QUIC_APPLICATION_ERROR` နဲ့ reject ဖြစ်ပါလိမ့်မယ်။

### `session.opened`

* Type: {Promise} for an {Object}
  * `local` {net.SocketAddress} Local socket address ပါ။
  * `remote` {net.SocketAddress} Remote socket address ပါ။
  * `servername` {string} Handshake အတွင်းမှာ ညှိနှိုင်းခဲ့တဲ့ SNI server name ပါ။
  * `protocol` {string} Handshake အတွင်းမှာ ညှိနှိုင်းခဲ့တဲ့ ALPN protocol ပါ။
  * `cipher` {string} ညှိနှိုင်းပြီးသား TLS cipher suite ရဲ့ နာမည်ပါ။
  * `cipherVersion` {string} Cipher suite ရဲ့ TLS protocol version ပါ (ဥပမာ `'TLSv1.3'`)။
  * `validationErrorReason` {string} Certificate validation မအောင်မြင်ခဲ့ရင် reason string ပါ။ Validation အောင်မြင်ခဲ့ရင် empty string ဖြစ်ပါတယ်။
  * `validationErrorCode` {number} Certificate validation မအောင်မြင်ခဲ့ရင် error code ပါ။ Validation အောင်မြင်ခဲ့ရင် `0` ဖြစ်ပါတယ်။
  * `earlyDataAttempted` {boolean} 0-RTT early data ကို ကြိုးပမ်းခဲ့လား ဆိုတာပါ။
  * `earlyDataAccepted` {boolean} 0-RTT early data ကို server က လက်ခံခဲ့လား ဆိုတာပါ။

TLS handshake က အောင်မြင်စွာ ပြီးဆုံးသွားတာနဲ့ fulfill ဖြစ်မယ့် promise တစ်ခုပါ။ Resolve လုပ်လိုက်တဲ့ တန်ဖိုးထဲမှာ တည်ဆောက်ပြီးသား session အကြောင်း — ညှိနှိုင်းပြီးသား protocol, cipher suite, certificate validation အခြေအနေနဲ့ 0-RTT early data အခြေအနေ အပါအဝင် — အချက်အလက်တွေ ပါဝင်ပါတယ်။

Handshake မအောင်မြင်ခဲ့ရင် (သို့) handshake မပြီးဆုံးခင် session ကို destroy လုပ်လိုက်ရင် — promise က reject ဖြစ်ပါလိမ့်မယ်။

### `session.closed`

* Type: {Promise}

Session destroy ဖြစ်သွားတာနဲ့ fulfill ဖြစ်မယ့် promise တစ်ခုပါ။

### `session.closing`

* Type: {boolean}

[`session.close()`][] ကို ခေါ်ထားပြီး session ကို destroy မလုပ်ရသေးဘူးဆိုရင် `true` ပါ။ Read only ဖြစ်ပါတယ်။

### `session.destroy([error[, options]])`

* `error` {any}
* `options` {Object}
  * `code` {bigint|number} Peer ဆီကို ပို့တဲ့ `CONNECTION_CLOSE` frame ထဲမှာ ထည့်သွင်းမယ့် error code ပါ။ **Default:** `0`။
  * `type` {string} `'transport'` (သို့) `'application'` ထဲက တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `'transport'`။
  * `reason` {string} `CONNECTION_CLOSE` frame ထဲမှာ ထည့်သွင်းတဲ့ optional ဖြစ်ပြီး human-readable reason string ပါ။

Session ကို ချက်ချင်း destroy လုပ်ပါတယ်။ Streams တွေ အားလုံး destroy ဖြစ်ပြီး session ကို ပိတ်ပါလိမ့်မယ်။ `error` တစ်ခု ပေးထားပြီး [`session.onerror`][] သတ်မှတ်ထားရင် — destroy မလုပ်ခင် `onerror` callback ကို ခေါ်ပါတယ်။ `session.closed` promise က အဲဒီ error နဲ့ reject ဖြစ်ပါလိမ့်မယ်။ `options` ပေးထားရင် — peer ဆီကို ပို့တဲ့ `CONNECTION_CLOSE` frame ထဲမှာ သတ်မှတ်ထားတဲ့ error code, type နဲ့ reason ပါဝင်ပါလိမ့်မယ်။

### `session.destroyed`

* Type: {boolean}

`session.destroy()` ကို ခေါ်ထားရင် `true` ပါ။ Read only ဖြစ်ပါတယ်။

### `session.localTransportParams`

* Type: {quic.TransportParams|null}

Handshake အတွင်းမှာ local endpoint က ကြေညာခဲ့တဲ့ transport parameters တွေပါ။ Session ကို destroy လုပ်ပြီးသားဆိုရင် `null` ကို ပြန်ပေးပါတယ်။ Read only ဖြစ်ပါတယ်။

### `session.endpoint`

* Type: {quic.QuicEndpoint|null}

ဒီ session ကို ဖန်တီးခဲ့တဲ့ endpoint ပါ။ Session ကို destroy လုပ်ပြီးသားဆိုရင် `null` ကို ပြန်ပေးပါတယ်။ Read only ဖြစ်ပါတယ်။

### `session.onapplication`

* Type: {quic.OnApplicationCallback}

Application options အသစ်တွေ — ဥပမာ HTTP/3 settings တွေ — ရောက်ရှိလာတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။

### `session.onerror`

* Type: {Function|undefined}

Session ကို error တစ်ခုနဲ့ destroy လုပ်တဲ့အခါ ခေါ်ယူတဲ့ optional callback တစ်ခုပါ။ ဒါထဲမှာ throw (သို့) reject လုပ်တဲ့ user callbacks တွေကြောင့် ဖြစ်ပေါ်တဲ့ errors တွေလည်း ပါဝင်ပါတယ် ([Callback error handling][] ကို ကြည့်ပါ)။ Callback က argument တစ်ခုတည်း — destroy လုပ်တာကို ဖြစ်ပေါ်စေတဲ့ error — ကို လက်ခံပါတယ်။ `onerror` callback ကိုယ်တိုင်က throw လုပ်ခဲ့ရင် (သို့) reject ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးခဲ့ရင် — အဲဒီ error ကို uncaught exception အဖြစ် ထုတ်ဖော်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

[`quic.connect()`][] (သို့) [`quic.listen()`][] ထဲက `onerror` option ကနေတစ်ဆင့်လည်း သတ်မှတ်နိုင်ပါတယ်။

### `session.onstream`

* Type: {quic.OnStreamCallback}

Remote peer တစ်ဦးက stream အသစ်တစ်ခုကို စတင်လိုက်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

`onstream` callback တစ်ခုမှ မသတ်မှတ်ထားပဲ — stream ကို စားသုံးမယ့်သူ (consumer) တစ်ဦးမှ မရှိဘူးဆိုရင် — incoming stream တစ်ခုက ရောက်ရှိလာတာနဲ့ destroy လုပ်ခံရပြီး warning တစ်ခု emit လုပ်ပါတယ်။ ညှိနှိုင်းပြီးသား application protocol က support လုပ်တဲ့အခါ (ဥပမာ HTTP/3) — `onheaders` callback တစ်ခုက consumer အဖြစ် သတ်မှတ်ခံရပါတယ် — အကြောင်းကတော့ incoming request stream တိုင်းအတွက် ၎င်းကို ခေါ်ယူလို့ပါ။ တခြား stream-level callbacks တွေ (`ontrailers`, `oninfo`, `onwanttrailers`) ကတော့ conditional (သို့) outbound-only (အပြင်သို့သာ ပို့သည့်) သဘောရှိပြီး — stream ကို စောင့်ကြည့်လို့မရအောင် ထားခဲ့မှာမို့ consumer အဖြစ် မသတ်မှတ်ပါဘူး။ Requests တွေကို `onheaders` ကနေတစ်ဆင့်ပဲ အပြည့်အဝ ကိုင်တွယ်တဲ့ HTTP/3 server တစ်ခုက `onstream` ကို သတ်မှတ်စရာ မလိုပါဘူး။

### `session.ondatagram`

* Type: {quic.OnDatagramCallback}

Remote peer တစ်ဦးဆီကနေ datagram အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.ondatagramstatus`

* Type: {quic.OnDatagramStatusCallback}

Datagram တစ်ခုရဲ့ status အပ်ဒိတ်ဖြစ်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.onearlyrejected`

* Type: {Function|undefined}

Server က 0-RTT early data ကို ငြင်းပယ်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ ဒါ fire ဖြစ်တဲ့အခါ — 0-RTT အဆင့်အတွင်းမှာ ဖွင့်ထားခဲ့တဲ့ streams တွေ အားလုံးကို destroy လုပ်ပြီးပါပြီ။ Application က လိုအပ်ရင် streams တွေကို ပြန်ဖွင့်သင့်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

ဒီ callback က server က client ရဲ့ 0-RTT ကြိုးပမ်းမှုကို ငြင်းပယ်တဲ့အခါ client ဘက်မှာသာ fire ဖြစ်ပါတယ်။ Connection က 1-RTT ဆီကို ပြန်ကျပြီး ပုံမှန်အတိုင်း ဆက်လုပ်ပါတယ်။

### `session.onpathvalidation`

* Type: {quic.OnPathValidationCallback}

Path validation အပ်ဒိတ်ဖြစ်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.onsessionticket`

* Type: {quic.OnSessionTicketCallback}

Session ticket အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.onversionnegotiation`

* Type: {quic.OnVersionNegotiationCallback}

Version negotiation တစ်ခု စတင်လိုက်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.onhandshake`

* Type: {quic.OnHandshakeCallback}

TLS handshake ပြီးဆုံးသွားတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.onnewtoken`

* Type: {quic.OnNewTokenCallback}

Server ဆီကနေ NEW\_TOKEN token တစ်ခု လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Token ကို server တစ်ခုတည်းဆီကို နောက်ပိုင်း connection တစ်ခုမှာ `token` option အနေနဲ့ ဖြတ်သန်းပြီး address validation ကို ကျော်သွားနိုင်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `session.onorigin`

* Type: {quic.OnOriginCallback}

Server ဆီကနေ ORIGIN frame (RFC 9412) တစ်ခု လက်ခံရရှိတဲ့အခါ — server က ဘယ် origins တွေအတွက် authoritative (တရားဝင် ကိုယ်စားပြုမှု) ရှိလဲဆိုတာ ဖော်ပြတဲ့ — ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `session.ongoaway`

* Type: {Function}

Peer က HTTP/3 GOAWAY frame တစ်ခုကို ပို့လိုက်တဲ့အခါ — သူက graceful shutdown တစ်ခုကို စတင်နေတယ်လို့ ဖော်ပြတဲ့ — ခေါ်ယူရမယ့် callback ပါ။ Callback က `(lastStreamId)` ကို လက်ခံပြီး — `lastStreamId` က `{bigint}` တစ်ခု ဖြစ်ပါတယ်:

* `lastStreamId` က `-1n` ဖြစ်နေရင် — peer က stream boundary တစ်ခုကို သတ်မှတ်မပေးပဲ shutdown အသိပေးချက် (ပိတ်ဖို့ ရည်ရွယ်ချက်) တစ်ခုကို ပို့ခဲ့တာပါ။ ရှိပြီးသား streams တွေ အားလုံးကို ဆက်လက် process လုပ်နိုင်ပါသေးတယ်။
* `lastStreamId` က `>= 0n` ဖြစ်နေရင် — အဲဒါက peer က process လုပ်ပြီးသား ဖြစ်နိုင်တဲ့ အမြင့်ဆုံး stream ID ပါ။ ဒီတန်ဖိုးအထက် ရှိတဲ့ IDs တွေရဲ့ streams တွေကို process လုပ်ထားခြင်း မဟုတ်ပဲ — connection အသစ်တစ်ခုပေါ်မှာ လုံခြုံစွာ ပြန်ကြိုးစားနိုင်ပါတယ်။

GOAWAY ကို လက်ခံရရှိပြီးနောက်မှာ `session.createBidirectionalStream()` က `ERR_INVALID_STATE` ကို throw လုပ်ပါလိမ့်မယ်။ ရှိပြီးသား streams တွေက ပြီးဆုံးတဲ့အထိ (သို့) session ပိတ်သွားတဲ့အထိ ဆက်လုပ်ပါတယ်။

ဒီ callback က HTTP/3 sessions တွေအတွက်သာ သက်ဆိုင်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `session.onkeylog`

* Type: {quic.OnKeylogCallback}

TLS key material ရရှိနိုင်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ [`sessionOptions.keylog`][] က `true` ဖြစ်ဖို့ လိုအပ်ပါတယ်။ ခေါ်ယူမှု တစ်ခုချင်းစီက [NSS Key Log Format][] ရဲ့ text စာကြောင်း တစ်ကြောင်းစီကို (နောက်ဆုံးမှာ newline တစ်ခု အပါအဝင်) လက်ခံရရှိပါတယ်။ Wireshark လိုမျိုး tools တွေနဲ့ packet captures တွေကို decrypt လုပ်ဖို့ ဒါက အသုံးဝင်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

[`quic.connect()`][] (သို့) [`quic.listen()`][] ထဲက `onkeylog` option ကနေတစ်ဆင့်လည်း သတ်မှတ်နိုင်ပါတယ်။

### `session.onqlog`

* Type: {quic.OnQlogCallback}

qlog data ရရှိနိုင်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ [`sessionOptions.qlog`][] က `true` ဖြစ်ဖို့ လိုအပ်ပါတယ်။ Callback က [JSON-SEQ][] ပုံစံနဲ့ ချပေးထားတဲ့ qlog data ရဲ့ string chunk တစ်ခုနဲ့ boolean `fin` flag တစ်ခုကို လက်ခံရရှိပါတယ်။ `fin` က `true` ဖြစ်တဲ့အခါ — အဲဒီ chunk က ဒီ session အတွက် နောက်ဆုံး qlog output ဖြစ်ပြီး — ပေါင်းစည်းလိုက်တဲ့ chunks တွေက qlog trace တစ်ခုလုံးကို ပြည့်စုံစေပါတယ်။ Read/write ဖြစ်ပါတယ်။

qlog data က connection lifecycle အတွင်းမှာ ရောက်ရှိလာပါတယ်။ ပထမဆုံး chunk ထဲမှာ format metadata တွေပါတဲ့ qlog header ပါဝင်ပြီး — နောက်ဆက်တွဲ chunks တွေထဲမှာတော့ trace events တွေ ပါဝင်ပါတယ်။ နောက်ဆုံး chunk (`fin` ကို `true` အဖြစ် သတ်မှတ်ထားတဲ့) ကို session destroy လုပ်ချိန်မှာ emit လုပ်ပြီး — JSON-SEQ output ကို ပြည့်စုံစေပါတယ်။

[`quic.connect()`][] (သို့) [`quic.listen()`][] ထဲက `onqlog` option ကနေတစ်ဆင့်လည်း သတ်မှတ်နိုင်ပါတယ်။

### `session.createBidirectionalStream([options])`

* `options` {Object}
  * `body` {string | ArrayBuffer | SharedArrayBuffer | ArrayBufferView |
    Blob | FileHandle | AsyncIterable | Iterable | Promise | null}
    Outbound body source ပါ။ Support လုပ်တဲ့ types တွေရဲ့ အသေးစိတ်ကို [`stream.setBody()`][] မှာ ကြည့်ပါ။ မပေးထားဘူးဆိုရင် — stream ရဲ့ outgoing side က body ဘာမှ queue မလုပ်ထားပဲ writable အနေနဲ့ ဆက်ရှိနေပြီး — FIN ကို ချက်ချင်း မပို့ပါဘူး။
  * `headers` {Object} ပို့ဖို့ ကနဦး request (သို့) response headers တွေပါ။ Session က headers တွေကို support လုပ်တဲ့အခါမှသာ သုံးပါတယ် (ဥပမာ HTTP/3)။ `body` မသတ်မှတ်ပဲ `headers` ပဲ ပေးထားရင် — stream ကို headers-only (terminal) အဖြစ် သဘောမှတ်ပါတယ်။
  * `priority` {string} Stream ရဲ့ priority level ပါ။ `'high'`, `'default'`, (သို့) `'low'` ထဲက တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'default'`။
  * `incremental` {boolean} `true` ဆိုရင် — ဒီ stream ကနေ လာတဲ့ data တွေကို priority level တူတဲ့ တခြား streams တွေရဲ့ data တွေနဲ့ ရောပြီး (interleave) ပို့နိုင်ပါတယ်။ `false` ဆိုရင် — stream ကို same-priority peers တွေမတိုင်ခင် ပြီးဆုံးအောင် လုပ်ရပါတယ်။ **Default:** `false`။
  * `budget` {number} `writeSync()` က `false` ပြန်မပေးခင် writer က buffer လုပ်ထားမယ့် အများဆုံး bytes အရေအတွက်ပါ။ Buffer လုပ်ထားတဲ့ data က ဒီ limit ကို ကျော်လွန်တဲ့အခါ — caller က နောက်ထပ် မရေးသားခင် drain ဖြစ်တာကို စောင့်သင့်ပါတယ်။ **Default:** `65536` (64 KB)။
  * `onheaders` {Function} လက်ခံရရှိတဲ့ initial response headers တွေအတွက် callback ပါ။ `(headers)` နဲ့ ခေါ်ပါတယ်။
  * `ontrailers` {Function} လက်ခံရရှိတဲ့ trailing headers တွေအတွက် callback ပါ။ `(trailers)` နဲ့ ခေါ်ပါတယ်။
  * `oninfo` {Function} လက်ခံရရှိတဲ့ informational (1xx) headers တွေအတွက် callback ပါ။ `(headers)` နဲ့ ခေါ်ပါတယ်။
  * `onwanttrailers` {Function} Trailers တွေ ပို့သင့်တဲ့အခါ အတွက် callback ပါ။ Argument တွေ မပါပဲ ခေါ်ပြီး — callback အတွင်းမှာ [`stream.sendTrailers()`][] ကို သုံးပါ။
* Returns: {Promise} {quic.QuicStream} တစ်ခုအတွက် promise ပါ။

Bidirectional stream အသစ်တစ်ခုကို ဖွင့်ပါတယ်။ `body` option ကို မသတ်မှတ်ထားဘူးဆိုရင် — stream ရဲ့ outgoing side က writable အနေနဲ့ ဆက်ရှိနေပြီး FIN ကို ချက်ချင်း မပို့ပါဘူး။ `priority` နဲ့ `incremental` options တွေက session က priority ကို support လုပ်တဲ့အခါမှသာ သုံးပါတယ် (ဥပမာ HTTP/3)။ `headers`, `onheaders`, `ontrailers`, `oninfo`, `onwanttrailers` options တွေကတော့ session က headers တွေကို support လုပ်တဲ့အခါမှသာ သုံးပါတယ် (ဥပမာ HTTP/3)။

### `session.createUnidirectionalStream([options])`

* `options` {Object}
  * `body` {string | ArrayBuffer | SharedArrayBuffer | ArrayBufferView |
    Blob | FileHandle | AsyncIterable | Iterable | Promise | null}
    Outbound body source ပါ။ Support လုပ်တဲ့ types တွေရဲ့ အသေးစိတ်ကို [`stream.setBody()`][] မှာ ကြည့်ပါ။ မပေးထားဘူးဆိုရင် — stream ရဲ့ outgoing side က body ဘာမှ queue မလုပ်ထားပဲ writable အနေနဲ့ ဆက်ရှိနေပြီး — FIN ကို ချက်ချင်း မပို့ပါဘူး။
  * `headers` {Object} ပို့ဖို့ ကနဦး request headers တွေပါ။
  * `priority` {string} Stream ရဲ့ priority level ပါ။ `'high'`, `'default'`, (သို့) `'low'` ထဲက တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'default'`။
  * `incremental` {boolean} `true` ဆိုရင် — ဒီ stream ကနေ လာတဲ့ data တွေကို priority level တူတဲ့ တခြား streams တွေရဲ့ data တွေနဲ့ ရောပြီး (interleave) ပို့နိုင်ပါတယ်။ `false` ဆိုရင် — stream ကို same-priority peers တွေမတိုင်ခင် ပြီးဆုံးအောင် လုပ်ရပါတယ်။ **Default:** `false`။
  * `budget` {number} `writeSync()` က `false` ပြန်မပေးခင် writer က buffer လုပ်ထားမယ့် အများဆုံး bytes အရေအတွက်ပါ။ Buffer လုပ်ထားတဲ့ data က ဒီ limit ကို ကျော်လွန်တဲ့အခါ — caller က နောက်ထပ် မရေးသားခင် drain ဖြစ်တာကို စောင့်သင့်ပါတယ်။ **Default:** `65536` (64 KB)။
  * `onheaders` {Function} လက်ခံရရှိတဲ့ initial response headers တွေအတွက် callback ပါ။ `(headers)` နဲ့ ခေါ်ပါတယ်။
  * `ontrailers` {Function} လက်ခံရရှိတဲ့ trailing headers တွေအတွက် callback ပါ။ `(trailers)` နဲ့ ခေါ်ပါတယ်။
  * `oninfo` {Function} လက်ခံရရှိတဲ့ informational (1xx) headers တွေအတွက် callback ပါ။ `(headers)` နဲ့ ခေါ်ပါတယ်။
  * `onwanttrailers` {Function} Trailers တွေ ပို့သင့်တဲ့အခါ အတွက် callback ပါ။
* Returns: {Promise} {quic.QuicStream} တစ်ခုအတွက် promise ပါ။

Unidirectional stream အသစ်တစ်ခုကို ဖွင့်ပါတယ်။ `body` option ကို မသတ်မှတ်ထားဘူးဆိုရင် — stream ရဲ့ outgoing side က writable အနေနဲ့ ဆက်ရှိနေပြီး FIN ကို ချက်ချင်း မပို့ပါဘူး။ `priority` နဲ့ `incremental` options တွေက session က priority ကို support လုပ်တဲ့အခါမှသာ သုံးပါတယ် (ဥပမာ HTTP/3)။

### `session.path`

* Type: {Object|undefined}
  * `local` {net.SocketAddress}
  * `remote` {net.SocketAddress}

Session နဲ့ ဆက်စပ်နေတဲ့ local နဲ့ remote socket addresses တွေပါ။ Read only ဖြစ်ပါတယ်။

### `session.remoteTransportParams`

* Type: {quic.TransportParams|null|undefined}

Handshake အတွင်းမှာ remote peer က ကြေညာခဲ့တဲ့ transport parameters တွေပါ။ Session ကို destroy လုပ်ပြီးသားဆိုရင် `null` ကို — handshake က မပြီးဆုံးသေးပဲ remote parameters တွေ မရနိုင်သေးဘူးဆိုရင် `undefined` ကို ပြန်ပေးပါတယ်။ Read only ဖြစ်ပါတယ်။

### `session.sendDatagram(datagram[, encoding])`

* `datagram` {string|ArrayBufferView|Promise}
* `encoding` {string} `datagram` က string ဖြစ်ရင် သုံးမယ့် encoding ပါ။ **Default:** `'utf8'`။
* Returns: {Promise} {bigint} datagram ID တစ်ခုအတွက် promise ပါ။

Remote peer ဆီကို unreliable datagram တစ်ခုကို ပို့ပြီး — datagram ID အတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

`datagram` က string ဖြစ်ရင် — သတ်မှတ်ထားတဲ့ `encoding` ကို သုံးပြီး encode လုပ်ပါလိမ့်မယ်။

`datagram` က `ArrayBufferView` ဖြစ်ရင် — bytes တွေကို internal buffer တစ်ခုထဲကို ကူးယူပြီး — caller ရဲ့ source buffer က မပြောင်းလဲပဲ ကျန်နေကာ — call ပြန်လာပြီးတာနဲ့ ချက်ချင်း ပြန်သုံးစွဲနိုင် (သို့) ပြောင်းလဲနိုင်ပါတယ်။ Call ပြီးနောက်မှာ ကိုယ့် source ကို ဘယ်သူမှ မပြောင်းလဲနိုင်အောင် သေချာစေချင်တဲ့ callers တွေက (ဥပမာ — buffer ကို async consumer တစ်ခုဆီ လွှဲပြောင်းပေးတဲ့အခါ) — buffer ကို မဖြတ်သန်းခင် `ArrayBuffer.prototype.transfer()` ကို ကိုယ်တိုင် ခေါ်နိုင်ပါတယ်။

`datagram` က `Promise` ဖြစ်ရင် — မပို့ခင် ၎င်းကို await လုပ်ပါလိမ့်မယ်။ Await လုပ်နေတုန်း session ပိတ်သွားခဲ့ရင် — `0n` ကို တိတ်တဆိတ် ပြန်ပေးပါတယ် (datagrams တွေက ပင်ကိုယ်အားဖြင့် unreliable ပါ)။

Datagram payload က zero-length (encoding ပြီးနောက် empty string, detached buffer (သီးခြားခွဲထုတ်ထားသော buffer), (သို့) zero-length view) ဖြစ်ရင် — `0n` ကို ပြန်ပေးပြီး datagram ဘာမှ မပို့ပါဘူး။

HTTP/3 sessions တွေအတွက် — datagrams တွေ ပို့နိုင်ဖို့ peer က `SETTINGS_H3_DATAGRAM=1` ကို ကြေညာထားရပါမယ် (`application: { enableDatagrams: true }` ကနေတစ်ဆင့်)။ Peer ရဲ့ setting က `0` ဆိုရင် — `sendDatagram()` က `0n` ကို ပြန်ပေးပါတယ် (RFC 9297 §3 အရ — peer က support ရှိတယ်လို့ ဖော်ပြမထားရင် endpoint တစ်ခုက HTTP Datagrams တွေကို မပို့ရပါဘူး (MUST NOT))။

Datagrams တွေကို fragment လုပ်လို့ မရပါဘူး — တစ်ခုချင်းစီက QUIC packet တစ်ခုတည်းအတွင်းမှာ အံဝင်ရပါတယ်။ အများဆုံး datagram အရွယ်အစားကို peer ရဲ့ `maxDatagramFrameSize` transport parameter (peer က handshake အတွင်းမှာ ကြေညာတဲ့) က ဆုံးဖြတ်ပါတယ်။ Peer က ဒါကို `0` အဖြစ် သတ်မှတ်ထားရင် — datagrams တွေကို support မလုပ်ပဲ `0n` ကို ပြန်ပေးပါလိမ့်မယ်။ Datagram က peer ရဲ့ limit ကို ကျော်လွန်နေရင်လည်း — တိတ်တဆိတ် ပစ်ချပြီး `0n` ကို ပြန်ပေးပါတယ်။ Local `maxDatagramFrameSize` transport parameter (default: `1200` bytes) ကတော့ ဒီ endpoint က peer ဆီကို ကိုယ်ပိုင် maximum အနေနဲ့ ကြေညာမယ့်အရာကို ထိန်းချုပ်ပါတယ်။

### `session.servername`

* Type: {string|boolean|null}

Session နဲ့ ဆက်စပ်နေတဲ့ SNI (Server Name Indication) host name ပါ။ Client hello ကို process မလုပ်ရသေးခင် ဒါက `null` ပါ။ Hello ကို process လုပ်ပြီးတာနဲ့ — host name string (သို့) handshake မှာ SNI မပါခဲ့ရင် `false` ဖြစ်ပါတယ်။

### `session.alpnProtocol`

* Type: {string|null}

ညှိနှိုင်းပြီးသား ALPN protocol ပါ။ Client hello ကို process မလုပ်ရသေးခင် ဒါက `null` ပါ။ ALPN ညှိနှိုင်းပြီးတာနဲ့ — ဒါက protocol string ဖြစ်ပါတယ်။ QUIC မှာ ALPN က mandatory (မဖြစ်မနေ လိုအပ်) ဖြစ်တာမို့ — optional ဖြစ်တဲ့ `node:tls` နဲ့ မတူပဲ — အောင်မြင်တဲ့ connections တွေမှာ ဒါက ဘယ်တော့မှ `false` မဖြစ်ပါဘူး။

### `session.certificate`

* Type: {crypto.X509Certificate|undefined}

Local certificate ကို [`crypto.X509Certificate`][] instance တစ်ခုအနေနဲ့ ဖော်ပြပါတယ်။ Server sessions တွေက ညှိနှိုင်းပြီးသား SNI host အတွက် သတ်မှတ်ထားတဲ့ certificate ကို ပြန်ပေးပါတယ်။ Client sessions တွေကတော့ client certificate တစ်ခု ပို့ထားခြင်း မရှိရင် `undefined` ကို ပြန်ပေးပါတယ်။ Session ကို destroy လုပ်ထားရင်လည်း `undefined` ကို ပြန်ပေးပါတယ်။
### `session.peerCertificate`

* Type: {crypto.X509Certificate|undefined}

Peer ရဲ့ certificate ကို [`crypto.X509Certificate`][] instance တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Peer က certificate တစ်ခုကို တင်ပြခြင်း မရှိခဲ့ဘူးဆိုရင် သို့မဟုတ် session ကို destroy လုပ်ထားပြီးသားဆိုရင် `undefined` ကို ပြန်ပေးပါတယ်။

### `session.ephemeralKeyInfo`

* Type: {Object|undefined}

Session အတွက် ephemeral key (ယာယီ key) အချက်အလက်တွေကို `type`, `name` နဲ့ `size` လိုမျိုး properties တွေနဲ့အတူ ပြန်ပေးပါတယ်။ Client sessions တွေမှာသာ ရရှိနိုင်ပါတယ်။ Server sessions တွေမှာ သို့မဟုတ် session ကို destroy လုပ်ထားရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။

### `session.maxDatagramSize`

* Type: {number}

Peer က လက်ခံနိုင်မယ့် datagram payload အရွယ်အစား အများဆုံးကို bytes အနေနဲ့ ဖော်ပြပါတယ်။ ဒါက peer ရဲ့ `maxDatagramFrameSize` transport parameter ကနေ DATAGRAM frame ရဲ့ overhead (type byte နဲ့ variable-length integer encoding) ကို နုတ်ပြီး ဆင်းသက်လာတာပါ။ Peer က datagrams တွေကို support မလုပ်ဘူးဆိုရင် သို့မဟုတ် handshake က မပြီးဆုံးသေးဘူးဆိုရင် `0` ကို ပြန်ပေးပါတယ်။ ဒီတန်ဖိုးထက် ကြီးတဲ့ datagrams တွေကို ပို့လွှတ်မှာ မဟုတ်ပါဘူး။

### `session.maxPendingDatagrams`

* Type: {number}
* **Default:** `128`

ပို့လွှတ်ဖို့အတွက် queue တန်းစီထားလို့ရတဲ့ datagrams အရေအတွက် အများဆုံးပါ။ `sendDatagram()` ကို ခေါ်လိုက်တဲ့အခါ datagrams တွေကို queue ထဲ ထည့်သွင်းပြီး — packet serialization loop က stream data တွေနဲ့အတူ အခွင့်ကောင်းယူပြီး (opportunistically) ပို့လွှတ်ပါတယ်။ Queue ပြည့်နေတဲ့အခါ — [`sessionOptions.datagramDropPolicy`][] က အသက်အကြီးဆုံး သို့မဟုတ် အသစ်ဆုံး datagram ကို ပစ်ချမလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ ပစ်ချလိုက်တဲ့ datagrams တွေကို `ondatagramstatus` callback ကနေတစ်ဆင့် ပျောက်ဆုံးသွားတယ်လို့ အစီရင်ခံပါတယ်။

ဒီ property ကို — application ရဲ့ လုပ်ဆောင်ချက်တွေ သို့မဟုတ် memory pressure (မှတ်ဉာဏ် ဖိအား) ပေါ်မူတည်ပြီး queue ရဲ့ စွမ်းဆောင်ရည်ကို ချိန်ညှိဖို့ — dynamically ပြောင်းလဲလို့ရပါတယ်။ တရားဝင်တဲ့ range ကတော့ `0` ကနေ `65535` အထိပါ။

### `session.stats`

* Type: {quic.QuicSession.Stats}

Session အတွက် လက်ရှိ statistics (ကိန်းဂဏန်း အချက်အလက်များ) တွေကို ပြန်ပေးပါတယ်။ Read only ဖြစ်ပါတယ်။

### `session.updateKey()`

Session အတွက် key update (သော့ချက် ပြန်လည် မွမ်းမံခြင်း) တစ်ခုကို စတင်ပါတယ်။

### `session[Symbol.asyncDispose]()`

`session.close()` ကို ခေါ်ပြီး — session ပိတ်သွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

## Class: `QuicSession.Stats`

### `sessionStats.createdAt`

* Type: {bigint}

### `sessionStats.closingAt`

* Type: {bigint}

### `sessionStats.handshakeCompletedAt`

* Type: {bigint}

### `sessionStats.handshakeConfirmedAt`

* Type: {bigint}

### `sessionStats.bytesReceived`

* Type: {bigint}

### `sessionStats.bytesSent`

* Type: {bigint}

### `sessionStats.bidiInStreamCount`

* Type: {bigint}

### `sessionStats.bidiOutStreamCount`

* Type: {bigint}

### `sessionStats.uniInStreamCount`

* Type: {bigint}

### `sessionStats.uniOutStreamCount`

* Type: {bigint}

### `sessionStats.maxBytesInFlight`

* Type: {bigint}

### `sessionStats.bytesInFlight`

* Type: {bigint}

### `sessionStats.blockCount`

* Type: {bigint}

### `sessionStats.cwnd`

* Type: {bigint}

### `sessionStats.latestRtt`

* Type: {bigint}

### `sessionStats.minRtt`

* Type: {bigint}

### `sessionStats.rttVar`

* Type: {bigint}

### `sessionStats.smoothedRtt`

* Type: {bigint}

### `sessionStats.ssthresh`

* Type: {bigint}

### `sessionStats.datagramsReceived`

* Type: {bigint}

### `sessionStats.datagramsSent`

* Type: {bigint}

### `sessionStats.datagramsAcknowledged`

* Type: {bigint}

### `sessionStats.datagramsLost`

* Type: {bigint}

### `sessionStats.streamsIdleTimedOut`

* Type: {bigint} Stream idle timeout ကြောင့် ဖျက်ဆီးခံခဲ့ရတဲ့ peer ဘက်က စတင်တဲ့ (peer-initiated) streams တွေရဲ့ စုစုပေါင်း အရေအတွက်ပါ။ Read only ဖြစ်ပါတယ်။

## Class: `QuicError`

> Stability: 1 - Experimental

`QuicError` ဆိုတာ — တိကျတဲ့ numeric QUIC error code တစ်ခုကို သယ်ဆောင်ပေးတဲ့ — `Error` ၏ subclass (အောက်ခွဲ အတန်းအစား) တစ်ခုပါ။ Implementation က generic fallback (ယေဘုယျ နောက်ဆုတ် ရွေးချယ်မှု) တစ်ခုကို ရွေးချယ်စေမယ့်အစား — application protocol က သတ်မှတ်ထားတဲ့ တိကျတဲ့ error code တစ်ခုနဲ့ QUIC stream သို့မဟုတ် session တစ်ခုကို abort လုပ်ဖို့ ဒါကို သုံးပါတယ်။

ဒီ class ကို `node:quic` ကနေ export လုပ်ပါတယ်:

```mjs
import { QuicError } from 'node:quic';
```

```cjs
const { QuicError } = require('node:quic');
```

Wire frame တစ်ခုကို emit လုပ်တဲ့ APIs တွေ ([`writer.fail()`][], [`stream.destroy()`][]) ဆီကို `QuicError` တစ်ခု ပေးအပ်လိုက်တဲ့အခါ — QUIC stack က [`error.errorCode`][] ကို ရလာတဲ့ frame အတွက် wire code အဖြစ် သုံးပါတယ်။ တခြား value တစ်ခုခုကို ပေးအပ်လိုက်တဲ့အခါ (ဥပမာ — သာမန် `Error` တစ်ခု) — implementation က ညှိနှိုင်းပြီးသား application protocol ရဲ့ "internal error" code ကို နောက်ဆုတ် အသုံးပြုပါတယ် (HTTP/3 အတွက် `H3_INTERNAL_ERROR` (`0x102`) သို့မဟုတ် — raw QUIC အတွက် — QUIC transport layer ရဲ့ `INTERNAL_ERROR` (`0x1`))။

Node.js error code (`error.code`) က default အနေနဲ့ `'ERR_QUIC_STREAM_ABORTED'` ဖြစ်ပါတယ်။ ပိုတိကျတဲ့ code string တစ်ခု လိုအပ်တဲ့ callers တွေက `options.code` ကနေတစ်ဆင့် override လုပ်နိုင်ပါတယ် — numeric QUIC code ကိုတော့ အကျိုးသက်ရောက်မှု မရှိပါဘူး။

Node.js error code ကို `'ERR_QUIC_STREAM_ABORTED'` မှာ ပုံသေ သတ်မှတ်ထားတာက — catch blocks တွေက prototype chain ကို စစ်ဆေးစရာ မလိုပဲ `QuicError` တစ်ခုကို တခြား Node.js errors တွေကနေ ခွဲခြားနိုင်စေဖို့ပါ။ `error.code` က string တစ်ခု ဆိုတဲ့ Node.js ရဲ့ စည်းမျဉ်းနဲ့ ထိပ်တိုက် မတိုက်စေဖို့ — numeric QUIC code ကို သီးခြား [`error.errorCode`][] property ပေါ်မှာ ထားရှိပါတယ်။

### `new QuicError(message, options)`

* `message` {string} လူတွေ ဖတ်လို့ရတဲ့ (human-readable) error ဖော်ပြချက် တစ်ခုပါ။
* `options` {Object}
  * `errorCode` {bigint | number} Numeric QUIC error code ပါ။ Numbers တွေကို `BigInt` အဖြစ် ပြောင်းပေးပါတယ်။ Non-negative 62-bit unsigned varint (`0n <= errorCode <= 2n ** 62n - 1n`) တစ်ခု ဖြစ်ရပါမယ်။
  * `code` {string} `error.code` ဆီကို သတ်မှတ်ပေးမယ့် Node.js-style error code string ပါ။ Default ကတော့ `'ERR_QUIC_STREAM_ABORTED'` ပါ။
  * `type` {string} `'application'` (default) သို့မဟုတ် `'transport'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ Code ကို ညှိနှိုင်းပြီးသား application protocol (ဥပမာ — HTTP/3 အတွက် RFC 9114) က သတ်မှတ်တာလား သို့မဟုတ် QUIC transport layer (RFC 9000) က သတ်မှတ်တာလားဆိုတာကို ညွှန်ပြပါတယ်။ Stream resets တွေက application codes တွေကို အမြဲတမ်း သယ်ဆောင်တာမို့ — default က `'application'` ဖြစ်ပါတယ်။

```mjs
import { QuicError } from 'node:quic';

const err = new QuicError('rejecting stream', { errorCode: 0x10cn });
console.log(err.code);       // 'ERR_QUIC_STREAM_ABORTED'
console.log(err.errorCode);  // 268n
console.log(err.type);       // 'application'

const custom = new QuicError('custom failure', {
  errorCode: 0x10cn,
  code: 'ERR_MY_QUIC_FAILURE',
});
console.log(custom.code);    // 'ERR_MY_QUIC_FAILURE'
```

### `error.errorCode`

* Type: {bigint}

ဒီ error က သယ်ဆောင်ပေးတဲ့ numeric QUIC error code ပါ။

### `error.type`

* Type: {string}

`'application'` (သို့) `'transport'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။ [`error.errorCode`][] ရဲ့ namespace (နာမည်ပြင် အုပ်စု) ကို ညွှန်ပြပါတယ်။

## Class: `QuicStream`

### `stream.closed`

* Type: {Promise}

Stream က အပြည့်အဝ ပိတ်သွားတဲ့အခါ fulfill ဖြစ်တဲ့ promise တစ်ခုပါ။ Stream က သန့်ရှင်းစွာ ပိတ်သွားတဲ့အခါ (idle timeout အပါအဝင်) resolve လုပ်ပါတယ်။ QUIC error တစ်ခုကြောင့် stream ကို ပိတ်လိုက်ရတဲ့အခါ (ဥပမာ — peer က stream ကို reset လုပ်တာ၊ error code သုည မဟုတ်တဲ့ CONNECTION\_CLOSE) — `ERR_QUIC_APPLICATION_ERROR` သို့မဟုတ် `ERR_QUIC_TRANSPORT_ERROR` တစ်ခုနဲ့ reject လုပ်ပါတယ်။

### `stream.destroy([error[, options]])`

* `error` {any}
* `options` {Object}
  * `code` {bigint|number} Peer ဆီကို ပို့လွှတ်တဲ့ `RESET_STREAM` နဲ့ `STOP_SENDING` frames တွေထဲမှာ ထည့်သွင်းရမယ့် application error code ပါ။ Numbers တွေကို `BigInt` အဖြစ် ပြောင်းပေးပါတယ်။ ချန်လှပ်ထားရင်တော့ wire code ကို `error` ကနေ ဆင်းသက်စေပါတယ် (အောက်မှာ ကြည့်ပါ)။
  * `reason` {string} Optional ဖြစ်တဲ့ လူဖတ်လို့ရတဲ့ reason string တစ်ခုပါ။ [`session.close()`][] နဲ့ [`session.destroy()`][] တို့နဲ့ အချိုးညီမှု (symmetry) အတွက် လက်ခံထားပေမယ့် — **wire ပေါ်မှာ ပို့လွှတ်ခြင်း မရှိပါဘူး** — `RESET_STREAM` ရော `STOP_SENDING` ပါ reason field တစ်ခုကို သယ်ဆောင်မှာ မဟုတ်ပါဘူး။ Application logging အတွက်နဲ့ [`stream.onerror`][] callback ထဲမှာ သုံးဖို့အတွက် ပေးအပ်ထားတာပါ။

Stream ကို ချက်ချင်း ရုတ်တရက် destroy လုပ်ပါတယ်။ `error` တစ်ခု ပေးထားပြီး [`stream.onerror`][] ကို သတ်မှတ်ထားရင် — destroy မလုပ်ခင် `onerror` callback ကို ခေါ်ယူပါတယ်။ `stream.closed` promise က error နဲ့ reject လုပ်ပါတယ်။

Stream ကို `error` တစ်ခုနဲ့ (သို့မဟုတ် — ရှင်းလင်းတဲ့ `options.code` တစ်ခုနဲ့) destroy လုပ်တဲ့အခါ — QUIC stack က abort အချက်ပြမှုကို peer ဆီကို ပို့ပေးပါတယ်:

* Writable side က ဖွင့်ထားဆဲ ဖြစ်နေရင် `RESET_STREAM` frame တစ်ခုကို ပို့ပေးပါတယ်။
* Readable side က ဖွင့်ထားဆဲ ဖြစ်နေရင် (bidirectional stream တစ်ခု သို့မဟုတ် remote ဘက်က စတင်တဲ့ unidirectional stream တစ်ခု) — `STOP_SENDING` frame တစ်ခုကို ပို့ပေးပါတယ်။

Frame နှစ်ခုလုံးက — အောက်ပါ အစီအစဉ် (precedence) နဲ့ ဖြေရှင်းထားတဲ့ — wire code တစ်ခုတည်းကို သယ်ဆောင်ပါတယ်:

1. `options.code` — ရှင်းလင်းစွာ ပေးထားတဲ့အခါ။
2. [`error.errorCode`][] — `error` က [`QuicError`][] တစ်ခု ဖြစ်နေတဲ့အခါ။
3. ညှိနှိုင်းပြီးသား application protocol ရဲ့ "internal error" code (HTTP/3 အတွက် `H3_INTERNAL_ERROR` (`0x102`) သို့မဟုတ် raw QUIC အတွက် QUIC transport-layer `INTERNAL_ERROR` (`0x1`))။

သန့်ရှင်းတဲ့ destroy ပြုလုပ်မှု — `error` မရှိ၊ `options.code` လည်း မရှိတဲ့ — က `RESET_STREAM` သို့မဟုတ် `STOP_SENDING` ကို emit လုပ်မှာ မဟုတ်ပါဘူး။ Stream ရဲ့ ရှိပြီးသား close လုပ်တဲ့ ယန္တရားတွေက teardown (ဖြိုဖျက်မှု) ကို ကိုင်တွယ်ပါတယ်။

ရနိုင်တဲ့ stream-abort APIs တွေရဲ့ ခြုံငုံ သုံးသပ်ချက်အတွက် [Aborting a stream][] ကို ကြည့်ပါ။

### `stream.destroyed`

* Type: {boolean}

`stream.destroy()` ကို ခေါ်ခဲ့ဖူးရင် true ဖြစ်ပါတယ်။

### Stream တစ်ခုကို abort လုပ်ခြင်း (Aborting a stream)

QuicStream တစ်ခုကို နည်းလမ်းမျိုးစုံနဲ့ abort လုပ်နိုင်ပြီး — တစ်နည်းချင်းစီက မတူညီတဲ့ wire-frame ဘေးထွက် သက်ရောက်မှုတွေကို ဖြစ်ပေါ်စေပါတယ်:

* [`stream.stopSending()`][] — Readable side တစ်ခုတည်းကိုသာ abort လုပ်ပါတယ်။ Peer ဆီကို `STOP_SENDING` ပို့ပေးပါတယ်။ Writable side ကိုတော့ အကျိုးသက်ရောက်မှု မရှိပါဘူး။
* [`stream.resetStream()`][] — Writable side တစ်ခုတည်းကိုသာ abort လုပ်ပါတယ်။ Peer ဆီကို `RESET_STREAM` ပို့ပေးပါတယ်။ [`writer.fail(reason)`][] နဲ့ မတူပဲ — wire code ကို error တစ်ခုကနေ ဆင်းသက်စေမယ့်အစား တိုက်ရိုက် ပေးအပ်ပါတယ်။
* [`writer.fail(reason)`][] — Writable side တစ်ခုတည်းကိုသာ abort လုပ်ပါတယ်။ Peer ဆီကို `RESET_STREAM` ပို့ပေးပါတယ်။ Readable side ကို အကျိုးသက်ရောက်မှု မရှိပါဘူး။ ဖတ်ဖို့ buffer လုပ်ထားပြီးသား data မှန်သမျှ ရနိုင်ဆဲ ဖြစ်ပါတယ်။
* `error` argument တစ်ခုနဲ့ [`stream.destroy()`][] — Stream ကို လုံးဝ ဖြိုဖျက်ပါတယ်။ ဖွင့်ထားဆဲ ရှိနေတဲ့ writable side ပေါ်မှာ `RESET_STREAM` ကို ရော — ဖွင့်ထားဆဲ ရှိနေတဲ့ readable side ပေါ်မှာ `STOP_SENDING` ကိုပါ ပို့ပေးပါတယ်။ Wire code ကို `error` ကနေ ဆင်းသက်စေပါတယ် (precedence စည်းမျဉ်းတွေအတွက် [`stream.destroy()`][] ကို ကြည့်ပါ)။
* ရှင်းလင်းတဲ့ `options.code` တစ်ခုနဲ့ [`stream.destroy()`][] — အပေါ်က ပုံစံနဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — caller က ပေးလိုက်တဲ့ wire code ကို သုံးပါတယ်။ ဒီ code က `error` က သယ်ဆောင်လာတဲ့ code ဘယ်ဟာကိုမဆို ကျော်လွန် (precedence) ယူပါတယ်။

`error` က [`QuicError`][] တစ်ခု ဖြစ်နေရင် — ၎င်းရဲ့ [`error.errorCode`][] ကို `writer.fail()` ရော `stream.destroy()` အတွက်ပါ wire code အဖြစ် သုံးပါတယ်။ မဟုတ်ရင်တော့ — implementation က ညှိနှိုင်းပြီးသား application protocol ရဲ့ "internal error" code ကို နောက်ဆုတ် အသုံးပြုပါတယ် ([`QuicError`][] ကို ကြည့်ပါ)။

[`stream.stopSending()`][] နဲ့ [`stream.resetStream()`][] တို့ကတော့ ဒီလို ဆင်းသက်စေတာ မလုပ်ပါဘူး — သူတို့က `code` ကို ပေးထားတဲ့အတိုင်း ပို့လွှတ်ပါတယ်။

### `stream.resetStream([code])`

* `code` {number|bigint} Peer ဆီကို ပို့လွှတ်ရမယ့် application error code ပါ။ **Default:** `0n`။

ဒီဘက်က ဒီ stream ပေါ်မှာ data တွေ နောက်ထပ် မပို့တော့ဘူးဆိုတာကို peer ကို အသိပေးပြီး — `code` ကို သယ်ဆောင်တဲ့ `RESET_STREAM` frame တစ်ခုကို ပို့ပေးပါတယ်။ Readable side ကို ဖွင့်ထားဆဲ ဖြစ်လို့ — peer က အရင်က ပို့ထားပြီးသား data တွေကို ဆက်ပြီး ဖတ်လို့ ရနေပါသေးတယ်။

ပို့လွှတ်ဖို့ queue ထဲမှာ ကျန်ရှိနေတဲ့ data မှန်သမျှကို စွန့်ပစ်ပါတယ်။ Reset လုပ်လိုက်တဲ့ stream တစ်ခုကို peer က ဘယ်တော့မှ acknowledge (လက်ခံရရှိကြောင်း အသိအမှတ်ပြု) လုပ်မှာ မဟုတ်တာမို့ — outbound queue က နောက်ထပ် drain ဖြစ်တော့မှာ မဟုတ်ပါဘူး။

ဒီလုပ်ဆောင်ချက်အတွက် acknowledgement ဘာမှ ပေးအပ်မှာ မဟုတ်ပါဘူး။ Stream ကို destroy လုပ်ပြီးသား ဖြစ်နေရင်၊ reset လုပ်ပြီးသား ဖြစ်နေရင် သို့မဟုတ် — abort လုပ်ဖို့ writable side မရှိတဲ့ — remote ဘက်က စတင်တဲ့ unidirectional stream တစ်ခု ဖြစ်နေရင်တော့ ဒီ call က ဘာမှ မလုပ်ပါဘူး။

### `stream.stopSending([code])`

* `code` {number|bigint} Peer ဆီကို ပို့လွှတ်ရမယ့် application error code ပါ။ **Default:** `0n`။

ဒီ stream ပေါ်မှာ data တွေ ပို့လွှတ်တာ ရပ်တန့်ဖို့ peer ကို တောင်းဆိုပြီး — `code` ကို သယ်ဆောင်တဲ့ `STOP_SENDING` frame တစ်ခုကို ပို့ပေးပါတယ်။ Writable side ကို ဖွင့်ထားဆဲ ဖြစ်လို့ — ဒီဘက်က data တွေ ဆက်ပြီး ပို့လို့ ရနေပါသေးတယ်။

ဒီလုပ်ဆောင်ချက်အတွက် acknowledgement ဘာမှ ပေးအပ်မှာ မဟုတ်ပါဘူး။ Stream ကို destroy လုပ်ပြီးသား ဖြစ်နေရင် သို့မဟုတ် — abort လုပ်ဖို့ readable side မရှိတဲ့ — ဒေသခံဘက်က စတင်တဲ့ (locally-initiated) unidirectional stream တစ်ခု ဖြစ်နေရင်တော့ ဒီ call က ဘာမှ မလုပ်ပါဘူး။

### `stream.early`

* Type: {boolean}

TLS handshake မပြီးဆုံးခင် ဒီ stream ပေါ်က data တစ်စုံတစ်ရာကို 0-RTT (early data — စောစီးစွာ ပေးပို့သည့် ဒေတာ) အနေနဲ့ လက်ခံရရှိခဲ့တယ်ဆိုရင် true ဖြစ်ပါတယ်။ Early data က လုံခြုံမှု အားနည်းပြီး — တိုက်ခိုက်သူ (attacker) တစ်ဦးက ပြန်လည် ထပ်ဆင့် သုံးစွဲနိုင် (replay) ဖို့ အလားအလာ ရှိပါတယ်။ Applications တွေက early data ကို သင့်လျော်တဲ့ သတိထားမှုနဲ့ ကိုင်တွယ်သင့်ပါတယ်။

ဒီ property က server ဘက်မှာသာ အဓိပ္ပာယ် ရှိပါတယ်။ Client ဘက်မှာတော့ အမြဲတမ်း `false` ဖြစ်ပါတယ်။

### `stream.direction`

* Type: {string|null} `'bidi'`, `'uni'` (သို့) `null` တို့အနက် တစ်ခု ဖြစ်ပါတယ်။

Stream ရဲ့ directionality (ဦးတည်ချက်) ပါ။ Stream ကို destroy လုပ်ထားပြီးသား ဖြစ်နေရင် သို့မဟုတ် ဆိုင်းငံ့ (pending) ဖြစ်နေသေးရင် `null` ဖြစ်ပါတယ်။ Read only ဖြစ်ပါတယ်။

### `stream.budget`

* Type: {number}

`writeSync()` က `false` ပြန်ပေးတဲ့အထိ writer က buffer လုပ်ထားမယ့် bytes အရေအတွက် အများဆုံးပါ။ Buffer လုပ်ထားတဲ့ data က ဒီကန့်သတ်ချက်ကို ကျော်လွန်သွားတဲ့အခါ — caller က data တွေ ထပ်မရေးသားခင် drain ဖြစ်တာကို စောင့်ဆိုင်းသင့်ပါတယ်။

ဒီတန်ဖိုးကို ဘယ်အချိန်မဆို dynamically ပြောင်းလဲလို့ရပါတယ်။ Default (65536) ကို application ရဲ့ လိုအပ်ချက်တွေပေါ်မူတည်ပြီး ချိန်ညှိဖို့ လိုအပ်နိုင်တဲ့ — `onstream` callback ကနေတစ်ဆင့် လက်ခံရရှိတဲ့ streams တွေအတွက် ဒါက အထူး အသုံးဝင်ပါတယ်။ တရားဝင်တဲ့ range ကတော့ `0` ကနေ `4294967295` အထိပါ။

### `stream.id`

* Type: {bigint|null}

Stream ID ပါ။ Stream ကို destroy လုပ်ထားပြီးသား ဖြစ်နေရင် သို့မဟုတ် ဆိုင်းငံ့ ဖြစ်နေသေးရင် `null` ဖြစ်ပါတယ်။ Read only ဖြစ်ပါတယ်။

### `stream.onerror`

* Type: {Function|undefined}

Stream ကို error တစ်ခုနဲ့ destroy လုပ်တဲ့အခါ ခေါ်ယူခံရတဲ့ optional callback တစ်ခုပါ။ Throw လုပ်တဲ့ သို့မဟုတ် reject လုပ်တဲ့ user callbacks တွေကြောင့် ဖြစ်ပေါ်လာတဲ့ errors တွေလည်း ပါဝင်ပါတယ် ([Callback error handling][] ကို ကြည့်ပါ)။ Callback က argument တစ်ခုတည်းကို လက်ခံရရှိပါတယ်: destruction ကို trigger လုပ်လိုက်တဲ့ error ပါ။ `onerror` callback ကိုယ်တိုင် throw လုပ်မိရင် သို့မဟုတ် reject လုပ်တဲ့ promise တစ်ခုကို ပြန်ပေးမိရင် — error ကို uncaught exception (ဖမ်းမမိတဲ့ exception) တစ်ခုအနေနဲ့ ပေါ်ထွက်စေပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.onblocked`

* Type: {quic.OnBlockedCallback}

Stream block ဖြစ်သွားတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Read/write ဖြစ်ပါတယ်။

### `stream.onreset`

* Type: {quic.OnStreamErrorCallback}

Peer က `RESET_STREAM` frame တစ်ခု ပို့ပြီး stream ရဲ့ direction တစ်ခုကို abort လုပ်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ (peer က ၎င်းတို့ရဲ့ writable side ကို စွန့်လွှတ်လိုက်တာမို့ — ကျွန်ုပ်တို့ရဲ့ readable side ပေါ်ကို data တွေ နောက်ထပ် ရောက်ရှိလာမှာ မဟုတ်ပါဘူး)။

Callback က — `errorCode` (`bigint`) property မှာ wire frame ကနေ ရတဲ့ application error code ကို သယ်ဆောင်ပေးတဲ့ — Node.js error တစ်ခုကို လက်ခံရရှိပါတယ်။

ဒီ callback ပွင့်လာတဲ့အခါ stream ကို အလိုအလျောက် destroy လုပ်_တာ မဟုတ်ပါဘူး_ — ဘယ်လို တုံ့ပြန်ရမလဲဆိုတာကို application က ရွေးချယ်ပါတယ်။ သာမန် ပုံစံတွေကတော့: လျစ်လျူရှုခြင်း (ပြီးတော့ bidirectional stream တစ်ခုပေါ်က ဆက်လက် တက်ကြွနေတဲ့ direction ကို ဆက်သုံးခြင်း)၊ [`writer.fail()`][] နဲ့ တခြား direction ကို abort လုပ်ခြင်း သို့မဟုတ် [`stream.destroy()`][] နဲ့ stream တစ်ခုလုံးကို ဖြိုဖျက်ခြင်း တို့ပါ။ Read/write ဖြစ်ပါတယ်။

### `stream.onstopsending`

* Type: {quic.OnStreamErrorCallback}

Peer က `STOP_SENDING` frame တစ်ခု ပို့ပြီး stream ရဲ့ direction တစ်ခုကို abort လုပ်တဲ့အခါ ခေါ်ယူရမယ့် callback ပါ (peer က ကျွန်ုပ်တို့ရဲ့ writable side ပေါ်မှာ ရေးသားတာ ရပ်တန့်ဖို့ တောင်းဆိုပါတယ်)။

Callback က — `errorCode` (`bigint`) property မှာ wire frame ကနေ ရတဲ့ application error code ကို သယ်ဆောင်ပေးတဲ့ — Node.js error တစ်ခုကို လက်ခံရရှိပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.headers`

* Type: {Object|undefined}

ဒီ stream ပေါ်မှာ လက်ခံရရှိထားတဲ့ buffer လုပ်ထားတဲ့ initial headers တွေပါ။ Application က headers တွေကို support မလုပ်ဘူးဆိုရင် သို့မဟုတ် headers တွေ ဘာမှ မရရှိရသေးဘူးဆိုရင်တော့ `undefined` ဖြစ်ပါတယ်။ Server-side streams တွေအတွက်ဆိုရင် ဒါက request headers တွေကို ပါဝင်ပါတယ် (ဥပမာ — `:method`, `:path`, `:scheme`)။ Client-side streams တွေအတွက်ကတော့ response headers တွေ ပါဝင်ပါတယ် (ဥပမာ — `:status`)။

Header နာမည်တွေက lowercase strings တွေပါ။ Multi-value headers တွေကို arrays တွေအနေနဲ့ ကိုယ်စားပြုပါတယ်။ Object က `__proto__: null` ရှိပါတယ်။

### `stream.onheaders`

* Type: {Function}

Stream ပေါ်မှာ initial headers တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Callback က `(headers)` ကို လက်ခံရရှိပြီး — `headers` က object တစ်ခု ဖြစ်ပါတယ် (`stream.headers` နဲ့ ပုံစံ တူညီပါတယ်)။ HTTP/3 အတွက်ဆိုရင် — server ဘက်မှာ request pseudo-headers တွေကို ပို့ပေးပြီး client ဘက်မှာ response headers တွေကို ပို့ပေးပါတယ်။ Headers တွေကို support မလုပ်တဲ့ session တစ်ခုပေါ်မှာ သတ်မှတ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.ontrailers`

* Type: {Function}

Peer ဆီကနေ trailing headers (နောက်ဆုံး ပို့သော headers) တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Callback က `(trailers)` ကို လက်ခံရရှိပြီး — `trailers` က `stream.headers` နဲ့ ပုံစံ တူညီတဲ့ object တစ်ခု ဖြစ်ပါတယ်။ Headers တွေကို support မလုပ်တဲ့ session တစ်ခုပေါ်မှာ သတ်မှတ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.oninfo`

* Type: {Function}

Server ဆီကနေ informational (1xx) headers တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ Callback က `(headers)` ကို လက်ခံရရှိပြီး — `headers` က `stream.headers` နဲ့ ပုံစံ တူညီတဲ့ object တစ်ခု ဖြစ်ပါတယ်။ Informational headers တွေကို နောက်ဆုံး response မပို့ခင် ပို့ပေးပါတယ် (ဥပမာ — 103 Early Hints)။ Headers တွေကို support မလုပ်တဲ့ session တစ်ခုပေါ်မှာ သတ်မှတ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.onwanttrailers`

* Type: {Function}

Trailing headers တွေကို ပို့ဖို့ application အသင့် ဖြစ်နေတဲ့အခါ ခေါ်ယူရမယ့် callback ပါ။ ဒါကို synchronously ခေါ်ပါတယ် — user က ဒီ callback အတွင်းမှာ [`stream.sendTrailers()`][] ကို ခေါ်ပေးရပါမယ်။ Headers တွေကို support မလုပ်တဲ့ session တစ်ခုပေါ်မှာ သတ်မှတ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.pendingTrailers`

* Type: {Object|undefined}

Application က တောင်းဆိုတဲ့အခါ အလိုအလျောက် ပို့ဖို့ trailing headers တွေကို သတ်မှတ်ပေးပါတယ်။ ဒါက — body မပြီးဆုံးခင် trailers တွေကို ကြိုသိပြီးသား ဖြစ်နေတဲ့ အခြေအနေတွေအတွက် — [`stream.onwanttrailers`][] callback ရဲ့ အစားထိုး (alternative) တစ်ခုပါ။ Headers တွေကို support မလုပ်တဲ့ session တစ်ခုပေါ်မှာ သတ်မှတ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Read/write ဖြစ်ပါတယ်။

### `stream.sendHeaders(headers[, options])`

* `headers` {Object} String keys တွေနဲ့ string သို့မဟုတ် string-array values တွေ ပါတဲ့ header object ပါ။ Pseudo-headers တွေ (`:method`, `:path`, စသည်) က သာမန် headers တွေရဲ့ ရှေ့မှာ ပေါ်နေရပါမယ်။
* `options` {Object}
  * `terminal` {boolean} `true` ဆိုရင် — headers တွေပြီးနောက်မှာ stream ကို ပို့ဆောင်မှုအတွက် ပိတ်ပါတယ် (body တစ်ခု နောက်ကနေ လိုက်မှာ မဟုတ်ပါဘူး)။ **Default:** `false`။
* Returns: {boolean}

Stream ပေါ်မှာ initial သို့မဟုတ် response headers တွေကို ပို့ပေးပါတယ်။ Client-side streams တွေအတွက်ဆိုရင် request headers တွေကို ပို့ပေးပြီး — server-side streams တွေအတွက်ကတော့ response headers တွေကို ပို့ပေးပါတယ်။ Session က headers တွေကို support မလုပ်ဘူးဆိုရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။

### `stream.sendInformationalHeaders(headers)`

* `headers` {Object} Header object ပါ။ 1xx တန်ဖိုးတစ်ခုနဲ့ `:status` ကို မဖြစ်မနေ ပါဝင်ရပါမယ် (ဥပမာ — `{ ':status': '103', 'link': '; rel=preload' }`)။
* Returns: {boolean}

Informational (1xx) response headers တွေကို ပို့ပေးပါတယ်။ Server အတွက်သာ ဖြစ်ပါတယ်။ Session က headers တွေကို support မလုပ်ဘူးဆိုရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။

### `stream.sendTrailers(headers)`

* `headers` {Object} Trailing header object ပါ။ Pseudo-headers တွေကို trailers တွေထဲမှာ ထည့်သွင်းလို့ မရပါဘူး။
* Returns: {boolean}

Stream ပေါ်မှာ trailing headers တွေကို ပို့ပေးပါတယ်။ [`stream.onwanttrailers`][] callback အတွင်းမှာ synchronously ခေါ်ပေးရပါမယ် — သို့မဟုတ် [`stream.pendingTrailers`][] ကနေတစ်ဆင့် ကြိုတင် သတ်မှတ်ထားနိုင်ပါတယ်။ Session က headers တွေကို support မလုပ်ဘူးဆိုရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။

### `stream.priority`

* Type: {Object|null}
  * `level` {string} `'high'`, `'default'` (သို့) `'low'` တို့အနက် တစ်ခု ဖြစ်ပါတယ်။
  * `incremental` {boolean} Stream data ကို — priority level တူညီတဲ့ တခြား streams တွေနဲ့ — ရောပြွမ်း (interleave) လုပ်သင့် မလုပ်သင့်ဆိုတာပါ။

Stream ရဲ့ လက်ရှိ priority ပါ။ Session က priority ကို support မလုပ်ဘူးဆိုရင် (ဥပမာ — HTTP/3 မဟုတ်တဲ့ session) သို့မဟုတ် stream ကို destroy လုပ်ထားပြီးသားဆိုရင် `null` ကို ပြန်ပေးပါတယ်။ Read only ဖြစ်ပါတယ်။ Priority ကို ပြောင်းလဲဖို့ [`stream.setPriority()`][] ကို သုံးပါ။

Client-side HTTP/3 sessions တွေမှာတော့ — တန်ဖိုးက [`stream.setPriority()`][] ကနေတစ်ဆင့် သတ်မှတ်လိုက်တာကို ထင်ဟပ်ပါတယ်။ Server-side HTTP/3 sessions တွေမှာတော့ — တန်ဖိုးက peer ရဲ့ တောင်းဆိုထားတဲ့ priority ကို ထင်ဟပ်ပါတယ် (ဥပမာ — `PRIORITY_UPDATE` frames တွေကနေ)။

### `stream.setPriority([options])`

* `options` {Object}
  * `level` {string} Priority level ပါ။ `'high'`, `'default'` (သို့) `'low'` တို့အနက် တစ်ခု ဖြစ်ပါတယ်။ **Default:** `'default'`။
  * `incremental` {boolean} `true` ဆိုရင် — ဒီ stream ကနေ data တွေကို — priority level တူညီတဲ့ တခြား streams တွေရဲ့ data တွေနဲ့ — ရောပြွမ်းလို့ ရပါတယ်။ **Default:** `false`။

Stream ရဲ့ priority ကို သတ်မှတ်ပေးပါတယ်။ Session က priority ကို support မလုပ်ဘူးဆိုရင် (ဥပမာ — HTTP/3 မဟုတ်တဲ့ session) `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Stream ကို destroy လုပ်ပြီးသား ဖြစ်နေရင်တော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

### `stream[Symbol.asyncIterator]()`

* Returns: {AsyncIterableIterator} {Uint8Array\[]} တွေကို yield လုပ်ပေးပါတယ်။

Stream က `Symbol.asyncIterator` ကို implement လုပ်ထားတာမို့ — `for await...of` loops တွေမှာ တိုက်ရိုက် သုံးစွဲလို့ ရပါတယ်။ Iteration တစ်ခုချင်းစီက `Uint8Array` chunks တွေရဲ့ batch တစ်ခုကို yield လုပ်ပေးပါတယ်။

Stream တစ်ခုအတွက် async iterator တစ်ခုတည်းကိုသာ ရယူနိုင်ပါတယ်။ ဒုတိယအကြိမ် ခေါ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။ Readable မဟုတ်တဲ့ streams တွေ (outbound-only unidirectional သို့မဟုတ် ပိတ်ထားတဲ့ streams) ကတော့ ချက်ချင်း ပြီးဆုံးသွားတဲ့ iterator တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
for await (const chunks of stream) {
  for (const chunk of chunks) {
    // Process each Uint8Array chunk
  }
}
```

stream/iter utilities တွေနဲ့ လိုက်ဖက်ညီပါတယ်:

```mjs
import Stream from 'node:stream/iter';
const body = await Stream.bytes(stream);
const text = await Stream.text(stream);
await Stream.pipeTo(stream, someWriter);
```

### `stream.writer`

* Type: {Object}

Stream ဆီကို data တွေကို တဖြည်းဖြည်းချင်း (incrementally) တွန်းပို့ဖို့အတွက် Writer object တစ်ခုကို ပြန်ပေးပါတယ်။ Writer က try-sync-fallback-to-async (အရင် sync ကြိုးစားပြီး async ဆီကို နောက်ဆုတ်တဲ့) ပုံစံနဲ့ stream/iter Writer interface ကို implement လုပ်ပါတယ်။

ဖန်တီးချိန်မှာ သို့မဟုတ် [`stream.setBody()`][] ကနေတစ်ဆင့် `body` source တစ်ခု ပေးအပ်ထားခြင်း မရှိဘူးဆိုမှသာ ရနိုင်ပါတယ်။ Writable မဟုတ်တဲ့ streams တွေက ပိတ်ပြီးသား (already-closed) Writer တစ်ခုကို ပြန်ပေးပါတယ်။ Outbound ကို configure လုပ်ပြီးသား ဖြစ်နေရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။

Writer မှာ အောက်ပါ methods တွေ ရှိပါတယ်:

* `writeSync(chunk)` — Synchronous write ပါ။ လက်ခံခဲ့ရင် `true` ကို ပြန်ပေးပြီး — flow-controlled ဖြစ်နေရင် `false` ကို ပြန်ပေးပါတယ်။ `false` ဖြစ်တဲ့အခါ data ကို လက်ခံမှာ မဟုတ်ပါဘူး။
* `write(chunk[, options])` — Drain စောင့်ဆိုင်းမှုပါတဲ့ async write ပါ။ `options.signal` ကို entry မှာ စစ်ဆေးပြီး — write လုပ်နေစဉ်အတွင်းမှာတော့ စောင့်ကြည့် (observe) မလုပ်ပါဘူး။
* `writevSync(chunks)` — Synchronous vectored write ပါ။ အားလုံး သို့မဟုတ် ဘာမှ မဟုတ်ဘူး (all-or-nothing) ဖြစ်ပါတယ်။
* `writev(chunks[, options])` — Async vectored write ပါ။
* `endSync()` — Synchronous close ပါ။ စုစုပေါင်း bytes သို့မဟုတ် `-1` ကို ပြန်ပေးပါတယ်။
* `end([options])` — Async close ပါ။
* `fail(reason)` — Stream ကို error ဖြစ်စေပါတယ် (peer ဆီကို `RESET_STREAM` ပို့ပေးပါတယ်)။ `reason` က [`QuicError`][] တစ်ခု ဖြစ်နေရင် — ၎င်းရဲ့ [`error.errorCode`][] ကို ရလာတဲ့ `RESET_STREAM` frame ပေါ်က wire code အဖြစ် သုံးပါတယ်။ မဟုတ်ရင်တော့ wire code က ညှိနှိုင်းပြီးသား application protocol ရဲ့ "internal error" code ကို နောက်ဆုတ် သုံးပါတယ် (HTTP/3 အတွက် `H3_INTERNAL_ERROR` (`0x102`) သို့မဟုတ် raw QUIC အတွက် QUIC transport-layer `INTERNAL_ERROR` (`0x1`))။ `STOP_SENDING` ကနေတစ်ဆင့် readable side ကိုပါ reset လုပ်ပေးတဲ့ full-stream abort အတွက် [`stream.destroy()`][] ကို ကြည့်ပါ။
* `canWrite` — Writes တွေကို လက်ခံမယ်ဆိုရင် `true`၊ capacity ပြည့်နေရင် `false` သို့မဟုတ် ပိတ်ပြီး/error ဖြစ်နေရင် `null` ဖြစ်ပါတယ်။

`writeSync()` / `writevSync()` / `write()` / `writev()` input chunk တစ်ခုချင်းစီကနေ bytes တွေကို internal buffer တစ်ခုထဲကို ကူးယူပါတယ်။ ဒါကြောင့် caller ရဲ့ source buffer က မပြောင်းလဲဘဲ ကျန်ရှိနေပြီး — call ပြန်လာပြီးတာနဲ့ ချက်ချင်း ပြန်သုံးလို့ သို့မဟုတ် ပြုပြင်ပြောင်းလဲလို့ ရပါတယ်။ Source buffer တစ်ခုကို လွှဲပြောင်းပေးပြီးနောက်မှာ ပြုပြင်ပြောင်းလဲလို့ မရအောင် သေချာစေချင်တဲ့ callers တွေက — buffer ကို မဖြတ်သန်းပေးခင် — `ArrayBuffer.prototype.transfer()` ကို ကိုယ်တိုင် ခေါ်နိုင်ပါတယ်။

### `stream.setBody(body)`

* `body` {string | ArrayBuffer | SharedArrayBuffer | ArrayBufferView |
  Blob | FileHandle | AsyncIterable | Iterable | Promise | null}

Stream အတွက် outbound body source ကို သတ်မှတ်ပေးပါတယ်။ တစ်ကြိမ်တည်းသာ ခေါ်လို့ရပါတယ်။ [`stream.writer`][] နဲ့ အပြန်အလှန် သီးသန့် (mutually exclusive) ဖြစ်ပါတယ်။

အောက်ပါ body source types တွေကို support လုပ်ပါတယ်:

* `null` — Writable side ကို ချက်ချင်း ပိတ်ပါတယ် (data မပါပဲ FIN ပို့ပေးပါတယ်)။
* `string` — UTF-8 encode လုပ်ပြီး chunk တစ်ခုတည်းအနေနဲ့ ပို့ပေးပါတယ်။
* `ArrayBuffer`, `SharedArrayBuffer`, `ArrayBufferView` — Chunk တစ်ခုတည်းအနေနဲ့ ပို့ပေးပါတယ်။ Bytes တွေကို internal buffer တစ်ခုထဲကို ကူးယူပါတယ်။ ဒါကြောင့် caller ရဲ့ source buffer က မပြောင်းလဲဘဲ ကျန်ရှိနေပြီး — call ပြန်လာပြီးတာနဲ့ ချက်ချင်း ပြန်သုံးလို့ သို့မဟုတ် ပြုပြင်ပြောင်းလဲလို့ ရပါတယ်။ လွှဲပြောင်းပေးပြီးနောက်မှာ ကိုယ့်ရဲ့ source ကို ပြုပြင်ပြောင်းလဲလို့ မရအောင် သေချာစေချင်တဲ့ callers တွေက — buffer ကို မဖြတ်သန်းပေးခင် — `ArrayBuffer.prototype.transfer()` ကို ကိုယ်တိုင် ခေါ်နိုင်ပါတယ်။
* `Blob` — Blob ရဲ့ underlying data queue ကနေ ပို့ပေးပါတယ်။
* {FileHandle} — File ရဲ့ contents တွေကို fd-backed data source တစ်ခုကနေတစ်ဆင့် asynchronously ဖတ်ပါတယ်။ `FileHandle` ကို ဖတ်ရှုရန်အတွက် ဖွင့်ထားရပါမယ် (ဥပမာ — [`fs.promises.open(path, 'r')`][] ကနေတစ်ဆင့်)။ Body အဖြစ် ဖြတ်သန်းလိုက်တာနဲ့ — `FileHandle` က lock ဖြစ်သွားပြီး — တခြား stream တစ်ခုအတွက် body အဖြစ် သုံးလို့ မရတော့ပါဘူး။ Stream ပြီးဆုံးသွားတဲ့အခါ `FileHandle` ကို အလိုအလျောက် ပိတ်ပေးပါတယ်။
* `AsyncIterable`, `Iterable` — Yield လုပ်လိုက်တဲ့ chunk တစ်ခုချင်းစီ (string သို့မဟုတ် `Uint8Array`) ကို streaming mode မှာ တဖြည်းဖြည်းချင်း ရေးသားပါတယ်။
* `Promise` — await လုပ်ပြီး — resolve ဖြစ်လာတဲ့ တန်ဖိုးကို body အဖြစ် သုံးပါတယ် (type စည်းမျဉ်းတွေကိုပဲ လိုက်နာပါတယ်)။

Outbound ကို configure လုပ်ပြီးသား ဖြစ်နေရင် သို့မဟုတ် writer ကို ဝင်ရောက် (access) လုပ်ပြီးသား ဖြစ်နေရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ်။

### `stream.session`

* Type: {quic.QuicSession|null}

ဒီ stream ကို ဖန်တီးပေးခဲ့တဲ့ session ပါ။ Stream ကို destroy လုပ်ထားပြီးသားဆိုရင်တော့ `null` ဖြစ်ပါတယ်။ Read only ဖြစ်ပါတယ်။

### `stream.stats`

* Type: {quic.QuicStream.Stats}

Stream အတွက် လက်ရှိ statistics တွေပါ။ Read only ဖြစ်ပါတယ်။

## Class: `QuicStream.Stats`

### `streamStats.ackedAt`

* Type: {bigint}

### `streamStats.bytesAccumulated`

* Type: {bigint}

Application ဆီကို ပို့ဆောင်ပေးဖို့ စောင့်ဆိုင်းနေတဲ့ — stream ရဲ့ receive accumulation buffer ထဲမှာ ရှိနေတဲ့ — bytes အရေအတွက် လက်ရှိပါ။ သုညနီးပါး တန်ဖိုးတစ်ခုက reader က ဝင်လာတဲ့ data တွေနဲ့ အမီလိုက်နေတယ်လို့ ဖော်ပြပါတယ်။ Stream ရဲ့ flow control window နီးပါး တန်ဖိုးတစ်ခုကတော့ — application က data တွေကို လုံလောက်တဲ့ မြန်နှုန်းနဲ့ စားသုံးမပေးဘူးလို့ ဖော်ပြပါတယ်။

### `streamStats.bytesReceived`

* Type: {bigint}

### `streamStats.bytesSent`

* Type: {bigint}

### `streamStats.createdAt`

* Type: {bigint}

### `streamStats.destroyedAt`

* Type: {bigint}

### `streamStats.finalSize`

* Type: {bigint}

### `streamStats.isConnected`

* Type: {bigint}

### `streamStats.maxBytesAccumulated`

* Type: {bigint}

Stream ရဲ့ သက်တမ်းတစ်လျှောက် ဘယ်အချိန်မဆို — stream ရဲ့ receive buffer ထဲမှာ စုပုံခဲ့ဖူးတဲ့ bytes အရေအတွက် အမြင့်ဆုံး (peak) ပါ။ ဒီတန်ဖိုးက monotonically (တစ်ဖက်သတ်) တိုးပွားသွားရုံသာ ရှိပါတယ်။ Stream တစ်ခုက backpressure episodes တွေကို ကြုံခဲ့ရလားဆိုတာနဲ့ — accumulation buffer ရဲ့ အရွယ်အစား သတ်မှတ်မှုက workload အတွက် သင့်လျော်မှု ရှိမရှိကို စစ်ဆေးဖို့ အသုံးဝင်ပါတယ်။

### `streamStats.maxOffset`

* Type: {bigint}

### `streamStats.maxOffsetAcknowledged`

* Type: {bigint}

### `streamStats.maxOffsetReceived`

* Type: {bigint}

### `streamStats.openedAt`

* Type: {bigint}

### `streamStats.receivedAt`

* Type: {bigint}

## အမျိုးအစားများ (Types)

### type: `ApplicationOptions`

* Type: {Object}

Application အတွက် သီးသန့် options တွေပါ။

#### `applicationOptions.maxHeaderPairs`

* Type: {bigint|number}

Header block တစ်ခုအတွက် လက်ခံနိုင်တဲ့ header name-value pairs အရေအတွက် အများဆုံးပါ။ ဒီကန့်သတ်ချက်ထက် ကျော်လွန်တဲ့ headers တွေကို တိတ်တဆိတ် ပစ်ချပါတယ်။ **Default:** `128`

#### `applicationOptions.maxHeaderLength`

* Type: {bigint|number}

Header block တစ်ခုအတွက် header နာမည်နဲ့ တန်ဖိုးအားလုံး ပေါင်းထားတဲ့ စုစုပေါင်း byte အရှည် အများဆုံးပါ။ စုစုပေါင်းကို ဒီကန့်သတ်ချက်ထက် ကျော်လွန်စေမယ့် headers တွေကို တိတ်တဆိတ် ပစ်ချပါတယ်။ **Default:** `8192`

#### `applicationOptions.maxFieldSectionSize`

* Type: {bigint|number}

Compressed header field section (QPACK) တစ်ခုရဲ့ အရွယ်အစား အများဆုံးပါ။ `0` ဆိုရင် အကန့်အသတ် မရှိဘူးလို့ ဆိုလိုပါတယ်။ **Default:** `0`

#### `applicationOptions.qpackMaxDTableCapacity`

* Type: {bigint|number}

QPACK dynamic table ရဲ့ capacity ကို bytes နဲ့ ဖော်ပြပါတယ်။ Dynamic table ကို disable လုပ်ဖို့ `0` အဖြစ် သတ်မှတ်ပါ။ **Default:** `4096`

#### `applicationOptions.qpackEncoderMaxDTableCapacity`

* Type: {bigint|number}

QPACK encoder ရဲ့ dynamic table capacity အများဆုံးပါ။ **Default:** `4096`

#### `applicationOptions.qpackBlockedStreams`

* Type: {bigint|number}

QPACK dynamic table updates တွေကို စောင့်ဆိုင်းရင်း block ဖြစ်နိုင်တဲ့ streams အရေအတွက် အများဆုံးပါ။ **Default:** `100`

#### `applicationOptions.enableConnectProtocol`

* Type: {boolean}

Extended CONNECT protocol (RFC 9220) ကို enable လုပ်ပါတယ်။ **Default:** `false`

#### `applicationOptions.enableDatagrams`

* Type: {boolean}

HTTP/3 datagrams (RFC 9297) တွေကို enable လုပ်ပါတယ်။ **Default:** `false`

### Type: `EndpointOptions`

* Type: {Object}

`QuicEndpoint` instance အသစ်တစ်ခုကို တည်ဆောက်တဲ့အခါ ဖြတ်သန်းပေးတဲ့ endpoint configuration options တွေပါ။

#### `endpointOptions.address`

* Type: {net.SocketAddress | string} Endpoint က bind လုပ်သင့်တဲ့ local UDP address နဲ့ port ပါ။

သတ်မှတ်မထားဘူးဆိုရင် — endpoint က random port တစ်ခုပေါ်မှာ IPv4 `localhost` ကို bind လုပ်ပါလိမ့်မယ်။

#### `endpointOptions.blockList`

* Type: {net.BlockList}

Incoming packets တွေကို source address အလိုက် filter လုပ်ဖို့ optional [`net.BlockList`][] instance တစ်ခုပါ။ Configure လုပ်ထားတဲ့အခါ — လက်ခံရရှိတဲ့ UDP packet တိုင်းကို QUIC processing တစ်စုံတစ်ရာ မလုပ်ခင် block list နဲ့ စစ်ဆေးပါတယ်။ ဒါက block လုပ်ထားတဲ့ sources တွေအပေါ် resource အသုံးစရိတ်ကို အနည်းဆုံး ဖြစ်စေပါတယ်။ Block list ကို live (တိုက်ရိုက်) ပုံစံနဲ့ အကဲဖြတ်ပါတယ် — endpoint ကို ဖန်တီးပြီးနောက်မှာ `BlockList` object ထဲကို ထည့်သွင်းလိုက်တဲ့ rules တွေက ချက်ချင်း အကျိုးသက်ရောက်မှု ရှိပါတယ်။

Match တွေကို ဘယ်လို အဓိပ္ပာယ်ကောက်လဲဆိုတာအတွက် [`endpointOptions.blockListPolicy`][] ကို ကြည့်ပါ။

#### `endpointOptions.blockListPolicy`

* Type: {string} `'deny'` (သို့) `'allow'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။
* **Default:** `'deny'`

[`endpointOptions.blockList`][] ကို ဘယ်လို အဓိပ္ပာယ်ကောက်ရမလဲဆိုတာကို ထိန်းချုပ်ပေးပါတယ်:

* `'deny'` — Block list နဲ့ ကိုက်ညီတဲ့ addresses တွေကနေ လာတဲ့ packets တွေကို ပစ်ချပါတယ်။ တခြား addresses တွေ အားလုံးကို လက်ခံပါတယ်။ ဒါက သာမန် blocklist mode ပါ။
* `'allow'` — Block list နဲ့ ကိုက်ညီတဲ့ addresses တွေကနေ လာတဲ့ packets တွေကိုသာ လက်ခံပါတယ်။ တခြား addresses တွေ အားလုံးကို ပစ်ချပါတယ်။ ဒါက — သိထားတဲ့ clients တွေဆီကိုသာ ဝင်ရောက်ခွင့် ကန့်သတ်ဖို့အတွက် — allowlist mode ပါ။

Block list တစ်ခုကို configure မလုပ်ထားဘူးဆိုရင် — ဒီ option က ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

#### `endpointOptions.addressLRUSize`

* Type: {bigint|number}

Endpoint က — performance optimization (စွမ်းဆောင်ရည် ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ခြင်း) အနေနဲ့ — validated socket addresses တွေရဲ့ internal cache တစ်ခုကို ထိန်းသိမ်းထားပါတယ်။ ဒီ option က cache လုပ်ထားတဲ့ addresses အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။ ဒါက users တွေ ပုံမှန်အားဖြင့် သတ်မှတ်စရာ မလိုတဲ့ advanced option တစ်ခုပါ။

#### `endpointOptions.disableStatelessReset`

* Type: {boolean}

`true` ဆိုရင် — endpoint က မသိတဲ့ (unknown) connections တွေကနေ လာတဲ့ packets တွေကို တုံ့ပြန်တဲ့အနေနဲ့ stateless reset packets တွေကို ပို့မှာ မဟုတ်ပါဘူး။ Stateless resets တွေက — server မှာ အဲဒီ connection အတွက် state မရှိတာတောင် — peer တစ်ဦးကို connection တစ်ခု ပျောက်ဆုံးသွားပြီဆိုတာ သိရှိစေပါတယ်။ ၎င်းတို့ကို disable လုပ်တာက — testing တွေမှာ သို့မဟုတ် stateless resets တွေကို တခြား layer တစ်ခုမှာ ကိုင်တွယ်တဲ့အခါ — အသုံးဝင်နိုင်ပါတယ်။

#### `endpointOptions.idleTimeout`

* Type: {number}
* Default: `0`

Sessions တွေ အားလုံး ပိတ်သွားပြီး endpoint က နားထောင်ခြင်း (listening) မလုပ်တော့ပြီးနောက်မှာ — endpoint က ဘယ်နှစ်စက္ကန့် အသက်ရှင်နေဦးမလဲဆိုတာပါ။ `0` (default) တန်ဖိုးတစ်ခုက — endpoint ကို `endpoint.close()` သို့မဟုတ် `endpoint.destroy()` ကနေတစ်ဆင့် ရှင်းလင်းစွာ ပိတ်လိုက်မှသာ destroy လုပ်မယ်လို့ ဆိုလိုပါတယ်။ Positive တန်ဖိုးတစ်ခုကတော့ — endpoint idle ဖြစ်သွားတဲ့အခါ idle timer တစ်ခုကို စတင်ပါတယ်။ Timer fire မလုပ်ခင် session အသစ်တွေ မဖန်တီးရဘူးဆိုရင် — endpoint ကို အလိုအလျောက် destroy လုပ်ပါတယ်။ ဒါက — endpoints တွေက နောင်လာမယ့် `connect()` calls တွေအတွက် ပြန်သုံးဖို့ ခဏလေး ဆက်လက် တည်ရှိနေသင့်တဲ့ — connection pooling (ချိတ်ဆက်မှု စုစည်းခြင်း) အတွက် အသုံးဝင်ပါတယ်။

#### `endpointOptions.ipv6Only`

* Type: {boolean}

`true` ဆိုရင် — endpoint က IPv6 addresses တွေကိုသာ bind လုပ်သင့်တယ်လို့ ညွှန်ပြပါတယ်။

#### `endpointOptions.reusePort`

* Type: {boolean}
* Default: `false`

`true` ဆိုရင် — endpoints အများအပြား (သီးခြား processes တွေအနှံ့) ကို address နဲ့ port တစ်ခုတည်းကို bind လုပ်ခွင့်ပြုပါတယ်။ Kernel က — ဒီ option နဲ့ bind လုပ်ထားတဲ့ sockets တွေ အားလုံးအနှံ့ — incoming UDP datagrams တွေကို load-balance (ဝန်ခွဲဝေ) လုပ်ပါလိမ့်မယ်။ ဒါက — Node.js processes အများအပြားကို port တစ်ခုတည်းပေါ်မှာ run လုပ်စေခြင်းအားဖြင့် — QUIC servers တွေကို horizontal scaling (အလျားလိုက် ချဲ့ထွင်ခြင်း) လုပ်နိုင်စေပါတယ်။

Linux 3.9+ နဲ့ DragonFlyBSD 3.6+ တွေမှာ support လုပ်ပါတယ်။ Support မလုပ်တဲ့ platforms တွေမှာတော့ — bind လုပ်တာက error တစ်ခုနဲ့ မအောင်မြင်ပါဘူး။

#### `endpointOptions.maxConnectionsPerHost`

* Type: {number}
* Default: `0` (ကန့်သတ်ချက် မရှိ)

Remote IP address တစ်ခုစီအတွက် (port ကို ထည့်မတွက်ပဲ) ခွင့်ပြုထားတဲ့ တစ်ပြိုင်နက် (concurrent) sessions အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။ ဒီကန့်သတ်ချက်ကို ရောက်ရှိသွားတဲ့အခါ — IP တစ်ခုတည်းကနေ လာတဲ့ connections အသစ်တွေကို `CONNECTION_REFUSED` နဲ့ ငြင်းပယ်ပါတယ်။ `0` တန်ဖိုးတစ်ခုက ကန့်သတ်ချက်ကို disable လုပ်ပါတယ်။ အများဆုံး တန်ဖိုးကတော့ `65535` ပါ။

ဒီကန့်သတ်ချက်ကို — ဖန်တီးပြီးနောက်မှာလည်း — [`endpoint.maxConnectionsPerHost`][] ကနေတစ်ဆင့် dynamically ပြောင်းလဲလို့ရပါတယ်။

#### `endpointOptions.maxConnectionsTotal`

* Type: {number}
* Default: `0` (ကန့်သတ်ချက် မရှိ)

Remote addresses တွေ အားလုံးအနှံ့မှာ ရှိနိုင်တဲ့ တစ်ပြိုင်နက် sessions တွေရဲ့ စုစုပေါင်း အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။ ဒီကန့်သတ်ချက်ကို ရောက်ရှိသွားတဲ့အခါ — connections အသစ်တွေကို `CONNECTION_REFUSED` နဲ့ ငြင်းပယ်ပါတယ်။ `0` တန်ဖိုးတစ်ခုက ကန့်သတ်ချက်ကို disable လုပ်ပါတယ်။ အများဆုံး တန်ဖိုးကတော့ `65535` ပါ။

ဒီကန့်သတ်ချက်ကို — ဖန်တီးပြီးနောက်မှာလည်း — [`endpoint.maxConnectionsTotal`][] ကနေတစ်ဆင့် dynamically ပြောင်းလဲလို့ရပါတယ်။

#### `endpointOptions.retryRate`

* Type: {number}
* **Default:** `100`

Endpoint က တစ်စက္ကန့်အတွင်း ပို့မယ့် QUIC retry packets အရေအတွက် အများဆုံးပါ။ ဒါက — server တစ်ခုလုံးရဲ့ စုစုပေါင်း retry response rate ကို ကန့်သတ်ပေးတဲ့ — global rate limit (per-host မဟုတ်ပါ) တစ်ခုပါ။ Spoofed-source floods (အတုအယောင် ရင်းမြစ်ကနေ ရေလွှမ်းတိုက်ခိုက်မှုများ) တွေက အကန့်အသတ် မရှိတဲ့ resources တွေကို စားသုံးပစ်တာကနေ ကာကွယ်ပေးပါတယ်။

#### `endpointOptions.retryBurst`

* Type: {number}
* **Default:** `200`

Rate limiting အကျိုးသက်ရောက်မလာခင် ခွင့်ပြုထားတဲ့ retry packets တွေရဲ့ အများဆုံး burst (ရုတ်တရက် အများအပြား ထုတ်လွှတ်မှု) ပါ။

#### `endpointOptions.statelessResetRate`

* Type: {number}
* **Default:** `100`

Endpoint က တစ်စက္ကန့်အတွင်း ပို့မယ့် stateless reset packets အရေအတွက် အများဆုံးပါ။

#### `endpointOptions.statelessResetBurst`

* Type: {number}
* **Default:** `200`

Rate limiting အကျိုးသက်ရောက်မလာခင် ခွင့်ပြုထားတဲ့ stateless reset packets တွေရဲ့ အများဆုံး burst ပါ။

#### `endpointOptions.versionNegotiationRate`

* Type: {number}
* **Default:** `100`

Endpoint က တစ်စက္ကန့်အတွင်း ပို့မယ့် version negotiation packets အရေအတွက် အများဆုံးပါ။

#### `endpointOptions.versionNegotiationBurst`

* Type: {number}
* **Default:** `200`

Rate limiting အကျိုးသက်ရောက်မလာခင် ခွင့်ပြုထားတဲ့ version negotiation packets တွေရဲ့ အများဆုံး burst ပါ။

#### `endpointOptions.immediateCloseRate`

* Type: {number}
* **Default:** `100`

Endpoint က တစ်စက္ကန့်အတွင်း ပို့မယ့် immediate connection close packets အရေအတွက် အများဆုံးပါ။

#### `endpointOptions.immediateCloseBurst`

* Type: {number}
* **Default:** `200`

Rate limiting အကျိုးသက်ရောက်မလာခင် ခွင့်ပြုထားတဲ့ immediate connection close packets တွေရဲ့ အများဆုံး burst ပါ။

#### `endpointOptions.sessionCreationRate`

* Type: {number}
* **Default:** `50`

Remote address တစ်ခုတည်းက တစ်စက္ကန့်အတွင်း ဖန်တီးနိုင်တဲ့ session အသစ်တွေရဲ့ အများဆုံး အရေအတွက်ပါ။ ဒါက — address validation LRU cache ထဲမှာ ခြေရာခံထားတဲ့ — per-host rate limit တစ်ခုပါ။ ၎င်းက — server ကိုင်တွယ်နိုင်တာထက် ပိုမြန်မြန်နဲ့ — validated remote address တစ်ခုက sessions တွေကို churn လုပ်နေတာ (connections တွေကို အလျင်အမြန် ဖွင့်ပြီး စွန့်ပစ်နေတာ) မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။ Traffic တစ်ခုလုံး source တစ်ခုတည်းကနေ လာတဲ့ benchmarking တွေအတွက်ဆိုရင် — ဒါကို မြင့်မားတဲ့ တန်ဖိုးတစ်ခုအဖြစ် သတ်မှတ်ပါ။

#### `endpointOptions.sessionCreationBurst`

* Type: {number}
* **Default:** `100`

Rate limiting အကျိုးသက်ရောက်မလာခင် remote address တစ်ခုတည်းကနေ ခွင့်ပြုထားတဲ့ session အသစ် ဖန်တီးမှုတွေရဲ့ အများဆုံး burst ပါ။

#### `endpointOptions.retryTokenExpiration`

* Type: {bigint|number}

QUIC retry token တစ်ခုကို တရားဝင် (valid) အဖြစ် သတ်မှတ်ထားတဲ့ အချိန်ကာလ အရှည်ကို သတ်မှတ်ပေးပါတယ်။

#### `endpointOptions.resetTokenSecret`

* Type: {ArrayBufferView}

QUIC retry tokens တွေကို ထုတ်လုပ်ဖို့ သုံးတဲ့ 16-byte secret ကို သတ်မှတ်ပေးပါတယ်။

#### `endpointOptions.tokenExpiration`

* Type: {bigint|number}

QUIC token တစ်ခုကို တရားဝင် အဖြစ် သတ်မှတ်ထားတဲ့ အချိန်ကာလ အရှည်ကို သတ်မှတ်ပေးပါတယ်။

#### `endpointOptions.tokenSecret`

* Type: {ArrayBufferView}

QUIC tokens တွေကို ထုတ်လုပ်ဖို့ သုံးတဲ့ 16-byte secret ကို သတ်မှတ်ပေးပါတယ်။

#### `endpointOptions.udpReceiveBufferSize`

* Type: {number}

#### `endpointOptions.udpSendBufferSize`

* Type: {number}

#### `endpointOptions.udpTTL`

* Type: {number}

#### `endpointOptions.validateAddress`

* Type: {boolean}

`true` ဆိုရင် — endpoint က connection အသစ်တစ်ခုကို တည်ဆောက်နေစဉ်မှာ retry packets တွေကို သုံးပြီး peer addresses တွေကို validate လုပ်ဖို့ လိုအပ်ပါတယ်။

### Type: `SessionOptions`

#### `sessionOptions.alpn`

* Type: {string} (client) | {string\[]} (server)

ALPN (Application-Layer Protocol Negotiation) identifier(s) တွေပါ။

**Client** sessions တွေအတွက်ဆိုရင် — client က သုံးချင်တဲ့ protocol ကို သတ်မှတ်ပေးတဲ့ string တစ်ခုတည်း ဖြစ်ပါတယ် (ဥပမာ — `'h3'`)။

**Server** sessions တွေအတွက်ကတော့ — server က support လုပ်တဲ့ protocol နာမည်တွေကို preference order (ဦးစားပေး အစီအစဉ်) နဲ့ ပါဝင်တဲ့ array တစ်ခု ဖြစ်ပါတယ် (ဥပမာ — `['h3', 'h3-29']`)။ TLS handshake အတွင်းမှာ — server က client ပါ support လုပ်တဲ့ — ၎င်းရဲ့ list ထဲက ပထမဆုံး protocol ကို ရွေးချယ်ပါတယ်။

ညှိနှိုင်းပြီးသား ALPN က session အတွက် ဘယ် Application implementation ကို သုံးမလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ `'h3'` နဲ့ `'h3-*'` variants တွေက HTTP/3 application ကို ရွေးချယ်ပြီး — တခြား တန်ဖိုးတွေ အားလုံးကတော့ default application ကို ရွေးချယ်ပါတယ်။

Default: `'h3'`

#### `sessionOptions.application`

* Type: {quic.ApplicationOptions}

Application အတွက် သီးသန့် options တွေပါ။

```mjs
const { listen } = await import('node:quic');

await listen((session) => { /* ... */ }, {
  application: {
    maxHeaderPairs: 64,
    qpackMaxDTableCapacity: 8192,
    enableDatagrams: true,
  },
  // ... other session options
});
```

#### `sessionOptions.ca`

* Type: {ArrayBuffer|ArrayBufferView|ArrayBuffer\[]|ArrayBufferView\[]}

Sessions တွေအတွက် သုံးမယ့် CA certificates တွေပါ။

#### `sessionOptions.cc`

* Type: {string}

သုံးမယ့် congestion control algorithm (ပိတ်ဆို့မှု ထိန်းချုပ်ရေး အယ်လ်ဂိုရစ်သမ်) ကို သတ်မှတ်ပေးပါတယ်။ `'reno'`, `'cubic'` (သို့) `'bbr'` တို့ထဲက တစ်ခုခုကို သတ်မှတ်ပေးရပါမယ်။

ဒါက users တွေ ပုံမှန်အားဖြင့် သတ်မှတ်စရာ မလိုတဲ့ advanced option တစ်ခုပါ။

#### `sessionOptions.certs` (client only)

* Type: {ArrayBuffer|ArrayBufferView|ArrayBuffer\[]|ArrayBufferView\[]}

Client sessions တွေအတွက် သုံးမယ့် TLS certificates တွေပါ။ Server sessions တွေအတွက်ကတော့ — certificates တွေကို [`sessionOptions.sni`][] map ထဲမှာ identity တစ်ခုချင်းစီအလိုက် သတ်မှတ်ပါတယ်။

#### `sessionOptions.certificateCompression`

* Type: {string\[]} `'zlib'`, `'brotli'` (သို့) `'zstd'` တို့ထဲက တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို — preference order နဲ့ ဖြစ်ပါတယ်။

ဒီ session အတွက် TLS certificate compression (certificate ကို ချုံ့ချဲခြင်း) ([RFC 8879][]) ကို enable လုပ်ပါတယ်။ ချန်လှပ်ထားရင် — certificate compression ကို disable လုပ်ပါတယ်။

Server ဘက်မှာတော့ — client က support ရှိကြောင်း ကြေညာထားတဲ့ (advertise) — စာရင်းထဲက ပထမဆုံး algorithm ကို သုံးပြီး certificate chain ကို ချုံ့ပါတယ်။ Client ဘက်မှာတော့ — server က ၎င်းရဲ့ certificate ကို ချုံ့နိုင်အောင် — စာရင်းသွင်းထားတဲ့ algorithms တွေကို server ဆီမှာ ကြေညာပါတယ်။ Client authentication ကို သုံးနေတဲ့အခါ — ဒီ option က client ရဲ့ certificate ရဲ့ compression ကိုလည်း ထိန်းချုပ်ပါတယ်။

Certificate chain ကို ချုံ့တာက QUIC အတွက် အထူး အသုံးဝင်ပါတယ် — အကြောင်းကတော့ ၎င်းက — anti-amplification limit (ချဲ့ထွင်မှု ဆန့်ကျင်ရေး ကန့်သတ်ချက်) နဲ့ ချုပ်နှောင်ထားတဲ့ — server ရဲ့ first flight (ပထမဆုံး ပို့လွှတ်မှု) ရဲ့ အရွယ်အစားကို လျှော့ချပေးလို့ပါ ([Certificate size and handshake performance][] ကို ကြည့်ပါ)။ Certificate compression က TLS 1.3 ကို လိုအပ်ပြီး — QUIC က အမြဲတမ်း TLS 1.3 ကို သုံးပါတယ်။

Algorithms အများဆုံး သုံးခုအထိ သတ်မှတ်လို့ရပါတယ်။ Node.js ကို — certificate compression support မရှိတဲ့ — shared OpenSSL တစ်ခုနဲ့ build လုပ်ထားရင်တော့ ဒီ option ကို တိတ်တဆိတ် လျစ်လျူရှုပါတယ်။

#### `sessionOptions.ciphers`

* Type: {string}

Support လုပ်ထားတဲ့ TLS 1.3 cipher algorithms တွေရဲ့ စာရင်းပါ။

#### `sessionOptions.crl`

* Type: {ArrayBuffer|ArrayBufferView|ArrayBuffer\[]|ArrayBufferView\[]}

Sessions တွေအတွက် သုံးမယ့် CRL ပါ။

#### `sessionOptions.enableEarlyData`

* Type: {boolean} **Default:** `true`

`true` ဆိုရင် — ဒီ session အတွက် TLS 0-RTT early data ကို enable လုပ်ပါတယ်။ Early data က — TLS handshake မပြီးဆုံးခင် — client ကို application data တွေ ပို့ခွင့်ပြုပြီး — တရားဝင်တဲ့ session ticket တစ်ခု ရနိုင်တဲ့အခါ — ပြန်လည်ချိတ်ဆက်မှု (reconnection) မှာ latency ကို လျှော့ချပေးပါတယ်။ Early data support ကို disable လုပ်ဖို့ `false` အဖြစ် သတ်မှတ်ပါ။

#### `sessionOptions.groups`

* Type: {string}

Support လုပ်ထားတဲ့ TLS 1.3 cipher groups တွေရဲ့ စာရင်းပါ။

#### `sessionOptions.keylog`

* Type: {boolean}

`true` ဆိုရင် — session အတွက် TLS key logging ကို enable လုပ်ပါတယ်။ Key material (သော့ချက် ဒေတာ) တွေကို [NSS Key Log Format][] နဲ့ [`session.onkeylog`][] callback ဆီကို ပို့ပေးပါတယ်။ Callback ခေါ်ယူမှုတစ်ခုစီက key material ရဲ့ line တစ်ကြောင်းစီကို လက်ခံရရှိပါတယ်။ ဒီ output ကို — ဖမ်းယူထားတဲ့ QUIC traffic တွေကို decrypt လုပ်ဖို့ — Wireshark လိုမျိုး tools တွေနဲ့ သုံးနိုင်ပါတယ်။

#### `sessionOptions.keys` (client only)

* Type: {KeyObject|KeyObject\[]}

Client sessions တွေအတွက် သုံးမယ့် TLS crypto keys တွေပါ။ Server sessions တွေအတွက်ကတော့ — keys တွေကို [`sessionOptions.sni`][] map ထဲမှာ identity တစ်ခုချင်းစီအလိုက် သတ်မှတ်ပါတယ်။

#### `sessionOptions.maxPayloadSize`

* Type: {bigint|number}

UDP packet payload ရဲ့ အရွယ်အစား အများဆုံးကို သတ်မှတ်ပေးပါတယ်။

#### `sessionOptions.maxStreamWindow`

* Type: {bigint|number}

Stream flow-control window ရဲ့ အရွယ်အစား အများဆုံးကို သတ်မှတ်ပေးပါတယ်။

#### `sessionOptions.maxWindow`

* Type: {bigint|number}

Session flow-control window ရဲ့ အရွယ်အစား အများဆုံးကို သတ်မှတ်ပေးပါတယ်။

#### `sessionOptions.minVersion`

* Type: {number}

ခွင့်ပြုမယ့် QUIC version နံပါတ် အနည်းဆုံးပါ။ ဒါက users တွေ ပုံမှန်အားဖြင့် သတ်မှတ်စရာ မလိုတဲ့ advanced option တစ်ခုပါ။

#### `sessionOptions.preferredAddressPolicy`

* Type: {string} `'use'`, `'ignore'` (သို့) `'default'` တို့အနက် တစ်ခု ဖြစ်ပါတယ်။
* **Default:** `'ignore'`

Remote peer က preferred address (ဦးစားပေး လိပ်စာ) တစ်ခုကို ကြေညာလာတဲ့အခါ — ဒီ option က ၎င်းကို သုံးရမလား လျစ်လျူရှုရမလားဆိုတာကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ `'ignore'` ပါ — အကြောင်းကတော့ server ရဲ့ preferred address ကို လိုက်နာတာက client ရဲ့ connection ကို တခြား IP address တစ်ခုဆီကို ပြောင်းရွှေ့ (migrate) စေပြီး — network အဆင့်မှာ တရားဝင် QUIC connection migration နဲ့ ခွဲခြားလို့ မရတဲ့ — data exfiltration (ဒေတာ ခိုးထုတ်မှု) တိုက်ခိုက်မှုတွေအတွက် အသုံးချခံရနိုင်လို့ပါ။ Preferred address migration ကို လိုအပ်တဲ့ ယုံကြည်ရတဲ့ servers တွေဆီကို ချိတ်ဆက်တဲ့အခါမှသာ `'use'` အဖြစ် သတ်မှတ်ပါ။

#### `sessionOptions.qlog`

* Type: {boolean}

`true` ဆိုရင် — session အတွက် [qlog][] diagnostic output ကို enable လုပ်ပါတယ်။ Qlog data တွေကို [JSON-SEQ][] နဲ့ format လုပ်ထားတဲ့ text chunks တွေအနေနဲ့ [`session.onqlog`][] callback ဆီကို ပို့ပေးပါတယ်။ ဒီ output ကို [qvis][] လိုမျိုး qlog visualization tools တွေနဲ့ ခွဲခြမ်းစိတ်ဖြာ (analyze) လုပ်နိုင်ပါတယ်။

#### `sessionOptions.sessionTicket`

* Type: {ArrayBufferView} 0-RTT session resumption အတွက် သုံးမယ့် session ticket ပါ။

#### `sessionOptions.datagramDropPolicy`

* Type: {string}
* **Default:** `'drop-oldest'`

Pending datagram queue ([`session.maxPendingDatagrams`][] က အရွယ်အစား သတ်မှတ်ပေးထားတဲ့) ပြည့်သွားတဲ့အခါ — ဘယ် datagram ကို ပစ်ချရမလဲဆိုတာကို ထိန်းချုပ်ပေးပါတယ်။ `'drop-oldest'` (နေရာလွတ် ဖြစ်အောင် queue ထဲက အသက်အကြီးဆုံး datagram ကို စွန့်ပစ်ခြင်း) သို့မဟုတ် `'drop-newest'` (ဝင်လာတဲ့ datagram ကို ငြင်းပယ်ခြင်း) နှစ်ခုအနက် တစ်ခု ဖြစ်ရပါမယ်။ ပစ်ချလိုက်တဲ့ datagrams တွေကို `ondatagramstatus` callback ကနေတစ်ဆင့် ပျောက်ဆုံးသွားတယ်လို့ အစီရင်ခံပါတယ်။

ဒီ option က session ဖန်တီးပြီးနောက်မှာ ပြောင်းလဲလို့ မရတဲ့ (immutable) option တစ်ခုပါ။

#### `sessionOptions.streamIdleTimeout`

* Type: {bigint|number}
* **Default:** `30000` (စက္ကန့် 30)

Peer က စတင်တဲ့ (peer-initiated) stream တစ်ခုက — အလိုအလျောက် destroy မလုပ်ခင် — idle (data ဘာမှ မလက်ခံရတာ) ဖြစ်နေလို့ ရတဲ့ အချိန် အများဆုံးကို milliseconds နဲ့ ဖော်ပြပါတယ်။ ဒါက — remote peer တစ်ဦးက streams တွေကို ဖွင့်ထားပေမယ့် data ဘယ်တော့မှ မပို့ပဲ — server ရဲ့ resources တွေကို အကန့်အသတ် မရှိ ချုပ်ကိုင်ထားတဲ့ — slowloris-style တိုက်ခိုက်မှုတွေကနေ ကာကွယ်ပေးပါတယ်။ Peer က စတင်တဲ့ streams တွေကိုသာ စစ်ဆေးပါတယ် — ဒေသခံဘက်က စတင်တဲ့ (locally-initiated) streams တွေကတော့ application ရဲ့ တာဝန်ပါ။ Disable လုပ်ဖို့ `0` အဖြစ် သတ်မှတ်ပါ။

Idle စစ်ဆေးမှုက ပုံမှန် send processing loop ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ လည်ပတ်တာမို့ — timers သို့မဟုတ် event loop overhead တွေ ထပ်ဆောင်း မဖြစ်စေပါဘူး။ `session.stats.streamsIdleTimedOut` counter က ဒီယန္တရားကြောင့် ဖျက်ဆီးခံခဲ့ရတဲ့ streams အရေအတွက်ကို ခြေရာခံပေးပါတယ်။

#### `sessionOptions.maxDatagramSendAttempts`

* Type: {number}
* **Default:** `5`

Datagram တစ်ခုကို စွန့်လွှတ်မလုပ်ခင် — ပို့လွှတ်ခြင်း မရှိပဲ ရှင်သန်နိုင်တဲ့ `SendPendingData` cycles အရေအတွက် အများဆုံးပါ။ Congestion control သို့မဟုတ် packet size ကန့်သတ်ချက်တွေကြောင့် datagram တစ်ခုကို မပို့နိုင်တဲ့အခါ — ၎င်းက queue ထဲမှာ ဆက်ရှိနေပြီး — attempt counter က တိုးပွားသွားပါတယ်။ ဒီကန့်သတ်ချက်ကို ရောက်ရှိသွားတာနဲ့ — datagram ကို ပစ်ချပြီး — `ondatagramstatus` callback ကနေတစ်ဆင့် `'abandoned'` အဖြစ် အစီရင်ခံပါတယ်။ တရားဝင်တဲ့ range: `1` ကနေ `255` အထိပါ။

#### `sessionOptions.drainingPeriodMultiplier`

* Type: {number}
* **Default:** `3`

Peer ဆီကနေ `CONNECTION_CLOSE` frame တစ်ခု လက်ခံရရှိပြီးနောက် — draining period ရဲ့ ကြာချိန်ကို တွက်ချက်ဖို့ — Probe Timeout (PTO) ကို မြှောက်ပေးတဲ့ multiplier ပါ။ RFC 9000 Section 10.2 အရ draining period က လက်ရှိ PTO ရဲ့ အနည်းဆုံး သုံးဆ အထိ ဆက်လက် တည်ရှိနေရပါတယ်။ တရားဝင်တဲ့ range ကတော့ `3` ကနေ `255` အထိပါ။ `3` အောက် တန်ဖိုးတွေကို `3` အဖြစ် ကန့်သတ် (clamp) လုပ်ပါတယ်။

#### `sessionOptions.handshakeTimeout`

* Type: {bigint|number}

TLS handshake တစ်ခုကို — အချိန်ကုန်သွားခင် — ပြီးမြောက်ဖို့ ခွင့်ပြုထားတဲ့ milliseconds အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။

#### `sessionOptions.initialRtt`

* Type: {bigint|number}
* **Default:** `0` (ngtcp2 ရဲ့ default ဖြစ်တဲ့ 333ms ကို သုံးမည်)

ကနဦး round-trip time ခန့်မှန်းချက်ကို milliseconds နဲ့ သတ်မှတ်ပေးပါတယ်။ ဒီတန်ဖိုးကို — connection ကနေ ပထမဆုံး တကယ့် RTT sample ကို မရရှိသေးခင် — probe timeout (PTO) တွက်ချက်မှု၊ ကနဦး pacing နဲ့ စောစီးစွာ ဆုံးရှုံးမှု ရှာဖွေခြင်း (early loss detection) တွေအတွက် သုံးပါတယ်။ Default ဖြစ်တဲ့ 333ms က ယေဘုယျ internet အတွက် သင့်လျော်ပါတယ်။ Loopback သို့မဟုတ် rack တစ်ခုတည်းအတွင်း ဖြန့်ကျက်မှုလိုမျိုး latency နိမ့်တဲ့ environment တွေအတွက်ဆိုရင် — တကယ့် RTT နဲ့ ပိုနီးစပ်တဲ့ တန်ဖိုးတစ်ခု (ဥပမာ — `1`) ကို သတ်မှတ်ပေးတာက မလိုအပ်ပဲ ရှေးရိုးဆန်တဲ့ (conservative) ကနဦး အပြုအမူတွေကို ရှောင်ရှားပေးပါတယ်။

#### `sessionOptions.keepAlive`

* Type: {bigint|number}
* **Default:** `0` (disabled)

Keep-alive timeout ကို milliseconds နဲ့ သတ်မှတ်ပေးပါတယ်။ Non-zero တန်ဖိုးတစ်ခု သတ်မှတ်ထားရင် — idle timeout fire မလုပ်ခင် connection ကို အသက်ဝင်နေအောင် — PING frames တွေကို အလိုအလျောက် ပို့ပေးပါလိမ့်မယ်။ အသုံးဝင်ဖို့အတွက် ဒီတန်ဖိုးက — effective idle timeout (`maxIdleTimeout` transport parameter) ထက် — ငယ်နေရပါမယ်။

#### `sessionOptions.verifyPeer` (client only)

* Type: {string} `'strict'`, `'auto'` (သို့) `'manual'` တို့အနက် တစ်ခု ဖြစ်ပါတယ်။
* **Default:** `'auto'`

Client က server certificate validation ကို ဘယ်လို ကိုင်တွယ်ရမလဲဆိုတာကို ထိန်းချုပ်ပေးပါတယ်:

* `'strict'` — Server ရဲ့ certificate က validation မအောင်မြင်ခဲ့ရင် — OpenSSL က TLS handshake ကို ချက်ချင်း abort လုပ်ပါတယ်။ `session.opened` promise က TLS error တစ်ခုနဲ့ reject လုပ်ပါတယ်။ Application က certificate သို့မဟုတ် error အသေးစိတ်တွေကို စစ်ဆေးလို့ မရပါဘူး။ ဒါက အလုံခြုံဆုံး mode ပါ။

* `'auto'` — Validation ရလဒ် ဘယ်လိုပဲ ရှိပါစေ TLS handshake က ပြီးမြောက်ပါတယ်။ Validation မအောင်မြင်ခဲ့ရင် — `session.opened` promise ကို validation အကြောင်းရင်း ပါဝင်တဲ့ error တစ်ခုနဲ့ reject လုပ်ပြီး — session ကို destroy လုပ်ပါတယ်။ `onhandshake` callback (သတ်မှတ်ထားရင်) က reject မလုပ်ခင် fire လုပ်ပြီး — diagnostic logging (ရောဂါရှာဖွေ မှတ်တမ်းတင်ခြင်း) လုပ်နိုင်စေပါတယ်။ ဒါက default ဖြစ်ပြီး — `rejectUnauthorized: true` ပါတဲ့ `tls.connect()` ရဲ့ အပြုအမူနဲ့ ကိုက်ညီပါတယ်။

* `'manual'` — Validation ရလဒ် ဘယ်လိုပဲ ရှိပါစေ TLS handshake က ပြီးမြောက်ပါတယ်။ `session.opened` promise က — validation မအောင်မြင်ခဲ့ရင် `validationErrorReason` နဲ့ `validationErrorCode` တို့ ပါဝင်တဲ့ — handshake info နဲ့ resolve လုပ်ပါတယ်။ ဒီတန်ဖိုးတွေကို စစ်ဆေးပြီး — ဆက်လုပ်မလား ဆုံးဖြတ်ဖို့ကတော့ application ရဲ့ တာဝန်ပါ။ Custom validation logic (စိတ်ကြိုက် စိစစ်မှု ယုတ္တိ), certificate pinning (certificate ချိတ်ဆွဲမှု) သို့မဟုတ် self-signed certificates တွေကို ရည်ရွယ်ချက်ရှိရှိ လက်ခံခြင်းတို့အတွက် ဒီ mode ကို သုံးပါ။

#### `sessionOptions.servername` (client only)

* Type: {string}

ပစ်မှတ်ထားမယ့် peer server ရဲ့ နာမည် (SNI) ပါ။ Default ကတော့ `'localhost'` ပါ။

#### `sessionOptions.sni` (server only)

* Type: {Object}

Server Name Indication (SNI) support အတွက် host names တွေကို TLS identity options တွေဆီကို map လုပ်ပေးတဲ့ object တစ်ခုပါ။ ဒါက server sessions တွေအတွက် မဖြစ်မနေ လိုအပ်ပြီး — entry အနည်းဆုံး တစ်ခု ပါဝင်ရပါမယ်။ အထူး key ဖြစ်တဲ့ `'*'` က — တခြား host name တစ်ခုမှ မကိုက်ညီတဲ့အခါ သုံးမယ့် optional default/fallback identity ကို သတ်မှတ်ပေးပါတယ်။ Wildcard entry တစ်ခု မပေးထားဘူးဆိုရင် — မမှတ်မိတဲ့ (unrecognized) server names တွေနဲ့ ချိတ်ဆက်မှုတွေကို — TLS `unrecognized_name` alert တစ်ခုနဲ့ — ငြင်းပယ်ပါလိမ့်မယ်။ Entry တစ်ခုချင်းစီမှာ အောက်ပါတို့ ပါဝင်နိုင်ပါတယ်:

* `keys` {KeyObject|KeyObject\[]} TLS private keys တွေပါ။ **Required (မဖြစ်မနေ လိုအပ်)။**
* `certs` {ArrayBuffer|ArrayBufferView|ArrayBuffer\[]|ArrayBufferView\[]} TLS certificates တွေပါ။ **Required (မဖြစ်မနေ လိုအပ်)။**
* `verifyPrivateKey` {boolean} Private key ကို verify လုပ်ပါတယ်။ Default: `false`.
* `port` {number} ဒီ host name အတွက် ORIGIN frames (RFC 9412) တွေထဲမှာ ကြေညာမယ့် port ပါ။ **Default:** `443`။ HTTP/3 sessions တွေအတွက်သာ သုံးပါတယ်။
* `authoritative` {boolean} ဒီ host name ကို ORIGIN frames တွေထဲမှာ ထည့်သွင်းမလား မထည့်သွင်းဘူးလားဆိုတာပါ။ **Default:** `true`။ Host name တစ်ခုကို ORIGIN ကြေညာချက်တွေကနေ ဖယ်ထုတ်ဖို့ `false` အဖြစ် သတ်မှတ်ပါ။ Wildcard (`'*'`) entries တွေကတော့ — ဒီသတ်မှတ်ချက် ဘယ်လိုပဲ ရှိပါစေ — အမြဲတမ်း ဖယ်ထုတ်ခံရပါတယ်။

```mjs
const endpoint = await listen(callback, {
  sni: {
    '*': { keys: [defaultKey], certs: [defaultCert] },
    'api.example.com': { keys: [apiKey], certs: [apiCert], port: 8443 },
    'www.example.com': { keys: [wwwKey], certs: [wwwCert] },
    'internal.example.com': { keys: [intKey], certs: [intCert], authoritative: false },
  },
});
```

Shared TLS options တွေ (`ciphers`, `groups`, `keylog` နဲ့ `verifyClient` လိုမျိုး) ကို session options တွေရဲ့ ထိပ်တန်း (top) အဆင့်မှာ သတ်မှတ်ပြီး — identity တွေ အားလုံးကို အကျိုးသက်ရောက်ပါတယ်။ SNI entry တစ်ခုချင်းစီက identity တစ်ခုချင်းစီနဲ့ ဆိုင်တဲ့ certificate fields တွေကိုသာ override လုပ်ပါတယ်။

SNI map ကို `endpoint.setSNIContexts()` ကို သုံးပြီး runtime မှာ အစားထိုးလို့ရပါတယ် — ၎င်းက session အသစ်တွေအတွက် map ကို atomically (တစ်ပြိုင်နက် တညီတညွတ်တည်း) လဲလှယ်ပေးပြီး — ရှိပြီးသား sessions တွေကတော့ ၎င်းတို့ရဲ့ မူရင်း identity ကို ဆက်လက် သုံးစွဲပါတယ်။

#### `sessionOptions.tlsTrace`

* Type: {boolean}

TLS tracing output ကို enable လုပ်ဖို့ true ဖြစ်ပါတယ်။

#### `sessionOptions.token` (client only)

* Type: {ArrayBufferView}

အရင်က [`session.onnewtoken`][] callback ကနေတစ်ဆင့် server ဆီကနေ လက်ခံရရှိထားတဲ့ opaque (အနက်ဖွင့်လို့မရသော) address validation token ပါ။ ပြန်လည်ချိတ်ဆက်တဲ့အခါ တရားဝင်တဲ့ token တစ်ခု ပေးအပ်လိုက်တာက — client ကို server ရဲ့ address validation ကို ကျော်လွှားခွင့်ပြုပြီး — handshake latency ကို လျှော့ချပေးပါတယ်။

#### `sessionOptions.transportParams`

* Type: {quic.TransportParams}

Session အတွက် သုံးမယ့် QUIC transport parameters တွေပါ။

#### `sessionOptions.unacknowledgedPacketThreshold`

* Type: {bigint|number}

Session တစ်ခုက ခွင့်ပြုထားသင့်တဲ့ acknowledge မလုပ်ရသေးတဲ့ (unacknowledged) packets အရေအတွက် အများဆုံးကို သတ်မှတ်ပေးပါတယ်။

#### `sessionOptions.rejectUnauthorized`

* Type: {boolean} **Default:** `true`

`true` ဆိုရင် — peer certificate ကို ပေးထားတဲ့ CAs စာရင်းနဲ့ ဆန့်ကျင်စစ်ဆေး (verify) လုပ်ပါတယ်။ Verification မအောင်မြင်ခဲ့ရင် error တစ်ခုကို emit လုပ်ပါတယ်။ ဒီ error ကို handshake callback ထဲက `validationErrorReason` နဲ့ `validationErrorCode` fields တွေကနေတစ်ဆင့် စစ်ဆေးနိုင်ပါတယ်။ `false` ဆိုရင်တော့ — peer certificate verification errors တွေကို လျစ်လျူရှုပါတယ်။

#### `sessionOptions.reuseEndpoint`

* Type: {boolean}
* Default: `true`

`true` (default) ဆိုရင် — `connect()` က session တစ်ခုချင်းစီအတွက် endpoint အသစ်တစ်ခု ဖန်တီးမယ့်အစား — ရှိပြီးသား endpoint တစ်ခုကို ပြန်လည် သုံးစွဲဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒါက connection pooling အပြုအမူကို ပေးစွမ်းပါတယ် — sessions အများအပြားက UDP socket တစ်ခုတည်းကို မျှဝေသုံးစွဲနိုင်ပါတယ်။ Reuse လုပ်တဲ့ logic က — connect target နဲ့ address တူညီတဲ့နေရာမှာ listening လုပ်နေတဲ့ endpoint တစ်ခုကိုတော့ (CID routing conflicts တွေ မဖြစ်အောင်) ပြန်ပေးမှာ မဟုတ်ပါဘူး။

Session အတွက် endpoint အသစ်တစ်ခု ဖန်တီးမှုကို တွန်းအားပေးဖို့ `false` အဖြစ် သတ်မှတ်ပါ။ Endpoint isolation (သီးခြားခွဲထားမှု) လိုအပ်တဲ့အခါ (ဥပမာ — source port identity အရေးပါတဲ့ stateless reset အပြုအမူကို test လုပ်တာ) — ဒါက အသုံးဝင်ပါတယ်။

#### `sessionOptions.verifyClient`

* Type: {boolean}

TLS client certificate ရဲ့ verification ကို လိုအပ်စေဖို့ true ဖြစ်ပါတယ်။

#### `sessionOptions.verifyPrivateKey` (client only)

* Type: {boolean}

Client sessions တွေအတွက် private key verification ကို လိုအပ်စေဖို့ true ဖြစ်ပါတယ်။ Server sessions တွေအတွက်ကတော့ — ဒီ option ကို [`sessionOptions.sni`][] map ထဲမှာ identity တစ်ခုချင်းစီအလိုက် သတ်မှတ်ပါတယ်။

#### `sessionOptions.version`

* Type: {number}

သုံးမယ့် QUIC version နံပါတ်ပါ။ ဒါက users တွေ ပုံမှန်အားဖြင့် သတ်မှတ်စရာ မလိုတဲ့ advanced option တစ်ခုပါ။
### Type: `TransportParams`

`TransportParams` type က session တည်ဆောက်မှု အတွင်းမှာ ညှိနှိုင်းသတ်မှတ်တဲ့ QUIC transport parameters တွေကို ကိုယ်စားပြုပါတယ်။ ဒီ parameters တွေကို session တစ်ခု ဖန်တီးတဲ့အခါ သုံးပါတယ်။ ညှိနှိုင်းပြီးသား တန်ဖိုးတွေကို `session.localTransportParams` နဲ့ `session.remoteTransportParams` properties တွေကနေတစ်ဆင့် ကြည့်ရှုနိုင်ပါတယ်။

#### `transportParams.initialSCID`

* Type: {string}

သတ်မှတ်ပေးထားတဲ့ ကနဦး source connection ID (SCID) ပါ။ ဒီ field ကို session ဖန်တီးတဲ့အခါ လျစ်လျူရှုပြီး — `session.localTransportParams` နဲ့ `session.remoteTransportParams` properties တွေထဲမှာ ရရှိနိုင်တဲ့အခါ အချက်အလက် ဖော်ပြချက် (informational) ရည်ရွယ်ချက်အတွက်သာ ထည့်သွင်းပေးထားတာပါ။

#### `transportParams.originalDCID`

* Type: {string}

သတ်မှတ်ပေးထားတဲ့ ကနဦး destination connection ID (DCID) ပါ။ ဒီ field ကို session ဖန်တီးတဲ့အခါ လျစ်လျူရှုပြီး — `session.localTransportParams` နဲ့ `session.remoteTransportParams` properties တွေထဲမှာ ရရှိနိုင်တဲ့အခါ အချက်အလက် ဖော်ပြချက် (informational) ရည်ရွယ်ချက်အတွက်သာ ထည့်သွင်းပေးထားတာပါ။

#### `transportParams.preferredAddressIpv4`

* Type: {net.SocketAddress} ကြေညာဖို့ (advertise) နှစ်သက်ရာ preferred IPv4 address ပါ (servers တွေမှာသာ
  သုံးပါတယ်)။

#### `transportParams.preferredAddressIpv6`

* Type: {net.SocketAddress} ကြေညာဖို့ (advertise) နှစ်သက်ရာ preferred IPv6 address ပါ (servers တွေမှာသာ
  သုံးပါတယ်)။

#### `transportParams.initialMaxStreamDataBidiLocal`

* Type: {bigint|number}

#### `transportParams.initialMaxStreamDataBidiRemote`

* Type: {bigint|number}

#### `transportParams.initialMaxStreamDataUni`

* Type: {bigint|number}

#### `transportParams.initialMaxData`

* Type: {bigint|number}

#### `transportParams.initialMaxStreamsBidi`

* Type: {bigint|number}

#### `transportParams.initialMaxStreamsUni`

* Type: {bigint|number}

#### `transportParams.maxIdleTimeout`

* Type: {bigint|number}

#### `transportParams.activeConnectionIDLimit`

* Type: {bigint|number}

#### `transportParams.ackDelayExponent`

* Type: {bigint|number}

#### `transportParams.maxAckDelay`

* Type: {bigint|number}

#### `transportParams.maxDatagramFrameSize`

* Type: {bigint|number}
* **Default:** `1200`

ဒီ endpoint က လက်ခံဖို့ ဆန္ဒရှိတဲ့ DATAGRAM frame payload ရဲ့ အများဆုံး အရွယ်အစားကို byte နဲ့ ဖော်ပြတာပါ။ Datagram support ကို ပိတ်ချင်ရင် `0` အဖြစ် သတ်မှတ်ပါ။ Peer က ဒီတန်ဖိုးထက် ကြီးတဲ့ datagrams တွေကို ပို့မှာ မဟုတ်ပါဘူး။ _Sent_ (ပို့လွှတ်ခြင်း) ပြုလုပ်နိုင်တဲ့ datagram တစ်ခုရဲ့ တကယ့် အများဆုံး အရွယ်အစားကိုတော့ ဒီ endpoint ရဲ့ တန်ဖိုး မဟုတ်ပဲ — peer ရဲ့ `maxDatagramFrameSize` က ဆုံးဖြတ်ပါတယ်။

#### `transportParams.retrySCID`

* Type: {string}

သတ်မှတ်ပေးထားတဲ့ retry connection ID ပါ။ ဒီ field ကို session ဖန်တီးတဲ့အခါ လျစ်လျူရှုပြီး — `session.localTransportParams` နဲ့ `session.remoteTransportParams` properties တွေထဲမှာ ရရှိနိုင်တဲ့အခါ အချက်အလက် ဖော်ပြချက် (informational) ရည်ရွယ်ချက်အတွက်သာ ထည့်သွင်းပေးထားတာပါ။

## Callbacks (callback များ)

### Callback error ကိုင်တွယ်ခြင်း (Callback error handling)

Session နဲ့ stream callbacks တွေ အားလုံးက synchronous functions တွေ (သို့) async functions တွေ ဖြစ်နိုင်ပါတယ်။ Callback တစ်ခုက synchronously throw လုပ်ခဲ့ရင် (သို့) reject ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးခဲ့ရင် — အဲဒီ error ကို ဖမ်းယူပြီး ပိုင်ဆိုင်တဲ့ (owning) session (သို့) stream ကို အဲဒီ error နဲ့အတူ destroy လုပ်ပါတယ်:

* Stream callbacks (`onblocked`, `onreset`, `onstopsending`, `onheaders`,
  `ontrailers`, `oninfo`, `onwanttrailers`): stream ကို destroy လုပ်ပါတယ်။
* Session callbacks (`onapplication`, `onstream`, `ondatagram`,
  `ondatagramstatus`, `onpathvalidation`, `onsessionticket`,
  `onnewtoken`, `onversionnegotiation`, `onorigin`, `ongoaway`,
  `onhandshake`, `onkeylog`, `onqlog`): session ကို ၎င်းရဲ့ streams တွေ
  အားလုံးနဲ့အတူ destroy လုပ်ပါတယ်။

Destroy မလုပ်ခင် — optional ဖြစ်တဲ့ [`session.onerror`][] (သို့) [`stream.onerror`][] callback ကို (သတ်မှတ်ထားရင်) ခေါ်ပြီး — application က error ကို စောင့်ကြည့်နိုင်ဖို့ (သို့) log လုပ်နိုင်ဖို့ အခွင့်အရေး ပေးပါတယ်။ `session.closed` (သို့) `stream.closed` promise က အဲဒီ error နဲ့ reject ဖြစ်ပါလိမ့်မယ်။

`onerror` callback ကိုယ်တိုင်က throw လုပ်ခဲ့ရင် (သို့) reject ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးခဲ့ရင် — `onerror` ကနေ ထွက်လာတဲ့ error ကို uncaught exception အဖြစ် ထုတ်ဖော်ပါတယ်။

### Callback: `OnSessionCallback`

* `this` {quic.QuicEndpoint}
* `session` {quic.QuicSession}

Remote peer တစ်ဦးက server session အသစ်တစ်ခုကို စတင်လိုက်တဲ့အခါ ခေါ်ယူတဲ့ callback function ပါ။ Peer ရဲ့ TLS `ClientHello` ကို process လုပ်ပြီးတာနဲ့ ခေါ်တာမို့ — callback run လုပ်တဲ့အခါ ညှိနှိုင်းပြီးသား TLS parameters တွေက ချက်ချင်း ရရှိနိုင်ပါတယ်။ ဒီအချက်မတိုင်ခင် handshake ငြင်းပယ်ခံရတဲ့ sessions တွေကိုတော့ ဘယ်တော့မှ ထုတ်ဖော်ပြသခြင်း မရှိပါဘူး။

### Callback: `OnStreamCallback`

* `this` {quic.QuicSession}
* `stream` {quic.QuicStream}

### Callback: `OnDatagramCallback`

* `this` {quic.QuicSession}
* `datagram` {Uint8Array}
* `early` {boolean}

### Callback: `OnDatagramStatusCallback`

* `this` {quic.QuicSession}
* `id` {bigint}
* `status` {string} `'acknowledged'`, `'lost'`, (သို့) `'abandoned'` ထဲက တစ်ခု ဖြစ်ပါတယ်။
  `'acknowledged'` ဆိုတာ peer က လက်ခံရရှိကြောင်း အတည်ပြုပြီးသား ဖြစ်တာကို ဆိုလိုပါတယ်။ `'lost'` ဆိုတာ datagram ကို
  ပို့ခဲ့ပေမယ့် network က ပျောက်ဆုံးသွားစေခဲ့တာကို ဆိုလိုပါတယ်။ `'abandoned'` ဆိုတာ datagram ကို wire ပေါ်ကို
  ဘယ်တော့မှ မပို့ဖြစ်ခဲ့ဘူးလို့ ဆိုလိုပါတယ် (queue overflow ကြောင့် ပစ်ချခံရတာ၊ send attempt limit ကျော်လွန်သွားတာ
  (သို့) frame size ငြင်းပယ်ခံရတာကြောင့်ပါ)။

### Callback: `OnApplicationCallback`

* `this` {quic.QuicSession}
* `applicationoption` {quic.QuicSession}

Application options တွေ ပြောင်းလဲတဲ့အခါ ခေါ်ယူတဲ့ callback function ပါ။ ဥပမာ — http/3 အတွက် settings တွေက application options တွေထဲမှာ ပါဝင်ပြီး — connection တည်ဆောက်ပြီးမှ ရောက်ရှိလာနိုင်ပါတယ်။

### Callback: `OnPathValidationCallback`

* `this` {quic.QuicSession}
* `result` {string} `'success'`, `'failure'`, (သို့) `'aborted'` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `newLocalAddress` {net.SocketAddress} Validated လုပ်ပြီးသား path ရဲ့ local address ပါ။
* `newRemoteAddress` {net.SocketAddress} Validated လုပ်ပြီးသား path ရဲ့ remote address ပါ။
* `oldLocalAddress` {net.SocketAddress | null} ယခင် path ရဲ့ local address ပါ — ဒါက ပထမဆုံး path validation
  ဖြစ်နေရင် (ဥပမာ — client ရဲ့ ရှုထောင့်ကနေ preferred address migration) `null` ဖြစ်ပါတယ်။
* `oldRemoteAddress` {net.SocketAddress | null} ယခင် path ရဲ့ remote address ဖြစ်ပြီး — မရှိရင်
  `null` ပါ။
* `preferredAddress` {boolean} `true` ဆိုရင် path validation ကို client ဘက်က preferred address migration က
  trigger လုပ်ခဲ့တာပါ။ Server ဘက်မှာတော့ `undefined` ဖြစ်ပါတယ်။

### Callback: `OnSessionTicketCallback`

* `this` {quic.QuicSession}
* `ticket` {Object}

### Callback: `OnVersionNegotiationCallback`

* `this` {quic.QuicSession}
* `version` {number} ဒီ session အတွက် configure လုပ်ထားတဲ့ QUIC version ပါ
  (server က support မလုပ်ခဲ့တဲ့ version ပါ)။
* `requestedVersions` {number\[]} Version Negotiation packet ထဲမှာ server က ကြေညာထားတဲ့ versions တွေပါ။ ဒါတွေက
  server က support လုပ်တဲ့ versions တွေပါ။
* `supportedVersions` {number\[]} ဒေသတွင်း (locally) support လုပ်တဲ့ versions တွေပြီး — element နှစ်ခုပါတဲ့
  `[minVersion, maxVersion]` array အနေနဲ့ ဖော်ပြပါတယ်။

Server က client ရဲ့ Initial packet ကို Version Negotiation packet တစ်ခုနဲ့ တုံ့ပြန်တဲ့အခါ — client သုံးနေတဲ့ version ကို support မလုပ်ကြောင်း ဖော်ပြတဲ့အနေနဲ့ — ဒီ callback ကို ခေါ်ပါတယ်။ ဒီ callback ပြန်လာပြီးနောက်မှာ session ကို အမြဲတမ်း ချက်ချင်း destroy လုပ်ပါတယ်။

### Callback: `OnHandshakeCallback`

* `this` {quic.QuicSession}
* `info` {Object} `session.opened` က resolve လုပ်တဲ့ object နဲ့ အတူတူပါ။
  * `local` {net.SocketAddress} Local socket address ပါ။
  * `remote` {net.SocketAddress} Remote socket address ပါ။
  * `servername` {string} Handshake အတွင်းမှာ ညှိနှိုင်းခဲ့တဲ့ SNI server name ပါ။
  * `protocol` {string} Handshake အတွင်းမှာ ညှိနှိုင်းခဲ့တဲ့ ALPN protocol ပါ။
  * `cipher` {string} ညှိနှိုင်းပြီးသား TLS cipher suite ရဲ့ နာမည်ပါ။
  * `cipherVersion` {string} Cipher suite ရဲ့ TLS protocol version ပါ။
  * `validationErrorReason` {string} Certificate validation မအောင်မြင်ခဲ့ရင် reason string ပါ။ Validation အောင်မြင်ခဲ့ရင် empty string ဖြစ်ပါတယ်။
  * `validationErrorCode` {number} Certificate validation မအောင်မြင်ခဲ့ရင် error code ပါ။ Validation အောင်မြင်ခဲ့ရင် `0` ဖြစ်ပါတယ်။
  * `earlyDataAttempted` {boolean} 0-RTT early data ကို ကြိုးပမ်းခဲ့လား ဆိုတာပါ။
  * `earlyDataAccepted` {boolean} 0-RTT early data ကို လက်ခံခဲ့လား ဆိုတာပါ။

### Callback: `OnNewTokenCallback`

* `this` {quic.QuicSession}
* `token` {Buffer} NEW\_TOKEN token data ပါ။
* `address` {SocketAddress} Token နဲ့ ဆက်စပ်နေတဲ့ remote address ပါ။

### Callback: `OnOriginCallback`

* `this` {quic.QuicSession}
* `origins` {string\[]} Server က authoritative (တရားဝင် ကိုယ်စားပြုမှု) ရှိတဲ့ origins စာရင်းပါ။

### Callback: `OnKeylogCallback`

* `this` {quic.QuicSession}
* `line` {string} [NSS Key Log Format][] text ရဲ့ စာကြောင်း တစ်ကြောင်းပါ — နောက်ဆုံးမှာ
  newline character တစ်ခု အပါအဝင် ဖြစ်ပါတယ်။

TLS key material ရရှိနိုင်တဲ့အခါ ခေါ်ပါတယ်။ [`sessionOptions.keylog`][] က `true` ဖြစ်တဲ့အခါမှသာ fire ဖြစ်ပါတယ်။ TLS 1.3 handshake အတွင်းမှာ စာကြောင်း အများအပြား emit လုပ်ပြီး — တစ်ကြောင်းချင်းစီမှာ secret label, client random နဲ့ secret value တို့ ပါဝင်ပါတယ်။

### Callback: `OnQlogCallback`

* `this` {quic.QuicSession}
* `data` {string} [JSON-SEQ][] ပုံစံနဲ့ ချပေးထားတဲ့ [qlog][] data ရဲ့ chunk တစ်ခုပါ။
* `fin` {boolean} ဒါက ဒီ session အတွက် နောက်ဆုံး qlog chunk ဆိုရင် `true` ဖြစ်ပါတယ်။

qlog diagnostic data ရရှိနိုင်တဲ့အခါ ခေါ်ပါတယ်။ [`sessionOptions.qlog`][] က `true` ဖြစ်တဲ့အခါမှသာ fire ဖြစ်ပါတယ်။ `data` chunks တွေကို ပြည့်စုံတဲ့ qlog output ရအောင် အစဉ်လိုက် ဆက်စပ် (concatenate) လုပ်ရပါတယ်။ `fin` က `true` ဖြစ်တဲ့အခါ — chunks တွေ နောက်ထပ် emit လုပ်တော့မှာ မဟုတ်ပဲ — ဆက်စပ်ပြီးသား ရလဒ်က ပြည့်စုံတဲ့ JSON-SEQ document တစ်ခု ဖြစ်ပါတယ်။

### Callback: `OnBlockedCallback`

* `this` {quic.QuicStream}

### Callback: `OnStreamErrorCallback`

* `this` {quic.QuicStream}
* `error` {any}

### Callback: `OnHeadersCallback`

* `this` {quic.QuicStream}
* `headers` {Object} Lowercase string keys တွေနဲ့ string (သို့) string-array values တွေ ပါဝင်တဲ့
  header object ပါ။

ကနဦး request (သို့) response headers တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ပါတယ်။ HTTP/3 အတွက်ဆိုရင် — server ဘက်မှာ request pseudo-headers တွေကို ပြီးတော့ client ဘက်မှာ response headers တွေကို ဒီကနေတစ်ဆင့် ပို့ပေးပါတယ်။

### Callback: `OnTrailersCallback`

* `this` {quic.QuicStream}
* `trailers` {Object} Trailing header object ပါ။

Peer ဆီကနေ trailing headers တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ပါတယ်။

### Callback: `OnInfoCallback`

* `this` {quic.QuicStream}
* `headers` {Object} Informational header object ပါ။

Server ဆီကနေ informational (1xx) headers တွေ လက်ခံရရှိတဲ့အခါ ခေါ်ပါတယ် (ဥပမာ — 103 Early Hints)။

## HTTP/3 ပံ့ပိုးမှု (HTTP/3 support)

ညှိနှိုင်းပြီးသား ALPN identifier က `'h3'` (သို့) `'h3-*'` draft variants တွေထဲက တစ်ခု ဖြစ်နေရင် — QUIC session က `nghttp3` ကို အခြေခံထားတဲ့ HTTP/3 application ကို run လုပ်ပါတယ်။ `'h3'` က `quic.connect()` နဲ့ `quic.listen()` တွေအတွက် default ALPN ဖြစ်တာမို့ — တခြား ALPN တစ်ခုကို ရှင်းရှင်းလင်းလင်း ရွေးချယ်မထားရင် HTTP/3 ကိုပဲ ရရှိမှာ ဖြစ်ပါတယ်။

HTTP/3 application ကို ရွေးချယ်လိုက်တာက — HTTP/3 မဟုတ်တဲ့ applications တွေအတွက် မရရှိနိုင်တဲ့ — stream- နဲ့ session-level capabilities (စွမ်းဆောင်နိုင်မှုများ) အများအပြားကို ဖွင့်ပေးပါတယ်:

* **Headers and trailers** — request နဲ့ response header blocks တွေ (`:method`, `:path`, `:scheme`,
  `:authority`, `:status` စတဲ့ pseudo-headers တွေ အပါအဝင်)၊ trailing headers တွေနဲ့ informational
  (`1xx`) responses တွေပါ။ [`stream.sendHeaders()`][], [`stream.sendTrailers()`][] နဲ့
  [`stream.sendInformationalHeaders()`][] တို့ကို ကြည့်ပါ။
* **Stream priority (RFC 9218)** — stream တစ်ခုချင်းစီအတွက် urgency နဲ့ incremental flags တွေပါ။
  [`stream.priority`][] နဲ့ [`stream.setPriority()`][] တို့ကို ကြည့်ပါ။
* **HTTP/3 datagrams (RFC 9297)** — reliable မဟုတ်တဲ့ application-layer datagrams တွေပါ။ Peer က
  `SETTINGS_H3_DATAGRAM=1` ကို ကြေညာထားရပါမယ် — peers နှစ်ဖက်စလုံးမှာ [`application.enableDatagrams`][]
  ကို `true` အဖြစ် သတ်မှတ်ခြင်းအားဖြင့် ဒါကို enable လုပ်ပါတယ်။ [`session.sendDatagram()`][] နဲ့
  [`session.ondatagram`][] တို့ကို ကြည့်ပါ။
* **ORIGIN frame (RFC 9412)** — servers တွေက သူတို့ရဲ့ [`sessionOptions.sni`][] map ထဲက hostnames
  တွေကို အလိုအလျောက် ကြေညာပါတယ် (`authoritative: true` ပါတဲ့ entries တွေပါ)။ Clients တွေက အဲဒီစာရင်းကို
  [`session.onorigin`][] ကနေတစ်ဆင့် လက်ခံရရှိပါတယ်။
* **GOAWAY** — graceful shutdown (ချောမွေ့စွာ ပိတ်သိမ်းခြင်း) ပါ။ Server က [`session.close()`][] ရဲ့
  အစိတ်အပိုင်းအနေနဲ့ `GOAWAY` ကို emit လုပ်ပြီး — client ကတော့ [`session.ongoaway`][] ကနေတစ်ဆင့်
  ဒါကို သိရှိကာ bidirectional streams အသစ်တွေ ဖွင့်တာ ရပ်လိုက်ပါတယ်။
* **Extended CONNECT settings (RFC 9220)** — `SETTINGS_ENABLE_CONNECT_PROTOCOL` setting ကို
  [`application.enableConnectProtocol`][] ကနေတစ်ဆင့် enable လုပ်နိုင်ပါတယ်။ Setting ကို ဖလှယ်ပေမယ့် —
  `:protocol` pseudo-header နဲ့ အဲဒီအပေါ်မှာ တည်ဆောက်တဲ့ payload framing တွေကို ကိုင်တွယ်ဖို့ကတော့
  application ရဲ့ တာဝန်ပါ။
* **QPACK tuning** — dynamic-table size နဲ့ blocked-streams limits တွေကို
  [`application.qpackMaxDTableCapacity`][] နဲ့ ၎င်းနဲ့ ဆက်စပ်တဲ့ options တွေကနေတစ်ဆင့် ပြင်ဆင်နိုင်ပါတယ်။

### အနည်းဆုံး HTTP/3 client (Minimal HTTP/3 client)

```mjs
import { connect } from 'node:quic';
import process from 'node:process';

const session = await connect('example.com:443', {
  // ALPN defaults to 'h3'.
  servername: 'example.com',
});
await session.opened;

const stream = await session.createBidirectionalStream({
  headers: {
    ':method': 'GET',
    ':path': '/',
    ':scheme': 'https',
    ':authority': 'example.com',
  },
  onheaders(headers) {
    console.log('status:', headers[':status']);
  },
});

const decoder = new TextDecoder();
for await (const chunks of stream) {
  for (const chunk of chunks) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
}

await session.close();
```

သတိပြုရမယ့် အချက်အနည်းငယ် ရှိပါတယ်:

* `body` မပေးထားတဲ့အခါ `session.createBidirectionalStream({ headers })` က HEADERS frame ကို
  terminal အဖြစ် အလိုအလျောက် မှတ်သားပါတယ် — ဆိုလိုတာက request က `HEADERS` ပြီးနောက်
  `END_STREAM` နဲ့ လိုက်ပါတာပါ။
* `onheaders` callback က response pseudo-headers တွေနဲ့ သာမန် headers တွေကို — lowercase string
  keys တွေနဲ့ object တစ်ခုတည်းအနေနဲ့ — လက်ခံရရှိပါတယ်။ Incoming headers တွေအတွက် `:status`
  pseudo-header ကို HTTP/2 ရဲ့ အပြုအမူအတိုင်း `number` အဖြစ် ပြောင်းလဲပေးပါတယ်။ Callback ပြန်လာပြီးနောက်မှာ
  အဲဒီ object ကိုပဲ [`stream.headers`][] ကနေလည်း ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။
* `for await (const chunks of stream)` နဲ့ ဖတ်ခြင်းက response body ကို စားသုံးပါတယ်။
  Iteration တစ်ခုချင်းစီက `Uint8Array[]` chunks တွေရဲ့ batch တစ်ခုကို yield လုပ်ပါတယ်။
* HTTP semantic helpers တွေ (URL parsing, method/status validation, redirects, content negotiation
  (အကြောင်းအရာ ညှိနှိုင်းမှု) စတာတွေ) ကို ရည်ရွယ်ချက်ရှိရှိ built-in မထည့်သွင်းထားပါဘူး။ Wire framing
  ရဲ့ အပေါ်မှာ ကျန်နေတဲ့ HTTP-level handling တွေ အားလုံးကို caller က ကိုယ်တိုင် တာဝန်ယူရပါတယ်။

### အနည်းဆုံး HTTP/3 server (Minimal HTTP/3 server)

```mjs
import { listen } from 'node:quic';

const encoder = new TextEncoder();

const endpoint = await listen((session) => {
  // The session.onstream callback fires for each new client-initiated
  // stream. It is optional here: with `onheaders` configured below,
  // request streams are consumed through that callback.
}, {
  sni: { '*': { keys: [defaultKey], certs: [defaultCert] } },
  // ALPN defaults to 'h3'.
  onheaders(headers) {
    // `this` is the QuicStream. Pseudo-headers are available on the
    // request header block (`:method`, `:path`, `:scheme`,
    // `:authority`).
    if (headers[':path'] === '/health') {
      this.sendHeaders({ ':status': '200', 'content-type': 'text/plain' });
      const w = this.writer;
      w.writeSync(encoder.encode('ok\n'));
      w.endSync();
    } else {
      this.sendHeaders({ ':status': '404' }, { terminal: true });
    }
  },
});

console.log('listening on', endpoint.address);
```

Server ဘက်ဆိုင်ရာ မှတ်စုများ:

* [`listen()`][`quic.listen()`] အဆင့်မှာ `onheaders` ကို သတ်မှတ်လိုက်တာက incoming stream တိုင်းမှာ
  သက်ရောက်စေပါတယ် (`onstream` fire မဖြစ်ခင် ကြိုတင် ချိတ်ဆွဲထားပါတယ်)။ `onstream` ရဲ့ အတွင်းမှာ
  သတ်မှတ်တာကတော့ HTTP/3 အတွက် နောက်ကျလွန်းပါတယ် — request HEADERS frame က stream ပေါ်ကို
  ပထမဆုံး ရောက်ရှိလာတဲ့အရာ ဖြစ်လို့ပါ။
* `this.sendHeaders(headers, { terminal: true })` က response HEADERS frame ကို terminal အဖြစ်
  မှတ်သားပါတယ် (body နောက်ထပ် မပါတော့ပါဘူး)။
* Body ပါတဲ့ responses တွေအတွက် — headers တွေကို အရင်ပို့ပြီး — `this.writer` ဆီကို ရေးသားကာ
  body ပို့ဖို့နဲ့ stream ကို ချောမွေ့စွာ ပိတ်ဖို့ `endSync()` ကို ခေါ်ပါ။

### အကောင်အထည် မဖော်ရသေးသော အရာများ (What is not implemented)

* **Server push** — `PUSH_PROMISE` နဲ့ ဆက်စပ်နေတဲ့ push-stream ယန္တရား (machinery) တွေကို
  အကောင်အထည် မဖော်ရသေးပဲ — မကြာမီ လုပ်ဆောင်မယ့် roadmap ပေါ်မှာလည်း မပါပါဘူး။ Server push က
  လက်တွေ့မှာ အသုံးပြုမှု အကန့်အသတ် ရှိပြီး — use cases အများစုက Early Hints (`103`) (သို့)
  client ကနေ တိုက်ရိုက် fetch လုပ်ခြင်းနဲ့ ပိုကောင်းအောင် ဖြေရှင်းနိုင်ပါတယ်။
* **WebTransport / extended-CONNECT helpers** — `SETTINGS_ENABLE_CONNECT_PROTOCOL` setting ကို
  ညှိနှိုင်းလို့ရပေမယ့် — `:protocol` pseudo-header, WebTransport datagram demultiplexing
  (လမ်းခွဲ ပို့ဆောင်ခြင်း) (သို့) capsule framing တွေအတွက် built-in support မရှိပါဘူး။
* **Higher-level HTTP semantics** — built-in request/response router, URL parsing, content-encoding
  negotiation, body-type coercion, redirect လိုက်လုပ်ခြင်း (သို့) cookie handling တွေ မရှိပါဘူး။
  ဒါတွေကို `node:quic` ရဲ့ အပေါ်မှာ တည်ဆောက်ထားတဲ့ higher-level libraries တွေဆီမှာ သိလျက်နဲ့
  ထားခဲ့တာ (deliberately left) ဖြစ်ပါတယ်။

## စွမ်းဆောင်ရည် တိုင်းတာခြင်း (Performance measurement)

QUIC sessions, streams နဲ့ endpoints တွေက `entryType` ကို `'quic'` အဖြစ် သတ်မှတ်ထားတဲ့
[`PerformanceEntry`][] objects တွေကို emit လုပ်ပါတယ်။ ဒီ entries တွေကို [`PerformanceObserver`][] တစ်ခုက
`'quic'` entry type ကို စောင့်ကြည့်နေမှသာ ဖန်တီးပါတယ် — မသုံးတဲ့အခါ overhead (ထပ်ဆောင်း ဝန်ထုပ်ဝန်ပိုး)
လုံးဝ မရှိအောင် သေချာစေပါတယ်။

Entry တစ်ခုစီမှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

* `name` {string} `'QuicEndpoint'`, `'QuicSession'`, (သို့) `'QuicStream'` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `entryType` {string} အမြဲတမ်း `'quic'` ဖြစ်ပါတယ်။
* `startTime` {number} Object ကို ဖန်တီးလိုက်တဲ့အချိန်ကို ဖော်ပြတဲ့ high-resolution timestamp (ms) ပါ။
* `duration` {number} ဖန်တီးချိန်ကနေ destroy လုပ်ချိန်အထိ millisecond နဲ့ တိုင်းတဲ့ သက်တမ်း
  (lifetime) ပါ။
* `detail` {Object} Entry တစ်ခုချင်းစီအတွက် သီးသန့် metadata ပါ (အောက်မှာ ကြည့်ပါ)။

### `QuicEndpoint` entries

* `detail.stats` {QuicEndpointStats} Destroy လုပ်ချိန်မှာ frozen လုပ်ထားတဲ့ endpoint ရဲ့ statistics
  object ပါ။

### `QuicSession` entries

* `detail.stats` {QuicSessionStats} Destroy လုပ်ချိန်မှာ frozen လုပ်ထားတဲ့ session ရဲ့ statistics
  object ပါ။ Bytes ပို့လွှတ်မှု/လက်ခံမှု, RTT တိုင်းတာမှုတွေ, congestion window, packet အရေအတွက်တွေ
  စတာတွေ ပါဝင်ပါတယ်။
* `detail.handshake` {Object|undefined} Timing နဲ့ သက်ဆိုင်တဲ့ handshake metadata ပါ — destroy
  မလုပ်ခင် handshake မပြီးဆုံးခဲ့ရင် `undefined` ဖြစ်ပါတယ်။
  * `servername` {string} ညှိနှိုင်းပြီးသား SNI server name ပါ။
  * `protocol` {string} ညှိနှိုင်းပြီးသား ALPN protocol ပါ။
  * `earlyDataAttempted` {boolean} 0-RTT early data ကို ကြိုးပမ်းခဲ့လား ဆိုတာပါ။
  * `earlyDataAccepted` {boolean} 0-RTT early data ကို လက်ခံခဲ့လား ဆိုတာပါ။
* `detail.path` {Object|undefined} Session ရဲ့ network path ပါ — မတည်ဆောက်ရသေးရင် `undefined`
  ဖြစ်ပါတယ်။
  * `local` {net.SocketAddress}
  * `remote` {net.SocketAddress}

### `QuicStream` entries

* `detail.stats` {QuicStreamStats} Destroy လုပ်ချိန်မှာ frozen လုပ်ထားတဲ့ stream ရဲ့ statistics
  object ပါ။ Bytes ပို့လွှတ်မှု/လက်ခံမှု, timing timestamps တွေနဲ့ offset ခြေရာခံမှုတွေ ပါဝင်ပါတယ်။
* `detail.direction` {string} `'bidi'` (သို့) `'uni'` ထဲက တစ်ခု ဖြစ်ပါတယ်။

### ဥပမာ (Example)

```mjs
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration.toFixed(1)}ms`);
    if (entry.name === 'QuicSession') {
      const { stats, handshake } = entry.detail;
      console.log(`  protocol: ${handshake?.protocol}`);
      console.log(`  bytes sent: ${stats.bytesSent}`);
      console.log(`  smoothed RTT: ${stats.smoothedRtt}ns`);
    }
  }
});
obs.observe({ entryTypes: ['quic'] });
```

## Diagnostic Channels (diagnostic channel များ)

### Channel: `quic.endpoint.created`

* `endpoint` {quic.QuicEndpoint}
* `config` {quic.EndpointOptions}

Endpoint အသစ်တစ်ခု ဖန်တီးလိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.endpoint.listen`

* `endpoint` {quic.QuicEndpoint}
* `options` {quic.SessionOptions}

Endpoint တစ်ခုက incoming connections တွေအတွက် listen စတင်လုပ်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.endpoint.connect`

* `endpoint` {quic.QuicEndpoint}
* `address` {net.SocketAddress} ပစ်မှတ် (target) server address ပါ။
* `options` {quic.SessionOptions}

[`quic.connect()`][] က client session တစ်ခုကို ဖန်တီးတော့မယ့်အခါ publish လုပ်ပါတယ်။ ngtcp2 connection
မတည်ဆောက်ရသေးခင် fire ဖြစ်ပြီး — diagnostic subscribers တွေက connection ရဲ့ ရည်ရွယ်ချက်ကို
စောင့်ကြည့်နိုင်စေပါတယ်။

### Channel: `quic.endpoint.closing`

* `endpoint` {quic.QuicEndpoint}
* `hasPendingError` {boolean}

Endpoint တစ်ခုက ချောမွေ့စွာ (gracefully) ပိတ်သိမ်းခြင်း စတင်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.endpoint.closed`

* `endpoint` {quic.QuicEndpoint}
* `stats` {quic.QuicEndpoint.Stats} နောက်ဆုံး endpoint statistics တွေပါ။

Endpoint တစ်ခု ပိတ်သိမ်းပြီးစီးပြီး destroy ဖြစ်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.endpoint.error`

* `endpoint` {quic.QuicEndpoint}
* `error` {any}

Endpoint တစ်ခုက ၎င်းကို ပိတ်စေမယ့် error တစ်ခုကို ကြုံတွေ့တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.endpoint.busy.change`

* `endpoint` {quic.QuicEndpoint}
* `busy` {boolean}

Endpoint တစ်ခုရဲ့ busy state ပြောင်းလဲတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.application`

* `applicationoptions` {quic.ApplicationOptions} လက်ရှိ application options တွေပါ။
* `session` {quic.QuicSession}

ဒေသတွင်း (local) ဘက်က စတင်လိုက်တဲ့ stream တစ်ခု ဖွင့်လိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.created.client`

* `endpoint` {quic.QuicEndpoint}
* `session` {quic.QuicSession}
* `address` {net.SocketAddress} Remote server address ပါ။
* `options` {quic.SessionOptions}

Client ဘက်က စတင်လိုက်တဲ့ session တစ်ခု ဖန်တီးလိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.created.server`

* `endpoint` {quic.QuicEndpoint}
* `session` {quic.QuicSession}
* `address` {net.SocketAddress|undefined} Remote peer address ပါ။

Incoming connection တစ်ခုအတွက် server-side session တစ်ခု ဖန်တီးလိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.open.stream`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `direction` {string} `'bidi'` (သို့) `'uni'` ထဲက တစ်ခု ဖြစ်ပါတယ်။

ဒေသတွင်း (local) ဘက်က စတင်လိုက်တဲ့ stream တစ်ခု ဖွင့်လိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.received.stream`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `direction` {string} `'bidi'` (သို့) `'uni'` ထဲက တစ်ခု ဖြစ်ပါတယ်။

Remote ဘက်က စတင်လိုက်တဲ့ stream တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.send.datagram`

* `id` {bigint} Datagram ID ပါ။
* `length` {number} Datagram payload ရဲ့ အရွယ်အစားကို byte နဲ့ ဖော်ပြတာပါ။
* `session` {quic.QuicSession}

Datagram တစ်ခုကို ပို့ဖို့ queue လုပ်လိုက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.update.key`

* `session` {quic.QuicSession}

TLS key update တစ်ခု စတင်လုပ်ဆောင်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.closing`

* `session` {quic.QuicSession}

Session တစ်ခုက ချောမွေ့စွာ ပိတ်သိမ်းခြင်း စတင်တဲ့အခါ publish လုပ်ပါတယ် (peer ဆီကနေ GOAWAY frame တစ်ခု
လက်ခံရရှိတဲ့အခါ အပါအဝင်)။

### Channel: `quic.session.closed`

* `session` {quic.QuicSession}
* `error` {any} ပိတ်သိမ်းမှုကို ဖြစ်စေတဲ့ error ပါ — clean (ပုံမှန်) ဖြစ်ရင် `undefined` ပါ။
* `stats` {quic.QuicSession.Stats} နောက်ဆုံး session statistics တွေပါ။

Session တစ်ခု destroy ဖြစ်တဲ့အခါ publish လုပ်ပါတယ်။ `stats` object က destroy လုပ်ချိန်မှာ ရှိနေတဲ့
နောက်ဆုံး statistics တွေရဲ့ snapshot (ချက်ချင်း မှတ်တမ်း) တစ်ခုပါ။

### Channel: `quic.session.error`

* `session` {quic.QuicSession}
* `error` {any} Session ကို destroy လုပ်စေတဲ့ error ပါ။

Session တစ်ခုကို error တစ်ခုကြောင့် destroy လုပ်တဲ့အခါ publish လုပ်ပါတယ်။ `onerror` callback နဲ့
streams တွေကို teardown လုပ်ခြင်း မတိုင်ခင် fire ဖြစ်ပါတယ်။ `quic.session.closed` (clean နဲ့ error
နှစ်မျိုးလုံးအတွက် fire ဖြစ်တဲ့) နဲ့ မတူပဲ — ဒီ channel က error ရှိတဲ့အခါမှသာ fire ဖြစ်တာမို့ —
error-only alerting (error သီးသန့် သတိပေးချက်) အတွက် သင့်လျော်ပါတယ်။

### Channel: `quic.session.receive.datagram`

* `length` {number} Datagram payload ရဲ့ အရွယ်အစားကို byte နဲ့ ဖော်ပြတာပါ။
* `early` {boolean} Datagram ကို 0-RTT early data အနေနဲ့ လက်ခံရရှိခဲ့လား ဆိုတာပါ။
* `session` {quic.QuicSession}

Remote peer ဆီကနေ datagram တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.receive.datagram.status`

* `id` {bigint} Datagram ID ပါ။
* `status` {string} `'acknowledged'`, `'lost'`, (သို့) `'abandoned'` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `session` {quic.QuicSession}

ပို့လိုက်တဲ့ datagram တစ်ခုရဲ့ delivery status (ပို့ဆောင်မှု အခြေအနေ) အပ်ဒိတ်ဖြစ်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.path.validation`

* `result` {string} `'success'`, `'failure'`, (သို့) `'aborted'` ထဲက တစ်ခု ဖြစ်ပါတယ်။
* `newLocalAddress` {net.SocketAddress}
* `newRemoteAddress` {net.SocketAddress}
* `oldLocalAddress` {net.SocketAddress|null}
* `oldRemoteAddress` {net.SocketAddress|null}
* `preferredAddress` {boolean}
* `session` {quic.QuicSession}

Path validation ကြိုးပမ်းမှု တစ်ခု ပြီးမြောက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.new.token`

* `token` {Buffer} NEW\_TOKEN token data ပါ။
* `address` {net.SocketAddress} Remote server address ပါ။
* `session` {quic.QuicSession}

Client session တစ်ခုက server ဆီကနေ NEW\_TOKEN frame တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.ticket`

* `ticket` {Object} Opaque (ဖတ်မရသော) session ticket ပါ။
* `session` {quic.QuicSession}

TLS session ticket အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.version.negotiation`

* `version` {number} ဒီ session အတွက် configure လုပ်ထားတဲ့ QUIC version ပါ။
* `requestedVersions` {number\[]} Server က ကြေညာထားတဲ့ versions တွေပါ။
* `supportedVersions` {number\[]} ဒေသတွင်း (locally) support လုပ်ထားတဲ့ versions တွေပါ။
* `session` {quic.QuicSession}

Client က server ဆီကနေ Version Negotiation packet တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။
ပြီးနောက်မှာ session ကို အမြဲတမ်း ချက်ချင်း destroy လုပ်ပါတယ်။

### Channel: `quic.session.receive.origin`

* `origins` {string\[]} Server က authoritative (တရားဝင် ကိုယ်စားပြုမှု) ရှိတဲ့ origins စာရင်းပါ။
* `session` {quic.QuicSession}

Session က peer ဆီကနေ ORIGIN frame (RFC 9412) တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.handshake`

* `session` {quic.QuicSession}
* `servername` {string}
* `protocol` {string}
* `cipher` {string}
* `cipherVersion` {string}
* `validationErrorReason` {string}
* `validationErrorCode` {number}
* `earlyDataAttempted` {boolean}
* `earlyDataAccepted` {boolean}

TLS handshake ပြီးမြောက်တဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.session.goaway`

* `session` {quic.QuicSession}
* `lastStreamId` {bigint} Peer က process လုပ်ပြီးသား ဖြစ်နိုင်တဲ့ အမြင့်ဆုံး stream ID ပါ။

Peer က HTTP/3 GOAWAY frame တစ်ခု ပို့လိုက်တဲ့အခါ publish လုပ်ပါတယ်။ `lastStreamId` အထက်က IDs တွေ
ရှိတဲ့ streams တွေကို process မလုပ်ရသေးပဲ — connection အသစ်တစ်ခုပေါ်မှာ ပြန်ကြိုးစားနိုင်ပါတယ်။
`lastStreamId` က `-1n` ဆိုရင် stream boundary မပါပဲ shutdown အသိပေးချက် (ပိတ်ဖို့ ရည်ရွယ်ချက်) တစ်ခုကို
ဖော်ပြပါတယ်။

### Channel: `quic.session.early.rejected`

* `session` {quic.QuicSession}

Server က 0-RTT early data ကို ငြင်းပယ်တဲ့အခါ publish လုပ်ပါတယ်။ 0-RTT အဆင့်အတွင်းမှာ ဖွင့်ခဲ့တဲ့
streams တွေ အားလုံးကို destroy လုပ်ပြီးပါပြီ။ 0-RTT က အောင်မြင်ဖို့ မျှော်လင့်ထားတဲ့အခါ latency
regressions (ကြန့်ကြာမှု ဆုတ်ယုတ်ခြင်း) တွေကို ရှာဖွေဖော်ထုတ်ဖို့ အသုံးဝင်ပါတယ်။

### Channel: `quic.stream.closed`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `error` {any} ပိတ်သိမ်းမှုကို ဖြစ်စေတဲ့ error ပါ — clean (ပုံမှန်) ဖြစ်ရင် `undefined` ပါ။
* `stats` {quic.QuicStream.Stats} နောက်ဆုံး stream statistics တွေပါ။

Stream တစ်ခု destroy ဖြစ်တဲ့အခါ publish လုပ်ပါတယ်။ `stats` object က destroy လုပ်ချိန်မှာ ရှိနေတဲ့
နောက်ဆုံး statistics တွေရဲ့ snapshot (ချက်ချင်း မှတ်တမ်း) တစ်ခုပါ။

### Channel: `quic.stream.headers`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `headers` {Object} ကနဦး request (သို့) response headers တွေပါ။

Stream တစ်ခုပေါ်မှာ ကနဦး headers တွေ လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။ HTTP/3 server-side streams
တွေအတွက် — ဒါထဲမှာ request pseudo-headers တွေ (`:method`, `:path` စသည်) ပါဝင်ပြီး — client-side
streams တွေအတွက်တော့ response headers တွေ (`:status` စသည်) ပါဝင်ပါတယ်။

### Channel: `quic.stream.trailers`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `trailers` {Object} Trailing headers တွေပါ။

Stream တစ်ခုပေါ်မှာ trailing headers တွေ လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်။

### Channel: `quic.stream.info`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `headers` {Object} Informational headers တွေပါ။

Stream တစ်ခုပေါ်မှာ informational (1xx) headers တွေ လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ်
(ဥပမာ — 103 Early Hints)။

### Channel: `quic.stream.reset`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}
* `error` {any} Reset နဲ့ ဆက်စပ်နေတဲ့ QUIC error ပါ။

Stream တစ်ခုက peer ဆီကနေ RESET\_STREAM frame တစ်ခု လက်ခံရရှိတဲ့အခါ publish လုပ်ပါတယ် — peer က သူ့ရဲ့
sending direction ကို abort လုပ်လိုက်ပြီလို့ ဖော်ပြတာပါ။ ဖျက်သိမ်းခံထားရတဲ့ requests တွေလိုမျိုး
application-level ပြဿနာတွေကို ရှာဖွေဖော်ထုတ်ဖို့ အဓိက အချက်ပြမှု (signal) တစ်ခုပါ။

### Channel: `quic.stream.blocked`

* `stream` {quic.QuicStream}
* `session` {quic.QuicSession}

Stream တစ်ခုက flow-control ကြောင့် block ဖြစ်နေပြီး — peer က flow control window ကို မြှင့်တင်မပေးမချင်း
data မပို့နိုင်တဲ့အခါ publish လုပ်ပါတယ်။ Flow control ကြောင့် ဖြစ်ပေါ်တဲ့ throughput ပြဿနာတွေကို
ရှာဖွေဖော်ထုတ်ဖို့ အသုံးဝင်ပါတယ်။

[Aborting a stream]: #aborting-a-stream
[Callback error handling]: #callback-error-handling
[Certificate size and handshake performance]: #certificate-size-and-handshake-performance
[JSON-SEQ]: https://www.rfc-editor.org/rfc/rfc7464
[NSS Key Log Format]: https://udn.realityripple.com/docs/Mozilla/Projects/NSS/Key_Log_Format
[Permission Model]: permissions.md#permission-model
[RFC 8879]: https://www.rfc-editor.org/rfc/rfc8879
[RFC 8999]: https://www.rfc-editor.org/rfc/rfc8999
[RFC 9000]: https://www.rfc-editor.org/rfc/rfc9000
[RFC 9000 Section 8.1]: https://www.rfc-editor.org/rfc/rfc9000#section-8.1
[RFC 9001]: https://www.rfc-editor.org/rfc/rfc9001
[RFC 9002]: https://www.rfc-editor.org/rfc/rfc9002
[RFC 9114]: https://www.rfc-editor.org/rfc/rfc9114
[RFC 9204]: https://www.rfc-editor.org/rfc/rfc9204
[RFC 9218]: https://www.rfc-editor.org/rfc/rfc9218
[RFC 9220]: https://www.rfc-editor.org/rfc/rfc9220
[RFC 9221]: https://www.rfc-editor.org/rfc/rfc9221
[RFC 9287]: https://www.rfc-editor.org/rfc/rfc9287
[RFC 9297]: https://www.rfc-editor.org/rfc/rfc9297
[RFC 9308]: https://www.rfc-editor.org/rfc/rfc9308
[RFC 9312]: https://www.rfc-editor.org/rfc/rfc9312
[RFC 9368]: https://www.rfc-editor.org/rfc/rfc9368
[RFC 9369]: https://www.rfc-editor.org/rfc/rfc9369
[RFC 9412]: https://www.rfc-editor.org/rfc/rfc9412
[RFC 9443]: https://www.rfc-editor.org/rfc/rfc9443
[`PerformanceEntry`]: perf_hooks.md#class-performanceentry
[`PerformanceObserver`]: perf_hooks.md#class-performanceobserver
[`QuicEndpoint`]: #class-quicendpoint
[`QuicError`]: #class-quicerror
[`application.enableConnectProtocol`]: #sessionoptionsapplication
[`application.enableDatagrams`]: #sessionoptionsapplication
[`application.qpackMaxDTableCapacity`]: #sessionoptionsapplication
[`certificateCompression`]: #sessionoptionscertificatecompression
[`crypto.X509Certificate`]: crypto.md#class-x509certificate
[`endpoint.busy`]: #endpointbusy
[`endpoint.maxConnectionsPerHost`]: #endpointmaxconnectionsperhost
[`endpoint.maxConnectionsTotal`]: #endpointmaxconnectionstotal
[`endpointOptions.blockListPolicy`]: #endpointoptionsblocklistpolicy
[`endpointOptions.blockList`]: #endpointoptionsblocklist
[`endpointOptions.immediateCloseBurst`]: #endpointoptionsimmediatecloseburst
[`endpointOptions.immediateCloseRate`]: #endpointoptionsimmediatecloserate
[`endpointOptions.retryBurst`]: #endpointoptionsretryburst
[`endpointOptions.retryRate`]: #endpointoptionsretryrate
[`endpointOptions.sessionCreationBurst`]: #endpointoptionssessioncreationburst
[`endpointOptions.sessionCreationRate`]: #endpointoptionssessioncreationrate
[`endpointOptions.statelessResetBurst`]: #endpointoptionsstatelessresetburst
[`endpointOptions.statelessResetRate`]: #endpointoptionsstatelessresetrate
[`endpointOptions.versionNegotiationBurst`]: #endpointoptionsversionnegotiationburst
[`endpointOptions.versionNegotiationRate`]: #endpointoptionsversionnegotiationrate
[`error.errorCode`]: #errorerrorcode
[`fs.promises.open(path, 'r')`]: fs.md#fspromisesopenpath-flags-mode
[`maxDatagramFrameSize`]: #transportparamsmaxdatagramframesize
[`net.BlockList`]: net.md#class-netblocklist
[`quic.connect()`]: #quicconnectaddress-options
[`quic.listen()`]: #quiclistenonsession-options
[`session.close()`]: #sessioncloseoptions
[`session.createBidirectionalStream()`]: #sessioncreatebidirectionalstreamoptions
[`session.createUnidirectionalStream()`]: #sessioncreateunidirectionalstreamoptions
[`session.destroy()`]: #sessiondestroyerror-options
[`session.maxPendingDatagrams`]: #sessionmaxpendingdatagrams
[`session.onapplication`]: #sessiononapplication
[`session.ondatagram`]: #sessionondatagram
[`session.ondatagramstatus`]: #sessionondatagramstatus
[`session.onearlyrejected`]: #sessiononearlyrejected
[`session.onerror`]: #sessiononerror
[`session.ongoaway`]: #sessionongoaway
[`session.onkeylog`]: #sessiononkeylog
[`session.onnewtoken`]: #sessiononnewtoken
[`session.onorigin`]: #sessiononorigin
[`session.onqlog`]: #sessiononqlog
[`session.onsessionticket`]: #sessiononsessionticket
[`session.onstream`]: #sessiononstream
[`session.sendDatagram()`]: #sessionsenddatagramdatagram-encoding
[`sessionOptions.cc`]: #sessionoptionscc
[`sessionOptions.ciphers`]: #sessionoptionsciphers
[`sessionOptions.datagramDropPolicy`]: #sessionoptionsdatagramdroppolicy
[`sessionOptions.groups`]: #sessionoptionsgroups
[`sessionOptions.keylog`]: #sessionoptionskeylog
[`sessionOptions.qlog`]: #sessionoptionsqlog
[`sessionOptions.sessionTicket`]: #sessionoptionssessionticket
[`sessionOptions.sni`]: #sessionoptionssni-server-only
[`sessionOptions.token`]: #sessionoptionstoken-client-only
[`stream.destroy()`]: #streamdestroyerror-options
[`stream.headers`]: #streamheaders
[`stream.onerror`]: #streamonerror
[`stream.onwanttrailers`]: #streamonwanttrailers
[`stream.pendingTrailers`]: #streampendingtrailers
[`stream.priority`]: #streampriority
[`stream.resetStream()`]: #streamresetstreamcode
[`stream.sendHeaders()`]: #streamsendheadersheaders-options
[`stream.sendInformationalHeaders()`]: #streamsendinformationalheadersheaders
[`stream.sendTrailers()`]: #streamsendtrailersheaders
[`stream.setBody()`]: #streamsetbodybody
[`stream.setPriority()`]: #streamsetpriorityoptions
[`stream.stopSending()`]: #streamstopsendingcode
[`stream.writer`]: #streamwriter
[`writer.fail()`]: #streamwriter
[`writer.fail(reason)`]: #streamwriter
[minimal HTTP/3 server]: #minimal-http3-server
[qlog]: https://datatracker.ietf.org/doc/draft-ietf-quic-qlog-main-schema/
[qvis]: https://qvis.quictools.info/
