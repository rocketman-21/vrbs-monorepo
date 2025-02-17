import { SVGProps } from "react";

const SvgCocktail = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 3H3v4h2v2h2v2h2v2h2v6H7v2h10v-2h-4v-6h2v-2h2V9h2V7h2V3h-2Zm0 4H5V5h14v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCocktail;
