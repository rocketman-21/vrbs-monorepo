import { SVGProps } from "react";

const SvgMailFlash = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h18v8h-2V6H4v12h8v2H2V4h2Zm4 4H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8Zm10 6h2v4h4v2h-2v2h-2v2h-2v-4h-4v-2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMailFlash;
