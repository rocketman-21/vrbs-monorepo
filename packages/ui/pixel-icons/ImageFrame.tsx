import { SVGProps } from "react";

const SvgImageFrame = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 1h-2v2H9v2H7v2H2v16h20V7h-5V5h-2V3h-2V1Zm2 6H9V5h2V3h2v2h2v2ZM4 9h16v12H4V9Zm10 6v-2h-2v2h-2v2H8v2h2v-2h2v-2h2Zm2 2v-2h-2v2h2Zm0 0v2h2v-2h-2ZM6 13v-2h2v2H6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageFrame;
