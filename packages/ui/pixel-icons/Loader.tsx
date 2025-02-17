import { SVGProps } from "react";

const SvgLoader = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2h-2v6h2V2Zm0 14h-2v6h2v-6Zm9-5v2h-6v-2h6ZM8 13v-2H2v2h6Zm7-6h2v2h-2V7Zm4-2h-2v2h2V5ZM9 7H7v2h2V7ZM5 5h2v2H5V5Zm10 12h2v2h2v-2h-2v-2h-2v2Zm-8 0v-2h2v2H7v2H5v-2h2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLoader;
