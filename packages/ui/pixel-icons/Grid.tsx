import { SVGProps } from "react";

const SvgGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h20v20H2V2Zm2 2v4h4V4H4Zm6 0v4h4V4h-4Zm6 0v4h4V4h-4Zm4 6h-4v4h4v-4Zm0 6h-4v4h4v-4Zm-6 4v-4h-4v4h4Zm-6 0v-4H4v4h4Zm-4-6h4v-4H4v4Zm6-4v4h4v-4h-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGrid;
