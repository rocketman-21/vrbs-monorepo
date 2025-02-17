import { SVGProps } from "react";

const SvgTiles = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 1a2 2 0 0 0-2 2v2.125a2 2 0 0 0 2 2h2.125a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3Zm0 7.875a2 2 0 0 0-2 2V13a2 2 0 0 0 2 2h2.125a2 2 0 0 0 2-2v-2.125a2 2 0 0 0-2-2H3ZM8.875 3a2 2 0 0 1 2-2H13a2 2 0 0 1 2 2v2.125a2 2 0 0 1-2 2h-2.125a2 2 0 0 1-2-2V3Zm2 5.875a2 2 0 0 0-2 2V13a2 2 0 0 0 2 2H13a2 2 0 0 0 2-2v-2.125a2 2 0 0 0-2-2h-2.125Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTiles;
