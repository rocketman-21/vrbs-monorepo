import { SVGProps } from "react";

const SvgCalendarCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2h2v2h4v18H3V4h4V2h2v2h6V2Zm4 6V6H5v2h14Zm0 2H5v10h14V10Zm-3 2v2h-2v-2h2Zm-4 4v-2h2v2h-2Zm-2 0h2v2h-2v-2Zm0 0H8v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarCheck;
