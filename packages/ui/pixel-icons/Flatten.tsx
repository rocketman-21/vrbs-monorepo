import { SVGProps } from "react";

const SvgFlatten = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 2h2v8h2v2h-2v2h-2v-2H9v-2h2V2Zm-2 8H7V8h2v2Zm6 0V8h2v2h-2Zm5 6H4v2h16v-2Zm-4 4H8v2h8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFlatten;
