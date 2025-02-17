import { SVGProps } from "react";

const SvgDragAndDrop = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H3v2h2V3Zm14 4h2v6h-2V9H9v10h4v2H7V7h12ZM7 3h2v2H7V3ZM5 7H3v2h2V7Zm-2 4h2v2H3v-2Zm2 4H3v2h2v-2Zm6-12h2v2h-2V3Zm6 0h-2v2h2V3Zm-2 14v-2h6v2h-2v2h-2v2h-2v-4Zm4 2v2h2v-2h-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgDragAndDrop;
