import { SVGProps } from "react";

const SvgFrameCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V7H4v12h16Zm-4-9h-2v2h-2v2h-2v-2H8v2h2v2h2v-2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFrameCheck;
