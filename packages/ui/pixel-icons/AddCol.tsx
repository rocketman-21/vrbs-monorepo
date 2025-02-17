import { SVGProps } from "react";

const SvgAddCol = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h10v20H2v-2h8v-4H2v-2h8v-4H2V8h8V4H2V2Zm17 9h3v2h-3v3h-2v-3h-3v-2h3V8h2v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddCol;
