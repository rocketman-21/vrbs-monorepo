import { SVGProps } from "react";

const SvgHumanHandsdown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h4v4h-4V2ZM7 7h10v2h-2v13h-2v-6h-2v6H9V9H7V7Zm-2 4h2V9H5v2Zm0 0v2H3v-2h2Zm14 0h-2V9h2v2Zm0 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHumanHandsdown;
