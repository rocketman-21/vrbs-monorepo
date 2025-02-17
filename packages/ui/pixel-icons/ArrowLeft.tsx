import { SVGProps } from "react";

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12ZM10 7H8v2h2V7Zm0 0h2V5h-2v2Zm0 10H8v-2h2v2Zm0 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowLeft;
