import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

const PUBLIC_PATHS = ["/", "/start", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: path === "/" ? SITE.url : `${SITE.url}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/start" ? 0.9 : 0.4,
  }));
}
