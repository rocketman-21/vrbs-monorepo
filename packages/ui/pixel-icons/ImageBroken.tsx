import { SVGProps } from "react";

const SvgImageBroken = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 3H2v18h20v-2h-2v-2h2v-2h-2v-2h2v-2h-2V9h2V7h-2V5h2V3Zm-2 4v2h-2v2h2v2h-2v2h2v2h-2v2H4V5h14v2h2Zm-6 2h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v-2h-2V9ZM6 7h2v2H6V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgImageBroken;
