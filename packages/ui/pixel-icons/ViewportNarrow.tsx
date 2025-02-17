import { SVGProps } from "react";

const SvgViewportNarrow = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2H8v4h2V4h4v2h2V2h-6ZM8 20v-2h2v2h4v-2h2v4H8v-2Zm9-9h5v2h-5v2h-2v-2h-2v-2h2V9h2v2Zm0-2V7h2v2h-2Zm0 6h2v2h-2v-2ZM2 11h5V9h2v2h2v2H9v2H7v-2H2v-2Zm5 4v2H5v-2h2Zm0-6V7H5v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgViewportNarrow;
