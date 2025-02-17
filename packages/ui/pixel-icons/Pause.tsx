import { SVGProps } from "react";

const SvgPause = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 4H5v16h5V4Zm9 0h-5v16h5V4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPause;
