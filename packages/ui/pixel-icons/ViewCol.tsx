import { SVGProps } from "react";

const SvgViewCol = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h20v14H2V5Zm2 2v10h4V7H4Zm6 0v10h4V7h-4Zm6 0v10h4V7h-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgViewCol;
