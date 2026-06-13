"use client";

import { useId } from "react";

type ElsyAvatarProps = {
  size?: number;
  className?: string;
};

/** Round-face Elsy badge for contact photos and avatars. */
export function ElsyAvatar({ size = 40, className = "" }: ElsyAvatarProps) {
  const uid = useId().replace(/:/g, "");
  const bgGrad = `elsy-av-bg-${uid}`;
  const faceGrad = `elsy-av-face-${uid}`;

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-pool-blue/20 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Elsy"
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="24" cy="24" r="24" fill={`url(#${bgGrad})`} />

        <circle cx="24" cy="26" r="14.5" fill={`url(#${faceGrad})`} />
        <ellipse cx="24" cy="24" rx="10" ry="9" fill="#fff" fillOpacity="0.14" />

        <ellipse cx="17.5" cy="28" rx="2.8" ry="1.8" fill="#f0b8d8" fillOpacity="0.55" />
        <ellipse cx="30.5" cy="28" rx="2.8" ry="1.8" fill="#f0b8d8" fillOpacity="0.55" />

        <circle cx="19.5" cy="25" r="2.3" fill="#3d3558" />
        <circle cx="28.5" cy="25" r="2.3" fill="#3d3558" />
        <circle cx="18.8" cy="24.2" r="0.7" fill="#fff" />
        <circle cx="27.8" cy="24.2" r="0.7" fill="#fff" />

        <path
          d="M20.5 30.5C21.8 31.5 26.2 31.5 27.5 30.5"
          stroke="#3d3558"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        <path
          d="M24 9.5C24.4 11.8 26.2 13 24 15.2C21.8 13 23.6 11.8 24 9.5Z"
          fill="#f8e9b8"
        />

        <defs>
          <radialGradient id={bgGrad} cx="24" cy="20" r="26">
            <stop stopColor="#f7f2ff" />
            <stop offset="1" stopColor="#e8deff" />
          </radialGradient>
          <radialGradient id={faceGrad} cx="24" cy="22" r="15">
            <stop stopColor="#f3ecff" />
            <stop offset="0.6" stopColor="#c9b8ff" />
            <stop offset="1" stopColor="#b0a0f0" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
}
