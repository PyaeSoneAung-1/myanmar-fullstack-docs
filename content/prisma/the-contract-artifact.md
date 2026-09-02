---
title: "Contract Artifact — emit ထွက်လာတဲ့ contract.json နဲ့ contract.d.ts"
description: "contract emit က ထုတ်ပေးတဲ့ deterministic artifacts နှစ်ခုထဲမှာ ဘာတွေ ပါဝင်လဲ — contract.json (machine-readable contract) နဲ့ contract.d.ts (TypeScript declarations)၊ content hashes တွေက သင့် code နဲ့ database ကို ဘယ်လို သဘောတူညီမှု ထားပေးလဲ"
order: 30
source: "https://www.prisma.io/docs/orm/contract-authoring/the-contract-artifact"
status: translated
updated: 2026-09-02
---

`contract.json` နဲ့ `contract.d.ts` က Prisma 8 ရဲ့ တခြား အစိတ်အပိုင်းတိုင်း စားသုံးတဲ့ deterministic artifacts တွေပါ။ Contract ကို emit လုပ်လိုက်ရင် generated files နှစ်ခု ထွက်လာပြီး — ဒီ page က file တစ်ခုချင်းစီထဲမှာ ဘာတွေပါလဲ၊ ဘာကြောင့် deterministic (နေရာတိုင်း ပုံသေ တူညီ) ဖြစ်လဲ၊ သူတို့ရဲ့ hashes တွေက သင့် code နဲ့ database ကို ဘယ်လို သဘောတူညီမှု ထားပေးလဲဆိုတာ ရှင်းပြပါတယ်။

[`contract emit`](https://www.prisma.io/docs/cli/contract-emit) က file နှစ်ခုလုံးကို source ရဲ့ ဘေးမှာ default အနေနဲ့ ရေးပေးပါတယ်:

| File | ပါဝင်တဲ့ အကြောင်းအရာ | ဘယ်သူတွေ စားသုံးလဲ |
| --- | --- | --- |
| `contract.json` | Canonical, machine-readable contract: models, storage, capabilities နဲ့ content hashes | Runtime, migration tooling, verification နဲ့ သင့် schema ကို ဖတ်ဖို့ လိုတဲ့ တခြားအရာအားလုံး |
| `contract.d.ts` | Contract ကနေ ဆင်းသက်လာတဲ့ TypeScript declarations | Query APIs နဲ့ သင့် application code — typed models နဲ့ results တွေအတွက် |

File နှစ်ခုလုံးက generated ဖြစ်လို့ ကိုယ်တိုင် မပြင်ရပါဘူး။ [PSL](https://www.prisma.io/docs/orm/contract-authoring/psl-syntax) ဒါမှမဟုတ် [TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) source ကို ပြောင်းပြီး `contract emit` ကို ပြန် run ရပါမယ်။ File တွေထဲမှာ အဲဒီအကြောင်း အတိအကျ ပြောထားတဲ့ generated-file notice တစ်ခုလည်း ပါပါတယ်။

## Deterministic Emission (ပုံသေ ထုတ်လွှတ်ခြင်း)

Emission က deterministic ပါ — source အတူတူဆိုရင် machine တိုင်းမှာ၊ run တိုင်းမှာ byte-အဆင့်အထိ တူညီတဲ့ artifacts တွေကို ထုတ်ပေးပါတယ်။ Keys တွေကို canonical order နဲ့ ရေးပြီး values တွေကို normalized ပုံစံနဲ့ ရေးလို့ — artifacts တွေကို code review မှာ diff ကြည့်လို့ရတယ်၊ verification အတွက် hash လုပ်လို့ရပါတယ်။

ဒီ determinism ကြောင့်ပဲ contract source က pure (စင်ကြယ်) ဖြစ်နေရပါတယ်။ Clock ဒါမှမဟုတ် environment ကို ဖတ်တဲ့ schema က run တိုင်း မတူတဲ့ output တွေ ထုတ်လို့ — hash-based guarantee တွေ အားလုံး ပြိုလဲသွားပါတယ်။ သက်ဆိုင်တဲ့ တိကျတဲ့ စည်းမျဉ်းတွေကို [TypeScript authoring page](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder#keep-the-contract-file-pure) မှာ ဖော်ပြထားပါတယ်။

## Content Hashes များ

Emission က contract ရဲ့ အပိုင်းတစ်ခုချင်းစီအပေါ်မှာ hashes တွေ တွက်ပါတယ်။ တစ်ခုချင်းစီက မတူတဲ့ မေးခွန်းတစ်ခုကို ဖြေပါတယ်:

| Hash | လွှမ်းခြုံတာ | ဘယ်အခါ ပြောင်းလဲလဲ |
| --- | --- | --- |
| `storageHash` | Models, fields, relations နဲ့ storage layout တစ်ခုလုံး: tables, columns, keys, indexes | Schema ပြောင်းလဲမှု တစ်ခုခု ရှိရင် |
| `executionHash` | Writes မတိုင်ခင် Prisma 8 က သုံးတဲ့ defaults — `uuid()` generators လိုမျိုး | Generated defaults ပြောင်းလဲရင် |
| `profileHash` | Contract ကို ဆောက်တဲ့ profile: target database နဲ့ ၎င်းရဲ့ family | Contract က တခြား database တစ်ခုကို target လုပ်ရင် |

ဒီ hashes တွေကပဲ Prisma 8 က contract ကို live database နဲ့ ဆက်စပ်ပေးတာပါ။ [`db sign`](https://www.prisma.io/docs/cli/db-sign) က database က contract ကို ဖြည့်ဆည်းမလားဆိုတာ စစ်ပြီး — hashes တွေကို database ထဲက marker တစ်ခုမှာ မှတ်တမ်းတင်ပါတယ်။ အဲဒီကစပြီး [`db verify`](https://www.prisma.io/docs/cli/db-verify) ရော runtime ရောက ကိုင်ထားတဲ့ contract ကို marker နဲ့ ယှဉ်လို့ — stale deploy ဒါမှမဟုတ် migration မလုပ်ရသေးတဲ့ database ကို failing query တစ်ခု မဖြစ်ခင် verification ကပဲ ဖမ်းမိပါတယ်။

## contract.json ထဲမှာ ဘာတွေ ပါလဲ

Contract က သင့် application က model လုပ်တဲ့အရာနဲ့ သိမ်းဆည်းပုံကို ခွဲထားပါတယ်။ `domain` section က models, fields နဲ့ relations တွေကို ဖော်ပြပြီး — `storage` section က tables, columns, keys နဲ့ indexes တွေကို (MongoDB contract ဆိုရင် collections နဲ့ indexes) ဖော်ပြပါတယ်; model တစ်ခုချင်းစီရဲ့ `storage` block က နှစ်ခုကြားကို ပေါင်းကူးပေးပါတယ်။ အရာအားလုံးကို namespace (PostgreSQL မှာ schema — ပုံမှန်အားဖြင့် `public`) အလိုက် စုထားပါတယ်။

`User`/`Post` schema တစ်ခုရဲ့ အကျဉ်းချုပ် emit:

```json title="prisma/contract.json (abridged)"
{
  "schemaVersion": "1",
  "targetFamily": "sql",
  "target": "postgres",
  "profileHash": "sha256:…",
  "roots": {
    "user": { "namespace": "public", "model": "User" },
    "post": { "namespace": "public", "model": "Post" }
  },
  "domain": {
    "namespaces": {
      "public": {
        "models": {
          "User": {
            "fields": {
              "id": { "nullable": false, "type": { "kind": "scalar", "codecId": "pg/uuid@1" } },
              "email": { "nullable": false, "type": { "kind": "scalar", "codecId": "pg/text@1" } }
            },
            "relations": {
              "posts": {
                "cardinality": "1:N",
                "to": { "namespace": "public", "model": "Post" },
                "on": { "localFields": ["id"], "targetFields": ["userId"] }
              }
            },
            "storage": {
              "namespaceId": "public",
              "table": "user",
              "fields": { "id": { "column": "id" }, "email": { "column": "email" } }
            }
          }
        }
      }
    }
  },
  "storage": {
    "storageHash": "sha256:…",
    "namespaces": {
      "public": {
        "entries": {
          "table": {
            "user": {
              "columns": {
                "id": { "nativeType": "uuid", "codecId": "pg/uuid@1", "nullable": false },
                "email": { "nativeType": "text", "codecId": "pg/text@1", "nullable": false }
              },
              "primaryKey": { "columns": ["id"] }
            }
          }
        }
      }
    }
  },
  "execution": { "executionHash": "sha256:…" },
  "capabilities": { "postgres": { "returning": true } },
  "extensionPacks": {}
}
```

Sections တွေကို အပေါ်ကနေ အောက်ကို ကြည့်ရင်:

* **`schemaVersion`, `targetFamily`, `target`** — contract format ရဲ့ version နဲ့ ဒီ contract က target လုပ်တဲ့ database။
* **`roots`** — သင့် queries တွေ စတင်တဲ့ accessor names တွေ၊ တစ်ခုချင်းစီက model တစ်ခုဆီ map လုပ်ထားတယ်။ SQL builder ရဲ့ `db.sql.public.user` ဆိုတာ `roots.user` က `User` ကို ညွှန်လို့ ရှိနေတာဖြစ်ပြီး — ORM accessor `db.orm.public.User` ကလည်း အဲဒီ model နာမည်ပေါ်မှာ မူတည်ပါတယ်။
* **`domain`** — application ရဲ့ မြင်ကွင်း။ Field တစ်ခုချင်းစီမှာ `nullable` နဲ့ `pg/text@1` လိုမျိုး `codecId` ပါပြီး — အဲဒီ type ရဲ့ values တွေကို encode/decode လုပ်တဲ့ codec ကို အမည်ပေးထားပါတယ်။ Relations တွေက cardinality နဲ့ join လုပ်တဲ့ fields တွေကို မှတ်တမ်းတင်ပါတယ်။ Model ရဲ့ `storage` block က fields တွေကို columns တွေဆီ map လုပ်ပေးပါတယ်။
* **`storage`** — database ရဲ့ မြင်ကွင်း: columns (native type နဲ့ codec) ပါတဲ့ tables တွေ၊ primary keys, uniques, indexes, foreign keys နဲ့ enums တွေကို ကျောထောက်ပေးတဲ့ value sets တွေ။ Migration tooling က ဒီ section ကိုပဲ diff လုပ်ပြီး — `db verify` က live schema ကို ဒီ section နဲ့ စစ်ဆေးပါတယ်။
* **`execution`** — database ရဲ့ DDL ထဲ မထည့်ဘဲ — writes မတိုင်ခင် Prisma 8 က သုံးတဲ့ defaults တွေ၊ ဥပမာ UUID generation။
* **`capabilities`** နဲ့ **`extensionPacks`** — emit ချိန်မှာ target, adapter နဲ့ extension packs တွေကနေ ပေါင်းစပ်ထားတဲ့ — ဒီ contract အတွက် ရနိုင်တဲ့ database နဲ့ extension features တွေ။ Query APIs တွေက gated features တွေ မသုံးခင် ဒါတွေကို စစ်ဆေးပါတယ်; [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) ကို ကြည့်ပါ။

## contract.d.ts ထဲမှာ ဘာတွေ ပါလဲ

Declarations file က type system ကို အချက်အလက် အလားတူမျိုး ပေးပါတယ်။ Contract type၊ `contract.json` နဲ့ ကိုက်ညီတဲ့ branded hash types တွေနဲ့ model တစ်ခုချင်းစီအတွက် input/output types တွေကို export လုပ်ပါတယ်:

```typescript title="prisma/contract.d.ts (excerpt)"
export type StorageHash =
  StorageHashBase<"sha256:9f49f8f9e51a9cc016f1ec2098ebae9406521a3cc2cf00207adc795078333d8b">;
export type ProfileHash =
  ProfileHashBase<"sha256:9c8aa3114e84ed3b7ea2bd57526d9c2e1bf7c5292be694e9d3801f566fda7ccb">;

export type AddressOutput = {
  readonly street: CodecTypes["pg/text@1"]["output"];
  readonly city: CodecTypes["pg/text@1"]["output"];
  readonly zip: CodecTypes["pg/text@1"]["output"] | null;
  readonly country: CodecTypes["pg/text@1"]["output"];
};
```

Hashes တွေက literal types တွေ ဖြစ်လို့ — contract version တစ်ခုပေါ် တည်ဆောက်ထားတဲ့ client က တခြား version ရဲ့ artifacts တွေနဲ့ type-အရ မကိုက်ညီပါဘူး။ Verification အလှည့် မရောက်ခင် type checking ကတင် mismatched contract တစ်ခုကို ဖမ်းမိပါတယ်။

## Application က artifacts တွေကို ဘယ်လို စားသုံးလဲ

Runtime client ကို file နှစ်ခုလုံးကနေ တည်ဆောက်ပါတယ် — `contract.json` က value အနေနဲ့၊ `contract.d.ts` က type အနေနဲ့ပါ:

```typescript title="src/prisma/db.ts"
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
});
```

Startup မှာ client က contract ရဲ့ hashes တွေကို သယ်ဆောင်ပြီး — queries တွေ မလည်ခင် database ထဲက marker နဲ့ verify လုပ်ပါတယ်။

## Version Control

Artifacts တွေကို source နဲ့အတူ commit လုပ်ပါ။ သူတို့ထဲမှာ structure တစ်ခုတည်းပဲ ပါပြီး — data ရော credentials ရော မပါတာမို့ commit လုပ်ထားတဲ့ artifacts တွေက teammates, CI နဲ့ deploys တွေကို emission ပြန် run စရာမလိုဘဲ contract ကို စားသုံးခွင့် ပေးပါတယ်။ Source ပြောင်းတိုင်း `contract emit` ကို ပြန် run ပြီး — committed artifacts တွေ source နောက် မကျန်အောင် လုပ်ပါ; CI job တစ်ခုက emit ကို run ပြီး working tree ပြောင်းသွားရင် fail လုပ်တာမျိုးနဲ့ ဒါကို အတင်းအကျပ် စစ်ဆေးနိုင်ပါတယ်။

## Coding Agent ကို Prompt ပေးခြင်း

`create-prisma@latest` နဲ့ scaffold လုပ်ထားတဲ့ project တွေက သင့် coding agent အတွက် [Prisma 8 skills](https://www.prisma.io/docs/ai/tools/skills#available-skills-for-prisma-8) တွေကို install လုပ်ပေးပါတယ် — `prisma-8` skill က ဒီ page ကို လွှမ်းခြုံပါတယ်။ Agent ကို ဒီလို မှာကြည့်ပါ:

- "ဒီ project ထဲမှာ contract.json နဲ့ contract.d.ts ကွာခြားချက်ကို ရှင်းပြပေးပါ။"
- "Contract ကို ပြန် emit လုပ်ပြီး artifact ထဲမှာ ဘာတွေ ပြောင်းသွားလဲ ပြပေးပါ။"

## နောက်တစ်ဆင့်

- Contract ရဲ့ [capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) တွေက database features တွေကို ဘယ်လို gate လုပ်လဲ လေ့လာပါ။
- [`db init`](https://www.prisma.io/docs/cli/db-init) နဲ့ contract ကို database အသစ်တစ်ခုဆီ apply လုပ်ပါ။
- [`db verify`](https://www.prisma.io/docs/cli/db-verify) နဲ့ live database ကို contract နဲ့ စစ်ဆေးပါ။
- [`migration plan`](https://www.prisma.io/docs/cli/migration-plan) နဲ့ contract versions တွေကြားက schema အပြောင်းအလဲတွေကို စီစဉ်ပါ။

## ဆက်စပ်ဖတ်ရန်

- [Author in PSL](/docs/prisma/psl-syntax) — သိပြီးသား schema language အပြင် Prisma 8 ရဲ့ အပိုဆောင်းချက်တွေပါ ပါဝင်တဲ့ Prisma schema file အနေနဲ့ Prisma 8 contract ကို ရေးခြင်း
- [Author in TypeScript](https://www.prisma.io/docs/orm/contract-authoring/typescript-schema-builder) — schema file အစား typed builder API နဲ့ Prisma 8 contract ကို define လုပ်ခြင်း — models တူတူ၊ artifacts တူတူ၊ သီးခြား language မလို
- [Capabilities](https://www.prisma.io/docs/orm/contract-authoring/capabilities) — capabilities တွေက သင့် database stack က ဘာတွေ ထောက်ပံ့လဲ မှတ်တမ်းတင်လို့ Prisma 8 က မထောက်ပံ့တဲ့ features တွေကို ရှင်းရှင်းလင်းလင်း error နဲ့ စောစော ငြင်းပယ်နိုင်တယ်
- [The data contract](/docs/prisma/the-data-contract) — data contract ဆိုတာ သင့် data model နဲ့ storage layout ရဲ့ တစ်ခုတည်းသော ဖော်ပြချက် — Prisma 8 ထဲမှာ အရာအားလုံးက ဒီ contract နဲ့အညီ type သတ်မှတ်၊ စီစဉ်ပြီး verify လုပ်ပါတယ်
