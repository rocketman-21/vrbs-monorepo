import { SVGProps } from "react";

const SvgCalendarMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 2h-2v2H9V2H7v2H3v18h18V4h-4V2ZM7 6h12v2H5V6h2ZM5 20V10h14v10H5Zm10-6H9v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarMinus;
