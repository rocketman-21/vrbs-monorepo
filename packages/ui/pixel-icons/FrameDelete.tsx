import { SVGProps } from "react";

const SvgFrameDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V7H4v12h16ZM9 10h2v2H9v-2Zm4 2h-2v2H9v2h2v-2h2v2h2v-2h-2v-2Zm0 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFrameDelete;
