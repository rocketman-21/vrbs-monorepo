import { SVGProps } from "react";

const SvgMoney = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 4H2v12h4v4h16V8h-4V4h-2Zm0 2v2H6v6H4V6h12Zm-8 4h12v8H8v-8Zm8 2h-4v4h4v-4Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMoney;
