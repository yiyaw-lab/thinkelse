import type { Metadata } from "next";

export const SITE = {
  name: "Else",
  legalName: "Else",
  url: "https://elsey.app",
  tagline: "Curiosity changes everything",
  title: "Else — One question. One quest. Each morning.",
  description:
    "Raising thoughtful kids in the AI age. Daily curiosity quests by text — no app, no kid account. Text HELLO to start.",
  locale: "en_US",
  email: "hello@elsey.app",
  themeColor: "#b8a6f5",
  backgroundColor: "#faf8ff",
} as const;

type PageMeta = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  ogTitle?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
}: PageMeta): Metadata {
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: ogTitle ?? title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  keywords: [
    "family",
    "curiosity",
    "kids",
    "parenting",
    "SMS",
    "education",
    "questions",
    "quests",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  other: {
    "apple-mobile-web-app-title": SITE.name,
    "mobile-web-app-capable": "yes",
  },
};
