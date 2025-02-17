import { SVGProps } from "react";

const SvgCar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 4H7v2H5v2H3v12h4v-2h10v2h4V8h-2V6h-2V4Zm0 2v2h2v2H5V8h2V6h10Zm2 10H5v-4h14v4Zm-2-3h-2v2h2v-2ZM7 13h2v2H7v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCar;
