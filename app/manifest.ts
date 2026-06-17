import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: SITE.backgroundColor,
    theme_color: SITE.themeColor,
    lang: "en",
    orientation: "portrait",
    categories: ["education", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
