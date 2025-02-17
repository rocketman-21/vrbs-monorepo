import { SVGProps } from "react";

const SvgCameraAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2H3v3H0v2h3v3h2V7h3V5H5V2Zm12 1h-7v2h5v2h5v12H5v-7H3v9h19V5h-5V3Zm-7 6h4v2h2v4h-2v2h-4v-2h4v-4h-4V9Zm-2 2h2v4H8v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCameraAdd;
