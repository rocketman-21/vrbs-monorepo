import { SVGProps } from "react";

const SvgCornerLeftDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 6v10H6v2h2v2h2v-2h2v-2h-2V6h10V4H8v2Zm4 10h2v-2h-2v2Zm-6 0H4v-2h2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCornerLeftDown;
