import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png";

type OgImageProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
};

function SparkMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.6 4.9H19l-4 2.9 1.6 4.9L12 12.1 7.4 14.7 9 9.9 5 7.1h5.4L12 2z"
        fill="#5e5391"
      />
    </svg>
  );
}

export function OgImage({ eyebrow = "Curiosity by text", title, subtitle }: OgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "radial-gradient(ellipse 90% 70% at 0% 0%, #e8deff 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 100% 0%, #d4f5e9 0%, transparent 50%), #faf8ff",
        color: "#334558",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "linear-gradient(135deg, #d4c4ff, #b8a6f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SparkMark size={28} />
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
        <div
          style={{
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8b7ad4",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.35,
            fontFamily: "system-ui, sans-serif",
            color: "#7a8490",
            maxWidth: 820,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
          fontSize: 22,
          color: "#7a8490",
        }}
      >
        <span>{SITE.tagline}</span>
        <span style={{ color: "#8b7ad4", fontWeight: 600 }}>elsey.app</span>
      </div>
    </div>
  );
}

export function renderOgImage(props: OgImageProps) {
  return new ImageResponse(<OgImage {...props} />, OG_SIZE);
}
