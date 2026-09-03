---
title: "Markdown နဲ့ MDX သုံးခြင်း (MDX)"
description: "Next.js app တွေမှာ markdown နဲ့ MDX ကို configure လုပ်ပြီး သုံးနည်း — dependencies တပ်ဆင်ခြင်း, next.config.mjs နဲ့ mdx-components.tsx စနစ်ထည့်သွင်းခြင်း, rendering နည်းလမ်းများ, custom styles/components, remark & rehype plugins"
order: 111
source: "https://nextjs.org/docs/app/guides/mdx"
status: translated
updated: 2026-09-03
---

[Markdown](https://daringfireball.net/projects/markdown/syntax) ဆိုတာ text တွေကို format လုပ်ဖို့ သုံးတဲ့ ပေါ့ပါးတဲ့ markup language တစ်ခုပါ။ Plain text syntax နဲ့ ရေးပြီး — structurally valid ဖြစ်တဲ့ HTML အဖြစ် ပြောင်းလဲနိုင်စေပါတယ်။ Website တွေနဲ့ blog တွေမှာ content ရေးဖို့ အသုံးများပါတယ်။

ဒီလို ရေးလိုက်ရင်…

```md
I **love** using [Next.js](https://nextjs.org/)
```

Output:

```html
<p>I <strong>love</strong> using <a href="https://nextjs.org/">Next.js</a></p>
```

[MDX](https://mdxjs.com/) ဆိုတာ markdown ရဲ့ superset တစ်ခုဖြစ်ပြီး — သင့် markdown files တွေထဲမှာ [JSX](https://react.dev/learn/writing-markup-with-jsx) ကို တိုက်ရိုက် ရေးနိုင်စေပါတယ်။ ဒါက သင့် content တွေထဲမှာ dynamic interactivity တွေ ထည့်ပြီး React components တွေ embed လုပ်ဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းတစ်ခုပါ။

Next.js က သင့် application အတွင်းမှာ local MDX content တွေကိုရော — server ပေါ်မှာ dynamically fetch လုပ်တဲ့ remote MDX files တွေကိုပါ ထောက်ပံ့ပါတယ်။ Next.js plugin က markdown နဲ့ React components တွေကို HTML အဖြစ် ပြောင်းလဲပေးတာကို ကိုင်တွယ်ပြီး — Server Components တွေထဲမှာ သုံးတာကိုပါ (App Router မှာ default ဖြစ်တဲ့အတိုင်း) ထောက်ပံ့ပါတယ်။

> **သိထားသင့်သည်**: အပြည့်အစုံ အလုပ်လုပ်တဲ့ ဥပမာတစ်ခုအတွက် [Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit) template ကို ကြည့်ပါ။

## Dependencies တပ်ဆင်ခြင်း

`@next/mdx` package နဲ့ ဆက်စပ် packages တွေကို — Next.js က markdown နဲ့ MDX တွေကို process လုပ်နိုင်အောင် configure လုပ်ဖို့ သုံးပါတယ်။ **ဒါက local files တွေကနေ data ကို ယူပြီး** — သင့် `/pages` (သို့) `/app` directory ထဲမှာ တိုက်ရိုက် `.md` (သို့) `.mdx` extension နဲ့ pages တွေ ဖန်တီးနိုင်စေပါတယ်။

MDX ကို Next.js နဲ့ render လုပ်ဖို့ ဒီ packages တွေကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash package="npm"
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash package="yarn"
yarn add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash package="bun"
bun add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

## `next.config.mjs` ကို Configure လုပ်ခြင်း

သင့် project ရဲ့ root မှာရှိတဲ့ `next.config.mjs` file ကို MDX သုံးဖို့ update လုပ်ပါ:

```js filename="next.config.mjs"
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
```

ဒါက `.mdx` files တွေကို သင့် application ထဲမှာ pages, routes (သို့) imports အဖြစ် အလုပ်လုပ်စေပါတယ်။

### `.md` files တွေကို ကိုင်တွယ်ခြင်း

Default အားဖြင့် `@next/mdx` က `.mdx` extension ရှိတဲ့ files တွေကိုပဲ compile လုပ်ပါတယ်။ Webpack နဲ့ `.md` files တွေကို ကိုင်တွယ်ဖို့ — `extension` option ကို update လုပ်ပါ:

```js filename="next.config.mjs"
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})
```

## `mdx-components.tsx` file တစ်ခု ထည့်ခြင်း

Global MDX Components တွေကို သတ်မှတ်ဖို့ — သင့် project ရဲ့ root မှာ `mdx-components.tsx` (သို့) `.js` file တစ်ခု ဖန်တီးပါ။ ဥပမာ — `pages` (သို့) `app` တွေနဲ့ အတူတူ level မှာ (သက်ဆိုင်ရင် `src` ထဲမှာ) ထားပါ။

```tsx filename="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js"
const components = {}

export function useMDXComponents() {
  return components
}
```

> **သိထားသင့်သည်**:
>
> - App Router နဲ့ `@next/mdx` သုံးဖို့ `mdx-components.tsx` က **မဖြစ်မနေ လိုအပ်ပြီး** — ဒါမရှိရင် အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။
> - [`mdx-components.tsx` file convention](/docs/nextjs/file-conventions-mdx-components) အကြောင်း ပိုလေ့လာပါ။
> - [Custom styles နဲ့ components တွေ ဘယ်လို သုံးမလဲ](#using-custom-styles-and-components) ဆိုတာ လေ့လာပါ။

## MDX Rendering လုပ်ခြင်း

MDX ကို — Next.js ရဲ့ file based routing နဲ့ ဖြစ်စေ၊ MDX files တွေကို တခြား pages တွေထဲ import လုပ်ပြီး ဖြစ်စေ — render လုပ်နိုင်ပါတယ်။

### File based routing သုံးခြင်း

File based routing သုံးတဲ့အခါ — MDX pages တွေကို တခြား page တွေလိုပဲ သုံးနိုင်ပါတယ်။

App Router app တွေမှာ — [metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) တွေကိုပါ သုံးနိုင်တာ ပါဝင်ပါတယ်။

`/app` directory ထဲမှာ MDX page အသစ်တစ်ခု ဖန်တီးပါ:

```txt
  my-project
  ├── app
  │   └── mdx-page
  │       └── page.(mdx/md)
  |── mdx-components.(tsx/js)
  └── package.json
```

ဒီ files တွေထဲမှာ MDX ကို သုံးနိုင်ပြီး — သင့် MDX page ထဲမှာ တိုက်ရိုက် React components တွေကိုပါ import လုပ်နိုင်ပါတယ်:

```mdx
import { MyComponent } from 'my-component'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

`/mdx-page` route ကို သွားကြည့်ရင် — သင့် rendered MDX page ကို မြင်ရမှာ ဖြစ်ပါတယ်။

### Imports သုံးခြင်း

`/app` directory ထဲမှာ page အသစ်တစ်ခု ဖန်တီးပြီး — MDX file တစ်ခုကို သင်လိုချင်တဲ့ နေရာမှာ ထားပါ:

```txt
  .
  ├── app/
  │   └── mdx-page/
  │       └── page.(tsx/js)
  ├── markdown/
  │   └── welcome.(mdx/md)
  ├── mdx-components.(tsx/js)
  └── package.json
```

ဒီ files တွေထဲမှာ MDX ကို သုံးနိုင်ပြီး — သင့် MDX file ထဲမှာ တိုက်ရိုက် React components တွေကိုပါ import လုပ်နိုင်ပါတယ်:

```mdx filename="markdown/welcome.mdx"
import { MyComponent } from 'my-component'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

Content ကို ပြသဖို့ — page ထဲမှာ MDX file ကို import လုပ်ပါ:

```tsx filename="app/mdx-page/page.tsx"
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

```jsx filename="app/mdx-page/page.js"
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

`/mdx-page` route ကို သွားကြည့်ရင် — သင့် rendered MDX page ကို မြင်ရမှာ ဖြစ်ပါတယ်။

### Dynamic imports သုံးခြင်း

MDX files တွေအတွက် filesystem routing သုံးမယ့်အစား — dynamic MDX components တွေကိုလည်း import လုပ်နိုင်ပါတယ်။

ဥပမာ — သီးခြား directory တစ်ခုကနေ MDX components တွေကို load လုပ်တဲ့ dynamic route segment တစ်ခု ရှိနိုင်ပါတယ်:

*Dynamic MDX components တွေအတွက် route segments ပုံ — directory တစ်ခုစီမှာ ရှိတဲ့ MDX files တွေကို `app/blog/[slug]` လို dynamic segment က ဆွဲယူပါတယ်။*

[`generateStaticParams`](/docs/nextjs/generate-static-params) ကို သုံးပြီး ပေးထားတဲ့ routes တွေကို prerender လုပ်နိုင်ပါတယ်။ `dynamicParams` ကို `false` လို့ သတ်မှတ်ထားရင် — `generateStaticParams` ထဲမှာ မပါတဲ့ route တစ်ခုကို ဝင်ရောက်ကြည့်ရှုရင် 404 ပြန်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

```jsx filename="app/blog/[slug]/page.js"
export default async function Page({ params }) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

> **သိထားသင့်သည်**: Import လုပ်တဲ့နေရာမှာ `.mdx` file extension ကို သေချာ ထည့်ပါ။ [Module path aliases](https://nextjs.org/docs/app/getting-started/installation#set-up-absolute-imports-and-module-path-aliases) (ဥပမာ `@/content`) သုံးဖို့ မလိုအပ်ပေမယ့် — သုံးထားရင် သင့် import path တွေကို ရိုးရှင်းစေပါတယ်။

## Using custom styles and components (custom styles နဲ့ components သုံးခြင်း)

Markdown က render လုပ်တဲ့အခါ — native HTML elements တွေဆီ map လုပ်ပါတယ်။ ဥပမာ — အောက်ပါ markdown ကို ရေးလိုက်ရင်:

```md
## This is a heading

This is a list in markdown:

- One
- Two
- Three
```

အောက်ပါ HTML တွေ ထွက်လာပါတယ်:

```html
<h2>This is a heading</h2>

<p>This is a list in markdown:</p>

<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

သင့် markdown ကို style လုပ်ဖို့ — generated HTML elements တွေဆီ map လုပ်တဲ့ custom components တွေကို ထောက်ပံ့ပေးနိုင်ပါတယ်။ Styles နဲ့ components တွေကို — globally ဖြစ်စေ၊ locally ဖြစ်စေ၊ shared layouts တွေနဲ့ ဖြစ်စေ — အကောင်အထည်ဖော်နိုင်ပါတယ်။

### Global styles and components (global styles နဲ့ components)

`mdx-components.tsx` ထဲမှာ styles နဲ့ components တွေ ထည့်တာက သင့် application ထဲက MDX files **အားလုံးကို** သက်ရောက်မှု ရှိပါတယ်။

```tsx filename="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  // Allows customizing built-in components, e.g. to add styling.
  h1: ({ children }) => (
    <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js filename="mdx-components.js"
import Image from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  // Allows customizing built-in components, e.g. to add styling.
  h1: ({ children }) => (
    <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
  ),
  img: (props) => (
    <Image sizes="100vw" style={{ width: '100%', height: 'auto' }} {...props} />
  ),
}

export function useMDXComponents() {
  return components
}
```

### Local styles နဲ့ components

Imported MDX components တွေဆီ ဖြတ်ပြီး — သီးခြား pages တွေအတွက် local styles နဲ့ components တွေကို ထည့်နိုင်ပါတယ်။ ဒါတွေက [global styles နဲ့ components](#global-styles-and-components) တွေနဲ့ ပေါင်းစပ်ပြီး — သူတို့ကို override လုပ်ပါတယ်။

```tsx filename="app/mdx-page/page.tsx"
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

```jsx filename="app/mdx-page/page.js"
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

### Shared layouts

MDX pages တွေအနှံ့ layout တစ်ခု မျှဝေဖို့ — App Router ရဲ့ [built-in layouts support](/docs/nextjs/file-conventions-layout) ကို သုံးနိုင်ပါတယ်။

```tsx filename="app/mdx-page/layout.tsx"
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

```jsx filename="app/mdx-page/layout.js"
export default function MdxLayout({ children }) {
  // Create any shared layout or styles here
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

### Tailwind typography plugin သုံးခြင်း

သင့် application ကို style လုပ်ဖို့ [Tailwind](https://tailwindcss.com) သုံးနေတယ်ဆိုရင် — [`@tailwindcss/typography` plugin](https://tailwindcss.com/docs/plugins#typography) က သင့် markdown files တွေထဲမှာ Tailwind configuration နဲ့ styles တွေကို ပြန်သုံးနိုင်စေပါတယ်။

ဒီ plugin က markdown လို source တွေကနေ လာတဲ့ content blocks တွေဆီ typographic styles တွေ ထည့်ဖို့ သုံးတဲ့ `prose` classes အစုတစ်ခုကို ထည့်ပေးပါတယ်။

[Tailwind typography ကို တပ်ဆင်ပြီး](https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#installation) — သင်လိုချင်တဲ့ `prose` တွေထည့်ဖို့ [shared layouts](#shared-layouts) တွေနဲ့ တွဲသုံးပါ။

```tsx filename="app/mdx-page/layout.tsx"
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

```jsx filename="app/mdx-page/layout.js"
export default function MdxLayout({ children }) {
  // Create any shared layout or styles here
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  )
}
```

## Frontmatter

Frontmatter ဆိုတာ — page တစ်ခုအကြောင်း data တွေ သိမ်းဖို့ သုံးနိုင်တဲ့ YAML ပုံစံ key/value တွဲတွေပါ။ `@next/mdx` က default အားဖြင့် frontmatter ကို **မထောက်ပံ့ပါဘူး** — ဒါပေမယ့် သင့် MDX content တွေဆီ frontmatter ထည့်ဖို့ နည်းလမ်းတွေ အများကြီး ရှိပါတယ်၊ ဥပမာ:

- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
- [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

`@next/mdx` က တခြား JavaScript component တွေလိုပဲ exports တွေကို သုံးခွင့် **ပြုပါတယ်**:

```mdx filename="content/blog-post.mdx"
export const metadata = {
  author: 'John Doe',
}

# Blog post
```

အခု Metadata ကို MDX file ရဲ့ အပြင်ဘက်ကနေ ရည်ညွှန်း သုံးနိုင်ပါပြီ:

```tsx filename="app/blog/page.tsx"
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata: ', metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

```jsx filename="app/blog/page.js"
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata: ', metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

ဒီအတွက် အသုံးများတဲ့ case တစ်ခုကတော့ — MDX collection တစ်ခုကို iterate လုပ်ပြီး data တွေ ထုတ်ယူချင်တဲ့အခါမျိုးပါ။ ဥပမာ — blog posts အားလုံးကနေ blog index page တစ်ခု ဖန်တီးတာမျိုးပါ။ Posts တွေ ရှိတဲ့ directory တစ်ခုကို ဖတ်ပြီး metadata တွေ ထုတ်ယူဖို့ [Node ရဲ့ `fs` module](https://nodejs.org/api/fs.html) (သို့) [globby](https://www.npmjs.com/package/globby) လို packages တွေကို သုံးနိုင်ပါတယ်။

> **သိထားသင့်သည်**:
>
> - `fs`, `globby` စတာတွေကို server-side မှာပဲ သုံးလို့ရပါတယ်။
> - အပြည့်အစုံ အလုပ်လုပ်တဲ့ ဥပမာတစ်ခုအတွက် [Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit) template ကို ကြည့်ပါ။

## Remark နဲ့ Rehype Plugins

MDX content တွေကို transform လုပ်ဖို့ remark နဲ့ rehype plugins တွေကို optional အနေနဲ့ ထောက်ပံ့ပေးနိုင်ပါတယ်။

ဥပမာ — GitHub Flavored Markdown ကို ထောက်ပံ့ဖို့ [`remark-gfm`](https://github.com/remarkjs/remark-gfm) ကို သုံးနိုင်ပါတယ်။

Remark နဲ့ rehype ecosystem တွေက ESM only ဖြစ်လို့ — configuration file အဖြစ် `next.config.mjs` (သို့) `next.config.ts` ကို သုံးရပါမယ်။

```js filename="next.config.mjs"
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .mdx extensions for files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// Combine MDX and Next.js config
export default withMDX(nextConfig)
```

### Turbopack နဲ့ Plugins သုံးခြင်း

[Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) နဲ့ plugins တွေ သုံးဖို့ — နောက်ဆုံး `@next/mdx` ဆီ upgrade လုပ်ပြီး plugin names တွေကို string အနေနဲ့ သတ်မှတ်ပါ:

```js filename="next.config.mjs"
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Without options
      'remark-gfm',
      // With options
      ['remark-toc', { heading: 'The Table' }],
    ],
    rehypePlugins: [
      // Without options
      'rehype-slug',
      // With options
      ['rehype-katex', { strict: true, throwOnError: true }],
    ],
  },
})

export default withMDX(nextConfig)
```

> **သိထားသင့်သည်**:
>
> Serializable options မပါတဲ့ remark နဲ့ rehype plugins တွေကို [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) နဲ့တော့ အသုံးပြုလို့ မရသေးပါဘူး — အကြောင်းကတော့ JavaScript functions တွေကို Rust ဆီ ပို့လို့ မရလို့ပါ။

## နက်ရှိုင်းစွာ လေ့လာခြင်း: Markdown ကို HTML အဖြစ် ဘယ်လို ပြောင်းလဲသလဲ?

React က markdown ကို native အနေနဲ့ နားမလည်ပါဘူး။ Markdown plaintext ကို အရင် HTML အဖြစ် ပြောင်းလဲဖို့ လိုပါတယ်။ ဒါကို `remark` နဲ့ `rehype` တွေနဲ့ လုပ်ဆောင်နိုင်ပါတယ်။

`remark` ဆိုတာ markdown ပတ်ဝန်းကျင်မှာ အလုပ်လုပ်တဲ့ tools တွေရဲ့ ecosystem တစ်ခုပါ။ `rehype` ကတော့ HTML အတွက် အလားတူပါ။ ဥပမာ — အောက်ပါ code snippet က markdown ကို HTML အဖြစ် ပြောင်းလဲပေးပါတယ်:

```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeStringify) // Convert AST into serialized HTML
    .process('Hello, Next.js!')

  console.log(String(file)) // <p>Hello, Next.js!</p>
}
```

`remark` နဲ့ `rehype` ecosystem တွေထဲမှာ [syntax highlighting](https://github.com/atomiks/rehype-pretty-code), [linking headings](https://github.com/rehypejs/rehype-autolink-headings), [table of contents ထုတ်လုပ်ခြင်း](https://github.com/remarkjs/remark-toc) စတဲ့ plugins တွေ ပါဝင်ပါတယ်။

အထက်မှာ ပြထားတဲ့အတိုင်း `@next/mdx` သုံးတဲ့အခါ — remark (သို့) rehype တွေကို တိုက်ရိုက် သုံးစရာ **မလိုပါဘူး**၊ သူ့အတွက် ကိုင်တွယ်ပြီးသားမို့ပါ။ `@next/mdx` package က အောက်ခြေမှာ ဘာတွေ လုပ်နေလဲ ပိုနားလည်ဖို့ ဒီမှာ ဖော်ပြလိုက်တာပါ။

## Rust-based MDX compiler သုံးခြင်း (experimental)

Next.js က Rust နဲ့ ရေးထားတဲ့ MDX compiler အသစ်တစ်ခုကို ထောက်ပံ့ပါတယ်။ ဒီ compiler က experimental အဆင့်မှာ ရှိနေသေးပြီး — production အတွက် အကြံပြုမထားပါဘူး။ Compiler အသစ် သုံးဖို့ — `withMDX` ဆီ ပေးတဲ့ `next.config.js` ထဲမှာ configure လုပ်ရပါတယ်:

```js filename="next.config.js"
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```

`mdxRs` က mdx files တွေကို ဘယ်လို transform လုပ်မလဲ configure လုပ်ဖို့ object တစ်ခုကိုလည်း လက်ခံပါတယ်။

```js filename="next.config.js"
module.exports = withMDX({
  experimental: {
    mdxRs: {
      jsxRuntime?: string            // Custom jsx runtime
      jsxImportSource?: string       // Custom jsx import source,
      providerImportSource?: string  // Module providing a `useMDXComponents` context
      mdxType?: 'gfm' | 'commonmark' // Configure what kind of mdx syntax will be used to parse & transform
    },
  },
})
```

## အသုံးဝင်တဲ့ လင့်များ

- [MDX](https://mdxjs.com)
- [`@next/mdx`](https://www.npmjs.com/package/@next/mdx)
- [remark](https://github.com/remarkjs/remark)
- [rehype](https://github.com/rehypejs/rehype)
- [Markdoc](https://markdoc.dev/docs/nextjs)
