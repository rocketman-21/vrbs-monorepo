import { SVGProps } from "react";

const SvgSectionCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v2h2V3Zm2 4h2v2H7V7Zm4 0h2v2h-2V7Zm2 12h-2v2h2v-2Zm2 0h2v2h-2v-2Zm6 0h-2v2h2v-2ZM7 11h2v2H7v-2Zm14 0h-2v2h2v-2Zm-2 4h2v2h-2v-2ZM7 19h2v2H7v-2ZM19 7h2v2h-2V7ZM7 3h2v2H7V3Zm2 12H7v2h2v-2ZM3 7h2v2H3V7Zm14 0h-2v2h2V7ZM3 11h2v2H3v-2Zm2 4H3v2h2v-2Zm6-12h2v2h-2V3Zm6 0h-2v2h2V3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSectionCopy;
