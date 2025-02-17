import { SVGProps } from "react";

const SvgAlignJustify = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 5H4v2h16V5Zm0 4H4v2h16V9ZM4 13h16v2H4v-2Zm16 4H4v2h16v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAlignJustify;
