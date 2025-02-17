import { SVGProps } from "react";

const SvgModem = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 2h-8v2H9v2h2V4h8v2h2V4h-2V2Zm-8 6h2v2h-2V8Zm6 0V6h-4v2h4Zm0 0h2v2h-2V8Zm-1 2h-2v2H2v10h20V12h-6v-2Zm4 4v6H4v-6h16Zm-2 2h-2v2h2v-2Zm-6 0h2v2h-2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgModem;
