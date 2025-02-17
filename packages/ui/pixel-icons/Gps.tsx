import { SVGProps } from "react";

const SvgGps = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2v4h5v5h4v2h-4v5h-5v4h-2v-4H6v-5H2v-2h4V6h5V2h2ZM8 8v8h8V8H8Zm2 2h4v4h-4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGps;
