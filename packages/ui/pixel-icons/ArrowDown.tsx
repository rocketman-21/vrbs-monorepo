import { SVGProps } from "react";

const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 4h2v12h2v2h-2v2h-2v-2H9v-2h2V4ZM7 14v2h2v-2H7Zm0 0v-2H5v2h2Zm10 0v2h-2v-2h2Zm0 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowDown;
