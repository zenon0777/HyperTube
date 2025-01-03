import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const PraiseRegular = localFont({
  src: "./fonts/Praise-Regular.ttf",
  variable: "--font-praise-regular",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Z-Tube",
  description: "A video streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${PraiseRegular.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}