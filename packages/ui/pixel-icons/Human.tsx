import { SVGProps } from "react";

const SvgHuman = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h4v4h-4V2ZM3 7h18v2h-6v13h-2v-6h-2v6H9V9H3V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHuman;
