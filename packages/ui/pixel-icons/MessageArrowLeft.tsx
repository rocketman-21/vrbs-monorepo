import { SVGProps } from "react";

const SvgMessageArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h18v12h-2V4H4v18H2V2h2Zm2 14h4v2H6v2H4v-2h2v-2Zm16 0h-6v-2h2v-2h-2v2h-2v2h-2v2h2v2h2v2h2v-2h-2v-2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageArrowLeft;
