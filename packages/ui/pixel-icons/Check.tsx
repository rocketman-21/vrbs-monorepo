import { SVGProps } from "react";

const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 6h2v2h-2V6Zm-2 4V8h2v2h-2Zm-2 2v-2h2v2h-2Zm-2 2h2v-2h-2v2Zm-2 2h2v-2h-2v2Zm-2 0v2h2v-2H8Zm-2-2h2v2H6v-2Zm0 0H4v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheck;
