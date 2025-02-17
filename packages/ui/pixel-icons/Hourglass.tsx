import { SVGProps } from "react";

const SvgHourglass = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 2H6v6h2v2h2v4H8v2H6v6h12v-6h-2v-2h-2v-4h2V8h2V2Zm-2 6h-2v2h-4V8H8V4h8v4Zm-2 6v2h2v4H8v-4h2v-2h4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgHourglass;
