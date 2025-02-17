import { SVGProps } from "react";

const SvgStore = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3h16v2H4V3Zm0 4h18v8h-2v6h-2v-6h-4v6H4v-6H2V7h2Zm8 12v-4H6v4h6Zm0-6h8V9H4v4h8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgStore;
