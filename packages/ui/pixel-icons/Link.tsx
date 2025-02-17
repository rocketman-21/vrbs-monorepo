import { SVGProps } from "react";

const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6h7v2H4v8h7v2H2V6h2Zm16 0h-7v2h7v8h-7v2h9V6h-2Zm-3 5H7v2h10v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLink;
