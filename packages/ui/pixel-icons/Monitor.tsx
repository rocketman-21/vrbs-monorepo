import { SVGProps } from "react";

const SvgMonitor = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 3H2v14h8v2H8v2h8v-2h-2v-2h8V3h-2Zm-6 12H4V5h16v10h-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMonitor;
