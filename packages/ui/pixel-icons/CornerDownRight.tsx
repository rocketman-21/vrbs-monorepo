import { SVGProps } from "react";

const SvgCornerDownRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2Zm10-4v-2h-2v2h2Zm0 6v2h-2v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerDownRight;
