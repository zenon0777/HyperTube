import { Metadata } from "next";
import type React from "react";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "HyperTube",
  description: "HyperTube is a movie streaming platform.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const res = await params;
  const locale = res.locale;
  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
          font-inter
          `}
      >
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
