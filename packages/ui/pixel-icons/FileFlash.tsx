import { SVGProps } from "react";

const SvgFileFlash = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 22h-6v-2h6V10h-6V4H5v8H3V2h12v2h2v2h2v2h2v14h-2ZM17 6h-2v2h2V6ZM7 12h2v4h4v2h-2v2H9v2H7v-4H3v-2h2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileFlash;
