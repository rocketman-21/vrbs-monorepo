import { SVGProps } from "react";

const SvgCameraFace = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3h10v2h5v16H2V7h2v12h16V7h-5V5H9v2H2V5h5V3Zm7 12h-4v2h4v-2Zm-4-2v2H8v-2h2Zm0-2V9H8v2h2Zm6 2v2h-2v-2h2Zm0-2V9h-2v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCameraFace;
