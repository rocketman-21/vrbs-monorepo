import { SVGProps } from "react";

const SvgTable = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3h20v18H2V3Zm2 4v5h7V7H4Zm9 0v5h7V7h-7Zm7 7h-7v5h7v-5Zm-9 5v-5H4v5h7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgTable;
