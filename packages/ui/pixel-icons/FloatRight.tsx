import { SVGProps } from "react";

const SvgFloatRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 4h6v8h-8V4h2Zm4 6V6h-4v4h4Zm-8-4H2v2h10V6Zm0 4H2v2h10v-2Zm10 4v2H2v-2h20Zm0 6v-2H2v2h20Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFloatRight;
