import { SVGProps } from "react";

const SvgBold = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 10 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.5 2v3H5a1.5 1.5 0 1 0 0-3H2.5Zm5.352 3.53A3.5 3.5 0 0 0 5 0H.5v12H6a3.5 3.5 0 0 0 1.852-6.47ZM2.5 10H6a1.5 1.5 0 1 0 0-3H2.5v3Z"
    />
  </svg>
);
export default SvgBold;
