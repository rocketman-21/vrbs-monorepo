import { SVGProps } from "react";

const SvgUnderline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 12 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 .75v5.5a1.5 1.5 0 0 1-1.462 1.5H5.5A1.5 1.5 0 0 1 4 6.25V.75H2v5.5a3.5 3.5 0 0 0 3.5 3.5h1.038A3.5 3.5 0 0 0 10 6.25V.75H8Zm-8 12.5h12v-1.5H0v1.5Z"
    />
  </svg>
);
export default SvgUnderline;
