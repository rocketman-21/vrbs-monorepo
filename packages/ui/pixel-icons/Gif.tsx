import { SVGProps } from "react";

const SvgGif = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 7h6v2H3v6h4v-2H5v-2h4v6H1V7h2Zm14 0h6v2h-6v2h4v2h-4v4h-2V7h2Zm-4 0h-2v10h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgGif;
