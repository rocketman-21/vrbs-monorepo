import { SVGProps } from "react";

const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 5v2h-2V5h2Zm-4 4V7h2v2h-2Zm-2 2V9h2v2h-2Zm0 2H8v-2h2v2Zm2 2v-2h-2v2h2Zm0 0h2v2h-2v-2Zm4 4v-2h-2v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronLeft;
