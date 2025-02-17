import { SVGProps } from "react";

const SvgFlag = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2h10v2h8v14H11v-2H5v6H3V2Zm2 12h8v2h6V6h-8V4H5v10Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFlag;
