import { SVGProps } from "react";

const SvgCardPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 4H2v16h10v-2H4V6h16v4h2V4Zm-3 13h3v-2h-3v-3h-2v3h-3v2h3v3h2v-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCardPlus;
