import { SVGProps } from "react";

const SvgPlaylist = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 13h6V5h6v4h-4v10h-8v-6Zm2 2v2h4v-2h-4ZM2 17h6v2H2v-2Zm6-4H2v2h6v-2ZM2 9h12v2H2V9Zm12-4H2v2h12V5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPlaylist;
