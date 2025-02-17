import { SVGProps } from "react";

const SvgGitMerge = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2H2v8h3v12h2V10h3v2h2v2h2v8h8v-8h-8v-2h-2v-2h-2V2ZM4 8V4h4v4H4Zm12 12v-4h4v4h-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGitMerge;
