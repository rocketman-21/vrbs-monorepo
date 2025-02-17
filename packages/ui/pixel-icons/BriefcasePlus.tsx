import { SVGProps } from "react";

const SvgBriefcasePlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3h8v4h6v4h-2V9H4v10h8v2H2V7h6V3Zm2 4h4V5h-4v2Zm7 14h2v-3h3v-2h-3v-3h-2v3h-3v2h3v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBriefcasePlus;
