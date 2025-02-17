import { SVGProps } from "react";

const SvgListBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm18 16V5H4v14h16ZM8 7H6v2h2V7Zm2 0h8v2h-8V7Zm-2 4H6v2h2v-2Zm2 0h8v2h-8v-2Zm-2 4H6v2h2v-2Zm2 0h8v2h-8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgListBox;
