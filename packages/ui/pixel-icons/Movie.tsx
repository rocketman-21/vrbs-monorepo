import { SVGProps } from "react";

const SvgMovie = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h18v18H3V3Zm2 2v2h2V5H5Zm4 0v6h6V5H9Zm8 0v2h2V5h-2Zm2 4h-2v2h2V9Zm0 4h-2v2h2v-2Zm0 4h-2v2h2v-2Zm-4 2v-6H9v6h6Zm-8 0v-2H5v2h2Zm-2-4h2v-2H5v2Zm0-4h2V9H5v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMovie;
