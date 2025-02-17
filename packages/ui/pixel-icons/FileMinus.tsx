import { SVGProps } from "react";

const SvgFileMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 22h8V8h-2V6h-2v2h-2V6h2V4h-2V2H3v13h2V4h8v6h6v10h-6v2Zm-2-3H3v-2h8v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileMinus;
