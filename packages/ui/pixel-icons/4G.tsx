import { SVGProps } from "react";

const Svg4G = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 7H3v6h5v4h2V7H8v4H5V7Zm16 0h-9v10h9v-6h-4v2h2v2h-5V9h7V7Z"
      fill="currentColor"
    />
  </svg>
);

export default Svg4G;
