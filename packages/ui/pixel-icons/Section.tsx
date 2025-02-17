import { SVGProps } from "react";

const SvgSection = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v2h2V3Zm4 0H7v2h2V3ZM7 19h2v2H7v-2ZM5 7H3v2h2V7Zm14 0h2v2h-2V7ZM5 11H3v2h2v-2Zm14 0h2v2h-2v-2ZM5 15H3v2h2v-2Zm14 0h2v2h-2v-2ZM5 19H3v2h2v-2Zm6-16h2v2h-2V3Zm2 16h-2v2h2v-2Zm2-16h2v2h-2V3Zm2 16h-2v2h2v-2Zm2-16h2v2h-2V3Zm2 16h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgSection;
