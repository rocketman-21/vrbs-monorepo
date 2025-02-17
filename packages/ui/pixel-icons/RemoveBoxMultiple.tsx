import { SVGProps } from "react";

const SvgRemoveBoxMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v14h14V3H5Zm10 2v10H5V5h10Zm4 2v12H7v2h14V7h-2Zm-6 2H7v2h6V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgRemoveBoxMultiple;
