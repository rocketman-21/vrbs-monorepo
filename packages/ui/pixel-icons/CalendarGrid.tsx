import { SVGProps } from "react";

const SvgCalendarGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm2 2v2h14V5H5Zm14 4h-6v2h6V9Zm0 4h-6v2h6v-2Zm0 4h-6v2h6v-2Zm-8 2v-2H5v2h6Zm-6-4h6v-2H5v2Zm0-4h6V9H5v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarGrid;
