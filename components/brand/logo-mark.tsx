type LogoMarkProps = {
  className?: string;
  size?: number;
};

/** Spark mark — tiny 4-point star for avatars and favicon slots. */
export function LogoMark({ className = "", size = 32 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 2C17 10 22 15 30 16C22 17 17 22 16 30C15 22 10 17 2 16C10 15 15 10 16 2Z"
        fill="url(#spark-grad)"
      />
      <defs>
        <linearGradient id="spark-grad" x1="2" y1="2" x2="30" y2="30">
          <stop stopColor="var(--star-300)" />
          <stop offset="0.5" stopColor="var(--peach-300)" />
          <stop offset="1" stopColor="var(--blush-400)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
