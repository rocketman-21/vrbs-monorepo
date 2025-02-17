import { SVGProps } from "react";

const SvgLabelAltMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 5H6v10h12v-2h2v-2h2V9h-2V7h-2V5H8Zm10 2v2h2v2h-2v2H8V7h10ZM4 9H2v10h12v-2H4V9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLabelAltMultiple;
