import { ImageResponse } from "next/og";

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

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, #f0ebff 0%, #faf8ff 40%, #e8deff 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            background: "linear-gradient(135deg, #e8deff, #c9b8ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SparkMark size={52} />
        </div>
      </div>
    ),
    size,
  );
}
