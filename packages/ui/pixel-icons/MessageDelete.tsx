import { SVGProps } from "react";

const SvgMessageDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h18v16H6v2H4v-2h2v-2h14V4H4v18H2V2h2Zm9 7h-2V7H9v2h2v2H9v2h2v-2h2v2h2v-2h-2V9Zm0 0V7h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMessageDelete;
