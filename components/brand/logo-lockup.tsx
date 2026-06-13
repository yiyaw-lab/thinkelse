import { LogoMark } from "./logo-mark";

type LogoLockupProps = {
  className?: string;
  markSize?: number;
  showWordmark?: boolean;
  showSpark?: boolean;
  /** Light text for dark backgrounds */
  inverted?: boolean;
};

export function LogoLockup({
  className = "",
  markSize = 28,
  showWordmark = true,
  showSpark = true,
  inverted = false,
}: LogoLockupProps) {
  const textClass = inverted ? "text-cream-50" : "text-ink-800";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {showSpark && <LogoMark size={markSize} />}
      {showWordmark && (
        <span
          className={`font-display text-xl font-semibold tracking-tight ${textClass}`}
        >
          Else
        </span>
      )}
    </span>
  );
}
