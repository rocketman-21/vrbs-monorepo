import { SVGProps } from "react";

const SvgLayoutHeader = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 19h20V5H2v14Zm2-2v-6h16v6H4Zm16-8H4V7h16v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutHeader;
