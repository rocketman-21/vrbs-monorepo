import { SVGProps } from "react";

const SvgArrowBarDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 4h2v8h2v2h-2v2h-2v-2H9v-2h2V4Zm-2 8H7v-2h2v2Zm6 0v-2h2v2h-2ZM4 18h16v2H4v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowBarDown;
