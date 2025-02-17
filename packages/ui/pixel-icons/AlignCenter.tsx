import { SVGProps } from "react";

const SvgAlignCenter = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 5H4v2h16V5Zm-4 4H8v2h8V9ZM4 13h16v2H4v-2Zm12 4H8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAlignCenter;
