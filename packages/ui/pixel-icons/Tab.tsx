import { SVGProps } from "react";

const SvgTab = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm2 2v14h16V9h-8V5H4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTab;
