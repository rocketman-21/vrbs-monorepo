import { SVGProps } from "react";

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 5h2v2H5V5Zm4 4H7V7h2v2Zm2 2H9V9h2v2Zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2Zm2-2v2h-2V9h2Zm2-2v2h-2V7h2Zm0 0V5h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClose;
