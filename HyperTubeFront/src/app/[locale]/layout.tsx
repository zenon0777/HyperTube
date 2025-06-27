import { Metadata } from "next";
import type React from "react";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


const notosansarabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto",
});

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
    <html
      lang={locale}
      className={`${inter.variable} ${notosansarabic.variable}`}
    >
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notosansarabic.variable
          } font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
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
