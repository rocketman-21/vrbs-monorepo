import { SVGProps } from "react";

const SvgSave = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 2h14v2H4v16h2v-6h12v6h2V6h2v16H2V2h2Zm4 18h8v-4H8v4ZM20 6h-2V4h2v2ZM6 6h9v4H6V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSave;
