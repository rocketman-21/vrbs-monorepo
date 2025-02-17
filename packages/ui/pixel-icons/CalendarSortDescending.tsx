import { SVGProps } from "react";

const SvgCalendarSortDescending = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 5H8v2H4V5H2v2H0v12h12V7h-2V5ZM2 9h8v2H2V9Zm0 8v-4h8v4H2Zm18 2h-2v-8h-2V9h2V7h2v2h2v2h-2v8Zm2-8v2h2v-2h-2Zm-6 0v2h-2v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarSortDescending;
