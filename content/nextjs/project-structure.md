---
title: "Project Structure (Project တည်ဆောက်ပုံ)"
description: "Next.js ရဲ့ folder/file conventions အားလုံး ခြုံငုံကြည့်ခြင်း — top-level folders/files, app folder ထဲက routing files, route groups, colocation နဲ့ project စုစည်းမှု နည်းဗျူဟာများ"
order: 19
source: "https://nextjs.org/docs/app/getting-started/project-structure"
status: translated
updated: 2026-09-02
---

ဒီ page မှာ Next.js ရဲ့ **folder နဲ့ file conventions** (folder/file သတ်မှတ်ချက်များ) အားလုံးရဲ့ အကျဉ်းချုပ် နဲ့ — project ကို ဘယ်လို စနစ်တကျ စုစည်းရမလဲဆိုတဲ့ အကြံပြုချက်တွေကို ဖော်ပြထားပါတယ်။

## Folder နဲ့ File Conventions

### Top-level folders (အဆင့်မြင့်ဆုံး folders)

Top-level folders တွေက application ရဲ့ code နဲ့ static assets တွေကို စုစည်းဖို့ သုံးပါတယ်။

| Folder | အသုံးပြုပုံ |
|---|---|
| `app` | App Router — routes, layouts တွေ နေရာ |
| `pages` | Pages Router (App Router မသုံးရင်) |
| `public` | Static assets တွေ သိမ်းဖို့ — base URL (`/`) ကနေ တိုက်ရိုက် ဝင်ရောက်နိုင် |
| `src` | Optional application source folder — code တွေကို project root ကနေ ခွဲထုတ်သိမ်းချင်ရင် |

### Top-level files (အဆင့်မြင့်ဆုံး files)

Top-level files တွေက application ကို configure လုပ်ဖို့၊ dependencies တွေကို စီမံဖို့၊ proxy run လုပ်ဖို့၊ monitoring tools တွေ ချိတ်ဆက်ဖို့ နဲ့ environment variables တွေ သတ်မှတ်ဖို့ သုံးပါတယ်။ အရေးကြီးတဲ့ဟာတွေက:

| File | ရည်ရွယ်ချက် |
|---|---|
| `next.config.js` | Next.js ရဲ့ configuration file |
| `package.json` | Project dependencies နဲ့ scripts |
| `tsconfig.json` / `jsconfig.json` | TypeScript / JavaScript configuration |
| `next-env.d.ts` | Next.js အတွက် TypeScript declaration file (version control မှာ မထည့်သင့်) |
| `.gitignore` | Git မှာ ထည့်မစဉ်းစားရမယ့် files/folders |
| `eslint.config.mjs` | ESLint configuration |
| `.env`, `.env.local`, `.env.production`, `.env.development` | Environment variables (version control မှာ မထည့်သင့်) |
| `instrumentation.ts` | OpenTelemetry နဲ့ instrumentation file |
| `proxy.ts` | Next.js request proxy |

`.env` files တွေနဲ့ ပတ်သက်ပြီး — ဒါတွေထဲမှာ secret keys လို ထိခိုက်နိုင်တဲ့ အချက်အလက်တွေ ပါတတ်လို့ **version control မှာ ထည့်မသိမ်းသင့်ပါဘူး** (`.env.local` ကို `.gitignore` ထဲ ထည့်ထားတာ ပုံမှန်ပါ)။ Environment variables အကြောင်း အသေးစိတ်ကို [Environment Variables](/docs/nextjs/environment-variables) page မှာ ဖတ်နိုင်ပါတယ်။

### Routing files (Route သတ်မှတ်တဲ့ files)

Route folder တစ်ခုထဲမှာ — `page` ထည့်ရင် route အဖြစ် ဖွင့်ပေးပြီး `layout` က header, nav, footer လို shared UI အတွက်၊ `loading` က skeleton တွေအတွက်၊ `error` က error boundaries တွေအတွက်၊ `route` က API တွေအတွက် သုံးပါတယ်။

| File | Extension များ | ရည်ရွယ်ချက် |
|---|---|---|
| `layout` | `.js` `.jsx` `.tsx` | Segment နဲ့ သူ့အောက် children တွေကို wrap လုပ်တဲ့ shared UI |
| `page` | `.js` `.jsx` `.tsx` | Route တစ်ခုရဲ့ UI — ဒီ file ရှိမှ route က public ဖြစ် |
| `loading` | `.js` `.jsx` `.tsx` | Suspense-based loading UI |
| `not-found` | `.js` `.jsx` `.tsx` | Not found UI |
| `error` | `.js` `.jsx` `.tsx` | Error UI (React error boundary) |
| `global-error` | `.js` `.jsx` `.tsx` | Global error UI |
| `route` | `.js` `.ts` | API endpoint |
| `template` | `.js` `.jsx` `.tsx` | ပြန် re-render လုပ်တဲ့ layout |
| `default` | `.js` `.jsx` `.tsx` | Parallel route fallback page |

ဒီ files တွေအကြောင်း အသေးစိတ်ကို [Pages & Layouts](/docs/nextjs/pages-layouts), [Error Handling](/docs/nextjs/error-handling), [NotFound စာမျက်နှာ](/docs/nextjs/not-found) နဲ့ [Route Handlers](/docs/nextjs/route-handlers) pages တွေမှာ ဖတ်နိုင်ပါတယ်။ `template.js` က layout နဲ့ ပုံစံတူပေမယ့် — navigation တစ်ခါဖြစ်တိုင်း instance အသစ် ဖန်တီးပြီး state ကို မထိန်းထားတာမို့ (ဥပမာ) route တစ်ခုစီအတွက် ပြန် reset လုပ်ရမယ့် UI တွေမှာ သုံးပါတယ်။ `default.js` ကတော့ parallel route တစ်ခုအတွက် ဘယ် page မှ မကိုက်ညီတဲ့အခါ fallback အနေနဲ့ render လုပ်မယ့် file ပါ။

### Nested routes (အလွှာလိုက် routes)

Folders တွေက URL segments တွေကို သတ်မှတ်ပြီး — folder တွေ အလွှာလိုက် ထပ်လေ URL မှာလည်း segment တွေ အလွှာလိုက် ပါလာလေပါပဲ။ Layout တစ်ခုစီက သူ့အောက်က child segments တွေကို wrap လုပ်ပါတယ်။ `page` (သို့) `route` file ရှိမှသာ route က public ဖြစ်ပါတယ်။

| Path | URL pattern |
|---|---|
| `app/layout.tsx` | — (root layout — routes အားလုံးကို wrap လုပ်) |
| `app/blog/layout.tsx` | — (`/blog` နဲ့ အောက်က descendants တွေကို wrap လုပ်) |
| `app/page.tsx` | `/` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/authors/page.tsx` | `/blog/authors` |

### Dynamic routes (Parameter ပါတဲ့ routes)

Square brackets နဲ့ segments တွေကို parameter လုပ်နိုင်ပါတယ် — `[segment]` က single param၊ `[...segment]` က catch-all၊ `[[...segment]]` က optional catch-all ပါ။ တန်ဖိုးတွေကို [`params`](https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional) prop ကနေ ရယူပါတယ်။

| Path | URL pattern |
|---|---|
| `app/blog/[slug]/page.tsx` | `/blog/my-first-post` |
| `app/shop/[...slug]/page.tsx` | `/shop/clothing`, `/shop/clothing/shirts` |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages` |

အသေးစိတ်ကို [Dynamic Routes](/docs/nextjs/dynamic-routes) page မှာ ဖတ်ပါ။

### Route groups နဲ့ Private folders

**Route groups** `(group)` က URL ကို မပြောင်းဘဲ code တွေကို စုစည်းပေးပြီး — **private folders** `_folder` က routing မှာ မပါတဲ့ non-routable files တွေ သိမ်းဖို့ သုံးပါတယ်။

| Path | URL pattern | မှတ်ချက် |
|---|---|---|
| `app/(marketing)/page.tsx` | `/` | Group ကို URL ကနေ ဖယ်ထား |
| `app/(shop)/cart/page.tsx` | `/cart` | `(shop)` အတွင်းမှာ layouts တွေ share လုပ် |
| `app/blog/_components/Post.tsx` | — | Routable မဟုတ် — UI utilities တွေ ထားရန် နေရာ |
| `app/blog/_lib/data.ts` | — | Routable မဟုတ် — utils တွေ ထားရန် နေရာ |

### Parallel နဲ့ Intercepted Routes

ဒီ features တွေက slot-based layouts (parallel routes) နဲ့ modal routing (intercepted routes) လို UI patterns တွေအတွက် သင့်တော်ပါတယ် — `@slot` ကို named slots တွေ render လုပ်ဖို့ သုံးပြီး intercept patterns တွေက URL မပြောင်းဘဲ နောက်ထပ် route တစ်ခုကို လက်ရှိ layout ထဲမှာ render လုပ်ဖို့ သုံးပါတယ် (ဥပမာ — list ပေါ်မှာ details view ကို modal အနေနဲ့ ပြခြင်း)။

| Pattern | အဓိပ္ပါယ် | ပုံမှန် သုံးပုံ |
|---|---|---|
| `@folder` | Named slot | Sidebar + main content |
| `(.)folder` | Intercept same level | Sibling route ကို modal ထဲမှာ ပြခြင်း |
| `(..)folder` | Intercept parent | Parent ရဲ့ child တစ်ခုကို overlay အနေနဲ့ ဖွင့်ခြင်း |
| `(..)(..)folder` | Intercept two levels | အလွှာနက်နက် ထပ်ထားတဲ့ overlay |
| `(...)folder` | Intercept from root | မည်သည့် route မဆို လက်ရှိ view ထဲမှာ ပြခြင်း |

အသေးစိတ်ကို [Parallel Routes](/docs/nextjs/parallel-routes) နဲ့ [Intercepting Routes](/docs/nextjs/intercepting-routes) pages တွေမှာ ဖတ်ပါ။

## Metadata File Conventions

**Metadata files** တွေက route တွေရဲ့ SEO နဲ့ social-sharing အချက်အလက်တွေကို သတ်မှတ်ပေးပါတယ်။

- **App icons** — `favicon.ico`၊ `icon` (`.ico` `.jpg` `.jpeg` `.png` `.svg` ဖြစ်စေ၊ `.js` `.ts` `.tsx` နဲ့ generate လုပ်တာဖြစ်စေ)၊ `apple-icon` တို့က app icon တွေကို သတ်မှတ်ပါတယ်။
- **Open Graph နဲ့ Twitter images** — `opengraph-image` နဲ့ `twitter-image` files တွေက social media ပေါ်မှာ share လုပ်တဲ့အခါ ပြမယ့် images တွေကို သတ်မှတ်ပေးပါတယ် (code နဲ့ generate လုပ်လို့လည်း ရပါတယ်)။
- **SEO** — `sitemap.xml` က sitemap ကို ထုတ်ပေးပြီး `robots.txt` က search engines တွေကို လမ်းညွှန်ပေးပါတယ် (နှစ်မျိုးလုံးကို code နဲ့လည်း generate လုပ်နိုင်ပါတယ်)။

## Project စုစည်းမှု (Organizing Your Project)

Next.js က project files တွေကို ဘယ်လို စုစည်း/colocate လုပ်မလဲဆိုတာနဲ့ ပတ်သက်ပြီး **unopinionated** (မည်သည့် ပုံစံကိုမှ မသတ်မှတ်) ပါ — ဒါပေမယ့် စနစ်ကျအောင် ကူညီပေးမယ့် features တွေ ရှိပါတယ်။

### Component hierarchy

Special files တွေထဲက components တွေကို ဒီအစဉ်အတိုင်း render လုပ်ပါတယ်:

1. `layout.js`
2. `template.js`
3. `error.js` (React error boundary)
4. `loading.js` (React suspense boundary)
5. `not-found.js` ("not found" UI အတွက် React error boundary)
6. `page.js` (သို့) nested `layout.js`

Nested routes တွေမှာ ဒီ components တွေကို ထပ်ခါထပ်ခါ render လုပ်ပြီး — route segment တစ်ခုရဲ့ components တွေက သူ့ parent segment ရဲ့ components တွေရဲ့ **အတွင်းမှာ** nested ဖြစ်နေပါတယ်။ ဥပမာ `app/blog/page.tsx` ရဲ့ UI က `app/blog/layout.tsx` ရဲ့ အတွင်းမှာ ပါဝင်ပြီး — အဲဒီ layout ကလည်း `app/layout.tsx` (root layout) ရဲ့ အတွင်းမှာ ပြန်ပါဝင်နေပါတယ်။ ဒီ hierarchy က [Pages & Layouts](/docs/nextjs/pages-layouts) page မှာ အသေးစိတ် ရှင်းပြထားပါတယ်။

### Colocation (တစ်နေရာတည်းမှာ ထားခြင်း)

`app` directory ထဲမှာ nested folders တွေက route structure ကို သတ်မှတ်ပေမယ့် — route တစ်ခုက `page.js` (သို့) `route.js` file ထည့်မှသာ **publicly accessible** (အများမြင်နိုင်) ဖြစ်ပါတယ်။ ပြီးတော့ route က public ဖြစ်သွားတာတောင် client ဆီ ပို့တာက `page.js` (သို့) `route.js` က **return လုပ်တဲ့ content** ပဲ ဖြစ်ပါတယ်။

ဒါကြောင့် **project files တွေကို** route segments တွေထဲမှာ မတော်တဆ routable မဖြစ်ဘဲ **လုံခြုံစွာ colocate** လုပ်နိုင်ပါတယ် — ဥပမာ `app/blog/page.tsx` ရှိတဲ့ folder ထဲမှာ `app/blog/PostCard.tsx` လို component တစ်ခု ထားရင် သူက route အဖြစ် ဘယ်တော့မှ မပေါ်ပါဘူး။ ဒါပေမယ့် `app` ထဲမှာ ထားချင်မှ ထားရတာ မဟုတ်ဘဲ — အောက်က Project စုစည်းမှု နမူနာများ အပိုင်းမှာ ပြထားသလို `app` အပြင်မှာလည်း သိမ်းလို့ ရပါတယ်။

### Private folders

Folder နာမည်ရှေ့မှာ underscore ထည့်ပြီး private folder ဖန်တီးနိုင်ပါတယ်: `_folderName`။ ဒါက folder နဲ့ သူ့အောက် subfolders အားလုံးကို routing ကနေ ဖယ်ထုတ်လိုက်တာပါ။ Colocation ကို default အနေနဲ့ လုပ်လို့ရပြီးသားမို့ private folders တွေက မလိုအပ်ပေမယ့် — အောက်ပါတို့အတွက် အသုံးဝင်ပါတယ်:

- UI logic နဲ့ routing logic ကို ခွဲခြားဖို့
- Project တွင်းမှာ internal files တွေကို စနစ်တကျ စုစည်းဖို့
- Code editors တွေမှာ files တွေကို sort/group လုပ်ရ လွယ်ကူစေဖို့
- နောင်လာမယ့် Next.js file conventions တွေနဲ့ နာမည် မတိုက်မိအောင် ရှောင်ဖို့

သတိထားစရာ အချက်အလက်တချို့:

- Framework convention မဟုတ်ပေမယ့် — private folders အပြင်က files တွေကိုလည်း underscore ပုံစံနဲ့ "private" လို့ အမှတ်အသား လုပ်လေ့ ရှိပါတယ်။
- URL segment ကို underscore နဲ့ စချင်ရင် folder name ရှေ့မှာ `%5F` (underscore ရဲ့ URL-encoded ပုံစံ) ထည့်ပါ: `%5FfolderName`။
- Private folders မသုံးဘူးဆိုရင် — မမျှော်လင့်တဲ့ naming conflicts တွေ မဖြစ်အောင် အပေါ်က Routing files ဆိုတဲ့ Next.js ရဲ့ special file conventions တွေကို သိထားဖို့ အကြံပြုပါတယ်။

### Route groups

Folder နာမည်ကို parenthesis နဲ့ ပတ်ပြီး route group ဖန်တီးနိုင်ပါတယ်: `(folderName)`။ ဒါက folder က organizational သက်သက်ဖြစ်ပြီး route ရဲ့ URL path မှာ **မပါဝင်ဘူး**လို့ ညွှန်ပြတာပါ။ Route groups တွေက အောက်ပါတို့အတွက် အသုံးဝင်ပါတယ်:

- Routes တွေကို site section, intent (သို့) team အလိုက် စုစည်းဖို့ — ဥပမာ marketing pages, admin pages စသဖြင့်
- Route segment level တစ်ခုတည်းမှာ nested layouts အမျိုးမျိုး ဖန်တီးဖို့ — multiple root layouts အပါအဝင် (အောက်က ဥပမာများမှာ ကြည့်ပါ)

### src folder

Application code (အပါအဝင် `app`) တွေကို optional [`src` folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) ထဲမှာ သိမ်းနိုင်ပါတယ် — ဒါဆိုရင် application code တွေက project root မှာ အများအားဖြင့် ရှိနေတဲ့ configuration files တွေနဲ့ သီးခြား ခွဲထွက်သွားပါတယ်။ ဥပမာ — `app/` အစား `src/app/` ဖြစ်သွားပြီး `next.config.js`, `package.json` စတဲ့ config files တွေကတော့ project root မှာ ဆက်ရှိနေပါတယ်။ ဒါပေမယ့် `public` folder ကိုတော့ `src` ထဲ ရွှေ့လို့ မရပါဘူး — static assets တွေက project root ရဲ့ `public/` မှာပဲ ရှိရပါမယ်။

## Project စုစည်းမှု နမူနာများ

အောက်ပါတို့က အသုံးများတဲ့ strategy တွေရဲ့ အကျဉ်းချုပ် ဖြစ်ပါတယ် — သင့် project အတွက် အဆင်ပြေတဲ့ ပုံစံကို ရွေးပြီး တစ်ပြေးညီ သုံးသွားဖို့ အဓိက အကြံပြုပါတယ်။ (ဥပမာတွေထဲက `components`, `lib` တို့က ယေဘုယျ placeholder နာမည်တွေသာ ဖြစ်ပြီး framework က ဒီနာမည်တွေကို အထူး သတ်မှတ်ထားတာ မဟုတ်ပါ — `ui`, `utils`, `hooks`, `styles` စသဖြင့် သုံးလို့ရပါတယ်။)

### App အပြင်မှာ project files ထားခြင်း

Application code အားလုံးကို **project root** ထဲက shared folders တွေမှာ သိမ်းပြီး `app` directory ကို routing အတွက်ပဲ သီးသန့် ထားပါတယ်။

### App ထဲက top-level folders မှာ project files ထားခြင်း

Application code အားလုံးကို **`app` directory ရဲ့ root** ထဲက shared folders တွေမှာ သိမ်းပါတယ်။

### Feature (သို့) route အလိုက် project files ခွဲခြင်း

ကမ္ဘာနှင့် မျှဝေသုံးတဲ့ application code တွေကို `app` root မှာ ထားပြီး — ပိုပြီး သီးခြားကျတဲ့ code တွေကို သူတို့ သုံးတဲ့ route segments တွေထဲမှာ ခွဲထည့်ပါတယ်။

### URL path မပြောင်းဘဲ routes တွေ စုစည်းခြင်း

URL မပြောင်းချင်ဘဲ ဆက်စပ် routes တွေကို စုစည်းချင်ရင် group ဖန်တီးပါ — parenthesis ထဲက folders တွေကို URL ကနေ ဖယ်ထားပါလိမ့်မယ် (ဥပမာ `(marketing)` (သို့) `(shop)`)။ `(marketing)` နဲ့ `(shop)` အတွင်းက routes တွေက URL hierarchy အတူတူ မျှဝေပေမယ့် — group တစ်ခုစီထဲမှာ `layout.js` ထည့်ပြီး မတူညီတဲ့ layout တွေ ဖန်တီးနိုင်ပါတယ်။ ဒီ layouts တွေက ရှိပြီးသား app layout ရဲ့ အတွင်းမှာ nested ဖြစ်ပါတယ်။

### သတ်မှတ်ထားတဲ့ segments တွေကို layout တစ်ခုထဲ ထည့်ခြင်း

Route group အသစ် (ဥပမာ `(shop)`) ဖန်တီးပြီး layout တူတဲ့ routes တွေ (ဥပမာ `account` နဲ့ `cart`) ကို group ထဲ ရွှေ့ထည့်ပါ — group အပြင်က routes တွေ (ဥပမာ `checkout`) ကတော့ ဒီ layout ကို မရပါဘူး။

### သတ်မှတ်ထားတဲ့ route တစ်ခုအတွက်ပဲ loading skeleton ထည့်ခြင်း

Route group အသစ် (ဥပမာ `/(overview)`) ဖန်တီးပြီး `loading.tsx` ကို ဒီ group ထဲ ရွှေ့ထည့်ပါ — ဒါဆိုရင် `loading.tsx` က dashboard ရဲ့ overview page အတွက်ပဲ အလုပ်လုပ်ပြီး dashboard ရဲ့ အခြား pages တွေကို မထိခိုက်စေဘဲ URL path structure လည်း မပြောင်းပါဘူး။

### Multiple root layouts ဖန်တီးခြင်း

Top-level `layout.js` file ကို ဖျက်ပြီး route group တစ်ခုစီထဲမှာ `layout.js` ထည့်ခြင်းဖြင့် [root layouts အများအပြား](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) ဖန်တီးနိုင်ပါတယ် — ဥပမာအပေါ်မှာ `(marketing)` နဲ့ `(shop)` တစ်ခုစီမှာ ကိုယ်ပိုင် root layout ရှိပါတယ်။ ဒါက application ကို UI (သို့) experience လုံးဝ ကွဲပြားတဲ့ အပိုင်းတွေ ခွဲဖို့ အသုံးဝင်ပြီး — root layout တစ်ခုစီမှာ `<html>` နဲ့ `<body>` tags တွေ ထည့်ပေးရပါမယ်။

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — page နဲ့ layout files တွေရဲ့ အသေးစိတ်
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — dynamic segments သုံးပုံ
- [Parallel Routes](/docs/nextjs/parallel-routes) — slot-based layouts
- [Intercepting Routes](/docs/nextjs/intercepting-routes) — modal routing
