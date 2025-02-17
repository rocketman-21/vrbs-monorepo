import { SVGProps } from "react";

const SvgImageMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 2H4v16h20V2ZM6 16V4h16v12H6ZM2 4H0v18h20v-2H2V4Zm12 2h2v2h-2V6Zm-2 4V8h2v2h-2Zm-2 2v-2h2v2h-2Zm0 0v2H8v-2h2Zm8-2h-2V8h2v2Zm0 0h2v2h-2v-2ZM8 6h2v2H8V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageMultiple;
