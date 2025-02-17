import { SVGProps } from "react";

const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12ZM7 10V8h2v2H7Zm0 0v2H5v-2h2Zm10 0V8h-2v2h2Zm0 0v2h2v-2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowUp;
