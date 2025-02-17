import { SVGProps } from "react";

const SvgBuildingSkyscraper = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h4v5h2v2h-2v11h4v-9h2v9h2v2H2v-2h2V8h2v12h6V4h-2V2ZM8 6V4h2v2H8Zm0 0H6v2h2V6Zm10 5h-2V9h2v2Zm-8-1H8v2h2v-2Zm-2 4h2v2H8v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBuildingSkyscraper;
