import { SVGProps } from "react";

const SvgBatteryFull = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 5H2v14h18v-4h2V9h-2V5h-2Zm0 2v10H4V7h14ZM8 9H6v6h2V9Zm2 0h2v6h-2V9Zm6 0h-2v6h2V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBatteryFull;
