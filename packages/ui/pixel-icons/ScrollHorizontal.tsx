import { SVGProps } from "react";

const SvgScrollHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 2v2H2V2h20Zm0 18v2H2v-2h20Zm-6-5v-2H8v2H6v-2H4v-2h2V9h2v2h8V9h2v2h2v2h-2v2h-2Zm0 0v2h-2v-2h2Zm0-6h-2V7h2v2ZM8 9V7h2v2H8Zm0 6h2v2H8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgScrollHorizontal;
