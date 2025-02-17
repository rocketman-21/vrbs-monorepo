import { SVGProps } from "react";

const SvgCalendarSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2h2v2h4v8h-2v-2H5v10h6v2H3V4h4V2h2v2h6V2ZM9 6H5v2h14V6H9Zm8 6v2h-4v-2h4Zm-4 6h-2v-4h2v4Zm4 0h-4v2h6v2h2v-2h-2v-6h-2v4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalendarSearch;
