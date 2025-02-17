import { SVGProps } from "react";

const SvgViewList = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h20v14H2V5Zm2 2v2h16V7H4Zm16 4H4v2h16v-2Zm0 4H4v2h16v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgViewList;
