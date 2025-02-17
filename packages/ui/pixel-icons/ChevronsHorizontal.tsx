import { SVGProps } from "react";

const SvgChevronsHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 9V7h2v2H8Zm-2 2V9h2v2H6Zm0 2H4v-2h2v2Zm2 2v-2H6v2h2Zm0 0h2v2H8v-2Zm8-6V7h-2v2h2Zm2 2V9h-2v2h2Zm0 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 0v2h-2v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronsHorizontal;
