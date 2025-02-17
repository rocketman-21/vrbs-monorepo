import { SVGProps } from "react";

const SvgBriefcase = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3h8v4h6v14H2V7h6V3Zm2 4h4V5h-4v2ZM4 9v10h16V9H4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBriefcase;
