import { SVGProps } from "react";

const SvgDollar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 2h2v4h6v2H7v3H5V6h6V2ZM5 18h6v4h2v-4h6v-2H5v2Zm14-7H5v2h12v3h2v-5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDollar;
