import { SVGProps } from "react";

const SvgNotesMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0h16v20H5V0h2Zm14 18V2H7v16h14ZM9 4h10v2H9V4Zm10 4H9v2h10V8ZM9 12h7v2H9v-2Zm10 10H3V4H1v20h18v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotesMultiple;
