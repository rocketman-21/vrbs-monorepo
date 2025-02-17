import { SVGProps } from "react";

const SvgArrowUpBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 21h18V3H3v18ZM19 5v14H5V5h14Zm-8 12h2v-6h2V9h-2V7h-2v2H9v2h2v6Zm-2-4v-2H7v2h2Zm8 0h-2v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowUpBox;
