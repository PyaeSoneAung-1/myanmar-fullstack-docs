import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ThemeInit from "@/components/ThemeInit";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://myanmar-fullstack-docs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Myanmar Fullstack Docs — မြန်မာလို Fullstack JavaScript Documentation",
    template: "%s | Myanmar Fullstack Docs",
  },
  description:
    "React, Next.js, Node.js, Express, PostgreSQL, Prisma, TypeScript, useSWR, TanStack Query, Zustand, Postman — နည်းပညာ documentation အားလုံးကို မြန်မာဘာသာဖြင့်။",
  openGraph: {
    type: "website",
    siteName: "Myanmar Fullstack Docs",
    locale: "my_MM",
    url: SITE_URL,
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-ink-100 dark:border-ink-800 py-8 text-center text-sm text-ink-500 dark:text-ink-400">
          <p lang="my">
            မူရင်း documentation များမှ ဘာသာပြန်ထားပါသည် — official docs များကို အခြေခံသည်။
          </p>
          <p className="mt-1 text-xs">
            All content is translated from the official documentation of the respective
            open-source projects.
          </p>
        </footer>
      </body>
    </html>
  );
}
