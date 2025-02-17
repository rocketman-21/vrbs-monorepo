import { SVGProps } from "react";

const SvgHumanHeight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2h4v4H6V2ZM3 7h10v9h-2v6H9v-6H7v6H5v-6H3V7Zm18-4h-6v2h6V3Zm-4 4h4v2h-4V7Zm4 4h-6v2h6v-2Zm-6 8h6v2h-6v-2Zm6-4h-4v2h4v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHumanHeight;
