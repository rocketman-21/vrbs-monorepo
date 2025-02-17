import { SVGProps } from "react";

const SvgNotesPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2h16v12h-2V4H5v16h8v2H3V2h2Zm2 4h10v2H7V6Zm10 4H7v2h10v-2ZM7 14h7v2H7v-2Zm13 5h3v2h-3v3h-2v-3h-3v-2h3v-3h2v3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotesPlus;
