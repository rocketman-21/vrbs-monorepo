import { SVGProps } from "react";

const SvgNoteDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 2h10v14h-2v2h-2v-2h-2v2h2v2h-2v2H3V10h2v10h8v-6h6V4h-8V2ZM7 4H5V2H3v2h2v2H3v2h2V6h2v2h2V6H7V4Zm0 0h2V2H7v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNoteDelete;
