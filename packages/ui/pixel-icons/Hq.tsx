import { SVGProps } from "react";

const SvgHq = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 7h2v4h4V7h2v10H9v-4H5v4H3V7Zm10 2h2v6h-2V9Zm6 6h-4v2h8v-2h-2V9h-2V7h-4v2h4v6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHq;
