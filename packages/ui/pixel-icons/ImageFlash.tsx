import { SVGProps } from "react";

const SvgImageFlash = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 0h2v4h4v2h-2v2h-2v2h-2V6h-4V4h2V2h2V0ZM4 3h8v2H4v14h16v-7h2v9H2V3h2Zm10 6h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2V9ZM8 7H6v2h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageFlash;
