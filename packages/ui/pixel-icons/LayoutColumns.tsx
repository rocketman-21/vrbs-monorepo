import { SVGProps } from "react";

const SvgLayoutColumns = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5h20v14H2V5Zm2 2v10h7V7H4Zm9 0v10h7V7h-7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLayoutColumns;
