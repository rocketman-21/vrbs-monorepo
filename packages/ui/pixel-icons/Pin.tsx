import { SVGProps } from "react";

const SvgPin = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 2h10v2H7V2ZM5 6V4h2v2H5Zm0 8H3V6h2v8Zm2 2H5v-2h2v2Zm2 2H7v-2h2v2Zm2 2H9v-2h2v2Zm2 0v2h-2v-2h2Zm2-2v2h-2v-2h2Zm2-2v2h-2v-2h2Zm2-2v2h-2v-2h2Zm0-8h2v8h-2V6Zm0 0V4h-2v2h2Zm-5 2h-4v4h4V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPin;
