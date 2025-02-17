import { SVGProps } from "react";

const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2h2v2h4v18H3V4h4V2h2v2h6V2ZM5 8h14V6H5v2Zm0 2v10h14V10H5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendar;
