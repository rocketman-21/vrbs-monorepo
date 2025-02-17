import { SVGProps } from "react";

const SvgExpand = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 5h2v2h2v2h2V7h-2V5h-2V3h-2v2ZM9 7V5h2v2H9Zm0 0v2H7V7h2Zm-5 6h16v-2H4v2Zm9 6h-2v-2H9v-2H7v2h2v2h2v2h2v-2Zm2-2h-2v2h2v-2Zm0 0h2v-2h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgExpand;
