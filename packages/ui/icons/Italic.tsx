import { SVGProps } from "react";

const SvgItalic = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 8 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.02 0H8v2H5.82l-1.6 8H6v2H0v-2h2.18l1.6-8H2V0h3.021Z"
    />
  </svg>
);
export default SvgItalic;
