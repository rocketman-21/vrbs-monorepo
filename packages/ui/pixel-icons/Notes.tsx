import { SVGProps } from "react";

const SvgNotes = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2h16v20H3V2h2Zm14 18V4H5v16h14ZM7 6h10v2H7V6Zm10 4H7v2h10v-2ZM7 14h7v2H7v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotes;
