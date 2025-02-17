import { SVGProps } from "react";

const SvgTextWrap = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 5H3v2h16v6h-6v-2h2V9h-2v2h-2v2H9v2h2v2h2v2h2v-2h-2v-2h6v-2h2V7h-2V5ZM7 13H3v2h4v-2ZM3 9h6v2H3V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTextWrap;
