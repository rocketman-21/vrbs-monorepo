import { SVGProps } from "react";

const SvgMessageMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h18v16H6v2H4v-2h2v-2h14V4H4v18H2V2h2Zm12 7H8v2h8V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageMinus;
