import { SVGProps } from "react";

const SvgGift = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M19 12v8h-7m7-8h2V8h-3m1 4H5m13-4V4h-6m6 4H6m0 0V4h6M6 8H3v4h2m0 0v8h7m0 0V4"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

export default SvgGift;
