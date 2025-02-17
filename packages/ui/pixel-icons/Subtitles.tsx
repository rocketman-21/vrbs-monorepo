import { SVGProps } from "react";

const SvgSubtitles = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 7h-8v10h8v-2h-6V9h6V7ZM3 15V7h8v2H5v6h6v2H3v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSubtitles;
