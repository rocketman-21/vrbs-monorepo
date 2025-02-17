import { SVGProps } from "react";

const SvgSpotlight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2h16v20H3V2h2Zm14 18V4H5v16h14ZM13 6H7v2h6V6Zm-6 4h10v8H7v-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSpotlight;
