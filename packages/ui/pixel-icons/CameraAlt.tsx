import { SVGProps } from "react";

const SvgCameraAlt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4H2v16h20V4H4Zm16 2v12H4V6h16ZM8 8H6v2h2V8Zm4 0h4v2h-4V8Zm-2 2h2v4h-2v-4Zm6 4h2v-4h-2v4Zm0 0h-4v2h4v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCameraAlt;
