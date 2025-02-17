import { SVGProps } from "react";

const SvgAddGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h8v8H3V3Zm6 6V5H5v4h4Zm9 4h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3ZM15 3h6v8h-8V3h2Zm4 6V5h-4v4h4ZM5 13h6v8H3v-8h2Zm4 6v-4H5v4h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgAddGrid;
