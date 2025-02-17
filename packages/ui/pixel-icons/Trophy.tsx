import { SVGProps } from "react";

const SvgTrophy = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 3H6v2H2v10h6V5h8v10h6V5h-4V3h-2Zm4 4v6h-2V7h2ZM6 13H4V7h2v6Zm12 2H6v2h12v-2Zm-7 2h2v2h3v2H8v-2h3v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTrophy;
