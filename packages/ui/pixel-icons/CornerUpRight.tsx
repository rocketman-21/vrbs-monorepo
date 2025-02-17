import { SVGProps } from "react";

const SvgCornerUpRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 8h10V6h2v2h2v2h-2v2h-2v-2H6v10H4V8h2Zm10 4v2h-2v-2h2Zm0-6V4h-2v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerUpRight;
