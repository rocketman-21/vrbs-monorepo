import { SVGProps } from "react";

const SvgArrowsHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 9V7h2v2h-2Zm2 6v-2h-4v-2h4V9h2v2h2v2h-2v2h-2Zm0 0v2h-2v-2h2Zm-6-4v2H7v2H5v-2H3v-2h2V9h2v2h4Zm-4 4h2v2H7v-2Zm2-8v2H7V7h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowsHorizontal;
