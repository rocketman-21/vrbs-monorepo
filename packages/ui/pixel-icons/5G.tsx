import { SVGProps } from "react";

const Svg5G = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 7H3v6h5v2H3v2h7v-6H5V9h5V7Zm11 0h-9v10h9v-6h-4v2h2v2h-5V9h7V7Z"
      fill="currentColor"
    />
  </svg>
);

export default Svg5G;
