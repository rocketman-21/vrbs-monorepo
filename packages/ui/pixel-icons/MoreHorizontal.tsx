import { SVGProps } from "react";

const SvgMoreHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 9h6v6H1V9Zm2 2v2h2v-2H3Zm6-2h6v6H9V9Zm2 2v2h2v-2h-2Zm6-2h6v6h-6V9Zm2 2v2h2v-2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMoreHorizontal;
