import { SVGProps } from "react";

const SvgIso = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3H6v3H3v2h3v3h2V8h3V6H8V3Zm11 2h-2v2h-2v2h-2v2h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v-2h2V9h2V7h2V5Zm-6 13v-2h8v2h-8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgIso;
