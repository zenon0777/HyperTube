"use client";
import { NextIntlClientProvider } from "next-intl";

export default function ClientIntlProvider({ locale, messages, children }: { locale: string, messages: Record<string, unknown>, children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
