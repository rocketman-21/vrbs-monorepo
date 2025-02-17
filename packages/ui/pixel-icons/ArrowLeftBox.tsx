import { SVGProps } from "react";

const SvgArrowLeftBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3v18H3V3h18ZM5 19h14V5H5v14Zm12-8v2h-6v2H9v-2H7v-2h2V9h2v2h6Zm-4-2h-2V7h2v2Zm0 8v-2h-2v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowLeftBox;
