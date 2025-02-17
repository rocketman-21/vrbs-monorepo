import { SVGProps } from "react";

const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 3H2v18h18v-4h2V7h-2V3h-2Zm0 14v2H4V5h14v2h-8v10h8Zm2-2h-8V9h8v6Zm-4-4h-2v2h2v-2Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWallet;
