import { SVGProps } from "react";

const SvgInfoBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h2v18H3V3Zm16 0H5v2h14v14H5v2h16V3h-2Zm-8 6h2V7h-2v2Zm2 8h-2v-6h2v6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgInfoBox;
