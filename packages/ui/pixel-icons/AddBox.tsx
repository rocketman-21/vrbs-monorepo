import { SVGProps } from "react";

const SvgAddBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 16V5H5v14h14Zm-6-8h4v2h-4v4h-2v-4H7v-2h4V7h2v4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddBox;
