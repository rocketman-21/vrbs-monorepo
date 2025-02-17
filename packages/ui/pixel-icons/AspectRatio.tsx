import { SVGProps } from "react";

const SvgAspectRatio = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h20v16H2V4Zm2 14h16V6H4v12ZM8 8h2v2H8v2H6V8h2Zm8 8h-2v-2h2v-2h2v4h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAspectRatio;
