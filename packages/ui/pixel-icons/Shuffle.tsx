import { SVGProps } from "react";

const SvgShuffle = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 5h-2v2h2v2h-6v2h-2v6H2v2h8v-2h2v-6h6v2h-2v2h2v-2h2v-2h2V9h-2V7h-2V5ZM2 9h6v2H2V9Zm20 10v-2h-8v2h8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgShuffle;
