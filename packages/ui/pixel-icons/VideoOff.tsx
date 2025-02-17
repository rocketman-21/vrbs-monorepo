import { SVGProps } from "react";

const SvgVideoOff = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5H2v14h14v-4h2v2h2v2h2V5h-2v2h-2v2h-2V5H4Zm10 12H4V7h10v10Zm-4-6H8V9H6v2h2v2H6v2h2v-2h2v2h2v-2h-2v-2Zm0 0V9h2v2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVideoOff;
