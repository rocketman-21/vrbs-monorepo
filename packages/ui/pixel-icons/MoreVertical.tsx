import { SVGProps } from "react";

const SvgMoreVertical = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 1v6H9V1h6Zm-2 2h-2v2h2V3Zm2 6v6H9V9h6Zm-2 2h-2v2h2v-2Zm2 6v6H9v-6h6Zm-2 2h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMoreVertical;
