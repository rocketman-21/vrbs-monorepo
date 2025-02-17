import { SVGProps } from "react";

const SvgFrameMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V7H4v12h16ZM8 12h8v2H8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFrameMinus;
