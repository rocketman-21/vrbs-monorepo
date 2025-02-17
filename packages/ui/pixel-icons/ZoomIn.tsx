import { SVGProps } from "react";

const SvgZoomIn = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2H6v2H4v2H2v8h2v2h2v2h8v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2h2V6h-2V4h-2V2Zm0 2v2h2v8h-2v2H6v-2H4V6h2V4h8ZM9 6h2v3h3v2h-3v3H9v-3H6V9h3V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgZoomIn;
