import { SVGProps } from "react";

const SvgCardText = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4H2v16h20V4H4Zm0 2h16v12H4V6Zm2 2h12v2H6V8Zm0 4h10v2H6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCardText;
