import { SVGProps } from "react";

const SvgShoppingBag = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2h6v2H9V2Zm6 4V4h2v2h4v16H3V6h4V4h2v2h6Zm0 2H9v2H7V8H5v12h14V8h-2v2h-2V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgShoppingBag;
