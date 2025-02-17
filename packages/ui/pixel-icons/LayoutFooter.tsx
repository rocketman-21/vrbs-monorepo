import { SVGProps } from "react";

const SvgLayoutFooter = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h20v14H2V5Zm2 2v6h16V7H4Zm16 8H4v2h16v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutFooter;
