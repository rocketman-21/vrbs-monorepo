import { SVGProps } from "react";

const SvgCardStack = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h18v12H2V4h2Zm16 10V6H4v8h16Zm2 4H2v2h20v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCardStack;
