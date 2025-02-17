import { SVGProps } from "react";

const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 5v2h2V5H8Zm4 4V7h-2v2h2Zm2 2V9h-2v2h2Zm0 2h2v-2h-2v2Zm-2 2v-2h2v2h-2Zm0 0h-2v2h2v-2Zm-4 4v-2h2v2H8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronRight;
