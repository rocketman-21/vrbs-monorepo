import { SVGProps } from "react";

const SvgMouse = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 3h12v18H6V3Zm2 2v4h3V5H8Zm5 0v4h3V5h-3Zm3 6H8v8h8v-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMouse;
