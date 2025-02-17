import { SVGProps } from "react";

const SvgCornerDownLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 16H8v2H6v-2H4v-2h2v-2h2v2h10V4h2v12h-2ZM8 12v-2h2v2H8Zm0 6v2h2v-2H8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerDownLeft;
