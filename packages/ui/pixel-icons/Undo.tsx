import { SVGProps } from "react";

const SvgUndo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 4h2v2H8V4Zm10 6V8H8V6H6v2H4v2h2v2h2v2h2v-2H8v-2h10Zm0 8v-8h2v8h-2Zm0 0v2h-6v-2h6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUndo;
