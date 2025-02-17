import { SVGProps } from "react";

const SvgInboxFull = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2h18v20H3V2Zm2 2v10h4v2h6v-2h4V4H5Zm14 12h-2v2H7v-2H5v4h14v-4ZM7 6h10v2H7V6Zm0 4h10v2H7v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgInboxFull;
