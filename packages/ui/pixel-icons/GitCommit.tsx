import { SVGProps } from "react";

const SvgGitCommit = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 7h10v4h5v2h-5v4H7v-4H2v-2h5V7Zm2 2v6h6V9H9Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGitCommit;
