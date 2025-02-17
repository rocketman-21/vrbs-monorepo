import { SVGProps } from "react";

const SvgLayoutAlignBottom = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 4H8v12h8V4Zm-6 10V6h4v8h-4Zm10 6v-2H4v2h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutAlignBottom;
