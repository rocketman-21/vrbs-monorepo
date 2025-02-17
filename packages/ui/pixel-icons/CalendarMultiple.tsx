import { SVGProps } from "react";

const SvgCalendarMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 2h2v2h4v14H5V4h4V2h2v2h6V2Zm-6 4H7v2h14V6H11Zm-4 4v6h14v-6H7ZM3 20h16v2H1V8h2v12Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarMultiple;
