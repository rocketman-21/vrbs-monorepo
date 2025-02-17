import { SVGProps } from "react";

const SvgTextColums = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 5H3v2h8V5Zm10 0h-8v2h8V5ZM3 9h8v2H3V9Zm18 0h-8v2h8V9ZM3 13h8v2H3v-2Zm18 0h-8v2h8v-2ZM3 17h8v2H3v-2Zm18 0h-8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTextColums;
