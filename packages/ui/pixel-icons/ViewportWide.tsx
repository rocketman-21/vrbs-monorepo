import { SVGProps } from "react";

const SvgViewportWide = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2H2v4h2V4h16v2h2V2H4ZM2 20v-2h2v2h16v-2h2v4H2v-2Zm16-9h-5v2h5v2h-2v2h2v-2h2v-2h2v-2h-2V9h-2V7h-2v2h2v2Zm-7 0H6V9h2V7H6v2H4v2H2v2h2v2h2v2h2v-2H6v-2h5v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgViewportWide;
