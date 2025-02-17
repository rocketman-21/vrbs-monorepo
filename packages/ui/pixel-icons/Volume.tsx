import { SVGProps } from "react";

const SvgVolume = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2h2v20h-2v-2h-2v-2h2V6h-2V4h2V2Zm-4 6V6h2v2h-2Zm-2 2h2V8H7v8h4v2h2v-2h-2v-2H9v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVolume;
