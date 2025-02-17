import { SVGProps } from "react";

const SvgNote = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2h18v14h-2v2h-2v-2h-2v2h2v2h-2v2H3V2Zm2 2v16h8v-6h6V4H5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNote;
