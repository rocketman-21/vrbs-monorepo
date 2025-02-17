import { SVGProps } from "react";

const SvgFrameAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V7H4v12h16Zm-7-7h3v2h-3v3h-2v-3H8v-2h3V9h2v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFrameAdd;
