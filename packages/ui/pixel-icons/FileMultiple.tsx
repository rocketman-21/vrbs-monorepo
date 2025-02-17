import { SVGProps } from "react";

const SvgFileMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 18H7V2h8v2h2v2h-2v2h2V6h2v2h2v10ZM9 4v12h10v-6h-6V4H9ZM3 6h2v14h12v2H3V6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFileMultiple;
