import { SVGProps } from "react";

const SvgNoteMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 6H7v16h8v-2h2v-2h-2v-2h2v2h2v-2h2V6ZM9 20V8h10v6h-6v6H9Zm-6-2h2V4h12V2H3v16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNoteMultiple;
