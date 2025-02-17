import { SVGProps } from "react";

const SvgSectionMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v2h2V3Zm4 0H7v2h2V3ZM7 19h2v2H7v-2Zm6 0h-2v2h2v-2ZM3 7h2v2H3V7Zm18 0h-2v2h2V7Zm-2 4h2v2h-2v-2ZM5 11H3v2h2v-2Zm-2 4h2v2H3v-2Zm2 4H3v2h2v-2Zm6-16h2v2h-2V3Zm6 0h-2v2h2V3Zm2 0h2v2h-2V3Zm2 14h-6v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSectionMinus;
