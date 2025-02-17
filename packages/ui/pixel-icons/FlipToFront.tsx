import { SVGProps } from "react";

const SvgFlipToFront = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3H7v14h14V3Zm-2 12H9V5h10v10ZM5 7H3v2h2V7Zm-2 4h2v2H3v-2Zm2 4H3v2h2v-2Zm-2 4h2v2H3v-2Zm6 0H7v2h2v-2Zm2 0h2v2h-2v-2Zm6 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFlipToFront;
