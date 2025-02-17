import { SVGProps } from "react";

const SvgHd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 7h2v4h4V7h2v10H9v-4H5v4H3V7Zm10 8V7h6v2h-4v6h4v2h-6v-2Zm6 0V9h2v6h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHd;
