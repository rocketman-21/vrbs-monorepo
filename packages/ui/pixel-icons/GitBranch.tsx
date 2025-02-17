import { SVGProps } from "react";

const SvgGitBranch = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 2h2v12h3v3h7v-7h-3V2h8v8h-3v9h-9v3H2v-8h3V2Zm15 6V4h-4v4h4ZM8 19v-3H4v4h4v-1Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGitBranch;
