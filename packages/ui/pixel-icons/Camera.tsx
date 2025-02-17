import { SVGProps } from "react";

const SvgCamera = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 3H7v2H2v16h20V5h-5V3H9Zm8 4h3v12H4V7h5V5h6v2h2Zm-7 2h4v2h-4V9Zm4 6h-4v2h4v-2h2v-4h-2v4Zm-6-4h2v4H8v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCamera;
