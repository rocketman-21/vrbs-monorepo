import { SVGProps } from "react";

const SvgHeadphone = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 4H5v2H3v14h7v-8H5V6h14v6h-5v8h7V6h-2V4Zm-3 10h3v4h-3v-4Zm-8 0v4H5v-4h3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHeadphone;
