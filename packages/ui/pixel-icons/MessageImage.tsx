import { SVGProps } from "react";

const SvgMessageImage = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h18v16H6v2H4v-2h2v-2h14V4H4v18H2V2h2Zm10 4h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2V8h2v2h2v2h2v-2h-2V8h-2V6ZM6 6h2v2H6V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageImage;
