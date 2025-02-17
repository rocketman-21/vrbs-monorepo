import { SVGProps } from "react";

const SvgCrop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2H6v4H2v2h14v14h2v-4h4v-2h-4V6H8V2Zm0 8H6v8h8v-2H8v-6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCrop;
