import { SVGProps } from "react";

const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h8v2h10v14H2V4h2Zm16 4H10V6H4v12h16V8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFolder;
