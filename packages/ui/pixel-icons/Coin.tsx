import { SVGProps } from "react";

const SvgCoin = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2h12v2H6V2ZM4 6V4h2v2H4Zm0 12V6H2v12h2Zm2 2v-2H4v2h2Zm12 0v2H6v-2h12Zm2-2v2h-2v-2h2Zm0-12h2v12h-2V6Zm0 0V4h-2v2h2Zm-9-1h2v2h3v2h-6v2h6v6h-3v2h-2v-2H8v-2h6v-2H8V7h3V5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCoin;
