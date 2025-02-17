import { SVGProps } from "react";

const SvgCellularSignalOff = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 2H2v2h2v2H2v2h2V6h2v2h2V6H6V4h2V2H6v2H4V2Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 4v16h6V4h-6Zm2 2h2v12h-2V6Z"
      fill="currentColor"
    />
    <path d="M9 10v10h6V10H9Zm2 8v-6h2v6h-2Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14v6H2v-6h6Zm-2 4v-2H4v2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCellularSignalOff;
