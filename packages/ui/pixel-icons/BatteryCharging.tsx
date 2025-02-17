import { SVGProps } from "react";

const SvgBatteryCharging = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5H2v14h6v-2H4V7h4V5H4Zm10 0h6v4h2v6h-2v4h-6v-2h4V7h-4V5Zm-4 2h2v4h4v2h-2v2h-2v2h-2v-4H6v-2h2V9h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBatteryCharging;
