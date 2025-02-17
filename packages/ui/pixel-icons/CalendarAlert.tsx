import { SVGProps } from "react";

const SvgCalendarAlert = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 5V4H5v2H3v14h14V6h-2V4h-2v2H7V5Zm-2 5V8h10v2H5Zm0 2h10v6H5v-6Zm16-3V8h-2v6h2V9Zm0 6h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarAlert;
