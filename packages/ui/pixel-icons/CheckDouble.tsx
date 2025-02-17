import { SVGProps } from "react";

const SvgCheckDouble = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 6h2v2h-2V6Zm-2 4V8h2v2h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2H9Zm-2 2v-2h2v2H7Zm-2 0h2v2H5v-2Zm-2-2h2v2H3v-2Zm0 0H1v-2h2v2Zm8 2h2v2h-2v-2Zm4-2v2h-2v-2h2Zm2-2v2h-2v-2h2Zm2-2v2h-2v-2h2Zm2-2h-2v2h2V8Zm0 0h2V6h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCheckDouble;
