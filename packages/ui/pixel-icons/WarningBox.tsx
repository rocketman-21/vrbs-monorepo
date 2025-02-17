import { SVGProps } from "react";

const SvgWarningBox = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h16v2H5v14h14v2H3V3Zm18 0h-2v18h2V3ZM11 15h2v2h-2v-2Zm2-8h-2v6h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWarningBox;
