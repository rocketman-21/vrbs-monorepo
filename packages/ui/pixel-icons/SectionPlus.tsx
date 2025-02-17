import { SVGProps } from "react";

const SvgSectionPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3h2v2H3V3Zm4 0h2v2H7V3Zm2 16H7v2h2v-2Zm2 0h2v2h-2v-2ZM5 7H3v2h2V7Zm14 0h2v2h-2V7Zm2 4h-2v2h2v-2ZM3 11h2v2H3v-2Zm2 4H3v2h2v-2Zm12 0h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2ZM5 19H3v2h2v-2Zm6-16h2v2h-2V3Zm6 0h-2v2h2V3Zm4 0h-2v2h2V3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSectionPlus;
