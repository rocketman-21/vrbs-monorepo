import { SVGProps } from "react";

const SvgCalendarMultipleCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 2h2v2h4v10h-2v-4H7v6h6v2H5V4h4V2h2v2h6V2Zm-6 4H7v2h14V6H11Zm2 14v2H1V8h2v12h10Zm2-2h2v2h-2v-2Zm4 2v2h-2v-2h2Zm2-2h-2v2h2v-2Zm0 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarMultipleCheck;
