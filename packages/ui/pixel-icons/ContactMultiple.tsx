import { SVGProps } from "react";

const SvgContactMultiple = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3h20v14H4V3Zm18 12V5H6v10h16Zm-2 4H2V7H0v14h20v-2ZM9 7h2v2H9V7Zm3 4H8v2h4v-2Zm2-4h6v2h-6V7Zm6 4h-6v2h6v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgContactMultiple;
