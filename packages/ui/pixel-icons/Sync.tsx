import { SVGProps } from "react";

const SvgSync = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 9V7h12V5h2v2h2v2h-2v2h-2V9H4Zm12 2h-2v2h2v-2Zm0-6h-2V3h2v2Zm4 12v-2H8v-2h2v-2H8v2H6v2H4v2h2v2h2v2h2v-2H8v-2h12Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSync;
