import { SVGProps } from "react";

const SvgZap = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1h2v8h8v4h-2v-2h-8V5h-2V3h2V1ZM8 7V5h2v2H8ZM6 9V7h2v2H6Zm-2 2V9h2v2H4Zm10 8v2h-2v2h-2v-8H2v-4h2v2h8v6h2Zm2-2v2h-2v-2h2Zm2-2v2h-2v-2h2Zm0 0h2v-2h-2v2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgZap;
