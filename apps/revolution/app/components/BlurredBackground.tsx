interface Props {
  x?: string;
  y?: string;
  opacity?: number;
}

export const BlurredBackground = (props: Props) => {
  const { x = 0, y = 0, opacity = 1 } = props;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex max-w-full select-none items-center justify-center"
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 800 600"
        opacity="0.25"
        className="shrink-0"
        style={x || y ? { transform: `translate(${x},${y})` } : undefined}
      >
        <filter
          id="a"
          colorInterpolationFilters="sRGB"
          height="400%"
          width="400%"
          x="-100%"
          y="-100%"
        >
          <feGaussianBlur
            edgeMode="none"
            height="100%"
            in="SourceGraphic"
            result="blur"
            stdDeviation="80"
            width="100%"
            x="0%"
            y="0%"
          />
        </filter>
        <g filter="url(#a)">
          <ellipse cx="509.250011" cy="243.502862" className="fill-lead-500" rx="84.5" ry="85" />
          <ellipse cx="371.885376" cy="253.516761" className="fill-lead-300" rx="84.5" ry="85" />
          <ellipse cx="276.264103" cy="253.038775" className="fill-lead-400" rx="84.5" ry="85" />
        </g>
      </svg>
    </div>
  );
};
