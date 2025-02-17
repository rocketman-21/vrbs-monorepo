import { SVGProps } from "react";

const SvgMusic = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 4h12v16h-8v-8h6V8h-8v12H2v-8h6V4Zm0 10H4v4h4v-4Zm10 0h-4v4h4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMusic;
