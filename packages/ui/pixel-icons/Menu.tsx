import { SVGProps } from "react";

const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm16 5H4v2h16v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMenu;
