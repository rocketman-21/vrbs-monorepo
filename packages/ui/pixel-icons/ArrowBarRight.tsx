import { SVGProps } from "react";

const SvgArrowBarRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 4v16h2V4h-2ZM4 11v2h8v2h-2v2h2v-2h2v-2h2v-2h-2V9h-2V7h-2v2h2v2H4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowBarRight;
