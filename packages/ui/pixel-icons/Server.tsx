import { SVGProps } from "react";

const SvgServer = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm2 2v6h14V5H5Zm14 8H5v6h14v-6ZM7 7h2v2H7V7Zm2 8H7v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgServer;
