import { SVGProps } from "react";

const SvgArrowDownBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 16V5H5v14h14ZM11 7h2v6h2v2h-2v2h-2v-2H9v-2h2V7Zm-2 4v2H7v-2h2Zm8 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowDownBox;
