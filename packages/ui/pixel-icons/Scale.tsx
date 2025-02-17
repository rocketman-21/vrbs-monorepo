import { SVGProps } from "react";

const SvgScale = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3h-8v2h4v2h2v4h2V3Zm-4 4h-2v2h-2v2h2V9h2V7Zm-8 8h2v-2H9v2H7v2h2v-2Zm-4-2v4h2v2H5h6v2H3v-8h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgScale;
