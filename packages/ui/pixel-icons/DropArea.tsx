import { SVGProps } from "react";

const SvgDropArea = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v2h2V3Zm2 0h2v2H7V3Zm6 0h-2v2h2V3Zm2 0h2v2h-2V3Zm4 0h2v2h-2V3ZM3 7h2v2H3V7Zm2 4H3v2h2v-2Zm-2 4h2v2H3v-2Zm2 4H3v2h2v-2Zm2 0h2v2H7v-2Zm6 0h-2v2h2v-2Zm6-8h2v2h-2v-2Zm2-4h-2v2h2V7Zm-6 10v-2h6v2h-2v2h-2v2h-2v-4Zm4 2v2h2v-2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDropArea;
