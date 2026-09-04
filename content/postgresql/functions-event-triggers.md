---
title: "Event Trigger Functions (event trigger လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ၏ event trigger များမှ အချက်အလက်များ ရယူရန် helper functions များ — pg_event_trigger_ddl_commands, pg_event_trigger_dropped_objects, pg_event_trigger_table_rewrite_oid နှင့် pg_event_trigger_table_rewrite_reason တို့၏ ပြန်ပေးသည့် columns များနှင့် အသုံးပြုပုံ"
order: 97
source: "https://www.postgresql.org/docs/current/functions-event-triggers.html"
status: translated
updated: 2026-09-04
---

## 9.30. Event Trigger Functions (event trigger လုပ်ဆောင်ချက်များ)

- **9.30.1. Capturing Changes at Command End (command အဆုံးတွင် ပြောင်းလဲမှုများကို ဖမ်းယူခြင်း)**
- **9.30.2. Processing Objects Dropped by a DDL Command (DDL command ကြောင့် ဖျက်ခံလိုက်ရသော objects များကို ကိုင်တွယ်ခြင်း)**
- **9.30.3. Handling a Table Rewrite Event (table rewrite event တစ်ခုကို ကိုင်တွယ်ခြင်း)**

PostgreSQL က — event triggers တွေကနေ အချက်အလက်တွေကို ရယူဖို့အတွက် အောက်ပါ helper functions (အကူ function များ) တွေကို ပံ့ပိုးပေးပါတယ်။

Event triggers အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [အခန်း 38](https://www.postgresql.org/docs/current/event-triggers.html) ကို ကြည့်ပါ။

### 9.30.1. Capturing Changes at Command End (command အဆုံးတွင် ပြောင်းလဲမှုများကို ဖမ်းယူခြင်း)

```sql
pg_event_trigger_ddl_commands () → setof record
```

`pg_event_trigger_ddl_commands` ကို — `ddl_command_end` event trigger တစ်ခုမှာ တွဲထားတဲ့ (attached) function တစ်ခုထဲကနေ ခေါ်လိုက်တဲ့အခါ — user action (အသုံးပြုသူ လုပ်ဆောင်မှု) တစ်ခုချင်းစီအလိုက် လုပ်ဆောင်ခဲ့တဲ့ DDL commands တွေရဲ့ စာရင်းကို ပြန်ပေးပါတယ်။ တခြား context တစ်ခုခုမှာ ခေါ်ရင်တော့ — error (အမှား) တစ်ခု ထွက်လာပါတယ်။ `pg_event_trigger_ddl_commands` က — လုပ်ဆောင်လိုက်တဲ့ base command တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ပြန်ပေးပါတယ်; SQL sentence တစ်ကြောင်းတည်းသာ ဖြစ်တဲ့ command တချို့ကတော့ — row တစ်ခုထက်ပိုပြီး ပြန်ပေးနိုင်ပါတယ်။ ဒီ function က အောက်ပါ columns တွေကို ပြန်ပေးပါတယ်:

| Name | Type | Description |
| --- | --- | --- |
| `classid` | `oid` | object ပါဝင်တဲ့ catalog ရဲ့ OID |
| `objid` | `oid` | object ကိုယ်တိုင်ရဲ့ OID |
| `objsubid` | `integer` | Sub-object ID (ဥပမာ — column တစ်ခုအတွက် attribute number) |
| `command_tag` | `text` | Command tag (command တံဆိပ်) |
| `object_type` | `text` | object ရဲ့ အမျိုးအစား |
| `schema_name` | `text` | object ပါဝင်တဲ့ schema ရဲ့ နာမည် — ရှိရင်; မရှိရင်တော့ `NULL`။ Quoting (ကိုးကားအမှတ် သုံးခြင်း) ကို မလုပ်ပါဘူး။ |
| `object_identity` | `text` | object ရဲ့ identity ကို — schema-qualified (schema ဖြင့် အရည်အချင်း သတ်မှတ်ထားသော) text အဖြစ် ဖော်ပြချက်။ Identity ထဲမှာ ပါဝင်တဲ့ identifier (ခွဲခြား သတ်မှတ်သည့် နာမည်) တစ်ခုချင်းစီကို — လိုအပ်ရင် quoted လုပ်ပါတယ်။ |
| `in_extension` | `boolean` | command က extension script တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်ရင် True |
| `command` | `pg_ddl_command` | command ရဲ့ ပြည့်စုံတဲ့ ကိုယ်စားပြုမှု (representation) — internal format နဲ့။ ဒါကို တိုက်ရိုက် output လုပ်လို့ မရပါဘူး — ဒါပေမယ့် command အကြောင်း မတူညီတဲ့ အချက်အလက် အပိုင်းတွေကို ရယူဖို့ တခြား functions တွေဆီ ပေးပို့ (pass) လုပ်လို့ ရပါတယ်။ |

### 9.30.2. Processing Objects Dropped by a DDL Command (DDL command ကြောင့် ဖျက်ခံလိုက်ရသော objects များကို ကိုင်တွယ်ခြင်း)

```sql
pg_event_trigger_dropped_objects () → setof record
```

`pg_event_trigger_dropped_objects` ကို ခေါ်လိုက်တဲ့ command ရဲ့ `sql_drop` event ထဲမှာ — ဖျက်လိုက်တဲ့ (dropped) objects တွေ အားလုံးရဲ့ စာရင်းကို ပြန်ပေးပါတယ်။ တခြား context တစ်ခုခုမှာ ခေါ်ရင်တော့ — error (အမှား) တစ်ခု ထွက်လာပါတယ်။ ဒီ function က အောက်ပါ columns တွေကို ပြန်ပေးပါတယ်:

| Name | Type | Description |
| --- | --- | --- |
| `classid` | `oid` | object ပါဝင်ခဲ့တဲ့ catalog ရဲ့ OID |
| `objid` | `oid` | object ကိုယ်တိုင်ရဲ့ OID |
| `objsubid` | `integer` | Sub-object ID (ဥပမာ — column တစ်ခုအတွက် attribute number) |
| `original` | `boolean` | ဒါက deletion (ဖျက်ခြင်း) ရဲ့ root object(s) တွေထဲက တစ်ခု ဖြစ်ခဲ့ရင် True |
| `normal` | `boolean` | dependency graph (မှီခိုမှု မြေပုံ) ထဲမှာ ဒီ object ဆီ ဦးတည်တဲ့ normal dependency relationship (ပုံမှန် မှီခိုမှု ဆက်စပ်မှု) တစ်ခု ရှိခဲ့ရင် True |
| `is_temporary` | `boolean` | ဒါက temporary object (ယာယီ object) တစ်ခု ဖြစ်ခဲ့ရင် True |
| `object_type` | `text` | object ရဲ့ အမျိုးအစား |
| `schema_name` | `text` | object ပါဝင်ခဲ့တဲ့ schema ရဲ့ နာမည် — ရှိရင်; မရှိရင်တော့ `NULL`။ Quoting (ကိုးကားအမှတ် သုံးခြင်း) ကို မလုပ်ပါဘူး။ |
| `object_name` | `text` | schema နဲ့ name ပေါင်းစပ်မှုကို — object အတွက် unique identifier (ထူးခြားသော ခွဲခြား သတ်မှတ်ချက်) အဖြစ် သုံးလို့ ရနိုင်မယ်ဆိုရင် — object ရဲ့ နာမည်; မရရင်တော့ `NULL`။ Quoting ကို မလုပ်ပါဘူး — name ကို ဘယ်တော့မှ schema-qualified မလုပ်ပါဘူး။ |
| `object_identity` | `text` | object ရဲ့ identity ကို — schema-qualified (schema ဖြင့် အရည်အချင်း သတ်မှတ်ထားသော) text အဖြစ် ဖော်ပြချက်။ Identity ထဲမှာ ပါဝင်တဲ့ identifier (ခွဲခြား သတ်မှတ်သည့် နာမည်) တစ်ခုချင်းစီကို — လိုအပ်ရင် quoted လုပ်ပါတယ်။ |
| `address_names` | `text[]` | `object_type` နဲ့ `address_args` တို့နဲ့ တွဲပြီး — `pg_get_object_address` function က — အလားတူ နာမည်တူ object တစ်ခု ပါဝင်တဲ့ remote server (အဝေးမှ server) တစ်ခုထဲမှာ object address ကို ပြန်လည် ဖန်တီးဖို့ — သုံးနိုင်တဲ့ array တစ်ခု။ |
| `address_args` | `text[]` | `address_names` အတွက် ဖြည့်စွက်ချက် (complement) |

`pg_event_trigger_dropped_objects` function ကို အောက်ပါအတိုင်း event trigger တစ်ခုထဲမှာ သုံးနိုင်ပါတယ်:

```
CREATE FUNCTION test_event_trigger_for_drops()
        RETURNS event_trigger LANGUAGE plpgsql AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
    LOOP
        RAISE NOTICE '% dropped object: % %.% %',
                     tg_tag,
                     obj.object_type,
                     obj.schema_name,
                     obj.object_name,
                     obj.object_identity;
    END LOOP;
END;
$$;
CREATE EVENT TRIGGER test_event_trigger_for_drops
   ON sql_drop
   EXECUTE FUNCTION test_event_trigger_for_drops();
```

### 9.30.3. Handling a Table Rewrite Event (table rewrite event တစ်ခုကို ကိုင်တွယ်ခြင်း)

ဇယား 9.111 မှာ ပြထားတဲ့ functions တွေက — `table_rewrite` event တစ်ခု ခေါ်လိုက်ခါစ ဖြစ်တဲ့ table တစ်ခုအကြောင်း အချက်အလက်တွေကို ပေးပါတယ်။ တခြား context တစ်ခုခုမှာ ခေါ်ရင်တော့ — error (အမှား) တစ်ခု ထွက်လာပါတယ်။

**ဇယား 9.111. Table Rewrite Information Functions (table rewrite အချက်အလက် လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် |
| --- |
| pg_event_trigger_table_rewrite_oid () → oid ပြန်လည် ရေးသားမည့် (rewrite လုပ်မည့်) table ရဲ့ OID ကို ပြန်ပေးပါတယ်။ |
| pg_event_trigger_table_rewrite_reason () → integer Rewrite လုပ်ရတဲ့ အကြောင်းရင်း(များ)ကို ရှင်းပြတဲ့ code တစ်ခုကို ပြန်ပေးပါတယ်။ တန်ဖိုးက — အောက်ပါ တန်ဖိုးတွေနဲ့ တည်ဆောက်ထားတဲ့ bitmap တစ်ခု ဖြစ်ပါတယ်: 1 (table ရဲ့ persistence ပြောင်းလဲသွားသည်) ၊ 2 (column တစ်ခုရဲ့ default value ပြောင်းလဲသွားသည်) ၊ 4 (column တစ်ခုမှာ data type အသစ် ရှိလာသည်) နဲ့ 8 (table ရဲ့ access method ပြောင်းလဲသွားသည်)။ |

ဒီ functions တွေကို အောက်ပါအတိုင်း event trigger တစ်ခုထဲမှာ သုံးနိုင်ပါတယ်:

```
CREATE FUNCTION test_event_trigger_table_rewrite_oid()
 RETURNS event_trigger
 LANGUAGE plpgsql AS
$$
BEGIN
  RAISE NOTICE 'rewriting table % for reason %',
                pg_event_trigger_table_rewrite_oid()::regclass,
                pg_event_trigger_table_rewrite_reason();
END;
$$;

CREATE EVENT TRIGGER test_table_rewrite_oid
                  ON table_rewrite
   EXECUTE FUNCTION test_event_trigger_table_rewrite_oid();
```
