import { SVGProps } from "react";

const SvgCalendarArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 2h-2v2H9V2H7v2H3v8h2v-2h14v10h-8v2h10V4h-4V2Zm2 6H5V6h14v2Zm-6 8H7v-2h2v-2H7v2H5v2H3v2h2v2h2v2h2v-2H7v-2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarArrowLeft;
