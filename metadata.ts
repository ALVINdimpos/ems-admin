import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "EMS - Event Management System",
    template: "%s | EMS",
  },
  description:
    "Event Management System - The premier platform for event solutions. From accreditation to analytics, we empower global event organizers.",
  applicationName: "EMS",
  keywords: ["event", "management", "system", "EMS", "Next.js", "React"],
  authors: [{ name: "EMS Team" }],
  creator: "EMS Team",
  metadataBase: new URL("https://ems.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ems.com",
    title: "EMS - Event Management System",
    description:
      "Event Management System - The premier platform for event solutions. From accreditation to analytics, we empower global event organizers.",
    siteName: "EMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMS - Event Management System",
    description:
      "Event Management System -  The premier platform for event solutions. From accreditation to analytics, we empower global event organizers.",
    site: "https://ems.com",
    images: [
      {
        url: "https://ems.com/favicon.ico",
        width: 1200,
        height: 630,
        alt: "EMS - Event Management System",
      },
    ],
  },
};
