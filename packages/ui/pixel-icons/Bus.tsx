import { SVGProps } from "react";

const SvgBus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2h14v2H5V2Zm0 2v6h14V4h2v16h-2v2h-4v-2H9v2H5v-2H3V4h2Zm0 14h14v-6H5v6Zm2-4h2v2H7v-2Zm10 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBus;
