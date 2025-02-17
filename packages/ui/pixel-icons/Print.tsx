import { SVGProps } from "react";

const SvgPrint = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2h12v6h4v10h-4v4H6v-4H2V8h4V2Zm2 6h8V4H8v4Zm-2 8v-4h12v4h2v-6H4v6h2Zm2-2v6h8v-6H8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPrint;
