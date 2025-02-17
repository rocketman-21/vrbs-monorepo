import { SVGProps } from "react";

const SvgBookOpen = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h8v2H3v12h8V5h2v12h8V5h-8V3h10v16H13v2h-2v-2H1V3h2Zm16 7h-4v2h4v-2Zm-4-3h4v2h-4V7Zm2 6h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBookOpen;
