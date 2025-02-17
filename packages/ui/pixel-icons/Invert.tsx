import { SVGProps } from "react";

const SvgInvert = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm16 4h-2v2h-2v2h-2v2h-2v2H9v2H7v2h12V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgInvert;
