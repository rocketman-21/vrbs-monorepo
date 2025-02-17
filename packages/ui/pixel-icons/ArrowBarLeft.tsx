import { SVGProps } from "react";

const SvgArrowBarLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4v16H4V4h2Zm14 7v2h-8v2h-2v-2H8v-2h2V9h2v2h8Zm-8-2V7h2v2h-2Zm0 6h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowBarLeft;
