import { SVGProps } from "react";

const SvgBattery = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5H2v14h18v-4h2V9h-2V5H4Zm14 2v10H4V7h14Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBattery;
