import { pageMetadata, SITE } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const metadata = pageMetadata({
  title: "Start your Else trial",
  description:
    "14-day free trial. Daily curiosity quests for families by text — $9.99/mo after. Text HELLO to begin.",
  path: "/start",
  ogTitle: "Start your 14-day Else trial",
});

export const alt = "Start your Else trial — daily curiosity quests by text";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "14-day free trial",
    title: "Start your morning ritual.",
    subtitle: "Daily curiosity quests by text. Text HELLO to begin.",
  });
}
