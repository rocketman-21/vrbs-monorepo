import { SVGProps } from "react";

const SvgArrowRightBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 21V3h18v18H3ZM19 5H5v14h14V5ZM7 13v-2h6V9h2v2h2v2h-2v2h-2v-2H7Zm4 2h2v2h-2v-2Zm0-8v2h2V7h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowRightBox;
