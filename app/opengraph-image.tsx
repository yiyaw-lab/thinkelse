import { SITE } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = `${SITE.name} — daily curiosity quests for families by text`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "One question. One quest. Each morning.",
    subtitle: SITE.description,
  });
}
