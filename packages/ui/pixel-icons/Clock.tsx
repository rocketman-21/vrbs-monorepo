import { SVGProps } from "react";

const SvgClock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 3H5v2H3v14h2v2h14v-2h2V5h-2V3Zm0 2v14H5V5h14Zm-8 2h2v6h4v2h-6V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClock;
