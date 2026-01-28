import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { LocaleProvider } from "@/providers/LocaleProvider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | EMS - Event Management System",
    default: "EMS | Event Management System",
  },
  description: "Event Management System",
  metadataBase: new URL("https://www.qtglobal.rw/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
