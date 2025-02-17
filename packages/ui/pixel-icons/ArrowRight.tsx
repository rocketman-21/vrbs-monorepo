import { SVGProps } from "react";

const SvgArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4Zm10-4h2v2h-2V7Zm0 0h-2V5h2v2Zm0 10h2v-2h-2v2Zm0 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowRight;
