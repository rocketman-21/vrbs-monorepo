import { SVGProps } from "react";

const SvgSubscriptions = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 2H6v2h12V2ZM4 6h16v2H4V6Zm-2 4h20v12H2V10Zm18 10v-8H4v8h16Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSubscriptions;
