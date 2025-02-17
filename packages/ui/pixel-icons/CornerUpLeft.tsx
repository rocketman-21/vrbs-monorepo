import { SVGProps } from "react";

const SvgCornerUpLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 8H8V6H6v2H4v2h2v2h2v-2h10v10h2V8h-2ZM8 12v2h2v-2H8Zm0-6V4h2v2H8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerUpLeft;
