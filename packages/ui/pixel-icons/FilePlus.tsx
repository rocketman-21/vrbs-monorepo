import { SVGProps } from "react";

const SvgFilePlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 22h-7v-2h7V10h-6V4H5v8H3V2h12v2h2v2h2v2h2v14h-2ZM17 6h-2v2h2V6ZM8 19h3v-2H8v-3H6v3H3v2h3v3h2v-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFilePlus;
