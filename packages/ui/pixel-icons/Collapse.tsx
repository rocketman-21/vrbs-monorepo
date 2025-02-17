import { SVGProps } from "react";

const SvgCollapse = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 3h-2v2h-2v2h-2V5H9V3H7v2h2v2h2v2h2V7h2V5h2V3ZM4 13h16v-2H4v2Zm9 4h-2v-2h2v2Zm2 2h-2v-2h2v2Zm0 0h2v2h-2v-2Zm-6 0h2v-2H9v2Zm0 0H7v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCollapse;
