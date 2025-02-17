import { SVGProps } from "react";

const SvgZoomOut = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2H6v2H4v2H2v8h2v2h2v2h8v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2h2V6h-2V4h-2V2Zm0 2v2h2v8h-2v2H6v-2H4V6h2V4h8Zm0 5v2H6V9h8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgZoomOut;
