import { SVGProps } from "react";

const SvgSwitch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5V3h2v2H3Zm4 2H5V5h2v2Zm2 2H7V7h2v2Zm2 2H9V9h2v2Zm2 0h-2v2h2v2h2v2h2v2h-2v2h6v-6h-2v2h-2v-2h-2v-2h-2v-2Zm2-2v2h-2V9h2Zm2-2v2h-2V7h2Zm0-2v2h2v2h2V3h-6v2h2ZM5 19v-2h2v2H5Zm0 0v2H3v-2h2Zm2-2v-2h2v2H7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSwitch;
