import { SVGProps } from "react";

const SvgChevronsVertical = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 4h2v2h-2V4ZM9 8V6h2v2H9Zm0 0v2H7V8h2Zm6 0h-2V6h2v2Zm0 0h2v2h-2V8Zm-6 8H7v-2h2v2Zm2 2H9v-2h2v2Zm2 0v2h-2v-2h2Zm2-2h-2v2h2v-2Zm0 0v-2h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgChevronsVertical;
