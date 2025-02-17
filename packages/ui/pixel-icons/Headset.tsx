import { SVGProps } from "react";

const SvgHeadset = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 2H5v2H3v14h7v-8H5V4h14v6h-5v8h3v2h-6v2h8v-4h2V4h-2V2Zm-3 10h3v4h-3v-4Zm-8 0v4H5v-4h3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHeadset;
