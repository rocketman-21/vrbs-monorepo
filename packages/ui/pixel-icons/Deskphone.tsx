import { SVGProps } from "react";

const SvgDeskphone = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm2 2v6h8V5H5Zm10 0v14h4V5h-4Zm-2 14v-2h-3v2h3Zm-5 0v-2H5v2h3Zm-3-4h3v-2H5v2Zm5-2v2h3v-2h-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDeskphone;
