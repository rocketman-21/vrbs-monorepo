import { SVGProps } from "react";

const SvgRadioOn = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 3H7v2H5v2H3v10h2v2h2v2h10v-2h2v-2h2V7h-2V5h-2V3Zm0 2v2h2v10h-2v2H7v-2H5V7h2V5h10Zm-9 6h2v2h2v2h-2v-2H8v-2Zm8-2h-2v2h-2v2h2v-2h2V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgRadioOn;
