---
title: "NextRequest (Web Request API ကို convenience methods များဖြင့် တိုးချဲ့ခြင်း)"
description: "NextRequest class — Web Request API ကို တိုးချဲ့ထားပုံ: request ရဲ့ cookies ဖတ်ခြင်း/ပြောင်းလဲခြင်း (set, get, getAll, delete, has, clear), nextUrl နဲ့ basePath/pathname/searchParams/buildId properties များ"
order: 141
source: "https://nextjs.org/docs/app/api-reference/functions/next-request"
status: translated
updated: 2026-09-03
---

NextRequest က [Web Request API](https://developer.mozilla.org/docs/Web/API/Request) ကို အပိုဆောင်း convenience methods (အသုံးပြုရ လွယ်ကူစေတဲ့ method များ) တွေနဲ့ တိုးချဲ့ပါတယ်။

## `cookies`

Request ရဲ့ [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header ကို ဖတ်ခြင်း (သို့) ပြောင်းလဲခြင်း (mutate) ပြုလုပ်ပါတယ်။

### `set(name, value)`

Name တစ်ခု ပေးလိုက်ရင် — request ပေါ်မှာ ပေးထားတဲ့ value နဲ့ cookie တစ်ခုကို set လုပ်ပါတယ်။

```ts
// Given incoming request /home
// Set a cookie to hide the banner
// request will have a `Set-Cookie:show-banner=false;path=/home` header
request.cookies.set('show-banner', 'false')
```

### `get(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie ရဲ့ value ကို ပြန်ပေးပါတယ်။ Cookie ကို မတွေ့ရရင် `undefined` ပြန်ပေးပါတယ်။ Cookies အများအပြား တွေ့ရရင် — ပထမဆုံး တစ်ခုကို ပြန်ပေးပါတယ်။

```ts
// Given incoming request /home
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

### `getAll()`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie ရဲ့ values တွေ အားလုံးကို ပြန်ပေးပါတယ်။ Name မပေးထားဘူးဆိုရင် — request ပေါ်က cookies အားလုံးကို ပြန်ပေးပါတယ်။

```ts
// Given incoming request /home
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// Alternatively, get all cookies for the request
request.cookies.getAll()
```

### `delete(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — request ကနေ cookie ကို ဖျက်ပစ်ပါတယ်။

```ts
// Returns true for deleted, false is nothing is deleted
request.cookies.delete('experiments')
```

### `has(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie က request ပေါ်မှာ တည်ရှိမယ်ဆိုရင် `true` ပြန်ပေးပါတယ်။

```ts
// Returns true if cookie exists, false if it does not
request.cookies.has('experiments')
```

### `clear()`

Request ကနေ cookies အားလုံးကို ဖယ်ရှားပါတယ်။

```ts
request.cookies.clear()
```

## `nextUrl`

Native [`URL`](https://developer.mozilla.org/docs/Web/API/URL) API ကို — Next.js နဲ့ သက်ဆိုင်တဲ့ properties တွေ အပါအဝင် — အပိုဆောင်း convenience methods တွေနဲ့ တိုးချဲ့ပါတယ်။

```ts
// Given a request to /home, pathname is /home
request.nextUrl.pathname
// Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
request.nextUrl.searchParams
```

အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Property       | Type                    | Description                                                                                                                             |
| -------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `basePath`     | `string`                | URL ရဲ့ [base path](/docs/nextjs/next-config-base-path)။                                                                               |
| `buildId`      | `string` \| `undefined` | Next.js application ရဲ့ build identifier။ [Customize](https://nextjs.org/docs/app/api-reference/config/next-config-js/generateBuildId) လုပ်နိုင်ပါတယ်။ |
| `pathname`     | `string`                | URL ရဲ့ pathname။                                                                                                                      |
| `searchParams` | `Object`                | URL ရဲ့ search parameters တွေ။                                                                                                        |

> **မှတ်ချက်:** Pages Router ရဲ့ internationalization properties တွေက App Router မှာ သုံးလို့ မရပါဘူး။ [App Router နဲ့ internationalization](/docs/nextjs/internationalization) အကြောင်း ပိုလေ့လာပါ။

## Version History

| Version   | အပြောင်းအလဲ                  |
| --------- | ---------------------------- |
| `v15.0.0` | `ip` နဲ့ `geo` တို့ကို ဖယ်ရှား။ |
