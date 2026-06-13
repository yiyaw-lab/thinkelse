type MarqueeStripProps = {
  items: string[];
};

export function MarqueeStrip({ items }: MarqueeStripProps) {
  const track = [...items, ...items];

  return (
    <div
      className="pool-marquee border-y border-pool-line overflow-hidden bg-white py-4"
      aria-hidden
    >
      <div className="pool-marquee-track">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="pool-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
