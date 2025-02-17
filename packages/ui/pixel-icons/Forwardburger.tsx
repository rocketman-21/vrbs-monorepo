import { SVGProps } from "react";

const SvgForwardburger = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 7H3v2h10V7Zm8 4h-2V9h-2V7h-2v2h2v2H3v2h14v2h-2v2h2v-2h2v-2h2v-2ZM3 15h10v2H3v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgForwardburger;
