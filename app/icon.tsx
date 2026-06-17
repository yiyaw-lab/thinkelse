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

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #d4c4ff, #b8a6f5)",
          borderRadius: 8,
        }}
      >
        <SparkMark size={18} />
      </div>
    ),
    size,
  );
}
