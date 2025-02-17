import { SVGProps } from "react";

const SvgCalculator = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2H3v20h18V2H5Zm14 18H5V4h14v16ZM17 6H7v4h10V6ZM7 12h2v2H7v-2Zm6 0h-2v2h2v-2Zm2 0h2v2h-2v-2Zm-6 4H7v2h2v-2Zm2 0h2v2h-2v-2Zm6 0h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCalculator;
