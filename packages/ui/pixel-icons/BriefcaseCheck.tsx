import { SVGProps } from "react";

const SvgBriefcaseCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 3H8v4H2v14h20V7h-6V3Zm-2 4h-4V5h4v2ZM4 19V9h16v10H4Zm10-8h2v2h-2v-2Zm-2 4v-2h2v2h-2Zm-2 0h2v2h-2v-2Zm0 0H8v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBriefcaseCheck;
