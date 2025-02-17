import { SVGProps } from "react";

const SvgFolderPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4h8v2h10v14H2V4h2Zm16 4H10V6H4v12h16V8Zm-6 2h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgFolderPlus;
