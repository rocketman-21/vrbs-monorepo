import { SVGProps } from "react";

const SvgLogout = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3h16v4h-2V5H5v14h14v-2h2v4H3V3h2Zm16 8h-2V9h-2V7h-2v2h2v2H7v2h10v2h-2v2h2v-2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLogout;
