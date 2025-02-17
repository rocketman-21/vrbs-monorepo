import { SVGProps } from "react";

const SvgGamepad = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h20v14H2V5Zm18 12V7H4v10h16ZM8 9h2v2h2v2h-2v2H8v-2H6v-2h2V9Zm6 0h2v2h-2V9Zm4 4h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGamepad;
