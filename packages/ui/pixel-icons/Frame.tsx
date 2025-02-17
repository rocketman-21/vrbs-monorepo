import { SVGProps } from "react";

const SvgFrame = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V7H4v12h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFrame;
