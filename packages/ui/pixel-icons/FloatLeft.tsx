import { SVGProps } from "react";

const SvgFloatLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h6v8H2V4h2Zm4 6V6H4v4h4Zm14-4H12v2h10V6Zm0 4H12v2h10v-2Zm0 4v2H2v-2h20Zm0 6v-2H2v2h20Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFloatLeft;
