import { SVGProps } from "react";

const SvgSliders = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 4h2v10h-2V4Zm0 12h-2v2h2v2h2v-2h2v-2h-4Zm-4-6h-2v10h2V10Zm-8 2H3v2h2v6h2v-6h2v-2H5Zm8-8h-2v2H9v2h6V6h-2V4ZM5 4h2v6H5V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSliders;
