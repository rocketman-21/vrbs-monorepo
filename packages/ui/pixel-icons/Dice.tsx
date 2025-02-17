import { SVGProps } from "react";

const SvgDice = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v18h18V3H5Zm14 2v14H5V5h14ZM9 7H7v2h2V7Zm6 0h2v2h-2V7Zm-6 8H7v2h2v-2Zm6 0h2v2h-2v-2Zm-2-4h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDice;
