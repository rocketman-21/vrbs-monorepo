import { SVGProps } from "react";

const SvgKanban = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3H3v18h18V3ZM5 19V5h14v14H5ZM9 7H7v8h2V7Zm2 0h2v4h-2V7Zm6 0h-2v10h2V7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgKanban;
