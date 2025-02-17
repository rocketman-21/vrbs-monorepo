import { SVGProps } from "react";

const SvgFloatCenter = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 4h6v8H8V4h2Zm4 6V6h-4v4h4ZM2 6h4v2H2V6Zm20 0h-4v2h4V6Zm0 4h-4v2h4v-2ZM6 10H2v2h4v-2Zm-4 4h20v2H2v-2Zm20 4H2v2h20v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFloatCenter;
