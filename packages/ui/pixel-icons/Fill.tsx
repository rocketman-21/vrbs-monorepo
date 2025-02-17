import { SVGProps } from "react";

const SvgFill = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2h2v2H9V2Zm4 4V4h-2v2H9v2H7v2H5v2H3v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v6h2V12h-2v-2h-2V8h-2V6h-2Zm0 0v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h2v-2h2V8h2V6h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFill;
